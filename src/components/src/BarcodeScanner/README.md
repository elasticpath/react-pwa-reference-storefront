# BarcodeScanner

#### Description

Displays a modal window with a barcode scanner. To use the scanner, the device camera must be enabled.

When a shopper holds a barcode in front of the camera, the component attempts to read the barcode. On a successful read, the component retrieves data about the item.

#### Usage

```js
import { BarcodeScanner } from '@elasticpath/store-components';
```

#### Example

```js
<BarcodeScanner isModalOpen={isBarcodeScannerOpen} handleModalClose={this.handleBarcodeModalClose} handleCodeFound={this.handleBarcodeScanned} />
```

#### Properties

<!-- PROPS -->
