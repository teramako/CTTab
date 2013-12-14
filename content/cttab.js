
function start (aEvent) {
  console.group("CTTab::start");
  console.log(aEvent);
  switch (state) {
    case "showing":
    case "open": {
      let item = $panel.querySelector(".cttab-item-container[selected=true]");
      if (item) {
        item.removeAttribute("selected");
        let nextItem;
        if (aEvent.shiftKey) {
          console.log("selecting previous...");
          if (item.previousElementSibling) {
            nextItem = item.previousElementSibling;
            nextItem.setAttribute("selected", "true");
            (nextItem.previousElementSibling ? nextItem.previousElementSibling : nextItem).scrollIntoView();
          } else {
            console.log("rewind");
            nextItem = $panelContent.lastElementChild;
            nextItem.setAttribute("selected", "true");
            nextItem.scrollIntoView();
          }
        } else {
          console.log("selecting next...");
          if (item.nextElementSibling) {
            nextItem = item.nextElementSibling;
            nextItem.setAttribute("selected", "true");
            (nextItem.nextElementSibling ? nextItem.nextElementSibling : nextItem).scrollIntoView();
          } else {
            console.log("rewind");
            nextItem = $panelContent.firstElementChild;
            nextItem.setAttribute("selected", "true");
            nextItem.scrollIntoView();
          }
        }
      }
    }
    break;
    case "hiding":
    break;
    case "closed": {
      console.log("open the panel");
      $panel.style.maxWidth = window.innerWidth + "px";
      $panel.openPopup(gBrowser, "overlap", 0, 0, false, true);
    }
  }
  console.groupEnd();
}

function onPopupShowing() {
  var doc = document;
  window.addEventListener("keyup", onKeyUp, true);
  window.addEventListener("keydown", onKeyDown, true);
  var i = 0;
  for (var tab of tabs.list) {
    var pos = tab._tPos;
    /*
    <vbox class="cttab-item-container" value=${pos}>
      <hbox class="cttab-item-icon">
        <image src=${tab.image}/>
      </hbox>
      <label value=${tab.label}/>
    </vbox>
    */
    var container = doc.createElement("vbox");
    container.setAttribute("class", "cttab-item-container");
    container.setAttribute("value", pos);
    if (i === 1) {
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

    var bgName = "cttab-image-" + pos;
    container.style.backgroundImage = "-moz-element(#" + bgName + ")";
    doc.mozSetImageElement(bgName, tab.linkedBrowser);

    $panelContent.appendChild(container);
    i++;
  }
  var rect = $panel.getBoundingClientRect();
  $panel.moveTo(
    (window.innerWidth  - rect.width)  / 2 + window.screenX,
    (window.innerHeight - rect.height) / 2 + window.screenY
  );
}

function onPopupHiding() {
  currentList = null;
  window.removeEventListener("keyup", onKeyUp, true);
  window.removeEventListener("keydown", onKeyDown, true);
  for (var i = 0, len = $panelContent.childNodes.length; i < len; ++i) {
    $panelContent.removeChild($panelContent.firstChild);
  }
}

function onKeyDown (aEvent) {
  if (aEvent.keyCode === KeyboardEvent.DOM_VK_TAB && aEvent.ctrlKey) {
    start(aEvent);
    aEvent.preventDefault();
    aEvent.stopPropagation();
  }
}
function onKeyUp (aEvent) {
  if (aEvent.keyCode === KeyboardEvent.DOM_VK_CONTROL) {
    switch (state) {
      case "showing":
      case "open": {
        let item = $panel.querySelector(".cttab-item-container[selected=true]");
        if (item) {
          gBrowser.mTabContainer.selectedIndex = parseInt(item.getAttribute("value"), 10);
        }
        $panel.hidePopup();
      }
    }
  }
}

