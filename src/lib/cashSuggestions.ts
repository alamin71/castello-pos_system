function roundUpTo(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

/** Generates 4 ascending "tendered amount" quick-pick suggestions above a bill total. */
export function getCashSuggestions(total: number): number[] {
  const suggestions = [
    roundUpTo(total, 50),
    roundUpTo(total, 250),
    roundUpTo(total, 1000),
    roundUpTo(total, 1000) + 2000,
  ];

  return Array.from(new Set(suggestions)).slice(0, 4);
}
