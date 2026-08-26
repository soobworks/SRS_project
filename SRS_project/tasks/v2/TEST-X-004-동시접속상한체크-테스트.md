---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-X-004: 동시접속자 상한 체크 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- X-004(동시접속자 상한 체크)의 완료 기준이 되는 테스트를 작성한다. **주의: 아래 시나리오는 원 SRS(`같이보기-srs-v1_0.md`) §9의 AC가 아니다** — v1 `TASK-015-NF011-동시접속상한.md`에서 이 프로젝트가 직접 정의한 시나리오를 그대로 승계한 것이다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: X-004
- 시나리오 원문(`SRS_project/tasks/TASK-015-NF011-동시접속상한.md`, v1에서 그대로 인용 — 원 SRS 인용 아님):
  - **Scenario 1(상한 이내 정상 초대):** Given "활성 공유 객체 수가 상한 이하인 상태" / When "A가 초대를 발송하려 함" / Then "`checkCapacityBeforeInvite`가 `available: true`를 반환하고 초대가 정상 진행된다"
  - **Scenario 2(상한 도달 시 저하):** Given "활성 공유 객체 수가 상한(N, 배포 전 확정)에 도달한 상태" / When "새로운 사용자가 초대를 시도함" / Then "새 기능을 만들지 않고 정원 초과 안내 화면으로 대체하며, 기존 활성 세션은 영향받지 않는다"

## ✅ Task Breakdown
- [ ] Scenario 1에 대한 테스트 작성: 상한 이하일 때 `available: true` 반환
- [ ] Scenario 2에 대한 테스트 작성: 상한 도달·초과 시 `available: false` 반환, 기존 세션 데이터는 변경되지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
test("Scenario 1: 상한 이내 정상") {
  given: N = 10 (테스트용 상한), 현재 활성 SharedSpace count = 5
  when: checkCapacityBeforeInvite()
  then: result.available === true
}

test("Scenario 2: 상한 도달 시 저하") {
  given: N = 10, 현재 활성 SharedSpace count = 10
  when: checkCapacityBeforeInvite()
  then: result.available === false
  and: 기존 10개 SharedSpace 레코드는 조회/수정에 영향 없음(COUNT 쿼리는 부수효과 없음)
}
```

## ⚙️ Technical & Non-Functional Constraints
- 상한 값 N은 테스트에서 환경변수/상수로 주입 가능하게 설계해, 실제 배포 상한이 확정되기 전에도 테스트가 독립적으로 동작하도록 한다

## 🏁 Definition of Done (DoD)
- [ ] Scenario 1·2 두 테스트 모두 작성되었는가?
- [ ] X-004 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: X-004 완료 처리
