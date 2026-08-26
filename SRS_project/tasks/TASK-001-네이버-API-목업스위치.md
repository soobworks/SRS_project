---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Infra] TASK-001: 네이버 API 목업/실연동 스위치"
labels: 'infra, external-api, priority:critical'
assignees: ''
---

## 🎯 Summary
- 기능명: [TASK-001] 네이버 관심매물·경로·검색 API 목업/실연동 스위치
- 목적: 네이버 내부 API 접근권이 확보되지 않은 상태(GAP-001)에서도 FR-001·016, REQ-NF-002·003을 실제로 동작시키고 검증할 수 있게 한다.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `SRS_V0_9.md` §2.2 "v0.9 신규 — 외부 API 목업/실연동 스위치", §3.3 외부 시스템 연동
- 적합성 검토: `SRS_V0_9.md` §1.6 GAP-001(치명적 — 네이버 API 접근권 미확보)
- 데이터 모델: `SRS_V0_9.md` §6.2 `ListingRef`, `RouteCache` 모델
- 기술 설계 문서(참고): `같이보기-technical-design-v1_0.md` §3.3 외부 연동 표

## ✅ Task Breakdown (실행 계획)
- [ ] `lib/external/naver-listing.ts` / `naver-route.ts` / `naver-search.ts` 인터페이스 정의(실연동, 현재는 스텁)
- [ ] `lib/external/naver-listing.mock.ts` / `naver-route.mock.ts` / `naver-search.mock.ts` 작성 — `ListingRef` 스키마와 동일한 형태의 고정 픽스처 5~10건
- [ ] `lib/external/naver-gateway.ts` 작성 — `process.env.NAVER_API_MODE`(`mock` | `live`)에 따라 실연동/목업으로 라우팅
- [ ] `route_cache` 테이블에 목업 모드용 고정 경로 계산 결과 시딩 스크립트 작성
- [ ] `.env.local`에 `NAVER_API_MODE=mock` 기본값 설정, README에 목업 모드 사용법 문서화

## 🧪 Acceptance Criteria (BDD/GWT)
Scenario 1: 목업 모드 기본 동작
- Given: `NAVER_API_MODE`가 설정되지 않았거나 `mock`인 상태
- When: `naver-gateway.ts`를 통해 관심매물을 조회함
- Then: 고정 픽스처 5~10건이 반환되며, 실제 네이버 서버로 어떠한 네트워크 요청도 발생하지 않는다.

Scenario 2: 목업↔실연동 인터페이스 동일성
- Given: `naver-listing.ts`와 `naver-listing.mock.ts`가 모두 구현된 상태
- When: 상위 계층(`domain/`, `actions/`)에서 두 구현체를 교체함
- Then: 상위 계층 코드를 한 줄도 수정하지 않고 정상 동작한다(인터페이스 100% 동일).

## ⚙️ Technical & Non-Functional Constraints
- REQ-NF-004: 실연동 클라이언트는 `try/catch`로 감싸 실패 시 `CALCULATION_FAILED` 상태를 반환, 요청을 막지 않는다
- 목업 픽스처는 `LISTING_REF` ERD(SRS_V0_9.md §6.1)의 필드 타입을 정확히 따른다(임의 필드 생략 금지)
- `NAVER_API_MODE=live` 전환은 실제 API 키 발급 후에만 수행하며, 이 태스크 범위에는 포함하지 않는다

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 목업 모드로 TASK-007(후보 구성) 전체 흐름이 네트워크 의존 없이 로컬에서 완주되는가?
- [ ] 단위 테스트(Unit Test)가 추가되었고 통과하는가?
- [ ] 실연동/목업 전환이 코드 변경 없이 환경변수만으로 가능한가?

## 🚧 Dependencies & Blockers
- Depends on: TASK-000
- Blocks: TASK-007(FR-001 후보 구성), TASK-011(FR-016 재탐색 필터), REQ-NF-002·003 관련 작업
