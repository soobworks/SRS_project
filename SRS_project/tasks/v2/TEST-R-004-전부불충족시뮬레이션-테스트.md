---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-R-004: 전부 불충족 시뮬레이션 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- R-004(전부 불충족 시뮬레이션)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: R-004
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.4, 그대로 인용):
  - **AC-15-01(정상):** Given "`둘 다 충족`·`한쪽만 충족` 후보가 모두 0개인 상태" / When "완화 시뮬레이션을 실행함" / Then "한 번에 한 조건만 완화해 후보가 살아나면 해당 경로를 표시한다" / SLO "동시 완화 시도 조건 수 1개"
  - **AC-15-02(실패):** Given "조건을 하나씩 완화해도 후보가 살아나지 않는 상태" / When "시뮬레이션이 종료됨" / Then "완화 대신 재탐색 필터 제안 경로를 표시하며 2조건 동시 완화안은 제시하지 않는다" / SLO "2조건 동시 완화 제안 0건"

## ✅ Task Breakdown
- [ ] AC-15-01에 대한 테스트 작성: 조건 4개 중 1개씩 순차 완화 시도, 회복되는 첫 조건에서 경로 제시하고 중단
- [ ] AC-15-02에 대한 테스트 작성: 4개 조건 모두 개별 완화해도 회복 안 되는 경우 재탐색 경로로 전환되고, 어떤 시점에도 2개 조건이 동시에 완화 대상에 포함되지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-15-01: 1개씩 순차 완화, 회복 시 즉시 제시") {
  given: all candidates UNMET across budget/commute/cond1/cond2
  when: simulateOneByOne(candidates)
  then: 시뮬레이션 순서상 회복되는 첫 조건에서 result.relaxedCondition이 정확히 1개, result.recovered === true
}

test("AC-15-02: 전부 회복 불가 시 재탐색 전환, 2조건 동시 없음") {
  given: no single-condition relaxation recovers any candidate
  when: simulateOneByOne(candidates)
  then: result.recovered === false, result.nextStep === "SEARCH_FILTER"
  and: 시뮬레이션 이력 전체에서 동시에 완화 시도된 조건 수가 항상 1 이하
}
```

## ⚙️ Technical & Non-Functional Constraints
- "2조건 동시 완화 제안 0건"은 시뮬레이션 내부 상태를 로깅해 전수 검사하는 방식을 권장(모든 중간 스텝 assertion)

## 🏁 Definition of Done (DoD)
- [ ] AC-15-01·02 두 테스트 모두 작성되었는가?
- [ ] R-004 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: R-004 완료 처리
