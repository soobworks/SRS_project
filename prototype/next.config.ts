import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 표시기가 화면 좌하단을 가려 시각 검수를 방해한다.
  // 이 저장소는 프로토타입 검수가 목적이라 꺼 둔다.
  devIndicators: false,
};

export default nextConfig;
