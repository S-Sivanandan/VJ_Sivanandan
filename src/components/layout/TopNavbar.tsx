import { useState, useEffect, useRef } from "react"
import { LogOut, User, ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabase"

function VJLogo() {
  return (
    <img
      src="/Copilot_20260609_144738.png"
      alt="Visionary Journal"
      className="w-7 h-7 shrink-0 rounded-sm object-cover"
    />
  )
}

function AccountMenu() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-1.5 rounded"
      >
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-3 h-3 text-primary" />
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border shadow-lg z-50 py-1">
          {email && (
            <div className="px-3 py-2 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Signed in as</p>
              <p className="text-xs font-medium text-foreground truncate mt-0.5">{email}</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between px-5 h-12">
        <div className="flex items-center gap-2">
          <VJLogo />
          <span className="text-sm font-medium tracking-wide text-foreground">
            Visionary Journal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Cognitive Lab
          </span>
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
