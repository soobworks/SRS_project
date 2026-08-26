---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Infra] C-002: 네이버 API 목업 데이터 (Contract-adjacent fixture)"
labels: 'infra, contract, external-api, priority:critical'
assignees: ''
---

## 🎯 Summary
- 기능명: [C-002] 네이버 관심매물·경로·검색 API 목업 데이터
- 목적: 네이버 내부 API 접근권이 확보되지 않은 상태(GAP-001)에서도 이후 모든 기능 태스크가 실제 데이터 형태로 동작·검증되게 한다. 픽스처 데이터 자체가 "이 시스템이 다루는 데이터의 모양"을 정의하는 계약이므로 Phase 0(계약)로 분류한다.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `SRS_V0_9.md` §2.2 "v0.9 신규 — 외부 API 목업/실연동 스위치", §3.3 외부 시스템 연동, §1.6 GAP-001(치명적)
- 데이터 계약: C-001에서 정의한 타입, `SRS_V0_9.md` §6.2 `ListingRef`, `RouteCache` 모델
- 구 버전: `SRS_project/tasks/TASK-001-네이버-API-목업스위치.md`(v1). v2에서는 이 태스크가 "스위치 로직"이 아니라 "픽스처 데이터 그 자체"에 집중하고, 스위치 라우팅 로직은 실연동 기능 태스크(S-001 등) 착수 시점에 함께 붙인다

## ✅ Task Breakdown (실행 계획)
- [ ] `lib/external/fixtures/listings.json` — `ListingRef` 스키마와 동일한 형태의 고정 매물 5~10건 작성
- [ ] `lib/external/fixtures/routes.json` — `RouteCache` 스키마와 동일한 형태의 고정 경로 계산 결과(출근지×매물좌표×이동수단 조합) 작성
- [ ] `lib/external/fixtures/search-counts.json` — 재탐색 필터별 고정 검색 결과 수 픽스처
- [ ] `lib/external/naver-gateway.ts`에 `NAVER_API_MODE`(`mock` | `live`) 환경변수 읽기 뼈대만 작성(라우팅 대상 함수는 아직 없음 — 목업 반환 경로만 우선 연결)
- [ ] `.env.local`에 `NAVER_API_MODE=mock` 기본값 설정

## 🧪 Acceptance Criteria (BDD/GWT)
> 이 태스크는 원 SRS 기능 요구사항(FR)에 직접 대응하지 않는 계약/픽스처 태스크라 원본 AC가 없다.

Scenario 1: 픽스처 스키마 일치
- Given: `listings.json` 픽스처가 작성된 상태
- When: C-001의 `ListingRef` 타입과 대조함
- Then: 모든 필드(coordinates, deposit, rent, maintenanceFee, area, listingType, parking, walkToStationMin, transactionStatus)가 타입과 100% 일치한다.

Scenario 2: 목업 모드 기본 동작
- Given: `NAVER_API_MODE`가 설정되지 않았거나 `mock`인 상태
- When: `naver-gateway.ts`가 호출됨
- Then: 픽스처 데이터를 반환하며 실제 네트워크 요청은 발생하지 않는다.

## ⚙️ Technical & Non-Functional Constraints
- 픽스처는 C-001의 타입 정의를 그대로 따른다(임의 필드 생성 금지)
- `NAVER_API_MODE=live` 전환은 실제 API 키 발급 후에만 수행하며, 이 태스크 범위에는 포함하지 않는다
- 실연동 클라이언트(`naver-listing.ts` 등)와 그에 대한 `try/catch`(REQ-NF-004) 구현은 각 소비 태스크(S-001, R-002 등)에서 담당한다 — 이 태스크는 데이터만 준비한다

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 픽스처 3종이 C-001 타입 검사를 통과하는가(TypeScript로 픽스처를 import해 타입 단언)?
- [ ] `NAVER_API_MODE` 기본값이 `mock`으로 문서화되었는가?

## 🚧 Dependencies & Blockers
- Depends on: C-000, C-001(타입 계약)
- Blocks: S-001(FR-001 후보 구성), R-002(FR-016 재탐색 필터), J-001·003(판정 시 매물 데이터 필요)
