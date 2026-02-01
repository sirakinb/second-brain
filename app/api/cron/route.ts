export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GATEWAY_URL = "http://127.0.0.1:18789";
const GATEWAY_TOKEN = "dfb92834b59be8360f0b3143b21d8843af7ea8341ae47d850b1c4b29aa01525b";

export async function GET() {
  try {
    const response = await fetch(`${GATEWAY_URL}/tools/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GATEWAY_TOKEN}`,
      },
      body: JSON.stringify({
        tool: "cron",
        action: "list",
        args: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway responded with ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error?.message || "Gateway request failed");
    }

    return Response.json(data.result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to list cron jobs:", message);

    return Response.json(
      {
        error: message,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
