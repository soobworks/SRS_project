---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-R-001: 양보 문장 생성 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- R-001(양보 문장 생성)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: R-001
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.4, 그대로 인용):
  - **AC-12-01(정상):** Given "사용자가 후보 상세에 진입한 상태" / When "조건별 실제값·기준값·미달량이 표시됨" / Then "`예산 → 통근 → 추가 필수①~④ → 확인 필요` 순서로 A/B를 나란히 표시한다" / SLO "조건 표시 순서 위반 0건"
  - **AC-12-02(경계):** Given "한쪽만 충족하는 후보의 미충족 조건이 3개 이상인 상태" / When "양보 문장을 생성함" / Then "고정 순서상 앞 2개만 문장에 넣고 나머지는 목록으로 표시하며, 이점이 없으면 `대신` 절을 만들지 않는다" / SLO "문장 내 조건 수 상한 2개"
  - **AC-12-03(실패):** Given "trade-off 상세 화면이 렌더링되는 상태" / When "사용자가 화면을 확인함" / Then "더 좋다는 결론·추천 배지·공동 적합도 총점을 표시하지 않는다" / SLO "결론·배지·총점 노출 0건"

## ✅ Task Breakdown
- [ ] AC-12-01에 대한 테스트 작성: 조건 표시 순서가 예산→통근→추가필수①~④→확인필요로 고정됨을 검증
- [ ] AC-12-02에 대한 테스트 작성: 미충족 조건 3개 이상일 때 문장에는 2개만 포함되고 나머지는 별도 목록임을 검증
- [ ] AC-12-03에 대한 테스트 작성: 생성된 문장/화면 데이터에 결론·배지·총점 필드가 전혀 없음을 검증

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-12-01: 조건 표시 순서 고정") {
  given: judgment results for budget, commute, condition①~④, confirmation-needed items
  when: generateCompromiseSentence(judgmentResults)
  then: result.orderedConditions === ["budget", "commute", "cond1", "cond2", "cond3", "cond4", "confirmationNeeded"] (이 순서 그대로)
}

test("AC-12-02: 미충족 3개 이상 시 문장 내 2개 상한") {
  given: 3개 이상의 UNMET conditions
  when: generateCompromiseSentence(judgmentResults)
  then: result.sentence에 포함된 조건 수 === 2, 나머지는 result.remainingList에만 존재
}

test("AC-12-03: 결론·배지·총점 필드 부재") {
  given: 임의의 trade-off 화면 데이터
  when: 데이터 구조를 검사함
  then: conclusion, badge, totalScore, compositeScore 등의 키가 어디에도 존재하지 않음
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-12-03은 R-001뿐 아니라 이 화면 전체(V-002 재사용 포함)에 걸친 검증이므로 통합 테스트로 확장할 것을 권장

## 🏁 Definition of Done (DoD)
- [ ] AC-12-01~03 세 테스트 모두 작성되었는가?
- [ ] R-001 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: R-001 완료 처리
