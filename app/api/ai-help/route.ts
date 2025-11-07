import { streamText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[v0] Sending request to Groq AI model with message:", message.substring(0, 50))

    const apiKey = "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"

    const groq = createGroq({
      apiKey: apiKey,
    })

    const { textStream } = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are an expert English language tutor and writing assistant. Help users with:
- Grammar corrections and explanations
- Vocabulary and word usage
- Writing improvement suggestions
- Pronunciation guidance
- Common English mistakes
- Language learning tips

Be concise, friendly, and educational. When correcting, always explain why.`,
      prompt: message,
    })

    // Convert textStream to a ReadableStream response
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(customStream, {
      headers: { "Content-Type": "text/event-stream" },
    })
  } catch (error) {
    console.log("[v0] Error in AI help:", error instanceof Error ? error.message : String(error))
    console.error("AI Help Error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
