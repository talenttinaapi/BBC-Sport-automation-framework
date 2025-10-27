Feature: Search functionality validation

  Scenario: Verify search results for "Sport in 2023"
    Given I navigate to the BBC Sport homepage
    When I search for "Sport in 2023"
    Then I should see at least 4 relevant results
