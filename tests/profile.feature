@smoketest @profile
Feature: Profile

  Scenario: Navigate Profile
    Given I login as following registered shopper
      | username    | password |
      | john@ep.com | password |
    When I navigate to the profile page
    Then I can see my purchase history
