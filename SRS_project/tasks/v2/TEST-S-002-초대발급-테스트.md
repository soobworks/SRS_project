---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-S-002: 초대 발급 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- S-002(초대 발급)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: S-002
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.2, 그대로 인용):
  - **AC-05-01(정상):** Given "A가 관계 유형을 선택한 상태" / When "공유를 실행함" / Then "초대 링크와 보조 코드를 발급하고 B 참여 전까지 대기 상태를 표시한다" / SLO "초대 수단 2종 발급률 100%"
  - **AC-05-02(경계):** Given "A가 이미 초대를 생성한 상태" / When "B가 참여함" / Then "B에게 같은 관계 유형을 다시 입력하도록 요구하지 않는다" / SLO "재질문 0건"

## ✅ Task Breakdown
- [ ] AC-05-01에 대한 테스트 작성: `inviteParticipant` 호출 시 링크·코드 둘 다 반환되고 `connectionStatus`가 대기 상태로 바뀜을 검증
- [ ] AC-05-02에 대한 테스트 작성: 이미 발급된 초대에 대해 관계 유형 입력 파라미터를 다시 요구하는 API 경로가 없음을 검증(S-003과의 계약 확인)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-05-01: 링크·코드 동시 발급") {
  given: SharedSpace with relationshipType selected
  when: inviteParticipant(spaceId, relationshipType)
  then: returns InviteBundle { linkUrl, code } both non-empty, SharedSpace.connectionStatus === "AWAITING_B"
}

test("AC-05-02: 재질문 없음") {
  given: Invite already issued for spaceId
  when: S-003의 B 맥락 조회 함수 시그니처를 확인함(별도 태스크지만 계약 확인 목적)
  then: 해당 함수는 relationshipType 파라미터를 받지 않음(재입력 통로 자체가 없음)
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-05-02는 이 태스크와 S-003의 경계에 걸친 테스트다 — S-003 구현 전이라면 계약(함수 시그니처) 레벨로만 우선 검증하고, S-003 완료 후 통합 테스트로 보강

## 🏁 Definition of Done (DoD)
- [ ] AC-05-01·02 두 테스트 모두 작성되었는가?
- [ ] S-002 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: S-002 완료 처리
