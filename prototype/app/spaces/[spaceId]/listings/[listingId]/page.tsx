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
  RELAXATION_OPTIONS,
} from "@/lib/dev/scenarios";

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
const STATE_CASE: Record<string, { listing: string; set: string }> = {
  "A-14a": { listing: "L-004", set: "normal" }, // 둘 다 충족
  "A-14b": { listing: "L-001", set: "normal" }, // 한쪽만 충족 = Hero trade-off
  "A-14c": { listing: "L-002", set: "normal" }, // 둘 다 불충족
  "A-14d": { listing: "L-005", set: "normal" }, // 보류(확인 필요)
  "A-14e": { listing: "L-001", set: "solo" }, // 상대 미입력
  "A-15": { listing: "L-005", set: "all-unmet" }, // 조건 완화
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

  const preset = STATE_CASE[state];
  const activeListingId = preset?.listing ?? listingId;

  // ★ 픽스처 주입 지점 (화면당 1곳) — J-006 완료 후 실제 Query로 교체
  const scenario = resolveSet(state, set ?? preset?.set);

  const listing = listingById(activeListingId);
  const jd =
    scenario.judgments.find((x) => x.listingId === activeListingId) ??
    scenario.judgments[0];
  const solo = scenario.id === "solo";
  const sentence = COMPROMISE_SENTENCES[activeListingId];
  const relaxing = state === "A-15";

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
          <DisclosedValue href={`/spaces/${spaceId}/conditions?state=A-04a`}>
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
      />

      {relaxing ? <RelaxationPanel /> : null}

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
 * A-15 — 조건 완화 A안·B안 (PRD §14.3)
 *
 * 완화폭은 임의 제안값이 아니라 **현재 후보의 실제 미달량**에서 가져온다.
 * A안과 B안을 항상 동시에 보여준다. 두 조건을 동시에 낮추는 안은 만들지 않으며,
 * 그런 조작을 할 UI 자체가 없다.
 */
function RelaxationPanel() {
  return (
    <section className="mt-5 rounded-lg border border-line bg-surface p-5">
      <h2 className="mb-1 font-medium text-ink">조금 풀면 무엇이 달라질까요?</h2>
      <p className="mb-4 text-sm text-ink-muted">
        지금 모자란 만큼만 풀어봤어요. 한 번에 한 가지 조건만 풀 수 있어요.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {RELAXATION_OPTIONS.map((o) => (
          <div
            key={`${o.who}-${o.conditionLabel}`}
            className="rounded-md border border-line p-4"
          >
            <p className="mb-2 text-xs font-medium text-ink-muted">
              {o.who}안 — {o.conditionLabel}
            </p>
            <p className="nums mb-3 text-sm text-ink">
              {o.from} → <strong>{o.to}</strong>{" "}
              <span className="text-ink-muted">({o.delta})</span>
            </p>
            <div
              aria-hidden
              className="relative h-1.5 w-full rounded-full bg-neutral-bg"
            >
              <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-ink" />
              <span className="absolute -top-1 left-2/3 size-3.5 -translate-x-1/2 rounded-full border-2 border-surface bg-ink" />
            </div>
            {/* 살아나는 후보가 없으면 그렇게 말한다.
                없는 이득을 만들어내지 않는다(PRD §14.2). */}
            {o.recovers.length > 0 ? (
              <p className="mt-3 text-sm text-met">
                {o.recovers.map((id) => listingById(id).name).join(" · ")}가
                살아나요
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                이 조건만 풀어서는 살아나는 후보가 없어요
              </p>
            )}
            <p className="mt-1 text-xs text-ink-muted">
              상대 조건은 직접 바꿀 수 없어요 — 제안하면 상대가 수락할 때만
              반영돼요.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
