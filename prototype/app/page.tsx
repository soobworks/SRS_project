import { redirect } from "next/navigation";
import { DEMO_SPACE_ID } from "@/lib/dev/demo-ids";

/** 프로토타입 진입점 — 후보 선택 화면(A-01)으로 보낸다. */
export default function Home() {
  redirect(`/spaces/${DEMO_SPACE_ID}?state=A-01`);
}
