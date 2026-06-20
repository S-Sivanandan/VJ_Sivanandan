import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

interface LoginGatewayProps {
  onLogin: () => void
}

export function LoginGateway({ onLogin }: LoginGatewayProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        // After sign-up, sign in immediately (email confirmation is off)
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      onLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Minimal header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-3 mb-3">
            <img
              src="/Copilot_20260609_144738.png"
              alt="Visionary Journal"
              className="w-16 h-16 rounded-xl object-cover"
            />
            <span className="text-sm font-medium tracking-wide text-foreground">
              Visionary Journal
            </span>
          </div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Cognitive Lab
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-card border border-border p-6 w-full">
          <p className="text-xs text-muted-foreground text-center mb-5">
            {mode === "signin" ? "Sign in to access your workspace" : "Create your operator account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10 text-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="h-10 text-sm"
            />

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-10 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              {loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null) }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === "signin" ? "No account? Sign up" : "Have an account? Sign in"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Private workspace for operator access only
          </p>
        </div>
      </div>
    </div>
  )
}
