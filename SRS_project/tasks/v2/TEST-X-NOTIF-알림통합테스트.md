---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-X-NOTIF: 알림 생성·조회 통합 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- X-002(알림 생성·조회, 병합됨)가 충족해야 하는 인수 조건을 테스트로 작성한다. 생성 없이는 조회를 의미 있게 검증할 수 없어 하나의 companion으로 묶는다. (2026-08-26: 기능 Task 쪽도 X-002/X-003이 한 파일로 병합됐다 — AC 2개와 테스트 내용은 변경 없음.)

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: X-002(생성·조회 통합)
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.6, 그대로 인용):
  - **AC-24-01(정상):** Given "한 사용자가 조건을 입력·변경하거나 완화를 제안한 상태" / When "해당 이벤트가 발생함" / Then "다른 사용자에게 상태 변화를 알린다" / SLO "트리거 발생 대비 알림 발송률 100%"
  - **AC-24-02(예외):** Given "후보가 추가·교체·소진되거나 방문 후보 선택 상태가 바뀐 상태" / When "해당 이벤트가 발생함" / Then "상대에게 무엇이 변경되었는지 알린다" / SLO "알림 누락 0건"

## ✅ Task Breakdown
- [ ] AC-24-01에 대한 테스트 작성: 조건 변경(I-001)·완화 제안(R-003) 각각의 트리거가 상대방 앞으로 Notification을 생성함(4개 트리거 중 2개)
- [ ] AC-24-02에 대한 테스트 작성: 후보 변경·소진(V-003)·방문 후보 상태 변경(V-001) 트리거가 상대방 앞으로 Notification을 생성함(나머지 2개)
- [ ] 통합: 4개 트리거 전부에 대해 `getUnreadNotifications`로 실제 조회되는지 종단 테스트

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-24-01: 조건 변경/완화 제안 시 알림 발송") {
  given: personA calls saveBudgetAndCommute (I-001)
  when: 이후 personB의 알림 조회
  then: getUnreadNotifications(personB.id) includes CONDITION_CHANGED type entry

  (별도 케이스) given: personA calls proposeRelaxation (R-003)
  then: getUnreadNotifications(personB.id) includes RELAXATION_PROPOSED type entry
}

test("AC-24-02: 후보 변경·소진/방문후보 변경 시 알림 발송") {
  given: listing marked exhausted (V-003)
  then: both A and B receive LISTING_CHANGED notification

  (별도 케이스) given: VisitSelection round advances (V-001)
  then: both A and B receive VISIT_SELECTION_CHANGED notification
}
```

## ⚙️ Technical & Non-Functional Constraints
- "알림 발송률 100%", "알림 누락 0건" — 4개 트리거 각각을 개별 테스트로 커버해 어느 하나라도 놓치지 않도록 한다(합쳐서 하나의 뭉뚱그린 테스트로 만들지 않음)

## 🏁 Definition of Done (DoD)
- [ ] 4개 트리거(조건변경/완화제안/후보변경소진/방문후보변경) 전부에 대한 테스트가 개별적으로 존재하는가?
- [ ] X-002 구현 완료 후 전부 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: I-001, R-003, V-001, V-003
- Blocks: X-002 완료 처리
