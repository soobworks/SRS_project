---
name: 200-git-commit-push-pr
description: Git Flow를 준수하는 커밋·푸시·Draft PR 자동화 프로세스. 원자적 커밋, Conventional Commit 메시지, 브랜치 정렬을 강제한다. 변경사항을 커밋·푸시하거나 PR을 열 때 사용한다.
---

# Git Flow Commit Process

아래 순서를 따르며, **파괴적 명령(force push, reset --hard 등)은 사용자 확인 없이 실행하지 않는다.**

## 1. 변경사항 검토
```bash
git status
git diff
```
- 변경 내용을 카테고리별로 분류한다(feat / fix / docs / refactor / test / chore).
- 서로 다른 목적의 변경이 섞여 있으면 분리 커밋을 계획한다.

## 2. 브랜치
- 형식: `<type>/<issue-number>-<short-description>`(예: `feat/12-s-002-invite-issuance`) — 이슈 번호를 반드시 넣는다. GitHub Project #1이 이슈 단위로 돈다.
- **한 브랜치 = 한 목적.** 여러 Task·여러 목적이 섞이면 브랜치를 나눈다.
- `main` 직접 커밋 금지.

## 3. 원자적 스테이징
```bash
git add -p
```
- 관련 없는 변경이 섞이지 않도록 hunk 단위로 선택한다.
- 컴파일 불가능한 중간 상태를 커밋하지 않는다.

## 4. Conventional Commit 스타일 메시지
- 형식: `[<category>] <message>`(예: `[feat] add invite issuance flow (S-002)`).
- 본문에는 WHY와 맥락을 적는다(WHAT은 diff가 말해준다).
- 하나의 목적 = 하나의 커밋(atomic commit). 각 커밋이 빌드되는 상태로 남긴다.

## 5. 원격 저장소 푸시
```bash
git ls-remote  # 자격증명 확인
git push -u origin <branch>
```
- 자격증명이 없으면 사용자에게 알리고 멈춘다.

## 6. Draft PR 생성
```bash
gh pr create --draft --base main \
  --title "[<category>] <short title> (<Task ID>)" \
  --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [ ] ...

Closes #<이슈번호>
EOF
)"
```
- Task ID ↔ 이슈 번호 매핑은 GitHub Project #1 또는 `SRS_project/tasks/v2/TASK-마스터-리스트.md`.

## 주의 사항
- `main`으로의 force push는 절대 자동 수행하지 않는다.
- `--no-verify`, `--no-gpg-sign` 등 훅/서명 우회 플래그는 사용자가 명시적으로 요청한 경우에만 사용한다.
- 커밋이 이미 올라간 상태라면 amend 대신 **새 커밋**을 만든다.
- PR을 순차적으로 게이트 통과시키며 머지하려면 스킬 `review-merge`, 의존 결합된 PR 묶음을 먼저 병합하려면 스킬 `merge-review`를 이어서 사용한다.
