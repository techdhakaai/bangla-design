"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import Editor from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, FileCode, Play, MessageSquare, Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface StreamMessage {
  type: "status" | "complete" | "error";
  message?: string;
  projectId?: string;
  files?: Record<string, string>;
}

export default function BuilderPage() {
  const { projectId } = useParams();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("/src/App.tsx");
  const [streamMessages, setStreamMessages] = useState<string[]>([]);

  useEffect(() => {
    // Load existing project if any
    if (projectId) {
      fetch(`${API_URL}/api/projects/${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (data.files) {
            setFiles(data.files);
          }
        })
        .catch(console.error);
    }
  }, [projectId]);

  const generate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setStreamMessages([]);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, projectId }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(Boolean);
          
          for (const line of lines) {
            try {
              const data: StreamMessage = JSON.parse(line);
              if (data.type === "status" && data.message) {
                setStreamMessages(prev => [...prev, data.message!]);
              } else if (data.type === "complete" && data.files) {
                setFiles(data.files);
              } else if (data.type === "error" && data.message) {
                setStreamMessages(prev => [...prev, `Error: ${data.message}`]);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setStreamMessages(prev => [...prev, "Failed to generate. Please try again."]);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateFile = (path: string, content: string | undefined) => {
    if (content) {
      setFiles(prev => ({ ...prev, [path]: content }));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-4 gap-4 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">AI Builder</span>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-muted-foreground text-sm truncate max-w-[200px]">
          {projectId ? `Project: ${projectId.slice(0, 8)}...` : "New Project"}
        </span>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="h-full flex flex-col border-r">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </h2>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {streamMessages.length === 0 && (
                  <div className="text-muted-foreground text-sm space-y-2">
                    <p>Describe the website you want to build...</p>
                    <div className="p-3 bg-muted rounded-lg text-xs">
                      <p className="font-medium mb-1">Example prompts:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Create a landing page for a coffee shop</li>
                        <li>Build a portfolio website with hero, about, and contact sections</li>
                        <li>Make a SaaS pricing page with three tiers</li>
                      </ul>
                    </div>
                  </div>
                )}
                {streamMessages.map((msg, i) => (
                  <div key={i} className="text-sm p-2 bg-muted rounded">
                    {msg}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t space-y-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a landing page for a coffee shop..."
                className="min-h-[100px] resize-none"
              />
              <Button 
                onClick={generate} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Code Editor */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full flex flex-col border-r">
            <div className="flex items-center gap-1 p-2 border-b bg-muted/50 overflow-x-auto">
              {Object.keys(files).length > 0 ? (
                Object.keys(files).map((path) => (
                  <button
                    key={path}
                    onClick={() => setActiveFile(path)}
                    className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      activeFile === path 
                        ? "bg-background text-foreground shadow-sm border" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    {path.split("/").pop()}
                  </button>
                ))
              ) : (
                <span className="text-xs text-muted-foreground px-2">
                  No files yet
                </span>
              )}
            </div>
            
            <div className="flex-1">
              {files[activeFile] ? (
                <Editor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={files[activeFile]}
                  onChange={(value) => updateFile(activeFile, value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Generated code will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Preview */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="p-2 border-b bg-muted/50 flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex-1 bg-white">
              {Object.keys(files).length > 0 ? (
                <SandpackProvider
                  template="react-ts"
                  files={files}
                  options={{
                    externalResources: ["https://cdn.tailwindcss.com"],
                    autoReload: true,
                  }}
                >
                  <SandpackPreview 
                    style={{ height: "100%" }}
                    showOpenInCodeSandbox={false}
                  />
                </SandpackProvider>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground bg-background">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
