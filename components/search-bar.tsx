"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (word: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length < 1) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoadingSuggestions(true)
      try {
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(input)}`)
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(data.suggestions.length > 0)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }

    const timer = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(timer)
  }, [input])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (word: string) => {
    setInput(word)
    onSearch(word)
    setShowSuggestions(false)
  }

  return (
    <div className="relative mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for a word..."
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10"
        >
          {suggestions.map((word) => (
            <button
              key={word}
              onClick={() => handleSuggestionClick(word)}
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {loadingSuggestions && input.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 p-3">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading suggestions...</span>
          </div>
        </div>
      )}
    </div>
  )
}
