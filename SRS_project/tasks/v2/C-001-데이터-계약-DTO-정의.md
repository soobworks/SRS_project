---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Infra] C-001: 데이터 계약(DTO) 정의 — Server Action Input/Output 타입 SSOT"
labels: 'infra, contract, priority:critical'
assignees: ''
---

## 🎯 Summary
- 기능명: [C-001] 데이터 계약(DTO) 정의
- 목적: 모든 Server Action의 Input/Output 타입을 **기능 구현 전에** 단일 파일(SSOT)로 선언한다. 이 태스크는 비즈니스 로직을 한 줄도 작성하지 않는다 — 순수 타입 선언만 한다(원칙 ①: 계약 우선).

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `SRS_V0_9.md` §3.1 Server Actions 목록(전체 15개 시그니처 원문), §6.2 Prisma 스키마(모델 필드 원문)
- 재구성 근거: `SRS_project/tasks/TASK-재추출-전략-v2-계획서.md` Phase 0 — "에이전트가 각 태스크를 진행하며 타입을 즉흥적으로 만들 위험을 막는 SSOT"

## ✅ Task Breakdown (실행 계획)
- [ ] `lib/types/contracts.ts` 생성
- [ ] Prisma 모델에서 파생되는 타입 재노출: `SharedSpace`, `Person`, `Invite`, `ListingRef`, `JudgmentResult`, `CompromiseSentence`, `RelaxationProposal`, `VisitSelection`, `BrokerQuestion`, `FieldRecord`, `Notification`, `RouteCache`(Prisma Client 생성 타입을 `import type { ... } from "@prisma/client"`로 재노출)
- [ ] Server Action 전용 Input 타입 선언 — `ConditionInput`(예산·출퇴근·조건 키/연산자/값), `RelationshipType`(enum), `FieldRecordOutcome`(Prisma enum 재사용)
- [ ] Server Action 전용 Output 타입 선언 — `InviteBundle`(링크+코드), `JudgmentResultSet`(`JudgmentResult[]`), `PreviewResult`(완화 미리보기 결과), `FilterUiSpec`(재탐색 필터 변환 결과), `SelectionRound`(방문 후보 라운드 결과), `Checklist`(방문 후 체크리스트 6항목), `PersonId`(문자열 별칭 타입, TASK-002 임시 인증과 실제 로그인이 공유)
- [ ] 각 타입 선언 옆에 JSDoc 주석으로 대응 SRS 요구사항 ID(REQ-FUNC-xxx) 표기
- [ ] `lib/types/index.ts`에서 `contracts.ts`를 배럴 export

## 🧪 Acceptance Criteria (BDD/GWT)
> 이 태스크는 원 SRS 기능 요구사항(FR)에 직접 대응하지 않는 계약 정의 태스크라 원본 AC가 없다. 아래는 계약 자체의 검증 기준이다.

Scenario 1: 시그니처 완전성
- Given: `SRS_V0_9.md` §3.1의 15개 Server Action 시그니처가 주어짐
- When: `contracts.ts`의 타입 선언과 대조함
- Then: 15개 Server Action 전부의 Input/Output 타입이 `contracts.ts`에 선언되어 있다(누락 0건).

Scenario 2: 순환 의존 없음
- Given: `contracts.ts`가 작성된 상태
- When: 다른 어떤 모듈도 아직 존재하지 않는 시점에 이 파일만 단독 컴파일함
- Then: `@prisma/client` 외 어떤 애플리케이션 모듈도 import하지 않고 컴파일 성공한다(SSOT로서 최상위 의존성).

## ⚙️ Technical & Non-Functional Constraints
- 이 태스크는 로직·검증·DB 접근을 포함하지 않는다 — 순수 `type`/`interface` 선언만 허용
- 이후 모든 기능 태스크(J-xxx, I-xxx, S-xxx, V-xxx, R-xxx, X-xxx, F-xxx)는 자체적으로 타입을 새로 선언하지 않고 반드시 `lib/types/contracts.ts`에서 import한다 — 코드 리뷰에서 이 규칙 위반(로컬 재정의)을 체크한다
- 스키마(C-000)가 바뀌면 이 파일도 함께 갱신해야 하는 종속 관계를 README에 명시

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] TypeScript 컴파일이 경고 없이 성공하는가?
- [ ] 15개 Server Action 시그니처 전부가 이 파일의 타입만으로 표현 가능한가?
- [ ] Linter 경고가 없는가?

## 🚧 Dependencies & Blockers
- Depends on: C-000(Prisma 스키마가 먼저 있어야 모델 타입을 재노출 가능)
- Blocks: A-001, J-001~009, I-001·002, S-001~005, V-001~003, R-001~005, X-001~004, F-001~003 — 사실상 모든 기능 태스크가 이 계약 위에서 시작
