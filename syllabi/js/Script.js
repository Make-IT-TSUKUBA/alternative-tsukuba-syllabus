// https://kdb.tsukuba.ac.jp/syllabi/js/Script.js

// ウィンドウタイトルのセット
if (top) {
  top.document.title = document.title + " [CampusSquare]";
}

// onloadイベント処理
function onLoadWindow() {
  if (document.TimeoutForm && document.TimeoutForm.status.value == "1") {
    document.TimeoutForm.status.value = "0";
    if (top.topmenu && top.topmenu.document.TopForm) {
      top.topmenu.initTimeout();
    } else if (
      opener &&
      opener.top &&
      opener.top.topmenu &&
      opener.top.topmenu.document.TopForm
    ) {
      opener.top.topmenu.initTimeout();
    } else if (top.document.TopForm) {
      top.initTimeout();
    } else if (opener && opener.top && opener.top.document.TopForm) {
      opener.top.initTimeout();
    }
  }
}

// onloadイベントのセット
window.onload = onLoadWindow;

// Help表示
function showHelp(url) {
  SubWin = window.open(
    url,
    "HelpWindow",
    "width=500,height=500,location=0,menubar=0,scrollbars=1,resizable=1,toolbar=1"
  );

  SubWin.focus();

  //return false;
}

var double_flg = false;
// 二重送信防止
function send() {
  if (double_flg) {
    alert("送信済みです。しばらくお待ち下さい");
    return false;
  } else {
    double_flg = true;
    return true;
  }
}

// ブラウザ名の取得
// Netscape Navigator ->  Netscape
// Internet Explorer  ->  Explorer
function getBrowserName() {
  var aName = navigator.appName.toUpperCase();
  var uName = navigator.userAgent.toUpperCase();
  if (aName.indexOf("NETSCAPE") >= 0) return "Netscape";
  if (aName.indexOf("MICROSOFT") >= 0) return "Explorer";
  return "";
}
// ブラウザバージョンの取得
function getBrowserVersion() {
  var browser = getBrowserName();
  var version = 0;
  var s = 0;
  var e = 0;
  var appVer = navigator.appVersion;
  if (browser == "Netscape") {
    s = appVer.indexOf(" ", 0);
    version = eval(appVer.substring(0, s));
    if (version >= 5) version++;
  }
  if (browser == "Explorer") {
    appVer = navigator.userAgent;
    s = appVer.indexOf("MSIE ", 0) + 5;
    e = appVer.indexOf(";", s);
    version = eval(appVer.substring(s, e));
  }
  return version;
}
// OS名の取得
// Windows   ->　Windows
// Macintosh ->  MacOS
// UNIX      ->　UNIX
function getOSType() {
  var RetCode = "";
  var uAgent = navigator.userAgent.toUpperCase();
  if (uAgent.indexOf("WIN") >= 0) RetCode = "Windows";
  if (uAgent.indexOf("MAC") >= 0) RetCode = "MacOS";
  if (uAgent.indexOf("X11") >= 0) RetCode = "UNIX";
  return RetCode;
}

////////////////////////////
// テーブルのイベント処理 //
////////////////////////////

// TABLEタグのマウス処理
function TABLEMouseOut(obj) {
  obj.bgColor = getNormalColor();
}
function TABLEMouseOver(obj) {
  obj.bgColor = getNormalHoverColor();
}

// TABLEタグのマウス処理（色指定）
function TABLEMouseOutC(obj, color) {
  obj.bgColor = color;
}
function TABLEMouseOverC(obj, color) {
  obj.bgColor = color;
}

// TRタグのマウス処理
function TRMouseOut(obj) {
  obj.bgColor = getNormalColor();
}
function TRMouseOver(obj) {
  obj.bgColor = getNormalHoverColor();
}

// TRタグのマウス処理（色指定）
function TRMouseOutC(obj, color) {
  obj.bgColor = color;
}
function TRMouseOverC(obj, color) {
  obj.bgColor = color;
}

// TDタグのマウス処理
function TDMouseOut(obj) {
  obj.bgColor = getNormalColor();
}
function TDMouseOver(obj) {
  obj.bgColor = getNormalHoverColor();
}

// TDタグのマウス処理（色指定）
function TDMouseOutC(obj, color) {
  obj.bgColor = color;
}
function TDMouseOverC(obj, color) {
  obj.bgColor = color;
}

/////////////////////////////
//全選択･全解除のJavaScript//
/////////////////////////////
function AllCheck(frm_nm, obj_nm) {
  for (i = 0; i < document.forms[frm_nm].elements.length; i++) {
    if (document.forms[frm_nm].elements[i].name == obj_nm) {
      document.forms[frm_nm].elements[i].checked = true;
    }
  }
  return false;
}

function AllReset(frm_nm, obj_nm) {
  for (i = 0; i < document.forms[frm_nm].elements.length; i++) {
    if (document.forms[frm_nm].elements[i].name == obj_nm) {
      document.forms[frm_nm].elements[i].checked = false;
    }
  }
  return false;
}

//////////////////////////////
//必須チェックのJavaScript  //
//titleが必須:から始まる場合//
//空チェックをおこなう      //
//////////////////////////////

function returnError(colum) {
  alert(colum + " is a must !");
  return false;
}

function noInput(frm_nm) {
  var flg = true;
  for (i = 0; i < document.forms[frm_nm].elements.length; i++) {
    var name = document.forms[frm_nm].elements[i].title;
    if (name.indexOf("hissu") > -1) {
      var val = document.forms[frm_nm].elements[i].value;
      if (val != null && val.length > 0) {
      } else {
        flg = false;
        returnError(name.replace("hissu:", ""));
        return false;
      }
    }
  }
  if (flg) {
    document.forms[frm_nm].submit();
  }
}

////////////////////////
//サブウィンドをOpen  //
////////////////////////
function subwinOpen(winname, params, url) {
  var newwin = window.open(url, winname, params);
  //newwin.moveTo(0, 0);
  newwin.focus();
  return false;
}
