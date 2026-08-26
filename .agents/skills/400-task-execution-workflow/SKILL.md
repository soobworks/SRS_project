---
name: 400-task-execution-workflow
description: SRS_project/tasks/v2 의 태스크 명세 52건을 실제 구현으로 옮기는 절차. 태스크를 시작·진행·완료할 때, 그리고 무엇부터 할지 고를 때 사용한다.
---

# 태스크 실행 워크플로

이 저장소는 **기획이 끝난 상태다.** 태스크 52건과 의존 관계·일정이 모두 확정돼 있다. 구현자가 할 일은 새로 정하는 게 아니라 **정해진 것을 순서대로 끝내는 것**이다.

## 원천 문서

| 문서 | 무엇을 답하는가 |
| --- | --- |
| `SRS_project/tasks/v2/TASK-마스터-리스트.md` | 태스크 52건 · 선행/후행 · 복잡도(H/M/L) 단일 표 |
| `SRS_project/tasks/v2/{Task ID}-*.md` | **각 태스크를 어떻게** 끝내는가(AC · DoD · Dependencies) |
| `SRS_project/tasks/v2/[태스크 리스트] 같이보기.md` | Epic별 상세 + 유형(Type) + 임계경로 + 요구사항 커버리지 |
| `SRS_project/tasks/v2/[총괄] 개발 실행 계획.md` | 실행 전략 · DAG · 표준 일정(2레인, 66일) |
| `SRS_project/tasks/v2/[총괄] 압축 수행 일정.md` | 압축 일정(4레인, 임계경로 하한 42일) |
| GitHub Issues #1~#52 (`soobworks/SRS_project`) | 태스크별 이슈 — Project #1 연결은 진행 중(스킬 `202` 참조) |

## 1. 무엇부터 하는가

1. 선행이 모두 끝난 Task를 고른다 — `TASK-마스터-리스트.md`의 "선행 Task" 열, 또는 GitHub Issue 본문의 Dependencies.
2. 동률이면 임계경로 위 Task를 먼저 잡는다 — `[총괄] 개발 실행 계획.md` §2.4의 12단계 사슬(`C-000→C-001→A-001→I-001→J-001→J-003→J-006→R-001→R-002→R-003→X-002→TEST-X-NOTIF`).
3. 그다음 우선순위는 후행(Blocks) 수다 — `J-006`(7건)·`C-000`(6건)이 최대 병목이다.

**선행이 안 끝난 Task를 시작하지 않는다.**

## 2. 시작하기 전에 읽는다

- `SRS_project/tasks/v2/{Task ID}-*.md` 전체 — Task Breakdown, Acceptance Criteria, **Dependencies & Blockers**.
- 판정(`domain/judgment/`) 관련 Task라면 스킬 `304-judgment-domain-rules`를 먼저 읽는다.
- 참조된 SRS 절(`REQ-FUNC-*`/`REQ-NF-*`).

읽은 결과가 Task 문서와 어긋나면 **구현을 시작하기 전에** 그 사실을 밝힌다.

## 3. 브랜치와 이슈

```bash
gh issue view <번호> --repo soobworks/SRS_project
git switch -c feat/<번호>-<task-id-소문자>   # 예: feat/12-s-002
```
- 이슈 번호를 브랜치에 남긴다.
- 상세는 스킬 `200-git-commit-push-pr`.

## 4. 구현

- 스킬 `300-tech-constraints-guardrails`로 **제약 위반을 먼저 차단**한다.
- 서버 코드 배치는 스킬 `301-server-boundary-rules`.
- 데이터 접근은 스킬 `302-data-access-rules`.
- 판정 도메인은 스킬 `304-judgment-domain-rules`(§3 절대 규칙).
- AI 확장을 켤 때만 스킬 `303-ai-integration-rules`.
- 테스트는 스킬 `tdd` — 해당 Task의 companion `TEST-*` 문서가 AC를 그대로 테스트 케이스로 옮긴 것이다.

**Task 문서에 없는 기능을 만들지 않는다.**

## 5. 완료 판정

Task 문서의 DoD가 우선한다. 공통 항목:

- Acceptance Criteria 전항 충족
- 타입 검사·린트 통과
- companion `TEST-*` 통과(기능 Task는 테스트 없이 완료로 보지 않는다 — `CLAUDE.md` §3)
- 문서와 실제가 어긋났으면 문서를 고친다

## 6. 마무리

```bash
gh pr create --draft --title "[feat] ... (<Task ID>)" --body "... Closes #<번호>"
```
- PR 단위 = Task 단위가 원칙이다.
- 순차 게이트 리뷰는 스킬 `review-merge`, 결합된 PR 묶음의 선병합은 스킬 `merge-review`.

## 문서 ↔ GitHub 동기화

⚠️ **GitHub 이슈를 직접 고친 내용은 문서로 역류하지 않는다.** 일정·의존성을 바꿔야 하면 `TASK-마스터-리스트.md`를 고치고 `tools/gen_exec_plan.py`를 다시 돌린다. 태스크 리스트·실행계획 문서는 재계산 대상이지 손으로 고치는 대상이 아니다.

## 원천

- `SRS_project/tasks/TASK-재추출-전략-v2-계획서.md` — Task가 어떻게 추출됐는지(계약 우선·Read/Write 분리·AC→테스트)
