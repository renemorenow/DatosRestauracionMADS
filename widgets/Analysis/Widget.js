// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "widgets/Analysis/a11y/Widget": function() {
      define("dojo/_base/lang dojo/_base/html dojo/dom-attr dojo/dom-construct dojo/query dojo/on dojo/keys dijit/a11yclick jimu/utils".split(
        " "
      ), function(k, d, b, e, g, q, u, x, A) {
        return {
          a11y_initFirstFocusNode: function() {
            A.initFirstFocusNode(this.domNode, this.toolsSection);
          },
          a11y_initLastFocusNode: function() {
            var b = g(".tools-table-item", this.toolsTbody);
            (b = b[b.length - 1]) && A.initLastFocusNode(this.domNode, b);
          },
          a11y_addTool: function(d, g, q) {
            var v = A.getUUID();
            b.set(d, "role", "button");
            b.set(d, "tabindex", "0");
            var k = "jimuUniq_name_" + v;
            b.set(g, "id", k);
            !0 === q
              ? b.set(d, "aria-labelledby", k)
              : ((g = "jimuUniq_tip_" + v),
                e.create(
                  "div",
                  {
                    id: g,
                    class: "icon-section screen-readers-only",
                    innerHTML: this.nls.toolNotAvailable
                  },
                  d
                ),
                b.set(d, "aria-disabled", "true"),
                b.set(d, "aria-labelledby", k + " " + g));
          },
          a11y_analysisTool_backBtn: function(g, e) {
            b.set(g, "role", "button");
            b.set(g, "tabindex", "0");
            this.currentAnalysisDijit.own(
              q(
                g,
                "keydown",
                k.hitch(this, function(b) {
                  b.keyCode === u.TAB &&
                    (b.preventDefault(),
                    b.shiftKey
                      ? this.toolPanel.focus()
                      : ("none" !== d.getStyle(e, "display")
                          ? e
                          : this.toolPanel
                        ).focus());
                })
              )
            );
          },
          a11y_analysisTool_submitBtn: function(b, e) {
            if ("none" !== d.getStyle(e, "display")) {
              var v = g('[role\x3d"button"]', e)[0],
                z = d.getAttr(v, "aria-labelledby");
              d.setAttr(e, "aria-labelledby", z);
              d.setAttr(e, "tabindex", "0");
              d.setAttr(e, "role", "button");
              this.currentAnalysisDijit.own(
                q(
                  e,
                  x,
                  k.hitch(this, function() {
                    v.click();
                  })
                )
              );
              this.currentAnalysisDijit.own(
                q(
                  e,
                  "keydown",
                  k.hitch(this, function(d) {
                    d.keyCode === u.TAB &&
                      (d.preventDefault(),
                      d.shiftKey
                        ? (b ? b : this.toolPanel).focus()
                        : this.toolPanel.focus());
                  })
                )
              );
            } else e = b ? b : this.toolPanel;
            1 === this.toolCountInList &&
              (A.initFirstFocusNode(this.domNode, this.toolPanel),
              A.initLastFocusNode(this.domNode, e));
          },
          a11y_analysisTool_toolPanel: function(b, e) {
            this.own(
              q(
                this.toolPanel,
                "keydown",
                k.hitch(this, function(g) {
                  if (g.keyCode === u.ESCAPE && b)
                    g.stopPropagation(), b.focus();
                  else if (
                    d.hasClass(g.target, "tool-panel") &&
                    g.keyCode === u.TAB
                  ) {
                    g.preventDefault();
                    var q = "none" !== d.getStyle(e, "display") ? e : null,
                      v;
                    g.shiftKey
                      ? (v = q || b || this.toolPanel)
                      : g.shiftKey || (v = b || q || this.toolPanel);
                    v.focus();
                  }
                })
              )
            );
          },
          a11y_updateTitleForMsgDom: function(b, g) {
            var e = d.getAttr(this.toolTitle, "id"),
              q = d.getAttr(this.messageStatusNode, "id"),
              e = [e, q];
            b === g.STATUS_SUCCEEDED && e.push(d.getAttr(this.outputtip, "id"));
            d.setAttr(this.messagePanel, "aria-labelledby", e.join(" "));
          },
          a11y_addAttrsAndEventForCancelBtn: function(d) {
            b.set(d, "role", "button");
            b.set(d, "tabindex", "0");
            this.own(
              q(
                d,
                "keydown",
                k.hitch(this, function(b) {
                  b.shiftKey ||
                    b.keyCode !== u.TAB ||
                    (b.preventDefault(), this.messagePanel.focus());
                })
              )
            );
          },
          a11y_addAttrsForOutputLink: function(d) {
            b.set(d, "role", "link");
          },
          a11y_addAttrsForExportNode: function(d) {
            b.set(d, "role", "button");
            b.set(d, "aria-haspopup", "true");
            b.set(d, "aria-label", this.nls.action);
            b.set(d, "tabindex", "0");
          },
          a11y_addMessagePanelEvent: function() {
            this.own(
              q(
                this.messagePanel,
                "keydown",
                k.hitch(this, function(b) {
                  if (b.keyCode === u.ESCAPE)
                    b.stopPropagation(),
                      "none" !== d.getStyle(this.buttonSection, "display") &&
                        this.backBtn.focus();
                  else if (
                    d.hasClass(b.target, "message-panel") &&
                    b.keyCode === u.TAB
                  ) {
                    var e =
                      g(".job-cancel-icon", this.messageSection)[0] ||
                      ("none" !== d.getStyle(this.buttonSection, "display")
                        ? this.homeBtn
                        : null);
                    e
                      ? b.shiftKey && (b.preventDefault(), e.focus())
                      : b.preventDefault();
                  }
                })
              )
            );
          },
          a11y_switchToPrevious: function(b) {
            (b.keyCode !== u.ENTER && b.keyCode !== u.SPACE) ||
              this._switchToPrevious();
          },
          a11y_switchToHome: function(b) {
            b.keyCode === u.ENTER || b.keyCode === u.SPACE
              ? this._switchToHome()
              : b.shiftKey ||
                b.keyCode !== u.TAB ||
                (b.preventDefault(), this.messagePanel.focus());
          },
          a11y_switchView_toolList: function() {
            1 === this.toolCountInList
              ? this.toolPanel.focus()
              : this.toolsSection.focus();
          },
          a11y_switchView_others: function(b, d) {
            b === d ? this.toolPanel.focus() : this.messagePanel.focus();
          }
        };
      });
    },
    "esri/tasks/JobInfo": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "./GPMessage"
      ], function(k, d, b, e, g) {
        k = k(null, {
          declaredClass: "esri.tasks.JobInfo",
          constructor: function(b) {
            this.messages = [];
            d.mixin(this, b);
            b = this.messages;
            var e,
              q = b.length;
            for (e = 0; e < q; e++) b[e] = new g(b[e]);
          },
          jobId: "",
          jobStatus: ""
        });
        d.mixin(k, {
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
        b("extend-esri") && d.setObject("tasks.JobInfo", k, e);
        return k;
      });
    },
    "esri/tasks/GPMessage": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e) {
        k = k(null, {
          declaredClass: "esri.tasks.GPMessage",
          constructor: function(b) {
            d.mixin(this, b);
          }
        });
        d.mixin(k, {
          TYPE_INFORMATIVE: "esriJobMessageTypeInformative",
          TYPE_PROCESS_DEFINITION: "esriJobMessageTypeProcessDefinition",
          TYPE_PROCESS_START: "esriJobMessageTypeProcessStart",
          TYPE_PROCESS_STOP: "esriJobMessageTypeProcessStop",
          TYPE_WARNING: "esriJobMessageTypeWarning",
          TYPE_ERROR: "esriJobMessageTypeError",
          TYPE_EMPTY: "esriJobMessageTypeEmpty",
          TYPE_ABORT: "esriJobMessageTypeAbort"
        });
        b("extend-esri") && d.setObject("tasks.GPMessage", k, e);
        return k;
      });
    },
    "esri/dijit/analysis/utils": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/event dojo/_base/fx dojo/_base/json dojo/_base/kernel dojo/dom-attr dojo/has dojo/i18n dojo/io-query dojo/i18n!../../nls/jsapi dojo/json dojo/string dojo/query dojo/date/locale dojo/dom-style dojo/dom-class dojo/dom-construct dojo/Deferred dojo/promise/all dojo/fx/easing dojo/number dojo/_base/window dojo/when dojo/dom dojo/on dojo/data/ItemFileWriteStore dojo/topic dojo/store/Memory dojox/mvc/equals dijit/registry dijit/Dialog dijit/form/CheckBox ../../kernel ../../lang ../../units ../../request ./HelpWindow ../../tasks/query ../../dijit/BrowseItems ../../layers/FeatureLayer ./PluginAnalysisLayers ../../tasks/Geoprocessor ../../dijit/SingleFilter ./FeatureRecordSetLayer ./PluginLayers ./PCSList ./ItemTypes ../../layers/ArcGISImageServiceLayer ../../layers/RasterFunction ./AnalysisRegistry".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q,
        K,
        r,
        a,
        c,
        n,
        h,
        l,
        F,
        V,
        P,
        R,
        U,
        Z,
        B,
        D,
        X,
        aa,
        Y,
        ba,
        f,
        O,
        S,
        W,
        ca,
        fa,
        da,
        T,
        ea,
        ga,
        G
      ) {
        k = {};
        d.mixin(k, {
          _helpDialog: null,
          systemRFTGroupName: "Raster Function Templates",
          i18n: null,
          UNITSMAP: {
            Feet: "esriFeet",
            Yards: "esriYards",
            Miles: "esriMiles",
            Meters: "esriMeters",
            Kilometers: "esriKilometers",
            NauticalMiles: "esriNauticalMiles"
          },
          initHelpLinks: function(a, h, f) {
            if (a) {
              var m = P.byNode(a),
                c = m
                  ? m.get("helpFileName")
                  : f && f.helpFileName
                  ? f.helpFileName
                  : null,
                L = m
                  ? m.get("isSingleTenant")
                  : f && f.isSingleTenant
                  ? f.isSingleTenant
                  : !1,
                l = G.Modes.standard,
                b =
                  m && m.portalSelf
                    ? m.portalSelf.helpBase
                    : f && f.helpBase
                    ? f.helpBase
                    : null,
                r = m && m.portalSelf;
              this._helpDialog ||
                (this._helpDialog = new aa({ isPortal: L, portalSelf: r }));
              (m && (m.showGeoAnalyticsParams || m.showBigData)) ||
              (f && f.analysisMode && f.analysisMode === G.Modes.Bigdata)
                ? ((c += "_bd"), (l = G.Modes.Bigdata))
                : f &&
                  f.analysisMode &&
                  "raster" === f.analysisMode &&
                  ((c += "_ra"), (l = G.Modes.Raster));
              t("[esriHelpTopic]", a).forEach(function(r, F, e) {
                r &&
                  (N.set(
                    r,
                    "display",
                    B.isDefined(h) && !0 !== h ? "none" : ""
                  ),
                  B.isDefined(r._helpClickHandler) &&
                    (r._helpClickHandler.remove(),
                    (r._helpClickHandler = null)),
                  (r._helpClickHandler = n(
                    r,
                    "click",
                    d.hitch(this, function(h) {
                      g.stop(h);
                      f && f.showHelpFromUrl && f.helpUrl
                        ? this._helpDialog.show(h, {
                            showHelpFromUrl: f.showHelpFromUrl,
                            helpUrl: f.helpUrl
                          })
                        : this._helpDialog.show(h, {
                            helpId: A.get(r, "esriHelpTopic"),
                            helpFileName: c,
                            analysisGpServer:
                              f && f.analysisGpServer
                                ? f.analysisGpServer
                                : null,
                            helpParentNode: a,
                            isPortal: L,
                            analysisMode: l,
                            helpBase: b,
                            portalSelf: m && m.portalSelf
                          });
                    })
                  )));
              }, this);
            }
          },
          constructAnalysisFeatColl: function(a) {
            var m = {},
              f;
            m.featureCollection = a.layerDefinition;
            for (f in m.featureCollection)
              m.featureCollection.hasOwnProperty(f) &&
                "objectIdField" === f &&
                ((m.featureCollection.objectIdFieldName = d.clone(
                  m.featureCollection.objectIdField
                )),
                delete m.featureCollection.objectIdField);
            m.featureCollection.features = a.featureSet.features;
            return m;
          },
          constructAnalysisInputLyrObj: function(a, f, h) {
            var m = {},
              c,
              L = "";
            B.isDefined(h) || (h = !0);
            a.getMap ? (c = a.getMap()) : a._map && (c = a._map);
            if (a.url && !a._collection)
              (m = { url: a.url }),
                this.isHostedService(a.url),
                a.getDefinitionExpression && a.getDefinitionExpression()
                  ? (m.filter = a.getDefinitionExpression())
                  : B.isDefined(a.definitionExpression) &&
                    "" !== a.definitionExpression &&
                    (m.filter = a.definitionExpression),
                a.useMapTime &&
                  a.timeInfo &&
                  c &&
                  c.timeExtent &&
                  h &&
                  (c.timeExtent.startTime
                    ? ((L += c.timeExtent.startTime.getTime()),
                      c.timeExtent.endTime &&
                        (L += "," + c.timeExtent.endTime.getTime()))
                    : c.timeExtent.endTime &&
                      (L += c.timeExtent.endTime.getTime()),
                  L && (m.time = L)),
                a.credential && (m.serviceToken = a.credential.token),
                -1 !== m.url.indexOf("?") &&
                  ((h = m.url.substring(m.url.indexOf("?") + 1, m.url.length)),
                  (h = E.queryToObject(h)),
                  d.mixin(m, h),
                  (m.url = m.url.substring(0, m.url.indexOf("?"))));
            else if (!a.url || a._collection)
              try {
                m = a.toJson();
              } catch (ia) {
                (a._json = w.parse(a._json)), (m = a.toJson());
              }
            m.name = a.name;
            f && (m = new ca(m));
            return m;
          },
          formatDate: function(a) {
            return (
              C.format(a, { datePattern: "yyyy-MM-dd", selector: "date" }) +
              " " +
              C.format(a, { selector: "time", timePattern: "HH:mm:ss" })
            );
          },
          isHostedService: function(a) {
            if (!a) return !1;
            var m = -1 !== a.indexOf(".arcgis.com/");
            a =
              -1 !== a.indexOf("//services") ||
              -1 !== a.indexOf("//tiles") ||
              -1 !== a.indexOf("//features");
            return m && a;
          },
          isPortalHostedService: function(a) {
            return a ? -1 !== a.toLowerCase().indexOf("/hosted/") : !1;
          },
          isTimeEnabled: function(a) {
            var m = 10.2 <= a.version && a._useStandardizedQueries;
            return (
              (a.useMapTime && a.timeInfo && (m || 10.2 <= a.version)) ||
              B.isDefined(a.time)
            );
          },
          isTimeInstantLayer: function(a) {
            return (
              (B.isDefined(a.timeInfo) &&
                B.isDefined(a.timeInfo.startTimeField) &&
                !B.isDefined(a.timeInfo.endTimeField)) ||
              (B.isDefined(a.time) &&
                B.isDefined(a.time.timeType) &&
                "instant" === a.time.timeType)
            );
          },
          buildReport: function(a, f) {
            var m = "";
            f || ((f = {}), d.mixin(f, y.analysisMsgCodes));
            b.forEach(
              a,
              function(a, h) {
                var c, L, l;
                "string" === typeof a.message
                  ? ((c = B.isDefined(f[a.messageCode])
                      ? f[a.messageCode]
                      : a.message),
                    (m +=
                      a.style.substring(0, a.style.indexOf("\x3c/")) +
                      (this._isEmptyObject(a.params)
                        ? c
                        : p.substitute(c, a.params)) +
                      a.style.substring(a.style.indexOf("\x3c/"))))
                  : d.isArray(a.message) &&
                    ((l = []),
                    (L = d.clone(a.style)),
                    b.forEach(
                      a.message,
                      function(m, h) {
                        L = L.replace(/<\//, "${" + h + "}");
                        c = B.isDefined(f[a.messageCode + "_" + h])
                          ? f[a.messageCode + "_" + h]
                          : m;
                        c = this._isEmptyObject(a.params)
                          ? c
                          : p.substitute(c, a.params);
                        "string" === typeof c && (c = this.safetagsReplace(c));
                        l.push(c + "\x3c/");
                      },
                      this
                    ),
                    (L = p.substitute(L, l)),
                    (m += L));
              },
              this
            );
            return m;
          },
          getLayerFeatureCount: function(a, f) {
            var m = new Y(),
              h = new J();
            f || (f = {});
            m.geometry = f.geometry;
            m.geometryType = f.geometryType || "esriGeometryEnvelope";
            a.url || m.geometry
              ? (a.url &&
                  ((m.where = f.where || "1\x3d1"),
                  a.getDefinitionExpression &&
                  a.getDefinitionExpression() &&
                  !f.where
                    ? (m.where = a.getDefinitionExpression())
                    : B.isDefined(a.definitionExpression) &&
                      "" !== a.definitionExpression &&
                      !f.where &&
                      (m.where = a.definitionExpression)),
                (h = a.queryCount(m)))
              : h.resolve(a.graphics.length);
            return h.promise;
          },
          createPolygonFeatureCollection: function(a) {
            var m;
            m = {
              layerDefinition: null,
              featureSet: {
                features: [],
                geometryType: G.GeometryTypes.Polygon
              }
            };
            m.layerDefinition = {
              currentVersion: 10.2,
              copyrightText: "",
              defaultVisibility: !0,
              relationships: [],
              isDataVersioned: !1,
              supportsRollbackOnFailureParameter: !0,
              supportsStatistics: !0,
              supportsAdvancedQueries: !0,
              geometryType: G.GeometryTypes.Polygon,
              minScale: 0,
              maxScale: 0,
              objectIdField: "OBJECTID",
              templates: [],
              type: "Feature Layer",
              displayField: "TITLE",
              visibilityField: "VISIBLE",
              name: a,
              hasAttachments: !1,
              typeIdField: "TYPEID",
              capabilities: "Query",
              allowGeometryUpdates: !0,
              htmlPopupType: "",
              hasM: !1,
              hasZ: !1,
              globalIdField: "",
              supportedQueryFormats: "JSON",
              hasStaticData: !1,
              maxRecordCount: -1,
              indexes: [],
              types: [],
              drawingInfo: {
                renderer: {
                  type: "simple",
                  symbol: {
                    color: [0, 0, 0, 255],
                    outline: {
                      color: [0, 0, 0, 255],
                      width: 3,
                      type: "esriSLS",
                      style: "esriSLSSolid"
                    },
                    type: "esriSFS",
                    style: "esriSFSNull"
                  },
                  label: "",
                  description: ""
                },
                transparency: 0,
                labelingInfo: null,
                fixedSymbols: !0
              },
              fields: [
                {
                  alias: "OBJECTID",
                  name: "OBJECTID",
                  type: "esriFieldTypeOID",
                  editable: !1
                },
                {
                  alias: "Title",
                  name: "TITLE",
                  length: 50,
                  type: "esriFieldTypeString",
                  editable: !0
                },
                {
                  alias: "Visible",
                  name: "VISIBLE",
                  type: "esriFieldTypeInteger",
                  editable: !0
                },
                {
                  alias: "Description",
                  name: "DESCRIPTION",
                  length: 1073741822,
                  type: "esriFieldTypeString",
                  editable: !0
                },
                {
                  alias: "Type ID",
                  name: "TYPEID",
                  type: "esriFieldTypeInteger",
                  editable: !0
                }
              ]
            };
            return m;
          },
          createPointFeatureCollection: function(a) {
            var m;
            m = {
              layerDefinition: null,
              featureSet: { features: [], geometryType: G.GeometryTypes.Point }
            };
            m.layerDefinition = {
              objectIdField: "OBJECTID",
              templates: [],
              type: "Feature Layer",
              drawingInfo: {
                renderer: {
                  field1: "TYPEID",
                  type: "simple",
                  symbol: {
                    height: 24,
                    xoffset: 0,
                    yoffset: 12,
                    width: 24,
                    contentType: "image/png",
                    type: "esriPMS",
                    url:
                      "http://static.arcgis.com/images/Symbols/Basic/GreenStickpin.png"
                  },
                  description: "",
                  value: "0",
                  label: "Stickpin"
                }
              },
              displayField: "TITLE",
              visibilityField: "VISIBLE",
              name: a,
              hasAttachments: !1,
              typeIdField: "TYPEID",
              capabilities: "Query",
              types: [],
              geometryType: G.GeometryTypes.Point,
              fields: [
                {
                  alias: "OBJECTID",
                  name: "OBJECTID",
                  type: "esriFieldTypeOID",
                  editable: !1
                },
                {
                  alias: "Title",
                  name: "TITLE",
                  length: 50,
                  type: "esriFieldTypeString",
                  editable: !0
                },
                {
                  alias: "Visible",
                  name: "VISIBLE",
                  type: "esriFieldTypeInteger",
                  editable: !0
                },
                {
                  alias: "Description",
                  name: "DESCRIPTION",
                  length: 1073741822,
                  type: "esriFieldTypeString",
                  editable: !0
                },
                {
                  alias: "Type ID",
                  name: "TYPEID",
                  type: "esriFieldTypeInteger",
                  editable: !0
                }
              ]
            };
            return m;
          },
          createFolderStore: function(a, f) {
            var m = new h({
              data: { identifier: "id", label: "name", items: [] }
            });
            m.newItem({ name: f, id: "" });
            b.forEach(a, function(a) {
              m.newItem({ name: a.title, id: a.id });
            });
            return m;
          },
          setupFoldersUI: function(a) {
            a.folderSelect.set("store", a.folderStore);
            a.folderSelect.set("required", !0);
            a.folderSelect.set("searchAttr", "name");
            B.isDefined(a.folderId)
              ? a.folderStore.get(a.folderId).then(
                  d.hitch(this, function(m) {
                    B.isDefined(m)
                      ? a.folderSelect.set("item", m)
                      : a.folderStore.get("").then(function(m) {
                          a.folderSelect.set("item", m);
                        }, this);
                  })
                )
              : a.folderName
              ? a.folderStore.fetch({
                  query: { name: a.folderName },
                  onComplete: d.hitch(this, function(m) {
                    B.isDefined(m) && 0 < m.length
                      ? a.folderSelect.set("item", m[0])
                      : a.folderStore.get("").then(function(m) {
                          a.folderSelect.set("item", m);
                        }, this);
                  })
                })
              : a.username
              ? a.folderSelect.set("displayedValue", a.username)
              : a.folderStore.get("").then(function(m) {
                  a.folderSelect.set("item", m);
                }, this);
          },
          _isEmptyObject: function(a) {
            for (var m in a) if (a.hasOwnProperty(m)) return !1;
            return !0;
          },
          validateServiceName: function(a, f) {
            var m = /(:|&|<|>|%|#|\?|\\|\"|\/|\+|=|\*|@|\'|;|\||,)/g.test(a),
              h = !0,
              c,
              l,
              L = !0;
            B.isDefined(f) && f.textInput && (l = f.textInput);
            B.isDefined(f) && B.isDefined(f.isItem) && (L = f.isItem);
            this.initI18n();
            if (0 === a.length || 0 === p.trim(a).length)
              (c = this.i18n.requiredValue), (h = !1);
            else if (m) (c = this.i18n.invalidServiceName), (h = !1);
            else if (L && 98 < a.length)
              (c = this.i18n.invalidServiceNameLength), (h = !1);
            else if (L && 170 < encodeURIComponent(a).length) {
              for (a += ""; 170 < encodeURIComponent(a).length; )
                a = a.substring(0, a.length - 1);
              c = p.substitute(this.i18n.suggestedServiceNameLength, {
                count: a.length
              });
              h = !1;
            }
            l && !h && l.set("invalidMessage", c);
            return h;
          },
          getStepNumber: function(a) {
            t(".esriAnalysisNumberLabel", a).forEach(function(a, m) {
              m = this._getNumberLabel(m);
              A.set(a, "innerHTML", m);
            }, this);
          },
          _getNumberLabel: function(a) {
            var m = "";
            this.initI18n();
            switch (a) {
              case 0:
                m = this.i18n.oneLabel;
                break;
              case 1:
                m = this.i18n.twoLabel;
                break;
              case 2:
                m = this.i18n.threeLabel;
                break;
              case 3:
                m = this.i18n.fourLabel;
                break;
              case 4:
                m = this.i18n.fiveLabel;
                break;
              case 5:
                m = this.i18n.sixLabel;
                break;
              case 6:
                m = this.i18n.sevenLabel;
                break;
              case 7:
                m = this.i18n.eightLabel;
                break;
              case 8:
                m = this.i18n.nineLabel;
            }
            return m;
          },
          populateAnalysisLayers: function(a, f, h, c) {
            if (a) {
              var m = [],
                l = a.get(f);
              f = a._analysisSelect || c.layerSelect;
              a.rerun && !l && (c || (c = {}), (c.chooseBlank = !0));
              a._titleRow && N.set(a._titleRow, "display", "none");
              a._analysisLabelRow &&
                N.set(a._analysisLabelRow, "display", "table-row");
              a._selectAnalysisRow &&
                (N.set(a._selectAnalysisRow, "display", "table-row"),
                N.set(
                  a._analysisSelect.domNode.parentNode,
                  "padding-bottom",
                  "1em"
                ));
              a.domNode && this.getStepNumber(a.domNode);
              B.isDefined(c) &&
                c.chooseLabel &&
                m.push({ value: -1, label: this.i18n.chooseLabel });
              B.isDefined(c) &&
                c.chooseBlank &&
                m.push({ value: "  ", label: "" });
              (B.isDefined(c) && B.isDefined(c.posIncrement)) ||
                (B.isDefined(c) || (c = {}), (c.posIncrement = 0));
              a.get(h) || a.set(h, []);
              b.forEach(
                a.get(h),
                function(a, f) {
                  f += c.posIncrement;
                  f = {
                    value:
                      B.isDefined(c) && c.chooseLabel ? "" + f + 1 : "" + f,
                    label: a.name
                  };
                  l &&
                    (a.name === l.name ||
                      (a.url && l.url && a.url === l.url)) &&
                    (f.selected = !0);
                  m.push(f);
                },
                this
              );
              f.addOption(m);
              f.set("required", !0);
              c.chooseBlank &&
                "  " === f.get("value") &&
                setTimeout(d.hitch(this, this._validateSelectUI, f), 100);
            }
          },
          isValidAnalysisLayer: function(a) {
            var m,
              f,
              c,
              h,
              l,
              n,
              d,
              r = "",
              F = !0;
            m = { isValid: F, validationMessage: r };
            var e,
              O,
              g = 0,
              S = 0,
              t = 0,
              q,
              V,
              k,
              W = !0;
            if (!B.isDefined(a) || !B.isDefined(a.toolName)) return m;
            this.initI18n();
            m = a.toolName;
            f = a.layers;
            c = a.analysisLayer;
            h = m.charAt(0).toLowerCase() + m.substring(1);
            d = this.i18n;
            a = a.showReadyToUseLayers || !1;
            b.forEach(
              f,
              function(a) {
                W = !1;
                a instanceof ea && (q = !0);
                q && 1 < a.bandCount && (V = !0);
                q && 1 === a.bandCount && (k = !0);
                a.geometryType === G.GeometryTypes.Point && ((n = !0), g++);
                if (
                  a.geometryType === G.GeometryTypes.Point ||
                  a.geometryType === G.GeometryTypes.MultiPoint
                )
                  e = !0;
                a.geometryType === G.GeometryTypes.Line && ((O = !0), t++);
                a.geometryType === G.GeometryTypes.Polygon && ((l = !0), S++);
              },
              this
            );
            -1 !==
              b.indexOf(
                [
                  "CreateDriveTimeAreas",
                  "PlanRoutes",
                  "ConnectOriginsToDestinations"
                ],
                m
              ) &&
            (!n || (c && c.geometryType !== G.GeometryTypes.Point))
              ? ((r = p.substitute(this.i18n.selectPointLayer, {
                  toolName: d[h]
                })),
                (F = !1))
              : ("AggregatePoints" !== m && "InterpolatePoints" !== m) ||
                ((!c ||
                  c.geometryType === G.GeometryTypes.Point ||
                  c.geometryType === G.GeometryTypes.MultiPoint) &&
                  e)
              ? "CalculateDensity" === m &&
                ((!e && !O) ||
                  (c &&
                    c.geometryType !== G.GeometryTypes.Point &&
                    c.geometryType !== G.GeometryTypes.MultiPoint &&
                    c.geometryType !== G.GeometryTypes.Line))
                ? ((r = p.substitute(this.i18n.areaFeatureInvalidMsg, {
                    toolName: d[h]
                  })),
                  (F = !1))
                : ("FindHotSpots" !== m && "FindOutliers" !== m) ||
                  a ||
                  !(
                    (!e && !l) ||
                    (c &&
                      c.geometryType !== G.GeometryTypes.Point &&
                      c.geometryType !== G.GeometryTypes.MultiPoint &&
                      c.geometryType !== G.GeometryTypes.Polygon)
                  )
                ? ("OverlayLayers" !== m &&
                    "AggregatePoints" !== m &&
                    "SummarizeWithin" !== m &&
                    "SummarizeNearby" !== m &&
                    "FindNearest" !== m &&
                    "MergeLayers" !== m) ||
                  a ||
                  (0 !== f.length &&
                    (1 !== f.length || (f[0] !== c && B.isDefined(c))))
                  ? "ConnectOriginsToDestinations" === m && !a && (W || 2 > g)
                    ? ((r = p.substitute(this.i18n.odPointMsg, {
                        toolName: d[h]
                      })),
                      (F = !1))
                    : this.isFindCentroids(m) && this.isPointLayer(c)
                    ? ((r = p.substitute(this.i18n.selectNoPointLayer, {
                        toolName: d[h]
                      })),
                      (F = !1))
                    : "AggregatePoints" === m && !a && 1 < f.length
                    ? ((l = b.some(f, function(a) {
                        return a.geometryType === G.GeometryTypes.Polygon;
                      })),
                      l ||
                        ((r = p.substitute(this.i18n.aggregatePolyMsg, {
                          toolName: d[h]
                        })),
                        (F = !1)))
                    : "MergeLayers" === m && !a && 1 < f.length
                    ? 1 < g ||
                      1 < t ||
                      1 < S ||
                      ((r = this.i18n.mergeValidationMsg), (F = !1))
                    : ("SummarizeWithin" !== m && "DissolveBoundaries" !== m) ||
                      ((!c || c.geometryType === G.GeometryTypes.Polygon) &&
                        l) ||
                      a
                    ? "ExtractData" === m
                      ? (F = b.some(f, function(a) {
                          return -1 !== a.capabilities.indexOf("Extract");
                        })) ||
                        (r = p.substitute(this.i18n.extractValidationMsg))
                      : ("ConnectOriginsToDestinations" === m ||
                          m === G.Tools.ChooseBestFacilities) &&
                        1 < f.length
                      ? ((n = b.some(f, function(a) {
                          var m = B.isDefined(c) && c.id === a.id;
                          return a.geometryType === G.GeometryTypes.Point && !m;
                        })),
                        n ||
                          ((r = p.substitute(
                            m === G.Tools.ChooseBestFacilities
                              ? this.i18n.selectPointLayer
                              : this.i18n.odPointMsg,
                            { toolName: d[h] }
                          )),
                          (F = !1)))
                      : "CalculateSlope" === m ||
                        "DeriveAspect" === m ||
                        "RemapValues" === m
                      ? q
                        ? k ||
                          ((F = !1),
                          (r = p.substitute(this.i18n.noSingleBandISMsg, {
                            toolName: d[h]
                          })))
                        : ((F = !1),
                          (r = p.substitute(this.i18n.noImageServiceMsg, {
                            toolName: d[h]
                          })))
                      : "ExtractRaster" === m
                      ? q ||
                        ((F = !1),
                        (r = p.substitute(this.i18n.noImageServiceMsg, {
                          toolName: d[h]
                        })))
                      : "MonitorVegetation" === m &&
                        (q
                          ? V ||
                            ((F = !1),
                            (r = p.substitute(this.i18n.noMultiBandISMsg, {
                              toolName: d[h]
                            })))
                          : ((F = !1),
                            (r = p.substitute(this.i18n.noImageServiceMsg, {
                              toolName: d[h]
                            }))))
                    : ((r = p.substitute(this.i18n.selectPolyLayer, {
                        toolName: d[h]
                      })),
                      (F = !1))
                  : ((r = p.substitute(this.i18n.overlayValidationMsg, {
                      toolName: d[h]
                    })),
                    (F = !1))
                : ((r = p.substitute(this.i18n.hotspotsLineFeatureMsg, {
                    toolName: d[h]
                  })),
                  (F = !1))
              : ((r = p.substitute(this.i18n.selectPointLayer, {
                  toolName: d[h]
                })),
                (F = !1));
            return (m = { isValid: F, validationMessage: r });
          },
          isFindCentroids: function(a) {
            return a === G.Tools.FindCentroids;
          },
          isPointLayer: function(a) {
            return a && a.geometryType === G.GeometryTypes.Point;
          },
          initI18n: function() {
            this.i18n ||
              ((this.i18n = {}),
              d.mixin(this.i18n, y.common),
              d.mixin(this.i18n, y.analysisTools),
              d.mixin(this.i18n, y.analysisMsgCodes),
              d.mixin(this.i18n, y.browseLayersDlg),
              d.mixin(this.i18n, y.driveTimes),
              d.mixin(this.i18n, y.calculateFields));
          },
          addBrowseAnalysisDialog: function(a) {
            if (a && a.widget) {
              this.i18n || this.initI18n();
              var m = "esri/dijit/analysis/PluginAnalysisLayers",
                f = function(a) {
                  return (
                    "\x3cimg class\x3d'grid-item galleryThumbnail' width\x3d'120px' height\x3d'80px' alt\x3d'' src\x3d'" +
                    (a.thumbnailUrl ||
                      this._portal.staticImagesUrl + "/desktopapp.png") +
                    "'\x3e"
                  );
                },
                c = function(a) {
                  return (
                    '\x3cdiv class\x3d"galleryLabelContainer"\x3e\x3cspan alt\x3d\'' +
                    (a.title || a.name || "\x3cNo Title\x3e") +
                    "'\x3e" +
                    (a.title.replace(/_/g, " ") ||
                      a.name.replace(/_/g, " ") ||
                      "\x3cNo Title\x3e") +
                    "\x3c/span\x3e\x3c/div\x3e"
                  );
                },
                h = function(a) {
                  return (
                    "\x3cimg class\x3d'grid-item-thumb' width\x3d'16px' height\x3d'16px' alt\x3d'' src\x3d'" +
                    a.iconUrl +
                    "'/\x3e"
                  );
                },
                l = function(a) {
                  return (
                    "\x3cimg class\x3d'grid-item-thumb' width\x3d'16px' height\x3d'16px' alt\x3d'' src\x3d'" +
                    a.iconUrl +
                    "'/\x3e"
                  );
                },
                n = r.doc.createDocumentFragment(),
                n = H.create("div", { style: "width:100%;height:100%;" }, n),
                b = H.create("div", {
                  style: "width:100%;height:10%;",
                  class: ""
                }),
                F = H.create("div", { style: "width:100%" }, n),
                e,
                g,
                O,
                S = this._isCustomAnalysisQuery(a.widget);
              1 === a.browseType
                ? ((m = "esri/dijit/analysis/PluginLayers"),
                  (m = {
                    portalUrl: a.widget.get("portalUrl"),
                    message: "",
                    plugin: m,
                    sortDescending: !0,
                    sort: "title",
                    self: a.widget.get("portalSelf"),
                    itemsPerPage: 100,
                    demandList: !0,
                    extent: a.widget.get("map").extent,
                    useExtent: !1,
                    fetchTimeout: 600,
                    galleryTemplate:
                      "\x3cdiv class\x3d'listServiceTitle'\x3e\x3ctable cellpadding\x3d'0' cellspacing\x3d'0' width\x3d'100%'\x3e\x3ctr width\x3d'100%'\x3e\x3ctd nowrap\x3d'nowrap'\x3e  \x3cdiv  style\x3d\"position:absolute;left:80px; top:10px; width:1px; height:1px; background: transparent;\"\x3e\x3c/div\x3e\x3cdiv style\x3d'overflow:hidden;'\x3e\x3ca style\x3d\"height:16px;\"\x3e${item.title}\x3c/a\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3ctable cellpadding\x3d'0' cellspacing\x3d'0' width\x3d'100%'\x3e\x3ctr width\x3d'100%' class\x3d'bottomRowTable'\x3e\x3ctd width\x3d'20'\x3e  \x3cspan class\x3d'esriAlignLeading'\x3e${item:_formatThumbnail}\x3c/span\x3e\x3c/td\x3e\x3ctd nowrap\x3d'nowrap'\x3e  \x3cspan class\x3d'esriAlignLeading' style\x3d'color:#656565;'\x3e${item.owner}\x3c/span\x3e\x3c/td\x3e\x3ctd style\x3d'padding-right:5px;padding-left:3px;'\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e",
                    showInfoPanel: !0,
                    isAutoClose: !1,
                    checkIsButtonEnabled: !0,
                    formatThumbnail: l,
                    formatInfoPanelImage: h,
                    class: "esriAnalysisLayersItems"
                  }))
                : (m = {
                    portalUrl: a.widget.get("portalUrl"),
                    message: "",
                    plugin: m,
                    sortDescending: !0,
                    sort: "title",
                    self: a.widget.get("portalSelf"),
                    pagingLinks: 1,
                    rowsPerPage: 6,
                    class:
                      "esriBrowseAnalysisLayers itemsGallery esriFloatLeading",
                    extent: a.widget.get("map").extent,
                    useExtent: !S,
                    fetchTimeout: 600,
                    galleryTemplate:
                      '\x3cdiv style\x3d\'opacity:1;\' class\x3d\'grid-item gallery-view galleryNode\'\x3e${item:_formatItemTitle}${item:_formatThumbnail}\x3cdiv class\x3d"linksDiv" style\x3d\'display:none;\'\x3e\x3cdiv class\x3d"esriItemLinks"\x3e\x3cdiv class\x3d"esriFloatLeading"\x3e\x3ca style\x3d"text-decoration: none;"\x3e\x3cspan\x3eAdd layer to analysis\x3c/span\x3e\x3cdiv class\x3d"dijitReset dijitInline esriArrows"\x3e\x3c/div\x3e\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e',
                    formatItemTitle: c,
                    showInfoPanel: !1,
                    showTooltip: !0,
                    formatThumbnail: f,
                    style: "width:48em;height:100%;clear:both;"
                  });
              c = H.toDom('\x3cdiv class\x3d"esriBrowseOptions"\x3e');
              H.place(c, b);
              f = H.create("div", { class: "esriBrowseOption" }, c);
              (a.browseType && 1 === a.browseType) ||
                ((c = H.create("div", { class: "esriBrowseOption" }, c)),
                (g = new U(
                  {
                    name: "addlayer",
                    id:
                      a.widget.id +
                      (a.browseType ? a.browseType : "") +
                      "_addlayercheck",
                    class: "",
                    value: !1,
                    checked: !1
                  },
                  H.create("input", {}, c)
                )),
                H.create(
                  "label",
                  {
                    for: a.widget.id + "_addlayercheck",
                    class: "esriBrowseOption_label",
                    innerHTML: this.i18n.addLayer
                  },
                  c
                ));
              c = !0;
              a.browseType && 1 === a.browseType ? (c = !1) : S && (c = !1);
              c = new U(
                {
                  name: "extentcheck",
                  id:
                    a.widget.id +
                    (a.browseType ? a.browseType : "") +
                    "_addextentcheck",
                  class: "",
                  value: c,
                  checked: c
                },
                H.create("input", {}, f)
              );
              H.create(
                "label",
                {
                  for:
                    a.widget.id +
                    (a.browseType ? a.browseType : "") +
                    "_addextentcheck",
                  class: "esriBrowseOption_label",
                  innerHTML: this.i18n.withinMapArea
                },
                f
              );
              m.messageRight = b;
              e = new ba(m, F);
              c.on(
                "change",
                d.hitch(this, function(a) {
                  e.set("useExtent", a);
                })
              );
              O = new R({
                title:
                  1 === a.browseType
                    ? this.i18n.browseLayers
                    : S
                    ? this.i18n.browseAnalysisLayers
                    : this.i18n.browseAnalysisTitle,
                content: n,
                browseItems: e,
                addlayerCheckBox: g,
                style:
                  a.browseType && 1 === a.browseType
                    ? ""
                    : "padding:.75em 0;background-color: #fff;width:50em;"
              });
              a.widget.own(
                O.on(
                  "hide",
                  d.hitch(O, function(a) {
                    O.browseItems.reset();
                  })
                )
              );
              return O;
            }
          },
          addAnalysisReadyLayer: function(m, c) {
            function h(a) {
              var h, l, b;
              "Feature Service" === n.type &&
                ((b = new f(n.url, { outFields: ["*"] })), d.mixin(n, b));
              "Image Service" === n.type &&
                ((b = new ea(n.url, { outFields: ["*"] })), d.mixin(n, b));
              d.mixin(n, a);
              n.id = n.title + "_" + a.id;
              n.title = m.item.selectedLayer
                ? n.title + "-" + a.name
                : n.title.replace(/_/g, " ");
              n.name = n.title;
              n.version = n.currentVersion;
              if (S && m.widget.showBrowseLayers) {
                l = (h = m.layersSelect.get("store")) && h.data;
                h = 2;
                h = l.splice(l.length - h, h);
                var L = {
                  id: l.length,
                  label: n.title,
                  name: n.title,
                  url: n.url
                };
                l.push(L);
                l = l.concat(h);
                h = new F({ data: l, idProperty: "id" });
                m.layersSelect.set("store", h);
                m.layersSelect.set("value", L.name);
              } else {
                l = m.layersSelect.getOptions();
                if (
                  m.widget.useArcGISComponents &&
                  (m.widget.showBrowseLayers || m.widget.showReadyToUseLayers)
                )
                  h = 2;
                else if (
                  m.widget.showBrowseLayers &&
                  m.widget.showReadyToUseLayers
                )
                  h = 3;
                else if (
                  m.widget.showBrowseLayers ||
                  m.widget.showReadyToUseLayers
                )
                  h = 2;
                h = l.splice(l.length - h, h);
                m.layersSelect.removeOption(h);
                l = m.layers.length;
                m.posIncrement && (l += m.posIncrement);
                l = "" + l;
                h.unshift({ value: l, label: n.title, selected: !0 });
                m.layersSelect.addOption(h);
                m.layersSelect.set("value", l);
              }
              b && ((n.lyr = b), (b.name = n.name));
              n.linfo = a;
              m.layers.push(n);
              if (
                (m.browseDialog.addlayerCheckBox &&
                  m.browseDialog.addlayerCheckBox.get("checked")) ||
                g ||
                c
              )
                this._addLayerHandle && this._addLayerHandle.remove(),
                  (this._addLayerHandle = m.widget.map.on(
                    "layer-add",
                    d.hitch(this, function(f) {
                      this._addLayerHandle.remove();
                      m.widget.emit("add-ready-to-use-layer", {
                        layer: f.layer,
                        layerInfo: a,
                        item: n
                      });
                    })
                  )),
                  m.widget.map.addLayer(b);
              m.browseDialog.browseItems && m.browseDialog.browseItems.clear();
            }
            if (
              B.isDefined(m) &&
              B.isDefined(m.item) &&
              B.isDefined(m.layersSelect) &&
              B.isDefined(m.layers) &&
              B.isDefined(m.browseDialog)
            ) {
              m.browseDialog.hide && m.browseDialog.hide();
              var l, n, L, r, e, O;
              (l =
                !m.item.selectedLayer && m.item.url
                  ? m.item.type === T.IS
                    ? m.item.url
                    : m.item.url + "/0"
                  : m.item.selectedLayer.url) &&
                -1 !== window.location.protocol.indexOf("https:") &&
                (l = l.replace("http:", "https:"));
              n = {
                url: l,
                itemId: m.item.id,
                title: m.item.title,
                type: m.item.type,
                analysisReady: !0
              };
              l = b.some(m.layers, function(a, f) {
                var c =
                  a.analysisReady && n.analysisReady && a.itemId === n.itemId;
                m.item.selectedLayer &&
                  m.item.selectedLayer.url &&
                  (c =
                    a.itemId && n.itemId
                      ? a.itemId === n.itemId && a.url === n.url
                      : a.url === n.url);
                c && (L = f);
                return c;
              });
              var g;
              m.browseDialog.browseItems &&
                t(
                  ".js-add-layer-checkbox",
                  m.browseDialog.browseItems.infoPanel
                ).forEach(function(a) {
                  g = a.checked;
                });
              var S = -1 !== m.layersSelect.baseClass.indexOf("dijitComboBox");
              r = new J();
              O = "sync";
              if (l) {
                m.posIncrement && (L += m.posIncrement);
                if (
                  (m.browseDialog.addlayerCheckBox &&
                    m.browseDialog.addlayerCheckBox.get("checked")) ||
                  g ||
                  c
                )
                  m.posIncrement || (m.posIncrement = 0),
                    (e = m.layers[L - m.posIncrement]),
                    m.widget.map.getLayer(e.lyr.id) ||
                      (this._addLayerHandle && this._addLayerHandle.remove(),
                      (this._addLayerHandle = m.widget.map.on(
                        "layer-add",
                        d.hitch(this, function(a) {
                          this._addLayerHandle.remove();
                          m.widget.emit("add-ready-to-use-layer", {
                            layer: a.layer,
                            layerInfo: e.linfo,
                            item: e
                          });
                        })
                      )),
                      m.widget.map.addLayer(e.lyr));
                S
                  ? m.layersSelect.set("value", m.layers[L - 1].name)
                  : m.layersSelect.set("value", "" + L);
                m.browseDialog.browseItems &&
                  m.browseDialog.browseItems.clear();
                r.resolve();
              } else
                m.item.selectedLayer
                  ? ((n.url = m.item.selectedLayer.url),
                    r.then(d.hitch(this, h)),
                    setTimeout(function() {
                      r.resolve(m.item.selectedLayer);
                    }, 500))
                  : ((O = m.item.itemDataUrl
                      ? X({ url: m.item.itemDataUrl, content: { f: "json" } })
                      : "sync"),
                    a(
                      O,
                      d.hitch(this, function(a) {
                        a &&
                          a.layers &&
                          a.layers[0].id &&
                          (n.url =
                            n.url.substring(0, n.url.lastIndexOf("/0")) +
                            "/" +
                            a.layers[0].id);
                        X({ url: n.url, content: { f: "json" } }).then(
                          d.hitch(this, function(a) {
                            h(a);
                            r.resolve();
                          })
                        );
                      })
                    ));
              return r.promise;
            }
          },
          addReadyToUseLayerOption: function(a, f) {
            a &&
              (a.showReadyToUseLayers || a.showBrowseLayers) &&
              (f || (f = []),
              a.signInPromise ||
                ((a.signInPromise = new J()),
                setTimeout(
                  d.hitch(this, function() {
                    a.signInPromise.resolve();
                  }),
                  100
                )),
              a.i18n || (this.initI18n(), (a.i18n = this.i18n)),
              a.signInPromise.then(
                d.hitch(this, function() {
                  b.forEach(
                    f,
                    function(f) {
                      var m = f.select || f;
                      if (
                        -1 !== m.baseClass.indexOf("dijitComboBox") &&
                        a.showBrowseLayers
                      ) {
                        if ((f = m.get("store")))
                          f.put({
                            id: "separator",
                            name: "separator",
                            label: "\x3chr\x3e"
                          }),
                            f.put({
                              id: "browselayers",
                              name: "browselayers",
                              label: a.i18n.browseLayers
                            });
                      } else {
                        var c = m.getOptions();
                        b.some(
                          c,
                          function(a) {
                            return "separator" === a.type;
                          },
                          this
                        ) ||
                          (!a.showReadyToUseLayers && !a.showBrowseLayers) ||
                          m.addOption({ type: "separator", value: "" });
                        this.addBrowseOptionForTool(
                          { select: m, disableLAAL: f.disableLAAL },
                          a
                        );
                      }
                    },
                    this
                  );
                  a.showReadyToUseLayers &&
                    !B.isDefined(a._browsedlg) &&
                    ((a._browsedlg = this.addBrowseAnalysisDialog({
                      widget: a
                    })),
                    a.own(
                      a._browsedlg.browseItems.on(
                        "select-change",
                        d.hitch(a, a._handleBrowseItemsSelect)
                      ),
                      a._browsedlg.on(
                        "hide",
                        d.hitch(a, function() {
                          b.forEach(f, function(a) {
                            "browse" === a.get("value") && a.reset();
                          });
                          a.layersSelect && a.layersSelect.reset();
                        })
                      )
                    ));
                  a.showBrowseLayers &&
                    !B.isDefined(a._browseLyrsdlg) &&
                    ((a._browseLyrsdlg = this.addBrowseAnalysisDialog({
                      widget: a,
                      browseType: 1
                    })),
                    a.own(
                      a._browseLyrsdlg.on(
                        "browseitems-close",
                        d.hitch(this, function(f) {
                          "add-layer" === f.action &&
                            (a._browseLyrsdlg.browseItems.plugIn._grid &&
                              ((f.selection.selectedLayer =
                                a._browseLyrsdlg.browseItems.plugIn._selectedLayer),
                              a._handleBrowseItemsSelect({
                                dialog: a._browseLyrsdlg,
                                selection: f.selection
                              })),
                            a._browseLyrsdlg.browseItems.closeInfoPanel());
                        })
                      ),
                      a._browseLyrsdlg.on(
                        "hide",
                        d.hitch(a, function() {
                          b.forEach(f, function(a) {
                            "browselayers" === a.get("value") && a.reset();
                          });
                        })
                      )
                    ));
                })
              ));
          },
          addBrowseOptionForTool: function(a, f) {
            var m = a.select,
              c = a.disableLAAL || !1,
              h = m.getOptions();
            a = [];
            var l = !1;
            if (
              !b.some(
                h,
                function(a) {
                  return "browselayers" === a.value || "browse" === a.value;
                },
                this
              )
            ) {
              if (
                (0 < h.length && "separator" !== h[h.length - 1].type) ||
                0 === h.length
              )
                a.push({ type: "separator" }), (l = !0);
              f.useArcGISComponents &&
              (f.showBrowseLayers || f.showReadyToUseLayers)
                ? a.push({
                    value: "browselayers",
                    label: f.i18n.browseAnalysisLayers
                  })
                : (!c &&
                    f.showReadyToUseLayers &&
                    ((c = f.i18n.browseAnalysisTitle),
                    this._isCustomAnalysisQuery(f) &&
                      (c = f.i18n.browseAnalysisLayers),
                    a.push({ value: "browse", label: c })),
                  f.showBrowseLayers &&
                    a.push({
                      value: "browselayers",
                      label: f.i18n.browseLayers
                    }));
              ((!0 === l && 1 < a.length) || (!1 === l && 0 < a.length)) &&
                m.addOption(a);
            }
          },
          _isCustomAnalysisQuery: function(a) {
            var f = 'title:"Living Atlas Analysis Layers" AND owner:esri',
              c = !1;
            a &&
              a.isSingleTenant &&
              (f =
                'title:"Living Atlas Analysis Layers" AND owner:esri_livingatlas');
            a.portalSelf &&
            a.portalSelf.analysisLayersGroupQuery &&
            a.portalSelf.analysisLayersGroupQuery !== f
              ? (c = !0)
              : a._portal &&
                a._portal.analysisLayersGroupQuery &&
                a._portal.analysisLayersGroupQuery !== f &&
                (c = !0);
            return c;
          },
          getMaxInputByMode: function(a) {
            if (a && a.units && a.type && a.limits && a.travelMode) {
              var f,
                c = a.limits.maximumBreakDistanceValue,
                h = a.limits.maximumBreakDistanceValueUnits,
                m = a.limits.maximumBreakTimeValue,
                l = a.limits.maximumBreakTimeValueUnits,
                n = this.isWalkingTravelMode(a.travelMode.travelMode);
              n &&
                ((c = a.limits.maximumBreakWalkingDistanceValue),
                (h = a.limits.maximumBreakWalkingDistanceValueUnits),
                (m = a.limits.maximumBreakWalkingTimeValue),
                (l = a.limits.maximumBreakWalkingTimeValueUnits));
              "reachableStreets" === a.alternateLimits &&
                ((l = this.generateLimitsForReachableStreets({
                  limits: a.limits,
                  isWalking: n
                })),
                (c = l.driveDistanceLimit),
                (h = l.driveDistanceUnit),
                (m = l.driveTimeLimit),
                (l = l.driveTimeUnit));
              "unreachableAreas" === a.alternateLimits &&
                ((l = this.generateLimitsForUnreachableAreas({
                  limits: a.limits,
                  isWalking: n
                })),
                (c = l.driveDistanceLimit),
                (h = l.driveDistanceUnit),
                (m = l.driveTimeLimit),
                (l = l.driveTimeUnit));
              m *= this.perMinute(l);
              c *= this.perMile(h);
              "StraightLine" === a.type
                ? "Miles" === a.units
                  ? (f = 1e3)
                  : "Yards" === a.units
                  ? (f = 176e4)
                  : "Kilometers" === a.units
                  ? (f = K.format(1609.344, { places: 2 }))
                  : "Meters" === a.units
                  ? (f = K.format(1609344, { places: 2 }))
                  : "Feet" === a.units && (f = 528e4)
                : this.isDistanceMode(a.travelMode)
                ? "Miles" === a.units
                  ? (f = c)
                  : "Yards" === a.units
                  ? (f = 1760 * c)
                  : "Kilometers" === a.units
                  ? (f = K.format(1.609344 * c, { places: 2 }))
                  : "Meters" === a.units
                  ? (f = K.format(1609.344 * c, { places: 2 }))
                  : "Feet" === a.units && (f = 5280 * c)
                : this.isTimeMode(a.travelMode) &&
                  ("Minutes" === a.units
                    ? (f = m)
                    : "Seconds" === a.units
                    ? (f = 60 * m)
                    : "Hours" === a.units && (f = m / 60));
              return "string" === typeof f ? K.parse(f) : parseFloat(f);
            }
          },
          isWalkingTravelMode: function(a) {
            if (a && a.restrictionAttributeNames)
              return a.restrictionAttributeNames.some(function(a) {
                return "walking" === a.toLowerCase();
              });
          },
          isDistanceMode: function(a) {
            return "Distance" === a.units;
          },
          isTimeMode: function(a) {
            return "Time" === a.units;
          },
          generateLimitsForUnreachableAreas: function(a) {
            var f = {
              driveDistanceLimit: null,
              driveDistanceUnit: null,
              driveTimeLimit: null,
              driveTimeUnit: null
            };
            a.isWalking
              ? ((f.driveDistanceLimit =
                  a.limits.maximumBreakWalkingDistanceValueDetailedPolygons),
                (f.driveDistanceUnit =
                  a.limits.maximumBreakWalkingDistanceValueUnitsDetailedPolygons),
                (f.driveTimeLimit =
                  a.limits.maximumBreakWalkingTimeValueDetailedPolygons),
                (f.driveTimeUnit =
                  a.limits.maximumBreakWalkingTimeValueUnitsDetailedPolygons))
              : ((f.driveDistanceLimit =
                  a.limits.maximumBreakDistanceValueDetailedPolygons),
                (f.driveDistanceUnit =
                  a.limits.maximumBreakDistanceValueUnitsDetailedPolygons),
                (f.driveTimeLimit =
                  a.limits.maximumBreakTimeValueDetailedPolygons),
                (f.driveTimeUnit =
                  a.limits.maximumBreakTimeValueUnitsDetailedPolygons));
            return f;
          },
          generateLimitsForReachableStreets: function(a) {
            var f = {
              driveDistanceLimit: null,
              driveDistanceUnit: null,
              driveTimeLimit: null,
              driveTimeUnit: null
            };
            a.isWalking
              ? ((f.driveDistanceLimit =
                  a.limits.maximumBreakWalkingDistanceValueServiceAreaLines),
                (f.driveDistanceUnit =
                  a.limits.maximumBreakWalkingDistanceValueUnitsServiceAreaLines),
                (f.driveTimeLimit =
                  a.limits.maximumBreakWalkingTimeValueServiceAreaLines),
                (f.driveTimeUnit =
                  a.limits.maximumBreakWalkingTimeValueUnitsServiceAreaLines))
              : ((f.driveDistanceLimit =
                  a.limits.maximumBreakDistanceValueServiceAreaLines),
                (f.driveDistanceUnit =
                  a.limits.maximumBreakDistanceValueUnitsServiceAreaLines),
                (f.driveTimeLimit =
                  a.limits.maximumBreakTimeValueServiceAreaLines),
                (f.driveTimeUnit =
                  a.limits.maximumBreakTimeValueUnitsServiceAreaLines));
            return f;
          },
          updateModeConstraints: function(a) {
            var f;
            a &&
              a.validateWidget &&
              a.units &&
              a.type &&
              a.travelMode &&
              ((f = a.validateWidget.get("constraints")),
              (f.max = this.getMaxInputByMode(a)),
              a.validateWidget.set(f));
          },
          getTravelModes: function(f) {
            var c = new J(),
              h,
              m,
              l,
              n;
            B.isDefined(this.travelModes) && 0 < this.travelModes.length
              ? c.resolve(this.travelModes)
              : f && f.widget
              ? f.widget.signInPromise.then(
                  d.hitch(this, function(r) {
                    (n = f.widget.get("helperServices")) && n.routingUtilities
                      ? ((l = n.routingUtilities.url), (h = "sync"))
                      : (h = f.widget._getSelf(f.widget.portalUrl));
                    a(
                      h,
                      d.hitch(this, function(a) {
                        a &&
                          a.helperServices &&
                          a.helperServices.routingUtilities &&
                          (l = a.helperServices.routingUtilities.url);
                        B.isDefined(l)
                          ? ((m = new S(l + "/GetTravelModes")),
                            m.execute({}).then(
                              d.hitch(this, function(a) {
                                this.travelModes = b.map(
                                  a[0].value && a[0].value.features,
                                  function(a) {
                                    return u.fromJson(a.attributes.TravelMode);
                                  }
                                );
                                a[1] &&
                                  a[1].paramName &&
                                  "defaultTravelMode" === a[1].paramName &&
                                  (this.defaultTravelModeId = a[1].value);
                                c.resolve(this.travelModes);
                              }),
                              d.hitch(this, function(a) {
                                c.reject(a);
                              })
                            ))
                          : c.reject(
                              Error(
                                "Missing Routing Utility Service to get Travel Modes"
                              )
                            );
                      }),
                      function(a) {
                        c.reject(a);
                      }
                    );
                  })
                )
              : c.reject(
                  Error("Missing parameter: params.widget required parameter")
                );
            return c.promise;
          },
          populateTravelModes: function(a) {
            if (a && a.selectWidget && a.widget) {
              var f = [],
                c = a.allowmode || "all",
                h = !1;
              this.initI18n();
              a.addStraightLine &&
                f.push({
                  value: "StraightLine",
                  label:
                    '\x3cdiv class\x3d"esriFloatLeading bufferIcon esriStraightLineDistanceIcon"\x3e\x3c/div\x3e\x3cdiv class\x3d"esriLeadingMargin4" style\x3d"height:20px;margin-top:10px;"\x3e' +
                    this.i18n.straightLineDistance +
                    "\x3c/div\x3e",
                  selected: a.value && "StraightLine" === a.value
                });
              this.getTravelModes({ widget: a.widget }).then(
                d.hitch(this, function(m) {
                  var l =
                    B.isDefined(a.enableTravelModes) && !a.enableTravelModes;
                  b.forEach(
                    m,
                    function(m, n) {
                      n = this.createOptionForTravelMode(m, {
                        name: m.name,
                        disabled: l,
                        separator: a.separator
                      });
                      this.isTravelModeAllowed(c, n.units) &&
                        ("all" !== c &&
                          (n.value = n.value.replace(n.units, "")),
                        a.value && a.value.id === m.id
                          ? V(a.value, m) &&
                            ((n.selected = !n.disabled), (h = !0))
                          : !a.value &&
                            a.selectDefaultMode &&
                            this.defaultTravelModeId &&
                            this.defaultTravelModeId === m.id &&
                            (n.selected = !0),
                        f.push(n));
                    },
                    this
                  );
                  !h &&
                    this.isRequiredToAddTravelMode(a) &&
                    this.isTravelModeAllowed(
                      c,
                      this.getTravelModeUnits(a.value)
                    ) &&
                    f.push(this.getOptionForCustomTravelMode(a, l));
                  a.selectWidget.removeOption();
                  a.selectWidget.addOption(f);
                  a.widget.emit("travelmodes-added", { travelOptions: f });
                }),
                d.hitch(this, function(c) {
                  f &&
                    0 < f.length &&
                    (a.selectWidget.removeOption(),
                    a.selectWidget.addOption(f),
                    a.widget.emit("travelmodes-added", { travelOptions: f }));
                })
              );
            }
          },
          getTravelModeLabel: function(a, f) {
            f = f ? f : a.name;
            return (
              '\x3cdiv class\x3d"esriFloatLeading bufferIcon esri' +
              this.getTravelModei18nKey(a.type) +
              this.getTravelModeUnits(a) +
              'Icon"\x3e\x3c/div\x3e\x3cdiv class\x3d"esriLeadingMargin4" style\x3d"height:20px;margin-top:10px;" title\x3d"' +
              a.description +
              '"\x3e' +
              f +
              "\x3c/div\x3e"
            );
          },
          getTravelModeUnits: function(a) {
            var f = a.units || name.split(/\s/)[1];
            return (f =
              a.impedanceAttributeName === a.timeAttributeName
                ? "Time"
                : a.impedanceAttributeName === a.distanceAttributeName
                ? "Distance"
                : "Other");
          },
          getTravelModeValue: function(a, f) {
            return a.replace(/\s/g, f || "");
          },
          getTravelModei18nKey: function(a) {
            return "AUTOMOBILE" === a
              ? "Driving"
              : "TRUCK" === a
              ? "Trucking"
              : "WALK" === a
              ? "Walking"
              : "Other";
          },
          isTravelModeAllowed: function(a, f) {
            return "all" === a || a.toLowerCase() === f.toLowerCase();
          },
          isRequiredToAddTravelMode: function(a) {
            return a.widget.rerun && "StraightLine" !== a.value;
          },
          isTrafficBasedTravelMode: function(a) {
            var f = this.getTravelModei18nKey(a.type).toLowerCase();
            return (
              "time" === this.getTravelModeUnits(a).toLowerCase() &&
              ("driving" === f || "trucking" === f)
            );
          },
          getOptionForCustomTravelMode: function(a, f) {
            a = this.createOptionForTravelMode(a.value, {
              name: "\x26lt" + a.value.name + "\x26gt",
              disabled: f,
              separator: a.separator
            });
            a.selected = !0;
            return a;
          },
          createOptionForTravelMode: function(a, f) {
            return {
              label: this.getTravelModeLabel(a, f.name),
              value: this.getTravelModeValue(f.name, f.separator),
              travelMode: a,
              disabled: f.disabled,
              modei18nKey: this.getTravelModei18nKey(a.type).toLowerCase(),
              units: this.getTravelModeUnits(a)
            };
          },
          updateDisplay: function(a, f, c) {
            new t.NodeList(a).style("display", f ? (c ? c : "block") : "none");
          },
          isGreaterThanZero: function() {
            return 0 < this.get("value");
          },
          getExprFunctions: function() {
            this.i18n || this.initI18n();
            this.exprFunctions ||
              (this.exprFunctions = [
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.asMetersFunc, {
                    functionName: "as_meters(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "as_meters()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.asKilometersFunc, {
                    functionName: "as_kilometers(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "as_kilometers()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.asFeetFunc, {
                    functionName: "as_feet(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "as_feet()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.asYardsFunc, {
                    functionName: "as_yards(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "as_yards()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.asMilesFunc, {
                    functionName: "as_miles(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "as_miles()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.asNuaticalMilesFunc, {
                    functionName:
                      "as_nautical_miles(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "as_nautical_miles()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.absFunc, {
                    functionName: "abs(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "abs()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.logFunc, {
                    functionName: "log(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "log()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.sinFunc, {
                    functionName: "sin(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "sin()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.cosFunc, {
                    functionName: "cos(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "cos()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.tanFunc, {
                    functionName: "tan(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "tan()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.squareRootFunc, {
                    functionName: "sqrt(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "sqrt()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.minFunc, {
                    functionName: "min(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "min()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.maxFunc, {
                    functionName: "max(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "max()"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.constrainFunc, {
                    functionName:
                      "constrain(\x3ci\x3enumber\x3c/i\x3e, \x3ci\x3elow\x3c/i\x3e, \x3ci\x3ehigh\x3c/i\x3e",
                    num: "\x3ci\x3enumber\x3c/i\x3e",
                    low: "\x3ci\x3elow\x3c/i\x3e",
                    high: "\x3ci\x3ehigh\x3c/i\x3e"
                  }),
                  name: "constrain(,,)"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.iffFunc, {
                    functionName:
                      "iif(\x3ci\x3econdition\x3c/i\x3e,\x3ci\x3evalue if TRUE\x3c/i\x3e,\x3ci\x3evalue if FALSE\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "iif(,,)"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.whenFunc, {
                    functionName: "when(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "when(,)"
                },
                {
                  type: "NumType",
                  label: p.substitute(this.i18n.decodeFunc, {
                    functionName:
                      "decode(\x3ci\x3eexpression\x3c/i\x3e, \x3ci\x3ecase1,return1,..caseN,returnN\x3c/i\x3e, \x3ci\x3edefault\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                  }),
                  name: "decode(,,,)"
                }
              ]);
            return this.exprFunctions;
          },
          addAttributeOptions: function(a) {
            this.initI18n();
            B.isDefined(a.allowSelectLabel) || (a.allowSelectLabel = !0);
            var f,
              c,
              h,
              l = [],
              m = B.isDefined(a.emptyValue) ? a.emptyValue : "";
            if (a.allowNumericType || void 0 === a.allowNumericType)
              l = [
                G.FieldTypes.Short,
                G.FieldTypes.Integer,
                G.FieldTypes.Float,
                G.FieldTypes.Double
              ];
            f = a.layer;
            c = a.selectWidget;
            h = f ? f.fields : [];
            c.removeOption(c.getOptions());
            a.allowSelectLabel &&
              c.addOption({ value: m, label: this.i18n.attribute });
            a.allowStringType && l.push(G.FieldTypes.String);
            a.allowDateType && l.push(G.FieldTypes.Date);
            var n = [];
            b.forEach(
              h,
              function(a) {
                -1 !== b.indexOf(l, a.type) &&
                  a.name !== f.objectIdField &&
                  n.push({
                    value: a.name,
                    label:
                      B.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name,
                    type:
                      a.type === G.FieldTypes.String
                        ? G.PseudoFieldTypes.String
                        : a.type === G.FieldTypes.Date
                        ? G.PseudoFieldTypes.Date
                        : G.PseudoFieldTypes.Number
                  });
              },
              this
            );
            if (0 === n.length) return !1;
            c.addOption(n);
            B.isDefined(a.priorityChange)
              ? c.set("value", m, a.priorityChange)
              : c.set("value", m);
            c.set("disabled", !f || 0 === f.fields.length);
            return !0;
          },
          addStatisticsOptions: function(a) {
            this.initI18n();
            var f = a.selectWidget,
              c = [
                { value: "SUM", label: this.i18n.sum },
                { value: "MIN", label: this.i18n.minimum },
                { value: "MAX", label: this.i18n.maximum },
                {
                  value: "MEAN",
                  label: a.showGeoAnalyticsParams
                    ? this.i18n.mean
                    : this.i18n.average
                },
                { value: "STDDEV", label: this.i18n.standardDev }
              ],
              h = [
                { value: "MIN", label: this.i18n.minimum },
                { value: "MAX", label: this.i18n.maximum }
              ],
              l = B.isDefined(a.emptyValue) ? a.emptyValue : "";
            f.removeOption(f.getOptions());
            f.addOption([{ value: l, label: this.i18n.statistic }]);
            a.showGeoAnalyticsParams &&
              (f.addOption({ value: "COUNT", label: this.i18n.count }),
              c.push({ value: "VARIANCE", label: this.i18n.variance }),
              c.splice(4, 0, { value: "RANGE", label: this.i18n.range }));
            a.type && "number" !== a.type
              ? a.type && "string" === a.type
                ? (f.addOption({ value: "ANY", label: this.i18n.any }),
                  (a.selectWidget.optionsType = "string"))
                : a.type &&
                  "date" === a.type &&
                  (f.addOption(h), (a.selectWidget.optionsType = "date"))
              : (f.addOption(c), (a.selectWidget.optionsType = "number"));
            f.set("value", l);
          },
          addFillOptions: function(a) {
            var f = a.selectWidget,
              c = [
                { value: "ZEROES", label: this.i18n.zeroes },
                {
                  value: "SPATIAL_NEIGHBORS",
                  label: this.i18n.spatialneighbhors
                },
                {
                  value: "SPACE_TIME_NEIGHBORS",
                  label: this.i18n.spacetimeneighbors
                },
                { value: "TEMPORAL_TREND", label: this.i18n.temporaltrend }
              ];
            f.removeOption(f.getOptions());
            f.addOption([{ value: "0", label: this.i18n.fill }]);
            (a.type && "number" !== a.type) || f.addOption(c);
          },
          perMeter: function(a) {
            var f = 1;
            switch (a) {
              case D.MILLIMETERS:
                f = 1e3;
                break;
              case D.CENTIMETERS:
                f = 100;
                break;
              case D.DECIMETERS:
                f = 10;
                break;
              case D.METERS:
                f = 1;
                break;
              case D.KILOMETERS:
                f = 0.001;
                break;
              case D.INCHES:
                f = 39.370079;
                break;
              case D.FEET:
                f = 3.2808399;
                break;
              case D.YARDS:
                f = 1.0936133;
                break;
              case D.MILES:
                f = 6.2137119e-4;
                break;
              case D.NAUTICAL_MILES:
                f = 5.399568e-4;
                break;
              case D.ACRES:
                f = 2.4710538e-4;
                break;
              case D.ARES:
                f = 0.01;
                break;
              case D.HECTARES:
                f = 1e-4;
                break;
              case D.SQUARE_INCHES:
                f = 1550.0031;
                break;
              case D.SQUARE_FEET:
                f = 10.7639104;
                break;
              case D.SQUARE_YARDS:
                f = 1.19599005;
                break;
              case D.SQUARE_MILES:
                f = 3.86102159e-7;
                break;
              case D.SQUARE_NAUTICAL_MILES:
                f = 2.9155335e-7;
                break;
              case D.SQUARE_MILLIMETERS:
                f = 1e6;
                break;
              case D.SQUARE_CENTIMETERS:
                f = 1e4;
                break;
              case D.SQUARE_DECIMETERS:
                f = 100;
                break;
              case D.SQUARE_METERS:
                f = 1;
                break;
              case D.SQUARE_KILOMETERS:
                f = 1e-6;
            }
            return f;
          },
          perMile: function(a) {
            var f = 1;
            switch (a) {
              case "Feet":
                f = 1.89394e-4;
                break;
              case "Yards":
                f = 5.68182e-4;
                break;
              case "Meters":
                f = 6.21371e-4;
                break;
              case "Kilometers":
                f = 0.621371;
            }
            return f;
          },
          perMinute: function(a) {
            var f = 1;
            switch (a) {
              case "Seconds":
                f = 0.0166667;
                break;
              case "Hours":
                f = 60;
            }
            return f;
          },
          getType: function(a) {
            var f = null;
            switch (a) {
              case D.ACRES:
                f = 2;
                break;
              case D.ARES:
                f = 2;
                break;
              case D.CENTIMETERS:
                f = 1;
                break;
              case D.DECIMETERS:
                f = 1;
                break;
              case D.FEET:
                f = 1;
                break;
              case D.HECTARES:
                f = 2;
                break;
              case D.INCHES:
                f = 1;
                break;
              case D.KILOMETERS:
                f = 1;
                break;
              case D.METERS:
                f = 1;
                break;
              case D.MILES:
                f = 1;
                break;
              case D.MILLIMETERS:
                f = 1;
                break;
              case D.NAUTICAL_MILES:
                f = 1;
                break;
              case D.SQUARE_CENTIMETERS:
                f = 2;
                break;
              case D.SQUARE_DECIMETERS:
                f = 2;
                break;
              case D.SQUARE_FEET:
                f = 2;
                break;
              case D.SQUARE_INCHES:
                f = 2;
                break;
              case D.SQUARE_KILOMETERS:
                f = 2;
                break;
              case D.SQUARE_METERS:
                f = 2;
                break;
              case D.SQUARE_MILES:
                f = 2;
                break;
              case D.SQUARE_MILLIMETERS:
                f = 2;
                break;
              case D.SQUARE_NAUTICAL_MILES:
                f = 2;
                break;
              case D.SQUARE_YARDS:
                f = 2;
                break;
              case D.YARDS:
                f = 1;
                break;
              default:
                f = 0;
            }
            return f;
          },
          unitConversion: function(a, f, c) {
            var h = !0;
            B.isDefined(a) ||
              (this.emitError(
                "The 'From' Value must be a valid numeric value: " + a
              ),
              (h = !1));
            B.isDefined(f) ||
              (this.emitError("The 'From' Units must be defined: " + f),
              (h = !1));
            B.isDefined(c) ||
              (this.emitError("The 'To' Units must be defined: " + c),
              (h = !1));
            a instanceof Array &&
              (this.emitError("Only single 'From' Value supported: " + a),
              (h = !1));
            f instanceof Array &&
              (this.emitError("Only single 'From' Units supported: " + f),
              (h = !1));
            c instanceof Array &&
              (this.emitError("Only single 'To' Units supported: " + c),
              (h = !1));
            var l = this.getType(f),
              m = this.getType(c);
            0 === l &&
              (this.emitError("Unsupported 'From' Units: " + f), (h = !1));
            0 === m &&
              (this.emitError("Unsupported 'To' Units: " + c), (h = !1));
            l !== m &&
              (this.emitError(
                "Incompatible 'From' and 'To' Units: " + f + " and " + c
              ),
              (h = !1));
            return h
              ? f === c
                ? +a
                : (+a / this.perMeter(f)) * this.perMeter(c)
              : Number.NaN;
          },
          emitError: function(a) {
            console.log("error", Error(a));
          },
          isEmpty: function(a) {
            for (var f in a) if (a.hasOwnProperty(f)) return !1;
            return w.stringify(a) === w.stringify({});
          },
          getRoutingUtilities: function(f) {
            var c = new J(),
              h = {},
              l,
              n,
              m,
              r;
            f ||
              c.reject(Error("Missing parameter: widget required parameter"));
            -1 !==
            b.indexOf(
              ["CreateDriveTimeAreas", "EnrichLayer", "SummarizeNearby"],
              f.toolName
            )
              ? d.mixin(h, {
                  toolName: "GenerateServiceAreas",
                  serviceName: "asyncServiceArea"
                })
              : f.toolName === G.Tools.ChooseBestFacilities
              ? d.mixin(h, {
                  toolName: "SolveLocationAllocation",
                  serviceName: "asyncLocationAllocation"
                })
              : "PlanRoutes" === f.toolName
              ? d.mixin(h, {
                  toolName: "SolveVehicleRoutingProblem",
                  serviceName: "asyncVRP"
                })
              : "FindNearest" === f.toolName
              ? d.mixin(h, {
                  toolName: "FindClosestFacilities",
                  serviceName: "asyncClosestFacility"
                })
              : "ConnectOriginsToDestinations" === f.toolName &&
                d.mixin(h, {
                  toolName: "FindRoutes",
                  serviceName: "asyncRoute"
                });
            this.routingUtilities || (this.routingUtilities = {});
            this.routingUtilities && this.routingUtilities[f.toolName]
              ? c.resolve(this.routingUtilities[f.toolName])
              : f.signInPromise.then(
                  d.hitch(this, function(b) {
                    (r = f.get("helperServices")) && r.routingUtilities
                      ? ((m = r.routingUtilities.url), (l = "sync"))
                      : (l = f._getSelf(f.portalUrl));
                    a(
                      l,
                      d.hitch(this, function(a) {
                        a &&
                          a.helperServices &&
                          a.helperServices.routingUtilities &&
                          (m = a.helperServices.routingUtilities.url);
                        B.isDefined(m) ||
                          c.reject(
                            Error(
                              "Missing Routing Utility Service to get Network Analysis Service Limits."
                            )
                          );
                        n = new S(m + "/GetToolInfo");
                        n.execute(h).then(
                          d.hitch(this, function(a) {
                            a && 0 < a.length && a[0].value
                              ? ((this.routingUtilities[f.toolName] =
                                  a[0].value),
                                c.resolve(a[0].value))
                              : c.reject(
                                  "Routing Utility Service 'GetToolInfo' job did not return service limits."
                                );
                          }),
                          function(a) {
                            c.reject(a);
                          }
                        );
                      })
                    );
                  }),
                  function(a) {
                    c.reject(a);
                  }
                );
            return c.promise;
          },
          getNetworkAnalysisLimits: function(a) {
            var f = new J();
            a ||
              f.reject(Error("Missing parameter: widget required parameter"));
            this.getRoutingUtilities(a).then(
              d.hitch(this, function(a) {
                a.serviceLimits ? f.resolve(a.serviceLimits) : f.reject();
              }),
              function(a) {
                f.reject(a);
              }
            );
            return f.promise;
          },
          isEsriWorldGeocoder: function(a) {
            var f = this.isAgoWorldGeocodeServer(a);
            a = this.isAgoWorldGeocodeServerProxy(a);
            return f || a;
          },
          isAgoWorldGeocodeServer: function(a) {
            return (
              a &&
              !!a.match(
                /(arcgis.com\/arcgis\/rest\/services\/world\/geocodeserver).*/gi
              )
            );
          },
          isAgoWorldGeocodeServerProxy: function(a) {
            return (
              a &&
              !!a.match(
                /(\/servers\/[\da-z\.-]+\/rest\/services\/world\/geocodeserver).*/gi
              )
            );
          },
          isWorldGeoLocator: function(a) {
            return (
              a && !!a.match(/(\/rest\/services\/world\/geocodeserver).*/gi)
            );
          },
          showMessages: function(a, f, c) {
            A.set(f, "innerHTML", a);
            q.fadeIn({
              node: c,
              easing: Q.quadIn,
              onEnd: d.hitch(this, function() {
                N.set(c, { display: "" });
              })
            }).play();
          },
          hideMessages: function(a) {
            q.fadeOut({
              node: a,
              easing: Q.quadOut,
              onEnd: function() {
                N.set(a, { display: "none" });
              }
            }).play();
          },
          getHelpUrl: function(a) {
            if (a.topic && a.widget) {
              var f;
              a.widget.portalSelf && a.widget.portalSelf.helpBase
                ? (f = a.widget.portalSelf.helpBase + "index.html#")
                : !a.widget.isSingleTenant ||
                  (a.widget.portalSelf && a.widget.portalSelf.helpBase) ||
                  (f = "http://server.arcgis.com/en/portal/latest/use/");
              "BufferExpression" === a.topic &&
                (f +=
                  "Use_expressions_with_GeoAnalytics_Tools/019300000183000000/");
              return f;
            }
          },
          isPCS: function(a) {
            return !!a && !!da && -1 !== b.indexOf(da, a);
          },
          isPCSByLayerType: function(a) {
            var f =
              !!a &&
              !!a.fullExtent &&
              this.isPCS(a.fullExtent.spatialReference.wkid);
            !f &&
              a.extent &&
              (f =
                !!a &&
                !!a.extent &&
                this.isPCS(a.extent.spatialReference.wkid));
            !f &&
              a.spatialReference &&
              (f =
                !!a &&
                !!a.spatialReference &&
                this.isPCS(a.spatialReference.wkid));
            return f;
          },
          checkPCSforAnalysis: function(a) {
            var f = a.widget && a.widget.toolName,
              h =
                !!a.widget &&
                !!a.widget.context &&
                !!a.widget.context.processSR &&
                this.isPCS(a.widget.context.processSR.wkid),
              l = !0,
              m = a.jobParams || a.widget.jobParams,
              r,
              F,
              e =
                !!a.widget &&
                !!a.widget.context &&
                !!a.widget.context.processSR &&
                !!a.widget.context.processSR.wkid;
            if (!f || !m || !a.widget.showGeoAnalyticsParams) return !1;
            F =
              "\x3ca  href\x3d'#' id\x3d'" +
              a.widget.id +
              "_warn_settings_link'\x3e" +
              a.widget.i18n.analysisSettings +
              "\x3c/a\x3e\x3cdiv class\x3d'esriAnalysisSettingsIcon'\x3e\x3c/div\x3e";
            r = p.substitute(a.widget.i18n.PCSReqMsg, {
              defaultSpatialRef: a.widget.i18n.worldCylindrical,
              settingsIcon: F
            });
            ("FindHotSpots" !== f && "FindPointClusters" !== f) || h
              ? ("CalculateDensity" !== f &&
                  "FindPointClusters" !== f &&
                  "GeographicallyWeightedRegression" !== f) ||
                h
                ? "AggregatePoints" !== f ||
                  -1 === b.indexOf(["HEXAGON", "SQUARE"], m.binType) ||
                  h
                  ? "SummarizeWithin" === f && m.summaryPolygons && !h
                    ? (l = this.isPCSByLayerType(a.widget.sumWithinLayer))
                    : "SummarizeWithin" !== f ||
                      -1 === b.indexOf(["HEXAGON", "SQUARE"], m.binType) ||
                      h
                    ? "JoinFeatures" === f &&
                      m.spatialNearDistance &&
                      "Near" === m.spatialRelationship &&
                      !h
                      ? (l = this.isPCSByLayerType(a.widget.targetLayer)) ||
                        (r = p.substitute(a.widget.i18n.JFPCSReqMsg, {
                          settingsIcon: F
                        }))
                      : "BuildMultiVariableGrid" !== f ||
                        h ||
                        (l = b.every(
                          a.inputLayers,
                          function(a) {
                            return this.isPCSByLayerType(a);
                          },
                          this
                        ))
                    : (l = this.isPCSByLayerType(a.widget.summaryLayer))
                  : (l = this.isPCSByLayerType(a.widget.pointLayer))
                : (l = this.isPCSByLayerType(a.widget.inputLayer))
              : ((l = this.isPCSByLayerType(a.widget.analysisLayer)),
                "FindPointClusters" !== f ||
                  l ||
                  (r = p.substitute(a.widget.i18n.FPCSReqMsg, {
                    settingsIcon: F
                  })));
            l ||
              a.hasPCSWarnShown ||
              (a.widget.set("disableRunAnalysis", l),
              this.settingsVM &&
                this.settingsDlg &&
                a.widget._bodyNode &&
                a.widget._errorMessagePane &&
                (this.showMessages(
                  r,
                  a.widget._bodyNode,
                  a.widget._errorMessagePane
                ),
                c.byId(a.widget.id + "_warn_settings_link") &&
                  n(
                    c.byId(a.widget.id + "_warn_settings_link"),
                    "click",
                    d.hitch(a.widget, a.widget.showSettingsDlg)
                  )));
            !l && a.hasPCSWarnShown && e && (l = !0);
            return l;
          },
          tryParseJSON: function(a) {
            try {
              var f = w.parse(a);
              if (f && "object" === typeof f && null !== f) return f;
            } catch (ha) {}
            return !1;
          },
          decodeTag: function(a) {
            return { "\x26lt;": "\x3c", "\x26gt;": "\x3e" }[a] || a;
          },
          stringDecode: function(a) {
            return a.replace(/(&lt;|&gt;)/g, this.decodeTag);
          },
          jobParamsToWidgetProps: function(a) {
            if (a && a.jobParams) {
              var f = a.jobParams,
                c = new J(),
                h = [],
                l = [],
                n;
              for (n in f) {
                var m;
                f.hasOwnProperty(n) &&
                  ("string" === typeof f[n] &&
                    -1 !== f[n].search(/(&lt;|&gt;)/g) &&
                    (f[n] = this.stringDecode(f[n])),
                  (m =
                    "string" === typeof f[n]
                      ? this.tryParseJSON(f[n])
                      : f[n])) &&
                  (-1 !== n.toLowerCase().indexOf("layer") &&
                  "object" === typeof m
                    ? l.push({ key: n, obj: m })
                    : m && (m.Raster || m.url) && l.push({ key: n, obj: m }),
                  (f[n] = m));
              }
              for (n = 0; n < l.length; n++) {
                m = l[n].obj;
                var r = l[n].key;
                "object" === typeof m && m.length
                  ? ((f[r] = []),
                    b.forEach(
                      m,
                      function(a, c) {
                        this._getFlayers(a, r, f, h, !0, c);
                      },
                      this
                    ))
                  : "object" === typeof m && m.Raster
                  ? ((m.url = m.Raster.url),
                    this._getFlayers(m, r, f, h, !0, "Raster"))
                  : this._getFlayers(m, r, f, h);
              }
              M(h).then(
                d.hitch(this, function() {
                  c.resolve(a);
                }),
                d.hitch(this, function() {
                  c.resolve(a);
                })
              );
              return c.promise;
            }
          },
          _getLayerType: function(a) {
            return a
              ? -1 !== a.indexOf("BigDataCatalogServer")
                ? T.BIGDATA
                : -1 !== a.indexOf("ImageServer")
                ? T.IS
                : T.FS
              : null;
          },
          _getFlayers: function(a, c, h, l, n, b) {
            var m, r;
            a.url
              ? ((m = X({ url: a.url, content: { f: "json" } })),
                (r = new J()),
                l.push(r),
                m.then(
                  d.hitch(
                    this,
                    function(a, c, l, m, b) {
                      var r,
                        F = this._getLayerType(a.url);
                      F === T.FS
                        ? ((r = new f(a.url, {
                            mode: f.MODE_ONDEMAND,
                            outFields: ["*"],
                            resourceInfo: b
                          })),
                          a.filter && r.setDefinitionExpression(a.filter),
                          (r.filter = a.filter))
                        : F === T.BIGDATA
                        ? ((r = b), d.mixin(r, a))
                        : F === T.IS &&
                          ((b = a.Raster || a),
                          (r = new ea(b.url)),
                          b.renderingRule &&
                            r.setRenderingRule(new ga(b.renderingRule)),
                          b.name && (r.name = b.name),
                          a.Raster && a.Raster.url === a.url && delete a.url);
                      a.name && (r.name = a.name);
                      n
                        ? (h[c][m] = r)
                        : n && F === T.IS
                        ? d.mixin(h[c][m], r)
                        : (h[c] = r);
                      l.resolve();
                    },
                    a,
                    c,
                    r,
                    b
                  ),
                  d.hitch(
                    this,
                    function(a, f, c, l, b) {
                      a = { name: a.name, empty: !0 };
                      n ? (h[f][l] = a) : (h[f] = a);
                      c.resolve();
                    },
                    a,
                    c,
                    r,
                    b
                  )
                ))
              : ((l = new f(a, { outFields: ["*"] })),
                a.name && (l.name = a.name),
                n ? (h[c][b] = l) : (h[c] = l));
          },
          isLayerInLayers: function(a, f) {
            return b.some(
              f,
              function(f) {
                return this.isSameLayer(a, f);
              },
              this
            );
          },
          addBlankOption: function(a, f) {
            f && f.length
              ? f.push({ value: "  ", label: "" })
              : a.addOption({ value: "  ", label: "" });
            setTimeout(d.hitch(this, this._validateSelectUI, a), 100);
          },
          _validateSelectUI: function(a) {
            a._hasBeenBlurred = !0;
            a.set("focused", !0);
            a.validate();
            a.set("focused", !1);
            a._hasBeenBlurred = !1;
            setTimeout(
              d.hitch(this, function() {
                a.reset();
              }),
              1e3
            );
          },
          updateExpressions: function(a) {
            a &&
              a.selectedInputLayers &&
              a.inputLayers &&
              a.data &&
              a.expressions &&
              (b.forEach(a.selectedInputLayers, function(f, c) {
                b.forEach(a.inputLayers, function(a, h) {
                  a &&
                    f &&
                    ((!f.url && !a.url && f.name === a.name) ||
                      (f.url && a.url && f.url === a.url)) &&
                    ((f._oldIndex = c), (f._newIndex = h));
                });
              }),
              b.forEach(a.data, function(f, c) {
                0 < c &&
                  f &&
                  ((c = a.expressions[c - 1]),
                  B.isDefined(f.layer) && (f.layer = c && c.layer),
                  B.isDefined(f.selectingLayer) &&
                    (f.selectingLayer = c && c.selectingLayer));
              }),
              b.forEach(
                a.data,
                function(f) {
                  var c = !1,
                    h = !1;
                  b.forEach(
                    a.selectedInputLayers,
                    function(a) {
                      B.isDefined(f.layer) &&
                        f.layer === a._oldIndex &&
                        !c &&
                        ((f.layer = a._newIndex), (c = !0));
                      B.isDefined(f.selectingLayer) &&
                        f.selectingLayer === a._oldIndex &&
                        !h &&
                        ((f.selectingLayer = a._newIndex), (h = !0));
                    },
                    this
                  );
                },
                this
              ));
          },
          isBigDataTypeTobeAdded: function(a) {
            return -1 == b.indexOf(a, 'type:"Big Data File Share"') ? !0 : !1;
          },
          removeDuplicates: function(a, f) {
            for (var c = [], h = {}, l = 0; l < a.length; l++)
              h[a[l]] ? (h[a[l]] += 1) : (c.push(a[l]), (h[a[l]] = 1));
            return f ? h : c;
          },
          isPoint: function(a) {
            return a && a.geometryType === G.GeometryTypes.Point;
          },
          isLine: function(a) {
            return a && a.geometryType === G.GeometryTypes.Line;
          },
          isPolygon: function(a) {
            return a && a.geometryType === G.GeometryTypes.Polygon;
          },
          isSameLayer: function(a, f) {
            return (
              a &&
              f &&
              ((a.name && f.name && a.name === f.name) ||
                (a.url && f.url && a.url === f.url))
            );
          },
          getTimeType: function(a) {
            return a
              ? B.isDefined(a.timeInfo) &&
                B.isDefined(a.timeInfo.startTimeField) &&
                !B.isDefined(a.timeInfo.endTimeField)
                ? G.TimeTypes.Instant
                : B.isDefined(a.timeInfo) &&
                  B.isDefined(a.timeInfo.startTimeField) &&
                  B.isDefined(a.timeInfo.endTimeField)
                ? G.TimeTypes.Interval
                : B.isDefined(a.time) && B.isDefined(a.time.timeType)
                ? a.time.timeType
                : !1
              : !1;
          },
          fetchGroupForRFT: function(a) {
            var f = new J(),
              c = x.locale,
              h = c ? c.substring(0, 2) : "en",
              c =
                this.systemRFTGroupName +
                " owner: (" +
                ("en" === h ? ["esri_en"] : ["esri_en", "esri_" + h]).join(
                  " OR "
                ) +
                ")";
            a.queryGroups({ q: c }, !0).then(
              function(a) {
                0 < a.total && a.results
                  ? ((a = a.results),
                    (a =
                      this.findRFTLocaleGroup(a, h) ||
                      this.findRFTLocaleGroup(a, "en")),
                    f.resolve(a))
                  : f.resolve(null);
              }.bind(this)
            );
            return f;
          },
          findRFTLocaleGroup: function(a, f) {
            var c;
            a.some(function(a) {
              var h = a.owner;
              if (h && h.substring(h.length - 2) === f) return (c = a), !0;
            });
            return c;
          },
          updateOptions: function(a, f) {
            if (a) {
              for (; 0 < a.getOptions().length; )
                a.removeOption(a.getOptions());
              a._setDisplay("");
              f && 0 < f.length && a.addOption(f);
            }
          },
          addOptionsFromLayers: function(a) {
            a.select &&
              a.layers &&
              ((a.customOptions = a.customOptions || []),
              (a.forbiddenLayers = a.forbiddenLayers || []),
              a.layers.forEach(function(f, c) {
                this.isLayerInLayers(f, a.forbiddenLayers) ||
                  a.customOptions.push({
                    value: c.toString(),
                    label: f.name,
                    selected:
                      a.selectedOption && this.isSameLayer(a.selectedOption, f)
                  });
              }, this),
              this.updateOptions(a.select, a.customOptions),
              this.addBrowseOptionForTool(
                { select: a.select, disableLAAL: !0 },
                a.widget
              ));
          },
          replaceTag: function(a) {
            return (
              { "\x26": "\x26amp;", "\x3c": "\x26lt;", "\x3e": "\x26gt;" }[a] ||
              a
            );
          },
          safetagsReplace: function(a) {
            return a.replace(/[<>]/g, this.replaceTag);
          }
        });
        v("extend-esri") && d.setObject("dijit.analysis.utils", k, Z);
        return k;
      });
    },
    "dojo/fx/easing": function() {
      define(["../_base/lang"], function(k) {
        var d = {
          linear: function(b) {
            return b;
          },
          quadIn: function(b) {
            return Math.pow(b, 2);
          },
          quadOut: function(b) {
            return b * (b - 2) * -1;
          },
          quadInOut: function(b) {
            b *= 2;
            return 1 > b ? Math.pow(b, 2) / 2 : (-1 * (--b * (b - 2) - 1)) / 2;
          },
          cubicIn: function(b) {
            return Math.pow(b, 3);
          },
          cubicOut: function(b) {
            return Math.pow(b - 1, 3) + 1;
          },
          cubicInOut: function(b) {
            b *= 2;
            return 1 > b ? Math.pow(b, 3) / 2 : (Math.pow(b - 2, 3) + 2) / 2;
          },
          quartIn: function(b) {
            return Math.pow(b, 4);
          },
          quartOut: function(b) {
            return -1 * (Math.pow(b - 1, 4) - 1);
          },
          quartInOut: function(b) {
            b *= 2;
            return 1 > b ? Math.pow(b, 4) / 2 : -0.5 * (Math.pow(b - 2, 4) - 2);
          },
          quintIn: function(b) {
            return Math.pow(b, 5);
          },
          quintOut: function(b) {
            return Math.pow(b - 1, 5) + 1;
          },
          quintInOut: function(b) {
            b *= 2;
            return 1 > b ? Math.pow(b, 5) / 2 : (Math.pow(b - 2, 5) + 2) / 2;
          },
          sineIn: function(b) {
            return -1 * Math.cos((Math.PI / 2) * b) + 1;
          },
          sineOut: function(b) {
            return Math.sin((Math.PI / 2) * b);
          },
          sineInOut: function(b) {
            return (-1 * (Math.cos(Math.PI * b) - 1)) / 2;
          },
          expoIn: function(b) {
            return 0 == b ? 0 : Math.pow(2, 10 * (b - 1));
          },
          expoOut: function(b) {
            return 1 == b ? 1 : -1 * Math.pow(2, -10 * b) + 1;
          },
          expoInOut: function(b) {
            if (0 == b) return 0;
            if (1 == b) return 1;
            b *= 2;
            if (1 > b) return Math.pow(2, 10 * (b - 1)) / 2;
            --b;
            return (-1 * Math.pow(2, -10 * b) + 2) / 2;
          },
          circIn: function(b) {
            return -1 * (Math.sqrt(1 - Math.pow(b, 2)) - 1);
          },
          circOut: function(b) {
            return Math.sqrt(1 - Math.pow(b - 1, 2));
          },
          circInOut: function(b) {
            b *= 2;
            return 1 > b
              ? -0.5 * (Math.sqrt(1 - Math.pow(b, 2)) - 1)
              : 0.5 * (Math.sqrt(1 - Math.pow(b - 2, 2)) + 1);
          },
          backIn: function(b) {
            return Math.pow(b, 2) * (2.70158 * b - 1.70158);
          },
          backOut: function(b) {
            --b;
            return Math.pow(b, 2) * (2.70158 * b + 1.70158) + 1;
          },
          backInOut: function(b) {
            b *= 2;
            if (1 > b)
              return (Math.pow(b, 2) * (3.5949095 * b - 2.5949095)) / 2;
            b -= 2;
            return (Math.pow(b, 2) * (3.5949095 * b + 2.5949095) + 2) / 2;
          },
          elasticIn: function(b) {
            if (0 == b || 1 == b) return b;
            --b;
            return (
              -1 *
              Math.pow(2, 10 * b) *
              Math.sin((2 * (b - 0.075) * Math.PI) / 0.3)
            );
          },
          elasticOut: function(b) {
            return 0 == b || 1 == b
              ? b
              : Math.pow(2, -10 * b) *
                  Math.sin((2 * (b - 0.075) * Math.PI) / 0.3) +
                  1;
          },
          elasticInOut: function(b) {
            if (0 == b) return 0;
            b *= 2;
            if (2 == b) return 1;
            var d = 0.3 * 1.5,
              g = d / 4;
            if (1 > b)
              return (
                --b,
                -0.5 *
                  Math.pow(2, 10 * b) *
                  Math.sin((2 * (b - g) * Math.PI) / d)
              );
            --b;
            return (
              0.5 *
                Math.pow(2, -10 * b) *
                Math.sin((2 * (b - g) * Math.PI) / d) +
              1
            );
          },
          bounceIn: function(b) {
            return 1 - d.bounceOut(1 - b);
          },
          bounceOut: function(b) {
            return b < 1 / 2.75
              ? 7.5625 * Math.pow(b, 2)
              : b < 2 / 2.75
              ? 7.5625 * Math.pow(b - 1.5 / 2.75, 2) + 0.75
              : b < 2.5 / 2.75
              ? 7.5625 * Math.pow(b - 2.25 / 2.75, 2) + 0.9375
              : 7.5625 * Math.pow(b - 2.625 / 2.75, 2) + 0.984375;
          },
          bounceInOut: function(b) {
            return 0.5 > b
              ? d.bounceIn(2 * b) / 2
              : d.bounceOut(2 * b - 1) / 2 + 0.5;
          }
        };
        k.setObject("dojo.fx.easing", d);
        return d;
      });
    },
    "dojox/mvc/equals": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/Stateful",
        "./StatefulArray"
      ], function(k, d, b, e) {
        var g = function(b, d, e) {
          e = e || g;
          var q = [e.getType(b), e.getType(d)];
          return q[0] != q[1]
            ? !1
            : e[
                "equals" +
                  q[0].replace(/^[a-z]/, function(b) {
                    return b.toUpperCase();
                  })
              ](b, d);
        };
        return d.setObject(
          "dojox.mvc.equals",
          d.mixin(g, {
            getType: function(b) {
              return d.isArray(b)
                ? "array"
                : d.isFunction((b || {}).getTime)
                ? "date"
                : null != b &&
                  ("[object Object]" == {}.toString.call(b) ||
                    (d.isFunction((b || {}).set) &&
                      d.isFunction((b || {}).watch)))
                ? "object"
                : "value";
            },
            equalsArray: function(b, d) {
              for (var e = 0, q = Math.max(b.length, d.length); e < q; e++)
                if (!g(b[e], d[e])) return !1;
              return !0;
            },
            equalsDate: function(b, d) {
              return b.getTime() == d.getTime();
            },
            equalsObject: function(e, k) {
              var q = d.mixin({}, e, k),
                u;
              for (u in q)
                if (
                  !(u in b.prototype || "_watchCallbacks" == u || g(e[u], k[u]))
                )
                  return !1;
              return !0;
            },
            equalsValue: function(b, d) {
              return b === d;
            }
          })
        );
      });
    },
    "dojox/mvc/StatefulArray": function() {
      define(["dojo/_base/lang", "dojo/Stateful"], function(k, d) {
        function b(b) {
          b._watchElementCallbacks && b._watchElementCallbacks(void 0, [], []);
          return b;
        }
        var e = function(g) {
          g = k._toArray(g || []);
          g.constructor = e;
          return k.mixin(
            g,
            {
              pop: function() {
                return this.splice(this.get("length") - 1, 1)[0];
              },
              push: function() {
                this.splice.apply(
                  this,
                  [this.get("length"), 0].concat(k._toArray(arguments))
                );
                return this.get("length");
              },
              reverse: function() {
                return b([].reverse.apply(this, k._toArray(arguments)));
              },
              shift: function() {
                return this.splice(0, 1)[0];
              },
              sort: function() {
                return b([].sort.apply(this, k._toArray(arguments)));
              },
              splice: function(b, d) {
                var e = this.get("length");
                b += 0 > b ? e : 0;
                var g = Math.min(b, e),
                  q = this.slice(b, b + d),
                  u = k._toArray(arguments).slice(2);
                [].splice.apply(this, [b, d].concat(Array(u.length)));
                for (var E = 0; E < u.length; E++) this[g + E] = u[E];
                this._watchElementCallbacks &&
                  this._watchElementCallbacks(b, q, u);
                this._watchCallbacks &&
                  this._watchCallbacks("length", e, e - q.length + u.length);
                return q;
              },
              unshift: function() {
                this.splice.apply(this, [0, 0].concat(k._toArray(arguments)));
                return this.get("length");
              },
              concat: function(b) {
                return new e([].concat.apply(this, arguments));
              },
              join: function(b) {
                for (var d = [], e = this.get("length"), g = 0; g < e; g++)
                  d.push(this.get(g));
                return d.join(b);
              },
              slice: function(b, d) {
                var g = this.get("length");
                d = (void 0 === d ? g : d) + (0 > d ? g : 0);
                var k = [];
                for (
                  b = b + (0 > b ? g : 0) || 0;
                  b < Math.min(d, this.get("length"));
                  b++
                )
                  k.push(this.get(b));
                return new e(k);
              },
              watchElements: function(b) {
                var d = this._watchElementCallbacks,
                  e = this;
                d ||
                  ((d = this._watchElementCallbacks = function(b, g, k) {
                    for (var q = [].concat(d.list), v = 0; v < q.length; v++)
                      q[v].call(e, b, g, k);
                  }),
                  (d.list = []));
                d.list.push(b);
                var g = {};
                g.unwatch = g.remove = function() {
                  for (var e = d.list, g = 0; g < e.length; g++)
                    if (e[g] == b) {
                      e.splice(g, 1);
                      break;
                    }
                };
                return g;
              }
            },
            d.prototype,
            {
              set: function(b, e) {
                if ("length" == b)
                  (b = this.get("length")),
                    b < e
                      ? this.splice.apply(this, [b, 0].concat(Array(e - b)))
                      : e < b && this.splice.apply(this, [e, b - e]);
                else {
                  var g = this.length;
                  d.prototype.set.call(this, b, e);
                  g != this.length &&
                    d.prototype.set.call(this, "length", this.length);
                }
                return this;
              },
              isInstanceOf: function(b) {
                return (
                  d.prototype.isInstanceOf.apply(this, arguments) || b == e
                );
              }
            }
          );
        };
        e._meta = { bases: [d] };
        return k.setObject("dojox.mvc.StatefulArray", e);
      });
    },
    "esri/dijit/analysis/HelpWindow": function() {
      define("require dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/event dojo/_base/kernel dojo/aspect dojo/has dojo/dom-construct dojo/dom-class dojo/dom-attr dojo/dom-style dojo/query dojo/window dojo/dom-geometry dijit/_Widget dijit/TooltipDialog dijit/popup ../../kernel ../../lang ../../urlUtils ../../request ../_EventedWidget dojo/i18n!../../nls/jsapi".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q,
        K,
        r
      ) {
        b = b([C], {
          declaredClass: "esri.dijit.analysis.HelpWindow",
          i18n: null,
          onlineHelpMap: null,
          showLearnMore: !1,
          class: "esriAnalyisHelpWindow",
          constructor: function(a) {
            this.isPortal = a && a.isPortal;
          },
          postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            e.mixin(this.i18n, r.common);
            e.mixin(this.i18n, r.analysisHelp);
          },
          postCreate: function() {
            this.inherited(arguments);
            var a = ["ar", "he"],
              c,
              n;
            this.onlineHelpMap = {};
            for (c = 0; c < a.length; c += 1)
              (n = a[c]),
                u.locale &&
                  -1 !== u.locale.indexOf(n) &&
                  (-1 !== u.locale.indexOf("-")
                    ? -1 !== u.locale.indexOf(n + "-") &&
                      (this._isRightToLeft = !0)
                    : (this._isRightToLeft = !0));
            a = k.toUrl(
              this.isPortal
                ? "./help/helpmap_enterprise.json"
                : "./help/helpmap.json"
            );
            Q({ url: a }).then(
              e.hitch(this, function(a) {
                this.onlineHelpMap = a.map;
              })
            );
            this._initSelfHelpMap();
          },
          _getAbsoluteUrl: function(a) {
            var c = M.getProtocolForWebResource();
            if (/^https?\:/i.test(a)) return a;
            if (/^\/\//i.test(a)) return c + a;
            if (/^\//i.test(a)) return c + "//" + window.location.host + a;
          },
          _computeSize: function(a) {
            var c = { w: 400, h: 200 };
            A("esri-mobile")
              ? (c = { w: "50%", h: "90%" })
              : -1 !== a.indexOf("Category")
              ? ((c.w = 400), (c.h = 320))
              : -1 !== a.indexOf("Tool")
              ? ((c.w = 400), (c.h = 320))
              : -1 !== a.indexOf("toolDescription") &&
                ((c.w = 400), (c.h = 520));
            return c;
          },
          _initSelfHelpMap: function() {
            this.isPortal &&
              this.portalSelf &&
              this.portalSelf.helpMap &&
              (this.selfHelpMap = this.portalSelf.helpMap.m);
          },
          _setHelpTopicAttr: function(a) {
            this.tooltipHelpDlg &&
              (I.close(this.tooltipHelpDlg),
              this.tooltipHelpDlg.destroy(),
              (this.tooltipHelpDlg = null));
            var c,
              n,
              h,
              l,
              b,
              r,
              g = "",
              p;
            this.showLearnMore = !1;
            h =
              this._analysisGpServer &&
              -1 !== this._analysisGpServer.indexOf("dev")
                ? "dev"
                : this._analysisGpServer &&
                  -1 !== this._analysisGpServer.indexOf("qa")
                ? "uat"
                : "";
            g = this.isPortal ? "-PortalOnly" : "-OnlineOnly";
            c = e.clone(u.locale);
            l = ["es-es", "es-mx"];
            "nb" === c
              ? (c = "no")
              : -1 !== d.indexOf(l, c) && (c = c.split("-")[0]);
            n = "ar bs ca cs da de es el et fi fr he hr hu id it ja ko lt lv ru nl no pl pt-br pt-pt ro sl sv sr th tr uk vi zh-cn zh-hk zh-tw".split(
              " "
            );
            r = "ar de es fr it ja ko ru pl pt-br zh-cn".split(" ");
            "SHOWHELPURL" === a
              ? ((l = this.helpIdUrl), (this.showLearnMore = !1))
              : ((l = k.toUrl(
                  "esri/dijit/analysis/help/" + this.helpFileName + ".html"
                )),
                (p = this.helpFileName),
                J.isDefined(this.onlineHelpMap[p]) &&
                  J.isDefined(this.onlineHelpMap[p][a]) &&
                  ((this.showLearnMore = !0),
                  (b =
                    "https://doc" +
                    h +
                    ".arcgis.com/en/arcgis-online/analyze/" +
                    this.onlineHelpMap[p][a]),
                  this.isPortal &&
                    this.helpBase &&
                    this.selfHelpMap &&
                    (b =
                      this.helpBase +
                      this.selfHelpMap[this.onlineHelpMap[p][a]])),
                -1 !== d.indexOf(n, c) &&
                  (-1 !== c.indexOf("-") &&
                    ((c = c.split("-")), (c = c[0] + "-" + c[1].toUpperCase())),
                  (l = k.toUrl(
                    "esri/dijit/analysis/help/" +
                      c +
                      "/" +
                      this.helpFileName +
                      ".html"
                  ))),
                -1 !== d.indexOf(r, c) &&
                  this.showLearnMore &&
                  ((b =
                    "https://doc" +
                    h +
                    ".arcgis.com/" +
                    c +
                    "/arcgis-online/analyze/" +
                    this.onlineHelpMap[p][a]),
                  this.isPortal && this.helpBase && this.selfHelpMap
                    ? (b =
                        this.helpBase +
                        this.selfHelpMap[this.onlineHelpMap[p][a]])
                    : this.isPortal &&
                      !this.helpBase &&
                      (b =
                        "https://server" +
                        h +
                        ".arcgis.com/" +
                        c +
                        "/portal/latest/use/" +
                        this.onlineHelpMap[p][a])));
            this._size = h = this._computeSize(a);
            this.tooltipHelpDlg = new N({
              preload: !0,
              content:
                "\x3cdiv class\x3d'' style\x3d'position:relative'\x3cdiv class\x3d'sizer content'\x3e\x3cdiv class\x3d'contentPane'\x3e\x3cdiv class\x3d'esriFloatTrailing' style\x3d'padding:0;'\x3e\x3ca href\x3d'#' class\x3d'esriAnalysisCloseIcon' title\x3d'" +
                this.i18n.close +
                "'\x3e\x3c/a\x3e\x3c/div\x3e\x3ciframe frameborder\x3d'0'  id\x3d'" +
                a +
                "' src\x3d'" +
                l +
                "#" +
                a +
                g +
                "' width\x3d'" +
                h.w +
                "' height\x3d'" +
                h.h +
                "' marginheight\x3d'0' marginwidth\x3d'0'\x3e\x3c/iframe\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'sizer'\x3e\x3cdiv class\x3d'actionsPane'\x3e\x3cdiv class\x3d'actionList" +
                (this.showLearnMore ? "'\x3e" : " hidden'\x3e") +
                "\x3ca class\x3d'action zoomTo' href\x3d'" +
                (this.showLearnMore ? b : "#") +
                "' target\x3d'_help'\x3e" +
                this.i18n.learnMore +
                "\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
              class: "esriHelpPopup esriHelpPopupWrapper esriAnalyisHelpWindow"
            });
            this.tooltipHelpDlg.startup();
          },
          show: function(a, c) {
            this.helpFileName = c.helpFileName;
            this._analysisGpServer = c.analysisGpServer;
            this.isPortal = c.isPortal;
            this.helpBase = c.helpBase;
            c.portalSelf && (this.portalSelf = c.portalSelf);
            this.selfHelpMap || this._initSelfHelpMap();
            c.analysisMode && (this.analysisMode = c.analysisMode);
            c.showHelpFromUrl &&
              c.helpUrl &&
              ((this.showHelpFromUrl = c.showHelpFromUrl),
              (this.helpIdUrl = c.helpUrl),
              (c.helpId = "SHOWHELPURL"));
            this.set("helpTopic", c.helpId);
            var n = x.after(
                I,
                "open",
                e.hitch(this, function() {
                  w(".esriAnalysisCloseIcon", this.tooltipHelpDlg.domNode).on(
                    "click",
                    e.hitch(this, this.close)
                  );
                  n.remove();
                })
              ),
              h = a.pageX,
              l = p.getBox(),
              b,
              d,
              r;
            r = !1;
            c.helpParentNode && (b = c.helpParentNode);
            b && (d = t.position(b));
            d && l.w - a.pageX < d.w
              ? ((r = !0),
                (h = d.x - this._size.w - 10),
                this._isRightToLeft && (h -= 10))
              : this._isRightToLeft &&
                h - 40 < this._size.w &&
                (h = d.w + this._size.w + 80);
            I.open({
              popup: this.tooltipHelpDlg,
              x: !0 === this._isRightToLeft || r ? h - 40 : h + 40,
              y: a.screenY - a.pageY + 10,
              onCancel: e.hitch(this, function() {
                this.close();
              }),
              onExecute: function() {
                this.close();
              }
            });
            this.tooltipHelpDlg.domNode.parentNode &&
              y.set(
                this.tooltipHelpDlg.domNode.parentNode,
                "overflowY",
                "hidden"
              );
          },
          close: function(a, c) {
            I.close(this.tooltipHelpDlg);
          }
        });
        A("extend-esri") && e.setObject("dijit.analysis.HelpWindow", b, H);
        return b;
      });
    },
    "esri/dijit/BrowseItems": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/window dojo/_base/event dojo/dom-class dojo/dom-style dojo/dom-attr dojo/string dojo/on dojo/aspect dojo/has dojo/dom dojo/dom-construct dojo/mouse dojo/topic dojo/query dojo/parser dijit/registry dijit/TooltipDialog dijit/popup dojo/promise/all dojo/Deferred dgrid/Grid dgrid/extensions/Pagination dgrid/extensions/DijitRegistry dgrid/OnDemandGrid dgrid/Selection dgrid/selector dgrid/Keyboard dgrid/util/mouse dgrid/util/touch put-selector/put dojo/store/Observable dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin ../arcgis/Portal ../Evented ../PluginTarget dojo/i18n!../nls/jsapi ./_AppTemplateFiltersMixin ./_RefreshMixin ../kernel ../lang ../config ../geometry/webMercatorUtils ../tasks/GeometryService ../SpatialReference dojo/NodeList-dom".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q,
        K,
        r,
        a,
        c,
        n,
        h,
        l,
        F,
        V,
        P,
        R,
        U,
        Z,
        B,
        D,
        X,
        aa,
        Y,
        ba,
        f,
        O,
        S,
        W,
        ca,
        fa,
        da
      ) {
        var T = k(null, {
          idProperty: "id",
          constructor: function(a) {
            k.safeMixin(this, a);
          },
          get: function(a, f) {
            return D.PortalUtil.request(
              this.portalUrl + "content/items/" + a,
              f
            ).then(function(a) {
              return new D.PortalItem(d.mixin(a, { portal: this.portal }));
            });
          },
          getIdentity: function(a) {
            return a[this.idProperty];
          },
          query: function(a, f) {
            a = d.isObject(a) ? a : { q: a };
            var c = null;
            if (f) {
              a = d.mixin(a, { num: f.count, start: (f.start || 0) + 1 });
              if (f.sort && f.sort.length) {
                var h = f.sort[0];
                a = d.mixin(a, {
                  sortField: encodeURIComponent(
                    "created" === h.attribute ? "uploaded" : h.attribute
                  ),
                  sortOrder: h.descending ? "desc" : "asc"
                });
              }
              f.useExtent && f.extent && (a.bbox = f.extent);
              f.queryType && "group" === f.queryType && (c = "group");
            }
            f =
              "group" === c
                ? this.portal.queryGroups(a, !0).then(function(a) {
                    a.results.total = a.total;
                    return a.results;
                  })
                : this.portal.queryItems(a, !0).then(function(a) {
                    a.results.total = a.total;
                    return a.results;
                  });
            return D.PortalResult(f);
          }
        });
        e = k([U, Z, B, aa], {
          templateString:
            '\x3cdiv\x3e\x3cdiv class\x3d"top-bar"\x3e\x3cdiv  class\x3d"esriFloatLeading instructions"\x3e\x3cspan class\x3d"messageLeft hide" data-dojo-attach-point\x3d"messageNodeLeft"\x3e\x3c/span\x3e\x3cspan class\x3d"messageRight hide" data-dojo-attach-point\x3d"messageNodeRight"\x3e\x3c/span\x3e\x3ca tabIndex\x3d"-1" data-dojo-attach-point\x3d"helpLink" class\x3d"esriHelpIcon hide" title\x3d"${i18n.browseItems.learnMoreConfigurableApps}" href\x3d"#" target\x3d"_blank"\x3e\x3c/a\x3e\x3c/div\x3e\x3cdiv id\x3d"${id}_search"class\x3d"searchBar esriFloatTrailing"\x3e\x3cinput tabIndex\x3d"1" placeholder\x3d"${i18n.browseItems.searchTitle}" class\x3d"esriSearchBox dijitTextBox" type\x3d"search"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"gallery"\x3e\x3cdiv class\x3d"gallery-left  quiet-scroll"\x3e\x3cul class\x3d"filters"\x3e\x3c/ul\x3e\x3c/div\x3e\x3cdiv class\x3d"templates gallery-right"\x3e\x3cp id\x3d"${id}_filterTitle" class\x3d"filter-title hide" data-dojo-attach-point\x3d"filterDescription"\x3e\x3c/p\x3e\x3cdiv id\x3d"${id}_grid"class\x3d"dgrid-autoheight quiet-scroll"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv  class\x3d"loaderWrap" data-dojo-attach-point\x3d"loaderWrap"\x3e\x3c/div\x3e\x3cdiv  class\x3d"js-info-panel templateInfoPanel" data-dojo-attach-point\x3d"infoPanel"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e',
          galleryTemplate:
            "\x3cdiv style\x3d'opacity:1;' class\x3d'grid-item gallery-view'\x3e${item:_formatThumbnail}${item:_formatItemTitle}\x3cp class\x3d\"template-overlay\" style\x3d\"display:none;\"\x3e${i18n.browseItems.selectDetails}\x3c/p\x3e\x3c/div\x3e",
          infoPanelTemplate:
            '\x3cdiv\x3e\x3cdiv class\x3d"template-info-showing"\x3e\x3cdiv class\x3d"thumbnail"\x3e\x3cimg src\x3d"${item:_formatInfoPanelImage}"\x3e\x3c/div\x3e\x3ch4\x3e${item.title}\x3c/h4\x3e\x3cdiv class\x3d"template-info"\x3e\x3cp class\x3d"quiet-scroll"\x3e${item.snippet}\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"panel-actions"\x3e\x3cbutton class\x3d"btn blue btn-main" id\x3d"on-next"\x3e${i18n.browseItems.configure}\x3c/button\x3e\x3cbutton class\x3d"btn btn-cancel" id\x3d"close-panel"\x3e${i18n.common.close}\x3c/button\x3e\x3c/div\x3e\x3cdiv\x3e',
          _popupTemplate:
            '\x3cdiv class\x3d"esriBrowsePopup quiet-scroll"\x3e\x3cp\x3e{summary}\x3c/p\x3e\x3c/div\x3e',
          showInfoPanel: !0,
          isAutoClose: !0,
          showTooltip: !1,
          filterWithinGroup: !0,
          checkIsButtonEnabled: !1,
          baseClass: "esriBrowseItemsCtr",
          i18n: Y,
          postMixInProperties: function() {
            this.inherited(arguments);
          },
          postCreate: function() {
            this.inherited(arguments);
            this.self
              ? ((this._portal = new D.Portal({
                  url: this.portalUrl,
                  self: this.self
                })),
                this._init(),
                this._portal.on(
                  "load",
                  d.hitch(this, function() {
                    this.emit("portal-load", { portal: this._portal });
                    this._fetchData();
                  })
                ))
              : ((this._portal = new D.Portal(this.portalUrl)),
                this._portal.signIn().then(
                  d.hitch(this, function() {
                    this.emit("portal-load", { portal: this._portal });
                    this._init();
                    this._fetchData();
                  })
                ));
          },
          _init: function() {
            this._canSearchPublic = this.self
              ? this.self.canSearchPublic
              : this._portal.canSearchPublic;
            this.query = d.mixin(this.query || {}, {
              get: function(a) {
                return this[a] && this[a].length
                  ? "(" + this[a].join(" OR ") + ") "
                  : "";
              },
              toString: function() {
                return {
                  q:
                    this.get("groups") +
                    this.get("tags") +
                    this.get("persistentTypekeywords") +
                    this.get("typekeywords") +
                    this.get("types") +
                    this.get("owners") +
                    this.get("orgids") +
                    this.get("custom") +
                    (this.query || "") +
                    (this.search || "") +
                    ' -type:"Attachment" -tags:"mature support"'
                };
              }
            });
            this.self
              ? (this.self.canSearchPublic = !0)
              : (this._portal.canSearchPublic = !0);
            this.galleryTemplate =
              (this.plugIn && this.plugIn.galleryTemplate) ||
              this.galleryTemplate;
            this.infoPanelTemplate =
              (this.plugIn && this.plugIn.infoPanelTemplate) ||
              this.infoPanelTemplate;
            if (
              (this.helpLinkUrl =
                (this.plugIn && this.plugIn.helpLinkUrl) || "")
            )
              x.set(this.helpLink, "href", this.helpLinkUrl),
                q.remove(this.helpLink, "hide");
            C(".templates", this.domNode).addClass("fade");
            C(".dgrid-footer", this.domNode).addClass("hide");
            u.set(this.infoPanel, "display", "none");
          },
          destroy: function() {
            this.inherited(arguments);
            this._grid && this._grid.destroy();
            this._img_connect &&
              (this._img_connect.remove(), this._img_connect_error.remove());
            this._queryTimer && clearTimeout(this._queryTimer);
            this._grid = this._portal = null;
          },
          closeInfoPanel: function() {
            y.byId("close-panel").click();
          },
          _setItemQueryAttr: function(a) {
            this.itemQuery = a;
          },
          _setPluginAttr: function(a) {
            this.addPlugin(a);
          },
          _setMessageAttr: function(a) {
            this.set("messageRight", a);
          },
          _setMessageRightAttr: function(a) {
            "string" === typeof a
              ? x.set(this.messageNodeRight, "innerHTML", a)
              : a instanceof HTMLElement && w.place(a, this.messageNodeRight);
            q.remove(this.messageNodeRight, "hide");
          },
          _setMessageLeftAttr: function(a) {
            "string" === typeof a
              ? x.set(this.messageNodeLeft, "innerHTML", a)
              : a instanceof HTMLElement && w.place(a, this.messageNodeLeft);
            q.remove(this.messageNodeLeft, "hide");
          },
          _setDisabledAttr: function(a) {
            var f = I.findWidgets(this.domNode).concat(
              I.findWidgets(this._content)
            );
            b.forEach(f, function(f) {
              f.set("disabled", a);
            });
            q[a ? "add" : "remove"](
              this._interval.domNode,
              "dijitTextBoxDisabled"
            );
          },
          _setSortAttr: function(a) {
            this.sortAttribute = a;
          },
          _setSortDescendingAttr: function(a) {
            this.sortDescending = a;
          },
          _getSelectionAttr: function() {
            var a = this._grid.selection,
              f;
            for (f in a) if (a.hasOwnProperty(f)) break;
            return f && this._grid.row(f).data;
          },
          _setGalleryTemplateAttr: function(a) {
            S.isDefined(a) && (this.galleryTemplate = a);
          },
          _setFormatThumbnailAttr: function(a) {
            S.isDefined(a) &&
              "function" === typeof a &&
              (this._formatThumbnail = a);
          },
          _setFormatItemTitleAttr: function(a) {
            S.isDefined(a) &&
              "function" === typeof a &&
              (this._formatItemTitle = a);
          },
          _setRowsPerPageAttr: function(a) {
            this._set("rowsPerPage", a);
          },
          _setPagingLinksAttr: function(a) {
            this._set("pagingLinks", a);
          },
          _getQueryAttr: function() {
            return this.query;
          },
          _setQueryAttr: function(a) {
            this._set("query", a);
            this._grid && this._grid.set("query", a.toString());
          },
          _setExtentAttr: function(a) {
            a && this._set("extent", this._extentToString(a));
          },
          _setUseExtentAttr: function(a) {
            this._set("useExtent", a);
          },
          _setQueryTypeAttr: function(a) {
            this._set("queryType", a);
          },
          _setFetchTimeoutAttr: function(a) {
            this._set("fetchTimeout", a);
          },
          _setShowInfoPanelAttr: function(a) {
            this._set("showInfoPanel", a);
          },
          _setSelectionModeAttr: function(a) {
            -1 ===
              b.indexOf(
                ["extended", "toggle", "multiple", "single", "none"],
                a
              ) &&
              (console.log(
                "Incorrect Value provided for selectionMode. It is one of the following: extended, toggle, multiple, single, none"
              ),
              (a = "single"));
            this._set("selectionMode", a);
          },
          _setDemandListAttr: function(a) {
            this._set("demandList", a);
          },
          _validate: function() {
            return !!this.get("selection");
          },
          reset: function() {
            C(".esriSearchBox", y.byId(this.id + "_search")).forEach(function(
              a
            ) {
              x.set(a, "value", "");
            });
            this.query.search = "";
            if (this.plugIn.filters) {
              var a = [],
                f = [],
                c = [],
                h = [];
              C("li.active", this.domNode).forEach(function(l) {
                q.remove(l, "active");
                var n = this.plugIn.filters[l.childNodes[0].id];
                l = b.map(
                  n.tags,
                  function(a) {
                    return 'tags:"' + a + '"';
                  },
                  this
                );
                var d = b.map(
                    n.owners,
                    function(a) {
                      return 'owner:"' + a + '"';
                    },
                    this
                  ),
                  r = b.map(
                    n.orgids,
                    function(a) {
                      return 'orgid:"' + a + '"';
                    },
                    this
                  ),
                  n = b.map(
                    n.typekeywords,
                    function(a) {
                      return 'typekeywords:"' + a + '"';
                    },
                    this
                  );
                a.push(l);
                c.push(d);
                h.push(r);
                f.push(n);
              }, this);
              this.query.tags = b.filter(this.query.tags, function(f) {
                return -1 !== b.indexOf(a, f);
              });
              this.query.owners = b.filter(this.query.owners, function(a) {
                return -1 !== b.indexOf(c, a);
              });
              this.query.orgids = b.filter(this.query.orgids, function(a) {
                return -1 !== b.indexOf(h, a);
              });
              this.query.typekeywords = b.filter(
                this.query.typekeywords,
                function(a) {
                  return -1 !== b.indexOf(f, a);
                }
              );
              y.byId("all").click();
            }
          },
          _showPopup: function(a) {
            if (!this._isInsideTooltipDialog) {
              this._closePopup();
              var f = this._grid.row(a);
              a = C("img", f.element)[0];
              if (((f = { summary: f.data.snippet }), f.summary))
                (this._tooltip = new H({
                  content: d.replace(this._popupTemplate, f),
                  onMouseEnter: d.hitch(this, function() {
                    this._isInsideTooltipDialog = !0;
                  }),
                  onMouseLeave: d.hitch(this, function() {
                    this._isInsideTooltipDialog = !1;
                    this._closePopup();
                  })
                })),
                  J.open({
                    className: "esriBrowsePopupCtr",
                    popup: this._tooltip,
                    around: a,
                    orient: ["after-centered", "before-centered"]
                  }),
                  (this._onCloseConnect = C(
                    ".dijitDialogCloseIcon",
                    this._tooltip.domNode
                  ).on(
                    "click",
                    d.hitch(this, function(a) {
                      a.preventDefault();
                      this._closePopup();
                    })
                  ));
            }
          },
          _closePopup: function() {
            this._tooltip &&
              (this._onCloseConnect && this._onCloseConnect.remove(),
              J.close(this._tooltip),
              this._tooltip.destroyRecursive(),
              (this._tooltip = this._onCloseConnect = void 0));
          },
          _clearQueryTimeout: function() {
            clearTimeout(this._queryTimer);
            this._queryTimer = null;
          },
          _clearClosePanelTimeout: function() {
            clearTimeout(this._panelClosing);
            this._panelClosing = null;
            b.forEach(this._panelClickHandles, "item.remove();");
            w.empty(this.infoPanel);
          },
          _createGrid: function() {
            var h = k([K, r, n, f, a]),
              l = new R(new T({ portal: this._portal })),
              e = this.query,
              m = d.hitch(this, function(a) {
                a.snippet = a.snippet || "";
                var f = P("div");
                a = A.substitute(
                  this.galleryTemplate,
                  { item: a, i18n: this.i18n },
                  null,
                  this
                );
                w.place(a, f);
                return f;
              }),
              O = {};
            this.get("demandList") && (h = k([K, c, n, f, a]));
            this.get("useExtent") &&
              ((O.extent = this.get("extent")),
              (O.useExtent = this.get("useExtent")));
            this.get("queryType") && (O.queryType = this.get("queryType"));
            var W = {
              store: l,
              query: e.toString(),
              selectionMode: this.selectionMode || "single",
              pagingLinks: this.get("pagingLinks") || 2,
              rowsPerPage:
                (this.plugIn && this.plugIn.rowsPerPage) ||
                this.get("itemsPerPage") ||
                6,
              loadingMessage: "Loading items...",
              showLoadingMessage: !1,
              renderRow: m,
              noDataMessage: this.i18n.gallery.noItemsToDisplay,
              deselectOnRefresh: !(
                "multiple" === this.selectionMode ||
                "extended" === this.selectionMode ||
                "toggle" === this.selectionMode
              ),
              sort: [
                {
                  attribute: this.sortAttribute || "title",
                  descending: this.sortDescending || !1
                }
              ],
              queryOptions: O
            };
            this.get("demandList") &&
              (W = {
                store: l,
                query: e.toString(),
                minRowsPerPage:
                  (this.plugIn && this.plugIn.rowsPerPage) ||
                  this.get("itemsPerPage") ||
                  50,
                selectionMode: this.selectionMode || "single",
                loadingMessage: "Loading items...",
                showLoadingMessage: !1,
                renderRow: m,
                pagingMethod: "throttleDelayed",
                noDataMessage: this.i18n.gallery.noItemsToDisplay,
                deselectOnRefresh: !(
                  "multiple" === this.selectionMode ||
                  "extended" === this.selectionMode ||
                  "toggle" === this.selectionMode
                ),
                sort: [
                  {
                    attribute: this.sortAttribute || "title",
                    descending: this.sortDescending || !1
                  }
                ],
                queryOptions: O
              });
            this._grid = new h(W, this.id + "_grid");
            this._grid.startup();
            this.own(
              v(
                this.domNode,
                "click",
                d.hitch(this, function(a) {
                  y.byId("close-panel") &&
                    this.isAutoClose &&
                    y.byId("close-panel").click();
                })
              ),
              this._grid.on(
                F.enterRow,
                d.hitch(this, function(a) {
                  !1 === q.contains(this.domNode, "showing") &&
                    this.showInfoPanel &&
                    this._showOverlay(!0, a);
                  this.showTooltip && !this.showInfoPanel && this._showPopup(a);
                })
              ),
              this._grid.on(
                F.leaveRow,
                d.hitch(this, function(a) {
                  this._showOverlay(!1, a);
                  this.showTooltip &&
                    !this.showInfoPanel &&
                    this._closePopup(a);
                })
              ),
              this._grid.on(
                ".dgrid-row:click",
                d.hitch(this, function(a) {
                  var f;
                  this.emit("grid-row-click", a);
                  !1 === q.contains(this.domNode, "showing") &&
                    this.showInfoPanel &&
                    (a.preventDefault(),
                    g.stop(a),
                    this._clearClosePanelTimeout(),
                    (f = this.get("selection")),
                    this._showOverlay(!1, a),
                    this.showInfoPanel && this.infoPanelTemplate
                      ? (u.set(this.infoPanel, "display", "block"),
                        w.place(
                          A.substitute(
                            this.infoPanelTemplate,
                            { item: f, i18n: this.i18n },
                            function(a) {
                              return S.isDefined(a) ? a : "";
                            },
                            this
                          ),
                          this.infoPanel
                        ))
                      : u.set(this.infoPanel, "display", "none"),
                    this.emit("show-info-panel"),
                    q.add(this.domNode, "showing"),
                    (this._panelClickHandles = [
                      C(
                        ".template-info-showing .thumbnail img",
                        this.domNode
                      ).on(
                        "error",
                        d.hitch(this, function(a) {
                          x.set(a.target, "src", f.thumbnailUrl);
                        })
                      ),
                      C(".panel-actions .btn").on(
                        "click",
                        d.hitch(this, function(a) {
                          a.preventDefault();
                          g.stop(a);
                          (this.checkIsButtonEnabled &&
                            q.contains(a.target, "disabled")) ||
                            ("close-panel" === a.target.id
                              ? (q.remove(this.domNode, "showing"),
                                u.set(this.infoPanel, "display", "none"),
                                (this._panelClosing = setTimeout(
                                  d.hitch(
                                    this,
                                    function() {
                                      b.forEach(void 0, "item.remove();");
                                      w.empty(this.infoPanel);
                                    },
                                    250
                                  )
                                )))
                              : (t.publish(
                                  "/esri/browseitems/close",
                                  a.target.id,
                                  this.get("selection")
                                ),
                                (a = {
                                  selection: this.get("selection"),
                                  action: a.target.id
                                }),
                                this.emit("browseitems-close", a)));
                        })
                      ),
                      C(".js-info-panel", this.domNode).on(
                        "click",
                        d.hitch(this, function(a) {
                          this.isAutoClose && (a.preventDefault(), g.stop(a));
                        })
                      ),
                      v(
                        C(".dgrid-footer,.dgrid-header", this._grid.domNode),
                        p.leave,
                        d.hitch(this, function(a) {
                          this.showTooltip &&
                            !this.showInfoPanel &&
                            this._closePopup();
                        })
                      )
                    ]));
                })
              ),
              this._grid.on(
                "dgrid-refresh-complete",
                d.hitch(this, function(a) {
                  C(".templates", this.domNode).removeClass("fade");
                  C(".loaderWrap", this.domNode).addClass("hide");
                  C(".dgrid-footer", this.domNode)[
                    this._grid._total <= this._grid.rowsPerPage
                      ? "addClass"
                      : "removeClass"
                  ]("hide");
                  this.showTooltip && !this.showInfoPanel && this._closePopup();
                })
              ),
              this._grid.on(
                "refresh",
                d.hitch(this, function() {
                  this.showTooltip && !this.showInfoPanel && this._closePopup();
                  this._img_connect &&
                    (this._img_connect.remove(),
                    this._img_connect_error.remove(),
                    (this._img_connect_error = this._img_connect = null));
                  this._img_connect = C(
                    ".grid-item-thumb",
                    this._grid.domNode
                  ).on(
                    "load",
                    d.hitch(this, function(a) {
                      (a = this._grid.row(a)) &&
                        a.element &&
                        C(".grid-item", a.element)
                          .addClass("fadeIn")
                          .style("opacity", "1");
                    })
                  );
                  this._img_connect_error = C(
                    ".grid-item-thumb",
                    this._grid.domNode
                  ).on(
                    "error",
                    d.hitch(this, function(a) {
                      x.set(
                        a.target,
                        "src",
                        this._portal.staticImagesUrl + "/desktopapp.png"
                      );
                    })
                  );
                })
              ),
              v(
                y.byId(this.id + "_search"),
                "keyup",
                d.hitch(this, function(a) {
                  a.preventDefault();
                  this._clearQueryTimeout();
                  this._queryTimer = setTimeout(
                    d.hitch(this, function() {
                      this.query.search = x.get(a.target, "value");
                      this._fetchItems(this.query).then(
                        d.hitch(this, function() {
                          this._clearQueryTimeout();
                        })
                      );
                    }),
                    this.searchKeypressDelay || 450
                  );
                })
              ),
              v(
                y.byId(this.id + "_search"),
                "search",
                d.hitch(this, function(a) {
                  this._queryTimer ||
                    (a.preventDefault(),
                    (this.query.search = x.get(a.target, "value")),
                    this._fetchItems(this.query));
                })
              ),
              this.watch(
                "extent",
                d.hitch(this, function(a, f, c) {
                  this._grid.queryOptions.extent = this.get("extent");
                  this._grid.queryOptions.useExtent = this.get("useExtent");
                  this._grid.query.bbox = this._grid.queryOptions.useExtent
                    ? this._grid.queryOptions.extent
                    : "";
                  this._grid.refresh();
                })
              ),
              this.watch(
                "useExtent",
                d.hitch(this, function(a, f, c) {
                  this._grid.queryOptions.extent = this.get("extent");
                  this._grid.queryOptions.useExtent = c;
                  this._grid.query.bbox = this._grid.queryOptions.useExtent
                    ? this._grid.queryOptions.extent
                    : "";
                  this._grid.refresh();
                })
              )
            );
            this.showInfoPanel ||
              ("single" === this._grid.selectionMode
                ? this.own(
                    this._grid.on(
                      "dgrid-select,dgrid-deselect",
                      d.hitch(this, function(a) {
                        a = { selection: this.get("selection") };
                        this.emit("select-change", a);
                      })
                    )
                  )
                : -1 !==
                    b.indexOf(
                      ["toggle", "multiple", "extended"],
                      this._grid.selectionMode
                    ) &&
                  this.own(
                    this._grid.on(
                      "dgrid-select,dgrid-deselect",
                      d.hitch(this, function(a) {
                        a = a.grid.selection;
                        var f,
                          c = [];
                        for (f in a) a[f] && c.push(this._grid.row(f).data);
                        this.emit("select-change", { selection: c });
                      })
                    )
                  ));
            this.emit("grid-ready", { grid: this._grid, ready: !0 });
          },
          _createFilters: function() {
            if (this.plugIn && this.plugIn.filters) {
              var a = this.plugIn.filters,
                f = this.plugIn.filterStrings,
                c,
                h = C(".filters", this.domNode)[0];
              for (c in a)
                w.create(
                  "li",
                  {
                    class: "all" === c ? "active" : "",
                    innerHTML:
                      "\x3ca id\x3d'" +
                      c +
                      "'  href\x3d'#'\x3e" +
                      f[c].title +
                      "\x3c/a\x3e"
                  },
                  h
                );
              this.own(
                v(
                  h,
                  "li a:click",
                  d.hitch(this, function(c) {
                    c.preventDefault();
                    var l = c.target;
                    C(".active", h).removeClass("active");
                    q.add(l.parentNode, "active");
                    C(".templates", this.domNode).addClass("fade");
                    setTimeout(
                      d.hitch(this, function() {
                        q["all" === l.id ? "add" : "remove"](
                          this.filterDescription,
                          "hide"
                        );
                        x.set(
                          this.filterDescription,
                          "innerHTML",
                          f[l.id].description || ""
                        );
                      }),
                      225
                    );
                    c = d.mixin({}, a[l.id] || {});
                    this.query.tags = b.map(c.tags || [], function(a) {
                      return 'tags:"' + a + '"';
                    });
                    this.query.owners = b.map(c.owners, function(a) {
                      return 'owner:"' + a + '"';
                    });
                    this.query.orgids = b.map(c.orgids, function(a) {
                      return 'orgid:"' + a + '"';
                    });
                    this.query.typekeywords = [].concat(
                      b.map(c.typekeywords || [], function(a) {
                        return 'typekeywords:"' + a + '"';
                      })
                    );
                    this.filterWithinGroup ||
                      (this.query.groups = b.map(c.groups, function(a) {
                        return 'group:"' + a + '"';
                      }));
                    this._fetchItems(this.query);
                  })
                )
              );
              q.add(this.domNode, "filters");
              q.remove(this.domNode, "nofilters");
            } else
              q.add(
                this.domNode,
                "nofilters" +
                  (this.plugIn && this.plugIn.extraClasses
                    ? " " + this.plugIn.extraClasses.join(" ")
                    : "")
              ),
                q.remove(this.domNode, "filters");
          },
          _showOverlay: function(a, f) {
            (f = this._grid.row(f)) &&
              C(".template-overlay", f.element).style(
                "display",
                a ? "" : "none"
              );
          },
          _fetchData: function() {
            this._user = this._portal.getPortalUser();
            return this.plugIn && this.plugIn.fetchData
              ? this.plugIn.fetchData()
              : this._fetchItems(this.itemQuery);
          },
          _fetchItems: function(a, f) {
            var c = {
                sort: [
                  {
                    attribute: this.sortAttribute || "title",
                    descending: this.sortDescending || !1
                  }
                ]
              },
              h = new Q();
            this.get("useExtent") &&
              ((c.extent = this.get("extent")),
              (c.useExtent = this.get("useExtent")));
            this.get("queryType") && (c.queryType = this.get("queryType"));
            C(".templates", this.domNode).addClass("fade");
            C(".dgrid-footer", this.domNode).addClass("hide");
            C(".loaderWrap", this.domNode).removeClass("hide");
            setTimeout(
              d.hitch(this, function() {
                this.query = d.mixin(this.query, a);
                this._grid
                  ? this._grid.set("query", this.query.toString(), c)
                  : (this._createFilters(), this._createGrid());
                h.resolve(this._grid);
              }),
              60
            );
            return h;
          },
          _formatThumbnail: function(a) {
            var f =
              a.thumbnailUrl ||
              this._portal.staticImagesUrl + "/desktopapp.png";
            a.thumbnailUrl = f;
            return (
              "\x3cimg class\x3d'grid-item-thumb' width\x3d'187px' height\x3d'125px' alt\x3d'' src\x3d'" +
              f +
              "'\x3e"
            );
          },
          _formatInfoPanelImage: function(a) {
            var f =
              a.screenshots && a.screenshots.length ? a.screenshots[0] : null;
            return f ? a.itemUrl + "/info/" + f : a.thumbnailUrl;
          },
          _formatItemTitle: function(a) {
            return (
              "\x3ch5\x3e" +
              (a.title || a.name || "\x3cNo Title\x3e") +
              "\x3c/h5\x3e"
            );
          },
          clear: function() {
            this._grid.clearSelection();
          },
          doProject: function(a, f) {
            var c = [102113, 102100, 3857],
              h = new Q(),
              l,
              n;
            l = function(a, f) {
              !(a && 0 < a.length && a[0] && "extent" == a[0].type) ||
              isNaN(a[0].xmin) ||
              isNaN(a[0].ymin) ||
              isNaN(a[0].xmax) ||
              isNaN(a[0].ymax)
                ? a &&
                  0 < a.length &&
                  a[0] &&
                  "point" == a[0].type &&
                  !isNaN(a[0].x) &&
                  !isNaN(a[0].y) &&
                  h.resolve(a, f)
                : h.resolve(a, f);
            };
            null != a.spatialReference.wkid &&
            4326 == a.spatialReference.wkid &&
            null != f.wkid &&
            this.contains(c, f.wkid)
              ? ((a.ymin = Math.max(a.ymin, -89.99)),
                (a.ymax = Math.min(a.ymax, 89.99)),
                (a = ca.geographicToWebMercator(a)),
                (c = a.spatialReference._getInfo()) &&
                  a.xmin > a.xmax &&
                  ((l = c.valid[1] - a.xmin),
                  (n = a.xmax - c.valid[0]),
                  l > n
                    ? (a.xmax = c.valid[1] + n)
                    : (a.xmin = c.valid[0] - l)),
                (a.spatialReference.wkid = f.wkid),
                h.resolve([a]))
              : null != a.spatialReference.wkid &&
                this.contains(c, a.spatialReference.wkid) &&
                null != f.wkid &&
                4326 == f.wkid
              ? ((a = ca.webMercatorToGeographic(a)),
                (c = a.spatialReference._getInfo()) &&
                  a.xmin > a.xmax &&
                  ((l = c.valid[1] - a.xmin),
                  (n = a.xmax - c.valid[0]),
                  l > n
                    ? (a.xmax = c.valid[1] + n)
                    : (a.xmin = c.valid[0] - l)),
                h.resolve([a]))
              : (this.geometryService ||
                  (this.geometryService = new fa(W.defaults.geometryService)),
                this.geometryService.project([a], f, l));
            return h;
          },
          contains: function(a, f) {
            for (var c = a.length; c--; ) if (a[c] === f) return !0;
            return !1;
          },
          _extentToGCS: function(a) {
            a = a.shiftCentralMeridian(!0);
            return ca.webMercatorToGeographic(a);
          },
          _extentToString: function(a) {
            var f = "";
            null != a &&
              ((a = this._extentToGCS(a)),
              (f =
                this._roundValue(a.xmin, 1e4) +
                "," +
                this._roundValue(a.ymin, 1e4) +
                "," +
                this._roundValue(a.xmax, 1e4) +
                "," +
                this._roundValue(a.ymax, 1e4)));
            return f;
          },
          _roundValue: function(a, f) {
            return Math.round(a * f) / f;
          }
        });
        E("extend-esri") && d.setObject("dijit.BrowseItems", e, O);
        return e;
      });
    },
    "dgrid/extensions/Pagination": function() {
      define("../_StoreMixin dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/_base/Deferred dojo/on dojo/query dojo/string dojo/has put-selector/put ../util/misc dojo/i18n!./nls/pagination dojo/_base/sniff xstyle/css!../css/extensions/Pagination.css".split(
        " "
      ), function(k, d, b, e, g, q, u, x, A, v, z, E) {
        function y(b) {
          b.noDataNode
            ? (v(b.noDataNode, "!"), delete b.noDataNode)
            : b.cleanup();
          b.contentNode.innerHTML = "";
        }
        function w(b) {
          if (b.loadingNode) v(b.loadingNode, "!"), delete b.loadingNode;
          else if (b._oldPageNodes) {
            for (var d in b._oldPageNodes) b.removeRow(b._oldPageNodes[d]);
            delete b._oldPageNodes;
            b._oldPageObserver &&
              (b._oldPageObserver.cancel(),
              b._numObservers--,
              delete b._oldPageObserver);
          }
          delete b._isLoading;
        }
        return d("dgrid.extensions.Pagination", k, {
          rowsPerPage: 10,
          pagingTextBox: !1,
          previousNextArrows: !0,
          firstLastArrows: !1,
          pagingLinks: 2,
          pageSizeOptions: null,
          showLoadingMessage: !0,
          i18nPagination: E,
          showFooter: !0,
          _currentPage: 1,
          _total: 0,
          buildRendering: function() {
            this.inherited(arguments);
            var b = this,
              d = (this.paginationNode = v(
                this.footerNode,
                "div.dgrid-pagination"
              )),
              e = (this.paginationStatusNode = v(d, "div.dgrid-status")),
              g = this.i18nPagination;
            e.tabIndex = 0;
            this._updatePaginationSizeSelect();
            this._updateRowsPerPageOption();
            e.innerHTML = x.substitute(g.status, {
              start: 1,
              end: 1,
              total: 0
            });
            d = this.paginationNavigationNode = v(d, "div.dgrid-navigation");
            this.firstLastArrows &&
              ((e = this.paginationFirstNode = v(
                d,
                "span.dgrid-first.dgrid-page-link",
                "\u00ab"
              )),
              e.setAttribute("aria-label", g.gotoFirst),
              (e.tabIndex = 0));
            this.previousNextArrows &&
              ((e = this.paginationPreviousNode = v(
                d,
                "span.dgrid-previous.dgrid-page-link",
                "\u2039"
              )),
              e.setAttribute("aria-label", g.gotoPrev),
              (e.tabIndex = 0));
            this.paginationLinksNode = v(d, "span.dgrid-pagination-links");
            this.previousNextArrows &&
              ((e = this.paginationNextNode = v(
                d,
                "span.dgrid-next.dgrid-page-link",
                "\u203a"
              )),
              e.setAttribute("aria-label", g.gotoNext),
              (e.tabIndex = 0));
            this.firstLastArrows &&
              ((e = this.paginationLastNode = v(
                d,
                "span.dgrid-last.dgrid-page-link",
                "\u00bb"
              )),
              e.setAttribute("aria-label", g.gotoLast),
              (e.tabIndex = 0));
            this._listeners.push(
              q(d, ".dgrid-page-link:click,.dgrid-page-link:keydown", function(
                d
              ) {
                if ("keydown" !== d.type || 13 === d.keyCode) {
                  d = this.className;
                  var e, g;
                  b._isLoading ||
                    -1 < d.indexOf("dgrid-page-disabled") ||
                    ((e = b._currentPage),
                    (g = Math.ceil(b._total / b.rowsPerPage)),
                    this === b.paginationPreviousNode
                      ? b.gotoPage(e - 1)
                      : this === b.paginationNextNode
                      ? b.gotoPage(e + 1)
                      : this === b.paginationFirstNode
                      ? b.gotoPage(1)
                      : this === b.paginationLastNode
                      ? b.gotoPage(g)
                      : "dgrid-page-link" === d && b.gotoPage(+this.innerHTML));
                }
              })
            );
          },
          destroy: function() {
            this.inherited(arguments);
            this._pagingTextBoxHandle && this._pagingTextBoxHandle.remove();
          },
          _updatePaginationSizeSelect: function() {
            var b = this.pageSizeOptions,
              d = this.paginationSizeSelect,
              g;
            if (b && b.length) {
              d ||
                ((d = this.paginationSizeSelect = v(
                  this.paginationNode,
                  "select.dgrid-page-size[aria-label\x3d" +
                    this.i18nPagination.rowsPerPage +
                    "]"
                )),
                (g = this._paginationSizeChangeHandle = q(
                  d,
                  "change",
                  e.hitch(this, function() {
                    this.set("rowsPerPage", +this.paginationSizeSelect.value);
                  })
                )),
                this._listeners.push(g));
              for (g = d.options.length = 0; g < b.length; g++)
                v(d, "option", b[g], {
                  value: b[g],
                  selected: this.rowsPerPage === b[g]
                });
              this._updateRowsPerPageOption();
            } else
              (b && b.length) ||
                !d ||
                (v(d, "!"),
                (this.paginationSizeSelect = null),
                this._paginationSizeChangeHandle.remove());
          },
          _setPageSizeOptions: function(b) {
            this.pageSizeOptions =
              b &&
              b.sort(function(b, d) {
                return b - d;
              });
            this._updatePaginationSizeSelect();
          },
          _updateRowsPerPageOption: function() {
            var d = this.rowsPerPage,
              e = this.pageSizeOptions,
              g = this.paginationSizeSelect;
            g &&
              (0 > b.indexOf(e, d)
                ? this._setPageSizeOptions(e.concat([d]))
                : (g.value = "" + d));
          },
          _setRowsPerPage: function(b) {
            this.rowsPerPage = b;
            this._updateRowsPerPageOption();
            this.gotoPage(1);
          },
          _updateNavigation: function() {
            function b(b, h) {
              var l;
              e.pagingTextBox && b == x && 1 < y
                ? ((h = v(
                    k,
                    "input.dgrid-page-input[type\x3dtext][value\x3d$]",
                    x
                  )),
                  h.setAttribute("aria-label", g.jumpPage),
                  (e._pagingTextBoxHandle = q(h, "change", function() {
                    var a = +this.value;
                    !isNaN(a) && 0 < a && a <= y && e.gotoPage(+this.value);
                  })),
                  r && "INPUT" === r.tagName && h.focus())
                : ((l = b === x),
                  (h = v(
                    k,
                    "span" +
                      (l ? ".dgrid-page-disabled" : "") +
                      ".dgrid-page-link",
                    b + (h ? " " : "")
                  )),
                  h.setAttribute("aria-label", g.gotoPage),
                  (h.tabIndex = l ? -1 : 0),
                  a === b && (l ? (b < y ? a++ : c.focus()) : h.focus()),
                  l || (c = h));
            }
            function d(a, c) {
              v(a, (c ? "." : "!") + "dgrid-page-disabled");
              a.tabIndex = c ? -1 : 0;
            }
            var e = this,
              g = this.i18nPagination,
              k = this.paginationLinksNode,
              x = this._currentPage,
              A = this.pagingLinks,
              w = this.paginationNavigationNode,
              y = Math.ceil(this._total / this.rowsPerPage),
              K = this._pagingTextBoxHandle,
              r = document.activeElement,
              a,
              c;
            r && z.contains(this.paginationNavigationNode, r)
              ? "dgrid-page-link" === r.className && (a = +r.innerHTML)
              : (r = null);
            K && K.remove();
            k.innerHTML = "";
            u(".dgrid-first, .dgrid-previous", w).forEach(function(a) {
              d(a, 1 === x);
            });
            u(".dgrid-last, .dgrid-next", w).forEach(function(a) {
              d(a, x >= y);
            });
            if (A && 0 < y) {
              b(1, !0);
              w = x - A;
              for (
                2 < w ? v(k, "span.dgrid-page-skip", "...") : (w = 2);
                w < Math.min(x + A + 1, y);
                w++
              )
                b(w, !0);
              x + A + 1 < y && v(k, "span.dgrid-page-skip", "...");
              1 < y && b(y);
            } else e.pagingTextBox && b(x);
            r &&
              -1 === r.tabIndex &&
              ((A = u("[tabindex\x3d'0']", this.paginationNavigationNode)),
              r === this.paginationPreviousNode ||
              r === this.paginationFirstNode
                ? (r = A[0])
                : A.length && (r = A[A.length - 1]),
              r && r.focus());
          },
          refresh: function() {
            var b = this;
            this.inherited(arguments);
            if (this.store)
              return this.gotoPage(1).then(function(d) {
                setTimeout(function() {
                  q.emit(b.domNode, "dgrid-refresh-complete", {
                    bubbles: !0,
                    cancelable: !1,
                    grid: b,
                    results: d
                  });
                }, 0);
                return d;
              });
            console.warn("Pagination requires a store to operate.");
          },
          _onNotification: function(b) {
            b.length !== this._rowsOnPage && this.gotoPage(this._currentPage);
          },
          renderArray: function(b, d) {
            var e = this,
              t = this.inherited(arguments);
            this._lastCollection = null;
            d ||
              (this._topLevelRequest &&
                this._topLevelRequest !== b &&
                (this._topLevelRequest.cancel(), delete this._topLevelRequest),
              "function" === typeof b.cancel && (this._topLevelRequest = b),
              g.when(b, function() {
                e._topLevelRequest && delete e._topLevelRequest;
              }));
            return t;
          },
          insertRow: function() {
            var b = this._oldPageNodes,
              d = this.inherited(arguments);
            b && d === b[d.id] && delete b[d.id];
            return d;
          },
          gotoPage: function(b) {
            var d = this,
              k = new g();
            this._trackError(function() {
              var p = d.rowsPerPage,
                q = (b - 1) * p,
                t = e.mixin(d.get("queryOptions"), { start: q, count: p }),
                u,
                C = d.contentNode,
                z,
                K,
                r;
              if (d.showLoadingMessage)
                y(d),
                  (z = d.loadingNode = v(C, "div.dgrid-loading")),
                  (z.innerHTML = d.loadingMessage);
              else {
                d._oldPageNodes = z = {};
                C = C.children;
                K = 0;
                for (r = C.length; K < r; K++) z[C[K].id] = C[K];
                d._oldPageObserver = d.observers.pop();
              }
              d._isLoading = !0;
              u = d.store.query(d.query, t);
              g.when(
                d.renderArray(u, null, t),
                function(a) {
                  w(d);
                  d.scrollTo({ y: 0 });
                  g.when(u.total, function(c) {
                    c ||
                      (d.noDataNode &&
                        (v(d.noDataNode, "!"), delete d.noDataNode),
                      (d.noDataNode = v(d.contentNode, "div.dgrid-no-data")),
                      (d.noDataNode.innerHTML = d.noDataMessage));
                    d.paginationStatusNode.innerHTML = x.substitute(
                      d.i18nPagination.status,
                      {
                        start: Math.min(q + 1, c),
                        end: Math.min(c, q + p),
                        total: c
                      }
                    );
                    d._total = c;
                    d._currentPage = b;
                    d._rowsOnPage = a.length;
                    d._updateNavigation();
                  });
                  (7 > A("ie") || (A("ie") && A("quirks"))) && d.resize();
                  k.resolve(u);
                },
                function(a) {
                  w(d);
                  k.reject(a);
                }
              );
              return k.promise;
            }) || k.reject();
            return k.promise;
          }
        });
      });
    },
    "dgrid/extensions/DijitRegistry": function() {
      define([
        "dojo/_base/declare",
        "dojo/dom-geometry",
        "dijit/registry"
      ], function(k, d, b) {
        return k("dgrid.extensions.DijitRegistry", null, {
          minSize: 0,
          maxSize: Infinity,
          layoutPriority: 0,
          showTitle: !0,
          buildRendering: function() {
            b.add(this);
            this.inherited(arguments);
            this.domNode.setAttribute("widgetId", this.id);
          },
          startup: function() {
            if (!this._started) {
              this.inherited(arguments);
              var d = b.getEnclosingWidget(this.domNode.parentNode);
              d && d.isLayoutContainer && this._resizeHandle.remove();
            }
          },
          destroyRecursive: function() {
            this.destroy();
          },
          destroy: function() {
            this.inherited(arguments);
            b.remove(this.id);
          },
          getChildren: function() {
            return [];
          },
          isLeftToRight: function() {
            return !this.isRTL;
          },
          resize: function(b) {
            b && d.setMarginBox(this.domNode, b);
            this.inherited(arguments);
          },
          _set: function(b, d) {
            this[b] = d;
          },
          watch: function() {},
          getParent: function() {
            return b.getEnclosingWidget(this.domNode.parentNode);
          }
        });
      });
    },
    "dgrid/selector": function() {
      define("dojo/_base/kernel dojo/_base/array dojo/_base/lang dojo/on dojo/aspect dojo/_base/sniff put-selector/put".split(
        " "
      ), function(k, d, b, e, g, q, u) {
        b.getObject("dgrid.selector", !0);
        return (dgrid.selector = function(b, e) {
          function v(b) {
            return !p.allowSelect(p.row(b));
          }
          function x(d) {
            return function(e) {
              var g = e.rows,
                k = g.length;
              e = "false";
              var q;
              for (q = 0; q < k; q++) {
                var v = p.cell(g[q], b.id).element;
                v &&
                  (v = (v.contents || v).input) &&
                  !v.disabled &&
                  ((v.checked = d), v.setAttribute("aria-checked", d));
              }
              if ("checkbox" == t.type) {
                g = p.selection;
                k = !1;
                for (q in g)
                  if (g[q] != p.allSelected) {
                    k = !0;
                    break;
                  }
                t.indeterminate = k;
                t.checked = p.allSelected;
                k ? (e = "mixed") : p.allSelected && (e = "true");
                t.setAttribute("aria-checked", e);
              }
            };
          }
          function A(b) {
            if (
              "click" == b.type ||
              32 == b.keyCode ||
              (!q("opera") && 13 == b.keyCode) ||
              0 === b.keyCode
            ) {
              var d = p.row(b);
              p._selectionTriggerEvent = b;
              if (d) {
                if (p.allowSelect(d)) {
                  var g = p._lastSelected && p.row(p._lastSelected);
                  "radio" == e
                    ? (g && g.id == d.id) ||
                      (p.clearSelection(),
                      p.select(d, null, !0),
                      (p._lastSelected = d.element))
                    : d &&
                      (b.shiftKey ? x(!0)({ rows: [d] }) : (g = null),
                      (g = b.shiftKey ? g : null),
                      p.select(g || d, d, g ? void 0 : null),
                      (p._lastSelected = d.element));
                }
              } else
                u(this, (p.allSelected ? "!" : ".") + "dgrid-select-all"),
                  p[p.allSelected ? "clearSelection" : "selectAll"]();
              p._selectionTriggerEvent = null;
            }
          }
          function y() {
            p._hasSelectorInputListener = !0;
            w.push(p.on(".dgrid-selector:click,.dgrid-selector:keydown", A));
            var d = p._handleSelect;
            p._handleSelect = function(e) {
              this.cell(e).column != b && d.apply(this, arguments);
            };
            if ("function" == typeof b.disabled) {
              var e = p.allowSelect,
                g = b.disabled;
              p.allowSelect = function(d) {
                var k = e.call(this, d);
                return g === v ? k : k && !g.call(b, d.data);
              };
            }
            b.disabled = v;
            w.push(p.on("dgrid-select", x(!0)));
            w.push(p.on("dgrid-deselect", x(!1)));
          }
          var w = [],
            p,
            t;
          b || (b = {});
          b.type &&
            ((b.selectorType = b.type),
            k.deprecated(
              "columndef.type",
              "use columndef.selectorType instead",
              "dgrid 0.4"
            ));
          b.selectorType = e = e || b.selectorType || "checkbox";
          b.sortable = !1;
          var C =
            "function" == typeof e
              ? e
              : function(d, g, k) {
                  var q = g.parentNode,
                    t;
                  p._hasSelectorInputListener || y();
                  t = b.disabled;
                  u(q && q.contents ? q : g, ".dgrid-selector");
                  g =
                    g.input ||
                    (g.input = u(g, "input[type\x3d" + e + "]", {
                      tabIndex: isNaN(b.tabIndex) ? -1 : b.tabIndex,
                      disabled:
                        t && ("function" == typeof t ? t.call(b, k) : t),
                      checked: d
                    }));
                  g.setAttribute("aria-checked", !!d);
                  return g;
                };
          g.after(b, "init", function() {
            p = b.grid;
          });
          g.after(b, "destroy", function() {
            d.forEach(w, function(b) {
              b.remove();
            });
            p._hasSelectorInputListener = !1;
          });
          b.renderCell = function(b, d, e, g, k) {
            d = (d = b && p.row(b)) && p.selection[d.id];
            C(d, e, b);
          };
          b.renderHeaderCell = function(d) {
            var g = "label" in b ? b.label : b.field || "";
            "radio" != e && p.allowSelectAll
              ? C(!1, d, {})
              : (d.appendChild(document.createTextNode(g)),
                p._hasSelectorInputListener || y());
            t = d.lastChild;
          };
          return b;
        });
      });
    },
    "dgrid/Keyboard": function() {
      define("dojo/_base/declare dojo/aspect dojo/on dojo/_base/lang dojo/has put-selector/put ./util/misc dojo/_base/Deferred dojo/_base/sniff".split(
        " "
      ), function(k, d, b, e, g, q, u, x) {
        function A(b) {
          b.preventDefault();
        }
        var v = { checkbox: 1, radio: 1, button: 1 },
          z = /\bdgrid-cell\b/,
          E = /\bdgrid-row\b/,
          y = k("dgrid.Keyboard", null, {
            pageSkip: 10,
            tabIndex: 0,
            keyMap: null,
            headerKeyMap: null,
            postMixInProperties: function() {
              this.inherited(arguments);
              this.keyMap || (this.keyMap = e.mixin({}, y.defaultKeyMap));
              this.headerKeyMap ||
                (this.headerKeyMap = e.mixin({}, y.defaultHeaderKeyMap));
            },
            postCreate: function() {
              function e(a) {
                var c = a.target;
                return c.type && (!v[c.type] || 32 == a.keyCode);
              }
              function a(a) {
                function h() {
                  c._focusedHeaderNode && (c._focusedHeaderNode.tabIndex = -1);
                  if (c.showHeader) {
                    if (l)
                      for (
                        var a = 0,
                          h,
                          b = c.headerNode.getElementsByTagName("th");
                        (h = b[a]);
                        ++a
                      ) {
                        if (n.test(h.className)) {
                          c._focusedHeaderNode = g = h;
                          break;
                        }
                      }
                    else c._focusedHeaderNode = g = c.headerNode;
                    g && (g.tabIndex = c.tabIndex);
                  }
                }
                var l = c.cellNavigation,
                  n = l ? z : E,
                  r = a === c.headerNode,
                  g = a;
                r
                  ? (h(), d.after(c, "renderHeader", h, !0))
                  : d.after(c, "renderArray", function(h) {
                      return x.when(h, function(h) {
                        var b = c._focusedNode || g;
                        if (n.test(b.className) && u.contains(a, b)) return h;
                        for (
                          var l = 0, d = a.getElementsByTagName("*"), e;
                          (e = d[l]);
                          ++l
                        )
                          if (n.test(e.className)) {
                            b = c._focusedNode = e;
                            break;
                          }
                        b.tabIndex = c.tabIndex;
                        return h;
                      });
                    });
                c._listeners.push(
                  b(a, "mousedown", function(a) {
                    e(a) || c._focusOnNode(a.target, r, a);
                  })
                );
                c._listeners.push(
                  b(a, "keydown", function(a) {
                    if (!a.metaKey && !a.altKey) {
                      var h = c[r ? "headerKeyMap" : "keyMap"][a.keyCode];
                      h && !e(a) && h.call(c, a);
                    }
                  })
                );
              }
              this.inherited(arguments);
              var c = this;
              this.tabableHeader &&
                (a(this.headerNode),
                b(this.headerNode, "dgrid-cellfocusin", function() {
                  c.scrollTo({ x: this.scrollLeft });
                }));
              a(this.contentNode);
              this._debouncedEnsureRowScroll = u.debounce(
                this._ensureRowScroll,
                this
              );
            },
            removeRow: function(b) {
              if (!this._focusedNode) return this.inherited(arguments);
              var a = this,
                c = document.activeElement === this._focusedNode,
                d = this[this.cellNavigation ? "cell" : "row"](
                  this._focusedNode
                ),
                h = d.row || d,
                l;
              b = b.element || b;
              b === h.element &&
                (((l = this.down(h, !0)) && l.element !== b) ||
                  (l = this.up(h, !0)),
                (this._removedFocus = {
                  active: c,
                  rowId: h.id,
                  columnId: d.column && d.column.id,
                  siblingId: l && l.element !== b ? l.id : void 0
                }),
                setTimeout(function() {
                  a._removedFocus && a._restoreFocus(h.id);
                }, 0),
                (this._focusedNode = null));
              this.inherited(arguments);
            },
            insertRow: function(b) {
              var a = this.inherited(arguments);
              this._removedFocus &&
                !this._removedFocus.wait &&
                this._restoreFocus(a);
              return a;
            },
            _restoreFocus: function(b) {
              var a = this._removedFocus,
                c;
              if (
                (b =
                  (b = b && this.row(b)) && b.element && b.id === a.rowId
                    ? b
                    : "undefined" !== typeof a.siblingId &&
                      this.row(a.siblingId)) &&
                b.element
              ) {
                if (!b.element.parentNode.parentNode) {
                  a.wait = !0;
                  return;
                }
                "undefined" !== typeof a.columnId &&
                  (c = this.cell(b, a.columnId)) &&
                  c.element &&
                  (b = c);
                a.active && 0 !== b.element.offsetHeight
                  ? this._focusOnNode(b, !1, null)
                  : (q(b.element, ".dgrid-focus"),
                    (b.element.tabIndex = this.tabIndex),
                    (this._focusedNode = b.element));
              }
              delete this._removedFocus;
            },
            addKeyHandler: function(b, a, c) {
              return d.after(this[c ? "headerKeyMap" : "keyMap"], b, a, !0);
            },
            _ensureRowScroll: function(b) {
              var a = this.getScrollPosition().y;
              a > b.offsetTop
                ? this.scrollTo({ y: b.offsetTop })
                : a + this.contentNode.offsetHeight <
                    b.offsetTop + b.offsetHeight &&
                  this.scrollTo({
                    y:
                      b.offsetTop -
                      this.contentNode.offsetHeight +
                      b.offsetHeight
                  });
            },
            _focusOnNode: function(d, a, c) {
              var n = "_focused" + (a ? "Header" : "") + "Node",
                h = this[n],
                l = this.cellNavigation ? "cell" : "row",
                r = this[l](d),
                k,
                p,
                t,
                v,
                u;
              if ((d = r && r.element)) {
                if (this.cellNavigation)
                  for (
                    k = d.getElementsByTagName("input"), u = 0, t = k.length;
                    u < t;
                    u++
                  )
                    if (
                      ((p = k[u]),
                      (-1 != p.tabIndex || "_dgridLastValue" in p) &&
                        !p.disabled)
                    ) {
                      8 > g("ie") && (p.style.position = "relative");
                      p.focus();
                      8 > g("ie") && (p.style.position = "");
                      v = !0;
                      break;
                    }
                null !== c &&
                  ((c = e.mixin({ grid: this }, c)),
                  c.type && (c.parentType = c.type),
                  c.bubbles || (c.bubbles = !0));
                h &&
                  (q(h, "!dgrid-focus[!tabIndex]"),
                  8 > g("ie") && (h.style.position = ""),
                  c &&
                    ((c[l] = this[l](h)), b.emit(h, "dgrid-cellfocusout", c)));
                h = this[n] = d;
                c && (c[l] = r);
                n = this.cellNavigation ? z : E;
                !v &&
                  n.test(d.className) &&
                  (8 > g("ie") && (d.style.position = "relative"),
                  (d.tabIndex = this.tabIndex),
                  d.focus());
                q(d, ".dgrid-focus");
                c && b.emit(h, "dgrid-cellfocusin", c);
                this.cellNavigation &&
                  (this.columnSets || 1 < this.subRows.length) &&
                  !a &&
                  this._debouncedEnsureRowScroll(r.row.element);
              }
            },
            focusHeader: function(b) {
              this._focusOnNode(b || this._focusedHeaderNode, !0);
            },
            focus: function(b) {
              (b = b || this._focusedNode)
                ? this._focusOnNode(b, !1)
                : this.contentNode.focus();
            }
          }),
          w = (y.moveFocusVertical = function(b, a) {
            var c = this.cellNavigation,
              d = this[c ? "cell" : "row"](b),
              d = c && d.column.id;
            a = this.down(this._focusedNode, a, !0);
            c && (a = this.cell(a, d));
            this._focusOnNode(a, !1, b);
            b.preventDefault();
          });
        k = y.moveFocusUp = function(b) {
          w.call(this, b, -1);
        };
        var p = (y.moveFocusDown = function(b) {
            w.call(this, b, 1);
          }),
          t = (y.moveFocusPageUp = function(b) {
            w.call(this, b, -this.pageSkip);
          }),
          C = (y.moveFocusPageDown = function(b) {
            w.call(this, b, this.pageSkip);
          }),
          N = (y.moveFocusHorizontal = function(b, a) {
            if (this.cellNavigation) {
              var c = !this.row(b);
              this._focusOnNode(
                this.right(this["_focused" + (c ? "Header" : "") + "Node"], a),
                c,
                b
              );
              b.preventDefault();
            }
          }),
          I = (y.moveFocusLeft = function(b) {
            N.call(this, b, -1);
          }),
          H = (y.moveFocusRight = function(b) {
            N.call(this, b, 1);
          }),
          J = (y.moveHeaderFocusEnd = function(b, a) {
            var c;
            this.cellNavigation &&
              ((c = this.headerNode.getElementsByTagName("th")),
              this._focusOnNode(c[a ? 0 : c.length - 1], !0, b));
            b.preventDefault();
          }),
          M = (y.moveHeaderFocusHome = function(b) {
            J.call(this, b, !0);
          }),
          Q = (y.moveFocusEnd = function(b, a) {
            var c = this,
              n = this.cellNavigation,
              h = this.contentNode,
              l = h.scrollTop + (a ? 0 : h.scrollHeight),
              h = h[a ? "firstChild" : "lastChild"],
              r = -1 < h.className.indexOf("dgrid-preload"),
              k = r ? h[(a ? "next" : "previous") + "Sibling"] : h,
              p = k.offsetTop + (a ? 0 : k.offsetHeight),
              q;
            if (r) {
              for (; k && 0 > k.className.indexOf("dgrid-row"); )
                k = k[(a ? "next" : "previous") + "Sibling"];
              if (!k) return;
            }
            !r || 1 > h.offsetHeight
              ? (n && (k = this.cell(k, this.cell(b).column.id)),
                this._focusOnNode(k, !1, b))
              : (g("dom-addeventlistener") || (b = e.mixin({}, b)),
                (q = d.after(this, "renderArray", function(h) {
                  q.remove();
                  return x.when(h, function(h) {
                    h = h[a ? 0 : h.length - 1];
                    n && (h = c.cell(h, c.cell(b).column.id));
                    c._focusOnNode(h, !1, b);
                  });
                })));
            l === p && b.preventDefault();
          }),
          K = (y.moveFocusHome = function(b) {
            Q.call(this, b, !0);
          });
        y.defaultKeyMap = {
          32: A,
          33: t,
          34: C,
          35: Q,
          36: K,
          37: I,
          38: k,
          39: H,
          40: p
        };
        y.defaultHeaderKeyMap = { 32: A, 35: J, 36: M, 37: I, 39: H };
        return y;
      });
    },
    "dgrid/util/mouse": function() {
      define(["dojo/_base/lang", "dojo/on", "dojo/dom", "dojo/query"], function(
        k,
        d,
        b
      ) {
        function e(e, g) {
          return function(k, q) {
            return d(k, e + ":" + g, function(d) {
              if (!b.isDescendant(d.relatedTarget, this))
                return q.call(this, d);
            });
          };
        }
        var g = {
          enterRow: e(".dgrid-content .dgrid-row", "mouseover"),
          enterCell: e(".dgrid-content .dgrid-cell", "mouseover"),
          enterHeaderCell: e(".dgrid-header .dgrid-cell", "mouseover"),
          leaveRow: e(".dgrid-content .dgrid-row", "mouseout"),
          leaveCell: e(".dgrid-content .dgrid-cell", "mouseout"),
          leaveHeaderCell: e(".dgrid-header .dgrid-cell", "mouseout"),
          createDelegatingHandler: e
        };
        k.getObject("dgrid.util.mouse", !0);
        k.mixin(dgrid.util.mouse, g);
        return g;
      });
    },
    "dgrid/util/touch": function() {
      define(["dojo/on", "dojo/query"], function(k, d) {
        function b(b, d, u, x) {
          if (!(1 < u.targetTouches.length)) {
            var g = u.changedTouches[0],
              q = g.screenX,
              z = g.screenY;
            x && u.preventDefault();
            var E = k(b, "touchend", function(b) {
              var g = b.changedTouches[0];
              b.targetTouches.length ||
                (Math.abs(g.screenX - q) < e.tapRadius &&
                  Math.abs(g.screenY - z) < e.tapRadius &&
                  (x && b.preventDefault(), d.call(this, b)),
                E.remove());
            });
          }
        }
        var e = {
          tapRadius: 10,
          dbltapTime: 250,
          selector: function(b, e, u) {
            return function(g, q) {
              var v = e.bubble;
              v ? (e = v) : !1 !== u && (u = !0);
              return k(g, e, function(e) {
                var k = e.target;
                3 == k.nodeType && (k = k.parentNode);
                for (; !d.matches(k, b, g); )
                  if (k == g || !u || !(k = k.parentNode)) return;
                return q.call(k, e);
              });
            };
          },
          countCurrentTouches: function(b, d) {
            if (!("touches" in b)) return -1;
            var e, g, k;
            for (g = e = 0; (k = b.touches[e]); ++e)
              d.contains(k.target) && ++g;
            return g;
          },
          tap: function(d, e) {
            return k(d, "touchstart", function(g) {
              b(d, e, g);
            });
          },
          dbltap: function(d, q) {
            var g, x;
            return k(d, "touchstart", function(k) {
              g
                ? b(
                    d,
                    function(b) {
                      if (g) {
                        var d = b.changedTouches[0];
                        Math.abs(d.screenX - g.screenX) < e.tapRadius &&
                          Math.abs(d.screenY - g.screenY) < e.tapRadius &&
                          (x && clearTimeout(x),
                          (g = x = null),
                          q.call(this, b));
                      }
                    },
                    k,
                    !0
                  )
                : b(
                    d,
                    function(b) {
                      g = b.changedTouches[0];
                      x = setTimeout(function() {
                        g = x = null;
                      }, e.dbltapTime);
                    },
                    k
                  );
            });
          }
        };
        return e;
      });
    },
    "esri/dijit/_AppTemplateFiltersMixin": function() {
      define(["dojo/_base/declare"], function() {
        return {
          rootNodes: {
            app: {
              all: {},
              narrate: { typekeywords: ["story"] },
              collect: { typekeywords: ["collect"] },
              compare: { typekeywords: ["compare"] },
              "3dscene": { typekeywords: ["3Dscene"] },
              analyze: { typekeywords: ["summarize"] },
              present: { typekeywords: ["gallery"] },
              social: { typekeywords: ["social"] },
              local: { typekeywords: ["local"] },
              route: { typekeywords: ["route"] },
              showcase: { typekeywords: ["showcase"] }
            }
          }
        };
      });
    },
    "esri/dijit/_RefreshMixin": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/Deferred dojo/on dojo/has ../kernel".split(
        " "
      ), function(k, d, b, e, g, q) {
        function u(b) {
          "object" !== typeof b && (b = Error(b));
          b.grid = this;
          e.emit(this.domNode, "dgrid-error", {
            grid: this,
            error: b,
            cancelable: !0,
            bubbles: !0
          }) && console.error(b);
        }
        k = k(null, {
          _trackError: function(g) {
            var k;
            "string" === typeof g && (g = d.hitch(this, g));
            try {
              k = g();
            } catch (v) {
              u.call(this, v);
            }
            return b.when(
              k,
              d.hitch(this, function() {
                e.emit(this.domNode, "refresh", {
                  cancelable: !0,
                  bubbles: !0
                });
              }),
              d.hitch(this, u)
            );
          }
        });
        g("extend-esri") && d.setObject("dijit._RefreshMixin", k, q);
        return k;
      });
    },
    "esri/dijit/analysis/PluginAnalysisLayers": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/promise/all dojo/has ../../kernel dojo/i18n!../../nls/jsapi".split(
        " "
      ), function(k, d, b, e, g, q, u) {
        var x = k(null, {
          filters: {
            all: {},
            categoryBoundaries: { tags: ["boundaries", "places"] },
            subCategoryBoundaries: { tags: ["boundaries"] },
            subCategoryPlaces: { tags: ["places"] },
            categoryHexBins: { tags: ["hex"] },
            categoryTransportation: { tags: ["transportation"] }
          },
          constructor: function(b) {
            d.mixin(this, b);
            this.i18n = d.mixin({}, u.browseLayersDlg);
            this.filterStrings = {
              all: { title: this.i18n.categoryAll },
              categoryBoundaries: { title: this.i18n.categoryBoundaries },
              subCategoryBoundaries: {
                title:
                  "\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;" +
                  this.i18n.subCategoryBoundaries
              },
              subCategoryPlaces: {
                title:
                  "\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;" +
                  this.i18n.subCategoryPlaces
              },
              categoryHexBins: { title: this.i18n.categoryHexBins },
              categoryTransportation: {
                title: this.i18n.categoryTransportation
              }
            };
          },
          fetchData: function() {
            this._portal = this.parent._portal;
            var e;
            return this._fetchGroups().then(
              d.hitch(this, function(d) {
                e = b.map(d || [], function(b) {
                  if (b) return 'group:"' + b.id + '"';
                });
                return this._fetchGroupItems(e);
              })
            );
          },
          _fetchGroup: function(b, e) {
            this._groups = this._groups || [];
            return (
              this._groups[b] ||
              this._portal.queryGroups(e, !0).then(
                d.hitch(this, function(d) {
                  0 < d.total && d.results && (this._groups[b] = d.results);
                  return this._groups[b] || [];
                })
              )
            );
          },
          _fetchGroupItems: function(b, d) {
            var e = this._isCustom
              ? ['-typekeywords:"Multilayer"']
              : ['typekeywords:"Analysis Ready"'];
            this._portal.user.demographics ||
              e.push('-typekeywords:"Requires Credits"');
            return this.parent._fetchItems({
              groups: b,
              query: d,
              types: ['type:"Map Service"', 'type:"Feature Service"'],
              typekeywords: e
            });
          },
          _fetchGroups: function() {
            return this._fetchEsriAnalysisLayers();
          },
          _fetchEsriAnalysisLayers: function() {
            var b;
            this._portal &&
              this._portal.analysisLayersGroupQuery &&
              ((b = this._portal.analysisLayersGroupQuery),
              this._isCustomAnalysisQuery() &&
                (this.filterStrings = this.filters = null));
            return this._fetchGroup("esriAnalysisLayers", {
              q: b,
              num: 100,
              start: 0
            }).then(
              d.hitch(this, function(b) {
                b &&
                  0 < b.length &&
                  ((this.parent.sortAttribute = b[0].sortField),
                  (this.parent.sortDescending = "asc" !== b[0].sortOrder));
                return b;
              })
            );
          },
          _isCustomAnalysisQuery: function() {
            var b = 'title:"Living Atlas Analysis Layers" AND owner:esri',
              d = !1;
            this._portal &&
              this._portal.isPortal &&
              (b =
                'title:"Living Atlas Analysis Layers" AND owner:esri_livingatlas');
            this._portal &&
              this._portal.analysisLayersGroupQuery &&
              this._portal.analysisLayersGroupQuery !== b &&
              (d = !0);
            return (this._isCustom = d);
          }
        });
        d.mixin(x, {
          add: function(b, d) {
            b.plugIn || ((d = d || {}), (d.parent = b), (b.plugIn = new x(d)));
          },
          remove: function(b) {
            b.plugIn && (b.plugIn.destroy(), delete b.plugIn);
          }
        });
        g("extend-esri") &&
          d.setObject("dijit.analysis.PluginAnalysisLayers", x, q);
        return x;
      });
    },
    "esri/tasks/Geoprocessor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has dojo/io-query ../kernel ../request ../deferredUtils ../geometry/normalizeUtils ./Task ./FeatureSet ./JobInfo ./GPMessage ./LinearUnit ./DataFile ./RasterData ./Date ./ParameterValue ./GPResultImageLayer ../layers/ArcGISDynamicMapServiceLayer ../layers/MapImage".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q
      ) {
        k = k(E, {
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
          constructor: function(b) {
            this._jobUpdateHandler = d.hitch(this, this._jobUpdateHandler);
            this._getJobStatus = d.hitch(this, this._getJobStatus);
            this._getResultDataHandler = d.hitch(
              this,
              this._getResultDataHandler
            );
            this._getResultImageHandler = d.hitch(
              this,
              this._getResultImageHandler
            );
            this._executeHandler = d.hitch(this, this._executeHandler);
            this._updateTimers = [];
            this.registerConnectEvents();
          },
          updateDelay: 1e3,
          processSpatialReference: null,
          outputSpatialReference: null,
          outSpatialReference: null,
          setUpdateDelay: function(b) {
            this.updateDelay = b;
          },
          setProcessSpatialReference: function(b) {
            this.processSpatialReference = b;
          },
          setOutputSpatialReference: function(b) {
            this._setOutSR(b);
          },
          setOutSpatialReference: function(b) {
            this._setOutSR(b);
          },
          __msigns: [
            { n: "execute", c: 3, a: [{ i: 0, p: ["*"] }], e: 2, f: 1 },
            { n: "submitJob", c: 4, a: [{ i: 0, p: ["*"] }], e: 3 }
          ],
          _setOutSR: function(b) {
            this.outSpatialReference = this.outputSpatialReference = b;
          },
          _getOutSR: function() {
            return this.outSpatialReference || this.outputSpatialReference;
          },
          _gpEncode: function(e, r, a) {
            for (var c in e) {
              var n = e[c];
              d.isArray(n)
                ? (e[c] = g.toJson(
                    b.map(
                      n,
                      function(a) {
                        return this._gpEncode({ item: a }, !0).item;
                      },
                      this
                    )
                  ))
                : n instanceof Date && (e[c] = n.getTime());
            }
            return this._encode(e, r, a);
          },
          _decode: function(e) {
            var g = e.dataType,
              a = new H(e);
            if (
              -1 !==
              b.indexOf(["GPBoolean", "GPDouble", "GPLong", "GPString"], g)
            )
              return a;
            if ("GPLinearUnit" === g) a.value = new t(a.value);
            else if ("GPFeatureRecordSetLayer" === g || "GPRecordSet" === g)
              a.value = new y(a.value);
            else if ("GPDataFile" === g) a.value = new C(a.value);
            else if ("GPDate" === g)
              (e = a.value),
                d.isString(e)
                  ? (a.value = new I({ date: e }))
                  : (a.value = new Date(e));
            else if ("GPRasterData" === g || "GPRasterDataLayer" === g)
              (e = e.value.mapImage), (a.value = e ? new Q(e) : new N(a.value));
            else if (-1 !== g.indexOf("GPMultiValue:")) {
              var c = g.split(":")[1];
              e = a.value;
              a.value = b.map(
                e,
                function(a) {
                  return this._decode({
                    paramName: "_name",
                    dataType: c,
                    value: a
                  }).value;
                },
                this
              );
            } else
              console.log(
                this.declaredClass +
                  " : GP Data type not handled. : " +
                  a.dataType
              ),
                (a = null);
            return a;
          },
          submitJob: function(b, e, a, c, n) {
            var h = this._getOutSR(),
              l = n.assembly;
            b = this._gpEncode(
              d.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  "env:outSR": h ? h.wkid || g.toJson(h.toJson()) : null,
                  "env:processSR": this.processSpatialReference
                    ? this.processSpatialReference.wkid ||
                      g.toJson(this.processSpatialReference.toJson())
                    : null
                },
                b
              ),
              null,
              l && l[0]
            );
            var F = this._jobUpdateHandler,
              r = this._errorHandler;
            return A({
              url: this._url.path + "/submitJob",
              content: b,
              callbackParamName: "callback",
              load: function(c, h) {
                F(c, h, !1, e, a, n.dfd);
              },
              error: function(a) {
                r(a, c, n.dfd);
              }
            });
          },
          _jobUpdateHandler: function(b, d, a, c, n, h) {
            var l = b.jobId;
            d = new w(b);
            this._successHandler([d], "onStatusUpdate", n, a && h);
            if (!a)
              switch (
                (clearTimeout(this._updateTimers[l]),
                (this._updateTimers[l] = null),
                h && h.progress(d),
                b.jobStatus)
              ) {
                case w.STATUS_SUBMITTED:
                case w.STATUS_EXECUTING:
                case w.STATUS_WAITING:
                case w.STATUS_NEW:
                  var e = this._getJobStatus;
                  this._updateTimers[l] = setTimeout(function() {
                    e(l, a, c, n, h);
                  }, this.updateDelay);
                  break;
                default:
                  this._successHandler([d], "onJobComplete", c, h);
              }
          },
          _getJobStatus: function(b, e, a, c, n) {
            var h = this._jobUpdateHandler;
            A({
              url: this._url.path + "/jobs/" + b,
              content: d.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: function(b, d) {
                h(b, d, e, a, c, n);
              },
              error: this._errorHandler
            });
          },
          _getResultDataHandler: function(b, d, a, c, n) {
            try {
              var h = this._decode(b);
              this._successHandler([h], "onGetResultDataComplete", a, n);
            } catch (l) {
              this._errorHandler(l, c, n);
            }
          },
          getResultData: function(b, g, a, c) {
            var n = this._getResultDataHandler,
              h = this._errorHandler,
              l = new e(v._dfdCanceller);
            l._pendingDfd = A({
              url: this._url.path + "/jobs/" + b + "/results/" + g,
              content: d.mixin({}, this._url.query, {
                f: "json",
                returnType: "data"
              }),
              callbackParamName: "callback",
              load: function(h, b) {
                n(h, b, a, c, l);
              },
              error: function(a) {
                h(a, c, l);
              }
            });
            return l;
          },
          checkJobStatus: function(b, g, a) {
            var c = this._jobUpdateHandler,
              n = this._errorHandler,
              h = new e(v._dfdCanceller);
            h._pendingDfd = A({
              url: this._url.path + "/jobs/" + b,
              content: d.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: function(a, b) {
                c(a, b, !0, null, g, h);
              },
              error: function(c) {
                n(c, a, h);
              }
            });
            return h;
          },
          cancelJob: function(b, g, a) {
            var c = this._errorHandler,
              n = new e(v._dfdCanceller);
            n._pendingDfd = A({
              url: this._url.path + "/jobs/" + b + "/cancel",
              content: d.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: d.hitch(this, function(a, c) {
                this._successHandler([a], "onJobCancel", g, n);
              }),
              error: function(b) {
                c(b, a, n);
              }
            });
            return n;
          },
          execute: function(b, e, a, c) {
            var n = this._getOutSR(),
              h = c.assembly;
            b = this._gpEncode(
              d.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  "env:outSR": n ? n.wkid || g.toJson(n.toJson()) : null,
                  "env:processSR": this.processSpatialReference
                    ? this.processSpatialReference.wkid ||
                      g.toJson(this.processSpatialReference.toJson())
                    : null
                },
                b
              ),
              null,
              h && h[0]
            );
            var l = this._executeHandler,
              F = this._errorHandler;
            return A({
              url: this._url.path + "/execute",
              content: b,
              callbackParamName: "callback",
              load: function(b, h) {
                l(b, h, e, a, c.dfd);
              },
              error: function(b) {
                F(b, a, c.dfd);
              }
            });
          },
          _executeHandler: function(b, d, a, c, n) {
            try {
              var h = b.results,
                l,
                e,
                g = b.messages;
              l = 0;
              for (e = h.length; l < e; l++) h[l] = this._decode(h[l]);
              l = 0;
              for (e = g.length; l < e; l++) g[l] = new p(g[l]);
              this._successHandler([h, g], "onExecuteComplete", a, n);
            } catch (P) {
              this._errorHandler(P, c, n);
            }
          },
          _getResultImageHandler: function(b, d, a, c, n) {
            try {
              var h = this._decode(b);
              this._successHandler([h], "onGetResultImageComplete", a, n);
            } catch (l) {
              this._errorHandler(l, c, n);
            }
          },
          getResultImage: function(b, g, a, c, n) {
            var h = this._getResultImageHandler,
              l = this._errorHandler;
            a = this._gpEncode(
              d.mixin({}, this._url.query, { f: "json" }, a.toJson())
            );
            var F = new e(v._dfdCanceller);
            F._pendingDfd = A({
              url: this._url.path + "/jobs/" + b + "/results/" + g,
              content: a,
              callbackParamName: "callback",
              load: function(a, b) {
                h(a, b, c, n, F);
              },
              error: function(a) {
                l(a, n, F);
              }
            });
            return F;
          },
          cancelJobStatusUpdates: function(b) {
            clearTimeout(this._updateTimers[b]);
            this._updateTimers[b] = null;
          },
          getResultImageLayer: function(b, d, a, c) {
            if (null == d) {
              var n = this._url.path.indexOf("/GPServer/");
              b = this._url.path.substring(0, n) + "/MapServer/jobs/" + b;
            } else b = this._url.path + "/jobs/" + b + "/results/" + d;
            this._url.query && (b += "?" + u.objectToQuery(this._url.query));
            d =
              null == d
                ? new M(b, { imageParameters: a })
                : new J(b, { imageParameters: a }, !0);
            this.onGetResultImageLayerComplete(d);
            c && c(d);
            return d;
          },
          onStatusUpdate: function() {},
          onJobComplete: function() {},
          onExecuteComplete: function() {},
          onGetResultDataComplete: function() {},
          onGetResultImageComplete: function() {},
          onGetResultImageLayerComplete: function() {},
          onJobCancel: function() {}
        });
        z._createWrappers(k);
        q("extend-esri") && d.setObject("tasks.Geoprocessor", k, x);
        return k;
      });
    },
    "esri/tasks/LinearUnit": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e) {
        k = k(null, {
          declaredClass: "esri.tasks.LinearUnit",
          constructor: function(b) {
            b && d.mixin(this, b);
          },
          distance: 0,
          units: null,
          toJson: function() {
            var b = {};
            this.distance && (b.distance = this.distance);
            this.units && (b.units = this.units);
            return b;
          }
        });
        b("extend-esri") && d.setObject("tasks.LinearUnit", k, e);
        return k;
      });
    },
    "esri/tasks/DataFile": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e) {
        k = k(null, {
          declaredClass: "esri.tasks.DataFile",
          constructor: function(b) {
            b && d.mixin(this, b);
          },
          url: null,
          itemID: null,
          toJson: function() {
            var b = {};
            this.url && (b.url = this.url);
            this.itemID && (b.itemID = this.itemID);
            return b;
          }
        });
        b("extend-esri") && d.setObject("tasks.DataFile", k, e);
        return k;
      });
    },
    "esri/tasks/RasterData": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e) {
        k = k(null, {
          declaredClass: "esri.tasks.RasterData",
          constructor: function(b) {
            b && d.mixin(this, b);
          },
          url: null,
          format: null,
          itemID: null,
          toJson: function() {
            var b = {};
            this.url && (b.url = this.url);
            this.format && (b.format = this.format);
            this.itemID && (b.itemID = this.itemID);
            return b;
          }
        });
        b("extend-esri") && d.setObject("tasks.RasterData", k, e);
        return k;
      });
    },
    "esri/tasks/Date": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/date/locale",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e, g) {
        k = k(null, {
          declaredClass: "esri.tasks.Date",
          constructor: function(d) {
            d &&
              (d.format && (this.format = d.format),
              (this.date = b.parse(d.date, {
                selector: "date",
                datePattern: this.format
              })));
          },
          date: new Date(),
          format: "EEE MMM dd HH:mm:ss zzz yyyy",
          toJson: function() {
            return {
              date: b.format(this.date, {
                selector: "date",
                datePattern: this.format
              }),
              format: this.format
            };
          }
        });
        e("extend-esri") && d.setObject("tasks.Date", k, g);
        return k;
      });
    },
    "esri/tasks/ParameterValue": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e) {
        k = k(null, {
          declaredClass: "esri.tasks.ParameterValue",
          constructor: function(b) {
            d.mixin(this, b);
          }
        });
        b("extend-esri") && d.setObject("tasks.ParameterValue", k, e);
        return k;
      });
    },
    "esri/tasks/GPResultImageLayer": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has dojo/io-query ../kernel ../layers/ArcGISDynamicMapServiceLayer".split(
        " "
      ), function(k, d, b, e, g, q, u) {
        k = k(u, {
          declaredClass: "esri.tasks._GPResultImageLayer",
          constructor: function(b, e) {
            e &&
              e.imageParameters &&
              e.imageParameters.extent &&
              ((this.initialExtent = this.fullExtent =
                e.imageParameters.extent),
              (this.spatialReference = this.initialExtent.spatialReference));
            this.getImageUrl = d.hitch(this, this.getImageUrl);
            this.loaded = !0;
            this.onLoad(this);
          },
          getImageUrl: function(e, k, q, u) {
            var v = e.spatialReference.wkid;
            u(
              this._url.path +
                "?" +
                g.objectToQuery(
                  d.mixin(this._params, {
                    f: "image",
                    bbox: b.toJson(e.toJson()),
                    bboxSR: v,
                    imageSR: v,
                    size: k + "," + q
                  })
                )
            );
          }
        });
        e("extend-esri") && d.setObject("tasks._GPResultImageLayer", k, q);
        return k;
      });
    },
    "esri/dijit/SingleFilter": function() {
      define("require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/json dojo/has dojo/json dojo/string dojo/number dojo/dom dojo/dom-style dojo/dom-attr dojo/dom-construct dojo/query dojo/dom-class dojo/_base/event dojo/Evented dojo/data/ItemFileWriteStore dojo/date/locale dojo/parser dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_OnDijitClickMixin dijit/_FocusMixin dijit/registry dijit/form/TextBox dijit/form/FilteringSelect dijit/form/RadioButton dijit/form/DateTextBox dijit/form/NumberTextBox ../kernel ../lang ../tasks/GenerateRendererTask ../tasks/UniqueValueDefinition ../tasks/GenerateRendererParameters ../layers/FeatureLayer ../layers/GeoRSSLayer ./analysis/ItemTypes dojo/i18n!../nls/jsapi dojo/text!./templates/SingleFilter.html".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q,
        K,
        r,
        a,
        c,
        n,
        h,
        l,
        F,
        V,
        P,
        R,
        U,
        Z,
        B,
        D,
        X,
        aa,
        Y,
        ba
      ) {
        k = d([M, Q, K, r, a, N], {
          declaredClass: "esri.dijit.SingleFilter",
          widgetsInTemplate: !0,
          templateString: ba,
          valueHandlers: [],
          onFieldChangeEnabled: !0,
          onOperatorChangeEnabled: !0,
          onPromptChangeHandler: null,
          onHintChangeHandler: null,
          fieldDomains: {},
          fieldsStore: null,
          fieldsInfo: {
            stringFieldsCount: 0,
            numberFieldsCount: 0,
            dateFieldsCount: 0
          },
          stringOperatorStore: null,
          dateOperatorStore: null,
          numberOperatorStore: null,
          uniqueValuesStore: null,
          isEnableInteractiveFilter: !0,
          uniqueValuesResults: {},
          partsObj: null,
          dayInMS: 86399e3,
          allowAllDateTypes: !1,
          showUnique: !0,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            this.i18n = b.mixin(this.i18n, Y.filterDlg);
          },
          parseExpressionTemplate: function() {
            var a = function(a, f) {
                z.byId(f).className = "attributeValueContainer";
                "field_dropdown" === a
                  ? (z.byId(f).innerHTML = c)
                  : "operator_dropdown" === a
                  ? (z.byId(f).innerHTML = b)
                  : "values_input" === a
                  ? (z.byId(f).innerHTML = h + l)
                  : console.error(
                      "problem with expressionTemplate from localization file"
                    );
              },
              c =
                '\x3cselect id\x3d"' +
                this.id +
                '.fieldsList" class\x3d"attributeField" data-dojo-type\x3d"dijit/form/FilteringSelect" maxHeight\x3d"150" sortByLabel\x3d"true"\x3e\x3c/select\x3e',
              b =
                '\x3cselect id\x3d"' +
                this.id +
                '.operatorList" class\x3d"operator" data-dojo-type\x3d"dijit/form/FilteringSelect" maxHeight\x3d"150" sortByLabel\x3d"false"\x3e\x3c/select\x3e',
              h =
                '\x3cdiv id\x3d"' +
                this.id +
                '.attributeValueContainer"\x3e\x3c/div\x3e',
              l =
                '\x3cdiv class\x3d"attributeValueOptions"\x3e\x3ctable cellpadding\x3d"0" cellspacing\x3d"0"\x3e  \x3ctbody\x3e    \x3ctr\x3e      \x3ctd nowrap\x3d"nowrap"\x3e        \x3cinput id\x3d"' +
                this.id +
                '.radioValue" class\x3d"radioValue attributeValueRadio" checked\x3d"checked" name\x3d"' +
                this.id +
                '.inputOption" data-dojo-type\x3d"dijit/form/RadioButton" title\x3d"' +
                this.i18n.valueTooltip +
                '"/\x3e        \x3clabel class\x3d"labels" title\x3d"' +
                this.i18n.valueTooltip +
                '"\x3e' +
                this.i18n.value +
                '        \x3c/label\x3e      \x3c/td\x3e      \x3ctd nowrap\x3d"nowrap" class\x3d"esriLeadingPadding05"\x3e        \x3cinput id\x3d"' +
                this.id +
                '.radioFields" class\x3d"radioFields attributeValueRadio" name\x3d"' +
                this.id +
                '.inputOption" data-dojo-type\x3d"dijit/form/RadioButton" title\x3d"' +
                this.i18n.fieldTooltip +
                '"/\x3e        \x3clabel class\x3d"labels" title\x3d"' +
                this.i18n.fieldTooltip +
                '"\x3e' +
                this.i18n.field +
                '        \x3c/label\x3e      \x3c/td\x3e      \x3ctd id\x3d"' +
                this.id +
                '.radioUniqueColumn" nowrap\x3d"nowrap" class\x3d"esriLeadingPadding05"\x3e        \x3cinput id\x3d"' +
                this.id +
                '.radioUnique" class\x3d"radioUnique attributeValueRadio" name\x3d"' +
                this.id +
                '.inputOption" data-dojo-type\x3d"dijit/form/RadioButton" title\x3d"' +
                this.i18n.uniqueValueTooltip +
                '"/\x3e        \x3clabel class\x3d"labels" title\x3d"' +
                this.i18n.uniqueValueTooltip +
                '"\x3e' +
                this.i18n.uniqueValues +
                "        \x3c/label\x3e      \x3c/td\x3e    \x3c/tr\x3e  \x3c/tbody\x3e\x3c/table\x3e\x3c/div\x3e",
              d = this.i18n.expressionTemplate,
              n = d.indexOf("${"),
              e = d.substring(0, n).trim();
            z.byId(this.id + ".column1").innerHTML = e.length
              ? "\x3cdiv class\x3d'attributeText'\x3e" + e + "\x3c/div\x3e"
              : "";
            var e = d.indexOf("}", n + 1),
              g = d.substring(n + 2, e);
            a(g, this.id + ".column2");
            n = d.indexOf("${", n + 1);
            e = d.substring(e + 1, n).trim();
            z.byId(this.id + ".column3").innerHTML = e.length
              ? "\x3cdiv class\x3d'attributeText'\x3e" + e + "\x3c/div\x3e"
              : "";
            e = d.indexOf("}", n + 1);
            g = d.substring(n + 2, e);
            a(g, this.id + ".column4");
            n = d.indexOf("${", n + 1);
            e = d.substring(e + 1, n).trim();
            z.byId(this.id + ".column5").innerHTML = e.length
              ? "\x3cdiv class\x3d'attributeText'\x3e" + e + "\x3c/div\x3e"
              : "";
            e = d.indexOf("}", n + 1);
            g = d.substring(n + 2, e);
            a(g, this.id + ".column6");
            e = d.substring(e + 1, d.length).trim();
            z.byId(this.id + ".column7").innerHTML = e.length
              ? "\x3cdiv class\x3d'attributeText'\x3e" + e + "\x3c/div\x3e"
              : "";
          },
          postCreate: function() {
            this.inherited(arguments);
            this.parseExpressionTemplate();
            this.createOperatorStores();
            this.createFieldsStore(this.fields);
            this.readCodedValues();
            J.parse(z.byId(this.id + ".exprTable")).then(
              b.hitch(this, function(a) {
                g.connect(
                  this.getFieldsList(),
                  "onChange",
                  this,
                  "onChangeField"
                );
                g.connect(
                  this.getOperatorList(),
                  "onChange",
                  this,
                  "onChangeOperator"
                );
                g.connect(
                  c.byId(this.id + ".radioValue"),
                  "onClick",
                  this,
                  "showValueInput"
                );
                g.connect(
                  c.byId(this.id + ".radioFields"),
                  "onClick",
                  this,
                  "showFields"
                );
                g.connect(
                  c.byId(this.id + ".radioUnique"),
                  "onClick",
                  this,
                  "showUniqueList"
                );
                this.version &&
                  10.1 > this.version &&
                  this.mapLayer.url &&
                  this.showUnique &&
                  E.set(
                    z.byId(this.id + ".radioUniqueColumn"),
                    "display",
                    "none"
                  );
                g.connect(
                  z.byId(this.id + ".deleteExpression"),
                  "onclick",
                  this,
                  "onClickDeleteExpression"
                );
                g.connect(
                  this.interactiveCheck,
                  "onclick",
                  this,
                  "onInteractiveClick"
                );
                g.connect(
                  this.interactiveArrow,
                  "onclick",
                  this,
                  "onClickShowHideInteractive"
                );
                this.enableInteractiveHandlers();
                this.isEnableInteractiveFilter ||
                  E.set(this._interactiveFilterRow, "display", "none");
                E.set(
                  z.byId(this.id + ".radioUniqueColumn"),
                  "display",
                  this.showUnique ? "block" : "none"
                );
                this.own(
                  this.watch(
                    "showUnique",
                    b.hitch(this, function(a, f, c) {
                      E.set(
                        z.byId(this.id + ".radioUniqueColumn"),
                        "display",
                        c ? "block" : "none"
                      );
                    })
                  )
                );
              })
            );
          },
          constructor: function(a, c) {
            this.id = a.id || "";
            this.owner = a.owner;
            this.version = a.version;
            this.part = a.part;
            this.fields = a.fields;
            this.mapLayer = a.mapLayer;
            !1 === a.enableEvents &&
              (this.onOperatorChangeEnabled = this.onFieldChangeEnabled = !1);
          },
          init: function(a) {
            if (
              !a.part ||
              (this.mapLayer &&
                a.mapLayer &&
                this.mapLayer.id !== a.mapLayer.id)
            )
              this.clearAttributeValueDijits(),
                (this.mapLayer = a.mapLayer),
                (this.version = a.version),
                (this.fields = a.fields),
                this.createOperatorStores(),
                this.createFieldsStore(this.fields),
                this.readCodedValues(),
                this.fillFieldsList(this.fieldsStore),
                this.onChangeField();
            a.part &&
              ((this.part = a.part),
              (this.onOperatorChangeEnabled = this.onFieldChangeEnabled = !1),
              this.buildEditUIField(this.part, this));
          },
          destroy: function() {
            this.onOperatorChangeEnabled = this.onFieldChangeEnabled = !1;
            this.clearAttributeValueDijits();
            e.forEach(c.findWidgets(z.byId(this.id)), function(a) {
              a.destroyRecursive();
            });
            this.inherited(arguments);
          },
          toJson: function() {
            var a = null;
            this.isInteractiveChecked() &&
              (a = {
                prompt: this.promptText.attr("value"),
                hint: this.hintText.attr("value")
              });
            return {
              fieldObj: this.getField(),
              operator: this.getOperator(),
              valueObj: this.getValue(),
              interactiveObj: a
            };
          },
          buildFriendlyTextExpr: function(a) {
            var f = this.i18n.expressionTemplate,
              c = function(a, c, b) {
                return A.substitute(f, {
                  field_dropdown: a,
                  operator_dropdown: c,
                  values_input: b
                });
              };
            if (!1 === a.valueObj.isValid)
              return "\x26lt;expression is missing value\x26gt;";
            var b = "";
            if ("string" === a.fieldObj.shortType)
              a.operator === this.i18n.stringOperatorIsBlank ||
              a.operator === this.i18n.stringOperatorIsNotBlank
                ? (b = c(a.fieldObj.label, a.operator, ""))
                : "field" === a.valueObj.type
                ? (b = c(a.fieldObj.label, a.operator, a.valueObj.label))
                : ((b = this.getDecodedValue(
                    a.interactiveObj
                      ? a.interactiveObj.value
                      : a.valueObj.value,
                    a.fieldObj.name
                  )),
                  (b = c(a.fieldObj.label, a.operator, "'" + b + "'")));
            else if ("number" === a.fieldObj.shortType)
              if (
                a.operator === this.i18n.numberOperatorIsBetween ||
                a.operator === this.i18n.numberOperatorIsNotBetween
              )
                (b = a.interactiveObj
                  ? a.interactiveObj.value2
                  : a.valueObj.value2),
                  (b = c(
                    a.fieldObj.label,
                    a.operator,
                    v.format(
                      a.interactiveObj
                        ? a.interactiveObj.value1
                        : a.valueObj.value1,
                      { pattern: "#####0.##########" }
                    ) +
                      " " +
                      this.i18n.andBetweenValues +
                      " " +
                      v.format(b, { pattern: "#####0.##########" })
                  ));
              else if (
                a.operator === this.i18n.numberOperatorIsBlank ||
                a.operator === this.i18n.numberOperatorIsNotBlank
              )
                b = c(a.fieldObj.label, a.operator, "");
              else if ("field" === a.valueObj.type)
                b = c(a.fieldObj.label, a.operator, a.valueObj.label);
              else
                var b = a.interactiveObj
                    ? a.interactiveObj.value
                    : a.valueObj.value,
                  h = this.getDecodedValue(b, a.fieldObj.name),
                  b = c(
                    a.fieldObj.label,
                    a.operator,
                    b !== h
                      ? "'" + h + "'"
                      : v.format(b, { pattern: "#####0.##########" })
                  );
            else
              R.isDefined(a.valueObj.value) &&
                "field" !== a.valueObj.type &&
                "string" === typeof a.valueObj.value &&
                (a.valueObj.value = new Date(a.valueObj.value)),
                (b =
                  a.operator === this.i18n.dateOperatorIsBetween ||
                  a.operator === this.i18n.dateOperatorIsNotBetween
                    ? c(
                        a.fieldObj.label,
                        a.operator,
                        (a.interactiveObj
                          ? this.formatFriendlyDate(a.interactiveObj.value1)
                          : this.formatFriendlyDate(a.valueObj.value1)) +
                          " " +
                          this.i18n.andBetweenValues +
                          " " +
                          (a.interactiveObj
                            ? this.formatFriendlyDate(a.interactiveObj.value2)
                            : this.formatFriendlyDate(
                                this.addDay(a.valueObj.value2)
                              ))
                      )
                    : a.operator === this.i18n.dateOperatorIsBlank ||
                      a.operator === this.i18n.dateOperatorIsNotBlank
                    ? c(a.fieldObj.label, a.operator, "")
                    : "field" === a.valueObj.type
                    ? c(a.fieldObj.label, a.operator, a.valueObj.label)
                    : c(
                        a.fieldObj.label,
                        a.operator,
                        a.interactiveObj
                          ? this.formatFriendlyDate(a.interactiveObj.value)
                          : this.formatFriendlyDate(a.valueObj.value)
                      ));
            return b;
          },
          builtSingleFilterString: function(a, c) {
            if (R.isDefined(a.valueObj.isValid) && !a.valueObj.isValid)
              return { whereClause: null };
            var f = a.valueObj.value,
              b = a.valueObj.value1,
              h = a.valueObj.value2,
              d = !1;
            if (a.interactiveObj) {
              if (!a.interactiveObj.prompt || !a.interactiveObj.hint)
                return { whereClause: null };
              R.isDefined(c) &&
                ((d = !0),
                R.isDefined(a.valueObj.value) && (f = "{" + c + "}"),
                R.isDefined(a.valueObj.value1) && (b = "{" + c + "}"),
                R.isDefined(a.valueObj.value2) && (h = "{" + (c + 1) + "}"));
            }
            var l = "";
            if ("string" === a.fieldObj.shortType)
              switch (
                ((c = ""),
                f &&
                  "field" !== a.valueObj.type &&
                  this.isHostedService(this.mapLayer.url) &&
                  this.containsNonLatinCharacter(f) &&
                  (c = "N"),
                a.operator)
              ) {
                case this.i18n.stringOperatorIs:
                  l =
                    "field" === a.valueObj.type
                      ? a.fieldObj.name + " \x3d " + f
                      : a.fieldObj.name +
                        " \x3d " +
                        c +
                        "'" +
                        f.replace(/\'/g, "''") +
                        "'";
                  break;
                case this.i18n.stringOperatorIsNot:
                  l =
                    "field" === a.valueObj.type
                      ? a.fieldObj.name + " \x3c\x3e " + f
                      : a.fieldObj.name +
                        " \x3c\x3e " +
                        c +
                        "'" +
                        f.replace(/\'/g, "''") +
                        "'";
                  break;
                case this.i18n.stringOperatorStartsWith:
                  l =
                    a.fieldObj.name +
                    " LIKE " +
                    c +
                    "'" +
                    f.replace(/\'/g, "''") +
                    "%'";
                  break;
                case this.i18n.stringOperatorEndsWith:
                  l =
                    a.fieldObj.name +
                    " LIKE " +
                    c +
                    "'%" +
                    f.replace(/\'/g, "''") +
                    "'";
                  break;
                case this.i18n.stringOperatorContains:
                  l =
                    a.fieldObj.name +
                    " LIKE " +
                    c +
                    "'%" +
                    f.replace(/\'/g, "''") +
                    "%'";
                  break;
                case this.i18n.stringOperatorDoesNotContain:
                  l =
                    a.fieldObj.name +
                    " NOT LIKE " +
                    c +
                    "'%" +
                    f.replace(/\'/g, "''") +
                    "%'";
                  break;
                case this.i18n.stringOperatorIsBlank:
                  l = a.fieldObj.name + " IS NULL";
                  break;
                case this.i18n.stringOperatorIsNotBlank:
                  l = a.fieldObj.name + " IS NOT NULL";
              }
            else if ("number" === a.fieldObj.shortType)
              switch (a.operator) {
                case this.i18n.numberOperatorIs:
                  l = a.fieldObj.name + " \x3d " + f;
                  break;
                case this.i18n.numberOperatorIsNot:
                  l = a.fieldObj.name + " \x3c\x3e " + f;
                  break;
                case this.i18n.numberOperatorIsAtLeast:
                  l = a.fieldObj.name + " \x3e\x3d " + f;
                  break;
                case this.i18n.numberOperatorIsLessThan:
                  l = a.fieldObj.name + " \x3c " + f;
                  break;
                case this.i18n.numberOperatorIsAtMost:
                  l = a.fieldObj.name + " \x3c\x3d " + f;
                  break;
                case this.i18n.numberOperatorIsGreaterThan:
                  l = a.fieldObj.name + " \x3e " + f;
                  break;
                case this.i18n.numberOperatorIsBetween:
                  l = a.fieldObj.name + " BETWEEN " + b + " AND " + h;
                  break;
                case this.i18n.numberOperatorIsNotBetween:
                  l = a.fieldObj.name + " NOT BETWEEN " + b + " AND " + h;
                  break;
                case this.i18n.numberOperatorIsBlank:
                  l = a.fieldObj.name + " IS NULL";
                  break;
                case this.i18n.numberOperatorIsNotBlank:
                  l = a.fieldObj.name + " IS NOT NULL";
              }
            else
              switch (
                (R.isDefined(f) &&
                  "field" !== a.valueObj.type &&
                  "string" === typeof f &&
                  (f = this.parseFriendlyDate(f)),
                a.operator)
              ) {
                case this.i18n.dateOperatorIsOn:
                  l =
                    "field" === a.valueObj.type
                      ? a.fieldObj.name + " \x3d " + f
                      : d
                      ? a.fieldObj.name +
                        " BETWEEN " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'{" +
                        c +
                        "}' AND " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'{" +
                        (c + 1) +
                        "}'"
                      : a.fieldObj.name +
                        " BETWEEN " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'" +
                        this.formatDate(f) +
                        "' AND " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'" +
                        this.formatDate(this.addDay(f)) +
                        "'";
                  break;
                case this.i18n.dateOperatorIsNotOn:
                  l =
                    "field" === a.valueObj.type
                      ? a.fieldObj.name + " \x3c\x3e " + f
                      : d
                      ? a.fieldObj.name +
                        " NOT BETWEEN " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'{" +
                        c +
                        "}' AND " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'{" +
                        (c + 1) +
                        "}'"
                      : a.fieldObj.name +
                        " NOT BETWEEN " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'" +
                        this.formatDate(f) +
                        "' AND " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'" +
                        this.formatDate(this.addDay(f)) +
                        "'";
                  break;
                case this.i18n.dateOperatorIsBefore:
                  l =
                    "field" === a.valueObj.type
                      ? a.fieldObj.name + " \x3c " + f
                      : a.fieldObj.name +
                        " \x3c " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'" +
                        this.formatDate(f) +
                        "'";
                  break;
                case this.i18n.dateOperatorIsAfter:
                  l =
                    "field" === a.valueObj.type
                      ? a.fieldObj.name + " \x3e " + f
                      : a.fieldObj.name +
                        " \x3e " +
                        (this.supportsStandardizedQuery ? "timestamp " : "") +
                        "'" +
                        this.formatDate(this.addDay(f)) +
                        "'";
                  break;
                case this.i18n.dateOperatorIsBetween:
                  l = d
                    ? a.fieldObj.name + " BETWEEN '" + b + "' AND '" + h + "'"
                    : a.fieldObj.name +
                      " BETWEEN " +
                      (this.supportsStandardizedQuery ? "timestamp " : "") +
                      "'" +
                      this.formatDate(b) +
                      "' AND " +
                      (this.supportsStandardizedQuery ? "timestamp " : "") +
                      "'" +
                      this.formatDate(this.addDay(h)) +
                      "'";
                  break;
                case this.i18n.dateOperatorIsNotBetween:
                  l = d
                    ? a.fieldObj.name +
                      " NOT BETWEEN '" +
                      b +
                      "' AND '" +
                      h +
                      "'"
                    : a.fieldObj.name +
                      " NOT BETWEEN " +
                      (this.supportsStandardizedQuery ? "timestamp " : "") +
                      "'" +
                      this.formatDate(b) +
                      "' AND " +
                      (this.supportsStandardizedQuery ? "timestamp " : "") +
                      "'" +
                      this.formatDate(this.addDay(h)) +
                      "'";
                  break;
                case this.i18n.dateOperatorIsBlank:
                  l = a.fieldObj.name + " IS NULL";
                  break;
                case this.i18n.dateOperatorIsNotBlank:
                  l = a.fieldObj.name + " IS NOT NULL";
              }
            return { whereClause: l };
          },
          showDeleteIcon: function() {
            E.set(z.byId(this.id + ".deleteExpression"), "display", "block");
          },
          hideDeleteIcon: function() {
            E.set(z.byId(this.id + ".deleteExpression"), "display", "none");
          },
          createFieldsStore: function(a) {
            if (a && a.length) {
              a = b.clone(a);
              a = a.sort(function(a, f) {
                a.label = a.alias || a.name;
                f.label = f.alias || f.name;
                return a.label < f.label ? -1 : a.label > f.label ? 1 : 0;
              });
              var f = this.isHostedService(this.mapLayer.url);
              this.supportsStandardizedQuery =
                10.2 <= this.mapLayer.version &&
                (this.mapLayer.useStandardizedQueries ||
                  this.isBigDataLayer(this.mapLayer));
              a = e.filter(
                a,
                function(a, c) {
                  return "esriFieldTypeString" === a.type ||
                    "esriFieldTypeDouble" === a.type ||
                    "esriFieldTypeSingle" === a.type ||
                    "esriFieldTypeInteger" === a.type ||
                    "esriFieldTypeSmallInteger" === a.type ||
                    ("esriFieldTypeDate" === a.type &&
                      (this.allowAllDateTypes ||
                        f ||
                        this.supportsStandardizedQuery))
                    ? !0
                    : !1;
                },
                this
              );
              a = e.map(
                a,
                function(a, f) {
                  var c;
                  switch (a.type) {
                    case "esriFieldTypeString":
                      c = "string";
                      this.fieldsInfo.stringFieldsCount++;
                      break;
                    case "esriFieldTypeDate":
                      c = "date";
                      this.fieldsInfo.dateFieldsCount++;
                      break;
                    default:
                      (c = "number"), this.fieldsInfo.numberFieldsCount++;
                  }
                  return {
                    id: f,
                    label: a.label,
                    shortType: c,
                    alias: a.alias,
                    editable: a.editable,
                    name: a.name,
                    nullable: a.nullable,
                    type: a.type
                  };
                },
                this
              );
              a.length &&
                (this.fieldsStore = new I({
                  data: { identifier: "id", label: "label", items: a }
                }));
            }
          },
          createOperatorStores: function() {
            var a = [];
            a.push({
              name: this.i18n.stringOperatorIs,
              name_: this.i18n.stringOperatorIs,
              id: 0
            });
            a.push({
              name: this.i18n.stringOperatorIsNot,
              name_: this.i18n.stringOperatorIsNot,
              id: 1
            });
            a.push({
              name: this.i18n.stringOperatorStartsWith,
              name_: this.i18n.stringOperatorStartsWith,
              id: 2
            });
            a.push({
              name: this.i18n.stringOperatorEndsWith,
              name_: this.i18n.stringOperatorEndsWith,
              id: 3
            });
            a.push({
              name: this.i18n.stringOperatorContains,
              name_: this.i18n.stringOperatorContains,
              id: 4
            });
            a.push({
              name: this.i18n.stringOperatorDoesNotContain,
              name_: this.i18n.stringOperatorDoesNotContain,
              id: 5
            });
            a.push({
              name: this.i18n.stringOperatorIsBlank,
              name_: this.i18n.stringOperatorIsBlank,
              id: 6
            });
            a.push({
              name: this.i18n.stringOperatorIsNotBlank,
              name_: this.i18n.stringOperatorIsNotBlank,
              id: 7
            });
            this.stringOperatorStore = new I({
              data: { label: "name", identifier: "id", items: a }
            });
            a = [];
            a.push({ name: this.i18n.dateOperatorIsOn, id: 0 });
            a.push({ name: this.i18n.dateOperatorIsNotOn, id: 1 });
            a.push({ name: this.i18n.dateOperatorIsBefore, id: 2 });
            a.push({ name: this.i18n.dateOperatorIsAfter, id: 3 });
            a.push({ name: this.i18n.dateOperatorIsBetween, id: 6 });
            a.push({ name: this.i18n.dateOperatorIsNotBetween, id: 7 });
            a.push({ name: this.i18n.dateOperatorIsBlank, id: 8 });
            a.push({ name: this.i18n.dateOperatorIsNotBlank, id: 9 });
            this.dateOperatorStore = new I({
              data: { label: "name", identifier: "id", items: a }
            });
            a = [];
            a.push({
              name: this.i18n.numberOperatorIs,
              name_: this.i18n.numberOperatorIs,
              id: 0
            });
            a.push({
              name: this.i18n.numberOperatorIsNot,
              name_: this.i18n.numberOperatorIsNot,
              id: 1
            });
            a.push({
              name: this.i18n.numberOperatorIsAtLeast,
              name_: this.i18n.numberOperatorIsAtLeast,
              id: 2
            });
            a.push({
              name: this.i18n.numberOperatorIsLessThan,
              name_: this.i18n.numberOperatorIsLessThan,
              id: 3
            });
            a.push({
              name: this.i18n.numberOperatorIsAtMost,
              name_: this.i18n.numberOperatorIsAtMost,
              id: 4
            });
            a.push({
              name: this.i18n.numberOperatorIsGreaterThan,
              name_: this.i18n.numberOperatorIsGreaterThan,
              id: 5
            });
            a.push({
              name: this.i18n.numberOperatorIsBetween,
              name_: this.i18n.numberOperatorIsBetween,
              id: 6
            });
            a.push({
              name: this.i18n.numberOperatorIsNotBetween,
              name_: this.i18n.numberOperatorIsNotBetween,
              id: 7
            });
            a.push({
              name: this.i18n.numberOperatorIsBlank,
              name_: this.i18n.numberOperatorIsBlank,
              id: 8
            });
            a.push({
              name: this.i18n.numberOperatorIsNotBlank,
              name_: this.i18n.numberOperatorIsNotBlank,
              id: 9
            });
            this.numberOperatorStore = new I({
              data: { label: "name", identifier: "id", items: a }
            });
          },
          readCodedValues: function() {
            e.forEach(
              this.mapLayer.fields,
              function(a) {
                a.domain &&
                  a.domain.codedValues &&
                  (this.fieldDomains[a.name] = a.domain.codedValues);
              },
              this
            );
          },
          getDecodedValue: function(a, c) {
            c = this.getCodedValues(c);
            var f, b;
            if (c)
              for (f = 0; f < c.length; f += 1)
                if (((b = c[f]), b.code === a)) return b.name;
            return a;
          },
          getCodedValues: function(a) {
            return this.fieldDomains[a];
          },
          getFieldsList: function() {
            return c.byId(this.id + ".fieldsList");
          },
          getOperatorList: function() {
            return c.byId(this.id + ".operatorList");
          },
          getValueFieldsList: function() {
            return c.byId(this.id + ".valueFields");
          },
          getAttrValContNode: function() {
            return z.byId(this.id + ".attributeValueContainer");
          },
          getField: function() {
            var a = this.getFieldsList();
            return {
              name: a.store.getValue(a.item, "name"),
              label: a.store.getValue(a.item, "label"),
              shortType: a.store.getValue(a.item, "shortType"),
              type: a.store.getValue(a.item, "type")
            };
          },
          getOperator: function() {
            var a = this.getOperatorList();
            return a.item ? a.store.getValue(a.item, "name") : "";
          },
          getValue: function() {
            return {};
          },
          isInteractiveChecked: function() {
            return this.interactiveCheck.checked;
          },
          setInteractiveSection: function(a, c, b) {
            this.disableInteractiveHandlers();
            this.interactiveCheck.checked = a;
            this.promptText.attr("value", c);
            this.hintText.attr("value", b);
            E.set(this.interactiveSpace, "display", "block");
            this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9650;";
            this.enableInteractiveHandlers();
          },
          enableInteractiveHandlers: function() {
            this.onPromptChangeHandler = g.connect(
              this.promptText,
              "onChange",
              this,
              "onChangeInteractive"
            );
            this.onHintchangeHandler = g.connect(
              this.hintText,
              "onChange",
              this,
              "onChangeInteractive"
            );
          },
          disableInteractiveHandlers: function() {
            g.disconnect(this.onPromptChangeHandler);
            g.disconnect(this.onHintChangeHandler);
          },
          fillFieldsList: function(a) {
            var f = this.getFieldsList();
            f.set("labelAttr", "label");
            f.set("searchAttr", "label");
            f.set("store", a);
            f.set("value", 0);
          },
          fillOperatorList: function(a, c, h) {
            var f = this.getOperatorList();
            f.set("labelAttr", "name");
            f.set("searchAttr", "name");
            f.set("query", h ? h : {});
            f.set("store", a);
            if (c) {
              var l = !1;
              for (
                h = 0;
                20 > h &&
                (a.fetchItemByIdentity({
                  identity: h,
                  onItem: b.hitch(this, function(a) {
                    a && a.name[0] === c && (f.set("value", a.id[0]), (l = !0));
                  })
                }),
                !l);
                h++
              );
            } else f.set("value", 0);
          },
          createValueString: function(a) {
            var f = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(f);
            if (a) {
              var f = new h(
                  {
                    id: this.id + ".value",
                    class: "attributeValue",
                    maxHeight: 150,
                    sortByLabel: !0
                  },
                  w.create("div", {}, f)
                ),
                b = this.buildCodedValuesStore(a);
              f.set("store", b);
              f.set("value", 0);
            } else
              f = new n(
                {
                  id: this.id + ".value",
                  class: "attributeValue",
                  required: !0,
                  placeHolder: "",
                  intermediateChanges: !0
                },
                w.create("div", {}, f)
              );
            this.valueHandlers.push(
              g.connect(f, "onChange", this, "onValueChange")
            );
            this.checkDefaultOption();
            this.getValue = function() {
              var f = c.byId(this.id + ".value"),
                b = !0;
              a
                ? f.item
                  ? (f = f.item.code[0])
                  : ((f = ""), (b = !1))
                : (b = f = f.get("value"));
              return { value: f, isValid: b };
            };
          },
          createValueDate: function() {
            var a = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(a);
            a = new F(
              {
                id: this.id + ".value",
                class: "attributeValue",
                trim: !0,
                required: !0,
                placeHolder: "",
                constraints: { formatLength: "short" }
              },
              w.create("div", {}, a)
            );
            this.checkDefaultOption();
            this.valueHandlers.push(
              g.connect(a, "onChange", this, "onValueChange")
            );
            this.getValue = function() {
              var a = c.byId(this.id + ".value").get("value");
              return { value: a, isValid: R.isDefined(a) };
            };
          },
          createValueNumber: function(a) {
            var f = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(f);
            if (a) {
              var f = new h(
                  {
                    id: this.id + ".value",
                    class: "attributeValue",
                    maxHeight: 150,
                    sortByLabel: !0
                  },
                  w.create("div", {}, f)
                ),
                b = this.buildCodedValuesStore(a);
              f.set("store", b);
              f.set("value", 0);
            } else
              f = new V(
                {
                  id: this.id + ".value",
                  class: "attributeValue",
                  required: !0,
                  placeHolder: "",
                  intermediateChanges: !0,
                  constraints: { pattern: "#####0.##########" }
                },
                w.create("div", {}, f)
              );
            this.valueHandlers.push(
              g.connect(f, "onChange", this, "onValueChange")
            );
            this.checkDefaultOption();
            this.getValue = function() {
              var f = c.byId(this.id + ".value"),
                b = !0;
              a
                ? f.item
                  ? (f = f.item.code[0])
                  : ((f = ""), (b = !1))
                : ((f = f.get("value")), (b = R.isDefined(f) && !isNaN(f)));
              return { value: f, isValid: b };
            };
          },
          createValueBetweenDate: function() {
            var a = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(a);
            var b = new F(
              {
                id: this.id + ".value1",
                class: "attributeValue1",
                trim: !0,
                required: !0,
                placeHolder: "",
                constraints: { formatLength: "short" }
              },
              w.create("div", {}, a)
            );
            w.create(
              "span",
              {
                innerHTML: this.i18n.andBetweenValues,
                class: "attributeBetweenValues"
              },
              a
            );
            a = new F(
              {
                id: this.id + ".value2",
                class: "attributeValue2",
                trim: !0,
                required: !0,
                placeHolder: "",
                constraints: { formatLength: "short" }
              },
              w.create("div", {}, a)
            );
            this.checkDefaultOption();
            this.valueHandlers.push(
              g.connect(b, "onChange", this, "onValueChange")
            );
            this.valueHandlers.push(
              g.connect(a, "onChange", this, "onValueChange")
            );
            this.getValue = function() {
              var a = c.byId(this.id + ".value1").get("value"),
                f = c.byId(this.id + ".value2").get("value");
              return {
                value1: a,
                value2: f,
                isValid: R.isDefined(a) && R.isDefined(f)
              };
            };
          },
          createValueBetweenNumber: function() {
            var a = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(a);
            var b = new V(
              {
                id: this.id + ".value1",
                class: "attributeValue1",
                required: !0,
                placeHolder: "",
                intermediateChanges: !0,
                constraints: { pattern: "#####0.##########" }
              },
              w.create("div", {}, a)
            );
            w.create(
              "span",
              {
                innerHTML: this.i18n.andBetweenValues,
                class: "attributeBetweenValues"
              },
              a
            );
            a = new V(
              {
                id: this.id + ".value2",
                class: "attributeValue2",
                required: !0,
                placeHolder: "",
                intermediateChanges: !0,
                constraints: { pattern: "#####0.##########" }
              },
              w.create("div", {}, a)
            );
            this.checkDefaultOption();
            this.valueHandlers.push(
              g.connect(b, "onChange", this, "onValueChange")
            );
            this.valueHandlers.push(
              g.connect(a, "onChange", this, "onValueChange")
            );
            this.getValue = function() {
              var a = c.byId(this.id + ".value1").get("value"),
                f = c.byId(this.id + ".value2").get("value");
              return {
                value1: a,
                value2: f,
                isValid:
                  R.isDefined(a) &&
                  R.isDefined(f) &&
                  !isNaN(a) &&
                  !isNaN(f) &&
                  a <= f
              };
            };
          },
          createValueInTheLastDate: function() {},
          createValueIsBlank: function() {
            var a = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(a);
            a.innerHTML =
              "\x3cinput id\x3d'" +
              this.id +
              ".value' class\x3d'attributeValue' type\x3d'text' disabled\x3d'true'/\x3e";
            this.checkDefaultOption();
            this.getValue = function() {
              return { value: null, isValid: !0 };
            };
          },
          createValueFields: function(a, l, d) {
            var f = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(f);
            var n = new h(
              {
                id: this.id + ".valueFields",
                class: "attributeValue",
                maxHeight: 150,
                labelAttr: "label",
                searchAttr: "label",
                store: a,
                query: l
              },
              w.create("div", {}, f)
            );
            if (d)
              for (
                var e = !1, f = 0;
                100 > f &&
                (a.fetchItemByIdentity({
                  identity: f,
                  onItem: b.hitch(this, function(a) {
                    a &&
                      a.shortType[0] === l.shortType &&
                      a.name[0] !== d &&
                      (n.set("value", a.id), (e = !0));
                  })
                }),
                !e);
                f++
              );
            this.valueHandlers.push(
              g.connect(n, "onChange", this, "onValueChange")
            );
            this.getValue = function() {
              var a = c.byId(this.id + ".valueFields");
              return {
                value: a.store.getValue(a.item, "name"),
                label: a.store.getValue(a.item, "label"),
                type: "field",
                isValid: !0
              };
            };
          },
          createValueUnique: function(a) {
            var f = this.getAttrValContNode();
            this.clearAttributeValueDijits();
            w.empty(f);
            a = new h(
              {
                id: this.id + ".valueUnique",
                class: "attributeValue",
                maxHeight: 150,
                store: a
              },
              w.create("div", {}, f)
            );
            a.set("value", 0);
            this.valueHandlers.push(
              g.connect(a, "onChange", this, "onValueChange")
            );
            this.getValue = function() {
              var a = c.byId(this.id + ".valueUnique");
              return { value: a.store.getValue(a.item, "value"), isValid: !0 };
            };
          },
          setValue: function(a, b) {
            if (b)
              for (var f = 0; f < b.length; f++) {
                if (a === b[f].code) {
                  c.byId(this.id + ".value").set("value", f);
                  break;
                }
              }
            else
              "date" === this.part.fieldObj.shortType
                ? c.byId(this.id + ".value").set("value", new Date(a))
                : ("number" === this.part.fieldObj.shortType && (a = Number(a)),
                  c.byId(this.id + ".value").set("value", a));
          },
          setValue1: function(a) {
            "date" === this.part.fieldObj.shortType
              ? (a = new Date(a))
              : "number" === this.part.fieldObj.shortType && (a = Number(a));
            c.byId(this.id + ".value1").set("value", a);
          },
          setValue2: function(a) {
            "date" === this.part.fieldObj.shortType
              ? (a = new Date(a))
              : "number" === this.part.fieldObj.shortType && (a = Number(a));
            c.byId(this.id + ".value2").set("value", a);
          },
          setValueFieldById: function(a) {
            this.getValueFieldsList().set("value", a);
          },
          enableOnFieldChange: function() {
            this.onFieldChangeEnabled = !0;
          },
          enableOnOperatorChange: function() {
            this.onOperatorChangeEnabled = !0;
          },
          onChangeField: function(a) {
            this.onFieldChangeEnabled &&
              this._onChangeField(this.getFieldsList(), this);
          },
          onChangeOperator: function(a) {
            this.onOperatorChangeEnabled &&
              this._onChangeOperator(this.getOperatorList(), this);
          },
          onClickDeleteExpression: function(a) {
            this._deleteExpression(this);
          },
          _onChangeField: function(a, c, b) {
            var f =
              !!this.mapLayer && this.isPortalHostedService(this.mapLayer.url);
            this.isBigDataLayer(this.mapLayer) ||
            (f &&
              "esriFieldTypeDate" === this.fieldsStore.getValue(a.item, "type"))
              ? E.set(z.byId(this.id + ".radioUniqueColumn"), "display", "none")
              : E.set(z.byId(this.id + ".radioUniqueColumn"), "display", "");
            f = c.getOperatorList();
            switch (this.fieldsStore.getValue(a.item, "type")) {
              case "esriFieldTypeString":
                var h = null;
                a = this.fieldsStore.getValue(a.item, "name");
                this.getCodedValues(a) &&
                  ((h = this.i18n.stringOperatorStartsWith),
                  (h += "|" + this.i18n.stringOperatorEndsWith),
                  (h += "|" + this.i18n.stringOperatorContains),
                  (h += "|" + this.i18n.stringOperatorDoesNotContain),
                  (h = { name_: new RegExp("^(?!(" + h + ")$)") }));
                f.attr("value") === this.i18n.stringOperatorIs
                  ? (c.fillOperatorList(
                      this.stringOperatorStore,
                      this.i18n.stringOperatorIs,
                      h
                    ),
                    this.onChangeOperator(f, c, b))
                  : c.fillOperatorList(
                      this.stringOperatorStore,
                      this.i18n.stringOperatorIs,
                      h
                    );
                c.createValueString(this.getCodedValues(a));
                break;
              case "esriFieldTypeDate":
                c.fillOperatorList(
                  this.dateOperatorStore,
                  this.i18n.dateOperatorIsOn
                );
                c.createValueDate();
                break;
              default:
                (h = null),
                  (a = this.fieldsStore.getValue(a.item, "name")),
                  this.getCodedValues(a) &&
                    ((h = this.i18n.numberOperatorIsBetween),
                    (h += "|" + this.i18n.numberOperatorIsNotBetween),
                    (h += "|" + this.i18n.numberOperatorIsAtLeast),
                    (h += "|" + this.i18n.numberOperatorIsLessThan),
                    (h += "|" + this.i18n.numberOperatorIsAtMost),
                    (h += "|" + this.i18n.numberOperatorIsGreaterThan),
                    (h = { name_: new RegExp("^(?!(" + h + ")$)") })),
                  f.attr("value") === this.i18n.numberOperatorIs
                    ? (c.fillOperatorList(
                        this.numberOperatorStore,
                        this.i18n.numberOperatorIs,
                        h
                      ),
                      this.onChangeOperator(f, c, b))
                    : c.fillOperatorList(
                        this.numberOperatorStore,
                        this.i18n.numberOperatorIs,
                        h
                      ),
                  c.createValueNumber(this.getCodedValues(a));
            }
            "date" ===
            this.fieldsStore.getValue(c.getFieldsList().item, "shortType")
              ? c.disableInteractiveCheck()
              : c.enableInteractiveCheck();
            g.publish("filter-expression-change", this);
          },
          _onChangeOperator: function(a, c, b) {
            a = a.item ? a.item.name[0] : a.value;
            b = this.fieldsStore.getValue(c.getFieldsList().item, "shortType");
            var f = this.fieldsStore.getValue(c.getFieldsList().item, "name");
            c.enableOptions();
            if (
              ("date" !== b && "number" !== b) ||
              (a !== this.i18n.dateOperatorIsBetween &&
                a !== this.i18n.numberOperatorIsBetween &&
                a !== this.i18n.dateOperatorIsNotBetween &&
                a !== this.i18n.numberOperatorIsNotBetween)
            )
              if (
                "date" !== b ||
                (a !== this.i18n.dateOperatorInTheLast &&
                  a !== this.i18n.dateOperatorNotInTheLast)
              )
                if (
                  a === this.i18n.stringOperatorIsBlank ||
                  a === this.i18n.dateOperatorIsBlank ||
                  a === this.i18n.numberOperatorIsBlank ||
                  a === this.i18n.stringOperatorIsNotBlank ||
                  a === this.i18n.dateOperatorIsNotBlank ||
                  a === this.i18n.numberOperatorIsNotBlank
                )
                  c.createValueIsBlank(), c.disableOptions();
                else
                  switch (b) {
                    case "string":
                      c.createValueString(this.getCodedValues(f));
                      break;
                    case "date":
                      c.createValueDate();
                      break;
                    default:
                      c.createValueNumber(this.getCodedValues(f));
                  }
              else c.disableOptions(), c.createValueInTheLastDate();
            else
              c.disableOptions(),
                "date" === b
                  ? c.createValueBetweenDate()
                  : c.createValueBetweenNumber();
            g.publish("filter-expression-change", this);
          },
          onInteractiveClick: function(a) {
            this.isInteractiveChecked()
              ? (E.set(this.interactiveSpace, "display", "block"),
                (this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9650;"))
              : (E.set(this.interactiveSpace, "display", "none"),
                (this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9660;"));
            g.publish("filter-expression-change", this);
          },
          onClickShowHideInteractive: function(a) {
            this.interactiveCheck.disabled ||
              ("none" === E.set(this.interactiveSpace, "display")
                ? (E.set(this.interactiveSpace, "display", "block"),
                  (this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9650;"))
                : (E.set(this.interactiveSpace, "display", "none"),
                  (this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9660;")));
          },
          onChangeInteractive: function() {
            g.publish("filter-expression-change", this);
          },
          showValueInput: function(a) {
            this._showValueInput(c.byNode(a.target), this);
          },
          showFields: function(a) {
            this._showFields(c.byNode(a.target), this);
          },
          showUniqueList: function(a) {
            this._showUniqueList(c.byNode(a.target), this);
          },
          onValueChange: function() {
            this.onValueChangeHandler &&
              clearTimeout(this.onValueChangeHandler);
            this.onValueChangeHandler = setTimeout(
              b.hitch(this, function() {
                this.onValueChangeHandler = null;
                g.publish("filter-expression-change", this);
              }),
              800
            );
          },
          _showValueInput: function(a, c, b) {
            c.onChangeOperator(a, c, b);
            c.enableInteractiveCheck();
          },
          _showFields: function(a, c, b) {
            b = c.getFieldsList().item;
            a = this.fieldsStore.getValue(b, "shortType");
            b = this.fieldsStore.getValue(b, "name");
            c.createValueFields(
              this.fieldsStore,
              { shortType: a, name: new RegExp("^(?!" + b + "$)") },
              b
            );
            c.disableInteractiveCheck();
          },
          _showUniqueList: function(a, c, h) {
            this.uniqueValuesStore && delete this.uniqueValuesStore;
            h = this.fieldsStore.getValue(c.getFieldsList().item, "name");
            if (10.1 <= this.version || !this.mapLayer.url) {
              var f = null;
              this.mapLayer.queryServiceUrl
                ? (f = this.mapLayer.queryServiceUrl)
                : this.mapLayer.itemLayers &&
                  e.forEach(
                    this.mapLayer.itemLayers,
                    function(a) {
                      a.id === this.layerInfo.id &&
                        a.layerUrl &&
                        (f = a.layerUrl);
                    },
                    this
                  );
              f || (f = this.mapLayer.url);
              if (this.uniqueValuesResults[this.mapLayer.id + "_" + h])
                this.onGenerateRendererResults(
                  c,
                  a,
                  this.uniqueValuesResults[this.mapLayer.id + "_" + h]
                );
              else
                this.generateRendererUniqueValues(
                  h,
                  f,
                  b.hitch(this, "onGenerateRendererResults", c, a),
                  b.hitch(this, function() {
                    this.showValueInput(a, c);
                  })
                );
            } else a && this.showValueInput(a, c);
          },
          onGenerateRendererResults: function(a, c, b) {
            var f = this.fieldsStore.getValue(a.getFieldsList().item, "name"),
              h = this.fieldsStore.getValue(
                a.getFieldsList().item,
                "shortType"
              ),
              l = this.fieldsStore.getValue(a.getFieldsList().item, "type");
            this.uniqueValuesResults[this.mapLayer.id + "_" + f] = b;
            var d = null;
            e.forEach(this.mapLayer.fields, function(a) {
              a.name === f && a.domain && (d = a.domain);
            });
            b = e.filter(b, function(a, c) {
              return "string" === h
                ? "\x3cNull\x3e" !== a && "" !== a.trim()
                : "\x3cNull\x3e" !== a && "" !== a;
            });
            b.length
              ? ("date" === h
                  ? ((b = e.map(b, function(a) {
                      return new Date(a);
                    })),
                    (b = b.sort(function(a, c) {
                      a = a.getTime();
                      c = c.getTime();
                      return a < c ? -1 : a > c ? 1 : 0;
                    })),
                    (b = e.map(
                      b,
                      function(a) {
                        return this.formatFriendlyDate(a);
                      },
                      this
                    )))
                  : "number" === h
                  ? ((b = e.map(b, function(a) {
                      return "esriFieldTypeDouble" === l ||
                        "esriFieldTypeSingle" === l
                        ? parseFloat(a)
                        : parseInt(a, 10);
                    })),
                    (b = b.sort(function(a, c) {
                      return a < c ? -1 : a > c ? 1 : 0;
                    })))
                  : (b = b.sort(function(a, c) {
                      return a < c ? -1 : a > c ? 1 : 0;
                    })),
                (c = e.map(
                  b,
                  function(a, c) {
                    var b = a;
                    "string" === h &&
                      (b =
                        "" === a ? "\x3c" + this.i18n.emptyString + "\x3e" : a);
                    if (d && d.codedValues) {
                      for (var f = 0; f < d.codedValues.length; f++) {
                        var n = d.codedValues[f];
                        if (a === n.code)
                          return { id: c, name: n.name || b, value: a };
                      }
                      return { id: c, name: "" + b, value: a };
                    }
                    if (
                      "esriFieldTypeDouble" === l ||
                      "esriFieldTypeSingle" === l
                    )
                      b = v.format(a, { pattern: "#####0.##########" });
                    return { id: c, name: "" + b, value: a };
                  },
                  this
                )),
                (this.uniqueValuesStore = new I({
                  data: { label: "name", identifier: "id", items: c }
                })),
                a.createValueUnique(this.uniqueValuesStore))
              : this.showValueInput(c, a);
          },
          generateRendererUniqueValues: function(a, c, h, l) {
            a instanceof Array && (a = a.toString());
            var f = new Z();
            f.attributeField = a;
            a = new B();
            a.classificationDefinition = f;
            this.mapLayer instanceof X
              ? (c = new U(this.mapLayer))
              : this.mapLayer instanceof D && !this.mapLayer.url
              ? (c = new U(this.mapLayer))
              : this.hasDynamicLayers(this.mapLayer)
              ? ((f =
                  this.mapLayer.layerDefinitions &&
                  this.mapLayer.layerDefinitions[this.mapLayer.id]
                    ? this.mapLayer.layerDefinitions[this.mapLayer.id]
                    : null),
                (a.where = f ? f : null),
                (c = new U(this.mapLayer.url + "/dynamicLayer", {
                  source: this.layerInfo.source
                })))
              : ((f = this.mapLayer.getDefinitionExpression()),
                (a.where = f ? f : null),
                (c = new U(c)));
            P.config.defaults.io.timeout = 1e4;
            c.execute(
              a,
              function(a) {
                P.config.defaults.io.timeout = 6e4;
                a = e.map(a.infos, function(a) {
                  return a.value;
                });
                h(a);
              },
              b.hitch(this, function(a) {
                P.config.defaults.io.timeout = 6e4;
                l();
              })
            );
          },
          hasDynamicLayers: function(a) {
            return a && a.supportsDynamicLayers ? !0 : !1;
          },
          formatDate: function(a) {
            return (
              H.format(a, { datePattern: "yyyy-MM-dd", selector: "date" }) +
              " " +
              H.format(a, { selector: "time", timePattern: "HH:mm:ss" })
            );
          },
          formatFriendlyDate: function(a) {
            return H.format(a, { formatLength: "short", selector: "date" });
          },
          parseFriendlyDate: function(a) {
            return H.parse(a, { formatLength: "short", selector: "date" });
          },
          parseDate: function(a) {
            var c = H.parse(a, {
              datePattern: "yyyy-MM-dd",
              timePattern: "HH:mm:ss"
            });
            c ||
              (c = H.parse(a.replace(" ", ", "), {
                datePattern: "yyyy-MM-dd",
                timePattern: "HH:mm:ss"
              })) ||
              (c = H.parse(a.replace(" ", " - "), {
                datePattern: "yyyy-MM-dd",
                timePattern: "HH:mm:ss"
              }));
            return c;
          },
          addDay: function(a) {
            return new Date(a.getTime() + this.dayInMS);
          },
          subtractDay: function(a) {
            return new Date(a.getTime() - this.dayInMS);
          },
          containsNonLatinCharacter: function(a) {
            for (var c = 0; c < a.length; c++)
              if (255 < a.charCodeAt(c)) return !0;
            return !1;
          },
          buildCodedValuesStore: function(a) {
            a = e.map(a, function(a, c) {
              return { name: a.name, code: a.code, id: c };
            });
            return new I({
              data: { label: "name", identifier: "id", items: a }
            });
          },
          clearAttributeValueDijits: function() {
            this.valueHandlers &&
              0 !== this.valueHandlers.length &&
              (e.forEach(
                this.valueHandlers,
                b.hitch(this, function(a) {
                  g.disconnect(a);
                  a = null;
                })
              ),
              (this.valueHandlers = []),
              c.byId(this.id + ".value")
                ? c.byId(this.id + ".value").destroy()
                : z.byId(this.id + ".value") &&
                  this.getAttrValContNode().removeChild(
                    z.byId(this.id + ".value")
                  ),
              c.byId(this.id + ".value1")
                ? c.byId(this.id + ".value1").destroy()
                : z.byId(this.id + ".value1") &&
                  this.getAttrValContNode().removeChild(
                    z.byId(this.id + ".value1")
                  ),
              c.byId(this.id + ".value2")
                ? c.byId(this.id + ".value2").destroy()
                : z.byId(this.id + ".value2") &&
                  this.getAttrValContNode().removeChild(
                    z.byId(this.id + ".value2")
                  ),
              c.byId(this.id + ".valueFields") &&
                c.byId(this.id + ".valueFields").destroy(),
              c.byId(this.id + ".valueUnique") &&
                c.byId(this.id + ".valueUnique").destroy());
          },
          checkDefaultOption: function() {
            p(
              ".attributeValueOptions .attributeValueRadio",
              this.domNode
            ).forEach(function(a) {
              c.byNode(a).set(
                "checked",
                -1 < a.className.indexOf("radioValue")
              );
            });
          },
          disableOptions: function() {
            p(
              ".attributeValueOptions .attributeValueRadio",
              this.domNode
            ).forEach(function(a) {
              c.byNode(a).set("disabled", !0);
            });
          },
          enableOptions: function() {
            p(
              ".attributeValueOptions .attributeValueRadio",
              this.domNode
            ).forEach(function(a) {
              c.byNode(a).set("disabled", !1);
            });
          },
          checkFieldOption: function() {
            c.byId(this.id + ".radioFields").set("checked", !0);
          },
          disableFieldOption: function() {
            c.byId(this.id + ".radioFields").set("disabled", !0);
          },
          disableUniqueOption: function() {
            c.byId(this.id + ".radioUnique").set("disabled", !0);
          },
          enableInteractiveCheck: function() {
            this.interactiveCheck.disabled = !1;
          },
          disableInteractiveCheck: function() {
            this.interactiveCheck.checked = !1;
            this.interactiveCheck.disabled = !0;
          },
          isBigDataLayer: function(a) {
            return (
              !!a.url &&
              -1 !== a.url.indexOf("BigDataCatalogServer") &&
              ("featureClass" === a.type || "table" === a.type)
            );
          },
          isPortalHostedService: function(a) {
            return a ? -1 !== a.toLowerCase().indexOf("/hosted/") : !1;
          },
          isHostedService: function(a) {
            if (!a) return !1;
            var c = -1 !== a.indexOf(".arcgis.com/");
            a =
              -1 !== a.indexOf("//services") ||
              -1 !== a.indexOf("//tiles") ||
              -1 !== a.indexOf("//features");
            return c && a;
          },
          buildEditUIField: function(a, c, h) {
            this.getFieldItemByName(
              { name: a.fieldObj.name },
              b.hitch(this, function(b) {
                c.getFieldsList().set("value", b.id[0], !1);
                this.buildEditUIOperator(a, c, h);
              }),
              b.hitch(this, function() {
                c.getFieldsList().set("value", 0);
                this.buildEditUIOperator(a, c, h);
              })
            );
          },
          buildEditUIOperator: function(a, c, h) {
            switch (a.fieldObj.shortType) {
              case "string":
                c.fillOperatorList(this.stringOperatorStore, a.operator);
                break;
              case "date":
                c.fillOperatorList(this.dateOperatorStore, a.operator);
                break;
              default:
                c.fillOperatorList(this.numberOperatorStore, a.operator);
            }
            setTimeout(
              b.hitch(this, function() {
                this.getOperatorItemByName(
                  c.getOperatorList().store,
                  { name: a.operator },
                  b.hitch(this, function(b) {
                    c.getOperatorList().set("value", b.id[0], !1);
                    this.buildEditUIValue(a, c, h);
                  }),
                  b.hitch(this, function() {
                    c.getOperatorList().set("value", 0);
                    this.buildEditUIValue(a, c, h);
                  })
                );
              }),
              100
            );
          },
          buildEditUIValue: function(a, c, h) {
            this.onOperatorChangeEnabled = this.onFieldChangeEnabled = !0;
            var f = a.operator;
            this.onChangeOperator(c.getOperatorList(), c);
            c.enableOptions();
            setTimeout(
              b.hitch(this, function() {
                f === this.i18n.stringOperatorIsBlank ||
                f === this.i18n.dateOperatorIsBlank ||
                f === this.i18n.numberOperatorIsBlank ||
                f === this.i18n.stringOperatorIsNotBlank ||
                f === this.i18n.dateOperatorIsNotBlank ||
                f === this.i18n.numberOperatorIsNotBlank
                  ? (c.createValueIsBlank(), c.disableOptions())
                  : "field" === a.valueObj.type
                  ? (c.createValueFields(this.fieldsStore, {
                      shortType: a.fieldObj.shortType,
                      name: new RegExp("^(?!" + a.fieldObj.name + "$)")
                    }),
                    c.checkFieldOption(),
                    this.getFieldItemByName(
                      { name: a.valueObj.value },
                      b.hitch(this, function(a) {
                        c.setValueFieldById(a.id[0]);
                      }),
                      b.hitch(this, function() {
                        c.setValueFieldById(0);
                      })
                    ))
                  : R.isDefined(a.valueObj.value1)
                  ? (c.setValue1(a.valueObj.value1),
                    c.setValue2(a.valueObj.value2))
                  : c.setValue(
                      a.valueObj.value,
                      this.getCodedValues(a.fieldObj.name)
                    );
              }),
              100
            );
          },
          getFieldItemByName: function(a, c, h) {
            this.fieldsStore.fetch({
              query: a,
              onComplete: b.hitch(this, function(a) {
                a && a.length ? c(a[0]) : h();
              })
            });
          },
          getOperatorItemByName: function(a, c, h, l) {
            a.fetch({
              query: c,
              onComplete: b.hitch(this, function(a) {
                a && a.length ? h(a[0]) : l();
              })
            });
          }
        });
        u("extend-esri") && b.setObject("dijit.SingleFilter", k, P);
        return k;
      });
    },
    "esri/tasks/GenerateRendererTask": function() {
      define("require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/number dojo/_base/json dojo/_base/Deferred dojo/has ../kernel ../request ../deferredUtils ../urlUtils ../renderers/jsonUtils ./StatisticDefinition ./Task ./QueryTask ./query dojo/has!extend-esri?./GenerateRendererParameters dojo/has!extend-esri?./ClassificationDefinition dojo/has!extend-esri?./ClassBreaksDefinition dojo/has!extend-esri?./UniqueValueDefinition dojo/has!extend-esri?./ColorRamp dojo/has!extend-esri?./AlgorithmicColorRamp dojo/has!extend-esri?./MultipartColorRamp".split(
        " "
      ), function(k, d, b, e, g, q, u, x, A, v, z, E, y, w, p, t, C) {
        d = d(p, {
          declaredClass: "esri.tasks.GenerateRendererTask",
          _eventMap: { complete: ["renderer"] },
          constructor: function(d, e) {
            !b.isObject(d) ||
            ("esri.layers.FeatureLayer" !== d.declaredClass &&
              "esri.layers.CSVLayer" !== d.declaredClass)
              ? ((this.url = d), (this._url.path += "/generateRenderer"))
              : d.url &&
                b.isString(d.url) &&
                "esri.layers.CSVLayer" !== d.declaredClass
              ? ((this.url = d.url),
                (this._url = E.urlToObject(this.url)),
                (this._url.path += "/generateRenderer"))
              : (this._features = d.graphics);
            this._handler = b.hitch(this, this._handler);
            this.source = e && e.source;
            this.gdbVersion = e && e.gdbVersion;
            this.checkValueRange = e && e.checkValueRange;
            this.registerConnectEvents();
          },
          _handler: function(d, e, g, k, p) {
            try {
              var q;
              "esri.renderer.ClassBreaksRenderer" === d.declaredClass ||
              "esri.renderer.UniqueValueRenderer" === d.declaredClass
                ? (q = d)
                : ((q = y.fromJson(d)),
                  "classBreaks" === d.type && q.setMaxInclusive(!0));
              if (this.checkValueRange) {
                var u = new t(this.url),
                  r = new C(),
                  a = new w();
                a.statisticType = "min";
                a.onStatisticField = this._field;
                var c = new w();
                c.statisticType = "max";
                c.onStatisticField = this._field;
                r.outStatistics = [a, c];
                u.execute(r).then(
                  b.hitch(this, function(a) {
                    a = a.features[0].attributes;
                    for (var c in a)
                      if (0 === c.toLowerCase().indexOf("min")) var b = a[c];
                      else var d = a[c];
                    q = this._processRenderer(
                      q,
                      this._prefix,
                      this._unitLabel,
                      this._formatLabel,
                      this._precision,
                      b,
                      d
                    );
                    this._successHandler([q], "onComplete", g, p);
                  })
                );
              } else
                (q = this._processRenderer(
                  q,
                  this._prefix,
                  this._unitLabel,
                  this._formatLabel,
                  this._precision
                )),
                  this._successHandler([q], "onComplete", g, p);
            } catch (n) {
              this._errorHandler(n, k, p);
            }
          },
          _processRenderer: function(b, d, k, p, q, t, C) {
            "esri.renderer.ClassBreaksRenderer" === b.declaredClass
              ? e.forEach(b.infos, function(e, a) {
                  0 === a && void 0 !== t && null !== t && (e.minValue = t);
                  a === b.infos.length - 1 &&
                    void 0 !== C &&
                    null !== C &&
                    (e.classMaxValue = e.maxValue = C);
                  q &&
                    ((e.classMaxValue = e.maxValue =
                      Math.round(e.maxValue / q) * q),
                    (e.minValue = Math.round(e.minValue / q) * q));
                  p &&
                    (e.label =
                      g.format(e.minValue) + " - " + g.format(e.maxValue));
                  d && (e.label = d + " " + e.label);
                  k && (e.label = e.label + " " + k);
                })
              : e.forEach(b.infos, function(e, a) {
                  0 === a && void 0 !== t && null !== t && (e.value = t);
                  a === b.infos.length - 1 &&
                    void 0 !== C &&
                    null !== C &&
                    (e.value = C);
                  p && (e.label = g.format(e.value));
                  d && (e.label = d + " " + e.label);
                  k && (e.label = e.label + " " + k);
                });
            return b;
          },
          execute: function(d, e, g) {
            var p,
              t = this._handler,
              C = this._errorHandler;
            this._precision = d.precision;
            this._prefix = d.prefix;
            this._unitLabel = d.unitLabel;
            this._formatLabel = d.formatLabel;
            if ((this._features = d.features || this._features)) {
              p = new u();
              var x = this._features;
              k(["./generateRenderer"], function(a) {
                var c;
                "esri.tasks.ClassBreaksDefinition" ===
                d.classificationDefinition.declaredClass
                  ? (c = a.createClassBreaksRenderer({
                      features: x,
                      definition: d.classificationDefinition
                    }))
                  : "esri.tasks.UniqueValueDefinition" ===
                      d.classificationDefinition.declaredClass &&
                    (c = a.createUniqueValueRenderer({
                      features: x,
                      definition: d.classificationDefinition
                    }));
                c ? t(c, null, e, g, p) : C(null, g, p);
              });
            } else {
              var r = b.mixin(d.toJson(), { f: "json" });
              this._field =
                "esri.tasks.ClassBreaksDefinition" ===
                d.classificationDefinition.declaredClass
                  ? d.classificationDefinition.classificationField
                  : d.classificationDefinition.attributeField;
              if (this.source) {
                var a = { source: this.source.toJson() };
                r.layer = q.toJson(a);
              }
              this.gdbVersion && (r.gdbVersion = this.gdbVersion);
              p = new u(z._dfdCanceller);
              p._pendingDfd = v({
                url: this._url.path,
                content: r,
                callbackParamName: "callback",
                load: function(a, b) {
                  t(a, b, e, g, p);
                },
                error: function(a) {
                  C(a, g, p);
                }
              });
            }
            return p;
          },
          onComplete: function() {}
        });
        x("extend-esri") && b.setObject("tasks.GenerateRendererTask", d, A);
        return d;
      });
    },
    "esri/tasks/UniqueValueDefinition": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "./ClassificationDefinition"
      ], function(k, d, b, e, g) {
        k = k(g, {
          declaredClass: "esri.tasks.UniqueValueDefinition",
          type: "uniqueValueDef",
          attributeField: null,
          attributeField2: null,
          attributeField3: null,
          fieldDelimiter: null,
          toJson: function() {
            var b = this.inherited(arguments);
            this.uniqueValueFields = [];
            this.attributeField &&
              this.uniqueValueFields.push(this.attributeField);
            this.attributeField2 &&
              this.uniqueValueFields.push(this.attributeField2);
            this.attributeField3 &&
              this.uniqueValueFields.push(this.attributeField3);
            d.mixin(b, {
              type: this.type,
              uniqueValueFields: this.uniqueValueFields
            });
            this.fieldDelimiter &&
              d.mixin(b, { fieldDelimiter: this.fieldDelimiter });
            return b;
          }
        });
        b("extend-esri") && d.setObject("tasks.UniqueValueDefinition", k, e);
        return k;
      });
    },
    "esri/tasks/ClassificationDefinition": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e) {
        k = k(null, {
          declaredClass: "esri.tasks.ClassificationDefinition",
          type: null,
          baseSymbol: null,
          colorRamp: null,
          toJson: function() {
            var b = {};
            this.baseSymbol &&
              d.mixin(b, { baseSymbol: this.baseSymbol.toJson() });
            this.colorRamp &&
              !d.isString(this.colorRamp) &&
              d.mixin(b, { colorRamp: this.colorRamp.toJson() });
            return b;
          }
        });
        b("extend-esri") && d.setObject("tasks.ClassificationDefinition", k, e);
        return k;
      });
    },
    "esri/tasks/GenerateRendererParameters": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/json",
        "dojo/has",
        "../kernel"
      ], function(k, d, b, e, g) {
        k = k(null, {
          declaredClass: "esri.tasks.GenerateRendererParameters",
          classificationDefinition: null,
          where: null,
          precision: null,
          prefix: null,
          unitLabel: null,
          formatLabel: null,
          toJson: function() {
            return {
              classificationDef: b.toJson(
                this.classificationDefinition.toJson()
              ),
              where: this.where
            };
          }
        });
        e("extend-esri") &&
          d.setObject("tasks.GenerateRendererParameters", k, g);
        return k;
      });
    },
    "esri/layers/GeoRSSLayer": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has ../kernel ../config ../request ../urlUtils ./ServiceGeneratedFeatureCollection".split(
        " "
      ), function(k, d, b, e, g, q, u, x, A) {
        k = k([A], {
          declaredClass: "esri.layers.GeoRSSLayer",
          serviceUrl:
            x.getProtocolForWebResource() + "//utility.arcgis.com/sharing/rss",
          constructor: function(b, d) {
            q.defaults.geoRSSService &&
              (this.serviceUrl = q.defaults.geoRSSService);
            this._createLayer();
          },
          parse: function() {
            return (this._io = u({
              url: this.serviceUrl,
              content: {
                url: this.url,
                refresh: this.loaded ? !0 : void 0,
                outSR: this._outSR ? b.toJson(this._outSR.toJson()) : void 0
              },
              callbackParamName: "callback"
            }));
          },
          _initLayer: function(b) {
            this.inherited(arguments);
            this.loaded || ((this.loaded = !0), this.onLoad(this));
          }
        });
        e("extend-esri") && d.setObject("layers.GeoRSSLayer", k, g);
        return k;
      });
    },
    "esri/layers/ServiceGeneratedFeatureCollection": function() {
      define("dojo/_base/declare dojo/_base/connect dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/dom-style dojo/has ../kernel ../SpatialReference ../geometry/Extent ../geometry/webMercatorUtils ../renderers/SimpleRenderer ./layer ./FeatureLayer ../dijit/PopupTemplate".split(
        " "
      ), function(k, d, b, e, g, q, u, x, A, v, z, E, y, w, p) {
        k = k([y], {
          declaredClass: "esri.layers._ServiceGeneratedFeatureCollection",
          constructor: function(d, e) {
            this.pointSymbol = e && e.pointSymbol;
            this.polylineSymbol = e && e.polylineSymbol;
            this.polygonSymbol = e && e.polygonSymbol;
            this._outSR =
              (e && (e.outSpatialReference || e.outSR)) ||
              new A({ wkid: 4326 });
            this._options = b.mixin({}, e);
          },
          parse: function() {
            console.error("parse function has not been implemented");
          },
          getFeatureLayers: function() {
            var b = [];
            this._fLayers && (b = b.concat(this._fLayers));
            return b;
          },
          onRefresh: function() {},
          onOpacityChange: function() {},
          refresh: function() {
            this.loaded &&
              this._map &&
              !this._io &&
              this.visible &&
              this._createLayer();
          },
          _createLayer: function(d) {
            var e = this;
            this._fireUpdateStart();
            d = this.parse(d);
            d.addCallback(function(b) {
              e._io = null;
              e._initLayer(b);
            });
            d.addErrback(function(d) {
              e._io = null;
              d = b.mixin(Error(), d);
              d.message =
                "Unable to load resource: " + e.url + " " + (d.message || "");
              e._fireUpdateEnd(d);
              e.onError(d);
            });
          },
          _initLayer: function(d) {
            this.loaded && this._removeInternalLayers();
            this.name = d.name;
            this.description = d.description;
            this.snippet = d.snippet;
            this.featureInfos = d.featureInfos;
            this.fullExtent = this.initialExtent = new v(d.lookAtExtent);
            this.copyright = d.author || d.copyright;
            var g;
            (d = b.getObject("featureCollection.layers", !1, d)) &&
              0 < d.length &&
              ((this._fLayers = []),
              e.forEach(
                d,
                function(d, e) {
                  var k = b.getObject("featureSet.features", !1, d);
                  k &&
                    0 < k.length &&
                    ((g = b.mixin(
                      {
                        outFields: ["*"],
                        infoTemplate: d.popupInfo ? new p(d.popupInfo) : null,
                        editable: !1
                      },
                      this._options
                    )),
                    g.id && (g.id = g.id + "_" + e),
                    (g.webgl = !1),
                    (d.layerDefinition.capabilities = "Query,Data"),
                    (d = new w(d, g)),
                    d.geometryType && (this["_" + d.geometryType] = d),
                    this._fLayers.push(d));
                },
                this
              ),
              0 === this._fLayers.length && delete this._fLayers);
            this.items = [];
            this._esriGeometryPoint &&
              ((this.items = this.items.concat(
                this._esriGeometryPoint.graphics
              )),
              this.pointSymbol &&
                ((d = new E(this.pointSymbol)),
                this._esriGeometryPoint.setRenderer(d)));
            this._esriGeometryPolyline &&
              ((this.items = this.items.concat(
                this._esriGeometryPolyline.graphics
              )),
              this.polylineSymbol &&
                ((d = new E(this.polylineSymbol)),
                this._esriGeometryPolyline.setRenderer(d)));
            this._esriGeometryPolygon &&
              ((this.items = this.items.concat(
                this._esriGeometryPolygon.graphics
              )),
              this.polygonSymbol &&
                ((d = new E(this.polygonSymbol)),
                this._esriGeometryPolygon.setRenderer(d)));
            this._fireUpdateEnd();
            this.loaded && (this._addInternalLayers(), this.onRefresh());
          },
          _addInternalLayers: function() {
            var b = this._map;
            this._fireUpdateStart();
            var d = b.spatialReference,
              g = this._outSR,
              k;
            if (d.wkid)
              k =
                (d._isWebMercator() && g._isWebMercator()) || d.wkid === g.wkid;
            else if (d.wkt) k = d.wkt === g.wkt;
            else {
              console.log("_setMap - map has invalid spatial reference");
              return;
            }
            if (!k)
              if (d._isWebMercator() && 4326 === g.wkid)
                this._converter = z.geographicToWebMercator;
              else if (g._isWebMercator() && 4326 === d.wkid)
                this._converter = z.webMercatorToGeographic;
              else {
                console.log(
                  "_setMap - unsupported workflow. Spatial reference of the map and layer do not match, and the conversion cannot be done on the client."
                );
                return;
              }
            (d = this._fLayers) &&
              0 < d.length &&
              e.forEach(
                d,
                function(d) {
                  if (this._converter) {
                    var e = d.graphics,
                      g,
                      k,
                      p = e ? e.length : 0;
                    for (g = 0; g < p; g++)
                      (k = e[g].geometry) &&
                        e[g].setGeometry(this._converter(k));
                  }
                  b.addLayer(d);
                },
                this
              );
            this.setVisibility(this.visible);
            this._fireUpdateEnd();
          },
          _removeInternalLayers: function() {
            var b = this._map;
            b && e.forEach(this.getFeatureLayers(), b.removeLayer, b);
          },
          setScaleRange: function(b, d) {
            this.inherited(arguments);
            e.forEach(this.getFeatureLayers(), function(e) {
              e.setScaleRange(b, d);
            });
            this._options.minScale = this.minScale;
            this._options.maxScale = this.maxScale;
          },
          setOpacity: function(b) {
            this.opacity != b &&
              (e.forEach(this.getFeatureLayers(), function(d) {
                d.setOpacity(b);
              }),
              (this.opacity = this._options.opacity = b),
              this.onOpacityChange(b));
          },
          onVisibilityChange: function(b) {
            this._fireUpdateStart();
            e.forEach(this.getFeatureLayers(), function(d) {
              d.setVisibility(b);
            });
            this._fireUpdateEnd();
          },
          _setMap: function(b, d) {
            this.inherited(arguments);
            this._map = b;
            var e = (this._div = g.create("div", null, d));
            q.set(e, "position", "absolute");
            this._addInternalLayers();
            this.evaluateSuspension();
            return e;
          },
          _unsetMap: function(b, e) {
            this._io && this._io.cancel();
            d.disconnect(this._extChgHandle);
            delete this._extChgHandle;
            this._removeInternalLayers();
            var k = this._div;
            k && (e.removeChild(k), g.destroy(k));
            this._div = null;
            this.inherited(arguments);
          }
        });
        u("extend-esri") &&
          b.setObject("layers._ServiceGeneratedFeatureCollection", k, x);
        return k;
      });
    },
    "esri/dijit/analysis/ItemTypes": function() {
      define(["dojo/_base/lang", "dojo/has", "../../kernel"], function(
        k,
        d,
        b
      ) {
        var e = {
          BIGDATA: "Big Data File Share",
          CSV: "CSV",
          XLS: "Microsoft Excel",
          FS: "Feature Service",
          MS: "Map Service",
          IS: "Image Service",
          FLAYER: "Feature Layer",
          BDATAFEATURE: "featureClass",
          TABLE: "Table",
          BTABLE: "table",
          FLAYERVIEW: "FeatureLayerView",
          MVGRID: "Multi-Variable Grid",
          GPSERVICE: "Geoprocessing Service",
          RFT: "Raster function template",
          BDFSTEMPLATE: "bdfstemplate"
        };
        d("extend-esri") && k.setObject("dijit.analysis.itemTypes", e, b);
        return e;
      });
    },
    "esri/dijit/analysis/FeatureRecordSetLayer": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../../tasks/DataFile",
        "../../kernel"
      ], function(k, d, b, e, g) {
        k = k(e, {
          declaredClass: "esri.dijit.analysis.FeatureRecordSetLayer",
          constructor: function(b) {
            b && d.mixin(this, b);
          },
          toJson: function() {
            var b = {};
            this.url && (b.url = this.url);
            this.filter && (b.filter = this.filter);
            this.serviceToken && (b.serviceToken = this.serviceToken);
            this.featureSet && (b.featureSet = this.featureSet);
            this.layerDefinition && (b.layerDefinition = this.layerDefinition);
            this.time && (b.time = this.time);
            return b;
          }
        });
        b("extend-esri") &&
          d.setObject("dijit.analysis.FeatureRecordSetLayer", k, g);
        return k;
      });
    },
    "esri/dijit/analysis/PluginLayers": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/Deferred dojo/promise/all dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-style dojo/query dojo/store/Memory dojo/store/Observable dojo/Evented dojo/has ./ItemTypes ../../request ../../kernel ../../lang dgrid/OnDemandGrid dgrid/Selection ./AnalysisRegistry dojo/i18n!../../nls/jsapi".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q
      ) {
        var K = k([w], {
          infoPanelTemplate:
            '\x3cdiv\x3e\x3cdiv class\x3d"template-info-showing"\x3e\x3cdiv\x3e\x3cimg width\x3d\'16px\' height\x3d\'16px\' alt\x3d\'\' src\x3d\'${item.iconUrl}\'\x3e\x3c/div\x3e\x3ch4\x3e${item.title}\x3c/h4\x3e\x3cdiv class\x3d"template-info"\x3e\x3cp class\x3d""\x3e${item.snippet}\x3c/p\x3e${item:plugIn._showLayers}\x3cdiv id\x3d"${item.id}_details" class\x3d"quiet-scroll layer-container"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"panel-actions"\x3e${item:plugIn._addLayerToMap}\x3cbutton class\x3d"btn blue btn-main disabled" id\x3d"add-layer"\x3e${i18n.common.addLayerBtnLabel}\x3c/button\x3e\x3cbutton class\x3d"btn btn-cancel" id\x3d"close-panel"\x3e${i18n.common.close}\x3c/button\x3e\x3c/div\x3e\x3cdiv\x3e',
          geometryTypes: [
            M.GeometryTypes.Point,
            M.GeometryTypes.Point.MultiPoint,
            M.GeometryTypes.Line,
            M.GeometryTypes.Polygon
          ],
          layerTypes: [t.FLAYER, t.BDATAFEATURE, t.BTABLE, t.TABLE],
          timeTypes: [M.TimeTypes.Instant, M.TimeTypes.Interval],
          checkGeometryType: !0,
          checkLayerType: !1,
          checkTimeFilter: !1,
          fetchType: ['type:"' + t.MS + '"', 'type:"' + t.FS + '"'],
          constructor: function(b) {
            d.mixin(this, b);
            this.filters = {
              all: {},
              mycontent: { owners: this.self ? [this.self.user.username] : [] },
              esriBoundaryLayers: { owners: ["esri_boundaries"] }
            };
            this.i18n = d.mixin({}, Q.browseLayersDlg);
            d.mixin(this.i18n, Q.browseItems);
            d.mixin(this.i18n, Q.common);
            this.filterStrings = {
              all: {
                title:
                  this.self && this.self.isPortal
                    ? this.i18n.items.portalOrg
                    : this.i18n.items.organizationLabel
              },
              mycontent: { title: this.i18n.items.contentLabel },
              esriBoundaryLayers: { title: this.i18n.esriBoundaryLayers }
            };
          },
          fetchData: function() {
            this._portal = this.parent._portal;
            this._user = this._portal.getPortalUser();
            this.filters.mycontent.owner = this._user;
            this.parent.fetchType && (this.fetchType = this.parent.fetchType);
            return this._fetchItems();
          },
          _fetchItems: function() {
            return this.parent._fetchItems({ types: this.fetchType });
          },
          _fetchServiceInfo: function(b) {
            var a = new g(),
              c,
              e = { f: "json" };
            b.url
              ? (-1 !== window.location.protocol.indexOf("https:") &&
                  (b.url = b.url.replace("http:", "https:")),
                C({ url: b.url, content: e }).then(
                  function(c) {
                    a.resolve(c);
                  },
                  d.hitch(this, function(h) {
                    c = h.details && h.details.length ? h.details.shift() : "";
                    h && 403 === h.httpCode && -1 < c.indexOf("SSL Required")
                      ? (b.set("url", b.url.replace("http:", "https:")),
                        this._fetchServiceInfo(b).then(function(c) {
                          a.resolve(c);
                        }))
                      : ((b.isLoaded = !0), a.resolve({ error: h }));
                  })
                ))
              : a.resolve(null);
            return a;
          },
          _addLayerToMap: function(b) {
            return b.type === t.BIGDATA || b.type === t.CSV || b.type === t.XLS
              ? ""
              : '\x3cdiv class\x3d"esriFloatLeading esriLeadingPadding1 padding-trailer-half js-add-layer-node"\x3e\x3clabel\x3e\x3cinput name\x3d"addlayertomap" class\x3d"js-add-layer-checkbox" type\x3d"checkbox"\x3e\x3cspan class\x3d"esriLeadingPadding1"\x3e' +
                  this.i18n.common.addLayer +
                  "\x3c/span\x3e\x3c/label\x3e\x3c/div\x3e";
          },
          _showLayers: function(g) {
            if (
              g &&
              -1 !==
                b.indexOf([t.FS, t.MS, t.IS, t.BIGDATA, t.CSV, t.XLS], g.type)
            ) {
              if (g.type === t.CSV || g.type === t.XLS) g.url = g.itemUrl;
              this.plugIn._fetchServiceInfo(g).then(
                d.hitch(this, function(a) {
                  var c = [],
                    n = { f: "json" };
                  a.layers && (c = [].concat(c).concat(a.layers));
                  a.tables &&
                    0 < a.tables.length &&
                    (c = [].concat(c).concat(a.tables));
                  a.children && (c = a.children);
                  !g ||
                    (g.type !== t.CSV && g.type !== t.XLS && g.type !== t.IS) ||
                    (c = [g]);
                  if (!c.length)
                    var h = this.plugIn.i18n.noDataMessages.noItemInfo;
                  this.plugIn._createLayerGrid(
                    e.create("div", null, u.byId(g.id + "_details")),
                    h
                  );
                  b.forEach(
                    c,
                    function(a, c) {
                      g.type === t.BIGDATA
                        ? ((a.url = g.url + "/" + a.name),
                          (a.url = encodeURI(a.url)))
                        : (a.url =
                            g.type === t.CSV
                              ? g.itemUrl
                              : g.type === t.IS
                              ? g.url
                              : g.url + "/" + c);
                      -1 !== window.location.protocol.indexOf("https:") &&
                        (a.url = a.url.replace("http:", "https:"));
                      C({ url: a.url, content: n }).then(
                        d.hitch(this, function(c) {
                          a = d.mixin(a, c);
                          this.plugIn._store.put(a);
                          this.plugIn._grid.refresh();
                        }),
                        d.hitch(this, function(a) {
                          this.plugIn._grid.noDataMessage = this.plugIn.i18n.noDataMessages.noLayerInfo;
                          this.plugIn._grid.refresh();
                        })
                      );
                    },
                    this
                  );
                })
              );
            }
            return "";
          },
          _getLayerHead: function() {
            return "\x3ctr\x3e\x3cth\x3e\x3c/th\x3e\x3cth\x3eLayer Name\x3c/th\x3e\x3cth\x3e Geometry Type\x3c/th\x3e\x3c/tr\x3e";
          },
          _getLayerNode: function(b, a, c) {
            a = b.name;
            var d =
                '\x3ctr\x3e\x3ctd\x3e\x3cinput type\x3d"checkbox" class\x3d"js-layer-check" name\x3d"layers" value\x3d"' +
                a +
                ' checked"\x3e\x3c/td\x3e\x3ctd\x3e',
              h =
                "\x3c/td\x3e\x3ctd\x3e" +
                b.geometryType +
                "\x3c/td\x3e\x3c/tr\x3e";
            return b.itemUrl || b.url
              ? d +
                  '\x3ca class\x3d"' +
                  (c || "") +
                  '"\x3e' +
                  a +
                  "\x3c/a\x3e" +
                  h
              : d + a + h;
          },
          _createLayerGrid: function(e, a) {
            var c = k([H, J]);
            this._store = y(new E({ idProperty: "name" }));
            this._atleastALayerAvailable = !1;
            this._grid = new c(
              {
                store: this._store,
                query: d.hitch(this, function(a) {
                  var c = !0,
                    d = !0,
                    e = !0,
                    n = !0;
                  this.checkGeometryType &&
                    a.type !== t.IS &&
                    (e = -1 !== b.indexOf(this.geometryTypes, a.geometryType));
                  this.checkTimeFilter &&
                    (c = -1 !== b.indexOf(this.timeTypes, this.getTimeType(a)));
                  this.checkLayerType &&
                    (d = -1 !== b.indexOf(this.layerTypes, a.type));
                  "function" === typeof this.customCheckHandler &&
                    (n = this.customCheckHandler(a));
                  a = a && e && c && d && n;
                  a ||
                    (this._grid.noDataMessage = this.getNoDataMessage({
                      geomCheck: e,
                      timeCheck: c,
                      typeCheck: d,
                      customCheck: n
                    }));
                  !this._atleastALayerAvailable &&
                    a &&
                    (this._atleastALayerAvailable = a);
                  z(".js-add-layer-checkbox", this.parent.infoPanel).forEach(
                    function(a) {
                      x.set(a, "disabled", !this._atleastALayerAvailable);
                    },
                    this
                  );
                  return a;
                }),
                selectionMode: "single",
                class: "esriAnalysisLayersGrid quiet-scroll",
                noDataMessage: a || this.i18n.noValidLayerMsg,
                allowSelect: d.hitch(this, function(a) {
                  var c;
                  this.checkLayerType &&
                    a.data &&
                    (c = -1 !== b.indexOf(this.layerTypes, a.data.type));
                  c = a.data.geometryType
                    ? -1 !==
                        b.indexOf(this.geometryTypes, a.data.geometryType) ||
                      (this.checkLayerType && c)
                    : !0;
                  return a && a.data && c;
                }),
                renderRow: d.hitch(this, this._renderer)
              },
              e
            );
            this._grid.startup();
            this._grid.on(
              "dgrid-select,dgrid-deselect",
              d.hitch(this, function(a) {
                a = a.grid.selection;
                var c,
                  b = [];
                for (c in a) a[c] && b.push(this._grid.row(c).data);
                c = { selection: b };
                z(".panel-actions .btn-main", this.parent.infoPanel).forEach(
                  function(a) {
                    A.toggle(a, "disabled", 0 === b.length);
                  },
                  this
                );
                b[0] && (this._selectedLayer = b[0]);
                this.emit("layer-change", c);
              })
            );
          },
          hasTimeInfo: function(b) {
            return b && b.timeInfo;
          },
          getTimeType: function(b) {
            return b
              ? I.isDefined(b.timeInfo) &&
                I.isDefined(b.timeInfo.startTimeField) &&
                !I.isDefined(b.timeInfo.endTimeField)
                ? M.TimeTypes.Instant
                : I.isDefined(b.timeInfo) &&
                  I.isDefined(b.timeInfo.startTimeField) &&
                  I.isDefined(b.timeInfo.endTimeField)
                ? M.TimeTypes.Interval
                : I.isDefined(b.time) && I.isDefined(b.time.timeType)
                ? b.time.timeType
                : !1
              : !1;
          },
          getNoDataMessage: function(b) {
            if (b.geomCheck)
              if (b.timeCheck) {
                if (!b.typeCheck)
                  return this.i18n.noDataMessages.typeCheckFailure;
                if (!b.customCheck) return this.customCheckFailureMessage;
              } else return this.i18n.noDataMessages.timeCheckFailure;
            else return this.i18n.noDataMessages.geomCheckFailure;
          },
          getDateFields: function(d) {
            return b.filter((d && d.fields) || [], function(a) {
              return a && "esriFieldTypeDate" === a.type;
            });
          },
          _renderer: function(b) {
            b.snippet = b.snippet || "";
            var a = e.create("div"),
              c = this._getLabel(b);
            e.place(
              '\x3cdiv class\x3d"panel panel-white panel-bordered panel-compact border-bottom-clear"\x3e\x3ch5 class\x3d"trailer-0 font-size-0 word-break"\x3e\x3ca\x3e' +
                b.name +
                '\x3c/a\x3e\x3c/h5\x3e\x3cnav class\x3d"inline-block"\x3e\x3ca class\x3d"link-gray font-size--2 esriTrailingPadding1 esriTrailingMargin05"\x3e\x3cspan class\x3d"' +
                c.icon +
                '"\x3e\x3c/span\x3e' +
                c.name +
                "\x3c/a\x3e" +
                (b.timeInfo || (b.time && "instant" === b.time.timeType)
                  ? '\x3ca class\x3d"link-gray font-size--2 esriTrailingPadding1" data-action\x3d"timeSettings" data-layerid\x3d"0"\x3e\x3cspan class\x3d"esri-icon-time-clock"\x3e\x3c/span\x3e' +
                    this.i18n.timeEnabled +
                    "\x3c/a\x3e"
                  : '\x3ca class\x3d"esriTrailingPadding1"\x3e\x3c/a\x3e') +
                "\x3c/nav\x3e\x3c/div\x3e",
              a
            );
            return a;
          },
          _getLabel: function(b) {
            var a = { icon: "", name: "" },
              c = b.geometryType;
            c === M.GeometryTypes.Point || c === M.GeometryTypes.MultiPoint
              ? ((a.name = this.i18n.points), (a.icon = "esri-icon-map-pin"))
              : c === M.GeometryTypes.Polygon
              ? ((a.name = this.i18n.areas), (a.icon = "esri-icon-polygon"))
              : c === M.GeometryTypes.Line
              ? ((a.name = this.i18n.lines), (a.icon = "esri-icon-polyline"))
              : b.type === t.IS
              ? ((a.name = this.i18n.imageService),
                (a.icon = "esri-icon-layers"))
              : ((a.name = this.i18n.table), (a.icon = "esri-icon-table"));
            return a;
          }
        });
        d.mixin(K, {
          add: function(b, a) {
            b.plugIn ||
              ((a = a || {}),
              (a.parent = b),
              (a.self = b.self),
              (b.plugIn = new K(a)));
          },
          remove: function(b) {
            b.plugIn && (b.plugIn.destroy(), delete b.plugIn);
          }
        });
        p("extend-esri") && d.setObject("dijit.analysis.PluginLayers", K, N);
        return K;
      });
    },
    "esri/dijit/analysis/AnalysisRegistry": function() {
      define(["dojo/_base/lang", "dojo/has", "../../kernel"], function(
        k,
        d,
        b
      ) {
        var e = {
          Modes: {
            Raster: "raster",
            Bigdata: "bigdata",
            Standard: "standard",
            Feature: "feature"
          },
          Tools: {
            FindCentroids: "FindCentroids",
            ChooseBestFacilities: "ChooseBestFacilities"
          },
          ProcessInfoTools: {
            DescribeDataset: { Name: "DescribeDataset", Gax: !0, Std: !1 },
            GeneralizedLinearRegression: {
              Name: "GeneralizedLinearRegression",
              Gax: !0,
              Std: !1
            },
            ForestBasedClassificationAndRegression: {
              Name: "ForestBasedClassificationAndRegression",
              Gax: !0,
              Std: !1
            },
            GeographicallyWeightedRegression: {
              Name: "GeographicallyWeightedRegression",
              Gax: !0,
              Std: !1
            },
            FindSimilarLocations: {
              Name: "FindSimilarLocations",
              Gax: !0,
              Std: !0
            },
            FindHotSpots: { Name: "FindHotSpots", Gax: !1, Std: !0 },
            FindOutliers: { Name: "FindOutliers", Gax: !0, Std: !0 }
          },
          ToolCategory: {
            Gax: "GeoAnalyticsTools",
            Std: "SpatialAnalysisTools"
          },
          GeometryTypes: {
            Polygon: "esriGeometryPolygon",
            Line: "esriGeometryPolyline",
            Point: "esriGeometryPoint",
            MultiPoint: "esriGeometryMultipoint"
          },
          PseudoGeometryTypes: {
            Point: "point",
            Line: "line",
            Polygon: "polygon"
          },
          TimeTypes: { Instant: "instant", Interval: "interval" },
          FieldTypes: {
            ObjectId: "esriFieldTypeOID",
            String: "esriFieldTypeString",
            Short: "esriFieldTypeSmallInteger",
            Integer: "esriFieldTypeInteger",
            Float: "esriFieldTypeSingle",
            Double: "esriFieldTypeDouble",
            Date: "esriFieldTypeDate"
          },
          PseudoFieldTypes: {
            Number: "number",
            String: "string",
            Date: "date"
          },
          Shapes: {
            square: "SQUARE",
            hexagon: "HEXAGON",
            transverseHexagon: "TRANSVERSEHEXAGON",
            triangle: "TRIANGLE",
            diamond: "DIAMOND"
          },
          DistanceMethods: { geodesic: "Geodesic", planar: "Planar" }
        };
        d("extend-esri") &&
          k.setObject("dijit.analysis.AnalysisRegistry", e, b);
        return e;
      });
    },
    "esri/dijit/analysis/PCSList": function() {
      define(["dojo/_base/lang", "dojo/has", "../../kernel"], function(
        k,
        d,
        b
      ) {
        var e = [
          2e3,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024,
          2025,
          2026,
          2027,
          2028,
          2029,
          2030,
          2031,
          2032,
          2033,
          2034,
          2035,
          2036,
          2037,
          2038,
          2039,
          2040,
          2041,
          2042,
          2043,
          2044,
          2045,
          2056,
          2057,
          2058,
          2059,
          2060,
          2061,
          2062,
          2063,
          2064,
          2065,
          2066,
          2067,
          2068,
          2069,
          2070,
          2071,
          2072,
          2073,
          2074,
          2075,
          2076,
          2077,
          2078,
          2079,
          2080,
          2081,
          2082,
          2083,
          2084,
          2085,
          2086,
          2087,
          2088,
          2089,
          2090,
          2091,
          2092,
          2093,
          2094,
          2095,
          2096,
          2097,
          2098,
          2099,
          2100,
          2101,
          2102,
          2103,
          2104,
          2105,
          2106,
          2107,
          2108,
          2109,
          2110,
          2111,
          2112,
          2113,
          2114,
          2115,
          2116,
          2117,
          2118,
          2119,
          2120,
          2121,
          2122,
          2123,
          2124,
          2125,
          2126,
          2127,
          2128,
          2129,
          2130,
          2131,
          2132,
          2133,
          2134,
          2135,
          2136,
          2137,
          2138,
          2139,
          2140,
          2141,
          2142,
          2143,
          2144,
          2145,
          2146,
          2147,
          2148,
          2149,
          2150,
          2151,
          2152,
          2153,
          2154,
          2155,
          2157,
          2158,
          2159,
          2160,
          2161,
          2162,
          2163,
          2164,
          2165,
          2166,
          2167,
          2168,
          2169,
          2170,
          2172,
          2173,
          2174,
          2175,
          2176,
          2177,
          2178,
          2179,
          2180,
          2181,
          2182,
          2183,
          2184,
          2185,
          2186,
          2187,
          2188,
          2189,
          2190,
          2191,
          2192,
          2193,
          2195,
          2196,
          2197,
          2198,
          2200,
          2201,
          2202,
          2203,
          2204,
          2205,
          2206,
          2207,
          2208,
          2209,
          2210,
          2211,
          2212,
          2213,
          2214,
          2215,
          2216,
          2217,
          2219,
          2220,
          2222,
          2223,
          2224,
          2225,
          2226,
          2227,
          2228,
          2229,
          2230,
          2231,
          2232,
          2233,
          2234,
          2235,
          2236,
          2237,
          2238,
          2239,
          2240,
          2241,
          2242,
          2243,
          2244,
          2245,
          2246,
          2247,
          2248,
          2249,
          2250,
          2251,
          2252,
          2253,
          2254,
          2255,
          2256,
          2257,
          2258,
          2259,
          2260,
          2261,
          2262,
          2263,
          2264,
          2265,
          2266,
          2267,
          2268,
          2269,
          2270,
          2271,
          2272,
          2273,
          2274,
          2275,
          2276,
          2277,
          2278,
          2279,
          2280,
          2281,
          2282,
          2283,
          2284,
          2285,
          2286,
          2287,
          2288,
          2289,
          2290,
          2291,
          2292,
          2294,
          2295,
          2308,
          2309,
          2310,
          2311,
          2312,
          2313,
          2314,
          2315,
          2316,
          2317,
          2318,
          2319,
          2320,
          2321,
          2322,
          2323,
          2324,
          2325,
          2326,
          2327,
          2328,
          2329,
          2330,
          2331,
          2332,
          2333,
          2334,
          2335,
          2336,
          2337,
          2338,
          2339,
          2340,
          2341,
          2342,
          2343,
          2344,
          2345,
          2346,
          2347,
          2348,
          2349,
          2350,
          2351,
          2352,
          2353,
          2354,
          2355,
          2356,
          2357,
          2358,
          2359,
          2360,
          2361,
          2362,
          2363,
          2364,
          2365,
          2366,
          2367,
          2368,
          2369,
          2370,
          2371,
          2372,
          2373,
          2374,
          2375,
          2376,
          2377,
          2378,
          2379,
          2380,
          2381,
          2382,
          2383,
          2384,
          2385,
          2386,
          2387,
          2388,
          2389,
          2390,
          2391,
          2392,
          2393,
          2394,
          2395,
          2396,
          2397,
          2398,
          2399,
          2400,
          2401,
          2402,
          2403,
          2404,
          2405,
          2406,
          2407,
          2408,
          2409,
          2410,
          2411,
          2412,
          2413,
          2414,
          2415,
          2416,
          2417,
          2418,
          2419,
          2420,
          2421,
          2422,
          2423,
          2424,
          2425,
          2426,
          2427,
          2428,
          2429,
          2430,
          2431,
          2432,
          2433,
          2434,
          2435,
          2436,
          2437,
          2438,
          2439,
          2440,
          2441,
          2442,
          2443,
          2444,
          2445,
          2446,
          2447,
          2448,
          2449,
          2450,
          2451,
          2452,
          2453,
          2454,
          2455,
          2456,
          2457,
          2458,
          2459,
          2460,
          2461,
          2462,
          2463,
          2464,
          2465,
          2466,
          2467,
          2468,
          2469,
          2470,
          2471,
          2472,
          2473,
          2474,
          2475,
          2476,
          2477,
          2478,
          2479,
          2480,
          2481,
          2482,
          2483,
          2484,
          2485,
          2486,
          2487,
          2488,
          2489,
          2490,
          2491,
          2494,
          2495,
          2496,
          2497,
          2498,
          2499,
          2500,
          2501,
          2502,
          2503,
          2504,
          2505,
          2506,
          2507,
          2508,
          2509,
          2510,
          2511,
          2512,
          2513,
          2514,
          2515,
          2516,
          2517,
          2518,
          2519,
          2520,
          2521,
          2522,
          2523,
          2524,
          2525,
          2526,
          2527,
          2528,
          2529,
          2530,
          2531,
          2532,
          2533,
          2534,
          2535,
          2536,
          2537,
          2538,
          2539,
          2540,
          2541,
          2542,
          2543,
          2544,
          2545,
          2546,
          2547,
          2548,
          2549,
          2550,
          2551,
          2552,
          2553,
          2554,
          2555,
          2556,
          2557,
          2558,
          2559,
          2560,
          2561,
          2562,
          2563,
          2564,
          2565,
          2566,
          2567,
          2568,
          2569,
          2570,
          2571,
          2572,
          2573,
          2574,
          2575,
          2576,
          2577,
          2578,
          2579,
          2580,
          2581,
          2582,
          2583,
          2584,
          2585,
          2586,
          2587,
          2588,
          2589,
          2590,
          2591,
          2592,
          2593,
          2594,
          2595,
          2596,
          2597,
          2598,
          2599,
          2600,
          2601,
          2602,
          2603,
          2604,
          2605,
          2606,
          2607,
          2608,
          2609,
          2610,
          2611,
          2612,
          2613,
          2614,
          2615,
          2616,
          2617,
          2618,
          2619,
          2620,
          2621,
          2622,
          2623,
          2624,
          2625,
          2626,
          2627,
          2628,
          2629,
          2630,
          2631,
          2632,
          2633,
          2634,
          2635,
          2636,
          2637,
          2638,
          2639,
          2640,
          2641,
          2642,
          2643,
          2644,
          2645,
          2646,
          2647,
          2648,
          2649,
          2650,
          2651,
          2652,
          2653,
          2654,
          2655,
          2656,
          2657,
          2658,
          2659,
          2660,
          2661,
          2662,
          2663,
          2664,
          2665,
          2666,
          2667,
          2668,
          2669,
          2670,
          2671,
          2672,
          2673,
          2674,
          2675,
          2676,
          2677,
          2678,
          2679,
          2680,
          2681,
          2682,
          2683,
          2684,
          2685,
          2686,
          2687,
          2688,
          2689,
          2690,
          2691,
          2692,
          2693,
          2694,
          2695,
          2696,
          2697,
          2698,
          2699,
          2700,
          2701,
          2702,
          2703,
          2704,
          2705,
          2706,
          2707,
          2708,
          2709,
          2710,
          2711,
          2712,
          2713,
          2714,
          2715,
          2716,
          2717,
          2718,
          2719,
          2720,
          2721,
          2722,
          2723,
          2724,
          2725,
          2726,
          2727,
          2728,
          2729,
          2730,
          2731,
          2732,
          2733,
          2734,
          2735,
          2736,
          2737,
          2738,
          2739,
          2740,
          2741,
          2742,
          2743,
          2744,
          2745,
          2746,
          2747,
          2748,
          2749,
          2750,
          2751,
          2752,
          2753,
          2754,
          2755,
          2756,
          2757,
          2758,
          2759,
          2760,
          2761,
          2762,
          2763,
          2764,
          2765,
          2766,
          2767,
          2768,
          2769,
          2770,
          2771,
          2772,
          2773,
          2774,
          2775,
          2776,
          2777,
          2778,
          2779,
          2780,
          2781,
          2782,
          2783,
          2784,
          2785,
          2786,
          2787,
          2788,
          2789,
          2790,
          2791,
          2792,
          2793,
          2794,
          2795,
          2796,
          2797,
          2798,
          2799,
          2800,
          2801,
          2802,
          2803,
          2804,
          2805,
          2806,
          2807,
          2808,
          2809,
          2810,
          2811,
          2812,
          2813,
          2814,
          2815,
          2816,
          2817,
          2818,
          2819,
          2820,
          2821,
          2822,
          2823,
          2824,
          2825,
          2826,
          2827,
          2828,
          2829,
          2830,
          2831,
          2832,
          2833,
          2834,
          2835,
          2836,
          2837,
          2838,
          2839,
          2840,
          2841,
          2842,
          2843,
          2844,
          2845,
          2846,
          2847,
          2848,
          2849,
          2850,
          2851,
          2852,
          2853,
          2854,
          2855,
          2856,
          2857,
          2858,
          2859,
          2860,
          2861,
          2862,
          2863,
          2864,
          2865,
          2866,
          2867,
          2868,
          2869,
          2870,
          2871,
          2872,
          2873,
          2874,
          2875,
          2876,
          2877,
          2878,
          2879,
          2880,
          2881,
          2882,
          2883,
          2884,
          2885,
          2886,
          2887,
          2888,
          2891,
          2892,
          2893,
          2894,
          2895,
          2896,
          2897,
          2898,
          2899,
          2900,
          2901,
          2902,
          2903,
          2904,
          2905,
          2906,
          2907,
          2908,
          2909,
          2910,
          2911,
          2912,
          2913,
          2914,
          2915,
          2916,
          2917,
          2918,
          2919,
          2920,
          2921,
          2922,
          2923,
          2924,
          2925,
          2926,
          2927,
          2928,
          2929,
          2930,
          2931,
          2932,
          2933,
          2934,
          2935,
          2936,
          2937,
          2938,
          2939,
          2940,
          2941,
          2942,
          2943,
          2944,
          2945,
          2946,
          2947,
          2948,
          2949,
          2950,
          2951,
          2952,
          2953,
          2954,
          2955,
          2956,
          2957,
          2958,
          2959,
          2960,
          2961,
          2962,
          2964,
          2965,
          2966,
          2967,
          2968,
          2969,
          2970,
          2971,
          2972,
          2973,
          2975,
          2976,
          2977,
          2978,
          2979,
          2980,
          2981,
          2982,
          2983,
          2984,
          2985,
          2986,
          2987,
          2988,
          2989,
          2990,
          2991,
          2992,
          2993,
          2994,
          2995,
          2996,
          2997,
          2998,
          2999,
          3e3,
          3001,
          3002,
          3003,
          3004,
          3005,
          3006,
          3007,
          3008,
          3009,
          3010,
          3011,
          3012,
          3013,
          3014,
          3015,
          3016,
          3017,
          3018,
          3019,
          3020,
          3021,
          3022,
          3023,
          3024,
          3025,
          3026,
          3027,
          3028,
          3029,
          3030,
          3031,
          3032,
          3033,
          3034,
          3035,
          3036,
          3037,
          3038,
          3039,
          3040,
          3041,
          3042,
          3043,
          3044,
          3045,
          3046,
          3047,
          3048,
          3049,
          3050,
          3051,
          3054,
          3055,
          3056,
          3057,
          3058,
          3059,
          3060,
          3061,
          3062,
          3063,
          3064,
          3065,
          3066,
          3067,
          3068,
          3069,
          3070,
          3071,
          3072,
          3073,
          3074,
          3075,
          3076,
          3077,
          3078,
          3079,
          3080,
          3081,
          3082,
          3083,
          3084,
          3085,
          3086,
          3087,
          3088,
          3089,
          3090,
          3091,
          3092,
          3093,
          3094,
          3095,
          3096,
          3097,
          3098,
          3099,
          3100,
          3101,
          3102,
          3106,
          3107,
          3108,
          3109,
          3110,
          3111,
          3112,
          3113,
          3114,
          3115,
          3116,
          3117,
          3118,
          3119,
          3120,
          3121,
          3122,
          3123,
          3124,
          3125,
          3126,
          3127,
          3128,
          3129,
          3130,
          3131,
          3132,
          3133,
          3134,
          3135,
          3136,
          3137,
          3138,
          3141,
          3142,
          3146,
          3147,
          3148,
          3149,
          3150,
          3151,
          3153,
          3154,
          3155,
          3156,
          3157,
          3158,
          3159,
          3160,
          3161,
          3162,
          3163,
          3164,
          3165,
          3166,
          3167,
          3168,
          3169,
          3170,
          3171,
          3172,
          3174,
          3175,
          3176,
          3177,
          3178,
          3179,
          3180,
          3181,
          3182,
          3183,
          3184,
          3185,
          3186,
          3187,
          3188,
          3189,
          3190,
          3191,
          3192,
          3193,
          3194,
          3195,
          3196,
          3197,
          3198,
          3199,
          3200,
          3201,
          3202,
          3203,
          3294,
          3295,
          3296,
          3297,
          3298,
          3299,
          3300,
          3301,
          3302,
          3303,
          3304,
          3305,
          3306,
          3307,
          3308,
          3309,
          3310,
          3311,
          3312,
          3313,
          3314,
          3315,
          3316,
          3317,
          3318,
          3319,
          3320,
          3321,
          3322,
          3323,
          3324,
          3325,
          3326,
          3327,
          3328,
          3329,
          3330,
          3331,
          3332,
          3333,
          3334,
          3335,
          3336,
          3337,
          3338,
          3339,
          3340,
          3341,
          3342,
          3343,
          3344,
          3345,
          3346,
          3347,
          3348,
          3349,
          3350,
          3351,
          3352,
          3353,
          3354,
          3355,
          3356,
          3357,
          3358,
          3359,
          3360,
          3361,
          3362,
          3363,
          3364,
          3365,
          3366,
          3367,
          3368,
          3369,
          3370,
          3371,
          3372,
          3373,
          3374,
          3375,
          3376,
          3377,
          3378,
          3379,
          3380,
          3381,
          3382,
          3383,
          3384,
          3385,
          3386,
          3387,
          3388,
          3389,
          3390,
          3391,
          3392,
          3393,
          3394,
          3395,
          3396,
          3397,
          3398,
          3399,
          3400,
          3401,
          3402,
          3403,
          3404,
          3405,
          3406,
          3407,
          3408,
          3409,
          3410,
          3411,
          3412,
          3413,
          3414,
          3415,
          3416,
          3417,
          3418,
          3419,
          3420,
          3421,
          3422,
          3423,
          3424,
          3425,
          3426,
          3427,
          3428,
          3429,
          3430,
          3431,
          3432,
          3433,
          3434,
          3435,
          3436,
          3437,
          3438,
          3439,
          3440,
          3441,
          3442,
          3443,
          3444,
          3445,
          3446,
          3447,
          3448,
          3449,
          3450,
          3451,
          3452,
          3453,
          3454,
          3455,
          3456,
          3457,
          3458,
          3459,
          3460,
          3461,
          3462,
          3463,
          3464,
          3465,
          3466,
          3467,
          3468,
          3469,
          3470,
          3471,
          3472,
          3473,
          3474,
          3475,
          3476,
          3477,
          3478,
          3479,
          3480,
          3481,
          3482,
          3483,
          3484,
          3485,
          3486,
          3487,
          3488,
          3489,
          3490,
          3491,
          3492,
          3493,
          3494,
          3495,
          3496,
          3497,
          3498,
          3499,
          3500,
          3501,
          3502,
          3503,
          3504,
          3505,
          3506,
          3507,
          3508,
          3509,
          3510,
          3511,
          3512,
          3513,
          3514,
          3515,
          3516,
          3517,
          3518,
          3519,
          3520,
          3521,
          3522,
          3523,
          3524,
          3525,
          3526,
          3527,
          3528,
          3529,
          3530,
          3531,
          3532,
          3533,
          3534,
          3535,
          3536,
          3537,
          3538,
          3539,
          3540,
          3541,
          3542,
          3543,
          3544,
          3545,
          3546,
          3547,
          3548,
          3549,
          3550,
          3551,
          3552,
          3553,
          3554,
          3555,
          3556,
          3557,
          3558,
          3559,
          3560,
          3561,
          3562,
          3563,
          3564,
          3565,
          3566,
          3567,
          3568,
          3569,
          3570,
          3571,
          3572,
          3573,
          3574,
          3575,
          3576,
          3577,
          3578,
          3579,
          3580,
          3581,
          3582,
          3583,
          3584,
          3585,
          3586,
          3587,
          3588,
          3589,
          3590,
          3591,
          3592,
          3593,
          3594,
          3595,
          3596,
          3597,
          3598,
          3599,
          3600,
          3601,
          3602,
          3603,
          3604,
          3605,
          3606,
          3607,
          3608,
          3609,
          3610,
          3611,
          3612,
          3613,
          3614,
          3615,
          3616,
          3617,
          3618,
          3619,
          3620,
          3621,
          3622,
          3623,
          3624,
          3625,
          3626,
          3627,
          3628,
          3629,
          3630,
          3631,
          3632,
          3633,
          3634,
          3635,
          3636,
          3637,
          3638,
          3639,
          3640,
          3641,
          3642,
          3643,
          3644,
          3645,
          3646,
          3647,
          3648,
          3649,
          3650,
          3651,
          3652,
          3653,
          3654,
          3655,
          3656,
          3657,
          3658,
          3659,
          3660,
          3661,
          3662,
          3663,
          3664,
          3665,
          3666,
          3667,
          3668,
          3669,
          3670,
          3671,
          3672,
          3673,
          3674,
          3675,
          3676,
          3677,
          3678,
          3679,
          3680,
          3681,
          3682,
          3683,
          3684,
          3685,
          3686,
          3687,
          3688,
          3689,
          3690,
          3691,
          3692,
          3693,
          3694,
          3695,
          3696,
          3697,
          3698,
          3699,
          3700,
          3701,
          3702,
          3703,
          3704,
          3705,
          3706,
          3707,
          3708,
          3709,
          3710,
          3711,
          3712,
          3713,
          3714,
          3715,
          3716,
          3717,
          3718,
          3719,
          3720,
          3721,
          3722,
          3723,
          3724,
          3725,
          3726,
          3727,
          3728,
          3729,
          3730,
          3731,
          3732,
          3733,
          3734,
          3735,
          3736,
          3737,
          3738,
          3739,
          3740,
          3741,
          3742,
          3743,
          3744,
          3745,
          3746,
          3747,
          3748,
          3749,
          3750,
          3751,
          3753,
          3754,
          3755,
          3756,
          3757,
          3758,
          3759,
          3760,
          3761,
          3762,
          3763,
          3764,
          3765,
          3766,
          3767,
          3768,
          3769,
          3770,
          3771,
          3772,
          3773,
          3775,
          3776,
          3777,
          3779,
          3780,
          3781,
          3783,
          3784,
          3785,
          3788,
          3789,
          3790,
          3791,
          3793,
          3794,
          3797,
          3798,
          3799,
          3800,
          3801,
          3802,
          3812,
          3814,
          3815,
          3816,
          3825,
          3826,
          3827,
          3828,
          3829,
          3832,
          3833,
          3834,
          3835,
          3836,
          3837,
          3838,
          3839,
          3840,
          3841,
          3844,
          3845,
          3846,
          3847,
          3848,
          3849,
          3850,
          3851,
          3852,
          3854,
          3857,
          3873,
          3874,
          3875,
          3876,
          3877,
          3878,
          3879,
          3880,
          3881,
          3882,
          3883,
          3884,
          3885,
          3890,
          3891,
          3892,
          3893,
          3907,
          3908,
          3909,
          3910,
          3911,
          3912,
          3920,
          3942,
          3943,
          3944,
          3945,
          3946,
          3947,
          3948,
          3949,
          3950,
          3968,
          3969,
          3970,
          3973,
          3974,
          3975,
          3976,
          3978,
          3979,
          3986,
          3987,
          3988,
          3989,
          3991,
          3992,
          3994,
          3995,
          3996,
          3997,
          4026,
          4037,
          4038,
          4048,
          4049,
          4050,
          4051,
          4056,
          4057,
          4058,
          4059,
          4060,
          4061,
          4062,
          4063,
          4071,
          4082,
          4083,
          4087,
          4088,
          4093,
          4094,
          4095,
          4096,
          4217,
          4390,
          4391,
          4392,
          4393,
          4394,
          4395,
          4396,
          4397,
          4398,
          4399,
          4400,
          4401,
          4402,
          4403,
          4404,
          4405,
          4406,
          4407,
          4408,
          4409,
          4410,
          4411,
          4412,
          4413,
          4414,
          4415,
          4417,
          4418,
          4419,
          4420,
          4421,
          4422,
          4423,
          4424,
          4425,
          4426,
          4427,
          4428,
          4429,
          4430,
          4431,
          4432,
          4433,
          4434,
          4437,
          4438,
          4439,
          4455,
          4456,
          4457,
          4462,
          4467,
          4471,
          4474,
          4484,
          4485,
          4486,
          4487,
          4488,
          4489,
          4491,
          4492,
          4493,
          4494,
          4495,
          4496,
          4497,
          4498,
          4499,
          4500,
          4501,
          4502,
          4503,
          4504,
          4505,
          4506,
          4507,
          4508,
          4509,
          4510,
          4511,
          4512,
          4513,
          4514,
          4515,
          4516,
          4517,
          4518,
          4519,
          4520,
          4521,
          4522,
          4523,
          4524,
          4525,
          4526,
          4527,
          4528,
          4529,
          4530,
          4531,
          4532,
          4533,
          4534,
          4535,
          4536,
          4537,
          4538,
          4539,
          4540,
          4541,
          4542,
          4543,
          4544,
          4545,
          4546,
          4547,
          4548,
          4549,
          4550,
          4551,
          4552,
          4553,
          4554,
          4559,
          4568,
          4569,
          4570,
          4571,
          4572,
          4573,
          4574,
          4575,
          4576,
          4577,
          4578,
          4579,
          4580,
          4581,
          4582,
          4583,
          4584,
          4585,
          4586,
          4587,
          4588,
          4589,
          4647,
          4652,
          4653,
          4654,
          4655,
          4656,
          4766,
          4767,
          4768,
          4769,
          4770,
          4771,
          4772,
          4773,
          4774,
          4775,
          4776,
          4777,
          4778,
          4779,
          4780,
          4781,
          4782,
          4783,
          4784,
          4785,
          4786,
          4787,
          4788,
          4789,
          4790,
          4791,
          4792,
          4793,
          4794,
          4795,
          4796,
          4797,
          4798,
          4799,
          4800,
          4822,
          4826,
          4839,
          5014,
          5015,
          5016,
          5018,
          5048,
          5069,
          5070,
          5071,
          5072,
          5105,
          5106,
          5107,
          5108,
          5109,
          5110,
          5111,
          5112,
          5113,
          5114,
          5115,
          5116,
          5117,
          5118,
          5119,
          5120,
          5121,
          5122,
          5123,
          5124,
          5125,
          5126,
          5127,
          5128,
          5129,
          5130,
          5167,
          5168,
          5173,
          5174,
          5175,
          5176,
          5177,
          5178,
          5179,
          5180,
          5181,
          5182,
          5183,
          5184,
          5185,
          5186,
          5187,
          5188,
          5221,
          5223,
          5234,
          5235,
          5243,
          5247,
          5253,
          5254,
          5255,
          5256,
          5257,
          5258,
          5259,
          5266,
          5269,
          5270,
          5271,
          5272,
          5273,
          5274,
          5275,
          5292,
          5293,
          5294,
          5295,
          5296,
          5297,
          5298,
          5299,
          5300,
          5301,
          5302,
          5303,
          5304,
          5305,
          5306,
          5307,
          5308,
          5309,
          5310,
          5311,
          5316,
          5320,
          5321,
          5325,
          5329,
          5330,
          5331,
          5337,
          5343,
          5344,
          5345,
          5346,
          5347,
          5348,
          5349,
          5355,
          5356,
          5357,
          5361,
          5362,
          5367,
          5382,
          5383,
          5387,
          5388,
          5389,
          5396,
          5456,
          5457,
          5459,
          5460,
          5461,
          5462,
          5463,
          5469,
          5472,
          5479,
          5480,
          5481,
          5482,
          5490,
          5513,
          5514,
          5518,
          5519,
          5520,
          5523,
          5530,
          5531,
          5532,
          5533,
          5534,
          5535,
          5536,
          5537,
          5538,
          5539,
          5550,
          5551,
          5552,
          5559,
          5562,
          5563,
          5564,
          5565,
          5566,
          5567,
          5568,
          5569,
          5570,
          5571,
          5572,
          5573,
          5574,
          5575,
          5576,
          5577,
          5578,
          5579,
          5580,
          5581,
          5582,
          5583,
          5588,
          5589,
          5596,
          5623,
          5624,
          5625,
          5627,
          5629,
          5631,
          5632,
          5633,
          5634,
          5635,
          5636,
          5637,
          5638,
          5639,
          5641,
          5643,
          5644,
          5646,
          5649,
          5650,
          5651,
          5652,
          5653,
          5654,
          5655,
          5659,
          5663,
          5664,
          5665,
          5666,
          5667,
          5668,
          5669,
          5670,
          5671,
          5672,
          5673,
          5674,
          5675,
          5676,
          5677,
          5678,
          5679,
          5680,
          5682,
          5683,
          5684,
          5685,
          5700,
          5825,
          5836,
          5837,
          5839,
          5842,
          5844,
          5858,
          5875,
          5876,
          5877,
          5879,
          5880,
          5887,
          5890,
          5921,
          5922,
          5923,
          5924,
          5925,
          5926,
          5927,
          5928,
          5929,
          5930,
          5931,
          5932,
          5933,
          5934,
          5935,
          5936,
          5937,
          5938,
          5939,
          5940,
          6050,
          6051,
          6052,
          6053,
          6054,
          6055,
          6056,
          6057,
          6058,
          6059,
          6060,
          6061,
          6062,
          6063,
          6064,
          6065,
          6066,
          6067,
          6068,
          6069,
          6070,
          6071,
          6072,
          6073,
          6074,
          6075,
          6076,
          6077,
          6078,
          6079,
          6080,
          6081,
          6082,
          6083,
          6084,
          6085,
          6086,
          6087,
          6088,
          6089,
          6090,
          6091,
          6092,
          6093,
          6094,
          6095,
          6096,
          6097,
          6098,
          6099,
          6100,
          6101,
          6102,
          6103,
          6104,
          6105,
          6106,
          6107,
          6108,
          6109,
          6110,
          6111,
          6112,
          6113,
          6114,
          6115,
          6116,
          6117,
          6118,
          6119,
          6120,
          6121,
          6122,
          6123,
          6124,
          6125,
          6128,
          6129,
          6141,
          6204,
          6210,
          6211,
          6244,
          6245,
          6246,
          6247,
          6248,
          6249,
          6250,
          6251,
          6252,
          6253,
          6254,
          6255,
          6256,
          6257,
          6258,
          6259,
          6260,
          6261,
          6262,
          6263,
          6264,
          6265,
          6266,
          6267,
          6268,
          6269,
          6270,
          6271,
          6272,
          6273,
          6274,
          6275,
          6307,
          6312,
          6316,
          6328,
          6329,
          6330,
          6331,
          6332,
          6333,
          6334,
          6335,
          6336,
          6337,
          6338,
          6339,
          6340,
          6341,
          6342,
          6343,
          6344,
          6345,
          6346,
          6347,
          6348,
          6350,
          6351,
          6352,
          6353,
          6354,
          6355,
          6356,
          6362,
          6366,
          6367,
          6368,
          6369,
          6370,
          6371,
          6372,
          6381,
          6382,
          6383,
          6384,
          6385,
          6386,
          6387,
          6391,
          6393,
          6394,
          6395,
          6396,
          6397,
          6398,
          6399,
          6400,
          6401,
          6402,
          6403,
          6404,
          6405,
          6406,
          6407,
          6408,
          6409,
          6410,
          6411,
          6412,
          6413,
          6414,
          6415,
          6416,
          6417,
          6418,
          6419,
          6420,
          6421,
          6422,
          6423,
          6424,
          6425,
          6426,
          6427,
          6428,
          6429,
          6430,
          6431,
          6432,
          6433,
          6434,
          6435,
          6436,
          6437,
          6438,
          6439,
          6440,
          6441,
          6442,
          6443,
          6444,
          6445,
          6446,
          6447,
          6448,
          6449,
          6450,
          6451,
          6452,
          6453,
          6454,
          6455,
          6456,
          6457,
          6458,
          6459,
          6460,
          6461,
          6462,
          6463,
          6464,
          6465,
          6466,
          6467,
          6468,
          6469,
          6470,
          6471,
          6472,
          6473,
          6474,
          6475,
          6476,
          6477,
          6478,
          6479,
          6480,
          6481,
          6482,
          6483,
          6484,
          6485,
          6486,
          6487,
          6488,
          6489,
          6490,
          6491,
          6492,
          6493,
          6494,
          6495,
          6496,
          6497,
          6498,
          6499,
          6500,
          6501,
          6502,
          6503,
          6504,
          6505,
          6506,
          6507,
          6508,
          6509,
          6510,
          6511,
          6512,
          6513,
          6514,
          6515,
          6516,
          6518,
          6519,
          6520,
          6521,
          6522,
          6523,
          6524,
          6525,
          6526,
          6527,
          6528,
          6529,
          6530,
          6531,
          6532,
          6533,
          6534,
          6535,
          6536,
          6537,
          6538,
          6539,
          6540,
          6541,
          6542,
          6543,
          6544,
          6545,
          6546,
          6547,
          6548,
          6549,
          6550,
          6551,
          6552,
          6553,
          6554,
          6555,
          6556,
          6557,
          6558,
          6559,
          6560,
          6561,
          6562,
          6563,
          6564,
          6565,
          6566,
          6567,
          6568,
          6569,
          6570,
          6571,
          6572,
          6573,
          6574,
          6575,
          6576,
          6577,
          6578,
          6579,
          6580,
          6581,
          6582,
          6583,
          6584,
          6585,
          6586,
          6587,
          6588,
          6589,
          6590,
          6591,
          6592,
          6593,
          6594,
          6595,
          6596,
          6597,
          6598,
          6599,
          6600,
          6601,
          6602,
          6603,
          6605,
          6606,
          6607,
          6608,
          6609,
          6610,
          6611,
          6612,
          6613,
          6614,
          6615,
          6616,
          6617,
          6618,
          6619,
          6620,
          6621,
          6622,
          6623,
          6624,
          6625,
          6626,
          6627,
          6628,
          6629,
          6630,
          6631,
          6632,
          6633,
          6634,
          6635,
          6636,
          6637,
          6646,
          6669,
          6670,
          6671,
          6672,
          6673,
          6674,
          6675,
          6676,
          6677,
          6678,
          6679,
          6680,
          6681,
          6682,
          6683,
          6684,
          6685,
          6686,
          6687,
          6688,
          6689,
          6690,
          6691,
          6692,
          6703,
          6707,
          6708,
          6709,
          6720,
          6721,
          6722,
          6723,
          6732,
          6733,
          6734,
          6735,
          6736,
          6737,
          6738,
          6784,
          6785,
          6786,
          6787,
          6788,
          6789,
          6790,
          6791,
          6792,
          6793,
          6794,
          6795,
          6796,
          6797,
          6798,
          6799,
          6800,
          6801,
          6802,
          6803,
          6804,
          6805,
          6806,
          6807,
          6808,
          6809,
          6810,
          6811,
          6812,
          6813,
          6814,
          6815,
          6816,
          6817,
          6818,
          6819,
          6820,
          6821,
          6822,
          6823,
          6824,
          6825,
          6826,
          6827,
          6828,
          6829,
          6830,
          6831,
          6832,
          6833,
          6834,
          6835,
          6836,
          6837,
          6838,
          6839,
          6840,
          6841,
          6842,
          6843,
          6844,
          6845,
          6846,
          6847,
          6848,
          6849,
          6850,
          6851,
          6852,
          6853,
          6854,
          6855,
          6856,
          6857,
          6858,
          6859,
          6860,
          6861,
          6862,
          6863,
          6867,
          6868,
          6870,
          6875,
          6876,
          6879,
          6880,
          6884,
          6885,
          6886,
          6887,
          6915,
          6922,
          6923,
          6924,
          6925,
          6931,
          6932,
          6933,
          6956,
          6957,
          6958,
          6959,
          6962,
          6984,
          6991,
          7005,
          7006,
          7007,
          7057,
          7058,
          7059,
          7060,
          7061,
          7062,
          7063,
          7064,
          7065,
          7066,
          7067,
          7068,
          7069,
          7070,
          7074,
          7075,
          7076,
          7077,
          7078,
          7079,
          7080,
          7081,
          7082,
          7109,
          7110,
          7111,
          7112,
          7113,
          7114,
          7115,
          7116,
          7117,
          7118,
          7119,
          7120,
          7121,
          7122,
          7123,
          7124,
          7125,
          7126,
          7127,
          7128,
          7131,
          7132,
          7257,
          7258,
          7259,
          7260,
          7261,
          7262,
          7263,
          7264,
          7265,
          7266,
          7267,
          7268,
          7269,
          7270,
          7271,
          7272,
          7273,
          7274,
          7275,
          7276,
          7277,
          7278,
          7279,
          7280,
          7281,
          7282,
          7283,
          7284,
          7285,
          7286,
          7287,
          7288,
          7289,
          7290,
          7291,
          7292,
          7293,
          7294,
          7295,
          7296,
          7297,
          7298,
          7299,
          7300,
          7301,
          7302,
          7303,
          7304,
          7305,
          7306,
          7307,
          7308,
          7309,
          7310,
          7311,
          7312,
          7313,
          7314,
          7315,
          7316,
          7317,
          7318,
          7319,
          7320,
          7321,
          7322,
          7323,
          7324,
          7325,
          7326,
          7327,
          7328,
          7329,
          7330,
          7331,
          7332,
          7333,
          7334,
          7335,
          7336,
          7337,
          7338,
          7339,
          7340,
          7341,
          7342,
          7343,
          7344,
          7345,
          7346,
          7347,
          7348,
          7349,
          7350,
          7351,
          7352,
          7353,
          7354,
          7355,
          7356,
          7357,
          7358,
          7359,
          7360,
          7361,
          7362,
          7363,
          7364,
          7365,
          7366,
          7367,
          7368,
          7369,
          7370,
          7374,
          7375,
          7376,
          7528,
          7529,
          7530,
          7531,
          7532,
          7533,
          7534,
          7535,
          7536,
          7537,
          7538,
          7539,
          7540,
          7541,
          7542,
          7543,
          7544,
          7545,
          7546,
          7547,
          7548,
          7549,
          7550,
          7551,
          7552,
          7553,
          7554,
          7555,
          7556,
          7557,
          7558,
          7559,
          7560,
          7561,
          7562,
          7563,
          7564,
          7565,
          7566,
          7567,
          7568,
          7569,
          7570,
          7571,
          7572,
          7573,
          7574,
          7575,
          7576,
          7577,
          7578,
          7579,
          7580,
          7581,
          7582,
          7583,
          7584,
          7585,
          7586,
          7587,
          7588,
          7589,
          7590,
          7591,
          7592,
          7593,
          7594,
          7595,
          7596,
          7597,
          7598,
          7599,
          7600,
          7601,
          7602,
          7603,
          7604,
          7605,
          7606,
          7607,
          7608,
          7609,
          7610,
          7611,
          7612,
          7613,
          7614,
          7615,
          7616,
          7617,
          7618,
          7619,
          7620,
          7621,
          7622,
          7623,
          7624,
          7625,
          7626,
          7627,
          7628,
          7629,
          7630,
          7631,
          7632,
          7633,
          7634,
          7635,
          7636,
          7637,
          7638,
          7639,
          7640,
          7641,
          7642,
          7643,
          7644,
          7645,
          7845,
          7846,
          7847,
          7848,
          7849,
          7850,
          7851,
          7852,
          7853,
          7854,
          7855,
          7856,
          7857,
          7858,
          7859,
          20002,
          20003,
          20004,
          20005,
          20006,
          20007,
          20008,
          20009,
          20010,
          20011,
          20012,
          20013,
          20014,
          20015,
          20016,
          20017,
          20018,
          20019,
          20020,
          20021,
          20022,
          20023,
          20024,
          20025,
          20026,
          20027,
          20028,
          20029,
          20030,
          20031,
          20032,
          20062,
          20063,
          20064,
          20065,
          20066,
          20067,
          20068,
          20069,
          20070,
          20071,
          20072,
          20073,
          20074,
          20075,
          20076,
          20077,
          20078,
          20079,
          20080,
          20081,
          20082,
          20083,
          20084,
          20085,
          20086,
          20087,
          20088,
          20089,
          20090,
          20091,
          20092,
          20135,
          20136,
          20137,
          20138,
          20248,
          20249,
          20250,
          20251,
          20252,
          20253,
          20254,
          20255,
          20256,
          20257,
          20258,
          20348,
          20349,
          20350,
          20351,
          20352,
          20353,
          20354,
          20355,
          20356,
          20357,
          20358,
          20436,
          20437,
          20438,
          20439,
          20440,
          20499,
          20538,
          20539,
          20790,
          20791,
          20822,
          20823,
          20824,
          20934,
          20935,
          20936,
          21035,
          21036,
          21037,
          21095,
          21096,
          21097,
          21148,
          21149,
          21150,
          21291,
          21292,
          21413,
          21414,
          21415,
          21416,
          21417,
          21418,
          21419,
          21420,
          21421,
          21422,
          21423,
          21473,
          21474,
          21475,
          21476,
          21477,
          21478,
          21479,
          21480,
          21481,
          21482,
          21483,
          21500,
          21780,
          21781,
          21782,
          21817,
          21818,
          21891,
          21892,
          21893,
          21894,
          21896,
          21897,
          21898,
          21899,
          22032,
          22033,
          22091,
          22092,
          22171,
          22172,
          22173,
          22174,
          22175,
          22176,
          22177,
          22181,
          22182,
          22183,
          22184,
          22185,
          22186,
          22187,
          22191,
          22192,
          22193,
          22194,
          22195,
          22196,
          22197,
          22234,
          22235,
          22236,
          22332,
          22391,
          22392,
          22521,
          22522,
          22523,
          22524,
          22525,
          22700,
          22770,
          22780,
          22832,
          22991,
          22992,
          22993,
          22994,
          23028,
          23029,
          23030,
          23031,
          23032,
          23033,
          23034,
          23035,
          23036,
          23037,
          23038,
          23090,
          23095,
          23239,
          23240,
          23433,
          23700,
          23830,
          23831,
          23832,
          23833,
          23834,
          23835,
          23836,
          23837,
          23838,
          23839,
          23840,
          23841,
          23842,
          23843,
          23844,
          23845,
          23846,
          23847,
          23848,
          23849,
          23850,
          23851,
          23852,
          23853,
          23866,
          23867,
          23868,
          23869,
          23870,
          23871,
          23872,
          23877,
          23878,
          23879,
          23880,
          23881,
          23882,
          23883,
          23884,
          23886,
          23887,
          23888,
          23889,
          23890,
          23891,
          23892,
          23893,
          23894,
          23946,
          23947,
          23948,
          24047,
          24048,
          24100,
          24200,
          24305,
          24306,
          24311,
          24312,
          24313,
          24342,
          24343,
          24344,
          24345,
          24346,
          24347,
          24370,
          24371,
          24372,
          24373,
          24374,
          24375,
          24376,
          24377,
          24378,
          24379,
          24380,
          24381,
          24382,
          24383,
          24500,
          24547,
          24548,
          24571,
          24600,
          24718,
          24719,
          24720,
          24721,
          24817,
          24818,
          24819,
          24820,
          24821,
          24877,
          24878,
          24879,
          24880,
          24881,
          24882,
          24891,
          24892,
          24893,
          25e3,
          25231,
          25391,
          25392,
          25393,
          25394,
          25395,
          25828,
          25829,
          25830,
          25831,
          25832,
          25833,
          25834,
          25835,
          25836,
          25837,
          25838,
          25884,
          25932,
          26191,
          26192,
          26193,
          26194,
          26195,
          26237,
          26331,
          26332,
          26391,
          26392,
          26393,
          26432,
          26591,
          26592,
          26632,
          26692,
          26701,
          26702,
          26703,
          26704,
          26705,
          26706,
          26707,
          26708,
          26709,
          26710,
          26711,
          26712,
          26713,
          26714,
          26715,
          26716,
          26717,
          26718,
          26719,
          26720,
          26721,
          26722,
          26729,
          26730,
          26731,
          26732,
          26733,
          26734,
          26735,
          26736,
          26737,
          26738,
          26739,
          26740,
          26741,
          26742,
          26743,
          26744,
          26745,
          26746,
          26747,
          26748,
          26749,
          26750,
          26751,
          26752,
          26753,
          26754,
          26755,
          26756,
          26757,
          26758,
          26759,
          26760,
          26761,
          26762,
          26763,
          26764,
          26765,
          26766,
          26767,
          26768,
          26769,
          26770,
          26771,
          26772,
          26773,
          26774,
          26775,
          26776,
          26777,
          26778,
          26779,
          26780,
          26781,
          26782,
          26783,
          26784,
          26785,
          26786,
          26787,
          26788,
          26789,
          26790,
          26791,
          26792,
          26793,
          26794,
          26795,
          26796,
          26797,
          26798,
          26799,
          26801,
          26802,
          26803,
          26811,
          26812,
          26813,
          26847,
          26848,
          26849,
          26850,
          26851,
          26852,
          26853,
          26854,
          26855,
          26856,
          26857,
          26858,
          26859,
          26860,
          26861,
          26862,
          26863,
          26864,
          26865,
          26866,
          26867,
          26868,
          26869,
          26870,
          26891,
          26892,
          26893,
          26894,
          26895,
          26896,
          26897,
          26898,
          26899,
          26901,
          26902,
          26903,
          26904,
          26905,
          26906,
          26907,
          26908,
          26909,
          26910,
          26911,
          26912,
          26913,
          26914,
          26915,
          26916,
          26917,
          26918,
          26919,
          26920,
          26921,
          26922,
          26923,
          26929,
          26930,
          26931,
          26932,
          26933,
          26934,
          26935,
          26936,
          26937,
          26938,
          26939,
          26940,
          26941,
          26942,
          26943,
          26944,
          26945,
          26946,
          26948,
          26949,
          26950,
          26951,
          26952,
          26953,
          26954,
          26955,
          26956,
          26957,
          26958,
          26959,
          26960,
          26961,
          26962,
          26963,
          26964,
          26965,
          26966,
          26967,
          26968,
          26969,
          26970,
          26971,
          26972,
          26973,
          26974,
          26975,
          26976,
          26977,
          26978,
          26979,
          26980,
          26981,
          26982,
          26983,
          26984,
          26985,
          26986,
          26987,
          26988,
          26989,
          26990,
          26991,
          26992,
          26993,
          26994,
          26995,
          26996,
          26997,
          26998,
          27037,
          27038,
          27039,
          27040,
          27120,
          27200,
          27205,
          27206,
          27207,
          27208,
          27209,
          27210,
          27211,
          27212,
          27213,
          27214,
          27215,
          27216,
          27217,
          27218,
          27219,
          27220,
          27221,
          27222,
          27223,
          27224,
          27225,
          27226,
          27227,
          27228,
          27229,
          27230,
          27231,
          27232,
          27258,
          27259,
          27260,
          27291,
          27292,
          27391,
          27392,
          27393,
          27394,
          27395,
          27396,
          27397,
          27398,
          27429,
          27492,
          27493,
          27500,
          27561,
          27562,
          27563,
          27564,
          27571,
          27572,
          27573,
          27574,
          27581,
          27582,
          27583,
          27584,
          27591,
          27592,
          27593,
          27594,
          27700,
          28191,
          28192,
          28193,
          28232,
          28348,
          28349,
          28350,
          28351,
          28352,
          28353,
          28354,
          28355,
          28356,
          28357,
          28358,
          28402,
          28403,
          28404,
          28405,
          28406,
          28407,
          28408,
          28409,
          28410,
          28411,
          28412,
          28413,
          28414,
          28415,
          28416,
          28417,
          28418,
          28419,
          28420,
          28421,
          28422,
          28423,
          28424,
          28425,
          28426,
          28427,
          28428,
          28429,
          28430,
          28431,
          28432,
          28462,
          28463,
          28464,
          28465,
          28466,
          28467,
          28468,
          28469,
          28470,
          28471,
          28472,
          28473,
          28474,
          28475,
          28476,
          28477,
          28478,
          28479,
          28480,
          28481,
          28482,
          28483,
          28484,
          28485,
          28486,
          28487,
          28488,
          28489,
          28490,
          28491,
          28492,
          28600,
          28991,
          28992,
          29100,
          29101,
          29118,
          29119,
          29120,
          29121,
          29122,
          29168,
          29169,
          29170,
          29171,
          29172,
          29177,
          29178,
          29179,
          29180,
          29181,
          29182,
          29183,
          29184,
          29185,
          29187,
          29188,
          29189,
          29190,
          29191,
          29192,
          29193,
          29194,
          29195,
          29220,
          29221,
          29333,
          29635,
          29636,
          29701,
          29738,
          29739,
          29849,
          29850,
          29871,
          29872,
          29873,
          29900,
          29901,
          29902,
          29903,
          30161,
          30162,
          30163,
          30164,
          30165,
          30166,
          30167,
          30168,
          30169,
          30170,
          30171,
          30172,
          30173,
          30174,
          30175,
          30176,
          30177,
          30178,
          30179,
          30200,
          30339,
          30340,
          30491,
          30492,
          30493,
          30494,
          30591,
          30592,
          30729,
          30730,
          30731,
          30732,
          30791,
          30792,
          30800,
          31028,
          31121,
          31154,
          31170,
          31171,
          31251,
          31252,
          31253,
          31254,
          31255,
          31256,
          31257,
          31258,
          31259,
          31265,
          31266,
          31267,
          31268,
          31275,
          31276,
          31277,
          31278,
          31279,
          31281,
          31282,
          31283,
          31284,
          31285,
          31286,
          31287,
          31288,
          31289,
          31290,
          31291,
          31292,
          31293,
          31294,
          31295,
          31296,
          31297,
          31370,
          31461,
          31462,
          31463,
          31464,
          31465,
          31466,
          31467,
          31468,
          31469,
          31491,
          31492,
          31493,
          31494,
          31495,
          31528,
          31529,
          31600,
          31700,
          31838,
          31839,
          31900,
          31901,
          31917,
          31918,
          31919,
          31920,
          31921,
          31922,
          31965,
          31966,
          31967,
          31968,
          31969,
          31970,
          31971,
          31972,
          31973,
          31974,
          31975,
          31976,
          31977,
          31978,
          31979,
          31980,
          31981,
          31982,
          31983,
          31984,
          31985,
          31986,
          31987,
          31988,
          31989,
          31990,
          31991,
          31992,
          31993,
          31994,
          31995,
          31996,
          31997,
          31998,
          31999,
          32e3,
          32001,
          32002,
          32003,
          32005,
          32006,
          32007,
          32008,
          32009,
          32010,
          32011,
          32012,
          32013,
          32014,
          32015,
          32016,
          32017,
          32018,
          32019,
          32020,
          32021,
          32022,
          32023,
          32024,
          32025,
          32026,
          32027,
          32028,
          32029,
          32030,
          32031,
          32033,
          32034,
          32035,
          32036,
          32037,
          32038,
          32039,
          32040,
          32041,
          32042,
          32043,
          32044,
          32045,
          32046,
          32047,
          32048,
          32049,
          32050,
          32051,
          32052,
          32053,
          32054,
          32055,
          32056,
          32057,
          32058,
          32059,
          32060,
          32061,
          32062,
          32064,
          32065,
          32066,
          32067,
          32074,
          32075,
          32076,
          32077,
          32081,
          32082,
          32083,
          32084,
          32085,
          32086,
          32098,
          32099,
          32100,
          32104,
          32107,
          32108,
          32109,
          32110,
          32111,
          32112,
          32113,
          32114,
          32115,
          32116,
          32117,
          32118,
          32119,
          32120,
          32121,
          32122,
          32123,
          32124,
          32125,
          32126,
          32127,
          32128,
          32129,
          32130,
          32133,
          32134,
          32135,
          32136,
          32137,
          32138,
          32139,
          32140,
          32141,
          32142,
          32143,
          32144,
          32145,
          32146,
          32147,
          32148,
          32149,
          32150,
          32151,
          32152,
          32153,
          32154,
          32155,
          32156,
          32157,
          32158,
          32161,
          32164,
          32165,
          32166,
          32167,
          32180,
          32181,
          32182,
          32183,
          32184,
          32185,
          32186,
          32187,
          32188,
          32189,
          32190,
          32191,
          32192,
          32193,
          32194,
          32195,
          32196,
          32197,
          32198,
          32199,
          32201,
          32202,
          32203,
          32204,
          32205,
          32206,
          32207,
          32208,
          32209,
          32210,
          32211,
          32212,
          32213,
          32214,
          32215,
          32216,
          32217,
          32218,
          32219,
          32220,
          32221,
          32222,
          32223,
          32224,
          32225,
          32226,
          32227,
          32228,
          32229,
          32230,
          32231,
          32232,
          32233,
          32234,
          32235,
          32236,
          32237,
          32238,
          32239,
          32240,
          32241,
          32242,
          32243,
          32244,
          32245,
          32246,
          32247,
          32248,
          32249,
          32250,
          32251,
          32252,
          32253,
          32254,
          32255,
          32256,
          32257,
          32258,
          32259,
          32260,
          32301,
          32302,
          32303,
          32304,
          32305,
          32306,
          32307,
          32308,
          32309,
          32310,
          32311,
          32312,
          32313,
          32314,
          32315,
          32316,
          32317,
          32318,
          32319,
          32320,
          32321,
          32322,
          32323,
          32324,
          32325,
          32326,
          32327,
          32328,
          32329,
          32330,
          32331,
          32332,
          32333,
          32334,
          32335,
          32336,
          32337,
          32338,
          32339,
          32340,
          32341,
          32342,
          32343,
          32344,
          32345,
          32346,
          32347,
          32348,
          32349,
          32350,
          32351,
          32352,
          32353,
          32354,
          32355,
          32356,
          32357,
          32358,
          32359,
          32360,
          32601,
          32602,
          32603,
          32604,
          32605,
          32606,
          32607,
          32608,
          32609,
          32610,
          32611,
          32612,
          32613,
          32614,
          32615,
          32616,
          32617,
          32618,
          32619,
          32620,
          32621,
          32622,
          32623,
          32624,
          32625,
          32626,
          32627,
          32628,
          32629,
          32630,
          32631,
          32632,
          32633,
          32634,
          32635,
          32636,
          32637,
          32638,
          32639,
          32640,
          32641,
          32642,
          32643,
          32644,
          32645,
          32646,
          32647,
          32648,
          32649,
          32650,
          32651,
          32652,
          32653,
          32654,
          32655,
          32656,
          32657,
          32658,
          32659,
          32660,
          32661,
          32662,
          32664,
          32665,
          32666,
          32667,
          32701,
          32702,
          32703,
          32704,
          32705,
          32706,
          32707,
          32708,
          32709,
          32710,
          32711,
          32712,
          32713,
          32714,
          32715,
          32716,
          32717,
          32718,
          32719,
          32720,
          32721,
          32722,
          32723,
          32724,
          32725,
          32726,
          32727,
          32728,
          32729,
          32730,
          32731,
          32732,
          32733,
          32734,
          32735,
          32736,
          32737,
          32738,
          32739,
          32740,
          32741,
          32742,
          32743,
          32744,
          32745,
          32746,
          32747,
          32748,
          32749,
          32750,
          32751,
          32752,
          32753,
          32754,
          32755,
          32756,
          32757,
          32758,
          32759,
          32760,
          32761,
          32766,
          53001,
          53002,
          53003,
          53004,
          53008,
          53009,
          53010,
          53011,
          53012,
          53013,
          53014,
          53015,
          53016,
          53017,
          53018,
          53019,
          53021,
          53022,
          53023,
          53024,
          53025,
          53026,
          53027,
          53028,
          53029,
          53030,
          53031,
          53032,
          53034,
          53042,
          53043,
          53044,
          53045,
          53046,
          53048,
          53049,
          53074,
          53075,
          53076,
          53077,
          53078,
          53079,
          53080,
          54001,
          54002,
          54003,
          54004,
          54008,
          54009,
          54010,
          54011,
          54012,
          54013,
          54014,
          54015,
          54016,
          54017,
          54018,
          54019,
          54021,
          54022,
          54023,
          54024,
          54025,
          54026,
          54027,
          54028,
          54029,
          54030,
          54031,
          54032,
          54034,
          54042,
          54043,
          54044,
          54045,
          54046,
          54048,
          54049,
          54050,
          54051,
          54052,
          54053,
          54074,
          54075,
          54076,
          54077,
          54078,
          54079,
          54080,
          65061,
          65062,
          65161,
          65163,
          102001,
          102002,
          102003,
          102004,
          102005,
          102006,
          102007,
          102008,
          102009,
          102010,
          102011,
          102012,
          102013,
          102014,
          102015,
          102016,
          102017,
          102018,
          102019,
          102020,
          102021,
          102022,
          102023,
          102024,
          102025,
          102026,
          102027,
          102028,
          102029,
          102030,
          102031,
          102032,
          102033,
          102034,
          102035,
          102036,
          102037,
          102038,
          102039,
          102040,
          102041,
          102042,
          102043,
          102044,
          102045,
          102046,
          102047,
          102048,
          102049,
          102050,
          102051,
          102052,
          102053,
          102054,
          102055,
          102056,
          102057,
          102058,
          102059,
          102060,
          102061,
          102062,
          102063,
          102064,
          102065,
          102066,
          102067,
          102068,
          102069,
          102070,
          102071,
          102072,
          102073,
          102074,
          102075,
          102076,
          102077,
          102078,
          102079,
          102080,
          102081,
          102082,
          102083,
          102084,
          102085,
          102086,
          102087,
          102088,
          102089,
          102090,
          102091,
          102092,
          102093,
          102094,
          102095,
          102096,
          102097,
          102098,
          102099,
          102100,
          102101,
          102102,
          102103,
          102104,
          102105,
          102106,
          102107,
          102108,
          102109,
          102110,
          102111,
          102112,
          102113,
          102114,
          102115,
          102116,
          102117,
          102118,
          102119,
          102120,
          102121,
          102122,
          102123,
          102124,
          102125,
          102126,
          102127,
          102128,
          102129,
          102130,
          102131,
          102132,
          102133,
          102134,
          102135,
          102136,
          102137,
          102138,
          102139,
          102140,
          102141,
          102142,
          102143,
          102144,
          102145,
          102146,
          102147,
          102148,
          102149,
          102150,
          102151,
          102152,
          102153,
          102154,
          102155,
          102156,
          102157,
          102158,
          102159,
          102160,
          102161,
          102162,
          102163,
          102164,
          102165,
          102166,
          102167,
          102168,
          102169,
          102170,
          102171,
          102172,
          102173,
          102174,
          102175,
          102176,
          102177,
          102178,
          102179,
          102180,
          102181,
          102182,
          102183,
          102184,
          102185,
          102186,
          102187,
          102188,
          102189,
          102190,
          102191,
          102192,
          102193,
          102194,
          102195,
          102196,
          102197,
          102198,
          102199,
          102200,
          102201,
          102202,
          102203,
          102204,
          102205,
          102206,
          102207,
          102208,
          102209,
          102210,
          102211,
          102212,
          102213,
          102214,
          102215,
          102216,
          102217,
          102218,
          102219,
          102220,
          102221,
          102222,
          102223,
          102224,
          102225,
          102226,
          102227,
          102228,
          102229,
          102230,
          102231,
          102232,
          102233,
          102234,
          102235,
          102236,
          102237,
          102238,
          102239,
          102240,
          102241,
          102242,
          102243,
          102244,
          102245,
          102246,
          102247,
          102248,
          102249,
          102250,
          102251,
          102252,
          102253,
          102254,
          102255,
          102256,
          102257,
          102258,
          102259,
          102260,
          102261,
          102262,
          102263,
          102264,
          102265,
          102266,
          102267,
          102268,
          102269,
          102270,
          102271,
          102272,
          102273,
          102274,
          102275,
          102276,
          102277,
          102278,
          102279,
          102280,
          102281,
          102282,
          102283,
          102284,
          102285,
          102286,
          102287,
          102288,
          102289,
          102290,
          102291,
          102292,
          102293,
          102294,
          102295,
          102296,
          102297,
          102298,
          102299,
          102300,
          102301,
          102302,
          102303,
          102304,
          102305,
          102306,
          102307,
          102308,
          102309,
          102310,
          102311,
          102312,
          102313,
          102314,
          102315,
          102316,
          102317,
          102318,
          102319,
          102320,
          102321,
          102322,
          102323,
          102324,
          102325,
          102326,
          102327,
          102328,
          102329,
          102330,
          102331,
          102332,
          102333,
          102334,
          102335,
          102336,
          102337,
          102338,
          102339,
          102340,
          102341,
          102342,
          102343,
          102344,
          102345,
          102346,
          102347,
          102348,
          102349,
          102350,
          102351,
          102352,
          102353,
          102354,
          102355,
          102356,
          102357,
          102358,
          102359,
          102360,
          102361,
          102362,
          102363,
          102364,
          102365,
          102366,
          102367,
          102368,
          102369,
          102370,
          102371,
          102372,
          102373,
          102374,
          102375,
          102376,
          102377,
          102378,
          102379,
          102380,
          102381,
          102382,
          102383,
          102384,
          102385,
          102386,
          102387,
          102388,
          102389,
          102390,
          102391,
          102392,
          102393,
          102394,
          102395,
          102396,
          102397,
          102398,
          102399,
          102400,
          102401,
          102402,
          102403,
          102404,
          102405,
          102406,
          102407,
          102408,
          102409,
          102410,
          102411,
          102412,
          102413,
          102414,
          102415,
          102416,
          102417,
          102418,
          102419,
          102420,
          102421,
          102422,
          102423,
          102424,
          102425,
          102426,
          102427,
          102428,
          102429,
          102430,
          102431,
          102432,
          102433,
          102434,
          102435,
          102436,
          102437,
          102438,
          102439,
          102440,
          102441,
          102442,
          102443,
          102444,
          102445,
          102446,
          102447,
          102448,
          102449,
          102450,
          102451,
          102452,
          102453,
          102454,
          102455,
          102456,
          102457,
          102458,
          102459,
          102460,
          102461,
          102462,
          102463,
          102464,
          102465,
          102466,
          102467,
          102468,
          102469,
          102470,
          102471,
          102472,
          102473,
          102474,
          102475,
          102476,
          102477,
          102478,
          102479,
          102480,
          102481,
          102482,
          102483,
          102484,
          102485,
          102486,
          102487,
          102488,
          102489,
          102490,
          102491,
          102492,
          102493,
          102494,
          102495,
          102496,
          102500,
          102501,
          102502,
          102503,
          102504,
          102505,
          102506,
          102507,
          102508,
          102509,
          102510,
          102511,
          102512,
          102513,
          102514,
          102515,
          102516,
          102517,
          102518,
          102519,
          102520,
          102521,
          102522,
          102523,
          102524,
          102525,
          102526,
          102527,
          102528,
          102529,
          102530,
          102531,
          102532,
          102533,
          102534,
          102535,
          102536,
          102537,
          102538,
          102539,
          102540,
          102541,
          102542,
          102543,
          102544,
          102545,
          102546,
          102547,
          102548,
          102549,
          102550,
          102551,
          102552,
          102553,
          102554,
          102555,
          102556,
          102557,
          102558,
          102559,
          102560,
          102561,
          102570,
          102571,
          102572,
          102573,
          102574,
          102575,
          102576,
          102577,
          102578,
          102579,
          102580,
          102581,
          102582,
          102583,
          102584,
          102585,
          102586,
          102587,
          102588,
          102589,
          102590,
          102591,
          102592,
          102593,
          102594,
          102595,
          102596,
          102597,
          102598,
          102599,
          102600,
          102601,
          102602,
          102603,
          102604,
          102605,
          102606,
          102607,
          102608,
          102609,
          102610,
          102611,
          102612,
          102613,
          102614,
          102615,
          102616,
          102617,
          102618,
          102619,
          102620,
          102621,
          102622,
          102623,
          102624,
          102625,
          102626,
          102627,
          102628,
          102629,
          102630,
          102631,
          102632,
          102633,
          102634,
          102635,
          102636,
          102637,
          102638,
          102639,
          102640,
          102641,
          102642,
          102643,
          102644,
          102645,
          102646,
          102647,
          102648,
          102649,
          102650,
          102651,
          102652,
          102653,
          102654,
          102655,
          102656,
          102657,
          102658,
          102659,
          102660,
          102661,
          102662,
          102663,
          102664,
          102665,
          102666,
          102667,
          102668,
          102669,
          102670,
          102671,
          102672,
          102673,
          102674,
          102675,
          102676,
          102677,
          102678,
          102679,
          102680,
          102681,
          102682,
          102683,
          102684,
          102685,
          102686,
          102687,
          102688,
          102689,
          102690,
          102691,
          102692,
          102693,
          102694,
          102695,
          102696,
          102697,
          102698,
          102699,
          102700,
          102701,
          102702,
          102703,
          102704,
          102705,
          102706,
          102707,
          102708,
          102709,
          102710,
          102711,
          102712,
          102713,
          102714,
          102715,
          102716,
          102717,
          102718,
          102719,
          102720,
          102721,
          102722,
          102723,
          102724,
          102725,
          102726,
          102727,
          102728,
          102729,
          102730,
          102733,
          102734,
          102735,
          102736,
          102737,
          102738,
          102739,
          102740,
          102741,
          102742,
          102743,
          102744,
          102745,
          102746,
          102747,
          102748,
          102749,
          102750,
          102751,
          102752,
          102753,
          102754,
          102755,
          102756,
          102757,
          102758,
          102761,
          102762,
          102763,
          102764,
          102765,
          102766,
          102767,
          102768,
          102769,
          102770,
          102771,
          102772,
          102773,
          102774,
          102775,
          102776,
          102777,
          102778,
          102779,
          102780,
          102781,
          102782,
          102783,
          102784,
          102785,
          102786,
          102787,
          102788,
          102789,
          102790,
          102791,
          102792,
          102793,
          102794,
          102795,
          102796,
          102797,
          102798,
          102962,
          102963,
          102965,
          102966,
          102967,
          102968,
          102969,
          102970,
          102971,
          102972,
          102973,
          102974,
          102975,
          102976,
          102977,
          102978,
          102979,
          102980,
          102981,
          102982,
          102983,
          102984,
          102985,
          102986,
          102987,
          102988,
          102989,
          102990,
          102991,
          102992,
          102993,
          102994,
          102995,
          102996,
          102997,
          102998,
          102999,
          103e3,
          103001,
          103002,
          103003,
          103004,
          103005,
          103006,
          103007,
          103008,
          103009,
          103010,
          103011,
          103012,
          103013,
          103014,
          103015,
          103016,
          103017,
          103018,
          103019,
          103020,
          103021,
          103022,
          103023,
          103024,
          103025,
          103026,
          103027,
          103028,
          103029,
          103030,
          103031,
          103032,
          103033,
          103034,
          103035,
          103036,
          103037,
          103038,
          103039,
          103040,
          103041,
          103042,
          103043,
          103044,
          103045,
          103046,
          103047,
          103048,
          103049,
          103050,
          103051,
          103052,
          103053,
          103054,
          103055,
          103056,
          103057,
          103058,
          103059,
          103060,
          103061,
          103062,
          103063,
          103064,
          103065,
          103066,
          103067,
          103068,
          103069,
          103070,
          103071,
          103072,
          103073,
          103074,
          103075,
          103076,
          103077,
          103078,
          103079,
          103080,
          103081,
          103082,
          103083,
          103084,
          103085,
          103086,
          103087,
          103088,
          103089,
          103090,
          103091,
          103092,
          103093,
          103094,
          103095,
          103096,
          103097,
          103098,
          103099,
          103100,
          103101,
          103102,
          103103,
          103104,
          103105,
          103106,
          103107,
          103108,
          103109,
          103110,
          103111,
          103112,
          103113,
          103114,
          103115,
          103116,
          103117,
          103118,
          103119,
          103120,
          103121,
          103122,
          103123,
          103124,
          103125,
          103126,
          103127,
          103128,
          103129,
          103130,
          103131,
          103132,
          103133,
          103134,
          103135,
          103136,
          103137,
          103138,
          103139,
          103140,
          103141,
          103142,
          103143,
          103144,
          103145,
          103146,
          103147,
          103148,
          103149,
          103150,
          103151,
          103152,
          103153,
          103154,
          103155,
          103156,
          103157,
          103158,
          103159,
          103160,
          103161,
          103162,
          103163,
          103164,
          103165,
          103166,
          103167,
          103168,
          103169,
          103170,
          103171,
          103172,
          103173,
          103174,
          103175,
          103176,
          103177,
          103178,
          103179,
          103180,
          103181,
          103182,
          103183,
          103184,
          103185,
          103186,
          103187,
          103188,
          103189,
          103190,
          103191,
          103192,
          103193,
          103194,
          103195,
          103196,
          103197,
          103198,
          103199,
          103200,
          103201,
          103202,
          103203,
          103204,
          103205,
          103206,
          103207,
          103208,
          103209,
          103210,
          103211,
          103212,
          103213,
          103214,
          103215,
          103216,
          103217,
          103218,
          103219,
          103220,
          103221,
          103222,
          103223,
          103224,
          103225,
          103226,
          103227,
          103228,
          103229,
          103230,
          103231,
          103232,
          103233,
          103234,
          103235,
          103236,
          103237,
          103238,
          103239,
          103240,
          103241,
          103242,
          103243,
          103244,
          103245,
          103246,
          103247,
          103248,
          103249,
          103250,
          103251,
          103252,
          103253,
          103254,
          103255,
          103256,
          103257,
          103258,
          103259,
          103260,
          103261,
          103262,
          103263,
          103264,
          103265,
          103266,
          103267,
          103268,
          103269,
          103270,
          103271,
          103272,
          103273,
          103274,
          103275,
          103276,
          103277,
          103278,
          103279,
          103280,
          103281,
          103282,
          103283,
          103284,
          103285,
          103286,
          103287,
          103288,
          103289,
          103290,
          103291,
          103292,
          103293,
          103294,
          103295,
          103296,
          103297,
          103298,
          103299,
          103300,
          103301,
          103302,
          103303,
          103304,
          103305,
          103306,
          103307,
          103308,
          103309,
          103310,
          103311,
          103312,
          103313,
          103314,
          103315,
          103316,
          103317,
          103318,
          103319,
          103320,
          103321,
          103322,
          103323,
          103324,
          103325,
          103326,
          103327,
          103328,
          103329,
          103330,
          103331,
          103332,
          103333,
          103334,
          103335,
          103336,
          103337,
          103338,
          103339,
          103340,
          103341,
          103342,
          103343,
          103344,
          103345,
          103346,
          103347,
          103348,
          103349,
          103350,
          103351,
          103352,
          103353,
          103354,
          103355,
          103356,
          103357,
          103358,
          103359,
          103360,
          103361,
          103362,
          103363,
          103364,
          103365,
          103366,
          103367,
          103368,
          103369,
          103370,
          103371,
          103372,
          103373,
          103374,
          103375,
          103376,
          103377,
          103378,
          103379,
          103380,
          103381,
          103382,
          103383,
          103384,
          103385,
          103386,
          103387,
          103388,
          103389,
          103390,
          103391,
          103392,
          103393,
          103394,
          103395,
          103396,
          103397,
          103398,
          103399,
          103400,
          103401,
          103402,
          103403,
          103404,
          103405,
          103406,
          103407,
          103408,
          103409,
          103410,
          103411,
          103412,
          103413,
          103414,
          103415,
          103416,
          103417,
          103418,
          103419,
          103420,
          103421,
          103422,
          103423,
          103424,
          103425,
          103426,
          103427,
          103428,
          103429,
          103430,
          103431,
          103432,
          103433,
          103434,
          103435,
          103436,
          103437,
          103438,
          103439,
          103440,
          103441,
          103442,
          103443,
          103444,
          103445,
          103446,
          103447,
          103448,
          103449,
          103450,
          103451,
          103452,
          103453,
          103454,
          103455,
          103456,
          103457,
          103458,
          103459,
          103460,
          103461,
          103462,
          103463,
          103464,
          103465,
          103466,
          103467,
          103468,
          103469,
          103470,
          103471,
          103472,
          103473,
          103474,
          103475,
          103476,
          103477,
          103478,
          103479,
          103480,
          103481,
          103482,
          103483,
          103484,
          103485,
          103486,
          103487,
          103488,
          103489,
          103490,
          103491,
          103492,
          103493,
          103494,
          103495,
          103496,
          103497,
          103498,
          103499,
          103500,
          103501,
          103502,
          103503,
          103504,
          103505,
          103506,
          103507,
          103508,
          103509,
          103510,
          103511,
          103512,
          103513,
          103514,
          103515,
          103516,
          103517,
          103518,
          103519,
          103520,
          103521,
          103522,
          103523,
          103524,
          103525,
          103526,
          103527,
          103528,
          103529,
          103530,
          103531,
          103532,
          103533,
          103534,
          103535,
          103536,
          103537,
          103538,
          103539,
          103540,
          103541,
          103542,
          103543,
          103544,
          103545,
          103546,
          103547,
          103548,
          103549,
          103550,
          103551,
          103552,
          103553,
          103554,
          103555,
          103556,
          103557,
          103558,
          103559,
          103560,
          103561,
          103562,
          103563,
          103564,
          103565,
          103566,
          103567,
          103568,
          103569,
          103570,
          103571,
          103572,
          103573,
          103574,
          103575,
          103576,
          103577,
          103578,
          103579,
          103580,
          103581,
          103582,
          103583,
          103584,
          103585,
          103600,
          103601,
          103602,
          103603,
          103604,
          103605,
          103606,
          103607,
          103608,
          103609,
          103610,
          103611,
          103612,
          103613,
          103614,
          103615,
          103616,
          103617,
          103618,
          103619,
          103620,
          103621,
          103622,
          103623,
          103624,
          103625,
          103626,
          103627,
          103628,
          103629,
          103630,
          103631,
          103632,
          103633,
          103634,
          103635,
          103636,
          103637,
          103638,
          103639,
          103640,
          103641,
          103642,
          103643,
          103644,
          103645,
          103646,
          103647,
          103648,
          103649,
          103650,
          103651,
          103652,
          103653,
          103654,
          103655,
          103656,
          103657,
          103658,
          103659,
          103660,
          103661,
          103662,
          103663,
          103664,
          103665,
          103666,
          103667,
          103668,
          103669,
          103670,
          103671,
          103672,
          103673,
          103674,
          103675,
          103676,
          103677,
          103678,
          103679,
          103680,
          103681,
          103682,
          103683,
          103684,
          103685,
          103686,
          103687,
          103688,
          103689,
          103690,
          103691,
          103692,
          103693,
          103694,
          103695,
          103700,
          103701,
          103702,
          103703,
          103704,
          103705,
          103706,
          103707,
          103708,
          103709,
          103710,
          103711,
          103712,
          103713,
          103714,
          103715,
          103716,
          103717,
          103718,
          103719,
          103720,
          103721,
          103722,
          103723,
          103724,
          103725,
          103726,
          103727,
          103728,
          103729,
          103730,
          103731,
          103732,
          103733,
          103734,
          103735,
          103736,
          103737,
          103738,
          103739,
          103740,
          103741,
          103742,
          103743,
          103744,
          103745,
          103746,
          103747,
          103748,
          103749,
          103750,
          103751,
          103752,
          103753,
          103754,
          103755,
          103756,
          103757,
          103758,
          103759,
          103760,
          103761,
          103762,
          103763,
          103764,
          103765,
          103766,
          103767,
          103768,
          103769,
          103770,
          103771,
          103772,
          103773,
          103774,
          103775,
          103776,
          103777,
          103778,
          103779,
          103780,
          103781,
          103782,
          103783,
          103784,
          103785,
          103786,
          103787,
          103788,
          103789,
          103790,
          103791,
          103792,
          103793,
          103794,
          103795,
          103796,
          103797,
          103798,
          103799,
          103800,
          103801,
          103802,
          103803,
          103804,
          103805,
          103806,
          103807,
          103808,
          103809,
          103810,
          103811,
          103812,
          103813,
          103814,
          103815,
          103816,
          103817,
          103818,
          103819,
          103820,
          103821,
          103822,
          103823,
          103824,
          103825,
          103826,
          103827,
          103828,
          103829,
          103830,
          103831,
          103832,
          103833,
          103834,
          103835,
          103836,
          103837,
          103838,
          103839,
          103840,
          103841,
          103842,
          103843,
          103844,
          103845,
          103846,
          103847,
          103848,
          103849,
          103850,
          103851,
          103852,
          103853,
          103854,
          103855,
          103856,
          103857,
          103858,
          103859,
          103860,
          103861,
          103862,
          103863,
          103864,
          103865,
          103866,
          103867,
          103868,
          103869,
          103870,
          103871,
          103900,
          103901,
          103902,
          103903,
          103904,
          103905,
          103906,
          103907,
          103908,
          103909,
          103910,
          103911,
          103912,
          103913,
          103914,
          103915,
          103916,
          103917,
          103918,
          103919,
          103920,
          103921,
          103922,
          103923,
          103924,
          103925,
          103926,
          103927,
          103928,
          103929,
          103930,
          103931,
          103932,
          103933,
          103934,
          103935,
          103936,
          103937,
          103938,
          103939,
          103940,
          103941,
          103942,
          103943,
          103944,
          103945,
          103946,
          103947,
          103948,
          103949,
          103950,
          103951,
          103952,
          103953,
          103954,
          103955,
          103956,
          103957,
          103958,
          103959,
          103960,
          103961,
          103962,
          103963,
          103964,
          103965,
          103966,
          103967,
          103968,
          103969,
          103970,
          103971
        ];
        d("extend-esri") && k.setObject("dijit.analysis.PCSList", e, b);
        return e;
      });
    },
    "widgets/Analysis/layerUtil": function() {
      define("dojo/_base/lang dojo/_base/array dojo/promise/all dojo/Deferred esri/layers/FeatureLayer esri/layers/GeoRSSLayer esri/layers/WFSLayer jimu/LayerInfos/LayerInfos".split(
        " "
      ), function(k, d, b, e, g, q, u, x) {
        var A = {
          getLayerObjects: function() {
            var k = new e(),
              z = [];
            x.getInstanceSync().traversal(function(b) {
              z.push(b);
            });
            var E = d.map(z, function(b) {
              var e;
              return b
                .getItemInfo()
                .then(function(b) {
                  b && (e = b.getItem());
                })
                .then(function() {
                  return b.getLayerType();
                })
                .then(function(e) {
                  "GeoRSSLayer" === e &&
                    (b.isLeaf() ||
                      d.forEach(b.getSubLayers(), function(b) {
                        b.layerObject.name || (b.layerObject.name = b.title);
                      }));
                  return b.getLayerObjectTryUsingFeatureService();
                })
                .then(function(b) {
                  if (b) return (b.itemInfo = e), b;
                });
            });
            b(E).then(
              function(b) {
                var e = [];
                d.forEach(b, function(b, d) {
                  if (b && b.geometryType)
                    if (
                      (b instanceof g &&
                        "esri.layers.StreamLayer" !== b.declaredClass) ||
                      b instanceof q
                    )
                      (b.id = b.id || z[d].id), e.push(b);
                    else if (b instanceof u) {
                      var k = A.createFeatureCollectionJsonFromWFS(b),
                        k = new g(k, {
                          mode: g.MODE_SNAPSHOT,
                          outFields: ["*"]
                        });
                      k.id = b.id || z[d].id;
                      k.title = b._layerName;
                      k.name = b._layerName;
                      k.capabilities
                        ? -1 === k.capabilities.indexOf("Extract") &&
                          (k.capabilities += ",Extract")
                        : (k.capabilities = "Extract");
                      e.push(k);
                    }
                });
                k.resolve(e);
              },
              function() {
                k.resolve([]);
              }
            );
            return k;
          },
          getTableInfos: function() {
            var b = x.getInstanceSync(),
              b = [].concat(b.getTableInfoArray(), b.getLayerInfoArray());
            return d.filter(b, function(b) {
              return !0 === b.isTable;
            });
          },
          getTableLayerObjects: function() {
            var g = new e(),
              k = A.getTableInfos(),
              k = d.map(k, function(b) {
                return b.getLayerObject();
              });
            b(k).then(function(b) {
              b = d.filter(b, function(b) {
                return null !== b;
              });
              g.resolve(b);
            });
            return g;
          },
          getMainGeometryType: function(b) {
            var e = 0,
              g = 0,
              k = 0;
            d.forEach(b.graphics, function(b) {
              "point" === b.geometry.type
                ? e++
                : "polyline" === b.geometry.type
                ? g++
                : "polygon" === b.geometry.type && k++;
            });
            return e > g && e > k
              ? "esriGeometryPoint"
              : g > e && g > k
              ? "esriGeometryPolyline"
              : "esriGeometryPolygon";
          },
          createFeatureCollectionJsonFromWFS: function(b) {
            var e = A.getMainGeometryType(b),
              g = {
                layerDefinition: null,
                featureSet: { features: [], geometryType: e }
              };
            g.layerDefinition = {
              geometryType: e,
              objectIdField: "__OBJECTID",
              type: "Feature Layer",
              typeIdField: "",
              drawingInfo: {
                renderer: {
                  type: "simple",
                  symbol: ("esriGeometryPoint" === e
                    ? b._pointSymbol
                    : "esriGeometryPolyline" === e
                    ? b._lineSymbol
                    : b._polygonSymbol
                  ).toJson()
                },
                fixedSymbols: !0
              },
              fields: [
                {
                  name: "__OBJECTID",
                  alias: "__OBJECTID",
                  type: "esriFieldTypeOID"
                }
              ],
              types: [],
              capabilities: "Query"
            };
            d.forEach(b.fields, function(b) {
              -1 <
                d.indexOf(
                  [
                    "esriFieldTypeInteger",
                    "esriFieldTypeDouble",
                    "esriFieldTypeDate",
                    "esriFieldTypeString"
                  ],
                  b.type
                ) && g.layerDefinition.fields.push(k.clone(b));
            });
            var q = [];
            d.forEach(b.graphics, function(b, d) {
              var e = k.clone(b.attributes);
              e.__OBJECTID = d;
              q.push({ geometry: b.geometry.toJson(), attributes: e });
            });
            g.featureSet.features = q;
            return g;
          }
        };
        return A;
      });
    },
    "esri/layers/WFSLayer": function() {
      define("dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/has dojo/on ../request ../kernel ../graphic ../renderers/jsonUtils ../symbols/jsonUtils ../Color ../symbols/SimpleMarkerSymbol ../symbols/SimpleLineSymbol ../symbols/SimpleFillSymbol ../SpatialReference ../geometry/webMercatorUtils ../geometry/Extent ../geometry/Point ../geometry/Multipoint ../geometry/Polyline ../geometry/Polygon ./LabelClass ./GraphicsLayer".split(
        " "
      ), function(
        k,
        d,
        b,
        e,
        g,
        q,
        u,
        x,
        A,
        v,
        z,
        E,
        y,
        w,
        p,
        t,
        C,
        N,
        I,
        H,
        J,
        M,
        Q,
        K,
        r
      ) {
        k = k([r], {
          declaredClass: "esri.layers.WFSLayer",
          constructor: function(a) {
            this.geometryType = this.describeFeatureTypeUrl = this.getFeatureUrl = this.layerNamespace =
              "";
            this.fields = [];
            this.spatialReferences = [];
            this.fullExtent = null;
            this.visible = !0;
            this.renderer = null;
            this.id = "WFSLayer";
            this._url = "";
            this._version = "1.1.0";
            this._layerName = "";
            this._nsLayerNames = {};
            this._layerDefinedGeometryType = "esriGeometryComplex";
            this._wkid = 3857;
            this._mode = "snapshot";
            this._maxFeatures = 100;
            this._inverseResponse = this._inverseFilter = !1;
            this._nsGeometryFieldName = this._getFeatureRequest = this._nsFields =
              "";
            this._graphicArray = [];
            this._gmlNS = "http://www.opengis.net/gml";
            this._layerEventHandlers = [];
            this.customParameters = this._describeFeatureTypeCallback = this._getCapabilitiesCallback = null;
            this.showLabels = !0;
            this.labelingInfo = null;
            a &&
              (a.id && (this.id = a.id),
              (this.showLabels = null !== a.showLabels ? a.showLabels : !0));
            this.onError = b.hitch(this, this.onError);
            this._errorSupport = b.hitch(this, this._errorSupport);
            this._parseGml = b.hitch(this, this._parseGml);
            this._getCapabilities = b.hitch(this, this._getCapabilities);
            this._getCapabilitiesResponse = b.hitch(
              this,
              this._getCapabilitiesResponse
            );
            this._describeFeatureTypeResponse = b.hitch(
              this,
              this._describeFeatureTypeResponse
            );
            this._pointSymbol = new w(
              w.STYLE_CIRCLE,
              6,
              new p(p.STYLE_SOLID, new y([0, 255, 0]), 1),
              new y([255, 0, 0])
            );
            this._lineSymbol = new p(p.STYLE_SOLID, new y([0, 255, 0]), 3);
            this._polygonSymbol = new t(
              t.STYLE_SOLID,
              new p(p.STYLE_SOLID, new y([255, 0, 0]), 2),
              new y([255, 255, 0, 0.25])
            );
            this.loaded = !1;
            this._isProjectedOk = !0;
          },
          initialize: function(a, b) {
            a.id && (this.id = a.id);
            a.url && (this._url = a.url);
            a.version && (this._version = a.version);
            this.customParameters = a.customParameters;
            this._getCapabilities(b);
          },
          selectLayer: function(a, b) {
            this._layerName = a.layerName;
            this._wkid = a.wkid;
            this._mode = a.mode;
            this._maxFeatures = a.maxFeatures;
            this._inverseResponse = a.swapXY;
            this._inverseFilter = a.swapXYFilter;
            this.geometryType = a.geometryType;
            this._describeFeatureType(b);
            this.loaded = !0;
          },
          toJson: function() {
            var a = {};
            a.id = this.id;
            a.url = this._url;
            a.version = this._version;
            a.mode = "snapshot" === this._mode ? 0 : 1;
            a.name = this._layerName;
            a.geometryType = this.geometryType;
            a.wkid = this._wkid;
            a.maxFeatures = this._maxFeatures;
            a.swapXY = this._inverseResponse;
            a.swapXYFilter = this._inverseFilter;
            a.pointSymbol = this._pointSymbol.toJson();
            a.lineSymbol = this._lineSymbol.toJson();
            a.polygonSymbol = this._polygonSymbol.toJson();
            a.showLabels = this.showLabels;
            this.labelingInfo &&
              (a.labelingInfo = e.map(this.labelingInfo, function(a) {
                return a.toJson();
              }));
            this.customParameters &&
              (a.customParameters = this.customParameters);
            return a;
          },
          fromJson: function(a, b) {
            a.id && (this.id = a.id);
            a.url && (this._url = a.url);
            a.version && (this._version = a.version);
            a.mode && (this._mode = 0 === a.mode ? "snapshot" : "onDemand");
            a.name && (this._layerName = a.name);
            a.geometryType && (this.geometryType = a.geometryType);
            a.wkid && (this._wkid = a.wkid);
            a.maxFeatures && (this._maxFeatures = a.maxFeatures);
            a.swapXY && (this._inverseResponse = a.swapXY);
            a.swapXYFilter && (this._inverseFilter = a.swapXYFilter);
            a.pointSymbol && (this._pointSymbol = E.fromJson(a.pointSymbol));
            a.lineSymbol && (this._lineSymbol = E.fromJson(a.lineSymbol));
            a.polygonSymbol &&
              (this._polygonSymbol = E.fromJson(a.polygonSymbol));
            this.showLabels = null != a.showLabels ? a.showLabels : !0;
            a.labelingInfo &&
              (this.labelingInfo = e.map(a.labelingInfo, function(a) {
                return new K(a);
              }));
            this.customParameters = a.customParameters;
            this._getCapabilities(b);
            this.loaded = !0;
          },
          setPointSymbol: function(a) {
            this._pointSymbol = a;
          },
          setLineSymbol: function(a) {
            this._lineSymbol = a;
          },
          setPolygonSymbol: function(a) {
            this._polygonSymbol = a;
          },
          _setMap: function(a) {
            this._map = a;
            var c = this.inherited(arguments);
            this._map &&
              (this._layerEventHandlers.push(
                this._map.on("extent-change", b.hitch(this, "refresh"))
              ),
              this._layerEventHandlers.push(
                this.on("visibility-change", b.hitch(this, "_visibilityChange"))
              ));
            this._getFeature();
            this.refresh();
            return c;
          },
          _unsetMap: function() {
            for (var a = 0; a < this._layerEventHandlers.length; a++)
              g.disconnect(this._layerEventHandlers[a]);
            this.refresh();
            this.inherited(arguments);
          },
          refresh: function(a) {
            this.clear();
            this.redraw();
            "ondemand" === this._mode.toLowerCase() && this._fireUpdateStart();
          },
          redraw: function() {
            if (this.visible)
              for (var a = 0; a < this._graphicArray.length; a++) {
                var b = this._graphicArray[a],
                  d = b.geometry,
                  h = null;
                "point" === d.type
                  ? (h = this.renderer
                      ? this.renderer.getSymbol(b)
                      : this._pointSymbol)
                  : "multipoint" === d.type
                  ? (h = this.renderer
                      ? this.renderer.getSymbol(b)
                      : this._pointSymbol)
                  : "polyline" === d.type
                  ? (h = this.renderer
                      ? this.renderer.getSymbol(b)
                      : this._lineSymbol)
                  : "polygon" === d.type &&
                    (h = this.renderer
                      ? this.renderer.getSymbol(b)
                      : this._polygonSymbol);
                b.setSymbol(h);
                this.add(b);
              }
          },
          _visibilityChange: function(a) {
            this.visible = a.visible;
            this.redraw();
          },
          onUpdateStart: function() {
            this._getFeature();
          },
          onUpdateEnd: function() {
            this.clear();
            this.redraw();
          },
          setLabelingInfo: function(a) {
            a
              ? ((this.labelingInfo = a), this._fixLabelExpr())
              : delete this.labelingInfo;
            this.onLabelingInfoChange();
          },
          onLabelingInfoChange: function() {},
          _fixLabelExpr: function() {
            var a = /\[([^\[\]]+)\]/gi,
              b,
              d = this,
              h = function(a, b) {
                a = d._getField(b, !0);
                return "[" + ((a && a.name) || b) + "]";
              };
            e.forEach(this.labelingInfo, function(c) {
              if ((b = c.labelExpression)) c.labelExpression = b.replace(a, h);
            });
          },
          _getField: function(a, b) {
            var c = this.fields;
            if (!c || 0 === c.length) return null;
            var h;
            b && (a = a.toLowerCase());
            e.some(c, function(c) {
              var d = !1;
              (d = b
                ? c && c.name.toLowerCase() === a
                  ? !0
                  : !1
                : c && c.name === a
                ? !0
                : !1) && (h = c);
              return d;
            });
            return h;
          },
          setCustomParameters: function(a) {
            this.customParameters = a;
            this._getFeature();
            this.refresh();
          },
          _getCapabilities: function(a) {
            this._getCapabilitiesCallback = a;
            a = b.trim(this._url);
            if ("" === a) this.onError("WFSLayer: url is invalid");
            else if (
              "1.0.0" !== this._version &&
              "1.1.0" !== this._version &&
              "2.0.0" !== this._version
            )
              this.onError("WFSLayer: version is invalid");
            else if ("" !== a) {
              var c = a.indexOf("?");
              a =
                a +
                (-1 === c ? "?" : "\x26") +
                "service\x3dWFS\x26request\x3dGetCapabilities\x26version\x3d" +
                this._version;
              a = this._appendCustomParameters(a);
              x(
                { url: a, handleAs: "text", headers: { "Content-Type": null } },
                { usePost: !1 }
              ).then(this._getCapabilitiesResponse, this._errorSupport);
            }
          },
          _errorSupport: function(a) {
            this.onError(a);
          },
          _getCapabilitiesResponse: function(a) {
            var b,
              d,
              h,
              l,
              e,
              g = new DOMParser();
            try {
              var k = g.parseFromString(a, "text/xml"),
                p = this._readExceptionReport(k, a);
              if (p)
                this.onError(
                  "WFSLayer: getCapabilities - returns exception: " + p
                );
              else {
                var q = k.documentElement.attributes.getNamedItem("version");
                if (q) {
                  this._version = q.value;
                  var r =
                      "2.0.0" === this._version
                        ? "http://www.opengis.net/wfs/2.0"
                        : "http://www.opengis.net/wfs",
                    t;
                  if ("2.0.0" === this._version)
                    for (
                      b = k.getElementsByTagNameNS(
                        "http://www.opengis.net/ows/1.1",
                        "Operation"
                      ),
                        d = 0;
                      d < b.length;
                      d++
                    )
                      (l = b[d].attributes.getNamedItem("name")) &&
                        "DescribeFeatureType" === l.value &&
                        ((t = b[d].getElementsByTagNameNS(
                          "http://www.opengis.net/ows/1.1",
                          "Get"
                        )),
                        (this.describeFeatureTypeUrl = t[0].attributes.getNamedItem(
                          "xlink:href"
                        ).value)),
                        l &&
                          "GetFeature" === l.value &&
                          ((e = b[d].getElementsByTagNameNS(
                            "http://www.opengis.net/ows/1.1",
                            "Post"
                          )),
                          (this.getFeatureUrl = e[0].attributes.getNamedItem(
                            "xlink:href"
                          ).value));
                  else if ("1.1.0" === this._version)
                    for (
                      b = k.getElementsByTagNameNS(
                        "http://www.opengis.net/ows",
                        "Operation"
                      ),
                        d = 0;
                      d < b.length;
                      d++
                    )
                      (l = b[d].attributes.getNamedItem("name")) &&
                        "DescribeFeatureType" === l.value &&
                        ((t = b[d].getElementsByTagNameNS(
                          "http://www.opengis.net/ows",
                          "Get"
                        )),
                        (this.describeFeatureTypeUrl = t[0].attributes.getNamedItem(
                          "xlink:href"
                        ).value)),
                        l &&
                          "GetFeature" === l.value &&
                          (e = b[d].getElementsByTagNameNS(
                            "http://www.opengis.net/ows",
                            "Post"
                          )) &&
                          e.length &&
                          (this.getFeatureUrl = e[0].attributes.getNamedItem(
                            "xlink:href"
                          ).value);
                  else if ("1.0.0" === this._version) {
                    var u = k.getElementsByTagNameNS(r, "DescribeFeatureType");
                    if (!u || !u.length) {
                      this.onError(
                        "WFSLayer: getCapabilities - no describeFeatureType info"
                      );
                      return;
                    }
                    t = u[0].getElementsByTagNameNS(r, "Get");
                    this.describeFeatureTypeUrl = t[0].attributes.getNamedItem(
                      "onlineResource"
                    ).value;
                    var x = k.getElementsByTagNameNS(r, "GetFeature");
                    if (!x || !x.length) {
                      this.onError(
                        "WFSLayer: getCapabilities - no GetFeature info"
                      );
                      return;
                    }
                    (e = x[0].getElementsByTagNameNS(r, "Post")) &&
                      e.length &&
                      (this.getFeatureUrl = e[0].attributes.getNamedItem(
                        "onlineResource"
                      ).value);
                  }
                  this._nsLayerNames = {};
                  a = [];
                  var v = k.getElementsByTagNameNS(r, "FeatureTypeList");
                  for (d = 0; d < v.length; d++) {
                    var C = v[d].getElementsByTagNameNS(r, "FeatureType");
                    for (h = 0; h < C.length; h++) {
                      var w = C[h],
                        f = w.getElementsByTagNameNS(r, "Name")[0],
                        O = f.textContent,
                        S = O.indexOf(":"),
                        y = O.substring(0, S),
                        z = O.substring(S + 1),
                        A = f.lookupNamespaceURI(y);
                      null === A && (A = f.lookupNamespaceURI(null));
                      this._nsLayerNames[z] = { prefix: y, namespace: A };
                      var E = w.getElementsByTagNameNS(r, "Title"),
                        I = 0 < E.length ? E[0].textContent : "";
                      "" === I && (I = z);
                      this.spatialReferences = this._readFactoryCodes(
                        this._version,
                        w
                      );
                      var N = this._readDefaultBBOX(this._version, w);
                      a.push({
                        name: z,
                        title: I,
                        spatialReferences: this.spatialReferences,
                        extent: N
                      });
                    }
                  }
                  this._describeFeatureType();
                  var H = this._getCapabilitiesCallback;
                  H && H(a);
                } else
                  this.onError(
                    "WFSLayer: getCapabilities - document not recognized."
                  );
              }
            } catch (G) {
              this.onError("WFSLayer: getCapabilities - parsing error");
            }
          },
          _readFactoryCodes: function(a, b) {
            var c,
              h = [];
            if ("2.0.0" === a || "1.1.0" === a) {
              a = b.getElementsByTagNameNS("*", "DefaultSRS");
              this._addCodeList(h, a[0]);
              a = b.getElementsByTagNameNS("*", "DefaultCRS");
              this._addCodeList(h, a[0]);
              a = b.getElementsByTagNameNS("*", "OtherSRS");
              for (c = 0; c < a.length; c++) this._addCodeList(h, a[c]);
              a = b.getElementsByTagNameNS("*", "OtherCRS");
              for (c = 0; c < a.length; c++) this._addCodeList(h, a[c]);
            } else
              "1.0.0" === a &&
                ((a = b.getElementsByTagNameNS("*", "SRS")),
                this._addCodeList(h, a[0]));
            for (b = !1; 0 < h.length; ) {
              4326 === h[0] && (b = !0);
              break;
            }
            b || h.push(4326);
            return h;
          },
          _addCodeList: function(a, b) {
            b &&
              ((b = b.textContent.match(/\d+/g)),
              0 < b.length &&
                ((b = parseInt(b[b.length - 1], 10)),
                84 === b && (b = 4326),
                a.push(b)));
          },
          _readDefaultBBOX: function(a, b) {
            var c, h, d, e;
            if ("2.0.0" === a || "1.1.0" === a) {
              c = b.getElementsByTagNameNS("*", "WGS84BoundingBox");
              if (!c[0] || !c[0].attributes) return [];
              h = c[0].getElementsByTagNameNS("*", "LowerCorner");
              e = c[0].getElementsByTagNameNS("*", "UpperCorner");
              if (0 >= h.length || 0 >= e.length) return [];
              d = h[0].textContent;
              c = d.indexOf(" ");
              h = d.substring(0, c);
              d = d.substring(c + 1);
              c = e[0].textContent;
              a = c.indexOf(" ");
              e = c.substring(0, a);
              c = c.substring(a + 1);
            } else if ("1.0.0" === a) {
              c = b.getElementsByTagNameNS("*", "LatLongBoundingBox");
              if (!c[0] || !c[0].attributes) return [];
              h = c[0].attributes.getNamedItem("minx").value;
              d = c[0].attributes.getNamedItem("miny").value;
              e = c[0].attributes.getNamedItem("maxx").value;
              c = c[0].attributes.getNamedItem("maxy").value;
            }
            h = parseFloat(h, 10);
            d = parseFloat(d, 10);
            e = parseFloat(e, 10);
            c = parseFloat(c, 10);
            return [h, d, e, c];
          },
          _describeFeatureType: function(a) {
            if ("" !== this._layerName)
              if ("" === this.describeFeatureTypeUrl)
                this.onError("WFSLayer: invalid describeFeatureType url");
              else if ("" === this._wkid)
                this.onError("WFSLayer: invalid wkid");
              else if ("snapshot" !== this._mode && "onDemand" !== this._mode)
                this.onError("WFSLayer: invalid mode");
              else if (
                "" === this._maxFeatures ||
                0 > this._maxFeatures ||
                1e6 < this._maxFeatures
              )
                this.onError("WFSLayer: invalid maxFeatures");
              else {
                this._describeFeatureTypeCallback = a;
                var c = b.trim(this.describeFeatureTypeUrl);
                if ("" !== c) {
                  var d = -1 === c.indexOf("?") ? "?" : "\x26",
                    h = this._nsLayerNames[this._layerName];
                  if (void 0 === h) this.onError("WFSLayer: invalid layerName");
                  else
                    (a = h.prefix),
                      (h = h.namespace),
                      (c =
                        c +
                        d +
                        "service\x3dWFS\x26request\x3dDescribeFeatureType\x26version\x3d" +
                        this._version),
                      (c += "\x26typeName\x3d"),
                      "" !== a && (c += a + ":"),
                      (c += encodeURIComponent(this._layerName)),
                      "" !== a &&
                        (c +=
                          "\x26namespace\x3dxmlns(" +
                          a +
                          "\x3d" +
                          encodeURIComponent(h) +
                          ")"),
                      (c = this._appendCustomParameters(c)),
                      x(
                        {
                          url: c,
                          handleAs: "text",
                          headers: { "Content-Type": null }
                        },
                        { usePost: !1 }
                      ).then(
                        this._describeFeatureTypeResponse,
                        this._errorSupport
                      );
                }
              }
          },
          _describeFeatureTypeResponse: function(a) {
            var b;
            b = new DOMParser().parseFromString(a, "text/xml");
            if ((a = this._readExceptionReport(b, a)))
              this.onError(
                "WFSLayer: DescribeFeatureType - returns exception: " + a
              );
            else {
              this.fields = [];
              a = b.getElementsByTagNameNS(
                "http://www.w3.org/2001/XMLSchema",
                "schema"
              );
              for (b = 0; b < a.length; b++) {
                var d = this._readAllFields(a[b]);
                null !== d &&
                  ((this._layerDefinedGeometryType = d[0]),
                  (this.fields = d[1]));
              }
              (this.geometryType && "" !== this.geometryType) ||
                (this.geometryType = this._layerDefinedGeometryType);
              for (b = 0; b < this.fields.length; b++)
                (a = this.fields[b]),
                  "esriFieldTypeGeometry" === a.type &&
                    (this._nsGeometryFieldName = a.name);
              this.layerNamespace = this._nsLayerNames[
                this._layerName
              ].namespace;
              if (0 === this.fields.length)
                this.onError(
                  "WFSLayer: DescribeFeatureType - can't get fields"
                );
              else
                this._getFeature(),
                  (b = this._describeFeatureTypeCallback) && b(this.fields);
            }
          },
          _readAllFields: function(a) {
            for (var b = a.childNodes, d = 0; d < b.length; d++) {
              var h = b[d];
              if ("element" === h.localName) {
                var l = h.attributes;
                if (l.name.value === this._layerName)
                  return (b = l.type)
                    ? ((h = b.value),
                      (b = h.indexOf(":")),
                      (h = h.substring(b + 1)),
                      this._readFieldsFromGlobalComplextType(a, h))
                    : this._readFieldsFromLocalComplextType(h);
              }
            }
            return null;
          },
          _readFieldsFromGlobalComplextType: function(a, b) {
            a = a.childNodes;
            for (var c = 0; c < a.length; c++) {
              var h = a[c];
              if (
                "complexType" === h.localName &&
                h.attributes.name.value === b
              )
                return this._readFieldsFromLocalComplextType(h);
            }
            return null;
          },
          _readFieldsFromLocalComplextType: function(a) {
            for (
              var b = [],
                d = "esriGeometryComplex",
                h = a.getElementsByTagNameNS(
                  "http://www.w3.org/2001/XMLSchema",
                  "element"
                ),
                l = 0;
              l < h.length;
              l++
            ) {
              var e = h[l],
                g = "",
                k = e.attributes.getNamedItem("name");
              k && (g = k.value);
              if ("" !== g) {
                var p = (a = ""),
                  q = e.attributes.getNamedItem("type"),
                  k = "unknown";
                if (null !== q) {
                  var p = q.value,
                    r = p.indexOf(":");
                  a = p.substring(0, r);
                  p = p.substring(r + 1);
                  k = q.lookupNamespaceURI(a);
                  null === k && (k = q.lookupNamespaceURI(null));
                }
                if ("" === p)
                  for (var e = e.childNodes, t = 0; t < e.length; t++)
                    if (((a = e[t]), "simpleType" === a.localName)) {
                      a = a.childNodes;
                      for (t = 0; t < a.length; t++)
                        if (
                          ((node2 = a[t]), "restriction" === node2.localName)
                        ) {
                          q = node2.attributes.getNamedItem("base");
                          p = q.value;
                          r = p.indexOf(":");
                          a = p.substring(0, r);
                          p = p.substring(r + 1);
                          break;
                        }
                      if ("" !== p) break;
                    }
                e = "Unknown";
                switch (p) {
                  case "integer":
                  case "nonPositiveInteger":
                  case "negativeInteger":
                  case "long":
                  case "int":
                  case "short":
                  case "byte":
                  case "nonNegativeInteger":
                  case "unsignedLong":
                  case "unsignedInt":
                  case "unsignedShort":
                  case "unsignedByte":
                  case "positiveInteger":
                    e = "esriFieldTypeInteger";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "float":
                  case "double":
                  case "decimal":
                    e = "esriFieldTypeDouble";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "boolean":
                  case "string":
                  case "gYearMonth":
                  case "gYear":
                  case "gMonthDay":
                  case "gDay":
                  case "gMonth":
                  case "anyURI":
                  case "QName":
                  case "NOTATION":
                  case "normalizedString":
                  case "token":
                  case "language":
                  case "IDREFS":
                  case "ENTITIES":
                  case "NMTOKEN":
                  case "NMTOKENS":
                  case "Name":
                  case "NCName":
                  case "ID":
                  case "IDREF":
                  case "ENTITY":
                    e = "esriFieldTypeString";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "duration":
                  case "dateTime":
                  case "time":
                  case "date":
                    e = "esriFieldTypeDate";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "PointPropertyType":
                  case "MultiPointPropertyType":
                    e = "esriFieldTypeGeometry";
                    d = "esriGeometryPoint";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "MultiCurvePropertyType":
                  case "MultiLineStringPropertyType":
                    e = "esriFieldTypeGeometry";
                    d = "esriGeometryPolyline";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "MultiSurfacePropertyType":
                  case "MultiPolygonPropertyType":
                    e = "esriFieldTypeGeometry";
                    d = "esriGeometryPolygon";
                    b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                    break;
                  case "GeometryPropertyType":
                  case "MultiGeometryPropertyType":
                    (e = "esriFieldTypeGeometry"),
                      (d = "esriGeometryComplex"),
                      b.push({ name: g, alias: g, type: e, wfsNamespace: k });
                }
              }
            }
            return [d, b];
          },
          _getFeature: function() {
            var a;
            a =
              "\x3c?xml version\x3d'1.0' encoding\x3d'utf-8'?\x3e\n\x3cGetFeature \n xmlns:xsi\x3d'http://www.w3.org/2001/XMLSchema-instance'\n xmlns:gml\x3d'http://www.opengis.net/gml'\n xmlns:ogc\x3d'http://www.opengis.net/ogc'\n xmlns:wfs\x3d'http://www.opengis.net/wfs'\n";
            a =
              "2.0.0" === this._version
                ? a + " xmlns\x3d'http://www.opengis.net/wfs/2.0'\n"
                : a + " xmlns\x3d'http://www.opengis.net/wfs'\n";
            var b = this._nsLayerNames[this._layerName];
            if (void 0 === b) this.onError("WFSLayer: invalid layerName");
            else {
              var d = b.prefix,
                b = b.namespace;
              if (
                "ondemand" === this._mode.toLowerCase() &&
                "" === this._nsGeometryFieldName
              )
                this.onError(
                  "WFSLayer: GetFeature - can't use 'onDemand' mode as geometryFieldName is unknown."
                );
              else if (
                ((a += " xmlns:" + d + "\x3d'" + b + "'\n"),
                (a =
                  "2.0.0" === this._version
                    ? a +
                      (" version\x3d'" +
                        this._version +
                        "' service\x3d'WFS' count\x3d'" +
                        this._maxFeatures +
                        "'\x3e\n")
                    : a +
                      (" version\x3d'" +
                        this._version +
                        "' service\x3d'WFS' maxFeatures\x3d'" +
                        this._maxFeatures +
                        "'\x3e\n")),
                (a =
                  "2.0.0" === this._version
                    ? a +
                      (" \x3cQuery typeNames\x3d'" +
                        d +
                        ":" +
                        this._layerName +
                        "' srsName\x3d'EPSG:" +
                        this._wkid +
                        "'\x3e\n")
                    : a +
                      (" \x3cwfs:Query typeName\x3d'" +
                        d +
                        ":" +
                        this._layerName +
                        "' srsName\x3d'EPSG:" +
                        this._wkid +
                        "'\x3e\n")),
                "ondemand" === this._mode.toLowerCase() &&
                  ((a =
                    a +
                    "  \x3cogc:Filter xmlns:ogc\x3d'http://www.opengis.net/ogc'\x3e\n   \x3cogc:BBOX\x3e\n" +
                    ("    \x3cogc:PropertyName\x3e" +
                      d +
                      ":" +
                      this._nsGeometryFieldName +
                      "\x3c/ogc:PropertyName\x3e\n")),
                  (a +=
                    "    \x3cgml:Box srsName\x3d'EPSG:" +
                    this._wkid +
                    "'\x3e\n"),
                  (a = this._inverseFilter
                    ? a +
                      "      \x3cgml:coordinates\x3e{ymin},{xmin} {ymax},{xmax}\x3c/gml:coordinates\x3e\n"
                    : a +
                      "      \x3cgml:coordinates\x3e{xmin},{ymin} {xmax},{ymax}\x3c/gml:coordinates\x3e\n"),
                  (a +=
                    "    \x3c/gml:Box\x3e\n   \x3c/ogc:BBOX\x3e\n  \x3c/ogc:Filter\x3e\n")),
                (a =
                  "2.0.0" === this._version
                    ? a + " \x3c/Query\x3e\n"
                    : a + " \x3c/wfs:Query\x3e\n"),
                (this._getFeatureRequest = a + "\x3c/GetFeature\x3e\n"),
                "" === this.getFeatureUrl)
              )
                this.onError(
                  "WFSLayer: getFeature - server doesn't support POST method."
                );
              else if (
                "" !== this._getFeatureRequest &&
                this._map &&
                null !== this._map.spatialReference.wkid
              ) {
                a = this._getFeatureRequest;
                if ("ondemand" === this._mode.toLowerCase()) {
                  a = this._map.extent.xmin;
                  var d = this._map.extent.ymin,
                    b = this._map.extent.xmax,
                    h = this._map.extent.ymax,
                    l = {},
                    e = this._map.spatialReference,
                    g = new C(this._wkid);
                  this._projectFromSRToSR(e, g, a, d, l) &&
                    ((a = l.x), (d = l.y));
                  this._projectFromSRToSR(e, g, b, h, l) &&
                    ((b = l.x), (h = l.y));
                  a = this._getFeatureRequest
                    .replace(/{xmin}/, a)
                    .replace(/{ymin}/, d)
                    .replace(/{xmax}/, b)
                    .replace(/{ymax}/, h);
                }
                d = this._appendCustomParameters(this.getFeatureUrl);
                x(
                  {
                    url: d,
                    handleAs: "text",
                    headers: { "Content-Type": "text/xml" },
                    postData: a
                  },
                  { usePost: !0 }
                ).then(this._parseGml, this._errorSupport);
              }
            }
          },
          _parseGml: function(a) {
            if (
              this._map &&
              this._map.spatialReference &&
              this._map.spatialReference.wkid
            ) {
              var b = new DOMParser().parseFromString(a, "text/xml");
              if ((a = this._readExceptionReport(b, a)))
                this.onError("WFSLayer: GetFeature - returns exception: " + a);
              else
                (this._gmlNS =
                  "2.0.0" === this._version
                    ? "http://www.opengis.net/gml/3.2"
                    : "http://www.opengis.net/gml"),
                  "" === this._wkid &&
                    (this._wkid = this._map.spatialReference.wkid),
                  (this._graphicArray = this._readFeatureMembers(
                    b,
                    this._wkid,
                    2,
                    this._nsLayerNames[this._layerName].namespace,
                    this._layerName
                  )),
                  (this.fullExtent = this._createFullExtent(
                    this._graphicArray
                  )),
                  this.onLabelingInfoChange(),
                  "ondemand" === this._mode.toLowerCase()
                    ? this._fireUpdateEnd()
                    : this.refresh();
            }
          },
          _limit4326: function(a) {
            for (var b = 0; b < a.length; b++) {
              var d = a[b].geometry;
              4326 === d.spatialReference.wkid &&
                ((d.x = this._limit4326X(d.x)), (d.y = this._limit4326Y(d.y)));
            }
          },
          _limit4326X: function(a) {
            180 <= a && (a = 179.99);
            -180 >= a && (a = -179.99);
            return a;
          },
          _limit4326Y: function(a) {
            90 <= a && (a = 89.99);
            -90 >= a && (a = -89.99);
            return a;
          },
          _createFullExtent: function(a) {
            for (var b = null, d = 0; d < a.length; d++) {
              var h = a[d].geometry,
                l = null;
              (l =
                "point" === h.geometryType
                  ? new I(h.x, h.y, h.x, h.y, h.spatialReference)
                  : h.getExtent()) && (b = null === b ? l : b.union(l));
            }
            return b;
          },
          _readExceptionReport: function(a, b) {
            return 0 <
              a.getElementsByTagNameNS("*", "ExceptionReport").length ||
              0 < a.getElementsByTagNameNS("*", "ServiceExceptionReport").length
              ? b
              : "";
          },
          _readFeatureMembers: function(a, b, d, h, l) {
            var c, e, g, n;
            e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            var k = [];
            g = a.getElementsByTagNameNS("*", "featureMembers");
            for (e = 0; e < g.length; e++)
              for (
                c = g[e],
                  n = c.getElementsByTagNameNS(h, l),
                  0 === n.length && (n = c.getElementsByTagNameNS(null, l)),
                  0 === n.length && (n = c.getElementsByTagNameNS("*", l)),
                  c = 0;
                c < n.length;
                c++
              )
                this._readLayer(k, n[c], b, d);
            g = a.getElementsByTagNameNS("*", "featureMember");
            for (e = 0; e < g.length; e++)
              for (
                c = g[e],
                  n = c.getElementsByTagNameNS(h, l),
                  0 === n.length && (n = c.getElementsByTagNameNS(null, l)),
                  0 === n.length && (n = c.getElementsByTagNameNS("*", l)),
                  c = 0;
                c < n.length;
                c++
              )
                this._readLayer(k, n[c], b, d);
            g = a.getElementsByTagNameNS("*", "member");
            for (e = 0; e < g.length; e++)
              for (
                c = g[e],
                  n = c.getElementsByTagNameNS(h, l),
                  0 === n.length && (n = c.getElementsByTagNameNS(null, l)),
                  0 === n.length && (n = c.getElementsByTagNameNS("*", l)),
                  c = 0;
                c < n.length;
                c++
              )
                this._readLayer(k, n[c], b, d);
            return k;
          },
          _readLayer: function(a, b, d, h) {
            var c, e;
            e = this._readSrsDimension(b);
            0 !== e && (h = e);
            var g = b.childNodes,
              n = "",
              k = null;
            for (b = 0; b < g.length; b++)
              if (
                ((c = g[b]),
                1 == c.nodeType && ((e = c.localName), "boundedBy" !== e))
              ) {
                c = this._readGeometry(c, d, h);
                if (!this._isProjectedOk) {
                  this._isProjectedOk = !0;
                  console.error("WFSLayer: could not project geometry.");
                  break;
                }
                if (
                  null !== c &&
                  ((k = c),
                  (n = e),
                  "point" !== k.geometryType ||
                    ("esriGeometryPolygon" !== this.geometryType &&
                      "esriGeometryPolyline" !== this.geometryType))
                )
                  break;
              }
            if (k) {
              d = {};
              for (b = 0; b < g.length; b++)
                if (
                  ((c = g[b]), (e = c.localName), (h = c.textContent), e !== n)
                )
                  for (c = 0; c < this.fields.length; c++) {
                    var p = this.fields[c];
                    p.name == e &&
                      (d[e] =
                        "esriFieldTypeDouble" === p.type
                          ? parseFloat(h, 10)
                          : "esriFieldTypeInteger" === p.type
                          ? parseInt(h, 10)
                          : h.trim());
                  }
              this._convertWFSGeometryToGraphicObjects(a, k, d);
            }
          },
          _convertWFSGeometryToGraphicObjects: function(a, b, d) {
            var c;
            if (
              "point" === b.geometryType &&
              ("esriGeometryPoint" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new v()),
                (b = new H(b)),
                c.setGeometry(b),
                c.setAttributes(d),
                a.push(c);
            else if (
              "multipoint" === b.geometryType &&
              ("esriGeometryPoint" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new v()),
                (b = new J(b)),
                c.setGeometry(b),
                c.setAttributes(d),
                a.push(c);
            else if (
              "polyline" === b.geometryType &&
              ("esriGeometryPolyline" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new v()),
                (b = new M(b)),
                c.setGeometry(b),
                c.setAttributes(d),
                a.push(c);
            else if (
              "polygon" === b.geometryType &&
              ("esriGeometryPolygon" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new v()),
                (b = new Q(b)),
                c.setGeometry(b),
                c.setAttributes(d),
                a.push(c);
            else if ("multigeometry" === b.geometryType)
              for (c = 0; c < b.length; c++)
                this._convertWFSGeometryToGraphicObjects(a, b[c], d);
          },
          _readGeometry: function(a, b, d) {
            var c, e;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            e = a.getElementsByTagNameNS(this._gmlNS, "MultiSurface");
            if (1 <= e.length)
              for (c = 0; c < e.length; )
                return this._readMultiSurface(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "MultiCurve");
            if (1 <= e.length) {
              var g = [];
              for (c = 0; c < e.length; c++) {
                var n = this._readMultiCurve(e[c], b, d);
                for (a = 0; a < n.length; a++) g.push(n[a]);
              }
              return {
                geometryType: "polyline",
                paths: g,
                spatialReference: { wkid: this._map.spatialReference.wkid }
              };
            }
            e = a.getElementsByTagNameNS(this._gmlNS, "MultiGeometry");
            for (c = 0; c < e.length; )
              return this._readMultiGeometry(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Geometry");
            for (c = 0; c < e.length; ) return this._readGeometry(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "GeometryCollection");
            for (c = 0; c < e.length; )
              return this._readGeometryCollection(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Surface");
            for (c = 0; c < e.length; ) return this._readSurface(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Curve");
            for (c = 0; c < e.length; ) return this._readCurve(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "MultiPolygon");
            for (c = 0; c < e.length; )
              return this._readMultiPolygon(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (c = 0; c < e.length; ) return this._readPolygon(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "MultiLineString");
            for (c = 0; c < e.length; )
              return this._readMultiLineString(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (c = 0; c < e.length; ) {
              b = this._readLineString(e[c], b, d);
              d = {
                geometryType: "polyline",
                paths: [],
                spatialReference: { wkid: this._map.spatialReference.wkid }
              };
              c = [];
              for (a = 0; a < b.length; a++) c.push(b[a]);
              d.paths.push(c);
              return d;
            }
            e = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
            for (c = 0; c < e.length; ) return this._readLinearRing(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Box");
            if (1 <= e.length)
              for (c = 0; c < e.length; ) return this._readBox(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Envelope");
            for (c = 0; c < e.length; ) return this._readEnvelope(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "MultiPoint");
            if (1 <= e.length)
              for (c = 0; c < e.length; )
                return this._readMultiPoint(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "Point");
            for (c = 0; c < e.length; ) return this._readPoint(e[c], b, d);
            return null;
          },
          _readGeometryCollection: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "geometryMember");
            for (a = 0; a < c.length; a++) {
              var g = this._readGeometryMember(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readMultiGeometry: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "geometryMember");
            for (a = 0; a < c.length; a++) {
              var g = this._readGeometryMember(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readSurface: function(a, b, d) {
            var c, e;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            var g = [];
            g.geometryType = "multigeometry";
            g.spatialReference = { wkid: this._map.spatialReference.wkid };
            e = a.getElementsByTagNameNS(this._gmlNS, "Point");
            for (c = 0; c < e.length; c++) g.push(this._readPoint(e[c], b, d));
            e = a.getElementsByTagNameNS(this._gmlNS, "patches");
            for (c = 0; c < e.length; c++) {
              a = this._readPatches(e[c], b, d);
              for (var n = 0; n < a.length; n++) g.push(a[n]);
            }
            return g;
          },
          _readMultiSurface: function(a, b, d) {
            var c, e, g;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            var n = [];
            n.geometryType = "multigeometry";
            n.spatialReference = { wkid: this._map.spatialReference.wkid };
            g = a.getElementsByTagNameNS(this._gmlNS, "surfaceMember");
            for (c = 0; c < g.length; c++) {
              var k = this._readSurfaceMember(g[c], b, d);
              for (e = 0; e < k.length; e++) n.push(k[e]);
            }
            g = a.getElementsByTagNameNS(this._gmlNS, "surfaceMembers");
            for (c = 0; c < g.length; c++)
              for (
                a = this._readSurfaceMembers(g[c], b, d), e = 0;
                e < a.length;
                e++
              )
                n.push(a[e]);
            return n;
          },
          _readCurve: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = {
              geometryType: "polyline",
              paths: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            c = a.getElementsByTagNameNS(this._gmlNS, "segments");
            for (a = 0; a < c.length; a++)
              for (
                var g = this._readSegments(c[a], b, d), n = 0;
                n < g.length;
                n++
              )
                e.paths.push(g[n]);
            return e;
          },
          _readSegments: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "LineStringSegment");
            for (a = 0; a < c.length; a++) {
              var g = this._readLineStringSegment(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readLineStringSegment: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "posList");
              0 < a.length;

            )
              return this._readPosList(a[0], b, d);
          },
          _readMultiCurve: function(a, b, d) {
            var c, e, g, n;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            var k = [];
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            g = a.getElementsByTagNameNS(this._gmlNS, "curveMember");
            for (c = 0; c < g.length; c++)
              for (
                n = this._readCurveMember(g[c], b, d), e = 0;
                e < n.length;
                e++
              )
                k.push(n[e]);
            g = a.getElementsByTagNameNS(this._gmlNS, "curveMembers");
            for (c = 0; c < g.length; c++)
              for (
                n = this._readCurveMembers(g[c], b, d), e = 0;
                e < n.length;
                e++
              )
                k.push(n[e]);
            return k;
          },
          _readGeometryMember: function(a, b, d) {
            var c, e;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            e = a.getElementsByTagNameNS(this._gmlNS, "Point");
            for (c = 0; c < e.length; ) return this._readPoint(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (c = 0; c < e.length; ) {
              b = this._readLineString(e[c], b, d);
              d = {
                geometryType: "polyline",
                paths: [],
                spatialReference: { wkid: this._map.spatialReference.wkid }
              };
              c = [];
              for (a = 0; a < b.length; a++) c.push(b[a]);
              d.paths.push(c);
              return d;
            }
            e = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (c = 0; c < e.length; ) return this._readPolygon(e[c], b, d);
            return null;
          },
          _readSurfaceMember: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (a = 0; a < c.length; a++) {
              var g = this._readPolygon(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readSurfaceMembers: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (a = 0; a < c.length; a++) {
              var g = this._readPolygon(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readCurveMember: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (a = 0; a < c.length; a++) {
              var g = this._readLineString(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readCurveMembers: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (a = 0; a < c.length; a++) {
              var g = this._readLineString(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readBox: function(a, b, d) {
            var c,
              e,
              g,
              n,
              k,
              p,
              q,
              r = this._readWkidFromNode(a);
            -1 != r && (b = r);
            r = this._readSrsDimension(a);
            0 !== r && (d = r);
            r = {
              geometryType: "polygon",
              rings: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            e = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < e.length; c++)
              if ((g = this._readCoordinates(e[c], b, d)))
                return (
                  1 <= g.length && ((n = p = g[0][0]), (k = q = g[0][1])),
                  1 <= g.length && ((p = g[1][0]), (q = g[1][1])),
                  r.rings.push([
                    [n, k],
                    [n, q],
                    [p, q],
                    [p, k],
                    [n, k]
                  ]),
                  r
                );
            e = a.getElementsByTagNameNS(this._gmlNS, "coord");
            return 2 <= e.length
              ? ((a = this._readCoord(e[0], b, d)) &&
                  1 <= a.length &&
                  ((n = p = a[0][0]), (k = q = a[0][1])),
                (b = this._readCoord(e[1], b, d)) &&
                  1 <= b.length &&
                  ((p = b[0][0]), (q = b[0][1])),
                r.rings.push([
                  [n, k],
                  [n, q],
                  [p, q],
                  [p, k],
                  [n, k]
                ]),
                r)
              : null;
          },
          _readEnvelope: function(a, b, d) {
            var c, e, g, n;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            e = a.getElementsByTagNameNS(this._gmlNS, "lowerCorner");
            for (c = 0; c < e.length; c++) {
              var k = this._readCoordinates(e[c], b, d);
              k && (g = k[0]);
            }
            e = a.getElementsByTagNameNS(this._gmlNS, "upperCorner");
            for (c = 0; c < e.length; c++)
              (a = this._readCoordinates(e[c], b, d)) && (n = a[0]);
            return g && n
              ? {
                  geometryType: "polygon",
                  rings: [
                    [
                      [g[0], g[1]],
                      [g[0], n[1]],
                      [n[0], n[1]],
                      [n[0], g[1]],
                      [g[0], g[1]]
                    ]
                  ],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                }
              : null;
          },
          _readPolygon: function(a, b, d) {
            var c, e, g;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            var n = {
              geometryType: "polygon",
              rings: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            e = a.getElementsByTagNameNS(this._gmlNS, "outerBoundaryIs");
            for (c = 0; c < e.length; c++)
              (g = this._readOuterBoundaryIs(e[c], b, d)), n.rings.push(g);
            e = a.getElementsByTagNameNS(this._gmlNS, "innerBoundaryIs");
            for (c = 0; c < e.length; c++)
              (g = this._readInnerBoundaryIs(e[c], b, d)), n.rings.push(g);
            e = a.getElementsByTagNameNS(this._gmlNS, "exterior");
            for (c = 0; c < e.length; c++)
              (g = this._readExterior(e[c], b, d)), n.rings.push(g);
            e = a.getElementsByTagNameNS(this._gmlNS, "interior");
            for (c = 0; c < e.length; c++)
              (g = this._readInterior(e[c], b, d)), n.rings.push(g);
            return n;
          },
          _readPolygonMember: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
              0 < a.length;

            )
              return this._readPolygon(a[0], b, d);
            return null;
          },
          _readMultiPolygon: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "polygonMember");
            for (a = 0; a < c.length; a++) {
              var g = this._readPolygonMember(c[a], b, d);
              e.push(g);
            }
            return e;
          },
          _readOuterBoundaryIs: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], b, d);
            return null;
          },
          _readInnerBoundaryIs: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], b, d);
            return null;
          },
          _readExterior: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], b, d);
            return null;
          },
          _readInterior: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], b, d);
            return null;
          },
          _readPatches: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = [];
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "PolygonPatch");
            for (a = 0; a < c.length; a++)
              e.push(this._readPolygon(c[a], b, d));
            return e;
          },
          _readLineString: function(a, b, d) {
            var c, e, g, k, n;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            var p = [];
            p.spatialReference = { wkid: this._map.spatialReference.wkid };
            g = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < g.length; c++)
              if ((k = this._readCoordinates(g[c], b, d)))
                for (e = 0; e < k.length; e++) (n = k[e]), p.push(n);
            g = a.getElementsByTagNameNS(this._gmlNS, "coord");
            for (c = 0; c < g.length; c++)
              if ((k = this._readCoord(g[c], b, d)))
                for (e = 0; e < k.length; e++) (n = k[e]), p.push(n);
            g = a.getElementsByTagNameNS(this._gmlNS, "posList");
            for (c = 0; c < g.length; c++)
              if ((k = this._readPosList(g[c], b, d)))
                for (e = 0; e < k.length; e++) (n = k[e]), p.push(n);
            return p;
          },
          _readLineStringMember: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LineString");
              0 < a.length;

            )
              return this._readLineString(a[0], b, d);
            return null;
          },
          _readMultiLineString: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = {
              geometryType: "polyline",
              paths: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            c = a.getElementsByTagNameNS(this._gmlNS, "lineStringMember");
            for (a = 0; a < c.length; a++) {
              var g = this._readLineStringMember(c[a], b, d);
              g && e.paths.push(g);
            }
            return 1 <= e.paths.length ? e : null;
          },
          _readPoint: function(a, b, d) {
            var c, e, g;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            e = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < e.length; c++)
              if ((g = this._readCoordinates(e[c], b, d)))
                return {
                  geometryType: "point",
                  x: g[0][0],
                  y: g[0][1],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                };
            e = a.getElementsByTagNameNS(this._gmlNS, "pos");
            for (c = 0; c < e.length; c++)
              if ((g = this._readPos(e[c], b, d)) && 0 < g.length)
                return {
                  geometryType: "point",
                  x: g[0][0],
                  y: g[0][1],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                };
            e = a.getElementsByTagNameNS(this._gmlNS, "coord");
            for (c = 0; c < e.length; c++)
              if ((a = this._readCoord(e[c], b, d)))
                return {
                  geometryType: "point",
                  x: a[0][0],
                  y: a[0][1],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                };
            return null;
          },
          _readPointMember: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "Point");
              0 < a.length;

            )
              return this._readPoint(a[0], b, d);
            return null;
          },
          _readMultiPoint: function(a, b, d) {
            var c,
              e = this._readWkidFromNode(a);
            -1 != e && (b = e);
            e = this._readSrsDimension(a);
            0 !== e && (d = e);
            e = {
              geometryType: "multipoint",
              points: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            c = a.getElementsByTagNameNS(this._gmlNS, "pointMember");
            for (a = 0; a < c.length; a++) {
              var g = this._readPointMember(c[a], b, d);
              g && e.points.push([g.x, g.y]);
            }
            return 1 <= e.points.length ? e : null;
          },
          _readLinearRing: function(a, b, d) {
            var c, e;
            c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            e = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < e.length; )
              return this._readCoordinates(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "posList");
            for (c = 0; c < e.length; )
              return this._readCoordinates(e[c], b, d);
            e = a.getElementsByTagNameNS(this._gmlNS, "pos");
            for (c = 0; c < e.length; ) return this._readPos(e[c], b, d);
          },
          _readCoordinatesBody: function(a, b, d) {
            var c,
              e = new C(a);
            b = b.trim();
            var g,
              k,
              n = [];
            n.spatialReference = { wkid: this._map.spatialReference.wkid };
            a = this._isReverse(a, this.version);
            if (b)
              if (2 === d) {
                if ((b = b.match(/[0123456789.\-\+eE]+/g)) && 2 <= b.length)
                  for (d = 0; d < b.length; d += 2)
                    (g = parseFloat(b[d])),
                      (k = parseFloat(b[d + 1])),
                      a && ((c = k), (k = g), (g = c)),
                      (c = {}),
                      this._projectFromSRToSR(
                        e,
                        this._map.spatialReference,
                        g,
                        k,
                        c
                      ) && ((g = c.x), (k = c.y)),
                      n.push([g, k]);
              } else if (
                3 === d &&
                (b = b.match(/[0123456789.\-\+eE]+/g)) &&
                3 <= b.length
              )
                for (d = 0; d < b.length; d += 3)
                  (g = parseFloat(b[d])),
                    (k = parseFloat(b[d + 1])),
                    a && ((c = k), (k = g), (g = c)),
                    (c = {}),
                    this._projectFromSRToSR(
                      e,
                      this._map.spatialReference,
                      g,
                      k,
                      c
                    ) && ((g = c.x), (k = c.y)),
                    n.push([g, k]);
            return n;
          },
          _readCoord: function(a, b, d) {
            var c,
              e,
              g,
              k,
              n = this._readWkidFromNode(a);
            -1 != n && (b = n);
            n = new C(b);
            g = this._readSrsDimension(a);
            0 !== g && (d = g);
            var p = this._isReverse(b, this.version),
              q = [];
            q.spatialReference = { wkid: this._map.spatialReference.wkid };
            g = 0;
            e = a.getElementsByTagNameNS(this._gmlNS, "X");
            for (c = 0; c < e.length; ) {
              g = this._readFloat(e[c], b, d);
              break;
            }
            k = 0;
            e = a.getElementsByTagNameNS(this._gmlNS, "Y");
            for (c = 0; c < e.length; ) {
              k = this._readFloat(e[c], b, d);
              break;
            }
            p && ((a = k), (k = g), (g = a));
            a = {};
            this._projectFromSRToSR(n, this._map.spatialReference, g, k, a) &&
              ((g = a.x), (k = a.y));
            q.push(p ? [k, g] : [g, k]);
            return q;
          },
          _readCoordinates: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            return this._readCoordinatesBody(b, a.textContent, d);
          },
          _readPos: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            return this._readCoordinatesBody(b, a.textContent, d);
          },
          _readPosList: function(a, b, d) {
            var c = this._readWkidFromNode(a);
            -1 != c && (b = c);
            c = this._readSrsDimension(a);
            0 !== c && (d = c);
            return this._readCoordinatesBody(b, a.textContent, d);
          },
          _projectFromSRToSR: function(a, b, d, e, g) {
            if (N.canProject(a, b))
              return (
                (a = new H(d, e, a)),
                (b = N.project(a, b)),
                (g.x = b.x),
                (g.y = b.y),
                !0
              );
            g.x = d;
            g.y = e;
            return (this._isProjectedOk = !1);
          },
          _readFloat: function(a) {
            return (a = a.textContent) ? parseFloat(a) : 0;
          },
          _readSrsDimension: function(a) {
            return a.attributes &&
              (a = a.attributes.getNamedItem("srsDimension"))
              ? parseInt(a.value, 10)
              : 0;
          },
          _readWkidFromNode: function(a) {
            return a.attributes &&
              (a = a.attributes.getNamedItem("srsName")) &&
              (a = a.value.match(/\d+/g)) &&
              0 < a.length
              ? ((a = parseInt(a[a.length - 1], 10)),
                84 === a && (a = 4326),
                parseInt(a, 10))
              : -1;
          },
          _isReverse: function(a, b) {
            return this._inverseResponse;
          },
          _appendCustomParameters: function(a) {
            if (this.customParameters)
              for (var b in this.customParameters)
                a +=
                  (-1 === a.indexOf("?") ? "?" : "\x26") +
                  b +
                  "\x3d" +
                  encodeURIComponent(this.customParameters[b]);
            return a;
          }
        });
        q("extend-esri") && b.setObject("layers.WFSLayer", k, A);
        return k;
      });
    },
    "widgets/Analysis/toolValidate": function() {
      define(["dojo/_base/lang", "dojo/_base/array", "./layerUtil"], function(
        k,
        d,
        b
      ) {
        return {
          isValid: function(b, d, k) {
            var e = !1;
            -1 !== d.dijitID.indexOf("MergeLayers")
              ? (e = this.mergeAvailable(b))
              : -1 !== d.dijitID.indexOf("ExtractData")
              ? (e = this.extractAvailable(b, k))
              : -1 !== d.dijitID.indexOf("GeocodeLocationsFromTable")
              ? (e = this.geocodeLocationsFromTable())
              : ((k = null),
                "requiredParam" in d && (k = d.requiredParam),
                (e = this.paramAvailable(b, d.analysisLayer, k)));
            return e;
          },
          geocodeLocationsFromTable: function() {
            var d = b.getTableInfos();
            return k.isArray(d) && 0 < d.length;
          },
          mergeAvailable: function(b) {
            return d.some(b, function(e) {
              return d.some(b, function(b) {
                return b !== e && b.geometryType === e.geometryType;
              });
            });
          },
          extractAvailable: function(b, g) {
            var e = g.getUser(),
              k = g.isPortal();
            d.forEach(
              b,
              function(b) {
                var d = "esri.layers.GeoRSSLayer" === b.declaredClass,
                  q = "esri.layers.CSVLayer" === b.declaredClass,
                  u = "esri.layers.FeatureLayer" === b.declaredClass,
                  x = "esri.layers.WFSLayer" === b.declaredClass;
                (u && !b.url) || d || q || x
                  ? this._addExtractCapability(b)
                  : u &&
                    (g.isAdmin() &&
                    ((k &&
                      b.itemInfo &&
                      b.itemInfo.itemControl &&
                      "admin" === b.itemInfo.itemControl) ||
                      (!k && b.url && -1 < b.url.indexOf("/" + e.orgId + "/")))
                      ? this._addExtractCapability(b)
                      : e &&
                        b.itemInfo &&
                        b.itemInfo.owner &&
                        b.itemInfo.owner === e.username &&
                        ((!k &&
                          b.url &&
                          -1 < b.url.indexOf("/" + e.orgId + "/")) ||
                          k) &&
                        this._addExtractCapability(b));
              },
              this
            );
            return d.some(b, function(b) {
              return b.capabilities && 0 <= b.capabilities.indexOf("Extract");
            });
          },
          _addExtractCapability: function(b) {
            b.capabilities
              ? -1 === b.capabilities.indexOf("Extract") &&
                (b.capabilities += ",Extract")
              : (b.capabilities = "Extract");
            return !0;
          },
          paramAvailable: function(b, d, k) {
            var e,
              g = !1;
            e = d.geomTypes;
            d = this.findMatchedFeatureLayers(b, e);
            0 < d.length &&
              (k
                ? ((e = k.geomTypes),
                  (b = this.findMatchedFeatureLayers(b, e)),
                  0 < b.length &&
                    (d.length !== b.length
                      ? (g = !0)
                      : 1 < d.length
                      ? (g = !0)
                      : d[0] !== b[0] && (g = !0)))
                : (g = !0));
            return g;
          },
          findMatchedFeatureLayers: function(b, g) {
            var e = [];
            d.forEach(
              b,
              k.hitch(this, function(b) {
                b &&
                  (1 === g.length
                    ? ("*" !== g[0] && g[0] !== b.geometryType) || e.push(b.id)
                    : -1 < g.indexOf(b.geometryType) && e.push(b.id));
              })
            );
            return e;
          }
        };
      });
    },
    "widgets/Analysis/PrivilegeUtil": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred dojo/promise/all jimu/portalUtils jimu/portalUrlUtils jimu/Role esri/request esri/kernel esri/lang ./PortalAnalysis".split(
        " "
      ), function(k, d, b, e, g, q, u, x, A, v, z, E) {
        var y = null,
          w = k([], {
            userRole: null,
            userPortalUrl: null,
            portalAnalysis: null,
            portalSelf: null,
            portalUrl: null,
            licenseDef: null,
            licenseLevel: null,
            federatedServers: null,
            constructor: function(b) {
              this.portalUrl = b;
            },
            _clearLoadedInfo: function() {
              this.portalUrl = this.portalSelf = this.portalAnalysis = this.userPortalUrl = this.userRole = null;
            },
            loadPrivileges: function(b) {
              b &&
                this.portalUrl !== b &&
                (this._clearLoadedInfo(), (this.portalUrl = b));
              if (this._privilegeLoaded())
                return (b = new e()), b.resolve(!0), b;
              b = q.getPortal(this.portalUrl);
              var g = new e();
              (b.haveSignIn() ? this._loadUserInfo(b) : this._signIn(b)).then(
                d.hitch(this, function(b) {
                  b && this.isPortal()
                    ? this.checkAnalysisLicense().then(function() {
                        g.resolve(b);
                      })
                    : g.resolve(b);
                })
              );
              return g;
            },
            _signIn: function(b) {
              return b.loadSelfInfo().then(
                d.hitch(this, function(b) {
                  var e = q.getPortal(b.portalHostname);
                  return null === e
                    ? !1
                    : e.signIn().then(
                        d.hitch(this, function(b) {
                          return this._loadUserInfo(e, b);
                        }),
                        function() {
                          return !1;
                        }
                      );
                }),
                function() {
                  return !1;
                }
              );
            },
            _registerOrgCredential: function(b, e) {
              e = u.getStandardPortalUrl(e);
              b = d.clone(b.toJson());
              e += "/sharing/rest";
              b.server = e;
              b.resources = [e];
              v.id.registerToken(b);
            },
            _loadUserInfo: function(b, e) {
              var k = b.loadSelfInfo();
              b = b.getHelpMap();
              return g([k, b]).then(
                d.hitch(this, function(b) {
                  var g = b[0];
                  b = b[1] && b[1].helpMap;
                  var k = {};
                  b && (k.helpMap = b.v && b.m ? b : { v: "1.0", m: b });
                  this.userPortalUrl = g.urlKey
                    ? g.urlKey + "." + g.customBaseUrl
                    : this.portalUrl;
                  return g && g.user
                    ? ((this.userRole = new x({
                        id: g.user.roleId ? g.user.roleId : g.user.role,
                        role: g.user.role
                      })),
                      g.user.privileges &&
                        this.userRole.setPrivileges(g.user.privileges),
                      (this.portalSelf = d.mixin(g, k)),
                      e && this._registerOrgCredential(e, this.userPortalUrl),
                      (this.portalAnalysis = new E(
                        this.userRole,
                        this.portalSelf
                      )),
                      !0)
                    : !1;
                }),
                function() {
                  return !1;
                }
              );
            },
            _privilegeLoaded: function() {
              return null !== this.portalSelf;
            },
            getUser: function() {
              return this._privilegeLoaded() ? this.portalSelf.user : null;
            },
            isAdmin: function() {
              return this._privilegeLoaded() ? this.userRole.isAdmin() : !1;
            },
            getUserPortal: function() {
              return this._privilegeLoaded() ? this.userPortalUrl : null;
            },
            isPortal: function() {
              return (
                null !== this.portalSelf && !0 === this.portalSelf.isPortal
              );
            },
            canPerformAnalysis: function() {
              return (
                null !== this.portalAnalysis &&
                this.portalAnalysis.canPerformAnalysis()
              );
            },
            canPerformSpatialAnalytics: function() {
              return (
                null !== this.portalAnalysis &&
                this.portalAnalysis.canPerformSpatialAnalytics()
              );
            },
            canPerformGeoAnalytics: function() {
              return (
                null !== this.portalAnalysis &&
                this.portalAnalysis.canPerformGeoAnalytics()
              );
            },
            canPerformRasterAnalysis: function() {
              return (
                null !== this.portalAnalysis &&
                this.portalAnalysis.canPerformRasterAnalysis()
              );
            },
            canPerformGeoEnrichment: function() {
              return (
                null !== this.portalAnalysis &&
                this.portalAnalysis._canPerformGeoEnrichment()
              );
            },
            hasPrivileges: function(e) {
              var g = e,
                k = !1;
              d.isArray(e) &&
                0 <= e.indexOf("svradvanced") &&
                ((k = !0),
                (g = b.filter(e, function(b) {
                  return "svradvanced" !== b;
                })));
              return k && this.isPortal()
                ? this.isAdvanceLicense() &&
                    null !== this.portalAnalysis &&
                    this.portalAnalysis.hasPrivileges(g)
                : null !== this.portalAnalysis &&
                    this.portalAnalysis.hasPrivileges(g);
            },
            isAdvanceLicense: function() {
              return "svradvanced" === this.licenseLevel;
            },
            getFederatedServers: function() {
              var b = new e();
              if (this.isPortal() && this.userRole && !this.federatedServers) {
                var g =
                  u.getSharingUrl(this.portalUrl) +
                  "/portals/" +
                  this.portalSelf.id +
                  "/servers";
                A({ url: g, content: { f: "json" } }).then(
                  d.hitch(this, function(d) {
                    this.federatedServers = d.servers;
                    b.resolve(this.federatedServers);
                  }),
                  d.hitch(this, function(d) {
                    console.log("cannot load federated servers", d);
                    this.federatedServers = [];
                    b.resolve([]);
                  })
                );
              } else b.resolve(this.federatedServers);
              return b;
            },
            getLicense: function(g) {
              var k = new e(),
                p;
              if (0 === g.length) return k.resolve(null), k;
              g = b.filter(
                g,
                function(b) {
                  return "HOSTING_SERVER" === b.serverRole;
                },
                this
              );
              0 < g.length && (p = g[0]);
              g = u.getSharingUrl(this.portalUrl);
              A({
                url: g + "/portals/" + this.portalSelf.id + "/servers/" + p.id,
                content: { f: "json" }
              }).then(
                d.hitch(this, function(b) {
                  var e = d.mixin({}, b);
                  b =
                    z.isDefined(b.edition) || z.isDefined(b.level)
                      ? null
                      : "svradvanced";
                  this.licenseLevel = e.edition ? e.edition.name : b;
                  k.resolve({
                    licenseInfo: e,
                    licenseLevel: this.licenseLevel
                  });
                }),
                d.hitch(this, function(b) {
                  console.log("cannot load hostingServer info", b);
                  k.resolve({});
                })
              );
              return k;
            },
            checkAnalysisLicense: function() {
              var b = new e();
              this.licenseDef
                ? this.licenseDef.isResolved()
                  ? b.resolve("svradvanced" === this.licenseLevel)
                  : this.licenseDef.then(
                      d.hitch(this, function() {
                        b.resolve("svradvanced" === this.licenseLevel);
                      })
                    )
                : ((this.licenseDef = this.getFederatedServers().then(
                    d.hitch(this, function(b) {
                      return this.getLicense(b);
                    })
                  )),
                  this.licenseDef.then(
                    d.hitch(this, function() {
                      return b.resolve("svradvanced" === this.licenseLevel);
                    })
                  ));
              return b;
            }
          });
        w.getInstance = function(b) {
          null === y && (y = new w(b));
          return y;
        };
        return w;
      });
    },
    "widgets/Analysis/PortalAnalysis": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "esri/lang"
      ], function(k, d, b, e) {
        return k([], {
          userRole: null,
          portalSelf: null,
          constructor: function(b, d) {
            this.userRole = b;
            this.portalSelf = d;
          },
          canPerformAnalysis: function() {
            var b = !1;
            this.userRole &&
            (this.userRole.isAdmin() || this.userRole.isPublisher())
              ? (b = !0)
              : this.userRole &&
                this.userRole.isCustom() &&
                (b =
                  this.userRole.canCreateItem() &&
                  this.userRole.canPublishFeatures() &&
                  this.userRole.canUseSpatialAnalysis());
            this.portalSelf &&
              this.portalSelf.isPortal &&
              (b =
                b &&
                e.isDefined(this.portalSelf.helperServices.analysis) &&
                e.isDefined(this.portalSelf.helperServices.analysis.url));
            return b;
          },
          canPerformSpatialAnalytics: function() {
            return (
              e.isDefined(this.portalSelf.helperServices.analysis) &&
              e.isDefined(this.portalSelf.helperServices.analysis.url)
            );
          },
          canPerformGeoAnalytics: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.geoanalytics) &&
              e.isDefined(this.portalSelf.helperServices.geoanalytics.url);
            return this.canPerformAnalysis() && b;
          },
          canPerformRasterAnalysis: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.rasterAnalytics) &&
              e.isDefined(this.portalSelf.helperServices.rasterAnalytics.url);
            return this.canPerformAnalysis() && b;
          },
          hasPrivileges: function(e) {
            return d.isArray(e) && 0 < e.length
              ? b.every(
                  e,
                  function(b) {
                    return "networkanalysis" === b
                      ? this._canPerformNetworkAnalysis()
                      : "geoenrichment" === b
                      ? this._canPerformGeoEnrichment()
                      : "elevation" === b
                      ? this._canPerformElevationAnalysis()
                      : "drivetimearea" === b
                      ? this._canPerformDriveAnalysis()
                      : "planroutes" === b
                      ? this._canPerformPlanRoutesAnalysis()
                      : "od" === b
                      ? this._canPerformODAnalysis()
                      : "hydro" === b
                      ? this._canPerformHydroAnalysis()
                      : "loc" === b
                      ? this._canPerformLocAllocationAnalysis()
                      : !1;
                  },
                  this
                )
              : !0;
          },
          _canPerformNetworkAnalysis: function() {
            var b =
              e.isDefined(
                this.portalSelf.helperServices.asyncClosestFacility
              ) &&
              e.isDefined(this.portalSelf.helperServices.asyncServiceArea) &&
              e.isDefined(this.portalSelf.helperServices.asyncVRP);
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseNetworkAnalysis()
            );
          },
          _canPerformGeoEnrichment: function() {
            var b = e.isDefined(this.portalSelf.helperServices.geoenrichment);
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseGeoenrichment()
            );
          },
          _canPerformElevationAnalysis: function() {
            var b = e.isDefined(this.portalSelf.helperServices.elevation);
            return this.canPerformAnalysis() && b;
          },
          _canPerformPlanRoutesAnalysis: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.routingUtilities) &&
              e.isDefined(this.portalSelf.helperServices.asyncVRP);
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseNetworkAnalysis()
            );
          },
          _canPerformODAnalysis: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.routingUtilities) &&
              e.isDefined(this.portalSelf.helperServices.asyncRoute);
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseNetworkAnalysis()
            );
          },
          _canPerformDriveAnalysis: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.routingUtilities) &&
              e.isDefined(this.portalSelf.helperServices.asyncServiceArea);
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseNetworkAnalysis()
            );
          },
          _canPerformNearestAnalysis: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.routingUtilities) &&
              e.isDefined(this.portalSelf.helperServices.asyncClosestFacility);
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseNetworkAnalysis()
            );
          },
          _canPerformLocAllocationAnalysis: function() {
            var b =
              e.isDefined(this.portalSelf.helperServices.routingUtilities) &&
              e.isDefined(
                this.portalSelf.helperServices.asyncLocationAllocation
              );
            return (
              this.canPerformAnalysis() &&
              b &&
              this.userRole.canUseNetworkAnalysis()
            );
          },
          _canPerformHydroAnalysis: function() {
            var b = e.isDefined(this.portalSelf.helperServices.hydrology);
            return this.canPerformAnalysis() && b;
          }
        });
      });
    },
    "widgets/Analysis/toolSettings": function() {
      define(["dojo/_base/lang", "dojo/_base/array"], function(k, d) {
        var b = {},
          e = 0,
          g = [
            {
              id: e++,
              dijitID: "esri/dijit/analysis/AggregatePoints",
              name: "AggregatePoints",
              title: "aggregateTool",
              imgDisplay: "images/aggregate-points.png",
              usage: "aggregatePointsUsage",
              analysisLayer: {
                name: "pointLayer",
                geomTypes: ["esriGeometryPoint", "esriGeometryMultipoint"]
              },
              requiredParam: {
                name: "polygonLayers",
                isArray: !0,
                geomTypes: ["esriGeometryPolygon"]
              },
              icon: "images/AggregatePoints32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/CalculateDensity",
              name: "CalculateDensity",
              title: "calculateDensity",
              imgDisplay: "images/calculate-density.png",
              usage: "calculateDensityUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: [
                  "esriGeometryPoint",
                  "esriGeometryMultipoint",
                  "esriGeometryPolyline"
                ]
              },
              optionalParams: [
                {
                  name: "boundingPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/CreateDensitySurface32.png",
              privileges: ["svradvanced"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/ChooseBestFacilities",
              name: "ChooseBestFacilities",
              title: "chooseBestFacilities",
              imgDisplay: "images/choose-best-facilities.png",
              analysisLayer: {
                name: "demandLocationLayer",
                geomTypes: ["esriGeometryPoint", "esriGeometryMultipoint"]
              },
              optionalParams: [
                {
                  name: "demandLocationLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint", "esriGeometryMultipoint"]
                },
                { name: "featureLayers", isArray: !0, geomTypes: ["*"] },
                {
                  name: "pointBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "lineBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolyline"]
                },
                {
                  name: "polygonBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/ChooseBestFacilities32.png",
              privileges: ["loc"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/ConnectOriginsToDestinations",
              name: "ConnectOriginsToDestinations",
              title: "connectOriginsToDestinations",
              imgDisplay: "images/connect-origins-to-destinations.png",
              usage: "connectOriginsToDestinationsUsage",
              analysisLayer: {
                name: "originsLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              requiredParam: {
                name: "featureLayers",
                isArray: !0,
                geomTypes: ["esriGeometryPoint"]
              },
              optionalParams: [
                {
                  name: "pointBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "lineBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolyline"]
                },
                {
                  name: "polygonBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/ConnectOriginstoDestinations32.png",
              privileges: ["od"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/CreateBuffers",
              name: "CreateBuffers",
              title: "createBuffers",
              imgDisplay: "images/create-buffers.png",
              usage: "createBuffersUsage",
              analysisLayer: { name: "inputLayer", geomTypes: ["*"] },
              icon: "images/CreateBuffers32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/CreateDriveTimeAreas",
              name: "CreateDriveTimeAreas",
              title: "createDriveTimeAreas",
              imgDisplay: "images/create-drivetime.png",
              usage: "createDriveTimeAreasUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              optionalParams: [
                {
                  name: "pointBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "lineBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolyline"]
                },
                {
                  name: "polygonBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/CreateDriveTimeAreas32.png",
              cannotCancel: !0,
              privileges: ["drivetimearea"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/CreateViewshed",
              name: "CreateViewshed",
              title: "createViewshed",
              imgDisplay: "images/create-viewshed.png",
              usage: "createViewshedUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              icon: "images/Viewshed32.png",
              privileges: ["elevation"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/CreateWatersheds",
              name: "CreateWatersheds",
              title: "createWatershed",
              imgDisplay: "images/create-watersheds.png",
              usage: "createWatershedsUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              icon: "images/Watershed32.png",
              privileges: ["hydro"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/DeriveNewLocations",
              name: "DeriveNewLocations",
              title: "deriveNewLocations",
              imgDisplay: "images/derive-new-locations.png",
              usage: "deriveNewLocationsUsage",
              analysisLayer: { name: "analysisLayer", geomTypes: ["*"] },
              optionalParams: [
                { name: "inputLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/FindNewLocations32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/DissolveBoundaries",
              name: "DissolveBoundaries",
              title: "dissolveBoundaries",
              imgDisplay: "images/dissolve-boundaries.png",
              usage: "dissolveBoundariesUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: ["esriGeometryPolygon"]
              },
              icon: "images/DissolveBoundaries32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/EnrichLayer",
              name: "EnrichLayer",
              title: "enrichLayer",
              imgDisplay: "images/enrich-layer.png",
              usage: "enrichLayerUsage",
              analysisLayer: { name: "inputLayer", geomTypes: ["*"] },
              icon: "images/GeoenrichFeatures32.png",
              privileges: ["geoenrichment"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/ExtractData",
              name: "ExtractData",
              title: "extractData",
              imgDisplay: "images/extract-data.png",
              usage: "extractDataDesc",
              optionalParams: [
                { name: "featureLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/ClipAndShip32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindCentroids",
              name: "FindCentroids",
              title: "findCentroids",
              imgDisplay: "images/find-centroids.png",
              usage: "findCentroidsUsage",
              analysisLayer: { name: "inputLayer", geomTypes: ["*"] },
              optionalParams: [
                { name: "inputLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/FindCentroid32.png",
              privileges: ["svradvanced"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindExistingLocations",
              name: "FindExistingLocations",
              title: "findExistingLocations",
              imgDisplay: "images/find-existing-locations.png",
              usage: "findExistingLocationsUsage",
              analysisLayer: { name: "analysisLayer", geomTypes: ["*"] },
              optionalParams: [
                { name: "inputLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/FindExistingLocations32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindHotSpots",
              name: "FindHotSpots",
              title: "findHotSpots",
              imgDisplay: "images/find-hot-spots.png",
              usage: "findHotSpotsUsage",
              analysisLayer: {
                name: "analysisLayer",
                geomTypes: [
                  "esriGeometryPoint",
                  "esriGeometryMultipoint",
                  "esriGeometryPolygon"
                ]
              },
              optionalParams: [
                {
                  name: "aggregationPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                },
                {
                  name: "boundingPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/FindHotSpots32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindNearest",
              name: "FindNearest",
              title: "findNearest",
              imgDisplay: "images/find-nearest.png",
              usage: "findNearestUsage",
              analysisLayer: { name: "analysisLayer", geomTypes: ["*"] },
              requiredParam: {
                name: "nearLayers",
                isArray: !0,
                geomTypes: ["*"]
              },
              optionalParams: [
                {
                  name: "pointBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "lineBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolyline"]
                },
                {
                  name: "polygonBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/FindNearest32.png",
              cannotCancel: !0,
              privileges: ["svradvanced"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindOutliers",
              name: "FindOutliers",
              title: "findOutliers",
              imgDisplay: "images/find-outliers.png",
              usage: "findOutliersUsage",
              analysisLayer: {
                name: "analysisLayer",
                geomTypes: [
                  "esriGeometryPoint",
                  "esriGeometryMultipoint",
                  "esriGeometryPolygon"
                ]
              },
              optionalParams: [
                {
                  name: "aggregationPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                },
                {
                  name: "boundingPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/FindOutliers32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindPointClusters",
              name: "FindPointClusters",
              title: "findPointClusters",
              imgDisplay: "images/find-point-clusters.png",
              usage: "findPointClustersUsage",
              analysisLayer: {
                name: "analysisLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              optionalParams: [
                {
                  name: "analysisLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                }
              ],
              icon: "images/FindPointClusters32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/FindSimilarLocations",
              name: "FindSimilarLocations",
              title: "findSimilarLocations",
              imgDisplay: "images/find-similar-locations.png",
              usage: "findSimilarLocationsUsage",
              analysisLayer: { name: "inputLayer", geomTypes: ["*"] },
              optionalParams: [
                { name: "searchLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/FindSimilarLocations32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/GeocodeLocationsFromTable",
              name: "GeocodeLocationsFromTable",
              title: "geocodeLocations",
              imgDisplay: "images/geocode-locations-from-table.png",
              usage: "geocodeLocationsUsage",
              icon: "images/GeocodeLocationsFromTable32.png",
              portalOnly: !0
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/InterpolatePoints",
              name: "InterpolatePoints",
              title: "interpolatePoints",
              imgDisplay: "images/interpolate-points.png",
              usage: "interpolatePointsUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: ["esriGeometryPoint", "esriGeometryMultipoint"]
              },
              optionalParams: [
                {
                  name: "boundingPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                },
                {
                  name: "predictAtPointLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                }
              ],
              icon: "images/CreateInterpolatedSurface32.png",
              privileges: ["svradvanced"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/JoinFeatures",
              name: "JoinFeatures",
              title: "joinFeatures",
              imgDisplay: "images/join-features.png",
              usage: "joinFeaturesUsage",
              analysisLayer: { name: "targetLayer", geomTypes: ["*"] },
              optionalParams: [
                { name: "targetLayers", isArray: !0, geomTypes: ["*"] },
                { name: "joinLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/JoinFeatures32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/MergeLayers",
              name: "MergeLayers",
              title: "mergeLayers",
              imgDisplay: "images/merge-layers.png",
              usage: "mergeLayersUsage",
              analysisLayer: { name: "inputLayer", geomTypes: ["*"] },
              requiredParam: {
                name: "mergeLayers",
                isArray: !0,
                geomTypes: ["*"]
              },
              icon: "images/MergeLayers32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/OverlayLayers",
              name: "OverlayLayers",
              title: "overlayLayers",
              imgDisplay: "images/overlay-layers.png",
              usage: "overlayLayersUsage",
              analysisLayer: { name: "inputLayer", geomTypes: ["*"] },
              requiredParam: {
                name: "overlayLayer",
                isArray: !0,
                geomTypes: ["*"]
              },
              optionalParams: [
                { name: "overlayLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/OverlayLayers32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/PlanRoutes",
              name: "PlanRoutes",
              title: "planRoutes",
              imgDisplay: "images/plan-routes.png",
              usage: "planRoutesUsage",
              analysisLayer: {
                name: "stopsLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              optionalParams: [
                {
                  name: "featureLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "stopsLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "pointBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPoint"]
                },
                {
                  name: "lineBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolyline"]
                },
                {
                  name: "polygonBarriers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/PlanRoutes32.png",
              cannotCancel: !0,
              privileges: ["planroutes"]
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/SummarizeCenterAndDispersion",
              name: "SummarizeCenterAndDispersion",
              title: "summarizeCenterAndDispersion",
              imgDisplay: "images/summarize-center-dispersion.png",
              usage: "summarizeCenterAndDispersionUsage",
              analysisLayer: {
                name: "analysisLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              optionalParams: [
                { name: "inputLayers", isArray: !0, geomTypes: ["*"] }
              ],
              icon: "images/SummarizeCenterAndDispersion32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/SummarizeNearby",
              name: "SummarizeNearby",
              title: "summarizeNearby",
              imgDisplay: "images/summarize-nearby.png",
              usage: "summarizeNearbyUsage",
              analysisLayer: { name: "sumNearbyLayer", geomTypes: ["*"] },
              requiredParam: {
                name: "summaryLayers",
                isArray: !0,
                geomTypes: ["*"]
              },
              icon: "images/SummarizeNearby32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/SummarizeWithin",
              name: "SummarizeWithin",
              title: "summarizeWithin",
              imgDisplay: "images/summarize-within.png",
              usage: "summarizeWithinUsage",
              analysisLayer: {
                name: "sumWithinLayer",
                geomTypes: ["esriGeometryPolygon"]
              },
              requiredParam: {
                name: "summaryLayers",
                isArray: !0,
                geomTypes: ["*"]
              },
              icon: "images/SummarizeWithin32.png"
            },
            {
              id: e++,
              dijitID: "esri/dijit/analysis/TraceDownstream",
              name: "TraceDownstream",
              title: "traceDownstream",
              imgDisplay: "images/trace-downstream.png",
              usage: "traceDownstreamUsage",
              analysisLayer: {
                name: "inputLayer",
                geomTypes: ["esriGeometryPoint"]
              },
              optionalParams: [
                {
                  name: "boundingPolygonLayers",
                  isArray: !0,
                  geomTypes: ["esriGeometryPolygon"]
                }
              ],
              icon: "images/TraceDownstream32.png",
              privileges: ["hydro"]
            }
          ];
        b.findToolSetting = function(b) {
          var e = null;
          d.some(g, function(d) {
            if (d.name === b) return (e = d), !0;
          });
          return e;
        };
        b.getAllSettings = function(b) {
          var e = k.clone(g);
          return d.filter(e, function(d) {
            return !0 !== d.portalOnly || !0 === b;
          });
        };
        return b;
      });
    },
    "widgets/Analysis/helpLink": function() {
      define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/dom-attr"
      ], function(k, d, b, e) {
        return k([d, b], {
          baseClass: "jimu-widget-analysis-helpLink",
          templateString:
            '\x3ca href\x3d"#" tabindex\x3d"-1"\x3e\x3cimg esriHelpTopic\x3d"toolDescription" data-dojo-attach-point\x3d"helpIcon"/\x3e\x3c/a\x3e',
          postCreate: function() {
            this.inherited(arguments);
            e.set(this.helpIcon, "class", this.iconClassName);
            e.set(this.helpIcon, "src", this.folderUrl + "images/helpIcon.png");
            e.set(this.helpIcon, "title", this.toolLabel);
          }
        });
      });
    },
    "widgets/Analysis/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:esri/dijit/templates/SingleFilter.html":
      '\x3cdiv class\x3d"esriSingleFilterForm singleFilter" id\x3d"${id}.singleFilter"\x3e\r\n  \x3cdiv\x3e\r\n    \x3ctable id\x3d"${id}.exprTable" class\x3d"rowTable" cellpadding\x3d"0" cellspacing\x3d"0"\x3e\r\n      \x3ctbody\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column1"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column2"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column3"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column4"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column5"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column6"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3cdiv id\x3d"${id}.column7"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd valign\x3d"top" nowrap\x3e\r\n            \x3ca id\x3d"${id}.deleteExpression" href\x3d"JavaScript:void(0);" style\x3d"margin:0 5px;display:none;" class\x3d"esriAGOFilterRemoveIcon" title\x3d"${i18n.deleteExpression}"\x3e\x3c/a\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_interactiveFilterRow"\x3e\r\n          \x3ctd colspan\x3d"8"\x3e\r\n            \x3ctable cellpadding\x3d"0" cellspacing\x3d"0" class\x3d"interactiveFilter"\x3e\r\n              \x3ctbody\x3e\r\n                \x3ctr\x3e\r\n                  \x3ctd nowrap\x3d"nowrap"\x3e\r\n                    \x3ctable cellpadding\x3d"0" cellspacing\x3d"0"\x3e\r\n                      \x3ctbody\x3e\r\n                        \x3ctr\x3e\r\n                          \x3ctd nowrap\x3d"nowrap"\x3e\r\n                            \x3cinput dojoAttachPoint\x3d"interactiveCheck" type\x3d"checkbox" class\x3d"promptCheckBox" title\x3d"${i18n.promptMsg}"/\x3e\r\n                          \x3c/td\x3e\r\n                          \x3ctd nowrap\x3d"nowrap"\x3e\r\n                            \x3clabel class\x3d"labels" for\x3d"promptCheckBox"\x3e\r\n                              \x26nbsp;\x26nbsp;${i18n.askForValues}\r\n                            \x3c/label\x3e\r\n                          \x3c/td\x3e\r\n                          \x3ctd\x3e\r\n                            \x3cspan dojoAttachPoint\x3d"interactiveArrow" style\x3d"color:#cbcbcb;cursor:pointer;" class\x3d"showHidePromptDiv"\x3e\x26nbsp;\x26#9660;\x3c/span\x3e\r\n                          \x3c/td\x3e\r\n                        \x3c/tr\x3e\r\n                      \x3c/tbody\x3e\r\n                    \x3c/table\x3e\r\n                  \x3c/td\x3e\r\n                \x3c/tr\x3e\r\n                \x3ctr dojoAttachPoint\x3d"interactiveSpace" style\x3d"display:none"\x3e\r\n                  \x3ctd nowrap\x3d"nowrap"\x3e\r\n                    \x3ctable cellpadding\x3d"0" cellspacing\x3d"0"\x3e\r\n                      \x3ctbody\x3e\r\n                        \x3ctr\x3e\r\n                          \x3ctd nowrap\x3d"nowrap"\x3e\r\n                            ${i18n.prompt}\r\n                          \x3c/td\x3e\r\n                          \x3ctd width\x3d"10"\x3e\r\n                            \x26nbsp;\r\n                          \x3c/td\x3e\r\n                          \x3ctd\x3e\r\n                            \x3cdiv dojoAttachPoint\x3d"promptText" dojotype\x3d"dijit.form.TextBox" intermediateChanges\x3d"true" style\x3d"width:250px;"\x3e\r\n                            \x3c/div\x3e\r\n                          \x3c/td\x3e\r\n                        \x3c/tr\x3e\r\n                        \x3ctr\x3e\r\n                          \x3ctd nowrap\x3d"nowrap"\x3e\r\n                            ${i18n.hint}\r\n                          \x3c/td\x3e\r\n                          \x3ctd width\x3d"10"\x3e\r\n                            \x26nbsp;\r\n                          \x3c/td\x3e\r\n                          \x3ctd\x3e\r\n                            \x3cdiv dojoAttachPoint\x3d"hintText" dojotype\x3d"dijit.form.TextBox" intermediateChanges\x3d"true" style\x3d"width:250px;"\x3e\r\n                            \x3c/div\x3e\r\n                          \x3c/td\x3e\r\n                        \x3c/tr\x3e\r\n                      \x3c/tbody\x3e\r\n                    \x3c/table\x3e\r\n                  \x3c/td\x3e\r\n                \x3c/tr\x3e\r\n              \x3c/tbody\x3e\r\n            \x3c/table\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"promptDiv" style\x3d"display:none;padding:10px 0px;"\x3e\r\n    \x3clabel class\x3d"labels promptLabels" for\x3d"txtPrompt"\x3e\r\n      ${i18n.prompt}\r\n    \x3c/label\x3e\r\n    \x3cinput class\x3d"promptFields txtPrompt" type\x3d"text"/\x3e\r\n    \x3cbr/\x3e\r\n    \x3clabel class\x3d"labels promptLabels" for\x3d"txtHint"\x3e\r\n      ${i18n.hint}\r\n    \x3c/label\x3e\r\n    \x3cinput class\x3d"promptFields txtHint" type\x3d"text" /\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/Analysis/Widget.html":
      '\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"widgetContent" class\x3d"analysis-widget-content"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"toolListPanel" class\x3d"tool-list"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"toolsSection" class\x3d"toolsSection" tabindex\x3d"0" data-a11y-label-by\x3d"analysis-tool-section-tip"\x3e\r\n        \x3cdiv class\x3d"execute-tip" data-a11y-label-id\x3d"analysis-tool-section-tip"\x3e\r\n          ${nls.executeAnalysisTip}\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"tools-table-container"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"toolsTbody" class\x3d"tools-table"\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"noQueryTipSection" class\x3d"jimu-widget"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv data-dojo-attach-point\x3d"toolPanel" class\x3d"tool-panel" tabindex\x3d"0"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"toolCtr" style\x3d"width:100%;height:90%"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"toolLoadErrorNode" class\x3d"analysis-error-tip" style\x3d"display:none"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv data-dojo-attach-point\x3d"messagePanel" class\x3d"message-panel" tabindex\x3d"0" data-a11y-label-by\x3d"analysis-msg-panel-title analysis-msg-panel-status analysis-msg-panel-outputtip"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"inputHeader" class\x3d"input-header esriAnalysis"\x3e\r\n        \x3cimg data-dojo-attach-point\x3d"smallIcon" class\x3d"small-icon"/\x3e\r\n        \x3cspan data-dojo-attach-point\x3d"toolTitle" class\x3d"tool-title" data-a11y-label-id\x3d"analysis-msg-panel-title"\x3e\x3c/span\x3e\r\n      \x3c/div\x3e\r\n      \x3chr\x3e\r\n      \x3cdiv class\x3d"message-title"\x3e${nls.messages}\x3c/div\x3e\r\n      \x3cdiv class\x3d"message-status screen-readers-only" data-dojo-attach-point\x3d"messageStatusNode" data-a11y-label-id\x3d"analysis-msg-panel-status"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"messageSection" class\x3d\'message-section\'\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"resultSection" style\x3d"display:none" \x3e\r\n        \x3cdiv class\x3d"message-title outputs"\x3e${nls.outputs}\x3c/div\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"outputSection" class\x3d\'result-section\'\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"job-message outputtip" data-dojo-attach-point\x3d"outputtip" data-a11y-label-id\x3d"analysis-msg-panel-outputtip"\x3e${nls.outputtip}\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"resultLoading" class\x3d"result-loading" style\x3d"display:none"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"buttonSection" style\x3d"display:none" class\x3d"buttonNode"\x3e\r\n        \x3cdiv role\x3d"button" class\x3d"jimu-btn" data-dojo-attach-point\x3d"backBtn" tabindex\x3d"0"\r\n            data-dojo-attach-event\x3d"onclick: _switchToPrevious,onkeydown: a11y_switchToPrevious"\x3e${nls.back}\x3c/div\x3e\r\n        \x3cdiv role\x3d"button" class\x3d"jimu-btn" data-dojo-attach-point\x3d"homeBtn" tabindex\x3d"0"\r\n            data-dojo-attach-event\x3d"onclick: _switchToHome,onkeydown: a11y_switchToHome"\x3e${nls.home}\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n  \x3cdiv data-dojo-attach-point\x3d"shelter" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/Analysis/css/style.css":
      ".esriAnalysis .dijitComboBox{height: 30px !important;}.jimu-widget-analysis{position: relative; margin: -14px auto; width: 100%; height: 100%; min-width: 300px; min-height: 237px; overflow-x: hidden; -ms-overflow-x: hidden; overflow-y: auto; -ms-overflow-y: auto;}.jimu-nav-mode .jimu-widget-analysis .toolsSection:focus,.jimu-nav-mode .jimu-widget-analysis .toolsSection .tools-table-item:focus,.jimu-nav-mode .jimu-widget-analysis .tool-panel:focus,.jimu-nav-mode .jimu-widget-analysis .message-panel:focus {outline-offset: -2px !important;}.jimu-widget-analysis .toolsSection{margin-top: 7px;}.jimu-widget-analysis .execute-tip{font-size: 14px; color: #66699c; font-weight: bold;}.jimu-widget-analysis .tools-table-container{width: 100%;}.jimu-widget-analysis .tools-table{margin: 0 auto; padding-top: 10px; width: 100%; border-collapse: collapse;}.jimu-widget-analysis .tool-name{font-size: 14px; color: #686868;}.jimu-widget-analysis .tools-table-item{padding: 10px; height:107px; display: flex; flex-direction: row; justify-content: space-between; cursor: pointer;}.jimu-widget-analysis .tools-table-item.even{background-color: #ffffff;}.jimu-widget-analysis .tools-table-item.odd{background-color: #f0f0f0;}.jimu-widget-analysis .tools-table-item.disabled{background-color: #979797; cursor: default; border-bottom: 1px solid #ffffff;}.jimu-widget-analysis .tools-table-item .icon-section {display: flex; flex-direction: column; justify-content: space-between; max-width: 80%;}.jimu-widget-analysis .tools-table-item .icon-div .tool-icon{height: 60px; width: auto;}.jimu-widget-analysis .tools-table-item .tooltip-section{margin: 10px; display: flex; flex-direction: column; justify-content: center;}.jimu-widget-analysis .tooltip-icon{width: 16px; height: 16px; cursor: pointer;}.jimu-widget-analysis .tools-table-item:hover{background: #d9dde0;}.jimu-widget-analysis .tools-table-item.disabled:hover{background-color: #979797;}.jimu-widget-analysis .tool-params{width: 100%; height: 100%;}.jimu-widget-analysis .input-header{position: relative; width: 100%;}.jimu-widget-analysis .input-header .small-icon{margin-left: 15px;}.jimu-rtl .jimu-widget-analysis .input-header .small-icon{margin-left: auto; margin-right: 15px;}.jimu-widget-analysis .input-header .tool-title{margin-left: 15px; margin-bottom: 15px; font-size: 16px;}.jimu-rtl .jimu-widget-analysis .input-header .tool-title{margin-left: auto; margin-right: 15px;}.jimu-widget-analysis .input-header .help-icon{margin-top: 15px; cursor: pointer;}.jimu-widget-analysis .input-tip{width: 100%; height: auto; margin-top: 20px; font-size: 14px;}.jimu-widget-analysis .layerNode{position: relative; width:100%; margin: 0 auto; margin-top: 10px;}.jimu-widget-analysis .layerNode .param-name{margin-top: 15px; margin-bottom: 10px;}.jimu-widget-analysis .layer-name {height: 30px; line-height: 30px; width: 100%; border: solid 1px rgba(0,0,0,0.1); cursor: pointer;}.jimu-widget-analysis .tool-params .buttonNode{width: 100%; height: auto; margin-top: 20px; text-align: center;}.jimu-widget-analysis .switch-button{margin-left: 20px;}.jimu-rtl .jimu-widget-analysis .switch-button{margin-left: auto; margin-right: 20px;}.jimu-widget-analysis .tool-panel{width: 100%; height: auto; position: relative; top: -5px;}.jimu-widget-analysis .tool-panel .esriAnalysisCloseIcon{display:none !important;}.jimu-widget-analysis .jimu-btn{margin-left: 10px; margin-right: 10px;}.jimu-widget-analysis .toolpanel-button{text-align: center;}.jimu-widget-analysis .analysis-error-tip{width: 100%; min-height: 150px; margin-top: 30px; margin-left: 15px; margin-right: 15px; color:#ff0000; font-size: 14px;}.jimu-widget-analysis .message-panel{width: 100%; position: relative; top: 14px;}.jimu-widget-analysis .message-panel .message-title{margin-top: 20px; font-size: 14px; color: #66696c; font-weight: bold;}.jimu-widget-analysis .message-panel .message-title.outputs{margin-top: 30px;}.jimu-widget-analysis .message-panel .job-message{margin-top: 10px; font-size: 12px; color: #686868;}.jimu-widget-analysis .message-panel .job-message.outputtip{margin-top: 30px;}.jimu-widget-analysis .message-panel .job-message.success{color: #00B050;}.jimu-widget-analysis .message-panel .job-message.failed{color:#E84B4B;}.jimu-widget-analysis .message-panel .job-message.cancelled{color: #51B1FE;}.jimu-widget-analysis .message-panel .job-running-icon{width: 16px; height: 16px; margin-left: 10px;}.jimu-rtl .jimu-widget-analysis .message-panel .job-running-icon{margin-left: auto; margin-right: 10px;}.jimu-widget-analysis .message-panel .job-cancel-icon{width: 16px; height: 16px; cursor: pointer; margin-left: 10px;}.jimu-rtl .jimu-widget-analysis .message-panel .job-cancel-icon{margin-left: auto; margin-right: 10px;}.jimu-widget-analysis .message-panel .output-item{margin-top: 10px; color: #51B1FE; font-size: 12px; display: inline-block;}.jimu-widget-analysis .message-panel .output-item\x3ea{color: #51B1FE;}.jimu-widget-analysis .message-panel .button-section{width: 100%; margin-top: 20px;}.jimu-widget-analysis .message-panel .buttonNode{width: 100%; height: auto; margin-top: 20px; text-align: center;}.jimu-widget-analysis .result-section{width: 100%; margin-top: 15px; margin-bottom: 15px; font-size: 14px; color: #66699c;}.jimu-widget-analysis .result-loading{width: 100%; height: 40px; margin-top: 15px; margin-bottom: 15px; background-image: url(images/loading.gif); background-repeat: no-repeat; background-position: center;}.jimu-widget-analysis .hidden{display: none;}.jimu-widget-analysis .esriAnalysis .esriAnalysisSubmitButton{margin: 0 !important;}.jimu-rtl .jimu-widget-analysis .esriAnalysis .esriAnalysisSubmitButton{margin-right: 0; margin-left: auto;}.jimu-widget-analysis .esriAnalysis .dijitButton.calcite {display: inline-block !important;}.jimu-widget-analysis .esriAnalysis .esriAnalysisSubmitButton.dijitButton\x3espan.dijitButtonNode,.jimu-widget-analysis .esriAnalysis .dijitButton.calcite \x3e span.dijitButtonNode{cursor:pointer; min-width: 70px; display:inline-block; padding: 0 15px; font-size: 14px; text-align: center; background:#485566; vertical-align:middle; color:#ffffff; -webkit-border-radius:5px; -moz-border-radius:5px; -o-border-radius:5px; -ms-border-radius:5px; border-radius: 5px; border: 1px solid transparent; box-shadow: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}.jimu-widget-analysis .esriAnalysis .esriAnalysisSubmitButton.dijitButton\x3espan.dijitButtonNode .dijitButtonText,.jimu-widget-analysis .esriAnalysis .dijitButton.calcite \x3e span.dijitButtonNode .dijitButtonText {line-height: 32px;}.jimu-widget-analysis .esriAnalysis .esriAnalysisSubmitButton.dijitButtonHover\x3espan.dijitButtonNode,.jimu-widget-analysis .esriAnalysis .dijitButton.calcite.dijitButtonHover\x3espan.dijitButtonNode{background-color: #596d87; color: #ffffff;}.dijitDialog .esriAnalysis{overflow: hidden;}.dijitDialog .esriAnalysis .esriAnalysisSubmitButton{margin-left: 10px;}.jimu-rtl .dijitDialog .esriAnalysis .esriAnalysisSubmitButton{margin-left: auto; margin-right: 10px;}.dijitDialog .esriAnalysis .esriAnalysisCloseIcon{display: none !important;}.itemsGallery .galleryNode .galleryLabelContainer {height: 2.7em; text-align: left; line-height: 15px;}.jimu-widget-analysis .export-node {width: 16px; height: 16px; background-image: url(images/download.png); cursor: pointer; margin: 10px 10px 0 10px; display: inline-block;}.jimu-widget-analysis .export-node:hover {background-image: url(images/download_hover.png);}.esriAnalysis .dijitReset.dijitRight.dijitButtonNode.dijitArrowButton.dijitDownArrowButton.dijitArrowButtonContainer{width: 18px !important;}.esriAnalysis .esriAnalysisExpressionGrid .dijitButtonNode {height: auto;}.calcite.esriAnalysisEnrichDataBrowser {height: 480px; width: 720px;}",
    "*now": function(k) {
      k([
        'dojo/i18n!*preload*widgets/Analysis/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/_base/array dojo/dom-style dojo/dom-attr dojo/dom-class dojo/dom-geometry dojo/Deferred dojo/on dijit/a11yclick ./a11y/Widget dojo/Evented dojo/query dojo/promise/all dojo/dom-construct dojo/i18n!esri/nls/jsapi dojo/json dijit/_WidgetsInTemplateMixin esri/request esri/tasks/JobInfo esri/tasks/FeatureSet esri/tasks/query esri/tasks/QueryTask esri/layers/FeatureLayer esri/dijit/PopupTemplate esri/dijit/analysis/utils esri/geometry/Extent jimu/BaseWidget jimu/dijit/ViewStack jimu/dijit/Message jimu/dijit/FeatureActionPopupMenu jimu/utils jimu/portalUtils jimu/portalUrlUtils jimu/LayerInfos/LayerInfos ./layerUtil ./toolValidate ./PrivilegeUtil ./toolSettings ./helpLink dojo/i18n!./setting/nls/strings dijit/form/Button jimu/dijit/LoadingIndicator".split(
  " "
), function(
  k,
  d,
  b,
  e,
  g,
  q,
  u,
  x,
  A,
  v,
  z,
  E,
  y,
  w,
  p,
  t,
  C,
  N,
  I,
  H,
  J,
  M,
  Q,
  K,
  r,
  a,
  c,
  n,
  h,
  l,
  F,
  V,
  P,
  R,
  U,
  Z,
  B,
  D,
  X,
  aa,
  Y,
  ba
) {
  k = k([h, I, y], {
    baseClass: "jimu-widget-analysis esriAnalysis",
    _hasContent: null,
    privilegeUtil: null,
    currentStack: 0,
    toolCountInList: 0,
    analysisMode: "default",
    postMixInProperties: function() {
      this.inherited(arguments);
      this.isRenderIdForAttrs = !0;
      d.mixin(this.nls, C.analysisTools);
      d.mixin(this.nls, window.jimuNls.common);
      this.nls.toolNotAvailable = ba.toolNotAvailable;
    },
    postCreate: function() {
      this.inherited(arguments);
      this.popupMenu = V.getInstance();
      this.privilegeUtil = X.getInstance();
      this.viewStack = new l({
        viewType: "dom",
        views: [this.toolListPanel, this.toolPanel, this.messagePanel]
      });
      b.place(this.viewStack.domNode, this.widgetContent);
      this._switchView(0);
      this.a11y_addMessagePanelEvent();
    },
    _closeHelpDialog: function() {
      c._helpDialog &&
        "function" === typeof c._helpDialog.close &&
        c._helpDialog.close();
    },
    onClose: function() {
      this._closeHelpDialog();
      this._deactiveDrawTool();
      this._setDrawingLayersVisibility(!1);
      this._unbindAnalysisEvent();
    },
    onOpen: function() {
      this._setDrawingLayersVisibility(!0);
      1 === this.currentStack && this._refreshAnalysisTool();
    },
    onDeActive: function() {
      this._deactiveDrawTool();
    },
    _refreshAnalysisTool: function() {
      this.shelter.show();
      B.getLayerObjects().then(
        d.hitch(this, function(a) {
          D.isValid(a, this.currentToolSetting, this.privilegeUtil);
          this.shelter.hide();
          this._setIconAndLink(this.currentToolSetting);
          this._switchToAnalysisTool();
        })
      );
    },
    _checkValidation: function() {
      var a;
      t.empty(this.toolsTbody);
      if (0 === this.config.analysisTools.length)
        return (a = new A()), a.resolve(), a;
      this.shelter.show();
      return this.privilegeUtil.loadPrivileges(this._getPortalUrl()).then(
        d.hitch(this, function(a) {
          if (a && this.privilegeUtil.canPerformAnalysis())
            return (
              g.set(this.toolsSection, "display", "block"),
              g.set(this.noQueryTipSection, "display", "none"),
              this.a11y_initFirstFocusNode(),
              this._initToolList().then(
                d.hitch(this, function() {
                  this.shelter.hide();
                })
              )
            );
          this._noPrivilegeHandler(this.nls.privilegeError);
        }),
        d.hitch(this, function() {
          this._noPrivilegeHandler(this.nls.privilegeError);
          this.shelter.hide();
        })
      );
    },
    _clearContent: function() {
      t.empty(this.toolsTbody);
      this.currentAnalysisDijit &&
        ("function" === typeof this.currentAnalysisDijit.clear &&
          this.currentAnalysisDijit.clear(),
        (this.currentAnalysisDijit = null),
        t.empty(this.toolCtr));
      this.currentToolSetting = null;
    },
    _noPrivilegeHandler: function(a) {
      this.shelter.hide();
      g.set(this.toolsSection, "display", "none");
      q.set(this.noQueryTipSection, "innerHTML", P.stripHTML(a));
      g.set(this.noQueryTipSection, "display", "block");
    },
    _initToolList: function() {
      g.set(this.homeBtn, "display", "");
      this.toolCountInList = 0;
      var a = null;
      return B.getLayerObjects().then(
        d.hitch(this, function(b) {
          e.forEach(
            this.config.analysisTools,
            d.hitch(this, function(c, e) {
              c = aa.findToolSetting(c.name);
              if (
                null !== c &&
                ((c = d.mixin(c, this.config.analysisTools[e])),
                c.toolLabel || (c.toolLabel = this.nls[c.title]),
                this.privilegeUtil.hasPrivileges(c.privileges))
              ) {
                var f = D.isValid(b, c, this.privilegeUtil);
                this._addTool(c, e, f);
                this.toolCountInList += 1;
                a = c;
              }
            })
          );
          this.a11y_initLastFocusNode();
          1 === this.toolCountInList &&
            (g.set(this.homeBtn, "display", "none"),
            (this.currentToolSetting = a));
        }),
        d.hitch(this, function() {
          console.error("layerUtil: getLayerObjects error");
        })
      );
    },
    destroy: function() {
      this._clearContent();
      this.inherited(arguments);
    },
    _addTool: function(a, b, e) {
      var f = t.create(
        "div",
        { class: "tools-table-item", "data-toolname": a.name },
        this.toolsTbody
      );
      0 === b % 2 ? u.add(f, "even") : u.add(f, "odd");
      f.rowData = a;
      var g = t.create("div", { class: "icon-section" }, f);
      b = P.stripHTML(a.toolLabel);
      b = t.create(
        "div",
        { class: "tool-name jimu-ellipsis", title: b, innerHTML: b },
        g
      );
      g = t.create("div", { class: "icon-div" }, g);
      t.create(
        "img",
        { src: this.folderUrl + a.imgDisplay, class: "tool-icon" },
        g
      );
      g = t.create("div", { class: "tooltip-section esriAnalysis" }, f);
      if (a.showHelp) {
        var h = a.dijitID.lastIndexOf("/"),
          h = a.dijitID.substring(h + 1);
        "geocodelocationsfromtable" === h.toLowerCase() &&
          (h = "GeocodeLocationsfromTable");
        var k = !U.isOnline(this._getPortalUrl()),
          h = new Y({
            helpFileName: h,
            isSingleTenant: k,
            iconClassName: "tooltip-icon",
            toolLabel: a.toolLabel,
            folderUrl: this.folderUrl,
            portalSelf: this.privilegeUtil.portalSelf
          });
        h.placeAt(g);
        try {
          c.initHelpLinks(h.domNode, !0);
        } catch (T) {
          console.log(T);
        }
      }
      !0 === e
        ? (q.set(f, "title", ""),
          this.own(
            v(
              f,
              z,
              d.hitch(this, function() {
                this._setIconAndLink(a);
                this.currentToolSetting = a;
                this._switchToAnalysisTool();
              })
            )
          ))
        : (q.set(f, "title", this.nls.toolNotAvailable),
          u.remove(f, "even"),
          u.remove(f, "odd"),
          u.add(f, "disabled"));
      this.a11y_addTool(f, b, e);
    },
    _setIconAndLink: function(a) {
      q.set(this.smallIcon, "src", this.folderUrl + a.icon);
      q.set(this.toolTitle, "innerHTML", P.stripHTML(a.toolLabel));
      var b = a.dijitID.lastIndexOf("/"),
        b = a.dijitID.substring(b + 1);
      this.helpLink && (this.helpLink.destroy(), (this.helpLink = null));
      if (a.showHelp) {
        var d = !U.isOnline(this._getPortalUrl());
        "geocodelocationsfromtable" === b.toLowerCase() &&
          (b = "GeocodeLocationsfromTable");
        this.helpLink = new Y({
          helpFileName: b,
          isSingleTenant: d,
          iconClassName: "help-icon jimu-float-trailing",
          toolLabel: a.toolLabel,
          folderUrl: this.folderUrl,
          portalSelf: this.privilegeUtil.portalSelf
        });
        this.helpLink.placeAt(this.inputHeader);
        try {
          c.initHelpLinks(this.helpLink.domNode, !0);
        } catch (W) {
          console.log(W);
        }
      }
    },
    _switchToAnalysisTool: function() {
      g.set(this.toolLoadErrorNode, "display", "none");
      this.shelter.show();
      require([this.currentToolSetting.dijitID], d.hitch(this, function(a) {
        this.currentAnalysisDijit &&
          ("function" === typeof this.currentAnalysisDijit.clear &&
            this.currentAnalysisDijit.clear(),
          (this.currentAnalysisDijit = null),
          t.empty(this.toolCtr));
        var b = !U.isOnline(this._getPortalUrl()),
          c = {
            map: this.map,
            showSelectFolder: !0,
            helperServices: this.privilegeUtil.portalSelf.helperServices,
            portalUrl: this._getPortalUrl(this.privilegeUtil.getUserPortal()),
            portalSelf: this.privilegeUtil.portalSelf,
            showCredits: this.currentToolSetting.showCredits,
            showHelp: this.currentToolSetting.showHelp,
            showChooseExtent: this.currentToolSetting.showChooseExtent,
            returnFeatureCollection: this.currentToolSetting
              .returnFeatureCollection,
            showReadyToUseLayers: this.currentToolSetting.showReadyToUseLayers,
            isSingleTenant: b,
            disableRunAnalysis:
              !0 === this.currentToolSetting.disableRunAnalysis,
            analysisMode: this.analysisMode,
            showGeoAnalyticsParams:
              "bigdata" === this.analysisMode &&
              this.privilegeUtil.canPerformGeoAnalytics(),
            showBrowseLayers:
              this.privilegeUtil.isPortal() && "raster" !== this.analysisMode
          };
        this.privilegeUtil.portalSelf &&
          "enabled" === this.privilegeUtil.portalSelf.creditAssignments &&
          (c.checkCreditLimits = !0);
        if (
          "findNearest" === this.currentToolSetting.title ||
          "summarizeNearby" === this.currentToolSetting.title ||
          "enrichLayer" === this.currentToolSetting.title
        )
          c.enableTravelModes = this.privilegeUtil.hasPrivileges([
            "networkanalysis"
          ]);
        "joinFeatures" === this.currentToolSetting.title &&
          ((c.showTemporalJoin = c.showGeoAnalyticsParams),
          (c.showJoinCondition = c.showGeoAnalyticsParams));
        if (
          "findNearest" === this.currentToolSetting.title ||
          "planRoutes" === this.currentToolSetting.title ||
          "connectOriginsToDestinations" === this.currentToolSetting.title
        )
          c.showOutputType = !0 === this.currentToolSetting.showOutputType;
        "findOutliers" === this.currentToolSetting.title &&
          ((c.enableEnrichmentFields = this.privilegeUtil.canPerformGeoEnrichment()),
          (c.allowChooseLabel = !1));
        b = B.getLayerObjects();
        "geocodeLocations" === this.currentToolSetting.title &&
          (this.privilegeUtil.portalSelf.helperServices.asyncGeocode &&
            (c.analysisGpServer = this.privilegeUtil.portalSelf.helperServices.asyncGeocode.url),
          (c.checkCreditLimits = !1),
          (c.showReadyToUseLayers = !1),
          (c.showBrowseLayers = !0),
          (c.showChooseExtent = !1),
          (c.returnFeatureCollection = !1),
          (b = B.getTableLayerObjects()));
        "returnFeatureCollection" in this.currentToolSetting &&
          (c.showSelectFolder = !this.currentToolSetting
            .returnFeatureCollection);
        b.then(
          d.hitch(this, function(b) {
            c.showSelectAnalysisLayer = !0;
            "geocodeLocations" === this.currentToolSetting.title
              ? (c.inputTables = b)
              : this.currentToolSetting.analysisLayer &&
                (c[
                  this.currentToolSetting.analysisLayer.name + "s"
                ] = this._prepareLayers(
                  b,
                  this.currentToolSetting.analysisLayer.geomTypes
                ));
            b = this._prepareLayerParams(b);
            d.mixin(c, b);
            try {
              if (
                -1 !==
                  this.currentToolSetting.dijitID.indexOf(
                    "DeriveNewLocations"
                  ) ||
                -1 !==
                  this.currentToolSetting.dijitID.indexOf(
                    "FindExistingLocations"
                  ) ||
                -1 !==
                  this.currentToolSetting.dijitID.indexOf(
                    "FindSimilarLocations"
                  )
              )
                c.primaryActionButttonClass = "esriAnalysisSubmitButton";
              this.currentAnalysisDijit = new a(
                c,
                t.create("div", { style: { width: "100%" } }, this.toolCtr)
              );
              this.currentAnalysisDijit._setTitleAttr(
                this.currentToolSetting.toolLabel
              );
              this._bindAnalysisEvents(this.currentAnalysisDijit);
              this.currentAnalysisDijit.startup();
              this.currentDijitID = this.currentToolSetting.dijitID;
              var e,
                f = w(
                  ".esriAnalysis .esriAnalysisSubmitButton",
                  this.toolPanel
                )[0];
              if ("undefined" !== typeof f) {
                if (1 < this.toolCountInList) {
                  u.add(f, "multiTool");
                  var h = t.create("div", { class: "toolpanel-button" });
                  e = t.create(
                    "div",
                    { class: "jimu-btn", innerHTML: this.nls.back },
                    h
                  );
                  t.place(h, f, "before");
                  t.place(f, h);
                  this.currentAnalysisDijit.own(
                    v(e, z, d.hitch(this, this._switchToPrevious))
                  );
                  this.a11y_analysisTool_backBtn(e, f);
                }
                this.a11y_analysisTool_submitBtn(e, f);
                this.a11y_analysisTool_toolPanel(e, f);
              }
            } catch (T) {
              console.error(T.message || T),
                q.set(
                  this.toolLoadErrorNode,
                  "innerHTML",
                  P.stripHTML(T.message || T)
                ),
                g.set(this.toolLoadErrorNode, "display", "");
            }
            this._switchView(1);
            this.shelter.hide();
          })
        );
      }), d.hitch(this, function(a) {
        this._switchView(1);
        q.set(this.toolLoadErrorNode, "innerHTML", P.stripHTML(a));
        g.set(this.toolLoadErrorNode, "display", "");
        this.shelter.hide();
      }));
    },
    _prepareLayerParams: function(a) {
      var b = {};
      if (
        "optionalParams" in this.currentToolSetting ||
        "requiredParam" in this.currentToolSetting
      ) {
        var c;
        "requiredParam" in this.currentToolSetting &&
          ((c = this._prepareLayers(
            a,
            this.currentToolSetting.requiredParam.geomTypes
          )),
          (b[this.currentToolSetting.requiredParam.name] = this
            .currentToolSetting.requiredParam.isArray
            ? c
            : 0 < c.length
            ? c[0]
            : null));
        "optionalParams" in this.currentToolSetting &&
          e.forEach(
            this.currentToolSetting.optionalParams,
            function(d) {
              c = this._prepareLayers(a, d.geomTypes);
              b[d.name] = d.isArray ? c : 0 < c.length ? c[0] : null;
            },
            this
          );
      }
      return b;
    },
    _prepareLayers: function(a, b) {
      var c,
        d = ["point", "polyline", "polygon"],
        f = [];
      "*" !== b[0] &&
        (d = e.map(b, function(a) {
          return P.getTypeByGeometryType(a);
        }));
      e.forEach(
        a,
        function(a) {
          "esri.layers.FeatureLayer" === a.declaredClass &&
            ((c = P.getTypeByGeometryType(a.geometryType)),
            0 <= d.indexOf(c) && (a.url || 0 < a.graphics.length) && f.push(a));
        },
        this
      );
      return f;
    },
    _deactivateGenerator: function(a) {
      var b = this.currentAnalysisDijit;
      return function() {
        e.forEach(a, function(a) {
          b[a] && b[a].set("checked", !1);
        });
      };
    },
    _deactiveDrawTool: function() {
      if (this.currentAnalysisDijit) {
        var a = {
          calculateDensity: this._deactivateGenerator(["_bndgPolyDrawBtn"]),
          createViewshed: this._deactivateGenerator(["_analysisPointDrawBtn"]),
          createWatershed: this._deactivateGenerator(["_analysisPointDrawBtn"]),
          extractData: d.hitch(this, function() {
            this.currentAnalysisDijit._drawExtentBtn &&
              this.currentAnalysisDijit._drawExtentBtn.set("checked", !1);
            this.currentAnalysisDijit._toolbar &&
              this.currentAnalysisDijit._toolbar.deactivate();
          }),
          findHotSpots: this._deactivateGenerator(["_boundingDrawBtn"]),
          findSimilarLocations: d.hitch(this, function() {
            this.currentAnalysisDijit._selectBtn &&
              this.currentAnalysisDijit._selectBtn.set("checked", !1);
            this.currentAnalysisDijit.selectionLayer &&
              this.currentAnalysisDijit.selectionLayer.clearSelection();
          }),
          interpolatePoints: this._deactivateGenerator([
            "_bndgPolyDrawBtn",
            "_predictPointDrawBtn"
          ]),
          planRoutes: this._deactivateGenerator([
            "_startPointDrawBtn",
            "_endPointDrawBtn"
          ]),
          traceDownstream: this._deactivateGenerator([
            "_analysisPointDrawBtn",
            "_bndgPolyDrawBtn"
          ])
        };
        "function" === typeof a[this.currentToolSetting.title] &&
          (a[this.currentToolSetting.title].apply(this),
          this.map.setInfoWindowOnClick(!0));
      }
    },
    _setDrawingLayersVisibility: function(a) {
      this.currentAnalysisDijit &&
        "function" === typeof this.currentAnalysisDijit._getDrawLayerAttr &&
        e.forEach(this.currentAnalysisDijit._getDrawLayerAttr(), function(b) {
          a ? b.show() : b.hide();
        });
    },
    _unbindAnalysisEvent: function() {
      this.startListener &&
        (this.startListener.remove(), (this.startListener = null));
      this.submitListener &&
        (this.submitListener.remove(), (this.submitListener = null));
      this.cancelListener &&
        (this.cancelListener.remove(), (this.cancelListener = null));
      this.failedListener &&
        (this.failedListener.remove(), (this.failedListener = null));
      this.succeedListener &&
        (this.succeedListener.remove(), (this.succeedListener = null));
      this.statusListener &&
        (this.statusListener.remove(), (this.statusListener = null));
      this.resultListener &&
        (this.resultListener.remove(), (this.resultListener = null));
      this.activeDrawListener &&
        (this.activeDrawListener.remove(), (this.activeDrawListener = null));
      this.deactiveDrawListener &&
        (this.deactiveDrawListener.remove(),
        (this.deactiveDrawListener = null));
    },
    _bindAnalysisEvents: function(a) {
      this._unbindAnalysisEvent();
      this.startListener = v(a, "start", d.hitch(this, this._onJobStart));
      this.submitListener = v(
        a,
        "job-submit",
        d.hitch(this, this._onJobSubmitted)
      );
      this.cancelListener = v(
        a,
        "job-cancel",
        d.hitch(this, this._onJobCancelled)
      );
      this.failedListener = v(a, "job-fail", d.hitch(this, this._onJobFailed));
      this.succeedListener = v(
        a,
        "job-success",
        d.hitch(this, this._onJobSucceed)
      );
      this.statusListener = v(
        a,
        "job-status",
        d.hitch(this, this._onJobStatusChange)
      );
      this.resultListener = v(
        a,
        "job-result",
        d.hitch(this, this._onJobResultData)
      );
      this.activeDrawListener = v(
        a,
        "drawtool-activate",
        d.hitch(this, function() {
          this.map.setInfoWindowOnClick(!1);
        })
      );
      this.deactiveDrawListener = v(
        a,
        "drawtool-deactivate",
        d.hitch(this, function() {
          this.map.setInfoWindowOnClick(!0);
        })
      );
    },
    _onJobStart: function() {
      this._clearMessageLogs();
      this.shelter.show();
      this._switchView(2);
      this.emit("start");
    },
    _onJobSubmitted: function(a) {
      this.shelter.hide();
      this.outputProperties = null;
      a.OutputName && (this.outputProperties = N.parse(a.OutputName, !0));
      this._appendMessage(
        this.nls[this.currentToolSetting.title] + " " + this.nls.jobSubmitted
      );
      var b = t.create(
        "div",
        { class: "job-message waiting" },
        this.messageSection
      );
      t.create(
        "img",
        { class: "job-executing", src: this.folderUrl + "images/loading.gif" },
        b
      );
      this.emit("job-submit", a);
    },
    _onJobCancelled: function(a) {
      a.jobStatus
        ? this._appendMessage(
            this.nls.jobCancelled + ": " + a.jobStatus,
            "cancelled"
          )
        : this._appendMessage(this.nls.jobCancelled, "cancelled");
      this._onJobDone();
      g.set(this.buttonSection, "display", "");
      this.emit("job-cancel", a);
    },
    _onJobFailed: function(a) {
      this.shelter.hide();
      "warning" === a.type
        ? (this.currentAnalysisDijit.set("disableRunAnalysis", !1),
          this._switchView(1),
          new F({ message: a.message }))
        : (2 !== this.currentStack &&
            (this._clearMessageLogs(), this._switchView(2)),
          this._appendMessage(
            this.nls.jobFailed + ": " + (a.analysisReport || a.message),
            "failed"
          ),
          this._onJobDone(),
          g.set(this.buttonSection, "display", ""));
      this.emit("job-fail", a);
    },
    _onJobSucceed: function(a) {
      this._appendMessage(this.nls.jobSuccess, "success");
      this._onJobDone();
      g.set(this.resultLoading, "display", "");
      this.emit("job-success", a);
    },
    _onJobDone: function() {
      w("img.job-executing", this.messagePanel).forEach(function(a) {
        t.destroy(a);
      });
    },
    _onJobStatusChange: function(a) {
      this.shelter.hide();
      a.jobId &&
        a.jobId !== this.currentToolJobId &&
        (this.currentToolJobId = a.jobId);
      if (a.jobStatus === J.STATUS_EXECUTING) this._appendExecutingMessage();
      else {
        switch (a.jobStatus) {
          case J.STATUS_FAILED:
          case J.STATUS_CANCELLED:
          case J.STATUS_DELETED:
          case J.STATUS_TIMED_OUT:
            this.shelter.hide();
            "string" === typeof a.message &&
              this._appendMessage(a.message, "failed");
            this._onJobDone();
            g.set(this.buttonSection, "display", "");
            break;
          case J.STATUS_SUCCEEDED:
            "string" === typeof a.message &&
              this._appendMessage(a.message, "success"),
              this._onJobDone(),
              g.set(this.buttonSection, "display", ""),
              g.set(this.resultLoading, "display", "");
        }
        this.messagePanel.focus();
      }
      this.currentJobStatus = a.jobStatus;
      this.a11y_updateTitleForMsgDom(a.jobStatus, J);
      this.emit("job-status", a);
    },
    _onJobResultData: function(b) {
      g.set(this.resultSection, "display", "");
      g.set(this.buttonSection, "display", "");
      var c = this._appendResultMessage(b);
      if (0 <= this.currentToolSetting.dijitID.indexOf("ExtractData"))
        q.set(
          this.outputtip,
          "innerHTML",
          P.stripHTML(this.nls.outputSaveInPortal)
        ),
          g.set(this.resultLoading, "display", "none");
      else {
        q.set(this.outputtip, "innerHTML", P.stripHTML(this.nls.outputtip));
        var f;
        if (b.value.itemId)
          (f = null),
            "layerInfo" in b.value && (f = b.value.layerInfo.popupInfo),
            this._fetchResultByItemId(c, b.value.itemId, f).then(
              d.hitch(this, function() {
                g.set(this.resultLoading, "display", "none");
              })
            );
        else if ("layerDefinition" in b.value) {
          var h = { title: c ? c : "output", fieldInfos: [] };
          e.forEach(b.value.layerDefinition.fields, function(a) {
            a.name !== b.value.layerDefinition.objectIdField &&
              h.fieldInfos.push({
                fieldName: a.name,
                visible: !0,
                label: a.alias,
                isEditable: !1
              });
          });
          f = new a(h);
          f = new r(b.value, { infoTemplate: f });
          f.title = c ? c : "output";
          f.name = c ? c : "output";
          this.map.addLayer(f);
          this._createExportNode(new M(b.value.featureSet));
          g.set(this.resultLoading, "display", "none");
        }
      }
      this.emit("job-result", b);
    },
    _fetchResultByItemId: function(a, b, c) {
      return R.getPortal(this._getPortalUrl(this.privilegeUtil.getUserPortal()))
        .getItemById(b)
        .then(
          d.hitch(this, function(f) {
            var g = f.url || f.itemUrl;
            return H({ url: g, content: { f: "json" }, handleAs: "json" }).then(
              d.hitch(this, function(f) {
                var h = [],
                  k,
                  l = f.tables || [],
                  q = f.layers || [];
                l.reverse();
                q.reverse();
                e.forEach(
                  l,
                  function(b) {
                    var c = g + "/" + b.id;
                    k = Z.getInstance(this.map, this.map.itemInfo).then(
                      d.hitch(this, function(d) {
                        d.addTable({
                          url: c,
                          title: a + " - " + b.name,
                          options: { outFields: ["*"] }
                        });
                        h.push(this._createExportNodeForUrl(b.name, c, !1));
                      })
                    );
                    h.push(k);
                  },
                  this
                );
                e.forEach(
                  q,
                  function(a) {
                    var e = g + "/" + a.id,
                      f = null;
                    1 === q.length && (f = c);
                    k = this._buildFeatureLayer(a.name, e, f, b).then(
                      d.hitch(this, function(b) {
                        b.title = a.name;
                        this.map.addLayer(b);
                      })
                    );
                    h.push(this._createExportNodeForUrl(a.name, e, !0));
                    h.push(k);
                  },
                  this
                );
                f.initialExtent && this.map.setExtent(new n(f.initialExtent));
                return p(h);
              })
            );
          })
        );
    },
    _buildFeatureLayer: function(b, c, g, h) {
      if (null !== g) {
        var f = new A();
        g.title = b;
        g = new r(c, {
          mode: r.MODE_SNAPSHOT,
          infoTemplate: new a(g),
          outFields: ["*"]
        });
        g._wabProperties = {
          itemLayerInfo: { portalUrl: this.appConfig.portalUrl, itemId: h }
        };
        f.resolve(g);
        return f;
      }
      return H({ url: c, content: { f: "json" }, handleAs: "json" }).then(
        d.hitch(this, function(d) {
          var f = { title: b, fieldInfos: [] };
          e.forEach(d.fields, function(a) {
            a.name !== d.objectIdField &&
              f.fieldInfos.push({
                fieldName: a.name,
                visible: !0,
                label: a.alias,
                isEditable: !1
              });
          });
          var g = new r(c, {
            mode: r.MODE_SNAPSHOT,
            infoTemplate: new a(f),
            outFields: ["*"]
          });
          g._wabProperties = {
            itemLayerInfo: { portalUrl: this.appConfig.portalUrl, itemId: h }
          };
          return g;
        }),
        d.hitch(this, function() {
          var a = new r(c);
          a._wabProperties = {
            itemLayerInfo: { portalUrl: this.appConfig.portalUrl, itemId: h }
          };
          return a;
        })
      );
    },
    _clearMessageLogs: function() {
      t.empty(this.messageSection);
      t.empty(this.outputSection);
      g.set(this.resultSection, "display", "none");
      g.set(this.buttonSection, "display", "none");
      g.set(this.resultLoading, "display", "none");
    },
    _appendMessage: function(a, b) {
      a = P.stripHTML(a);
      t.create(
        "div",
        { class: "job-message " + (b ? b : ""), innerHTML: a },
        this.messageSection
      );
      this.messageStatusNode.innerHTML = a;
    },
    _appendExecutingMessage: function() {
      w("div.waiting", this.messagePanel).forEach(function(a) {
        t.destroy(a);
      });
      if (0 === w("div.job-executing", this.messagePanel).length) {
        var a = t.create(
          "div",
          { class: "job-message job-executing" },
          this.messageSection
        );
        t.create("span", { innerHTML: P.stripHTML(this.nls.executing) }, a);
        t.create(
          "img",
          {
            class: "job-executing",
            src: this.folderUrl + "images/loading.gif"
          },
          a
        );
        var b = !1;
        !0 === this.currentToolSetting.cannotCancel
          ? (b = !0)
          : 0 <= this.currentToolSetting.dijitID.indexOf("EnrichLayer") &&
            this.currentAnalysisDijit &&
            this.currentAnalysisDijit.enableTravelModes &&
            (b = !0);
        b ||
          ((a = t.create(
            "img",
            {
              class: "job-cancel-icon job-executing",
              src: this.folderUrl + "images/cancel.png",
              title: this.nls.cancelJob
            },
            a
          )),
          this.own(v(a, z, d.hitch(this, this._cancelTask))),
          this.a11y_addAttrsAndEventForCancelBtn(a));
      }
    },
    _getLayerNameSuffix: function(a, b) {
      return a === b
        ? 1
        : /_\d+$/.test(a) && 0 === a.indexOf(b)
        ? ((a = a.split("_")), Number(a[a.length - 1]) + 1)
        : 0;
    },
    _appendResultMessage: function(a) {
      if (a.outputLayerName || a.paramName) {
        var b = a.outputLayerName || a.paramName,
          c = 0,
          f = 0,
          g;
        e.forEach(
          this.map.graphicsLayerIds,
          d.hitch(this, function(a) {
            g = this.map.getLayer(a);
            f = this._getLayerNameSuffix(g.title, b);
            c < f && (c = f);
          })
        );
        e.forEach(
          this.map.layerIds,
          d.hitch(this, function(a) {
            a = this.map.getLayer(a);
            f = this._getLayerNameSuffix(a.title, b);
            c < f && (c = f);
          })
        );
        0 < c && (b = b + "_" + c);
        var h = t.create("div", { class: "output-item" }, this.outputSection);
        if (a.value && a.value.itemId) {
          var k = U.getItemDetailsPageUrl(
            this._getPortalUrl(this.privilegeUtil.getUserPortal()),
            a.value.itemId
          );
          "object" === typeof this.outputProperties &&
            a.value.itemId === this.outputProperties.itemProperties.itemId &&
            (b = this.outputProperties.serviceProperties.name);
          a = t.create(
            "a",
            { href: k, target: "_blank", innerHTML: P.stripHTML(b) },
            h
          );
          this.a11y_addAttrsForOutputLink(a);
        } else q.set(h, "innerHTML", b);
        return b;
      }
      return null;
    },
    _createExportNodeForUrl: function(a, b, c) {
      var e = new Q();
      e.returnGeometry = c;
      e.outSpatialReference = this.map.spatialReference;
      e.outFields = ["*"];
      e.where = "1\x3d1";
      return new K(b).execute(e).then(
        d.hitch(this, function(b) {
          var c = t.create("div", {}, this.outputSection);
          t.create("div", { class: "output-item", innerHTML: a }, c);
          this._createExportNode(b, c);
        }),
        function(a) {
          console.error(a.message ? a.message : a);
        }
      );
    },
    _createExportNode: function(a, b) {
      b || (b = this.outputSection);
      b = t.create("div", { class: "export-node" }, b);
      this.a11y_addAttrsForExportNode(b);
      this.own(
        v(
          b,
          z,
          d.hitch(this, function(b) {
            this._showActions(b, a);
          })
        )
      );
    },
    _showActions: function(a, b) {
      this.popupMenu
        .prepareActions(b, this.currentToolSetting.allowToExport)
        .then(
          d.hitch(this, function() {
            var b = x.position(a.target);
            this.popupMenu._setFocusedNodeBeforeOpen();
            this.popupMenu.show(b);
          })
        );
    },
    _getPortalUrl: function(a) {
      return a
        ? U.getStandardPortalUrl(a)
        : U.getStandardPortalUrl(this.appConfig.portalUrl);
    },
    _cancelTask: function() {
      this.currentToolJobId &&
        this.currentAnalysisDijit &&
        this.currentAnalysisDijit.cancel({ jobId: this.currentToolJobId });
    },
    _switchToPrevious: function() {
      this._deactiveDrawTool();
      2 === this.currentStack
        ? this._switchToAnalysisTool()
        : this._switchView(0);
    },
    _switchToHome: function() {
      this._deactiveDrawTool();
      1 < this.toolCountInList
        ? this._switchView(0)
        : this._switchToAnalysisTool();
    },
    _switchView: function(a) {
      this._closeHelpDialog();
      0 === a
        ? this._checkValidation().then(
            d.hitch(this, function() {
              0 === this.toolCountInList
                ? ((this.currentStack = a),
                  this.viewStack.switchView(a),
                  this._noPrivilegeHandler(this.nls.noToolTip))
                : 1 === this.toolCountInList
                ? (this._setIconAndLink(this.currentToolSetting),
                  this._switchToAnalysisTool())
                : ((this.currentStack = a), this.viewStack.switchView(a));
              this.a11y_switchView_toolList();
            })
          )
        : ((this.currentStack = a),
          this.viewStack.switchView(a),
          this.a11y_switchView_others(a, 1));
    }
  });
  k.extend(E);
  return k;
});
