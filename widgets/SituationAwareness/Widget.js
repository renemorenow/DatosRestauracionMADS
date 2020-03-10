// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "jimu/dijit/Report": function() {
      define("dojo/_base/declare jimu/BaseWidget jimu/utils dojo/Evented ./PageUtils dojo/text!./templates/ReportTemplate.html dojo/_base/lang dojo/_base/array dojo/_base/window dojo/dom-construct dojo/dom-class dojo/dom-style dojo/dom dojo/string dojo/on esri/tasks/PrintParameters esri/tasks/PrintTemplate esri/tasks/PrintTask".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a, n, c, k, g, e) {
        return r([q, v], {
          baseClass: "jimu-report",
          _printService: null,
          _printWindow: null,
          _sizeInPixels: {},
          _windowOpenedTimer: null,
          _shownUnableToPrintMapMsg: !1,
          printTaskUrl: null,
          reportLogo: "",
          reportLayout: {},
          maxNoOfCols: 3,
          styleSheets: [],
          styleText: "",
          constructor: function() {
            this.inherited(arguments);
            this._sizeInPixels = {};
            this.printTaskUrl = null;
            this.reportLayout = {};
            this.styleSheets = [];
          },
          postMixInProperties: function() {
            this.nls = f.mixin(window.jimuNls.common, window.jimuNls.report);
          },
          postCreate: function() {
            var a;
            a = {
              pageSize: m.PageSizes.A4,
              orientation: m.Orientation.Portrait
            };
            this.inherited(arguments);
            this.setReportLayout(this.reportLayout, a);
            this.reportLayout.dpi = 96;
            this.printTaskUrl && this._createPrintTask();
          },
          setReportLayout: function(a, c) {
            c || (c = this.reportLayout);
            this._validateParameters(a)
              ? (this.reportLayout = f.mixin(c, a))
              : (this.reportLayout = c);
          },
          setMapLayout: function(a) {
            var c;
            c = this.reportLayout.pageSize.MapLayout
              ? this.reportLayout.pageSize.MapLayout
              : "MAP_ONLY";
            if ("MAP_ONLY" === c)
              (a.exportOptions = { dpi: this.reportLayout.dpi }),
                this.reportLayout.orientation.Type ===
                  m.Orientation.Landscape.Type &&
                this.reportLayout.pageSize !== m.PageSizes.Custom
                  ? ((a.exportOptions.width = this._sizeInPixels.Height),
                    (a.exportOptions.height = this._sizeInPixels.Width))
                  : ((a.exportOptions.width = this._sizeInPixels.Width),
                    (a.exportOptions.height = this._sizeInPixels.Height));
            else if (c && m.PageSizes[c])
              c += " " + this.reportLayout.orientation.Type;
            else {
              var b = [];
              Object.keys(m.PageSizes).forEach(function(a) {
                b.push(m.PageSizes[a].MapLayout);
              });
              -1 < b.indexOf(c) &&
                (c += " " + this.reportLayout.orientation.Type);
            }
            a.layout = c;
            return a;
          },
          _validateParameters: function() {
            return this.reportLayout.pageSize !== m.PageSizes.Custom ||
              this.reportLayout.size
              ? !0
              : !1;
          },
          _createPrintTask: function() {
            this._printService = new e(this.printTaskUrl, { async: !1 });
          },
          _createPrintMapParameters: function(a) {
            var c, b;
            b = new g();
            a.printTemplate
              ? ((b = a.printTemplate),
                b.format
                  ? ((c = b.format.toLowerCase()),
                    "png32" !== c &&
                      "png8" !== c &&
                      "jpg" !== c &&
                      "gif" !== c &&
                      (b.format = "jpg"))
                  : (b.format = "jpg"))
              : ((b = this.setMapLayout(b)),
                (b.layoutOptions = { customTextElements: [{ Date: "" }] }),
                (b.preserveScale = !1),
                (b.showAttribution = !0),
                (b.format = "jpg"));
            c = new k();
            c.map = a.map;
            c.template = b;
            return c;
          },
          print: function(c, b) {
            var g, k;
            this._printService
              ? ((this._shownUnableToPrintMapMsg = !1),
                (g = screen.width / 2),
                (k = screen.height / 1.5),
                (g =
                  11 === u.has("ie")
                    ? "toolbar\x3dno, location\x3dno, directories\x3dno, status\x3dyes, menubar\x3dno,scrollbars\x3dyes, resizable\x3dyes, width\x3d" +
                      g +
                      ", height\x3d" +
                      k +
                      ", top\x3d" +
                      (screen.height / 2 - k / 2) +
                      ", left\x3d" +
                      (screen.width / 2 - g / 2)
                    : null),
                (k = u.detectUserAgent()),
                ((k.browser.hasOwnProperty("firefox") && k.browser.firefox) ||
                  (k.os.hasOwnProperty("ipad") && k.os.ipad) ||
                  (k.os.hasOwnProperty("iphone") && k.os.iphone)) &&
                  this._printWindow &&
                  this._printWindow.close(),
                (this._printWindow = window.open("", "_blank", g, !1)),
                this._windowOpenedTimer &&
                  clearInterval(this._windowOpenedTimer),
                (this._windowOpenedTimer = setInterval(
                  f.hitch(this, function() {
                    this._printWindow.closed &&
                      (clearInterval(this._windowOpenedTimer),
                      this.emit("report-window-closed"));
                  }),
                  500
                )),
                this._printWindow.focus(),
                setTimeout(
                  f.hitch(this, function() {
                    t.withDoc(
                      this._printWindow.document,
                      f.hitch(this, function() {
                        this._printWindow.document.open("text/html", "replace");
                        this._printWindow.document.write(h);
                        window.isRTL && x.add(a.byId("reportBody"), "jimu-rtl");
                        ((this.styleSheets && 0 < this.styleSheets.length) ||
                          (this.styleText && "" !== this.styleText)) &&
                          this._addExternalStyleSheets();
                        this._setPageSize();
                        this._setButtonLabels();
                        this._setReportSizeMessage();
                        this._setReportLogo();
                        this._setReportTitle(c);
                        this._setReportData(b);
                        this._setFootNotes();
                        this._printWindow.document.close();
                      })
                    );
                  }),
                  500
                ))
              : this.emit("reportError");
          },
          _addExternalStyleSheets: function() {
            var c = a.byId("reportHead");
            c &&
              (d.forEach(
                this.styleSheets,
                f.hitch(this, function(a) {
                  l.create(
                    "link",
                    { rel: "stylesheet", type: "text/css", href: a },
                    c
                  );
                })
              ),
              this.styleText &&
                l.create(
                  "style",
                  { type: "text/css", innerHTML: this.styleText },
                  c
                ));
          },
          _setPageSize: function() {
            var c, g, k;
            k = a.byId("reportMain");
            this.reportLayout &&
              ((c = this.reportLayout.pageSize),
              this.reportLayout.pageSize === m.PageSizes.Custom &&
                this.reportLayout.size &&
                (c = this.reportLayout.size),
              (c = m.getPageSizeInPixels(c, this.reportLayout.dpi)));
            g =
              this.reportLayout.orientation.Type ===
                m.Orientation.Landscape.Type &&
              this.reportLayout.pageSize !== m.PageSizes.Custom
                ? c.Height
                : c.Width;
            this._sizeInPixels = c;
            b.set(k, { width: g + "px" });
          },
          _setReportData: function(c) {
            var b = a.byId("reportData"),
              g = a.byId("showErrorButton");
            g.innerHTML = this.nls.unableToPrintMapMsg;
            b &&
              d.forEach(
                c,
                f.hitch(this, function(a) {
                  var c = l.create("div", {}, b);
                  a.addPageBreak && x.add(c, "esriCTPageBreak");
                  "table" === a.type
                    ? this._formatAndRenderTables(c, a)
                    : "html" === a.type
                    ? this._renderHTMLData(c, a)
                    : "map" === a.type
                    ? (a.title && this._addSectionTitle(a.title, c),
                      x.add(c, "esriCTReportMap esriCTReportMapWait"),
                      a.extent && a.data.map.setExtent(a.extent),
                      this._executePrintTask(a, c, g))
                    : "note" === a.type && this._createReportNote(c, a);
                })
              );
          },
          _setFootNotes: function() {
            var c, b;
            (b = a.byId("footNotes")) &&
              this.footNotes &&
              ((c = u.sanitizeHTML(this.footNotes ? this.footNotes : "")),
              (b.innerHTML = u.fieldFormatter.getFormattedUrl(c)));
          },
          _setReportLogo: function() {
            var g, k, e, d;
            (g = a.byId("reportLogo")) &&
              this.reportLogo &&
              (x.remove(g, "esriCTHidden"),
              (g.src = this.reportLogo),
              (d = a.byId("reportHeader")),
              (k = a.byId("reportMain")),
              (e = a.byId("printTitleDiv")),
              window.isRTL && l.place(e, d, "first"),
              k &&
                e &&
                (g.complete &&
                  b.set(e, {
                    width: k.clientWidth - g.clientWidth - 51 + "px"
                  }),
                this.own(
                  c(
                    g,
                    "load",
                    f.hitch(this, function() {
                      setTimeout(
                        f.hitch(this, function() {
                          b.set(e, {
                            width: k.clientWidth - g.clientWidth - 51 + "px"
                          });
                        }),
                        300
                      );
                    })
                  )
                )));
          },
          _setReportTitle: function(c) {
            var b = a.byId("reportTitle");
            b && c && (b.value = c);
          },
          _createReportNote: function(a, b) {
            var g,
              k = "",
              e;
            b.title && (k = b.title);
            k = this._addSectionTitle(k, a);
            x.add(k, "esriCTNotesTitle");
            g = l.create(
              "textarea",
              {
                class: "esriCTReportNotes",
                placeholder: this.nls.notesHint,
                rows: 5
              },
              a
            );
            e = l.create("p", { class: "esriCTReportNotesParagraph" }, a);
            x.add(a, "esriCTNotesContainer");
            b.defaultText && (g.value = b.defaultText);
            this.own(
              c(g, "keydown, change", function() {
                g.style.height = "auto";
                e.innerHTML = u.sanitizeHTML(g.value ? g.value : "");
                g.style.height = g.scrollHeight + "px";
              })
            );
          },
          _setReportSizeMessage: function() {
            var c, b;
            this.reportLayout.pageSize === m.PageSizes.Custom &&
            this.reportLayout.size
              ? ((c = this.reportLayout.size), (b = this.reportLayout.pageSize))
              : ((c = this.reportLayout.pageSize),
                (b = this.reportLayout.pageSize.SizeName
                  ? this.reportLayout.pageSize.SizeName
                  : this.reportLayout.SizeName));
            c =
              this.reportLayout.orientation.Type ===
                m.Orientation.Landscape.Type &&
              this.reportLayout.pageSize !== m.PageSizes.Custom
                ? " (" + c.Height + "'' X " + c.Width + "'') "
                : " (" + c.Width + "'' X " + c.Height + "'') ";
            a.byId("reportBarMsg").innerHTML = n.substitute(
              this.nls.reportDimensionsMsg,
              { paperSize: b + c + this.reportLayout.orientation.Text }
            );
          },
          _setButtonLabels: function() {
            var c = a.byId("printButton");
            c.innerHTML = this.nls.printButtonLabel;
            c.title = this.nls.printButtonLabel;
            c = a.byId("closeButton");
            c.innerHTML = this.nls.close;
            c.title = this.nls.close;
          },
          _executePrintTask: function(a, c, b) {
            a = this._createPrintMapParameters(a);
            this._printService.execute(
              a,
              f.hitch(this, function(a) {
                c &&
                  (x.remove(c, "esriCTReportMapWait"),
                  (a = l.create(
                    "img",
                    { src: a.url, class: "esriCTReportMapImg" },
                    c
                  )),
                  this.reportLayout.orientation.Type ===
                    m.Orientation.Landscape.Type &&
                    x.add(a, "esriCTReportLandscapeMapImg"));
                this.emit("report-export-task-completed");
              }),
              f.hitch(this, function() {
                x.replace(
                  c,
                  "esriCTReportMapFail",
                  "esriCTPageBreak esriCTReportMapWait"
                );
                this._shownUnableToPrintMapMsg ||
                  ((this._shownUnableToPrintMapMsg = !0), b.click());
                this.emit("report-export-task-failed");
              })
            );
          },
          _renderHTMLData: function(a, c) {
            a = l.create("div", { class: "esriCTHTMLData" }, a);
            c.title && this._addSectionTitle(c.title, a);
            l.create("div", { innerHTML: c.data }, a);
          },
          _addSectionTitle: function(a, c) {
            a = u.sanitizeHTML(a ? a : "");
            return l.create(
              "div",
              { innerHTML: a, class: a ? "esriCTSectionTitle" : "" },
              c
            );
          },
          _formatAndRenderTables: function(a, c) {
            var b = c.data,
              g,
              k,
              e,
              d,
              f = this.maxNoOfCols;
            b.maxNoOfCols && (f = b.maxNoOfCols);
            b.cols.length > f && 2 >= b.cols.length - f && (f = b.cols.length);
            g = 0;
            for (k = b.cols.length; g < k; g += f) {
              var n = { cols: [], rows: [] },
                J = g + f,
                t = !1;
              n.title = 0 === g ? c.title : "";
              e = b.cols.length - J;
              2 >= e && 0 < e && ((J += e), (t = !0));
              e = b.cols.slice(g, J);
              d = [];
              for (var h = 0; h < b.rows.length; h++)
                d.push(b.rows[h].slice(g, J));
              n.cols = e;
              n.rows = d;
              this._renderTable(l.create("div", {}, a), n, c.data.showRowIndex);
              if (t) break;
            }
          },
          _renderTable: function(a, c, b) {
            var g, k;
            this._addSectionTitle(c.title, a);
            a = l.create(
              "table",
              {
                cellpadding: 5,
                style: { width: "100%" },
                class: "esriCTTable"
              },
              a
            );
            g = l.create("tbody", {}, a);
            k = l.create("tr", {}, g);
            b &&
              l.create("th", { innerHTML: "#", style: { width: "20px" } }, k);
            d.forEach(
              c.cols,
              f.hitch(this, function(a) {
                l.create("th", { innerHTML: a }, k);
              })
            );
            d.forEach(
              c.rows,
              f.hitch(this, function(a, c) {
                var k;
                k = l.create("tr", {}, g);
                b &&
                  l.create(
                    "td",
                    { innerHTML: c + 1, style: { "word-wrap": "normal" } },
                    k
                  );
                d.forEach(
                  a,
                  f.hitch(this, function(a) {
                    a = u.fieldFormatter.getFormattedUrl(a);
                    l.create("td", { innerHTML: a }, k);
                  })
                );
              })
            );
          }
        });
      });
    },
    "jimu/dijit/PageUtils": function() {
      define([], function() {
        var r = {};
        r.Orientation = {
          Landscape: {
            Type: "Landscape",
            Text: window.jimuNls.report.landscape
          },
          Portrait: { Type: "Portrait", Text: window.jimuNls.report.portrait }
        };
        r.PageSizes = {
          A0: {
            Height: 46.8,
            Width: 33.1,
            SizeName: window.jimuNls.report.a0,
            MapLayout: "MAP_ONLY"
          },
          A1: {
            Height: 33.1,
            Width: 23.4,
            SizeName: window.jimuNls.report.a1,
            MapLayout: "MAP_ONLY"
          },
          A2: {
            Height: 23.4,
            Width: 16.5,
            SizeName: window.jimuNls.report.a2,
            MapLayout: "MAP_ONLY"
          },
          A3: {
            Height: 16.5,
            Width: 11.7,
            SizeName: window.jimuNls.report.a3,
            MapLayout: "A3"
          },
          A4: {
            Height: 11.7,
            Width: 8.3,
            SizeName: window.jimuNls.report.a4,
            MapLayout: "A4"
          },
          A5: {
            Height: 8.3,
            Width: 5.8,
            SizeName: window.jimuNls.report.a5,
            MapLayout: "MAP_ONLY"
          },
          Letter_ANSI_A: {
            Height: 11,
            Width: 8.5,
            SizeName:
              window.jimuNls.report.letter + " " + window.jimuNls.report.ansi_a,
            MapLayout: "Letter ANSI A"
          },
          Tabloid_ANSI_B: {
            Height: 17,
            Width: 11,
            SizeName:
              window.jimuNls.report.tabloid +
              " " +
              window.jimuNls.report.ansi_b,
            MapLayout: "Tabloid ANSI B"
          },
          ANSI_C: {
            Height: 22,
            Width: 17,
            SizeName: window.jimuNls.report.ansi_c,
            MapLayout: "MAP_ONLY"
          },
          ANSI_D: {
            Height: 34,
            Width: 22,
            SizeName: window.jimuNls.report.ansi_d,
            MapLayout: "MAP_ONLY"
          },
          ANSI_E: {
            Height: 44,
            Width: 34,
            SizeName: window.jimuNls.report.ansi_e,
            MapLayout: "MAP_ONLY"
          },
          Legal: {
            Height: 14,
            Width: 8.5,
            SizeName: window.jimuNls.report.legal,
            MapLayout: "MAP_ONLY"
          },
          Custom: window.jimuNls.common.custom
        };
        r.getPageSizeInPixels = function(q, r) {
          return { Height: q.Height * r, Width: q.Width * r };
        };
        return r;
      });
    },
    "esri/tasks/PrintParameters": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.PrintParameters",
          map: null,
          template: null,
          outSpatialReference: null,
          extraParameters: null
        });
        u("extend-esri") && q.setObject("tasks.PrintParameters", r, v);
        return r;
      });
    },
    "esri/tasks/PrintTemplate": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
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
        u("extend-esri") && q.setObject("tasks.PrintTemplate", r, v);
        return r;
      });
    },
    "esri/tasks/PrintTask": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/_base/Deferred dojo/has ../kernel ../lang ../layerUtils ../deferredUtils ../Color ../request ../urlUtils ../geometry/Polygon ../renderers/SimpleRenderer ../symbols/FillSymbol ./Geoprocessor ./PrintTemplate ./Task dojo/dom-attr dojo/dom-construct dojox/gfx/_base dojox/gfx/canvas dojox/json/query dojo/has!extend-esri?./PrintParameters dojo/has!extend-esri?./LegendLayer".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F,
        G
      ) {
        r = r(E, {
          declaredClass: "esri.tasks.PrintTask",
          constructor: function(a, c) {
            this.url = a;
            this.printGp = new g(this.url);
            this._handler = q.hitch(this, this._handler);
            c && c.async && (this.async = !0);
            this._colorEvaluator = G("$..color");
          },
          async: !1,
          _vtlExtent: null,
          _cimVersion: null,
          _is11xService: !1,
          _loadGpServerMetadata: !0,
          execute: function(a, c, g) {
            if (!this._loadGpServerMetadata) return this._execute(a, c, g);
            var k = new m(l._dfdCanceller),
              e = this._url.path,
              f = e.lastIndexOf("/GPServer/");
            0 < f && (e = e.slice(0, f + 9));
            k._pendingDfd = b({
              url: e,
              callbackParamName: "callback",
              content: q.mixin({}, this._url.query, { f: "json" })
            })
              .then(
                q.hitch(this, function(c) {
                  this._loadGpServerMetadata = !1;
                  this.async =
                    "esriExecutionTypeAsynchronous" === c.executionType;
                  this._cimVersion = c.cimVersion;
                  this._is11xService = !!this._cimVersion;
                  k._pendingDfd = this._execute(a);
                  return k._pendingDfd;
                })
              )
              .then(
                q.hitch(this, function(a) {
                  this._successHandler([a], null, c, k);
                })
              )
              .otherwise(function(a) {
                g && g(a);
                k.errback(a);
              });
            return k;
          },
          _handler: function(a, c, b, g, k) {
            try {
              var e;
              this.async
                ? "esriJobSucceeded" === a.jobStatus
                  ? this.printGp.getResultData(
                      a.jobId,
                      "Output_File",
                      q.hitch(this, function(a) {
                        e = a.value;
                        this._successHandler([e], "onComplete", b, k);
                      })
                    )
                  : this._errorHandler(Error(a.jobStatus), g, k)
                : ((e = a[0].value),
                  this._successHandler([e], "onComplete", b, k));
            } catch (y) {
              this._errorHandler(y, g, k);
            }
          },
          _execute: function(a, c, b) {
            var g = this._handler,
              k = this._errorHandler,
              f = a.template || new e();
            f.hasOwnProperty("showLabels") || (f.showLabels = !0);
            var y = f.exportOptions,
              n;
            y && (n = { outputSize: [y.width, y.height], dpi: y.dpi });
            var y = f.layoutOptions,
              t,
              I = [];
            if (y) {
              this.legendAll = !1;
              y.legendLayers
                ? u.forEach(y.legendLayers, function(a) {
                    var c = {};
                    c.id = a.layerId;
                    a.subLayerIds && (c.subLayerIds = a.subLayerIds);
                    I.push(c);
                  })
                : (this.legendAll = !0);
              var z, C;
              if ("Miles" === y.scalebarUnit || "Kilometers" === y.scalebarUnit)
                (z = "esriKilometers"), (C = "esriMiles");
              else if ("Meters" === y.scalebarUnit || "Feet" === y.scalebarUnit)
                (z = "esriMeters"), (C = "esriFeet");
              t = {
                esriMiles: "mi",
                esriKilometers: "km",
                esriFeet: "ft",
                esriMeters: "m"
              };
              t = {
                titleText: y.titleText,
                authorText: y.authorText,
                copyrightText: y.copyrightText,
                customTextElements: y.customTextElements,
                scaleBarOptions: {
                  metricUnit: z,
                  metricLabel: t[z],
                  nonMetricUnit: C,
                  nonMetricLabel: t[C]
                },
                legendOptions: { operationalLayers: I }
              };
            }
            z = this._getPrintDefinition(a.map, f);
            a.outSpatialReference &&
              (z.mapOptions.spatialReference = a.outSpatialReference.toJson());
            a.template &&
              d.isDefined(a.template.showAttribution) &&
              (z.mapOptions.showAttribution = a.template.showAttribution);
            q.mixin(z, { exportOptions: n, layoutOptions: t });
            this.allLayerslegend &&
              q.mixin(z.layoutOptions, {
                legendOptions: { operationalLayers: this.allLayerslegend }
              });
            if (z.operationalLayers) {
              n = z.operationalLayers;
              var h,
                w = function(a) {
                  return d.fixJson(
                    q.mixin(a, {
                      type: "esriSLS",
                      cap: void 0,
                      join: void 0,
                      meterLimit: void 0
                    })
                  );
                },
                A = /[\u4E00-\u9FFF\u0E00-\u0E7F\u0900-\u097F\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/,
                E = /[\u0600-\u06FF]/,
                x = function(a) {
                  var c = a.text,
                    b = (a = a.font) && a.family && a.family.toLowerCase();
                  c &&
                    a &&
                    ("arial" === b || "arial unicode ms" === b) &&
                    ((a.family = A.test(c) ? "Arial Unicode MS" : "Arial"),
                    "normal" !== a.style &&
                      E.test(c) &&
                      (a.family = "Arial Unicode MS"));
                };
              for (t = 0; t < n.length; t++)
                if (n[t].featureCollection && n[t].featureCollection.layers)
                  for (C = 0; C < n[t].featureCollection.layers.length; C++) {
                    var D = n[t].featureCollection.layers[C];
                    D.layerDefinition &&
                      D.layerDefinition.drawingInfo &&
                      D.layerDefinition.drawingInfo.renderer &&
                      D.layerDefinition.drawingInfo.renderer.symbol &&
                      ((h = D.layerDefinition.drawingInfo.renderer),
                      "esriCLS" === h.symbol.type
                        ? (h.symbol = w(h.symbol))
                        : "esriTS" === h.symbol.type
                        ? x(h.symbol)
                        : h.symbol.outline &&
                          "esriCLS" === h.symbol.outline.type &&
                          (h.symbol.outline = w(h.symbol.outline)));
                    if (D.featureSet && D.featureSet.features)
                      for (y = 0; y < D.featureSet.features.length; y++)
                        (h = D.featureSet.features[y]),
                          h.symbol &&
                            ("esriCLS" === h.symbol.type
                              ? (h.symbol = w(h.symbol))
                              : "esriTS" === h.symbol.type
                              ? x(h.symbol)
                              : h.symbol.outline &&
                                "esriCLS" === h.symbol.outline.type &&
                                (h.symbol.outline = w(h.symbol.outline)));
                  }
            }
            f = {
              Web_Map_as_JSON: v.toJson(d.fixJson(z)),
              Format: f.format,
              Layout_Template: f.layout
            };
            a.extraParameters && (f = q.mixin(f, a.extraParameters));
            var G = new m(l._dfdCanceller);
            a = function(a, y) {
              g(a, y, c, b, G);
            };
            z = function(a) {
              k(a, b, G);
            };
            G._pendingDfd = this.async
              ? this.printGp.submitJob(f, a, null, z)
              : this.printGp.execute(f, a, z);
            return G;
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
              !(8 >= h("ie") || (!a.path && "image/svg+xml" !== a.contentType))
            ) {
              var c,
                b = F.createSurface(w.create("div"), 1024, 1024);
              c =
                "image/svg+xml" === a.contentType
                  ? b.createObject(F.Image, {
                      src: "data:image/svg+xml;base64," + a.imageData,
                      width: B.pt2px(a.width),
                      height: B.pt2px(a.height),
                      x: 0,
                      y: 0
                    })
                  : b
                      .createObject(F.Path, a.path)
                      .setFill(a.color)
                      .setStroke(a.outline);
              "pendingRender" in b && b._render(!0);
              var g = b.rawNode.getContext("2d"),
                k = Math.ceil(c.getBoundingBox().width),
                e = Math.ceil(c.getBoundingBox().height);
              c = g.getImageData(
                c.getBoundingBox().x,
                c.getBoundingBox().y,
                k,
                e
              );
              g.canvas.width = k;
              g.canvas.height = e;
              g.putImageData(c, 0, 0);
              g = g.canvas.toDataURL("image/png");
              a = {
                type: "esriPMS",
                imageData: g.substr(22, g.length),
                angle: a.angle,
                contentType: "image/png",
                height: a.size ? a.size : B.px2pt(e),
                width: a.size ? (k / e) * a.size : B.px2pt(k),
                xoffset: a.xoffset,
                yoffset: a.yoffset
              };
              b.destroy();
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
                  u.forEach(
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
                  u.forEach(
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
          _createFeatureCollection: function(a, c, b, g) {
            var k = this._createPolygonLayer(),
              e = this._createPolylineLayer(),
              y = this._createPointLayer(),
              f = this._createMultipointLayer(),
              d = this._createPointLayer();
            d.layerDefinition.name = "textLayer";
            delete d.layerDefinition.drawingInfo;
            if (
              "esri.layers.FeatureLayer" === a.declaredClass ||
              "esri.layers.StreamLayer" === a.declaredClass
            )
              k.layerDefinition.name = e.layerDefinition.name = y.layerDefinition.name = f.layerDefinition.name =
                q.getObject("arcgisProps.title", !1, a) || a.name || a.id;
            var J =
              a.renderer &&
              "esri.renderer.SimpleRenderer" === a.renderer.declaredClass;
            if (
              !a.renderer ||
              a.renderer.valueExpression ||
              q.isFunction(a.renderer.attributeField)
            )
              delete k.layerDefinition.drawingInfo,
                delete e.layerDefinition.drawingInfo,
                delete y.layerDefinition.drawingInfo,
                delete f.layerDefinition.drawingInfo;
            else {
              var z = a.renderer.toJson({ useLegacyRotationProperties: !0 });
              if ("temporal" === z.type) {
                var z = {
                    latestObservationRenderer: z.latestObservationRenderer,
                    trackLinesRenderer: z.trackRenderer,
                    observationAger: z.observationAger,
                    renderer: z.observationRenderer
                  },
                  t = {};
                a._trackIdField && (t.trackIdField = a._trackIdField);
                a._startTimeField && (t.startTimeField = a._startTimeField);
                a._endTimeField && (t.endTimeField = a._endTimeField);
                k.layerDefinition.drawingInfo = z;
                k.layerDefinition.timeInfo = t;
                e.layerDefinition.drawingInfo = z;
                e.layerDefinition.timeInfo = t;
                y.layerDefinition.drawingInfo = z;
                y.layerDefinition.timeInfo = t;
                f.layerDefinition.drawingInfo = z;
                f.layerDefinition.timeInfo = t;
              } else
                (k.layerDefinition.drawingInfo.renderer = z),
                  (e.layerDefinition.drawingInfo.renderer = z),
                  (y.layerDefinition.drawingInfo.renderer = z),
                  (f.layerDefinition.drawingInfo.renderer = z);
            }
            z = a.fields;
            z ||
              !a.renderer ||
              a.renderer.valueExpression ||
              q.isFunction(a.renderer.attributeField) ||
              ("esri.renderer.ClassBreaksRenderer" === a.renderer.declaredClass
                ? ((z = [
                    {
                      name: a.renderer.attributeField,
                      type: "esriFieldTypeDouble"
                    }
                  ]),
                  a.renderer.normalizationField &&
                    z.push({
                      name: a.renderer.normalizationField,
                      type: "esriFieldTypeDouble"
                    }))
                : "esri.renderer.UniqueValueRenderer" ===
                    a.renderer.declaredClass &&
                  ((z = [
                    {
                      name: a.renderer.attributeField,
                      type: "esriFieldTypeString"
                    }
                  ]),
                  a.renderer.attributeField2 &&
                    z.push({
                      name: a.renderer.attributeField2,
                      type: "esriFieldTypeString"
                    }),
                  a.renderer.attributeField3 &&
                    z.push({
                      name: a.renderer.attributeField3,
                      type: "esriFieldTypeString"
                    })));
            z &&
              ((k.layerDefinition.fields = z),
              (e.layerDefinition.fields = z),
              (y.layerDefinition.fields = z),
              (f.layerDefinition.fields = z));
            z = a.graphics;
            a.isFeatureReductionActive &&
              a.isFeatureReductionActive() &&
              (z = a.getSingleGraphics());
            var t = z.length,
              l,
              h;
            for (h = 0; h < t; h++) {
              var C = z[h];
              if (!1 !== C.visible && C.geometry) {
                l = C.toJson();
                l.symbol &&
                  l.symbol.outline &&
                  l.symbol.outline.color &&
                  l.symbol.outline.color[3] &&
                  !this._is11xService &&
                  (l.symbol.outline.color[3] = 255);
                if (
                  a.renderer &&
                  !l.symbol &&
                  (q.isFunction(a.renderer.attributeField) ||
                    a.renderer.valueExpression ||
                    this._isFeatureCollectionRequired(a.renderer, a) ||
                    "esri.renderer.DotDensityRenderer" ===
                      a.renderer.declaredClass ||
                    b)
                ) {
                  b = b || a.renderer;
                  var w = null;
                  try {
                    w = b.getSymbol(C);
                  } catch (N) {}
                  if (!w) continue;
                  l.symbol = w.toJson();
                  this._isFeatureCollectionRequired(b, a) &&
                    this._applyVisualVariables(l.symbol, {
                      renderer: b,
                      graphic: C,
                      symbol: w,
                      mapResolution: c && c.getResolutionInMeters(),
                      mapScale: c && c.getScale()
                    });
                }
                l.symbol &&
                  (l.symbol.path || "image/svg+xml" === l.symbol.contentType
                    ? (l.symbol = this._convertSvgSymbol(l.symbol))
                    : l.symbol.text && delete l.attributes);
                switch (C.geometry.type) {
                  case "polygon":
                    k.featureSet.features.push(l);
                    break;
                  case "polyline":
                    e.featureSet.features.push(l);
                    break;
                  case "point":
                    l.symbol && l.symbol.text
                      ? d.featureSet.features.push(l)
                      : y.featureSet.features.push(l);
                    break;
                  case "multipoint":
                    f.featureSet.features.push(l);
                    break;
                  case "extent":
                    (l.geometry = n.fromExtent(C.geometry).toJson()),
                      k.featureSet.features.push(l);
                }
              }
            }
            c = [];
            0 < k.featureSet.features.length && c.push(k);
            0 < e.featureSet.features.length && c.push(e);
            0 < f.featureSet.features.length && c.push(f);
            0 < y.featureSet.features.length && c.push(y);
            0 < d.featureSet.features.length && c.push(d);
            if (!c.length) return null;
            u.forEach(c, function(a) {
              var c = u.every(a.featureSet.features, function(a) {
                return a.symbol;
              });
              if (J || c)
                (g && g.forceFeatureAttributes) ||
                  u.forEach(a.featureSet.features, function(a) {
                    delete a.attributes;
                  }),
                  g.forceFeatureAttributes || delete a.layerDefinition.fields;
              c && delete a.layerDefinition.drawingInfo;
            });
            u.forEach(
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
              id: a.id,
              opacity: a.opacity,
              minScale: a.minScale || 0,
              maxScale: a.maxScale || 0,
              featureCollection: { layers: c }
            };
          },
          _getPrintDefinition: function(a, c) {
            var b = { operationalLayers: this._createOperationalLayers(a, c) },
              g = this._vtlExtent || a.extent,
              k = a.spatialReference;
            this._vtlExtent = null;
            a.spatialReference._isWrappable() &&
              ((g = g._normalize(!0)), (k = g.spatialReference));
            g = {
              mapOptions: {
                showAttribution: a.showAttribution,
                extent: g.toJson(),
                spatialReference: k.toJson()
              }
            };
            c.preserveScale &&
              q.mixin(g.mapOptions, { scale: c.outScale || a.getScale() });
            a.timeExtent &&
              q.mixin(g.mapOptions, {
                time: [
                  a.timeExtent.startTime.getTime(),
                  a.timeExtent.endTime.getTime()
                ]
              });
            a = {};
            q.mixin(a, g, b);
            return a;
          },
          _createOperationalLayers: function(b, g) {
            var k,
              e,
              d,
              n,
              y = [],
              l = 0;
            g.preserveScale && (l = g.outScale || b.getScale());
            this.allLayerslegend = this.legendAll ? [] : null;
            this._vtlExtent = null;
            var h = u.map(b.layerIds, b.getLayer, b);
            b._mapImageLyr && h.push(b._mapImageLyr);
            for (k = 0; k < h.length; k++)
              if (
                ((e = h[k]),
                e.loaded && e.visible && (!l || e.isVisibleAtScale(l)))
              )
                switch (
                  ((d = e.declaredClass),
                  (n = {
                    id: e.id,
                    title: q.getObject("arcgisProps.title", !1, e) || e.id,
                    opacity: e.opacity,
                    minScale: e.minScale || 0,
                    maxScale: e.maxScale || 0
                  }),
                  (n = q.mixin(n, this._getUrlAndToken(e))),
                  e.getNode() &&
                    D.get(e.getNode(), "data-reference") &&
                    (n._isRefLayer = !0),
                  d)
                ) {
                  case "esri.layers.ArcGISDynamicMapServiceLayer":
                    var I = [];
                    d = !!e._params.layers;
                    if (e._params.dynamicLayers)
                      (d = g.outScale
                        ? e._getDynLayerObjs(g.outScale)
                        : v.fromJson(e._params.dynamicLayers)),
                        u.forEach(d, function(a) {
                          I.push({
                            id: a.id,
                            name: a.name,
                            layerDefinition: a
                          });
                          delete a.id;
                          delete a.name;
                          delete a.maxScale;
                          delete a.minScale;
                        }),
                        0 === I.length && (n.visibleLayers = [-1]);
                    else if (e.supportsDynamicLayers) {
                      if (d || e.layerDefinitions || e.layerTimeOptions) {
                        var z = e.createDynamicLayerInfosFromLayerInfos(),
                          K = null;
                        d && (K = e.visibleLayers);
                        var K = t._getVisibleLayers(z, K),
                          w = t._getLayersForScale(
                            g.outScale || b.getScale(),
                            z
                          );
                        u.forEach(z, function(a) {
                          if (!a.subLayerIds) {
                            var c = a.id;
                            -1 < u.indexOf(K, c) &&
                              -1 < u.indexOf(w, c) &&
                              ((a = { source: a.source.toJson() }),
                              e.layerDefinitions &&
                                e.layerDefinitions[c] &&
                                (a.definitionExpression =
                                  e.layerDefinitions[c]),
                              e.layerTimeOptions &&
                                e.layerTimeOptions[c] &&
                                (a.layerTimeOptions = e.layerTimeOptions[
                                  c
                                ].toJson()),
                              I.push({ id: c, layerDefinition: a }));
                          }
                        });
                        0 === I.length && (n.visibleLayers = [-1]);
                      }
                    } else
                      u.forEach(e.layerInfos, function(a) {
                        var c = { id: a.id, layerDefinition: {} };
                        e.layerDefinitions &&
                          e.layerDefinitions[a.id] &&
                          (c.layerDefinition.definitionExpression =
                            e.layerDefinitions[a.id]);
                        e.layerTimeOptions &&
                          e.layerTimeOptions[a.id] &&
                          (c.layerDefinition.layerTimeOptions = e.layerTimeOptions[
                            a.id
                          ].toJson());
                        (c.layerDefinition.definitionExpression ||
                          c.layerDefinition.layerTimeOptions) &&
                          I.push(c);
                      }),
                        d &&
                          (n.visibleLayers = e.visibleLayers.length
                            ? e.visibleLayers
                            : [-1]);
                    I.length && (n.layers = I);
                    y.push(n);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({
                        id: e.id,
                        subLayerIds: e.visibleLayers
                      });
                    break;
                  case "esri.layers.ArcGISImageServiceLayer":
                    n = q.mixin(n, {
                      url: e.url,
                      bandIds: e.bandIds,
                      compressionQuality: e.compressionQuality,
                      format: e.format,
                      interpolation: e.interpolation
                    });
                    e.mosaicRule &&
                      q.mixin(n, { mosaicRule: e.mosaicRule.toJson() });
                    if (e.renderingRule || e.renderer)
                      this._is11xService
                        ? (e.renderingRule &&
                            (n.renderingRule = e.renderingRule.toJson()),
                          e.renderer &&
                            ((n.layerDefinition = n.layerDefinition || {}),
                            (n.layerDefinition.drawingInfo =
                              n.layerDefinition.drawingInfo || {}),
                            (n.layerDefinition.drawingInfo.renderer = e.renderer.toJson())))
                        : (d = e.getExportImageRenderingRule()) &&
                          q.mixin(n, { renderingRule: d.toJson() });
                    y.push(n);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({ id: e.id });
                    break;
                  case "esri.layers.WMSLayer":
                    n = q.mixin(n, {
                      url: e.url,
                      title: e.title,
                      type: "wms",
                      version: e.version,
                      transparentBackground: e.imageTransparency,
                      visibleLayers: e.visibleLayers
                    });
                    y.push(n);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({
                        id: e.id,
                        subLayerIds: e.visibleLayers
                      });
                    break;
                  case "esri.virtualearth.VETiledLayer":
                    d = e.mapStyle;
                    "roadOnDemand" === d
                      ? (d = "Road")
                      : "aerialWithLabelsOnDemand" === d && (d = "Hybrid");
                    n = q.mixin(n, {
                      visibility: e.visible,
                      type: "BingMaps" + d,
                      culture: e.culture,
                      key: e.bingMapsKey
                    });
                    y.push(n);
                    break;
                  case "esri.layers.OpenStreetMapLayer":
                    n = q.mixin(n, {
                      credits: e.copyright,
                      type: "OpenStreetMap",
                      url: a.getAbsoluteUrl(e.tileServers[0])
                    });
                    y.push(n);
                    break;
                  case "esri.layers.WMTSLayer":
                    n = q.mixin(n, {
                      url: e.url,
                      type: "wmts",
                      layer: e._identifier,
                      style: e._style,
                      format: e.format,
                      tileMatrixSet: e._tileMatrixSetId
                    });
                    y.push(n);
                    break;
                  case "esri.layers.MapImageLayer":
                    d = e.getImages();
                    u.forEach(d, function(a, c) {
                      a.visible &&
                        a.href &&
                        ((n = {
                          id: e.id + "_image" + c,
                          type: "image",
                          title: e.id,
                          minScale: e.minScale || 0,
                          maxScale: e.maxScale || 0,
                          opacity: e.opacity * a.opacity,
                          extent: a.extent.toJson()
                        }),
                        "data:image/png;base64," === a.href.substr(0, 22)
                          ? (n.imageData = a.href.substr(22))
                          : (n.url = a.href),
                        y.push(n));
                    });
                    break;
                  case "esri.layers.VectorTileLayer":
                    delete n.url;
                    delete n.token;
                    if (
                      this._is11xService &&
                      e.currentStyleInfo.serviceUrl &&
                      e.currentStyleInfo.styleUrl &&
                      ((d =
                        f.id &&
                        f.id.findCredential(e.currentStyleInfo.styleUrl)),
                      (z =
                        f.id &&
                        f.id.findCredential(e.currentStyleInfo.serviceUrl)),
                      (!d && !z) || "2.1.0" !== this._cimVersion)
                    ) {
                      n.type = "VectorTileLayer";
                      n.styleUrl = e.currentStyleInfo.styleUrl;
                      d && (n.token = d.token);
                      z &&
                        z.token !== n.token &&
                        (n.additionalTokens = [
                          { url: e.currentStyleInfo.serviceUrl, token: z.token }
                        ]);
                      y.push(n);
                      break;
                    }
                    n.type = "image";
                    d = this._vtlExtent || b.extent.offset(0, 0);
                    var E = (g.exportOptions && g.exportOptions.dpi) || 96,
                      z = { format: "png", pixelRatio: E / 96 };
                    "MAP_ONLY" !== g.layout ||
                      !g.preserveScale ||
                      (g.outScale && g.outScale !== b.getScale()) ||
                      96 !== E ||
                      !g.exportOptions ||
                      (g.exportOptions.width % 2 === b.width % 2 &&
                        g.exportOptions.height % 2 === b.height % 2) ||
                      ((z.area = {
                        x: 0,
                        y: 0,
                        width: b.width,
                        height: b.height
                      }),
                      g.exportOptions.width % 2 !== b.width % 2 &&
                        --z.area.width,
                      g.exportOptions.height % 2 !== b.height % 2 &&
                        --z.area.height,
                      this._vtlExtent ||
                        ((E = b.toMap({ x: z.area.width, y: z.area.height })),
                        d.update(d.xmin, E.y, E.x, d.ymax, d.spatialReference),
                        (this._vtlExtent = d)));
                    n.extent = d._normalize(!0).toJson();
                    d = e.takeScreenshot(z);
                    d.isResolved()
                      ? d.then(function(a) {
                          "data:image/png;base64," ===
                            a.dataURL.substr(0, 22) &&
                            (n.imageData = a.dataURL.substr(22));
                        })
                      : console.error(
                          "PrintTask: VectorTileLayer.takeScreenshot() returned an unresolved Promise"
                        );
                    n.imageData && y.push(n);
                    break;
                  case "esri.layers.WebTiledLayer":
                    d = e.url.replace(/\$\{/g, "{");
                    n = q.mixin(n, {
                      type: "WebTiledLayer",
                      urlTemplate: d,
                      credits: e.copyright
                    });
                    e.subDomains &&
                      0 < e.subDomains.length &&
                      (n.subDomains = e.subDomains);
                    e._wmtsInfo && (n.wmtsInfo = e._wmtsInfo);
                    delete n.url;
                    y.push(n);
                    break;
                  default:
                    if (e.getTileUrl || e.getImageUrl)
                      (n = q.mixin(n, { url: e.url })), y.push(n);
                }
            h = u.map(b.graphicsLayerIds, b.getLayer, b);
            for (k = 0; k < h.length; k++)
              (e = h[k]),
                e.isFeatureReductionActive &&
                  e.isFeatureReductionActive() &&
                  (e.getSingleGraphics().length
                    ? h.splice(++k, 0, e.getFeatureReductionLayer())
                    : (h[k] = e.getFeatureReductionLayer()));
            for (k = 0; k < h.length; k++)
              if (
                ((e = h[k]),
                e.loaded && e.visible && (!l || e.isVisibleAtScale(l)))
              )
                switch (((d = e.declaredClass), d)) {
                  case "esri.layers.CSVLayer":
                    if (this._is11xService) {
                      n = {
                        id: e.id,
                        url: e.url,
                        title: e.title,
                        opacity: e.opacity,
                        minScale: e.minScale || 0,
                        maxScale: e.maxScale || 0,
                        type: "CSV",
                        locationInfo: {
                          latitudeFieldName: e.latitudeFieldName,
                          longitudeFieldName: e.longitudeFieldName
                        },
                        layerDefinition: {
                          drawingInfo: {
                            renderer:
                              e.renderer &&
                              e.renderer.toJson({
                                useLegacyRotationProperties: !0
                              })
                          }
                        }
                      };
                      y.push(n);
                      break;
                    }
                  case "esri.layers.FeatureLayer":
                  case "esri.layers.LabelLayer":
                  case "esri.layers.StreamLayer":
                    if (
                      ("esri.layers.LabelLayer" === d && !g.showLabels) ||
                      (e.renderer &&
                        "esri.renderer.HeatmapRenderer" ===
                          e.renderer.declaredClass)
                    )
                      continue;
                    d = null;
                    e.url &&
                      e.renderer &&
                      ("esri.renderer.ScaleDependentRenderer" ===
                      e.renderer.declaredClass
                        ? "scale" === e.renderer.rangeType
                          ? (d =
                              e.renderer.getRendererInfoByScale(b.getScale()) &&
                              e.renderer.getRendererInfoByScale(b.getScale())
                                .renderer)
                          : "zoom" === e.renderer.rangeType &&
                            (d =
                              e.renderer.getRendererInfoByZoom(b.getZoom()) &&
                              e.renderer.getRendererInfoByZoom(b.getZoom())
                                .renderer)
                        : (d = e.renderer));
                    z =
                      d &&
                      "esri.layers.CSVLayer" !== e.declaredClass &&
                      !this._isFeatureCollectionRequired(d, e) &&
                      !d.valueExpression;
                    E =
                      e.isFeatureReductionActive &&
                      e.isFeatureReductionActive();
                    if (
                      d &&
                      !E &&
                      "esri.renderer.DotDensityRenderer" !== d.declaredClass &&
                      "esri.layers.StreamLayer" !== e.declaredClass &&
                      (this._is11xService || z) &&
                      ("esri.renderer.SimpleRenderer" === d.declaredClass ||
                        "esri.renderer.TemporalRenderer" === d.declaredClass ||
                        null == d.attributeField ||
                        (q.isString(d.attributeField) &&
                          e._getField(d.attributeField, !0)))
                    )
                      if (
                        ((n = {
                          id: e.id,
                          title:
                            q.getObject("arcgisProps.title", !1, e) || e.id,
                          opacity: e.opacity,
                          minScale: e.minScale || 0,
                          maxScale: e.maxScale || 0,
                          layerDefinition: {
                            drawingInfo: {
                              renderer: d.toJson({
                                useLegacyRotationProperties: !0
                              })
                            }
                          }
                        }),
                        (n = q.mixin(n, this._getUrlAndToken(e))),
                        "esri.renderer.TemporalRenderer" === d.declaredClass &&
                          ((z = n.layerDefinition.drawingInfo),
                          (z.latestObservationRenderer =
                            z.renderer.latestObservationRenderer),
                          (z.trackLinesRenderer = z.renderer.trackRenderer),
                          (z.observationAger = z.renderer.observationAger),
                          (z.renderer = z.renderer.observationRenderer),
                          e._trackIdField &&
                            (n.layerDefinition.timeInfo = {
                              trackIdField: e._trackIdField
                            })),
                        this._convertSvgRenderer(
                          n.layerDefinition.drawingInfo.renderer
                        ),
                        this._is11xService ||
                          1 > e.opacity ||
                          "esri.renderer.TemporalRenderer" ===
                            d.declaredClass ||
                          this._updateLayerOpacity(n))
                      )
                        if (
                          (e._params.source &&
                            ((d = e._params.source.toJson()),
                            q.mixin(n.layerDefinition, { source: d })),
                          e.getDefinitionExpression() &&
                            q.mixin(n.layerDefinition, {
                              definitionExpression: e.getDefinitionExpression()
                            }),
                          2 !== e.mode)
                        )
                          0 < e.getSelectedFeatures().length &&
                            ((d = u.map(e.getSelectedFeatures(), function(a) {
                              return a.attributes[e.objectIdField];
                            })),
                            0 < d.length &&
                              e.getSelectionSymbol() &&
                              q.mixin(n, {
                                selectionObjectIds: d,
                                selectionSymbol: e.getSelectionSymbol().toJson()
                              }));
                        else {
                          d = u.map(e.getSelectedFeatures(), function(a) {
                            return a.attributes[e.objectIdField];
                          });
                          if (0 === d.length || !e._params.drawMode) break;
                          q.mixin(n.layerDefinition, { objectIds: d });
                          d = null;
                          e.getSelectionSymbol() &&
                            (d = new c(e.getSelectionSymbol()));
                          q.mixin(n.layerDefinition.drawingInfo, {
                            renderer: d && d.toJson()
                          });
                        }
                      else n = this._createFeatureCollection(e, b, null, g);
                    else
                      n =
                        d &&
                        (d.valueExpression ||
                          this._isFeatureCollectionRequired(d, e) ||
                          "esri.renderer.DotDensityRenderer" ===
                            d.declaredClass)
                          ? this._createFeatureCollection(e, b, d, g)
                          : this._createFeatureCollection(e, b, null, g);
                    if (!n) continue;
                    y.push(n);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({ id: e.id });
                    break;
                  case "esri.layers._GraphicsLayer":
                  case "esri.layers.GraphicsLayer":
                  case "esri.layers.WFSLayer":
                    n = this._createFeatureCollection(e, b, null, g);
                    if (!n) continue;
                    y.push(n);
                    this.allLayerslegend &&
                      this.allLayerslegend.push({ id: e.id });
                    break;
                  case "esri.layers.ArcGISImageServiceVectorLayer":
                    (n = {
                      id: e.id,
                      title: q.getObject("arcgisProps.title", !1, e) || e.id,
                      opacity: e.opacity,
                      minScale: e.minScale || 0,
                      maxScale: e.maxScale || 0,
                      visibility: e.visible,
                      symbolTileSize: e.symbolTileSize,
                      layerDefinition: {
                        drawingInfo: {
                          renderer: e.renderer.toJson({
                            useLegacyRotationProperties: !0
                          })
                        }
                      }
                    }),
                      (n = q.mixin(n, this._getUrlAndToken(e))),
                      e.mosaicRule &&
                        q.mixin(n, { mosaicRule: e.mosaicRule.toJson() }),
                      y.push(n),
                      this.allLayerslegend &&
                        this.allLayerslegend.push({ id: e.id });
                }
            l &&
              u.forEach(y, function(a) {
                a.minScale = 0;
                a.maxScale = 0;
              });
            b.graphics &&
              0 < b.graphics.graphics.length &&
              (n = this._createFeatureCollection(b.graphics, b, null, g)) &&
              y.push(n);
            b._labels &&
              g.showLabels &&
              (n = this._createFeatureCollection(b._labels, b, null, g)) &&
              y.push(n);
            u.forEach(y, function(a, c, b) {
              a._isRefLayer &&
                (delete a._isRefLayer, b.splice(c, 1), b.push(a));
            });
            return y;
          },
          _getUrlAndToken: function(a) {
            return { token: a._getToken(), url: a._url ? a._url.path : null };
          },
          _updateLayerOpacity: function(a) {
            var c = this._colorEvaluator(a),
              c = u.filter(c, function(a) {
                return q.isArray(a) && 4 === a.length;
              }),
              b = !0;
            if (c.length) {
              var g = c[0][3],
                e;
              for (e = 1; e < c.length; e++)
                if (g !== c[e][3]) {
                  b = !1;
                  break;
                }
              if (b)
                for (a.opacity = g / 255, e = 0; e < c.length; e++)
                  c[e][3] = 255;
            }
            return b;
          },
          _isFeatureCollectionRequired: function(a, c) {
            if (c && c.isFeatureReductionActive && c.isFeatureReductionActive())
              return !0;
            var b = !1;
            if ((c = this._getVariable(a, "rotationInfo", !1)))
              b = ((b = c.field) && q.isFunction(b)) || c.valueExpression;
            return (
              a.hasVisualVariables("sizeInfo") ||
              a.hasVisualVariables("colorInfo") ||
              a.hasVisualVariables("opacityInfo") ||
              b
            );
          },
          _getVariable: function(a, c, b) {
            var g;
            a && (g = (a = a.getVisualVariablesForType(c, b)) && a[0]);
            return g;
          },
          _applyVisualVariables: function(a, c) {
            var b = c.renderer,
              g = c.graphic,
              e = c.symbol,
              d = c.mapResolution,
              y = c.mapScale,
              n = e.type;
            if ("textsymbol" !== n && "shieldlabelsymbol" !== n) {
              var f = this._getVariable(b, "sizeInfo", !1),
                I = this._getVariable(b, "colorInfo", !1),
                z = this._getVariable(b, "opacityInfo", !1);
              c = this._getVariable(b, "rotationInfo", !1);
              e instanceof k &&
                (f = this._getVariable(b, "sizeInfo", "outline") || f);
              d = f
                ? b.getSize(g, {
                    sizeInfo: f,
                    shape: "simplemarkersymbol" === n ? e.style : null,
                    resolution: d,
                    scale: y
                  })
                : g.size;
              null != d &&
                ("simplemarkersymbol" === n
                  ? (a.size = B.px2pt(d))
                  : "picturemarkersymbol" === n
                  ? ((y = (e.width / e.height) * d),
                    (a.width = B.px2pt(y)),
                    (a.height = B.px2pt(d)),
                    0 !== e.xoffset &&
                      (a.xoffset = B.px2pt((e.xoffset / e.width) * y)),
                    0 !== e.yoffset &&
                      (a.yoffset = B.px2pt((e.yoffset / e.height) * d)))
                  : "simplelinesymbol" === n
                  ? (a.width = B.px2pt(d))
                  : a.outline && (a.outline.width = B.px2pt(d)));
              I &&
                (!(e = b.getColor(g, { colorInfo: I })) ||
                  ("simplemarkersymbol" !== n &&
                    "simplelinesymbol" !== n &&
                    "simplefillsymbol" !== n) ||
                  (a.color = x.toJsonColor(e)));
              z &&
                ((e = b.getOpacity(g, { opacityInfo: z })),
                null != e && a.color && (a.color[3] = Math.round(255 * e)));
              c &&
                (b = b.getRotationAngle(g, { rotationInfo: c })) &&
                (a.angle = -b);
            }
          }
        });
        h("extend-esri") && q.setObject("tasks.PrintTask", r, f);
        return r;
      });
    },
    "esri/tasks/Geoprocessor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has dojo/io-query ../kernel ../request ../deferredUtils ../geometry/normalizeUtils ./Task ./FeatureSet ./JobInfo ./GPMessage ./LinearUnit ./DataFile ./RasterData ./Date ./ParameterValue ./GPResultImageLayer ../layers/ArcGISDynamicMapServiceLayer ../layers/MapImage".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F
      ) {
        r = r(b, {
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
            this._jobUpdateHandler = q.hitch(this, this._jobUpdateHandler);
            this._getJobStatus = q.hitch(this, this._getJobStatus);
            this._getResultDataHandler = q.hitch(
              this,
              this._getResultDataHandler
            );
            this._getResultImageHandler = q.hitch(
              this,
              this._getResultImageHandler
            );
            this._executeHandler = q.hitch(this, this._executeHandler);
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
          _gpEncode: function(a, c, b) {
            for (var g in a) {
              var e = a[g];
              q.isArray(e)
                ? (a[g] = m.toJson(
                    u.map(
                      e,
                      function(a) {
                        return this._gpEncode({ item: a }, !0).item;
                      },
                      this
                    )
                  ))
                : e instanceof Date && (a[g] = e.getTime());
            }
            return this._encode(a, c, b);
          },
          _decode: function(c) {
            var b = c.dataType,
              d = new D(c);
            if (
              -1 !==
              u.indexOf(["GPBoolean", "GPDouble", "GPLong", "GPString"], b)
            )
              return d;
            if ("GPLinearUnit" === b) d.value = new k(d.value);
            else if ("GPFeatureRecordSetLayer" === b || "GPRecordSet" === b)
              d.value = new a(d.value);
            else if ("GPDataFile" === b) d.value = new g(d.value);
            else if ("GPDate" === b)
              (c = d.value),
                q.isString(c)
                  ? (d.value = new E({ date: c }))
                  : (d.value = new Date(c));
            else if ("GPRasterData" === b || "GPRasterDataLayer" === b)
              (c = c.value.mapImage), (d.value = c ? new F(c) : new e(d.value));
            else if (-1 !== b.indexOf("GPMultiValue:")) {
              var n = b.split(":")[1];
              c = d.value;
              d.value = u.map(
                c,
                function(a) {
                  return this._decode({
                    paramName: "_name",
                    dataType: n,
                    value: a
                  }).value;
                },
                this
              );
            } else
              console.log(
                this.declaredClass +
                  " : GP Data type not handled. : " +
                  d.dataType
              ),
                (d = null);
            return d;
          },
          submitJob: function(a, c, b, g, e) {
            var k = this._getOutSR(),
              d = e.assembly;
            a = this._gpEncode(
              q.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  "env:outSR": k ? k.wkid || m.toJson(k.toJson()) : null,
                  "env:processSR": this.processSpatialReference
                    ? this.processSpatialReference.wkid ||
                      m.toJson(this.processSpatialReference.toJson())
                    : null
                },
                a
              ),
              null,
              d && d[0]
            );
            var y = this._jobUpdateHandler,
              n = this._errorHandler;
            return t({
              url: this._url.path + "/submitJob",
              content: a,
              callbackParamName: "callback",
              load: function(a, g) {
                y(a, g, !1, c, b, e.dfd);
              },
              error: function(a) {
                n(a, g, e.dfd);
              }
            });
          },
          _jobUpdateHandler: function(a, c, b, g, e, k) {
            var d = a.jobId;
            c = new n(a);
            this._successHandler([c], "onStatusUpdate", e, b && k);
            if (!b)
              switch (
                (clearTimeout(this._updateTimers[d]),
                (this._updateTimers[d] = null),
                k && k.progress(c),
                a.jobStatus)
              ) {
                case n.STATUS_SUBMITTED:
                case n.STATUS_EXECUTING:
                case n.STATUS_WAITING:
                case n.STATUS_NEW:
                  var y = this._getJobStatus;
                  this._updateTimers[d] = setTimeout(function() {
                    y(d, b, g, e, k);
                  }, this.updateDelay);
                  break;
                default:
                  this._successHandler([c], "onJobComplete", g, k);
              }
          },
          _getJobStatus: function(a, c, b, g, e) {
            var k = this._jobUpdateHandler;
            t({
              url: this._url.path + "/jobs/" + a,
              content: q.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: function(a, d) {
                k(a, d, c, b, g, e);
              },
              error: this._errorHandler
            });
          },
          _getResultDataHandler: function(a, c, b, g, e) {
            try {
              var k = this._decode(a);
              this._successHandler([k], "onGetResultDataComplete", b, e);
            } catch (H) {
              this._errorHandler(H, g, e);
            }
          },
          getResultData: function(a, c, b, g) {
            var e = this._getResultDataHandler,
              k = this._errorHandler,
              d = new v(l._dfdCanceller);
            d._pendingDfd = t({
              url: this._url.path + "/jobs/" + a + "/results/" + c,
              content: q.mixin({}, this._url.query, {
                f: "json",
                returnType: "data"
              }),
              callbackParamName: "callback",
              load: function(a, c) {
                e(a, c, b, g, d);
              },
              error: function(a) {
                k(a, g, d);
              }
            });
            return d;
          },
          checkJobStatus: function(a, c, b) {
            var g = this._jobUpdateHandler,
              e = this._errorHandler,
              k = new v(l._dfdCanceller);
            k._pendingDfd = t({
              url: this._url.path + "/jobs/" + a,
              content: q.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: function(a, b) {
                g(a, b, !0, null, c, k);
              },
              error: function(a) {
                e(a, b, k);
              }
            });
            return k;
          },
          cancelJob: function(a, c, b) {
            var g = this._errorHandler,
              e = new v(l._dfdCanceller);
            e._pendingDfd = t({
              url: this._url.path + "/jobs/" + a + "/cancel",
              content: q.mixin({}, this._url.query, { f: "json" }),
              callbackParamName: "callback",
              load: q.hitch(this, function(a, b) {
                this._successHandler([a], "onJobCancel", c, e);
              }),
              error: function(a) {
                g(a, b, e);
              }
            });
            return e;
          },
          execute: function(a, c, b, g) {
            var e = this._getOutSR(),
              k = g.assembly;
            a = this._gpEncode(
              q.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  "env:outSR": e ? e.wkid || m.toJson(e.toJson()) : null,
                  "env:processSR": this.processSpatialReference
                    ? this.processSpatialReference.wkid ||
                      m.toJson(this.processSpatialReference.toJson())
                    : null
                },
                a
              ),
              null,
              k && k[0]
            );
            var d = this._executeHandler,
              n = this._errorHandler;
            return t({
              url: this._url.path + "/execute",
              content: a,
              callbackParamName: "callback",
              load: function(a, e) {
                d(a, e, c, b, g.dfd);
              },
              error: function(a) {
                n(a, b, g.dfd);
              }
            });
          },
          _executeHandler: function(a, b, g, e, k) {
            try {
              var d = a.results,
                n,
                y,
                f = a.messages;
              n = 0;
              for (y = d.length; n < y; n++) d[n] = this._decode(d[n]);
              n = 0;
              for (y = f.length; n < y; n++) f[n] = new c(f[n]);
              this._successHandler([d, f], "onExecuteComplete", g, k);
            } catch (Z) {
              this._errorHandler(Z, e, k);
            }
          },
          _getResultImageHandler: function(a, c, b, g, e) {
            try {
              var k = this._decode(a);
              this._successHandler([k], "onGetResultImageComplete", b, e);
            } catch (H) {
              this._errorHandler(H, g, e);
            }
          },
          getResultImage: function(a, c, b, g, e) {
            var k = this._getResultImageHandler,
              d = this._errorHandler;
            b = this._gpEncode(
              q.mixin({}, this._url.query, { f: "json" }, b.toJson())
            );
            var n = new v(l._dfdCanceller);
            n._pendingDfd = t({
              url: this._url.path + "/jobs/" + a + "/results/" + c,
              content: b,
              callbackParamName: "callback",
              load: function(a, c) {
                k(a, c, g, e, n);
              },
              error: function(a) {
                d(a, e, n);
              }
            });
            return n;
          },
          cancelJobStatusUpdates: function(a) {
            clearTimeout(this._updateTimers[a]);
            this._updateTimers[a] = null;
          },
          getResultImageLayer: function(a, c, b, g) {
            if (null == c) {
              var e = this._url.path.indexOf("/GPServer/");
              a = this._url.path.substring(0, e) + "/MapServer/jobs/" + a;
            } else a = this._url.path + "/jobs/" + a + "/results/" + c;
            this._url.query && (a += "?" + f.objectToQuery(this._url.query));
            c =
              null == c
                ? new B(a, { imageParameters: b })
                : new w(a, { imageParameters: b }, !0);
            this.onGetResultImageLayerComplete(c);
            g && g(c);
            return c;
          },
          onStatusUpdate: function() {},
          onJobComplete: function() {},
          onExecuteComplete: function() {},
          onGetResultDataComplete: function() {},
          onGetResultImageComplete: function() {},
          onGetResultImageLayerComplete: function() {},
          onJobCancel: function() {}
        });
        x._createWrappers(r);
        h("extend-esri") && q.setObject("tasks.Geoprocessor", r, d);
        return r;
      });
    },
    "esri/tasks/JobInfo": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "./GPMessage"
      ], function(r, q, u, v, m) {
        r = r(null, {
          declaredClass: "esri.tasks.JobInfo",
          constructor: function(h) {
            this.messages = [];
            q.mixin(this, h);
            h = this.messages;
            var f,
              d = h.length;
            for (f = 0; f < d; f++) h[f] = new m(h[f]);
          },
          jobId: "",
          jobStatus: ""
        });
        q.mixin(r, {
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
        u("extend-esri") && q.setObject("tasks.JobInfo", r, v);
        return r;
      });
    },
    "esri/tasks/GPMessage": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.GPMessage",
          constructor: function(m) {
            q.mixin(this, m);
          }
        });
        q.mixin(r, {
          TYPE_INFORMATIVE: "esriJobMessageTypeInformative",
          TYPE_PROCESS_DEFINITION: "esriJobMessageTypeProcessDefinition",
          TYPE_PROCESS_START: "esriJobMessageTypeProcessStart",
          TYPE_PROCESS_STOP: "esriJobMessageTypeProcessStop",
          TYPE_WARNING: "esriJobMessageTypeWarning",
          TYPE_ERROR: "esriJobMessageTypeError",
          TYPE_EMPTY: "esriJobMessageTypeEmpty",
          TYPE_ABORT: "esriJobMessageTypeAbort"
        });
        u("extend-esri") && q.setObject("tasks.GPMessage", r, v);
        return r;
      });
    },
    "esri/tasks/LinearUnit": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.LinearUnit",
          constructor: function(m) {
            m && q.mixin(this, m);
          },
          distance: 0,
          units: null,
          toJson: function() {
            var m = {};
            this.distance && (m.distance = this.distance);
            this.units && (m.units = this.units);
            return m;
          }
        });
        u("extend-esri") && q.setObject("tasks.LinearUnit", r, v);
        return r;
      });
    },
    "esri/tasks/DataFile": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.DataFile",
          constructor: function(m) {
            m && q.mixin(this, m);
          },
          url: null,
          itemID: null,
          toJson: function() {
            var m = {};
            this.url && (m.url = this.url);
            this.itemID && (m.itemID = this.itemID);
            return m;
          }
        });
        u("extend-esri") && q.setObject("tasks.DataFile", r, v);
        return r;
      });
    },
    "esri/tasks/RasterData": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.RasterData",
          constructor: function(m) {
            m && q.mixin(this, m);
          },
          url: null,
          format: null,
          itemID: null,
          toJson: function() {
            var m = {};
            this.url && (m.url = this.url);
            this.format && (m.format = this.format);
            this.itemID && (m.itemID = this.itemID);
            return m;
          }
        });
        u("extend-esri") && q.setObject("tasks.RasterData", r, v);
        return r;
      });
    },
    "esri/tasks/Date": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/date/locale",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v, m) {
        r = r(null, {
          declaredClass: "esri.tasks.Date",
          constructor: function(h) {
            h &&
              (h.format && (this.format = h.format),
              (this.date = u.parse(h.date, {
                selector: "date",
                datePattern: this.format
              })));
          },
          date: new Date(),
          format: "EEE MMM dd HH:mm:ss zzz yyyy",
          toJson: function() {
            return {
              date: u.format(this.date, {
                selector: "date",
                datePattern: this.format
              }),
              format: this.format
            };
          }
        });
        v("extend-esri") && q.setObject("tasks.Date", r, m);
        return r;
      });
    },
    "esri/tasks/ParameterValue": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.ParameterValue",
          constructor: function(m) {
            q.mixin(this, m);
          }
        });
        u("extend-esri") && q.setObject("tasks.ParameterValue", r, v);
        return r;
      });
    },
    "esri/tasks/GPResultImageLayer": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has dojo/io-query ../kernel ../layers/ArcGISDynamicMapServiceLayer".split(
        " "
      ), function(r, q, u, v, m, h, f) {
        r = r(f, {
          declaredClass: "esri.tasks._GPResultImageLayer",
          constructor: function(d, f) {
            f &&
              f.imageParameters &&
              f.imageParameters.extent &&
              ((this.initialExtent = this.fullExtent =
                f.imageParameters.extent),
              (this.spatialReference = this.initialExtent.spatialReference));
            this.getImageUrl = q.hitch(this, this.getImageUrl);
            this.loaded = !0;
            this.onLoad(this);
          },
          getImageUrl: function(d, f, l, h) {
            var b = d.spatialReference.wkid;
            h(
              this._url.path +
                "?" +
                m.objectToQuery(
                  q.mixin(this._params, {
                    f: "image",
                    bbox: u.toJson(d.toJson()),
                    bboxSR: b,
                    imageSR: b,
                    size: f + "," + l
                  })
                )
            );
          }
        });
        v("extend-esri") && q.setObject("tasks._GPResultImageLayer", r, h);
        return r;
      });
    },
    "dojox/gfx/canvas": function() {
      define("./_base dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/_base/window dojo/dom-geometry dojo/dom ./shape ./path ./arc ./matrix ./decompose ./bezierutils".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a) {
        function n(a, c, b, g, e, k, d, n, y, f) {
          var z,
            I,
            l = c.length,
            t = 0;
          f ? ((I = f.l / e), (t = f.i)) : (I = c[0] / e);
          for (; k < d; )
            k + I > d && ((z = { l: (k + I - d) * e, i: t }), (I = d - k)),
              t % 2 ||
                (a.beginPath(), a.arc(b, g, e, k, k + I, n), y && a.stroke()),
              (k += I),
              ++t,
              (I = c[t % l] / e);
          return z;
        }
        function c(c, b, g, e) {
          var k = 0,
            d = 0,
            n,
            y = 0;
          e ? ((n = e.l), (y = e.i)) : (n = b[0]);
          for (; 1 > d; )
            (d = a.tAtLength(c, n)),
              1 == d && ((k = a.computeLength(c)), (k = { l: n - k, i: y })),
              (c = a.splitBezierAtT(c, d)),
              y % 2 || g.push(c[0]),
              (c = c[1]),
              ++y,
              (n = b[y % b.length]);
          return k;
        }
        function k(a, b, e, g) {
          var k = [b.last.x, b.last.y].concat(e),
            d = !(a instanceof Array);
          e = 4 === e.length ? "quadraticCurveTo" : "bezierCurveTo";
          var n = [];
          b = c(k, b.canvasDash, n, g);
          for (g = 0; g < n.length; ++g)
            (k = n[g]),
              d
                ? (a.moveTo(k[0], k[1]), a[e].apply(a, k.slice(2)))
                : (a.push("moveTo", [k[0], k[1]]), a.push(e, k.slice(2)));
          return b;
        }
        function g(c, b, e, g, k, d, n) {
          var y = 0,
            z = 0,
            f = 0,
            t = a.distance(e, g, k, d),
            l = 0;
          b = b.canvasDash;
          var I = e,
            h = g,
            K,
            w = !(c instanceof Array);
          n ? ((f = n.l), (l = n.i)) : (f += b[0]);
          for (; 0.01 < Math.abs(1 - z); )
            f > t && ((y = { l: f - t, i: l }), (f = t)),
              (z = f / t),
              (n = e + (k - e) * z),
              (K = g + (d - g) * z),
              l++ % 2 ||
                (w
                  ? (c.moveTo(I, h), c.lineTo(n, K))
                  : (c.push("moveTo", [I, h]), c.push("lineTo", [n, K]))),
              (I = n),
              (h = K),
              (f += b[l % b.length]);
          return y;
        }
        var e = (r.canvas = {}),
          E = null,
          D = x.multiplyPoint,
          w = Math.PI,
          B = 2 * w,
          F = w / 2;
        b = q.extend;
        if (m.global.CanvasRenderingContext2D) {
          m = m.doc.createElement("canvas").getContext("2d");
          var G = "function" == typeof m.setLineDash,
            C = "function" == typeof m.fillText;
        }
        var A = {
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
        e.Shape = v("dojox.gfx.canvas.Shape", d.Shape, {
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
              var c = this.canvasTransform;
              a.translate(c.dx, c.dy);
              a.rotate(c.angle2);
              a.scale(c.sx, c.sy);
              a.rotate(c.angle1);
            }
          },
          _renderShape: function(a) {},
          _renderFill: function(a, c) {
            if ("canvasFill" in this) {
              var b = this.fillStyle;
              if ("canvasFillImage" in this) {
                var e = b.width,
                  g = b.height,
                  k = this.canvasFillImage.width,
                  d = this.canvasFillImage.height,
                  n = Math.min(e == k ? 1 : e / k, g == d ? 1 : g / d),
                  y = (e - n * k) / 2,
                  f = (g - n * d) / 2;
                E.width = e;
                E.height = g;
                var z = E.getContext("2d");
                z.clearRect(0, 0, e, g);
                z.drawImage(
                  this.canvasFillImage,
                  0,
                  0,
                  k,
                  d,
                  y,
                  f,
                  n * k,
                  n * d
                );
                this.canvasFill = a.createPattern(E, "repeat");
                delete this.canvasFillImage;
              }
              a.fillStyle = this.canvasFill;
              c &&
                ("pattern" !== b.type ||
                  (0 === b.x && 0 === b.y) ||
                  a.translate(b.x, b.y),
                a.fill());
            } else a.fillStyle = "rgba(0,0,0,0.0)";
          },
          _renderStroke: function(a, c) {
            var b = this.strokeStyle;
            b
              ? ((a.strokeStyle = b.color.toString()),
                (a.lineWidth = b.width),
                (a.lineCap = b.cap),
                "number" == typeof b.join
                  ? ((a.lineJoin = "miter"), (a.miterLimit = b.join))
                  : (a.lineJoin = b.join),
                this.canvasDash
                  ? G
                    ? (a.setLineDash(this.canvasDash), c && a.stroke())
                    : this._renderDashedStroke(a, c)
                  : c && a.stroke())
              : c || (a.strokeStyle = "rgba(0,0,0,0.0)");
          },
          _renderDashedStroke: function(a, c) {},
          getEventSource: function() {
            return null;
          },
          on: function() {},
          connect: function() {},
          disconnect: function() {},
          canvasClip: null,
          setClip: function(a) {
            this.inherited(arguments);
            var c = a
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
            if (a && !c) return this;
            this.canvasClip = a ? R(c, a) : null;
            this.parent && this.parent._makeDirty();
            return this;
          }
        });
        var R = function(a, c) {
            switch (a) {
              case "ellipse":
                return {
                  canvasEllipse: y({ shape: c }),
                  render: function(a) {
                    return e.Ellipse.prototype._renderShape.call(this, a);
                  }
                };
              case "rect":
                return {
                  shape: q.delegate(c, { r: 0 }),
                  render: function(a) {
                    return e.Rect.prototype._renderShape.call(this, a);
                  }
                };
              case "path":
                return {
                  canvasPath: J(c),
                  render: function(a) {
                    this.canvasPath._renderShape(a);
                  }
                };
              case "polyline":
                return {
                  canvasPolyline: c.points,
                  render: function(a) {
                    return e.Polyline.prototype._renderShape.call(this, a);
                  }
                };
            }
            return null;
          },
          J = function(a) {
            var c = new dojox.gfx.canvas.Path();
            c.canvasPath = [];
            c._setPath(a.d);
            return c;
          },
          O = function(a, c, b) {
            var e = a.prototype[c];
            a.prototype[c] = b
              ? function() {
                  this.parent && this.parent._makeDirty();
                  e.apply(this, arguments);
                  b.call(this);
                  return this;
                }
              : function() {
                  this.parent && this.parent._makeDirty();
                  return e.apply(this, arguments);
                };
          };
        O(e.Shape, "setTransform", function() {
          this.matrix
            ? (this.canvasTransform = r.decompose(this.matrix))
            : delete this.canvasTransform;
        });
        O(e.Shape, "setFill", function() {
          var a = this.fillStyle,
            c;
          if (a) {
            if ("object" == typeof a && "type" in a) {
              var b = this.surface.rawNode.getContext("2d");
              switch (a.type) {
                case "linear":
                case "radial":
                  c =
                    "linear" == a.type
                      ? b.createLinearGradient(a.x1, a.y1, a.x2, a.y2)
                      : b.createRadialGradient(a.cx, a.cy, 0, a.cx, a.cy, a.r);
                  u.forEach(a.colors, function(a) {
                    c.addColorStop(
                      a.offset,
                      r.normalizeColor(a.color).toString()
                    );
                  });
                  break;
                case "pattern":
                  E || (E = document.createElement("canvas")),
                    (b = new Image()),
                    this.surface.downloadImage(b, a.src),
                    (this.canvasFillImage = b);
              }
            } else c = a.toString();
            this.canvasFill = c;
          } else delete this.canvasFill;
        });
        O(e.Shape, "setStroke", function() {
          var a = this.strokeStyle;
          if (a) {
            var c = this.strokeStyle.style.toLowerCase();
            c in A && (c = A[c]);
            if (c instanceof Array) {
              this.canvasDash = c = c.slice();
              var b;
              for (b = 0; b < c.length; ++b) c[b] *= a.width;
              if ("butt" != a.cap) {
                for (b = 0; b < c.length; b += 2)
                  (c[b] -= a.width), 1 > c[b] && (c[b] = 1);
                for (b = 1; b < c.length; b += 2) c[b] += a.width;
              }
            } else delete this.canvasDash;
          } else delete this.canvasDash;
          this._needsDash = !G && !!this.canvasDash;
        });
        O(e.Shape, "setShape");
        e.Group = v("dojox.gfx.canvas.Group", e.Shape, {
          constructor: function() {
            d.Container._init.call(this);
          },
          _render: function(a) {
            a.save();
            this._renderTransform(a);
            this._renderClip(a);
            for (var c = 0; c < this.children.length; ++c)
              this.children[c]._render(a);
            a.restore();
          },
          destroy: function() {
            d.Container.clear.call(this, !0);
            e.Shape.prototype.destroy.apply(this, arguments);
          }
        });
        e.Rect = v("dojox.gfx.canvas.Rect", [e.Shape, d.Rect], {
          _renderShape: function(a) {
            var c = this.shape,
              b = Math.min(c.r, c.height / 2, c.width / 2),
              e = c.x,
              g = e + c.width,
              k = c.y,
              c = k + c.height,
              d = e + b,
              n = g - b,
              y = k + b,
              f = c - b;
            a.beginPath();
            a.moveTo(d, k);
            b
              ? (a.arc(n, y, b, -F, 0, !1),
                a.arc(n, f, b, 0, F, !1),
                a.arc(d, f, b, F, w, !1),
                a.arc(d, y, b, w, w + F, !1))
              : (a.lineTo(n, k),
                a.lineTo(g, f),
                a.lineTo(d, c),
                a.lineTo(e, y));
            a.closePath();
          },
          _renderDashedStroke: function(a, c) {
            var b = this.shape,
              e = Math.min(b.r, b.height / 2, b.width / 2),
              k = b.x,
              d = k + b.width,
              y = b.y,
              f = y + b.height,
              z = k + e,
              t = d - e,
              l = y + e,
              h = f - e;
            e
              ? (a.beginPath(),
                (b = g(a, this, z, y, t, y)),
                c && a.stroke(),
                (b = n(a, this.canvasDash, t, l, e, -F, 0, !1, c, b)),
                a.beginPath(),
                (b = g(a, this, d, l, d, h, b)),
                c && a.stroke(),
                (b = n(a, this.canvasDash, t, h, e, 0, F, !1, c, b)),
                a.beginPath(),
                (b = g(a, this, t, f, z, f, b)),
                c && a.stroke(),
                (b = n(a, this.canvasDash, z, h, e, F, w, !1, c, b)),
                a.beginPath(),
                (b = g(a, this, k, h, k, l, b)),
                c && a.stroke(),
                n(a, this.canvasDash, z, l, e, w, w + F, !1, c, b))
              : (a.beginPath(),
                (b = g(a, this, z, y, t, y)),
                (b = g(a, this, t, y, d, h, b)),
                (b = g(a, this, d, h, z, f, b)),
                g(a, this, z, f, k, l, b),
                c && a.stroke());
          }
        });
        var H = [];
        (function() {
          var a = l.curvePI4;
          H.push(a.s, a.c1, a.c2, a.e);
          for (var c = 45; 360 > c; c += 45) {
            var b = x.rotateg(c);
            H.push(D(b, a.c1), D(b, a.c2), D(b, a.e));
          }
        })();
        var y = function(a) {
          var b,
            e,
            g,
            k = [],
            d = a.shape,
            n = x.normalize([x.translate(d.cx, d.cy), x.scale(d.rx, d.ry)]);
          b = D(n, H[0]);
          k.push([b.x, b.y]);
          for (d = 1; d < H.length; d += 3)
            (e = D(n, H[d])),
              (g = D(n, H[d + 1])),
              (b = D(n, H[d + 2])),
              k.push([e.x, e.y, g.x, g.y, b.x, b.y]);
          if (a._needsDash) {
            b = [];
            e = k[0];
            for (d = 1; d < k.length; ++d)
              (g = []),
                c(e.concat(k[d]), a.canvasDash, g),
                (e = [k[d][4], k[d][5]]),
                b.push(g);
            a._dashedPoints = b;
          }
          return k;
        };
        e.Ellipse = v("dojox.gfx.canvas.Ellipse", [e.Shape, d.Ellipse], {
          setShape: function() {
            this.inherited(arguments);
            this.canvasEllipse = y(this);
            return this;
          },
          setStroke: function() {
            this.inherited(arguments);
            G || (this.canvasEllipse = y(this));
            return this;
          },
          _renderShape: function(a) {
            var c = this.canvasEllipse,
              b;
            a.beginPath();
            a.moveTo.apply(a, c[0]);
            for (b = 1; b < c.length; ++b) a.bezierCurveTo.apply(a, c[b]);
            a.closePath();
          },
          _renderDashedStroke: function(a, c) {
            var b = this._dashedPoints;
            a.beginPath();
            for (var e = 0; e < b.length; ++e)
              for (var g = b[e], k = 0; k < g.length; ++k) {
                var d = g[k];
                a.moveTo(d[0], d[1]);
                a.bezierCurveTo(d[2], d[3], d[4], d[5], d[6], d[7]);
              }
            c && a.stroke();
          }
        });
        e.Circle = v("dojox.gfx.canvas.Circle", [e.Shape, d.Circle], {
          _renderShape: function(a) {
            var c = this.shape;
            a.beginPath();
            a.arc(c.cx, c.cy, c.r, 0, B, 1);
          },
          _renderDashedStroke: function(a, c) {
            var b = this.shape,
              e = 0,
              g,
              k = this.canvasDash.length;
            for (i = 0; e < B; )
              (g = this.canvasDash[i % k] / b.r),
                i % 2 ||
                  (a.beginPath(),
                  a.arc(b.cx, b.cy, b.r, e, e + g, 0),
                  c && a.stroke()),
                (e += g),
                ++i;
          }
        });
        e.Line = v("dojox.gfx.canvas.Line", [e.Shape, d.Line], {
          _renderShape: function(a) {
            var c = this.shape;
            a.beginPath();
            a.moveTo(c.x1, c.y1);
            a.lineTo(c.x2, c.y2);
          },
          _renderDashedStroke: function(a, c) {
            var b = this.shape;
            a.beginPath();
            g(a, this, b.x1, b.y1, b.x2, b.y2);
            c && a.stroke();
          }
        });
        e.Polyline = v("dojox.gfx.canvas.Polyline", [e.Shape, d.Polyline], {
          setShape: function() {
            this.inherited(arguments);
            var a = this.shape.points,
              c = a[0],
              b,
              e;
            this.bbox = null;
            this._normalizePoints();
            if (a.length)
              if ("number" == typeof c) c = a;
              else
                for (c = [], e = 0; e < a.length; ++e)
                  (b = a[e]), c.push(b.x, b.y);
            else c = [];
            this.canvasPolyline = c;
            return this;
          },
          _renderShape: function(a) {
            var c = this.canvasPolyline;
            if (c.length) {
              a.beginPath();
              a.moveTo(c[0], c[1]);
              for (var b = 2; b < c.length; b += 2) a.lineTo(c[b], c[b + 1]);
            }
          },
          _renderDashedStroke: function(a, c) {
            var b = this.canvasPolyline,
              e = 0;
            a.beginPath();
            for (var k = 0; k < b.length; k += 2)
              e = g(a, this, b[k], b[k + 1], b[k + 2], b[k + 3], e);
            c && a.stroke();
          }
        });
        e.Image = v("dojox.gfx.canvas.Image", [e.Shape, d.Image], {
          setShape: function() {
            this.inherited(arguments);
            var a = new Image();
            this.surface.downloadImage(a, this.shape.src);
            this.canvasImage = a;
            return this;
          },
          _renderShape: function(a) {
            var c = this.shape;
            a.drawImage(this.canvasImage, c.x, c.y, c.width, c.height);
          }
        });
        e.Text = v("dojox.gfx.canvas.Text", [e.Shape, d.Text], {
          _setFont: function() {
            this.fontStyle
              ? (this.canvasFont = r.makeFontString(this.fontStyle))
              : delete this.canvasFont;
          },
          getTextWidth: function() {
            var a = this.shape,
              c = 0,
              b;
            a.text &&
              ((b = this.surface.rawNode.getContext("2d")),
              b.save(),
              this._renderTransform(b),
              this._renderFill(b, !1),
              this._renderStroke(b, !1),
              this.canvasFont && (b.font = this.canvasFont),
              (c = b.measureText(a.text).width),
              b.restore());
            return c;
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
            var c = this.shape;
            c.text &&
              ((a.textAlign = "middle" === c.align ? "center" : c.align),
              this.canvasFont && (a.font = this.canvasFont),
              this.canvasFill && a.fillText(c.text, c.x, c.y),
              this.strokeStyle &&
                (a.beginPath(), a.strokeText(c.text, c.x, c.y), a.closePath()));
          }
        });
        O(e.Text, "setFont");
        C ||
          e.Text.extend({
            getTextWidth: function() {
              return 0;
            },
            getBoundingBox: function() {
              return null;
            },
            _renderShape: function() {}
          });
        var T = {
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
        e.Path = v("dojox.gfx.canvas.Path", [e.Shape, t.Path], {
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
            G || ((this.segmented = !1), this._confirmSegmented());
            return this;
          },
          _setPath: function() {
            this._dashResidue = null;
            this.inherited(arguments);
          },
          _updateWithSegment: function(a) {
            var c = q.clone(this.last);
            this[T[a.action]](
              this.canvasPath,
              a.action,
              a.args,
              this._needsDash ? this._dashedPath : null
            );
            this.last = c;
            this.inherited(arguments);
          },
          _renderShape: function(a) {
            var c = this.canvasPath;
            a.beginPath();
            for (var b = 0; b < c.length; b += 2) a[c[b]].apply(a, c[b + 1]);
          },
          _renderDashedStroke: G
            ? function() {}
            : function(a, c) {
                var b = this._dashedPath;
                a.beginPath();
                for (var e = 0; e < b.length; e += 2)
                  a[b[e]].apply(a, b[e + 1]);
                c && a.stroke();
              },
          _moveToA: function(a, c, b, e) {
            a.push("moveTo", [b[0], b[1]]);
            e && e.push("moveTo", [b[0], b[1]]);
            for (c = 2; c < b.length; c += 2)
              a.push("lineTo", [b[c], b[c + 1]]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    b[c - 2],
                    b[c - 1],
                    b[c],
                    b[c + 1],
                    this._dashResidue
                  ));
            this.last.x = b[b.length - 2];
            this.last.y = b[b.length - 1];
            this.lastControl = {};
          },
          _moveToR: function(a, c, b, e) {
            c =
              "x" in this.last
                ? [(this.last.x += b[0]), (this.last.y += b[1])]
                : [(this.last.x = b[0]), (this.last.y = b[1])];
            a.push("moveTo", c);
            e && e.push("moveTo", c);
            for (c = 2; c < b.length; c += 2)
              a.push("lineTo", [
                (this.last.x += b[c]),
                (this.last.y += b[c + 1])
              ]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    e[e.length - 1][0],
                    e[e.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _lineToA: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 2)
              e &&
                (this._dashResidue = g(
                  e,
                  this,
                  this.last.x,
                  this.last.y,
                  b[c],
                  b[c + 1],
                  this._dashResidue
                )),
                a.push("lineTo", [b[c], b[c + 1]]);
            this.last.x = b[b.length - 2];
            this.last.y = b[b.length - 1];
            this.lastControl = {};
          },
          _lineToR: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 2)
              a.push("lineTo", [
                (this.last.x += b[c]),
                (this.last.y += b[c + 1])
              ]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    e[e.length - 1][0],
                    e[e.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _hLineToA: function(a, c, b, e) {
            for (c = 0; c < b.length; ++c)
              a.push("lineTo", [b[c], this.last.y]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    e[e.length - 1][0],
                    e[e.length - 1][1],
                    b[c],
                    this.last.y,
                    this._dashResidue
                  ));
            this.last.x = b[b.length - 1];
            this.lastControl = {};
          },
          _hLineToR: function(a, c, b, e) {
            for (c = 0; c < b.length; ++c)
              a.push("lineTo", [(this.last.x += b[c]), this.last.y]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    e[e.length - 1][0],
                    e[e.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _vLineToA: function(a, c, b, e) {
            for (c = 0; c < b.length; ++c)
              a.push("lineTo", [this.last.x, b[c]]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    e[e.length - 1][0],
                    e[e.length - 1][1],
                    this.last.x,
                    b[c],
                    this._dashResidue
                  ));
            this.last.y = b[b.length - 1];
            this.lastControl = {};
          },
          _vLineToR: function(a, c, b, e) {
            for (c = 0; c < b.length; ++c)
              a.push("lineTo", [this.last.x, (this.last.y += b[c])]),
                e &&
                  (this._dashResidue = g(
                    e,
                    this,
                    e[e.length - 1][0],
                    e[e.length - 1][1],
                    this.last.x,
                    this.last.y,
                    this._dashResidue
                  ));
            this.lastControl = {};
          },
          _curveToA: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 6)
              a.push("bezierCurveTo", b.slice(c, c + 6)),
                e &&
                  (this._dashResidue = k(
                    e,
                    this,
                    a[a.length - 1],
                    this._dashResidue
                  ));
            this.last.x = b[b.length - 2];
            this.last.y = b[b.length - 1];
            this.lastControl.x = b[b.length - 4];
            this.lastControl.y = b[b.length - 3];
            this.lastControl.type = "C";
          },
          _curveToR: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 6)
              a.push("bezierCurveTo", [
                this.last.x + b[c],
                this.last.y + b[c + 1],
                (this.lastControl.x = this.last.x + b[c + 2]),
                (this.lastControl.y = this.last.y + b[c + 3]),
                this.last.x + b[c + 4],
                this.last.y + b[c + 5]
              ]),
                e &&
                  (this._dashResidue = k(
                    e,
                    this,
                    a[a.length - 1],
                    this._dashResidue
                  )),
                (this.last.x += b[c + 4]),
                (this.last.y += b[c + 5]);
            this.lastControl.type = "C";
          },
          _smoothCurveToA: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 4) {
              var g = "C" == this.lastControl.type;
              a.push("bezierCurveTo", [
                g ? 2 * this.last.x - this.lastControl.x : this.last.x,
                g ? 2 * this.last.y - this.lastControl.y : this.last.y,
                b[c],
                b[c + 1],
                b[c + 2],
                b[c + 3]
              ]);
              e &&
                (this._dashResidue = k(
                  e,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.x = b[c];
              this.lastControl.y = b[c + 1];
              this.lastControl.type = "C";
            }
            this.last.x = b[b.length - 2];
            this.last.y = b[b.length - 1];
          },
          _smoothCurveToR: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 4) {
              var g = "C" == this.lastControl.type;
              a.push("bezierCurveTo", [
                g ? 2 * this.last.x - this.lastControl.x : this.last.x,
                g ? 2 * this.last.y - this.lastControl.y : this.last.y,
                this.last.x + b[c],
                this.last.y + b[c + 1],
                this.last.x + b[c + 2],
                this.last.y + b[c + 3]
              ]);
              e &&
                (this._dashResidue = k(
                  e,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.x = this.last.x + b[c];
              this.lastControl.y = this.last.y + b[c + 1];
              this.lastControl.type = "C";
              this.last.x += b[c + 2];
              this.last.y += b[c + 3];
            }
          },
          _qCurveToA: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 4)
              a.push("quadraticCurveTo", b.slice(c, c + 4));
            e &&
              (this._dashResidue = k(
                e,
                this,
                a[a.length - 1],
                this._dashResidue
              ));
            this.last.x = b[b.length - 2];
            this.last.y = b[b.length - 1];
            this.lastControl.x = b[b.length - 4];
            this.lastControl.y = b[b.length - 3];
            this.lastControl.type = "Q";
          },
          _qCurveToR: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 4)
              a.push("quadraticCurveTo", [
                (this.lastControl.x = this.last.x + b[c]),
                (this.lastControl.y = this.last.y + b[c + 1]),
                this.last.x + b[c + 2],
                this.last.y + b[c + 3]
              ]),
                e &&
                  (this._dashResidue = k(
                    e,
                    this,
                    a[a.length - 1],
                    this._dashResidue
                  )),
                (this.last.x += b[c + 2]),
                (this.last.y += b[c + 3]);
            this.lastControl.type = "Q";
          },
          _qSmoothCurveToA: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 2) {
              var g = "Q" == this.lastControl.type;
              a.push("quadraticCurveTo", [
                (this.lastControl.x = g
                  ? 2 * this.last.x - this.lastControl.x
                  : this.last.x),
                (this.lastControl.y = g
                  ? 2 * this.last.y - this.lastControl.y
                  : this.last.y),
                b[c],
                b[c + 1]
              ]);
              e &&
                (this._dashResidue = k(
                  e,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.type = "Q";
            }
            this.last.x = b[b.length - 2];
            this.last.y = b[b.length - 1];
          },
          _qSmoothCurveToR: function(a, c, b, e) {
            for (c = 0; c < b.length; c += 2) {
              var g = "Q" == this.lastControl.type;
              a.push("quadraticCurveTo", [
                (this.lastControl.x = g
                  ? 2 * this.last.x - this.lastControl.x
                  : this.last.x),
                (this.lastControl.y = g
                  ? 2 * this.last.y - this.lastControl.y
                  : this.last.y),
                this.last.x + b[c],
                this.last.y + b[c + 1]
              ]);
              e &&
                (this._dashResidue = k(
                  e,
                  this,
                  a[a.length - 1],
                  this._dashResidue
                ));
              this.lastControl.type = "Q";
              this.last.x += b[c];
              this.last.y += b[c + 1];
            }
          },
          _arcTo: function(a, c, b, e) {
            c = "a" == c;
            for (var g = 0; g < b.length; g += 7) {
              var d = b[g + 5],
                n = b[g + 6];
              c && ((d += this.last.x), (n += this.last.y));
              var y = l.arcAsBezier(
                this.last,
                b[g],
                b[g + 1],
                b[g + 2],
                b[g + 3] ? 1 : 0,
                b[g + 4] ? 1 : 0,
                d,
                n
              );
              u.forEach(y, function(c) {
                a.push("bezierCurveTo", c);
              });
              e && (this._dashResidue = k(e, this, p, this._dashResidue));
              this.last.x = d;
              this.last.y = n;
            }
            this.lastControl = {};
          },
          _closePath: function(a, c, b, e) {
            a.push("closePath", []);
            e &&
              (this._dashResidue = g(
                e,
                this,
                this.last.x,
                this.last.y,
                e[1][0],
                e[1][1],
                this._dashResidue
              ));
            this.lastControl = {};
          }
        });
        u.forEach(
          "moveTo lineTo hLineTo vLineTo curveTo smoothCurveTo qCurveTo qSmoothCurveTo arcTo closePath".split(
            " "
          ),
          function(a) {
            O(e.Path, a);
          }
        );
        e.TextPath = v("dojox.gfx.canvas.TextPath", [e.Shape, t.TextPath], {
          _renderShape: function(a) {},
          _setText: function() {},
          _setFont: function() {}
        });
        e.Surface = v("dojox.gfx.canvas.Surface", d.Surface, {
          constructor: function() {
            d.Container._init.call(this);
            this.pendingImageCount = 0;
            this.makeDirty();
          },
          destroy: function() {
            d.Container.clear.call(this, !0);
            this.inherited(arguments);
          },
          setDimensions: function(a, c) {
            this.width = r.normalizedLength(a);
            this.height = r.normalizedLength(c);
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
            for (var c = 0; c < this.children.length; ++c)
              this.children[c]._render(a);
            a.restore();
          },
          makeDirty: function() {
            this.pendingImagesCount ||
              "pendingRender" in this ||
              this._batch ||
              (this.pendingRender = setTimeout(q.hitch(this, this._render), 0));
          },
          downloadImage: function(a, c) {
            var b = q.hitch(this, this.onImageLoad);
            !this.pendingImageCount++ &&
              "pendingRender" in this &&
              (clearTimeout(this.pendingRender), delete this.pendingRender);
            a.onload = b;
            a.onerror = b;
            a.onabort = b;
            a.src = c;
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
        e.createSurface = function(a, c, b) {
          if (!c && !b) {
            var g = h.position(a);
            c = c || g.w;
            b = b || g.h;
          }
          "number" == typeof c && (c += "px");
          "number" == typeof b && (b += "px");
          g = new e.Surface();
          a = f.byId(a);
          var k = a.ownerDocument.createElement("canvas");
          k.width = r.normalizedLength(c);
          k.height = r.normalizedLength(b);
          a.appendChild(k);
          g.rawNode = k;
          g._parent = a;
          return (g.surface = g);
        };
        var Z = d.Container;
        v = {
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
            return Z.add.apply(this, arguments);
          },
          remove: function(a, c) {
            this._makeDirty();
            return Z.remove.apply(this, arguments);
          },
          clear: function() {
            this._makeDirty();
            return Z.clear.apply(this, arguments);
          },
          getBoundingBox: Z.getBoundingBox,
          _moveChildToFront: function(a) {
            this._makeDirty();
            return Z._moveChildToFront.apply(this, arguments);
          },
          _moveChildToBack: function(a) {
            this._makeDirty();
            return Z._moveChildToBack.apply(this, arguments);
          }
        };
        t = {
          createObject: function(a, c) {
            a = new a();
            a.surface = this.surface;
            a.setShape(c);
            this.add(a);
            return a;
          }
        };
        b(e.Group, v);
        b(e.Group, d.Creator);
        b(e.Group, t);
        b(e.Surface, v);
        b(e.Surface, d.Creator);
        b(e.Surface, t);
        e.fixTarget = function(a, c) {
          return !0;
        };
        return e;
      });
    },
    "dojox/gfx/shape": function() {
      define("./_base dojo/_base/lang dojo/_base/declare dojo/_base/kernel dojo/_base/sniff dojo/on dojo/_base/array dojo/dom-construct dojo/_base/Color ./matrix".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l) {
        function x(a, b) {
          for (var c = a.length - 1; b < c; ) a[b] = a[++b];
          a.length = c;
        }
        var b = (r.shape = {});
        b.Shape = u("dojox.gfx.shape.Shape", null, {
          constructor: function() {
            this.parentMatrix = this.parent = this.bbox = this.strokeStyle = this.fillStyle = this.matrix = this.shape = this.rawNode = null;
            if (m("gfxRegistry")) {
              var a = b.register(this);
              this.getUID = function() {
                return a;
              };
            }
          },
          destroy: function() {
            m("gfxRegistry") && b.dispose(this);
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
            var a = this.getBoundingBox();
            if (!a) return null;
            var b = this._getRealMatrix();
            return [
              l.multiplyPoint(b, a.x, a.y),
              l.multiplyPoint(b, a.x + a.width, a.y),
              l.multiplyPoint(b, a.x + a.width, a.y + a.height),
              l.multiplyPoint(b, a.x, a.y + a.height)
            ];
          },
          getEventSource: function() {
            return this.rawNode;
          },
          setClip: function(a) {
            this.clip = a;
          },
          getClip: function() {
            return this.clip;
          },
          setShape: function(a) {
            this.shape = r.makeParameters(this.shape, a);
            this.bbox = null;
            return this;
          },
          setFill: function(a) {
            if (!a) return (this.fillStyle = null), this;
            var b = null;
            if ("object" == typeof a && "type" in a)
              switch (a.type) {
                case "linear":
                  b = r.makeParameters(r.defaultLinearGradient, a);
                  break;
                case "radial":
                  b = r.makeParameters(r.defaultRadialGradient, a);
                  break;
                case "pattern":
                  b = r.makeParameters(r.defaultPattern, a);
              }
            else b = r.normalizeColor(a);
            this.fillStyle = b;
            return this;
          },
          setStroke: function(a) {
            if (!a) return (this.strokeStyle = null), this;
            if ("string" == typeof a || q.isArray(a) || a instanceof t)
              a = { color: a };
            a = this.strokeStyle = r.makeParameters(r.defaultStroke, a);
            a.color = r.normalizeColor(a.color);
            return this;
          },
          setTransform: function(a) {
            this.matrix = l.clone(a ? l.normalize(a) : l.identity);
            return this._applyTransform();
          },
          _applyTransform: function() {
            return this;
          },
          moveToFront: function() {
            var a = this.getParent();
            a && (a._moveChildToFront(this), this._moveToFront());
            return this;
          },
          moveToBack: function() {
            var a = this.getParent();
            a && (a._moveChildToBack(this), this._moveToBack());
            return this;
          },
          _moveToFront: function() {},
          _moveToBack: function() {},
          applyRightTransform: function(a) {
            return a ? this.setTransform([this.matrix, a]) : this;
          },
          applyLeftTransform: function(a) {
            return a ? this.setTransform([a, this.matrix]) : this;
          },
          applyTransform: function(a) {
            return a ? this.setTransform([this.matrix, a]) : this;
          },
          removeShape: function(a) {
            this.parent && this.parent.remove(this, a);
            return this;
          },
          _setParent: function(a, b) {
            this.parent = a;
            return this._updateParentMatrix(b);
          },
          _updateParentMatrix: function(a) {
            this.parentMatrix = a ? l.clone(a) : null;
            return this._applyTransform();
          },
          _getRealMatrix: function() {
            for (var a = this.matrix, b = this.parent; b; )
              b.matrix && (a = l.multiply(b.matrix, a)), (b = b.parent);
            return a;
          }
        });
        b._eventsProcessing = {
          on: function(a, d) {
            return h(
              this.getEventSource(),
              a,
              b.fixCallback(this, r.fixTarget, d)
            );
          },
          connect: function(a, b, c) {
            "on" == a.substring(0, 2) && (a = a.substring(2));
            return this.on(a, c ? q.hitch(b, c) : b);
          },
          disconnect: function(a) {
            return a.remove();
          }
        };
        b.fixCallback = function(a, b, c, k) {
          k || ((k = c), (c = null));
          if (q.isString(k)) {
            c = c || v.global;
            if (!c[k])
              throw [
                'dojox.gfx.shape.fixCallback: scope["',
                k,
                '"] is null (scope\x3d"',
                c,
                '")'
              ].join("");
            return function(g) {
              return b(g, a) ? c[k].apply(c, arguments || []) : void 0;
            };
          }
          return c
            ? function(g) {
                return b(g, a) ? k.apply(c, arguments || []) : void 0;
              }
            : function(g) {
                return b(g, a) ? k.apply(c, arguments) : void 0;
              };
        };
        q.extend(b.Shape, b._eventsProcessing);
        b.Container = {
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
          add: function(a) {
            var b = a.getParent();
            b && b.remove(a, !0);
            this.children.push(a);
            return a._setParent(this, this._getRealMatrix());
          },
          remove: function(a, b) {
            for (var c = 0; c < this.children.length; ++c)
              if (this.children[c] == a) {
                b || ((a.parent = null), (a.parentMatrix = null));
                x(this.children, c);
                break;
              }
            return this;
          },
          clear: function(a) {
            for (var b, c = 0; c < this.children.length; ++c)
              (b = this.children[c]),
                (b.parent = null),
                (b.parentMatrix = null),
                a && b.destroy();
            this.children = [];
            return this;
          },
          getBoundingBox: function() {
            if (this.children) {
              var a = null;
              f.forEach(this.children, function(b) {
                var c = b.getBoundingBox();
                c &&
                  ((b = b.getTransform()) && (c = l.multiplyRectangle(b, c)),
                  a
                    ? ((a.x = Math.min(a.x, c.x)),
                      (a.y = Math.min(a.y, c.y)),
                      (a.endX = Math.max(a.endX, c.x + c.width)),
                      (a.endY = Math.max(a.endY, c.y + c.height)))
                    : (a = {
                        x: c.x,
                        y: c.y,
                        endX: c.x + c.width,
                        endY: c.y + c.height
                      }));
              });
              a && ((a.width = a.endX - a.x), (a.height = a.endY - a.y));
              return a;
            }
            return null;
          },
          _moveChildToFront: function(a) {
            for (var b = 0; b < this.children.length; ++b)
              if (this.children[b] == a) {
                x(this.children, b);
                this.children.push(a);
                break;
              }
            return this;
          },
          _moveChildToBack: function(a) {
            for (var b = 0; b < this.children.length; ++b)
              if (this.children[b] == a) {
                x(this.children, b);
                this.children.unshift(a);
                break;
              }
            return this;
          }
        };
        b.Surface = u("dojox.gfx.shape.Surface", null, {
          constructor: function() {
            this._parent = this.rawNode = null;
            this._nodes = [];
            this._events = [];
          },
          destroy: function() {
            f.forEach(this._nodes, d.destroy);
            this._nodes = [];
            f.forEach(this._events, function(a) {
              a && a.remove();
            });
            this._events = [];
            this.rawNode = null;
            if (m("ie"))
              for (; this._parent.lastChild; )
                d.destroy(this._parent.lastChild);
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
          onLoad: function(a) {},
          whenLoaded: function(a, b) {
            var c = q.hitch(a, b);
            if (this.isLoaded) c(this);
            else
              h.once(this, "load", function(a) {
                c(a);
              });
          }
        });
        q.extend(b.Surface, b._eventsProcessing);
        b.Rect = u("dojox.gfx.shape.Rect", b.Shape, {
          constructor: function(a) {
            this.shape = r.getDefault("Rect");
            this.rawNode = a;
          },
          getBoundingBox: function() {
            return this.shape;
          }
        });
        b.Ellipse = u("dojox.gfx.shape.Ellipse", b.Shape, {
          constructor: function(a) {
            this.shape = r.getDefault("Ellipse");
            this.rawNode = a;
          },
          getBoundingBox: function() {
            if (!this.bbox) {
              var a = this.shape;
              this.bbox = {
                x: a.cx - a.rx,
                y: a.cy - a.ry,
                width: 2 * a.rx,
                height: 2 * a.ry
              };
            }
            return this.bbox;
          }
        });
        b.Circle = u("dojox.gfx.shape.Circle", b.Shape, {
          constructor: function(a) {
            this.shape = r.getDefault("Circle");
            this.rawNode = a;
          },
          getBoundingBox: function() {
            if (!this.bbox) {
              var a = this.shape;
              this.bbox = {
                x: a.cx - a.r,
                y: a.cy - a.r,
                width: 2 * a.r,
                height: 2 * a.r
              };
            }
            return this.bbox;
          }
        });
        b.Line = u("dojox.gfx.shape.Line", b.Shape, {
          constructor: function(a) {
            this.shape = r.getDefault("Line");
            this.rawNode = a;
          },
          getBoundingBox: function() {
            if (!this.bbox) {
              var a = this.shape;
              this.bbox = {
                x: Math.min(a.x1, a.x2),
                y: Math.min(a.y1, a.y2),
                width: Math.abs(a.x2 - a.x1),
                height: Math.abs(a.y2 - a.y1)
              };
            }
            return this.bbox;
          }
        });
        b.Polyline = u("dojox.gfx.shape.Polyline", b.Shape, {
          constructor: function(a) {
            this.shape = r.getDefault("Polyline");
            this.rawNode = a;
          },
          setShape: function(a, b) {
            a && a instanceof Array
              ? (this.inherited(arguments, [{ points: a }]),
                b &&
                  this.shape.points.length &&
                  this.shape.points.push(this.shape.points[0]))
              : this.inherited(arguments, [a]);
            return this;
          },
          _normalizePoints: function() {
            var a = this.shape.points,
              b = a && a.length;
            if (b && "number" == typeof a[0]) {
              for (var c = [], k = 0; k < b; k += 2)
                c.push({ x: a[k], y: a[k + 1] });
              this.shape.points = c;
            }
          },
          getBoundingBox: function() {
            if (!this.bbox && this.shape.points.length) {
              for (
                var a = this.shape.points,
                  b = a.length,
                  c = a[0],
                  k = c.x,
                  g = c.y,
                  e = c.x,
                  d = c.y,
                  f = 1;
                f < b;
                ++f
              )
                (c = a[f]),
                  k > c.x && (k = c.x),
                  e < c.x && (e = c.x),
                  g > c.y && (g = c.y),
                  d < c.y && (d = c.y);
              this.bbox = { x: k, y: g, width: e - k, height: d - g };
            }
            return this.bbox;
          }
        });
        b.Image = u("dojox.gfx.shape.Image", b.Shape, {
          constructor: function(a) {
            this.shape = r.getDefault("Image");
            this.rawNode = a;
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
        b.Text = u(b.Shape, {
          constructor: function(a) {
            this.fontStyle = null;
            this.shape = r.getDefault("Text");
            this.rawNode = a;
          },
          getFont: function() {
            return this.fontStyle;
          },
          setFont: function(a) {
            this.fontStyle =
              "string" == typeof a
                ? r.splitFontString(a)
                : r.makeParameters(r.defaultFont, a);
            this._setFont();
            return this;
          },
          getBoundingBox: function() {
            var a = null;
            this.getShape().text && (a = r._base._computeTextBoundingBox(this));
            return a;
          }
        });
        b.Creator = {
          createShape: function(a) {
            switch (a.type) {
              case r.defaultPath.type:
                return this.createPath(a);
              case r.defaultRect.type:
                return this.createRect(a);
              case r.defaultCircle.type:
                return this.createCircle(a);
              case r.defaultEllipse.type:
                return this.createEllipse(a);
              case r.defaultLine.type:
                return this.createLine(a);
              case r.defaultPolyline.type:
                return this.createPolyline(a);
              case r.defaultImage.type:
                return this.createImage(a);
              case r.defaultText.type:
                return this.createText(a);
              case r.defaultTextPath.type:
                return this.createTextPath(a);
            }
            return null;
          },
          createGroup: function() {
            return this.createObject(r.Group);
          },
          createRect: function(a) {
            return this.createObject(r.Rect, a);
          },
          createEllipse: function(a) {
            return this.createObject(r.Ellipse, a);
          },
          createCircle: function(a) {
            return this.createObject(r.Circle, a);
          },
          createLine: function(a) {
            return this.createObject(r.Line, a);
          },
          createPolyline: function(a) {
            return this.createObject(r.Polyline, a);
          },
          createImage: function(a) {
            return this.createObject(r.Image, a);
          },
          createText: function(a) {
            return this.createObject(r.Text, a);
          },
          createPath: function(a) {
            return this.createObject(r.Path, a);
          },
          createTextPath: function(a) {
            return this.createObject(r.TextPath, {}).setText(a);
          },
          createObject: function(a, b) {
            return null;
          }
        };
        return b;
      });
    },
    "dojox/gfx/path": function() {
      define([
        "./_base",
        "dojo/_base/lang",
        "dojo/_base/declare",
        "./matrix",
        "./shape"
      ], function(r, q, u, v, m) {
        m = u("dojox.gfx.path.Path", m.Shape, {
          constructor: function(h) {
            this.shape = q.clone(r.defaultPath);
            this.segments = [];
            this.tbbox = null;
            this.absolute = !0;
            this.last = {};
            this.rawNode = h;
            this.segmented = !1;
          },
          setAbsoluteMode: function(h) {
            this._confirmSegmented();
            this.absolute = "string" == typeof h ? "absolute" == h : h;
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
            var h = this.bbox,
              f = this._getRealMatrix();
            this.bbox = null;
            for (var d = 0, t = this.segments.length; d < t; ++d)
              this._updateWithSegment(this.segments[d], f);
            f = this.bbox;
            this.bbox = h;
            return (this.tbbox = f
              ? [
                  { x: f.l, y: f.t },
                  { x: f.r, y: f.t },
                  { x: f.r, y: f.b },
                  { x: f.l, y: f.b }
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
          _updateBBox: function(h, f, d) {
            d && ((f = v.multiplyPoint(d, h, f)), (h = f.x), (f = f.y));
            this.bbox && "l" in this.bbox
              ? (this.bbox.l > h && (this.bbox.l = h),
                this.bbox.r < h && (this.bbox.r = h),
                this.bbox.t > f && (this.bbox.t = f),
                this.bbox.b < f && (this.bbox.b = f))
              : (this.bbox = { l: h, b: f, r: h, t: f });
          },
          _updateWithSegment: function(h, f) {
            var d = h.args,
              t = d.length,
              l;
            switch (h.action) {
              case "M":
              case "L":
              case "C":
              case "S":
              case "Q":
              case "T":
                for (l = 0; l < t; l += 2) this._updateBBox(d[l], d[l + 1], f);
                this.last.x = d[t - 2];
                this.last.y = d[t - 1];
                this.absolute = !0;
                break;
              case "H":
                for (l = 0; l < t; ++l) this._updateBBox(d[l], this.last.y, f);
                this.last.x = d[t - 1];
                this.absolute = !0;
                break;
              case "V":
                for (l = 0; l < t; ++l) this._updateBBox(this.last.x, d[l], f);
                this.last.y = d[t - 1];
                this.absolute = !0;
                break;
              case "m":
                l = 0;
                "x" in this.last ||
                  (this._updateBBox(
                    (this.last.x = d[0]),
                    (this.last.y = d[1]),
                    f
                  ),
                  (l = 2));
                for (; l < t; l += 2)
                  this._updateBBox(
                    (this.last.x += d[l]),
                    (this.last.y += d[l + 1]),
                    f
                  );
                this.absolute = !1;
                break;
              case "l":
              case "t":
                for (l = 0; l < t; l += 2)
                  this._updateBBox(
                    (this.last.x += d[l]),
                    (this.last.y += d[l + 1]),
                    f
                  );
                this.absolute = !1;
                break;
              case "h":
                for (l = 0; l < t; ++l)
                  this._updateBBox((this.last.x += d[l]), this.last.y, f);
                this.absolute = !1;
                break;
              case "v":
                for (l = 0; l < t; ++l)
                  this._updateBBox(this.last.x, (this.last.y += d[l]), f);
                this.absolute = !1;
                break;
              case "c":
                for (l = 0; l < t; l += 6)
                  this._updateBBox(
                    this.last.x + d[l],
                    this.last.y + d[l + 1],
                    f
                  ),
                    this._updateBBox(
                      this.last.x + d[l + 2],
                      this.last.y + d[l + 3],
                      f
                    ),
                    this._updateBBox(
                      (this.last.x += d[l + 4]),
                      (this.last.y += d[l + 5]),
                      f
                    );
                this.absolute = !1;
                break;
              case "s":
              case "q":
                for (l = 0; l < t; l += 4)
                  this._updateBBox(
                    this.last.x + d[l],
                    this.last.y + d[l + 1],
                    f
                  ),
                    this._updateBBox(
                      (this.last.x += d[l + 2]),
                      (this.last.y += d[l + 3]),
                      f
                    );
                this.absolute = !1;
                break;
              case "A":
                for (l = 0; l < t; l += 7)
                  this._updateBBox(d[l + 5], d[l + 6], f);
                this.last.x = d[t - 2];
                this.last.y = d[t - 1];
                this.absolute = !0;
                break;
              case "a":
                for (l = 0; l < t; l += 7)
                  this._updateBBox(
                    (this.last.x += d[l + 5]),
                    (this.last.y += d[l + 6]),
                    f
                  );
                this.absolute = !1;
            }
            h = [h.action];
            for (l = 0; l < t; ++l) h.push(r.formatNumber(d[l], !0));
            if ("string" == typeof this.shape.path)
              this.shape.path += h.join("");
            else
              for (l = 0, t = h.length; l < t; ++l) this.shape.path.push(h[l]);
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
          _pushSegment: function(h, f) {
            this.tbbox = null;
            var d = this._validSegments[h.toLowerCase()];
            "number" == typeof d &&
              (d
                ? f.length >= d &&
                  ((h = {
                    action: h,
                    args: f.slice(0, f.length - (f.length % d))
                  }),
                  this.segments.push(h),
                  this._updateWithSegment(h))
                : ((h = { action: h, args: [] }),
                  this.segments.push(h),
                  this._updateWithSegment(h)));
          },
          _collectArgs: function(h, f) {
            for (var d = 0; d < f.length; ++d) {
              var t = f[d];
              "boolean" == typeof t
                ? h.push(t ? 1 : 0)
                : "number" == typeof t
                ? h.push(t)
                : t instanceof Array
                ? this._collectArgs(h, t)
                : "x" in t && "y" in t && h.push(t.x, t.y);
            }
          },
          moveTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "M" : "m", h);
            return this;
          },
          lineTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "L" : "l", h);
            return this;
          },
          hLineTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "H" : "h", h);
            return this;
          },
          vLineTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "V" : "v", h);
            return this;
          },
          curveTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "C" : "c", h);
            return this;
          },
          smoothCurveTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "S" : "s", h);
            return this;
          },
          qCurveTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "Q" : "q", h);
            return this;
          },
          qSmoothCurveTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "T" : "t", h);
            return this;
          },
          arcTo: function() {
            this._confirmSegmented();
            var h = [];
            this._collectArgs(h, arguments);
            this._pushSegment(this.absolute ? "A" : "a", h);
            return this;
          },
          closePath: function() {
            this._confirmSegmented();
            this._pushSegment("Z", []);
            return this;
          },
          _confirmSegmented: function() {
            if (!this.segmented) {
              var h = this.shape.path;
              this.shape.path = [];
              this._setPath(h);
              this.shape.path = this.shape.path.join("");
              this.segmented = !0;
            }
          },
          _setPath: function(h) {
            h = q.isArray(h) ? h : h.match(r.pathSvgRegExp);
            this.segments = [];
            this.absolute = !0;
            this.bbox = {};
            this.last = {};
            if (h) {
              for (var f = "", d = [], t = h.length, l = 0; l < t; ++l) {
                var x = h[l],
                  b = parseFloat(x);
                isNaN(b)
                  ? (f && this._pushSegment(f, d), (d = []), (f = x))
                  : d.push(b);
              }
              this._pushSegment(f, d);
            }
          },
          setShape: function(h) {
            this.inherited(arguments, ["string" == typeof h ? { path: h } : h]);
            this.segmented = !1;
            this.segments = [];
            r.lazyPathSegmentation || this._confirmSegmented();
            return this;
          },
          _2PI: 2 * Math.PI
        });
        u = u("dojox.gfx.path.TextPath", m, {
          constructor: function(h) {
            "text" in this || (this.text = q.clone(r.defaultTextPath));
            "fontStyle" in this || (this.fontStyle = q.clone(r.defaultFont));
          },
          getText: function() {
            return this.text;
          },
          setText: function(h) {
            this.text = r.makeParameters(
              this.text,
              "string" == typeof h ? { text: h } : h
            );
            this._setText();
            return this;
          },
          getFont: function() {
            return this.fontStyle;
          },
          setFont: function(h) {
            this.fontStyle =
              "string" == typeof h
                ? r.splitFontString(h)
                : r.makeParameters(r.defaultFont, h);
            this._setFont();
            return this;
          }
        });
        return (r.path = { Path: m, TextPath: u });
      });
    },
    "dojox/gfx/arc": function() {
      define(["./_base", "dojo/_base/lang", "./matrix"], function(r, q, u) {
        function v(d) {
          var f = Math.cos(d);
          d = Math.sin(d);
          var b = {
            x: f + (4 / 3) * (1 - f),
            y: d - ((4 / 3) * f * (1 - f)) / d
          };
          return {
            s: { x: f, y: -d },
            c1: { x: b.x, y: -b.y },
            c2: b,
            e: { x: f, y: d }
          };
        }
        var m = 2 * Math.PI,
          h = Math.PI / 4,
          f = Math.PI / 8,
          d = h + f,
          t = v(f);
        return (r.arc = {
          unitArcAsBezier: v,
          curvePI4: t,
          arcAsBezier: function(l, x, b, a, n, c, k, g) {
            n = !!n;
            c = !!c;
            var e = u._degToRad(a);
            a = x * x;
            var E = b * b,
              D = u.multiplyPoint(u.rotate(-e), {
                x: (l.x - k) / 2,
                y: (l.y - g) / 2
              }),
              w = D.x * D.x,
              q = D.y * D.y;
            a = Math.sqrt((a * E - a * q - E * w) / (a * q + E * w));
            isNaN(a) && (a = 0);
            a = { x: (a * x * D.y) / b, y: (-a * b * D.x) / x };
            n == c && (a = { x: -a.x, y: -a.y });
            a = u.multiplyPoint(
              [u.translate((l.x + k) / 2, (l.y + g) / 2), u.rotate(e)],
              a
            );
            x = u.normalize([
              u.translate(a.x, a.y),
              u.rotate(e),
              u.scale(x, b)
            ]);
            a = u.invert(x);
            l = u.multiplyPoint(a, l);
            g = u.multiplyPoint(a, k, g);
            k = Math.atan2(l.y, l.x);
            a = k - Math.atan2(g.y, g.x);
            c && (a = -a);
            0 > a ? (a += m) : a > m && (a -= m);
            b = f;
            g = t;
            b = c ? b : -b;
            l = [];
            for (n = a; 0 < n; n -= h)
              n < d && ((b = n / 2), (g = v(b)), (b = c ? b : -b), (n = 0)),
                (D = u.normalize([x, u.rotate(k + b)])),
                c
                  ? ((a = u.multiplyPoint(D, g.c1)),
                    (e = u.multiplyPoint(D, g.c2)),
                    (D = u.multiplyPoint(D, g.e)))
                  : ((a = u.multiplyPoint(D, g.c2)),
                    (e = u.multiplyPoint(D, g.c1)),
                    (D = u.multiplyPoint(D, g.s))),
                l.push([a.x, a.y, e.x, e.y, D.x, D.y]),
                (k += 2 * b);
            return l;
          }
        });
      });
    },
    "dojox/gfx/decompose": function() {
      define(["./_base", "dojo/_base/lang", "./matrix"], function(r, q, u) {
        function v(d, f) {
          return Math.abs(d - f) <= 1e-6 * (Math.abs(d) + Math.abs(f));
        }
        function m(d, f, h, b) {
          if (!isFinite(d)) return h;
          if (!isFinite(h)) return d;
          f = Math.abs(f);
          b = Math.abs(b);
          return (f * d + b * h) / (f + b);
        }
        function h(d) {
          d = u.normalize(d);
          var f = -d.xx - d.yy,
            h = d.xx * d.yy - d.xy * d.yx,
            b = Math.sqrt(f * f - 4 * h),
            f = -(f + (0 > f ? -b : b)) / 2,
            h = h / f,
            b = d.xy / (f - d.xx),
            a = 1,
            n = d.xy / (h - d.xx),
            c = 1;
          v(f, h) && ((b = 1), (n = a = 0), (c = 1));
          isFinite(b) ||
            ((b = 1),
            (a = (f - d.xx) / d.xy),
            isFinite(a) ||
              ((b = (f - d.yy) / d.yx),
              (a = 1),
              isFinite(b) || ((b = 1), (a = d.yx / (f - d.yy)))));
          isFinite(n) ||
            ((n = 1),
            (c = (h - d.xx) / d.xy),
            isFinite(c) ||
              ((n = (h - d.yy) / d.yx),
              (c = 1),
              isFinite(n) || ((n = 1), (c = d.yx / (h - d.yy)))));
          d = Math.sqrt(b * b + a * a);
          var k = Math.sqrt(n * n + c * c);
          isFinite((b /= d)) || (b = 0);
          isFinite((a /= d)) || (a = 0);
          isFinite((n /= k)) || (n = 0);
          isFinite((c /= k)) || (c = 0);
          return {
            value1: f,
            value2: h,
            vector1: { x: b, y: a },
            vector2: { x: n, y: c }
          };
        }
        function f(d, f) {
          var h = 0 > d.xx * d.yy || 0 < d.xy * d.yx ? -1 : 1,
            b = (f.angle1 =
              (Math.atan2(d.yx, d.yy) + Math.atan2(-h * d.xy, h * d.xx)) / 2),
            h = Math.cos(b),
            b = Math.sin(b);
          f.sx = m(d.xx / h, h, -d.xy / b, b);
          f.sy = m(d.yy / h, h, d.yx / b, b);
          return f;
        }
        function d(d, f) {
          var h = 0 > d.xx * d.yy || 0 < d.xy * d.yx ? -1 : 1,
            b = (f.angle2 =
              (Math.atan2(h * d.yx, h * d.xx) + Math.atan2(-d.xy, d.yy)) / 2),
            h = Math.cos(b),
            b = Math.sin(b);
          f.sx = m(d.xx / h, h, d.yx / b, b);
          f.sy = m(d.yy / h, h, -d.xy / b, b);
          return f;
        }
        return (r.decompose = function(t) {
          var l = u.normalize(t);
          t = { dx: l.dx, dy: l.dy, sx: 1, sy: 1, angle1: 0, angle2: 0 };
          if (v(l.xy, 0) && v(l.yx, 0))
            return q.mixin(t, { sx: l.xx, sy: l.yy });
          if (v(l.xx * l.yx, -l.xy * l.yy)) return f(l, t);
          if (v(l.xx * l.xy, -l.yx * l.yy)) return d(l, t);
          var m,
            b = new u.Matrix2D(l);
          m = q.mixin(b, { dx: 0, dy: 0, xy: b.yx, yx: b.xy });
          b = h([l, m]);
          m = h([m, l]);
          b = new u.Matrix2D({
            xx: b.vector1.x,
            xy: b.vector2.x,
            yx: b.vector1.y,
            yy: b.vector2.y
          });
          m = new u.Matrix2D({
            xx: m.vector1.x,
            xy: m.vector1.y,
            yx: m.vector2.x,
            yy: m.vector2.y
          });
          l = new u.Matrix2D([u.invert(b), l, u.invert(m)]);
          f(m, t);
          l.xx *= t.sx;
          l.yy *= t.sy;
          d(b, t);
          l.xx *= t.sx;
          l.yy *= t.sy;
          return q.mixin(t, { sx: l.xx, sy: l.yy });
        });
      });
    },
    "dojox/gfx/bezierutils": function() {
      define(["./_base"], function(r) {
        r = r.bezierutils = {};
        r.tAtLength = function(f, d) {
          var t = 0,
            l = 6 == f.length,
            m = 0,
            b = 0,
            a = l ? v : h,
            n = function(c, k) {
              for (var g = 0, e = 0; e < c.length - 2; e += 2)
                g += u(c[e], c[e + 1], c[e + 2], c[e + 3]);
              e = l ? u(f[0], f[1], f[4], f[5]) : u(f[0], f[1], f[6], f[7]);
              g - e > k || m + g > d + k
                ? (++b,
                  (c = a(c, 0.5)),
                  n(c[0], k),
                  Math.abs(m - d) <= k || n(c[1], k))
                : ((m += g), (t += 1 / (1 << b)));
            };
          d && n(f, 0.5);
          return t;
        };
        var q = (r.computeLength = function(f) {
            for (var d = 6 == f.length, h = 0, l = 0; l < f.length - 2; l += 2)
              h += u(f[l], f[l + 1], f[l + 2], f[l + 3]);
            l = d ? u(f[0], f[1], f[4], f[5]) : u(f[0], f[1], f[6], f[7]);
            0.1 < h - l &&
              ((f = d ? v(f, 0.5) : m(f, 0.5)),
              (h = q(f[0], d)),
              (h += q(f[1], d)));
            return h;
          }),
          u = (r.distance = function(f, d, h, l) {
            return Math.sqrt((h - f) * (h - f) + (l - d) * (l - d));
          }),
          v = function(f, d) {
            var h = 1 - d,
              l = h * h,
              m = d * d,
              b = f[0],
              a = f[1],
              n = f[2],
              c = f[3],
              k = f[4];
            f = f[5];
            var g = l * b + 2 * h * d * n + m * k,
              l = l * a + 2 * h * d * c + m * f;
            return [
              [b, a, h * b + d * n, h * a + d * c, g, l],
              [g, l, h * n + d * k, h * c + d * f, k, f]
            ];
          },
          m = function(f, d) {
            var h = 1 - d,
              l = h * h,
              m = l * h,
              b = d * d,
              a = b * d,
              n = f[0],
              c = f[1],
              k = f[2],
              g = f[3],
              e = f[4],
              E = f[5],
              q = f[6];
            f = f[7];
            var w = m * n + 3 * l * d * k + 3 * h * b * e + a * q,
              m = m * c + 3 * l * d * g + 3 * h * b * E + a * f;
            return [
              [
                n,
                c,
                h * n + d * k,
                h * c + d * g,
                l * n + 2 * h * d * k + b * e,
                l * c + 2 * h * d * g + b * E,
                w,
                m
              ],
              [
                w,
                m,
                l * k + 2 * h * d * e + b * q,
                l * g + 2 * h * d * E + b * f,
                h * e + d * q,
                h * E + d * f,
                q,
                f
              ]
            ];
          },
          h = (r.splitBezierAtT = function(f, d) {
            return 6 == f.length ? v(f, d) : m(f, d);
          });
        return r;
      });
    },
    "dojox/json/query": function() {
      define([
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojox",
        "dojo/_base/array"
      ], function(r, q, u) {
        q.getObject("json", !0, u);
        u.json._slice = function(q, m, h, f) {
          var d = q.length,
            t = [];
          h = h || d;
          m = 0 > m ? Math.max(0, m + d) : Math.min(d, m);
          for (h = 0 > h ? Math.max(0, h + d) : Math.min(d, h); m < h; m += f)
            t.push(q[m]);
          return t;
        };
        u.json._find = function(q, m) {
          function h(d) {
            m &&
              (!0 !== m || d instanceof Array
                ? d[m] && f.push(d[m])
                : f.push(d));
            for (var l in d) {
              var t = d[l];
              m ? t && "object" == typeof t && h(t) : f.push(t);
            }
          }
          var f = [];
          if (m instanceof Array) {
            if (1 == m.length) return q[m[0]];
            for (var d = 0; d < m.length; d++) f.push(q[m[d]]);
          } else h(q);
          return f;
        };
        u.json._distinctFilter = function(q, m) {
          for (var h = [], f = {}, d = 0, t = q.length; d < t; ++d) {
            var l = q[d];
            m(l, d, q) &&
              ("object" == typeof l && l
                ? l.__included || ((l.__included = !0), h.push(l))
                : f[l + typeof l] || ((f[l + typeof l] = !0), h.push(l)));
          }
          d = 0;
          for (t = h.length; d < t; ++d) h[d] && delete h[d].__included;
          return h;
        };
        return (u.json.query = function(q, m) {
          function h(b, a, f, c, k, g, e, h) {
            return d[h].match(/[\*\?]/) || "~" == e
              ? "/^" +
                  d[h]
                    .substring(1, d[h].length - 1)
                    .replace(/\\([btnfr\\"'])|([^\w\*\?])/g, "\\$1$2")
                    .replace(/([\*\?])/g, "[\\w\\W]$1") +
                  ("~" == e ? "$/i" : "$/") +
                  ".test(" +
                  a +
                  ")"
              : b;
          }
          var f = 0,
            d = [];
          q = q.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g, function(b) {
            f += "[" == b ? 1 : "]" == b ? -1 : 0;
            return "]" == b && 0 < f
              ? "`]"
              : '"' == b.charAt(0) || "'" == b.charAt(0)
              ? "`" + (d.push(b) - 1)
              : b;
          });
          var t = "";
          q.replace(
            /(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/,
            function() {
              throw Error("Unsafe function call");
            }
          );
          q = q
            .replace(/([^<>=]=)([^=])/g, "$1\x3d$2")
            .replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g, function(b) {
              return "." == b.charAt(0)
                ? b
                : "@" == b
                ? "$obj"
                : (b.match(/:|^(\$|Math|true|false|null)$/) ? "" : "$obj.") + b;
            })
            .replace(
              /\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,
              function(b, a, d) {
                return (a = b.match(
                  /^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/
                ))
                  ? ((d = ""),
                    b.match(/^\./) &&
                      ((t = "dojox.json._find(" + t), (d = ",true)")),
                    (t =
                      (a[1].match(/\=/)
                        ? "dojo.map"
                        : a[1].match(/\^/)
                        ? "dojox.json._distinctFilter"
                        : "dojo.filter") +
                      "(" +
                      t),
                    d + ",function($obj){return " + a[2] + "})")
                  : (a = b.match(/^\[\s*([\/\\].*)\]/))
                  ? ".concat().sort(function(a,b){" +
                    a[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g, function(
                      a,
                      b,
                      g
                    ) {
                      return (
                        "var av\x3d " +
                        g.replace(/\$obj/, "a") +
                        ",bv\x3d " +
                        g.replace(/\$obj/, "b") +
                        ";if(av\x3ebv||bv\x3d\x3dnull){return " +
                        ("/" == b ? 1 : -1) +
                        ";}\nif(bv\x3eav||av\x3d\x3dnull){return " +
                        ("/" == b ? -1 : 1) +
                        ";}\n"
                      );
                    }) +
                    "return 0;})"
                  : (a = b.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/))
                  ? ((t = "dojox.json._slice(" + t),
                    "," +
                      (a[1] || 0) +
                      "," +
                      (a[2] || 0) +
                      "," +
                      (a[3] || 1) +
                      ")")
                  : b.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)
                  ? ((t = "dojox.json._find(" + t),
                    ("." == b.charAt(1)
                      ? ",'" + d + "'"
                      : b.match(/,/)
                      ? "," + b
                      : "") + ")")
                  : b;
              }
            )
            .replace(
              /(\$obj\s*((\.\s*[\w_$]+\s*)|(\[\s*`([0-9]+)\s*`\]))*)(==|~)\s*`([0-9]+)/g,
              h
            )
            .replace(
              /`([0-9]+)\s*(==|~)\s*(\$obj\s*((\.\s*[\w_$]+)|(\[\s*`([0-9]+)\s*`\]))*)/g,
              function(b, a, d, c, k, g, e, f) {
                return h(b, c, k, g, e, f, d, a);
              }
            );
          q =
            t +
            ("$" == q.charAt(0) ? "" : "$") +
            q.replace(/`([0-9]+|\])/g, function(b, a) {
              return "]" == a ? "]" : d[a];
            });
          for (
            var l = eval(
                "1\x26\x26function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj\x3d$;return " +
                  q +
                  "}"
              ),
              x = 0;
            x < arguments.length - 1;
            x++
          )
            arguments[x] = arguments[x + 1];
          return m ? l.apply(this, arguments) : l;
        });
      });
    },
    "esri/tasks/locator": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has ../kernel ../request ../deferredUtils ./Task ./AddressCandidate".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x) {
        r = r(l, {
          declaredClass: "esri.tasks.Locator",
          _eventMap: {
            "address-to-locations-complete": ["addresses"],
            "addresses-to-locations-complete": ["addresses"],
            "location-to-address-complete": ["address"],
            "suggest-locations-complete": ["suggestions"]
          },
          constructor: function(b) {
            this._geocodeHandler = q.hitch(this, this._geocodeHandler);
            this._geocodeAddressesHandler = q.hitch(
              this,
              this._geocodeAddressesHandler
            );
            this._reverseGeocodeHandler = q.hitch(
              this,
              this._reverseGeocodeHandler
            );
            this.registerConnectEvents();
          },
          outSpatialReference: null,
          setOutSpatialReference: function(b) {
            this.outSpatialReference = b;
          },
          _geocodeHandler: function(b, a, d, c, k) {
            try {
              var g = b.candidates,
                e;
              a = [];
              var f,
                n = g.length,
                h = b.spatialReference,
                l;
              for (f = 0; f < n; f++) {
                e = g[f];
                if ((l = e.location)) l.spatialReference = h;
                a[f] = new x(e);
              }
              this._successHandler([a], "onAddressToLocationsComplete", d, k);
            } catch (F) {
              this._errorHandler(F, c, k);
            }
          },
          _geocodeAddressesHandler: function(b, a, d, c, k) {
            try {
              var g = b.locations;
              a = [];
              var e,
                f = g.length,
                n = b.spatialReference,
                h;
              for (e = 0; e < f; e++) {
                if ((h = g[e].location)) h.spatialReference = n;
                a[e] = new x(g[e]);
              }
              this._successHandler([a], "onAddressesToLocationsComplete", d, k);
            } catch (B) {
              this._errorHandler(B, c, k);
            }
          },
          addressToLocations: function(b, a, f, c, k) {
            var g, e, n, h, l, x, r, u;
            b.address &&
              ((c = f),
              (f = a),
              (a = b.outFields),
              (k = b.searchExtent),
              (u = b.countryCode),
              (g = b.magicKey),
              (e = b.distance),
              (r = b.categories),
              b.location && this.normalization && (n = b.location.normalize()),
              (h = b.locationType),
              (l = b.maxLocations),
              (x = b.forStorage),
              (b = b.address));
            k && (k = k.shiftCentralMeridian());
            var C = this.outSpatialReference;
            b = this._encode(
              q.mixin({}, this._url.query, b, {
                f: "json",
                outSR: C && m.toJson(C.toJson()),
                outFields: (a && a.join(",")) || null,
                searchExtent: k && m.toJson(k.toJson()),
                category: (r && r.join(",")) || null,
                countryCode: u || null,
                magicKey: g || null,
                distance: e || null,
                location: n || null,
                locationType: h || null,
                maxLocations: l || null,
                forStorage: x || null
              })
            );
            var A = this._geocodeHandler,
              R = this._errorHandler,
              J = new v(t._dfdCanceller);
            J._pendingDfd = d({
              url: this._url.path + "/findAddressCandidates",
              content: b,
              callbackParamName: "callback",
              load: function(a, b) {
                A(a, b, f, c, J);
              },
              error: function(a) {
                R(a, c, J);
              }
            });
            return J;
          },
          suggestLocations: function(b) {
            var a;
            a = new v(t._dfdCanceller);
            b.hasOwnProperty("location") &&
              this.normalization &&
              (b.location = b.location.normalize());
            b.searchExtent &&
              (b.searchExtent = b.searchExtent.shiftCentralMeridian());
            b = this._encode(
              q.mixin(
                {},
                this._url.query,
                {
                  f: "json",
                  text: b.text,
                  maxSuggestions: b.maxSuggestions,
                  searchExtent:
                    b.searchExtent && m.toJson(b.searchExtent.toJson()),
                  category: (b.categories && b.categories.join(",")) || null,
                  countryCode: b.countryCode || null,
                  location: b.location || null,
                  distance: b.distance || null
                },
                { f: "json" }
              )
            );
            b = d({
              url: this._url.path + "/suggest",
              content: b,
              callbackParamName: "callback"
            });
            a._pendingDfd = b;
            b.then(
              q.hitch(this, function(b) {
                b = b.suggestions || [];
                this.onSuggestLocationsComplete(b);
                a.resolve(b);
              }),
              q.hitch(this, function(b) {
                this._errorHandler(b);
                a.reject(b);
              })
            );
            return a;
          },
          addressesToLocations: function(b, a, f) {
            var c = this.outSpatialReference,
              k = [],
              g = b.categories,
              e = b.locationType,
              n = b.countryCode;
            u.forEach(b.addresses, function(a, b) {
              k.push({ attributes: a });
            });
            b = this._encode(
              q.mixin(
                {},
                this._url.query,
                {
                  category: (g && g.join(",")) || null,
                  locationType: e || null,
                  sourceCountry: n || null
                },
                { addresses: m.toJson({ records: k }) },
                { f: "json", outSR: c && m.toJson(c.toJson()) }
              )
            );
            var h = this._geocodeAddressesHandler,
              l = this._errorHandler,
              x = new v(t._dfdCanceller);
            x._pendingDfd = d({
              url: this._url.path + "/geocodeAddresses",
              content: b,
              callbackParamName: "callback",
              load: function(b, c) {
                h(b, c, a, f, x);
              },
              error: function(a) {
                l(a, f, x);
              }
            });
            return x;
          },
          _reverseGeocodeHandler: function(b, a, d, c, k) {
            try {
              var g = new x({
                address: b.address,
                location: b.location,
                score: 100
              });
              this._successHandler([g], "onLocationToAddressComplete", d, k);
            } catch (e) {
              this._errorHandler(e, c, k);
            }
          },
          locationToAddress: function(b, a, f, c) {
            b && this.normalization && (b = b.normalize());
            var k = this.outSpatialReference;
            b = this._encode(
              q.mixin({}, this._url.query, {
                outSR: k && m.toJson(k.toJson()),
                location: b && m.toJson(b.toJson()),
                distance: a,
                f: "json"
              })
            );
            var g = this._reverseGeocodeHandler,
              e = this._errorHandler,
              n = new v(t._dfdCanceller);
            n._pendingDfd = d({
              url: this._url.path + "/reverseGeocode",
              content: b,
              callbackParamName: "callback",
              load: function(a, b) {
                g(a, b, f, c, n);
              },
              error: function(a) {
                e(a, c, n);
              }
            });
            return n;
          },
          onSuggestLocationsComplete: function() {},
          onAddressToLocationsComplete: function() {},
          onAddressesToLocationsComplete: function() {},
          onLocationToAddressComplete: function() {}
        });
        h("extend-esri") && q.setObject("tasks.Locator", r, f);
        return r;
      });
    },
    "esri/tasks/AddressCandidate": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "../geometry/Point"
      ], function(r, q, u, v, m) {
        r = r(null, {
          declaredClass: "esri.tasks.AddressCandidate",
          constructor: function(h) {
            q.mixin(this, h);
            this.location = new m(this.location);
          }
        });
        u("extend-esri") && q.setObject("tasks.AddressCandidate", r, v);
        return r;
      });
    },
    "esri/tasks/LegendLayer": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(r, q, u, v) {
        r = r(null, {
          declaredClass: "esri.tasks.LegendLayer",
          layerId: null,
          subLayerIds: null
        });
        u("extend-esri") && q.setObject("tasks.LegendLayer", r, v);
        return r;
      });
    },
    "esri/dijit/AttributeInspector": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/sniff dojo/_base/kernel dojo/has dojo/dom-style dojo/dom-construct ../kernel ../lang ../domUtils ../layers/InheritedDomain ../layers/FeatureLayer dojo/i18n!../nls/jsapi dojo/fx dojox/gfx dijit/_Widget dijit/_Templated dijit/Editor dijit/_editor/plugins/LinkDialog dijit/_editor/plugins/TextColor ./_EventedWidget ./editing/AttachmentEditor ./editing/Util ../tasks/query dijit/form/DateTextBox dijit/form/TextBox dijit/form/NumberTextBox dijit/form/FilteringSelect dijit/form/NumberSpinner dijit/form/Button dijit/form/SimpleTextarea dijit/form/ValidationTextBox dijit/form/TimeTextBox dijit/Tooltip dojo/data/ItemFileReadStore dojox/date/islamic dojox/date/islamic/Date dojox/date/islamic/locale dojo/text!./templates/AttributeInspector.html".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F,
        G,
        C,
        A,
        R,
        J,
        O,
        H,
        y,
        T,
        Z,
        I,
        z,
        K,
        P,
        Y,
        X,
        M,
        N
      ) {
        var U = r([F, e, E], {
          declaredClass: "esri.dijit.AttributeInspector",
          widgetsInTemplate: !0,
          templateString: N,
          onUpdate: function() {},
          onDelete: function() {},
          onAttributeChange: function() {},
          onNext: function() {},
          onReset: function() {},
          onCancel: function() {},
          _navMessage: "( ${idx} ${of} ${numFeatures} )",
          _currentAttributeFieldName: null,
          _aiConnects: [],
          _selection: [],
          _toolTips: [],
          _numFeatures: 0,
          _featureIdx: 0,
          _currentLInfo: null,
          _currentFeature: null,
          _rollbackInfo: null,
          _eventMap: {
            update: !0,
            delete: ["feature"],
            "attribute-change": ["feature", "fieldName", "fieldValue"],
            next: ["feature"],
            reset: !0,
            cancel: !0
          },
          _defaultRichTextPlugins: "bold italic underline foreColor hiliteColor | justifyLeft justifyCenter justifyRight justifyFull | insertOrderedList insertUnorderedList indent outdent | createLink".split(
            " "
          ),
          css: {
            label: "atiLabel",
            field: "atiField",
            textArea: "atiTextAreaField",
            richText: "atiRichTextField",
            attachmentEditor: "atiAttachmentEditor",
            red: "atiRequiredField"
          },
          constructor: function(a, b) {
            q.mixin(this, c.widgets.attributeInspector);
            a = a || {};
            a.featureLayer ||
              a.layerInfos ||
              console.error(
                "esri.AttributeInspector: please provide correct parameter in the constructor"
              );
            this._datePackage = this._getDatePackage(a);
            this._layerInfos = a.layerInfos || [
              { featureLayer: a.featureLayer, options: a.options || [] }
            ];
            this._layerInfos = u.filter(this._layerInfos, function(a) {
              return !a.disableAttributeUpdate;
            });
            this._hideNavButtons = a.hideNavButtons || !1;
          },
          postCreate: function() {
            if (
              u.every(this._layerInfos, function(a) {
                return a.featureLayer.loaded;
              })
            )
              this._initLayerInfos(),
                this._createAttachmentEditor(),
                this.onFirstFeature();
            else {
              var a = this._layerInfos.length;
              u.forEach(
                this._layerInfos,
                function(b) {
                  b = b.featureLayer;
                  if (b.loaded) a--;
                  else
                    var c = v.connect(b, "onLoad", this, function(b) {
                      v.disconnect(c);
                      c = null;
                      a--;
                      a ||
                        (this._initLayerInfos(),
                        this._createAttachmentEditor(),
                        this.onFirstFeature());
                    });
                },
                this
              );
            }
          },
          destroy: function() {
            this._destroyAttributeTable();
            u.forEach(this._aiConnects, v.disconnect);
            delete this._aiConnects;
            this._attachmentEditor &&
              (this._attachmentEditor.destroy(), delete this._attachmentEditor);
            delete this._layerInfos;
            this._selection = this._currentFeature = this._currentLInfo = this._attributes = this._layerInfos = null;
            this.inherited(arguments);
          },
          refresh: function() {
            this._updateSelection();
          },
          first: function() {
            this.onFirstFeature();
          },
          last: function() {
            this.onLastFeature();
          },
          next: function() {
            this.onNextFeature();
          },
          previous: function() {
            this.onPreviousFeature();
          },
          showFeature: function(a, b) {
            b && (this._createOnlyFirstTime = !0);
            this._updateSelection([a], b);
            this._updateUI();
          },
          onLayerSelectionChange: function(a, b, c) {
            this._createOnlyFirstTime = !1;
            this._featureIdx = c === n.SELECTION_NEW ? 0 : this._featureIdx;
            this._updateSelection();
            this._updateUI();
          },
          onLayerSelectionClear: function() {
            !this._selection ||
              0 >= this._selection.length ||
              ((this._featureIdx = this._numFeatures = 0),
              (this._selection = []),
              (this._currentLInfo = this._currentFeature = null),
              this._updateUI());
          },
          onLayerUpdateEnd: function(a, b, c, e) {},
          onLayerError: function(a, b, c, e) {},
          onLayerEditsError: function(a, b, c, e) {},
          onLayerEditsComplete: function(a, b, c, e) {
            e = e || [];
            if (e.length) {
              var g = this._selection,
                d = a.featureLayer.objectIdField;
              u.forEach(
                e,
                q.hitch(this, function(a) {
                  u.some(
                    g,
                    q.hitch(this, function(b, c) {
                      if (b.attributes[d] !== a.objectId) return !1;
                      this._selection.splice(c, 1);
                      return !0;
                    })
                  );
                })
              );
            }
            b = b || [];
            b.length &&
              ((this._selection = C.findFeatures(b, a.featureLayer)),
              (this._featureIdx = 0));
            e = this._numFeatures = (this._selection = C.sortFeaturesById(
              this._layerInfos,
              this._selection
            ))
              ? this._selection.length
              : 0;
            if (b.length) {
              if ((b = e ? this._selection[this._featureIdx] : null))
                (e = b.getLayer().getEditCapabilities()),
                  (e.canCreate && !e.canUpdate) || this._showFeature(b);
              this._updateUI();
            }
            c = c || [];
            if (c.length) {
              var k = this._rollbackInfo;
              u.forEach(
                c,
                function(b) {
                  var e = C.findFeatures(c, a.featureLayer)[0];
                  if (
                    !b.success &&
                    e.attributes[a.featureLayer.objectIdField] === b.objectId &&
                    k
                  ) {
                    var g = k.field;
                    b = k.graphic.attributes[g.name];
                    var d = u.filter(
                      this._currentLInfo.fieldInfos,
                      function(a) {
                        return a.fieldName === g.name;
                      },
                      this
                    )[0].dijit;
                    e.attributes[g.name] = b;
                    "esriFieldTypeDate" === g.type && (b = new Date(b));
                    this._setValue(d, b);
                  }
                },
                this
              );
            }
            this._rollbackInfo = null;
          },
          onFieldValueChange: function(a, b) {
            var c = a.field,
              e = a.dijit,
              g = this._currentFeature,
              d = this._currentLInfo,
              k = c.name;
            a = this._isFieldRequired(c, a);
            if (
              "" === e.displayedValue ||
              "dijit.form.ValidationTextBox" !== e.declaredClass ||
              e.isValid()
            )
              if (
                "" !== e.displayedValue &&
                e.displayedValue !== b &&
                e.isValid &&
                !e.isValid()
              )
                this._setValue(e, g.attributes[c.name]);
              else {
                var f = !(
                  "esriFieldTypeInteger" !== c.type &&
                  "esriFieldTypeSmallInteger" !== c.type &&
                  "esriFieldTypeSingle" !== c.type &&
                  "esriFieldTypeDouble" !== c.type
                );
                if (
                  a &&
                  (null === b ||
                    "" === b ||
                    "undefined" === typeof b ||
                    (f && isNaN(b)))
                ) {
                  k = g.attributes[c.name];
                  if (
                    "esriFieldTypeDate" === c.type &&
                    ((k = new Date(k)), e instanceof Array)
                  ) {
                    this._setValue(e[0], k);
                    this._setValue(e[1], k);
                    return;
                  }
                  this._setValue(e, k);
                } else {
                  if (f) {
                    if (isNaN(b) || "" === b) b = null;
                    f && null !== b && (b = Number(b));
                  }
                  "esriFieldTypeDate" === c.type &&
                    (e instanceof Array
                      ? ((b = e[0].getValue()),
                        (e = e[1].getValue()),
                        (b =
                          b && e
                            ? new Date(
                                b.getFullYear(),
                                b.getMonth(),
                                b.getDate(),
                                e.getHours(),
                                e.getMinutes(),
                                e.getSeconds(),
                                e.getMilliseconds()
                              )
                            : b || e || null))
                      : ((b = e.getValue()), c.domain && (b = Number(b))),
                    (b =
                      b && b.getTime
                        ? b.getTime()
                        : b && b.toGregorian
                        ? b.toGregorian().getTime()
                        : b));
                  if (this._currentFeature.attributes[c.name] !== b) {
                    if (k === d.typeIdField) {
                      var y = this._findFirst(d.types, "id", b);
                      u.forEach(
                        d.fieldInfos,
                        function(a) {
                          (c = a.field) &&
                            c.name !== d.typeIdField &&
                            ((a = a.dijit),
                            this._setFieldDomain(a, y, c) &&
                              a &&
                              (this._setValue(a, g.attributes[c.name] + ""),
                              !1 === a.isValid() && this._setValue(a, null)));
                        },
                        this
                      );
                    }
                    this.onAttributeChange(g, k, b);
                  }
                }
              }
            else this._setValue(e, g.attributes[c.name]);
          },
          onDeleteBtn: function(a) {
            this._deleteFeature();
          },
          onNextFeature: function(a) {
            this._onNextFeature(1);
          },
          onPreviousFeature: function(a) {
            this._onNextFeature(-1);
          },
          onFirstFeature: function(a) {
            this._onNextFeature(-1 * this._featureIdx);
          },
          onLastFeature: function(a) {
            this._onNextFeature(this._numFeatures - 1 - this._featureIdx);
          },
          _initLayerInfos: function() {
            var a = this._layerInfos;
            this._editorTrackingInfos = {};
            u.forEach(a, this._initLayerInfo, this);
          },
          _initLayerInfo: function(a) {
            var b = a.featureLayer,
              c,
              e;
            this._userIds = {};
            e = b.id;
            b.credential && (this._userIds[e] = b.credential.userId);
            a.userId && (this._userIds[e] = a.userId);
            this._connect(
              b,
              "onSelectionComplete",
              q.hitch(this, "onLayerSelectionChange", a)
            );
            this._connect(
              b,
              "onSelectionClear",
              q.hitch(this, "onLayerSelectionClear", a)
            );
            this._connect(
              b,
              "onEditsComplete",
              q.hitch(this, "onLayerEditsComplete", a)
            );
            this._connect(b, "error", q.hitch(this, "onLayerError", a));
            this._connect(
              b,
              "onUpdateEnd",
              q.hitch(this, "onLayerUpdateEnd", a)
            );
            a.showAttachments = b.hasAttachments
              ? x.isDefined(a.showAttachments)
                ? a.showAttachments
                : !0
              : !1;
            a.hideFields = a.hideFields || [];
            a.htmlFields = a.htmlFields || [];
            a.isEditable = b.isEditable()
              ? x.isDefined(a.isEditable)
                ? a.isEditable
                : !0
              : !1;
            a.typeIdField = b.typeIdField;
            a.layerId = b.id;
            a.types = b.types;
            b.globalIdField &&
              ((c = this._findFirst(
                a.fieldInfos,
                "fieldName",
                b.globalIdField
              )) ||
                a.showGlobalID ||
                a.hideFields.push(b.globalIdField));
            (e = this._findFirst(a.fieldInfos, "fieldName", b.objectIdField)) ||
              a.showObjectID ||
              a.hideFields.push(b.objectIdField);
            var g = this._getFields(a.featureLayer);
            if (g) {
              var d = a.fieldInfos || [],
                d = u.map(d, function(a) {
                  return q.mixin({}, a);
                });
              d.length
                ? (a.fieldInfos = u.filter(
                    u.map(
                      d,
                      q.hitch(this, function(b) {
                        var c =
                          b.stringFieldOption ||
                          (this._isInFields(b.fieldName, a.htmlFields)
                            ? U.STRING_FIELD_OPTION_RICHTEXT
                            : U.STRING_FIELD_OPTION_TEXTBOX);
                        return q.mixin(b, {
                          field: this._findFirst(g, "name", b.fieldName),
                          stringFieldOption: c
                        });
                      })
                    ),
                    "return item.field;"
                  ))
                : ((g = u.filter(
                    g,
                    q.hitch(this, function(b) {
                      return !this._isInFields(b.name, a.hideFields);
                    })
                  )),
                  (a.fieldInfos = u.map(
                    g,
                    q.hitch(this, function(b) {
                      var c = this._isInFields(b.name, a.htmlFields)
                        ? U.STRING_FIELD_OPTION_RICHTEXT
                        : U.STRING_FIELD_OPTION_TEXTBOX;
                      return {
                        fieldName: b.name,
                        field: b,
                        stringFieldOption: c
                      };
                    })
                  )));
              a.showGlobalID &&
                !c &&
                d.push(this._findFirst(g, "name", b.globalIdField));
              a.showObjectID &&
                !e &&
                d.push(this._findFirst(g, "name", b.objectIdField));
              c = [];
              b.editFieldsInfo &&
                (b.editFieldsInfo.creatorField &&
                  c.push(b.editFieldsInfo.creatorField),
                b.editFieldsInfo.creationDateField &&
                  c.push(b.editFieldsInfo.creationDateField),
                b.editFieldsInfo.editorField &&
                  c.push(b.editFieldsInfo.editorField),
                b.editFieldsInfo.editDateField &&
                  c.push(b.editFieldsInfo.editDateField));
              this._editorTrackingInfos[b.id] = c;
            }
          },
          _createAttachmentEditor: function() {
            this._attachmentEditor = null;
            var a = u.filter(this._layerInfos, function(a) {
              return a.showAttachments;
            });
            a &&
              a.length &&
              ((this._attachmentEditor = new G(
                { class: this.css.attachmentEditor },
                this.attachmentEditor
              )),
              this._attachmentEditor.startup());
          },
          _setCurrentLInfo: function(a) {
            var b = this._currentLInfo ? this._currentLInfo.featureLayer : null,
              c = a.featureLayer;
            if (
              b &&
              b.id === c.id &&
              !b.ownershipBasedAccessControlForFeatures &&
              ((b = c.getEditCapabilities()), !b.canCreate || b.canUpdate)
            )
              return;
            this._currentLInfo = a;
            this._createTable();
          },
          _updateSelection: function(a, b) {
            this._selection = a || [];
            u.forEach(this._layerInfos, this._getSelection, this);
            this._selection = C.sortFeaturesById(
              this._layerInfos,
              this._selection
            );
            this._numFeatures = this._selection.length;
            this._showFeature(
              this._numFeatures ? this._selection[this._featureIdx] : null,
              b
            );
          },
          _getSelection: function(a) {
            a = a.featureLayer.getSelectedFeatures();
            this._selection = this._selection.concat(a);
          },
          _updateUI: function() {
            var a = this._numFeatures,
              b = this._currentLInfo;
            this.layerName.innerHTML =
              b && 0 !== a
                ? b.featureLayer
                  ? b.featureLayer.name
                  : ""
                : this.NLS_noFeaturesSelected;
            d.set(this.attributeTable, "display", a ? "" : "none");
            d.set(this.editButtons, "display", a ? "" : "none");
            d.set(
              this.navButtons,
              "display",
              !this._hideNavButtons && 1 < a ? "" : "none"
            );
            this.navMessage.innerHTML = x.substitute(
              {
                idx: this._featureIdx + 1,
                of: this.NLS_of,
                numFeatures: this._numFeatures
              },
              this._navMessage
            );
            this._attachmentEditor &&
              d.set(
                this._attachmentEditor.domNode,
                "display",
                b && b.showAttachments && a ? "" : "none"
              );
            d.set(
              this.deleteBtn.domNode,
              "display",
              (b && !1 === b.showDeleteButton) || !this._canDelete ? "none" : ""
            );
            this.domNode.parentNode &&
              0 < this.domNode.parentNode.scrollTop &&
              (this.domNode.parentNode.scrollTop = 0);
          },
          _onNextFeature: function(a) {
            this._featureIdx += a;
            0 > this._featureIdx
              ? (this._featureIdx = this._numFeatures - 1)
              : this._featureIdx >= this._numFeatures && (this._featureIdx = 0);
            a = this._selection.length
              ? this._selection[this._featureIdx]
              : null;
            this._showFeature(a);
            this._updateUI();
            this.onNext(a);
          },
          _deleteFeature: function() {
            this.onDelete(this._currentFeature);
          },
          _showFeature: function(a, c) {
            if (a) {
              this._currentFeature = a;
              c = c ? c : a.getLayer();
              var e = c.getEditCapabilities({
                feature: a,
                userId: this._userIds[c.id]
              });
              this._canUpdate = e.canUpdate;
              this._canDelete = e.canDelete;
              if ((e = this._getLInfoFromFeatureLayer(c))) {
                this._setCurrentLInfo(e);
                var g = a.attributes,
                  d = this._findFirst(e.types, "id", g[e.typeIdField]),
                  k = null;
                u.forEach(
                  e.fieldInfos,
                  function(a) {
                    k = a.field;
                    var b = [];
                    a.dijit && 1 < a.dijit.length
                      ? u.forEach(a.dijit, function(a) {
                          b.push(a);
                        })
                      : b.push(a.dijit);
                    u.forEach(
                      b,
                      q.hitch(this, function(a) {
                        if (a) {
                          var b = this._setFieldDomain(a, d, k),
                            c = g[k.name],
                            c =
                              c && b && b.codedValues && b.codedValues.length
                                ? b.codedValues[c]
                                  ? b.codedValues[c].name
                                  : c
                                : c;
                          x.isDefined(c) || (c = "");
                          "dijit.form.DateTextBox" === a.declaredClass ||
                          "dijit.form.TimeTextBox" === a.declaredClass
                            ? (c = "" === c ? null : new Date(c))
                            : "dijit.form.FilteringSelect" ===
                                a.declaredClass &&
                              ((a._lastValueReported = null),
                              (c = g[k.name] + ""));
                          try {
                            this._setValue(a, c),
                              "dijit.form.FilteringSelect" ===
                                a.declaredClass &&
                                !1 === a.isValid() &&
                                this._setValue(a, null);
                          } catch (fa) {
                            a.set("displayedValue", this.NLS_errorInvalid, !1);
                          }
                        }
                      })
                    );
                  },
                  this
                );
                this._attachmentEditor &&
                  e.showAttachments &&
                  this._attachmentEditor.showAttachments(
                    this._currentFeature,
                    c
                  );
                (a = c.getEditSummary(a))
                  ? ((this.editorTrackingInfoDiv.innerHTML = a),
                    b.show(this.editorTrackingInfoDiv))
                  : b.hide(this.editorTrackingInfoDiv);
              }
            }
          },
          _setFieldDomain: function(b, c, e) {
            if (!b) return null;
            var g = e.domain;
            c &&
              c.domains &&
              c.domains[e.name] &&
              !1 === c.domains[e.name] instanceof a &&
              (g = c.domains[e.name]);
            if (!g) return null;
            g.codedValues && 0 < g.codedValues.length
              ? (b.set(
                  "store",
                  this._toStore(
                    u.map(g.codedValues, function(a) {
                      return { id: (a.code += ""), name: a.name };
                    })
                  )
                ),
                this._setValue(b, g.codedValues[0].code))
              : ((b.constraints = {
                  min: x.isDefined(g.minValue) ? g.minValue : Number.MIN_VALUE,
                  max: x.isDefined(g.maxValue) ? g.maxValue : Number.MAX_VALUE
                }),
                this._setValue(b, b.constraints.min));
            return g;
          },
          _setValue: function(a, b) {
            a.set &&
              ((a._onChangeActive = !1),
              a.set("value", b, !0),
              (a._onChangeActive = !0));
          },
          _getFields: function(a) {
            var b = a._getOutFields();
            if (!b) return null;
            a = a.fields;
            return "*" == b
              ? a
              : u.filter(
                  u.map(b, q.hitch(this, "_findFirst", a, "name")),
                  x.isDefined
                );
          },
          _isInFields: function(a, b) {
            return a && (b || b.length)
              ? u.some(b, function(b) {
                  return b.toLowerCase() === a.toLowerCase();
                })
              : !1;
          },
          _isFieldNullable: function(a, b) {
            return !(!1 === a.nullable || (b.field && !1 === b.field.nullable));
          },
          _isFieldRequired: function(a, b) {
            return (
              !1 !== a.editable &&
              !1 !== b.isEditable &&
              !this._isFieldNullable(a, b)
            );
          },
          _findFirst: function(a, b, c) {
            return (a = u.filter(a, function(a) {
              return a.hasOwnProperty(b) && a[b] === c;
            })) && a.length
              ? a[0]
              : null;
          },
          _getLInfoFromFeatureLayer: function(a) {
            return this._findFirst(
              this._layerInfos,
              "layerId",
              a ? a.id : null
            );
          },
          _createTable: function() {
            this._destroyAttributeTable();
            this.attributeTable.innerHTML = "";
            this._attributes = t.create(
              "table",
              { cellspacing: "0", cellpadding: "0" },
              this.attributeTable
            );
            var a = t.create("tbody", null, this._attributes),
              b = this._currentLInfo,
              c = this._findFirst(
                b.types,
                "id",
                this._currentFeature.attributes[b.typeIdField]
              );
            u.forEach(b.fieldInfos, q.hitch(this, "_createField", c, a), this);
            this._createOnlyFirstTime = !1;
          },
          _createField: function(a, b, c) {
            var e = this._currentLInfo,
              g = c.field;
            if (
              !this._isInFields(g.name, e.hideFields) &&
              !this._isInFields(
                g.name,
                this._editorTrackingInfos[e.featureLayer.id]
              )
            ) {
              var d = !1,
                k,
                f,
                y;
              b = t.create("tr", null, b);
              k = t.create(
                "td",
                {
                  innerHTML: c.label || g.alias || g.name,
                  class: this.css.label,
                  "data-fieldname": g.name
                },
                b
              );
              this._isFieldRequired(g, c) &&
                t.create("span", { class: this.css.red, innerHTML: " *" }, k);
              b = t.create("td", null, b);
              if (c.customField)
                t.place(
                  c.customField.domNode || c.customField,
                  t.create("div", null, b),
                  "first"
                ),
                  (f = c.customField);
              else if (
                !1 === e.isEditable ||
                !1 === g.editable ||
                !1 === c.isEditable ||
                "esriFieldTypeOID" === g.type ||
                "esriFieldTypeGlobalID" === g.type ||
                (!this._canUpdate && !this._createOnlyFirstTime)
              )
                d = !0;
              e =
                e.typeIdField &&
                g.name.toLowerCase() == e.typeIdField.toLowerCase();
              k = !!this._getDomainForField(g, a);
              !f && e
                ? (f = this._createTypeField(g, c, b))
                : !f && k && (f = this._createDomainField(g, c, a, b));
              if (!f)
                switch (g.type) {
                  case "esriFieldTypeString":
                    f = this._createStringField(g, c, b);
                    break;
                  case "esriFieldTypeDate":
                    f = this._createDateField(g, c, b);
                    c.format &&
                      c.format.time &&
                      (y = this._createTimeField(g, c, b));
                    break;
                  case "esriFieldTypeInteger":
                  case "esriFieldTypeSmallInteger":
                    f = this._createIntField(g, c, b);
                    break;
                  case "esriFieldTypeSingle":
                  case "esriFieldTypeDouble":
                    f = this._createFltField(g, c, b);
                    break;
                  default:
                    f = this._createStringField(g, c, b);
                }
              c.tooltip &&
                c.tooltip.length &&
                this._toolTips.push(
                  new K({ connectId: [f.id], label: c.tooltip })
                );
              f.onChange = q.hitch(this, "onFieldValueChange", c);
              f.set("disabled", d);
              y
                ? ((c.dijit = [f, y]),
                  (y.onChange = q.hitch(this, "onFieldValueChange", c)),
                  y.set("disabled", d))
                : (c.dijit = f);
            }
          },
          _createTypeField: function(a, b, c) {
            c = t.create("div", null, c);
            var e = a.domain;
            return e && "range" === e.type && e.minValue === e.maxValue
              ? new I(
                  {
                    class: this.css.field,
                    trim: !0,
                    maxLength: a.length,
                    name: a.alias || a.name,
                    required: this._isFieldRequired(a, b)
                  },
                  c
                )
              : new H(
                  {
                    class: this.css.field,
                    name: a.alias || a.name,
                    required: this._isFieldRequired(a, b),
                    store: this._toStore(
                      u.map(this._currentLInfo.types, function(a) {
                        return { id: a.id, name: a.name };
                      })
                    ),
                    searchAttr: "name"
                  },
                  c
                );
          },
          _getDomainForField: function(b, c) {
            var e = b.domain;
            (b = b.name) &&
              c &&
              c.domains &&
              c.domains[b] &&
              !1 === c.domains[b] instanceof a &&
              (e = c.domains[b]);
            return e || null;
          },
          _createDomainField: function(a, b, c, e) {
            c = this._getDomainForField(a, c);
            e = t.create("div", null, e);
            return c.codedValues
              ? new H(
                  {
                    class: this.css.field,
                    name: a.alias || a.name,
                    searchAttr: "name",
                    required: this._isFieldRequired(a, b)
                  },
                  e
                )
              : new y({ class: this.css.field }, e);
          },
          _createStringField: function(a, b, c) {
            c = t.create("div", null, c);
            var e = {
              trim: !0,
              maxLength: a.length,
              required: this._isFieldRequired(a, b)
            };
            if (b.stringFieldOption === U.STRING_FIELD_OPTION_TEXTAREA)
              return (
                (e["class"] = this.css.field + " " + this.css.textArea),
                new Z(e, c)
              );
            if (b.stringFieldOption === U.STRING_FIELD_OPTION_RICHTEXT)
              return (
                (e["class"] = this.css.field + " " + this.css.richText),
                (e.height = "100%"),
                (e.width = "100%"),
                (e.plugins = b.richTextPlugins || this._defaultRichTextPlugins),
                (c = new D(e, c)),
                c.startup(),
                c
              );
            var g = this;
            e.validator = function(c, e) {
              this._maskValidSubsetError = !1;
              this._hasBeenBlurred = !0;
              return g._isFieldNullable(a, b) || !("" === c || null === c);
            };
            return new I(e, c);
          },
          _createTimeField: function(a, b, c) {
            c = t.create("div", null, c);
            a = {
              class: this.css.field,
              trim: !0,
              required: this._isFieldRequired(a, b),
              constraints: { formatLength: "medium" }
            };
            this._datePackage && (a.datePackage = this._datePackage);
            return new z(a, c);
          },
          _createDateField: function(a, b, c) {
            c = t.create("div", null, c);
            a = {
              class: this.css.field,
              trim: !0,
              required: this._isFieldRequired(a, b)
            };
            this._datePackage && (a.datePackage = this._datePackage);
            return new R(a, c);
          },
          _createIntField: function(a, b, c) {
            c = t.create("div", null, c);
            return new O(
              {
                class: this.css.field,
                constraints:
                  "esriFieldTypeSmallInteger" === a.type
                    ? { min: -32768, max: 32767, places: 0 }
                    : { places: 0 },
                trim: !0,
                invalidMessage: this.NLS_validationInt,
                required: this._isFieldRequired(a, b)
              },
              c
            );
          },
          _createFltField: function(a, b, c) {
            c = t.create("div", null, c);
            return new O(
              {
                class: this.css.field,
                constraints: { max: Infinity, min: -Infinity, places: "0,20" },
                trim: !0,
                invalidMessage: this.NLS_validationFlt,
                required: this._isFieldRequired(a, b)
              },
              c
            );
          },
          _toStore: function(a) {
            return new P({
              data: { identifier: "id", label: "name", items: a }
            });
          },
          _connect: function(a, b, c) {
            this._aiConnects.push(v.connect(a, b, c));
          },
          _getDatePackage: function(a) {
            return null === a.datePackage
              ? null
              : a.datePackage
              ? a.datePackage
              : "ar" === h.locale
              ? "dojox.date.islamic"
              : null;
          },
          _destroyAttributeTable: function() {
            u.forEach(
              this._layerInfos,
              function(a) {
                u.forEach(
                  a.fieldInfos,
                  function(a) {
                    var b = a.dijit;
                    if (b) {
                      b._onChangeHandle = null;
                      if (a.customField) return;
                      b instanceof Array
                        ? u.forEach(
                            b,
                            q.hitch(this, function(a) {
                              a.destroyRecursive
                                ? a.destroyRecursive()
                                : a.destroy && a.destroy();
                              a._onChangeHandle = null;
                            })
                          )
                        : b.destroyRecursive
                        ? b.destroyRecursive()
                        : b.destroy && b.destroy();
                    }
                    a.dijit = null;
                  },
                  this
                );
              },
              this
            );
            u.forEach(this._toolTips, function(a) {
              a.destroy();
            });
            this._toolTips = [];
            this._attributes && t.destroy(this._attributes);
          }
        });
        q.mixin(U, {
          STRING_FIELD_OPTION_RICHTEXT: "richtext",
          STRING_FIELD_OPTION_TEXTAREA: "textarea",
          STRING_FIELD_OPTION_TEXTBOX: "textbox"
        });
        f("extend-esri") && q.setObject("dijit.AttributeInspector", U, l);
        return U;
      });
    },
    "dijit/Editor": function() {
      define("require dojo/_base/array dojo/_base/declare dojo/Deferred dojo/i18n dojo/dom-attr dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/keys dojo/_base/lang dojo/sniff dojo/string dojo/topic ./_Container ./Toolbar ./ToolbarSeparator ./layout/_LayoutWidget ./form/ToggleButton ./_editor/_Plugin ./_editor/plugins/EnterKeyHandling ./_editor/html ./_editor/range ./_editor/RichText ./main dojo/i18n!./_editor/nls/commands".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F,
        G,
        C
      ) {
        function A(a) {
          return new D({ command: a.name });
        }
        function R(a) {
          return new D({ buttonClass: E, command: a.name });
        }
        u = u("dijit.Editor", G, {
          plugins: null,
          extraPlugins: null,
          constructor: function() {
            x.isArray(this.plugins) ||
              (this.plugins = [
                "undo",
                "redo",
                "|",
                "cut",
                "copy",
                "paste",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "|",
                "insertOrderedList",
                "insertUnorderedList",
                "indent",
                "outdent",
                "|",
                "justifyLeft",
                "justifyRight",
                "justifyCenter",
                "justifyFull",
                w
              ]);
            this._plugins = [];
            this._editInterval = 1e3 * this.editActionInterval;
            if (b("ie") || b("trident") || b("edge"))
              this.events.push("onBeforeDeactivate"),
                this.events.push("onBeforeActivate");
          },
          postMixInProperties: function() {
            this.setValueDeferred = new v();
            this.inherited(arguments);
          },
          postCreate: function() {
            this.inherited(arguments);
            this._steps = this._steps.slice(0);
            this._undoedSteps = this._undoedSteps.slice(0);
            x.isArray(this.extraPlugins) &&
              (this.plugins = this.plugins.concat(this.extraPlugins));
            this.commands = m.getLocalization(
              "dijit._editor",
              "commands",
              this.lang
            );
            b("webkit") && t.set(this.domNode, "KhtmlUserSelect", "none");
          },
          startup: function() {
            this.inherited(arguments);
            this.toolbar ||
              ((this.toolbar = new k({
                ownerDocument: this.ownerDocument,
                dir: this.dir,
                lang: this.lang,
                "aria-label": this.id
              })),
              this.header.appendChild(this.toolbar.domNode));
            q.forEach(this.plugins, this.addPlugin, this);
            this.setValueDeferred.resolve(!0);
            f.add(this.iframe.parentNode, "dijitEditorIFrameContainer");
            f.add(this.iframe, "dijitEditorIFrame");
            h.set(this.iframe, "allowTransparency", !0);
            this.toolbar.startup();
            this.onNormalizedDisplayChanged();
          },
          destroy: function() {
            q.forEach(this._plugins, function(a) {
              a && a.destroy && a.destroy();
            });
            this._plugins = [];
            this.toolbar.destroyRecursive();
            delete this.toolbar;
            this.inherited(arguments);
          },
          addPlugin: function(a, b) {
            var c = x.isString(a)
              ? { name: a }
              : x.isFunction(a)
              ? { ctor: a }
              : a;
            if (!c.setEditor) {
              var e = { args: c, plugin: null, editor: this };
              c.name &&
                (D.registry[c.name]
                  ? (e.plugin = D.registry[c.name](c))
                  : n.publish(C._scopeName + ".Editor.getPlugin", e));
              if (!e.plugin)
                try {
                  var g = c.ctor || x.getObject(c.name) || r(c.name);
                  g && (e.plugin = new g(c));
                } catch (Z) {
                  throw Error(
                    this.id + ": cannot find plugin [" + c.name + "]"
                  );
                }
              if (!e.plugin)
                throw Error(this.id + ": cannot find plugin [" + c.name + "]");
              a = e.plugin;
            }
            1 < arguments.length
              ? (this._plugins[b] = a)
              : this._plugins.push(a);
            a.setEditor(this);
            x.isFunction(a.setToolbar) && a.setToolbar(this.toolbar);
          },
          resize: function(a) {
            a && e.prototype.resize.apply(this, arguments);
          },
          layout: function() {
            var a =
              this._contentBox.h -
              (this.getHeaderHeight() +
                this.getFooterHeight() +
                d.getPadBorderExtents(this.iframe.parentNode).h +
                d.getMarginExtents(this.iframe.parentNode).h);
            this.editingArea.style.height = a + "px";
            this.iframe && (this.iframe.style.height = "100%");
            this._layoutMode = !0;
          },
          _onIEMouseDown: function(a) {
            var b,
              c = this.document.body,
              e = c.clientWidth,
              g = c.clientHeight,
              d = c.clientLeft,
              k = c.offsetWidth,
              f = c.offsetHeight,
              n = c.offsetLeft;
            /^rtl$/i.test(c.dir || "")
              ? e < k && a.x > e && a.x < k && (b = !0)
              : a.x < d && a.x > n && (b = !0);
            b || (g < f && a.y > g && a.y < f && (b = !0));
            b ||
              (delete this._cursorToStart,
              delete this._savedSelection,
              "BODY" == a.target.tagName && this.defer("placeCursorAtEnd"),
              this.inherited(arguments));
          },
          onBeforeActivate: function() {
            this._restoreSelection();
          },
          onBeforeDeactivate: function(a) {
            this.customUndo && this.endEditing(!0);
            "BODY" != a.target.tagName && this._saveSelection();
          },
          customUndo: !0,
          editActionInterval: 3,
          beginEditing: function(a) {
            this._inEditing || ((this._inEditing = !0), this._beginEditing(a));
            0 < this.editActionInterval &&
              (this._editTimer && this._editTimer.remove(),
              (this._editTimer = this.defer("endEditing", this._editInterval)));
          },
          _steps: [],
          _undoedSteps: [],
          execCommand: function(a) {
            if (!this.customUndo || ("undo" != a && "redo" != a)) {
              this.customUndo && (this.endEditing(), this._beginEditing());
              var b = this.inherited(arguments);
              this.customUndo && this._endEditing();
              return b;
            }
            return this[a]();
          },
          _pasteImpl: function() {
            return this._clipboardCommand("paste");
          },
          _cutImpl: function() {
            return this._clipboardCommand("cut");
          },
          _copyImpl: function() {
            return this._clipboardCommand("copy");
          },
          _clipboardCommand: function(c) {
            var e;
            try {
              if (
                ((e = this.document.execCommand(c, !1, null)),
                b("webkit") && !e)
              )
                throw {};
            } catch (H) {
              (e = a.substitute),
                alert(
                  e(this.commands.systemShortcut, [
                    this.commands[c],
                    e(this.commands[b("mac") ? "appleKey" : "ctrlKey"], [
                      { cut: "X", copy: "C", paste: "V" }[c]
                    ])
                  ])
                ),
                (e = !1);
            }
            return e;
          },
          queryCommandEnabled: function(a) {
            return !this.customUndo || ("undo" != a && "redo" != a)
              ? this.inherited(arguments)
              : "undo" == a
              ? 1 < this._steps.length
              : 0 < this._undoedSteps.length;
          },
          _moveToBookmark: function(a) {
            var c = a.mark,
              e = a.mark;
            a = a.isCollapsed;
            var g, d, k;
            e &&
              (9 > b("ie") || (9 === b("ie") && b("quirks"))
                ? x.isArray(e)
                  ? ((c = []),
                    q.forEach(
                      e,
                      function(a) {
                        c.push(F.getNode(a, this.editNode));
                      },
                      this
                    ),
                    this.selection.moveToBookmark({ mark: c, isCollapsed: a }))
                  : e.startContainer &&
                    e.endContainer &&
                    (k = F.getSelection(this.window)) &&
                    k.removeAllRanges &&
                    (k.removeAllRanges(),
                    (a = F.create(this.window)),
                    (g = F.getNode(e.startContainer, this.editNode)),
                    (d = F.getNode(e.endContainer, this.editNode)),
                    g &&
                      d &&
                      (a.setStart(g, e.startOffset),
                      a.setEnd(d, e.endOffset),
                      k.addRange(a)))
                : (k = F.getSelection(this.window)) &&
                  k.removeAllRanges &&
                  (k.removeAllRanges(),
                  (a = F.create(this.window)),
                  (g = F.getNode(e.startContainer, this.editNode)),
                  (d = F.getNode(e.endContainer, this.editNode)),
                  g &&
                    d &&
                    (a.setStart(g, e.startOffset),
                    a.setEnd(d, e.endOffset),
                    k.addRange(a))));
          },
          _changeToStep: function(a, b) {
            this.setValue(b.text);
            (a = b.bookmark) && this._moveToBookmark(a);
          },
          undo: function() {
            var a = !1;
            if (!this._undoRedoActive) {
              this._undoRedoActive = !0;
              this.endEditing(!0);
              var b = this._steps.pop();
              b &&
                0 < this._steps.length &&
                (this.focus(),
                this._changeToStep(b, this._steps[this._steps.length - 1]),
                this._undoedSteps.push(b),
                this.onDisplayChanged(),
                delete this._undoRedoActive,
                (a = !0));
              delete this._undoRedoActive;
            }
            return a;
          },
          redo: function() {
            var a = !1;
            if (!this._undoRedoActive) {
              this._undoRedoActive = !0;
              this.endEditing(!0);
              var b = this._undoedSteps.pop();
              b &&
                0 < this._steps.length &&
                (this.focus(),
                this._changeToStep(this._steps[this._steps.length - 1], b),
                this._steps.push(b),
                this.onDisplayChanged(),
                (a = !0));
              delete this._undoRedoActive;
            }
            return a;
          },
          endEditing: function(a) {
            this._editTimer && (this._editTimer = this._editTimer.remove());
            this._inEditing && (this._endEditing(a), (this._inEditing = !1));
          },
          _getBookmark: function() {
            var a = this.selection.getBookmark(),
              c = [];
            if (a && a.mark) {
              var e = a.mark;
              if (9 > b("ie") || (9 === b("ie") && b("quirks"))) {
                var g = F.getSelection(this.window);
                if (x.isArray(e))
                  q.forEach(
                    a.mark,
                    function(a) {
                      c.push(F.getIndex(a, this.editNode).o);
                    },
                    this
                  ),
                    (a.mark = c);
                else if (g) {
                  var d;
                  g.rangeCount && (d = g.getRangeAt(0));
                  a.mark = d ? d.cloneRange() : this.selection.getBookmark();
                }
              }
              try {
                a.mark &&
                  a.mark.startContainer &&
                  ((c = F.getIndex(a.mark.startContainer, this.editNode).o),
                  (a.mark = {
                    startContainer: c,
                    startOffset: a.mark.startOffset,
                    endContainer:
                      a.mark.endContainer === a.mark.startContainer
                        ? c
                        : F.getIndex(a.mark.endContainer, this.editNode).o,
                    endOffset: a.mark.endOffset
                  }));
              } catch (Z) {
                a.mark = null;
              }
            }
            return a;
          },
          _beginEditing: function() {
            0 === this._steps.length &&
              this._steps.push({
                text: B.getChildrenHtml(this.editNode),
                bookmark: this._getBookmark()
              });
          },
          _endEditing: function() {
            var a = B.getChildrenHtml(this.editNode);
            this._undoedSteps = [];
            this._steps.push({ text: a, bookmark: this._getBookmark() });
          },
          onKeyDown: function(a) {
            b("ie") ||
              this.iframe ||
              a.keyCode != l.TAB ||
              this.tabIndent ||
              this._saveSelection();
            if (this.customUndo) {
              var c = a.keyCode;
              if (a.ctrlKey && !a.shiftKey && !a.altKey) {
                if (90 == c || 122 == c) {
                  a.stopPropagation();
                  a.preventDefault();
                  this.undo();
                  return;
                }
                if (89 == c || 121 == c) {
                  a.stopPropagation();
                  a.preventDefault();
                  this.redo();
                  return;
                }
              }
              this.inherited(arguments);
              switch (c) {
                case l.ENTER:
                case l.BACKSPACE:
                case l.DELETE:
                  this.beginEditing();
                  break;
                case 88:
                case 86:
                  if (a.ctrlKey && !a.altKey && !a.metaKey) {
                    this.endEditing();
                    88 == a.keyCode
                      ? this.beginEditing("cut")
                      : this.beginEditing("paste");
                    this.defer("endEditing", 1);
                    break;
                  }
                default:
                  if (
                    !a.ctrlKey &&
                    !a.altKey &&
                    !a.metaKey &&
                    (a.keyCode < l.F1 || a.keyCode > l.F15)
                  ) {
                    this.beginEditing();
                    break;
                  }
                case l.ALT:
                  this.endEditing();
                  break;
                case l.UP_ARROW:
                case l.DOWN_ARROW:
                case l.LEFT_ARROW:
                case l.RIGHT_ARROW:
                case l.HOME:
                case l.END:
                case l.PAGE_UP:
                case l.PAGE_DOWN:
                  this.endEditing(!0);
                case l.CTRL:
                case l.SHIFT:
                case l.TAB:
              }
            } else this.inherited(arguments);
          },
          _onBlur: function() {
            this.inherited(arguments);
            this.endEditing(!0);
          },
          _saveSelection: function() {
            try {
              this._savedSelection = this._getBookmark();
            } catch (J) {}
          },
          _restoreSelection: function() {
            this._savedSelection &&
              (delete this._cursorToStart,
              this.selection.isCollapsed() &&
                this._moveToBookmark(this._savedSelection),
              delete this._savedSelection);
          },
          onClick: function() {
            this.endEditing(!0);
            this.inherited(arguments);
          },
          replaceValue: function(a) {
            this.customUndo
              ? this.isClosed
                ? this.setValue(a)
                : (this.beginEditing(),
                  a || (a = "\x26#160;"),
                  this.setValue(a),
                  this.endEditing())
              : this.inherited(arguments);
          },
          _setDisabledAttr: function(a) {
            this.setValueDeferred.then(
              x.hitch(this, function() {
                (!this.disabled && a) || (!this._buttonEnabledPlugins && a)
                  ? q.forEach(this._plugins, function(a) {
                      a.set("disabled", !0);
                    })
                  : this.disabled &&
                    !a &&
                    q.forEach(this._plugins, function(a) {
                      a.set("disabled", !1);
                    });
              })
            );
            this.inherited(arguments);
          },
          _setStateClass: function() {
            try {
              this.inherited(arguments),
                this.document &&
                  this.document.body &&
                  (t.set(
                    this.document.body,
                    "color",
                    t.get(this.iframe, "color")
                  ),
                  t.set(
                    this.document.body,
                    "background-color",
                    t.get(this.iframe, "background-color")
                  ));
            } catch (J) {}
          }
        });
        x.mixin(D.registry, {
          undo: A,
          redo: A,
          cut: A,
          copy: A,
          paste: A,
          insertOrderedList: A,
          insertUnorderedList: A,
          indent: A,
          outdent: A,
          justifyCenter: A,
          justifyFull: A,
          justifyLeft: A,
          justifyRight: A,
          delete: A,
          selectAll: A,
          removeFormat: A,
          unlink: A,
          insertHorizontalRule: A,
          bold: R,
          italic: R,
          underline: R,
          strikethrough: R,
          subscript: R,
          superscript: R,
          "|": function() {
            return new D({
              setEditor: function(a) {
                this.editor = a;
                this.button = new g({ ownerDocument: a.ownerDocument });
              }
            });
          }
        });
        return u;
      });
    },
    "dijit/Toolbar": function() {
      define("require dojo/_base/declare dojo/has dojo/keys dojo/ready ./_Widget ./_KeyNavContainer ./_TemplatedMixin".split(
        " "
      ), function(r, q, u, v, m, h, f, d) {
        u("dijit-legacy-requires") &&
          m(0, function() {
            r(["dijit/ToolbarSeparator"]);
          });
        return q("dijit.Toolbar", [h, d, f], {
          templateString:
            '\x3cdiv class\x3d"dijit" role\x3d"toolbar" tabIndex\x3d"${tabIndex}" data-dojo-attach-point\x3d"containerNode"\x3e\x3c/div\x3e',
          baseClass: "dijitToolbar",
          _onLeftArrow: function() {
            this.focusPrev();
          },
          _onRightArrow: function() {
            this.focusNext();
          }
        });
      });
    },
    "dijit/ToolbarSeparator": function() {
      define([
        "dojo/_base/declare",
        "dojo/dom",
        "./_Widget",
        "./_TemplatedMixin"
      ], function(r, q, u, v) {
        return r("dijit.ToolbarSeparator", [u, v], {
          templateString:
            '\x3cdiv class\x3d"dijitToolbarSeparator dijitInline" role\x3d"presentation"\x3e\x3c/div\x3e',
          buildRendering: function() {
            this.inherited(arguments);
            q.setSelectable(this.domNode, !1);
          },
          isFocusable: function() {
            return !1;
          }
        });
      });
    },
    "dijit/_editor/_Plugin": function() {
      define([
        "dojo/_base/connect",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "../Destroyable",
        "../form/Button"
      ], function(r, q, u, v, m) {
        q = q("dijit._editor._Plugin", v, {
          constructor: function(h) {
            this.params = h || {};
            u.mixin(this, this.params);
            this._attrPairNames = {};
          },
          editor: null,
          iconClassPrefix: "dijitEditorIcon",
          button: null,
          command: "",
          useDefaultCommand: !0,
          buttonClass: m,
          disabled: !1,
          getLabel: function(h) {
            return this.editor.commands[h];
          },
          _initButton: function() {
            if (this.command.length) {
              var h = this.getLabel(this.command),
                f = this.editor,
                d =
                  this.iconClassPrefix +
                  " " +
                  this.iconClassPrefix +
                  this.command.charAt(0).toUpperCase() +
                  this.command.substr(1);
              this.button ||
                ((h = u.mixin(
                  {
                    label: h,
                    ownerDocument: f.ownerDocument,
                    dir: f.dir,
                    lang: f.lang,
                    showLabel: !1,
                    iconClass: d,
                    dropDown: this.dropDown,
                    tabIndex: "-1"
                  },
                  this.params || {}
                )),
                delete h.name,
                (this.button = new this.buttonClass(h)));
            }
            this.get("disabled") &&
              this.button &&
              this.button.set("disabled", this.get("disabled"));
          },
          destroy: function() {
            this.dropDown && this.dropDown.destroyRecursive();
            this.inherited(arguments);
          },
          connect: function(h, f, d) {
            this.own(r.connect(h, f, this, d));
          },
          updateState: function() {
            var h = this.editor,
              f = this.command,
              d,
              t;
            if (h && h.isLoaded && f.length) {
              var l = this.get("disabled");
              if (this.button)
                try {
                  var q = h._implCommand(f);
                  t = !l && (this[q] ? this[q](f) : h.queryCommandEnabled(f));
                  this.enabled !== t &&
                    ((this.enabled = t), this.button.set("disabled", !t));
                  t &&
                    "boolean" == typeof this.button.checked &&
                    ((d = h.queryCommandState(f)),
                    this.checked !== d &&
                      ((this.checked = d),
                      this.button.set("checked", h.queryCommandState(f))));
                } catch (b) {
                  console.log(b);
                }
            }
          },
          setEditor: function(h) {
            this.editor = h;
            this._initButton();
            this.button &&
              this.useDefaultCommand &&
              (this.editor.queryCommandAvailable(this.command)
                ? this.own(
                    this.button.on(
                      "click",
                      u.hitch(
                        this.editor,
                        "execCommand",
                        this.command,
                        this.commandArg
                      )
                    )
                  )
                : (this.button.domNode.style.display = "none"));
            this.own(
              this.editor.on(
                "NormalizedDisplayChanged",
                u.hitch(this, "updateState")
              )
            );
          },
          setToolbar: function(h) {
            this.button && h.addChild(this.button);
          },
          set: function(h, f) {
            if ("object" === typeof h) {
              for (var d in h) this.set(d, h[d]);
              return this;
            }
            d = this._getAttrNames(h);
            if (this[d.s])
              var t = this[d.s].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
              );
            else this._set(h, f);
            return t || this;
          },
          get: function(h) {
            var f = this._getAttrNames(h);
            return this[f.g] ? this[f.g]() : this[h];
          },
          _setDisabledAttr: function(h) {
            this._set("disabled", h);
            this.updateState();
          },
          _getAttrNames: function(h) {
            var f = this._attrPairNames;
            if (f[h]) return f[h];
            var d = h.charAt(0).toUpperCase() + h.substr(1);
            return (f[h] = { s: "_set" + d + "Attr", g: "_get" + d + "Attr" });
          },
          _set: function(h, f) {
            this[h] = f;
          }
        });
        q.registry = {};
        return q;
      });
    },
    "dijit/_editor/plugins/EnterKeyHandling": function() {
      define("dojo/_base/declare dojo/dom-construct dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/_base/window dojo/window ../_Plugin ../RichText ../range".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x) {
        return r("dijit._editor.plugins.EnterKeyHandling", t, {
          blockNodeForEnter: "BR",
          constructor: function(b) {
            b &&
              ("blockNodeForEnter" in b &&
                (b.blockNodeForEnter = b.blockNodeForEnter.toUpperCase()),
              v.mixin(this, b));
          },
          setEditor: function(b) {
            if (this.editor !== b)
              if (((this.editor = b), "BR" == this.blockNodeForEnter))
                (this.editor.customUndo = !0),
                  b.onLoadDeferred.then(
                    v.hitch(this, function(a) {
                      this.own(
                        m(
                          b.document,
                          "keydown",
                          v.hitch(this, function(a) {
                            if (a.keyCode == u.ENTER) {
                              var b = v.mixin({}, a);
                              b.shiftKey = !0;
                              this.handleEnterKey(b) ||
                                (a.stopPropagation(), a.preventDefault());
                            }
                          })
                        )
                      );
                      9 <= h("ie") &&
                        10 >= h("ie") &&
                        this.own(
                          m(
                            b.document,
                            "paste",
                            v.hitch(this, function(a) {
                              setTimeout(
                                v.hitch(this, function() {
                                  var a = this.editor.document.selection.createRange();
                                  a.move("character", -1);
                                  a.select();
                                  a.move("character", 1);
                                  a.select();
                                }),
                                0
                              );
                            })
                          )
                        );
                      return a;
                    })
                  );
              else if (this.blockNodeForEnter) {
                var a = v.hitch(this, "handleEnterKey");
                b.addKeyHandler(13, 0, 0, a);
                b.addKeyHandler(13, 0, 1, a);
                this.own(
                  this.editor.on("KeyPressed", v.hitch(this, "onKeyPressed"))
                );
              }
          },
          onKeyPressed: function() {
            if (this._checkListLater) {
              if (this.editor.selection.isCollapsed()) {
                var b = this.editor.selection.getAncestorElement("LI");
                if (b) {
                  h("mozilla") &&
                    "LI" == b.parentNode.parentNode.nodeName &&
                    (b = b.parentNode.parentNode);
                  var a = b.firstChild;
                  !a ||
                    1 != a.nodeType ||
                    ("UL" != a.nodeName && "OL" != a.nodeName) ||
                    (b.insertBefore(
                      a.ownerDocument.createTextNode("\u00a0"),
                      a
                    ),
                    (a = x.create(this.editor.window)),
                    a.setStart(b.firstChild, 0),
                    (b = x.getSelection(this.editor.window, !0)),
                    b.removeAllRanges(),
                    b.addRange(a));
                } else
                  l.prototype.execCommand.call(
                    this.editor,
                    "formatblock",
                    this.blockNodeForEnter
                  ),
                    (b = this.editor.selection.getAncestorElement(
                      this.blockNodeForEnter
                    ))
                      ? ((b.innerHTML = this.bogusHtmlContent),
                        9 >= h("ie") &&
                          ((b = this.editor.document.selection.createRange()),
                          b.move("character", -1),
                          b.select()))
                      : console.error(
                          "onKeyPressed: Cannot find the new block node"
                        );
              }
              this._checkListLater = !1;
            }
            this._pressedEnterInBlock &&
              (this._pressedEnterInBlock.previousSibling &&
                this.removeTrailingBr(
                  this._pressedEnterInBlock.previousSibling
                ),
              delete this._pressedEnterInBlock);
          },
          bogusHtmlContent: "\x26#160;",
          blockNodes: /^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,
          handleEnterKey: function(b) {
            var a,
              f,
              c,
              k,
              g = this.editor.document,
              e,
              t,
              m;
            if (b.shiftKey) {
              b = this.editor.selection.getParentElement();
              if ((k = x.getAncestor(b, this.blockNodes))) {
                if ("LI" == k.tagName) return !0;
                b = x.getSelection(this.editor.window);
                a = b.getRangeAt(0);
                a.collapsed ||
                  (a.deleteContents(),
                  (b = x.getSelection(this.editor.window)),
                  (a = b.getRangeAt(0)));
                if (
                  x.atBeginningOfContainer(k, a.startContainer, a.startOffset)
                )
                  (e = g.createElement("br")),
                    (a = x.create(this.editor.window)),
                    k.insertBefore(e, k.firstChild),
                    a.setStartAfter(e),
                    b.removeAllRanges(),
                    b.addRange(a);
                else if (x.atEndOfContainer(k, a.startContainer, a.startOffset))
                  (a = x.create(this.editor.window)),
                    (e = g.createElement("br")),
                    k.appendChild(e),
                    k.appendChild(g.createTextNode("\u00a0")),
                    a.setStart(k.lastChild, 0),
                    b.removeAllRanges(),
                    b.addRange(a);
                else
                  return (t = a.startContainer) && 3 == t.nodeType
                    ? ((m = t.nodeValue),
                      (f = g.createTextNode(m.substring(0, a.startOffset))),
                      (c = g.createTextNode(m.substring(a.startOffset))),
                      (k = g.createElement("br")),
                      "" == c.nodeValue &&
                        h("webkit") &&
                        (c = g.createTextNode("\u00a0")),
                      q.place(f, t, "after"),
                      q.place(k, f, "after"),
                      q.place(c, k, "after"),
                      q.destroy(t),
                      (a = x.create(this.editor.window)),
                      a.setStart(c, 0),
                      b.removeAllRanges(),
                      b.addRange(a),
                      !1)
                    : !0;
              } else
                (b = x.getSelection(this.editor.window)),
                  b.rangeCount
                    ? (a = b.getRangeAt(0)) &&
                      a.startContainer &&
                      (a.collapsed ||
                        (a.deleteContents(),
                        (b = x.getSelection(this.editor.window)),
                        (a = b.getRangeAt(0))),
                      (t = a.startContainer) && 3 == t.nodeType
                        ? ((k = a.startOffset),
                          t.length < k &&
                            ((c = this._adjustNodeAndOffset(t, k)),
                            (t = c.node),
                            (k = c.offset)),
                          (m = t.nodeValue),
                          (f = g.createTextNode(m.substring(0, k))),
                          (c = g.createTextNode(m.substring(k))),
                          (k = g.createElement("br")),
                          c.length || (c = g.createTextNode("\u00a0")),
                          f.length ? q.place(f, t, "after") : (f = t),
                          q.place(k, f, "after"),
                          q.place(c, k, "after"),
                          q.destroy(t))
                        : (0 <= a.startOffset &&
                            (e = t.childNodes[a.startOffset]),
                          (k = g.createElement("br")),
                          (c = g.createTextNode("\u00a0")),
                          e
                            ? (q.place(k, e, "before"), q.place(c, k, "after"))
                            : (t.appendChild(k), t.appendChild(c))),
                      (a = x.create(this.editor.window)),
                      a.setStart(c, 0),
                      a.setEnd(c, c.length),
                      b.removeAllRanges(),
                      b.addRange(a),
                      this.editor.selection.collapse(!0))
                    : l.prototype.execCommand.call(
                        this.editor,
                        "inserthtml",
                        "\x3cbr\x3e"
                      );
              return !1;
            }
            var w = !0;
            b = x.getSelection(this.editor.window);
            a = b.getRangeAt(0);
            a.collapsed ||
              (a.deleteContents(),
              (b = x.getSelection(this.editor.window)),
              (a = b.getRangeAt(0)));
            e = x.getBlockAncestor(a.endContainer, null, this.editor.editNode);
            var r = e.blockNode;
            if (
              (this._checkListLater =
                r && ("LI" == r.nodeName || "LI" == r.parentNode.nodeName))
            )
              return (
                h("mozilla") && (this._pressedEnterInBlock = r),
                /^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(
                  r.innerHTML
                ) &&
                  ((r.innerHTML = ""),
                  h("webkit") &&
                    ((a = x.create(this.editor.window)),
                    a.setStart(r, 0),
                    b.removeAllRanges(),
                    b.addRange(a)),
                  (this._checkListLater = !1)),
                !0
              );
            if (!e.blockNode || e.blockNode === this.editor.editNode) {
              try {
                l.prototype.execCommand.call(
                  this.editor,
                  "formatblock",
                  this.blockNodeForEnter
                );
              } catch (F) {}
              e = {
                blockNode: this.editor.selection.getAncestorElement(
                  this.blockNodeForEnter
                ),
                blockContainer: this.editor.editNode
              };
              if (e.blockNode) {
                if (
                  e.blockNode != this.editor.editNode &&
                  !(e.blockNode.textContent || e.blockNode.innerHTML).replace(
                    /^\s+|\s+$/g,
                    ""
                  ).length
                )
                  return this.removeTrailingBr(e.blockNode), !1;
              } else e.blockNode = this.editor.editNode;
              b = x.getSelection(this.editor.window);
              a = b.getRangeAt(0);
            }
            r = g.createElement(this.blockNodeForEnter);
            r.innerHTML = this.bogusHtmlContent;
            this.removeTrailingBr(e.blockNode);
            c = a.endOffset;
            w = a.endContainer;
            w.length < c &&
              ((c = this._adjustNodeAndOffset(w, c)),
              (w = c.node),
              (c = c.offset));
            if (x.atEndOfContainer(e.blockNode, w, c))
              e.blockNode === e.blockContainer
                ? e.blockNode.appendChild(r)
                : q.place(r, e.blockNode, "after"),
                (w = !1),
                (a = x.create(this.editor.window)),
                a.setStart(r, 0),
                b.removeAllRanges(),
                b.addRange(a),
                this.editor.height && d.scrollIntoView(r);
            else if (
              x.atBeginningOfContainer(
                e.blockNode,
                a.startContainer,
                a.startOffset
              )
            )
              q.place(
                r,
                e.blockNode,
                e.blockNode === e.blockContainer ? "first" : "before"
              ),
                r.nextSibling &&
                  this.editor.height &&
                  ((a = x.create(this.editor.window)),
                  a.setStart(r.nextSibling, 0),
                  b.removeAllRanges(),
                  b.addRange(a),
                  d.scrollIntoView(r.nextSibling)),
                (w = !1);
            else {
              e.blockNode === e.blockContainer
                ? e.blockNode.appendChild(r)
                : q.place(r, e.blockNode, "after");
              w = !1;
              e.blockNode.style &&
                r.style &&
                e.blockNode.style.cssText &&
                (r.style.cssText = e.blockNode.style.cssText);
              if ((t = a.startContainer) && 3 == t.nodeType) {
                c = a.endOffset;
                t.length < c &&
                  ((c = this._adjustNodeAndOffset(t, c)),
                  (t = c.node),
                  (c = c.offset));
                m = t.nodeValue;
                f = g.createTextNode(m.substring(0, c));
                c = g.createTextNode(m.substring(c, m.length));
                q.place(f, t, "before");
                q.place(c, t, "after");
                q.destroy(t);
                for (a = f.parentNode; a !== e.blockNode; ) {
                  m = g.createElement(a.tagName);
                  a.style &&
                    m.style &&
                    a.style.cssText &&
                    (m.style.cssText = a.style.cssText);
                  "FONT" === a.tagName &&
                    (a.color && (m.color = a.color),
                    a.face && (m.face = a.face),
                    a.size && (m.size = a.size));
                  for (; c; ) (t = c.nextSibling), m.appendChild(c), (c = t);
                  q.place(m, a, "after");
                  f = a;
                  c = m;
                  a = a.parentNode;
                }
                if (1 == c.nodeType || (3 == c.nodeType && c.nodeValue))
                  r.innerHTML = "";
                for (f = c; c; ) (t = c.nextSibling), r.appendChild(c), (c = t);
              }
              a = x.create(this.editor.window);
              g = f;
              if ("BR" !== this.blockNodeForEnter) {
                for (; g; ) (k = g), (g = t = g.firstChild);
                k && k.parentNode
                  ? ((r = k.parentNode),
                    a.setStart(r, 0),
                    b.removeAllRanges(),
                    b.addRange(a),
                    this.editor.height && d.scrollIntoView(r),
                    h("mozilla") && (this._pressedEnterInBlock = e.blockNode))
                  : (w = !0);
              } else
                a.setStart(r, 0),
                  b.removeAllRanges(),
                  b.addRange(a),
                  this.editor.height && d.scrollIntoView(r),
                  h("mozilla") && (this._pressedEnterInBlock = e.blockNode);
            }
            return w;
          },
          _adjustNodeAndOffset: function(b, a) {
            for (
              ;
              b.length < a && b.nextSibling && 3 == b.nextSibling.nodeType;

            )
              (a -= b.length), (b = b.nextSibling);
            return { node: b, offset: a };
          },
          removeTrailingBr: function(b) {
            if (
              (b = /P|DIV|LI/i.test(b.tagName)
                ? b
                : this.editor.selection.getParentOfType(b, ["P", "DIV", "LI"]))
            )
              b.lastChild &&
                ((1 < b.childNodes.length &&
                  3 == b.lastChild.nodeType &&
                  /^[\s\xAD]*$/.test(b.lastChild.nodeValue)) ||
                  "BR" == b.lastChild.tagName) &&
                q.destroy(b.lastChild),
                b.childNodes.length || (b.innerHTML = this.bogusHtmlContent);
          }
        });
      });
    },
    "dijit/_editor/RichText": function() {
      define("dojo/_base/array dojo/_base/config dojo/_base/declare dojo/_base/Deferred dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/query dojo/domReady dojo/sniff dojo/string dojo/topic dojo/_base/unload dojo/_base/url dojo/window ../_Widget ../_CssStateMixin ../selection ./range ./html ../focus ../main".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F,
        G,
        C,
        A,
        R,
        J,
        O
      ) {
        var H = u("dijit._editor.RichText", [F, G], {
          constructor: function(b) {
            this.contentPreFilters = [];
            this.contentPostFilters = [];
            this.contentDomPreFilters = [];
            this.contentDomPostFilters = [];
            this.editingAreaStyleSheets = [];
            this.events = [].concat(this.events);
            this._keyHandlers = {};
            b && a.isString(b.value) && (this.value = b.value);
            this.onLoadDeferred = new v();
          },
          baseClass: "dijitEditor",
          inheritWidth: !1,
          focusOnLoad: !1,
          name: "",
          styleSheets: "",
          height: "300px",
          minHeight: "1em",
          isClosed: !0,
          isLoaded: !1,
          _SEPARATOR: "@@**%%__RICHTEXTBOUNDRY__%%**@@",
          _NAME_CONTENT_SEP: "@@**%%:%%**@@",
          onLoadDeferred: null,
          isTabIndent: !1,
          disableSpellCheck: !1,
          postCreate: function() {
            "textarea" === this.domNode.tagName.toLowerCase() &&
              console.warn(
                "RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs."
              );
            this.contentPreFilters = [
              a.trim,
              a.hitch(this, "_preFixUrlAttributes")
            ].concat(this.contentPreFilters);
            g("mozilla") &&
              ((this.contentPreFilters = [this._normalizeFontStyle].concat(
                this.contentPreFilters
              )),
              (this.contentPostFilters = [this._removeMozBogus].concat(
                this.contentPostFilters
              )));
            g("webkit") &&
              ((this.contentPreFilters = [this._removeWebkitBogus].concat(
                this.contentPreFilters
              )),
              (this.contentPostFilters = [this._removeWebkitBogus].concat(
                this.contentPostFilters
              )));
            if (g("ie") || g("trident"))
              (this.contentPostFilters = [this._normalizeFontStyle].concat(
                this.contentPostFilters
              )),
                (this.contentDomPostFilters = [
                  a.hitch(this, "_stripBreakerNodes")
                ].concat(this.contentDomPostFilters));
            this.contentDomPostFilters = [
              a.hitch(this, "_stripTrailingEmptyNodes")
            ].concat(this.contentDomPostFilters);
            this.inherited(arguments);
            E.publish(O._scopeName + "._editor.RichText::init", this);
          },
          startup: function() {
            this.inherited(arguments);
            this.open();
            this.setupDefaultShortcuts();
          },
          setupDefaultShortcuts: function() {
            var b = a.hitch(this, function(a, b) {
                return function() {
                  return !this.execCommand(a, b);
                };
              }),
              c = {
                b: b("bold"),
                i: b("italic"),
                u: b("underline"),
                a: b("selectall"),
                s: function() {
                  this.save(!0);
                },
                m: function() {
                  this.isTabIndent = !this.isTabIndent;
                },
                1: b("formatblock", "h1"),
                2: b("formatblock", "h2"),
                3: b("formatblock", "h3"),
                4: b("formatblock", "h4"),
                "\\": b("insertunorderedlist")
              };
            g("ie") || (c.Z = b("redo"));
            for (var e in c) this.addKeyHandler(e, !0, !1, c[e]);
          },
          events: ["onKeyDown", "onKeyUp"],
          captureEvents: [],
          _editorCommandsLocalized: !1,
          _localizeEditorCommands: function() {
            if (H._editorCommandsLocalized)
              (this._local2NativeFormatNames = H._local2NativeFormatNames),
                (this._native2LocalFormatNames = H._native2LocalFormatNames);
            else {
              H._editorCommandsLocalized = !0;
              H._local2NativeFormatNames = {};
              H._native2LocalFormatNames = {};
              this._local2NativeFormatNames = H._local2NativeFormatNames;
              this._native2LocalFormatNames = H._native2LocalFormatNames;
              for (
                var b = "div p pre h1 h2 h3 h4 h5 h6 ol ul address".split(" "),
                  c = "",
                  e,
                  g = 0;
                (e = b[g++]);

              )
                c =
                  "l" !== e.charAt(1)
                    ? c +
                      ("\x3c" +
                        e +
                        "\x3e\x3cspan\x3econtent\x3c/span\x3e\x3c/" +
                        e +
                        "\x3e\x3cbr/\x3e")
                    : c +
                      ("\x3c" +
                        e +
                        "\x3e\x3cli\x3econtent\x3c/li\x3e\x3c/" +
                        e +
                        "\x3e\x3cbr/\x3e");
              var k = d.create("div", {
                style: {
                  position: "absolute",
                  top: "0px",
                  zIndex: 10,
                  opacity: 0.01
                },
                innerHTML: c
              });
              this.ownerDocumentBody.appendChild(k);
              b = a.hitch(this, function() {
                for (var a = k.firstChild; a; )
                  try {
                    this.selection.selectElement(a.firstChild);
                    var b = a.tagName.toLowerCase();
                    this._local2NativeFormatNames[
                      b
                    ] = document.queryCommandValue("formatblock");
                    this._native2LocalFormatNames[
                      this._local2NativeFormatNames[b]
                    ] = b;
                    a = a.nextSibling.nextSibling;
                  } catch (Y) {}
                d.destroy(k);
              });
              this.defer(b);
            }
          },
          open: function(b) {
            if (!this.onLoadDeferred || 0 <= this.onLoadDeferred.fired)
              this.onLoadDeferred = new v();
            this.isClosed || this.close();
            E.publish(O._scopeName + "._editor.RichText::open", this);
            1 === arguments.length && b.nodeName && (this.domNode = b);
            var c = this.domNode,
              e;
            if (a.isString(this.value)) (e = this.value), (c.innerHTML = "");
            else if (c.nodeName && "textarea" == c.nodeName.toLowerCase()) {
              var k = (this.textarea = c);
              this.name = k.name;
              e = k.value;
              c = this.domNode = this.ownerDocument.createElement("div");
              c.setAttribute("widgetId", this.id);
              k.removeAttribute("widgetId");
              c.cssText = k.cssText;
              c.className += " " + k.className;
              d.place(c, k, "before");
              var y = a.hitch(this, function() {
                l.set(k, {
                  display: "block",
                  position: "absolute",
                  top: "-1000px"
                });
                if (g("ie")) {
                  var a = k.style;
                  this.__overflow = a.overflow;
                  a.overflow = "hidden";
                }
              });
              g("ie") ? this.defer(y, 10) : y();
              if (k.form) {
                var t = k.value;
                this.reset = function() {
                  this.getValue() !== t && this.replaceValue(t);
                };
                n(
                  k.form,
                  "submit",
                  a.hitch(this, function() {
                    h.set(k, "disabled", this.disabled);
                    k.value = this.getValue();
                  })
                );
              }
            } else (e = R.getChildrenHtml(c)), (c.innerHTML = "");
            this.value = e;
            c.nodeName && "LI" === c.nodeName && (c.innerHTML = " \x3cbr\x3e");
            this.header = c.ownerDocument.createElement("div");
            c.appendChild(this.header);
            this.editingArea = c.ownerDocument.createElement("div");
            c.appendChild(this.editingArea);
            this.footer = c.ownerDocument.createElement("div");
            c.appendChild(this.footer);
            this.name || (this.name = this.id + "_AUTOGEN");
            if ("" !== this.name && (!q.useXDomain || q.allowXdRichTextSave)) {
              if (
                (e = m.byId(O._scopeName + "._editor.RichText.value")) &&
                "" !== e.value
              )
                for (
                  var y = e.value.split(this._SEPARATOR), w = 0, r;
                  (r = y[w++]);

                )
                  if (
                    ((r = r.split(this._NAME_CONTENT_SEP)), r[0] === this.name)
                  ) {
                    this.value = r[1];
                    y = y.splice(w, 1);
                    e.value = y.join(this._SEPARATOR);
                    break;
                  }
              H._globalSaveHandler ||
                ((H._globalSaveHandler = {}),
                D.addOnUnload(function() {
                  for (var b in H._globalSaveHandler) {
                    var c = H._globalSaveHandler[b];
                    a.isFunction(c) && c();
                  }
                }));
              H._globalSaveHandler[this.id] = a.hitch(this, "_saveContent");
            }
            this.isClosed = !1;
            e = this.editorObject = this.iframe = this.ownerDocument.createElement(
              "iframe"
            );
            e.id = this.id + "_iframe";
            e.style.border = "none";
            e.style.width = "100%";
            this._layoutMode
              ? (e.style.height = "100%")
              : 7 <= g("ie")
              ? (this.height && (e.style.height = this.height),
                this.minHeight && (e.style.minHeight = this.minHeight))
              : (e.style.height = this.height ? this.height : this.minHeight);
            e.frameBorder = 0;
            e._loadFunc = a.hitch(this, function(a) {
              this.window = a;
              this.document = a.document;
              this.selection = new C.SelectionManager(a);
              g("ie") && this._localizeEditorCommands();
              this.onLoad(this.get("value"));
            });
            y = this._getIframeDocTxt()
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'");
            y =
              11 > g("ie")
                ? 'javascript:document.open();try{parent.window;}catch(e){document.domain\x3d"' +
                  document.domain +
                  "\";}document.write('" +
                  y +
                  "');document.close()"
                : "javascript: '" + y + "'";
            this.editingArea.appendChild(e);
            e.src = y;
            "LI" === c.nodeName && (c.lastChild.style.marginTop = "-1.2em");
            f.add(this.domNode, this.baseClass);
          },
          _local2NativeFormatNames: {},
          _native2LocalFormatNames: {},
          _getIframeDocTxt: function() {
            var b = l.getComputedStyle(this.domNode),
              d;
            if (this["aria-label"]) d = this["aria-label"];
            else {
              var k =
                c('label[for\x3d"' + this.id + '"]', this.ownerDocument)[0] ||
                m.byId(this["aria-labelledby"], this.ownerDocument);
              k && (d = k.textContent || k.innerHTML || "");
            }
            var k =
                "\x3cdiv id\x3d'dijitEditorBody' role\x3d'textbox' aria-multiline\x3d'true' " +
                (d ? " aria-label\x3d'" + e.escape(d) + "'" : "") +
                "\x3e\x3c/div\x3e",
              f = [b.fontWeight, b.fontSize, b.fontFamily].join(" "),
              n = b.lineHeight,
              n =
                0 <= n.indexOf("px")
                  ? parseFloat(n) / parseFloat(b.fontSize)
                  : 0 <= n.indexOf("em")
                  ? parseFloat(n)
                  : "normal",
              h = "",
              t = this;
            this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/gi, function(b) {
              b = b.replace(/^;/gi, "") + ";";
              var c = b.split(":")[0];
              if (c) {
                var c = a.trim(c),
                  c = c.toLowerCase(),
                  e,
                  g = "";
                for (e = 0; e < c.length; e++) {
                  var d = c.charAt(e);
                  switch (d) {
                    case "-":
                      e++, (d = c.charAt(e).toUpperCase());
                    default:
                      g += d;
                  }
                }
                l.set(t.domNode, g, "");
              }
              h += b + ";";
            });
            this.iframe.setAttribute("title", d);
            return [
              "\x3c!DOCTYPE html\x3e",
              "\x3chtml lang\x3d'" +
                (this.lang || x.locale.replace(/-.*/, "")) +
                "'" +
                (this.isLeftToRight() ? "" : " dir\x3d'rtl'") +
                "\x3e\n",
              "\x3chead\x3e\n\x3cmeta http-equiv\x3d'Content-Type' content\x3d'text/html'\x3e\n",
              d ? "\x3ctitle\x3e" + e.escape(d) + "\x3c/title\x3e" : "",
              "\x3cstyle\x3e\n\tbody,html {\n\t\tbackground:transparent;\n\t\tpadding: 1px 0 0 0;\n\t\tmargin: -1px 0 0 0;\n\t}\n\tbody,html,#dijitEditorBody { outline: none; }html { height: 100%; width: 100%; overflow: hidden; }\n",
              this.height
                ? "\tbody,#dijitEditorBody { height: 100%; width: 100%; overflow: auto; }\n"
                : "\tbody,#dijitEditorBody { min-height: " +
                  this.minHeight +
                  "; width: 100%; overflow-x: auto; overflow-y: hidden; }\n",
              "\tbody{\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tright:0px;\n\t\tfont:",
              f,
              ";\n",
              this.height || g("opera") ? "" : "\t\tposition: fixed;\n",
              "\t\tline-height:",
              n,
              ";\n\t}\n\tp{ margin: 1em 0; }\n\tli \x3e ul:-moz-first-node, li \x3e ol:-moz-first-node{ padding-top: 1.2em; }\n",
              g("ie") || g("trident") || g("edge")
                ? ""
                : "\tli{ min-height:1.2em; }\n",
              "\x3c/style\x3e\n",
              this._applyEditingAreaStyleSheets(),
              "\n\x3c/head\x3e\n\x3cbody role\x3d'application'",
              d ? " aria-label\x3d'" + e.escape(d) + "'" : "",
              "onload\x3d'try{frameElement \x26\x26 frameElement._loadFunc(window,document)}catch(e){document.domain\x3d\"" +
                document.domain +
                "\";frameElement._loadFunc(window,document)}' ",
              "style\x3d'" + h + "'\x3e",
              k,
              "\x3c/body\x3e\n\x3c/html\x3e"
            ].join("");
          },
          _applyEditingAreaStyleSheets: function() {
            var a = [];
            this.styleSheets &&
              ((a = this.styleSheets.split(";")), (this.styleSheets = ""));
            a = a.concat(this.editingAreaStyleSheets);
            this.editingAreaStyleSheets = [];
            for (
              var b = "", c = 0, e, g = B.get(this.ownerDocument);
              (e = a[c++]);

            )
              (e = new w(g.location, e).toString()),
                this.editingAreaStyleSheets.push(e),
                (b +=
                  '\x3clink rel\x3d"stylesheet" type\x3d"text/css" href\x3d"' +
                  e +
                  '"/\x3e');
            return b;
          },
          addStyleSheet: function(b) {
            var c = b.toString(),
              e = B.get(this.ownerDocument);
            if ("." === c.charAt(0) || ("/" !== c.charAt(0) && !b.host))
              c = new w(e.location, c).toString();
            -1 < r.indexOf(this.editingAreaStyleSheets, c) ||
              (this.editingAreaStyleSheets.push(c),
              this.onLoadDeferred.then(
                a.hitch(this, function() {
                  if (this.document.createStyleSheet)
                    this.document.createStyleSheet(c);
                  else {
                    var a = this.document.getElementsByTagName("head")[0],
                      b = this.document.createElement("link");
                    b.rel = "stylesheet";
                    b.type = "text/css";
                    b.href = c;
                    a.appendChild(b);
                  }
                })
              ));
          },
          removeStyleSheet: function(a) {
            var b = a.toString(),
              e = B.get(this.ownerDocument);
            if ("." === b.charAt(0) || ("/" !== b.charAt(0) && !a.host))
              b = new w(e.location, b).toString();
            a = r.indexOf(this.editingAreaStyleSheets, b);
            -1 !== a &&
              (delete this.editingAreaStyleSheets[a],
              c('link[href\x3d"' + b + '"]', this.window.document).orphan());
          },
          disabled: !1,
          _mozSettingProps: { styleWithCSS: !1 },
          _setDisabledAttr: function(a) {
            a = !!a;
            this._set("disabled", a);
            if (this.isLoaded) {
              var b = g("ie") && (this.isLoaded || !this.focusOnLoad);
              b && (this.editNode.unselectable = "on");
              this.editNode.contentEditable = !a;
              this.editNode.tabIndex = a ? "-1" : this.tabIndex;
              b &&
                this.defer(function() {
                  this.editNode && (this.editNode.unselectable = "off");
                });
              if (g("mozilla") && !a && this._mozSettingProps) {
                a = this._mozSettingProps;
                for (var c in a)
                  if (a.hasOwnProperty(c))
                    try {
                      this.document.execCommand(c, !1, a[c]);
                    } catch (I) {}
              }
              this._disabledOK = !0;
            }
          },
          onLoad: function(b) {
            this.window.__registeredWindow ||
              ((this.window.__registeredWindow = !0),
              (this._iframeRegHandle = J.registerIframe(this.iframe)));
            this.editNode = this.document.body.firstChild;
            var c = this;
            this.beforeIframeNode = d.place(
              "\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e",
              this.iframe,
              "before"
            );
            this.afterIframeNode = d.place(
              "\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e",
              this.iframe,
              "after"
            );
            this.iframe.onfocus = this.document.onfocus = function() {
              c.editNode.focus();
            };
            this.focusNode = this.editNode;
            var e = this.events.concat(this.captureEvents),
              f = this.iframe ? this.document : this.editNode;
            this.own.apply(
              this,
              r.map(
                e,
                function(b) {
                  var c = b.toLowerCase().replace(/^on/, "");
                  return n(f, c, a.hitch(this, b));
                },
                this
              )
            );
            this.own(n(f, "mouseup", a.hitch(this, "onClick")));
            g("ie") &&
              (this.own(
                n(this.document, "mousedown", a.hitch(this, "_onIEMouseDown"))
              ),
              (this.editNode.style.zoom = 1));
            g("webkit") &&
              ((this._webkitListener = this.own(
                n(this.document, "mouseup", a.hitch(this, "onDisplayChanged"))
              )[0]),
              this.own(
                n(
                  this.document,
                  "mousedown",
                  a.hitch(this, function(a) {
                    a = a.target;
                    !a ||
                      (a !== this.document.body && a !== this.document) ||
                      this.defer("placeCursorAtEnd");
                  })
                )
              ));
            if (g("ie"))
              try {
                this.document.execCommand(
                  "RespectVisibilityInDesign",
                  !0,
                  null
                );
              } catch (z) {}
            this.isLoaded = !0;
            this.set("disabled", this.disabled);
            e = a.hitch(this, function() {
              this.setValue(b);
              this.onLoadDeferred &&
                !this.onLoadDeferred.isFulfilled() &&
                this.onLoadDeferred.resolve(!0);
              this.onDisplayChanged();
              this.focusOnLoad &&
                k(a.hitch(this, "defer", "focus", this.updateInterval));
              this.value = this.getValue(!0);
            });
            this.setValueDeferred ? this.setValueDeferred.then(e) : e();
          },
          onKeyDown: function(a) {
            if (
              a.keyCode === b.SHIFT ||
              a.keyCode === b.ALT ||
              a.keyCode === b.META ||
              a.keyCode === b.CTRL
            )
              return !0;
            a.keyCode === b.TAB &&
              this.isTabIndent &&
              (a.stopPropagation(),
              a.preventDefault(),
              this.queryCommandEnabled(a.shiftKey ? "outdent" : "indent") &&
                this.execCommand(a.shiftKey ? "outdent" : "indent"));
            if (
              a.keyCode == b.TAB &&
              !this.isTabIndent &&
              !a.ctrlKey &&
              !a.altKey
            )
              return (
                a.shiftKey
                  ? this.beforeIframeNode.focus()
                  : this.afterIframeNode.focus(),
                !0
              );
            9 > g("ie") &&
              a.keyCode === b.BACKSPACE &&
              "Control" === this.document.selection.type &&
              (a.stopPropagation(),
              a.preventDefault(),
              this.execCommand("delete"));
            g("ff") &&
              (a.keyCode === b.PAGE_UP || a.keyCode === b.PAGE_DOWN) &&
              this.editNode.clientHeight >= this.editNode.scrollHeight &&
              a.preventDefault();
            var c = this._keyHandlers[a.keyCode],
              e = arguments;
            c &&
              !a.altKey &&
              r.some(
                c,
                function(b) {
                  if (
                    !(b.shift ^ a.shiftKey || b.ctrl ^ (a.ctrlKey || a.metaKey))
                  )
                    return b.handler.apply(this, e) || a.preventDefault(), !0;
                },
                this
              );
            this.defer("onKeyPressed", 1);
            return !0;
          },
          onKeyUp: function() {},
          setDisabled: function(a) {
            x.deprecated(
              "dijit.Editor::setDisabled is deprecated",
              'use dijit.Editor::attr("disabled",boolean) instead',
              2
            );
            this.set("disabled", a);
          },
          _setValueAttr: function(a) {
            this.setValue(a);
          },
          _setDisableSpellCheckAttr: function(b) {
            this.document
              ? h.set(this.document.body, "spellcheck", !b)
              : this.onLoadDeferred.then(
                  a.hitch(this, function() {
                    h.set(this.document.body, "spellcheck", !b);
                  })
                );
            this._set("disableSpellCheck", b);
          },
          addKeyHandler: function(b, c, e, g) {
            "string" == typeof b && (b = b.toUpperCase().charCodeAt(0));
            a.isArray(this._keyHandlers[b]) || (this._keyHandlers[b] = []);
            this._keyHandlers[b].push({
              shift: e || !1,
              ctrl: c || !1,
              handler: g
            });
          },
          onKeyPressed: function() {
            this.onDisplayChanged();
          },
          onClick: function(a) {
            this.onDisplayChanged(a);
          },
          _onIEMouseDown: function() {
            this.focused || this.disabled || this.focus();
          },
          _onBlur: function(a) {
            (g("ie") || g("trident")) &&
              this.defer(function() {
                J.curNode || this.ownerDocumentBody.focus();
              });
            this.inherited(arguments);
            var b = this.getValue(!0);
            if (b !== this.value) this.onChange(b);
            this._set("value", b);
          },
          _onFocus: function(a) {
            this.disabled ||
              (this._disabledOK || this.set("disabled", !1),
              this.inherited(arguments));
          },
          blur: function() {
            !g("ie") &&
            this.window.document.documentElement &&
            this.window.document.documentElement.focus
              ? this.window.document.documentElement.focus()
              : this.ownerDocumentBody.focus && this.ownerDocumentBody.focus();
          },
          focus: function() {
            this.isLoaded
              ? 9 > g("ie")
                ? this.iframe.fireEvent("onfocus", document.createEventObject())
                : this.editNode.focus()
              : (this.focusOnLoad = !0);
          },
          updateInterval: 200,
          _updateTimer: null,
          onDisplayChanged: function() {
            this._updateTimer && this._updateTimer.remove();
            this._updateTimer = this.defer(
              "onNormalizedDisplayChanged",
              this.updateInterval
            );
          },
          onNormalizedDisplayChanged: function() {
            delete this._updateTimer;
          },
          onChange: function() {},
          _normalizeCommand: function(a, b) {
            a = a.toLowerCase();
            "formatblock" === a
              ? g("safari") && void 0 === b && (a = "heading")
              : "hilitecolor" !== a || g("mozilla") || (a = "backcolor");
            return a;
          },
          _implCommand: function(a) {
            return "_" + this._normalizeCommand(a) + "EnabledImpl";
          },
          _qcaCache: {},
          queryCommandAvailable: function(a) {
            var b = this._qcaCache[a];
            return void 0 !== b
              ? b
              : (this._qcaCache[a] = this._queryCommandAvailable(a));
          },
          _queryCommandAvailable: function(a) {
            switch (a.toLowerCase()) {
              case "bold":
              case "italic":
              case "underline":
              case "subscript":
              case "superscript":
              case "fontname":
              case "fontsize":
              case "forecolor":
              case "hilitecolor":
              case "justifycenter":
              case "justifyfull":
              case "justifyleft":
              case "justifyright":
              case "delete":
              case "selectall":
              case "toggledir":
              case "createlink":
              case "unlink":
              case "removeformat":
              case "inserthorizontalrule":
              case "insertimage":
              case "insertorderedlist":
              case "insertunorderedlist":
              case "indent":
              case "outdent":
              case "formatblock":
              case "inserthtml":
              case "undo":
              case "redo":
              case "strikethrough":
              case "tabindent":
              case "cut":
              case "copy":
              case "paste":
                return !0;
              case "blockdirltr":
              case "blockdirrtl":
              case "dirltr":
              case "dirrtl":
              case "inlinedirltr":
              case "inlinedirrtl":
                return g("ie") || g("trident") || g("edge");
              case "inserttable":
              case "insertcell":
              case "insertcol":
              case "insertrow":
              case "deletecells":
              case "deletecols":
              case "deleterows":
              case "mergecells":
              case "splitcell":
                return !g("webkit");
              default:
                return !1;
            }
          },
          execCommand: function(a, b) {
            var c;
            this.focused && this.focus();
            a = this._normalizeCommand(a, b);
            if (void 0 !== b) {
              if ("heading" === a) throw Error("unimplemented");
              "formatblock" === a &&
                (g("ie") || g("trident")) &&
                (b = "\x3c" + b + "\x3e");
            }
            var e = "_" + a + "Impl";
            if (this[e]) c = this[e](b);
            else if (
              (b = 1 < arguments.length ? b : null) ||
              "createlink" !== a
            )
              c = this.document.execCommand(a, !1, b);
            this.onDisplayChanged();
            return c;
          },
          queryCommandEnabled: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            var b = this._implCommand(a);
            return this[b] ? this[b](a) : this._browserQueryCommandEnabled(a);
          },
          queryCommandState: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            try {
              return this.document.queryCommandState(a);
            } catch (T) {
              return !1;
            }
          },
          queryCommandValue: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            if (g("ie") && "formatblock" === a)
              a = this._native2LocalFormatNames[
                this.document.queryCommandValue(a)
              ];
            else if (g("mozilla") && "hilitecolor" === a) {
              var b;
              try {
                b = this.document.queryCommandValue("styleWithCSS");
              } catch (Z) {
                b = !1;
              }
              this.document.execCommand("styleWithCSS", !1, !0);
              a = this.document.queryCommandValue(a);
              this.document.execCommand("styleWithCSS", !1, b);
            } else a = this.document.queryCommandValue(a);
            return a;
          },
          _sCall: function(a, b) {
            return this.selection[a].apply(this.selection, b);
          },
          placeCursorAtStart: function() {
            this.focus();
            var a = !1;
            if (g("mozilla"))
              for (var b = this.editNode.firstChild; b; ) {
                if (3 === b.nodeType) {
                  if (0 < b.nodeValue.replace(/^\s+|\s+$/g, "").length) {
                    a = !0;
                    this.selection.selectElement(b);
                    break;
                  }
                } else if (1 === b.nodeType) {
                  var a = !0,
                    c = b.tagName ? b.tagName.toLowerCase() : "";
                  /br|input|img|base|meta|area|basefont|hr|link/.test(c)
                    ? this.selection.selectElement(b)
                    : this.selection.selectElementChildren(b);
                  break;
                }
                b = b.nextSibling;
              }
            else (a = !0), this.selection.selectElementChildren(this.editNode);
            a && this.selection.collapse(!0);
          },
          placeCursorAtEnd: function() {
            this.focus();
            var a = !1;
            if (g("mozilla"))
              for (var b = this.editNode.lastChild; b; ) {
                if (3 === b.nodeType) {
                  if (0 < b.nodeValue.replace(/^\s+|\s+$/g, "").length) {
                    a = !0;
                    this.selection.selectElement(b);
                    break;
                  }
                } else if (1 === b.nodeType) {
                  a = !0;
                  this.selection.selectElement(b.lastChild || b);
                  break;
                }
                b = b.previousSibling;
              }
            else (a = !0), this.selection.selectElementChildren(this.editNode);
            a && this.selection.collapse(!1);
          },
          getValue: function(a) {
            return !this.textarea || (!this.isClosed && this.isLoaded)
              ? this.isLoaded
                ? this._postFilterContent(null, a)
                : this.value
              : this.textarea.value;
          },
          _getValueAttr: function() {
            return this.getValue(!0);
          },
          setValue: function(b) {
            if (this.isLoaded) {
              if (!this.textarea || (!this.isClosed && this.isLoaded)) {
                b = this._preFilterContent(b);
                var c = this.isClosed ? this.domNode : this.editNode;
                c.innerHTML = b;
                this._preDomFilterContent(c);
              } else this.textarea.value = b;
              this.onDisplayChanged();
              this._set("value", this.getValue(!0));
            } else
              this.onLoadDeferred.then(
                a.hitch(this, function() {
                  this.setValue(b);
                })
              );
          },
          replaceValue: function(a) {
            this.isClosed
              ? this.setValue(a)
              : this.window && this.window.getSelection && !g("mozilla")
              ? this.setValue(a)
              : this.window && this.window.getSelection
              ? ((a = this._preFilterContent(a)),
                this.execCommand("selectall"),
                this.execCommand("inserthtml", a),
                this._preDomFilterContent(this.editNode))
              : this.document && this.document.selection && this.setValue(a);
            this._set("value", this.getValue(!0));
          },
          _preFilterContent: function(a) {
            var b = a;
            r.forEach(this.contentPreFilters, function(a) {
              a && (b = a(b));
            });
            return b;
          },
          _preDomFilterContent: function(b) {
            b = b || this.editNode;
            r.forEach(
              this.contentDomPreFilters,
              function(c) {
                c && a.isFunction(c) && c(b);
              },
              this
            );
          },
          _postFilterContent: function(b, c) {
            var e;
            a.isString(b)
              ? (e = b)
              : ((b = b || this.editNode),
                this.contentDomPostFilters.length &&
                  (c && (b = a.clone(b)),
                  r.forEach(this.contentDomPostFilters, function(a) {
                    b = a(b);
                  })),
                (e = R.getChildrenHtml(b)));
            a.trim(e.replace(/^\xA0\xA0*/, "").replace(/\xA0\xA0*$/, ""))
              .length || (e = "");
            r.forEach(this.contentPostFilters, function(a) {
              e = a(e);
            });
            return e;
          },
          _saveContent: function() {
            var a = m.byId(O._scopeName + "._editor.RichText.value");
            a &&
              (a.value && (a.value += this._SEPARATOR),
              (a.value +=
                this.name + this._NAME_CONTENT_SEP + this.getValue(!0)));
          },
          escapeXml: function(a, b) {
            a = a
              .replace(/&/gm, "\x26amp;")
              .replace(/</gm, "\x26lt;")
              .replace(/>/gm, "\x26gt;")
              .replace(/"/gm, "\x26quot;");
            b || (a = a.replace(/'/gm, "\x26#39;"));
            return a;
          },
          getNodeHtml: function(a) {
            x.deprecated(
              "dijit.Editor::getNodeHtml is deprecated",
              "use dijit/_editor/html::getNodeHtml instead",
              2
            );
            return R.getNodeHtml(a);
          },
          getNodeChildrenHtml: function(a) {
            x.deprecated(
              "dijit.Editor::getNodeChildrenHtml is deprecated",
              "use dijit/_editor/html::getChildrenHtml instead",
              2
            );
            return R.getChildrenHtml(a);
          },
          close: function(a) {
            if (!this.isClosed) {
              arguments.length || (a = !0);
              a && this._set("value", this.getValue(!0));
              this.interval && clearInterval(this.interval);
              this._webkitListener &&
                (this._webkitListener.remove(), delete this._webkitListener);
              g("ie") && (this.iframe.onfocus = null);
              this.iframe._loadFunc = null;
              this._iframeRegHandle &&
                (this._iframeRegHandle.remove(), delete this._iframeRegHandle);
              if (this.textarea) {
                var b = this.textarea.style;
                b.position = "";
                b.left = b.top = "";
                g("ie") &&
                  ((b.overflow = this.__overflow), (this.__overflow = null));
                this.textarea.value = this.value;
                d.destroy(this.domNode);
                this.domNode = this.textarea;
              } else this.domNode.innerHTML = this.value;
              delete this.iframe;
              f.remove(this.domNode, this.baseClass);
              this.isClosed = !0;
              this.isLoaded = !1;
              delete this.editNode;
              delete this.focusNode;
              this.window &&
                this.window._frameElement &&
                (this.window._frameElement = null);
              this.editorObject = this.editingArea = this.document = this.window = null;
            }
          },
          destroy: function() {
            this.isClosed || this.close(!1);
            this._updateTimer && this._updateTimer.remove();
            this.inherited(arguments);
            H._globalSaveHandler && delete H._globalSaveHandler[this.id];
          },
          _removeMozBogus: function(a) {
            return a
              .replace(/\stype="_moz"/gi, "")
              .replace(/\s_moz_dirty=""/gi, "")
              .replace(/_moz_resizing="(true|false)"/gi, "");
          },
          _removeWebkitBogus: function(a) {
            a = a.replace(/\sclass="webkit-block-placeholder"/gi, "");
            a = a.replace(/\sclass="apple-style-span"/gi, "");
            return (a = a.replace(/<meta charset=\"utf-8\" \/>/gi, ""));
          },
          _normalizeFontStyle: function(a) {
            return a
              .replace(/<(\/)?strong([ \>])/gi, "\x3c$1b$2")
              .replace(/<(\/)?em([ \>])/gi, "\x3c$1i$2");
          },
          _preFixUrlAttributes: function(a) {
            return a
              .replace(
                /(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,
                "$1$4$2$3$5$2 _djrealurl\x3d$2$3$5$2"
              )
              .replace(
                /(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,
                "$1$4$2$3$5$2 _djrealurl\x3d$2$3$5$2"
              );
          },
          _browserQueryCommandEnabled: function(a) {
            if (!a) return !1;
            if (g("ie") || g("trident") || g("edge"))
              return this.focused && !this.disabled;
            var b =
              9 > g("ie")
                ? this.document.selection.createRange()
                : this.document;
            try {
              return b.queryCommandEnabled(a);
            } catch (Z) {
              return !1;
            }
          },
          _createlinkEnabledImpl: function() {
            var a = !0;
            return (a = g("opera")
              ? this.window.getSelection().isCollapsed
                ? !0
                : this.document.queryCommandEnabled("createlink")
              : this._browserQueryCommandEnabled("createlink"));
          },
          _unlinkEnabledImpl: function() {
            var a = !0;
            return (a =
              g("mozilla") ||
              g("webkit") ||
              g("ie") ||
              g("trident") ||
              g("edge")
                ? this.selection.hasAncestorElement("a")
                : this._browserQueryCommandEnabled("unlink"));
          },
          _inserttableEnabledImpl: function() {
            var a = !0;
            return (a =
              g("mozilla") || g("webkit")
                ? !0
                : this._browserQueryCommandEnabled("inserttable"));
          },
          _cutEnabledImpl: function() {
            var a = !0;
            g("webkit")
              ? ((a = this.window.getSelection()) && (a = a.toString()),
                (a = !!a))
              : (a = this._browserQueryCommandEnabled("cut"));
            return a;
          },
          _copyEnabledImpl: function() {
            var a = !0;
            g("webkit")
              ? ((a = this.window.getSelection()) && (a = a.toString()),
                (a = !!a))
              : (a = this._browserQueryCommandEnabled("copy"));
            return a;
          },
          _pasteEnabledImpl: function() {
            var a = !0;
            return g("webkit")
              ? !0
              : (a = this._browserQueryCommandEnabled("paste"));
          },
          _inserthorizontalruleImpl: function(a) {
            return g("ie")
              ? this._inserthtmlImpl("\x3chr\x3e")
              : this.document.execCommand("inserthorizontalrule", !1, a);
          },
          _unlinkImpl: function(a) {
            return this.queryCommandEnabled("unlink") &&
              (g("mozilla") || g("webkit"))
              ? ((a = this.selection.getAncestorElement("a")),
                this.selection.selectElement(a),
                this.document.execCommand("unlink", !1, null))
              : this.document.execCommand("unlink", !1, a);
          },
          _hilitecolorImpl: function(a) {
            var b;
            this._handleTextColorOrProperties("hilitecolor", a) ||
              (g("mozilla")
                ? (this.document.execCommand("styleWithCSS", !1, !0),
                  console.log("Executing color command."),
                  (b = this.document.execCommand("hilitecolor", !1, a)),
                  this.document.execCommand("styleWithCSS", !1, !1))
                : (b = this.document.execCommand("hilitecolor", !1, a)));
            return b;
          },
          _backcolorImpl: function(a) {
            g("ie") && (a = a ? a : null);
            var b = this._handleTextColorOrProperties("backcolor", a);
            b || (b = this.document.execCommand("backcolor", !1, a));
            return b;
          },
          _forecolorImpl: function(a) {
            g("ie") && (a = a ? a : null);
            var b = !1;
            (b = this._handleTextColorOrProperties("forecolor", a)) ||
              (b = this.document.execCommand("forecolor", !1, a));
            return b;
          },
          _inserthtmlImpl: function(a) {
            a = this._preFilterContent(a);
            var b = !0;
            if (9 > g("ie")) {
              var c = this.document.selection.createRange();
              if ("CONTROL" === this.document.selection.type.toUpperCase()) {
                for (var e = c.item(0); c.length; ) c.remove(c.item(0));
                e.outerHTML = a;
              } else c.pasteHTML(a);
              c.select();
            } else if (8 > g("trident")) {
              var k = A.getSelection(this.window);
              if (k && k.rangeCount && k.getRangeAt) {
                c = k.getRangeAt(0);
                c.deleteContents();
                var f = d.create("div");
                f.innerHTML = a;
                for (
                  var n, e = this.document.createDocumentFragment();
                  (a = f.firstChild);

                )
                  n = e.appendChild(a);
                c.insertNode(e);
                n &&
                  ((c = c.cloneRange()),
                  c.setStartAfter(n),
                  c.collapse(!1),
                  k.removeAllRanges(),
                  k.addRange(c));
              }
            } else
              g("mozilla") && !a.length
                ? this.selection.remove()
                : (b = this.document.execCommand("inserthtml", !1, a));
            return b;
          },
          _boldImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("bold"));
            b || (b = this.document.execCommand("bold", !1, a));
            return b;
          },
          _italicImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("italic"));
            b || (b = this.document.execCommand("italic", !1, a));
            return b;
          },
          _underlineImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("underline"));
            b || (b = this.document.execCommand("underline", !1, a));
            return b;
          },
          _strikethroughImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("strikethrough"));
            b || (b = this.document.execCommand("strikethrough", !1, a));
            return b;
          },
          _superscriptImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("superscript"));
            b || (b = this.document.execCommand("superscript", !1, a));
            return b;
          },
          _subscriptImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("subscript"));
            b || (b = this.document.execCommand("subscript", !1, a));
            return b;
          },
          _fontnameImpl: function(a) {
            var b;
            if (g("ie") || g("trident"))
              b = this._handleTextColorOrProperties("fontname", a);
            b || (b = this.document.execCommand("fontname", !1, a));
            return b;
          },
          _fontsizeImpl: function(a) {
            var b;
            if (g("ie") || g("trident"))
              b = this._handleTextColorOrProperties("fontsize", a);
            b || (b = this.document.execCommand("fontsize", !1, a));
            return b;
          },
          _insertorderedlistImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident") || g("edge"))
              b = this._adaptIEList("insertorderedlist", a);
            b || (b = this.document.execCommand("insertorderedlist", !1, a));
            return b;
          },
          _insertunorderedlistImpl: function(a) {
            var b = !1;
            if (g("ie") || g("trident") || g("edge"))
              b = this._adaptIEList("insertunorderedlist", a);
            b || (b = this.document.execCommand("insertunorderedlist", !1, a));
            return b;
          },
          getHeaderHeight: function() {
            return this._getNodeChildrenHeight(this.header);
          },
          getFooterHeight: function() {
            return this._getNodeChildrenHeight(this.footer);
          },
          _getNodeChildrenHeight: function(a) {
            var b = 0;
            if (a && a.childNodes) {
              var c;
              for (c = 0; c < a.childNodes.length; c++)
                var e = t.position(a.childNodes[c]), b = b + e.h;
            }
            return b;
          },
          _isNodeEmpty: function(a, b) {
            return 1 === a.nodeType
              ? 0 < a.childNodes.length
                ? this._isNodeEmpty(a.childNodes[0], b)
                : !0
              : 3 === a.nodeType
              ? "" === a.nodeValue.substring(b)
              : !1;
          },
          _removeStartingRangeFromRange: function(a, b) {
            if (a.nextSibling) b.setStart(a.nextSibling, 0);
            else {
              for (a = a.parentNode; a && null == a.nextSibling; )
                a = a.parentNode;
              a && b.setStart(a.nextSibling, 0);
            }
            return b;
          },
          _adaptIESelection: function() {
            var a = A.getSelection(this.window);
            if (a && a.rangeCount && !a.isCollapsed) {
              for (
                var b = a.getRangeAt(0),
                  c = b.startContainer,
                  e = b.startOffset;
                3 === c.nodeType && e >= c.length && c.nextSibling;

              )
                (e -= c.length), (c = c.nextSibling);
              for (var g = null; this._isNodeEmpty(c, e) && c !== g; )
                (g = c),
                  (b = this._removeStartingRangeFromRange(c, b)),
                  (c = b.startContainer),
                  (e = 0);
              a.removeAllRanges();
              a.addRange(b);
            }
          },
          _adaptIEFormatAreaAndExec: function(a) {
            var b = A.getSelection(this.window),
              c = this.document,
              e,
              g,
              k,
              f,
              n,
              h,
              l;
            if (a && b && b.isCollapsed) {
              if (this.queryCommandValue(a)) {
                a = this._tagNamesForCommand(a);
                k = b.getRangeAt(0);
                f = k.startContainer;
                3 === f.nodeType &&
                  ((g = k.endOffset),
                  f.length < g &&
                    ((g = this._adjustNodeAndOffset(e, g)),
                    (f = g.node),
                    (g = g.offset)));
                for (; f && f !== this.editNode; ) {
                  e = f.tagName ? f.tagName.toLowerCase() : "";
                  if (-1 < r.indexOf(a, e)) {
                    l = f;
                    break;
                  }
                  f = f.parentNode;
                }
                if (
                  l &&
                  ((e = k.startContainer),
                  (a = c.createElement(l.tagName)),
                  d.place(a, l, "after"),
                  e && 3 === e.nodeType)
                ) {
                  g = k.endOffset;
                  e.length < g &&
                    ((g = this._adjustNodeAndOffset(e, g)),
                    (e = g.node),
                    (g = g.offset));
                  f = e.nodeValue;
                  k = c.createTextNode(f.substring(0, g));
                  var t = f.substring(g, f.length);
                  t && (n = c.createTextNode(t));
                  d.place(k, e, "before");
                  n &&
                    ((h = c.createElement("span")),
                    (h.className = "ieFormatBreakerSpan"),
                    d.place(h, e, "after"),
                    d.place(n, h, "after"),
                    (n = h));
                  d.destroy(e);
                  g = k.parentNode;
                  for (e = []; g !== l; ) {
                    f = g.tagName;
                    k = { tagName: f };
                    e.push(k);
                    f = c.createElement(f);
                    g.style &&
                      f.style &&
                      g.style.cssText &&
                      ((f.style.cssText = g.style.cssText),
                      (k.cssText = g.style.cssText));
                    "FONT" === g.tagName &&
                      (g.color && ((f.color = g.color), (k.color = g.color)),
                      g.face && ((f.face = g.face), (k.face = g.face)),
                      g.size && ((f.size = g.size), (k.size = g.size)));
                    g.className &&
                      ((f.className = g.className),
                      (k.className = g.className));
                    if (n)
                      for (; n; )
                        (k = n.nextSibling), f.appendChild(n), (n = k);
                    f.tagName == g.tagName
                      ? ((h = c.createElement("span")),
                        (h.className = "ieFormatBreakerSpan"),
                        d.place(h, g, "after"),
                        d.place(f, h, "after"))
                      : d.place(f, g, "after");
                    k = g;
                    n = f;
                    g = g.parentNode;
                  }
                  if (n) {
                    if (1 === n.nodeType || (3 === n.nodeType && n.nodeValue))
                      a.innerHTML = "";
                    for (; n; ) (k = n.nextSibling), a.appendChild(n), (n = k);
                  }
                  if (e.length) {
                    k = e.pop();
                    n = c.createElement(k.tagName);
                    k.cssText && n.style && (n.style.cssText = k.cssText);
                    k.className && (n.className = k.className);
                    "FONT" === k.tagName &&
                      (k.color && (n.color = k.color),
                      k.face && (n.face = k.face),
                      k.size && (n.size = k.size));
                    for (d.place(n, a, "before"); e.length; )
                      (k = e.pop()),
                        (l = c.createElement(k.tagName)),
                        k.cssText && l.style && (l.style.cssText = k.cssText),
                        k.className && (l.className = k.className),
                        "FONT" === k.tagName &&
                          (k.color && (l.color = k.color),
                          k.face && (l.face = k.face),
                          k.size && (l.size = k.size)),
                        n.appendChild(l),
                        (n = l);
                    l = c.createTextNode(".");
                    h.appendChild(l);
                    n.appendChild(l);
                  } else
                    (h = c.createElement("span")),
                      (h.className = "ieFormatBreakerSpan"),
                      (l = c.createTextNode(".")),
                      h.appendChild(l),
                      d.place(h, a, "before");
                  n = A.create(this.window);
                  n.setStart(l, 0);
                  n.setEnd(l, l.length);
                  b.removeAllRanges();
                  b.addRange(n);
                  this.selection.collapse(!1);
                  l.parentNode.innerHTML = "";
                  a.firstChild || d.destroy(a);
                  return !0;
                }
                return !1;
              }
              k = b.getRangeAt(0);
              if ((e = k.startContainer) && 3 === e.nodeType)
                return (
                  (g = k.startOffset),
                  e.length < g &&
                    ((g = this._adjustNodeAndOffset(e, g)),
                    (e = g.node),
                    (g = g.offset)),
                  (f = e.nodeValue),
                  (k = c.createTextNode(f.substring(0, g))),
                  (t = f.substring(g)),
                  "" !== t && (n = c.createTextNode(f.substring(g))),
                  (h = c.createElement("span")),
                  (l = c.createTextNode(".")),
                  h.appendChild(l),
                  k.length ? d.place(k, e, "after") : (k = e),
                  d.place(h, k, "after"),
                  n && d.place(n, h, "after"),
                  d.destroy(e),
                  (n = A.create(this.window)),
                  n.setStart(l, 0),
                  n.setEnd(l, l.length),
                  b.removeAllRanges(),
                  b.addRange(n),
                  c.execCommand(a),
                  d.place(h.firstChild, h, "before"),
                  d.destroy(h),
                  n.setStart(l, 0),
                  n.setEnd(l, l.length),
                  b.removeAllRanges(),
                  b.addRange(n),
                  this.selection.collapse(!1),
                  (l.parentNode.innerHTML = ""),
                  !0
                );
            } else return !1;
          },
          _adaptIEList: function(a) {
            var b = A.getSelection(this.window);
            if (b.isCollapsed && b.rangeCount && !this.queryCommandValue(a)) {
              var c = b.getRangeAt(0),
                e = c.startContainer;
              if (e && 3 == e.nodeType && !c.startOffset)
                return (
                  (c = "ul"),
                  "insertorderedlist" === a && (c = "ol"),
                  (a = this.document.createElement(c)),
                  (c = d.create("li", null, a)),
                  d.place(a, e, "before"),
                  c.appendChild(e),
                  d.create("br", null, a, "after"),
                  (a = A.create(this.window)),
                  a.setStart(e, 0),
                  a.setEnd(e, e.length),
                  b.removeAllRanges(),
                  b.addRange(a),
                  this.selection.collapse(!0),
                  !0
                );
            }
            return !1;
          },
          _handleTextColorOrProperties: function(a, b) {
            var c = A.getSelection(this.window),
              e = this.document,
              k,
              f,
              n,
              h,
              t;
            b = b || null;
            if (
              a &&
              c &&
              c.isCollapsed &&
              c.rangeCount &&
              ((f = c.getRangeAt(0)),
              (k = f.startContainer) && 3 === k.nodeType)
            ) {
              t = f.startOffset;
              k.length < t &&
                ((f = this._adjustNodeAndOffset(k, t)),
                (k = f.node),
                (t = f.offset));
              n = k.nodeValue;
              f = e.createTextNode(n.substring(0, t));
              "" !== n.substring(t) && (h = e.createTextNode(n.substring(t)));
              n = e.createElement("span");
              t = e.createTextNode(".");
              n.appendChild(t);
              e = e.createElement("span");
              n.appendChild(e);
              f.length ? d.place(f, k, "after") : (f = k);
              d.place(n, f, "after");
              h && d.place(h, n, "after");
              d.destroy(k);
              k = A.create(this.window);
              k.setStart(t, 0);
              k.setEnd(t, t.length);
              c.removeAllRanges();
              c.addRange(k);
              if (g("webkit")) {
                c = "color";
                if ("hilitecolor" === a || "backcolor" === a)
                  c = "backgroundColor";
                l.set(n, c, b);
                this.selection.remove();
                d.destroy(e);
                n.innerHTML = "\x26#160;";
                this.selection.selectElement(n);
                this.focus();
              } else
                this.execCommand(a, b),
                  d.place(n.firstChild, n, "before"),
                  d.destroy(n),
                  k.setStart(t, 0),
                  k.setEnd(t, t.length),
                  c.removeAllRanges(),
                  c.addRange(k),
                  this.selection.collapse(!1),
                  t.parentNode.removeChild(t);
              return !0;
            }
            return !1;
          },
          _adjustNodeAndOffset: function(a, b) {
            for (
              ;
              a.length < b && a.nextSibling && 3 === a.nextSibling.nodeType;

            )
              (b -= a.length), (a = a.nextSibling);
            return { node: a, offset: b };
          },
          _tagNamesForCommand: function(a) {
            return "bold" === a
              ? ["b", "strong"]
              : "italic" === a
              ? ["i", "em"]
              : "strikethrough" === a
              ? ["s", "strike"]
              : "superscript" === a
              ? ["sup"]
              : "subscript" === a
              ? ["sub"]
              : "underline" === a
              ? ["u"]
              : [];
          },
          _stripBreakerNodes: function(a) {
            if (this.isLoaded)
              return (
                c(".ieFormatBreakerSpan", a).forEach(function(a) {
                  for (; a.firstChild; ) d.place(a.firstChild, a, "before");
                  d.destroy(a);
                }),
                a
              );
          },
          _stripTrailingEmptyNodes: function(a) {
            function b(a) {
              return (
                (/^(p|div|br)$/i.test(a.nodeName) &&
                  0 == a.children.length &&
                  /^[\s\xA0]*$/.test(a.textContent || a.innerText || "")) ||
                (3 === a.nodeType && /^[\s\xA0]*$/.test(a.nodeValue))
              );
            }
            for (; a.lastChild && b(a.lastChild); ) d.destroy(a.lastChild);
            return a;
          },
          _setTextDirAttr: function(b) {
            this._set("textDir", b);
            this.onLoadDeferred.then(
              a.hitch(this, function() {
                this.editNode.dir = b;
              })
            );
          }
        });
        return H;
      });
    },
    "dijit/_editor/range": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang"
      ], function(r, q, u) {
        var v = {
          getIndex: function(f, d) {
            for (var h = [], l = [], m = f, b, a; f != d; ) {
              var n = 0;
              for (b = f.parentNode; (a = b.childNodes[n++]); )
                if (a === f) {
                  --n;
                  break;
                }
              h.unshift(n);
              l.unshift(n - b.childNodes.length);
              f = b;
            }
            if (0 < h.length && 3 == m.nodeType) {
              for (a = m.previousSibling; a && 3 == a.nodeType; )
                h[h.length - 1]--, (a = a.previousSibling);
              for (a = m.nextSibling; a && 3 == a.nodeType; )
                l[l.length - 1]++, (a = a.nextSibling);
            }
            return { o: h, r: l };
          },
          getNode: function(f, d) {
            if (!u.isArray(f) || 0 == f.length) return d;
            var h = d;
            r.every(f, function(d) {
              if (0 <= d && d < h.childNodes.length) h = h.childNodes[d];
              else return (h = null), !1;
              return !0;
            });
            return h;
          },
          getCommonAncestor: function(f, d, h) {
            h = h || f.ownerDocument.body;
            var l = function(a) {
              for (var b = []; a; )
                if ((b.unshift(a), a !== h)) a = a.parentNode;
                else break;
              return b;
            };
            f = l(f);
            d = l(d);
            for (
              var l = Math.min(f.length, d.length), t = f[0], b = 1;
              b < l;
              b++
            )
              if (f[b] === d[b]) t = f[b];
              else break;
            return t;
          },
          getAncestor: function(f, d, h) {
            for (h = h || f.ownerDocument.body; f && f !== h; ) {
              var l = f.nodeName.toUpperCase();
              if (d.test(l)) return f;
              f = f.parentNode;
            }
            return null;
          },
          BlockTagNames: /^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/,
          getBlockAncestor: function(f, d, h) {
            h = h || f.ownerDocument.body;
            d = d || v.BlockTagNames;
            for (var l = null, t; f && f !== h; ) {
              var b = f.nodeName.toUpperCase();
              !l && d.test(b) && (l = f);
              !t && /^(?:BODY|TD|TH|CAPTION)$/.test(b) && (t = f);
              f = f.parentNode;
            }
            return { blockNode: l, blockContainer: t || f.ownerDocument.body };
          },
          atBeginningOfContainer: function(f, d, h) {
            var l = !1,
              t = 0 == h;
            t ||
              3 != d.nodeType ||
              (/^[\s\xA0]+$/.test(d.nodeValue.substr(0, h)) && (t = !0));
            if (t)
              for (l = !0; d && d !== f; ) {
                if (d.previousSibling) {
                  l = !1;
                  break;
                }
                d = d.parentNode;
              }
            return l;
          },
          atEndOfContainer: function(f, d, h) {
            var l = !1,
              t = h == (d.length || d.childNodes.length);
            t ||
              3 != d.nodeType ||
              (/^[\s\xA0]+$/.test(d.nodeValue.substr(h)) && (t = !0));
            if (t)
              for (l = !0; d && d !== f; ) {
                if (d.nextSibling) {
                  l = !1;
                  break;
                }
                d = d.parentNode;
              }
            return l;
          },
          adjacentNoneTextNode: function(f, d) {
            var h = f;
            f = 0 - f.length || 0;
            for (
              d = d ? "nextSibling" : "previousSibling";
              h && 3 == h.nodeType;

            )
              (f += h.length), (h = h[d]);
            return [h, f];
          },
          create: function(f) {
            f = f || window;
            return f.getSelection ? f.document.createRange() : new h();
          },
          getSelection: function(f, d) {
            if (f.getSelection) return f.getSelection();
            f = new m.selection(f);
            d || f._getCurrentSelection();
            return f;
          }
        };
        if (!window.getSelection)
          var m = (v.ie = {
              cachedSelection: {},
              selection: function(f) {
                this._ranges = [];
                this.addRange = function(d, f) {
                  this._ranges.push(d);
                  f || d._select();
                  this.rangeCount = this._ranges.length;
                };
                this.removeAllRanges = function() {
                  this._ranges = [];
                  this.rangeCount = 0;
                };
                this.getRangeAt = function(d) {
                  return this._ranges[d];
                };
                this._getCurrentSelection = function() {
                  this.removeAllRanges();
                  var d;
                  d = f.document.selection.createRange();
                  d =
                    "CONTROL" == f.document.selection.type.toUpperCase()
                      ? new h(m.decomposeControlRange(d))
                      : new h(m.decomposeTextRange(d));
                  this.addRange(d, !0), (this.isCollapsed = d.collapsed);
                };
              },
              decomposeControlRange: function(f) {
                var d = f.item(0),
                  h = f.item(f.length - 1);
                f = d.parentNode;
                var l = h.parentNode,
                  d = v.getIndex(d, f).o[0],
                  h = v.getIndex(h, l).o[0] + 1;
                return [f, d, l, h];
              },
              getEndPoint: function(f, d) {
                var h = f.duplicate();
                h.collapse(!d);
                var l = "EndTo" + (d ? "End" : "Start"),
                  m = h.parentElement(),
                  b,
                  a,
                  n;
                0 < m.childNodes.length
                  ? r.every(m.childNodes, function(c, d) {
                      var g;
                      if (3 != c.nodeType)
                        if (
                          (h.moveToElementText(c), 0 < h.compareEndPoints(l, f))
                        )
                          if (n && 3 == n.nodeType) (b = n), (g = !0);
                          else return (b = m), (a = d), !1;
                        else {
                          if (d == m.childNodes.length - 1)
                            return (b = m), (a = m.childNodes.length), !1;
                        }
                      else d == m.childNodes.length - 1 && ((b = c), (g = !0));
                      if (g && b)
                        return (
                          (b = (c = v.adjacentNoneTextNode(b)[0])
                            ? c.nextSibling
                            : m.firstChild),
                          (d = v.adjacentNoneTextNode(b)),
                          (c = d[0]),
                          (d = d[1]),
                          c
                            ? (h.moveToElementText(c), h.collapse(!1))
                            : h.moveToElementText(m),
                          h.setEndPoint(l, f),
                          (a = h.text.length - d),
                          !1
                        );
                      n = c;
                      return !0;
                    })
                  : ((b = m), (a = 0));
                d ||
                  1 != b.nodeType ||
                  a != b.childNodes.length ||
                  ((d = b.nextSibling) &&
                    3 == d.nodeType &&
                    ((b = d), (a = 0)));
                return [b, a];
              },
              setEndPoint: function(f, d, h) {
                f = f.duplicate();
                var l;
                if (3 != d.nodeType)
                  if (0 < h) {
                    if ((l = d.childNodes[h - 1]))
                      if (3 == l.nodeType) (d = l), (h = l.length);
                      else if (l.nextSibling && 3 == l.nextSibling.nodeType)
                        (d = l.nextSibling), (h = 0);
                      else {
                        f.moveToElementText(l.nextSibling ? l : d);
                        var t = l.parentNode;
                        l = t.insertBefore(
                          l.ownerDocument.createTextNode(" "),
                          l.nextSibling
                        );
                        f.collapse(!1);
                        t.removeChild(l);
                      }
                  } else f.moveToElementText(d), f.collapse(!0);
                3 == d.nodeType &&
                  ((l = v.adjacentNoneTextNode(d)),
                  (t = l[0]),
                  (l = l[1]),
                  t
                    ? (f.moveToElementText(t),
                      f.collapse(!1),
                      "inherit" != t.contentEditable && l++)
                    : (f.moveToElementText(d.parentNode),
                      f.collapse(!0),
                      f.move("character", 1),
                      f.move("character", -1)),
                  (h += l),
                  0 < h &&
                    f.move("character", h) != h &&
                    console.error("Error when moving!"));
                return f;
              },
              decomposeTextRange: function(f) {
                var d = m.getEndPoint(f),
                  h = d[0],
                  l = d[1],
                  q = d[0],
                  d = d[1];
                f.htmlText.length &&
                  (f.htmlText == f.text
                    ? (d = l + f.text.length)
                    : ((d = m.getEndPoint(f, !0)), (q = d[0]), (d = d[1])));
                return [h, l, q, d];
              },
              setRange: function(f, d, h, l, q, b) {
                d = m.setEndPoint(f, d, h);
                f.setEndPoint("StartToStart", d);
                if (!b) var a = m.setEndPoint(f, l, q);
                f.setEndPoint("EndToEnd", a || d);
                return f;
              }
            }),
            h = (v.W3CRange = q(null, {
              constructor: function() {
                0 < arguments.length
                  ? (this.setStart(arguments[0][0], arguments[0][1]),
                    this.setEnd(arguments[0][2], arguments[0][3]))
                  : ((this.startContainer = this.commonAncestorContainer = null),
                    (this.startOffset = 0),
                    (this.endContainer = null),
                    (this.endOffset = 0),
                    (this.collapsed = !0));
              },
              _updateInternal: function() {
                this.commonAncestorContainer =
                  this.startContainer !== this.endContainer
                    ? v.getCommonAncestor(
                        this.startContainer,
                        this.endContainer
                      )
                    : this.startContainer;
                this.collapsed =
                  this.startContainer === this.endContainer &&
                  this.startOffset == this.endOffset;
              },
              setStart: function(f, d) {
                d = parseInt(d);
                if (this.startContainer !== f || this.startOffset != d)
                  delete this._cachedBookmark,
                    (this.startContainer = f),
                    (this.startOffset = d),
                    this.endContainer
                      ? this._updateInternal()
                      : this.setEnd(f, d);
              },
              setEnd: function(f, d) {
                d = parseInt(d);
                if (this.endContainer !== f || this.endOffset != d)
                  delete this._cachedBookmark,
                    (this.endContainer = f),
                    (this.endOffset = d),
                    this.startContainer
                      ? this._updateInternal()
                      : this.setStart(f, d);
              },
              setStartAfter: function(f, d) {
                this._setPoint("setStart", f, d, 1);
              },
              setStartBefore: function(f, d) {
                this._setPoint("setStart", f, d, 0);
              },
              setEndAfter: function(f, d) {
                this._setPoint("setEnd", f, d, 1);
              },
              setEndBefore: function(f, d) {
                this._setPoint("setEnd", f, d, 0);
              },
              _setPoint: function(f, d, h, l) {
                h = v.getIndex(d, d.parentNode).o;
                this[f](d.parentNode, h.pop() + l);
              },
              _getIERange: function() {
                var f = (
                  this._body || this.endContainer.ownerDocument.body
                ).createTextRange();
                m.setRange(
                  f,
                  this.startContainer,
                  this.startOffset,
                  this.endContainer,
                  this.endOffset,
                  this.collapsed
                );
                return f;
              },
              getBookmark: function() {
                this._getIERange();
                return this._cachedBookmark;
              },
              _select: function() {
                this._getIERange().select();
              },
              deleteContents: function() {
                var f = this.startContainer,
                  d = this._getIERange();
                3 !== f.nodeType || this.startOffset || this.setStartBefore(f);
                d.pasteHTML("");
                this.endContainer = this.startContainer;
                this.endOffset = this.startOffset;
                this.collapsed = !0;
              },
              cloneRange: function() {
                var f = new h([
                  this.startContainer,
                  this.startOffset,
                  this.endContainer,
                  this.endOffset
                ]);
                f._body = this._body;
                return f;
              },
              detach: function() {
                this.startContainer = this.commonAncestorContainer = this._body = null;
                this.startOffset = 0;
                this.endContainer = null;
                this.endOffset = 0;
                this.collapsed = !0;
              }
            }));
        u.setObject("dijit.range", v);
        return v;
      });
    },
    "dijit/_editor/html": function() {
      define(["dojo/_base/array", "dojo/_base/lang", "dojo/sniff"], function(
        r,
        q,
        u
      ) {
        var v = {};
        q.setObject("dijit._editor.html", v);
        var m = (v.escapeXml = function(h, f) {
          h = h
            .replace(/&/gm, "\x26amp;")
            .replace(/</gm, "\x26lt;")
            .replace(/>/gm, "\x26gt;")
            .replace(/"/gm, "\x26quot;");
          f || (h = h.replace(/'/gm, "\x26#39;"));
          return h;
        });
        v.getNodeHtml = function(h) {
          var f = [];
          v.getNodeHtmlHelper(h, f);
          return f.join("");
        };
        v.getNodeHtmlHelper = function(h, f) {
          switch (h.nodeType) {
            case 1:
              var d = h.nodeName.toLowerCase();
              if (!d || "/" == d.charAt(0)) return "";
              f.push("\x3c", d);
              var t = [],
                l = {},
                q;
              if (
                u("dom-attributes-explicit") ||
                u("dom-attributes-specified-flag")
              )
                for (var b = 0; (q = h.attributes[b++]); ) {
                  var a = q.name;
                  "_dj" === a.substr(0, 3) ||
                    (u("dom-attributes-specified-flag") && !q.specified) ||
                    a in l ||
                    ((q = q.value),
                    ("src" == a || "href" == a) &&
                      h.getAttribute("_djrealurl") &&
                      (q = h.getAttribute("_djrealurl")),
                    8 === u("ie") &&
                      "style" === a &&
                      (q = q
                        .replace("HEIGHT:", "height:")
                        .replace("WIDTH:", "width:")),
                    t.push([a, q]),
                    (l[a] = q));
                }
              else {
                var n = (/^input$|^img$/i.test(h.nodeName)
                    ? h
                    : h.cloneNode(!1)
                  ).outerHTML,
                  l = n.match(/[\w-]+=("[^"]*"|'[^']*'|\S*)/gi),
                  n = n.substr(0, n.indexOf("\x3e"));
                r.forEach(
                  l,
                  function(a) {
                    if (a) {
                      var b = a.indexOf("\x3d");
                      if (
                        0 < b &&
                        ((a = a.substring(0, b)), "_dj" != a.substr(0, 3))
                      )
                        if (
                          ("src" != a && "href" != a) ||
                          !h.getAttribute("_djrealurl")
                        ) {
                          var c;
                          switch (a) {
                            case "style":
                              c = h.style.cssText.toLowerCase();
                              break;
                            case "class":
                              c = h.className;
                              break;
                            case "width":
                              if ("img" === d) {
                                (b = /width=(\S+)/i.exec(n)) && (c = b[1]);
                                break;
                              }
                            case "height":
                              if ("img" === d) {
                                (b = /height=(\S+)/i.exec(n)) && (c = b[1]);
                                break;
                              }
                            default:
                              c = h.getAttribute(a);
                          }
                          null != c && t.push([a, c.toString()]);
                        } else t.push([a, h.getAttribute("_djrealurl")]);
                    }
                  },
                  this
                );
              }
              t.sort(function(a, b) {
                return a[0] < b[0] ? -1 : a[0] == b[0] ? 0 : 1;
              });
              for (l = 0; (q = t[l++]); )
                f.push(
                  " ",
                  q[0],
                  '\x3d"',
                  "string" === typeof q[1] ? m(q[1], !0) : q[1],
                  '"'
                );
              switch (d) {
                case "br":
                case "hr":
                case "img":
                case "input":
                case "base":
                case "meta":
                case "area":
                case "basefont":
                  f.push(" /\x3e");
                  break;
                case "script":
                  f.push("\x3e", h.innerHTML, "\x3c/", d, "\x3e");
                  break;
                default:
                  f.push("\x3e"),
                    h.hasChildNodes() && v.getChildrenHtmlHelper(h, f),
                    f.push("\x3c/", d, "\x3e");
              }
              break;
            case 4:
            case 3:
              f.push(m(h.nodeValue, !0));
              break;
            case 8:
              f.push("\x3c!--", m(h.nodeValue, !0), "--\x3e");
              break;
            default:
              f.push(
                "\x3c!-- Element not recognized - Type: ",
                h.nodeType,
                " Name: ",
                h.nodeName,
                "--\x3e"
              );
          }
        };
        v.getChildrenHtml = function(h) {
          var f = [];
          v.getChildrenHtmlHelper(h, f);
          return f.join("");
        };
        v.getChildrenHtmlHelper = function(h, f) {
          if (h)
            for (
              var d = h.childNodes || h, t = !u("ie") || d !== h, l, m = 0;
              (l = d[m++]);

            )
              (t && l.parentNode != h) || v.getNodeHtmlHelper(l, f);
        };
        return v;
      });
    },
    "dijit/_editor/plugins/LinkDialog": function() {
      define("require dojo/_base/declare dojo/dom-attr dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/query dojo/string ../_Plugin ../../form/DropDownButton ../range".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b) {
        var a = q("dijit._editor.plugins.LinkDialog", l, {
            buttonClass: x,
            useDefaultCommand: !1,
            urlRegExp:
              "((https?|ftps?|file)\\://|./|../|/|)(/[a-zA-Z]{1,1}:/|)(((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)*(?:[a-zA-Z](?:[-\\da-zA-Z]{0,80}[\\da-zA-Z])?)\\.?)|(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])|(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]|(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]|(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])|0[xX]0*[\\da-fA-F]{1,8}|([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}|([\\da-fA-F]{1,4}\\:){6}((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])))(\\:\\d+)?(/(?:[^?#\\s/]+/)*(?:[^?#\\s/]{0,}(?:\\?[^?#\\s/]*)?(?:#.*)?)?)?",
            emailRegExp:
              "\x3c?(mailto\\:)([!#-'*+\\-\\/-9\x3d?A-Z^-~]+[.])*[!#-'*+\\-\\/-9\x3d?A-Z^-~]+@((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)+(?:[a-zA-Z](?:[-\\da-zA-Z]{0,6}[\\da-zA-Z])?)\\.?)|localhost|^[^-][a-zA-Z0-9_-]*\x3e?",
            htmlTemplate:
              '\x3ca href\x3d"${urlInput}" _djrealurl\x3d"${urlInput}" target\x3d"${targetSelect}"\x3e${textInput}\x3c/a\x3e',
            tag: "a",
            _hostRxp: /^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/,
            _userAtRxp: /^([!#-'*+\-\/-9=?A-Z^-~]+[.])*[!#-'*+\-\/-9=?A-Z^-~]+@/i,
            linkDialogTemplate:
              "\x3ctable role\x3d'presentation'\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_urlInput'\x3e${url}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'true' id\x3d'${id}_urlInput' name\x3d'urlInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_textInput'\x3e${text}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'true' id\x3d'${id}_textInput' name\x3d'textInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_targetSelect'\x3e${target}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cselect id\x3d'${id}_targetSelect' name\x3d'targetSelect' data-dojo-type\x3d'dijit.form.Select'\x3e\x3coption selected\x3d'selected' value\x3d'_self'\x3e${currentWindow}\x3c/option\x3e\x3coption value\x3d'_blank'\x3e${newWindow}\x3c/option\x3e\x3coption value\x3d'_top'\x3e${topWindow}\x3c/option\x3e\x3coption value\x3d'_parent'\x3e${parentWindow}\x3c/option\x3e\x3c/select\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'submit' id\x3d'${id}_setButton'\x3e${set}\x3c/button\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'button' id\x3d'${id}_cancelButton'\x3e${buttonCancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
            _initButton: function() {
              this.inherited(arguments);
              this.button.loadDropDown = m.hitch(this, "_loadDropDown");
              this._connectTagEvents();
            },
            _loadDropDown: function(a) {
              r(
                "dojo/i18n ../../TooltipDialog ../../registry ../../form/Button ../../form/Select ../../form/ValidationTextBox dojo/i18n!../../nls/common dojo/i18n!../nls/LinkDialog".split(
                  " "
                ),
                m.hitch(this, function(b, c, e) {
                  var g = this;
                  this.tag = "insertImage" == this.command ? "img" : "a";
                  b = m.delegate(
                    b.getLocalization("dijit", "common", this.lang),
                    b.getLocalization("dijit._editor", "LinkDialog", this.lang)
                  );
                  var d = (this.dropDown = this.button.dropDown = new c({
                    title: b[this.command + "Title"],
                    ownerDocument: this.editor.ownerDocument,
                    dir: this.editor.dir,
                    execute: m.hitch(this, "setValue"),
                    onOpen: function() {
                      g._onOpenDialog();
                      c.prototype.onOpen.apply(this, arguments);
                    },
                    onCancel: function() {
                      setTimeout(m.hitch(g, "_onCloseDialog"), 0);
                    }
                  }));
                  b.urlRegExp = this.urlRegExp;
                  b.id = e.getUniqueId(this.editor.id);
                  this._uniqueId = b.id;
                  this._setContent(
                    d.title +
                      "\x3cdiv style\x3d'border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'\x3e\x3c/div\x3e" +
                      t.substitute(this.linkDialogTemplate, b)
                  );
                  d.startup();
                  this._urlInput = e.byId(this._uniqueId + "_urlInput");
                  this._textInput = e.byId(this._uniqueId + "_textInput");
                  this._setButton = e.byId(this._uniqueId + "_setButton");
                  this.own(
                    e
                      .byId(this._uniqueId + "_cancelButton")
                      .on("click", m.hitch(this.dropDown, "onCancel"))
                  );
                  this._urlInput &&
                    this.own(
                      this._urlInput.on(
                        "change",
                        m.hitch(this, "_checkAndFixInput")
                      )
                    );
                  this._textInput &&
                    this.own(
                      this._textInput.on(
                        "change",
                        m.hitch(this, "_checkAndFixInput")
                      )
                    );
                  this._urlRegExp = new RegExp("^" + this.urlRegExp + "$", "i");
                  this._emailRegExp = new RegExp(
                    "^" + this.emailRegExp + "$",
                    "i"
                  );
                  this._urlInput.isValid = m.hitch(this, function() {
                    var a = this._urlInput.get("value");
                    return this._urlRegExp.test(a) || this._emailRegExp.test(a);
                  });
                  this.own(
                    h(
                      d.domNode,
                      "keydown",
                      m.hitch(
                        this,
                        m.hitch(this, function(a) {
                          !a ||
                            a.keyCode != v.ENTER ||
                            a.shiftKey ||
                            a.metaKey ||
                            a.ctrlKey ||
                            a.altKey ||
                            this._setButton.get("disabled") ||
                            (d.onExecute(), d.execute(d.get("value")));
                        })
                      )
                    )
                  );
                  a();
                })
              );
            },
            _checkAndFixInput: function() {
              var a = this,
                b = this._urlInput.get("value");
              this._delayedCheck &&
                (clearTimeout(this._delayedCheck), (this._delayedCheck = null));
              this._delayedCheck = setTimeout(function() {
                var c = b,
                  e = !1,
                  d = !1;
                c &&
                  1 < c.length &&
                  ((c = m.trim(c)),
                  0 !== c.indexOf("mailto:") &&
                    (0 < c.indexOf("/")
                      ? -1 === c.indexOf("://") &&
                        "/" !== c.charAt(0) &&
                        c.indexOf("./") &&
                        0 !== c.indexOf("../") &&
                        a._hostRxp.test(c) &&
                        (e = !0)
                      : a._userAtRxp.test(c) && (d = !0)));
                e && a._urlInput.set("value", "http://" + c);
                d && a._urlInput.set("value", "mailto:" + c);
                a._setButton.set("disabled", !a._isValid());
              }, 250);
            },
            _connectTagEvents: function() {
              this.editor.onLoadDeferred.then(
                m.hitch(this, function() {
                  this.own(
                    h(
                      this.editor.editNode,
                      "mouseup",
                      m.hitch(this, "_onMouseUp")
                    )
                  );
                  this.own(
                    h(
                      this.editor.editNode,
                      "dblclick",
                      m.hitch(this, "_onDblClick")
                    )
                  );
                })
              );
            },
            _isValid: function() {
              return this._urlInput.isValid() && this._textInput.isValid();
            },
            _setContent: function(a) {
              this.dropDown.set({ parserScope: "dojo", content: a });
            },
            _checkValues: function(a) {
              a &&
                a.urlInput &&
                (a.urlInput = a.urlInput.replace(/"/g, "\x26quot;"));
              return a;
            },
            _createlinkEnabledImpl: function() {
              return !0;
            },
            setValue: function(a) {
              this._onCloseDialog();
              if (9 > f("ie")) {
                var c = b.getSelection(this.editor.window).getRangeAt(0)
                  .endContainer;
                3 === c.nodeType && (c = c.parentNode);
                c &&
                  c.nodeName &&
                  c.nodeName.toLowerCase() !== this.tag &&
                  (c = this.editor.selection.getSelectedElement(this.tag));
                c &&
                  c.nodeName &&
                  c.nodeName.toLowerCase() === this.tag &&
                  this.editor.queryCommandEnabled("unlink") &&
                  (this.editor.selection.selectElementChildren(c),
                  this.editor.execCommand("unlink"));
              }
              a = this._checkValues(a);
              this.editor.execCommand(
                "inserthtml",
                t.substitute(this.htmlTemplate, a)
              );
              d("a", this.editor.document).forEach(function(a) {
                a.innerHTML || u.has(a, "name") || a.parentNode.removeChild(a);
              }, this);
            },
            _onCloseDialog: function() {
              this.editor.focused && this.editor.focus();
            },
            _getCurrentValues: function(a) {
              var b, c, e;
              a && a.tagName.toLowerCase() === this.tag
                ? ((b = a.getAttribute("_djrealurl") || a.getAttribute("href")),
                  (e = a.getAttribute("target") || "_self"),
                  (c = a.textContent || a.innerText),
                  this.editor.selection.selectElement(a, !0))
                : (c = this.editor.selection.getSelectedText());
              return {
                urlInput: b || "",
                textInput: c || "",
                targetSelect: e || ""
              };
            },
            _onOpenDialog: function() {
              var a, d;
              if (f("ie")) {
                if (((d = b.getSelection(this.editor.window)), d.rangeCount)) {
                  var g = d.getRangeAt(0);
                  a = g.endContainer;
                  3 === a.nodeType && (a = a.parentNode);
                  a &&
                    a.nodeName &&
                    a.nodeName.toLowerCase() !== this.tag &&
                    (a = this.editor.selection.getSelectedElement(this.tag));
                  if (
                    !a ||
                    (a.nodeName && a.nodeName.toLowerCase() !== this.tag)
                  )
                    (d = this.editor.selection.getAncestorElement(this.tag)) &&
                    d.nodeName &&
                    d.nodeName.toLowerCase() == this.tag
                      ? ((a = d), this.editor.selection.selectElement(a))
                      : g.startContainer === g.endContainer &&
                        (d = g.startContainer.firstChild) &&
                        d.nodeName &&
                        d.nodeName.toLowerCase() == this.tag &&
                        ((a = d), this.editor.selection.selectElement(a));
                }
              } else a = this.editor.selection.getAncestorElement(this.tag);
              this.dropDown.reset();
              this._setButton.set("disabled", !0);
              this.dropDown.set("value", this._getCurrentValues(a));
            },
            _onDblClick: function(a) {
              if (
                a &&
                a.target &&
                ((a = a.target),
                (a.tagName ? a.tagName.toLowerCase() : "") === this.tag &&
                  u.get(a, "href"))
              ) {
                var b = this.editor;
                this.editor.selection.selectElement(a);
                b.onDisplayChanged();
                b._updateTimer &&
                  (b._updateTimer.remove(), delete b._updateTimer);
                b.onNormalizedDisplayChanged();
                var c = this.button;
                setTimeout(function() {
                  c.set("disabled", !1);
                  c.loadAndOpenDropDown().then(function() {
                    c.dropDown.focus && c.dropDown.focus();
                  });
                }, 10);
              }
            },
            _onMouseUp: function() {
              if (f("ff")) {
                var a = this.editor.selection.getAncestorElement(this.tag);
                if (a) {
                  var d = b.getSelection(this.editor.window).getRangeAt(0);
                  if (d.collapsed && a.childNodes.length) {
                    var g = d.cloneRange();
                    g.selectNodeContents(a.childNodes[a.childNodes.length - 1]);
                    g.setStart(a.childNodes[0], 0);
                    1 !== d.compareBoundaryPoints(g.START_TO_START, g)
                      ? d.setStartBefore(a)
                      : -1 !== d.compareBoundaryPoints(g.END_TO_START, g) &&
                        d.setStartAfter(a);
                  }
                }
              }
            }
          }),
          n = q("dijit._editor.plugins.ImgLinkDialog", [a], {
            linkDialogTemplate:
              "\x3ctable role\x3d'presentation'\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_urlInput'\x3e${url}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput dojoType\x3d'dijit.form.ValidationTextBox' regExp\x3d'${urlRegExp}' required\x3d'true' id\x3d'${id}_urlInput' name\x3d'urlInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_textInput'\x3e${text}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'false' id\x3d'${id}_textInput' name\x3d'textInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'submit' id\x3d'${id}_setButton'\x3e${set}\x3c/button\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'button' id\x3d'${id}_cancelButton'\x3e${buttonCancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
            htmlTemplate:
              '\x3cimg src\x3d"${urlInput}" _djrealurl\x3d"${urlInput}" alt\x3d"${textInput}" /\x3e',
            tag: "img",
            _getCurrentValues: function(a) {
              var b, c;
              a && a.tagName.toLowerCase() === this.tag
                ? ((b = a.getAttribute("_djrealurl") || a.getAttribute("src")),
                  (c = a.getAttribute("alt")),
                  this.editor.selection.selectElement(a, !0))
                : (c = this.editor.selection.getSelectedText());
              return { urlInput: b || "", textInput: c || "" };
            },
            _isValid: function() {
              return this._urlInput.isValid();
            },
            _connectTagEvents: function() {
              this.inherited(arguments);
              this.editor.onLoadDeferred.then(
                m.hitch(this, function() {
                  this.own(
                    h(
                      this.editor.editNode,
                      "mousedown",
                      m.hitch(this, "_selectTag")
                    )
                  );
                })
              );
            },
            _selectTag: function(a) {
              a &&
                a.target &&
                ((a = a.target),
                (a.tagName ? a.tagName.toLowerCase() : "") === this.tag &&
                  this.editor.selection.selectElement(a));
            },
            _checkValues: function(a) {
              a &&
                a.urlInput &&
                (a.urlInput = a.urlInput.replace(/"/g, "\x26quot;"));
              a &&
                a.textInput &&
                (a.textInput = a.textInput.replace(/"/g, "\x26quot;"));
              return a;
            },
            _onDblClick: function(a) {
              if (
                a &&
                a.target &&
                ((a = a.target),
                (a.tagName ? a.tagName.toLowerCase() : "") === this.tag &&
                  u.get(a, "src"))
              ) {
                var b = this.editor;
                this.editor.selection.selectElement(a);
                b.onDisplayChanged();
                b._updateTimer &&
                  (b._updateTimer.remove(), delete b._updateTimer);
                b.onNormalizedDisplayChanged();
                var c = this.button;
                setTimeout(function() {
                  c.set("disabled", !1);
                  c.loadAndOpenDropDown().then(function() {
                    c.dropDown.focus && c.dropDown.focus();
                  });
                }, 10);
              }
            }
          });
        l.registry.createLink = function() {
          return new a({ command: "createLink" });
        };
        l.registry.insertImage = function() {
          return new n({ command: "insertImage" });
        };
        a.ImgLinkDialog = n;
        return a;
      });
    },
    "dijit/_editor/plugins/TextColor": function() {
      define("require dojo/colors dojo/_base/declare dojo/_base/lang ../_Plugin ../../form/DropDownButton".split(
        " "
      ), function(r, q, u, v, m, h) {
        var f = u("dijit._editor.plugins.TextColor", m, {
          buttonClass: h,
          colorPicker: "dijit/ColorPalette",
          useDefaultCommand: !1,
          _initButton: function() {
            this.command = this.name;
            this.inherited(arguments);
            var d = this;
            this.button.loadDropDown = function(f) {
              function h(h) {
                d.button.dropDown = new h({
                  dir: d.editor.dir,
                  ownerDocument: d.editor.ownerDocument,
                  value: d.value,
                  onChange: function(b) {
                    d.editor.execCommand(d.command, b);
                  },
                  onExecute: function() {
                    d.editor.execCommand(d.command, this.get("value"));
                  }
                });
                f();
              }
              "string" == typeof d.colorPicker
                ? r([d.colorPicker], h)
                : h(d.colorPicker);
            };
          },
          updateState: function() {
            var d = this.editor,
              f = this.command;
            if (d && d.isLoaded && f.length) {
              if (this.button) {
                var h = this.get("disabled");
                this.button.set("disabled", h);
                if (h) return;
                var m;
                try {
                  m = d.queryCommandValue(f) || "";
                } catch (b) {
                  m = "";
                }
              }
              "" == m && (m = "#000000");
              "transparent" == m && (m = "#ffffff");
              "string" == typeof m
                ? -1 < m.indexOf("rgb") && (m = q.fromRgb(m).toHex())
                : ((m = (
                    ((m & 255) << 16) |
                    (m & 65280) |
                    ((m & 16711680) >>> 16)
                  ).toString(16)),
                  (m = "#000000".slice(0, 7 - m.length) + m));
              this.value = m;
              (d = this.button.dropDown) &&
                d.get &&
                m !== d.get("value") &&
                d.set("value", m, !1);
            }
          }
        });
        m.registry.foreColor = function(d) {
          return new f(d);
        };
        m.registry.hiliteColor = function(d) {
          return new f(d);
        };
        return f;
      });
    },
    "esri/dijit/editing/AttachmentEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/kernel dojo/has dojo/query dojo/io-query dojo/dom-attr dijit/_Widget dijit/_Templated dijit/ProgressBar ../../kernel ../../lang ../../domUtils dojo/text!./templates/AttachmentEditor.html dojo/i18n!../../nls/jsapi dojo/NodeList-dom".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a, n, c, k, g) {
        r = r([l, x], {
          declaredClass: "esri.dijit.editing.AttachmentEditor",
          widgetsInTemplate: !0,
          templateString: k,
          _listHtml:
            "\x3cspan id\x3d'node_${oid}_${attid}' style\x3d'display: flex;'\x3e\x3ca href\x3d'${href}' target\x3d'_blank'\x3e${name}\x3c/a\x3e",
          _deleteBtnHtml:
            "\x3cspan style\x3d'cursor:pointer;color:red;font-weight:bold;padding:0 2px;' class\x3d'deleteAttachment' id\x3d'${attid}');'\x3eX\x3c/span\x3e",
          _endHtml: "\x3cbr/\x3e\x3c/span\x3e",
          _aeConnects: [],
          _layerEditingCapChecked: {},
          _layerEditingCap: {},
          constructor: function(a, b) {
            q.mixin(this, g.widgets.attachmentEditor);
          },
          startup: function() {
            this.inherited(arguments);
            this._uploadField_connect = u.connect(
              this._uploadField,
              "onchange",
              this,
              function() {
                0 < this._uploadField.value.length && this._addAttachment();
              }
            );
            this._uploadFieldFocus_connect = u.connect(
              this._uploadField,
              "onfocus",
              q.hitch(this, function(a) {
                c.hide(this._attachmentError);
              })
            );
          },
          destroy: function() {
            v.forEach(this._aeConnects, u.disconnect);
            u.disconnect(this._uploadField_connect);
            u.disconnect(this._uploadFieldFocus_connect);
            this.inherited(arguments);
          },
          showAttachments: function(a, b) {
            this._attachmentList.innerHTML = this.NLS_none;
            this._uploadField.value = "";
            v.forEach(this.domNode.children, function(a, b) {
              c.show(a);
            });
            c.hide(this._attachmentError);
            a &&
              (this._featureLayer = a.getLayer() || b) &&
              ("esri.layers.FeatureLayer" ===
                this._featureLayer.declaredClass &&
              this._featureLayer.getEditCapabilities
                ? ((this._currentLayerId = this._featureLayer.id),
                  this._layerEditingCapChecked[this._currentLayerId] ||
                    ((this._layerEditingCap[
                      this._currentLayerId
                    ] = this._featureLayer.getEditCapabilities()),
                    (this._layerEditingCapChecked[this._currentLayerId] = !0)),
                  (this._featureCanUpdate = this._featureLayer.getEditCapabilities(
                    { feature: a }
                  ).canUpdate),
                  (this._oid = a.attributes[this._featureLayer.objectIdField]),
                  this._getAttachments(a))
                : (b && b.getEditCapabilities()) ||
                  (c.hide(this._uploadForm),
                  v.forEach(this.domNode.children, function(a, b) {
                    c.hide(a);
                  })));
          },
          _getAttachments: function(a) {
            this._featureLayer &&
              this._featureLayer.queryAttachmentInfos &&
              this._featureLayer.queryAttachmentInfos(
                this._oid,
                q.hitch(this, "_onQueryAttachmentInfosComplete")
              );
          },
          _addAttachment: function() {
            c.hide(this._attachmentError);
            this._featureLayer && this._featureLayer.addAttachment
              ? (c.show(this._attachmentProgress),
                this._featureLayer.addAttachment(
                  this._oid,
                  this._uploadForm,
                  q.hitch(this, "_onAddAttachmentComplete"),
                  q.hitch(this, "_onAddAttachmentError")
                ))
              : (this._tempUpload = this._uploadForm);
          },
          _chainAttachment: function(a, b) {
            this._tempUpload &&
              (c.show(this._attachmentProgress),
              b.addAttachment(
                a,
                this._tempUpload,
                q.hitch(this, "_onAddAttachmentComplete"),
                q.hitch(this, "_onAddAttachmentError")
              ));
            this._tempUpload = null;
          },
          _deleteAttachment: function(a, b) {
            c.show(this._attachmentProgress);
            this._featureLayer.deleteAttachments(
              a,
              [b],
              q.hitch(this, "_onDeleteAttachmentComplete")
            );
          },
          _onQueryAttachmentInfosComplete: function(a) {
            var b = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._uploadForm.style.display = "block";
            (!this._featureCanUpdate &&
              this._layerEditingCap[this._currentLayerId].canUpdate) ||
            (!this._layerEditingCap[this._currentLayerId].canCreate &&
              !this._layerEditingCap[this._currentLayerId].canUpdate)
              ? ((b = this._listHtml + this._endHtml),
                (this._uploadForm.style.display = "none"))
              : this._layerEditingCap[this._currentLayerId].canCreate &&
                !this._layerEditingCap[this._currentLayerId].canUpdate &&
                (b = this._listHtml + this._endHtml);
            var c = this._attachmentList;
            a = v.map(
              a,
              q.hitch(this, function(a) {
                return n.substitute(
                  { href: a.url, name: a.name, oid: a.objectId, attid: a.id },
                  b
                );
              })
            );
            c.innerHTML = a.join("") || this.NLS_none;
            this._updateConnects();
          },
          _onAddAttachmentComplete: function(a) {
            c.hide(this._attachmentProgress.domNode);
            var b = this._attachmentList,
              e = this._uploadField,
              g = e.value,
              k = g.lastIndexOf("\\");
            -1 < k && (g = g.substring(k + 1, g.length));
            var g = g.replace(/\ /g, "_"),
              k = d.objectToQuery({
                gdbVersion: this._featureLayer.gdbVersion,
                token: this._featureLayer._getToken()
              }),
              f = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._layerEditingCap[this._currentLayerId].canCreate &&
              !this._layerEditingCap[this._currentLayerId].canUpdate &&
              (f = this._listHtml + this._endHtml);
            a = n.substitute(
              {
                href:
                  this._featureLayer._url.path +
                  "/" +
                  a.objectId +
                  "/attachments/" +
                  a.attachmentId +
                  (k ? "?" + k : ""),
                name: g,
                oid: a.objectId,
                attid: a.attachmentId
              },
              f
            );
            b.innerHTML = b.innerHTML == this.NLS_none ? a : b.innerHTML + a;
            this._updateConnects();
            e.value = "";
          },
          _onAddAttachmentError: function(a) {
            c.hide(this._attachmentProgress.domNode);
            if (a && n.isDefined(a.code)) {
              var b = this._attachmentError;
              t.set(
                b,
                "innerHTML",
                (400 === a.code
                  ? this.NLS_fileNotSupported
                  : a.message ||
                    (a.details && a.details.length && a.details[0])) ||
                  this.NLS_error
              );
              c.show(b);
            }
          },
          _onDeleteAttachmentComplete: function(a) {
            c.hide(this._attachmentProgress.domNode);
            var b = this._attachmentList;
            v.every(a, function(a) {
              return a.success;
            }) &&
              (m
                .query("#node_" + a[0].objectId + "_" + a[0].attachmentId)
                .orphan(),
              (b.children && b.children.length) ||
                (b.innerHTML = this.NLS_none));
          },
          _updateConnects: function() {
            v.forEach(this._aeConnects, u.disconnect);
            m.query(".deleteAttachment").forEach(function(a) {
              this._aeConnects.push(
                u.connect(
                  a,
                  "onclick",
                  q.hitch(this, "_deleteAttachment", this._oid, a.id)
                )
              );
            }, this);
          }
        });
        h("extend-esri") && q.setObject("dijit.editing.AttachmentEditor", r, a);
        return r;
      });
    },
    "dijit/ProgressBar": function() {
      define("require dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/number ./_Widget ./_TemplatedMixin dojo/text!./templates/ProgressBar.html".split(
        " "
      ), function(r, q, u, v, m, h, f, d) {
        return q("dijit.ProgressBar", [h, f], {
          progress: "0",
          value: "",
          maximum: 100,
          places: 0,
          indeterminate: !1,
          label: "",
          name: "",
          templateString: d,
          _indeterminateHighContrastImagePath: r.toUrl(
            "./themes/a11y/indeterminate_progress.gif"
          ),
          postMixInProperties: function() {
            this.inherited(arguments);
            (this.params && "value" in this.params) ||
              (this.value = this.indeterminate ? Infinity : this.progress);
          },
          buildRendering: function() {
            this.inherited(arguments);
            this.indeterminateHighContrastImage.setAttribute(
              "src",
              this._indeterminateHighContrastImagePath.toString()
            );
            this.update();
          },
          _setDirAttr: function(d) {
            var f = "rtl" == d.toLowerCase();
            u.toggle(this.domNode, "dijitProgressBarRtl", f);
            u.toggle(
              this.domNode,
              "dijitProgressBarIndeterminateRtl",
              this.indeterminate && f
            );
            this.inherited(arguments);
          },
          update: function(d) {
            v.mixin(this, d || {});
            d = this.internalProgress;
            var f = this.domNode,
              h = 1;
            this.indeterminate
              ? f.removeAttribute("aria-valuenow")
              : (-1 != String(this.progress).indexOf("%")
                  ? ((h = Math.min(parseFloat(this.progress) / 100, 1)),
                    (this.progress = h * this.maximum))
                  : ((this.progress = Math.min(this.progress, this.maximum)),
                    (h = this.maximum ? this.progress / this.maximum : 0)),
                f.setAttribute("aria-valuenow", this.progress));
            f.setAttribute("aria-labelledby", this.labelNode.id);
            f.setAttribute("aria-valuemin", 0);
            f.setAttribute("aria-valuemax", this.maximum);
            this.labelNode.innerHTML = this.report(h);
            u.toggle(
              this.domNode,
              "dijitProgressBarIndeterminate",
              this.indeterminate
            );
            u.toggle(
              this.domNode,
              "dijitProgressBarIndeterminateRtl",
              this.indeterminate && !this.isLeftToRight()
            );
            d.style.width = 100 * h + "%";
            this.onChange();
          },
          _setValueAttr: function(d) {
            this._set("value", d);
            Infinity == d
              ? this.update({ indeterminate: !0 })
              : this.update({ indeterminate: !1, progress: d });
          },
          _setLabelAttr: function(d) {
            this._set("label", d);
            this.update();
          },
          _setIndeterminateAttr: function(d) {
            this._set("indeterminate", d);
            this.update();
          },
          report: function(d) {
            return this.label
              ? this.label
              : this.indeterminate
              ? "\x26#160;"
              : m.format(d, {
                  type: "percent",
                  places: this.places,
                  locale: this.lang
                });
          },
          onChange: function() {}
        });
      });
    },
    "esri/dijit/editing/Util": function() {
      define([
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/has",
        "../../kernel"
      ], function(r, q, u, v) {
        var m = {},
          m = {
            findFeatures: function(h, f, d) {
              var m = f.objectIdField;
              f = q.filter(f.graphics, function(d) {
                return q.some(h, function(f) {
                  return d.attributes[m] === f.objectId;
                });
              });
              if (d) d(f);
              else return f;
            },
            getSelection: function(h) {
              var f = [];
              q.forEach(h, function(d) {
                d = d.getSelectedFeatures();
                q.forEach(d, function(d) {
                  f.push(d);
                });
              });
              return f;
            },
            sortFeaturesById: function(h, f) {
              var d = q.map(h, function(d) {
                return d.featureLayer;
              });
              f.sort(function(f, h) {
                var l = f.getLayer(),
                  b = h.getLayer();
                if (!l) return -1;
                if (!b) return 1;
                var a = q.indexOf(d, l),
                  b = q.indexOf(d, b),
                  a = a - b;
                a ||
                  ((l = l.objectIdField),
                  (a = f.attributes[l] - h.attributes[l]));
                return a;
              });
              return f;
            }
          };
        u("extend-esri") && r.setObject("dijit.editing.Util.LayerHelper", m, v);
        return m;
      });
    },
    "dojox/date/islamic": function() {
      define([
        "dojox/main",
        "dojo/_base/lang",
        "dojo/date",
        "./islamic/Date"
      ], function(r, q, u, v) {
        var m = q.getObject("date.islamic", !0, r);
        m.getDaysInMonth = function(h) {
          return h.getDaysInIslamicMonth(h.getMonth(), h.getFullYear());
        };
        m.compare = function(h, f, d) {
          h instanceof v && (h = h.toGregorian());
          f instanceof v && (f = f.toGregorian());
          return u.compare.apply(null, arguments);
        };
        m.add = function(h, f, d) {
          var m = new v(h);
          switch (f) {
            case "day":
              m.setDate(h.getDate() + d);
              break;
            case "weekday":
              var l = h.getDay();
              if (5 > l + d && 0 < l + d) m.setDate(h.getDate() + d);
              else {
                var q = (f = 0);
                5 == l
                  ? ((l = 4), (q = 0 < d ? -1 : 1))
                  : 6 == l && ((l = 4), (q = 0 < d ? -2 : 2));
                var l = 0 < d ? 5 - l - 1 : -l,
                  b = d - l,
                  a = parseInt(b / 5);
                0 != b % 5 && (f = 0 < d ? 2 : -2);
                f = f + 7 * a + (b % 5) + l;
                m.setDate(h.getDate() + f + q);
              }
              break;
            case "year":
              m.setFullYear(h.getFullYear() + d);
              break;
            case "week":
              d *= 7;
              m.setDate(h.getDate() + d);
              break;
            case "month":
              h = h.getMonth();
              m.setMonth(h + d);
              break;
            case "hour":
              m.setHours(h.getHours() + d);
              break;
            case "minute":
              m._addMinutes(d);
              break;
            case "second":
              m._addSeconds(d);
              break;
            case "millisecond":
              m._addMilliseconds(d);
          }
          return m;
        };
        m.difference = function(h, f, d) {
          f = f || new v();
          d = d || "day";
          var q = f.getFullYear() - h.getFullYear(),
            l = 1;
          switch (d) {
            case "weekday":
              q = Math.round(m.difference(h, f, "day"));
              l = parseInt(m.difference(h, f, "week"));
              if (0 == q % 7) q = 5 * l;
              else {
                d = 0;
                var r = h.getDay(),
                  b = f.getDay(),
                  l = parseInt(q / 7);
                f = q % 7;
                h = new v(h);
                h.setDate(h.getDate() + 7 * l);
                h = h.getDay();
                if (0 < q)
                  switch (!0) {
                    case 5 == r:
                      d = -1;
                      break;
                    case 6 == r:
                      d = 0;
                      break;
                    case 5 == b:
                      d = -1;
                      break;
                    case 6 == b:
                      d = -2;
                      break;
                    case 5 < h + f:
                      d = -2;
                  }
                else if (0 > q)
                  switch (!0) {
                    case 5 == r:
                      d = 0;
                      break;
                    case 6 == r:
                      d = 1;
                      break;
                    case 5 == b:
                      d = 2;
                      break;
                    case 6 == b:
                      d = 1;
                      break;
                    case 0 > h + f:
                      d = 2;
                  }
                q = q + d - 2 * l;
              }
              l = q;
              break;
            case "year":
              l = q;
              break;
            case "month":
              d = f.toGregorian() > h.toGregorian() ? f : h;
              r = f.toGregorian() > h.toGregorian() ? h : f;
              l = d.getMonth();
              b = r.getMonth();
              if (0 == q) l = d.getMonth() - r.getMonth();
              else
                for (
                  l = 12 - b + l,
                    q = r.getFullYear() + 1,
                    d = d.getFullYear(),
                    q;
                  q < d;
                  q++
                )
                  l += 12;
              f.toGregorian() < h.toGregorian() && (l = -l);
              break;
            case "week":
              l = parseInt(m.difference(h, f, "day") / 7);
              break;
            case "day":
              l /= 24;
            case "hour":
              l /= 60;
            case "minute":
              l /= 60;
            case "second":
              l /= 1e3;
            case "millisecond":
              l *= f.toGregorian().getTime() - h.toGregorian().getTime();
          }
          return Math.round(l);
        };
        return m;
      });
    },
    "dojox/date/islamic/Date": function() {
      define(["dojo/_base/lang", "dojo/_base/declare", "dojo/date"], function(
        r,
        q,
        u
      ) {
        var v = q("dojox.date.islamic.Date", null, {
          _date: 0,
          _month: 0,
          _year: 0,
          _hours: 0,
          _minutes: 0,
          _seconds: 0,
          _milliseconds: 0,
          _day: 0,
          _GREGORIAN_EPOCH: 1721425.5,
          _ISLAMIC_EPOCH: 1948439.5,
          constructor: function() {
            var m = arguments.length;
            m
              ? 1 == m
                ? ((m = arguments[0]),
                  "number" == typeof m && (m = new Date(m)),
                  m instanceof Date
                    ? this.fromGregorian(m)
                    : "" == m
                    ? (this._date = new Date(""))
                    : ((this._year = m._year),
                      (this._month = m._month),
                      (this._date = m._date),
                      (this._hours = m._hours),
                      (this._minutes = m._minutes),
                      (this._seconds = m._seconds),
                      (this._milliseconds = m._milliseconds)))
                : 3 <= m &&
                  ((this._year += arguments[0]),
                  (this._month += arguments[1]),
                  (this._date += arguments[2]),
                  (this._hours += arguments[3] || 0),
                  (this._minutes += arguments[4] || 0),
                  (this._seconds += arguments[5] || 0),
                  (this._milliseconds += arguments[6] || 0))
              : this.fromGregorian(new Date());
          },
          getDate: function() {
            return this._date;
          },
          getMonth: function() {
            return this._month;
          },
          getFullYear: function() {
            return this._year;
          },
          getDay: function() {
            return this.toGregorian().getDay();
          },
          getHours: function() {
            return this._hours;
          },
          getMinutes: function() {
            return this._minutes;
          },
          getSeconds: function() {
            return this._seconds;
          },
          getMilliseconds: function() {
            return this._milliseconds;
          },
          setDate: function(m) {
            m = parseInt(m);
            if (
              !(
                0 < m &&
                m <= this.getDaysInIslamicMonth(this._month, this._year)
              )
            ) {
              var h;
              if (0 < m)
                for (
                  h = this.getDaysInIslamicMonth(this._month, this._year);
                  m > h;
                  m -= h,
                    h = this.getDaysInIslamicMonth(this._month, this._year)
                )
                  this._month++,
                    12 <= this._month && (this._year++, (this._month -= 12));
              else
                for (
                  h = this.getDaysInIslamicMonth(
                    0 <= this._month - 1 ? this._month - 1 : 11,
                    0 <= this._month - 1 ? this._year : this._year - 1
                  );
                  0 >= m;
                  h = this.getDaysInIslamicMonth(
                    0 <= this._month - 1 ? this._month - 1 : 11,
                    0 <= this._month - 1 ? this._year : this._year - 1
                  )
                )
                  this._month--,
                    0 > this._month && (this._year--, (this._month += 12)),
                    (m += h);
            }
            this._date = m;
            return this;
          },
          setFullYear: function(m) {
            this._year = +m;
          },
          setMonth: function(m) {
            this._year += Math.floor(m / 12);
            this._month =
              0 < m ? Math.floor(m % 12) : Math.floor(((m % 12) + 12) % 12);
          },
          setHours: function() {
            var m = arguments.length,
              h = 0;
            1 <= m && (h = parseInt(arguments[0]));
            2 <= m && (this._minutes = parseInt(arguments[1]));
            3 <= m && (this._seconds = parseInt(arguments[2]));
            4 == m && (this._milliseconds = parseInt(arguments[3]));
            for (; 24 <= h; )
              this._date++,
                (m = this.getDaysInIslamicMonth(this._month, this._year)),
                this._date > m &&
                  (this._month++,
                  12 <= this._month && (this._year++, (this._month -= 12)),
                  (this._date -= m)),
                (h -= 24);
            this._hours = h;
          },
          _addMinutes: function(m) {
            m += this._minutes;
            this.setMinutes(m);
            this.setHours(this._hours + parseInt(m / 60));
            return this;
          },
          _addSeconds: function(m) {
            m += this._seconds;
            this.setSeconds(m);
            this._addMinutes(parseInt(m / 60));
            return this;
          },
          _addMilliseconds: function(m) {
            m += this._milliseconds;
            this.setMilliseconds(m);
            this._addSeconds(parseInt(m / 1e3));
            return this;
          },
          setMinutes: function(m) {
            this._minutes = m % 60;
            return this;
          },
          setSeconds: function(m) {
            this._seconds = m % 60;
            return this;
          },
          setMilliseconds: function(m) {
            this._milliseconds = m % 1e3;
            return this;
          },
          toString: function() {
            if (isNaN(this._date)) return "Invalidate Date";
            var m = new Date();
            m.setHours(this._hours);
            m.setMinutes(this._minutes);
            m.setSeconds(this._seconds);
            m.setMilliseconds(this._milliseconds);
            return (
              this._month +
              " " +
              this._date +
              " " +
              this._year +
              " " +
              m.toTimeString()
            );
          },
          toGregorian: function() {
            var m = this._year,
              m =
                Math.floor(
                  this._date +
                    Math.ceil(29.5 * this._month) +
                    354 * (m - 1) +
                    Math.floor((3 + 11 * m) / 30) +
                    this._ISLAMIC_EPOCH -
                    1 -
                    0.5
                ) + 0.5,
              h = m - this._GREGORIAN_EPOCH,
              f = Math.floor(h / 146097),
              d = this._mod(h, 146097),
              h = Math.floor(d / 36524),
              q = this._mod(d, 36524),
              d = Math.floor(q / 1461),
              q = this._mod(q, 1461),
              q = Math.floor(q / 365),
              f = 400 * f + 100 * h + 4 * d + q;
            4 != h && 4 != q && f++;
            h =
              m -
              (this._GREGORIAN_EPOCH +
                365 * (f - 1) +
                Math.floor((f - 1) / 4) -
                Math.floor((f - 1) / 100) +
                Math.floor((f - 1) / 400));
            d =
              this._GREGORIAN_EPOCH -
              1 +
              365 * (f - 1) +
              Math.floor((f - 1) / 4) -
              Math.floor((f - 1) / 100) +
              Math.floor((f - 1) / 400) +
              Math.floor(
                739 / 12 + (u.isLeapYear(new Date(f, 3, 1)) ? -1 : -2) + 1
              );
            d = m < d ? 0 : u.isLeapYear(new Date(f, 3, 1)) ? 1 : 2;
            h = Math.floor((12 * (h + d) + 373) / 367);
            d =
              this._GREGORIAN_EPOCH -
              1 +
              365 * (f - 1) +
              Math.floor((f - 1) / 4) -
              Math.floor((f - 1) / 100) +
              Math.floor((f - 1) / 400) +
              Math.floor(
                (367 * h - 362) / 12 +
                  (2 >= h ? 0 : u.isLeapYear(new Date(f, h - 1, 1)) ? -1 : -2) +
                  1
              );
            return new Date(
              f,
              h - 1,
              m - d + 1,
              this._hours,
              this._minutes,
              this._seconds,
              this._milliseconds
            );
          },
          fromGregorian: function(m) {
            m = new Date(m);
            var h = m.getFullYear(),
              f = m.getMonth(),
              d = m.getDate(),
              h =
                this._GREGORIAN_EPOCH -
                1 +
                365 * (h - 1) +
                Math.floor((h - 1) / 4) +
                -Math.floor((h - 1) / 100) +
                Math.floor((h - 1) / 400) +
                Math.floor(
                  (367 * (f + 1) - 362) / 12 +
                    (2 >= f + 1 ? 0 : u.isLeapYear(m) ? -1 : -2) +
                    d
                ),
              h = Math.floor(h) + 0.5,
              h = h - this._ISLAMIC_EPOCH,
              f = Math.floor((30 * h + 10646) / 10631),
              d = Math.ceil((h - 29 - this._yearStart(f)) / 29.5),
              d = Math.min(d, 11);
            this._date = Math.ceil(h - this._monthStart(f, d)) + 1;
            this._month = d;
            this._year = f;
            this._hours = m.getHours();
            this._minutes = m.getMinutes();
            this._seconds = m.getSeconds();
            this._milliseconds = m.getMilliseconds();
            this._day = m.getDay();
            return this;
          },
          valueOf: function() {
            return this.toGregorian().valueOf();
          },
          _yearStart: function(m) {
            return 354 * (m - 1) + Math.floor((3 + 11 * m) / 30);
          },
          _monthStart: function(m, h) {
            return (
              Math.ceil(29.5 * h) +
              354 * (m - 1) +
              Math.floor((3 + 11 * m) / 30)
            );
          },
          _civilLeapYear: function(m) {
            return 11 > (14 + 11 * m) % 30;
          },
          getDaysInIslamicMonth: function(m, h) {
            var f = 0,
              f = 29 + ((m + 1) % 2);
            11 == m && this._civilLeapYear(h) && f++;
            return f;
          },
          _mod: function(m, h) {
            return m - h * Math.floor(m / h);
          }
        });
        v.getDaysInIslamicMonth = function(m) {
          return new v().getDaysInIslamicMonth(m.getMonth(), m.getFullYear());
        };
        return v;
      });
    },
    "dojox/date/islamic/locale": function() {
      define("dojox/main dojo/_base/lang dojo/_base/array dojo/date dojo/i18n dojo/regexp dojo/string ./Date dojo/i18n!dojo/cldr/nls/islamic".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t) {
        function l(a, b, g, e, d) {
          return d.replace(/([a-z])\1*/gi, function(c) {
            var e,
              g,
              k = c.charAt(0);
            c = c.length;
            var h = ["abbr", "wide", "narrow"];
            switch (k) {
              case "G":
                e = b.eraAbbr[0];
                break;
              case "y":
                e = String(a.getFullYear());
                break;
              case "M":
                e = a.getMonth();
                3 > c
                  ? ((e += 1), (g = !0))
                  : ((k = ["months-format", h[c - 3]].join("-")),
                    (e = b[k][e]));
                break;
              case "d":
                e = a.getDate(!0);
                g = !0;
                break;
              case "E":
                e = a.getDay();
                3 > c
                  ? ((e += 1), (g = !0))
                  : ((k = ["days-format", h[c - 3]].join("-")), (e = b[k][e]));
                break;
              case "a":
                e = 12 > a.getHours() ? "am" : "pm";
                e = b["dayPeriods-format-wide-" + e];
                break;
              case "h":
              case "H":
              case "K":
              case "k":
                g = a.getHours();
                switch (k) {
                  case "h":
                    e = g % 12 || 12;
                    break;
                  case "H":
                    e = g;
                    break;
                  case "K":
                    e = g % 12;
                    break;
                  case "k":
                    e = g || 24;
                }
                g = !0;
                break;
              case "m":
                e = a.getMinutes();
                g = !0;
                break;
              case "s":
                e = a.getSeconds();
                g = !0;
                break;
              case "S":
                e = Math.round(a.getMilliseconds() * Math.pow(10, c - 3));
                g = !0;
                break;
              case "z":
                if ((e = v.getTimezoneName(a.toGregorian()))) break;
                c = 4;
              case "Z":
                e = a.toGregorian().getTimezoneOffset();
                e = [
                  0 >= e ? "+" : "-",
                  f.pad(Math.floor(Math.abs(e) / 60), 2),
                  f.pad(Math.abs(e) % 60, 2)
                ];
                4 == c && (e.splice(0, 0, "GMT"), e.splice(3, 0, ":"));
                e = e.join("");
                break;
              default:
                throw Error(
                  "dojox.date.islamic.locale.formatPattern: invalid pattern char: " +
                    d
                );
            }
            g && (e = f.pad(e, c));
            return e;
          });
        }
        function x(a, b, g, e) {
          var c = function(a) {
            return a;
          };
          b = b || c;
          g = g || c;
          e = e || c;
          var d = a.match(/(''|[^'])+/g),
            k = "'" == a.charAt(0);
          u.forEach(d, function(a, c) {
            a ? ((d[c] = (k ? g : b)(a)), (k = !k)) : (d[c] = "");
          });
          return e(d.join(""));
        }
        function b(a, b, g, e) {
          e = h.escapeString(e);
          m.normalizeLocale(g.locale);
          return e
            .replace(/([a-z])\1*/gi, function(c) {
              var e;
              e = c.charAt(0);
              var d = c.length,
                k = "";
              g.strict ? 1 < d && (k = "0{" + (d - 1) + "}") : (k = "0?");
              switch (e) {
                case "y":
                  e = "\\d+";
                  break;
                case "M":
                  e = 2 < d ? "\\S+ ?\\S+" : k + "[1-9]|1[0-2]";
                  break;
                case "d":
                  e = "[12]\\d|" + k + "[1-9]|3[01]";
                  break;
                case "E":
                  e = "\\S+";
                  break;
                case "h":
                  e = k + "[1-9]|1[0-2]";
                  break;
                case "k":
                  e = k + "\\d|1[01]";
                  break;
                case "H":
                  e = k + "\\d|1\\d|2[0-3]";
                  break;
                case "K":
                  e = k + "[1-9]|1\\d|2[0-4]";
                  break;
                case "m":
                case "s":
                  e = k + "\\d|[0-5]\\d";
                  break;
                case "S":
                  e = "\\d{" + d + "}";
                  break;
                case "a":
                  d = g.am || b["dayPeriods-format-wide-am"];
                  k = g.pm || b["dayPeriods-format-wide-pm"];
                  g.strict
                    ? (e = d + "|" + k)
                    : ((e = d + "|" + k),
                      d != d.toLowerCase() && (e += "|" + d.toLowerCase()),
                      k != k.toLowerCase() && (e += "|" + k.toLowerCase()));
                  break;
                default:
                  e = ".*";
              }
              a && a.push(c);
              return "(" + e + ")";
            })
            .replace(/[\xa0 ]/g, "[\\s\\xa0]");
        }
        var a = q.getObject("date.islamic.locale", !0, r);
        a.format = function(b, d) {
          d = d || {};
          var c = m.normalizeLocale(d.locale),
            e = d.formatLength || "short",
            k = a._getIslamicBundle(c),
            f = [],
            c = q.hitch(this, l, b, k, c, d.fullYear);
          if ("year" == d.selector) return b.getFullYear();
          "time" != d.selector &&
            (b = d.datePattern || k["dateFormat-" + e]) &&
            f.push(x(b, c));
          "date" != d.selector &&
            (d = d.timePattern || k["timeFormat-" + e]) &&
            f.push(x(d, c));
          return f.join(" ");
        };
        a.regexp = function(b) {
          return a._parseInfo(b).regexp;
        };
        a._parseInfo = function(c) {
          c = c || {};
          var d = m.normalizeLocale(c.locale),
            d = a._getIslamicBundle(d),
            g = c.formatLength || "short",
            e = c.datePattern || d["dateFormat-" + g],
            g = c.timePattern || d["timeFormat-" + g],
            f = [];
          return {
            regexp: x(
              "date" == c.selector
                ? e
                : "time" == c.selector
                ? g
                : "undefined" == typeof g
                ? e
                : e + " " + g,
              q.hitch(this, b, f, d, c)
            ),
            tokens: f,
            bundle: d
          };
        };
        a.parse = function(b, k) {
          b = b.replace(/[\u200E\u200F\u202A\u202E]/g, "");
          k || (k = {});
          var c = a._parseInfo(k),
            e = c.tokens,
            f = c.bundle,
            c = c.regexp.replace(/[\u200E\u200F\u202A\u202E]/g, "");
          b = new RegExp("^" + c + "$").exec(b);
          m.normalizeLocale(k.locale);
          if (!b) return null;
          var h = [1389, 0, 1, 0, 0, 0, 0],
            n = "",
            l = ["abbr", "wide", "narrow"];
          u.every(b, function(a, b) {
            if (!b) return !0;
            b = e[b - 1];
            var c = b.length;
            switch (b.charAt(0)) {
              case "y":
                h[0] = Number(a);
                break;
              case "M":
                if (2 < c) {
                  if (
                    ((b = f["months-format-" + l[c - 3]].concat()),
                    k.strict ||
                      ((a = a.replace(".", "").toLowerCase()),
                      (b = u.map(b, function(a) {
                        return a ? a.replace(".", "").toLowerCase() : a;
                      }))),
                    (a = u.indexOf(b, a)),
                    -1 == a)
                  )
                    return !1;
                } else a--;
                h[1] = Number(a);
                break;
              case "D":
                h[1] = 0;
              case "d":
                h[2] = Number(a);
                break;
              case "a":
                b = k.am || f["dayPeriods-format-wide-am"];
                c = k.pm || f["dayPeriods-format-wide-pm"];
                if (!k.strict) {
                  var g = /\./g;
                  a = a.replace(g, "").toLowerCase();
                  b = b.replace(g, "").toLowerCase();
                  c = c.replace(g, "").toLowerCase();
                }
                if (k.strict && a != b && a != c) return !1;
                n = a == c ? "p" : a == b ? "a" : "";
                break;
              case "K":
                24 == a && (a = 0);
              case "h":
              case "H":
              case "k":
                h[3] = Number(a);
                break;
              case "m":
                h[4] = Number(a);
                break;
              case "s":
                h[5] = Number(a);
                break;
              case "S":
                h[6] = Number(a);
            }
            return !0;
          });
          b = +h[3];
          "p" === n && 12 > b
            ? (h[3] = b + 12)
            : "a" === n && 12 == b && (h[3] = 0);
          return new d(h[0], h[1], h[2], h[3], h[4], h[5], h[6]);
        };
        var n = [];
        a.addCustomFormats = function(a, b) {
          n.push({ pkg: a, name: b });
        };
        a._getIslamicBundle = function(a) {
          var b = {};
          u.forEach(
            n,
            function(c) {
              c = m.getLocalization(c.pkg, c.name, a);
              b = q.mixin(b, c);
            },
            this
          );
          return b;
        };
        a.addCustomFormats("dojo.cldr", "islamic");
        a.getNames = function(b, d, g, e, f) {
          var c;
          e = a._getIslamicBundle(e);
          b = [b, g, d];
          "standAlone" == g &&
            ((g = b.join("-")), (c = e[g]), 1 == c[0] && (c = void 0));
          b[1] = "format";
          return (c || e[b.join("-")]).concat();
        };
        a.weekDays = a.getNames("days", "wide", "format");
        a.months = a.getNames("months", "wide", "format");
        return a;
      });
    },
    "widgets/SituationAwareness/js/SummaryInfo": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/array dojo/DeferredList dojo/Deferred dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/on dojo/keys jimu/utils jimu/dijit/Message esri/graphic esri/layers/FeatureLayer esri/tasks/query esri/tasks/QueryTask ./analysisUtils".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a, n, c, k, g) {
        return r("SummaryInfo", [q], {
          summaryLayer: null,
          summaryFields: [],
          summaryIds: [],
          summaryFeatures: [],
          tabNum: null,
          symbolField: null,
          graphicsLayer: null,
          lyrRenderer: null,
          lyrSymbol: null,
          featureCount: 0,
          mapServiceLayer: !1,
          loading: !1,
          queryOnLoad: !1,
          incidentCount: 0,
          allFields: !1,
          configuredPopUpFields: [],
          constructor: function(a, b, c) {
            this.tab = a;
            this.container = b;
            this.parent = c;
            this.config = c.config;
            this.graphicsLayer = null;
            this.baseLabel =
              "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers;
            this.parentNode = c.domNode;
          },
          queryTabCount: function(a, b, c, g) {
            var e = new m();
            this.incidentCount = a.length;
            var d = [this.tab.tabLayers[0]];
            this.mapServiceLayer &&
              1 < this.tab.tabLayers.length &&
              (d = [this.tab.tabLayers[1]]);
            if (
              0 < this.tab.tabLayers.length &&
              this.tab.tabLayers[0].url &&
              -1 < this.tab.tabLayers[0].url.indexOf("MapServer")
            ) {
              this.mapServiceLayer = !0;
              var f;
              "undefined" !== typeof this.tab.tabLayers[0].infoTemplate
                ? ((this.summaryLayer = this.tab.tabLayers[0]),
                  this.summaryLayer.hasOwnProperty("loaded") &&
                  this.summaryLayer.loaded
                    ? ((this.summaryFields = this._getFields(
                        this.summaryLayer
                      )),
                      this._performQuery(a, b, c, g, d).then(function(a) {
                        e.resolve(a);
                      }))
                    : ((f = new n(this.summaryLayer.url)),
                      (f.infoTemplate = this.tab.tabLayers[0].infoTemplate),
                      (d = [f]),
                      (this.tab.tabLayers = d),
                      t(
                        f,
                        "load",
                        h.hitch(this, function() {
                          this.summaryLayer = f;
                          this.summaryFields = this._getFields(
                            this.summaryLayer
                          );
                          this._performQuery(a, b, c, g, d).then(function(a) {
                            e.resolve(a);
                          });
                        })
                      )))
                : this.loading ||
                  ((f = new n(this.tab.tabLayers[0].url)),
                  (this.loading = !0),
                  t(
                    f,
                    "load",
                    h.hitch(this, function() {
                      this.summaryLayer = f;
                      this.summaryFields = this._getFields(this.summaryLayer);
                      for (
                        var k = this.tab.tabLayers[0].url.split(
                            "MapServer/"
                          )[1],
                          h = this.parent.map.itemInfo.itemData
                            .operationalLayers,
                          n = 0;
                        n < h.length;
                        n++
                      ) {
                        var l = h[n];
                        if (
                          -1 < this.tab.tabLayers[0].url.indexOf(l.url) &&
                          "undefined" !== typeof l.layerObject
                        )
                          if (l.layerObject.infoTemplates) {
                            if ((l = l.layerObject.infoTemplates[k])) {
                              f.infoTemplate = l.infoTemplate;
                              break;
                            }
                          } else if (l.layerObject.infoTemplate) {
                            f.infoTemplate = l.layerObject.infoTemplate;
                            break;
                          }
                      }
                      d = [f];
                      this.tab.tabLayers = d;
                      this.loading = !1;
                      this._performQuery(a, b, c, g, d).then(function(a) {
                        e.resolve(a);
                      });
                    })
                  ));
            }
            this.mapServiceLayer ||
              this._performQuery(a, b, c, g, d).then(function(a) {
                e.resolve(a);
              });
            return e;
          },
          _performQuery: function(a, b, c, d, f) {
            var e = new m(),
              k = [],
              n,
              l;
            0 < b.length
              ? (l = g.getGeoms(b))
              : 0 < a.length && (l = g.getGeoms(a));
            this.summaryGeoms = l;
            if (0 < l.length)
              for (a = 0; a < l.length; a++)
                (k = l[a]),
                  (b = g.createDefArray(f, k, this.parent.opLayers, this.tab)),
                  (n = 0 === a ? (k = b) : (k = n.concat(b)));
            new v(k).then(
              h.hitch(this, function(a) {
                for (var b = 0, g = 0; g < a.length; g++) {
                  var f = a[g][1];
                  isNaN(f)
                    ? f && f.features
                      ? (b += f.features.length)
                      : f && "undefined" !== typeof f.length && (b += f.length)
                    : (b += f);
                }
                this.updateTabCount(b, c, d);
                this.queryOnLoad &&
                  h.hitch(this, this._queryFeatures(this.summaryGeoms));
                e.resolve(b);
              })
            );
            return e;
          },
          updateTabCount: function(a, b, c) {
            this.featureCount = a;
            g.updateTabCount(
              this.featureCount,
              b,
              c,
              this.baseLabel,
              this.incidentCount
            );
          },
          updateForIncident: function(a, b, c, d, k, l, q) {
            this.incidentCount = a.length;
            this.allFields =
              "undefined" !== typeof l && "undefined" !== typeof q
                ? l
                  ? !0
                  : q
                : !1;
            var e = "undefined" !== typeof k,
              r;
            this.tabNum = d;
            e
              ? (r = new m())
              : ((this.container.innerHTML = ""),
                f.add(this.container, "loading"));
            this.summaryIds = [];
            this.summaryFeatures = [];
            if (0 < this.tab.tabLayers.length) {
              var w = this.summaryGeoms,
                u;
              "undefined" !== typeof this.tab.tabLayers[0].infoTemplate
                ? ((this.summaryLayer = this.tab.tabLayers[0]),
                  (u = new n(this.summaryLayer.url)),
                  (u.infoTemplate = this.tab.tabLayers[0].infoTemplate),
                  (this.tab.tabLayers[1] = u),
                  (this.summaryFields = this._getFields(this.tab.tabLayers[0])),
                  (this.configuredPopUpFields = g.getPopupConfiguredFields(
                    this.tab.tabLayers[0]
                  )),
                  e
                    ? this._queryFeatures(w, e).then(function(a) {
                        r.resolve(a);
                      })
                    : (this._initGraphicsLayer(c),
                      h.hitch(this, this._queryFeatures(w))))
                : ((u = new n(this.tab.tabLayers[0].url)),
                  t(
                    u,
                    "load",
                    h.hitch(this, function() {
                      this.summaryLayer = u;
                      if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer"))
                        for (
                          var a = this.tab.tabLayers[0].url.split(
                              "MapServer/"
                            )[1],
                            b = this.parent.map.itemInfo.itemData
                              .operationalLayers,
                            d = 0;
                          d < b.length;
                          d++
                        ) {
                          var f = b[d];
                          if (
                            -1 < this.tab.tabLayers[0].url.indexOf(f.url) &&
                            "undefined" !== typeof f.layerObject &&
                            f.layerObject.infoTemplates &&
                            (f = f.layerObject.infoTemplates[a])
                          ) {
                            u.infoTemplate = f.infoTemplate;
                            break;
                          }
                        }
                      this.tab.tabLayers[1] = u;
                      this.summaryLayer = this.tab.tabLayers[1];
                      this.summaryFields = this._getFields(
                        this.tab.tabLayers[1]
                      );
                      this.configuredPopUpFields = g.getPopupConfiguredFields(
                        this.tab.tabLayers[1]
                      );
                      e
                        ? this._queryFeatures(w, e).then(function(a) {
                            r.resolve(a);
                          })
                        : (this._initGraphicsLayer(c),
                          h.hitch(this, this._queryFeatures(w)));
                    })
                  ));
              if (e) return r;
            }
          },
          _initGraphicsLayer: function(a) {
            null !== a &&
              ((this.graphicsLayer = a),
              this.graphicsLayer.clear(),
              this.summaryLayer &&
                this.summaryLayer.renderer &&
                ((this.lyrRenderer = this.summaryLayer.renderer),
                (this.graphicsLayer.renderer = this.lyrRenderer),
                "undefined" !== typeof this.summaryLayer.renderer.attributeField
                  ? (this.symbolField = this.summaryLayer.renderer.attributeField)
                  : (this.lyrSymbol = this.lyrRenderer.symbol)));
          },
          _queryFeatures: function(a, d) {
            var e;
            d && (e = new m());
            for (
              var f = [],
                k =
                  -1 === [null, void 0, ""].indexOf(this.tab.tabLayers[0].id)
                    ? this.tab.tabLayers[0].id
                    : this.tab.layers,
                k = g.getFilter(k, this.parent.opLayers),
                n = new c(),
                l = 0;
              l < a.length;
              l++
            )
              (n.geometry = a[l]),
                (n.where = k),
                f.push(this.summaryLayer.queryIds(n));
            new v(f).then(
              h.hitch(this, function(a) {
                for (var b, c, g = 0; g < a.length; g++)
                  a[g][0] &&
                    ((b = a[g][1]), (c = b = 0 === g ? b : c.concat(b)));
                b
                  ? ((this.summaryIds = b),
                    0 < this.summaryIds.length
                      ? d
                        ? this._queryFeaturesByIds(d).then(function(a) {
                            e.resolve(a);
                          })
                        : this._queryFeaturesByIds()
                      : d || this._processResults())
                  : d || this._processResults();
              }),
              h.hitch(this, function(a) {
                console.error(a);
                new b({ message: a });
              })
            );
            if (d) return e;
          },
          _queryFeaturesByIds: function(a) {
            var e,
              d = [];
            a && (e = new m());
            var n = this.summaryLayer.maxRecordCount || 1e3,
              l = this.summaryIds.slice(0, n);
            this.summaryIds.splice(0, n);
            var q = new c();
            q.where = g.getFilter(this.summaryLayer.id, this.parent.opLayers);
            var t = !1;
            u.some(
              this.summaryFields,
              h.hitch(this, function(a) {
                if (
                  "area" === a.type ||
                  "length" === a.type ||
                  this.graphicsLayer
                )
                  return (t = !0);
              })
            );
            a && (t = !0);
            q.returnGeometry = t;
            q.outSpatialReference = this.parent.map.spatialReference;
            q.outFields = ["*"];
            q.objectIds = l;
            var r = new k(this.summaryLayer.url);
            for (d.push(r.execute(q)); 0 < this.summaryIds.length; )
              (l = this.summaryIds.slice(0, n)),
                this.summaryIds.splice(0, n),
                (q.objectIds = l),
                d.push(r.execute(q));
            new v(d).then(
              h.hitch(this, function(b) {
                this.summaryFeatures = [];
                for (var c = 0; c < b.length; c++)
                  if (b[c][0]) {
                    var g = b[c][1];
                    g.features &&
                      (this.summaryFeatures = this.summaryFeatures.concat(
                        g.features
                      ));
                  }
                a
                  ? this._processResults(a).then(
                      h.hitch(this, function(a) {
                        this.SA_SAT_download &&
                          f.replace(
                            this.SA_SAT_download,
                            "download",
                            "processing"
                          );
                        e.resolve(a);
                      })
                    )
                  : (this._processResults(),
                    this.SA_SAT_download &&
                      f.replace(
                        this.SA_SAT_download,
                        "download",
                        "processing"
                      ));
                this.SA_SAT_download &&
                  f.replace(this.SA_SAT_download, "download", "processing");
              }),
              h.hitch(this, function(a) {
                console.error(a);
                new b({ message: a });
              })
            );
            if (a) return e;
          },
          _prepResults: function() {
            for (var a = 0; a < this.summaryFields.length; a++) {
              var b = this.summaryFields[a],
                c = b.field,
                d = b.total;
              switch (b.type) {
                case "count":
                  d = this.summaryFeatures.length;
                  break;
                case "area":
                  d = g.getArea(
                    this.summaryFeatures,
                    this.summaryGeoms,
                    this.config.distanceSettings,
                    this.config.distanceUnits,
                    this.tab.advStat
                  );
                  break;
                case "length":
                  d = g.getLength(
                    this.summaryFeatures,
                    this.summaryGeoms,
                    this.config.distanceSettings,
                    this.config.distanceUnits,
                    this.tab.advStat
                  );
                  break;
                case "sum":
                  d = g.getSum(this.summaryFeatures, c);
                  break;
                case "avg":
                  d =
                    g.getSum(this.summaryFeatures, c) /
                    this.summaryFeatures.length;
                  break;
                case "min":
                  d = g.getMin(this.summaryFeatures, c);
                  break;
                case "max":
                  d = g.getMax(this.summaryFeatures, c);
              }
              b.total = d;
            }
          },
          _processResults: function(b) {
            this._prepResults();
            var c,
              e = this.summaryFields,
              k = 0,
              n;
            if (b) c = new m();
            else {
              this.container.innerHTML = "";
              f.remove(this.container, "loading");
              if (0 === this.summaryFeatures.length) {
                this.container.innerHTML = this.parent.nls.noFeaturesFound;
                return;
              }
              n = d.create(
                "div",
                { style: "width:" + 220 * (e.length + 1) + "px;" },
                this.container
              );
              f.add(n, "SAT_tabPanelContent");
              var q = d.create("div", {}, n);
              f.add(q, "SATcolExport");
              f.add(
                q,
                this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"
              );
              var r = d.create(
                "div",
                {
                  "data-dojo-attach-point": "SA_SAT_download",
                  title: this.parent.nls.downloadCSV,
                  tabindex: "0",
                  role: "button",
                  "aria-label": this.parent.nls.downloadCSV,
                  class: "summaryDownLoadCSVButton"
                },
                q
              );
              x.initFirstFocusNode(this.parentNode, r);
              x.initLastFocusNode(this.parentNode, r);
              f.add(r, [
                this.parent.isBlackTheme ? "btnExportBlack" : "btnExport",
                "download"
              ]);
              r.focus();
              t(r, "click", h.hitch(this, this._exportToCSV, e));
              t(
                r,
                "keydown",
                h.hitch(this, function(a) {
                  if (!a.shiftKey || a.keyCode !== l.TAB)
                    if (
                      (a.keyCode === l.TAB && r.focus(),
                      a.keyCode === l.ENTER || a.keyCode === l.SPACE)
                    )
                      this._exportToCSV(e, a),
                        setTimeout(function() {
                          r.focus();
                        }, 500);
                })
              );
            }
            for (var q = [], u = 0; u < e.length; u++) {
              var A = e[u],
                v = x.stripHTML(A.alias ? A.alias : "") + "\x3cbr/\x3e",
                A = g.formatNumber(A.total, A),
                k = A.total,
                A = A.num;
              if (b) q.push({ num: A, info: v, total: k });
              else {
                k = d.create("div", { class: "SATcol" }, n);
                f.add(
                  k,
                  this.parent.lightTheme
                    ? "lightThemeBorder"
                    : "darkThemeBorder"
                );
                var J = d.create("div", { style: "max-height: 60px;" }, k);
                d.create(
                  "div",
                  {
                    class: " SATcolWrap",
                    style: "max-height: 30px; overflow: hidden;",
                    innerHTML: v
                  },
                  J
                );
                d.create("div", { class: " colSummary", innerHTML: A }, k);
              }
            }
            n = [];
            u = null !== this.graphicsLayer;
            !b &&
              u &&
              (this.graphicsLayer.clear(), this.tab.tabLayers[1].clear());
            if (this.summaryFeatures)
              for (v = 0; v < this.summaryFeatures.length; v++)
                (A = this.summaryFeatures[v]),
                  this.lyrSymbol
                    ? (A.symbol = this.lyrSymbol)
                    : u && this.graphicsLayer.renderer
                    ? ((k = this.graphicsLayer.renderer.getSymbol(A)),
                      (A.symbol = k))
                    : this.summaryLayer.renderer &&
                      this.summaryLayer.renderer.getSymbol &&
                      (A.symbol = this.summaryLayer.renderer.getSymbol(A)),
                  (A = A.toJson ? new a(A.toJson()) : A),
                  !b && u
                    ? (this.graphicsLayer.add(A), this.tab.tabLayers[1].add(A))
                    : n.push(A);
            !b &&
              u &&
              (this.graphicsLayer.setVisibility(!0),
              this.parent._toggleTabLayersNew(this.tabNum),
              this.tab.restore &&
                this.emit("summary-complete", {
                  bubbles: !0,
                  cancelable: !0,
                  tab: this.tabNum
                }));
            if (b)
              return (
                c.resolve({ graphics: n, analysisResults: q, context: this }), c
              );
          },
          _exportToCSV: function(a, b, c, d) {
            var e;
            this.parent.config.hasOwnProperty("exportFieldsOptionForCSV")
              ? (e = this.parent.config.exportFieldsOptionForCSV)
              : this.parent.config.hasOwnProperty("csvAllFields") &&
                (e = this.parent.config.csvAllFields);
            a = g.exportToCSV(this.summaryFeatures, b, c, d, {
              type: "summary",
              baseLabel: this.baseLabel,
              csvAllFields: e,
              layer: this.summaryLayer,
              opLayers: this.parent.opLayers,
              nlsValue: this.parent.nls.summary,
              nlsCount: this.parent.nls.count,
              summaryFields: this.summaryFields,
              calcFields: this.calcFields,
              allFields: this.allFields,
              configuredPopUpFields: this.configuredPopUpFields
            });
            this.summaryLayer = a.summaryLayer;
            return a.details;
          },
          _getFieldInfoByFieldInfo: function(a, b, c) {
            return this._getFieldInfo(a[b], b, c);
          },
          _getFieldInfoByName: function(a, b) {
            var c = ["count", "area", "length", "tabCount"],
              e;
            for (e in a)
              if (-1 === c.indexOf(e)) return this._getFieldInfo(a[e], e, b);
          },
          _getFieldInfo: function(a, b, c) {
            for (var e = 0; e < a.length; e++) {
              var g = a[e];
              if (g.expression && g.expression === c)
                return {
                  field: {
                    field: g.expression,
                    alias: g.label,
                    type: b,
                    modify: g.modify,
                    round: g.round,
                    roundPlaces: g.roundPlaces,
                    truncate: g.truncate,
                    truncatePlaces: g.truncatePlaces,
                    total: 0
                  },
                  index: e
                };
            }
          },
          _getFields: function(a) {
            this.layerDefinition = x.getFeatureLayerDefinition(a);
            this.layerObject = a;
            var b = g.getSkipFields(a),
              c = [];
            if ("undefined" !== typeof this.tab.advStat) {
              var e = h.clone(this.tab.advStat.stats);
              this.tab.advStat.fieldOrder &&
                u.forEach(
                  this.tab.advStat.fieldOrder,
                  h.hitch(this, function(a) {
                    if (
                      (a =
                        a && a.hasOwnProperty("fieldName")
                          ? this._getFieldInfoByFieldInfo(
                              e,
                              a.fieldType,
                              a.fieldName
                            )
                          : this._getFieldInfoByName(e, a)) &&
                      a.field
                    ) {
                      var b = e[a.field.type];
                      b.splice(a.index, 1);
                      0 === b.length && delete e[a.field.type];
                      c.push(a.field);
                    }
                  })
                );
              for (var d in e)
                0 < e[d].length &&
                  u.forEach(e[d], function(a) {
                    c.push({
                      field: a.expression,
                      alias: a.label,
                      type: d,
                      modify: a.modify,
                      round: a.round,
                      roundPlaces: a.roundPlaces,
                      truncate: a.truncate,
                      truncatePlaces: a.truncatePlaces,
                      total: 0
                    });
                  });
            } else {
              var f;
              if (a.infoTemplate) f = a.infoTemplate.info.fieldInfos;
              else if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                var k = this.tab.tabLayers[0].url.split("MapServer/")[1],
                  n = this.parent.map.itemInfo.itemData.operationalLayers;
                f = null;
                for (var l = 0; l < n.length; l++) {
                  var q = n[l];
                  if (
                    q.layerObject.infoTemplates &&
                    (q = q.layerObject.infoTemplates[k])
                  ) {
                    f = q.infoTemplate.info.fieldInfos;
                    break;
                  }
                }
              } else f = a.fields;
              f || (f = a.fields);
              for (k = 0; k < f.length; k++)
                if (((n = f[k]), "undefined" !== typeof a.fields)) {
                  var l = a.fields[k].type,
                    m;
                  n.name === a.objectIdField ||
                    ("esriFieldTypeDouble" !== l &&
                      "esriFieldTypeInteger" !== l &&
                      "esriFieldTypeSmallInteger" !== l) ||
                    ("undefined" !== typeof n.visible
                      ? n.visible &&
                        (m = {
                          field: n.fieldName,
                          alias: n.label,
                          type: "sum",
                          total: 0
                        })
                      : (m = {
                          field: n.name,
                          alias: n.alias,
                          type: "sum",
                          total: 0
                        }),
                    m && -1 === b.indexOf(m.field) && c.push(m),
                    (m = null));
                }
            }
            this.calcFields = h.clone(c);
            if (this.allFields)
              for (f = 0; f < a.fields.length; f++) {
                m = a.fields[f];
                k = !0;
                n = 0;
                b: for (; n < c.length; n++)
                  if (m.name === c[n].field) {
                    k = !1;
                    break b;
                  }
                -1 === b.indexOf(m.name) &&
                  k &&
                  c.push({ field: m.name, alias: m.alias, type: m.type });
              }
            a = g.getSpecialFields(a);
            this.dateFields = a.dateFields;
            this.specialFields = a.specialFields;
            this.typeIdField = a.typeIdField;
            this.types = a.types;
            return c;
          }
        });
      });
    },
    "widgets/SituationAwareness/js/analysisUtils": function() {
      define("dojo/_base/array dojo/_base/lang dojo/dom-class dojo/dom-geometry dojo/dom-style esri/tasks/query esri/geometry/geometryEngine esri/geometry/Polyline ./CSVUtils jimu/utils".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l) {
        function x(b) {
          return function(a, d) {
            return a.attributes[b] < d.attributes[b]
              ? -1
              : a.attributes[b] > d.attributes[b]
              ? 1
              : 0;
          };
        }
        return {
          getFields: function(b, a, d, c) {
            var f = this.getSkipFields(b),
              g = [];
            if (
              !d &&
              a.advStat &&
              a.advStat.stats &&
              a.advStat.stats.outFields &&
              0 < a.advStat.stats.outFields.length
            )
              r.forEach(a.advStat.stats.outFields, function(a) {
                g.push(a.expression);
              });
            else {
              if (b.infoTemplate) a = b.infoTemplate.info.fieldInfos;
              else if (0 < c.map.itemInfo.itemData.operationalLayers.length) {
                c = c.map.itemInfo.itemData.operationalLayers;
                a = null;
                var e = 0;
                a: for (; e < c.length; e++) {
                  var h = c[e];
                  if (
                    "ArcGISMapServiceLayer" === h.layerType &&
                    "undefined" !== typeof h.layers
                  )
                    for (var n = 0; n < h.layers.length; n++) {
                      var l = h.layers[n];
                      if (l.id === b.layerId && l.popupInfo) {
                        a = l.popupInfo.fieldInfos;
                        break a;
                      }
                    }
                }
                a || (a = b.fields);
              } else a = b.fields;
              if (a)
                for (c = 0; c < a.length; c++)
                  (e = a[c]),
                    d || "undefined" === typeof e.visible
                      ? ((e = e.name ? e.name : e.fieldName),
                        -1 === f.indexOf(e) && g.push(e))
                      : e.visible &&
                        -1 === f.indexOf(e.fieldName) &&
                        g.push(e.fieldName);
            }
            b = this.getSpecialFields(b);
            return {
              dateFields: b.dateFields,
              specialFields: b.specialFields,
              typeIdField: b.typeIdField,
              types: b.types,
              fields: 3 < g.length && !d ? g.slice(0, 3) : g,
              allFields: g
            };
          },
          getField: function(b, a) {
            for (var d = 0; d < b.length; d++) {
              var c = b[d];
              if (c.name === a || c.alias === a) return c;
            }
          },
          getFieldValue: function(b, a, d, c, f, g, e, h, m, q) {
            g = !1;
            e = a;
            d[b] &&
              "esriFieldTypeDate" === d[b].type &&
              ((g = !0),
              -1 < Object.keys(c).indexOf(b)
                ? ((d = c[b]),
                  (f =
                    "undefined" !== typeof d
                      ? { dateFormat: d }
                      : { dateFormat: f }))
                : (f = { dateFormat: f }),
              (e = l.fieldFormatter.getFormattedDate(new Date(a), f)));
            !g &&
              h &&
              m &&
              (e =
                (b = l.getDisplayValueForCodedValueOrSubtype(h, b, m)) &&
                b.hasOwnProperty("displayValue") &&
                b.isCodedValueOrSubtype
                  ? b.displayValue
                  : this.formatNumber(e, q).num);
            return e;
          },
          getSkipFields: function(b) {
            var a = [];
            if (b.fields)
              for (var d = 0; d < b.fields.length; d++) {
                var c = b.fields[d];
                c &&
                  c.type &&
                  c.name &&
                  "esriFieldTypeGeometry" === c.type &&
                  a.push(c.name);
              }
            return a;
          },
          getSpecialFields: function(b) {
            var a = {},
              d = [];
            b.fields &&
              r.forEach(
                b.fields,
                q.hitch(this, function(c) {
                  if (
                    "esriFieldTypeDate" === c.type ||
                    c.domain ||
                    c.name === b.typeIdField
                  ) {
                    if ("esriFieldTypeDate" === c.type && b.infoTemplate)
                      for (var f in b.infoTemplate._fieldsMap)
                        "undefined" !==
                          typeof b.infoTemplate._fieldsMap[f].fieldName &&
                          b.infoTemplate._fieldsMap[f].fieldName === c.name &&
                          b.infoTemplate._fieldsMap[f].format &&
                          "undefined" !==
                            typeof b.infoTemplate._fieldsMap[f].format
                              .dateFormat &&
                          (d[c.name] =
                            b.infoTemplate._fieldsMap[f].format.dateFormat);
                    a[c.name] = c;
                  }
                })
              );
            return {
              specialFields: a,
              dateFields: d,
              typeIdField: b.typeIdField,
              types: b.types
            };
          },
          getSummaryFields: function() {},
          getPopupFields: function(b) {
            var a = [];
            0 < b.tabLayers.length &&
              r.forEach(
                b.tabLayers,
                q.hitch(this, function(b) {
                  var c = this.getSkipFields(b);
                  "undefined" !== typeof b.popupInfo
                    ? r.forEach(
                        b.popupInfo.fieldInfos,
                        q.hitch(this, function(b) {
                          if (b.visible && -1 === c.indexOf(b.fieldName)) {
                            var d = { value: 0 };
                            d.expression = b.fieldName;
                            d.label = b.label;
                            a.push(d);
                          }
                        })
                      )
                    : b.infoTemplate &&
                      r.forEach(
                        b.infoTemplate.info.fieldInfos,
                        q.hitch(this, function(b) {
                          if (b.visible && -1 === c.indexOf(b.fieldName)) {
                            var d = { value: 0 };
                            d.expression = b.fieldName;
                            d.label = b.label;
                            a.push(d);
                          }
                        })
                      );
                })
              );
            return a;
          },
          getDisplayFields: function(b) {
            var a;
            "undefined" !== typeof b.advStat &&
            "undefined" !== typeof b.advStat.stats &&
            "undefined" !== typeof b.advStat.stats.outFields
              ? (a = b.advStat.stats.outFields)
              : ((a = []),
                0 < b.tabLayers.length &&
                  r.forEach(
                    b.tabLayers,
                    q.hitch(this, function(b) {
                      "undefined" !== typeof b.popupInfo
                        ? r.forEach(
                            b.popupInfo.fieldInfos,
                            q.hitch(this, function(b) {
                              if (b.visible) {
                                var c = { value: 0 };
                                c.expression = b.fieldName;
                                c.label = b.label;
                                a.push(c);
                              }
                            })
                          )
                        : b.infoTemplate
                        ? r.forEach(
                            b.infoTemplate.info.fieldInfos,
                            q.hitch(this, function(b) {
                              if (b.visible) {
                                var c = { value: 0 };
                                c.expression = b.fieldName;
                                c.label = b.label;
                                a.push(c);
                              }
                            })
                          )
                        : r.forEach(
                            (b.layerObject ? b.layerObject : b).fields,
                            q.hitch(this, function(b) {
                              var c = { value: 0 };
                              c.expression = b.name;
                              c.label = b.alias;
                              a.push(c);
                            })
                          );
                    })
                  ));
            return a;
          },
          exportToCSV: function(b, a, d, c, f) {
            if (0 === b.length) return !1;
            var g = f.baseLabel,
              e = [],
              k = [];
            "proximity" === f.type && b.sort(this.compareDistance);
            var h;
            "undefined" === typeof a.altKey
              ? (h = a)
              : ((h = !1), (d = f.csvAllFields));
            r.forEach(
              b,
              q.hitch(this, function(a) {
                "closest" === f.type && delete a.attributes.DISTANCE;
                "proximity" === f.type &&
                  (a.attributes.DISTANCE = this.getDistanceLabel(
                    a.attributes.DISTANCE,
                    f.unit,
                    f.approximateLabel
                  ));
                e.push(a.attributes);
              })
            );
            if ("summary" === f.type || "grouped" === f.type)
              if (
                (f.hasOwnProperty("csvAllFields") &&
                  "allFields" === f.csvAllFields) ||
                (f.hasOwnProperty("csvAllFields") &&
                  (!0 === f.csvAllFields || "true" === f.csvAllFields))
              )
                for (var n in e[0]) k.push(n);
              else if (
                f.hasOwnProperty("csvAllFields") &&
                "popUpFields" === f.csvAllFields
              )
                if (f.allFields)
                  for (b = 0; b < f.summaryFields.length; b++)
                    k.push(f.summaryFields[b].field);
                else if (0 === f.configuredPopUpFields.length)
                  (e = []), e.push({});
                else
                  for (b = 0; b < f.configuredPopUpFields.length; b++)
                    k.push(f.configuredPopUpFields[b]);
              else
                for (b = 0; b < f.summaryFields.length; b++)
                  k.push(f.summaryFields[b].field);
            else for (var l in e[0]) k.push(l);
            b = f.layer;
            n = b.fields;
            if ((b && b.loaded && n) || h) {
              l = a ? [] : this.getSkipFields(b);
              var m = {};
              if (f.opLayers && f.opLayers._layerInfos) {
                var u = f.opLayers.getLayerInfoById(b.id);
                u && (m.popupInfo = u.getPopupInfo());
              }
              var u = [],
                C = 0;
              for (; C < k.length; C++) {
                var v = k[C];
                if (-1 === l.indexOf(v)) {
                  var x = !1,
                    J,
                    O = 0;
                  b: for (; O < n.length; O++)
                    if (((J = n[O]), J.name === v)) {
                      x = !0;
                      break b;
                    }
                  x
                    ? u.push(J)
                    : u.push({
                        name: v,
                        alias: v,
                        show: !0,
                        type: "esriFieldTypeString"
                      });
                }
              }
              m.datas = e;
              m.fromClient = !1;
              m.withGeometry = !1;
              m.outFields = u;
              m.formatDate = !0;
              m.formatCodedValue = !0;
              m.formatNumber = !1;
              var H = [],
                y = [];
              if (!a && d && "undefined" !== typeof c)
                switch (f.type) {
                  case "proximity":
                    H.push(f.nlsCount);
                    y.push(c);
                    break;
                  case "closest":
                    var T = 0;
                    r.forEach(
                      c,
                      q.hitch(this, function(a) {
                        0 === T &&
                          (r.forEach(a, function(a) {
                            H.push(a.label);
                          }),
                          (T += 1));
                        var b = [];
                        r.forEach(a, function(a) {
                          b.push(a.value);
                        });
                        y.push(b);
                      })
                    );
                    break;
                  case "summary":
                    r.forEach(
                      c,
                      q.hitch(this, function(a) {
                        var b = a.info.replace("\x3cbr/\x3e", ""),
                          c = !1,
                          e = 0;
                        a: for (; e < f.calcFields.length; e++)
                          if (b === f.calcFields[e].alias) {
                            c = !0;
                            break a;
                          }
                        c && (H.push(b), y.push(a.total));
                      })
                    );
                    break;
                  case "grouped":
                    r.forEach(c, function(a) {
                      H.push(a.info.replace("\x3cbr/\x3e", ""));
                      y.push(a.total);
                    });
                }
              if (h) return { summaryLayer: b, details: u };
              t.exportCSVFromFeatureLayer(g, b, m);
              return {
                summaryLayer: b,
                details: {
                  appendColumns: H,
                  appendDatas: y,
                  name: g,
                  type: f.nlsValue
                }
              };
            }
            t.exportCSV(g, e, k);
          },
          isURL: function(b) {
            return /(https?:\/\/|ftp:)/g.test(b);
          },
          isEmail: function(b) {
            return /\S+@\S+\.\S+/.test(b);
          },
          queryTabCount: function() {},
          performQuery: function() {},
          getFilter: function(b, a) {
            var d = "";
            a.traversal(function(a) {
              if (b === a.id && a.getFilter()) return (d = a.getFilter()), !0;
            });
            return d;
          },
          getGeoms: function(b) {
            for (var a = [], d = [], c = 0; c < b.length; c++) {
              var k = b[c].geometry ? b[c].geometry : b[c];
              if ("polygon" === k.type && -1 === a.indexOf(c)) {
                for (var g = 0; g < b.length; g++)
                  if (g !== c && -1 === a.indexOf(g)) {
                    var e = b[g].geometry ? b[g].geometry : b[g];
                    "polygon" === e.type
                      ? f.intersects(k, e) && (a.push(g), (k = f.union(k, e)))
                      : a.push(g);
                  }
                d.push(k);
              }
            }
            return d;
          },
          createDefArray: function(b, a, d, c) {
            for (var f = [], g = 0; g < b.length; g++) {
              var e = b[g];
              if (e) {
                var n = new h();
                n.returnGeometry = !1;
                n.geometry = a;
                var l =
                  -1 === [null, void 0, ""].indexOf(e.id) ? e.id : c.layers;
                n.where = this.getFilter(l, d);
                "undefined" !== typeof e.queryCount
                  ? f.push(e.queryCount(n))
                  : "undefined" !== typeof e.queryIds
                  ? f.push(e.queryIds(n))
                  : "undefined" !== typeof e.queryFeatures &&
                    f.push(e.queryFeatures(n));
              }
            }
            return f;
          },
          updateTabCount: function(b, a, d, c, f) {
            var g = "undefined" !== typeof f && 0 < f ? !0 : !1;
            f = v.position(a).w;
            "undefined" !== typeof b && 0 === b
              ? (u.remove(a, "noFeatures"),
                u.remove(a, "noFeaturesActive"),
                u.add(a, g ? "noFeaturesActive" : "noFeatures"))
              : (g && u.contains(a, "noFeatures") && u.remove(a, "noFeatures"),
                g &&
                  u.contains(a, "noFeaturesActive") &&
                  u.remove(a, "noFeaturesActive"));
            d &&
              ((b =
                "undefined" !== typeof b
                  ? c + " (" + l.localizeNumber(b).toString() + ")"
                  : c),
              (a.innerHTML = b));
            d = v.position(a).w;
            b = 0;
            var e;
            d > f ? ((e = !0), (b = d - f)) : f > d && ((e = !1), (b = f - d));
            f = v.position(a.parentNode).w;
            if (0 < f) {
              e = e ? f + b : f - b;
              m.set(a.parentNode, "width", e + "px");
              a = a.parentNode.parentNode;
              f = a.parentNode;
              var k;
              if (f && f.children && 0 < f.children.length)
                for (b = 0; b < f.children.length; b++)
                  if (
                    ((d = f.children[b]),
                    -1 < d.className.indexOf("SA_panelRight"))
                  ) {
                    k = d;
                    break;
                  }
              k &&
                a &&
                (e > v.position(f).w
                  ? (m.set(a, "right", "58px"), m.set(k, "display", "block"))
                  : (m.set(a, "right", "24px"), m.set(k, "display", "none")));
            }
          },
          getDistanceLabel: function(b, a, d) {
            return Math.round(100 * b) / 100 + " " + a + " (" + d + ")";
          },
          getSum: function(b, a) {
            var d = 0;
            r.forEach(b, function(b) {
              d += b.attributes[a];
            });
            return d;
          },
          getMin: function(b, a) {
            b.sort(x(a));
            return b[0].attributes[a];
          },
          getMax: function(b, a) {
            b.sort(x(a));
            b.reverse();
            return b[0].attributes[a];
          },
          getArea: function(b, a, d, c, k) {
            var g = 0;
            d = q.clone(d);
            d.miles = 109413;
            d.kilometers = 109414;
            d.feet = 109405;
            d.meters = 109404;
            d.yards = 109442;
            d.nauticalMiles = 109409;
            var e = d[c],
              h;
            k &&
              k.stats &&
              k.stats.area &&
              0 < k.stats.area.length &&
              (h = k.stats.area[0]);
            r.forEach(b, function(b) {
              for (var c = 0; c < a.length; c++) {
                var d = f.intersect(b.geometry, a[c]);
                if (null !== d) {
                  var k = d.spatialReference;
                  g =
                    4326 === k.wkid ||
                    k.isWebMercator() ||
                    (k.isGeographic && k.isGeographic())
                      ? g + f.geodesicArea(d, e)
                      : g + f.planarArea(d, e);
                }
              }
            });
            return this.formatNumber(g, h).total;
          },
          getLength: function(b, a, d, c, k) {
            var g = 0,
              e = d[c],
              h;
            k &&
              k.stats &&
              k.stats.length &&
              0 < k.stats.length.length &&
              (h = k.stats.length[0]);
            r.forEach(b, function(b) {
              for (var c = 0; c < a.length; c++) {
                var d = f.intersect(b.geometry, a[c]);
                if (null !== d) {
                  var k = d.spatialReference;
                  g =
                    4326 === k.wkid ||
                    k.isWebMercator() ||
                    (k.isGeographic && k.isGeographic())
                      ? g + f.geodesicLength(d, e)
                      : g + f.planarLength(d, e);
                }
              }
            });
            return this.formatNumber(g, h).total;
          },
          getDistance: function(b, a, h) {
            var c = "point" !== b.type ? b.getExtent().getCenter() : b;
            a = "point" !== a.type ? a.getExtent().getCenter() : a;
            c = new d([
              [c.x, c.y],
              [a.x, a.y]
            ]);
            c.spatialReference = b.spatialReference;
            h = "nauticalMiles" === h ? "nautical-miles" : h;
            return 4326 === b.spatialReference.wkid ||
              b.spatialReference.isWebMercator()
              ? f.geodesicLength(c, h)
              : f.planarLength(c, h);
          },
          compareDistance: function(b, a) {
            return b.attributes.DISTANCE < a.attributes.DISTANCE
              ? -1
              : b.attributes.DISTANCE > a.attributes.DISTANCE
              ? 1
              : 0;
          },
          formatNumber: function(b, a) {
            var d = b;
            if (!isNaN(b) && null !== b && "" !== b) {
              var d = a && a.modify && !isNaN(b),
                c;
              d &&
                "undefined" !== typeof a.truncatePlaces &&
                !isNaN(a.truncatePlaces) &&
                (c = new RegExp(
                  0 < a.truncatePlaces
                    ? "^\\d*[.]?\\d{0," + a.truncatePlaces + "}"
                    : "^\\d*"
                ));
              d =
                d && a.round
                  ? 1 * b.toFixed(a.roundPlaces)
                  : d && a.truncate
                  ? 1 * c.exec(b)[0]
                  : b;
              isNaN(d) && (d = 0);
            }
            return {
              total: d,
              num: isNaN(d) || null === d || "" === d ? d : l.localizeNumber(d)
            };
          },
          getPopupConfiguredFields: function(b) {
            var a = [];
            "undefined" !== typeof b.popupInfo
              ? r.forEach(
                  b.popupInfo.fieldInfos,
                  q.hitch(this, function(b) {
                    b.visible && a.push(b.fieldName);
                  })
                )
              : b.infoTemplate &&
                r.forEach(
                  b.infoTemplate.info.fieldInfos,
                  q.hitch(this, function(b) {
                    b.visible && a.push(b.fieldName);
                  })
                );
            return a;
          }
        };
      });
    },
    "widgets/SituationAwareness/js/CSVUtils": function() {
      define("exports dojo/_base/lang dojo/_base/array dojo/_base/html dojo/has dojo/Deferred jimu/utils esri/lang esri/tasks/QueryTask esri/tasks/query".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l) {
        function x(b) {
          var a = q.clone(b.attributes);
          (b = b.geometry) &&
            "point" === b.type &&
            ("x" in a ? (a._x = b.x) : (a.x = b.x),
            "y" in a ? (a._y = b.y) : (a.y = b.y));
          return a;
        }
        r.exportCSV = function(b, a, d, c, f) {
          return r._createCSVStr(a, d, c, f).then(function(a) {
            return r._download(b + ".csv", a);
          });
        };
        r.exportCalculatedResultsCSV = function(b, a) {
          var d = "",
            c = 0;
          u.forEach(a, function(f) {
            d += f.name + " (" + f.type + ")\r\n";
            r._createCSVStr([], [], f.appendColumns, f.appendDatas).then(
              function(g) {
                d += g;
                c++;
                if (c === a.length) return r._download(b + ".csv", d);
                d += "\r\n\r\n";
              }
            );
          });
        };
        r.exportCSVFromFeatureLayer = function(b, a, d) {
          d = d || {};
          return r
            ._getExportData(a, {
              datas: d.datas,
              fromClient: d.fromClient,
              withGeometry: d.withGeometry,
              outFields: d.outFields,
              filterExpression: d.filterExpression
            })
            .then(function(c) {
              return r
                ._formattedData(a, c, {
                  formatNumber: d.formatNumber,
                  formatDate: d.formatDate,
                  formatCodedValue: d.formatCodedValue,
                  popupInfo: d.popupInfo,
                  appendColumns: d.appendColumns,
                  appendDatas: d.appendDatas
                })
                .then(function(a) {
                  return r.exportCSV(
                    b,
                    a.datas,
                    a.columns,
                    a.appendColumns,
                    a.appendDatas
                  );
                });
            });
        };
        r.exportCSVByAttributes = function(b, a, d, c) {
          c = q.mixin({}, c);
          c.datas = d;
          return r.exportCSVFromFeatureLayer(b, a, c);
        };
        r.exportCSVByGraphics = function(b, a, d, c) {
          d = u.map(d, function(a) {
            return a.attributes;
          });
          return r.exportCSVByAttributes(b, a, d, c);
        };
        r._createCSVStr = function(b, a, d, c) {
          var f = new h(),
            g = "",
            e = 0,
            n = 0,
            l = "",
            m = "";
          try {
            if (a && 0 < a.length) {
              u.forEach(a, function(a) {
                g = g + l + a;
                l = ",";
              });
              for (
                var g = g + "\r\n", e = b.length, n = a.length, q = 0;
                q < e;
                q++
              ) {
                for (var l = "", t = 0; t < n; t++)
                  (m = b[q][a[t]]) || "number" === typeof m || (m = ""),
                    m &&
                      /[",\r\n]/g.test(m) &&
                      (m = '"' + m.replace(/(")/g, '""') + '"'),
                    (g = g + l + m),
                    (l = ",");
                g += "\r\n";
              }
            }
            "undefined" !== typeof d &&
              "undefined" !== typeof c &&
              0 < d.length &&
              0 < c.length &&
              ((l = ""),
              u.forEach(d, function(a) {
                g = g + l + a;
                l = ",";
              }),
              (l = ""),
              (g += "\r\n"),
              u.forEach(c, function(a) {
                Array.isArray(a)
                  ? (u.forEach(a, function(a) {
                      g = g + l + a;
                      l = ",";
                    }),
                    (l = ""),
                    (g += "\r\n"))
                  : ((g = g + l + a), (l = ","));
              }));
            f.resolve(g);
          } catch (G) {
            console.error(G), f.resolve("");
          }
          return f;
        };
        r._isIE11 = function() {
          return 11 === f.has("ie");
        };
        r._isEdge = function() {
          return f.has("edge");
        };
        r._getDownloadUrl = function(b) {
          return window.Blob && window.URL && window.URL.createObjectURL
            ? ((b = new Blob(["\ufeff" + b], { type: "text/csv" })),
              URL.createObjectURL(b))
            : "data:attachment/csv;charset\x3dutf-8,\ufeff" +
                encodeURIComponent(b);
        };
        r._download = function(b, a) {
          var d = new h();
          try {
            if (m("ie") && 10 > m("ie")) {
              var c = window.top.open("about:blank", "_blank");
              c.document.write("sep\x3d,\r\n" + a);
              c.document.close();
              c.document.execCommand("SaveAs", !0, b);
              c.close();
            } else if (10 === m("ie") || r._isIE11() || r._isEdge()) {
              var f = new Blob(["\ufeff" + a], { type: "text/csv" });
              navigator.msSaveBlob(f, b);
            } else {
              var g = v.create(
                "a",
                { href: r._getDownloadUrl(a), target: "_blank", download: b },
                document.body
              );
              if (m("safari")) {
                var e = document.createEvent("MouseEvents");
                e.initEvent("click", !0, !0);
                g.dispatchEvent(e);
              } else g.click();
              v.destroy(g);
            }
            d.resolve();
          } catch (E) {
            d.reject(E);
          }
          return d;
        };
        r._getExportData = function(b, a) {
          var d = new h(),
            c = null,
            f = a.datas,
            g = a.withGeometry,
            c = a.outFields;
          (c && c.length) || (c = b.fields);
          c = q.clone(c);
          if (g && !(f && 0 < f.length)) {
            var e = "",
              e = -1 !== c.indexOf("x") ? "_x" : "x";
            c.push({
              name: e,
              alias: e,
              format: { digitSeparator: !1, places: 6 },
              show: !0,
              type: "esriFieldTypeDouble"
            });
            e = -1 !== c.indexOf("y") ? "_y" : "y";
            c.push({
              name: e,
              alias: e,
              format: { digitSeparator: !1, places: 6 },
              show: !0,
              type: "esriFieldTypeDouble"
            });
          }
          f && 0 < f.length
            ? d.resolve({ data: f || [], outFields: c })
            : a.fromClient
            ? ((f = u.map(b.graphics, function(a) {
                return g ? x(a) : q.clone(a);
              })),
              d.resolve({ data: f || [], outFields: c }))
            : r._getExportDataFromServer(b, c, a).then(function(a) {
                d.resolve({ data: a || [], outFields: c });
              });
          return d;
        };
        r._getExportDataFromServer = function(b, a, d) {
          var c = new h();
          if ("esri.layers.FeatureLayer" !== b.declaredClass)
            return c.resolve([]), c;
          var f = new t(b.url),
            g = new l();
          g.where =
            d.filterExpression ||
            (b.getDefinitionExpression && b.getDefinitionExpression()) ||
            "1\x3d1";
          0 < a.length
            ? ((b = u.map(a, function(a) {
                return a.name;
              })),
              (g.outFields = b))
            : (g.outFields = ["*"]);
          g.returnGeometry = d.withGeometry;
          f.execute(
            g,
            function(a) {
              a = u.map(a.features, function(a) {
                return x(a);
              });
              c.resolve(a);
            },
            function(a) {
              console.error(a);
              c.resolve([]);
            }
          );
          return c;
        };
        r._formattedData = function(b, a, d) {
          var c = new h(),
            k = [],
            g = a.data;
          a = a.outFields;
          for (
            var e = f.getFeatureLayerDefinition(b), l = 0, n = g.length;
            l < n;
            l++
          ) {
            for (var m = {}, q = 0; q < a.length; q++) {
              var t = a[q];
              m[t.alias || t.name] = r._getExportValue(
                g[l][t.name],
                t,
                b.objectIdField,
                b.typeIdField,
                g[l][b.typeIdField],
                b.types,
                d,
                e,
                g[l],
                b
              );
            }
            k.push(m);
          }
          b = u.map(a, function(a) {
            return a.alias || a.name;
          });
          c.resolve({
            datas: k,
            columns: b,
            appendColumns: d.appendColumns,
            appendDatas: d.appendDatas
          });
          return c;
        };
        r._getExportValue = function(b, a, h, c, k, g, e, l, m, q) {
          function n(a) {
            if (t && d.isDefined(t.fieldInfos))
              for (var b = 0, c = t.fieldInfos.length; b < c; b++) {
                var e = t.fieldInfos[b];
                if (e.fieldName === a) return e.format;
              }
            return null;
          }
          var t = e.popupInfo,
            r = !!a.domain && e.formatCodedValue;
          e = "esriFieldTypeDate" === a.type && e.formatDate;
          var C = h && a.name === h;
          c = c && a.name === c;
          q = q && q.renderer ? q : l;
          return e
            ? f.fieldFormatter.getFormattedDate(b, n(a.name))
            : (c || r) &&
              l &&
              m &&
              (l = f.getDisplayValueForCodedValueOrSubtype(q, a.name, m)) &&
              l.hasOwnProperty("displayValue")
            ? l.displayValue
            : r || e || C || c
            ? b
            : ((r = null),
              h &&
                g &&
                0 < g.length &&
                (h =
                  (h = u.filter(g, function(a) {
                    return a.id === k;
                  })) && h[0]) &&
                h.domains &&
                h.domains[a.name] &&
                h.domains[a.name].codedValues &&
                (a = f.getDisplayValueForCodedValueOrSubtype(q, a.name, m)) &&
                a.hasOwnProperty("displayValue") &&
                (r = a.displayValue),
              null !== r ? r : b);
        };
      });
    },
    "widgets/SituationAwareness/js/GroupedCountInfo": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/array dojo/DeferredList dojo/Deferred dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/on dojo/keys jimu/utils jimu/dijit/Message esri/graphic esri/layers/FeatureLayer esri/tasks/query ./analysisUtils".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a, n, c, k) {
        return r("GroupedCountInfo", [q], {
          summaryLayer: null,
          summaryFields: [],
          summaryIds: [],
          summaryFeatures: [],
          tabNum: null,
          popupFields: [],
          groupedResults: {},
          specialFields: null,
          dateFields: {},
          symbolField: null,
          graphicsLayer: null,
          lyrRenderer: null,
          lyrSymbol: null,
          featureCount: 0,
          incidentCount: 0,
          displayCount: !1,
          allFields: !1,
          configuredPopUpFields: [],
          constructor: function(a, b, c) {
            this.tab = a;
            this.container = b;
            this.parent = c;
            this.config = c.config;
            this.graphicsLayer = null;
            this.specialFields = {};
            this.typeIdField = "";
            this.types = [];
            this.dateFields = {};
            this.baseLabel =
              "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers;
            this.parentNode = c.domNode;
          },
          queryTabCount: function(a, b, c, d) {
            var e = new m();
            this.displayCount = d;
            this.incidentCount = a.length;
            var g = [this.tab.tabLayers[0]];
            this.mapServiceLayer &&
              1 < this.tab.tabLayers.length &&
              (g = [this.tab.tabLayers[1]]);
            if (
              0 < this.tab.tabLayers.length &&
              this.tab.tabLayers[0].url &&
              -1 < this.tab.tabLayers[0].url.indexOf("MapServer")
            ) {
              this.mapServiceLayer = !0;
              var f;
              "undefined" !== typeof this.tab.tabLayers[0].infoTemplate
                ? ((this.summaryLayer = this.tab.tabLayers[0]),
                  this.summaryLayer.hasOwnProperty("loaded") &&
                  this.summaryLayer.loaded
                    ? ((this.summaryFields = this._getFields(
                        this.summaryLayer
                      )),
                      this._performQuery(a, b, c, d, g).then(function(a) {
                        e.resolve(a);
                      }))
                    : ((f = new n(this.summaryLayer.url)),
                      (f.infoTemplate = this.tab.tabLayers[0].infoTemplate),
                      (g = [f]),
                      (this.tab.tabLayers = g),
                      t(
                        f,
                        "load",
                        h.hitch(this, function() {
                          this.summaryLayer = f;
                          this.summaryFields = this._getFields(
                            this.summaryLayer
                          );
                          this._performQuery(a, b, c, d, g).then(function(a) {
                            e.resolve(a);
                          });
                        })
                      )))
                : this.loading ||
                  ((f = new n(this.tab.tabLayers[0].url)),
                  (this.loading = !0),
                  t(
                    f,
                    "load",
                    h.hitch(this, function() {
                      this.summaryLayer = f;
                      this.summaryFields = this._getFields(this.summaryLayer);
                      for (
                        var h = this.tab.tabLayers[0].url.split(
                            "MapServer/"
                          )[1],
                          k = this.parent.map.itemInfo.itemData
                            .operationalLayers,
                          l = 0;
                        l < k.length;
                        l++
                      ) {
                        var n = k[l];
                        if (
                          -1 < this.tab.tabLayers[0].url.indexOf(n.url) &&
                          "undefined" !== typeof n.layerObject
                        )
                          if (n.layerObject.infoTemplates) {
                            if ((n = n.layerObject.infoTemplates[h])) {
                              f.infoTemplate = n.infoTemplate;
                              break;
                            }
                          } else if (n.layerObject.infoTemplate) {
                            f.infoTemplate = n.layerObject.infoTemplate;
                            break;
                          }
                      }
                      g = [f];
                      this.tab.tabLayers = g;
                      this.loading = !1;
                      this._performQuery(a, b, c, d, g).then(function(a) {
                        e.resolve(a);
                      });
                    })
                  ));
            }
            this.mapServiceLayer ||
              this._performQuery(a, b, c, d, g).then(function(a) {
                e.resolve(a);
              });
            return e;
          },
          _performQuery: function(a, b, c, d, f) {
            var e = new m(),
              g = [],
              l,
              n;
            0 < b.length
              ? (n = k.getGeoms(b))
              : 0 < a.length && (n = k.getGeoms(a));
            this.summaryGeoms = n;
            if (0 < n.length)
              for (a = 0; a < n.length; a++)
                (g = n[a]),
                  (b = k.createDefArray(f, g, this.parent.opLayers, this.tab)),
                  (l = 0 === a ? (g = b) : (g = l.concat(b)));
            new v(g).then(
              h.hitch(this, function(a) {
                for (var b = 0, g = 0; g < a.length; g++) {
                  var f = a[g][1];
                  isNaN(f)
                    ? f && f.features
                      ? (b += f.features.length)
                      : f && "undefined" !== typeof f.length && (b += f.length)
                    : (b += f);
                }
                this.updateTabCount(b, c, d);
                this.queryOnLoad &&
                  h.hitch(this, this._queryFeatures(this.summaryGeoms));
                e.resolve(b);
              })
            );
            return e;
          },
          updateTabCount: function(a, b, c) {
            this.displayCount = c;
            this.featureCount = a;
            k.updateTabCount(
              this.featureCount,
              b,
              c,
              this.baseLabel,
              this.incidentCount
            );
          },
          updateForIncident: function(a, b, c, d, l, q, r) {
            this.incidentCount = a.length;
            this.allFields =
              "undefined" !== typeof q && "undefined" !== typeof r
                ? q
                  ? !0
                  : r
                : !1;
            var e = "undefined" !== typeof l,
              g;
            this.tabNum = d;
            e
              ? (g = new m())
              : ((this.container.innerHTML = ""),
                f.add(this.container, "loading"));
            this.summaryIds = [];
            this.summaryFeatures = [];
            this.groupedResults = {};
            if (0 < this.tab.tabLayers.length) {
              var u = [];
              if (0 < b.length) u = b;
              else
                for (b = 0; b < a.length; b++)
                  (d = a[b].geometry ? a[b].geometry : a[b]),
                    "polygon" === d.type && u.push(d);
              var w;
              "undefined" !== typeof this.tab.tabLayers[0].infoTemplate
                ? ((this.summaryLayer = this.tab.tabLayers[0]),
                  (w = new n(this.summaryLayer.url)),
                  (w.infoTemplate = this.tab.tabLayers[0].infoTemplate),
                  (this.tab.tabLayers[1] = w),
                  (this.summaryFields = this._getFields(this.tab.tabLayers[0])),
                  (this.configuredPopUpFields = k.getPopupConfiguredFields(
                    this.tab.tabLayers[0]
                  )),
                  e
                    ? this._queryFeatures(u, e).then(function(a) {
                        g.resolve(a);
                      })
                    : (this._initGraphicsLayer(c),
                      h.hitch(this, this._queryFeatures(u))))
                : ((w = new n(this.tab.tabLayers[0].url)),
                  t(
                    w,
                    "load",
                    h.hitch(this, function() {
                      this.summaryLayer = w;
                      if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer"))
                        for (
                          var a = this.tab.tabLayers[0].url.split(
                              "MapServer/"
                            )[1],
                            b = this.parent.map.itemInfo.itemData
                              .operationalLayers,
                            d = 0;
                          d < b.length;
                          d++
                        ) {
                          var f = b[d];
                          if (
                            -1 < this.tab.tabLayers[0].url.indexOf(f.url) &&
                            "undefined" !== typeof f.layerObject &&
                            f.layerObject.infoTemplates &&
                            (f = f.layerObject.infoTemplates[a])
                          ) {
                            w.infoTemplate = f.infoTemplate;
                            break;
                          }
                        }
                      this.tab.tabLayers[1] = w;
                      this.summaryLayer = this.tab.tabLayers[1];
                      this.summaryFields = this._getFields(
                        this.tab.tabLayers[1]
                      );
                      this.configuredPopUpFields = k.getPopupConfiguredFields(
                        this.tab.tabLayers[1]
                      );
                      e
                        ? this._queryFeatures(u, e).then(function(a) {
                            g.resolve(a);
                          })
                        : (this._initGraphicsLayer(c),
                          h.hitch(this, this._queryFeatures(u)));
                    })
                  ));
              if (e) return g;
            }
          },
          _initGraphicsLayer: function(a) {
            null !== a &&
              ((this.graphicsLayer = a),
              this.graphicsLayer.clear(),
              this.summaryLayer &&
                this.summaryLayer.renderer &&
                ((this.lyrRenderer = this.summaryLayer.renderer),
                (this.graphicsLayer.renderer = this.lyrRenderer),
                "undefined" !== typeof this.summaryLayer.renderer.attributeField
                  ? (this.symbolField = this.summaryLayer.renderer.attributeField)
                  : (this.lyrSymbol = this.lyrRenderer.symbol)));
          },
          _queryFeatures: function(a, e) {
            var d;
            e && (d = new m());
            for (
              var g = [],
                f =
                  -1 === [null, void 0, ""].indexOf(this.tab.tabLayers[0].id)
                    ? this.tab.tabLayers[0].id
                    : this.tab.layers,
                f = k.getFilter(f, this.parent.opLayers),
                l = new c(),
                n = 0;
              n < a.length;
              n++
            )
              (l.geometry = a[n]),
                (l.where = f),
                g.push(this.summaryLayer.queryIds(l));
            new v(g).then(
              h.hitch(this, function(a) {
                for (var b, c, g = 0; g < a.length; g++)
                  a[g][0] &&
                    ((b = a[g][1]), (c = b = 0 === g ? b : c.concat(b)));
                b
                  ? ((this.summaryIds = b),
                    0 < this.summaryIds.length
                      ? e
                        ? this._queryFeaturesByIds(e).then(function(a) {
                            d.resolve(a);
                          })
                        : this._queryFeaturesByIds()
                      : e || this._processResults())
                  : e || this._processResults();
              }),
              h.hitch(this, function(a) {
                console.error(a);
                new b({ message: a });
              })
            );
            if (e) return d;
          },
          _queryFeaturesByIds: function(a) {
            var e,
              d = [];
            a && (e = new m());
            var g = this.summaryLayer.maxRecordCount || 1e3,
              l = this.summaryIds.slice(0, g);
            this.summaryIds.splice(0, g);
            var n = new c(),
              q =
                -1 === [null, void 0, ""].indexOf(this.summaryLayer.id)
                  ? this.summaryLayer.id
                  : this.tab.layers;
            n.where = k.getFilter(q, this.parent.opLayers);
            var t = !1;
            u.some(
              this.summaryFields,
              h.hitch(this, function(a) {
                if (
                  "area" === a.type ||
                  "length" === a.type ||
                  this.graphicsLayer
                )
                  return (t = !0);
              })
            );
            a && (t = !0);
            this.summaryLayer.supportsAdvancedQueries &&
              (n.orderByFields = [this.summaryFields[0].field]);
            n.returnGeometry = t;
            n.outSpatialReference = this.parent.map.spatialReference;
            n.outFields = ["*"];
            n.objectIds = l;
            for (
              d.push(this.summaryLayer.queryFeatures(n));
              0 < this.summaryIds.length;

            )
              (l = this.summaryIds.slice(0, g)),
                this.summaryIds.splice(0, g),
                (n.objectIds = l),
                d.push(this.summaryLayer.queryFeatures(n));
            new v(d).then(
              h.hitch(this, function(b) {
                this.summaryFeatures = [];
                for (var c = 0; c < b.length; c++)
                  if (b[c][0]) {
                    var d = b[c][1];
                    d.features &&
                      (this.summaryFeatures = this.summaryFeatures.concat(
                        d.features
                      ));
                  }
                a
                  ? this._processResults(a).then(
                      h.hitch(this, function(a) {
                        this.SA_SAT_download &&
                          f.replace(
                            this.SA_SAT_download,
                            "download",
                            "processing"
                          );
                        e.resolve(a);
                      })
                    )
                  : (this._processResults(),
                    this.SA_SAT_download &&
                      f.replace(
                        this.SA_SAT_download,
                        "download",
                        "processing"
                      ));
                this.SA_SAT_download &&
                  f.replace(this.SA_SAT_download, "download", "processing");
              }),
              h.hitch(this, function(a) {
                console.error(a);
                new b({ message: a });
              })
            );
            if (a) return e;
          },
          _prepGroupedResults: function() {
            for (var a = 0; a < this.summaryFeatures.length; a++) {
              var b = this.summaryFeatures[a];
              if (
                "undefined" !== typeof this.summaryFields &&
                0 < this.summaryFields.length
              ) {
                var c = k.getFieldValue(
                    this.summaryFields[0].field,
                    b.attributes[this.summaryFields[0].field],
                    this.specialFields,
                    this.dateFields,
                    "longMonthDayYear",
                    this.typeIdField,
                    this.types,
                    this.layerObject && this.layerObject.renderer
                      ? this.layerObject
                      : this.layerDefinition,
                    b.attributes
                  ),
                  c =
                    "undefined" !== typeof c && null !== c
                      ? x.stripHTML(c.toString())
                      : "";
                c in this.groupedResults
                  ? this.groupedResults[c].features.push(b)
                  : (this.groupedResults[c] = { features: [b] });
              }
            }
          },
          _prepResults: function() {
            for (var a in this.groupedResults) {
              var b = this.summaryFields[0];
              b.total = this.groupedResults[a].features.length;
              this.groupedResults[a].total = b.total;
              this.groupedResults[a].type = b.type;
              this.groupedResults[a].label = b.alias;
            }
          },
          _processResults: function(b) {
            this._prepGroupedResults();
            this._prepResults();
            var c = this.groupedResults,
              g = 0,
              k,
              n;
            if (b) n = new m();
            else {
              this.container.innerHTML = "";
              f.remove(this.container, "loading");
              if (0 === Object.keys(this.groupedResults).length) {
                this.container.innerHTML = this.parent.nls.noFeaturesFound;
                return;
              }
              var q = Object.keys(this.groupedResults).length + 1;
              k = d.create(
                "div",
                { style: "width:" + 220 * q + "px;" },
                this.container
              );
              f.add(k, "SAT_tabPanelContent");
              q = d.create("div", {}, k);
              f.add(q, "SATcolExport");
              f.add(
                q,
                this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"
              );
              var r = d.create(
                "div",
                {
                  "data-dojo-attach-point": "SA_SAT_download",
                  title: this.parent.nls.downloadCSV,
                  tabindex: "0",
                  role: "button",
                  "aria-label": this.parent.nls.downloadCSVdownloadCSV,
                  class: "grpSummaryDownLoadCSVButton"
                },
                q
              );
              f.add(r, [
                this.parent.isBlackTheme ? "btnExportBlack" : "btnExport",
                "download"
              ]);
              r.focus();
              x.initFirstFocusNode(this.parentNode, r);
              x.initLastFocusNode(this.parentNode, r);
              t(r, "click", h.hitch(this, this._exportToCSV, c));
              t(
                r,
                "keydown",
                h.hitch(this, function(a) {
                  if (!a.shiftKey || a.keyCode !== l.TAB)
                    if (a.keyCode === l.ENTER || a.keyCode === l.SPACE)
                      this._exportToCSV(c, a),
                        setTimeout(function() {
                          r.focus();
                        }, 500);
                })
              );
            }
            var u = Object.keys(c).sort(),
              q = [];
            this.displayCount &&
              q.push({
                total: this.featureCount,
                a: void 0,
                info: this.parent.nls.count,
                c: void 0
              });
            for (var v in u) {
              var g = u[v],
                A = c[g],
                R = x.stripHTML(g.toString()),
                g = A.total;
              isNaN(g) && (g = 0);
              var g = x.localizeNumber(g),
                J = "pre" === A.type ? A.label.trim() : R,
                R = "pre" === A.type ? R : A.label.trim(),
                A = "" !== A.label ? "colGroupedSummary" : "colSummary";
              if (b) q.push({ total: g, a: J, info: "" === R ? J : R, c: A });
              else {
                var O = d.create("div", { class: "SATcol" }, k);
                f.add(
                  O,
                  this.parent.lightTheme
                    ? "lightThemeBorder"
                    : "darkThemeBorder"
                );
                var H = d.create("div", { style: "max-height: 45px;" }, O);
                d.create(
                  "div",
                  {
                    class: "SATcolWrap",
                    style: "max-height: 30px; overflow: hidden;",
                    innerHTML: J
                  },
                  H
                );
                d.create(
                  "div",
                  {
                    class: "SATcolWrap",
                    style: "max-height: 30px; overflow: hidden;",
                    innerHTML: R
                  },
                  H
                );
                d.create("div", { class: A, innerHTML: g }, O);
              }
            }
            v = [];
            k = null !== this.graphicsLayer;
            !b &&
              k &&
              (this.graphicsLayer.clear(),
              this.tab.tabLayers[1] && this.tab.tabLayers[1].clear());
            if (this.summaryFeatures)
              for (u = 0; u < this.summaryFeatures.length; u++)
                (g = this.summaryFeatures[u]),
                  this.lyrSymbol
                    ? (g.symbol = this.lyrSymbol)
                    : this.graphicsLayer
                    ? this.graphicsLayer.renderer &&
                      ((J = this.graphicsLayer.renderer.getSymbol(g)),
                      (g.symbol = J))
                    : this.summaryLayer.renderer &&
                      this.summaryLayer.renderer.getSymbol &&
                      (g.symbol = this.summaryLayer.renderer.getSymbol(g)),
                  (g = g.toJson ? new a(g.toJson()) : g),
                  !b && k
                    ? (this.graphicsLayer.add(g), this.tab.tabLayers[1].add(g))
                    : v.push(g);
            !b &&
              k &&
              (this.graphicsLayer.setVisibility(!0),
              this.parent._toggleTabLayersNew(this.tabNum),
              this.tab.retsore &&
                this.emit("summary-complete", {
                  bubbles: !0,
                  cancelable: !0,
                  tab: this.tabNum
                }));
            if (b)
              return (
                n.resolve({ graphics: v, analysisResults: q, context: this }), n
              );
          },
          _exportToCSV: function(a, b, c, d) {
            var e;
            this.parent.config.hasOwnProperty("exportFieldsOptionForCSV")
              ? (e = this.parent.config.exportFieldsOptionForCSV)
              : this.parent.config.hasOwnProperty("csvAllFields") &&
                (e = this.parent.config.csvAllFields);
            a = k.exportToCSV(this.summaryFeatures, b, c, d, {
              type: "grouped",
              baseLabel: this.baseLabel,
              csvAllFields: e,
              layer: this.summaryLayer,
              opLayers: this.parent.opLayers,
              nlsValue: this.parent.nls.groupedSummary,
              nlsCount: this.parent.nls.count,
              summaryFields: this.summaryFields,
              allFields: this.allFields,
              configuredPopUpFields: this.configuredPopUpFields
            });
            this.summaryLayer = a.summaryLayer;
            return a.details;
          },
          _getFields: function(a) {
            this.layerDefinition = x.getFeatureLayerDefinition(a);
            this.layerObject = a;
            var b = k.getSkipFields(a),
              c,
              d = [];
            if ("undefined" !== typeof this.tab.advStat) {
              var g = this.tab.advStat.stats,
                f;
              for (f in g)
                0 < g[f].length &&
                  u.forEach(g[f], function(a) {
                    var b = {
                      field: a.expression,
                      alias: a.label + "",
                      type: f,
                      total: 0
                    };
                    c = a.expression;
                    d.push(b);
                  });
            }
            g = k.getSpecialFields(a);
            this.dateFields = g.dateFields;
            this.specialFields = g.specialFields;
            this.typeIdField = g.typeIdField;
            this.types = g.types;
            if (this.allFields)
              for (g = 0; g < a.fields.length; g++) {
                var h = a.fields[g];
                -1 === b.indexOf(h.name) &&
                  c !== h.name &&
                  d.push({ field: h.name, alias: h.alias, type: h.type });
              }
            return d;
          }
        });
      });
    },
    "widgets/SituationAwareness/js/ClosestInfo": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/Color dojo/_base/array dojo/DeferredList dojo/Deferred dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/on dojo/keys jimu/utils esri/geometry/geometryEngine esri/graphic esri/Color esri/layers/FeatureLayer esri/symbols/SimpleMarkerSymbol esri/symbols/SimpleLineSymbol esri/symbols/Font esri/symbols/TextSymbol esri/tasks/query ./analysisUtils".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F
      ) {
        return r("ClosestInfo", null, {
          featureCount: 0,
          mapServiceLayer: !1,
          loading: !1,
          queryOnLoad: !1,
          incidentCount: 0,
          constructor: function(a, b, c) {
            this.tab = a;
            this.container = b;
            this.parent = c;
            this.graphicsLayer = this.incident = null;
            this.map = c.map;
            this.specialFields = {};
            this.typeIdField = "";
            this.types = [];
            this.dateFields = {};
            this.config = c.config;
            this.parentNode = c.domNode;
            this.baseLabel =
              "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers;
          },
          queryTabCount: function(a, b, c, e) {
            var d = new h();
            this.incidentCount = a.length;
            var f = this.parent.config.distanceSettings[
                this.parent.config.distanceUnits
              ],
              k = this.parent.config.maxDistance;
            b = [];
            for (var l = 0; l < a.length; l++) {
              var m = a[l].geometry;
              "4326" === m.spatialReference.wkid ||
              m.spatialReference.isWebMercator()
                ? b.push(n.geodesicBuffer(m, k, f))
                : b.push(n.buffer(m, k, f));
            }
            var t = [this.tab.tabLayers[0]];
            this.mapServiceLayer &&
              1 < this.tab.tabLayers.length &&
              (t = [this.tab.tabLayers[1]]);
            if (
              0 < this.tab.tabLayers.length &&
              this.tab.tabLayers[0].url &&
              -1 < this.tab.tabLayers[0].url.indexOf("MapServer")
            ) {
              this.mapServiceLayer = !0;
              var r;
              "undefined" !== typeof this.tab.tabLayers[0].infoTemplate
                ? ((this.summaryLayer = this.tab.tabLayers[0]),
                  this.summaryLayer.hasOwnProperty("loaded") &&
                  this.summaryLayer.loaded
                    ? ((this.summaryFields = this._getFields(
                        this.summaryLayer
                      )),
                      this._performQuery(a, b, c, e, t).then(function(a) {
                        d.resolve(a);
                      }))
                    : ((r = new g(this.summaryLayer.url)),
                      (r.infoTemplate = this.tab.tabLayers[0].infoTemplate),
                      (t = [r]),
                      (this.tab.tabLayers = t),
                      x(
                        r,
                        "load",
                        q.hitch(this, function() {
                          this.summaryLayer = r;
                          this.summaryFields = this._getFields(
                            this.summaryLayer
                          );
                          this._performQuery(a, b, c, e, t).then(function(a) {
                            d.resolve(a);
                          });
                        })
                      )))
                : this.loading ||
                  ((r = new g(this.tab.tabLayers[0].url)),
                  (this.loading = !0),
                  x(
                    r,
                    "load",
                    q.hitch(this, function() {
                      this.summaryLayer = r;
                      this.summaryFields = this._getFields(this.summaryLayer);
                      for (
                        var g = this.tab.tabLayers[0].url.split(
                            "MapServer/"
                          )[1],
                          f = this.parent.map.itemInfo.itemData
                            .operationalLayers,
                          h = 0;
                        h < f.length;
                        h++
                      ) {
                        var k = f[h];
                        if (
                          -1 < this.tab.tabLayers[0].url.indexOf(k.url) &&
                          "undefined" !== typeof k.layerObject &&
                          k.layerObject.infoTemplates &&
                          (k = k.layerObject.infoTemplates[g])
                        ) {
                          r.infoTemplate = k.infoTemplate;
                          break;
                        }
                      }
                      t = [r];
                      this.tab.tabLayers = t;
                      this.loading = !1;
                      this._performQuery(a, b, c, e, t).then(function(a) {
                        d.resolve(a);
                      });
                    })
                  ));
            }
            this.mapServiceLayer ||
              this._performQuery(a, b, c, e, t).then(function(a) {
                d.resolve(a);
              });
            return d;
          },
          _performQuery: function(a, b, c, e, d) {
            var g = new h(),
              f = [],
              k,
              l;
            this.summaryGeoms = b;
            if (0 < b.length)
              for (a = 0; a < b.length; a++)
                (f = b[a]),
                  (l = F.createDefArray(d, f, this.parent.opLayers, this.tab)),
                  (k = 0 === a ? (f = l) : (f = k.concat(l)));
            new m(f).then(
              q.hitch(this, function(a) {
                for (var b = 0, d = 0; d < a.length; d++) {
                  var f = a[d][1];
                  isNaN(f)
                    ? f && f.features
                      ? 0 < f.features.length && (b += 1)
                      : f &&
                        "undefined" !== typeof f.length &&
                        0 < f.length &&
                        (b += 1)
                    : 0 < f && (b += 1);
                }
                this.updateTabCount(b, c, e);
                g.resolve(b);
              })
            );
            return g;
          },
          updateTabCount: function(a, b, c) {
            this.featureCount = 0 === parseInt(a, 10) ? 0 : a;
            F.updateTabCount(
              this.featureCount,
              b,
              c,
              this.baseLabel,
              this.incidentCount
            );
          },
          updateForIncident: function(a, b, c, e, d, f) {
            this.incidentCount = a.length;
            this.allFields =
              "undefined" !== typeof d && "undefined" !== typeof f
                ? d
                  ? !0
                  : f
                : !1;
            var k = "undefined" !== typeof e,
              l;
            v.forEach(
              this.tab.tabLayers,
              q.hitch(this, function(d) {
                k && (l = new h());
                if (d.url) {
                  var f = new g(d.url, {
                    mode: g.MODE_ONDEMAND,
                    infoTemplate: d.infoTemplate
                  });
                  x(
                    f,
                    "load",
                    q.hitch(this, function() {
                      this.tab.tabLayers = [f];
                      k
                        ? this.processIncident(a, b, c, e).then(
                            q.hitch(this, function(a) {
                              l.resolve(a);
                            }),
                            q.hitch(this, function(a) {
                              console.error(a);
                              l.reject(a);
                            })
                          )
                        : this.processIncident(a, b, c, e);
                    })
                  );
                } else
                  k
                    ? this.processIncident(a, b, c, e).then(
                        q.hitch(this, function(a) {
                          l.resolve(a);
                        }),
                        q.hitch(this, function(a) {
                          console.error(a);
                          l.reject(a);
                        })
                      )
                    : this.processIncident(a, b, c, e);
              })
            );
            if (k) return l;
          },
          processIncident: function(a, b, e, d) {
            this.incidents = a;
            var g,
              k = "undefined" !== typeof d;
            k
              ? (g = new h())
              : ((this.container.innerHTML = ""),
                f.add(this.container, "loading"));
            var l = [];
            d = this.parent.config.distanceSettings[
              this.parent.config.distanceUnits
            ];
            for (var t = [], r = 0; r < a.length; r++) {
              var u = a[r].geometry,
                w;
              w =
                "4326" === u.spatialReference.wkid ||
                u.spatialReference.isWebMercator()
                  ? n.geodesicBuffer(u, b, d)
                  : n.buffer(u, b, d);
              t.push({ geometry: u, buffer: w });
            }
            (this.graphicsLayer = e) && this.graphicsLayer.clear();
            a = [];
            b = this.tab.tabLayers[0];
            e =
              -1 === [null, void 0, ""].indexOf(b.id) ? b.id : this.tab.layers;
            e = F.getFilter(e, this.parent.opLayers);
            var x = this._getFields(b),
              C = F.getPopupConfiguredFields(b);
            for (d = 0; d < t.length; d++)
              (r = new B()),
                (r.returnGeometry = !0),
                (r.outSpatialReference = this.parent.map.spatialReference),
                (r.geometry = t[d].buffer),
                (r.where = e),
                (r.outFields = ["*"]),
                "undefined" !== typeof b.queryFeatures &&
                  a.push(b.queryFeatures(r));
            new m(a).then(
              q.hitch(this, function(a) {
                for (var b = 0; b < a.length; b++)
                  if (a[b][0]) {
                    var d = a[b][1].features,
                      e = [],
                      f = t[b].geometry;
                    if (d && 0 < d.length) {
                      for (var h = 0; h < d.length; h++) {
                        var n = new c(d[h].toJson()),
                          m = F.getDistance(
                            f,
                            n.geometry,
                            this.parent.config.distanceUnits
                          ),
                          r = { DISTANCE: m };
                        v.forEach(
                          x,
                          q.hitch(this, function(a) {
                            r[a] = n.attributes[a];
                          })
                        );
                        (this.config.hasOwnProperty(
                          "exportFieldsOptionForCSV"
                        ) &&
                          "allFields" ===
                            this.config.exportFieldsOptionForCSV) ||
                        (this.config.hasOwnProperty("csvAllFields") &&
                          (!0 === this.config.csvAllFields ||
                            "true" === this.config.csvAllFields))
                          ? (n.attributes.DISTANCE = m)
                          : (this.config.hasOwnProperty(
                              "exportFieldsOptionForCSV"
                            ) &&
                              "popUpFields" ===
                                this.config.exportFieldsOptionForCSV &&
                              !this.allFields &&
                              ((r = { DISTANCE: m }),
                              v.forEach(
                                C,
                                q.hitch(this, function(a) {
                                  r[a] = n.attributes[a];
                                })
                              )),
                            (n.attributes = r));
                        e.push(n);
                      }
                      e.sort(F.compareDistance);
                      l.push(e[0]);
                    }
                  } else
                    a[b][1] && a[b][1].message && console.log(a[b][1].message);
                l.sort(F.compareDistance);
                k
                  ? this._processResults(l, !0).then(
                      q.hitch(this, function(a) {
                        g.resolve(a);
                      })
                    )
                  : this._processResults(l);
              }),
              q.hitch(this, function(a) {
                console.error(a);
                g.reject(a);
              })
            );
            if (k) return g;
          },
          _processResults: function(g, n) {
            var m,
              r,
              v = g && 0 < g.length;
            if (v && "point" !== g[0].geometry.type)
              for (var C = g.length - 1; 0 <= C; C--)
                "undefined" === typeof g[C].geometry.getExtent() &&
                  g.splice(C, 1);
            if (n) m = new h();
            else if (
              ((this.container.innerHTML = ""),
              f.remove(this.container, "loading"),
              v)
            ) {
              r = d.create(
                "div",
                { class: "SAT_tabPanelContent" },
                this.container
              );
              C = d.create("div", {}, r);
              f.add(C, "SATcolExport");
              f.add(
                C,
                this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"
              );
              var H = d.create(
                "div",
                {
                  title: this.parent.nls.downloadCSV,
                  tabindex: "0",
                  role: "button",
                  "aria-label": this.parent.nls.downloadCSV,
                  class: "closestDownLoadCSVButton"
                },
                C
              );
              a.initFirstFocusNode(this.parentNode, H);
              f.add(H, "btnExport");
              x(H, "click", q.hitch(this, this._exportToCSV, g));
              x(
                H,
                "keydown",
                q.hitch(this, function(a) {
                  if (!a.shiftKey || a.keyCode !== b.TAB)
                    if (a.keyCode === b.ENTER || a.keyCode === b.SPACE)
                      this._exportToCSV(g, a),
                        setTimeout(function() {
                          H.focus();
                        }, 500);
                })
              );
              H.focus();
            }
            var C = this.parent.nls[this.parent.config.distanceUnits],
              y = [],
              G = 220;
            if (v)
              for (var B = 0; B < g.length; B++) {
                var I = B + 1,
                  z = g[B],
                  K = z.geometry,
                  P = K;
                "point" !== K.type && (P = K.getExtent().getCenter());
                var K = z.attributes,
                  Y;
                "point" === this.incidents[0].geometry.type &&
                  (Y =
                    Math.round(100 * K.DISTANCE) / 100 +
                    " " +
                    C +
                    " (" +
                    this.parent.nls.approximate +
                    ")");
                var X = "",
                  M = 0,
                  N = [];
                if ("undefined" !== typeof this.displayFields)
                  for (var U = 0; U < this.displayFields.length; U++) {
                    var V = this.displayFields[U],
                      aa;
                    a: for (aa in K)
                      if ("DISTANCE" !== aa && 3 > M && V.expression === aa) {
                        var L = F.getFieldValue(
                            aa,
                            K[aa],
                            this.specialFields,
                            this.dateFields,
                            "longMonthDayYear",
                            this.typeIdField,
                            this.types,
                            this.layerObject && this.layerObject.renderer
                              ? this.layerObject
                              : this.layerDefinition,
                            K,
                            V
                          ),
                          L =
                            "undefined" !== typeof L && null !== L
                              ? a.stripHTML(L.toString())
                              : "",
                          S =
                            "undefined" !== typeof V.label && "" !== V.label
                              ? V.label
                              : void 0,
                          W =
                            z._layer && z._layer.fields
                              ? z._layer.fields
                              : this.tab.tabLayers && this.tab.tabLayers[0]
                              ? this.tab.tabLayers[0].fields
                              : void 0;
                        W &&
                          "undefined" === typeof S &&
                          (W = F.getField(W, aa)) &&
                          (S = W.alias);
                        if (
                          "undefined" === typeof S ||
                          S in ["", " ", null, void 0]
                        )
                          S = aa;
                        F.isURL(L)
                          ? (L =
                              '\x3ca href\x3d"' +
                              L +
                              '" target\x3d"_blank" style\x3d"color: inherit;"\x3e' +
                              S +
                              "\x3c/a\x3e")
                          : F.isEmail(L) &&
                            (L =
                              '\x3ca href\x3d"mailto:' +
                              L +
                              '" style\x3d"color: inherit;"\x3e' +
                              S +
                              "\x3c/a\x3e");
                        X += V.validLabel
                          ? ("undefined" !== typeof V.label && "" !== V.label
                              ? S + " "
                              : "") +
                            L +
                            "\x3cbr/\x3e"
                          : L + "\x3cbr/\x3e";
                        M += 1;
                        N.push({
                          value: -1 < L.indexOf(",") ? L.replace(",", "") : L,
                          label: S
                        });
                        break a;
                      }
                  }
                y.push(N);
                n ||
                  ((z = d.create("div", {}, r)),
                  f.add(z, "SATcolRec"),
                  f.add(
                    z,
                    this.parent.lightTheme
                      ? "lightThemeBorder"
                      : "darkThemeBorder"
                  ),
                  (M = d.create("div", {}, z)),
                  f.add(M, "SATcolRecBar"),
                  (N = d.create(
                    "div",
                    {
                      innerHTML: I,
                      tabindex: "0",
                      role: "button",
                      "aria-label": this.parent.nls.zoomToFeature + " " + I
                    },
                    M
                  )),
                  f.add(N, "SATcolRecNum"),
                  l.set(N, "backgroundColor", this.parent.config.activeColor),
                  x(N, "click", q.hitch(this, this._zoomToLocation, P, null)),
                  x(N, "keydown", q.hitch(this, this._zoomToLocation, P, !0)),
                  a.initLastFocusNode(this.parentNode, N),
                  Y &&
                    ((N = d.create("div", { innerHTML: Y }, M)),
                    f.add(N, "SATcolDistance")),
                  this.parent.config.enableRouting &&
                    ((M = d.create(
                      "div",
                      {
                        class: "directionsButton",
                        title: this.parent.nls.get_directions,
                        tabindex: "0",
                        "aria-label": this.parent.nls.get_directions,
                        role: "button"
                      },
                      M
                    )),
                    f.add(M, "SATcolDir"),
                    x(
                      M,
                      "click",
                      q.hitch(this, this._routeToIncident, P, null)
                    ),
                    x(
                      M,
                      "keydown",
                      q.hitch(this, this._routeToIncident, P, !0)
                    ),
                    a.initLastFocusNode(this.parentNode, M)),
                  (X = d.create(
                    "div",
                    { class: "SATcolWrap", innerHTML: X },
                    z
                  )),
                  f.add(X, "SATcolInfo"),
                  (G += t.position(z).w),
                  (X = new E(
                    E.STYLE_SOLID,
                    new u.fromRgb(this.parent.config.activeMapGraphicColor),
                    1
                  )),
                  (X = new e(
                    e.STYLE_CIRCLE,
                    24,
                    X,
                    new u.fromRgb(this.parent.config.activeMapGraphicColor)
                  )),
                  (z = new D()),
                  (z.family = "Arial"),
                  (z.size = "12px"),
                  (I = new w(I, z, new k(this.parent.config.fontColor))),
                  I.setOffset(0, -4),
                  this.graphicsLayer.add(new c(P, X, K)),
                  this.graphicsLayer.add(new c(P, I, K)));
              }
            if (!n && v) l.set(r, "width", G);
            else if (v)
              return (
                m.resolve({ graphics: g, analysisResults: y, context: this }), m
              );
          },
          _exportToCSV: function(a, b, c, d) {
            var e;
            this.parent.config.hasOwnProperty("exportFieldsOptionForCSV")
              ? (e = this.parent.config.exportFieldsOptionForCSV)
              : this.parent.config.hasOwnProperty("csvAllFields") &&
                (e = this.parent.config.csvAllFields);
            a = F.exportToCSV(a, b, c, d, {
              type: "closest",
              baseLabel: this.baseLabel,
              csvAllFields: e,
              layer: this.tab.tabLayers[0],
              opLayers: this.parent.opLayers,
              nlsValue: this.parent.nls.closest,
              nlsCount: this.parent.nls.count
            });
            this.summaryLayer = a.summaryLayer;
            return a.details;
          },
          _getFields: function(b) {
            this.layerDefinition = a.getFeatureLayerDefinition(b);
            this.layerObject = b;
            b = F.getFields(b, this.tab, this.allFields, this.parent);
            this.dateFields = b.dateFields;
            this.specialFields = b.specialFields;
            this.typeIdField = b.typeIdField;
            this.types = b.types;
            this.displayFields = F.getDisplayFields(this.tab);
            return b.fields;
          },
          _zoomToLocation: function(a, c, d) {
            d.shiftKey && d.keyCode === b.TAB
              ? (d.stopPropagation(), (d.cancelBubble = !0))
              : (c && d.keyCode !== b.ENTER && d.keyCode !== b.SPACE) ||
                this.parent.zoomToLocation(a);
          },
          _routeToIncident: function(a, c, d) {
            (c && d.keyCode !== b.ENTER && d.keyCode !== b.SPACE) ||
              this.parent.routeToIncident(a);
          }
        });
      });
    },
    "widgets/SituationAwareness/js/ProximityInfo": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/Color dojo/_base/array dojo/DeferredList dojo/Deferred dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/on dojo/query dojo/keys esri/graphic esri/Color esri/layers/FeatureLayer esri/symbols/SimpleMarkerSymbol esri/symbols/SimpleLineSymbol esri/symbols/Font esri/symbols/TextSymbol esri/tasks/query esri/geometry/geometryEngine jimu/utils ./analysisUtils".split(
        " "
      ), function(
        r,
        q,
        u,
        v,
        m,
        h,
        f,
        d,
        t,
        l,
        x,
        b,
        a,
        n,
        c,
        k,
        g,
        e,
        E,
        D,
        w,
        B,
        F,
        G
      ) {
        return r("ProximityInfo", null, {
          featureCount: 0,
          mapServiceLayer: !1,
          loading: !1,
          queryOnLoad: !1,
          incidentCount: 0,
          constructor: function(a, b, c) {
            this.tab = a;
            this.container = b;
            this.parent = c;
            this.graphicsLayer = this.incident = null;
            this.specialFields = {};
            this.typeIdField = "";
            this.types = [];
            this.dateFields = {};
            this.config = c.config;
            this.parentNode = c.domNode;
            this.baseLabel =
              "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers;
          },
          queryTabCount: function(a, b, c, d) {
            var e = new h();
            this.incidentCount = a.length;
            var g = [this.tab.tabLayers[0]];
            this.mapServiceLayer &&
              1 < this.tab.tabLayers.length &&
              (g = [this.tab.tabLayers[1]]);
            if (
              0 < this.tab.tabLayers.length &&
              this.tab.tabLayers[0].url &&
              -1 < this.tab.tabLayers[0].url.indexOf("MapServer")
            ) {
              this.mapServiceLayer = !0;
              var f;
              "undefined" !== typeof this.tab.tabLayers[0].infoTemplate
                ? ((this.summaryLayer = this.tab.tabLayers[0]),
                  this.summaryLayer.hasOwnProperty("loaded") &&
                  this.summaryLayer.loaded
                    ? ((this.summaryFields = this._getFields(
                        this.summaryLayer
                      )),
                      this._performQuery(a, b, c, d, g).then(function(a) {
                        e.resolve(a);
                      }))
                    : ((f = new k(this.summaryLayer.url)),
                      (f.infoTemplate = this.tab.tabLayers[0].infoTemplate),
                      (g = [f]),
                      (this.tab.tabLayers = g),
                      x(
                        f,
                        "load",
                        q.hitch(this, function() {
                          this.summaryLayer = f;
                          this.summaryFields = this._getFields(
                            this.summaryLayer
                          );
                          this._performQuery(a, b, c, d, g).then(function(a) {
                            e.resolve(a);
                          });
                        })
                      )))
                : this.loading ||
                  ((f = new k(this.tab.tabLayers[0].url)),
                  (this.loading = !0),
                  x(
                    f,
                    "load",
                    q.hitch(this, function() {
                      this.summaryLayer = f;
                      this.summaryFields = this._getFields(this.summaryLayer);
                      for (
                        var g = this.tab.tabLayers[0].url.split(
                            "MapServer/"
                          )[1],
                          h = this.parent.map.itemInfo.itemData
                            .operationalLayers,
                          k = 0;
                        k < h.length;
                        k++
                      ) {
                        var l = h[k];
                        if (
                          -1 < this.tab.tabLayers[0].url.indexOf(l.url) &&
                          "undefined" !== typeof l.layerObject &&
                          l.layerObject.infoTemplates &&
                          (l = l.layerObject.infoTemplates[g])
                        ) {
                          f.infoTemplate = l.infoTemplate;
                          break;
                        }
                      }
                      this.tab.tabLayers = [f];
                      this.loading = !1;
                      this._performQuery(a, b, c, d, this.tab.tabLayers).then(
                        function(a) {
                          e.resolve(a);
                        }
                      );
                    })
                  ));
            }
            this.mapServiceLayer ||
              this._performQuery(a, b, c, d, g).then(function(a) {
                e.resolve(a);
              });
            return e;
          },
          _performQuery: function(a, b, c, d, e) {
            var g = new h(),
              f = [],
              k,
              l;
            0 < b.length
              ? (l = G.getGeoms(b))
              : 0 < a.length && (l = G.getGeoms(a));
            this.summaryGeoms = l;
            if (0 < l.length)
              for (a = 0; a < l.length; a++)
                (f = l[a]),
                  (b = G.createDefArray(e, f, this.parent.opLayers, this.tab)),
                  (k = 0 === a ? (f = b) : (f = k.concat(b)));
            new m(f).then(
              q.hitch(this, function(a) {
                for (var b = 0, e = 0; e < a.length; e++) {
                  var f = a[e][1];
                  isNaN(f)
                    ? f && f.features
                      ? (b += f.features.length)
                      : f && "undefined" !== typeof f.length && (b += f.length)
                    : (b += f);
                }
                this.updateTabCount(b, c, d);
                g.resolve(b);
              })
            );
            return g;
          },
          updateTabCount: function(a, b, c) {
            this.featureCount = a;
            G.updateTabCount(
              this.featureCount,
              b,
              c,
              this.baseLabel,
              this.incidentCount
            );
          },
          updateForIncident: function(a, b, c, d, e, g) {
            this.incidentCount = a.length;
            this.allFields =
              "undefined" !== typeof e && "undefined" !== typeof g
                ? e
                  ? !0
                  : g
                : !1;
            var f = "undefined" !== typeof d,
              l;
            v.forEach(
              this.tab.tabLayers,
              q.hitch(this, function(g) {
                f && (l = new h());
                if (g.url) {
                  var n = new k(g.url, {
                    mode: k.MODE_ONDEMAND,
                    infoTemplate: g.infoTemplate
                  });
                  x(
                    n,
                    "load",
                    q.hitch(this, function() {
                      this.tab.tabLayers = [n];
                      f
                        ? this.processIncident(a, b, c, d, e).then(
                            q.hitch(this, function(a) {
                              l.resolve(a);
                            }),
                            q.hitch(this, function(a) {
                              console.error(a);
                              l.reject(a);
                            })
                          )
                        : this.processIncident(a, b, c, d, e);
                    })
                  );
                } else
                  f
                    ? this.processIncident(a, b, c, d, e).then(
                        q.hitch(this, function(a) {
                          l.resolve(a);
                        }),
                        q.hitch(this, function(a) {
                          console.error(a);
                          l.reject(a);
                        })
                      )
                    : this.processIncident(a, b, c, d, e);
              })
            );
            if (f) return l;
          },
          processIncident: function(a, b, c, d, e) {
            this.incidents = a;
            var g = [],
              k;
            if (0 === b.length)
              for (var l = 0; l < a.length; l++)
                (k = a[l]),
                  (k = k.geometry ? k.geometry : k),
                  "polygon" === k.type
                    ? (b.push(k), g.push({ geometry: k, buffer: k }))
                    : g.push({ geometry: void 0, buffer: void 0 });
            else
              for (l = 0; l < a.length; l++) {
                k = a[l];
                var n = b[l].geometry ? b[l].geometry : b[l];
                k = k.geometry ? k.geometry : k;
                g.push({ geometry: k, buffer: n });
              }
            if (0 !== b.length) {
              for (a = 0; a < g.length; a++)
                if (((b = g[a].buffer), "undefined" !== typeof b))
                  for (k = 0; k < g.length; k++)
                    if (
                      k !== a &&
                      ((l = g[k].buffer),
                      "undefined" !== typeof l && B.overlaps(b, l))
                    ) {
                      g[a].buffer = B.difference(b, l);
                      g[k].buffer = B.difference(l, b);
                      l = B.union(l, b);
                      l = B.difference(l, g[a].buffer);
                      l = B.difference(l, g[k].buffer);
                      if (Array.isArray(g[a].geometry)) {
                        if (Array.isArray(g[k].geometry))
                          for (n = 0; n < g[k].geometry.length; n++)
                            g[a].geometry.push(g[k].geometry[n]);
                        else g[a].geometry.push(g[k].geometry);
                        n = g[a].geometry;
                      } else if (
                        ((n = []),
                        n.push(g[a].geometry),
                        Array.isArray(g[k].geometry))
                      )
                        for (var t = 0; t < g[k].geometry.length; t++)
                          n.push(g[k].geometry[t]);
                      else n.push(g[k].geometry);
                      g.push({ geometry: n, buffer: l });
                    }
              var r,
                u = "undefined" !== typeof d;
              u
                ? (r = new h())
                : ((this.container.innerHTML = ""),
                  f.add(this.container, "loading"));
              var x = [];
              this.graphicsLayer = c;
              c = this.tab.tabLayers[0];
              var E = this._getFields(c),
                C = G.getPopupConfiguredFields(c);
              d =
                -1 === [null, void 0, ""].indexOf(c.id)
                  ? c.id
                  : this.tab.layers;
              d = G.getFilter(d, this.parent.opLayers);
              a = [];
              for (b = 0; b < g.length; b++)
                (k = new w()),
                  (k.returnGeometry = !0),
                  (k.outSpatialReference = this.parent.map.spatialReference),
                  (k.geometry = g[b].buffer),
                  (k.where = d),
                  (k.outFields = ["*"]),
                  "undefined" !== typeof c.queryFeatures &&
                    a.push(c.queryFeatures(k));
              new m(a).then(
                q.hitch(this, function(a) {
                  for (var b = 0; b < a.length; b++) {
                    var c = a[b][1];
                    if (c && c.features)
                      for (
                        var c = c.features, d = g[b].geometry, f = 0;
                        f < c.length;
                        f++
                      ) {
                        var k = c[f],
                          h = k.geometry,
                          l;
                        if (Array.isArray(d)) {
                          for (var n, m = 0; m < d.length; m++) {
                            var t = G.getDistance(
                              d[m],
                              h,
                              this.parent.config.distanceUnits
                            );
                            if ("undefined" === typeof n || t < n) n = t;
                          }
                          h = n;
                          l = { DISTANCE: n };
                        } else
                          (h = G.getDistance(
                            d,
                            h,
                            this.parent.config.distanceUnits
                          )),
                            (l = { DISTANCE: h });
                        v.forEach(
                          E,
                          q.hitch(this, function(a) {
                            l[a] = k.attributes[a];
                          })
                        );
                        (this.config.hasOwnProperty(
                          "exportFieldsOptionForCSV"
                        ) &&
                          "allFields" ===
                            this.config.exportFieldsOptionForCSV) ||
                        (this.config.hasOwnProperty("csvAllFields") &&
                          (!0 === this.config.csvAllFields ||
                            "true" === this.config.csvAllFields))
                          ? (k.attributes.DISTANCE = h)
                          : (this.config.hasOwnProperty(
                              "exportFieldsOptionForCSV"
                            ) &&
                              "popUpFields" ===
                                this.config.exportFieldsOptionForCSV &&
                              !e &&
                              ((l = { DISTANCE: h }),
                              v.forEach(
                                C,
                                q.hitch(this, function(a) {
                                  l[a] = k.attributes[a];
                                })
                              )),
                            (k.attributes = l));
                        x.push(k);
                      }
                  }
                  x.sort(G.compareDistance);
                  if (u) {
                    var w = {
                      graphics: x,
                      analysisResults: x.length,
                      context: this
                    };
                    this._processResults(x, !0).then(
                      q.hitch(this, function(a) {
                        r.resolve(q.mixin(w, a));
                      })
                    );
                  } else this._processResults(x);
                }),
                q.hitch(this, function(a) {
                  console.error(a);
                  r.reject(a);
                })
              );
              if (u) return r;
            }
          },
          _processResults: function(b, k) {
            var m,
              r,
              w = b && 0 < b.length;
            if (w && "point" !== b[0].geometry.type)
              for (var C = b.length - 1; 0 <= C; C--)
                "undefined" === typeof b[C].geometry.getExtent() &&
                  b.splice(C, 1);
            if (k) m = new h();
            else if (
              ((this.container.innerHTML = ""),
              f.remove(this.container, "loading"),
              this.graphicsLayer.clear(),
              w)
            ) {
              r = d.create(
                "div",
                { class: "SAT_tabPanelContent" },
                this.container
              );
              C = d.create("div", {}, r);
              f.add(C, "SATcolExport");
              f.add(
                C,
                this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"
              );
              var y = d.create(
                "div",
                {
                  title: this.parent.nls.downloadCSV,
                  tabindex: "0",
                  role: "button",
                  "aria-label": this.parent.nls.downloadCSV,
                  class: "proximityDownLoadCSVButton"
                },
                C
              );
              f.add(y, "btnExport");
              y.focus();
              F.initFirstFocusNode(this.parentNode, y);
              x(y, "click", q.hitch(this, this._exportToCSV, b));
              x(
                y,
                "keydown",
                q.hitch(this, function(c) {
                  if (!c.shiftKey || c.keyCode !== a.TAB)
                    if (c.keyCode === a.ENTER || c.keyCode === a.SPACE)
                      this._exportToCSV(b, c),
                        setTimeout(function() {
                          y.focus();
                        }, 500);
                })
              );
            }
            var C = this.parent.nls[this.parent.config.distanceUnits],
              A;
            "undefined" !== typeof this.tab.advStat &&
            "undefined" !== typeof this.tab.advStat.stats &&
            "undefined" !== typeof this.tab.advStat.stats.outFields
              ? (A = this.tab.advStat.stats.outFields)
              : ((A = []),
                0 < this.tab.tabLayers.length &&
                  v.forEach(
                    this.tab.tabLayers,
                    q.hitch(this, function(a) {
                      "undefined" !== typeof a.popupInfo
                        ? v.forEach(
                            a.popupInfo.fieldInfos,
                            q.hitch(this, function(a) {
                              if (a.visible) {
                                var b = { value: 0 };
                                b.expression = a.fieldName;
                                b.label = a.label;
                                A.push(b);
                              }
                            })
                          )
                        : a.infoTemplate
                        ? v.forEach(
                            a.infoTemplate.info.fieldInfos,
                            q.hitch(this, function(a) {
                              if (a.visible) {
                                var b = { value: 0 };
                                b.expression = a.fieldName;
                                b.label = a.label;
                                A.push(b);
                              }
                            })
                          )
                        : v.forEach(
                            (a.layerObject ? a.layerObject : a).fields,
                            q.hitch(this, function(a) {
                              var b = { value: 0 };
                              b.expression = a.name;
                              b.label = a.alias;
                              A.push(b);
                            })
                          );
                    })
                  ));
            var B = 220,
              I = [];
            if (w)
              for (var z = 0; z < b.length; z++) {
                var K = z + 1,
                  P = b[z],
                  Y = P.geometry,
                  X = Y;
                "point" !== Y.type && (X = Y.getExtent().getCenter());
                var Y = P.attributes,
                  M = G.getDistanceLabel(
                    Y.DISTANCE,
                    C,
                    this.parent.nls.approximate
                  ),
                  N = "",
                  U = 0,
                  V = [];
                if ("undefined" !== typeof A) {
                  for (var aa = 0; aa < A.length; aa++) {
                    var L = A[aa],
                      S;
                    for (S in Y)
                      if ("DISTANCE" !== S && 3 > U && L.expression === S) {
                        var W = G.getFieldValue(
                            S,
                            Y[S],
                            this.specialFields,
                            this.dateFields,
                            "longMonthDayYear",
                            this.typeIdField,
                            this.types,
                            this.layerObject && this.layerObject.renderer
                              ? this.layerObject
                              : this.layerDefinition,
                            Y,
                            L
                          ),
                          W =
                            "undefined" !== typeof W && null !== W
                              ? F.stripHTML(W.toString())
                              : "",
                          ba =
                            "undefined" !== typeof L.label && "" !== L.label
                              ? L.label
                              : void 0,
                          ca =
                            P._layer && P._layer.fields
                              ? P._layer.fields
                              : this.tab.tabLayers && this.tab.tabLayers[0]
                              ? this.tab.tabLayers[0].fields
                              : void 0;
                        ca &&
                          "undefined" === typeof ba &&
                          (ca = G.getField(ca, S)) &&
                          (ba = ca.alias);
                        if (
                          "undefined" === typeof ba ||
                          ba in ["", " ", null, void 0]
                        )
                          ba = S;
                        G.isURL(W)
                          ? (W =
                              '\x3ca href\x3d"' +
                              W +
                              '" target\x3d"_blank" style\x3d"color: inherit;"\x3e' +
                              ba +
                              "\x3c/a\x3e")
                          : G.isEmail(W) &&
                            (W =
                              '\x3ca href\x3d"mailto:' +
                              W +
                              '" style\x3d"color: inherit;"\x3e' +
                              ba +
                              "\x3c/a\x3e");
                        N += L.validLabel
                          ? ("undefined" !== typeof L.label && "" !== L.label
                              ? ba + " "
                              : "") +
                            W +
                            "\x3cbr/\x3e"
                          : W + "\x3cbr/\x3e";
                        U += 1;
                        V.push({ label: ba, value: W });
                      }
                  }
                  V.push({ label: this.parent.nls.distance, value: M });
                  0 < V.length && I.push(V);
                }
                k ||
                  ((P = d.create("div", {}, r)),
                  f.add(P, "SATcolRec"),
                  f.add(
                    P,
                    this.parent.lightTheme
                      ? "lightThemeBorder"
                      : "darkThemeBorder"
                  ),
                  (U = d.create("div", {}, P)),
                  f.add(U, "SATcolRecBar"),
                  (V = d.create(
                    "div",
                    {
                      innerHTML: K,
                      tabindex: "0",
                      role: "button",
                      "aria-label": this.parent.nls.zoomToFeature + " " + K,
                      isLastElement: b.length - 1 === z
                    },
                    U
                  )),
                  f.add(V, "SATcolRecNum"),
                  b.length - 1 === z && F.initLastFocusNode(this.parentNode, V),
                  l.set(V, "backgroundColor", this.parent.config.activeColor),
                  x(V, "click", q.hitch(this, this._zoomToLocation, X, null)),
                  x(V, "keydown", q.hitch(this, this._zoomToLocation, X, !0)),
                  "point" === this.incidents[0].geometry.type &&
                    ((M = d.create("div", { innerHTML: M }, U)),
                    f.add(M, "SATcolDistance")),
                  this.parent.config.enableRouting &&
                    ((M = d.create(
                      "div",
                      {
                        class: "directionsButton",
                        title: this.parent.nls.get_directions,
                        tabindex: "0",
                        "aria-label": this.parent.nls.get_directions,
                        role: "button"
                      },
                      U
                    )),
                    f.add(M, "SATcolDir"),
                    x(
                      M,
                      "click",
                      q.hitch(this, this._routeToIncident, X, null)
                    ),
                    x(
                      M,
                      "keydown",
                      q.hitch(this, this._routeToIncident, X, !0)
                    ),
                    F.initLastFocusNode(this.parentNode, M)),
                  (N = d.create(
                    "div",
                    { class: "SATcolWrap", innerHTML: N },
                    P
                  )),
                  f.add(N, "SATcolInfo"),
                  (B += t.position(P).w),
                  (N = new e(
                    e.STYLE_SOLID,
                    new u.fromString(this.parent.config.activeMapGraphicColor),
                    1
                  )),
                  (N = new g(
                    g.STYLE_CIRCLE,
                    24,
                    N,
                    new u.fromString(this.parent.config.activeMapGraphicColor)
                  )),
                  (M = new E()),
                  (M.family = "Arial"),
                  (M.size = "12px"),
                  (K = new D(K, M, new c(this.parent.config.fontColor))),
                  K.setOffset(0, -4),
                  this.graphicsLayer.add(new n(X, N, Y)),
                  this.graphicsLayer.add(new n(X, K, Y)));
              }
            if (!k && w) l.set(r, "width", B + "px");
            else return m.resolve({ reportResults: I }), m;
          },
          _exportToCSV: function(a, b, c, d) {
            var e;
            this.parent.config.hasOwnProperty("exportFieldsOptionForCSV")
              ? (e = this.parent.config.exportFieldsOptionForCSV)
              : this.parent.config.hasOwnProperty("csvAllFields") &&
                (e = this.parent.config.csvAllFields);
            a = G.exportToCSV(a, b, c, d, {
              type: "proximity",
              baseLabel: this.baseLabel,
              csvAllFields: e,
              layer: this.tab.tabLayers[0],
              opLayers: this.parent.opLayers,
              nlsValue: this.parent.nls.proximity,
              nlsCount: this.parent.nls.count,
              unit: this.parent.nls[this.parent.config.distanceUnits],
              approximateLabel: this.parent.nls.approximate
            });
            this.summaryLayer = a.summaryLayer;
            return a.details;
          },
          _getFields: function(a) {
            this.layerDefinition = F.getFeatureLayerDefinition(a);
            this.layerObject = a;
            a = G.getFields(a, this.tab, this.allFields, this.parent);
            this.dateFields = a.dateFields;
            this.specialFields = a.specialFields;
            this.typeIdField = a.typeIdField;
            this.types = a.types;
            this.displayFields = G.getDisplayFields(this.tab);
            return a.fields;
          },
          _zoomToLocation: function(b, c, d) {
            (d.shiftKey && d.keyCode === a.TAB) ||
              (c && d.keyCode !== a.ENTER && d.keyCode !== a.SPACE) ||
              this.parent.zoomToLocation(b);
          },
          _routeToIncident: function(b, c, d) {
            (c && d.keyCode !== a.ENTER && d.keyCode !== a.SPACE) ||
              this.parent.routeToIncident(b);
          }
        });
      });
    },
    "widgets/SituationAwareness/js/SnapShotUtils": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/Deferred dojo/DeferredList dojo/_base/array jimu/utils jimu/dijit/SnapShot ./CSVUtils".split(
        " "
      ), function(r, q, u, v, m, h, f, d) {
        return r("SnapShotUtils", null, {
          portal: null,
          portalUrl: "",
          logo: "",
          originMapId: "",
          originAppId: "",
          credential: null,
          nls: null,
          layerArray: [],
          parent: null,
          downloadAll: !1,
          time: null,
          constructor: function(d) {
            this.parent = d;
            this.snapshot = new f(d.appConfig, d.map);
            this.map = this.parent.map;
            this.extent = this.map.extent;
            this.nls = q.mixin(
              {},
              d.nls,
              window.jimuNls.drawBox,
              window.jimuNls.snapshot
            );
          },
          createSnapShot: function(d) {
            var f = new u(),
              m = h.stripHTML(d.name),
              b = this._getTime(d.time);
            this.createLayerItems(d, b, m).then(
              q.hitch(this, function(a) {
                this.snapshot
                  .createSnapShot({
                    folderOptions: {
                      folderName: m + "_" + b,
                      title: m + "_" + b,
                      description: m + " " + this.nls.snapshot
                    },
                    mapTitle:
                      m + " (" + this.nls.snapshot_append + " " + b + ")",
                    name: m + " (" + b + ")",
                    shareWith: {
                      everyone: !1,
                      org: !1,
                      groups: d.groups.join()
                    },
                    mapExtent: this.map.extent,
                    data: a
                  })
                  .then(function() {
                    f.resolve();
                  });
              })
            );
            return f;
          },
          _getTime: function(d) {
            d = new Date(d);
            var f = d.getTimezoneOffset();
            return (
              h.fieldFormatter.getFormattedDate(d, {
                dateFormat: "shortDateShortTime"
              }) +
              " " +
              this.nls.utc +
              (0 > f ? "+" + Math.abs(f) / 60 : "-" + f / 60)
            );
          },
          createLayerItems: function(d, f, h) {
            var b = new u(),
              a = d.layers.reverse();
            this.buffers = d.buffers;
            this.incidents = d.incidents;
            d = [];
            for (var l = 0; l < a.length; l++) {
              var c = !0;
              a[l].analysisObject &&
                "undefined" !== typeof a[l].analysisObject.featureCount &&
                0 === a[l].analysisObject.featureCount &&
                (c = !1);
              a[l].graphics && 0 === a[l].graphics.length && (c = !1);
              c &&
                d.push(
                  this.createItem(
                    a[l],
                    this.incidents,
                    this.buffers,
                    f,
                    this.nls,
                    h
                  )
                );
            }
            var k = [];
            new v(d).then(
              q.hitch(this, function(a) {
                for (var c = 0; c < a.length; c++) {
                  var d = a[c][1];
                  if (Array.isArray(d))
                    for (var g = 0; g < d.length; g++) k.push(d[g]);
                  else k.push(d);
                }
                b.resolve(k);
              }),
              q.hitch(this, function(a) {
                b.reject(a);
              })
            );
            return b;
          },
          createItem: function(d, f, h, b, a, n) {
            var c = new u(),
              k = {
                label: d.label,
                title: d.label + "_" + b,
                desc:
                  a.snapshot_append +
                  " " +
                  a.of_append +
                  " " +
                  (d.type ? d.type : d.label) +
                  " " +
                  a.layer_append +
                  " " +
                  d.label +
                  " (" +
                  b +
                  ")",
                name: d.label + " (" + b + ")",
                tags: [n + "," + a.snapshot_append]
              };
            if (d.layerObject) {
              var g = d.layerObject;
              n = d.analysisObject;
              var e;
              g.infoTemplate &&
                g.infoTemplate.info &&
                (e = g.infoTemplate.info);
              k.popupInfo = e;
              "groupedSummary" === d.type || "summary" === d.type
                ? n.updateForIncident(f, h, null, null, !0, !0, !0).then(
                    q.hitch(this, function(d) {
                      d = this.createAnalysisLayerJSON(d, g, a, b, k);
                      c.resolve(d);
                    })
                  )
                : n
                    .updateForIncident(
                      f,
                      "closest" === d.type ? this.parent.config.maxDistance : h,
                      null,
                      !0,
                      !0,
                      !0
                    )
                    .then(
                      q.hitch(this, function(d) {
                        d = this.createAnalysisLayerJSON(d, g, a, b, k);
                        c.resolve(d);
                      })
                    );
            } else
              (d = this.createIncidentBufferLayerJSON(d.graphics, a, b, k)),
                c.resolve(d);
            return c;
          },
          createAnalysisLayerJSON: function(d, f, h, b, a) {
            h = d.graphics;
            b = d.context._exportToCSV(h, !0);
            d = [];
            for (var l = 0; l < b.length; l++) {
              var c = b[l];
              "esriFieldTypeOID" !== c.type && d.push(c);
            }
            for (b = 0; b < h.length; b++)
              (l = h[b]),
                l.geometry.cache &&
                  (l.geometry.clearCache(), delete l.geometry.cahce);
            return {
              graphics: h,
              renderer: f.renderer,
              infoTemplate: a.popupInfo,
              fields: d,
              tags: a.tags,
              description: a.desc,
              name: a.name,
              visibleOnStartup: !1,
              typeIdField: f.typeIdField,
              types: f.types,
              minScale: f.minScale,
              maxScale: f.maxScale
            };
          },
          createIncidentBufferLayerJSON: function(d, f, h, b) {
            var a = [],
              l = [],
              c = [];
            f = [];
            m.forEach(d, function(b) {
              switch (b.geometry.type) {
                case "point":
                  a.push(b);
                  break;
                case "polyline":
                  l.push(b);
                  break;
                case "polygon":
                  c.push(b);
              }
            });
            d = [];
            0 < a.length && d.push(a);
            0 < l.length && d.push(l);
            0 < c.length && d.push(c);
            h = {
              point: this.nls.point,
              polyline: this.nls.line,
              polygon: this.nls.polygon
            };
            for (var k = 0; k < d.length; k++) {
              var g = d[k],
                e;
              0 < g.length &&
                ((e = g[0]),
                (e =
                  h[
                    "undefined" !== typeof e.geometry ? e.geometry.type : e.type
                  ]),
                f.push({
                  graphics: g,
                  fields: [],
                  tags: b.tags,
                  description: b.desc,
                  name: 1 === d.length ? b.name : e + " " + b.name,
                  visibleOnStartup: !1
                }));
            }
            return f;
          },
          createDownloadZip: function(f, h, m) {
            var b = new u(),
              a = this.nls.calculated_results;
            this._performAnalysis(f, h, m, this.downloadAll, !1).then(
              function(f) {
                for (var c = [], k = 0; k < f.length; k++) {
                  var g = f[k];
                  (g = g.context._exportToCSV(
                    g.graphics,
                    !1,
                    !0,
                    g.analysisResults
                  )) && c.push(g);
                }
                0 < c.length && d.exportCalculatedResultsCSV(a, c);
                b.resolve("success");
              },
              function(a) {
                b.reject(a);
              }
            );
            return b;
          },
          _performAnalysis: function(d, f, h, b, a) {
            for (var l = new u(), c = [], k = 0; k < d.length; k++) {
              var g = d[k];
              console.log("AO: " + g);
              var e = !0;
              g.analysisObject &&
                "undefined" !== typeof g.analysisObject.featureCount &&
                0 === g.analysisObject.featureCount &&
                (e = !1);
              e &&
                ("groupedSummary" === g.type || "summary" === g.type
                  ? c.push(
                      g.analysisObject.updateForIncident(
                        f,
                        h,
                        null,
                        null,
                        !0,
                        a,
                        b
                      )
                    )
                  : c.push(
                      g.analysisObject.updateForIncident(
                        f,
                        "closest" === g.type
                          ? this.parent.config.maxDistance
                          : h,
                        null,
                        !0,
                        a,
                        b
                      )
                    ));
            }
            var m = [];
            new v(c).then(
              q.hitch(this, function(a) {
                for (var b = 0; b < a.length; b++) m.push(a[b][1]);
                l.resolve(m);
              }),
              q.hitch(this, function(a) {
                console.error(a);
                l.reject(a);
              })
            );
            return l;
          }
        });
      });
    },
    "jimu/dijit/SnapShot": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred dojo/DeferredList jimu/utils esri/request esri/geometry/webMercatorUtils esri/geometry/Polygon esri/geometry/Polyline jimu/portalUtils jimu/tokenUtils jimu/dijit/Message".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a) {
        return r("Snapshot", null, {
          _portal: null,
          _portalUrl: "",
          _layerArray: [],
          _originMapId: "",
          _originAppId: "",
          _credential: null,
          name: "",
          appendTimeStamp: null,
          baseMap: null,
          tags: "",
          description: "",
          shareWith: null,
          logo: "",
          time: null,
          constructor: function(a, b) {
            this.map = b;
            this.appConfig = a;
            this._originAppId = a.appId;
            this._originMapId = b.itemId;
            this._mapItemInfo = b.itemInfo;
            this._portalUrl = a.portalUrl;
            this._portal = x.getPortal(this._portalUrl);
            this._baseUrl = this._portalUrl + "sharing/rest/";
            this.nls = q.mixin(
              {},
              window.jimuNls.drawBox,
              window.jimuNls.snapshot
            );
          },
          createSnapShot: function(a) {
            this.ids = [];
            this.layerArray = [];
            this.time = this._getDateString(Date.now());
            this.name =
              (a.appendTimeStamp && a.name
                ? a.name + "_" + this.time
                : a.name) || this._mapItemInfo.item.title + "_" + this.time;
            this.extent = a.mapExtent || this.map.extent;
            this.logo = a.logo || this.appConfig.logo;
            this.mapName = a.mapTitle || this.name;
            this.shareWith = a.shareWith || {
              everyone: !1,
              org: !1,
              groups: ""
            };
            var b = a.folderOptions;
            b.name = a.folderOptions.name || this.name;
            b.title = a.folderOptions.title || this.name;
            b.description = a.folderOptions.description || this.name;
            a = a.data.reverse();
            return this._createSnapshot(b, a);
          },
          _createSnapshot: function(a, b) {
            var c = new v();
            this._portal
              .getUser()
              .then(q.hitch(this, this._processUser), function(a) {
                c.reject(a);
              })
              .then(q.hitch(this, this._createFolder, a), function(a) {
                c.reject(a);
              })
              .then(q.hitch(this, this._createItems, b), function(a) {
                c.reject(a);
              })
              .then(q.hitch(this, this._addLayers), function(a) {
                c.reject(a);
              })
              .then(q.hitch(this, this._createMap, this._mapItemInfo), function(
                a
              ) {
                c.reject(a);
              })
              .then(q.hitch(this, this._processMap), function(a) {
                c.reject(a);
              })
              .then(q.hitch(this, this._shareItems), function(a) {
                c.reject(a);
              })
              .then(q.hitch(this, this._showMessage), function(a) {
                c.reject(a);
              })
              .then(function() {
                c.resolve();
              });
            return c;
          },
          _processUser: function(a) {
            var b = new v();
            this.user = a;
            this.groups = a.groups;
            b.resolve();
            return b;
          },
          _createFolder: function(a) {
            var b = new v();
            a = {
              url:
                this._baseUrl +
                "content/users/" +
                this.user.username +
                "/createFolder",
              content: q.mixin({ f: "json" }, a),
              handleAs: "json",
              callbackParamName: "callback"
            };
            this._isValidCredential() &&
              (a.content.token = this._credential.token);
            f(a, { usePost: !0 }).then(
              q.hitch(this, function(a) {
                a.success
                  ? ((this.folder = a.folder) &&
                      this.folder.id &&
                      this.ids.push(this.folder.id),
                    b.resolve(a.folder))
                  : (console.log(a), b.reject(a));
              }),
              q.hitch(this, function(a) {
                b.reject(a);
              })
            );
            return b;
          },
          _createItems: function(a) {
            var b = new v(),
              d = [];
            u.forEach(
              a,
              q.hitch(this, function(a) {
                a.graphics &&
                  0 < a.graphics.length &&
                  d.push(this._createLayerItem(a));
              })
            );
            var g = [];
            new m(d).then(
              q.hitch(this, function(a) {
                for (var c = 0; c < a.length; c++) g.push(a[c][1]);
                b.resolve(g);
              }),
              q.hitch(this, function(a) {
                b.reject(a);
              })
            );
            return b;
          },
          _addLayers: function(a) {
            for (var b = new v(), d = [], g = 0; g < a.length; g++)
              d.push(this.user.addItem(a[g], this.folder.id));
            var e = [];
            new m(d).then(
              q.hitch(this, function(a) {
                for (var c = 0; c < a.length; c++) {
                  var d = a[c][1];
                  d.success && (e.push(d.id), this.ids.push(d.id));
                }
                b.resolve(e);
              }),
              q.hitch(this, function(a) {
                b.reject(a);
              })
            );
            return b;
          },
          _createMap: function(a, b) {
            for (
              var c = a.itemData, g = this.name, e = [], f = 0;
              f < c.baseMap.baseMapLayers.length;
              f++
            ) {
              var h = c.baseMap.baseMapLayers[f];
              e.push({
                id: h.id,
                layerType: h.layerType,
                url: h.url,
                visibility: h.visibility,
                opacity: h.opacity,
                title: h.title,
                styleUrl: h.styleUrl,
                itemId: h.itemId
              });
            }
            c = { baseMapLayers: e };
            e = [];
            for (f = 0; f < this.layerArray.length; f++)
              (h = this.layerArray[f]),
                e.push({
                  id: h.layer.id,
                  layerType: "ArcGISFeatureLayer",
                  visibility: h.layer.visible,
                  opacity: h.layer.opacity,
                  title: h.label,
                  type: "Feature Collection",
                  itemId: b[f]
                });
            b = d.webMercatorToGeographic(this.extent);
            a = {
              title: g,
              type: "Web Map",
              item: g,
              extent: b.xmin + "," + b.ymin + "," + b.xmax + "," + b.ymax,
              text: JSON.stringify({
                operationalLayers: e,
                baseMap: c,
                spatialReference: this.map.spatialReference,
                version:
                  a && a.itemData && a.itemData.version
                    ? a.itemData.version
                    : "2.4"
              }),
              tags: this.name + "," + this.nls.snapshot_append,
              wabType: "HTML"
            };
            return this.user.addItem(a, this.folder.id);
          },
          _processMap: function(a) {
            var b = new v();
            a.id && this.ids.push(a.id);
            a.success ? b.resolve(a.id) : b.reject("fail");
            return b;
          },
          _shareItems: function(a) {
            var b = new v(),
              d = {
                url:
                  this._baseUrl +
                  "content/users/" +
                  this.user.username +
                  "/shareItems",
                content: {
                  f: "json",
                  everyone: this.shareWith.everyone,
                  org: this.shareWith.org,
                  items: this.ids.join(),
                  groups: this.shareWith.groups,
                  confirmItemControl: this._validateGroupItemControl(
                    this.shareWith.groups
                  )
                },
                handleAs: "json",
                callbackParamName: "callback"
              };
            this._isValidCredential() &&
              (d.content.token = this._credential.token);
            f(d, { usePost: !0 }).then(
              q.hitch(this, function(c) {
                c.results && 0 < c.results.length
                  ? b.resolve(
                      this._portalUrl + "home/webmap/viewer.html?webmap\x3d" + a
                    )
                  : b.reject("fail");
              }),
              q.hitch(this, function(a) {
                b.reject(a);
              })
            );
            return b;
          },
          _validateGroupItemControl: function(a) {
            var b = a.split(",");
            return (
              0 <
              this.groups.filter(function(a) {
                var c = a.capabilities || [];
                return (
                  -1 < b.indexOf(a.id) && -1 < c.indexOf("updateitemcontrol")
                );
              }).length
            );
          },
          _showMessage: function(b) {
            var c = new v();
            "fail" === b
              ? (new a({ message: this.nls.snapshot_failed }), c.reject(b))
              : (new a({
                  message:
                    '\x3ca href\x3d"' +
                    b +
                    '" target\x3d"_blank"\x3e' +
                    this.nls.snapshot_complete +
                    "\x3c/a\x3e"
                }),
                c.resolve("success"));
            return c;
          },
          _getDateString: function(a) {
            a = new Date(a);
            var b = a.getTimezoneOffset();
            return (
              h.fieldFormatter.getFormattedDate(a, {
                dateFormat: "shortDateShortTime"
              }) +
              " " +
              this.nls.utc +
              (0 > b ? "+" + Math.abs(b) / 60 : "-" + b / 60)
            );
          },
          _checkCredential: function() {
            var a = b.isValidCredential(this._credential);
            a || this._clearCredential();
            return a;
          },
          _isValidCredential: function() {
            this._updateCredential();
            return this._checkCredential();
          },
          _updateCredential: function() {
            this._checkCredential() ||
              (this._credential = b.getPortalCredential(this._portalUrl));
          },
          _clearCredential: function() {
            this._credential = null;
          },
          _createLayerItem: function(a) {
            var b = new v();
            a = this._createLayer(
              a.graphics,
              q.mixin(
                {},
                { description: a.name, name: a.name, tags: [a.name] },
                a
              )
            );
            b.resolve(a);
            return b;
          },
          _createLayer: function(a, b) {
            var c = this.nls,
              d = this.time,
              e = a[0],
              f = {
                point: "esriGeometryPoint",
                polyline: "esriGeometryPolyline",
                polygon: "esriGeometryPolygon"
              }["undefined" !== typeof e.geometry ? e.geometry.type : e.type],
              e = e.symbol ? e.symbol.toJson() : "",
              h = [],
              m = [
                {
                  name: "ObjectID",
                  alias: "ObjectID",
                  type: "esriFieldTypeOID"
                },
                {
                  name: c.snapshot_append,
                  alias: c.snapshot_append,
                  type: "esriFieldTypeString"
                }
              ];
            b.fields &&
              0 < b.fields.length &&
              u.forEach(b.fields, function(a) {
                m.push({
                  name: a.name,
                  alias: a.alias,
                  type: a.type,
                  domain: a.domain
                });
              });
            var n = 0;
            u.forEach(a, function(a) {
              var e;
              switch (f) {
                case "esriGeometryPolyline":
                  e = a.geometry.paths;
                  break;
                case "esriGeometryPolygon":
                  e = a.geometry.rings;
                  break;
                case "esriGeometryPoint":
                  e = [a.geometry];
              }
              var g = 0,
                k;
              u.forEach(e, function(e) {
                switch (f) {
                  case "esriGeometryPolyline":
                    k = new l(e);
                    k.spatialReference = a.geometry.spatialReference;
                    break;
                  case "esriGeometryPolygon":
                    k = new t(e);
                    k.spatialReference = a.geometry.spatialReference;
                    break;
                  case "esriGeometryPoint":
                    k = e;
                }
                var m = { attributes: { ObjectID: n + g }, geometry: k };
                m.attributes[c.snapshot_append] = d;
                b.fields &&
                  0 < b.fields.length &&
                  u.forEach(b.fields, function(b) {
                    m.attributes[b.name] = a.attributes[b.name];
                  });
                h.push(m);
                g += 1;
              });
              n += 1;
            });
            a = {
              xmin: this.extent.xmin,
              ymin: this.extent.ymin,
              xmax: this.extent.xmax,
              ymax: this.extent.ymax,
              spatialReference: this.extent.spatialReference
            };
            e =
              b.renderer && b.renderer.toJson
                ? b.renderer.toJson()
                : b.renderer
                ? JSON.stringify(b.renderer)
                : { type: "simple", label: "", description: "", symbol: e };
            this.layerArray.push({
              layer: {
                id: b.name,
                label: b.name,
                opacity: 1,
                visible: b.visibleOnStartup
              },
              label: b.name
            });
            return {
              title: b.name,
              type: "Feature Collection",
              tags: b.tags,
              description: b.description,
              extent: a,
              name: b.name,
              text: JSON.stringify({
                layers: [
                  {
                    layerDefinition: {
                      name: b.name,
                      geometryType: f,
                      objectIdField: "ObjectID",
                      typeIdField: b.typeIdField,
                      types: b.types,
                      type: "Feature Layer",
                      extent: a,
                      drawingInfo: { renderer: e },
                      fields: m,
                      minScale: b.minScale,
                      maxScale: b.maxScale
                    },
                    popupInfo:
                      b.infoTemplate && b.infoTemplate.info
                        ? b.infoTemplate.info
                        : b.infoTemplate
                        ? b.infoTemplate
                        : void 0,
                    featureSet: { features: h, geometryType: f }
                  }
                ]
              }),
              f: "json"
            };
          }
        });
      });
    },
    "widgets/SituationAwareness/js/PropertyHelper": function() {
      define("dojo/_base/declare dijit/_WidgetsInTemplateMixin dojo/_base/lang dojo/_base/html dojo/dom-class dojo/on dojo/dom-attr dojo/keys dojo/query dojo/Deferred jimu/BaseWidget jimu/portalUtils dojo/Evented dojo/text!./PropertyHelper.html jimu/dijit/formSelect dijit/form/ValidationTextBox".split(
        " "
      ), function(r, q, u, v, m, h, f, d, t, l, x, b, a, n, c) {
        return r([x, q, a], {
          templateString: n,
          baseClass: "jimu-widget-SAT-property-helper",
          constructor: function() {},
          postMixInProperties: function() {
            this.inherited(arguments);
            this.nls.common = window.jimuNls.common;
          },
          postCreate: function() {
            this.inherited(arguments);
            this.windowResize = this.own(
              h(window, "resize", u.hitch(this, this._resize))
            );
            "report" === this.type
              ? this.initReportControls()
              : this.initSnapshotControls();
            this.startup();
          },
          _resize: function() {
            var a =
              !isNaN(window.innerWidth) &&
              null !== window.innerWidth &&
              "" !== window.innerWidth &&
              window.innerWidth
                ? window.innerWidth
                : 450;
            this.popup.width = 450 <= a ? 450 : a;
          },
          startup: function() {
            this.snapshotName.invalidMessage = this.invalidMessage;
            this.snapshotName.validator =
              "report" === this.type
                ? this.checkReportString
                : this.checkString;
            this.btnCancel.innerText = this.nls.common.cancel;
            f.set(this.btnCancel, "aria-label", this.nls.common.cancel);
            this.own(
              h(
                this.btnCancel,
                "click",
                u.hitch(this, function() {
                  this.emit("cancel");
                })
              )
            );
            this.own(
              h(
                this.btnCancel,
                "keydown",
                u.hitch(this, function(a) {
                  (a.keyCode !== d.ENTER && a.keyCode !== d.SPACE) ||
                    this.emit("cancel");
                })
              )
            );
            this.btnOk.innerText = this.nls.common.ok;
            f.set(this.btnOk, "aria-label", this.nls.common.ok);
            this.own(
              h(
                this.btnOk,
                "click",
                u.hitch(this, function() {
                  this.onOkButtonClicked();
                })
              )
            );
            this.own(
              h(
                this.btnOk,
                "keydown",
                u.hitch(this, function(a) {
                  if (a.keyCode === d.ENTER || a.keyCode === d.SPACE)
                    this.onOkButtonClicked();
                })
              )
            );
          },
          onOkButtonClicked: function() {
            if (!m.contains(this.btnOk, "jimu-state-disabled")) {
              var a = { name: this.snapshotName.value.trim() };
              "report" === this.type
                ? (a = u.mixin(a, {
                    reportLayout: {
                      orientation: this.pageUtils.Orientation[
                        this.orientationSelect.selectControl.value
                      ],
                      pageSize: this.pageUtils.PageSizes[
                        this.pageSizeSelect.selectControl.value
                      ]
                    },
                    comments: this.commentTextArea.value
                  }))
                : (a.groups = [
                    this.shareSelect.selectControl.value !==
                    this.nls.choose_group
                      ? this.shareSelect.selectControl.value
                      : ""
                  ]);
              this.emit("ok", a);
            }
          },
          initWidth: function() {
            this._resize();
          },
          checkString: function(a) {
            a = 101 > a.trim().length;
            var b = t(".snapshot-name-footer")[0];
            b &&
              (this.hasNoGroups
                ? (v.addClass(b.children[0], "jimu-state-disabled"),
                  f.set(b.children[0], "tabindex", "-1"))
                : a
                ? (v.removeClass(b.children[0], "jimu-state-disabled"),
                  f.set(b.children[0], "tabindex", "0"))
                : (v.addClass(b.children[0], "jimu-state-disabled"),
                  f.set(b.children[0], "tabindex", "-1")));
            return a;
          },
          checkReportString: function(a) {
            a = 0 < a.trim().length ? !0 : !1;
            var b = t(".snapshot-name-footer")[0];
            b &&
              (a
                ? (v.removeClass(b.children[0], "jimu-state-disabled"),
                  f.set(b.children[0], "tabindex", "0"))
                : (v.addClass(b.children[0], "jimu-state-disabled"),
                  f.set(b.children[0], "tabindex", "-1")));
            return a;
          },
          getPageUtilValues: function(a, b, c) {
            var d = "A3 A4 Letter_ANSI_A Tabloid_ANSI_B Landscape Portrait".split(
                " "
              ),
              e = ["Letter ANSI A", "Portrait"],
              f = Object.keys(a),
              g = [],
              h;
            for (h in f) {
              var k = f[h],
                l = a[k];
              k &&
                l.hasOwnProperty(b) &&
                -1 < d.indexOf(k) &&
                g.push({
                  label: l[b],
                  value: k,
                  selected: l[b] === c || -1 < e.indexOf(l[b])
                });
            }
            return g;
          },
          getGroupValues: function(a) {
            var c = new l();
            b.getPortal(this.portalUrl)
              .getUser()
              .then(
                u.hitch(this, function(b) {
                  var d = [],
                    e;
                  for (e in b.groups) {
                    var f = b.groups[e];
                    d.push({
                      label: f.title,
                      value: f.id,
                      selected: f.title === a
                    });
                  }
                  c.resolve(d);
                }),
                u.hitch(this, function(a) {
                  console.log(a);
                  c.resolve([]);
                })
              );
            return c;
          },
          initSnapshotControls: function() {
            this.nameSpan.innerHTML = this.nls.common.name + ":";
            this.shareSpan.innerHTML = this.nls.select_group + ":";
            this.toggleRow(this.shareRow, !1);
            this.toggleRow(this.orientationRow, !0);
            this.toggleRow(this.pageSizeRow, !0);
            this.toggleRow(this.commentsRow, !0);
            var a;
            if (null !== this.storedProps) {
              var b = JSON.parse(this.storedProps, !0);
              b.share && (a = b.share);
            }
            this.getGroupValues(a).then(
              u.hitch(this, function(a) {
                this.snapshotName.hasNoGroups = 0 === a.length ? !0 : !1;
                this.addSelect(this.shareSpan.innerHTML, this.shareSelect, a);
              })
            );
          },
          initReportControls: function() {
            this.nameSpan.innerHTML = this.nls.common.title + ":";
            this.toggleRow(this.orientationRow, !1);
            this.toggleRow(this.pageSizeRow, !1);
            this.toggleRow(this.commentsRow, !1);
            this.toggleRow(this.shareRow, !0);
            var a, b;
            if (null !== this.storedProps) {
              var c = JSON.parse(this.storedProps, !0);
              c.reportLayout &&
                ((b = c.reportLayout.pageSize),
                (a = c.reportLayout.orientation.Text),
                (b = b.SizeName));
            }
            this.addSelect(
              this.nls.orientation,
              this.orientationSelect,
              this.getPageUtilValues(this.pageUtils.Orientation, "Text", a)
            );
            this.addSelect(
              this.nls.pageSize,
              this.pageSizeSelect,
              this.getPageUtilValues(this.pageUtils.PageSizes, "SizeName", b)
            );
          },
          addSelect: function(a, b, d) {
            b.selectControl = new c({
              options: d,
              "aria-label": a,
              style: "width: 100%;"
            });
            b.selectControl.placeAt(b).startup();
          },
          toggleRow: function(a, b) {
            m.contains(a, b ? "display-on" : "display-off") &&
              m.remove(a, b ? "display-on" : "display-off");
            m.add(a, b ? "display-off" : "display-on");
          },
          destroy: function() {}
        });
      });
    },
    "widgets/SituationAwareness/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:jimu/dijit/templates/ReportTemplate.html":
      '\x3c!DOCTYPE HTML\x3e\r\n\x3chtml lang\x3d"en" dir\x3d"ltr"\x3e\r\n\r\n\x3chead id\x3d"reportHead"\x3e\r\n  \x3cmeta charset\x3d"utf-8"\x3e\r\n  \x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3dEdge,chrome\x3d1"\x3e\r\n  \x3ctitle\x3e\x3c/title\x3e\r\n  \x3cscript\x3e\r\n    // Show/hide text area controls based on the value\r\n    function onPrintButtonClicked() {\r\n      var notesContainer, i;\r\n      notesContainer \x3d document.getElementsByClassName("esriCTNotesContainer");\r\n      //process notes to show/hide based on contents\r\n      for (i \x3d 0; i \x3c notesContainer.length; i++) {\r\n        if (notesContainer[i]) {\r\n          //Hide the notes which are not having values\r\n          if (notesContainer[i].children[1].value.trim() \x3d\x3d\x3d "") {\r\n            notesContainer[i].className +\x3d " esriCTHideReportNotes";\r\n          }\r\n          else {\r\n            //Removes hidden class if available\r\n            notesContainer[i].className \x3d\r\n              notesContainer[i].className.replace("esriCTHideReportNotes", "");\r\n          }\r\n        }\r\n      }\r\n      //after processing notes, print the window\r\n      window.print();\r\n    }\r\n  \x3c/script\x3e\r\n  \x3c!-- Report prev page css --\x3e\r\n  \x3cstyle type\x3d"text/css"\x3e\r\n    .esriCTReportMapWait {\r\n      height: 5px;\r\n      width: 100%;\r\n      position: relative;\r\n      overflow: hidden;\r\n      background-color: #ddd;\r\n    }\r\n\r\n    .esriCTReportMapWait:before {\r\n      display: block;\r\n      position: absolute;\r\n      content: "";\r\n      left: -200px;\r\n      width: 200px;\r\n      height: 5px;\r\n      background-color: #2980b9;\r\n      animation: loading 2s linear infinite;\r\n    }\r\n\r\n    @keyframes loading {\r\n      from {\r\n        left: -200px;\r\n        width: 30%;\r\n      }\r\n      50% {\r\n        width: 30%;\r\n      }\r\n      70% {\r\n        width: 70%;\r\n      }\r\n      80% {\r\n        left: 50%;\r\n      }\r\n      95% {\r\n        left: 120%;\r\n      }\r\n      to {\r\n        left: 100%;\r\n      }\r\n    }\r\n\r\n    .esriCTHTMLData {\r\n      position: relative;\r\n      width: 100%;\r\n      height: auto;\r\n    }\r\n\r\n    .jimu-rtl .esriCTHTMLData {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTTable {\r\n      margin-top: 10px;\r\n      padding: 0;\r\n      border-collapse: collapse;\r\n      border-spacing: 0;\r\n      width: 100%;\r\n      page-break-inside: avoid;\r\n      table-layout: fixed;\r\n    }\r\n\r\n    .jimu-rtl .esriCTTable {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTTable th {\r\n      border: 1px solid gray;\r\n      background-color: #E4E4E4;\r\n      word-wrap: break-word;\r\n    }\r\n\r\n    .esriCTTable td {\r\n      border: 1px solid gray;\r\n      word-wrap: break-word;\r\n    }\r\n\r\n    .esriCTSectionTitle {\r\n      font-size: 18px;\r\n      color: #0f96cc;\r\n      font-weight: bold;\r\n      margin: 30px 0px;\r\n      width: calc(100% - 10px);\r\n      word-break: break-all;\r\n    }\r\n\r\n    .jimu-rtl .esriCTSectionTitle {\r\n      float: right;\r\n      direction: rtl;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportMap .esriCTSectionTitle {\r\n      float: none;\r\n    }\r\n\r\n    .esriCTReportLogo {\r\n      float: left;\r\n      max-width: calc(50% - 10px);\r\n      margin: auto 10px auto 0;\r\n      max-height: 90%;\r\n      position: absolute;\r\n      top: 0;\r\n      bottom: 0;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportLogo {\r\n      float: right;\r\n      margin: auto 0 auto 10px;\r\n    }\r\n\r\n    .esriCTPrintTitleDiv {\r\n      height: 56px;\r\n      float: right;\r\n      min-width: 50%;\r\n    }\r\n\r\n    .jimu-rtl .esriCTPrintTitleDiv {\r\n      float: left;\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTInputTitle {\r\n      height: 55px;\r\n      line-height: 55px;\r\n      border: none;\r\n      font-size: 25px;\r\n      width: 100%;\r\n      padding: 0px;\r\n    }\r\n\r\n    .esriCTInputTitle::-ms-clear {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTReportMain {\r\n      background: #FFF;\r\n      border: solid 1px #000;\r\n      margin: 0 auto;\r\n      padding: 20px;\r\n      width: 797px;\r\n    }\r\n\r\n    .esriCTReportMap {\r\n      text-align: center;\r\n    }\r\n\r\n    .esriCTReportMapImg {\r\n      max-width: 96%;\r\n      margin-top: 10px;\r\n    }\r\n\r\n    .esriCTReportLandscapeMapImg {\r\n      max-width: 80%;\r\n    }\r\n\r\n    .esriCTReportMapFail {\r\n      height: 50px;\r\n    }\r\n\r\n    .esriCTReportFooter {\r\n      text-align: center;\r\n      font-size: 80%;\r\n      padding: 10px 0;\r\n      white-space: pre-wrap;\r\n      word-wrap: break-word;\r\n    }\r\n\r\n    .esriCTPrintPage {\r\n      padding: 30px 0;\r\n      margin: 20px auto;\r\n      font-family: arial, sans-serif;\r\n      font-size: 13px;\r\n    }\r\n\r\n    .esriCTReportBar {\r\n      width: 100%;\r\n      position: fixed;\r\n      left: 0;\r\n      top: 0;\r\n      z-index: 6;\r\n      height: 50px;\r\n      background: #e2f1fc;\r\n      border-bottom: 1px solid #000;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportBar {\r\n      left: inherit;\r\n      right: 0;\r\n    }\r\n\r\n    .esriCTPrintButton,\r\n    .esriCTCloseButton {\r\n      color: #444;\r\n      font-family: Verdana, Helvetica, sans-serif;\r\n      font-size: 12px;\r\n      -moz-border-radius: 3px;\r\n      -webkit-border-radius: 3px;\r\n      border-radius: 3px;\r\n      border: 1px solid #8b8b8b;\r\n      box-shadow: none;\r\n      -webkit-box-shadow: none;\r\n      background: #F2F2F2;\r\n      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);\r\n      background: -moz-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #F2F2F2), color-stop(100%, #D1D1D1));\r\n      background: -webkit-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: -o-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: -ms-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: linear-gradient(to bottom, #F2F2F2 0%, #D1D1D1 100%);\r\n      filter: progid: DXImageTransform.Microsoft.gradient(startColorstr\x3d\'#F2F2F2\', endColorstr\x3d\'#D1D1D1\', GradientType\x3d0);\r\n      margin: 10px 20px;\r\n      line-height: 16px;\r\n      display: block;\r\n      padding: 5px 10px;\r\n      outline: 0;\r\n      text-decoration: none;\r\n      cursor: pointer;\r\n      font-weight: 400;\r\n      white-space: nowrap;\r\n      float: right;\r\n    }\r\n\r\n    .jimu-rtl .esriCTPrintButton,\r\n    .jimu-rtl .esriCTCloseButton {\r\n      float: left;\r\n    }\r\n\r\n    .esriCTPrintButton:hover,\r\n    .esriCTPrintButton:focus,\r\n    .esriCTCloseButton:hover,\r\n    .esriCTCloseButton:focus {\r\n      background: #E5E6E6;\r\n      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);\r\n      background: -moz-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #E5E6E6), color-stop(100%, #A0A1A1));\r\n      background: -webkit-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: -o-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: -ms-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: linear-gradient(to bottom, #E5E6E6 0%, #A0A1A1 100%);\r\n      filter: progid: DXImageTransform.Microsoft.gradient(startColorstr\x3d\'#E5E6E6\', endColorstr\x3d\'#A0A1A1\', GradientType\x3d0);\r\n    }\r\n\r\n    .esriCTReportHeader {\r\n      display: block;\r\n      width: 100%;\r\n      height: 60px;\r\n      border-bottom: 1px solid #000;\r\n      margin-bottom: 5px;\r\n      position: relative;\r\n    }\r\n\r\n    .esriCTReportBarMsg {\r\n      text-align: center;\r\n      margin-top: 16px;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportBarMsg {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTNotesContainer {\r\n      width: 100%;\r\n      margin-top: 30px;\r\n    }\r\n\r\n    .esriCTReportNotes {\r\n      resize: none;\r\n      width: calc(100% - 5px);\r\n      max-width: calc(100% - 5px);\r\n      font-family: "Arial";\r\n      font-size: 13px;\r\n      border: 1px solid gray;\r\n      overflow-y: hidden;\r\n      /* prevents scroll bar flash */\r\n    }\r\n\r\n    .esriCTReportNotesParagraph {\r\n      display: none;\r\n      white-space: pre-wrap;\r\n      word-wrap: break-word;\r\n    }\r\n    \r\n    .jimu-rtl .esriCTReportNotesParagraph {\r\n      float: right;\r\n      direction: rtl;\r\n    }\r\n    \r\n    .jimu-rtl .esriCTReportNotes {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTHidden {\r\n      display: none;\r\n    }\r\n  \x3c/style\x3e\r\n  \x3c!-- Media print css --\x3e\r\n  \x3cstyle type\x3d"text/css" media\x3d"print"\x3e\r\n    .esriCTPrintPage {\r\n      padding: 0;\r\n      color: #000;\r\n      margin: 0;\r\n      float: none;\r\n      background: #fff url(none);\r\n    }\r\n\r\n    .esriCTTable {\r\n      page-break-inside: avoid;\r\n      border-collapse: collapse;\r\n      border-spacing: 0;\r\n    }\r\n\r\n    .esriCTPageBreak {\r\n      page-break-after: always;\r\n    }\r\n\r\n    .esriCTReportFooter {\r\n      font-size: 75%;\r\n    }\r\n\r\n    .esriCTReportBar {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTReportMain {\r\n      border: none;\r\n    }\r\n\r\n    .esriCTReportMapImg {\r\n      box-shadow: none;\r\n      border: none;\r\n    }\r\n\r\n    .esriCTReportNotes {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTReportNotesParagraph {\r\n      display: block;\r\n    }\r\n\r\n    .esriCTHideReportNotes {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTTable th {\r\n      border: 1px solid gray;\r\n    }\r\n\r\n    .esriCTTable td {\r\n      border: 1px solid gray;\r\n    }\r\n\r\n    .esriCTTable tr {\r\n      page-break-inside: avoid;\r\n      page-break-after: auto;\r\n    }\r\n\t\r\n  \x3c/style\x3e\r\n  \x3cscript\x3e\r\n    function showError(evt) {\r\n      alert(document.getElementById(\'showErrorButton\').innerHTML);\r\n    }\r\n  \x3c/script\x3e\r\n\x3c/head\x3e\r\n\r\n\x3cbody id\x3d"reportBody" class\x3d"esriCTPrintPage"\x3e\r\n  \x3cbutton id\x3d"showErrorButton" style\x3d"display: none" onclick\x3d"showError()"\x3e\x3c/button\x3e\r\n  \x3cdiv class\x3d"esriCTReportBar"\x3e\r\n    \x3cdiv id\x3d"closeButton" class\x3d"esriCTCloseButton" title\x3d"Close" onclick\x3d"window.close();"\x3eClose\x3c/div\x3e\r\n    \x3cdiv id\x3d"printButton" class\x3d"esriCTPrintButton" title\x3d"Print" onclick\x3d"onPrintButtonClicked();"\x3ePrint\x3c/div\x3e\r\n    \x3cdiv id\x3d"reportBarMsg" class\x3d"esriCTReportBarMsg"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv id\x3d"reportMain" class\x3d"esriCTReportMain"\x3e\r\n    \x3cdiv id\x3d"reportHeader" class\x3d"esriCTReportHeader"\x3e\r\n      \x3cimg id\x3d"reportLogo" class\x3d"esriCTReportLogo esriCTHidden" src\x3d""\x3e\r\n      \x3cdiv id\x3d"printTitleDiv" class\x3d"esriCTPrintTitleDiv"\x3e\r\n        \x3cinput id\x3d"reportTitle" type\x3d"text" class\x3d"esriCTInputTitle"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv id\x3d"reportData"\x3e\x3c/div\x3e\r\n    \x3cdiv id\x3d"footNotes" class\x3d"esriCTReportFooter"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/body\x3e\r\n\r\n\x3c/html\x3e',
    "url:dijit/templates/ProgressBar.html":
      '\x3cdiv class\x3d"dijitProgressBar dijitProgressBarEmpty" role\x3d"progressbar"\r\n\t\x3e\x3cdiv  data-dojo-attach-point\x3d"internalProgress" class\x3d"dijitProgressBarFull"\r\n\t\t\x3e\x3cdiv class\x3d"dijitProgressBarTile" role\x3d"presentation"\x3e\x3c/div\r\n\t\t\x3e\x3cspan style\x3d"visibility:hidden"\x3e\x26#160;\x3c/span\r\n\t\x3e\x3c/div\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"labelNode" class\x3d"dijitProgressBarLabel" id\x3d"${id}_label"\x3e\x3c/div\r\n\t\x3e\x3cspan data-dojo-attach-point\x3d"indeterminateHighContrastImage"\r\n\t\t   class\x3d"dijitInline dijitProgressBarIndeterminateHighContrastImage"\x3e\x3c/span\r\n\x3e\x3c/div\x3e\r\n',
    "url:esri/dijit/editing/templates/AttachmentEditor.html":
      "\x3cdiv class\x3d\"attachmentEditor\"\x3e\r\n    \x3cbr /\x3e\r\n    \x3cdiv\x3e\r\n        \x3cb\x3e${NLS_attachments}\x3c/b\x3e\r\n        \x3chr /\x3e\r\n        \x3cdiv dojoAttachPoint\x3d\"_attachmentError\" style\x3d'color:red;display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e\r\n        \x3cspan dojoAttachPoint\x3d'_attachmentList' style\x3d'word-wrap: break-word;'\x3e\x3c/span\x3e\r\n        \x3cbr\x3e\x3cbr\x3e\r\n        \x3cdiv data-dojo-type\x3d\"dijit/ProgressBar\" dojoAttachPoint\x3d\"_attachmentProgress\" indeterminate\x3d\"true\" style\x3d'display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e        \r\n        \x3cform dojoAttachPoint\x3d'_uploadForm'\x3e ${NLS_add}:\x26nbsp;\x26nbsp;\x3cinput type\x3d'file' name\x3d'attachment' dojoAttachPoint\x3d'_uploadField' /\x3e \x3c/form\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e",
    "url:esri/dijit/templates/AttributeInspector.html":
      '\x3cdiv class\x3d"esriAttributeInspector"\x3e\r\n    \x3cdiv class\x3d"atiLayerName" dojoAttachPoint\x3d"layerName"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiAttributes" dojoAttachPoint\x3d"attributeTable"\x3e\x3c/div\x3e\r\n    \x3cdiv dojoAttachPoint\x3d"attachmentEditor"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiEditorTrackingInfo" dojoAttachPoint\x3d"editorTrackingInfoDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiButtons" dojoAttachPoint\x3d"editButtons"\x3e\r\n        \x3cbutton  dojoType\x3d"dijit.form.Button" class\x3d"atiButton atiDeleteButton"  dojoAttachPoint\x3d"deleteBtn" dojoAttachEvent\x3d"onClick: onDeleteBtn" showLabel\x3d"true" type\x3d"button"\x3e${NLS_deleteFeature}\x3c/button\x3e\r\n        \x3cdiv class\x3d"atiNavButtons" dojoAttachPoint\x3d"navButtons"\x3e\r\n            \x3cdiv class\x3d"atiNavMessage" dojoAttachPoint\x3d"navMessage"\x3e\x3c/div\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiFirstIcon" dojoAttachPoint\x3d"firstFeatureButton" dojoAttachEvent\x3d"onClick: onFirstFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_first}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiPrevIcon" dojoAttachPoint\x3d"prevFeatureButton" dojoAttachEvent\x3d"onClick: onPreviousFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_previous}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiNextIcon" dojoAttachPoint\x3d"nextFeatureButton" dojoAttachEvent\x3d"onClick: onNextFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_next}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiLastIcon" dojoAttachPoint\x3d"lastFeatureButton" dojoAttachEvent\x3d"onClick: onLastFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_last}\x3c/button\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/SituationAwareness/js/PropertyHelper.html":
      '\x3cdiv\x3e  \r\n  \x3cdiv class\x3d"jimu-r-row"\x3e\r\n    \x3ctable class\x3d"width-all"\x3e\r\n      \x3c!--name--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"nameRow"\x3e\r\n        \x3ctd class\x3d"col-1-2"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"nameSpan"\x3e\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2"\x3e\r\n          \x3cinput class\x3d"width-all" data-dojo-attach-point\x3d"snapshotName" data-dojo-type\x3d"dijit/form/ValidationTextBox" /\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n      \x3c!--share--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"shareRow"\x3e\r\n        \x3ctd class\x3d"width-all pad-top-10"\x3e\r\n          \x3cspan class\x3d"hintText"\x3e${nls.select_group_instruction}\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"shareSpan"\x3e\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"shareSelect"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n      \x3c!--orientation--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"orientationRow"\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"orientationSpan"\x3e${nls.orientation}:\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"orientationSelect"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n      \x3c!--page size--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"pageSizeRow"\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"pageSizeSpan"\x3e${nls.pageSize}:\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"pageSizeSelect"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3c!--comments--\x3e\r\n  \x3cdiv class\x3d"display-off pad-top-10" data-dojo-attach-point\x3d"commentsRow"\x3e\r\n    \x3cdiv class\x3d"jimu-r-row pad-top-5"\x3e\r\n      \x3cdiv class\x3d"jimu-r-row"\x3e\r\n        \x3cspan class\x3d"label" data-dojo-attach-point\x3d"commentsSpan"\x3e${nls.comments}:\x3c/span\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"jimu-r-row pad-top-5"\x3e\r\n      \x3ctextarea aria-label\x3d"${nls.comments}" class\x3d"commentTextArea" data-dojo-attach-point\x3d"commentTextArea" rows\x3d"5"\x3e\x3c/textarea\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"snapshot-name-footer jimu-float-trailing pad-top-10"\x3e\r\n    \x3cdiv role\x3d"button" tabindex\x3d"-1" class\x3d"jimu-btn ok pad-right-5 jimu-state-disabled" data-dojo-attach-point\x3d"btnOk"\x3e\x3c/div\x3e\r\n    \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"jimu-btn cancel" data-dojo-attach-point\x3d"btnCancel"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/SituationAwareness/Widget.html":
      '\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"panelBottom" class\x3d"panelBottom"\x3e\r\n\r\n    \x3c!-- Panel Footer --\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"footerNode" class\x3d"SA_panelFooter dart-bgcolor box-bgcolor jimu-main-background"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"panelLeft" class\x3d"SA_panelLeft" data-dojo-attach-event\x3d"onclick:_navTabsLeft"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"footerContentNode" class\x3d"SA_panelFooterContent"\x3e\r\n        \x3c!-- Tabs --\x3e\r\n        \x3cdiv role\x3d"tablist" data-dojo-attach-point\x3d"tabsNode" class\x3d"SA_SAT_tabs"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"panelRight" class\x3d"SA_panelRight" data-dojo-attach-event\x3d"onclick:_navTabsRight"\x3e\x3c/div\x3e\r\n      \x3cdiv role\x3d"button" data-dojo-attach-point\x3d"closeButton" tabindex\x3d"-1" class\x3d"SA_panelClose" data-dojo-attach-event\x3d"onclick:_close"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3c!--Panel Container --\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"panelContainer" class\x3d"panelContainer dart-bgcolor box-bgcolor jimu-main-background"\x3e\r\n      \x3c!-- Panel Incident --\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"innerBL" class\x3d"innerBL" data-dojo-attach-event\x3d"onclick:_navLeft"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"SA_tabPanel0" role\x3d"tabpanel" class\x3d"SAT_tabPanel"\x3e\r\n        \x3cdiv class\x3d"SAT_tabPanelContent" style\x3d"min-width: 650px"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"incidentsLocate" class\x3d"SATcolLocate" style\x3d"width:auto; min-width:220px"\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"locateIncident" class\x3d"label locateIncident"\x3e\x3c/div\x3e\r\n            \x3cdiv role\x3d"button" aria-label\x3d"${nls.clearIncident}" tabindex\x3d"0" data-dojo-attach-point\x3d"clearIncident"\r\n              class\x3d"label clearIncident" data-dojo-attach-event\x3d"onclick:_clear"\x3e\r\n              ${nls.clearIncident}\r\n            \x3c/div\x3e\r\n            \x3cbr /\x3e\r\n            \x3cdiv class\x3d"locateIncidentContainer"\x3e\r\n              \x3cdiv class\x3d"colBar SATdrawCol"\x3e\r\n                \x3cdiv data-dojo-attach-point\x3d"imgContainer" class\x3d"imgContainer"\x3e\r\n                  \x3cspan class\x3d"btn32 displayTC"\x3e \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"esriCTDrawPointBtn btn32img"\r\n                      data-dojo-attach-point\x3d"SA_btn0"\x3e \x3c/div\x3e \x3c/span\x3e\r\n                  \x3cspan class\x3d"btn32 displayTC"\x3e \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"btn32img"\r\n                      data-dojo-attach-point\x3d"SA_btn1"\x3e \x3c/div\x3e \x3c/span\x3e\r\n                  \x3cspan class\x3d"btn32 displayTC"\x3e \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"btn32img"\r\n                      data-dojo-attach-point\x3d"SA_btn2"\x3e \x3c/div\x3e \x3c/span\x3e\r\n                \x3c/div\x3e\r\n              \x3c/div\x3e\r\n              \x3cdiv class\x3d"bufferIncidentContainer"\x3e\r\n                \x3cdiv class\x3d"bufferControlsContainer"\x3e\r\n                  \x3cdiv data-a11y-label-id\x3d"spinnerValue" data-dojo-attach-point\x3d"buffer_lbl" class\x3d"label bufferLabel"\x3e\x3c/div\x3e\r\n                  \x3cdiv class\x3d"spinnerValueDIV"\x3e\r\n                    \x3cinput data-a11y-label-by\x3d"spinnerValue" role\x3d"button" role\x3d"textbox" tabindex\x3d"0" data-dojo-attach-point\x3d"spinnerValue"\r\n                      data-dojo-type\x3d"dijit/form/NumberSpinner" class\x3d"spinnerValue" name\x3d"spinnerValue" /\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"buffer_lbl_unit" class\x3d"label bufferUnit"\x3e\x3c/div\x3e\r\n                  \x3c/div\x3e\r\n                \x3c/div\x3e\r\n              \x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"saveOptions" class\x3d"SATcol2"\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"borderCol" class\x3d"borderCol display-off"\x3e\x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"div_reverse_geocoding" class\x3d"SATcol reverseGeocodingDIV"\x3e\r\n            \x3cdiv class\x3d"label"\x3e\r\n              ${nls.reverse_geocoded_address}\r\n            \x3c/div\x3e\r\n            \x3c/br\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"div_reversed_address" class\x3d"label reversedAddressDIV"\x3e\x3c/div\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"innerBR" class\x3d"innerBR" data-dojo-attach-event\x3d"onclick:_navRight"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3c!-- Panel Message --\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"messageNode" class\x3d"SA_panelMessage"\x3e\r\n      \x3cspan data-dojo-attach-point\x3d"messageTextNode"\x3e\x3c/span\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/SituationAwareness/css/style.css":
      ".jimu-widget-SAT {color: #ffffff !important; background-color: #4c4c4c; left: 0px; right: 0px; bottom: 0px; height: 155px !important; display: block; z-index: 100 !important;}.action2 {padding-left: 10px;}.jimu-widget-SAT .innerBL {display: none; width: 10px; height: 20px; background-image: url('images/nav_left.png'); background-repeat: no-repeat; background-size:cover; position: fixed; bottom: 45px; left: 0px; z-index: 2; background-size:cover; opacity: .6;}.jimu-rtl .jimu-widget-SAT .innerBL {right: 0px;}.jimu-widget-SAT .innerBL:hover {width: 20px; height: 35px; opacity: 1; cursor: pointer; bottom: 30px;}.jimu-widget-SAT .innerBR {display: none; width: 10px; height: 20px; background-image: url('images/nav_right.png'); background-repeat: no-repeat; background-size:cover; position: fixed; bottom: 45px; right: 0px; z-index: 2; opacity: .6;}.jimu-rtl .jimu-widget-SAT .innerBR {left: 0px;}.jimu-widget-SAT .innerBR:hover {width: 20px; height: 35px; opacity: 1; cursor: pointer; bottom: 30px;}.jimu-widget-SAT .rounded {-moz-border-radius: 5px 5px 5px 5px; -webkit-border-radius: 5px 5px 5px 5px; border-radius: 5px 5px 5px 5px;}.jimu-widget-SAT .roundedL {-moz-border-radius: 5px 0px 0px 5px; -webkit-border-radius: 5px 0px 0px 5px; border-radius: 5px 0px 0px 5px;}.jimu-widget-SAT .roundedR {-moz-border-radius: 0px 5px 5px 0px; -webkit-border-radius: 0px 5px 5px 0px; border-radius: 0px 5px 5px 0px;}.jimu-widget-SAT .reversedAddressDIV {width:100%;}.jimu-widget-SAT .spinnerValue {width: 80px; align: left;}.jimu-widget-SAT .panelBottom {position: absolute; width: 100%; height: 155px; left: 0px; top: 0px; text-align: center; color: #ffffff; padding: 0px;}.jimu-widget-SAT .SA_panelMessage {position: absolute; top: 0px; text-align: center; width: 100%; height: 40px; line-height: 40px; display: none;}.jimu-widget-SAT .SA_panelFooter {position: absolute; top: 0px; left: 0px; right: 0px; height: 30px; line-height: 30px; overflow: hidden; border-bottom: 1px solid #353535; border-bottom: 1px solid rgba(0, 0, 0, 0.3);}.jimu-widget-SAT .SA_panelFooterContent {position: absolute; left: 0px; right: 24px; height: 30px; overflow-x: hidden; overflow-y: hidden; display: block;}.jimu-rtl .jimu-widget-SAT .SA_panelFooterContent {position: absolute; left: 24px; right: 0px;}.jimu-widget-SAT .SA_panelClose {position: absolute; left: auto; right: 0px; width: 24px; height: 30px; line-height: 30px; text-align: center; display: block; cursor: pointer; background-image: url('images/x.png'); background-repeat: no-repeat; background-position: center center; background-size: 12px;}.jimu-widget-SAT .SA_panelRight {display: none; position: absolute; left: auto; right: 24px; width: 34px; height: 30px; line-height: 30px; cursor: pointer; background-image: url('images/nav_right.png'); background-repeat: no-repeat; background-position: center center; background-size: 10px; opacity: .4;}.jimu-widget-SAT .SA_panelRight:hover {opacity: 1; background-size: 16px;}.jimu-widget-SAT .SA_panelLeft {display: none; position: absolute; left: 0px; right: auto; height: 30px; line-height: 30px; cursor: pointer; background-image: url('images/nav_left.png'); background-repeat: no-repeat; background-position: center center; background-size: 10px; opacity: .4;}.jimu-widget-SAT .SA_panelLeft:hover {opacity: 1; background-size: 16px;}.jimu-rtl .jimu-widget-SAT .SA_panelClose {position: absolute; left: 0px; right: auto;}.jimu-widget-SAT .panelContainer {position: absolute; top: 30px; width: 100%; height: 125px; overflow: hidden; display: block;}.jimu-widget-SAT .SAT_tabPanel {position: absolute; top: 10px; left: 0px; right: 0px; height: 115px; display: none; overflow: auto;}.jimu-widget-SAT .SAT_tabPanelContent {position: absolute; top: 0px; height: 100px; white-space: nowrap; display: block; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;}.jimu-widget-SAT .locateIncidentContainer {display: flex; float: left; margin-top: 20px;}.jimu-rtl .jimu-widget-SAT .locateIncidentContainer {display: flex; float: right; margin-top: 20px;}.jimu-widget-SAT .bufferIncidentContainer {display: table-cell;}.jimu-widget-SAT .bufferControlsContainer {float: left; padding-left: 20px;}.jimu-widget-SAT .SA_SAT_tabs {position: absolute; white-space: nowrap; height: 30px; padding: 0px; overflow-x: visible; overflow-y: hidden;}.jimu-widget-SAT .SATTab {width: auto; max-width: 220px; overflow: hidden; text-overflow: ellipsis; height: 30px; float: left; line-height: 30px; font-size: 13px; padding: 0 30px 0 30px; cursor: pointer; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; opacity: .85; border-right: 1px solid #d2dae2; border-top: 2px solid transparent;}.jimu-widget-SAT .active .SATTab:focus {border-top: 2px solid #15a4fa; opacity: 1;}.jimu-widget-SAT .esriCTDrawPointBtn:focus {border: 2px solid #15a4fa;}.jimu-rtl .jimu-widget-SAT .SATTab {float: right;}.jimu-widget-SAT .active {background-color: #353535; background-color: rgba(0, 0, 0, 0.3); opacity: 1; border-top: 2px solid #15a4fa;}.jimu-widget-SAT .activeBlack {background-color: #353535; opacity: 1; border-top: 2px solid #15a4fa;}.jimu-widget-SAT .SATcol {float: left; height: 100px; width: 220px; border-left: none; margin-left: 0; padding: 0 10px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden;}.jimu-rtl .jimu-widget-SAT .SATcol {float: right; border-right: none; overflow: hidden;}.jimu-widget-SAT .SATcolExport {float: left; height: 100px; width: 65px; border-left: none; margin-left: 0; padding: 0 10px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden;}.jimu-rtl .jimu-widget-SAT .SATcolExport {float: right; border-right: none; overflow: hidden;}.jimu-widget-SAT .lightThemeBorder{border-right: 1px solid #353535; border-right: 1px solid rgba(0, 0, 0, 0.3);}.jimu-widget-SAT .darkThemeBorder{border-right: 1px solid #ffffff; border-right: 1px solid rgba(255, 255, 255, 0.5);}.jimu-rtl .jimu-widget-SAT .lightThemeBorder{border-left: 1px solid #353535; border-left: 1px solid rgba(0, 0, 0, 0.3);}.jimu-rtl .jimu-widget-SAT .darkThemeBorder{border-left: 1px solid #ffffff; border-left: 1px solid rgba(255, 255, 255, 0.5);}.jimu-widget-SAT .SATcolLocate {float: left; height: 100px; width: 220px; border-left: none; margin-left: 0; padding: 0 30px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden;}.jimu-rtl .jimu-widget-SAT .SATcolLocate {float: right; border-right: none; overflow: hidden;}.jimu-widget-SAT .SATcolWrap {white-space: pre-wrap; white-space: -moz-pre-wrap; word-wrap: break-word;}.jimu-widget-SAT .SATcol2 {float: left; height: 100px; border-left: none; margin-left: 5px; padding: 0 10px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden; display: table;}.jimu-rtl .jimu-widget-SAT .SATcol2 {float: right; border-right: none; overflow: hidden; margin-right: 5px;}.jimu-widget-SAT .borderCol {height: 100px; float: left;}.jimu-widget-SAT .SATcolSmall {float: left; height: 90px; width: 165px; border-left: none; margin-left: 0; padding: 0 20px; overflow: hidden; text-overflow: ellipsis;}.jimu-rtl .jimu-widget-SAT .SATcolSmall {float: right; border-right: none;}.jimu-widget-SAT .SATcolLast {border-left: none; border-right: none;}.jimu-widget-SAT .SATcol .label,.jimu-widget-SAT .SATcolSmall .label {font-size: 13px; padding: 2px 0;}.jimu-widget-SAT .SATcol .colBar {height: 32px; display: table-cell; width: 130px;}.jimu-widget-SAT .SATdrawCol {display: block; float: left;}.jimu-rtl .jimu-widget-SAT .SATdrawCol {display: block; float: right;}.jimu-widget-SAT .displayTC{display: table-cell;}.jimu-widget-SAT .displayTR{display: table-row;}.jimu-widget-SAT .displayT{display: table;}.jimu-widget-SAT .display-on{display: block;}.jimu-widget-SAT .display-off{display: none;}.jimu-widget-SAT .btnOn {border: 1px solid #ffffff; border: 1px solid rgba(255, 255, 255, 0.75); background-color: #262626; background-color: rgba(0, 0, 0, 0.5);}.jimu-widget-SAT .btn32 {width: 32px; height: 32px; border-radius: 2px; margin-right: 5px; cursor: pointer;}.jimu-widget-SAT .btn32img {padding: 8px; height: 32px; width: 32px; background-repeat: no-repeat; background-position: center;}.jimu-widget-SAT .lightThemeBackground{background-color: #353535; background-color: rgba(0, 0, 0, 0.3);}.jimu-widget-SAT .darkThemeBackground{}.jimu-widget-SAT .btn32img:hover {background-color: #262626; background-color: rgba(0, 0, 0, 0.5);}.jimu-widget-SAT .btn32imgBlack {padding: 8px; height: 32px; width: 32px; background-repeat: no-repeat; background-position: center;}.jimu-widget-SAT .btn32imgBlack:hover {background-color: #262626;}.jimu-widget-SAT .dijitTextBox,.jimu-widget-SAT .dijitTextBoxHover,.jimu-widget-SAT .dijitTextBoxFocused,.jimu-widget-SAT .dijitTextBoxHoverFocused {background-color: #393939; background-color: rgba(0, 0, 0, 0.25) !important; color: #ffffff !important; border: 1px solid #a6a6a6; border: 1px solid rgba(255, 255, 255, 0.5) !important; height: 26px !important; line-height: 26px !important;}.jimu-widget-SAT .dijitTextBoxFocused,.jimu-widget-SAT .dijitInputInner,.jimu-widget-SAT .dijitInputContainer {background: transparent !important; color: #ffffff !important; height: 26px !important; line-height: 26px !important;}.jimu-widget-SAT .dijitInputField {padding: 0px 10px !important;}.jimu-widget-SAT .btnExport {border-radius: 2px; padding: 10px 10px 10px 10px; background-image: url('images/download.png'); background-repeat: no-repeat; background-position: right center; cursor: pointer; height: 40px;}.jimu-widget-SAT .btnExport:hover {background-color: #262626; background-color: rgba(0, 0, 0, 0.5);}.jimu-widget-SAT .btnExport:focus, .jimu-widget-SAT .directionsButton:focus {outline: #15a4fa solid 2px !important; outline-offset: -2px;}.jimu-widget-SAT .btnExportBlack {border-radius: 2px; padding: 10px 10px 10px 10px; background-image: url('images/download.png'); background-repeat: no-repeat; background-position: right center; cursor: pointer; height: 40px;}.jimu-widget-SAT .btnExportBlack:hover {background-color: #262626;}.jimu-widget-SAT .download {background-image: url('images/download.png'); background-repeat: no-repeat; background-position: right 0px center;}.jimu-widget-SAT .processing {background-image: url('images/processing.gif'); background-repeat: no-repeat; background-position: right 10px center;}.jimu-widget-SAT .loading {background-image: url('images/loading.gif'); background-repeat: no-repeat; background-position: center 10px;}.jimu-widget-SAT .btnDisabled {opacity: .5; cursor: default;}.jimu-widget-SAT .colSummary {font-size: 28px; padding-top: 10px;}.jimu-widget-SAT .colGroupedSummary {font-size: 28px; padding-top: 3px;}.jimu-widget-SAT .SATcolRec {float: left; height: 100%; border-left: none; margin-left: 0; padding: 0 10px; text-align: left; text-overflow: ellipsis; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; min-width: 220px; max-width: 300px;}.jimu-rtl .jimu-widget-SAT .SATcolRec {float: right; border-right: none; text-align: right;}.jimu-widget-SAT .SATcolRecBar {position: relative; height: 26px; width: 100%; display: block;}.jimu-widget-SAT .SATcolRecNum {position: absolute; width: 26px; height: 26px; background-color: #393939; background-color: rgba(0, 0, 0, 0.25); line-height: 26px; text-align: center; border-radius: 13px; font-size: 11px; cursor: pointer;}.jimu-widget-SAT .SATcolRecNum:focus{outline: #15a4fa solid 2px !important; outline-offset: -2px;}.jimu-widget-SAT .SATcolDir {position: absolute; right: 0px; width: 26px; height: 26px; background-image: url('images/car.png'); background-repeat: no-repeat; background-position: center center; cursor: pointer;}.jimu-rtl .jimu-widget-SAT .SATcolDir {position: absolute; left: 0px; right: auto;}.jimu-widget-SAT .SATcolDistance {position: absolute; left: 30px; right: 30px; height: 26px; font-size: 11px; line-height: 26px;}.jimu-widget-SAT .SATcolInfo {position: relative; margin-top: 5px; width: 100%; display: block; overflow: hidden;}.jimu-widget-SAT .noFeaturesActive {opacity: .5; cursor: default;}.jimu-widget-SAT .noFeatures {display: none;}.jimu-widget-SAT .locateIncident{float: left;}.jimu-rtl .jimu-widget-SAT .locateIncident{float: right;}.jimu-widget-SAT .clearIncident{float: right; text-decoration: underline; cursor: pointer;}.jimu-rtl .jimu-widget-SAT .clearIncident{float: left; text-decoration: underline; cursor: pointer;}.jimu-widget-SAT .imgContainer{display: table; width: 130px; padding-top: 10px;}.jimu-widget-SAT .bufferLabel{}.jimu-widget-SAT .spinnerValueDIV{float: right; margin-top: 8px; margin-left: 4px; display: table-row;}.jimu-rtl .jimu-widget-SAT .spinnerValueDIV{float: left; margin-top: 8px; margin-right: 4px; display: table-row;}.jimu-widget-SAT .bufferUnit{display: inline; margin-left: 4px; margin-top: 7px;}.jimu-widget-SAT .saveIncidentDiv{position: absolute; top: 0px; left: 270px; line-height: 26px; font-size: 13px;}.jimu-rtl .jimu-widget-SAT .saveIncidentDiv{position: absolute; top: 0px; right: 270px; line-height: 26px; font-size: 13px;}.jimu-widget-SAT .downlaodAllDiv{position: absolute; top: 35px; left: 270px; line-height: 26px; font-size: 13px;}.jimu-rtl .jimu-widget-SAT .downlaodAllDiv{position: absolute; top: 35px; right: 270px; line-height: 26px; font-size: 13px;}.jimu-widget-SAT .createSnapshotDiv{position: absolute; top: 70px; left: 270px; line-height: 26px; font-size: 13px;}.jimu-rtl .jimu-widget-SAT .createSnapshotDiv{position: absolute; top: 70px; right: 270px; line-height: 26px; font-size: 13px;}.jimu-widget-SAT .pad-top-5{padding-top: 5px;}.jimu-widget-SAT .pad-top-10{padding-top: 10px;}.jimu-popup .SAT-warning-icon {width: 25px; height: 25px; position: relative; background-size: contain; background-repeat: no-repeat; background-image: url('../images/warning.png'); margin-top: 8px;}.jimu-popup .SAT-warning-hint {color: #898989; font-size: 11px; margin-bottom: 10px;}.jimu-widget-SAT-property-helper .pad-top-5{padding-top: 5px;}.jimu-widget-SAT-property-helper .pad-top-10{padding-top: 10px;}.jimu-widget-SAT-property-helper .pad-right-5{padding-right: 5px;}.jimu-rtl .jimu-widget-SAT-property-helper .pad-right-5{padding-left: 5px;}.jimu-widget-SAT-property-helper .commentTextArea{width: 100%;}.jimu-widget-SAT-property-helper .width-all{width: 100%;}.jimu-widget-SAT-property-helper .display-on{display: block;}.jimu-widget-SAT-property-helper .display-off{display: none;}.jimu-widget-SAT-property-helper .dijitSelectLabel {text-align: left; text-overflow: ellipsis; overflow: hidden; max-width: 153px;}@media screen and (max-width: 420px ) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 133px;}}@media screen and (max-width: 400px ) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 113px;}}@media screen and (max-width: 360px ) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 105px;}}@media screen and (max-width: 320px) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 87px;}}.jimu-widget-SAT-property-helper .hintText {font-size: 12px; color: #a0acbf; font-style: oblique;}.jimu-widget-SAT-ai .esriAttributeInspector .atiRichTextField{}.jimu-widget-SAT-ai .esriAttributeInspector div.dijitEditorIFrameContainer {height: 78px; width: 100%;}.jimu-widget-SAT-ai .esriAttributeInspector .dijitTextBox.dijitTextArea {height: 32px;}.jimu-widget-SAT-ai .esriAttributeInspector .atiButton {padding-top:2px; margin-right: 10px; display: inline-table; background-image: none;}.jimu-widget-SAT-ai .esriAttributeInspector .atiButtons {height:30px; width:100%; display:inline-block; width:100%;}.jimu-widget-SAT-ai .esriAttributeInspector {display:inline-block;}.jimu-widget-SAT-ai .esriAttributeInspector .dijitArrowButtonContainer {margin-top:0px; margin-right:0px; margin-bottom:0px; width:18px;}.jimu-widget-SAT-ai .esriAttributeInspector .atiNavButtons {display:none; visibility:hidden; height: 0px;}.jimu-widget-SAT-ai .esriPopup .spinner {display: none;}",
    "*now": function(r) {
      r([
        'dojo/i18n!*preload*widgets/SituationAwareness/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare dijit/_WidgetsInTemplateMixin dijit/form/Button jimu/BaseWidget jimu/dijit/Message jimu/utils jimu/accessibleUtils jimu/LayerInfos/LayerInfos jimu/portalUtils jimu/dijit/Report jimu/dijit/PageUtils dojo/_base/Color dojo/_base/html dojo/dom dojo/on dojo/dom-style dojo/dom-class dojo/dom-construct dojo/dom-attr dojo/dom-geometry dojo/_base/lang dojo/_base/array dojo/_base/xhr dojo/query dojo/json dojo/topic dojo/aspect dojo/Deferred dojo/DeferredList dojo/string dojo/colors esri/geometry/geometryEngine esri/geometry/Point esri/geometry/webMercatorUtils esri/tasks/ProjectParameters esri/geometry/jsonUtils esri/graphic esri/graphicsUtils esri/geometry/geodesicUtils esri/Color esri/layers/GraphicsLayer esri/layers/FeatureLayer esri/SpatialReference esri/symbols/Font esri/symbols/SimpleLineSymbol esri/symbols/SimpleFillSymbol esri/symbols/SimpleMarkerSymbol esri/symbols/TextSymbol esri/tasks/locator esri/tasks/GeometryService esri/tasks/PrintTemplate esri/tasks/LegendLayer esri/toolbars/draw esri/dijit/AttributeInspector jimu/dijit/Popup esri/tasks/query esri/request esri/lang ./js/SummaryInfo ./js/GroupedCountInfo ./js/ClosestInfo ./js/ProximityInfo ./js/SnapShotUtils ./js/PropertyHelper ./js/analysisUtils dojo/keys dojo/domReady!".split(
  " "
), function(
  r,
  q,
  u,
  v,
  m,
  h,
  f,
  d,
  t,
  l,
  x,
  b,
  a,
  n,
  c,
  k,
  g,
  e,
  E,
  D,
  w,
  B,
  F,
  G,
  C,
  A,
  R,
  J,
  O,
  H,
  y,
  T,
  Z,
  I,
  z,
  K,
  P,
  Y,
  X,
  M,
  N,
  U,
  V,
  aa,
  L,
  S,
  W,
  ba,
  ca,
  ia,
  ja,
  ka,
  da,
  fa,
  la,
  ma,
  na,
  ga,
  oa,
  pa,
  qa,
  ra,
  ea,
  sa,
  ha,
  Q
) {
  return r([v, q], {
    baseClass: "jimu-widget-SAT",
    name: "IncidentAnalysis",
    opLayers: null,
    curTab: 0,
    lyrBuffer: null,
    lyrIncidents: null,
    lyrClosest: null,
    lyrProximity: null,
    lyrSummary: null,
    lyrEdit: null,
    toolbar: null,
    tool: -1,
    symPoint: null,
    symLine: null,
    symPoly: null,
    symBuffer: null,
    symRoute: null,
    incidents: [],
    buffers: [],
    gsvc: null,
    locator: null,
    stops: [],
    initalLayerVisibility: {},
    startX: 0,
    mouseDown: !1,
    btnNodes: [],
    panelNodes: [],
    tabNodes: [],
    currentSumLayer: null,
    currentGrpLayer: null,
    mapBottom: null,
    mapResize: null,
    geomExtent: void 0,
    selectedGraphic: !1,
    honorTemplate: !1,
    _isDrawToolSelected: !1,
    Incident_Local_Storage_Key: "SAT_Incident",
    SLIDER_MAX_VALUE: 1e4,
    postCreate: function() {
      this.inherited(arguments);
      this.nls = w.mixin(this.nls, window.jimuNls.units);
      this.nls = w.mixin(this.nls, window.jimuNls.common);
      this._isDrawToolSelected = !1;
      this.widgetActive = !0;
      window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
      E.set(this.closeButton, "aria-label", this.nls.close);
      this.own(
        c(
          this.domNode,
          "keydown",
          w.hitch(this, function(a) {
            a.keyCode === Q.ESCAPE &&
              (a.stopPropagation(), this.closeButton.focus());
            g.remove(this.SA_btn0, "esriCTDrawPointBtn");
          })
        )
      );
      this.own(
        c(
          this.panelContainer,
          "keydown",
          w.hitch(this, function(a) {
            a.keyCode === Q.ESCAPE &&
              (a.stopPropagation(),
              G(".SATTab.active", this.domNode)[0].focus());
          })
        )
      );
      this.own(
        c(
          this.closeButton,
          "keydown",
          w.hitch(this, function(a) {
            if (a.keyCode === Q.ENTER || a.keyCode === Q.SPACE)
              a.stopPropagation(), this._close();
          })
        )
      );
    },
    postMixInProperties: function() {
      this.inherited(arguments);
      this.isRenderIdForAttrs = !0;
    },
    startup: function() {
      this.inherited(arguments);
      this.updateTabs();
      this.btnNodes = [];
      this.panelNodes = [];
      this.tabNodes = [];
      this.reportSrc = this.folderUrl + "css/images/report.png";
      this.saveSrc = this.folderUrl + "css/images/save.png";
      this.downloadAllSrc = this.folderUrl + "css/images/download_all.png";
      this.snapshotSrc = this.folderUrl + "css/images/snapshot.png";
      this.processingSrc = this.folderUrl + "css/images/processing.gif";
      this.editTemplate = this.config.editTemplate;
      this.saveEnabled = this.config.saveEnabled;
      this.summaryDisplayEnabled = this.config.summaryDisplayEnabled;
      this.snapshotEnabled =
        "undefined" !== typeof this.config.snapshotEnabled
          ? this.config.snapshotEnabled
          : !1;
      this.reportEnabled =
        "undefined" !== typeof this.config.reportEnabled
          ? this.config.reportEnabled
          : !1;
      this.allEnabled =
        this.saveEnabled && this.snapshotEnabled && this.reportEnabled;
      this.SLIDER_MAX_VALUE = parseFloat(
        this.config.bufferRange.maximum.toString().replace(/,/g, ""),
        10
      );
      this.SLIDER_MIN_VALUE = parseFloat(
        this.config.bufferRange.minimum.toString().replace(/,/g, ""),
        10
      );
      "undefined" === typeof this.config.bufferRange._default &&
        (this.config.bufferRange._default = this.config.bufferRange.minimum);
      this.SLIDER_DEFAULT_VALUE = parseFloat(
        this.config.bufferRange._default.toString().replace(/,/g, ""),
        10
      );
      d.getInstance(this.map, this.map.itemInfo).then(
        w.hitch(this, function(a) {
          this.opLayers = a;
          this._initJimuLayerInfos();
          this._getStyleColor();
          this._createUI();
          this._loadUI();
          this._initLayers();
          this._verifyRouting();
          this._getAttributeTable();
          this._mapLoaded();
        })
      );
    },
    _togglePopupClass: function(a) {
      if (
        this.map.infoWindow &&
        this.map.infoWindow.domNode &&
        this.saveEnabled
      ) {
        var b = G(".contentPane", this.map.infoWindow.domNode)[0];
        b && (a ? g.add : g.remove)(b, "jimu-widget-SAT-ai");
      }
    },
    updateTabs: function() {
      if (this.config && this.config.tabs && this.config.tabs.length)
        for (var a = this.config.tabs, b = 0; b < a.length; b++) {
          var c = a[b];
          c.type && "weather" === c.type && a.splice(b, 1);
        }
    },
    onOpen: function() {
      this.inherited(arguments);
      this.widgetActive = !0;
      this.map.infoWindow.isShowing && this.map.infoWindow.hide();
      this.setPosition();
      this.windowResize = c(window, "resize", w.hitch(this, this._resize));
      null === this.mapResize &&
        (this.mapResize = this.map.on(
          "resize",
          w.hitch(this, this._mapResize)
        ));
      this._mapResize();
      this.own(
        A.subscribe(
          "changeMapPosition",
          w.hitch(this, this._onMapPositionChange)
        )
      );
      (this.disableVisibilityManagement =
        "undefined" !== typeof this.config.disableVisibilityManagement
          ? this.config.disableVisibilityManagement
          : !1) || this._storeInitalVisibility();
      this._checkHideContainer();
      this._initEditInfo();
      this._clickTab(0);
      this._updateCounts(!0);
      this._restoreIncidents();
    },
    _checkHideContainer: function() {
      this.hideContainer = !1;
      var a = this.map.infoWindow;
      a.popupInfoView &&
        a.popupInfoView.container &&
        ((this.hideContainer = !0),
        this.own(c(a, "show", w.hitch(this, this._handlePopup))));
    },
    onClose: function() {
      this._storeIncidents();
      this._toggleTabLayersOld();
      this._resetInfoWindow();
      this.mapResize && (this.mapResize.remove(), (this.mapResize = null));
      this.windowResize &&
        (this.windowResize.remove(), (this.windowResize = null));
      this._clear(!0);
      this.widgetActive = !1;
      this.saveEnabled && (this.scSignal.remove(), this.sfSignal.remove());
      this._mapResize();
      this.disableVisibilityManagement || this._resetInitalVisibility();
      this.inherited(arguments);
      this._resetMapPosition();
      this._togglePopupClass(!1);
    },
    onDeActive: function() {
      this._clickIncidentsButton(-1);
    },
    destroy: function() {
      this._clear(!0);
      this._toggleTabLayersOld();
      this.lyrBuffer && this.map.removeLayer(this.lyrBuffer);
      this.lyrIncidents && this.map.removeLayer(this.lyrIncidents);
      this.lyrClosest && this.map.removeLayer(this.lyrClosest);
      this.lyrProximity && this.map.removeLayer(this.lyrProximity);
      this.lyrSummary && this.map.removeLayer(this.lyrSummary);
      this.lyrGroupedSummary && this.map.removeLayer(this.lyrGroupedSummary);
      this.inherited(arguments);
    },
    onAppConfigChanged: function(a, b) {
      switch (b) {
        case "themeChange":
        case "layoutChange":
        case "styleChange":
          this._updateUI(a);
          break;
        case "widgetPoolChange":
          this._verifyRouting();
          break;
        case "mapChange":
          window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
          break;
        case "attributeChange":
          this._updateUI(a);
      }
    },
    _handlePopup: function() {
      this._clearMobileSetAsIncidentStyle();
      var a = n.byId("main-page"),
        b,
        c,
        d;
      this.map.infoWindow.popupInfoView
        ? ((b = this.map.infoWindow.popupInfoView.container),
          (c =
            ".mainSection { overflow-y: auto; height: " +
            (a.clientHeight - 60).toString() +
            "px; }"),
          (d =
            ".atiAttributes {overflow: auto; height: " +
            (a.clientHeight - 130).toString() +
            "px; }"))
        : ((b = G("div.atiAttributes", this.map.infoWindow.domNode)[0]),
          (c = ".mainSection { overflow-y: none; }"),
          (d = ".atiAttributes {overflow: none; }"));
      a.clientHeight &&
        b &&
        ((a = document.createElement("style")),
        (a.type = "text/css"),
        (a.id = "_tempMainSectionOverride"),
        b.appendChild(a),
        a.sheet.insertRule(c, 0),
        a.sheet.insertRule(d, 1));
    },
    _updateUI: function(a) {
      this._getStyleColor(a);
    },
    _updateFontColor: function(a) {
      "undefined" === typeof a && (a = this.appConfig);
      a = e
        .create("div", { id: "tempTitle", innerHTML: a.title })
        .getElementsByTagName("font");
      this.config.fontColor =
        a && 0 < a.length
          ? /^#[0-9A-F]{6}$/i.test(a[0].color)
            ? a[0].color
            : "#ffffff"
          : "#ffffff";
      e.destroy("tempTitle");
      a = document.querySelectorAll(".panelBottom ");
      for (var b = 0; b < a.length; b++)
        a[b].style.color = this.config.fontColor;
    },
    _updateButtonBackgrounds: function(a, b) {
      B.forEach(this.imgContainer.children, function(c) {
        g.contains(c.children[0], a ? "btn32img" : "btn32imgBlack") &&
          g.remove(c.children[0], a ? "btn32img" : "btn32imgBlack");
        g.add(c.children[0], a ? "btn32imgBlack" : "btn32img");
        g.contains(
          c.children[0],
          b ? "darkThemeBackground" : "lightThemeBackground"
        ) &&
          g.remove(
            c.children[0],
            b ? "darkThemeBackground" : "lightThemeBackground"
          );
        g.add(
          c.children[0],
          b ? "lightThemeBackground" : "darkThemeBackground"
        );
      });
      var c = this.allEnabled;
      B.forEach(this.saveOptions.children, function(d) {
        c
          ? B.forEach(d.children, function(c) {
              g.contains(c.children[0], a ? "btn32img" : "btn32imgBlack") &&
                g.remove(c.children[0], a ? "btn32img" : "btn32imgBlack");
              g.add(c.children[0], a ? "btn32imgBlack" : "btn32img");
              g.contains(
                c.children[0],
                b ? "darkThemeBackground" : "lightThemeBackground"
              ) &&
                g.remove(
                  c.children[0],
                  b ? "darkThemeBackground" : "lightThemeBackground"
                );
              g.add(
                c.children[0],
                b ? "lightThemeBackground" : "darkThemeBackground"
              );
            })
          : (g.contains(d.children[0], a ? "btn32img" : "btn32imgBlack") &&
              g.remove(d.children[0], a ? "btn32img" : "btn32imgBlack"),
            g.add(d.children[0], a ? "btn32imgBlack" : "btn32img"),
            g.contains(
              d.children[0],
              b ? "darkThemeBackground" : "lightThemeBackground"
            ) &&
              g.remove(
                d.children[0],
                b ? "darkThemeBackground" : "lightThemeBackground"
              ),
            g.add(
              d.children[0],
              b ? "lightThemeBackground" : "darkThemeBackground"
            ));
      });
    },
    _getStyleColor: function(a) {
      this._updateFontColor(a);
      setTimeout(
        w.hitch(this, function() {
          if (this.footerNode) {
            var a = window
              .getComputedStyle(this.footerNode, null)
              .getPropertyValue("background-color");
            this.config.activeMapGraphicColor = a;
            a = b.fromRgb(a);
            this.lightTheme =
              210 > 0.2126 * a.r + 0.7152 * a.g + 0.0722 * a.b ? !1 : !0;
            this.config.color = a.toHex();
            this.isBlackTheme = "#000000" === this.config.color ? !0 : !1;
            this._updateButtonBackgrounds(this.isBlackTheme, this.lightTheme);
            this.updateActiveNodes(this.lightTheme, !0);
            this.updateActiveNodes(this.lightTheme, !1);
            this.isBlackTheme
              ? (g.remove(this.tabNodes[this.curTab], "active"),
                g.add(this.tabNodes[this.curTab], "activeBlack"),
                (this.config.activeColor = "rgb(53, 53, 53)"))
              : (g.remove(this.tabNodes[this.curTab], "activeBlack"),
                g.add(this.tabNodes[this.curTab], "active"),
                (this.config.activeColor = "rgba(39, 39, 39, 0.3)"));
            this._setupSymbols();
            this.dataValue
              ? this._drawIncident(this.dataValue, void 0, void 0, !0).then(
                  w.hitch(this, function() {
                    this.dataValue = void 0;
                  })
                )
              : this._bufferIncident();
          }
        }),
        300
      );
    },
    updateActiveNodes: function(a, b) {
      var c, d;
      b
        ? ((b = [
            ".SATcolLocate",
            ".SATcol",
            ".SATcolRec",
            ".borderCol",
            ".SATcolSmall"
          ]),
          (c = "lightThemeBorder"),
          (d = "darkThemeBorder"))
        : ((b = ".btn32img .innerBL .innerBR .SA_panelClose .SA_panelRight .SA_panelLeft".split(
            " "
          )),
          (c = "lightThemeBackground"),
          (d = "darkThemeBackground"));
      B.forEach(b, function(b) {
        b = G(b);
        for (var e = 0; e < b.length; e++) {
          var f = b[e];
          g.remove(f, a ? d : c);
          g.add(f, a ? c : d);
        }
      });
    },
    setPosition: function(b, c) {
      this.widgetActive &&
        ((c = window.jimuConfig.layoutId),
        "TabTheme" === this.appConfig.theme.name
          ? (this.position = {
              left: this.widgetManager.getControllerWidgets()[0].domNode
                .clientWidth,
              right: 0,
              bottom: 24,
              height: 155,
              relativeTo: "browser"
            })
          : "DashboardTheme" === this.appConfig.theme.name
          ? ((this.position = { left: 0, right: 0, bottom: 0, height: 155 }),
            (c = this.map.id))
          : (this.position = {
              left: 0,
              right: 0,
              bottom: 0,
              height: 155,
              relativeTo: "browser"
            }),
        (b = h.getPositionStyle(this.position)),
        (b.position = "absolute"),
        a.place(this.domNode, c),
        a.setStyle(this.domNode, b),
        this.started && this.resize(),
        A.publish("changeMapPosition", { bottom: 155 }));
    },
    disableWebMapPopup: function() {
      this.map && this.map.setInfoWindowOnClick(!1);
    },
    enableWebMapPopup: function() {
      this.map && this.map.setInfoWindowOnClick(!0);
    },
    _setEventLocation: function(b) {
      var c = b.feature ? b.feature : this.map.infoWindow.getSelectedFeature();
      if (b && "add" === b.type)
        (c = { eventType: "IncidentLocationAdd", dataValue: c }),
          (this.incidents = []),
          (this.buffers = []),
          this.lyrIncidents.clear(),
          this.lyrBuffer.clear();
      else {
        for (var d = !0, e, f = 0; f < this.lyrIncidents.graphics.length; f++) {
          var h = this.lyrIncidents.graphics[f];
          if (h.geometry.type === c.geometry.type) {
            var k = !T.equals(h.geometry, c.geometry);
            h.attributes &&
              c.attributes &&
              !k &&
              (k =
                k && C.stringify(h.attributes) === C.stringify(c.attributes));
            d = d && k;
            k || (e = h);
          }
        }
        c = {
          eventType: d ? "IncidentLocationAdd" : "IncidentLocationRemove",
          dataValue: c,
          removeGraphic: e
        };
      }
      this.onReceiveData("", "", c);
      this.map.infoWindow.isShowing && this.map.infoWindow.hide();
      b &&
        ((b = this.map.infoWindow),
        b.popupNavigationBar &&
          ((c = G(".esriMobileNavigationBar", b.popupNavigationBar.domNode)),
          0 < c.length && a.setStyle(c[0], "display", "none")),
        b.popupInfoView &&
          ((c = G(".esriMobileInfoView", b.popupInfoView.domNode)),
          0 < c.length && a.setStyle(c[0], "display", "none")));
      g.remove(this.panelContainer, "loading");
    },
    _initLayers: function() {
      this.gsvc = new ia(
        this.config.geometryService && this.config.geometryService.url
          ? this.config.geometryService.url
          : this.appConfig.geometryService
      );
      this.locator = new ca(this.config.geocodeService.url);
      this.own(
        c(
          this.locator,
          "location-to-address-complete",
          w.hitch(this, this._showIncidentAddress)
        )
      );
      this.own(c(this.locator, "error", w.hitch(this, this._onAddressError)));
      this.lyrIncidents = new N();
      this.map.addLayer(this.lyrIncidents);
      this.lyrClosest = new N();
      this.lyrClosest.setVisibility(!1);
      this.map.addLayer(this.lyrClosest);
      this.lyrProximity = new N();
      this.lyrProximity.setVisibility(!1);
      this.map.addLayer(this.lyrProximity);
      this.summaryDisplayEnabled &&
        ((this.lyrSummary = new N()),
        this.lyrSummary.setVisibility(!1),
        this.map.addLayer(this.lyrSummary),
        (this.lyrGroupedSummary = new N()),
        this.lyrGroupedSummary.setVisibility(!1),
        this.map.addLayer(this.lyrGroupedSummary));
      this.lyrBuffer = new N();
      this.map.addLayer(this.lyrBuffer);
    },
    _mapLoaded: function() {
      G("[data-reference]").style("z-index", 0);
      this._processOperationalLayers();
      this.saveEnabled && this._initEdit();
      var a = this.map.itemInfo.itemData.baseMap.baseMapLayers[0];
      ("ArcGISTiledMapServiceLayer" === a.layerType &&
        a.resourceInfo.singleFusedMapCache) ||
        (this.config.defaultZoomLevel = 0.5);
      this._clickTab(0);
    },
    _initEdit: function() {
      var a = this.map.infoWindow;
      this.config.saveEnabled &&
        "undefined" === typeof this.config.savePolys &&
        "undefined" === typeof this.config.saveLines &&
        "undefined" === typeof this.config.savePoints &&
        ((this.config.savePolys = !0),
        (this.config.polyEditLayer = this.config.editLayer),
        (this.polyTemplate = this.config.editTemplate),
        (this.honorTemplate = !0));
      this.config.savePoints &&
        this._initEditLayer(this.config.pointEditLayer, "point");
      this.config.saveLines &&
        this._initEditLayer(this.config.lineEditLayer, "line");
      this.config.savePolys &&
        this._initEditLayer(this.config.polyEditLayer, "poly");
      this.scSignal = c(
        a,
        "selection-change",
        w.hitch(this, this._selectionChanged)
      );
      this.sfSignal = c(
        a,
        "set-features",
        w.hitch(this, this._setPopupFeature)
      );
      var b = G(".esriPopupWrapper", a.domNode);
      0 < b.length &&
        "undefined" !== typeof b[0].clientHeight &&
        "undefined" !== typeof b[0].clientWidth &&
        (this.defaultPopupSize = { width: b[0].clientWidth });
      a.highlight = !0;
    },
    _getLayerIDs: function() {
      var a = [];
      B.forEach(
        this.opLayers._layerInfos,
        w.hitch(this, function(b) {
          0 < b.newSubLayers.length
            ? this._recurseLayersIDs(b.newSubLayers, a)
            : a.push({ id: b.id, title: b.title });
        })
      );
      return a;
    },
    _recurseLayersIDs: function(a, b) {
      B.forEach(
        a,
        w.hitch(this, function(a) {
          0 < a.newSubLayers.length
            ? this._recurseLayersIDs(a.newSubLayers, b)
            : b.push({ id: a.id, title: a.title });
        })
      );
    },
    _initJimuLayerInfos: function() {
      if (this.config && this.config.tabs && this.config.tabs.length) {
        for (
          var a = this.config.tabs,
            b = [],
            c = this._getLayerIDs(),
            d = a.length - 1;
          0 <= d;
          d--
        ) {
          var f = a[d],
            g = f.layerTitle ? f.layerTitle : f.layers;
          if (
            f.layers &&
            ((f.jimuLayerInfo = this.opLayers.getLayerInfoById(f.layers)),
            !f.jimuLayerInfo)
          ) {
            if (c && c.hasOwnProperty("length") && 0 < c.length) {
              var h = 0;
              a: for (; h < c.length; h++) {
                var k = c[h];
                if (k && k.hasOwnProperty("title") && k.title === g) {
                  f.jimuLayerInfo = this.opLayers.getLayerInfoById(k.id);
                  break a;
                }
              }
            }
            f.jimuLayerInfo || (this.config.tabs.splice(d, 1), b.push(g));
          }
        }
        if (0 < b.length) {
          var l = "";
          B.forEach(
            b,
            w.hitch(this, function(a) {
              l +=
                ga.substitute({ name: a }, this.nls.missingLayer) +
                "\x3c/br\x3e\x3c/br\x3e";
            })
          );
          a = e.create("div", { style: "max-height:500px;overflow:auto;" });
          e.create(
            "div",
            {
              className: "SAT-warning-hint",
              innerHTML: this.nls.missingLayerHint
            },
            a
          );
          e.create(
            "div",
            {
              innerHTML: l.substr(0, l.lastIndexOf("\x3c/br\x3e\x3c/br\x3e")),
              style: "padding-" + (window.isRTL ? "right" : "left") + ": 10px;"
            },
            a
          );
          new m({
            titleLabel:
              "\x3cdiv class\x3d'SAT-warning-icon' style\x3d'float: " +
              (window.isRTL ? "right; margin-left" : "left; margin-right") +
              ": 10px;'\x3e\x3c/div\x3e" +
              this.nls.layerNotAvalible,
            message: a,
            maxWidth: 350
          });
        }
      }
    },
    _initEditLayer: function(a, b) {
      var d;
      "point" === b
        ? ((this.pointEditLayer = this.opLayers.getLayerInfoById(
            a
          ).layerObject),
          (this.isPointEditable = this._isEditable(this.pointEditLayer)),
          (d = this.pointEditLayer),
          d.templates && 0 < d.templates.length
            ? (this.pointTemplate = d.templates[0])
            : d.types &&
              0 < d.types.length &&
              (this.pointTemplate = d.types[0].templates[0]),
          this.pointTemplate &&
            (this.pointEditLayerPrototype = this.pointTemplate.prototype))
        : "line" === b
        ? ((this.lineEditLayer = this.opLayers.getLayerInfoById(a).layerObject),
          (this.isLineEditable = this._isEditable(this.lineEditLayer)),
          (d = this.lineEditLayer),
          d.templates && 0 < d.templates.length
            ? (this.lineTemplate = d.templates[0])
            : d.types &&
              0 < d.types.length &&
              (this.lineTemplate = d.types[0].templates[0]),
          this.lineTemplate &&
            (this.lineEditLayerPrototype = this.lineTemplate.prototype))
        : "poly" === b &&
          ((this.polyEditLayer = this.opLayers.getLayerInfoById(a).layerObject),
          (this.isPolyEditable = this._isEditable(this.polyEditLayer)),
          (d = this.polyEditLayer),
          this.honorTemplate ||
            (d.templates && 0 < d.templates.length
              ? (this.polyTemplate = d.templates[0])
              : d.types &&
                0 < d.types.length &&
                (this.polyTemplate = d.types[0].templates[0])),
          this.polyTemplate &&
            (this.polyEditLayerPrototype = this.polyTemplate.prototype));
      d &&
        this.own(
          c(
            d,
            "click",
            w.hitch(this, function(a) {
              if (a.graphic)
                switch (((a = a.graphic), a.geometry.type)) {
                  case "point":
                    this.pointUpdateFeature = a;
                    break;
                  case "polyline":
                    this.lineUpdateFeature = a;
                    break;
                  case "polygon":
                    this.polyUpdateFeature = a;
                }
            })
          )
        );
    },
    _isEditable: function(a) {
      var b = !1;
      a.isEditable() && a.getEditCapabilities && (b = a.getEditCapabilities());
      return b && b.canUpdate && b.canCreate;
    },
    _initEditInfo: function() {
      if (this.saveEnabled) {
        var a = !1;
        this.polyEditLayer &&
          this.isPolyEditable &&
          ((a = !0),
          (this.defaultPolyContent = this.polyEditLayer.infoTemplate
            ? this.polyEditLayer.infoTemplate.content
            : void 0),
          this.polyEditLayer.infoTemplate.setContent(
            w.hitch(this, this._setEditLayerPopup)
          ));
        this.lineEditLayer &&
          this.isLineEditable &&
          ((a = !0),
          (this.defaultLineContent = this.lineEditLayer.infoTemplate
            ? this.lineEditLayer.infoTemplate.content
            : void 0),
          this.lineEditLayer.infoTemplate.setContent(
            w.hitch(this, this._setEditLayerPopup)
          ));
        this.pointEditLayer &&
          this.isPointEditable &&
          ((a = !0),
          (this.defaultPointContent = this.pointEditLayer.infoTemplate
            ? this.pointEditLayer.infoTemplate.content
            : void 0),
          this.pointEditLayer.infoTemplate.setContent(
            w.hitch(this, this._setEditLayerPopup)
          ));
        a && this.map.infoWindow.resize(350, 340);
      }
    },
    _setPopupFeature: function() {
      if (0 < this.map.infoWindow.count) {
        var a = this.map.infoWindow.getSelectedFeature();
        switch (a.geometry.type) {
          case "point":
            this.pointUpdateFeature = a;
            break;
          case "polyline":
            this.lineUpdateFeature = a;
            break;
          case "poly":
            this.polyUpdateFeature = a;
        }
      }
    },
    _selectionChanged: function() {
      if (0 < this.map.infoWindow.count) {
        var a = this.map.infoWindow.getSelectedFeature();
        switch (a.geometry.type) {
          case "point":
            this.pointUpdateFeature = a;
            break;
          case "polyline":
            this.lineUpdateFeature = a;
            break;
          case "poly":
            this.polyUpdateFeature = a;
        }
      }
    },
    _setEditLayerPopup: function(a) {
      var b;
      "polygon" === a.geometry.type && (b = this.polyEditLayer);
      "polyline" === a.geometry.type && (b = this.lineEditLayer);
      "point" === a.geometry.type && (b = this.pointEditLayer);
      for (var d = [], f = this._getPopupFields(b), g = 0; g < f.length; g++) {
        var h = f[g];
        h.isEditable &&
          h.isEditableOnLayer &&
          d.push({ fieldName: h.fieldName, isEditable: h.isEditable });
      }
      this.attInspector = new fa(
        {
          layerInfos: [
            {
              featureLayer: b,
              showAttachments: !1,
              isEditable: !0,
              fieldInfos: d
            }
          ]
        },
        e.create("div")
      );
      d = new u(
        { label: this.nls.update_btn, class: " atiButton" },
        e.create("div")
      );
      e.place(d.domNode, this.attInspector.deleteBtn.domNode.parentNode);
      this._togglePopupClass(!0);
      this.own(
        c(
          d,
          "click",
          w.hitch(this, function() {
            b.applyEdits(
              null,
              [a],
              null,
              w.hitch(this, function() {
                this.map.infoWindow.hide();
              }),
              function(a) {
                var b = "Error";
                "undefined" !== typeof a.details && (b = a.details);
                "undefined" !== typeof a.message && (b = a.message);
                new m({ message: b });
              }
            );
          })
        )
      );
      this.own(
        c(
          this.attInspector,
          "attribute-change",
          w.hitch(this, function(a) {
            switch (a.feature.geometry.type) {
              case "point":
                this.pointUpdateFeature = a.feature;
                this.pointUpdateFeature.attributes[a.fieldName] = a.fieldValue;
                break;
              case "polyline":
                this.lineUpdateFeature = a.feature;
                this.lineUpdateFeature.attributes[a.fieldName] = a.fieldValue;
                break;
              case "polygon":
                (this.polyUpdateFeature = a.feature),
                  (this.polyUpdateFeature.attributes[a.fieldName] =
                    a.fieldValue);
            }
          })
        )
      );
      this.own(
        c(
          this.attInspector,
          "next",
          w.hitch(this, function(a) {
            switch (a.feature.geometry.type) {
              case "point":
                this.pointUpdateFeature = a.feature;
                break;
              case "polyline":
                this.pointUpdateFeature = a.feature;
                break;
              case "poly":
                this.pointUpdateFeature = a.feature;
            }
          })
        )
      );
      this.own(
        c(
          this.attInspector,
          "delete",
          w.hitch(this, function(a) {
            var c = !1;
            if (0 < this.incidents.length) {
              for (var d = 0; d < this.incidents.length; d++)
                T.equals(a.feature.geometry, this.incidents[d].geometry) &&
                  (c = !0);
              if (!c && 0 < this.lyrBuffer.graphics.length)
                for (d = 0; d < length; d++)
                  T.equals(
                    a.feature.geometry,
                    this.lyrBuffer.graphics[d].geometry
                  ) && (c = !0);
            }
            b.applyEdits(
              null,
              null,
              [a.feature],
              function() {},
              function(a) {
                var b = "Error";
                "undefined" !== typeof a.details && (b = a.details);
                "undefined" !== typeof a.message && (b = a.message);
                new m({ message: b });
              }
            );
            this.pointEditLayer &&
              (this.pointUpdateFeature = this.pointEditLayerPrototype);
            this.lineEditLayer &&
              (this.lineUpdateFeature = this.lineEditLayerPrototype);
            this.polyEditLayer &&
              (this.polyUpdateFeature = this.polyEditLayerPrototype);
            c && this._clear(!1);
            this.map.infoWindow.hide();
          })
        )
      );
      switch (a.geometry.type) {
        case "point":
          this.pointUpdateFeature = a;
          break;
        case "polyline":
          this.lineUpdateFeature = a;
          break;
        case "polygon":
          this.polyUpdateFeature = a;
      }
      this.attInspector.showFeature(a);
      return this.attInspector.domNode;
    },
    _getPopupFields: function(a) {
      var b;
      if (a.infoTemplate) b = a.infoTemplate.info.fieldInfos;
      else if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
        var c = this.tab.tabLayers[0].url.split("MapServer/")[1],
          d = this.parent.map.itemInfo.itemData.operationalLayers;
        b = null;
        for (var e = 0; e < d.length; e++) {
          var f = d[e];
          if (
            f.layerObject.infoTemplates &&
            (f = f.layerObject.infoTemplates[c])
          ) {
            b = f.infoTemplate.info.fieldInfos;
            break;
          }
        }
      } else b = a.fields;
      b || (b = a.fields);
      return b;
    },
    _updatePopup: function(a, b, c) {
      b = [];
      for (c = 0; c < a.length; c++) {
        var d = a[c],
          e = new ma();
        e.objectIds = [d.oid];
        b.push(d.layer.selectFeatures(e, U.SELECTION_NEW));
      }
      new O(b).then(
        w.hitch(this, function(a) {
          for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            if (d[0]) {
              d = d[1][0];
              b.push(d);
              switch (d.geometry.type) {
                case "point":
                  this.pointUpdateFeature = d;
                  break;
                case "polyline":
                  this.lineUpdateFeature = d;
                  break;
                case "poly":
                  this.polyUpdateFeature = d;
              }
              this.attInspector || this._setEditLayerPopup(d);
              this.attInspector && this.attInspector.showFeature(d);
            }
          }
        })
      );
    },
    _processOperationalLayers: function() {
      for (var a = 0; a < this.config.tabs.length; a++) {
        var b = this.config.tabs[a];
        b.layers &&
          "" !== b.layers &&
          ((this.hasLayerTitle = "undefined" !== typeof b.layerTitle),
          (b.tabLayers = this._getTabLayers(b.layers)));
      }
    },
    _goToNextTab: function(a, b) {
      var c;
      if (a.keyCode === Q.LEFT_ARROW || (a.shiftKey && a.keyCode === Q.TAB))
        b = 0 === b ? this.tabNodes.length - 1 : b - 1;
      else if (a.keyCode === Q.RIGHT_ARROW || a.keyCode === Q.TAB)
        b = b === this.tabNodes.length - 1 ? 0 : b + 1;
      else return;
      c = G("div[tabNum\x3d" + b + "]", this.domNode)[0];
      g.contains(c, "noFeaturesActive") && (c = this._goToNextTab(a, b));
      return c;
    },
    _createUI: function() {
      var a = h.stripHTML(
        this.config.bufferLabel ? this.config.bufferLabel : ""
      );
      this.buffer_lbl.innerHTML = a;
      this.buffer_lbl_unit.innerHTML = this.nls[this.config.distanceUnits];
      this.spinnerValue.isRenderIdForAttrs = !0;
      this.spinnerValue.constraints = {
        min: this.SLIDER_MIN_VALUE,
        max: this.SLIDER_MAX_VALUE
      };
      this.spinnerValue.intermediateChanges = !0;
      a = ga.substitute(
        { min: this.SLIDER_MIN_VALUE, max: this.SLIDER_MAX_VALUE },
        this.nls.buffer_invalid
      );
      this.spinnerValue.invalidMessage = a;
      this.spinnerValue.rangeMessage = a;
      this.spinnerValue.set("value", this.SLIDER_DEFAULT_VALUE);
      this.locateIncident.innerHTML =
        "undefined" !== typeof this.config.locateIncidentLabel
          ? this.config.locateIncidentLabel
          : this.nls.locate_incident;
      this.config.tabs.splice(0, 0, {
        type: "incidents",
        label:
          "undefined" !== typeof this.config.incidentLabel
            ? this.config.incidentLabel
            : this.nls.incident,
        color: this.config.color
      });
      this.panelNodes.push(this.SA_tabPanel0);
      for (
        var a = this.panelContainer, b = this.tabsNode, d = 0, f = 0;
        f < this.config.tabs.length;
        f++
      ) {
        var l = this.config.tabs[f],
          m = l.label;
        (m && "" !== m) || (m = l.layerTitle ? l.layerTitle : l.layers);
        m = e.create(
          "div",
          {
            "data-dojo-attach-point": "SA_tab" + f,
            tabindex: "0",
            tabNum: f,
            role: "tab",
            "aria-label": h.stripHTML(m ? m : ""),
            "aria-selected": "false",
            innerHTML: h.stripHTML(m ? m : "")
          },
          b
        );
        this.tabNodes.push(m);
        g.add(m, "SATTab");
        d += D.position(m).w;
        c(m, "click", w.hitch(this, this._clickTab, f));
        c(
          m,
          "keydown",
          w.hitch(this, function(a) {
            var b;
            b = parseInt(E.get(a.currentTarget, "tabNum"), 10);
            a.keyCode === Q.TAB
              ? (a.preventDefault(), (a = this._goToNextTab(a, b)), a.focus())
              : a.keyCode === Q.LEFT_ARROW || a.keyCode === Q.RIGHT_ARROW
              ? ((a = this._goToNextTab(a, b)), a.focus())
              : a.keyCode === Q.ENTER || a.keyCode === Q.SPACE
              ? (this._clickTab(parseInt(E.get(a.currentTarget, "tabNum"), 10)),
                "0" === E.get(a.currentTarget, "tabNum") &&
                  setTimeout(
                    w.hitch(this, function() {
                      this.clearIncident.focus();
                    }),
                    100
                  ))
              : a.keyCode === Q.ESCAPE &&
                (this.closeButton.focus(), a.stopPropagation());
          })
        );
        0 < f &&
          ((m = e.create(
            "div",
            {
              "data-dojo-attach-point": "SA_tabPanel" + f,
              role: "tabpanel",
              innerHTML: ""
            },
            a
          )),
          this.panelNodes.push(m),
          c(
            this.panelNodes[f],
            "keydown",
            w.hitch(this, function(a) {
              a.keyCode === Q.ESCAPE &&
                (B.forEach(
                  this.tabNodes,
                  w.hitch(this, function(a) {
                    g.contains(a, "active") && a.focus();
                  })
                ),
                a.stopPropagation(),
                (a.cancelBubble = !0));
            })
          ),
          g.add(m, "SAT_tabPanel"),
          "summary" === l.type &&
            ((l.summaryInfo = new oa(l, m, this)),
            this.own(
              c(l.summaryInfo, "summary-complete", w.hitch(this, this.restore))
            )),
          "groupedSummary" === l.type &&
            ((l.groupedSummaryInfo = new pa(l, m, this)),
            this.own(
              c(
                l.groupedSummaryInfo,
                "summary-complete",
                w.hitch(this, this.restore)
              )
            )),
          "closest" === l.type && (l.closestInfo = new qa(l, m, this)),
          "proximity" === l.type && (l.proximityInfo = new ra(l, m, this)));
      }
      d += 10;
      k.set(b, "width", d + "px");
      d > D.position(this.footerNode).w &&
        (k.set(this.footerContentNode, "right", "58px"),
        k.set(this.panelRight, "display", "block"));
      c(b, "scroll", w.hitch(this, this._onPanelScroll));
      this.own(
        c(
          this.clearIncident,
          "keydown",
          w.hitch(this, function(a) {
            if (a.keyCode === Q.ENTER || a.keyCode === Q.SPACE)
              this._clear(),
                this.SA_btn0.focus(),
                this._getLastNodeForEachTab(0);
          })
        )
      );
    },
    restore: function(a) {
      a.tab === this.curTab && this._clickTab(a.tab);
    },
    validateSavePrivileges: function() {
      var a = new J();
      t.getPortal(this.appConfig.portalUrl)
        .getUser()
        .then(
          w.hitch(this, function(b) {
            b && b.privileges
              ? a.resolve(
                  -1 < b.privileges.indexOf("features:user:edit") ? !0 : !1
                )
              : a.resolve(!0);
          }),
          w.hitch(this, function(b) {
            console.log(b);
            a.resolve(!0);
          })
        );
      return a;
    },
    validateSnapshotPrivileges: function() {
      var a = new J();
      t.getPortal(this.appConfig.portalUrl)
        .getUser()
        .then(
          w.hitch(this, function(b) {
            b && b.privileges
              ? a.resolve(
                  -1 <
                    b.privileges.indexOf("portal:publisher:publishFeatures") &&
                    -1 < b.privileges.indexOf("portal:user:createItem")
                    ? !0
                    : !1
                )
              : a.resolve(!1);
          }),
          w.hitch(this, function(b) {
            console.log(b);
            a.resolve(!1);
          })
        );
      return a;
    },
    _loadUI: function() {
      var b = this.allEnabled
          ? e.create("div", { class: "displayT pad-top-5" }, this.saveOptions)
          : this.saveOptions,
        d = this.allEnabled
          ? e.create("div", { class: "displayT pad-top-10" }, this.saveOptions)
          : this.saveOptions,
        f = this.allEnabled ? "displayTC" : "displayTR";
      this.reportEnabled &&
        ((this.createReportButtonSpan = e.create(
          "span",
          { class: "btn32 " + f },
          b
        )),
        (this.createReportButton = e.create(
          "div",
          {
            class: "btn32img",
            title: this.nls.createReport,
            "aria-label": this.nls.createReport,
            tabindex: "0",
            role: "button"
          },
          this.createReportButtonSpan
        )),
        k.set(
          this.createReportButton,
          "backgroundImage",
          "url(" + this.reportSrc + ")"
        ),
        this.own(
          c(this.createReportButton, "click", w.hitch(this, this._createReport))
        ),
        this.own(
          c(
            this.createReportButton,
            "keydown",
            w.hitch(this, function(a) {
              (a.keyCode !== Q.ENTER && a.keyCode !== Q.SPACE) ||
                this._createReport();
            })
          )
        ));
      this.saveEnabled &&
        ((this.saveButtonSpan = e.create("span", { class: "btn32 " + f }, b)),
        this.validateSavePrivileges().then(
          w.hitch(this, function(a) {
            this.userCanSave = a;
            this.saveButton = e.create(
              "div",
              {
                class: a ? "btn32img" : "btn32img btnDisabled",
                title: a ? this.nls.saveIncident : this.nls.user_credentials,
                "aria-label": a
                  ? this.nls.saveIncident
                  : this.nls.user_credentials,
                tabindex: "0",
                role: "button"
              },
              this.saveButtonSpan
            );
            k.set(
              this.saveButton,
              "backgroundImage",
              "url(" + this.saveSrc + ")"
            );
            a &&
              (this.own(
                c(this.saveButton, "click", w.hitch(this, this._saveIncident))
              ),
              this.own(
                c(
                  this.saveButton,
                  "keydown",
                  w.hitch(this, function(a) {
                    (a.keyCode !== Q.ENTER && a.keyCode !== Q.SPACE) ||
                      this._saveIncident();
                  })
                )
              ));
          }),
          function(a) {
            console.log(a);
          }
        ));
      b = e.create("span", { class: "btn32 " + f }, d);
      this.downloadAllButon = e.create(
        "div",
        {
          class: "btn32img",
          title: this.nls.downloadAll,
          "aria-label": this.nls.downloadAll,
          tabindex: "0",
          role: "button"
        },
        b
      );
      k.set(
        this.downloadAllButon,
        "backgroundImage",
        "url(" + this.downloadAllSrc + ")"
      );
      this.own(
        c(this.downloadAllButon, "click", w.hitch(this, this._downloadAll))
      );
      this.own(
        c(
          this.downloadAllButon,
          "keydown",
          w.hitch(this, function(a) {
            (a.keyCode !== Q.ENTER && a.keyCode !== Q.SPACE) ||
              this._downloadAll();
          })
        )
      );
      this.snapshotEnabled &&
        ((this.createSnapshotButtonSpan = e.create(
          "span",
          { class: "btn32 " + f },
          d
        )),
        this.validateSnapshotPrivileges().then(
          w.hitch(this, function(a) {
            this.userCanSnapshot = a;
            this.createSnapshotButton = e.create(
              "div",
              {
                class: a ? "btn32img" : "btn32img btnDisabled",
                title: a ? this.nls.createSnapshot : this.nls.user_credentials,
                "aria-label": a
                  ? this.nls.createSnapshot
                  : this.nls.user_credentials,
                tabindex: "0",
                role: "button"
              },
              this.createSnapshotButtonSpan
            );
            k.set(
              this.createSnapshotButton,
              "backgroundImage",
              "url(" + this.snapshotSrc + ")"
            );
            a &&
              (this.own(
                c(
                  this.createSnapshotButton,
                  "click",
                  w.hitch(this, this._createSnapshot)
                )
              ),
              this.own(
                c(
                  this.createSnapshotButton,
                  "keydown",
                  w.hitch(this, function(a) {
                    (a.keyCode !== Q.ENTER && a.keyCode !== Q.SPACE) ||
                      this._createSnapshot();
                  })
                )
              ));
          }),
          function(a) {
            console.log(a);
          }
        ));
      d = {
        0: this.nls.drawPoint,
        1: this.nls.drawLine,
        2: this.nls.drawPolygon
      };
      this.btnNodes = [this.SA_btn0, this.SA_btn1, this.SA_btn2];
      for (f = 0; 3 > f; f++)
        (b = this.btnNodes[f]),
          k.set(
            b,
            "backgroundImage",
            "url(" + this.folderUrl + "images/btn" + f + ".png)"
          ),
          a.setAttr(b, "title", d[f]),
          a.setAttr(b, "aria-label", d[f]),
          a.setAttr(b, "toolNum", f),
          a.setAttr(b, "aria-pressed", "false"),
          this.own(c(b, "click", w.hitch(this, this._clickIncidentsButton, f))),
          this.own(
            c(
              b,
              "keydown",
              w.hitch(this, function(a) {
                if (a.keyCode === Q.ENTER || a.keyCode === Q.SPACE)
                  (this._isDrawToolSelected = !0),
                    this._clickIncidentsButton(
                      parseInt(E.get(a.currentTarget, "toolNum"), 10)
                    );
              })
            )
          );
      this.toolbar = new da(this.map, { tooltipOffset: 20, drawTime: 90 });
      this.toolbar.on("draw-complete", w.hitch(this, this._drawIncident));
      this.own(
        c(
          this.spinnerValue,
          "change",
          w.hitch(this, function() {
            this._updateSpinnerValue(!1);
          })
        )
      );
      this.own(
        c(
          this.spinnerValue,
          "blur",
          w.hitch(this, function() {
            this._updateSpinnerValue(!0);
          })
        )
      );
      this.own(
        c(
          this.spinnerValue,
          "keyup",
          w.hitch(this, function(a) {
            a.keyCode === Q.ENTER
              ? this._updateSpinnerValue(!0)
              : this._updateSpinnerValue(!1);
          })
        )
      );
    },
    _locateBuffer: function(a) {
      if (
        null !== a &&
        ((a = "extent" === a.type ? a : a.getExtent()), null !== a)
      ) {
        a = a.expand(1.5);
        var b = 80 / this.map.height,
          c = a.getHeight();
        a.update(
          a.xmin,
          a.ymin - c * b,
          a.xmax,
          a.ymax - c * b,
          this.map.spatialReference
        );
        this.map.setExtent(a, !0);
      }
    },
    _clickIncidentsButton: function(b) {
      var c;
      if (3 > b) {
        for (var d = 0; 3 > d; d++)
          (c = this.btnNodes[d]),
            g.remove(c, "btnOn"),
            a.setAttr(c, "aria-pressed", "false");
        -1 < b && b !== this.tool
          ? ((c = this.btnNodes[b]),
            3 > b && (g.add(c, "btnOn"), a.setAttr(c, "aria-pressed", "true")),
            (this.tool = b))
          : (this.tool = -1);
        switch (this.tool) {
          case -1:
            this.toolbar.deactivate();
            this.enableWebMapPopup();
            break;
          case 0:
            this._clear(!1);
            this.toolbar.activate(da.POINT);
            this.disableWebMapPopup();
            break;
          case 1:
            this._clear(!1);
            this.toolbar.activate(da.POLYLINE);
            this.disableWebMapPopup();
            break;
          case 2:
            this._clear(!1),
              this.toolbar.activate(da.POLYGON),
              this.disableWebMapPopup();
        }
      } else this._clear(!0);
    },
    _saveIncident: function() {
      this.map.infoWindow.hide();
      this._updateProcessing(this.saveButton, !0, this.saveSrc);
      var a = [];
      this.config.saveEnabled &&
        "undefined" === typeof this.config.savePolys &&
        "undefined" === typeof this.config.saveLines &&
        "undefined" === typeof this.config.savePoints &&
        (this.config.savePolys = !0);
      if (this.config.savePolys) {
        var b = this._getIncidentGraphics(
          "polygon",
          this.polyEditLayerPrototype
        );
        0 < b.length && a.push({ layer: this.polyEditLayer, graphics: b });
      }
      this.config.saveLines &&
        ((b = this._getIncidentGraphics(
          "polyline",
          this.lineEditLayerPrototype
        )),
        0 < b.length && a.push({ layer: this.lineEditLayer, graphics: b }));
      this.config.savePoints &&
        ((b = this._getIncidentGraphics("point", this.pointEditLayerPrototype)),
        0 < b.length && a.push({ layer: this.pointEditLayer, graphics: b }));
      0 < a.length
        ? this._applyEdits(a)
        : this._updateProcessing(this.saveButton, !1, this.saveSrc);
      this._clickIncidentsButton(-1);
    },
    _getIncidentGraphics: function(a, b) {
      var c = [];
      b = C.parse(C.stringify(b));
      if ("polygon" === a)
        for (var d = 0; d < this.lyrBuffer.graphics.length; d++) {
          var e = this.lyrBuffer.graphics[d],
            f = new P();
          f.geometry = e.geometry;
          f.setAttributes(b.attributes);
          c.push(f);
        }
      for (d = 0; d < this.incidents.length; d++)
        (e = this.incidents[d]),
          e.geometry.type === a &&
            ((f = new P()),
            (f.geometry = e.geometry),
            f.setAttributes(b.attributes),
            c.push(f));
      return c;
    },
    _applyEdits: function(a) {
      for (var b = new J(), c = [], d = [], e = 0; e < a.length; e++) {
        var f = a[e];
        f.layer.visible || f.layer.setVisibility(!0);
        var g = [];
        if (
          1 < f.graphics.length &&
          "polygon" === f.graphics[0].geometry.type
        ) {
          var h = f.graphics[0],
            k = f.graphics.map(function(a) {
              return a.geometry;
            });
          if ((k = T.union(k))) (h.geometry = k), g.push(h);
        }
        c.push(f.layer.applyEdits(0 < g.length ? g : f.graphics, null, null));
      }
      new O(c).then(
        w.hitch(this, function(c) {
          for (var e = !1, f = 0; f < c.length; f++) {
            var g = c[f][1][0];
            g.success &&
              ((e = !0),
              g.hasOwnProperty("objectId") &&
                d.push({ oid: g.objectId, layer: a[f].layer }));
          }
          this._smartEdit();
          if (!this.map.infoWindow.isShowing) {
            c = this.incidents[0].geometry;
            var h;
            switch (c.type) {
              case "point":
                h = c;
                break;
              case "polyline":
                h = c.paths[0][parseInt(c.paths[0].length / 2, 10)];
                h = new Z(h[0], h[1], c.spatialReference);
                break;
              case "polygon":
                h = c.getCentroid();
            }
            c = this.map.toScreen(h);
            0 < d.length && this._updatePopup(d, h, c);
            this._updateProcessing(this.saveButton, !1, this.saveSrc);
            this.map.emit("click", {
              bubbles: !0,
              cancelable: !0,
              screenPoint: c,
              mapPoint: h
            });
          }
          b.resolve(e);
        }),
        w.hitch(this, function(a) {
          console.error(a);
          this._updateProcessing(this.saveButton, !1, this.saveSrc);
          new m({ message: a });
          b.reject(a);
        })
      );
      return b;
    },
    _smartEdit: function() {
      if (!this.smartEditor) {
        var a = this.appConfig.getConfigElementsByName("SmartEditor");
        B.forEach(
          a,
          w.hitch(this, function(a) {
            "SmartEditor" === a.name &&
              (this.smartEditor = this.widgetManager.getWidgetById(a.id));
          })
        );
      }
      this.smartEditor &&
        this.smartEditor.state &&
        "opened" === this.smartEditor.state &&
        this.smartEditor._mapClickHandler(!0);
    },
    _clear: function(b) {
      this.map.graphics.clear();
      this.lyrIncidents.clear();
      this.lyrBuffer.clear();
      this.lyrProximity.clear();
      this.lyrClosest.clear();
      this.geomExtent = void 0;
      this.summaryDisplayEnabled && this.lyrSummary && this.lyrSummary.clear();
      this.summaryDisplayEnabled &&
        this.lyrGroupedSummary &&
        this.lyrGroupedSummary.clear();
      this.saveOptions &&
        (g.remove(this.saveOptions, "displayT"),
        g.add(this.saveOptions, "display-off"));
      this.borderCol &&
        (g.remove(this.borderCol, "display-on"),
        g.add(this.borderCol, "display-off"));
      this.clearIncident &&
        (g.remove(this.clearIncident, "display-on"),
        g.add(this.clearIncident, "display-off"));
      this.smartEditor && this.smartEditor._onCancelButtonClicked();
      this.incidents = [];
      this.buffers = [];
      this.div_reversed_address && (this.div_reversed_address.innerHTML = "");
      this.div_reverse_geocoding &&
        a.setStyle(this.div_reverse_geocoding, "display", "none");
      this._updateCounts(!0);
      this._clearGraphics();
      b &&
        this.spinnerValue &&
        this.spinnerValue.set("value", this.SLIDER_DEFAULT_VALUE);
      this.pointEditLayer &&
        (this.pointUpdateFeature = this.pointEditLayerPrototype);
      this.lineEditLayer &&
        (this.lineUpdateFeature = this.lineEditLayerPrototype);
      this.polyEditLayer &&
        (this.polyUpdateFeature = this.polyEditLayerPrototype);
      this._clearMobileSetAsIncidentStyle();
    },
    _clearMobileSetAsIncidentStyle: function() {
      e.destroy(n.byId("_tempMainSectionOverride"));
    },
    _updateSpinnerValue: function(a) {
      if (this.spinnerValue.validate()) {
        var b = this.spinnerValue.displayedValue;
        "string" === typeof b &&
          (b = parseFloat(b.toString().replace(/,/g, ""), 10));
        b < this.SLIDER_MIN_VALUE
          ? this.spinnerValue.set("value", this.SLIDER_MIN_VALUE)
          : b > this.SLIDER_MAX_VALUE &&
            this.spinnerValue.set("value", this.SLIDER_MAX_VALUE);
        a && this._bufferIncident();
      }
    },
    _clickTab: function(a) {
      this._validateFeatureCount(a) &&
        (E.set(this.tabNodes[a], "aria-selected", "true"),
        B.forEach(
          this.tabNodes,
          w.hitch(this, function(b, c) {
            a !== c && E.set(b, "aria-selected", "false");
          })
        ),
        this._toggleTabs(a),
        this._toggleTabLayers(a),
        (this.curTab = a),
        this._clickIncidentsButton(-1),
        setTimeout(
          w.hitch(this, function() {
            this._getLastNodeForEachTab(a);
          }),
          100
        ));
    },
    _getLastNodeForEachTab: function(a) {
      var b = this._getLastFocusNodeInDom(a);
      b &&
        (0 === a &&
          (g.contains(this.clearIncident, "display-off")
            ? (this._isDrawToolSelected || this.SA_btn0.focus(),
              h.initFirstFocusNode(this.domNode, this.SA_btn0))
            : h.initFirstFocusNode(this.domNode, this.clearIncident)),
        h.initLastFocusNode(this.domNode, b.domNode ? b.domNode : b));
    },
    _getLastFocusNodeInDom: function(a) {
      if (0 === a) return this._getLastFocusNodeInIncidentTab();
    },
    _getLastFocusNodeInIncidentTab: function() {
      var a;
      g.contains(this.saveOptions, "display-off") ||
        (this.config.snapshotEnabled &&
          this.createSnapshotButton &&
          !g.contains(this.createSnapshotButton, "btnDisabled") &&
          (a = this.createSnapshotButton),
        a ||
          !this.downloadAllButon ||
          g.contains(this.downloadAllButon, "btnDisabled") ||
          (a = this.downloadAllButon),
        !a &&
          this.config.saveEnabled &&
          this.saveButton &&
          !g.contains(this.saveButton, "btnDisabled") &&
          (a = this.saveButton),
        !a &&
          this.config.reportEnabled &&
          this.createReportButton &&
          !g.contains(this.createReportButton, "btnDisabled") &&
          (a = this.createReportButton));
      !a && this.spinnerValue && (a = this.spinnerValue);
      return a;
    },
    _validateFeatureCount: function(a) {
      var b = !0;
      a = this.config.tabs[a];
      switch (a.type) {
        case "summary":
          b = 0 < a.summaryInfo.featureCount;
          break;
        case "groupedSummary":
          b = 0 < a.groupedSummaryInfo.featureCount;
          break;
        case "closest":
          b = 0 < a.closestInfo.featureCount;
          break;
        case "proximity":
          b = 0 < a.proximityInfo.featureCount;
      }
      return b;
    },
    _toggleTabs: function(a) {
      for (var b = 0; b < this.config.tabs.length; b++)
        b === a
          ? (g.add(
              this.tabNodes[b],
              this.isBlackTheme ? "activeBlack" : "active"
            ),
            k.set(this.panelNodes[b], "display", "block"))
          : (g.remove(this.tabNodes[b], "active"),
            g.remove(this.tabNodes[b], "activeBlack"),
            k.set(this.panelNodes[b], "display", "none"));
      this._scrollToTab(a);
    },
    _toggleTabLayers: function(a) {
      this._toggleTabLayersOld();
      this._toggleTabLayersNew(a);
    },
    _toggleTabLayersOld: function() {
      var a = this.config.tabs[this.curTab];
      a &&
        (this.lyrClosest.setVisibility(!1),
        this.lyrProximity.setVisibility(!1),
        this.lyrSummary && this.lyrSummary.setVisibility(!1),
        this.lyrGroupedSummary && this.lyrGroupedSummary.setVisibility(!1),
        this._setLayerVisible(a, !1));
    },
    _toggleTabLayersNew: function(a) {
      var b = this.config.tabs[a];
      switch (b.type) {
        case "summary":
          var c = !1;
          this.lyrSummary &&
            (this.currentSumLayer !== a && (c = !0), this.lyrSummary.clear());
          b.tabLayers &&
            1 < b.tabLayers.length &&
            (this.lyrSummary &&
              ((this.lyrSummary.infoTemplate = b.tabLayers[1].infoTemplate),
              B.forEach(
                b.tabLayers[1].graphics,
                w.hitch(this, function(a) {
                  this.lyrSummary.add(a);
                })
              ),
              b.tabLayers[0] &&
                b.tabLayers[0].hasOwnProperty("opacity") &&
                this.lyrSummary.setOpacity(b.tabLayers[0].opacity),
              this.lyrSummary.setVisibility(!0)),
            c && ((this.currentSumLayer = a), this._toggleTabLayersNew(a)));
          0 < this.incidents.length && !0 === b.updateFlag
            ? (b.summaryInfo.updateForIncident(
                this.incidents,
                this.buffers,
                this.summaryDisplayEnabled ? this.lyrSummary : null,
                a
              ),
              (this.currentSumLayer = a))
            : (a = G(".summaryDownLoadCSVButton", this.domNode)) &&
              0 < a.length &&
              (a[0].focus(),
              h.initFirstFocusNode(this.domNode, a[0]),
              h.initLastFocusNode(this.domNode, a[0]));
          break;
        case "groupedSummary":
          this.lyrGroupedSummary &&
            (this.currentSumLayer !== a && (c = !0),
            this.lyrGroupedSummary.clear());
          b.tabLayers &&
            1 < b.tabLayers.length &&
            (this.lyrGroupedSummary &&
              ((this.lyrGroupedSummary.infoTemplate =
                b.tabLayers[1].infoTemplate),
              B.forEach(
                b.tabLayers[1].graphics,
                w.hitch(this, function(a) {
                  this.lyrGroupedSummary.add(a);
                })
              ),
              this.lyrGroupedSummary.setVisibility(!0)),
            c && ((this.currentSumLayer = a), this._toggleTabLayersNew(a)));
          0 < this.incidents.length && !0 === b.updateFlag
            ? (b.groupedSummaryInfo.updateForIncident(
                this.incidents,
                this.buffers,
                this.summaryDisplayEnabled ? this.lyrGroupedSummary : null,
                a
              ),
              (this.currentGrpLayer = a))
            : (a = G(".grpSummaryDownLoadCSVButton", this.domNode)) &&
              0 < a.length &&
              (a[0].focus(),
              h.initFirstFocusNode(this.domNode, a[0]),
              h.initLastFocusNode(this.domNode, a[0]));
          break;
        case "closest":
          this._setLayerVisible(b, !0);
          this.lyrClosest.setVisibility(!0);
          0 < this.incidents.length &&
            (b.closestInfo &&
              b.closestInfo.container &&
              ((b.closestInfo.container.innerHTML = ""),
              g.add(b.closestInfo.container, "loading")),
            !1 === b.updateFlag && this.lyrClosest.clear(),
            b.closestInfo.updateForIncident(
              this.incidents,
              this.config.maxDistance,
              this.lyrClosest
            ));
          break;
        case "proximity":
          this._setLayerVisible(b, !0),
            this.lyrProximity.setVisibility(!0),
            0 < this.incidents.length &&
              (b.proximityInfo &&
                b.proximityInfo.container &&
                ((b.proximityInfo.container.innerHTML = ""),
                g.add(b.proximityInfo.container, "loading")),
              !1 === b.updateFlag && this.lyrProximity.clear(),
              b.proximityInfo.updateForIncident(
                this.incidents,
                this.buffers,
                this.lyrProximity
              ));
      }
      b.updateFlag = !1;
    },
    _setLayerVisible: function(a, b) {
      this.disableVisibilityManagement ||
        (a.tabLayers &&
          B.forEach(a.tabLayers, function(c) {
            "undefined" !== typeof c.visible && c.setVisibility(b);
            a &&
              a.jimuLayerInfo &&
              a.jimuLayerInfo.setTopLayerVisible &&
              a.jimuLayerInfo.setTopLayerVisible(b);
          }));
    },
    _drawIncident: function(a, b, c, d) {
      var e = new J();
      a = Array.isArray(a) ? a : [a];
      for (var f = !1, g = [], h = [], k = [], l = 0; l < a.length; l++) {
        var m = a[l],
          n = m.geometry.type;
        null === this.symPoint && this._getStyleColor();
        "point" === n && ((d = !0), this._getIncidentAddress(m.geometry));
        f =
          "polyline" === n
            ? this.isLineEditable
            : "polygon" === n
            ? this.isPolyEditable
            : this.isPointEditable;
        d ? k.push(m.geometry) : g.push(this._updateGeom(m.geometry));
        h.push({
          symbol:
            "polyline" === n
              ? this.symLine
              : "polygon" === n
              ? this.symPoly
              : this.symPoint,
          attributes: m.attributes,
          infoTemplate: m.infoTemplate
        });
      }
      d
        ? (this._drawIncidentComplete(k, h, f, b, c), e.resolve())
        : new O(g).then(
            w.hitch(this, function(a) {
              B.forEach(a, function(a) {
                k.push(a[1]);
              });
              this._drawIncidentComplete(k, h, f, b, c);
              e.resolve();
            })
          );
      return e;
    },
    _drawIncidentComplete: function(a, b, c, d, e) {
      for (var f = 0; f < a.length; f++) {
        var g = b[f],
          g = new P(a[f], g.symbol, g.attributes, g.infoTemplate);
        this.incidents.push(g);
        this.lyrIncidents.add(g);
      }
      this._updatePanel(c);
      this.toolbar.deactivate();
      this._clickIncidentsButton(-1);
      this._bufferIncident(d, e);
      this.clearIncident.focus();
    },
    _updatePanel: function(b) {
      this.div_reversed_address.innerHTML = "";
      a.setStyle(this.div_reverse_geocoding, "display", "none");
      this.saveEnabled &&
        (g.remove(this.saveButton, "display-off"),
        (b = b && this.userCanSave) &&
          g.contains(this.saveButton, "btnDisabled") &&
          (g.remove(this.saveButton, "btnDisabled"),
          E.set(this.saveButton, "tabindex", "0")),
        g.add(this.saveButton, b ? "displayT" : "displayT btnDisabled"));
      g.remove(this.saveOptions, "display-off");
      g.add(this.saveOptions, "displayT");
      g.remove(this.borderCol, "display-off");
      g.add(this.borderCol, "display-on");
      g.remove(this.clearIncident, "display-off");
      g.add(this.clearIncident, "display-on");
    },
    _updateGeom: function(a) {
      var b = new J(),
        c = a.spatialReference;
      this.config.drawGeodesic
        ? this._getGeographicGeom(a).then(
            w.hitch(this, function(d) {
              d = X.geodesicDensify(d, 5e3);
              if (I.canProject(d, c)) b.resolve(I.project(d, c));
              else if (this.transformation) {
                var e = new z();
                e.outSR = c;
                e.geometries = [d];
                isNaN(this.transformation) || (e.transformForward = !1);
                e.transformation = this.transformation;
                try {
                  this.gsvc.project(
                    e,
                    w.hitch(this, function(a) {
                      b.resolve(a[0]);
                    })
                  );
                } catch (va) {
                  console.log(va), b.resolve(a);
                }
              } else b.resolve(a);
            }),
            w.hitch(this, function(c) {
              console.log(c);
              b.resolve(a);
            })
          )
        : b.resolve(a);
      return b;
    },
    _getIncidentAddress: function(a) {
      this.incidentPoint = a;
      this.map.graphics.clear();
      this._getGeographicGeom(a).then(
        w.hitch(this, function(a) {
          this.locator.locationToAddress(a, 100);
        }),
        function(a) {
          console.log(a);
        }
      );
    },
    _getGeographicGeom: function(a) {
      var b = new J(),
        c = new V(3857);
      I.canProject(a, c)
        ? b.resolve(I.webMercatorToGeographic(I.project(a, c)))
        : ((c = T.buffer(a, 100, 9001)),
          (c = {
            url: this.gsvc.url + "/findTransformations",
            content: {
              f: "json",
              inSR: a.spatialReference.wkid,
              outSR: 4326,
              extentOfInterest: C.stringify(c.getExtent().toJson())
            },
            handleAs: "json",
            callbackParamName: "callback"
          }),
          na(c, { usePost: !1 }).then(
            w.hitch(this, function(c) {
              (c = c && c.transformations ? c.transformations : void 0) &&
                0 < c.length &&
                (this.transformation = c[0].wkid
                  ? c[0].wkid
                  : c[0].geoTransforms
                  ? c[0]
                  : void 0);
              c = new z();
              c.outSR = new V(4326);
              c.geometries = [a];
              c.transformation = this.transformation;
              try {
                this.gsvc.project(
                  c,
                  w.hitch(this, function(a) {
                    b.resolve(a[0]);
                  })
                );
              } catch (ua) {
                console.log(ua), b.resolve(a);
              }
            }),
            w.hitch(this, function(a) {
              b.reject(a);
            })
          ));
      return b;
    },
    _showIncidentAddress: function(b) {
      if (b.address.address) {
        var c = b.address.address.Address,
          d = new aa();
        d.family = "Arial";
        d.size = "18px";
        d = new ba(c, d, new M("#000000"));
        d.setOffset(20, -4);
        d.horizontalAlignment = "left";
        this.map.graphics.add(new P(this.incidentPoint, d, {}));
        this.div_reversed_address.innerHTML =
          c +
          "\x3c/br\x3e" +
          b.address.address.City +
          ", " +
          b.address.address.Region +
          " " +
          b.address.address.Postal;
        a.setStyle(this.div_reverse_geocoding, "display", "block");
      }
    },
    _onAddressError: function() {
      this.div_reversed_address.innerHTML = this.nls.reverse_geocoded_error;
      a.setStyle(this.div_reverse_geocoding, "display", "block");
    },
    _bufferIncident: function(a, b) {
      var c = new J();
      if (0 !== this.incidents.length && this.spinnerValue.validate()) {
        for (var d = 0; d < this.config.tabs.length; d++)
          this.config.tabs[d].updateFlag = !0;
        this.buffers = [];
        this.lyrBuffer.clear();
        for (var e = !1, d = [], f = 0; f < this.incidents.length; f++) {
          var g = this.incidents[f],
            h = this.spinnerValue.get("value"),
            k = this.config.distanceSettings[this.config.distanceUnits];
          if (0 < h) {
            var l = g.geometry.spatialReference.wkid,
              m;
            this.config.drawGeodesic
              ? 4326 === l || g.geometry.spatialReference.isWebMercator()
                ? ((m = T.geodesicBuffer(g.geometry, h, k)),
                  this.buffers.push(m))
                : d.push(this._updateGeom(g.geometry))
              : ((m = T.buffer(g.geometry, h, k)), this.buffers.push(m));
          } else
            (a = !1),
              (g = g.geometry.type),
              "polyline" !== g || e || (e = this.isLineEditable),
              "polygon" !== g || e || (e = this.isPolyEditable),
              "point" !== g || e || (e = this.isPointEditable);
        }
        0 < d.length
          ? new O(d).then(
              w.hitch(this, function(d) {
                B.forEach(
                  d,
                  w.hitch(this, function(a) {
                    m = T.geodesicBuffer(a[1], h, k);
                    this.buffers.push(m);
                  })
                );
                this._useBuffers(a, b, e);
                c.resolve();
              })
            )
          : (this._useBuffers(a, b, e), c.resolve());
        return c;
      }
    },
    _useBuffers: function(a, b, c) {
      0 < this.buffers.length
        ? (this.saveEnabled &&
            (g.remove(this.saveButton, "display-off"),
            g.contains(this.saveButton, "btnDisabled") &&
              this.isPolyEditable &&
              this.userCanSave &&
              (g.remove(this.saveButton, "btnDisabled"),
              E.set(this.saveButton, "tabindex", "0")),
            g.add(this.saveButton, "displayT")),
          this._handleBuffers(this.symPoly, a))
        : (this.saveEnabled &&
            (c && this.userCanSave
              ? g.contains(this.saveButton, "btnDisabled") &&
                (g.remove(this.saveButton, "btnDisabled"),
                E.set(this.saveButton, "tabindex", "0"))
              : (g.add(this.saveButton, "btnDisabled"),
                E.set(this.saveButton, "tabindex", "-1"))),
          this.zoomToIncidents(b));
      setTimeout(
        w.hitch(this, function() {
          G(".noFeaturesActive", this.domNode).forEach(function(a) {
            E.set(a, "tabindex", "-1");
          });
          this._getLastNodeForEachTab(0);
        }),
        100
      );
    },
    _handleBuffers: function(a, b) {
      this.bufferLookUp = [];
      for (var c = 0; c < this.buffers.length; c++) {
        var d = new P(this.buffers[c], a);
        this.lyrBuffer.add(d);
        this.bufferLookUp[c] = d;
      }
      b || this._locateBuffer(T.union(this.buffers));
      this._performAnalysis();
    },
    _performAnalysis: function() {
      this._updateCounts(!1);
      this._toggleTabLayersNew(this.curTab);
    },
    _updateCounts: function(a) {
      for (var b = [], c = 0; c < this.config.tabs.length; c++) {
        a && 0 < c && this.panelNodes[c] && (this.panelNodes[c].innerHTML = "");
        var d = this.config.tabs[c],
          e = this.tabNodes[c],
          f = null,
          g = !1;
        d.advStat &&
          d.advStat.stats &&
          ("undefined" !== typeof d.advStat.stats.tabCount
            ? (g = d.advStat.stats.tabCount)
            : d.advStat.stats.count && (g = !0));
        "proximity" === d.type
          ? (f = d.proximityInfo)
          : "closest" === d.type
          ? (f = d.closestInfo)
          : "summary" === d.type
          ? (f = d.summaryInfo)
          : "groupedSummary" === d.type && (f = d.groupedSummaryInfo);
        f &&
          (a
            ? ("undefined" !== typeof f.incidentCount && (f.incidentCount = 0),
              f.updateTabCount(0, e, g))
            : b.push(f.queryTabCount(this.incidents, this.buffers, e, g)));
      }
      new O(b).then(
        w.hitch(this, function(a) {
          for (var b = 0, c = 0; c < a.length; c++) {
            var d = a[c][1];
            isNaN(d) || (b += d);
          }
          this._updateBtnState(this.downloadAllButon, "btnDisabled", b);
          this.userCanSnapshot &&
            this._updateBtnState(this.createSnapshotButton, "btnDisabled", b);
          this._getLastNodeForEachTab(0);
        })
      );
    },
    _updateBtnState: function(a, b, c) {
      a &&
        (0 === c
          ? (g.add(a, b), E.set(a, "tabindex", "-1"))
          : g.contains(a, b) && (g.remove(a, b), E.set(a, "tabindex", "0")));
    },
    _verifyRouting: function() {
      if (this.config.enableRouting) {
        this.config.enableRouting = !1;
        var a = this.appConfig.getConfigElementsByName("Directions");
        B.forEach(
          a,
          w.hitch(this, function(a) {
            "Directions" === a.name &&
              ((this.dirConfig = a), (this.config.enableRouting = !0));
          })
        );
      }
    },
    _getAttributeTable: function() {
      var a = this.appConfig.getConfigElementsByName("AttributeTable");
      B.forEach(
        a,
        w.hitch(this, function(a) {
          "AttributeTable" === a.name && (this.attributeTable = a);
        })
      );
    },
    zoomToIncidents: function(a) {
      var b,
        c = !1;
      if (0 < this.incidents.length) {
        var d;
        1 < this.buffers.length
          ? (d = T.union(this.buffers))
          : 1 === this.buffers.length && (d = this.buffers[0]);
        b = this.incidents;
        var e;
        d && ((c = !0), (e = new P(d, d.spatialReference)), b.push(e));
        this.geomExtent = Y.graphicsExtent(this.incidents);
        e && e.destroy && e.destroy();
      }
      "undefined" === typeof a &&
        (this.geomExtent
          ? this.map.setExtent(this.geomExtent.expand(1.5))
          : b &&
            ((a =
              b[0].geometry && "point" === b[0].geometry.type
                ? b[0].geometry
                : b[0].geometry.getCentroid()),
            this.map.centerAndZoom(a, this.config.defaultZoomLevel)));
      if (!c) {
        for (a = 0; a < this.incidents.length; a++)
          if ("polygon" === this.incidents[a].geometry.type) {
            c = !0;
            break;
          }
        this._performAnalysis();
      }
      c && this._performAnalysis();
    },
    zoomToLocation: function(a) {
      var b;
      if (0.5 === this.config.defaultZoomLevel) {
        var c;
        if (0 < this.buffers.length) c = T.union(this.buffers)._extent;
        else if (0 < this.incidents.length) {
          for (
            var d = [], e = [], f = [], g = 0;
            g < this.incidents.length;
            g++
          ) {
            var h = this.incidents[g];
            switch (h.geometry.type) {
              case "point":
                d.push(h.geometry._extent);
                break;
              case "polyline":
                e.push(h.geometry);
                break;
              case "polygon":
                f.push(h.geometry);
            }
          }
          g = [];
          0 < d.length && g.push(T.union(d)._extent);
          0 < e.length && g.push(T.union(e)._extent);
          0 < f.length && g.push(T.union(f)._extent);
          1 < g.length
            ? (c = T.union(g)._extent)
            : 1 === g.length &&
              (1 < d.length || 0 < e.length || 0 < f.length) &&
              (c = g[0]);
        }
        c && (b = c.expand(0.5));
      }
      "undefined" === typeof a && (a = b.getCentroid());
      b && this.map.setExtent(b);
      this.map.centerAt(a);
    },
    routeToIncident: function(a) {
      var b = this.incidents[0].geometry,
        c = b;
      "point" !== b.type && (c = null);
      this.stops = [c, a];
      this.widgetManager.triggerWidgetOpen(this.dirConfig.id).then(
        w.hitch(this, function(a) {
          if (a && "closed" !== a.state) {
            var b = a._dijitDirections;
            b
              ? this._addStops(b)
              : a.getDirectionsDijit().then(
                  w.hitch(this, function(a) {
                    this._addStops(a);
                  })
                );
          }
        })
      );
    },
    _addStops: function(a) {
      a.clearDirections();
      a.removeStops();
      a.reset();
      a.addStops(this.stops);
    },
    _getTabLayers: function(a) {
      var b = [];
      B.forEach(
        this.opLayers._layerInfos,
        w.hitch(this, function(c) {
          if (0 < c.newSubLayers.length)
            this._recurseOpLayers(c.newSubLayers, b, a);
          else {
            var d = this.hasLayerTitle ? c.id : c.title;
            if (Array.isArray(a) ? -1 < a.indexOf(d) : a === d)
              b.push(c.layerObject),
                "undefined" === typeof c.layerObject.visible ||
                  c.layerObject.visible ||
                  (c.layerObject.setVisibility(!0),
                  c.layerObject.setVisibility(!1));
          }
        })
      );
      return b;
    },
    _recurseOpLayers: function(a, b, c) {
      B.forEach(
        a,
        w.hitch(this, function(a) {
          if (0 < a.newSubLayers.length)
            this._recurseOpLayers(a.newSubLayers, b, c);
          else {
            var d = this.hasLayerTitle ? a.id : a.title;
            (Array.isArray(c) ? -1 < c.indexOf(d) : c === d) &&
              b.push(a.layerObject);
          }
        })
      );
    },
    _setupSymbols: function() {
      var a;
      a = this.config.selectionColor
        ? b.fromString(this.config.selectionColor)
        : b.fromString(this.config.color);
      var c = a.toRgb();
      c.push(0.2);
      var d = b.fromString("#000000");
      a = b.blendColors(a, d, 0.2).toRgb();
      d = new L(L.STYLE_SOLID, new b([255, 255, 255, 0.25]), 1);
      this.symPoint = new W(
        W.STYLE_CIRCLE,
        20,
        d,
        new b([a[0], a[1], a[2], 0.7])
      );
      this.symLine = new L(L.STYLE_SOLID, new b([a[0], a[1], a[2], 0.7]), 3);
      this.symPoly = new S(
        S.STYLE_SOLID,
        this.symLine,
        new b([a[0], a[1], a[2], 0.3])
      );
      this.symBuffer = new S(S.STYLE_SOLID, d, new b(c));
      this.symSelection = new S(
        S.STYLE_NULL,
        new L(L.STYLE_SOLID, new b([0, 255, 255]), 2),
        new b([0, 0, 0, 0])
      );
    },
    onReceiveData: function(a, b, c) {
      null !== c &&
        c.eventType &&
        ("IncidentLocationAdd" === c.eventType
          ? c.dataValue &&
            null !== c.dataValue &&
            (this._clickTab(0),
            null === this.symPoint
              ? (this.dataValue = c.dataValue)
              : this._drawIncident(c.dataValue, void 0, void 0, !0))
          : "IncidentLocationRemove" === c.eventType
          ? ((a = this.incidents.indexOf(c.removeGraphic)),
            this.incidents.splice(a, 1),
            this.lyrIncidents.remove(c.removeGraphic),
            this.bufferLookUp &&
              0 < this.bufferLookUp.length &&
              (this.lyrBuffer.remove(this.bufferLookUp[a]),
              this.bufferLookUp.splice(a, 1)),
            this.buffers &&
              0 < this.buffers.length &&
              this.buffers.splice(a, 1),
            this.incidents && 0 < this.incidents.length
              ? ((this.config.tabs[this.curTab].updateFlag = !0),
                this._performAnalysis())
              : this._clear(!1))
          : "WebMapChanged" === c.eventType && this._storeIncidents());
    },
    _storeIncidents: function() {
      if (0 < this.incidents.length) {
        for (var a = [], b = 0; b < this.incidents.length; b++)
          a.push(C.stringify(this.incidents[b].geometry.toJson()));
        a = {
          location: C.stringify(a),
          hasBuffer: 0 < this.lyrBuffer.graphics.length,
          buffer_dist: this.spinnerValue.get("value"),
          unit: this.config.distanceUnits,
          curTab: this.curTab,
          extent: C.stringify(this.map.extent.toJson())
        };
        a = C.stringify(a);
        window.localStorage.setItem(this.Incident_Local_Storage_Key, a);
        console.log("Incident saved to storage");
      }
    },
    _restoreIncidents: function() {
      var a = window.localStorage.getItem(this.Incident_Local_Storage_Key);
      if (null !== a && "null" !== a) {
        window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
        var b = C.parse(a, !0),
          c = b.buffer_dist,
          d = C.parse(b.location);
        this.curTab = b.curTab;
        for (var a = [], e = 0; e < d.length; e++)
          a.push({ geometry: K.fromJson(C.parse(d[e])) });
        this.spinnerValue.set("value", c);
        for (c = 0; c < this.config.tabs.length; c++)
          this.config.tabs[c].restore = !0;
        this._drawIncident(a, !0, !0, !0).then(
          w.hitch(this, function() {
            this._clickTab(0, !0);
            this._toggleTabs(b.curTab);
            this._toggleTabLayers(b.curTab);
            this.curTab = b.curTab;
            this._clickIncidentsButton(-1);
            this._updateW();
            var a = K.fromJson(C.parse(b.extent));
            T.equals(a, this.map.extent) || this.map.setExtent(a, !1);
          })
        );
      } else
        g.remove(this.saveOptions, "displayT"),
          g.add(this.saveOptions, "display-off"),
          g.remove(this.borderCol, "display-on"),
          g.add(this.borderCol, "display-off"),
          g.remove(this.clearIncident, "display-on"),
          g.add(this.clearIncident, "display-off");
    },
    _updateW: function() {
      for (var a = 0, b = 0; b < this.tabNodes.length; b++)
        a += D.position(this.tabNodes[b]).w;
      a += 10;
      k.set(this.tabsNode, "width", a + "px");
      a > D.position(this.footerNode).w &&
        (k.set(this.footerContentNode, window.isRTL ? "left" : "right", "58px"),
        k.set(this.panelRight, "display", "block"));
    },
    _mapResize: function() {
      var a = k.getComputedStyle(this.map.container);
      if (a) {
        var b = this._getSAPanelHeight(),
          a = parseFloat(a.bottom.replace("px", ""));
        if ("opened" === this.state || "active" === this.state) {
          var c = this._getAttributeTableHeight();
          c > b && (b = c);
          a <= b && A.publish("changeMapPosition", { bottom: b });
        }
      }
    },
    _onMapPositionChange: function(a) {
      a &&
        ((this.left = a.left),
        (this.right = a.right),
        isFinite(this.left) &&
          "number" === typeof this.left &&
          k.set(
            this.domNode,
            window.isRTL ? "right" : "left",
            parseFloat(this.left) + "px"
          ),
        isFinite(this.right) &&
          "number" === typeof this.right &&
          k.set(
            this.domNode,
            window.isRTL ? "left" : "right",
            parseFloat(this.right) + "px"
          ));
      this._onPanelScroll();
    },
    _resetMapPosition: function() {
      A.publish("changeMapPosition", {
        bottom: this._getAttributeTableHeight()
      });
    },
    _getSAPanelHeight: function() {
      var a = parseInt(this.position.height.toString().replace("px", ""), 10),
        b = parseInt(this.position.bottom.toString().replace("px", ""), 10);
      return a + b;
    },
    _getAttributeTableHeight: function() {
      var a = parseInt(this.position.bottom.toString().replace("px", ""), 10);
      if (this.attributeTable) {
        var b = n.byId(this.attributeTable.id);
        b &&
          (b = k.getComputedStyle(b)) &&
          b.height &&
          (a += parseInt(b.height.toString().replace("px", ""), 10));
      }
      return a;
    },
    _resize: function(a) {
      try {
        this._onPanelScroll(this.curTab),
          this.hideContainer && this._handlePopup(),
          this._clearMobileSetAsIncidentStyle(),
          this._resetInfoWindow(),
          this._initEditInfo(),
          this._checkHideContainer();
      } catch (ta) {
        console.log(ta);
      }
    },
    _onPanelScroll: function(a) {
      var b, c, d, e;
      a = this.footerContentNode.getBoundingClientRect();
      for (var f = 0; f < this.tabsNode.children.length; f++)
        if (
          ((e = this.tabsNode.children[f]),
          (e = e.getBoundingClientRect()),
          (e = window.isRTL ? e.right : e.left),
          0 <= e)
        ) {
          b = f;
          d = e;
          break;
        }
      for (f = 0; f < this.tabsNode.children.length; f++)
        if (
          ((e = this.tabsNode.children[f]),
          (e = e.getBoundingClientRect()),
          (window.isRTL ? e.left : e.right) > (window.isRTL ? a.left : a.right))
        ) {
          c = f;
          break;
        }
      a = this.footerContentNode;
      c = c <= this.tabsNode.children.length;
      k.set(a, window.isRTL ? "left" : "right", c ? "58px" : "24px");
      k.set(this.panelRight, "display", c ? "block" : "none");
      c = 0;
      "TabTheme" === this.appConfig.theme.name &&
        (c += window.isRTL ? this.right : this.left);
      b = 1 <= b || d < c;
      k.set(a, window.isRTL ? "right" : "left", b ? "34px" : "0px");
      k.set(this.panelLeft, "display", b ? "block" : "none");
      k.set(this.panelLeft, "width", b ? "34px" : "0px");
    },
    _scrollToTab: function(a) {
      var b = D.position(this.footerContentNode).w;
      if (D.position(this.tabsNode).w > b) {
        var c = D.getMarginBox(this.tabNodes[a]);
        this.footerContentNode.scrollLeft = c.l - (b - c.w) / 2;
      }
      this._onPanelScroll(a);
    },
    _navLeft: function(a) {},
    _navRight: function(a) {},
    _navTabsLeft: function(a) {
      this._navTabs(!1);
    },
    _navTabsRight: function(a) {
      this._navTabs(!0);
    },
    _navTabs: function(a) {
      for (
        var b = this.footerContentNode.getBoundingClientRect(), c = 0;
        c < this.tabsNode.children.length;
        c++
      ) {
        var d = this.tabsNode.children[c].getBoundingClientRect();
        if (a) {
          if (d.right > b.right) {
            this._scrollToTab(c);
            break;
          }
        } else if (0 < d.right) {
          this._scrollToTab(c);
          break;
        }
      }
    },
    _storeInitalVisibility: function() {
      B.forEach(
        this.config.tabs,
        w.hitch(this, function(a) {
          B.forEach(
            a.tabLayers,
            w.hitch(this, function(b) {
              "undefined" !== typeof b.visible &&
                (!b.id ||
                  b.id in this.initalLayerVisibility ||
                  (this.initalLayerVisibility[b.id] = b.visible),
                b.setVisibility(!1));
              a &&
                a.jimuLayerInfo &&
                a.jimuLayerInfo.setTopLayerVisible &&
                ((b = a.jimuLayerInfo.isShowInMap()),
                this.initalLayerVisibility.hasOwnProperty(a.jimuLayerInfo.id) ||
                  (this.initalLayerVisibility[a.jimuLayerInfo.id] = b),
                b && a.jimuLayerInfo.setTopLayerVisible(!1));
            })
          );
        })
      );
    },
    _resetInitalVisibility: function() {
      B.forEach(
        this.config.tabs,
        w.hitch(this, function(a) {
          B.forEach(
            a.tabLayers,
            w.hitch(this, function(b) {
              "undefined" !== typeof b.visible &&
                b.id &&
                b.id in this.initalLayerVisibility &&
                (b.setVisibility(this.initalLayerVisibility[b.id]),
                b.hasOwnProperty("visible") &&
                  (b.visible = this.initalLayerVisibility[b.id]),
                b.redraw ? b.redraw() : b.refresh && b.refresh());
              a &&
                a.jimuLayerInfo &&
                a.jimuLayerInfo.setTopLayerVisible &&
                a.jimuLayerInfo.isShowInMap() !==
                  this.initalLayerVisibility[a.jimuLayerInfo.id] &&
                a.jimuLayerInfo.setTopLayerVisible(
                  this.initalLayerVisibility[a.jimuLayerInfo.id]
                );
            })
          );
        })
      );
      this.initalLayerVisibility = [];
    },
    _clearGraphics: function() {
      B.forEach(
        this.config.tabs,
        w.hitch(this, function(a) {
          if ("summary" === a.type && a.tabLayers && 1 < a.tabLayers.length)
            for (var b = 1; b < a.tabLayers.length; b++) a.tabLayers.pop();
        })
      );
    },
    _resetInfoWindow: function() {
      this.defaultPointContent &&
        this.pointEditLayer.infoTemplate.setContent(this.defaultPointContent);
      this.defaultLineContent &&
        this.lineEditLayer.infoTemplate.setContent(this.defaultLineContent);
      this.defaultPolyContent &&
        this.polyEditLayer.infoTemplate.setContent(this.defaultPolyContent);
      this.defaultPopupSize &&
        this.map.infoWindow.resize(this.defaultPopupSize.width, "auto");
      this.map.infoWindow.isShowing && this.map.infoWindow.hide();
    },
    _close: function() {
      this.widgetManager.closeWidget(this.id);
    },
    _downloadAll: function() {
      for (
        var a = this.downloadAllButon.classList
            ? this.downloadAllButon.classList
            : this.downloadAllButon.className.split(" "),
          b = !0,
          c = 0;
        c < a.length;
        c++
      )
        if ("btnDisabled" === a[c]) {
          b = !1;
          break;
        }
      b &&
        (this._updateProcessing(this.downloadAllButon, !0, this.downloadAllSrc),
        this._verifyIncident(!1) &&
          ((a = this._getAnalysisObjects()),
          new ea(this).createDownloadZip(a, this.incidents, this.buffers).then(
            w.hitch(this, function(a) {
              this._updateProcessing(
                this.downloadAllButon,
                !1,
                this.downloadAllSrc
              );
            }),
            function(a) {
              this._updateProcessing(
                this.downloadAllButon,
                !1,
                this.downloadAllSrc
              );
              new m({ message: a.message });
            }
          )));
    },
    _updateProcessing: function(b, c, d) {
      a.setAttr(b, "src", c ? this.processingSrc : d);
    },
    _getAnalysisObjects: function() {
      var a = ["proximity", "closest", "summary", "groupedSummary"],
        b = [];
      B.forEach(this.config.tabs, function(c) {
        if (-1 < a.indexOf(c.type)) {
          var d;
          switch (c.type) {
            case "proximity":
              d = c.proximityInfo;
              break;
            case "closest":
              d = c.closestInfo;
              break;
            case "summary":
              d = c.summaryInfo;
              break;
            case "groupedSummary":
              d = c.groupedSummaryInfo;
          }
          var e = "undefined" !== typeof c.layerTitle ? c.layerTitle : c.layers;
          b.push({
            layerObject: c.tabLayers[0],
            label: "" !== c.label ? c.label : e,
            analysisObject: d,
            type: c.type
          });
        }
      });
      return b.reverse();
    },
    _verifyIncident: function(a, b) {
      if (0 === this.buffers.length) {
        for (var c = !1, d = 0; d < this.incidents.length; d++)
          if ("polygon" === this.incidents[d].geometry.type) {
            c = !0;
            break;
          }
        c ||
          (c =
            0 <
              this.config.tabs.filter(function(a) {
                return "closest" === a.type;
              }).length && 0 < parseInt(this.config.maxDistance, 10));
        c ||
          (new m({
            message: a
              ? this.nls.notPolySnapShot
              : b
              ? this.nls.notPolyReport
              : this.nls.notValidDownload
          }),
          this._updateProcessing(
            a
              ? this.createSnapshotButton
              : b
              ? this.createReportButton
              : this.downloadAllButon,
            !1,
            a ? this.snapshotSrc : b ? this.reportSrc : this.downloadAllSrc
          ));
        return c;
      }
      return !0;
    },
    _createSnapshot: function() {
      for (
        var a = this.createSnapshotButton.classList
            ? this.createSnapshotButton.classList
            : this.createSnapshotButton.className.split(" "),
          b = !0,
          c = 0;
        c < a.length;
        c++
      )
        if ("btnDisabled" === a[c]) {
          b = !1;
          break;
        }
      b &&
        this._verifyIncident(!0) &&
        this._getName("snapshot").then(
          w.hitch(this, function(a) {
            if (a && "cancel" !== a) {
              this._updateProcessing(
                this.createSnapshotButton,
                !0,
                this.snapshotSrc
              );
              var b = [];
              0 < this.buffers.length &&
                b.push({
                  graphics: this.lyrBuffer.graphics,
                  label:
                    1 < this.buffers.length ? this.nls.buffers : this.nls.buffer
                });
              b.push({
                graphics: this.incidents,
                label:
                  1 < this.incidents.length
                    ? this.nls.incidents
                    : this.nls.incident
              });
              new ea(this)
                .createSnapShot({
                  layers: b.concat(this._getAnalysisObjects()),
                  incidents: this.incidents,
                  buffers: this.buffers,
                  time: Date.now(),
                  name: a.name,
                  groups: a.groups
                })
                .then(
                  w.hitch(this, function(a) {
                    this._updateProcessing(
                      this.createSnapshotButton,
                      !1,
                      this.snapshotSrc
                    );
                  }),
                  w.hitch(this, function(a) {
                    this._updateProcessing(
                      this.createSnapshotButton,
                      !1,
                      this.snapshotSrc
                    );
                    new m({ message: a.message });
                  })
                );
            } else
              this._updateProcessing(
                this.createSnapshotButton,
                !1,
                this.snapshotSrc
              );
            this.createSnapshotButton.focus();
          })
        );
    },
    _initReportDijit: function(a) {
      var b = "";
      a.logo &&
        ((b = a.logo),
        (b =
          -1 < b.indexOf("${appPath}")
            ? H.substitute(b, {
                appPath: this.folderUrl.slice(
                  0,
                  this.folderUrl.lastIndexOf("widgets")
                )
              })
            : b));
      this.reportDijit = new l({
        alignNumbersToRight: window.isRTL,
        reportLogo: b,
        appConfig: this.appConfig,
        footNotes: a.footnote,
        printTaskUrl: a.printTaskURL,
        reportLayout: a.reportLayout,
        styleSheets: [this.folderUrl + "/css/reportDijitOverrides.css"],
        styleText:
          ".esriCTTable th{background-color: " +
          a.textColor +
          "; color: " +
          this.getTextColor(a.textColor) +
          ";} .esriCTSectionTitle{color: black;} .esriCTHTMLData{height:100%;}",
        maxNoOfCols: 7
      });
      this.own(
        c(
          this.reportDijit,
          "reportError",
          w.hitch(this, function() {
            new m({ message: window.jimuNls.common.error });
          })
        )
      );
    },
    getTextColor: function(a) {
      a = new y(a).toRgb();
      return 0.5 > 1 - (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) / 255
        ? "#000"
        : "#fff";
    },
    _getName: function(a) {
      var b = new J(),
        d = new sa({
          nls: this.nls,
          type: a,
          pageUtils: x,
          storedProps: this._getStoredPropData("SA-REPORT-PROPS"),
          portalUrl: this.appConfig.portalUrl
        }),
        e = new la({
          autoHeight: !0,
          content: d,
          titleLabel:
            "report" === a ? this.nls.report_name : this.nls.snapshot_name,
          invalidMessage:
            "report" === a
              ? this.nls.invalid_report_name
              : this.nls.invalid_snapshot_name
        });
      d.initWidth();
      this.own(
        c(
          d,
          "ok",
          w.hitch(this, function(a) {
            d.destroy();
            d = null;
            e.close();
            this._storePropData("SA-REPORT-PROPS", a);
            b.resolve(a);
          })
        )
      );
      this.own(
        c(
          d,
          "cancel",
          w.hitch(this, function() {
            d.destroy();
            d = null;
            e.close();
            b.resolve("cancel");
          })
        )
      );
      return b;
    },
    _storePropData: function(a, b) {
      window.localStorage.setItem(a, C.stringify(b));
    },
    _getStoredPropData: function(a) {
      return window.localStorage.getItem(a);
    },
    _createReport: function() {
      this.reportEnabled &&
        this._verifyIncident(!1, !0) &&
        (this._updateProcessing(this.createReportButton, !0, this.reportSrc),
        this._getReportData().then(
          w.hitch(this, function(a) {
            this._updateProcessing(this.createReportButton, !1, this.reportSrc);
            this._getName("report").then(
              w.hitch(this, function(b) {
                if (b && "cancel" !== b) {
                  this._updateProcessing(
                    this.createReportButton,
                    !0,
                    this.reportSrc
                  );
                  this._initReportDijit(w.mixin(this.config.reportSettings, b));
                  for (var c, d = 0; d < a.length; d++) {
                    var e = a[d];
                    if ("map" === e.type) {
                      c = d;
                      e.printTemplate = this._getPrintTemplate();
                      break;
                    }
                  }
                  b.comments &&
                    "" !== b.comments &&
                    a.splice(c + 1, 0, {
                      type: "html",
                      data:
                        "\x3cp style\x3d'white-space: pre-wrap;'\x3e" +
                        b.comments +
                        "\x3c/p\x3e"
                    });
                  this.reportDijit.maxNoOfCols =
                    "Landscape" === b.reportLayout.orientation.Type ? 12 : 7;
                  this.reportDijit.print(b.name, a);
                }
                this._updateProcessing(
                  this.createReportButton,
                  !1,
                  this.reportSrc
                );
                this.createReportButton.focus();
              })
            );
          })
        ));
    },
    _getReportData: function(a) {
      var b = new J(),
        c = [];
      c.push({ addPageBreak: !0, type: "map", map: this.map });
      a = this._getAnalysisObjects().reverse();
      var d = this.nls;
      new ea(this)
        ._performAnalysis(a, this.incidents, this.buffers, !1, !0)
        .then(
          function(a) {
            B.forEach(
              a,
              w.hitch(this, function(a) {
                if (a) {
                  var b = [],
                    e = [],
                    f = [];
                  if (
                    !a.context.tab.advStat.hasOwnProperty(
                      "analysisSummaryForReport"
                    ) ||
                    (a.context.tab.advStat.hasOwnProperty(
                      "analysisSummaryForReport"
                    ) &&
                      a.context.tab.advStat.analysisSummaryForReport)
                  ) {
                    for (
                      var g = a.context.tab.type,
                        h =
                          "summary" === g
                            ? d.summary
                            : "closest" === g
                            ? d.closest
                            : "proximity" === g
                            ? d.proximity
                            : d.groupedSummary,
                        k =
                          "proximity" === g
                            ? a.reportResults
                            : a.analysisResults,
                        l = 0;
                      l < k.length;
                      l++
                    ) {
                      var m = k[l];
                      if ("summary" !== g && "groupedSummary" !== g)
                        (f = []),
                          0 === l &&
                            B.forEach(m, function(a) {
                              b.push(a.label);
                            }),
                          B.forEach(m, function(a) {
                            f.push(a.value);
                          }),
                          e.push(f);
                      else if ("summary" === g) {
                        var n = [];
                        B.forEach(a.context.calcFields, function(a) {
                          n.push(a.alias ? a.alias : a.field);
                        });
                        0 < n.length &&
                          -1 < n.indexOf(m.info.replace("\x3cbr/\x3e", "")) &&
                          (b.push(m.info.replace("\x3cbr/\x3e", "")),
                          f.push(m.num));
                      } else
                        b.push(
                          -1 === ["", null, void 0].indexOf(m.a)
                            ? m.a + " " + m.info
                            : m.info
                        ),
                          f.push(m.total);
                    }
                    ("summary" !== g && "groupedSummary" !== g) || e.push(f);
                    c.push({
                      title: a.context.baseLabel + " (" + h + ")",
                      addPageBreak: !1,
                      type: "table",
                      data: { cols: b, rows: e }
                    });
                  }
                  if (
                    !a.context.tab.advStat.hasOwnProperty(
                      "PopUpSummaryForReport"
                    ) ||
                    (a.context.tab.advStat.hasOwnProperty(
                      "PopUpSummaryForReport"
                    ) &&
                      a.context.tab.advStat.PopUpSummaryForReport)
                  ) {
                    var q = {},
                      b = [],
                      e = [],
                      f = [],
                      g = ha.getPopupFields(a.context.tab);
                    if (0 < g.length) {
                      B.forEach(g, function(a) {
                        q[a.expression] = a.label;
                      });
                      for (g = 0; g < a.graphics.length; g++) {
                        var f = [],
                          r = a.graphics[g].attributes,
                          h = Object.keys(r);
                        0 === g &&
                          B.forEach(h, function(a) {
                            q.hasOwnProperty(a) && b.push(q[a]);
                          });
                        B.forEach(h, function(b) {
                          q.hasOwnProperty(b) &&
                            f.push(
                              ha.getFieldValue(
                                b,
                                r[b],
                                a.context.specialFields,
                                a.context.dateFields,
                                a.context.defaultDateFormat,
                                a.context.typeIdField,
                                a.context.types,
                                a.context.layerObject &&
                                  a.context.layerObject.renderer
                                  ? a.context.layerObject
                                  : a.context.layerDefinition,
                                r
                              )
                            );
                        });
                        e.push(f);
                      }
                      c.push({
                        title: a.context.baseLabel,
                        addPageBreak: !1,
                        type: "table",
                        data: { cols: b, rows: e }
                      });
                    }
                  }
                }
              })
            );
            b.resolve(c);
          },
          function(a) {
            this._updateProcessing(this.createReportButton, !1, this.reportSrc);
            new m({ message: a.message });
          }
        );
      return b;
    },
    _getPrintTemplate: function() {
      var a,
        b = [];
      a = new ja();
      this.reportDijit._printService.legendAll = !0;
      this.reportDijit._printService._getPrintDefinition(this.map, a);
      B.forEach(
        this.reportDijit._printService.allLayerslegend,
        w.hitch(this, function(a) {
          var c;
          a.id !== this.lyrIncidents.id &&
            a.id !== this.lyrBuffer.id &&
            ((c = new ka()),
            (c.layerId = a.id),
            a.subLayerIds && (c.subLayerIds = a.subLayerIds),
            b.push(c));
        })
      );
      this.reportDijit._printService.legendAll = !1;
      a.layoutOptions = {
        legendLayers: b,
        customTextElements: [{ Date: new Date().toLocaleString() }]
      };
      a = this.reportDijit.setMapLayout(a);
      a.preserveScale = !1;
      a.showAttribution = !0;
      a.format = "jpg";
      return a;
    }
  });
});
