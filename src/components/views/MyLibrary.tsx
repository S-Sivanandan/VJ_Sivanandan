import { BookOpen, Grid3X3, Trash2, MessageSquareQuote, Bookmark } from "lucide-react"
import { useSavedItems } from "@/hooks/use-saved-items"
import { useHighlightNotes } from "@/hooks/use-highlight-notes"

export function MyLibrary() {
  const { savedItems, loading: savedLoading, toggleSave } = useSavedItems()
  const { notes, loading: notesLoading, removeNote } = useHighlightNotes()

  const records = savedItems.filter((s) => s.item_type === "record")
  const sheets = savedItems.filter((s) => s.item_type === "sheet")
  const loading = savedLoading || notesLoading
  const isEmpty = !loading && savedItems.length === 0 && notes.length === 0

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">My Library</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Saved records, sheets &amp; highlighted thoughts
        </p>
      </div>

      {loading && (
        <div className="px-5 py-8 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isEmpty && (
        <div className="px-5 py-12 flex flex-col items-center gap-3 text-center">
          <Bookmark className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Nothing saved yet</p>
          <p className="text-xs text-muted-foreground/70 max-w-[220px]">
            Bookmark articles, save sheets, or attach thoughts to passages in Human Records.
          </p>
        </div>
      )}

      {/* Highlight notes */}
      {!notesLoading && notes.length > 0 && (
        <Section title="Attached Thoughts" count={notes.length} Icon={MessageSquareQuote}>
          {notes.map((note) => (
            <div key={note.id} className="border border-border bg-card px-4 py-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {note.article_title}
                  </p>
                </div>
                <button
                  onClick={() => removeNote(note.id)}
                  className="shrink-0 p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                  aria-label="Remove note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="border-l-2 border-primary/40 pl-3">
                <p className="text-xs text-muted-foreground/80 italic leading-relaxed line-clamp-2">
                  "{note.quote}"
                </p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{note.note}</p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Saved records */}
      {!savedLoading && records.length > 0 && (
        <Section title="Saved Records" count={records.length} Icon={BookOpen}>
          {records.map((item) => (
            <LibraryRow
              key={item.id}
              title={item.item_title}
              id={item.item_id}
              date={item.created_at}
              onRemove={() => toggleSave("record", item.item_id, item.item_title)}
            />
          ))}
        </Section>
      )}

      {/* Saved sheets */}
      {!savedLoading && sheets.length > 0 && (
        <Section title="Saved Sheets" count={sheets.length} Icon={Grid3X3}>
          {sheets.map((item) => (
            <LibraryRow
              key={item.id}
              title={item.item_title}
              id={item.item_id}
              date={item.created_at}
              meta={(item.item_meta as { pages?: number })?.pages
                ? `${(item.item_meta as { pages?: number }).pages}p`
                : undefined}
              onRemove={() => toggleSave("sheet", item.item_id, item.item_title)}
            />
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  count,
  Icon,
  children,
}: {
  title: string
  count: number
  Icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function LibraryRow({
  title,
  id,
  date,
  meta,
  onRemove,
}: {
  title: string
  id: string
  date: string
  meta?: string
  onRemove: () => void
}) {
  const savedDate = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return (
    <div className="border border-border bg-card px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono text-muted-foreground">{id}</span>
          {meta && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[10px] text-muted-foreground">{meta}</span>
            </>
          )}
          <span className="text-muted-foreground/40">·</span>
          <span className="text-[10px] text-muted-foreground">Saved {savedDate}</span>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors"
        aria-label="Remove"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
