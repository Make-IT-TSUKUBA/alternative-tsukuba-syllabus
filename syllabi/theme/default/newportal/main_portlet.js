// https://kdb.tsukuba.ac.jp/syllabi/theme/default/newportal/main_portlet.js

﻿    function resizeMainIF() {
        var requiredFlg = ($("#changeStyleRequiredFlg").size() > 0);
        autoResize(9, requiredFlg);
    }
    function autoResize(tryNo, requiredFlg) {
        if(window == parent || $("#main-frame", parent.document).size() == 0){
            // 親がiframeでない（親がウィンドウ）もしくは、メインフレームが無ければ終了
            return;
        }
        
        var roundMax = 3;
        
        var iframe = $("#main-frame-if", parent.document);
        var box = $("#main-frame", parent.document);
        
        var ifw = $(document).width();
        if (tryNo == 1){
            // 最初
            var baseSize = $("#dummy-portlet-l", parent.document).width();
            if (box.hasClass("portlet-m")){
                baseSize = $("#dummy-portlet-m", parent.document).width();
            }
            
            ifw = baseSize;
            box.animate({width:(baseSize+'px')}, "fast");
            iframe.width(baseSize);
            
            parent.campusVScrollObj($("html,body", parent.document), $("#main-frame", parent.document), {isHtmlBody: true});
        }
        
        var ua =navigator.userAgent;
        var ifh = $('body', document).height();
        if (($.browser.msie && $.browser.version <= 7 && ua.indexOf("Trident") == -1) && tryNo >= 2){
            ifh = iframe.contents().height();
        }
        if (tryNo == 1){
            // 最初
          if (Math.abs(iframe.height() - ifh) > 30){
            iframe.height(130);
          }
        }
        
        if (ifw > 0 && ifh > 0){
            if (iframe.width() != ifw || iframe.height() != ifh){
                box.animate({width:(ifw+'px')}, "fast");
                iframe.css({width:(ifw+'px'), height:(ifh+'px')});
                
                var designer = $(".portletDesigner", iframe.parent());
                if (designer.size() > 0){
                    designer.width(ifw);
                }
                var selecter = $(".portletSelecter", iframe.parent());
                if (selecter.size() > 0){
                    selecter.width(ifw);
                }
            }
        }
        if (tryNo >= roundMax){
            parent.changeStyleMain("main-frame", true, requiredFlg);
            
            parent.resizePortalImpl(true, ifw);
        }
        
        var loading = $("#main-frame-if-loading", parent.document);
        loading.fadeOut('fast', function() {
          loading.hide();
        });
        
        // ブラウザによってはloadでのサイズ取得がうまくいかない可能性もあるため、
        // 念のためにタイマーで表示直後にリサイズをかける
        if (tryNo < roundMax - 1){
            setTimeout(function(){autoResize(tryNo+1, requiredFlg);}, 500);
        } else if (tryNo == roundMax - 1){
            setTimeout(function(){autoResize(tryNo+1, requiredFlg);}, 500);
        }
    }
    
$(document).ready(function() {
    // load時にサイズが取得できないブラウザもあるため、強制的にshow
    if ($(document).find(".portalNoResize").size() > 0){
      return;
    }
    if ($.ui){
        // JQuery UI  loading
        $(document).find("input:button, input:submit, input:reset, div.button, button").button();
        $(document).show("show", "fast", function() {
            var requiredFlg = ($("#changeStyleRequiredFlg").size() > 0);
            autoResize(1, requiredFlg);
        });
    } else {
        // JQuery loading
        var requiredFlg = ($("#changeStyleRequiredFlg").size() > 0);
        $(document).show(function() {
            autoResize(1, requiredFlg);
        });
    }
    $(document).delegate("A[href^='#']", "click", function(){
      if ($(this).hasClass("ui-tabs-anchor") || $(this).closest(".ui-tabs-nav").size() > 0){
        return false;
      }
      var href = $(this).attr("href");
      if (typeof href != 'undefined' && href != null && href != '' && href != '#'){
        href = href.substring(1);
        var obj = $("A[name=" + href + "]", $("#main-frame-if", parent.document).contents());
        if (typeof obj != 'undefined' && obj != null){
          parent.campusVScrollObj($("html,body", parent.document), obj, {isHtmlBody: true});
        }
      }
      return false;
    });
});
