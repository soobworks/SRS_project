import Link from "next/link";
import {
  PrototypeShell,
  ScreenTitle,
  StepNav,
} from "@/components/dev/prototype-shell";
import { DisclosedValue } from "@/components/domain/disclosed-value";
import { LISTINGS, PREFERENCES, resolveSet } from "@/lib/dev/scenarios";
import { DEMO_SPACE_ID } from "@/lib/dev/demo-ids";

/**
 * S-003 — B의 맥락 있는 진입
 *
 * 담는 PRD 화면(명세 §1.2): `B-01`(초대 진입, 만료 포함) ·
 * `B-02`(조건 입력 전 맥락 제공)
 *
 * PRD §17.3이 `B-02`를 "후보 최대 5개와 A의 선호 카드 미리보기"로 정의한다 —
 * **조건 입력보다 먼저** 보여주는 것이 이 화면의 핵심이다.
 * 폼팩터는 모바일 390px다(명세 §2.1) — B는 카카오톡 링크로 들어온다.
 *
 * `getContextForB()` 쿼리와 P95 측정은 `S-003` 원 순번의 일이다.
 */
export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ state?: string; invite?: string }>;
}) {
  const { code } = await params;
  const { state = "B-01", invite } = await searchParams;

  const expired = invite === "expired";

  // ★ 픽스처 주입 지점 (화면당 1곳) — S-003 완료 후 실제 Query로 교체
  const scenario = resolveSet("A-13", "normal");

  return (
    <PrototypeShell form="mobile" state={state}>
      <div className="p-4">
        {expired ? (
          <ExpiredView />
        ) : state === "B-02" ? (
          <ContextView burden={scenario.burden} />
        ) : (
          <EntryView code={code} />
        )}

        <StepNav
          links={[
            { href: `/invite/${code}?state=B-01`, label: "초대 진입" },
            { href: `/invite/${code}?state=B-01&invite=expired`, label: "만료" },
            { href: `/invite/${code}?state=B-02`, label: "맥락 보기" },
            {
              href: `/spaces/${DEMO_SPACE_ID}/conditions?state=B-03`,
              label: "B 조건 입력",
            },
          ]}
        />
      </div>
    </PrototypeShell>
  );
}

/** B-01 — 초대 진입. 링크가 기본, 코드는 보조. */
function EntryView({ code }: { code: string }) {
  return (
    <>
      <ScreenTitle
        title="같이 집을 고르자고 초대받았어요"
        sub="상대가 담아둔 집과 바라는 점을 먼저 보고, 그다음에 내 조건을 넣으면 돼요"
      />
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="text-xs text-ink-muted">초대 코드</p>
        <p className="nums mt-1 text-lg tracking-widest text-ink">{code}</p>
      </div>
      <Link
        href={`/invite/${code}?state=B-02`}
        className="mt-4 block rounded-md bg-ink px-4 py-3 text-center text-sm text-surface"
      >
        무엇을 함께 보는지 확인하기
      </Link>
      <p className="mt-3 text-xs text-ink-muted">
        지금은 로그인하지 않아도 괜찮아요. 결과를 저장하거나 다시 열어볼 때
        여쭤볼게요.
      </p>
    </>
  );
}

/** B-01 만료 — 후보·선호 카드를 노출하지 않고 오류 상태만 표시한다. */
function ExpiredView() {
  return (
    <>
      <ScreenTitle
        title="이 초대는 더 이상 열 수 없어요"
        sub="링크가 만료됐거나 취소된 초대예요"
      />
      <div className="rounded-lg border border-unmet/30 bg-unmet-bg px-4 py-3 text-sm text-unmet">
        초대한 분에게 링크를 다시 받아주세요.
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        만료된 초대에서는 후보 목록과 상대의 선호를 보여드리지 않아요.
      </p>
    </>
  );
}

/** B-02 — 조건 입력 **전** 맥락 제공. 후보 5곳 + A의 선호 카드. */
function ContextView({ burden }: { burden: Record<string, string> }) {
  return (
    <>
      <ScreenTitle
        title="이런 집들을 같이 보려고 해요"
        sub="아직 아무것도 입력하지 않으셔도 돼요"
      />

      <ul className="flex flex-col gap-2">
        {LISTINGS.map((l) => (
          <li key={l.id} className="rounded-lg border border-line bg-surface p-3">
            <p className="text-sm font-medium text-ink">{l.name}</p>
            <p className="nums mt-0.5 text-xs text-ink-muted">
              {l.listingType} · {l.area}㎡ · 역도보 {l.walkToStationMin}분
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              월 <DisclosedValue href="?state=B-02">{burden[l.id]}</DisclosedValue>
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-4 rounded-lg border border-line bg-surface p-4">
        <p className="mb-2 text-xs font-medium text-ink-muted">A의 선호</p>
        <ul className="flex flex-col gap-1 text-sm text-ink">
          {PREFERENCES.a.map((p) => (
            <li key={p}>· {p}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-muted">
          집마다 맞다/아니다를 매기지 않아요. 그냥 A가 바라는 점이에요.
        </p>
      </section>

      <Link
        href={`/spaces/${DEMO_SPACE_ID}/conditions?state=B-03`}
        className="mt-4 block rounded-md bg-ink px-4 py-3 text-center text-sm text-surface"
      >
        이제 내 조건 넣기
      </Link>
    </>
  );
}
