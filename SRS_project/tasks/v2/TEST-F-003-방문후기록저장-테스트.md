---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-F-003: 방문 후 기록 인수 조건 자동화"
labels: 'test, priority:low'
assignees: ''
---

## 🎯 Summary
- F-003(방문 후 기록 저장)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: F-003
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.7, 그대로 인용):
  - **AC-23-01(정상):** Given "방문이 완료된 상태" / When "기록 화면이 열림" / Then "공통 체크리스트 6항목을 모두 표시하며 항목 자체의 선택·삭제를 요구하지 않는다" / SLO "체크리스트 항목 6개 전부 표시"
  - **AC-23-02(예외):** Given "사용자가 체크리스트와 상태를 입력하는 상태" / When "`유지·보류·제외` 중 하나를 선택함" / Then "매물의 방문 후 사용자 생성 기록으로 저장하고 방문 전 `확인 필요` 기록과 분리한다" / SLO "방문 전/후 기록 혼입 0건"

## ✅ Task Breakdown
- [ ] AC-23-01에 대한 테스트 작성: 체크리스트 렌더링 시 항상 정확히 6항목이 표시되고, 항목 추가/삭제 UI가 없음
- [ ] AC-23-02에 대한 테스트 작성: `saveFieldRecord` 호출 후 `FieldRecord` 테이블에만 저장되고 `BrokerQuestion` 테이블은 전혀 영향받지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-23-01: 체크리스트 6항목 고정") {
  given: 방문 완료 상태
  when: render field-record 화면
  then: checklist.length === 6, 항목 추가/삭제 버튼이 DOM에 없음
}

test("AC-23-02: 방문 전/후 기록 분리 저장") {
  given: listing has existing BrokerQuestion records
  when: saveFieldRecord(listingId, checklist, "KEEP")
  then: FieldRecord row created/updated, BrokerQuestion rows unchanged(count, content 동일)
}
```

## ⚙️ Technical & Non-Functional Constraints
- 체크리스트 6항목의 구체적 항목명(층간소음 등)은 원 SRS ERD(`FIELD_RECORD.checklist`)를 그대로 따르고 임의로 추가·변경하지 않는다

## 🏁 Definition of Done (DoD)
- [ ] AC-23-01·02 두 테스트 모두 작성되었는가?
- [ ] F-003 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: F-003 완료 처리
