---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-J-001: 예산 평가기 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- 이 Task의 유일한 목적은 J-001(예산 평가기)의 로직이 작성되기 전(또는 직후) 아래 AC를 실패하는 단위 테스트로 먼저 작성하는 것이다. J-001의 완료 기준은 "이 테스트가 전부 통과하는가"로 정의된다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: J-001(예산 평가기)
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.3, 그대로 인용):
  - **AC-10a-01(정상):** Given "사람의 예산 조건과 후보 실부담이 계산 가능한 상태" / When "조건 또는 후보가 추가·수정됨" / Then "예산 상한과 실부담을 비교해 충족 또는 미충족(미달량 포함)을 산출한다" / SLO "조건·후보 변경 후 다음 화면 전환 전 반영"
  - **AC-10a-02(실패):** Given "실부담 계산에 필요한 데이터가 누락된 상태" / When "예산 판정을 시도함" / Then "`미충족`이 아니라 `계산 불가`로 표시한다" / SLO "미충족/계산불가 오분류 0건"

## ✅ Task Breakdown
- [ ] AC-10a-01에 대한 단위 테스트 작성: 예산 상한·실부담이 모두 유효한 값일 때 MET/UNMET(미달량 포함)이 산출되는지 검증
- [ ] AC-10a-02에 대한 단위 테스트 작성: 실부담 계산 필요 데이터가 없을 때 반드시 CALCULATION_FAILED이며 UNMET이 아님을 검증(오분류 회귀 테스트)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-10a-01: 예산 정상 판정") {
  given: condition.budgetCap = 1_500_000, actualCost = 1_400_000 (계산 가능)
  when: evaluateBudget(condition, actualCost)
  then: result.status === "MET"
  // 반대 케이스도 함께: actualCost = 1_600_000 → status === "UNMET", gapAmount = "+100,000"
}

test("AC-10a-02: 데이터 누락 시 계산 불가, 미충족 아님") {
  given: actualCost = undefined (실부담 계산 불가 데이터)
  when: evaluateBudget(condition, actualCost)
  then: result.status === "CALCULATION_FAILED"
  and: result.status !== "UNMET"  // 오분류 회귀 방지 — 이 assertion이 핵심
}
```

## ⚙️ Technical & Non-Functional Constraints
- 이 테스트는 J-001의 구현이 시작되기 **전에** 작성되어 실패(Red) 상태여야 한다(TDD). 구현 완료 후 반드시 통과(Green)해야 J-001을 완료로 처리한다
- AC-10a-02는 **볼드체(실패 유형) AC**다 — 정상 케이스만 테스트하고 넘어가지 않도록 리뷰에서 이 테스트의 존재를 반드시 확인한다

## 🏁 Definition of Done (DoD)
- [ ] AC-10a-01·02 두 개 모두에 대한 테스트가 작성되었는가?
- [ ] J-001 구현 완료 후 두 테스트가 모두 통과하는가?
- [ ] "미충족"과 "계산 불가"를 구분하는 assertion이 명시적으로 포함되어 있는가(단순히 status가 있다는 것만 확인하지 않는가)?

## 🚧 Dependencies & Blockers
- Depends on: C-001(타입 계약)
- Blocks: J-001의 완료 처리(이 테스트가 통과해야 J-001이 Done)
