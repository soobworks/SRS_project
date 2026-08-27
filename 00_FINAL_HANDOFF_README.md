> **후속 사람·AI를 위한 안내**  
> 이 문서는 최종 산출물의 Source of Truth 안내서다.  
> 후속 작업은 이 문서를 먼저 읽고, **확정 / 근거 있음 / 추론 / 검증 가설 / TBD / 제출용 후속작성**을 구분해야 한다.  
> 파일에 없는 정책을 임의로 보완하지 말고, 충돌 시 아래 우선순위를 따른다.

---

# 00_FINAL_HANDOFF_README

최종 제출 폴더의 **지도 + Source of Truth + 변경 규칙 + 검증 경계**.  
새로운 분석 문서가 아니다. 제품 기능·정책을 여기서 새로 만들지 않는다.

- 기준 commit: `10b64551ed10a88616791b3a9798f53b50b01ed9`
- 기준 handoff: `real-estate-joint-decision_CHATGPT_HANDOFF_20260820_1333.zip` (최종 제출 폴더에는 미포함)
- 분석 repo: `real-estate-joint-decision-analysis` (읽기 전용, 최종 제출 폴더에는 미포함)
- 이 문서의 파일 참조는 최종 제출 폴더 기준 파일명 또는 상대경로만 사용한다.

---

## 1. Project Snapshot

| 항목 | 현재 기준 |
|---|---|
| 기준 서비스 / 역기획 대상 | 네이버 부동산(네이버페이 부동산). **관심매물 저장 이후** 구간 |
| 프로젝트 성격 | 기존 탐색 기능을 확장하지 않고, 저장 이후 2인 공동 의사결정 레이어를 역기획 |
| 제품 형태 | 별도 앱이 아니라 **네이버 앱/서비스 안의 기능** |
| 핵심 사용자 | **함께 살 집을 구하는 두 사람**. 1인은 상대 미참여 빈 경로 |
| 1차 검증 집단 | 예비부부·신혼부부 (제품 정의와 동일시하지 않음) |
| 핵심 문제 | 관심매물마다 두 사람의 조건 충돌과 양보 지점을 한 구조에서 보기 어려움. **지연 인과는 미검증** |
| 해결 범위 | 관심매물 최대 5개를 비교하고, 조건별 충족·감수·trade-off를 보여 준 뒤 **이번에 보러 갈 집 2개**를 둘이 정함. 탐색 DB·총점·AI 최종선택·계약/대출은 범위 밖 |

### Primary Value Proposition

`value-proposition_20260820.md` §7 확정 문장. **다시 쓰지 않는다.**

> **함께 살 집을 구하는 두 사람이, 관심매물별 조건 충돌과 양보 지점을 나란히 확인해 서로 납득할 수 있는 방문 후보를 정하도록 돕는 네이버 부동산의 공동 의사결정 기능.**

Short VP (같은 파일):

> **각자의 조건과 양보 지점을 보고, 함께 보러 갈 집을 정합니다.**

정본 파일: `value-proposition_20260820.md` (이 최종 제출 폴더).

---

## 2. Final Deliverables

2026-08-20 기준, 최종 폴더 **루트의 실제 파일**만 적는다. `node_modules`는 제출물이 아니다.

### 제출 본체

| 파일명 | 역할 | 제출 여부 | 편집 가능 여부 | 기준/비고 |
|---|---|---|---|---|
| `서비스_역기획서.pdf` | 발표·제출용 Deck PDF | 제출 본체 | 편집 어려움 | 30페이지. 요약 표현. 정책 정본이 아님 |
| `02_Evidence_Analysis_Workbook.xlsx` | 근거·분석 Trace | 제출 본체 | 가능 | 11탭. `09_PRD_Requirement_Trace`에 FR–AC 연결 |
| `03_Decision_AI_Usage_Log.xlsx` | 결정 로그 + AI 사용 기록 | 제출 본체 | 가능 | `01_Decisions` / `02_AI_Usage` |

### 편집/근거용

| 파일명 | 역할 | 제출 여부 | 편집 가능 여부 | 기준/비고 |
|---|---|---|---|---|
| `서비스_역기획서.pptx` | Deck 편집 원본 | 편집 원본 | 가능 | 30슬라이드. PDF와 대응. 정책 정본이 아님 |
| `value-proposition_20260820.md` | 확정 VP | 근거/추적 | 가능 | Primary VP 정본 |
| `prd_v0.1_20260820_with_AC.md` | PRD + AC | 근거/추적 | 가능 | FR 25 · AC 56. 일부 TBD 유지 |
| `master-deck_content_20260820.md` | 슬라이드별 원고 | 근거/발표 보조 | 가능 | 원고 30장. Deck보다 상세 |
| `00_FINAL_HANDOFF_README.md` | 이 문서 | 핸드오프 | 가능 | 지도·우선순위·변경 규칙 |

### 최종 제출 폴더에는 미포함 (파일명만 기록)

| 파일/위치 | 역할 | 비고 |
|---|---|---|
| `prd_v0.1_20260820.md` | AC 추가 전 PRD | 본문은 `prd_v0.1_20260820_with_AC.md`에 포함. 이 폴더에는 없음 |
| `docs/11-decision-status.md` | 최신 결정 정본 | 분석 repo 내부. 읽기 전용 |
| `decisions/0001`~`0004` | 채택된 ADR | 분석 repo 내부. 읽기 전용 |
| `real-estate-joint-decision_CHATGPT_HANDOFF_20260820_1333.zip` | 기준 스냅샷 | commit `10b64551`. 최종 제출 폴더에는 미포함 |

### 최종 폴더에 있으나 제출 본체가 아닌 파일

Workbook/로그 생성에 쓴 로컬 스크립트(`generate_workbooks.cjs`, `link_prd_ac.cjs`, `update_ai_usage.cjs`, `add_ai_usage_sheet.cjs`)와 `package.json`, `package-lock.json`, `node_modules`는 **제출 산출물이 아니다.**

---

## 3. Source of Truth / 충돌 시 우선순위

후속 수정은 아래 순서를 따른다.

1. **현재 사용자의 명시적 최신 지시**
2. **이 `00_FINAL_HANDOFF_README.md`의 Locked Decisions** (아래 5절. 원문을 대체하지 않고 안내만 한다)
3. **`docs/11-decision-status.md`** — 같은 스냅샷에서 가장 자주 갱신되는 결정 현황
4. **채택된 `decisions/0001`~`0004`**
5. **`value-proposition_20260820.md`** — VP 문장 정본
6. **`prd_v0.1_20260820_with_AC.md`** — FR/AC 정본. AC는 이 파일 원문을 그대로 쓴다
7. **최신 `docs/`** (`01` 브리프, `02` 가설, `03` 근거, `08` 화면 등)
8. **`02_Evidence_Analysis_Workbook.xlsx` / `03_Decision_AI_Usage_Log.xlsx`** — 추출·추적. 원본을 이기지 않음
9. **`master-deck_content_20260820.md` → `서비스_역기획서.pptx` → `서비스_역기획서.pdf`** — 발표용 압축

조정 이유: VP는 제출 과정에서 문장 확정된 산출물이므로, 일반 docs보다 앞에 둔다. ADR(`decisions`)은 decision-status와 같은 결정층이므로 VP/PRD보다 앞에 둔다.  
**Deck/PDF의 짧은 표현이 PRD·decision-status와 충돌하면 Deck을 정본으로 승격하지 않는다.**

분석 repo는 읽기 전용이다. 충돌을 발견해도 repo 원문을 고치지 않는다.

---

## 4. Recommended Read Order

1. `00_FINAL_HANDOFF_README.md` (이 문서)
2. `서비스_역기획서.pdf` — 30페이지 발표본. 요약으로만 읽는다
3. `value-proposition_20260820.md`
4. `prd_v0.1_20260820_with_AC.md`
5. `02_Evidence_Analysis_Workbook.xlsx` — 특히 `09_PRD_Requirement_Trace`, `10_Evidence_Inference_Assump`
6. `03_Decision_AI_Usage_Log.xlsx`
7. 필요 시 `docs/11-decision-status.md` → `decisions/` → 기타 `docs/` → `master-deck_content_20260820.md` → `서비스_역기획서.pptx`
8. 전체 스냅샷이 필요하면 `real-estate-joint-decision_CHATGPT_HANDOFF_20260820_1333.zip` (최종 제출 폴더에는 미포함)

---

## 5. Locked Decisions

원문(`11-decision-status`, decisions, VP)에서 확인된 항목만 적는다. 여기서 정책을 새로 만들지 않는다.

1. 역기획 대상은 **네이버 부동산**, 관심매물 **저장 이후**다. 별도 앱·매물 DB·탐색 보드가 아니다.
2. 문제는 매물 찾기가 아니라 **둘이 조건을 맞춰 방문 후보를 정하는 것**이다. 정보 흩어짐과 기준 부재는 다른 갈래다.
3. 핵심 사용자는 **함께 살 집을 구하는 두 사람**이다. 주거 형태는 제품 정의상 제한하지 않는다.
4. **예비부부·신혼부부**는 1차 검증 집단이고, **친구·룸메이트**는 2차 대조군이다. Primary User로 재정의하지 않는다.
5. 제외: 3인 이상, 부모–자녀, 주도–승인형.
6. **조건은 매물이 아니라 사람**에게 귀속된다. 매물이 바뀌어도 조건은 남고 새 매물에 자동 적용된다.
7. **예산(월 실부담 상한)은 모든 사용자의 공통 필수**이며, 항상 받는 유일한 항목이다.
8. 입력 순서 정본: **예산 → 출근 여부 → 출근하는 경우 출근지·이동수단**.
9. **`출근 안 함`은 정상 경로**다. 통근·교통비를 판정하지 않고 비교표에서 해당 행을 제거한다. `계산 불가`로 쓰지 않는다.
10. 판정 항목 여섯: 예산·통근시간·역 도보(상한) · 전용면적(하한) · 주차(유무) · 매물 유형(일치). 추가 필수는 사용자당 **0~4개**.
11. **총점·공동 적합도·복합 순위로 정답 매물을 고르지 않는다** (`decisions/0001`).
12. **AI는 최종 집을 대신 선택하지 않는다. 강제 타협안을 결정하지 않는다.** 설명·대조·미달량·완화 결과 서술만 한다.
13. 핵심 출력은 각 매물에서 **각 사람이 충족/감수하는 조건과 trade-off(양보 문장)** 를 같은 비중으로 보여주는 것이다.
14. **`확인 필요`(방문 전 중개사 질문)와 `방문 체크리스트`(방문 후 공통 기록)는 다른 개념**이다.
15. 종료점: 비교 세션당 관심매물 **최대 5개**, 방문 후보 **2개**. 선택 방식은 분할, 최대 2라운드 (`decisions/0004`). 화면 용어는 “합의”가 아니라 **이번에 보러 갈 집**.
16. 기기: A는 PC 웹 우선, B는 모바일 우선.
17. MVP: 단계 1 = FT1~FT7 검증 코어, 단계 2 = FT8·FT9 종료점 완성.
18. **H2-b-2**(조건 충돌이 실제 의사결정을 지연시킨다)는 **미검증**이다. Fact로 올리지 않는다.
19. 결정 시간 단축·갈등 감소·계약 전환을 확정 효과로 약속하지 않는다.

---

## 6. Evidence Boundary

`docs/03-evidence-log.md`, `docs/02-hypotheses.md`, Workbook `10_Evidence_Inference_Assump`와 같다.

### Fact / 근거 있음

- 주거 탐색에서 여러 매물을 반복 비교한다 (당근부동산 조사; 2인 전용 통계 아님).
- 파트너와 집 선택 시 조건 충돌·협상이 존재한다는 해외 조사 (Zillow 2020, F26). 미국·매매 한계.
- 네이버 부동산 모바일 점유는 검색 축 3위 구간 (F13). 앱 간 중복 미제거.
- 공식 외부 오픈 API 없음 (F20).
- H2-a, H2-b-1은 현재 문서에서 확인된 것으로 취급.

### Inference

- 관심매물 저장 이후 공동 결정이 네이버 안에 구조로 남지 않는다 (Opportunity Zone / I1).
- 링크를 모아도 “그냥 별로”가 남을 수 있다. 정보 갈래와 기준 갈래는 다르다 (I2).
- 탐색 정면 경쟁보다 공동 의사결정 축으로 우회한다 (I11).

### Validation Hypothesis

- **H1:** 초대받은 상대가 들어와 조건을 입력한다 — 미검증·최우선.
- **H2-b-2:** 그 조건 충돌이 실제 의사결정을 지연시킨다 — 미검증·급소.
- 이 기능이 결정 시간·갈등·방문 횟수·계약 전환을 개선하는가 — 효과 미측정.
- H3 입력 감수, H4 비용 신뢰도는 측정 필요 또는 부분 불가.

**분리 규칙 (필수):**  
`조건 차이 및 협상/타협이 존재한다` (H2-b-1, 근거 있음)와  
`그로 인해 실제 의사결정 시간이 지연된다` (H2-b-2, 미검증)를  
**같은 Fact로 취급하지 않는다.** A1 일화(“둘이 구하면 더 오래 걸린다”)를 지연 근거로 승격하지 않는다.

### TBD

정책·내부 API·화면 상세가 아직 없는 항목. 9절.

### Assumption

- SOM 5/10/15% 시나리오. 확정 시장 규모로 인용하지 않는다.
- 자차 실연비 10km/L 등 비용 전제. 숫자 옆에 전제를 붙인다.

---

## 7. Original Analysis vs Finalization Additions

### 기존 분석/설계에서 나온 내용 (handoff / docs / decisions)

Problem, Target, Value Chain, 조건 모델, Trade-off, Cost Model, Screen Design, Hypotheses, Evidence Log, MVP FT1~FT9, ADR 0001~0004, 출근 경로·예산 필수 결정.

이들은 **이미 조사·결정된 층**이다. 상태를 바꿀 때는 원문 근거가 필요하다.

### 최종 제출 과정에서 추가 또는 구조화한 내용

| 항목 | 성격 |
|---|---|
| `value-proposition_20260820.md` | 기존 결정을 VP 문장으로 구조화 |
| `prd_v0.1_20260820.md` → `prd_v0.1_20260820_with_AC.md` | 기존 기능을 PRD/FR/AC로 구조화. AC 56개는 **구현 최소 완료조건**이지 새 사용자 조사 결과가 아님 |
| Workbook 11탭, Requirement Trace | 원문 추출·연결 |
| Decision / AI Usage Log | 결정 회고·도구 사용 기록 |
| Master Deck 원고, PDF/PPTX 30장 | 발표용 압축 |
| 이 README | 지도와 변경 규칙 |

후자 항목을 **과거 조사에서 이미 검증된 사실**처럼 인용하지 않는다.  
특히 AC·Deck 카피·VP 문장은 제출용 후속작성이며, H2-b-2를 증명하지 않는다.

---

## 8. Known Conflicts and Final Resolution

같은 스냅샷(`10b64551`) 안에서 확인된 표현 차이. 원인을 ‘이전 잔재’로 추정하지 않는다.

### 출근/예산 필수 개수

- `docs/01-team-brief.md`, `README.md` 일부, `docs/02-hypotheses.md` H3 제목: **출근지·예산 2개** / 첫 결과까지 입력 2번.
- 정본 `docs/11-decision-status.md`: 처음 요구하는 입력은 **예산 하나**. 출근지는 출퇴근하는 경우만.
- **최종 적용:** `예산 → 출근 여부 → 출근 시 출근지`. `출근 안 함`이면 통근 조건 제외.

### 화면 순서

- `docs/08-screen-design.md` 인벤토리: **A-03 출퇴근 여부/출근지 → A-04 예산**. B도 B-03 출근지 → B-04 예산.
- `docs/11-decision-status.md` 및 VP/PRD 정책: **예산이 공통 필수이고 먼저 받는다.**
- **최종 적용:** 정책·입력 순서는 **11-decision-status**. 화면 ID 순서를 정책 정본으로 승격하지 않는다.

### 조건 입력 개수

- `docs/07-cjm-opportunity-score.md` TO-BE: **“조건 4번 입력”**.
- 정본: 공통 필수는 예산 1개, 추가 필수 0~4는 점진적, 출근지는 해당자만.
- **최종 적용:** 입력 횟수 숫자는 11-decision-status. CJM의 “4번”은 발표/정책 정본이 아니다.

### VP 문장 차이 (제출 산출물 사이)

- 정본 `value-proposition_20260820.md` §7: 위 1절 Primary VP (네이버 부동산의 공동 의사결정 기능까지 포함).
- `prd_v0.1_20260820_with_AC.md` §7.1: “한눈에 확인하고, … 방문 후보를 함께 결정하도록 돕는다.” (서비스명 수식 없음, 표현이 다름)
- **최종 적용:** **VP 파일 §7을 Primary VP 정본으로 쓴다.** PRD 7.1을 더 짧은 제품 문장으로 승격하지 않는다.

### 화면 용어 “합의”

- `docs/01-team-brief.md` 한 줄 정의에 “방문 후보 2개를 합의” 표현이 있다.
- `decisions/0004`: 화면 용어 **“합의” 금지**, “이번에 보러 갈 집 정하기”.
- **최종 적용:** 화면·Deck 용어는 0004. 브리프의 “합의”를 제품 UX 용어로 쓰지 않는다.

---

## 9. Open Questions / TBD

PRD §26, `11-decision-status` §2–3, with_AC FR 메모. **여기서 해결하지 않는다.**

### PRD에서 일부 TBD인 FR

- **FR-07:** 임시 저장 동작은 있음. 공유 객체 **비로그인 열람** 가능 여부는 네이버 정책 TBD.
- **FR-08:** 결과 후 로그인 방향은 있음. 실제 로그인 시점·비로그인 열람이 TBD라 나머지 AC 미작성.
- **FR-15:** 0건 분기 로직은 있음. **A-13b-2 화면 상세** TBD.
- **FR-16:** 필터 자동 적용 금지·전달 규칙은 있음. **네이버 파라미터·count** TBD.
- **FR-23:** 방문 후 기록 동작은 있음. **단계 2 스냅샷 보관 기간** TBD.

전체 TBD FR: **없음**.

### 네이버 내부 확인

- 관심매물 조회 API 존재·권한
- 공유 객체 비로그인 열람
- 검색 결과 수 조회·부하, 필터 URL 파라미터
- 경로 API 비용·쿼터
- 관심매물 장기 방치 baseline

### 팀이 정해야 하나 아직 없는 것

- 실연비·통행료 입력 위치, 입주 목표일, 닉네임
- 매물 사진 노출 범위, 지도 핀 라벨, 점 플롯 축
- 관계 종료 시 데이터 처리, 개인정보 상대 공개 범위
- 관리비 추정 범위, 금리 갱신 주기
- H3 입력 완료 구간의 최신 정의, North Star 7일 적정성

---

## 10. PRD / Acceptance Criteria Status

`prd_v0.1_20260820_with_AC.md` 요약표와 Workbook `09_PRD_Requirement_Trace`를 대조한 값.

| 항목 | 값 |
|---|---|
| FR | 25 (FR-01~FR-25) |
| 작성 완료 AC | 56 |
| 확정 FR | 20 |
| 일부 TBD FR | FR-07, FR-08, FR-15, FR-16, FR-23 |
| 전체 TBD FR | 없음 |

추적: `09_PRD_Requirement_Trace`에서  
**Value Proposition → 사용자 문제 → FR-01~FR-25 → Acceptance Criteria → 근거 문서 → 상태**  
가 한 행에 연결된다. AC 문구는 with_AC PRD 원문이다. TBD 메모를 해결한 것처럼 지우지 않았다.

---

## 11. AI Usage / Human Validation

기준: `03_Decision_AI_Usage_Log.xlsx` → `02_AI_Usage`.  
**AI가 최종 의사결정을 했다고 쓰지 않는다.** 사용자가 방향 설정, 최신 원문 확인, 충돌 수정, 결과 검수를 담당했다.

| 도구 | 확인된 역할 | 하지 않은 것 |
|---|---|---|
| **ChatGPT / Work** | VP·PRD·AC·Master Deck 원고의 구조화·작성 보조. 새 근거를 사실처럼 넣지 않도록 작성 | 최종 판단, 미검증 효과의 Fact 승격 |
| **Cursor** | repo pull/handoff ZIP, 정합성 검토, Workbook/Decision Log 생성, AC Trace 연결. repo는 읽기 전용 | 원본 수정, commit, push |
| **Claude** | git trailer `Co-Authored-By: Claude Opus 5`만 사실 | 구체 작업 범위는 **원문 미확인**. 추측하지 않음 |

README의 `ChatGPT - 역기획.pdf` 표기는 별도 행이다. 현재 트리에 PDF 파일이 없고, 본문 흡수 범위는 원문 미확인이다.

사람이 확인한 사례(로그에 기록됨): commit `10b64551`과 decision-status 우선, 출근 입력 순서 정리, H2-b-1/H2-b-2 분리, TBD 미해결, 총점·AI 최종결정 비채택, AC는 FR 범위를 넓히지 않는 최소 완료조건.

---

## 12. Modification Rules for Future Humans / AI

1. 이 README부터 읽는다.
2. 최신 `docs/11-decision-status.md` / VP / with_AC PRD / decisions를 확인한다.
3. 파일에 없는 내용을 자동 보완하지 않는다.
4. `확정 / 근거 있음 / 추론 / 가설 / TBD / 제출용 후속작성` 상태를 유지한다. 가설을 Fact로 바꾸지 않는다.
5. Locked Decision을 바꿀 때는 이유, 영향 범위, 어떤 파일을 함께 고칠지를 기록한다.
6. Deck/PDF 문구만 보고 제품 정책을 새로 정의하지 않는다.
7. H2-b-2를 Fact로 바꾸려면 **별도 검증 근거**가 필요하다.
8. 총점형 추천, AI 최종결정, 강제 타협, 매물 DB/탐색 보드를 임의로 추가하지 않는다.
9. FR/AC를 바꾸면 `02_Evidence_Analysis_Workbook.xlsx`의 `09_PRD_Requirement_Trace`도 함께 갱신한다.
10. PRD를 바꾸면 Master Deck 원고와 PDF/PPTX 정합성을 확인한다.
11. 분석 repo는 읽기 전용이다. 충돌을 고치려고 commit/push 하지 않는다.
12. 출근 입력은 항상 `예산 → 출근 여부 → 해당자 출근지`로 유지한다.

---

## 13. Version Snapshot

| 항목 | 값 |
|---|---|
| 기준 commit | `10b64551ed10a88616791b3a9798f53b50b01ed9` |
| 기준 handoff | `real-estate-joint-decision_CHATGPT_HANDOFF_20260820_1333.zip` (최종 제출 폴더에는 미포함) |
| repo branch | `soyoung2222` |
| repo working tree (README 작성 시) | clean |
| 최종 산출물 작성일 | 2026-08-20 |
| 최종 Deck 페이지 수 | PDF 30 / PPTX 30 / 원고 30장 |
| 최종 PDF | `서비스_역기획서.pdf` |
| 최종 PPTX | `서비스_역기획서.pptx` |
| VP 정본 | `value-proposition_20260820.md` |

확인하지 않은 값(제출 팀명, 평가 마감, PDF 내부 메타데이터 작성자 등)은 적지 않는다.
