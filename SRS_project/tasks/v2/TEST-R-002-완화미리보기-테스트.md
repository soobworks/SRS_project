---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-R-002: 완화 시뮬레이션 및 재탐색 필터 제안 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- R-002(완화 시뮬레이션 및 재탐색 필터 제안 — 미리보기 + 전부불충족 분기 + 검색 필터 변환)의 완료 기준이 되는 테스트를 작성한다. (2026-08-26: v2 R-002/R-004/R-005가 한 기능 Task로 병합되면서 이 테스트 companion도 함께 병합했다 — AC 7개와 테스트 내용은 변경 없음.)

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: R-002
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.4, 그대로 인용):
  - **AC-13-01(정상):** Given "사용자가 조건 완화 화면에 진입한 상태" / When "화면이 렌더링됨" / Then "A안·B안을 동시에 표시하며 완화폭은 실제 미달량을 기준으로 한다" / SLO "완화폭·미달량 불일치 0건"
  - **AC-13-02(정상):** Given "완화 화면이 열린 상태" / When "사용자가 슬라이더를 조작함" / Then "조건 변경 확정 전에 판정 등급 변화를 즉시 미리보기한다" / SLO "미리보기 시 경로 API 재호출 0회"
  - **AC-13-03(실패/경계):** Given "사용자가 완화 조작을 하는 상태" / When "두 조건을 동시에 완화하거나 미달량과 무관한 값을 입력함" / Then "이를 제시하거나 적용하지 않는다" / SLO "2조건 동시 완화 제안 0건"
  - **AC-15-01(정상):** Given "`둘 다 충족`·`한쪽만 충족` 후보가 모두 0개인 상태" / When "완화 시뮬레이션을 실행함" / Then "한 번에 한 조건만 완화해 후보가 살아나면 해당 경로를 표시한다" / SLO "동시 완화 시도 조건 수 1개"
  - **AC-15-02(실패):** Given "조건을 하나씩 완화해도 후보가 살아나지 않는 상태" / When "시뮬레이션이 종료됨" / Then "완화 대신 재탐색 필터 제안 경로를 표시하며 2조건 동시 완화안은 제시하지 않는다" / SLO "2조건 동시 완화 제안 0건"
  - **AC-16-01(정상):** Given "완화로 후보 회복이 불가능한 상태" / When "재탐색 필터를 제안함" / Then "`이 필터로 찾아보기`를 선택했을 때만 네이버 검색으로 이동시킨다" / SLO "자동 적용 0건"
  - **AC-16-02(경계):** Given "필터 제안이 생성되는 상태" / When "조건을 변환함" / Then "예산은 낮은 상한, 면적은 높은 하한, 역도보는 짧은 기준으로 변환하고 통근시간은 전달하지 않는다" / SLO "통근시간 필터 전달 0건"

## ✅ Task Breakdown

**① 완화 미리보기:**
- [ ] AC-13-01에 대한 테스트 작성: 완화폭이 항상 실제 미달량과 일치함(임의 값 아님)
- [ ] AC-13-02에 대한 테스트 작성: 미리보기 호출 시 경로 API mock이 호출되지 않음(spy/mock 카운트 assertion)
- [ ] AC-13-03에 대한 테스트 작성: 2개 조건 동시 완화 입력 또는 미달량 초과 값 입력 시 거부됨

**② 전부 불충족 분기 시뮬레이션:**
- [ ] AC-15-01에 대한 테스트 작성: 조건 4개 중 1개씩 순차 완화 시도, 회복되는 첫 조건에서 경로 제시하고 중단
- [ ] AC-15-02에 대한 테스트 작성: 4개 조건 모두 개별 완화해도 회복 안 되는 경우 재탐색 경로로 전환되고, 어떤 시점에도 2개 조건이 동시에 완화 대상에 포함되지 않음

**③ 재탐색 필터 변환:**
- [ ] AC-16-01에 대한 테스트 작성: `translateToSearchFilter` 호출만으로는 어떤 리다이렉트/네비게이션도 발생하지 않음(순수 데이터 반환)
- [ ] AC-16-02에 대한 테스트 작성: 반환된 `FilterUiSpec`에 예산·면적·역도보 필드는 있고 통근시간 필드는 절대 존재하지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-13-01: 완화폭 = 실제 미달량") {
  given: judgmentResult.gapAmount = "+150,000"
  when: previewRelaxation(personId, "budget", delta)
  then: preview.maxDelta === 150000 (미달량과 정확히 일치, 임의 상한 없음)
}

test("AC-13-02: 경로 API 재호출 0회") {
  given: naver-route API client is spied/mocked
  when: previewRelaxation 여러 번 호출(슬라이더 조작 시뮬레이션)
  then: routeApiSpy.callCount === 0
}

test("AC-13-03: 동시 완화·무관값 차단") {
  given: 이미 조건A 완화를 미리보기 중인 상태
  when: 조건B도 동시에 완화 시도
  then: throws or rejects, only single-condition relaxation ever applied
}

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

test("AC-16-01: 필터 생성은 이동을 유발하지 않음") {
  given: recovery impossible state
  when: translateToSearchFilter(spaceId)
  then: returns FilterUiSpec object only, no window.location/navigation side-effect triggered
}

test("AC-16-02: 통근시간 필터 제외, 나머지 방향 변환") {
  given: conditions with budget/area/walkToStation set
  when: translateToSearchFilter(spaceId)
  then: result.budget is upper-bound(lower value), result.area is lower-bound(higher value), result.walkToStation is upper-bound(shorter value)
  and: "commuteTime" key does not exist in result
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-13-02는 mock 검증이 핵심 — 실제 route_cache/외부 API 클라이언트를 spy로 감싸 호출 횟수를 정확히 0으로 assertion
- "2조건 동시 완화 제안 0건"은 시뮬레이션 내부 상태를 로깅해 전수 검사하는 방식을 권장(모든 중간 스텝 assertion)
- AC-16-01은 "자동 적용 0건"이 핵심이므로, 이 함수 자체가 순수 데이터 변환 함수이고 UI 이동 로직이 별도 클릭 핸들러에만 있는지 코드 구조로도 확인

## 🏁 Definition of Done (DoD)
- [ ] AC-13-01~03, AC-15-01·02, AC-16-01·02 총 7개 테스트가 모두 작성되었는가?
- [ ] R-002 구현 완료 후 전부 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001, C-002(③ 재탐색 필터 변환 검증에 필요)
- Blocks: R-002 완료 처리
