"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BookmarksPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = JSON.parse(localStorage.getItem("bookmarkedWords") || "[]")
    setBookmarks(saved)
    setLoading(false)
  }, [])

  const removeBookmark = (word: string) => {
    const updated = bookmarks.filter((w) => w !== word)
    setBookmarks(updated)
    localStorage.setItem("bookmarkedWords", JSON.stringify(updated))
  }

  const clearAllBookmarks = () => {
    if (confirm("Are you sure you want to clear all bookmarks?")) {
      setBookmarks([])
      localStorage.setItem("bookmarkedWords", JSON.stringify([]))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-primary">My Bookmarks</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {bookmarks.length} word{bookmarks.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">No bookmarks yet. Start bookmarking words to see them here!</p>
            <Link href="/" className="text-primary hover:underline">
              Return to dictionary
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Saved Words</h2>
              <button onClick={clearAllBookmarks} className="text-sm text-destructive hover:underline">
                Clear all
              </button>
            </div>
            <div className="grid gap-3">
              {bookmarks.map((word) => (
                <div
                  key={word}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors group"
                >
                  <Link href={`/word/${word}`} className="flex-1">
                    <span className="text-lg font-semibold text-primary capitalize group-hover:underline">{word}</span>
                  </Link>
                  <button
                    onClick={() => removeBookmark(word)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-4"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
