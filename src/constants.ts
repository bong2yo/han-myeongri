import type { Branch, Element, Stem } from "./types.js";

export const ELEMENT_HANGUL: Readonly<Record<Element, string>> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export const STEMS: readonly Stem[] = [
  { index: 0, hangul: "갑", hanja: "甲", element: "wood", polarity: "yang" },
  { index: 1, hangul: "을", hanja: "乙", element: "wood", polarity: "yin" },
  { index: 2, hangul: "병", hanja: "丙", element: "fire", polarity: "yang" },
  { index: 3, hangul: "정", hanja: "丁", element: "fire", polarity: "yin" },
  { index: 4, hangul: "무", hanja: "戊", element: "earth", polarity: "yang" },
  { index: 5, hangul: "기", hanja: "己", element: "earth", polarity: "yin" },
  { index: 6, hangul: "경", hanja: "庚", element: "metal", polarity: "yang" },
  { index: 7, hangul: "신", hanja: "辛", element: "metal", polarity: "yin" },
  { index: 8, hangul: "임", hanja: "壬", element: "water", polarity: "yang" },
  { index: 9, hangul: "계", hanja: "癸", element: "water", polarity: "yin" },
] as const;

export const BRANCHES: readonly Branch[] = [
  { index: 0, hangul: "자", hanja: "子", animal: "쥐", element: "water", polarity: "yang" },
  { index: 1, hangul: "축", hanja: "丑", animal: "소", element: "earth", polarity: "yin" },
  { index: 2, hangul: "인", hanja: "寅", animal: "호랑이", element: "wood", polarity: "yang" },
  { index: 3, hangul: "묘", hanja: "卯", animal: "토끼", element: "wood", polarity: "yin" },
  { index: 4, hangul: "진", hanja: "辰", animal: "용", element: "earth", polarity: "yang" },
  { index: 5, hangul: "사", hanja: "巳", animal: "뱀", element: "fire", polarity: "yin" },
  { index: 6, hangul: "오", hanja: "午", animal: "말", element: "fire", polarity: "yang" },
  { index: 7, hangul: "미", hanja: "未", animal: "양", element: "earth", polarity: "yin" },
  { index: 8, hangul: "신", hanja: "申", animal: "원숭이", element: "metal", polarity: "yang" },
  { index: 9, hangul: "유", hanja: "酉", animal: "닭", element: "metal", polarity: "yin" },
  { index: 10, hangul: "술", hanja: "戌", animal: "개", element: "earth", polarity: "yang" },
  { index: 11, hangul: "해", hanja: "亥", animal: "돼지", element: "water", polarity: "yin" },
] as const;
