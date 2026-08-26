---
name: 300-tech-constraints-guardrails
description: 같이 고르기의 기술 제약(C-TEC-001~007)과 파생 원칙 위반을 사전에 잡는다. 새 의존성 추가, 인프라 구성요소 도입, 서버 코드 배치, 배포 설정 변경 전에 반드시 확인한다.
---

# 기술 제약 가드레일

## 언제 쓰는가

- 새 npm 패키지를 추가하려 할 때
- "여기는 Redis/별도 서버를 쓰면 빠른데" 같은 판단이 들 때
- 서버 코드를 어디에 놓을지 정할 때
- 배포·스케줄링·CI 설정을 건드릴 때

## 왜 있는가

C-TEC-001~007은 SRS_V0_9.md §1.5가 확정한 기술스택 제약이다. 기술적으로 더 나은 대안이 있어도 **조용히 우회하지 않는다.** 우회는 발견이 늦고, 발견 시점에는 이미 되돌리기 비싸다.

## 체크리스트 — 새 의존성·구성요소

| 하려는 것 | 판정 | 근거 | 대신 |
| --- | --- | --- | --- |
| Express·NestJS·별도 백엔드 서버 추가 | ❌ | C-TEC-001·002 | Server Action · Route Handler |
| 상시 구동 워커 프로세스 | ❌ | §1.5 파생 원칙 2 | Vercel Cron Job |
| Redis·Memcached 등 캐시 서버 | ❌ | §1.5 파생 원칙 2 | Next.js `use cache` + Postgres 테이블(`route_cache` 등) |
| Kafka·SQS 등 메시지 큐 | ❌ | §1.5 파생 원칙 2 | Vercel Cron Job이 폴링하는 DB 큐 테이블 |
| 별도 스케줄러(node-cron 등) | ❌ | §1.5 파생 원칙 2 | Vercel Cron Jobs |
| GitHub Actions 등 별도 CI/CD | ❌ | C-TEC-007, REQ-NF-008 | Vercel Git 연동 자동배포만 |
| Python 별도 LLM 오케스트레이션 서버 | ❌ | C-TEC-005 | Vercel AI SDK를 Next.js 내부에서 직접 호출 |
| 코드에 Gemini 모델 ID 상수 | ❌ | C-TEC-006 | `AI_MODEL_ID` 환경 변수 |
| shadcn/ui에 있는 컴포넌트 재구현 | ❌ | C-TEC-004 | `npx shadcn add <component>` |
| Vercel 외 배포 타깃 추가 | ❌ | C-TEC-007 | — |
| Prisma 아닌 쿼리 빌더 병행 | ⚠️ | C-TEC-003 | 원시 SQL이 필요하면 Prisma `$queryRaw` |

## 체크리스트 — 서버 코드 배치

```
화면에 보여줄 데이터를 읽는가?           → Server Component에서 직접 조회
사용자가 무언가를 바꾸는가?              → Server Action
외부(웹훅·Cron)가 HTTP로 들어오는가?     → Route Handler
```
상세는 스킬 `301-server-boundary-rules`.

## 체크리스트 — AI 호출 (§7 확장을 켤 때만 해당)

- 이 프로젝트의 핵심 기능(판정·완화)은 LLM 없이 결정론적 로직만으로 동작해야 한다 — Gemini는 §7의 **선택적 확장**이지 기본 경로가 아니다.
- 모델 ID가 환경 변수(`AI_MODEL_ID`)에서 오는가?(C-TEC-006)
- Gemini 실패·지연 시 결정론적 템플릿 경로로 즉시 폴백하는가?(REQ-NF-009)
- 상세는 스킬 `303-ai-integration-rules`.

## 위반을 발견했을 때

1. **구현 전이면** — 위 표의 "대신"으로 바꾼다.
2. **이미 들어갔으면** — 제거 비용을 재고 Task로 만든다. 조용히 두지 않는다.
3. **제약이 요구사항을 실제로 깨뜨리면** — 사람에게 판단을 요청한다(예: `SRS_project/SRS_V0_9-AI-작업지시서.md`가 이미 다룬 REQ-NF-011 동시접속 상한처럼, 제약과 NFR이 충돌하면 새 REQ를 만들어 명시적으로 해소한다).

## 원천

- `SRS_project/SRS_V0_9.md` §1.5(C-TEC-001~007), §5.2(REQ-NF-008~010)
