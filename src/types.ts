export type Element = "wood" | "fire" | "earth" | "metal" | "water";
export type Polarity = "yang" | "yin";

export type Stem = Readonly<{
  index: number;
  hangul: string;
  hanja: string;
  element: Element;
  polarity: Polarity;
}>;

export type Branch = Readonly<{
  index: number;
  hangul: string;
  hanja: string;
  animal: string;
  element: Element;
  polarity: Polarity;
}>;

export type Pillar = Readonly<{
  cycleIndex: number;
  stem: Stem;
  branch: Branch;
  hangul: string;
  hanja: string;
}>;

export type FourPillars = Readonly<{
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}>;

export type TenGod =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인";

export interface CalendarFacts {
  /** 0=갑자 ... 59=계해. 절입 시각을 반영한 연주 주기값입니다. */
  yearCycleIndex: number;
  /** 0=인월 ... 11=축월. 날짜가 아니라 절입 시각 기준입니다. */
  solarMonthIndex: number;
  /** 0=갑자 ... 59=계해. 선택한 자시 관법을 반영한 일진입니다. */
  dayCycleIndex: number;
  /** 시계 기준 시각. 진태양시를 적용한다면 보정 후 값을 전달합니다. */
  hour: number;
}
