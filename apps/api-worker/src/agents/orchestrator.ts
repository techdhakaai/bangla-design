import { DurableObject } from "cloudflare:workers";
import OpenAI from "openai";

interface Env {
  OPENAI_API_KEY: string;
  DB: D1Database;
  STORAGE: R2Bucket;
}

const PLANNING_PROMPT = `You are an expert web architect. Analyze the user's request and create a detailed plan for building the website.

Analyze the request and output a JSON object with this structure:
{
  "components": ["List of React components needed (e.g., Hero, Navbar, Footer, Features)"],
  "pages": ["List of pages (e.g., Home, About, Contact)"],
  "stateManagement": "Description of what state needs to be managed",
  "styling": "Tailwind CSS strategy - colors, responsive breakpoints",
  "dependencies": ["npm packages needed beyond React (e.g., lucide-react, framer-motion)"],
  "layout": "Overall layout structure description"
}

Be specific and practical. Focus on what can be built with React + Tailwind CSS.`;

const CODEGEN_PROMPT = `You are an expert React/TypeScript developer. Generate production-ready code.

RULES:
1. Use TypeScript with proper types (no 'any')
2. Use functional components with hooks
3. Style with Tailwind CSS classes only
4. Make components responsive (mobile-first)
5. Add proper error handling
6. Use semantic HTML
7. Include accessibility attributes
8. Use lucide-react for icons

OUTPUT FORMAT - Return ONLY a JSON object:
{
  "files": {
    "/src/App.tsx": "complete component code",
    "/src/components/ComponentName.tsx": "component code"
  },
  "dependencies": ["lucide-react", "framer-motion"],
  "explanation": "Brief explanation of what was built"
}

IMPORTANT:
- All components must be exported as default
- Use proper TypeScript interfaces for props
- Include 'use client' directive if using client features
- Make the design modern and professional`;

export class AIOrchestrator extends DurableObject {
  private openai: OpenAI;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async generate(prompt: string): Promise<ReadableStream> {
    const encoder = new TextEncoder();
    
    return new ReadableStream({
      start: async (controller) => {
        try {
          // Step 1: Planning
          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: "status", 
            message: "🔄 Analyzing your requirements..." 
          }) + "\n"));

          const plan = await this.createPlan(prompt);
          
          // Step 2: Code Generation
          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: "status", 
            message: "📝 Generating your website code..." 
          }) + "\n"));

          const code = await this.generateCode(prompt, plan);
          
          // Step 3: Save and return
          const projectId = crypto.randomUUID();
          await this.saveProject(projectId, code);

          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: "complete", 
            projectId,
            files: code.files 
          }) + "\n"));
          
          controller.close();
        } catch (error) {
          console.error("Generation error:", error);
          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: "error", 
            message: (error as Error).message 
          }) + "\n"));
          controller.close();
        }
      },
    });
  }

  private async createPlan(prompt: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: PLANNING_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  private async generateCode(prompt: string, plan: any): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: CODEGEN_PROMPT },
        { 
          role: "user", 
          content: `User request: ${prompt}\n\nArchitecture plan: ${JSON.stringify(plan, null, 2)}\n\nGenerate the complete code now.` 
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Add required boilerplate files
    result.files = {
      ...result.files,
      "/src/index.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
      "/src/styles.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}`,
      "/public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
    };

    return result;
  }

  private async saveProject(projectId: string, code: any) {
    await this.env.DB.prepare(`
      INSERT INTO projects (id, name, files, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `).bind(projectId, "Generated Project", JSON.stringify(code.files)).run();
  }
}
