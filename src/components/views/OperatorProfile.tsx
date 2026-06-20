import { ExternalLink } from "lucide-react"

const DOMAINS = [
  {
    title: "Writing & Documentation",
    description:
      "Multi-format literary practitioner — field notes, long-form essays, framework documentation, and philosophical investigations spanning cognitive science, systemic design, and biographical observation.",
  },
  {
    title: "Astrophysics Application",
    description:
      "Applied astrophysics principles to personal systems design. Entropy, decay constants, orbital mechanics, and stellar collapse patterns reframed as executable frameworks for human performance architecture.",
  },
  {
    title: "Systemic Execution",
    description:
      "Multi-system operator with documented laboratory tracking protocols across creative output, physical performance, temporal management, and cognitive optimization.",
  },
]

const METRICS = [
  { label: "Journal entries", value: "8" },
  { label: "Frameworks published", value: "6" },
  { label: "Domains tracked", value: "4" },
]

const TIMELINE = [
  { year: "2025", event: "Laboratory initialization. First systemic documentation protocol established." },
  { year: "2025", event: "Astrophysics-to-life-systems translation methodology developed." },
  { year: "2026", event: "First complete framework sheet library published." },
  { year: "2026", event: "Strategy Forum activated. Operator feedback loop formalized." },
]

export function OperatorProfile() {
  return (
    <div className="pb-4">
      {/* Centered logo header */}
      <div className="px-5 pt-6 pb-4 text-center">
        <img
          src="/Copilot_20260609_144738.png"
          alt="Visionary Journal"
          className="w-16 h-16 rounded-xl object-cover mx-auto mb-3"
        />
        <h1 className="text-base font-semibold text-foreground leading-tight mb-1">
          The Visionary Practitioner
        </h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
            Operator
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">Year 01</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono">
          VJ#OP-001 // Cognitive Lab
        </p>

        {/* Mission statement */}
        <div className="border-l-2 border-primary pl-3 mt-4 text-left">
          <p className="text-sm text-muted-foreground leading-relaxed">
            A personal diary of a multi-talented practitioner using real-time laboratory tracking — incorporating astrophysics, writing, and systemic execution — to share unyielding blueprints on managing life decay.
          </p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-xl font-semibold text-foreground">{m.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Domain expertise */}
        <div className="pt-4 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4 block">
            Domain Architecture
          </span>

          <div className="space-y-3">
            {DOMAINS.map((domain) => (
              <div key={domain.title}>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {domain.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-4 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4 block">
            Laboratory Timeline
          </span>

          <div className="space-y-3">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="shrink-0">
                  <div
                    className={`text-[10px] font-medium font-mono px-1.5 py-0.5 ${
                      i === TIMELINE.length - 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.year}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="pt-4 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 block">
            Operator Channels
          </span>

          <div className="space-y-2">
            {["Strategy Forum", "Framework Archive", "Human Records Feed"].map((item) => (
              <button
                key={item}
                className="flex items-center justify-between w-full text-sm text-foreground hover:text-primary transition-colors py-1"
              >
                <span>{item}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">
            Visionary Journal · Cognitive Lab · Year 01
          </p>
        </div>
      </div>
    </div>
  )
}
