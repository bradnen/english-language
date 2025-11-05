"use client"

interface FeaturedWordsProps {
  onSelectWord: (word: string) => void
}

export default function FeaturedWords({ onSelectWord }: FeaturedWordsProps) {
  const featuredWords = [
    {
      word: "serendipity",
      definition: "The occurrence of events by chance in a happy or beneficial way",
    },
    {
      word: "eloquent",
      definition: "Fluent or persuasive in speaking or writing",
    },
    {
      word: "ephemeral",
      definition: "Lasting for a very short time",
    },
    {
      word: "ubiquitous",
      definition: "Present, appearing, or found everywhere",
    },
    {
      word: "sanguine",
      definition: "Optimistic or positive, especially in an inappropriate way",
    },
    {
      word: "ameliorate",
      definition: "To make something better or more tolerable",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Featured Words</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredWords.map((item) => (
          <button
            key={item.word}
            onClick={() => onSelectWord(item.word)}
            className="text-left p-4 bg-card border border-border rounded-lg hover:border-primary hover:bg-muted transition-all"
          >
            <h3 className="font-semibold text-primary mb-2">{item.word}</h3>
            <p className="text-sm text-muted-foreground">{item.definition}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
