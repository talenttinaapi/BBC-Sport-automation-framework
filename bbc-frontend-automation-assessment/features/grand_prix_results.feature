Feature: Validate the 2023 Las Vegas Grand Prix results

  As a BBC editor
  I want to report on the top 3 finishers of the 2023 Las Vegas Grand Prix
  So that readers get a clear and accurate summary of the race results

  Scenario: Verify top 3 finishers are correctly displayed
    Given I navigate to the BBC Sport Formula 1 page
    When I locate the 2023 Las Vegas Grand Prix results table
    Then I should see the top 3 finishers as:
      | Position | Driver          |
      | 1        | Max Verstappen  |
      | 2        | George Russell  |
      | 3        | Sergio Perez    |
