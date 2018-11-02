@smoketest @wishlist
Feature: Wish List

  Scenario Outline: Remove wishlist item
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    When I add following items to my wishlist
      | productCategory | productSubCategory             | productName |
      | M-Class         | Wheels, Tires, and Tire Covers | <product>   |
    When I remove the wishlist item <product>
    Then Lineitem <product> is no longer in the wishlist

    Examples:
      | product                    |
      | M Class Red Brake Calipers |

  @clearCart
  Scenario Outline: Move wishlist item to cart
    Given I login as following registered shopper
      | username | john@ep.com |
      | password | password    |
    When I add following items to my wishlist
      | productCategory | productSubCategory             | productName |
      | M-Class         | Wheels, Tires, and Tire Covers | <product>   |
    When I move the wishlist item to cart <product>
    Then cart should contain following items
      | <product> |

    Examples:
      | product                    |
      | M Class Red Brake Calipers |
