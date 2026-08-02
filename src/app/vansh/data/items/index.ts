import type { ItemOfDay } from "../../types/item";
import { LITHIUM_ION_BATTERY } from "./lithiumIonBattery";

export const ITEMS: ItemOfDay[] = [LITHIUM_ION_BATTERY];

export function itemById(id: string): ItemOfDay {
  const found = ITEMS.find((item) => item.id === id);
  return found ?? ITEMS[0];
}
