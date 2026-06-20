import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Bookmark, Check, ChevronRight, Lightbulb, X } from "lucide-react"
import { useMediumArticles, type MediumArticle } from "@/lib/medium-api"
import { useSavedItems } from "@/hooks/use-saved-items"
import { useHighlightNotes } from "@/hooks/use-highlight-notes"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// ─── Inline Highlighter ────────────────────────────────────────────────────

interface SelectionTooltipProps {
  x: number
  y: number
  onAttach: () => void
}

function SelectionTooltip({ x, y, onAttach, tooltipRef }: SelectionTooltipProps & { tooltipRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={tooltipRef}
      style={{ left: x, top: y }}
      className="fixed z-50 -translate-x-1/2 -translate-y-full -mt-2 pointer-events-auto"
    >
      <button
        data-testid="attach-thought-btn"
        onMouseDown={(e) => { e.preventDefault(); onAttach() }}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 shadow-lg rounded-full hover:bg-primary/90 transition-colors"
      >
        <Lightbulb className="w-3 h-3" />
        Attach Thought
      </button>
      <div className="w-2 h-2 bg-primary rotate-45 mx-auto -mt-1" />
    </div>
  )
}

interface AttachThoughtPanelProps {
  quote: string
  onSave: (note: string) => void
  onCancel: () => void
  saving: boolean
}

function AttachThoughtPanel({ quote, onSave, onCancel, saving }: AttachThoughtPanelProps) {
  const [note, setNote] = useState("")

  return (
    <div className="my-4 border border-primary/30 bg-primary/[0.03] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="border-l-2 border-primary/60 pl-3">
          <p className="text-[11px] font-medium text-primary/70 uppercase tracking-wide mb-1">Selected passage</p>
          <p className="text-sm text-foreground/70 italic leading-relaxed line-clamp-3">"{quote}"</p>
        </div>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <Textarea
        autoFocus
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your thought on this passage..."
        className="text-sm min-h-[80px] resize-none bg-background border-border placeholder:text-muted-foreground/60"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={!note.trim() || saving}
          onClick={() => onSave(note.trim())}
          className="h-8 text-xs font-medium"
        >
          {saving ? "Saving..." : "Save thought"}
        </Button>
        <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Article paragraphs with selection support ─────────────────────────────

const ARTICLE_PARAGRAPHS = [
  "In astrophysics, every stellar body has a decay constant — a measurable rate at which it loses energy, collapses inward, or transforms. The observable universe does not negotiate with entropy. Neither does your life.",
  "The practitioner who believes their systems are immune to decay has already begun the collapse process. Awareness is the first instrument. Without measurement, you cannot intervene at the correct temporal window.",
  "Most execution failures are not motivational failures. They are architectural ones. The structure crumbled before the operator ever stepped inside. A system built on assumption will decay faster than one built on observation.",
  "What separates the practitioner from the amateur is not talent. It is the willingness to sit with accurate data — even when that data confirms what you feared. The decay constant does not lie. It only reports.",
  "Your most productive hours are not distributed evenly across the day. They cluster. Identifying those clusters and protecting them from ambient noise is not discipline — it is engineering. You are building a precision instrument, not a general-use tool.",
  "The output of your system is the only real measurement. Intent is a variable. Output is a constant you can audit, compare, and refine. Build toward output. Protect output. Archive output. Everything else is commentary.",
]

interface ArticleDetailProps {
  article: MediumArticle
  onBack: () => void
}

function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const { isSaved, toggleSave } = useSavedItems()
  const { addNote } = useHighlightNotes()
  const saved = isSaved("record", article.id)

  const [tooltip, setTooltip] = useState<{ x: number; y: number; quote: string } | null>(null)
  const [attachingQuote, setAttachingQuote] = useState<string | null>(null)
  const [savingNote, setSavingNote] = useState(false)
  const [savedQuotes, setSavedQuotes] = useState<Set<string>>(new Set())
  const contentRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setTooltip(null)
      return
    }
    const quote = sel.toString().trim()
    if (quote.length < 10) { setTooltip(null); return }

    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    // rect.top is viewport-relative; fixed positioning uses viewport coords directly
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top, quote })
  }, [])

  useEffect(() => {
    const dismiss = (e: MouseEvent) => {
      const target = e.target as Node
      const inContent = contentRef.current?.contains(target)
      const inTooltip = tooltipRef.current?.contains(target)
      if (!inContent && !inTooltip) {
        setTooltip(null)
      }
    }
    document.addEventListener("mousedown", dismiss)
    return () => document.removeEventListener("mousedown", dismiss)
  }, [])

  const handleAttach = () => {
    if (!tooltip) return
    setAttachingQuote(tooltip.quote)
    setTooltip(null)
    window.getSelection()?.removeAllRanges()
  }

  const handleSaveNote = async (note: string) => {
    if (!attachingQuote) return
    setSavingNote(true)
    await addNote(article.id, article.title, attachingQuote, note)
    setSavedQuotes((prev) => new Set(prev).add(attachingQuote))
    setSavingNote(false)
    setAttachingQuote(null)
  }

  return (
    <div className="pb-20">
      <div className="px-5 pt-4 pb-2">
        <button
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          Back to records
        </button>
      </div>

      <div className="px-5 mb-4">
        <button className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors">
          <Play className="w-3 h-3" />
          <span>Listen ({article.readTime} min)</span>
        </button>
      </div>

      <article className="px-5 max-w-prose mx-auto" ref={contentRef}>
        <h1 className="text-xl font-semibold tracking-tight leading-snug text-foreground mb-2">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="text-sm text-muted-foreground mb-6">{article.subtitle}</p>
        )}

        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
          <span className="text-[10px] font-medium text-primary/70 uppercase tracking-wide bg-primary/10 px-2 py-0.5 rounded-full">
            Select any passage to attach a thought
          </span>
        </div>

        <div onMouseUp={handleMouseUp} className="select-text space-y-0">
          {ARTICLE_PARAGRAPHS.map((para, i) => {
            const isHighlighted = savedQuotes.has(para)
            return (
              <p
                key={i}
                className={`text-[15px] leading-[1.85] text-foreground mb-5 cursor-text transition-colors ${
                  isHighlighted ? "bg-primary/8 -mx-1 px-1 rounded" : ""
                } ${i === 0 ? "first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none" : ""}`}
              >
                {para}
              </p>
            )
          })}
          {attachingQuote && (
            <AttachThoughtPanel
              quote={attachingQuote}
              onSave={handleSaveNote}
              onCancel={() => setAttachingQuote(null)}
              saving={savingNote}
            />
          )}
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Continue reading the full essay on Medium. Highlighted passages and thoughts are saved to your library.
          </p>
        </div>
      </article>

      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => toggleSave("record", article.id, article.title, { readTime: article.readTime })}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
              saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? "Saved" : "Save entry"}</span>
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Read on Medium
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {tooltip && (
        <SelectionTooltip x={tooltip.x} y={tooltip.y} onAttach={handleAttach} tooltipRef={tooltipRef} />
      )}
    </div>
  )
}

// ─── Feed ──────────────────────────────────────────────────────────────────

export function HumanRecords() {
  const { articles, isLoading } = useMediumArticles()
  const [selected, setSelected] = useState<MediumArticle | null>(null)
  const { isSaved, toggleSave } = useSavedItems()

  if (selected) {
    return <ArticleDetail article={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">Human Records</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Essays and field notes from the operator workspace
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {isLoading && [1, 2, 3].map((n) => (
          <div key={n} className="border border-border bg-card h-24 animate-pulse" />
        ))}
        {!isLoading && articles.map((article) => {
          const saved = isSaved("record", article.id)
          return (
            <div key={article.id} className="relative border border-border bg-card hover:border-primary/30 transition-colors">
              <button
                onClick={() => setSelected(article)}
                className="w-full text-left px-4 py-3 pr-10"
              >
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                  <span>{article.publishedAt}</span>
                  <span>·</span>
                  <span>{article.readTime} min read</span>
                </div>
                <h2 className="text-sm font-medium text-foreground leading-snug mb-1">{article.title}</h2>
                {article.subtitle && (
                  <p className="text-xs text-muted-foreground mb-2">{article.subtitle}</p>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{article.excerpt}</p>
              </button>
              <button
                onClick={() => toggleSave("record", article.id, article.title, { readTime: article.readTime })}
                className={`absolute top-3 right-3 p-1 transition-colors ${
                  saved ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
                aria-label={saved ? "Remove from library" : "Save to library"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-primary" : ""}`} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
