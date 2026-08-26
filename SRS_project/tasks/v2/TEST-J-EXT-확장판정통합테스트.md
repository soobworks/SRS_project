---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-J-EXT: 확장 조건 판정·그룹화·5분류 통합 인수 조건 자동화"
labels: 'test, priority:critical'
assignees: ''
---

## 🎯 Summary
- 이 Task는 J-003(확장 조건 평가기 3종: 하한형·유무형·일치형)과 J-006(5분류 상태 분류 및 후보 그룹화) 2개 기능 Task가 **공동으로** 충족해야 하는 통합 인수 조건을 테스트로 작성한다. 하나의 companion으로 묶은 이유: 이 8개 AC는 4개 평가기가 함께 있어야만 의미 있게 검증되는 통합 동작(예: "4개 조건 유형 전체 지원")이기 때문이다. (2026-08-26: v2 J-003~007 5개 기능 Task가 J-003·J-006 2개로 병합되면서 이 테스트 companion의 대상도 함께 갱신했다 — AC 8개와 테스트 내용 자체는 변경 없음.)
- 추가로, N-006(ConditionType 확장성 회귀 테스트, 원 SRS AC 아님)이 이 테스트 스위트에 흡수되어 아래 9번째 케이스로 포함된다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: **J-003**(확장 조건 평가기 3종), **J-006**(5분류 상태 분류 및 후보 그룹화)
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.3, 그대로 인용):
  - **AC-10b-01(정상):** Given "FR-10a 판정이 선행 완료된 상태" / When "추가 필수 조건(0~4개)을 설정함" / Then "조건 유형에 맞는 연산으로 충족·미충족·미달량을 산출한다" / SLO "4개 조건 유형 전체 지원"
  - **AC-10b-02(실패):** Given "매물 데이터에 판정 필요 필드가 없는 상태" / When "해당 조건을 판정하려 함" / Then "`확인 필요`로 분리하고 `미충족`으로 처리하지 않는다" / SLO "데이터 부재 항목의 미충족 오분류 0건"
  - **AC-10b-03(경계):** Given "사람 조건이나 후보가 추가·수정된 상태" / When "6개 판정 항목 전체가 재계산됨" / Then "어떤 조건 조합에서도 공동 총점을 생성하지 않는다" / SLO "총점 생성 0건"
  - **AC-20-01(정상):** Given "실제값이 계산된 상태" / When "값이 사용자 기준에 못 미침" / Then "`미충족`으로 표시하고 실제 미달량을 함께 보여준다" / SLO "미달량 표시율 100%"
  - **AC-20-02(실패):** Given "경로·데이터 계산을 시도한 상태" / When "계산이 실패하거나 데이터가 없어 확인이 필요함" / Then "각각 `계산 불가`·`확인 필요`로 표시하고 `미충족`으로 분류하지 않는다" / SLO "4개 상태 간 오분류 0건"
  - **AC-20-03(예외):** Given "사용자가 `출근 안 함`을 선택한 상태" / When "비교표가 렌더링됨" / Then "통근을 `해당 없음`으로 처리해 통근 행을 표시하지 않는다" / SLO "해당없음/계산불가 오분류 0건"
  - **AC-11-01(정상):** Given "A·B의 현재 입력이 판정에 반영된 상태" / When "후보 목록을 조회함" / Then "각 후보를 `둘 다 충족`·`한쪽만 충족`·`둘 다 불충족` 중 하나로 표시한다" / SLO "그룹 분류 3종, 미분류 후보 0건"
  - **AC-11-02(예외):** Given "확인이 필요한 후보가 존재하는 상태" / When "목록이 렌더링됨" / Then "최소 수준의 `확인 필요` 배지를 별도로 표시하고 종합 판정으로 대체하지 않는다" / SLO "확인 필요를 종합 판정으로 대체한 사례 0건"
- N-006 대상 시나리오(원 SRS AC 아님 — 이 프로젝트가 REQ-NF-007 기반으로 직접 정의): "신규 5번째 ConditionType을 추가할 때 `ConditionTypeRegistry` 등록 1줄 외의 기존 코드(평가기·분류기·그룹화 로직)를 전혀 수정하지 않아도 되는가?"

## ✅ Task Breakdown
- [ ] AC-10b-01: 4개 조건 유형(상한·하한·유무·일치) 각각에 대해 판정이 산출되는 통합 테스트 작성
- [ ] AC-10b-02: 매물 데이터 필드 부재 시 CONFIRMATION_NEEDED이고 UNMET이 아님을 검증하는 테스트 작성(4개 타입 각각에 대해)
- [ ] AC-10b-03: 6개 판정 항목이 재계산돼도 결과 객체에 "총점"·"합산 점수" 필드가 어디에도 존재하지 않음을 검증하는 회귀 테스트 작성(타입 레벨 + 런타임 assertion)
- [ ] AC-20-01: UNMET 판정 시 gapAmount가 항상 채워짐을 검증
- [ ] AC-20-02: CALCULATION_FAILED와 CONFIRMATION_NEEDED가 서로 다른 조건에서 각각 발생하며 UNMET으로 흡수되지 않음을 검증
- [ ] AC-20-03: "출근 안 함" 선택 시 통근 조건이 NOT_APPLICABLE이며 UI 행 자체가 없음을 검증
- [ ] AC-11-01: 2인(A·B) 판정 결과 조합이 3분류(BOTH_MET/ONE_SIDE_MET/BOTH_UNMET) 중 정확히 하나로 귀결됨을 검증
- [ ] AC-11-02: CONFIRMATION_NEEDED 포함 후보가 3분류 중 하나로 억지로 흡수되지 않고 별도 배지 데이터를 가짐을 검증
- [ ] **N-006(신규): 5번째 ConditionType(가상의 예: `RANGE`) 추가 시 `ConditionTypeRegistry` 등록 1줄 외 기존 파일 변경이 0건인지 검증하는 확장성 회귀 테스트 작성**

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-10b-01: 4개 조건 유형 전체 지원") {
  for each type in [UPPER_BOUND, LOWER_BOUND, PRESENCE, EXACT_MATCH]:
    given: valid condition + valid listing attribute for that type
    when: ConditionTypeRegistry.resolve(type).evaluate(...)
    then: result.status is one of [MET, UNMET] with correct gapAmount when UNMET
}

test("AC-10b-02: 데이터 부재는 확인 필요, 미충족 아님") {
  given: listing attribute missing for a given condition type
  when: evaluate
  then: result.status === "CONFIRMATION_NEEDED"
  and: result.status !== "UNMET"
}

test("AC-10b-03: 총점 필드 부재 회귀 테스트") {
  given: 6개 판정 항목이 모두 계산된 JudgmentResult[] 배열
  when: candidateGroupClassifier(results) 호출
  then: 반환 객체 어디에도 totalScore, compositeRank, matchScore 등 합산 필드가 존재하지 않음 (키 목록 assertion)
}

test("AC-20-02: 계산불가/확인필요/미충족 3상태 상호 배타") {
  given: 계산 실패 케이스, 데이터 부재 케이스, 정상 미충족 케이스 각각
  when: statusClassifier 적용
  then: 각각 CALCULATION_FAILED, CONFIRMATION_NEEDED, UNMET로 서로 겹치지 않게 분류됨
}

test("AC-11-02: 확인 필요 배지는 3분류와 별개") {
  given: 한 후보의 일부 조건이 CONFIRMATION_NEEDED인 상태
  when: candidateGroupClassifier(results) 호출
  then: result.group은 3분류 중 하나이면서 동시에 result.needsConfirmationBadge === true (별도 필드)
}

test("N-006: 5번째 조건 타입 추가 시 레지스트리 등록만으로 확장 가능") {
  given: 가상의 새 ConditionType(예: RANGE)과 그 평가기 파일 하나만 신규 작성됨
  when: ConditionTypeRegistry.register(RANGE, newEvaluator) 한 줄만 evaluators/index.ts에 추가
  then: status-classifier.ts, candidate-group-classifier.ts, J-001의 persist-judgment-result.ts 등 기존 파일은 diff가 0줄
}
```

## ⚙️ Technical & Non-Functional Constraints
- 이 테스트들은 J-003·J-006 구현이 완료되기 전에 우선 작성되어 실패 상태여야 한다(가능한 범위에서 TDD)
- AC-10b-03(총점 금지)은 이 프로젝트의 최상위 제품 원칙(`decisions/0001`)과 직결되므로, 단순 존재 여부 assertion이 아니라 "관련 PR마다 이 테스트가 실행되는지"를 CI 필수 체크로 등록할 것을 권고
- N-006 케이스는 원 SRS §9의 AC가 아니라 REQ-NF-007(조건 타입 확장성)을 이 프로젝트가 직접 시나리오화한 것임에 유의

## 🏁 Definition of Done (DoD)
- [ ] 8개 원 SRS AC(AC-10b-01~03, AC-20-01~03, AC-11-01·02) + N-006 확장성 케이스, 총 9개에 대한 테스트가 작성되었는가?
- [ ] J-003·J-006 구현 완료 후 9개 테스트가 모두 통과하는가?
- [ ] 볼드체(실패/경계/예외) AC(AC-10b-02, AC-10b-03, AC-20-02, AC-20-03, AC-11-02) 테스트가 빠짐없이 포함됐는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001(타입 계약)
- Blocks: J-003, J-006의 완료 처리(이 테스트들이 통과해야 해당 Task들이 Done)
