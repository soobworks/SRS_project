---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-J-009: 조건 자동 재적용 인수 조건 자동화"
labels: 'test, priority:medium'
assignees: ''
---

## 🎯 Summary
- J-009(조건 자동 재적용)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: J-009
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.5, 그대로 인용):
  - **AC-18-01(정상):** Given "A·B 조건이 사람에 저장된 상태" / When "새 매물을 추가하거나 기존 매물을 교체함" / Then "조건을 다시 입력하도록 요구하지 않는다" / SLO "매물 변경으로 인한 재입력 요구 0건"
  - **AC-18-02(정상):** Given "매물이 새로 추가된 상태" / When "판정이 실행됨" / Then "유지된 사람 조건을 새 매물에 자동 적용해 판정·미달량·확인 필요를 산출한다" / SLO "신규 매물 자동 판정률 100%"

## ✅ Task Breakdown
- [ ] AC-18-01에 대한 테스트 작성: 매물 추가 API 호출 경로에 조건 입력 파라미터가 필요 없음을(함수 시그니처 레벨에서) 검증
- [ ] AC-18-02에 대한 테스트 작성: 신규 매물 추가 직후 해당 매물에 대한 `JudgmentResult`가 자동으로 존재함을 검증

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-18-01: 매물 교체 시 조건 재입력 불필요") {
  given: Person with existing conditions, SharedSpace with 1 listing
  when: addListingToSharedSpace(spaceId, newListingId) — 이 함수는 condition 파라미터를 받지 않음
  then: 호출 성공, Person.requiredConditions 변경 없음
}

test("AC-18-02: 신규 매물 자동 판정") {
  given: 위 상태에서 매물 추가 완료
  when: reapplyConditions(personId, newListingId) 호출
  then: JudgmentResult가 personId+newListingId 조합으로 전부(4개 조건 타입) 존재함
}
```

## ⚙️ Technical & Non-Functional Constraints
- "재입력을 요구하지 않는다"는 음성 요구사항이라 테스트로 직접 검증하기 까다롭다 — 함수 시그니처에 condition 파라미터가 없다는 것 자체를 타입 레벨 assertion으로 확인하는 방식을 권장

## 🏁 Definition of Done (DoD)
- [ ] AC-18-01·02 두 테스트 모두 작성되었는가?
- [ ] J-009 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: J-009 완료 처리
