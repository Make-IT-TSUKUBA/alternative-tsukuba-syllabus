// https://kdb.tsukuba.ac.jp/syllabi/theme/default/newportal/portal_common.js

/* jQuery */
$.fn.hoverDelay = function (delay, callbackOver, callbackOut) {
  return this.each(function () {
    $(this).hover(
      function () {
        var t = $(this).data("hoverDelayTimeout");
        if (t != null && typeof t != "undefined") {
          return;
        }
        t = setTimeout(function () {
          callbackOver();
          $(this).removeData("hoverDelayTimeout");
        }, delay);
        $(this).data("hoverDelayTimeout", t);
      },
      function () {
        var t = $(this).data("hoverDelayTimeout");
        if (t != null && typeof t != "undefined") {
          clearTimeout(t);
          $(this).removeData("hoverDelayTimeout");
        }
        callbackOut();
      }
    );
  });
};

/* scroll */
function campusVScrollId(scrollTargetId, id, opt) {
  return campusVScrollObj($(scrollTargetId), $(id), opt);
}
function campusVScrollObj(scrollTargetObj, obj, opt) {
  if (opt == null || typeof opt == "undefined") {
    opt = {};
  }
  var checkDesign = opt.checkDesign;
  if (checkDesign == null || typeof checkDesign == "undefined") {
    checkDesign = true;
  }
  try {
    if (checkDesign == true && portalConf.runMode == "design") {
      return false;
    }
  } catch (e) {}

  var isPositionTop = opt.isPositionTop;
  if (isPositionTop == null || typeof isPositionTop == "undefined") {
    isPositionTop = true;
  }
  var isAnimate = opt.isAnimate;
  if (isAnimate == null || typeof isAnimate == "undefined") {
    isAnimate = true;
  }
  var isHtmlBody = opt.isHtmlBody;
  if (isHtmlBody == null || typeof isHtmlBody == "undefined") {
    isHtmlBody = false;
  }

  var p = isPositionTop ? obj.position().top : obj.offset().top;
  if (!isHtmlBody) {
    p = p + scrollTargetObj.scrollTop();
  }
  if (isAnimate) {
    scrollTargetObj.animate({ scrollTop: p }, "fast");
  } else {
    scrollTargetObj.scrollTop(p);
  }
  return false;
}
