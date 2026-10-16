import { BRANCHES, STEMS } from "./constants.js";
import type { CalendarFacts, FourPillars, Pillar } from "./types.js";

function integerInRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
  return value;
}

export function normalizeCycleIndex(value: number): number {
  if (!Number.isInteger(value)) throw new TypeError("cycle index must be an integer");
  return ((value % 60) + 60) % 60;
}

export function pillarFromCycle(cycleIndex: number): Pillar {
  const normalized = normalizeCycleIndex(cycleIndex);
  const stem = STEMS[normalized % 10];
  const branch = BRANCHES[normalized % 12];
  if (!stem || !branch) throw new RangeError("invalid sexagenary cycle index");
  return {
    cycleIndex: normalized,
    stem,
    branch,
    hangul: `${stem.hangul}${branch.hangul}`,
    hanja: `${stem.hanja}${branch.hanja}`,
  };
}

/** 절입이 반영된 역년을 60갑자 연주로 변환합니다. */
export function yearPillarFromAdjustedYear(adjustedYear: number): Pillar {
  integerInRange(adjustedYear, -9999, 9999, "adjusted year");
  return pillarFromCycle(adjustedYear - 4);
}

/** 인월=0부터 축월=11까지의 절기월로 월주를 계산합니다. */
export function monthPillar(yearStemIndex: number, solarMonthIndex: number): Pillar {
  integerInRange(yearStemIndex, 0, 9, "year stem index");
  integerInRange(solarMonthIndex, 0, 11, "solar month index");
  const stemIndex = ((yearStemIndex % 5) * 2 + 2 + solarMonthIndex) % 10;
  const branchIndex = (solarMonthIndex + 2) % 12;
  for (let cycleIndex = 0; cycleIndex < 60; cycleIndex += 1) {
    if (cycleIndex % 10 === stemIndex && cycleIndex % 12 === branchIndex) {
      return pillarFromCycle(cycleIndex);
    }
  }
  throw new Error("month pillar could not be resolved");
}

/** 23:00~00:59를 자시로 보는 두 시간 단위 시주 계산입니다. */
export function hourPillar(dayStemIndex: number, hour: number): Pillar {
  integerInRange(dayStemIndex, 0, 9, "day stem index");
  integerInRange(hour, 0, 23, "hour");
  const branchIndex = Math.floor(((hour + 1) % 24) / 2);
  const stemIndex = (dayStemIndex * 2 + branchIndex) % 10;
  for (let cycleIndex = 0; cycleIndex < 60; cycleIndex += 1) {
    if (cycleIndex % 10 === stemIndex && cycleIndex % 12 === branchIndex) {
      return pillarFromCycle(cycleIndex);
    }
  }
  throw new Error("hour pillar could not be resolved");
}

/**
 * 달력·천문 어댑터가 산출한 경계값으로 사주 네 기둥을 조립합니다.
 * 날짜 변환을 숨기지 않아 적용한 역법과 관법을 호출자가 감사할 수 있습니다.
 */
export function deriveFourPillars(facts: CalendarFacts): FourPillars {
  const year = pillarFromCycle(facts.yearCycleIndex);
  const day = pillarFromCycle(facts.dayCycleIndex);
  return {
    year,
    month: monthPillar(year.stem.index, facts.solarMonthIndex),
    day,
    hour: hourPillar(day.stem.index, facts.hour),
  };
}
