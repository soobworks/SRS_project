---
name: 301-server-boundary-rules
description: Next.js App Router에서 서버 코드를 어디에 어떻게 쓸지 정한다. Server Action·Route Handler·RSC 선택, 도메인 모듈 경계, Read/Write 분리. 서버 로직을 추가하거나 옮길 때 사용한다.
---

# 서버 경계 규칙

## 진입점은 셋뿐이다

C-TEC-002가 정한다.

| 상황 | 선택 | 위치 |
| --- | --- | --- |
| 화면 렌더용 읽기 | RSC 직접 조회 | `app/**/page.tsx` |
| 사용자 변경 작업 | Server Action | `app/actions/*.ts` |
| 외부 시스템 수신(웹훅·Cron) | Route Handler | `app/api/**/route.ts` |

**Server Action은 항상 POST다.** 캐시 가능한 GET이 필요하면 Route Handler를 쓴다.

## 계층 — 어디에 무엇을 두는가

```
app/actions/*.ts              진입점 — 입력 검증(Zod), 인증 확인, 결과 형태 결정
   ↓ 함수 호출 (HTTP 아님)
domain/<name>/                도메인 — 판정·완화 등 순수 로직. 이 폴더가 유일한 공개 표면
   ↓
lib/db.ts                     데이터 — Prisma 접근
```

### 진입점(Server Action·Route Handler)
- **입력을 신뢰하지 않는다.** Server Action 인자는 클라이언트가 보낸 값이다 — 스키마로 파싱한 뒤 도메인에 넘긴다.
- 여기서 `person_id`가 요청자 본인인지 확인한다(REQ-NF-005의 애플리케이션 레벨 이중 검증).
- **비즈니스 규칙(판정·완화 로직)을 여기에 쓰지 않는다.**

### 도메인(`domain/<name>/`)
- 판정 로직은 **순수 함수**만 허용한다. DB·외부 API 접근 금지 — Read/Write Closed Context 분리 원칙(`CLAUDE.md` §3).
- 모듈 목록: `judgment`(판정 엔진) · `shared-space`(후보·초대) · `visit-selection`(2라운드 매칭) · `compromise`(완화·양보 문장) · `cross-cutting`(알림·전제공개·동시접속) · `field-record`(중개사 QA·방문 후 기록)
- Next.js에 의존하지 않는다 — `cookies()` 등을 도메인에서 부르지 않는다. 필요한 값은 인자로 받는다.

### 데이터(`lib/db.ts`)
- Prisma 클라이언트는 싱글턴으로 둔다(개발 중 HMR로 연결이 새는 것을 막는다).
- pgbouncer 풀(`DATABASE_URL`, `:6543`)을 거친다 — 상세는 스킬 `302-data-access-rules`.

## 캐시

- 읽기 캐시는 `use cache` + `cacheTag`로 건다. 태그가 없으면 무효화할 방법이 없다.
- **캐시 서버를 도입하지 않는다**(스킬 `300`).

## 비동기·주기 작업

- 응답 후 처리(집계, 알림 발신)는 `after()`를 쓴다.
- 재시도가 필요하거나 유실되면 안 되는 작업은 DB 큐 테이블에 넣고 Vercel Cron이 처리한다.
- **메시지 큐를 도입하지 않는다**(스킬 `300`).
- Cron 엔드포인트는 인증한다 — `app/api/cron/**/route.ts`는 공개 URL이므로 누구나 부를 수 있다.

## 안티패턴

| ❌ | 왜 | ✅ |
| --- | --- | --- |
| `page.tsx`에 Prisma 쿼리 직접 작성 | 재사용·테스트 불가 | `domain/<name>/` 경유 |
| 도메인 모듈에서 `cookies()` 호출 | 테스트 불가·계층 침범 | 진입점이 값을 뽑아 인자로 전달 |
| Server Action으로 캐시 가능한 GET 처리 | POST라 캐시 안 됨 | Route Handler |
| `use cache`에 태그 없이 캐싱 | 무효화 불가 | `cacheTag` 필수 |
| 판정 로직에서 여러 결과를 합산 | §3 절대 규칙 위반 | 스킬 `304-judgment-domain-rules` |

## 원천

- `SRS_project/SRS_V0_9.md` §3(아키텍처), §14.1(디렉터리 구조)
