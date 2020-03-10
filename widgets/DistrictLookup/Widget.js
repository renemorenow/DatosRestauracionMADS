// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "widgets/DistrictLookup/search": function() {
      define("dojo/_base/declare dijit/_WidgetBase dojo/Evented dojo/_base/lang dojo/_base/array esri/dijit/Search esri/tasks/locator esri/layers/FeatureLayer jimu/utils dojo/dom-construct jimu/LayerInfos/LayerInfos ./searchSourceUtils dojo/when dojo/Deferred dojo/promise/all dojo/on esri/InfoTemplate".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g, b, a, k, q, m) {
        return h([t, d], {
          config: null,
          map: null,
          searchOptions: null,
          layerInfosObj: null,
          _urlParams: {},
          constructor: function(a) {
            u.mixin(this, a);
          },
          postCreate: function() {
            this._urlParams = {};
          },
          startup: function() {
            this.inherited(arguments);
            F.getInstance(this.map, this.map.itemInfo).then(
              u.hitch(this, function(a) {
                this.layerInfosObj = a;
                this.own(
                  this.layerInfosObj.on(
                    "layerInfosFilterChanged",
                    u.hitch(this, this.onLayerInfosFilterChanged)
                  )
                );
                g.setMap(this.map);
                g.setLayerInfosObj(this.layerInfosObj);
                g.setAppConfig(this.appConfig);
                b(g.getConfigInfo(this.config.searchSourceSettings))
                  .then(
                    u.hitch(this, function(a) {
                      this.config.searchSourceSettings ||
                        (this.config.searchSourceSettings = a);
                      return k(this._convertConfig(a)).then(function(a) {
                        return v.filter(a, function(a) {
                          return a;
                        });
                      });
                    })
                  )
                  .then(
                    u.hitch(this, function(a) {
                      this.domNode && this._init(a);
                    })
                  );
              })
            );
          },
          _convertConfig: function(b) {
            return v.map(
              b.sources,
              u.hitch(this, function(b) {
                var d = new a();
                if (b && b.url && "locator" === b.type) {
                  var e = {
                    locator: new n(b.url || ""),
                    outFields: ["*"],
                    singleLineFieldName: b.singleLineFieldName || "",
                    name: f.stripHTML(b.name || ""),
                    placeholder: f.stripHTML(b.placeholder || ""),
                    countryCode: b.countryCode || "",
                    maxSuggestions: b.maxSuggestions,
                    maxResults: b.maxResults || 6,
                    zoomScale: b.zoomScale || 5e4,
                    useMapExtent: !!b.searchInCurrentMapExtent
                  };
                  b.enableLocalSearch &&
                    (e.localSearchOptions = {
                      minScale: b.localSearchMinScale,
                      distance: b.localSearchDistance
                    });
                  d.resolve(e);
                } else
                  b && b.url && "query" === b.type
                    ? ((e = new r(b.url || null, { outFields: ["*"] })),
                      this.own(
                        q(
                          e,
                          "load",
                          u.hitch(this, function(a) {
                            var e, c, g;
                            e = a.layer;
                            c = this._getInfoTemplate(e, b, b.displayField);
                            g = null;
                            b.searchFields && 0 < b.searchFields.length
                              ? (g = b.searchFields)
                              : ((g = []),
                                v.forEach(e.fields, function(a) {
                                  "esriFieldTypeOID" !== a.type &&
                                    a.name !== e.objectIdField &&
                                    "esriFieldTypeGeometry" !== a.type &&
                                    g.push(a.name);
                                }));
                            a = {
                              featureLayer: e,
                              outFields: ["*"],
                              searchFields: g,
                              displayField: b.displayField || "",
                              exactMatch: !!b.exactMatch,
                              name: f.stripHTML(b.name || ""),
                              placeholder: f.stripHTML(b.placeholder || ""),
                              maxSuggestions: b.maxSuggestions || 6,
                              maxResults: b.maxResults || 6,
                              zoomScale: b.zoomScale || 5e4,
                              infoTemplate: c,
                              useMapExtent: !!b.searchInCurrentMapExtent,
                              _featureLayerId: b.layerId
                            };
                            c || delete a.infoTemplate;
                            a._featureLayerId &&
                              ((c = this.layerInfosObj.getLayerInfoById(
                                a._featureLayerId
                              )),
                              e.setDefinitionExpression(c.getFilter()));
                            d.resolve(a);
                          })
                        )
                      ),
                      this.own(
                        q(e, "error", function() {
                          d.resolve(null);
                        })
                      ))
                    : d.resolve(null);
                return d;
              })
            );
          },
          _getInfoTemplate: function(a, b, d) {
            var e, c, g;
            c =
              (e = this.layerInfosObj.getLayerInfoById(b.layerId)) &&
              e.getInfoTemplate();
            g = e && c;
            if (e && !g) return null;
            g ||
              ((c = new m()),
              c.setTitle("\x26nbsp;"),
              c.setContent(u.hitch(this, "_formatContent", b.name, a, d)));
            return c;
          },
          _init: function(a) {
            var b;
            b = 1 === a.length ? 0 : "all";
            a = {
              map: this.map,
              addLayersFromMap: !1,
              autoNavigate: !1,
              autoComplete: !0,
              minCharacters: 0,
              searchDelay: 100,
              enableInfoWindow: !0,
              enableHighlight: this.config.searchSourceSettings
                .showInfoWindowOnSelect,
              showInfoWindowOnSelect: this.config.searchSourceSettings
                .showInfoWindowOnSelect,
              allPlaceholder: f.stripHTML(
                this.config.searchSourceSettings.allPlaceholder
              ),
              sources: a,
              activeSourceIndex: b
            };
            u.mixin(a, this.searchOptions);
            this._urlParams = this._getUrlParams();
            this.search = new x(a, c.create("div", { class: "searchControl" }));
            c.place(this.search.domNode, this.domNode);
            this.own(this.search.on("load", u.hitch(this, this._load)));
            this.own(
              this.search.on("select-result", u.hitch(this, this._selectResult))
            );
            this.own(
              this.search.on("clear-search", u.hitch(this, this._clear))
            );
            this.own(
              this.search.on("search-results", u.hitch(this, this._results))
            );
            this.own(
              this.search.on("suggest-results", u.hitch(this, this._results))
            );
            this.search.startup();
          },
          _getUrlParams: function() {
            var a = f.urlToObject(document.location.href);
            a.query = a.query || {};
            return a.query;
          },
          setSearchText: function(a) {
            this.search.set("value", a);
          },
          clearSearchText: function() {
            this.search && this.search.clear();
          },
          _setSearchString: function() {
            this._urlParams.find &&
              (this.search.set("value", this._urlParams.find),
              setTimeout(
                u.hitch(this, function() {
                  this.search.search();
                }),
                1e3
              ));
          },
          onLayerInfosFilterChanged: function(a) {
            v.some(
              a,
              u.hitch(this, function(a) {
                this.search &&
                  this.search.sources &&
                  0 < this.search.sources.length &&
                  v.forEach(this.search.sources, function(b) {
                    b._featureLayerId === a.id &&
                      b.featureLayer.setDefinitionExpression(a.getFilter());
                  });
              })
            );
          },
          _load: function(a) {
            this.emit("search-loaded", a);
            this._setSearchString();
          },
          _results: function(a) {
            this.emit("search-results", a);
          },
          _clear: function(a) {
            this.emit("clear-search", a);
          },
          _selectResult: function(a) {
            this.search.blur();
            this.emit("select-result", a);
          }
        });
      });
    },
    "esri/dijit/Search": function() {
      define("require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Evented dojo/Deferred dojo/keys dojo/on dojo/query dojo/uacss dojo/regexp dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-style dojo/dom-construct dojo/date/locale dojo/i18n!../nls/jsapi dojo/text!./Search/templates/Search.html dijit/_WidgetBase dijit/_TemplatedMixin dijit/_FocusMixin dijit/a11yclick dijit/focus ../lang ../InfoTemplate ../kernel ../SpatialReference ../graphic ../promiseList ../symbols/PictureMarkerSymbol ../symbols/SimpleMarkerSymbol ../symbols/SimpleLineSymbol ../symbols/SimpleFillSymbol ../symbols/TextSymbol ../symbols/Font ../geometry/Point ../geometry/Extent ../geometry/normalizeUtils ../geometry/scaleUtils ../tasks/locator ../tasks/query ../Color ../styles/basic".split(
        " "
      ), function(
        h,
        t,
        d,
        u,
        v,
        x,
        n,
        r,
        f,
        c,
        F,
        g,
        b,
        a,
        k,
        q,
        m,
        e,
        A,
        H,
        I,
        E,
        N,
        C,
        G,
        B,
        Y,
        L,
        O,
        M,
        J,
        V,
        Q,
        D,
        l,
        y,
        K,
        da,
        W,
        aa,
        S,
        U,
        X,
        R
      ) {
        function Z(a, b) {
          a && b && ((a._layer = b), (a._sourceLayer = b));
        }
        t = t([H, I, E, v], {
          declaredClass: "esri.dijit.Search",
          templateString: A,
          reHostedFS: /https?:\/\/services.*\.arcgis\.com/i,
          constructor: function(a, b) {
            this.css = {
              searchGroup: "searchGroup",
              searchInput: "searchInput",
              searchInputGroup: "searchInputGroup",
              searchBtn: "searchBtn",
              searchSubmit: "searchSubmit",
              searchIcon: "searchIcon esri-icon-search",
              searchButtonText: "searchButtonText",
              searchToggle: "searchToggle",
              searchToggleIcon: "searchIcon esri-icon-down-arrow",
              searchMenu: "searchMenu",
              searchMenuHeader: "menuHeader",
              searchClear: "searchClear",
              searchClearIcon: "searchIcon esri-icon-close searchClose",
              searchSpinner:
                "searchIcon esri-icon-loading-indicator searchSpinner",
              searchSourceName: "sourceName",
              suggestionsMenu: "suggestionsMenu",
              sourcesMenu: "sourcesMenu",
              activeSource: "active",
              hasValue: "hasValue",
              hasButtonMode: "hasButtonMode",
              hasMultipleSources: "hasMultipleSources",
              showSuggestions: "showSuggestions",
              showSources: "showSources",
              showNoResults: "showNoResults",
              searchLoading: "searchLoading",
              latLonHeader: "searchLatLongHeader",
              searchMoreResults: "moreResults",
              searchMoreResultsList: "resultsList",
              searchMoreResultsHeader: "moreHeader",
              searchMoreResultsItem: "moreItem",
              searchMoreResultsListHeader: "popupHeader",
              searchShowMoreResults: "showMoreResults",
              searchNoResultsMenu: "noResultsMenu",
              searchNoResultsBody: "noResultsBody",
              searchNoResultsHeader: "noResultsHeader",
              searchNoValueIcon: "noValueIcon esri-icon-notice-triangle",
              searchNoValueText: "noValueText",
              searchNoResultsText: "noResultsText",
              searchExpandContainer: "searchExpandContainer",
              searchAnimateContainer: "searchAnimate",
              searchExpanded: "searchExpanded",
              searchCollapsed: "searchCollapsed",
              searchClearFloat: "searchClearFloat"
            };
            this._allIndex = "all";
            this._objectIdIdentifier = "_objectId";
            this._deferreds = [];
            this._sourceNames = [];
            this.defaultSource = {
              locator: new S(
                "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
              ),
              singleLineFieldName: "SingleLine",
              outFields: ["Addr_type", "Match_addr", "StAddr", "City"],
              name: e.widgets.Search.main.esriLocatorName,
              localSearchOptions: { minScale: 3e5, distance: 5e4 },
              placeholder: e.widgets.Search.main.placeholder,
              highlightSymbol: new J(
                h.toUrl("./Search/images/search-pointer.png"),
                36,
                36
              ).setOffset(9, 18)
            };
            this.options = {
              map: null,
              theme: "arcgisSearch",
              visible: !0,
              value: "",
              allPlaceholder: "",
              sources: [this.defaultSource],
              activeSourceIndex: 0,
              suggestionDelay: 150,
              enableSourcesMenu: !0,
              enableSuggestionsMenu: !0,
              enableInfoWindow: !0,
              showInfoWindowOnSelect: !0,
              enableSuggestions: !0,
              enableButtonMode: !1,
              autoNavigate: !0,
              autoSelect: !0,
              addLayersFromMap: !1,
              zoomScale: 1e3,
              graphicsLayer: null,
              enableHighlight: !0,
              highlightGraphic: null,
              enableLabel: !1,
              labelSymbol: new l()
                .setColor(new X([181, 56, 46, 0.9]))
                .setFont(
                  new y(
                    "14px",
                    y.STYLE_NORMAL,
                    y.VARIANT_NORMAL,
                    y.WEIGHT_BOLD,
                    "Arial"
                  )
                ),
              labelGraphic: null,
              infoTemplate: new B(
                e.widgets.Search.main.searchResult,
                '\x3cdiv class\x3d"${searchTheme}"\x3e\x3cdiv id\x3d"${searchMoreResultsId}" class\x3d"${searchMoreResults}"\x3e\x3cdiv class\x3d"${searchMoreResultsItem}"\x3e${searchResult}\x3c/div\x3e\x3cdiv\x3e${searchMoreResultsHtml}\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e'
              ),
              searchResults: null,
              suggestResults: null,
              selectedResult: null,
              magicKey: null,
              selectedFeatureId: null,
              expanded: !1,
              maxLength: 128,
              maxResults: 6,
              maxSuggestions: 6,
              locationToAddressDistance: 1500,
              minCharacters: 1,
              enableSearchingAll: !0
            };
            a = d.mixin({}, this.options, a);
            this.set(a);
            this._updateActiveSource();
            this._i18n = e;
            this._defaultSR = new L(4326);
            this.domNode = b;
          },
          startup: function() {
            this.inherited(arguments);
            this.sources || (this.sources = []);
            this._mapLoaded().then(d.hitch(this, this._init));
          },
          postCreate: function() {
            var a = this;
            this.inherited(arguments);
            this._moreResultsId = this.id + "_more_results";
            this.own(r(this.submitNode, N, d.hitch(this, this._searchButton)));
            this.own(
              r(this.sourcesBtnNode, N, d.hitch(this, this._toggleSourcesMenu))
            );
            this.own(r(this.inputNode, N, d.hitch(this, this._inputClick)));
            this.own(r(this.clearNode, N, d.hitch(this, this._clearButton)));
            this.own(
              r(
                this.formNode,
                "submit",
                d.hitch(this, function(a) {
                  a.preventDefault();
                  this._cancelSuggest();
                  this.search();
                })
              )
            );
            this.own(
              r(
                this.inputNode,
                "keyup",
                d.hitch(this, function(a) {
                  this._inputKey(a);
                })
              )
            );
            this.own(
              r(
                this.sourcesBtnNode,
                "keyup",
                d.hitch(this, function(a) {
                  this._sourceBtnKey(a);
                })
              )
            );
            this.own(
              r(this.suggestionsNode, "li:click, li:keyup", function(w) {
                a._suggestionsEvent(w, this);
              })
            );
            this.own(
              r(this.sourcesNode, "li:click, li:keyup", function(w) {
                a._sourcesEvent(w, this);
              })
            );
            this.own(
              r(
                this.inputNode,
                "input, paste",
                d.hitch(this, function() {
                  this._suggestDelay();
                })
              )
            );
            this.map &&
              this.map.infoWindow &&
              this.map.infoWindow.domNode &&
              this.enableInfoWindow &&
              (this.own(
                r(
                  this.map.infoWindow.domNode,
                  "#" + this._moreResultsId + "_show:click",
                  d.hitch(this, function(a) {
                    this._showMoreResultsClick(a);
                  })
                )
              ),
              this.own(
                r(
                  this.map.infoWindow.domNode,
                  "#" + this._moreResultsId + "_list li a:click",
                  d.hitch(this, function(a) {
                    this._moreResultsClick(a);
                  })
                )
              ),
              this.own(
                r(
                  this.map.infoWindow.domNode,
                  "#" +
                    this._moreResultsId +
                    " [data-switch-coordinates]:click",
                  d.hitch(this, function(a) {
                    this._switchCoordinatesClick(a);
                  })
                )
              ));
            this.value && this._checkStatus();
            this._hideMenus();
            this._updateVisible();
            this._insertSources(this.sources);
            this._setPlaceholder(this.activeSourceIndex);
            this._updateButtonMode(this.enableButtonMode);
            this.toggle(this.expanded);
          },
          destroy: function() {
            this.clear();
            q.empty(this.domNode);
            this.inherited(arguments);
          },
          clear: function() {
            this.clearGraphics();
            b.get(this.inputNode, "value") &&
              b.set(this.inputNode, "value", "");
            this._changeAttrValue("value", "");
            this.set("searchResults", null);
            this.set("suggestResults", null);
            this.set("selectedResult", null);
            this.set("magicKey", null);
            this.set("selectedFeatureId", null);
            a.remove(this.containerNode, this.css.hasValue);
            b.set(this.clearNode, "title", "");
            this._hideMenus();
            this._closePopup();
            this._hideLoading();
            this.emit("clear-search");
          },
          show: function() {
            k.set(this.domNode, "display", "block");
          },
          hide: function() {
            k.set(this.domNode, "display", "none");
          },
          expand: function() {
            this.enableButtonMode &&
              (a.add(this.containerNode, this.css.searchExpanded),
              a.remove(this.containerNode, this.css.searchCollapsed),
              this._hideMenus(),
              this.set("expanded", !0));
          },
          collapse: function() {
            this.enableButtonMode &&
              (a.remove(this.containerNode, this.css.searchExpanded),
              a.add(this.containerNode, this.css.searchCollapsed),
              this._hideMenus(),
              this.set("expanded", !1));
          },
          toggle: function(a) {
            this.enableButtonMode &&
              ("undefined" === typeof a && (a = !this.expanded),
              a ? this.expand() : this.collapse());
          },
          search: function(a) {
            var w = new x();
            this._mapLoaded().then(
              d.hitch(this, function() {
                this._searchDeferred(a).then(
                  d.hitch(this, function(a) {
                    var b = a.results;
                    this.set("searchResults", b);
                    0 === a.numResults &&
                      (this._noResults(a.value), this._showNoResultsMenu());
                    this._hideLoading();
                    this.emit("search-results", a);
                    this._selectFirstResult(b, a.activeSourceIndex);
                    w.resolve(b);
                  }),
                  d.hitch(this, function(a) {
                    w.reject(a);
                  })
                );
              })
            );
            return w.promise;
          },
          suggest: function(a) {
            var w = new x();
            this._mapLoaded().then(
              d.hitch(this, function() {
                this._suggestDeferred(a).then(
                  d.hitch(this, function(a) {
                    if (a) {
                      var b = a.results;
                      this.set("suggestResults", b);
                      this._insertSuggestions(b, a.value);
                      this.emit("suggest-results", a);
                      w.resolve(b);
                    }
                  }),
                  d.hitch(this, function(a) {
                    w.reject(a);
                  })
                );
              })
            );
            return w.promise;
          },
          select: function(a) {
            var w = this._getDefaultSymbol(a),
              b = this.labelSymbol,
              c,
              e = this.sources,
              g = this.activeSourceIndex,
              l = this.enableHighlight,
              k = this.enableLabel,
              f = this.autoNavigate,
              y = this.showInfoWindowOnSelect,
              D = this.enableInfoWindow,
              q = this.infoTemplate,
              m = a.feature ? new O(a.feature.toJson()) : null,
              F = m ? a.feature._sourceLayer : null;
            Z(m, F);
            if (g === this._allIndex) {
              var A = this._getSourceIndexOfResult(a);
              null !== A && ((c = e[A]), (g = A));
            } else c = e[g];
            c &&
              (c.hasOwnProperty("highlightSymbol") && (w = c.highlightSymbol),
              c.hasOwnProperty("labelSymbol") && (b = c.labelSymbol),
              c.hasOwnProperty("enableHighlight") && (l = c.enableHighlight),
              c.hasOwnProperty("enableLabel") && (k = c.enableLabel),
              c.hasOwnProperty("autoNavigate") && (f = c.autoNavigate),
              c.hasOwnProperty("showInfoWindowOnSelect") &&
                (y = c.showInfoWindowOnSelect),
              c.hasOwnProperty("enableInfoWindow") && (D = c.enableInfoWindow),
              c.hasOwnProperty("infoTemplate")
                ? (q = c.infoTemplate)
                : c.featureLayer &&
                  c.featureLayer.infoTemplate &&
                  (q = c.featureLayer.infoTemplate));
            this._hideMenus();
            this._hideLoading();
            if (m) {
              var e = this.highlightGraphic,
                G = this.graphicsLayer,
                A = this.labelGraphic,
                L = d.mixin({}, m.attributes, {
                  searchTheme: this.theme,
                  searchResult: this._searchResultHTML(a),
                  searchMoreResults: this.css.searchMoreResults,
                  searchMoreResultsItem: this.css.searchMoreResultsItem,
                  searchMoreResultsId: this._moreResultsId,
                  searchMoreResultsHtml: this._moreResultsHTML(a)
                }),
                r = null;
              D && (r = q);
              A
                ? (A.setGeometry(m.geometry),
                  A.setAttributes(L),
                  A.setSymbol(b),
                  b && "textsymbol" === b.type && A.symbol.setText(a.name))
                : ((A = new O(m.geometry, b, L)),
                  Z(A, F),
                  b && "textsymbol" === b.type && A.symbol.setText(a.name),
                  k &&
                    (G
                      ? G.add(A)
                      : this.map &&
                        this.map.graphics &&
                        this.map.graphics.add(A)));
              e
                ? (e.setGeometry(m.geometry),
                  e.setAttributes(L),
                  e.setInfoTemplate(r),
                  e.setSymbol(w))
                : ((e = new O(m.geometry, w, L, r)),
                  Z(e, F),
                  l &&
                    (G
                      ? G.add(e)
                      : this.map &&
                        this.map.graphics &&
                        this.map.graphics.add(e)));
              e &&
                e.symbol &&
                "textsymbol" === e.symbol.type &&
                e.symbol.setText(a.name);
              this.map &&
                this.map.infoWindow &&
                D &&
                y &&
                (this.map.infoWindow.setFeatures([e]),
                (w = this._getPointFromGeometry(e.geometry)),
                this.map.infoWindow.show(w));
              this.map &&
                f &&
                a &&
                a.hasOwnProperty("extent") &&
                "function" === typeof this.map.setExtent &&
                this.map.setExtent(a.extent, !0);
              this.set("highlightGraphic", e);
              this.set("labelGraphic", A);
            }
            this.set("selectedResult", a);
            this.emit("select-result", {
              result: a,
              source: c,
              sourceIndex: g
            });
          },
          focus: function() {
            C.focus(this.inputNode);
          },
          blur: function() {
            this.inputNode.blur();
            C.curNode && C.curNode.blur();
          },
          clearGraphics: function() {
            var a = this.highlightGraphic,
              b = this.graphicsLayer,
              d = this.labelGraphic;
            a &&
              (b
                ? b.remove(a)
                : this.map && this.map.graphics && this.map.graphics.remove(a));
            d &&
              (b
                ? b.remove(d)
                : this.map && this.map.graphics && this.map.graphics.remove(d));
            this.set("labelGraphic", null);
            this.set("highlightGraphic", null);
          },
          _mapLoaded: function() {
            var a = new x();
            if (this.map)
              if (this.map.loaded) a.resolve();
              else
                r.once(
                  this.map,
                  "load",
                  d.hitch(this, function() {
                    a.resolve();
                  })
                );
            else a.resolve();
            return a.promise;
          },
          _init: function() {
            this._getMapLayers().then(
              d.hitch(this, function() {
                this.set("loaded", !0);
                this.emit("load");
              })
            );
          },
          _clearButton: function() {
            this.clear();
            C.focus(this.inputNode);
          },
          _error: function(a) {
            return Error(this.declaredClass + " " + a);
          },
          _searchDeferred: function(a) {
            var b = new x(),
              w = this.value,
              c = this.activeSourceIndex;
            a && a.hasOwnProperty("index") && (c = a.index);
            this._showLoading();
            this._hideMenus();
            this._closePopup();
            this.clearGraphics();
            var e = { magicKey: this.magicKey, text: w };
            a
              ? "string" === typeof a
                ? ((e.text = a), (a = this._searchQueries(e)))
                : (a =
                    "object" === typeof a && a.hasOwnProperty("magicKey")
                      ? this._searchQueries(a)
                      : "object" === typeof a && a.hasOwnProperty("geometry")
                      ? this._searchQueries({ geometry: a })
                      : "object" === typeof a &&
                        a.hasOwnProperty(this._objectIdIdentifier)
                      ? this._searchQueries(a)
                      : "object" === typeof a && "point" === a.type
                      ? this._searchQueries({ point: a })
                      : a instanceof Array && 2 === a.length
                      ? this._searchQueries({ latlon: a })
                      : this._searchQueries(e))
              : (a = this._searchQueries(e));
            a.always(
              d.hitch(this, function(a) {
                a = this._formatResults(a, c, w);
                b.resolve(a);
              })
            );
            return b.promise;
          },
          _suggestDeferred: function(a) {
            var b = new x();
            this._deferreds.push(b);
            a || (a = this.value);
            var w = this.activeSourceIndex;
            this._suggestQueries({ text: a }).always(
              d.hitch(this, function(d) {
                var c;
                if (d) for (var e = 0; e < d.length; e++) d[e] && (c = !0);
                c
                  ? ((d = this._formatResults(d, w, a)), b.resolve(d))
                  : b.resolve();
              })
            );
            return b.promise;
          },
          _getDefaultSymbol: function(a) {
            var b, w, d, c;
            this.map && (c = this.map.getBasemap());
            c || (c = "topo");
            a &&
              a.feature &&
              a.feature.geometry &&
              (d = a.feature.geometry.type);
            "polyline" === d
              ? (d = "line")
              : "circle" === d || "extent" === d
              ? (d = "polygon")
              : "multipoint" === d && (d = "point");
            if (d) {
              if (
                (a = R.getSchemes({
                  theme: "default",
                  basemap: c,
                  geometryType: d
                }))
              )
                w = a.primaryScheme;
              if (w) {
                w.color &&
                  w.hasOwnProperty("opacity") &&
                  (w.color.a = w.opacity);
                b = w;
                a = w.color;
                w = w.size;
                var e;
                switch (d) {
                  case "point":
                    e = new V();
                    e.setColor(a);
                    e.setSize(null !== w ? w : b.size);
                    d = new Q();
                    d.setColor(b.outline.color);
                    d.setWidth(b.outline.width);
                    e.setOutline(d);
                    break;
                  case "line":
                    e = new Q();
                    e.setColor(a);
                    e.setWidth(null !== w ? w : b.width);
                    break;
                  case "polygon":
                    (e = new D()),
                      e.setColor(a),
                      (d = new Q()),
                      d.setColor(b.outline.color),
                      d.setWidth(b.outline.width),
                      e.setOutline(d);
                }
                b = e;
              }
            }
            return b;
          },
          _selectFirstResult: function(a, b) {
            if (this.autoSelect && a) {
              var w;
              b === this._allIndex
                ? (w = this._getFirstResult(a))
                : a[b] && a[b][0] && (w = a[b][0]);
              w && this.select(w);
            }
          },
          _getSourceIndexOfResult: function(a) {
            var b = this.searchResults;
            if (b)
              for (var w in b)
                if (b[w] && b[w].length)
                  for (var d = 0; d < b[w].length; d++)
                    if (b[w][d] === a) return parseInt(w, 10);
            return null;
          },
          _getFirstResult: function(a) {
            if (a) for (var b in a) if (a[b] && a[b][0]) return a[b][0];
            return !1;
          },
          _onFocus: function() {
            this.map &&
              "function" === typeof this.map.disableKeyboardNavigation &&
              this.map.disableKeyboardNavigation();
            this.emit("focus");
            this.inherited(arguments);
          },
          _onBlur: function() {
            this._hideMenus();
            this.map &&
              "function" === typeof this.map.enableKeyboardNavigation &&
              this.map.enableKeyboardNavigation();
            this.enableButtonMode && this.loaded && this.collapse();
            this.emit("blur");
            this.inherited(arguments);
          },
          _getMapLayers: function() {
            var a = new x();
            if (this.addLayersFromMap && this.map) {
              var b = [],
                c = this.map.graphicsLayerIds;
              if (c && c.length) {
                for (var e = 0; e < c.length; e++) {
                  var g = this.map.getLayer(c[e]);
                  g && b.push(this._featureLayerLoaded(g));
                }
                M(b).always(
                  d.hitch(this, function(b) {
                    for (var w, d = this.sources, c = 0; c < b.length; c++)
                      b[c] &&
                        b[c].loaded &&
                        "Feature Layer" === b[c].type &&
                        (d.push({ featureLayer: b[c], enableSuggestions: !0 }),
                        (w = !0));
                    w && this.set("sources", d);
                    a.resolve();
                  })
                );
              } else a.resolve();
            } else a.resolve();
            return a.promise;
          },
          _switchCoordinatesClick: function(a) {
            a.preventDefault();
            if ((a = b.get(a.target, "data-switch-coordinates")))
              this._cancelSuggest(), this.set("value", a), this.search();
          },
          _moreResultsClick: function(a) {
            a.preventDefault();
            var w = a.target;
            a = parseInt(b.get(w, "data-source-index"), 10);
            var w = parseInt(b.get(w, "data-index"), 10),
              d = this.searchResults;
            d && d[a] && (a = d[a][w]) && this.select(a);
          },
          _showMoreResultsClick: function(w) {
            w.preventDefault();
            if ((w = g.byId(this._moreResultsId))) {
              a.toggle(w, this.css.searchShowMoreResults);
              var d = g.byId(this._moreResultsId + "_show");
              d &&
                (a.contains(w, this.css.searchShowMoreResults)
                  ? b.set(
                      d,
                      "textContent",
                      e.widgets.Search.main.hideMoreResults
                    )
                  : b.set(
                      d,
                      "textContent",
                      e.widgets.Search.main.showMoreResults
                    ));
            }
          },
          _featureLayerLoaded: function(a) {
            var b = new x();
            if (a.loaded) b.resolve(a);
            else if (a.loadError)
              b.reject(this._error("Layer failed to load."));
            else {
              var w, c;
              w = r.once(
                a,
                "load",
                d.hitch(this, function() {
                  c.remove();
                  b.resolve(a);
                })
              );
              c = r.once(
                a,
                "error",
                d.hitch(this, function() {
                  w.remove();
                  b.reject(this._error("Layer could not be loaded."));
                })
              );
            }
            return b.promise;
          },
          _getObjectSize: function(a) {
            var b = 0,
              w;
            for (w in a) a.hasOwnProperty(w) && b++;
            return b;
          },
          _sourcesEvent: function(a, d) {
            var w = b.get(d, "data-index"),
              c = f("li", this.sourcesNode);
            d = u.indexOf(c, d);
            w !== this._allIndex && (w = parseInt(w, 10));
            "click" === a.type || a.keyCode === n.ENTER
              ? (this.set("activeSourceIndex", w),
                C.focus(this.inputNode),
                this._hideSourcesMenu())
              : a.keyCode === n.UP_ARROW
              ? (a.stopPropagation(),
                a.preventDefault(),
                (a = d - 1),
                0 > a ? C.focus(this.sourcesBtnNode) : C.focus(c[a]))
              : a.keyCode === n.DOWN_ARROW
              ? (a.stopPropagation(),
                a.preventDefault(),
                (a = d + 1),
                a >= c.length ? C.focus(this.sourcesBtnNode) : C.focus(c[a]))
              : a.keyCode === n.ESCAPE &&
                (this._hideSourcesMenu(), C.focus(this.inputNode));
          },
          _suggestionsEvent: function(a, d) {
            var w = b.get(d, "data-source-index"),
              c = parseInt(b.get(d, "data-index"), 10),
              e = f("li", this.suggestionsNode),
              g = this.sources;
            d = u.indexOf(e, d);
            w !== this._allIndex && (w = parseInt(w, 10));
            var l;
            this._clearQueryTimeout();
            "click" === a.type || a.keyCode === n.ENTER
              ? ((e = this.suggestResults) && e[w] && e[w][c] && (l = e[w][c]),
                l &&
                  ((l.index = w),
                  g[w].featureLayer
                    ? ((w = g[w].featureLayer.objectIdField),
                      (l[this._objectIdIdentifier] = l.feature.attributes[w]),
                      this.set("value", this._getSuggestionName(l)),
                      this.set("selectedFeatureId", l.feature.attributes[w]))
                    : l.magicKey &&
                      l.text &&
                      (this.set("value", l.text),
                      this.set("magicKey", l.magicKey)),
                  this.search(l),
                  C.focus(this.inputNode)))
              : a.keyCode === n.BACKSPACE || a.keyCode === n.DELETE
              ? C.focus(this.inputNode)
              : a.keyCode === n.UP_ARROW
              ? (a.stopPropagation(),
                a.preventDefault(),
                (l = d - 1),
                0 > l ? C.focus(this.inputNode) : C.focus(e[l]))
              : a.keyCode === n.DOWN_ARROW
              ? (a.stopPropagation(),
                a.preventDefault(),
                (l = d + 1),
                l >= e.length ? C.focus(this.inputNode) : C.focus(e[l]))
              : a.keyCode === n.ESCAPE &&
                (this._hideMenus(), C.focus(this.inputNode));
          },
          _getResultName: function(a) {
            var b;
            a.hasOwnProperty("name") &&
              null !== a.name &&
              (b = a.name.toString());
            b || (b = e.widgets.Search.main.untitledResult);
            return b;
          },
          _getSuggestionName: function(a) {
            var b;
            a.hasOwnProperty("name") &&
              null !== a.name &&
              (b = a.name.toString());
            a = a.text || b;
            a || (a = e.widgets.Search.main.untitledResult);
            return a;
          },
          _searchResultHTML: function(a) {
            var b = "";
            if (
              a.feature &&
              a.feature.attributes &&
              a.feature.attributes.Addr_type &&
              "LatLong" === a.feature.attributes.Addr_type
            ) {
              var d = a.name.split(" "),
                c,
                w;
              2 === d.length && ((c = d[0]), (w = d[1]));
              w && c
                ? ((a = parseFloat(c)),
                  (w = parseFloat(w)),
                  (d = w + ", " + a),
                  (b +=
                    '\x3cdiv class\x3d"' +
                    this.css.searchMoreResultsItem +
                    '"\x3e'),
                  (b +=
                    '\x3cdiv class\x3d"' +
                    this.css.latLonHeader +
                    '"\x3e' +
                    e.widgets.Search.main.lonlat +
                    "\x3c/div\x3e"),
                  (b =
                    b +
                    (a + ", " + w) +
                    "\x3c/div\x3e" +
                    ('\x3cdiv class\x3d"' +
                      this.css.searchMoreResultsItem +
                      '"\x3e')),
                  a === w ||
                    90 < a ||
                    -90 > a ||
                    180 < w ||
                    -180 > w ||
                    ((b +=
                      '\x3cdiv class\x3d"' +
                      this.css.latLonHeader +
                      '"\x3e' +
                      e.widgets.Search.main.reverseLonLatHeader +
                      "\x3c/div\x3e"),
                    (b =
                      b +
                      ('\x3ca data-switch-coordinates\x3d"' +
                        d +
                        '" tabindex\x3d"0" href\x3d"#"\x3e' +
                        d +
                        "\x3c/a\x3e") +
                      "\x3c/div\x3e")))
                : (b = a.name);
            } else b = a.name;
            return b;
          },
          _moreResultsHTML: function(a) {
            var b = "",
              d = "",
              c = this.searchResults,
              w = this.sources,
              g = 0;
            if (c) {
              var d =
                  d +
                  ('\x3cdiv class\x3d"' +
                    this.css.searchMoreResultsItem +
                    '"\x3e'),
                d =
                  d +
                  ('\x3ca href\x3d"#" id\x3d"' +
                    this._moreResultsId +
                    '_show"\x3e' +
                    e.widgets.Search.main.showMoreResults +
                    "\x3c/a\x3e"),
                d =
                  d +
                  "\x3c/div\x3e" +
                  ('\x3cdiv class\x3d"' +
                    this.css.searchMoreResultsList +
                    '"\x3e'),
                d =
                  d + ('\x3cdiv id\x3d"' + this._moreResultsId + '_list"\x3e'),
                l;
              for (l in c)
                if (c[l]) {
                  var k = c[l].length;
                  if (k) {
                    var f = 1 === k && c[l][0] === a;
                    if (1 < this._getObjectSize(c) && !f)
                      var y = this._getSourceName(l),
                        d =
                          d +
                          ('\x3cdiv class\x3d"' +
                            this.css.searchMoreResultsListHeader +
                            '"\x3e' +
                            y +
                            "\x3c/div\x3e");
                    if (k && !f) {
                      d += "\x3cul\x3e";
                      y = w[l].maxResults || this.maxResults;
                      for (f = 0; f < k && f < y; ++f)
                        if (c[l][f] !== a) {
                          var m = this._getResultName(c[l][f]),
                            d =
                              d +
                              ('\x3cli\x3e\x3ca tabindex\x3d"0" data-index\x3d"' +
                                f +
                                '" data-source-index\x3d"' +
                                l +
                                '" href\x3d"#"\x3e' +
                                m +
                                "\x3c/a\x3e\x3c/li\x3e");
                          g++;
                        }
                      d += "\x3c/ul\x3e";
                    }
                  }
                }
              d += "\x3c/div\x3e\x3c/div\x3e";
            }
            g && (b += d);
            return b;
          },
          _validField: function(a, b) {
            return a.getField(b);
          },
          _validFields: function(a, b) {
            if (a && b && b.length) {
              for (var d = 0; d < b.length; d++)
                if (!this._validField(a, b[d])) return !1;
              return !0;
            }
            return !1;
          },
          _getCodedName: function(a, b) {
            if (a && a.length)
              for (var d = 0, c = a.length; d < c; d++) {
                var e = a[d];
                if (e.code === b) return e.name;
              }
          },
          _getCodedValue: function(a, b, d) {
            if (a && a.length)
              for (var c = 0, e = a.length; c < e; c++) {
                var w = a[c],
                  l = w.name,
                  g = b;
                d || ((l = l.toLowerCase()), (g = g.toLowerCase()));
                if (l === g) return w.code;
              }
            return !1;
          },
          _whereClause: function(a, b, d, c) {
            var e = null;
            if (a) {
              var w = "";
              this.reHostedFS.test(b.url) &&
                this._containsNonLatinCharacter(a) &&
                (w = "N");
              if (d && d.length)
                for (var l = 0, g = d.length; l < g; l++) {
                  var k = "",
                    f = a.replace(/\'/g, "''"),
                    k = d[l],
                    y = b.getField(k),
                    m = b.getDomain(k);
                  m &&
                    "codedValue" === m.type &&
                    (f = this._getCodedValue(m.codedValues, f, c));
                  !1 !== f &&
                    ((y = y.type),
                    "esriFieldTypeString" === y || "esriFieldTypeDate" === y
                      ? (k = c
                          ? k + " \x3d " + w + "'" + f + "'"
                          : "UPPER(" +
                            k +
                            ") LIKE " +
                            w +
                            "'%" +
                            f.toUpperCase() +
                            "%'")
                      : "esriFieldTypeOID" === y ||
                        "esriFieldTypeSmallInteger" === y ||
                        "esriFieldTypeInteger" === y ||
                        "esriFieldTypeSingle" === y ||
                        "esriFieldTypeDouble" === y
                      ? ((f = parseFloat(f)),
                        (k = isNaN(f) ? !1 : k + " \x3d " + f))
                      : (k = k + " \x3d " + f),
                    k && ((e = e ? e + " or " : ""), (e += k)));
                }
            }
            return e;
          },
          _suggest: function(a) {
            a || (a = { index: this.activeSourceIndex, text: this.value });
            var b = new x(),
              c = a.index,
              e = this.sources[c],
              w = this.enableSuggestions;
            e.hasOwnProperty("enableSuggestions") && (w = e.enableSuggestions);
            var l = 0,
              g;
            a.hasOwnProperty("text") &&
              a.text &&
              ((g = d.trim(a.text)), (l = a.text.length));
            a = e.minCharacters || this.minCharacters;
            if (w && g && l >= a && this._supportsPagination(e)) {
              var k = "";
              e.prefix && (k += e.prefix);
              k += g;
              e.suffix && (k += e.suffix);
              var f = this._defaultSR;
              this.map && (f = this.map.spatialReference);
              w = {};
              e.locator
                ? (e.categories && (w.categories = e.categories),
                  (e.locator.outSpatialReference = f),
                  this.map &&
                    e.localSearchOptions &&
                    e.localSearchOptions.hasOwnProperty("distance") &&
                    e.localSearchOptions.hasOwnProperty("minScale") &&
                    ((l = this._getScale()),
                    !e.localSearchOptions.minScale ||
                      (l && l <= parseFloat(e.localSearchOptions.minScale))) &&
                    ((w.location = this.map.extent.getCenter()),
                    (w.distance = e.localSearchOptions.distance)),
                  (w.text = k),
                  e.useMapExtent &&
                    this.map &&
                    this.map.extent &&
                    (w.searchExtent = this.map.extent),
                  e.searchExtent && (w.searchExtent = e.searchExtent),
                  (w.maxSuggestions = e.maxSuggestions || this.maxSuggestions),
                  e.sourceCountry && (w.countryCode = e.sourceCountry),
                  e.countryCode && (w.countryCode = e.countryCode),
                  e.locator.suggestLocations(w).then(
                    d.hitch(this, function(a) {
                      b.resolve(a);
                    }),
                    d.hitch(this, function(a) {
                      a ||
                        (a = this._error(
                          "Locator suggestLocations could not be performed."
                        ));
                      b.reject(a);
                    })
                  ))
                : e.featureLayer
                ? this._featureLayerLoaded(e.featureLayer).then(
                    d.hitch(this, function() {
                      var a = this._getDisplayField(e),
                        w = e.searchFields || [a],
                        l = [];
                      e.suggestionTemplate
                        ? e.suggestionTemplate.replace(
                            /(?:\$\{([^}]+)\})/g,
                            function(a, b) {
                              l.push(b);
                            }
                          )
                        : (l = [a]);
                      -1 === u.indexOf(l, e.featureLayer.objectIdField) &&
                        l.push(e.featureLayer.objectIdField);
                      var a = this._validField(e.featureLayer, a),
                        g = this._validFields(e.featureLayer, l),
                        y = this._validFields(e.featureLayer, w);
                      if (a && g && y) {
                        a = new U();
                        e.hasOwnProperty("suggestQueryParams") &&
                          d.mixin(a, e.suggestQueryParams);
                        a.outSpatialReference = f;
                        a.returnGeometry = !1;
                        a.num = e.maxSuggestions || this.maxSuggestions;
                        a.outFields = l;
                        e.useMapExtent &&
                          this.map &&
                          this.map.extent &&
                          (a.geometry = this.map.extent);
                        e.searchExtent && (a.geometry = e.searchExtent);
                        var m;
                        if ((w = this._whereClause(k, e.featureLayer, w, !1)))
                          (a.where = w), (m = !0);
                        m
                          ? e.featureLayer.queryFeatures(
                              a,
                              d.hitch(this, function(a) {
                                var d;
                                (a = a.features) &&
                                  (d = this._hydrateResults(a, c, !0));
                                b.resolve(d);
                              }),
                              d.hitch(this, function(a) {
                                a ||
                                  (a = this._error(
                                    "FeatureLayer queryFeatures errored with suggestions"
                                  ));
                                b.reject(a);
                              })
                            )
                          : b.resolve();
                      } else b.reject(this._error("Invalid FeatureLayer field"));
                    })
                  )
                : b.reject(this._error("Invalid source"));
            } else b.resolve();
            return b.promise;
          },
          _supportsPagination: function(a) {
            var b;
            a.locator
              ? (b = !0)
              : a.featureLayer &&
                a.featureLayer.advancedQueryCapabilities &&
                a.featureLayer.advancedQueryCapabilities.supportsPagination &&
                (b = !0);
            return b;
          },
          _suggestQueries: function(a) {
            var b = this.sources,
              d = this.activeSourceIndex,
              e = [],
              c;
            if (d === this._allIndex)
              for (d = 0; d < b.length; d++)
                (c = a), (c.index = d), (c = this._suggest(c)), e.push(c);
            else (a.index = d), (c = this._suggest(a)), e.push(c);
            return M(e);
          },
          _getPointFromGeometry: function(a) {
            var b;
            switch (a.type) {
              case "extent":
                b = a.getCenter();
                break;
              case "multipoint":
                b = a.getPoint(0);
                break;
              case "point":
                b = a;
                break;
              case "polygon":
                b = a.getCentroid();
                break;
              case "polyline":
                b = a.getPoint(0, 0);
            }
            return b;
          },
          _searchQueries: function(a) {
            a.hasOwnProperty("index") || (a.index = this.activeSourceIndex);
            var b = [],
              d;
            if (a.index === this._allIndex)
              for (var e = this.sources, c = 0; c < e.length; c++)
                (d = a), (d.index = c), (d = this._search(d)), b.push(d);
            else (a = this._search(a)), b.push(a);
            return M(b);
          },
          _searchButton: function() {
            this.enableButtonMode && !this.expanded
              ? (this.expand(), C.focus(this.inputNode))
              : (this._cancelSuggest(), this.search());
          },
          _search: function(a) {
            a ||
              (a = {
                text: this.value,
                magicKey: null,
                geometry: null,
                point: null,
                index: this.activeSourceIndex,
                latlon: null
              });
            this.selectedFeatureId &&
              ((a.text = null),
              (a[this._objectIdIdentifier] = this.selectedFeatureId));
            var b,
              e = new x(),
              c = a.index,
              l = this.sources[c],
              g;
            a.hasOwnProperty("text") && a.text && (g = d.trim(a.text));
            if (l) {
              var w = "";
              l.prefix && !a.magicKey && (w += l.prefix);
              w += g;
              l.suffix && !a.magicKey && (w += l.suffix);
              var k = this._defaultSR;
              this.map && (k = this.map.spatialReference);
              if (l.locator)
                if (a.hasOwnProperty("text") && g) {
                  var f = {};
                  l.categories && (f.categories = l.categories);
                  l.locationType && (f.locationType = l.locationType);
                  k && (l.locator.outSpatialReference = k);
                  if (
                    this.map &&
                    l.localSearchOptions &&
                    l.localSearchOptions.hasOwnProperty("distance") &&
                    l.localSearchOptions.hasOwnProperty("minScale")
                  ) {
                    var y = this._getScale();
                    if (
                      !l.localSearchOptions.minScale ||
                      (y && y <= parseFloat(l.localSearchOptions.minScale))
                    )
                      (f.location = this.map.extent.getCenter()),
                        (f.distance = l.localSearchOptions.distance);
                  }
                  f.address = {};
                  f.maxLocations = l.maxResults || this.maxResults;
                  l.useMapExtent &&
                    this.map &&
                    this.map.extent &&
                    (f.searchExtent = this.map.extent);
                  l.searchExtent && (f.searchExtent = l.searchExtent);
                  l.sourceCountry && (f.countryCode = l.sourceCountry);
                  l.countryCode && (f.countryCode = l.countryCode);
                  a.magicKey && (f.magicKey = a.magicKey);
                  l.singleLineFieldName
                    ? (f.address[l.singleLineFieldName] = w)
                    : (f.address["Single Line Input"] = w);
                  l.outFields && (f.outFields = l.outFields);
                  l.locator.addressToLocations(f).then(
                    d.hitch(this, function(a) {
                      a = this._hydrateResults(a, c, !1);
                      e.resolve(a);
                    }),
                    d.hitch(this, function(a) {
                      a ||
                        (a = this._error(
                          "Locator addressToLocations could not be performed"
                        ));
                      e.reject(a);
                    })
                  );
                } else
                  a.geometry
                    ? (b = this._getPointFromGeometry(a.geometry.geometry))
                      ? this._reverseGeocodePoint(c, b).then(
                          function(a) {
                            e.resolve(a);
                          },
                          function(a) {
                            e.reject(a);
                          }
                        )
                      : e.reject(
                          this._error("Invalid point to reverse geocode")
                        )
                    : a.point
                    ? this._reverseGeocodePoint(c, a.point).then(
                        function(a) {
                          e.resolve(a);
                        },
                        function(a) {
                          e.reject(a);
                        }
                      )
                    : a.latlon
                    ? ((f = new K(a.latlon, this._defaultSR)),
                      this._reverseGeocodePoint(c, f).then(
                        function(a) {
                          e.resolve(a);
                        },
                        function(a) {
                          e.reject(a);
                        }
                      ))
                    : a.hasOwnProperty("text") && !g
                    ? e.resolve([])
                    : e.reject(this._error("Invalid query type for Locator"));
              else
                l.featureLayer
                  ? this._featureLayerLoaded(l.featureLayer).then(
                      d.hitch(this, function() {
                        var f = this._getDisplayField(l),
                          y = l.searchFields || [f],
                          f = this._validField(l.featureLayer, f),
                          m = this._validFields(l.featureLayer, y);
                        if (f && m) {
                          f = new U();
                          l.hasOwnProperty("searchQueryParams") &&
                            d.mixin(f, l.searchQueryParams);
                          k &&
                            ((f.outSpatialReference = k),
                            (m =
                              (this.map && this.map.getMaxResolution()) ||
                              1 / aa.getUnitValueForSR(k))) &&
                            (f.maxAllowableOffset = m);
                          f.returnGeometry = !0;
                          l.outFields && (f.outFields = l.outFields);
                          var D;
                          a.hasOwnProperty(this._objectIdIdentifier) ||
                            (this._supportsPagination(l) &&
                              (f.num = l.maxResults || this.maxResults),
                            l.useMapExtent &&
                              this.map &&
                              this.map.extent &&
                              (f.geometry = this.map.extent),
                            l.searchExtent && (f.geometry = l.searchExtent),
                            (D = l.exactMatch));
                          a.hasOwnProperty("text") && g
                            ? (y = this._whereClause(w, l.featureLayer, y, D))
                              ? ((f.where = y), (y = !0))
                              : (y = !1)
                            : a.hasOwnProperty(this._objectIdIdentifier)
                            ? ((f.objectIds = [a[this._objectIdIdentifier]]),
                              (y = !0))
                            : a.geometry
                            ? ((f.geometry = a.geometry), (y = !0))
                            : a.point
                            ? ((f.geometry = a.point), (y = !0))
                            : a.latlon
                            ? ((b = new K(a.latlon, this._defaultSR)),
                              (f.geometry = b),
                              (y = !0))
                            : (a.hasOwnProperty("text") && !g
                                ? e.resolve([])
                                : e.reject(
                                    this._error(
                                      "Invalid query type for FeatureLayer"
                                    )
                                  ),
                              (y = !1));
                          y
                            ? l.featureLayer.queryFeatures(
                                f,
                                d.hitch(this, function(a) {
                                  a = a.features;
                                  var b;
                                  a && (b = this._hydrateResults(a, c, !1));
                                  e.resolve(b);
                                }),
                                d.hitch(this, function(a) {
                                  a ||
                                    (a = this._error(
                                      "FeatureLayer queryFeatures could not be performed"
                                    ));
                                  e.reject(a);
                                })
                              )
                            : e.resolve();
                        } else e.reject(this._error("Invalid FeatureLayer field"));
                      })
                    )
                  : e.reject(this._error("Invalid source"));
            } else e.reject(this._error("Source is undefined"));
            return e.promise;
          },
          _clearQueryTimeout: function() {
            this._queryTimer && clearTimeout(this._queryTimer);
          },
          _formatResults: function(a, b, d) {
            d = {
              activeSourceIndex: b,
              value: d,
              numResults: 0,
              numErrors: 0,
              errors: null,
              results: null
            };
            var e = {},
              c = {};
            if (a)
              if (b === this._allIndex)
                for (b = 0; b < a.length; b++)
                  a[b] &&
                    (a[b] instanceof Error
                      ? ((e[b] = a[b]), d.numErrors++)
                      : ((c[b] = a[b]), (d.numResults += a[b].length)));
              else
                a[0] &&
                  (a[0] instanceof Error
                    ? ((e[b] = a[0]), d.numErrors++)
                    : ((c[b] = a[0]), (d.numResults += a[0].length)));
            d.numErrors && (d.errors = e);
            d.numResults && (d.results = c);
            return d;
          },
          _reverseGeocodePoint: function(a, b) {
            var e = new x(),
              c = this.sources[a];
            if (b && c) {
              var l =
                c.locationToAddressDistance || this.locationToAddressDistance;
              c.locator.outSpatialReference = this._defaultSR;
              this.map &&
                (c.locator.outSpatialReference = this.map.spatialReference);
              c.locator.locationToAddress(
                b,
                l,
                d.hitch(this, function(b) {
                  b = this._hydrateResults([b], a, !1);
                  e.resolve(b);
                }),
                d.hitch(this, function(a) {
                  a ||
                    (a = this._error(
                      "Locator locationToAddress could not be performed"
                    ));
                  e.reject(a);
                })
              );
            } else
              e.reject(
                this._error("No point or source defined for reverse geocoding")
              );
            return e.promise;
          },
          _cancelDeferreds: function() {
            if (this._deferreds && this._deferreds.length)
              for (var a = 0; a < this._deferreds.length; a++)
                this._deferreds[a].cancel(
                  this.declaredClass + " cancelling request"
                );
            this._deferreds = [];
          },
          _sourceBtnKey: function(a) {
            if (a) {
              var b = f("li", this.sourcesNode);
              a.keyCode === n.UP_ARROW
                ? (a.stopPropagation(),
                  a.preventDefault(),
                  this._showSourcesMenu(),
                  (a = b.length) && C.focus(b[a - 1]))
                : a.keyCode === n.DOWN_ARROW &&
                  (a.stopPropagation(),
                  a.preventDefault(),
                  this._showSourcesMenu(),
                  b[0] && C.focus(b[0]));
            }
          },
          _inputKey: function(a) {
            if (a) {
              var b = f("li", this.suggestionsNode),
                d = this.suggestResults;
              if (a.keyCode === n.TAB || a.keyCode === n.ESCAPE)
                this._cancelSuggest(), this._hideMenus();
              else if (a.keyCode === n.UP_ARROW)
                a.stopPropagation(),
                  a.preventDefault(),
                  this._cancelSuggest(),
                  d && this._showSuggestionsMenu(),
                  (a = b.length) && C.focus(b[a - 1]);
              else if (a.keyCode === n.DOWN_ARROW)
                a.stopPropagation(),
                  a.preventDefault(),
                  this._cancelSuggest(),
                  d && this._showSuggestionsMenu(),
                  b[0] && C.focus(b[0]);
              else {
                if (
                  a.ctrlKey ||
                  a.metaKey ||
                  a.keyCode === n.copyKey ||
                  a.keyCode === n.LEFT_ARROW ||
                  a.keyCode === n.RIGHT_ARROW ||
                  a.keyCode === n.ENTER
                )
                  return a;
                this._suggestDelay();
              }
            }
          },
          _cancelSuggest: function() {
            this._cancelDeferreds();
            this._clearQueryTimeout();
          },
          _suggestDelay: function() {
            this._cancelSuggest();
            this._changeValue();
            this._queryTimer = setTimeout(
              d.hitch(this, function() {
                this.suggest();
              }),
              this.suggestionDelay
            );
          },
          _changeValue: function() {
            this.set("magicKey", null);
            this.set("selectedFeatureId", null);
            this._changeAttrValue("value", this.inputNode.value);
            this._checkStatus();
          },
          _inputClick: function() {
            this._hideSourcesMenu();
            this._hideNoResultsMenu();
          },
          _getSourceName: function(a) {
            return this._sourceNames[a];
          },
          _loadSources: function(a) {
            a = u.filter(a, function(a) {
              return !!a.featureLayer;
            });
            a = u.map(
              a,
              function(a) {
                return this._featureLayerLoaded(a.featureLayer);
              },
              this
            );
            return M(a);
          },
          _createSourceNameMap: function(a) {
            return this._loadSources(a).then(
              d.hitch(this, function() {
                var b = u.map(a, function(a) {
                  return (
                    a.name ||
                    (a.featureLayer && a.featureLayer.name) ||
                    e.widgets.Search.main.untitledSource
                  );
                });
                this._preventDuplicateSourceNames(a, b);
                return b;
              })
            );
          },
          _getDuplicateSourceNameIndexes: function(a) {
            var b = {},
              d = [];
            u.forEach(a, function(e, c) {
              b.hasOwnProperty(e)
                ? (-1 === d.indexOf(b[e]) && d.push(b[e]), d.push(c))
                : a.lastIndexOf(e) !== c && (b[e] = c);
            });
            return d;
          },
          _preventDuplicateSourceNames: function(a, b) {
            if (b && 1 < b.length) {
              var d = this._getDuplicateSourceNameIndexes(b);
              u.forEach(
                d,
                function(d) {
                  b[d] += this._getFieldsString(a[d]);
                },
                this
              );
            }
          },
          _getFieldsString: function(a) {
            var b = "",
              d = a.featureLayer;
            if (d) {
              a = a.searchFields || [this._getDisplayField(a)];
              for (var e = 0; e < a.length; e++)
                var b = 0 === e ? b + ": " : b + ", ",
                  c = a[e],
                  l = d.getFieldLabel(c),
                  b = b + (l || c);
            }
            return b;
          },
          _splitResult: function(a, b) {
            b = F.escapeString(b);
            return a
              .replace(new RegExp("(^|)(" + b + ")(|$)", "ig"), "$1|$2|$3")
              .split("|");
          },
          _insertSuggestions: function(a, b) {
            if (this.enableSuggestionsMenu && this.suggestionsNode) {
              this._hideSourcesMenu();
              this._hideNoResultsMenu();
              var d,
                e = this.sources;
              if (a) {
                d = q.create("div");
                for (var c in a)
                  if (a[c] && a[c].length) {
                    var l = this._getSourceName(c);
                    1 < e.length &&
                      this.activeSourceIndex === this._allIndex &&
                      q.create(
                        "div",
                        {
                          className: this.css.searchMenuHeader,
                          textContent: l
                        },
                        d
                      );
                    for (
                      var l = q.create("ul", { role: "menu" }, d),
                        f = e[c].maxSuggestions || this.maxSuggestions,
                        g = 0;
                      g < a[c].length && g < f;
                      ++g
                    )
                      for (
                        var k = q.create(
                            "li",
                            {
                              "data-index": g,
                              "data-source-index": c,
                              role: "menuitem",
                              tabindex: 0
                            },
                            l
                          ),
                          y = this._getSuggestionName(a[c][g]),
                          y = this._splitResult(y, b),
                          w = y.length,
                          m = 0;
                        m < w;
                        m++
                      ) {
                        var D = y[m];
                        D.toLowerCase() === b.toLowerCase()
                          ? q.create("strong", { textContent: D }, k)
                          : ((D = document.createTextNode(D)), q.place(D, k));
                      }
                  }
              }
              d
                ? (q.place(d, this.suggestionsNode, "only"),
                  this._showSuggestionsMenu())
                : (q.empty(this.suggestionsNode), this._hideSuggestionsMenu());
            }
          },
          _insertSources: function(b) {
            if (this.enableSourcesMenu && b && 1 < b.length) {
              var d,
                c,
                l = this.activeSourceIndex,
                g = q.create("ul", { role: "menu" });
              this.enableSearchingAll &&
                ((d = ""),
                l === this._allIndex && (d = "active"),
                q.create(
                  "li",
                  {
                    "data-index": this._allIndex,
                    role: "menuitem",
                    className: d,
                    tabIndex: 0,
                    textContent: e.widgets.Search.main.all
                  },
                  g
                ));
              for (c = 0; c < b.length; c++) {
                d = "";
                c === l && (d = this.css.activeSource);
                var f = this._getSourceName(c);
                q.create(
                  "li",
                  {
                    "data-index": c,
                    role: "menuitem",
                    className: d,
                    tabIndex: 0,
                    textContent: f
                  },
                  g
                );
              }
              a.add(this.containerNode, this.css.hasMultipleSources);
              q.place(g, this.sourcesNode, "only");
            } else
              a.remove(this.containerNode, this.css.hasMultipleSources),
                q.empty(this.sourcesNode);
          },
          _showLoading: function() {
            a.add(this.containerNode, this.css.searchLoading);
          },
          _hideLoading: function() {
            a.remove(this.containerNode, this.css.searchLoading);
          },
          _checkStatus: function() {
            this.value
              ? (a.add(this.containerNode, this.css.hasValue),
                b.set(
                  this.clearNode,
                  "title",
                  e.widgets.Search.main.clearButtonTitle
                ))
              : this.clear();
          },
          _closePopup: function() {
            this.enableInfoWindow &&
              this.map &&
              this.map.infoWindow &&
              this.map.infoWindow.hide();
          },
          _noResults: function(a) {
            var b;
            a && (b = d.trim(a));
            var c = q.create("div", {
              className: this.css.searchNoResultsBody
            });
            a && b
              ? (q.create(
                  "div",
                  {
                    className: this.css.searchNoResultsHeader,
                    textContent: e.widgets.Search.main.noResults
                  },
                  c
                ),
                q.create(
                  "div",
                  {
                    className: this.css.searchNoResultsText,
                    textContent: G.substitute(
                      { value: '"' + a + '"' },
                      e.widgets.Search.main.noResultsFound
                    )
                  },
                  c
                ))
              : ((a = q.create("div", {}, c)),
                q.create(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: this.css.searchNoValueIcon
                  },
                  a
                ),
                q.create(
                  "span",
                  {
                    className: this.css.searchNoValueText,
                    textContent: e.widgets.Search.main.emptyValue
                  },
                  a
                ));
            q.place(c, this.noResultsMenuNode, "only");
          },
          _hideMenus: function() {
            this._hideSourcesMenu();
            this._hideSuggestionsMenu();
            this._hideNoResultsMenu();
          },
          _hideNoResultsMenu: function() {
            a.remove(this.containerNode, this.css.showNoResults);
          },
          _showNoResultsMenu: function() {
            this._hideSourcesMenu();
            this._hideSuggestionsMenu();
            a.add(this.containerNode, this.css.showNoResults);
          },
          _hideSourcesMenu: function() {
            a.remove(this.containerNode, this.css.showSources);
          },
          _hideSuggestionsMenu: function() {
            a.remove(this.containerNode, this.css.showSuggestions);
          },
          _showSourcesMenu: function() {
            this._hideSuggestionsMenu();
            this._hideNoResultsMenu();
            a.add(this.containerNode, this.css.showSources);
          },
          _showSuggestionsMenu: function() {
            this._hideSourcesMenu();
            this._hideNoResultsMenu();
            a.add(this.containerNode, this.css.showSuggestions);
          },
          _toggleSourcesMenu: function() {
            this._hideSuggestionsMenu();
            this._hideNoResultsMenu();
            a.toggle(this.containerNode, this.css.showSources);
          },
          _getFirstStringField: function(a) {
            if (a && (a = a.fields) && a.length)
              for (var b = 0; b < a.length; b++) {
                var d = a[b];
                if ("esriFieldTypeString" === d.type) return d.name;
              }
            return "";
          },
          _getDisplayField: function(a) {
            return (
              a.displayField ||
              a.featureLayer.displayField ||
              this._getFirstStringField(a.featureLayer)
            );
          },
          _validLocation: function(a) {
            return a && "number" === typeof a.x && "number" === typeof a.y;
          },
          _validExtent: function(a) {
            return (
              a &&
              "number" === typeof a.xmin &&
              "number" === typeof a.ymin &&
              "number" === typeof a.xmax &&
              "number" === typeof a.ymax
            );
          },
          _hydrateResult: function(a, b, e) {
            var c = {},
              l = this._defaultSR,
              g;
            b = this.sources[b];
            this.map && (l = this.map.spatialReference);
            if (a.hasOwnProperty("text") && a.hasOwnProperty("magicKey"))
              return a;
            if (a.hasOwnProperty("geometry"))
              (g = new O(a.toJson())),
                (c.feature = g),
                (g = c.feature.geometry) && g.setSpatialReference(l);
            else if (
              a.hasOwnProperty("location") &&
              this._validLocation(a.location)
            ) {
              var f = new K(a.location.x, a.location.y, l);
              g = {};
              a.hasOwnProperty("attributes") && (g = a.attributes);
              a.hasOwnProperty("address") &&
                "object" === typeof a.address &&
                d.mixin(g, a.address);
              a.hasOwnProperty("score") && (g.score = a.score);
              c.feature = new O(f, null, g, null);
            }
            !c.feature &&
              e &&
              ((g = {}),
              a.hasOwnProperty("attributes") && (g = a.attributes),
              a.hasOwnProperty("score") && (g.score = a.score),
              (c.feature = new O(null, null, g, null)));
            if (c.feature) {
              if (a.hasOwnProperty("extent") && this._validExtent(a.extent))
                (c.extent = new da(a.extent)), c.extent.setSpatialReference(l);
              else if (c.feature && c.feature.geometry)
                switch (c.feature.geometry.type) {
                  case "extent":
                    c.extent = c.feature.geometry;
                    break;
                  case "multipoint":
                    c.extent = W.getDenormalizedExtent(c.feature.geometry);
                    break;
                  case "polygon":
                    c.extent = W.getDenormalizedExtent(c.feature.geometry);
                    break;
                  case "polyline":
                    c.extent = W.getDenormalizedExtent(c.feature.geometry);
                    break;
                  case "point":
                    this.map
                      ? ((l = this.zoomScale),
                        b && b.zoomScale && (l = b.zoomScale),
                        this._getScale() > l
                          ? (c.extent = aa
                              .getExtentForScale(this.map, l)
                              .centerAt(c.feature.geometry))
                          : (c.extent = this.map.extent.centerAt(
                              c.feature.geometry
                            )))
                      : (c.extent = new da({
                          xmin: c.feature.geometry.x - 0.25,
                          ymin: c.feature.geometry.y - 0.25,
                          xmax: c.feature.geometry.x + 0.25,
                          ymax: c.feature.geometry.y + 0.25,
                          spatialReference: this._defaultSR
                        }));
                }
              else c.extent = null;
              c.name = "";
              b.featureLayer
                ? b.suggestionTemplate && e
                  ? (c.name = G.substitute(a.attributes, b.suggestionTemplate))
                  : b.searchTemplate
                  ? (c.name = G.substitute(a.attributes, b.searchTemplate))
                  : ((g = this._getDisplayField(b)),
                    (e = b.featureLayer.getField(g)),
                    (l = b.featureLayer.getDomain(g)),
                    g &&
                      a.hasOwnProperty("attributes") &&
                      a.attributes.hasOwnProperty(g) &&
                      ((a = a.attributes[g]),
                      l && "codedValue" === l.type
                        ? (c.name = this._getCodedName(l.codedValues, a))
                        : e && "esriFieldTypeDate" === e.type && !isNaN(a)
                        ? (c.name = m.format(new Date(a)))
                        : (c.name = a)))
                : a.address && b.searchTemplate
                ? (c.name = G.substitute(a.address, b.searchTemplate))
                : a.hasOwnProperty("name")
                ? (c.name = a.name)
                : a.hasOwnProperty("attributes") &&
                  "object" === typeof a.attributes &&
                  a.attributes.LongLabel
                ? (c.name = a.attributes.LongLabel)
                : a.hasOwnProperty("attributes") &&
                  "object" === typeof a.attributes &&
                  a.attributes.Match_addr
                ? ((c.name = a.attributes.Match_addr),
                  a.attributes.Addr_type &&
                  "POI" === a.attributes.Addr_type &&
                  a.attributes.StAddr &&
                  a.attributes.City
                    ? (c.name +=
                        " - " + a.attributes.StAddr + ", " + a.attributes.City)
                    : a.attributes.Addr_type &&
                      "POI" === a.attributes.Addr_type &&
                      a.attributes.City &&
                      (c.name += " - " + a.attributes.City))
                : a.hasOwnProperty("address") && "string" === typeof a.address
                ? (c.name = a.address)
                : a.hasOwnProperty("address") &&
                  "object" === typeof a.address &&
                  a.address.hasOwnProperty("Address")
                ? a.address.hasOwnProperty("Match_addr")
                  ? (c.name = a.address.Match_addr)
                  : a.address.hasOwnProperty("Address") &&
                    (c.name = a.address.Address)
                : c.feature &&
                  c.feature.geometry &&
                  (c.name = c.feature.geometry.x + "," + c.feature.geometry.y);
              b.featureLayer && c.feature && Z(c.feature, b.featureLayer);
              return c;
            }
          },
          _getScale: function() {
            var a;
            this.map &&
              "function" === typeof this.map.getScale &&
              (a = this.map.getScale());
            return a;
          },
          _hydrateResults: function(a, b, c, d) {
            d = [];
            var e = 0;
            if (a && a.length)
              for (e; e < a.length; e++) {
                var l = this._hydrateResult(a[e], b, c);
                l && d.push(l);
              }
            return d;
          },
          _containsNonLatinCharacter: function(a) {
            for (var b = 0; b < a.length; b++)
              if (255 < a.charCodeAt(b)) return !0;
            return !1;
          },
          _setPlaceholder: function(a) {
            var c = "",
              d = this.sources[a];
            a === this._allIndex
              ? (c =
                  this.allPlaceholder || e.widgets.Search.main.allPlaceholder)
              : d && d.placeholder && (c = d.placeholder);
            var l = e.widgets.Search.main.all;
            d && (l = this._getSourceName(a));
            b.set(this.sourceNameNode, "textContent", l);
            b.set(this.inputNode, "placeholder", c);
            b.set(this.inputNode, "title", c);
          },
          _updateActiveSource: function() {
            var a = this.sources,
              b = this.activeSourceIndex,
              c;
            a && a[b] && (c = a[b]);
            c ? this.set("activeSource", c) : this.set("activeSource", null);
          },
          _updateVisible: function() {
            this.visible ? this.show() : this.hide();
          },
          _updateButtonMode: function(b) {
            b
              ? (a.toggle(
                  this.containerNode,
                  this.css.searchExpanded,
                  this.expanded
                ),
                a.toggle(
                  this.containerNode,
                  this.css.searchCollapsed,
                  !this.expanded
                ),
                a.add(this.containerNode, this.css.hasButtonMode))
              : (a.remove(this.containerNode, this.css.searchExpanded),
                a.remove(this.containerNode, this.css.searchCollapsed),
                a.remove(this.containerNode, this.css.hasButtonMode));
          },
          _setDefaultActiveSourceIndex: function(a) {
            (a && 1 === a.length) || !this.enableSearchingAll
              ? this.set("activeSourceIndex", 0)
              : this.set("activeSourceIndex", this._allIndex);
          },
          _setEnableSourcesMenuAttr: function(a) {
            this._set("enableSourcesMenu", a);
            this._created && this._insertSources(this.sources);
          },
          _setEnableSearchingAllAttr: function(a) {
            this._set("enableSearchingAll", a);
            this._created &&
              (this._setDefaultActiveSourceIndex(this.sources),
              this._hideMenus(),
              this._insertSources(this.sources));
          },
          _setSourcesAttr: function(a) {
            this._createSourceNameMap(a).then(
              d.hitch(this, function(b) {
                this._sourceNames = b;
                this._created &&
                  (this._setDefaultActiveSourceIndex(a),
                  this._hideMenus(),
                  this._insertSources(a));
              })
            );
            this._set("sources", a);
          },
          _setAllPlaceholderAttr: function(a) {
            this._set("allPlaceholder", a);
            this._created && this._setPlaceholder(this.activeSourceIndex);
          },
          _setActiveSourceIndexAttr: function(a) {
            this._set("activeSourceIndex", a);
            this._updateActiveSource();
            this._created &&
              (this._setPlaceholder(a),
              this._hideMenus(),
              this._insertSources(this.sources));
          },
          _setMaxLengthAttr: function(a) {
            this._set("maxLength", a);
            this._created && b.set(this.inputNode, "maxLength", a);
          },
          _setValueAttr: function(a) {
            this.set("magicKey", null);
            this.set("selectedFeatureId", null);
            this._set("value", a);
            this._created &&
              (b.set(this.inputNode, "value", a), this._checkStatus());
          },
          _setVisibleAttr: function(a) {
            this._set("visible", a);
            this._created && this._updateVisible();
          },
          _setEnableButtonModeAttr: function(a) {
            this._set("enableButtonMode", a);
            this._created && this._updateButtonMode(a);
          },
          _setThemeAttr: function(b) {
            this._created &&
              (a.remove(this.domNode, this.theme), a.add(this.domNode, b));
            this._set("theme", b);
          }
        });
        c("extend-esri") && d.setObject("dijit.Search", t, Y);
        return t;
      });
    },
    "esri/tasks/locator": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has ../kernel ../request ../deferredUtils ./Task ./AddressCandidate".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F) {
        h = h(c, {
          declaredClass: "esri.tasks.Locator",
          _eventMap: {
            "address-to-locations-complete": ["addresses"],
            "addresses-to-locations-complete": ["addresses"],
            "location-to-address-complete": ["address"],
            "suggest-locations-complete": ["suggestions"]
          },
          constructor: function(c) {
            this._geocodeHandler = t.hitch(this, this._geocodeHandler);
            this._geocodeAddressesHandler = t.hitch(
              this,
              this._geocodeAddressesHandler
            );
            this._reverseGeocodeHandler = t.hitch(
              this,
              this._reverseGeocodeHandler
            );
            this.registerConnectEvents();
          },
          outSpatialReference: null,
          setOutSpatialReference: function(c) {
            this.outSpatialReference = c;
          },
          _geocodeHandler: function(c, b, a, d, f) {
            try {
              var g = c.candidates,
                e;
              b = [];
              var k,
                q = g.length,
                r = c.spatialReference,
                n;
              for (k = 0; k < q; k++) {
                e = g[k];
                if ((n = e.location)) n.spatialReference = r;
                b[k] = new F(e);
              }
              this._successHandler([b], "onAddressToLocationsComplete", a, f);
            } catch (N) {
              this._errorHandler(N, d, f);
            }
          },
          _geocodeAddressesHandler: function(c, b, a, d, f) {
            try {
              var g = c.locations;
              b = [];
              var e,
                k = g.length,
                q = c.spatialReference,
                r;
              for (e = 0; e < k; e++) {
                if ((r = g[e].location)) r.spatialReference = q;
                b[e] = new F(g[e]);
              }
              this._successHandler([b], "onAddressesToLocationsComplete", a, f);
            } catch (E) {
              this._errorHandler(E, d, f);
            }
          },
          addressToLocations: function(c, b, a, d, F) {
            var g, e, k, q, n, h, x, C;
            c.address &&
              ((d = a),
              (a = b),
              (b = c.outFields),
              (F = c.searchExtent),
              (C = c.countryCode),
              (g = c.magicKey),
              (e = c.distance),
              (x = c.categories),
              c.location && this.normalization && (k = c.location.normalize()),
              (q = c.locationType),
              (n = c.maxLocations),
              (h = c.forStorage),
              (c = c.address));
            F && (F = F.shiftCentralMeridian());
            var G = this.outSpatialReference;
            c = this._encode(
              t.mixin({}, this._url.query, c, {
                f: "json",
                outSR: G && v.toJson(G.toJson()),
                outFields: (b && b.join(",")) || null,
                searchExtent: F && v.toJson(F.toJson()),
                category: (x && x.join(",")) || null,
                countryCode: C || null,
                magicKey: g || null,
                distance: e || null,
                location: k || null,
                locationType: q || null,
                maxLocations: n || null,
                forStorage: h || null
              })
            );
            var B = this._geocodeHandler,
              Y = this._errorHandler,
              L = new u(f._dfdCanceller);
            L._pendingDfd = r({
              url: this._url.path + "/findAddressCandidates",
              content: c,
              callbackParamName: "callback",
              load: function(b, c) {
                B(b, c, a, d, L);
              },
              error: function(a) {
                Y(a, d, L);
              }
            });
            return L;
          },
          suggestLocations: function(c) {
            var b;
            b = new u(f._dfdCanceller);
            c.hasOwnProperty("location") &&
              this.normalization &&
              (c.location = c.location.normalize());
            c.searchExtent &&
              (c.searchExtent = c.searchExtent.shiftCentralMeridian());
            c = this._encode(
              t.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  text: c.text,
                  maxSuggestions: c.maxSuggestions,
                  searchExtent:
                    c.searchExtent && v.toJson(c.searchExtent.toJson()),
                  category: (c.categories && c.categories.join(",")) || null,
                  countryCode: c.countryCode || null,
                  location: c.location || null,
                  distance: c.distance || null
                },
                { f: "json" }
              )
            );
            c = r({
              url: this._url.path + "/suggest",
              content: c,
              callbackParamName: "callback"
            });
            b._pendingDfd = c;
            c.then(
              t.hitch(this, function(a) {
                a = a.suggestions || [];
                this.onSuggestLocationsComplete(a);
                b.resolve(a);
              }),
              t.hitch(this, function(a) {
                this._errorHandler(a);
                b.reject(a);
              })
            );
            return b;
          },
          addressesToLocations: function(c, b, a) {
            var g = this.outSpatialReference,
              F = [],
              m = c.categories,
              e = c.locationType,
              A = c.countryCode;
            d.forEach(c.addresses, function(a, b) {
              F.push({ attributes: a });
            });
            c = this._encode(
              t.mixin(
                {},
                this._url.query,
                {
                  category: (m && m.join(",")) || null,
                  locationType: e || null,
                  sourceCountry: A || null
                },
                { addresses: v.toJson({ records: F }) },
                { f: "json", outSR: g && v.toJson(g.toJson()) }
              )
            );
            var n = this._geocodeAddressesHandler,
              h = this._errorHandler,
              x = new u(f._dfdCanceller);
            x._pendingDfd = r({
              url: this._url.path + "/geocodeAddresses",
              content: c,
              callbackParamName: "callback",
              load: function(c, d) {
                n(c, d, b, a, x);
              },
              error: function(b) {
                h(b, a, x);
              }
            });
            return x;
          },
          _reverseGeocodeHandler: function(c, b, a, d, f) {
            try {
              var g = new F({
                address: c.address,
                location: c.location,
                score: 100
              });
              this._successHandler([g], "onLocationToAddressComplete", a, f);
            } catch (e) {
              this._errorHandler(e, d, f);
            }
          },
          locationToAddress: function(c, b, a, d) {
            c && this.normalization && (c = c.normalize());
            var g = this.outSpatialReference;
            c = this._encode(
              t.mixin({}, this._url.query, {
                outSR: g && v.toJson(g.toJson()),
                location: c && v.toJson(c.toJson()),
                distance: b,
                f: "json"
              })
            );
            var k = this._reverseGeocodeHandler,
              e = this._errorHandler,
              F = new u(f._dfdCanceller);
            F._pendingDfd = r({
              url: this._url.path + "/reverseGeocode",
              content: c,
              callbackParamName: "callback",
              load: function(b, c) {
                k(b, c, a, d, F);
              },
              error: function(a) {
                e(a, d, F);
              }
            });
            return F;
          },
          onSuggestLocationsComplete: function() {},
          onAddressToLocationsComplete: function() {},
          onAddressesToLocationsComplete: function() {},
          onLocationToAddressComplete: function() {}
        });
        x("extend-esri") && t.setObject("tasks.Locator", h, n);
        return h;
      });
    },
    "esri/tasks/AddressCandidate": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "../geometry/Point"
      ], function(h, t, d, u, v) {
        h = h(null, {
          declaredClass: "esri.tasks.AddressCandidate",
          constructor: function(d) {
            t.mixin(this, d);
            this.location = new v(this.location);
          }
        });
        d("extend-esri") && t.setObject("tasks.AddressCandidate", h, u);
        return h;
      });
    },
    "esri/styles/basic": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "../Color"
      ], function(h, t, d, u, v) {
        function x(c, d) {
          var b;
          if (c)
            switch (
              ((b = {}),
              (b.color = new v(c.color)),
              (b.opacity = c.opacity || 1),
              d)
            ) {
              case "point":
                b.outline = {
                  color: new v(c.outline.color),
                  width: c.outline.width
                };
                b.size = c.size;
                break;
              case "line":
                b.width = c.width;
                break;
              case "polygon":
                b.outline = {
                  color: new v(c.outline.color),
                  width: c.outline.width
                };
            }
          return b;
        }
        function n(c) {
          if ("esriGeometryPoint" === c || "esriGeometryMultipoint" === c)
            c = "point";
          else if ("esriGeometryPolyline" === c) c = "line";
          else if (
            "esriGeometryPolygon" === c ||
            "esriGeometryMultiPatch" === c
          )
            c = "polygon";
          return c;
        }
        var r = {
            default: {
              name: "default",
              label: "Default",
              description: "Default theme for basic visualization of features.",
              basemapGroups: {
                light: "streets gray topo terrain national-geographic oceans osm gray-vector streets-vector topo-vector streets-relief-vector streets-navigation-vector".split(
                  " "
                ),
                dark: [
                  "satellite",
                  "hybrid",
                  "dark-gray",
                  "dark-gray-vector",
                  "streets-night-vector"
                ]
              },
              pointSchemes: {
                light: {
                  primary: {
                    color: [77, 77, 77, 1],
                    outline: { color: [255, 255, 255, 0.25], width: 1 },
                    size: 8
                  },
                  secondary: [
                    {
                      color: [226, 119, 40, 1],
                      outline: { color: [255, 255, 255, 0.25], width: 1 },
                      size: 8
                    },
                    {
                      color: [255, 255, 255, 1],
                      outline: { color: [51, 51, 51, 0.25], width: 1 },
                      size: 8
                    }
                  ]
                },
                dark: {
                  primary: {
                    color: [255, 255, 255, 1],
                    outline: { color: [92, 92, 92, 0.25], width: 1 },
                    size: 8
                  },
                  secondary: [
                    {
                      color: [226, 119, 40, 1],
                      outline: { color: [255, 255, 255, 0.25], width: 1 },
                      size: 8
                    },
                    {
                      color: [26, 26, 26, 1],
                      outline: { color: [178, 178, 178, 0.25], width: 1 },
                      size: 8
                    }
                  ]
                }
              },
              lineSchemes: {
                light: {
                  primary: { color: [77, 77, 77, 1], width: 2 },
                  secondary: [
                    { color: [226, 119, 40, 1], width: 2 },
                    { color: [255, 255, 255, 1], width: 2 }
                  ]
                },
                dark: {
                  primary: { color: [255, 255, 255, 1], width: 2 },
                  secondary: [
                    { color: [226, 119, 40, 1], width: 2 },
                    { color: [26, 26, 26, 1], width: 2 }
                  ]
                }
              },
              polygonSchemes: {
                light: {
                  primary: {
                    color: [227, 139, 79, 1],
                    outline: { color: [255, 255, 255, 0.25], width: 1 },
                    opacity: 0.8
                  },
                  secondary: [
                    {
                      color: [128, 128, 128, 1],
                      outline: { color: [255, 255, 255, 0.25], width: 1 },
                      opacity: 0.8
                    },
                    {
                      color: [255, 255, 255, 1],
                      outline: { color: [128, 128, 128, 0.25], width: 1 },
                      opacity: 0.8
                    }
                  ]
                },
                dark: {
                  primary: {
                    color: [227, 139, 79, 1],
                    outline: { color: [92, 92, 92, 0.25], width: 1 },
                    opacity: 0.8
                  },
                  secondary: [
                    {
                      color: [178, 178, 178, 1],
                      outline: { color: [92, 92, 92, 0.25], width: 1 },
                      opacity: 0.8
                    },
                    {
                      color: [26, 26, 26, 1],
                      outline: { color: [128, 128, 128, 0.25], width: 1 },
                      opacity: 0.8
                    }
                  ]
                }
              }
            }
          },
          f = {};
        (function() {
          var c, d, b, a, k, q, m, e;
          for (c in r)
            for (a in ((d = r[c]),
            (b = d.basemapGroups),
            (k = f[c] = {
              basemaps: [].concat(b.light).concat(b.dark),
              point: {},
              line: {},
              polygon: {}
            }),
            b))
              for (q = b[a], m = 0; m < q.length; m++)
                (e = q[m]),
                  d.pointSchemes && (k.point[e] = d.pointSchemes[a]),
                  d.lineSchemes && (k.line[e] = d.lineSchemes[a]),
                  d.polygonSchemes && (k.polygon[e] = d.polygonSchemes[a]);
        })();
        var c = {
          getAvailableThemes: function(c) {
            var d = [],
              b,
              a,
              k;
            for (b in r)
              (a = r[b]),
                (k = f[b]),
                (c && -1 === h.indexOf(k.basemaps, c)) ||
                  d.push({
                    name: a.name,
                    label: a.label,
                    description: a.description,
                    basemaps: k.basemaps.slice(0)
                  });
            return d;
          },
          getSchemes: function(c) {
            var d = c.theme,
              b = c.basemap,
              a = n(c.geometryType);
            c = f[d];
            var k;
            (c = (c = c && c[a]) && c[b]) &&
              (k = {
                primaryScheme: x(c.primary, a),
                secondarySchemes: h.map(c.secondary, function(b) {
                  return x(b, a);
                })
              });
            return k;
          },
          cloneScheme: function(c) {
            var d;
            c &&
              ((d = t.mixin({}, c)),
              d.color && (d.color = new v(d.color)),
              d.outline &&
                (d.outline = {
                  color: d.outline.color && new v(d.outline.color),
                  width: d.outline.width
                }));
            return d;
          }
        };
        d("extend-esri") && t.setObject("styles.basic", c, u);
        return c;
      });
    },
    "widgets/DistrictLookup/searchSourceUtils": function() {
      define("dojo/_base/lang dojo/_base/array dojo/Deferred dojo/when dojo/promise/all jimu/portalUtils esri/lang esri/request".split(
        " "
      ), function(h, t, d, u, v, x, n, r) {
        return {
          map: null,
          layerInfosObj: null,
          appConfig: null,
          _esriLocatorRegExp: /geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g,
          setMap: function(d) {
            this.map = d;
          },
          setLayerInfosObj: function(d) {
            this.layerInfosObj = d;
          },
          setAppConfig: function(d) {
            this.appConfig = d;
          },
          getConfigInfo: function(d) {
            if (d && d.sources && 0 < d.sources.length) {
              var c = null;
              return this.searchLayer(this.map) && d.upgradeFromGeocoder
                ? ((c = this.map.itemInfo.itemData.applicationProperties.viewing
                    .search),
                  (c = t.map(
                    c.layers,
                    h.hitch(
                      this,
                      function(c, d) {
                        d.hintText = c;
                        return this._getQueryTypeGeocoder(d);
                      },
                      c.hintText
                    )
                  )),
                  v(c).then(
                    h.hitch(this, function(c) {
                      d.sources = [].concat(c).concat(d.sources);
                      return d;
                    })
                  ))
                : d;
            }
            return u(this._getSoucesFromPortalAndWebmap()).then(
              h.hitch(this, function(c) {
                return {
                  allPlaceholder: "",
                  showInfoWindowOnSelect: !0,
                  sources: c
                };
              })
            );
          },
          _getSoucesFromPortalAndWebmap: function() {
            var d = [],
              c = null;
            this.searchLayer(this.map) &&
              ((c = this.map.itemInfo.itemData.applicationProperties.viewing
                .search),
              t.forEach(
                c.layers,
                h.hitch(
                  this,
                  function(c, f) {
                    f.hintText = c;
                    d.push(this._getQueryTypeGeocoder(f));
                  },
                  c.hintText
                )
              ));
            return x.getPortalSelfInfo(this.appConfig.portalUrl).then(
              h.hitch(this, function(c) {
                if (
                  (c = c.helperServices && c.helperServices.geocode) &&
                  0 < c.length
                )
                  for (var f = 0, b = c.length; f < b; f++) {
                    var a = c[f];
                    a && d.push(this._processSingleLine(a));
                  }
                return v(d).then(
                  h.hitch(this, function(a) {
                    for (var b = [], c = 0; c < a.length; c++) {
                      var d = a[c];
                      d &&
                        ((d && "query" === d.type) ||
                          ((d = {
                            name: d.name || this._getGeocodeName(d.url),
                            url: d.url,
                            singleLineFieldName: d.singleLineFieldName,
                            placeholder:
                              d.placeholder ||
                              window.jimuNls.common.findAddressOrPlace ||
                              d.name ||
                              this._getGeocodeName(d.url),
                            maxResults: 6,
                            searchInCurrentMapExtent: !1,
                            type: "locator"
                          }),
                          (d.enableLocalSearch = this._isEsriLocator(d.url)),
                          (d.localSearchMinScale = 3e5),
                          (d.localSearchDistance = 5e4)),
                        b.push(d));
                    }
                    return b;
                  })
                );
              })
            );
          },
          _getQueryTypeGeocoder: function(d) {
            var c = this.map.getLayer(d.id),
              f = null,
              g = null,
              b = null,
              b = n.isDefined(d.subLayer) ? d.id + "_" + d.subLayer : d.id,
              f = this.layerInfosObj.traversal(function(a) {
                return a.id === b ? ((g = a), !0) : !1;
              });
            return c && f && g
              ? ((f = n.isDefined(d.subLayer)
                  ? g.url || c.url + "/" + d.subLayer
                  : g.url || c.url),
                {
                  name: g.title,
                  layerId: b,
                  url: f,
                  placeholder:
                    d.hintText || window.jimuNls.common.findAddressOrPlace,
                  searchFields: [d.field.name],
                  displayField: d.field.name,
                  exactMatch: d.field.exactMatch || !1,
                  maxResults: 6,
                  searchInCurrentMapExtent: !1,
                  type: "query"
                })
              : null;
          },
          _isEsriLocator: function(d) {
            this._esriLocatorRegExp.lastIndex = 0;
            return this._esriLocatorRegExp.test(d);
          },
          _processSingleLine: function(f) {
            if (f.singleLineFieldName) return f;
            if (this._isEsriLocator(f.url))
              return (f.singleLineFieldName = "SingleLine"), f;
            var c = new d();
            r({
              url: f.url,
              content: { f: "json" },
              handleAs: "json",
              callbackParamName: "callback"
            }).then(
              h.hitch(this, function(d) {
                d.singleLineAddressField && d.singleLineAddressField.name
                  ? ((f.singleLineFieldName = d.singleLineAddressField.name),
                    c.resolve(f))
                  : (console.warn(f.url + "has no singleLineFieldName"),
                    c.resolve(null));
              }),
              h.hitch(this, function(d) {
                console.error(d);
                c.resolve(null);
              })
            );
            return c.promise;
          },
          _getGeocodeName: function(d) {
            if ("string" !== typeof d) return "geocoder";
            d = d.split("/");
            return d[d.length - 2] || "geocoder";
          },
          getGeocoderName: function(d) {
            return this._getGeocodeName(d);
          },
          hasAppSearchInfo: function(d) {
            return (
              d.itemInfo &&
              d.itemInfo.itemData &&
              d.itemInfo.itemData.applicationProperties &&
              d.itemInfo.itemData.applicationProperties.viewing &&
              d.itemInfo.itemData.applicationProperties.viewing.search
            );
          },
          searchLayer: function(d) {
            if (!this.hasAppSearchInfo(d)) return !1;
            d = d.itemInfo.itemData.applicationProperties.viewing.search;
            return d.enabled && 0 !== d.layers.length ? !0 : !1;
          }
        };
      });
    },
    "esri/dijit/Directions": function() {
      define("require dojo/_base/declare dojo/_base/lang dojo/_base/kernel dojo/_base/array dojo/_base/Color dijit/a11yclick dijit/_TemplatedMixin dijit/form/Select dijit/form/ValidationTextBox dijit/form/DateTextBox dijit/form/TimeTextBox dojo/store/Memory dojo/data/ObjectStore dojo/keys dojo/has dojo/on dojo/mouse dojo/dom dojo/dom-geometry dojo/dom-style dojo/dom-class dojo/dom-attr dojo/query dojo/number dojo/i18n!../nls/jsapi dojo/text!./templates/Directions.html ./Search dojo/dom-construct dojo/promise/all dojo/Deferred dojo/dnd/Source dojo/json ../kernel ../urlUtils ../graphic ../units ../TimeExtent ../InfoTemplate ../SpatialReference ../layers/ArcGISDynamicMapServiceLayer ../layers/GraphicsLayer ../geometry/webMercatorUtils ../geometry/geodesicUtils ../arcgis/utils ../geometry/Point ../geometry/Extent ../geometry/Polyline ../geometry/mathUtils ../symbols/SimpleMarkerSymbol ../symbols/PictureMarkerSymbol ../symbols/CartographicLineSymbol ../symbols/TextSymbol ../renderers/UniqueValueRenderer ../symbols/Font ./_EventedWidget ../tasks/FeatureSet ../tasks/RouteTask ../tasks/RouteParameters ../tasks/GeometryService ../tasks/DistanceParameters ../tasks/PrintTask ../tasks/PrintParameters ../tasks/PrintTemplate ../toolbars/edit ../toolbars/draw ../config ../tasks/ProjectParameters dojo/uacss".split(
        " "
      ), function(
        h,
        t,
        d,
        u,
        v,
        x,
        n,
        r,
        f,
        c,
        F,
        g,
        b,
        a,
        k,
        q,
        m,
        e,
        A,
        H,
        I,
        E,
        N,
        C,
        G,
        B,
        Y,
        L,
        O,
        M,
        J,
        V,
        Q,
        D,
        l,
        y,
        K,
        da,
        W,
        aa,
        S,
        U,
        X,
        R,
        Z,
        w,
        pa,
        ga,
        Aa,
        ja,
        ba,
        ca,
        qa,
        ha,
        fa,
        ra,
        ka,
        sa,
        ta,
        ia,
        ua,
        va,
        wa,
        xa,
        la,
        ma,
        ya,
        na
      ) {
        var ea = l.getProtocolForWebResource(),
          oa = L.createSubclass({
            _setSourcesAttr: function(a) {
              a &&
                (a = a.map(function(a) {
                  a.locator &&
                    null == a.locationType &&
                    (a = d.mixin({ locationType: "street" }, a));
                  return a;
                }));
              this.inherited(arguments, [a]);
            }
          });
        t = t("esri.dijit.Directions", [ra, r], {
          templateString: Y,
          mapClickActive: !1,
          barrierToolActive: !1,
          _eventMap: {
            activate: !0,
            deactivate: !1,
            load: !0,
            "directions-start": !0,
            "directions-finish": ["result"],
            "directions-clear": !0,
            "segment-select": ["graphic"],
            "segment-highlight": ["graphic"],
            error: ["error"],
            "stops-update": ["stops"],
            "route-item-created": !0,
            "route-item-updated": !0,
            "feature-collection-created": !0
          },
          _emptyStop: { name: "" },
          constructor: function(a, b) {
            if (!a.map)
              throw Error(
                'Required "map" parameter is missing. Cannot instantiate Directions Widget.'
              );
            if (!b)
              throw Error(
                'Required "srcNodeRef" parameter is missing. Cannot instantiate Directions Widget.'
              );
            this._i18n = B;
            this._css = {
              widgetContainerClass: "esriDirectionsContainer",
              searchSourceContainerClass: "esriSearchSourceContainer",
              stopsContainerClass: "esriStopsContainer",
              stopsTableContainerClass: "esriStopsTableContainer",
              stopsTableCoverClass: "esriStopsTableCover",
              reverseStopsClass: "esriStopsReverse",
              addStopsClass: "esriStopsAdd",
              stopsClass: "esriStops",
              stopsRemovableClass: "esriStopsRemovable",
              stopsButtonContainerClass: "esriStopsButtons",
              stopsOptionsButtonClass: "esriStopsOptionsButton",
              stopsAddDestinationClass: "esriStopsAddDestination",
              stopsAddDestinationBtnClass: "esriStopsAddDestinationBtn",
              stopsGetDirectionsContainerClass:
                "esriStopsGetDirectionsContainer",
              stopsGetDirectionsClass: "esriStopsGetDirections",
              stopsClearDirectionsClass: "esriStopsClearDirections",
              stopsInnerGeocoderClass: "esriInnerGeocoder",
              stopsOptionsOptionsEnabledClass: "esriStopsOptionsEnabled",
              stopsOptionsMenuClass: "esriStopsOptionsMenu",
              stopsFindOptimalOrderClass: "esriFindOptimalOrderOption",
              stopsUseTrafficClass: "esriUseTrafficOption",
              stopsReturnToStartClass: "esriReturnToStartOption",
              stopsOptionsCheckboxesClass: "esriOptionsCheckboxes",
              stopsOptionsToggleContainerClass: "esriOptionsToggleContainer",
              stopsOptionsUnitsContainerClass: "esriOptionsUnitsContainer",
              stopsOptionsUnitsMiClass: "esriOptionsUnitsMi",
              stopsOptionsUnitsKmClass: "esriOptionsUnitsKm",
              stopsOptionsImpedanceContainerClass:
                "esriOptionsImpedanceContainer",
              stopsOptionsImpedanceTimeClass: "esriOptionsImpedanceTime",
              stopsOptionsImpedanceDistanceClass:
                "esriOptionsImpedanceDistance",
              stopClass: "esriStop",
              stopOriginClass: "esriStopOrigin",
              stopDestinationClass: "esriStopDestination",
              stopUnreachedFirstOrLastClass: "esriStopUnreachedFirstOrLast",
              stopUnreachedClass: "esriStopUnreached",
              esriStopGeocoderColumnClass: "esriStopGeocoderColumn",
              esriStopReverseColumnClass: "esriStopReverseColumn",
              stopDnDHandleClass: "esriStopDnDHandle",
              stopDnDHandleClassHidden: "esriStopDnDHandleHidden",
              stopIconColumnClass: "esriStopIconColumn",
              stopIconClass: "esriStopIcon",
              stopIconRemoveColumnClass: "esriStopIconRemoveColumn",
              stopIconRemoveClass: "esriStopIconRemove",
              stopIconRemoveClassHidden: "esriStopIconRemoveHidden",
              resultsContainerClass: "esriResultsContainer",
              resultsLoadingClass: "esriResultsLoading",
              resultsPrintClass: "esriResultsPrint",
              resultsSaveClass: "esriResultsSave",
              resultsSummaryClass: "esriResultsSummary",
              routesContainerClass: "esriRoutesContainer",
              routesClass: "esriRoutes",
              routesErrorClass: "esriRoutesError",
              routesInfoClass: "esriRoutesInfo",
              routeClass: "esriRoute",
              routeTextColumnClass: "esriRouteTextColumn",
              routeTextClass: "esriRouteText",
              routeLengthClass: "esriRouteLength",
              routeOriginClass: "esriDMTStopOrigin",
              routeDestinationClass: "esriDMTStopDestination",
              routeInfoClass: "esriRouteInfo",
              routeIconColumnClass: "esriRouteIconColumn",
              routeIconClass: "esriRouteIcon",
              infoWindowRouteClass: "esriInfoWindowRoute",
              routeZoomClass: "esriRouteZoom",
              esriPrintPageClass: "esriPrintPage",
              esriPrintBarClass: "esriPrintBar",
              esriPrintButtonClass: "esriPrintButton",
              esriCloseButtonClass: "esriCloseButton",
              esriPrintMainClass: "esriPrintMain",
              esriPrintHeaderClass: "esriPrintHeader",
              esriPrintLogoClass: "esriPrintLogo",
              esriPrintMapClass: "esriPrintMap",
              esriPrintNameClass: "esriPrintName",
              esriPrintNotesClass: "esriPrintNotes",
              esriPrintLengthClass: "esriPrintLength",
              esriPrintDirectionsClass: "esriPrintDirections",
              esriPrintFooterClass: "esriPrintFooter",
              esriPrintStopLabelClass: "esriPrintStopLabel",
              clearClass: "esriClear",
              dndDragBodyClass: "esriDndDragDirection",
              stopsButtonClass: "esriDirectionsButton",
              stopsButtonTabClass: "esriDirectionsTabButton",
              stopsButtonTabLastClass: "esriDirectionsTabLastButton",
              stopsPressedButtonClass: "esriDirectionsPressedButton",
              linkButtonClass: "esriLinkButton",
              activateButtonClass: "esriActivateButton",
              lineBarrierButtonClass: "esriLineBarrierButton",
              travelModesContainerClass: "esriTravelModesContainer"
            };
            this.options = {
              map: null,
              autoSolve: !0,
              minStops: 2,
              maxStops: 20,
              theme: "simpleDirections",
              alphabet: "1234567890",
              directions: null,
              returnToStart: !1,
              optimalRoute: !1,
              routeTaskUrl:
                ea +
                "//route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
              printTaskUrl:
                ea +
                "//utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
              geometryTaskUrl:
                ea +
                "//utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",
              routeParams: {},
              stops: ["", ""],
              searchOptions: {},
              stopsInfoTemplate: new W(
                B.widgets.directions.stop,
                "${address}${error}"
              ),
              waypointInfoTemplate: new W(
                B.widgets.directions.maneuver,
                B.widgets.directions.waypoint
              ),
              segmentInfoTemplate: new W(
                B.widgets.directions.maneuver,
                '\x3cdiv class\x3d"${maneuverType}"\x3e\x3cdiv class\x3d"' +
                  this._css.routeIconClass +
                  " " +
                  this._css.infoWindowRouteClass +
                  '"\x3e\x3cstrong\x3e${step}.\x3c/strong\x3e ${formattedText}\x3c/div\x3e\x3c/div\x3e'
              ),
              textSymbolFont: new fa(
                "11px",
                fa.STYLE_NORMAL,
                fa.VARIANT_NORMAL,
                fa.WEIGHT_NORMAL,
                "Arial, Helvetica, sans-serif"
              ),
              textSymbolColor: new x([255, 255, 255]),
              textSymbolOffset: { x: 0, y: 10.875 },
              fromSymbol: new ba({
                url: h.toUrl("./images/Directions/greenPoint.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              fromSymbolDrag: new ba({
                url: h.toUrl("./images/Directions/greenPointMove.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              stopSymbol: new ba({
                url: h.toUrl("./images/Directions/bluePoint.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              stopSymbolDrag: new ba({
                url: h.toUrl("./images/Directions/bluePointMove.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              toSymbol: new ba({
                url: h.toUrl("./images/Directions/redPoint.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              toSymbolDrag: new ba({
                url: h.toUrl("./images/Directions/redPointMove.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              unreachedSymbol: new ba({
                url: h.toUrl("./images/Directions/grayPoint.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              unreachedSymbolDrag: new ba({
                url: h.toUrl("./images/Directions/grayPointMove.png"),
                height: 21.75,
                width: 15.75,
                type: "esriPMS"
              }).setOffset(0, 10.875),
              waypointSymbol: new ja({
                color: [255, 255, 255, 255],
                size: 10,
                type: "esriSMS",
                style: "esriSMSCircle",
                outline: {
                  color: [20, 89, 127, 255],
                  width: 2.5,
                  type: "esriSLS",
                  style: "esriSLSSolid"
                }
              }),
              maneuverSymbol: new ja({
                color: [255, 255, 255, 255],
                size: 4,
                type: "esriSMS",
                style: "esriSMSCircle",
                outline: {
                  color: [30, 99, 137, 255],
                  width: 1,
                  type: "esriSLS",
                  style: "esriSLSSolid"
                }
              }),
              routeSymbol: new ca()
                .setColor(new x([20, 89, 127, 0.75]))
                .setWidth(10)
                .setCap(ca.CAP_ROUND)
                .setJoin(ca.JOIN_ROUND),
              segmentSymbol: new ca()
                .setColor(new x([255, 255, 255, 1]))
                .setWidth(6)
                .setCap(ca.CAP_ROUND)
                .setJoin(ca.JOIN_ROUND),
              barrierRenderer: new ha({
                type: "uniqueValue",
                field1: "BarrierType",
                defaultSymbol: {
                  type: "esriPMS",
                  imageData:
                    "PHN2ZyB3aWR0aD0iMjIyIiBoZWlnaHQ9IjIyMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxlbGxpcHNlIGZpbGw9IiNmZjAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyMCIgY3g9IjExMiIgY3k9IjExMSIgaWQ9InN2Z181IiByeD0iMTAwIiByeT0iMTAwIi8+CjxlbGxpcHNlIGZpbGw9IiNmZjAwMDAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyMCIgY3g9IjExMiIgY3k9IjExMSIgaWQ9InN2Z182IiByeD0iOTUiIHJ5PSI5NSIvPgo8cmVjdCBmaWxsPSIjZmYwMDAwIiBzdHJva2Utd2lkdGg9IjIwIiB4PSI2NC41IiB5PSIxMDIiIHdpZHRoPSI5NSIgaGVpZ2h0PSIxOCIgaWQ9InN2Z183IiBzdHJva2U9IiNmZmZmZmYiLz4KPC9nPgo8L3N2Zz4\x3d",
                  contentType: "image/svg+xml",
                  width: 18,
                  height: 18
                },
                uniqueValueInfos: [
                  {
                    value: "2",
                    symbol: {
                      type: "esriPMS",
                      imageData:
                        "PHN2ZyB3aWR0aD0iMjg2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGZpbGw9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAiIGQ9Im04Ljc0OTk5MiwyNTEuNzQ5OTk3bDEzNC45OTk5OTgsLTI0MS45OTk5OThsMTM0Ljk5OTk5OCwyNDEuOTk5OTk4bC0yNjkuOTk5OTk1LDBsLTAuMDAwMDAxLDB6IiBpZD0ic3ZnXzEiIHN0cm9rZT0iIzAwMCIvPgo8cGF0aCBzdHJva2U9IiNmZmYiIGZpbGw9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMTUiIGQ9Im0yMy41MDAwMDQsMjQyLjUwMDAwNWwxMTkuOTk5OTkyLC0yMTUuOTk5OTk5bDExOS45OTk5OTIsMjE1Ljk5OTk5OWwtMjM5Ljk5OTk4MywwbC0wLjAwMDAwMSwweiIgaWQ9InN2Z18yIi8+Cjx0ZXh0IGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iMTA5IiB5PSIyMjIuNzUiIGlkPSJzdmdfNSIgZm9udC1zaXplPSIxODAiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBUaW1lcywgJ1RpbWVzIE5ldyBSb21hbicsIHNlcmlmIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPiE8L3RleHQ+CjwvZz4KPC9zdmc+",
                      contentType: "image/svg+xml",
                      width: 19,
                      height: 18
                    }
                  }
                ]
              }),
              polylineBarrierRenderer: new ha({
                type: "uniqueValue",
                field1: "BarrierType",
                defaultSymbol: {
                  color: [255, 0, 0, 184],
                  width: 7.5,
                  type: "esriSLS",
                  style: "esriSLSSolid"
                },
                uniqueValueInfos: [
                  {
                    value: "1",
                    symbol: {
                      color: [255, 85, 0, 184],
                      width: 7.5,
                      type: "esriSLS",
                      style: "esriSLSSolid"
                    }
                  }
                ]
              }),
              polygonBarrierRenderer: new ha({
                type: "uniqueValue",
                field1: "BarrierType",
                defaultSymbol: {
                  color: [255, 0, 0, 156],
                  outline: {
                    color: [255, 0, 0, 153],
                    width: 2.4,
                    type: "esriSLS",
                    style: "esriSLSSolid"
                  },
                  type: "esriSFS",
                  style: "esriSFSSolid"
                },
                uniqueValueInfos: [
                  {
                    value: "1",
                    symbol: {
                      color: [255, 170, 0, 156],
                      outline: {
                        color: [255, 0, 0, 153],
                        width: 7.5,
                        type: "esriSLS",
                        style: "esriSLSSolid"
                      },
                      type: "esriSFS",
                      style: "esriSFSSolid"
                    }
                  }
                ]
              }),
              printPage: "",
              printTemplate: "",
              focusOnNewStop: !0,
              dragging: !0,
              canModifyStops: !0,
              canModifyWaypoints: !0,
              directionsLengthUnits: null,
              directionsLanguage: null,
              traffic: !1,
              trafficLayer: null,
              showPrintPage: !0,
              showSaveButton: !1,
              showSegmentPopup: !1,
              showSegmentHighlight: !0,
              showReverseStopsButton: !0,
              showReturnToStartOption: !0,
              showOptimalRouteOption: !0,
              showTravelModesOption: !0,
              showMilesKilometersOption: !0,
              showClearButton: !1,
              showActivateButton: !0,
              showBarriersButton: !0,
              loaded: !1,
              routeLayer: {
                itemId: null,
                title: null,
                isItemOwner: !0,
                ownerFolder: null
              },
              startTime: "now"
            };
            this.userOptions = a;
            this.defaults = d.mixin({}, this.options, a, {
              _waypointName: "DWWP",
              _userDefinedStopName: "UserDefinedStopName",
              _solveInProgress: !1,
              _moveInProgress: !1,
              _stopSequence: 1e3
            });
            if (!this.defaults.minStops || 2 > this.defaults.minStops)
              this.defaults.minStops = 2;
            if (
              2 < this.defaults.minStops &&
              this.defaults.stops &&
              "," === this.defaults.stops.toString()
            )
              for (a = 2; a < this.defaults.minStops; a++)
                this.defaults.stops.splice(0, 0, "");
            this.domNode = b;
          },
          postCreate: function() {
            this.inherited(arguments);
            this.own(
              m(
                this._activateButtonNode,
                n,
                d.hitch(this, function() {
                  this.mapClickActive ? this.deactivate() : this.activate();
                })
              )
            );
            this.own(
              m(
                this._lineBarrierButtonNode,
                n,
                d.hitch(this, function() {
                  this.barrierToolActive
                    ? this.deactivateBarrierTool()
                    : this.activateBarrierTool();
                })
              )
            );
            this.own(
              m(this._addDestinationNode, n, d.hitch(this, this._addStopButton))
            );
            this.own(
              m(
                this._optionsButtonNode,
                n,
                d.hitch(this, this._toggleOptionsMenu)
              )
            );
            this.own(
              m(this._saveMenuButton, n, d.hitch(this, this._toggleSaveMenu))
            );
            this.own(
              m(
                this._saveButton,
                n,
                d.hitch(this, function() {
                  this._saveButton._enabled && this._storeRouteUI();
                })
              )
            );
            this.own(
              m(
                this._saveAsButton,
                n,
                d.hitch(this, function() {
                  d.mixin(this.routeLayer, {
                    itemId: null,
                    title: null,
                    ownerFolder: null
                  });
                  this._storeRouteUI();
                })
              )
            );
            this.own(
              m(
                this._findOptimalOrderNode,
                n,
                d.hitch(this, this._toggleCheckbox)
              )
            );
            this.own(
              m(this._returnToStartNode, n, d.hitch(this, this._toggleCheckbox))
            );
            this.own(
              m(this._useTrafficNode, n, d.hitch(this, this._toggleCheckbox))
            );
            this.own(
              m(this._useMilesNode, n, d.hitch(this, this._toggleUnits))
            );
            this.own(
              m(this._useKilometersNode, n, d.hitch(this, this._toggleUnits))
            );
            this.own(
              m(
                this._getDirectionsButtonNode,
                n,
                d.hitch(this, this.getDirections)
              )
            );
            this.own(
              m(
                this._clearDirectionsButtonNode,
                n,
                d.hitch(this, function() {
                  this.clearDirections();
                })
              )
            );
            var a = d.hitch(this, function() {
              clearTimeout(this._startTimeMenu._hideTimer);
              this._startTimeMenu._hideTimer = setTimeout(
                d.hitch(this, function() {
                  I.set(this._startTimeMenu, "display", "none");
                }),
                100
              );
            });
            this.own(
              m(
                this._startTimeButtonNode,
                n,
                d.hitch(this, function() {
                  this._startTimeButtonNode.disabled ||
                  "block" === I.get(this._startTimeMenu, "display")
                    ? I.set(this._startTimeMenu, "display", "none")
                    : (I.set(this._startTimeMenu, "display", "block"),
                      this[
                        "now" === this.startTime
                          ? "_startTimeMenuLeaveNow"
                          : "none" === this.startTime
                          ? "_startTimeMenuNone"
                          : "_startTimeMenuDepartAt"
                      ].focus());
                })
              )
            );
            this.own(m(this._startTimeMenuLeaveNow, "blur", a));
            this.own(m(this._startTimeMenuDepartAt, "blur", a));
            this.own(m(this._startTimeMenuNone, "blur", a));
            this.own(
              m(
                this._startTimeMenuLeaveNow,
                "mousedown",
                d.hitch(this, function() {
                  this.startTime = "now";
                  this._updateStartTimeUI();
                  this._clearDisplayBeforeSolve();
                })
              )
            );
            this.own(
              m(
                this._startTimeMenuDepartAt,
                "mousedown",
                d.hitch(this, function() {
                  this.startTime = new Date().getTime();
                  this._updateStartTimeUI();
                  this._clearDisplayBeforeSolve();
                })
              )
            );
            this.own(
              m(
                this._startTimeMenuNone,
                "mousedown",
                d.hitch(this, function() {
                  this.startTime = "none";
                  this._updateStartTimeUI();
                  this._clearDisplayBeforeSolve();
                })
              )
            );
            this._symbolEventPaddingDirections = new ca()
              .setColor(new x([0, 255, 0, 0]))
              .setWidth(20)
              .setCap(ca.CAP_ROUND);
            this._stopLayer = new U({
              id: "directions_stopLayer_" + this.id,
              displayOnPan: !0
            });
            this._routeLayer = new U({
              id: "directions_routeLayer_" + this.id,
              displayOnPan: !0
            });
            this._waypointsEventLayer = new U({
              id: "directions_waypointsEventLayer_" + this.id,
              displayOnPan: !0
            });
            this._barriersLayer = new U({
              id: "directions_barriersLayer_" + this.id,
              displayOnPan: !0
            });
            this._polylineBarriersLayer = new U({
              id: "directions_polylineBarriersLayer_" + this.id,
              displayOnPan: !0
            });
            this._polygonBarriersLayer = new U({
              id: "directions_polygonBarriersLayer_" + this.id,
              displayOnPan: !0
            });
            this._barriersLayer.setRenderer(this.defaults.barrierRenderer);
            this._polylineBarriersLayer.setRenderer(
              this.defaults.polylineBarrierRenderer
            );
            this._polygonBarriersLayer.setRenderer(
              this.defaults.polygonBarrierRenderer
            );
            this.map &&
              (this.map.addLayer(this._routeLayer),
              this.map.addLayer(this._polygonBarriersLayer),
              this.map.addLayer(this._polylineBarriersLayer),
              this.map.addLayer(this._barriersLayer),
              this.map.addLayer(this._stopLayer),
              (this._externalTimeExtent = this.map.timeExtent));
            this._snappingManager = this.map.enableSnapping({
              layerInfos: [
                {
                  layer: this._waypointsEventLayer,
                  snapToVertex: !1,
                  snapToPoint: !0,
                  snapToEdge: !0
                }
              ],
              tolerance: 15
            });
            this._setWidgetProperties();
            var b = new y(null, this.waypointSymbol, {}),
              a = d.hitch(this, function() {
                this._moveInProgress ||
                  this._solveInProgress ||
                  !b._isShown() ||
                  (this.editToolbar.deactivate(),
                  this._stopLayer.remove(b),
                  clearTimeout(b._solveTimeout),
                  (b._solveTimeout = null),
                  (b.attributes.isWaypoint = !0),
                  b._isStopIcon &&
                    this.stopGraphics[b._index] &&
                    (this._stopLayer.add(this.stopGraphics[b._index]),
                    this._stopLayer.add(this.textGraphics[b._index])));
                b._showTooltip();
              });
            this._handle = d.mixin(b, {
              _isHandle: !0,
              _tooltip: O.create(
                "div",
                {
                  className: this.theme + " esriDirectionsRouteTooltip",
                  onmouseover: a
                },
                this.map.container
              ),
              _showTooltip: d.hitch(this, function(a) {
                b._tooltip.style.display =
                  !a || a instanceof MouseEvent ? "none" : "inline";
                a &&
                  ((a =
                    "string" === typeof a
                      ? a
                      : "\x3ctable class\x3d'esriRoutesTooltip'\x3e" +
                        this._renderDirectionsItemTR(a) +
                        "\x3c/table\x3e"),
                  b._tooltip.innerHTML !== a && (b._tooltip.innerHTML = a));
              }),
              _isShown: d.hitch(this, function() {
                return -1 < v.indexOf(this._stopLayer.graphics, b);
              }),
              _remove: a
            });
            this._activate(this.mapClickActive);
          },
          startup: function() {
            this.inherited(arguments);
            return this._enqueue(this._init);
          },
          destroy: function() {
            this.deactivate();
            this.map.removeLayer(this._barriersLayer);
            this.map.removeLayer(this._polylineBarriersLayer);
            this.map.removeLayer(this._polygonBarriersLayer);
            this.map.removeLayer(this._routeLayer);
            this.map.removeLayer(this._stopLayer);
            this.map.removeLayer(this._waypointsEventLayer);
            this._disconnectEvents();
            O.empty(this.domNode);
            this.inherited(arguments);
          },
          activate: function() {
            return this._enqueue(function() {
              this.deactivateBarrierTool().then(
                d.hitch(this, function() {
                  this.set("mapClickActive", !0);
                })
              );
            });
          },
          deactivate: function() {
            return this._enqueue(function() {
              this.deactivateBarrierTool().then(
                d.hitch(this, function() {
                  this.set("mapClickActive", !1);
                })
              );
            });
          },
          activateBarrierTool: function() {
            return this._enqueue(function() {
              this.set("mapClickActive", !1);
              this.set("barrierToolActive", !0);
            });
          },
          deactivateBarrierTool: function() {
            return this._enqueue(function() {
              this.set("mapClickActive", !1);
              this.set("barrierToolActive", !1);
            });
          },
          clearDirections: function() {
            return this._enqueue(function() {
              this.clearMessages();
              return this._clearDirections();
            });
          },
          reset: function() {
            return this._enqueue(this._reset);
          },
          modifyStopSequence: function(a, b) {
            return this._enqueue(function() {
              return this._modifyStopSequence(a, b);
            });
          },
          onActivate: function() {},
          onDeactivate: function() {},
          onActivateBarrierTool: function() {},
          onDeactivateBarrierTool: function() {},
          onLoad: function() {
            this._enableButton(this._getDirectionsButtonNode);
          },
          onDirectionsStart: function() {
            this._clearDisplayBeforeSolve();
            this.set("solving", !0);
            this._showLoadingSpinner(!0);
          },
          onDirectionsFinish: function() {
            this._showLoadingSpinner(!1);
            this.set("solving", !1);
          },
          onDirectionsClear: function() {},
          onSegmentSelect: function() {},
          onSegmentHighlight: function() {},
          onStopsUpdate: function() {},
          onRouteItemCreated: function() {},
          onRouteItemUpdated: function() {},
          onFeatureCollectionCreated: function() {},
          onError: function() {},
          removeStops: function() {
            return this.reset();
          },
          removeStop: function(a, b, c) {
            return this._enqueue(function() {
              this.clearMessages();
              return this._removeStop(a, b, c);
            });
          },
          updateStops: function(a) {
            return this._enqueue(function() {
              return this._updateStops(a);
            });
          },
          addStops: function(a, b) {
            return this._enqueue(function() {
              return this._addStops(a, b);
            }).then(d.hitch(this, this.zoomToFullRoute));
          },
          addStop: function(a, b) {
            return this._enqueue(
              function() {
                return this._addStop(a, b);
              },
              { _incrementalSolveStopRange: this._incrementalSolveStopRange }
            );
          },
          updateStop: function(a, b, c) {
            return this._enqueue(
              function() {
                return this._updateStop(a, b, c);
              },
              { _incrementalSolveStopRange: this._incrementalSolveStopRange }
            );
          },
          setBarriers: function(a) {
            this.routeParams.barriers = a;
            return this._getDirections().then(
              d.hitch(this, function() {
                this.zoomToFullRoute();
              })
            );
          },
          setPolylineBarriers: function(a) {
            this.routeParams.polylineBarriers = a;
            return this._getDirections().then(
              d.hitch(this, function() {
                this.zoomToFullRoute();
              })
            );
          },
          setPolygonBarriers: function(a) {
            this.routeParams.polygonBarriers = a;
            return this._getDirections().then(
              d.hitch(this, function() {
                this.zoomToFullRoute();
              })
            );
          },
          clearMessages: function() {
            this.messages = [];
            this._msgNode && (this._msgNode.innerHTML = "");
          },
          getDirections: function(a) {
            return this._enqueue(function() {
              return this._getDirections().then(
                d.hitch(this, function() {
                  !0 !== a && this.zoomToFullRoute();
                })
              );
            });
          },
          selectSegment: function(a) {
            if (
              !(
                !this.directions ||
                !this.directions.features ||
                0 > a ||
                a >= this.directions.features.length
              )
            )
              for (
                var b = C("[data-segment]", this._resultsNode), c = 0;
                c < b.length;
                c++
              ) {
                var z = parseInt(N.get(b[c], "data-segment"), 10);
                if (a === z && b[c] !== this._focusedDirectionsItem) {
                  this._focusedDirectionsItem = b[c];
                  this.centerAtSegmentStart(a);
                  this.onSegmentSelect(this.directions.features[a]);
                  b[c].focus();
                  break;
                }
              }
          },
          unhighlightSegment: function(a) {
            var b = this._segmentGraphics;
            if (b && (!this._focusedDirectionsItem || a)) {
              for (a = 0; a < b.length; a++) this._routeLayer.remove(b[a]);
              this._segmentGraphics = [];
            }
          },
          highlightSegment: function(a, b) {
            if (
              !(
                (this._focusedDirectionsItem && !b) ||
                a >= this.directions.features.length
              )
            ) {
              a = a || 0;
              var c = d.hitch(this, function(a) {
                  var b = this.map.toMap({ x: 0, y: 0 });
                  return this.map.toScreen(b.offset(a, 0)).x;
                }),
                z = d.hitch(this, function(a) {
                  for (var b = 0, z = 0; z < a.length; z++)
                    for (var d = 1; d < a[z].length; d++)
                      var e = a[z][d - 1],
                        P = a[z][d],
                        b =
                          b +
                          c(
                            Math.sqrt(
                              (e[0] - P[0]) * (e[0] - P[0]) +
                                (e[1] - P[1]) * (e[1] - P[1])
                            )
                          );
                  return b;
                }),
                e = d.hitch(this, function(a) {
                  var b = this.map.toMap({ x: 0, y: 0 });
                  return this.map.toMap({ x: a, y: 0 }).x - b.x;
                }),
                P = function(a, b, z) {
                  b = Math.max(1, b);
                  for (
                    var d = z ? a[0].length - 1 : 0,
                      e = 0,
                      P,
                      l,
                      T,
                      k = [[a[0][z ? d : 0]]];
                    (z && 0 < d) || (!z && d < a[0].length - 1);

                  ) {
                    l = a[0][z ? d - 1 : d];
                    T = a[0][z ? d : d + 1];
                    if (
                      (P = c(
                        Math.sqrt(
                          (l[0] - T[0]) * (l[0] - T[0]) +
                            (l[1] - T[1]) * (l[1] - T[1])
                        )
                      ))
                    )
                      if (e + P < b)
                        z ? k[0].splice(0, 0, l) : k[0].push(T), (e += P);
                      else {
                        b = (b - e) / P;
                        z
                          ? k[0].splice(0, 0, [
                              T[0] - (T[0] - l[0]) * b,
                              T[1] - (T[1] - l[1]) * b
                            ])
                          : k[0].push([
                              l[0] + (T[0] - l[0]) * b,
                              l[1] + (T[1] - l[1]) * b
                            ]);
                        break;
                      }
                    d += z ? -1 : 1;
                  }
                  return 0 < e + P ? k : a;
                };
              b = this.get("directions").features[a];
              var l = new ga(b.geometry),
                k = (40 * Math.PI) / 180;
              d.mixin(b.attributes, { _index: a });
              if (a) {
                var f = P(
                    this.get("directions").features[a - 1].geometry.paths,
                    25,
                    !0
                  ),
                  g =
                    "esriDMTStop" !== b.attributes.maneuverType
                      ? P(l.paths, 25, !1)
                      : f,
                  f = g !== f ? [f[0].concat(g[0])] : g,
                  D = new ga(g).getExtent();
                if (
                  1 < g[0].length &&
                  15 <= c(Math.max(D.getWidth(), D.getHeight()))
                ) {
                  for (
                    var P = 15 * Math.cos(k / 2),
                      z = 15 * Math.sin(k / 2),
                      m = g[0].length - 2,
                      q,
                      k = g[0][m + 1],
                      D = 0;
                    0 <= m && !D;

                  )
                    (q = g[0][m]),
                      (D = c(
                        Math.sqrt(
                          (q[0] - k[0]) * (q[0] - k[0]) +
                            (q[1] - k[1]) * (q[1] - k[1])
                        )
                      )),
                      m--;
                  22 > D &&
                    ((g = D + (22 - D) / 3),
                    (m = D + (2 * (22 - D)) / 3),
                    (m = [
                      q[0] + (m / D) * (k[0] - q[0]),
                      q[1] + (m / D) * (k[1] - q[1])
                    ]),
                    (q = [
                      k[0] - (g / D) * (k[0] - q[0]),
                      k[1] - (g / D) * (k[1] - q[1])
                    ]),
                    (k = m),
                    (D = 22));
                  P /= D;
                  g = [k[0] - (k[0] - q[0]) * P, k[1] - (k[1] - q[1]) * P];
                  q[1] !== k[1]
                    ? ((P = (k[0] - q[0]) / (k[1] - q[1])),
                      (q = e(z / Math.sqrt(1 + P * P))),
                      (e = P * q))
                    : ((q = 0), (e = e(z)));
                  Infinity === Math.abs(q) ||
                    Infinity === Math.abs(e) ||
                    isNaN(q) ||
                    isNaN(e) ||
                    (f[0].push(k),
                    f[0].push([g[0] - q, g[1] + e]),
                    f[0].push([g[0] + q, g[1] - e]),
                    f[0].push(k));
                } else f = P(f, 2 * z(g), !0);
                l.paths = f;
              }
              this.unhighlightSegment(
                this._segmentGraphics && this._segmentGraphics.length
              );
              e = d
                .clone(this.routeSymbol)
                .setWidth(this.segmentSymbol.width)
                .setColor(
                  new x([
                    parseInt(0.9 * this.segmentSymbol.color.r),
                    parseInt(0.9 * this.segmentSymbol.color.g),
                    parseInt(0.9 * this.segmentSymbol.color.b)
                  ])
                );
              this._segmentGraphics = [
                new y(
                  b.geometry,
                  e,
                  b.attributes,
                  this.get("segmentInfoTemplate")
                ),
                new y(
                  l,
                  this.routeSymbol,
                  b.attributes,
                  this.get("segmentInfoTemplate")
                ),
                new y(
                  l,
                  this.segmentSymbol,
                  b.attributes,
                  this.get("segmentInfoTemplate")
                )
              ];
              this.get("showSegmentHighlight") &&
                (this._routeLayer.add(this._segmentGraphics[0]),
                this._routeLayer.add(this._segmentGraphics[1]),
                this._routeLayer.add(this._segmentGraphics[2]));
              b = d.hitch(this, function(a) {
                if (0 < a && a < this.directions.features.length) {
                  a = this.directions.features[a]
                    ._associatedFeaturesWithWaypoints;
                  for (var b = 0; b < a.length; b++)
                    a[b]._associatedSnapFeature &&
                      a[b]._associatedSnapFeature.getDojoShape() &&
                      a[b]._associatedSnapFeature.getDojoShape().moveToFront();
                }
              });
              b(a - 1);
              b(a);
              this.onSegmentHighlight(this.directions.features[a]);
            }
          },
          zoomToSegment: function(a) {
            var b,
              c = new J();
            this.directions && this.directions.features
              ? ((b = Math.max(
                  0,
                  Math.min(this.directions.features.length - 1, a || 0)
                )),
                this.map
                  .setExtent(
                    this.get("directions").features[b].geometry.getExtent(),
                    !0
                  )
                  .promise.always(
                    d.hitch(this, function() {
                      this.highlightSegment(b);
                      c.resolve();
                    })
                  ))
              : c.reject(Error("No directions."));
            return c.promise;
          },
          centerAtSegmentStart: function(a) {
            var b,
              c = new J();
            if (this.directions && this.directions.features) {
              b = Math.max(
                0,
                Math.min(this.directions.features.length - 1, a || 0)
              );
              var z = this.directions.features[b];
              this.map.centerAt(z.geometry.getPoint(0, 0)).promise.always(
                d.hitch(this, function() {
                  this.highlightSegment(b, !0);
                  this._showSegmentPopup(z, b);
                  c.resolve();
                })
              );
            } else c.reject(Error("No directions."));
            return c.promise;
          },
          zoomToFullRoute: function() {
            var a = new J();
            this.directions && this.directions.features
              ? (this._clearInfoWindow(),
                this.unhighlightSegment(),
                this.get("map")
                  .setExtent(this.get("directions").extent, !0)
                  .promise.always(a.resolve))
              : a.resolve();
            return a.promise;
          },
          setListIcons: function() {
            var a,
              b = this._dnd.getAllNodes();
            for (a = 0; a < b.length; a++) {
              var c = C("." + this._css.stopIconClass, b[a])[0];
              c && (c.innerHTML = this._getLetter(a));
              E.remove(
                b[a],
                this._css.stopOriginClass +
                  " " +
                  this._css.stopDestinationClass +
                  " " +
                  this._css.stopUnreachedClass +
                  " " +
                  this._css.stopUnreachedFirstOrLastClass
              );
              c = this._getStopSymbol(this.stops[a]);
              c === this.fromSymbol
                ? E.add(b[a], this._css.stopOriginClass)
                : c === this.toSymbol
                ? E.add(b[a], this._css.stopDestinationClass)
                : c === this.unreachedSymbol &&
                  E.add(b[a], this._css.stopUnreachedClass);
            }
            a = C("[data-reverse-td]", this._dndNode)[0];
            O.destroy(a);
            this.get("showReverseStopsButton") &&
              O.create(
                "td",
                {
                  "data-reverse-td": "true",
                  rowspan: b.length,
                  className: this._css.esriStopReverseColumnClass,
                  innerHTML:
                    '\x3cdiv role\x3d"button" class\x3d"' +
                    this._css.reverseStopsClass +
                    '" data-reverse-stops\x3d"true" title\x3d"' +
                    B.widgets.directions.reverseDirections +
                    '"\x3e\x3c/div\x3e',
                  onmouseover: function(a) {
                    a.stopPropagation();
                  },
                  onmouseout: function(a) {
                    a.stopPropagation();
                  }
                },
                b[0]
              );
          },
          addRouteSymbols: function() {
            if (this.stopGraphics.length) {
              this._moveLayersToFront();
              for (var a = 0; a < this.stopGraphics.length; a++)
                if (
                  this.stopGraphics[a] &&
                  (!this._handle._isShown() ||
                    (this._handle._isShown() && this._handle._index !== a))
                ) {
                  this._stopLayer.add(this.stopGraphics[a]);
                  var b = this.stopGraphics[a].getDojoShape();
                  b && b.moveToFront();
                  this._stopLayer.add(this.textGraphics[a]);
                  (b = this.textGraphics[a].getDojoShape()) && b.moveToFront();
                }
              this._moveInProgress &&
                !this._handle.attributes.isWaypoint &&
                this._handle.getDojoShape() &&
                this._handle.getDojoShape().moveToFront();
            }
          },
          createRouteSymbols: function() {
            this._clearStopGraphics();
            for (
              var a = this.stops,
                b = function(a) {
                  var b = {},
                    c;
                  for (c in a)
                    a.hasOwnProperty(c) &&
                      0 === c.indexOf("Attr_") &&
                      (b[c] = a[c]);
                  return b;
                },
                c = 0;
              c < a.length;
              c++
            ) {
              var e = a[c];
              if (e && e.feature) {
                var l = e.feature.attributes,
                  k = l ? l.Status : void 0,
                  f = null;
                this._isStopAWaypoint(e) ||
                  ((f = new qa(
                    this._getLetter(c),
                    this.get("textSymbolFont"),
                    this.get("textSymbolColor")
                  )),
                  this.get("textSymbolOffset") &&
                    f.setOffset(
                      this.get("textSymbolOffset").x,
                      this.get("textSymbolOffset").y
                    ));
                f = new y(
                  e.feature.geometry,
                  f,
                  { address: e.name },
                  this.get("stopsInfoTemplate")
                );
                f._isStopLabel = !0;
                f._index = c;
                e = new y(
                  e.feature.geometry,
                  this._getStopSymbol(e),
                  d.mixin(
                    {
                      address: e.name,
                      Status: void 0 === k ? 0 : k,
                      CurbApproach: l && l.CurbApproach ? l.CurbApproach : null,
                      TimeWindowStart:
                        l && l.TimeWindowStart ? l.TimeWindowStart : null,
                      TimeWindowEnd:
                        l && l.TimeWindowEnd ? l.TimeWindowEnd : null,
                      isWaypoint: this._isStopAWaypoint(e)
                    },
                    b(l)
                  ),
                  this.get(
                    this._isStopAWaypoint(e)
                      ? "waypointInfoTemplate"
                      : "stopsInfoTemplate"
                  )
                );
                e._isStopIcon = !0;
                e._index = c;
                this.stopGraphics[c] = e;
                this.textGraphics[c] = f;
              }
            }
            this.set("stopGraphics", this.stopGraphics);
            this.set("textGraphics", this.textGraphics);
            this._showBarriers();
            this.addRouteSymbols();
            this.setListIcons();
          },
          setTravelMode: function(a) {
            return this._enqueue(function() {
              this.clearMessages();
              this._travelModeSelector.setValue(a);
              return this._setTravelMode(a);
            });
          },
          getSupportedTravelModeNames: function() {
            var a = [],
              b = this.serviceDescription;
            if (b && b.supportedTravelModes && b.supportedTravelModes.length)
              for (var b = b.supportedTravelModes, c = 0; c < b.length; c++)
                a.push(b[c].name);
            return a;
          },
          setDirectionsLengthUnits: function() {
            var a =
              1 === arguments.length
                ? arguments[0]
                : this.get("directionsLengthUnits");
            return this._enqueue(function() {
              this.clearMessages();
              return this._setDirectionsLengthUnits(a);
            });
          },
          setDirectionsLanguage: function() {
            var a =
              1 === arguments.length
                ? arguments[0]
                : this.get("directionsLanguage");
            return this._enqueue(function() {
              this.clearMessages();
              return this._setDirectionsLanguage(a);
            });
          },
          useMyCurrentLocation: function(a) {
            this.clearMessages();
            return this._createLocateButton(this.geocoders[a], !0, !0);
          },
          loadRoute: function(a) {
            return this._enqueue(
              d.hitch(this, function() {
                return this._loadRoute(a);
              })
            );
          },
          _getStopsAttr: function() {
            return this.returnToStart && this._returnToStartStop
              ? this.stops.concat(this._returnToStartStop)
              : this.stops;
          },
          _getTravelModeNameAttr: function() {
            return (
              this.routeParams &&
              this.routeParams.travelMode &&
              this.routeParams.travelMode.name
            );
          },
          _reset: function() {
            var a = this.mapClickActive || this.barrierToolActive;
            this._clearBarriersGraphics();
            this._setWidgetProperties();
            return this._init().then(
              d.hitch(this, function() {
                this.mapClickActive = !a;
                this.set("mapClickActive", a);
                this._searchSourceSelector &&
                  this._searchSourceSelector.setValue("all");
              })
            );
          },
          _activate: function() {
            var a = this.get("mapClickActive"),
              b = d.hitch(this, function(a) {
                for (
                  var b = a
                      ? [
                          this.textGraphics,
                          this.stopGraphics,
                          this.displayedManeuverPointGraphics,
                          this.displayedRouteGraphics
                        ]
                      : [
                          this.displayedRouteGraphics,
                          this.displayedManeuverPointGraphics,
                          this.stopGraphics,
                          this.textGraphics
                        ],
                    c = 0;
                  c < b.length;
                  c++
                )
                  for (var d = b[c], z = 0; z < d.length; z++) {
                    var e = d[z].getDojoShape();
                    e && e[a ? "moveToBack" : "moveToFront"].call(e);
                  }
              });
            this.drawToolbar &&
              ((this.barrierToolActive = !1),
              this.drawToolbar.deactivate(),
              E.remove(
                this._lineBarrierButtonNode,
                this._css.stopsPressedButtonClass
              ));
            this._addStopOnMapClickListener &&
              this._addStopOnMapClickListener.remove();
            a
              ? (this.map.activeDirectionsWidget &&
                  this.map.activeDirectionsWidget !== this &&
                  this.map.activeDirectionsWidget.deactivate(),
                (this.map.activeDirectionsWidget = this),
                (this._addStopOnMapClickListener = m(
                  this.map,
                  "click",
                  d.hitch(this, function(a) {
                    this.canModifyStops &&
                      !this._solveInProgress &&
                      (this.map.infoWindow.hide(),
                      this.addStop(new y(a.mapPoint)));
                  })
                )),
                this.map.addLayer(this._waypointsEventLayer),
                this._moveLayersToFront(),
                E.add(
                  this._activateButtonNode,
                  this._css.stopsPressedButtonClass
                ),
                this.onActivate())
              : (this.map.removeLayer(this._waypointsEventLayer),
                E.remove(
                  this._activateButtonNode,
                  this._css.stopsPressedButtonClass
                ),
                this.onDeactivate());
            b(!a);
            this.emit("map-click-active", {
              mapClickActive: this.mapClickActive
            });
          },
          _activateBarrierTool: function() {
            this.get("barrierToolActive")
              ? (this.map.activeDirectionsWidget &&
                  this.map.activeDirectionsWidget !== this &&
                  this.map.activeDirectionsWidget.deactivate(),
                (this.map.activeDirectionsWidget = this),
                this.drawToolbar.activate(ma.FREEHAND_POLYLINE),
                E.add(
                  this._lineBarrierButtonNode,
                  this._css.stopsPressedButtonClass
                ),
                this.onActivateBarrierTool())
              : (this.drawToolbar.deactivate(),
                E.remove(
                  this._lineBarrierButtonNode,
                  this._css.stopsPressedButtonClass
                ),
                this.onDeactivateBarrierTool());
            this.emit("barrier-tool-active", {
              barrierToolActive: this.barrierToolActive
            });
          },
          _moveLayersToFront: function() {
            var a = this.get("map"),
              b = a.graphicsLayerIds.length - 1;
            a.reorderLayer(this._routeLayer, b);
            a.reorderLayer(this._polygonBarriersLayer, b);
            a.reorderLayer(this._polylineBarriersLayer, b);
            a.reorderLayer(this._barriersLayer, b);
            a.reorderLayer(this._waypointsEventLayer, b);
            a.reorderLayer(this._stopLayer, b);
          },
          _destroyGeocoders: function() {
            for (; this.geocoders && this.geocoders.length; ) {
              if (this.geocoders[0])
                try {
                  this.geocoders[0].destroy();
                } catch (z) {}
              this.geocoders.splice(0, 1);
            }
            this.geocoders = [];
          },
          _disconnectEvents: function() {
            var a = this._clearDirections(!0),
              b;
            if (this._watchEvents && this._watchEvents.length)
              for (b = 0; b < this._watchEvents.length; b++)
                this._watchEvents[b].unwatch();
            if (this._onEvents && this._onEvents.length)
              for (b = 0; b < this._onEvents.length; b++)
                this._onEvents[b].remove();
            if (this._geocoderEvents)
              for (b = 0; b < this._geocoderEvents.length; b++)
                this._geocoderEvents[b].value.unwatch(),
                  this._geocoderEvents[b].blur.remove(),
                  this._geocoderEvents[b].select.remove(),
                  this._geocoderEvents[b].suggest.remove();
            this._onEvents = [];
            this._watchEvents = [];
            this._geocoderEvents = [];
            this._disconnectResults();
            this._destroyGeocoders();
            this._destroyGlobalGeocoder();
            this._destroyDnD();
            return a;
          },
          _getDirections: function() {
            var a = new J();
            this._removeEmptyStops();
            1 < this._getStopCount() + this._getWaypointCount() && this.loaded
              ? (this.onDirectionsStart(),
                this.clearMessages(),
                this._dnd.sync(),
                this._sortGeocoders(),
                this._getCandidates(this.stops).then(
                  d.hitch(this, function(b) {
                    this.stops = b;
                    this._setStops();
                    this._configureRoute().always(
                      d.hitch(this, function(b) {
                        a.resolve(b);
                      })
                    );
                  }),
                  d.hitch(this, function(b) {
                    this.set("directions", null);
                    this._clearRouteGraphics();
                    a.reject(b);
                    this.onDirectionsFinish(b);
                  })
                ))
              : this._clearDirections(!0).always(
                  d.hitch(this, function() {
                    this.createRouteSymbols();
                    a.resolve();
                  })
                );
            return a.promise;
          },
          _clearDirections: function() {
            var a = new J();
            this._handle && this._handle._remove();
            this.get("routeParams") && this.get("routeParams").stops
              ? this.get("routeParams").stops.features.length
                ? ((this.get("routeParams").stops.features = []),
                  this.onDirectionsClear(),
                  a.resolve())
                : arguments.length
                ? a.resolve()
                : this._reset().then(a.resolve, a.reject)
              : a.resolve();
            this.set("directions", null);
            this._clearDisplayBeforeSolve();
            this._clearDisplayAfterSolve();
            this._routeLayer.clear();
            this._waypointsEventLayer.clear();
            this._stopLayer.clear();
            return a.promise;
          },
          _setTravelMode: function(a) {
            var b = new J(),
              c = this.serviceDescription,
              d = function() {
                b.resolve(a);
              };
            if (c && c.supportedTravelModes && c.supportedTravelModes.length) {
              for (
                var z = c.supportedTravelModes, e = !1, c = 0;
                c < z.length;
                c++
              )
                if (z[c].name === a) {
                  e = !0;
                  !this.routeParams.travelMode ||
                  (this.routeParams.travelMode &&
                    this.routeParams.travelMode.name !== a)
                    ? ((this.routeParams.travelMode = z[c]
                        .impedanceAttributeName
                        ? z[c]
                        : z[c].itemId),
                      this._checkStartTimeUIAvailability(),
                      this._solveAndZoom().always(d))
                    : d();
                  this._travelModeSelector &&
                    this._travelModeSelector.domNode &&
                    (this._travelModeSelector.domNode.title = z[c].description);
                  break;
                }
              e || b.reject(a);
            } else b.reject(a);
            return b.promise;
          },
          _setDirectionsLengthUnits: function(a) {
            this._clearDisplayBeforeSolve();
            var b = new J();
            E.remove(this._useMilesNode, this._css.stopsPressedButtonClass);
            E.remove(
              this._useKilometersNode,
              this._css.stopsPressedButtonClass
            );
            a === K.KILOMETERS
              ? E.add(
                  this._useKilometersNode,
                  this._css.stopsPressedButtonClass
                )
              : a === K.MILES &&
                E.add(this._useMilesNode, this._css.stopsPressedButtonClass);
            a === K.KILOMETERS ||
            a === K.METERS ||
            a === K.MILES ||
            a === K.FEET ||
            a === K.YARDS ||
            a === K.NAUTICAL_MILES
              ? ((this.directionsLengthUnits = a), b.resolve(a))
              : b.reject(a);
            return b.promise;
          },
          _setDirectionsLanguage: function(a) {
            this._clearDisplayBeforeSolve();
            var b = new J();
            a = this._setDirectionsLanguageByLocale(a);
            this._solveAndZoom().always(function() {
              b.resolve(a);
            }, b.reject);
            return b.promise;
          },
          _showLoadingSpinner: function(a) {
            void 0 === a &&
              (a =
                (this._requestQueueTail &&
                  !this._requestQueueTail.isFulfilled()) ||
                this._moveInProgress);
            a
              ? (E.add(this._widgetContainer, this._css.resultsLoadingClass),
                E.add(this._resultsNode, "esriRoutesContainerBusy"))
              : (E.remove(this._widgetContainer, this._css.resultsLoadingClass),
                E.remove(this._resultsNode, "esriRoutesContainerBusy"));
          },
          _enqueue: function(a, b) {
            var c = new J();
            this._requestQueueTail ||
              ((this._requestQueueTail = new J()),
              this._requestQueueTail.resolve());
            this._requestQueueTail.promise.always(
              d.hitch(this, function() {
                try {
                  d.mixin(this, { _incrementalSolveStopRange: null }, b);
                  var z = a.call(this);
                  z && "object" === typeof z && z.hasOwnProperty("isFulfilled")
                    ? z.then(
                        d.hitch(this, function(a) {
                          c.resolve(a);
                          this._showLoadingSpinner();
                        }),
                        d.hitch(this, function(a) {
                          c.reject(a);
                          this._showLoadingSpinner();
                        })
                      )
                    : (c.resolve(z), this._showLoadingSpinner());
                } catch (za) {
                  c.reject(za), this._showLoadingSpinner();
                }
              })
            );
            this._requestQueueTail = c;
            this._showLoadingSpinner();
            return c.promise;
          },
          _createDnD: function() {
            this._dnd = new V(this._dndNode, { skipForm: !0, withHandles: !0 });
          },
          _destroyDnD: function() {
            O.empty(this._dndNode);
            this._dnd && (this._dnd.destroy(), (this._dnd = null));
          },
          _createDepartAtControls: function() {
            if (this._departAtTime)
              this.map && this._restoreMapTimeExtent(),
                (this._useTrafficItemNode.title =
                  B.widgets.directions.trafficLabelLive),
                E.remove(this._departAtContainer, "departAtContainerVisible"),
                (this.startTime = "now"),
                this._updateStartTimeUI();
            else {
              var a = this,
                b = function() {
                  this._keepDirections || a._clearDisplayBeforeSolve();
                  this._keepDirections = !1;
                },
                c = d.hitch(this, function() {
                  this.map && this.map.disableKeyboardNavigation();
                }),
                e = d.hitch(this, function() {
                  this.map && this.map.enableKeyboardNavigation();
                });
              this._departAtTime = new g(
                {
                  required: !0,
                  value: new Date(),
                  onChange: b,
                  onFocus: c,
                  onBlur: e
                },
                this._departAtTimeContainer
              );
              this._departAtDate = new F(
                {
                  required: !0,
                  value: new Date(),
                  onChange: b,
                  onFocus: c,
                  onBlur: e,
                  constraints: { min: new Date(864e5) }
                },
                this._departAtDateContainer
              );
            }
          },
          _setStartTime: function(a, b, c) {
            if (isNaN(c)) this.startTime = "now" === c ? c : "none";
            else {
              b = c instanceof Date ? c : new Date(c);
              c =
                this.directions &&
                this.directions.features &&
                this.directions.features[0] &&
                this.directions.features[0].attributes;
              var d = 6e4 * -b.getTimezoneOffset();
              b = new Date(
                b - d + (c && c.arriveTimeUTC ? c.ETA - c.arriveTimeUTC : d)
              );
              this._departAtTime._keepDirections = !a;
              this._departAtDate._keepDirections = !a;
              this._departAtTime.setValue(b);
              this._departAtDate.setValue(b);
            }
            this._updateStartTimeUI();
          },
          _checkStartTimeUIAvailability: function() {
            var a = this._getImpedanceAttribute(),
              a =
                this._isTimeUnits(a ? a.units : "") ||
                (this.serviceDescription &&
                  10.6 <= this.serviceDescription.currentVersion);
            this._startTimeButtonNode.disabled = !a;
            E[a ? "remove" : "add"].apply(this, [
              this._startTimeButtonNodeContainer,
              "esriLinkButtonDisabled"
            ]);
            E[a ? "remove" : "add"].apply(this, [
              this._startTimeDDLArrow,
              "esriDirectionsDDLArrowDisabled"
            ]);
            a || this.set("startTime", "now");
          },
          _usingAGOL: function(a) {
            a || (a = this.routeTaskUrl);
            return -1 < a.search(/^(https?:)*\/\/*[^.]*\.arcgis\.com.*$/i);
          },
          _usingRouteAGOL: function() {
            return (
              -1 <
              this.get("routeTaskUrl").search(
                /^(https?:)*\/\/route*[^.]*\.arcgis\.com.*$/i
              )
            );
          },
          _setSearchOptions: function() {
            var a = {
              map: this.get("map"),
              autoNavigate: !1,
              enableInfoWindow: !1,
              enableHighlight: !1,
              enableSourcesMenu: !1
            };
            this.searchOptions = d.mixin(
              { maxResults: 1, locationToAddressDistance: 100 },
              this.defaults.searchOptions,
              a
            );
          },
          _setDefaultUnits: function() {
            if (!this.get("directionsLengthUnits")) {
              var a =
                "EN-US" === u.locale.toUpperCase() ? K.MILES : K.KILOMETERS;
              this.defaults.directionsLengthUnits
                ? (a = this.defaults.directionsLengthUnits)
                : this.userOptions.routeParams &&
                  this.userOptions.routeParams.directionsLengthUnits &&
                  (a = this.userOptions.routeParams.directionsLengthUnits);
              this.set("directionsLengthUnits", a);
            }
            this._setDirectionsLengthUnits(this.directionsLengthUnits);
          },
          _setTrafficOptions: function() {
            this._usingRouteAGOL() &&
              !this.trafficLayer &&
              (this.trafficLayer = new S(
                ea +
                  "//traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer",
                { opacity: 0.4 }
              ));
            this.trafficLayer &&
              this.trafficLayer.url &&
              this._usingAGOL(this.trafficLayer.url) &&
              (this._trafficAvailabilityButton.style.display = "inline-block");
            this.set(
              "showTrafficOption",
              (this.defaults.showTrafficOption ||
                !this.defaults.hasOwnProperty("showTrafficOption")) &&
                !!this.trafficLayer
            );
            this._optionsMenu();
          },
          _updateCanModifyStops: function(a, b) {
            this.canModifyStops ||
              this.canModifyWaypoints ||
              this.set("mapClickActive", !1);
            b ||
              !this.canModifyStops ||
              this.canModifyWaypoints ||
              this.set("mapClickActive", !0);
            this._showAddDestination();
            this._showMapClickActiveButton();
            this._stopsTableCover.style.display = this.canModifyStops
              ? "none"
              : "inline";
          },
          _updateCanAddWaypoints: function(a, b) {
            this.canModifyStops ||
              this.canModifyWaypoints ||
              this.set("mapClickActive", !1);
            b ||
              this.canModifyStops ||
              !this.canModifyWaypoints ||
              this.set("mapClickActive", !0);
            this._showMapClickActiveButton();
            this._handle._remove();
          },
          _updateStartTimeUI: function() {
            isNaN(this.startTime)
              ? ((this._startTimeButtonLabel.innerHTML =
                  "now" == this.startTime
                    ? this._i18n.widgets.directions.leaveNow
                    : this._i18n.widgets.directions.noStartTime),
                E.remove(this._startTimeButtonNodeContainer, "departAtButton"),
                E.remove(this._departAtContainer, "departAtContainerVisible"))
              : (E.add(this._startTimeButtonNodeContainer, "departAtButton"),
                E.add(this._departAtContainer, "departAtContainerVisible"),
                (this._startTimeButtonLabel.innerHTML = this._i18n.widgets.directions.departAt));
          },
          _setWidgetProperties: function() {
            this._disconnectEvents();
            this.set(this.defaults);
            this.routeLayer = d.clone(this.defaults.routeLayer);
            this._folderSelector &&
              (this._outputLayer.setValue(""),
              this._outputLayer.set("disabled", !0),
              this._folderSelector.set("disabled", !0));
            this.set("stops", []);
            this._updateCanModifyStops();
          },
          _updateStops: function(a) {
            var b = new J();
            a
              ? this.get("loaded")
                ? this._reset().then(
                    d.hitch(this, function() {
                      this._addStops(a).then(b.resolve, b.reject);
                    }),
                    b.reject
                  )
                : this._addStops(a).then(b.resolve, b.reject)
              : b.reject();
            return b.promise;
          },
          _removeStop: function(a, b, c, e) {
            var z = new J(),
              l = d.hitch(this, function(a) {
                this.stops.splice(a, 1);
                var b = this._dnd.getAllNodes()[a],
                  c = this.get("geocoders");
                this._geocoderEvents[b.id] &&
                  (this._geocoderEvents[b.id].blur.remove(),
                  this._geocoderEvents[b.id].select.remove(),
                  this._geocoderEvents[b.id].suggest.remove(),
                  this._geocoderEvents[b.id].value.unwatch());
                c[a].destroy();
                c.splice(a, 1);
                this.set("geocoders", c);
                O.destroy(b);
                this._dnd.sync();
                this._stopsRemovable();
                this._optionsMenu();
                this._checkMaxStops();
                this.setListIcons();
                this._sortGeocoders();
              });
            if (0 > a || a >= this.stops.length || void 0 === a)
              a = this.stops.length - 1;
            var P = !1;
            for (
              e =
                (this.stopGraphics[a] &&
                  this._isStopAWaypoint(this.stops[a])) ||
                e;
              !P;

            )
              l(a),
                e
                  ? (P = !0)
                  : ((a -=
                      0 >= a ||
                      (a < this.stops.length &&
                        this._isStopAWaypoint(this.stops[a]))
                        ? 0
                        : 1),
                    (P = !this._isStopAWaypoint(this.stops[a])));
            for (
              ;
              this.stops.length - this._getWaypointCount() < this.minStops;

            )
              this._addStop();
            this._clearStopsStatusAttr();
            this._setStops();
            this.createRouteSymbols();
            c
              ? (this._clearDisplayBeforeSolve(),
                this._clearDisplayAfterSolve(),
                this.createRouteSymbols(),
                z.resolve())
              : this._solveAndZoom(b).then(z.resolve, z.reject);
            return z.promise;
          },
          _removeTrafficLayer: function() {
            this.trafficLayer &&
              this.map &&
              this.map.removeLayer(this.trafficLayer);
            this._trafficLayerAdded = !1;
          },
          _addStops: function(a, b) {
            var c = new J(),
              z = [],
              e = this.autoSolve;
            this.autoSolve = !1;
            void 0 === b && (b = this._getStopCount());
            for (
              var l = 0;
              l < Math.min(a.length, this.maxStops - this._getStopCount());
              l++
            ) {
              var P = new J();
              this._addStop(a[l], b + l, !0).always(P.resolve);
              z.push(P);
            }
            M(z).always(
              d.hitch(this, function() {
                this.autoSolve = e;
                this._getDirections().always(function() {
                  c.resolve(a);
                });
              })
            );
            return c.promise;
          },
          _addStop: function(a, b, c) {
            var z = new J();
            this._checkMaxStops();
            this.maxStopsReached
              ? (this._showMessage(B.widgets.directions.error.maximumStops),
                z.reject(Error(B.widgets.directions.error.maximumStops)))
              : (void 0 === a && void 0 === b && (b = this.stops.length),
                a instanceof y &&
                a.attributes &&
                a.attributes.isWaypoint &&
                (!b || b === this.stops.length || 2 > this._getStopCount()) &&
                !c
                  ? (this._showMessage(
                      B.widgets.directions.error.waypointShouldBeInBetweenStops
                    ),
                    z.reject(
                      Error(
                        B.widgets.directions.error
                          .waypointShouldBeInBetweenStops
                      )
                    ))
                  : this._getCandidate(a).then(
                      d.hitch(this, function(a) {
                        this._isStopAWaypoint(a) &&
                          a &&
                          a.feature &&
                          (a.feature.attributes = d.mixin(
                            {},
                            a.feature.attributes,
                            { isWaypoint: !0, CurbApproach: 3 }
                          ));
                        this._insertStop(a, b);
                        this.autoSolve && "" !== a.name
                          ? this._getDirections().always(function() {
                              z.resolve(a, b);
                            })
                          : z.resolve(a, b);
                      }),
                      d.hitch(this, function(a) {
                        z.reject(a);
                      })
                    ));
            return z.promise;
          },
          _removeEmptyStops: function() {
            for (
              var a = 0,
                b =
                  this.stops.length - this._getWaypointCount() - this.minStops;
              a < this.stops.length && 0 < b;

            )
              this.stops[a] && this.stops[a].name
                ? a++
                : (this._removeStop(a, !0, !0, !0),
                  b--,
                  this._moveInProgress &&
                    this._handle._index >= a &&
                    this._handle._isStopIcon &&
                    this._handle._index--);
          },
          _setReverseGeocode: function(a, b, c) {
            if (a.feature.geometry && -1 < c) {
              var z = { address: a.name };
              this.stopGraphics[c] &&
                (d.mixin(this.stopGraphics[c].attributes, z),
                this.stopGraphics[c].setGeometry(b));
              this.textGraphics[c] &&
                (d.mixin(this.textGraphics[c].attributes, z),
                this.textGraphics[c].setGeometry(b));
              this.set("stopGraphics", this.stopGraphics);
              this.set("textGraphics", this.textGraphics);
              (z = this.geocoders[c]) &&
                z.inputNode &&
                ((z.value = a.name), (z.inputNode.value = a.name));
              d.mixin(a.feature.attributes, this.stops[c].feature.attributes);
              this.stops[c] = a;
              this.stops[c].feature.setGeometry(b);
              this._setStops();
              return this._enqueue(function() {
                return this._getDirections();
              });
            }
          },
          _insertStop: function(a, b) {
            var c, d;
            if (void 0 === b)
              for (c = 0; c < this.geocoders.length; c++) {
                if (!this.geocoders[c].get("value")) {
                  d = this.geocoders[c];
                  break;
                }
              }
            else
              (c = b),
                this.geocoders[c] &&
                  !this.geocoders[c].get("value") &&
                  (d = this.geocoders[c]);
            !d || (void 0 !== b && b !== c) || this._isStopAWaypoint(a)
              ? (void 0 === b && (b = this.geocoders.length),
                this.stops.splice(b, 0, a),
                this._createGeocoder(a, b))
              : ((this.stops[c] = a),
                d.set("value", a.name),
                (d._stopReference = a));
            this._optionsMenu();
          },
          _createGeocoder: function(a, b) {
            var c = this._dnd.getAllNodes(),
              z = !1,
              e = !1,
              l = c.length;
            c[b] ? ((e = c[b]), (z = !0)) : (z = e = !1);
            var P = d.hitch(this, function(a, b) {
                var c = b
                    ? this._css.stopDnDHandleClass
                    : this._css.stopDnDHandleClassHidden,
                  d = b
                    ? this._css.stopDnDHandleClassHidden
                    : this._css.stopDnDHandleClass;
                E.replace(a.children[0], c, d);
                2 < this.geocoders.length &&
                  ((c = b
                    ? this._css.stopIconRemoveClass
                    : this._css.stopIconRemoveClassHidden),
                  (d = b
                    ? this._css.stopIconRemoveClassHidden
                    : this._css.stopIconRemoveClass),
                  E.replace(a.children[3].children[0], c, d));
              }),
              k = O.create("tr", {
                className: this._css.stopClass,
                style: this._isStopAWaypoint(a) ? "display:none;" : "",
                onmouseover: function() {
                  P(this, !0);
                },
                onmouseout: function() {
                  P(this, !1);
                }
              });
            O.create(
              "td",
              {
                className: this._css.stopDnDHandleClassHidden + " dojoDndHandle"
              },
              k
            );
            c = O.create("td", { className: this._css.stopIconColumnClass }, k);
            O.create(
              "div",
              {
                className: this._css.stopIconClass + " dojoDndHandle",
                innerHTML: this._getLetter(l),
                "data-center-at": "true"
              },
              c
            );
            l = O.create(
              "td",
              { className: this._css.esriStopGeocoderColumnClass },
              k
            );
            l = O.create("div", {}, l);
            c = O.create(
              "td",
              { className: this._css.stopIconRemoveColumnClass },
              k
            );
            O.create(
              "div",
              {
                className: this._css.stopIconRemoveClassHidden,
                role: "button",
                "data-remove": "true"
              },
              c
            );
            this._dnd.insertNodes(!1, [k], z, e);
            var z = d.mixin({}, this.get("searchOptions"), {
                value: a.name,
                activeSourceIndex: this._globalGeocoder.activeSourceIndex
              }),
              f = new oa(z, l),
              g = d.hitch(this, function(a, b) {
                this._enqueue(function() {
                  if (
                    b !== a &&
                    f._stopReference &&
                    f._stopReference.name !== b
                  ) {
                    var c = v.indexOf(this.stops, f._stopReference);
                    this.stops[c] = { name: b };
                    this._handle._remove();
                    this._removeSomeWaypoints(
                      this._markWPsForRemovalAfterUserChangedStopSequence(c)
                    );
                    this._setStops();
                    this._clearDisplayBeforeSolve();
                    this._clearDisplayAfterSolve();
                    this.createRouteSymbols();
                  }
                });
              });
            f._tr = k;
            f._stopReference = a;
            f.startup();
            this.geocoders.splice(b, 0, f);
            this._geocoderEvents[k.id] = {
              blur: f.on("blur", function() {
                "" !== this.value &&
                  this._stopReference &&
                  !this._stopReference.feature &&
                  this.search();
              }),
              select: f.on(
                "select-result",
                d.hitch(this, function(a) {
                  var b = !0;
                  if (a && (a.results || a.result)) {
                    var c = this._dnd.getAllNodes(),
                      c = v.indexOf(c, k),
                      d = f.value,
                      z =
                        a.results &&
                        a.results.results &&
                        a.results.results.length
                          ? a.results.results[0]
                          : a.result;
                    z
                      ? ((z.name = d),
                        (this.stops[c] = this._toPointGeometry(z)),
                        (this.geocoders[c]._stopReference = this.stops[c]),
                        g("", d))
                      : (this.removeStop(c),
                        this.set("directions", null),
                        this._showMessage(
                          B.widgets.directions.error.unknownStop.replace(
                            "\x3cname\x3e",
                            a.target.get("value")
                          )
                        ),
                        this._clearRouteGraphics(),
                        (b = !1));
                    b && this.getDirections();
                  }
                })
              ),
              suggest: f.on("suggest-results", function() {
                if (document.activeElement === this.inputNode)
                  for (
                    var a = C("LI[role\x3d'menuitem']", this.suggestionsNode),
                      b = 0;
                    b < a.length;
                    b++
                  )
                    N.set(a[b], "tabindex", -1);
                else this._hideSuggestionsMenu();
              }),
              value: f.watch("value", function(a, b, c) {
                g(b, c);
              })
            };
            this._checkMaxStops();
            this.setListIcons();
            this._stopsRemovable();
            this._optionsMenu();
            this._sortGeocoders();
          },
          _blurGeocoders: function() {
            if (document.activeElement)
              for (var a = 0; a < this.geocoders.length; a++)
                if (this.geocoders[a].inputNode === document.activeElement) {
                  this.geocoders[a]._hideSuggestionsMenu();
                  this.geocoders[a].inputNode.blur();
                  1 < this._getStopCount() + this._getWaypointCount() &&
                    this.getDirections(!0);
                  break;
                }
          },
          _decorateEmptyAGOLGeocoderResponse: function(a) {
            a &&
              ", , " === a.name &&
              (a.name =
                a.feature &&
                a.feature.attributes &&
                a.feature.attributes.Match_addr
                  ? a.feature.attributes.Match_addr +
                    ("POI" === a.feature.attributes.Addr_type &&
                    a.feature.attributes.City &&
                    -1 ===
                      a.feature.attributes.Match_addr.indexOf(
                        a.feature.attributes.City
                      )
                      ? ", " + a.feature.attributes.City
                      : "")
                  : "");
            return a;
          },
          _toPointGeometry: function(a) {
            var b = a.feature.geometry;
            b &&
              (b.getCentroid
                ? (a.feature.geometry = b.getCentroid())
                : b.getExtent &&
                  (b = b.getExtent()) &&
                  (a.feature.geometry = b.getCenter()));
            return a;
          },
          _removeLocateButtonVisibilityEvents: function() {
            for (var a = 0; a < this.geocoders.length; a++) {
              var b = this.geocoders[a];
              b._onMouseEnter && b._onMouseEnter.remove();
              b._onMouseOut && b._onMouseOut.remove();
              b._onKeyPress && b._onKeyPress.remove();
              b._locateButton &&
                (b._locateButton._onMouseEnter &&
                  b._locateButton._onMouseEnter.remove(),
                b._locateButton._onMouseOut &&
                  b._locateButton._onMouseOut.remove());
            }
          },
          _setLocateButtonVisibilityEvents: function() {
            this._removeLocateButtonVisibilityEvents();
            for (
              var a = this,
                b = function(b) {
                  b instanceof FocusEvent
                    ? (this._geocoder._lbShown_f = !0)
                    : (this._geocoder._lbShown_g = !0);
                  a._createLocateButton(this._geocoder, !0);
                },
                c = function(b) {
                  b instanceof FocusEvent
                    ? (this._geocoder._lbShown_f = !1)
                    : (this._geocoder._lbShown_g = !1);
                  clearTimeout(this._destroyTimeout);
                  this._destroyTimeout = setTimeout(
                    d.hitch(this, function() {
                      this._geocoder._lbShown_lb ||
                        this._geocoder._lbShown_f ||
                        a._destroyLocateButton(this._locateButton);
                    }),
                    400
                  );
                },
                l = function() {
                  this._geocoder._lbShown_g = !0;
                  clearTimeout(this._destroyTimeout);
                  this._destroyTimeout = setTimeout(
                    d.hitch(this, function() {
                      "" === this.value
                        ? a._createLocateButton(this._geocoder, !0)
                        : a._destroyLocateButton(this._locateButton);
                    }),
                    400
                  );
                },
                k = function() {
                  this._geocoder._lbShown_lb = !0;
                  clearTimeout(this._geocoder._destroyTimeout);
                },
                f = function() {
                  this._geocoder._lbShown_lb = !1;
                  clearTimeout(this._geocoder._destroyTimeout);
                  this._geocoder._destroyTimeout = setTimeout(
                    d.hitch(this, function() {
                      this._geocoder._lbShown_g ||
                        this._geocoder._lbShown_f ||
                        a._destroyLocateButton(
                          this._geocoder.inputNode._locateButton
                        );
                    }),
                    400
                  );
                },
                g = 0;
              g < this.geocoders.length;
              g++
            ) {
              var y = this.geocoders[g];
              y &&
                y.inputNode &&
                ((y.inputNode._geocoder = y),
                (y._onMouseEnter = m(y.inputNode, e.enter, b)),
                (y._onMouseOut = m(y.inputNode, [e.leave, "blur"], c)),
                (y._onKeyPress = m(y.inputNode, "keydown", l)),
                y.inputNode._locateButton &&
                  ((y = y.inputNode._locateButton),
                  (y._onMouseEnter = m(y.domNode, e.enter, k)),
                  (y._onMouseOut = m(y.domNode, e.leave, f))));
            }
          },
          _createLocateButton: function(a, b, c) {
            var e = new J();
            a.inputNode._locateButton && a.inputNode._locateButton._locating
              ? e.resolve()
              : h(
                  ["./LocateButton"],
                  d.hitch(this, function(z) {
                    this._destroyLocateButton(a.inputNode._locateButton);
                    if (a && !this._solveInProgress) {
                      var l = O.create("div", {}, a.domNode);
                      E.add(a.domNode, this._css.stopsInnerGeocoderClass);
                      var k = new z(
                        {
                          map: this.map,
                          highlightLocation: !1,
                          centerAt: !1,
                          setScale: !1,
                          useTracking: !1
                        },
                        l
                      );
                      k.startup();
                      a.inputNode._locateButton = k;
                      k.domNode._geocoder = a;
                      this._setLocateButtonVisibilityEvents();
                      z = d.hitch(this, function() {
                        k._locating = !0;
                        a.set("value", "");
                        a.inputNode.placeholder = B.widgets.directions.retrievingMyLocation.toUpperCase();
                      });
                      k._onBeforeLocate = m(k._locateNode, n, z);
                      k._onLocate = m(
                        k,
                        "locate",
                        d.hitch(this, function(c) {
                          k._locating = !1;
                          c.graphic
                            ? (b &&
                                this._destroyLocateButton(
                                  a.inputNode._locateButton
                                ),
                              this.updateStop(
                                new y(c.graphic.geometry),
                                v.indexOf(this.geocoders, a)
                              ).then(
                                d.hitch(this, function() {
                                  1 < this.stopGraphics.length
                                    ? this.getDirections().always(function() {
                                        e.resolve(c);
                                      })
                                    : e.resolve(c);
                                })
                              ))
                            : (a.set("value", ""),
                              (a.inputNode.placeholder = B.widgets.directions.myLocationError.toUpperCase()),
                              console.error(c.error),
                              e.reject(c.error));
                        })
                      );
                      c ? (z(), k.locate().then(null, e.reject)) : e.resolve();
                    } else e.resolve();
                  })
                );
            return e.promise;
          },
          _destroyLocateButton: function(a) {
            if (a) {
              var b = a.domNode._geocoder;
              clearTimeout(b._destroyTimeout);
              a._locating
                ? (b._destroyTimeout = setTimeout(
                    d.hitch(this, function() {
                      b._lbShown_lb ||
                        b._lbShown_f ||
                        this._destroyLocateButton(a);
                    }),
                    100
                  ))
                : (a.clear(),
                  a._onBeforeLocate.remove(),
                  a._onLocate.remove(),
                  a._onMouseEnter && a._onMouseEnter.remove(),
                  a._onMouseOut && a._onMouseOut.remove(),
                  a.destroy(),
                  b.inputNode &&
                    ((b.inputNode._locateButton = null),
                    b._setPlaceholder(b.activeSourceIndex)));
            }
          },
          _sortStops: function() {
            this.stops.length &&
              (this.stops.sort(
                d.hitch(this, function(a, b) {
                  for (var c, d, e = 0; e < this.get("geocoders").length; e++)
                    this.geocoders[e]._stopReference === a
                      ? (c = e)
                      : this.geocoders[e]._stopReference === b && (d = e);
                  return c > d ? 1 : d > c ? -1 : 0;
                })
              ),
              this._setStops());
          },
          _getCandidate: function(a) {
            var b = new J(),
              c = typeof a;
            a
              ? "object" === c &&
                a.hasOwnProperty("feature") &&
                a.hasOwnProperty("name")
                ? (a.feature.attributes &&
                    void 0 !== a.feature.attributes.displayName &&
                    !this._isStopAWaypoint(a) &&
                    ((a.name = a.feature.attributes.displayName),
                    (a.feature.attributes.Name = this._userDefinedStopName)),
                  (a.name = this._isStopAWaypoint(a)
                    ? this._waypointName
                    : String(a.name)),
                  "point" !== a.feature.geometry.type &&
                    (a.feature.geometry = new w(
                      [a.feature.geometry.x, a.feature.geometry.y],
                      this.map.spatialReference
                    )),
                  b.resolve(a))
                : "object" === c &&
                  a.hasOwnProperty("address") &&
                  a.hasOwnProperty("location")
                ? ((a = this._globalGeocoder._hydrateResult(a)), b.resolve(a))
                : "object" !== c ||
                  !a.hasOwnProperty("name") ||
                  (null !== a.name && "" !== a.name)
                ? a instanceof y &&
                  a.attributes &&
                  (void 0 !== a.attributes.Name || a.attributes.isWaypoint)
                  ? ((c = this._addStopWrapperToGraphic(
                      a,
                      a.attributes.isWaypoint
                        ? this._waypointName
                        : String(a.attributes.Name)
                    )),
                    String(a.attributes.Name) &&
                      (c.feature.attributes.Name = this._userDefinedStopName),
                    b.resolve(c))
                  : ("object" === c &&
                      a.hasOwnProperty("name") &&
                      (a = String(a.name)),
                    this._reverseGeocode(a).then(b.resolve, b.reject))
                : b.resolve(d.clone(this._emptyStop))
              : b.resolve(d.clone(this._emptyStop));
            return b.promise;
          },
          _reverseGeocode: function(a) {
            var b = new J(),
              c,
              e = a.geometry ? a.geometry : a;
            if (this._globalGeocoder) {
              var l = d.hitch(this, function(a) {
                  var b = new J(),
                    c = 500;
                  if (this.map) {
                    var d = this.map.toScreen(e);
                    d.x += Z._calculateClickTolerance([a]);
                    this.map.spatialReference.isWebMercator()
                      ? ((c = Math.abs(this.map.toMap(d).x - e.x)),
                        b.resolve(c))
                      : 4326 === this.map.spatialReference.wkid
                      ? ((c = Math.abs(
                          X.geographicToWebMercator(this.map.toMap(d)).x -
                            X.geographicToWebMercator(e).x
                        )),
                        b.resolve(c))
                      : this._geometryService &&
                        ((a = new ua()),
                        (a.distanceUnit = ia.UNIT_METER),
                        (a.geometry1 = e),
                        (a.geometry2 = this.map.toMap(d)),
                        this._geometryService.distance(
                          a,
                          function(a) {
                            c = a;
                            b.resolve(c);
                          },
                          function() {
                            b.resolve(c);
                          }
                        ));
                  }
                  return b.promise;
                }),
                z = [],
                k = this._globalGeocoder.sources,
                f = function() {
                  k[c].featureLayer &&
                    z.push(
                      l(k[c].featureLayer).then(
                        d.hitch(k[c], function(a) {
                          this.searchQueryParams = d.mixin(
                            this.searchQueryParams,
                            { distance: a }
                          );
                        })
                      )
                    );
                };
              if ("all" === this._globalGeocoder.activeSourceIndex)
                for (c = 0; c < k.length; c++) f();
              else (c = this._globalGeocoder.activeSourceIndex), f();
              M(z).always(
                d.hitch(this, function() {
                  this._globalGeocoder.search(e).then(
                    d.hitch(this, function(d) {
                      var l = !1;
                      if (d) {
                        var z = null,
                          k;
                        for (
                          c = 0;
                          c < this._globalGeocoder.sources.length;
                          c++
                        )
                          if (d[c] && d[c].length) {
                            k = d[c];
                            break;
                          }
                        if (
                          k.length &&
                          ((l = !0),
                          (z = k[0]),
                          this._globalGeocoder.sources[c].featureLayer)
                        )
                          for (
                            d = Number.POSITIVE_INFINITY, c = 0;
                            c < k.length;
                            c++
                          ) {
                            k[c] = this._toPointGeometry(k[c]);
                            var f = R.geodesicLengths(
                              [
                                new ga({
                                  paths: [
                                    [
                                      X.xyToLngLat(e.x, e.y),
                                      X.xyToLngLat(
                                        k[c].feature.geometry.x,
                                        k[c].feature.geometry.y
                                      )
                                    ]
                                  ],
                                  spatialReference: {
                                    wkid: this.map.spatialReference.wkid
                                  }
                                })
                              ],
                              "esriMeters"
                            )[0];
                            d > f && ((d = f), (z = k[c]));
                          }
                        (z = this._decorateEmptyAGOLGeocoderResponse(z)) &&
                        "" !== z.name &&
                        null !== z.name &&
                        void 0 !== z.name
                          ? ((z.name = String(z.name)),
                            isNaN(e.x) ||
                            isNaN(e.y) ||
                            this.map.spatialReference.wkid !==
                              e.spatialReference.wkid
                              ? !z.feature.geometry ||
                                isNaN(z.feature.geometry.x) ||
                                isNaN(z.feature.geometry.y)
                                ? (this._showMessage(
                                    B.widgets.directions.error.locator
                                  ),
                                  b.reject(
                                    Error(B.widgets.directions.error.locator)
                                  ))
                                : b.resolve(z)
                              : ((z.feature.geometry = e), b.resolve(z)))
                          : (l = !1);
                      }
                      l ||
                        (a instanceof w
                          ? (a = new y(a))
                          : a instanceof Array &&
                            (a = new y(new w(a[0], a[1]))),
                        a instanceof y
                          ? this._decorateUngeocodedStop(a).then(
                              b.resolve,
                              b.reject
                            )
                          : (this._showMessage(
                              B.widgets.directions.error.unknownStop.replace(
                                "\x3cname\x3e",
                                a.toString()
                              )
                            ),
                            b.reject(
                              Error(
                                B.widgets.directions.error.unknownStop.replace(
                                  "\x3cname\x3e",
                                  a.toString()
                                )
                              )
                            )));
                    })
                  );
                })
              );
            } else
              this._showMessage(B.widgets.directions.error.locatorUndefined),
                b.reject(Error(B.widgets.directions.error.locatorUndefined));
            return b.promise;
          },
          _updateStop: function(a, b, c) {
            var e = new J();
            this.stops && this.stops[b]
              ? a instanceof y &&
                a.attributes &&
                a.attributes.isWaypoint &&
                (!b || b === this.stops.length - 1 || 2 > this._getStopCount())
                ? (this._showMessage(
                    B.widgets.directions.error.waypointShouldBeInBetweenStops
                  ),
                  e.reject(
                    Error(
                      B.widgets.directions.error.waypointShouldBeInBetweenStops
                    )
                  ))
                : this._getCandidate(a).then(
                    d.hitch(this, function(a) {
                      var d = a.feature,
                        d = d ? d.geometry : null,
                        l = this.stops[b].feature,
                        l = l ? l.geometry : null,
                        d =
                          (d && l && (d.x !== l.x || d.y !== l.y)) || (!d && l);
                      this.stops[b] = a;
                      this.geocoders[b] || this._createGeocoder(a, b);
                      l = this.geocoders[b];
                      l._stopReference = a;
                      l._tr.style.display = this._isStopAWaypoint(a)
                        ? "none"
                        : "";
                      l.value = a.name;
                      l.inputNode && (l.inputNode.value = a.name);
                      (d &&
                        this.autoSolve &&
                        1 < this._getStopCount() + this._getWaypointCount()) ||
                      c
                        ? this._getDirections().then(e.resolve, e.reject)
                        : (this._setStops(), e.resolve(a));
                    }),
                    d.hitch(this, function(a) {
                      e.reject(a);
                    })
                  )
              : (this._showMessage(
                  B.widgets.directions.error.couldNotUpdateStop
                ),
                e.reject(Error(B.widgets.directions.error.couldNotUpdateStop)));
            this._optionsMenu();
            return e.promise;
          },
          _renderDirections: function() {
            var a = this.get("directions"),
              b;
            this._resultsNode &&
              ((b =
                "" +
                ('\x3cdiv class\x3d"' +
                  this._css.clearClass +
                  '"\x3e\x3c/div\x3e')),
              (b += this._renderDirectionsSummary(a)),
              (b +=
                '\x3cdiv class\x3d"' +
                this._css.clearClass +
                '"\x3e\x3c/div\x3e'),
              (b += '\x3cdiv class\x3d"' + this._css.routesClass + '"\x3e'),
              (b += this._renderDirectionsTable(a)),
              (b +=
                "\x3cdiv class\x3d'esriPrintFooter'\x3e" +
                B.widgets.directions.printDisclaimer +
                "\x3c/div\x3e"),
              (b += "\x3c/div\x3e"),
              this._resultsNode && (this._resultsNode.innerHTML = b),
              this._disconnectResults(),
              (a = C("[data-segment]", this._resultsNode)) &&
                a.length &&
                v.forEach(
                  a,
                  d.hitch(this, function(a) {
                    this._resultEvents.push(
                      m(
                        a,
                        e.enter,
                        d.hitch(this, function() {
                          if (!this._focusedDirectionsItem) {
                            var b = parseInt(N.get(a, "data-segment"), 10);
                            this.highlightSegment(b);
                          }
                        })
                      )
                    );
                    this._resultEvents.push(
                      m(
                        a,
                        "focusout",
                        d.hitch(this, function() {
                          this._focusedDirectionsItem = null;
                          this.unhighlightSegment(!0);
                        })
                      )
                    );
                    this._resultEvents.push(
                      m(a, e.leave, this.unhighlightSegment)
                    );
                    this._resultEvents.push(
                      m(
                        a,
                        "click, keydown",
                        d.hitch(this, function(b) {
                          b &&
                            ("click" === b.type ||
                              ("keydown" === b.type &&
                                b.keyCode === k.ENTER)) &&
                            (this._focusedDirectionsItem !== a
                              ? this.selectSegment(
                                  parseInt(N.get(a, "data-segment"), 10)
                                )
                              : (a.blur(),
                                this.map.infoWindow.hide(),
                                (this._focusedDirectionsItem = null),
                                this.unhighlightSegment(!0)));
                        })
                      )
                    );
                  })
                ));
          },
          _renderDirectionsSummary: function(a) {
            var b = "",
              c = d.hitch(this, function() {
                for (
                  var b = {},
                    c = this._getDirectionsTimeAttribute() || {},
                    d = this._getTimeNeutralAttribute() || {},
                    e = 0,
                    l = 0,
                    z = this.get("stops"),
                    k = z.length - 1;
                  0 <= k;
                  k--
                )
                  if (null !== z[k].feature.attributes.ArriveCurbApproach) {
                    b = z[k].feature.attributes;
                    break;
                  }
                for (var f in b)
                  b.hasOwnProperty(f) &&
                    (f === "Cumul_" + c.name && (e = b[f]),
                    f === "Cumul_" + d.name && (l = b[f]));
                b = "esriTrafficLabelHidden";
                z = B.widgets.directions.noTraffic;
                k = a.totalTime - a.totalDriveTime;
                k =
                  (l - this._convertCostValue(k, c.units, d.units)) /
                  (e - k || 1);
                0 < k && 0.8 > k
                  ? ((b = "esriTrafficLabelHeavy"),
                    (z = B.widgets.directions.heavyTraffic))
                  : 1 === k
                  ? ((b = "esriTrafficLabelNone"),
                    (z = B.widgets.directions.noTraffic))
                  : 1.25 < k &&
                    ((b = "esriTrafficLabelLight"),
                    (z = B.widgets.directions.ligthTraffic));
                d = this._formatTime(l, !1, d.units);
                return {
                  label: z,
                  labelClass: b,
                  ratio: k,
                  noTrafficCostStr:
                    1 !== k && d
                      ? d + " " + B.widgets.directions.onAverage + "\x3cbr\x3e"
                      : "",
                  trafficCost: e,
                  noTrafficCost: l,
                  timeAtt: c
                };
              });
            if (a.totalLength || a.totalTime) {
              var c = c(),
                e = this._getImpedanceAttribute(),
                b =
                  b +
                  ("\x3cdiv class\x3d'" +
                    this._css.resultsSummaryClass +
                    "' data-full-route\x3d'true'\x3e\x3cdiv class\x3d'esriImpedanceCost'\x3e");
              if (this._isTimeUnits(e.units))
                b +=
                  this._formatTime(c.trafficCost, !0, c.timeAtt.units) +
                  "\x3cdiv class\x3d'esriImpedanceCostHrMin'\x3e\x3cdiv class\x3d'esriImpedanceCostHr'\x3e" +
                  B.widgets.directions.time.hr +
                  "\x3c/div\x3e\x3cdiv class\x3d'esriImpedanceCostMin'\x3e" +
                  B.widgets.directions.time.min +
                  "\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'esriOtherCosts'\x3e" +
                  (c.noTrafficCost
                    ? "\x3cdiv class\x3d'esriTrafficLabel " +
                      c.labelClass +
                      "'\x3e" +
                      c.label +
                      "\x3c/div\x3e" +
                      c.noTrafficCostStr
                    : "") +
                  this._formatDistance(a.totalLength);
              else
                var e = (e =
                    B.widgets.directions.units[this.directionsLengthUnits])
                    ? e.name
                    : "",
                  l =
                    this.serviceDescription &&
                    10.6 <= this.serviceDescription.currentVersion,
                  z = this.directions.features[0].attributes,
                  b =
                    b +
                    (G.format(a.totalLength, { places: 1 }) +
                      "\x3cdiv class\x3d'esriImpedanceCostDist'\x3e" +
                      e +
                      "\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'esriOtherCosts'\x3e" +
                      (c.noTrafficCost && l
                        ? "\x3cdiv class\x3d'esriTrafficLabel " +
                          c.labelClass +
                          "'\x3e" +
                          c.label +
                          "\x3c/div\x3e" +
                          c.noTrafficCostStr
                        : "") +
                      this._formatTime(a.totalTime) +
                      " " +
                      ("none" !== this.startTime && c.noTrafficCost && l
                        ? B.widgets.directions.atTheMoment +
                          " " +
                          this._toSpatiallyLocalTimeString(
                            z.arriveTimeUTC,
                            z.ETA
                          )
                        : ""));
              b += "\x3c/div\x3e\x3c/div\x3e";
            }
            return b;
          },
          _renderDirectionsTable: function(a) {
            for (
              var b = 0,
                c = 0,
                d = 0,
                e =
                  '\x3ctable summary\x3d"' +
                  a.routeName +
                  '"\x3e\x3ctbody role\x3d"menu"\x3e',
                l = 0;
              l < a.features.length;
              l++
            ) {
              var z = a.features[l].attributes;
              "esriDMTDepart" === z.maneuverType && (c = d = 0);
              d += z.length;
              c += z.time;
              b += z.time;
              e += this._renderDirectionsItemTR(a.features[l], d, c, b);
            }
            return e + "\x3c/tbody\x3e\x3c/table\x3e";
          },
          _renderDirectionsItemTR: function(a, b, c, d) {
            var e = this.directions,
              l = e ? v.indexOf(e.features, a) : -1;
            d = "";
            var z = this._css.routeClass,
              k =
                a._associatedStopWithReturnToStart &&
                a._associatedStopWithReturnToStart.attributes,
              f = a.attributes;
            if (-1 < l) {
              f && (f.step = l + 1);
              f.maneuverType && (z += " " + f.maneuverType);
              k &&
              null === k.ArriveCurbApproach &&
              null !== k.DepartCurbApproach
                ? (z += " " + this._css.routeOriginClass)
                : k &&
                  null !== k.ArriveCurbApproach &&
                  null === k.DepartCurbApproach &&
                  (z +=
                    " " +
                    this._css.routeDestinationClass +
                    " " +
                    this._css.routeLastClass);
              d +=
                '\x3ctr tabindex\x3d"0" role\x3d"menuitem" class\x3d"' +
                z +
                " " +
                this._css.routeZoomClass +
                '" data-segment\x3d"' +
                l +
                '"\x3e';
              d +=
                '\x3ctd class\x3d"' + this._css.routeIconColumnClass + '"\x3e';
              d += '\x3cdiv class\x3d"' + this._css.routeIconClass + '"\x3e';
              d += this._getLetter(a._associatedStop);
              d =
                d +
                "\x3c/div\x3e\x3c/td\x3e" +
                ('\x3ctd class\x3d"' +
                  this._css.routeTextColumnClass +
                  '"\x3e');
              d += '\x3cdiv class\x3d"' + this._css.routeInfoClass + '"\x3e';
              d += '\x3cdiv class\x3d"' + this._css.routeTextClass + '"\x3e';
              a = (e.strings[l] || []).slice();
              if (
                "esriDMTDepart" === f.maneuverType ||
                "esriDMTStop" === f.maneuverType
              )
                for (e = 0; e < this.stops.length; e++)
                  this.stops[e] &&
                    this.stops[e].name &&
                    a.push({ string: this.stops[e].name });
              if (a) {
                z = f.text;
                for (e = 0; e < a.length; e++)
                  z = this._boldText(z, a[e].string);
                f.formattedText = z;
              } else f.formattedText = f.text;
              if (
                ("esriDMTStop" === f.maneuverType && (b || c)) ||
                ("esriDMTDepart" === f.maneuverType && 0 === l)
              )
                (b = this._formatDistance(b - f.length, !0)),
                  (c = this._formatTime(c - f.time)),
                  (l = this._formatTime(f.time)),
                  (a = this._formatDistance(f.length, !0)),
                  (f.formattedText +=
                    "\x3cdiv class\x3d'esriRouteTextColumnCumulative'\x3e" +
                    b +
                    (b && c ? " \x26middot; " : "") +
                    c +
                    (b || c ? "\x3cbr\x3e" : "") +
                    (l
                      ? B.widgets.directions.serviceTime + ":\x26nbsp;" + l
                      : "") +
                    (l && a ? "\x3cbr\x3e" : "") +
                    (a
                      ? B.widgets.directions.serviceDistance + ":\x26nbsp;" + a
                      : "") +
                    "\x3c/div\x3e");
              d +=
                "\x3cstrong\x3e" +
                G.format(f.step) +
                ".\x3c/strong\x3e " +
                f.formattedText;
              d += "\x3c/div\x3e";
              b = this._formatDistance(f.length, !0);
              c = this._formatTime(f.time);
              ("esriDMTStop" !== f.maneuverType &&
                "esriDMTDepart" !== f.maneuverType) ||
              !this.routeParams.startTime ||
              -22091616e5 === f.ETA
                ? b &&
                  ((d +=
                    '\x3cdiv class\x3d"' +
                    this._css.routeLengthClass +
                    '"\x3e'),
                  (d += b),
                  c && (d += "\x26nbsp;\x26middot;\x3cwbr\x3e\x26nbsp;" + c),
                  (d += "\x3c/div\x3e"))
                : (d +=
                    '\x3cdiv class\x3d"' +
                    this._css.routeLengthClass +
                    '"\x3e' +
                    this._toSpatiallyLocalTimeString(f.arriveTimeUTC, f.ETA) +
                    "\x3c/div\x3e");
              d += "\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e";
            }
            return d;
          },
          _toSpatiallyLocalTimeString: function(a, b) {
            var c = new Date(b),
              d = new Date(c.getTime() + 6e4 * c.getTimezoneOffset()),
              d = u.date.locale.format(d, { selector: "time" }),
              e = "";
            a
              ? ((b = (b - a) / 1e3 / 60 / 60),
                (a = Math.floor(b)),
                (b = 60 * (b - a)),
                (a =
                  B.widgets.directions.GMT +
                  (0 > a ? "" : "+") +
                  G.format(a, { pattern: "00" }) +
                  G.format(b, { pattern: "00" })),
                (e = d + " " + a))
              : (e =
                  "now" === this.startTime
                    ? u.date.locale.format(c, { selector: "time" })
                    : d);
            return e;
          },
          _addStopWrapperToGraphic: function(a, b) {
            return {
              extent: new pa({
                xmin: a.geometry.x - 0.25,
                ymin: a.geometry.y - 0.25,
                xmax: a.geometry.x + 0.25,
                ymax: a.geometry.y + 0.25,
                spatialReference: a.geometry.spatialReference
              }),
              feature: a,
              name: b
            };
          },
          _clearBarriersGraphics: function() {
            this._barriersLayer.clear();
            this._polylineBarriersLayer.clear();
            this._polygonBarriersLayer.clear();
          },
          _showBarriers: function() {
            this._clearBarriersGraphics();
            var a = this.routeParams,
              b = (a.polylineBarriers && a.polylineBarriers.features) || [],
              c = (a.polygonBarriers && a.polygonBarriers.features) || [];
            v.forEach(
              (a.barriers && a.barriers.features) || [],
              d.hitch(this, function(a) {
                this._barriersLayer.add(a);
              })
            );
            v.forEach(
              b,
              d.hitch(this, function(a) {
                this._polylineBarriersLayer.add(a);
              })
            );
            v.forEach(
              c,
              d.hitch(this, function(a) {
                this._polygonBarriersLayer.add(a);
              })
            );
            this._barriersLayer.refresh();
            this._polylineBarriersLayer.refresh();
            this._polygonBarriersLayer.refresh();
          },
          _showRoute: function(a) {
            this._clearDisplayAfterSolve();
            var b = a.routeResults[0].directions,
              c = new J();
            if (b) {
              this.set("solveResult", a);
              this.set("directions", b);
              var d = a.routeResults[0].stops,
                e,
                l;
              if (d && d.length) {
                var z = [];
                for (e = 0; e < d.length; e++) {
                  var k = d[e];
                  k.attributes.isWaypoint =
                    k.attributes.Name === this._waypointName ||
                    k.attributes.isWaypoint;
                  k = this._addStopWrapperToGraphic(k, k.attributes.Name);
                  this.stops[e] &&
                    this.stops[e].feature &&
                    this.stops[e].feature.attributes &&
                    this.stops[e].feature.attributes.Name ===
                      this._userDefinedStopName &&
                    (k.feature.attributes.Name = this._userDefinedStopName);
                  this._returnToStartStop &&
                  this._returnToStartStop._resultsStopIndex === e
                    ? (this._returnToStartStop = k)
                    : z.push(k);
                }
                if (this.stops.length > z.length)
                  for (e = 0; e < this.stops.length; e++)
                    this.stops[e].feature ||
                      "" !== this.stops[e].name ||
                      z.splice(e, 0, this._emptyStop);
                this.stops = z;
                for (e = 0; e < this.stops.length; e++)
                  this._updateStop(this.stops[e], e);
                this._setStops();
                this._setMenuNodeValues();
              }
              this.set(
                "mergedRouteGraphic",
                new y(b.mergedGeometry, this.get("routeSymbol"))
              );
              d = [];
              z = [];
              for (e = k = 0; e < b.featuresWithWaypoints.length; e++) {
                var f = b.featuresWithWaypoints[e];
                if ("esriDMTDepart" === f.attributes.maneuverType)
                  for (l = 0; l < this.stops.length; l++)
                    if (this.stops[l].feature === f._associatedStop) {
                      k = l + 1;
                      break;
                    }
                f.setSymbol(this.get("routeSymbol"));
                this._routeLayer.add(f);
                d.push(f);
                (l = f.getDojoShape()) && l.moveToBack();
                l = new y(
                  f.geometry,
                  this._symbolEventPaddingDirections,
                  f.attributes
                );
                l._nextStopIndex = k - 0.5;
                l._isSnapFeature = !0;
                f._associatedSnapFeature = l;
                this._waypointsEventLayer.add(l);
                "esriDMTDepart" !== f.attributes.maneuverType &&
                  (l = f.geometry.getPoint(0, 0)) &&
                  ((l = new y(l, this.maneuverSymbol)),
                  (l._directionsFeature = f._associatedFeatureNoWaypoints),
                  z.push(l),
                  this._waypointsEventLayer.add(z[z.length - 1]));
              }
              this.set("displayedRouteGraphics", d);
              this.set("displayedManeuverPointGraphics", z);
              this._renderDirections();
              for (e = 0; e < this.stops.length; e++)
                if (
                  this._isStopAWaypoint(this.stops[e]) &&
                  this._modifiedWaypointIndex === e
                ) {
                  for (l = 0; l < b.featuresWithWaypoints.length; l++)
                    if (
                      ((d = b.featuresWithWaypoints[l]),
                      d._associatedStop === this.stops[e].feature)
                    ) {
                      if (
                        "esriDMTStop" === d.attributes.maneuverType ||
                        "esriDMTDepart" === d.attributes.maneuverType
                      )
                        (this.stops[e].feature.geometry.x =
                          d.geometry.paths[0][0][0]),
                          (this.stops[e].feature.geometry.y =
                            d.geometry.paths[0][0][1]);
                      break;
                    }
                  this._modifiedWaypointIndex = null;
                  break;
                }
              I.set(this._savePrintBtnContainer, "display", "inline-block");
              this.onDirectionsFinish(a);
            } else
              (a = a.routeResults[0].route),
                a.setSymbol(this.routeSymbol),
                this._routeLayer.add(a),
                (this._incrementalRouteSegment = a);
            c.resolve();
            this._moveLayersToFront();
            this.createRouteSymbols();
            return c.promise;
          },
          _setGeocodersStopReference: function() {
            if (this.geocoders)
              for (var a = 0; a < this.geocoders.length; a++)
                this.geocoders[a] &&
                  this.stops[a] &&
                  (this.geocoders[a]._stopReference = this.stops[a]);
          },
          _setStops: function() {
            this._setGeocodersStopReference();
            this.createRouteSymbols();
            this._set("stops", this.stops);
            this.onStopsUpdate(this.stops);
          },
          _getCandidates: function(a) {
            var b = [];
            if (a && a.length) {
              for (var c = 0; c < a.length; c++)
                b.push(this._getCandidate(a[c]));
              return M(b);
            }
            a = new J();
            a.resolve([]);
            return a.promise;
          },
          _clearResultsHTML: function() {
            this._resultsNode.innerHTML = "";
            I.set(this._savePrintBtnContainer, "display", "none");
          },
          _showSegmentPopup: function(a) {
            if (
              a &&
              this.get("showSegmentPopup") &&
              this.get("map").infoWindow
            ) {
              var b = a.geometry.getPoint(0, 0);
              a = new y(b, null, a.attributes, this.get("segmentInfoTemplate"));
              var c = this.get("map").infoWindow;
              c.setFeatures([a]);
              c.show(b);
            }
          },
          _addStopButton: function() {
            this.addStop().then(
              d.hitch(this, function() {
                this.get("focusOnNewStop") &&
                  this.geocoders[this.stops.length - 1].focus();
              })
            );
          },
          _sortGeocoders: function() {
            var a = this._dnd.getAllNodes();
            this.geocoders.sort(
              d.hitch(this, function(b, c) {
                return b.domNode &&
                  b.domNode.parentNode &&
                  b.domNode.parentNode.parentNode &&
                  c.domNode &&
                  c.domNode.parentNode &&
                  c.domNode.parentNode.parentNode
                  ? v.indexOf(a, b.domNode.parentNode.parentNode) >
                    v.indexOf(a, c.domNode.parentNode.parentNode)
                    ? 1
                    : -1
                  : 0;
              })
            );
            this.stops.length === this.geocoders.length && this._sortStops();
            for (var b = 0; b < this.geocoders.length; b++)
              this.geocoders[b] &&
                this.geocoders[b].inputNode &&
                (this.geocoders[b].inputNode.title =
                  B.widgets.directions.stopNoTitle + (b + 1));
            this._setLocateButtonVisibilityEvents();
          },
          _disconnectResults: function() {
            if (this._resultEvents && this._resultEvents.length)
              for (var a = 0; a < this._resultEvents.length; a++)
                this._resultEvents[a] && this._resultEvents[a].remove();
            this._resultEvents = [];
          },
          _formatArbitraryCostsForRouteTooltip: function(a) {
            var b = "",
              c;
            for (c in a)
              if (0 === c.indexOf("Total_") && a.hasOwnProperty(c)) {
                var d = this._getCostAttribute(c.substr(6));
                d &&
                  ((b += this._isTimeUnits(d.units)
                    ? this._formatTime(a[c], !1, d.units)
                    : this._formatDistance(a[c], !0, d.units)),
                  (b += b ? " \x26middot; " : ""));
              }
            b &&
              (b =
                B.widgets.directions.toNearbyStops +
                ": \x3cb\x3e" +
                b.substr(0, b.length - 10) +
                "\x3c/b\x3e");
            return b;
          },
          _formatTime: function(a, b, c) {
            c || (c = (this._getDirectionsTimeAttribute() || {}).units);
            var d = "";
            c = Math.round(this._convertCostValue(a, c, "esriNAUMinutes"));
            a = Math.floor(c / 60);
            c = Math.floor(c % 60);
            b
              ? (d =
                  G.format(a, { pattern: 100 > a ? "00" : "000" }) +
                  ":" +
                  G.format(c, { pattern: "00" }))
              : (a && (d += a + " " + B.widgets.directions.time.hr + " "),
                (d += a || c ? c + " " + B.widgets.directions.time.min : ""));
            return d;
          },
          _formatDistance: function(a, b, c) {
            c || (c = this.directionsLengthUnits);
            var d = this.directionsLengthUnits,
              e = B.widgets.directions.units[d],
              l = d.replace("esri", "").toLowerCase();
            a = this._convertCostValue(a, c, d);
            e && (l = b ? e.abbr : e.name);
            return a
              ? G.format(a, { locale: "root", places: 2 }) + " " + l
              : "";
          },
          _projectToGeographic: function(a) {
            var b = new J();
            if (!a)
              return (
                b.reject("Directions:: 'geometry' is not defined.", {
                  geometry: a
                }),
                b.promise
              );
            if (4326 == a.spatialReference.wkid) return b.resolve(a), b.promise;
            if (!this._geometryService)
              return (
                b.reject("Directions:: Geometry service is not defined."),
                b.promise
              );
            var c = new na();
            c.outSR = new aa(4326);
            c.geometries = [a];
            this._geometryService.project(c).then(function(a) {
              b.resolve(a && a[0]);
            }, b.reject);
            return b.promise;
          },
          _createToolbars: function() {
            this.editToolbar || (this.editToolbar = new la(this.map));
            this.drawToolbar ||
              ((this.drawToolbar = new ma(this.map)),
              (B.toolbars.draw.freehand =
                B.widgets.directions.lineBarrierFreehand),
              (this.drawToolbar.onDrawComplete = d.hitch(this, function(a) {
                var b = new y(a.geometry, null, { BarrierType: 0 });
                this._projectToGeographic(
                  a.geographicGeometry || a.geometry
                ).then(
                  d.hitch(this, function(a) {
                    1 < R.geodesicLengths([a], K.METERS)[0] &&
                      (this._polylineBarriersLayer.add(b),
                      this.routeParams.polylineBarriers ||
                        (this.routeParams.polylineBarriers = new ka()),
                      this.routeParams.polylineBarriers.features.push(b),
                      this._clearStopsStatusAttr(),
                      this.getDirections(!0));
                  })
                );
              })));
          },
          _destroyGlobalGeocoder: function() {
            this._globalGeocoder &&
              (this._globalGeocoder.destroy(), (this._globalGeocoder = null));
          },
          _createGlobalGeocoder: function() {
            var a = new J();
            this._globalGeocoder = new oa(this.get("searchOptions"));
            m.once(this._globalGeocoder, "load", a.resolve, a.reject);
            this._globalGeocoder.startup();
            return a.promise;
          },
          _init: function() {
            var a = new J();
            this.set("loaded", !1);
            this._enableButton(this._getDirectionsButtonNode, !1);
            I.set(this._saveAsButton, "display", "none");
            this.clearMessages();
            if (this.get("map").loaded) this._configure().always(a.resolve);
            else
              m.once(
                this.get("map"),
                "load",
                d.hitch(this, function() {
                  this._configure().always(a.resolve);
                })
              );
            return a.promise;
          },
          _setDefaultStops: function() {
            var a = new J();
            this.defaults.stops && this.defaults.stops.length
              ? this._updateStops(this.defaults.stops).then(
                  d.hitch(this, function() {
                    this._removeEmptyStops();
                    a.resolve();
                  }),
                  a.reject
                )
              : a.resolve();
            return a.promise;
          },
          _configure: function() {
            var a = new J();
            this._handle && this._handle._remove();
            this._createDnD();
            this._createDepartAtControls();
            this._setSearchOptions();
            this._createGlobalGeocoder().then(
              d.hitch(this, function() {
                this._createToolbars();
                this._usingAGOL() ||
                  (this.printTaskUrl = this.geometryTaskUrl = null);
                this._createGeometryTask();
                this._createPrintTask();
                this._showActivateButton();
                this._showBarriersButton();
                this._createTravelModesDDL();
                this._createSearchSourceDDL();
                var b = [this._createRouteTask(), this._setDefaultStops()];
                M(b).then(
                  d.hitch(this, function() {
                    this._setDefaultUnits();
                    this._setTrafficOptions();
                    this._setMenuNodeValues();
                    this._setupEvents();
                    var b =
                      this.directionsLanguage ||
                      (this.userOptions.routeParams &&
                        this.userOptions.routeParams.directionsLanguage) ||
                      u.locale.toLowerCase();
                    this._setDirectionsLanguageByLocale(b);
                    this._setupTravelModes().then(
                      d.hitch(this, function() {
                        this.set("loaded", !0);
                        this.onLoad();
                        a.resolve(!0);
                      }),
                      function(b) {
                        a.reject(b);
                      }
                    );
                  }),
                  function(b) {
                    a.reject(b);
                  }
                );
              }),
              function(b) {
                a.reject(b);
              }
            );
            this._naRouteSharing = null;
            return a.promise;
          },
          _setDirectionsLanguageByLocale: function(a) {
            var b = this.serviceDescription.directionsSupportedLanguages,
              c = function(a) {
                if (b)
                  for (var c = 0; c < b.length; c++)
                    if (b[c].toLowerCase().substr(0, 2) === a) return b[c];
                return null;
              },
              d = c(a);
            d || ((a = a.substr(0, 2)), (d = c(a)));
            this.directionsLanguage = d;
            return (this.routeParams.directionsLanguage = d);
          },
          _getStopSymbol: function(a, b) {
            var c = a && ((a.feature && a.feature.attributes) || a.attributes),
              d = this.stopSymbol;
            c &&
              (d = this._isStopAWaypoint(a)
                ? this.waypointSymbol
                : void 0 === c.Status || 0 === c.Status || 6 === c.Status
                ? null === c.ArriveCurbApproach && null !== c.DepartCurbApproach
                  ? this.get(b ? "fromSymbolDrag" : "fromSymbol")
                  : null !== c.ArriveCurbApproach &&
                    null === c.DepartCurbApproach
                  ? this.get(b ? "toSymbolDrag" : "toSymbol")
                  : this.get(b ? "stopSymbolDrag" : "stopSymbol")
                : this.get(b ? "unreachedSymbolDrag" : "unreachedSymbol"));
            return d;
          },
          _addTrafficLayer: function() {
            this.trafficLayer &&
              !this._trafficLayerAdded &&
              this.map &&
              (this.map.addLayer(this.trafficLayer),
              this.trafficLayer.show(),
              (this._trafficLayerAdded = !0));
          },
          _toggleUnits: function(a) {
            a.target === this._useMilesNode
              ? this.setDirectionsLengthUnits(K.MILES)
              : a.target === this._useKilometersNode &&
                this.setDirectionsLengthUnits(K.KILOMETERS);
          },
          _toggleCheckbox: function(a) {
            var b = N.get(a.target, "checked");
            a.target === this._findOptimalOrderNode
              ? this.set("optimalRoute", b)
              : a.target === this._useTrafficNode
              ? this.set("traffic", b)
              : a.target === this._returnToStartNode &&
                this.set("returnToStart", b);
          },
          _isStopLocated: function(a) {
            return (
              a &&
              a.feature &&
              a.feature.attributes &&
              (!a.feature.attributes.Status ||
                6 === a.feature.attributes.Status)
            );
          },
          _configureRouteOptions: function() {
            var a = this.get("routeParams"),
              b;
            this.get("directionsLengthUnits")
              ? (a.directionsLengthUnits = this.get("directionsLengthUnits"))
              : this.set("directionsLengthUnits", a.directionsLengthUnits);
            a.findBestSequence = this.get("optimalRoute");
            if (a.findBestSequence)
              for (
                a.preserveFirstStop = this._isStopLocated(this.stops[0]),
                  a.preserveLastStop =
                    (!this.returnToStart &&
                      this._isStopLocated(this.stops[this.stops.length - 1])) ||
                    (this.returnToStart && this._isStopLocated(this.stops[0])),
                  b = 0;
                b < this.stops.length;

              )
                this._isStopAWaypoint(this.stops[b])
                  ? this._removeStop(b, !0, !0)
                  : b++;
            if (
              !this.returnToStart &&
              this.stops.length &&
              this._isStopAWaypoint(this.stops[this.stops.length - 1])
            )
              for (b = this.stops.length - 1; 0 < b; )
                this._isStopAWaypoint(this.stops[b]) &&
                  this._removeStop(b, !0, !0),
                  b--;
            if (
              this._isTimeUnits(this._getImpedanceAttribute().units) ||
              (this.serviceDescription &&
                10.6 <= this.serviceDescription.currentVersion)
            )
              if (((a.useTimeWindows = !0), "now" === this.startTime))
                (a.timeWindowsAreUTC = !0),
                  (a.startTimeIsUTC = !0),
                  (a.startTime = new Date());
              else if ("none" === this.startTime) a.startTime = null;
              else {
                a.timeWindowsAreUTC = !1;
                a.startTimeIsUTC = !1;
                var c = this._departAtTime,
                  d = 6e4 * c.getValue().getTimezoneOffset(),
                  c = new Date(
                    c.getValue().getTime() +
                      this._departAtDate.getValue().getTime() -
                      d
                  ),
                  c = new Date(c.getTime() - 6e4 * c.getTimezoneOffset());
                a.startTime = c;
              }
            else (a.startTime = null), (a.useTimeWindows = !1);
            var c = this._getImpedanceAttribute(),
              d = this._getTimeNeutralAttribute(),
              e = this._getDirectionsTimeAttribute();
            b =
              this.routeParams.accumulateAttributes ||
              this.serviceDescription.accumulateAttributeNames;
            d && -1 === v.indexOf(b, d.name) && b.push(d.name);
            !this._isTimeUnits(c.units) &&
              this.serviceDescription &&
              10.6 <= this.serviceDescription.currentVersion &&
              e &&
              -1 === v.indexOf(b, e.name) &&
              b.push(e.name);
            this.routeParams.accumulateAttributes = b;
            a.returnStops = !0;
            e = [];
            for (b = 0; b < this.stopGraphics.length; b++)
              if (
                this.stopGraphics[b] &&
                (e.push(new y(this.stopGraphics[b].toJson())), b)
              ) {
                var l = e[0].attributes,
                  k = e[b].attributes,
                  f;
                for (f in k)
                  k.hasOwnProperty(f) && !l.hasOwnProperty(f) && (l[f] = null);
              }
            this.get("returnToStart") &&
            this.stopGraphics.length &&
            this._isStopLocated(this.stops[0])
              ? ((f = new y(this.stopGraphics[0].toJson())),
                (this._returnToStartStop = this._addStopWrapperToGraphic(
                  f,
                  f.attributes.Name
                )),
                e.push(f))
              : (this._returnToStartStop = null);
            a.stops.features = e;
            if (d)
              for (b = 0; b < e.length; b++)
                e[b].attributes["Attr_" + d.name] = this._convertCostValue(
                  e[b].attributes["Attr_" + c.name],
                  c.units,
                  d.units
                );
            this.set("routeParams", a);
          },
          _configureRoute: function() {
            var a = new J();
            a.promise.always(
              d.hitch(this, function() {
                this._checkMaxStops();
              })
            );
            this.createRouteSymbols();
            this._configureRouteOptions();
            if (
              this.routeParams.returnRoutes &&
              this._incrementalSolveStopRange
            ) {
              var b = this._incrementalSolveStopRange;
              b.start < b.end
                ? (this.routeParams.stops.features = this.routeParams.stops.features.slice(
                    b.start,
                    b.end + 1
                  ))
                : b.start > b.end &&
                  (this.routeParams.stops.features = this.routeParams.stops.features
                    .slice(b.start, this.routeParams.stops.features.length - 1)
                    .concat(
                      this.routeParams.stops.features.slice(0, b.end + 1)
                    ));
            } else this._incrementalSolveStopRange = null;
            for (
              var c = {}, e = this.routeParams.stops.features, l, k, b = 0;
              b < e.length;
              b++
            )
              (k = e[b].attributes.address),
                (l =
                  (b === this._handle._index &&
                  !this._handle.attributes.isWaypoint &&
                  this._incrementalSolveStopRange
                    ? this._waypointName
                    : k) +
                  "_" +
                  this._stopSequence++),
                (e[b].attributes.Name = l),
                (c[l] = k),
                delete e[b].attributes.address,
                delete e[b].attributes.isWaypoint,
                delete e[b].attributes.Status;
            this._solveInProgress = !0;
            var f = {
              _incrementalSolveStopRange: this._incrementalSolveStopRange
            };
            this.routeTask.solve(
              this.routeParams,
              d.hitch(this, function(b) {
                this._solveResultProcessing(b, c, f).then(a.resolve, a.reject);
              }),
              d.hitch(this, function(b) {
                d.mixin(this, f);
                this._solveInProgress = !1;
                for (var c = 0; c < this.stops.length; c++)
                  this.stops[c].feature &&
                    (this.stops[c].feature.attributes = d.mixin(
                      this.stops[c].feature.attributes,
                      { Status: 5 }
                    ));
                this.set("directions", null);
                this._clearDisplayAfterSolve();
                this.createRouteSymbols();
                this._routeTaskError(b);
                a.reject(b);
              })
            );
            return a.promise;
          },
          _solveResultProcessing: function(a, b, c) {
            var e = new J();
            d.mixin(this, c);
            this._solveInProgress = !1;
            c = a.routeResults[0];
            var l = c.directions;
            c = c.stops;
            var k;
            if (l) {
              this._solverMessages = a.messages;
              var f = function(a) {
                for (var c in b)
                  if (
                    (a && 0 === l.routeName.indexOf(c)) ||
                    (!a && 0 < l.routeName.indexOf(c))
                  )
                    return b[c];
                return "";
              };
              k = f(!0);
              f = f(!1);
              l.routeName =
                (k !== this._waypointName ? k : B.widgets.directions.waypoint) +
                " \u2014 " +
                (f !== this._waypointName ? f : B.widgets.directions.waypoint);
              for (k = 0; k < l.features.length; k++)
                if (
                  ((f = l.features[k].attributes),
                  "esriDMTDepart" === f.maneuverType ||
                    "esriDMTStop" === f.maneuverType)
                )
                  for (var y in b)
                    if (b.hasOwnProperty(y) && -1 < f.text.indexOf(y)) {
                      f.text = f.text.replace(y, b[y]);
                      for (var g = 0; g < c.length; g++) {
                        var z = c[g].attributes;
                        if (z.Name === y) {
                          d.mixin(l.features[k], {
                            _associatedStop:
                              c[
                                this.returnToStart && g === c.length - 1 ? 0 : g
                              ],
                            _associatedStopWithReturnToStart: c[g]
                          });
                          if (
                            !z.ArriveTime &&
                            !z.ArriveTimeUTC &&
                            f.ETA &&
                            f.arriveTimeUTC
                          ) {
                            z.ArriveTime = f.ETA;
                            z.ArriveTimeUTC = f.arriveTimeUTC;
                            g = 0;
                            if (
                              (0 == k && "esriDMTDepart" === f.maneuverType) ||
                              (0 < k && "esriDMTStop" === f.maneuverType)
                            )
                              g = this._convertCostValue(
                                f.time,
                                (this._getDirectionsTimeAttribute() || {})
                                  .units,
                                "milliseconds"
                              );
                            z.DepartTime = z.ArriveTime + g;
                            z.DepartTimeUTC = z.ArriveTimeUTC + g;
                          }
                          break;
                        }
                      }
                    }
              for (k = 0; k < c.length; k++)
                this._returnToStartStop &&
                  c[k].attributes.Name ===
                    this._returnToStartStop.feature.attributes.Name &&
                  (this._returnToStartStop._resultsStopIndex = k),
                  (c[k].attributes.Name = b[c[k].attributes.Name]);
              this._directionsPostprocessing(l);
              this.traffic && this._updateMapTimeExtent();
            }
            this._showRoute(a).always(
              d.hitch(this, function() {
                this._incrementalSolveStopRange = null;
                e.resolve(a);
              })
            );
            return e.promise;
          },
          _directionsPostprocessing: function(a) {
            var b,
              c,
              e = function(b, c) {
                var d = a.features[b]._associatedFeaturesWithWaypoints || [];
                d.push(a.featuresWithWaypoints[c]);
                a.features[b]._associatedFeaturesWithWaypoints = d;
                a.featuresWithWaypoints[c]._associatedFeatureNoWaypoints =
                  a.features[b];
              };
            c = d.hitch(this, function(a) {
              return (
                "\x3cdiv class\x3d'" +
                this.theme +
                "'\x3e\x3ctable class\x3d'esriRoutesTooltip'\x3e" +
                this._renderDirectionsItemTR(a._associatedFeatureNoWaypoints) +
                "\x3c/table\x3e\x3c/div\x3e"
              );
            });
            a.featuresWithWaypoints = [];
            for (b = 0; b < a.features.length; b++) {
              var l = new y(a.features[b].toJson());
              l.setInfoTemplate(
                new W({
                  title: this._i18n.widgets.directions.maneuver,
                  content: c
                })
              );
              a.featuresWithWaypoints.push(l);
              a.featuresWithWaypoints[b]._associatedStop =
                a.features[b]._associatedStop;
              a.featuresWithWaypoints[b]._associatedStopWithReturnToStart =
                a.features[b]._associatedStopWithReturnToStart;
            }
            a.stringsWithWaypoints = d.mixin([], a.strings);
            a.eventsWithWaypoints = d.mixin([], a.events);
            for (c = b = 0; b < a.features.length; )
              a.features[b]._associatedStop &&
              a.features[b]._associatedStop.attributes.Name ===
                this._waypointName
                ? (a.features.splice(b, b ? 2 : 1),
                  a.strings.splice(b, b ? 2 : 1),
                  a.events.splice(b, b ? 2 : 1),
                  b &&
                  a.features[b] &&
                  "esriDMTStraight" === a.features[b].attributes.maneuverType
                    ? ((l = a.features.splice(b, 1)[0]),
                      (a.strings[b - 1] = (a.strings[b - 1] || []).concat(
                        a.strings.splice(b, 1)[0] || []
                      )),
                      a.strings[b - 1].length || (a.strings[b - 1] = void 0),
                      (a.events[b - 1] = (a.events[b - 1] || []).concat(
                        a.events.splice(b, 1)[0] || []
                      )),
                      a.events[b - 1].length || (a.events[b - 1] = void 0),
                      (a.features[b - 1].attributes.length +=
                        l.attributes.length),
                      (a.features[b - 1].attributes.time += l.attributes.time),
                      (a.features[b - 1].geometry.paths[0] = a.features[
                        b - 1
                      ].geometry.paths[0].concat(l.geometry.paths[0])),
                      e(b - 1, c++),
                      e(b - 1, c++),
                      e(b - 1, c++))
                    : (b && e(b - 1, c++), b < a.features.length && e(b, c++)))
                : (e(b, c++), b++);
          },
          _boldText: function(a, b) {
            try {
              var c = new RegExp(
                "[^\x3cstrong\x3e\x26nbsp;]" +
                  b.replace(
                    /(\||\$|\^|\(|\)|\[|\]|\{|\}|\/|\.|\+|\*|\?|\?)/g,
                    "\\$1"
                  ) +
                  "[^\x26nbsp;\x3c/strong\x3e]",
                "g"
              );
              a = (" " + a + " ").replace(
                c,
                "\x3cstrong\x3e\x26nbsp;" + b + "\x26nbsp;\x3c/strong\x3e"
              );
              a = a.trim();
            } catch (Ba) {}
            return a;
          },
          _clearStopGraphics: function() {
            if (this.stopGraphics && this.stopGraphics.length)
              for (var a = 0; a < this.stopGraphics.length; a++)
                this._stopLayer.remove(this.stopGraphics[a]),
                  this._stopLayer.remove(this.textGraphics[a]);
            this.set("stopGraphics", []);
            this.set("textGraphics", []);
          },
          _updateMapTimeExtent: function() {
            if (this.map) {
              var a =
                  (this.directions &&
                    this.directions.features[0] &&
                    this.directions.features[0].attributes) ||
                  {},
                b = new Date().getTime(),
                b = "none" == this.startTime ? b : a.arriveTimeUTC || b;
              this._useTrafficItemNode.title =
                "none" !== this.startTime && a.arriveTimeUTC
                  ? B.widgets.directions.trafficLabelDepartAt +
                    ": " +
                    this._toSpatiallyLocalTimeString(a.arriveTimeUTC, a.ETA)
                  : "";
              this._myTimeExtentUpdate = !0;
              a = new Date(b);
              this.map.setTimeExtent(new da(a, a));
            }
          },
          _restoreMapTimeExtent: function() {
            this.map &&
              ((this._myTimeExtentUpdate = !0),
              this.map.setTimeExtent(this._externalTimeExtent));
          },
          _clearRouteGraphics: function() {
            for (
              var a = this.displayedRouteGraphics,
                b = this.displayedManeuverPointGraphics,
                c = this._routeLayer,
                d = this._waypointsEventLayer,
                e = 0,
                l = 0,
                k = this._incrementalSolveStopRange
                  ? this._incrementalSolveStopRange
                  : { start: 0, end: this.stops ? this.stops.length : -1 };
              a && l < a.length;

            ) {
              if (a[l]._associatedStop)
                for (var f = 0; f < this.stops.length; f++)
                  if (this.stops[f].feature === a[l]._associatedStop) {
                    e = f;
                    break;
                  }
              (e >= k.start && e < k.end) ||
              (k.start >= k.end && (e >= k.start || e < k.end))
                ? (c.remove(a[l]), a.splice(l, 1))
                : l++;
            }
            c.remove(this._incrementalRouteSegment);
            this.set("displayedRouteGraphics", a ? a : []);
            b &&
              b.length &&
              v.forEach(b, function(a) {
                d.remove(a);
              });
            this.set("displayedManeuverPointGraphics", []);
            this._waypointsEventLayer.clear();
            this.unhighlightSegment(!0);
          },
          _clearInfoWindow: function() {
            var a = this.get("map").infoWindow;
            a && (a.hide(), a.clearFeatures());
          },
          _clearDisplayBeforeSolve: function() {
            this._toggleSaveMenu(!1);
            this._clearInfoWindow();
            this._clearResultsHTML();
          },
          _clearDisplayAfterSolve: function() {
            this._clearStopGraphics();
            this._clearRouteGraphics();
            this._clearBarriersGraphics();
            this.clearMessages();
          },
          _getLetter: function(a) {
            var b = this.alphabet,
              c = "",
              e = function(a) {
                var c = "";
                "0123456789" === b || "1234567890" === b
                  ? (c = String(a + 1))
                  : ((a = a || 0),
                    a >= b.length &&
                      ((c = e(Math.floor(a / b.length) - 1)), (a %= b.length)),
                    (c += b[a]));
                return c;
              },
              l =
                a instanceof y
                  ? d.hitch(this, function() {
                      for (
                        var b = this.get("returnToStart") ? 0 : -1, c = 0;
                        c < this.stops.length;
                        c++
                      )
                        if (this.stops[c].feature === a) {
                          b = c;
                          break;
                        }
                      return b;
                    })()
                  : a;
            if (-1 < l && b && b.length) {
              b instanceof Array && (b = b.toString().replace(/,/g, ""));
              for (var c = -1, k = 0; k <= l; k++)
                c += this._isStopAWaypoint(this.stops[k]) ? 0 : 1;
              c = e(c);
            }
            return c;
          },
          _solveAndZoom: function(a) {
            if (this.autoSolve)
              return this._getDirections().then(
                d.hitch(this, function() {
                  a || this.zoomToFullRoute();
                })
              );
            var b = new J();
            b.resolve();
            return b.promise;
          },
          _setupEvents: function() {
            this._onEvents.push(
              m(this.domNode, "[data-blur-on-click]:click", function() {
                this.blur();
              })
            );
            this._onEvents.push(
              m(
                this._dndNode,
                "[data-reverse-stops]:click, [data-reverse-stops]:keydown",
                d.hitch(this, function(a) {
                  a &&
                    ("click" === a.type ||
                      ("keydown" === a.type && a.keyCode === k.ENTER)) &&
                    this.modifyStopSequence();
                })
              )
            );
            this._onEvents.push(
              m(
                this._printButton,
                "click, keydown",
                d.hitch(this, function(a) {
                  a &&
                    ("click" === a.type ||
                      ("keydown" === a.type && a.keyCode === k.ENTER)) &&
                    this._printDirections();
                })
              )
            );
            this._onEvents.push(
              m(
                this._resultsNode,
                "[data-full-route]:click, [data-full-route]:keydown",
                d.hitch(this, function(a) {
                  a &&
                    ("click" === a.type ||
                      ("keydown" === a.type && a.keyCode === k.ENTER)) &&
                    this.zoomToFullRoute();
                })
              )
            );
            this._onEvents.push(
              m(
                this._dndNode,
                "[data-remove]:click, [data-remove]:keydown",
                d.hitch(this, function(a) {
                  if (
                    a &&
                    ("click" === a.type ||
                      ("keydown" === a.type && a.keyCode === k.ENTER))
                  ) {
                    var b = C("[data-remove]", this._dndNode);
                    a = v.indexOf(b, a.target);
                    this.removeStop(a);
                  }
                })
              )
            );
            this._onEvents.push(
              m(
                this._dndNode,
                "[data-center-at]:click, [data-center-at]:keydown",
                d.hitch(this, function(a) {
                  if (
                    a &&
                    ("click" === a.type ||
                      ("keydown" === a.type && a.keyCode === k.ENTER))
                  ) {
                    var b = C("[data-center-at]", this._dndNode);
                    a = v.indexOf(b, a.target);
                    this.stops[a] &&
                      this.stops[a].feature &&
                      this.stops[a].feature.geometry &&
                      this.map.centerAndZoom(this.stops[a].feature.geometry);
                  }
                })
              )
            );
            this._onEvents.push(
              m(
                this.map,
                "zoom-end",
                d.hitch(this, function() {
                  var a = this._segmentGraphics;
                  a &&
                    a[0] &&
                    void 0 !== a[0].attributes._index &&
                    this.highlightSegment(a[0].attributes._index, !0);
                })
              )
            );
            this._onEvents.push(
              m(
                this._dnd,
                "Drop",
                d.hitch(this, function() {
                  this._dnd.sync();
                  this.set("optimalRoute", !1);
                  var a,
                    b,
                    c = !1,
                    d = [],
                    e = this._dnd.getAllNodes();
                  for (a = 0; a < this.geocoders.length; a++)
                    if (
                      ((b = v.indexOf(e, this.geocoders[a]._tr)),
                      -1 < b && a !== b && a !== b - 1)
                    ) {
                      for (; 0 < b && this._isStopAWaypoint(this.stops[b]); )
                        b--;
                      c = !0;
                      break;
                    }
                  c &&
                    (d = this._markWPsForRemovalAfterUserChangedStopSequence(
                      a,
                      b
                    ));
                  this._sortGeocoders();
                  this.setListIcons();
                  this._removeSomeWaypoints(d);
                  this.stops[b].name && this.getDirections();
                })
              )
            );
            this._onEvents.push(
              m(
                this._dnd,
                "DndStart",
                d.hitch(this, function() {
                  var a = C("body")[0];
                  E.add(a, this._css.dndDragBodyClass);
                  this._removeLocateButtonVisibilityEvents();
                })
              )
            );
            this._onEvents.push(
              m(
                this._dnd,
                "DndDrop, DndCancel",
                d.hitch(this, function() {
                  var a = C("body")[0];
                  E.remove(a, this._css.dndDragBodyClass);
                  this._setLocateButtonVisibilityEvents();
                })
              )
            );
            var a = this._handle,
              b = d.hitch(this, function(b) {
                var c = d.hitch(this, function(c, d, e, l, k) {
                  var f = a._isShown();
                  a.setGeometry(c);
                  a._tooltip.style.left = b.screenPoint.x + "px";
                  a._tooltip.style.top = b.screenPoint.y + "px";
                  !f ||
                    (a._index === e && a.attributes.isWaypoint === l) ||
                    (a._remove(), (f = !1));
                  a.setSymbol(d);
                  a._index = e;
                  a._isStopIcon = a._index === Math.floor(a._index);
                  a.attributes.isWaypoint = l;
                  a._isStopIcon &&
                    ((a.attributes.address = this.stopGraphics[
                      e
                    ].attributes.address),
                    a.setInfoTemplate(this.stopGraphics[e].infoTemplate));
                  if (this.canModifyWaypoints || a._isStopIcon)
                    f ||
                      (this._stopLayer.add(a),
                      (c = a.getDojoShape()) &&
                        c[l ? "moveToBack" : "moveToFront"].call(c)),
                      this.editToolbar.activate(la.MOVE, a);
                  l = l
                    ? a._isStopIcon
                      ? B.widgets.directions.dragWaypoint
                      : this.canModifyWaypoints
                      ? B.widgets.directions.dragRoute
                      : ""
                    : B.widgets.directions.dragStop;
                  a._showTooltip(k || l);
                });
                this.unhighlightSegment();
                if (
                  this.mapClickActive &&
                  this.dragging &&
                  !this._solveInProgress &&
                  !this._moveInProgress &&
                  !a._solveTimeout
                )
                  if (
                    (clearTimeout(a._removeTimeout),
                    ((b.graphic._isStopIcon || b.graphic._isStopLabel) &&
                      !b.graphic.attributes.isWaypoint &&
                      this.canModifyStops) ||
                      (b.graphic._isStopIcon &&
                        b.graphic.attributes.isWaypoint &&
                        this.canModifyWaypoints))
                  ) {
                    var e = b.graphic._isStopLabel
                      ? this.stopGraphics[b.graphic._index]
                      : b.graphic;
                    c(
                      e.geometry,
                      this._getStopSymbol(this.stops[e._index], !0),
                      e._index,
                      !0 === e.attributes.isWaypoint
                    );
                    this._stopLayer.remove(this.stopGraphics[e._index]);
                    this._stopLayer.remove(this.textGraphics[e._index]);
                  } else if (
                    b.graphic._isSnapFeature ||
                    (b.graphic._isHandle && !b.graphic._isStopIcon)
                  )
                    this._snappingManager ||
                      (this._snappingManager = this.map.snappingManager),
                      this._snappingManager
                        .getSnappingPoint(b.screenPoint)
                        .then(
                          d.hitch(this, function(d) {
                            if (
                              !this.maxStopsReached &&
                              !this._moveInProgress &&
                              d
                            ) {
                              for (
                                var e = this.displayedManeuverPointGraphics,
                                  l = null,
                                  k = 0;
                                k < e.length;
                                k++
                              )
                                if (
                                  e[k].geometry.x === d.x &&
                                  e[k].geometry.y === d.y
                                ) {
                                  l = e[k]._directionsFeature;
                                  e = v.indexOf(this.directions.features, l);
                                  -1 < e && this.highlightSegment(e);
                                  break;
                                }
                              c(
                                d,
                                b.graphic._isHandle
                                  ? a.symbol
                                  : this.waypointSymbol,
                                b.graphic._isHandle
                                  ? a._index
                                  : b.graphic._nextStopIndex,
                                b.graphic._isHandle
                                  ? a.attributes.isWaypoint
                                  : !0,
                                l
                              );
                            }
                          })
                        );
              }),
              c = d.hitch(this, function() {
                clearTimeout(a._removeTimeout);
                a._removeTimeout = setTimeout(a._remove, 100);
                this.unhighlightSegment();
              }),
              e = d.hitch(this, function(a) {
                if (this.barrierToolActive) {
                  a = a.graphic;
                  var b = this.routeParams,
                    c = b.barriers ? v.indexOf(b.barriers.features, a) : -1,
                    d = b.polygonBarriers
                      ? v.indexOf(b.polygonBarriers.features, a)
                      : -1,
                    e = b.polylineBarriers
                      ? v.indexOf(b.polylineBarriers.features, a)
                      : -1;
                  -1 < c && b.barriers.features.splice(c, 1);
                  -1 < d && b.polygonBarriers.features.splice(d, 1);
                  -1 < e && b.polylineBarriers.features.splice(e, 1);
                  this._barriersLayer.remove(a);
                  this._polygonBarriersLayer.remove(a);
                  this._polylineBarriersLayer.remove(a);
                  this._clearStopsStatusAttr();
                  this.getDirections(!0);
                }
              });
            this._onEvents.push(this._waypointsEventLayer.on("mouse-move", b));
            this._onEvents.push(this._waypointsEventLayer.on("mouse-out", c));
            this._onEvents.push(this._stopLayer.on("mouse-move", b));
            this._onEvents.push(this._stopLayer.on("mouse-out", c));
            this._onEvents.push(this._barriersLayer.on("click", e));
            this._onEvents.push(this._polylineBarriersLayer.on("click", e));
            this._onEvents.push(this._polygonBarriersLayer.on("click", e));
            this._editToolbarEvents();
            this._watchEvents.push(this.watch("theme", this._updateThemeWatch));
            this._watchEvents.push(
              this.watch("canModifyStops", this._updateCanModifyStops)
            );
            this._watchEvents.push(
              this.watch("canModifyWaypoints", this._updateCanAddWaypoints)
            );
            this._watchEvents.push(
              this.watch("showReturnToStartOption", this._optionsMenu)
            );
            this._watchEvents.push(
              this.watch("showOptimalRouteOption", this._optionsMenu)
            );
            this._watchEvents.push(
              this.watch("returnToStart", this._setMenuNodeValues)
            );
            this._watchEvents.push(
              this.watch("optimalRoute", this._setMenuNodeValues)
            );
            this._watchEvents.push(this.watch("startTime", this._setStartTime));
            this._watchEvents.push(
              this.watch("traffic", this._setMenuNodeValues)
            );
            this._watchEvents.push(
              this.watch("trafficLayer", this._trafficLayerUpdate)
            );
            this._watchEvents.push(
              this.watch(
                "routeTaskUrl",
                d.hitch(this, function() {
                  this._createRouteTask();
                  this._setTrafficOptions();
                })
              )
            );
            this._watchEvents.push(
              this.watch(
                "printTaskUrl",
                d.hitch(this, function() {
                  this._createPrintTask();
                })
              )
            );
            this._watchEvents.push(
              this.watch(
                "geometryTaskUrl",
                d.hitch(this, function() {
                  this._createGeometryTask();
                })
              )
            );
            this._watchEvents.push(
              this.watch(
                "routeParams",
                d.hitch(this, function() {
                  this._createRouteParams();
                  this._setDefaultUnits();
                })
              )
            );
            this._watchEvents.push(
              this.watch(
                "searchOptions",
                d.hitch(this, function() {
                  this._setSearchOptions();
                  this._createGlobalGeocoder();
                  var a = this.get("searchOptions").sources;
                  if (a)
                    for (var b = 0; b < this.geocoders.length; b++)
                      this.geocoders[b].set("sources", a);
                })
              )
            );
            this._watchEvents.push(
              this.watch("showReverseStopsButton", this.setListIcons)
            );
            this._watchEvents.push(
              this.watch("editToolbar", this._editToolbarEvents)
            );
            this._watchEvents.push(
              this.watch("showTravelModesOption", this._showTravelModesOption)
            );
            this._watchEvents.push(
              this.watch(
                "showMilesKilometersOption",
                this._showMilesKilometersOption
              )
            );
            this._watchEvents.push(
              this.watch("showClearButton", this._showClearButton)
            );
            this._watchEvents.push(
              this.watch("directionsLengthUnits", this.setDirectionsLengthUnits)
            );
            this._watchEvents.push(
              this.watch("directionsLanguage", this.setDirectionsLanguage)
            );
            this._watchEvents.push(
              this.watch("mapClickActive", this._activate)
            );
            this._watchEvents.push(
              this.watch("barrierToolActive", this._activateBarrierTool)
            );
            this._watchEvents.push(
              this.watch("showActivateButton", this._showActivateButton)
            );
            this._watchEvents.push(
              this.watch("showBarriersButton", this._showBarriersButton)
            );
            this._watchEvents.push(
              this.watch("showPrintPage", function() {
                I.set(
                  this._printButton,
                  "display",
                  this.showPrintPage ? "inline-block" : "none"
                );
              })
            );
            this._watchEvents.push(
              this.watch("showSaveButton", function() {
                I.set(
                  this._saveMenuButton,
                  "display",
                  this.showSaveButton && this.owningSystemUrl
                    ? "inline-block"
                    : "none"
                );
              })
            );
          },
          _editToolbarEvents: function() {
            var a = d.hitch(this, function(a) {
                var b = "";
                if (
                  (a = a.routeResults ? a.routeResults[0] : null) &&
                  a.route
                ) {
                  a = a.route.attributes;
                  var c = this.routeParams.travelMode;
                  if (c)
                    var b =
                        b +
                        ("\x3cb\x3e" +
                          c.name +
                          "\x3c/b\x3e " +
                          B.widgets.directions.toNearbyStops +
                          ": "),
                      d =
                        void 0 !== a["Total_" + c.timeAttributeName]
                          ? this._formatTime(
                              a["Total_" + c.timeAttributeName],
                              !1,
                              (
                                this._getCostAttribute(c.timeAttributeName) ||
                                {}
                              ).units
                            )
                          : "",
                      b =
                        b +
                        ((void 0 !== a["Total_" + c.distanceAttributeName]
                          ? this._formatDistance(
                              a["Total_" + c.distanceAttributeName],
                              !0,
                              (
                                this._getCostAttribute(
                                  c.distanceAttributeName
                                ) || {}
                              ).units
                            )
                          : "") +
                          (d ? " \x26middot; " + d : ""));
                  else b = this._formatArbitraryCostsForRouteTooltip(a);
                }
                this._handle._showTooltip(b);
              }),
              b = d.hitch(this, function(c, e) {
                var l = new J(),
                  k = this._handle,
                  f = this.map
                    .toScreen(k._origPoint)
                    .offset(
                      c.transform.dx + k.symbol.xoffset,
                      c.transform.dy + k.symbol.yoffset
                    );
                c.origMapPoint || (c.origMapPoint = this.map.toMap(f));
                I.set(k._tooltip, "left", f.x + "px");
                I.set(k._tooltip, "top", f.y + "px");
                clearTimeout(k._solveTimeout);
                if (
                  this._solveInProgress ||
                  !this._requestQueueTail.isFulfilled()
                )
                  k._solveTimeout = setTimeout(function() {
                    b(c, e).always(l.resolve);
                  }, 100);
                else if (k._isStopIcon) {
                  var f = c.graphic._index,
                    g = this.stops[f];
                  (g = g
                    ? {
                        name: g.name,
                        extent: g.extent,
                        feature: new y(g.feature.toJson())
                      }
                    : null)
                    ? (g.feature.setGeometry(c.origMapPoint),
                      (this._modifiedWaypointIndex = this._isStopAWaypoint(
                        this.stops[f]
                      )
                        ? f
                        : null),
                      (this._incrementalSolveStopRange = {
                        start: this.returnToStart
                          ? (this.stops.length + f - 1) % this.stops.length
                          : Math.max(0, f - 1),
                        end: this.returnToStart
                          ? (f + 1) % this.stops.length
                          : Math.min(this.stops.length - 1, f + 1)
                      }),
                      this.updateStop(g, f, e).always(
                        d.hitch(this, function(b) {
                          k._solveTimeout = null;
                          b.routeResults && a(b);
                          l.resolve();
                        })
                      ))
                    : l.resolve();
                } else l.resolve();
                return l.promise;
              });
            this._onEvents.push(
              m(
                this.editToolbar,
                "graphic-click",
                d.hitch(this, function(a) {
                  if (a.graphic.attributes.isWaypoint)
                    !a.graphic._isStopIcon ||
                      this._moveInProgress ||
                      this._solveInProgress ||
                      (this._handle._remove(),
                      (this._moveInProgress = !0),
                      this.removeStop(a.graphic._index, !0).always(
                        d.hitch(this, function() {
                          this._moveInProgress = !1;
                        })
                      ));
                  else {
                    var b = this.get("map").infoWindow;
                    b &&
                      (b.setFeatures([a.graphic]), b.show(a.graphic.geometry));
                  }
                })
              )
            );
            this._onEvents.push(
              m(
                this.editToolbar,
                "graphic-move-start",
                d.hitch(this, function(a) {
                  this._blurGeocoders();
                  this._moveInProgress = !0;
                  this._removeEmptyStops();
                  this.routeParams.returnDirections = !1;
                  this.routeParams.returnRoutes = !0;
                  a = a.graphic;
                  a._origPoint = new w(a.geometry.toJson());
                  a._maxDeviation = 0;
                  a._solveHasHappened = !1;
                  this.map.disableMapNavigation();
                })
              )
            );
            this._onEvents.push(
              m(
                this.editToolbar,
                "graphic-move-stop",
                d.hitch(this, function(a) {
                  this.map.enableMapNavigation();
                  this.routeParams.returnDirections = !0;
                  this.routeParams.returnRoutes = !1;
                  if (this._handle._isStopIcon)
                    if (this._handle._solveHasHappened)
                      if (this._handle.attributes.isWaypoint)
                        b(a, !0).always(
                          d.hitch(this, function() {
                            this._moveInProgress = !1;
                            this._handle._isStopIcon = !0;
                            this._handle._remove();
                            this._showLoadingSpinner();
                          })
                        );
                      else {
                        clearTimeout(this._handle._solveTimeout);
                        this._handle._solveTimeout = null;
                        var c = this.stops[a.graphic._index],
                          e =
                            (c &&
                              c.feature &&
                              c.feature.attributes &&
                              c.feature.attributes.Name) ===
                            this._userDefinedStopName,
                          l = c && c.name;
                        this._reverseGeocode(new y(a.graphic.toJson())).then(
                          d.hitch(this, function(b) {
                            e &&
                              ((b.name = l),
                              (b.feature.attributes.Name = this._userDefinedStopName));
                            this._setReverseGeocode(
                              b,
                              b.feature.geometry,
                              a.graphic._index
                            ).always(
                              d.hitch(this, function() {
                                this._moveInProgress = !1;
                                this._handle._remove();
                                this._showLoadingSpinner();
                              })
                            );
                          })
                        );
                      }
                    else this._moveInProgress = !1;
                  else this._moveInProgress = !1;
                })
              )
            );
            this._onEvents.push(
              m(
                this.editToolbar,
                "graphic-move",
                d.hitch(this, function(a) {
                  var c = this._handle,
                    d = a.transform;
                  d.dx &&
                    d.dy &&
                    (a.graphic._maxDeviation = Math.max(
                      c._maxDeviation,
                      Math.sqrt(d.dx * d.dx + d.dy * d.dy)
                    ));
                  10 < c._maxDeviation &&
                    ((c._solveHasHappened = !0),
                    a.graphic === c && c.attributes.isWaypoint && !c._isStopIcon
                      ? (this.set("optimalRoute", !1),
                        (c._index += 0.5),
                        (c._isStopIcon = !0),
                        (a.graphic._stopIndex = c._index),
                        (this._incrementalSolveStopRange = {
                          start: this.returnToStart
                            ? (this.stops.length + c._index - 1) %
                              this.stops.length
                            : Math.max(0, c._index - 1),
                          end: this.returnToStart
                            ? (c._index + 1) % (this.stops.length + 1)
                            : Math.min(this.stops.length, c._index + 1)
                        }),
                        this.addStop(
                          {
                            name: this._waypointName,
                            feature: new y(c.geometry, c.symbol, {
                              isWaypoint: !0,
                              CurbApproach: 3
                            })
                          },
                          a.graphic._stopIndex
                        ))
                      : ((c = a.graphic.getDojoShape()) && c.moveToFront(),
                        b(a)));
                })
              )
            );
          },
          _isStopAWaypoint: function(a) {
            return (
              a &&
              a.feature &&
              a.feature.attributes &&
              a.feature.attributes.isWaypoint
            );
          },
          _getStopCount: function() {
            var a = 0,
              b;
            for (b = 0; b < this.stops.length; b++)
              a +=
                !this._isStopAWaypoint(this.stops[b]) && this.stops[b].name
                  ? 1
                  : 0;
            return a;
          },
          _getWaypointCount: function() {
            var a = 0,
              b;
            for (b = 0; b < this.stops.length; b++)
              a += this._isStopAWaypoint(this.stops[b]) ? 1 : 0;
            return a;
          },
          _decorateUngeocodedStop: function(a) {
            var b = new J(),
              c = function(c, d) {
                b.resolve({
                  name:
                    void 0 === c
                      ? B.widgets.directions.unlocatedStop
                      : c.toFixed(6) + " " + d.toFixed(6),
                  feature: a
                });
              };
            if (a.geometry)
              if (
                a.geometry.spatialReference &&
                4326 !== a.geometry.spatialReference.wkid
              )
                if (
                  this.map &&
                  this.map.spatialReference &&
                  this.map.spatialReference.isWebMercator()
                ) {
                  var e = X.xyToLngLat(a.geometry.x, a.geometry.y);
                  c(e[0], e[1]);
                } else
                  this._geometryService
                    ? ((e = new na()),
                      (e.outSR = new aa(4326)),
                      (e.geometries = [a.geometry]),
                      this._geometryService.project(e).then(
                        d.hitch(this, function(b) {
                          b && b.length
                            ? c(b[0].x, b[0].y)
                            : c(a.geometry.x, a.geometry.y);
                        }),
                        d.hitch(this, function() {
                          c();
                        })
                      ))
                    : c(a.geometry.x, a.geometry.y);
              else c(a.geometry.x, a.geometry.y);
            else c();
            return b.promise;
          },
          _trafficLayerUpdate: function(a, b, c) {
            a = this.get("map");
            b &&
              this._trafficLayerAdded &&
              (a.removeLayer(b), (this._trafficLayerAdded = !1));
            c &&
              this.get("traffic") &&
              !this._trafficLayerAdded &&
              (a.addLayer(c), c.show(), (this._trafficLayerAdded = !0));
          },
          _routeTaskError: function(a) {
            var b = B.widgets.directions.error.routeTask,
              c = a.details,
              d = function(a) {
                return (res = a.match(/(\d+)/)) ? ": " + res[0] : ".";
              };
            c &&
              1 === c.length &&
              ("The distance between any inputs must be less than 50 miles (80 kilometers) when walking." ===
              c[0]
                ? (b = B.widgets.directions.error.maxWalkingDistance)
                : "Driving a truck is currently not supported outside of North America and Central America." ===
                  c[0]
                ? (b = B.widgets.directions.error.nonNAmTruckingMode)
                : 0 ===
                  c[0].indexOf(
                    "The number of input locations loaded into Barriers"
                  )
                ? (b = B.widgets.directions.error.tooManyBarriers + d(c[0]))
                : 0 ===
                  c[0].indexOf(
                    "The number of input locations loaded into PolygonBarriers"
                  )
                ? (b =
                    B.widgets.directions.error.tooManyPolygonBarriers + d(c[0]))
                : 0 ===
                    c[0].indexOf(
                      "The number of input locations loaded into PolylineBarriers"
                    ) &&
                  (b =
                    B.widgets.directions.error.tooManyPolylineBarriers +
                    d(c[0])));
            this._showMessage(b);
            this.onDirectionsFinish(a);
          },
          _showMessage: function(a, b) {
            var c = "";
            this.messages.push({ msg: a, error: !b });
            if (this.messages.length) {
              for (
                var c = c + "\x3cul\x3e", d = 0;
                d < this.messages.length;
                d++
              )
                c +=
                  '\x3cli class\x3d"' +
                  (this.messages[d].error
                    ? this._css.routesErrorClass
                    : this._css.routesInfoClass) +
                  '"\x3e' +
                  this.messages[d].msg +
                  "\x3c/li\x3e";
              c += "\x3c/ul\x3e";
            }
            this._msgNode && (this._msgNode.innerHTML = c);
            if (!b) this.onError(a);
          },
          _isTimeUnits: function(a) {
            return (
              "milliseconds" === a ||
              "esriNAUSeconds" === a ||
              "esriNAUMinutes" === a ||
              "esriNAUHours" === a ||
              "esriNAUDays" === a
            );
          },
          _getImpedanceAttribute: function() {
            return this._getCostAttribute(
              (this.routeParams &&
                this.routeParams.travelMode &&
                this.routeParams.travelMode.impedanceAttributeName) ||
                this.routeParams.impedanceAttribute ||
                this.serviceDescription.impedance
            );
          },
          _getDirectionsTimeAttribute: function() {
            return this._getCostAttribute(
              (this.routeParams &&
                this.routeParams.travelMode &&
                this.routeParams.travelMode.timeAttributeName) ||
                this.routeParams.directionsTimeAttribute ||
                this.serviceDescription.directionsTimeAttribute
            );
          },
          _getTimeNeutralAttribute: function() {
            var a = (this._getDirectionsTimeAttribute() || {})
              .timeNeutralAttributeName;
            return this._getCostAttribute(a);
          },
          _getCostAttribute: function(a) {
            for (
              var b =
                  (this.serviceDescription &&
                    this.serviceDescription.networkDataset.networkAttributes) ||
                  [],
                c,
                d = 0;
              d < b.length;
              d++
            )
              if (b[d].name === a && "esriNAUTCost" === b[d].usageType) {
                c = b[d];
                break;
              }
            return c;
          },
          _convertCostValue: function(a, b, c) {
            var d = this._isTimeUnits(b),
              e = this._isTimeUnits(c);
            b = d ? this._toMinutes(a, b) : this._toMeters(a, b);
            return d === e
              ? e
                ? this._fromMinutes(b, c)
                : this._fromMeters(b, c)
              : a;
          },
          _toMinutes: function(a, b, c) {
            a = a || 0;
            switch (b) {
              case "milliseconds":
                a /= Math.pow(6e4, c ? -1 : 1);
                break;
              case "esriNAUSeconds":
                a /= Math.pow(60, c ? -1 : 1);
                break;
              case "esriNAUHours":
                a *= Math.pow(60, c ? -1 : 1);
                break;
              case "esriNAUDays":
                a *= Math.pow(1440, c ? -1 : 1);
            }
            return a;
          },
          _fromMinutes: function(a, b) {
            return this._toMinutes(a, b, !0);
          },
          _toMeters: function(a, b, c) {
            a = a || 0;
            switch ((b || "").replace("esriNAU", "esri")) {
              case "esriInches":
                a *= Math.pow(0.0254, c ? -1 : 1);
                break;
              case "esriFeet":
                a *= Math.pow(0.3048, c ? -1 : 1);
                break;
              case "esriYards":
                a *= Math.pow(0.9144, c ? -1 : 1);
                break;
              case "esriMiles":
                a *= Math.pow(1609.344, c ? -1 : 1);
                break;
              case "esriNauticalMiles":
                a *= Math.pow(1851.995396854, c ? -1 : 1);
                break;
              case "esriMillimeters":
                a /= Math.pow(1e3, c ? -1 : 1);
                break;
              case "esriCentimeters":
                a /= Math.pow(100, c ? -1 : 1);
                break;
              case "esriKilometers":
                a *= Math.pow(1e3, c ? -1 : 1);
                break;
              case "esriDecimeters":
                a /= Math.pow(10, c ? -1 : 1);
            }
            return a;
          },
          _fromMeters: function(a, b) {
            return this._toMeters(a, b, !0);
          },
          _createRouteTask: function() {
            var a = new J();
            this.set("routeTask", new sa(this.get("routeTaskUrl")));
            this._createRouteParams();
            this.routeTask
              .getServiceDescription(
                this.travelModesServiceUrl,
                this.doNotFetchTravelModesFromOwningSystem
              )
              .then(
                d.hitch(this, function(b) {
                  b.networkDataset
                    ? (this.set("serviceDescription", b),
                      this.set(
                        "maxStops",
                        parseInt(
                          this.userOptions.maxStops ||
                            (b.serviceLimits &&
                              b.serviceLimits.Route_MaxStops) ||
                            this.defaults.maxStops
                        )
                      ),
                      this.defaults.portalUrl
                        ? ((this.owningSystemUrl = this.defaults.portalUrl),
                          a.resolve())
                        : this.routeTask.getOwningSystemUrl().then(
                            d.hitch(this, function(b) {
                              this.owningSystemUrl = b;
                              a.resolve();
                            }),
                            a.reject
                          ))
                    : (this._showMessage(
                        B.widgets.directions.error
                          .cantFindRouteServiceDescription
                      ),
                      a.reject(
                        Error(
                          B.widgets.directions.error
                            .cantFindRouteServiceDescription
                        )
                      ));
                }),
                d.hitch(this, function() {
                  this._showMessage(
                    B.widgets.directions.error.cantFindRouteServiceDescription
                  );
                  a.reject(
                    Error(
                      B.widgets.directions.error.cantFindRouteServiceDescription
                    )
                  );
                  this.mapClickActive = !1;
                  this._activate();
                })
              );
            return a.promise;
          },
          _createSearchSourceDDL: function() {
            if (
              this._globalGeocoder &&
              this._globalGeocoder.sources &&
              1 < this._globalGeocoder.sources.length
            ) {
              var a = d.hitch(this, function(a) {
                this._searchSourceSelector.domNode.blur();
                this._globalGeocoder.set("activeSourceIndex", a);
                for (var b = 0; b < this.geocoders.length; b++)
                  this.geocoders[b].set("activeSourceIndex", a);
              });
              if (!this._searchSourceSelector) {
                for (
                  var b = [
                      {
                        value: "all",
                        label: B.widgets.Search.main.all,
                        selected: !0
                      }
                    ],
                    c = 0;
                  c < this._globalGeocoder.sources.length;
                  c++
                )
                  b.push({
                    value: String(c),
                    label: this._globalGeocoder.sources[c].name
                  });
                this._searchSourceSelector = new f(
                  {
                    className: "esriSearchSourcesDDL",
                    style: "width:100%;",
                    options: b
                  },
                  this._searchSourceSelectorContainer
                );
                this._searchSourceSelector.startup();
                this._searchSourceSelector.on("change", a);
                this._searchSourceSelector.domNode.style.width = "";
              }
              a("all");
            } else
              2 > this._globalGeocoder.sources.length &&
                (this._searchSourceContainerNode.style.display = "none");
          },
          _createTravelModesDDL: function() {
            this._travelModeSelector ||
              ((this._travelModeSelector = new f(
                { className: "esriTravelModesDDL", style: "width:100%;" },
                this._travelModeSelectorContainer
              )),
              this._travelModeSelector.startup(),
              (this._travelModeSelector._interractive = !0),
              this._travelModeSelector.on(
                "change",
                d.hitch(this, function(a) {
                  this._travelModeSelector._interractive
                    ? this._enqueue(function() {
                        return this._setTravelMode(a).always(
                          d.hitch(this, function() {
                            this._travelModeSelector._interractive = !0;
                          })
                        );
                      })
                    : (this._travelModeSelector._interractive = !0);
                })
              ));
          },
          _setupTravelModes: function() {
            var c = this.get("serviceDescription"),
              d = c.supportedTravelModes,
              e = new J();
            if (d && d.length && this._travelModeSelector) {
              for (var l = d[0].name, k = [], f = 0; f < d.length; f++) {
                for (
                  var g =
                      "AUTOMOBILE" === d[f].type
                        ? "Driving"
                        : "TRUCK" === d[f].type
                        ? "Trucking"
                        : "WALK" === d[f].type
                        ? "Walking"
                        : "Other",
                    y = "",
                    D = c.networkDataset.networkAttributes,
                    m = 0;
                  m < D.length;
                  m++
                ) {
                  var q = D[m];
                  if (q.name === d[f].impedanceAttributeName) {
                    if (
                      "esriNAUCentimeters" === q.units ||
                      "esriNAUDecimalDegrees" === q.units ||
                      "esriNAUDecimeters" === q.units ||
                      "esriNAUFeet" === q.units ||
                      "esriNAUInches" === q.units ||
                      "esriNAUKilometers" === q.units ||
                      "esriNAUMeters" === q.units ||
                      "esriNAUMiles" === q.units ||
                      "esriNAUMillimeters" === q.units ||
                      "esriNAUNauticalMiles" === q.units ||
                      "esriNAUYards" === q.units
                    )
                      y = "Distance";
                    else if (
                      "esriNAUDays" === q.units ||
                      "esriNAUHours" === q.units ||
                      "esriNAUMinutes" === q.units ||
                      "esriNAUSeconds" === q.units
                    )
                      y = "Time";
                    break;
                  }
                }
                k.push({
                  id: d[f].name,
                  label:
                    '\x3cdiv class\x3d"esriTravelModesDirectionsIcon esriTravelModesType' +
                    g +
                    y +
                    '"\x3e\x26nbsp;\x3c/div\x3e\x3cdiv class\x3d"esriTravelModesTypeName" title\x3d"' +
                    d[f].description +
                    '"\x3e' +
                    d[f].name +
                    "\x3c/div\x3e"
                });
                !c.defaultTravelMode ||
                  (d[f].id !== c.defaultTravelMode &&
                    d[f].itemId !== c.defaultTravelMode) ||
                  (l = d[f].name);
              }
              this._showTravelModesOption();
              this._travelModeSelector.setStore(
                new a({ objectStore: new b({ data: k }) })
              );
              this._travelModeSelector._interractive = !1;
              this._travelModeSelector.setValue(l);
              this._setTravelMode(l).always(e.resolve);
            } else
              this._checkStartTimeUIAvailability(),
                this.set("showTravelModesOption", !1),
                e.resolve();
            return e.promise;
          },
          _createPrintTask: function() {
            this._printService = (this.printTaskUrl = this._usingAGOL()
              ? this.printTaskUrl
              : this.defaults.printTaskUrl)
              ? new va(this.printTaskUrl, { async: !1 })
              : null;
            var a = new xa();
            a.exportOptions = { width: 670, height: 750, dpi: 96 };
            a.format = "PNG32";
            a.layout = "MAP_ONLY";
            a.preserveScale = !1;
            a.showAttribution = !1;
            var b = new wa();
            b.map = this.map;
            b.outSpatialReference = this.map.spatialReference;
            b.template = a;
            this._printParams = b;
          },
          _createGeometryTask: function() {
            this._geometryService = null;
            this._usingAGOL()
              ? (this._geometryService = new ia(this.geometryTaskUrl))
              : (this.geometryTaskUrl = (this._geometryService = this.defaults
                  .geometryTaskUrl
                  ? new ia(this.defaults.geometryTaskUrl)
                  : ya.defaults.geometryService)
                  ? this._geometryService.url
                  : null);
          },
          _showTravelModesOption: function() {
            var a = this.get("serviceDescription");
            I.set(
              this._travelModeContainerNode,
              "display",
              this.showTravelModesOption &&
                a &&
                a.supportedTravelModes &&
                a.supportedTravelModes.length &&
                !this.doNotFetchTravelModesFromOwningSystem
                ? "block"
                : "none"
            );
          },
          _showMilesKilometersOption: function() {
            I.set(
              this._agolDistanceUnitsNode,
              "display",
              this.showMilesKilometersOption ? "block" : "none"
            );
          },
          _showClearButton: function() {
            I.set(
              this._clearDirectionsButtonNode,
              "display",
              this.showClearButton ? "inline-block" : "none"
            );
          },
          _showActivateButton: function() {
            I.set(
              this._activateButtonNode,
              "display",
              this.showActivateButton ? "inline-block" : "none"
            );
            this.showActivateButton || this.deactivate();
          },
          _showBarriersButton: function() {
            I.set(
              this._lineBarrierButtonNode,
              "display",
              this.showBarriersButton ? "inline-block" : "none"
            );
            this.showBarriersButton || this.deactivateBarrierTool();
          },
          _createRouteParams: function() {
            var a = {
              returnDirections: !0,
              returnRoutes: !1,
              outputLines: "esriNAOutputLineTrueShape",
              preserveFirstStop: !0,
              preserveLastStop: !0,
              directionsOutputType: "complete",
              stops: new ka(),
              ignoreInvalidLocations: !0,
              doNotLocateOnRestrictedElements: !0,
              outSpatialReference: this.get("map").spatialReference
            };
            this.get("routeParams") || (this.routeParams = {});
            var b = new ta();
            this.routeParams = d.mixin(
              b,
              {
                outputGeometryPrecision: 0,
                outputGeometryPrecisionUnits: "esriMeters",
                restrictUTurns: "esriNFSBAtDeadEndsOnly"
              },
              this.get("routeParams"),
              a
            );
          },
          _markWPsForRemovalAfterUserChangedStopSequence: function(a, b) {
            for (
              var c = a - 1, d = [];
              0 <= c && this._isStopAWaypoint(this.stops[c]);

            )
              d.push(this.stops[c]), c--;
            for (
              c = a + 1;
              c < this.stops.length && this._isStopAWaypoint(this.stops[c]);

            )
              d.push(this.stops[c]), c++;
            if (b > a)
              for (
                c = b + 1;
                c < this.stops.length && this._isStopAWaypoint(this.stops[c]);

              )
                d.push(this.stops[c]), c++;
            else if (void 0 !== b)
              for (c = b - 1; 0 <= c && this._isStopAWaypoint(this.stops[c]); )
                d.push(this.stops[c]), c--;
            else if (this.returnToStart && 0 === a)
              for (
                c = this.stops.length - 1;
                0 <= c && this._isStopAWaypoint(this.stops[c]);

              )
                d.push(this.stops[c]), c--;
            return d;
          },
          _removeSomeWaypoints: function(a) {
            for (var b = new J(), c = [], d = 0; d < a.length; d++) {
              var e = v.indexOf(this.stops, a[d]);
              -1 < e && c.push(this._removeStop(e, !0, !0));
            }
            M(c).always(b.resolve);
            return b.promise;
          },
          _modifyStopSequence: function(a, b) {
            var c = this._dnd.getAllNodes(),
              e = new J(),
              l,
              k = [];
            if (c.length)
              if (
                (this._removeLocateButtonVisibilityEvents(),
                arguments.length && void 0 !== a)
              )
                if (
                  0 <= a &&
                  0 <= b &&
                  a < this.stops.length &&
                  b < this.stops.length &&
                  a !== b
                ) {
                  var c = this._markWPsForRemovalAfterUserChangedStopSequence(
                      a,
                      b
                    ),
                    f = this.stops.splice(a, 1);
                  this.stops.splice(b, 0, f[0]);
                  for (l = 0; l < this.stops.length; l++)
                    k.push(this._updateStop(this.stops[l], l));
                  k.push(this._removeSomeWaypoints(c));
                  M(k).always(
                    d.hitch(this, function() {
                      this._solveAndZoom().always(e.resolve);
                    })
                  );
                } else e.reject("Invalid From and To values.");
              else {
                for (l = 0; l < this.stops.length; )
                  this._isStopAWaypoint(this.stops[l])
                    ? k.push(this._removeStop(l, !0, !0))
                    : l++;
                M(k).always(
                  d.hitch(this, function() {
                    k = [];
                    this.stops.reverse();
                    for (l = 0; l < this.stops.length; l++)
                      k.push(this._updateStop(this.stops[l], l));
                    M(k).always(
                      d.hitch(this, function() {
                        this._solveAndZoom().always(e.resolve);
                      })
                    );
                  })
                );
              }
            else e.resolve();
            return e.promise;
          },
          _setMenuNodeValues: function(a) {
            "traffic" !== a && this._clearDisplayBeforeSolve();
            a = this.get("optimalRoute");
            this._findOptimalOrderNode &&
              N.set(this._findOptimalOrderNode, "checked", a);
            this._returnToStartNode &&
              ((a =
                this.returnToStart &&
                !this.maxStopsReached &&
                this.stops[0] &&
                (!this.stops[0].feature || this._isStopLocated(this.stops[0]))),
              N.set(this._returnToStartNode, "checked", a),
              this.set("returnToStart", a),
              this.maxStopsReached &&
                this.returnToStart &&
                this._showMessage(B.widgets.directions.error.maximumStops));
            if (
              !this.returnToStart &&
              !this._incrementalSolveStopRange &&
              this.directions
            )
              for (
                this._incrementalSolveStopRange = {
                  start: this.stops.length - 1,
                  end: this.stops.length
                },
                  this._clearRouteGraphics(),
                  this._incrementalSolveStopRange = null,
                  a = this.stops.length;
                0 < a-- && this._isStopAWaypoint(this.stops[a]);

              )
                this._removeSomeWaypoints([this.stops[a]]);
            this._useTrafficNode &&
              (N.set(this._useTrafficNode, "checked", this.traffic),
              this.traffic
                ? (this._updateMapTimeExtent(), this._addTrafficLayer())
                : (this._removeTrafficLayer(), this._restoreMapTimeExtent()));
            switch (this.get("directionsLengthUnits")) {
              case K.KILOMETERS:
                N.set(this._useKilometersNode, "checked", !0);
                N.set(this._useMilesNode, "checked", !1);
                break;
              case K.MILES:
                N.set(this._useKilometersNode, "checked", !1),
                  N.set(this._useMilesNode, "checked", !0);
            }
            I.set(
              this._printButton,
              "display",
              this.showPrintPage ? "inline-block" : "none"
            );
            I.set(
              this._saveMenuButton,
              "display",
              this.showSaveButton && this.owningSystemUrl
                ? "inline-block"
                : "none"
            );
            this._showMilesKilometersOption();
            this._showClearButton();
          },
          _optionsMenu: function() {
            this._useTrafficItemNode &&
              I.set(
                this._useTrafficItemNode,
                "display",
                this.get("showTrafficOption") ? "block" : "none"
              );
            this._returnToStartItemNode &&
              I.set(
                this._returnToStartItemNode,
                "display",
                this.get("showReturnToStartOption") ? "block" : "none"
              );
            this._findOptimalOrderItemNode &&
              I.set(
                this._findOptimalOrderItemNode,
                "display",
                this.get("showOptimalRouteOption") && 3 < this._getStopCount()
                  ? "block"
                  : "none"
              );
            this.stops.length >= this.get("minStops")
              ? E.add(
                  this._widgetContainer,
                  this._css.stopsOptionsOptionsEnabledClass
                )
              : (E.remove(
                  this._widgetContainer,
                  this._css.stopsOptionsOptionsEnabledClass
                ),
                this._optionsMenuNode &&
                  "block" === I.get(this._optionsMenuNode, "display") &&
                  this._toggleOptionsMenu());
          },
          _stopsRemovable: function() {
            2 < this._dnd.getAllNodes().length - this._getWaypointCount()
              ? E.add(this._widgetContainer, this._css.stopsRemovableClass)
              : E.remove(this._widgetContainer, this._css.stopsRemovableClass);
          },
          _checkMaxStops: function() {
            this.set(
              "maxStopsReached",
              this._getStopCount() +
                this._getWaypointCount() +
                (this.returnToStart ? 1 : 0) >=
                this.maxStops
            );
            this._showAddDestination();
          },
          _updateThemeWatch: function(a, b, c) {
            E.remove(this.domNode, b);
            E.add(this.domNode, c);
          },
          _toggleOptionsMenu: function() {
            "block" === I.get(this._optionsMenuNode, "display")
              ? (I.set(this._optionsMenuNode, "display", "none"),
                E.remove(this._optionsButtonNode, "esriStopsOptionsOpen"),
                (this._optionsButtonNode.innerHTML =
                  B.widgets.directions.showOptions))
              : (I.set(this._optionsMenuNode, "display", "block"),
                E.add(this._optionsButtonNode, "esriStopsOptionsOpen"),
                (this._optionsButtonNode.innerHTML =
                  B.widgets.directions.hideOptions));
          },
          _toggleSaveMenu: function(a) {
            "block" === I.get(this._saveMenuNode, "display") || !1 === a
              ? (I.set(this._saveMenuNode, "display", "none"),
                E.remove(
                  this._saveMenuButton,
                  this._css.stopsPressedButtonClass
                ))
              : (this.clearMessages(),
                I.set(this._saveMenuNode, "display", "block"),
                E.add(this._saveMenuButton, this._css.stopsPressedButtonClass),
                this._enableSharing().then(
                  d.hitch(this, function() {
                    this._outputLayer.setValue(
                      this.routeLayer.title
                        ? this.routeLayer.title
                        : this.directions && this.directions.routeName
                    );
                    if (this.routeLayer.ownerFolder)
                      for (
                        var a = this._folderSelector.store.objectStore.data,
                          b = 0;
                        b < a.length;
                        b++
                      )
                        if (a[b].folderId === this.routeLayer.ownerFolder) {
                          this._folderSelector.getValue() !== a[b].id &&
                            ((this._folderSelector._interractive = !1),
                            this._folderSelector.setValue(a[b].id));
                          break;
                        }
                    this._enableButton(
                      this._saveButton,
                      this.routeLayer.isItemOwner ||
                        !this._userCanCreatePortalItem
                    );
                    this._outputLayer.set("disabled", !1);
                  })
                ));
          },
          _showToolbar: function() {
            E[
              (this.stops.length < this.maxStops && this.canModifyStops) ||
              this.canModifyWaypoints
                ? "add"
                : "remove"
            ].call(O, this._widgetContainer, this._css.addStopsClass);
          },
          _showAddDestination: function() {
            this._showToolbar();
            this._addDestinationNode.style.display =
              this.stops.length < this.maxStops && this.canModifyStops
                ? "inline"
                : "none";
          },
          _showMapClickActiveButton: function() {
            this._showToolbar();
            this._activateButtonNode.style.display =
              this.canModifyStops || this.canModifyWaypoints
                ? "inline-block"
                : "none";
          },
          _getAbsoluteUrl: function(a) {
            a = h.toUrl(a);
            return /^https?\:/i.test(a)
              ? a
              : /^\/\//i.test(a)
              ? ea + a
              : /^\//i.test(a)
              ? ea + "//" + window.location.host + a
              : a;
          },
          _getManeuverImage: function(a) {
            return a
              ? "esriDMTStop" === a || "esriDMTDepart" === a
                ? ""
                : this._getAbsoluteUrl(
                    "./images/Directions/maneuvers/" + a + ".png"
                  )
              : "";
          },
          _loadPrintDirections: function(a) {
            var b = this.get("printTemplate"),
              c = new J();
            this.directionsLengthUnits !==
            this.routeParams.directionsLengthUnits
              ? this.getDirections().then(c.resolve, c.reject)
              : c.resolve();
            c.then(
              d.hitch(this, function() {
                if (!b && this.directions) {
                  var c = this._getAbsoluteUrl("./css/Directions.css"),
                    d = this._getAbsoluteUrl("./css/DirectionsPrint.css"),
                    e = this._getAbsoluteUrl(
                      "./images/Directions/print-logo.png"
                    ),
                    l;
                  l = H.isBodyLtr() ? "ltr" : "rtl";
                  b = "";
                  b += "\x3c!DOCTYPE HTML\x3e";
                  b +=
                    '\x3chtml lang\x3d"en" class\x3d"' +
                    this.get("theme") +
                    '" dir\x3d"' +
                    l +
                    '"\x3e';
                  b += "\x3chead\x3e";
                  b += '\x3cmeta charset\x3d"utf-8"\x3e';
                  b +=
                    '\x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3dEdge,chrome\x3d1"\x3e';
                  b +=
                    "\x3ctitle\x3e" +
                    this.get("directions").routeName +
                    "\x3c/title\x3e";
                  b +=
                    '\x3clink rel\x3d"stylesheet" media\x3d"screen" type\x3d"text/css" href\x3d"' +
                    c +
                    '" /\x3e';
                  b +=
                    '\x3clink rel\x3d"stylesheet" media\x3d"print" type\x3d"text/css" href\x3d"' +
                    d +
                    '" /\x3e';
                  b += "\x3c/head\x3e";
                  b +=
                    '\x3cbody class\x3d"' +
                    this._css.esriPrintPageClass +
                    '"\x3e';
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriPrintBarClass +
                    '"\x3e';
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriCloseButtonClass +
                    '" title\x3d"' +
                    B.common.close +
                    '" onclick\x3d"window.close();"\x3e' +
                    B.common.close +
                    "\x3c/div\x3e";
                  b +=
                    '\x3cdiv id\x3d"printButton" class\x3d"' +
                    this._css.esriPrintButtonClass +
                    '" title\x3d"' +
                    B.widgets.directions.print +
                    '" onclick\x3d"window.print();"\x3e' +
                    B.widgets.directions.print +
                    "\x3c/div\x3e";
                  b += "\x3c/div\x3e";
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriPrintMainClass +
                    '"\x3e';
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriPrintHeaderClass +
                    '"\x3e';
                  b +=
                    '\x3cimg class\x3d"' +
                    this._css.esriPrintLogoClass +
                    '" src\x3d"' +
                    e +
                    '" /\x3e';
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriPrintNameClass +
                    '"\x3e' +
                    this.get("directions").routeName +
                    "\x3c/div\x3e";
                  b += this._renderDirectionsSummary(this.directions);
                  a &&
                    ((b +=
                      '\x3cdiv id\x3d"divMap" class\x3d"esriPrintMap esriPrintWait"\x3e\x3c/div\x3e'),
                    (b += '\x3chr class\x3d"esriNoPrint"/\x3e'));
                  b += '\x3cdiv id\x3d"print_helper"\x3e\x3c/div\x3e';
                  b +=
                    '\x3ctextarea onkeyup\x3d"document.getElementById(\'print_helper\').innerHTML\x3dthis.value;" id\x3d"print_area" class\x3d"' +
                    this._css.esriPrintNotesClass +
                    '" placeholder\x3d"' +
                    B.widgets.directions.printNotes +
                    '"\x3e\x3c/textarea\x3e';
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.clearClass +
                    '"\x3e\x3c/div\x3e';
                  b += "\x3c/div\x3e";
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriPrintDirectionsClass +
                    '"\x3e';
                  b += this._renderDirectionsTable(this.directions);
                  b += "\x3c/div\x3e";
                  b +=
                    '\x3cdiv class\x3d"' +
                    this._css.esriPrintFooterClass +
                    '"\x3e';
                  b +=
                    "\x3cp\x3e" +
                    B.widgets.directions.printDisclaimer +
                    "\x3c/p\x3e";
                  b += "\x3c/div\x3e";
                  b += "\x3c/div\x3e";
                  b += "\x3c/body\x3e";
                  b += "\x3c/html\x3e";
                }
                this._printWindow.document.open("text/html", "replace");
                this._printWindow.document.write(b);
                this._printWindow.document.close();
              })
            );
          },
          _printDirections: function() {
            if (this.directions) {
              var a = screen.width / 2,
                b = screen.height / 1.5,
                a =
                  "toolbar\x3dno, location\x3dno, directories\x3dno, status\x3dyes, menubar\x3dno, scrollbars\x3dyes, resizable\x3dyes, width\x3d" +
                  a +
                  ", height\x3d" +
                  b +
                  ", top\x3d" +
                  (screen.height / 2 - b / 2) +
                  ", left\x3d" +
                  (screen.width / 2 - a / 2);
              this.get("printPage")
                ? ((window.directions = this.get("directions")),
                  window.open(
                    this.get("printPage"),
                    "directions_widget_print",
                    a,
                    !0
                  ))
                : ((this._printWindow = window.open(
                    "",
                    "directions_widget_print",
                    a,
                    !0
                  )),
                  this._loadPrintDirections(!!this._printService),
                  this._printService &&
                    h(
                      ["dojo/_base/window"],
                      d.hitch(this, function(a) {
                        this.zoomToFullRoute().then(
                          d.hitch(this, function() {
                            this._printService.execute(
                              this._printParams,
                              d.hitch(this, function(b) {
                                a.withDoc(
                                  this._printWindow.document,
                                  function() {
                                    var a = A.byId("divMap");
                                    a &&
                                      (E.remove(a, "esriPrintWait"),
                                      E.add(a, "esriPageBreak"),
                                      O.create(
                                        "img",
                                        {
                                          src: b.url,
                                          class: "esriPrintMapImg"
                                        },
                                        a
                                      ));
                                  }
                                );
                              }),
                              d.hitch(this, function(b) {
                                a.withDoc(
                                  this._printWindow.document,
                                  function() {
                                    var a = A.byId("divMap");
                                    a && E.remove(a, "esriPrintWait");
                                  }
                                );
                                console.error(
                                  "Error while calling print service:\n " + b
                                );
                              })
                            );
                          })
                        );
                      })
                    ));
            }
          },
          _enableButton: function(a, b) {
            b = b || void 0 === b;
            E[b ? "remove" : "add"].apply(this, [
              a,
              "esriDisabledDirectionsButton"
            ]);
            a._enabled = b;
          },
          _clearStopsStatusAttr: function() {
            for (var a = 0; a < this.stops.length; a++)
              this.stops[a].feature &&
                this.stops[a].feature.attributes &&
                (this.stops[a].feature.attributes.Status = void 0);
          },
          _enableSharing: function() {
            var e = new J();
            !this._naRouteSharing && this.owningSystemUrl
              ? h(
                  ["../tasks/NARouteSharing"],
                  d.hitch(this, function(l) {
                    this._naRouteSharing = new l(
                      this.owningSystemUrl,
                      this.map.spatialReference
                    );
                    this._folderSelector ||
                      ((this._folderSelector = new f(
                        {
                          className: "esriFoldersDDL",
                          style: "width: 100%;",
                          sortByLabel: !1,
                          disabled: !0,
                          _interractive: !0,
                          onChange: d.hitch(this, function() {
                            this._folderSelector._interractive
                              ? this._enableButton(
                                  this._saveButton,
                                  !this.routeLayer.itemId
                                )
                              : (this._folderSelector._interractive = !0);
                          })
                        },
                        this._folderSelectorContainer
                      )),
                      this._folderSelector.startup(),
                      (this._outputLayer = new c(
                        {
                          style: "width: 100%",
                          required: !0,
                          trim: !0,
                          regExp: '[^\x26|\x3c|\x3e|%|#|?|\\|"|/|+]+',
                          maxLength: 98,
                          disabled: !0,
                          onKeyPress: d.hitch(this, function() {
                            this._enableButton(
                              this._saveButton,
                              !this.routeLayer.itemId ||
                                !this._userCanCreatePortalItem
                            );
                          }),
                          onFocus: d.hitch(this, function() {
                            this.map && this.map.disableKeyboardNavigation();
                          }),
                          onBlur: d.hitch(this, function() {
                            this.map && this.map.enableKeyboardNavigation();
                          })
                        },
                        this._outputLayerContainer
                      )),
                      this._outputLayer.startup());
                    this._naRouteSharing.getFolders().then(
                      d.hitch(this, function(c) {
                        for (var l = [], k = 0; k < c.length; k++)
                          l.push({
                            id: c[k].url,
                            folderId: c[k].id,
                            label: c[k].title
                          });
                        this._folderSelector.setStore(
                          new a({ objectStore: new b({ data: l }) })
                        );
                        this._naRouteSharing.canCreateItem().then(
                          d.hitch(this, function(a) {
                            this._folderSelector.set("disabled", !a);
                            this._userCanCreatePortalItem = a;
                          })
                        );
                        this._enableButton(this._saveButton);
                        e.resolve();
                      }),
                      d.hitch(this, function(a) {
                        console.log(a);
                        this._naRouteSharing = null;
                        this._toggleSaveMenu(!1);
                        e.reject(a);
                      })
                    );
                  })
                )
              : this.owningSystemUrl
              ? e.resolve()
              : (e.reject(
                  Error(
                    "Owning system is not defined, or the Directions widget is not done initializing."
                  )
                ),
                (this._naRouteSharing = null));
            return e.promise;
          },
          _storeRouteUI: function() {
            var a = new J();
            this._outputLayer && this._outputLayer.isValid()
              ? this._storeRoute(
                  this._outputLayer.getValue(),
                  this._folderSelector.getValue(),
                  this._folderSelector.store.objectStore.get(
                    this._folderSelector.getValue()
                  ).folderId
                ).then(a.resolve, a.reject)
              : (this._outputLayer && this._outputLayer.focus(),
                a.reject(Error("Need result layer name specified.")));
            return a.promise;
          },
          _storeRoute: function(a, b, c) {
            var e = new J(),
              l = this.directions;
            if (this._savingRoute || !this._naRouteSharing)
              return (
                this._saveButton.blur(),
                e.reject(Error("Not ready to store route.")),
                e.promise
              );
            this.clearMessages();
            e.then(
              null,
              d.hitch(this, function(a) {
                console.log("ERR", a);
                this._showMessage(B.widgets.directions.error.cantSaveRoute);
              })
            );
            e.promise.always(
              d.hitch(this, function() {
                this._enableButton(this._saveButton);
                I.set(
                  this._saveAsButton,
                  "display",
                  this.routeLayer.itemId && this._userCanCreatePortalItem
                    ? "inline-block"
                    : "none"
                );
                this._showLoadingSpinner();
                this._savingRoute = !1;
              })
            );
            if (
              l &&
              l.features &&
              l.features.length &&
              this.stops &&
              this.stops.length
            )
              if (this.owningSystemUrl)
                if (this.routeParams && this.routeParams.travelMode)
                  if (a && b) {
                    var k, f;
                    k = d.hitch(this, function(a) {
                      return this._naRouteSharing.getAttributeUnits(
                        a,
                        this.serviceDescription
                      );
                    });
                    f = this.routeParams.travelMode.timeAttributeName;
                    var g = this.routeParams.travelMode.distanceAttributeName,
                      y = k(f),
                      D = k(g),
                      q =
                        this.routeParams.directionsLengthUnits ||
                        this.serviceDescription.directionsLengthUnits,
                      m = this._naRouteSharing.toMeters,
                      A = this._naRouteSharing.toMinutes,
                      G = function(a, b, c) {
                        var d, e;
                        for (e in a)
                          a.hasOwnProperty(e) &&
                            0 === e.indexOf(b) &&
                            -1 === v.indexOf(c, e.substr(b.length)) &&
                            ((d = d || {}), (d[e.substr(b.length)] = a[e]));
                        return d;
                      },
                      L = [],
                      F = [],
                      r = [],
                      n;
                    if (f && y && g && D) {
                      var h = [],
                        H =
                          this.routeParams.accumulateAttributes ||
                          this.serviceDescription.accumulateAttributeNames ||
                          [],
                        x = this.serviceDescription.networkDataset
                          .networkAttributes;
                      for (k = 0; k < x.length; k++)
                        "esriNAUTCost" === x[k].usageType &&
                          -1 === v.indexOf(H, x[k].name) &&
                          x[k].name !== f &&
                          x[k].name !== g &&
                          h.push(x[k].name);
                      var H = this.get("stops"),
                        K = {
                          xmin: Infinity,
                          ymin: Infinity,
                          xmax: -Infinity,
                          ymax: -Infinity
                        };
                      for (k = 0; k < H.length; k++)
                        if (H[k].feature && H[k].feature.toJson) {
                          x = H[k].feature.toJson();
                          n = x.attributes;
                          var w = x.geometry,
                            R = this._naRouteSharing.getUTCOffset(
                              n.ArriveTime,
                              n.ArriveTimeUTC
                            ),
                            C = this._naRouteSharing.getUTCOffset(
                              n.DepartTime,
                              n.DepartTimeUTC
                            );
                          d.mixin(K, {
                            xmin: K.xmin > w.x ? w.x : K.xmin,
                            ymin: K.ymin > w.y ? w.y : K.ymin,
                            xmax: K.xmax < w.x ? w.x : K.xmax,
                            ymax: K.ymax < w.y ? w.y : K.ymax
                          });
                          x.attributes = {
                            __OBJECTID: k + 1,
                            CurbApproach: n.CurbApproach,
                            ArrivalCurbApproach: n.ArriveCurbApproach,
                            DepartureCurbApproach: n.DepartCurbApproach,
                            Name:
                              n.Name === this._waypointName
                                ? B.widgets.directions.waypoint
                                : n.Name === this._userDefinedStopName
                                ? H[k].name
                                : n.Name,
                            RouteName: l.routeName,
                            Sequence: n.Sequence,
                            Status: n.Status,
                            LocationType: n.isWaypoint ? 1 : 0,
                            TimeWindowStart: n.TimeWindowStart,
                            TimeWindowEnd: n.TimeWindowEnd,
                            TimeWindowStartUTCOffset: R,
                            TimeWindowEndUTCOffset: R,
                            ServiceMinutes: A(n["Attr_" + f], y),
                            ServiceMeters: m(n["Attr_" + g], D),
                            ServiceCosts: Q.stringify(G(n, "Attr_", h)),
                            CumulativeMinutes: A(n["Cumul_" + f], y),
                            CumulativeMeters: m(n["Cumul_" + g], D),
                            CumulativeCosts: Q.stringify(G(n, "Cumul_", h)),
                            LateMinutes: A(n["Violation_" + f], y),
                            WaitMinutes: A(n["Wait_" + f], y),
                            ArrivalTime: this._naRouteSharing.toUTCTime(
                              n.ArriveTime,
                              R
                            ),
                            DepartureTime: this._naRouteSharing.toUTCTime(
                              n.DepartTime,
                              C
                            ),
                            ArrivalUTCOffset: R,
                            DepartureUTCOffset: C
                          };
                          L.push(x);
                        }
                      g = 0;
                      D = function(a) {
                        try {
                          a.strings = Q.parse(a.strings);
                        } catch (Ca) {
                          O.strings = void 0;
                        }
                        if (a.strings && a.strings.length)
                          for (var b = 0; b < a.strings.length; b++)
                            if ("esriDSTGeneral" === a.strings[b].stringType)
                              return a.strings[b].string;
                      };
                      H = function(a, b) {
                        for (var c = [], d = 0; d < (a || []).length; d++)
                          (a[d].stringType !== b && b) || c.push(a[d].string);
                        return c.length ? c.toString() : void 0;
                      };
                      x = function(a) {
                        switch (a) {
                          case "esriDMTStop":
                            return "esriDPTManeuverArrive";
                          case "esriDMTDepart":
                            return "esriDPTManeuverDepart";
                          case "esriDMTDoorPassage":
                            return "esriDPTManeuverDoor";
                          case "esriDMTBearLeft":
                            return "esriDPTManeuverBearLeft";
                          case "esriDMTBearRight":
                            return "esriDPTManeuverBearRight";
                          case "esriDMTElevator":
                            return "esriDPTManeuverElevator";
                          case "esriDMTEscalator":
                            return "esriDPTManeuverEscalator";
                          case "esriDMTFerry":
                            return "esriDPTManeuverFerryOn";
                          case "esriDMTEndOfFerry":
                            return "esriDPTManeuverFerryOff";
                          case "esriDMTForkCenter":
                            return "esriDPTManeuverForkCenter";
                          case "esriDMTForkLeft":
                            return "esriDPTManeuverForkLeft";
                          case "esriDMTForkRight":
                            return "esriDPTManeuverForkRight";
                          case "esriDMTPedestrianRamp":
                            return "esriDPTManeuverPedestrianRamp";
                          case "esriDMTRampLeft":
                            return "esriDPTManeuverRampLeft";
                          case "esriDMTRampRight":
                            return "esriDPTManeuverRampRight";
                          case "esriDMTRoundabout":
                            return "esriDPTManeuverRoundabout";
                          case "esriDMTTurnLeft":
                            return "esriDPTManeuverTurnLeft";
                          case "esriDMTLeftLeft":
                            return "esriDPTManeuverTurnLeftLeft";
                          case "esriDMTLeftRight":
                            return "esriDPTManeuverTurnLeftRight";
                          case "esriDMTTurnRight":
                            return "esriDPTManeuverTurnRight";
                          case "esriDMTRightLeft":
                            return "esriDPTManeuverTurnRightLeft";
                          case "esriDMTRightRight":
                            return "esriDPTManeuverTurnRightRight";
                          case "esriDMTSharpLeft":
                            return "esriDPTManeuverSharpLeft";
                          case "esriDMTSharpRight":
                            return "esriDPTManeuverSharpRight";
                          case "esriDMTStraight":
                            return "esriDPTManeuverStraight";
                          case "esriDMTStrairs":
                            return "esriDPTManeuverStairs";
                          case "esriDMTUTurn":
                            return "esriDPTManeuverUTurn";
                        }
                        return "esriDPTUnknown";
                      };
                      for (k = 0; k < l.featuresWithWaypoints.length; k++) {
                        var u = l.featuresWithWaypoints[k],
                          w = u.toJson(),
                          R = w.attributes,
                          C =
                            (w.geometry &&
                              w.geometry.paths &&
                              w.geometry.paths[0]) ||
                            [],
                          M =
                            w.geometry.hasM ||
                            !1 ||
                            (C[0] && 3 === C[0].length);
                        n = this._naRouteSharing.getUTCOffset(
                          R.ETA,
                          R.arriveTimeUTC
                        );
                        w.attributes = {
                          __OBJECTID: k + 1,
                          Sequence: ++g,
                          StopID: (function() {
                            var a = void 0,
                              b =
                                u._associatedStopWithReturnToStart &&
                                u._associatedStopWithReturnToStart.attributes
                                  .Sequence;
                            if (b)
                              for (var c = 0; c < L.length; c++)
                                if (L[c].attributes.Sequence === b) {
                                  a = L[c].attributes.__OBJECTID;
                                  break;
                                }
                            return a;
                          })(),
                          DirectionPointType: x(R.maneuverType),
                          DisplayText:
                            u._associatedStopWithReturnToStart &&
                            u._associatedStopWithReturnToStart.attributes
                              .isWaypoint
                              ? R.text.replace(
                                  this._waypointName,
                                  B.widgets.directions.waypoint
                                )
                              : R.text,
                          ArrivalTime: this._naRouteSharing.toUTCTime(R.ETA, n),
                          ArrivalUTCOffset: n,
                          Azimuth: void 0,
                          Name: H(
                            l.stringsWithWaypoints[k],
                            "esriDSTStreetName"
                          ),
                          AlternateName: H(
                            l.stringsWithWaypoints[k],
                            "esriDSTAltName"
                          ),
                          ExitName: H(l.stringsWithWaypoints[k], "esriDSTExit"),
                          IntersectingName: H(
                            l.stringsWithWaypoints[k],
                            "esriDSTCrossStreet"
                          ),
                          BranchName: H(
                            l.stringsWithWaypoints[k],
                            "esriDSTBranch"
                          ),
                          TowardName: H(
                            l.stringsWithWaypoints[k],
                            "esriDSTToward"
                          ),
                          ShortVoiceInstruction: void 0,
                          VoiceInstruction: void 0,
                          Level: void 0
                        };
                        delete w.symbol;
                        delete w.infoTemplate;
                        C.length
                          ? ((w.geometry = {
                              x: C[0][0],
                              y: C[0][1],
                              spatialReference: w.geometry.spatialReference
                            }),
                            M && d.mixin(w.geometry, { m: C[0][2] }))
                          : delete w.geometry;
                        F.push(w);
                        w = u.toJson();
                        R = w.attributes;
                        C =
                          (w.geometry &&
                            w.geometry.paths &&
                            w.geometry.paths[0]) ||
                          [];
                        n = !0;
                        for (f = 0; f < C.length - 1; f++)
                          if (
                            C[f][0] !== C[f + 1][0] ||
                            C[f][1] !== C[f + 1][1]
                          ) {
                            n = !1;
                            break;
                          }
                        n ||
                          ((w.attributes = {
                            DirectionPointID: k + 1,
                            DirectionLineType: "esriDLTSegment",
                            Meters: m(R.length, q),
                            Minutes: A(R.time, y),
                            FromLevel: void 0,
                            ToLevel: void 0
                          }),
                          (w.geometry.hasM = M),
                          delete w.symbol,
                          delete w.infoTemplate,
                          r.push(w));
                        var O =
                          l.eventsWithWaypoints[w.attributes.Sequence] || [];
                        for (f = 0; f < O.length; f++)
                          (w = O[f].toJson()),
                            (R = w.attributes),
                            (n = this._naRouteSharing.getUTCOffset(
                              R.ETA,
                              R.arriveTimeUTC
                            )),
                            (w.attributes = {
                              Sequence: ++g,
                              DirectionPointType: "esriDPTEvent",
                              DisplayText: D(R),
                              ArrivalTime: this._naRouteSharing.toUTCTime(
                                R.ETA,
                                n
                              ),
                              ArrivalUTCOffset: n,
                              Name: R.strings
                            }),
                            F.push(w);
                      }
                      f =
                        (this.routeParams.barriers &&
                          this.routeParams.barriers.features) ||
                        [];
                      var t = [];
                      for (k = 0; k < f.length; k++)
                        (g = f[k].toJson()),
                          (D = g.attributes),
                          (g.attributes = {
                            BarrierType: D.BarrierType || 0,
                            FullEdge: D.FullEdge || !1,
                            AddedCost:
                              D["Attr_" + this._getImpedanceAttribute().name] ||
                              0,
                            Costs: Q.stringify(G(D, "Attr_", h)),
                            CurbApproach: D.CurbApproach || 0,
                            Name: D.Name
                          }),
                          t.push(g);
                      f =
                        (this.routeParams.polylineBarriers &&
                          this.routeParams.polylineBarriers.features) ||
                        [];
                      var Z = [];
                      for (k = 0; k < f.length; k++)
                        (g = f[k].toJson()),
                          (D = g.attributes),
                          (g.attributes = {
                            BarrierType: D.BarrierType || 0,
                            ScaleFactor:
                              D["Attr_" + this._getImpedanceAttribute().name] ||
                              1,
                            Costs: Q.stringify(G(D, "Attr_", h)),
                            Name: D.Name
                          }),
                          Z.push(g);
                      f =
                        (this.routeParams.polygonBarriers &&
                          this.routeParams.polygonBarriers.features) ||
                        [];
                      var N = [];
                      for (k = 0; k < f.length; k++)
                        (g = f[k].toJson()),
                          (D = g.attributes),
                          (g.attributes = {
                            BarrierType: D.BarrierType || 0,
                            ScaleFactor:
                              D["Attr_" + this._getImpedanceAttribute().name] ||
                              1,
                            Costs: Q.stringify(G(D, "Attr_", h)),
                            Name: D.Name
                          }),
                          N.push(g);
                      var E = {
                        geometry: l.mergedGeometry,
                        attributes: {
                          RouteName: l.routeName,
                          TotalMinutes: A(l.totalTime, y),
                          TotalMeters: m(l.totalLength, q),
                          TotalLateMinutes: (function() {
                            for (var a = 0, b = 0; b < L.length; b++)
                              a += L[b].attributes.LateMinutes || 0;
                            return a;
                          })(),
                          TotalWaitMinutes: (function() {
                            for (var a = 0, b = 0; b < L.length; b++)
                              a += L[b].attributes.WaitMinutes || 0;
                            return a;
                          })(),
                          TotalCosts:
                            L[L.length - 1].attributes.CumulativeCosts,
                          StartTime:
                            "none" !== this.startTime
                              ? L[0].attributes.ArrivalTime
                              : null,
                          EndTime:
                            "none" !== this.startTime
                              ? L[L.length - 1].attributes.DepartureTime
                              : null,
                          StartUTCOffset: L[0].attributes.ArrivalUTCOffset,
                          EndUTCOffset:
                            L[L.length - 1].attributes.DepartureUTCOffset,
                          Messages: Q.stringify(this._solverMessages),
                          AnalysisSettings: Q.stringify({
                            travelMode: d.hitch(this, function() {
                              var a = d.clone(this.routeParams.travelMode);
                              "\x26lt;" === a.name.substr(0, 4) &&
                                "\x26gt;" ===
                                  a.name.substr(a.name.length - 4, 4) &&
                                (a.name = a.name.substr(4, a.name.length - 8));
                              return a;
                            })(),
                            directionsLanguage:
                              this.routeParams.directionsLanguage ||
                              this.serviceDescription.directionsLanguage,
                            startTimeIsUTC: this.routeParams.startTimeIsUTC,
                            timeWindowsAreUTC: this.routeParams
                              .timeWindowsAreUTC,
                            findBestSequence: this.routeParams.findBestSequence,
                            preserveFirstStop: this.routeParams
                              .preserveFirstStop,
                            preserveLastStop: this.routeParams.preserveLastStop,
                            accumulateAttributeNames:
                              this.routeParams.accumulateAttributes ||
                              this.serviceDescription.accumulateAttributeNames
                          })
                        }
                      };
                      this._enableButton(this._saveButton, !1);
                      this._savingRoute = !0;
                      this._showLoadingSpinner(!0);
                      d.hitch(this, function() {
                        var a = new J();
                        this._printService
                          ? this.zoomToFullRoute().then(
                              d.hitch(this, function() {
                                var b = this._printParams.template,
                                  c = b.exportOptions;
                                b.exportOptions = {
                                  width: 200,
                                  height: 133,
                                  dpi: 96
                                };
                                this._printService.execute(
                                  this._printParams,
                                  function(d) {
                                    b.exportOptions = c;
                                    a.resolve(d.url);
                                  },
                                  function(d) {
                                    b.exportOptions = c;
                                    console.error(
                                      "Error while calling print service:\n " +
                                        d
                                    );
                                    a.resolve();
                                  }
                                );
                              })
                            )
                          : a.resolve();
                        return a.promise;
                      })().then(
                        d.hitch(this, function(k) {
                          var f = {
                            folder: b,
                            name: a,
                            stops: L,
                            directionPoints: F,
                            directionLines: r,
                            barriers: t,
                            polylineBarriers: Z,
                            polygonBarriers: N,
                            extent: d.mixin(d.clone(l.extent), {
                              xmin:
                                K.xmin > l.extent.xmin ? l.extent.xmin : K.xmin,
                              ymin:
                                K.ymin > l.extent.ymin ? l.extent.ymin : K.ymin,
                              xmax:
                                K.xmax < l.extent.xmax ? l.extent.xmax : K.xmax,
                              ymax:
                                K.ymax < l.extent.ymax ? l.extent.ymax : K.ymax
                            }),
                            routeInfo: E,
                            thumbnail: k
                          };
                          this._userCanCreatePortalItem
                            ? this._naRouteSharing
                                .store(f, this.routeLayer.itemId, "1.0.0")
                                .then(
                                  d.hitch(this, function(a) {
                                    if (a.success) {
                                      var b = this._naRouteSharing.portal,
                                        b =
                                          "//" +
                                          (b.isPortal
                                            ? b.portalHostname
                                            : b.urlKey + "." + b.customBaseUrl);
                                      this._toggleSaveMenu();
                                      this._showMessage(
                                        B.widgets.directions.routeIsSaved +
                                          "\x3cbr/\x3e\x3ca class\x3d'esriLinkButton' target\x3d'_blank' href\x3d'" +
                                          b +
                                          "/home/item.html?id\x3d" +
                                          a.id +
                                          "'\x3e" +
                                          B.widgets.directions.share +
                                          "\x3c/a\x3e",
                                        !0
                                      );
                                      if (this.routeLayer.itemId)
                                        this.onRouteItemUpdated(a.id);
                                      else this.onRouteItemCreated(a.id);
                                      d.mixin(this.routeLayer, {
                                        itemId: a.id,
                                        title: f.name,
                                        isItemOwner: !0,
                                        ownerFolder: c
                                      });
                                      e.resolve(a);
                                    } else e.reject(a);
                                  }),
                                  e.reject
                                )
                            : this._naRouteSharing
                                .createFeatureCollection(f, "1.0.0")
                                .then(
                                  d.hitch(this, function(a) {
                                    e.resolve(a);
                                    this._toggleSaveMenu();
                                    this.onFeatureCollectionCreated(a);
                                  }),
                                  e.reject
                                );
                        })
                      );
                    } else e.reject(Error("Cannot deduce the impedance used."));
                  } else
                    e.reject(
                      Error(
                        "Missing required parameter: layerName, folder must be specified."
                      )
                    );
                else
                  e.reject(
                    Error("Shared route must be built using a Travel Mode.")
                  );
              else
                e.reject(
                  Error(
                    "Cannot store route: owning system to store routes is not defined. Please specify Portal or ArcGIS Online Url in constructor."
                  )
                );
            else e.reject(Error("No route to share. Build a route first."));
            return e.promise;
          },
          _loadRoute: function(c) {
            var e = new J();
            e.promise.always(
              d.hitch(this, function() {
                this._showLoadingSpinner(!1);
                I.set(
                  this._saveAsButton,
                  "display",
                  this.routeLayer.itemId && this._userCanCreatePortalItem
                    ? "inline-block"
                    : "none"
                );
                this._enableButton(
                  this._saveButton,
                  this.routeLayer.isItemOwner
                );
              })
            );
            this._reset().then(
              d.hitch(this, function() {
                this._showLoadingSpinner(!0);
                this._enableSharing().then(
                  d.hitch(this, function() {
                    var l = d.clone(this.serviceDescription),
                      k = d.hitch(this, function(a) {
                        d.mixin(this.routeLayer, {
                          itemId: c,
                          title: a.title,
                          isItemOwner: a.isItemOwner,
                          ownerFolder: a.ownerFolder
                        });
                      }),
                      f,
                      g,
                      D,
                      q;
                    l.directionsLengthUnits = this.directionsLengthUnits;
                    this._naRouteSharing.load(c, l).then(
                      d.hitch(this, function(c) {
                        if (c.routeParameters) {
                          d.mixin(this.routeParams, c.routeParameters);
                          this.routeParams.accumulateAttributes =
                            c.routeParameters.accumulateAttributeNames;
                          this.set(
                            "optimalRoute",
                            this.routeParams.findBestSequence
                          );
                          this.startTime = this.routeParams.startTime
                            ? this.routeParams.startTime
                            : "none";
                          this._setStartTime(void 0, void 0, this.startTime);
                          var m = c.routeParameters.travelMode,
                            A = m
                              ? this._getCostAttribute(m.impedanceAttributeName)
                              : void 0,
                            A = A
                              ? this._isTimeUnits(A.units)
                                ? "Time"
                                : "Distance"
                              : "";
                          q =
                            l.supportedTravelModes &&
                            l.supportedTravelModes.length
                              ? this._travelModeSelector.store.objectStore.data.slice()
                              : [];
                          if ((canUseRouteLayerTM = 1 !== c.successCode && A)) {
                            var G =
                              "AUTOMOBILE" === m.type
                                ? "Driving"
                                : "TRUCK" === m.type
                                ? "Trucking"
                                : "WALK" === m.type
                                ? "Walking"
                                : "Other";
                            m.name = "\x26lt;" + m.name + "\x26gt;";
                            this.serviceDescription.supportedTravelModes = (
                              l.supportedTravelModes || []
                            ).concat(m);
                            q.push({
                              id: m.name,
                              label:
                                '\x3cdiv class\x3d"esriTravelModesDirectionsIcon esriTravelModesType' +
                                G +
                                A +
                                '"\x3e\x26nbsp;\x3c/div\x3e\x3cdiv class\x3d"esriTravelModesTypeName"\x3e' +
                                m.name +
                                "\x3c/div\x3e"
                            });
                            this._travelModeSelector.setStore(
                              new a({ objectStore: new b({ data: q }) })
                            );
                            this._travelModeSelector._interractive = !1;
                            this._travelModeSelector.setValue(m.name);
                          } else {
                            A = !1;
                            if (m && m.name)
                              for (
                                q = l.supportedTravelModes || [], f = 0;
                                f < q.length;
                                f++
                              )
                                if (q[f].name === m.name) {
                                  A = !0;
                                  this._travelModeSelector._interractive = !1;
                                  this._travelModeSelector.setValue(m.name);
                                  this.routeParams.travelMode = q[f]
                                    .impedanceAttributeName
                                    ? q[f]
                                    : q[f].itemId;
                                  c.loadMessages.push({
                                    message:
                                      B.widgets.directions.error
                                        .tmFromPortalSameName +
                                      " " +
                                      m.name,
                                    messageType: "Warning"
                                  });
                                  break;
                                }
                            if (!A)
                              if ((m = l.defaultTravelMode) && q)
                                for (f = 0; f < q.length; f++) {
                                  if (q[f].id === m) {
                                    this.routeParams.travelMode = q[f]
                                      .impedanceAttributeName
                                      ? q[f]
                                      : q[f].itemId;
                                    c.loadMessages.push({
                                      message:
                                        B.widgets.directions.error
                                          .tmFromPortalDefault +
                                        " " +
                                        (q[f].name ? q[f].name : q[f].itemId),
                                      messageType: "Warning"
                                    });
                                    break;
                                  }
                                }
                              else this.routeParams.travelMode = null;
                          }
                          this._checkStartTimeUIAvailability();
                        }
                        if (c.solveResult && c.solveResult.routeResults) {
                          var n,
                            L = Infinity,
                            F,
                            r = -Infinity,
                            m = c.solveResult.routeResults[0].stops,
                            w =
                              c.solveResult.routeResults[0].directions.features,
                            A = {};
                          for (f = 0; f < m.length; f++) {
                            var h = m[f].attributes;
                            if (h.isWaypoint)
                              for (g = 0; g < w.length; g++)
                                (G = w[g].attributes),
                                  G._stopSequence === h.Sequence &&
                                    (G.text = G.text.replace(
                                      h.Name,
                                      this._waypointName
                                    ));
                            D = h.Name + "_" + this._stopSequence++;
                            A[D] = h.isWaypoint ? this._waypointName : h.Name;
                            h.Name = D;
                            h.Sequence < L &&
                              (null !== h.ArriveCurbApproach ||
                                null !== h.DepartCurbApproach) &&
                              ((n = h.Name), (L = h.Sequence));
                            h.Sequence > r &&
                              (null !== h.ArriveCurbApproach ||
                                null !== h.DepartCurbApproach) &&
                              ((F = h.Name), (r = h.Sequence));
                          }
                          D = n + " - " + F;
                          c.solveResult.routeResults[0].routeName = D;
                          c.solveResult.routeResults[0].directions.routeName = D;
                          for (f = 0; f < w.length; f++)
                            if (
                              ((G = w[f].attributes),
                              void 0 !== G._stopSequence)
                            )
                              for (g = 0; g < m.length; g++)
                                if (
                                  G._stopSequence === m[g].attributes.Sequence
                                ) {
                                  D = m[g].attributes.Name;
                                  G.text = (G.text || "").replace(A[D], D);
                                  delete G._stopSequence;
                                  break;
                                }
                          n = m[m.length - 1];
                          m[0].geometry.x === n.geometry.x &&
                            m[0].geometry.y === n.geometry.y &&
                            ((this._returnToStartStop = this._addStopWrapperToGraphic(
                              new y(n.geometry, null, n.attributes),
                              A[n.attributes.Name]
                            )),
                            this.set("returnToStart", !0));
                          this._solveResultProcessing(c.solveResult, A).then(
                            d.hitch(this, function() {
                              this._setStartTime(
                                void 0,
                                void 0,
                                this.startTime
                              );
                              k(c);
                              this.zoomToFullRoute();
                              e.resolve(c);
                            }),
                            e.reject
                          );
                        } else {
                          if (c.routeParameters) {
                            n = c.routeParameters.stops.features;
                            this.stops = [];
                            for (f = 0; f < n.length; f++)
                              this.stops.push(
                                this._addStopWrapperToGraphic(
                                  n[f],
                                  n[f].attributes.Name
                                )
                              ),
                                this._updateStop(this.stops[f], f);
                            this._setStops();
                            c.loadMessages.push({
                              message: B.widgets.directions.routeLayerStopsOnly,
                              messageType: "Warning"
                            });
                          } else
                            c.loadMessages.push({
                              message: B.widgets.directions.routeLayerEmpty,
                              messageType: "Warning"
                            });
                          k(c);
                          e.resolve(c);
                        }
                        for (f = 0; f < c.loadMessages.length; f++)
                          this._showMessage(c.loadMessages[f].message);
                      }),
                      d.hitch(this, function(a) {
                        e.reject(a);
                        this._showMessage(
                          "GWM_0003" === a.messageCode
                            ? B.widgets.directions.error.accessDenied +
                                this._naRouteSharing.portal.getPortalUser()
                                  .username
                            : B.widgets.directions.error.loadError
                        );
                      })
                    );
                  }),
                  e.reject
                );
              }),
              e.reject
            );
            return e.promise;
          }
        });
        q("extend-esri") && d.setObject("dijit.Directions", t, D);
        return t;
      });
    },
    "dojo/data/ObjectStore": function() {
      define("../_base/lang ../Evented ../_base/declare ../_base/Deferred ../promise/all ../_base/array ../_base/connect ../regexp".split(
        " "
      ), function(h, t, d, u, v, x, n, r) {
        function f(c) {
          return "*" == c ? ".*" : "?" == c ? "." : c;
        }
        return d("dojo.data.ObjectStore", [t], {
          objectStore: null,
          constructor: function(c) {
            this._dirtyObjects = [];
            c.labelAttribute && (c.labelProperty = c.labelAttribute);
            h.mixin(this, c);
          },
          labelProperty: "label",
          getValue: function(c, d, f) {
            return "function" === typeof c.get ? c.get(d) : d in c ? c[d] : f;
          },
          getValues: function(c, d) {
            c = this.getValue(c, d);
            return c instanceof Array ? c : void 0 === c ? [] : [c];
          },
          getAttributes: function(c) {
            var d = [],
              f;
            for (f in c)
              !c.hasOwnProperty(f) ||
                ("_" == f.charAt(0) && "_" == f.charAt(1)) ||
                d.push(f);
            return d;
          },
          hasAttribute: function(c, d) {
            return d in c;
          },
          containsValue: function(c, d, f) {
            return -1 < x.indexOf(this.getValues(c, d), f);
          },
          isItem: function(c) {
            return "object" == typeof c && c && !(c instanceof Date);
          },
          isItemLoaded: function(c) {
            return c && "function" !== typeof c.load;
          },
          loadItem: function(c) {
            var d;
            "function" === typeof c.item.load
              ? u.when(c.item.load(), function(f) {
                  d = f;
                  var b = f instanceof Error ? c.onError : c.onItem;
                  b && b.call(c.scope, f);
                })
              : c.onItem && c.onItem.call(c.scope, c.item);
            return d;
          },
          close: function(c) {
            return c && c.abort && c.abort();
          },
          fetch: function(c) {
            function d(a) {
              c.onError && c.onError.call(b, a, c);
            }
            c = h.delegate(c, c && c.queryOptions);
            var g = this,
              b = c.scope || g,
              a = c.query;
            if ("object" == typeof a) {
              var a = h.delegate(a),
                k;
              for (k in a) {
                var q = a[k];
                "string" == typeof q &&
                  ((a[k] = RegExp(
                    "^" +
                      r.escapeString(q, "*?\\").replace(/\\.|\*|\?/g, f) +
                      "$",
                    c.ignoreCase ? "mi" : "m"
                  )),
                  (a[k].toString = (function(a) {
                    return function() {
                      return a;
                    };
                  })(q)));
              }
            }
            var m = this.objectStore.query(a, c);
            u.when(
              m.total,
              function(a) {
                u.when(
                  m,
                  function(d) {
                    c.onBegin && c.onBegin.call(b, a || d.length, c);
                    if (c.onItem)
                      for (var e = 0; e < d.length; e++)
                        c.onItem.call(b, d[e], c);
                    c.onComplete &&
                      c.onComplete.call(b, c.onItem ? null : d, c);
                    return d;
                  },
                  d
                );
              },
              d
            );
            c.abort = function() {
              m.cancel && m.cancel();
            };
            m.observe &&
              (this.observing && this.observing.cancel(),
              (this.observing = m.observe(function(a, b, c) {
                if (-1 == x.indexOf(g._dirtyObjects, a))
                  if (-1 == b) g.onNew(a);
                  else if (-1 == c) g.onDelete(a);
                  else
                    for (var d in a)
                      if (d != g.objectStore.idProperty)
                        g.onSet(a, d, null, a[d]);
              }, !0)));
            this.onFetch(m);
            c.store = this;
            return c;
          },
          getFeatures: function() {
            return {
              "dojo.data.api.Read": !!this.objectStore.get,
              "dojo.data.api.Identity": !0,
              "dojo.data.api.Write": !!this.objectStore.put,
              "dojo.data.api.Notification": !0
            };
          },
          getLabel: function(c) {
            if (this.isItem(c)) return this.getValue(c, this.labelProperty);
          },
          getLabelAttributes: function(c) {
            return [this.labelProperty];
          },
          getIdentity: function(c) {
            return this.objectStore.getIdentity
              ? this.objectStore.getIdentity(c)
              : c[this.objectStore.idProperty || "id"];
          },
          getIdentityAttributes: function(c) {
            return [this.objectStore.idProperty];
          },
          fetchItemByIdentity: function(c) {
            var d;
            u.when(
              this.objectStore.get(c.identity),
              function(f) {
                d = f;
                c.onItem.call(c.scope, f);
              },
              function(d) {
                c.onError.call(c.scope, d);
              }
            );
            return d;
          },
          newItem: function(c, d) {
            if (d) {
              var f = this.getValue(d.parent, d.attribute, []),
                f = f.concat([c]);
              c.__parent = f;
              this.setValue(d.parent, d.attribute, f);
            }
            this._dirtyObjects.push({ object: c, save: !0 });
            this.onNew(c);
            return c;
          },
          deleteItem: function(c) {
            this.changing(c, !0);
            this.onDelete(c);
          },
          setValue: function(c, d, f) {
            var b = c[d];
            this.changing(c);
            c[d] = f;
            this.onSet(c, d, b, f);
          },
          setValues: function(c, d, f) {
            if (!h.isArray(f))
              throw Error(
                "setValues expects to be passed an Array object as its value"
              );
            this.setValue(c, d, f);
          },
          unsetAttribute: function(c, d) {
            this.changing(c);
            var f = c[d];
            delete c[d];
            this.onSet(c, d, f, void 0);
          },
          changing: function(c, d) {
            c.__isDirty = !0;
            for (var f = 0; f < this._dirtyObjects.length; f++) {
              var b = this._dirtyObjects[f];
              if (c == b.object) {
                d && ((b.object = !1), this._saveNotNeeded || (b.save = !0));
                return;
              }
            }
            b = c instanceof Array ? [] : {};
            for (f in c) c.hasOwnProperty(f) && (b[f] = c[f]);
            this._dirtyObjects.push({
              object: !d && c,
              old: b,
              save: !this._saveNotNeeded
            });
          },
          save: function(c) {
            c = c || {};
            var d,
              f = [],
              b = [],
              a = this,
              k = this._dirtyObjects;
            try {
              n.connect(c, "onError", function() {
                if (!1 !== c.revertOnError) {
                  var d = k;
                  k = b;
                  a.revert();
                  a._dirtyObjects = d;
                } else a._dirtyObjects = k.concat(b);
              });
              var q;
              this.objectStore.transaction &&
                (q = this.objectStore.transaction());
              for (var m = 0; m < k.length; m++) {
                var e = k[m],
                  A = e.object,
                  r = e.old;
                delete A.__isDirty;
                A
                  ? ((d = this.objectStore.put(A, { overwrite: !!r })),
                    f.push(d))
                  : "undefined" != typeof r &&
                    ((d = this.objectStore.remove(this.getIdentity(r))),
                    f.push(d));
                b.push(e);
                k.splice(m--, 1);
              }
              v(f).then(
                function(a) {
                  c.onComplete && c.onComplete.call(c.scope, a);
                },
                function(a) {
                  c.onError && c.onError.call(c.scope, a);
                }
              );
              q && q.commit();
            } catch (I) {
              c.onError.call(c.scope, value);
            }
          },
          revert: function() {
            for (var c = this._dirtyObjects, d = c.length; 0 < d; ) {
              d--;
              var f = c[d],
                b = f.object,
                f = f.old;
              if (b && f) {
                for (var a in f)
                  f.hasOwnProperty(a) &&
                    b[a] !== f[a] &&
                    (this.onSet(b, a, b[a], f[a]), (b[a] = f[a]));
                for (a in b)
                  f.hasOwnProperty(a) || (this.onSet(b, a, b[a]), delete b[a]);
              } else if (f) this.onNew(f);
              else this.onDelete(b);
              delete (b || f).__isDirty;
              c.splice(d, 1);
            }
          },
          isDirty: function(c) {
            return c ? c.__isDirty : !!this._dirtyObjects.length;
          },
          onSet: function() {},
          onNew: function() {},
          onDelete: function() {},
          onFetch: function(c) {}
        });
      });
    },
    "esri/tasks/RouteTask": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../kernel ../graphic ../request ../geometry/normalizeUtils ./Task ./RouteResult ./NAMessage ./NAServiceDescription".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g) {
        h = h([f, g], {
          declaredClass: "esri.tasks.RouteTask",
          _eventMap: { "solve-complete": ["result"] },
          constructor: function(b) {
            this._url.orig = this._url.path;
            this._url.path += "/solve";
            this._handler = t.hitch(this, this._handler);
            this.registerConnectEvents();
          },
          __msigns: [
            {
              n: "solve",
              c: 3,
              a: [
                {
                  i: 0,
                  p: [
                    "stops.features",
                    "barriers.features",
                    "polylineBarriers.features",
                    "polygonBarriers.features"
                  ]
                }
              ],
              e: 2
            }
          ],
          _handler: function(b, a, f, g, m) {
            try {
              var e = [],
                k = [],
                q = b.directions || [],
                n = b.routes ? b.routes.features : [],
                r = b.stops ? b.stops.features : [],
                h = b.barriers ? b.barriers.features : [],
                C = b.polygonBarriers ? b.polygonBarriers.features : [],
                G = b.polylineBarriers ? b.polylineBarriers.features : [],
                B = b.messages,
                v = d.forEach,
                L = d.indexOf,
                u = !0,
                M,
                t,
                V =
                  (b.routes && b.routes.spatialReference) ||
                  (b.stops && b.stops.spatialReference) ||
                  (b.barriers && b.barriers.spatialReference) ||
                  (b.polygonBarriers && b.polygonBarriers.spatialReference) ||
                  (b.polylineBarriers && b.polylineBarriers.spatialReference);
              this._chk = b.checksum;
              v(q, function(a) {
                e.push((M = a.routeName));
                k[M] = { directions: a };
              });
              v(n, function(a) {
                -1 === L(e, (M = a.attributes.Name)) &&
                  (e.push(M), (k[M] = {}));
                k[M].route = a;
              });
              v(r, function(a) {
                t = a.attributes;
                -1 ===
                  L(
                    e,
                    (M = t.RouteName || "esri.tasks.RouteTask.NULL_ROUTE_NAME")
                  ) && (e.push(M), (k[M] = {}));
                "esri.tasks.RouteTask.NULL_ROUTE_NAME" !== M && (u = !1);
                void 0 === k[M].stops && (k[M].stops = []);
                k[M].stops.push(a);
              });
              0 < r.length &&
                !0 === u &&
                ((k[e[0]].stops =
                  k["esri.tasks.RouteTask.NULL_ROUTE_NAME"].stops),
                delete k["esri.tasks.RouteTask.NULL_ROUTE_NAME"],
                e.splice(
                  d.indexOf(e, "esri.tasks.RouteTask.NULL_ROUTE_NAME"),
                  1
                ));
              var Q = [];
              v(e, function(a, b) {
                k[a].routeName =
                  "esri.tasks.RouteTask.NULL_ROUTE_NAME" === a ? null : a;
                k[a].spatialReference = V;
                Q.push(new c(k[a]));
              });
              b = function(a) {
                v(a, function(b, c) {
                  b.geometry && (b.geometry.spatialReference = V);
                  a[c] = new x(b);
                });
                return a;
              };
              v(B, function(a, b) {
                B[b] = new F(a);
              });
              var D = {
                routeResults: Q,
                barriers: b(h),
                polygonBarriers: b(C),
                polylineBarriers: b(G),
                messages: B
              };
              this._successHandler([D], "onSolveComplete", f, m);
            } catch (l) {
              this._errorHandler(l, g, m);
            }
          },
          solve: function(b, a, c, d) {
            var f = d.assembly;
            b = this._encode(
              t.mixin(
                {},
                this._url.query,
                { f: "json" },
                b.toJson(f && f[0]),
                this._chk ? { checksum: this._chk } : {}
              )
            );
            var e = this._handler,
              k = this._errorHandler;
            return n({
              url: this._url.path,
              timeout: 25e4,
              content: b,
              callbackParamName: "callback",
              load: function(b, f) {
                e(b, f, a, c, d.dfd);
              },
              error: function(a) {
                k(a, c, d.dfd);
              }
            });
          },
          onSolveComplete: function() {}
        });
        r._createWrappers(h);
        u("extend-esri") && t.setObject("tasks.RouteTask", h, v);
        return h;
      });
    },
    "esri/tasks/RouteResult": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../kernel ../graphic ./DirectionsFeatureSet".split(
        " "
      ), function(h, t, d, u, v, x, n) {
        h = h(null, {
          declaredClass: "esri.tasks.RouteResult",
          constructor: function(r) {
            var f = r.spatialReference,
              c = r.route;
            if (r.directions) {
              var h = [],
                g = [],
                b = [];
              d.forEach(r.directions.features, function(a, c) {
                g[c] = a.compressedGeometry;
                h[c] = a.strings;
                b[c] = a.events;
              });
              r.directions.strings = h;
              r.directions.events = b;
              this.directions = new n(r.directions, g);
            }
            this.routeName = r.routeName;
            c &&
              (c.geometry && (c.geometry.spatialReference = f),
              (this.route = new x(c)));
            if (r.stops) {
              var a = (this.stops = []);
              d.forEach(r.stops, function(b, c) {
                b.geometry && (b.geometry.spatialReference = f);
                a[b.attributes.Sequence - 1] = new x(b);
              });
            }
          },
          routeName: null,
          directions: null,
          route: null,
          stops: null
        });
        u("extend-esri") && t.setObject("tasks.RouteResult", h, v);
        return h;
      });
    },
    "esri/tasks/DirectionsFeatureSet": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has dojo/json ../kernel ../geometry/Extent ../geometry/Polyline ../geometry/Point ../graphic ./FeatureSet".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F) {
        h = h(F, {
          declaredClass: "esri.tasks.DirectionsFeatureSet",
          constructor: function(g, b) {
            this.routeId = g.routeId;
            this.routeName = g.routeName;
            t.mixin(this, g.summary);
            this.extent = new n(this.envelope);
            var a = this._fromCompressedGeometry,
              k = this.features,
              q = this.extent.spatialReference,
              m = [];
            d.forEach(b, function(b, c) {
              k[c].setGeometry((m[c] = b ? a(b, q) : k[c].geometry));
            });
            this.mergedGeometry = this._mergePolylinesToSinglePath(m, q);
            this.geometryType = "esriGeometryPolyline";
            d.forEach(g.events, function(a, b) {
              d.forEach(a, function(b, d) {
                a[d] = new c(new f(b.point.x, b.point.y, q), null, {
                  ETA: b.ETA,
                  strings: v.stringify(b.strings),
                  arriveTimeUTC: b.arriveTimeUTC
                });
              });
              g.events[b] = a;
            });
            delete this.envelope;
          },
          _fromCompressedGeometry: function(c, b) {
            var a = 0,
              f = 0,
              g = 0,
              m = 0,
              e = [],
              n,
              h,
              x,
              F,
              v,
              C = 0,
              G = 0,
              B = 0;
            (c = c.match(/((\+|\-)[^\+\-\|]+|\|)/g)) || (c = []);
            0 === parseInt(c[C], 32)
              ? ((C = 2),
                (n = parseInt(c[C], 32)),
                C++,
                (x = parseInt(c[C], 32)),
                C++,
                n & 1 &&
                  ((G = d.indexOf(c, "|") + 1), (F = parseInt(c[G], 32)), G++),
                n & 2 &&
                  ((B = d.indexOf(c, "|", G) + 1),
                  (v = parseInt(c[B], 32)),
                  B++))
              : ((x = parseInt(c[C], 32)), C++);
            for (; C < c.length && "|" !== c[C]; )
              (n = parseInt(c[C], 32) + a),
                C++,
                (a = n),
                (h = parseInt(c[C], 32) + f),
                C++,
                (f = h),
                (n = [n / x, h / x]),
                G &&
                  ((h = parseInt(c[G], 32) + g), G++, (g = h), n.push(h / F)),
                B &&
                  ((h = parseInt(c[B], 32) + m), B++, (m = h), n.push(h / v)),
                e.push(n);
            a = new r({ paths: [e], hasZ: 0 < G, hasM: 0 < B });
            a.setSpatialReference(b);
            return a;
          },
          _mergePolylinesToSinglePath: function(c, b) {
            var a = [],
              f = !1;
            d.forEach(c, function(b) {
              d.forEach(b.paths, function(c) {
                f = f || b.hasM;
                a = a.concat(c);
              });
            });
            var g = [],
              m = [0, 0];
            d.forEach(a, function(a) {
              if (a[0] !== m[0] || a[1] !== m[1]) g.push(a), (m = a);
            });
            return new r({ paths: [g], spatialReference: b, hasM: f });
          }
        });
        u("extend-esri") && t.setObject("tasks.DirectionsFeatureSet", h, x);
        return h;
      });
    },
    "esri/tasks/NAMessage": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.NAMessage",
          constructor: function(d) {
            t.mixin(this, d);
          }
        });
        t.mixin(h, {
          TYPE_INFORMATIVE: 0,
          TYPE_PROCESS_DEFINITION: 1,
          TYPE_PROCESS_START: 2,
          TYPE_PROCESS_STOP: 3,
          TYPE_WARNING: 50,
          TYPE_ERROR: 100,
          TYPE_EMPTY: 101,
          TYPE_ABORT: 200
        });
        d("extend-esri") && t.setObject("tasks.NAMessage", h, u);
        return h;
      });
    },
    "esri/tasks/NAServiceDescription": function() {
      define([
        "dojo/_base/declare",
        "dojo/json",
        "dojo/Deferred",
        "dojo/_base/lang",
        "../request"
      ], function(h, t, d, u, v) {
        return h(null, {
          declaredClass: "esri.tasks._NAServiceDescription",
          _sd: null,
          getServiceDescription: function(h, n) {
            var r = new d();
            if (this._sd) r.resolve(this._sd);
            else if (this._url && this._url.orig) {
              var f = this._url.orig,
                c = (this._url.path.match(/\/solve$/) || []).length
                  ? "Route"
                  : (this._url.path.match(/\/solveClosestFacility$/) || [])
                      .length
                  ? "ClosestFacility"
                  : "ServiceAreas",
                x,
                g = function(b) {
                  v({
                    url:
                      b +
                      ("/" === b[b.length - 1] ? "" : "/") +
                      "GetTravelModes/execute",
                    content: { f: "json", serviceName: c },
                    callbackParamName: "callback"
                  }).then(
                    function(a) {
                      var b = [],
                        c = null;
                      if (a && a.results && a.results.length)
                        for (var d = 0; d < a.results.length; d++)
                          if (
                            "supportedTravelModes" === a.results[d].paramName
                          ) {
                            if (
                              a.results[d].value &&
                              a.results[d].value.features
                            )
                              for (
                                var e = 0;
                                e < a.results[d].value.features.length;
                                e++
                              )
                                if (a.results[d].value.features[e].attributes) {
                                  var f = t.parse(
                                    a.results[d].value.features[e].attributes
                                      .TravelMode
                                  );
                                  b.push(f);
                                }
                          } else
                            "defaultTravelMode" === a.results[d].paramName &&
                              (c = a.results[d].value);
                      x.supportedTravelModes = b;
                      x.defaultTravelMode = c;
                      r.resolve(x);
                    },
                    function(a) {
                      console.log(
                        "Could not read from the routingUtilities service."
                      );
                      r.reject(a);
                    }
                  );
                };
              v({
                url: f,
                content: { f: "json" },
                callbackParamName: "callback"
              }).then(
                function(b) {
                  x = b;
                  x.supportedTravelModes || (x.supportedTravelModes = []);
                  for (b = 0; b < x.supportedTravelModes.length; b++)
                    x.supportedTravelModes[b].id ||
                      (x.supportedTravelModes[b].id =
                        x.supportedTravelModes[b].itemId);
                  n
                    ? r.resolve(x)
                    : h
                    ? g(h)
                    : 10.4 <= x.currentVersion
                    ? v({
                        url:
                          f +
                          ("/" === f[f.length - 1] ? "" : "/") +
                          "retrieveTravelModes",
                        content: { f: "json" },
                        callbackParamName: "callback"
                      }).then(
                        function(a) {
                          x.supportedTravelModes = a.supportedTravelModes;
                          x.defaultTravelMode = a.defaultTravelMode;
                          r.resolve(x);
                        },
                        function(a) {
                          console.log(
                            "Could not get to the NAServer's retrieveTravelModes."
                          );
                          r.reject(a);
                        }
                      )
                    : v({
                        url: f.substring(0, f.indexOf("/rest/") + 6) + "info",
                        content: { f: "json" },
                        callbackParamName: "callback"
                      }).then(
                        function(a) {
                          a.owningSystemUrl
                            ? ((f = a.owningSystemUrl),
                              v({
                                url:
                                  f +
                                  ("/" === f[f.length - 1] ? "" : "/") +
                                  "sharing/rest/portals/self",
                                content: { f: "json" },
                                callbackParamName: "callback"
                              }).then(
                                function(a) {
                                  a &&
                                  a.helperServices &&
                                  a.helperServices.routingUtilities &&
                                  a.helperServices.routingUtilities.url
                                    ? g(a.helperServices.routingUtilities.url)
                                    : (console.log(
                                        "Portal does not have helperServices.routingUtilities defined."
                                      ),
                                      r.resolve(x));
                                },
                                function(a) {
                                  console.log(
                                    "Could not get to the portal's self."
                                  );
                                  r.reject(a);
                                }
                              ))
                            : r.resolve(x);
                        },
                        function(a) {
                          console.log(
                            "Could not get to the NAServer service description."
                          );
                          r.reject(a);
                        }
                      );
                },
                function(b) {
                  r.reject(b);
                }
              );
            } else r.reject("NA Task has no URL specified.");
            r.then(
              u.hitch(this, function(b) {
                this._sd = b;
              }),
              u.hitch(this, function() {
                this._sd = null;
              })
            );
            return r.promise;
          },
          getOwningSystemUrl: function() {
            var h = new d();
            if (this._url && this._url.orig) {
              var n = this._url.orig;
              v({
                url: n.substring(0, n.indexOf("/rest/") + 6) + "info",
                content: { f: "json" },
                callbackParamName: "callback"
              }).promise.always(function(d) {
                h.resolve(d.owningSystemUrl);
              });
            } else h.resolve(void 0);
            return h.promise;
          }
        });
      });
    },
    "esri/tasks/RouteParameters": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has ../kernel ../lang ../graphicsUtils ./NATypes".split(
        " "
      ), function(h, t, d, u, v, x, n, r) {
        h = h(null, {
          declaredClass: "esri.tasks.RouteParameters",
          accumulateAttributes: null,
          attributeParameterValues: null,
          barriers: null,
          directionsLanguage: null,
          directionsLengthUnits: null,
          directionsOutputType: null,
          directionsStyleName: null,
          directionsTimeAttribute: null,
          doNotLocateOnRestrictedElements: !0,
          findBestSequence: null,
          ignoreInvalidLocations: null,
          impedanceAttribute: null,
          outputLines: "esriNAOutputLineTrueShape",
          outputGeometryPrecision: null,
          outputGeometryPrecisionUnits: null,
          outSpatialReference: null,
          overrides: null,
          polygonBarriers: null,
          polylineBarriers: null,
          preserveFirstStop: null,
          preserveLastStop: null,
          restrictionAttributes: null,
          restrictUTurns: null,
          returnBarriers: !1,
          returnDirections: !1,
          returnPolygonBarriers: !1,
          returnPolylineBarriers: !1,
          returnRoutes: !0,
          returnStops: !1,
          returnZ: !0,
          startTime: null,
          startTimeIsUTC: null,
          timeWindowsAreUTC: null,
          stops: null,
          useHierarchy: null,
          useTimeWindows: null,
          travelMode: null,
          toJson: function(f) {
            var c = {
                returnDirections: this.returnDirections,
                returnRoutes: this.returnRoutes,
                returnZ: this.returnZ,
                returnStops: this.returnStops,
                returnBarriers: this.returnBarriers,
                returnPolygonBarriers: this.returnPolygonBarriers,
                returnPolylineBarriers: this.returnPolylineBarriers,
                attributeParameterValues:
                  this.attributeParameterValues &&
                  d.toJson(this.attributeParameterValues),
                outSR: this.outSpatialReference
                  ? this.outSpatialReference.wkid ||
                    d.toJson(this.outSpatialReference.toJson())
                  : null,
                outputLines: this.outputLines,
                overrides: this.overrides,
                findBestSequence: this.findBestSequence,
                preserveFirstStop: this.preserveFirstStop,
                preserveLastStop: this.preserveLastStop,
                useTimeWindows: this.useTimeWindows,
                startTime: this.startTime ? this.startTime.getTime() : null,
                startTimeIsUTC: this.startTimeIsUTC,
                timeWindowsAreUTC: this.timeWindowsAreUTC,
                accumulateAttributeNames: this.accumulateAttributes
                  ? this.accumulateAttributes.join(",")
                  : null,
                ignoreInvalidLocations: this.ignoreInvalidLocations,
                impedanceAttributeName: this.impedanceAttribute,
                restrictionAttributeNames: this.restrictionAttributes
                  ? this.restrictionAttributes.join(",")
                  : null,
                restrictUTurns: this.restrictUTurns,
                useHierarchy: this.useHierarchy,
                directionsLanguage: this.directionsLanguage,
                outputGeometryPrecision: this.outputGeometryPrecision,
                outputGeometryPrecisionUnits: this.outputGeometryPrecisionUnits,
                directionsLengthUnits: r.LengthUnit[this.directionsLengthUnits],
                directionsTimeAttributeName: this.directionsTimeAttribute,
                directionsStyleName: this.directionsStyleName,
                travelMode:
                  "object" === typeof this.travelMode
                    ? d.toJson(this.travelMode)
                    : this.travelMode
              },
              h = this.stops;
            "esri.tasks.FeatureSet" === h.declaredClass && 0 < h.features.length
              ? (c.stops = d.toJson({
                  type: "features",
                  features: n._encodeGraphics(
                    h.features,
                    f && f["stops.features"]
                  ),
                  doNotLocateOnRestrictedElements: this
                    .doNotLocateOnRestrictedElements
                }))
              : "esri.tasks.DataLayer" === h.declaredClass
              ? (c.stops = h)
              : "esri.tasks.DataFile" === h.declaredClass &&
                (c.stops = d.toJson({
                  type: "features",
                  url: h.url,
                  doNotLocateOnRestrictedElements: this
                    .doNotLocateOnRestrictedElements
                }));
            if (this.directionsOutputType)
              switch (this.directionsOutputType.toLowerCase()) {
                case "complete":
                  c.directionsOutputType = "esriDOTComplete";
                  break;
                case "complete-no-events":
                  c.directionsOutputType = "esriDOTCompleteNoEvents";
                  break;
                case "instructions-only":
                  c.directionsOutputType = "esriDOTInstructionsOnly";
                  break;
                case "standard":
                  c.directionsOutputType = "esriDOTStandard";
                  break;
                case "summary-only":
                  c.directionsOutputType = "esriDOTSummaryOnly";
                  break;
                default:
                  c.directionsOutputType = this.directionsOutputType;
              }
            h = function(c, b) {
              return c
                ? "esri.tasks.FeatureSet" === c.declaredClass
                  ? 0 < c.features.length
                    ? d.toJson({
                        type: "features",
                        features: n._encodeGraphics(c.features, f && f[b])
                      })
                    : null
                  : "esri.tasks.DataLayer" === c.declaredClass
                  ? c
                  : "esri.tasks.DataFile" === c.declaredClass
                  ? d.toJson({ type: "features", url: c.url })
                  : d.toJson(c)
                : null;
            };
            this.barriers &&
              (c.barriers = h(this.barriers, "barriers.features"));
            this.polygonBarriers &&
              (c.polygonBarriers = h(
                this.polygonBarriers,
                "polygonBarriers.features"
              ));
            this.polylineBarriers &&
              (c.polylineBarriers = h(
                this.polylineBarriers,
                "polylineBarriers.features"
              ));
            return x.filter(c, function(c) {
              if (null !== c) return !0;
            });
          }
        });
        u("extend-esri") && t.setObject("tasks.RouteParameters", h, v);
        return h;
      });
    },
    "esri/tasks/NATypes": function() {
      define(["dojo/_base/lang", "dojo/has", "../kernel"], function(h, t, d) {
        var u = {
            esriFeet: "esriNAUFeet",
            esriKilometers: "esriNAUKilometers",
            esriMeters: "esriNAUMeters",
            esriMiles: "esriNAUMiles",
            esriNauticalMiles: "esriNAUNauticalMiles",
            esriYards: "esriNAUYards"
          },
          v = {
            NONE: "esriNAOutputLineNone",
            STRAIGHT: "esriNAOutputLineStraight",
            TRUE_SHAPE: "esriNAOutputLineTrueShape",
            TRUE_SHAPE_WITH_MEASURE: "esriNAOutputLineTrueShapeWithMeasure"
          },
          x = {
            ALLOW_BACKTRACK: "esriNFSBAllowBacktrack",
            AT_DEAD_ENDS_ONLY: "esriNFSBAtDeadEndsOnly",
            NO_BACKTRACK: "esriNFSBNoBacktrack",
            AT_DEAD_ENDS_AND_INTERSECTIONS: "esriNFSBAtDeadEndsAndIntersections"
          },
          n = {
            NONE: "esriNAOutputPolygonNone",
            SIMPLIFIED: "esriNAOutputPolygonSimplified",
            DETAILED: "esriNAOutputPolygonDetailed"
          },
          r = {
            FROM_FACILITY: "esriNATravelDirectionFromFacility",
            TO_FACILITY: "esriNATravelDirectionToFacility"
          },
          f = {
            LengthUnit: u,
            OutputLine: v,
            UTurn: x,
            OutputPolygon: n,
            TravelDirection: r
          };
        t("extend-esri") &&
          (h.setObject("tasks._NALengthUnit", u, d),
          h.setObject("tasks.NAOutputLine", v, d),
          h.setObject("tasks.NAUTurn", x, d),
          h.setObject("tasks.NAOutputPolygon", n, d),
          h.setObject("tasks.NATravelDirection", r, d));
        return f;
      });
    },
    "esri/tasks/DistanceParameters": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has ../kernel ../geometry/jsonUtils".split(
        " "
      ), function(h, t, d, u, v, x) {
        h = h(null, {
          declaredClass: "esri.tasks.DistanceParameters",
          geometry1: null,
          geometry2: null,
          distanceUnit: null,
          geodesic: null,
          toJson: function() {
            var n = {},
              h = this.geometry1;
            h &&
              (n.geometry1 = d.toJson({
                geometryType: x.getJsonType(h),
                geometry: h
              }));
            if ((h = this.geometry2))
              n.geometry2 = d.toJson({
                geometryType: x.getJsonType(h),
                geometry: h
              });
            n.sr = d.toJson(this.geometry1.spatialReference.toJson());
            this.distanceUnit && (n.distanceUnit = this.distanceUnit);
            this.geodesic && (n.geodesic = this.geodesic);
            return n;
          }
        });
        u("extend-esri") && t.setObject("tasks.DistanceParameters", h, v);
        return h;
      });
    },
    "esri/tasks/PrintTask": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/_base/Deferred dojo/has ../kernel ../lang ../layerUtils ../deferredUtils ../Color ../request ../urlUtils ../geometry/Polygon ../renderers/SimpleRenderer ../symbols/FillSymbol ./Geoprocessor ./PrintTemplate ./Task dojo/dom-attr dojo/dom-construct dojox/gfx/_base dojox/gfx/canvas dojox/json/query dojo/has!extend-esri?./PrintParameters dojo/has!extend-esri?./LegendLayer".split(
        " "
      ), function(
        h,
        t,
        d,
        u,
        v,
        x,
        n,
        r,
        f,
        c,
        F,
        g,
        b,
        a,
        k,
        q,
        m,
        e,
        A,
        H,
        I,
        E,
        N,
        C
      ) {
        h = h(A, {
          declaredClass: "esri.tasks.PrintTask",
          constructor: function(a, b) {
            this.url = a;
            this.printGp = new m(this.url);
            this._handler = t.hitch(this, this._handler);
            b && b.async && (this.async = !0);
            this._colorEvaluator = C("$..color");
          },
          async: !1,
          _vtlExtent: null,
          _cimVersion: null,
          _is11xService: !1,
          _loadGpServerMetadata: !0,
          execute: function(a, b, d) {
            if (!this._loadGpServerMetadata) return this._execute(a, b, d);
            var e = new v(c._dfdCanceller),
              f = this._url.path,
              k = f.lastIndexOf("/GPServer/");
            0 < k && (f = f.slice(0, k + 9));
            e._pendingDfd = g({
              url: f,
              callbackParamName: "callback",
              content: t.mixin({}, this._url.query, { f: "json" })
            })
              .then(
                t.hitch(this, function(b) {
                  this._loadGpServerMetadata = !1;
                  this.async =
                    "esriExecutionTypeAsynchronous" === b.executionType;
                  this._cimVersion = b.cimVersion;
                  this._is11xService = !!this._cimVersion;
                  e._pendingDfd = this._execute(a);
                  return e._pendingDfd;
                })
              )
              .then(
                t.hitch(this, function(a) {
                  this._successHandler([a], null, b, e);
                })
              )
              .otherwise(function(a) {
                d && d(a);
                e.errback(a);
              });
            return e;
          },
          _handler: function(a, b, c, d, e) {
            try {
              var f;
              this.async
                ? "esriJobSucceeded" === a.jobStatus
                  ? this.printGp.getResultData(
                      a.jobId,
                      "Output_File",
                      t.hitch(this, function(a) {
                        f = a.value;
                        this._successHandler([f], "onComplete", c, e);
                      })
                    )
                  : this._errorHandler(Error(a.jobStatus), d, e)
                : ((f = a[0].value),
                  this._successHandler([f], "onComplete", c, e));
            } catch (J) {
              this._errorHandler(J, d, e);
            }
          },
          _execute: function(a, b, f) {
            var k = this._handler,
              g = this._errorHandler,
              m = a.template || new e();
            m.hasOwnProperty("showLabels") || (m.showLabels = !0);
            var q = m.exportOptions,
              n;
            q && (n = { outputSize: [q.width, q.height], dpi: q.dpi });
            var q = m.layoutOptions,
              h,
              D = [];
            if (q) {
              this.legendAll = !1;
              q.legendLayers
                ? d.forEach(q.legendLayers, function(a) {
                    var b = {};
                    b.id = a.layerId;
                    a.subLayerIds && (b.subLayerIds = a.subLayerIds);
                    D.push(b);
                  })
                : (this.legendAll = !0);
              var l, y;
              if ("Miles" === q.scalebarUnit || "Kilometers" === q.scalebarUnit)
                (l = "esriKilometers"), (y = "esriMiles");
              else if ("Meters" === q.scalebarUnit || "Feet" === q.scalebarUnit)
                (l = "esriMeters"), (y = "esriFeet");
              h = {
                esriMiles: "mi",
                esriKilometers: "km",
                esriFeet: "ft",
                esriMeters: "m"
              };
              h = {
                titleText: q.titleText,
                authorText: q.authorText,
                copyrightText: q.copyrightText,
                customTextElements: q.customTextElements,
                scaleBarOptions: {
                  metricUnit: l,
                  metricLabel: h[l],
                  nonMetricUnit: y,
                  nonMetricLabel: h[y]
                },
                legendOptions: { operationalLayers: D }
              };
            }
            l = this._getPrintDefinition(a.map, m);
            a.outSpatialReference &&
              (l.mapOptions.spatialReference = a.outSpatialReference.toJson());
            a.template &&
              r.isDefined(a.template.showAttribution) &&
              (l.mapOptions.showAttribution = a.template.showAttribution);
            t.mixin(l, { exportOptions: n, layoutOptions: h });
            this.allLayerslegend &&
              t.mixin(l.layoutOptions, {
                legendOptions: { operationalLayers: this.allLayerslegend }
              });
            if (l.operationalLayers) {
              n = l.operationalLayers;
              var G,
                A = function(a) {
                  return r.fixJson(
                    t.mixin(a, {
                      type: "esriSLS",
                      cap: void 0,
                      join: void 0,
                      meterLimit: void 0
                    })
                  );
                },
                x = /[\u4E00-\u9FFF\u0E00-\u0E7F\u0900-\u097F\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/,
                B = /[\u0600-\u06FF]/,
                C = function(a) {
                  var b = a.text,
                    c = (a = a.font) && a.family && a.family.toLowerCase();
                  b &&
                    a &&
                    ("arial" === c || "arial unicode ms" === c) &&
                    ((a.family = x.test(b) ? "Arial Unicode MS" : "Arial"),
                    "normal" !== a.style &&
                      B.test(b) &&
                      (a.family = "Arial Unicode MS"));
                };
              for (h = 0; h < n.length; h++)
                if (n[h].featureCollection && n[h].featureCollection.layers)
                  for (y = 0; y < n[h].featureCollection.layers.length; y++) {
                    var H = n[h].featureCollection.layers[y];
                    H.layerDefinition &&
                      H.layerDefinition.drawingInfo &&
                      H.layerDefinition.drawingInfo.renderer &&
                      H.layerDefinition.drawingInfo.renderer.symbol &&
                      ((G = H.layerDefinition.drawingInfo.renderer),
                      "esriCLS" === G.symbol.type
                        ? (G.symbol = A(G.symbol))
                        : "esriTS" === G.symbol.type
                        ? C(G.symbol)
                        : G.symbol.outline &&
                          "esriCLS" === G.symbol.outline.type &&
                          (G.symbol.outline = A(G.symbol.outline)));
                    if (H.featureSet && H.featureSet.features)
                      for (q = 0; q < H.featureSet.features.length; q++)
                        (G = H.featureSet.features[q]),
                          G.symbol &&
                            ("esriCLS" === G.symbol.type
                              ? (G.symbol = A(G.symbol))
                              : "esriTS" === G.symbol.type
                              ? C(G.symbol)
                              : G.symbol.outline &&
                                "esriCLS" === G.symbol.outline.type &&
                                (G.symbol.outline = A(G.symbol.outline)));
                  }
            }
            m = {
              Web_Map_as_JSON: u.toJson(r.fixJson(l)),
              Format: m.format,
              Layout_Template: m.layout
            };
            a.extraParameters && (m = t.mixin(m, a.extraParameters));
            var F = new v(c._dfdCanceller);
            a = function(a, c) {
              k(a, c, b, f, F);
            };
            l = function(a) {
              g(a, f, F);
            };
            F._pendingDfd = this.async
              ? this.printGp.submitJob(m, a, null, l)
              : this.printGp.execute(m, a, l);
            return F;
          },
          onComplete: function() {},
          _createMultipointLayer: function() {
            return {
              layerDefinition: {
                name: "multipointLayer",
                geometryType: "esriGeometryMultipoint",
                drawingInfo: { renderer: null }
              },
              featureSet: {
                geometryType: "esriGeometryMultipoint",
                features: []
              }
            };
          },
          _createPolygonLayer: function() {
            return {
              layerDefinition: {
                name: "polygonLayer",
                geometryType: "esriGeometryPolygon",
                drawingInfo: { renderer: null }
              },
              featureSet: { geometryType: "esriGeometryPolygon", features: [] }
            };
          },
          _createPointLayer: function() {
            return {
              layerDefinition: {
                name: "pointLayer",
                geometryType: "esriGeometryPoint",
                drawingInfo: { renderer: null }
              },
              featureSet: { geometryType: "esriGeometryPoint", features: [] }
            };
          },
          _createPolylineLayer: function() {
            return {
              layerDefinition: {
                name: "polylineLayer",
                geometryType: "esriGeometryPolyline",
                drawingInfo: { renderer: null }
              },
              featureSet: { geometryType: "esriGeometryPolyline", features: [] }
            };
          },
          _convertSvgSymbol: function(a) {
            if (
              !(8 >= x("ie") || (!a.path && "image/svg+xml" !== a.contentType))
            ) {
              var b,
                c = N.createSurface(I.create("div"), 1024, 1024);
              b =
                "image/svg+xml" === a.contentType
                  ? c.createObject(N.Image, {
                      src: "data:image/svg+xml;base64," + a.imageData,
                      width: E.pt2px(a.width),
                      height: E.pt2px(a.height),
                      x: 0,
                      y: 0
                    })
                  : c
                      .createObject(N.Path, a.path)
                      .setFill(a.color)
                      .setStroke(a.outline);
              "pendingRender" in c && c._render(!0);
              var d = c.rawNode.getContext("2d"),
                e = Math.ceil(b.getBoundingBox().width),
                f = Math.ceil(b.getBoundingBox().height);
              b = d.getImageData(
                b.getBoundingBox().x,
                b.getBoundingBox().y,
                e,
                f
              );
              d.canvas.width = e;
              d.canvas.height = f;
              d.putImageData(b, 0, 0);
              d = d.canvas.toDataURL("image/png");
              a = {
                type: "esriPMS",
                imageData: d.substr(22, d.length),
                angle: a.angle,
                contentType: "image/png",
                height: a.size ? a.size : E.px2pt(f),
                width: a.size ? (e / f) * a.size : E.px2pt(e),
                xoffset: a.xoffset,
                yoffset: a.yoffset
              };
              c.destroy();
              return a;
            }
          },
          _convertSvgRenderer: function(a) {
            "simple" === a.type &&
            a.symbol &&
            (a.symbol.path || "image/svg+xml" === a.symbol.contentType)
              ? (a.symbol = this._convertSvgSymbol(a.symbol))
              : "uniqueValue" === a.type
              ? (a.defaultSymbol &&
                  (a.defaultSymbol.path ||
                    "image/svg+xml" === a.defaultSymbol.contentType) &&
                  (a.defaultSymbol = this._convertSvgSymbol(a.defaultSymbol)),
                a.uniqueValueInfos &&
                  d.forEach(
                    a.uniqueValueInfos,
                    function(a) {
                      if (
                        a.symbol.path ||
                        "image/svg+xml" === a.symbol.contentType
                      )
                        a.symbol = this._convertSvgSymbol(a.symbol);
                    },
                    this
                  ))
              : "classBreaks" === a.type &&
                (a.defaultSymbol &&
                  (a.defaultSymbol.path ||
                    "image/svg+xml" === a.defaultSymbol.contentType) &&
                  (a.defaultSymbol = this._convertSvgSymbol(a.defaultSymbol)),
                a.classBreakInfos &&
                  d.forEach(
                    a.classBreakInfos,
                    function(a) {
                      if (
                        a.symbol.path ||
                        "image/svg+xml" === a.symbol.contentType
                      )
                        a.symbol = this._convertSvgSymbol(a.symbol);
                    },
                    this
                  ));
          },
          _createFeatureCollection: function(b, c, e, f) {
            var k = this._createPolygonLayer(),
              g = this._createPolylineLayer(),
              m = this._createPointLayer(),
              q = this._createMultipointLayer(),
              n = this._createPointLayer();
            n.layerDefinition.name = "textLayer";
            delete n.layerDefinition.drawingInfo;
            if (
              "esri.layers.FeatureLayer" === b.declaredClass ||
              "esri.layers.StreamLayer" === b.declaredClass
            )
              k.layerDefinition.name = g.layerDefinition.name = m.layerDefinition.name = q.layerDefinition.name =
                t.getObject("arcgisProps.title", !1, b) || b.name || b.id;
            var D =
              b.renderer &&
              "esri.renderer.SimpleRenderer" === b.renderer.declaredClass;
            if (
              !b.renderer ||
              b.renderer.valueExpression ||
              t.isFunction(b.renderer.attributeField)
            )
              delete k.layerDefinition.drawingInfo,
                delete g.layerDefinition.drawingInfo,
                delete m.layerDefinition.drawingInfo,
                delete q.layerDefinition.drawingInfo;
            else {
              var l = b.renderer.toJson({ useLegacyRotationProperties: !0 });
              if ("temporal" === l.type) {
                var l = {
                    latestObservationRenderer: l.latestObservationRenderer,
                    trackLinesRenderer: l.trackRenderer,
                    observationAger: l.observationAger,
                    renderer: l.observationRenderer
                  },
                  y = {};
                b._trackIdField && (y.trackIdField = b._trackIdField);
                b._startTimeField && (y.startTimeField = b._startTimeField);
                b._endTimeField && (y.endTimeField = b._endTimeField);
                k.layerDefinition.drawingInfo = l;
                k.layerDefinition.timeInfo = y;
                g.layerDefinition.drawingInfo = l;
                g.layerDefinition.timeInfo = y;
                m.layerDefinition.drawingInfo = l;
                m.layerDefinition.timeInfo = y;
                q.layerDefinition.drawingInfo = l;
                q.layerDefinition.timeInfo = y;
              } else
                (k.layerDefinition.drawingInfo.renderer = l),
                  (g.layerDefinition.drawingInfo.renderer = l),
                  (m.layerDefinition.drawingInfo.renderer = l),
                  (q.layerDefinition.drawingInfo.renderer = l);
            }
            l = b.fields;
            l ||
              !b.renderer ||
              b.renderer.valueExpression ||
              t.isFunction(b.renderer.attributeField) ||
              ("esri.renderer.ClassBreaksRenderer" === b.renderer.declaredClass
                ? ((l = [
                    {
                      name: b.renderer.attributeField,
                      type: "esriFieldTypeDouble"
                    }
                  ]),
                  b.renderer.normalizationField &&
                    l.push({
                      name: b.renderer.normalizationField,
                      type: "esriFieldTypeDouble"
                    }))
                : "esri.renderer.UniqueValueRenderer" ===
                    b.renderer.declaredClass &&
                  ((l = [
                    {
                      name: b.renderer.attributeField,
                      type: "esriFieldTypeString"
                    }
                  ]),
                  b.renderer.attributeField2 &&
                    l.push({
                      name: b.renderer.attributeField2,
                      type: "esriFieldTypeString"
                    }),
                  b.renderer.attributeField3 &&
                    l.push({
                      name: b.renderer.attributeField3,
                      type: "esriFieldTypeString"
                    })));
            l &&
              ((k.layerDefinition.fields = l),
              (g.layerDefinition.fields = l),
              (m.layerDefinition.fields = l),
              (q.layerDefinition.fields = l));
            l = b.graphics;
            b.isFeatureReductionActive &&
              b.isFeatureReductionActive() &&
              (l = b.getSingleGraphics());
            var y = l.length,
              h,
              r;
            for (r = 0; r < y; r++) {
              var A = l[r];
              if (!1 !== A.visible && A.geometry) {
                h = A.toJson();
                h.symbol &&
                  h.symbol.outline &&
                  h.symbol.outline.color &&
                  h.symbol.outline.color[3] &&
                  !this._is11xService &&
                  (h.symbol.outline.color[3] = 255);
                if (
                  b.renderer &&
                  !h.symbol &&
                  (t.isFunction(b.renderer.attributeField) ||
                    b.renderer.valueExpression ||
                    this._isFeatureCollectionRequired(b.renderer, b) ||
                    "esri.renderer.DotDensityRenderer" ===
                      b.renderer.declaredClass ||
                    e)
                ) {
                  e = e || b.renderer;
                  var L = null;
                  try {
                    L = e.getSymbol(A);
                  } catch (S) {}
                  if (!L) continue;
                  h.symbol = L.toJson();
                  this._isFeatureCollectionRequired(e, b) &&
                    this._applyVisualVariables(h.symbol, {
                      renderer: e,
                      graphic: A,
                      symbol: L,
                      mapResolution: c && c.getResolutionInMeters(),
                      mapScale: c && c.getScale()
                    });
                }
                h.symbol &&
                  (h.symbol.path || "image/svg+xml" === h.symbol.contentType
                    ? (h.symbol = this._convertSvgSymbol(h.symbol))
                    : h.symbol.text && delete h.attributes);
                switch (A.geometry.type) {
                  case "polygon":
                    k.featureSet.features.push(h);
                    break;
                  case "polyline":
                    g.featureSet.features.push(h);
                    break;
                  case "point":
                    h.symbol && h.symbol.text
                      ? n.featureSet.features.push(h)
                      : m.featureSet.features.push(h);
                    break;
                  case "multipoint":
                    q.featureSet.features.push(h);
                    break;
                  case "extent":
                    (h.geometry = a.fromExtent(A.geometry).toJson()),
                      k.featureSet.features.push(h);
                }
              }
            }
            c = [];
            0 < k.featureSet.features.length && c.push(k);
            0 < g.featureSet.features.length && c.push(g);
            0 < q.featureSet.features.length && c.push(q);
            0 < m.featureSet.features.length && c.push(m);
            0 < n.featureSet.features.length && c.push(n);
            if (!c.length) return null;
            d.forEach(c, function(a) {
              var b = d.every(a.featureSet.features, function(a) {
                return a.symbol;
              });
              if (D || b)
                (f && f.forceFeatureAttributes) ||
                  d.forEach(a.featureSet.features, function(a) {
                    delete a.attributes;
                  }),
                  f.forceFeatureAttributes || delete a.layerDefinition.fields;
              b && delete a.layerDefinition.drawingInfo;
            });
            d.forEach(
              c,
              function(a) {
                a.layerDefinition.drawingInfo &&
                  a.layerDefinition.drawingInfo.renderer &&
                  this._convertSvgRenderer(
                    a.layerDefinition.drawingInfo.renderer
                  );
              },
              this
            );
            return {
              id: b.id,
              opacity: b.opacity,
              minScale: b.minScale || 0,
              maxScale: b.maxScale || 0,
              featureCollection: { layers: c }
            };
          },
          _getPrintDefinition: function(a, b) {
            var c = { operationalLayers: this._createOperationalLayers(a, b) },
              d = this._vtlExtent || a.extent,
              e = a.spatialReference;
            this._vtlExtent = null;
            a.spatialReference._isWrappable() &&
              ((d = d._normalize(!0)), (e = d.spatialReference));
            d = {
              mapOptions: {
                showAttribution: a.showAttribution,
                extent: d.toJson(),
                spatialReference: e.toJson()
              }
            };
            b.preserveScale &&
              t.mixin(d.mapOptions, { scale: b.outScale || a.getScale() });
            a.timeExtent &&
              t.mixin(d.mapOptions, {
                time: [
                  a.timeExtent.startTime.getTime(),
                  a.timeExtent.endTime.getTime()
                ]
              });
            a = {};
            t.mixin(a, d, c);
            return a;
          },
          _createOperationalLayers: function(a, c) {
            var e,
              g,
              m,
              q,
              h = [],
              A = 0;
            c.preserveScale && (A = c.outScale || a.getScale());
            this.allLayerslegend = this.legendAll ? [] : null;
            this._vtlExtent = null;
            var r = d.map(a.layerIds, a.getLayer, a);
            a._mapImageLyr && r.push(a._mapImageLyr);
            for (e = 0; e < r.length; e++)
              if (
                ((g = r[e]),
                g.loaded && g.visible && (!A || g.isVisibleAtScale(A)))
              )
                switch (
                  ((m = g.declaredClass),
                  (q = {
                    id: g.id,
                    title: t.getObject("arcgisProps.title", !1, g) || g.id,
                    opacity: g.opacity,
                    minScale: g.minScale || 0,
                    maxScale: g.maxScale || 0
                  }),
                  (q = t.mixin(q, this._getUrlAndToken(g))),
                  g.getNode() &&
                    H.get(g.getNode(), "data-reference") &&
                    (q._isRefLayer = !0),
                  m)
                ) {
                  case "esri.layers.ArcGISDynamicMapServiceLayer":
                    var D = [];
                    m = !!g._params.layers;
                    if (g._params.dynamicLayers)
                      (m = c.outScale
                        ? g._getDynLayerObjs(c.outScale)
                        : u.fromJson(g._params.dynamicLayers)),
                        d.forEach(m, function(a) {
                          D.push({
                            id: a.id,
                            name: a.name,
                            layerDefinition: a
                          });
                          delete a.id;
                          delete a.name;
                          delete a.maxScale;
                          delete a.minScale;
                        }),
                        0 === D.length && (q.visibleLayers = [-1]);
                    else if (g.supportsDynamicLayers) {
                      if (m || g.layerDefinitions || g.layerTimeOptions) {
                        var l = g.createDynamicLayerInfosFromLayerInfos(),
                          y = null;
                        m && (y = g.visibleLayers);
                        var y = f._getVisibleLayers(l, y),
                          x = f._getLayersForScale(
                            c.outScale || a.getScale(),
                            l
                          );
                        d.forEach(l, function(a) {
                          if (!a.subLayerIds) {
                            var b = a.id;
                            -1 < d.indexOf(y, b) &&
                              -1 < d.indexOf(x, b) &&
                              ((a = { source: a.source.toJson() }),
                              g.layerDefinitions &&
                                g.layerDefinitions[b] &&
                                (a.definitionExpression =
                                  g.layerDefinitions[b]),
                              g.layerTimeOptions &&
                                g.layerTimeOptions[b] &&
                                (a.layerTimeOptions = g.layerTimeOptions[
                                  b
                                ].toJson()),
                              D.push({ id: b, layerDefinition: a }));
                          }
                        });
                        0 === D.length && (q.visibleLayers = [-1]);
                      }
                    } else
                      d.forEach(g.layerInfos, function(a) {
                        var b = { id: a.id, layerDefinition: {} };
                        g.layerDefinitions &&
                          g.layerDefinitions[a.id] &&
                          (b.layerDefinition.definitionExpression =
                            g.layerDefinitions[a.id]);
                        g.layerTimeOptions &&
                          g.layerTimeOptions[a.id] &&
                          (b.layerDefinition.layerTimeOptions = g.layerTimeOptions[
                            a.id
                          ].toJson());
                        (b.layerDefinition.definitionExpression ||
                          b.layerDefinition.layerTimeOptions) &&
                          D.push(b);
                      }),
                        m &&
                          (q.visibleLayers = g.visibleLayers.length
                            ? g.visibleLayers
                            : [-1]);
                    D.length && (q.layers = D);
                    h.push(q);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({
                        id: g.id,
                        subLayerIds: g.visibleLayers
                      });
                    break;
                  case "esri.layers.ArcGISImageServiceLayer":
                    q = t.mixin(q, {
                      url: g.url,
                      bandIds: g.bandIds,
                      compressionQuality: g.compressionQuality,
                      format: g.format,
                      interpolation: g.interpolation
                    });
                    g.mosaicRule &&
                      t.mixin(q, { mosaicRule: g.mosaicRule.toJson() });
                    if (g.renderingRule || g.renderer)
                      this._is11xService
                        ? (g.renderingRule &&
                            (q.renderingRule = g.renderingRule.toJson()),
                          g.renderer &&
                            ((q.layerDefinition = q.layerDefinition || {}),
                            (q.layerDefinition.drawingInfo =
                              q.layerDefinition.drawingInfo || {}),
                            (q.layerDefinition.drawingInfo.renderer = g.renderer.toJson())))
                        : (m = g.getExportImageRenderingRule()) &&
                          t.mixin(q, { renderingRule: m.toJson() });
                    h.push(q);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({ id: g.id });
                    break;
                  case "esri.layers.WMSLayer":
                    q = t.mixin(q, {
                      url: g.url,
                      title: g.title,
                      type: "wms",
                      version: g.version,
                      transparentBackground: g.imageTransparency,
                      visibleLayers: g.visibleLayers
                    });
                    h.push(q);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({
                        id: g.id,
                        subLayerIds: g.visibleLayers
                      });
                    break;
                  case "esri.virtualearth.VETiledLayer":
                    m = g.mapStyle;
                    "roadOnDemand" === m
                      ? (m = "Road")
                      : "aerialWithLabelsOnDemand" === m && (m = "Hybrid");
                    q = t.mixin(q, {
                      visibility: g.visible,
                      type: "BingMaps" + m,
                      culture: g.culture,
                      key: g.bingMapsKey
                    });
                    h.push(q);
                    break;
                  case "esri.layers.OpenStreetMapLayer":
                    q = t.mixin(q, {
                      credits: g.copyright,
                      type: "OpenStreetMap",
                      url: b.getAbsoluteUrl(g.tileServers[0])
                    });
                    h.push(q);
                    break;
                  case "esri.layers.WMTSLayer":
                    q = t.mixin(q, {
                      url: g.url,
                      type: "wmts",
                      layer: g._identifier,
                      style: g._style,
                      format: g.format,
                      tileMatrixSet: g._tileMatrixSetId
                    });
                    h.push(q);
                    break;
                  case "esri.layers.MapImageLayer":
                    m = g.getImages();
                    d.forEach(m, function(a, b) {
                      a.visible &&
                        a.href &&
                        ((q = {
                          id: g.id + "_image" + b,
                          type: "image",
                          title: g.id,
                          minScale: g.minScale || 0,
                          maxScale: g.maxScale || 0,
                          opacity: g.opacity * a.opacity,
                          extent: a.extent.toJson()
                        }),
                        "data:image/png;base64," === a.href.substr(0, 22)
                          ? (q.imageData = a.href.substr(22))
                          : (q.url = a.href),
                        h.push(q));
                    });
                    break;
                  case "esri.layers.VectorTileLayer":
                    delete q.url;
                    delete q.token;
                    if (
                      this._is11xService &&
                      g.currentStyleInfo.serviceUrl &&
                      g.currentStyleInfo.styleUrl &&
                      ((m =
                        n.id &&
                        n.id.findCredential(g.currentStyleInfo.styleUrl)),
                      (l =
                        n.id &&
                        n.id.findCredential(g.currentStyleInfo.serviceUrl)),
                      (!m && !l) || "2.1.0" !== this._cimVersion)
                    ) {
                      q.type = "VectorTileLayer";
                      q.styleUrl = g.currentStyleInfo.styleUrl;
                      m && (q.token = m.token);
                      l &&
                        l.token !== q.token &&
                        (q.additionalTokens = [
                          { url: g.currentStyleInfo.serviceUrl, token: l.token }
                        ]);
                      h.push(q);
                      break;
                    }
                    q.type = "image";
                    m = this._vtlExtent || a.extent.offset(0, 0);
                    var C = (c.exportOptions && c.exportOptions.dpi) || 96,
                      l = { format: "png", pixelRatio: C / 96 };
                    "MAP_ONLY" !== c.layout ||
                      !c.preserveScale ||
                      (c.outScale && c.outScale !== a.getScale()) ||
                      96 !== C ||
                      !c.exportOptions ||
                      (c.exportOptions.width % 2 === a.width % 2 &&
                        c.exportOptions.height % 2 === a.height % 2) ||
                      ((l.area = {
                        x: 0,
                        y: 0,
                        width: a.width,
                        height: a.height
                      }),
                      c.exportOptions.width % 2 !== a.width % 2 &&
                        --l.area.width,
                      c.exportOptions.height % 2 !== a.height % 2 &&
                        --l.area.height,
                      this._vtlExtent ||
                        ((C = a.toMap({ x: l.area.width, y: l.area.height })),
                        m.update(m.xmin, C.y, C.x, m.ymax, m.spatialReference),
                        (this._vtlExtent = m)));
                    q.extent = m._normalize(!0).toJson();
                    m = g.takeScreenshot(l);
                    m.isResolved()
                      ? m.then(function(a) {
                          "data:image/png;base64," ===
                            a.dataURL.substr(0, 22) &&
                            (q.imageData = a.dataURL.substr(22));
                        })
                      : console.error(
                          "PrintTask: VectorTileLayer.takeScreenshot() returned an unresolved Promise"
                        );
                    q.imageData && h.push(q);
                    break;
                  case "esri.layers.WebTiledLayer":
                    m = g.url.replace(/\$\{/g, "{");
                    q = t.mixin(q, {
                      type: "WebTiledLayer",
                      urlTemplate: m,
                      credits: g.copyright
                    });
                    g.subDomains &&
                      0 < g.subDomains.length &&
                      (q.subDomains = g.subDomains);
                    g._wmtsInfo && (q.wmtsInfo = g._wmtsInfo);
                    delete q.url;
                    h.push(q);
                    break;
                  default:
                    if (g.getTileUrl || g.getImageUrl)
                      (q = t.mixin(q, { url: g.url })), h.push(q);
                }
            r = d.map(a.graphicsLayerIds, a.getLayer, a);
            for (e = 0; e < r.length; e++)
              (g = r[e]),
                g.isFeatureReductionActive &&
                  g.isFeatureReductionActive() &&
                  (g.getSingleGraphics().length
                    ? r.splice(++e, 0, g.getFeatureReductionLayer())
                    : (r[e] = g.getFeatureReductionLayer()));
            for (e = 0; e < r.length; e++)
              if (
                ((g = r[e]),
                g.loaded && g.visible && (!A || g.isVisibleAtScale(A)))
              )
                switch (((m = g.declaredClass), m)) {
                  case "esri.layers.CSVLayer":
                    if (this._is11xService) {
                      q = {
                        id: g.id,
                        url: g.url,
                        title: g.title,
                        opacity: g.opacity,
                        minScale: g.minScale || 0,
                        maxScale: g.maxScale || 0,
                        type: "CSV",
                        locationInfo: {
                          latitudeFieldName: g.latitudeFieldName,
                          longitudeFieldName: g.longitudeFieldName
                        },
                        layerDefinition: {
                          drawingInfo: {
                            renderer:
                              g.renderer &&
                              g.renderer.toJson({
                                useLegacyRotationProperties: !0
                              })
                          }
                        }
                      };
                      h.push(q);
                      break;
                    }
                  case "esri.layers.FeatureLayer":
                  case "esri.layers.LabelLayer":
                  case "esri.layers.StreamLayer":
                    if (
                      ("esri.layers.LabelLayer" === m && !c.showLabels) ||
                      (g.renderer &&
                        "esri.renderer.HeatmapRenderer" ===
                          g.renderer.declaredClass)
                    )
                      continue;
                    m = null;
                    g.url &&
                      g.renderer &&
                      ("esri.renderer.ScaleDependentRenderer" ===
                      g.renderer.declaredClass
                        ? "scale" === g.renderer.rangeType
                          ? (m =
                              g.renderer.getRendererInfoByScale(a.getScale()) &&
                              g.renderer.getRendererInfoByScale(a.getScale())
                                .renderer)
                          : "zoom" === g.renderer.rangeType &&
                            (m =
                              g.renderer.getRendererInfoByZoom(a.getZoom()) &&
                              g.renderer.getRendererInfoByZoom(a.getZoom())
                                .renderer)
                        : (m = g.renderer));
                    l =
                      m &&
                      "esri.layers.CSVLayer" !== g.declaredClass &&
                      !this._isFeatureCollectionRequired(m, g) &&
                      !m.valueExpression;
                    C =
                      g.isFeatureReductionActive &&
                      g.isFeatureReductionActive();
                    if (
                      m &&
                      !C &&
                      "esri.renderer.DotDensityRenderer" !== m.declaredClass &&
                      "esri.layers.StreamLayer" !== g.declaredClass &&
                      (this._is11xService || l) &&
                      ("esri.renderer.SimpleRenderer" === m.declaredClass ||
                        "esri.renderer.TemporalRenderer" === m.declaredClass ||
                        null == m.attributeField ||
                        (t.isString(m.attributeField) &&
                          g._getField(m.attributeField, !0)))
                    )
                      if (
                        ((q = {
                          id: g.id,
                          title:
                            t.getObject("arcgisProps.title", !1, g) || g.id,
                          opacity: g.opacity,
                          minScale: g.minScale || 0,
                          maxScale: g.maxScale || 0,
                          layerDefinition: {
                            drawingInfo: {
                              renderer: m.toJson({
                                useLegacyRotationProperties: !0
                              })
                            }
                          }
                        }),
                        (q = t.mixin(q, this._getUrlAndToken(g))),
                        "esri.renderer.TemporalRenderer" === m.declaredClass &&
                          ((l = q.layerDefinition.drawingInfo),
                          (l.latestObservationRenderer =
                            l.renderer.latestObservationRenderer),
                          (l.trackLinesRenderer = l.renderer.trackRenderer),
                          (l.observationAger = l.renderer.observationAger),
                          (l.renderer = l.renderer.observationRenderer),
                          g._trackIdField &&
                            (q.layerDefinition.timeInfo = {
                              trackIdField: g._trackIdField
                            })),
                        this._convertSvgRenderer(
                          q.layerDefinition.drawingInfo.renderer
                        ),
                        this._is11xService ||
                          1 > g.opacity ||
                          "esri.renderer.TemporalRenderer" ===
                            m.declaredClass ||
                          this._updateLayerOpacity(q))
                      )
                        if (
                          (g._params.source &&
                            ((m = g._params.source.toJson()),
                            t.mixin(q.layerDefinition, { source: m })),
                          g.getDefinitionExpression() &&
                            t.mixin(q.layerDefinition, {
                              definitionExpression: g.getDefinitionExpression()
                            }),
                          2 !== g.mode)
                        )
                          0 < g.getSelectedFeatures().length &&
                            ((m = d.map(g.getSelectedFeatures(), function(a) {
                              return a.attributes[g.objectIdField];
                            })),
                            0 < m.length &&
                              g.getSelectionSymbol() &&
                              t.mixin(q, {
                                selectionObjectIds: m,
                                selectionSymbol: g.getSelectionSymbol().toJson()
                              }));
                        else {
                          m = d.map(g.getSelectedFeatures(), function(a) {
                            return a.attributes[g.objectIdField];
                          });
                          if (0 === m.length || !g._params.drawMode) break;
                          t.mixin(q.layerDefinition, { objectIds: m });
                          m = null;
                          g.getSelectionSymbol() &&
                            (m = new k(g.getSelectionSymbol()));
                          t.mixin(q.layerDefinition.drawingInfo, {
                            renderer: m && m.toJson()
                          });
                        }
                      else q = this._createFeatureCollection(g, a, null, c);
                    else
                      q =
                        m &&
                        (m.valueExpression ||
                          this._isFeatureCollectionRequired(m, g) ||
                          "esri.renderer.DotDensityRenderer" ===
                            m.declaredClass)
                          ? this._createFeatureCollection(g, a, m, c)
                          : this._createFeatureCollection(g, a, null, c);
                    if (!q) continue;
                    h.push(q);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({ id: g.id });
                    break;
                  case "esri.layers._GraphicsLayer":
                  case "esri.layers.GraphicsLayer":
                  case "esri.layers.WFSLayer":
                    q = this._createFeatureCollection(g, a, null, c);
                    if (!q) continue;
                    h.push(q);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({ id: g.id });
                    break;
                  case "esri.layers.ArcGISImageServiceVectorLayer":
                    (q = {
                      id: g.id,
                      title: t.getObject("arcgisProps.title", !1, g) || g.id,
                      opacity: g.opacity,
                      minScale: g.minScale || 0,
                      maxScale: g.maxScale || 0,
                      visibility: g.visible,
                      symbolTileSize: g.symbolTileSize,
                      layerDefinition: {
                        drawingInfo: {
                          renderer: g.renderer.toJson({
                            useLegacyRotationProperties: !0
                          })
                        }
                      }
                    }),
                      (q = t.mixin(q, this._getUrlAndToken(g))),
                      g.mosaicRule &&
                        t.mixin(q, { mosaicRule: g.mosaicRule.toJson() }),
                      h.push(q),
                      this.allLayerslegend &&
                        this.allLayerslegend.push({ id: g.id });
                }
            A &&
              d.forEach(h, function(a) {
                a.minScale = 0;
                a.maxScale = 0;
              });
            a.graphics &&
              0 < a.graphics.graphics.length &&
              (q = this._createFeatureCollection(a.graphics, a, null, c)) &&
              h.push(q);
            a._labels &&
              c.showLabels &&
              (q = this._createFeatureCollection(a._labels, a, null, c)) &&
              h.push(q);
            d.forEach(h, function(a, b, c) {
              a._isRefLayer &&
                (delete a._isRefLayer, c.splice(b, 1), c.push(a));
            });
            return h;
          },
          _getUrlAndToken: function(a) {
            return { token: a._getToken(), url: a._url ? a._url.path : null };
          },
          _updateLayerOpacity: function(a) {
            var b = this._colorEvaluator(a),
              b = d.filter(b, function(a) {
                return t.isArray(a) && 4 === a.length;
              }),
              c = !0;
            if (b.length) {
              var e = b[0][3],
                f;
              for (f = 1; f < b.length; f++)
                if (e !== b[f][3]) {
                  c = !1;
                  break;
                }
              if (c)
                for (a.opacity = e / 255, f = 0; f < b.length; f++)
                  b[f][3] = 255;
            }
            return c;
          },
          _isFeatureCollectionRequired: function(a, b) {
            if (b && b.isFeatureReductionActive && b.isFeatureReductionActive())
              return !0;
            var c = !1;
            if ((b = this._getVariable(a, "rotationInfo", !1)))
              c = ((c = b.field) && t.isFunction(c)) || b.valueExpression;
            return (
              a.hasVisualVariables("sizeInfo") ||
              a.hasVisualVariables("colorInfo") ||
              a.hasVisualVariables("opacityInfo") ||
              c
            );
          },
          _getVariable: function(a, b, c) {
            var d;
            a && (d = (a = a.getVisualVariablesForType(b, c)) && a[0]);
            return d;
          },
          _applyVisualVariables: function(a, b) {
            var c = b.renderer,
              d = b.graphic,
              e = b.symbol,
              f = b.mapResolution,
              k = b.mapScale,
              g = e.type;
            if ("textsymbol" !== g && "shieldlabelsymbol" !== g) {
              var m = this._getVariable(c, "sizeInfo", !1),
                D = this._getVariable(c, "colorInfo", !1),
                l = this._getVariable(c, "opacityInfo", !1);
              b = this._getVariable(c, "rotationInfo", !1);
              e instanceof q &&
                (m = this._getVariable(c, "sizeInfo", "outline") || m);
              f = m
                ? c.getSize(d, {
                    sizeInfo: m,
                    shape: "simplemarkersymbol" === g ? e.style : null,
                    resolution: f,
                    scale: k
                  })
                : d.size;
              null != f &&
                ("simplemarkersymbol" === g
                  ? (a.size = E.px2pt(f))
                  : "picturemarkersymbol" === g
                  ? ((k = (e.width / e.height) * f),
                    (a.width = E.px2pt(k)),
                    (a.height = E.px2pt(f)),
                    0 !== e.xoffset &&
                      (a.xoffset = E.px2pt((e.xoffset / e.width) * k)),
                    0 !== e.yoffset &&
                      (a.yoffset = E.px2pt((e.yoffset / e.height) * f)))
                  : "simplelinesymbol" === g
                  ? (a.width = E.px2pt(f))
                  : a.outline && (a.outline.width = E.px2pt(f)));
              D &&
                (!(e = c.getColor(d, { colorInfo: D })) ||
                  ("simplemarkersymbol" !== g &&
                    "simplelinesymbol" !== g &&
                    "simplefillsymbol" !== g) ||
                  (a.color = F.toJsonColor(e)));
              l &&
                ((e = c.getOpacity(d, { opacityInfo: l })),
                null != e && a.color && (a.color[3] = Math.round(255 * e)));
              b &&
                (c = c.getRotationAngle(d, { rotationInfo: b })) &&
                (a.angle = -c);
            }
          }
        });
        x("extend-esri") && t.setObject("tasks.PrintTask", h, n);
        return h;
      });
    },
    "esri/tasks/Geoprocessor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has dojo/io-query ../kernel ../request ../deferredUtils ../geometry/normalizeUtils ./Task ./FeatureSet ./JobInfo ./GPMessage ./LinearUnit ./DataFile ./RasterData ./Date ./ParameterValue ./GPResultImageLayer ../layers/ArcGISDynamicMapServiceLayer ../layers/MapImage".split(
        " "
      ), function(
        h,
        t,
        d,
        u,
        v,
        x,
        n,
        r,
        f,
        c,
        F,
        g,
        b,
        a,
        k,
        q,
        m,
        e,
        A,
        H,
        I,
        E,
        N
      ) {
        h = h(g, {
          declaredClass: "esri.tasks.Geoprocessor",
          _eventMap: {
            "execute-complete": ["results", "messages"],
            "get-result-data-complete": ["result"],
            "get-result-image-complete": ["mapImage"],
            "get-result-image-layer-complete": ["layer"],
            "job-cancel": ["jobInfo"],
            "job-complete": ["jobInfo"],
            "status-update": ["jobInfo"]
          },
          constructor: function(a) {
            this._jobUpdateHandler = t.hitch(this, this._jobUpdateHandler);
            this._getJobStatus = t.hitch(this, this._getJobStatus);
            this._getResultDataHandler = t.hitch(
              this,
              this._getResultDataHandler
            );
            this._getResultImageHandler = t.hitch(
              this,
              this._getResultImageHandler
            );
            this._executeHandler = t.hitch(this, this._executeHandler);
            this._updateTimers = [];
            this.registerConnectEvents();
          },
          updateDelay: 1e3,
          processSpatialReference: null,
          outputSpatialReference: null,
          outSpatialReference: null,
          setUpdateDelay: function(a) {
            this.updateDelay = a;
          },
          setProcessSpatialReference: function(a) {
            this.processSpatialReference = a;
          },
          setOutputSpatialReference: function(a) {
            this._setOutSR(a);
          },
          setOutSpatialReference: function(a) {
            this._setOutSR(a);
          },
          __msigns: [
            { n: "execute", c: 3, a: [{ i: 0, p: ["*"] }], e: 2, f: 1 },
            { n: "submitJob", c: 4, a: [{ i: 0, p: ["*"] }], e: 3 }
          ],
          _setOutSR: function(a) {
            this.outSpatialReference = this.outputSpatialReference = a;
          },
          _getOutSR: function() {
            return this.outSpatialReference || this.outputSpatialReference;
          },
          _gpEncode: function(a, b, c) {
            for (var e in a) {
              var f = a[e];
              t.isArray(f)
                ? (a[e] = v.toJson(
                    d.map(
                      f,
                      function(a) {
                        return this._gpEncode({ item: a }, !0).item;
                      },
                      this
                    )
                  ))
                : f instanceof Date && (a[e] = f.getTime());
            }
            return this._encode(a, b, c);
          },
          _decode: function(a) {
            var c = a.dataType,
              f = new H(a);
            if (
              -1 !==
              d.indexOf(["GPBoolean", "GPDouble", "GPLong", "GPString"], c)
            )
              return f;
            if ("GPLinearUnit" === c) f.value = new q(f.value);
            else if ("GPFeatureRecordSetLayer" === c || "GPRecordSet" === c)
              f.value = new b(f.value);
            else if ("GPDataFile" === c) f.value = new m(f.value);
            else if ("GPDate" === c)
              (a = f.value),
                t.isString(a)
                  ? (f.value = new A({ date: a }))
                  : (f.value = new Date(a));
            else if ("GPRasterData" === c || "GPRasterDataLayer" === c)
              (a = a.value.mapImage), (f.value = a ? new N(a) : new e(f.value));
            else if (-1 !== c.indexOf("GPMultiValue:")) {
              var k = c.split(":")[1];
              a = f.value;
              f.value = d.map(
                a,
                function(a) {
                  return this._decode({
                    paramName: "_name",
                    dataType: k,
                    value: a
                  }).value;
                },
                this
              );
            } else
              console.log(
                this.declaredClass +
                  " : GP Data type not handled. : " +
                  f.dataType
              ),
                (f = null);
            return f;
          },
          submitJob: function(a, b, c, d, e) {
            var k = this._getOutSR(),
              g = e.assembly;
            a = this._gpEncode(
              t.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  "env:outSR": k ? k.wkid || v.toJson(k.toJson()) : null,
                  "env:processSR": this.processSpatialReference
                    ? this.processSpatialReference.wkid ||
                      v.toJson(this.processSpatialReference.toJson())
                    : null
                },
                a
              ),
              null,
              g && g[0]
            );
            var q = this._jobUpdateHandler,
              m = this._errorHandler;
            return f({
              url: this._url.path + "/submitJob",
              content: a,
              callbackParamName: "callback",
              load: function(a, d) {
                q(a, d, !1, b, c, e.dfd);
              },
              error: function(a) {
                m(a, d, e.dfd);
              }
            });
          },
          _jobUpdateHandler: function(b, c, d, e, f, k) {
            var g = b.jobId;
            c = new a(b);
            this._successHandler([c], "onStatusUpdate", f, d && k);
            if (!d)
              switch (
                (clearTimeout(this._updateTimers[g]),
                (this._updateTimers[g] = null),
                k && k.progress(c),
                b.jobStatus)
              ) {
                case a.STATUS_SUBMITTED:
                case a.STATUS_EXECUTING:
                case a.STATUS_WAITING:
                case a.STATUS_NEW:
                  var q = this._getJobStatus;
                  this._updateTimers[g] = setTimeout(function() {
                    q(g, d, e, f, k);
                  }, this.updateDelay);
                  break;
                default:
                  this._successHandler([c], "onJobComplete", e, k);
              }
          },
          _getJobStatus: function(a, b, c, d, e) {
            var k = this._jobUpdateHandler;
            f({
              url: this._url.path + "/jobs/" + a,
              content: t.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: function(a, f) {
                k(a, f, b, c, d, e);
              },
              error: this._errorHandler
            });
          },
          _getResultDataHandler: function(a, b, c, d, e) {
            try {
              var f = this._decode(a);
              this._successHandler([f], "onGetResultDataComplete", c, e);
            } catch (M) {
              this._errorHandler(M, d, e);
            }
          },
          getResultData: function(a, b, d, e) {
            var k = this._getResultDataHandler,
              g = this._errorHandler,
              q = new u(c._dfdCanceller);
            q._pendingDfd = f({
              url: this._url.path + "/jobs/" + a + "/results/" + b,
              content: t.mixin({}, this._url.query, {
                f: "json",
                returnType: "data"
              }),
              callbackParamName: "callback",
              load: function(a, b) {
                k(a, b, d, e, q);
              },
              error: function(a) {
                g(a, e, q);
              }
            });
            return q;
          },
          checkJobStatus: function(a, b, d) {
            var e = this._jobUpdateHandler,
              k = this._errorHandler,
              g = new u(c._dfdCanceller);
            g._pendingDfd = f({
              url: this._url.path + "/jobs/" + a,
              content: t.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: function(a, c) {
                e(a, c, !0, null, b, g);
              },
              error: function(a) {
                k(a, d, g);
              }
            });
            return g;
          },
          cancelJob: function(a, b, d) {
            var e = this._errorHandler,
              k = new u(c._dfdCanceller);
            k._pendingDfd = f({
              url: this._url.path + "/jobs/" + a + "/cancel",
              content: t.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: t.hitch(this, function(a, c) {
                this._successHandler([a], "onJobCancel", b, k);
              }),
              error: function(a) {
                e(a, d, k);
              }
            });
            return k;
          },
          execute: function(a, b, c, d) {
            var e = this._getOutSR(),
              k = d.assembly;
            a = this._gpEncode(
              t.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  "env:outSR": e ? e.wkid || v.toJson(e.toJson()) : null,
                  "env:processSR": this.processSpatialReference
                    ? this.processSpatialReference.wkid ||
                      v.toJson(this.processSpatialReference.toJson())
                    : null
                },
                a
              ),
              null,
              k && k[0]
            );
            var g = this._executeHandler,
              q = this._errorHandler;
            return f({
              url: this._url.path + "/execute",
              content: a,
              callbackParamName: "callback",
              load: function(a, e) {
                g(a, e, b, c, d.dfd);
              },
              error: function(a) {
                q(a, c, d.dfd);
              }
            });
          },
          _executeHandler: function(a, b, c, d, e) {
            try {
              var f = a.results,
                g,
                q,
                m = a.messages;
              g = 0;
              for (q = f.length; g < q; g++) f[g] = this._decode(f[g]);
              g = 0;
              for (q = m.length; g < q; g++) m[g] = new k(m[g]);
              this._successHandler([f, m], "onExecuteComplete", c, e);
            } catch (Q) {
              this._errorHandler(Q, d, e);
            }
          },
          _getResultImageHandler: function(a, b, c, d, e) {
            try {
              var f = this._decode(a);
              this._successHandler([f], "onGetResultImageComplete", c, e);
            } catch (M) {
              this._errorHandler(M, d, e);
            }
          },
          getResultImage: function(a, b, d, e, k) {
            var g = this._getResultImageHandler,
              q = this._errorHandler;
            d = this._gpEncode(
              t.mixin({}, this._url.query, { f: "json" }, d.toJson())
            );
            var m = new u(c._dfdCanceller);
            m._pendingDfd = f({
              url: this._url.path + "/jobs/" + a + "/results/" + b,
              content: d,
              callbackParamName: "callback",
              load: function(a, b) {
                g(a, b, e, k, m);
              },
              error: function(a) {
                q(a, k, m);
              }
            });
            return m;
          },
          cancelJobStatusUpdates: function(a) {
            clearTimeout(this._updateTimers[a]);
            this._updateTimers[a] = null;
          },
          getResultImageLayer: function(a, b, c, d) {
            if (null == b) {
              var e = this._url.path.indexOf("/GPServer/");
              a = this._url.path.substring(0, e) + "/MapServer/jobs/" + a;
            } else a = this._url.path + "/jobs/" + a + "/results/" + b;
            this._url.query && (a += "?" + n.objectToQuery(this._url.query));
            b =
              null == b
                ? new E(a, { imageParameters: c })
                : new I(a, { imageParameters: c }, !0);
            this.onGetResultImageLayerComplete(b);
            d && d(b);
            return b;
          },
          onStatusUpdate: function() {},
          onJobComplete: function() {},
          onExecuteComplete: function() {},
          onGetResultDataComplete: function() {},
          onGetResultImageComplete: function() {},
          onGetResultImageLayerComplete: function() {},
          onJobCancel: function() {}
        });
        F._createWrappers(h);
        x("extend-esri") && t.setObject("tasks.Geoprocessor", h, r);
        return h;
      });
    },
    "esri/tasks/JobInfo": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "./GPMessage"
      ], function(h, t, d, u, v) {
        h = h(null, {
          declaredClass: "esri.tasks.JobInfo",
          constructor: function(d) {
            this.messages = [];
            t.mixin(this, d);
            d = this.messages;
            var h,
              r = d.length;
            for (h = 0; h < r; h++) d[h] = new v(d[h]);
          },
          jobId: "",
          jobStatus: ""
        });
        t.mixin(h, {
          STATUS_CANCELLED: "esriJobCancelled",
          STATUS_CANCELLING: "esriJobCancelling",
          STATUS_DELETED: "esriJobDeleted",
          STATUS_DELETING: "esriJobDeleting",
          STATUS_EXECUTING: "esriJobExecuting",
          STATUS_FAILED: "esriJobFailed",
          STATUS_NEW: "esriJobNew",
          STATUS_SUBMITTED: "esriJobSubmitted",
          STATUS_SUCCEEDED: "esriJobSucceeded",
          STATUS_TIMED_OUT: "esriJobTimedOut",
          STATUS_WAITING: "esriJobWaiting"
        });
        d("extend-esri") && t.setObject("tasks.JobInfo", h, u);
        return h;
      });
    },
    "esri/tasks/GPMessage": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.GPMessage",
          constructor: function(d) {
            t.mixin(this, d);
          }
        });
        t.mixin(h, {
          TYPE_INFORMATIVE: "esriJobMessageTypeInformative",
          TYPE_PROCESS_DEFINITION: "esriJobMessageTypeProcessDefinition",
          TYPE_PROCESS_START: "esriJobMessageTypeProcessStart",
          TYPE_PROCESS_STOP: "esriJobMessageTypeProcessStop",
          TYPE_WARNING: "esriJobMessageTypeWarning",
          TYPE_ERROR: "esriJobMessageTypeError",
          TYPE_EMPTY: "esriJobMessageTypeEmpty",
          TYPE_ABORT: "esriJobMessageTypeAbort"
        });
        d("extend-esri") && t.setObject("tasks.GPMessage", h, u);
        return h;
      });
    },
    "esri/tasks/LinearUnit": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.LinearUnit",
          constructor: function(d) {
            d && t.mixin(this, d);
          },
          distance: 0,
          units: null,
          toJson: function() {
            var d = {};
            this.distance && (d.distance = this.distance);
            this.units && (d.units = this.units);
            return d;
          }
        });
        d("extend-esri") && t.setObject("tasks.LinearUnit", h, u);
        return h;
      });
    },
    "esri/tasks/DataFile": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.DataFile",
          constructor: function(d) {
            d && t.mixin(this, d);
          },
          url: null,
          itemID: null,
          toJson: function() {
            var d = {};
            this.url && (d.url = this.url);
            this.itemID && (d.itemID = this.itemID);
            return d;
          }
        });
        d("extend-esri") && t.setObject("tasks.DataFile", h, u);
        return h;
      });
    },
    "esri/tasks/RasterData": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.RasterData",
          constructor: function(d) {
            d && t.mixin(this, d);
          },
          url: null,
          format: null,
          itemID: null,
          toJson: function() {
            var d = {};
            this.url && (d.url = this.url);
            this.format && (d.format = this.format);
            this.itemID && (d.itemID = this.itemID);
            return d;
          }
        });
        d("extend-esri") && t.setObject("tasks.RasterData", h, u);
        return h;
      });
    },
    "esri/tasks/Date": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/date/locale",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u, v) {
        h = h(null, {
          declaredClass: "esri.tasks.Date",
          constructor: function(h) {
            h &&
              (h.format && (this.format = h.format),
              (this.date = d.parse(h.date, {
                selector: "date",
                datePattern: this.format
              })));
          },
          date: new Date(),
          format: "EEE MMM dd HH:mm:ss zzz yyyy",
          toJson: function() {
            return {
              date: d.format(this.date, {
                selector: "date",
                datePattern: this.format
              }),
              format: this.format
            };
          }
        });
        u("extend-esri") && t.setObject("tasks.Date", h, v);
        return h;
      });
    },
    "esri/tasks/ParameterValue": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.ParameterValue",
          constructor: function(d) {
            t.mixin(this, d);
          }
        });
        d("extend-esri") && t.setObject("tasks.ParameterValue", h, u);
        return h;
      });
    },
    "esri/tasks/GPResultImageLayer": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has dojo/io-query ../kernel ../layers/ArcGISDynamicMapServiceLayer".split(
        " "
      ), function(h, t, d, u, v, x, n) {
        h = h(n, {
          declaredClass: "esri.tasks._GPResultImageLayer",
          constructor: function(d, f) {
            f &&
              f.imageParameters &&
              f.imageParameters.extent &&
              ((this.initialExtent = this.fullExtent =
                f.imageParameters.extent),
              (this.spatialReference = this.initialExtent.spatialReference));
            this.getImageUrl = t.hitch(this, this.getImageUrl);
            this.loaded = !0;
            this.onLoad(this);
          },
          getImageUrl: function(h, f, c, n) {
            var g = h.spatialReference.wkid;
            n(
              this._url.path +
                "?" +
                v.objectToQuery(
                  t.mixin(this._params, {
                    f: "image",
                    bbox: d.toJson(h.toJson()),
                    bboxSR: g,
                    imageSR: g,
                    size: f + "," + c
                  })
                )
            );
          }
        });
        u("extend-esri") && t.setObject("tasks._GPResultImageLayer", h, x);
        return h;
      });
    },
    "esri/tasks/PrintTemplate": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.PrintTemplate",
          label: null,
          exportOptions: { width: 800, height: 1100, dpi: 96 },
          layoutOptions: null,
          format: "PNG32",
          layout: "MAP_ONLY",
          outScale: 0,
          preserveScale: !0,
          forceFeatureAttributes: !1,
          showAttribution: null,
          showLabels: !0
        });
        d("extend-esri") && t.setObject("tasks.PrintTemplate", h, u);
        return h;
      });
    },
    "dojox/gfx/canvas": function() {
      define("./_base dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/_base/window dojo/dom-geometry dojo/dom ./shape ./path ./arc ./matrix ./decompose ./bezierutils".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g, b) {
        function a(a, b, c, d, e, f, k, g, q, m) {
          var l,
            y,
            D = b.length,
            h = 0;
          m ? ((y = m.l / e), (h = m.i)) : (y = b[0] / e);
          for (; f < k; )
            f + y > k && ((l = { l: (f + y - k) * e, i: h }), (y = k - f)),
              h % 2 ||
                (a.beginPath(), a.arc(c, d, e, f, f + y, g), q && a.stroke()),
              (f += y),
              ++h,
              (y = b[h % D] / e);
          return l;
        }
        function k(a, c, d, e) {
          var f = 0,
            l = 0,
            k,
            g = 0;
          e ? ((k = e.l), (g = e.i)) : (k = c[0]);
          for (; 1 > l; )
            (l = b.tAtLength(a, k)),
              1 == l && ((f = b.computeLength(a)), (f = { l: k - f, i: g })),
              (a = b.splitBezierAtT(a, l)),
              g % 2 || d.push(a[0]),
              (a = a[1]),
              ++g,
              (k = c[g % c.length]);
          return f;
        }
        function q(a, b, c, d) {
          var e = [b.last.x, b.last.y].concat(c),
            f = !(a instanceof Array);
          c = 4 === c.length ? "quadraticCurveTo" : "bezierCurveTo";
          var l = [];
          b = k(e, b.canvasDash, l, d);
          for (d = 0; d < l.length; ++d)
            (e = l[d]),
              f
                ? (a.moveTo(e[0], e[1]), a[c].apply(a, e.slice(2)))
                : (a.push("moveTo", [e[0], e[1]]), a.push(c, e.slice(2)));
          return b;
        }
        function m(a, c, d, e, f, k, g) {
          var l = 0,
            q = 0,
            m = 0,
            y = b.distance(d, e, f, k),
            h = 0;
          c = c.canvasDash;
          var D = d,
            n = e,
            A,
            r = !(a instanceof Array);
          g ? ((m = g.l), (h = g.i)) : (m += c[0]);
          for (; 0.01 < Math.abs(1 - q); )
            m > y && ((l = { l: m - y, i: h }), (m = y)),
              (q = m / y),
              (g = d + (f - d) * q),
              (A = e + (k - e) * q),
              h++ % 2 ||
                (r
                  ? (a.moveTo(D, n), a.lineTo(g, A))
                  : (a.push("moveTo", [D, n]), a.push("lineTo", [g, A]))),
              (D = g),
              (n = A),
              (m += c[h % c.length]);
          return l;
        }
        var e = (h.canvas = {}),
          A = null,
          H = F.multiplyPoint,
          I = Math.PI,
          E = 2 * I,
          N = I / 2;
        g = t.extend;
        if (v.global.CanvasRenderingContext2D) {
          v = v.doc.createElement("canvas").getContext("2d");
          var C = "function" == typeof v.setLineDash,
            G = "function" == typeof v.fillText;
        }
        var B = {
          solid: "none",
          shortdash: [4, 1],
          shortdot: [1, 1],
          shortdashdot: [4, 1, 1, 1],
          shortdashdotdot: [4, 1, 1, 1, 1, 1],
          dot: [1, 3],
          dash: [4, 3],
          longdash: [8, 3],
          dashdot: [4, 3, 1, 3],
          longdashdot: [8, 3, 1, 3],
          longdashdotdot: [8, 3, 1, 3, 1, 3]
        };
        e.Shape = u("dojox.gfx.canvas.Shape", r.Shape, {
          _render: function(a) {
            a.save();
            this._renderTransform(a);
            this._renderClip(a);
            this._renderShape(a);
            this._renderFill(a, !0);
            this._renderStroke(a, !0);
            a.restore();
          },
          _renderClip: function(a) {
            this.canvasClip && (this.canvasClip.render(a), a.clip());
          },
          _renderTransform: function(a) {
            if ("canvasTransform" in this) {
              var b = this.canvasTransform;
              a.translate(b.dx, b.dy);
              a.rotate(b.angle2);
              a.scale(b.sx, b.sy);
              a.rotate(b.angle1);
            }
          },
          _renderShape: function(a) {},
          _renderFill: function(a, b) {
            if ("canvasFill" in this) {
              var c = this.fillStyle;
              if ("canvasFillImage" in this) {
                var d = c.width,
                  e = c.height,
                  f = this.canvasFillImage.width,
                  l = this.canvasFillImage.height,
                  k = Math.min(d == f ? 1 : d / f, e == l ? 1 : e / l),
                  g = (d - k * f) / 2,
                  q = (e - k * l) / 2;
                A.width = d;
                A.height = e;
                var m = A.getContext("2d");
                m.clearRect(0, 0, d, e);
                m.drawImage(
                  this.canvasFillImage,
                  0,
                  0,
                  f,
                  l,
                  g,
                  q,
                  k * f,
                  k * l
                );
                this.canvasFill = a.createPattern(A, "repeat");
                delete this.canvasFillImage;
              }
              a.fillStyle = this.canvasFill;
              b &&
                ("pattern" !== c.type ||
                  (0 === c.x && 0 === c.y) ||
                  a.translate(c.x, c.y),
                a.fill());
            } else a.fillStyle = "rgba(0,0,0,0.0)";
          },
          _renderStroke: function(a, b) {
            var c = this.strokeStyle;
            c
              ? ((a.strokeStyle = c.color.toString()),
                (a.lineWidth = c.width),
                (a.lineCap = c.cap),
                "number" == typeof c.join
                  ? ((a.lineJoin = "miter"), (a.miterLimit = c.join))
                  : (a.lineJoin = c.join),
                this.canvasDash
                  ? C
                    ? (a.setLineDash(this.canvasDash), b && a.stroke())
                    : this._renderDashedStroke(a, b)
                  : b && a.stroke())
              : b || (a.strokeStyle = "rgba(0,0,0,0.0)");
          },
          _renderDashedStroke: function(a, b) {},
          getEventSource: function() {
            return null;
          },
          on: function() {},
          connect: function() {},
          disconnect: function() {},
          canvasClip: null,
          setClip: function(a) {
            this.inherited(arguments);
            var b = a
              ? "width" in a
                ? "rect"
                : "cx" in a
                ? "ellipse"
                : "points" in a
                ? "polyline"
                : "d" in a
                ? "path"
                : null
              : null;
            if (a && !b) return this;
            this.canvasClip = a ? Y(b, a) : null;
            this.parent && this.parent._makeDirty();
            return this;
          }
        });
        var Y = function(a, b) {
            switch (a) {
              case "ellipse":
                return {
                  canvasEllipse: J({ shape: b }),
                  render: function(a) {
                    return e.Ellipse.prototype._renderShape.call(this, a);
                  }
                };
              case "rect":
                return {
                  shape: t.delegate(b, { r: 0 }),
                  render: function(a) {
                    return e.Rect.prototype._renderShape.call(this, a);
                  }
                };
              case "path":
                return {
                  canvasPath: L(b),
                  render: function(a) {
                    this.canvasPath._renderShape(a);
                  }
                };
              case "polyline":
                return {
                  canvasPolyline: b.points,
                  render: function(a) {
                    return e.Polyline.prototype._renderShape.call(this, a);
                  }
                };
            }
            return null;
          },
          L = function(a) {
            var b = new dojox.gfx.canvas.Path();
            b.canvasPath = [];
            b._setPath(a.d);
            return b;
          },
          O = function(a, b, c) {
            var d = a.prototype[b];
            a.prototype[b] = c
              ? function() {
                  this.parent && this.parent._makeDirty();
                  d.apply(this, arguments);
                  c.call(this);
                  return this;
                }
              : function() {
                  this.parent && this.parent._makeDirty();
                  return d.apply(this, arguments);
                };
          };
        O(e.Shape, "setTransform", function() {
          this.matrix
            ? (this.canvasTransform = h.decompose(this.matrix))
            : delete this.canvasTransform;
        });
        O(e.Shape, "setFill", function() {
          var a = this.fillStyle,
            b;
          if (a) {
            if ("object" == typeof a && "type" in a) {
              var c = this.surface.rawNode.getContext("2d");
              switch (a.type) {
                case "linear":
                case "radial":
                  b =
                    "linear" == a.type
                      ? c.createLinearGradient(a.x1, a.y1, a.x2, a.y2)
                      : c.createRadialGradient(a.cx, a.cy, 0, a.cx, a.cy, a.r);
                  d.forEach(a.colors, function(a) {
                    b.addColorStop(
                      a.offset,
                      h.normalizeColor(a.color).toString()
                    );
                  });
                  break;
                case "pattern":
                  A || (A = document.createElement("canvas")),
                    (c = new Image()),
                    this.surface.downloadImage(c, a.src),
                    (this.canvasFillImage = c);
              }
            } else b = a.toString();
            this.canvasFill = b;
          } else delete this.canvasFill;
        });
        O(e.Shape, "setStroke", function() {
          var a = this.strokeStyle;
          if (a) {
            var b = this.strokeStyle.style.toLowerCase();
            b in B && (b = B[b]);
            if (b instanceof Array) {
              this.canvasDash = b = b.slice();
              var c;
              for (c = 0; c < b.length; ++c) b[c] *= a.width;
              if ("butt" != a.cap) {
                for (c = 0; c < b.length; c += 2)
                  (b[c] -= a.width), 1 > b[c] && (b[c] = 1);
                for (c = 1; c < b.length; c += 2) b[c] += a.width;
              }
            } else delete this.canvasDash;
          } else delete this.canvasDash;
          this._needsDash = !C && !!this.canvasDash;
        });
        O(e.Shape, "setShape");
        e.Group = u("dojox.gfx.canvas.Group", e.Shape, {
          constructor: function() {
            r.Container._init.call(this);
          },
          _render: function(a) {
            a.save();
            this._renderTransform(a);
            this._renderClip(a);
            for (var b = 0; b < this.children.length; ++b)
              this.children[b]._render(a);
            a.restore();
          },
          destroy: function() {
            r.Container.clear.call(this, !0);
            e.Shape.prototype.destroy.apply(this, arguments);
          }
        });
        e.Rect = u("dojox.gfx.canvas.Rect", [e.Shape, r.Rect], {
          _renderShape: function(a) {
            var b = this.shape,
              c = Math.min(b.r, b.height / 2, b.width / 2),
              d = b.x,
              e = d + b.width,
              f = b.y,
              b = f + b.height,
              k = d + c,
              g = e - c,
              q = f + c,
              m = b - c;
            a.beginPath();
            a.moveTo(k, f);
            c
              ? (a.arc(g, q, c, -N, 0, !1),
                a.arc(g, m, c, 0, N, !1),
                a.arc(k, m, c, N, I, !1),
                a.arc(k, q, c, I, I + N, !1))
              : (a.lineTo(g, f),
                a.lineTo(e, m),
                a.lineTo(k, b),
                a.lineTo(d, q));
            a.closePath();
          },
          _renderDashedStroke: function(b, c) {
            var d = this.shape,
              e = Math.min(d.r, d.height / 2, d.width / 2),
              f = d.x,
              k = f + d.width,
              l = d.y,
              g = l + d.height,
              q = f + e,
              h = k - e,
              n = l + e,
              A = g - e;
            e
              ? (b.beginPath(),
                (d = m(b, this, q, l, h, l)),
                c && b.stroke(),
                (d = a(b, this.canvasDash, h, n, e, -N, 0, !1, c, d)),
                b.beginPath(),
                (d = m(b, this, k, n, k, A, d)),
                c && b.stroke(),
                (d = a(b, this.canvasDash, h, A, e, 0, N, !1, c, d)),
                b.beginPath(),
                (d = m(b, this, h, g, q, g, d)),
                c && b.stroke(),
                (d = a(b, this.canvasDash, q, A, e, N, I, !1, c, d)),
                b.beginPath(),
                (d = m(b, this, f, A, f, n, d)),
                c && b.stroke(),
                a(b, this.canvasDash, q, n, e, I, I + N, !1, c, d))
              : (b.beginPath(),
                (d = m(b, this, q, l, h, l)),
                (d = m(b, this, h, l, k, A, d)),
                (d = m(b, this, k, A, q, g, d)),
                m(b, this, q, g, f, n, d),
                c && b.stroke());
          }
        });
        var M = [];
        (function() {
          var a = c.curvePI4;
          M.push(a.s, a.c1, a.c2, a.e);
          for (var b = 45; 360 > b; b += 45) {
            var d = F.rotateg(b);
            M.push(H(d, a.c1), H(d, a.c2), H(d, a.e));
          }
        })();
        var J = function(a) {
          var b,
            c,
            d,
            e = [],
            f = a.shape,
            g = F.normalize([F.translate(f.cx, f.cy), F.scale(f.rx, f.ry)]);
          b = H(g, M[0]);
          e.push([b.x, b.y]);
          for (f = 1; f < M.length; f += 3)
            (c = H(g, M[f])),
              (d = H(g, M[f + 1])),
              (b = H(g, M[f + 2])),
              e.push([c.x, c.y, d.x, d.y, b.x, b.y]);
          if (a._needsDash) {
            b = [];
            c = e[0];
            for (f = 1; f < e.length; ++f)
              (d = []),
                k(c.concat(e[f]), a.canvasDash, d),
                (c = [e[f][4], e[f][5]]),
                b.push(d);
            a._dashedPoints = b;
          }
          return e;
        };
        e.Ellipse = u("dojox.gfx.canvas.Ellipse", [e.Shape, r.Ellipse], {
          setShape: function() {
            this.inherited(arguments);
            this.canvasEllipse = J(this);
            return this;
          },
          setStroke: function() {
            this.inherited(arguments);
            C || (this.canvasEllipse = J(this));
            return this;
          },
          _renderShape: function(a) {
            var b = this.canvasEllipse,
              c;
            a.beginPath();
            a.moveTo.apply(a, b[0]);
            for (c = 1; c < b.length; ++c) a.bezierCurveTo.apply(a, b[c]);
            a.closePath();
          },
          _renderDashedStroke: function(a, b) {
            var c = this._dashedPoints;
            a.beginPath();
            for (var d = 0; d < c.length; ++d)
              for (var e = c[d], f = 0; f < e.length; ++f) {
                var k = e[f];
                a.moveTo(k[0], k[1]);
                a.bezierCurveTo(k[2], k[3], k[4], k[5], k[6], k[7]);
              }
            b && a.stroke();
          }
        });
        e.Circle = u("dojox.gfx.canvas.Circle", [e.Shape, r.Circle], {
          _renderShape: function(a) {
            var b = this.shape;
            a.beginPath();
            a.arc(b.cx, b.cy, b.r, 0, E, 1);
          },
          _renderDashedStroke: function(a, b) {
            var c = this.shape,
              d = 0,
              e,
              f = this.canvasDash.length;
            for (i = 0; d < E; )
              (e = this.canvasDash[i % f] / c.r),
                i % 2 ||
                  (a.beginPath(),
                  a.arc(c.cx, c.cy, c.r, d, d + e, 0),
                  b && a.stroke()),
                (d += e),
                ++i;
          }
        });
        e.Line = u("dojox.gfx.canvas.Line", [e.Shape, r.Line], {
          _renderShape: function(a) {
            var b = this.shape;
            a.beginPath();
            a.moveTo(b.x1, b.y1);
            a.lineTo(b.x2, b.y2);
          },
          _renderDashedStroke: function(a, b) {
            var c = this.shape;
            a.beginPath();
            m(a, this, c.x1, c.y1, c.x2, c.y2);
            b && a.stroke();
          }
        });
        e.Polyline = u("dojox.gfx.canvas.Polyline", [e.Shape, r.Polyline], {
          setShape: function() {
            this.inherited(arguments);
            var a = this.shape.points,
              b = a[0],
              c,
              d;
            this.bbox = null;
            this._normalizePoints();
            if (a.length)
              if ("number" == typeof b) b = a;
              else
                for (b = [], d = 0; d < a.length; ++d)
                  (c = a[d]), b.push(c.x, c.y);
            else b = [];
            this.canvasPolyline = b;
            return this;
          },
          _renderShape: function(a) {
            var b = this.canvasPolyline;
            if (b.length) {
              a.beginPath();
              a.moveTo(b[0], b[1]);
              for (var c = 2; c < b.length; c += 2) a.lineTo(b[c], b[c + 1]);
            }
          },
          _renderDashedStroke: function(a, b) {
            var c = this.canvasPolyline,
              d = 0;
            a.beginPath();
            for (var e = 0; e < c.length; e += 2)
              d = m(a, this, c[e], c[e + 1], c[e + 2], c[e + 3], d);
            b && a.stroke();
          }
        });
        e.Image = u("dojox.gfx.canvas.Image", [e.Shape, r.Image], {
          setShape: function() {
            this.inherited(arguments);
            var a = new Image();
            this.surface.downloadImage(a, this.shape.src);
            this.canvasImage = a;
            return this;
          },
          _renderShape: function(a) {
            var b = this.shape;
            a.drawImage(this.canvasImage, b.x, b.y, b.width, b.height);
          }
        });
        e.Text = u("dojox.gfx.canvas.Text", [e.Shape, r.Text], {
          _setFont: function() {
            this.fontStyle
              ? (this.canvasFont = h.makeFontString(this.fontStyle))
              : delete this.canvasFont;
          },
          getTextWidth: function() {
            var a = this.shape,
              b = 0,
              c;
            a.text &&
              ((c = this.surface.rawNode.getContext("2d")),
              c.save(),
              this._renderTransform(c),
              this._renderFill(c, !1),
              this._renderStroke(c, !1),
              this.canvasFont && (c.font = this.canvasFont),
              (b = c.measureText(a.text).width),
              c.restore());
            return b;
          },
          _render: function(a) {
            a.save();
            this._renderTransform(a);
            this._renderFill(a, !1);
            this._renderStroke(a, !1);
            this._renderShape(a);
            a.restore();
          },
          _renderShape: function(a) {
            var b = this.shape;
            b.text &&
              ((a.textAlign = "middle" === b.align ? "center" : b.align),
              this.canvasFont && (a.font = this.canvasFont),
              this.canvasFill && a.fillText(b.text, b.x, b.y),
              this.strokeStyle &&
                (a.beginPath(), a.strokeText(b.text, b.x, b.y), a.closePath()));
          }
        });
        O(e.Text, "setFont");
        G ||
          e.Text.extend({
            getTextWidth: function() {
              return 0;
            },
            getBoundingBox: function() {
              return null;
            },
            _renderShape: function() {}
          });
        var V = {
          M: "_moveToA",
          m: "_moveToR",
          L: "_lineToA",
          l: "_lineToR",
          H: "_hLineToA",
          h: "_hLineToR",
          V: "_vLineToA",
          v: "_vLineToR",
          C: "_curveToA",
          c: "_curveToR",
          S: "_smoothCurveToA",
          s: "_smoothCurveToR",
          Q: "_qCurveToA",
          q: "_qCurveToR",
          T: "_qSmoothCurveToA",
          t: "_qSmoothCurveToR",
          A: "_arcTo",
          a: "_arcTo",
          Z: "_closePath",
          z: "_closePath"
        };
        e.Path = u("dojox.gfx.canvas.Path", [e.Shape, f.Path], {
          constructor: function() {
            this.lastControl = {};
          },
          setShape: function() {
            this.canvasPath = [];
            this._dashedPath = [];
            return this.inherited(arguments);
          },
          setStroke: function() {
            this.inherited(arguments);
            C || ((this.segmented = !1), this._confirmSegmented());
            return this;
          },
          _setPath: function() {
            this._dashResidue = null;
            this.inherited(arguments);
          },
          _updateWithSegment: function(a) {
            var b = t.clone(this.last);
            this[V[a.action]](
              this.canvasPath,
              a.action,
              a.args,
              this._needsDash ? this._dashedPath : null
            );
            this.last = b;
            this.inherited(arguments);
          },
          _renderShape: function(a) {
            var b = this.canvasPath;
            a.beginPath();
            for (var c = 0; c < b.length; c += 2) a[b[c]].apply(a, b[c + 1]);
          },
          _renderDashedStroke: C
            ? function() {}
            : function(a, b) {
                var c = this._dashedPath;
                a.beginPath();
                for (var d = 0; d < c.length; d += 2)
                  a[c[d]].apply(a, c[d + 1]);
                b && a.stroke();
              },
          _moveToA: function(a, b, c, d) {
            a.push("moveTo", [c[0], c[1]]);
            d && d.push("moveTo", [c[0], c[1]]);
            for (b = 2; b < c.length; b += 2)
              a.push("lineTo", [c[b], c[b + 1]]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    c[b - 2],
                    c[b - 1],
                    c[b],
                    c[b + 1],
                    this._dashResidue
                  ));
            this.last.x = c[c.length - 2];
            this.last.y = c[c.length - 1];
            this.lastControl = {};
          },
          _moveToR: function(a, b, c, d) {
            b =
              "x" in this.last
                ? [(this.last.x += c[0]), (this.last.y += c[1])]
                : [(this.last.x = c[0]), (this.last.y = c[1])];
            a.push("moveTo", b);
            d && d.push("moveTo", b);
            for (b = 2; b < c.length; b += 2)
              a.push("lineTo", [
                (this.last.x += c[b]),
                (this.last.y += c[b + 1])
              ]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    d[d.length - 1][0],
                    d[d.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _lineToA: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 2)
              d &&
                (this._dashResidue = m(
                  d,
                  this,
                  this.last.x,
                  this.last.y,
                  c[b],
                  c[b + 1],
                  this._dashResidue
                )),
                a.push("lineTo", [c[b], c[b + 1]]);
            this.last.x = c[c.length - 2];
            this.last.y = c[c.length - 1];
            this.lastControl = {};
          },
          _lineToR: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 2)
              a.push("lineTo", [
                (this.last.x += c[b]),
                (this.last.y += c[b + 1])
              ]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    d[d.length - 1][0],
                    d[d.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _hLineToA: function(a, b, c, d) {
            for (b = 0; b < c.length; ++b)
              a.push("lineTo", [c[b], this.last.y]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    d[d.length - 1][0],
                    d[d.length - 1][1],
                    c[b],
                    this.last.y,
                    this._dashResidue
                  ));
            this.last.x = c[c.length - 1];
            this.lastControl = {};
          },
          _hLineToR: function(a, b, c, d) {
            for (b = 0; b < c.length; ++b)
              a.push("lineTo", [(this.last.x += c[b]), this.last.y]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    d[d.length - 1][0],
                    d[d.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _vLineToA: function(a, b, c, d) {
            for (b = 0; b < c.length; ++b)
              a.push("lineTo", [this.last.x, c[b]]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    d[d.length - 1][0],
                    d[d.length - 1][1],
                    this.last.x,
                    c[b],
                    this._dashResidue
                  ));
            this.last.y = c[c.length - 1];
            this.lastControl = {};
          },
          _vLineToR: function(a, b, c, d) {
            for (b = 0; b < c.length; ++b)
              a.push("lineTo", [this.last.x, (this.last.y += c[b])]),
                d &&
                  (this._dashResidue = m(
                    d,
                    this,
                    d[d.length - 1][0],
                    d[d.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _curveToA: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 6)
              a.push("bezierCurveTo", c.slice(b, b + 6)),
                d &&
                  (this._dashResidue = q(
                    d,
                    this,
                    a[a.length - 1],
                    this._dashResidue
                  ));
            this.last.x = c[c.length - 2];
            this.last.y = c[c.length - 1];
            this.lastControl.x = c[c.length - 4];
            this.lastControl.y = c[c.length - 3];
            this.lastControl.type = "C";
          },
          _curveToR: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 6)
              a.push("bezierCurveTo", [
                this.last.x + c[b],
                this.last.y + c[b + 1],
                (this.lastControl.x = this.last.x + c[b + 2]),
                (this.lastControl.y = this.last.y + c[b + 3]),
                this.last.x + c[b + 4],
                this.last.y + c[b + 5]
              ]),
                d &&
                  (this._dashResidue = q(
                    d,
                    this,
                    a[a.length - 1],
                    this._dashResidue
                  )),
                (this.last.x += c[b + 4]),
                (this.last.y += c[b + 5]);
            this.lastControl.type = "C";
          },
          _smoothCurveToA: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 4) {
              var e = "C" == this.lastControl.type;
              a.push("bezierCurveTo", [
                e ? 2 * this.last.x - this.lastControl.x : this.last.x,
                e ? 2 * this.last.y - this.lastControl.y : this.last.y,
                c[b],
                c[b + 1],
                c[b + 2],
                c[b + 3]
              ]);
              d &&
                (this._dashResidue = q(
                  d,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.x = c[b];
              this.lastControl.y = c[b + 1];
              this.lastControl.type = "C";
            }
            this.last.x = c[c.length - 2];
            this.last.y = c[c.length - 1];
          },
          _smoothCurveToR: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 4) {
              var e = "C" == this.lastControl.type;
              a.push("bezierCurveTo", [
                e ? 2 * this.last.x - this.lastControl.x : this.last.x,
                e ? 2 * this.last.y - this.lastControl.y : this.last.y,
                this.last.x + c[b],
                this.last.y + c[b + 1],
                this.last.x + c[b + 2],
                this.last.y + c[b + 3]
              ]);
              d &&
                (this._dashResidue = q(
                  d,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.x = this.last.x + c[b];
              this.lastControl.y = this.last.y + c[b + 1];
              this.lastControl.type = "C";
              this.last.x += c[b + 2];
              this.last.y += c[b + 3];
            }
          },
          _qCurveToA: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 4)
              a.push("quadraticCurveTo", c.slice(b, b + 4));
            d &&
              (this._dashResidue = q(
                d,
                this,
                a[a.length - 1],
                this._dashResidue
              ));
            this.last.x = c[c.length - 2];
            this.last.y = c[c.length - 1];
            this.lastControl.x = c[c.length - 4];
            this.lastControl.y = c[c.length - 3];
            this.lastControl.type = "Q";
          },
          _qCurveToR: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 4)
              a.push("quadraticCurveTo", [
                (this.lastControl.x = this.last.x + c[b]),
                (this.lastControl.y = this.last.y + c[b + 1]),
                this.last.x + c[b + 2],
                this.last.y + c[b + 3]
              ]),
                d &&
                  (this._dashResidue = q(
                    d,
                    this,
                    a[a.length - 1],
                    this._dashResidue
                  )),
                (this.last.x += c[b + 2]),
                (this.last.y += c[b + 3]);
            this.lastControl.type = "Q";
          },
          _qSmoothCurveToA: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 2) {
              var e = "Q" == this.lastControl.type;
              a.push("quadraticCurveTo", [
                (this.lastControl.x = e
                  ? 2 * this.last.x - this.lastControl.x
                  : this.last.x),
                (this.lastControl.y = e
                  ? 2 * this.last.y - this.lastControl.y
                  : this.last.y),
                c[b],
                c[b + 1]
              ]);
              d &&
                (this._dashResidue = q(
                  d,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.type = "Q";
            }
            this.last.x = c[c.length - 2];
            this.last.y = c[c.length - 1];
          },
          _qSmoothCurveToR: function(a, b, c, d) {
            for (b = 0; b < c.length; b += 2) {
              var e = "Q" == this.lastControl.type;
              a.push("quadraticCurveTo", [
                (this.lastControl.x = e
                  ? 2 * this.last.x - this.lastControl.x
                  : this.last.x),
                (this.lastControl.y = e
                  ? 2 * this.last.y - this.lastControl.y
                  : this.last.y),
                this.last.x + c[b],
                this.last.y + c[b + 1]
              ]);
              d &&
                (this._dashResidue = q(
                  d,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.type = "Q";
              this.last.x += c[b];
              this.last.y += c[b + 1];
            }
          },
          _arcTo: function(a, b, e, f) {
            b = "a" == b;
            for (var k = 0; k < e.length; k += 7) {
              var g = e[k + 5],
                m = e[k + 6];
              b && ((g += this.last.x), (m += this.last.y));
              var l = c.arcAsBezier(
                this.last,
                e[k],
                e[k + 1],
                e[k + 2],
                e[k + 3] ? 1 : 0,
                e[k + 4] ? 1 : 0,
                g,
                m
              );
              d.forEach(l, function(b) {
                a.push("bezierCurveTo", b);
              });
              f && (this._dashResidue = q(f, this, p, this._dashResidue));
              this.last.x = g;
              this.last.y = m;
            }
            this.lastControl = {};
          },
          _closePath: function(a, b, c, d) {
            a.push("closePath", []);
            d &&
              (this._dashResidue = m(
                d,
                this,
                this.last.x,
                this.last.y,
                d[1][0],
                d[1][1],
                this._dashResidue
              ));
            this.lastControl = {};
          }
        });
        d.forEach(
          "moveTo lineTo hLineTo vLineTo curveTo smoothCurveTo qCurveTo qSmoothCurveTo arcTo closePath".split(
            " "
          ),
          function(a) {
            O(e.Path, a);
          }
        );
        e.TextPath = u("dojox.gfx.canvas.TextPath", [e.Shape, f.TextPath], {
          _renderShape: function(a) {},
          _setText: function() {},
          _setFont: function() {}
        });
        e.Surface = u("dojox.gfx.canvas.Surface", r.Surface, {
          constructor: function() {
            r.Container._init.call(this);
            this.pendingImageCount = 0;
            this.makeDirty();
          },
          destroy: function() {
            r.Container.clear.call(this, !0);
            this.inherited(arguments);
          },
          setDimensions: function(a, b) {
            this.width = h.normalizedLength(a);
            this.height = h.normalizedLength(b);
            if (!this.rawNode) return this;
            a = !1;
            this.rawNode.width != this.width &&
              ((this.rawNode.width = this.width), (a = !0));
            this.rawNode.height != this.height &&
              ((this.rawNode.height = this.height), (a = !0));
            a && this.makeDirty();
            return this;
          },
          getDimensions: function() {
            return this.rawNode
              ? { width: this.rawNode.width, height: this.rawNode.height }
              : null;
          },
          _render: function(a) {
            !this.rawNode ||
              (!a && this.pendingImageCount) ||
              ((a = this.rawNode.getContext("2d")),
              a.clearRect(0, 0, this.rawNode.width, this.rawNode.height),
              this.render(a),
              "pendingRender" in this &&
                (clearTimeout(this.pendingRender), delete this.pendingRender));
          },
          render: function(a) {
            a.save();
            for (var b = 0; b < this.children.length; ++b)
              this.children[b]._render(a);
            a.restore();
          },
          makeDirty: function() {
            this.pendingImagesCount ||
              "pendingRender" in this ||
              this._batch ||
              (this.pendingRender = setTimeout(t.hitch(this, this._render), 0));
          },
          downloadImage: function(a, b) {
            var c = t.hitch(this, this.onImageLoad);
            !this.pendingImageCount++ &&
              "pendingRender" in this &&
              (clearTimeout(this.pendingRender), delete this.pendingRender);
            a.onload = c;
            a.onerror = c;
            a.onabort = c;
            a.src = b;
          },
          onImageLoad: function() {
            --this.pendingImageCount || (this.onImagesLoaded(), this._render());
          },
          onImagesLoaded: function() {},
          getEventSource: function() {
            return null;
          },
          connect: function() {},
          disconnect: function() {},
          on: function() {}
        });
        e.createSurface = function(a, b, c) {
          if (!b && !c) {
            var d = x.position(a);
            b = b || d.w;
            c = c || d.h;
          }
          "number" == typeof b && (b += "px");
          "number" == typeof c && (c += "px");
          d = new e.Surface();
          a = n.byId(a);
          var f = a.ownerDocument.createElement("canvas");
          f.width = h.normalizedLength(b);
          f.height = h.normalizedLength(c);
          a.appendChild(f);
          d.rawNode = f;
          d._parent = a;
          return (d.surface = d);
        };
        var Q = r.Container;
        u = {
          openBatch: function() {
            ++this._batch;
            return this;
          },
          closeBatch: function() {
            this._batch = 0 < this._batch ? --this._batch : 0;
            this._makeDirty();
            return this;
          },
          _makeDirty: function() {
            this._batch || this.surface.makeDirty();
          },
          add: function(a) {
            this._makeDirty();
            return Q.add.apply(this, arguments);
          },
          remove: function(a, b) {
            this._makeDirty();
            return Q.remove.apply(this, arguments);
          },
          clear: function() {
            this._makeDirty();
            return Q.clear.apply(this, arguments);
          },
          getBoundingBox: Q.getBoundingBox,
          _moveChildToFront: function(a) {
            this._makeDirty();
            return Q._moveChildToFront.apply(this, arguments);
          },
          _moveChildToBack: function(a) {
            this._makeDirty();
            return Q._moveChildToBack.apply(this, arguments);
          }
        };
        f = {
          createObject: function(a, b) {
            a = new a();
            a.surface = this.surface;
            a.setShape(b);
            this.add(a);
            return a;
          }
        };
        g(e.Group, u);
        g(e.Group, r.Creator);
        g(e.Group, f);
        g(e.Surface, u);
        g(e.Surface, r.Creator);
        g(e.Surface, f);
        e.fixTarget = function(a, b) {
          return !0;
        };
        return e;
      });
    },
    "dojox/gfx/shape": function() {
      define("./_base dojo/_base/lang dojo/_base/declare dojo/_base/kernel dojo/_base/sniff dojo/on dojo/_base/array dojo/dom-construct dojo/_base/Color ./matrix".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c) {
        function F(b, a) {
          for (var c = b.length - 1; a < c; ) b[a] = b[++a];
          b.length = c;
        }
        var g = (h.shape = {});
        g.Shape = d("dojox.gfx.shape.Shape", null, {
          constructor: function() {
            this.parentMatrix = this.parent = this.bbox = this.strokeStyle = this.fillStyle = this.matrix = this.shape = this.rawNode = null;
            if (v("gfxRegistry")) {
              var b = g.register(this);
              this.getUID = function() {
                return b;
              };
            }
          },
          destroy: function() {
            v("gfxRegistry") && g.dispose(this);
            this.rawNode &&
              "__gfxObject__" in this.rawNode &&
              (this.rawNode.__gfxObject__ = null);
            this.rawNode = null;
          },
          getNode: function() {
            return this.rawNode;
          },
          getShape: function() {
            return this.shape;
          },
          getTransform: function() {
            return this.matrix;
          },
          getFill: function() {
            return this.fillStyle;
          },
          getStroke: function() {
            return this.strokeStyle;
          },
          getParent: function() {
            return this.parent;
          },
          getBoundingBox: function() {
            return this.bbox;
          },
          getTransformedBoundingBox: function() {
            var b = this.getBoundingBox();
            if (!b) return null;
            var a = this._getRealMatrix();
            return [
              c.multiplyPoint(a, b.x, b.y),
              c.multiplyPoint(a, b.x + b.width, b.y),
              c.multiplyPoint(a, b.x + b.width, b.y + b.height),
              c.multiplyPoint(a, b.x, b.y + b.height)
            ];
          },
          getEventSource: function() {
            return this.rawNode;
          },
          setClip: function(b) {
            this.clip = b;
          },
          getClip: function() {
            return this.clip;
          },
          setShape: function(b) {
            this.shape = h.makeParameters(this.shape, b);
            this.bbox = null;
            return this;
          },
          setFill: function(b) {
            if (!b) return (this.fillStyle = null), this;
            var a = null;
            if ("object" == typeof b && "type" in b)
              switch (b.type) {
                case "linear":
                  a = h.makeParameters(h.defaultLinearGradient, b);
                  break;
                case "radial":
                  a = h.makeParameters(h.defaultRadialGradient, b);
                  break;
                case "pattern":
                  a = h.makeParameters(h.defaultPattern, b);
              }
            else a = h.normalizeColor(b);
            this.fillStyle = a;
            return this;
          },
          setStroke: function(b) {
            if (!b) return (this.strokeStyle = null), this;
            if ("string" == typeof b || t.isArray(b) || b instanceof f)
              b = { color: b };
            b = this.strokeStyle = h.makeParameters(h.defaultStroke, b);
            b.color = h.normalizeColor(b.color);
            return this;
          },
          setTransform: function(b) {
            this.matrix = c.clone(b ? c.normalize(b) : c.identity);
            return this._applyTransform();
          },
          _applyTransform: function() {
            return this;
          },
          moveToFront: function() {
            var b = this.getParent();
            b && (b._moveChildToFront(this), this._moveToFront());
            return this;
          },
          moveToBack: function() {
            var b = this.getParent();
            b && (b._moveChildToBack(this), this._moveToBack());
            return this;
          },
          _moveToFront: function() {},
          _moveToBack: function() {},
          applyRightTransform: function(b) {
            return b ? this.setTransform([this.matrix, b]) : this;
          },
          applyLeftTransform: function(b) {
            return b ? this.setTransform([b, this.matrix]) : this;
          },
          applyTransform: function(b) {
            return b ? this.setTransform([this.matrix, b]) : this;
          },
          removeShape: function(b) {
            this.parent && this.parent.remove(this, b);
            return this;
          },
          _setParent: function(b, a) {
            this.parent = b;
            return this._updateParentMatrix(a);
          },
          _updateParentMatrix: function(b) {
            this.parentMatrix = b ? c.clone(b) : null;
            return this._applyTransform();
          },
          _getRealMatrix: function() {
            for (var b = this.matrix, a = this.parent; a; )
              a.matrix && (b = c.multiply(a.matrix, b)), (a = a.parent);
            return b;
          }
        });
        g._eventsProcessing = {
          on: function(b, a) {
            return x(
              this.getEventSource(),
              b,
              g.fixCallback(this, h.fixTarget, a)
            );
          },
          connect: function(b, a, c) {
            "on" == b.substring(0, 2) && (b = b.substring(2));
            return this.on(b, c ? t.hitch(a, c) : a);
          },
          disconnect: function(b) {
            return b.remove();
          }
        };
        g.fixCallback = function(b, a, c, d) {
          d || ((d = c), (c = null));
          if (t.isString(d)) {
            c = c || u.global;
            if (!c[d])
              throw [
                'dojox.gfx.shape.fixCallback: scope["',
                d,
                '"] is null (scope\x3d"',
                c,
                '")'
              ].join("");
            return function(f) {
              return a(f, b) ? c[d].apply(c, arguments || []) : void 0;
            };
          }
          return c
            ? function(f) {
                return a(f, b) ? d.apply(c, arguments || []) : void 0;
              }
            : function(f) {
                return a(f, b) ? d.apply(c, arguments) : void 0;
              };
        };
        t.extend(g.Shape, g._eventsProcessing);
        g.Container = {
          _init: function() {
            this.children = [];
            this._batch = 0;
          },
          openBatch: function() {
            return this;
          },
          closeBatch: function() {
            return this;
          },
          add: function(b) {
            var a = b.getParent();
            a && a.remove(b, !0);
            this.children.push(b);
            return b._setParent(this, this._getRealMatrix());
          },
          remove: function(b, a) {
            for (var c = 0; c < this.children.length; ++c)
              if (this.children[c] == b) {
                a || ((b.parent = null), (b.parentMatrix = null));
                F(this.children, c);
                break;
              }
            return this;
          },
          clear: function(b) {
            for (var a, c = 0; c < this.children.length; ++c)
              (a = this.children[c]),
                (a.parent = null),
                (a.parentMatrix = null),
                b && a.destroy();
            this.children = [];
            return this;
          },
          getBoundingBox: function() {
            if (this.children) {
              var b = null;
              n.forEach(this.children, function(a) {
                var d = a.getBoundingBox();
                d &&
                  ((a = a.getTransform()) && (d = c.multiplyRectangle(a, d)),
                  b
                    ? ((b.x = Math.min(b.x, d.x)),
                      (b.y = Math.min(b.y, d.y)),
                      (b.endX = Math.max(b.endX, d.x + d.width)),
                      (b.endY = Math.max(b.endY, d.y + d.height)))
                    : (b = {
                        x: d.x,
                        y: d.y,
                        endX: d.x + d.width,
                        endY: d.y + d.height
                      }));
              });
              b && ((b.width = b.endX - b.x), (b.height = b.endY - b.y));
              return b;
            }
            return null;
          },
          _moveChildToFront: function(b) {
            for (var a = 0; a < this.children.length; ++a)
              if (this.children[a] == b) {
                F(this.children, a);
                this.children.push(b);
                break;
              }
            return this;
          },
          _moveChildToBack: function(b) {
            for (var a = 0; a < this.children.length; ++a)
              if (this.children[a] == b) {
                F(this.children, a);
                this.children.unshift(b);
                break;
              }
            return this;
          }
        };
        g.Surface = d("dojox.gfx.shape.Surface", null, {
          constructor: function() {
            this._parent = this.rawNode = null;
            this._nodes = [];
            this._events = [];
          },
          destroy: function() {
            n.forEach(this._nodes, r.destroy);
            this._nodes = [];
            n.forEach(this._events, function(b) {
              b && b.remove();
            });
            this._events = [];
            this.rawNode = null;
            if (v("ie"))
              for (; this._parent.lastChild; )
                r.destroy(this._parent.lastChild);
            else this._parent.innerHTML = "";
            this._parent = null;
          },
          getEventSource: function() {
            return this.rawNode;
          },
          _getRealMatrix: function() {
            return null;
          },
          isLoaded: !0,
          onLoad: function(b) {},
          whenLoaded: function(b, a) {
            var c = t.hitch(b, a);
            if (this.isLoaded) c(this);
            else
              x.once(this, "load", function(a) {
                c(a);
              });
          }
        });
        t.extend(g.Surface, g._eventsProcessing);
        g.Rect = d("dojox.gfx.shape.Rect", g.Shape, {
          constructor: function(b) {
            this.shape = h.getDefault("Rect");
            this.rawNode = b;
          },
          getBoundingBox: function() {
            return this.shape;
          }
        });
        g.Ellipse = d("dojox.gfx.shape.Ellipse", g.Shape, {
          constructor: function(b) {
            this.shape = h.getDefault("Ellipse");
            this.rawNode = b;
          },
          getBoundingBox: function() {
            if (!this.bbox) {
              var b = this.shape;
              this.bbox = {
                x: b.cx - b.rx,
                y: b.cy - b.ry,
                width: 2 * b.rx,
                height: 2 * b.ry
              };
            }
            return this.bbox;
          }
        });
        g.Circle = d("dojox.gfx.shape.Circle", g.Shape, {
          constructor: function(b) {
            this.shape = h.getDefault("Circle");
            this.rawNode = b;
          },
          getBoundingBox: function() {
            if (!this.bbox) {
              var b = this.shape;
              this.bbox = {
                x: b.cx - b.r,
                y: b.cy - b.r,
                width: 2 * b.r,
                height: 2 * b.r
              };
            }
            return this.bbox;
          }
        });
        g.Line = d("dojox.gfx.shape.Line", g.Shape, {
          constructor: function(b) {
            this.shape = h.getDefault("Line");
            this.rawNode = b;
          },
          getBoundingBox: function() {
            if (!this.bbox) {
              var b = this.shape;
              this.bbox = {
                x: Math.min(b.x1, b.x2),
                y: Math.min(b.y1, b.y2),
                width: Math.abs(b.x2 - b.x1),
                height: Math.abs(b.y2 - b.y1)
              };
            }
            return this.bbox;
          }
        });
        g.Polyline = d("dojox.gfx.shape.Polyline", g.Shape, {
          constructor: function(b) {
            this.shape = h.getDefault("Polyline");
            this.rawNode = b;
          },
          setShape: function(b, a) {
            b && b instanceof Array
              ? (this.inherited(arguments, [{ points: b }]),
                a &&
                  this.shape.points.length &&
                  this.shape.points.push(this.shape.points[0]))
              : this.inherited(arguments, [b]);
            return this;
          },
          _normalizePoints: function() {
            var b = this.shape.points,
              a = b && b.length;
            if (a && "number" == typeof b[0]) {
              for (var c = [], d = 0; d < a; d += 2)
                c.push({ x: b[d], y: b[d + 1] });
              this.shape.points = c;
            }
          },
          getBoundingBox: function() {
            if (!this.bbox && this.shape.points.length) {
              for (
                var b = this.shape.points,
                  a = b.length,
                  c = b[0],
                  d = c.x,
                  f = c.y,
                  e = c.x,
                  g = c.y,
                  h = 1;
                h < a;
                ++h
              )
                (c = b[h]),
                  d > c.x && (d = c.x),
                  e < c.x && (e = c.x),
                  f > c.y && (f = c.y),
                  g < c.y && (g = c.y);
              this.bbox = { x: d, y: f, width: e - d, height: g - f };
            }
            return this.bbox;
          }
        });
        g.Image = d("dojox.gfx.shape.Image", g.Shape, {
          constructor: function(b) {
            this.shape = h.getDefault("Image");
            this.rawNode = b;
          },
          getBoundingBox: function() {
            return this.shape;
          },
          setStroke: function() {
            return this;
          },
          setFill: function() {
            return this;
          }
        });
        g.Text = d(g.Shape, {
          constructor: function(b) {
            this.fontStyle = null;
            this.shape = h.getDefault("Text");
            this.rawNode = b;
          },
          getFont: function() {
            return this.fontStyle;
          },
          setFont: function(b) {
            this.fontStyle =
              "string" == typeof b
                ? h.splitFontString(b)
                : h.makeParameters(h.defaultFont, b);
            this._setFont();
            return this;
          },
          getBoundingBox: function() {
            var b = null;
            this.getShape().text && (b = h._base._computeTextBoundingBox(this));
            return b;
          }
        });
        g.Creator = {
          createShape: function(b) {
            switch (b.type) {
              case h.defaultPath.type:
                return this.createPath(b);
              case h.defaultRect.type:
                return this.createRect(b);
              case h.defaultCircle.type:
                return this.createCircle(b);
              case h.defaultEllipse.type:
                return this.createEllipse(b);
              case h.defaultLine.type:
                return this.createLine(b);
              case h.defaultPolyline.type:
                return this.createPolyline(b);
              case h.defaultImage.type:
                return this.createImage(b);
              case h.defaultText.type:
                return this.createText(b);
              case h.defaultTextPath.type:
                return this.createTextPath(b);
            }
            return null;
          },
          createGroup: function() {
            return this.createObject(h.Group);
          },
          createRect: function(b) {
            return this.createObject(h.Rect, b);
          },
          createEllipse: function(b) {
            return this.createObject(h.Ellipse, b);
          },
          createCircle: function(b) {
            return this.createObject(h.Circle, b);
          },
          createLine: function(b) {
            return this.createObject(h.Line, b);
          },
          createPolyline: function(b) {
            return this.createObject(h.Polyline, b);
          },
          createImage: function(b) {
            return this.createObject(h.Image, b);
          },
          createText: function(b) {
            return this.createObject(h.Text, b);
          },
          createPath: function(b) {
            return this.createObject(h.Path, b);
          },
          createTextPath: function(b) {
            return this.createObject(h.TextPath, {}).setText(b);
          },
          createObject: function(b, a) {
            return null;
          }
        };
        return g;
      });
    },
    "dojox/gfx/path": function() {
      define([
        "./_base",
        "dojo/_base/lang",
        "dojo/_base/declare",
        "./matrix",
        "./shape"
      ], function(h, t, d, u, v) {
        v = d("dojox.gfx.path.Path", v.Shape, {
          constructor: function(d) {
            this.shape = t.clone(h.defaultPath);
            this.segments = [];
            this.tbbox = null;
            this.absolute = !0;
            this.last = {};
            this.rawNode = d;
            this.segmented = !1;
          },
          setAbsoluteMode: function(d) {
            this._confirmSegmented();
            this.absolute = "string" == typeof d ? "absolute" == d : d;
            return this;
          },
          getAbsoluteMode: function() {
            this._confirmSegmented();
            return this.absolute;
          },
          getBoundingBox: function() {
            this._confirmSegmented();
            return this.bbox && "l" in this.bbox
              ? {
                  x: this.bbox.l,
                  y: this.bbox.t,
                  width: this.bbox.r - this.bbox.l,
                  height: this.bbox.b - this.bbox.t
                }
              : null;
          },
          _getRealBBox: function() {
            this._confirmSegmented();
            if (this.tbbox) return this.tbbox;
            var d = this.bbox,
              h = this._getRealMatrix();
            this.bbox = null;
            for (var r = 0, f = this.segments.length; r < f; ++r)
              this._updateWithSegment(this.segments[r], h);
            h = this.bbox;
            this.bbox = d;
            return (this.tbbox = h
              ? [
                  { x: h.l, y: h.t },
                  { x: h.r, y: h.t },
                  { x: h.r, y: h.b },
                  { x: h.l, y: h.b }
                ]
              : null);
          },
          getLastPosition: function() {
            this._confirmSegmented();
            return "x" in this.last ? this.last : null;
          },
          _applyTransform: function() {
            this.tbbox = null;
            return this.inherited(arguments);
          },
          _updateBBox: function(d, h, r) {
            r && ((h = u.multiplyPoint(r, d, h)), (d = h.x), (h = h.y));
            this.bbox && "l" in this.bbox
              ? (this.bbox.l > d && (this.bbox.l = d),
                this.bbox.r < d && (this.bbox.r = d),
                this.bbox.t > h && (this.bbox.t = h),
                this.bbox.b < h && (this.bbox.b = h))
              : (this.bbox = { l: d, b: h, r: d, t: h });
          },
          _updateWithSegment: function(d, n) {
            var r = d.args,
              f = r.length,
              c;
            switch (d.action) {
              case "M":
              case "L":
              case "C":
              case "S":
              case "Q":
              case "T":
                for (c = 0; c < f; c += 2) this._updateBBox(r[c], r[c + 1], n);
                this.last.x = r[f - 2];
                this.last.y = r[f - 1];
                this.absolute = !0;
                break;
              case "H":
                for (c = 0; c < f; ++c) this._updateBBox(r[c], this.last.y, n);
                this.last.x = r[f - 1];
                this.absolute = !0;
                break;
              case "V":
                for (c = 0; c < f; ++c) this._updateBBox(this.last.x, r[c], n);
                this.last.y = r[f - 1];
                this.absolute = !0;
                break;
              case "m":
                c = 0;
                "x" in this.last ||
                  (this._updateBBox(
                    (this.last.x = r[0]),
                    (this.last.y = r[1]),
                    n
                  ),
                  (c = 2));
                for (; c < f; c += 2)
                  this._updateBBox(
                    (this.last.x += r[c]),
                    (this.last.y += r[c + 1]),
                    n
                  );
                this.absolute = !1;
                break;
              case "l":
              case "t":
                for (c = 0; c < f; c += 2)
                  this._updateBBox(
                    (this.last.x += r[c]),
                    (this.last.y += r[c + 1]),
                    n
                  );
                this.absolute = !1;
                break;
              case "h":
                for (c = 0; c < f; ++c)
                  this._updateBBox((this.last.x += r[c]), this.last.y, n);
                this.absolute = !1;
                break;
              case "v":
                for (c = 0; c < f; ++c)
                  this._updateBBox(this.last.x, (this.last.y += r[c]), n);
                this.absolute = !1;
                break;
              case "c":
                for (c = 0; c < f; c += 6)
                  this._updateBBox(
                    this.last.x + r[c],
                    this.last.y + r[c + 1],
                    n
                  ),
                    this._updateBBox(
                      this.last.x + r[c + 2],
                      this.last.y + r[c + 3],
                      n
                    ),
                    this._updateBBox(
                      (this.last.x += r[c + 4]),
                      (this.last.y += r[c + 5]),
                      n
                    );
                this.absolute = !1;
                break;
              case "s":
              case "q":
                for (c = 0; c < f; c += 4)
                  this._updateBBox(
                    this.last.x + r[c],
                    this.last.y + r[c + 1],
                    n
                  ),
                    this._updateBBox(
                      (this.last.x += r[c + 2]),
                      (this.last.y += r[c + 3]),
                      n
                    );
                this.absolute = !1;
                break;
              case "A":
                for (c = 0; c < f; c += 7)
                  this._updateBBox(r[c + 5], r[c + 6], n);
                this.last.x = r[f - 2];
                this.last.y = r[f - 1];
                this.absolute = !0;
                break;
              case "a":
                for (c = 0; c < f; c += 7)
                  this._updateBBox(
                    (this.last.x += r[c + 5]),
                    (this.last.y += r[c + 6]),
                    n
                  );
                this.absolute = !1;
            }
            d = [d.action];
            for (c = 0; c < f; ++c) d.push(h.formatNumber(r[c], !0));
            if ("string" == typeof this.shape.path)
              this.shape.path += d.join("");
            else
              for (c = 0, f = d.length; c < f; ++c) this.shape.path.push(d[c]);
          },
          _validSegments: {
            m: 2,
            l: 2,
            h: 1,
            v: 1,
            c: 6,
            s: 4,
            q: 4,
            t: 2,
            a: 7,
            z: 0
          },
          _pushSegment: function(d, h) {
            this.tbbox = null;
            var n = this._validSegments[d.toLowerCase()];
            "number" == typeof n &&
              (n
                ? h.length >= n &&
                  ((d = {
                    action: d,
                    args: h.slice(0, h.length - (h.length % n))
                  }),
                  this.segments.push(d),
                  this._updateWithSegment(d))
                : ((d = { action: d, args: [] }),
                  this.segments.push(d),
                  this._updateWithSegment(d)));
          },
          _collectArgs: function(d, h) {
            for (var n = 0; n < h.length; ++n) {
              var f = h[n];
              "boolean" == typeof f
                ? d.push(f ? 1 : 0)
                : "number" == typeof f
                ? d.push(f)
                : f instanceof Array
                ? this._collectArgs(d, f)
                : "x" in f && "y" in f && d.push(f.x, f.y);
            }
          },
          moveTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "M" : "m", d);
            return this;
          },
          lineTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "L" : "l", d);
            return this;
          },
          hLineTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "H" : "h", d);
            return this;
          },
          vLineTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "V" : "v", d);
            return this;
          },
          curveTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "C" : "c", d);
            return this;
          },
          smoothCurveTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "S" : "s", d);
            return this;
          },
          qCurveTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "Q" : "q", d);
            return this;
          },
          qSmoothCurveTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "T" : "t", d);
            return this;
          },
          arcTo: function() {
            this._confirmSegmented();
            var d = [];
            this._collectArgs(d, arguments);
            this._pushSegment(this.absolute ? "A" : "a", d);
            return this;
          },
          closePath: function() {
            this._confirmSegmented();
            this._pushSegment("Z", []);
            return this;
          },
          _confirmSegmented: function() {
            if (!this.segmented) {
              var d = this.shape.path;
              this.shape.path = [];
              this._setPath(d);
              this.shape.path = this.shape.path.join("");
              this.segmented = !0;
            }
          },
          _setPath: function(d) {
            d = t.isArray(d) ? d : d.match(h.pathSvgRegExp);
            this.segments = [];
            this.absolute = !0;
            this.bbox = {};
            this.last = {};
            if (d) {
              for (var n = "", r = [], f = d.length, c = 0; c < f; ++c) {
                var F = d[c],
                  g = parseFloat(F);
                isNaN(g)
                  ? (n && this._pushSegment(n, r), (r = []), (n = F))
                  : r.push(g);
              }
              this._pushSegment(n, r);
            }
          },
          setShape: function(d) {
            this.inherited(arguments, ["string" == typeof d ? { path: d } : d]);
            this.segmented = !1;
            this.segments = [];
            h.lazyPathSegmentation || this._confirmSegmented();
            return this;
          },
          _2PI: 2 * Math.PI
        });
        d = d("dojox.gfx.path.TextPath", v, {
          constructor: function(d) {
            "text" in this || (this.text = t.clone(h.defaultTextPath));
            "fontStyle" in this || (this.fontStyle = t.clone(h.defaultFont));
          },
          getText: function() {
            return this.text;
          },
          setText: function(d) {
            this.text = h.makeParameters(
              this.text,
              "string" == typeof d ? { text: d } : d
            );
            this._setText();
            return this;
          },
          getFont: function() {
            return this.fontStyle;
          },
          setFont: function(d) {
            this.fontStyle =
              "string" == typeof d
                ? h.splitFontString(d)
                : h.makeParameters(h.defaultFont, d);
            this._setFont();
            return this;
          }
        });
        return (h.path = { Path: v, TextPath: d });
      });
    },
    "dojox/gfx/arc": function() {
      define(["./_base", "dojo/_base/lang", "./matrix"], function(h, t, d) {
        function u(c) {
          var d = Math.cos(c);
          c = Math.sin(c);
          var f = {
            x: d + (4 / 3) * (1 - d),
            y: c - ((4 / 3) * d * (1 - d)) / c
          };
          return {
            s: { x: d, y: -c },
            c1: { x: f.x, y: -f.y },
            c2: f,
            e: { x: d, y: c }
          };
        }
        var v = 2 * Math.PI,
          x = Math.PI / 4,
          n = Math.PI / 8,
          r = x + n,
          f = u(n);
        return (h.arc = {
          unitArcAsBezier: u,
          curvePI4: f,
          arcAsBezier: function(c, h, g, b, a, k, q, m) {
            a = !!a;
            k = !!k;
            var e = d._degToRad(b);
            b = h * h;
            var A = g * g,
              H = d.multiplyPoint(d.rotate(-e), {
                x: (c.x - q) / 2,
                y: (c.y - m) / 2
              }),
              F = H.x * H.x,
              t = H.y * H.y;
            b = Math.sqrt((b * A - b * t - A * F) / (b * t + A * F));
            isNaN(b) && (b = 0);
            b = { x: (b * h * H.y) / g, y: (-b * g * H.x) / h };
            a == k && (b = { x: -b.x, y: -b.y });
            b = d.multiplyPoint(
              [d.translate((c.x + q) / 2, (c.y + m) / 2), d.rotate(e)],
              b
            );
            h = d.normalize([
              d.translate(b.x, b.y),
              d.rotate(e),
              d.scale(h, g)
            ]);
            b = d.invert(h);
            c = d.multiplyPoint(b, c);
            m = d.multiplyPoint(b, q, m);
            q = Math.atan2(c.y, c.x);
            b = q - Math.atan2(m.y, m.x);
            k && (b = -b);
            0 > b ? (b += v) : b > v && (b -= v);
            g = n;
            m = f;
            g = k ? g : -g;
            c = [];
            for (a = b; 0 < a; a -= x)
              a < r && ((g = a / 2), (m = u(g)), (g = k ? g : -g), (a = 0)),
                (H = d.normalize([h, d.rotate(q + g)])),
                k
                  ? ((b = d.multiplyPoint(H, m.c1)),
                    (e = d.multiplyPoint(H, m.c2)),
                    (H = d.multiplyPoint(H, m.e)))
                  : ((b = d.multiplyPoint(H, m.c2)),
                    (e = d.multiplyPoint(H, m.c1)),
                    (H = d.multiplyPoint(H, m.s))),
                c.push([b.x, b.y, e.x, e.y, H.x, H.y]),
                (q += 2 * g);
            return c;
          }
        });
      });
    },
    "dojox/gfx/decompose": function() {
      define(["./_base", "dojo/_base/lang", "./matrix"], function(h, t, d) {
        function u(d, c) {
          return Math.abs(d - c) <= 1e-6 * (Math.abs(d) + Math.abs(c));
        }
        function v(d, c, h, g) {
          if (!isFinite(d)) return h;
          if (!isFinite(h)) return d;
          c = Math.abs(c);
          g = Math.abs(g);
          return (c * d + g * h) / (c + g);
        }
        function x(f) {
          f = d.normalize(f);
          var c = -f.xx - f.yy,
            h = f.xx * f.yy - f.xy * f.yx,
            g = Math.sqrt(c * c - 4 * h),
            c = -(c + (0 > c ? -g : g)) / 2,
            h = h / c,
            g = f.xy / (c - f.xx),
            b = 1,
            a = f.xy / (h - f.xx),
            k = 1;
          u(c, h) && ((g = 1), (a = b = 0), (k = 1));
          isFinite(g) ||
            ((g = 1),
            (b = (c - f.xx) / f.xy),
            isFinite(b) ||
              ((g = (c - f.yy) / f.yx),
              (b = 1),
              isFinite(g) || ((g = 1), (b = f.yx / (c - f.yy)))));
          isFinite(a) ||
            ((a = 1),
            (k = (h - f.xx) / f.xy),
            isFinite(k) ||
              ((a = (h - f.yy) / f.yx),
              (k = 1),
              isFinite(a) || ((a = 1), (k = f.yx / (h - f.yy)))));
          f = Math.sqrt(g * g + b * b);
          var q = Math.sqrt(a * a + k * k);
          isFinite((g /= f)) || (g = 0);
          isFinite((b /= f)) || (b = 0);
          isFinite((a /= q)) || (a = 0);
          isFinite((k /= q)) || (k = 0);
          return {
            value1: c,
            value2: h,
            vector1: { x: g, y: b },
            vector2: { x: a, y: k }
          };
        }
        function n(d, c) {
          var f = 0 > d.xx * d.yy || 0 < d.xy * d.yx ? -1 : 1,
            g = (c.angle1 =
              (Math.atan2(d.yx, d.yy) + Math.atan2(-f * d.xy, f * d.xx)) / 2),
            f = Math.cos(g),
            g = Math.sin(g);
          c.sx = v(d.xx / f, f, -d.xy / g, g);
          c.sy = v(d.yy / f, f, d.yx / g, g);
          return c;
        }
        function r(d, c) {
          var f = 0 > d.xx * d.yy || 0 < d.xy * d.yx ? -1 : 1,
            g = (c.angle2 =
              (Math.atan2(f * d.yx, f * d.xx) + Math.atan2(-d.xy, d.yy)) / 2),
            f = Math.cos(g),
            g = Math.sin(g);
          c.sx = v(d.xx / f, f, d.yx / g, g);
          c.sy = v(d.yy / f, f, -d.xy / g, g);
          return c;
        }
        return (h.decompose = function(f) {
          var c = d.normalize(f);
          f = { dx: c.dx, dy: c.dy, sx: 1, sy: 1, angle1: 0, angle2: 0 };
          if (u(c.xy, 0) && u(c.yx, 0))
            return t.mixin(f, { sx: c.xx, sy: c.yy });
          if (u(c.xx * c.yx, -c.xy * c.yy)) return n(c, f);
          if (u(c.xx * c.xy, -c.yx * c.yy)) return r(c, f);
          var h,
            g = new d.Matrix2D(c);
          h = t.mixin(g, { dx: 0, dy: 0, xy: g.yx, yx: g.xy });
          g = x([c, h]);
          h = x([h, c]);
          g = new d.Matrix2D({
            xx: g.vector1.x,
            xy: g.vector2.x,
            yx: g.vector1.y,
            yy: g.vector2.y
          });
          h = new d.Matrix2D({
            xx: h.vector1.x,
            xy: h.vector1.y,
            yx: h.vector2.x,
            yy: h.vector2.y
          });
          c = new d.Matrix2D([d.invert(g), c, d.invert(h)]);
          n(h, f);
          c.xx *= f.sx;
          c.yy *= f.sy;
          r(g, f);
          c.xx *= f.sx;
          c.yy *= f.sy;
          return t.mixin(f, { sx: c.xx, sy: c.yy });
        });
      });
    },
    "dojox/gfx/bezierutils": function() {
      define(["./_base"], function(h) {
        h = h.bezierutils = {};
        h.tAtLength = function(h, r) {
          var f = 0,
            c = 6 == h.length,
            n = 0,
            g = 0,
            b = c ? u : x,
            a = function(k, q) {
              for (var m = 0, e = 0; e < k.length - 2; e += 2)
                m += d(k[e], k[e + 1], k[e + 2], k[e + 3]);
              e = c ? d(h[0], h[1], h[4], h[5]) : d(h[0], h[1], h[6], h[7]);
              m - e > q || n + m > r + q
                ? (++g,
                  (k = b(k, 0.5)),
                  a(k[0], q),
                  Math.abs(n - r) <= q || a(k[1], q))
                : ((n += m), (f += 1 / (1 << g)));
            };
          r && a(h, 0.5);
          return f;
        };
        var t = (h.computeLength = function(h) {
            for (var n = 6 == h.length, f = 0, c = 0; c < h.length - 2; c += 2)
              f += d(h[c], h[c + 1], h[c + 2], h[c + 3]);
            c = n ? d(h[0], h[1], h[4], h[5]) : d(h[0], h[1], h[6], h[7]);
            0.1 < f - c &&
              ((h = n ? u(h, 0.5) : v(h, 0.5)),
              (f = t(h[0], n)),
              (f += t(h[1], n)));
            return f;
          }),
          d = (h.distance = function(d, h, f, c) {
            return Math.sqrt((f - d) * (f - d) + (c - h) * (c - h));
          }),
          u = function(d, h) {
            var f = 1 - h,
              c = f * f,
              n = h * h,
              g = d[0],
              b = d[1],
              a = d[2],
              k = d[3],
              q = d[4];
            d = d[5];
            var m = c * g + 2 * f * h * a + n * q,
              c = c * b + 2 * f * h * k + n * d;
            return [
              [g, b, f * g + h * a, f * b + h * k, m, c],
              [m, c, f * a + h * q, f * k + h * d, q, d]
            ];
          },
          v = function(d, h) {
            var f = 1 - h,
              c = f * f,
              n = c * f,
              g = h * h,
              b = g * h,
              a = d[0],
              k = d[1],
              q = d[2],
              m = d[3],
              e = d[4],
              A = d[5],
              r = d[6];
            d = d[7];
            var u = n * a + 3 * c * h * q + 3 * f * g * e + b * r,
              n = n * k + 3 * c * h * m + 3 * f * g * A + b * d;
            return [
              [
                a,
                k,
                f * a + h * q,
                f * k + h * m,
                c * a + 2 * f * h * q + g * e,
                c * k + 2 * f * h * m + g * A,
                u,
                n
              ],
              [
                u,
                n,
                c * q + 2 * f * h * e + g * r,
                c * m + 2 * f * h * A + g * d,
                f * e + h * r,
                f * A + h * d,
                r,
                d
              ]
            ];
          },
          x = (h.splitBezierAtT = function(d, h) {
            return 6 == d.length ? u(d, h) : v(d, h);
          });
        return h;
      });
    },
    "dojox/json/query": function() {
      define([
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojox",
        "dojo/_base/array"
      ], function(h, t, d) {
        t.getObject("json", !0, d);
        d.json._slice = function(d, h, t, n) {
          var r = d.length,
            f = [];
          t = t || r;
          h = 0 > h ? Math.max(0, h + r) : Math.min(r, h);
          for (t = 0 > t ? Math.max(0, t + r) : Math.min(r, t); h < t; h += n)
            f.push(d[h]);
          return f;
        };
        d.json._find = function(d, h) {
          function t(d) {
            h &&
              (!0 !== h || d instanceof Array
                ? d[h] && n.push(d[h])
                : n.push(d));
            for (var c in d) {
              var f = d[c];
              h ? f && "object" == typeof f && t(f) : n.push(f);
            }
          }
          var n = [];
          if (h instanceof Array) {
            if (1 == h.length) return d[h[0]];
            for (var r = 0; r < h.length; r++) n.push(d[h[r]]);
          } else t(d);
          return n;
        };
        d.json._distinctFilter = function(d, h) {
          for (var t = [], n = {}, r = 0, f = d.length; r < f; ++r) {
            var c = d[r];
            h(c, r, d) &&
              ("object" == typeof c && c
                ? c.__included || ((c.__included = !0), t.push(c))
                : n[c + typeof c] || ((n[c + typeof c] = !0), t.push(c)));
          }
          r = 0;
          for (f = t.length; r < f; ++r) t[r] && delete t[r].__included;
          return t;
        };
        return (d.json.query = function(d, h) {
          function t(c, b, a, d, f, h, e, A) {
            return r[A].match(/[\*\?]/) || "~" == e
              ? "/^" +
                  r[A].substring(1, r[A].length - 1)
                    .replace(/\\([btnfr\\"'])|([^\w\*\?])/g, "\\$1$2")
                    .replace(/([\*\?])/g, "[\\w\\W]$1") +
                  ("~" == e ? "$/i" : "$/") +
                  ".test(" +
                  b +
                  ")"
              : c;
          }
          var n = 0,
            r = [];
          d = d.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g, function(c) {
            n += "[" == c ? 1 : "]" == c ? -1 : 0;
            return "]" == c && 0 < n
              ? "`]"
              : '"' == c.charAt(0) || "'" == c.charAt(0)
              ? "`" + (r.push(c) - 1)
              : c;
          });
          var f = "";
          d.replace(
            /(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/,
            function() {
              throw Error("Unsafe function call");
            }
          );
          d = d
            .replace(/([^<>=]=)([^=])/g, "$1\x3d$2")
            .replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g, function(c) {
              return "." == c.charAt(0)
                ? c
                : "@" == c
                ? "$obj"
                : (c.match(/:|^(\$|Math|true|false|null)$/) ? "" : "$obj.") + c;
            })
            .replace(
              /\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,
              function(c, b, a) {
                return (b = c.match(
                  /^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/
                ))
                  ? ((a = ""),
                    c.match(/^\./) &&
                      ((f = "dojox.json._find(" + f), (a = ",true)")),
                    (f =
                      (b[1].match(/\=/)
                        ? "dojo.map"
                        : b[1].match(/\^/)
                        ? "dojox.json._distinctFilter"
                        : "dojo.filter") +
                      "(" +
                      f),
                    a + ",function($obj){return " + b[2] + "})")
                  : (b = c.match(/^\[\s*([\/\\].*)\]/))
                  ? ".concat().sort(function(a,b){" +
                    b[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g, function(
                      a,
                      b,
                      c
                    ) {
                      return (
                        "var av\x3d " +
                        c.replace(/\$obj/, "a") +
                        ",bv\x3d " +
                        c.replace(/\$obj/, "b") +
                        ";if(av\x3ebv||bv\x3d\x3dnull){return " +
                        ("/" == b ? 1 : -1) +
                        ";}\nif(bv\x3eav||av\x3d\x3dnull){return " +
                        ("/" == b ? -1 : 1) +
                        ";}\n"
                      );
                    }) +
                    "return 0;})"
                  : (b = c.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/))
                  ? ((f = "dojox.json._slice(" + f),
                    "," +
                      (b[1] || 0) +
                      "," +
                      (b[2] || 0) +
                      "," +
                      (b[3] || 1) +
                      ")")
                  : c.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)
                  ? ((f = "dojox.json._find(" + f),
                    ("." == c.charAt(1)
                      ? ",'" + a + "'"
                      : c.match(/,/)
                      ? "," + c
                      : "") + ")")
                  : c;
              }
            )
            .replace(
              /(\$obj\s*((\.\s*[\w_$]+\s*)|(\[\s*`([0-9]+)\s*`\]))*)(==|~)\s*`([0-9]+)/g,
              t
            )
            .replace(
              /`([0-9]+)\s*(==|~)\s*(\$obj\s*((\.\s*[\w_$]+)|(\[\s*`([0-9]+)\s*`\]))*)/g,
              function(c, b, a, d, f, h, e, A) {
                return t(c, d, f, h, e, A, a, b);
              }
            );
          d =
            f +
            ("$" == d.charAt(0) ? "" : "$") +
            d.replace(/`([0-9]+|\])/g, function(c, b) {
              return "]" == b ? "]" : r[b];
            });
          for (
            var c = eval(
                "1\x26\x26function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj\x3d$;return " +
                  d +
                  "}"
              ),
              u = 0;
            u < arguments.length - 1;
            u++
          )
            arguments[u] = arguments[u + 1];
          return h ? c.apply(this, arguments) : c;
        });
      });
    },
    "esri/tasks/PrintParameters": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(h, t, d, u) {
        h = h(null, {
          declaredClass: "esri.tasks.PrintParameters",
          map: null,
          template: null,
          outSpatialReference: null,
          extraParameters: null
        });
        d("extend-esri") && t.setObject("tasks.PrintParameters", h, u);
        return h;
      });
    },
    "esri/toolbars/edit": function() {
      define("require dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/Color dojo/has dojo/dom-construct dojo/dom-style ../kernel ../lang ../sniff ./_toolbar ./_Box ./_GraphicMover ./_VertexEditor ./TextEditor ../symbols/SimpleMarkerSymbol ../symbols/SimpleLineSymbol ../symbols/TextSymbol ../graphic".split(
        " "
      ), function(
        h,
        t,
        d,
        u,
        v,
        x,
        n,
        r,
        f,
        c,
        F,
        g,
        b,
        a,
        k,
        q,
        m,
        e,
        A,
        H,
        I
      ) {
        var E = t(b, {
          declaredClass: "esri.toolbars.Edit",
          constructor: function(a, b) {
            this._map = a;
            this._tool = 0;
            if (this._map.loaded) this._scratchGL = a.graphics;
            else
              var c = u.connect(this._map, "onLoad", this, function() {
                u.disconnect(c);
                c = null;
                this._scratchGL = this._map.graphics;
              });
            a = n("esri-mobile");
            this._defaultOptions = d.mixin(
              {
                vertexSymbol: new e(
                  e.STYLE_CIRCLE,
                  a ? 20 : 12,
                  new A(A.STYLE_SOLID, new x([0, 0, 0, 0.5]), 1),
                  new x([128, 128, 128])
                ),
                ghostVertexSymbol: new e(
                  e.STYLE_CIRCLE,
                  a ? 18 : 10,
                  new A(A.STYLE_SOLID, new x([0, 0, 0, 0.5]), 1),
                  new x([255, 255, 255, 0.75])
                ),
                ghostLineSymbol: new A(A.STYLE_DOT, new x([128, 128, 128]), 2),
                allowDeleteVertices: !0,
                allowAddVertices: !0,
                rotateHandleOffset: a ? 24 : 16,
                boxLineSymbol: new A(A.STYLE_DASH, new x([64, 64, 64]), 1),
                boxHandleSymbol: new e(
                  e.STYLE_SQUARE,
                  a ? 16 : 9,
                  new A(A.STYLE_SOLID, new x([0, 0, 0, 0.5]), 1),
                  new x([255, 255, 255, 0.75])
                ),
                textAnchorSymbol: new e(
                  e.STYLE_CIRCLE,
                  10,
                  null,
                  new x([255, 0, 0])
                )
              },
              b || {}
            );
          },
          activate: function(a, b, c) {
            this.deactivate();
            this._graphic = b;
            this._options = d.mixin(d.mixin({}, this._defaultOptions), c || {});
            var e = E.MOVE;
            c = E.EDIT_VERTICES;
            var f = E.SCALE,
              k = E.ROTATE,
              g = E.EDIT_TEXT,
              h = !1,
              q = !1,
              m = !1,
              A = this._map,
              n = A.spatialReference,
              l = b.geometry.spatialReference;
            this._geo = !(
              !n ||
              !l ||
              n.equals(l) ||
              !n.isWebMercator() ||
              4326 !== l.wkid
            );
            this._isTextPoint = this._prepareTextSymbolEditing(b, a);
            (a & e) === e && (h = this._enableMove(b));
            e = (a & f) === f;
            k = (a & k) === k;
            if (e || k) m = this._enableBoxEditing(b, e, k);
            (a & c) === c && (q = this._enableVertexEditing(b));
            (a & g) === g && this._enableTextEditing(b);
            if (!(h || q || m))
              throw Error(
                "[esri.toolbars.Edit::activate] Unable to activate the tool. Check if the tool is valid for the given geometry type."
              );
            if ((this._tool = a))
              (this._mapPanEndHandle = u.connect(
                A,
                "onPanEnd",
                this,
                this._mapPanEndHandler
              )),
                (this._mapExtChgHandle = u.connect(
                  A,
                  "onExtentChange",
                  this,
                  this._mapExtentChangeHandler
                )),
                this.onActivate(this._tool, b);
            A.snappingManager &&
              (h || q) &&
              A.snappingManager._startSelectionLayerQuery();
          },
          deactivate: function() {
            this._isTextPoint = null;
            var a = this._tool,
              b = this._graphic;
            if (a) {
              var c = !!this._modified;
              this._clear();
              u.disconnect(this._mapPanEndHandle);
              u.disconnect(this._mapExtChgHandle);
              this._graphic = this._geo = this._mapPanEndHandle = this._mapExtChgHandle = null;
              this.onDeactivate(a, b, { isModified: c });
              this._map.snappingManager &&
                this._map.snappingManager._stopSelectionLayerQuery();
            }
          },
          refresh: function() {
            this._refreshMoveables(!0);
          },
          getCurrentState: function() {
            return {
              tool: this._tool,
              graphic: this._graphic,
              isModified: !!this._modified
            };
          },
          onActivate: function(a, b) {},
          onDeactivate: function(a, b, c) {},
          onGraphicMoveStart: function(a) {},
          onGraphicFirstMove: function(a) {
            this._modified = !0;
          },
          onGraphicMove: function(a, b) {},
          onGraphicMoveStop: function(a, b) {},
          onGraphicClick: function(a, b) {},
          onVertexMoveStart: function(a, b) {},
          onVertexFirstMove: function(a, b) {
            this._modified = !0;
          },
          onVertexMove: function(a, b, c) {},
          onVertexMoveStop: function(a, b, c) {},
          onVertexAdd: function(a, b) {
            this._modified = !0;
          },
          onVertexClick: function(a, b) {},
          onVertexMouseOver: function(a, b) {},
          onVertexMouseOut: function(a, b) {},
          onVertexDelete: function(a, b) {
            this._modified = !0;
          },
          onTextEditStart: function(a, b) {},
          onTextEditEnd: function(a) {},
          onScaleStart: function(a) {},
          onScaleFirstMove: function(a) {
            this._modified = !0;
          },
          onScale: function(a, b) {},
          onScaleStop: function(a, b) {},
          onRotateStart: function(a) {},
          onRotateFirstMove: function(a) {
            this._modified = !0;
          },
          onRotate: function(a, b) {},
          onRotateStop: function(a, b) {},
          _eventMap: {
            activate: ["tool", "graphic"],
            deactivate: ["tool", "graphic", "info"],
            "graphic-move-start": ["graphic"],
            "graphic-first-move": ["graphic"],
            "graphic-move": ["graphic", "transform"],
            "graphic-move-stop": ["graphic", "transform"],
            "graphic-click": ["graphic", "info"],
            "vertex-move-start": ["graphic", "vertexinfo"],
            "vertex-first-move": ["graphic", "vertexinfo"],
            "vertex-move": ["graphic", "vertexinfo", "transform"],
            "vertex-move-stop": ["graphic", "vertexinfo", "transform"],
            "vertex-add": ["graphic", "vertexinfo"],
            "vertex-click": ["graphic", "vertexinfo"],
            "vertex-mouse-over": ["graphic", "vertexinfo"],
            "vertex-mouse-out": ["graphic", "vertexinfo"],
            "vertex-delete": ["graphic", "vertexinfo"],
            "scale-start": ["graphic"],
            "scale-first-move": ["graphic"],
            scale: ["graphic", "info"],
            "scale-stop": ["graphic", "info"],
            "rotate-start": ["graphic"],
            "rotate-first-move": ["graphic"],
            rotate: ["graphic", "info"],
            "rotate-stop": ["graphic", "info"]
          },
          _prepareTextSymbolEditing: function(a, b) {
            if (
              "point" === a.geometry.type ||
              "multipoint" === a.geometry.type
            ) {
              var c = a.getLayer(),
                d = c.renderer,
                c = a.symbol || c._getSymbol(a);
              !c &&
                (d.hasVisualVariables("sizeInfo", !1) ||
                  d.hasVisualVariables("colorInfo", !1) ||
                  d.hasVisualVariables("opacityInfo", !1)) &&
                d.addBreak &&
                d.infos &&
                1 === d.infos.length &&
                (c = d.infos[0].symbol || d.defaultSymbol);
              if (c && "textsymbol" === c.type) {
                if (
                  (b & E.SCALE) === E.SCALE ||
                  (b & E.ROTATE) === E.ROTATE ||
                  (b & E.EDIT_TEXT) === E.EDIT_TEXT
                ) {
                  a.setSymbol(new H(c.toJson()));
                  var e = this;
                  this._textSymbolEditor
                    ? (this._textSymbolEditor.createForm(a),
                      this._textSymbolEditor.show())
                    : this._options && this._options.textSymbolEditor
                    ? ((this._textSymbolEditor = this._options.textSymbolEditor),
                      this._textSymbolEditor.on("symbol-change", function() {
                        e._boxEditor && e._boxEditor.refresh();
                      }))
                    : h(["../dijit/SymbolEditor"], function(b) {
                        if (!e._textSymbolEditor) {
                          var c;
                          c = e._options.textSymbolEditorHolder
                            ? r.create(
                                "div",
                                null,
                                e._options.textSymbolEditorHolder
                              )
                            : r.create("div", null, e._map.root);
                          e._textSymbolEditor = new b({ graphic: a }, c);
                          b = e._textSymbolEditor.domNode.parentNode.id;
                          f.set(e._textSymbolEditor.domNode, {
                            position:
                              "map_root" === b ? "absolute" : "relative",
                            left:
                              "map_root" === b
                                ? e._map.width / 2 - 100 + "px"
                                : "5px",
                            top: "20px",
                            "z-index": 50
                          });
                          e._textSymbolEditor.startup();
                          e._textSymbolEditor.createForm(a);
                          e._textSymbolEditor.show();
                          e._textSymbolEditor.on("symbol-change", function() {
                            e._boxEditor && e._boxEditor.refresh();
                          });
                        }
                      });
                }
                if (
                  (b & E.MOVE) === E.MOVE ||
                  (b & E.ROTATE) === E.ROTATE ||
                  (b & E.SCALE) === E.SCALE
                )
                  (this._textAnchor = new I(
                    a.geometry,
                    this._options.textAnchorSymbol
                  )),
                    this._scratchGL.add(this._textAnchor);
                return !0;
              }
            }
            return !1;
          },
          _enableMove: function(a) {
            var b = this._map;
            switch (a.geometry.type) {
              case "point":
              case "polyline":
              case "polygon":
                return (
                  (this._graphicMover = new k(a, b, this, this._textAnchor)), !0
                );
            }
            return !1;
          },
          _enableVertexEditing: function(a) {
            var b = this._map;
            switch (a.geometry.type) {
              case "multipoint":
              case "polyline":
              case "polygon":
                return (this._vertexEditor = q.create(a, b, this)), !0;
            }
            return !1;
          },
          _enableBoxEditing: function(b, c, d) {
            var e = this._map,
              f = b.geometry.type;
            return "polyline" === f || "polygon" === f || this._isTextPoint
              ? ((this._boxEditor = new a(
                  b,
                  e,
                  this,
                  c,
                  d,
                  this._options.uniformScaling,
                  this._isTextPoint
                )),
                !0)
              : !1;
          },
          _enableTextEditing: function(a) {
            return this._isTextPoint
              ? ((this._textEditor = new m(a, this._map, this)),
                u.connect(
                  this._textEditor,
                  "onEditStart",
                  d.hitch(this, function() {
                    this._textAnchor &&
                      (this._textAnchor.getLayer().remove(this._textAnchor),
                      (this._textAnchor = null));
                    this._map.disableKeyboardNavigation();
                    this._disableMove();
                    this._disableBoxEditing();
                  })
                ),
                !0)
              : !1;
          },
          _disableMove: function() {
            var a = this._graphicMover;
            a && (a.destroy(), (this._graphicMover = null));
          },
          _disableVertexEditing: function() {
            var a = this._vertexEditor;
            a && (a.destroy(), (this._vertexEditor = null));
          },
          _disableBoxEditing: function() {
            var a = this._boxEditor;
            a && (a.destroy(), (this._boxEditor = null));
          },
          _disableTextEditing: function() {
            this._textEditor &&
              (this._textEditor.destroy(), (this._textEditor = null));
            this._map.enableKeyboardNavigation();
          },
          _disableSymbolEditing: function() {
            this._textSymbolEditor && this._textSymbolEditor.hide();
          },
          _clear: function() {
            this._disableMove();
            this._disableVertexEditing();
            this._disableBoxEditing();
            this._disableTextEditing();
            this._disableSymbolEditing();
            this._textAnchor &&
              (this._textAnchor.getLayer().remove(this._textAnchor),
              (this._textAnchor = null));
            this._tool = 0;
            this._modified = !1;
          },
          _mapPanEndHandler: function() {
            this._refreshMoveables();
          },
          _mapExtentChangeHandler: function(a, b, c) {
            c && this._refreshMoveables();
          },
          _refreshMoveables: function(a) {
            var b = v.filter(
              [this._graphicMover, this._vertexEditor, this._boxEditor],
              F.isDefined
            );
            v.forEach(b, function(b) {
              b.refresh(a);
            });
          },
          _beginOperation: function(a) {
            v.forEach(this._getAffectedTools(a), function(a) {
              a.suspend();
            });
          },
          _endOperation: function(a) {
            v.forEach(this._getAffectedTools(a), function(a) {
              a.resume();
            });
          },
          _getAffectedTools: function(a) {
            var b = [];
            switch (a) {
              case "MOVE":
                b = [this._vertexEditor, this._boxEditor];
                break;
              case "VERTICES":
                b = [this._boxEditor];
                break;
              case "BOX":
                b = [this._vertexEditor];
            }
            return (b = v.filter(b, F.isDefined));
          }
        });
        d.mixin(E, {
          MOVE: 1,
          EDIT_VERTICES: 2,
          SCALE: 4,
          ROTATE: 8,
          EDIT_TEXT: 16
        });
        n("extend-esri") && d.setObject("toolbars.Edit", E, c);
        return E;
      });
    },
    "esri/toolbars/_Box": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/Color dojo/has dojo/dom-style dojox/gfx/Moveable dojox/gfx/matrix ../kernel ../lang ../geometry/Point ../geometry/Polyline ../symbols/SimpleMarkerSymbol ../geometry/webMercatorUtils ../geometry/jsonUtils ../graphic".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g, b, a, k, q, m) {
        h = h(null, {
          declaredClass: "esri.toolbars._Box",
          constructor: function(a, b, c, d, f, k, g) {
            this._graphic = a;
            this._map = b;
            this._toolbar = c;
            this._scale = d;
            this._rotate = f;
            this._defaultEventArgs = {};
            this._scaleEvent = "Scale";
            this._rotateEvent = "Rotate";
            this._uniformScaling = k;
            a = c._options;
            this._markerSymbol = a.boxHandleSymbol;
            this._lineSymbol = a.boxLineSymbol;
            this._moveStartHandler = t.hitch(this, this._moveStartHandler);
            this._firstMoveHandler = t.hitch(this, this._firstMoveHandler);
            this._moveStopHandler = t.hitch(this, this._moveStopHandler);
            this._moveHandler = t.hitch(this, this._moveHandler);
            this._isTextPoint = g;
            this._init();
          },
          destroy: function() {
            this._cleanUp();
            this._graphic = this._map = this._toolbar = this._markerSymbol = this._lineSymbol = null;
          },
          refresh: function() {
            this._draw();
          },
          suspend: function() {
            d.forEach(this._getAllGraphics(), function(a) {
              a.hide();
            });
          },
          resume: function() {
            d.forEach(this._getAllGraphics(), function(a) {
              a.show();
            });
            this._draw();
          },
          _init: function() {
            this._draw();
          },
          _cleanUp: function() {
            this._connects && d.forEach(this._connects, u.disconnect);
            var a = this._toolbar._scratchGL;
            this._anchors &&
              d.forEach(this._anchors, function(b) {
                a.remove(b.graphic);
                (b = b.moveable) && b.destroy();
              });
            this._box && a.remove(this._box);
            this._box = this._anchors = this._connects = null;
          },
          _draw: function() {
            if (this._graphic.getDojoShape()) {
              var a = this._map,
                c = this._toolbar._scratchGL,
                f = this._getBoxCoords(),
                k = new b(a.spatialReference),
                h = t.clone(
                  d.filter(f, function(a, b) {
                    return 8 !== b && 0 === b % 2;
                  })
                );
              h[0] && h.push([h[0][0], h[0][1]]);
              k.addPath(h);
              this._rotate && k.addPath([f[1], f[8]]);
              this._box
                ? this._box.setGeometry(k)
                : ((this._box = new m(k, this._lineSymbol)), c.add(this._box));
              this._anchors
                ? d.forEach(
                    this._anchors,
                    function(b, c) {
                      this._scale || (c = 8);
                      var d = new g(f[c], a.spatialReference);
                      b.graphic.setGeometry(d);
                      var d = b.moveable,
                        e = b.graphic.getDojoShape();
                      e &&
                        (d
                          ? e !== d.shape &&
                            (d.destroy(),
                            (b.moveable = this._getMoveable(b.graphic, c)))
                          : (b.moveable = this._getMoveable(b.graphic, c)));
                    },
                    this
                  )
                : ((this._anchors = []),
                  (this._connects = []),
                  d.forEach(
                    f,
                    function(b, d) {
                      (!this._scale && 8 > d) ||
                        ((b = new g(b, a.spatialReference)),
                        (b = new m(b, this._markerSymbol)),
                        this._isTextPoint && 1 === d % 2 && b.hide(),
                        c.add(b),
                        this._anchors.push({
                          graphic: b,
                          moveable: this._getMoveable(b, d)
                        }));
                    },
                    this
                  ));
            } else this._cleanUp();
          },
          _getBoxCoords: function(a) {
            var b = this._map,
              c,
              e = [],
              f,
              k,
              g;
            if (this._isTextPoint) {
              c = this._graphic.getNode().getBoundingClientRect();
              var h = b.__container.getBoundingClientRect();
              c = [
                { x: c.left - h.left, y: c.top - h.top },
                { x: c.right - h.left, y: c.top - h.top },
                { x: c.right - h.left, y: c.bottom - h.top },
                { x: c.left - h.left, y: c.bottom - h.top }
              ];
            } else c = this._getTransformedBoundingBox(this._graphic);
            d.forEach(c, function(c, d, h) {
              f = c;
              (k = h[d + 1]) || (k = h[0]);
              g = { x: (f.x + k.x) / 2, y: (f.y + k.y) / 2 };
              a || ((f = b.toMap(f)), (g = b.toMap(g)));
              e.push([f.x, f.y]);
              e.push([g.x, g.y]);
            });
            this._rotate &&
              ((c = t.clone(e[1])),
              (c = a
                ? { x: c[0], y: c[1] }
                : b.toScreen({
                    x: c[0],
                    y: c[1],
                    spatialReference: b.spatialReference
                  })),
              (c.y -= this._toolbar._options.rotateHandleOffset),
              a || (c = b.toMap(c)),
              e.push([c.x, c.y]));
            return e;
          },
          _getTransformedBoundingBox: function(a) {
            var b = this._map,
              c = a.geometry.getExtent(),
              d = a.geometry.spatialReference;
            a = new g(c.xmin, c.ymax, d);
            c = new g(c.xmax, c.ymin, d);
            a = b.toScreen(a);
            c = b.toScreen(c);
            return [
              { x: a.x, y: a.y },
              { x: c.x, y: a.y },
              { x: c.x, y: c.y },
              { x: a.x, y: c.y }
            ];
          },
          _getAllGraphics: function() {
            var a = [this._box];
            this._anchors &&
              d.forEach(this._anchors, function(b) {
                a.push(b.graphic);
              });
            return (a = d.filter(a, F.isDefined));
          },
          _getMoveable: function(a, b) {
            var c = a.getDojoShape();
            if (c)
              return (
                (a = new r(c)),
                (a._index = b),
                this._connects.push(
                  u.connect(a, "onMoveStart", this._moveStartHandler)
                ),
                this._connects.push(
                  u.connect(a, "onFirstMove", this._firstMoveHandler)
                ),
                this._connects.push(
                  u.connect(a, "onMoveStop", this._moveStopHandler)
                ),
                (a.onMove = this._moveHandler),
                (c = c.getEventSource()) &&
                  n.set(c, "cursor", this._toolbar._cursors["box" + b]),
                a
              );
          },
          _moveStartHandler: function(a) {
            this._toolbar[
              "on" +
                (8 === a.host._index ? this._rotateEvent : this._scaleEvent) +
                "Start"
            ](this._graphic);
          },
          _firstMoveHandler: function(a) {
            this._toolbar._deactivateScrollWheel();
            var b = a.host._index,
              c = (this._wrapOffset = a.host.shape._wrapOffsets[0] || 0),
              e = this._graphic.getLayer().getNavigationTransform(),
              k;
            a = d.map(this._getBoxCoords(!0), function(a) {
              return { x: a[0] + c, y: a[1] };
            });
            k = this._isTextPoint
              ? this._map.toScreen(this._graphic.geometry)
              : { x: a[1].x, y: a[3].y };
            this._centerCoord = f.multiplyPoint(f.invert(e), k);
            if (8 === b)
              (k = f.multiplyPoint(f.invert(e), a[1])),
                this._isTextPoint &&
                  (this._centerCoord = this._deNormalizePoint(
                    this._centerCoord,
                    k
                  )),
                (this._startLine = [this._centerCoord, k]),
                (this._moveLine = t.clone(this._startLine));
            else if (
              ((k = f.multiplyPoint(f.invert(e), a[b])),
              (e = f.multiplyPoint(f.invert(e), a[(b + 4) % 8])),
              this._isTextPoint &&
                (this._centerCoord = this._deNormalizePoint(
                  this._centerCoord,
                  k
                )),
              (this._firstMoverToAnchor = Math.sqrt(
                (k.x - this._centerCoord.x) * (k.x - this._centerCoord.x) +
                  (k.y - this._centerCoord.y) * (k.y - this._centerCoord.y)
              )),
              (this._startBox = e),
              (this._startBox.width = a[4].x - a[0].x),
              (this._startBox.height = a[4].y - a[0].y),
              (this._moveBox = t.clone(this._startBox)),
              (this._xfactor = k.x > e.x ? 1 : -1),
              (this._yfactor = k.y > e.y ? 1 : -1),
              1 === b || 5 === b)
            )
              this._xfactor = 0;
            else if (3 === b || 7 === b) this._yfactor = 0;
            this._toolbar._beginOperation("BOX");
            this._toolbar[
              "on" +
                (8 === b ? this._rotateEvent : this._scaleEvent) +
                "FirstMove"
            ](this._graphic);
          },
          _moveHandler: function(a, b) {
            a = a.host._index;
            var c = this._defaultEventArgs,
              d,
              e,
              k;
            c.angle = 0;
            c.scaleX = 1;
            c.scaleY = 1;
            if (8 === a)
              (d = this._startLine),
                (e = this._moveLine),
                (k = e[1]),
                (k.x += b.dx),
                (k.y += b.dy),
                (b = this._getAngle(d, e)),
                this._isTextPoint && (b += this._graphic.symbol.angle),
                (e = f.rotategAt(b, d[0])),
                this._graphic.getDojoShape().setTransform(e),
                (c.transform = e),
                (c.angle = b),
                (c.around = d[0]);
            else {
              d = this._startBox;
              e = this._moveBox;
              e.width += b.dx * this._xfactor;
              e.height += b.dy * this._yfactor;
              this._uniformScaling || this._isTextPoint
                ? ((d = e.x + this._xfactor * e.width),
                  (e = e.y + this._yfactor * e.height),
                  (d = Math.sqrt(
                    (d - this._centerCoord.x) * (d - this._centerCoord.x) +
                      (e - this._centerCoord.y) * (e - this._centerCoord.y)
                  )),
                  (this._scaleRatio = b = k = d / this._firstMoverToAnchor),
                  (d = this._centerCoord))
                : ((b = e.width / d.width),
                  (k = e.height / d.height),
                  (d = { x: d.x, y: d.y }));
              if (isNaN(b) || Infinity === b || -Infinity === b) b = 1;
              if (isNaN(k) || Infinity === k || -Infinity === k) k = 1;
              e = f.scaleAt(b, k, d);
              if (this._isTextPoint) {
                var g = f.rotategAt(this._graphic.symbol.angle, d);
                this._graphic.getDojoShape().setTransform([g, e]);
              } else this._graphic.getDojoShape().setTransform(e);
              c.transform = e;
              c.scaleX = b;
              c.scaleY = k;
              c.around = d;
            }
            this._toolbar[
              "on" + (8 === a ? this._rotateEvent : this._scaleEvent)
            ](this._graphic, c);
          },
          _moveStopHandler: function(a) {
            this._toolbar._activateScrollWheel();
            var b = this._graphic,
              c = this._toolbar,
              d = c._geo ? k.geographicToWebMercator(b.geometry) : b.geometry,
              e = d.spatialReference,
              f = b.getDojoShape(),
              g = f.getTransform(),
              h = b.getLayer().getNavigationTransform();
            this._isTextPoint
              ? ((b = this._graphic.symbol),
                8 === a.host._index
                  ? (b.angle += this._getAngle(this._startLine, this._moveLine))
                  : b.font.setSize(
                      Math.round(b.font.size * this._scaleRatio * 100) / 100
                    ),
                this._graphic.setSymbol(b))
              : ((d = d.toJson()),
                this._updateSegments(d.paths || d.rings, g, h, e),
                f.setTransform(null),
                (d = q.fromJson(d)),
                b.setGeometry(c._geo ? k.webMercatorToGeographic(d, !0) : d));
            this._draw();
            this._startLine = this._moveLine = this._startBox = this._moveBox = this._xfactor = this._yfactor = null;
            c._endOperation("BOX");
            this._defaultEventArgs.transform = g;
            c[
              "on" +
                (8 === a.host._index ? this._rotateEvent : this._scaleEvent) +
                "Stop"
            ](this._graphic, this._defaultEventArgs);
          },
          _updateSegments: function(a, b, c, k) {
            var e = this._map,
              g = this._wrapOffset || 0;
            d.forEach(
              a,
              function(a) {
                d.forEach(
                  a,
                  function(a) {
                    this._updatePoint(a, k, g, f, e, c, b);
                  },
                  this
                );
              },
              this
            );
          },
          _updatePoint: function(a, b, c, d, f, k, g) {
            b = f.toScreen({ x: a[0], y: a[1], spatialReference: b }, !0);
            b.x += c;
            b = d.multiplyPoint([k, g, d.invert(k)], b);
            b.x -= c;
            c = f.toMap(b);
            a[0] = c.x;
            a[1] = c.y;
          },
          _getAngle: function(a, b) {
            return (
              (180 * Math.atan2(b[0].y - b[1].y, b[0].x - b[1].x)) / Math.PI -
              (180 * Math.atan2(a[0].y - a[1].y, a[0].x - a[1].x)) / Math.PI
            );
          },
          _deNormalizePoint: function(a, b) {
            var c = this._map._getFrameWidth();
            if (-1 === c) return a;
            for (a = { x: a.x, y: a.y }; Math.abs(a.x - b.x) >= c; )
              a.x = a.x < b.x ? a.x + c : a.x - c;
            var d = Math.abs(a.x - b.x);
            Math.abs(a.x - b.x + c) < d
              ? (a.x += c)
              : Math.abs(a.x - b.x - c) < d && (a.x -= c);
            return a;
          }
        });
        x("extend-esri") && t.setObject("toolbars._Box", h, c);
        return h;
      });
    },
    "dojox/gfx/Moveable": function() {
      define("dojo/_base/lang dojo/_base/declare dojo/_base/array dojo/_base/event dojo/topic dojo/touch dojo/dom-class dojo/_base/window ./Mover dojo/mouse".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c) {
        return t("dojox.gfx.Moveable", null, {
          constructor: function(c, d) {
            this.shape = c;
            this.delay = d && 0 < d.delay ? d.delay : 0;
            this.mover = d && d.mover ? d.mover : f;
            this.leftButtonOnly = d && d.leftButtonOnly;
            this.events = [
              this.shape.on(x.press, h.hitch(this, "onMouseDown"))
            ];
          },
          destroy: function() {
            d.forEach(this.events, function(c) {
              c.remove();
            });
            this.events = this.shape = null;
          },
          onMouseDown: function(d) {
            this.delay
              ? (this.events.push(
                  this.shape.on(x.move, h.hitch(this, "onMouseMove")),
                  this.shape.on(x.release, h.hitch(this, "onMouseUp"))
                ),
                (this._lastX = d.clientX),
                (this._lastY = d.clientY))
              : (this.leftButtonOnly && !c.isLeft(d)) ||
                new this.mover(this.shape, d, this);
            u.stop(d);
          },
          onMouseMove: function(c) {
            var d = c.clientY;
            if (
              Math.abs(c.clientX - this._lastX) > this.delay ||
              Math.abs(d - this._lastY) > this.delay
            )
              this.onMouseUp(c), new this.mover(this.shape, c, this);
            u.stop(c);
          },
          onMouseUp: function(c) {
            this.events.pop().remove();
          },
          onMoveStart: function(c) {
            v.publish("/gfx/move/start", c);
            n.add(r.body(), "dojoMove");
          },
          onMoveStop: function(c) {
            v.publish("/gfx/move/stop", c);
            n.remove(r.body(), "dojoMove");
          },
          onFirstMove: function(c) {},
          onMove: function(c, d, b) {
            this.onMoving(c, d, b);
            this.shape.applyLeftTransform(d);
            this.onMoved(c, d);
          },
          onMoving: function(c, d) {},
          onMoved: function(c, d) {}
        });
      });
    },
    "dojox/gfx/Mover": function() {
      define("dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/on dojo/touch dojo/_base/event".split(
        " "
      ), function(h, t, d, u, v, x) {
        return d("dojox.gfx.Mover", null, {
          constructor: function(d, r, f) {
            this.shape = d;
            this.lastX = r.clientX;
            this.lastY = r.clientY;
            d = this.host = f;
            r = document;
            f = u(r, v.move, h.hitch(this, "onFirstMove"));
            this.events = [
              u(r, v.move, h.hitch(this, "onMouseMove")),
              u(r, v.release, h.hitch(this, "destroy")),
              u(r, "dragstart", h.hitch(x, "stop")),
              u(r, "selectstart", h.hitch(x, "stop")),
              f
            ];
            if (d && d.onMoveStart) d.onMoveStart(this);
          },
          onMouseMove: function(d) {
            var h = d.clientX,
              f = d.clientY;
            this.host.onMove(
              this,
              { dx: h - this.lastX, dy: f - this.lastY },
              d
            );
            this.lastX = h;
            this.lastY = f;
            x.stop(d);
          },
          onFirstMove: function() {
            this.host.onFirstMove(this);
            this.events.pop().remove();
          },
          destroy: function() {
            t.forEach(this.events, function(d) {
              d.remove();
            });
            var d = this.host;
            if (d && d.onMoveStop) d.onMoveStop(this);
            this.events = this.shape = null;
          }
        });
      });
    },
    "esri/toolbars/_GraphicMover": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/json dojo/dom-style dojox/gfx/Moveable dojox/gfx/Mover dojox/gfx/matrix ../kernel ../PointerEvents ../sniff ../geometry/webMercatorUtils ../geometry/ScreenPoint ../geometry/Point".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g, b, a) {
        var k = h(null, {
          declaredClass: "esri.toolbars._GraphicMover",
          constructor: function(a, b, c, d) {
            this.graphic = a;
            this.map = b;
            this.toolbar = c;
            this.tempPt = d;
            this._enableGraphicMover();
            this._moved = !1;
          },
          refresh: function(a) {
            var b = this.graphic.getDojoShape();
            !b ||
              (!a && b._hostGraphic) ||
              (this._disableGraphicMover(), this._enableGraphicMover());
          },
          destroy: function() {
            this._disableGraphicMover();
          },
          hasMoved: function() {
            return this._moved;
          },
          _enableGraphicMover: function() {
            var a = this.graphic,
              b = a.getDojoShape();
            b &&
              ((b._hostGraphic = a),
              (this._moveable = new x(b, { mover: k.Mover })),
              (this._moveStartHandle = d.connect(
                this._moveable,
                "onMoveStart",
                this,
                this._moveStartHandler
              )),
              (this._firstMoveHandle = d.connect(
                this._moveable,
                "onFirstMove",
                this,
                this._firstMoveHandler
              )),
              (this._movingHandle = d.connect(
                this._moveable,
                "onMoving",
                this,
                this._movingHandler
              )),
              (this._moveStopHandle = d.connect(
                this._moveable,
                "onMoveStop",
                this,
                this._moveStopHandler
              )),
              (a = b.getEventSource()) &&
                v.set(a, "cursor", this.toolbar._cursors.move));
          },
          _disableGraphicMover: function() {
            var a = this._moveable;
            if (a) {
              d.disconnect(this._moveStartHandle);
              d.disconnect(this._firstMoveHandle);
              d.disconnect(this._movingHandle);
              d.disconnect(this._moveStopHandle);
              var b = a.shape;
              b &&
                ((b._hostGraphic = null),
                (b = b.getEventSource()) && v.set(b, "cursor", "inherit"));
              a.destroy();
            }
            this._moveable = null;
          },
          _moveStartHandler: function() {
            var a = this.graphic,
              b = this.map;
            this._startTx = a.getDojoShape().getTransform();
            "point" === this.graphic.geometry.type &&
              b.snappingManager &&
              b.snappingManager._setUpSnapping();
            this.toolbar.onGraphicMoveStart(a);
          },
          _firstMoveHandler: function() {
            this.toolbar._beginOperation("MOVE");
            this.toolbar.onGraphicFirstMove(this.graphic);
          },
          _movingHandler: function(a, b, d) {
            a = a.shape.getTransform();
            b = this.map;
            var e;
            F("esri-pointer")
              ? (e = b.navigationManager.pointerEvents._processTouchEvent(d, d))
              : d &&
                "pointermove" === d.type &&
                (e = c.prototype._processTouchEvent.call({ map: b }, d, d));
            e &&
              b.snappingManager &&
              b.snappingManager._onSnappingMouseMoveHandler(e);
            this.tempPt && this.tempPt.getDojoShape().setTransform(a);
            this.toolbar.onGraphicMove(this.graphic, a);
          },
          _moveStopHandler: function(c) {
            var d = this.graphic,
              e = this.toolbar,
              f = this.map,
              k = e._geo ? g.geographicToWebMercator(d.geometry) : d.geometry,
              h = k.type,
              q = d.getDojoShape(),
              n = q.getTransform();
            if (u.toJson(n) !== u.toJson(this._startTx)) {
              this._moved = !0;
              switch (h) {
                case "point":
                  var h = [n, r.invert(this._startTx)],
                    t;
                  f.snappingManager && (t = f.snappingManager._snappingPoint);
                  k = t || f.toMap(r.multiplyPoint(h, f.toScreen(k, !0)));
                  f.snappingManager && f.snappingManager._killOffSnapping();
                  break;
                case "polyline":
                  k = this._updatePolyGeometry(k, k.paths, n);
                  break;
                case "polygon":
                  k = this._updatePolyGeometry(k, k.rings, n);
              }
              q.setTransform(null);
              d.setGeometry(e._geo ? g.webMercatorToGeographic(k, !0) : k);
              this.tempPt &&
                this.tempPt.setGeometry(new a(d.geometry.toJson()));
            } else this._moved = !1;
            e._endOperation("MOVE");
            e.onGraphicMoveStop(d, n);
            this._moved ||
              ((c = c.__e),
              (f = this.map.position),
              (c = new b(c.pageX - f.x, c.pageY - f.y)),
              e.onGraphicClick(d, {
                screenPoint: c,
                mapPoint: this.map.toMap(c)
              }));
          },
          _updatePolyGeometry: function(a, b, c) {
            var d = this.map,
              e = a.getPoint(0, 0),
              d = d.toMap(d.toScreen(e).offset(c.dx, c.dy));
            c = d.x - e.x;
            for (var e = d.y - e.y, f, k, g, d = 0; d < b.length; d++)
              for (k = b[d], f = 0; f < k.length; f++)
                (g = a.getPoint(d, f)), a.setPoint(d, f, g.offset(c, e));
            return a;
          }
        });
        k.Mover = h(n, {
          declaredClass: "esri.toolbars._Mover",
          constructor: function(a, b, c) {
            this.__e = b;
          }
        });
        F("extend-esri") &&
          (t.setObject("toolbars._GraphicMover", k, f),
          t.setObject("toolbars._Mover", k.Mover, f));
        return k;
      });
    },
    "esri/toolbars/_VertexEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/has dijit/Menu dijit/MenuItem ../kernel ./_VertexMover ../geometry/Point ../geometry/jsonUtils dojo/i18n!../nls/jsapi".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g) {
        var b = h(null, {
          declaredClass: "esri.toolbars._GraphicVertexEditor",
          constructor: function(a, b, c) {
            this.graphic = a;
            this.map = b;
            this.toolbar = c;
            a = c._options;
            this._symbol1 = a.vertexSymbol;
            this._symbol2 = a.ghostVertexSymbol;
            b = a.ghostLineSymbol;
            this._lineStroke = {
              style: b.style,
              width: b.width,
              color: b.color
            };
            this._canDel = a.allowDeleteVertices;
            this._canAdd = a.allowAddVertices;
            this._addControllers();
          },
          destroy: function() {
            this._removeControllers();
          },
          refresh: function(a) {
            a
              ? (this._removeControllers(), this._addControllers())
              : (this._refresh(this._vertexMovers),
                this._refresh(this._mpVertexMovers));
          },
          suspend: function() {
            this._suspended || this._removeControllers();
            this._suspended = !0;
          },
          resume: function() {
            this._suspended && this._addControllers();
            this._suspended = !1;
          },
          _addControllers: function() {
            this._firstMoveHandle = d.connect(
              f,
              "onFirstMove",
              this,
              this._firstMoveHandler
            );
            this._moveStopHandle = d.connect(
              f,
              "onMoveStop",
              this,
              this._moveStopHandler
            );
            this._vertexMovers = this._add(
              this._getSegments(this.graphic.geometry),
              this._symbol1
            );
            this._canAdd &&
              (this._mpVertexMovers = this._add(
                this._getMidpointSegments(this.graphic.geometry),
                this._symbol2,
                !0
              ));
            var a = this._getGraphicsLayer();
            this._mouseOverHandle = d.connect(
              a,
              "onMouseOver",
              this,
              this._mouseOverHandler
            );
            this._mouseOutHandle = d.connect(
              a,
              "onMouseOut",
              this,
              this._mouseOutHandler
            );
            this._canDel &&
              ((this._ctxMenu = new x({
                style: "font-size: 12px; margin-left: 5px; margin-top: 5px;"
              })),
              (a = this._ctxDelete = new n({
                label: g.toolbars.edit.deleteLabel,
                iconClass: "vertexDeleteIcon",
                style: "outline: none;"
              })),
              (this._deleteHandle = d.connect(
                a,
                "onClick",
                this,
                this._deleteHandler
              )),
              this._ctxMenu.addChild(a),
              this._ctxMenu.startup());
          },
          _removeControllers: function() {
            d.disconnect(this._firstMoveHandle);
            d.disconnect(this._moveStopHandle);
            d.disconnect(this._mouseOverHandle);
            d.disconnect(this._mouseOutHandle);
            d.disconnect(this._deleteHandle);
            this._ctxMenu &&
              ((this._ctxDelete = null),
              this._unbindCtxNode(),
              this._ctxMenu.destroyRecursive());
            this._remove(this._vertexMovers);
            this._remove(this._mpVertexMovers);
            this._vertexMovers = this._mpVertexMovers = null;
          },
          _add: function(a, b, c) {
            var d,
              e,
              k = this.graphic,
              g = [];
            for (d = 0; d < a.length; d++) {
              var h = a[d],
                q = [];
              for (e = 0; e < h.length; e++)
                q.push(new f(h[e], b, k, d, e, h.length, this, c));
              g.push(q);
            }
            return g;
          },
          _remove: function(a) {
            a &&
              u.forEach(a, function(a) {
                u.forEach(a, function(a) {
                  a.destroy();
                });
              });
          },
          _refresh: function(a) {
            a &&
              u.forEach(a, function(a) {
                u.forEach(a, function(a) {
                  a.refresh();
                });
              });
          },
          _isNew: function(a) {
            return -1 === u.indexOf(this._vertexMovers[a.segIndex], a)
              ? !0
              : !1;
          },
          _getGraphicsLayer: function() {
            return this.toolbar._scratchGL;
          },
          _deleteHandler: function(a) {
            a = this._selectedMover;
            this._updateRelatedGraphic(
              a,
              a.relatedGraphic,
              a.graphic.geometry,
              a.segIndex,
              a.ptIndex,
              a.segLength,
              !1,
              !0
            );
            this._canAdd && this._deleteMidpoints(a);
            this._deleteVertex(a);
            this.toolbar._endOperation("VERTICES");
          },
          _mouseOverHandler: function(a) {
            a = a.graphic;
            var b = this._findMover(a);
            b &&
              (this.toolbar.onVertexMouseOver(this.graphic, b._getInfo()),
              b._placeholder ||
                ((this._selectedMover = b),
                this._canDel && this._bindCtxNode(a.getDojoShape().getNode())));
          },
          _mouseOutHandler: function(a) {
            if ((a = this._findMover(a.graphic)))
              this.toolbar.onVertexMouseOut(this.graphic, a._getInfo());
          },
          _bindCtxNode: function(a) {
            this._unbindCtxNode();
            this._ctxDelete.set(
              "disabled",
              this._selectedMover.segLength <= this.minLength ? !0 : !1
            );
            this._ctxMenu.bindDomNode(a);
            this._bindNode = a;
          },
          _unbindCtxNode: function() {
            var a = this._bindNode;
            a && this._ctxMenu.unBindDomNode(a);
          },
          _findMover: function(a) {
            var b,
              c = [];
            b = this._mpVertexMovers;
            u.forEach(this._vertexMovers, function(a) {
              c = c.concat(a);
            });
            b &&
              u.forEach(b, function(a) {
                c = c.concat(a);
              });
            for (b = 0; b < c.length; b++) {
              var d = c[b];
              if (d.graphic === a) return d;
            }
          },
          _firstMoveHandler: function(a) {
            !this._isNew(a) && this._canAdd && this._hideRelatedMidpoints(a);
            this.toolbar._beginOperation("VERTICES");
          },
          _moveStopHandler: function(a, b) {
            var c = this._isNew(a);
            b && (b.dx || b.dy)
              ? (this._updateRelatedGraphic(
                  a,
                  a.relatedGraphic,
                  a.graphic.geometry,
                  a.segIndex,
                  a.ptIndex,
                  a.segLength,
                  c
                ),
                this._canAdd &&
                  (c
                    ? this._addMidpoints(a)
                    : (this._repositionRelatedMidpoints(a),
                      this._showRelatedMidpoints(a))),
                this.toolbar._endOperation("VERTICES"))
              : !c && this._canAdd && this._showRelatedMidpoints(a);
          },
          _showRelatedMidpoints: function(a) {
            var b = this._getAdjacentMidpoints(a.ptIndex, a.segLength),
              c = this._mpVertexMovers[a.segIndex];
            for (a = 0; a < b.length; a++) {
              var d = c[b[a]];
              d.graphic.show();
              d.refresh();
            }
          },
          _hideRelatedMidpoints: function(a) {
            var b = this._getAdjacentMidpoints(a.ptIndex, a.segLength),
              c = this._mpVertexMovers[a.segIndex];
            for (a = 0; a < b.length; a++) c[b[a]].graphic.hide();
          },
          _repositionRelatedMidpoints: function(a) {
            var b,
              d = this._getAdjacentMidpoints(a.ptIndex, a.segLength),
              f = this._mpVertexMovers[a.segIndex];
            for (b = 0; b < d.length; b++) {
              var e = this._getAdjacentVertices(d[b], a.segLength),
                g = a.relatedGraphic.geometry.getPoint(a.segIndex, e[0]),
                e = a.relatedGraphic.geometry.getPoint(a.segIndex, e[1]),
                g = new c({
                  x: (g.x + e.x) / 2,
                  y: (g.y + e.y) / 2,
                  spatialReference: g.spatialReference.toJson()
                });
              f[d[b]].graphic.setGeometry(g);
            }
          },
          _addMidpoints: function(a) {
            var b = a.segIndex,
              d = a.ptIndex,
              g = a.segLength,
              e = d + 1,
              h,
              n = g + 1;
            this._mpVertexMovers[b].splice(d, 1);
            var r = this._vertexMovers[b];
            for (h = 0; h < e; h++) r[h].segLength += 1;
            for (h = e; h < r.length; h++)
              (r[h].ptIndex += 1), (r[h].segLength += 1);
            a.ptIndex = e;
            a.segLength = r.length + 1;
            r.splice(e, 0, a);
            a.graphic.setSymbol(this._symbol1);
            r = this._mpVertexMovers[b];
            for (h = 0; h < d; h++) r[h].segLength += 1;
            for (h = d; h < g - 1; h++)
              (r[h].ptIndex += 1), (r[h].segLength += 1);
            e = this._getAdjacentVertices(d, n);
            b = this._getAdjacentVertices(d + 1, n);
            g = a.relatedGraphic.geometry.getPoint(a.segIndex, e[0]);
            h = a.relatedGraphic.geometry.getPoint(a.segIndex, e[1]);
            e = new c({
              x: (g.x + h.x) / 2,
              y: (g.y + h.y) / 2,
              spatialReference: g.spatialReference.toJson()
            });
            g = a.relatedGraphic.geometry.getPoint(a.segIndex, b[0]);
            h = a.relatedGraphic.geometry.getPoint(a.segIndex, b[1]);
            b = new c({
              x: (g.x + h.x) / 2,
              y: (g.y + h.y) / 2,
              spatialReference: g.spatialReference.toJson()
            });
            g = new f(
              e,
              this._symbol2,
              this.graphic,
              a.segIndex,
              d,
              n,
              this,
              !0
            );
            a = new f(
              b,
              this._symbol2,
              this.graphic,
              a.segIndex,
              d + 1,
              n,
              this,
              !0
            );
            r.splice(d, 0, g, a);
          },
          _deleteVertex: function(a) {
            var b,
              c = a.ptIndex,
              d = this._vertexMovers[a.segIndex];
            for (b = 0; b < c; b++) --d[b].segLength;
            for (b = c + 1; b < d.length; b++) {
              var e = d[b];
              --e.ptIndex;
              --e.segLength;
            }
            d.splice(c, 1);
            b = a._getInfo();
            a.destroy();
            this.toolbar.onVertexDelete(this.graphic, b);
          }
        });
        t.mixin(b, {
          create: function(a, c, d) {
            switch (a.geometry.type) {
              case "multipoint":
                return new b.MultipointVertexEditor(a, c, d);
              case "polyline":
                return new b.PolylineVertexEditor(a, c, d);
              case "polygon":
                return new b.PolygonVertexEditor(a, c, d);
            }
          }
        });
        b.MultipointVertexEditor = h(b, {
          declaredClass: "esri.toolbars._MultipointVertexEditor",
          minLength: 1,
          constructor: function() {
            this._moveStartHandle = d.connect(
              f,
              "onMoveStart",
              this,
              this._moveStartHandler
            );
            d.disconnect(this._firstMoveHandle);
          },
          destroy: function() {
            this.inherited(arguments);
            d.disconnect(this._moveStartHandle);
          },
          _getSegments: function(a) {
            var b = a.points,
              d = [],
              f = a.spatialReference;
            for (a = 0; a < b.length; a++) {
              var e = b[a];
              d.push(new c({ x: e[0], y: e[1], spatialReference: f.toJson() }));
            }
            return [d];
          },
          _getMidpointSegments: function(a) {
            return [];
          },
          _getControlPoints: function(a, b, c, d, e) {
            return [];
          },
          _getGraphicsLayer: function() {
            return this.graphic._graphicsLayer;
          },
          _mouseOverHandler: function(a) {
            var b = a.graphic;
            if ((a = this._findMover(a)))
              this.toolbar.onVertexMouseOver(b, a._getInfo()),
                (this._selectedMover = a),
                this._canDel &&
                  this._bindCtxNode(a.graphic.getDojoShape().getNode());
          },
          _mouseOutHandler: function(a) {
            var b = a.graphic;
            if ((a = this._findMover(a)))
              this.toolbar.onVertexMouseOut(b, a._getInfo());
          },
          _findMover: function(a) {
            var b = [].concat(this._vertexMovers[0]),
              c = a.target;
            for (a = 0; a < b.length; a++) {
              var d = b[a];
              if (d.graphic.getDojoShape().getNode() === c) return d;
            }
          },
          _moveStartHandler: function(a) {
            var b = a.ptIndex,
              c = a.segLength - 1,
              d = a.relatedGraphic.geometry.points;
            a = d.splice(b, 1);
            d.push(a[0]);
            d = this._vertexMovers[0];
            for (a = c; a > b; a--) --d[a].ptIndex;
            a = d.splice(b, 1);
            d.push(a[0]);
            a[0].ptIndex = c;
          },
          _moveStopHandler: function(a) {
            this._updateRelatedGraphic(
              a,
              a.relatedGraphic,
              a.graphic.geometry,
              a.segIndex,
              a.ptIndex,
              a.segLength
            );
            this.toolbar._endOperation("VERTICES");
          },
          _updateRelatedGraphic: function(a, b, c, d, e, f, g, h) {
            a = b.geometry;
            h ? a.removePoint(e) : a.setPoint(e, c);
            b.setGeometry(a);
          },
          _deleteMidpoints: function(a) {}
        });
        b.PolylineVertexEditor = h(b, {
          declaredClass: "esri.toolbars._PolylineVertexEditor",
          minLength: 2,
          _getSegments: function(a) {
            var b,
              c,
              d = a.paths,
              e = [];
            for (b = 0; b < d.length; b++) {
              var f = d[b],
                g = [];
              for (c = 0; c < f.length; c++) g.push(a.getPoint(b, c));
              e.push(g);
            }
            return e;
          },
          _getMidpointSegments: function(a) {
            var b,
              d,
              f = a.paths,
              e = [],
              g = a.spatialReference;
            for (b = 0; b < f.length; b++) {
              var h = f[b],
                n = [];
              for (d = 0; d < h.length - 1; d++) {
                var r = a.getPoint(b, d),
                  t = a.getPoint(b, d + 1),
                  r = new c({
                    x: (r.x + t.x) / 2,
                    y: (r.y + t.y) / 2,
                    spatialReference: g.toJson()
                  });
                n.push(r);
              }
              e.push(n);
            }
            return e;
          },
          _getControlPoints: function(a, b, c, d, e) {
            var f = this.map,
              g,
              k;
            this._isNew(a)
              ? ((a = d),
                (d += 1),
                0 <= a && (g = f.toScreen(b.getPoint(c, a))),
                d <= e && (k = f.toScreen(b.getPoint(c, d))))
              : ((a = d - 1),
                (d += 1),
                0 <= a && (g = f.toScreen(b.getPoint(c, a))),
                d < e && (k = f.toScreen(b.getPoint(c, d))));
            return [g, k];
          },
          _getAdjacentMidpoints: function(a, b) {
            var c = [],
              d = a - 1;
            0 <= d && c.push(d);
            a < b - 1 && c.push(a);
            return c;
          },
          _getAdjacentVertices: function(a, b) {
            return [a, a + 1];
          },
          _deleteMidpoints: function(a) {
            var b = this._mpVertexMovers[a.segIndex],
              d = b.length - 1,
              g = this._getAdjacentMidpoints(a.ptIndex, a.segLength).sort(),
              e,
              h = g[0];
            for (e = 0; e < h; e++) --b[e].segLength;
            for (e = h + 1; e < b.length; e++) {
              var n = b[e];
              --n.ptIndex;
              --n.segLength;
            }
            if (1 === g.length) b.splice(h, 1)[0].destroy();
            else
              for (
                n = this._getAdjacentVertices(h, d),
                  e = a.relatedGraphic.geometry.getPoint(a.segIndex, n[0]),
                  n = a.relatedGraphic.geometry.getPoint(a.segIndex, n[1]),
                  e = new c({
                    x: (e.x + n.x) / 2,
                    y: (e.y + n.y) / 2,
                    spatialReference: e.spatialReference.toJson()
                  }),
                  a = new f(
                    e,
                    this._symbol2,
                    this.graphic,
                    a.segIndex,
                    h,
                    d,
                    this,
                    !0
                  ),
                  b = b.splice(h, g.length, a),
                  e = 0;
                e < b.length;
                e++
              )
                b[e].destroy();
          },
          _updateRelatedGraphic: function(a, b, c, d, e, f, g, h) {
            a = b.geometry;
            g
              ? a.insertPoint(d, e + 1, F.fromJson(c.toJson()))
              : h
              ? a.removePoint(d, e)
              : a.setPoint(d, e, F.fromJson(c.toJson()));
            b.setGeometry(a);
          }
        });
        b.PolygonVertexEditor = h(b, {
          declaredClass: "esri.toolbars._PolygonVertexEditor",
          minLength: 3,
          _getSegments: function(a) {
            var b,
              c,
              d = a.rings,
              e = [];
            for (b = 0; b < d.length; b++) {
              var f = d[b],
                g = [];
              for (c = 0; c < f.length - 1; c++) g.push(a.getPoint(b, c));
              e.push(g);
            }
            return e;
          },
          _getMidpointSegments: function(a) {
            var b,
              d,
              f = a.rings,
              e = [],
              g = a.spatialReference;
            for (b = 0; b < f.length; b++) {
              var h = f[b],
                n = [];
              for (d = 0; d < h.length - 1; d++) {
                var r = a.getPoint(b, d),
                  t = a.getPoint(b, d + 1),
                  r = new c({
                    x: (r.x + t.x) / 2,
                    y: (r.y + t.y) / 2,
                    spatialReference: g.toJson()
                  });
                n.push(r);
              }
              e.push(n);
            }
            return e;
          },
          _getControlPoints: function(a, b, c, d, e) {
            var f = this.map;
            this._isNew(a)
              ? (a = d)
              : ((a = d - 1), (a = 0 > a ? (e + a) % e : a));
            d = (d + 1) % e;
            e = f.toScreen(b.getPoint(c, a));
            b = f.toScreen(b.getPoint(c, d));
            return [e, b];
          },
          _getAdjacentMidpoints: function(a, b) {
            var c = a - 1;
            return [0 > c ? (b + c) % b : c, a];
          },
          _getAdjacentVertices: function(a, b) {
            return [a, (a + 1) % b];
          },
          _deleteMidpoints: function(a) {
            var b = a.ptIndex,
              d = this._mpVertexMovers[a.segIndex],
              g = d.length - 1,
              e = this._getAdjacentMidpoints(b, a.segLength).sort(),
              h,
              n;
            n = e[0];
            var r = e[e.length - 1];
            if (0 === b)
              for (
                h = this._getAdjacentVertices(g - 1, g),
                  b = a.relatedGraphic.geometry.getPoint(a.segIndex, h[0]),
                  h = a.relatedGraphic.geometry.getPoint(a.segIndex, h[1]),
                  b = new c({
                    x: (b.x + h.x) / 2,
                    y: (b.y + h.y) / 2,
                    spatialReference: b.spatialReference.toJson()
                  }),
                  a = new f(
                    b,
                    this._symbol2,
                    this.graphic,
                    a.segIndex,
                    g - 1,
                    g,
                    this,
                    !0
                  ),
                  d.splice(r, 1, a)[0].destroy(),
                  d.splice(n, 1)[0].destroy(),
                  e = 0;
                e < d.length - 1;
                e++
              )
                (n = d[e]), --n.ptIndex, --n.segLength;
            else {
              h = this._getAdjacentVertices(n, g);
              b = a.relatedGraphic.geometry.getPoint(a.segIndex, h[0]);
              h = a.relatedGraphic.geometry.getPoint(a.segIndex, h[1]);
              b = new c({
                x: (b.x + h.x) / 2,
                y: (b.y + h.y) / 2,
                spatialReference: b.spatialReference.toJson()
              });
              a = new f(
                b,
                this._symbol2,
                this.graphic,
                a.segIndex,
                n,
                g,
                this,
                !0
              );
              r = d.splice(n, e.length, a);
              for (e = 0; e < r.length; e++) r[e].destroy();
              for (e = 0; e < n; e++) --d[e].segLength;
              for (e = n + 1; e < d.length; e++)
                (n = d[e]), --n.ptIndex, --n.segLength;
            }
          },
          _updateRelatedGraphic: function(a, b, c, d, e, f, g, h) {
            a = b.geometry;
            g
              ? a.insertPoint(d, e + 1, F.fromJson(c.toJson()))
              : h
              ? (a.removePoint(d, e),
                0 === e &&
                  a.setPoint(d, f - 1, F.fromJson(a.getPoint(d, 0).toJson())))
              : (a.setPoint(d, e, F.fromJson(c.toJson())),
                0 === e && a.setPoint(d, f, F.fromJson(c.toJson())));
            b.setGeometry(a);
          }
        });
        v("extend-esri") &&
          (t.setObject("toolbars._GraphicVertexEditor", b, r),
          t.setObject(
            "toolbars._MultipointVertexEditor",
            b.MultipointVertexEditor,
            r
          ),
          t.setObject(
            "toolbars._PolylineVertexEditor",
            b.PolylineVertexEditor,
            r
          ),
          t.setObject(
            "toolbars._PolygonVertexEditor",
            b.PolygonVertexEditor,
            r
          ));
        return b;
      });
    },
    "esri/toolbars/_VertexMover": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/sniff dojo/dom-style dojox/gfx/Moveable dojox/gfx/matrix ../kernel ../PointerEvents ../sniff ../geometry/Point ../graphic ../geometry/webMercatorUtils".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c, F, g, b) {
        h = h(null, {
          declaredClass: "esri.toolbars.VertexMover",
          constructor: function(a, b, c, d, e, f, g, h) {
            this.point = a;
            this.symbol = b;
            this.relatedGraphic = c;
            this.segIndex = d;
            this.ptIndex = e;
            this.segLength = f;
            this.editor = g;
            this.map = g.map;
            this._scratchGL = g.toolbar._scratchGL;
            this._placeholder = h || !1;
            this._type = c.geometry.type;
            this._init();
            this._enable();
          },
          refresh: function(a) {
            if (a || this._needRefresh()) this._disable(), this._enable();
          },
          destroy: function() {
            this._disable();
            this.graphic && this._scratchGL.remove(this.graphic);
            this.point = this.symbol = this.graphic = this.relatedGraphic = this.segIndex = this.ptIndex = this.segLength = this.editor = this.map = this._scratchGL = null;
          },
          _init: function() {
            var a = new F(this.point.toJson()),
              a = new g(a, this.symbol);
            switch (this._type) {
              case "multipoint":
                a._shape = this.relatedGraphic.getDojoShape().children[
                  this.ptIndex
                ];
                break;
              case "polyline":
              case "polygon":
                this._scratchGL.add(a);
            }
            this.graphic = a;
          },
          _enable: function() {
            var a = this.graphic.getDojoShape();
            a &&
              ((a._hasMover = !0),
              (this._moveable = this._getMoveable(a)),
              (a = a.getEventSource()) &&
                v.set(
                  a,
                  "cursor",
                  this.editor.toolbar._cursors[
                    this._placeholder ? "move-gv" : "move-v"
                  ]
                ));
          },
          _disable: function() {
            var a = this._moveable;
            if (a) {
              d.disconnect(this._startHandle);
              d.disconnect(this._firstHandle);
              d.disconnect(this._movingHandle);
              d.disconnect(this._stopHandle);
              var b = a.shape;
              b && (b = b.getEventSource()) && v.set(b, "cursor", "inherit");
              a.destroy();
              this._moveable = null;
            }
          },
          _needRefresh: function() {
            var a = this.graphic.getDojoShape(),
              b = !1;
            if (a)
              switch (this._type) {
                case "multipoint":
                  var c = this.relatedGraphic.getDojoShape();
                  c &&
                    ((c = c.children[this.ptIndex]),
                    a !== c && ((this.graphic._shape = c), (b = !0)));
                  break;
                case "polyline":
                case "polygon":
                  b = !a._hasMover;
              }
            return b;
          },
          _getMoveable: function(a) {
            a = new x(
              a,
              u("mac") && u("ff") && !c("esri-touch") && { leftButtonOnly: !0 }
            );
            this._startHandle = d.connect(
              a,
              "onMoveStart",
              this,
              this._moveStartHandler
            );
            this._firstHandle = d.connect(
              a,
              "onFirstMove",
              this,
              this._firstMoveHandler
            );
            this._movingHandle = d.connect(
              a,
              "onMoving",
              this,
              this._movingHandler
            );
            this._stopHandle = d.connect(
              a,
              "onMoveStop",
              this,
              this._moveStopHandler
            );
            return a;
          },
          _getPtIndex: function() {
            return this.ptIndex + (this._placeholder ? 1 : 0);
          },
          _getInfo: function() {
            return {
              graphic: this.graphic,
              isGhost: this._placeholder,
              segmentIndex: this.segIndex,
              pointIndex: this._getPtIndex()
            };
          },
          _moveStartHandler: function(a) {
            var b = this.map;
            b.snappingManager && b.snappingManager._setUpSnapping();
            this.editor.toolbar._deactivateScrollWheel();
            this._startTx = this.graphic.getDojoShape().getTransform();
            a.shape.moveToFront();
            this.constructor.onMoveStart(this);
            this.editor.toolbar.onVertexMoveStart(
              this.relatedGraphic,
              this._getInfo()
            );
          },
          _firstMoveHandler: function(a) {
            var b = a.shape,
              c = this._getControlEdges(),
              d = this._scratchGL._div,
              e,
              f = [],
              g = a.host.shape._wrapOffsets[0] || 0;
            for (e = 0; e < c.length; e++) {
              var h = c[e];
              h.x1 += g;
              h.x2 += g;
              f.push([
                d
                  .createLine({ x1: h.x1, y1: h.y1, x2: h.x2, y2: h.y2 })
                  .setStroke(this.editor._lineStroke),
                h.x1,
                h.y1,
                h.x2,
                h.y2
              ]);
            }
            b._lines = f;
            a.shape.moveToFront();
            this.constructor.onFirstMove(this);
            this.editor.toolbar.onVertexFirstMove(
              this.relatedGraphic,
              this._getInfo()
            );
          },
          _movingHandler: function(a, b, d) {
            b = this.map;
            var g;
            c("esri-pointer")
              ? (g = b.navigationManager.pointerEvents._processTouchEvent(d, d))
              : d &&
                "pointermove" === d.type &&
                (g = f.prototype._processTouchEvent.call({ map: b }, d, d));
            g &&
              b.snappingManager &&
              b.snappingManager._onSnappingMouseMoveHandler(g);
            d = a.shape;
            a = d.getTransform();
            d = d._lines;
            for (g = 0; g < d.length; g++)
              (b = d[g]),
                b[0].setShape({
                  x1: b[1] + a.dx,
                  y1: b[2] + a.dy,
                  x2: b[3],
                  y2: b[4]
                });
            this.editor.toolbar.onVertexMove(
              this.relatedGraphic,
              this._getInfo(),
              a
            );
          },
          _moveStopHandler: function(a) {
            a = a.shape;
            var c = this.editor.toolbar,
              d = a.getTransform(),
              f = this.map,
              e = this.graphic,
              g = c._geo ? b.geographicToWebMercator(e.geometry) : e.geometry;
            c._activateScrollWheel();
            var h,
              r = a._lines;
            if (r) {
              for (h = 0; h < r.length; h++) r[h][0].removeShape();
              a._lines = null;
            }
            h = !1;
            var r = !0,
              t = this._getInfo();
            d && (d.dx || d.dy)
              ? this._placeholder && ((this._placeholder = !1), (h = !0))
              : (r = !1);
            var u;
            f.snappingManager && (u = f.snappingManager._snappingPoint);
            var v = [d, n.invert(this._startTx)];
            u = u || f.toMap(n.multiplyPoint(v, f.toScreen(g, !0)));
            f.snappingManager && f.snappingManager._killOffSnapping();
            a.setTransform(null);
            e.setGeometry(c._geo ? b.webMercatorToGeographic(u, !0) : u);
            this.constructor.onMoveStop(this, d);
            c.onVertexMoveStop(this.relatedGraphic, t, d);
            if (!r) c.onVertexClick(this.relatedGraphic, t);
            if (h) c.onVertexAdd(this.relatedGraphic, this._getInfo());
          },
          _getControlEdges: function() {
            var a = this.map,
              b = this.relatedGraphic.geometry,
              c = this.segIndex,
              d = this.ptIndex,
              e = this.segLength,
              f = this._scratchGL.getNavigationTransform(),
              g = f.dx,
              f = f.dy,
              h = a.toScreen(this.graphic.geometry),
              a = h.x - g,
              h = h.y - f,
              n = [],
              b = this.editor._getControlPoints(this, b, c, d, e);
            b[0] && n.push({ x1: a, y1: h, x2: b[0].x - g, y2: b[0].y - f });
            b[1] && n.push({ x1: a, y1: h, x2: b[1].x - g, y2: b[1].y - f });
            return n;
          }
        });
        c("extend-esri") && t.setObject("toolbars.VertexMover", h, r);
        t.mixin(h, {
          onMoveStart: function() {},
          onFirstMove: function() {},
          onMoveStop: function() {}
        });
        return h;
      });
    },
    "esri/toolbars/TextEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/event dojo/has dojo/dom-construct dojo/dom-class dojo/dom-style dojo/keys ../kernel".split(
        " "
      ), function(h, t, d, u, v, x, n, r, f, c) {
        h = h(null, {
          declaredClass: "esri.toolbars.TextEditor",
          constructor: function(c, d, b) {
            this._graphic = c;
            this._map = d;
            this._toolbar = b;
            this._enable(this._graphic);
          },
          destroy: function() {
            this._disable();
          },
          onEditStart: function() {},
          onEditEnd: function() {},
          _enable: function(c) {
            this._editBox
              ? (d.disconnect(this._addEditBoxHandler),
                (this._addEditBoxHandler = null))
              : (this._map.navigationManager.setImmediateClick(!0),
                (this._addEditBoxHandler = d.connect(
                  c.getLayer(),
                  "onDblClick",
                  this,
                  function(f) {
                    this._map.navigationManager.setImmediateClick(!1);
                    f.graphic == c &&
                      (u.stop(f),
                      d.disconnect(this._addEditBoxHandler),
                      (this._addEditBoxHandler = null),
                      this._addTextBox(c));
                  }
                )));
          },
          _disable: function() {
            this._applyEdit();
            this._addEditBoxHandler &&
              (d.disconnect(this._addEditBoxHandler),
              (this._addEditBoxHandler = null));
            this._removeTextBox();
            this.onEditEnd(this._graphic);
            this._toolbar.onTextEditEnd(this._graphic);
          },
          _addTextBox: function(c, g) {
            if (!this._editBox) {
              var b;
              c.symbol.text ||
                ((c.symbol.text = "Tempt text"),
                c.setSymbol(c.symbol),
                (b = ""));
              var a = this._createInputTextStyle(c, this._map);
              "" !== b && (b = g || c.symbol.text);
              this._editBox = x.create("input", { type: "text", value: b });
              r.set(this._editBox, a);
              n.add(this._editBox, "esriTextEditorInput");
              this._map.container.appendChild(this._editBox);
              this._editBox.focus();
              this._editBoxKeyHandler = d.connect(
                this._editBox,
                "onkeyup",
                t.hitch(this, function(a) {
                  (a.keyCode != f.ENTER && a.keyCode !== f.TAB) ||
                    this._disable();
                })
              );
              this._editBoxBlurHandler = d.connect(
                this._editBox,
                "onblur",
                t.hitch(this, function(a) {
                  this._disable();
                })
              );
              c.symbol.text = "";
              c.setSymbol(c.symbol);
              c.hide();
              var h = this._editBox;
              this._disableBoxHandler ||
                (this._disableBoxHandler = this._map.on(
                  "zoom-start",
                  t.hitch(this, function() {
                    this._disable();
                  })
                ));
              this._moveBoxHandler = this._map.on("pan", function(a) {
                r.set(h, {
                  left: this._editBoxLeft + a.delta.x + "px",
                  top: this._editBoxTop + a.delta.y + "px"
                });
              });
              this._moveBoxStartHandler = this._map.on("pan-start", function() {
                this._editBoxLeft = parseFloat(r.get(h, "left"));
                this._editBoxTop = parseFloat(r.get(h, "top"));
              });
              this.onEditStart(c, this._editBox);
              this._toolbar.onTextEditStart(c, this._editBox);
            }
          },
          _removeTextBox: function() {
            this._editBoxBlurHandler &&
              (d.disconnect(this._editBoxBlurHandler),
              (this._editBoxBlurHandler = null));
            this._editBox &&
              (this._editBox.parentNode.removeChild(this._editBox),
              (this._editBox = null));
            this._disableBoxHandler &&
              (this._disableBoxHandler.remove(),
              (this._disableBoxHandler = null));
            this._moveBoxHandler &&
              (this._moveBoxHandler.remove(), (this._moveBoxHandler = null));
            this._moveBoxStartHandler &&
              (this._moveBoxStartHandler.remove(),
              (this._moveBoxStartHandler = null));
            this._editBoxKeyHandler &&
              (d.disconnect(this._editBoxKeyHandler),
              (this._editBoxKeyHandler = null));
          },
          _createInputTextStyle: function(c, d) {
            d = c.getDojoShape().getTransformedBoundingBox();
            var b = c.getLayer(),
              b = b.hasLocalNavigationTransform()
                ? { dx: 0, dy: 0 }
                : b.getNavigationTransform(),
              a = c.symbol.font;
            return {
              "font-family": a.family,
              "font-size": a.size + "px",
              "font-style": a.style,
              "font-variant": a.variant,
              "font-weight": a.weight,
              left: d[0].x + b.dx + "px",
              top: d[0].y + b.dy + "px",
              width:
                Math.abs(d[0].x - d[1].x) /
                  Math.cos((c.symbol.angle / 180) * Math.PI) +
                "px"
            };
          },
          _applyEdit: function() {
            if (this._editBox)
              if (this._editBox.value) {
                this._graphic.show();
                var c = this._graphic.symbol;
                c.text = this._editBox.value;
                this._graphic.setSymbol(c);
              } else this._graphic.getLayer().remove(this._graphic);
          }
        });
        v("extend-esri") && t.setObject("toolbars.TextEditor", h, c);
        return h;
      });
    },
    "widgets/DistrictLookup/utils": function() {
      define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dojo/_base/array",
        "dojo/_base/lang"
      ], function(h, t, d, u) {
        return h([t], {
          map: null,
          postCreate: function() {},
          getLayerDetailsFromMap: function(h, t, n) {
            var r = {},
              f;
            this.map &&
              this.map.webMapResponse &&
              this.map.webMapResponse.itemInfo &&
              this.map.webMapResponse.itemInfo.itemData &&
              this.map.webMapResponse.itemInfo.itemData.operationalLayers &&
              d.forEach(
                this.map.webMapResponse.itemInfo.itemData.operationalLayers,
                u.hitch(this, function(c) {
                  c.layerObject &&
                    ("ArcGISMapServiceLayer" === c.layerType ||
                    "ArcGISTiledMapServiceLayer" === c.layerType
                      ? ((f = n && n.substring(0, n.lastIndexOf("_"))),
                        (f && c.id !== f) ||
                          ((r.isMapServer = !0),
                          (r.id = c.id + "_" + t),
                          h.substring(0, h.length - 1) === c.url &&
                            (d.forEach(
                              c.resourceInfo.layers,
                              u.hitch(this, function(c) {
                                c.id === parseInt(t, 10) && (r.title = c.name);
                              })
                            ),
                            d.forEach(
                              c.layers,
                              u.hitch(this, function(c) {
                                c.id === parseInt(t, 10) &&
                                  (c.name && (r.title = c.name),
                                  (r.popupInfo = c.popupInfo),
                                  c.layerDefinition &&
                                    (c.layerDefinition.definitionExpression &&
                                      (r.definitionExpression =
                                        c.layerDefinition.definitionExpression),
                                    c.layerDefinition.drawingInfo &&
                                      c.layerDefinition.drawingInfo.renderer &&
                                      (r.renderer =
                                        c.layerDefinition.drawingInfo.renderer)));
                              })
                            ))))
                      : (n && c.id !== n) ||
                        c.url.replace(/.*?:\/\//g, "") !==
                          (h + t).replace(/.*?:\/\//g, "") ||
                        ((r.isMapServer = !1),
                        (r.title = c.title),
                        (r.popupInfo = c.popupInfo),
                        (r.id = c.id),
                        c.layerDefinition &&
                          (c.layerDefinition.definitionExpression &&
                            (r.definitionExpression =
                              c.layerDefinition.definitionExpression),
                          c.layerDefinition.drawingInfo &&
                            c.layerDefinition.drawingInfo.renderer &&
                            (r.renderer =
                              c.layerDefinition.drawingInfo.renderer))));
                })
              );
            return r;
          }
        });
      });
    },
    "widgets/DistrictLookup/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:esri/dijit/Search/templates/Search.html":
      '\x3cdiv role\x3d"presentation" class\x3d"${theme}"\x3e\r\n  \x3cdiv role\x3d"presentation" class\x3d"${css.searchGroup}" data-dojo-attach-point\x3d"containerNode"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"expandNode" class\x3d"${css.searchExpandContainer}"\x3e\r\n      \x3cdiv class\x3d"${css.searchAnimateContainer}"\x3e\r\n        \x3cdiv role\x3d"button" title\x3d"${_i18n.widgets.Search.main.searchIn}" id\x3d"${id}_menu_button" class\x3d"${css.searchBtn} ${css.searchToggle}" tabindex\x3d"0" data-dojo-attach-point\x3d"sourcesBtnNode"\x3e\r\n          \x3cspan aria-hidden\x3d"true" role\x3d"presentation" class\x3d"${css.searchToggleIcon}"\x3e\x3c/span\x3e\x3cspan class\x3d"${css.searchSourceName}" data-dojo-attach-point\x3d"sourceNameNode"\x3e\x3c/span\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"${css.searchInputGroup}"\x3e\r\n          \x3cform data-dojo-attach-point\x3d"formNode"\x3e\r\n            \x3cinput maxlength\x3d"${maxLength}" autocomplete\x3d"off" type\x3d"text" tabindex\x3d"0" class\x3d"${css.searchInput}" value\x3d"${value}" aria-haspopup\x3d"true" id\x3d"${id}_input" data-dojo-attach-point\x3d"inputNode" role\x3d"textbox"\x3e\r\n          \x3c/form\x3e\r\n          \x3cdiv role\x3d"button" class\x3d"${css.searchClear}" tabindex\x3d"0" data-dojo-attach-point\x3d"clearNode"\x3e\x3cspan aria-hidden\x3d"true" class\x3d"${css.searchClearIcon}"\x3e\x3c/span\x3e\x3cspan aria-hidden\x3d"true" class\x3d"${css.searchSpinner}"\x3e\x3c/span\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"suggestionsNode" class\x3d"${css.searchMenu} ${css.suggestionsMenu}"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv role\x3d"button" title\x3d"${_i18n.widgets.Search.main.searchButtonTitle}" class\x3d"${css.searchBtn} ${css.searchSubmit}" tabindex\x3d"0" data-dojo-attach-point\x3d"submitNode"\x3e\r\n      \x3cspan aria-hidden\x3d"true" role\x3d"presentation" class\x3d"${css.searchIcon}"\x3e\x3c/span\x3e\r\n      \x3cspan class\x3d"${css.searchButtonText}"\x3e${_i18n.widgets.Search.main.searchButtonTitle}\x3c/span\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"sourcesNode" class\x3d"${css.searchMenu} ${css.sourcesMenu}"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"noResultsMenuNode" class\x3d"${css.searchMenu} ${css.searchNoResultsMenu}"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"${css.searchClearFloat}"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:esri/dijit/templates/Directions.html":
      '\x3cdiv class\x3d"${options.theme}" role\x3d"presentation"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"_widgetContainer" class\x3d"${_css.widgetContainerClass}" role\x3d"presentation"\x3e\r\n        \x3cdiv class\x3d"${_css.stopsContainerClass}" role\x3d"presentation"\x3e\r\n            \x3cdiv id\x3d"search-source-container" class\x3d"${_css.searchSourceContainerClass}" data-dojo-attach-point\x3d"_searchSourceContainerNode"\x3e\r\n                \x3cdiv data-dojo-attach-point\x3d"_searchSourceSelectorContainer"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"${_css.stopsTableContainerClass}"\x3e\r\n                \x3ctable class\x3d"${_css.stopsClass}" data-dojo-attach-point\x3d"_dndNode"\x3e\x3c/table\x3e\r\n                \x3cdiv class\x3d"${_css.stopsTableCoverClass}" data-dojo-attach-point\x3d"_stopsTableCover"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"${_css.clearClass}"\x3e\x3c/div\x3e\r\n            \x3cdiv class\x3d"${_css.stopsButtonContainerClass}"\x3e\r\n                \x3cdiv class\x3d"${_css.stopsAddDestinationClass}"\x3e\r\n                    \x3cdiv tabindex\x3d"0" role\x3d"button" data-dojo-attach-point\x3d"_activateButtonNode" title\x3d"${_i18n.widgets.directions.activate}" class\x3d"${_css.activateButtonClass} ${_css.stopsButtonClass} ${_css.stopsButtonTabClass} ${_css.stopsPressedButtonClass}" data-blur-on-click\x3d"true"\x3e\x3c/div\x3e\r\n                    \x3cdiv tabindex\x3d"0" role\x3d"button" data-dojo-attach-point\x3d"_lineBarrierButtonNode" title\x3d"${_i18n.widgets.directions.lineBarrier}" class\x3d"${_css.lineBarrierButtonClass} ${_css.stopsButtonClass} ${_css.stopsButtonTabClass}" data-blur-on-click\x3d"true"\x3e\x3c/div\x3e\r\n                    \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"${_css.linkButtonClass} ${_css.stopsAddDestinationBtnClass}" data-dojo-attach-point\x3d"_addDestinationNode" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.addDestination}\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"${_css.travelModesContainerClass}" data-dojo-attach-point\x3d"_travelModeContainerNode"\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"_travelModeSelectorContainer"\x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.linkButtonClass} startTimeMenuButton" data-blur-on-click\x3d"true" data-dojo-attach-point\x3d"_startTimeButtonNodeContainer"\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"_startTimeButtonNode"\x3e\r\n                        \x3cspan data-dojo-attach-point\x3d"_startTimeButtonLabel"\x3e${_i18n.widgets.directions.leaveNow}\x3c/span\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"_startTimeDDLArrow" class\x3d"esriDirectionsDDLArrow"\x3e\x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"startTimeMenu" data-dojo-attach-point\x3d"_startTimeMenu"\x3e\r\n                        \x3cul role\x3d"menu"\x3e\r\n                            \x3cli data-dojo-attach-point\x3d"_startTimeMenuLeaveNow" tabindex\x3d"0" class\x3d"esriRouteZoom startTimeMenuItem" role\x3d"menuitemradio" aria-checked\x3d"true"\x3e${_i18n.widgets.directions.leaveNow}\x3c/li\x3e\r\n                            \x3cli data-dojo-attach-point\x3d"_startTimeMenuDepartAt" tabindex\x3d"0" class\x3d"esriRouteZoom startTimeMenuItem" role\x3d"menuitemradio"\x3e${_i18n.widgets.directions.departAt}\x3c/li\x3e\r\n                            \x3cli data-dojo-attach-point\x3d"_startTimeMenuNone" tabindex\x3d"0" class\x3d"esriRouteZoom startTimeMenuItem" role\x3d"menuitemradio"\x3e${_i18n.widgets.directions.noStartTime}\x3c/li\x3e\r\n                        \x3c/ul\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.linkButtonClass} ${_css.stopsOptionsButtonClass}" data-dojo-attach-point\x3d"_optionsButtonNode" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.showOptions}\x3c/div\x3e\r\n            \t\x3cdiv class\x3d"${_css.clearClass}"\x3e\x3c/div\x3e\r\n                \x3cdiv class\x3d"departAtContainer" data-dojo-attach-point\x3d"_departAtContainer"\x3e\r\n                    \x3cdiv id\x3d"${id}_directionsDepartAtTime" data-dojo-attach-point\x3d"_departAtTimeContainer"\x3e\x3c/div\x3e\r\n                    \x3cdiv id\x3d"${id}_directionsDepartAtDate" data-dojo-attach-point\x3d"_departAtDateContainer"\x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv role\x3d"presentation" class\x3d"${_css.stopsOptionsMenuClass}" data-dojo-attach-point\x3d"_optionsMenuNode"\x3e\r\n                \x3cdiv class\x3d"${_css.stopsOptionsCheckboxesClass}"\x3e\r\n                    \x3cul\x3e\r\n                        \x3cli class\x3d"${_css.stopsFindOptimalOrderClass}" data-dojo-attach-point\x3d"_findOptimalOrderItemNode"\x3e\x3cinput tabindex\x3d"0" data-dojo-attach-point\x3d"_findOptimalOrderNode" type\x3d"checkbox" id\x3d"${id}_find_optimal_order" /\x3e\x3clabel for\x3d"${id}_find_optimal_order"\x3e${_i18n.widgets.directions.findOptimalOrder}\x3c/label\x3e\x3c/li\x3e\r\n                        \x3cli class\x3d"${_css.stopsReturnToStartClass}" data-dojo-attach-point\x3d"_returnToStartItemNode"\x3e\x3cinput tabindex\x3d"0" data-dojo-attach-point\x3d"_returnToStartNode" type\x3d"checkbox" id\x3d"${id}_stopsReturnToStart" /\x3e\x3clabel for\x3d"${id}_stopsReturnToStart"\x3e${_i18n.widgets.directions.returnToStart}\x3c/label\x3e\x3c/li\x3e\r\n                        \x3cli class\x3d"${_css.stopsUseTrafficClass}" data-dojo-attach-point\x3d"_useTrafficItemNode" title\x3d"${_i18n.widgets.directions.trafficLabelLive}"\x3e\r\n                            \x3cinput tabindex\x3d"0" data-dojo-attach-point\x3d"_useTrafficNode" type\x3d"checkbox" id\x3d"${id}_stopsUseTraffic" /\x3e\x3clabel for\x3d"${id}_stopsUseTraffic"\x3e${_i18n.widgets.directions.useTraffic}\x3c/label\x3e\r\n                            \x3ca data-dojo-attach-point\x3d"_trafficAvailabilityButton" style\x3d"display: none;" href\x3d"http://www.arcgis.com/home/item.html?id\x3db7a893e8e1e04311bd925ea25cb8d7c7" target\x3d"_blank"\x3e\x3cdiv class\x3d"esriTrafficAvailabilityButton" title\x3d"${_i18n.widgets.directions.seeTrafficAvailability}"\x3e\x3c/div\x3e\x3c/a\x3e\r\n                        \x3c/li\x3e\r\n                    \x3c/ul\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"${_css.stopsOptionsToggleContainerClass}"\x3e\r\n                    \x3cdiv class\x3d"${_css.stopsOptionsUnitsContainerClass}"  data-dojo-attach-point\x3d"_agolDistanceUnitsNode"\x3e\r\n                        \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.stopsOptionsUnitsMiClass} ${_css.stopsButtonClass}" data-dojo-attach-point\x3d"_useMilesNode" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.units.esriMiles.abbr}\x3c/div\x3e\r\n                        \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.stopsOptionsUnitsKmClass} ${_css.stopsButtonClass} ${_css.stopsButtonTabLastClass} ${_css.stopsPressedButtonClass}" data-dojo-attach-point\x3d"_useKilometersNode" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.units.esriKilometers.abbr}\x3c/div\x3e\r\n                        \x3cdiv class\x3d"${_css.clearClass}"\x3e\x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"${_css.clearClass}"\x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"${_css.clearClass}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"${_css.stopsGetDirectionsContainerClass}"\x3e\r\n                \x3cdiv class\x3d"getDirectionsBtnContainer"\x3e\r\n                    \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.stopsButtonClass} ${_css.stopsGetDirectionsClass} esriDisabledDirectionsButton" data-dojo-attach-point\x3d"_getDirectionsButtonNode" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.getDirections}\x3c/div\x3e\r\n                    \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.linkButtonClass} ${_css.stopsClearDirectionsClass}" data-dojo-attach-point\x3d"_clearDirectionsButtonNode" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.clearDirections}\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"savePrintBtnContainer" data-dojo-attach-point\x3d"_savePrintBtnContainer"\x3e\r\n                    \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.resultsSaveClass} ${_css.stopsButtonClass} ${_css.stopsButtonTabClass}" data-blur-on-click\x3d"true" data-dojo-attach-point\x3d"_saveMenuButton" title\x3d"${_i18n.widgets.directions.saveTitle}" \x3e\x3c/div\x3e\r\n                    \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.resultsPrintClass} ${_css.stopsButtonClass} ${_css.stopsButtonTabClass}" data-blur-on-click\x3d"true" data-dojo-attach-point\x3d"_printButton" title\x3d"${_i18n.widgets.directions.print}" \x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv role\x3d"presentation" class\x3d"${_css.stopsOptionsMenuClass} esriSaveContainer" data-dojo-attach-point\x3d"_saveMenuNode"\x3e\r\n                \x3cdiv class\x3d"esriLayerNameLabel"\x3e${_i18n.widgets.directions.layerName}\x3c/div\x3e\r\n                \x3cinput type\x3d"text" data-dojo-attach-point\x3d"_outputLayerContainer"\x3e\r\n                \x3cdiv data-dojo-attach-point\x3d"_folderSelectorContainer"\x3e\x3c/div\x3e\r\n                \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"${_css.stopsButtonClass} esriSaveButton esriDisabledDirectionsButton" data-dojo-attach-point\x3d"_saveButton" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.save}\x3c/div\x3e\r\n                \x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"esriLinkButton esriSaveAsButton" data-dojo-attach-point\x3d"_saveAsButton" data-blur-on-click\x3d"true"\x3e${_i18n.widgets.directions.saveAs}\x3c/div\x3e\r\n            \x3c/div\x3e\r\n    \t\x3c/div\x3e\r\n    \t\x3cdiv class\x3d"${_css.clearClass}"\x3e\x3c/div\x3e\r\n    \t\x3cdiv data-dojo-attach-point\x3d"_msgNode" role\x3d"presentation"\x3e\x3c/div\x3e\r\n    \t\x3cdiv class\x3d"${_css.resultsContainerClass}" role\x3d"presentation"\x3e\r\n        \t\x3cdiv class\x3d"${_css.routesContainerClass}" data-dojo-attach-point\x3d"_resultsNode" role\x3d"presentation"\x3e\x3c/div\x3e\r\n    \t\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/DistrictLookup/Widget.html":
      '\x3cdiv class\x3d"esriCTPolligPlaceContainer esriCTFullHeight"\x3e\r\n    \x3cdiv class\x3d"esriCTFullHeight" data-dojo-attach-point\x3d"widgetMainNode"\x3e\r\n        \x3cdiv class\x3d"esriCTSearchOuterContainer"\x3e\r\n            \x3cdiv class\x3d"esriCTSearchHeader"\x3e\r\n                ${nls.searchHeaderText}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTSearchContainer"\x3e\r\n                \x3cdiv class\x3d"esriCTSearchDiv"\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"search"\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"${nls.mouseOverTooltip}" class\x3d"esriCTSelectLocationDiv esriCTImgButtons esriCTSelectLocation esriCTHidden"\r\n                    data-dojo-attach-point\x3d"selectLocation" title\x3d"${nls.mouseOverTooltip}"\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTResultsPanel esriCTTopBorder esriCTHidden" data-dojo-attach-point\x3d"featuresListNode"\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTResultsPanel esriCTHidden" data-dojo-attach-point\x3d"resultsPanel"\x3e\r\n            \x3cdiv tabindex\x3d"0" aria-label\x3d"${nls.common.back}" role\x3d"button" class\x3d"esriCTBackButton esriCTTopBorder"\r\n                data-dojo-attach-point\x3d"backButtonNode"\x3e\r\n                \x3cdiv class\x3d"esriCTItemLeftArrow "\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"esriCTBackButtonText " title\x3d"${nls.common.back}"\x3e\r\n                    ${nls.common.back}\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"tabContainerPanel"\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTWidgetErrorNode" data-dojo-attach-point\x3d"widgetErrorNode"\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/DistrictLookup/css/style.css":
      ".esriCTPolligPlaceContainer{min-width: 222px; height: 100%; -webkit-overflow-scrolling: touch;}.esriCTPollingPlaceContentPanel{padding: 15px 0px !important;}.jimu-widget-districtlookup .esriCTHidden{display: none;}.jimu-widget-districtlookup .esriCTWidgetErrorNode{color: Red;}.jimu-widget-districtlookup .esriCTFullHeight{height: 100%;}.jimu-widget-districtlookup .esriCTSearchOuterContainer{padding: 0px 15px 15px 20px; clear: both;}.jimu-widget-districtlookup .esriCTSearchHeader{padding: 0px 0px 10px 0px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}.jimu-widget-districtlookup .esriCTSearchDiv{float: left; clear: both;}.jimu-widget-districtlookup .esriCTSearchDiv .arcgisSearch{float: left; width: 100% !important;}.jimu-widget-districtlookup .esriCTSearchContainer{width: 100%; height: 35px;}.jimu-widget-districtlookup .arcgisSearch .searchGroup .searchInput{width: 170px;}.jimu-widget-districtlookup .arcgisSearch .searchBtn{padding: 6px;}.jimu-widget-search .arcgisSearch .searchGroup .searchInputGroup .searchInput{width: auto;}.jimu-widget-districtlookup .esriCTFisrtInfoContentDiv{padding-bottom: 15px;}.jimu-widget-districtlookup .esriCTInformationPanel{margin-top: 10px;}.jimu-widget-districtlookup .esriCTListPanel{height: calc(100% - 65px); overflow-y: auto;}.jimu-widget-districtlookup .esriCTResultsPanel{height: calc(100% - 61px);}.jimu-widget-districtlookup .esriCTResultsPanelOverrideHeight{height: calc(100% - 95px);}.jimu-widget-districtlookup .esriCTInfoContent{margin: 0px;}.jimu-widget-districtlookup .esriCTDirectionPanel{padding: 20px;}.jimu-widget-districtlookup .esriCTlistOfResultPanel{width: calc(100% - 12px); height: 36px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 35px; padding: 0px 10px 0 0; float: left;}.jimu-widget-districtlookup .esriCTItemLeftArrow{background-image: url('../images/left-arrow.png'); float: left; height: 20px; width: 10px; background-repeat: no-repeat; background-color: Gray; margin-top: 7px; margin-left: 20px;}.jimu-widget-districtlookup .esriCTItemRighttArrow{background-image: url('../images/right-arrow.png'); background-repeat: no-repeat; background-color: Gray; height: 20px; width: 10px; float: left; margin-top: 10px;}.jimu-widget-districtlookup .esriCTBackButtonText{margin-left: 51px; font-weight: bold;}.jimu-widget-districtlookup .esriCTBackButton{height: 35px; width: 100%; cursor: pointer; line-height: 35px;}.jimu-widget-districtlookup .esriCTTopBorder{border-top: 1px solid #464646;}.jimu-widget-districtlookup .esriCTMiddleBorder{border-bottom: 1px solid #D8D8D8; width: 100%; float: left; padding: 0 20px;}.jimu-widget-districtlookup .esriCTSelectLocationDiv{margin: 0px 0px 0px 10px; float: right;}.jimu-widget-districtlookup .esriCTSelectLocation{background-image: url(\"../images/select-location.png\");}.jimu-widget-districtlookup .esriCTSelectLocationActive{background-image: url(\"../images/select-location-active.png\"); background-color: #57585A;}.jimu-widget-districtlookup .esriCTImgButtons{cursor: pointer; width: 32px; height: 34px; border: 1px solid #57585A; border-radius: 4px; background-size: 20px; background-position: center center; background-repeat: no-repeat;}.jimu-widget-districtlookup .jimu-tab \x3e .jimu-viewstack{top: 0px; position: relative; height: calc(100% - 30px); -webkit-overflow-scrolling: touch; min-height: 80px; overflow: auto;}.jimu-widget-districtlookup .dijitContentPane{overflow: hidden; padding: 20px;}.jimu-widget-districtlookup .esriResultsLoading{display: none;}.jimu-widget-districtlookup .simpleDirections .esriStopsContainer{height: 0px; margin: 0px;}.jimu-widget-districtlookup .simpleDirections .esriSearchSourceContainer{display: none;}.jimu-widget-districtlookup .getDirectionsBtnContainer{display: none;}.jimu-widget-districtlookup .esriStopsTableContainer{display: none;}.jimu-widget-districtlookup .esriStopsButtons{display: none;}.jimu-widget-districtlookup .simpleDirections .savePrintBtnContainer{position: relative; top: 15px; left: 90%; margin: 0px; z-index: 1;}.jimu-launchpad-panel .jimu-widget-districtlookup .simpleDirections .savePrintBtnContainer{top: 10px;}.jimu-launchpad-panel .jimu-widget-districtlookup .simpleDirections .esriStopsGetDirectionsContainer{padding-top: 0; margin: 0px 10px;}.jimu-widget-districtlookup .simpleDirections{margin-top: 20px;}.jimu-widget-districtlookup .simpleDirections .esriResultsSummary{padding: 0 40px;}.jimu-widget-districtlookup .simpleDirections .esriResultsLoading .esriResultsContainer{display: none;}.jimu-widget-districtlookup .esriCTThumbnailContainer{margin: 2px;}.jimu-widget-districtlookup .esriCTAttachmentHeader{margin: 2px; word-wrap: break-word; color: #888888;}.jimu-widget-districtlookup .esriCTAttachmentHolder{margin: 5px; float: left; width: auto; height: 60px;}.jimu-widget-districtlookup .esriCTAttachmentImg{cursor: pointer;}.jimu-widget-districtlookup .esriCTImageLoader{cursor: default; display: block; background-position: center center; background-image: url(../images/list-loader.gif); background-repeat: no-repeat; width: 90px; height: 60px;}.jimu-widget-districtlookup .esriCTAutoHeight{height: auto;}.jimu-widget-districtlookup .esriCTNoAttachmentsFoundMsg{margin: 2px;}.jimu-widget-districtlookup .esriCTResultsPanel .editSummarySection{display: none;}.jimu-widget-districtlookup .mediaSection{padding-bottom: 10px; clear: both;}.jimu-widget-districtlookup .esriViewPopup .break{display: none;}.esriCTMapTooltip{width: 100px; word-wrap: break-word; border: 1px solid #7EABCD; background-color: white; padding: 5px; font-size: 9pt; z-index: 9999; -o-border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;}.esriRtl .jimu-widget-districtlookup .esriCTItemLeftArrow{background-image: url('../images/right-arrow.png'); float: right; margin-right: 22px;}.esriRtl .jimu-widget-districtlookup .esriCTItemRighttArrow{background-image: url('../images/left-arrow.png');}.esriRtl .jimu-widget-districtlookup .esriCTlistOfResultPanel{float: right;}.esriRtl .jimu-widget-districtlookup .simpleDirections .savePrintBtnContainer{left: 0px; right: 90%;}.esriRtl .jimu-widget-districtlookup .esriCTSearchDiv{float: right;}.esriRtl .jimu-widget-districtlookup .esriCTSelectLocationDiv{margin: 0px 0px 10px 0px; float: left;}",
    "*now": function(h) {
      h([
        'dojo/i18n!*preload*widgets/DistrictLookup/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare jimu/BaseWidget dojo/on dojo/dom-construct dojo/dom-class dojo/query dojo/keys dojo/_base/Color dojo/_base/lang ./search jimu/portalUtils esri/layers/GraphicsLayer esri/dijit/Directions esri/units esri/layers/FeatureLayer esri/symbols/SimpleMarkerSymbol esri/symbols/SimpleLineSymbol esri/geometry/Point esri/SpatialReference esri/graphicsUtils esri/graphic dojo/dom-attr dojo/dom-geometry dojo/dom-style esri/symbols/jsonUtils esri/tasks/locator esri/geometry/webMercatorUtils esri/InfoTemplate esri/dijit/PopupTemplate esri/tasks/query esri/tasks/RelationshipQuery jimu/dijit/Message jimu/dijit/TabContainer dijit/layout/ContentPane jimu/dijit/LoadingIndicator dojo/_base/array dijit/registry jimu/LayerInfos/LayerInfos ./utils esri/renderers/jsonUtils jimu/utils dojo/_base/event dijit/focus".split(
  " "
), function(
  h,
  t,
  d,
  u,
  v,
  x,
  n,
  r,
  f,
  c,
  F,
  g,
  b,
  a,
  k,
  q,
  m,
  e,
  A,
  H,
  I,
  E,
  N,
  C,
  G,
  B,
  Y,
  L,
  O,
  M,
  J,
  V,
  Q,
  D,
  l,
  y,
  K,
  da,
  W,
  aa,
  S,
  U,
  X
) {
  return h([t], {
    baseClass: "jimu-widget-districtlookup",
    _highlightGraphicsLayer: null,
    _loading: null,
    _precinctLayer: null,
    _pollingPlaceLayer: null,
    _selectedPollingPlace: null,
    _selectedLocation: null,
    _precinctInfoContent: null,
    _pollingPlaceInfoContent: null,
    _precinctInfoContentDiv: null,
    _pollingPlaceInfoContentDiv: null,
    _locatorInstance: null,
    _mapClickHandler: null,
    _mapMoveHandler: null,
    _mapTooltip: null,
    _searchContainerNodeElement: null,
    _directionPanel: null,
    _directionsWidget: null,
    _isValidConfig: null,
    _hasMulitpleSourcesInSearch: !0,
    _tables: [],
    appUtils: null,
    _precintRelatedRecordsPanel: null,
    _pollingRelatedRecordsPanel: null,
    _searchInstance: null,
    postMixInProperties: function() {
      this.nls.common = {};
      f.mixin(this.nls.common, window.jimuNls.common);
    },
    postCreate: function() {
      this._tables = [];
      this.config.routeService &&
        (this.config.routeService = this._replaceRouteTaskUrlWithAppProxy(
          this.config.routeService
        ));
    },
    startup: function() {
      v.add(this.domNode.parentElement, "esriCTPollingPlaceContentPanel");
      v.add(this.domNode.parentElement, this.baseClass);
      this.appConfig.portalUrl && "" !== f.trim(this.appConfig.portalUrl)
        ? F.getPortalSelfInfo(this.appConfig.portalUrl).then(
            f.hitch(this, function(a) {
              this.config.helperServices = a.helperServices;
              (this._isValidConfig = this._validateConfig())
                ? ((this.appUtils = new W({ map: this.map })),
                  this._updateConfig(),
                  v.remove(this.widgetMainNode, "esriCTHidden"),
                  v.add(this.widgetErrorNode, "esriCTHidden"),
                  this._initLoading(),
                  this._initWidgetComponents())
                : (v.add(this.widgetMainNode, "esriCTHidden"),
                  v.remove(this.widgetErrorNode, "esriCTHidden"));
            })
          )
        : (E.set(
            this.widgetErrorNode,
            "innerHTML",
            this.nls.invalidPortalUrlMsg
          ),
          this._showMessage(this.nls.invalidPortalUrlMsg),
          v.add(this.widgetMainNode, "esriCTHidden"),
          v.remove(this.widgetErrorNode, "esriCTHidden"));
    },
    _replaceRouteTaskUrlWithAppProxy: function(a) {
      var b = a;
      !window.isBuilder &&
        !this.appConfig.mode &&
        this.appConfig.appProxies &&
        0 < this.appConfig.appProxies.length &&
        y.some(this.appConfig.appProxies, function(c) {
          if (a === c.sourceUrl) return (b = c.proxyUrl), !0;
        });
      return b;
    },
    _initLoading: function() {
      this._loading = new l({ hidden: !0 });
      this._loading.placeAt(this.widgetMainNode);
      this._loading.startup();
    },
    _showMessage: function(a) {
      new V({ message: a }).message = a;
    },
    onOpen: function() {
      this._isValidConfig &&
        (this._onWindowResize(),
        this.config.showLocationTool || this._connectMapEventHandler());
      this._updateLayerFilters();
    },
    _updateLayerFilters: function() {
      da.getInstance(this.map, this.map.webMapResponse.itemInfo).then(
        f.hitch(this, function(a) {
          var b;
          this.config &&
            this.config.precinctLayerInfo &&
            this.config.precinctLayerInfo.id &&
            (b = a.getLayerInfoById(this.config.precinctLayerInfo.id)) &&
            ((b = b.getFilter()),
            b !== this.config.precinctLayerInfo.definitionExpression &&
              ((this.config.precinctLayerInfo.definitionExpression = b),
              this._precinctLayer &&
                this._precinctLayer.setDefinitionExpression(
                  this.config.precinctLayerInfo.definitionExpression
                )));
          this.config &&
            this.config.pollingPlaceLayerInfo &&
            this.config.pollingPlaceLayerInfo.id &&
            (a = a.getLayerInfoById(this.config.pollingPlaceLayerInfo.id)) &&
            ((b = a.getFilter()),
            b !== this.config.precinctLayerInfo.definitionExpression &&
              ((this.config.pollingPlaceLayerInfo.definitionExpression = b),
              this._pollingPlaceLayer &&
                this._pollingPlaceLayer.setDefinitionExpression(
                  this.config.pollingPlaceLayerInfo.definitionExpression
                )));
        })
      );
    },
    resize: function() {
      this._onWindowResize();
    },
    destroy: function() {
      this._clearResults();
      this.inherited(arguments);
    },
    onClose: function() {
      this._isValidConfig &&
        (this._disconnectMapEventHandler(),
        this._clearResults(),
        this._searchInstance && this._searchInstance.clearSearchText());
    },
    onDeActive: function() {
      this._isValidConfig &&
        this.config.showLocationTool &&
        this._disconnectMapEventHandler();
    },
    _validateConfig: function() {
      return this.config.precinctLayerInfo && this.config.precinctLayerInfo.url
        ? this.config.pollingPlaceLayerInfo &&
          this.config.pollingPlaceLayerInfo.url
          ? !0
          : (E.set(
              this.widgetErrorNode,
              "innerHTML",
              this.nls.invalidRelatedPointLayerMsg
            ),
            this._showMessage(this.nls.invalidRelatedPointLayerMsg),
            !1)
        : (E.set(
            this.widgetErrorNode,
            "innerHTML",
            this.nls.invalidPolygonLayerMsg
          ),
          this._showMessage(this.nls.invalidPolygonLayerMsg),
          !1);
    },
    _updateConfig: function() {
      f.mixin(
        this.config.precinctLayerInfo,
        this.appUtils.getLayerDetailsFromMap(
          this.config.precinctLayerInfo.baseURL,
          this.config.precinctLayerInfo.layerId,
          this.config.precinctLayerInfo.id
        )
      );
      f.mixin(
        this.config.pollingPlaceLayerInfo,
        this.appUtils.getLayerDetailsFromMap(
          this.config.pollingPlaceLayerInfo.baseURL,
          this.config.pollingPlaceLayerInfo.layerId,
          this.config.pollingPlaceLayerInfo.id
        )
      );
      this.config.highlightColor || (this.config.highlightColor = "#00FFFF");
    },
    _initWidgetComponents: function() {
      this.config.response = this.map.webMapResponse;
      this._createWidgetUI();
      this._createSearchInstance();
      this._initReverseGeocoder();
      this._setLayers();
      this._mapTooltip = u.create(
        "div",
        { class: "esriCTMapTooltip", innerHTML: this.nls.mouseOverTooltip },
        this.map.container
      );
      C.set(this._mapTooltip, "position", "fixed");
      C.set(this._mapTooltip, "display", "none");
      this.config.showLocationTool
        ? (this._connectSelectLocationHandler(),
          v.remove(this.selectLocation, "esriCTHidden"))
        : this._connectMapEventHandler();
      this._onWindowResize();
    },
    _connectSelectLocationHandler: function() {
      d(
        this.selectLocation,
        "click",
        f.hitch(this, function() {
          this._onSelectionButtonClick();
        })
      );
      d(
        this.selectLocation,
        "keydown",
        f.hitch(this, function(a) {
          (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
            this._onSelectionButtonClick();
        })
      );
    },
    _onSelectionButtonClick: function() {
      v.contains(this.selectLocation, "esriCTSelectLocationActive")
        ? this._disconnectMapEventHandler()
        : (v.replace(
            this.selectLocation,
            "esriCTSelectLocationActive",
            "esriCTSelectLocation"
          ),
          this._connectMapEventHandler());
    },
    _createWidgetUI: function() {
      var a;
      a = u.create("div");
      this._pollingPlaceInfoContentDiv = u.create(
        "div",
        { class: "esriCTInfoContent esriCTHidden esriCTFisrtInfoContentDiv" },
        a
      );
      this._precinctInfoContentDiv = u.create(
        "div",
        { class: "esriCTInfoContent  esriCTHidden" },
        a
      );
      this.config.hasOwnProperty("enableDirection") ||
        (this.config.enableDirection =
          this.map.webMapResponse.itemInfo.itemData &&
          this.map.webMapResponse.itemInfo.itemData.applicationProperties &&
          this.map.webMapResponse.itemInfo.itemData.applicationProperties
            .viewing &&
          this.map.webMapResponse.itemInfo.itemData.applicationProperties
            .viewing.routing &&
          this.map.webMapResponse.itemInfo.itemData.applicationProperties
            .viewing.routing.enabled
            ? !0
            : !1);
      this.config.enableDirection
        ? ((this._directionPanel = u.create("div", {
            class: "esriCTDirectionPanel"
          })),
          (this.tabContainer = new Q(
            {
              tabs: [
                { title: this.nls.informationTabTitle, content: a },
                {
                  title: this.nls.directionTabTitle,
                  content: this._directionPanel
                }
              ]
            },
            this.tabContainerPanel
          )),
          this.own(
            this.tabContainer.on(
              "tabChanged",
              f.hitch(this, function(a) {
                a === this.nls.directionTabTitle
                  ? (this._routeCalculated || this._routeSelectedLocations(),
                    S.initLastFocusNode(
                      this.domNode,
                      S.getFocusNodesInDom(
                        this._directionsWidget.domNode
                      ).reverse()[0]
                    ))
                  : this._getFeatureInfoLastNode();
                this.id && K.byId(this.id) && K.byId(this.id).resize();
              })
            )
          ),
          this.tabContainer.startup(),
          this._attachEventToTab())
        : (v.add(a, "esriCTTopBorder"),
          u.place(a, this.resultsPanel, "second"));
      this.own(
        d(
          this.backButtonNode,
          "click",
          f.hitch(this, function() {
            this._backButtonClick();
          })
        )
      );
      this.own(
        d(
          this.backButtonNode,
          "keydown",
          f.hitch(this, function(a) {
            (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
              this._backButtonClick();
          })
        )
      );
      this._pollingRelatedRecordsPanel = u.create(
        "div",
        { class: "esriCTRelatedRecordPanel" },
        a
      );
      this._precintRelatedRecordsPanel = u.create(
        "div",
        { class: "esriCTRelatedRecordPanel" },
        a
      );
    },
    _backButtonClick: function() {
      v.add(this.resultsPanel, "esriCTHidden");
      v.remove(this.featuresListNode, "esriCTHidden");
      this._clearGrahics();
      v.add(this._precinctInfoContentDiv, "esriCTHidden");
      v.add(this._pollingPlaceInfoContentDiv, "esriCTHidden");
      this._directionsWidget &&
        (this._directionsWidget.clearDirections(),
        (this._routeCalculated = !1));
      this.tabContainer &&
        this.tabContainer.selectTab(this.nls.informationTabTitle);
      this._getMainScreenLastNode();
      x(".esriCTMiddleBorder", this.domNode)[0].focus();
    },
    _getMainScreenLastNode: function() {
      var a, b;
      (b = x(".esriCTLastFeature", this.domNode)) && b[0] && (a = b[0]);
      !a && this.config.showLocationTool && (a = this.selectLocation);
      !a &&
        this._searchInstance &&
        this._searchInstance.search &&
        this._searchInstance.search.submitNode &&
        (a = this._searchInstance.search.submitNode);
      S.initLastFocusNode(this.domNode, a);
    },
    _getFeatureInfoLastNode: function() {
      for (
        var a,
          b,
          c = [],
          c = x(".esriCTPopupInfo", this.domNode),
          d = c.length - 1;
        0 <= d &&
        ((b = S.getFocusNodesInDom(c[d])) &&
          0 < b.length &&
          (a = b.reverse()[0]),
        a ||
          ((b = x(".esriCTAttachmentImg", c[d])) &&
            0 < b.length &&
            (a = b[b.length - 1])),
        !a);
        d--
      );
      a ||
        v.contains(this.backButtonNode, "esriCTHidden") ||
        (a = this.backButtonNode);
      "" !== this.tabContainer &&
        null !== this.tabContainer &&
        void 0 !== this.tabContainer &&
        this.tabContainer.viewStack &&
        this.tabContainer.viewStack.getSelectedLabel() ===
          this.nls.informationTabTitle &&
        this.tabContainer.controlNodes &&
        0 < this.tabContainer.controlNodes.length &&
        (a || (a = this.tabContainer.controlNodes[0]));
      !a && this.config.showLocationTool && (a = this.selectLocation);
      !a &&
        this._searchInstance &&
        (a = this._searchInstance.search.submitNode);
      a && S.initLastFocusNode(this.domNode, a);
    },
    _showResultPanel: function() {
      v.remove(this.resultsPanel, "esriCTHidden");
      this.id && K.byId(this.id) && K.byId(this.id).resize();
      this._resetComponents();
    },
    _hideResultPanel: function() {
      this.resultsPanel && v.add(this.resultsPanel, "esriCTHidden");
    },
    _createSearchInstance: function() {
      this._searchInstance = new c(
        {
          searchOptions: {
            addLayersFromMap: !1,
            autoNavigate: !1,
            autoComplete: !0,
            minCharacters: 0,
            maxLocations: 5,
            searchDelay: 100,
            enableHighlight: !1
          },
          config: this.config,
          appConfig: this.appConfig,
          nls: this.nls,
          map: this.map
        },
        u.create("div", {}, this.search)
      );
      this.own(
        this._searchInstance.on(
          "select-result",
          f.hitch(this, function(a) {
            a.isFeatureFromMapClick = !1;
            this._initWorkflow(a);
          })
        )
      );
      this.own(
        this._searchInstance.on(
          "clear-search",
          f.hitch(this, function() {
            this._clearResults();
          })
        )
      );
      this.own(
        this._searchInstance.on(
          "search-results",
          f.hitch(this, function() {
            this._clearResults(!0);
          })
        )
      );
      this.own(
        this._searchInstance.on(
          "search-loaded",
          f.hitch(this, function() {
            setTimeout(
              f.hitch(this, function() {
                this._searchContainerNodeElement = x(
                  ".arcgisSearch .searchGroup .searchInput",
                  this.domNode
                )[0];
                2 > this._searchInstance.search.sources.length
                  ? ((this._hasMulitpleSourcesInSearch = !1),
                    S.initFirstFocusNode(
                      this.domNode,
                      this._searchInstance.search.inputNode
                    ))
                  : S.initFirstFocusNode(
                      this.domNode,
                      this._searchInstance.search.sourcesBtnNode
                    );
                this._getMainScreenLastNode();
                this._onWindowResize();
              }),
              1e3
            );
          })
        )
      );
      this._searchInstance.startup();
    },
    _initReverseGeocoder: function() {
      var a;
      this.config.searchSourceSettings &&
        this.config.searchSourceSettings.sources &&
        (y.some(
          this.config.searchSourceSettings.sources,
          f.hitch(this, function(b) {
            if (b && b.url && "locator" === b.type) return (a = b.url), !0;
          })
        ),
        a &&
          ((this._locatorInstance = new B(a)),
          this.own(
            this._locatorInstance.on(
              "location-to-address-complete",
              f.hitch(this, this._onLocationToAddressComplete)
            )
          )));
    },
    _onLocationToAddressComplete: function(a) {
      var b;
      if (a.address && a.address.address) {
        if (a.address.address.Match_addr) b = a.address.address.Match_addr;
        else {
          b = "";
          for (var c in a.address.address)
            "Loc_name" !== c &&
              a.address.address[c] &&
              (b += a.address.address[c] + " ");
          b = f.trim(b);
        }
        this._searchInstance && this._searchInstance.setSearchText(b);
        a = new L();
        a.setContent("${Match_addr}");
        a.setTitle(this.nls.searchLocationTitle);
        this.map.infoWindow.clearFeatures();
        this.map.infoWindow.setTitle(this.nls.searchLocationTitle);
        this.map.infoWindow.setContent(b);
        b = this.map.toScreen(this._selectedLocation.geometry);
        this.map.infoWindow.show(b, this.map.getInfoWindowAnchor(b));
      }
    },
    _setLayers: function() {
      this._tables = this.map.webMapResponse.itemInfo.itemData.tables;
      this._highlightGraphicsLayer = new g();
      this.map.addLayer(this._highlightGraphicsLayer);
      this._precinctLayer = new k(this.config.precinctLayerInfo.url);
      this.config.precinctLayerInfo.definitionExpression &&
        this._precinctLayer.setDefinitionExpression(
          this.config.precinctLayerInfo.definitionExpression
        );
      this.config.precinctLayerInfo.id &&
        (this._precinctLayer.id = this.config.precinctLayerInfo.id);
      this.config.precinctLayerInfo.renderer &&
        this._precinctLayer.setRenderer(
          aa.fromJson(this.config.precinctLayerInfo.renderer)
        );
      this.config.precinctLayerInfo.popupInfo &&
        this._precinctLayer.setInfoTemplate(
          new O(this.config.precinctLayerInfo.popupInfo)
        );
      this._precinctLayer.loaded
        ? (this._precinctLayer.tableInfos = this._getRelatedTableInfo(
            this._precinctLayer,
            this.config.precinctLayerInfo
          ))
        : this.own(
            this._precinctLayer.on(
              "load",
              f.hitch(this, function() {
                this._precinctLayer.tableInfos = this._getRelatedTableInfo(
                  this._precinctLayer,
                  this.config.precinctLayerInfo
                );
              })
            )
          );
      this._pollingPlaceLayer = new k(this.config.pollingPlaceLayerInfo.url);
      this.config.pollingPlaceLayerInfo.definitionExpression &&
        this._pollingPlaceLayer.setDefinitionExpression(
          this.config.pollingPlaceLayerInfo.definitionExpression
        );
      this.config.pollingPlaceLayerInfo.id &&
        (this._pollingPlaceLayer.id = this.config.pollingPlaceLayerInfo.id);
      this.config.pollingPlaceLayerInfo.renderer &&
        this._pollingPlaceLayer.setRenderer(
          aa.fromJson(this.config.pollingPlaceLayerInfo.renderer)
        );
      this.config.pollingPlaceLayerInfo.popupInfo &&
        this._pollingPlaceLayer.setInfoTemplate(
          new O(this.config.pollingPlaceLayerInfo.popupInfo)
        );
      this._pollingPlaceLayer.loaded
        ? (this._pollingPlaceLayer.tableInfos = this._getRelatedTableInfo(
            this._pollingPlaceLayer,
            this.config.pollingPlaceLayerInfo
          ))
        : this.own(
            this._pollingPlaceLayer.on(
              "load",
              f.hitch(this, function() {
                this._pollingPlaceLayer.tableInfos = this._getRelatedTableInfo(
                  this._pollingPlaceLayer,
                  this.config.pollingPlaceLayerInfo
                );
              })
            )
          );
      this._updateLayerFilters();
    },
    _initWorkflow: function(a) {
      var b;
      this._clearResults(!0);
      this._updateLayerFilters();
      this._selectedLocation = b = this._getSelectedFeatureFromResult(a);
      this._locatorInstance &&
        a.isFeatureFromMapClick &&
        this._selectedLocation &&
        this._selectedLocation.geometry &&
        this._locatorInstance.locationToAddress(
          Y.webMercatorToGeographic(this._selectedLocation.geometry),
          100
        );
      b && b.geometry && "point" === b.geometry.type
        ? this._pollingPlaceLayer.infoTemplate ||
          this._precinctLayer.infoTemplate
          ? this._getPrecinctPolygon(b)
          : this._showMessage(this.nls.allPopupsDisabledMsg)
        : this.map.setExtent(b.geometry.getExtent().expand(1.5));
      x(".firstFocusNode", this.domNode) &&
        x(".firstFocusNode", this.domNode)[0] &&
        x(".firstFocusNode", this.domNode)[0].focus();
    },
    _getSelectedFeatureFromResult: function(a) {
      var b;
      a &&
        (a.feature
          ? (b = a.feature)
          : a.result && a.result.feature && (b = a.result.feature));
      return b;
    },
    _clearResults: function(a) {
      this._highlightGraphicsLayer && this._highlightGraphicsLayer.clear();
      this.featuresListNode &&
        !v.contains(this.featuresListNode, "esriCTHidden") &&
        v.add(this.featuresListNode, "esriCTHidden");
      this.resultsPanel &&
        !v.contains(this.resultsPanel, "esriCTHidden") &&
        v.remove(this.resultsPanel, "esriCTHidden");
      this._directionsWidget &&
        (this._directionsWidget.clearDirections(),
        (this._routeCalculated = !1));
      this.tabContainer &&
        this.tabContainer.selectTab(this.nls.informationTabTitle);
      this._hideResultPanel();
      this._precinctInfoContentDiv &&
        v.add(this._precinctInfoContentDiv, "esriCTHidden");
      this._pollingPlaceInfoContentDiv &&
        v.add(this._pollingPlaceInfoContentDiv, "esriCTHidden");
      this._selectedPollingPlace = this._selectedLocation = null;
      this._clearFeatureList();
      !a && this.map && this.map.infoWindow && this.map.infoWindow.hide();
      this._pollingRelatedRecordsPanel &&
        u.empty(this._pollingRelatedRecordsPanel);
      this._precintRelatedRecordsPanel &&
        u.empty(this._precintRelatedRecordsPanel);
      this._getMainScreenLastNode();
    },
    _connectMapEventHandler: function() {
      this._mapClickHandler ||
        (this._disableWebMapPopup(),
        (this._mapClickHandler = this.own(
          this.map.on("click", f.hitch(this, this._onMapClick))
        )[0]),
        "ontouchstart" in document.documentElement
          ? C.set(this._mapTooltip, "display", "none")
          : ((this._mapMoveHandler = this.own(
              this.map.on("mouse-move", f.hitch(this, this._onMapMouseMove))
            )[0]),
            this.own(
              this.map.on(
                "mouse-out",
                f.hitch(this, function() {
                  C.set(this._mapTooltip, "display", "none");
                })
              )
            )));
    },
    _onMapClick: function(a) {
      this.config.showLocationTool && this._disconnectMapEventHandler();
      this.map.infoWindow.hide();
      this._searchInstance && this._searchInstance.clearSearchText();
      this._initWorkflow({
        feature: new I(a.mapPoint),
        isFeatureFromMapClick: !0
      });
    },
    _onMapMouseMove: function(a) {
      var b;
      a.clientX || a.pageY
        ? ((b = a.clientX), (a = a.clientY))
        : ((b =
            a.clientX + document.body.scrollLeft - document.body.clientLeft),
          (a = a.clientY + document.body.scrollTop - document.body.clientTop));
      C.set(this._mapTooltip, "display", "none");
      C.set(this._mapTooltip, { left: b + 15 + "px", top: a + "px" });
      C.set(this._mapTooltip, "display", "");
    },
    _disconnectMapEventHandler: function() {
      this._enableWebMapPopup();
      this.config.showLocationTool &&
        v.replace(
          this.selectLocation,
          "esriCTSelectLocation",
          "esriCTSelectLocationActive"
        );
      this._mapClickHandler &&
        (this._mapClickHandler.remove(), (this._mapClickHandler = null));
      this._mapMoveHandler &&
        (this._mapMoveHandler.remove(),
        (this._mapMoveHandler = null),
        (this._mapTooltip.style.display = "none"));
    },
    _enableWebMapPopup: function() {
      this.map && this.map.setInfoWindowOnClick(!0);
    },
    _disableWebMapPopup: function() {
      this.map && this.map.setInfoWindowOnClick(!1);
    },
    _getPrecinctPolygon: function(a) {
      var b;
      a && a.geometry
        ? (this._loading.show(),
          (b = new M()),
          (b.outFields = ["*"]),
          (b.returnGeometry = !0),
          (b.geometry = a.geometry),
          this._precinctLayer.queryFeatures(
            b,
            f.hitch(this, function(a) {
              var b, c;
              if (a && a.features && 0 < a.features.length)
                if (1 < a.features.length)
                  for (
                    this._clearFeatureList(),
                      this._clearGrahics(),
                      v.remove(this.featuresListNode, "esriCTHidden"),
                      v.remove(this.backButtonNode, "esriCTHidden"),
                      v.add(
                        this.resultsPanel,
                        "esriCTResultsPanelOverrideHeight"
                      ),
                      this.stackedPolygons = a.features,
                      b = 0;
                    b < a.features.length;
                    b++
                  )
                    (c = u.create(
                      "div",
                      {
                        class: "esriCTMiddleBorder",
                        tabindex: "0",
                        "aria-label": S.stripHTML(
                          a.features[b].getTitle() || ""
                        ),
                        role: "button"
                      },
                      this.featuresListNode
                    )),
                      u.create(
                        "div",
                        {
                          innerHTML: a.features[b].getTitle(),
                          title: S.stripHTML(a.features[b].getTitle() || ""),
                          class: "esriCTlistOfResultPanel"
                        },
                        c
                      ),
                      u.create("div", { class: "esriCTItemRighttArrow" }, c),
                      E.set(c, "index", b),
                      this.own(
                        d(c, "click", f.hitch(this, this.rowClicked, !1))
                      ),
                      this.own(
                        d(c, "keydown", f.hitch(this, this.rowClicked, !0))
                      ),
                      a.features.length - 1 === b &&
                        (v.add(c, "esriCTLastFeature"),
                        S.initLastFocusNode(this.domNode, c)),
                      this._loading.hide();
                else
                  v.add(this.backButtonNode, "esriCTHidden"),
                    v.remove(
                      this.resultsPanel,
                      "esriCTResultsPanelOverrideHeight"
                    ),
                    this._showSelectedFeature(a.features[0]),
                    x(".firstFocusNode", this.domNode) &&
                      x(".firstFocusNode", this.domNode)[0] &&
                      x(".firstFocusNode", this.domNode)[0].focus();
              else
                this._showMessage(this.nls.noPrecinctFoundMsg),
                  this._loading.hide();
              this._highlightSelectedLocation(this._selectedLocation);
            }),
            f.hitch(this, function() {
              this._loading.hide();
            })
          ))
        : (this._showMessage(this.nls.noPrecinctFoundMsg),
          this._loading.hide());
    },
    rowClicked: function(a, b) {
      (a && b.keyCode !== n.ENTER && b.keyCode !== n.SPACE) ||
        ((a = parseInt(E.get(b.currentTarget, "index"), 10)),
        this._showSelectedFeature(this.stackedPolygons[a]));
    },
    _showSelectedFeature: function(a) {
      var b, c;
      v.add(this.featuresListNode, "esriCTHidden");
      v.remove(this.resultsPanel, "esriCTHidden");
      this._highlightPrecinctPolygon(a);
      this._precinctInfoContent &&
        (u.destroy(this._precinctInfoContent.domNode),
        u.empty(this._precinctInfoContentDiv));
      this._pollingPlaceInfoContent &&
        (u.destroy(this._pollingPlaceInfoContent.domNode),
        u.empty(this._pollingPlaceInfoContentDiv));
      this._precinctLayer.infoTemplate &&
        (v.remove(this._precinctInfoContentDiv, "esriCTHidden"),
        (this._precinctInfoContent = new D(
          { class: "esriCTPopupInfo" },
          u.create("div", {}, this._precinctInfoContentDiv)
        )),
        this._precinctInfoContent.startup(),
        (c = a.getContent()),
        (b = K.byId(c.id)),
        this.own(
          d(
            b,
            "content-update",
            f.hitch(this, function() {
              this._getFeatureInfoLastNode();
            })
          )
        ),
        this._precinctInfoContent.set("content", c),
        this.id && K.byId(this.id) && K.byId(this.id).resize(),
        this._precinctLayer.hasAttachments &&
          this.config.precinctLayerInfo.popupInfo.showAttachments &&
          ((b = x(".attachmentsSection", this._precinctInfoContentDiv)),
          0 < b.length && ((b = b[0]), v.remove(b, "hidden")),
          this._showAttachments(a, b, this._precinctLayer)));
      this._getRelatedPollingPlaces(a);
      this._getRelatedRecords(a, !1);
    },
    _getRelatedTableInfo: function(a, b) {
      var c = [];
      a &&
        y.forEach(
          a.relationships,
          f.hitch(this, function(d) {
            y.forEach(
              this._tables,
              f.hitch(this, function(e, f) {
                e.url.replace(/.*?:\/\//g, "") ===
                  (b.baseURL + d.relatedTableId).replace(/.*?:\/\//g, "") &&
                  e.popupInfo &&
                  (e.relationshipIds || (e.relationshipIds = {}),
                  (e.relationshipIds[a.id] = d.id),
                  c.push(f));
              })
            );
          })
        );
      return c;
    },
    _getRelatedRecords: function(a, b) {
      var c, d, e;
      a &&
        (b
          ? ((b = this._pollingPlaceLayer.tableInfos),
            (c = this._pollingPlaceLayer),
            (d = this._pollingRelatedRecordsPanel))
          : ((b = this._precinctLayer.tableInfos),
            (c = this._precinctLayer),
            (d = this._precintRelatedRecordsPanel)),
        d && u.empty(d),
        y.forEach(
          b,
          f.hitch(this, function(b) {
            e = a.attributes[c.objectIdField];
            this._queryRelatedRecords(c, this._tables[b], e, d);
          })
        ));
    },
    _queryRelatedRecords: function(a, b, c, d) {
      if (b && a) {
        var e = new J();
        e.objectIds = [parseInt(c, 10)];
        e.outFields = ["*"];
        e.relationshipId = b.relationshipIds[a.id];
        b.layerDefinition &&
          b.layerDefinition.definitionExpression &&
          (e.where = b.layerDefinition.definitionExpression);
        a.queryRelatedFeatures(
          e,
          f.hitch(this, function(a) {
            a = a[c];
            y.forEach(
              a ? a.features : [],
              f.hitch(this, function(a) {
                a.setInfoTemplate(new O(b.popupInfo));
                this._showPopupInfo(a, d);
              })
            );
          })
        );
      }
    },
    _showPopupInfo: function(a, b) {
      var c;
      a &&
        (u.create("div", {}, b),
        (b = new D({ class: "esriCTPopupInfo" }, void 0)),
        b.startup(),
        (c = a.getContent()),
        (a = K.byId(c.id)),
        this.own(
          d(
            a,
            "content-update",
            f.hitch(this, function() {
              this._getFeatureInfoLastNode();
            })
          )
        ),
        b.set("content", c));
    },
    _clearFeatureList: function() {
      this.featuresListNode &&
        ((this.stackedPolygons = []), u.empty(this.featuresListNode));
    },
    _clearGrahics: function() {
      this._highlightGraphicsLayer && this._highlightGraphicsLayer.clear();
    },
    _getRelatedPollingPlaces: function(a) {
      var b = new J();
      b.outFields = [this._pollingPlaceLayer.objectIdField];
      b.returnGeometry = !0;
      b.relationshipId = this.config.pollingPlaceLayerInfo.relationShipId;
      b.definitionExpression = this.config.pollingPlaceLayerInfo.definitionExpression;
      b.objectIds = [a.attributes[this._precinctLayer.objectIdField]];
      this._precinctLayer.queryRelatedFeatures(
        b,
        f.hitch(this, function(b) {
          b = (b = b[a.attributes[this._precinctLayer.objectIdField]])
            ? b.features
            : [];
          0 < b.length
            ? ((b = b[0].attributes[this._pollingPlaceLayer.objectIdField]),
              this._getPollingPlacePoint(b))
            : (this._zoomToResult(),
              this._showMessage(this.nls.noPollingPlaceFoundMsg),
              v.add(this._pollingPlaceInfoContentDiv, "esriCTHidden"),
              (this._selectedPollingPlace = null),
              this._loading.hide());
        }),
        f.hitch(this, function() {
          this._zoomToResult();
          this._loading.hide();
        })
      );
    },
    _getPollingPlacePoint: function(a) {
      var b = new M();
      b.outFields = ["*"];
      b.returnGeometry = !0;
      b.outSpatialReference = this.map.spatialReference;
      b.objectIds = [a];
      this._pollingPlaceLayer.queryFeatures(
        b,
        f.hitch(this, function(a) {
          var b, c;
          a && a.features && 0 < a.features.length
            ? (this._highlightPollingPlacePoint(a.features[0]),
              (this._selectedPollingPlace = a.features[0]),
              this._pollingPlaceLayer.infoTemplate &&
                (v.remove(this._pollingPlaceInfoContentDiv, "esriCTHidden"),
                a.features[0].setInfoTemplate(
                  this._pollingPlaceLayer.infoTemplate
                ),
                (this._pollingPlaceInfoContent = new D(
                  { class: "esriCTPopupInfo" },
                  u.create("div", {}, this._pollingPlaceInfoContentDiv)
                )),
                this._pollingPlaceInfoContent.startup(),
                (c = a.features[0].getContent()),
                (b = K.byId(c.id)),
                d(
                  b,
                  "content-update",
                  f.hitch(this, function() {
                    this._getFeatureInfoLastNode();
                  })
                ),
                this._pollingPlaceInfoContent.set("content", c),
                this._pollingPlaceLayer.hasAttachments &&
                  this.config.pollingPlaceLayerInfo.popupInfo.showAttachments &&
                  ((b = x(
                    ".attachmentsSection",
                    this._pollingPlaceInfoContentDiv
                  )[0]),
                  v.remove(b, "hidden"),
                  this._showAttachments(
                    a.features[0],
                    b,
                    this._pollingPlaceLayer
                  )),
                this._getRelatedRecords(a.features[0], !0)),
              (this._pollingPlaceLayer.infoTemplate ||
                this._precinctLayer.infoTemplate) &&
                this._showResultPanel())
            : (this._showMessage(this.nls.noPollingPlaceFoundMsg),
              v.add(this._pollingPlaceInfoContentDiv, "esriCTHidden"),
              (this._selectedPollingPlace = null),
              this._loading.hide());
          this._zoomToResult();
          this._loading.hide();
        }),
        f.hitch(this, function() {
          this._zoomToResult();
          this._loading.hide();
        })
      );
    },
    _highlightSelectedLocation: function(a) {
      var b;
      a &&
        ((b = G.fromJson(this.config.symbols.graphicLocationSymbol)),
        (this._selectedLocation = new I(a.geometry, b)),
        this._highlightGraphicsLayer.add(this._selectedLocation));
    },
    _highlightPrecinctPolygon: function(a) {
      var b = G.fromJson(this.config.symbols.precinctSymbol);
      this._highlightGraphicsLayer.add(new I(a.geometry, b));
    },
    _highlightPollingPlacePoint: function(a) {
      a = this._getPointSymbol(a, this._pollingPlaceLayer);
      this._highlightGraphicsLayer.add(a);
    },
    _zoomToResult: function() {
      var a;
      this._highlightGraphicsLayer &&
        this._highlightGraphicsLayer.graphics &&
        0 < this._highlightGraphicsLayer.graphics.length &&
        (a = H.graphicsExtent(this._highlightGraphicsLayer.graphics)) &&
        S.zoomToExtent(this.map, a.expand(1.5));
    },
    _getPointSymbol: function(a, b) {
      var c, d, f, g, h;
      d = !1;
      c = new q(
        q.STYLE_SQUARE,
        null,
        new m(m.STYLE_SOLID, new r(this.config.highlightColor), 3)
      );
      c.setColor(null);
      c.size = 30;
      if (b && b.renderer)
        if (b.renderer.symbol)
          (d = !0),
            (c = this._updatePointSymbolProperties(c, b.renderer.symbol));
        else if (b.renderer.infos && 0 < b.renderer.infos.length) {
          for (h = 0; h < b.renderer.infos.length; h++)
            b.typeIdField
              ? (f = a.attributes[b.typeIdField])
              : b.renderer.attributeField &&
                (f = a.attributes[b.renderer.attributeField]),
              (g = b.renderer.infos[h].value),
              void 0 !== f &&
                null !== f &&
                "" !== f &&
                void 0 !== g &&
                null !== g &&
                "" !== g &&
                f.toString() === g.toString() &&
                ((d = !0),
                (c = this._updatePointSymbolProperties(
                  c,
                  b.renderer.infos[h].symbol
                )));
          !d &&
            b.renderer.defaultSymbol &&
            ((d = !0),
            (c = this._updatePointSymbolProperties(
              c,
              b.renderer.defaultSymbol
            )));
        }
      b = new e(
        a.geometry.x,
        a.geometry.y,
        new A({ wkid: a.geometry.spatialReference.wkid })
      );
      return new I(b, c, a.attributes);
    },
    _updatePointSymbolProperties: function(a, b) {
      var c, d;
      b.hasOwnProperty("height") &&
        b.hasOwnProperty("width") &&
        ((c = b.height),
        (d = b.width),
        (c = (c > d ? c : d) + 10),
        (a.size = c));
      b.hasOwnProperty("size") && (!c || c < b.size) && (a.size = b.size + 10);
      b.hasOwnProperty("xoffset") && (a.xoffset = b.xoffset);
      b.hasOwnProperty("yoffset") && (a.yoffset = b.yoffset);
      return a;
    },
    _showAttachments: function(a, b, c) {
      var e, g, h, k, l;
      a = a.attributes[c.objectIdField];
      u.empty(b);
      c.queryAttachmentInfos(
        a,
        f.hitch(this, function(a) {
          if (a && 0 < a.length) {
            u.create(
              "div",
              {
                innerHTML: this.nls.attachmentHeader,
                class: "esriCTAttachmentHeader"
              },
              b
            );
            e = u.create("div", { class: "esriCTThumbnailContainer" }, b);
            for (l = 0; l < a.length; l++)
              (k = this.folderUrl + "/images/no-attachment.png"),
                -1 < a[l].contentType.indexOf("image") && (k = a[l].url),
                (h = u.create(
                  "span",
                  { class: "esriCTAttachmentHolder col" },
                  e
                )),
                v.add(h, "esriCTImageLoader"),
                (g = u.create(
                  "img",
                  {
                    alt: a[l].url,
                    class: "esriCTAttachmentImg esriCTAutoHeight",
                    src: k,
                    role: "button",
                    "aria-label": a[l].name || a[l].url,
                    tabindex: "0"
                  },
                  h
                )),
                this.own(d(g, "load", f.hitch(this, this._onImageLoad))),
                this.own(
                  d(g, "click", f.hitch(this, this._displayImageAttachments))
                ),
                this.own(d(g, "keydown", f.hitch(this, this._imageKeyDown)));
            this._getFeatureInfoLastNode();
          }
          K.byId(this.domNode.parentElement.id).resize();
        })
      );
    },
    _imageKeyDown: function(a) {
      (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
        this._displayImageAttachments(a);
    },
    _setImageDimensions: function(a) {
      var b, c;
      c = a.parentElement;
      a &&
        0 < a.offsetHeight &&
        (E.set(a, "originalHeight", a.offsetHeight),
        C.set(a, "maxHeight", a.offsetHeight + "px"),
        C.set(a, "maxWidth", a.offsetWidth + "px"));
      b = parseFloat(E.get(a, "originalHeight"));
      0 < c.offsetHeight &&
        (c.offsetHeight < a.offsetHeight || b > c.offsetHeight) &&
        ((b = a.offsetWidth / a.offsetHeight),
        (c = c.offsetHeight - 2),
        (b = Math.floor(c * b)),
        v.remove(a, "esriCTAutoHeight"),
        C.set(a, "width", b + "px"),
        C.set(a, "height", c + "px"));
    },
    _displayImageAttachments: function(a) {
      window.open(a.target.alt);
    },
    _onImageLoad: function(a) {
      v.remove(a.target.parentNode, "esriCTImageLoader");
      this._setImageDimensions(a.target, !0);
    },
    _routeSelectedLocations: function() {
      var c = [],
        d = {};
      this._directionsWidget ||
        ((d = {
          map: this.map,
          directionsLengthUnits: a[this.config.directionLengthUnit.value],
          showTrafficOption: !1,
          dragging: !1,
          routeSymbol: G.fromJson(this.config.symbols.routeSymbol),
          routeTaskUrl: this.config.routeService
        }),
        (this._directionsWidget = new b(
          d,
          u.create("div", {}, this._directionPanel)
        )),
        this._directionsWidget.startup());
      this.own(
        this._directionsWidget.on(
          "directions-finish",
          f.hitch(this, function() {
            this.id && K.byId(this.id) && K.byId(this.id).resize();
            S.initLastFocusNode(
              this.domNode,
              S.getFocusNodesInDom(this._directionsWidget.domNode).reverse()[0]
            );
            this._loading.hide();
          })
        )
      );
      this._directionsWidget.clearDirections();
      this._selectedLocation &&
        this._selectedPollingPlace &&
        (this._loading.show(),
        c.push(this._selectedLocation),
        c.push(this._selectedPollingPlace),
        this._directionsWidget.updateStops(c).then(
          f.hitch(this, function() {
            this._directionsWidget.getDirections();
            this._routeCalculated = !0;
          }),
          f.hitch(this, function() {
            this._showMessage(this.nls.failedToGenerateRouteMsg);
            this._loading.hide();
          })
        ));
    },
    _onWindowResize: function() {
      this._windowResizeTimer && clearTimeout(this._windowResizeTimer);
      this._windowResizeTimer = setTimeout(
        f.hitch(this, this._resetComponents),
        500
      );
    },
    _resetComponents: function() {
      var a, b, c;
      c = [];
      b = x(".arcgisSearch .searchGroup", this.domNode)[0];
      c = x(".jimu-tab \x3e .jimu-viewstack", this.domNode);
      c.push(this.domNode);
      y.forEach(
        c,
        f.hitch(this, function(a) {
          C.set(a, "-webkit-overflow-scrolling", "auto");
        })
      );
      this._searchContainerNodeElement ||
        (this._searchContainerNodeElement = x(
          ".arcgisSearch .searchGroup .searchInput",
          this.domNode
        )[0]);
      this.widgetMainNode &&
        this._searchContainerNodeElement &&
        (a = N.position(this.widgetMainNode)) &&
        a.w &&
        ((a = a.w - 144),
        this._hasMulitpleSourcesInSearch || (a += 32),
        0 < a &&
          (this.config.showLocationTool && (a -= 45),
          this._searchContainerNodeElement.style.setProperty(
            "width",
            a + "px",
            "important"
          ),
          b && b.style.setProperty("max-width", "100%", "important")));
      0 < c.length &&
        setTimeout(
          f.hitch(this, function() {
            y.forEach(
              c,
              f.hitch(this, function(a) {
                C.set(a, "-webkit-overflow-scrolling", "touch");
              })
            );
          }),
          500
        );
    },
    _attachEventToTab: function() {
      "" !== this.tabContainer &&
        null !== this.tabContainer &&
        void 0 !== this.tabContainer &&
        this.tabContainer.controlNodes &&
        1 < this.tabContainer.controlNodes.length &&
        this.own(
          d(
            this.tabContainer.controlNodes[1],
            "keydown",
            f.hitch(this, function(a) {
              a.keyCode === n.TAB &&
                !a.shiftKey &&
                this.tabContainer.viewStack &&
                this.tabContainer.viewStack.getSelectedLabel() ===
                  this.nls.informationTabTitle &&
                (U.stop(a),
                2 > this._searchInstance.search.sources.length
                  ? X.focus(this._searchInstance.search.inputNode)
                  : X.focus(this._searchInstance.search.sourcesBtnNode));
            })
          )
        );
    }
  });
});
