---
name: 202-github-issue-handling
description: 이 프로젝트의 GitHub 이슈·Project #1 운영 절차. 이슈 상태를 옮기거나, 새 Task를 이슈로 등록하거나, Project 필드를 다룰 때 사용한다.
---

# GitHub 이슈 · Project 운영

## 현재 상태 (2026-08-26 기준)

| 항목 | 상태 |
| --- | --- |
| 이슈 | **52건**(#1~#52) — `SRS_project/tasks/v2/{Task ID}-*.md` 48건 + Macro NFR 4건 본문 그대로 등록 완료 |
| 라벨 | 16종 생성 완료(feature/backend/frontend/infra/contract/foundation/auth/external-api/core-logic/stage-2/deployment/test/macro + priority 4단계) |
| Project | [#1](https://github.com/users/soobworks/projects/1) — **이슈를 아직 추가하지 않음.** `gh auth refresh -s project`가 필요해 사람의 승인 대기 중 |
| 필드·뷰 | **미착수** — Project 연결 이후 작업 |

**Project 연결이 아직 안 됐다.** 이슈 자체는 살아있으니 `gh issue view <번호>`로 태스크 명세를 바로 볼 수 있다.

## 일상 조작

```bash
gh issue view <번호> --repo soobworks/SRS_project              # 태스크 명세 확인
gh issue list --repo soobworks/SRS_project --label test        # 유형별 필터
gh issue list --repo soobworks/SRS_project --label priority:critical --state open
```

## Project 연결 시 필드 구성 (착수 시 이대로 만든다)

내장 필드를 최대한 재사용한다 — GitHub Roadmap·인사이트 차트가 이 필드를 전제로 동작하기 때문이다.

| 구분 | 필드 |
| --- | --- |
| 내장 재사용 | `Start date` · `Target date` · `Status` |
| 신설 | `Task ID` · `Epic` · `Type`(Contract/Data/Read/Write/UI/Test/Infra/NFR) · `Complexity`(H/M/L) · `Critical path`(Yes/No) · `Depends on` |

날짜 값의 원천은 `SRS_project/tasks/v2/[총괄] 개발 실행 계획.md`(표준, 2레인)와 `[총괄] 압축 수행 일정.md`(4레인, 임계경로 하한) — 어느 쪽을 쓸지는 실행 시점에 정한다.

## 배치 작업 원칙

52건 × 필드 6개 이상이면 개별 호출로는 300회 이상이 되어 GraphQL 한도를 태울 수 있다.
`gh project item-edit`을 필드별로 개별 호출하기보다, 가능하면 항목당 요청을 묶는다. 배치 호출 사이에는 지연을 둔다.

## 일정을 바꾸려면

`TASK-마스터-리스트.md`와 `[총괄] 개발 실행 계획.md`가 원천이다. **GitHub에서 날짜를 직접 고치지 않는다** — 역류하지 않으므로 문서와 갈라진다. 의존관계가 바뀌면:

```
TASK-마스터-리스트.md 수정          ← 단일 원천
  → tools/gen_exec_plan.py 재실행    DAG·임계경로·스케줄 재계산
  → [총괄] 개발 실행 계획.md 갱신
  → GitHub Project 필드 값 재주입
```

## 뷰

Projects v2에는 **뷰 생성 API가 없다.** 웹 UI에서 만든다 — Roadmap(Start/Target date 기준), Epic별 보드, 상태별 보드.

## 주의

- `gh project`는 **Node ID**를 쓴다(`PVT_...`, `PVTI_...`). 정수 번호가 아니다.
- 프로젝트 조작에는 `project` 스코프가 필요하다 — `gh auth refresh -s project -s read:project`.
- 이슈 본문을 통째로 재생성하지 않는다 — 이미 등록된 52건은 각 Task `.md` 원본과 동기 상태다.
