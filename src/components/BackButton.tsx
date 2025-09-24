"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useCallback } from "react"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      router.push("/") // fallback vers l'accueil
    }
  }, [router])

  return (
    <Button 
      onClick={handleBack} 
      variant="outline"
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Retour
    </Button>
  )
}
