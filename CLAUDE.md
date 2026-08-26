# Project

이 문서는 Claude Code가 작업 시작 시 자동으로 로드하는 프로젝트 컨텍스트다.

`wild-mental/AI-multivender-harness-sample`의 하네스 구조(CLAUDE.md/Skills/Agents)를 기반으로 이 프로젝트(같이 고르기)에 맞게 다시 썼다 — 원본은 Java/Spring/Kafka/Flutter 멀티벤더 스택 예시였고, 이 프로젝트는 Next.js 단일 모놀리스 + Prisma + Supabase다. Tech Stack·Agent 라우팅 전부를 교체했다.

---

## 1. Project Overview

### Vision
네이버 부동산의 관심매물 저장 이후 구간에서 동작하는 **2인 공동 주거 의사결정 기능**. "완벽한 매물"이 아니라 "둘 다 받아들일 수 있는 매물"을 찾도록 돕는다 — 총점·순위가 아니라 **5분류 판정**(충족/미충족/계산불가/확인필요/해당없음)과 **조건 완화 협상**으로 의사결정을 구조화한다.

### Core Features
1. 조건 입력(예산·통근·선호) → 후보 구성 → 초대
2. 판정 엔진: 개인별 5분류 판정 → A·B 종합 3분류 그룹화(둘 다 충족/한쪽만/둘 다 불충족)
3. 2라운드 매칭(North Star) → 균형 비교 렌더링
4. 조건 완화 시뮬레이션 → 양보 문장 생성 → 완화 제안 발신·응답
5. (1-B) 현장 기록 — 중개사 질문·답변, 방문 후 기록

### Target Audience
- Primary: 함께 집을 구하는 2인(커플·룸메이트 등)
- 이 기능은 네이버 부동산의 기존 매물 탐색 흐름 **이후** 단계에 붙는다 — 매물 검색 자체는 범위 밖

### Project Philosophy
- **판정의 정확성이 기능 추가보다 우선이다.** 이 제품의 정체성은 "총점을 매기지 않는다"는 데 있다 — 아래 §3 절대 규칙을 참조.
- MVP 범위는 이미 확정됐다(`SRS_project/SRS_V0_9.md` §11 1-A/1-B). 임의로 확장하지 않는다.
- AC(인수 조건) 없는 구현은 완료로 보지 않는다 — 모든 기능 Task는 TEST 컴패니언과 쌍을 이룬다.

---

## 2. Tech Stack

### Framework
- Next.js(App Router) 단일 모놀리스 — Server Actions(쓰기) / Server Components(읽기) / Route Handlers(외부 트리거 전용)
- TypeScript, Tailwind CSS + shadcn/ui(이미 있는 컴포넌트는 직접 구현하지 않는다)

### Data
- ORM: Prisma
- DB: 로컬 개발 = Supabase CLI(Docker 기반 로컬 Postgres) / 배포 = Supabase 관리형 Postgres
- 연결: pgbouncer 커넥션 풀링(포트 6543, `?pgbouncer=true`) — 서버리스 콜드스타트로 인한 커넥션 고갈 방지 필수

### Deployment
- Vercel — Git 푸시 자동배포만 사용, 별도 CI/CD 파이프라인(GitHub Actions 등) 구성 금지(REQ-NF-008)
- Vercel Cron Jobs(배치 작업)

### AI (선택적 확장, MVP 필수 아님)
- Vercel AI SDK + Gemini — 존재하지 않아도 핵심 기능(판정·완화)은 전부 결정론적 로직으로 동작해야 한다

### 근거 문서 우선순위
1. **`SRS_project/SRS_V0_9.md`** — 이 기술스택(Next.js/Prisma/Supabase)으로 구현 가능한 형태로 재작성된 SRS. **실제 코딩 시 아키텍처·인터페이스의 최종 근거.**
2. `SRS_project/같이보기-srs-v1_0.md` — 기술 중립판. FR-001~025(기능 요구사항)의 원천 — SRS_V0_9와 기능 요구사항은 동일, 구현 방식만 다르다.
3. `SRS_project/같이보기-technical-design-v1_0.md` — UseCase/ERD/Component/Sequence 다이어그램. 개념적 아키텍처(판정 흐름, 데이터 모델)는 유효하나 마이크로서비스 전제 서술은 SRS_V0_9의 모놀리스 결정으로 대체됐다.
4. `SRS_project/tasks/v2/` — 위 문서들을 실행 가능한 52개 Task로 분해한 결과. **실제 구현 착수 시 최우선 참조.**

---

## 3. 절대 규칙(Non-Negotiable) — Development Priorities

1. **총점·순위·복합 스코어를 절대 계산하지 않는다.** 어떤 코드에도 여러 조건 판정 결과를 합산·가중치화해 단일 점수로 만드는 로직을 넣지 않는다(`decisions/0001`, `J-006` 태스크 참조). 판정 결과는 항상 5분류 중 하나이며, 그룹화는 3분류(둘 다 충족/한쪽만/둘 다 불충족)로 끝난다.
2. **Read/Write를 같은 함수·같은 파일에 섞지 않는다.** Server Action(쓰기)과 Server Component/조회 함수(읽기)를 분리한다 — Route Handler는 외부에서 트리거되는 경우(웹훅·Cron)에만 쓴다.
3. **AC 없는 기능은 완료가 아니다.** 새 기능 Task를 만들면 반드시 대응하는 TEST 컴패니언(또는 기존 컴패니언에 케이스 추가)을 함께 작성한다.
4. **판정 상태 4종(미충족/계산불가/확인필요/해당없음)을 오분류하지 않는다.** 이 프로젝트에서 가장 치명적인 버그 유형이다 — 판정 관련 코드 리뷰 시 최우선 확인 대상.
5. 순수 함수(판정 로직)는 DB·외부 API에 접근하지 않는다.

### Code Comments
- WHY 중심으로만 작성한다(WHAT은 코드로 표현). 쓸모없어진 주석은 즉시 제거.

### Problem Solving
- 에러 진단이 필요하면 `fix-error` 스킬(7단계 구조화 진단)을 쓴다.
- 착수 전 미해소 결정 사항이 있으면 `grill-it` 스킬로 먼저 정리한다.
- 장기 실행 작업을 `/goal`에 넘기기 전에는 `goal-setting` 스킬로 4섹션 프롬프트를 먼저 설계한다.

---

## 4. Subagent & Command Routing

작업 성격에 따라 적합한 서브에이전트 또는 스킬이 자동으로 위임된다. 수동 호출은 `> use the <agent-name> subagent` 또는 `/<skill-name>`.

### Subagents (`.claude/agents/`)
| 에이전트 | 사용 시점 |
|---|---|
| `judgment-engine` | 5분류 판정·조건 평가기·완화 시뮬레이션 등 `domain/judgment/` 핵심 로직 — §3 절대 규칙이 가장 자주 위반될 수 있는 영역이므로 전담 |
| `nextjs-server-action` | Server Action·Route Handler 작성(입력 검증·Prisma 쓰기·에러 코드) |
| `prisma-schema` | Prisma 스키마·마이그레이션·인덱스·RLS 정책 |
| `nextjs-ui` | Server/Client Component 분리, shadcn/ui 조합, Query/UI Task(`V-002`, `X-001` 계열) |

### Skills (`.claude/skills/`)
| 스킬 | 목적 |
|---|---|
| `goal-setting` | 장기 실행 `/goal` 프롬프트를 Three Pillars 기준으로 설계 |
| `grill-it` | 착수 전 미해소 결정 사항을 하나씩 해소하고 설계문서·하네스에 즉시 반영 |
| `review-merge` | PR을 한 건씩 게이트 통과 후 머지(REVIEW → MERGE, 사람이 매 건 승인) |
| `merge-review` | 의존 결합된 PR 묶음을 먼저 병합하고 통합 표면에서 라이브 리뷰(MERGE → REVIEW) |
| `tdd` | Red-Green-Refactor, public API 기준 행위 테스트 — TEST 컴패니언 작성 시 기본 방법론 |
| `code-review` | diff를 Standards(컨벤션 준수)·Spec(요구사항 충실도) 2축 병렬 서브에이전트로 검토 |
| `prisma-client-api` | Prisma Client 쿼리 API(select/include/필터/트랜잭션) 레퍼런스 |
| `supabase` | Supabase RLS·Auth·Realtime·Storage 통합(Next.js) |
| `supabase-postgres-best-practices` | Postgres 스키마·인덱스·RLS 성능·커넥션 풀링 — **테이블/컬럼/RLS 정책을 만들거나 고치기 전에 반드시 먼저 로드** |
| `deploy-to-vercel` | Vercel 배포(Git 연동 우선, 항상 preview로 배포 — production은 명시적 요청 시에만) |
| `fix-error` | 에러/예외 발생 시 7단계 구조화 진단 |
| `setup-env` | pnpm 빌드 프로세스, Vercel 환경변수, 로컬 Supabase CLI 설정 점검 |
| `gitflow-commit` | Git Flow 준수 커밋·푸시·Draft PR 자동화 |

---

## 5. 참고
- 새 규칙을 추가할 때: 항상 적용은 이 파일, 도메인 지식은 서브에이전트, 절차·온디맨드 매뉴얼은 스킬에 작성한다.
- Task 관리는 GitHub Issues + Project #1(`https://github.com/users/soobworks/projects/1`)에서 이뤄진다 — Task 상세는 `SRS_project/tasks/v2/{Task ID}-*.md`가 원본이다.
- 이 파일은 저장소 루트(현재 로컬 작업 폴더)에 있다. 실제 Next.js 앱 코드가 별도 저장소로 분리되면 이 `CLAUDE.md`와 `.claude/`를 그 저장소로도 복사해야 한다 — `SRS_project/`만 추적하는 이 저장소의 원래 범위(README.md 참조)에는 하네스가 포함돼 있지 않았다.
