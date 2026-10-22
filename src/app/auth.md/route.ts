import { authMarkdown } from "@/lib/agent-resources";

export function GET() { return new Response(authMarkdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } }); }
