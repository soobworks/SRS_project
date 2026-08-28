import type { ConditionRow } from "@/lib/types";
import { DisclosedValue, UndisclosedValue } from "./disclosed-value";

/**
 * V-002 — 균형 제시 가드레일 (REQ-FUNC-025 · AC-25-01~03)
 *
 * ## 제품 정체성 제약 (협상 불가)
 *
 * 이 컴포넌트의 **API에는 총점·추천 배지·복합 순위를 넘길 통로가 없다.**
 * `score`·`rank`·`recommended`·`winner`·`sortBy` 같은 prop을 두지 않았고,
 * 앞으로도 두지 않는다 — prop이 없으면 렌더할 방법 자체가 없다.
 * 구조적 방어가 코드 리뷰보다 앞선다(`decisions/0001`).
 *
 * ## 균형 규칙
 *
 * - A와 B를 **동일 순서·동일 형식·동일 줄 수**로 표시한다.
 * - **색은 판정 상태에만** 쓴다. A/B 구분은 위치와 라벨로만 한다.
 * - 미충족 조건을 위로 올려 A/B 행 순서를 다르게 만들지 않는다(PRD §13.2).
 *   행 순서는 호출자가 넘긴 배열 순서 그대로다 — 이 컴포넌트는 정렬하지 않는다.
 */

const STATUS_MARK: Record<ConditionRow["status"], string> = {
  MET: "✓",
  UNMET: "✗",
  CONFIRMATION_NEEDED: "?",
  CALCULATION_FAILED: "",
  NOT_APPLICABLE: "",
};

const STATUS_TONE: Record<ConditionRow["status"], string> = {
  MET: "text-met",
  UNMET: "text-unmet",
  CONFIRMATION_NEEDED: "text-confirm",
  CALCULATION_FAILED: "text-neutral",
  NOT_APPLICABLE: "text-neutral",
};

/**
 * 전제 공개 링크. 화면마다 경로가 달라 **호출자가 넘긴다** —
 * 컴포넌트가 기본값을 지어내면 닿지 않는 링크가 조용히 생긴다.
 */
export interface Disclosure {
  href: string;
  basis: string;
}

/** 전체형 한 줄 — `통근  13분 > 10분  ✗ +3분` (명세 §4.3) */
function FullRow({ r, d }: { r: ConditionRow; d: Disclosure }) {
  // 명세 §5.3 — ⓘ는 **행당 최대 1개**다.
  // 실제값이 이미 ⓘ를 달았으면 미달량에는 달지 않는다. 같은 전제를 공유하는
  // 두 값에 각각 ⓘ를 붙이면 한 줄이 과밀해지고, 정작 중요한 추정치가 묻힌다.
  const actualHasBadge = r.estimated && r.status !== "CALCULATION_FAILED" &&
    r.status !== "CONFIRMATION_NEEDED";
  return (
    <div className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-2 py-1.5 text-sm">
      <span className="text-ink-muted">{r.label}</span>

      <span className="nums text-ink">
        {r.status === "CALCULATION_FAILED" ? (
          <UndisclosedValue label="계산 불가" />
        ) : r.status === "CONFIRMATION_NEEDED" ? (
          <UndisclosedValue label="확인 필요" />
        ) : r.estimated ? (
          <DisclosedValue href={d.href} basis={d.basis}>
            {r.actual}
          </DisclosedValue>
        ) : (
          r.actual
        )}
        {r.comparator && r.threshold ? (
          <span className="text-ink-muted">
            {" "}
            {r.comparator} {r.threshold}
          </span>
        ) : r.threshold === null && r.status === "NOT_APPLICABLE" && r.actual !== "해당 없음" ? (
          <span className="text-ink-muted"> · 기준 없음</span>
        ) : null}
      </span>

      <span className={`nums whitespace-nowrap ${STATUS_TONE[r.status]}`}>
        {STATUS_MARK[r.status]}
        {r.gap ? (
          <>
            {" "}
            {r.estimated && !actualHasBadge ? (
              <DisclosedValue href={d.href} basis={d.basis}>
                {r.gap}
              </DisclosedValue>
            ) : (
              r.gap
            )}
          </>
        ) : null}
      </span>
    </div>
  );
}

/**
 * 사람 블록 하나. A 블록과 B 블록은 같은 컴포넌트를 쓴다 —
 * 어느 쪽도 시각적으로 우대받지 않는다.
 */
function PersonBlock({
  label,
  rows,
  emptyNote,
  d,
}: {
  label: string;
  rows: ConditionRow[];
  emptyNote?: string;
  d: Disclosure;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="mb-2 text-xs font-medium tracking-wide text-ink-muted">
        {label}
      </p>
      {rows.length === 0 ? (
        <p className="py-4 text-sm text-neutral">{emptyNote ?? "아직 조건을 입력하지 않았어요"}</p>
      ) : (
        <div className="divide-y divide-line">
          {rows.map((r) => (
            <FullRow key={r.key} r={r} d={d} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BalancedComparison({
  a,
  b,
  aLabel = "A",
  bLabel = "B",
  bEmptyNote,
  disclosure,
}: {
  a: ConditionRow[];
  b: ConditionRow[];
  aLabel?: string;
  bLabel?: string;
  /** 전제 패널 경로와 기준 시점. 화면이 정한다. */
  disclosure: Disclosure;
  /** B 미참여(A-14e)일 때 B 블록에 표시할 문구. */
  bEmptyNote?: string;
  // ⚠️ score·rank·recommended·winner·sortBy prop은 의도적으로 존재하지 않는다.
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <PersonBlock label={aLabel} rows={a} d={disclosure} />
      <PersonBlock label={bLabel} rows={b} emptyNote={bEmptyNote} d={disclosure} />
    </div>
  );
}

/**
 * 축약형 — 목록(`A-13`)용. `A · 통근 +3분` (명세 §4.3)
 *
 * 미충족만, 조건 순서상 앞 2개까지. 나머지는 `외 N개`로 접는다.
 * 미달량 크기로 정렬하지 않는다 — 넘어온 순서를 그대로 쓴다.
 */
export function CompactSummary({
  label,
  rows,
  disclosure,
}: {
  label: string;
  rows: ConditionRow[];
  disclosure: Disclosure;
}) {
  const unmet = rows.filter((r) => r.status === "UNMET");
  const shown = unmet.slice(0, 2);
  const rest = unmet.length - shown.length;
  const confirming = rows.some((r) => r.status === "CONFIRMATION_NEEDED");

  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
      <span className="text-ink-muted">{label} ·</span>
      {shown.length === 0 ? (
        <span className="text-met">전부 충족</span>
      ) : (
        shown.map((r) => (
          <span key={r.key} className="nums text-unmet">
            {r.label}{" "}
            {r.estimated ? (
              <DisclosedValue href={disclosure.href} basis={disclosure.basis}>
                {r.gap}
              </DisclosedValue>
            ) : (
              r.gap
            )}
          </span>
        ))
      )}
      {rest > 0 ? <span className="text-ink-muted">외 {rest}개</span> : null}
      {confirming ? <span className="text-confirm">· 확인 필요</span> : null}
    </p>
  );
}
