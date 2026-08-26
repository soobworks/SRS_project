---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-F-BROKER: 중개사 질문·답변 통합 인수 조건 자동화"
labels: 'test, priority:low'
assignees: ''
---

## 🎯 Summary
- F-001(질문 조회)과 F-002(답변 기록)이 공동으로 충족해야 하는 인수 조건을 테스트로 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: F-001, F-002
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.7, 그대로 인용):
  - **AC-22-01(정상):** Given "단계 2 진입 시 `확인 필요` 항목이 있는 상태" / When "화면이 열림" / Then "해당 항목을 방문 전 중개사 질문 목록으로 표시한다" / SLO "확인 필요 항목의 질문화율 100%"
  - **AC-22-02(정상):** Given "중개사 질문 목록이 표시된 상태" / When "사용자가 답변을 기록함" / Then "답변을 매물·질문에 연결해 저장하고 보류 상태를 갱신하며, 답변 없는 항목은 `확인 필요`로 유지한다" / SLO "미답변 항목의 상태 임의 변경 0건"
  - **AC-22-03(경계):** Given "중개사 질문 카드가 렌더링되는 상태" / When "화면을 구성함" / Then "방문 후 공통 체크리스트를 섞어 표시하지 않는다" / SLO "두 목록 혼합 표시 0건"

## ✅ Task Breakdown
- [ ] AC-22-01: `confirmationItems`로 저장된 항목 전부가 `getBrokerQuestions` 조회 결과에 1:1로 나타남을 검증
- [ ] AC-22-02: `recordBrokerAnswer` 호출 후 해당 질문만 상태가 갱신되고, 답변하지 않은 나머지 질문은 상태 불변임을 검증
- [ ] AC-22-03: F-001·F-002가 다루는 데이터(`BrokerQuestion`)와 F-003이 다루는 데이터(`FieldRecord`)가 별도 쿼리·별도 컴포넌트임을 검증(타입/모듈 레벨 assertion)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-22-01: 확인필요 항목의 질문화율 100%") {
  given: person with 3 confirmationItems
  when: getBrokerQuestions(listingId)
  then: 3개 항목 전부가 BrokerQuestion 목록에 존재(질문화율 100%)
}

test("AC-22-02: 답변 기록, 미답변 항목 보존") {
  given: 3개 질문 중 1개만 답변
  when: recordBrokerAnswer(question1.id, "답변내용")
  then: question1.status 갱신, question2/3.status는 여전히 PENDING("확인 필요")
}

test("AC-22-03: 두 목록 혼합 표시 0건") {
  given: F-001/F-002 화면과 F-003 화면
  when: 각 화면의 데이터 소스를 확인함
  then: BrokerQuestion 쿼리와 FieldRecord 쿼리가 서로 다른 컴포넌트/함수에서만 사용됨(코드 레벨 분리 확인)
}
```

## ⚙️ Technical & Non-Functional Constraints
- 없음(표준 CRUD 수준의 검증)

## 🏁 Definition of Done (DoD)
- [ ] AC-22-01~03 세 테스트 모두 작성되었는가?
- [ ] F-001·F-002 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: F-001, F-002 완료 처리
