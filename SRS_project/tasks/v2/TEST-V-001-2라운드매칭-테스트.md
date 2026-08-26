---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-V-001: 2라운드 매칭 인수 조건 자동화"
labels: 'test, priority:critical'
assignees: ''
---

## 🎯 Summary
- V-001(2라운드 매칭)의 완료 기준이 되는 테스트를 작성한다. **North Star 달성 로직이므로 이 프로젝트에서 가장 신중하게 검증해야 할 테스트 중 하나.**

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: V-001
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.5, 그대로 인용):
  - **AC-17-01(정상):** Given "선택 가능한 후보가 2개 이상인 상태" / When "A·B가 각각 후보 2개를 선택하고 일치함" / Then "그 2개를 방문 후보로 확정한다" / SLO "일치 2개 시 확정까지 0라운드 추가"
  - **AC-17-02(예외):** Given "일치 후보가 1개인 상태" / When "남은 한 자리의 조건 차이가 표시됨" / Then "일치한 후보를 유지하고 한 번 더 선택하게 한다" / SLO "추가 라운드 1회 이내"
  - **AC-17-03(실패/경계):** Given "일치 후보가 0개이거나 최대 2라운드 후에도 불일치하는 상태" / When "라운드가 종료됨" / Then "각자가 선택한 한 곳씩을 방문 후보로 구성하며 투표·순위·자동 선택으로 대체하지 않는다" / SLO "라운드 상한 2회, 무한 대기 0건"

## ✅ Task Breakdown
- [ ] AC-17-01에 대한 테스트 작성: 2개 완전 일치 시 0라운드로 즉시 확정
- [ ] AC-17-02에 대한 테스트 작성: 1개 일치 시 1라운드 추가되고 일치한 1개는 유지됨
- [ ] AC-17-03에 대한 테스트 작성: 0개 일치 또는 2라운드 후에도 불일치 시 각자 1순위로 분할 확정(무한 루프 없음)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-17-01: 2개 일치 즉시 확정") {
  given: A selects [listing1, listing2], B selects [listing1, listing2]
  when: submitVisitSelection for both
  then: VisitSelection.round === 1, finalCandidates === [listing1, listing2], no additional round triggered
}

test("AC-17-02: 1개 일치 시 재라운드") {
  given: A selects [listing1, listing2], B selects [listing1, listing3]
  when: submitVisitSelection for both
  then: round advances to 2, listing1 is locked in, remaining slot re-opened for selection
}

test("AC-17-03: 0개 일치 및 2라운드 초과 시 분할 종료") {
  given: A and B select completely different listings across 2 rounds, never converging
  when: round 2 completes without match
  then: finalCandidates = [A's 1st choice, B's 1st choice] (split), round never exceeds 2, no infinite loop, no voting/ranking logic invoked
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-17-03의 "투표·순위·자동 선택으로 대체하지 않는다"는 제약은 코드 리뷰 assertion으로도 이중 검증할 것(예: 분할 로직에 정렬/점수 계산 코드가 없는지)
- 라운드 상한 2회를 넘는 입력이 들어와도 시스템이 죽지 않고 강제로 분할 종료되는지(방어적 테스트) 추가

## 🏁 Definition of Done (DoD)
- [ ] AC-17-01~03 세 테스트 모두 작성되었는가?
- [ ] V-001 구현 완료 후 통과하는가?
- [ ] 무한 루프 방지 테스트(라운드 3 강제 시도)가 포함됐는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: V-001 완료 처리, 1-A 게이트 통과 판정
