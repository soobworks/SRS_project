# 같이 고르기

Claude Code가 세션 시작 시 자동으로 읽는 파일이다.
**여기는 짧게 유지한다.** 상세는 스킬로 빼서 필요할 때 꺼내 읽게 한다.

---

## 이 저장소의 상태

기획이 끝났고 **구현이 시작되지 않았다.** SRS·기술설계 문서·태스크 52건·실행 일정이 확정돼 있고, GitHub Issues #1~#52가 등록돼 있다(Project #1 연결은 진행 중 — 스킬 `202-github-issue-handling` 참조).

**없는 기능을 만들지 않는다.** 할 일은 `SRS_project/tasks/v2/{Task ID}-*.md`에 이미 적혀 있다.

## 무엇을 만드는가

네이버 부동산의 관심매물 저장 이후 구간에서, 2인이 함께 집을 고를 때 겪는 이견을 조율한다. 총점·순위가 아니라 5분류 판정과 조건 완화 협상으로 의사결정을 구조화한다. 상세는 `.agents/rules/001-project-overview.md`.

## 기술 스택 — 확정 사항

SRS_V0_9.md §1.5가 제약(C-TEC-001~007)으로 못박았다. **대안을 제안하기 전에 스킬 `300-tech-constraints-guardrails`를 읽는다.**

- **Next.js App Router 단일 풀스택** — 프론트/백엔드를 분리하지 않는다
- **서버 로직은 Server Action · Route Handler · RSC 셋뿐**
- **Prisma + Supabase PostgreSQL** — 런타임은 풀러(`:6543`), 마이그레이션은 직결(`:5432`)
- **Tailwind + shadcn/ui**
- **Vercel AI SDK + Google Gemini** — §7의 **선택적 확장**. 핵심 기능은 LLM 없이 동작한다
- **Vercel 단일 배포** — Git Push가 곧 배포. 외부 CI 없음

도입하지 않는 것: 별도 백엔드 프로세스 · 캐시 서버 · 메시지 큐 · 상시 스케줄러 · 외부 CI.
전체 표는 `.agents/rules/002-tech-stack.md`.

## 판정 도메인 — 절대 규칙

이 제품의 정체성은 **총점을 매기지 않는다**는 데 있다. 판정 결과는 항상 5분류, 그룹화는 항상 3분류로 끝난다 — 이 규칙이 가장 자주 위반될 수 있는 영역이라 전담 서브에이전트(`judgment-engine`)와 스킬(`304-judgment-domain-rules`)을 따로 둔다.

## 작업 순서

1. `SRS_project/tasks/v2/TASK-마스터-리스트.md` — 태스크와 선행 관계
2. `SRS_project/tasks/v2/{Task ID}-*.md` — AC · DoD · Dependencies
3. 참조된 SRS 절
4. **선행이 안 끝났으면 시작하지 않는다**

절차 전체는 스킬 `400-task-execution-workflow`.

---

## 스킬 라우팅

프로젝트 고유 규범이다. 상황이 맞으면 자동으로 읽힌다.

| 스킬 | 언제 |
| --- | --- |
| `300-tech-constraints-guardrails` | 의존성 추가 · 인프라 도입 · 배포 설정 변경 — **제약 위반 차단** |
| `301-server-boundary-rules` | 서버 로직을 어디에 놓을지 · 캐시 · 비동기 · Cron |
| `302-data-access-rules` | 스키마 변경 · 쿼리 · RLS · 트랜잭션 |
| `303-ai-integration-rules` | AI 호출 · 프롬프트(§7 확장을 켤 때만) |
| `304-judgment-domain-rules` | 판정·완화 로직 — **총점 금지 등 절대 규칙** |
| `400-task-execution-workflow` | 태스크 시작·진행·완료 |
| `100-error-fixing-process` | 에러·빌드 실패 진단 |
| `101-build-and-env-setup` | 환경 구성 · 환경 변수 · 배포 |
| `200-git-commit-push-pr` | 커밋 · 브랜치 · PR |
| `201-code-commenting` | 주석 기준 |
| `202-github-issue-handling` | 이슈 · Project #1 조작 |

외부 스킬(마켓플레이스 설치)은 프레임워크 사용법을 담당한다 —
`vercel-react-best-practices` · `ai-sdk` · `shadcn` · `supabase` ·
`supabase-postgres-best-practices` · `prisma-client-api` · `prisma-database-setup` ·
`web-design-guidelines` · `tdd` · `code-review` · `webapp-testing` · `deploy-to-vercel`.

팀이 직접 지정해 설치한 프로세스 스킬 — `goal-setting` · `grill-it` · `review-merge` · `merge-review`.

## 서브에이전트

| 에이전트 | 언제 |
| --- | --- |
| `judgment-engine` | 5분류 판정·완화 시뮬레이션·양보 문장 생성 — 총점 금지 규칙 전담 |
| `nextjs-server` | Server Action · Route Handler · RSC · 캐시 |
| `prisma-data` | 스키마 · 마이그레이션 · 쿼리 · RLS |
| `ai-gemini` | AI SDK · Gemini(§7 확장) |
| `ui-shadcn` | 화면 · 컴포넌트 · 접근성 |

---

## 문서를 건드릴 때

- `SRS_project/tasks/v2/TASK-마스터-리스트.md`, `[총괄] 개발 실행 계획.md`, `[총괄] 압축 수행 일정.md`는 **생성물이다.** `SRS_project/tasks/v2/tools/gen_exec_plan.py`로 재계산한다 — 손으로 표를 고치지 않는다.
- 문서를 옮기거나 이름을 바꿨으면 다른 문서의 상호 참조도 함께 확인한다.
- 하네스 구성(무엇을 가져오고 버렸는지)은 `.claude/HARNESS-ADAPTATION-NOTES.md`.
