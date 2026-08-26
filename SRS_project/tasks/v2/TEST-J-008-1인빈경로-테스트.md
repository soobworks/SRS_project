---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-J-008: 1인 빈 경로 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- J-008(1인 빈 경로 조회)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: J-008
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.2, 그대로 인용):
  - **AC-09-01(정상):** Given "B가 참여하지 않았거나 조건을 입력하지 않은 상태" / When "A가 후보 목록에 접근함" / Then "A의 조건만 적용된 실부담·판정을 표시하며 진입을 막지 않는다" / SLO "B 미참여로 A 접근 차단 0건"
  - **AC-09-02(예외):** Given "1인 빈 경로에서 A가 `출근 안 함`을 선택한 상태" / When "후보별 결과가 표시됨" / Then "1인 입력만 반영한 결과임을 명시하고 통근·교통비 행을 표시하지 않는다" / SLO "1인분 전제 미표시 0건"

## ✅ Task Breakdown
- [ ] AC-09-01에 대한 테스트 작성: B 없이도 `getSoloJudgment`가 정상 결과를 반환하고 예외를 던지지 않음을 검증
- [ ] AC-09-02에 대한 테스트 작성: "출근 안 함" 선택 시 응답 결과에 통근 관련 필드가 아예 존재하지 않거나 NOT_APPLICABLE임을 검증

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-09-01: B 미참여 시 A 접근 차단 없음") {
  given: SharedSpace with only person A (no B)
  when: getSoloJudgment(personA.id)
  then: no exception thrown, returns JudgmentResultSet based on A's conditions only
}

test("AC-09-02: 출근 안 함 시 통근 행 미표시") {
  given: person A with commutes = false
  when: getSoloJudgment(personA.id) → render judgments page
  then: rendered result excludes commute/transport cost row entirely
}
```

## ⚙️ Technical & Non-Functional Constraints
- B가 존재하지 않는 상태를 "에러"가 아니라 "정상 입력"으로 다루는지가 핵심 assertion — 이 구분이 흐려지면 REQ-FUNC-009 자체가 무너진다

## 🏁 Definition of Done (DoD)
- [ ] AC-09-01·02 두 테스트 모두 작성되었는가?
- [ ] J-008 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: J-008 완료 처리
