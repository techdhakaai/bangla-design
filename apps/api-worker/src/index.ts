import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AIOrchestrator } from "./agents/orchestrator";

export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  KV: KVNamespace;
  AI_ORCHESTRATOR: DurableObjectNamespace<AIOrchestrator>;
  OPENAI_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use("*", cors({
  origin: ["http://localhost:3000", "https://your-frontend.pages.dev"],
  credentials: true,
}));

// Health check
app.get("/", (c) => c.json({ 
  status: "ok", 
  message: "AI Builder API",
  version: "1.0.0"
}));

// Generate endpoint
app.post("/api/generate", async (c) => {
  const { prompt, projectId } = await c.req.json();
  
  if (!prompt) {
    return c.json({ error: "Prompt is required" }, 400);
  }

  const id = c.env.AI_ORCHESTRATOR.idFromName(projectId || crypto.randomUUID());
  const orchestrator = c.env.AI_ORCHESTRATOR.get(id);

  const stream = await orchestrator.generate(prompt);
  
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});

// Get project
app.get("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE id = ?"
  ).bind(id).first();
  
  if (!result) return c.json({ error: "Not found" }, 404);
  
  return c.json({
    id: result.id,
    name: result.name,
    files: JSON.parse(result.files || "{}"),
    created_at: result.created_at,
  });
});

// Create project
app.post("/api/projects", async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  
  await c.env.DB.prepare(`
    INSERT INTO projects (id, name, description, files, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).bind(id, body.name, body.description || "", JSON.stringify(body.files || {})).run();
  
  return c.json({ id, success: true }, 201);
});

// Update project
app.put("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  
  await c.env.DB.prepare(`
    UPDATE projects 
    SET files = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(JSON.stringify(body.files), id).run();
  
  return c.json({ success: true });
});

// Export Durable Object
export { AIOrchestrator };

export default app;
