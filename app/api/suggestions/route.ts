export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.length < 1) {
    return Response.json({ suggestions: [] })
  }

  try {
    // Use a words list API to get suggestions
    const response = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(query)}&max=8`)

    if (!response.ok) {
      return Response.json({ suggestions: [] })
    }

    const data = await response.json()
    const suggestions = data.map((item: any) => item.word)
    return Response.json({ suggestions })
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    return Response.json({ suggestions: [] })
  }
}
