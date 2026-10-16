import type { Element, FourPillars, Polarity, Stem, TenGod } from "./types.js";

const ELEMENTS: readonly Element[] = ["wood", "fire", "earth", "metal", "water"];

function elementIndex(element: Element): number {
  return ELEMENTS.indexOf(element);
}

export function tenGod(dayMaster: Stem, target: Stem): TenGod {
  const relation = (elementIndex(target.element) - elementIndex(dayMaster.element) + 5) % 5;
  const samePolarity = dayMaster.polarity === target.polarity;
  if (relation === 0) return samePolarity ? "비견" : "겁재";
  if (relation === 1) return samePolarity ? "식신" : "상관";
  if (relation === 2) return samePolarity ? "편재" : "정재";
  if (relation === 3) return samePolarity ? "편관" : "정관";
  return samePolarity ? "편인" : "정인";
}

export type ElementDistribution = Readonly<Record<Element, number>>;

/** 천간 4자와 지지 본기 4자를 각각 한 표로 세는 기초 분포입니다. */
export function countPrincipalElements(chart: FourPillars): ElementDistribution {
  const counts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pillar of [chart.year, chart.month, chart.day, chart.hour]) {
    counts[pillar.stem.element] += 1;
    counts[pillar.branch.element] += 1;
  }
  return counts;
}

export type StemTenGods = Readonly<{
  year: TenGod;
  month: TenGod;
  hour: TenGod;
}>;

export function analyzeStemTenGods(chart: FourPillars): StemTenGods {
  const dayMaster = chart.day.stem;
  return {
    year: tenGod(dayMaster, chart.year.stem),
    month: tenGod(dayMaster, chart.month.stem),
    hour: tenGod(dayMaster, chart.hour.stem),
  };
}

export function polarityLabel(polarity: Polarity): "양" | "음" {
  return polarity === "yang" ? "양" : "음";
}
