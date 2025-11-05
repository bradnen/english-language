export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get("word")

  if (!word) {
    return Response.json({ error: "Word parameter required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

    if (!response.ok) {
      return Response.json({ error: "Word not found" }, { status: 404 })
    }

    const data = await response.json()
    return Response.json(data[0])
  } catch (error) {
    return Response.json({ error: "Failed to fetch word definition" }, { status: 500 })
  }
}
