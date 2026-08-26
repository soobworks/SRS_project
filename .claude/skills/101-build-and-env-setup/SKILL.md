---
name: 101-build-and-env-setup
description: 프로젝트 빌드 프로세스와 환경변수 설정을 점검·문서화한다(pnpm, Next.js, Vercel, 로컬 Supabase CLI 기준). 프로젝트를 처음 세팅하거나 온보딩할 때, 환경변수 누락을 진단할 때 사용한다.
---

# Build & Environment Setup

대상 환경을 확인한다(미지정 시 `dev`로 간주).

## 1. 현재 파일 구조 확인
```bash
tree -L 4 -a -I 'node_modules|.git|.next|.vercel|__pycache__'
```

## 2. 빌드 프로세스 점검
- 패키지 매니저는 **pnpm**을 기본으로 한다(npm/yarn 혼용 lockfile이 있으면 지적한다).
- `package.json`의 `dev`/`build`/`start`/`lint`/`test` 스크립트를 확인한다.

## 3. 로컬 개발 환경
- **로컬 Supabase CLI(Docker)**가 기동 중인지 확인한다(`supabase status`) — C-TEC-003.
- 루트에 `.env.local`이 있는지 확인하고, 없으면 `.env.example` 기반으로 생성 가이드를 제공한다.
- `DATABASE_URL`(풀러 `:6543`, 런타임용)과 `DIRECT_URL`(직결 `:5432`, 마이그레이션용) 두 값이 모두 있는지 확인한다 — 헷갈리면 스킬 `302-data-access-rules`.

## 4. 배포(Vercel) 환경변수
- Vercel 프로젝트 설정의 환경변수 목록을 확인한다.
- `GOOGLE_GENERATIVE_AI_API_KEY`, `AI_MODEL_ID`는 §7 확장(LLM 실제 호출)을 켤 때만 필요하다 — 없어도 핵심 기능(판정·완화)은 결정론적 템플릿으로 동작해야 한다(REQ-NF-009).
- 별도 CI/CD 파이프라인(GitHub Actions 등)을 구성하지 않는다 — Vercel Git 연동 자동배포만 사용한다(REQ-NF-008, C-TEC-007).

## 5. 산출물
- 누락된 환경변수, 설정 불일치를 보고한다.
- 필요하면 `.env.example` 또는 `README.md`의 Setup 섹션을 갱신한다.
