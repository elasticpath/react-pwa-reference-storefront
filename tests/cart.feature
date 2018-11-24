@smoketest @cart
Feature: Shopping Cart

  Scenario Outline: Change cart line item quantity
    When I select category <category>
    And I select product <product>
    And I select sku option Color and choose Black
    And I select sku option Size and choose Small
    And I select quantity <quantity> and add product to my cart
    When I update cart lineitem quantity to 2 for product <product>
    Then the expected cart lineitem total price is $319.98 for product <product>

    Examples:
      | category | product                 | quantity | unit_price |
      | Mens     | Men's Soft Shell Jacket | 1        | $159.00    |

  Scenario Outline: Remove cart line item
    When I add following items to my cart
      | productCategory | productSubCategory             | productName |
      | M-Class         | Wheels, Tires, and Tire Covers | <product>   |
    When I remove the cart line item <product>
    Then Lineitem <product> is no longer in the cart

    Examples:
      | product                    |
      | M Class Red Brake Calipers |
