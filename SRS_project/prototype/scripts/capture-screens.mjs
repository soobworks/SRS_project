/**
 * 화면 캡처 — 프로토타입 전용, 폐기 예정
 *
 * `/goal` §6의 32개 상태를 `reports/prototype-screens/<파일명>__<RUN_TS>.png` 로 저장한다.
 * 실행 전 디렉터리를 비운다 — 이전 실행분이 남으면 32장 검증이 깨진다.
 *
 * 폼팩터는 PRD 화면 ID 접두사가 정한다(명세 §2.1): `A-*` 1280px · `B-*` 390px.
 * 모바일은 뷰포트 420px로 잡아 390px 프레임이 잘리지 않게 한다.
 */
import { chromium } from "playwright";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(process.cwd(), "reports", "prototype-screens");

const ts = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
};
const RUN_TS = ts();

const S = "/spaces/demo";
const SHOTS = [
  ["A-01", `${S}?state=A-01`],
  ["A-02", `${S}?state=A-02`],
  ["A-02a", `${S}?state=A-02a`],
  ["A-02c", `${S}?state=A-02c`],
  ["A-03", `${S}/conditions?state=A-03`],
  ["A-03d", `${S}/conditions?state=A-03d`],
  ["A-04", `${S}/conditions?state=A-04`],
  ["A-04__form-empty", `${S}/conditions?state=A-04&form=empty`],
  ["A-04a", `${S}/conditions?state=A-04a`],
  ["A-05", `${S}/conditions?state=A-05`],
  ["B-03", `${S}/conditions?state=B-03`],
  ["B-04", `${S}/conditions?state=B-04`],
  ["A-12", `${S}/judgments?state=A-12`],
  ["A-13", `${S}/judgments?state=A-13`],
  ["A-13__set-one-commute", `${S}/judgments?state=A-13&set=one-commute`],
  ["A-13__set-no-commute", `${S}/judgments?state=A-13&set=no-commute`],
  ["A-13b", `${S}/judgments?state=A-13b`],
  ["A-13b-2", `${S}/judgments?state=A-13b-2`],
  ["A-13c", `${S}/judgments?state=A-13c`],
  ["B-05", `${S}/judgments?state=B-05`],
  ["A-14a", `${S}/listings/L-004?state=A-14a`],
  ["A-14b", `${S}/listings/L-001?state=A-14b`],
  ["A-14c", `${S}/listings/L-002?state=A-14c`],
  ["A-14d", `${S}/listings/L-005?state=A-14d`],
  ["A-14e", `${S}/listings/L-001?state=A-14e`],
  ["A-15", `${S}/listings/L-005?state=A-15`],
  ["A-16__match-2", `${S}/visit-selection?state=A-16&match=2`],
  ["A-16e", `${S}/visit-selection?state=A-16e`],
  ["A-16__match-0", `${S}/visit-selection?state=A-16&match=0`],
  ["A-16__match-split", `${S}/visit-selection?state=A-16&match=split`],
  ["B-01", `/invite/DEMOCODE?state=B-01`],
  ["B-01__invite-expired", `/invite/DEMOCODE?state=B-01&invite=expired`],
  ["B-02", `/invite/DEMOCODE?state=B-02`],
  ["S-02", `${S}/judgments?state=S-02`],
  ["S-03", `${S}/judgments?state=S-03`],
];

const isMobile = (name) => name.startsWith("B-");

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: "chromium" });
const errors = [];
let ok = 0;

for (const [name, path] of SHOTS) {
  const ctx = await browser.newContext({
    viewport: isMobile(name) ? { width: 420, height: 900 } : { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    locale: "ko-KR",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${name} [console] ${m.text()}`);
  });
  const res = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
  if (!res || res.status() >= 400) errors.push(`${name}: HTTP ${res?.status()}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `${name}__${RUN_TS}.png`), fullPage: true });
  await ctx.close();
  ok += 1;
  process.stdout.write(`${ok.toString().padStart(2)} ${name}\n`);
}

await browser.close();
console.log(`\nRUN_TS=${RUN_TS}  saved=${ok}/${SHOTS.length}`);
if (errors.length) {
  console.log("\n--- 페이지 오류 ---");
  for (const e of errors) console.log(e);
  process.exitCode = 1;
}
