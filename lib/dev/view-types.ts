/**
 * 프로토타입 렌더링 전용 뷰 타입.
 *
 * ⚠️ **폐기 예정.** `J-006`(5분류 상태 분류) 완료로 실제 판정 계산이 붙는 시점에
 * `lib/dev/` 전체를 삭제한다. 화면은 그때 `lib/queries/judgment.queries.ts` 의
 * 결과를 받도록 주입 지점 한 줄만 바꾼다.
 *
 * 여기에 판정 **로직**을 넣지 않는다 — 상태(`status`)는 계산하지 않고
 * `prototype-visual-spec.md` §6.6·§6.7 표에서 그대로 전사한다.
 */

import type { ConditionKey, JudgmentStatus, CandidateGroup } from "@/lib/types";

/** 매물 픽스처. 스키마와 달리 `parking`이 nullable이다 — 사유는 아래 주석. */
export interface FixtureListing {
  id: string;
  name: string;
  /** 만원 단위. schema의 `Int`와 같은 축척을 쓴다. */
  deposit: number;
  /** 만원 단위. */
  rent: number;
  /** 만원 단위. */
  maintenanceFee: number;
  /** 전용면적 ㎡. */
  area: number;
  listingType: string;
  /**
   * `null` = 데이터 누락 → `CONFIRMATION_NEEDED`.
   * `prisma/schema.prisma`의 `parking Boolean`은 non-nullable이라 이 상태를
   * 표현하지 못한다. PRD §18.2 `[확정]`("주차 등 데이터 누락 → 확인 필요")과
   * 어긋나는 스키마 갭이며, 스키마 수정은 `C-000` 원 순번의 일이다.
   */
  parking: boolean | null;
  walkToStationMin: number;
}

/** 조건 한 줄. 명세 §4.3 전체형이 이 필드들로 조립된다. */
export interface ConditionRow {
  key: ConditionKey;
  /** 화면 라벨 — 예산 · 통근 · 면적 · 주차 · 유형. 순서는 명세 §4.5 고정. */
  label: string;
  /** 실제값 표시 문자열. 추정치면 `약` 접두어가 이미 붙어 있다. */
  actual: string;
  /** 비교 기호. 기준이 없거나 비교가 성립하지 않으면 null. */
  comparator: "≤" | ">" | "≥" | "<" | "=" | "≠" | null;
  /** 사용자 기준값 표시 문자열. 그 사람이 걸지 않은 조건이면 null. */
  threshold: string | null;
  /** 명세 §6.6·§6.7 표에서 전사한 값. 계산하지 않는다. */
  status: JudgmentStatus;
  /** 미달량 표시 문자열(PRD §12.3). 충족·해당없음이면 null. */
  gap: string | null;
  /**
   * `true`면 `DisclosedValue`로 감싼다(명세 §5.2).
   * 전제(§19.3)가 바뀌면 함께 바뀌는 값만 `true`다.
   */
  estimated: boolean;
}

/** 한 매물에 대한 A·B 판정 한 벌. */
export interface ListingJudgment {
  listingId: string;
  /** `null` = 1인 빈 경로(B 미참여). 3분류는 두 사람이 있어야 성립한다. */
  group: CandidateGroup | null;
  /** 3분류와 별개로 붙는 배지. AC-11-02 — 3분류에 흡수하지 않는다. */
  confirmationNeeded: boolean;
  a: ConditionRow[];
  b: ConditionRow[];
}

/** 조건 세트 1벌(명세 §6.5). */
export interface ScenarioSet {
  id: string;
  label: string;
  /** A 조건 요약 표시용. */
  aSummary: string;
  /** B 조건 요약 표시용. B 미참여면 null. */
  bSummary: string | null;
  /** 출퇴근 여부 — 명세 §4.2의 `해당 없음` 두 갈래를 만든다. */
  commute: { a: boolean; b: boolean };
  /** 실부담 축척(명세 §6.4) — 교통비 인원수에 따라 달라진다. */
  burden: Record<string, string>;
  judgments: ListingJudgment[];
}
