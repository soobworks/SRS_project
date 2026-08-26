# -*- coding: utf-8 -*-
"""
같이보기 v2 태스크 세트 -- DAG/임계경로/Gantt 계산기.
입력: SRS_project/tasks/v2/TASK-마스터-리스트.md 의 의존관계를 그대로 옮겨 적음.
출력: 레벨, 임계경로, 병목, 자원제약 스케줄(Gantt) 좌표.
"""
import json

DUR = {"H": 5, "M": 3, "L": 1}

# (id, epic, name, deps, complexity, track)
# track: 트랙 배정(§1.2) -- 계약/판정/입력공유/방문완화/횡단현장/UI/테스트/배포nfr
TASKS = [
    ("C-000", "계약", "프로젝트 기반 설정", [], "M", "계약"),
    ("C-001", "계약", "데이터 계약(DTO) 정의", ["C-000"], "M", "계약"),
    ("C-002", "계약", "네이버 API 목업 데이터", ["C-000", "C-001"], "L", "계약"),
    ("A-001", "인증", "임시 인증", ["C-001"], "M", "판정"),
    ("J-001", "판정엔진", "예산 평가기 + 판정 결과 저장", ["C-001", "I-001"], "M", "판정"),
    ("J-003", "판정엔진", "확장 조건 평가기 3종", ["J-001"], "H", "판정"),
    ("J-006", "판정엔진", "5분류 상태 분류 및 그룹화", ["J-001", "J-003"], "H", "판정"),
    ("J-008", "판정엔진", "1인 빈 경로 조회", ["J-001"], "L", "판정"),
    ("J-009", "판정엔진", "조건 자동 재적용", ["J-006", "S-001"], "M", "판정"),
    ("I-001", "조건입력", "기본 조건 입력", ["A-001", "C-001"], "M", "입력공유"),
    ("I-002", "조건입력", "조건 확장·선호·확인항목", ["J-003"], "M", "입력공유"),
    ("S-001", "공유객체", "후보 구성", ["C-002", "A-001"], "M", "입력공유"),
    ("S-002", "공유객체", "초대 발급", ["S-001"], "M", "입력공유"),
    ("S-003", "공유객체", "B 맥락 조회", ["S-002"], "L", "입력공유"),
    ("S-004", "공유객체", "임시조건 생애주기", ["A-001", "S-002"], "M", "입력공유"),
    ("V-001", "방문후보", "2라운드 매칭", ["J-006", "S-003"], "H", "방문완화"),
    ("V-002", "방문후보", "균형 비교 렌더링", ["C-001"], "M", "UI"),
    ("V-003", "방문후보", "매물 소진 처리", ["J-006", "S-001"], "M", "방문완화"),
    ("R-001", "조건완화", "양보 문장 생성", ["J-006", "V-002"], "H", "방문완화"),
    ("R-002", "조건완화", "완화 시뮬레이션+재탐색 필터", ["J-006", "R-001", "C-002"], "H", "방문완화"),
    ("R-003", "조건완화", "완화 제안 발신·응답", ["R-002"], "M", "방문완화"),
    ("X-001", "횡단", "숫자 전제 공개(+N-005)", ["J-006", "R-001"], "M", "UI"),
    ("X-002", "횡단", "알림 생성·조회", ["I-001", "R-003", "V-001", "V-003"], "M", "횡단현장"),
    ("X-004", "횡단", "동시접속 상한 체크", ["C-000", "S-001"], "M", "횡단현장"),
    ("F-001", "현장기록", "중개사 질문·답변", ["I-002"], "M", "횡단현장"),
    ("F-003", "현장기록", "방문 후 기록 저장", ["V-001", "F-001"], "L", "횡단현장"),
    ("D-001", "배포", "배포 파이프라인·모니터링", ["C-000"], "M", "배포nfr"),
    # TEST companions
    ("TEST-J-001", "테스트", "예산 평가기+저장 테스트", ["J-001"], "L", "테스트"),
    ("TEST-J-EXT", "테스트", "확장 판정 통합 테스트", ["J-003", "J-006"], "M", "테스트"),
    ("TEST-J-008", "테스트", "1인 빈 경로 테스트", ["J-008"], "L", "테스트"),
    ("TEST-J-009", "테스트", "조건 자동 재적용 테스트", ["J-009"], "L", "테스트"),
    ("TEST-I-001", "테스트", "기본 조건 입력 테스트", ["I-001"], "L", "테스트"),
    ("TEST-I-002", "테스트", "조건 확장 등 테스트", ["I-002"], "L", "테스트"),
    ("TEST-S-001", "테스트", "후보 구성 테스트", ["S-001"], "L", "테스트"),
    ("TEST-S-002", "테스트", "초대 발급 테스트", ["S-002"], "L", "테스트"),
    ("TEST-S-003", "테스트", "B 맥락 조회 테스트", ["S-003"], "L", "테스트"),
    ("TEST-S-004", "테스트", "임시조건 생애주기 테스트", ["S-004"], "M", "테스트"),
    ("TEST-V-001", "테스트", "2라운드 매칭 테스트", ["V-001"], "M", "테스트"),
    ("TEST-V-002", "테스트", "균형 비교 렌더링 테스트", ["V-002"], "L", "테스트"),
    ("TEST-V-003", "테스트", "매물 소진 처리 테스트", ["V-003"], "L", "테스트"),
    ("TEST-R-001", "테스트", "양보 문장 생성 테스트", ["R-001"], "M", "테스트"),
    ("TEST-R-002", "테스트", "완화 시뮬레이션 테스트", ["R-002"], "M", "테스트"),
    ("TEST-R-003", "테스트", "완화 제안 테스트", ["R-003"], "L", "테스트"),
    ("TEST-X-001", "테스트", "숫자 전제 공개 테스트", ["X-001"], "L", "테스트"),
    ("TEST-X-NOTIF", "테스트", "알림 통합 테스트", ["X-002"], "L", "테스트"),
    ("TEST-X-004", "테스트", "동시접속 상한 테스트", ["X-004"], "L", "테스트"),
    ("TEST-F-BROKER", "테스트", "중개사 질문답변 테스트", ["F-001"], "L", "테스트"),
    ("TEST-F-003", "테스트", "방문 후 기록 테스트", ["F-003"], "L", "테스트"),
    # NFR macro
    ("N-001", "NFR", "E2E 응답시간 부하 테스트", ["D-001", "S-003"], "M", "배포nfr"),
    ("N-002", "NFR", "경로 API 캐시 성능 검증", ["R-002", "C-000"], "M", "배포nfr"),
    ("N-003", "NFR", "외부 API 장애 주입 테스트", ["C-002"], "M", "배포nfr"),
    ("N-004", "NFR", "Supabase RLS 접근 제어", ["C-000", "A-001"], "H", "배포nfr"),
]

by_id = {t[0]: t for t in TASKS}
ids = [t[0] for t in TASKS]
deps = {t[0]: t[3] for t in TASKS}
dur = {t[0]: DUR[t[4]] for t in TASKS}
name = {t[0]: t[2] for t in TASKS}
epic = {t[0]: t[1] for t in TASKS}
track = {t[0]: t[5] for t in TASKS}

# sanity: all deps exist
missing = [(t, d) for t in ids for d in deps[t] if d not in by_id]
assert not missing, missing

# topo sort check (no cycles) + level assignment (longest path from roots, in edges)
level = {}


def get_level(t, stack=None):
    if t in level:
        return level[t]
    stack = stack or set()
    assert t not in stack, f"cycle at {t}"
    stack = stack | {t}
    if not deps[t]:
        level[t] = 0
    else:
        level[t] = 1 + max(get_level(d, stack) for d in deps[t])
    return level[t]


for t in ids:
    get_level(t)

max_level = max(level.values())
levels = {L: [t for t in ids if level[t] == L] for L in range(max_level + 1)}

# earliest start/finish (unconstrained resources) -> critical path
earliest_finish = {}
earliest_start = {}


def ef(t):
    if t in earliest_finish:
        return earliest_finish[t]
    es = 0 if not deps[t] else max(ef(d) for d in deps[t])
    earliest_start[t] = es
    earliest_finish[t] = es + dur[t]
    return earliest_finish[t]


for t in ids:
    ef(t)

crit_end_task = max(ids, key=lambda t: earliest_finish[t])
crit_length = earliest_finish[crit_end_task]

# trace critical path backwards
critical_path = []
cur = crit_end_task
while True:
    critical_path.append(cur)
    if not deps[cur]:
        break
    # pick predecessor whose earliest_finish == earliest_start[cur]
    cand = [d for d in deps[cur] if earliest_finish[d] == earliest_start[cur]]
    cur = cand[0]
critical_path.reverse()

# out-degree (direct successors) for bottleneck ranking
successors = {t: [] for t in ids}
for t in ids:
    for d in deps[t]:
        successors[d].append(t)
bottleneck = sorted(ids, key=lambda t: -len(successors[t]))[:10]

# ---- resource-constrained schedule simulation ----
# global lane pool of size N (a small/solo team doing full-stack work across
# tracks with AI-agent assistance, not siloed specialists per track).
crit_set = set(critical_path)
# deterministic tie-break: critical path first, then out-degree desc, then id asc
prio = {t: (0 if t in crit_set else 1, -len(successors[t]), t) for t in ids}


def run_schedule(n_lanes):
    done_time = {}
    lane_free_at = [0] * n_lanes
    scheduled = {}
    not_scheduled = list(ids)  # deterministic order, not a set
    time = 0
    BIGDAY = 400
    while not_scheduled and time < BIGDAY:
        ready = [t for t in not_scheduled if all(d in done_time and done_time[d] <= time for d in deps[t])]
        ready.sort(key=lambda t: prio[t])
        for t in ready:
            li = min(range(n_lanes), key=lambda i: lane_free_at[i])
            if lane_free_at[li] <= time:
                start = time
                finish = start + dur[t]
                scheduled[t] = (start, finish, track[t], li)
                lane_free_at[li] = finish
                done_time[t] = finish
        not_scheduled = [t for t in not_scheduled if t not in scheduled]
        time += 1
    assert not not_scheduled, f"could not schedule ({n_lanes} lanes): {not_scheduled}"
    # sanity: every task must start no earlier than all its deps finish
    for t in ids:
        s = scheduled[t][0]
        for dep in deps[t]:
            assert scheduled[dep][1] <= s, f"ORDER VIOLATION: {t} starts at {s} but dep {dep} finishes at {scheduled[dep][1]}"
    return scheduled


scen = {n: run_schedule(n) for n in (1, 2, 3)}
scheduled = scen[2]  # default scenario used below for detailed printout
makespan = {n: max(f for (_, f, _, _) in scen[n].values()) for n in scen}

# ---- output ----
print("=== SUMMARY ===")
print("total tasks:", len(ids))
print("total person-days:", sum(dur.values()))
print("max level:", max_level)
print("critical path length (unconstrained, business days):", crit_length)
print("critical path:", " -> ".join(critical_path))
for n in (1, 2, 3):
    print(f"resource-constrained makespan ({n} lane(s)):", makespan[n], "business days")
print()
print("=== LEVELS ===")
for L in range(max_level + 1):
    ts = levels[L]
    print(f"L{L} ({len(ts)}):", ", ".join(ts), "| max dur:", max(dur[t] for t in ts))
print()
print("=== BOTTLENECK TOP 10 ===")
for t in bottleneck:
    print(f"{t}: {len(successors[t])} direct successors, dur={dur[t]}, crit={'Y' if t in crit_set else ''}")
print()
print("=== UNCONSTRAINED EARLIEST START/FINISH (business-day offset from day 0) ===")
for t in sorted(ids, key=lambda x: (earliest_start[x], x)):
    print(f"{t:14s} L{level[t]:<2d} es={earliest_start[t]:3d} ef={earliest_finish[t]:3d} dur={dur[t]} deps={','.join(deps[t]) or '-'}")

print()
print("=== SCHEDULE (2-lane scenario, sorted by start) ===")
for t in sorted(ids, key=lambda x: scheduled[x][0]):
    s, f, tr, li = scheduled[t]
    print(f"{t:14s} track={tr:8s} lane={li} start={s:3d} finish={f:3d} dur={dur[t]}")

with open("schedule_out.json", "w", encoding="utf-8") as fp:
    json.dump({
        "levels": {str(k): v for k, v in levels.items()},
        "critical_path": critical_path,
        "crit_length": crit_length,
        "bottleneck": [(t, len(successors[t])) for t in bottleneck],
        "schedule_1lane": {t: scen[1][t] for t in ids},
        "schedule_2lane": {t: scen[2][t] for t in ids},
        "schedule_3lane": {t: scen[3][t] for t in ids},
        "makespan": makespan,
        "total_days": sum(dur.values()),
    }, fp, ensure_ascii=False, indent=2)

# ---- calendar-date rendering (business-day offset -> real date, weekends skipped) ----
# START is the one manual input this script needs: the assumed kickoff date.
# Change it and rerun to shift every date in [총괄] 개발 실행 계획.md §2.4/§3.3/§3.4.
import datetime

START = datetime.date(2026, 8, 31)  # Monday — placeholder kickoff date


def bday_to_date(n):
    d = START
    added = 0
    while added < n:
        d += datetime.timedelta(days=1)
        if d.weekday() < 5:
            added += 1
    return d


print()
print(f"=== 3-LANE SCHEDULE WITH CALENDAR DATES (start={START}) ===")
for lane in (0, 1, 2):
    items = [(t, v) for t, v in scen[3].items() if v[3] == lane]
    items.sort(key=lambda kv: kv[1][0])
    print(f"--- LANE {lane} ---")
    for t, (s, f, tr, li) in items:
        tag = "crit" if t in crit_set else ""
        print(f"{t:14s} {bday_to_date(s)} -> {bday_to_date(f)}  dur={f - s}d {tag} track={tr}")

print()
print("critical path end date:", bday_to_date(crit_length))
for n in (1, 2, 3):
    print(f"{n}-lane scenario end date:", bday_to_date(makespan[n]))
