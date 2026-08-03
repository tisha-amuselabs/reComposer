import type { ItemOfDay } from "../../types/item";

export const OLYMPIC_GOLD_MEDAL: ItemOfDay = {
    id: "olympic-gold-medal",
    name: "Olympic gold medal",
    tagline: "A champion's ultimate prize, famously made mostly of silver.",
    composition: [
      { symbol: "Ag", approxPercent: 93 },
      { symbol: "Cu", approxPercent: 6 },
      { symbol: "Au", approxPercent: 1 },
    ],
    rawMaterials: [
      "Pure silver",
      "Copper",
      "Pure gold",
    ],
    steps: [
      { id: "alloy-core", label: "Alloy the core metals", description: "Melt silver and copper together to create a durable sterling core." },
      { id: "cast-blanks", label: "Cast metal blanks", description: "Pour the molten alloy to form featureless, perfectly weighted circular discs." },
      { id: "strike-design", label: "Strike the design", description: "Squeeze the blank in a massive hydraulic press to stamp the intricate 3D design." },
      { id: "electroplate", label: "Electroplate with gold", description: "Submerge the struck silver medal in a chemical bath to plate it with pure gold." },
      { id: "attach-ribbon", label: "Attach the ribbon", description: "Thread and stitch the ceremonial ribbon through the top loop of the finished medal." },
    ],
    alchemy: {
      nodes: {
        "silver": { id: "silver", label: "Silver", emoji: "⚪", type: "material" },
        "copper": { id: "copper", label: "Copper", emoji: "🟠", type: "material" },
        "gold": { id: "gold", label: "Pure gold", emoji: "🟡", type: "material" },
        "heat": { id: "heat", label: "Heat", emoji: "🔥", type: "action" },
        "pressurize": { id: "pressurize", label: "Pressurize", emoji: "🗜️", type: "action" },
        "sterling-alloy": { id: "sterling-alloy", label: "Sterling alloy", emoji: "🥈", type: "material" },
        "metal-blank": { id: "metal-blank", label: "Metal blank", emoji: "🪙", type: "material" },
        "struck-medal": { id: "struck-medal", label: "Struck silver medal", emoji: "🎖️", type: "material" },
        "olympic-gold-medal": { id: "olympic-gold-medal", label: "Olympic gold medal", emoji: "🥇", type: "material" },
      },
      startIds: ["silver", "copper", "gold", "heat", "pressurize"],
      combinations: [
        { inputs: ["silver", "copper"], result: "sterling-alloy" },
        { inputs: ["sterling-alloy", "heat"], result: "metal-blank" },
        { inputs: ["metal-blank", "pressurize"], result: "struck-medal" },
        { inputs: ["struck-medal", "gold"], result: "olympic-gold-medal" },
      ],
      targetId: "olympic-gold-medal",
    },
    origin: {
      year: 1904,
      yearLabel: "1904",
      locationName: "St. Louis, Missouri, USA",
      lat: 38.627,
      lng: -90.1994,
      minYear: 1800,
      maxYear: 2026,
    },
    trivia: [
      "Despite the name, modern Olympic gold medals have not been made of solid gold since the 1912 games in Stockholm.",
      "The International Olympic Committee mandates that a gold medal must be made of at least 92.5% silver, plated with a minimum of 6 grams of pure gold.",
      "For the 2024 Paris Olympics, every medal was struck with an original, 18-gram piece of puddle iron salvaged directly from the Eiffel Tower.",
    ],
    compositionExplanation: "Because solid gold is incredibly expensive and relatively soft, modern Olympic 'gold' medals are actually struck from a core of sterling or pure silver. The gold element makes up only a tiny fraction of the total mass, serving purely as a brilliant electroplated outer shell to signify first place.",
    processExplanation: "The core metals must be alloyed and cast into heavy blanks first. Striking the intricate designs requires immense pressure while the silver core is still unplated, because the thin, delicate layer of gold is electroplated at the very end to prevent it from being crushed or smeared by the hydraulic presses.",
    originExplanation: "While the modern Olympic Games began in 1896 in Athens, first-place winners there were actually awarded silver medals, and 1900 winners often received cups or trophies. The tradition of awarding a specifically gold-colored medal to the champion officially began at the 1904 Summer Olympics in St. Louis.",
  };