import { Lock, Circle } from "lucide-react"

type EntryStatus = "published" | "upcoming" | "locked"

interface VolumeEntry {
  id: string
  title: string
  subtitle: string
  status: EntryStatus
  date?: string
}

const VOLUME_01_ENTRIES: VolumeEntry[] = [
  {
    id: "VJ#Y01-001",
    title: "The Decay Constant",
    subtitle: "Why Most Systems Collapse Before Execution",
    status: "published",
    date: "2025-03-15",
  },
  {
    id: "VJ#Y01-002",
    title: "Temporal Anchoring",
    subtitle: "Building Execution Windows That Don't Drift",
    status: "published",
    date: "2025-04-22",
  },
  {
    id: "VJ#Y01-003",
    title: "The Output Compression Method",
    subtitle: "Defining Singular Deliverables",
    status: "published",
    date: "2025-05-10",
  },
  {
    id: "VJ#Y01-004",
    title: "Orbital Mechanics of Habit",
    subtitle: "Why Routines Decay Without Gravitational Constants",
    status: "published",
    date: "2025-06-01",
  },
  {
    id: "VJ#Y01-005",
    title: "The Stellar Collapse Protocol",
    subtitle: "Managing Full System Breakdowns with Precision",
    status: "upcoming",
    date: "2026-07",
  },
  {
    id: "VJ#Y01-006",
    title: "Event Horizon Decisions",
    subtitle: "The Point of No Return in Life Architecture",
    status: "locked",
  },
  {
    id: "VJ#Y01-007",
    title: "Dark Matter Systems",
    subtitle: "The Invisible Forces Driving or Killing Your Execution",
    status: "locked",
  },
  {
    id: "VJ#Y01-008",
    title: "The Final Constant",
    subtitle: "Year 01 — System Genesis Synthesis Report",
    status: "locked",
  },
]

const ARCHIVE_ITEMS = [
  { label: "Total entries planned", value: "8" },
  { label: "Published", value: "4" },
  { label: "Pages estimated", value: "~240" },
]

function StatusDot({ status }: { status: EntryStatus }) {
  if (status === "published") {
    return <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-[5px]" />
  }
  if (status === "upcoming") {
    return <div className="w-2 h-2 rounded-full border-2 border-primary/60 bg-transparent shrink-0 mt-[5px]" />
  }
  return <Lock className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-[3px]" />
}

function EntryRow({ entry, index }: { entry: VolumeEntry; index: number }) {
  const isPublished = entry.status === "published"
  const isUpcoming = entry.status === "upcoming"
  const isLocked = entry.status === "locked"

  return (
    <div className={`flex gap-4 py-3.5 border-b border-border last:border-0 ${isLocked ? "opacity-50" : ""}`}>
      <div className="flex flex-col items-center pt-1 gap-1">
        <StatusDot status={entry.status} />
        {index < VOLUME_01_ENTRIES.length - 1 && (
          <div className={`w-px flex-1 min-h-[20px] ${isPublished ? "bg-primary/20" : "bg-border"}`} />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider">
            {entry.id}
          </span>
          {entry.date && (
            <span className="text-[9px] text-muted-foreground/50 shrink-0">
              {isUpcoming ? `ETA ${entry.date}` : entry.date}
            </span>
          )}
        </div>
        <h4 className={`text-sm font-semibold leading-snug mb-0.5 ${
          isPublished ? "text-foreground" : isUpcoming ? "text-foreground/70" : "text-muted-foreground/50"
        }`}>
          {entry.title}
        </h4>
        <p className={`text-xs leading-relaxed ${
          isPublished ? "text-muted-foreground" : "text-muted-foreground/50"
        }`}>
          {entry.subtitle}
        </p>
        {isPublished && (
          <span className="inline-block mt-1.5 text-[9px] font-medium text-primary uppercase tracking-widest">
            Published
          </span>
        )}
        {isUpcoming && (
          <span className="inline-block mt-1.5 text-[9px] font-medium text-primary/60 uppercase tracking-widest">
            Upcoming
          </span>
        )}
        {isLocked && (
          <span className="inline-block mt-1.5 text-[9px] font-medium text-muted-foreground/40 uppercase tracking-widest">
            Locked
          </span>
        )}
      </div>
    </div>
  )
}

export function Volumes() {
  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">Volumes</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Chronological release archive &amp; upcoming track
        </p>
      </div>

      {/* Intel releases banner */}
      <div className="px-5 pt-2 pb-4">
        <div className="border border-primary/20 bg-primary/[0.03] px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em]">
              Current Intel Releases // Upcoming Track
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Year 01 systematic rollout — 4 of 8 entries published
          </p>
        </div>
      </div>

      {/* Volume 01 card */}
      <div className="px-5 space-y-5">
        <div className="border border-border bg-card">
          {/* Volume header */}
          <div className="px-4 pt-5 pb-4 border-b border-border">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground tracking-widest mb-1">
                  VJ#Y01
                </p>
                <h2 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                  Volume 01
                </h2>
                <h3 className="text-base font-semibold text-primary mt-0.5">
                  System Genesis
                </h3>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Year</p>
                <p className="text-2xl font-bold text-foreground tracking-tighter">01</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              The foundational record of a practitioner building their first complete life-operating system. From theory to tracked execution — the complete blueprint of System Genesis.
            </p>

            {/* Metrics row */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              {ARCHIVE_ITEMS.map((item) => (
                <div key={item.label} className="flex-1 text-center">
                  <p className="text-lg font-bold text-foreground">{item.value}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Published</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full border-2 border-primary/60" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-2.5 h-2.5 text-muted-foreground/40" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Locked</span>
            </div>
          </div>

          {/* Entry list */}
          <div className="px-4">
            {VOLUME_01_ENTRIES.map((entry, i) => (
              <EntryRow key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>

        {/* Future volumes teaser */}
        <div className="border border-dashed border-border px-4 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Circle className="w-3 h-3 text-muted-foreground/30" />
            <span className="text-xs font-medium text-muted-foreground/50 uppercase tracking-widest">Volume 02</span>
            <Circle className="w-3 h-3 text-muted-foreground/30" />
          </div>
          <p className="text-xs text-muted-foreground/50">Planned — Year 02 Architecture</p>
        </div>
      </div>
    </div>
  )
}
