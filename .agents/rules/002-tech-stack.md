---
description: 같이보기 기술 스택 — 확정된 제약(C-TEC-001~007)
globs: ["**/*"]
alwaysApply: true
---
# TECH STACK: 같이보기

기술스택은 SRS_V0_9.md §1.5가 확정한 제약(C-TEC-001~007)이다. **대안을 제안하기 전에 이 문서와 스킬 `300-tech-constraints-guardrails`를 읽는다.**

## 확정 스택

| 구분 | 선택 | 근거 |
| --- | --- | --- |
| 프레임워크 | Next.js App Router 단일 풀스택 — 프론트/백엔드 분리 없음 | C-TEC-001 |
| 서버 로직 | Server Actions · Route Handlers만 (별도 백엔드 서버 없음) | C-TEC-002 |
| DB/ORM | Prisma + 로컬 Supabase CLI(개발) / Supabase PostgreSQL(배포) | C-TEC-003 |
| 스타일 | Tailwind CSS + shadcn/ui | C-TEC-004 |
| AI(선택적) | Vercel AI SDK — 별도 Python 서버 없음 | C-TEC-005 |
| LLM(선택적) | Google Gemini 기본, 환경 변수로 모델 교체 | C-TEC-006 |
| 배포 | Vercel 단일 배포 — Git Push 자동배포, 별도 CI/CD 없음 | C-TEC-007 |

## 도입하지 않는 것 (§1.5 파생 원칙)

| 금지 | 대신 |
| --- | --- |
| 별도 백엔드 서버·상시 워커 | Server Actions · Route Handlers |
| 캐시 서버(Redis 등) | Next.js `use cache` + PostgreSQL(`route_cache` 등) |
| 메시지 큐(Kafka 등) | Vercel Cron Job이 폴링하는 DB 큐 테이블 |
| 상시 스케줄러 | Vercel Cron Jobs |
| 외부 CI(GitHub Actions 등) | Vercel Git 연동 자동배포만(REQ-NF-008) |
| 코드에 Gemini 모델 ID 상수 | `AI_MODEL_ID` 환경 변수 |
| shadcn/ui 컴포넌트 재구현 | `npx shadcn add` |

## 데이터베이스 연결 — 두 개를 헷갈리지 않는다

| 환경 변수 | 포트 | 용도 |
| --- | --- | --- |
| `DATABASE_URL` | `:6543` pgbouncer 풀러 | 애플리케이션 런타임 — 서버리스 콜드스타트로 인한 커넥션 고갈 방지 필수 |
| `DIRECT_URL` | `:5432` 직결 | 마이그레이션 전용(Prisma Migrate) |

## AI — 기본은 꺼져 있다

핵심 기능(판정·완화)은 LLM 없이 결정론적 로직만으로 동작한다. Gemini는 SRS_V0_9.md §7이 준비해 둔 **선택적 확장**이며, 지금 실행되는 경로가 아니다. 상세는 스킬 `303-ai-integration-rules`.

## See also

- [001-project-overview.md](001-project-overview.md) · [003-development-guidelines.md](003-development-guidelines.md)
- `SRS_project/SRS_V0_9.md` §1.5(C-TEC), §5.2(REQ-NF-008~010)
