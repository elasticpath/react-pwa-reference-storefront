/*--------------------------------------------------------------------

	Resize Page Elements
	• looks for all elements of a given classname and resizes to max found height

--------------------------------------------------------------------*/
define(['jquery'],function(jQuery){
  $.fn.equalHeights = function() {
    window.currentTallest = 0;

    // scan elements for largest height
    $(this).each(function(){
      $(this).css({'min-height': 0});

      $elHeight = $(this).outerHeight();
      $maxHeight = window.currentTallest;

      if ($elHeight > $maxHeight) {
        window.currentTallest = $elHeight;
      }
    });

    // apply largest found height to all elements
    $(this).each(function(){

      $(this).css({'min-height': 0});

      // for ie6, set height since min-height isn't supported
      if ($.browser.msie && $.browser.version == 6.0) { $(this).css({'height': currentTallest}); }

      $(this).css({'min-height': window.currentTallest});
    });

    return this;
  };
});

