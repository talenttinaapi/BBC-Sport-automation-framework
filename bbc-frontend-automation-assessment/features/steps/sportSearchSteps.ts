import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utils/logger";

/**
 * Page Object for BBC Search Results page
 * Handles search result elements and validation
 */
export class SearchResultsPage extends BasePage {
  // Locators
  private readonly searchResults: Locator;
  private readonly resultItems: Locator;
  private readonly resultTitles: Locator;
  private readonly resultDescriptions: Locator;
  private readonly noResultsMessage: Locator;
  private readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators - flexible to handle different result structures
    this.searchResults = page
      .locator(
        '[data-testid*="search-results"], .search-results, #search-results, [class*="results"]'
      )
      .first();
    this.resultItems = page.locator(
      'article, .result-item, [class*="search-result"], li[class*="result"]'
    );
    this.resultTitles = page.locator('h2, h3, .result-title, [class*="title"]');
    this.resultDescriptions = page.locator(
      'p, .result-description, [class*="description"], [class*="summary"]'
    );
    this.noResultsMessage = page.locator(
      'text="No results", text="no results found"'
    );
    this.loadingIndicator = page.locator(
      '[class*="loading"], [class*="spinner"]'
    );
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResults(timeout: number = 10000): Promise<void> {
    try {
      logger.info("Waiting for search results to load");

      // Wait for loading indicator to disappear if present
      if (await this.isVisible(this.loadingIndicator, 2000)) {
        await this.waitForHidden(this.loadingIndicator, timeout);
      }

      // Wait for results container or result items
      await this.page.waitForSelector(
        'article, .result-item, [class*="search-result"], li[class*="result"]',
        { state: "visible", timeout }
      );

      // Additional wait for content to stabilize
      await this.wait(2000);

      logger.info("Search results loaded successfully");
    } catch (error) {
      logger.error("Failed to load search results", error);

      // Check if there's a "no results" message
      if (await this.isVisible(this.noResultsMessage, 2000)) {
        throw new Error("No search results found");
      }

      throw new Error(`Search results did not load: ${error}`);
    }
  }

  /**
   * Get count of search results
   */
  async getResultCount(): Promise<number> {
    try {
      // Wait for results to be present
      await this.wait(2000);

      // Try multiple selectors to count results
      const selectors = [
        "article",
        ".result-item",
        '[class*="search-result"]',
        'li[class*="result"]',
        '[data-testid*="result"]',
      ];

      let maxCount = 0;

      for (const selector of selectors) {
        const elements = this.page.locator(selector);
        const count = await elements.count();

        if (count > maxCount) {
          maxCount = count;
          logger.debug(`Found ${count} results using selector: ${selector}`);
        }
      }

      logger.info(`Total search results found: ${maxCount}`);
      return maxCount;
    } catch (error) {
      logger.error("Failed to count search results", error);
      return 0;
    }
  }

  /**
   * Get all search result titles
   */
  async getResultTitles(): Promise<string[]> {
    try {
      // Look for title elements in results
      const titleSelectors = [
        "article h2, article h3",
        ".result-item h2, .result-item h3",
        '[class*="title"]',
        'a[class*="heading"]',
      ];

      let titles: string[] = [];

      for (const selector of titleSelectors) {
        const elements = this.page.locator(selector);
        const count = await elements.count();

        if (count > titles.length) {
          titles = await elements.allTextContents();
          titles = titles.map((t) => t.trim()).filter((t) => t.length > 0);
        }
      }

      logger.info(`Extracted ${titles.length} result titles`);
      return titles;
    } catch (error) {
      logger.error("Failed to extract result titles", error);
      return [];
    }
  }

  /**
   * Get all search result descriptions
   */
  async getResultDescriptions(): Promise<string[]> {
    try {
      const descriptionSelectors = [
        "article p",
        ".result-item p",
        '[class*="description"]',
        '[class*="summary"]',
      ];

      let descriptions: string[] = [];

      for (const selector of descriptionSelectors) {
        const elements = this.page.locator(selector);
        const count = await elements.count();

        if (count > descriptions.length) {
          descriptions = await elements.allTextContents();
          descriptions = descriptions
            .map((d) => d.trim())
            .filter((d) => d.length > 0);
        }
      }

      logger.info(`Extracted ${descriptions.length} result descriptions`);
      return descriptions;
    } catch (error) {
      logger.error("Failed to extract result descriptions", error);
      return [];
    }
  }

  /**
   * Verify minimum number of results
   */
  async verifyMinimumResults(minimumCount: number): Promise<boolean> {
    try {
      const actualCount = await this.getResultCount();

      if (actualCount >= minimumCount) {
        logger.info(
          `✓ Found ${actualCount} results (minimum ${minimumCount} required)`
        );
        return true;
      } else {
        logger.error(
          `✗ Found only ${actualCount} results (minimum ${minimumCount} required)`
        );
        return false;
      }
    } catch (error) {
      logger.error("Failed to verify minimum results", error);
      return false;
    }
  }

  /**
   * Check if results are relevant to search term
   */
  async verifyResultsRelevance(searchTerm: string): Promise<boolean> {
    try {
      logger.info(`Verifying results relevance for: ${searchTerm}`);

      const titles = await this.getResultTitles();
      const descriptions = await this.getResultDescriptions();

      // Extract keywords from search term
      const keywords = searchTerm.toLowerCase().split(" ");
      let relevantCount = 0;

      // Check titles for relevance
      for (const title of titles) {
        const titleLower = title.toLowerCase();
        const hasKeyword = keywords.some((keyword) =>
          titleLower.includes(keyword)
        );

        if (hasKeyword) {
          relevantCount++;
          logger.debug(`Relevant title: ${title}`);
        }
      }

      // Check descriptions for relevance
      for (const description of descriptions) {
        const descLower = description.toLowerCase();
        const hasKeyword = keywords.some((keyword) =>
          descLower.includes(keyword)
        );

        if (hasKeyword) {
          relevantCount++;
        }
      }

      const isRelevant = relevantCount > 0;

      if (isRelevant) {
        logger.info(`✓ Found ${relevantCount} relevant results`);
      } else {
        logger.error("✗ No relevant results found");
      }

      return isRelevant;
    } catch (error) {
      logger.error("Failed to verify results relevance", error);
      return false;
    }
  }

  /**
   * Verify each result has required elements
   */
  async verifyResultStructure(): Promise<boolean> {
    try {
      logger.info("Verifying search result structure");

      const titles = await this.getResultTitles();
      const descriptions = await this.getResultDescriptions();

      const hasTitles = titles.length > 0;
      const hasDescriptions = descriptions.length > 0;

      if (hasTitles && hasDescriptions) {
        logger.info(
          "✓ Results have proper structure (titles and descriptions)"
        );
        return true;
      } else {
        logger.error("✗ Results missing required elements");
        logger.debug(
          `Has titles: ${hasTitles}, Has descriptions: ${hasDescriptions}`
        );
        return false;
      }
    } catch (error) {
      logger.error("Failed to verify result structure", error);
      return false;
    }
  }

  /**
   * Get detailed information about all results
   */
  async getAllResultsDetails(): Promise<
    Array<{ title: string; description: string; hasLink: boolean }>
  > {
    try {
      const results: Array<{
        title: string;
        description: string;
        hasLink: boolean;
      }> = [];
      const resultElements = this.page.locator(
        'article, .result-item, [class*="search-result"]'
      );
      const count = await resultElements.count();

      for (let i = 0; i < count; i++) {
        const result = resultElements.nth(i);
        const title =
          (await this.getText(
            result.locator('h2, h3, [class*="title"]').first()
          )) || "";
        const description =
          (await this.getText(
            result.locator('p, [class*="description"]').first()
          )) || "";
        const link = result.locator("a").first();
        const hasLink = (await link.count()) > 0;

        if (title) {
          results.push({ title, description, hasLink });
        }
      }

      logger.info(`Extracted details for ${results.length} results`);
      return results;
    } catch (error) {
      logger.error("Failed to extract result details", error);
      return [];
    }
  }

  /**
   * Check if specific result exists in the list
   */
  async hasResultContaining(text: string): Promise<boolean> {
    try {
      const element = this.page.locator(`text="${text}"`).first();
      return await this.isVisible(element, 3000);
    } catch {
      return false;
    }
  }

  /**
   * Verify results are displayed in a structured format
   */
  async verifyStructuredFormat(): Promise<boolean> {
    try {
      // Check if results are in a list or grid format
      const isList = await this.isVisible(
        this.page.locator("ul, ol").first(),
        2000
      );
      const isGrid = await this.isVisible(
        this.page.locator('[class*="grid"]').first(),
        2000
      );
      const hasArticles = (await this.page.locator("article").count()) > 0;

      const isStructured = isList || isGrid || hasArticles;

      if (isStructured) {
        logger.info("✓ Results are displayed in a structured format");
      } else {
        logger.error("✗ Results do not appear to be in a structured format");
      }

      return isStructured;
    } catch (error) {
      logger.error("Failed to verify structured format", error);
      return false;
    }
  }
}
