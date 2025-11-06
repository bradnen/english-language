import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    console.log("[v0] API Key exists:", !!apiKey)
    console.log("[v0] API Key starts with:", apiKey?.substring(0, 10) || "NOT SET")

    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini", { apiKey }),
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

    return Response.json({ response: text })
  } catch (error) {
    console.error("AI Help Error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
