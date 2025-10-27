import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { expect } from "chai";
import { CustomWorld } from "../support/world";
import { SportHomePage } from "../pages/SportHomePage";
import { FormulaOnePage } from "../pages/FormulaOnePage";
import { logger } from "../utils/logger";

/**
 * Step Definitions for Las Vegas Grand Prix Results Validation
 */

Given("I am on the BBC Sport homepage", async function (this: CustomWorld) {
  try {
    logger.info("STEP: Navigating to BBC Sport homepage");

    if (!this.page) {
      throw new Error("Page is not initialized");
    }

    const sportHomePage = new SportHomePage(this.page);
    await sportHomePage.navigateToHomepage();

    // Verify page loaded successfully
    await sportHomePage.verifyPageLoaded();

    logger.info("✓ Successfully navigated to BBC Sport homepage");
  } catch (error) {
    logger.error("Failed to navigate to homepage", error);
    throw error;
  }
});

When("I navigate to the Formula 1 section", async function (this: CustomWorld) {
  try {
    logger.info("STEP: Navigating to Formula 1 section");

    if (!this.page) {
      throw new Error("Page is not initialized");
    }

    const sportHomePage = new SportHomePage(this.page);
    await sportHomePage.navigateToFormula1();

    logger.info("✓ Successfully navigated to Formula 1 section");
  } catch (error) {
    logger.error("Failed to navigate to Formula 1 section", error);
    throw error;
  }
});

When(
  "I locate the 2023 Las Vegas Grand Prix results",
  async function (this: CustomWorld) {
    try {
      logger.info("STEP: Locating 2023 Las Vegas Grand Prix results");

      if (!this.page) {
        throw new Error("Page is not initialized");
      }

      const f1Page = new FormulaOnePage(this.page);
      await f1Page.findLasVegasGPResults();

      // Store page object for later use
      this.setTestData("f1Page", f1Page);

      logger.info("✓ Successfully located Las Vegas GP results");
    } catch (error) {
      logger.error("Failed to locate Las Vegas GP results", error);
      throw error;
    }
  }
);

Then(
  "the race results should display the following podium finishers:",
  async function (this: CustomWorld, dataTable: DataTable) {
    try {
      logger.info("STEP: Verifying podium finishers");

      const f1Page: FormulaOnePage = this.getTestData("f1Page");

      if (!f1Page) {
        throw new Error("Formula 1 page object not found");
      }

      // Get expected results from data table
      const expectedResults = dataTable.hashes();

      logger.info(`Validating ${expectedResults.length} podium positions`);

      // Verify each podium position
      let allCorrect = true;
      const errors: string[] = [];

      for (const expected of expectedResults) {
        const position = parseInt(expected.Position);
        const driver = expected.Driver;

        logger.info(`Verifying Position ${position}: ${driver}`);

        const isCorrect = await f1Page.verifyDriverPosition(position, driver);

        if (!isCorrect) {
          allCorrect = false;
          errors.push(`Position ${position} verification failed for ${driver}`);
        }
      }

      // Assert all positions are correct
      if (!allCorrect) {
        const errorMessage = `Podium verification failed:\n${errors.join(
          "\n"
        )}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      logger.info("✓ All podium positions verified successfully");

      // Store results for additional assertions
      const actualResults = await f1Page.getRaceResults();
      this.setTestData("raceResults", actualResults);
    } catch (error) {
      logger.error("Failed to verify podium finishers", error);

      // Take screenshot for debugging
      if (this.page) {
        await this.takeScreenshot("podium_verification_failed");
      }

      throw error;
    }
  }
);

Then(
  "the results table should be clearly visible",
  async function (this: CustomWorld) {
    try {
      logger.info("STEP: Verifying results table visibility");

      const f1Page: FormulaOnePage = this.getTestData("f1Page");

      if (!f1Page) {
        throw new Error("Formula 1 page object not found");
      }

      const resultsVisible = await f1Page.areResultsVisible();

      expect(resultsVisible).to.be.true;

      logger.info("✓ Results table is clearly visible");
    } catch (error) {
      logger.error("Results table is not visible", error);
      throw error;
    }
  }
);

Then(
  "I should see {string} in the race title",
  async function (this: CustomWorld, expectedText: string) {
    try {
      logger.info(`STEP: Verifying "${expectedText}" in race title`);

      const f1Page: FormulaOnePage = this.getTestData("f1Page");

      if (!f1Page) {
        throw new Error("Formula 1 page object not found");
      }

      const raceTitle = await f1Page.getRaceTitle();
      const titleLower = raceTitle.toLowerCase();
      const expectedLower = expectedText.toLowerCase();

      expect(titleLower).to.include(
        expectedLower,
        `Expected race title to contain "${expectedText}", but got "${raceTitle}"`
      );

      logger.info(`✓ Race title contains "${expectedText}": ${raceTitle}`);
    } catch (error) {
      logger.error("Race title verification failed", error);
      throw error;
    }
  }
);

Then(
  "the winner should be {string}",
  async function (this: CustomWorld, expectedWinner: string) {
    try {
      logger.info(`STEP: Verifying winner is "${expectedWinner}"`);

      const f1Page: FormulaOnePage = this.getTestData("f1Page");

      if (!f1Page) {
        throw new Error("Formula 1 page object not found");
      }

      const isCorrect = await f1Page.verifyDriverPosition(1, expectedWinner);

      expect(isCorrect).to.be.true;

      logger.info(`✓ Winner verified: ${expectedWinner}`);
    } catch (error) {
      logger.error("Winner verification failed", error);
      throw error;
    }
  }
);

Then(
  "the second place finisher should be {string}",
  async function (this: CustomWorld, expectedDriver: string) {
    try {
      logger.info(`STEP: Verifying 2nd place is "${expectedDriver}"`);

      const f1Page: FormulaOnePage = this.getTestData("f1Page");

      if (!f1Page) {
        throw new Error("Formula 1 page object not found");
      }

      const isCorrect = await f1Page.verifyDriverPosition(2, expectedDriver);

      expect(isCorrect).to.be.true;

      logger.info(`✓ 2nd place verified: ${expectedDriver}`);
    } catch (error) {
      logger.error("2nd place verification failed", error);
      throw error;
    }
  }
);

Then(
  "the third place finisher should be {string}",
  async function (this: CustomWorld, expectedDriver: string) {
    try {
      logger.info(`STEP: Verifying 3rd place is "${expectedDriver}"`);

      const f1Page: FormulaOnePage = this.getTestData("f1Page");

      if (!f1Page) {
        throw new Error("Formula 1 page object not found");
      }

      const isCorrect = await f1Page.verifyDriverPosition(3, expectedDriver);

      expect(isCorrect).to.be.true;

      logger.info(`✓ 3rd place verified: ${expectedDriver}`);
    } catch (error) {
      logger.error("3rd place verification failed", error);
      throw error;
    }
  }
);

Then(
  "all podium positions should have valid driver names",
  async function (this: CustomWorld) {
    try {
      logger.info(
        "STEP: Verifying all podium positions have valid driver names"
      );

      const raceResults = this.getTestData("raceResults");

      if (!raceResults || raceResults.length < 3) {
        throw new Error("Insufficient race results data");
      }

      // Check that each podium position has a non-empty driver name
      for (let i = 0; i < 3; i++) {
        const result = raceResults[i];
        const driverName = result.driver;

        expect(driverName).to.not.be.empty;
        expect(driverName.length).to.be.greaterThan(3);

        logger.info(`✓ Position ${i + 1}: ${driverName} is valid`);
      }

      logger.info("✓ All podium positions have valid driver names");
    } catch (error) {
      logger.error("Podium validation failed", error);
      throw error;
    }
  }
);
