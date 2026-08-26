# 같이 고르기 — 네이버 부동산 공동 주거 의사결정 기능 역기획

네이버 부동산의 관심매물 저장 이후 구간에서 동작하는 **2인 공동 주거 의사결정 기능**을 역기획하고, PRD → SRS로 이어지는 요구공학 산출물을 만드는 팀 프로젝트다. 이 저장소는 그중 **최종 PRD와 SRS 문서(마크다운 원본)만** 담는다. 리서치 로그·발표 덱·프로토타입 등 그 외 작업 자료는 이 저장소 범위 밖이다. **HTML 렌더링본은 PC 로컬 폴더에만 저장하며 이 저장소에는 푸시하지 않는다** (`.gitignore`의 `*.html`).

## SRS 작업 목표 (중요)

이 저장소에서 진행 중인 **SRS(Software Requirements Specification) 변환 작업**은 아래 원칙을 따른다.

1. **목표는 ISO/IEC/IEEE 29148:2018 표준에 맞춘 "풀 스펙" 문서를 새로 쓰는 것이 아니다.** 목표는 팀이 참고용으로 받은 예시 SRS 문서(`[SRS 문서] AD-Core-Platform (한글).md` — 1.서론 / 2.이해관계자 / 3.시스템 맥락 및 인터페이스 / 4.구체적 요구사항 / 5.추적성 매트릭스 / 6.부록 / 7.향후 개선 사항 구조)와 **같은 포맷·같은 범위(scope)**로 PRD 내용을 옮기는 것이다.
2. **PRD의 내용이 예시 SRS 문서가 다루는 범위를 벗어나는 경우에만** 확장한다. 이때도 임의의 새 구조를 만들지 않고, ISO/IEC/IEEE 29148:2018 Clause 9.6(Software requirements specification content)의 대응 조항에 맞춰 해당 부분만 새 챕터로 확장해서 작성한다. 새 챕터는 PRD에 이미 작성된 내용만 재구성하며 새 요구사항을 만들지 않는다.
3. 즉, "표준을 준수하기 위해 문서를 부풀리는 것"이 아니라 "예시 문서의 포맷을 기준으로 PRD를 옮기고, 모자라는 부분만 표준 구조에 맞춰 보충하는 것"이 이번 작업의 정확한 목표다. `같이보기-srs-v1_0.md`의 §1~§7은 예시 템플릿과 같은 포맷이고, §8~§12는 그 확장이다(각 장이 대응하는 §9.6 조항을 본문에 명시했다).
4. KPI/성공 지표, 화면별 인벤토리처럼 29148 §9.6.x의 어느 조항에도 대응하지 않는 PRD 내용은 SRS에 억지로 편입하지 않고 PRD 원문에만 둔다.
5. 이 원칙은 이후 SRS 문서를 개정하거나 재작성할 때도 동일하게 적용된다.

## 별도 문서 — 기술스택 구현판 SRS

`같이보기-srs-nextjs-v1_0.md`는 위 "SRS 작업 목표"의 결과물(`같이보기-srs-v1_0.md`)과 **완전히 별개의 문서**다. 기존 SRS는 마이크로서비스 전제의 기술 중립적 서술이고, 이 문서는 Next.js(App Router) 단일 모놀리스 + Server Actions/Route Handlers + Prisma/Supabase + Tailwind/shadcn-ui + Vercel AI SDK(Gemini) + Vercel 배포라는 **확정된 기술스택**을 그대로 적용했을 때 구현 가능한 형태로 아키텍처·인터페이스·데이터 설계를 다시 쓴 것이다. 기능 요구사항(FR-01~25)은 두 문서에서 동일하며, 이 문서는 변경하지 않는다.

## 문서 흐름

```
PRD (같이보기-prd-v1_0.md)
        │  위 "SRS 작업 목표" 원칙에 따라 변환
        ▼
SRS (같이보기-srs-v1_0.md) — §1~7 템플릿 포맷 그대로 + §8~14 표준 기반 확장
        │  SRS 각 장의 요구사항을 다이어그램으로 재표현(새 요구사항 없음)
        ▼
기술 설계 문서 (같이보기-technical-design-v1_0.md) — UseCase / ERD / Component / Sequence / CLD / Flow Chart
        │
        ▼
각 문서의 HTML 렌더링본 (다이어그램 포함, PC 로컬 뷰어용 — 이 저장소에는 없음)
```

## 폴더 구성

| 경로 | 내용 |
| --- | --- |
| `SRS_project/같이보기-prd-v1_0.md` | PRD v1.0 (마크다운 원본, 저장소에 커밋) |
| `SRS_project/같이보기-srs-v1_0.md` | PRD 기반 SRS 문서 (마크다운 원본, 저장소에 커밋) |
| `SRS_project/같이보기-technical-design-v1_0.md` | SRS 기반 기술 설계 문서 — UseCase·ERD·Component·Sequence·CLD·Flow Chart 다이어그램 모음 (마크다운 원본, 저장소에 커밋). 각 다이어그램은 SRS 해당 장에도 동일하게 삽입되어 있다 |
| `SRS_project/같이보기-srs-nextjs-v1_0.md` | 별도의 기술스택 구현판 SRS — Next.js 단일 모놀리스 + Prisma/Supabase + Vercel + Gemini 전제(마크다운 원본, 저장소에 커밋). 기존 SRS와 기능 요구사항은 동일, 아키텍처·인터페이스·데이터 설계만 재작성 |
| `SRS_project/같이보기-srs-nextjs-기술스택변경-plan-v1_0.md` | 위 문서의 C-TEC 제약 문구 갱신(로컬 Supabase CLI 확정, LLM 오케스트레이션 선택적 유지) 작업 계획 및 MVP 핵심 사용자 경험 훼손 여부 검토 기록 |
| `SRS_project/MVP-개발목표-적절성-종합-검토(난이도-가능성-효율성)-보고서.md` | Next.js 기술스택판 SRS를 개발 난이도·구현 가능성(요구 배경지식·적합 직무·바이브코딩 여부)과 시스템·비용 효율성(개발 속도·외부연동 리스크·운영 비용) 두 관점에서 검토한 읽기 전용 보고서 |
| `SRS_project/SRS_V0_9.md` | 위 검토 보고서의 통합 권고(6개 중 SRS 범위인 5개)를 실제로 반영한 `같이보기-srs-nextjs-v1_0.md`의 개정 초안. 네이버 API 목업 스위치, 릴리스 1-A/1-B 재분할(§11 신규), 임시 인증, 유료 전환 트리거, 포터빌리티 트레이드오프 ADR을 추가했다. 팀 승인 전이라 버전을 0.9로 표기 |
| `SRS_project/SRS_V0_9-AI-작업지시서.md` | SRS_V0_9.md → SRS_V1_0.md로 개정하기 위해 AI(Claude)에게 내리는 실행 명령서 — 사람이 읽는 보고서가 아니라 작업 단위(TASK-A1~C1)별 정확한 삽입/교체 텍스트와 완료 기준을 담은 지시 문서. 개인 구현 난이도 조정과 완전 무료 인프라 vs SLA/동시접속자 NFR 모순 해소 두 축을 다룬다 |
| `SRS_project/SRS_V0_9-작업지시서-변경사항-3관점-검토.md` | 위 작업지시서의 TASK-A1~C1을 기술스택 명확성·MVP 목표 및 가치전달 조정·기타 차이점 세 관점으로 검토한 표. A4(0단계 승인)와 B4(동시접속자 정원 제한)가 실제로 기능·가치 범위를 건드리는 유일한 두 항목임을 짚었다 |
| `.github/ISSUE_TEMPLATE/feature_task.md` | GitHub Project(이슈 트래커) 용 TASK 템플릿 — FR 단위 개발 태스크를 Summary · References · Task Breakdown · Acceptance Criteria(GWT) · Constraints · DoD · Dependencies 형식으로 발행하기 위한 GitHub 표준 이슈 템플릿 |
| `SRS_project/GitHub-TASK-작성순서-로드맵.md` | 위 템플릿으로 풀버전 TASK 문서를 뽑아낼 순서(TASK-000~020) — 판정 엔진을 사용자 흐름보다 먼저 시드 데이터로 검증하고, 1-A(핵심 검증) 완료 후 1-B로 넘어가도록 모듈 의존관계 기반으로 설계했다 |
| `SRS_project/tasks/` | 위 로드맵 순서대로 작성한 21개 풀버전 TASK 문서(TASK-000~020, v1) — `.github/ISSUE_TEMPLATE/feature_task.md` 형식. 이력 보존용, 실제 착수는 아래 v2 사용 |
| `SRS_project/tasks/TASK-재추출-전략-v2-계획서.md` | v1을 "① 계약(DTO/스키마) 우선 ② Read/Write Closed Context 분리 ③ AC→자동화 테스트 Task 변환" 3원칙으로 재구성하는 계획서 |
| `SRS_project/tasks/v2/` | 위 3원칙을 반영해 재작성한 **TASK 문서 세트(실제 구현 착수 시 우선 사용 대상)** — 2026-08-26 개수 축약(`TASK-개수-축약-분석.md`)을 거쳐 66개→**52개**(확정 48 + Macro NFR 4)로 정리됨. 폴더 내 `README.md`가 Phase별 실행 순서·의존관계 인덱스, `TASK-마스터-리스트.md`가 Epic·복잡도(H/M/L) 포함 스프레드시트용 단일 표 |
| `SRS_project/tasks/v2/[총괄] 개발 실행 계획.md` | 마스터 리스트 52개 Task의 의존관계를 계산한 총괄 실행 계획(기본안·2레인·66일) — DAG 레벨·임계경로(42영업일)·병목 Top 10·자원제약 스케줄·Gantt 차트·게이트(G0~G3)·리스크를 담았다. `tools/gen_exec_plan.py`가 계산기이자 재생성 스크립트 |
| `SRS_project/tasks/v2/[총괄] 압축 수행 일정.md` | 위 기본 계획의 압축 대안 — 4레인으로 임계경로 하한(42일)에 정확히 도달함을 1~8레인 전수 계산으로 확인하고, 주차별 동시작업 프로파일·레인 투입/철수 곡선·압축의 대가(리뷰 병목·온보딩 비용 등)·42일보다 더 줄이는 방법을 정리했다 |
| `SRS_project/tasks/v2/[태스크 리스트] 같이보기.md` | `TASK-마스터-리스트.md`와 동일한 52건을 Epic별 상세 표(유형·후행 태스크 포함)로 재구성하고, 임계경로·Phase 배치·요구사항 커버리지(35종 중 34종)·의도적 제외 항목(부록 D)까지 담은 종합 인덱스 |
| `SRS_project/같이보기-prd-v1_0.html`, `같이보기-srs-v1_0.html`, `같이보기-technical-design-v1_0.html`, `같이보기-srs-nextjs-v1_0.html`, `SRS_V0_9.html` | 다이어그램 포함 HTML 렌더링본 — **PC 로컬에만 저장, 저장소에는 푸시하지 않음**(`.gitignore`) |
| `SRS_project/[SRS 문서] AD-Core-Platform (한글).md` | SRS 포맷·범위 기준이 되는 예시 템플릿 (참고자료) |

PRD·SRS 이전 단계의 리서치 로그, 발표 덱, 프로토타입 등은 팀 작업 폴더에만 보관하며 이 저장소에는 포함하지 않는다. `SRS_project/29148-2018-ISOIECIEEE.pdf`(ISO/IEC/IEEE 29148:2018 표준 원문)도 저작권 문제로 이 저장소에는 커밋하지 않고 로컬에만 둔다.

## 표준

- SRS 표준 골격: ISO/IEC/IEEE 29148:2018 (예시 템플릿 포맷을 그대로 따르는 범위 내에서 참조, §8~12는 Clause 9.6을 직접 인용)
