# 같이보기 — Agent Instructions

여러 AI 코딩 도구(Claude Code 등)가 공통으로 읽는 최상위 규칙 파일이다. 도구별 설정은 이 내용을 중복하지 않고 참조한다.

---

## 프로젝트

네이버 부동산의 관심매물 저장 이후 구간에서 동작하는 2인 공동 주거 의사결정 기능이다. 총점·순위가 아니라 **5분류 판정**과 **조건 완화 협상**으로 의사결정을 구조화하는 것이 이 제품의 차별점이다.

**이 저장소는 기획이 끝난 상태다.** SRS·기술설계 문서·태스크 52건·실행 일정이 확정돼 있다. 할 일은 `SRS_project/tasks/v2/{Task ID}-*.md`에 이미 적혀 있다. **없는 기능을 만들지 않는다.**

## 기술 제약 (C-TEC-001~007)

`SRS_project/SRS_V0_9.md` §1.5가 확정한 제약이다. 기술적으로 더 나은 대안이 있어도 **조용히 우회하지 않는다.**

| ID | 제약 |
| --- | --- |
| C-TEC-001 | Next.js App Router 단일 풀스택. 프론트/백엔드를 분리하지 않는다 |
| C-TEC-002 | 서버 로직은 Server Actions 또는 Route Handlers. 별도 백엔드 서버 없음 |
| C-TEC-003 | Prisma + Supabase — 로컬은 Supabase CLI, 배포는 Supabase PostgreSQL |
| C-TEC-004 | Tailwind CSS + shadcn/ui |
| C-TEC-005 | AI는 Vercel AI SDK로 외부 API 호출. 자체 추론 서버 없음(선택적 확장) |
| C-TEC-006 | Google Gemini 기본. 환경 변수만으로 모델 교체 가능해야 한다 |
| C-TEC-007 | Vercel 단일 배포. CI 설정 없이 Git Push로 자동 배포 |

### 도입하지 않는 것

| 금지 | 대신 |
| --- | --- |
| 별도 백엔드 프로세스·상시 워커 | Server Actions·Route Handlers |
| 캐시 서버(Redis 등) | Next.js `use cache` + PostgreSQL |
| 메시지 큐(Kafka 등) | Vercel Cron이 폴링하는 DB 큐 테이블 |
| 상시 스케줄러(cron 데몬) | Vercel Cron Jobs |
| 외부 CI(GitHub Actions 등) | Vercel Git 연동 자동배포 |
| 코드에 모델 ID 상수 | 환경 변수(`AI_MODEL_ID`) |
| shadcn/ui 컴포넌트 재구현 | `npx shadcn add` |

## 판정 도메인 — 이 프로젝트의 절대 규칙

- **총점·순위·복합 스코어를 절대 계산하지 않는다.** 판정 결과는 항상 5분류(`MET`/`UNMET`/`CONFIRMATION_NEEDED`/`CALCULATION_FAILED`/`NOT_APPLICABLE`), 그룹화는 항상 3분류(둘 다 충족/한쪽만/둘 다 불충족)로 끝난다.
- "확인 필요"를 다른 상태로 흡수하지 않는다 — 별도 배지로 항상 분리 노출한다.
- 판정 로직(`domain/judgment/`, `domain/compromise/`)은 순수 함수만 허용한다. DB·외부 API 접근 금지.

## 서버 코드 배치

C-TEC-002가 진입점을 셋으로 제한한다.

| 상황 | 선택 |
| --- | --- |
| 화면 렌더용 읽기 | RSC 직접 조회 |
| 사용자 변경 작업 | Server Action(`app/actions/`) |
| 외부 시스템 수신(웹훅·Cron) | Route Handler(`app/api/`) |
| 캐시 가능한 GET | Route Handler — Server Action은 항상 POST라 HTTP 캐시가 없다 |

**도메인 경계** — `domain/<name>/`가 유일한 공개 표면이다.

## 코드 스타일

- 주석은 **WHY**를 쓴다. WHAT은 코드가 말한다. 쓸모없어진 주석은 즉시 지운다.
- 주석·커밋 메시지는 한국어로 쓴다. 요구사항을 참조할 때는 ID를 적는다(`REQ-FUNC-011`, `C-TEC-003`).
- 사용자 입력은 스키마로 검증한 뒤 도메인에 들인다. Server Action 인자는 신뢰할 수 없다.
- 비밀값은 서버에만 둔다. `NEXT_PUBLIC_` 접두는 공개해도 되는 값에만 쓴다.

## Git

- 브랜치: `<type>/<issue-number>-<short-description>` — 이슈 번호를 반드시 넣는다.
- 커밋: Conventional Commits · 원자적으로 · 각 커밋이 빌드되는 상태로.
- `main` 직접 커밋 금지. PR은 draft로 먼저 열고 본문에 `Closes #<번호>`.

## 완료 정의

- Acceptance Criteria 전항 충족
- 타입 검사·린트·테스트 통과 — companion `TEST-*` Task가 그대로 테스트 케이스다
- 문서와 실제가 어긋났으면 문서를 고친다

## 원천 문서

| 문서 | 무엇 |
| --- | --- |
| `SRS_project/SRS_V0_9.md` | **권위 있는 요구사항** — 기술스택 반영판 |
| `SRS_project/같이보기-srs-v1_0.md` | 기능 요구사항(FR-001~025) 원천 — 기술 중립판 |
| `SRS_project/같이보기-technical-design-v1_0.md` | 설계 다이어그램(UseCase/ERD/Component/Sequence) |
| `SRS_project/tasks/v2/TASK-마스터-리스트.md` | 태스크 52건(생성물 — 직접 편집 금지, `tools/gen_exec_plan.py`로 재계산) |
| `SRS_project/tasks/v2/{Task ID}-*.md` | 태스크별 AC·DoD·Dependencies |
| `.agents/rules/` | 상세 규칙 3종 |
| `.agents/skills/` | 상황별 스킬 — Claude Code는 `.claude/skills/`에 동일 내용 복사본을 둔다(심볼릭 링크 대신, Windows 환경 제약) |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
