---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] TASK-002: 임시 인증 (매직 링크 · 초대코드 신원)"
labels: 'feature, auth, priority:high'
assignees: ''
---

## 🎯 Summary
- 기능명: [TASK-002] 임시 인증 — 매직 링크 / 초대코드 기반 임시 신원
- 목적: 네이버 로그인 프로바이더 지원 여부가 미확정(GAP-002)인 상태에서도, A·B를 식별해 이후 모든 조건·판정 태스크가 "누구의 요청인지" 알 수 있게 한다.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `SRS_V0_9.md` §3.1 "v0.9 신규 — 임시 인증 두 갈래", §1.6 GAP-002
- 데이터 모델: `SRS_V0_9.md` §6.2 `Person`, `Invite` 모델
- 관련 원 요구사항: `같이보기-srs-v1_0.md` §9.2 REQ-FUNC-007(B 조건 입력 및 임시 보관) AC-07-01~03, REQ-FUNC-008(결과 후 로그인) AC-08-01·02

## ✅ Task Breakdown (실행 계획)
- [ ] `lib/auth/magic-link.ts` 작성 — Supabase Auth 매직 링크 요청/검증 래퍼
- [ ] Server Action `requestMagicLink(email: string): Promise<void>` 구현
- [ ] Server Action `identifyByInviteCode(inviteCode: string): Promise<PersonId>` 구현 — `Invite.tempCondition`과 동일한 임시 저장 구조 재사용, 계정 생성 없이 세션 식별자만 부여
- [ ] 세션/쿠키 계층에 `PersonId`를 저장하는 공통 헬퍼 작성(두 인증 방식이 동일한 반환 타입을 공유하도록)
- [ ] `/api/auth/callback`(Route Handler) 스텁 작성 — 추후 실제 네이버 OAuth로 교체될 자리 표시자로 남김

## 🧪 Acceptance Criteria (BDD/GWT)
Scenario 1: 매직 링크 로그인
- Given: 유효한 이메일 형식이 주어짐
- When: `requestMagicLink`를 호출함
- Then: Supabase Auth가 메일을 발송하고, 링크 클릭 시 `PersonId`가 발급되어 세션에 저장된다.

Scenario 2: 초대코드 임시 신원(B, 비로그인)
- Given: B가 유효한 초대코드를 보유한 상태(원 SRS AC-06-01과 동일 전제)
- When: `identifyByInviteCode`를 호출함
- Then: 계정 생성 없이 초대코드에 귀속된 `PersonId`가 즉시 발급된다(원 SRS AC-07-01: 초대 코드 간 조건 혼입 0건을 준수).

Scenario 3: 두 인증 경로의 반환 타입 동일성
- Given: 매직 링크 경로와 초대코드 경로가 모두 구현된 상태
- When: 상위 Server Action(예: `saveBudgetAndCommute`)에서 `PersonId`를 사용함
- Then: 어느 경로로 식별됐는지와 무관하게 동일한 코드로 동작한다.

## ⚙️ Technical & Non-Functional Constraints
- REQ-NF-005(접근 제어): 발급된 `PersonId`는 해당 `SharedSpace`의 A 또는 B로만 국한(Supabase RLS 정책과 연동)
- 원 SRS AC-07-03(마지막 접근 +30일 미이관 삭제)은 TASK-014의 Cron 배치 범위 — 이 태스크에서는 저장 구조만 준비
- 새 인프라(별도 인증 서버 등)를 추가하지 않는다(C-TEC-002·003 준수)

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 단위 테스트 및 통합 테스트가 추가되었고 통과하는가?
- [ ] 실제 네이버 로그인 확정 시 `/api/auth/callback`으로 교체 가능한 구조인지 코드 리뷰로 확인됐는가?

## 🚧 Dependencies & Blockers
- Depends on: TASK-000
- Blocks: TASK-004(FR-002), TASK-007(FR-001), TASK-008(FR-005·006) 등 개인 식별이 필요한 모든 태스크
