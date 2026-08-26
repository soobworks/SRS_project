---
name: setup-env
description: 프로젝트 빌드 프로세스와 환경변수 설정을 점검·문서화한다(pnpm, Next.js, Vercel, 로컬 Supabase CLI 기준).
when_to_use: Use when setting up the project for the first time, onboarding, or diagnosing missing/misconfigured environment variables and build settings.
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
- Next.js 빌드 캐시(`.next/cache`)가 정상 동작하는지 확인한다.

## 3. 로컬 개발 환경
- **로컬 Supabase CLI(Docker)**가 기동 중인지 확인한다(`supabase status`).
- 루트에 `.env.local`이 있는지 확인하고, 없으면 `.env.example` 기반으로 생성 가이드를 제공한다.
- `DATABASE_URL`(직접 연결)과 `DIRECT_URL`(마이그레이션용, non-pooled) 두 값이 모두 있는지 확인한다.
- 민감 값(API key, DB password 등)이 `.gitignore`에 의해 커밋되지 않는지 확인한다.

## 4. 배포(Vercel) 환경변수
- Vercel 프로젝트 설정의 환경변수 목록을 확인한다.
- `DATABASE_URL`은 **pgbouncer 풀 연결**(포트 6543, `?pgbouncer=true`)을 가리켜야 한다 — 서버리스 콜드스타트로 인한 커넥션 고갈 방지.
- Gemini API 키 등 선택적 확장 키는 없어도 핵심 기능이 동작해야 한다(REQ-NF-009 결정론적 폴백 확인).
- 별도 CI/CD 파이프라인(GitHub Actions 등)을 구성하지 않는다 — Vercel Git 연동 자동배포만 사용(REQ-NF-008).

## 5. 산출물
- 누락된 환경변수, 설정 불일치를 보고한다.
- 필요하면 `.env.example` 또는 `README.md`의 Setup 섹션을 갱신한다.
