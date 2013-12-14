
window.addEventListener("load", function onload() {
  window.removeEventListener("load", onload, false);
  init();
}, false);

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import("resource://gre/modules/Services.jsm");

var gWin = window.QueryInterface(Ci.nsIInterfaceRequestor)
                 .getInterface(Ci.nsIWebNavigation)
                 .QueryInterface(Ci.nsIDocShellTreeItem)
                 .parent
                 .QueryInterface(Ci.nsIInterfaceRequestor)
                 .getInterface(Ci.nsIDOMWindow);

var content = null;
function init () {
  build();
}
function build () {
  var doc = document;
  content = document.getElementById("content");
  for (var tab of gWin.gBrowser.visibleTabs) {
    var pos = tab._tPos;
    var container = doc.createElement("vbox");
    container.setAttribute("class", "cttab-item-container");
    container.setAttribute("value", pos);
    if (tab.selected) {
      container.setAttribute("selected", "true");
    }
    var imageConatiner = doc.createElement("hbox");
    imageConatiner.setAttribute("class", "cttab-item-icon");
    var image = doc.createElement("image");
    image.setAttribute("src", tab.image);
    imageConatiner.appendChild(image);

    var label = doc.createElement("label");
    label.setAttribute("class", "cttab-item-title");
    label.setAttribute("crop", "end");
    label.setAttribute("value", tab.label);

    container.appendChild(imageConatiner);
    container.appendChild(label);

    content.appendChild(container);
    var bgName = "cttab-image-" + pos;
    container.style.backgroundImage = "-moz-element(#" + bgName + ")";
    doc.mozSetImageElement(bgName, tab.linkedBrowser);
  }
}

function onUnload () {
}

