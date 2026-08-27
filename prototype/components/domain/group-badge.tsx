import type { CandidateGroup } from "@/lib/types";

/**
 * 후보 그룹 3분류 배지 (REQ-FUNC-011 · AC-11-01)
 *
 * 라벨은 PRD §13.2 문구 그대로다. 다른 말로 바꾸지 않는다.
 * 총점·순위·추천을 나타내는 배지는 이 파일에 존재하지 않는다.
 */
const GROUP_LABEL: Record<CandidateGroup, string> = {
  BOTH_MET: "둘 다 충족",
  ONE_SIDE_ONLY: "한쪽만 충족",
  BOTH_UNMET: "둘 다 불충족",
};

const GROUP_TONE: Record<CandidateGroup, string> = {
  BOTH_MET: "bg-met-bg text-met",
  ONE_SIDE_ONLY: "bg-confirm-bg text-confirm",
  BOTH_UNMET: "bg-unmet-bg text-unmet",
};

export function GroupBadge({ group }: { group: CandidateGroup }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${GROUP_TONE[group]}`}
    >
      {GROUP_LABEL[group]}
    </span>
  );
}

/**
 * `확인 필요`는 3분류 중 하나로 **흡수하지 않고** 별도 배지로 병기한다(AC-11-02).
 * 종합 판정을 대체하지 않는다 — 3분류 옆에 나란히 붙는다.
 */
export function ConfirmationBadge() {
  return (
    <span className="inline-block rounded-full border border-confirm/40 bg-confirm-bg px-2.5 py-0.5 text-xs font-medium text-confirm">
      확인 필요
    </span>
  );
}

export { GROUP_LABEL };
