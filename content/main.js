
const windowObserver = {
  observe: function observeWindow (aSubject, aTopic, aData) {
    var win = aSubject.QueryInterface(Ci.nsIDOMWindow);
    if (aTopic === "domwindowopened") {
      //win.addEventListener("DOMContentLoaded", function PT_onDOMContentLoaded (aEvent) {
      win.addEventListener("load", function CTTab_onDOMContentLoaded (aEvent) {
        win.removeEventListener(aEvent.type, CTTab_onDOMContentLoaded, false);
        if (win.location.href === "chrome://browser/content/browser.xul")
          initWindow(win);
      }, false);
    }
  },
  QueryInterface: function (aIID) {
    if (aIID.equals(Ci.nsISupports) ||
        aIID.equals(Ci.nsIObserver))
      return this;

    throw Cr.NS_ERROR_NO_INTERFACE;
  }
};

function * getWindows (type) {
  if (!type)
    type = "navigator:browser";

  var windows = Services.wm.getEnumerator(type);
  while (windows.hasMoreElements()) {
    yield windows.getNext().QueryInterface(Ci.nsIDOMWindow);
  }
}

function initWindow (aWindow) {
  var doc = aWindow.document;
}

{
  // initialize block
  for (let win of getWindows()) {
    initWindow(win);
  }
  Services.ww.registerNotification(windowObserver);

}

function destroy () {
  Services.ww.unregisterNotification(windowObserver);

  for (let win of getWindows()) {
    if (win.gPanoToolbar) {
      win.gPanoToolbar.uninit();
      delete win.gPanoToolbar;
    }
  }
  Services.console.logStringMessage("CTTab shutdown");
}

