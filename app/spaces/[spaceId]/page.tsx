import Link from "next/link";
import {
  PrototypeShell,
  ScreenTitle,
  ExitBadge,
  StepNav,
} from "@/components/dev/prototype-shell";
import { LISTINGS, PREFERENCES } from "@/lib/dev/scenarios";

/**
 * S-001 — 관심매물에서 비교 후보 구성
 *
 * 담는 PRD 화면(명세 §1.2): `A-01`(기능 진입) · `A-02`(후보 선택 1~5개) ·
 * `A-02c`(6개째 차단)
 *
 * 이 화면은 선택 UI만 만든다. `createSharedSpaceDraft` Server Action과
 * 서버 측 6개째 검증은 `S-001` 원 순번의 일이다.
 */
export default async function SharedSpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ state?: string }>;
}) {
  const { spaceId } = await params;
  const { state = "A-02" } = await searchParams;

  const blocked = state === "A-02c";
  const entry = state === "A-01";

  return (
    <PrototypeShell state={state}>
      {entry ? (
        <>
          <ScreenTitle
            title="같이 고르기"
            sub="관심매물에 담아둔 집을 둘이 함께 보고, 서로 무엇이 맞고 무엇이 어긋나는지 확인해요"
          />
          <ExitBadge>
            네이버 부동산 관심매물에서 「같이 고르기」를 눌러 들어온 지점입니다 —
            진입 경로는 프로토타입 범위 밖입니다.
          </ExitBadge>
          <div className="mt-4">
            <Link
              href={`/spaces/${spaceId}?state=A-02`}
              className="inline-block rounded-md bg-ink px-4 py-2 text-sm text-surface"
            >
              같이 볼 집 고르기
            </Link>
          </div>
        </>
      ) : (
        <>
          <ScreenTitle
            title="같이 볼 후보를 담아주세요"
            sub="관심매물 중 최대 5곳까지 고를 수 있어요"
          />

          {blocked ? (
            <p className="mb-4 rounded-md border border-unmet/30 bg-unmet-bg px-3 py-2 text-sm text-unmet">
              후보는 5곳까지예요. 새로 담으려면 이미 고른 집 하나를 빼주세요.
            </p>
          ) : null}

          <ul className="flex flex-col gap-2">
            {LISTINGS.map((l, i) => (
              <li
                key={l.id}
                className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3"
              >
                <span
                  aria-hidden
                  className="flex size-5 items-center justify-center rounded border border-ink bg-ink text-xs text-surface"
                >
                  ✓
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{l.name}</p>
                  <p className="nums text-xs text-ink-muted">
                    {l.listingType} · 보증금 {l.deposit.toLocaleString()}만 / 월{" "}
                    {l.rent}만 · {l.area}㎡ · 역도보 {l.walkToStationMin}분
                  </p>
                </div>
                <span className="text-xs text-ink-muted">{i + 1}/5</span>
              </li>
            ))}

            {blocked ? (
              <li className="flex items-center gap-3 rounded-lg border border-dashed border-unmet/40 bg-unmet-bg/40 p-3">
                <span
                  aria-hidden
                  className="flex size-5 items-center justify-center rounded border border-line-strong text-xs text-neutral"
                >
                  +
                </span>
                <p className="text-sm text-unmet">
                  6번째 집 — 5곳 상한이라 담기지 않아요
                </p>
              </li>
            ) : null}
          </ul>

          <section className="mt-6 rounded-lg border border-line bg-surface p-4">
            <p className="mb-2 text-xs font-medium text-ink-muted">
              A의 선호 — 상대가 읽는 자유 문장이에요. 집마다 ✓/✗를 매기지 않아요.
            </p>
            <ul className="flex flex-col gap-1 text-sm text-ink">
              {PREFERENCES.a.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </section>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/spaces/${spaceId}/conditions?state=A-03`}
              className="inline-block rounded-md bg-ink px-4 py-2 text-sm text-surface"
            >
              5곳으로 시작하기
            </Link>
            <Link
              href={`/spaces/${spaceId}?state=A-02c`}
              className="inline-block rounded-md border border-line px-4 py-2 text-sm text-ink"
            >
              6개째 담아보기(상한 확인)
            </Link>
          </div>
        </>
      )}

      <StepNav
        links={[
          { href: `/spaces/${spaceId}/conditions?state=A-04`, label: "조건 입력" },
          { href: `/spaces/${spaceId}/judgments?state=A-13`, label: "판정 결과" },
          { href: `/invite/DEMOCODE?state=B-01`, label: "B 진입(모바일)" },
        ]}
      />
    </PrototypeShell>
  );
}
