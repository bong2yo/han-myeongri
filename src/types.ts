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

export type BirthDateInput = Readonly<{
  calendar: "solar" | "lunar";
  year: number;
  month: number;
  day: number;
  /** 음력 입력일 때만 사용합니다. */
  isLeapMonth?: boolean;
  hour: number;
  minute?: number;
  /** 출생지 경도. 생략하면 서울 기준 127도를 사용합니다. */
  longitude?: number;
  /** 경도 기반 시간 보정 적용 여부. 기본값은 true입니다. */
  applyTimeCorrection?: boolean;
}>;

export type CalendarDate = Readonly<{
  year: number;
  month: number;
  day: number;
}>;

export type LunarDate = CalendarDate & Readonly<{ isLeapMonth: boolean }>;

export type OfflineBirthChart = Readonly<{
  source: "embedded-korean-calendar";
  solar: CalendarDate;
  lunar: LunarDate;
  pillars: FourPillars;
  principalElements: Readonly<Record<Element, number>>;
  stemTenGods: Readonly<{
    year: TenGod;
    month: TenGod;
    hour: TenGod;
  }>;
  timeCorrection: Readonly<{
    applied: boolean;
    correctedHour?: number;
    correctedMinute?: number;
  }>;
}>;
