@smoketest @profile
Feature: Profile

  Scenario Outline: Navigate Profile
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    When I navigate to the profile page
    Then I can see my purchase history
