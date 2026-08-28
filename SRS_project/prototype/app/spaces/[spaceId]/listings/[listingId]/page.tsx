import Link from "next/link";
import {
  PrototypeShell,
  ScreenTitle,
  StepNav,
} from "@/components/dev/prototype-shell";
import { BalancedComparison } from "@/components/domain/balanced-comparison";
import { GroupBadge, ConfirmationBadge } from "@/components/domain/group-badge";
import { DisclosedValue } from "@/components/domain/disclosed-value";
import {
  resolveSet,
  listingById,
  COMPROMISE_SENTENCES,
  ASSUMPTION_BASIS,
} from "@/lib/dev/scenarios";
import type { ConditionRow, ListingJudgment } from "@/lib/types";

/**
 * R-001 · R-002 ① — 매물 상세 판정 · trade-off · 조건 완화
 *
 * 담는 PRD 화면(명세 §1.2): `A-14`·`A-14a~e`(상세 판정 5상태) ·
 * `A-14b`(Hero trade-off) · `A-15`(조건 완화 A안·B안)
 *
 * 양보 문장은 픽스처 고정 문자열이다 — `sentence-generator.ts` 순수 함수는
 * `R-001` 원 순번의 일이다. 시뮬레이터 3종도 `R-002` 원 순번에 남긴다.
 */

/** PRD 하위 상태 → (매물, 조건 세트). 명세 §6.6 검증표에서 고른 대표 사례다. */
/**
 * PRD 하위 상태 → **조건 세트**. 매물은 URL의 `listingId`를 그대로 쓴다.
 *
 * 전에는 여기서 매물까지 지정해, `A-14c`(상도 파크빌)에서 "조금 풀어보기"를
 * 누르면 신대방 코지로 튀었다 — 보고 있던 집이 바뀌는 것은 UX 배반이다.
 */
const STATE_SET: Record<string, string> = {
  "A-14a": "normal",
  "A-14b": "normal",
  "A-14c": "normal",
  "A-14d": "normal",
  "A-14e": "solo",
  "A-15": "all-unmet",
};

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string; listingId: string }>;
  searchParams: Promise<{ state?: string; set?: string }>;
}) {
  const { spaceId, listingId } = await params;
  const { state = "A-14", set } = await searchParams;

  const activeListingId = listingId;

  // ★ 픽스처 주입 지점 (화면당 1곳) — J-006 완료 후 실제 Query로 교체
  const scenario = resolveSet(state, set ?? STATE_SET[state]);

  const listing = listingById(activeListingId);
  const jd =
    scenario.judgments.find((x) => x.listingId === activeListingId) ??
    scenario.judgments[0];
  const solo = scenario.id === "solo";
  const sentence = COMPROMISE_SENTENCES[activeListingId];
  const relaxing = state === "A-15";
  const disclosure = {
    href: `/spaces/${spaceId}/conditions?state=A-04a`,
    basis: ASSUMPTION_BASIS,
  };

  return (
    <PrototypeShell state={state}>
      <ScreenTitle
        title={listing.name}
        sub={`${listing.listingType} · 전용 ${listing.area}㎡ · 역도보 ${listing.walkToStationMin}분`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {jd.group ? <GroupBadge group={jd.group} /> : null}
        {jd.confirmationNeeded ? <ConfirmationBadge /> : null}
        <span className="ml-auto text-sm text-ink-muted">
          월{" "}
          <DisclosedValue href={disclosure.href} basis={disclosure.basis}>
            {scenario.burden[activeListingId]}
          </DisclosedValue>
        </span>
      </div>

      {/* A-14b — Hero trade-off.
          PRD §14.1: **한쪽만 충족하는 매물**을 설명 대상으로 승격한다 —
          `둘 다 불충족`에는 양보 문장을 붙이지 않는다. 거기서는 감수할 쪽이
          한 명으로 정해지지 않고, 표와 어긋나는 문장이 나오기 때문이다.
          결론("이 집이 낫다")은 어떤 경우에도 붙이지 않는다(PRD §14.2). */}
      {sentence && jd.group === "ONE_SIDE_ONLY" ? (
        <section className="mb-5 rounded-lg border border-line bg-surface p-5">
          <p className="text-base leading-relaxed text-ink">
            <strong>{sentence.who}</strong>는 {sentence.what} 감수해요
            {sentence.instead ? (
              <>
                . 대신 <span className="text-ink">{sentence.instead}</span>
              </>
            ) : (
              "."
            )}
          </p>
          {sentence.remaining.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-0.5 text-sm text-ink-muted">
              {sentence.remaining.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <BalancedComparison
        a={jd.a}
        b={jd.b}
        aLabel={`A — ${scenario.aSummary}`}
        bLabel={solo ? "B — 아직 참여하지 않았어요" : `B — ${scenario.bSummary}`}
        bEmptyNote="B가 초대에 들어오면 두 분 조건을 나란히 보여드려요"
        disclosure={disclosure}
      />

      {relaxing ? <RelaxationPanel jd={jd} spaceId={spaceId} /> : <NextStep spaceId={spaceId} jd={jd} setId={scenario.id} />}

      <StepNav
        links={[
          { href: `/spaces/${spaceId}/listings/L-004?state=A-14a`, label: "둘 다 충족" },
          { href: `/spaces/${spaceId}/listings/L-001?state=A-14b`, label: "한쪽만(양보 문장)" },
          { href: `/spaces/${spaceId}/listings/L-002?state=A-14c`, label: "둘 다 불충족" },
          { href: `/spaces/${spaceId}/listings/L-005?state=A-14d`, label: "확인 필요" },
          { href: `/spaces/${spaceId}/listings/L-001?state=A-14e`, label: "상대 미입력" },
          { href: `/spaces/${spaceId}/listings/L-005?state=A-15`, label: "조건 완화" },
          { href: `/spaces/${spaceId}/judgments?state=A-13`, label: "목록으로" },
        ]}
      />
    </PrototypeShell>
  );
}

/**
 * 다음 화면으로 가는 제품 동선 — PRD §17.2가 `A-14`의 다음을 `A-15`/`A-16`으로 정한다.
 *
 * 상태에 따라 갈 곳이 다르다. 어느 집이 낫다고 말하지 않고, **지금 할 수 있는
 * 다음 행동**만 제시한다.
 */
function NextStep({
  spaceId,
  jd,
  setId,
}: {
  spaceId: string;
  jd: { group: string | null; confirmationNeeded: boolean; listingId: string };
  /** 보고 있던 조건 세트를 유지한다 — 완화 화면에서 집이 바뀌면 안 된다. */
  setId: string;
}) {
  const unmet = jd.group === "BOTH_UNMET";
  return (
    <section className="mt-5 rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        {unmet ? (
          <>
            <p className="text-sm text-ink">
              두 분 다 아쉬운 곳이에요. 조건을 조금 풀면 달라질 수 있어요.
            </p>
            <Link
              href={`/spaces/${spaceId}/listings/${jd.listingId}?state=A-15&set=${setId}`}
              className="ml-auto rounded-md bg-ink px-4 py-2 text-sm text-surface"
            >
              조금 풀어보기
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-ink">
              이 집을 이번에 보러 갈 후보로 넣을까요?
            </p>
            <Link
              href={`/spaces/${spaceId}/visit-selection?state=A-16&match=2`}
              className="ml-auto rounded-md bg-ink px-4 py-2 text-sm text-surface"
            >
              방문 후보 정하러 가기
            </Link>
          </>
        )}
      </div>
      {jd.confirmationNeeded ? (
        <p className="mt-2 text-xs text-ink-muted">
          확인 필요 항목은 방문 전에 중개사에게 물어보고 답을 채우면 판정이
          갱신돼요 — 그 화면은 아직 만들지 않았어요.
        </p>
      ) : null}
    </section>
  );
}

/**
 * A-15 — 조건 완화 A안·B안 (PRD §14.3)
 *
 * 완화폭은 임의 제안값이 아니라 **현재 후보의 실제 미달량**에서 가져온다.
 * A안과 B안을 항상 동시에 보여준다. 두 조건을 동시에 낮추는 안은 만들지 않으며,
 * 그런 조작을 할 UI 자체가 없다.
 */
function RelaxationPanel({
  jd,
  spaceId,
}: {
  jd: ListingJudgment;
  spaceId: string;
}) {
  // PRD §14.3 — 완화폭은 임의 제안값이 아니라 **지금 보고 있는 이 후보의
  // 실제 미달량**에서 가져온다. 세트 전체를 훑는 `A-13b`(막다른 길)와 달리
  // 이 화면은 매물 하나를 보고 있으므로 원천이 다르다.
  //
  // A안·B안을 항상 동시에 보여준다. 사람마다 미충족이 여럿이면 **가장 작은
  // 것 하나만** 고른다 — 두 조건을 동시에 푸는 안은 만들지 않는다(AC-13-03).
  const pick = (rows: ConditionRow[]) => {
    let best: { row: ConditionRow; mag: number } | null = null;
    for (const r of rows) {
      if (r.status !== "UNMET" || !r.gap || !r.threshold) continue;
      const m = r.gap.match(/(\d+)/);
      if (!m) continue;
      const mag = Number(m[1]);
      if (!best || mag < best.mag) best = { row: r, mag };
    }
    return best?.row ?? null;
  };

  const plans = ([
    ["A", pick(jd.a), jd.a],
    ["B", pick(jd.b), jd.b],
  ] as const).map(([who, row, rows]) => {
    if (!row) return { who, row: null, remaining: 0 };
    const remaining = rows.filter(
      (r) => r.status === "UNMET" && r.key !== row.key,
    ).length;
    return { who, row, remaining };
  });

  return (
    <section className="mt-5 rounded-lg border border-line bg-surface p-5">
      <h2 className="mb-1 font-medium text-ink">조금 풀면 무엇이 달라질까요?</h2>
      <p className="mb-4 text-sm text-ink-muted">
        이 집에서 지금 모자란 만큼만 풀어봤어요. 한 번에 한 가지 조건만 풀 수
        있어요.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {plans.map(({ who, row, remaining }) => (
          <div key={who} className="rounded-md border border-line p-4">
            <p className="mb-2 text-xs font-medium text-ink-muted">
              {who}안{row ? ` — ${row.label}` : ""}
            </p>
            {row ? (
              <>
                {/* 추정치면 전제를 함께 보인다(§5.2). ⓘ는 행당 1개이므로
                    완화 후 값에만 달고 미달량에는 달지 않는다(§5.3). */}
                <p className="nums mb-3 text-sm text-ink">
                  {row.threshold} →{" "}
                  {row.estimated ? (
                    <DisclosedValue
                      href={`/spaces/${spaceId}/conditions?state=A-04a`}
                      basis={ASSUMPTION_BASIS}
                    >
                      {row.actual}
                    </DisclosedValue>
                  ) : (
                    <strong>{row.actual}</strong>
                  )}{" "}
                  <span className="text-ink-muted">({row.gap})</span>
                </p>
                <div
                  aria-hidden
                  className="relative h-1.5 w-full rounded-full bg-neutral-bg"
                >
                  <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-ink" />
                  <span className="absolute -top-1 left-2/3 size-3.5 -translate-x-1/2 rounded-full border-2 border-surface bg-ink" />
                </div>
                <p className="mt-3 text-sm">
                  {remaining === 0 ? (
                    <span className="text-met">
                      이걸 풀면 {who}는 이 집을 전부 충족해요
                    </span>
                  ) : (
                    <span className="text-ink-muted">
                      이걸 풀어도 {who}는 {remaining}가지가 더 남아요
                    </span>
                  )}
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-muted">
                {who}는 이 집에서 풀 조건이 없어요
              </p>
            )}
            <p className="mt-2 text-xs text-ink-muted">
              상대 조건은 직접 바꿀 수 없어요 — 제안하면 상대가 수락할 때만
              반영돼요.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
