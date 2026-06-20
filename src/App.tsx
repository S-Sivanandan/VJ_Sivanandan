import { useState, useEffect } from "react"
import { LoginGateway } from "@/components/views/LoginGateway"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { BottomNav, type Tab } from "@/components/layout/BottomNav"
import { HumanRecords } from "@/components/views/HumanRecords"
import { Volumes } from "@/components/views/Volumes"
import { StrategyForum } from "@/components/views/StrategyForum"
import { FrameworkSheets } from "@/components/views/FrameworkSheets"
import { MyLibrary } from "@/components/views/MyLibrary"
import { OperatorProfile } from "@/components/views/OperatorProfile"
import { supabase } from "@/lib/supabase"

export function App() {
  const [session, setSession] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("records")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === null) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <LoginGateway onLogin={() => setSession(true)} />
  }

  return (
    <div className="min-h-dvh bg-muted flex items-start justify-center">
      <div className="w-full max-w-[430px] h-dvh flex flex-col bg-background overflow-hidden relative">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto overscroll-contain">
          {activeTab === "records" && <HumanRecords />}
          {activeTab === "volumes" && <Volumes />}
          {activeTab === "forum" && <StrategyForum />}
          {activeTab === "sheets" && <FrameworkSheets />}
          {activeTab === "library" && <MyLibrary />}
          {activeTab === "about" && <OperatorProfile />}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

export default App
