---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-S-003: B 맥락 조회 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- S-003(B의 맥락 있는 진입)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: S-003
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.2, 그대로 인용):
  - **AC-06-01(정상):** Given "B가 유효한 링크·코드를 받은 상태" / When "참여를 시도함" / Then "B의 조건 입력 화면보다 먼저 후보 최대 5개와 A 선호 카드를 표시한다" / SLO "초대 클릭 → B 첫 화면 응답 30초 이내(P95)"
  - **AC-06-02(실패):** Given "초대 링크·코드가 만료·존재하지 않는 상태" / When "B가 참여를 시도함" / Then "후보·선호 카드를 노출하지 않고 만료·오류 상태를 표시한다" / SLO "무효 초대로 후보 노출 0건"

## ✅ Task Breakdown
- [ ] AC-06-01에 대한 테스트 작성: 유효 초대 코드로 `getContextForB` 호출 시 후보·선호 카드가 조건 입력 폼보다 먼저 렌더링됨(렌더 순서 assertion)
- [ ] AC-06-02에 대한 테스트 작성: 만료/존재하지 않는 코드로 호출 시 후보·선호 데이터가 응답에 전혀 포함되지 않음

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-06-01: 유효 초대 시 맥락 우선 표시") {
  given: valid, non-expired invite code
  when: getContextForB(spaceId)
  then: returns { listings: [...max 5], preferences: [...] }, no condition input required to view
}

test("AC-06-02: 무효 초대 시 데이터 비노출") {
  given: expired or non-existent invite code
  when: getContextForB(spaceId)
  then: returns error state, listings/preferences fields are absent or empty (not partially leaked)
}
```

## ⚙️ Technical & Non-Functional Constraints
- P95 ≤ 30초 SLO(AC-06-01)는 단위 테스트만으로 검증하기 어려움 — 로컬 환경 수동 측정을 병행하고, 배포 후 실측은 D-001(모니터링)에서 다룬다

## 🏁 Definition of Done (DoD)
- [ ] AC-06-01·02 두 테스트 모두 작성되었는가?
- [ ] S-003 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: S-003 완료 처리
