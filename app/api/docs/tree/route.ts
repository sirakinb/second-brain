import { getDocTree } from "@/lib/docs";

export async function GET() {
  const tree = await getDocTree();
  return Response.json({ tree });
}
