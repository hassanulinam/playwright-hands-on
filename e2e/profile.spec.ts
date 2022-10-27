import playwright, { expect, test } from "@playwright/test";
import { PROFILE_URL, UPDATE_PROFILE_API } from "../constants/urls";
import {
  CURRENT_CITY,
  CURRENT_DISTRICT,
  CURRENT_STATE,
  EMAIL,
  FIRST_NAME,
  GENDER,
  LAST_NAME,
  OCCUPATION,
  PHNO,
  PIN_CODE,
} from "../constants/sampleProfile";
import { login } from "../reusable/auth";
import { mockProfileApi } from "../reusable/networkApis";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    // await mockProfileApi(page);
    await login(page);
  });

  test.skip("update button should be disabled when no values are not changed", async ({
    page,
  }) => {
    await expect(page).toHaveURL(PROFILE_URL);
    await expect(page.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  test("Fill the form and updated details", async ({ page }) => {
    await expect(page).toHaveURL(PROFILE_URL);

    await page.getByRole("textbox", { name: "First Name" }).fill(FIRST_NAME);
    await page.getByRole("textbox", { name: "Last Name" }).fill(LAST_NAME);
    await page.getByRole("textbox", { name: "Email" }).fill(EMAIL);
    await expect(
      page.getByRole("textbox", { name: "Mobile Number" })
    ).toHaveValue(PHNO);

    // change Gender
    const genderEl = await page.locator(".Select__control").nth(0);
    const prevGender = await genderEl.textContent();
    console.log({ prevGender });

    await page
      .getByRole("textbox", { name: "Current City" })
      .fill(CURRENT_CITY);
    await page.getByRole("textbox", { name: "Pincode" }).fill(PIN_CODE);

    const updateBtn = await page.getByRole("button", { name: "Update" });
    await expect(updateBtn).toBeEnabled();
    await updateBtn.click();

    await page.waitForResponse(UPDATE_PROFILE_API);
  });

  test("Form should have previously updated values", async ({ page }) => {
    await expect(page).toHaveURL(PROFILE_URL);

    const occupationSel = await page.locator(".Select__control").nth(1);
    await expect(occupationSel).toHaveText(OCCUPATION);

    const currStateSel = await page.locator(".Select__control").nth(2);
    await expect(currStateSel).toHaveText(CURRENT_STATE);

    const districtSel = await page.locator(".Select__control").nth(3);
    await expect(districtSel).toHaveText(CURRENT_DISTRICT);

    const cityEl = await page.getByRole("textbox", { name: "Current City" });
    await expect(cityEl).toHaveValue(CURRENT_CITY);

    const pincodeEl = await page.getByRole("textbox", { name: "Pincode" });
    await expect(pincodeEl).toHaveValue(PIN_CODE);
  });
});
