---
name: 302-data-access-rules
description: 같이 고르기의 Prisma + Supabase 데이터 접근 규범. 연결 문자열 선택, 마이그레이션, RLS, 트랜잭션. 스키마를 바꾸거나 쿼리를 작성할 때 사용한다.
---

# 데이터 접근 규칙

프레임워크 사용법은 설치된 스킬 `prisma-client-api` · `prisma-database-setup` · `supabase` · `supabase-postgres-best-practices`가 다룬다.
**이 문서는 그 위에 얹히는 이 프로젝트의 결정만 적는다.**

## 연결 — 두 개를 헷갈리지 않는다

Supabase는 용도가 다른 두 포트를 준다. 잘못 쓰면 마이그레이션이 깨지거나 서버리스에서 커넥션이 고갈된다.

| 환경 변수 | 포트 | 용도 |
| --- | --- | --- |
| `DATABASE_URL` | `:6543` pgbouncer 풀러(`?pgbouncer=true`) | **애플리케이션 런타임.** 서버리스 콜드스타트로 인한 커넥션 고갈 방지 필수 |
| `DIRECT_URL` | `:5432` 직결 | **마이그레이션 전용.** 풀러는 DDL·advisory lock을 제대로 못 다룬다 |

`schema.prisma`에 둘 다 명시한다.

## 마이그레이션

- 스키마 변경은 **항상 Prisma Migrate**로 남긴다. 로컬(Supabase CLI)과 배포(Supabase 관리형) 스키마는 이 방식으로만 동기화한다(REQ-NF-010) — 두 환경에 수동으로 별도 변경을 적용하지 않는다.
- 파괴적 변경(컬럼 삭제·타입 축소)은 두 단계로 나눈다 — 먼저 추가하고 쓰기를 전환한 뒤, 나중에 제거한다.

## RLS

- 공유 객체(`shared_space` 등) 테이블에는 RLS를 켠다. `person_id`가 A 또는 B가 아니면 행을 반환하지 않도록 **DB 레벨에서** 강제한다(REQ-NF-005).
- 애플리케이션 레벨(Server Action)에서도 같은 검증을 이중으로 한다 — RLS 하나만 믿지 않는다.
- 새 사용자 데이터 테이블을 만들면 RLS 정책도 **같은 변경에** 넣는다. 나중에 붙이면 그 사이가 구멍이다.
- 정책 작성 후 `supabase-postgres-best-practices`의 `security-rls-performance` 기준으로 성능 확인.

## 트랜잭션

- 경계는 도메인 모듈이 정한다. 진입점이 트랜잭션을 열지 않는다.
- `$transaction` 안에서 외부 API(네이버 등)를 호출하지 않는다 — 락을 잡은 채 네트워크를 기다리게 된다.

## 성능

- `select`로 필요한 컬럼만 가져온다. 목록 조회에서 관계를 통째로 `include`하지 않는다.
- N+1을 만들지 않는다.
- 경로 캐시(`route_cache`) 등 재사용 테이블에는 unique 제약 + 적절한 인덱스를 건다(REQ-NF-002·003).

## 안티패턴

| ❌ | 왜 |
| --- | --- |
| 런타임에 `DIRECT_URL` 사용 | 서버리스에서 커넥션 고갈 |
| 마이그레이션에 `DATABASE_URL` 사용 | 풀러가 DDL·lock을 못 다룸 |
| RLS 없이 공유 객체 테이블 생성 | 권한 우회 경로 |
| 트랜잭션 안에서 외부 API 호출 | 락 유지 시간이 네트워크에 종속 |
| `page.tsx`에서 Prisma 직접 호출 | 계층 침범(스킬 `301`) |

## 원천

- `SRS_project/SRS_V0_9.md` §6(데이터 설계), §6.2(ERD/enum)
