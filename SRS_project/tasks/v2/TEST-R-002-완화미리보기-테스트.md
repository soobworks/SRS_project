---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-R-002: 완화 미리보기 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- R-002(완화 미리보기)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: R-002
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.4, 그대로 인용):
  - **AC-13-01(정상):** Given "사용자가 조건 완화 화면에 진입한 상태" / When "화면이 렌더링됨" / Then "A안·B안을 동시에 표시하며 완화폭은 실제 미달량을 기준으로 한다" / SLO "완화폭·미달량 불일치 0건"
  - **AC-13-02(정상):** Given "완화 화면이 열린 상태" / When "사용자가 슬라이더를 조작함" / Then "조건 변경 확정 전에 판정 등급 변화를 즉시 미리보기한다" / SLO "미리보기 시 경로 API 재호출 0회"
  - **AC-13-03(실패/경계):** Given "사용자가 완화 조작을 하는 상태" / When "두 조건을 동시에 완화하거나 미달량과 무관한 값을 입력함" / Then "이를 제시하거나 적용하지 않는다" / SLO "2조건 동시 완화 제안 0건"

## ✅ Task Breakdown
- [ ] AC-13-01에 대한 테스트 작성: 완화폭이 항상 실제 미달량과 일치함(임의 값 아님)
- [ ] AC-13-02에 대한 테스트 작성: 미리보기 호출 시 경로 API mock이 호출되지 않음(spy/mock 카운트 assertion)
- [ ] AC-13-03에 대한 테스트 작성: 2개 조건 동시 완화 입력 또는 미달량 초과 값 입력 시 거부됨

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
```

## ⚙️ Technical & Non-Functional Constraints
- AC-13-02는 mock 검증이 핵심 — 실제 route_cache/외부 API 클라이언트를 spy로 감싸 호출 횟수를 정확히 0으로 assertion

## 🏁 Definition of Done (DoD)
- [ ] AC-13-01~03 세 테스트 모두 작성되었는가?
- [ ] R-002 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: R-002 완료 처리
