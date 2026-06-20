import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface HighlightNote {
  id: string
  article_id: string
  article_title: string
  quote: string
  note: string
  created_at: string
}

export function useHighlightNotes() {
  const [notes, setNotes] = useState<HighlightNote[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from("highlight_notes")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setNotes(data as HighlightNote[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addNote = useCallback(async (
    articleId: string,
    articleTitle: string,
    quote: string,
    note: string
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data, error } = await supabase
      .from("highlight_notes")
      .insert({ user_id: user.id, article_id: articleId, article_title: articleTitle, quote, note })
      .select()
      .single()
    if (!error && data) {
      setNotes((prev) => [data as HighlightNote, ...prev])
      return data as HighlightNote
    }
    return null
  }, [])

  const removeNote = useCallback(async (id: string) => {
    await supabase.from("highlight_notes").delete().eq("id", id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notes, loading, addNote, removeNote, refetch: fetch }
}
