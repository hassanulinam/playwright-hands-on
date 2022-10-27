import { expect, test } from "@playwright/test";
import { PROFILE_URL, LOGIN_VERIFY_URL } from "../constants/domains";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      "https://ib-user-accounts-backend-beta.apigateway.in/api/ib_user_accounts/user/update/profile/v1/",
      async (route) => {
        console.log("Triggered mocked api call...");
        route.fulfill({
          status: 200,
        });
      }
    );

    await page.goto(PROFILE_URL);

    await expect(page.getByRole("button")).toBeDisabled();
    await page.getByRole("textbox").fill("8688454840");
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
  });

  test("Fill the form to check if the values are udpated", async ({ page }) => {
    await expect(page).toHaveURL(PROFILE_URL);

    await expect(page.getByRole("button", { name: "Update" })).toBeDisabled();

    await page
      .getByRole("textbox", { name: "First Name" })
      .fill("Inamul Hassan");
    await page.getByRole("textbox", { name: "Last Name" }).fill("SHAIK");
    await page.getByRole("textbox", { name: "Email" }).fill("hassan@gmail.com");
    await expect(
      page.getByRole("textbox", { name: "Mobile Number" })
    ).toHaveValue("8688454840");

    // select DOB
    // await page.getByPlaceholder("dd/MM/yyyy").click();
    // await page.locator('span:has-text("2000")').click();
    // await page.getByText("2000").click();
    // await page.locator('span:has-text("October")').click();
    // await page.getByText("August").click();
    // await page
    //   .getByRole("button", { name: "Choose Wednesday, August 9th, 2000" })
    //   .click();

    // await page.getByRole("textbox", { name: "Current City" }).fill("Hyderabad");
    // await page.getByRole("textbox", { name: "Pincode" }).fill("500032");

    // await page.getByRole("button", { name: "Update" }).click();

    const dropDownSelectors = await page.locator(".Select__control");
    // await expect(dropDowns).toHaveLength(4);

    const dropDownEls = await dropDownSelectors.elementHandles();
    // console.log(els[0]);

    //Gender
    dropDownEls[0].click();
    const prevGender = await dropDownEls[0].textContent();
    const newGender = (prevGender === "Male" ? "Female" : "Male") || "Female";
    await page.getByText(newGender).click();

    // const val = await dropDownEls[0].inputValue();
    const genderSel = await page.locator(".Select__control").nth(0);
    await expect(genderSel).toHaveText("Female");

    const occupationSel = await page.locator(".Select__control").nth(1);
    await expect(occupationSel).toHaveText("Graduated");

    const currStateSel = await page.locator(".Select__control").nth(2);
    await expect(currStateSel).toHaveText("Andhra Pradesh");

    const districtSel = await page.locator(".Select__control").nth(3);
    await expect(districtSel).toHaveText("Krishna");
  });
});
