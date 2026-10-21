import { skillsIndex } from "@/lib/agent-resources";

export function GET() { return Response.json(skillsIndex()); }
