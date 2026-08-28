/goal

## 1) 작업 핵심 목표 및 범위

- **목표:** `SRS_project/tasks/v2/prototype-suggestion-lite.md`의 Scope L 12건을 구현해 로컬에서 전 동선이 클릭 가능한 시각 프로토타입을 만들고, `aztks-agent`가 `MODE: EVALUATE`로 반환한 스코어카드가 **`VERDICT: GO` 이면서 `SCORECARD: A:P Z:P T:P K:P S:P`(5축 전부 PASS)** 인 출력을 대화에 그대로 남긴다.
- **시작 지점:** `main` 브랜치(코드 0줄, 문서만 존재). `C-000` 착수 지점이다.
- **작업 대상:**
  - 범위·순서·정지 조건: `SRS_project/tasks/v2/prototype-suggestion-lite.md` (Scope L 12건 = C-000·C-001·C-002·V-002·X-001·J-008·R-001·R-002·V-001·I-001·S-001·S-003)
  - 화면·표기·데이터 확정값: `SRS_project/tasks/v2/prototype-visual-spec.md` (§1.2 매핑표에서 **범위 열이 `L`인 화면만**)
- **작업 자율성:** 사용자 승인을 받기 위해 멈추지 않고 종료 조건까지 자율 진행한다. 단 §4의 금지 행동은 예외 없이 지킨다.

## 2) 작업 세부 규칙

- **세부 규칙은 아래 두 문서를 읽고 그대로 적용한다. 문서와 어긋나는 판단을 하지 않는다.**
  - `SRS_project/tasks/v2/prototype-suggestion-lite.md` — §2 범위 12건, §3 5스텝 사다리, §4 로컬 실행 조건, §5 시나리오 스위처, §6 담아야 할 화면 상태, §7 검수, §8 정지 조건, §9 금지
  - `SRS_project/tasks/v2/prototype-visual-spec.md` — §1.2 라우트↔PRD 화면 ID 매핑, §2 폼팩터, §3 중립 셸, §4 판정 표시 문법, §5 전제 공개, §6 픽스처 확정 수치, §7 재탐색 필터, §8 선호 카드, §9 정렬
- **구현 순서는 lite 문서 §3의 5스텝 사다리를 그대로 따른다.** 스텝을 건너뛰거나 순서를 바꾸지 않는다.
  - Step 0 기반 → Step 1 판정 화면 → Step 2 trade-off·완화 → Step 3 2라운드 → Step 4 진입 맥락
  - **`V-002`를 `J-008`보다 먼저 만든다** — 총점 prop이 없는 컴포넌트 API가 먼저 서야 판정 화면에 총점이 스며들지 않는다.
- **값을 지어내지 않는다.** 매물 5건·통근시간·실부담·조건 세트 6벌은 `prototype-visual-spec.md` §6의 확정 수치를 그대로 쓴다. 표와 어긋나면 구현이 아니라 표를 먼저 확인한다.
- **앱 전체는 저장소 루트가 아니라 `SRS_project/prototype/` 하위에 둔다** — 이 저장소 루트에는 기획 문서 60여 개가 있어 앱 설정 파일과 섞이면 읽기 어렵다(2026-08-27 사용자 결정).
  - `SRS_project/prototype/` **안의** 구조는 `SRS_V0_9.md` §2.2를 그대로 따른다 — `src/` 없이 `app/`, `components/`, `lib/`, `prisma/`. `create-next-app` 실행 시 `--no-src-dir`.
  - 모든 `pnpm` 명령은 `SRS_project/prototype/` 에서 실행한다.
- **URL 규칙 — 새 화면 ID를 만들지 않는다:**
  - 화면은 `?state=<PRD 화면 ID>` 로만 지정한다(명세 §1.1). PRD에 없는 ID를 새로 짓지 않는다.
  - PRD가 ID를 부여하지 않은 하위 상태는 **보조 쿼리 파라미터**로 표현한다 — `?state=A-16&match=2`, `?state=A-13&set=one-commute`, `?state=B-01&invite=expired`, `?state=A-04&form=empty`.
- **기록 — `SRS_project/prototype/reports/PROTOTYPE_LOG.md` 를 작업 시작 시 만들고 아래를 append 한다:**
  - 스텝 완료 시: `STEP <N> DONE: <구현 항목> | 검수 <lite §7 해당 질문 번호> = <예/아니오 목록>`
  - 검수 질문 1(총점·순위·추천 배지 부재)은 **매 스텝 반복**하고 매번 기록한다.
  - EVALUATE 디스패치마다: `EVAL #<N>: VERDICT=<...> SCORECARD=<...> TOP_FIX=<...>`
  - 종료 시: `STOP REASON: <코드>`
- **이슈·브랜치·PR — 스킬 `200-git-commit-push-pr` §2 본문을 따른다. §2.1의 main 직푸시 예외는 이 작업(C-000 착수)으로 종료된다.**
  1. 착수 시 `"$GH" issue create --title "[proto] Scope L 시각 프로토타입" --body "<lite 문서 §2 범위 12건 요약>"` 로 이슈를 만들고 번호를 받는다.
  2. 브랜치 `feat/<이슈번호>-proto-lite-scope-l` 하나로 진행한다. **이 브랜치의 단일 목적은 "Scope L 프로토타입 1벌"이며**, 12건은 그 하나를 이루는 부분이라 브랜치를 나누지 않는다.
  3. 커밋 단위 = 5스텝 사다리의 한 스텝. 메시지는 `[feat] <스텝 내용> (Step N)`.
  4. PR은 **Draft로만** 연다. `main`에 머지하지 않는다.

## 3) 종료 조건 및 종료 방법

- **종료 조건 (아래 중 하나라도 충족되는 순간 루프를 즉시 멈춘다):**
  - `aztks-agent` EVALUATE 출력이 `VERDICT: GO` **이고** `SCORECARD`의 5축이 전부 `P` → **STOP REASON: GOAL_MET**
  - `aztks-agent` EVALUATE 디스패치 누적 **8회** 도달 → **STOP REASON: EVAL_BUDGET**
    - **2026-08-27 사용자 지시로 5회 → 8회 상향.** 5회를 소진했을 때 실제 판정을 받은 것은 3회뿐이었다 — #3은 디렉터리 이동으로 중단, #4는 세션 한도(API 오류)로 실패해 둘 다 평가 내용과 무관하게 예산만 소모했다. 예외 규칙을 두지 않고 상한만 올린 것이므로, **인프라 실패도 여전히 예산을 소모한다.**
  - 평가-진행 라운드(turn = `/goal` 평가자가 진행 상태를 한 번 점검하는 메인 에이전트 응답 사이클)가 누적 60회 도달 → **STOP REASON: TURN_CAP** (= or stop after 60 turns)
  - §7 사전 조건 확인이 실패해 착수 자체가 불가능 → **STOP REASON: PREREQ_MISSING**
- **종료 방법:**
  1) `SRS_project/prototype/reports/PROTOTYPE_LOG.md` 마지막 줄에 `STOP REASON: <원인 코드>` 한 줄을 덧붙인다.
  2) `cd SRS_project/prototype && pnpm typecheck && pnpm lint && pnpm build` 를 실행해 **세 명령 모두 exit 0** 인 출력을 대화에 남긴다.
  3) 총점 금지 검사를 실행해 대화에 남긴다. **원본 grep과 주석 제외 grep을 모두** 보인다 — 가드레일 주석("총점·추천 배지를 두지 않는다")이 패턴에 걸리므로, 원본만으로는 0이 나올 수 없고 숨기면 검사를 약화시키는 것이 된다.
     ```bash
     PAT="totalScore|totalPoint|overallScore|compositeScore|종합 ?점수|공동 ?적합도|추천 ?배지|복합 ?순위"
     grep -rnIE "$PAT" SRS_project/prototype/app SRS_project/prototype/components SRS_project/prototype/lib                      # 원본 — 걸린 줄이 전부 주석인지 눈으로 확인
     grep -rnIE "$PAT" SRS_project/prototype/app SRS_project/prototype/components SRS_project/prototype/lib        | grep -vE ':[0-9]+: *(\*|//|/\*|\{/\*)'                # 실코드 — 반드시 0
     grep -rnE "(score|rank|recommended|winner|sortBy)\s*[?:]" SRS_project/prototype/components/domain SRS_project/prototype/lib/types  # 금지 prop — 반드시 0
     ```
     **실코드 0건**과 **금지 prop 0건**이 통과 조건이다. 세 디렉터리가 모두 존재하는 상태에서 실행한다(`ls -d SRS_project/prototype/app SRS_project/prototype/components SRS_project/prototype/lib`).
  4) `find SRS_project/prototype/reports/prototype-screens -name '*.png' | wc -l` 를 실행해 **36** 가 출력되는 것을 대화에 남긴다(§6의 36개 상태). 이어서 `ls SRS_project/prototype/reports/prototype-screens | head -3` 로 파일명에 `__<RUN_TS>` 가 붙어 있는지 대화에 남긴다.
  5) `cat SRS_project/prototype/reports/PROTOTYPE_LOG.md` 를 실행해 스텝별 검수 결과·`EVAL #N` 줄·`STOP REASON:` 줄이 보이는 출력을 대화에 남긴다.
  6) **마지막 `aztks-agent` EVALUATE 출력 5줄(`VERDICT` / `SCORECARD` / `TOP_FIX` / `EVIDENCE` / `NOTES`)을 요약하지 말고 그대로 대화에 붙여넣는다.**
  7) `"$GH" pr list --draft` 를 실행해 열린 Draft PR 목록을 대화에 남긴다.

## 4) 기타 제약조건

- **수정 금지 파일·디렉터리** (읽기만 한다):
  - `SRS_project/tasks/v2/prototype-suggestion.md` · `prototype-suggestion-lite.md` · `prototype-visual-spec.md`
  - `SRS_project/SRS_V0_9.md` · `SRS_project/같이보기-prd-v1_0.md` · `SRS_project/같이보기-srs-v1_0.md`
  - `SRS_project/tasks/v2/TASK-마스터-리스트.md` · `[태스크 리스트] 같이보기.md` · `[총괄] *.md` · 개별 `{Task ID}-*.md`
  - `SRS_project/grill/GRILL_LEDGER.md` · `SRS_project/goals/prototype-lite-ux-validated.md`
- **금지 행동:**
  - `main` 직접 커밋·force push를 하지 않는다.
  - ~~어떤 PR도 `main`에 머지하지 않는다.~~ **2026-08-27 사용자 지시로 해제** — 저장소 기본 화면에서 프로토타입이 보여야 해 PR #56을 `main`에 머지했다. 평가가 아직 5축 전부 `P`에 도달하지 않은 상태로 진입한 것이며, 완료 조건(§3)은 그대로다 — 머지는 목표 달성을 대체하지 않는다.
  - **총점·복합순위·공동 적합도·추천 배지를 산출하거나 렌더하는 코드를 만들지 않는다.** 픽스처에 `totalScore`·`rank`·`recommendation` 필드를 넣지 않는다.
  - **Server Action 본문을 쓰지 않는다.** 프레젠테이션 계층만 만든다.
  - **DB에 연결하지 않는다.** `supabase start`·`prisma migrate` 를 실행하지 않는다(`prisma generate`만 쓴다).
  - `F-001`·`F-003`(현장 기록, 1-B)과 Scope B 6건(`S-002`·`I-002`·`R-003`·`V-003`·`X-002`·`D-001`)을 구현하지 않는다.
  - 정렬 컨트롤(드롭다운·탭·토글)을 만들지 않는다(명세 §9).
  - 네이버 로고·CI 색상·상표·실제 UI 마크업을 복제하지 않는다(명세 §3.4).
  - 새 의존성·인프라를 도입하기 전에 스킬 `300-tech-constraints-guardrails`를 먼저 읽는다.
- **활성 범위 외 변경 금지.** 단 `SRS_project/prototype/` 전체와 `.claude/` 는 예외로 허용한다.

## 5) aztks-agent 평가 규칙

- **디스패치 형식** — Task 도구로 `subagent_type: "aztks-agent"` 를 호출하고 프롬프트 첫 줄에 `MODE: EVALUATE` 를 넣는다. 평가는 **읽기 전용**이며 코드를 수정하지 않는다.
- **평가 대상:** 구현된 프로토타입 전체(`SRS_project/prototype/app/`, `SRS_project/prototype/components/`, `SRS_project/prototype/lib/`)와 `SRS_project/prototype/reports/prototype-screens/` 의 화면 캡처 32장.
- **근거 소스로 함께 전달한다:**
  - `SRS_project/같이보기-prd-v1_0.md` §5(JTBD) · §7(가치 제안) · §11(E2E 17단계) · §13(비교 모델) · §14(trade-off·완화 모델) · §17(화면 요구)
  - `SRS_project/tasks/v2/prototype-visual-spec.md` 전체
  - `SRS_project/tasks/v2/prototype-suggestion.md` §5.2(검수 질문 8개)
  - `SRS_project/prototype/reports/PROTOTYPE_LOG.md`
- **5축 판정 앵커** — 각 축을 아래 근거로만 판정하게 한다:

  | 축 | 판정 기준 |
  | --- | --- |
  | **A 알아서** | PRD §7 가치 제안과 §5 Core Job이 화면 흐름에서 실제로 전달되는가. §11 E2E 17단계 중 Scope L 담당 구간(2 후보 선택 · 3 A 기본 입력 · 4 A 통근 입력 · 7 B 진입 · 8 B 기본 입력 · 10 첫 결과 · 11 상세 비교 · 12 조건 완화 · 13 0건 분기 · 14 방문 후보 선택)이 캡처상 끊기지 않고 이어지는가 |
  | **Z 잘** | `prototype-suggestion.md` §5.2 검수 질문 8개가 캡처 기준으로 전부 "예"인가. 명세 §6.6·§6.7 판정 검증표와 실제 렌더 결과가 일치하는가. typecheck·lint·build가 통과하는가 |
  | **T 딱** | Scope L 12건 대비 누락·초과가 없는가. 명세 §1.2에서 `L`로 표시된 화면이 전부 존재하고 범위 밖(`—`·Scope B·1-B) 화면이 만들어지지 않았는가. 명세 §4·§5 표기 규칙 위반이 0건인가 |
  | **K 깔끔** | `SRS_project/prototype/lib/dev/` 경계가 유지되는가(`lib/domain/`·`lib/queries/`에 섞이지 않음). 화면이 `SRS_project/prototype/lib/types/contracts.ts` 외 타입을 스스로 선언하지 않는가. 픽스처 주입 지점이 화면당 정확히 1곳인가 |
  | **S 센스** | `?state=` URL 목록만으로 팀이 검수를 수행할 수 있는가. 원 순번(`J-006`·`R-001`·`V-001` 등)에서 픽스처를 실제 Query로 교체할 지점이 명확한가. `PROTOTYPE_LOG.md` 만으로 중단 지점부터 이어받을 수 있는가 |

- **완전 통과 기준:** `VERDICT: GO` **이면서** `SCORECARD`의 5축이 전부 `P`. `CONCERN(C)`이 하나라도 있으면 통과가 아니다.
- **재평가 절차:** 통과하지 못하면 `TOP_FIX` **한 건만** 반영하고 다시 디스패치한다.
- **매 평가 직후 스코어카드 5줄을 요약하지 말고 그대로 대화에 붙여넣는다** — 평가자가 transcript로 판정할 수 있어야 한다.

## 6) 화면 캡처 규칙 — 36장

- 스킬 `webapp-testing`(Playwright)으로 `pnpm dev` 기동 상태에서 아래 36개 상태를 캡처해 `SRS_project/prototype/reports/prototype-screens/<파일명>__<RUN_TS>.png` 로 저장한다.
- **`<RUN_TS>` 는 캡처 실행 시각**이며 `YYYYMMDD-HHmm` 형식이다(예: `A-13__20260827-1432.png`). 한 번의 캡처 실행에서는 32장이 **같은 `<RUN_TS>`** 를 쓴다.
- **캡처 실행 전 `SRS_project/prototype/reports/prototype-screens/` 를 비운다.** 이전 실행분이 남으면 §3.4의 32장 검증이 깨진다.
- `RUN_TS` 값을 `SRS_project/prototype/reports/PROTOTYPE_LOG.md` 에 `CAPTURE RUN: <RUN_TS> (32 shots)` 한 줄로 기록한다.
- 뷰포트는 명세 §2.1을 따른다 — `A-*`는 1280px, `B-*`는 390px.
- **36장이 모두 저장되기 전에는 `aztks-agent`를 디스패치하지 않는다.** 캡처가 없으면 UX 흐름을 판정할 근거가 없다.

| # | 파일명 (뒤에 `__<RUN_TS>` 가 붙는다) | URL 쿼리 | 화면 |
| --- | --- | --- | --- |
| 1 | `A-01` | `?state=A-01` | 기능 진입 |
| 2 | `A-02` | `?state=A-02` | 후보 선택 1~5개 |
| 3 | `A-02a` | `?state=A-02a` | 관심매물 0개 |
| 3-1 | `A-02b` | `?state=A-02b` | 후보 1~2개 — 진행 허용 + 안내(PRD §18.2) |
| 3-2 | `A-02c` | `?state=A-02c` | 6개째 차단 |
| 4 | `A-03` | `?state=A-03` | 출퇴근 분기 |
| 5 | `A-03d` | `?state=A-03d` | 출근 안 함 정상 경로 |
| 6 | `A-04` | `?state=A-04` | 예산 입력 |
| 7 | `A-04__form-empty` | `?state=A-04&form=empty` | 예산 미입력 시 저장 차단 |
| 8 | `A-04a` | `?state=A-04a` | 전제 패널 11종 |
| 9 | `A-05` | `?state=A-05` | 첫 결과 미리보기 |
| 10 | `B-03` | `?state=B-03` | B 기본 입력(모바일) |
| 11 | `B-04` | `?state=B-04` | B 통근 입력(모바일) |
| 12 | `A-12` | `?state=A-12` | 1인 빈 경로 |
| 13 | `A-13` | `?state=A-13` | 3분류 목록 + 확인 필요 + 계산 불가 |
| 14 | `A-13__set-one-commute` | `?state=A-13&set=one-commute` | 한쪽만 `해당 없음` → 행 유지 |
| 15 | `A-13__set-no-commute` | `?state=A-13&set=no-commute` | 둘 다 `해당 없음` → 행 제거 |
| 16 | `A-13b` | `?state=A-13b` | 전부 불충족, 한 조건 완화로 회복 가능 |
| 17 | `A-13b-2` | `?state=A-13b-2` | 재탐색 필터 제안(결과 수 미표시) |
| 18 | `A-13c` | `?state=A-13c` | 후보 집합 내 조건 충돌 설명 |
| 19 | `B-05` | `?state=B-05` | B의 첫 결과(모바일) |
| 20 | `A-14a` | `?state=A-14a` | 상세 — 둘 다 충족 |
| 21 | `A-14b` | `?state=A-14b` | Hero trade-off(한쪽만 충족) |
| 22 | `A-14c` | `?state=A-14c` | 상세 — 둘 다 불충족 |
| 23 | `A-14d` | `?state=A-14d` | 상세 — 보류(확인 필요) |
| 24 | `A-14e` | `?state=A-14e` | 상세 — 상대 미입력 |
| 25 | `A-15` | `?state=A-15` | 조건 완화 A안·B안 |
| 26 | `A-16__match-2` | `?state=A-16&match=2` | 2개 일치 → 확정 |
| 27 | `A-16e` | `?state=A-16e` | 1개 일치 → 남은 한 자리 Option Grid |
| 28 | `A-16__match-0` | `?state=A-16&match=0` | 0개 일치 → 2라운드 |
| 28-2 | `A-16__match-split` | `?state=A-16&match=split` | 2라운드도 불일치 → **분할 종료**(AC-17-03 · `decisions/0004`) |
| 29 | `B-01` | `?state=B-01` | 초대 진입(모바일) |
| 30 | `B-01__invite-expired` | `?state=B-01&invite=expired` | 초대 만료·존재하지 않음 |
| 31 | `B-02` | `?state=B-02` | 조건 입력 전 맥락(모바일) |
| 32 | `S-02` | `?state=S-02` | 계산 불가 표시 |
| 33 | `S-03` | `?state=S-03` | 경로 없음 — 계산불가/해당없음/미충족 3자 구분 |

- `S-01`(로딩)만 캡처 대상에서 제외한다 — 순간 상태라 재현이 불안정하다. 코드로는 `app/loading.tsx`에 존재한다.
- `A-02a`·`S-03`은 EVAL #1의 T:F 지적(명세 §1.2에서 `L`인데 코드 참조 0건)을 반영해 캡처 대상에 추가했다. 그래서 32 → 34장이다.

## 7) 사전 조건 (착수 첫 턴에 확인)

- **툴체인은 2026-08-27 설치 완료 상태다.** 착수 첫 턴에 아래를 실행해 대화에 출력을 남긴다.

```bash
node --version   # v24.19.0
pnpm --version   # 11.24.0
```

- **PATH 주의 (실측 확인됨):** `C:\Program Files\nodejs` 와 `%APPDATA%\npm` 을 사용자 PATH에 등록했으나 **먼저 열려 있던 셸 세션에는 반영되지 않는다.** 위 명령이 실패하면 Git Bash에서 아래 한 줄을 먼저 실행한다.

```bash
export PATH="/c/Program Files/nodejs:/c/Users/USER/AppData/Roaming/npm:$PATH"
```

  - **POSIX 경로로 써야 한다.** `$APPDATA` 를 그대로 PATH에 넣으면 Git Bash가 `C:\Program Files\Git\Users\...` 로 잘못 변환해 `pnpm` 이 자기 모듈을 찾지 못한다.
  - `pnpm` 은 셸 스크립트라 내부에서 `node` 를 PATH로 찾는다 — `pnpm.cmd` 만 전체 경로로 불러서는 동작하지 않는다. 반드시 PATH에 `nodejs` 를 넣는다.
- **`gh` 도 PATH 밖이다.** `GH="/c/Program Files/GitHub CLI/gh.exe"` 전체 경로로 호출한다. 인증(`soobworks`)은 완료돼 있다.
- 위 확인이 모두 실패하면 구현을 시작하지 말고 **STOP REASON: PREREQ_MISSING** 으로 종료한다.
- 스캐폴드 시 TypeScript·Tailwind·ESLint를 포함하고, `package.json` 에 `typecheck` 스크립트(`tsc --noEmit`)와 `lint` 스크립트가 있는지 확인한다. 없으면 추가한다.
