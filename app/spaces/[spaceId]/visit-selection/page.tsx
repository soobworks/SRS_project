import { Fragment } from "react";
import Link from "next/link";
import {
  PrototypeShell,
  ScreenTitle,
  StepNav,
} from "@/components/dev/prototype-shell";
import { DisclosedValue } from "@/components/domain/disclosed-value";
import { resolveSet, listingById, VISIT_ROUNDS } from "@/lib/dev/scenarios";
import type { ConditionRow } from "@/lib/dev/view-types";

/**
 * V-001 — 방문 후보 2개 결정 (2라운드 분할 프로토콜) · **North Star 지점**
 *
 * 담는 PRD 화면(명세 §1.2): `A-16`(이번에 보러 갈 집 정하기) ·
 * `A-16e`(남은 한 자리 Option Grid)
 *
 * ## 제품 정체성 제약 (협상 불가)
 * 투표·순위·자동 선택을 어떤 형태로도 만들지 않는다(`decisions/0004`).
 * 일치 수에 따라 확정 / 한 자리 재비교 / 2라운드로 갈릴 뿐,
 * 시스템이 "이 집이 낫다"고 고르지 않는다.
 *
 * `two-round-selector.ts` 결정 트리와 `submitVisitSelection`은
 * `V-001` 원 순번의 일이다.
 */
export default async function VisitSelectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ state?: string; match?: string }>;
}) {
  const { spaceId } = await params;
  const { state = "A-16", match } = await searchParams;

  const key = state === "A-16e" ? "1" : (match ?? "2");
  const round = VISIT_ROUNDS[key] ?? VISIT_ROUNDS["2"];

  // ★ 픽스처 주입 지점 (화면당 1곳) — V-001 완료 후 실제 Query로 교체
  const scenario = resolveSet("A-13", "normal");

  return (
    <PrototypeShell state={state}>
      <ScreenTitle
        title="이번에 보러 갈 집을 골라주세요"
        sub={`각자 2곳씩 골라요 · ${round.round}라운드 (최대 2라운드)`}
      />

      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <PickBlock label="A가 고른 곳" picks={round.aPicks} matched={round.matched} />
        <PickBlock label="B가 고른 곳" picks={round.bPicks} matched={round.matched} />
      </div>

      {round.settled ? (
        <section className="rounded-lg border border-met/30 bg-met-bg/50 p-4">
          <h2 className="mb-1 font-medium text-ink">
            두 곳 다 겹쳤어요 — 이번엔 여기 두 곳을 보러 가요
          </h2>
          <p className="nums text-sm text-ink">
            {round.settled.map((id) => listingById(id).name).join(" · ")}
          </p>
        </section>
      ) : round.runoff ? (
        <RunoffGrid
          spaceId={spaceId}
          pair={round.runoff}
          settledOne={round.matched[0]}
          burden={scenario.burden}
          rowsFor={(id) =>
            scenario.judgments.find((j) => j.listingId === id) ?? scenario.judgments[0]
          }
        />
      ) : (
        <section className="rounded-lg border border-line bg-surface p-4">
          <h2 className="mb-1 font-medium text-ink">
            겹치는 곳이 없었어요 — 한 번 더 골라볼까요?
          </h2>
          <p className="text-sm text-ink-muted">
            2라운드예요. 여기서도 겹치지 않으면 각자 고른 곳을 하나씩 나눠
            보러 가요. 시스템이 대신 고르지 않아요.
          </p>
        </section>
      )}

      <StepNav
        links={[
          { href: `/spaces/${spaceId}/visit-selection?state=A-16&match=2`, label: "2개 일치" },
          { href: `/spaces/${spaceId}/visit-selection?state=A-16e`, label: "1개 일치" },
          { href: `/spaces/${spaceId}/visit-selection?state=A-16&match=0`, label: "0개 일치" },
          { href: `/spaces/${spaceId}/judgments?state=A-13`, label: "목록으로" },
        ]}
      />
    </PrototypeShell>
  );
}

function PickBlock({
  label,
  picks,
  matched,
}: {
  label: string;
  picks: string[];
  matched: string[];
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="mb-2 text-xs font-medium text-ink-muted">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {picks.map((id) => (
          <li key={id} className="flex items-center gap-2 text-sm text-ink">
            <span aria-hidden className="text-ink-muted">
              ·
            </span>
            {listingById(id).name}
            {matched.includes(id) ? (
              <span className="rounded bg-met-bg px-1.5 py-0.5 text-xs text-met">
                겹침
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A-16e — 남은 한 자리 비교. 행이 조건, 열이 후보인 Option Grid다(PRD §14.4).
 * **총점 행과 추천 배지를 두지 않는다.** 양보 관계를 설명한 뒤 선택은 사용자가 한다.
 */
function RunoffGrid({
  spaceId,
  pair,
  settledOne,
  burden,
  rowsFor,
}: {
  spaceId: string;
  pair: [string, string];
  settledOne: string;
  burden: Record<string, string>;
  rowsFor: (id: string) => { a: ConditionRow[]; b: ConditionRow[] };
}) {
  const labels = ["예산", "통근", "면적", "주차", "유형"];
  /**
   * 5분류를 기호 하나로 뭉뚱그리지 않는다.
   * `확인 필요`(?)와 `기준 없음`·`해당 없음`·`계산 불가`는 서로 다른 상태이며,
   * 이들을 섞는 것이 이 프로젝트에서 가장 치명적인 오분류다(PRD §18.3).
   */
  const cell = (id: string, who: "a" | "b", label: string) => {
    const row = rowsFor(id)[who].find((r) => r.label === label);
    if (!row) return <span className="text-neutral">—</span>;

    switch (row.status) {
      case "MET":
        return <span className="nums text-met">✓</span>;
      case "UNMET":
        return (
          <span className="nums text-unmet">✗{row.gap ? ` ${row.gap}` : ""}</span>
        );
      case "CONFIRMATION_NEEDED":
        return <span className="nums text-confirm">? 확인 필요</span>;
      case "CALCULATION_FAILED":
        return <span className="nums text-neutral">계산 불가</span>;
      case "NOT_APPLICABLE":
        return (
          <span className="nums text-neutral">
            {row.actual === "해당 없음" ? "해당 없음" : "기준 없음"}
          </span>
        );
    }
  };

  return (
    <section>
      <p className="mb-3 rounded-md border border-met/30 bg-met-bg/50 px-3 py-2 text-sm text-ink">
        <b>{listingById(settledOne).name}</b>는 두 분 다 골라서 확정됐어요. 남은
        한 자리를 두 곳 중에서 정해요.
      </p>

      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-4 py-2 font-medium">조건</th>
              {pair.map((id) => (
                <th key={id} className="px-4 py-2 font-medium" colSpan={2}>
                  {listingById(id).name}
                </th>
              ))}
            </tr>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-4 py-1.5" />
              {pair.map((id) => (
                <Fragment key={`${id}-head`}>
                  <th className="px-4 py-1.5 font-normal">A</th>
                  <th className="px-4 py-1.5 font-normal">B</th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {labels.map((label) => (
              <tr key={label}>
                <td className="px-4 py-2.5 text-ink-muted">{label}</td>
                {pair.map((id) => (
                  <Fragment key={`${id}-${label}`}>
                    <td className="px-4 py-2.5">{cell(id, "a", label)}</td>
                    <td className="px-4 py-2.5">{cell(id, "b", label)}</td>
                  </Fragment>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2.5 text-ink-muted">월 실부담</td>
              {pair.map((id) => (
                <td key={`${id}-burden`} className="px-4 py-2.5" colSpan={2}>
                  <DisclosedValue
                    href={`/spaces/${spaceId}/conditions?state=A-04a`}
                  >
                    {burden[id]}
                  </DisclosedValue>
                </td>
              ))}
            </tr>
            {/* 총점 행과 추천 배지는 두지 않는다 — PRD §14.4 */}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-ink-muted">
        어느 쪽이 낫다고 대신 정해드리지 않아요. 두 분이 직접 고르세요.
      </p>
      <div className="mt-3 flex gap-2">
        {pair.map((id) => (
          <Link
            key={id}
            href={`/spaces/${spaceId}/visit-selection?state=A-16&match=2`}
            className="rounded-md border border-line bg-surface px-4 py-2 text-sm text-ink"
          >
            {listingById(id).name}로 정하기
          </Link>
        ))}
      </div>
    </section>
  );
}
