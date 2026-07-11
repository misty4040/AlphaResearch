import { appGraph } from "@/lib/agent/graph";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();
    if (!companyName) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const config = { 
            configurable: { 
              thread_id: "1",
              onToken: (token: string) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "stream", content: token })}\n\n`));
              }
            } 
          };
          const streamResult = await appGraph.stream({ companyName }, config);
          
          for await (const chunk of streamResult) {
            for (const [nodeName, nodeState] of Object.entries(chunk)) {
               const logs = (nodeState as any).logs || [];
               for (const log of logs) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "log", node: nodeName, message: log })}\n\n`));
               }
               if (nodeName === "fetch_financials") {
                 controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "financials", financials: (nodeState as any).financials })}\n\n`));
               }
               if (nodeName === "fetch_price_history") {
                 controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "price_history", priceHistory: (nodeState as any).priceHistory })}\n\n`));
               }
               if (nodeName === "fetch_news") {
                 controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "news", news: (nodeState as any).news })}\n\n`));
               }
               if (nodeName === "analyze") {
                 controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "analysis", report: (nodeState as any).analysis })}\n\n`));
               }
               if (nodeName === "decide") {
                 controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "decision", verdict: (nodeState as any).decision, confidence: (nodeState as any).confidenceScore, rationale: (nodeState as any).reasoning })}\n\n`));
               }
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (error: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
