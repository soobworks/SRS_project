# [SRS 문서] 같이보기 — Next.js 기술스택 구현판 (한글)

# 소프트웨어 요구사항 명세서 (SRS)

**문서 ID:** SRS-JOINTHOME-NEXTJS-001

**개정 버전:** 0.9

**날짜:** 2026-08-26

**상위 문서:** 같이보기 PRD v1.0 (`같이보기-prd-v1_0.md`), 같이보기 SRS v1.0 (`같이보기-srs-v1_0.md`)

**이 개정의 성격:** v1.0(`같이보기-srs-nextjs-v1_0.md`)에 대해 진행한 두 건의 검토 — 난이도·구현가능성 검토(2026-08-26 채팅) 및 `MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md`(2026-08-26) — 의 통합 권고 6개 중, SRS 문서 범위에 해당하는 5개를 실제로 반영한 **v1.0 초안**이다. 버전을 0.9로 낮춘 것은 아직 팀 검토·승인을 받지 않았기 때문이며, 승인 후 v1.0으로 확정한다. (남은 1개 — "AI 생성 결과물 필수 사람 검토 체크포인트"는 검토 보고서 자체가 "SRS 범위 밖, 팀 개발 프로세스 문서로 별도 관리"라고 명시했으므로 이 문서에는 포함하지 않는다. §7.1 말미에 참조만 남긴다.)

**이 문서의 성격 (기존과 동일):** 이 문서는 기존 최종본 `같이보기-srs-v1_0.md`(7개 마이크로서비스, 기술 중립적 서술)를 대체하지 않는다. **완전히 별개의 문서**로서, 아래 §1.5의 기술스택 제약(C-TEC-001~007)을 그대로 적용했을 때 **실제로 구현 가능한 형태**로 아키텍처·인터페이스·데이터 설계를 다시 쓴 것이다. **기능 요구사항(FR-01~25, REQ-FUNC-001~025 및 인수 기준)은 기존 SRS와 완전히 동일하며 이 문서에서 변경하지 않는다.** 달라지는 것은 오직 "그 기능을 어떤 기술로, 어떤 구조로, 어떤 순서로 구현하는가"뿐이다.

---

## v0.9 변경 이력 (v1.0 대비)

| # | 반영한 권고 (보고서 §5 우선순위) | 반영 위치 | 반영 여부 |
| --- | --- | --- | --- |
| 1 | 네이버 API 3종 목업/실연동 스위치를 공식 설계 요소로 추가 | §2.2, §3.3 | ✅ 반영 |
| 2 | 단계 1을 1-A(핵심 검증)/1-B(제품 완성도)로 재분할 | §11(신규) | ✅ 반영 |
| 3 | 네이버 로그인 확정 전 임시 인증(매직 링크 · 초대코드 신원) 채택 | §3.1, §11 | ✅ 반영 |
| 4 | AI 생성 결과물 필수 사람 검토 체크포인트 | — | ⛔ 보고서 자체가 SRS 범위 밖으로 명시 → §7.1에 참조만 |
| 5 | Vercel Hobby 상업적 이용 약관 확인 + 유료 전환 트리거를 관측 항목에 추가 | §8.3 | ✅ 반영 |
| 6 | "Vercel 특화 기능 사용 = 포터빌리티 트레이드오프"를 ADR로 명문화 | §9(ADR-TECH-06 신규) | ✅ 반영 |

---

## 문서 구성 안내

기존 SRS가 ISO/IEC/IEEE 29148:2018 양식(사내 표준 + 확장 8개 장)을 따랐다면, 이 문서는 **기술스택이 이미 확정된 구현 설계서**의 성격이 강해 아래처럼 재구성했다.

| 장 | 내용 | 기존 SRS와의 관계 |
| --- | --- | --- |
| 1. 서론 | 목적 · 배경 · 범위 · 정의 · **Assumptions & Constraints** · **기술스택 적합성 검토** | §1과 동일 범위, §1.5·1.6이 신규 |
| 2. 시스템 아키텍처 | Next.js 단일 모놀리스로의 재설계 + 외부 API 목업 스위치(v0.9) | 기존 §3(마이크로서비스)을 대체하는 이 문서만의 아키텍처 |
| 3. 외부 인터페이스 요구사항 | Server Actions · Route Handlers 목록 + 임시 인증 Action(v0.9) | 기존 §6.1 API 목록을 기술스택에 맞게 재작성 |
| 4. 기능 요구사항 구현 매핑 | REQ-FUNC-001~025 → 구현 위치 | 요구사항 원문은 기존 SRS §4.1과 동일, 반복하지 않음 |
| 5. 비기능 요구사항 | Vercel/서버리스 제약을 반영한 재검토 + 기술스택발 신규 NFR | 기존 §4.2 확장 |
| 6. 데이터 설계 | ERD + Prisma 스키마 | 기존 §6.2 ERD와 동일 개체, Prisma 코드로 구체화 |
| 7. AI 통합 설계 | Vercel AI SDK + Gemini 연동 범위 | 기존 문서에 없던 신규 장(C-TEC-005·006 반영) |
| 8. 배포 및 운영 | Vercel 배포 파이프라인 + 유료 전환 트리거(v0.9) | 신규 장(C-TEC-007 반영) |
| 9. 설계 제약 (ADR) | 기술스택 채택 결정 + 포터빌리티 트레이드오프 ADR(v0.9) | 기존 §13(ADR)과 별도로, 기술스택 관련 결정만 기록 |
| 10. 요구사항 ↔ 문서 대응표 | 전체 추적성 | 기존 §5 추적성 매트릭스의 기술스택 버전 |
| 11. 릴리스 단계 세분화 (v0.9 신규) | 단계 1의 1-A/1-B 재분할, 임시 인증 적용 범위 | 기존 §14(요구사항 배분 및 릴리스 계획)를 이 기술스택 관점에서 한 단계 더 쪼갠 것 |

---

## 1. 서론

### 1.1 목적

본 문서는 네이버 부동산의 관심매물 저장 이후 구간에서 동작하는 2인 공동 주거 의사결정 기능(같이보기)을 **Next.js 단일 풀스택 애플리케이션**으로 구현하기 위한 소프트웨어 요구사항을 정의한다. 기존 SRS v1.0이 정의한 기능·비기능 요구사항의 "무엇을(What)"은 그대로 두고, 이 문서는 지정된 기술스택(§1.5) 아래에서 "어떻게(How)" 구현 가능한지를 정의한다.

### 1.2 배경

기존 SRS v1.0은 Shared Space Service · Condition Service · Judgment Engine · Compromise & Relaxation Service · Visit Selection Service · Field Record Service · Notification Service의 **7개 마이크로서비스**를 전제로 시스템 맥락을 서술했다. 이는 서비스 경계를 개념적으로 명확히 하기 위한 기술 중립적 표현이었다. 실제 구현 시에는 별도의 백엔드 서버군을 두지 않고, **Next.js 하나의 코드베이스와 하나의 Vercel 배포 단위**로 동일한 기능을 제공해야 한다는 기술적 요구가 있다(§1.5). 이 문서는 그 간극을 메운다.

### 1.3 범위

기능 범위는 기존 SRS v1.0 §1.2와 **완전히 동일**하다(단계 1 검증 코어 + 단계 2 종료점 완성, `[TBD]` 항목, 제외 항목 모두 동일). 아래는 이 문서가 추가로 다루는 범위만 명시한다.

**이 문서가 추가로 다루는 것**

- Next.js App Router 기준의 디렉터리 · 모듈 구조
- Server Actions / Route Handlers로의 API 재설계
- Prisma 스키마(코드 수준)
- Vercel 서버리스 제약을 반영한 비기능 요구사항 재검토
- Vercel AI SDK + Gemini 연동 설계(현재 MVP 범위에서 필수는 아님, §7 참조)
- Vercel 배포 파이프라인

**이 문서가 다루지 않는 것**

- 기능 요구사항의 신규 추가 · 변경 · 삭제 (기존 SRS §4.1, §4.2, §9 원문이 유일한 근거)
- 화면별 UI 인벤토리(PRD §17 원문 관리, 이 문서는 shadcn/ui 컴포넌트 매핑만 다룸)
- 네이버 내부 정책 확정 사항(§1.5, §5의 `[TBD]`는 기존 SRS의 `[TBD]`를 그대로 승계)

### 1.4 정의, 약어, 축약어

기존 SRS §1.3의 제품 용어(공유 객체, 사람귀속 조건, 판정, 미달량, 양보 문장 등)를 그대로 승계한다. 아래는 이 문서에서 추가로 쓰는 기술 용어만 정의한다.

| 용어 | 정의 |
| --- | --- |
| RSC (React Server Component) | 서버에서만 렌더링되는 React 컴포넌트. 이 문서에서 조회(읽기) 로직의 기본 구현 위치 |
| Server Action | `'use server'`로 선언된 서버 전용 함수. 클라이언트에서 직접 호출 가능하며 변경(쓰기) 로직의 기본 구현 위치 |
| Route Handler | `app/api/**/route.ts` 형태의 HTTP 핸들러. 외부 시스템이 우리를 호출하는 경우(웹훅 · Cron · OAuth 콜백)에만 사용 |
| ORM | Object-Relational Mapping. 이 문서에서는 Prisma를 지칭 |
| RLS (Row Level Security) | PostgreSQL/Supabase의 행 단위 접근 제어 기능 |
| Vercel Cron Job | `vercel.json`에 등록해 정해진 주기로 특정 Route Handler를 호출하는 Vercel 기능. 별도 배치 서버 없이 배치 작업을 대체 |
| Edge / Node 런타임 | Next.js가 각 라우트·액션에 지정할 수 있는 실행 환경. 이 문서는 DB 접근이 필요한 모든 경로에 Node 런타임을 지정한다 |

### 1.5 Assumptions & Constraints

본 절은 사용자가 확정한 기술스택 제약을 원문 그대로 반영한다. 이후 모든 장은 이 제약을 위반하지 않는 범위에서만 설계한다.

**(시스템 내부 — 단일 통합 프레임워크)**

| ID | 제약 |
| --- | --- |
| **C-TEC-001** | 모든 서비스는 Next.js (App Router) 기반의 단일 풀스택 프레임워크로 구현한다. (프론트엔드와 백엔드를 별도 분리하지 않는다.) |
| **C-TEC-002** | 서버 측 로직(DB 접근, API 호출 등)은 Next.js의 Server Actions 또는 Route Handlers를 사용하여 별도의 백엔드 서버 없이 구현한다. |
| **C-TEC-003** | 데이터베이스는 Prisma + 로컬 Supabase CLI를 사용하여 로컬 개발환경을 구성하고 배포 시 Supabase(PostgreSQL)를 사용하여 인프라 설정 복잡도를 최소화한다. |
| **C-TEC-004** | UI 및 스타일링은 Tailwind CSS와 shadcn/ui를 사용하여 AI가 일관된 디자인 코드를 생성하도록 강제한다. |

**(시스템 외부 — 연결 및 AI 통합)**

| ID | 제약 |
| --- | --- |
| **C-TEC-005** | LLM 오케스트레이션은 별도의 Python 서버 없이 Vercel AI SDK를 사용하여 Next.js 내부에서 직접 구현한다. |
| **C-TEC-006** | LLM 호출은 Google Gemini API를 기본으로 사용하며, 환경 변수 설정만으로 모델 교체가 가능하도록 SDK의 표준 인터페이스를 준수한다. |
| **C-TEC-007** | 배포 및 인프라 관리는 Vercel 플랫폼으로 단일화하며, CI/CD 설정 없이 Git Push만으로 배포를 자동화한다. |

**파생 가정** — 이 제약들로부터, 이 문서 전체가 따르는 세 가지 설계 원칙이 도출된다.

1. **물리적으로 분리된 서비스는 없다.** 기존 SRS의 "7개 마이크로서비스"는 Next.js 앱 안의 **논리적 모듈(도메인 폴더)**로만 존재한다(§2.2).
2. **인프라를 늘리지 않는다.** 캐시 · 배치 · 큐가 필요한 곳에도 Redis · 메시지 브로커 같은 별도 인프라를 추가하지 않고, Prisma로 접근하는 Postgres 테이블과 Vercel Cron Job으로 해결한다(§5, §6).
3. **LLM 오케스트레이션 방식은 표준화하되, 사용 여부는 별개의 제품 결정이다.** C-TEC-005·006은 "LLM을 쓴다면 어떻게 구현할지"(Python 서버 없이 Next.js 내부 · Vercel AI SDK · Gemini 기본값)를 정한 기술 표준이지, "LLM 기능을 반드시 넣어야 한다"는 기능 요구가 아니다. 현재 기능 요구사항이 실제로 생성형 AI를 필요로 하는지는 §7에서 별도로 판단하며, 그 판단에 따라 MVP는 이 표준화된 인터페이스를 준비만 해두고 호출하지 않는다(2026-08-26 제품 결정, `같이보기-srs-nextjs-기술스택변경-plan-v1_0.md` §2).

### 1.6 이 기술스택을 벗어나는 목표 기능 (적합성 검토)

§1.5의 제약을 기존 SRS의 기능 · 비기능 요구사항(REQ-FUNC-001~025, REQ-NF-001~007) 전체와 대조한 결과다. 대부분은 §2~§8에서 그대로 구현 가능하지만, 아래 항목들은 **C-TEC-001~007을 아무리 정확히 지켜도 그것만으로는 해결되지 않는** 지점이라 별도로 밝혀 둔다. 심각도는 "이 지점이 해결되지 않으면 기능 자체가 동작하지 않는가(치명적) / 요구사항의 SLO 문구를 문자 그대로 지키지 못하는가(높음) / 추가 설계·서비스가 필요한가(중간)"로 매겼다.

| ID | 목표 기능(요구사항) | 벗어나는 지점 | 심각도 | 권장 대응 |
| --- | --- | --- | --- | --- |
| **GAP-001** | REQ-FUNC-001(후보 구성), REQ-FUNC-016(재탐색 필터), REQ-NF-002 · 003(경로 · 검색 API) | C-TEC-001~007은 전부 **"이 API에 어떻게 접근하는가(구현 방법)"**를 다루지, **"이 API를 애초에 호출할 권한을 어떻게 얻는가"**는 다루지 않는다. 네이버 관심매물 조회 · 경로 계산 · 검색 결과수 API는 공개 API가 아니라 네이버 내부 시스템이며(기존 SRS LIM-05~08), 이 기술스택으로 아무리 잘 구현해도 네이버와의 공식 연동(API 키 발급 · 파트너십) 없이는 세 요구사항이 원천적으로 동작하지 않는다 | **치명적** | 실제 서비스라면 네이버와의 API 연동 확정이 이 문서·기존 SRS 어느 쪽 범위도 아닌 **선행 조건**임을 못박는다. 실습 · 포트폴리오 목적이라면 §3.3의 세 클라이언트를 목업 데이터 소스로 교체해야 이 스택 위에서 나머지 흐름을 실제로 검증할 수 있다 |
| **GAP-002** | REQ-FUNC-008(결과 후 로그인) | PRD 맥락상 이 기능은 네이버 부동산 내부 기능이라 "로그인"은 사실상 네이버 계정 로그인을 뜻하지만, C-TEC-003이 지정한 Supabase Auth의 표준 OAuth 프로바이더 목록에 네이버가 기본 포함되는지는 확인되지 않았다(Google · GitHub · Kakao 등은 표준 지원) | **높음** | 배포 전 Supabase Auth 프로바이더 목록에서 네이버 지원 여부를 확인한다. 미지원이면 커스텀 OIDC 프로바이더 설정이 추가로 필요하며, 이는 C-TEC-003이 명시한 "Prisma + Supabase 구성"의 기본 범위를 넘어서는 별도 작업이다 |
| **GAP-003** | REQ-FUNC-019(매물 소진 처리) AC-19-01 "감지 후 즉시 제거" | 네이버 웹훅 제공 여부가 불확실해(ADR-TECH-05) Vercel Cron Job 폴링으로 설계했는데, Vercel Cron은 요금제별 최소 실행 주기 제한이 있다(무료 요금제일수록 주기가 길다). 어떤 요금제든 폴링 주기만큼 지연이 발생하므로 "즉시"라는 SLO 문구를 문자 그대로는 이 스택에서 충족할 수 없다 | **높음** | 실제 배포 요금제를 정한 뒤 Cron 최소 주기를 확인하고, AC-19-01의 SLO를 "폴링 주기(예: N분) 이내 반영"으로 현실화하거나 네이버 웹훅 제공 여부를 먼저 재확인한다 |
| **GAP-004** | REQ-NF-001(E2E 응답시간 P95 ≤ 30초) | `같이보기-technical-design-v1_0.md` §8이 제안한 "후보 매물 · A 선호 카드 조회" 구간 예산이 최대 15,000ms다. Vercel 서버리스 함수는 요금제별 실행시간 상한이 있고, 낮은 요금제일수록 짧아 이 구간이 상한에 근접하거나 초과할 수 있다 | **중간** | 배포 요금제의 함수 실행시간 상한을 확인해 `maxDuration`을 명시적으로 설정하고, 필요하면 Suspense 스트리밍으로 첫 페인트를 먼저 보여줘 상한 초과 위험을 낮춘다(§5.1에 이미 있는 방향과 동일선상, 수치만 재확인 필요) |
| **GAP-005** | REQ-FUNC-024(상태 변화 알림) | 현재 설계(§4)는 페이지 재방문 시 조회하는 폴링형이며 실시간 push는 설계에 없다. C-TEC 제약에는 실시간 통신 수단이 명시돼 있지 않다. 알림 채널이 모바일 푸시로 확정되면 FCM 같은, 이 7개 제약 어디에도 없는 별도 서비스 연동이 필요하다 | **중간** | "즉시 알림"이 실제 요구라면 Supabase가 자체 제공하는 Realtime 기능(C-TEC-003 범위 안)으로 확장한다. 모바일 푸시까지 필요하다면 그 시점에 별도 제약(C-TEC-008 등)을 새로 정의해야 한다 — 현재 7개 제약만으로는 커버되지 않는다 |
| **GAP-006** | C-TEC-005 · 006(LLM 오케스트레이션) — 재확인 | C-TEC-005의 문구가 조건절 없이 단정형으로 바뀌었지만, 이는 "LLM을 어떻게 구현할지"에 대한 기술 표준을 정한 것이지 "LLM 기능을 반드시 넣으라"는 뜻이 아니다(§1.5 파생 가정 3). REQ-FUNC-012(양보 문장)는 여전히 PRD §14.1의 고정 템플릿이라 생성형 AI 호출이 필수가 아니다(§7.1) | **정보** | §7.2에 이미 설계된 선택적 확장 지점 외에는 Gemini를 호출할 필요가 없다는 판단을 유지한다(2026-08-26 재확인) |

이 중 **GAP-001**이 가장 근본적이다 — 나머지 다섯은 "이 스택으로 어떻게 더 잘 만들까"의 문제지만, GAP-001은 "네이버 API 접근권 없이는 이 제품의 핵심 전제 자체가 성립하지 않는다"는, 기술스택 선택과 무관하게 항상 존재했던 제약(기존 SRS LIM-05)이 이 문서에서 다시 표면화된 것이다.

---

## 2. 시스템 아키텍처

### 2.1 아키텍처 개관 — 단일 Next.js 모놀리스

**이 그림이 말하는 것:** 기존 SRS §3.1의 컨텍스트 다이어그램과 바깥 경계(외부 시스템)는 동일하다. 달라지는 것은 안쪽뿐이다 — 7개의 분리된 서비스 상자가 **하나의 Next.js 애플리케이션**으로 접힌다.

```mermaid
flowchart LR
    subgraph Client["클라이언트"]
        AW["A · PC 웹"]
        BW["B · 모바일 웹"]
    end

    subgraph Vercel["Vercel — Next.js 단일 애플리케이션 (C-TEC-001, 002)"]
        RSC["Server Components<br/>조회(읽기) 경로"]
        SA["Server Actions<br/>변경(쓰기) 경로"]
        RH["Route Handlers<br/>Cron · OAuth 콜백"]
        PRISMA[("Prisma Client")]
    end

    subgraph DB["Supabase PostgreSQL (C-TEC-003)"]
        PG[("같이보기 스키마")]
    end

    subgraph External["외부 시스템"]
        LISTAPI[["네이버 관심매물 조회 API"]]
        ROUTEAPI[["네이버 경로 계산 엔진"]]
        SEARCHAPI[["네이버 검색결과수 · 필터 API"]]
        GEMINI[["Google Gemini API<br/>(선택적, §7)"]]
    end

    AW --> RSC
    AW --> SA
    BW --> RSC
    BW --> SA
    RSC --> PRISMA --> PG
    SA --> PRISMA
    RH --> PRISMA
    RSC -->|"fetch"| LISTAPI
    SA -->|"fetch"| ROUTEAPI
    SA -->|"fetch"| SEARCHAPI
    SA -.->|"Vercel AI SDK (선택적)"| GEMINI

    style Vercel stroke-dasharray: 6 4
```

**핵심 판단** — 별도 백엔드 서버, 별도 API 게이트웨이, 별도 캐시 서버를 두지 않는다. Next.js 프로세스 하나가 렌더링과 데이터 접근을 모두 담당하며, Vercel이 이를 서버리스 함수로 자동 스케일링한다.

### 2.2 모듈 구조 — 7개 논리 도메인의 Next.js 매핑

기존 SRS §3의 7개 마이크로서비스는 물리적 서비스가 아니라 `lib/` 아래의 **논리 도메인 모듈**로 재배치된다. 서비스 이름과 책임(§1.3 서비스 책임과 경계, `같이보기-technical-design-v1_0.md` §1.3)은 그대로 유지되며, 서비스 간 화살표(§1.2 컴포넌트 다이어그램)는 모듈 간 함수 호출로 그대로 대응한다.

```text
app/
  invite/[code]/page.tsx              # B 진입점 — 링크 클릭 (UC-06, UC-07)
  spaces/[spaceId]/
    page.tsx                          # 공유 객체 대시보드
    conditions/page.tsx               # 조건 입력 (UC-02~04)
    judgments/page.tsx                # 판정 결과 목록 (UC-10)
    listings/[listingId]/page.tsx     # trade-off 상세 · 완화 (UC-11~15)
    visit-selection/page.tsx          # 방문 후보 선택 (UC-16)
    field-records/page.tsx            # 방문 전후 기록 — 단계 2 (UC-18, 19)
  api/
    auth/callback/route.ts            # Supabase Auth OAuth 콜백 (UC-08)
    cron/purge-expired-conditions/route.ts   # B 비로그인 조건 30일 삭제 (AC-07-03)
    cron/aggregate-metrics/route.ts   # §10.2 KPI 집계 배치

lib/
  actions/                            # Server Actions — 변경(쓰기) 전용
    shared-space.actions.ts           # ex-Shared Space Service
    condition.actions.ts              # ex-Condition Service
    compromise.actions.ts             # ex-Compromise & Relaxation Service
    visit-selection.actions.ts        # ex-Visit Selection Service
    field-record.actions.ts           # ex-Field Record Service
  queries/                            # Server Component에서 직접 호출하는 조회 함수
    shared-space.queries.ts
    judgment.queries.ts                # ex-Judgment Engine (조회 전용)
    notification.queries.ts           # ex-Notification Service (조회 전용)
  domain/                             # 순수 도메인 로직 (프레임워크 비의존)
    judgment/
      evaluators/                     # ConditionType별 평가기 (REQ-NF-007)
      status-classifier.ts
    compromise/
      sentence-generator.ts
      relaxation-simulator.ts
    visit-selection/
      two-round-selector.ts
  external/
    naver-listing.ts                  # 관심매물 조회 API 클라이언트 (실연동, 접근권 확보 후 활성화)
    naver-listing.mock.ts             # 고정 픽스처 기반 목업 (v0.9 신규)
    naver-route.ts                    # 경로 계산 엔진 클라이언트 + route_cache 조회
    naver-route.mock.ts               # 고정 픽스처 기반 목업 (v0.9 신규)
    naver-search.ts                   # 검색결과수 · 필터 API 클라이언트
    naver-search.mock.ts              # 고정 픽스처 기반 목업 (v0.9 신규)
    naver-gateway.ts                  # NAVER_API_MODE 환경변수로 실연동/목업 분기 (v0.9 신규)
    gemini.ts                         # Vercel AI SDK 래퍼 (§7)
  auth/
    magic-link.ts                     # Supabase Auth 매직 링크 (v0.9 신규, §11 1-A 임시 인증)
  db/
    prisma.ts                         # PrismaClient 싱글턴

prisma/
  schema.prisma                       # §6.2

components/
  ui/                                 # shadcn/ui 원본 컴포넌트 (C-TEC-004)
  domain/
    disclosed-value.tsx                # 전제 공개 포맷터 (REQ-NF-006)
    balanced-comparison.tsx            # A/B 균형 가드레일 렌더러 (REQ-FUNC-025)
```

**서비스 → 모듈 대응표**

| 기존 마이크로서비스(SRS §3) | Next.js 모듈 | 조회/변경 구현 위치 |
| --- | --- | --- |
| Shared Space Service | `actions/shared-space.actions.ts`, `queries/shared-space.queries.ts` | 초대·생성=Action, 맥락 조회=Query |
| Condition Service | `actions/condition.actions.ts` | 전량 Action(쓰기 위주) |
| Judgment Engine | `domain/judgment/*`, `queries/judgment.queries.ts` | 전량 Query(조회 전용, 판정은 조회 시 계산) |
| Compromise & Relaxation Service | `actions/compromise.actions.ts`, `domain/compromise/*` | 제안·수락=Action, 미리보기=Query 성격이나 완화 시뮬레이션 상태를 남기지 않으므로 Action으로 통일 |
| Visit Selection Service | `actions/visit-selection.actions.ts`, `domain/visit-selection/*` | 전량 Action |
| Field Record Service | `actions/field-record.actions.ts` | 전량 Action |
| Notification Service | `queries/notification.queries.ts` | 전량 Query(생성은 각 Action 내부에서 트리거) |

**v0.9 신규 — 외부 API 목업/실연동 스위치**

`MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md` §4.2가 지적한 대로, 네이버 관심매물·경로·검색 API 3종은 접근권 자체가 확보되지 않은 상태다(§1.6 GAP-001). 이를 "언젠가 해결할 문제"로 미뤄두지 않고, 지금부터 나머지 요구사항을 실제로 동작시킬 수 있도록 목업 스위치를 공식 설계에 포함한다.

- `lib/external/naver-*.ts`(실연동)와 `lib/external/naver-*.mock.ts`(고정 픽스처)를 항상 같은 인터페이스로 쌍으로 유지한다.
- `naver-gateway.ts`가 환경변수 `NAVER_API_MODE`(`mock` | `live`)에 따라 둘 중 하나로 라우팅한다. `domain/`·`actions/` 계층은 어느 쪽이 붙어 있는지 알지 못한다(인터페이스 동일).
- 로컬 개발과 §11의 1-A 단계는 기본값 `mock`으로 진행하며, 네이버 API 접근권이 확보된 이후에만 `live`로 전환한다.
- 목업 픽스처는 SRS §6.2 ERD의 `LISTING_REF` 형태를 그대로 따르는 고정 JSON 5~10건으로 구성해, 판정 엔진(§4의 REQ-FUNC-010A/010B)이 실제 데이터 형태와 동일한 입력을 받도록 한다.

### 2.3 요청 처리 경로 선택 기준

**이 그림이 말하는 것:** 하나의 사용자 행동이 Server Component 직접 호출 / Server Action / Route Handler 중 무엇으로 구현되는지를 결정하는 흐름이다.

```mermaid
flowchart TD
    S(["기능 하나"]) --> Q1{"데이터를 바꾸는가?"}
    Q1 -->|"아니오 (조회만)"| Q2{"클라이언트 컴포넌트에서<br/>직접 호출해야 하는가?"}
    Q2 -->|"아니오"| RSC["Server Component에서<br/>직접 호출하는 조회 함수<br/>(lib/queries/*)"]
    Q2 -->|"예 (무한스크롤 등)"| RH1["Route Handler (GET)"]
    Q1 -->|"예 (쓰기)"| Q3{"우리 시스템이<br/>먼저 시작하는가?"}
    Q3 -->|"예 (사용자 클릭)"| SA["Server Action<br/>(lib/actions/*)"]
    Q3 -->|"아니오 (외부·시각 트리거)"| RH2["Route Handler<br/>(Cron · Webhook · OAuth 콜백)"]

    style RSC fill:#d1e7dd,stroke:#198754
    style SA fill:#d1e7dd,stroke:#198754
```

**판단 근거** — Next.js 공식 권장 패턴을 그대로 따른다. 조회는 왕복(round-trip) 없이 Server Component가 직접 데이터를 읽어 초기 HTML에 포함시키는 것이 가장 빠르고(REQ-NF-001), 쓰기는 Server Action의 낙관적 갱신(optimistic update)으로 사용자 체감 지연을 줄인다. Route Handler는 **우리 시스템이 요청을 시작하지 않는 경우**(Vercel Cron, OAuth 콜백)로만 한정해, 불필요한 REST API 계층을 만들지 않는다(C-TEC-002).

---

## 3. 외부 인터페이스 요구사항

### 3.1 Server Actions 목록

기존 SRS §6.1의 REST API 엔드포인트 표를 Server Action 함수 시그니처로 재작성한 것이다. 모든 함수는 파일 상단에 `'use server'`를 선언하고 Node 런타임에서 실행된다.

| 모듈 | Server Action | 대응 요구사항 |
| --- | --- | --- |
| `shared-space.actions.ts` | `createSharedSpaceDraft(listingIds: string[]): Promise<SharedSpace>` | REQ-FUNC-001 |
| `shared-space.actions.ts` | `inviteParticipant(spaceId: string, relationshipType: RelationshipType): Promise<InviteBundle>` | REQ-FUNC-005 |
| `condition.actions.ts` | `saveBudgetAndCommute(personId: string, input: ConditionInput): Promise<Condition>` | REQ-FUNC-002 |
| `condition.actions.ts` | `addRequiredCondition(personId: string, condition: ConditionInput): Promise<ConditionSet>` | REQ-FUNC-003 |
| `condition.actions.ts` | `addPreference(personId: string, text: string): Promise<void>` | REQ-FUNC-004 |
| `condition.actions.ts` | `addConfirmationItem(personId: string, item: string): Promise<void>` | REQ-FUNC-004 |
| `condition.actions.ts` | `saveTemporaryCondition(inviteCode: string, input: ConditionInput): Promise<void>` | REQ-FUNC-007 |
| `condition.actions.ts` | `migrateTemporaryCondition(inviteCode: string, personId: string): Promise<void>` | REQ-FUNC-007, 008 |
| `compromise.actions.ts` | `previewRelaxation(personId: string, conditionKey: string, delta: number): Promise<PreviewResult>` | REQ-FUNC-013 |
| `compromise.actions.ts` | `proposeRelaxation(proposerId: string, targetId: string, conditionKey: string): Promise<RelaxationProposal>` | REQ-FUNC-014 |
| `compromise.actions.ts` | `respondToRelaxationProposal(proposalId: string, decision: "ACCEPTED" \| "REJECTED"): Promise<void>` | REQ-FUNC-014 |
| `compromise.actions.ts` | `translateToSearchFilter(spaceId: string): Promise<FilterUiSpec>` | REQ-FUNC-016 |
| `visit-selection.actions.ts` | `submitVisitSelection(spaceId: string, personId: string, listingIds: string[]): Promise<SelectionRound>` | REQ-FUNC-017 |
| `field-record.actions.ts` | `recordBrokerAnswer(questionId: string, answer: string): Promise<void>` | REQ-FUNC-022 |
| `field-record.actions.ts` | `saveFieldRecord(listingId: string, checklist: Checklist, outcome: FieldRecordOutcome): Promise<void>` | REQ-FUNC-023 |
| `auth/magic-link.ts` | `requestMagicLink(email: string): Promise<void>`(v0.9 신규, §11 1-A 임시 인증) | REQ-FUNC-008(임시 대체 경로) |
| `shared-space.actions.ts` | `identifyByInviteCode(inviteCode: string): Promise<PersonId>`(v0.9 신규, B의 계정 없는 임시 신원 부여) | REQ-FUNC-007(임시 대체 경로) |

**v0.9 신규 — 임시 인증 두 갈래**

GAP-002(§1.6)가 지적한 대로 Supabase Auth의 네이버 프로바이더 지원 여부가 미확정이므로, 확정 전까지 §11의 1-A 단계에서는 아래 두 대안 중 하나로 로그인을 대체한다. 둘 다 새 인프라를 추가하지 않는다(C-TEC-003 범위 안).

- **매직 링크(`requestMagicLink`)** — Supabase Auth 표준 기능. A·B가 이메일만으로 계정을 만들며, REQ-FUNC-008(결과 후 로그인)의 "로그인 시점" 요구를 검증하는 데 쓴다.
- **초대코드 임시 신원(`identifyByInviteCode`)** — B가 계정을 만들지 않고 초대코드 자체를 세션 식별자로 사용한다(REQ-FUNC-007의 임시 조건 저장 구조를 그대로 재사용). 계정이 없으므로 REQ-FUNC-008 자체는 검증하지 못하지만, 나머지 판정·완화·방문후보 결정 흐름 전체를 로그인 없이 끝까지 확인할 수 있어 1-A의 목적(핵심 경로 검증)에는 오히려 더 적합하다.

두 대안 모두 네이버 로그인이 확정되면 폐기하고 `/api/auth/callback`(§3.2)의 실제 OAuth 흐름으로 교체한다 — 그 시점까지 이 두 함수가 `PersonId`라는 동일한 반환 타입을 유지해, 위 계층(Server Actions/Queries)이 로그인 방식과 무관하게 동작하도록 한다.

### 3.2 Route Handlers 목록

우리 시스템이 요청을 시작하지 않는 경우로만 한정한다(§2.3).

| 경로 | 메서드 | 트리거 | 대응 요구사항 |
| --- | --- | --- | --- |
| `/api/auth/callback` | GET | Supabase Auth OAuth 콜백 | REQ-FUNC-008 |
| `/api/cron/purge-expired-conditions` | GET(Vercel Cron) | 매일 1회 배치 | REQ-FUNC-007 AC-07-03, LIM-12 |
| `/api/cron/aggregate-metrics` | GET(Vercel Cron) | 매일 1회 배치 | SRS §10.2 KPI 집계 |
| `/api/webhooks/listing-status`(`[TBD]`) | POST | 네이버 매물 상태 변경 웹훅 — **네이버가 웹훅을 제공하는지 자체가 미확정**(LIM-05와 동일 사유) | REQ-FUNC-019 |

매물 소진 감지(REQ-FUNC-019)는 웹훅이 제공되지 않는 경우 `/api/cron/*`와 같은 폴링 방식 Vercel Cron Job으로 대체한다. 이 결정은 §9(ADR-TECH-05)에 근거를 남긴다.

### 3.3 외부 시스템 연동

| 외부 시스템 | 연동 방식 | 구현 위치 | 관련 제약 |
| --- | --- | --- | --- |
| 네이버 관심매물 조회 API | 서버 측 `fetch()`, 읽기 전용. **v0.9: `NAVER_API_MODE=mock`이면 `naver-listing.mock.ts`가 대신 응답** | `lib/external/naver-listing.ts` + `naver-gateway.ts` | LIM-05, LIM-01, §1.6 GAP-001 |
| 네이버 경로 계산 엔진 | `fetch()` + Postgres 캐시 테이블(`route_cache`) 우선 조회. **v0.9: 목업 모드에서는 캐시 자체를 고정값으로 시딩** | `lib/external/naver-route.ts` + `naver-gateway.ts` | REQ-NF-002, 003 |
| 네이버 검색결과수 · 필터 API | `fetch()`, 클릭 시에만 이동 링크 생성. **v0.9: 목업 모드에서는 고정 결과 수 반환** | `lib/external/naver-search.ts` + `naver-gateway.ts` | LIM-07 |
| Google Gemini API | Vercel AI SDK(`ai` 패키지) `generateText()` / `streamText()`, 선택적 호출(§7) | `lib/external/gemini.ts` | C-TEC-005, 006 |

`naver-gateway.ts`의 라우팅 로직과 목업 픽스처 설계 근거는 §2.2 "v0.9 신규 — 외부 API 목업/실연동 스위치"를 참조한다.

---

## 4. 기능 요구사항 구현 매핑

요구사항 원문(제목·우선순위·인수 기준)은 기존 SRS `같이보기-srs-v1_0.md` §4.1, §9와 완전히 동일하므로 반복하지 않는다. 아래는 각 요구사항이 이 기술스택에서 **어디에 구현되는지**만 매핑한다.

| 요구사항 | 구현 위치 | 처리 경로 | 관련 Prisma 모델 |
| --- | --- | --- | --- |
| REQ-FUNC-001 후보 구성 | `actions/shared-space.actions.ts` | Server Action | `SharedSpace`, `ListingRef` |
| REQ-FUNC-002 기본 조건 입력 | `actions/condition.actions.ts` | Server Action | `Person` |
| REQ-FUNC-003 조건 점진적 확장 | `actions/condition.actions.ts` | Server Action(변경 후 판정 재계산 트리거) | `Person` |
| REQ-FUNC-004 선호 · 확인 항목 분리 | `actions/condition.actions.ts` | Server Action | `Person` |
| REQ-FUNC-005 상대 초대 | `actions/shared-space.actions.ts` | Server Action | `Invite` |
| REQ-FUNC-006 B의 맥락 있는 진입 | `queries/shared-space.queries.ts` | Server Component 직접 호출 | `SharedSpace`, `ListingRef` |
| REQ-FUNC-007 B 조건 입력 및 임시 보관 | `actions/condition.actions.ts` + `/api/cron/purge-expired-conditions` | Server Action + Route Handler(Cron) | `Invite.tempCondition` |
| REQ-FUNC-008 결과 후 로그인 | Supabase Auth + `/api/auth/callback` | Route Handler | `Person` |
| REQ-FUNC-009 1인 빈 경로 | `queries/judgment.queries.ts` | Server Component 직접 호출 | `JudgmentResult` |
| REQ-FUNC-010A · 010B 자동 판정 | `domain/judgment/evaluators/*` | Query 내부 계산(요청 시 즉시 계산, 별도 배치 없음) | `JudgmentResult` |
| REQ-FUNC-011 후보 목록 그룹화 | `domain/judgment/status-classifier.ts` | Query 내부 계산 | `JudgmentResult` |
| REQ-FUNC-012 trade-off 설명 | `domain/compromise/sentence-generator.ts` | Query 내부 계산 | `CompromiseSentence` |
| REQ-FUNC-013 조건 완화 미리보기 | `actions/compromise.actions.ts` | Server Action(상태 저장 없이 즉시 반환) | — |
| REQ-FUNC-014 상대 조건 완화 제안 | `actions/compromise.actions.ts` | Server Action | `RelaxationProposal` |
| REQ-FUNC-015 전부 불충족 분기 | `domain/compromise/relaxation-simulator.ts` | Server Action 내부 계산 | — |
| REQ-FUNC-016 재탐색 필터 전달 | `actions/compromise.actions.ts` | Server Action(URL 생성만, 이동은 클라이언트) | — |
| REQ-FUNC-017 방문 후보 2개 결정 | `domain/visit-selection/two-round-selector.ts` | Server Action | `VisitSelection` |
| REQ-FUNC-018 조건 지속 · 자동 재판정 | `domain/judgment/*` | 매물 변경 시 Query가 재계산(캐시 무효화만 발생, 별도 재판정 Action 없음) | `JudgmentResult` |
| REQ-FUNC-019 매물 소진 처리 | `/api/cron/*` 폴링 또는 웹훅(§3.2) | Route Handler | `ListingRef`, `VisitSelection` |
| REQ-FUNC-020 상태 · 계산 오류 분리 | `domain/judgment/status-classifier.ts` | Query 내부 계산 | `JudgmentResult.status` |
| REQ-FUNC-021 숫자 전제 공개 | `components/domain/disclosed-value.tsx` | UI 컴포넌트(횡단) | — |
| REQ-FUNC-022 중개사 질문 카드 | `actions/field-record.actions.ts` | Server Action | `BrokerQuestion` |
| REQ-FUNC-023 방문 후 기록 | `actions/field-record.actions.ts` | Server Action | `FieldRecord` |
| REQ-FUNC-024 선택 · 조건 변경 알림 | 각 Action 내부에서 `Notification` 레코드 생성 + `queries/notification.queries.ts` | Action(쓰기) + Query(조회) | `Notification`(신규, §6.2) |
| REQ-FUNC-025 균형 제시 가드레일 | `components/domain/balanced-comparison.tsx` | UI 컴포넌트(횡단) | — |

---

## 5. 비기능 요구사항

기존 SRS §4.2의 REQ-NF-001~007을 Vercel/서버리스 관점에서 재검토하고, 이 기술스택을 선택함으로써 새로 생기는 요구사항(REQ-NF-008~010)을 추가한다. 신규 항목은 **기능을 추가하는 것이 아니라, 지정된 기술스택으로 기존 기능을 구현하기 위해 반드시 지켜야 하는 제약**이라는 점에서 §1.5의 직접적 파생물이다.

### 5.1 기존 비기능 요구사항 재검토

| ID | 원문 요구사항 | Vercel/Next.js 관점 재검토 |
| --- | --- | --- |
| REQ-NF-001 | E2E 응답 시간 ≤ 30초(P95, 초대→B 첫 화면) | Vercel 서버리스 함수 실행시간 한도(플랜별 상이, 무료 등급 기준 짧음) 내에서 여유가 크다. `같이보기-technical-design-v1_0.md` §8의 구간별 예산(합계 ≤22,000ms)을 그대로 따르되, 관심매물 API 응답이 느린 구간은 Suspense 스트리밍으로 첫 페인트를 먼저 보여줘 **체감** 지연을 줄인다 |
| REQ-NF-002 | 완화 재계산 시 경로 API 재호출 0회 | 통근 임계값 조정은 클라이언트 상태(React state)에서 즉시 재계산 — 서버 왕복 자체가 없다 |
| REQ-NF-003 | 경로 API 호출 캐시 확장성 | 별도 캐시 인프라(Redis 등) 없이 `route_cache` Postgres 테이블 + Prisma unique 제약으로 구현(ADR-TECH-04) |
| REQ-NF-004 | 외부 API 장애 시 폴백 | 모든 `lib/external/*` 클라이언트는 `try/catch`로 감싸 실패 시 `CALCULATION_FAILED` 상태를 반환, 요청을 막지 않는다 |
| REQ-NF-005 | 공유 객체 접근 제어 | Supabase RLS 정책으로 `person_id`가 `shared_space`의 A 또는 B가 아니면 행을 반환하지 않도록 DB 레벨에서 강제(애플리케이션 레벨 검증과 이중화) |
| REQ-NF-006 | 전제 없는 숫자 금지 | `<DisclosedValue>`(shadcn/ui 기반) 컴포넌트가 숫자를 감싸지 않으면 렌더링되지 않도록 컴포넌트 레벨에서 강제 |
| REQ-NF-007 | 판정 조건 타입 확장 패턴 | `domain/judgment/evaluators/` 폴더에 `ConditionType` enum별 평가기를 레지스트리 패턴으로 등록, 신규 타입 추가 시 이 폴더에 파일만 추가 |

### 5.2 기술스택이 새로 요구하는 비기능 요구사항

| ID | 요구사항 | 근거 |
| --- | --- | --- |
| **REQ-NF-008** | 배포는 Vercel Git 연동 자동배포로만 수행하며, 별도 CI/CD 파이프라인(GitHub Actions 등)을 구성하지 않는다 | C-TEC-007 |
| **REQ-NF-009** | Gemini API 호출이 실패하거나 지연되면 결정론적 템플릿 생성 경로(§7.1)로 즉시 폴백하며, 사용자 요청을 막지 않는다 | C-TEC-005, 006 · "빈 화면 없음"과 동일 원칙 |
| **REQ-NF-010** | 로컬 개발 환경(Prisma + 로컬 Supabase)과 배포 환경(Supabase PostgreSQL)의 스키마는 Prisma Migrate로만 동기화하며, 두 환경에 별도 수동 스키마 변경을 적용하지 않는다 | C-TEC-003 |

---

## 6. 데이터 설계

### 6.1 ERD

기존 SRS §6.2와 개체 구성이 동일하다(§7 의도가 없음을 확인하기 위해 재수록). 이 문서에서 추가되는 개체는 `NOTIFICATION`과 `ROUTE_CACHE`뿐이며, 둘 다 기존 SRS가 텍스트로만 서술했던 것(Notification Service의 알림, §10.2의 경로 API 캐시)을 이 기술스택에서 구체적인 테이블로 구현하는 것이다.

```mermaid
erDiagram
    PERSON ||--o{ JUDGMENT_RESULT : "조건을 대입"
    PERSON ||--o{ RELAXATION_PROPOSAL : "발신 또는 수신"
    PERSON ||--o{ NOTIFICATION : "수신"
    SHARED_SPACE ||--|| PERSON : "A(초대자) 보유"
    SHARED_SPACE ||--o| PERSON : "B(참여자) 참여"
    SHARED_SPACE ||--|| INVITE : "초대 발급"
    SHARED_SPACE ||--o{ LISTING_REF : "후보 최대 5개"
    SHARED_SPACE ||--|| VISIT_SELECTION : "방문 후보 결정"
    LISTING_REF ||--o{ JUDGMENT_RESULT : "판정 대상"
    LISTING_REF ||--o{ BROKER_QUESTION : "확인 필요 항목"
    LISTING_REF ||--o| FIELD_RECORD : "방문 후, 단계 2"
    JUDGMENT_RESULT ||--o| COMPROMISE_SENTENCE : "한쪽만 충족 시 생성"
```

개체별 속성은 §6.2(Prisma 스키마)에서 코드 수준으로 정의하므로 표로 중복하지 않는다.

### 6.2 Prisma 스키마

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // 로컬: 로컬 Supabase, 배포: Supabase PostgreSQL (C-TEC-003)
}

enum Role {
  A
  B
}

enum ConditionType {
  UPPER_BOUND   // 예산 · 통근시간 · 역 도보
  LOWER_BOUND   // 전용면적
  PRESENCE      // 주차
  EXACT_MATCH   // 매물 유형
}

enum JudgmentStatus {
  MET
  UNMET
  CONFIRMATION_NEEDED
  CALCULATION_FAILED
  NOT_APPLICABLE
}

enum RelaxationProposalStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum FieldRecordOutcome {
  KEEP
  HOLD
  EXCLUDE
}

enum NotificationType {
  CONDITION_CHANGED
  RELAXATION_PROPOSED
  LISTING_CHANGED
  VISIT_SELECTION_CHANGED
}

model Person {
  id                 String   @id @default(cuid())
  sharedSpace        SharedSpace? @relation("SpacePersons", fields: [sharedSpaceId], references: [id])
  sharedSpaceId      String?
  role               Role
  relationshipType   String?  // A가 초대 시 1회 선택
  budgetCap          Int      // 항상 필수
  commutes           Boolean  @default(false)
  commuteOrigin      String?
  commuteMode        String?  // 대중교통 기본, 자차 선택
  requiredConditions Json     @default("[]") // 0~4개, {key, operator, value}[]
  preferences        Json     @default("[]") // 자유 문장 0~3개, 판정 미사용
  confirmationItems  Json     @default("[]") // 상한 없음, 판정 미사용
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  judgmentResults      JudgmentResult[]
  relaxationsProposed  RelaxationProposal[] @relation("Proposer")
  relaxationsTargeted  RelaxationProposal[] @relation("Target")
  notifications        Notification[]
}

model SharedSpace {
  id               String   @id @default(cuid())
  connectionStatus String   @default("AWAITING_B")
  persons          Person[] @relation("SpacePersons")
  listings         ListingRef[]
  invite           Invite?
  visitSelection   VisitSelection?
  createdAt        DateTime @default(now())
}

model Invite {
  code               String   @id @default(cuid())
  sharedSpace        SharedSpace @relation(fields: [sharedSpaceId], references: [id])
  sharedSpaceId      String   @unique
  linkUrl            String
  tempCondition      Json?    // B 비로그인 임시조건
  lastAccessedAt     DateTime @default(now())
  migratedAt         DateTime?
  createdAt          DateTime @default(now())

  @@index([lastAccessedAt]) // REQ-FUNC-007 AC-07-03 배치 삭제용
}

model ListingRef {
  id                 String   @id @default(cuid())
  sharedSpace        SharedSpace @relation(fields: [sharedSpaceId], references: [id])
  sharedSpaceId      String
  coordinates        String
  deposit            Int
  rent               Int
  maintenanceFee     Int
  area               Float
  listingType        String
  parking            Boolean
  walkToStationMin   Int
  transactionStatus  String   @default("ACTIVE")

  judgmentResults    JudgmentResult[]
  brokerQuestions    BrokerQuestion[]
  fieldRecord        FieldRecord?
}

model JudgmentResult {
  id            String         @id @default(cuid())
  person        Person         @relation(fields: [personId], references: [id])
  personId      String
  listing       ListingRef     @relation(fields: [listingId], references: [id])
  listingId     String
  conditionKey  String
  status        JudgmentStatus
  gapAmount     String?
  compromiseSentence CompromiseSentence?
  updatedAt     DateTime       @updatedAt

  @@unique([personId, listingId, conditionKey])
}

model CompromiseSentence {
  id               String   @id @default(cuid())
  judgmentResult   JudgmentResult @relation(fields: [judgmentResultId], references: [id])
  judgmentResultId String   @unique
  losingPersonId   String
  lostCondition    String
  relativeRank     Int      // 후보 5개 안 상대 순위, 절대값 아님
}

model RelaxationProposal {
  id             String                   @id @default(cuid())
  proposer       Person                   @relation("Proposer", fields: [proposerId], references: [id])
  proposerId     String
  target         Person                   @relation("Target", fields: [targetId], references: [id])
  targetId       String
  conditionKey   String
  proposedValue  String                   // 실제 미달량에서 산출
  status         RelaxationProposalStatus @default(PENDING)
  createdAt      DateTime                 @default(now())
}

model VisitSelection {
  id                String   @id @default(cuid())
  sharedSpace       SharedSpace @relation(fields: [sharedSpaceId], references: [id])
  sharedSpaceId     String   @unique
  round             Int      @default(1) // 최대 2라운드
  finalCandidates   Json?    // 최대 2개, 분할 포함
  updatedAt         DateTime @updatedAt
}

model BrokerQuestion {
  id                 String @id @default(cuid())
  listing            ListingRef @relation(fields: [listingId], references: [id])
  listingId          String
  confirmationItem   String
  answer             String?
  status             String @default("PENDING")
}

model FieldRecord {
  id         String              @id @default(cuid())
  listing    ListingRef          @relation(fields: [listingId], references: [id])
  listingId  String              @unique
  checklist  Json                // 층간소음 등 6항목, 전부 표시
  outcome    FieldRecordOutcome?
}

model Notification {
  id         String           @id @default(cuid())
  person     Person           @relation(fields: [personId], references: [id])
  personId   String
  type       NotificationType
  payload    Json
  readAt     DateTime?
  createdAt  DateTime         @default(now())

  @@index([personId, readAt])
}

// REQ-NF-002, 003 — 별도 캐시 인프라 없이 Postgres로 구현(ADR-TECH-04)
model RouteCache {
  id           String   @id @default(cuid())
  origin       String
  coordinates  String
  commuteMode  String
  durationMin  Int
  computedAt   DateTime @default(now())

  @@unique([origin, coordinates, commuteMode])
}
```

### 6.3 로컬-프로덕션 환경 전략

| 단계 | 환경 | 명령 |
| --- | --- | --- |
| 로컬 개발 | 로컬 Supabase CLI(Docker) | `supabase start` → `prisma migrate dev` |
| 스키마 변경 | 로컬에서 마이그레이션 파일 생성 | `prisma migrate dev --name <변경명>` |
| 배포 | Supabase(PostgreSQL) | `prisma migrate deploy`(Vercel 빌드 스텝에 포함) |
| 시드 데이터 | 로컬 전용 | `prisma db seed` |

두 환경의 스키마가 갈리지 않도록, 수동 SQL 실행은 금지하고 모든 스키마 변경은 `prisma/migrations/`를 거친다(REQ-NF-010).

---

## 7. AI 통합 설계 (Vercel AI SDK + Gemini)

### 7.1 현재 MVP의 AI 사용 범위

먼저 짚어야 할 것 — **기존 기능 요구사항(REQ-FUNC-001~025)은 생성형 AI(LLM) 호출을 필수로 요구하지 않는다.** 양보 문장(REQ-FUNC-012)은 PRD §14.1이 정한 고정 구조("[누가][무엇을][얼마나] 감수하고, [대신]...")를 따르는 **결정론적 템플릿**이며, "AI"라는 제품명·PRD §15의 "AI 역할"은 조건 대조·설명 로직 자체를 가리키는 제품 프레이밍이지 LLM 호출을 의미하지 않는다. 총점·복합순위를 금지하는 `decisions/0001`과 판정의 재현 가능성 요구(REQ-FUNC-020)는 비결정적인 LLM 출력과 근본적으로 상충한다(ADR-TECH-04).

따라서 C-TEC-005·006이 표준화하는 "LLM을 어떻게 부를 것인가"라는 기술 패턴은 준비해 두되, 현재 MVP는 이를 실제로 호출하지 않는다 — 이는 §1.5 파생 가정 3에서 명문화한 별개의 제품 결정이다. `CompromiseSentenceGenerator`(§4의 `domain/compromise/sentence-generator.ts`)는 순수 템플릿 함수로 구현하며 외부 API를 호출하지 않는다.

덧붙여 C-TEC-005는 LLM 오케스트레이션을 위해 흔히 쓰이는 별도 Python 백엔드(LangChain 서버 등) 패턴을 명시적으로 배제한다 — 이 프로젝트에서는 그 갈림길 자체가 아직 등장하지 않았다는 뜻이기도 하다.

> **v0.9 참고(SRS 범위 밖):** `MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md`는 "AI(바이브코딩) 생성 결과물에 대한 필수 사람 검토 체크포인트"를 판정 엔진·양보 문장 로직에 특히 강하게 권고한다 — AI 코드생성이 `decisions/0001`(총점 금지)을 조용히 위반하는 경향이 있기 때문이다. 다만 이는 요구사항이 아니라 팀 개발 프로세스에 관한 권고라 이 SRS의 범위에는 넣지 않으며, 별도의 개발 프로세스 문서에서 관리한다.

### 7.2 확장 지점 설계

그럼에도 C-TEC-005·006을 완전히 반영하기 위해, **향후 생성형 AI가 실제로 필요해질 경우**를 대비한 확장 지점을 표준 인터페이스로 미리 설계해 둔다.

| 확장 후보 | 트리거 조건 | Gemini 사용 방식 |
| --- | --- | --- |
| 양보 문장의 표현 다양화 | 고정 템플릿이 반복적으로 어색하다는 사용성 피드백 발생 시 | 템플릿이 산출한 구조화 데이터(누가·무엇을·얼마나)를 Gemini에 전달해 문장만 다시 쓰게 하고, **숫자·조건·감수 관계는 템플릿이 검증한 값만 사용** — LLM이 사실을 새로 만들지 않는다 |
| 자연어 조건 질의(예: "역 5분 이내인데 방음 되는 집") | PRD가 자연어 입력을 범위에 포함할 경우 | 자연어 → 구조화 조건(§4.1 REQ-FUNC-002~004 스키마) 파싱에만 사용, 파싱 결과는 사용자에게 확인받은 뒤에만 저장 |

```typescript
// lib/external/gemini.ts — Vercel AI SDK 표준 인터페이스(C-TEC-006)
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const MODEL = process.env.AI_MODEL_ID ?? "gemini-1.5-flash"; // 환경 변수만으로 모델 교체

export async function rewriteCompromiseSentence(structuredFacts: CompromiseFacts) {
  try {
    const { text } = await generateText({
      model: google(MODEL),
      prompt: buildPromptFromFacts(structuredFacts), // 숫자·조건은 facts에서만 가져옴
    });
    return text;
  } catch {
    return renderTemplateSentence(structuredFacts); // REQ-NF-009 폴백
  }
}
```

`@ai-sdk/google`을 다른 `@ai-sdk/*` 프로바이더로 교체해도 `generateText()` 호출 코드는 바뀌지 않는다 — 이것이 C-TEC-006이 요구하는 "SDK 표준 인터페이스 준수"다.

---

## 8. 배포 및 운영

### 8.1 Vercel 배포 파이프라인

```mermaid
flowchart LR
    DEV["로컬 개발<br/>로컬 Supabase CLI"] -->|git push| REPO[["GitHub 저장소"]]
    REPO -->|Vercel Git 연동| BUILD["Vercel 빌드<br/>prisma migrate deploy → next build"]
    BUILD -->|main 브랜치| PROD["프로덕션 배포<br/>Supabase PostgreSQL"]
    BUILD -->|그 외 브랜치 · PR| PREVIEW["프리뷰 배포<br/>브랜치별 URL"]

    style PROD fill:#d1e7dd,stroke:#198754
```

별도 CI/CD 설정(GitHub Actions 등)을 두지 않는다(REQ-NF-008, C-TEC-007). 빌드 스텝의 `prisma migrate deploy`가 배포 환경 스키마를 최신 마이그레이션으로 맞춘다(REQ-NF-010).

### 8.2 환경 변수 관리

| 변수 | 용도 | 환경 |
| --- | --- | --- |
| `DATABASE_URL` | Prisma 접속 문자열 | 로컬(로컬 Supabase CLI) / 배포(Supabase) 각기 다른 값 |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY` | Supabase Auth · 클라이언트 SDK | 공통 |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API 키 | §7 확장 지점 활성화 시에만 필요 |
| `AI_MODEL_ID` | 모델 교체용(C-TEC-006) | 기본값 `gemini-1.5-flash` |
| `NAVER_LISTING_API_*`, `NAVER_ROUTE_API_*`, `NAVER_SEARCH_API_*` | 네이버 내부 API 인증 | `[TBD]` — LIM-05~08과 동일하게 정책 확정 대기 |

Vercel 프로젝트 설정의 Environment Variables 화면에서만 관리하며, `.env` 파일은 로컬 전용이고 저장소에 커밋하지 않는다.

### 8.3 모니터링

기존 SRS §10.3(관측 항목 및 알림)의 항목을 이 스택에서 관측하는 방법만 매핑한다. 지표 정의·임계치는 §10.3 원문과 동일하며 `[TBD]`도 승계한다.

| 관측 항목(SRS §10.3) | 이 스택에서의 구현 |
| --- | --- |
| E2E 응답 시간(REQ-NF-001) | Vercel Analytics + Server Action/Route Handler 실행 시간 로그 |
| 외부 API 오류율 · 지연 | `lib/external/*`의 try/catch 블록에서 `Notification`·별도 로그 테이블에 기록 |
| 경로 API 캐시 히트율 | `route_cache` 조회 시 히트/미스를 `/api/cron/aggregate-metrics`가 집계 |
| KPI 이벤트(SRS §10.2) | Server Action 내부에서 `Notification`과 별도로 이벤트를 남기는 대신, 이 문서 범위에서는 각 Action이 직접 관련 테이블(`JudgmentResult`, `VisitSelection` 등)의 타임스탬프를 이벤트 소스로 재사용 — 별도 이벤트 테이블 도입은 트래픽이 실측된 이후 재검토(`[TBD]`) |
| **유료 전환 트리거(v0.9 신규)** | H1 검증 규모(초대 30건/4주, PRD §24.4)에서는 Vercel·Supabase 무료 티어로 충분하다는 것이 `MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md` §4.3의 판단이다. 다만 두 가지는 비용과 무관하게 배포 전 확인한다 — ① Vercel Hobby 요금제의 **상업적 이용 약관**(실습·검증을 넘어 실사용자에게 노출하는 시점부터는 Pro 전환 필요 여부 재확인), ② Supabase 무료 프로젝트의 **비활동 휴면 정책**(4주 단위로 느슨한 이 프로젝트 검증 주기상 데모 직전 "깨어나지 않는" 상황 방지). 유료 전환 자체의 트리거는 "§10.1 North Star·가드레일 실측치가 무료 티어 한도(DB 용량 · Auth MAU · 함수 실행 시간)에 근접할 때"로 잠정 정의하며, 정확한 한도·가격은 배포 직전 각 서비스 공식 페이지에서 재확인한다(`[TBD]`) |

---

## 9. 설계 제약 (ADR) — 기술스택 채택 결정

기존 SRS §13의 ADR(`decisions/0001~0004`)은 제품 결정이며 이 문서에서 다루지 않는다. 아래는 **이 기술스택 버전에서만 유효한** 기술 결정을 기록한다.

| ID | 결정 | 맥락 | 채택 근거 | 기각한 대안 | 되돌림 비용 |
| --- | --- | --- | --- | --- | --- |
| **ADR-TECH-01** | 7개 마이크로서비스를 물리적으로 분리하지 않고 Next.js 단일 모놀리스 안의 논리 모듈로 구현한다 | C-TEC-001, 002가 단일 프레임워크·서버 없음을 명시 | 소규모 팀·빠른 반복에는 배포 단위 하나가 유리하고, 서비스 간 네트워크 호출 오버헤드가 없다 | 서비스별 독립 배포(기존 SRS §3 그대로) — 트래픽이 실제로 서비스별로 불균형해질 때만 재검토 | 중간 — Judgment Engine처럼 계산량이 큰 모듈만 별도 함수/서비스로 분리 가능(모듈 경계를 이미 §2.2에서 나눠 둠) |
| **ADR-TECH-02** | 캐시·배치 전용 인프라(Redis, 메시지 브로커)를 추가하지 않고 Postgres 테이블 + Vercel Cron Job으로 대체한다 | C-TEC-003이 인프라 설정 복잡도 최소화를 요구 | `route_cache` 테이블 하나로 REQ-NF-002·003을 충족하며, 이미 있는 Prisma 연결을 재사용 | Redis 캐시 — 별도 프로비저닝·비용 발생 | 낮음 — 캐시 테이블을 Redis로 교체해도 호출부(`naver-route.ts`) 인터페이스는 유지 가능 |
| **ADR-TECH-03** | 조회(읽기)는 Server Component 직접 호출, 변경(쓰기)은 Server Action, 외부 기동 이벤트만 Route Handler로 구분한다 | Next.js App Router의 권장 패턴과 C-TEC-002가 일치 | 불필요한 REST 계층 제거, 왕복 감소로 REQ-NF-001에 유리 | 모든 것을 REST Route Handler로 통일 — 기존 SRS §6.1과 형태는 비슷하지만 Next.js에서는 왕복이 늘어남 | 낮음 — 필요 시 특정 Query를 Route Handler로 노출 가능 |
| **ADR-TECH-04** | 생성형 AI(Gemini)는 핵심 판정·양보 문장 로직에는 사용하지 않고, 표현 다양화 등 선택적 확장 지점에만 표준 인터페이스로 연결한다 | `decisions/0001`(총점 금지)·REQ-FUNC-020(재현 가능한 5분류 판정)이 요구하는 결정론성과 LLM의 비결정성이 상충 | 판정 결과가 매번 달라지면 §9(수용 기준)의 SLO(오분류 0건 등)를 보장할 수 없다 | 판정·양보 문장 생성 자체를 LLM에 위임 — 재현성·검증 가능성 상실 | 낮음 — §7.2 확장 지점이 이미 표준 인터페이스로 준비되어 있어 필요 시점에 연결만 하면 됨 |
| **ADR-TECH-05** | 매물 소진 감지(REQ-FUNC-019)는 네이버 웹훅 제공 여부가 불확실하므로 1차로 Vercel Cron Job 폴링으로 구현한다 | LIM-05와 동일하게 네이버 내부 API 사정이 우리가 결정할 수 없는 영역 | 웹훅 유무와 무관하게 항상 동작하는 폴백을 먼저 확보 | 웹훅 전제 설계만 하고 폴링을 준비하지 않음 — 웹훅 미제공 시 기능 자체가 동작 불가 | 낮음 — 웹훅이 확정되면 `/api/webhooks/listing-status`를 추가하고 폴링 주기만 늘리면 됨 |
| **ADR-TECH-06**(v0.9 신규) | Vercel 특화 기능(Cron Job, Analytics, 서버리스 함수 실행 모델)을 그대로 사용하며, 이것이 **의식적인 포터빌리티 트레이드오프**임을 명문화한다 | C-TEC-007이 요구하는 "배포·인프라 관리 Vercel 단일화"는 설정 복잡도를 줄이지만, 그만큼 타 플랫폼 이전 비용을 늘린다(`MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md` §4.2) | MVP 검증 단계에서는 인프라 관리 부담을 줄여 개발 속도를 확보하는 것이 포터빌리티보다 우선한다. Next.js·Prisma·Tailwind·shadcn·Supabase 코어는 오픈소스라 애플리케이션 코드 자체의 이식성은 유지된다 | 처음부터 플랫폼 중립적으로 설계(자체 Cron 서버, 커스텀 배포 파이프라인 등) — C-TEC-001·002·007이 금지하는 "별도 백엔드·CI/CD 구성"과 직접 상충 | 중간 — Vercel Cron Job은 `route.ts` 안의 순수 로직만 남기고 트리거를 타 스케줄러로 바꾸면 이전 가능. Analytics는 대체 서비스로 교체만 하면 됨(도메인 로직 영향 없음) |

---

## 10. 요구사항 ↔ 문서 대응표

| 요구사항/영역 | 이 문서 | 기존 SRS(`같이보기-srs-v1_0.md`) | 기존 TDD(`같이보기-technical-design-v1_0.md`) |
| --- | --- | --- | --- |
| 기능 요구사항 원문 | §4(매핑만) | §4.1, §9(원문) | §2.2(유스케이스 명세) |
| 비기능 요구사항 원문 | §5.1(재검토) | §4.2(원문) | §8(성능 예산) |
| 시스템 아키텍처 | §2(Next.js 모놀리스) | §3(마이크로서비스, 기술 중립적) | §1(컨텍스트 · 컴포넌트) |
| 데이터 모델 | §6(ERD + Prisma) | §6.2(ERD), §6.3(Java enum) | §3.1(ERD), §3.2(상태 다이어그램) |
| API/인터페이스 | §3(Server Actions/Route Handlers) | §6.1(REST 엔드포인트) | §4(클래스 다이어그램) |
| 검증 · KPI | §8.3(관측 매핑만) | §10(원문) | §7(계측 파이프라인) |
| 설계 결정 | §9(기술 ADR) | §13(제품 ADR, `decisions/0001~0004`) | — |
| 릴리스 단계(v0.9 신규) | §11(1-A/1-B 재분할) | §14(단계 1/단계 2 원문) | — |

---

## 11. 릴리스 단계 세분화 — 1-A / 1-B (v0.9 신규)

> **근거:** `MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md` §4.1 — 기존 SRS §14.1(단계 1 · 검증 코어)이 REQ-FUNC-001~021·024·025(25개 중 21개)를 포함해 "검증 코어"라는 이름과 달리 실질적으로는 거의 완제품 범위라는 지적을 반영한다. §10.4의 H1 게이트를 통과한 뒤 곧바로 21개 전체를 향해 달리는 대신, **North Star(§10.1) 실측에 필요한 최소 경로**부터 먼저 끝낸다.

### 11.1 1-A — 핵심 검증

North Star("초대 발송 후 7일 내 방문 후보 2개 확정 비율", PRD §24.1)를 실측하는 데 필요한 최소 경로만 포함한다. 완화·재탐색·전제공개·알림 없이도 "조건 입력 → 판정 → 방문 후보 2개 확정"이라는 핵심 여정을 검증할 수 있다.

| 포함 요구사항 | 구현 위치(이 문서) | 비고 |
| --- | --- | --- |
| REQ-FUNC-001(후보 구성) | §4 | §2.2 목업 모드로 네이버 API 없이도 진행 |
| REQ-FUNC-002(기본 조건 입력) | §4 | — |
| REQ-FUNC-005 · 006(초대 · 참여) | §4 | 로그인은 §3.1의 임시 인증(매직 링크 또는 초대코드 신원) 사용 |
| REQ-FUNC-009(1인 빈 경로) | §4 | — |
| REQ-FUNC-010A · 010B(자동 판정) | §4 | 이 프로젝트에서 난이도가 가장 높은 영역(검토 보고서 §3) — 1-A에 포함해 가장 먼저, 가장 오래 검증한다 |
| REQ-FUNC-011(후보 그룹화) | §4 | — |
| REQ-FUNC-017(방문 후보 2개 결정) | §4 | North Star 달성 지점 |
| REQ-FUNC-020(상태 · 계산 오류 분리) | §4 | 판정 엔진과 함께 반드시 동시 검증 |
| REQ-FUNC-025(균형 가드레일) | §4 | 제품 정체성(`decisions/0001`)과 직결 — 처음부터 포함 |

### 11.2 1-B — 제품 완성도

1-A로 North Star를 실측해 §10.4 H3 게이트를 통과한 뒤에 투자한다. 특히 REQ-FUNC-012~016(양보 문장·완화)은 개발 난이도가 가장 높은 영역 중 하나(검토 보고서 §3)라, 핵심 경로가 먼저 검증된 다음 투입하는 편이 리스크 분산에 유리하다.

| 포함 요구사항 | 비고 |
| --- | --- |
| REQ-FUNC-003 · 004(조건 확장, 선호 · 확인 항목) | — |
| REQ-FUNC-007 · 008(비로그인 임시 보관, 결과 후 로그인) | 임시 인증(§3.1)에서 실제 네이버 로그인으로 전환하는 시점과 맞물린다 |
| REQ-FUNC-012~016(양보 문장 · 완화 · 재탐색) | 난이도 최상 — `decisions/0001`(총점 금지) 위반 여부를 사람이 반드시 검토(§7.1 v0.9 참고) |
| REQ-FUNC-018 · 019(조건 지속, 매물 소진) | 매물 소진은 §3.2 ADR-TECH-05의 폴링 지연을 감안해 SLO 기대치 조정 |
| REQ-FUNC-021(숫자 전제 공개) | 화면 전반에 걸친 횡단 요구라 완성도 단계에서 일괄 적용이 효율적 |
| REQ-FUNC-024(상태 변화 알림) | — |

단계 2(REQ-FUNC-022·023, 기존 SRS §14.2)는 이 재분할과 무관하게 그대로 유지한다.

---

**SRS-JOINTHOME-NEXTJS-001 · v0.9 · 2026-08-26**

상위 문서: `같이보기-srs-v1_0.md` · `같이보기-prd-v1_0.md` · `같이보기-technical-design-v1_0.md`

관련 문서(v0.9 근거): `같이보기-srs-nextjs-기술스택변경-plan-v1_0.md` · `MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md`
