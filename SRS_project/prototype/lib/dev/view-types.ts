/**
 * 프로토타입 **전용** 뷰 타입.
 *
 * ⚠️ **폐기 예정.** `J-006` 완료 시 `lib/dev/` 전체를 삭제한다.
 *
 * 화면이 소비하는 표시 계약(`ConditionRow`·`ListingJudgment`)은 프로토타입보다
 * 오래 살아남으므로 여기 두지 않고 `lib/types/contracts.ts` 에 있다 —
 * 생존 컴포넌트가 삭제 대상 모듈을 import 하면 안 되기 때문이다.
 * 여기 남는 것은 픽스처·시나리오처럼 **프로토타입과 함께 사라질 것들**뿐이다.
 */

import type { ConditionRow, ListingJudgment } from "@/lib/types";

export type { ConditionRow, ListingJudgment };

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
