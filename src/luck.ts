import { lunarToSolar } from "@fullstackfamily/manseryeok";
import { calculateBirthChart } from "./offline-calendar.js";
import { pillarFromCycle, yearPillarFromAdjustedYear } from "./pillars.js";
import { analyzePillarRelations, type PillarRelation } from "./relations.js";
import type { BirthDateInput, OfflineBirthChart, Pillar, Polarity, TenGod } from "./types.js";
import { tenGod } from "./analysis.js";

export type LuckDirection = "forward" | "backward";
export type LuckGender = "male" | "female";

export type LuckPeriod = Readonly<{
  order: number;
  startAge: number;
  endAge: number;
  pillar: Pillar;
  tenGod: TenGod;
  relations: readonly PillarRelation[];
}>;

export type LuckTimeline = Readonly<{
  convention: "gender-year-stem-v1";
  direction: LuckDirection;
  startAge: number;
  startAgeSource: "caller";
  decades: readonly LuckPeriod[];
}>;

/**
 * 대운 방향과 10년 간지를 계산합니다. 시작 나이는 절입 관법 차이가 크므로
 * 호출자가 검증한 값을 명시하도록 강제합니다.
 */
export function calculateMajorLuck(
  chart: OfflineBirthChart,
  gender: LuckGender,
  startAge: number,
  count = 8,
): LuckTimeline {
  if (!Number.isFinite(startAge) || startAge < 0 || startAge > 20) throw new RangeError("startAge must be from 0 to 20");
  if (!Number.isInteger(count) || count < 1 || count > 12) throw new RangeError("count must be from 1 to 12");
  const yearPolarity: Polarity = chart.pillars.year.stem.polarity;
  const direction: LuckDirection = (gender === "male") === (yearPolarity === "yang") ? "forward" : "backward";
  const step = direction === "forward" ? 1 : -1;
  const decades = Array.from({ length: count }, (_, index): LuckPeriod => {
    const pillar = pillarFromCycle(chart.pillars.month.cycleIndex + step * (index + 1));
    return {
      order: index + 1,
      startAge: startAge + index * 10,
      endAge: startAge + index * 10 + 9,
      pillar,
      tenGod: tenGod(chart.pillars.day.stem, pillar.stem),
      relations: analyzePillarRelations(chart.pillars, pillar),
    };
  });
  return { convention: "gender-year-stem-v1", direction, startAge, startAgeSource: "caller", decades };
}

export type DateLuck = Readonly<{
  year: Pillar;
  month: Pillar;
  yearTenGod: TenGod;
  monthTenGod: TenGod;
  yearRelations: readonly PillarRelation[];
  monthRelations: readonly PillarRelation[];
}>;

export function calculateYearMonthLuck(chart: OfflineBirthChart, year: number, lunarMonth: number): DateLuck {
  const solar = lunarToSolar(year, lunarMonth, 1, false).solar;
  const monthChart = calculateBirthChart({ calendar: "solar", ...solar, hour: 12, applyTimeCorrection: false });
  const yearPillar = yearPillarFromAdjustedYear(year);
  return {
    year: yearPillar,
    month: monthChart.pillars.month,
    yearTenGod: tenGod(chart.pillars.day.stem, yearPillar.stem),
    monthTenGod: tenGod(chart.pillars.day.stem, monthChart.pillars.month.stem),
    yearRelations: analyzePillarRelations(chart.pillars, yearPillar),
    monthRelations: analyzePillarRelations(chart.pillars, monthChart.pillars.month),
  };
}
