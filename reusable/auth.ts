import { LOGIN_VERIFY_URL, PROFILE_URL } from "../constants/urls";
import { expect, Page } from "@playwright/test";
import { PHNO } from "../constants/sampleProfile";

export const login = async (page: Page) => {
  await page.goto(PROFILE_URL);

  await expect(page.getByRole("button")).toBeDisabled();
  await page.getByRole("textbox").fill(PHNO);
  await expect(page.getByRole("button")).not.toBeDisabled();
  await page.getByRole("button").click();

  await expect(page).toHaveURL(LOGIN_VERIFY_URL);

  await page
    .getByRole("textbox", {
      name: "Please enter verification code. Character 1",
    })
    .fill("1");
  await page.getByRole("textbox", { name: "Character 2" }).fill("2");
  await page.getByRole("textbox", { name: "Character 3" }).fill("3");
  await page.getByRole("textbox", { name: "Character 4" }).fill("4");
  await page.getByRole("textbox", { name: "Character 5" }).fill("5");
  await page.getByRole("textbox", { name: "Character 6" }).fill("6");
  await page.getByRole("textbox", { name: "Character 6" }).press("Enter");
};
