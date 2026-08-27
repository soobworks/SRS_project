import Link from "next/link";
import {
  PrototypeShell,
  ScreenTitle,
  StepNav,
} from "@/components/dev/prototype-shell";
import { DisclosedValue } from "@/components/domain/disclosed-value";
import { ASSUMPTIONS, NOT_ADVICE, resolveSet } from "@/lib/dev/scenarios";

/**
 * I-001 — 기본 조건 입력 (예산 · 출퇴근)
 *
 * 담는 PRD 화면(명세 §1.2): `A-03`(출퇴근 분기) · `A-03d`(출근 안 함) ·
 * `A-04`(예산 입력) · `A-04a`(전제 패널) · `A-05`(첫 결과 미리보기) ·
 * `B-03`·`B-04`(B 기본 입력, 모바일)
 *
 * 폼 UI만 만든다. `saveBudgetAndCommute` Server Action과 서버 측 검증은
 * `I-001` 원 순번의 일이다.
 */
export default async function ConditionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ state?: string; form?: string }>;
}) {
  const { spaceId } = await params;
  const { state = "A-04", form } = await searchParams;

  // 화면 ID 접두사가 폼팩터뿐 아니라 **누구의 입력인지**도 가른다(명세 §2.1).
  // B 화면에서 A의 값을 보여주면 두 사람이 같은 조건을 가진 것처럼 읽힌다.
  const isMobile = state.startsWith("B-");
  const who: "a" | "b" = isMobile ? "b" : "a";
  const scenario = resolveSet(state);

  if (state === "A-04a") {
    return (
      <PrototypeShell state={state}>
        <AssumptionPanel spaceId={spaceId} />
      </PrototypeShell>
    );
  }

  const noCommute = state === "A-03d";
  const commuteStep = state === "A-03" || state === "A-03d" || state === "B-04";
  const preview = state === "A-05";

  return (
    <PrototypeShell form={isMobile ? "mobile" : "desktop"} state={state}>
      <div className={isMobile ? "p-4" : "max-w-[42rem]"}>
        {preview ? (
          <PreviewStep spaceId={spaceId} burden={scenario.burden["L-001"]} />
        ) : commuteStep ? (
          <CommuteStep spaceId={spaceId} noCommute={noCommute} who={who} />
        ) : (
          <BudgetStep
            spaceId={spaceId}
            empty={form === "empty"}
            mobile={isMobile}
            who={who}
          />
        )}

        <StepNav
          links={[
            { href: `/spaces/${spaceId}/conditions?state=A-03`, label: "출퇴근" },
            { href: `/spaces/${spaceId}/conditions?state=A-04`, label: "예산" },
            {
              href: `/spaces/${spaceId}/conditions?state=A-04a`,
              label: "전제 패널",
            },
            { href: `/spaces/${spaceId}/judgments?state=A-13`, label: "판정 결과" },
          ]}
        />
      </div>
    </PrototypeShell>
  );
}

/** A-04 — 예산 입력. 미입력 시 저장 자체를 막는다(AC-02-01). */
/** 명세 §6.5 — A 예산 100만 / B 예산 85만. 사람마다 다른 값을 쓴다. */
const BUDGET_OF = { a: "100", b: "85" } as const;
/** 명세 §6.3 — A 출근지 강남역 / B 출근지 여의도역. */
const ORIGIN_OF = { a: "강남역", b: "여의도역" } as const;

function BudgetStep({
  spaceId,
  empty,
  mobile,
  who,
}: {
  spaceId: string;
  empty: boolean;
  mobile: boolean;
  who: "a" | "b";
}) {
  return (
    <>
      <ScreenTitle
        title="한 달에 얼마까지 낼 수 있나요?"
        sub="보증금 이자와 관리비, 교통비까지 합친 월 실부담 기준이에요"
      />

      <label
        htmlFor="budget"
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        월 실부담 상한
      </label>
      <div className="flex items-center gap-2">
        <input
          id="budget"
          inputMode="numeric"
          defaultValue={empty ? "" : BUDGET_OF[who]}
          placeholder="예: 100"
          aria-invalid={empty}
          aria-describedby={empty ? "budget-error" : "budget-help"}
          className={`nums w-40 rounded-md border bg-surface px-3 py-2 text-sm ${
            empty ? "border-unmet" : "border-line"
          }`}
        />
        <span className="text-sm text-ink-muted">만원</span>
      </div>

      {empty ? (
        <p id="budget-error" className="mt-2 text-sm text-unmet">
          예산을 입력해야 다음으로 넘어갈 수 있어요. 예산은 두 분 모두에게 항상
          필요한 조건이에요.
        </p>
      ) : (
        <p id="budget-help" className="mt-2 text-sm text-ink-muted">
          이 금액과 각 집의 월 실부담을 견줘요.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={
            empty
              ? `/spaces/${spaceId}/conditions?state=A-04`
              : `/spaces/${spaceId}/conditions?state=A-03`
          }
          aria-disabled={empty}
          className={`inline-block rounded-md px-4 py-2 text-sm ${
            empty
              ? "cursor-not-allowed bg-neutral-bg text-neutral"
              : "bg-ink text-surface"
          }`}
        >
          다음
        </Link>
        {!empty ? (
          <Link
            href={`/spaces/${spaceId}/conditions?state=A-04&form=empty`}
            className="inline-block rounded-md border border-line px-4 py-2 text-sm text-ink"
          >
            비워두면 어떻게 되나요
          </Link>
        ) : null}
        {!mobile ? (
          <Link
            href={`/spaces/${spaceId}/conditions?state=A-04a`}
            className="inline-block rounded-md border border-line px-4 py-2 text-sm text-ink"
          >
            어떻게 계산하나요
          </Link>
        ) : null}
      </div>
    </>
  );
}

/** A-03 / A-03d — 출퇴근 여부에 따른 점진적 공개. 출근 안 함도 정상 경로다. */
function CommuteStep({
  spaceId,
  noCommute,
  who,
}: {
  spaceId: string;
  noCommute: boolean;
  who: "a" | "b";
}) {
  return (
    <>
      <ScreenTitle
        title="정기적으로 출퇴근하시나요?"
        sub="출근하지 않으셔도 괜찮아요. 그러면 통근 항목 자체를 빼고 볼게요."
      />

      <div className="flex gap-2">
        <Link
          href={`/spaces/${spaceId}/conditions?state=A-03`}
          className={`rounded-md border px-4 py-2 text-sm ${
            noCommute
              ? "border-line bg-surface text-ink"
              : "border-ink bg-ink text-surface"
          }`}
        >
          네, 출퇴근해요
        </Link>
        <Link
          href={`/spaces/${spaceId}/conditions?state=A-03d`}
          className={`rounded-md border px-4 py-2 text-sm ${
            noCommute
              ? "border-ink bg-ink text-surface"
              : "border-line bg-surface text-ink"
          }`}
        >
          아니요, 출근하지 않아요
        </Link>
      </div>

      {noCommute ? (
        <div className="mt-5 rounded-lg border border-line bg-surface p-4">
          <p className="text-sm text-ink">
            통근 시간과 교통비는 <strong>보여드리지 않을게요.</strong>
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            잴 대상이 없는 것이라 <b>0원으로 계산하지 않아요.</b> 결과 화면에서
            통근 줄 자체가 빠집니다.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor="origin"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              출근지
            </label>
            <input
              id="origin"
              defaultValue={ORIGIN_OF[who]}
              className="w-64 rounded-md border border-line bg-surface px-3 py-2 text-sm"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">
              이동수단
            </span>
            <div className="flex gap-2">
              <span className="rounded-md border border-ink bg-ink px-3 py-1.5 text-sm text-surface">
                대중교통
              </span>
              <span className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink">
                자차
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <Link
          href={`/spaces/${spaceId}/conditions?state=A-05`}
          className="inline-block rounded-md bg-ink px-4 py-2 text-sm text-surface"
        >
          첫 결과 보기
        </Link>
      </div>
    </>
  );
}

/** A-05 — 첫 결과 미리보기. 지금 확보한 실제값으로 가능한 판정만 보여준다. */
function PreviewStep({
  spaceId,
  burden,
}: {
  spaceId: string;
  burden: string;
}) {
  return (
    <>
      <ScreenTitle
        title="지금 입력으로 이만큼 보여요"
        sub="조건을 더 넣으면 볼 수 있는 것도 늘어나요"
      />
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="text-sm text-ink-muted">흑석 리버뷰 월 실부담</p>
        <p className="mt-1 text-lg text-ink">
          <DisclosedValue href={`/spaces/${spaceId}/conditions?state=A-04a`}>
            {burden}
          </DisclosedValue>
        </p>
        <p className="mt-2 text-xs text-ink-muted">{NOT_ADVICE}</p>
      </div>
      <div className="mt-5">
        <Link
          href={`/spaces/${spaceId}/judgments?state=A-13`}
          className="inline-block rounded-md bg-ink px-4 py-2 text-sm text-surface"
        >
          5곳 전부 보기
        </Link>
      </div>
    </>
  );
}

/** A-04a — 전제 패널. 전제 전문의 정본이며 신뢰도 등급을 노출한다(명세 §5.4). */
function AssumptionPanel({ spaceId }: { spaceId: string }) {
  const tone: Record<string, string> = {
    "근거 있음": "bg-met-bg text-met",
    "근거 있음/신뢰도 중간": "bg-confirm-bg text-confirm",
    가정: "bg-neutral-bg text-neutral",
    TBD: "bg-unmet-bg text-unmet",
  };
  return (
    <>
      <ScreenTitle
        title="이 숫자는 이렇게 계산했어요"
        sub="기준 시점과 가정, 그리고 어디까지 믿을 수 있는지를 함께 적었어요"
      />
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[42rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-4 py-2 font-medium">전제</th>
              <th className="px-4 py-2 font-medium">값</th>
              <th className="px-4 py-2 font-medium">신뢰도</th>
              <th className="px-4 py-2 font-medium">비고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ASSUMPTIONS.map((a) => (
              <tr key={a.label}>
                <td className="px-4 py-2.5 text-ink-muted">{a.label}</td>
                <td className="nums px-4 py-2.5 text-ink">{a.value}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs ${tone[a.confidence]}`}
                  >
                    {a.confidence}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-ink-muted">{a.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink-muted">
        {NOT_ADVICE}
      </p>
      <StepNav
        links={[
          { href: `/spaces/${spaceId}/conditions?state=A-04`, label: "예산 입력" },
          { href: `/spaces/${spaceId}/judgments?state=A-13`, label: "판정 결과" },
        ]}
      />
    </>
  );
}
