---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-I-001: 기본 조건 입력 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- I-001(기본 조건 입력)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: I-001
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.1, 그대로 인용):
  - **AC-02-01(실패):** Given "예산이 입력되지 않은 상태" / When "A가 기본 입력을 완료하려 함" / Then "기본 입력 완료를 막는다" / SLO "예산 없이 완료 처리 0건"
  - **AC-02-02(정상):** Given "A가 예산을 입력한 상태" / When "출퇴근 여부를 질문하고 A가 `출근함`을 선택함" / Then "출근지와 이동수단 입력을 요청한다" / SLO "필수 입력 순서 위반 0건"
  - **AC-02-03(예외):** Given "A가 예산을 입력한 상태" / When "A가 `출근 안 함`을 선택함" / Then "출근지·이동수단을 요구하지 않고 통근·교통비를 판정에서 제외한다" / SLO "출근지 강제 요구 0건"

## ✅ Task Breakdown
- [ ] AC-02-01에 대한 테스트 작성: `budgetCap` 없이 `saveBudgetAndCommute` 호출 시 실패(예외 또는 검증 오류) 반환
- [ ] AC-02-02에 대한 테스트 작성: `commutes: true`일 때 `commuteOrigin`/`commuteMode`가 필수 검증에 포함됨
- [ ] AC-02-03에 대한 테스트 작성: `commutes: false`일 때 `commuteOrigin`/`commuteMode`가 null로 저장되고 요구되지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-02-01: 예산 없이는 저장 실패") {
  given: input = { budgetCap: undefined, commutes: false }
  when: saveBudgetAndCommute(personId, input)
  then: throws validation error, no Person row updated
}

test("AC-02-02: 출근함 선택 시 출근지 필수") {
  given: input = { budgetCap: 1_000_000, commutes: true, commuteOrigin: undefined }
  when: saveBudgetAndCommute(personId, input)
  then: throws validation error requiring commuteOrigin/commuteMode
}

test("AC-02-03: 출근 안 함 선택 시 강제 없음") {
  given: input = { budgetCap: 1_000_000, commutes: false }
  when: saveBudgetAndCommute(personId, input)
  then: succeeds, commuteOrigin === null, commuteMode === null
}
```

## ⚙️ Technical & Non-Functional Constraints
- 클라이언트·서버 양쪽 검증이 동일 규칙을 쓰는지 확인 — 서버 검증만 테스트로 커버하고 클라이언트 우회 가능성을 남기지 않는다

## 🏁 Definition of Done (DoD)
- [ ] AC-02-01~03 세 테스트 모두 작성되었는가?
- [ ] I-001 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: I-001 완료 처리
