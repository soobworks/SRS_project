---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-V-003: 매물 소진 처리 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- V-003(매물 소진 처리)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: V-003
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.5, 그대로 인용):
  - **AC-19-01(예외):** Given "후보 매물의 거래완료·삭제가 감지된 상태" / When "소진 감지가 처리됨" / Then "해당 매물을 제거하고 두 사용자에게 알리되 나머지 판정은 유지한다" / SLO "감지 후 즉시 제거(다음 판정 갱신 전 반영)"
  - **AC-19-02(실패/경계):** Given "소진된 매물이 이미 확정된 방문 후보였던 상태" / When "소진이 처리됨" / Then "남아 있는 방문 후보를 유지하고 비어 있는 한 자리 선택 단계로 되돌린다" / SLO "확정 후보 소진 시 전체 재선택 요구 0건"

## ✅ Task Breakdown
- [ ] AC-19-01에 대한 테스트 작성: 소진 감지 시 해당 매물이 후보 목록에서 제거되고 나머지 매물의 판정은 그대로 유지됨
- [ ] AC-19-02에 대한 테스트 작성: 확정된 방문 후보 2개 중 1개가 소진되면 나머지 1개는 유지된 채 남은 한 자리만 재선택 상태로 전환됨(전체 재선택 아님)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-19-01: 소진 매물 제거, 나머지 판정 유지") {
  given: SharedSpace with 5 listings, judgment results computed for all
  when: listing3 marked as exhausted
  then: listing3 removed from candidates, listing1/2/4/5 judgment results unchanged
}

test("AC-19-02: 확정 후보 소진 시 부분 재선택") {
  given: VisitSelection.finalCandidates = [listingA, listingB] (확정 상태)
  when: listingA marked as exhausted
  then: VisitSelection state transitions to REOPENED, listingB remains confirmed, only 1 slot re-enters selection (전체 재선택 아님)
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-19-01의 SLO는 V-003 문서에서 이미 "폴링 주기 이내"로 현실화됐음을 테스트 설명(주석)에도 반영 — "즉시"를 문자 그대로 밀리초 단위로 테스트하지 않는다

## 🏁 Definition of Done (DoD)
- [ ] AC-19-01·02 두 테스트 모두 작성되었는가?
- [ ] V-003 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: V-003 완료 처리
