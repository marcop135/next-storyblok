import { openApi } from "@/lib/agent-resources";

export function GET() { return Response.json(openApi()); }
