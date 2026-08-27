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
