import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzePillarRelations,
  calculateBirthChart,
  calculateMajorLuck,
  calculateTojeong,
  calculateYearMonthLuck,
  deriveFourPillars,
} from "../dist/index.js";

test("원국의 합충형파해를 구조화해 반환한다", () => {
  const chart = deriveFourPillars({ yearCycleIndex: 0, solarMonthIndex: 6, dayCycleIndex: 6, hour: 0 });
  const relations = analyzePillarRelations(chart);
  assert.ok(relations.some((relation) => relation.kind === "충" && relation.symbols.includes("子") && relation.symbols.includes("午")));
  assert.ok(relations.every((relation) => relation.positions.length >= 2));
});

test("대운은 성별·연간 음양 관법과 명시한 시작 나이를 보존한다", () => {
  const chart = calculateBirthChart({ calendar: "solar", year: 1984, month: 11, day: 11, hour: 10, longitude: 128.108 });
  const luck = calculateMajorLuck(chart, "male", 7, 3);
  assert.equal(luck.direction, "forward");
  assert.deepEqual(luck.decades.map((period) => period.startAge), [7, 17, 27]);
  assert.equal(luck.decades[0].pillar.cycleIndex, (chart.pillars.month.cycleIndex + 1) % 60);
});

test("세운과 월운을 오프라인 간지 및 원국 관계로 계산한다", () => {
  const chart = calculateBirthChart({ calendar: "solar", year: 1984, month: 11, day: 11, hour: 10, longitude: 128.108 });
  const luck = calculateYearMonthLuck(chart, 2026, 10);
  assert.equal(luck.year.hangul, "병오");
  assert.ok(luck.month.hangul.length === 2);
});

test("전통 작괘 예시를 343괘로 재현하고 네트워크를 호출하지 않는다", () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls += 1; throw new Error("network forbidden"); };
  try {
    const result = calculateTojeong({ calendar: "lunar", year: 1988, month: 6, day: 9, hour: 12 }, 2023);
    assert.equal(result.code, "343");
    assert.deepEqual([result.upper, result.middle, result.lower], [3, 4, 3]);
    assert.deepEqual(result.numbers, { taese: 15, wolgeon: 17, iljin: 18, lunarMonthDays: 29 });
    assert.equal(result.monthly.length, 12);
    assert.equal(result.originalText, null);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
