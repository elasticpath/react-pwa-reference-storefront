/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 *
 */

/*

Basic Usage:
============

$('#el').spin(); // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }); // Creates a Spinner using the provided options.

$('#el').spin(false); // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small'); // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff'); // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines: 9
  length: 10
  width: 20
  radius: 0
}

$('#el').spin('flower', 'red');

Overlay
=======

The plugin has been extended to position an overlay element over the jQuery object on which it is invoked. The default
options call for the overlay to be displayed but these can be overridden e.g.

$('#el').spin({overlay: false});

The overlay functionality uses absolute positioning and assumes that the jQuery object
to which the spinner is being added is itself relatively or absolutely positioned.

*/

(function(factory) {
  'use strict';

  // Check jQuery and spin.js dependencies
  if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'));
  }
  else if (typeof define === 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory);
  }
  else {
    // Browser globals
    if (!window.Spinner) {
      throw new Error('Spin.js not present');
    }
    factory(window.jQuery, window.Spinner);
  }

}(function($, Spinner) {
  'use strict';

  $.fn.spin = function(opts, color) {

    // Create an overlay element that will be positioned over the given jQuery object
    var overlay = $('<div class="overlay" style="position: absolute; background: rgba(255,255,255,0.5); z-index: 999;"></div>');

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
        $this.find('.overlay').remove();
      }
      if (opts !== false) {
        // Merge some default color and overlay options with those passed into the plugin
        opts = $.extend(
          { color: color || $this.css('color'), overlay: true },
          $.fn.spin.presets[opts] || opts
        );
        if (opts.overlay) {
          // Uses the inner (includes padding but not border) width and height of the target object
          overlay.css({
            width: $this.innerWidth(),
            height: $this.innerHeight(),
            left: 0,
            top: 0
          });

          overlay.appendTo(this);
        }
        data.spinner = new Spinner(opts).spin(this);
      }
    });
  };

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3, zIndex: 1000, overlay: true  },
    small: { lines: 8, length: 4, width: 3, radius: 5, zIndex: 1000, overlay: true },
    large: { lines: 10, length: 8, width: 4, radius: 8, zIndex: 1000, overlay: true }
  };

}));
