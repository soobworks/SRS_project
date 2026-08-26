---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-X-001: 숫자 전제 공개 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- X-001(숫자 전제 공개)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: X-001
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.6, 그대로 인용):
  - **AC-21-01(정상):** Given "실부담·교통비·금리 기반 수치를 표시하는 상태" / When "화면이 렌더링됨" / Then "각 수치와 함께 계산 기준 시점·가정·적용 한계를 표시한다" / SLO "전제 없는 숫자 노출 0건"
  - **AC-21-02(실패/경계):** Given "계산에 필요한 값·기준이 없는 상태" / When "수치를 산출하려 함" / Then "확정값 대신 `계산 불가` 또는 `확인 필요`로 구분해 표시한다" / SLO "미확정 수치의 확정값 표시 0건"

## ✅ Task Breakdown
- [ ] AC-21-01에 대한 테스트 작성: `DisclosedValue`로 렌더링된 모든 숫자에 기준 시점·가정·한계 메타데이터가 함께 존재함
- [ ] AC-21-02에 대한 테스트 작성: 값이 없을 때 숫자 대신 CALCULATION_FAILED/CONFIRMATION_NEEDED 배지가 렌더링되고 확정값처럼 보이는 텍스트가 없음

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-21-01: 전제 없는 숫자 노출 0건") {
  given: <DisclosedValue value={1500000} basis="2026-06" assumption="..." />
  when: render
  then: DOM에 숫자와 함께 basis/assumption 텍스트가 반드시 함께 존재
}

test("AC-21-02: 미확정 수치는 확정값처럼 표시되지 않음") {
  given: <DisclosedValue value={undefined} status="CALCULATION_FAILED" />
  when: render
  then: 숫자 형식(원화 표기 등)이 아니라 "계산 불가" 배지만 표시됨
}
```

## ⚙️ Technical & Non-Functional Constraints
- "전제 없는 숫자 노출 0건"은 J-006·R-001 화면 전체에 대한 스냅샷 테스트로 전수 검사하는 것을 권장(개별 컴포넌트 단위 테스트 + 통합 스냅샷 이중 검증)

## 🏁 Definition of Done (DoD)
- [ ] AC-21-01·02 두 테스트 모두 작성되었는가?
- [ ] X-001 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: X-001 완료 처리
