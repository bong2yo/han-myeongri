import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeStemTenGods,
  countPrincipalElements,
  deriveFourPillars,
  hourPillar,
  pillarFromCycle,
  STEMS,
  tenGod,
  yearPillarFromAdjustedYear,
} from "../dist/index.js";

test("60갑자 순환의 시작과 끝을 보존한다", () => {
  assert.equal(pillarFromCycle(0).hanja, "甲子");
  assert.equal(pillarFromCycle(59).hanja, "癸亥");
  assert.equal(pillarFromCycle(60).hangul, "갑자");
});

test("입춘 경계를 적용한 연도를 연주로 변환한다", () => {
  assert.equal(yearPillarFromAdjustedYear(1984).hangul, "갑자");
  assert.equal(yearPillarFromAdjustedYear(2024).hangul, "갑진");
});

test("갑일의 자시와 미시 시주를 계산한다", () => {
  assert.equal(hourPillar(0, 0).hangul, "갑자");
  assert.equal(hourPillar(0, 13).hangul, "신미");
  assert.equal(hourPillar(0, 23).hangul, "갑자");
});

test("일간과 대상 천간의 생극 및 음양으로 십신을 정한다", () => {
  assert.equal(tenGod(STEMS[0], STEMS[0]), "비견");
  assert.equal(tenGod(STEMS[0], STEMS[1]), "겁재");
  assert.equal(tenGod(STEMS[0], STEMS[2]), "식신");
  assert.equal(tenGod(STEMS[0], STEMS[5]), "정재");
  assert.equal(tenGod(STEMS[0], STEMS[6]), "편관");
  assert.equal(tenGod(STEMS[0], STEMS[9]), "정인");
});

test("검증된 달력 경계값으로 네 기둥과 분석을 조립한다", () => {
  const chart = deriveFourPillars({
    yearCycleIndex: 40,
    solarMonthIndex: 0,
    dayCycleIndex: 0,
    hour: 13,
  });
  assert.deepEqual(
    [chart.year.hangul, chart.month.hangul, chart.day.hangul, chart.hour.hangul],
    ["갑진", "병인", "갑자", "신미"],
  );
  assert.equal(Object.values(countPrincipalElements(chart)).reduce((sum, value) => sum + value, 0), 8);
  assert.deepEqual(analyzeStemTenGods(chart), { year: "비견", month: "식신", hour: "정관" });
});
