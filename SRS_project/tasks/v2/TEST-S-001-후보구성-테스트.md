---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-S-001: 후보 구성 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- S-001(후보 구성)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: S-001
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.1, 그대로 인용):
  - **AC-01-01(정상):** Given "A가 `같이 고르기`에 진입한 상태" / When "관심매물 중 1~5개를 선택함" / Then "선택한 매물 ID만 포함한 공유 객체 초안을 구성한다" / SLO "후보 상한 5개"
  - **AC-01-02(경계):** Given "이미 5개가 선택된 상태" / When "A가 6개째 매물을 추가하려 함" / Then "해당 매물을 초안에 추가하지 않고 최대 5개 제한을 표시한다" / SLO "6개째 추가 성공 0건"

## ✅ Task Breakdown
- [ ] AC-01-01에 대한 테스트 작성: 1~5개 listingIds로 정상 SharedSpace 생성
- [ ] AC-01-02에 대한 테스트 작성: 6개 listingIds 전달 시 서버 레벨에서 거부(클라이언트 우회 가정)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-01-01: 1~5개 후보로 정상 구성") {
  given: listingIds = [id1..id5] (5개, 목업 픽스처)
  when: createSharedSpaceDraft(listingIds)
  then: SharedSpace 생성됨, ListingRef 5건 정확히 연결됨
}

test("AC-01-02: 6개째 서버 레벨 차단") {
  given: listingIds = [id1..id6] (6개)
  when: createSharedSpaceDraft(listingIds)
  then: throws validation error, SharedSpace가 생성되지 않거나 5개만 연결됨(6번째 거부)
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-01-02는 클라이언트 검증 우회를 가정하므로 반드시 Server Action 레벨(서버 측)에서 테스트할 것 — UI 레벨 차단만으로는 이 AC를 충족하지 못한다

## 🏁 Definition of Done (DoD)
- [ ] AC-01-01·02 두 테스트 모두 작성되었는가?
- [ ] S-001 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001, C-002
- Blocks: S-001 완료 처리
