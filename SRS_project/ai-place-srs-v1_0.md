# [SRS 문서] ai-place (한글)

# [SRS 문서] ai-place

# 소프트웨어 요구사항 명세서 (SRS)

**문서 ID:** SRS-JOINTHOME-MVP-001

**개정 버전:** 1.0

**날짜:** 2026-08-24

**표준:** ISO/IEC/IEEE 29148:2018 — Systems and software engineering — Life cycle processes — Requirements engineering, Clause 9.6 (Software requirements specification content)

**기준 PRD:** `ai-place-prd-v1_0.md` (네이버 부동산 공동 주거 의사결정 기능 PRD)

**문서 구성 원칙:** §1~§7은 팀이 지정한 예시 SRS 템플릿(`[SRS 문서] AD-Core-Platform (한글).md`)과 동일한 포맷·범위로 작성했다. PRD 내용 중 그 템플릿의 범위를 벗어나는 부분은 §8~§12로 별도 확장했으며, 각 장은 ISO/IEC/IEEE 29148:2018 §9.6의 해당 조항을 표준 근거로 인용한다. 새 챕터는 PRD에 이미 작성된 내용만을 재구성한 것이며 새로운 요구사항을 만들지 않는다.

---

## 1. 서론

### 1.1 목적

본 문서는 ISO/IEC/IEEE 29148:2018 표준에 따라, **네이버 부동산의 관심매물 저장 이후 구간에서 동작하는 2인 공동 주거 의사결정 기능(같이 고르기)**의 소프트웨어 요구사항을 정의한다. 본 SRS는 PRD v0.2의 기능·비기능 요구사항, 데이터 모델, 검증 계획을 구현 가능한 요구사항 단위로 재정리한 것이며, PRD의 결정 사항(`decisions/0001~0004`)을 임의로 변경하지 않는다.

### 1.2 범위

- 조건은 매물이 아니라 **사람에 귀속**되는 조건 모델 (예산 필수 + 출퇴근 조건부 + 추가 필수 0~4개)
- 조건별 실제값·임계값·미달량을 산출하는 **매물별 자동 판정** (충족/미충족/확인 필요/계산 불가/해당 없음 5분류)
- 한쪭만 충족하는 매물에 대한 **양보 문장(Trade-off) 생성** — 총점·순위 없이 문장으로만 서술
- 실제 미달량 기준의 **조건 완화 시뮬레이션**과 상대 조건 완화 제안(제안-수락 구조)
- 전부 불충족 시 **완화 우선 → 네이버 재탐색 필터 제안**의 2단계 구제 로직
- 겹치면 확정, 안 겹치면 최대 2라운드 내 분할로 종료하는 **방문 후보 2개 결정 프로토콜**
- 방문 전 중개사 질문 카드와 방문 후 공통 체크리스트를 포함한 **단계 2(현장 기록)**
- 네이버 관심매물 조회·경로 계산·검색 결과 수·필터 전달을 포함한 **네이버 내부 API 연동** (매물 데이터 쓰기 없음)
- A(PC 웹)·B(모바일 웹) 분리 접근과 **B 비로그인 임시 조건 보관(+30일)**

### 1.3 정의, 약어, 축약어

| 용어 | 정의 |
| --- | --- |
| 공유 객체 (Shared Space) | 두 사람의 비교 후보(매물 ID 최대 5개)와 연결 상태를 담는 프로젝트 데이터. A의 개인 관심매물이 아니다 |
| 사람귀속 조건 (Person-owned Condition) | 조건은 매물이 아니라 사람에 저장된다는 설계 원칙(`decisions/0003`) |
| 판정 (Judgment) | 충족·미충족·확인 필요·계산 불가·해당 없음 5개 상태로 구성된 조건별 대조 결과 |
| 미달량 (Gap Amount) | 사용자 기준값과 매물 실제값의 차이 (예: `+월 15만`, `−7㎡`) |
| 양보 문장 (Compromise Sentence) | 한쪽만 충족 매물에서 누가 무엇을 얼마나 감수하는지 서술하는 문장. 총점으로 합산하지 않는다(`decisions/0001`) |
| 2라운드 분할 프로토콜 | 방문 후보 2개 결정 시 겹치면 확정, 안 겹치면 최대 2라운드 내 분할로 끝내는 규칙(`decisions/0004`) |
| North Star | 초대 발송 후 7일 내 방문 후보 2개가 확정된 비율 |
| MoSCoW | Must / Should / Could / Won't 우선순위 분류 |
| 가드레일 지표 | 주요 지표 개선이 부작용(헛방문, 이탈, 재입력)을 유발하는지 감시하는 보조 지표 |
| E2E 응답 시간 | 초대 링크 클릭부터 B의 첫 화면 응답까지 걸리는 시간 |
| 확인 필요 (Confirmation Needed) | 매물 데이터에 없어 자동 판정할 수 없는 항목의 상태. 미충족으로 처리하지 않는다 |
| 계산 불가 (Calculation Failed) | 경로·데이터 계산을 시도했지만 실패한 상태. 미충족과 구분한다 |

---

## 2. 이해관계자

| 역할 | 이름 / 부서 | 책임 |
| --- | --- | --- |
| 기획 매니저 (PM) | 기획팀 | 요구사항 수집 및 MoSCoW 우선순위 결정(PRD §16.2) |
| 기획 분석가 (IT) | 기획팀 | 상세 요구사항 문서화, PRD-SRS 정합성 관리 |
| 개발팀 리드 | 백엔드 팀 리드 | 판정 엔진·가드레일 설계 검토 및 승인 |
| 개발 엔지니어 | 백엔드 개발자 | 조건 모델·판정·완화·방문 후보 로직 구현 및 단위 테스트 |
| 시스템 운영자 | 운영팀 | 네이버 내부 API 연동(관심매물·경로·검색) 배포 및 모니터링 |
| 서비스 운영자 | 운영팀 | 단계 2(중개사 질문·방문 후 기록) 운영, 상대 이탈 예외 처리 |
| 사업관리 및 정책 담당자 | 사업팀 | 네이버 정책 확인(비로그인 열람, 검색 count), 개인정보 공개 범위 정책 |
| 데이터/그로스 매니저 | 그로스팀 | North Star·가드레일 지표 측정, H1·H2-b-2 검증 설계 |

---

## 3. 시스템 맥락 및 인터페이스

- **클라이언트 애플리케이션**
    1. A · PC 웹 `https://realestate.example.com/joint-decision/desktop`
    2. B · 모바일 웹 `https://realestate.example.com/joint-decision/mobile`
- **내부 마이크로서비스**
    - Shared Space Service : 공유 객체 생성, 초대 링크·코드 발급, 연결 상태 관리
    - Condition Service : 사람귀속 조건(예산·출퇴근·필수조건·선호·확인항목) 저장
    - Judgment Engine : 조건별 자동 판정 및 5분류 상태 산출
    - Compromise & Relaxation Service : 양보 문장 생성, 조건 완화 시뮬레이션, 완화 제안
    - Visit Selection Service : 방문 후보 2개 결정, 2라운드 분할 프로토콜
    - Field Record Service : 중개사 질문 카드(단계 2), 방문 후 체크리스트 기록
    - Notification Service : 상대 조건 입력·변경·제안·후보 변경 알림
- **외부 시스템**
    - 네이버 부동산 관심매물 조회 API (읽기 전용, 쓰기 없음)
    - 네이버 지도 경로 계산 엔진 (대중교통·자차)
    - 네이버 부동산 검색 결과 수·필터 전달 API
    - 카카오톡 등 초대 링크 전달 채널 (시스템 경계 밖, 통제 대상 아님)

### 3.1 시스템 맥락도

```mermaid
flowchart LR
    subgraph Client["클라이언트"]
        AW["A · PC 웹<br/>/joint-decision/desktop"]
        BW["B · 모바일 웹<br/>/joint-decision/mobile"]
    end
    subgraph Internal["내부 마이크로서비스"]
        SSS[Shared Space Service]
        CS[Condition Service]
        JE[Judgment Engine]
        CRS["Compromise &amp; Relaxation Service"]
        VSS[Visit Selection Service]
        FRS[Field Record Service]
        NS[Notification Service]
    end
    subgraph External["외부 시스템"]
        LISTAPI[관심매물 조회 API]
        ROUTEAPI[경로 계산 엔진]
        SEARCHAPI[검색결과수·필터 API]
        SHARECH[카카오톡 등 공유 채널]
    end

    AW --> SSS
    BW --> SSS
    SSS --> CS --> JE --> CRS --> VSS --> FRS
    JE --> NS
    NS --> AW
    NS --> BW
    SSS --> LISTAPI
    JE --> ROUTEAPI
    CRS --> SEARCHAPI
    SSS -. 초대 링크 .-> SHARECH -. 링크 클릭 .-> BW
```

---

## 4. 구체적 요구사항

### 4.1 기능 요구사항

| ID | 제목 | 출처 | 우선순위 | 유형 | 검증 방식 | 인수 기준 | 상태 | 담당자 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **REQ-FUNC-001** | 관심매물에서 비교 후보 구성 | PRD §13.2, FR-01 | Must Have | Functional | 1) 후보 1~5개 등록 테스트<br>2) 6개째 차단 검증<br>3) QA 검증 | A가 관심매물 중 1~5개를 선택하면 해당 매물 ID만 포함한 공유 객체 초안을 구성하고, 6개째는 추가되지 않아야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-002** | A 기본 조건 입력 | PRD §12.2, §12.6, FR-02 | Must Have | Functional | 1) 예산 필수 검증<br>2) 출퇴근 분기 테스트<br>3) QA 검증 | 예산 입력 없이는 기본 입력을 완료할 수 없고, `출근함` 선택 시에만 출근지·이동수단을 요청해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-003** | 점진적 조건 확장 | PRD §12.3, §12.6, FR-03 | Should Have | Functional | 1) 0~4개 추가 조건 테스트<br>2) 사람귀속 재판정 검증<br>3) QA 검증 | 추가 필수 조건은 한 번에 하나씩 추가되고 즉시 재판정되며, 사용자당 4개를 초과할 수 없다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-004** | 선호·확인 항목 분리 | PRD §12.4, FR-04 | Should Have | Functional | 1) 선호 카드 저장 테스트<br>2) 확인 항목 분리 검증<br>3) QA 검증 | 선호(0~3개)는 판정에 사용하지 않는 사람 카드로, 확인 필요 항목은 중개사 질문 목록으로 분리 저장해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-005** | 2인 초대 | PRD §11 단계6, `decisions/0002`, FR-05 | Must Have | Functional | 1) 링크·코드 발급 테스트<br>2) 대기 상태 검증<br>3) QA 검증 | 관계 유형 선택 후 링크(기본)·코드(보조)를 발급하고, B 참여 전까지 대기 상태를 표시해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-006** | B의 맥락 있는 진입 | PRD §11 단계7, FR-06 | Must Have | Functional | 1) 진입 순서 테스트<br>2) 맥락 표시 검증<br>3) QA 검증 | B가 조건을 입력하기 전에 후보 최대 5개와 A의 선호 카드를 먼저 표시해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-007** | B 조건 입력 및 임시 보관 | PRD §21.1, FR-07 AC-07 | Should Have | Functional | 1) 초대 코드별 격리 테스트<br>2) 30일 삭제 검증<br>3) QA 검증 | 비로그인 B의 조건은 초대 코드 단위로 격리 저장하고, 로그인 시 이관하며, 마지막 접근 +30일에 삭제해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-008** | 결과 후 로그인 | PRD §11.1, FR-08 | Should Have | Functional | 1) 로그인 시점 테스트<br>2) 정책 연동 검증<br>3) QA 검증 | 비로그인 열람이 허용되는 한, B는 첫 결과 확인 후 저장·재방문 시점에만 로그인을 요청받아야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-009** | 1인 빈 경로 | `decisions/0002`, FR-09 | Must Have | Functional | 1) B 미참여 시나리오 테스트<br>2) 1인분 표시 검증<br>3) QA 검증 | B 미참여 상태에서도 A는 자신의 조건만으로 실부담·판정(해당 시 통근)을 볼 수 있어야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-010A** | 매물별 자동 판정 — 예산(상한형) | PRD §12.3, §18.3, FR-10a | Must Have | Functional | 1) 예산 판정 단위 테스트<br>2) 계산불가 분리 검증<br>3) QA 검증 | 예산 상한과 실부담을 대조해 충족·미충족(미달량 포함) 또는 계산 불가를 산출해야 한다. FR-11 이하 판정 소비 기능의 선행 조건이다 | Proposed | 개발팀 리드 |
| **REQ-FUNC-010B** | 매물별 자동 판정 — 확장 조건(통근·역도보·면적·주차·매물유형) | PRD §12.3, §18.3, FR-10b | Must Have | Functional | 1) 4개 조건 유형 단위 테스트<br>2) 확인 필요 분리 검증<br>3) QA 검증 | 통근·역도보(상한형)·전용면적(하한형)·주차(유무형)·매물유형(일치형)을 대조해 충족·미충족·확인 필요를 산출해야 한다. REQ-FUNC-010A 완료 후 착수한다(PRD §16.2) | Proposed | 개발팀 리드 |
| **REQ-FUNC-011** | 후보 목록 그룹화 | PRD §13.2, FR-11 | Must Have | Functional | 1) 3분류 그룹화 테스트<br>2) 확인 필요 배지 검증<br>3) QA 검증 | 후보를 둘 다 충족/한쪽만 충족/둘 다 불충족으로 그룹화하고, 확인 필요는 별도 배지로 표시해야 한다 | Proposed | 개발팀 리드 |
| **REQ-FUNC-012** | 매물 상세 trade-off 설명 | PRD §14.1, §14.2, FR-12 | Must Have | Functional | 1) 양보 문장 생성 테스트<br>2) 조건 순서 고정 검증<br>3) QA 검증 | 한쪽만 충족 매물에 대해 양보 주체·조건·미달량과 후보 5개 안 상대적 이점을 문장으로 표시하고, 총점·추천 결론을 붙이지 않아야 한다 | Proposed | 개발팀 리드 |
| **REQ-FUNC-013** | 조건 완화 미리보기 | PRD §14.3, FR-13 | Should Have | Functional | 1) A/B안 동시표시 테스트<br>2) 실시간 미리보기 검증<br>3) QA 검증 | 완화폭은 실제 미달량에서만 산출하고, A안·B안을 항상 동시에 보여주며 등급 변화를 즉시 미리보기해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-014** | 상대 조건 완화 제안 | PRD §14.3, FR-14 | Should Have | Functional | 1) 제안-수락 흐름 테스트<br>2) 미적용 상태 검증<br>3) QA 검증 | 상대 조건은 직접 변경할 수 없고 제안만 가능하며, 상대가 수락하기 전까지 판정에 적용되지 않아야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-015** | 전부 불충족 분기 | PRD §14.3, FR-15 | Could Have | Functional | 1) 완화 시뮬레이션 테스트<br>2) 2조건 동시완화 금지 검증<br>3) QA 검증 | 둘 다 충족·한쪽만 충족 후보가 0개이면 조건 1개씩 완화를 시뮬레이션하고, 살아나는 후보가 있으면 그 경로만 제시해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-016** | 재탐색 필터 전달 | PRD §21.7, FR-16 | Could Have | Functional | 1) 필터 변환 규칙 테스트<br>2) 자동 적용 금지 검증<br>3) QA 검증 | 완화로 회복 불가할 때만 네이버 검색 필터를 제안하고, 사용자가 직접 클릭했을 때만 이동해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-017** | 방문 후보 2개 결정 | `decisions/0004`, FR-17 | Must Have | Functional | 1) 2라운드 분할 로직 테스트<br>2) 순환 방지 검증<br>3) QA 검증 | 각자 후보 2개 선택 결과가 겹치면 확정하고, 안 겹치면 최대 2라운드 내에 분할로 종료해야 한다(§4.1.2 다이어그램 참조) | Proposed | 개발 엔지니어 |
| **REQ-FUNC-018** | 조건 지속·자동 재판정 | PRD §12.1, FR-18 | Should Have | Functional | 1) 매물 교체 테스트<br>2) 사람 조건 유지 검증<br>3) QA 검증 | 매물이 추가·교체돼도 사람 조건은 유지되며 새 매물에 자동 재적용돼야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-019** | 매물 소진 처리 | PRD §18.1, FR-19 | Should Have | Functional | 1) 거래완료 감지 테스트<br>2) 복귀 로직 검증<br>3) QA 검증 | 거래완료·삭제 매물은 즉시 후보에서 제거하고, 확정 후보였다면 남은 한 자리 선택으로 복귀해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-020** | 상태·계산 오류 분리 | PRD §18.3, FR-20 | Must Have | Functional | 1) 4상태 분류 테스트<br>2) 오분류 회귀 검증<br>3) QA 검증 | 미충족/계산 불가/확인 필요/해당 없음을 서로 대체하지 않고 §4.1.1 결정 트리에 따라 산출해야 한다 | Proposed | 개발팀 리드 |
| **REQ-FUNC-021** | 숫자 전제 공개 | PRD §19.5, FR-21 | Must Have | Functional | 1) 전제 표시 테스트<br>2) 금지 표현 검증<br>3) QA 검증 | 실부담·교통비·금리 기반 수치는 예외 없이 기준 시점·가정·한계를 함께 표시해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-FUNC-022** | 중개사 질문 카드 | PRD §12.4, 단계 2, FR-22 | Could Have | Functional | 1) 질문 목록 생성 테스트<br>2) 답변 반영 검증<br>3) QA 검증 | 확인 필요 항목을 방문 전 질문 목록으로 표시하고, 답변 기록 시 보류 상태를 갱신해야 한다 | Proposed | 서비스 운영자 |
| **REQ-FUNC-023** | 방문 후 기록 | PRD §12.4, 단계 2, FR-23 | Could Have | Functional | 1) 체크리스트 저장 테스트<br>2) 유지·보류·제외 검증<br>3) QA 검증 | 공통 체크리스트 6항목을 전부 표시하고, 유지·보류·제외 상태를 매물에 귀속된 사용자 생성 기록으로 저장해야 한다 | Proposed | 서비스 운영자 |
| **REQ-FUNC-024** | 선택·조건 변경 알림 | PRD §17.4, FR-24 | Should Have | Functional | 1) 알림 트리거 테스트<br>2) 전달 지연 검증<br>3) QA 검증 | 조건 입력·변경, 완화 제안, 후보 변경·소진이 발생하면 상대에게 해당 상태 변화를 알려야 한다 | Proposed | 시스템 운영자 |
| **REQ-FUNC-025** | 균형 제시 가드레일 | PRD §13.3, `decisions/0001`, FR-25 | Must Have | Functional | 1) 시각적 비중 검증<br>2) 총점·추천배지 금지 회귀 테스트<br>3) QA 검증 | 판정·trade-off·최종 비교 화면은 A/B를 동일 비중으로 표시하고, 총점·추천 배지·복합 순위·AI 최종 선택을 표시하지 않아야 한다 | Proposed | 개발팀 리드 |

#### 4.1.1 판정 상태 결정 로직 (REQ-FUNC-010A, 010B, 020)

```mermaid
flowchart TD
    Q1{측정 대상이 존재하는가?} -- 아니오 --> R4[해당 없음 · 행 제거]
    Q1 -- 예 --> Q2{계산을 시도했는가?}
    Q2 -- 아니오 --> R3[확인 필요 · 질문 카드]
    Q2 -- 시도 후 실패 --> R2[계산 불가]
    Q2 -- 시도 후 성공 --> Q3{기준을 충족하는가?}
    Q3 -- 예 --> R1[충족]
    Q3 -- 아니오 --> R5[미충족 · 미달량 표시]
```

#### 4.1.2 방문 후보 2라운드 분할 로직 (REQ-FUNC-017)

```mermaid
flowchart TD
    S[각자 방문 후보 2개 선택] --> M{일치하는 후보 수}
    M -- 2개 일치 --> C1[확정 · North Star 달성]
    M -- 1개 일치 --> H[일치 1개 확정 + 남은 한 자리 재비교]
    H --> M2{재선택 결과 일치?}
    M2 -- 예 --> C1
    M2 -- 아니오 --> SPLIT1[각자 첫 선택으로 분할 확정]
    M -- 0개 일치 --> SPLIT2[각자 1순위 하나씩 분할 확정]
```

#### 4.1.3 전부 불충족 시 완화·재탐색 분기 (REQ-FUNC-015, 016)

```mermaid
flowchart TD
    E[둘 다 충족·한쪽만 충족 후보 0개] --> SIM[조건 1개씩 완화 시뮬레이션]
    SIM --> Q{한 조건 완화로 살아나는 후보 있음?}
    Q -- 예 --> RELAX[해당 조건 완화 경로만 제시]
    Q -- 아니오 --> RESEARCH[네이버 재탐색 필터 제안]
    RESEARCH --> COUNT{검색 결과 수 0건?}
    COUNT -- 예 --> NOPROPOSE[필터 제안 안 함 · 원인 조건 안내]
    COUNT -- 아니오 --> APPLY["사용자가 '이 필터로 찾아보기' 클릭 시에만 이동"]
```

#### 4.1.4 핵심 시나리오 시퀀스

```mermaid
sequenceDiagram
    participant A as A(초대자)
    participant Sys as System
    participant B as B(참여자)

    A->>Sys: 관심매물 중 후보 1~5개 선택
    A->>Sys: 예산 입력 · 출퇴근 여부 응답
    A->>Sys: 관계 유형 선택 후 초대 발송
    Sys-->>B: 초대 링크(+보조 코드) 전달
    B->>Sys: 링크로 진입
    Sys-->>B: 후보 목록 + A 선호 카드 표시
    B->>Sys: 예산 입력 · 출퇴근 여부 응답
    Sys->>Sys: 양쪽 조건으로 매물별 자동 판정 실행
    Sys-->>A: 판정 결과 · 양보 문장 표시
    Sys-->>B: 판정 결과 · 양보 문장 표시
    opt 조건 완화 제안
        A->>Sys: 완화 제안 발송
        Sys-->>B: 완화 제안 알림
        B->>Sys: 수락 또는 거절
    end
    A->>Sys: 방문 후보 2개 선택
    B->>Sys: 방문 후보 2개 선택
    Sys->>Sys: 2라운드 이내 일치·분할 판정
    Sys-->>A: 방문 후보 2개 확정
    Sys-->>B: 방문 후보 2개 확정
```

### 4.2 비기능 요구사항

| ID | 제목 | 출처 | 우선순위 | 유형 | 검증 방식 | 인수 기준 | 상태 | 담당자 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **REQ-NF-001** | E2E 응답 시간 ≤ 30초 (초대→B 첫 화면) | PRD §20.1, `04-benchmarks.md` | Must Have | Performance | 초대~B 첫 화면 응답시간 부하 테스트 | 초대 클릭부터 B의 첫 화면(B-02) 응답까지 P95 기준 30초를 넘지 않아야 한다 | Proposed | 시스템 운영자 |
| **REQ-NF-002** | 조건 완화 재계산 시 경로 API 재호출 0회 | PRD §20.1, §21.8 | Must Have | Performance | 완화 조작 1건당 API 호출 카운트 테스트 | 통근 임계값만 조정하는 완화 조작은 경로 API를 재호출하지 않고 클라이언트에서 즉시 등급을 재계산해야 한다 | Proposed | 개발 엔지니어 |
| **REQ-NF-003** | 처리량·비용 확장성: 경로 API 호출 캐시 | PRD §20.4 | Should Have | Scalability | `(출근지, 매물좌표, 이동수단)` 키 캐시 히트율 부하 테스트 | 1쌍당 약 39회, 규모 확대 시 월 최대 157만 호출까지 캐시로 흡수해 재진입·완화 시 호출 0회를 유지해야 한다 | Proposed | 개발팀 리드 |
| **REQ-NF-004** | 가용성: 네이버 내부 API 의존 및 폴백 | PRD §20.2, §18.3 | Must Have | Reliability | 외부 API 장애 주입 테스트 | 관심매물·경로·검색 API 실패 시 해당 결과를 미충족이 아닌 계산 불가로 표시하고, 관심매물 조회 실패 시 기능 진입을 막고 재시도를 안내해야 한다 | Proposed | 시스템 운영자 |
| **REQ-NF-005** | 보안: 공유 객체 접근 제어 | PRD §20.3 | Must Have | Security | 접근 제어·초대 코드 무작위성 감사 | 사람 조건은 초대된 두 사람만 열람 가능해야 하며, B 비로그인 조건은 초대 코드 단위로 격리하고 마지막 접근 +30일에 삭제해야 한다 | Proposed | 개발팀 리드 |
| **REQ-NF-006** | 정확성: 전제 없는 숫자 금지 | PRD §20.5, §19.5 | Must Have | Accuracy | 숫자 표시 화면 전수 검사 | 추정 수치는 예외 없이 기준 시점·가정·한계를 동반해야 하며, 확정값처럼 표시하지 않아야 한다 | Proposed | 개발 엔지니어 |
| **REQ-NF-007** | 유지보수성: 판정 조건 타입 확장 패턴 | PRD §12.3 | Could Have | Maintainability | 신규 조건 추가 코드 리뷰 | 신규 판정 조건은 상한형·하한형·유무형·일치형 4개 `ConditionType` enum 패턴을 통해 코드 변경을 최소화해 추가할 수 있어야 한다 | Proposed | 개발 엔지니어 |

---

## 5. 추적성 매트릭스

| 요구사항 ID | 모듈 | 구현 클래스 | 테스트 케이스 ID |
| --- | --- | --- | --- |
| REQ-FUNC-001 | Shared Space Service | CandidateListingSelector | TC-FUNC-001 |
| REQ-FUNC-002 | Condition Service | BudgetConditionValidator | TC-FUNC-002 |
| REQ-FUNC-003 | Condition Service | RequiredConditionEditor | TC-FUNC-003 |
| REQ-FUNC-004 | Condition Service | PreferenceCardStore / ConfirmationItemStore | TC-FUNC-004 |
| REQ-FUNC-005 | Shared Space Service | InviteCodeIssuer | TC-FUNC-005 |
| REQ-FUNC-006 | Shared Space Service | SharedSpaceContextRenderer | TC-FUNC-006 |
| REQ-FUNC-007 | Condition Service | TemporaryConditionStore | TC-FUNC-007 |
| REQ-FUNC-008 | Notification Service | PostResultLoginPrompt | TC-FUNC-008 |
| REQ-FUNC-009 | Shared Space Service | SoloPathRenderer | TC-FUNC-009 |
| REQ-FUNC-010A | Judgment Engine | BudgetJudgmentEvaluator | TC-FUNC-010A |
| REQ-FUNC-010B | Judgment Engine | ExtendedConditionEvaluator | TC-FUNC-010B |
| REQ-FUNC-011 | Judgment Engine | CandidateGroupClassifier | TC-FUNC-011 |
| REQ-FUNC-012 | Compromise & Relaxation Service | CompromiseSentenceGenerator | TC-FUNC-012 |
| REQ-FUNC-013 | Compromise & Relaxation Service | RelaxationSimulator | TC-FUNC-013 |
| REQ-FUNC-014 | Compromise & Relaxation Service | RelaxationProposalCoordinator | TC-FUNC-014 |
| REQ-FUNC-015 | Compromise & Relaxation Service | AllUnmetFallbackHandler | TC-FUNC-015 |
| REQ-FUNC-016 | Compromise & Relaxation Service | SearchFilterTranslator | TC-FUNC-016 |
| REQ-FUNC-017 | Visit Selection Service | TwoRoundVisitSelector | TC-FUNC-017 |
| REQ-FUNC-018 | Judgment Engine | ConditionPersistenceReapplier | TC-FUNC-018 |
| REQ-FUNC-019 | Visit Selection Service | ListingExhaustionHandler | TC-FUNC-019 |
| REQ-FUNC-020 | Judgment Engine | StatusClassifier | TC-FUNC-020 |
| REQ-FUNC-021 | All Services | PremiseDisclosureFormatter | TC-FUNC-021 |
| REQ-FUNC-022 | Field Record Service | BrokerQuestionCardService | TC-FUNC-022 |
| REQ-FUNC-023 | Field Record Service | FieldRecordStore | TC-FUNC-023 |
| REQ-FUNC-024 | Notification Service | ConditionChangeNotifier | TC-FUNC-024 |
| REQ-FUNC-025 | All Services | BalanceGuardrailRenderer | TC-FUNC-025 |
| REQ-NF-001 | API Gateway | ResponseTimeMonitor | TC-NF-001 |
| REQ-NF-002 | Judgment Engine | RouteCacheClient | TC-NF-002 |
| REQ-NF-003 | Route Infra | RouteCacheClient / RouteQuotaMonitor | TC-NF-003 |
| REQ-NF-004 | API Gateway | ExternalApiFallbackHandler | TC-NF-004 |
| REQ-NF-005 | Shared Space Service | AccessControlGuard | TC-NF-005 |
| REQ-NF-006 | All Services | PremiseDisclosureFormatter | TC-NF-006 |
| REQ-NF-007 | Judgment Engine | ConditionType Registry | TC-NF-007 |

---

## 6. 부록

### 6.1 API 엔드포인트 목록

| 서비스 유형 | 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- | --- |
| **Shared Space Service** | POST | `/api/v1/shared-spaces` | 관심매물 1~5개로 공유 객체 초안 생성 |
| **Shared Space Service** | POST | `/api/v1/shared-spaces/{spaceId}/invite` | 초대 링크(기본)·코드(보조) 발급 |
| **Shared Space Service** | GET | `/api/v1/shared-spaces/{spaceId}` | 공유 객체 조회 (B 진입 시 맥락 표시) |
| **Condition Service** | PUT | `/api/v1/shared-spaces/{spaceId}/persons/{role}/conditions` | 예산·출퇴근·필수 조건 저장 |
| **Condition Service** | POST | `/api/v1/shared-spaces/{spaceId}/persons/{role}/preferences` | 선호 카드 추가 |
| **Condition Service** | POST | `/api/v1/shared-spaces/{spaceId}/persons/{role}/confirmation-items` | 확인 필요 항목 추가 |
| **Judgment Engine** | GET | `/api/v1/shared-spaces/{spaceId}/judgments` | 후보별 조건 판정 결과 조회 |
| **Compromise & Relaxation Service** | GET | `/api/v1/shared-spaces/{spaceId}/listings/{listingId}/compromise` | 양보 문장 조회 |
| **Compromise & Relaxation Service** | POST | `/api/v1/shared-spaces/{spaceId}/relaxation-proposals` | 조건 완화 제안 발송 |
| **Compromise & Relaxation Service** | PATCH | `/api/v1/relaxation-proposals/{proposalId}` | 완화 제안 수락·거절 |
| **Visit Selection Service** | POST | `/api/v1/shared-spaces/{spaceId}/visit-selections` | 방문 후보 2개 선택(라운드별) |
| **Field Record Service** | GET | `/api/v1/shared-spaces/{spaceId}/broker-questions` | 중개사 질문 카드 조회 |
| **Field Record Service** | POST | `/api/v1/listings/{listingId}/field-records` | 방문 후 체크리스트·유지/보류/제외 기록 |
| **Notification Service** | GET | `/api/v1/persons/{personId}/notifications` | 상대 상태 변화 알림 조회 |

### 6.2 엔터티 관계도

```mermaid
erDiagram
    PERSON {
        string person_id PK
        string role "A 또는 B"
        string relationship_type "예비부부 등, A가 초대 시 1회 선택"
        int budget_cap "월 실부담 상한, 항상 필수"
        boolean commutes "출퇴근 여부"
        string commute_origin "출퇴근 시에만"
        string commute_mode "대중교통 기본, 자차 선택"
        string required_conditions "0~4개, 항목+연산자+값"
        string preferences "자유 문장 0~3개, 판정 미사용"
        string confirmation_items "상한 없음, 판정 미사용"
    }
    SHARED_SPACE {
        string space_id PK
        string person_a_id FK
        string person_b_id FK
        string connection_status
    }
    INVITE {
        string invite_code PK
        string space_id FK
        string link_url
        string temp_condition_ref "B 비로그인 임시조건, +30일 삭제"
    }
    LISTING_REF {
        string listing_id PK
        string space_id FK
        string coordinates
        int deposit
        int rent
        int maintenance_fee
        float area
        string listing_type
        boolean parking
        int walk_to_station_min
        string transaction_status
    }
    JUDGMENT_RESULT {
        string result_id PK
        string person_id FK
        string listing_id FK
        string condition_key
        string status "충족·미충족·확인필요·계산불가·해당없음"
        string gap_amount "미달량"
    }
    COMPROMISE_SENTENCE {
        string sentence_id PK
        string listing_id FK
        string losing_person_id FK
        string lost_condition
        string relative_rank "후보 5개 안 상대 순위, 절대값 아님"
    }
    RELAXATION_PROPOSAL {
        string proposal_id PK
        string proposer_id FK
        string target_person_id FK
        string condition_key
        string proposed_value "실제 미달량에서 산출"
        string status "대기·수락·거절"
    }
    VISIT_SELECTION {
        string selection_id PK
        string space_id FK
        int round "최대 2라운드"
        string final_candidates "최대 2개, 분할 포함"
    }
    BROKER_QUESTION {
        string question_id PK
        string listing_id FK
        string confirmation_item
        string answer
        string status
    }
    FIELD_RECORD {
        string record_id PK
        string listing_id FK
        string checklist "층간소음 등 6항목, 전부 표시"
        string outcome "유지·보류·제외"
    }

    SHARED_SPACE ||--|| PERSON : "A(초대자) 보유"
    SHARED_SPACE ||--o| PERSON : "B(참여자) 참여"
    SHARED_SPACE ||--|| INVITE : "초대 발급"
    SHARED_SPACE ||--o{ LISTING_REF : "후보 최대 5개"
    SHARED_SPACE ||--|| VISIT_SELECTION : "방문 후보 결정"
    PERSON ||--o{ JUDGMENT_RESULT : "조건을 대입"
    LISTING_REF ||--o{ JUDGMENT_RESULT : "판정 대상"
    JUDGMENT_RESULT ||--o| COMPROMISE_SENTENCE : "한쪽만 충족 시 생성"
    PERSON ||--o{ RELAXATION_PROPOSAL : "발신 또는 수신"
    LISTING_REF ||--o{ BROKER_QUESTION : "확인 필요 항목"
    LISTING_REF ||--o| FIELD_RECORD : "방문 후, 단계 2"
```

### 6.3 데이터 모델 정의

```java
// 조건 판정 타입 (PRD §12.3)
public enum ConditionType {
    UPPER_BOUND("상한형", "예산 · 통근시간 · 역 도보"),
    LOWER_BOUND("하한형", "전용면적"),
    PRESENCE("유무형", "주차"),
    EXACT_MATCH("일치형", "매물 유형");
}

// 판정 상태 (PRD §18.3)
public enum JudgmentStatus {
    MET("충족"),
    UNMET("미충족"),
    CONFIRMATION_NEEDED("확인 필요"),
    CALCULATION_FAILED("계산 불가"),
    NOT_APPLICABLE("해당 없음");
}

// 후보 그룹 (PRD §13.2)
public enum CandidateGroup {
    BOTH_MET("둘 다 충족"),
    ONE_SIDE_MET("한쪽만 충족"),
    BOTH_UNMET("둘 다 불충족");
}

// 관계 유형 (PRD §4.2)
public enum RelationshipType {
    ENGAGED_OR_NEWLYWED("예비부부·신혼부부"),
    COHABITING("동거"),
    FRIEND_ROOMMATE("친구·룸메이트");
}

// 출퇴근 이동수단 (PRD §12.2)
public enum CommuteMode {
    PUBLIC_TRANSIT("대중교통", true),
    PRIVATE_CAR("자차", false);
}

// 조건 완화 제안 상태 (PRD §14.3, FR-14)
public enum RelaxationProposalStatus {
    PENDING("대기"),
    ACCEPTED("수락"),
    REJECTED("거절");
}

// 방문 후보 결정 라운드 (decisions/0004)
public enum VisitSelectionRound {
    ROUND_1(1, "각자 2개 선택"),
    ROUND_2(2, "일치 1개 시 남은 한 자리 재비교");

    private final int roundNumber;
    private final String description;
}

// 방문 후 현장 기록 결과 (PRD §12.4)
public enum FieldRecordOutcome {
    KEEP("유지"),
    HOLD("보류"),
    EXCLUDE("제외");
}
```

### 6.4 비즈니스 규칙 요약

1. **조건 귀속**: 조건은 매물이 아니라 사람에 저장한다. 매물이 바뀌어도 조건은 유지된다 (`decisions/0003`)
2. **총점 금지**: 매물에 종합점수·공동 적합도·복합 순위를 부여하지 않는다 (`decisions/0001`)
3. **5분류 판정 원칙**: 미충족·계산 불가·확인 필요·해당 없음·충족을 서로 대체하지 않고 §4.1.1 결정 트리를 따른다
4. **완화 원칙**: 완화폭은 실제 미달량에서만 산출하고, A/B안을 항상 동시에 제시하며, 두 조건을 동시에 완화하지 않는다
5. **방문 후보 결정**: 겹치면 확정, 안 겹치면 최대 2라운드 내 분할로 종료한다. 투표·순위·자동 선택으로 대체하지 않는다 (`decisions/0004`)
6. **상대 조건 변경**: 제안만 가능하며 상대가 수락하기 전까지 판정에 적용하지 않는다
7. **매물 데이터 쓰기 금지**: 매물 데이터는 필요한 필드만 읽고 쓰지 않으며, 별도 매물 DB를 구축하지 않는다
8. **균형 가드레일**: A/B는 동일한 조건 순서와 시각적 비중으로 표시하고, 총점·추천 배지·AI의 최종 선택을 표시하지 않는다

### 6.5 데이터베이스 스키마 개요

```sql
-- 핵심 테이블 요약
persons                    -- 사람귀속 조건: 예산, 출퇴근, 필수조건, 선호, 확인항목
shared_spaces               -- 공유 객체: 후보 매물 ID 최대 5개, A/B 연결 상태
invites                     -- 초대 링크·코드, B 비로그인 임시 조건 참조(+30일)
listing_refs                -- 네이버 매물 참조(필요 필드만, 원본 미저장)
judgment_results            -- 조건별 판정 결과·미달량 (계산 결과, 캐시 가능)
compromise_sentences        -- 양보 문장(한쪽만 충족 시에만 생성)
relaxation_proposals        -- 조건 완화 제안 및 수락·거절 상태
visit_selections             -- 방문 후보 선택 라운드·최종 확정 결과
broker_questions             -- 방문 전 중개사 질문 카드(단계 2)
field_records                -- 방문 후 체크리스트·유지/보류/제외(단계 2)
```

---

## 7. 향후 개선 사항

현재 MVP 설계는 2인 완전공동형 관계와 결정론적 판정(자동 추천 없음)에 초점을 두고 있다. 다음 개선 사항은 PRD의 `[TBD]`·후순위 항목을 근거로 향후 버전에서 계획된다.

### 7.1 관계 유형 확장 재검토

- 현재 3인 이상 공동 탐색과 부모–자녀·주도–승인형 관계는 Out of Scope다
- H1 실측에서 초대 수락률이 비교군 대비 현저히 낮고 개선 실험 2회가 모두 실패하면 `decisions/0002`(2인 전제)를 되돌리는 절차를 별도로 진행한다

### 7.2 개인정보·데이터 정책 고도화

- 예산·출근지 등 민감정보의 상대 공개 범위와 가림 정책 확정 (`[TBD]`)
- 관계 종료 시 조건·공유 객체·현장 기록의 처리 정책 확정 (출시 전 필수)
- 단계 2 스냅샷 및 방문 기록의 보관 기간 정책 확정

### 7.3 네이버 내부 API 연동 고도화

- 공유 객체 비로그인 열람 가능 여부 확정에 따른 B 로그인 시점 재조정
- 검색 결과 수 조회의 정확치·근사치 표기 방식 확정
- 좌표 그리드 반올림·전역 캐시의 실측 기반 캐시 고도화

### 7.4 스토리·AC 정식화 — 완료

- ~~현재 서술형으로 작성된 Acceptance Criteria를 정식 Given-When-Then 3단 표기로 재구조화~~ — PRD §16.1이 AC 61개 전체를 Given-When-Then-SLO 4단으로 재작성하며 완료됨(2026-08-24 2차 라운드). REQ-FUNC 표의 "인수 기준" 열은 이 AC를 요약 인용한다.
- 남은 항목은 여전히 `[TBD]`인 REQ-FUNC-007/008/015/016·FR-23(§4.1)로, 네이버 내부 정책·화면 설계가 확정되기 전까지는 임의로 해소하지 않는다.

이들 항목은 PRD v1.0의 "남은 과제"·"Open Questions"와 정합하며, 별도 결정 없이 SRS 단독으로 임의 확정하지 않는다.

---

**확장 챕터 (ISO/IEC/IEEE 29148:2018 §9.6 기준)**

§1~§7은 예시 SRS 템플릿의 포맷·범위를 그대로 따른 것이다. 아래 §8~§12는 PRD(`ai-place-prd-v1_0.md`)에 이미 작성돼 있으나 그 템플릿의 7개 장에는 자리가 없는 내용을 담는다. 새 요구사항을 만들지 않고, ISO/IEC/IEEE 29148:2018 Clause 9.6(Software requirements specification content)의 대응 조항에 맞춰 기존 PRD 내용을 옮기고 재구성했다.

| 확장 챕터 | 표준 근거 | PRD 대응 절 |
|---|---|---|
| §8 제품 관점 및 비목표 | §9.6.4 Product perspective, §9.6.7 Limitations | §3, §7, §8, §9 |
| §9 사용자 특성 | §9.6.6 User characteristics | §4, §5 |
| §10 제품 기능 개요 — 핵심 설계 모델 | §9.6.5 Product functions | §12, §13, §14, §15 |
| §11 요구사항 분배 — 릴리즈 계획 | §9.6.9 Apportioning of requirements | §22 |
| §12 가정, 의존성 및 리스크 | §9.6.8 Assumptions and dependencies | §19, §25, §26 |

의도적으로 SRS 범위에 포함하지 않은 PRD 내용도 있다. KPI/성공 지표(PRD §24)는 소프트웨어 요구사항이 아니라 비즈니스 성과 지표이므로 29148 §9.6.x의 어느 조항에도 대응하지 않아 제외했고, 화면별 인벤토리(PRD §17)는 SRS가 다루는 행동 수준보다 세부적인 UI 설계 자료라 제외했다. 둘 다 PRD 원문에서 계속 관리한다.

---

## 8. 제품 관점 및 비목표 (Product Perspective and Non-Goals)

> ISO/IEC/IEEE 29148:2018 §9.6.4(Product perspective), §9.6.7(Limitations) 대응

### 8.1 배경 및 기회 구간

현재 AS-IS 흐름은 네이버 부동산에서 매물을 탐색·저장한 뒤 카카오톡 등으로 링크를 공유하고, 각자 지도에서 통근을 확인하고 계산기·메모로 비용과 장단점을 비교하다가, 의견이 모이지 않으면 다시 탐색으로 돌아가는 구조다(PRD §3.1).

```text
매물 확보 → 검색·지도 → 상세 → 관심매물 저장 → [공유·비교·공동 결정] → 문의·방문
                                                   ↑ 본 시스템의 범위
```

`[확정]` 본 시스템은 매물 탐색을 새로 만들지 않는다. 네이버 부동산의 관심매물 데이터를 활용해 **저장 이후 공동 결정 구간**만 담당하는, 상위 시스템(네이버 부동산)에 종속된 부가 기능이다(PRD §3.2). 근거 수준은 항목별로 다르다 — 반복 비교 행동과 2인 조건 충돌의 존재는 `[근거 있음]`이지만, 그 충돌이 실제 결정을 지연시키는지와 본 기능이 그 지연을 줄이는지는 `[검증 가설]`로 남아 있다(PRD §3.3).

### 8.2 Value Proposition

> **함께 살 집을 구하는 두 사람이 관심매물별 조건 충돌과 양보 지점을 한눈에 확인하고, 서로 납득할 수 있는 방문 후보를 함께 결정하도록 돕는다.** (PRD §7.1)

짧은 버전: **"각자의 조건과 양보 지점을 보고, 함께 보러 갈 집을 정합니다."**

기존 기능과의 차이(PRD §7.4):

| 일반적 기능 | 본 시스템 |
|---|---|
| 매물을 탐색·추천 | 기존 관심매물에 두 사람의 조건을 적용 |
| 관심매물 공동 저장·링크 공유 | 두 사람 모두 자기 조건을 입력하고 양방향으로 비교 |
| 개인별 별점·가중치·총점 | 조건별 충족·미충족·미달량을 합산 없이 제시 |
| AI가 최적 매물 추천 | AI가 충돌·양보 관계를 설명하고 결정은 두 사람이 수행 |
| 가장 좋은 집 찾기 | 두 사람이 무엇을 감수하는지 알고 방문 후보를 정하기 |

### 8.3 Product Goal — 시스템 종료점

`[확정]` 두 사람이 각자의 조건을 기준으로 관심매물 최대 5개를 비교하고, 매물별 조건 충돌과 양보 지점을 이해한 뒤 **이번에 보러 갈 집 2개를 직접 정할 수 있게 한다**(PRD §8.1).

- 단계 1 종료점: 방문 후보 2개 결정
- 단계 2 종료점: 방문 전 확인 질문 정리 → 방문 후 현장 기록 → 유지·보류·제외

`[검증 가설]` 이 결과가 결정 시간·갈등·방문 횟수·계약 전환에 미치는 영향은 이 SRS의 확정 범위가 아니라 PRD §25의 별도 검증 대상이다.

### 8.4 Non-Goals / Limitations

시스템은 아래를 하지 않는다(PRD §9) — 이는 시스템의 한계이자 설계상 의도적 제약이다.

| Non-goal | 상태 |
|---|---|
| AI가 최종 집 또는 방문 후보를 자동 선택 | `[Out of Scope]` |
| 정답 매물·최적 매물 추천 또는 강제적 타협안 제시 | `[Out of Scope]` |
| 두 사람의 조건을 합산한 종합점수·공동 적합도·자동 랭킹 | `[Out of Scope]` |
| 신규 매물 DB, 별도 매물 검색, 탐색 보드, 아이소크론 중심 지도 기능 구축 | `[Out of Scope]` |
| 계약 실행, 전자계약, 등기, 보증보험, 전세사기 확정 진단 | `[Out of Scope]` |
| 대출 상품 추천, 대출 실행, 확정 대출 한도·금리 제시 | `[Out of Scope]` |
| 법률·금융 판단 대행 | `[Out of Scope]` |
| 3인 이상 의사결정, 비용 분담 비율, 방 배정 | `[Out of Scope]` |

---

## 9. 사용자 특성 (User Characteristics)

> ISO/IEC/IEEE 29148:2018 §9.6.6(User characteristics) 대응. §2(이해관계자)는 이 시스템을 만드는 팀의 역할을 다루고, 이 장은 이 시스템을 쓰는 최종 사용자의 특성을 다룬다 — 서로 다른 대상이다.

### 9.1 Primary User

- `[확정]` **함께 살 집을 구하는 두 사람.** 제품 정의상 주거 형태는 제한하지 않는다.
- `[확정]` 두 사람이 각자 조건을 내고 대칭적으로 선택하는 `완전공동형` 관계를 전제로 한다. 한 사람이 고르고 다른 사람이 승인만 하는 주도–승인형은 다루지 않는다.
- `[확정]` 1인 사용은 독립 모드가 아니라 상대가 아직 참여하지 않은 **빈 경로**다(REQ-FUNC-009).
- `[Out of Scope]` 3인 이상 공동 탐색, 부모–자녀 관계, 주도–승인형 관계(PRD §4.4).

### 9.2 검증 집단

| 구분 | 집단 | 목적 |
|---|---|---|
| 1차 검증 집단 | 예비부부·신혼부부 | H1(초대 참여) 상한 확인 |
| 2차 검증 집단 | 친구·룸메이트 | H1 참여의 하한을 비교할 대조군 |

예비부부·신혼부부를 시스템 전체의 유일한 사용자로 재정의하지 않는다. 두 집단 모두 확장 타깃이 아니라 현재 검증 설계의 비교 대상이다(PRD §4.2).

### 9.3 Job To Be Done

Core Job: 함께 살 집을 고를 때, 두 사람 각자의 조건을 관심매물에 함께 대입해 누가 무엇을 감수하는지 이해하고, 서로 납득 가능한 상태에서 이번에 보러 갈 집 2개를 정하고 싶다(PRD §5.1).

| Job | 사용자가 이루려는 결과 |
|---|---|
| Functional Job | 저장한 관심매물 중 이번에 실제로 방문할 두 곳을 정한다 |
| Decision Job | 후보별 조건 충족·미충족·미달량과 양보 관계를 확인한 뒤 선택한다 |
| Relational Job | 어느 한쪽의 기준이나 시스템의 추천에 끌려가지 않고 각자의 기준을 같은 비중으로 드러낸다 |
| Continuity Job | 매물이 바뀌어도 사람의 조건은 유지해 다음 후보에 다시 적용한다 |
| B의 보조 Job | `[검증 가설]` 매물마다 장황하게 설명하지 않고 조건을 한 번 입력해 판단 근거를 전달한다 |

**'납득'의 정의** — 모든 조건을 만족하거나 추천 결과를 그대로 수용하는 상태가 아니다: **"이 집을 고르면 내가 무엇을 감수하는지 알고, 그 사실을 알고도 방문 후보로 동의할 수 있는 상태."** 따라서 `한쪽만 충족`인 매물도 최종 방문 후보가 될 수 있다(PRD §5.3). 이 정의는 REQ-FUNC-011·012·017(§4.1)의 판정 로직이 왜 승패를 가르지 않는지 설명하는 근거다.

---

## 10. 제품 기능 개요 — 핵심 설계 모델 (Product Functions — Core Design Model)

> ISO/IEC/IEEE 29148:2018 §9.6.5(Product functions) 대응. §4.1의 FR별 요구사항이 개별적으로는 왜 그렇게 동작해야 하는지 설명하지 않으므로, 이 장이 그 요구사항들을 하나의 설계 모델로 묶는다.

### 10.1 조건 모델 (Condition Model)

`[확정]` 조건은 매물이 아니라 **사람**에게 귀속된다.

```text
사람 A의 조건 ─┐
               ├─ 관심매물 1~5에 각각 적용 → 조건별 결과
사람 B의 조건 ─┘
```

매물이 삭제되거나 교체돼도 사람의 조건은 남고, 새 매물에는 재입력 없이 자동 적용된다(REQ-FUNC-018, PRD §12.1). 사람별 조건 구조(PRD §12.2):

| 데이터 | 입력 규칙 | 판정 사용 |
|---|---|---|
| 예산 | 항상 필수. 월 실부담 상한 | 예 |
| 출퇴근 여부 | 첫 단계에서 명시적으로 질문 | 통근 축 적용 여부 결정 |
| 출근지·이동수단 | 출퇴근하는 경우에만 | 통근시간·교통비 계산 기준점 |
| 추가 필수 조건 | 0~4개, 사용자 선택 | 예 |
| 선호 | 자유 문장 0~3개 | 아니오 |
| 확인 필요 | 상한 없음 | 자동 판정하지 않음 |

판정 가능한 여섯 항목은 상한형(예산·통근시간·역도보)·하한형(전용면적)·유무형(주차)·일치형(매물유형) 4개 타입으로 나뉜다(PRD §12.3, REQ-FUNC-010A/010B). 방 개수·건물 연식·엘리베이터·층수·방향은 자동 판정 항목이 아니며 선호 카드 또는 재탐색 필터 맥락으로 분리한다.

### 10.2 매물 비교 모델 (Listing Comparison Model)

```text
금지: 어떤 매물이 우리에게 최고인가?
사용: 이 매물을 선택하면 A와 B에게 각각 무엇이 맞고 무엇이 어긋나는가?
```

한 비교 세션의 후보는 최대 5개이며, 결과는 `둘 다 충족/한쪽만 충족/둘 다 불충족`으로 그룹화하고 `확인 필요`는 별도 상태로 표시한다(REQ-FUNC-011). 매물에 종합점수·공동 적합도·복합 순위를 부여하지 않으며, 조건별 실제값·임계값·미달량을 한 줄 텍스트로 보여준다(예: `13분 > 10분 ✗ +3분`). 조건 표시 순서는 `예산 → 통근 → 추가 필수①~④ → 확인 필요`로 고정한다(PRD §13.2). 정렬은 단일 조건 값 기준으로만 허용하고 복합 점수 정렬은 금지한다. 레이더·종합 게이지·순위 리스트·별점·누적막대·이중축은 사용하지 않는다(PRD §13.3).

### 10.3 트레이드오프 / 타협 모델 (Trade-off / Compromise Model)

한쪽만 충족하는 매물을 설명 대상으로 승격한다.

```text
[누가] [무엇을] [얼마나] 감수하고,
[대신] [같은 후보 5개 안에서] [어떤 조건이 얼마나 상대적으로 낫다]
```

문장 생성 규칙(PRD §14.2, REQ-FUNC-012): A/B 양쪽에서 손실·이득 순서와 시각 비중을 동일하게 유지하고, 얻는 점이 없으면 `대신` 절을 만들지 않으며, 미충족 조건이 3개 이상이면 앞 2개만 문장에 넣는다. `이 집이 더 좋다`, `이 타협이 공정하다`처럼 선택을 유도하는 결론은 붙이지 않는다.

조건 완화(PRD §14.3, REQ-FUNC-013/014): 완화폭은 실제 미달량에서 가져오고, A안·B안을 항상 동시에 보여주며, 두 조건을 동시에 낮추는 제안은 하지 않는다. 자기 조건은 직접 변경할 수 있으나 상대 조건은 제안만 가능하다.

최종 두 후보 비교(PRD §14.4): 방문 후보 결정 단계는 행을 조건, 열을 후보로 둔 Option Grid 형식을 쓰며 총점 행과 추천 배지를 두지 않는다.

### 10.4 AI 역할 (AI Role)

| AI가 하는 것 | AI가 하지 않는 것 |
|---|---|
| 구조화된 조건을 매물 실제값과 대조 | 최종 집·방문 후보를 대신 선택 |
| 충족·미충족·확인 필요 설명 | 정답·최적·추천 매물 생성 |
| 실제 미달량을 계산 가능한 형태로 표시 | 조건을 총점·적합도·일치율로 합산 |
| 누가 무엇을 감수하는지 설명 | 한쪽에게만 양보를 요구 |
| 후보 5개 안 상대 위치 설명 | 강제적 타협안·조건 완화 제시 |
| 완화 시 후보 상태 변화 설명 | 상대방의 조건을 대신 변경 |
| 자동 판정 불가 항목을 질문·현장 확인으로 구조화 | 계약·대출·법률 판단, 존재하지 않는 근거 생성 |

(PRD §15) 이 표는 REQ-FUNC-025(균형 제시 가드레일)가 왜 존재하는지의 설계 근거다.

---

## 11. 요구사항 분배 — 릴리즈 계획 (Apportioning of Requirements)

> ISO/IEC/IEEE 29148:2018 §9.6.9(Apportioning of requirements) 대응

§4.1의 REQ-FUNC들은 아래 두 릴리즈로 분배된다(PRD §22). 이 분배는 §16.2의 MoSCoW·스프린트 매핑과는 다른 축이다 — MoSCoW는 "한 릴리즈 안에서 무엇을 먼저 만드나"를 정하고, 이 표는 "무엇이 검증 코어이고 무엇이 종료점 완성인가"를 정한다.

### 11.1 단계 1 — 검증 코어

| 기능 | 범위 | 대응 REQ-FUNC |
|---|---|---|
| FT1 | 관심매물 후보 담기, 최대 5개 | REQ-FUNC-001 |
| FT2 | 예산 필수 + 출퇴근 여부 분기 + 선택 조건 입력 | REQ-FUNC-002~004 |
| FT3 | 초대 링크 1회, 코드 보조 | REQ-FUNC-005~009 |
| FT4 | 자동 판정 + 실부담·통근 계산 | REQ-FUNC-010A/010B, 020 |
| FT5 | 양보 지점 문장 | REQ-FUNC-011/012 |
| FT6 | 조건 완화와 0건 분기 | REQ-FUNC-013~016 |
| FT7 | 방문 후보 2개 결정 | REQ-FUNC-017~019, 024/025 |

확정 수치·경계(PRD §22.2): 참여 2인 전제(1인은 빈 경로) · 관심매물 세션당 최대 5개 · 추가 필수 조건 사람당 0~4개 · 선호 카드 사람당 0~3개 · 방문 후보 결과 2개 · 선택 최대 2라운드 · 전체 탐색 여정 2~3회 세션 반복 가능 · A는 PC 웹 우선, B는 모바일 우선.

단계 1 필수 예외(PRD §22.3): B 미참여 1인 빈 경로 · B 입력 중 이탈과 부분 판정 · 매물 소진과 조건 유지 · 5개 전부 불충족 · 후보 집합 내 조건 동시 충족 불가 · 출근지 없는 정상 경로.

### 11.2 단계 2 — 종료점 완성

| 기능 | 범위 | 대응 REQ-FUNC |
|---|---|---|
| FT8 | 방문 전 중개사 질문 카드, 답변 기록 시 판정 갱신 | REQ-FUNC-022 |
| FT9 | 방문 후 공통 체크리스트와 유지·보류·제외 | REQ-FUNC-023 |

단계 1은 H1·H2-b-2·H3을 측정하는 검증 코어이고, 단계 2는 방문 이후 종료점과 사용자 생성 기록을 완성한다(PRD §22.4).

---

## 12. 가정, 의존성 및 리스크 (Assumptions, Dependencies and Risks)

> ISO/IEC/IEEE 29148:2018 §9.6.8(Assumptions and dependencies) 대응. 네이버 내부 API 가용성 의존은 이미 §20.2(비기능요구)에 있으므로 여기서는 반복하지 않고 참조만 한다.

### 12.1 비용 계산 가정

월 실질 주거비는 여섯 항목을 동일한 전제 아래 추정한다(PRD §19.1):

```text
월 실질 주거비 = 보증금 기회비용 + 대출 이자 + 월세 + 관리비 + 교통비 + 초기비용 월분할
```

현재 전제값(PRD §19.3) — 모두 시점 의존이며 상수로 고정하지 않는다:

| 전제 | 현재값 | 근거 수준 |
|---|---|---|
| 기회비용률 | 연 3.08% | `[근거 있음]` 2026-06 예금은행 저축성수신금리 |
| 전세대출 금리 | 연 4.00%(3.8~4.2%) | `[근거 있음]` 2026-07 공사 보증서 담보 상품 평균 |
| 거주 기간 T | 24개월 | 표준 임대차 기간 전제 |
| 자차 실연비 | 10km/L | `[가정]` 신뢰도 낮음, 사용자 조정 가능 |
| 이사비·입주청소 | 범위 제시 | `[근거 있음/신뢰도 중간]` |

이 전제들은 REQ-NF-006(정확성)이 요구하는 "전제 없는 숫자 금지"의 구체적 대상이다. 자차 비용은 유류비·통행료만 포함하고 보험·감가·정비·직장 주차비는 집 위치와 무관하다는 이유로 제외한다(PRD §19.4).

### 12.2 검증 미완료 가정 (Open Hypotheses)

아래 가설이 거짓으로 판명되면 해당 REQ-FUNC의 전제 자체가 흔들린다(PRD §25.1).

| 가설 | 내용 | 상태 | 거짓일 때 영향받는 요구사항 |
|---|---|---|---|
| H1 | 초대받은 상대가 들어와 조건을 입력한다 | 미검증·최우선 | REQ-FUNC-005~009 (2인 전제 자체) |
| H2-b-2 | 조건 충돌이 실제 결정을 지연시킨다 | 미검증·급소 | Problem Statement 및 Hero Feature(REQ-FUNC-011/012) 존재 이유 |
| H3 | 사용자가 조건 입력을 감수한다 | 측정 필요 | REQ-FUNC-003/004 (점진적 입력 범위) |
| H4 | 보유 데이터로 의미 있는 비용 비교가 가능하다 | 부분적으로 불가 | §12.1 비용 계산 가정 전체 |
| H5 | 매물 회전이 비교 주기보다 느리다 | 부분 확인 | REQ-FUNC-018/019 (조건 지속·소진 처리) |

### 12.3 리스크와 대응책

| Risk | 영향 | 현재 대응 방향 |
|---|---|---|
| B가 초대에 들어오지 않음 | 치명적 | 1인 빈 경로, H1 선행 측정, 집단 비교 |
| 조건 충돌이 지연의 주원인이 아님 | 치명적 | 일정 조율·비용 분담 등 원인 분리 후 Problem 재검토 |
| 조건 입력 부담으로 이탈 | 큼 | 예산만 필수, 출근지는 해당자만, 점진적 공개 |
| 비용 계산값이 실제와 다름 | 큼 | 모든 숫자 옆 전제, 상대 차액으로 후퇴 가능 |
| 충돌 화면이 갈등을 키움 | 중간 | A/B 동일 비중, 승패 표현 금지 |
| 매물이 빨리 소진됨 | 중간 | 조건을 사람에 저장, 매물 제거·재판정·재선택 |
| 관심매물 API 권한 부재 | 제품 전제 실패 | 내부 기능 전제, 외부 크롤링 사용 안 함 |
| 공유 객체 비로그인 열람 불가 | H1 마찰 증가 | 로그인 위치 재조정 필요 |
| 관계 종료 시 데이터 소유 불명확 | 개인정보·정책 리스크 | 조건·공유 객체·현장 기록 처리 결정 필요 |

(전체 12개 리스크는 PRD §26 참조. 위는 대표 9개를 발췌했다.)

### 12.4 설계 결정 근거 (ADR)

REQ-FUNC의 여러 항목은 아래 네 결정에서 직접 파생된다.

| Decision | 핵심 결정 | 대응 REQ-FUNC |
|---|---|---|
| 0001 종합점수를 내지 않는다 | 매물에 총점·순위를 부여하지 않고 양보 문장으로만 서술 | REQ-FUNC-011/012, 025 |
| 0002 2인을 전제로 간다 | 1인은 빈 경로로만 지원 | REQ-FUNC-009 |
| 0003 조건은 사람에 저장한다 | 매물이 바뀌어도 조건 유지 | REQ-FUNC-010A/010B, 018 |
| 0004 합의는 분할로 끝낸다 | 2라운드 내 확정 또는 분할 | REQ-FUNC-017 |

각 결정의 전체 근거와 되돌릴 조건은 PRD §26.0에 있다.

---

*작성자: 기획 분석가 (IT), 검토자: 개발팀 리드, 승인자: 기획 매니저 (PM)*
