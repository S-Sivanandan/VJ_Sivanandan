import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface SavedItem {
  id: string
  item_type: "record" | "sheet"
  item_id: string
  item_title: string
  item_meta: Record<string, unknown>
  created_at: string
}

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = useCallback(async () => {
    const { data } = await supabase
      .from("saved_items")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setSavedItems(data as SavedItem[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSaved()
  }, [fetchSaved])

  const isSaved = useCallback(
    (itemType: "record" | "sheet", itemId: string) =>
      savedItems.some((s) => s.item_type === itemType && s.item_id === itemId),
    [savedItems]
  )

  const toggleSave = useCallback(
    async (
      itemType: "record" | "sheet",
      itemId: string,
      itemTitle: string,
      itemMeta: Record<string, unknown> = {}
    ) => {
      const already = savedItems.find(
        (s) => s.item_type === itemType && s.item_id === itemId
      )
      if (already) {
        await supabase.from("saved_items").delete().eq("id", already.id)
        setSavedItems((prev) => prev.filter((s) => s.id !== already.id))
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data, error } = await supabase
          .from("saved_items")
          .insert({ user_id: user.id, item_type: itemType, item_id: itemId, item_title: itemTitle, item_meta: itemMeta })
          .select()
          .single()
        if (!error && data) setSavedItems((prev) => [data as SavedItem, ...prev])
      }
    },
    [savedItems]
  )

  return { savedItems, loading, isSaved, toggleSave, refetch: fetchSaved }
}
