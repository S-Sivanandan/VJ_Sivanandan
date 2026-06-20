import { BookOpen, Zap, Grid3X3, Info, Bookmark, Library } from "lucide-react"

export type Tab = "records" | "volumes" | "forum" | "sheets" | "library" | "about"

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "records", label: "Records", Icon: BookOpen },
  { id: "volumes", label: "Volumes", Icon: Library },
  { id: "forum", label: "Forum", Icon: Zap },
  { id: "sheets", label: "Sheets", Icon: Grid3X3 },
  { id: "library", label: "Library", Icon: Bookmark },
  { id: "about", label: "About Me", Icon: Info },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-40 bg-card border-t border-border">
      <div className="grid grid-cols-6 h-14">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center justify-center gap-0.5 px-0.5 transition-colors"
            >
              <Icon
                className={`w-[17px] h-[17px] transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[8px] font-medium transition-colors leading-tight text-center ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              <span
                className={`w-1 h-1 rounded-full transition-all ${
                  isActive ? "bg-primary" : "bg-transparent"
                }`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
