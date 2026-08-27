import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 한국어 화면이라 한글 자소가 깨지지 않는 본문 폰트를 쓴다.
// shadcn init이 넣은 Geist는 한글 글리프가 없어 폴백으로 떨어지므로 걷어냈다.
// 숫자 정렬은 폰트가 아니라 `.nums` 유틸(globals.css)로 맞춘다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "같이보기 — 프로토타입",
  description:
    "둘이 함께 집을 고를 때 생기는 이견을 총점이 아니라 5분류 판정과 조건 완화 협상으로 조율한다.",
};

// Next가 빌드 시 생성하는 전역 `LayoutProps`에 기대지 않는다 —
// 빌드 전에도 `pnpm typecheck`가 단독으로 통과해야 하기 때문이다.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
