export interface Offer {
  id: string
  title: string
  description: string
  difficulty: "VERY EASY" | "EASY" | "MEDIUM" | "HARD"
  reward: string
  url: string
  icon?: string
  category?: string
  offerNumber?: number
}

export interface OfferApiResponse {
  success: boolean
  offers: Offer[]
  error?: string
}

const USER_ID = "705486"
const API_KEY = "3f77ccd539495b1de5d31ccf19649e3a"
const API_BASE_URL = "https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php"

export async function fetchOffers(userIP?: string, userAgent?: string, maxOffers = 4): Promise<OfferApiResponse> {
  try {
    const params = new URLSearchParams({
      user_id: USER_ID,
      api_key: API_KEY,
      s1: "",
      s2: "",
    })

    if (userIP) {
      params.append("ip", userIP)
    }
    if (userAgent) {
      params.append("user_agent", userAgent)
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    const offersArray = Array.isArray(data) ? data : []

    if (!Array.isArray(offersArray) || offersArray.length === 0) {
      return {
        success: false,
        offers: [],
        error: "No offers available",
      }
    }

    const offers: Offer[] = offersArray.slice(0, maxOffers).map((offer: any, index: number) => {
      return {
        id: offer.offer_id?.toString() || `offer-${index}`,
        title: offer.anchor || "Complete Offer",
        description: offer.conversion || "Complete this offer to unlock premium scripts",
        difficulty: getDifficultyFromOffer(offer, index),
        reward: "Premium Scripts Access",
        url: offer.url || "#",
        icon: undefined,
        category: "General",
        offerNumber: index + 1,
      }
    })

    return {
      success: true,
      offers: offers,
    }
  } catch (error) {
    console.error("[v0] Error fetching offers:", error)
    return {
      success: false,
      offers: [],
      error: error instanceof Error ? error.message : "Failed to fetch offers",
    }
  }
}

function getDifficultyFromOffer(offer: any, index: number): Offer["difficulty"] {
  return "VERY EASY"
}

export async function getUserIP(): Promise<string> {
  try {
    if (typeof window === "undefined") {
      return "127.0.0.1"
    }

    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("[v0] Error fetching IP:", error)
    return "127.0.0.1"
  }
}
