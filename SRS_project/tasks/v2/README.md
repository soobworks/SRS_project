# TASK v2 문서 인덱스 — 계약 우선 · Closed Context · AC 자동화 테스트

이 폴더는 `SRS_project/tasks/TASK-재추출-전략-v2-계획서.md`가 정한 3원칙(계약 우선, Read/Write Closed Context 분리, AC→자동화 테스트 Task 변환)을 반영해 재구성한 태스크 세트다.

**이 v2 세트가 실제 구현 착수 시 우선 사용 대상이다.** 기존 `SRS_project/tasks/TASK-000~020.md`(v1, 21개)는 이력·추적성 보존을 위해 그대로 남겨두며 삭제하지 않는다. v1과 v2는 같은 요구사항(FR-001~025, NF)을 다루므로 동시에 둘 다 작업하지 않는다.

옵션 B(기능 Task당 테스트 companion) 채택 — 총 60개(기능/인프라 36개 + 테스트 companion 24개).

## 실행 순서 및 인덱스

| Phase | ID | Read/Write | 이름 | Depends on | 대응 v1 TASK | Test companion |
| --- | --- | --- | --- | --- | --- | --- |
| 0(계약) | C-000 | — | 프로젝트 기반 설정 | 없음 | TASK-000 | — |
| 0(계약) | C-001 | — | 데이터 계약(DTO) 정의 | C-000 | 신규 | — |
| 0(계약) | C-002 | — | 네이버 API 목업 데이터 | C-000, C-001 | TASK-001 | — |
| 1(인증) | A-001 | Command | 임시 인증 | C-001 | TASK-002 | — |
| 2(판정) | J-001 | Query | 예산 평가기 | C-001, I-001 | TASK-005 | TEST-J-001 |
| 2(판정) | J-002 | Command | 판정 결과 저장 | C-000, J-001 | TASK-005(일부) | — |
| 2(판정) | J-003 | Query | 하한형 평가기 | J-001 | TASK-006(일부) | TEST-J-EXT |
| 2(판정) | J-004 | Query | 유무형 평가기 | J-003 | TASK-006(일부) | TEST-J-EXT |
| 2(판정) | J-005 | Query | 일치형 평가기 | J-004 | TASK-006(일부) | TEST-J-EXT |
| 2(판정) | J-006 | Query | 5분류 상태 분류기 | J-001,003,004,005 | TASK-006(일부) | TEST-J-EXT |
| 2(판정) | J-007 | Query | 후보 그룹화 | J-006 | TASK-006(일부) | TEST-J-EXT |
| 2(판정) | J-008 | Query | 1인 빈 경로 조회 | J-002 | TASK-003 | TEST-J-008 |
| 2(판정) | J-009 | Query | 조건 자동 재적용 | J-007, S-001 | TASK-014(일부) | TEST-J-009 |
| 3(입력) | I-001 | Command | 기본 조건 입력 | A-001, C-001 | TASK-004 | TEST-I-001 |
| 3(입력) | I-002 | Command | 조건 확장·선호·확인항목 | J-003 | TASK-012 | TEST-I-002 |
| 4(공유객체) | S-001 | Command | 후보 구성 | C-002, A-001 | TASK-007 | TEST-S-001 |
| 4(공유객체) | S-002 | Command | 초대 발급 | S-001 | TASK-008(일부) | TEST-S-002 |
| 4(공유객체) | S-003 | Query | B 맥락 조회 | S-002 | TASK-008(일부) | TEST-S-003 |
| 4(공유객체) | S-004 | Command | 비로그인 조건 저장·이관 | A-001, S-002 | TASK-013(일부) | TEST-S-004 |
| 4(공유객체) | S-005 | Command(배치) | 만료 조건 삭제 | S-004 | TASK-013(일부) | TEST-S-005 |
| 5(방문후보) | **V-001** | Command | **2라운드 매칭 — North Star 지점, 1-A 종료, H1/H3 게이트** | J-007, S-003 | TASK-009(일부) | TEST-V-001 |
| 5(방문후보) | V-002 | Query/UI | 균형 비교 렌더링 | C-001 | TASK-009(일부) | TEST-V-002 |
| 5(방문후보) | V-003 | Command | 매물 소진 처리 | J-007, S-001 | TASK-014(일부) | TEST-V-003 |
| 6(완화) | R-001 | Query | 양보 문장 생성 | J-007, V-002 | TASK-010 | TEST-R-001 |
| 6(완화) | R-002 | Query | 완화 미리보기 | J-006, R-001 | TASK-011(일부) | TEST-R-002 |
| 6(완화) | R-003 | Command | 완화 제안 발신·응답 | R-002 | TASK-011(일부) | TEST-R-003 |
| 6(완화) | R-004 | Query | 전부불충족 시뮬레이션 | R-002 | TASK-011(일부) | TEST-R-004 |
| 6(완화) | R-005 | Query | 재탐색 필터 변환 | R-004, C-002 | TASK-011(일부) | TEST-R-005 |
| 7(횡단) | X-001 | Query/UI | 숫자 전제 공개 | J-007, R-001 | TASK-016 | TEST-X-001 |
| 7(횡단) | X-002 | Command | 알림 생성 트리거 | I-001, R-003, V-001, V-003 | TASK-017(일부) | TEST-X-NOTIF |
| 7(횡단) | X-003 | Query | 알림 조회 | X-002 | TASK-017(일부) | TEST-X-NOTIF |
| 7(횡단) | X-004 | Query | 동시접속 상한 체크 ⚠️ | C-000, S-001 | TASK-015 | TEST-X-004 |
| 8(단계2) | F-001 | Query | 중개사 질문 조회 | I-002 | TASK-018(일부) | TEST-F-BROKER |
| 8(단계2) | F-002 | Command | 중개사 답변 기록 | F-001 | TASK-018(일부) | TEST-F-BROKER |
| 8(단계2) | F-003 | Command | 방문 후 기록 저장 | V-001, F-002 | TASK-019 | TEST-F-003 |
| 9(배포) | D-001 | — | 배포·모니터링 | 전체 | TASK-020 | — |

## 착수 전 확인 사항

- **X-004**는 `SRS_V0_9-AI-작업지시서.md`의 TASK-B1·B4·B5(완전 무료 운영 상한, REQ-NF-011, pgbouncer)가 아직 `SRS_V0_9.md` 본문에 병합되지 않은 상태에서 작성됐다. 착수 전 해당 병합 여부를 먼저 확인한다. X-004의 두 시나리오는 원 SRS §9의 AC가 아니라 이 프로젝트가 v1 TASK-015에서 직접 정의한 것이다.
- **V-001 완료 후**에는 다음 태스크(R-001~)로 자동 진행하지 않고 `SRS_V0_9.md` §10.4 H1/H3 게이트 통과 여부를 먼저 확인한다.
- 각 기능 Task의 인수 조건은 companion **TEST-\*** Task로 이전되었다. 기능 Task 본문의 "🧪 Acceptance Criteria" 섹션은 참조 AC ID만 담고 있으며, 전체 Given-When-Then 및 실행 가능한 테스트 스켈레톤은 반드시 companion Task를 열어 확인한다.
- TEST-J-EXT, TEST-X-NOTIF, TEST-F-BROKER 3개는 여러 기능 Task(각각 J-003~007, X-002·003, F-001·002)를 통합 검증하는 companion이다 — 1:1이 아니라 N:1 관계임에 유의.
- 모든 AC는 `같이보기-srs-v1_0.md` §9 원문을 그대로 인용했으며, 임의로 새로 만든 인수 기준은 없다(X-004 제외, 위 참조).
