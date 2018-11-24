@smoketest @cart
Feature: Shopping Cart

  Scenario Outline: Change cart line item quantity
    When I select category <category>
    And I select product <product>

    Examples:
      | category | product                 | quantity | unit_price |
      | Mens     | Men's Soft Shell Jacket | 1        | $159.00    |

