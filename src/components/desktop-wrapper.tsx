"use client"

import { useEffect, useState } from "react"

export function DesktopWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const apply = (matches: boolean) => {
      setIsDesktop(matches)
      document.body.style.overflow = matches ? "hidden" : ""
    }
    apply(mq.matches)
    const handler = (e: MediaQueryListEvent) => apply(e.matches)
    mq.addEventListener("change", handler)
    return () => {
      mq.removeEventListener("change", handler)
      document.body.style.overflow = ""
    }
  }, [])

  if (!isDesktop) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050812]">
      {/* Guia do Aluno - lado esquerdo */}
      <div className="flex-1 overflow-y-auto scrollbar-dark">
        <iframe
          src="/live-04-guia-aluno.html"
          className="h-full w-full border-none"
          title="Guia do Aluno - Live 04"
        />
      </div>

      {/* Phone Frame - lado direito */}
      <div className="flex items-center justify-center px-8" style={{ minWidth: 460 }}>
        <div className="relative">
          {/* Phone bezel */}
          <div
            className="relative rounded-[50px] border-[6px] border-zinc-700 bg-black shadow-2xl shadow-black/50"
            style={{ width: 390, height: 844 }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 z-[60] h-[30px] w-[120px] -translate-x-1/2 rounded-full bg-black" />

            {/*
              App content container.
              - overflow: hidden prevents any scroll at this level
              - transform: translateZ(0) creates containing block for fixed children
              - The internal app layout handles its own scrolling
            */}
            <div
              className="h-full w-full overflow-hidden rounded-[44px]"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="h-full w-full overflow-y-auto scrollbar-dark">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
