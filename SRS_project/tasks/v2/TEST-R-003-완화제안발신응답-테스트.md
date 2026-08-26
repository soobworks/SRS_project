---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-R-003: 완화 제안 발신·응답 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- R-003(완화 제안 발신·응답)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: R-003
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.4, 그대로 인용):
  - **AC-14-01(정상):** Given "사용자가 상대 조건을 바꾸고 싶은 상태" / When "완화를 요청함" / Then "직접 변경하지 않고 상대에게 변경 제안을 발송한다" / SLO "제안자에 의한 직접 변경 0건"
  - **AC-14-02(예외):** Given "제안이 상대에게 도착한 상태" / When "상대가 수락 또는 거절함" / Then "수락 시에만 조건을 갱신·재판정하고 수락 전까지는 적용하지 않는다" / SLO "미수락 제안의 판정 반영 0건"

## ✅ Task Breakdown
- [ ] AC-14-01에 대한 테스트 작성: `proposeRelaxation` 호출이 `Person.requiredConditions`를 직접 변경하지 않고 `RelaxationProposal` 레코드만 생성함
- [ ] AC-14-02에 대한 테스트 작성: PENDING 상태에서는 판정 결과가 변경 전과 동일하며, ACCEPTED 후에만 재판정됨. REJECTED 시 판정 결과가 변경 전과 동일함

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-14-01: 제안만 생성, 직접 변경 없음") {
  given: person A wants to relax person B's condition
  when: proposeRelaxation(A.id, B.id, conditionKey)
  then: RelaxationProposal created with status PENDING, Person(B).requiredConditions unchanged
}

test("AC-14-02: 수락 전 미적용, 수락 후 갱신") {
  given: RelaxationProposal in PENDING state
  when: query judgment before response
  then: judgment unaffected by pending proposal

  when: respondToRelaxationProposal(proposalId, "ACCEPTED")
  then: Person(B).requiredConditions updated, related JudgmentResult recomputed via J-002

  (별도 케이스) when: respondToRelaxationProposal(proposalId, "REJECTED")
  then: Person(B).requiredConditions unchanged, judgment unaffected
}
```

## ⚙️ Technical & Non-Functional Constraints
- "제안자에 의한 직접 변경 0건"은 API 표면(함수 목록) 전체를 훑어 제안자가 호출 가능한 조건 변경 함수가 없는지도 정적으로 확인할 것

## 🏁 Definition of Done (DoD)
- [ ] AC-14-01·02 두 테스트 모두 작성되었는가?
- [ ] R-003 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: R-003 완료 처리
