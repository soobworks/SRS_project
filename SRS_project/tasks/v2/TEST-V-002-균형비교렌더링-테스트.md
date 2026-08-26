---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-V-002: 균형 비교 렌더링 인수 조건 자동화"
labels: 'test, priority:high'
assignees: ''
---

## 🎯 Summary
- V-002(균형 비교 렌더링)의 완료 기준이 되는 테스트를 작성한다.

## 🔗 References (Spec & Context)
- 짝이 되는 기능 Task: V-002
- 원 SRS AC 원문(`같이보기-srs-v1_0.md` §9.6, 그대로 인용):
  - **AC-25-01(정상):** Given "판정·trade-off·최종 비교 화면이 렌더링되는 상태" / When "화면이 구성됨" / Then "A·B의 조건을 동일한 순서·시각적 비중으로 표시하며 한쪽을 우선 배치하지 않는다" / SLO "A/B 비대칭 배치 0건"
  - **AC-25-02(실패/경계):** Given "위 화면들이 렌더링되는 상태" / When "두 사람의 조건을 표시함" / Then "공동 적합도·총점·일치율로 합산하지 않고 추천 배지·복합 순위·AI 최종 선택을 표시하지 않는다" / SLO "총점·추천배지·복합순위 노출 0건"
  - **AC-25-03(경계):** Given "A/B 구분이 필요한 화면인 상태" / When "구분 방식을 적용함" / Then "위치와 라벨로 구분하고 색은 충족·미충족·확인 상태에만 사용하며, 지도 경로선에만 예외적으로 구분색을 허용한다" / SLO "identity 목적의 색 사용 0건(지도 경로선 예외 제외)"

## ✅ Task Breakdown
- [ ] AC-25-01에 대한 테스트 작성: 컴포넌트 스냅샷/DOM 순서에서 A/B 블록의 순서·크기(width/height 등 시각적 비중)가 동일함을 검증
- [ ] AC-25-02에 대한 테스트 작성: 렌더링 결과 DOM에 "총점", "추천", "적합도" 등 금지 텍스트/요소가 전혀 없음을 검증(스냅샷 + 텍스트 검색)
- [ ] AC-25-03에 대한 테스트 작성: A/B 식별에 사용된 색상 값이 상태색(충족/미충족/확인) 팔레트에만 속하고, identity 전용 색이 없음을 검증(지도 경로선 컴포넌트는 예외 처리로 별도 확인)

## 🧪 Test Cases (실행 가능한 형태)
```
test("AC-25-01: A/B 동일 비중 렌더링") {
  given: BalancedComparison({ personA: {...}, personB: {...} })
  when: render
  then: DOM에서 personA 블록과 personB 블록의 순서가 고정 패턴을 따르고, CSS 비중(flex/grid 비율)이 50:50임
}

test("AC-25-02: 금지 요소 부재 회귀 테스트") {
  given: 렌더링된 컴포넌트 트리
  when: DOM 텍스트/속성을 전수 검색
  then: "총점"|"score"|"추천"|"recommend"|"적합도" 등의 키워드가 어디에도 없음
}

test("AC-25-03: identity 색 미사용") {
  given: 렌더링된 컴포넌트의 모든 색상 사용처
  when: 색상 용도를 분류함
  then: 모든 색상이 상태(충족/미충족/확인) 팔레트에 속하거나 지도 경로선 컴포넌트(예외)에만 국한됨
}
```

## ⚙️ Technical & Non-Functional Constraints
- AC-25-02는 이 프로젝트의 최상위 제품 원칙과 직결되므로, 이 테스트를 CI 필수 게이트로 등록하는 것을 권장(회귀 시 즉시 빌드 실패)

## 🏁 Definition of Done (DoD)
- [ ] AC-25-01~03 세 테스트 모두 작성되었는가?
- [ ] V-002 구현 완료 후 통과하는가?

## 🚧 Dependencies & Blockers
- Depends on: C-001
- Blocks: V-002 완료 처리
