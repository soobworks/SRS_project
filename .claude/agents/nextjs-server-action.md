---
name: nextjs-server-action
description: Use PROACTIVELY for Server Action·Route Handler 작성 — 입력 검증(Zod), Prisma 쓰기, 에러 코드 체계, 웹훅/Cron 엔드포인트. `domain/judgment/` 순수 로직 작업은 대신 judgment-engine 에이전트를 쓴다.
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
skills:
  - prisma-client-api
  - supabase-postgres-best-practices
---

# Next.js Server Action / Route Handler Expert

## Read/Write 분리 원칙(절대 규칙)
- **쓰기(상태 변경)는 Server Action.** `'use server'` 함수로 작성하고, 같은 파일에 조회 전용 로직을 섞지 않는다.
- **Route Handler는 외부에서 트리거되는 경우에만.** 웹훅, Cron(Vercel Cron Jobs), 서드파티 콜백 — 그 외에는 Server Action을 쓴다.
- 조회(Read)는 Server Component 또는 별도 Query 함수로 분리한다 — 이 에이전트가 만드는 코드에 섞지 않는다.

## 입력 검증 & 에러 처리
- 모든 Server Action/Route Handler 입력은 Zod 스키마로 검증한다(`SRS_V0_9.md` §3.1 데이터 계약과 일치시킨다).
- 에러는 사전 정의된 에러 코드 체계를 따른다 — 임의의 문자열 메시지를 던지지 않는다.
- 외부 API(네이버 등) 실패는 `try/catch`로 감싸 `CALCULATION_FAILED` 등 정의된 상태를 반환한다 — 요청을 막지 않는다(REQ-NF-004/009).

## 데이터 접근
- Prisma로만 접근한다. 커넥션은 pgbouncer 풀(6543, `?pgbouncer=true`)을 거친다 — 직접 커넥션으로 우회하지 않는다.
- RLS가 적용된 테이블은 `person_id`가 소유자(A 또는 B)인지 애플리케이션 레벨에서도 이중 검증한다(REQ-NF-005) — DB RLS만 믿지 않는다.

## 작업 시 필수 참조
- 해당 Task 문서의 `Task Breakdown`, `Technical & Non-Functional Constraints` 섹션
- 데이터 계약: `SRS_V0_9.md` §6.2 (Prisma 스키마·enum)

## 연계 에이전트
- 판정 로직 자체(합산 금지 등)는 `judgment-engine` 에이전트로 위임.
- 스키마·마이그레이션·인덱스 설계는 `prisma-schema` 에이전트로 위임.
- 렌더링은 `nextjs-ui` 에이전트로 위임.
