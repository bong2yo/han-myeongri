# han-myeongri

한국 사주명리 계산을 **추측하지 않고 검증 가능한 규칙으로** 구현하는 TypeScript 라이브러리입니다.

현재 `0.2.0`은 천간·지지·60갑자, 오행·십신, 한국 음양력 기반 출생 사주, 합·충·형·파·해, 대운 간지, 세운·월운과 전통 토정비결 144괘 작괘를 제공합니다. 달력 자료와 계산 코드는 패키지에 함께 설치되며 런타임 HTTP 요청, 외부 API 키 또는 원격 데이터베이스가 필요하지 않습니다.

## 설치

```bash
npm install @bong2yo/han-myeongri
```

## 사용 예

```ts
import {
  analyzeStemTenGods,
  countPrincipalElements,
  deriveFourPillars,
} from "@bong2yo/han-myeongri";

const chart = deriveFourPillars({
  yearCycleIndex: 40, // 갑진
  solarMonthIndex: 0, // 인월
  dayCycleIndex: 0,   // 갑자일
  hour: 13,           // 미시
});

console.log(chart.year.hangul); // 갑진
console.log(countPrincipalElements(chart));
console.log(analyzeStemTenGods(chart));
```

### 생년월일에서 오프라인 계산

```ts
import { calculateBirthChart } from "@bong2yo/han-myeongri";

const result = calculateBirthChart({
  calendar: "solar",
  year: 1984,
  month: 11,
  day: 11,
  hour: 10,
  minute: 0,
  longitude: 128.108, // 경남 진주
});

console.log(result.pillars.year.hangul);  // 갑자
console.log(result.pillars.month.hangul); // 을해
console.log(result.pillars.day.hangul);   // 기유
console.log(result.pillars.hour.hangul);  // 기사
console.log(result.lunar);                // 1984-10-19 평달
```

`calculateBirthChart()`는 동기 함수이며 네트워크를 사용하지 않습니다. 현재 내장 달력의 지원 범위는 1900~2050년입니다.

### 토정비결 144괘 오프라인 작괘

```ts
import { calculateTojeong } from "@bong2yo/han-myeongri";

const tojeong = calculateTojeong({
  calendar: "lunar", year: 1988, month: 6, day: 9, hour: 12,
}, 2023);

console.log(tojeong.code);    // 343
console.log(tojeong.monthly); // 자체 작성한 참고용 12개월 흐름
```

`traditional-144-v1`은 세는나이와 음력을 사용하고 태세수·월건수·일진수 표로 상괘 1~8, 중괘 1~6, 하괘 1~3을 계산합니다. 고전 원문은 판본 검증 전까지 포함하지 않으며 `originalText: null`, `sourceEdition: "not-yet-curated"`로 명시합니다.

### 합충형파해와 운의 간지

```ts
import { analyzePillarRelations, calculateBirthChart, calculateMajorLuck, calculateYearMonthLuck } from "@bong2yo/han-myeongri";

const chart = calculateBirthChart({ calendar: "solar", year: 1984, month: 11, day: 11, hour: 10 });
const relations = analyzePillarRelations(chart.pillars);
const major = calculateMajorLuck(chart, "male", 7);
const current = calculateYearMonthLuck(chart, 2026, 10);
```

대운 시작 나이는 절입 환산과 반올림 관법에 따라 달라지므로 `calculateMajorLuck()` 호출자가 검증한 시작 나이를 명시합니다. 라이브러리는 적용한 관법을 결과에 함께 반환합니다.

## 정확성 원칙

- 계산 결과와 해석 문장을 분리합니다.
- 입춘·절기 경계는 날짜가 아닌 정확한 시각으로 판정합니다.
- 진태양시, 자시 일 경계, 대운 순역행 등 관법을 옵션과 메타데이터로 공개합니다.
- 한국천문연구원 달력 자료와 경계 사례를 golden test로 검증합니다.
- 전통문화 기반 계산이며 과학적 예측이나 전문적인 의사결정을 대신하지 않습니다.

## 로드맵

- [x] 천간·지지·60갑자 자료형
- [x] 연주·월주·시주 계산 프리미티브
- [x] 오행 기초 분포와 천간 십신
- [x] 한국 음양력·윤달 변환 어댑터
- [x] 합·충·형·파·해 관계 탐지
- [x] 세운·월운과 대운 순역행·간지
- [x] 토정비결 상·중·하괘 및 144괘 작괘
- [x] 자체 현대어 월별 참고 흐름
- [ ] 분 단위 24절기와 입춘 경계 엔진
- [ ] 일주와 자시 경계 관법
- [ ] 지장간 가중치
- [ ] 대운 시작 나이 절입 자동 환산
- [ ] 출처 검증된 토정비결 고전 원문·괘사
- [ ] 한국천문연구원 대조 테스트 벡터
- [ ] npm 배포

## 개발

```bash
pnpm install
pnpm test
```

## 라이선스

MIT
