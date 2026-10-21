import { apiCatalog } from "@/lib/agent-resources";

export function GET() { return Response.json(apiCatalog(), { headers: { "Content-Type": "application/linkset+json" } }); }
