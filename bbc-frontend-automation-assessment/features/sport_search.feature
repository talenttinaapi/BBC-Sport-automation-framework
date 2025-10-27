Feature: Search functionality validation

  As an editor
  I want the search functionality to return at least 4 relevant results when searching for "Sport in 2023"
  So that users can access diverse and informative content

  Scenario: Verify search results for "Sport in 2023"
    Given I navigate to the BBC Sport homepage
    When I search for "Sport in 2023"
    Then I should see at least 4 relevant results
