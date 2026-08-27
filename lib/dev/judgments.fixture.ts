/**
 * 판정 결과 픽스처 — 프로토타입 전용
 *
 * ⚠️ **폐기 예정.** `J-006`(5분류 상태 분류) 완료 시 이 파일을 삭제하고,
 * 화면의 픽스처 주입 지점 한 줄을 `lib/queries/judgment.queries.ts` 호출로 바꾼다.
 *
 * 이 파일은 `prototype-visual-spec.md` §6.6·§6.7 표를 **전사한 것**이다.
 * 상태(`status`)를 코드로 계산하지 않는다 — 판정 로직은 `J-001`·`J-003`·`J-006`의
 * 몫이고 이 프로토타입의 범위 밖이다. 표와 어긋나면 표를 먼저 확인한다.
 *
 * 금지: `totalScore`·`rank`·`recommendation` 류 필드를 넣지 않는다.
 * 픽스처에 들어가는 순간 화면이 그것을 소비하고 제품 정체성이 무너진다.
 */

import type { ConditionKey } from "@/lib/types";
import type { ConditionRow, ListingJudgment, ScenarioSet } from "./view-types";

const LISTING_IDS = ["L-001", "L-002", "L-003", "L-004", "L-005"] as const;

// ── 행 생성기 (표시용 조립일 뿐, 판정하지 않는다) ──────────────────────

type Cmp = ConditionRow["comparator"];

const row = (
  key: ConditionKey,
  label: string,
  actual: string,
  comparator: Cmp,
  threshold: string | null,
  status: ConditionRow["status"],
  gap: string | null,
  estimated = false,
): ConditionRow => ({
  key,
  label,
  actual,
  comparator,
  threshold,
  status,
  gap,
  estimated,
});

/** 충족 */
const met = (k: ConditionKey, l: string, a: string, c: Cmp, t: string, e = false) =>
  row(k, l, a, c, t, "MET", null, e);

/** 미충족 — 미달량 표기는 PRD §12.3 `미달 표현` 열을 그대로 쓴다. */
const unmet = (
  k: ConditionKey,
  l: string,
  a: string,
  c: Cmp,
  t: string,
  gap: string,
  e = false,
) => row(k, l, a, c, t, "UNMET", gap, e);

/** 확인 필요 — 데이터가 없어 판정할 수 없다. 미충족으로 접지 않는다. */
const confirm = (k: ConditionKey, l: string, t: string) =>
  row(k, l, "데이터 없음", null, t, "CONFIRMATION_NEEDED", null);

/** 계산 불가 — 재려 했지만 실패했다. 미충족과 구분한다(PRD §18.3). */
const failed = (k: ConditionKey, l: string, t: string) =>
  row(k, l, "계산 불가", null, t, "CALCULATION_FAILED", null);

/** 해당 없음 — 잴 대상 자체가 없다. 0으로 계산하지 않는다(PRD §19.2). */
const na = (k: ConditionKey, l: string) =>
  row(k, l, "해당 없음", null, null, "NOT_APPLICABLE", null);

/** 기준 없음 — 그 사람이 이 조건을 걸지 않았다. 행은 지우지 않는다(명세 §4.3). */
const noRule = (k: ConditionKey, l: string, a: string) =>
  row(k, l, a, null, null, "NOT_APPLICABLE", null);

const j = (
  listingId: string,
  group: ListingJudgment["group"],
  confirmationNeeded: boolean,
  a: ConditionRow[],
  b: ConditionRow[],
): ListingJudgment => ({ listingId, group, confirmationNeeded, a, b });

// ── 세트 1: normal — 명세 §6.6 ────────────────────────────────────────
// A 예산 100만 · 통근 25분 · 면적 60㎡ · 주차 있음
// B 예산 85만 · 통근 20분 · 유형 아파트   (둘 다 출퇴근)

const NORMAL: ListingJudgment[] = [
  j("L-001", "ONE_SIDE_ONLY", false,
    [
      met("budget", "예산", "약 90만", "≤", "100만", true),
      met("commute", "통근", "25분", "≤", "25분"),
      met("area", "면적", "68㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      unmet("budget", "예산", "약 90만", ">", "85만", "+월 5만", true),
      met("commute", "통근", "18분", "≤", "20분"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),

  j("L-002", "BOTH_UNMET", false,
    [
      met("budget", "예산", "약 82만", "≤", "100만", true),
      unmet("commute", "통근", "28분", ">", "25분", "+3분"),
      unmet("area", "면적", "59㎡", "<", "60㎡", "−1㎡"),
      unmet("parking", "주차", "없음", "≠", "있음", "없음"),
    ],
    [
      met("budget", "예산", "약 82만", "≤", "85만", true),
      unmet("commute", "통근", "22분", ">", "20분", "+2분"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),

  j("L-003", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 104만", ">", "100만", "+월 4만", true),
      unmet("commute", "통근", "30분", ">", "25분", "+5분"),
      unmet("area", "면적", "44㎡", "<", "60㎡", "−16㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      unmet("budget", "예산", "약 104만", ">", "85만", "+월 19만", true),
      failed("commute", "통근", "20분"),
      unmet("listingType", "유형", "오피스텔", "≠", "아파트", "오피스텔"),
    ]),

  j("L-004", "BOTH_MET", false,
    [
      met("budget", "예산", "약 85만", "≤", "100만", true),
      met("commute", "통근", "18분", "≤", "25분"),
      met("area", "면적", "74㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      met("budget", "예산", "약 85만", "≤", "85만", true),
      met("commute", "통근", "19분", "≤", "20분"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),

  j("L-005", "BOTH_UNMET", true,
    [
      met("budget", "예산", "약 73만", "≤", "100만", true),
      unmet("commute", "통근", "32분", ">", "25분", "+7분"),
      unmet("area", "면적", "52㎡", "<", "60㎡", "−8㎡"),
      confirm("parking", "주차", "있음"),
    ],
    [
      met("budget", "예산", "약 73만", "≤", "85만", true),
      met("commute", "통근", "20분", "≤", "20분"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
];

// ── 세트 2: all-unmet — 명세 §6.7 (한 조건 완화로 회복 가능) ───────────
// A 예산 70만 · 통근 35분 · 면적 50㎡
// B 예산 75만 · 통근 15분 · 유형 아파트

const ALL_UNMET: ListingJudgment[] = [
  j("L-001", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 90만", ">", "70만", "+월 20만", true),
      met("commute", "통근", "25분", "≤", "35분"),
      met("area", "면적", "68㎡", "≥", "50㎡"),
    ],
    [
      unmet("budget", "예산", "약 90만", ">", "75만", "+월 15만", true),
      unmet("commute", "통근", "18분", ">", "15분", "+3분"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),

  j("L-002", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 82만", ">", "70만", "+월 12만", true),
      met("commute", "통근", "28분", "≤", "35분"),
      met("area", "면적", "59㎡", "≥", "50㎡"),
    ],
    [
      unmet("budget", "예산", "약 82만", ">", "75만", "+월 7만", true),
      unmet("commute", "통근", "22분", ">", "15분", "+7분"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),

  j("L-003", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 104만", ">", "70만", "+월 34만", true),
      met("commute", "통근", "30분", "≤", "35분"),
      unmet("area", "면적", "44㎡", "<", "50㎡", "−6㎡"),
    ],
    [
      unmet("budget", "예산", "약 104만", ">", "75만", "+월 29만", true),
      failed("commute", "통근", "15분"),
      unmet("listingType", "유형", "오피스텔", "≠", "아파트", "오피스텔"),
    ]),

  j("L-004", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 85만", ">", "70만", "+월 15만", true),
      met("commute", "통근", "18분", "≤", "35분"),
      met("area", "면적", "74㎡", "≥", "50㎡"),
    ],
    [
      unmet("budget", "예산", "약 85만", ">", "75만", "+월 10만", true),
      unmet("commute", "통근", "19분", ">", "15분", "+4분"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),

  j("L-005", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 73만", ">", "70만", "+월 3만", true),
      met("commute", "통근", "32분", "≤", "35분"),
      met("area", "면적", "52㎡", "≥", "50㎡"),
    ],
    [
      met("budget", "예산", "약 73만", "≤", "75만", true),
      unmet("commute", "통근", "20분", ">", "15분", "+5분"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
];

// ── 세트 3: all-unmet-hard — 명세 §6.5 (단일 완화로 회복 불가) ─────────
// A 예산 60만 · 통근 15분 · 면적 65㎡
// B 예산 65만 · 통근 12분 · 유형 아파트

const ALL_UNMET_HARD: ListingJudgment[] = [
  j("L-001", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 90만", ">", "60만", "+월 30만", true),
      unmet("commute", "통근", "25분", ">", "15분", "+10분"),
      met("area", "면적", "68㎡", "≥", "65㎡"),
    ],
    [
      unmet("budget", "예산", "약 90만", ">", "65만", "+월 25만", true),
      unmet("commute", "통근", "18분", ">", "12분", "+6분"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),

  j("L-002", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 82만", ">", "60만", "+월 22만", true),
      unmet("commute", "통근", "28분", ">", "15분", "+13분"),
      unmet("area", "면적", "59㎡", "<", "65㎡", "−6㎡"),
    ],
    [
      unmet("budget", "예산", "약 82만", ">", "65만", "+월 17만", true),
      unmet("commute", "통근", "22분", ">", "12분", "+10분"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),

  j("L-003", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 104만", ">", "60만", "+월 44만", true),
      unmet("commute", "통근", "30분", ">", "15분", "+15분"),
      unmet("area", "면적", "44㎡", "<", "65㎡", "−21㎡"),
    ],
    [
      unmet("budget", "예산", "약 104만", ">", "65만", "+월 39만", true),
      failed("commute", "통근", "12분"),
      unmet("listingType", "유형", "오피스텔", "≠", "아파트", "오피스텔"),
    ]),

  j("L-004", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 85만", ">", "60만", "+월 25만", true),
      unmet("commute", "통근", "18분", ">", "15분", "+3분"),
      met("area", "면적", "74㎡", "≥", "65㎡"),
    ],
    [
      unmet("budget", "예산", "약 85만", ">", "65만", "+월 20만", true),
      unmet("commute", "통근", "19분", ">", "12분", "+7분"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),

  j("L-005", "BOTH_UNMET", false,
    [
      unmet("budget", "예산", "약 73만", ">", "60만", "+월 13만", true),
      unmet("commute", "통근", "32분", ">", "15분", "+17분"),
      unmet("area", "면적", "52㎡", "<", "65㎡", "−13㎡"),
    ],
    [
      unmet("budget", "예산", "약 73만", ">", "65만", "+월 8만", true),
      unmet("commute", "통근", "20분", ">", "12분", "+8분"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
];

// ── 세트 4: solo — B 미참여 (A-12 / A-14e) ────────────────────────────
// 실부담은 A 교통비만 반영한다(PRD §19.2 "해당 사용자 교통비만 포함").

const SOLO: ListingJudgment[] = [
  j("L-001", null, false,
    [
      met("budget", "예산", "약 84만", "≤", "100만", true),
      met("commute", "통근", "25분", "≤", "25분"),
      met("area", "면적", "68㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ], []),
  j("L-002", null, false,
    [
      met("budget", "예산", "약 76만", "≤", "100만", true),
      unmet("commute", "통근", "28분", ">", "25분", "+3분"),
      unmet("area", "면적", "59㎡", "<", "60㎡", "−1㎡"),
      unmet("parking", "주차", "없음", "≠", "있음", "없음"),
    ], []),
  j("L-003", null, false,
    [
      met("budget", "예산", "약 98만", "≤", "100만", true),
      unmet("commute", "통근", "30분", ">", "25분", "+5분"),
      unmet("area", "면적", "44㎡", "<", "60㎡", "−16㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ], []),
  j("L-004", null, false,
    [
      met("budget", "예산", "약 79만", "≤", "100만", true),
      met("commute", "통근", "18분", "≤", "25분"),
      met("area", "면적", "74㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ], []),
  j("L-005", null, true,
    [
      met("budget", "예산", "약 67만", "≤", "100만", true),
      unmet("commute", "통근", "32분", ">", "25분", "+7분"),
      unmet("area", "면적", "52㎡", "<", "60㎡", "−8㎡"),
      confirm("parking", "주차", "있음"),
    ], []),
];

// ── 세트 5: one-commute — A만 출퇴근 (명세 §4.2 한쪽만 `해당 없음`) ────
// B의 통근 행은 **유지**하고 `해당 없음`으로 표시한다. 0분으로 계산하지 않는다.

const ONE_COMMUTE: ListingJudgment[] = [
  j("L-001", "BOTH_MET", false,
    [
      met("budget", "예산", "약 84만", "≤", "100만", true),
      met("commute", "통근", "25분", "≤", "25분"),
      met("area", "면적", "68㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      met("budget", "예산", "약 84만", "≤", "85만", true),
      na("commute", "통근"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),
  j("L-002", "BOTH_UNMET", false,
    [
      met("budget", "예산", "약 76만", "≤", "100만", true),
      unmet("commute", "통근", "28분", ">", "25분", "+3분"),
      unmet("area", "면적", "59㎡", "<", "60㎡", "−1㎡"),
      unmet("parking", "주차", "없음", "≠", "있음", "없음"),
    ],
    [
      met("budget", "예산", "약 76만", "≤", "85만", true),
      na("commute", "통근"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
  j("L-003", "BOTH_UNMET", false,
    [
      met("budget", "예산", "약 98만", "≤", "100만", true),
      unmet("commute", "통근", "30분", ">", "25분", "+5분"),
      unmet("area", "면적", "44㎡", "<", "60㎡", "−16㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      unmet("budget", "예산", "약 98만", ">", "85만", "+월 13만", true),
      na("commute", "통근"),
      unmet("listingType", "유형", "오피스텔", "≠", "아파트", "오피스텔"),
    ]),
  j("L-004", "BOTH_MET", false,
    [
      met("budget", "예산", "약 79만", "≤", "100만", true),
      met("commute", "통근", "18분", "≤", "25분"),
      met("area", "면적", "74㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      met("budget", "예산", "약 79만", "≤", "85만", true),
      na("commute", "통근"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),
  j("L-005", "BOTH_UNMET", true,
    [
      met("budget", "예산", "약 67만", "≤", "100만", true),
      unmet("commute", "통근", "32분", ">", "25분", "+7분"),
      unmet("area", "면적", "52㎡", "<", "60㎡", "−8㎡"),
      confirm("parking", "주차", "있음"),
    ],
    [
      met("budget", "예산", "약 67만", "≤", "85만", true),
      na("commute", "통근"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
];

// ── 세트 6: no-commute — 둘 다 출근 안 함 ─────────────────────────────
// 통근 행을 **양쪽 모두에서 제거**한다(PRD §19.2 "항목 자체를 표시하지 않음").
// 교통비가 빠져 실부담이 세트마다 달라진다 — 명세 §6.4.

const NO_COMMUTE: ListingJudgment[] = [
  j("L-001", "BOTH_MET", false,
    [
      met("budget", "예산", "약 78만", "≤", "100만", true),
      met("area", "면적", "68㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      met("budget", "예산", "약 78만", "≤", "85만", true),
      noRule("area", "면적", "68㎡"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),
  j("L-002", "BOTH_UNMET", false,
    [
      met("budget", "예산", "약 70만", "≤", "100만", true),
      unmet("area", "면적", "59㎡", "<", "60㎡", "−1㎡"),
      unmet("parking", "주차", "없음", "≠", "있음", "없음"),
    ],
    [
      met("budget", "예산", "약 70만", "≤", "85만", true),
      noRule("area", "면적", "59㎡"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
  j("L-003", "BOTH_UNMET", false,
    [
      met("budget", "예산", "약 92만", "≤", "100만", true),
      unmet("area", "면적", "44㎡", "<", "60㎡", "−16㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      unmet("budget", "예산", "약 92만", ">", "85만", "+월 7만", true),
      noRule("area", "면적", "44㎡"),
      unmet("listingType", "유형", "오피스텔", "≠", "아파트", "오피스텔"),
    ]),
  j("L-004", "BOTH_MET", false,
    [
      met("budget", "예산", "약 73만", "≤", "100만", true),
      met("area", "면적", "74㎡", "≥", "60㎡"),
      met("parking", "주차", "있음", "=", "있음"),
    ],
    [
      met("budget", "예산", "약 73만", "≤", "85만", true),
      noRule("area", "면적", "74㎡"),
      met("listingType", "유형", "아파트", "=", "아파트"),
    ]),
  j("L-005", "BOTH_UNMET", true,
    [
      met("budget", "예산", "약 61만", "≤", "100만", true),
      unmet("area", "면적", "52㎡", "<", "60㎡", "−8㎡"),
      confirm("parking", "주차", "있음"),
    ],
    [
      met("budget", "예산", "약 61만", "≤", "85만", true),
      noRule("area", "면적", "52㎡"),
      unmet("listingType", "유형", "빌라", "≠", "아파트", "빌라"),
    ]),
];

// ── 조건 세트 6벌 — 명세 §6.5 ─────────────────────────────────────────

const BURDEN_BOTH = {
  "L-001": "약 90만",
  "L-002": "약 82만",
  "L-003": "약 104만",
  "L-004": "약 85만",
  "L-005": "약 73만",
};
const BURDEN_ONE = {
  "L-001": "약 84만",
  "L-002": "약 76만",
  "L-003": "약 98만",
  "L-004": "약 79만",
  "L-005": "약 67만",
};
const BURDEN_NONE = {
  "L-001": "약 78만",
  "L-002": "약 70만",
  "L-003": "약 92만",
  "L-004": "약 73만",
  "L-005": "약 61만",
};

export const SCENARIO_SETS: Record<string, ScenarioSet> = {
  normal: {
    id: "normal",
    label: "정상 — 3분류가 모두 나온다",
    aSummary: "예산 100만 · 통근 25분 · 면적 60㎡ · 주차 있음",
    bSummary: "예산 85만 · 통근 20분 · 유형 아파트",
    commute: { a: true, b: true },
    burden: BURDEN_BOTH,
    judgments: NORMAL,
  },
  "all-unmet": {
    id: "all-unmet",
    label: "전부 불충족 — 한 조건 완화로 회복 가능",
    aSummary: "예산 70만 · 통근 35분 · 면적 50㎡",
    bSummary: "예산 75만 · 통근 15분 · 유형 아파트",
    commute: { a: true, b: true },
    burden: BURDEN_BOTH,
    judgments: ALL_UNMET,
  },
  "all-unmet-hard": {
    id: "all-unmet-hard",
    label: "전부 불충족 — 단일 완화로 회복 불가 → 재탐색",
    aSummary: "예산 60만 · 통근 15분 · 면적 65㎡",
    bSummary: "예산 65만 · 통근 12분 · 유형 아파트",
    commute: { a: true, b: true },
    burden: BURDEN_BOTH,
    judgments: ALL_UNMET_HARD,
  },
  solo: {
    id: "solo",
    label: "1인 빈 경로 — B 미참여",
    aSummary: "예산 100만 · 통근 25분 · 면적 60㎡ · 주차 있음",
    bSummary: null,
    commute: { a: true, b: false },
    burden: BURDEN_ONE,
    judgments: SOLO,
  },
  "one-commute": {
    id: "one-commute",
    label: "A만 출퇴근 — 한쪽만 해당 없음(행 유지)",
    aSummary: "예산 100만 · 통근 25분 · 면적 60㎡ · 주차 있음",
    bSummary: "예산 85만 · 유형 아파트 (출근 안 함)",
    commute: { a: true, b: false },
    burden: BURDEN_ONE,
    judgments: ONE_COMMUTE,
  },
  "no-commute": {
    id: "no-commute",
    label: "둘 다 출근 안 함 — 통근 행 제거",
    aSummary: "예산 100만 · 면적 60㎡ · 주차 있음 (출근 안 함)",
    bSummary: "예산 85만 · 유형 아파트 (출근 안 함)",
    commute: { a: false, b: false },
    burden: BURDEN_NONE,
    judgments: NO_COMMUTE,
  },
};

export const DEFAULT_SET = "normal";
export { LISTING_IDS };
