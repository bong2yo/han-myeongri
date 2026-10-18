import { lunarToSolar } from "@fullstackfamily/manseryeok";
import { calculateBirthChart } from "./offline-calendar.js";
import { yearPillarFromAdjustedYear } from "./pillars.js";
import type { BirthDateInput, Pillar } from "./types.js";

const STEM_NUMBERS = [9, 8, 7, 6, 5, 9, 8, 7, 6, 5] as const;
const YEAR_BRANCH_NUMBERS = [11, 13, 10, 10, 13, 9, 9, 13, 12, 12, 13, 11] as const;
const MONTH_BRANCH_NUMBERS = [9, 8, 7, 6, 5, 4, 9, 8, 7, 6, 5, 4] as const;
const DAY_BRANCH_NUMBERS = [9, 11, 8, 8, 11, 7, 7, 11, 10, 10, 11, 9] as const;

export type TojeongCode = `${number}${number}${number}`;
export type TojeongResult = Readonly<{
  method: "traditional-144-v1";
  targetYear: number;
  koreanAge: number;
  upper: number;
  middle: number;
  lower: number;
  code: TojeongCode;
  numbers: Readonly<{ taese: number; wolgeon: number; iljin: number; lunarMonthDays: 29 | 30 }>;
  pillars: Readonly<{ year: Pillar; month: Pillar; day: Pillar }>;
  originalText: null;
  sourceEdition: "not-yet-curated";
  modernSummary: string;
  monthly: readonly string[];
}>;

const remainder = (value: number, divisor: number): number => value % divisor || divisor;
const numberFor = (pillar: Pillar, branchNumbers: readonly number[]): number =>
  STEM_NUMBERS[pillar.stem.index]! + branchNumbers[pillar.branch.index]!;

function lunarMonthDays(year: number, month: number): 29 | 30 {
  try {
    lunarToSolar(year, month, 30, false);
    return 30;
  } catch {
    return 29;
  }
}

const THEMES = ["기초를 다지는", "관계를 조율하는", "배움을 넓히는", "변화를 준비하는", "성과를 모으는", "속도를 조절하는", "새 길을 여는", "균형을 회복하는"] as const;
const ACTIONS = ["확인", "정리", "협력", "절제", "실행", "대화"] as const;

export function calculateTojeong(input: BirthDateInput, targetYear: number): TojeongResult {
  if (!Number.isInteger(targetYear) || targetYear < 1900 || targetYear > 2050) throw new RangeError("targetYear must be from 1900 to 2050");
  const birth = calculateBirthChart(input);
  const koreanAge = targetYear - birth.lunar.year + 1;
  if (koreanAge < 1) throw new RangeError("targetYear must not precede the birth year");
  const monthDays = lunarMonthDays(targetYear, birth.lunar.month);
  const targetDay = Math.min(birth.lunar.day, monthDays);
  let targetSolar;
  try {
    targetSolar = lunarToSolar(targetYear, birth.lunar.month, targetDay, birth.lunar.isLeapMonth).solar;
  } catch (error) {
    if (!birth.lunar.isLeapMonth) throw error;
    // 목표 연도에 같은 윤달이 없으면 같은 번호의 평달을 사용하는 공개 관법입니다.
    targetSolar = lunarToSolar(targetYear, birth.lunar.month, targetDay, false).solar;
  }
  const targetChart = calculateBirthChart({ calendar: "solar", ...targetSolar, hour: 12, applyTimeCorrection: false });
  const yearPillar = yearPillarFromAdjustedYear(targetYear);
  const monthPillar = targetChart.pillars.month;
  const dayPillar = targetChart.pillars.day;
  const taese = numberFor(yearPillar, YEAR_BRANCH_NUMBERS);
  const wolgeon = numberFor(monthPillar, MONTH_BRANCH_NUMBERS);
  const iljin = numberFor(dayPillar, DAY_BRANCH_NUMBERS);
  const upper = remainder(taese + koreanAge, 8);
  const middle = remainder(wolgeon + monthDays, 6);
  const lower = remainder(iljin + birth.lunar.day, 3);
  const code = `${upper}${middle}${lower}` as TojeongCode;
  const theme = THEMES[upper - 1]!;
  const modernSummary = `${targetYear}년은 ${theme} 흐름입니다. 큰 결론보다 계산 근거와 현실 조건을 함께 살피세요.`;
  const monthly = Array.from({ length: 12 }, (_, index) => {
    const action = ACTIONS[(upper + middle + lower + index) % ACTIONS.length]!;
    return `음력 ${index + 1}월은 ${action}에 무게를 두고 무리한 단정을 피하는 달입니다.`;
  });
  return {
    method: "traditional-144-v1", targetYear, koreanAge, upper, middle, lower, code,
    numbers: { taese, wolgeon, iljin, lunarMonthDays: monthDays },
    pillars: { year: yearPillar, month: monthPillar, day: dayPillar },
    originalText: null, sourceEdition: "not-yet-curated", modernSummary, monthly,
  };
}
