var CTTab = {
  init: function CTTab_init () {
    // 既存の Ctrl + Tab を無効化する
    gBrowser.mTabBox._eventNode.removeEventListener("keypress", gBrowser.mTabBox, false);
    gBrowser.mTabContainer.addEventListener("TabSelect", this, false);
    this.tabsCache.set(gBrowser.mCurrentTab, Date.now());
  },
  get $panel () {
    var elm = document.getElementById("cttab-panel");
    delete this.$panel;
    return this.$panel = elm;
  },
  get $panelContent () {
    var elm = document.getElementById("cttab-panel-content");
    delete this.$panelContent;
    return this.$panelContent = elm;
  },
  get state () this.$panel.state,
  tabsCache: new WeakMap,
  get tabsList () {
    return Array.slice(gBrowser.mTabs).sort((aTab, bTab) =>
      (this.tabsCache.get(bTab)||0) - (this.tabsCache.get(aTab)||0));
  },
  start: function CTTab_start (aEvent) {
    switch (this.state) {
      case "showing":
      case "open": {
        let item = this.$panel.querySelector(".cttab-item-container[selected=true]");
        if (item) {
          item.removeAttribute("selected");
          let nextItem;
          if (aEvent.shiftKey) {
            if (item.previousElementSibling) {
              nextItem = item.previousElementSibling;
              nextItem.setAttribute("selected", "true");
              (nextItem.previousElementSibling ? nextItem.previousElementSibling : nextItem).scrollIntoView();
            } else {
              nextItem = this.$panelContent.lastElementChild;
              nextItem.setAttribute("selected", "true");
              nextItem.scrollIntoView();
            }
          } else {
            if (item.nextElementSibling) {
              nextItem = item.nextElementSibling;
              nextItem.setAttribute("selected", "true");
              (nextItem.nextElementSibling ? nextItem.nextElementSibling : nextItem).scrollIntoView();
            } else {
              nextItem = this.$panelContent.firstElementChild;
              nextItem.setAttribute("selected", "true");
              nextItem.scrollIntoView();
            }
          }
        }
      }
      break;
      case "closed": {
        this.$panel.style.maxWidth = window.innerWidth + "px";
        this.$panel.openPopup(gBrowser, "overlap", 0, 0, false, true);
      }
    }
  },
  onPopupShowing: function CTTab_onPopupShowing (aEvent) {
    var doc = document;
    window.addEventListener("keyup", this, true);
    window.addEventListener("keydown", this, true);
    var i = 0;
    for (var tab of this.tabsList) {
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
      if (i === 1) container.setAttribute("selected", "true");
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
      this.$panelContent.appendChild(container);
      i++;
    }
    var rect = this.$panel.getBoundingClientRect();
    this.$panel.moveTo(
      (window.innerWidth  - rect.width)  / 2 + window.screenX,
      (window.innerHeight - rect.height) / 2 + window.screenY
    );
  },
  onPopupHiding: function CTTab_onPopupHiding () {
    window.removeEventListener("keyup", this, true);
    window.removeEventListener("keydown", this, true);
    for (var i = 0, len = this.$panelContent.childNodes.length; i < len; ++i) {
      this.$panelContent.removeChild(this.$panelContent.firstChild);
    }
  },
  handleEvent: function CTTab_handleEvent (aEvent) {
    switch (aEvent.type) {
      case "TabSelect": this.onTabSelect(aEvent); break;
      case "keydown"  : this.onKeyDown(aEvent);   break;
      case "keyup"    : this.onKeyUp(aEvent);     break;
    }
  },
  onTabSelect: function CTTab_onTabSelect (aEvent) {
    this.tabsCache.set(aEvent.target, Date.now());
  },
  onKeyDown: function CTTab_onKeyDown (aEvent) {
    if (aEvent.keyCode === KeyboardEvent.DOM_VK_TAB && aEvent.ctrlKey) {
      this.start(aEvent);
      aEvent.preventDefault();
      aEvent.stopPropagation();
    }
  },
  onKeyUp: function CTTab_onKeyUp (aEvent) {
    if (aEvent.keyCode === KeyboardEvent.DOM_VK_CONTROL) {
      switch (this.state) {
        case "showing":
        case "open": {
          let item = this.$panel.querySelector(".cttab-item-container[selected=true]");
          if (item) {
            gBrowser.mTabContainer.selectedIndex = parseInt(item.getAttribute("value"), 10);
          }
          this.$panel.hidePopup();
        }
      }
    }
  },
};

window.addEventListener("load", function cttab_onload() {
  window.removeEventListener("load", cttab_onload, false);
  CTTab.init();
}, false);

