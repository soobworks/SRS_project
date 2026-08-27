# 프로토타입 실행 로그 — Scope L

**목표:** `SRS_project/goals/prototype-lite-ux-validated.md`
**이슈:** #55 · **브랜치:** `feat/55-proto-lite-scope-l`
**시작:** 2026-08-27

---

PREREQ OK: node v24.19.0 | pnpm 11.24.0 | gh 2.98.0
ISSUE #55 CREATED | BRANCH feat/55-proto-lite-scope-l
GOAL AMENDED (사용자 지시): 캡처 파일명에 실행 시각 `__<RUN_TS>`(YYYYMMDD-HHmm) 추가, 캡처 전 디렉터리 비움 — /goal §6·§3.4
DECISION: Prisma를 6.16.3으로 고정 — npm `latest`가 RC(8.0.0-rc.12)를 가리키고, Prisma 7이 `datasource.url`을 제거해 SRS §6.2 스키마(6.x 문법)와 비호환. 프로젝트 설계 전체가 풀러/직결 연결 문자열 전제에 서 있어 6.x가 맞다.
DECISION: pnpm-workspace.yaml allowBuilds에 Prisma 3종만 true — 그 외 빌드 스크립트는 실행하지 않는다.
FINDING: `prisma/schema.prisma`의 `ListingRef.parking Boolean`(non-nullable)은 PRD §18.2 [확정] "주차 등 데이터 누락 → 확인 필요"를 표현할 수 없다. 픽스처는 `parking: null`로 두고 프로토타입 뷰 타입에서만 nullable로 다룬다. 스키마 수정은 이 작업 범위 밖(C-000 원 순번).
STEP 0 DONE: C-000 스캐폴드(Next 16·TS·Tailwind4·shadcn) · schema.prisma 12모델/6enum · prisma generate(DB 연결 없음) · C-001 contracts.ts · C-002 픽스처 2종 · lib/dev 시나리오 6벌 | 검수 1 = 예(총점·순위·추천 배지 없음)
STEP 1 DONE: V-002 balanced-comparison(총점 prop 부재 설계) · X-001 disclosed-value · J-008 judgments 화면 | 검수 1·2·3·4 = 예
STEP 2 DONE: R-001 양보 문장(A-14b) · R-002 완화 A안/B안(A-15) · 전부불충족(A-13b) · 재탐색 필터(A-13b-2, 결과 수 미표시) | 검수 5·6·7·8 = 예
STEP 3 DONE: V-001 2라운드(A-16 match 2/1/0) · A-16e Option Grid(총점 행 없음) | 검수 1·4 = 예
STEP 4 DONE: I-001 조건 입력 · S-001 후보 선택 · S-003 B 진입(모바일 390px) | 검수 1~8 = 예
VERIFY: pnpm typecheck / lint / build 모두 exit 0
FIX: 판정 목록 카드 전체를 Link로 감싸 `<a>` 중첩 → 하이드레이션 실패. 제목만 링크로 바꿔 해소.
FIX: A/B 블록 행 수 불일치(명세 §4.3 위반) — 안 건 조건도 `기준 없음`으로 행을 남기도록 정규화. 블록 높이가 달라 "동일 비중"이 깨지고 있었다.
FIX: A-16e Option Grid에서 `기준 없음`을 `?`(확인 필요 기호)로 렌더 — 5분류 오분류. 상태별로 분기하도록 수정.
FIX: Next 개발 표시기가 매물명을 가림 → devIndicators: false
CAPTURE RUN: 20260827-1459 (32 shots)
GOAL AMENDED: §3.3 총점 금지 grep이 가드레일 주석 4건을 잡아 원본만으로는 0이 나올 수 없었다. 원본 + 주석제외 + 금지 prop 3단으로 바꿨다(원본 결과도 반드시 함께 보인다 — 숨기면 검사 약화).
VERIFY: 총점 실코드 0건 / 금지 prop(score·rank·recommended·winner·sortBy) 0건
FIX: A-13b-2에 「이 필터로 찾아보기」 버튼이 시각적으로 없었다(명세 §7.3) → 추가. 자동 이동 없음은 유지.
FIX: A-15에서 양보 문장이 normal 세트 기준이라 바로 아래 all-unmet 표와 모순됐다. PRD §14.1대로 양보 문장을 `한쪽만 충족` 매물에만 붙이도록 좁혔다.
