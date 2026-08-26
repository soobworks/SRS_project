---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Infra] TASK-000: 프로젝트 기반 설정 (Next.js · Prisma · Supabase CLI)"
labels: 'infra, foundation, priority:critical'
assignees: ''
---

## 🎯 Summary
- 기능명: [TASK-000] 프로젝트 기반 설정
- 목적: 이후 모든 TASK(001~020)가 딛고 설 Next.js 프로젝트 구조, Prisma 스키마·마이그레이션, 로컬 Supabase CLI 연결을 구성한다. 이 태스크 자체는 FR을 구현하지 않는다.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`SRS_project/SRS_V0_9.md#2-시스템-아키텍처`](../SRS_V0_9.md), [`#6-데이터-설계`](../SRS_V0_9.md), [`#8-배포-및-운영`](../SRS_V0_9.md)
- 모듈 구조: `SRS_V0_9.md` §2.2 디렉터리 트리(app/, lib/, prisma/, components/)
- Prisma 스키마 원문: `SRS_V0_9.md` §6.2 (전체 schema.prisma 코드 블록)
- 로컬-프로덕션 환경 전략: `SRS_V0_9.md` §6.3
- 작업 순서 근거: `SRS_project/GitHub-TASK-작성순서-로드맵.md` 순번 1

## ✅ Task Breakdown (실행 계획)
- [ ] Next.js(App Router) 프로젝트 스캐폴드 생성, TypeScript·Tailwind CSS·shadcn/ui 초기 설정(C-TEC-001, 004)
- [ ] `prisma/schema.prisma`를 SRS_V0_9.md §6.2 원문 그대로 작성(11개 모델 + 7개 enum)
- [ ] 로컬 Supabase CLI 설치·초기화(`supabase init` → `supabase start`), 로컬 Postgres 컨테이너 기동 확인
- [ ] `prisma migrate dev`로 최초 마이그레이션 생성 및 로컬 DB 반영
- [ ] `lib/db/prisma.ts`에 PrismaClient 싱글턴 작성(서버리스 환경 중복 연결 방지 패턴 적용)
- [ ] `lib/actions/`, `lib/queries/`, `lib/domain/`, `lib/external/`, `lib/auth/` 빈 디렉터리 및 배럴 파일 구조 생성(§2.2 트리 그대로)
- [ ] `.env.local.example` 작성 — §8.2 환경 변수 표의 키 이름만 채우고 값은 비움

## 🧪 Acceptance Criteria (BDD/GWT)
Scenario 1: 로컬 개발 환경 기동
- Given: 저장소를 최초로 클론한 상태
- When: `supabase start` → `prisma migrate dev` → `next dev`를 순서대로 실행함
- Then: 에러 없이 로컬 서버가 기동되고, Prisma Studio에서 11개 모델 테이블이 모두 보인다.

Scenario 2: 스키마와 SRS 원문 일치
- Given: `prisma/schema.prisma`가 작성된 상태
- When: SRS_V0_9.md §6.2 원문과 diff를 확인함
- Then: 모델·enum·필드명이 100% 일치한다(임의 필드 추가·누락 없음).

## ⚙️ Technical & Non-Functional Constraints
- C-TEC-001~004 전체 준수(단일 Next.js 풀스택, Server Actions/Route Handlers, Prisma+로컬 Supabase CLI, Tailwind+shadcn/ui)
- 배포 환경 `DATABASE_URL`은 반드시 pgbouncer 풀링 연결(포트 6543, `?pgbouncer=true`)을 사용하도록 `.env.local.example`에 주석으로 명시(TASK-B5 근거)
- 저장소에 `.env` 실제 값을 커밋하지 않는다

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `prisma migrate dev`가 경고 없이 성공하는가?
- [ ] README 또는 CONTRIBUTING에 로컬 기동 절차가 3단계 이내로 문서화됐는가?
- [ ] TASK-001~002가 이 구조 위에서 착수 가능한 상태인가?

## 🚧 Dependencies & Blockers
- Depends on: 없음(최초 태스크)
- Blocks: TASK-001, TASK-002, TASK-003(모든 후속 태스크)
