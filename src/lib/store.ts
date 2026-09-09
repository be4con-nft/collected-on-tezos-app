import { create } from "zustand";

export type ViewMode = "graphic" | "table" | "methods";
export type ValueUnit = "xtz" | "usd";
export type PeriodMode = "monthly" | "year" | "ytd";

const UNIT_KEY = "collected-on-tezos:unit";

function readStoredUnit(): ValueUnit {
  if (typeof window === "undefined") return "xtz";
  try {
    return window.localStorage.getItem(UNIT_KEY) === "usd" ? "usd" : "xtz";
  } catch {
    return "xtz";
  }
}

type AppState = {
  view: ViewMode;
  unit: ValueUnit;
  period: PeriodMode;
  setView: (view: ViewMode) => void;
  setUnit: (unit: ValueUnit) => void;
  setPeriod: (period: PeriodMode) => void;
  hydrateUnit: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  view: "graphic",
  unit: "xtz",
  period: "ytd",
  setView: (view) => set({ view }),
  setPeriod: (period) => set({ period }),
  setUnit: (unit) => {
    try {
      window.localStorage.setItem(UNIT_KEY, unit);
    } catch {
      /* ignore quota / private mode */
    }
    set({ unit });
  },
  hydrateUnit: () => set({ unit: readStoredUnit() }),
}));
