---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-S-004: 임시조건 생애주기(저장·이관·만료) 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- S-004(임시조건 생애주기 — 저장·이관·만료 삭제)의 완료 기준이 되는 테스트를 작성한다. (2026-08-26: v2 S-004/S-005가 한 기능 Task로 병합되면서 이 테스트 companion도 함께 병합했다 — AC 4개와 테스트 내용은 변경 없음.)

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: S-004
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.2, 그대로 인용):
  - **AC-07-01(정상):** Given "B가 비로그인 상태" / When "예산과 조건을 입력함" / Then "초대 코드에 연결해 임시 저장하고 다른 초대와 섞지 않는다" / SLO "초대 코드 간 조건 혼입 0건"
  - **AC-07-02(정상):** Given "B 조건이 초대 코드에 임시 저장된 상태" / When "B가 로그인함" / Then "임시 조건을 B 계정으로 이관한다" / SLO "이관 성공률 100%"
  - **AC-07-03(예외):** Given "임시 조건이 이관되지 않은 상태" / When "마지막 접근일로부터 30일이 지남" / Then "해당 임시 조건을 삭제한다" / SLO "보관 기간 30일"
  - **AC-08-01(정상):** Given "공유 객체 비로그인 열람이 허용된 상태" / When "B가 첫 결과 확인 후 저장·재방문을 시도함" / Then "그 시점에만 로그인을 요청한다" / SLO "첫 결과 확인 전 로그인 요구 0건"
  - **AC-08-02(보류/예외):** Given "비로그인 열람이 허용되지 않는 것으로 확정되는 경우" / When "B가 조건 입력 단계에 진입함" / Then "조건 입력 이전에 로그인을 요구해야 하며, 세부 화면은 정책 확정 후 결정한다" / SLO "`[TBD]` — 정책 확정 전 수치화 보류"

## ✅ Task Breakdown

**저장·이관:**
- [ ] AC-07-01에 대한 테스트 작성: 서로 다른 두 초대 코드로 저장한 조건이 절대 섞이지 않음(격리) 검증
- [ ] AC-07-02에 대한 테스트 작성: 로그인 후 `migrateTemporaryCondition` 호출로 조건이 Person에 이관됨을 검증
- [ ] AC-08-01에 대한 테스트 작성: 첫 결과 확인 전에는 로그인 요구 플래그가 발생하지 않음을 검증
- [ ] AC-08-02: 정책이 `[TBD]`이므로 테스트를 즉시 작성하지 않고, 정책 확정 시까지 이 항목을 보류로 명시(빈 테스트 스텁 + skip 마킹만 남김)

**만료 삭제(배치):**
- [ ] AC-07-03에 대한 테스트 작성: `lastAccessedAt`이 30일 초과·미이관인 레코드가 배치 실행 후 `tempCondition`이 null이 됨을 검증
- [ ] 경계 테스트: 정확히 29일 경과분은 삭제되지 않고, 31일 경과분은 삭제됨(경계값 테스트)
- [ ] 이관 완료(`migratedAt` not null)된 레코드는 30일이 지나도 삭제 로직 대상에서 제외됨을 검증

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

test("AC-07-03: 30일 초과 미이관 조건 삭제") {
  given: Invite with lastAccessedAt = now - 31 days, migratedAt = null, tempCondition = {...}
  when: purge job 실행
  then: tempCondition === null after job
}

test("경계: 29일 경과분은 유지") {
  given: Invite with lastAccessedAt = now - 29 days
  when: purge job 실행
  then: tempCondition unchanged
}

test("이관 완료분은 삭제 대상 제외") {
  given: Invite with lastAccessedAt = now - 40 days, migratedAt = <some date>
  when: purge job 실행
  then: tempCondition unchanged (이미 이관됐으므로 삭제 불필요 — 실제로는 이관 시점에 이미 정리됐을 수 있음, 이중 안전장치 확인)
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-08-02는 정책 미확정(`[TBD]`)이므로 완전한 테스트 대신 skip 처리하되, 정책 확정 시 이 테스트를 활성화해야 한다는 TODO를 코드에 명시
- 경계값 테스트(29일 vs 31일)를 반드시 포함 — "30일"이라는 정확한 SLO를 테스트로 고정하지 않으면 나중에 임의로 바뀔 위험이 있다

## 🏁 Definition of Done (DoD)
- [ ] AC-07-01·02·03, AC-08-01 네 테스트 + 경계 테스트 2개가 작성 및 통과하는가?
- [ ] AC-08-02가 명시적으로 skip 처리되고 이유가 주석에 남아있는가?
- [ ] S-004 구현 완료 후 전부 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: S-004 완료 처리
