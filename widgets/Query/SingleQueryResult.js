// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "url:widgets/Query/SingleQueryResult.html":
      '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"features-result" data-dojo-attach-point\x3d"featuresResultDiv"\x3e\r\n    \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"popup-menu-button query-result-action-button" data-dojo-attach-point\x3d"btnFeatureAction" data-dojo-attach-event\x3d"click:_onBtnMenuClicked,keydown:_onBtnMenuKeydown"\x3e\x3c/div\x3e\r\n    \x3cdiv tabindex\x3d"0" class\x3d"results-number" data-dojo-attach-point\x3d"resultsNumberDiv"\x3e\r\n      \x3cdiv class\x3d"number-container"\x3e\r\n        \x3cdiv\x3e${nls.displayedFeatures}:\x3c/div\x3e\r\n        \x3cspan data-dojo-attach-point\x3d"numSpan"\x3e\x3c/span\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"action-container"\x3e\r\n        \x3cdiv role\x3d"button" tabindex\x3d"0" data-dojo-attach-point\x3d"loadMoreIcon" class\x3d"icon load-more-button query-hidden" title\x3d"${nls.loadMore}" data-dojo-attach-event\x3d"onclick:_onLoadMoreClicked,onkeydown:_onLoadMoreKeydown"\x3e\x3c/div\x3e\r\n        \x3cdiv role\x3d"button" tabindex\x3d"0" data-dojo-attach-point\x3d"expandedListIcon" class\x3d"icon expand-list" data-dojo-attach-event\x3d"onclick:_onExpandClicked,onkeydown:_onExpandKeydown"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"results-container" data-dojo-attach-point\x3d"resultsContainer" data-dojo-attach-event\x3d"onscroll:_onResultsScroll" onselectstart\x3d"return false;"\x3e\r\n      \x3ctable data-dojo-attach-point\x3d"resultsTable" valign\x3d"top" class\x3d"results-table" data-dojo-attach-event\x3d"onclick:_onResultsTableClicked,onkeydown:_onResultsTableKeydown" cellpadding\x3d"0" cellspacing\x3d"0" \x3e\r\n        \x3ctbody data-dojo-attach-point\x3d"resultsTbody"\x3e\x3c/tbody\x3e\r\n      \x3c/table\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"multiple-related-records-section not-visible" data-dojo-attach-point\x3d"multipleRelatedRecordsDiv"\x3e\r\n    \x3ctable class\x3d"related-records-header multiple-related-records-header"\x3e\r\n      \x3ctbody\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd class\x3d"first-td"\x3e\r\n            \x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"${nls.back}" class\x3d"back-arrow feature-action icon-arrow-back"  data-dojo-attach-point\x3d"multipleRelatedRecordsResultBackBtn" data-dojo-attach-event\x3d"onclick:_onBtnMultipleRelatedBackClicked,onkeydown:_onBtnMultipleRelatedBackKeydown"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"middle-td"\x3e\r\n            \x3cselect data-dojo-type\x3d"jimu/dijit/formSelect" aria-label\x3d"${nls.relatedLayer}" data-dojo-attach-point\x3d"relatedLayersSelect" data-dojo-attach-event\x3d"change:_onRelatedLayersSelectChanged" style\x3d"width:100%;"\x3e\x3c/select\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"last-td"\x3e\x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"single-related-records-section not-visible" data-dojo-attach-point\x3d"singleRelatedRecordsResultDiv"\x3e\r\n    \x3ctable role\x3d"title" tabindex\x3d"0" class\x3d"related-records-header single-related-records-header" data-dojo-attach-point\x3d"singleRelatedRecordsResultTitle" data-a11y-label-by\x3d"single-related-records-title"  data-dojo-attach-event\x3d"onkeydown:_onBtnSingleRelatedTitleKeydown"\x3e\r\n      \x3ctbody\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd class\x3d"first-td"\x3e\r\n            \x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"${nls.back}" class\x3d"back-arrow feature-action icon-arrow-back" data-dojo-attach-point\x3d"singleRelatedRecordsResultBackBtn" data-dojo-attach-event\x3d"onclick:_onBtnSingleRelatedBackClicked,onkeydown:_onBtnSingleRelatedBackKeydown"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"middle-td"\x3e\r\n            \x3cdiv class\x3d"related-records-title jimu-ellipsis" data-dojo-attach-point\x3d"relatedTitleDiv" data-a11y-label-id\x3d"single-related-records-title"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"last-td"\x3e\x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"shelter" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d"hidden:true"\x3e\x3c/div\x3e\r\n\x3c/div\x3e'
  }
});
define("dojo/_base/declare dijit/_WidgetBase jimu/dijit/BindLabelPropsMixin dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/Evented dojo/text!./SingleQueryResult.html dojo/_base/lang dojo/on dojo/keys dojo/_base/query dojo/_base/html dojo/_base/array dojo/Deferred esri/lang esri/tasks/QueryTask esri/tasks/FeatureSet esri/dijit/PopupTemplate esri/dijit/PopupRenderer esri/tasks/RelationshipQuery esri/renderers/SimpleRenderer jimu/utils jimu/symbolUtils jimu/dijit/Popup jimu/dijit/Message jimu/dijit/FeatureActionPopupMenu jimu/BaseFeatureAction jimu/dijit/SymbolChooser jimu/LayerInfos/LayerInfos jimu/FeatureActionManager ./SingleQueryLoader ./RelatedRecordsResult jimu/dijit/LoadingIndicator jimu/dijit/formSelect".split(
  " "
), function(
  A,
  D,
  E,
  F,
  G,
  H,
  I,
  f,
  q,
  e,
  r,
  c,
  k,
  u,
  J,
  K,
  v,
  L,
  M,
  N,
  O,
  l,
  B,
  P,
  Q,
  R,
  w,
  S,
  T,
  U,
  V,
  x
) {
  return A([D, E, F, G, H], {
    baseClass: "single-query-result",
    templateString: I,
    singleQueryLoader: null,
    featureLayer: null,
    singleRelatedRecordsResult: null,
    multipleRelatedRecordsResult: null,
    popupMenu: null,
    map: null,
    nls: null,
    currentAttrs: null,
    queryWidget: null,
    _lastFeatureClass: "jimu-table-row-last",
    _lastFeatureArrowClass: "popup-title-icon",
    _lastRelatedClass: "related-table-btn-last",
    postMixInProperties: function() {
      this.inherited(arguments);
      this.isRenderIdForAttrs = !0;
      var a = window.jimuNls.common;
      this.nls.back = a.back;
      this.nls.expand = a.expand.split(" $")[0];
      this.nls.collapse = a.collapse.split(" $")[0];
    },
    getCurrentAttrs: function() {
      return this.singleQueryLoader
        ? this.singleQueryLoader.getCurrentAttrs()
        : null;
    },
    postCreate: function() {
      this.inherited(arguments);
      this.singleQueryLoader = new V(this.map, this.currentAttrs);
      this.popupMenu = R.getInstance();
      this.featureActionManager = U.getInstance();
      this.btnFeatureAction.title =
        window.jimuNls.featureActions.featureActions;
      //this._initExpandListIcon();
      this.own(
        q(
          this.multipleRelatedRecordsDiv,
          "keydown",
          f.hitch(this, function(a) {
            a.keyCode === e.ESCAPE &&
              a.target !== this.multipleRelatedRecordsResultBackBtn &&
              (a.stopPropagation(),
              this.multipleRelatedRecordsResultBackBtn.focus());
          })
        )
      );
      this.own(
        q(
          this.singleRelatedRecordsResultDiv,
          "keydown",
          f.hitch(this, function(a) {
            a.keyCode === e.ESCAPE &&
              a.target !== this.singleRelatedRecordsResultBackBtn &&
              (a.stopPropagation(),
              this.singleRelatedRecordsResultBackBtn.focus());
          })
        )
      );
    },
    _initExpandListIcon: function() {
      var a = this.getCurrentAttrs();
      (a = a && a.config) && a.defaultExpand
        ? (c.addClass(this.expandedListIcon, "expanded"),
          (this.expandedListIcon.title = this.nls.collapseAll),
          c.addClass(this.resultsTbody, "expanded"))
        : (c.addClass(this.expandedListIcon, "folded"),
          (this.expandedListIcon.title = this.nls.expandAll),
          c.addClass(this.resultsTbody, "folded"));
    },
    destroy: function() {
      this.emit("features-update", {
        taskIndex: this.currentAttrs.queryTr.taskIndex
      });
      this.queryWidget = null;
      var a = this.getCurrentAttrs();
      a &&
        a.query &&
        (a.query.resultLayer &&
          a.query.resultLayer.getMap() &&
          this.map.removeLayer(a.query.resultLayer),
        (a.query.resultLayer = null));
      this.inherited(arguments);
    },
    _isValidNumber: function(a) {
      return "number" === typeof a && !isNaN(a);
    },
    zoomToLayer: function() {
      var a = this.getCurrentAttrs(),
        b = a.query.resultLayer;
      b &&
        !this._isTable(a.layerInfo) &&
        ((a = k.filter(
          b.graphics,
          f.hitch(this, function(a) {
            return (a = a.geometry)
              ? "point" === a.type
                ? this._isValidNumber(a.x) && this._isValidNumber(a.y)
                : "multipoint" === a.type
                ? a.points && 0 < a.points.length
                  ? k.every(
                      a.points,
                      f.hitch(this, function(a) {
                        return a
                          ? this._isValidNumber(a[0]) &&
                              this._isValidNumber(a[1])
                          : !1;
                      })
                    )
                  : !1
                : !0
              : !1;
          })
        )),
        0 < a.length &&
          ((a = l.toFeatureSet(a)), l.zoomToFeatureSet(this.map, a)));
    },
    _emitFeaturesUpdate: function() {
      this.emit("features-update", {
        taskIndex: this.currentAttrs.queryTr.taskIndex,
        features: this.currentAttrs.query.resultLayer.graphics
      });
    },
    executeQueryForFirstTime: function() {
      var a = new u();
      this._clearResultPage();
      this._hideResultsNumberDiv();
      var b = this.getCurrentAttrs(),
        d = b.query.resultLayer,
        g = f.hitch(this, function(g) {
          if (this.domNode) {
            this.shelter.hide();
            var c = b.query.allCount;
            this._updateNumSpan(b.query.foundedNum, c);
            0 < c &&
              (this._addResultItems(g, d),
              this._addResultLayerToMap(d),
              this.zoomToLayer());
            a.resolve(c);
            this._emitFeaturesUpdate();
          }
        }),
        c = f.hitch(this, function(b) {
          console.error(b);
          this.domNode &&
            (this.shelter.hide(),
            d && this.map.removeLayer(d),
            (d = null),
            this._showQueryErrorMsg(),
            a.reject(b));
        });
      this.shelter.show();
      3 !== b.queryType && this._showResultsNumberDiv();
      this.singleQueryLoader.executeQueryForFirstTime().then(g, c);
      return a;
    },
    getResultLayer: function() {
      var a = this.getCurrentAttrs();
      return f.getObject("query.resultLayer", !1, a);
    },
    showResultLayer: function() {
      var a = this.getResultLayer();
      a && a.show();
    },
    hideResultLayer: function() {
      var a = this.getResultLayer();
      a && a.hide();
    },
    showLayer: function() {
      this.showResultLayer();
      this.multipleRelatedRecordsResult &&
        this.multipleRelatedRecordsResult.showLayer();
      this.singleRelatedRecordsResult &&
        this.singleRelatedRecordsResult.showLayer();
    },
    hideLayer: function() {
      this.hideResultLayer();
      this.multipleRelatedRecordsResult &&
        this.multipleRelatedRecordsResult.hideLayer();
      this.singleRelatedRecordsResult &&
        this.singleRelatedRecordsResult.hideLayer();
    },
    _addResultLayerToMap: function(a) {
      0 > this.map.graphicsLayerIds.indexOf(a.id) && this.map.addLayer(a);
    },
    _showResultsNumberDiv: function() {
      c.setStyle(this.resultsNumberDiv, "display", "flex");
    },
    _hideResultsNumberDiv: function() {
      c.setStyle(this.resultsNumberDiv, "display", "none");
    },
    _updateNumSpan: function(a, b) {
      a > b && (a = b);
      this._updateLoadMoreVisible(a < b);
      a = l.localizeNumber(a);
      b = l.localizeNumber(b);
      this.numSpan.innerHTML = a + "/" + b;
    },
    _isTable: function(a) {
      return "Table" === a.type;
    },
    _onResultsScroll: function() {
      l.isScrollToBottom(this.resultsContainer) && this._continueQuery();
    },
    _continueQuery: function() {
      var a = this.getCurrentAttrs(),
        b = a.query.allCount,
        d = a.query.foundedNum;
      if (!(d >= b)) {
        var g = a.query.resultLayer,
          c = f.hitch(this, function(c) {
            this.domNode &&
              (this._updateLoadMoreState(!1),
              this.shelter.hide(),
              (d = a.query.foundedNum),
              this._updateNumSpan(d, b),
              this._addResultItems(c, g),
              this.zoomToLayer(),
              this._emitFeaturesUpdate(),
              this.emit("features-layout-update"));
          }),
          e = f.hitch(this, function(a) {
            console.error(a);
            this.domNode &&
              (this._updateLoadMoreState(!1),
              this._showQueryErrorMsg(),
              this.shelter.hide());
          });
        this.shelter.show();
        this._updateLoadMoreState(!0);
        this.singleQueryLoader.executeQueryWhenScrollToBottom().then(c, e);
      }
    },
    _clearResultPage: function() {
      this._hideInfoWindow();
      this._unSelectResultTr();
      c.empty(this.resultsTbody);
      this._updateNumSpan(0, 0);
    },
    _unSelectResultTr: function() {
      this.resultTr && c.removeClass(this.resultTr, "jimu-state-active");
      this.resultTr = null;
    },
    _selectResultTr: function(a) {
      this._unSelectResultTr();
      (this.resultTr = a) && c.addClass(this.resultTr, "jimu-state-active");
    },
    _addResultItems: function(a, b) {
      var d = this.getCurrentAttrs(),
        g = d.config.url,
        c = d.config.objectIdField,
        e = this._getCurrentRelationships(),
        m = f.clone(d.config.popupInfo);
      m.mediaInfos = [];
      var n = new L(m),
        h = !0;
      b.renderer || (h = !1);
      var t = this._isWebMapShowRelatedRecordsEnabled();
      this._featuresNum = a.length;
      k.forEach(
        a,
        f.hitch(this, function(a, f) {
          var p = "",
            p = 0 === f % 2 ? "even" : "odd";
          b.add(a);
          this._createQueryResultItem(
            {
              resultLayer: b,
              feature: a,
              trClass: p,
              popupTemplate2: n,
              relationships: e,
              objectIdField: c,
              url: g,
              relationshipPopupTemplates: d.relationshipPopupTemplates,
              shouldCreateSymbolNode: h,
              isWebMapShowRelatedRecordsEnabled: t
            },
            f
          );
        })
      );
    },
    _updateLoadMoreVisible: function(a) {
      a
        ? c.removeClass(this.loadMoreIcon, "query-hidden")
        : c.addClass(this.loadMoreIcon, "query-hidden");
    },
    _updateLoadMoreState: function(a) {
      a
        ? c.addClass(this.loadMoreIcon, "loading")
        : c.removeClass(this.loadMoreIcon, "loading");
    },
    _onLoadMoreClicked: function() {
      this._continueQuery();
    },
    _onLoadMoreKeydown: function(a) {
      (a.keyCode !== e.ENTER && a.keyCode !== e.SPACE) ||
        this._onLoadMoreClicked();
    },
      _clearPopItemClass: function () {
          debugger;
      var a = r(
          ".query-result-item-table .popup-td.expanded",
          this.resultsTbody
        ),
        b = r(".query-result-item-table .popup-td.folded", this.resultsTbody);
      a && a.length && a.removeClass("expanded");
      b && b.length && b.removeClass("folded");
    },
    _onExpandClicked: function() {
      var a = this.nls.expand;
      this._clearPopItemClass();
      c.hasClass(this.resultsTbody, "expanded")
        ? (c.addClass(this.expandedListIcon, "folded"),
          c.removeClass(this.resultsTbody, "expanded"),
          c.addClass(this.resultsTbody, "folded"),
          (this.expandedListIcon.title = this.nls.expandAll))
        : (c.removeClass(this.expandedListIcon, "folded"),
          c.addClass(this.resultsTbody, "expanded"),
          c.removeClass(this.resultsTbody, "folded"),
          (this.expandedListIcon.title = this.nls.collapseAll),
          (a = this.nls.collapse));
      for (
        var b = r(".popup-title-icon", this.resultsTbody), d = 0;
        d < b.length;
        d++
      )
        c.setAttr(b[d], "aria-label", a);
      this.emit("features-layout-update");
    },
    _onExpandKeydown: function(a) {
      (a.keyCode !== e.ENTER && a.keyCode !== e.SPACE) ||
        this._onExpandClicked();
    },
    _getPopupTitle: function(a, b) {
      if (a) return "function" === typeof a.title ? a.title(b) : a.title;
    },
    _createQueryResultItem: function(a, b) {
      var d = "",
        g = "",
        p = "";
      b === this._featuresNum - 1 &&
        ((d = " " + this._lastFeatureClass),
        (g = " " + this._lastRelatedClass),
        (p = 'data-lastArrow\x3d"true"'));
      var e = a.resultLayer,
        m = a.feature,
        n = a.trClass,
        h = a.popupTemplate2,
        t = a.relationships,
        l = a.objectIdField,
        q = a.url,
        v = a.relationshipPopupTemplates,
        y = a.shouldCreateSymbolNode;
      a = a.isWebMapShowRelatedRecordsEnabled;
      if (m && m.attributes) {
        var w = this._getPopupTitle(h, m),
          d = c.toDom(
            '\x3ctr role\x3d"button" tabindex\x3d"0" class\x3d"jimu-table-row jimu-table-row-separator query-result-item' +
              d +
              '"  cellpadding\x3d"0" cellspacing\x3d"0"\x3e\x3ctd\x3e\x3ctable class\x3d"query-result-item-table"\x3e\x3ctbody\x3e\x3ctr\x3e\x3ctd class\x3d"symbol-td"\x3e\x3c/td\x3e\x3ctd class\x3d"popup-td expanded"\x3e\x3cdiv class\x3d"popup-title-container"\x3e\x3cdiv class\x3d"popup-title"\x3e' +
              w +
              '\x3c/div\x3e\x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"' +
              this.nls.collapse +
              '" ' +
              p +
              ' class\x3d"popup-title-icon"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"popup-content"\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e\x3c/td\x3e\x3c/tr\x3e'
          );
        c.addClass(d, n);
        c.place(d, this.resultsTbody);
        d.feature = m;
        n = r(".symbol-td", d)[0];
        if (y)
          try {
            var z = e.renderer;
            if (z) {
              var u = z.getSymbol(m);
              if (u) {
                var x = B.createSymbolNode(u, { width: 32, height: 32 });
                x && c.place(x, n);
              }
            }
          } catch (W) {
            console.error(W);
          }
        else c.destroy(n);
        var C = r(".popup-td .popup-content", d)[0],
          e = h.title,
          y = h.info && h.info.title;
        h.title = null;
        y && (h.info.title = null);
        z = new M({ template: h, graphic: m, chartTheme: h.chartTheme });
        c.place(z.domNode, C);
        z.startup();
        h.title = e;
        y && (h.info.title = y);
        if (l && t && 0 < t.length && a) {
          var A = m.attributes[l];
          k.forEach(
            t,
            f.hitch(this, function(a, d) {
              var f = this._getRelationshipLayerInfo(a.relatedTableId),
                h = f.name,
                p = v[a.relatedTableId],
                e = "related-table-btn";
              b === this._featuresNum - 1 &&
                d === t.length - 1 &&
                (e = e + " " + g);
              d = c.create(
                "div",
                { class: e, role: "button", tabindex: "0", innerHTML: h },
                C
              );
              d.queryStatus = "unload";
              d.url = q;
              d.layerName = h;
              d.objectId = A;
              d.relationship = a;
              d.relationshipLayerInfo = f;
              d.relationshipPopupTemplate = p;
            })
          );
        }
      }
    },
    _onBtnMultipleRelatedBackClicked: function() {
      this._showFeaturesResultDiv();
    },
    _onBtnMultipleRelatedBackKeydown: function(a) {
      a.keyCode === e.ENTER || a.keyCode === e.SPACE || a.keyCode === e.ESCAPE
        ? (a.stopPropagation(),
          this._onBtnMultipleRelatedBackClicked(),
          this.btnFeatureAction.focus())
        : a.keyCode === e.TAB &&
          a.shiftKey &&
          (a.preventDefault(),
          this.multipleRelatedRecordsResult.lastFocusItem.focus());
    },
    _onBtnSingleRelatedBackClicked: function() {
      this._showFeaturesResultDiv();
    },
    _onBtnSingleRelatedBackKeydown: function(a) {
      a.keyCode === e.ENTER || a.keyCode === e.SPACE || a.keyCode === e.ESCAPE
        ? (a.stopPropagation(),
          this._onBtnSingleRelatedBackClicked(),
          this._currentRelatedRecord.focus())
        : a.keyCode === e.TAB && a.shiftKey && a.stopPropagation();
    },
    _onBtnSingleRelatedTitleKeydown: function(a) {
      a.keyCode === e.TAB &&
        a.shiftKey &&
        (a.preventDefault(),
        this.singleRelatedRecordsResult.lastFocusItem.focus());
    },
    _showFeaturesResultDiv: function() {
      this.multipleRelatedRecordsResult &&
        this.multipleRelatedRecordsResult.destroy();
      this.multipleRelatedRecordsResult = null;
      this.singleRelatedRecordsResult &&
        this.singleRelatedRecordsResult.destroy();
      this.singleRelatedRecordsResult = null;
      c.addClass(this.multipleRelatedRecordsDiv, "not-visible");
      c.addClass(this.singleRelatedRecordsResultDiv, "not-visible");
      c.removeClass(this.featuresResultDiv, "not-visible");
      this.emit("hide-related-records");
    },
    _showMultipleRelatedRecords: function() {
      this.singleRelatedRecordsResult &&
        this.singleRelatedRecordsResult.destroy();
      this.singleRelatedRecordsResult = null;
      c.addClass(this.featuresResultDiv, "not-visible");
      c.addClass(this.singleRelatedRecordsResultDiv, "not-visible");
      c.removeClass(this.multipleRelatedRecordsDiv, "not-visible");
      this.emit("show-related-records");
      var a = this._getCurrentRelationships();
      this.relatedLayersSelect.removeOption(
        this.relatedLayersSelect.getOptions()
      );
      k.forEach(
        a,
        f.hitch(this, function(a) {
          var b = this._getRelationshipLayerInfo(a.relatedTableId);
          this.relatedLayersSelect.addOption({
            value: a.id + "",
            label: b.name,
            relationship: a,
            relationshipLayerInfo: b,
            relationshipPopupTemplate: this.currentAttrs
              .relationshipPopupTemplates[a.relatedTableId]
          });
        })
      );
      this._onRelatedLayersSelectChanged();
    },
    _onRelatedLayersSelectChanged: function() {
      var a = this.relatedLayersSelect.get("value"),
        b = this.relatedLayersSelect.getOptions(a);
      if (b) {
        this.multipleRelatedRecordsResult &&
          this.multipleRelatedRecordsResult.destroy();
        this.multipleRelatedRecordsResult = new x({
          map: this.map,
          layerDefinition: b.relationshipLayerInfo,
          nls: this.nls,
          config: this.currentAttrs.config
        });
        this.multipleRelatedRecordsResult.placeAt(
          this.multipleRelatedRecordsDiv
        );
        this.multipleRelatedRecordsResult.lastFocusItem = this.multipleRelatedRecordsResultBackBtn;
        this.multipleRelatedRecordsResultBackBtn.focus();
        this.own(
          q(
            this.multipleRelatedRecordsResult,
            "focus-result-header",
            f.hitch(this, function() {
              this.multipleRelatedRecordsResultBackBtn.focus();
            })
          )
        );
        var d = this.currentAttrs.config.url;
        this.shelter.show();
        var c = f.hitch(this, function(a) {
          console.error(a);
          this.domNode && this.shelter.hide();
        });
        this.singleQueryLoader.getObjectIdsForAllRelatedRecordsAction().then(
          f.hitch(this, function(a) {
            this._queryRelatedRecords(d, a, b.relationship.id).then(
              f.hitch(this, function(d) {
                if (this.domNode) {
                  this.shelter.hide();
                  var c = [];
                  k.forEach(
                    a,
                    f.hitch(this, function(a) {
                      (a = d[a]) &&
                        a.features &&
                        0 < a.features.length &&
                        (c = c.concat(a.features));
                    })
                  );
                  var g = b.relationshipLayerInfo,
                    h = new v();
                  h.fields = f.clone(g.fields);
                  h.features = c;
                  h.geometryType = g.geometryType;
                  h.fieldAliases = {};
                  k.forEach(
                    h.fields,
                    f.hitch(this, function(a) {
                      var b = a.name;
                      h.fieldAliases[b] = a.alias || b;
                    })
                  );
                  this.multipleRelatedRecordsResult.setResult(
                    b.relationshipPopupTemplate,
                    h
                  );
                }
              }),
              c
            );
          }),
          c
        );
      }
    },
    _showSingleRelatedRecordsDiv: function() {
      this.multipleRelatedRecordsResult &&
        this.multipleRelatedRecordsResult.destroy();
      this.multipleRelatedRecordsResult = null;
      c.addClass(this.featuresResultDiv, "not-visible");
      c.addClass(this.multipleRelatedRecordsDiv, "not-visible");
      c.removeClass(this.singleRelatedRecordsResultDiv, "not-visible");
      this.emit("show-related-records");
    },
    _onSingleRelatedTableButtonClicked: function(a) {
      this.singleRelatedRecordsResult &&
        this.singleRelatedRecordsResult.destroy();
      this.singleRelatedRecordsResult = null;
      var b = a.url,
        d = a.layerName,
        c = a.objectId,
        p = a.relationship,
        e = a.relationshipLayerInfo,
        m = a.relationshipPopupTemplate;
      this.singleRelatedRecordsResult = new x({
        map: this.map,
        layerDefinition: e,
        nls: this.nls,
        config: this.currentAttrs.config
      });
      this.singleRelatedRecordsResult.placeAt(
        this.singleRelatedRecordsResultDiv
      );
      this.singleRelatedRecordsResultTitle.lastFocusItem = this.singleRelatedRecordsResultBackBtn;
      this.own(
        q(
          this.singleRelatedRecordsResult,
          "focus-result-header",
          f.hitch(this, function() {
            this.singleRelatedRecordsResultTitle.focus();
          })
        )
      );
      this._showSingleRelatedRecordsDiv();
      var n = f.hitch(this, function() {
        var b = new v();
        b.fields = f.clone(e.fields);
        b.features = a.relatedFeatures;
        b.geometryType = e.geometryType;
        b.fieldAliases = {};
        k.forEach(
          b.fields,
          f.hitch(this, function(a) {
            var d = a.name;
            b.fieldAliases[d] = a.alias || d;
          })
        );
        this.singleRelatedRecordsResult.setResult(m, b);
        this.relatedTitleDiv.innerHTML = d;
        this.singleRelatedRecordsResultTitle.focus();
        this._currentRelatedRecord = a;
      });
      "unload" === a.queryStatus
        ? ((a.queryStatus = "loading"),
          this.shelter.show(),
          this._queryRelatedRecords(b, [c], p.id).then(
            f.hitch(this, function(b) {
              this.domNode &&
                (this.shelter.hide(),
                (b = (b = (b = b && b[c]) && b.features) || []),
                (a.relatedFeatures = b),
                (a.queryStatus = "loaded"),
                n());
            }),
            f.hitch(this, function(b) {
              this.domNode &&
                (this.shelter.hide(),
                console.error(b),
                (a.queryStatus = "unload"),
                n());
            })
          ))
        : "loaded" === a.queryStatus && n();
    },
    _queryRelatedRecords: function(a, b, d) {
      a = new K(a);
      var c = new N();
      c.objectIds = b;
      c.relationshipId = d;
      c.outFields = ["*"];
      c.returnGeometry = !0;
      c.outSpatialReference = this.map.spatialReference;
      return a.executeRelationshipQuery(c);
    },
    _getCurrentRelationships: function() {
      return this.getCurrentAttrs().queryTr.layerInfo.relationships || [];
    },
    _getRelationshipInfo: function(a) {
      for (var b = this._getCurrentRelationships(), d = 0; d < b.length; d++)
        if (b[d].id === a) return b[d];
      return null;
    },
    _getRelationshipLayerInfo: function(a) {
      return this.getCurrentAttrs().relationshipLayerInfos[a];
    },
    _tryLocaleNumber: function(a) {
      var b = a;
      if (J.isDefined(a) && isFinite(a))
        try {
          var d = l.localizeNumber(a);
          "string" === typeof d && (b = d);
        } catch (g) {
          console.error(g);
        }
      return b + "";
    },
    _showQueryErrorMsg: function(a) {
      new Q({ message: a || this.nls.queryError });
    },
    _onSinglePopupExpandIconClicked: function(a) {
      var b = this.nls.expand,
        d = a.parentNode.parentNode;
      if (d) {
        var g = c.hasClass(this.resultsTbody, "expanded");
        c.hasClass(d, "expanded") || c.hasClass(d, "folded")
          ? c.hasClass(d, "expanded")
            ? (c.removeClass(d, "expanded"), c.addClass(d, "folded"))
            : (c.addClass(d, "expanded"),
              c.removeClass(d, "folded"),
              (b = this.nls.collapse))
          : g
          ? (c.addClass(d, "folded"), c.removeClass(d, "expanded"))
          : (c.addClass(d, "expanded"),
            c.removeClass(d, "folded"),
            (b = this.nls.collapse));
        c.setAttr(a, "aria-label", b);
        "true" === c.getAttr(a, "data-lastArrow") &&
          this.emit("features-layout-update");
      }
    },
    _onResultsTableKeydown: function(a) {
      (a.keyCode !== e.ENTER && a.keyCode !== e.SPACE) ||
        this._onResultsTableClicked(a);
    },
    _onResultsTableClicked: function(a) {
      a = a.target || a.srcElement;
      if (c.isDescendant(a, this.resultsTable))
        if (c.hasClass(a, "popup-title-icon"))
          this._onSinglePopupExpandIconClicked(a);
        else if (c.hasClass(a, "related-table-btn"))
          this._onSingleRelatedTableButtonClicked(a);
        else if (
          (a = c.hasClass(a, "query-result-item")
            ? a
            : l.getAncestorDom(
                a,
                f.hitch(this, function(a) {
                  return c.hasClass(a, "query-result-item");
                }),
                this.resultsTbody
              ))
        ) {
          this._selectResultTr(a);
          c.addClass(a, "jimu-state-active");
          a = a.feature;
          var b = a.geometry;
          if (b) {
            var d = b.type,
              g;
            "point" === d
              ? (g = b)
              : "multipoint" === d
              ? 1 === b.points.length
                ? (g = b.getPoint(0))
                : 1 < b.points.length && (g = b.getPoint(0))
              : "polyline" === d
              ? ((g = b.getExtent()), (g = g.expand(1.4)), (g = g.getCenter()))
              : "polygon" === d
              ? ((g = b.getExtent()), (g = g.expand(1.4)), (g = g.getCenter()))
              : "extent" === d && ((g = b.expand(1.4)), (g = g.getCenter()));
            b = l.toFeatureSet(a);
            l.zoomToFeatureSet(this.map, b);
            "function" === typeof this.map.infoWindow.setFeatures &&
              this.map.infoWindow.setFeatures([a]);
            "function" === typeof this.map.infoWindow.reposition &&
              this.map.infoWindow.reposition();
            this.map.infoWindow.show(g);
          }
        }
    },
    _hideInfoWindow: function() {
      this.map &&
        this.map.infoWindow &&
        (this.map.infoWindow.hide(),
        "function" === typeof this.map.infoWindow.setFeatures &&
          this.map.infoWindow.setFeatures([]));
    },
    _getFeatureSet: function() {
      var a = this.currentAttrs.query.resultLayer,
        b = null,
        d = this.currentAttrs.config && this.currentAttrs.config.popupInfo;
      d && (b = d.fieldInfos);
      var c = new v();
      c.fields = f.clone(a.fields);
      c.features = [].concat(a.graphics);
      c.geometryType = a.geometryType;
      c.fieldAliases = {};
      k.forEach(
        c.fields,
        f.hitch(this, function(a) {
          var d = a.name;
          a = this._getFieldAliasByPopupInfo(a, b);
          c.fieldAliases[d] = a;
        })
      );
      return c;
    },
    _getFieldAliasByPopupInfo: function(a, b) {
      var d = a.name;
      a = a.alias || d;
      b &&
        b.length &&
        (b = b.filter(function(a) {
          return a.fieldName === d;
        })[0]) &&
        (a = b.label);
      return a;
    },
    _onBtnMenuClicked: function(a) {
      var b = c.position(a.target || a.srcElement),
        d = this._getFeatureSet(),
        g = this.getCurrentAttrs();
      this.featureActionManager
        .getSupportedActions(d, g.query.resultLayer)
        .then(
          f.hitch(this, function(a) {
            k.forEach(
              a,
              f.hitch(this, function(a) {
                a.data = d;
              })
            );
            if (!g.config.enableExport) {
              var c = [
                "ExportToCSV",
                "ExportToFeatureCollection",
                "ExportToGeoJSON",
                "SaveToMyContent"
              ];
              a = k.filter(
                a,
                f.hitch(this, function(a) {
                  return 0 > c.indexOf(a.name);
                })
              );
            }
            a = k.filter(
              a,
              f.hitch(this, function(a) {
                return "CreateLayer" !== a.name;
              })
            );
            var e = new w({
              name: "RemoveQueryResult",
              iconClass: "icon-close",
              label: this.nls.removeThisResult,
              iconFormat: "svg",
              map: this.map,
              onExecute: f.hitch(this, this._removeResult)
            });
            e.name = "RemoveQueryResult";
            e.data = d;
            a.push(e);
            (e = this._getRelatedTableAction(d)) && a.push(e);
            (e = this._getSymbolAction(d)) && a.push(e);
            this.popupMenu.setActions(a);
            this.popupMenu._setFocusedNodeBeforeOpen();
            this.popupMenu.show(b);
          })
        );
    },
    _onBtnMenuKeydown: function(a) {
      (a.keyCode !== e.ENTER && a.keyCode !== e.SPACE) ||
        this._onBtnMenuClicked(a);
    },
    _getObjectIdField: function() {
      return this.currentAttrs.config.objectIdField;
    },
    _getSymbolAction: function(a) {
      var b = null;
      this.currentAttrs.query.resultLayer.renderer &&
        this.currentAttrs.config.canModifySymbol &&
        (b = new w({
          name: "ChangeSymbol",
          label: this.nls.changeSymbol,
          data: a && a.features,
          iconClass: "icon-edit-symbol",
          iconFormat: "svg",
          map: this.map,
          onExecute: f.hitch(this, this._showSymbolChooser)
        }));
      return b;
    },
    _showSymbolChooser: function() {
      var a = this.currentAttrs.query.resultLayer,
        b = a.renderer,
        c = {};
      (b = b.defaultSymbol || b.symbol)
        ? (c.symbol = b)
        : ((a = l.getSymbolTypeByGeometryType(a.geometryType)), (c.type = a));
      var g = new S(c),
        e = new P({
          width: 380,
          autoHeight: !0,
          titleLabel: this.nls.changeSymbol,
          content: g,
          onClose: f.hitch(this, function() {
            g.destroy();
            e = g = null;
          }),
          buttons: [
            {
              label: window.jimuNls.common.ok,
              onClick: f.hitch(this, function() {
                var a = g.getSymbol();
                this._updateSymbol(a);
                e.close();
              })
            },
            {
              label: window.jimuNls.common.cancel,
              onClick: f.hitch(this, function() {
                e.close();
              })
            }
          ]
        });
    },
    _updateSymbol: function(a) {
      var b = new O(a),
        d = this.currentAttrs.query.resultLayer;
      d.setRenderer(b);
      d.redraw();
      b = r(".symbol", this.resultsTable);
      k.forEach(
        b,
        f.hitch(this, function(b) {
          var d = b.parentElement;
          c.destroy(b);
          (b = B.createSymbolNode(a, { width: 32, height: 32 })) &&
            c.place(b, d);
        })
      );
    },
    _getRelatedTableAction: function(a) {
      var b = null,
        c = a && a.features,
        e = this._getCurrentRelationships();
      this._getObjectIdField() &&
        0 < c.length &&
        e &&
        0 < e.length &&
        this._isWebMapShowRelatedRecordsEnabled() &&
        (b = new w({
          iconClass: "icon-show-related-record",
          icon: "",
          data: a,
          label: this.nls.showAllRelatedRecords,
          onExecute: f.hitch(this, function() {
            this._showMultipleRelatedRecords();
            var a = new u();
            a.resolve();
            return a;
          }),
          getIcon: function() {
            return "";
          }
        }));
      return b;
    },
    _isWebMapShowRelatedRecordsEnabled: function() {
      var a = this.currentAttrs.config.popupInfo;
      return a.relatedRecordsInfo
        ? !1 !== a.relatedRecordsInfo.showRelatedRecords
        : !0;
    },
    _removeResult: function() {
      this.queryWidget.removeSingleQueryResult(this);
      this._hideInfoWindow();
    },
    _getAvailableWidget: function(a) {
      return (a = this.queryWidget.appConfig.getConfigElementsByName(a)[0]) &&
        a.visible
        ? a
        : null;
    },
    _openAttributeTable: function() {
      var a = this._getAvailableWidget("AttributeTable");
      if (a) {
        var b = T.getInstanceSync().getLayerInfoById(
          this.currentAttrs.query.resultLayer.id
        );
        this.queryWidget.widgetManager.triggerWidgetOpen(a.id).then(
          f.hitch(this, function() {
            this.queryWidget.publishData({
              target: "AttributeTable",
              layer: b
            });
          })
        );
      }
    }
  });
});
