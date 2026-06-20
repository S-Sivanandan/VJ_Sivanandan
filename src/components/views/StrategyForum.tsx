import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type Classification = "decay_spike" | "systemic_friction" | "baseline_failure"

interface FrictionPoint {
  id: string
  issue: string
  classification: Classification | null
  status: "pending" | "resolved"
  response: string | null
  created_at: string
}

const CLASSIFICATIONS: { value: Classification; label: string; desc: string }[] = [
  {
    value: "decay_spike",
    label: "Decay Spike",
    desc: "Sudden acute collapse of an otherwise stable system",
  },
  {
    value: "systemic_friction",
    label: "Systemic Friction",
    desc: "Persistent structural drag slowing execution across domains",
  },
  {
    value: "baseline_failure",
    label: "Baseline Failure",
    desc: "Core protocol not meeting minimum viable execution threshold",
  },
]

function classificationLabel(val: Classification | null): string {
  return CLASSIFICATIONS.find((c) => c.value === val)?.label ?? "Unclassified"
}

function ClassificationBadge({ value }: { value: Classification | null }) {
  if (!value) return null
  const label = classificationLabel(value)
  return (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full border border-primary/20 tracking-wide uppercase">
      {label}
    </span>
  )
}

function oigLabel(index: number) {
  return `OIG-${String(index + 1).padStart(3, "0")}`
}

export function StrategyForum() {
  const [issue, setIssue] = useState("")
  const [classification, setClassification] = useState<Classification | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedContent, setSubmittedContent] = useState("")
  const [submittedClass, setSubmittedClass] = useState<Classification | null>(null)
  const [entries, setEntries] = useState<FrictionPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadEntries() }, [])

  async function loadEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from("friction_points")
      .select("id, issue, classification, status, response, created_at")
      .order("created_at", { ascending: true })
    if (error) setError("Failed to load entries")
    else setEntries((data ?? []) as FrictionPoint[])
    setLoading(false)
  }

  const canSubmit = issue.trim().length > 0 && classification !== null && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    const { data, error } = await supabase
      .from("friction_points")
      .insert({ issue: issue.trim(), classification })
      .select()
      .single()

    if (error) {
      setError("Failed to submit. Please try again.")
      setSubmitting(false)
      return
    }

    setSubmittedContent(issue.trim())
    setSubmittedClass(classification)
    setIssue("")
    setClassification(null)
    setSubmitted(true)
    setEntries((prev) => [...prev, data as FrictionPoint])
    setSubmitting(false)
  }

  const handleNew = () => {
    setSubmitted(false)
    setSubmittedContent("")
    setSubmittedClass(null)
  }

  const resolved = entries.filter((e) => e.status === "resolved")
  const pending = entries.filter((e) => e.status === "pending")

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">Strategy Forum</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Submit friction points for strategic refinement
        </p>
      </div>

      <div className="px-5 py-4 space-y-6">
        {/* Submission form */}
        {!submitted ? (
          <div className="space-y-4">
            {/* Friction classification selector */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">
                Select Friction Classification
              </p>
              <div className="flex flex-col gap-2">
                {CLASSIFICATIONS.map((cls) => {
                  const active = classification === cls.value
                  return (
                    <button
                      key={cls.value}
                      onClick={() => setClassification(active ? null : cls.value)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 border text-left transition-all",
                        active
                          ? "border-primary bg-primary/[0.06] text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40"
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0 transition-colors",
                          active ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "text-xs font-semibold uppercase tracking-wider block",
                          active ? "text-primary" : "text-foreground"
                        )}>
                          {cls.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                          {cls.desc}
                        </span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-foreground block mb-2">
                Describe the friction or system failure
              </label>
              <Textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Be specific about the system, context, and observable symptoms..."
                className="text-sm border-border min-h-[120px] resize-none bg-background placeholder:text-muted-foreground leading-relaxed"
              />
            </div>

            {/* Validation hint */}
            {!classification && issue.trim().length > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Select a friction classification above to enable submission.
              </p>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-10 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-30 transition-opacity"
            >
              <ChevronRight className="w-4 h-4 mr-1" />
              {submitting ? "Submitting..." : "Request Strategic Refinement"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Issue submitted</span>
            </div>
            <div className="border border-border bg-muted/40 px-4 py-3 space-y-2">
              <ClassificationBadge value={submittedClass} />
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{submittedContent}"</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Strategic refinement has been queued. Review past issues below for framework patterns.
            </p>
            <Button onClick={handleNew} variant="outline" className="h-9 text-sm border-border">
              Submit another issue
            </Button>
          </div>
        )}

        {/* Pending entries */}
        {pending.length > 0 && (
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Pending Refinement
              </span>
              <span className="text-xs text-muted-foreground">{pending.length} entries</span>
            </div>
            <div className="space-y-3">
              {pending.map((entry) => (
                <div key={entry.id} className="border border-border bg-card">
                  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground font-mono">{oigLabel(entries.indexOf(entry))}</span>
                    <div className="flex items-center gap-2">
                      <ClassificationBadge value={entry.classification} />
                      <span className="text-xs text-muted-foreground font-medium">Pending</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{entry.issue}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved entries */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Resolved Issues
            </span>
            <span className="text-xs text-muted-foreground">{loading ? "..." : `${resolved.length} entries`}</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="border border-border bg-card h-24 animate-pulse" />
              ))}
            </div>
          ) : resolved.length === 0 ? (
            <p className="text-xs text-muted-foreground">No resolved issues yet. Submit a friction point above.</p>
          ) : (
            <div className="space-y-4">
              {resolved.map((entry) => (
                <div key={entry.id} className="border border-border bg-card">
                  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground font-mono">{oigLabel(entries.indexOf(entry))}</span>
                    <div className="flex items-center gap-2">
                      <ClassificationBadge value={entry.classification} />
                      <span className="text-xs text-primary font-medium">Resolved</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{entry.issue}"</p>
                    {entry.response && (
                      <div className="border-l-2 border-primary pl-3">
                        <p className="text-[10px] font-medium text-primary uppercase tracking-wide mb-1">Refinement</p>
                        <p className="text-sm text-foreground leading-relaxed">{entry.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
