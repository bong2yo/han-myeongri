import assert from "node:assert/strict";
import test from "node:test";
import { calculateBirthChart } from "../dist/index.js";

test("외부 네트워크 없이 양력 생년월일의 사주를 계산한다", () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("network access is forbidden in offline calculation tests");
  };

  try {
    const result = calculateBirthChart({
      calendar: "solar",
      year: 1984,
      month: 11,
      day: 11,
      hour: 10,
      minute: 0,
      longitude: 128.108,
    });

    assert.equal(fetchCalls, 0);
    assert.equal(result.source, "embedded-korean-calendar");
    assert.deepEqual(
      [
        result.pillars.year.hangul,
        result.pillars.month.hangul,
        result.pillars.day.hangul,
        result.pillars.hour.hangul,
      ],
      ["갑자", "을해", "기유", "기사"],
    );
    assert.deepEqual(result.lunar, {
      year: 1984,
      month: 10,
      day: 19,
      isLeapMonth: false,
    });
    assert.deepEqual(result.principalElements, {
      wood: 2,
      fire: 1,
      earth: 2,
      metal: 1,
      water: 2,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("음력 입력과 윤달 플래그를 로컬 데이터로 변환한다", () => {
  const result = calculateBirthChart({
    calendar: "lunar",
    year: 1984,
    month: 10,
    day: 19,
    isLeapMonth: false,
    hour: 10,
    longitude: 128.108,
  });
  assert.deepEqual(result.solar, { year: 1984, month: 11, day: 11 });
  assert.equal(result.pillars.day.hangul, "기유");
});
