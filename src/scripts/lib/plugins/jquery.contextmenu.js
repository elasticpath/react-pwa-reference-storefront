/* contextmenu - jQuery plugin
 * http://www.smartango.com/articles/jquery-context-menu
 * Copyright (c) 2010 Daniele Cruciani
 * Dual licensed under MIT and GPL licenses
 */
define(['jquery'],function(jQuery){
  (function($) {
    $.contextmenu='contextmenu';
    function removemenu(e){
      var el = e.target;
      if( $(el).parent('#'+$.contextmenu).size()==0) {
        $('#'+$.contextmenu).remove();
      }
      return false;
    }
    function firemenu(e,menu,el) {
      removemenu(e);
      $(el).data('clickphase',true);
      setTimeout(function(){$(el).removeData('clickphase');},300);
      var m = $('<ul id="'+$.contextmenu+'">');
      $.each(menu, function(n,a) {
        if(typeof a == 'function') {
          m.append($("<li>").html(n).hover(
            function(){
              $(this).addClass("hover");
            },
            function(){
              $(this).removeClass("hover");
            })
            .click(
            function(evt){
              $('#'+$.contextmenu).remove();
              $(el).data('served',true);
              a(evt,el);
              $(el).removeData('served');
            })
            .mouseup(
            function(evt){
              if($(el).data('clickphase')) return true;
              $('#'+$.contextmenu).remove();
              $(el).data('served',true);
              a(evt,el);
              $(el).removeData('served');
            })
          );
        }
      });
      var pageX = e.pageX;
      var pageY = e.pageY;
      if(window.event) {
        pageX = $(window).scrollLeft()+e.clientX;
        pageY = $(window).scrollTop()+e.clientY;
      }
      m.css({'position':'absolute',top:pageY-3,left:pageX-3});
      $("body").append(m);
      document.getElementById($.contextmenu).oncontextmenu=function(){return false;};
      $("body").one('click',removemenu);
      $(document).one('mousedown',removemenu);
    }
    $.fn.contextmenu=function(menu,mode,timeout) {
      var els = this;
      $.each(els, function(i,el) {
        switch(mode) {
          case 'right':
            el.oncontextmenu=function(e){if(e && !e.bubbles) {return true;} if(!e) e=window.event; if(!e.target) e.target = e.srcElement; firemenu(e,menu,el); if(window.event) window.event.cancelBubble = true; else e.stopPropagation();
              return false;};
            break;
          case 'hold':
            var timeoutfun = null;
            $(el).mousedown(function(e){
              if(!e.bubbles) return;
              if(e.button == 2) return ;
              timeoutfun = setTimeout(function() {
                $(el).data('menu',true);
                firemenu(e,menu,el);
                return false;
              },timeout);
            }).mouseup(function(e){
                clearTimeout(timeoutfun);
                if($(el).data('menu')) {
                }
              }).bind('dragstart',function(e){
                clearTimeout(timeoutfun);
                if($(el).data('menu')==true) return false;
                return true;
              });
            break;
          case 'hover':
            var timeoutfun = null;
            $(el).mouseover(function(e){
              if(!e.bubbles) return;
              if($('#'+$.contextmenu).size()>0) return ;
              if($(el).data('served')==true) return ;
              timeoutfun = setTimeout(function() {
                $(el).data('menu',true);
                firemenu($(el).data('e'),menu,el);
              },timeout);
              return false;
            }).mousemove(function(e){
                $(el).data('e',e);
              }).mouseout(function(e){
                clearTimeout(timeoutfun);
                $(el).removeData('e');
              }).mousedown(function(e){
                clearTimeout(timeoutfun);
                $(el).removeData('e');
              });
            break;
        }
        return $.this;
      });
    }
  })(jQuery);
});
