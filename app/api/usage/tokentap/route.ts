import { getTokentapHistory } from "@/lib/tokentap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getTokentapHistory();
  return Response.json(data);
}
