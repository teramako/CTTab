
var CTTab = {
  init: function CTTab_init () {
    // 既存の Ctrl + Tab を無効化する
    var mTabBox = gBrowser.mTabBox;
    mTabBox._eventNode.removeEventListener("keypress", mTabBox, false);

    gBrowser.mTabContainer.addEventListener("TabSelect", this.tabs, false);
    this.tabs.cache.set(gBrowser.mCurrentTab, Date.now());
  },
  destroy: function CTTab_destroy () {
    gBrowser.mTabContainer.removeEventListener("TabSelect", this.tabs, false);
  },
  start: function load_cttab (aEvent) {
    Services.scriptloader.loadSubScript("chrome://cttab/content/cttab.js", this);
    this.start(aEvent);
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

  tabs: {
    cache: new WeakMap,
    handleEvent: function (aEvent) {
      this.cache.set(aEvent.target, Date.now());
    },
    get list () Array.slice(gBrowser.mTabs).sort((aTab, bTab) => (this.cache.get(bTab)||0) - (this.cache.get(aTab)||0)),
  }
};

window.addEventListener("load", function cttab_onload() {
  window.removeEventListener("load", cttab_onload, false);
  CTTab.init();
}, false);

