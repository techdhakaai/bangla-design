import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code, Zap, Globe, Palette } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">AI Builder</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/new">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Powered by GPT-4</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Build Websites with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Describe what you want, and let AI generate a complete, production-ready 
            React website with TypeScript and Tailwind CSS.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/new">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Start Building Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
            <p className="text-muted-foreground">
              Describe your vision in plain English and watch it come to life in seconds.
            </p>
          </div>
          
          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Production Code</h3>
            <p className="text-muted-foreground">
              Get clean, TypeScript React code with Tailwind CSS styling.
            </p>
          </div>
          
          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Preview</h3>
            <p className="text-muted-foreground">
              See your website come to life in real-time as you build.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Describe", desc: "Tell AI what you want to build", icon: Palette },
              { step: "2", title: "Generate", desc: "AI creates your website code", icon: Sparkles },
              { step: "3", title: "Preview", desc: "See it live instantly", icon: Zap },
              { step: "4", title: "Deploy", desc: "Publish to the web", icon: Globe },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-sm font-medium text-primary mb-1">Step {item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Built with AI. Deployed on Cloudflare.</p>
        </div>
      </footer>
    </div>
  );
}
