"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Share2, Bookmark } from "lucide-react"
import WordCard from "@/components/word-card"

export default function WordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const word = params.word as string
  const [wordData, setWordData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (!word) return

    const fetchWord = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}`)
        if (!response.ok) {
          setError("Word not found")
          setWordData(null)
          return
        }
        const data = await response.json()
        setWordData(data)
        setError(null)

        // Check if word is bookmarked
        const bookmarks = JSON.parse(localStorage.getItem("bookmarkedWords") || "[]")
        setIsBookmarked(bookmarks.includes(word.toLowerCase()))
      } catch (err) {
        setError("Failed to load word details")
      } finally {
        setLoading(false)
      }
    }

    fetchWord()
  }, [word])

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedWords") || "[]")
    if (isBookmarked) {
      const index = bookmarks.indexOf(word.toLowerCase())
      if (index > -1) {
        bookmarks.splice(index, 1)
      }
    } else {
      bookmarks.push(word.toLowerCase())
    }
    localStorage.setItem("bookmarkedWords", JSON.stringify(bookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/word/${word}`
    if (navigator.share) {
      navigator.share({
        title: wordData?.word,
        text: `Check out the definition of "${wordData?.word}"`,
        url: url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }`}
                aria-label="Bookmark word"
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                aria-label="Share word"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-12">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive rounded-lg p-4">{error}</div>
        )}

        {wordData && <WordCard word={wordData} />}
      </div>
    </main>
  )
}
