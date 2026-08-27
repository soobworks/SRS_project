import Link from "next/link";

/**
 * X-001 — 숫자 전제 공개 (REQ-FUNC-021 · REQ-NF-006)
 *
 * **전제 의존 값(추정치)만** 감싼다. 판별 기준은 명세 §5.2:
 * "PRD §19.3 전제표의 값이 바뀌면 함께 바뀌는가?"
 *
 * - 감싼다: 월 실부담, 실부담 6항목, 교통비, 그리고 그로부터 파생된 예산 미달량
 * - 감싸지 않는다: 통근 13분·면적 68㎡ 같은 실측치, 사용자가 입력한 임계값,
 *   실측에서 파생된 미달량(`+3분`)
 *
 * 이 컴포넌트에는 값을 "그냥 숫자로" 넘길 통로가 없다 — `basis`(기준 시점)를
 * 항상 함께 렌더하고, 전제 전문은 `A-04a` 패널이 정본이다(툴팁에 복제하지 않는다).
 */
export function DisclosedValue({
  children,
  basis = "기준 시점 미지정",
  href,
}: {
  /** 이미 `약` 접두어가 붙은 표시 문자열. */
  children: React.ReactNode;
  /**
   * 기준 시점. 호출자가 넘긴다 —
   * 이 컴포넌트는 `J-006` 이후에도 살아남으므로 폐기 예정인 `lib/dev/`에
   * 의존하지 않는다.
   */
  basis?: string;
  /** 전제 패널로 가는 경로. */
  href?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1 nums">
      <span>{children}</span>
      <Link
        href={href ?? "?state=A-04a"}
        aria-label={`계산 전제 보기 — ${basis}`}
        title={`${basis} · 전제 보기`}
        className="inline-flex size-4 shrink-0 translate-y-[1px] items-center justify-center rounded-full border border-line-strong text-[10px] leading-none text-ink-muted hover:bg-neutral-bg focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        i
      </Link>
    </span>
  );
}

/**
 * 계산 불가·확인 필요일 때는 확정값 대신 상태 배지로 대체한다(명세 §5.5).
 * 부분 계산값이나 추정 대체값을 만들어 넣지 않는다.
 */
export function UndisclosedValue({ label }: { label: "계산 불가" | "확인 필요" }) {
  const tone =
    label === "계산 불가"
      ? "bg-neutral-bg text-neutral"
      : "bg-confirm-bg text-confirm";
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs ${tone}`}>
      {label}
    </span>
  );
}
