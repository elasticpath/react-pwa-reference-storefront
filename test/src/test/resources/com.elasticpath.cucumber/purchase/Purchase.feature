@smoketest @purchase
Feature: Purchase

  Scenario: Purchase physical item as a new shopper
    When I add following items to my cart
      | productCategory | productSubCategory             | productName                |
      | M-Class         | Wheels, Tires, and Tire Covers | M Class Red Brake Calipers |
    And I complete the purchase as a new registered shopper
    Then the purchase status in my purchase history should be In Progress

  Scenario: Purchase physical item as an anonymous shopper
    When I add following items to my cart
      | productCategory | productSubCategory             | productName                |
      | M-Class         | Wheels, Tires, and Tire Covers | M Class Red Brake Calipers |
    And I complete the purchase as an anonymous shopper
    Then the purchase status should be In Progress

  @clearCart
  Scenario: Purchase physical item as an existing registered shopper
    When I add following items to my cart
      | productCategory | productSubCategory             | productName                |
      | M-Class         | Wheels, Tires, and Tire Covers | M Class Red Brake Calipers |
    And I complete the purchase with following registered shopper
      | username | john@ep.com |
      | password | password    |
    Then the purchase status in my purchase history should be In Progress

  @clearCart
  Scenario: Purchase digital item as an existing shopper
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    When I add following items to my cart
      | productCategory | productSubCategory | productName      |
      | Addons          |                    | 407n Transponder |
    And I complete the purchase
    Then the purchase status in my purchase history should be Completed

  @clearCart
  Scenario: Purchase physical and digital items as existing shopper
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    And I add following items to my cart
      | productCategory | productSubCategory             | productName                |
      | M-Class         | Wheels, Tires, and Tire Covers | M Class Red Brake Calipers |
      | Addons          |                                | 407n Transponder           |
    When I complete the purchase
    Then the purchase status in my purchase history should be In Progress

  @clearCart
  Scenario Outline: Cart merge from anonymous shopper to registered shopper
    Given I add following items to my cart
      | productCategory | productSubCategory             | productName |
      | M-Class         | Wheels, Tires, and Tire Covers | <product-1> |
      | Womens          |                                | <product-2> |
      | X-Class         | Visual                         | <product-3> |
    And cart should contain following items
      | <product-1> |
      | <product-2> |
      | <product-3> |
    When I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    Then cart should contain following items
      | <product-1> |
      | <product-2> |
      | <product-3> |
    When I select category Mens
    And I add product <product-4> to cart
    Then cart should contain following items
      | <product-1> |
      | <product-2> |
      | <product-3> |
      | <product-4> |
    When I complete the purchase
    Then the purchase status in my purchase history should be In Progress

    Examples:
      | product-1                  | product-2      | product-3                        | product-4        |
      | M Class Red Brake Calipers | Structured Hat | Carbon Fiber Center Console Trim | Men's Tech Vest  |

  Scenario: Purchase multi-sku item as a registered shopper
    Given I select category Mens
    And I select product Men's Soft Shell Jacket
    And I select sku option Color and choose Black
    And I select sku option Size and choose Small
    And I select quantity 2 and add product to my cart
    When I complete the purchase as a new registered shopper
    Then the purchase status in my purchase history should be In Progress

#    TODO verify the sku options in purchase receipt
