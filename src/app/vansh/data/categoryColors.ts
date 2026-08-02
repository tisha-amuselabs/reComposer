import type { ElementCategory } from "../types/element";

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal": "bg-[#5f2937] text-[#ffd9e2]",
  "alkaline-earth-metal": "bg-[#62402d] text-[#ffddc7]",
  "transition-metal": "bg-[#1c4b64] text-[#c9edff]",
  "post-transition-metal": "bg-[#343f69] text-[#dfe2ff]",
  metalloid: "bg-[#175a58] text-[#c7f4ef]",
  nonmetal: "bg-[#155064] text-[#c9f1ff]",
  halogen: "bg-[#55315e] text-[#f4d6ff]",
  "noble-gas": "bg-[#443968] text-[#e8deff]",
  lanthanide: "bg-[#623e59] text-[#ffdcf2]",
  actinide: "bg-[#523b64] text-[#f0dcff]",
};

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  "alkali-metal": "Alkali metal",
  "alkaline-earth-metal": "Alkaline earth metal",
  "transition-metal": "Transition metal",
  "post-transition-metal": "Post-transition metal",
  metalloid: "Metalloid",
  nonmetal: "Nonmetal",
  halogen: "Halogen",
  "noble-gas": "Noble gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
};
