import {
  calculateSaju,
  lunarToSolar,
  solarToLunar,
} from "@fullstackfamily/manseryeok";
import { analyzeStemTenGods, countPrincipalElements } from "./analysis.js";
import { pillarFromCycle } from "./pillars.js";
import type {
  BirthDateInput,
  FourPillars,
  OfflineBirthChart,
  Pillar,
} from "./types.js";

function pillarFromHangul(value: string | null, label: string): Pillar {
  if (!value) throw new RangeError(`${label} could not be calculated`);
  for (let cycleIndex = 0; cycleIndex < 60; cycleIndex += 1) {
    const pillar = pillarFromCycle(cycleIndex);
    if (pillar.hangul === value) return pillar;
  }
  throw new RangeError(`${label} is not a valid sexagenary pillar: ${value}`);
}

function assertClock(hour: number, minute: number): void {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError("hour must be an integer from 0 to 23");
  }
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new RangeError("minute must be an integer from 0 to 59");
  }
}

/**
 * 내장된 한국 만세력 데이터만 사용해 출생 사주를 계산합니다.
 * 이 함수는 fetch, 네트워크, 외부 API 키 또는 데이터베이스를 사용하지 않습니다.
 */
export function calculateBirthChart(input: BirthDateInput): OfflineBirthChart {
  const minute = input.minute ?? 0;
  assertClock(input.hour, minute);

  const solar = input.calendar === "lunar"
    ? lunarToSolar(input.year, input.month, input.day, input.isLeapMonth ?? false).solar
    : { year: input.year, month: input.month, day: input.day };

  const calendar = solarToLunar(solar.year, solar.month, solar.day);
  const saju = calculateSaju(
    solar.year,
    solar.month,
    solar.day,
    input.hour,
    minute,
    {
      longitude: input.longitude ?? 127,
      applyTimeCorrection: input.applyTimeCorrection ?? true,
    },
  );

  const pillars: FourPillars = {
    year: pillarFromHangul(saju.yearPillar, "year pillar"),
    month: pillarFromHangul(saju.monthPillar, "month pillar"),
    day: pillarFromHangul(saju.dayPillar, "day pillar"),
    hour: pillarFromHangul(saju.hourPillar, "hour pillar"),
  };

  return {
    source: "embedded-korean-calendar",
    solar: calendar.solar,
    lunar: calendar.lunar,
    pillars,
    principalElements: countPrincipalElements(pillars),
    stemTenGods: analyzeStemTenGods(pillars),
    timeCorrection: saju.correctedTime
      ? {
          applied: saju.isTimeCorrected,
          correctedHour: saju.correctedTime.hour,
          correctedMinute: saju.correctedTime.minute,
        }
      : { applied: saju.isTimeCorrected },
  };
}
