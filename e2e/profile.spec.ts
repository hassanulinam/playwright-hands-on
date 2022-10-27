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
import { login } from "../utils/auth";
import { mockProfileApi } from "../utils/networkApis";
import { fillTextbox } from "../utils/forms";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    // await mockProfileApi(page);
    await login(page);
  });

  test("update button should be disabled when no values are changed", async ({
    page,
  }) => {
    await expect(page).toHaveURL(PROFILE_URL);
    await expect(page.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  test("Fill the form and updated details", async ({ page }) => {
    await expect(page).toHaveURL(PROFILE_URL);

    fillTextbox(page, "First Name", FIRST_NAME);
    fillTextbox(page, "Last Name", LAST_NAME);
    fillTextbox(page, "Email", EMAIL);

    await expect(
      page.getByRole("textbox", { name: "Mobile Number" })
    ).toHaveValue(PHNO);

    // change Gender
    const genderEl = await page.locator(".Select__control").nth(0);
    const prevGender = await genderEl.textContent();
    console.log({ prevGender });

    fillTextbox(page, "Current City", CURRENT_CITY);
    fillTextbox(page, "Pincode", PIN_CODE);

    const updateBtn = await page.getByRole("button", { name: "Update" });
    await expect(updateBtn).not.toBeDisabled();
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
