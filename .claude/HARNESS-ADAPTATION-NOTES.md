# Claude Code 하네스 도입 기록

**날짜:** 2026-08-26
**원본:** `wild-mental/AI-multivender-harness-sample`(Java/Spring/Kafka/Flutter 멀티벤더 예시)
**목적:** 이 저장소를 "같이 고르기" Next.js/Prisma/Supabase 개발에 맞게 조정.

이 문서는 무엇을 그대로 가져왔고, 무엇을 버렸고, 무엇을 새로 추가했는지 기록한다(`grill-it` 스킬의 "결정 즉시 하네스에 반영·기록" 원칙을 따름).

---

## 1. 가져오지 않은 것 (전부 제외)

원본 저장소는 **4개 AI 도구(Claude/Cursor/Gemini/Antigravity) 동시 지원**을 전제한 크로스툴 하네스였다. 이 프로젝트는 Claude Code만 쓰므로 아래를 전부 제외했다.

| 제외 대상 | 이유 |
|---|---|
| `.cursor/`, `.gemini/`, `AGENTS.md`, `.agents/rules/*`, `.agents/workflows/*` | Cursor/Gemini/Antigravity 전용 또는 크로스툴 중복 관리 장치 — 이 프로젝트는 Claude Code만 사용 |
| `.agents/workflows/generate-tasks-from-srs.md` | 이미 이 프로젝트가 직접 수행 완료(`TASK-재추출-전략-v2-계획서.md`, 52개 Task) — 재사용할 "추출 전" 상태가 아님 |
| `java-spring`, `gradle`, `jpa-querydsl`, `kafka-pipeline`, `kafka-saga`, `spring-redis`, `flutter-app` 서브에이전트 | 전부 다른 기술스택(Java/Spring/Kafka/Redis/Flutter) — 이 프로젝트와 무관 |
| `react-frontend` 서브에이전트 | Vite+React SPA 전제. 이 프로젝트는 Next.js App Router(Server/Client Component 분리)라 구조가 다름 — `nextjs-ui`로 대체 |

## 2. 형식만 바꿔 가져온 것

| 원본 | 조정 | 이유 |
|---|---|---|
| `.claude/commands/fix-error.md` | `.claude/skills/fix-error/SKILL.md` | 원본 저장소 자체의 `README-claude-harness.md`가 "구 commands 폴더는 Skills로 완전히 통합됐다"고 명시 — 최신 컨벤션을 따름. 내용(7단계 진단)은 그대로 |
| `.claude/commands/gitflow-commit.md` | `.claude/skills/gitflow-commit/SKILL.md` | 위와 동일. 내용은 기술 중립적이라 그대로 유지, review-merge/merge-review 스킬과의 연계만 추가 |
| `.claude/commands/setup-env.md` | `.claude/skills/setup-env/SKILL.md` | 위와 동일. 내용은 Gradle/npm 범용 서술 → pnpm/Next.js/Vercel/로컬 Supabase CLI로 구체화 |

## 3. 새로 작성한 것 (이 프로젝트 전용)

| 파일 | 대체 대상 | 비고 |
|---|---|---|
| `CLAUDE.md` | 원본 템플릿(Vision/Tech Stack이 전부 플레이스홀더) | Project Overview·Tech Stack·§3 절대 규칙(총점 금지 등)을 이 프로젝트 실제 내용으로 전면 재작성 |
| `.claude/agents/judgment-engine.md` | (신규) | 이 프로젝트의 핵심 차별점(5분류 판정, 총점 금지)을 전담 — 원본 하네스에는 대응하는 에이전트가 없었다 |
| `.claude/agents/nextjs-server-action.md` | `java-spring` | Server Action/Route Handler, Read/Write 분리 원칙 |
| `.claude/agents/prisma-schema.md` | `jpa-querydsl`, `gradle` | Prisma 스키마·마이그레이션·RLS |
| `.claude/agents/nextjs-ui.md` | `react-frontend`, `flutter-app` | Server/Client Component, shadcn/ui, `<DisclosedValue>` 규칙 |

## 4. 스킬 마켓플레이스(skills.sh)에서 채택한 것

`https://www.skills.sh/`에서 install 수(인기도)와 이 프로젝트 스택 적합성을 기준으로 선정. 후보 중 **명시적으로 제외한 것도 기록**한다.

### 채택
| 스킬 | 출처 | 선정 이유 |
|---|---|---|
| `tdd` | mattpocock/skills (768K+ installs) | Public API 기준 행위 테스트 — TEST 컴패니언 작성 방법론과 정합 |
| `code-review` | mattpocock/skills | Standards/Spec 2축 병렬 리뷰 — review-merge/merge-review와 조합 |
| `prisma-client-api` | prisma/skills | Prisma Client 쿼리 API 범용 레퍼런스(Supabase 등 모든 Postgres에 적용 가능 — Prisma 자체 호스팅 Postgres 전용 아님을 확인 후 채택) |
| `supabase` | supabase/agent-skills | RLS·Auth·Realtime·Next.js 통합 공식 스킬 |
| `supabase-postgres-best-practices` | supabase/agent-skills | 스키마/인덱스/RLS 성능/커넥션 풀링 — 테이블·RLS 작업 전 필수 로드로 지정 |
| `deploy-to-vercel` | vercel-labs/agent-skills | Git-push 우선 배포 — REQ-NF-008(별도 CI/CD 금지)과 정확히 일치 |
| `vercel-react-best-practices` | vercel-labs/agent-skills | React/Next.js 성능 70개 규칙 — UI 표면은 작지만(`V-002`, `X-001`) 성능 규율은 유효 |

### 검토 후 제외
| 스킬 | 제외 이유 |
|---|---|
| `prisma-postgres`(prisma/skills) | **오판 방지 확인 완료** — Prisma 자체 "Prisma Postgres" 관리형 상품(Console, `create-db`) 전용. 이 프로젝트는 Supabase Postgres를 쓰므로 아키텍처 불일치 — `prisma-client-api`로 대체 |
| `vercel-composition-patterns` | React 19 합성 패턴(compound component 등)은 대규모 컴포넌트 라이브러리용 — 이 프로젝트의 UI 표면(Query/UI Task 2개)에는 과함 |
| `diagnosing-bugs`(mattpocock/skills) | `fix-error` 스킬(원본 하네스에서 이미 채택)과 목적이 겹침 — 중복 방지 |

### 사용자가 직접 지정해 설치
| 스킬 | 출처 | 비고 |
|---|---|---|
| `goal-setting` | wild-mental/goal-setting-skill | `/goal` 프롬프트 설계(Three Pillars) |
| `grill-it` | wild-mental/grill-it-skill | 착수 전 미해소 결정 사항 해소 + 하네스 반영 |
| `review-merge` | wild-mental/review-merge-skill | PR 순차 게이트 리뷰(REVIEW → MERGE) |
| `merge-review` | wild-mental/merge-review-skill | 결합 PR 묶음 선병합(MERGE → REVIEW) — review-merge의 자매 스킬 |

---

## 5. 알려진 한계 / 후속 작업

- `.claude/settings.local.json`(권한 화이트리스트)은 만들지 않았다 — 아직 실제 빌드/배포 명령이 존재하지 않아(C-000 미착수) 구체적인 허용 목록을 추측으로 채우지 않았다. C-000 완료 후 실제 사용하는 명령 기준으로 작성할 것.
- 이 `CLAUDE.md`·`.claude/`는 현재 로컬 작업 폴더(이 저장소) 루트에 있다. 실제 Next.js 앱 코드가 별도 저장소로 분리되면 함께 이전해야 한다(`CLAUDE.md` §5 참조).
