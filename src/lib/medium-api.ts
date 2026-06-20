import { useState, useEffect } from "react"

export interface MediumArticle {
  id: string
  title: string
  subtitle?: string
  excerpt: string
  publishedAt: string
  readTime: number
  url: string
}

// Fallback articles if the edge function is unreachable
const FALLBACK_ARTICLES: MediumArticle[] = [
  {
    id: "fallback-001",
    title: "The Decay Constant: Why Most Systems Collapse Before Execution",
    subtitle: "A framework from astrophysics for personal productivity",
    excerpt: "In astrophysics, every stellar body has a decay constant — a measurable rate at which it loses energy, collapses inward, or transforms. The observable universe does not negotiate with entropy. Neither does your life.",
    publishedAt: "2025-03-15",
    readTime: 8,
    url: "https://medium.com/@vj_sivanandan",
  },
  {
    id: "fallback-002",
    title: "Temporal Anchoring: Building Execution Windows That Don't Drift",
    subtitle: "Why motivation is a variable, but time-blocking is a constant",
    excerpt: "The practitioner who relies on motivation will find their systems disintegrate at the exact moment they need them most. Motivation is chemistry — volatile, unpredictable, and subject to entropy. Time is geometry.",
    publishedAt: "2025-04-22",
    readTime: 6,
    url: "https://medium.com/@vj_sivanandan",
  },
  {
    id: "fallback-003",
    title: "The Output Compression Method: Defining Singular Deliverables",
    subtitle: "How to prevent drift by compressing multi-phase goals into single-session outputs",
    excerpt: "If you cannot define the singular output of today's session in 10 words or fewer, the session has no executable boundary. Boundaries are what prevent drift into the ambient noise of daily existence.",
    publishedAt: "2025-05-10",
    readTime: 5,
    url: "https://medium.com/@vj_sivanandan",
  },
]

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medium-feed`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export async function fetchMediumArticles(): Promise<MediumArticle[]> {
  try {
    const response = await fetch(EDGE_URL, {
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Feed request failed (${response.status})`)
    }

    const json = await response.json()

    if (!Array.isArray(json.articles) || json.articles.length === 0) {
      return FALLBACK_ARTICLES
    }

    return json.articles as MediumArticle[]
  } catch {
    return FALLBACK_ARTICLES
  }
}

export function useMediumArticles() {
  const [articles, setArticles] = useState<MediumArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchMediumArticles()
      .then((data) => {
        if (!cancelled) {
          setArticles(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load articles")
          setArticles(FALLBACK_ARTICLES)
          setIsLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  return { articles, isLoading, error }
}
