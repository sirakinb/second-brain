import { test, expect } from "@playwright/test";

test("cron dashboard loads and displays cron jobs", async ({ page }) => {
  const fixture = {
    jobs: [
      {
        id: "job-001",
        name: "Hourly Metrics Rollup",
        description: "Aggregate usage metrics",
        enabled: true,
        deleteAfterRun: false,
        createdAtMs: Date.now() - 86_400_000,
        updatedAtMs: Date.now() - 3_600_000,
        schedule: {
          kind: "cron",
          expr: "0 * * * *",
          tz: "UTC",
        },
        state: {
          nextRunAtMs: Date.now() + 3_600_000,
        },
      },
      {
        id: "job-002",
        name: "One Shot Cleanup",
        description: "Deletes temp artifacts",
        enabled: true,
        deleteAfterRun: true,
        schedule: {
          kind: "once",
          expr: "now",
        },
        state: {
          nextRunAtMs: Date.now() + 600_000,
        },
      },
      {
        id: "job-003",
        name: "Standby Sync",
        description: "Waiting for payload",
        enabled: true,
        deleteAfterRun: false,
        schedule: {
          kind: "cron",
          expr: "15 9 * * 1",
          tz: "America/Los_Angeles",
        },
        state: {},
      },
      {
        id: "job-004",
        name: "Paused Digest",
        description: "Disabled for now",
        enabled: false,
        deleteAfterRun: false,
        schedule: {
          kind: "cron",
          expr: "30 6 * * *",
          tz: "UTC",
        },
        state: {
          nextRunAtMs: Date.now() + 86_400_000,
        },
      },
    ],
  };

  await page.route("**/api/cron", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fixture),
    });
  });

  await page.goto("/cron");

  await expect(
    page.getByRole("heading", { name: "Cron Assembly Line" })
  ).toBeVisible();

  await expect(page.getByText("Line synced")).toBeVisible();

  await expect(page.getByText("Total jobs: 4")).toBeVisible();
  await expect(page.getByText("Enabled: 3")).toBeVisible();
  await expect(page.getByText("Disabled: 1")).toBeVisible();

  await expect(page.getByText("Hourly Metrics Rollup")).toBeVisible();
  await expect(page.getByText("One Shot Cleanup")).toBeVisible();
  await expect(page.getByText("Standby Sync")).toBeVisible();
  await expect(page.getByText("Paused Digest")).toBeVisible();

  await expect(page.getByText("cron · 0 * * * *")).toBeVisible();
  await expect(page.getByText("once · now")).toBeVisible();
  await expect(page.getByText("TZ: America/Los_Angeles")).toBeVisible();
  await expect(page.getByText("TZ: UTC")).toHaveCount(2);
});
