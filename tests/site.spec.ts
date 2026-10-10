import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

test("page has measured typography, healthy resources, and dual-viewport screenshots", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const failed: string[] = [];
  page.on("response", response => { if (response.status() >= 400 && new URL(response.url()).host === "127.0.0.1:3010") failed.push(response.url()); });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toHaveText("AI that movesbusinessforward.");
  const typography = await page.locator("h1").evaluate(element => { const styles = getComputedStyle(element); return { size: styles.fontSize, weight: styles.fontWeight, line: styles.lineHeight, font: styles.fontFamily }; });
  expect(typography.size).toBe(testInfo.project.name === "desktop" ? "100px" : "33px");
  expect(typography.weight).toBe("800");
  expect(typography.font.toLowerCase()).toContain("opensans");
  await page.screenshot({ path: `inspection/local/${testInfo.project.name}-fold.png`, animations: "disabled" });
  await page.screenshot({ path: `inspection/local/${testInfo.project.name}-full.png`, fullPage: true, animations: "disabled" });
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the page and drawer pass WCAG AA checks", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  await testInfo.attach("accessibility", { body: JSON.stringify(result.violations, null, 2), contentType: "application/json" });
  expect(result.violations).toEqual([]);
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("navigation traps focus, locks scrolling, closes with Escape and restores focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  for (let i = 0; i < 9; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await page.getByRole("dialog").getByRole("link", { name: "Solutions", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/#solutions$/);
});

test("carousel, service disclosure, pause controls, and keyboard focus work", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next principle" }).click();
  await expect(page.locator(".principle-author")).toContainText("Built around people");
  await page.getByRole("button", { name: "Previous principle" }).click();
  await expect(page.locator(".principle-author")).toContainText("Purpose before technology");
  if (testInfo.project.name === "mobile") {
    const carousel = page.locator(".approach-carousel");
    await carousel.scrollIntoViewIfNeeded();
    const bounds = await carousel.boundingBox();
    expect(bounds).not.toBeNull();
    if (bounds) {
      const session = await page.context().newCDPSession(page);
      const y = bounds.y + 60;
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: bounds.x + 250, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: bounds.x + 100, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await session.detach();
      await expect(page.locator(".principle-author")).toContainText("Built around people");
    }
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.locator(".mobile-contact")).not.toBeVisible();
  }
  const summary = page.locator("#automation summary");
  await summary.click();
  await expect(page.getByText("AI agents with human approval", { exact: true })).toBeVisible();
  await summary.press("Enter");
  await expect(page.locator("#automation details")).not.toHaveAttribute("open", "");
  const pause = page.getByRole("button", { name: "Pause technology animation" });
  await pause.click();
  await expect(page.getByRole("button", { name: "Resume technology animation" })).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".ticker--technology .ticker-track").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content", { exact: true })).toBeFocused();
  expect(await page.getByText("Skip to content", { exact: true }).evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
});

test("a failed submission preserves details and can be retried", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const address = `retry-${Date.now()}@noventra.example`;
  const message = "Retry verification with a preserved message.";
  await page.getByLabel("Work email").fill(address);
  await page.getByLabel("What would you like to move forward?").fill(message);
  await page.getByRole("checkbox").check();
  await page.route("**/api/enquiries", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Unable to save right now. Please try again." }) }), { times: 1 });
  const submit = page.locator(".contact-form").getByRole("button", { name: "Let’s talk" });
  await submit.click();
  await expect(page.locator(".contact-form").getByRole("alert")).toContainText("Unable to save right now");
  await expect(page.getByLabel("Work email")).toHaveValue(address);
  await expect(page.getByLabel("What would you like to move forward?")).toHaveValue(message);
  await page.locator(".contact-form").getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Your enquiry is saved.", { exact: true })).toBeVisible();
  expect(await readFile(".data/verification/enquiries.jsonl", "utf8")).toContain(address);
});

test("lead validation and real persistence return a reference", async ({ page }, testInfo) => {
  await page.goto("/");
  const email = page.getByLabel("Work email");
  await email.fill("bad-email");
  await email.blur();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  const address = `verification-${testInfo.project.name}-${Date.now()}@noventra.example`;
  await email.fill(address);
  await page.getByLabel("What would you like to move forward?").fill("Automate a sample approval workflow. Automated verification only.");
  await page.getByRole("checkbox").check();
  await page.locator(".contact-form").getByRole("button", { name: "Let’s talk" }).click();
  await expect(page.getByText("Your enquiry is saved.", { exact: true })).toBeVisible();
  const reference = await page.locator(".form-success strong").innerText();
  expect(reference).toMatch(/^NV-[A-F0-9]{8}$/);
  const records = await readFile(".data/verification/enquiries.jsonl", "utf8");
  expect(records).toContain(address);
  expect(records).toContain(reference);
});

test("server rejects invalid, cross-origin and oversized submissions; deduplicates a retry", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  const headers = { "Idempotency-Key": randomUUID(), Origin: "http://127.0.0.1:3010" };
  const invalid = await request.post("/api/enquiries", { headers, data: { email: "wrong", message: "", consent: true } });
  expect(invalid.status()).toBe(400);
  const crossOrigin = await request.post("/api/enquiries", { headers: { ...headers, Origin: "https://example.com" }, data: {} });
  expect(crossOrigin.status()).toBe(403);
  const oversized = await request.post("/api/enquiries", { headers, data: { message: "x".repeat(17000) } });
  expect(oversized.status()).toBe(413);
  const data = { email: `dedup-${Date.now()}@noventra.example`, message: "Idempotency verification", consent: true, website: "" };
  const first = await request.post("/api/enquiries", { headers, data });
  expect(first.status()).toBe(201);
  const second = await request.post("/api/enquiries", { headers, data });
  expect(second.status()).toBe(200);
  expect(await second.json()).toEqual(await first.json());
});

test("reduced motion disables continuous animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator(".ticker-track").first().evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await expect(page.getByRole("button", { name: "Pause technology animation" })).not.toBeVisible();
  await expect(page.locator(".counter").first()).toHaveText("01");
});

test("all internal destinations resolve, including resource and legal pages", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const targets = await page.locator("a[href]").evaluateAll(anchors => [...new Set(anchors.map(anchor => anchor.getAttribute("href") || ""))]);
  for (const target of targets) {
    if (target.startsWith("#") || target.startsWith("/#")) expect(await page.locator(target.slice(target.indexOf("#"))).count()).toBe(1);
    else if (target.startsWith("/")) expect((await request.get(target)).status()).toBe(200);
  }
  for (const route of ["/privacy", "/terms", "/resources/ai-readiness"]) {
    await page.goto(route);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("additional viewport widths have no horizontal scroll or wrapping button labels", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  for (const width of [320, 414, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`).toBe(true);
    const bad = await page.locator(".button, .desktop-nav a, .back-top").evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().width > 0 && getComputedStyle(element).whiteSpace !== "nowrap").map(element => element.textContent));
    expect(bad).toEqual([]);
    await page.screenshot({ path: `inspection/local/width-${width}.png`, animations: "disabled" });
  }
});
