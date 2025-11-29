"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ExternalLink, Star, Zap, Shield } from "lucide-react"
import { fetchOffers, getUserIP, type Offer } from "@/lib/offer-api"
import { detectCountryAndGetLanguage, getTranslation } from "@/lib/country-translator"

interface OfferOverlayProps {
  isOpen: boolean
  onClose: () => void
  gameName: string
  gameLogo: string
  onOfferComplete: () => void
}

const difficultyConfig = {
  "VERY EASY": {
    color: "rgba(77, 255, 77, 0.3)",
    borderColor: "#4dff4d",
    textColor: "#4dff4d",
    icon: Star,
  },
  EASY: {
    color: "rgba(255, 204, 0, 0.3)",
    borderColor: "#ffcc00",
    textColor: "#ffcc00",
    icon: Zap,
  },
  MEDIUM: {
    color: "rgba(255, 165, 0, 0.3)",
    borderColor: "#ffa500",
    textColor: "#ffa500",
    icon: Shield,
  },
}

const translateDifficulty = (difficulty: string, language: string): string => {
  const key = difficulty.toLowerCase().replace(" ", "_")
  return getTranslation(language, key)
}

export function OfferOverlay({ isOpen, onClose, gameName, gameLogo, onOfferComplete }: OfferOverlayProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<string>("en")

  useEffect(() => {
    const initLanguage = async () => {
      const detectedLanguage = await detectCountryAndGetLanguage()
      setLanguage(detectedLanguage)
    }
    initLanguage()
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadOffers()
    }
  }, [isOpen])

  const loadOffers = async () => {
    setLoading(true)
    setError(null)

    try {
      const userIP = await getUserIP()
      const userAgent = typeof window !== "undefined" ? navigator.userAgent : "Mozilla/5.0"
      const response = await fetchOffers(userIP, userAgent, 3)

      if (response && response.success) {
        setOffers(response.offers || [])
      } else {
        setError(getTranslation(language, "failed_to_load"))
      }
    } catch (err) {
      setError(getTranslation(language, "failed_to_load"))
      console.error("[v0] Error loading offers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOfferClick = async (offer: Offer) => {
    window.open(offer.url, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <style jsx>{`
        @keyframes goldBlink {
          0%, 100% {
            color: #ffcc00;
            text-shadow: 0 0 6px #ffcc00, 0 0 12px rgba(255,204,0,0.7);
          }
          50% {
            color: #fff4c2;
            text-shadow: 0 0 12px #ffcc00, 0 0 28px rgba(255,215,0,1);
          }
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 zoom-in-95 duration-300 relative sm:max-w-lg md:max-w-2xl lg:max-w-4xl !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
          showCloseButton={false}
        >
          {/* Modern Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <span className="text-red-400 text-lg font-bold">×</span>
          </button>
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {getTranslation(language, "unlock_premium")}
              </DialogTitle>
            </div>

            {/* Game Info Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50 animate-in slide-in-from-top-4 duration-500">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20">
                {gameLogo && (
                  <img src={gameLogo || "/placeholder.svg"} alt={gameName} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {getTranslation(language, "complete_2_easy_tasks")}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">{getTranslation(language, "loading_offers")}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={loadOffers} variant="outline">
                    {getTranslation(language, "try_again")}
                  </Button>
                </div>
              )}

              {!loading && !error && offers && offers.length > 0 && (
                <div className="grid gap-4">
                  {offers.map((offer, index) => {
                    const config = difficultyConfig[offer.difficulty]
                    const IconComponent = config.icon

                    return (
                      <Card
                        key={offer.id}
                        className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-bottom-4 duration-700"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Difficulty Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <div
                            className="text-xs font-bold px-2 py-1 rounded-lg border whitespace-nowrap"
                            style={{
                              background: config.color,
                              color: config.textColor,
                              borderColor: config.borderColor,
                              fontSize: "10px",
                              padding: "2px 8px",
                              borderRadius: "8px",
                              border: `1px solid ${config.borderColor}`,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {translateDifficulty(offer.difficulty, language)}
                          </div>
                        </div>

                        <div className="p-6 space-y-4">
                          {/* Offer Header */}
                          <div className="flex items-start gap-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <span
                                className="text-xl font-black"
                                style={{
                                  color: "#ffcc00",
                                  textShadow: "0 0 8px #ffcc00, 0 0 16px rgba(255,204,0,0.6)",
                                }}
                              >
                                {offer.offerNumber}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {offer.title}
                              </h4>
                              <p
                                className="text-sm font-semibold mt-1"
                                style={{
                                  color: "#00ff88",
                                  textShadow: "0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.6)",
                                }}
                              >
                                {offer.description}
                              </p>
                            </div>
                          </div>

                          {/* Reward Info */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>
                              {getTranslation(language, "reward")} {offer.reward}
                            </span>
                          </div>

                          {/* Start Offer Button */}
                          <Button
                            onClick={() => handleOfferClick(offer)}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            size="lg"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {getTranslation(language, "start_task")}
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}

              {!loading && !error && offers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">{getTranslation(language, "no_offers")}</p>
                  <Button onClick={loadOffers} variant="outline">
                    {getTranslation(language, "refresh")}
                  </Button>
                </div>
              )}
            </>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
