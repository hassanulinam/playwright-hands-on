import { Page } from "@playwright/test";

export const fillTextbox = async (page: Page, name: string, value: string) => {
  await page.getByRole("textbox", { name }).fill(value);
};
