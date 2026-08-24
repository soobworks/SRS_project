# [기술 설계 문서] 같이보기

**문서 ID:** TDD-JOINTHOME-MVP-001

**개정 버전:** 1.0

**날짜:** 2026-08-24

**상위 문서:** `같이보기-srs-v1_0.md` (SRS v1.0), `같이보기-prd-v1_0.md` (PRD v1.0)

**목적:** SRS v1.0에 문장·표로 서술된 요구사항을 다이어그램으로 다시 표현해, 구현 착수 전에 서비스 경계·데이터 흐름·상호작용을 한눈에 확인할 수 있게 한다. 새 요구사항을 만들지 않고 SRS·PRD에 이미 있는 내용만 그림으로 옮긴다.

---

## 다이어그램 목록

| ID | 유형 | 제목 | SRS 배치 위치 |
| --- | --- | --- | --- |
| UC-1 | Use Case Diagram | 조건 입력 및 판정 확인 | §9.0 |
| UC-2 | Use Case Diagram | 완화·재탐색·방문 후보 결정 | §9.0 |
| UC-3 | Use Case Diagram | 방문 전후 기록 및 알림 | §9.0 |
| ERD-1 | Entity Relationship Diagram | 같이보기 데이터 모델 | §6.2 (원본) |
| CMP-1 | Component Diagram | 마이크로서비스 인터페이스 | §3.2 |
| SEQ-1 | Sequence Diagram | 핵심 시나리오(초대~방문 후보 확정) | §4.1.4 (원본) |
| SEQ-2 | Sequence Diagram | 조건 완화 제안-수락 | §9.4 |
| SEQ-3 | Sequence Diagram | 매물 소진 처리 | §9.5 |
| SEQ-4 | Sequence Diagram | 방문 전후 기록 (단계 2) | §9.7 |
| SEQ-5 | Sequence Diagram | B 비로그인 조건 → 로그인 이관 | §9.2 |
| CLD-1 | Causal Loop Diagram | KPI 가드레일 피드백 루프 | §10.1 |
| FLOW-1 | Flow Chart | 판정 상태 결정 로직 (기존) | §4.1.1 (원본) |
| FLOW-2 | Flow Chart | 방문 후보 2라운드 분할 로직 (기존) | §4.1.2 (원본) |
| FLOW-3 | Flow Chart | 완화·재탐색 분기 (기존) | §4.1.3 (원본) |
| FLOW-4 | Flow Chart | 릴리스 게이트 (기존) | §10.4 (원본) |
| FLOW-5 | Flow Chart | 이벤트 카운팅 파이프라인 | §10.2 |
| FLOW-6 | Flow Chart | 알림 발생 로직 | §9.6 |

SEQ-1·FLOW-1~4는 SRS 본문(§4, §10.4)에 이미 있어 이 문서에서는 목록에만 표시하고 중복 게재하지 않는다. 아래 본문은 **새로 추가하는 UC-1~3, CMP-1, SEQ-2~5, CLD-1, FLOW-5~6**을 다룬다. ERD-1은 SRS §6.2와 동일하며 이 문서의 완결성을 위해 §2에 재수록한다.

---

## 1. Use Case Diagram

Actor는 PRD §4·SRS §8이 정의한 것과 동일하다 — **A(초대자)**, **B(참여자)**, 필요 시 외부 시스템(네이버 부동산)을 보조 액터로 표시한다. Use case는 SRS §9의 시나리오 그룹(9.1~9.7)과 1:1로 대응한다.

### UC-1. 조건 입력 및 판정 확인 (REQ-FUNC-001~011)

```mermaid
flowchart LR
    actorA(["👤 A 초대자"])
    actorB(["👤 B 참여자"])

    subgraph UC1["같이보기 — 조건 입력 및 판정 확인"]
        direction TB
        uc01((UC-01<br/>비교 후보 구성))
        uc02((UC-02<br/>기본 조건 입력))
        uc03((UC-03<br/>조건 점진적 확장))
        uc04((UC-04<br/>선호·확인 항목 등록))
        uc05((UC-05<br/>상대 초대))
        uc06((UC-06<br/>초대 참여))
        uc07((UC-07<br/>비로그인 조건 입력))
        uc08((UC-08<br/>결과 후 로그인))
        uc09((UC-09<br/>1인으로 결과 보기))
        uc10((UC-10<br/>자동 판정 조회))
        uc11((UC-11<br/>양보 문장 확인))
    end

    actorA --> uc01 & uc02 & uc03 & uc04 & uc05 & uc09 & uc10 & uc11
    actorB --> uc06 & uc02 & uc03 & uc04 & uc07 & uc08 & uc10 & uc11

    uc06 -. include .-> uc02
    uc07 -. extend .-> uc06
    uc08 -. extend .-> uc09
    uc10 -. include .-> uc11
```

**읽는 법**: UC-06(초대 참여)은 UC-02(기본 조건 입력)를 반드시 포함한다(REQ-FUNC-006 AC-06-01 — 조건 입력 전에 맥락을 먼저 보여줄 뿐, 결국 조건은 입력해야 함). UC-07(비로그인 입력)은 UC-06의 확장 경로다. UC-10(판정 조회)은 UC-11(양보 문장)의 전제 조건이다 — 판정 없이는 양보 문장을 만들 수 없다.

### UC-2. 완화·재탐색·방문 후보 결정 (REQ-FUNC-012~019)

```mermaid
flowchart LR
    actorA(["👤 A"])
    actorB(["👤 B"])

    subgraph UC2["같이보기 — 완화·재탐색·방문 후보 결정"]
        direction TB
        uc12((UC-12<br/>조건 완화 미리보기))
        uc13((UC-13<br/>상대에게 완화 제안))
        uc14((UC-14<br/>완화 수락·거절))
        uc15((UC-15<br/>전부 불충족 시 완화·재탐색))
        uc16((UC-16<br/>방문 후보 2개 결정))
        uc17((UC-17<br/>매물 추가·교체·소진 대응))
    end

    actorA --> uc12 & uc13 & uc16 & uc17
    actorB --> uc12 & uc14 & uc16 & uc17

    uc13 -. include .-> uc12
    uc14 -. extend .-> uc13
    uc15 -. include .-> uc12
```

**읽는 법**: UC-16(방문 후보 결정)은 UC-1의 UC-10(판정 조회)을 전제로 하지만 두 다이어그램이 별도라 화살표로 표시하지 않았다 — 판정 없이는 후보를 그룹화할 수 없다는 점은 §9.5 서술에서 텍스트로 명시한다.

### UC-3. 방문 전후 기록 및 알림 (REQ-FUNC-022~024)

```mermaid
flowchart LR
    actorA(["👤 A"])
    actorB(["👤 B"])
    sys(["⚙ Notification Service"])

    subgraph UC3["같이보기 — 방문 전후 기록 및 알림"]
        direction TB
        uc18((UC-18<br/>중개사 질문 답변))
        uc19((UC-19<br/>방문 후 기록))
        uc20((UC-20<br/>상태 변화 알림 수신))
    end

    actorA --> uc18 & uc19
    actorB --> uc18 & uc19
    sys --> uc20
    uc20 -.-> actorA
    uc20 -.-> actorB
```

**읽는 법**: UC-20(알림 수신)은 사람이 시작하는 use case가 아니라 시스템(Notification Service)이 먼저 시작해 A·B에게 전달하는 **수신형 use case**다.

---

## 2. Entity Relationship Diagram (ERD-1)

SRS §6.2와 동일하다. 완결성을 위해 재수록한다.

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

---

## 3. Component Diagram (CMP-1)

SRS §3.1 "시스템 맥락도"는 서비스 간 데이터 흐름 방향만 보여준다. 이 다이어그램은 한 단계 더 들어가 **각 컴포넌트가 무엇을 제공(provided interface)하고 무엇을 요구(required interface)하는지**를 SRS §6.1 API 목록 그대로 붙인 것이다.

```mermaid
flowchart TB
    subgraph Clients["클라이언트"]
        AW["A · PC 웹"]
        BW["B · 모바일 웹"]
    end

    subgraph Components["같이보기 — 내부 컴포넌트"]
        SSS["Shared Space Service<br/>POST /shared-spaces<br/>POST .../invite<br/>GET /shared-spaces/{id}"]
        CS["Condition Service<br/>PUT .../conditions<br/>POST .../preferences<br/>POST .../confirmation-items"]
        JE["Judgment Engine<br/>GET .../judgments"]
        CRS["Compromise &amp; Relaxation Service<br/>GET .../compromise<br/>POST .../relaxation-proposals<br/>PATCH /relaxation-proposals/{id}"]
        VSS["Visit Selection Service<br/>POST .../visit-selections"]
        FRS["Field Record Service<br/>GET .../broker-questions<br/>POST /listings/{id}/field-records"]
        NS["Notification Service<br/>GET /persons/{id}/notifications"]
    end

    subgraph External["외부 시스템"]
        LISTAPI[["네이버 관심매물 조회 API"]]
        ROUTEAPI[["네이버 경로 계산 엔진"]]
        SEARCHAPI[["네이버 검색결과수·필터 API"]]
    end

    AW -->|HTTPS| SSS
    BW -->|HTTPS| SSS
    SSS -->|"required: 매물 ID 목록"| LISTAPI
    SSS --> CS --> JE
    JE -->|"required: 통근시간"| ROUTEAPI
    JE --> CRS
    CRS -->|"required: 필터 결과 수"| SEARCHAPI
    CRS --> VSS --> FRS
    JE --> NS
    CRS --> NS
    VSS --> NS
    NS -->|"provided: 알림"| AW
    NS -->|"provided: 알림"| BW
```

**읽는 법**: 화살표에 붙은 `required:` 라벨은 해당 컴포넌트가 외부 시스템에 의존하는 지점이며, SRS §11.2(외부 시스템발 제약)·§12.2(외부 의존성)와 1:1로 대응한다. `provided:`는 Notification Service가 클라이언트에 제공하는 인터페이스다.

---

## 4. Sequence Diagram

### SEQ-2. 조건 완화 제안-수락 (REQ-FUNC-014)

```mermaid
sequenceDiagram
    participant A as A
    participant CRS as Compromise & Relaxation Service
    participant Notif as Notification Service
    participant B as B

    A->>CRS: 완화 제안 생성(상대 조건 대상)
    CRS->>Notif: 제안 알림 트리거
    Notif-->>B: 완화 제안 알림 전달
    B->>CRS: 제안 확인
    alt 수락
        B->>CRS: 수락
        CRS->>CRS: B의 조건 갱신
        CRS->>CRS: 관련 후보 재판정 요청
        CRS-->>A: 수락 결과 알림
        CRS-->>B: 갱신된 판정 결과
    else 거절
        B->>CRS: 거절
        CRS-->>A: 거절 결과 알림
    end
```

### SEQ-3. 매물 소진 처리 (REQ-FUNC-019)

```mermaid
sequenceDiagram
    participant NV as 네이버 부동산(외부)
    participant SSS as Shared Space Service
    participant VSS as Visit Selection Service
    participant Notif as Notification Service
    participant A as A
    participant B as B

    NV->>SSS: 매물 거래완료·삭제 감지
    SSS->>SSS: 후보 목록에서 매물 제거
    SSS->>Notif: 소진 알림 트리거
    Notif-->>A: 후보 소진 알림
    Notif-->>B: 후보 소진 알림
    alt 소진 매물이 확정된 방문 후보였음
        SSS->>VSS: 방문 후보 상태 갱신 요청
        VSS->>VSS: 남은 한 자리 선택 단계로 되돌림
        VSS-->>A: 재선택 요청
        VSS-->>B: 재선택 요청
    else 확정 전 후보였음
        SSS->>SSS: 나머지 후보 판정 유지
    end
```

### SEQ-4. 방문 전후 기록 — 단계 2 (REQ-FUNC-022, 023)

```mermaid
sequenceDiagram
    participant A as A
    participant B as B
    participant FRS as Field Record Service

    Note over A,B: 단계 2 진입 — 확인 필요 항목 존재
    FRS-->>A: 중개사 질문 카드 표시
    FRS-->>B: 중개사 질문 카드 표시
    A->>FRS: 중개사 답변 기록
    FRS->>FRS: 보류 상태 갱신(답변 없는 항목은 확인 필요 유지)
    Note over A,B: 방문 완료
    A->>FRS: 공통 체크리스트 작성
    B->>FRS: 공통 체크리스트 작성
    A->>FRS: 유지·보류·제외 선택
    FRS->>FRS: 방문 후 사용자 생성 기록으로 저장(방문 전 기록과 분리)
```

### SEQ-5. B 비로그인 조건 → 로그인 이관 (REQ-FUNC-007, 008)

```mermaid
sequenceDiagram
    participant B as B(비로그인)
    participant CS as Condition Service
    participant Auth as 로그인 처리
    participant JE as Judgment Engine

    B->>CS: 예산·조건 입력(비로그인)
    CS->>CS: 초대 코드 단위로 임시 저장
    CS->>JE: 임시 조건으로 1차 판정 요청
    JE-->>B: 첫 결과 표시
    Note over B: 저장·재방문 시도
    B->>Auth: 로그인 요청
    Auth->>CS: 로그인 완료 통지
    CS->>CS: 임시 조건 → B 계정으로 이관
    Note over CS: 마지막 접근 +30일 미이관 조건은 배치로 자동 삭제
```

---

## 5. Causal Loop Diagram (CLD-1) — KPI 가드레일 피드백 루프

SRS §10.1의 가드레일 지표 3종은 "한 지표를 올리려다 다른 지표를 망가뜨리는" 되먹임 관계를 감시하기 위한 것이다(PRD §24.4). 이 관계를 인과 루프 다이어그램으로 표현한다. 셋 모두 **균형 루프(Balancing loop, B)** — 한 변수가 과도하게 오르면 감시 신호가 반대 방향으로 개선 압력을 되돌리는 구조다.

```mermaid
flowchart LR
    classDef var fill:#EEF3F8,stroke:#5C7F9C,color:#16324F;
    classDef gate fill:#FBEEDA,stroke:#B5730E,color:#5C3A00;

    NS["North Star<br/>방문후보 확정률"]:::var
    HB["헛방문율<br/>(방문 후 제외)"]:::var
    G1{"가드레일 경보<br/>B1"}:::gate

    RA["조건 완화 실행률"]:::var
    CE["충돌화면 이탈률"]:::var
    G2{"가드레일 경보<br/>B2"}:::gate

    CC["조건 입력 완료율"]:::var
    RR["조건 재입력률"]:::var
    G3{"가드레일 경보<br/>B3"}:::gate

    NS -->|"+"| HB
    HB -->|"+"| G1
    G1 -->|"− 판정 로직 재검토 요구"| NS

    RA -->|"+"| CE
    CE -->|"+"| G2
    G2 -->|"− 완화 유도 강도 조정"| RA

    CC -->|"+"| RR
    RR -->|"+"| G3
    G3 -->|"− 입력 단순화 강도 조정"| CC
```

**읽는 법**: `+`는 두 변수가 같은 방향으로 움직인다는 뜻(예: North Star가 오르면 헛방문율도 같이 오를 수 있다), `−`는 가드레일 경보가 원인 변수를 반대 방향으로 되돌리려는 교정 압력이다. 이 세 루프가 균형을 이루지 못하고 계속 같은 방향으로만 움직이면 "숫자만 맞춘 가짜 확정"(PRD §24.4)이 발생한 것으로 판정한다.

---

## 6. Flow Chart

FLOW-1~4는 SRS §4.1.1~4.1.3, §10.4에 이미 있다(목록 참조). 아래 2개가 이번에 추가되는 흐름이다.

### FLOW-5. 이벤트 카운팅 파이프라인 (SRS §10.2 보완)

```mermaid
flowchart LR
    UA[사용자 행동] --> EV["이벤트 발생<br/>space_id·person_id 부착"]
    EV --> LOG["이벤트 로그 적재<br/>적재 방식 [TBD]"]
    LOG --> AGG["집계<br/>분자·분모 매칭, 윈도우 조인"]
    AGG --> KPI["§10.1 KPI·가드레일 표"]
    KPI --> DASH[팀 대시보드]
```

### FLOW-6. 알림 발생 로직 (REQ-FUNC-024)

```mermaid
flowchart TD
    EVT{이벤트 발생}
    EVT -->|조건 입력·변경| N1[상대에게 알림]
    EVT -->|완화 제안 발송| N2[상대에게 알림]
    EVT -->|후보 추가·교체·소진| N3[상대에게 알림]
    EVT -->|방문 후보 선택 상태 변경| N4[상대에게 알림]
    N1 & N2 & N3 & N4 --> Q{알림 채널 확정?}
    Q -->|"[TBD]"| SEND[발송 방식은 정책 확정 후 결정]
```

---

## 부록 — 다이어그램 ↔ SRS/PRD 대응표

| 다이어그램 | 근거 SRS/PRD |
| --- | --- |
| UC-1~3 | SRS §4.1 REQ-FUNC 표, §9 수용 기준 명세 |
| ERD-1 | SRS §6.2, PRD §21.9 |
| CMP-1 | SRS §3, §6.1 API 목록, §11.2, §12.2 |
| SEQ-2 | SRS §9.4, REQ-FUNC-014 AC-14-01/02 |
| SEQ-3 | SRS §9.5, REQ-FUNC-019 AC-19-01/02 |
| SEQ-4 | SRS §9.7, REQ-FUNC-022/023 |
| SEQ-5 | SRS §9.2, REQ-FUNC-007/008 AC-07/08 |
| CLD-1 | SRS §10.1 가드레일 지표 표, PRD §24.4 |
| FLOW-5 | SRS §10.2 KPI 사용자 행동 카운팅 계획 |
| FLOW-6 | SRS §9.6, REQ-FUNC-024 AC-24-01/02 |

---

*작성자: 기획 분석가 (IT), 검토자: 개발팀 리드, 승인자: 기획 매니저 (PM)*
