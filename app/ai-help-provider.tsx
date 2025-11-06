"use client"

import dynamic from "next/dynamic"

const AIHelpButton = dynamic(() => import("@/components/ai-help-button"), {
  ssr: false,
})

export function AIHelpProvider() {
  return <AIHelpButton />
}
