import { Download, Bookmark, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSavedItems } from "@/hooks/use-saved-items"

const FRAMEWORKS = [
  {
    id: "VJ#008",
    title: "Core 3-Step Protocol Cheat Sheet",
    subtitle: "1-Page Summary",
    description: "Compress any complex execution goal into three temporal blocks. Eliminate decision fatigue at the point of action.",
    pages: 1,
  },
  {
    id: "VJ#007",
    title: "Decay Mapping Worksheet",
    subtitle: "System Diagnostic",
    description: "Identify the exact friction points in your daily system using the astrophysics entropy model applied to personal workflow.",
    pages: 2,
  },
  {
    id: "VJ#006",
    title: "Temporal Anchoring Grid",
    subtitle: "Weekly Architecture",
    description: "A structured grid for placing non-negotiable execution windows. Designed for multi-domain practitioners managing competing priorities.",
    pages: 1,
  },
  {
    id: "VJ#005",
    title: "Output Compression Method",
    subtitle: "Daily Operator Card",
    description: "Single-session deliverable definition framework. Define your output in 10 words or fewer before each work session begins.",
    pages: 1,
  },
  {
    id: "VJ#004",
    title: "Cognitive Peak Mapping Protocol",
    subtitle: "7-Day Tracking Sheet",
    description: "Chronobiology-based tracking for identifying your actual cognitive peak windows. Override conventional scheduling with observed data.",
    pages: 3,
  },
  {
    id: "VJ#003",
    title: "The Life Decay Inventory",
    subtitle: "Quarterly Audit",
    description: "A comprehensive quarterly audit for identifying systemic decay across all life domains: creative, relational, physical, financial.",
    pages: 4,
  },
]

export function FrameworkSheets() {
  const { isSaved, toggleSave } = useSavedItems()

  const handleDownload = (id: string) => {
    console.log("Download requested:", id)
  }

  const savedCount = FRAMEWORKS.filter((fw) => isSaved("sheet", fw.id)).length

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">Framework Sheets</h1>
        <p className="text-xs text-muted-foreground mt-1">
          One-page execution frameworks
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-muted-foreground">
            {FRAMEWORKS.length} available
          </span>
          {savedCount > 0 && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-xs text-primary font-medium">
                {savedCount} saved
              </span>
            </>
          )}
        </div>
      </div>

      <div className="px-5 py-4 grid gap-4">
        {FRAMEWORKS.map((fw) => {
          const saved = isSaved("sheet", fw.id)
          return (
            <div key={fw.id} className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {fw.id}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {fw.pages} {fw.pages === 1 ? "page" : "pages"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  {fw.title}
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  {fw.subtitle}
                </span>
              </div>

              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {fw.description}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleSave("sheet", fw.id, fw.title, { pages: fw.pages, subtitle: fw.subtitle })}
                    variant="ghost"
                    size="sm"
                    className={`h-8 text-xs font-medium transition-colors ${
                      saved
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3 h-3 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDownload(fw.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
