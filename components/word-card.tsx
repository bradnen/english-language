"use client"

import { Volume2, BookOpen } from "lucide-react"

interface WordCardProps {
  word: any
}

export default function WordCard({ word }: WordCardProps) {
  const handlePronounce = () => {
    if (word.phonetics?.[0]?.audio) {
      const audio = new Audio(word.phonetics[0].audio)
      audio.play()
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-8 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold text-primary mb-2">{word.word}</h2>
          {word.phonetic && <p className="text-lg text-secondary">{word.phonetic}</p>}
        </div>
        {word.phonetics?.[0]?.audio && (
          <button
            onClick={handlePronounce}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            aria-label="Play pronunciation"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        )}
      </div>

      {word.meanings?.map((meaning: any, idx: number) => (
        <div key={idx} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-semibold text-secondary italic">{meaning.partOfSpeech}</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Meaning
            </h3>
            <ul className="space-y-2">
              {meaning.definitions?.slice(0, 3).map((def: any, i: number) => (
                <li key={i} className="text-foreground ml-6 list-disc">
                  {def.definition}
                  {def.example && <p className="text-muted-foreground italic mt-1">"{def.example}"</p>}
                </li>
              ))}
            </ul>
          </div>

          {meaning.synonyms?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {meaning.synonyms.slice(0, 5).map((synonym: string) => (
                  <button
                    key={synonym}
                    onClick={() => {
                      window.location.href = `/word/${synonym.toLowerCase()}`
                    }}
                    className="px-3 py-1 bg-muted text-foreground hover:bg-primary hover:text-primary-foreground rounded-full text-sm transition-colors cursor-pointer"
                  >
                    {synonym}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {word.sourceUrls?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Source</p>
          <a
            href={word.sourceUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline text-sm break-all"
          >
            {word.sourceUrls[0]}
          </a>
        </div>
      )}
    </div>
  )
}
