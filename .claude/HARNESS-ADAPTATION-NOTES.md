# Claude Code 하네스 도입 기록

**날짜:** 2026-08-26 (v1 초안) → 2026-08-26 재구성(v2)
**원본(v2):** `wild-mental/ai-place-mate-prd-to-srs` — 같은 스택(Next.js/Prisma/Supabase/shadcn)의 실제 완성된 하네스
**목적:** 이 저장소를 "같이 고르기" 개발에 맞게 조정.

## v2 재구성 배경

v1은 `wild-mental/AI-multivender-harness-sample`(Java/Spring/Kafka/Flutter 멀티벤더 **템플릿** 예시)을 기반으로 만들었다. 사용자가 "같은 스택을 쓰는 실제 프로젝트(`ai-place-mate-prd-to-srs`)처럼 만들어 달라"고 요청해 그 저장소의 실제 구조를 그대로 참조해 다시 만들었다. 두 원본의 차이:

| | v1 원본 | v2 원본 |
| --- | --- | --- |
| 스택 | Java/Spring/Kafka/Flutter(우리와 무관) | Next.js/Prisma/Supabase/shadcn(**우리와 동일**) |
| 성격 | 범용 템플릿(플레이스홀더 내용) | 실제 프로젝트의 완성된 하네스 |
| 구조 | `.claude/` 단독(commands/agents) | `.agents/`(SSOT) + `AGENTS.md` + `CLAUDE.md` + `.claude/`(심볼릭 링크) 3계층 |
| 프로젝트 규칙 | 없음(CLAUDE.md에 전부 서술) | 번호 매긴 스킬(`300~304`, `400`)로 분리 |

## 구조 — 3계층

1. **`.agents/rules/001~003.md`** — 가장 상세한 버전. Cursor/Antigravity 같은 glob 트리거 도구용 프론트매터를 유지했다(이 프로젝트는 Claude Code만 쓰지만, 원본 구조를 그대로 따랐다).
2. **`AGENTS.md`** — 크로스툴 요약. `.agents/rules/`의 핵심만 담는다.
3. **`CLAUDE.md`** — Claude Code 전용, 가장 짧다. 상세는 전부 스킬로 위임하고 라우팅 표만 둔다.

## `.agents/skills/` vs `.claude/skills/` — 심볼릭 링크를 못 썼다

원본은 `.agents/skills/<name>`을 단일 원천으로 두고 `.claude/skills/<name>`을 **심볼릭 링크**로 연결한다(`README-common-harness.md`가 문서화한 표준 패턴). 이 환경(Windows, 비관리자 권한)에서는 `New-Item -ItemType SymbolicLink`와 `ln -s` 모두 실패했다 — 관리자 권한이 필요하다.

**대안으로 실제 파일을 복제했다.** `.agents/skills/`가 여전히 원천이고, `.claude/skills/`는 그 시점의 스냅샷이다. **한쪽만 고치면 어긋난다** — 스킬 내용을 수정할 때는 `.agents/skills/`를 고친 뒤 `.claude/skills/`에도 반영해야 한다(관리자 권한이 있는 환경으로 옮기면 진짜 심볼릭 링크로 교체할 것).

## 새로 쓴 것 — 이 프로젝트 고유 규칙(번호 매긴 스킬)

원본의 `300~303`, `400` 패턴을 그대로 따르되 내용은 전부 새로 썼다. 원본에는 없는 것도 하나 추가했다.

| 스킬 | 원본과의 관계 |
| --- | --- |
| `300-tech-constraints-guardrails` | 원본 패턴 재사용, 내용은 우리 C-TEC-001~007로 교체 |
| `301-server-boundary-rules` | 원본 패턴 재사용, 도메인 모듈 목록을 우리 것(judgment/shared-space/visit-selection/compromise/cross-cutting/field-record)으로 교체 |
| `302-data-access-rules` | 원본 패턴 재사용, ERD·enum 참조를 SRS_V0_9.md로 교체 |
| `303-ai-integration-rules` | 원본은 "2단 파싱(결정론→LLM)"이 **활성 경로**, 우리는 LLM이 **기본적으로 꺼져 있음**(§7 확장) — 이 차이를 명시적으로 다르게 썼다 |
| `304-judgment-domain-rules` | **원본에 없음.** 이 프로젝트의 정체성(총점 금지, 5분류)은 원본 도메인(모임 장소 추천)과 다른 개념이라 새로 만들었다 |
| `400-task-execution-workflow` | 원본 패턴 재사용, 우리 문서 경로(TASK-마스터-리스트.md 등)로 교체 |
| `100`~`202` | 원본과 거의 동일(범용 프로세스) — Task ID·프로젝트명만 우리 것으로 교체 |

## 서브에이전트 — 원본 4개 + 우리 1개

| 에이전트 | 원본 대응 | 비고 |
| --- | --- | --- |
| `nextjs-server` | `nextjs-server` | 이름까지 동일 |
| `prisma-data` | `prisma-data` | 이름까지 동일 |
| `ui-shadcn` | `ui-shadcn` | 이름까지 동일 |
| `ai-gemini` | `ai-gemini` | 이름까지 동일, "LLM이 기본 꺼짐"이라는 우리 특성만 반영 |
| `judgment-engine` | **없음(신규)** | 원본 도메인에는 "총점 금지" 개념이 없다 — 이 프로젝트 고유 |

## 스킬 마켓플레이스(skills.sh) — 원본과 동일 목록 채택

원본이 이미 검증해 쓰고 있는 조합이라 그대로 따랐다: `tdd`·`code-review`·`prisma-client-api`·`prisma-database-setup`·`supabase`·`supabase-postgres-best-practices`·`deploy-to-vercel`·`vercel-react-best-practices`·`shadcn`·`ai-sdk`·`web-design-guidelines`·`webapp-testing` — 12종.

v1에서 검토 후 제외했던 `prisma-postgres`(Prisma 자체 호스팅 Postgres 전용이라 Supabase와 불일치)는 이번에도 채택하지 않았다 — 원본도 이 스킬을 쓰지 않는다는 점이 교차 확인됐다.

## 사용자가 직접 지정해 설치 (v1과 동일하게 유지)

`goal-setting`·`grill-it`·`review-merge`·`merge-review` — `wild-mental`의 자매 스킬 저장소에서 직접 설치. 원본 저장소에는 없지만 사용자가 명시적으로 요청했으므로 유지했다.

## 알려진 한계 / 후속 작업

- **심볼릭 링크 미적용** — 위 "구조" 절 참조. 관리자 권한 확보 시 `.claude/skills/`를 지우고 진짜 링크로 교체할 것.
- `.claude/settings.local.json`(권한 화이트리스트)은 여전히 만들지 않았다 — 실제 빌드/배포 명령이 존재하지 않아(C-000 미착수) 구체적인 허용 목록을 추측으로 채우지 않았다.
- `.agents/workflows/`(원본의 `generate-agent-rule.md`, `generate-tasks-from-srs.md`)는 가져오지 않았다 — 우리는 이미 이 절차를 직접 수행 완료했다(`TASK-재추출-전략-v2-계획서.md`, 52개 Task).
- 이 `CLAUDE.md`·`AGENTS.md`·`.agents/`·`.claude/`는 현재 로컬 작업 폴더(이 저장소) 루트에 있다. 실제 Next.js 앱 코드가 별도 저장소로 분리되면 함께 이전해야 한다.
