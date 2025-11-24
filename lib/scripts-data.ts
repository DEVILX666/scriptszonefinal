export interface GameScript {
  id: string
  name: string
  description: string
  category: "FPS" | "RPG" | "Simulator" | "Adventure" | "Obby" | "Horror" | "Other"
  features: string[]
  logoUrl: string
}

export const gameScripts: GameScript[] = [
  {
    id: "steal-brainrot",
    name: "Steal a Brainrot",
    description: "",
    category: "Adventure",
    features: ["Auto Steal", "Item ESP", "Speed Hack", "TELEPORT", "FLY"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-5e6224a6e38d9a397098eb69ab53b319/150/150/Image/Webp/noFilter",
  },
  {
    id: "plants-vs-brainrots",
    name: "Plants Vs Brainrots",
    description: "",
    category: "Other",
    features: ["Item Dupe", "Auto Farm & Auto Buy", "Auto-Attack", "Kill-Aura", "No Cooldown"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-549f1500c07a8bbd19537056d34b605e/150/150/Image/Webp/noFilter",
  },
  {
    id: "grow-garden",
    name: "Grow a Garden",
    description: "",
    category: "Simulator",
    features: ["Spawn Pets & Seeds", "Steal People Fruits", "Dupe Fruits", "Instant Grow", "Teleport"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-900822048ca4e4fdda877229576ffc04/150/150/Image/Webp/noFilter",
  },
  {
    id: "99-nights-forest",
    name: "99 Nights in the Forest",
    description: "",
    category: "Horror",
    features: ["Diamonds Finder", "Godmode", "Kill-Aura", "Auto Rescue Child", "FLY"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-a6d1951d26add7acb3123e6600e55294/150/150/Image/Webp/noFilter",
  },
  {
    id: "brookhaven",
    name: "Brookhaven",
    description: "",
    category: "RPG",
    features: ["Teleport", "Speed Hack", "Godmode", "Item Spawn", "Fly"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-6a1bb7e517333188b205dc8a5d0371a3/150/150/Image/Webp/noFilter",
  },
]
