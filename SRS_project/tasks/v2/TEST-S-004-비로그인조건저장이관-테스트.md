---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-S-004: 비로그인 조건 저장·이관 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- S-004(비로그인 조건 저장·이관)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: S-004
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.2, 그대로 인용):
  - **AC-07-01(정상):** Given "B가 비로그인 상태" / When "예산과 조건을 입력함" / Then "초대 코드에 연결해 임시 저장하고 다른 초대와 섞지 않는다" / SLO "초대 코드 간 조건 혼입 0건"
  - **AC-07-02(정상):** Given "B 조건이 초대 코드에 임시 저장된 상태" / When "B가 로그인함" / Then "임시 조건을 B 계정으로 이관한다" / SLO "이관 성공률 100%"
  - **AC-08-01(정상):** Given "공유 객체 비로그인 열람이 허용된 상태" / When "B가 첫 결과 확인 후 저장·재방문을 시도함" / Then "그 시점에만 로그인을 요청한다" / SLO "첫 결과 확인 전 로그인 요구 0건"
  - **AC-08-02(보류/예외):** Given "비로그인 열람이 허용되지 않는 것으로 확정되는 경우" / When "B가 조건 입력 단계에 진입함" / Then "조건 입력 이전에 로그인을 요구해야 하며, 세부 화면은 정책 확정 후 결정한다" / SLO "`[TBD]` — 정책 확정 전 수치화 보류"

## ✅ Task Breakdown
- [ ] AC-07-01에 대한 테스트 작성: 서로 다른 두 초대 코드로 저장한 조건이 절대 섞이지 않음(격리) 검증
- [ ] AC-07-02에 대한 테스트 작성: 로그인 후 `migrateTemporaryCondition` 호출로 조건이 Person에 이관됨을 검증
- [ ] AC-08-01에 대한 테스트 작성: 첫 결과 확인 전에는 로그인 요구 플래그가 발생하지 않음을 검증
- [ ] AC-08-02: 정책이 `[TBD]`이므로 테스트를 즉시 작성하지 않고, 정책 확정 시까지 이 항목을 보류로 명시(빈 테스트 스텁 + skip 마킹만 남김)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-07-01: 초대 코드 간 조건 혼입 없음") {
  given: two separate invite codes A, B each with saved temporary conditions
  when: saveTemporaryCondition(codeA, inputA), saveTemporaryCondition(codeB, inputB)
  then: querying codeA's temp condition returns only inputA, never inputB
}

test("AC-07-02: 로그인 시 이관 성공") {
  given: temp condition saved under inviteCode
  when: migrateTemporaryCondition(inviteCode, personId)
  then: Person(personId).requiredConditions/budgetCap reflects the migrated values, Invite.migratedAt is set
}

test.skip("AC-08-02: 정책 확정 전 보류 — [TBD]")
```

## ⚙️ Technical & Non-Functional Constraints
- AC-08-02는 정책 미확정(`[TBD]`)이므로 완전한 테스트 대신 skip 처리하되, 정책 확정 시 이 테스트를 활성화해야 한다는 TODO를 코드에 명시

## 🏁 Definition of Done (DoD)
- [ ] AC-07-01·02, AC-08-01 세 테스트가 작성 및 통과하는가?
- [ ] AC-08-02가 명시적으로 skip 처리되고 이유가 주석에 남아있는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: S-004 완료 처리
