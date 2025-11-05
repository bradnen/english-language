"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Bookmark } from "lucide-react"
import SearchBar from "@/components/search-bar"
import WordCard from "@/components/word-card"
import FeaturedWords from "@/components/featured-words"

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (word: string) => {
    if (!word.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}`)
      if (!response.ok) {
        setError("Word not found. Try another search.")
        setSelectedWord(null)
        return
      }
      const data = await response.json()
      setSelectedWord(data)
    } catch (error) {
      console.error("Error fetching word:", error)
      setError("Failed to fetch word definition. Please try again.")
      setSelectedWord(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-primary">English Language</h1>
              <p className="text-muted-foreground text-sm mt-1">Explore words, meanings, and usage examples</p>
            </div>
            <Link
              href="/bookmarks"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
              title="View bookmarked words"
            >
              <Bookmark className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Bookmarks</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {selectedWord && (
          <div>
            <Link href={`/word/${selectedWord.word}`}>
              <WordCard word={selectedWord} />
            </Link>
          </div>
        )}

        {!selectedWord && !loading && !error && <FeaturedWords onSelectWord={handleSearch} />}
      </div>
    </main>
  )
}
