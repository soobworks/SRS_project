/**
 * S-01 — 경로·판정 계산 중 로딩 상태 (PRD §17.4)
 *
 * "빈 화면 금지" 원칙에 따라 계산 중에도 무엇을 기다리는지 말해 준다.
 * 이 자리에 판정 결과를 미리 채워 넣지 않는다 — 계산 전에 숫자를 보이면
 * 전제 없는 숫자가 된다(REQ-NF-006).
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="rounded-lg border border-line bg-surface px-6 py-5 text-center">
        <p className="text-sm text-ink">두 분 조건으로 5곳을 재보는 중이에요</p>
        <p className="mt-1 text-xs text-ink-muted">
          통근 경로와 월 실부담을 계산하고 있어요
        </p>
      </div>
    </div>
  );
}
