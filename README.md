# han-myeongri

한국 사주명리 계산을 **추측하지 않고 검증 가능한 규칙으로** 구현하는 TypeScript 라이브러리입니다.

현재 `0.1.0`은 천간·지지·60갑자, 오행 기초 분포, 천간 십신과 한국 음양력 기반 출생 사주 계산을 제공합니다. 달력 자료와 계산 코드는 패키지에 함께 설치되며 런타임 HTTP 요청, 외부 API 키 또는 원격 데이터베이스가 필요하지 않습니다.

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
- [ ] 분 단위 24절기와 입춘 경계 엔진
- [ ] 일주와 자시 경계 관법
- [ ] 지장간 가중치·합충형파해
- [ ] 대운·세운·월운
- [ ] 한국천문연구원 대조 테스트 벡터
- [ ] npm 배포

## 개발

```bash
pnpm install
pnpm test
```

## 라이선스

MIT
