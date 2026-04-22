import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  const { messages, topic } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const userText =
    topic && messages.length === 1
      ? `[Topic context: ${topic}]\n\n${lastMessage.content}`
      : lastMessage.content;

  const history = messages.slice(0, -1)
    .map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))
    .filter((_: unknown, i: number, arr: { role: string }[]) => i > 0 || arr[0].role === "user");

  const chat = client.chats.create({
    model: "gemini-2.5-flash",
    config: { systemInstruction: SYSTEM_PROMPT },
    history,
  });

  const parseGeminiError = (err: unknown) => {
    const parsed = (() => {
      try { return JSON.parse((err as { message?: string })?.message ?? ""); } catch { return null; }
    })();
    const code = parsed?.error?.code ?? (err as { status?: number })?.status ?? 500;
    const message = parsed?.error?.message ?? (err as { message?: string })?.message ?? "Unknown error";
    return { code: typeof code === "number" ? code : 500, message };
  };

  let result;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      result = await chat.sendMessageStream({ message: userText });
      break;
    } catch (err: unknown) {
      lastErr = err;
      const { code } = parseGeminiError(err);
      if (code === 503 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      console.error("[/api/chat] Gemini error:", err);
      const { message } = parseGeminiError(err);
      return new Response(JSON.stringify({ error: message }), {
        status: code,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  if (!result) {
    const { code, message } = parseGeminiError(lastErr);
    return new Response(JSON.stringify({ error: message }), {
      status: code,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
      } catch (err) {
        console.error("[/api/chat] Stream error:", err);
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
