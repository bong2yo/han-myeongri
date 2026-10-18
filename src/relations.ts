import type { FourPillars, Pillar } from "./types.js";

export type RelationKind =
  | "천간합" | "천간충" | "육합" | "삼합" | "방합"
  | "충" | "형" | "파" | "해";

export type PillarPosition = "year" | "month" | "day" | "hour" | "luck";

export type PillarRelation = Readonly<{
  kind: RelationKind;
  positions: readonly PillarPosition[];
  symbols: string;
}>;

const pairKey = (a: number, b: number): string => [a, b].sort((x, y) => x - y).join("-");
const STEM_COMBINE = new Set(["0-5", "1-6", "2-7", "3-8", "4-9"]);
const STEM_CLASH = new Set(["0-6", "1-7", "2-8", "3-9"]);
const BRANCH_COMBINE = new Set(["0-1", "2-11", "3-10", "4-9", "5-8", "6-7"]);
const BRANCH_CLASH = new Set(["0-6", "1-7", "2-8", "3-9", "4-10", "5-11"]);
const BRANCH_BREAK = new Set(["0-9", "1-4", "2-11", "3-6", "5-8", "7-10"]);
const BRANCH_HARM = new Set(["0-7", "1-6", "2-5", "3-4", "8-11", "9-10"]);
const THREE_HARMONIES = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]] as const;
const DIRECTIONS = [[11, 0, 1], [2, 3, 4], [5, 6, 7], [8, 9, 10]] as const;
const THREE_PUNISHMENTS = [[2, 5, 8], [1, 10, 7]] as const;

export function analyzePillarRelations(
  chart: FourPillars,
  luck?: Pillar,
): readonly PillarRelation[] {
  const entries: [PillarPosition, Pillar][] = [
    ["year", chart.year], ["month", chart.month], ["day", chart.day], ["hour", chart.hour],
  ];
  if (luck) entries.push(["luck", luck]);
  const results: PillarRelation[] = [];

  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const left = entries[i]!;
      const right = entries[j]!;
      const stemKey = pairKey(left[1].stem.index, right[1].stem.index);
      const branchKey = pairKey(left[1].branch.index, right[1].branch.index);
      const positions = [left[0], right[0]] as const;
      if (STEM_COMBINE.has(stemKey)) results.push({ kind: "천간합", positions, symbols: `${left[1].stem.hanja}${right[1].stem.hanja}` });
      if (STEM_CLASH.has(stemKey)) results.push({ kind: "천간충", positions, symbols: `${left[1].stem.hanja}${right[1].stem.hanja}` });
      if (BRANCH_COMBINE.has(branchKey)) results.push({ kind: "육합", positions, symbols: `${left[1].branch.hanja}${right[1].branch.hanja}` });
      if (BRANCH_CLASH.has(branchKey)) results.push({ kind: "충", positions, symbols: `${left[1].branch.hanja}${right[1].branch.hanja}` });
      if (BRANCH_BREAK.has(branchKey)) results.push({ kind: "파", positions, symbols: `${left[1].branch.hanja}${right[1].branch.hanja}` });
      if (BRANCH_HARM.has(branchKey)) results.push({ kind: "해", positions, symbols: `${left[1].branch.hanja}${right[1].branch.hanja}` });
      if (branchKey === "0-3") results.push({ kind: "형", positions, symbols: `${left[1].branch.hanja}${right[1].branch.hanja}` });
    }
  }

  const addGroup = (kind: RelationKind, group: readonly number[]): void => {
    const matches = entries.filter(([, pillar]) => group.includes(pillar.branch.index));
    if (new Set(matches.map(([, pillar]) => pillar.branch.index)).size === group.length) {
      results.push({ kind, positions: matches.map(([position]) => position), symbols: matches.map(([, pillar]) => pillar.branch.hanja).join("") });
    }
  };
  THREE_HARMONIES.forEach((group) => addGroup("삼합", group));
  DIRECTIONS.forEach((group) => addGroup("방합", group));
  THREE_PUNISHMENTS.forEach((group) => addGroup("형", group));
  for (const branchIndex of [4, 6, 9, 11]) {
    const matches = entries.filter(([, pillar]) => pillar.branch.index === branchIndex);
    if (matches.length >= 2) results.push({ kind: "형", positions: matches.map(([position]) => position), symbols: matches.map(([, pillar]) => pillar.branch.hanja).join("") });
  }
  return results;
}
