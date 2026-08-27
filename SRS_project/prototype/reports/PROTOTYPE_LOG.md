# 프로토타입 작업 상황 보고서 — Scope L

**목표:** `SRS_project/goals/prototype-lite-ux-validated.md`
**이슈:** [#55](https://github.com/soobworks/SRS_project/issues/55) · **브랜치:** `feat/55-proto-lite-scope-l`
**시작:** 2026-08-27

---

## 0. 현재 상태 (한눈에)

| 항목 | 값 |
| --- | --- |
| **단계** | 구현 완료 · **평가 반영 중** |
| **완료 조건** | `aztks-agent` EVALUATE가 `VERDICT: GO` + `SCORECARD: A:P Z:P T:P K:P S:P` |
| **최근 평가** | EVAL #2 → **GO / 미통과** (`A:P Z:C T:P K:C S:P`) · EVAL #3은 경로 이동으로 중단(판정 없음) |
| **평가 예산** | 3 / 5 사용 (#3은 중단, 판정 없음) |
| **검증 명령** | `typecheck` · `lint` · `build` 전부 exit 0 |
| **총점 금지** | 실코드 0건 · 금지 prop 0건 |
| **캡처** | 34장 (`RUN_TS=20260827-1543`, 소스와 동기) |
| **다음 행동** | ↓ §5 |

---

## 1. 진행 단계

| Step | 내용 | 상태 | 검수(§7) |
| --- | --- | --- | --- |
| 0 | C-000 스캐폴드 · C-001 계약 · C-002 픽스처 · lib/dev 시나리오 6벌 | ✅ | 1 = 예 |
| 1 | V-002 균형 렌더러 · X-001 전제 공개 · J-008 판정 화면 | ✅ | 1·2·3·4 = 예 |
| 2 | R-001 양보 문장 · R-002 완화/전부불충족/재탐색 | ✅ | 5·6·7·8 = 예 |
| 3 | V-001 2라운드 · A-16e Option Grid | ✅ | 1·4 = 예 |
| 4 | I-001 조건 입력 · S-001 후보 선택 · S-003 B 진입 | ✅ | 1~8 = 예 |

---

## 2. 평가 이력

### EVAL #1 — 2026-08-27 · **NO-GO**

```
VERDICT: NO-GO
SCORECARD: A:P Z:F T:F K:C S:C
```

| 축 | 판정 | 지적 |
| --- | --- | --- |
| A 알아서 | **P** | — |
| Z 잘 | **F** | `RELAXATION_OPTIONS`의 B안(`통근 15→18분`)이 `recovers:["L-001"]`이라 하지만, ALL_UNMET의 L-001은 B가 예산 `+월 15만` **과** 통근 `+3분` 둘 다 미충족이라 통근만 풀면 살아나지 않는다 — **화면 문구가 픽스처와 모순** |
| T 딱 | **F** | ① `A-13`이 3분류 그룹 헤더·건수 없이 평면 나열(명세 §9.1 위반) ② 명세 §1.2에서 `L`인 `S-01`(로딩)·`S-03`(경로 없음)·`A-02a`(0개 선택)가 코드에 참조 0건 |
| K 깔끔 | **C** | `disclosed-value.tsx`(생존 컴포넌트)가 폐기 예정 `lib/dev/scenarios`를 직접 import |
| S 센스 | **C** | `reports/`에 `?state=` 검수 URL 목록 없음 · 이 로그에 중단 지점·다음 행동 표기 없음 |

**통과한 것:** 검수 8문항 전부 · 총점 부재 · `확인 필요` 별도 배지 · 4상태 구분 · A/B 동일 비중 · 동시 완화 불가 · 필터 자동이동 없음 · 전부불충족 출구 · 세 검증 명령 exit 0

### EVAL #2 — 2026-08-27 · **GO (미통과 — CONCERN 2건)**

```
VERDICT: GO
SCORECARD: A:P Z:C T:P K:C S:P
```

| 축 | 판정 | 지적 | 조치 |
| --- | --- | --- | --- |
| A | **P** | — | — |
| Z | **C** | X8·X9를 소스만 고치고 **재캡처를 안 해** 캡처가 여전히 `가 살아나요`를 보여줌 → 검수질문 6·8이 캡처로 답해지지 않음 | 재캡처 `RUN_TS=20260827-1543` (X11) |
| T | **P** | EVAL #1의 FAIL 2건 모두 해소 확인 | — |
| K | **C** | `balanced-comparison.tsx`가 `@/lib/dev/view-types`의 `ConditionRow`를 import — EVAL #1 K:C를 `disclosed-value.tsx`에만 반영하고 같은 패턴을 놓침 | `ConditionRow`·`ListingJudgment`를 `lib/types/contracts.ts`로 이관 (X10) |
| S | **P** | 로그가 X8을 정직하게 미완으로 기록한 점 인정 | — |

**전수 통과 확인:** 총점·순위·추천 grep 0건 · `A-14d`에서 `확인 필요`가 별도 배지로 병기 · `데이터 없음`/`기준 없음` 구분 · `no-commute` 실부담이 명세 §6.4와 정확히 일치 · `A-16e` 총점 행 없음 · `A-13b-2` 결과 수 미표시·자동 이동 없음 · 세 검증 명령 exit 0

---

## 3. 결정 기록

| # | 결정 | 사유 |
| --- | --- | --- |
| D1 | Prisma **6.16.3** 고정 | npm `latest`가 RC(8.0.0-rc.12)를 가리키고, Prisma 7이 `datasource.url`을 제거해 SRS §6.2 스키마(6.x 문법)와 비호환. 프로젝트 설계 전체가 풀러/직결 연결 문자열 전제에 서 있다 |
| D2 | `pnpm-workspace.yaml` `allowBuilds`에 Prisma 3종만 `true` | 그 외 빌드 스크립트는 실행하지 않는다 |
| D3 | 라이트 모드 고정 | 팀이 서로 다른 OS 설정에서 열어도 판정 색이 뒤집히면 시각 검수가 성립하지 않는다 |
| D4 | `devIndicators: false` | Next 개발 표시기가 매물명을 가려 검수를 방해 |
| D5 | 앱 전체를 저장소 루트에서 `prototype/` 하위로 이동 | 루트에 기획 문서 60여 개가 있어 앱 설정 파일과 섞이면 읽기 어렵다(2026-08-27 사용자 결정) |
| D6 | **`prototype/` → `SRS_project/prototype/` 로 재이동** | 프로토타입은 SRS에서 파생된 산출물이므로 SRS 문서군과 같은 계층에 둔다. 안쪽 구조는 여전히 SRS §2.2 그대로다(2026-08-27 사용자 결정) |

### 발견 — 원천 문서의 갭

| # | 내용 | 처리 |
| --- | --- | --- |
| F1 | `prisma/schema.prisma`의 `ListingRef.parking Boolean`(non-nullable)은 PRD §18.2 `[확정]`("주차 등 데이터 누락 → 확인 필요")을 **표현할 수 없다** | 픽스처는 `parking: null`, 프로토타입 뷰 타입에서만 nullable. 스키마 수정은 `C-000` 원 순번 |

---

## 4. 수정 이력

| # | 수정 | 발견 경로 |
| --- | --- | --- |
| X1 | 판정 목록 카드 전체를 `Link`로 감싸 `<a>` 중첩 → **하이드레이션 실패**. 제목만 링크로 변경 | 캡처 스크립트 콘솔 오류 |
| X2 | A 블록 4행 / B 블록 3행으로 높이가 달라 "동일 비중"(REQ-FUNC-025)이 깨짐 → 안 건 조건도 `기준 없음`으로 행 유지(명세 §4.3) | 캡처 육안 확인 |
| X3 | `A-16e`가 `기준 없음`을 `?`(확인 필요 기호)로 렌더 — **5분류 오분류**(PRD §18.3) | 캡처 육안 확인 |
| X4 | `A-13b-2`에 「이 필터로 찾아보기」 버튼 없음(명세 §7.3) → 추가. 자동 이동 없음 유지 | 캡처 육안 확인 |
| X5 | `A-15`의 양보 문장이 `normal` 세트 기준이라 `all-unmet` 표와 **모순** → PRD §14.1대로 `한쪽만 충족`에만 적용 | 캡처 육안 확인 |
| X6 | `RELAXATION_OPTIONS` B안이 픽스처와 모순 → `recovers` 비우고 화면도 "살아나는 후보 없음"으로 | **EVAL #1 TOP_FIX** |
| X7 | `disclosed-value.tsx`가 `lib/dev/` 의존 → `basis`를 호출자가 넘기도록 분리 | EVAL #1 K:C |
| X8 | X6에서 `recovers`를 비웠는데 **UI가 빈 배열을 처리하지 않아** B안이 `가 살아나요`로 문장이 깨짐 → `A-15`·`A-13b` 둘 다 "이 조건만 풀어서는 살아나는 후보가 없어요"로 분기 | 캡처 육안 확인 (EVAL #2 진행 중 발견) |
| X9 | `A-02a`(관심매물 0곳)에서 "5곳으로 시작하기" CTA가 활성이고 선호 카드도 노출 — 담은 집이 0곳인데 시작할 수 있다고 말하는 모순 → 비활성 문구로 대체, 선호 카드 숨김 | 캡처 육안 확인 (EVAL #2 진행 중 발견) |
| X10 | 생존 컴포넌트가 폐기 예정 `lib/dev/`의 타입에 의존 → `ConditionRow`·`ListingJudgment`를 `lib/types/contracts.ts`로 이관. `components/domain/`의 `lib/dev` 의존 **0건** | EVAL #2 K:C |
| X11 | 캡처가 소스보다 오래됨 → 전량 재캡처(`RUN_TS=20260827-1543`). `A-15` B안이 "이 조건만 풀어서는 살아나는 후보가 없어요"로 정상 렌더 확인 | EVAL #2 Z:C(TOP_FIX) |

---

## 5. 다음 행동 (여기서부터 이어받는다)

- [x] X6 `RELAXATION_OPTIONS` 정합 — TOP_FIX
- [x] X7 `disclosed-value.tsx` 의존 분리 — K:C
- [x] **T:F ①** `A-13` 3분류 그룹 헤더·건수·그룹 순서 적용(명세 §9.1)
- [x] **T:F ②** `A-02a`(후보 0개) · `S-01`(`app/loading.tsx`) · `S-03`(경로 없음) 구현 · 캡처 32→34장
- [x] **S:C** `SRS_project/prototype/reports/REVIEW_URLS.md` 생성 · 이 보고서를 구조화
- [x] 재캡처 → EVAL #2 디스패치
- [x] **EVAL #2 Z:C** 재캡처로 소스·캡처 동기화
- [x] **EVAL #2 K:C** 표시 계약을 `lib/types/contracts.ts`로 이관
- [x] `SRS_project/prototype/` 로 재이동 + 경로 참조 전량 갱신
- [ ] EVAL #4 디스패치 → 5축 전부 `P` 확인

---

## 6. 목표 문서 수정 이력

| # | 수정 | 사유 |
| --- | --- | --- |
| G1 | §6·§3.4 — 캡처 파일명에 `__<RUN_TS>`(YYYYMMDD-HHmm), 캡처 전 디렉터리 비움 | **사용자 지시** |
| G2 | §3.3 — 총점 금지 grep을 원본 + 주석제외 + 금지prop 3단으로 | 가드레일 주석 4건이 패턴에 걸려 원본만으로는 0이 나올 수 없었다. 원본 결과도 반드시 함께 보인다 — 숨기면 검사 약화 |

---

## 7. 기록 위치

| 무엇 | 어디 |
| --- | --- |
| 이 보고서 | `SRS_project/prototype/reports/PROTOTYPE_LOG.md` (커밋됨) |
| 목표 정의 | `SRS_project/goals/prototype-lite-ux-validated.md` |
| 시각화 명세 | `SRS_project/tasks/v2/prototype-visual-spec.md` |
| 화면 캡처 | `SRS_project/prototype/reports/prototype-screens/` (gitignore — 용량) |
| 검수 URL | `SRS_project/prototype/reports/REVIEW_URLS.md` |
| 커밋·PR | 이슈 #55 · 브랜치 `feat/55-proto-lite-scope-l` |
