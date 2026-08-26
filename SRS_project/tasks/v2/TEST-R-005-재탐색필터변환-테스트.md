---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-R-005: 재탐색 필터 변환 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- R-005(재탐색 필터 변환)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: R-005
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.4, 그대로 인용):
  - **AC-16-01(정상):** Given "완화로 후보 회복이 불가능한 상태" / When "재탐색 필터를 제안함" / Then "`이 필터로 찾아보기`를 선택했을 때만 네이버 검색으로 이동시킨다" / SLO "자동 적용 0건"
  - **AC-16-02(경계):** Given "필터 제안이 생성되는 상태" / When "조건을 변환함" / Then "예산은 낮은 상한, 면적은 높은 하한, 역도보는 짧은 기준으로 변환하고 통근시간은 전달하지 않는다" / SLO "통근시간 필터 전달 0건"

## ✅ Task Breakdown
- [ ] AC-16-01에 대한 테스트 작성: `translateToSearchFilter` 호출만으로는 어떤 리다이렉트/네비게이션도 발생하지 않음(순수 데이터 반환)
- [ ] AC-16-02에 대한 테스트 작성: 반환된 `FilterUiSpec`에 예산·면적·역도보 필드는 있고 통근시간 필드는 절대 존재하지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
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
- AC-16-01은 "자동 적용 0건"이 핵심이므로, 이 함수 자체가 순수 데이터 변환 함수이고 UI 이동 로직이 별도 클릭 핸들러에만 있는지 코드 구조로도 확인

## 🏁 Definition of Done (DoD)
- [ ] AC-16-01·02 두 테스트 모두 작성되었는가?
- [ ] R-005 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001, C-002
- Blocks: R-005 완료 처리
