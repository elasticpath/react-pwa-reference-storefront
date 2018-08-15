@smoketest @profile
Feature: Profile

  Scenario: Navigate Profile
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    When I navigate to the profile page
    Then I can see my purchase history

  Scenario: Update Personal Info
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    When I navigate to the profile page
    And I click the edit personal info button
    Then I can update my personal info
    When I update my personal info to the following
      | firstname | john2  |
      | lastname  | smith2 |
    Then My personal info should be updated
      | firstname | john2  |

  Scenario: Create new user with Address and Payment Method
    Given I register a new user with default address and payment method
    When I navigate to the profile page
    Then I can see my addresses
