import { expect, test, type Locator, type Page } from "@playwright/test";

const seededClient = {
  email: "client.e2e@wakeelhub.test",
  password: "WakeelHub123!",
};

async function chooseRadixOption(page: Page, trigger: Locator, optionName: RegExp) {
  await trigger.click({ noWaitAfter: true });
  await page.getByRole("option", { name: optionName }).click({ noWaitAfter: true });
}

async function loginAsSeededClient(page: Page) {
  await page.goto("/login", { waitUntil: "commit" });
  await page.getByPlaceholder("you@example.com").fill(seededClient.email);
  await page.getByPlaceholder("Enter your password").fill(seededClient.password);
  await page.locator("form").getByRole("button", { name: /^Log in$/ }).click();
  await expect(page, "Seeded client login failed. Run `supabase db reset` so supabase/seed.sql creates the E2E users.").toHaveURL(/\/dashboard\/client/);
}

test("client registration entrypoint plus seeded book-and-pay smoke", async ({ page }) => {
  await page.goto("/register/client", { waitUntil: "commit" });
  await expect(page.getByPlaceholder("Your full name")).toBeVisible();
  await expect(page.getByRole("button", { name: /Create client account/i })).toBeVisible();
  await expect(page.getByText("Select city")).toBeVisible();

  await loginAsSeededClient(page);

  await page.goto("/lawyers/ayesha-e2e-advocate", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: /Ayesha E2E Advocate/i })).toBeVisible();

  await page.getByRole("button", { name: /Book Consultation/i }).click();
  const bookingDialog = page.getByRole("dialog", { name: /Book a consultation/i });
  await expect(bookingDialog).toBeVisible();

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  await page.getByLabel("Preferred date").fill(tomorrow);
  await page.getByLabel("Preferred time").fill("11:30");
  await page.getByLabel("Briefly describe your matter").fill("E2E smoke test booking for sandbox payment.");
  await page.getByRole("button", { name: /Send consultation request/i }).click();
  await expect(page.getByText(/Consultation request sent/i)).toBeVisible();

  await page.goto("/dashboard/client/bookings", { waitUntil: "commit" });
  await expect(page.getByText("Ayesha E2E Advocate").first()).toBeVisible();

  await page.getByRole("button", { name: /^Pay Rs\./ }).first().click();
  const paymentDialog = page.getByRole("dialog", { name: /Pay for consultation/i });
  await expect(paymentDialog).toBeVisible();
  await paymentDialog.getByRole("button", { name: /^Pay Rs\./ }).click();

  await expect(page).toHaveURL(/\/dashboard\/client\/payments\/.+\/invoice/);
  await expect(page.getByText("RECEIPT")).toBeVisible();
  await expect(page.getByText("Ayesha E2E Advocate")).toBeVisible();
  await expect(page.getByText("paid")).toBeVisible();
});
