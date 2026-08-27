import Link from "next/link";

/**
 * 중립 셸 — 프로토타입 전용, 폐기 예정 (명세 §3)
 *
 * PRD §17.1 `[확정]`: "제품 형태는 별도 앱이 아니라 네이버 앱/서비스 안의 기능이다."
 * 검수 질문("네이버 안의 기능으로 읽히는가")에 답하는 데 필요한 것은 **경계 표시**지
 * 외형 복제가 아니다.
 *
 * 금지(명세 §3.4): 네이버 로고·CI 색상·상표·실제 UI 마크업을 쓰지 않는다.
 * 여기 있는 것은 회색 바와 텍스트 브레드크럼뿐이다.
 */
export function PrototypeShell({
  children,
  form = "desktop",
  state,
}: {
  children: React.ReactNode;
  /** 명세 §2.1 — `A-*`는 데스크톱 1280px, `B-*`는 모바일 390px. */
  form?: "desktop" | "mobile";
  /** 현재 PRD 화면 ID. 검수 시 어디를 보고 있는지 드러낸다. */
  state?: string;
}) {
  if (form === "mobile") {
    return (
      <div className="flex min-h-screen flex-col items-center bg-canvas py-6">
        <div className="w-[390px] overflow-hidden rounded-xl border border-line-strong bg-surface shadow-sm">
          <header className="flex items-center justify-between border-b border-line bg-shell px-4 py-2.5 text-xs text-shell-ink">
            <span>‹ 같이 고르기</span>
            {state ? <code className="opacity-70">{state}</code> : null}
          </header>
          <div className="min-h-[720px] bg-canvas">{children}</div>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          모바일 390px — B는 카카오톡 링크로 진입한다(PRD §17.1)
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-line bg-shell">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-2.5 text-xs text-shell-ink">
          <span>네이버 부동산 › 같이 고르기</span>
          {state ? <code className="opacity-70">{state}</code> : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}

/**
 * 네이버 본체로 넘어가는 지점(명세 §3.3).
 * 링크를 비활성으로 두지 않고 배지로 표시한다 — 이 제품이 자기 화면만으로
 * 완결되지 않는다는 것 자체가 검수 대상이기 때문이다.
 */
export function ExitBadge({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-line-strong bg-neutral-bg px-3 py-2 text-xs text-ink-muted">
      {children}
    </p>
  );
}

/** 화면 상단 제목 + PRD 화면 ID. */
export function ScreenTitle({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-ink">{title}</h1>
      {sub ? <p className="mt-1 text-sm text-ink-muted">{sub}</p> : null}
    </div>
  );
}

/** 다른 화면으로 이동하는 프로토타입 내비. 검수 동선을 끊기지 않게 한다. */
export function StepNav({
  links,
}: {
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav className="mt-8 flex flex-wrap gap-2 border-t border-line pt-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-ink hover:bg-neutral-bg"
        >
          {l.label} →
        </Link>
      ))}
    </nav>
  );
}
