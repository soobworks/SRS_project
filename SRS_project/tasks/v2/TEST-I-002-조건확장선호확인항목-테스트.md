---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-I-002: 조건 확장·선호·확인 항목 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- I-002(조건 점진적 확장·선호·확인 항목)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: I-002
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.1, 그대로 인용):
  - **AC-03-01(정상):** Given "A 또는 B가 첫 결과를 확인한 상태" / When "`더 좁히기`로 조건을 하나씩 추가함" / Then "추가한 조건을 즉시 현재 후보에 재적용한다" / SLO "조건 1개 추가당 재판정 1회"
  - **AC-03-02(경계):** Given "사용자가 이미 4개의 추가 조건을 등록한 상태" / When "5번째 조건을 추가하려 함" / Then "사용자당 4개를 초과하는 추가를 거부한다" / SLO "사용자당 상한 4개"
  - **AC-04-01(정상):** Given "사용자가 선호를 입력하는 상태" / When "자유 문장 0~3개를 등록함" / Then "사람 카드에 저장하고 매물별 판정에는 사용하지 않는다" / SLO "선호 상한 3개, 판정 반영 0건"
  - **AC-04-02(예외):** Given "사용자가 `확인 필요` 항목을 입력하는 상태" / When "항목을 등록함" / Then "방문 전 중개사 질문 목록으로 저장하며 방문 후 체크리스트와 동일 상태로 처리하지 않는다" / SLO "두 목록 간 항목 혼입 0건"

## ✅ Task Breakdown
- [ ] AC-03-01: 조건 추가 시 재판정이 정확히 1회 트리거됨을 검증(중복 트리거 없음)
- [ ] AC-03-02: 4개 등록된 상태에서 5번째 추가 시 거부됨을 검증
- [ ] AC-04-01: 선호 문장이 판정 쿼리 결과에 전혀 영향을 주지 않음을 검증(3개 상한 포함)
- [ ] AC-04-02: 확인 항목이 `BrokerQuestion`류 테이블에만 저장되고 `FieldRecord`류 테이블과 절대 혼입되지 않음을 검증

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-03-02: 4개 초과 조건 거부") {
  given: person with 4 existing requiredConditions
  when: addRequiredCondition(personId, 5th condition)
  then: throws error, requiredConditions.length remains 4
}

test("AC-04-01: 선호는 판정에 미반영") {
  given: person with 2 preferences saved
  when: judgment query executed for this person
  then: judgment result set is identical whether preferences exist or not (판정 로직이 preferences 필드를 참조하지 않음)
}

test("AC-04-02: 확인 항목과 방문 후 기록 분리") {
  given: person adds a confirmationItem
  when: queried
  then: stored only in confirmation-item storage, never appears in FieldRecord checklist storage
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-04-01의 "판정 반영 0건"은 정적 분석(선호 필드를 참조하는 평가기 코드가 없음)과 동적 테스트(같은 결과) 둘 다로 검증하는 것을 권장

## 🏁 Definition of Done (DoD)
- [ ] AC-03-01·02, AC-04-01·02 네 테스트 모두 작성되었는가?
- [ ] I-002 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: I-002 완료 처리
