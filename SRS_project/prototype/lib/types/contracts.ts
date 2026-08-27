/**
 * C-001 — 데이터 계약(DTO) SSOT
 *
 * `SRS_V0_9.md` §3.1의 Server Action 15종이 주고받는 Input/Output 타입을
 * 기능 구현 **전에** 한 파일에 선언한다. 이 파일은 로직을 한 줄도 담지 않는다.
 *
 * 규칙(C-001 Technical Constraints):
 * - 이후 모든 기능 태스크는 자체적으로 타입을 새로 선언하지 않고 여기서 import 한다.
 * - `@prisma/client` 외 어떤 애플리케이션 모듈도 import 하지 않는다(최상위 의존성).
 * - `prisma/schema.prisma`(C-000)가 바뀌면 이 파일도 함께 갱신해야 한다.
 */

import type {
  SharedSpace,
  Person,
  Invite,
  ListingRef,
  JudgmentResult,
  CompromiseSentence,
  RelaxationProposal,
  VisitSelection,
  BrokerQuestion,
  FieldRecord,
  Notification,
  RouteCache,
  Role,
  ConditionType,
  JudgmentStatus,
  RelaxationProposalStatus,
  FieldRecordOutcome,
  NotificationType,
} from "@prisma/client";

// ── Prisma 모델 재노출 ────────────────────────────────────────────────
export type {
  SharedSpace,
  Person,
  Invite,
  ListingRef,
  JudgmentResult,
  CompromiseSentence,
  RelaxationProposal,
  VisitSelection,
  BrokerQuestion,
  FieldRecord,
  Notification,
  RouteCache,
  Role,
  ConditionType,
  JudgmentStatus,
  RelaxationProposalStatus,
  FieldRecordOutcome,
  NotificationType,
};

// ── 식별자 ───────────────────────────────────────────────────────────

/**
 * 사람 식별자. A-001의 임시 인증(매직 링크·초대코드)과 실제 로그인이 같은 타입을 공유한다.
 * 어느 경로로 식별됐는지와 무관하게 상위 Command가 동일한 코드로 동작해야 한다.
 */
export type PersonId = string;

/** 공유 객체 식별자. */
export type SharedSpaceId = string;

/** 매물 식별자. */
export type ListingId = string;

// ── 조건 입력 ─────────────────────────────────────────────────────────

/** 판정 가능한 여섯 항목의 키. PRD §12.3. */
export type ConditionKey =
  | "budget"
  | "commute"
  | "walkToStation"
  | "area"
  | "parking"
  | "listingType";

/**
 * 추가 필수 조건 1건. 사람당 0~4개(LIM-10).
 * REQ-FUNC-003
 */
export interface RequiredCondition {
  key: ConditionKey;
  type: ConditionType;
  /** 사용자가 정한 기준값. 상한형·하한형은 수치, 유무형은 boolean, 일치형은 문자열. */
  value: number | boolean | string;
}

/**
 * `saveBudgetAndCommute` Input.
 * REQ-FUNC-002 — 예산은 항상 필수, 출퇴근은 조건부.
 */
export interface ConditionInput {
  /** 월 실부담 상한(만원). 미입력 시 저장 자체를 막는다(AC-02-01). */
  budgetCap: number;
  commutes: boolean;
  /** `commutes=false`이면 null로 저장한다. */
  commuteOrigin: string | null;
  /** 대중교통 기본, 자차 선택. `commutes=false`이면 null. */
  commuteMode: "TRANSIT" | "CAR" | null;
}

/** A가 초대 시 1회 선택하는 관계 유형. REQ-FUNC-005 */
export type RelationshipType =
  | "COUPLE"
  | "NEWLYWED"
  | "FAMILY"
  | "ROOMMATE"
  | "OTHER";

// ── Server Action Output ─────────────────────────────────────────────

/**
 * `inviteParticipant` Output — 링크(기본)와 코드(보조)를 동시 발급한다.
 * REQ-FUNC-005
 */
export interface InviteBundle {
  code: string;
  linkUrl: string;
}

/**
 * `getSoloJudgment` · 판정 조회 Output.
 * REQ-FUNC-009 · REQ-FUNC-011 — 총점·순위를 담지 않는다.
 */
export type JudgmentResultSet = JudgmentResult[];

/**
 * 후보 그룹 3분류. `확인 필요`는 이 분류에 흡수하지 않고 별도 배지로 표시한다(AC-11-02).
 * REQ-FUNC-011
 */
export type CandidateGroup = "BOTH_MET" | "ONE_SIDE_ONLY" | "BOTH_UNMET";

/**
 * `previewRelaxation` Output — 완화 미리보기.
 * 완화폭은 임의값이 아니라 **실제 미달량**에서만 산출한다(REQ-FUNC-013).
 * 두 조건을 동시에 완화하는 안을 담지 않는다(AC-13-03).
 */
export interface PreviewResult {
  personId: PersonId;
  conditionKey: ConditionKey;
  /** 현재 기준값. */
  currentValue: number | boolean | string;
  /** 실제 미달량만큼 완화한 값. */
  proposedValue: number | boolean | string;
  /** 완화 시 그룹이 바뀌는 매물. */
  recoveredListingIds: ListingId[];
}

/**
 * `translateToSearchFilter` Output — 재탐색 필터 변환 결과.
 * 예산은 낮은 상한, 면적은 높은 하한, 역도보는 짧은 기준(= A·B 중 더 엄격한 쪽).
 * **통근시간은 필터에서 제외한다** — 네이버 검색에 통근시간 축이 없다(REQ-FUNC-016).
 * 검색 결과 수는 `[TBD]`(LIM-07)라 이 타입에 담지 않는다.
 */
export interface FilterUiSpec {
  filters: Array<{
    key: ConditionKey;
    label: string;
    /** 현재 A/B 조건을 사람별로 보여주기 위한 표시용 문자열. */
    currentLabel: string;
    /** 제안 필터 값의 표시용 문자열. 필터로 옮길 수 없으면 null. */
    proposedLabel: string | null;
  }>;
}

/**
 * `submitVisitSelection` Output — 2라운드 분할 프로토콜의 한 라운드 결과.
 * 투표·순위·자동 선택을 담지 않는다(`decisions/0004`).
 * REQ-FUNC-017
 */
export interface SelectionRound {
  round: 1 | 2;
  /** 라운드 상한 2회(LIM-11). */
  matchedListingIds: ListingId[];
  /** 2개 확정 시 채워진다. 분할 종료도 여기에 담긴다. */
  finalListingIds: ListingId[] | null;
}

/**
 * 방문 후 공통 체크리스트 6항목. 항목을 고르는 것이 아니라 **전부 표시**한다.
 * REQ-FUNC-023
 */
export interface Checklist {
  floorNoise: boolean | null;
  daylight: boolean | null;
  mold: boolean | null;
  parkingDifficulty: boolean | null;
  ambientNoise: boolean | null;
  interiorCondition: boolean | null;
}

// ── 화면 표시 계약 ────────────────────────────────────────────────────
//
// 판정 결과를 화면이 소비하는 형태다. `J-006`(5분류 상태 분류)이 완료되면
// `queries/judgment.queries.ts` 가 이 형태로 반환하고, 프로토타입 픽스처는
// 삭제된다 — 즉 **이 타입들은 프로토타입보다 오래 산다.** 그래서 폐기 예정인
// `lib/dev/` 가 아니라 계약 SSOT인 여기에 둔다.

/** 조건 한 줄. 전체형 `통근 13분 > 10분 ✗ +3분` 이 이 필드들로 조립된다. */
export interface ConditionRow {
  key: ConditionKey;
  /** 화면 라벨 — 예산 · 통근 · 면적 · 주차 · 유형. 순서는 고정이다. */
  label: string;
  /** 실제값 표시 문자열. 추정치면 `약` 접두어가 이미 붙어 있다. */
  actual: string;
  /** 비교 기호. 기준이 없거나 비교가 성립하지 않으면 null. */
  comparator: "≤" | ">" | "≥" | "<" | "=" | "≠" | null;
  /** 사용자 기준값 표시 문자열. 그 사람이 걸지 않은 조건이면 null(`기준 없음`). */
  threshold: string | null;
  status: JudgmentStatus;
  /** 미달량 표시 문자열. 충족·해당없음이면 null. */
  gap: string | null;
  /** `true`면 `DisclosedValue`로 감싼다 — 전제가 바뀌면 함께 바뀌는 값이다. */
  estimated: boolean;
}

/** 한 매물에 대한 A·B 판정 한 벌. */
export interface ListingJudgment {
  listingId: ListingId;
  /** `null` = 1인 빈 경로(B 미참여). 3분류는 두 사람이 있어야 성립한다. */
  group: CandidateGroup | null;
  /** 3분류와 별개로 붙는 배지. 3분류에 흡수하지 않는다(AC-11-02). */
  confirmationNeeded: boolean;
  a: ConditionRow[];
  b: ConditionRow[];
}
