---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-S-005: 만료 조건 삭제 배치 인수 조건 자동화"
labels: 'test, priority:low'
assignees: ''
---

## 🎯 Summary
- S-005(만료 조건 삭제 배치)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: S-005
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.2, 그대로 인용):
  - **AC-07-03(예외):** Given "임시 조건이 이관되지 않은 상태" / When "마지막 접근일로부터 30일이 지남" / Then "해당 임시 조건을 삭제한다" / SLO "보관 기간 30일"

## ✅ Task Breakdown
- [ ] AC-07-03에 대한 테스트 작성: `lastAccessedAt`이 30일 초과·미이관인 레코드가 배치 실행 후 `tempCondition`이 null이 됨을 검증
- [ ] 경계 테스트: 정확히 29일 경과분은 삭제되지 않고, 31일 경과분은 삭제됨(경계값 테스트)
- [ ] 이관 완료(`migratedAt` not null)된 레코드는 30일이 지나도 삭제 로직 대상에서 제외됨을 검증

## 🧪 Test Cases (실행 가능한 형태)
```
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
- 경계값 테스트(29일 vs 31일)를 반드시 포함 — "30일"이라는 정확한 SLO를 테스트로 고정하지 않으면 나중에 임의로 바뀔 위험이 있다

## 🏁 Definition of Done (DoD)
- [ ] AC-07-03 및 경계 테스트가 작성되었는가?
- [ ] S-005 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: S-005 완료 처리
