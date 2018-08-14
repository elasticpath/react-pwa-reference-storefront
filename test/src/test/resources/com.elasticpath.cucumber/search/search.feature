@smoketest @search
Feature: Search

  Scenario Outline: Keyword search
    When I search for keyword <keyword>
    Then I can see my search results for keyword <keyword>

    Examples:
      | keyword |
      | hat     |

  Scenario Outline: Invalid keyword search
    When I search for keyword <keyword>
    Then no search results return for keyword <keyword>

    Examples:
      | keyword |
      | abc     |
