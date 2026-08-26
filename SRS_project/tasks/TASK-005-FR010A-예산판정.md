---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FR-010A: 매물별 자동 판정 — 예산(상한형)"
labels: 'feature, backend, core-logic, priority:critical'
assignees: ''
---

## 🎯 Summary
- 기능명: [FR-010A] 매물별 자동 판정 — 예산(상한형)
- 목적: 판정 엔진 최초 동작 확인. 조건 타입 1종(상한형)만으로 5분류(충족/미충족/확인 필요/계산 불가/해당 없음) 판정 체계를 검증한다.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `같이보기-srs-v1_0.md` §4.1 REQ-FUNC-010A, §4.1.1 판정 상태 결정 로직(플로차트), §9.3 AC-10a-01·02
- 개인 구현 난이도 지시: `SRS_V0_9-AI-작업지시서.md` TASK-A2 — "①BudgetEvaluator만 먼저 완성하고 AC-10a-01·02를 자동화 테스트로 통과"
- 데이터 모델: `SRS_V0_9.md` §6.2 `JudgmentResult`, enum `JudgmentStatus`

## ✅ Task Breakdown (실행 계획)
- [ ] `domain/judgment/evaluators/budget-evaluator.ts` 작성 — 순수 함수, 프레임워크 비의존
- [ ] 결정 트리(원 SRS §4.1.1) 그대로 구현: 측정 대상 존재? → 계산 시도? → 기준 충족?
- [ ] `domain/judgment/status-classifier.ts`에 5분류 enum 매핑 로직 작성 — MET/UNMET/CONFIRMATION_NEEDED/CALCULATION_FAILED/NOT_APPLICABLE
- [ ] §5.3(자동화 테스트 전략, TASK-A3) 방침에 따라 **구현 전에** 아래 GWT 시나리오를 단위 테스트로 먼저 작성
- [ ] `queries/judgment.queries.ts`에 `BudgetEvaluator` 결과를 `JudgmentResult` 테이블에 upsert하는 로직 연결

## 🧪 Acceptance Criteria (BDD/GWT)
Scenario 1: 정상 판정 (원 SRS AC-10a-01)
- Given: 사람의 예산 조건과 후보 실부담이 계산 가능한 상태
- When: 조건 또는 후보가 추가·수정됨
- Then: 예산 상한과 실부담을 비교해 충족 또는 미충족(미달량 포함)을 산출한다(조건·후보 변경 후 다음 화면 전환 전 반영).

Scenario 2: 데이터 누락 시 계산 불가 (원 SRS AC-10a-02, 실패)
- Given: 실부담 계산에 필요한 데이터가 누락된 상태
- When: 예산 판정을 시도함
- Then: "미충족"이 아니라 "계산 불가"로 표시한다(미충족/계산불가 오분류 0건).

## ⚙️ Technical & Non-Functional Constraints
- **제품 정체성 제약(협상 불가):** 5분류 구분(특히 미충족≠확인필요≠계산불가)은 어떤 이유로도 단순화·병합하지 않는다(`decisions/0001` 연계, `SRS_V0_9-AI-작업지시서.md` TASK-A2 명시)
- TDD 필수: 테스트 작성 → 구현 → 통과 순서를 반드시 지킨다
- 이 태스크는 조건 타입 1종(상한형)만 다룬다 — 하한형·유무형·일치형은 TASK-006으로 분리

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 단위 테스트가 AC-10a-01·02를 각각 커버하며 통과하는가?
- [ ] SonarQube / Linter 등의 정적 분석 도구 경고가 없는가?
- [ ] `BudgetEvaluator`가 순수 함수(부수효과 없음)로 구현되었는가?

## 🚧 Dependencies & Blockers
- Depends on: TASK-004(FR-002, `budgetCap` 필요)
- Blocks: TASK-006(FR-010B 등 확장 평가기), TASK-009(FR-017 방문 후보 결정)
