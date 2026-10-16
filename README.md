# han-myeongri

한국 사주명리 계산을 **추측하지 않고 검증 가능한 규칙으로** 구현하는 TypeScript 라이브러리입니다.

현재 `0.1.0`은 천간·지지·60갑자, 연주·월주·시주 조립, 오행 기초 분포와 천간 십신을 제공합니다. 음양력 변환과 절입 시각은 아직 내장하지 않았으며, 달력 엔진이 검증한 경계값을 명시적으로 받습니다. 미완성 계산을 정확한 만세력처럼 표시하지 않는 것이 이 프로젝트의 원칙입니다.

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
- [ ] 한국 음양력·윤달 변환 어댑터
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
