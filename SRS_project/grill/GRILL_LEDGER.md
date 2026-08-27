# Grill Ledger — 프로토타입 시각화 계획

**세션 시작:** 2026-08-26
**참조 범위(A):** `SRS_project/tasks/v2/prototype-suggestion.md` · `SRS_project/tasks/v2/prototype-suggestion-lite.md` · `SRS_project/같이보기-prd-v1_0.md` · `SRS_project/SRS_V0_9.md` §2.2 · `SRS_project/tasks/v2/{Task ID}-*.md`
**관심 방향(B):** 프로토타입 착수 전 미확정된 시각화(화면·상태·표기·데이터) 결정
**완료조건(C):** 아래 토픽 전부 RESOLVED
**OUTPUT(D):** `SRS_project/tasks/v2/prototype-visual-spec.md`(시각화 명세, 신규) + 하네스 + 이 원장

---

```markdown
RESOLVED: 9 / TOTAL: 9  ✅ ALL_RESOLVED
- [x] T1 | CORE  | 프로토타입의 "화면 단위" | status:RESOLVED | decision:SRS 라우트 7개 유지 + 각 라우트가 담는 PRD 화면 ID를 매핑표로 고정, 스위처 키를 `?state=<PRD ID>`로 | applied:prototype-visual-spec.md §0·§1 신규 / .claude/agents/ui-shadcn.md
- [x] T2 | CORE  | 기기 폼팩터 | status:RESOLVED | decision:PRD 화면 ID 접두사가 폼팩터를 정한다 — A-*=데스크톱 1280px, B-*=모바일 390px, S-*=양쪽 | applied:prototype-visual-spec.md §2 / .claude/agents/ui-shadcn.md
- [x] T3 | CORE  | 네이버 셸 | status:RESOLVED | decision:중립 회색 셸 + 텍스트 브레드크럼만. 네이버 로고·CI·마크업 복제 금지. 이탈 지점은 배지로 표시 | applied:prototype-visual-spec.md §3 / .claude/agents/ui-shadcn.md
- [x] T4 | CORE  | 판정 표시 문법 | status:RESOLVED | decision:라벨은 PRD §18.3 문구 고정. 목록=축약형(`A · 통근 +3분`, 사람 접두어, 미충족만), 상세=전체형(사람 블록, 충족 포함 전 조건). 조건 순서 고정 | applied:prototype-visual-spec.md §4 / .claude/agents/ui-shadcn.md
- [x] T5 | CORE  | 전제 공개 범위 | status:RESOLVED | decision:추정치만 DisclosedValue(`약` 접두어+ⓘ, 행당 1개). 툴팁은 기준시점+전제보기 링크만, 전제 11종 전문은 A-04a 패널이 정본. 신뢰도 등급 노출 | applied:prototype-visual-spec.md §5 / .claude/agents/ui-shadcn.md
- [x] T6 | CORE  | 픽스처 시나리오 | status:RESOLVED | decision:매물 5건 고정 + 조건 세트 5벌(normal/all-unmet/solo/one-commute/no-commute). 확정 수치·판정 검증표까지 명세에 고정 | applied:prototype-visual-spec.md §6
- [x] T7 | CORE  | A-13b-2 재탐색 필터 | status:RESOLVED | decision:변환 규칙(더 엄격한 쪽 + 통근 제외)까지만. 검색 결과 수·필터 URL 규격은 [TBD]로 표시만 하고 만들지 않는다 | applied:prototype-visual-spec.md §0·§6.5·§7
- [x] T8 | MINOR | 선호 카드 | status:RESOLVED | decision:픽스처 문장(A 3개/B 2개)을 조건 세트에 넣고 표시만. 입력 UI(A-08)는 I-002 원 순번 | applied:prototype-visual-spec.md §8
- [x] T9 | MINOR | 정렬 UI | status:RESOLVED | decision:정렬 넣지 않는다. 3분류 그룹만 묶고 그룹 내부는 담은 순서 고정. 정렬 컨트롤 금지 | applied:prototype-visual-spec.md §9
```

---

## 해소 기록

### T1 — 화면 단위 (RESOLVED)
- **결정:** 구현 단위는 SRS 라우트 7개 그대로. 각 라우트가 담는 PRD 화면 ID·하위 상태를 매핑표로 고정하고, 시나리오 스위처 키를 `?state=<PRD 화면 ID>`로 통일.
- **반영:** `SRS_project/tasks/v2/prototype-visual-spec.md` §1(매핑표 신규) · §0(문서 공백 3건 기록) / `.claude/agents/ui-shadcn.md`(프로토타입 화면 작업 규칙)
- **부수 발견:** ① `docs/08-screen-design.md`가 저장소에 없다(PRD §17 참조 대상). ② `A-15a`는 PRD 전체에서 와이어프레임 목록 한 곳에만 등장하고 정의가 없다 → `A-15` 기본 상태로 간주. ③ Scope L이 핵심 와이어프레임 8장 중 7장을 덮는다.

### T2 — 기기 폼팩터 (RESOLVED)
- **결정:** 폼팩터를 라우트가 아니라 **PRD 화면 ID 접두사**에 매단다. `A-*`=데스크톱 1280px, `B-*`=모바일 390px, `S-*`=양쪽.
- **반영:** `prototype-visual-spec.md` §2 / `.claude/agents/ui-shadcn.md`
- **부수 발견:** 라우트 기준으로 잡으면 `B-03`·`B-04`·`B-05`가 `spaces/*` 라우트에 얹혀 데스크톱으로 잘못 나온다. `B-05`는 핵심 와이어프레임 8장 중 하나라 이 예외를 놓치면 안 된다.

### T3 — 네이버 셸 (RESOLVED)
- **결정:** `components/dev/prototype-shell.tsx` 중립 회색 셸. 브레드크럼 `네이버 부동산 › 같이 고르기` 텍스트만. 네이버 로고·CI 색상·상표·실제 마크업 복제 금지. `A-01`(진입)·`A-13b-2`·`A-20`(이탈)은 배지로 표시.
- **반영:** `prototype-visual-spec.md` §3 / `.claude/agents/ui-shadcn.md`

### T4 — 판정 표시 문법 (RESOLVED)
- **결정:** ① 5분류 라벨은 PRD §18.3 문구 그대로(`충족`/`미충족`/`계산 불가`/`확인 필요`/`해당 없음`), 3분류는 §13.2 문구, `확인 필요`는 별도 배지. ② 표기는 **화면별 이원화** — 목록은 축약형(매물명 → 3분류 라벨 → `A · 통근 +3분` / `B · 예산 +월 7만`, 미충족만 앞 2개), 상세는 전체형(사람 블록, 충족 조건 포함 전 조건, `통근 13분 > 10분 ✗ +3분`). ③ 조건 순서 `예산 → 통근 → 추가 필수①~④ → 확인 필요` 고정, A/B 행 순서 동일.
- **반영:** `prototype-visual-spec.md` §4 / `.claude/agents/ui-shadcn.md`
- **부수 발견:** `NOT_APPLICABLE` 처리가 두 갈래다 — **둘 다** 해당 없으면 행 제거(§19.2 "항목 자체를 표시하지 않음"), **한쪽만**이면 행 유지 + `해당 없음`. 그리고 출퇴근 안 하는 사람의 통근비를 `0원`으로 계산하지 않는다. 에이전트가 "행 제거" 한 줄만 보고 틀리기 쉬운 지점이라 §4.2로 분리 기록.

### T5 — 전제 공개 범위 (RESOLVED)
- **결정:** 숫자를 4분류(추정치/추정치 파생/실측치/입력값·실측 파생)해 **전제 의존 값만** `DisclosedValue`로 감싼다. 판별 기준은 "§19.3 전제값이 바뀌면 함께 바뀌는가". 추정치는 `약` 접두어 + ⓘ(행당 최대 1개), 툴팁은 `기준 <시점> · 전제 보기`만, 전제 11종 전문은 `A-04a` 패널이 정본이며 **신뢰도 등급**(`[근거 있음]`/`[신뢰도 중간]`/`[가정]`)을 노출한다.
- **반영:** `prototype-visual-spec.md` §5(숫자 4분류 · 전제 11종 표 · 표현 규칙) / `.claude/agents/ui-shadcn.md`
- **부수 발견:** ① 예산 미달량(`+월 7만`)은 실부담(추정치)에서 파생되므로 **감싸야 하고**, 통근 미달량(`+3분`)은 실측 파생이라 평문이다 — 같은 "미달량"이지만 처리가 다르다. ② 관리비 별도 항목 추정 범위가 PRD `[TBD]` → 프로토타입은 표시 관리비만 반영하고 별도 항목은 `확인 필요` 배지로 둔다(빈칸을 메우지 않는다).

### T6 — 픽스처 시나리오 (RESOLVED)
- **결정:** 매물 5건(`L-001`~`L-005`)을 고정하고 A/B 조건값만 세트로 교체. PRD §12.1(조건은 사람에게 귀속) 모델 그대로.
- **반영:** `prototype-visual-spec.md` §6 — 매물 5건·통근시간·실부담 3벌·조건 세트 5벌·판정 검증표까지 확정 수치로 고정.
- **의도적 설계 2건:** ① `L-005`의 주차 데이터를 비워 `확인 필요` vs `미충족` 구분을 화면에 노출(이 프로젝트 최악의 오분류). ② `L-003`의 B 경로를 계산 불가로 두어 `S-02`를 렌더.
- **선택안에서 확장:** 조건 세트를 3벌 → 5벌로. §4.2의 `해당 없음` 두 갈래와 PRD §19.2 교통비 3경우는 세트를 나누지 않으면 렌더 불가. 구조(매물 고정 + 조건 교체)는 그대로.
- **부수 발견:** 같은 매물의 실부담이 통근 여부에 따라 달라진다(`L-001` 90/84/78만) — PRD §19.2를 화면에서 확인하는 지점이라 3벌을 표로 고정.

### T7 — A-13b-2 재탐색 필터 (RESOLVED)
- **결정:** PRD `[TBD]`인 것은 **결과 수와 필터 URL 규격**(`LIM-07`)이지 변환 규칙이 아니다. `R-002` ③의 변환 규칙(예산=낮은 상한 / 면적=높은 하한 / 역도보=짧은 기준 / **통근시간 제외**)까지만 만들고, 결과 수와 파라미터명은 만들지 않는다. `search-counts.json` 픽스처도 프로토타입 범위에서 제외.
- **반영:** `prototype-visual-spec.md` §7 · §0(공백표 갱신) · §6.5(조건 세트 6번째 추가)
- **부수 발견:** `all-unmet` 세트는 한 조건 완화로 후보가 **살아나므로** `A-13b-2`에 도달하지 못한다 → `all-unmet-hard` 세트를 추가했다(모든 후보가 한 사람 기준 미충족 2개 이상). 두 갈래(회복 가능 / 회복 불가)가 모두 렌더돼야 검수 질문 8번이 완전히 답해진다.

### T8 — 선호 카드 (RESOLVED)
- **결정:** 선호는 판정에 연결되지 않는 자유 문장이라 픽스처 문자열만으로 화면이 성립한다. `B-02`(A 선호)·`A-13`(A·B 사람 단위 카드)에 표시하고 입력 UI는 만들지 않는다.
- **반영:** `prototype-visual-spec.md` §8
- **부수 효과:** 선호 카드를 넣는 주된 이유는 "선호를 매물 비교표에 넣지 않는다 / 매물별 ✓✗ 금지"(PRD §13.2·§12.4 `[확정]`)를 **검수할 대상이 생기기 때문**이다. A·B 문장 수를 3개/2개로 다르게 둬 개수 차이가 카드 비중을 흔들지 않는지도 확인한다.

### T9 — 정렬 UI (RESOLVED)
- **결정:** 프로토타입에 정렬을 넣지 않는다. 3분류 그룹으로만 묶고 그룹 내부는 담은 순서 고정. 정렬 컨트롤(드롭다운·탭·토글) 금지.
- **반영:** `prototype-visual-spec.md` §9
- **근거:** ① 검증 재료 없음(`normal` 세트의 `한쪽만 충족`이 1건) ② 검수 질문 8개에 정렬 없음, PRD도 "가능"이지 "필수" 아님 ③ 정렬 드롭다운은 `종합순`이 스며드는 가장 흔한 통로.

---

## STOP: ALL_RESOLVED (2026-08-27)
