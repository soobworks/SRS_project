# 검수 URL 목록 — Scope L 프로토타입

```bash
cd SRS_project/prototype && pnpm dev   # http://localhost:3000
```

> 앱은 저장소 루트가 아니라 **`SRS_project/prototype/`** 하위에 있다 — 루트에는 기획 문서가 있어 섞이지 않게 분리했다(2026-08-27).

키는 **PRD 화면 ID**(`?state=`)를 그대로 쓴다. "A-13b 확인했나?"가 URL 하나로 답해진다.
전체 매핑은 `SRS_project/tasks/v2/prototype-visual-spec.md` §1.2.

폼팩터는 화면 ID 접두사가 정한다(명세 §2.1) — `A-*` 데스크톱 1280px · `B-*` 모바일 390px.

---

## 검수 질문 8개 (`prototype-suggestion.md` §5.2)

각 질문을 어느 화면에서 확인하는지 붙였다. **질문 1은 모든 화면에서 반복 확인한다.**

| # | 질문 | 확인 화면 |
| --- | --- | --- |
| 1 | 총점·순위·추천 배지가 어디에도 없는가 | **전 화면** · 특히 `A-16e` |
| 2 | `확인 필요`가 3분류에 흡수되지 않고 별도 배지인가 | `A-13` · `A-14d` |
| 3 | 모든 숫자가 기준 시점·가정과 함께 보이는가 | `A-04a` · `A-13` · `A-14b` |
| 4 | A와 B가 같은 시각 비중인가 | `A-14a`~`A-14e` |
| 5 | 양보 문장이 결론을 말하지 않는가 | `A-14b` |
| 6 | 두 조건 동시 완화가 불가능한가 | `A-15` |
| 7 | 재탐색 필터가 자동 이동하지 않는가 | `A-13b-2` |
| 8 | 전부 불충족일 때 막다른 길에 갇히지 않는가 | `A-13b` → `A-13b-2` |

---

## 1. 후보 구성 (S-001)

| 화면 | URL | 보는 것 |
| --- | --- | --- |
| `A-01` | `/spaces/demo?state=A-01` | 기능 진입 — 네이버에서 들어온 지점 |
| `A-02` | `/spaces/demo?state=A-02` | 후보 1~5곳 선택 |
| `A-02a` | `/spaces/demo?state=A-02a` | 관심매물 0개 — 막지 않고 탐색으로 안내 |
| `A-02c` | `/spaces/demo?state=A-02c` | 6개째 즉시 차단 |

## 2. 조건 입력 (I-001)

| 화면 | URL | 보는 것 |
| --- | --- | --- |
| `A-03` | `/spaces/demo/conditions?state=A-03` | 출퇴근 분기 |
| `A-03d` | `/spaces/demo/conditions?state=A-03d` | **출근 안 함도 정상 경로** — 0으로 계산하지 않음 |
| `A-04` | `/spaces/demo/conditions?state=A-04` | 예산 입력 |
| `A-04&form=empty` | `/spaces/demo/conditions?state=A-04&form=empty` | 예산 미입력 시 저장 차단 |
| `A-04a` | `/spaces/demo/conditions?state=A-04a` | **전제 패널 11종 + 신뢰도 등급** (질문 3) |
| `A-05` | `/spaces/demo/conditions?state=A-05` | 첫 결과 미리보기 |
| `B-03` | `/spaces/demo/conditions?state=B-03` | B 기본 입력(모바일) |
| `B-04` | `/spaces/demo/conditions?state=B-04` | B 통근 입력(모바일) |

## 3. 판정 결과 (J-008 + V-002 + X-001)

| 화면 | URL | 보는 것 |
| --- | --- | --- |
| `A-12` | `/spaces/demo/judgments?state=A-12` | 1인 빈 경로 — B 미참여, 실부담 1인 기준 |
| `A-13` | `/spaces/demo/judgments?state=A-13` | **3분류 그룹 + 확인 필요 배지 + 계산 불가** (질문 1·2·3) |
| `A-13&set=one-commute` | `/spaces/demo/judgments?state=A-13&set=one-commute` | 한쪽만 `해당 없음` → **행 유지** |
| `A-13&set=no-commute` | `/spaces/demo/judgments?state=A-13&set=no-commute` | 둘 다 `해당 없음` → **행 제거** |
| `A-13b` | `/spaces/demo/judgments?state=A-13b` | **전부 불충족 → 한 조건 완화 출구** (질문 8) |
| `A-13b-2` | `/spaces/demo/judgments?state=A-13b-2` | **재탐색 필터 — 자동 이동 없음, 결과 수 미표시** (질문 7) |
| `A-13c` | `/spaces/demo/judgments?state=A-13c` | 조건 충돌 설명 — 전체 지역을 단정하지 않음 |
| `B-05` | `/spaces/demo/judgments?state=B-05` | B의 첫 결과(모바일) |
| `S-02` | `/spaces/demo/judgments?state=S-02` | 계산 불가 ≠ 미충족 |
| `S-03` | `/spaces/demo/judgments?state=S-03` | 경로 없음 — 계산불가/해당없음/미충족 3자 구분 |

## 4. trade-off 상세 · 완화 (R-001 · R-002)

| 화면 | URL | 보는 것 |
| --- | --- | --- |
| `A-14a` | `/spaces/demo/listings/L-004?state=A-14a` | 둘 다 충족 |
| `A-14b` | `/spaces/demo/listings/L-001?state=A-14b` | **Hero trade-off — 양보 문장, 결론 없음** (질문 4·5) |
| `A-14c` | `/spaces/demo/listings/L-002?state=A-14c` | 둘 다 불충족 |
| `A-14d` | `/spaces/demo/listings/L-005?state=A-14d` | 보류 — 확인 필요 |
| `A-14e` | `/spaces/demo/listings/L-001?state=A-14e` | 상대 미입력 |
| `A-15` | `/spaces/demo/listings/L-005?state=A-15` | **완화 A안·B안 동시 — 동시 완화 UI 없음** (질문 6) |

## 5. 방문 후보 결정 (V-001) — North Star

| 화면 | URL | 보는 것 |
| --- | --- | --- |
| `A-16&match=2` | `/spaces/demo/visit-selection?state=A-16&match=2` | 2개 일치 → 확정 |
| `A-16e` | `/spaces/demo/visit-selection?state=A-16e` | **남은 한 자리 Option Grid — 총점 행 없음** (질문 1) |
| `A-16&match=0` | `/spaces/demo/visit-selection?state=A-16&match=0` | 0개 일치 → 2라운드 |

## 6. B 진입 (S-003) — 모바일

| 화면 | URL | 보는 것 |
| --- | --- | --- |
| `B-01` | `/invite/DEMOCODE?state=B-01` | 초대 진입 |
| `B-01&invite=expired` | `/invite/DEMOCODE?state=B-01&invite=expired` | 만료 — 후보·선호를 노출하지 않음 |
| `B-02` | `/invite/DEMOCODE?state=B-02` | **조건 입력 전 맥락 — 후보 5곳 + A의 선호** |

---

## 캡처

```bash
cd SRS_project/prototype && node scripts/capture-screens.mjs
```

`SRS_project/prototype/reports/prototype-screens/<화면ID>__<RUN_TS>.png` 로 34장이 저장된다.
`S-01`(로딩)은 순간 상태라 캡처에서 빠진다 — 코드는 `SRS_project/prototype/app/loading.tsx`에 있다.

## 범위 밖

`F-001`·`F-003`(현장 기록, 1-B) · Scope B 6건(`S-002`·`I-002`·`R-003`·`V-003`·`X-002`·`D-001`) ·
`A-19`·`A-20`·`B-06`~`B-10`. 링크는 있어도 배지로 막아 둔다.
