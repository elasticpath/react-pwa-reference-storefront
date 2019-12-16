# RegistrationFormMain

#### Description

Displays a registration form for creating a new account. When the shopper fills in the required fields correctly and selects **Submit**, the component calls the registration process.

<!-- Jen asks: What should happen when the required fields are empty or incorrect? Just a spinning wheel. Does this component have field-level validation messages? -->

#### Usage

```js
import { RegistrationFormMain } from '@elasticpath/store-components';
```

#### Example

```js
<RegistrationFormMain onRegisterSuccess={handleRegisterSuccess} />
```

#### Properties

<!-- PROPS -->
