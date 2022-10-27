import { Page } from "@playwright/test";
import { UPDATE_PROFILE_API } from "../constants/urls";

export const mockProfileApi = async (page: Page) => {
  await page.route(UPDATE_PROFILE_API, async (route) => {
    console.log("Triggered mocked api call...");
    route.fulfill({
      status: 200,
    });
  });
};
