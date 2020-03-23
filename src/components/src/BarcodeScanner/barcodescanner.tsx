/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Quagga from 'quagga/dist/quagga.js';
import Modal from 'react-responsive-modal';
import './barcodescanner.less';

interface BarcodeScannerProps {
  /** handle modal close */
  handleModalClose: (...args: any[]) => any,
  /** handle code found */
  handleCodeFound: (...args: any[]) => any,
  /** is modal open */
  isModalOpen: boolean,
}
interface BarcodeScannerState {
  barcodes: any[]
}

class BarcodeScanner extends Component<BarcodeScannerProps, BarcodeScannerState> {
  private scannerContainer: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);

    this.state = {
      barcodes: [],
    };

    this.onDetected = this.onDetected.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.initScanner = this.initScanner.bind(this);
    this.stopScanning = this.stopScanning.bind(this);
    this.scannerContainer = React.createRef();
  }

  componentDidMount(): void {
    this.initScanner();
  }

  componentWillUnmount(): void {
    this.stopScanning();
  }

  static checkAvailability(): boolean {
    return Boolean(navigator && navigator.mediaDevices);
  }

  initScanner() {
    const scannerContainer = this.scannerContainer.current;
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: scannerContainer,
        constraints: {
          width: 480,
          height: 320,
          facingMode: 'environment',
        },
      },
      numOfWorkers: navigator.hardwareConcurrency,
      decoder: {
        readers: ['upc_reader'],
      },

    }, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onProcessed((result) => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
          result.boxes.filter(box => box !== result.box).forEach((box) => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });

    Quagga.onDetected(this.onDetected);
  }

  onModalClose() {
    const { handleModalClose } = this.props;
    this.stopScanning();
    handleModalClose();
  }

  static findMode(arr) {
    const counted = arr.reduce((acc, curr) => {
      if (curr in acc) {
        acc[curr] += 1;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});

    return Object.keys(counted).reduce((a, b) => (counted[a] > counted[b] ? a : b));
  }

  onDetected(result) {
    const { barcodes } = this.state;
    const { handleCodeFound, handleModalClose } = this.props;
    const { code } = result.codeResult;

    if (barcodes.length >= 20) {
      const modeCode = BarcodeScanner.findMode(barcodes);
      handleCodeFound(modeCode);
      handleModalClose();
      this.stopScanning();
    }
    this.setState({ barcodes: [...barcodes, code] });
  }

  stopScanning() {
    Quagga.offDetected(this.onDetected);
    Quagga.stop();
  }

  render() {
    const { isModalOpen } = this.props;

    return (
      <Modal open={isModalOpen} onClose={this.onModalClose} classNames={{ modal: 'login-modal-content' }}>
        <div className="modal-dialog">
          <div className="modal-content" id="simplemodal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('barcode-scanner')}
              </h2>
            </div>
            <div className="viewport-container">
              <div ref={this.scannerContainer} className="viewport" />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BarcodeScanner;
