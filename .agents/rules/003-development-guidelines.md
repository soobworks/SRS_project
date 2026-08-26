---
description: 개발 규범 — 작업 진입 절차, 계층 규칙, 완료 정의
globs: ["**/*"]
alwaysApply: true
---
# Development Guidelines

## 작업 진입 절차

이 저장소는 **기획이 끝난 상태**다. 코드를 쓰기 전에 읽을 것이 정해져 있다.

1. `SRS_project/tasks/v2/TASK-마스터-리스트.md`에서 Task ID와 선행 관계를 확인한다.
2. `SRS_project/tasks/v2/{Task ID}-*.md`에서 Acceptance Criteria와 Dependencies를 읽는다.
3. Task가 참조하는 SRS 절을 읽는다.
4. **선행 Task가 끝나지 않았으면 시작하지 않는다.**

없는 기능을 만들지 않는다. Task 문서에 없는 것을 구현했다면 그건 범위 이탈이다.

## Version Control

- **Branching:** `<type>/<issue-number>-<short-description>`
- **Commit:** Conventional Commits. 원자적으로, 각 커밋이 빌드되는 상태로.
- **main 직접 커밋 금지.**
- 상세는 스킬 `200-git-commit-push-pr`.

## 계층 규칙

C-TEC-002가 서버 진입점을 셋으로 제한한다.

| 상황 | 선택 |
| --- | --- |
| 화면 렌더용 읽기 | RSC 직접 조회 |
| 사용자 변경 작업 | Server Action |
| 외부 시스템 수신(웹훅·Cron) | Route Handler |

**도메인 경계** — `domain/<name>/`가 유일한 공개 표면이다. 다른 도메인의 내부 파일을 직접 import하지 않는다.

## 판정 도메인 — 절대 규칙

- 여러 조건의 판정 결과를 합산·가중치화해 단일 스코어로 만들지 않는다.
- 판정 결과는 항상 5분류, 그룹화는 항상 3분류로 끝난다.
- 상세는 스킬 `304-judgment-domain-rules`.

## Security

- 비밀값은 서버에만 둔다. `NEXT_PUBLIC_` 접두는 공개해도 되는 값에만 쓴다.
- RLS를 우회하는 경로를 만들지 않는다.
- 사용자 입력은 스키마로 검증한 뒤 도메인에 들인다 — Server Action 인자는 신뢰할 수 없다.

## Code Comments

- WHY를 쓴다. WHAT은 코드가 말한다.
- 쓸모없어진 주석은 즉시 지운다.
- 상세는 스킬 `201-code-commenting`.

## Definition of Done

Task 문서의 DoD가 우선한다. 공통 항목은 아래와 같다.

- Acceptance Criteria 전항 충족
- 타입 검사와 린트 통과
- companion `TEST-*` 통과(스킬 `tdd` 참조)
- 관련 문서 갱신(SRS·태스크 문서가 실제와 어긋나면 문서를 고친다)

## See also

- [001-project-overview.md](001-project-overview.md) · [002-tech-stack.md](002-tech-stack.md)
- 스킬 `300-tech-constraints-guardrails` — 제약 위반 자가 점검
- 스킬 `400-task-execution-workflow` — Task 실행 전체 절차
