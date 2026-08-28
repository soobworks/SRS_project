/**
 * 시나리오 스위처 — 프로토타입 전용, 폐기 예정
 *
 * `?state=<PRD 화면 ID>` 로 화면 상태를 전환한다(명세 §1.1).
 * PRD가 ID를 부여하지 않은 하위 상태는 보조 쿼리 파라미터로 표현한다
 * (`?state=A-16&match=2`, `?state=A-13&set=one-commute` 등).
 *
 * ⚠️ `J-006` 완료 시 `lib/dev/` 전체와 함께 삭제한다.
 */

import listingsJson from "@/lib/external/fixtures/listings.json";
import { SCENARIO_SETS, DEFAULT_SET } from "./judgments.fixture";
import type { FixtureListing, ScenarioSet } from "./view-types";

export const LISTINGS = listingsJson as FixtureListing[];

export const listingById = (id: string): FixtureListing =>
  LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];

/**
 * 화면 ID → 조건 세트. `set` 쿼리가 있으면 그쪽이 우선한다.
 * 표에 없는 화면은 `normal`을 쓴다.
 */
const STATE_TO_SET: Record<string, string> = {
  // `A-05`는 A만 입력한 시점이라 B가 없다 — `A-12`와 같은 1인 기준이어야
  // 실부담이 어긋나지 않는다(명세 §6.4 "한 명만" 열).
  "A-05": "solo",
  "A-12": "solo",
  "A-14e": "solo",
  "A-13b": "all-unmet",
  "A-13c": "all-unmet",
  "A-15": "all-unmet",
  "A-13b-2": "all-unmet-hard",
};

export function resolveSet(state?: string, set?: string): ScenarioSet {
  if (set && SCENARIO_SETS[set]) return SCENARIO_SETS[set];
  const byState = state ? STATE_TO_SET[state] : undefined;
  return SCENARIO_SETS[byState ?? DEFAULT_SET] ?? SCENARIO_SETS[DEFAULT_SET];
}

export { SCENARIO_SETS };

// ── 선호 카드 — 명세 §8.2 ─────────────────────────────────────────────
// 판정에 어떤 형태로도 연결하지 않는다. 매물별 ✓/✗ 를 붙이지 않는다.
// A·B 문장 수를 3개/2개로 다르게 둬 개수 차이가 카드 비중을 흔드는지 본다.

export const PREFERENCES = {
  a: [
    "햇빛 잘 드는 집이면 좋겠어요",
    "3층 이상이면 좋겠어요",
    "가까운 곳에 마트가 있으면 편해요",
  ],
  b: ["조용한 동네였으면 해요", "분리형 구조면 좋겠어요"],
};

// ── 전제 11종 — 명세 §5.4 (A-04a 전제 패널의 정본) ────────────────────

export type Confidence = "근거 있음" | "근거 있음/신뢰도 중간" | "가정" | "TBD";

export interface Assumption {
  label: string;
  value: string;
  confidence: Confidence;
  note: string;
}

export const ASSUMPTIONS: Assumption[] = [
  { label: "기회비용률", value: "연 3.08%", confidence: "근거 있음", note: "2026-06 예금은행 저축성수신금리 · 사용자 변경 가능" },
  { label: "전세대출 금리", value: "연 4.00% (3.8~4.2%)", confidence: "근거 있음", note: "2026-07 공사 보증서 담보 평균 · 실제 심사 결과와 다름" },
  { label: "거주 기간", value: "24개월", confidence: "가정", note: "표준 임대차 기간 전제" },
  { label: "월 근무일수", value: "20일", confidence: "가정", note: "계산 전제" },
  { label: "휘발유 가격", value: "전국 1,864원/L · 서울 1,910원/L", confidence: "근거 있음", note: "2026-08 2주차 · 주간 변동" },
  { label: "자차 실연비", value: "10km/L", confidence: "가정", note: "신뢰도 낮음 · 사용자 조정 가능" },
  { label: "자차 통행료", value: "0원 기본", confidence: "가정", note: "사용자 입력 시 반영" },
  { label: "중개보수", value: "구간별 법정 상한", confidence: "근거 있음", note: "확정 비용이 아니라 상한 기준 최대" },
  { label: "이사비", value: "원룸 40~60만 · 투룸 50~110만 · 34평 100~150만", confidence: "근거 있음/신뢰도 중간", note: "범위만 제시" },
  { label: "입주청소", value: "평당 1.2~1.5만 (신축 1.8만)", confidence: "근거 있음/신뢰도 중간", note: "범위만 제시" },
  { label: "관리비 별도 항목", value: "추정 범위 미확정", confidence: "TBD", note: "표시 관리비만 반영 · 별도 항목은 확인 필요로 둔다(명세 §5.6)" },
  { label: "교통비", value: "1인당 왕복 3,000원 × 20일", confidence: "가정", note: "픽스처 단순화 — 실제는 거리비례(명세 §6.4)" },
];

export const ASSUMPTION_BASIS = "기준 2026-06";
export const NOT_ADVICE = "본 계산은 금융 조언이나 대출 가능성 판단이 아닙니다.";

// ── 양보 문장 — R-001 / A-14b (명세 §4.3 문장 내 삽입) ────────────────
// 고정 템플릿: [누가][무엇을][얼마나] 감수하고, [대신][같은 후보 5개 안에서][무엇이] 낫다
// 얻는 점이 없으면 `대신` 절을 제거한다(PRD §14.2). 결론을 붙이지 않는다.

export interface CompromiseSentenceView {
  listingId: string;
  /** 감수하는 사람 라벨 — "A" 또는 "B". */
  who: string;
  /** "예산을 월 5만원 더" 처럼 [무엇을][얼마나]가 합쳐진 절. */
  what: string;
  /** 얻는 점. 없으면 null이고 `대신` 절 자체를 렌더하지 않는다. */
  instead: string | null;
  /** 미충족이 3개 이상일 때 문장에 들어가지 못한 나머지. */
  remaining: string[];
}

/**
 * PRD §14.1 — 양보 문장은 **한쪽만 충족하는 매물**에만 붙는다.
 * `둘 다 불충족`·`둘 다 충족`에는 문장이 없다. 문장이 조건 세트와 어긋나
 * 표를 배반하는 것을 막으려면 대상을 이렇게 좁혀야 한다.
 * 지금 픽스처에서 `한쪽만 충족`은 `normal` 세트의 `L-001` 하나뿐이다.
 */
export const COMPROMISE_SENTENCES: Record<string, CompromiseSentenceView> = {
  "L-001": {
    listingId: "L-001",
    who: "B",
    what: "예산을 월 5만원 더",
    instead: "같은 후보 5곳 중 통근이 가장 짧고(18분), 원하던 아파트예요",
    remaining: [],
  },
};

// ── 완화 미리보기 — R-002 ① / A-15 (명세 §4.3, PRD §14.3) ─────────────
// 완화폭은 임의값이 아니라 **실제 미달량**에서만 가져온다.
// A안·B안을 항상 동시에 보여준다. 두 조건 동시 완화안은 만들지 않는다.

export interface RelaxationOption {
  who: "A" | "B";
  conditionLabel: string;
  from: string;
  to: string;
  /** 완화폭 = 실제 미달량. */
  delta: string;
  /** 이 완화로 그룹이 바뀌는 매물. */
  recovers: string[];
}

/**
 * `all-unmet` 세트 기준이며 값은 `judgments.fixture.ts`의 실제 미달량과 일치해야 한다.
 *
 * A안 — L-005에서 A의 미충족은 예산 하나뿐이라(`+월 3만`) 그만큼 풀면 A가 전부
 * 충족으로 바뀌고 후보가 `한쪽만 충족`으로 살아난다(명세 §6.7).
 *
 * B안 — B는 어느 후보에서도 미충족이 2개 이상이라(L-001 예산 `+월 15만` **및**
 * 통근 `+3분`) **한 조건만 풀어서는 살아나는 후보가 없다.** 그래서 `recovers`가
 * 비어 있고 화면도 그렇게 말한다. 없는 이득을 만들어내지 않는다(PRD §14.2).
 * A안·B안을 둘 다 보여주는 것은 유지한다(PRD §14.3).
 */
export const RELAXATION_OPTIONS: RelaxationOption[] = [
  {
    who: "A",
    conditionLabel: "예산",
    from: "70만",
    to: "약 73만",
    delta: "+월 3만",
    recovers: ["L-005"],
  },
  {
    who: "B",
    conditionLabel: "통근",
    from: "15분",
    to: "18분",
    delta: "+3분",
    recovers: [],
  },
];

// ── 재탐색 필터 — R-002 ③ / A-13b-2 (명세 §7.2) ───────────────────────
// A와 B 중 **더 엄격한 쪽**을 고른다. 통근시간은 필터에서 제외한다.
// 검색 결과 수와 필터 URL 규격은 PRD [TBD](LIM-07) — 만들지 않는다.

export const SEARCH_FILTER = [
  { label: "예산", current: "A 60만 / B 65만", proposed: "월 실부담 60만 이하", note: "낮은 상한" },
  { label: "통근시간", current: "A 15분 / B 12분", proposed: null, note: "네이버 검색에 통근시간 축이 없어 필터에서 빠집니다" },
  { label: "전용면적", current: "A 65㎡ 이상", proposed: "전용 65㎡ 이상", note: "높은 하한" },
  { label: "매물 유형", current: "B 아파트", proposed: "아파트", note: "" },
];

// ── 방문 후보 선택 — V-001 / A-16 · A-16e (명세 §6.8) ─────────────────
// 투표·순위·자동 선택을 만들지 않는다(`decisions/0004`).

export interface VisitRound {
  aPicks: string[];
  bPicks: string[];
  matched: string[];
  /** 최종 확정 2곳. 아직 정해지지 않았으면 null. */
  settled: string[] | null;
  round: 1 | 2;
  /** 남은 한 자리를 두고 비교할 두 후보(A-16e). */
  runoff: [string, string] | null;
  /**
   * 2라운드에서도 겹치지 않아 **각자 고른 곳을 하나씩 나눠** 보러 가는 종료.
   * `decisions/0004` — 투표·순위·자동 선택으로 하나를 고르지 않는다(AC-17-03).
   */
  splitEnding?: boolean;
}

export const VISIT_ROUNDS: Record<string, VisitRound> = {
  "2": {
    aPicks: ["L-001", "L-004"],
    bPicks: ["L-001", "L-004"],
    matched: ["L-001", "L-004"],
    settled: ["L-001", "L-004"],
    round: 1,
    runoff: null,
  },
  "1": {
    aPicks: ["L-001", "L-004"],
    bPicks: ["L-004", "L-002"],
    matched: ["L-004"],
    settled: null,
    round: 1,
    runoff: ["L-001", "L-002"],
  },
  "0": {
    aPicks: ["L-001", "L-004"],
    bPicks: ["L-002", "L-003"],
    matched: [],
    settled: null,
    round: 2,
    runoff: null,
  },
  split: {
    aPicks: ["L-001", "L-004"],
    bPicks: ["L-002", "L-003"],
    matched: [],
    /** A가 고른 1곳 + B가 고른 1곳. 시스템이 고른 것이 아니다. */
    settled: ["L-001", "L-002"],
    round: 2,
    runoff: null,
    splitEnding: true,
  },
};
