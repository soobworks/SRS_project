import Link from "next/link";
import {
  PrototypeShell,
  ScreenTitle,
  ExitBadge,
  StepNav,
} from "@/components/dev/prototype-shell";
import { CompactSummary } from "@/components/domain/balanced-comparison";
import { GroupBadge, ConfirmationBadge } from "@/components/domain/group-badge";
import type { CandidateGroup, ConditionKey } from "@/lib/types";
import { DisclosedValue } from "@/components/domain/disclosed-value";
import {
  resolveSet,
  listingById,
  PREFERENCES,
  RELAXATION_OPTIONS,
  SEARCH_FILTER,
} from "@/lib/dev/scenarios";

/**
 * J-008 — 판정 결과 목록
 *
 * 담는 PRD 화면(명세 §1.2): `A-12`(1인 빈 경로) · `A-13`(3분류 목록) ·
 * `A-13b`(전부 불충족) · `A-13b-2`(재탐색 필터) · `A-13c`(조건 충돌) ·
 * `B-05`(B의 첫 결과, 모바일)
 *
 * 프로토타입 데이터 주입 지점은 아래 `resolveSet()` **한 곳뿐**이다.
 * `J-006` 완료 시 이 한 줄을 `getSoloJudgment()` / 판정 Query로 바꾼다.
 */
export default async function JudgmentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ state?: string; set?: string }>;
}) {
  const { spaceId } = await params;
  const { state = "A-13", set } = await searchParams;

  // ★ 픽스처 주입 지점 (화면당 1곳) — J-006 완료 후 실제 Query로 교체
  const scenario = resolveSet(state, set);

  const isMobile = state.startsWith("B-");
  const solo = scenario.id === "solo";

  return (
    <PrototypeShell form={isMobile ? "mobile" : "desktop"} state={state}>
      <div className={isMobile ? "p-4" : ""}>
        {state === "A-13b-2" ? (
          <SearchFilterView spaceId={spaceId} />
        ) : (
          <>
            <ScreenTitle
              title={
                solo
                  ? "지금 내 조건으로 본 5곳"
                  : isMobile
                    ? "두 사람 조건으로 본 5곳"
                    : "담은 집 5곳이 두 사람 조건에 어떤지 보세요"
              }
              sub={
                solo
                  ? "B가 아직 참여하지 않아 1인 입력만 반영했어요"
                  : state === "A-13c"
                    ? "조건마다 가장 가까운 후보가 어디인지 봐요"
                    : scenario.label
              }
            />

            {solo ? (
              <p className="mb-4 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink-muted">
                지금은 <strong className="text-ink">1인 입력만 반영</strong>한
                결과예요. 실부담도 1인 기준 교통비로 계산했어요.
              </p>
            ) : null}

            {state === "S-02" ? (
              <section className="mb-5 rounded-lg border border-line bg-surface p-4">
                <h2 className="mb-1 font-medium text-ink">
                  일부 항목은 지금 잴 수 없었어요
                </h2>
                <p className="text-sm text-ink-muted">
                  노량진 스카이의 B 통근 시간은 경로를 계산하지 못해{" "}
                  <b className="text-neutral">계산 불가</b>로 표시했어요.
                  기준에 못 미친 <b className="text-unmet">미충족</b>과는 다른
                  상태예요 — 조건을 못 지켰다는 뜻이 아니라, 아직 재보지
                  못했다는 뜻이에요.
                </p>
              </section>
            ) : null}
            {state === "S-03" ? (
              <section className="mb-5 rounded-lg border border-line bg-surface p-4">
                <h2 className="mb-1 font-medium text-ink">
                  통근 경로를 찾지 못했어요
                </h2>
                <p className="text-sm text-ink-muted">
                  출근지에서 이 집까지 가는 길을 계산하지 못했어요. 세 가지는
                  서로 다른 상태예요 —{" "}
                  <b className="text-neutral">계산 불가</b>(재보려 했지만
                  실패), <b className="text-neutral">해당 없음</b>(출근을 안
                  하셔서 잴 대상이 없음),{" "}
                  <b className="text-unmet">미충족</b>(재봤는데 기준에 못 미침).
                  이번은 첫 번째예요.
                </p>
              </section>
            ) : null}
            {state === "A-13b" ? <DeadEndPanel spaceId={spaceId} /> : null}
            {state === "A-13c" ? <ConflictPanel scenario={scenario} /> : null}

            {/* 3분류 그룹으로 묶는다(명세 §9.1). 그룹 순서는 고정이며
                그룹 내부는 후보를 담은 순서 그대로다 — 재정렬하지 않는다.
                1인 빈 경로(group=null)는 3분류가 성립하지 않아 평면 나열한다. */}
            {(solo
              ? [null]
              : (["BOTH_MET", "ONE_SIDE_ONLY", "BOTH_UNMET"] as CandidateGroup[])
            ).map((g) => {
              const rows = scenario.judgments.filter((x) => x.group === g);
              if (rows.length === 0) return null;
              return (
                <section key={g ?? "solo"} className="mb-5">
                  {g ? (
                    <h2 className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                      <GroupBadge group={g} />
                      <span className="nums text-ink-muted">{rows.length}곳</span>
                    </h2>
                  ) : null}
            <ul className="flex flex-col gap-3">
              {rows.map((jd) => {
                const listing = listingById(jd.listingId);
                return (
                  <li
                    key={jd.listingId}
                    className="rounded-lg border border-line bg-surface p-4"
                  >
                    {/* 카드 전체를 링크로 감싸지 않는다 — 안에 전제 공개(ⓘ) 링크가
                        들어가 `<a>` 중첩이 되기 때문이다. 제목만 링크로 둔다. */}
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/spaces/${spaceId}/listings/${jd.listingId}?state=A-14&set=${scenario.id}`}
                          className="font-medium text-ink underline-offset-4 hover:underline"
                        >
                          {listing.name}
                        </Link>
                        <span className="text-xs text-ink-muted">
                          {listing.listingType} · 역도보 {listing.walkToStationMin}분
                        </span>
                        <span className="ml-auto text-sm text-ink-muted">
                          월{" "}
                          <DisclosedValue
                            href={`/spaces/${spaceId}/conditions?state=A-04a`}
                          >
                            {scenario.burden[jd.listingId]}
                          </DisclosedValue>
                        </span>
                      </div>

                      {jd.confirmationNeeded ? (
                        <div className="mb-2">
                          <ConfirmationBadge />
                        </div>
                      ) : null}

                      <div className="flex flex-col gap-0.5">
                        <CompactSummary label="A" rows={jd.a} />
                        {solo ? (
                          <p className="text-sm text-neutral">
                            B · 아직 조건을 입력하지 않았어요
                          </p>
                        ) : (
                          <CompactSummary label="B" rows={jd.b} />
                        )}
                      </div>
                      <Link
                        href={`/spaces/${spaceId}/listings/${jd.listingId}?state=A-14&set=${scenario.id}`}
                        className="mt-2 inline-block text-xs text-ink-muted underline underline-offset-4"
                      >
                        판정 근거 보기 →
                      </Link>
                  </li>
                );
              })}
            </ul>
                </section>
              );
            })}

            <PreferenceCards solo={solo} />
          </>
        )}

        <StepNav
          links={[
            { href: `/spaces/${spaceId}?state=A-02`, label: "후보 선택" },
            {
              href: `/spaces/${spaceId}/conditions?state=A-04`,
              label: "조건 입력",
            },
            {
              href: `/spaces/${spaceId}/listings/L-001?state=A-14b&set=normal`,
              label: "trade-off 상세",
            },
            {
              href: `/spaces/${spaceId}/visit-selection?state=A-16&match=2`,
              label: "방문 후보",
            },
          ]}
        />
      </div>
    </PrototypeShell>
  );
}

/** A-13b — 전부 불충족 막다른 길. 한 조건 완화로 살아나는 후보를 제시한다. */
function DeadEndPanel({ spaceId }: { spaceId: string }) {
  return (
    <section className="mb-5 rounded-lg border border-unmet/30 bg-unmet-bg/50 p-4">
      <h2 className="mb-1 font-medium text-ink">
        지금 후보 5곳이 모두 &ldquo;둘 다 불충족&rdquo;이에요
      </h2>
      <p className="mb-3 text-sm text-ink-muted">
        한 가지 조건만 실제 미달량만큼 풀면 살아나는 후보가 있어요. 두 조건을
        동시에 푸는 안은 만들지 않아요.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {RELAXATION_OPTIONS.map((o) => (
          <div
            key={`${o.who}-${o.conditionLabel}`}
            className="rounded-md border border-line bg-surface p-3 text-sm"
          >
            <p className="mb-1 text-xs text-ink-muted">{o.who}안</p>
            {/* 실부담 파생값이라 전제를 함께 보인다(명세 §5.2).
                ⓘ는 행당 1개 — 완화 후 값에만 달고 미달량에는 달지 않는다(§5.3). */}
            <p className="nums text-ink">
              {o.conditionLabel} {o.from} →{" "}
              {o.conditionLabel === "예산" ? (
                <DisclosedValue
                  href={`/spaces/${spaceId}/conditions?state=A-04a`}
                >
                  {o.to}
                </DisclosedValue>
              ) : (
                <strong>{o.to}</strong>
              )}{" "}
              <span className="text-ink-muted">({o.delta})</span>
            </p>
            {o.recovers.length > 0 ? (
              <p className="mt-1 text-xs text-met">
                {o.recovers.map((id) => listingById(id).name).join(" · ")} 살아남
              </p>
            ) : (
              <p className="mt-1 text-xs text-ink-muted">
                이 조건만 풀어서는 살아나는 후보 없음
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm">
        <Link
          href={`/spaces/${spaceId}/judgments?state=A-13b-2`}
          className="text-ink underline underline-offset-4"
        >
          한 조건을 풀어도 회복되지 않으면 어떻게 하나요?
        </Link>
      </p>
    </section>
  );
}

/**
 * A-13c — 후보 집합 내 조건 충돌 설명
 *
 * **픽스처에서 도출한다.** 문장을 손으로 쓰면 화면 아래 카드와 어긋나고,
 * 실제로 어긋났었다(EVAL #5 TOP_FIX — 통근에 가장 가까운 곳을 잘못 지목).
 * 이 화면은 "조건마다 가장 가까운 후보"를 말하므로 같은 데이터에서 뽑아야 한다.
 *
 * 정도(magnitude)가 있는 조건만 줄 세운다 — 주차 `없음`·유형 `빌라` 처럼
 * 유무형·일치형은 "얼마나 가깝다"가 성립하지 않는다.
 *
 * 전체 지역에 그런 집이 없다고 단정하지 않는다.
 */
const RANKABLE: ConditionKey[] = ["budget", "commute", "walkToStation", "area"];

/** `+월 15만` · `+3분` · `−7㎡` 에서 크기만 뽑는다. 없으면 줄 세우지 않는다. */
const magnitudeOf = (gap: string | null): number | null => {
  if (!gap) return null;
  const m = gap.match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

function ConflictPanel({ scenario }: { scenario: ReturnType<typeof resolveSet> }) {
  // (조건 × 사람)마다 "이 기준을 만족하는 후보가 하나라도 있는가"를 본다.
  // 하나도 없는 쌍이 **진짜 막고 있는 것**이다 — 어떤 후보로도 충족되지 않는
  // 조건. 하나라도 충족하는 조건은 이 화면이 설명할 충돌이 아니다.
  const blockers = RANKABLE.flatMap((key) =>
    (["A", "B"] as const).map((who) => {
      let label = "";
      let hasThreshold = false;
      let satisfied = false;
      let closest: { listingId: string; gap: string; mag: number } | null = null;

      for (const jd of scenario.judgments) {
        const rows = who === "A" ? jd.a : jd.b;
        const row = rows.find((r) => r.key === key && r.threshold !== null);
        if (!row) continue;
        hasThreshold = true;
        label = row.label;
        if (row.status === "MET") {
          satisfied = true;
          break;
        }
        const mag = magnitudeOf(row.gap);
        if (row.status !== "UNMET" || mag === null) continue;
        if (!closest || mag < closest.mag)
          closest = { listingId: jd.listingId, gap: row.gap!, mag };
      }

      if (!hasThreshold || satisfied || !closest) return null;
      return { key, who, label, closest };
    }),
  ).filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <section className="mb-5 rounded-lg border border-line bg-surface p-4">
      <h2 className="mb-1 font-medium text-ink">
        지금 담은 5곳 안에서는 두 분 조건이 동시에 맞는 집이 없어요
      </h2>
      <p className="mb-3 text-sm text-ink-muted">
        어떤 후보로도 맞출 수 없는 조건만 골라, 그중 가장 가까운 곳과 얼마나
        모자란지 알려드려요. 서울 전체에 그런 집이 없다는 뜻은 아니에요.
      </p>
      {blockers.length > 0 ? (
        <ul className="nums flex flex-col gap-1.5 text-sm">
          {blockers.map((b) => (
            <li key={`${b.key}-${b.who}`}>
              {b.label} — {b.who} 기준을 맞추는 곳이 없어요. 가장 가까운 곳은{" "}
              {listingById(b.closest.listingId).name}, <b>{b.closest.gap}</b>{" "}
              모자라요
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-muted">
          조건 하나하나는 맞는 곳이 있어요. 다만 그것들이 **한 집에 동시에**
          모이지 않는 상황이에요.
        </p>
      )}
    </section>
  );
}

/** A-13b-2 — 재탐색 필터 제안. 결과 수와 필터 URL 규격은 PRD `[TBD]`라 만들지 않는다. */
function SearchFilterView({ spaceId }: { spaceId: string }) {
  return (
    <>
      <ScreenTitle
        title="이렇게 찾으면 두 분 조건에 더 가까워요"
        sub="한 조건만 풀어서는 살아나는 후보가 없어, 조건을 검색 필터로 바꿔 봤어요"
      />
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-4 py-2 font-medium">조건</th>
              <th className="px-4 py-2 font-medium">현재</th>
              <th className="px-4 py-2 font-medium">제안 필터</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {SEARCH_FILTER.map((f) => (
              <tr key={f.label}>
                <td className="px-4 py-2.5 text-ink-muted">{f.label}</td>
                <td className="nums px-4 py-2.5 text-ink">{f.current}</td>
                <td className="px-4 py-2.5">
                  {f.proposed ? (
                    <span className="nums text-ink">{f.proposed}</span>
                  ) : (
                    <span className="text-neutral">필터 없음</span>
                  )}
                  {f.note ? (
                    <span className="ml-2 text-xs text-ink-muted">{f.note}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        이 조건으로 몇 건이 나오는지는 아직 알려드릴 수 없어요 — 검색 결과 수
        연동이 정해지지 않았습니다.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {/* 자동 이동 금지(AC-16-01) — 누르는 순간에만 나간다.
            프로토타입에는 나갈 대상이 없어 아래 배지가 그 자리를 대신한다. */}
        <span className="inline-flex w-fit cursor-not-allowed items-center rounded-md bg-ink px-4 py-2 text-sm text-surface opacity-60">
          이 필터로 찾아보기
        </span>
        <ExitBadge>
          「이 필터로 찾아보기」를 누르면 네이버 탐색으로 나갑니다 — 프로토타입
          범위 밖이라 여기서 멈춥니다. 자동으로 이동하지 않습니다.
        </ExitBadge>
        <Link
          href={`/spaces/${spaceId}/judgments?state=A-13b`}
          className="text-sm text-ink underline underline-offset-4"
        >
          ← 완화 경로 다시 보기
        </Link>
      </div>
    </>
  );
}

/** 선호 카드 — 매물 비교표에 넣지 않고 사람 단위로 한 번만 보여준다(PRD §13.2). */
function PreferenceCards({ solo }: { solo: boolean }) {
  return (
    <section className="mt-6 grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="mb-2 text-xs font-medium text-ink-muted">A의 선호</p>
        <ul className="flex flex-col gap-1 text-sm text-ink">
          {PREFERENCES.a.map((p) => (
            <li key={p}>· {p}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="mb-2 text-xs font-medium text-ink-muted">B의 선호</p>
        {solo ? (
          <p className="text-sm text-neutral">아직 남긴 선호가 없어요</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm text-ink">
            {PREFERENCES.b.map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
