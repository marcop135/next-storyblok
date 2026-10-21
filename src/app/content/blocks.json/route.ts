import { blockCatalog } from "@/lib/agent-resources";

export function GET() { return Response.json(blockCatalog()); }
