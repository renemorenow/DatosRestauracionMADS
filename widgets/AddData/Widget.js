// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "widgets/AddData/search/SearchContext": function() {
      define(["dojo/_base/declare", "dojo/_base/lang"], function(p, h) {
        return p(null, {
          allowArcGISOnline: !0,
          arcgisOnlinePortal: null,
          orgId: null,
          portal: null,
          username: null,
          constructor: function(q) {
            h.mixin(this, q);
          }
        });
      });
    },
    "widgets/AddData/search/util": function() {
      define([
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/io-query",
        "esri/InfoTemplate",
        "esri/layers/WFSLayer"
      ], function(p, h, q, l, d) {
        return {
          checkMixedContent: function(d) {
            "string" === typeof window.location.href &&
              0 === window.location.href.indexOf("https://") &&
              "string" === typeof d &&
              0 === d.indexOf("http://") &&
              (d = "https:" + d.substring("5"));
            return d;
          },
          endsWith: function(d, b) {
            return -1 !== d.indexOf(b, d.length - b.length);
          },
          escapeForLucene: function(d) {
            return d.replace(
              /(\+|\-|\&|\!|\(|\)|\{|\}|\[|\]|\^|\"|\~|\*|\?|\:|\\)/g,
              "\\$1"
            );
          },
          findLayersAdded: function(d, b) {
            var r = [],
              t = [],
              h = [],
              l = { itemIds: t, layers: h };
            if (!d) return l;
            var y = "string" === typeof b && 0 < b.length;
            p.forEach(d.layerIds, function(b) {
              r.push(b);
            });
            p.forEach(d.graphicsLayerIds, function(b) {
              r.push(b);
            });
            p.forEach(r, function(r) {
              (r = d.getLayer(r)) &&
                "string" === typeof r.xtnItemId &&
                0 < r.xtnItemId.length &&
                (!y || r.xtnItemId === b) &&
                (h.push(r),
                -1 === t.indexOf(r.xtnItemId) && t.push(r.xtnItemId));
            });
            return l;
          },
          loadWFSByUrl: function(q, b, r, t, z, p) {
            var y,
              u,
              E,
              F,
              C = this.makeOGCRequestInfo(t);
            t = C.url;
            var G = new d();
            y = G.on("error", function(b) {
              y && y.remove();
              q.reject(b.error);
            });
            G.fromJson(C, function(v) {
              try {
                if ((y && y.remove(), v && v.push && 0 < v.length)) {
                  var g = v[0],
                    n = { url: t, version: G._version, name: g.name };
                  F = g.name || g.title;
                  if (
                    "string" === typeof n.version &&
                    0 < n.version.length &&
                    "string" === typeof n.name &&
                    0 < n.name.length
                  ) {
                    var A = new d({ id: z, infoTemplate: new l() });
                    "string" === typeof F && 0 < F.length && (A.name = F);
                    u = A.on("error", function(g) {
                      u && u.remove();
                      q.reject(g.error);
                    });
                    E = h.after(A, "_describeFeatureTypeResponse", function() {
                      E && E.remove();
                      A.fields &&
                        0 < A.fields.length &&
                        r._setFeatureLayerInfoTemplate(A);
                    });
                    A.fromJson(n, function() {
                      u && u.remove();
                      A.xtnAddData = !0;
                      b && p && b.addLayer(A);
                      q.resolve(A);
                    });
                  } else
                    q.reject(
                      Error(
                        "Error loading WFSLayer, missing version and/or layer"
                      )
                    );
                } else q.reject(Error("Error loading WFSLayer, no layers"));
              } catch (D) {
                console.warn("Error loading WFSLayer", t),
                  console.error(D),
                  q.reject(D);
              }
            });
          },
          makeOGCRequestInfo: function(d) {
            var b = { url: d },
              r = d.indexOf("?");
            if (-1 !== r) {
              b.url = d.substring(0, r);
              var t;
              d = d.substring(r + 1, d.length);
              if ("string" === typeof d && 0 < d.length) {
                var h = q.queryToObject(d),
                  l = {};
                if (h) {
                  for (t in h)
                    h.hasOwnProperty(t) &&
                      ((d = h[t]),
                      (r = t.toLowerCase()),
                      "request" !== r &&
                        "service" !== r &&
                        ("version" === r
                          ? "string" === typeof d &&
                            0 < d.length &&
                            (b.version = d)
                          : "name" === r
                          ? "string" === typeof d &&
                            0 < d.length &&
                            (b.name = d)
                          : (l[t] = d)));
                  d = q.objectToQuery(l);
                  "string" === typeof d &&
                    0 < d.length &&
                    (b.url = b.url + "?" + d);
                }
              }
            }
            return b;
          },
          setNodeText: function(d, b) {
            d.innerHTML = "";
            b && d.appendChild(document.createTextNode(b));
          },
          setNodeTitle: function(d, b) {
            d.title = "";
            b && d.setAttribute("title", b);
          },
          setNodeHTML: function(d, b) {
            d.innerHTML = "";
            b && (d.innerHTML = b);
          }
        };
      });
    },
    "esri/layers/WFSLayer": function() {
      define("dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/has dojo/on ../request ../kernel ../graphic ../renderers/jsonUtils ../symbols/jsonUtils ../Color ../symbols/SimpleMarkerSymbol ../symbols/SimpleLineSymbol ../symbols/SimpleFillSymbol ../SpatialReference ../geometry/webMercatorUtils ../geometry/Extent ../geometry/Point ../geometry/Multipoint ../geometry/Polyline ../geometry/Polygon ./LabelClass ./GraphicsLayer".split(
        " "
      ), function(
        p,
        h,
        q,
        l,
        d,
        u,
        b,
        r,
        t,
        z,
        E,
        y,
        H,
        B,
        F,
        C,
        G,
        v,
        g,
        n,
        A,
        D,
        x,
        I,
        e
      ) {
        p = p([e], {
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
            this.onError = q.hitch(this, this.onError);
            this._errorSupport = q.hitch(this, this._errorSupport);
            this._parseGml = q.hitch(this, this._parseGml);
            this._getCapabilities = q.hitch(this, this._getCapabilities);
            this._getCapabilitiesResponse = q.hitch(
              this,
              this._getCapabilitiesResponse
            );
            this._describeFeatureTypeResponse = q.hitch(
              this,
              this._describeFeatureTypeResponse
            );
            this._pointSymbol = new B(
              B.STYLE_CIRCLE,
              6,
              new F(F.STYLE_SOLID, new H([0, 255, 0]), 1),
              new H([255, 0, 0])
            );
            this._lineSymbol = new F(F.STYLE_SOLID, new H([0, 255, 0]), 3);
            this._polygonSymbol = new C(
              C.STYLE_SOLID,
              new F(F.STYLE_SOLID, new H([255, 0, 0]), 2),
              new H([255, 255, 0, 0.25])
            );
            this.loaded = !1;
            this._isProjectedOk = !0;
          },
          initialize: function(a, f) {
            a.id && (this.id = a.id);
            a.url && (this._url = a.url);
            a.version && (this._version = a.version);
            this.customParameters = a.customParameters;
            this._getCapabilities(f);
          },
          selectLayer: function(a, f) {
            this._layerName = a.layerName;
            this._wkid = a.wkid;
            this._mode = a.mode;
            this._maxFeatures = a.maxFeatures;
            this._inverseResponse = a.swapXY;
            this._inverseFilter = a.swapXYFilter;
            this.geometryType = a.geometryType;
            this._describeFeatureType(f);
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
              (a.labelingInfo = l.map(this.labelingInfo, function(a) {
                return a.toJson();
              }));
            this.customParameters &&
              (a.customParameters = this.customParameters);
            return a;
          },
          fromJson: function(a, f) {
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
            a.pointSymbol && (this._pointSymbol = y.fromJson(a.pointSymbol));
            a.lineSymbol && (this._lineSymbol = y.fromJson(a.lineSymbol));
            a.polygonSymbol &&
              (this._polygonSymbol = y.fromJson(a.polygonSymbol));
            this.showLabels = null != a.showLabels ? a.showLabels : !0;
            a.labelingInfo &&
              (this.labelingInfo = l.map(a.labelingInfo, function(a) {
                return new I(a);
              }));
            this.customParameters = a.customParameters;
            this._getCapabilities(f);
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
            var f = this.inherited(arguments);
            this._map &&
              (this._layerEventHandlers.push(
                this._map.on("extent-change", q.hitch(this, "refresh"))
              ),
              this._layerEventHandlers.push(
                this.on("visibility-change", q.hitch(this, "_visibilityChange"))
              ));
            this._getFeature();
            this.refresh();
            return f;
          },
          _unsetMap: function() {
            for (var a = 0; a < this._layerEventHandlers.length; a++)
              d.disconnect(this._layerEventHandlers[a]);
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
                var f = this._graphicArray[a],
                  m = f.geometry,
                  c = null;
                "point" === m.type
                  ? (c = this.renderer
                      ? this.renderer.getSymbol(f)
                      : this._pointSymbol)
                  : "multipoint" === m.type
                  ? (c = this.renderer
                      ? this.renderer.getSymbol(f)
                      : this._pointSymbol)
                  : "polyline" === m.type
                  ? (c = this.renderer
                      ? this.renderer.getSymbol(f)
                      : this._lineSymbol)
                  : "polygon" === m.type &&
                    (c = this.renderer
                      ? this.renderer.getSymbol(f)
                      : this._polygonSymbol);
                f.setSymbol(c);
                this.add(f);
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
              f,
              m = this,
              c = function(a, c) {
                a = m._getField(c, !0);
                return "[" + ((a && a.name) || c) + "]";
              };
            l.forEach(this.labelingInfo, function(k) {
              if ((f = k.labelExpression)) k.labelExpression = f.replace(a, c);
            });
          },
          _getField: function(a, f) {
            var m = this.fields;
            if (!m || 0 === m.length) return null;
            var c;
            f && (a = a.toLowerCase());
            l.some(m, function(k) {
              var m = !1;
              (m = f
                ? k && k.name.toLowerCase() === a
                  ? !0
                  : !1
                : k && k.name === a
                ? !0
                : !1) && (c = k);
              return m;
            });
            return c;
          },
          setCustomParameters: function(a) {
            this.customParameters = a;
            this._getFeature();
            this.refresh();
          },
          _getCapabilities: function(a) {
            this._getCapabilitiesCallback = a;
            a = q.trim(this._url);
            if ("" === a) this.onError("WFSLayer: url is invalid");
            else if (
              "1.0.0" !== this._version &&
              "1.1.0" !== this._version &&
              "2.0.0" !== this._version
            )
              this.onError("WFSLayer: version is invalid");
            else if ("" !== a) {
              var f = a.indexOf("?");
              a =
                a +
                (-1 === f ? "?" : "\x26") +
                "service\x3dWFS\x26request\x3dGetCapabilities\x26version\x3d" +
                this._version;
              a = this._appendCustomParameters(a);
              r(
                { url: a, handleAs: "text", headers: { "Content-Type": null } },
                { usePost: !1 }
              ).then(this._getCapabilitiesResponse, this._errorSupport);
            }
          },
          _errorSupport: function(a) {
            this.onError(a);
          },
          _getCapabilitiesResponse: function(a) {
            var f,
              m,
              c,
              k,
              e,
              g = new DOMParser();
            try {
              var w = g.parseFromString(a, "text/xml"),
                n = this._readExceptionReport(w, a);
              if (n)
                this.onError(
                  "WFSLayer: getCapabilities - returns exception: " + n
                );
              else {
                var b = w.documentElement.attributes.getNamedItem("version");
                if (b) {
                  this._version = b.value;
                  var v =
                      "2.0.0" === this._version
                        ? "http://www.opengis.net/wfs/2.0"
                        : "http://www.opengis.net/wfs",
                    x;
                  if ("2.0.0" === this._version)
                    for (
                      f = w.getElementsByTagNameNS(
                        "http://www.opengis.net/ows/1.1",
                        "Operation"
                      ),
                        m = 0;
                      m < f.length;
                      m++
                    )
                      (k = f[m].attributes.getNamedItem("name")) &&
                        "DescribeFeatureType" === k.value &&
                        ((x = f[m].getElementsByTagNameNS(
                          "http://www.opengis.net/ows/1.1",
                          "Get"
                        )),
                        (this.describeFeatureTypeUrl = x[0].attributes.getNamedItem(
                          "xlink:href"
                        ).value)),
                        k &&
                          "GetFeature" === k.value &&
                          ((e = f[m].getElementsByTagNameNS(
                            "http://www.opengis.net/ows/1.1",
                            "Post"
                          )),
                          (this.getFeatureUrl = e[0].attributes.getNamedItem(
                            "xlink:href"
                          ).value));
                  else if ("1.1.0" === this._version)
                    for (
                      f = w.getElementsByTagNameNS(
                        "http://www.opengis.net/ows",
                        "Operation"
                      ),
                        m = 0;
                      m < f.length;
                      m++
                    )
                      (k = f[m].attributes.getNamedItem("name")) &&
                        "DescribeFeatureType" === k.value &&
                        ((x = f[m].getElementsByTagNameNS(
                          "http://www.opengis.net/ows",
                          "Get"
                        )),
                        (this.describeFeatureTypeUrl = x[0].attributes.getNamedItem(
                          "xlink:href"
                        ).value)),
                        k &&
                          "GetFeature" === k.value &&
                          (e = f[m].getElementsByTagNameNS(
                            "http://www.opengis.net/ows",
                            "Post"
                          )) &&
                          e.length &&
                          (this.getFeatureUrl = e[0].attributes.getNamedItem(
                            "xlink:href"
                          ).value);
                  else if ("1.0.0" === this._version) {
                    var D = w.getElementsByTagNameNS(v, "DescribeFeatureType");
                    if (!D || !D.length) {
                      this.onError(
                        "WFSLayer: getCapabilities - no describeFeatureType info"
                      );
                      return;
                    }
                    x = D[0].getElementsByTagNameNS(v, "Get");
                    this.describeFeatureTypeUrl = x[0].attributes.getNamedItem(
                      "onlineResource"
                    ).value;
                    var A = w.getElementsByTagNameNS(v, "GetFeature");
                    if (!A || !A.length) {
                      this.onError(
                        "WFSLayer: getCapabilities - no GetFeature info"
                      );
                      return;
                    }
                    (e = A[0].getElementsByTagNameNS(v, "Post")) &&
                      e.length &&
                      (this.getFeatureUrl = e[0].attributes.getNamedItem(
                        "onlineResource"
                      ).value);
                  }
                  this._nsLayerNames = {};
                  a = [];
                  var d = w.getElementsByTagNameNS(v, "FeatureTypeList");
                  for (m = 0; m < d.length; m++) {
                    var I = d[m].getElementsByTagNameNS(v, "FeatureType");
                    for (c = 0; c < I.length; c++) {
                      var r = I[c],
                        t = r.getElementsByTagNameNS(v, "Name")[0],
                        h = t.textContent,
                        l = h.indexOf(":"),
                        q = h.substring(0, l),
                        y = h.substring(l + 1),
                        p = t.lookupNamespaceURI(q);
                      null === p && (p = t.lookupNamespaceURI(null));
                      this._nsLayerNames[y] = { prefix: q, namespace: p };
                      var z = r.getElementsByTagNameNS(v, "Title"),
                        E = 0 < z.length ? z[0].textContent : "";
                      "" === E && (E = y);
                      this.spatialReferences = this._readFactoryCodes(
                        this._version,
                        r
                      );
                      var C = this._readDefaultBBOX(this._version, r);
                      a.push({
                        name: y,
                        title: E,
                        spatialReferences: this.spatialReferences,
                        extent: C
                      });
                    }
                  }
                  this._describeFeatureType();
                  var B = this._getCapabilitiesCallback;
                  B && B(a);
                } else
                  this.onError(
                    "WFSLayer: getCapabilities - document not recognized."
                  );
              }
            } catch (S) {
              this.onError("WFSLayer: getCapabilities - parsing error");
            }
          },
          _readFactoryCodes: function(a, f) {
            var m,
              c = [];
            if ("2.0.0" === a || "1.1.0" === a) {
              a = f.getElementsByTagNameNS("*", "DefaultSRS");
              this._addCodeList(c, a[0]);
              a = f.getElementsByTagNameNS("*", "DefaultCRS");
              this._addCodeList(c, a[0]);
              a = f.getElementsByTagNameNS("*", "OtherSRS");
              for (m = 0; m < a.length; m++) this._addCodeList(c, a[m]);
              a = f.getElementsByTagNameNS("*", "OtherCRS");
              for (m = 0; m < a.length; m++) this._addCodeList(c, a[m]);
            } else
              "1.0.0" === a &&
                ((a = f.getElementsByTagNameNS("*", "SRS")),
                this._addCodeList(c, a[0]));
            for (f = !1; 0 < c.length; ) {
              4326 === c[0] && (f = !0);
              break;
            }
            f || c.push(4326);
            return c;
          },
          _addCodeList: function(a, f) {
            f &&
              ((f = f.textContent.match(/\d+/g)),
              0 < f.length &&
                ((f = parseInt(f[f.length - 1], 10)),
                84 === f && (f = 4326),
                a.push(f)));
          },
          _readDefaultBBOX: function(a, f) {
            var m, c, k, e;
            if ("2.0.0" === a || "1.1.0" === a) {
              m = f.getElementsByTagNameNS("*", "WGS84BoundingBox");
              if (!m[0] || !m[0].attributes) return [];
              c = m[0].getElementsByTagNameNS("*", "LowerCorner");
              e = m[0].getElementsByTagNameNS("*", "UpperCorner");
              if (0 >= c.length || 0 >= e.length) return [];
              k = c[0].textContent;
              m = k.indexOf(" ");
              c = k.substring(0, m);
              k = k.substring(m + 1);
              m = e[0].textContent;
              a = m.indexOf(" ");
              e = m.substring(0, a);
              m = m.substring(a + 1);
            } else if ("1.0.0" === a) {
              m = f.getElementsByTagNameNS("*", "LatLongBoundingBox");
              if (!m[0] || !m[0].attributes) return [];
              c = m[0].attributes.getNamedItem("minx").value;
              k = m[0].attributes.getNamedItem("miny").value;
              e = m[0].attributes.getNamedItem("maxx").value;
              m = m[0].attributes.getNamedItem("maxy").value;
            }
            c = parseFloat(c, 10);
            k = parseFloat(k, 10);
            e = parseFloat(e, 10);
            m = parseFloat(m, 10);
            return [c, k, e, m];
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
                var f = q.trim(this.describeFeatureTypeUrl);
                if ("" !== f) {
                  var m = -1 === f.indexOf("?") ? "?" : "\x26",
                    c = this._nsLayerNames[this._layerName];
                  if (void 0 === c) this.onError("WFSLayer: invalid layerName");
                  else
                    (a = c.prefix),
                      (c = c.namespace),
                      (f =
                        f +
                        m +
                        "service\x3dWFS\x26request\x3dDescribeFeatureType\x26version\x3d" +
                        this._version),
                      (f += "\x26typeName\x3d"),
                      "" !== a && (f += a + ":"),
                      (f += encodeURIComponent(this._layerName)),
                      "" !== a &&
                        (f +=
                          "\x26namespace\x3dxmlns(" +
                          a +
                          "\x3d" +
                          encodeURIComponent(c) +
                          ")"),
                      (f = this._appendCustomParameters(f)),
                      r(
                        {
                          url: f,
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
            var f;
            f = new DOMParser().parseFromString(a, "text/xml");
            if ((a = this._readExceptionReport(f, a)))
              this.onError(
                "WFSLayer: DescribeFeatureType - returns exception: " + a
              );
            else {
              this.fields = [];
              a = f.getElementsByTagNameNS(
                "http://www.w3.org/2001/XMLSchema",
                "schema"
              );
              for (f = 0; f < a.length; f++) {
                var m = this._readAllFields(a[f]);
                null !== m &&
                  ((this._layerDefinedGeometryType = m[0]),
                  (this.fields = m[1]));
              }
              (this.geometryType && "" !== this.geometryType) ||
                (this.geometryType = this._layerDefinedGeometryType);
              for (f = 0; f < this.fields.length; f++)
                (a = this.fields[f]),
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
                  (f = this._describeFeatureTypeCallback) && f(this.fields);
            }
          },
          _readAllFields: function(a) {
            for (var f = a.childNodes, m = 0; m < f.length; m++) {
              var c = f[m];
              if ("element" === c.localName) {
                var k = c.attributes;
                if (k.name.value === this._layerName)
                  return (f = k.type)
                    ? ((c = f.value),
                      (f = c.indexOf(":")),
                      (c = c.substring(f + 1)),
                      this._readFieldsFromGlobalComplextType(a, c))
                    : this._readFieldsFromLocalComplextType(c);
              }
            }
            return null;
          },
          _readFieldsFromGlobalComplextType: function(a, f) {
            a = a.childNodes;
            for (var m = 0; m < a.length; m++) {
              var c = a[m];
              if (
                "complexType" === c.localName &&
                c.attributes.name.value === f
              )
                return this._readFieldsFromLocalComplextType(c);
            }
            return null;
          },
          _readFieldsFromLocalComplextType: function(a) {
            for (
              var f = [],
                m = "esriGeometryComplex",
                c = a.getElementsByTagNameNS(
                  "http://www.w3.org/2001/XMLSchema",
                  "element"
                ),
                k = 0;
              k < c.length;
              k++
            ) {
              var e = c[k],
                g = "",
                w = e.attributes.getNamedItem("name");
              w && (g = w.value);
              if ("" !== g) {
                var n = (a = ""),
                  b = e.attributes.getNamedItem("type"),
                  w = "unknown";
                if (null !== b) {
                  var n = b.value,
                    v = n.indexOf(":");
                  a = n.substring(0, v);
                  n = n.substring(v + 1);
                  w = b.lookupNamespaceURI(a);
                  null === w && (w = b.lookupNamespaceURI(null));
                }
                if ("" === n)
                  for (var e = e.childNodes, x = 0; x < e.length; x++)
                    if (((a = e[x]), "simpleType" === a.localName)) {
                      a = a.childNodes;
                      for (x = 0; x < a.length; x++)
                        if (
                          ((node2 = a[x]), "restriction" === node2.localName)
                        ) {
                          b = node2.attributes.getNamedItem("base");
                          n = b.value;
                          v = n.indexOf(":");
                          a = n.substring(0, v);
                          n = n.substring(v + 1);
                          break;
                        }
                      if ("" !== n) break;
                    }
                e = "Unknown";
                switch (n) {
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
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                    break;
                  case "float":
                  case "double":
                  case "decimal":
                    e = "esriFieldTypeDouble";
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
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
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                    break;
                  case "duration":
                  case "dateTime":
                  case "time":
                  case "date":
                    e = "esriFieldTypeDate";
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                    break;
                  case "PointPropertyType":
                  case "MultiPointPropertyType":
                    e = "esriFieldTypeGeometry";
                    m = "esriGeometryPoint";
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                    break;
                  case "MultiCurvePropertyType":
                  case "MultiLineStringPropertyType":
                    e = "esriFieldTypeGeometry";
                    m = "esriGeometryPolyline";
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                    break;
                  case "MultiSurfacePropertyType":
                  case "MultiPolygonPropertyType":
                    e = "esriFieldTypeGeometry";
                    m = "esriGeometryPolygon";
                    f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                    break;
                  case "GeometryPropertyType":
                  case "MultiGeometryPropertyType":
                    (e = "esriFieldTypeGeometry"),
                      (m = "esriGeometryComplex"),
                      f.push({ name: g, alias: g, type: e, wfsNamespace: w });
                }
              }
            }
            return [m, f];
          },
          _getFeature: function() {
            var a;
            a =
              "\x3c?xml version\x3d'1.0' encoding\x3d'utf-8'?\x3e\n\x3cGetFeature \n xmlns:xsi\x3d'http://www.w3.org/2001/XMLSchema-instance'\n xmlns:gml\x3d'http://www.opengis.net/gml'\n xmlns:ogc\x3d'http://www.opengis.net/ogc'\n xmlns:wfs\x3d'http://www.opengis.net/wfs'\n";
            a =
              "2.0.0" === this._version
                ? a + " xmlns\x3d'http://www.opengis.net/wfs/2.0'\n"
                : a + " xmlns\x3d'http://www.opengis.net/wfs'\n";
            var f = this._nsLayerNames[this._layerName];
            if (void 0 === f) this.onError("WFSLayer: invalid layerName");
            else {
              var m = f.prefix,
                f = f.namespace;
              if (
                "ondemand" === this._mode.toLowerCase() &&
                "" === this._nsGeometryFieldName
              )
                this.onError(
                  "WFSLayer: GetFeature - can't use 'onDemand' mode as geometryFieldName is unknown."
                );
              else if (
                ((a += " xmlns:" + m + "\x3d'" + f + "'\n"),
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
                        m +
                        ":" +
                        this._layerName +
                        "' srsName\x3d'EPSG:" +
                        this._wkid +
                        "'\x3e\n")
                    : a +
                      (" \x3cwfs:Query typeName\x3d'" +
                        m +
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
                      m +
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
                  var m = this._map.extent.ymin,
                    f = this._map.extent.xmax,
                    c = this._map.extent.ymax,
                    k = {},
                    e = this._map.spatialReference,
                    g = new G(this._wkid);
                  this._projectFromSRToSR(e, g, a, m, k) &&
                    ((a = k.x), (m = k.y));
                  this._projectFromSRToSR(e, g, f, c, k) &&
                    ((f = k.x), (c = k.y));
                  a = this._getFeatureRequest
                    .replace(/{xmin}/, a)
                    .replace(/{ymin}/, m)
                    .replace(/{xmax}/, f)
                    .replace(/{ymax}/, c);
                }
                m = this._appendCustomParameters(this.getFeatureUrl);
                r(
                  {
                    url: m,
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
              var f = new DOMParser().parseFromString(a, "text/xml");
              if ((a = this._readExceptionReport(f, a)))
                this.onError("WFSLayer: GetFeature - returns exception: " + a);
              else
                (this._gmlNS =
                  "2.0.0" === this._version
                    ? "http://www.opengis.net/gml/3.2"
                    : "http://www.opengis.net/gml"),
                  "" === this._wkid &&
                    (this._wkid = this._map.spatialReference.wkid),
                  (this._graphicArray = this._readFeatureMembers(
                    f,
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
            for (var f = 0; f < a.length; f++) {
              var m = a[f].geometry;
              4326 === m.spatialReference.wkid &&
                ((m.x = this._limit4326X(m.x)), (m.y = this._limit4326Y(m.y)));
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
            for (var f = null, m = 0; m < a.length; m++) {
              var c = a[m].geometry,
                k = null;
              (k =
                "point" === c.geometryType
                  ? new g(c.x, c.y, c.x, c.y, c.spatialReference)
                  : c.getExtent()) && (f = null === f ? k : f.union(k));
            }
            return f;
          },
          _readExceptionReport: function(a, f) {
            return 0 <
              a.getElementsByTagNameNS("*", "ExceptionReport").length ||
              0 < a.getElementsByTagNameNS("*", "ServiceExceptionReport").length
              ? f
              : "";
          },
          _readFeatureMembers: function(a, f, m, c, k) {
            var e, g, w, n;
            g = this._readWkidFromNode(a);
            -1 != g && (f = g);
            g = this._readSrsDimension(a);
            0 !== g && (m = g);
            var b = [];
            w = a.getElementsByTagNameNS("*", "featureMembers");
            for (g = 0; g < w.length; g++)
              for (
                e = w[g],
                  n = e.getElementsByTagNameNS(c, k),
                  0 === n.length && (n = e.getElementsByTagNameNS(null, k)),
                  0 === n.length && (n = e.getElementsByTagNameNS("*", k)),
                  e = 0;
                e < n.length;
                e++
              )
                this._readLayer(b, n[e], f, m);
            w = a.getElementsByTagNameNS("*", "featureMember");
            for (g = 0; g < w.length; g++)
              for (
                e = w[g],
                  n = e.getElementsByTagNameNS(c, k),
                  0 === n.length && (n = e.getElementsByTagNameNS(null, k)),
                  0 === n.length && (n = e.getElementsByTagNameNS("*", k)),
                  e = 0;
                e < n.length;
                e++
              )
                this._readLayer(b, n[e], f, m);
            w = a.getElementsByTagNameNS("*", "member");
            for (g = 0; g < w.length; g++)
              for (
                e = w[g],
                  n = e.getElementsByTagNameNS(c, k),
                  0 === n.length && (n = e.getElementsByTagNameNS(null, k)),
                  0 === n.length && (n = e.getElementsByTagNameNS("*", k)),
                  e = 0;
                e < n.length;
                e++
              )
                this._readLayer(b, n[e], f, m);
            return b;
          },
          _readLayer: function(a, f, m, c) {
            var k, e;
            e = this._readSrsDimension(f);
            0 !== e && (c = e);
            var g = f.childNodes,
              w = "",
              n = null;
            for (f = 0; f < g.length; f++)
              if (
                ((k = g[f]),
                1 == k.nodeType && ((e = k.localName), "boundedBy" !== e))
              ) {
                k = this._readGeometry(k, m, c);
                if (!this._isProjectedOk) {
                  this._isProjectedOk = !0;
                  console.error("WFSLayer: could not project geometry.");
                  break;
                }
                if (
                  null !== k &&
                  ((n = k),
                  (w = e),
                  "point" !== n.geometryType ||
                    ("esriGeometryPolygon" !== this.geometryType &&
                      "esriGeometryPolyline" !== this.geometryType))
                )
                  break;
              }
            if (n) {
              m = {};
              for (f = 0; f < g.length; f++)
                if (
                  ((k = g[f]), (e = k.localName), (c = k.textContent), e !== w)
                )
                  for (k = 0; k < this.fields.length; k++) {
                    var b = this.fields[k];
                    b.name == e &&
                      (m[e] =
                        "esriFieldTypeDouble" === b.type
                          ? parseFloat(c, 10)
                          : "esriFieldTypeInteger" === b.type
                          ? parseInt(c, 10)
                          : c.trim());
                  }
              this._convertWFSGeometryToGraphicObjects(a, n, m);
            }
          },
          _convertWFSGeometryToGraphicObjects: function(a, f, m) {
            var c;
            if (
              "point" === f.geometryType &&
              ("esriGeometryPoint" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new z()),
                (f = new n(f)),
                c.setGeometry(f),
                c.setAttributes(m),
                a.push(c);
            else if (
              "multipoint" === f.geometryType &&
              ("esriGeometryPoint" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new z()),
                (f = new A(f)),
                c.setGeometry(f),
                c.setAttributes(m),
                a.push(c);
            else if (
              "polyline" === f.geometryType &&
              ("esriGeometryPolyline" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new z()),
                (f = new D(f)),
                c.setGeometry(f),
                c.setAttributes(m),
                a.push(c);
            else if (
              "polygon" === f.geometryType &&
              ("esriGeometryPolygon" === this.geometryType ||
                "esriGeometryComplex" === this.geometryType)
            )
              (c = new z()),
                (f = new x(f)),
                c.setGeometry(f),
                c.setAttributes(m),
                a.push(c);
            else if ("multigeometry" === f.geometryType)
              for (c = 0; c < f.length; c++)
                this._convertWFSGeometryToGraphicObjects(a, f[c], m);
          },
          _readGeometry: function(a, f, m) {
            var c, k;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (m = c);
            k = a.getElementsByTagNameNS(this._gmlNS, "MultiSurface");
            if (1 <= k.length)
              for (c = 0; c < k.length; )
                return this._readMultiSurface(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "MultiCurve");
            if (1 <= k.length) {
              var e = [];
              for (c = 0; c < k.length; c++) {
                var g = this._readMultiCurve(k[c], f, m);
                for (a = 0; a < g.length; a++) e.push(g[a]);
              }
              return {
                geometryType: "polyline",
                paths: e,
                spatialReference: { wkid: this._map.spatialReference.wkid }
              };
            }
            k = a.getElementsByTagNameNS(this._gmlNS, "MultiGeometry");
            for (c = 0; c < k.length; )
              return this._readMultiGeometry(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Geometry");
            for (c = 0; c < k.length; ) return this._readGeometry(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "GeometryCollection");
            for (c = 0; c < k.length; )
              return this._readGeometryCollection(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Surface");
            for (c = 0; c < k.length; ) return this._readSurface(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Curve");
            for (c = 0; c < k.length; ) return this._readCurve(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "MultiPolygon");
            for (c = 0; c < k.length; )
              return this._readMultiPolygon(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (c = 0; c < k.length; ) return this._readPolygon(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "MultiLineString");
            for (c = 0; c < k.length; )
              return this._readMultiLineString(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (c = 0; c < k.length; ) {
              f = this._readLineString(k[c], f, m);
              m = {
                geometryType: "polyline",
                paths: [],
                spatialReference: { wkid: this._map.spatialReference.wkid }
              };
              c = [];
              for (a = 0; a < f.length; a++) c.push(f[a]);
              m.paths.push(c);
              return m;
            }
            k = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
            for (c = 0; c < k.length; ) return this._readLinearRing(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Box");
            if (1 <= k.length)
              for (c = 0; c < k.length; ) return this._readBox(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Envelope");
            for (c = 0; c < k.length; ) return this._readEnvelope(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "MultiPoint");
            if (1 <= k.length)
              for (c = 0; c < k.length; )
                return this._readMultiPoint(k[c], f, m);
            k = a.getElementsByTagNameNS(this._gmlNS, "Point");
            for (c = 0; c < k.length; ) return this._readPoint(k[c], f, m);
            return null;
          },
          _readGeometryCollection: function(a, f, m) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (m = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "geometryMember");
            for (a = 0; a < c.length; a++) {
              var e = this._readGeometryMember(c[a], f, m);
              k.push(e);
            }
            return k;
          },
          _readMultiGeometry: function(a, f, m) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (m = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "geometryMember");
            for (a = 0; a < c.length; a++) {
              var e = this._readGeometryMember(c[a], f, m);
              k.push(e);
            }
            return k;
          },
          _readSurface: function(a, f, m) {
            var c, k;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (m = c);
            var e = [];
            e.geometryType = "multigeometry";
            e.spatialReference = { wkid: this._map.spatialReference.wkid };
            k = a.getElementsByTagNameNS(this._gmlNS, "Point");
            for (c = 0; c < k.length; c++) e.push(this._readPoint(k[c], f, m));
            k = a.getElementsByTagNameNS(this._gmlNS, "patches");
            for (c = 0; c < k.length; c++) {
              a = this._readPatches(k[c], f, m);
              for (var g = 0; g < a.length; g++) e.push(a[g]);
            }
            return e;
          },
          _readMultiSurface: function(a, f, m) {
            var c, k, e;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (m = c);
            var g = [];
            g.geometryType = "multigeometry";
            g.spatialReference = { wkid: this._map.spatialReference.wkid };
            e = a.getElementsByTagNameNS(this._gmlNS, "surfaceMember");
            for (c = 0; c < e.length; c++) {
              var w = this._readSurfaceMember(e[c], f, m);
              for (k = 0; k < w.length; k++) g.push(w[k]);
            }
            e = a.getElementsByTagNameNS(this._gmlNS, "surfaceMembers");
            for (c = 0; c < e.length; c++)
              for (
                a = this._readSurfaceMembers(e[c], f, m), k = 0;
                k < a.length;
                k++
              )
                g.push(a[k]);
            return g;
          },
          _readCurve: function(a, f, m) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (m = k);
            k = {
              geometryType: "polyline",
              paths: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            c = a.getElementsByTagNameNS(this._gmlNS, "segments");
            for (a = 0; a < c.length; a++)
              for (
                var e = this._readSegments(c[a], f, m), g = 0;
                g < e.length;
                g++
              )
                k.paths.push(e[g]);
            return k;
          },
          _readSegments: function(a, f, m) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (m = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "LineStringSegment");
            for (a = 0; a < c.length; a++) {
              var e = this._readLineStringSegment(c[a], f, m);
              k.push(e);
            }
            return k;
          },
          _readLineStringSegment: function(a, f, m) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (m = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "posList");
              0 < a.length;

            )
              return this._readPosList(a[0], f, m);
          },
          _readMultiCurve: function(a, f, m) {
            var c, k, e, g;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (m = c);
            var w = [];
            w.spatialReference = { wkid: this._map.spatialReference.wkid };
            e = a.getElementsByTagNameNS(this._gmlNS, "curveMember");
            for (c = 0; c < e.length; c++)
              for (
                g = this._readCurveMember(e[c], f, m), k = 0;
                k < g.length;
                k++
              )
                w.push(g[k]);
            e = a.getElementsByTagNameNS(this._gmlNS, "curveMembers");
            for (c = 0; c < e.length; c++)
              for (
                g = this._readCurveMembers(e[c], f, m), k = 0;
                k < g.length;
                k++
              )
                w.push(g[k]);
            return w;
          },
          _readGeometryMember: function(a, f, e) {
            var c, k;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            k = a.getElementsByTagNameNS(this._gmlNS, "Point");
            for (c = 0; c < k.length; ) return this._readPoint(k[c], f, e);
            k = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (c = 0; c < k.length; ) {
              f = this._readLineString(k[c], f, e);
              e = {
                geometryType: "polyline",
                paths: [],
                spatialReference: { wkid: this._map.spatialReference.wkid }
              };
              c = [];
              for (a = 0; a < f.length; a++) c.push(f[a]);
              e.paths.push(c);
              return e;
            }
            k = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (c = 0; c < k.length; ) return this._readPolygon(k[c], f, e);
            return null;
          },
          _readSurfaceMember: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (a = 0; a < c.length; a++) {
              var m = this._readPolygon(c[a], f, e);
              k.push(m);
            }
            return k;
          },
          _readSurfaceMembers: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
            for (a = 0; a < c.length; a++) {
              var m = this._readPolygon(c[a], f, e);
              k.push(m);
            }
            return k;
          },
          _readCurveMember: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (a = 0; a < c.length; a++) {
              var m = this._readLineString(c[a], f, e);
              k.push(m);
            }
            return k;
          },
          _readCurveMembers: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "LineString");
            for (a = 0; a < c.length; a++) {
              var m = this._readLineString(c[a], f, e);
              k.push(m);
            }
            return k;
          },
          _readBox: function(a, f, e) {
            var c,
              k,
              m,
              g,
              w,
              n,
              b,
              v = this._readWkidFromNode(a);
            -1 != v && (f = v);
            v = this._readSrsDimension(a);
            0 !== v && (e = v);
            v = {
              geometryType: "polygon",
              rings: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            k = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < k.length; c++)
              if ((m = this._readCoordinates(k[c], f, e)))
                return (
                  1 <= m.length && ((g = n = m[0][0]), (w = b = m[0][1])),
                  1 <= m.length && ((n = m[1][0]), (b = m[1][1])),
                  v.rings.push([
                    [g, w],
                    [g, b],
                    [n, b],
                    [n, w],
                    [g, w]
                  ]),
                  v
                );
            k = a.getElementsByTagNameNS(this._gmlNS, "coord");
            return 2 <= k.length
              ? ((a = this._readCoord(k[0], f, e)) &&
                  1 <= a.length &&
                  ((g = n = a[0][0]), (w = b = a[0][1])),
                (f = this._readCoord(k[1], f, e)) &&
                  1 <= f.length &&
                  ((n = f[0][0]), (b = f[0][1])),
                v.rings.push([
                  [g, w],
                  [g, b],
                  [n, b],
                  [n, w],
                  [g, w]
                ]),
                v)
              : null;
          },
          _readEnvelope: function(a, f, e) {
            var c, k, m, g;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            k = a.getElementsByTagNameNS(this._gmlNS, "lowerCorner");
            for (c = 0; c < k.length; c++) {
              var w = this._readCoordinates(k[c], f, e);
              w && (m = w[0]);
            }
            k = a.getElementsByTagNameNS(this._gmlNS, "upperCorner");
            for (c = 0; c < k.length; c++)
              (a = this._readCoordinates(k[c], f, e)) && (g = a[0]);
            return m && g
              ? {
                  geometryType: "polygon",
                  rings: [
                    [
                      [m[0], m[1]],
                      [m[0], g[1]],
                      [g[0], g[1]],
                      [g[0], m[1]],
                      [m[0], m[1]]
                    ]
                  ],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                }
              : null;
          },
          _readPolygon: function(a, f, e) {
            var c, k, m;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            var g = {
              geometryType: "polygon",
              rings: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            k = a.getElementsByTagNameNS(this._gmlNS, "outerBoundaryIs");
            for (c = 0; c < k.length; c++)
              (m = this._readOuterBoundaryIs(k[c], f, e)), g.rings.push(m);
            k = a.getElementsByTagNameNS(this._gmlNS, "innerBoundaryIs");
            for (c = 0; c < k.length; c++)
              (m = this._readInnerBoundaryIs(k[c], f, e)), g.rings.push(m);
            k = a.getElementsByTagNameNS(this._gmlNS, "exterior");
            for (c = 0; c < k.length; c++)
              (m = this._readExterior(k[c], f, e)), g.rings.push(m);
            k = a.getElementsByTagNameNS(this._gmlNS, "interior");
            for (c = 0; c < k.length; c++)
              (m = this._readInterior(k[c], f, e)), g.rings.push(m);
            return g;
          },
          _readPolygonMember: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "Polygon");
              0 < a.length;

            )
              return this._readPolygon(a[0], f, e);
            return null;
          },
          _readMultiPolygon: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = [];
            k.geometryType = "multigeometry";
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "polygonMember");
            for (a = 0; a < c.length; a++) {
              var m = this._readPolygonMember(c[a], f, e);
              k.push(m);
            }
            return k;
          },
          _readOuterBoundaryIs: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], f, e);
            return null;
          },
          _readInnerBoundaryIs: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], f, e);
            return null;
          },
          _readExterior: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], f, e);
            return null;
          },
          _readInterior: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LinearRing");
              0 < a.length;

            )
              return this._readLinearRing(a[0], f, e);
            return null;
          },
          _readPatches: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = [];
            k.spatialReference = { wkid: this._map.spatialReference.wkid };
            c = a.getElementsByTagNameNS(this._gmlNS, "PolygonPatch");
            for (a = 0; a < c.length; a++)
              k.push(this._readPolygon(c[a], f, e));
            return k;
          },
          _readLineString: function(a, f, e) {
            var c, k, m, g, w;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            var n = [];
            n.spatialReference = { wkid: this._map.spatialReference.wkid };
            m = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < m.length; c++)
              if ((g = this._readCoordinates(m[c], f, e)))
                for (k = 0; k < g.length; k++) (w = g[k]), n.push(w);
            m = a.getElementsByTagNameNS(this._gmlNS, "coord");
            for (c = 0; c < m.length; c++)
              if ((g = this._readCoord(m[c], f, e)))
                for (k = 0; k < g.length; k++) (w = g[k]), n.push(w);
            m = a.getElementsByTagNameNS(this._gmlNS, "posList");
            for (c = 0; c < m.length; c++)
              if ((g = this._readPosList(m[c], f, e)))
                for (k = 0; k < g.length; k++) (w = g[k]), n.push(w);
            return n;
          },
          _readLineStringMember: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "LineString");
              0 < a.length;

            )
              return this._readLineString(a[0], f, e);
            return null;
          },
          _readMultiLineString: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = {
              geometryType: "polyline",
              paths: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            c = a.getElementsByTagNameNS(this._gmlNS, "lineStringMember");
            for (a = 0; a < c.length; a++) {
              var m = this._readLineStringMember(c[a], f, e);
              m && k.paths.push(m);
            }
            return 1 <= k.paths.length ? k : null;
          },
          _readPoint: function(a, f, e) {
            var c, k, g;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            k = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < k.length; c++)
              if ((g = this._readCoordinates(k[c], f, e)))
                return {
                  geometryType: "point",
                  x: g[0][0],
                  y: g[0][1],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                };
            k = a.getElementsByTagNameNS(this._gmlNS, "pos");
            for (c = 0; c < k.length; c++)
              if ((g = this._readPos(k[c], f, e)) && 0 < g.length)
                return {
                  geometryType: "point",
                  x: g[0][0],
                  y: g[0][1],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                };
            k = a.getElementsByTagNameNS(this._gmlNS, "coord");
            for (c = 0; c < k.length; c++)
              if ((a = this._readCoord(k[c], f, e)))
                return {
                  geometryType: "point",
                  x: a[0][0],
                  y: a[0][1],
                  spatialReference: { wkid: this._map.spatialReference.wkid }
                };
            return null;
          },
          _readPointMember: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            for (
              a = a.getElementsByTagNameNS(this._gmlNS, "Point");
              0 < a.length;

            )
              return this._readPoint(a[0], f, e);
            return null;
          },
          _readMultiPoint: function(a, f, e) {
            var c,
              k = this._readWkidFromNode(a);
            -1 != k && (f = k);
            k = this._readSrsDimension(a);
            0 !== k && (e = k);
            k = {
              geometryType: "multipoint",
              points: [],
              spatialReference: { wkid: this._map.spatialReference.wkid }
            };
            c = a.getElementsByTagNameNS(this._gmlNS, "pointMember");
            for (a = 0; a < c.length; a++) {
              var g = this._readPointMember(c[a], f, e);
              g && k.points.push([g.x, g.y]);
            }
            return 1 <= k.points.length ? k : null;
          },
          _readLinearRing: function(a, f, e) {
            var c, k;
            c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            k = a.getElementsByTagNameNS(this._gmlNS, "coordinates");
            for (c = 0; c < k.length; )
              return this._readCoordinates(k[c], f, e);
            k = a.getElementsByTagNameNS(this._gmlNS, "posList");
            for (c = 0; c < k.length; )
              return this._readCoordinates(k[c], f, e);
            k = a.getElementsByTagNameNS(this._gmlNS, "pos");
            for (c = 0; c < k.length; ) return this._readPos(k[c], f, e);
          },
          _readCoordinatesBody: function(a, f, e) {
            var c,
              k = new G(a);
            f = f.trim();
            var g,
              m,
              w = [];
            w.spatialReference = { wkid: this._map.spatialReference.wkid };
            a = this._isReverse(a, this.version);
            if (f)
              if (2 === e) {
                if ((f = f.match(/[0123456789.\-\+eE]+/g)) && 2 <= f.length)
                  for (e = 0; e < f.length; e += 2)
                    (g = parseFloat(f[e])),
                      (m = parseFloat(f[e + 1])),
                      a && ((c = m), (m = g), (g = c)),
                      (c = {}),
                      this._projectFromSRToSR(
                        k,
                        this._map.spatialReference,
                        g,
                        m,
                        c
                      ) && ((g = c.x), (m = c.y)),
                      w.push([g, m]);
              } else if (
                3 === e &&
                (f = f.match(/[0123456789.\-\+eE]+/g)) &&
                3 <= f.length
              )
                for (e = 0; e < f.length; e += 3)
                  (g = parseFloat(f[e])),
                    (m = parseFloat(f[e + 1])),
                    a && ((c = m), (m = g), (g = c)),
                    (c = {}),
                    this._projectFromSRToSR(
                      k,
                      this._map.spatialReference,
                      g,
                      m,
                      c
                    ) && ((g = c.x), (m = c.y)),
                    w.push([g, m]);
            return w;
          },
          _readCoord: function(a, f, e) {
            var c,
              k,
              g,
              m,
              w = this._readWkidFromNode(a);
            -1 != w && (f = w);
            w = new G(f);
            g = this._readSrsDimension(a);
            0 !== g && (e = g);
            var n = this._isReverse(f, this.version),
              b = [];
            b.spatialReference = { wkid: this._map.spatialReference.wkid };
            g = 0;
            k = a.getElementsByTagNameNS(this._gmlNS, "X");
            for (c = 0; c < k.length; ) {
              g = this._readFloat(k[c], f, e);
              break;
            }
            m = 0;
            k = a.getElementsByTagNameNS(this._gmlNS, "Y");
            for (c = 0; c < k.length; ) {
              m = this._readFloat(k[c], f, e);
              break;
            }
            n && ((a = m), (m = g), (g = a));
            a = {};
            this._projectFromSRToSR(w, this._map.spatialReference, g, m, a) &&
              ((g = a.x), (m = a.y));
            b.push(n ? [m, g] : [g, m]);
            return b;
          },
          _readCoordinates: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            return this._readCoordinatesBody(f, a.textContent, e);
          },
          _readPos: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            return this._readCoordinatesBody(f, a.textContent, e);
          },
          _readPosList: function(a, f, e) {
            var c = this._readWkidFromNode(a);
            -1 != c && (f = c);
            c = this._readSrsDimension(a);
            0 !== c && (e = c);
            return this._readCoordinatesBody(f, a.textContent, e);
          },
          _projectFromSRToSR: function(a, f, e, c, k) {
            if (v.canProject(a, f))
              return (
                (a = new n(e, c, a)),
                (f = v.project(a, f)),
                (k.x = f.x),
                (k.y = f.y),
                !0
              );
            k.x = e;
            k.y = c;
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
          _isReverse: function(a, f) {
            return this._inverseResponse;
          },
          _appendCustomParameters: function(a) {
            if (this.customParameters)
              for (var f in this.customParameters)
                a +=
                  (-1 === a.indexOf("?") ? "?" : "\x26") +
                  f +
                  "\x3d" +
                  encodeURIComponent(this.customParameters[f]);
            return a;
          }
        });
        u("extend-esri") && q.setObject("layers.WFSLayer", p, t);
        return p;
      });
    },
    "widgets/AddData/search/SearchPane": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/on dojo/dom-class dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/SearchPane.html dojo/i18n!../nls/strings ./SearchBox ./BBoxOption ./ScopeOptions ./TypeOptions ./SortOptions ./ResultsPane ./Paging ./ResultCount".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z) {
        return p([u, b, r], {
          i18n: z,
          templateString: t,
          qDefaultFilter: null,
          qRequiredFilter: null,
          searchOnStart: !0,
          searchContext: null,
          wabWidget: null,
          _dfd: null,
          postCreate: function() {
            this.inherited(arguments);
            q.forEach(
              this.getComponents(),
              function(b) {
                b.searchPane = this;
              },
              this
            );
          },
          startup: function() {
            this._started ||
              (this.inherited(arguments),
              this.bindEvents(),
              this.searchOnStart && this.search());
          },
          _onFilterPlaceholderChanged: function() {
            d.contains(this.filterPlaceholder, "opened")
              ? (d.remove(this.filterPlaceholder, "opened"),
                d.remove(this.filterWrapper, "show"))
              : ((this.filterWrapper.style.top =
                  this.headerNode.clientHeight + "px"),
                d.add(this.filterPlaceholder, "opened"),
                d.add(this.filterWrapper, "show"));
          },
          _onSearchBoxPlaceholderChanged: function() {},
          bindEvents: function() {
            this.own(
              l(
                this.filterPlaceholder,
                "click",
                h.hitch(this, this._onFilterPlaceholderChanged)
              )
            );
          },
          buildQueryParams: function(b) {
            var d = null;
            "string" === typeof this.qRequiredFilter &&
              0 < this.qRequiredFilter.length &&
              (d = this.qRequiredFilter);
            var r = { q: d, canSortByRelevance: !1 };
            q.forEach(this.getComponents(), function(d) {
              d.appendQueryParams(r, b);
            });
            delete r.canSortByRelevance;
            null === r.q &&
              "string" === typeof this.qDefaultFilter &&
              0 < this.qDefaultFilter.length &&
              (r.q = this.qDefaultFilter);
            return r;
          },
          getComponents: function() {
            return [
              this.searchBox,
              this.bboxOption,
              this.scopeOptions,
              this.typeOptions,
              this.sortOptions,
              this.resultsPane,
              this.paging,
              this.resultCount
            ];
          },
          resize: function() {
            this.contentNode.style.top =
              this.headerNode.clientHeight + 1 + "px";
          },
          search: function() {
            var b = this,
              d = {},
              r = this.buildQueryParams(d);
            if (null !== r && null !== r.q) {
              r && null === r.sortField && (r.sortOrder = "desc");
              var t = this.searchContext.portal;
              d.scopeIsArcGISOnline &&
                this.searchContext.arcgisOnlinePortal &&
                (t = this.searchContext.arcgisOnlinePortal);
              null !== this._dfd && this._dfd.cancel("Search aborted.", !1);
              var h = null;
              this._dfd = h = t
                .queryItems(r)
                .then(function(d) {
                  h.isCanceled() ||
                    (d.queryParams ||
                      ((d.queryParams = { start: d.start, num: d.num }),
                      d.nextQueryParams ||
                        "undefined" === typeof d.nextStart ||
                        -1 === d.nextStart ||
                        (d.nextQueryParams = { start: d.nextStart })),
                    q.forEach(b.getComponents(), function(b) {
                      b.processResults(d);
                    }));
                })
                .otherwise(function(b) {
                  console.warn("searchError", b);
                });
            }
          },
          _showLayers: function() {
            this.wabWidget && this.wabWidget.showLayers();
          }
        });
      });
    },
    "widgets/AddData/search/SearchBox": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/on dojo/keys ./SearchComponent dojo/text!./templates/SearchBox.html dojo/i18n!../nls/strings".split(
        " "
      ), function(p, h, q, l, d, u, b) {
        return p([d], {
          i18n: b,
          templateString: u,
          postCreate: function() {
            this.inherited(arguments);
            this._checkClearButton();
            this.own(
              q(
                this.searchTextBox,
                "keyup",
                h.hitch(this, function(b) {
                  this._checkClearButton();
                  b.keyCode === l.ENTER && this.search();
                })
              )
            );
          },
          _checkClearButton: function() {},
          clearButtonClicked: function() {
            this.searchTextBox.value = "";
            this._checkClearButton();
            this.search();
          },
          searchButtonClicked: function() {
            this.search();
          },
          appendQueryParams: function(b) {
            var d = this.searchTextBox.value;
            null !== d && (d = h.trim(d));
            null !== d &&
              0 < d.length &&
              ((b.canSortByRelevance = !0),
              (d = "(" + d + ")"),
              (b.q = null !== b.q && 0 < b.q.length ? b.q + (" AND " + d) : d));
          }
        });
      });
    },
    "widgets/AddData/search/SearchComponent": function() {
      define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin"
      ], function(p, h, q, l) {
        return p([h, q, l], {
          isSearchComponent: !0,
          searchPane: null,
          template: "\x3cdiv\x3e\x3c/div\x3e",
          postCreate: function() {
            this.inherited(arguments);
          },
          appendQueryParams: function(d, h) {},
          processResults: function(d) {},
          getConfig: function() {
            return this.searchPane &&
              this.searchPane.wabWidget &&
              this.searchPane.wabWidget.config
              ? this.searchPane.wabWidget.config
              : {};
          },
          getMap: function() {
            return this.searchPane && this.searchPane.wabWidget
              ? this.searchPane.wabWidget.map
              : null;
          },
          search: function() {
            this.searchPane && this.searchPane.search();
          }
        });
      });
    },
    "widgets/AddData/search/BBoxOption": function() {
      define([
        "dojo/_base/declare",
        "./SearchComponent",
        "dojo/text!./templates/BBoxOption.html",
        "dojo/i18n!../nls/strings",
        "dijit/form/CheckBox"
      ], function(p, h, q, l) {
        return p([h], {
          i18n: l,
          templateString: q,
          postCreate: function() {
            this.inherited(arguments);
            this.bboxToggle.set("checked", !0);
          },
          bboxClicked: function() {
            this.search();
          },
          _getBBox: function() {
            var d;
            if ((d = this.getMap()))
              if ((d = d.geographicExtent))
                return d.xmin + "," + d.ymin + "," + d.xmax + "," + d.ymax;
            return null;
          },
          appendQueryParams: function(d) {
            if (this.bboxToggle.get("checked")) {
              var h = this._getBBox();
              null !== h && ((d.canSortByRelevance = !0), (d.bbox = h));
            }
          }
        });
      });
    },
    "widgets/AddData/search/ScopeOptions": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-class ./SearchComponent dojo/text!./templates/ScopeOptions.html dojo/i18n!../nls/strings ./util".split(
        " "
      ), function(p, h, q, l, d, u, b, r) {
        return p([d], {
          i18n: b,
          templateString: u,
          curatedFilter: null,
          postCreate: function() {
            this.inherited(arguments);
          },
          startup: function() {
            this._started || (this.inherited(arguments), this.initOptions());
          },
          hideDropdown: function() {
            l.remove(this.scopePlaceholder, "opened");
            l.remove(this.btnGroup, "show");
          },
          initOptions: function() {
            var d = this.searchPane.searchContext,
              q = "string" === typeof d.username && 0 < d.username.length,
              p = this.getConfig().scopeOptions;
            this.curatedFilter = p.Curated.filter;
            var y = null,
              d = function(d, t) {
                var l = p[d];
                l && l.allow
                  ? ("string" === typeof l.label && 0 < h.trim(l.label).length
                      ? r.setNodeText(t, h.trim(l.label))
                      : q ||
                        "MyOrganization" !== d ||
                        r.setNodeText(
                          t,
                          b.search.scopeOptions.anonymousContent
                        ),
                    p.defaultScope === d && (y = t))
                  : (t.style.display = "none");
              };
            d("MyContent", this.MyContentToggle);
            d("MyOrganization", this.MyOrganizationToggle);
            d("Curated", this.CuratedToggle);
            d("ArcGISOnline", this.ArcGISOnlineToggle);
            y ||
              (p.MyOrganization.allow
                ? (y = this.MyOrganizationToggle)
                : p.ArcGISOnline.allow
                ? (y = this.ArcGISOnlineToggle)
                : p.Curated.allow
                ? (y = this.CuratedToggle)
                : p.MyContent.allow && (y = this.MyContentToggle));
            y &&
              (l.add(y, "active"),
              (this.scopePlaceholderText.innerHTML = y.innerHTML));
          },
          optionClicked: function(b) {
            this.toggleClassName(b);
            this.hideDropdown();
            this.search();
          },
          scopePlaceholderClicked: function(b) {
            b.preventDefault();
            l.contains(this.scopePlaceholder, "opened")
              ? this.hideDropdown()
              : this.showDropdown();
          },
          showDropdown: function() {
            l.add(this.scopePlaceholder, "opened");
            l.add(this.btnGroup, "show");
          },
          toggleClassName: function(b) {
            q.forEach(this.btnGroup.children, function(b) {
              l.remove(b, "active");
            });
            l.add(b.target, "active");
            this.scopePlaceholderText.innerHTML = b.target.innerHTML;
          },
          appendQueryParams: function(b, d) {
            var h = null;
            q.some(this.btnGroup.children, function(b) {
              if (l.contains(b, "active"))
                return (h = b.getAttribute("data-option-name")), !0;
            });
            "undefined" === typeof h && (h = null);
            var t = null,
              p = this.curatedFilter,
              z = this.searchPane.searchContext,
              u = z.username,
              C = z.orgId;
            "MyContent" === h
              ? "string" === typeof u &&
                0 < u.length &&
                (t = "(owner:" + r.escapeForLucene(u) + ")")
              : "MyOrganization" === h
              ? "string" === typeof C &&
                0 < C.length &&
                (t = "(orgid:" + r.escapeForLucene(C) + ")")
              : "Curated" === h
              ? "string" === typeof p && 0 < p.length && (t = p)
              : "ArcGISOnline" === h &&
                z.allowArcGISOnline &&
                (d.scopeIsArcGISOnline = !0);
            null !== t &&
              0 < t.length &&
              ((t = "(" + t + ")"),
              (b.q = null !== b.q && 0 < b.q.length ? b.q + (" AND " + t) : t));
          }
        });
      });
    },
    "widgets/AddData/search/TypeOptions": function() {
      define("dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/on ./SearchComponent dojo/text!./templates/TypeOptions.html dojo/i18n!../nls/strings esri/layers/VectorTileLayer dijit/TooltipDialog dijit/form/DropDownButton jimu/dijit/CheckBox".split(
        " "
      ), function(p, h, q, l, d, u, b, r) {
        return p([d], {
          i18n: b,
          templateString: u,
          postCreate: function() {
            this.inherited(arguments);
            (r && r.supported()) ||
              (console.warn("AddData: Vector Tile is not supported."),
              (this.vectorTileNode.style.display = "none"));
            this.own(
              l(
                this.tooltipDialog,
                "open",
                q.hitch(this, function() {
                  this.tooltipDialog.domNode.className +=
                    " " + this.searchPane.wabWidget.appConfig.theme.name;
                })
              )
            );
            this.own(
              l(
                this.mapServiceToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
            this.own(
              l(
                this.featureServiceToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
            this.own(
              l(
                this.imageServiceToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
            this.own(
              l(
                this.vectorTileServiceToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
            this.own(
              l(
                this.kmlToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
            this.own(
              l(
                this.wmsToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
            this.own(
              l(
                this.wfsToggle,
                "change",
                q.hitch(this, function() {
                  this.search();
                })
              )
            );
          },
          getOptionWidgets: function() {
            return [
              this.mapServiceToggle,
              this.featureServiceToggle,
              this.imageServiceToggle,
              this.vectorTileServiceToggle,
              this.kmlToggle,
              this.wmsToggle,
              this.wfsToggle
            ];
          },
          optionClicked: function() {},
          appendQueryParams: function(b) {
            var d = function(b, d) {
                0 < b.length && (b += " OR ");
                return b + d;
              },
              r = "",
              l = "",
              t = !1;
            h.forEach(this.getOptionWidgets(), function(b) {
              var h = b.domNode.getAttribute("data-option-q");
              l = d(l, h);
              b.getValue() && ((r = d(r, h)), (t = !0));
            });
            t || (r = l);
            null !== r &&
              0 < r.length &&
              ((r = "(" + r + ")"),
              (b.q = null !== b.q && 0 < b.q.length ? b.q + (" AND " + r) : r));
          }
        });
      });
    },
    "esri/layers/VectorTileLayer": function() {
      (function() {
        var p = (function() {
            var h;
            try {
              h = window.WebGLRenderingContext;
            } catch (t) {
              h = !1;
            }
            var l;
            try {
              for (
                var d = document.createElement("canvas"),
                  p = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
                  b = null,
                  r = 0;
                r < p.length;
                ++r
              ) {
                try {
                  b = d.getContext(p[r]);
                } catch (t) {}
                if (b) break;
              }
              l = b;
            } catch (t) {
              l = !1;
            }
            return h && l ? !0 : !1;
          })(),
          h = [
            "dojo/_base/lang",
            "dojo/has",
            "dojo/Deferred",
            "../sniff",
            "./layer"
          ];
        p && h.push("./VectorTileLayerImpl");
        define(h, function(h, l, d, u, b, r) {
          b = r
            ? r
            : b.createSubclass({
                declaredClass: "esri.layers.VectorTileLayer",
                constructor: function() {
                  var b = new d();
                  b.reject(
                    Error("esri.layers.VectorTileLayer is not supported")
                  );
                  b.promise.otherwise(
                    h.hitch(this, function(b) {
                      this._errorHandler(b);
                    })
                  );
                }
              });
          b.ACCESS_TOKEN = null;
          b.supported = function() {
            return p;
          };
          l("extend-esri") && h.setObject("layers.VectorTileLayer", b, u);
          return b;
        });
      })();
    },
    "widgets/AddData/search/SortOptions": function() {
      define("dojo/_base/declare dojo/on dojo/dom-class ./SearchComponent dojo/text!./templates/SortOptions.html dojo/i18n!../nls/strings dijit/form/Select".split(
        " "
      ), function(p, h, q, l, d, u) {
        return p([l], {
          i18n: u,
          templateString: d,
          sortField: null,
          sortOrder: null,
          postCreate: function() {
            this.inherited(arguments);
            this.updateSortOrderButton();
            var b = this;
            this.own(
              this.sortSelect.on("change", function() {
                var d = (b.sortField = b.sortSelect.get("value"));
                if ("" === d) b.sortOrder = null;
                else if ("title" === d || "owner" === d) b.sortOrder = "asc";
                else if (
                  "avgrating" === d ||
                  "numviews" === d ||
                  "modified" === d
                )
                  b.sortOrder = "desc";
                b.updateSortOrderButton();
                b.search();
              })
            );
            this.own(
              h(this.sortSelect.dropDown, "open", function() {
                var b = this.domNode.parentElement;
                b && q.add(b, "add-data-widget-popup");
              })
            );
          },
          sortOrderClicked: function() {
            "asc" === this.sortOrder
              ? ((this.sortOrder = "desc"),
                this.updateSortOrderButton(),
                this.search())
              : "desc" === this.sortOrder &&
                ((this.sortOrder = "asc"),
                this.updateSortOrderButton(),
                this.search());
          },
          updateSortOrderButton: function() {
            var b = this.sortOrderBtn;
            b.style.visibility =
              null !== this.sortField && 0 < this.sortField.length
                ? "visible"
                : "hidden";
            "desc" === this.sortOrder
              ? q.add(b, "descending")
              : q.remove(b, "descending");
          },
          appendQueryParams: function(b) {
            b.sortField = null;
            b.sortOrder = null;
            var d = this.sortField,
              h = this.sortOrder;
            null !== d && 0 < d.length
              ? ((b.sortField = d),
                null !== h && 0 < h.length && (b.sortOrder = h))
              : b.canSortByRelevance ||
                ((b.sortField = "numviews"), (b.sortOrder = "desc"));
          }
        });
      });
    },
    "widgets/AddData/search/ResultsPane": function() {
      define("dojo/_base/declare dojo/_base/array ./SearchComponent dojo/text!./templates/ResultsPane.html dojo/i18n!../nls/strings ./ItemCard ./util".split(
        " "
      ), function(p, h, q, l, d, u, b) {
        return p([q], {
          i18n: d,
          templateString: l,
          postCreate: function() {
            this.inherited(arguments);
          },
          addItem: function(b) {
            b.placeAt(this.itemsNode);
          },
          destroyItems: function() {
            this.noMatchNode.style.display = "none";
            this.noMatchNode.innerHTML = "";
            this.destroyDescendants(!1);
          },
          showNoMatch: function() {
            b.setNodeText(this.noMatchNode, d.search.resultsPane.noMatch);
            this.noMatchNode.style.display = "block";
          },
          processResults: function(d) {
            this.destroyItems();
            var r = d.results;
            if (r && 0 < r.length) {
              var l = b.findLayersAdded(this.getMap(), null).itemIds;
              h.forEach(
                d.results,
                function(b) {
                  this.addItem(
                    new u({
                      item: b,
                      canRemove: -1 !== l.indexOf(b.id),
                      resultsPane: this
                    })
                  );
                },
                this
              );
            } else this.showNoMatch();
          }
        });
      });
    },
    "widgets/AddData/search/ItemCard": function() {
      define("dojo/_base/declare dojo/_base/array dojo/date/locale dojo/dom-class dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/ItemCard.html dojo/i18n!../nls/strings ./util ./LayerLoader".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z, E) {
        return p([d, u, b], {
          i18n: t,
          templateString: r,
          canRemove: !1,
          item: null,
          resultsPane: null,
          _dfd: null,
          postCreate: function() {
            this.inherited(arguments);
          },
          startup: function() {
            this._started || (this.inherited(arguments), this.render());
          },
          addClicked: function() {
            var b = this,
              d = this.addButton;
            if (!l.contains(d, "disabled"))
              if ((l.add(d, "disabled"), this.canRemove)) {
                var r = this.resultsPane.getMap();
                z.setNodeText(b.messageNode, t.search.item.messages.removing);
                var p = z.findLayersAdded(r, this.item.id).layers;
                h.forEach(p, function(b) {
                  r.removeLayer(b);
                });
                this.canRemove = !1;
                z.setNodeText(b.messageNode, "");
                z.setNodeText(this.addButton, t.search.item.actions.add);
                l.remove(d, "disabled");
              } else
                z.setNodeText(b.messageNode, t.search.item.messages.adding),
                  new E()
                    .addItem(this.item, this.resultsPane.getMap())
                    .then(function(h) {
                      h
                        ? ((b.canRemove = !0),
                          z.setNodeText(b.messageNode, ""),
                          z.setNodeText(
                            b.addButton,
                            t.search.item.actions.remove
                          ))
                        : z.setNodeText(
                            b.messageNode,
                            t.search.item.messages.addFailed
                          );
                      l.remove(d, "disabled");
                    })
                    .otherwise(function(h) {
                      console.warn("Add layer failed.");
                      console.warn(h);
                      z.setNodeText(
                        b.messageNode,
                        t.search.item.messages.addFailed
                      );
                      l.remove(d, "disabled");
                      h &&
                        "string" === typeof h.message &&
                        0 < h.message.length &&
                        console.log("");
                    });
          },
          detailsClicked: function() {
            var b = this.item,
              b =
                z.checkMixedContent(b.portalUrl) +
                "/home/item.html?id\x3d" +
                encodeURIComponent(b.id);
            window.open(b);
          },
          formatDate: function(b) {
            "number" === typeof b && (b = new Date(b));
            return q.format(b, {
              selector: "date",
              datePattern: t.search.item.dateFormat
            });
          },
          render: function() {
            z.setNodeText(this.titleNode, this.item.title);
            z.setNodeTitle(this.titleNode, this.item.title);
            this._renderThumbnail();
            this._renderTypeOwnerDate();
            this.canRemove &&
              z.setNodeText(this.addButton, t.search.item.actions.remove);
          },
          _renderThumbnail: function() {
            var b = this.thumbnailNode,
              d = this.item.thumbnailUrl;
            b.innerHTML = "";
            var d = z.checkMixedContent(d),
              h = document.createElement("IMG");
            h.src = d || "widgets/AddData/images/placeholder_120x80.png";
            b.appendChild(h);
          },
          _renderTypeOwnerDate: function() {
            var b,
              d = this.item;
            b = t.search.item.types[d.type];
            if ("undefined" === typeof b || null === b) b = d.type;
            b = t.search.item.typeByOwnerPattern.replace("{type}", b);
            b = b.replace("{owner}", d.owner);
            z.setNodeText(this.typeByOwnerNode, b);
          }
        });
      });
    },
    "widgets/AddData/search/LayerLoader": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/promise/all dojo/Deferred dojo/json dojo/i18n!../nls/strings ./util esri/lang esri/request esri/arcgis/utils esri/layers/ArcGISDynamicMapServiceLayer esri/layers/ArcGISImageServiceLayer esri/layers/ArcGISTiledMapServiceLayer esri/layers/DynamicLayerInfo esri/layers/FeatureLayer esri/layers/ImageParameters esri/layers/ImageServiceParameters esri/layers/KMLLayer esri/layers/LayerDrawingOptions esri/layers/MosaicRule esri/layers/RasterFunction esri/layers/VectorTileLayer esri/layers/WFSLayer esri/layers/WMSLayer esri/layers/WMSLayerInfo esri/dijit/PopupTemplate esri/InfoTemplate esri/renderers/jsonUtils esri/geometry/Extent esri/SpatialReference jimu/utils".split(
        " "
      ), function(
        p,
        h,
        q,
        l,
        d,
        u,
        b,
        r,
        t,
        z,
        E,
        y,
        H,
        B,
        F,
        C,
        G,
        v,
        g,
        n,
        A,
        D,
        x,
        I,
        e,
        a,
        f,
        m,
        c,
        k,
        J,
        K
      ) {
        return p(null, {
          item: null,
          itemUrl: null,
          map: null,
          serviceUrl: null,
          constructor: function(a) {
            h.mixin(this, a);
          },
          addItem: function(a, c) {
            var f = new d();
            this.map = c;
            this.item = a;
            this.itemUrl = this._checkMixedContent(a.itemUrl);
            this.serviceUrl = this._checkMixedContent(a.url);
            if ("Feature Service" === a.type) return this._addFeatureService();
            if ("Image Service" === a.type) return this._addImageService();
            if ("KML" === a.type) return this._addKML();
            if ("Map Service" === a.type) return this._addMapService();
            if ("Vector Tile Service" === a.type)
              return this._addVectorTileService();
            if ("WFS" === a.type) return this._addWFS();
            if ("WMS" === a.type) return this._addWMS();
            console.warn("Unsupported item type: ", a.type);
            f.resolve(null);
            return f;
          },
          _addFeatureService: function() {
            var a = this,
              c = new d(),
              f = this.serviceUrl,
              e = this.item,
              k = {},
              g = null,
              m = [],
              b = [];
            a._readItemJsonData()
              .then(function(c) {
                ((k = c || {}), k.layers) &&
                  0 < k.layers.length &&
                  q.forEach(k.layers, function(a) {
                    "undefined" !== typeof a.id &&
                      null !== a.id &&
                      (null === g && (g = []), g.push(a.id));
                  });
                return a._readRestInfo(f);
              })
              .then(function(c) {
                if (
                  !c ||
                  "string" !== typeof c.type ||
                  ("Feature Layer" !== c.type && "Table" !== c.type)
                ) {
                  var e = [];
                  c &&
                    c.layers &&
                    0 < c.layers.length &&
                    q.forEach(c.layers, function(a) {
                      e.push(a);
                    });
                  c &&
                    c.tables &&
                    0 < c.tables.length &&
                    q.forEach(c.tables, function(a) {
                      e.push(a);
                    });
                  0 < e.length
                    ? q.forEach(e, function(c) {
                        var e = !0;
                        null !== g &&
                          0 < g.length &&
                          (e = q.some(g, function(a) {
                            return a === c.id;
                          }));
                        e &&
                          ((e = new C(f + "/" + c.id, {
                            id: a._generateLayerId(),
                            outFields: ["*"]
                          })),
                          m.push(a._waitForLayer(e)));
                      })
                    : console.warn("No layers or tables...");
                } else (c = new C(f, { id: a._generateLayerId(), outFields: ["*"] })), m.push(a._waitForLayer(c));
                return l(m);
              })
              .then(function(a) {
                q.forEach(a, function(a) {
                  b.push(a);
                });
                b.reverse();
                return b;
              })
              .then(function() {
                q.forEach(b, function(c) {
                  var f = a._processFeatureLayer(c, e, k);
                  c.arcgisProps = { title: f.title };
                  c._titleForLegend = f.title;
                  t.isDefined(c.title) || (c.title = f.title);
                  a._addLayer(c);
                });
              })
              .then(function() {
                c.resolve(b);
              })
              .otherwise(function(a) {
                c.reject(a);
              });
            return c;
          },
          _addImageService: function() {
            var a = this,
              c = new d();
            a._readItemJsonData()
              .then(function(c) {
                return a._newImageServiceLayer(c || {});
              })
              .then(function(f) {
                a._addLayer(f);
                c.resolve(f);
              })
              .otherwise(function(a) {
                c.reject(a);
              });
            return c;
          },
          _addKML: function() {
            var a = this,
              c = new d();
            a._newKMLLayer()
              .then(function(f) {
                f && (f.title = a.item.title);
                a._addLayer(f);
                c.resolve(f);
              })
              .otherwise(function(a) {
                c.reject(a);
              });
            return c;
          },
          _addMapService: function() {
            var a = this,
              c = new d();
            a._readItemJsonData()
              .then(function(c) {
                return a._newMapServiceLayer(c || {});
              })
              .then(function(f) {
                a._addLayer(f);
                c.resolve(f);
              })
              .otherwise(function(a) {
                c.reject(a);
              });
            return c;
          },
          _addVectorTileService: function() {
            var a = this,
              c = new d();
            a._newVectorTileLayer()
              .then(function(f) {
                a._addLayer(f);
                c.resolve(f);
              })
              .otherwise(function(a) {
                c.reject(a);
              });
            return c;
          },
          _addWFS: function() {
            var a = this,
              c = new d();
            a._readItemJsonData()
              .then(function(c) {
                return a._newWFSLayer(c || {});
              })
              .then(function(f) {
                f && (f.title = a.item.title);
                a._addLayer(f);
                c.resolve(f);
              })
              .otherwise(function(a) {
                console.log("Error adding WFS", a);
                c.reject(a);
              });
            return c;
          },
          _addWMS: function() {
            var a = this,
              c = new d();
            a._readItemJsonData()
              .then(function(c) {
                return a._newWMSLayer(c || {});
              })
              .then(function(f) {
                f && (f.title = a.item.title);
                a._addLayer(f);
                c.resolve(f);
              })
              .otherwise(function(a) {
                c.reject(a);
              });
            return c;
          },
          _addLayer: function(a) {
            var c = this.item;
            a &&
              ((a.xtnItemId = c.id),
              (a.xtnAddData = !0),
              !a.arcgisProps &&
                c &&
                ((a.arcgisProps = { title: c.title }),
                (a._titleForLegend = c.title)),
              t.isDefined(a.title) || (a.title = c.title),
              (a._wabProperties = {
                itemLayerInfo: {
                  itemId: c.id,
                  itemUrl: this.itemUrl,
                  portalUrl: c.portalUrl
                }
              }),
              this.map.addLayer(a));
          },
          _checkMixedContent: function(a) {
            return r.checkMixedContent(a);
          },
          _checkUrl: function(a) {
            return E._checkUrl(a);
          },
          _checkVectorTileUrl: function(a, c) {
            var f = new d();
            if (
              (function(a, c) {
                return -1 !== a.indexOf(c, a.length - c.length);
              })(a, ".json")
            )
              return (c.styleUrl = a), f.resolve(a), f;
            var e = {
              url: null,
              content: {},
              handleAs: "json",
              callbackParamName: "callback"
            };
            this.itemUrl
              ? ((e.url = this.itemUrl + "/resources/styles/root.json"),
                z(e, {})
                  .then(function() {
                    c.styleUrl = e.url;
                    f.resolve(e.url);
                  })
                  .otherwise(function() {
                    e.url = a + "/resources/styles/root.json";
                    z(e, {})
                      .then(function() {
                        c.styleUrl = e.url;
                        f.resolve(e.url);
                      })
                      .otherwise(function() {
                        c.url = a;
                        f.resolve(a);
                      });
                  }))
              : ((e.url = a + "/resources/styles/root.json"),
                z(e, {})
                  .then(function() {
                    c.styleUrl = e.url;
                    f.resolve(e.url);
                  })
                  .otherwise(function() {
                    c.url = a;
                    f.resolve(a);
                  }));
            return f;
          },
          _generateLayerId: function() {
            return this._generateLayerIds(1)[0];
          },
          _generateLayerIds: function(a) {
            var c,
              f = [];
            for (c = 0; c < a; c++) f.push(this._generateRandomId());
            return f;
          },
          _generateRandomId: function() {
            var a = null,
              a =
                "function" === typeof Date.now
                  ? Date.now()
                  : new Date().getTime(),
              c = ("" + Math.random()).replace("0.", "r");
            return (a + "" + c).replace(/-/g, "");
          },
          _makeFeatureLayerTitle: function(a, c, f) {
            var e, k, g;
            try {
              if (
                (c && f && c === f) ||
                (c &&
                  f &&
                  ((e = f.indexOf(c)),
                  0 === e &&
                    ((k = f.substring(e + c.length + 1)),
                    13 <= k.length && ((g = /^\d+$/), g.test(k)))))
              )
                return c;
            } catch (R) {}
            return a.replace("{serviceName}", c).replace("{layerName}", f);
          },
          _newImageServiceLayer: function(a) {
            var c = new d(),
              e = this._generateLayerId(),
              k = this.serviceUrl,
              g = {
                mapLayerId: e,
                bandIds: null,
                format: null,
                compressionQuality: null,
                opacity: 1,
                visibility: !0
              };
            t.isDefined(a.visibility) &&
              !1 === a.visibility &&
              (g.visibility = !1);
            t.isDefined(a.opacity) && (g.opacity = a.opacity);
            t.isDefined(a.minScale) &&
              !t.isDefined(g.minScale) &&
              (g.minScale = a.minScale);
            t.isDefined(a.maxScale) &&
              !t.isDefined(g.maxScale) &&
              (g.maxScale = a.maxScale);
            t.isDefined(a.refreshInterval) &&
              !t.isDefined(g.refreshInterval) &&
              (g.refreshInterval = a.refreshInterval);
            !a.popupInfo ||
              g.popupInfo ||
              g.disablePopup ||
              (g.popupInfo = a.popupInfo);
            a.renderingRule &&
              !g.renderingRule &&
              ((g.renderingRule = a.renderingRule),
              a.renderingRule.functionName &&
                (g.renderingRule.rasterFunction =
                  a.renderingRule.functionName));
            a.bandIds && !g.bandIds && (g.bandIds = a.bandIds);
            a.mosaicRule && !g.mosaicRule && (g.mosaicRule = a.mosaicRule);
            a.format && !g.format && (g.format = a.format);
            t.isDefined(a.compressionQuality) &&
              !t.isDefined(g.compressionQuality) &&
              (g.compressionQuality = a.compressionQuality);
            !a.layerDefinition ||
              !a.layerDefinition.definitionExpression ||
              (t.isDefined(g.layerDefinition) &&
                t.isDefined(g.layerDefinition.definitionExpression)) ||
              ((g.layerDefinition = g.layerDefinition || {}),
              (g.layerDefinition.definitionExpression =
                a.layerDefinition.definitionExpression));
            a = new v();
            null !== g.bandIds && (a.bandIds = g.bandIds);
            null !== g.format &&
              ((a.format = g.format),
              null !== g.compressionQuality &&
                (a.compressionQuality = g.compressionQuality));
            g.renderingRule &&
              g.renderingRule.rasterFunction &&
              ((e = new D(g.renderingRule)), (a.renderingRule = e));
            g.mosaicRule && ((e = new A(g.mosaicRule)), (a.mosaicRule = e));
            t.isDefined(g.noData) && (a.noData = g.noData);
            t.isDefined(g.noDataInterpretation) &&
              (a.noDataInterpretation = g.noDataInterpretation);
            t.isDefined(g.interpolation) && (a.interpolation = g.interpolation);
            a = {
              imageServiceParameters: a,
              opacity: g.opacity,
              visible: g.visibility
            };
            t.isDefined(g.mapLayerId) && (a.id = g.mapLayerId);
            t.isDefined(g.minScale) && (a.minScale = g.minScale);
            t.isDefined(g.maxScale) && (a.maxScale = g.maxScale);
            t.isDefined(g.refreshInterval) &&
              (a.refreshInterval = g.refreshInterval);
            t.isDefined(g.resourceInfo) && (a.resourceInfo = g.resourceInfo);
            k = new H(this._checkUrl(k), a);
            this._waitForLayer(k).then(
              function(a) {
                g.layerDefinition &&
                  g.layerDefinition.definitionExpression &&
                  a.setDefinitionExpression(
                    g.layerDefinition.definitionExpression,
                    !0
                  );
                !g.disablePopup &&
                  g.popupInfo &&
                  a.setInfoTemplate(new f(g.popupInfo));
                c.resolve(a);
              },
              function(a) {
                c.reject(a);
              }
            );
            return c;
          },
          _newInfoTemplate: function(a, c) {
            if (a)
              try {
                return new f({
                  description: a.description,
                  title: a.title,
                  showAttachments: a.showAttachments,
                  fieldInfos: a.fieldInfos,
                  mediaInfos: a.mediaInfos
                });
              } catch (M) {
                console.error(M);
              }
            a = new m();
            t.isDefined(c) && a.setTitle(c);
            return a;
          },
          _newKMLLayer: function() {
            var a = { id: this._generateLayerId() },
              a = new g(this.serviceUrl, a);
            return this._waitForLayer(a);
          },
          _newMapServiceLayer: function(a) {
            var c = this,
              f = new d(),
              e = this.serviceUrl,
              g = this._generateLayerId();
            z(
              {
                url: e,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
              },
              {}
            ).then(
              function(k) {
                var m = null,
                  m = { id: g };
                if (k.tileInfo) m = new B(e, m);
                else if (
                  (k &&
                    k.supportedImageFormatTypes &&
                    -1 !== k.supportedImageFormatTypes.indexOf("PNG32") &&
                    ((m.imageParameters = new G()),
                    (m.imageParameters.format = "png32")),
                  (m = new y(e, m)),
                  a && a.layers && 0 < a.layers.length)
                ) {
                  var b = [],
                    d,
                    w = [],
                    v,
                    x = [],
                    D;
                  q.forEach(a.layers, function(c) {
                    c.layerDefinition &&
                      c.layerDefinition.definitionExpression &&
                      (b[c.id] = c.layerDefinition.definitionExpression);
                    if (c.layerDefinition && c.layerDefinition.source) {
                      d = null;
                      D = c.layerDefinition.source;
                      if ("mapLayer" === D.type) {
                        var f = q.filter(k.layers, function(a) {
                          return a.id === D.mapLayerId;
                        });
                        f.length && (d = h.mixin(f[0], c));
                      } else d = h.mixin({}, c);
                      d &&
                        ((d.source = D),
                        delete d.popupInfo,
                        (d = new F(d)),
                        a.visibleLayers &&
                          ((f =
                            "string" === typeof a.visibleLayers
                              ? a.visibleLayers.split(",")
                              : a.visibleLayers),
                          -1 < q.indexOf(f, c.id)
                            ? (d.defaultVisibility = !0)
                            : (d.defaultVisibility = !1)),
                        w.push(d));
                    }
                    c.layerDefinition &&
                      c.layerDefinition.source &&
                      c.layerDefinition.drawingInfo &&
                      ((v = new n(c.layerDefinition.drawingInfo)),
                      (x[c.id] = v));
                  });
                  0 < b.length && m.setLayerDefinitions(b);
                  0 < w.length &&
                    (m.setDynamicLayerInfos(w, !0),
                    0 < x.length && m.setLayerDrawingOptions(x, !0));
                }
                c._waitForLayer(m).then(
                  function(e) {
                    var g = null;
                    q.forEach(e.layerInfos, function(f) {
                      var e = null;
                      a &&
                        q.some(a.layers, function(a) {
                          if (f.id === a.id) return (e = a), !0;
                        });
                      var k = null;
                      e && e.popupInfo && (k = e.popupInfo);
                      k &&
                        (null === g && (g = {}),
                        (g[f.id] = {
                          infoTemplate: c._newInfoTemplate(k, f.name)
                        }));
                    });
                    null === e.infoTemplates &&
                      (g
                        ? (e.infoTemplates = g)
                        : c._setDynamicLayerInfoTemplates(e));
                    f.resolve(e);
                  },
                  function(a) {
                    f.reject(a);
                  }
                );
              },
              function(a) {
                f.reject(a);
              }
            );
            return f;
          },
          _getVisibleFeatureLayers: function(a, c) {
            if (!a || !c || 0 === c.length) return [];
            c = "," + c + ",";
            var f = [],
              e,
              g = ",";
            for (e = 0; e < a.length; e++)
              if (null !== a[e].subLayerIds) {
                if (
                  -1 === c.indexOf("," + a[e].id + ",") ||
                  -1 < g.indexOf("," + a[e].id + ",")
                )
                  g += a[e].subLayerIds.toString() + ",";
              } else
                -1 < c.indexOf("," + a[e].id + ",") &&
                  -1 === g.indexOf("," + a[e].id + ",") &&
                  f.push(a[e].id);
            return f;
          },
          _newPopupInfo: function(a, c) {
            if (a && a.fields) {
              var f = {
                title: a.name,
                fieldInfos: [],
                description: null,
                showAttachments: !0,
                mediaInfos: []
              };
              "string" === typeof c && 0 < c.length && (f.title = c);
              q.forEach(a.fields, function(a) {
                var c = K.getDefaultPortalFieldInfo(a);
                c.visible = !0;
                c.isEditable = a.editable;
                f.fieldInfos.push(c);
              });
              return f;
            }
            return null;
          },
          _newVectorTileLayer: function() {
            var a = this,
              c = new d(),
              f = {},
              e = this.serviceUrl,
              g = this._generateLayerId();
            "string" === typeof e && 0 < e.length
              ? this._checkVectorTileUrl(e, f).then(
                  function(f) {
                    "string" === typeof f && 0 < f.length
                      ? ((f = a._checkMixedContent(f)),
                        (f = new x(f, { id: g, opacity: 1, visible: !0 })),
                        a._waitForLayer(f).then(
                          function(a) {
                            c.resolve(a);
                          },
                          function(a) {
                            c.reject(a);
                          }
                        ))
                      : c.resolve(null);
                  },
                  function(a) {
                    c.reject(a);
                  }
                )
              : c.resolve(null);
            return c;
          },
          _newWFSLayer: function(a) {
            var e = new d();
            try {
              var g,
                k = this._generateLayerId();
              if (a && a.wfsInfo && a.layerDefinition)
                g = {
                  id: k,
                  mode: a.mode,
                  showLabels: !0,
                  title: a.title,
                  url: this._checkMixedContent(a.url),
                  customParameters: a.wfsInfo.customParameters,
                  maxFeatures: a.wfsInfo.maxFeatures,
                  name: a.wfsInfo.name,
                  swapXY: a.wfsInfo.swapXY,
                  version: a.wfsInfo.version,
                  geometryType: a.layerDefinition.geometryType,
                  labelingInfo: a.layerDefinition.drawingInfo.labelingInfo
                };
              else {
                var m = this.serviceUrl;
                m
                  ? r.loadWFSByUrl(e, map, this, m, k, !1)
                  : e.reject(Error("Error adding WFS, no URL"));
                return e;
              }
              var b = new I(),
                n = b.on("error", function(a) {
                  n && n.remove();
                  e.reject(a.error);
                });
              b.fromJson(g, function() {
                try {
                  n && n.remove();
                  if (a && a.wfsInfo && a.layerDefinition) {
                    t.isDefined(a.opacity) && b.setOpacity(a.opacity);
                    t.isDefined(a.visibility) && b.setVisibility(a.visibility);
                    (a.minScale || a.maxScale) &&
                      b.setScaleRange(a.minScale, a.maxScale);
                    var k = a.layerDefinition.drawingInfo;
                    k &&
                      k.renderer &&
                      (b.renderer = c.fromJson(k.renderer, {
                        geometryType: g.geometryType
                      }));
                    a.popupInfo && b.setInfoTemplate(new f(a.popupInfo));
                  }
                  e.resolve(b);
                } catch (N) {
                  console.error("Error adding WFS", N), e.reject(ex);
                }
              });
            } catch (L) {
              console.error("Error adding WFS", L), e.reject(L);
            }
            return e;
          },
          _newWMSLayer: function(c) {
            var f = this,
              g = this.item,
              m = !1,
              b = null,
              n = { id: this._generateLayerId() };
            if (c) {
              var d = [],
                v = [];
              q.forEach(
                c.layers,
                function(c) {
                  m = !0;
                  v.push(
                    new a({
                      name: c.name,
                      title: c.title,
                      legendURL: c.legendURL,
                      queryable: c.queryable,
                      showPopup: c.showPopup
                    })
                  );
                  d.push(c.name);
                },
                this
              );
              c.visibleLayers && (d = c.visibleLayers);
              n = {
                customLayerParameters: c.customLayerParameters,
                customParameters: c.customParameters,
                layerInfos: v,
                version: c.version,
                maxWidth: c.maxWidth,
                maxHeight: c.maxHeight,
                featureInfoFormat: c.featureInfoFormat,
                getFeatureInfoURL: c.featureInfoUrl,
                getMapURL: c.mapUrl,
                spatialReferences: c.spatialReferences,
                title: c.title,
                copyright: c.copyright,
                minScale: c.minScale || 0,
                maxScale: c.maxScale || 0,
                format: c.format
              };
              g &&
                g.extent &&
                ((g = new k(
                  g.extent[0][0],
                  g.extent[0][1],
                  g.extent[1][0],
                  g.extent[1][1],
                  new J({ wkid: 4326 })
                )),
                (n.extent = g));
              c.spatialReferences &&
                0 < c.spatialReferences.length &&
                (b = c.spatialReferences[0]);
              n = {
                id: this._generateLayerId(),
                visibleLayers: d,
                format: "png",
                transparent: c.firstLayer ? !1 : !0,
                opacity: c.opacity,
                visible: null !== c.visibility ? c.visibility : !0,
                resourceInfo: n,
                refreshInterval: c.refreshInterval
              };
            }
            c = new e(this.serviceUrl, n);
            c = this._waitForLayer(c);
            c.then(function(a) {
              m || f._setWMSVisibleLayers(a);
              b && a.spatialReference && (a.spatialReference.wkid = b);
            });
            return c;
          },
          _processFeatureLayer: function(a, e, g) {
            var k = this,
              m = b.search.featureLayerTitlePattern,
              n = null;
            g && g.layers && 0 < g.layers.length
              ? q.some(g.layers, function(g) {
                  var b,
                    d,
                    v,
                    x = !1;
                  if (g.id === a.layerId) {
                    g.popupInfo &&
                      ((b = g.popupInfo),
                      (b = u.parse(u.stringify(b))),
                      (b = new f(b)),
                      a.setInfoTemplate(b),
                      (x = !0));
                    t.isDefined(g.showLabels) && a.setShowLabels(g.showLabels);
                    t.isDefined(g.refreshInterval) &&
                      a.setRefreshInterval(g.refreshInterval);
                    t.isDefined(g.showLegend) && console.log("");
                    t.isDefined(g.timeAnimation) &&
                      !1 === g.timeAnimation &&
                      console.log("");
                    if ((b = g.layerDefinition))
                      b.definitionExpression &&
                        a.setDefinitionExpression(b.definitionExpression),
                        b.displayField && a.displayField(b.displayField),
                        b.drawingInfo &&
                          (b.drawingInfo.renderer &&
                            ((d = u.parse(u.stringify(b.drawingInfo.renderer))),
                            (v = c.fromJson(d)),
                            d.type &&
                              "classBreaks" === d.type &&
                              (v.isMaxInclusive = !0),
                            a.setRenderer(v)),
                          t.isDefined(b.drawingInfo.transparency) &&
                            a.setOpacity(1 - b.drawingInfo.transparency / 100)),
                        t.isDefined(b.minScale) && a.setMinScale(b.minScale),
                        t.isDefined(b.maxScale) && a.setMaxScale(b.maxScale),
                        t.isDefined(b.defaultVisibility) &&
                          !1 === b.defaultVisibility &&
                          a.setVisibility(!1);
                    x || k._setFeatureLayerInfoTemplate(a, g.popupInfo);
                    n = {
                      url: a.url,
                      id: a.id,
                      itemId: e.id,
                      title: k._makeFeatureLayerTitle(m, e.title, a.name)
                    };
                    return !0;
                  }
                })
              : ((n = {
                  url: a.url,
                  id: a.id,
                  itemId: e.id,
                  title: k._makeFeatureLayerTitle(m, e.title, a.name)
                }),
                k._setFeatureLayerInfoTemplate(a, null, n.title));
            return n;
          },
          _readItemJsonData: function() {
            return z(
              {
                url: this.itemUrl + "/data",
                content: { f: "json" },
                handleAs: "json"
              },
              {}
            );
          },
          _readRestInfo: function(a) {
            return z(
              {
                url: a,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
              },
              {}
            );
          },
          _setDynamicLayerInfoTemplates: function(a) {
            var c = this,
              f = null,
              e = [],
              g = function(e) {
                var g = c._readRestInfo(a.url + "/" + e.id);
                g.then(function(a) {
                  try {
                    var g = c._newPopupInfo(a);
                    g && (f[e.id] = { infoTemplate: c._newInfoTemplate(g) });
                  } catch (O) {
                    console.warn("Error setting popup."), console.error(O);
                  }
                });
                return g;
              };
            null === a.infoTemplates &&
              q.forEach(a.layerInfos, function(a) {
                null === f && (f = {});
                a.subLayerIds || e.push(g(a));
              });
            0 < e.length &&
              l(e)
                .then(function() {
                  f && (a.infoTemplates = f);
                })
                .otherwise(function(a) {
                  console.warn("Error reading sublayers.");
                  console.error(a);
                });
          },
          _setFeatureLayerInfoTemplate: function(a, c, f) {
            c || (c = this._newPopupInfo(a, f));
            c = this._newInfoTemplate(c, f);
            a.setInfoTemplate(c);
          },
          _setWMSVisibleLayers: function(a) {
            var c = [];
            a &&
              (q.some(a.layerInfos, function(a) {
                if ("string" === typeof a.name && 0 < a.name.length)
                  if (10 > c.length) c.push(a.name);
                  else return !0;
              }),
              10 >= c.length && a.setVisibleLayers(c));
          },
          _waitForLayer: function(a) {
            var c = new d(),
              f = [];
            if (a.loaded) return c.resolve(a), c;
            if (a.loadError) return c.reject(a.loadError), c;
            var e = function() {
              q.forEach(f, function(a) {
                a.remove();
              });
            };
            f.push(
              a.on("load", function(a) {
                e();
                c.resolve(a.layer);
              })
            );
            f.push(
              a.on("error", function(a) {
                e();
                a = a.error;
                try {
                  a.message && -1 !== a.message.indexOf("Unable to complete")
                    ? (console.warn("layerAccessError", a),
                      c.reject(Error(b.search.layerInaccessible)))
                    : c.reject(a);
                } catch (Q) {
                  c.reject(a);
                }
              })
            );
            return c;
          }
        });
      });
    },
    "esri/layers/ImageServiceParameters": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has ../kernel ../lang".split(
        " "
      ), function(p, h, q, l, d, u) {
        p = p(null, {
          declaredClass: "esri.layers.ImageServiceParameters",
          extent: null,
          width: null,
          height: null,
          imageSpatialReference: null,
          format: null,
          interpolation: null,
          compressionQuality: null,
          bandIds: null,
          timeExtent: null,
          mosaicRule: null,
          renderingRule: null,
          renderer: null,
          noData: null,
          compressionTolerance: null,
          adjustAspectRatio: null,
          lercVersion: null,
          toJson: function(b) {
            var d = this.bbox || this.extent;
            b = (d = d && b && d._normalize(!0))
              ? d.spatialReference.wkid || q.toJson(d.spatialReference.toJson())
              : null;
            var h = this.imageSpatialReference,
              d = {
                bbox: d
                  ? d.xmin + "," + d.ymin + "," + d.xmax + "," + d.ymax
                  : null,
                bboxSR: b,
                size:
                  null !== this.width && null !== this.height
                    ? this.width + "," + this.height
                    : null,
                imageSR: h ? h.wkid || q.toJson(h.toJson()) : b,
                format: this.format,
                interpolation: this.interpolation,
                compressionQuality: this.compressionQuality,
                bandIds: this.bandIds ? this.bandIds.join(",") : null,
                mosaicRule: this.mosaicRule
                  ? q.toJson(this.mosaicRule.toJson())
                  : null,
                renderingRule: this.renderingRule
                  ? q.toJson(this.renderingRule.toJson())
                  : null,
                renderer: this.renderer
                  ? q.toJson(this.renderer.toJson())
                  : null,
                noData: this.noData,
                noDataInterpretation: this.noDataInterpretation,
                compressionTolerance: this.compressionTolerance,
                adjustAspectRatio: this.adjustAspectRatio,
                lercVersion: this.lercVersion
              };
            b = this.timeExtent;
            d.time = b ? b.toJson().join(",") : null;
            return u.filter(d, function(b) {
              if (null !== b && void 0 !== b) return !0;
            });
          }
        });
        h.mixin(p, {
          INTERPOLATION_BILINEAR: "RSP_BilinearInterpolation",
          INTERPOLATION_CUBICCONVOLUTION: "RSP_CubicConvolution",
          INTERPOLATION_MAJORITY: "RSP_Majority",
          INTERPOLATION_NEARESTNEIGHBOR: "RSP_NearestNeighbor",
          NODATA_MATCH_ALL: "esriNoDataMatchAll",
          NODATA_MATCH_ANY: "esriNoDataMatchAny"
        });
        l("extend-esri") && h.setObject("layers.ImageServiceParameters", p, d);
        return p;
      });
    },
    "esri/layers/KMLLayer": function() {
      define("dojo/_base/kernel dojo/_base/declare dojo/_base/connect dojo/_base/lang dojo/_base/array dojo/_base/json dojo/_base/sniff dojo/io-query dojo/dom-construct dojo/dom-style ../kernel ../config ../lang ../request ../urlUtils ../SpatialReference ../geometry/webMercatorUtils ../dijit/PopupTemplate ./layer ./KMLFolder ./KMLGroundOverlay ./MapImageLayer ./FeatureLayer".split(
        " "
      ), function(
        p,
        h,
        q,
        l,
        d,
        u,
        b,
        r,
        t,
        z,
        E,
        y,
        H,
        B,
        F,
        C,
        G,
        v,
        g,
        n,
        A,
        D,
        x
      ) {
        var I = h([g], {
          declaredClass: "esri.layers.KMLLayer",
          serviceUrl:
            F.getProtocolForWebResource() + "//utility.arcgis.com/sharing/kml",
          constructor: function(e, a) {
            e ||
              console.log(
                "KMLLayer:constructor - please provide url for the KML file"
              );
            this._outSR = (a && a.outSR) || new C({ wkid: 4326 });
            this._options = l.mixin({}, a);
            y.defaults.kmlService && (this.serviceUrl = y.defaults.kmlService);
            if ((e = this.linkInfo = a && a.linkInfo))
              (this.visible = !!e.visibility),
                (this._waitingForMap = !!e.viewFormat);
            (!e || (e && e.visibility && !this._waitingForMap)) &&
              this._parseKml();
            this.refresh = l.hitch(this, this.refresh);
            this.registerConnectEvents("esri.layers.KMLLayer", !0);
          },
          getFeature: function(e) {
            if (e) {
              var a = e.type,
                f = e.id,
                g;
              switch (a) {
                case "esriGeometryPoint":
                case "esriGeometryPolyline":
                case "esriGeometryPolygon":
                  (e = this["_" + a]) &&
                    (g = l.getObject("_mode._featureMap." + f, !1, e));
                  break;
                case "GroundOverlay":
                  if ((e = this._groundLyr)) {
                    var c = e.getImages(),
                      a = c.length;
                    for (e = 0; e < a; e++)
                      if (c[e].id === f) {
                        g = c[e];
                        break;
                      }
                  }
                  break;
                case "ScreenOverlay":
                  break;
                case "NetworkLink":
                  d.some(this._links, function(a) {
                    return a.linkInfo && a.linkInfo.id === f
                      ? ((g = a), !0)
                      : !1;
                  });
                  break;
                case "Folder":
                  a = (c = this.folders) ? c.length : 0;
                  for (e = 0; e < a; e++)
                    if (c[e].id === f) {
                      g = c[e];
                      break;
                    }
                  break;
                default:
                  console.log("KMLLayer:getFeature - unknown feature type");
              }
              return g;
            }
          },
          getLayers: function() {
            var e = [];
            this._groundLyr && e.push(this._groundLyr);
            this._fLayers && (e = e.concat(this._fLayers));
            this._links &&
              d.forEach(this._links, function(a) {
                a.declaredClass && e.push(a);
              });
            return e;
          },
          setFolderVisibility: function(e, a) {
            e &&
              (this._fireUpdateStart(),
              (e.visible = a) && (a = this._areLocalAncestorsVisible(e)),
              this._setState(e, a),
              this._fireUpdateEnd());
          },
          _eventMap: { "network-link-error": ["error"] },
          onRefresh: function() {},
          onOpacityChange: function() {},
          onNetworkLinkError: function() {},
          _parseKml: function(e) {
            var a = this;
            this._fireUpdateStart();
            this._io = B({
              url: this.serviceUrl,
              content: {
                url: this._url.path + this._getQueryParameters(e),
                model: "simple",
                folders: "",
                refresh: this.loaded ? !0 : void 0,
                outSR: u.toJson(this._outSR.toJson())
              },
              callbackParamName: "callback",
              load: function(f) {
                a._io = null;
                a._initLayer(f);
              },
              error: function(f) {
                a._io = null;
                f = l.mixin(Error(), f);
                f.message = "Unable to load KML: " + (f.message || "");
                a._fireUpdateEnd(f);
                a._errorHandler(f);
              }
            });
          },
          _initLayer: function(e) {
            var a;
            this.loaded &&
              ((a = []),
              d.forEach(this.folders, function(c) {
                c.visible && a.push(c.id);
              }),
              (this._options.minScale = this.minScale),
              (this._options.maxScale = this.maxScale),
              (this._options.opacity = this.opacity),
              this._removeInternalLayers());
            this.name = e.name;
            this.description = e.description;
            this.snippet = e.snippet;
            this.visibility = e.visibility;
            this.featureInfos = e.featureInfos;
            var f,
              g,
              c = (this.folders = e.folders),
              k = [],
              b;
            if (c)
              for (g = c.length, f = 0; f < g; f++)
                (b = c[f] = new n(c[f])), -1 === b.parentFolderId && k.push(b);
            var c = (this._links = e.networkLinks),
              h;
            g = c ? c.length : 0;
            for (f = 0; f < g; f++)
              (c[f].viewRefreshMode &&
                -1 !==
                  c[f].viewRefreshMode.toLowerCase().indexOf("onregion")) ||
                ((h = l.mixin({}, this._options)),
                (h.linkInfo = c[f]),
                h.id && (h.id = h.id + "_" + f),
                (b = c[f] = new I(c[f].href, h)),
                (b._parentLayer = this),
                (b._parentFolderId = this._getLinkParentId(b.linkInfo.id)),
                (b._linkErrorHandle = b.on(
                  "error,network-link-error",
                  l.hitch(b, function(a) {
                    this._parentLayer.onNetworkLinkError(a.error);
                  })
                )));
            if ((c = e.groundOverlays) && 0 < c.length)
              for (
                h = l.mixin({}, this._options),
                  h.id && (h.id += "_mapImage"),
                  b = this._groundLyr = new D(h),
                  g = c.length,
                  f = 0;
                f < g;
                f++
              )
                b.addImage(new A(c[f]));
            (e = l.getObject("featureCollection.layers", !1, e)) &&
              0 < e.length &&
              ((this._fLayers = []),
              d.forEach(
                e,
                function(a, c) {
                  var f = l.getObject("featureSet.features", !1, a);
                  f &&
                    0 < f.length &&
                    ((h = l.mixin(
                      {
                        outFields: ["*"],
                        infoTemplate: a.popupInfo ? new v(a.popupInfo) : null,
                        editable: !1
                      },
                      this._options
                    )),
                    h.id && (h.id = h.id + "_" + c),
                    (h.webgl = !1),
                    (a.layerDefinition.capabilities = "Query,Data"),
                    (a = new x(a, h)),
                    a.geometryType && (this["_" + a.geometryType] = a),
                    this._fLayers.push(a));
                },
                this
              ),
              0 === this._fLayers.length && delete this._fLayers);
            if (!this.loaded)
              for (g = k.length, f = 0; f < g; f++)
                (b = k[f]), this._setState(b, b.visible);
            this._fireUpdateEnd();
            this.loaded
              ? (this._addInternalLayers(),
                d.forEach(
                  this.folders,
                  function(c) {
                    -1 < d.indexOf(a, c.id)
                      ? this.setFolderVisibility(c, !0)
                      : this.setFolderVisibility(c, !1);
                  },
                  this
                ),
                this.onRefresh())
              : ((this.loaded = !0), this.onLoad(this));
          },
          _addInternalLayers: function() {
            var e = this._map;
            this._fireUpdateStart();
            this._links &&
              d.forEach(this._links, function(a) {
                a.declaredClass &&
                  (e.addLayer(a),
                  a._waitingForMap &&
                    ((a._waitingForMap = null),
                    a.visible ? a._parseKml(e) : (a._wMap = e)));
              });
            var a = e.spatialReference,
              f = this._outSR,
              g;
            if (!a.equals(f))
              if (a.isWebMercator() && 4326 === f.wkid)
                g = G.geographicToWebMercator;
              else if (f.isWebMercator() && 4326 === a.wkid)
                g = G.webMercatorToGeographic;
              else {
                console.log(
                  "KMLLayer:_setMap - unsupported workflow. Spatial reference of the map and kml layer do not match, and the conversion cannot be done on the client."
                );
                return;
              }
            this._groundLyr &&
              (g &&
                d.forEach(this._groundLyr.getImages(), function(a) {
                  a.extent = g(a.extent);
                }),
              e.addLayer(this._groundLyr));
            (a = this._fLayers) &&
              0 < a.length &&
              d.forEach(a, function(a) {
                if (g) {
                  var c = a.graphics,
                    f,
                    b,
                    m = c ? c.length : 0;
                  for (f = 0; f < m; f++)
                    (b = c[f].geometry) && c[f].setGeometry(g(b));
                }
                e.addLayer(a);
              });
            this.onVisibilityChange(this.visible);
          },
          _removeInternalLayers: function() {
            var e = this._map;
            this._links &&
              d.forEach(this._links, function(a) {
                a.declaredClass && a._io && a._io.cancel();
                a._linkErrorHandle &&
                  (a._linkErrorHandle.remove(), (a._linkErrorHandle = null));
              });
            e && d.forEach(this.getLayers(), e.removeLayer, e);
          },
          _setState: function(e, a) {
            e = e.featureInfos;
            var f,
              g,
              c,
              k = e ? e.length : 0,
              b = a ? "show" : "hide";
            for (c = 0; c < k; c++)
              if (((f = e[c]), (g = this.getFeature(f))))
                if ("Folder" === f.type) this._setState(g, a && g.visible);
                else if ("NetworkLink" === f.type)
                  this._setInternalVisibility(g, a);
                else g[b]();
          },
          _areLocalAncestorsVisible: function(e) {
            var a = e.parentFolderId;
            for (e = e.visible; e && -1 !== a; )
              (a = this.getFeature({ type: "Folder", id: a })),
                (e = e && a.visible),
                (a = a.parentFolderId);
            return e;
          },
          _setInternalVisibility: function(e, a) {
            var f = e._parentLayer,
              g = e._parentFolderId;
            for (a = a && e.visible; a && f; )
              (a = a && f.visible),
                -1 < g &&
                  (a =
                    a &&
                    f._areLocalAncestorsVisible(
                      f.getFeature({ type: "Folder", id: g })
                    )),
                (g = f._parentFolderId),
                (f = f._parentLayer);
            this._setIntState(e, a);
          },
          _setIntState: function(e, a) {
            e &&
              d.forEach(e.getLayers(), function(f) {
                f.linkInfo
                  ? e._setIntState(
                      f,
                      a &&
                        f.visible &&
                        e._areLocalAncestorsVisible(
                          e.getFeature({
                            type: "Folder",
                            id: f._parentFolderId
                          })
                        )
                    )
                  : f.setVisibility(a);
              });
          },
          _getLinkParentId: function(e) {
            var a = -1;
            this.folders &&
              d.some(this.folders, function(f) {
                return f.networkLinkIds && -1 !== d.indexOf(f.networkLinkIds, e)
                  ? ((a = f.id), !0)
                  : !1;
              });
            return a;
          },
          _checkAutoRefresh: function() {
            var e = this.linkInfo;
            if (e)
              if (this.visible) {
                if (this.loaded && this._map) {
                  var a = e.refreshMode,
                    f = e.refreshInterval,
                    g = e.viewRefreshMode,
                    e = e.viewRefreshTime;
                  a &&
                    -1 !== a.toLowerCase().indexOf("oninterval") &&
                    0 < f &&
                    (this._stopAutoRefresh(),
                    (this._timeoutHandle = setTimeout(this.refresh, 1e3 * f)));
                  g &&
                    -1 !== g.toLowerCase().indexOf("onstop") &&
                    0 < e &&
                    !this._extChgHandle &&
                    (this._extChgHandle = q.connect(
                      this._map,
                      "onExtentChange",
                      this,
                      this._extentChanged
                    ));
                }
              } else
                this._stopAutoRefresh(),
                  q.disconnect(this._extChgHandle),
                  delete this._extChgHandle;
          },
          _stopAutoRefresh: function() {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
          },
          _getQueryParameters: function(e) {
            e = e || this._map;
            var a = {},
              f = this.linkInfo,
              g = e && e.extent,
              c;
            this._url.query &&
              (l.mixin(a, this._url.query), (c = !!this._url.query.token));
            E.id &&
              !c &&
              (c = E.id.findCredential(this._url.path)) &&
              (a.token = c.token);
            if (f) {
              c = f.viewFormat;
              var k = f.httpQuery,
                f = f.viewBoundScale;
              if (g && c) {
                var b = g,
                  n = g,
                  d = g.spatialReference;
                d &&
                  (d.isWebMercator()
                    ? (b = G.webMercatorToGeographic(g))
                    : 4326 === d.wkid && (n = G.geographicToWebMercator(g)));
                g = b.getCenter();
                n = Math.max(n.getWidth(), n.getHeight());
                f && (b = b.expand(f));
                c = c
                  .replace(/\[bboxWest\]/gi, b.xmin)
                  .replace(/\[bboxEast\]/gi, b.xmax)
                  .replace(/\[bboxSouth\]/gi, b.ymin)
                  .replace(/\[bboxNorth\]/gi, b.ymax)
                  .replace(/\[lookatLon\]/gi, g.x)
                  .replace(/\[lookatLat\]/gi, g.y)
                  .replace(/\[lookatRange\]/gi, n)
                  .replace(/\[lookatTilt\]/gi, 0)
                  .replace(/\[lookatHeading\]/gi, 0)
                  .replace(/\[lookatTerrainLon\]/gi, g.x)
                  .replace(/\[lookatTerrainLat\]/gi, g.y)
                  .replace(/\[lookatTerrainAlt\]/gi, 0)
                  .replace(/\[cameraLon\]/gi, g.x)
                  .replace(/\[cameraLat\]/gi, g.y)
                  .replace(/\[cameraAlt\]/gi, n)
                  .replace(/\[horizFov\]/gi, 60)
                  .replace(/\[vertFov\]/gi, 60)
                  .replace(/\[horizPixels\]/gi, e.width)
                  .replace(/\[vertPixels\]/gi, e.height)
                  .replace(/\[terrainEnabled\]/gi, 0);
                l.mixin(a, r.queryToObject(c));
              }
              k &&
                ((k = k
                  .replace(/\[clientVersion\]/gi, E.version)
                  .replace(/\[kmlVersion\]/gi, 2.2)
                  .replace(/\[clientName\]/gi, "ArcGIS API for JavaScript")
                  .replace(/\[language\]/gi, p.locale)),
                l.mixin(a, r.queryToObject(k)));
            }
            e = [];
            for (var v in a) H.isDefined(a[v]) && e.push(v + "\x3d" + a[v]);
            return (e = e.join("\x26")) ? "?" + e : "";
          },
          setScaleRange: function(e, a) {
            this.inherited(arguments);
            d.forEach(this.getLayers(), function(f) {
              f.setScaleRange(e, a);
            });
          },
          setOpacity: function(e) {
            this.opacity != e &&
              (d.forEach(this.getLayers(), function(a) {
                a.setOpacity(e);
              }),
              (this.opacity = e),
              this.onOpacityChange(e));
          },
          _setMap: function(e, a) {
            this.inherited(arguments);
            this._map = e;
            var f = (this._div = t.create("div", null, a));
            z.set(f, "position", "absolute");
            this._addInternalLayers();
            this.evaluateSuspension();
            return f;
          },
          _unsetMap: function(e, a) {
            this._io && this._io.cancel();
            this._stopAutoRefresh();
            q.disconnect(this._extChgHandle);
            delete this._extChgHandle;
            this._removeInternalLayers();
            var f = this._div;
            f && (a.removeChild(f), t.destroy(f));
            this._wMap = this._div = null;
            this.inherited(arguments);
          },
          onVisibilityChange: function(e) {
            this.loaded
              ? (this._fireUpdateStart(),
                this._setInternalVisibility(this, e),
                this._checkAutoRefresh(),
                this._fireUpdateEnd())
              : this.linkInfo &&
                e &&
                (this._waitingForMap || this._parseKml(this._wMap));
          },
          refresh: function() {
            this.loaded &&
              this._map &&
              !this._io &&
              this.visible &&
              this._parseKml();
          },
          getFeatureCollection: function(e) {
            var a,
              f = [];
            (e = this.getFeature({ type: "Folder", id: e })) &&
              (a = d.map(
                e.featureInfos,
                function(a) {
                  if (
                    "esriGeometryPoint" === a.type ||
                    "esriGeometryPolyline" === a.type ||
                    "esriGeometryPolygon" === a.type
                  )
                    return a.id;
                },
                this
              )) &&
              0 < a.length &&
              d.forEach(
                this._fLayers,
                function(e) {
                  var c, g;
                  c = e.toJson();
                  c.featureSet.features &&
                    0 < c.featureSet.features.length &&
                    (g = d.filter(
                      c.featureSet.features,
                      function(c) {
                        if (-1 !== d.indexOf(a, c.attributes[e.objectIdField]))
                          return c;
                      },
                      this
                    ));
                  g && 0 < g.length && ((c.featureSet.features = g), f.push(c));
                },
                this
              );
            return f;
          },
          getFeatureCount: function(e) {
            e = this.getFeature({ type: "Folder", id: e });
            var a = { points: 0, polylines: 0, polygons: 0 };
            e &&
              d.forEach(e.featureInfos, function(f) {
                "esriGeometryPoint" === f.type && (a.points += 1);
                "esriGeometryPolyline" === f.type && (a.polylines += 1);
                "esriGeometryPolygon" === f.type && (a.polygons += 1);
              });
            return a;
          },
          _extentChanged: function() {
            this._stopAutoRefresh();
            this._timeoutHandle = setTimeout(
              this.refresh,
              1e3 * this.linkInfo.viewRefreshTime
            );
          }
        });
        b("extend-esri") && l.setObject("layers.KMLLayer", I, E);
        return I;
      });
    },
    "esri/layers/KMLFolder": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel",
        "../lang"
      ], function(p, h, q, l, d) {
        p = p(null, {
          declaredClass: "esri.layers.KMLFolder",
          constructor: function(l) {
            h.mixin(this, l);
            d.isDefined(this.visibility) && (this.visible = !!this.visibility);
          }
        });
        q("extend-esri") && h.setObject("layers.KMLFolder", p, l);
        return p;
      });
    },
    "esri/layers/KMLGroundOverlay": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../lang ./MapImage".split(
        " "
      ), function(p, h, q, l, d, u) {
        p = p([u], {
          declaredClass: "esri.layers.KMLGroundOverlay",
          constructor: function(b) {
            d.isDefined(this.visibility) && (this.visible = !!this.visibility);
          }
        });
        q("extend-esri") && h.setObject("layers.KMLGroundOverlay", p, l);
        return p;
      });
    },
    "esri/layers/WMSLayer": function() {
      define("require dojo/_base/kernel dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/sniff ../config ../graphic ../kernel ../request ../urlUtils ../dijit/PopupTemplate ../SpatialReference ../geometry/Extent ../geometry/Point ./DynamicMapServiceLayer ./WMSLayerInfo dojo/query".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z, E, y, H, B, F, C, G) {
        q = q([C], {
          declaredClass: "esri.layers.WMSLayer",
          _CRS_TO_EPSG: { 84: 4326, 83: 4269, 27: 4267 },
          _REVERSED_LAT_LONG_RANGES: [
            [4001, 4999],
            [2044, 2045],
            [2081, 2083],
            [2085, 2086],
            [2093, 2093],
            [2096, 2098],
            [2105, 2132],
            [2169, 2170],
            [2176, 2180],
            [2193, 2193],
            [2200, 2200],
            [2206, 2212],
            [2319, 2319],
            [2320, 2462],
            [2523, 2549],
            [2551, 2735],
            [2738, 2758],
            [2935, 2941],
            [2953, 2953],
            [3006, 3030],
            [3034, 3035],
            [3058, 3059],
            [3068, 3068],
            [3114, 3118],
            [3126, 3138],
            [3300, 3301],
            [3328, 3335],
            [3346, 3346],
            [3350, 3352],
            [3366, 3366],
            [3416, 3416],
            [20004, 20032],
            [20064, 20092],
            [21413, 21423],
            [21473, 21483],
            [21896, 21899],
            [22171, 22177],
            [22181, 22187],
            [22191, 22197],
            [25884, 25884],
            [27205, 27232],
            [27391, 27398],
            [27492, 27492],
            [28402, 28432],
            [28462, 28492],
            [30161, 30179],
            [30800, 30800],
            [31251, 31259],
            [31275, 31279],
            [31281, 31290],
            [31466, 31700]
          ],
          _WEB_MERCATOR: [102100, 3857, 102113, 900913],
          _WORLD_MERCATOR: [3395, 54004],
          allExtents: [],
          version: null,
          constructor: function(b, g) {
            var n = E.urlToObject(b);
            n.query &&
              (n.query.version || n.query.Version || n.query.VERSION) &&
              (this.version =
                n.query.version || n.query.Version || n.query.VERSION);
            this.url = b = this._stripParameters(
              b,
              "version service request bbox format height width layers srs crs styles transparent bgcolor exceptions time elevation sld wfs".split(
                " "
              )
            );
            this._url = E.urlToObject(b);
            this._getCapabilitiesURL = b;
            this._initLayer = l.hitch(this, this._initLayer);
            this._parseCapabilities = l.hitch(this, this._parseCapabilities);
            this._getCapabilitiesError = l.hitch(
              this,
              this._getCapabilitiesError
            );
            g
              ? ((this.customParameters = g.customParameters),
                (this.customLayerParameters = g.customLayerParameters),
                (this.imageFormat = this._getImageFormat(g.format)),
                (this.imageTransparency = !1 !== g.transparent),
                (this.visibleLayers = g.visibleLayers ? g.visibleLayers : []),
                (this.version = g.version || this.version),
                g.resourceInfo
                  ? this._readResourceInfo(g.resourceInfo)
                  : this._getCapabilities())
              : ((this.imageFormat = "image/png"),
                (this.imageTransparency = !0),
                (this.visibleLayers = []),
                this._getCapabilities());
            this._blankImageURL = p.toUrl("../images/pixel.png");
            this.extentProcessor = this._createExtentProcessor(0);
            this._createChildLayer();
          },
          setVisibleLayers: function(b) {
            this.visibleLayers = (b = this._checkVisibleLayersList(b)) ? b : [];
            this.refresh(!0);
          },
          setImageFormat: function(b) {
            this.imageFormat = this._getImageFormat(b);
            this.refresh(!0);
          },
          setImageTransparency: function(b) {
            this.imageTransparency = b;
            this.refresh(!0);
          },
          setCustomParameters: function(b, g) {
            this.customParameters = b;
            this.customLayerParameters = g;
            this.refresh(!0);
          },
          refresh: function() {
            this._refreshTS = Date.now();
            this.inherited(arguments);
            this._childLayer &&
              this._childLayer.refresh.apply(this._childLayer, arguments);
          },
          getImageUrl: function(b, g, n, d) {
            if (this.visibleLayers && 0 !== this.visibleLayers.length) {
              b = this._getImageParams(b, g, n);
              b = this._mixinCustomLayerParameters(b);
              g = this.getMapURL;
              var v;
              g += -1 === g.indexOf("?") ? "?" : "";
              for (v in b)
                b.hasOwnProperty(v) &&
                  ((g +=
                    "?" === g.substring(g.length - 1, g.length) ? "" : "\x26"),
                  (g += v + "\x3d" + b[v]));
              g = this.addTimestampToURL(g);
              d(E.addProxy(g));
            } else d(this._blankImageURL);
          },
          _setMap: function(b, g, n) {
            var d = this.inherited(arguments);
            b.wrapAround180
              ? this._childLayer &&
                (this.suspended && this._childLayer.suspend(),
                this._childLayer._setMap(b, d))
              : (this._childLayer = this.extentProcessor = null);
            return d;
          },
          _unsetMap: function(b, g) {
            this._childLayer && this._childLayer._unsetMap(b, this._div);
            this.inherited(arguments);
          },
          onSuspend: function() {
            this.inherited(arguments);
            this._childLayer && this._childLayer.suspend();
          },
          onResume: function() {
            this.inherited(arguments);
            this._childLayer && this._childLayer.resume();
          },
          _createChildLayer: function() {
            this._childLayer = new C(null, {
              extentProcessor: this._createExtentProcessor(1)
            });
            this._childLayer._isChildLayer = !0;
            this._childLayer.getImageUrl = l.hitch(this, this.getImageUrl);
            this._childLayer.loaded = !0;
          },
          _createExtentProcessor: function(b) {
            return l.hitch(this, this._extentProcessor, b);
          },
          _extentProcessor: function(b, g) {
            var n = g.extent,
              d = g.width,
              v = 0;
            if (n) {
              g = n.getWidth() / d;
              var x = n.bisect(),
                n = x.extents,
                h = n[b];
              h &&
                ((d = x.marginLeft / g),
                (v = 0 === b ? d : d + n[0].getWidth() / g),
                (d = Math.ceil(h.getWidth() / g)),
                (v = Math.ceil(v)));
              n = h;
            }
            return { extent: n, width: d, marginLeft: v };
          },
          _getImageParams: function(b, g, n) {
            var v = b.spatialReference.wkid;
            -1 === d.indexOf(this.spatialReferences, v) &&
              b.spatialReference.latestWkid &&
              (v = b.spatialReference.latestWkid);
            if (
              d.some(this._WEB_MERCATOR, function(a) {
                return a == v;
              })
            ) {
              var h = d.filter(
                this.spatialReferences,
                function(a) {
                  return d.some(this._WEB_MERCATOR, function(f) {
                    return f == a;
                  });
                },
                this
              );
              0 === h.length &&
                (h = d.filter(
                  this.spatialReferences,
                  function(a) {
                    return d.some(this._WORLD_MERCATOR, function(f) {
                      return f == a;
                    });
                  },
                  this
                ));
              v = 0 < h.length ? h[0] : this._WEB_MERCATOR[1];
            }
            this.spatialReferences = d.filter(this.spatialReferences, function(
              a
            ) {
              return a !== v;
            });
            this.spatialReferences.unshift(v);
            var h = b.xmin,
              x = b.xmax,
              I = b.ymin;
            b = b.ymax;
            var e = { SERVICE: "WMS", REQUEST: "GetMap" };
            e.FORMAT = this.imageFormat;
            e.TRANSPARENT = this.imageTransparency ? "TRUE" : "FALSE";
            e.STYLES = "";
            e.VERSION = this.version;
            e.LAYERS = this.visibleLayers
              ? this.visibleLayers.toString()
              : null;
            e.WIDTH = g;
            e.HEIGHT = n;
            this.maxWidth < g && (e.WIDTH = this.maxWidth);
            this.maxHeight < n && (e.HEIGHT = this.maxHeight);
            g = v ? v : NaN;
            isNaN(g) ||
              ("1.3.0" == this.version
                ? (e.CRS = "EPSG:" + g)
                : (e.SRS = "EPSG:" + g));
            "1.3.0" == this.version && this._useLatLong(g)
              ? (e.BBOX = I + "," + h + "," + b + "," + x)
              : (e.BBOX = h + "," + I + "," + x + "," + b);
            return e;
          },
          _initLayer: function(d, g) {
            this.spatialReference = new H(this.extent.spatialReference);
            this.initialExtent = new B(this.extent);
            this.fullExtent = new B(this.extent);
            this.visibleLayers = this._checkVisibleLayersList(
              this.visibleLayers
            );
            var n = l.hitch(this, function() {
              this.loaded = !0;
              this.onLoad(this);
              var g = this._loadCallback;
              g && (delete this._loadCallback, g(this));
            });
            u("chrome")
              ? ((d = b.defaults.io),
                (g =
                  "with-credentials" === d.useCors
                    ? E.canUseXhr(this.getMapURL, !0)
                    : -1),
                (d = -1 < g ? d.corsEnabledServers[g] : null) &&
                d.withCredentials
                  ? z({
                      url: this.getMapURL,
                      handleAs: "text",
                      content: { SERVICE: "WMS", REQUEST: "GetMap" }
                    }).addBoth(function() {
                      n();
                    })
                  : n())
              : n();
          },
          _readResourceInfo: function(b) {
            b.extent
              ? b.layerInfos
                ? ((this.extent = b.extent),
                  (this.allExtents[0] = b.extent),
                  (this.layerInfos = b.layerInfos),
                  (this.description = b.description ? b.description : ""),
                  (this.copyright = b.copyright ? b.copyright : ""),
                  (this.title = b.title ? b.title : ""),
                  (this.getMapURL = b.getMapURL
                    ? b.getMapURL
                    : this._getCapabilitiesURL),
                  (this.getFeatureInfoURL = b.getFeatureInfoURL),
                  (this.featureInfoFormat = b.featureInfoFormat),
                  (this.version = b.version ? b.version : "1.3.0"),
                  (this.maxWidth = b.maxWidth ? b.maxWidth : 5e3),
                  (this.maxHeight = b.maxHeight ? b.maxHeight : 5e3),
                  (this.spatialReferences = b.spatialReferences
                    ? b.spatialReferences
                    : []),
                  (this.imageFormat = this._getImageFormat(b.format)),
                  this.setScaleRange(b.minScale, b.maxScale),
                  (this.customLayerParameters =
                    b.customLayerParameters || this.customLayerParameters),
                  (this.customParameters =
                    b.customParameters || this.customParameters),
                  this._initLayer())
                : this._errorHandler(
                    Error(
                      "esri.layers.WMSLayer: unable to find the 'layerInfos' property in resourceInfo"
                    )
                  )
              : this._errorHandler(
                  Error(
                    "esri.layers.WMSLayer: Unable to find the 'extent' property in resourceInfo."
                  )
                );
          },
          _getCapabilities: function() {
            var b = this._url.query ? this._url.query : {};
            b.SERVICE = "WMS";
            b.REQUEST = "GetCapabilities";
            this.version && (b.VERSION = this.version);
            var b = this._mixinCustomParameters(b),
              g = this._url.path + "?",
              n;
            for (n in b)
              b.hasOwnProperty(n) &&
                ((g +=
                  "?" == g.substring(g.length - 1, g.length) ? "" : "\x26"),
                (g += n + "\x3d" + b[n]));
            z(
              {
                url: g,
                handleAs: "xml",
                headers: { "Content-Type": null },
                load: this._parseCapabilities,
                error: this._getCapabilitiesError
              },
              { usePost: !1 }
            );
          },
          _parseCapabilities: function(b) {
            if (b) {
              var g = this;
              this.version = this._getAttributeValue(
                "WMS_Capabilities",
                "version",
                b,
                null
              );
              this.version ||
                (this.version = this._getAttributeValue(
                  "WMT_MS_Capabilities",
                  "version",
                  b,
                  "1.3.0"
                ));
              var n = this._getTag("Service", b);
              this.title = this._getTagValue("Title", n, "");
              this.title || (this.title = this._getTagValue("Name", n, ""));
              this.copyright = this._getTagValue("AccessConstraints", n, "");
              this.description = this._getTagValue("Abstract", n, "");
              this.maxWidth = parseInt(
                this._getTagValue("MaxWidth", n, 5e3),
                10
              );
              this.maxHeight = parseInt(
                this._getTagValue("MaxHeight", n, 5e3),
                10
              );
              if ((n = this._getTag("Layer", b))) {
                var A = this._getLayerInfo(n),
                  D = 0,
                  x = null,
                  n = this._getTag("Capability", b);
                d.forEach(
                  n.childNodes,
                  function(a) {
                    "Layer" == a.nodeName &&
                      (0 === D
                        ? (x = a)
                        : (1 === D &&
                            A.name &&
                            ((A.name = ""),
                            (A.subLayers = []),
                            A.subLayers.push(this._getLayerInfo(x))),
                          A.subLayers.push(this._getLayerInfo(a))),
                      D++);
                  },
                  this
                );
                if (
                  A &&
                  ((this.layerInfos = A.subLayers),
                  (this.layerInfos && 0 !== this.layerInfos.length) ||
                    (this.layerInfos = [A]),
                  (this.extent = A.extent),
                  this.extent ||
                    ((A.extent = new B(this.layerInfos[0].extent.toJson())),
                    (this.extent = A.extent)),
                  (this.allExtents = A.allExtents),
                  (this.allExtents && this.allExtents.length) ||
                    ((A.allExtents = []),
                    d.forEach(this.layerInfos[0].allExtents, function(a, e) {
                      a && (A.allExtents[e] = new B(a.toJson()));
                    }),
                    (this.allExtents = A.allExtents)),
                  (this.spatialReferences = A.spatialReferences),
                  !this.spatialReferences.length && 0 < this.layerInfos.length)
                )
                  for (
                    var I = function(a) {
                        var f;
                        for (f = 0; f < a.subLayers.length; f++) {
                          var c = a.subLayers[f],
                            e = c.spatialReferences;
                          !e.length &&
                            c.subLayers &&
                            0 < c.subLayers.length &&
                            (e = I(c));
                          if (e.length) return e;
                        }
                        return [];
                      },
                      n = 0;
                    n < this.layerInfos.length;
                    n++
                  ) {
                    var e = this.layerInfos[n];
                    this.spatialReferences = this.layerInfos[0].spatialReferences;
                    !this.spatialReferences.length &&
                      e.subLayers &&
                      0 < e.subLayers.length &&
                      (this.spatialReferences = I(e));
                    if (this.spatialReferences.length) break;
                  }
                n = function(a) {
                  return (a = h.query("DCPType", g._getTag(a, b))) &&
                    0 < a.length &&
                    (a = h.query("HTTP", a[0])) &&
                    0 < a.length &&
                    (a = h.query("Get", a[0])) &&
                    0 < a.length &&
                    (a = g._getAttributeValue(
                      "OnlineResource",
                      "xlink:href",
                      a[0],
                      null
                    ))
                    ? (a.indexOf("\x26") === a.length - 1 &&
                        (a = a.substring(0, a.length - 1)),
                      g._stripParameters(a, ["service", "request"]))
                    : null;
                };
                e = function(a) {
                  var f = [];
                  0 === h.query("Operation", b).length
                    ? d.forEach(h.query("Format", g._getTag(a, b)), function(
                        a
                      ) {
                        f.push(a.text ? a.text : a.textContent);
                      })
                    : (d.forEach(h.query("Operation", b), function(c) {
                        c.getAttribute("name") === a &&
                          d.forEach(h.query("Format", c), function(a) {
                            f.push(a.text ? a.text : a.textContent);
                          });
                      }),
                      f.length ||
                        d.forEach(h.query("Format", g._getTag(a, b)), function(
                          a
                        ) {
                          f.push(a.text ? a.text : a.textContent);
                        }));
                  return f;
                };
                this.getMapURL = n("GetMap") || this._getCapabilitiesURL;
                this.getMapFormats = e("GetMap");
                this.getMapFormats.length &&
                  !d.some(
                    this.getMapFormats,
                    function(a) {
                      return -1 < a.indexOf(this.imageFormat);
                    },
                    this
                  ) &&
                  (this.imageFormat = this.getMapFormats[0]);
                if ((this.getFeatureInfoURL = n("GetFeatureInfo")))
                  (this.getFeatureInfoFormats = e("GetFeatureInfo")),
                    -1 < d.indexOf(this.getFeatureInfoFormats, "text/html")
                      ? (this.featureInfoFormat = "text/html")
                      : -1 <
                          d.indexOf(this.getFeatureInfoFormats, "text/plain") &&
                        (this.featureInfoFormat = "text/plain");
                if (!this.featureInfoFormat) {
                  var a = function(f) {
                    if (f && ((f.queryable = !1), f.subLayers))
                      for (var e = 0; e < f.subLayers.length; e++)
                        a(f.subLayers[e]);
                  };
                  a(A);
                }
                this._initLayer();
              } else
                this._errorHandler(
                  Error(
                    "esri.layers.WMSLayer: Response does not contain any layers."
                  )
                );
            } else
              this._errorHandler(
                Error(
                  "GetCapabilities request for " +
                    this._getCapabilitiesURL +
                    " failed. (Response is null.)"
                )
              );
          },
          _getCapabilitiesError: function(b) {
            b &&
              b.message &&
              (b.message =
                "GetCapabilities request for " +
                this._getCapabilitiesURL +
                " failed. (" +
                b.message +
                ")");
            this._errorHandler(b);
          },
          _getLayerInfo: function(b) {
            if (!b) return null;
            var g = new G();
            g.name = "";
            g.title = "";
            g.description = "";
            g.allExtents = [];
            g.spatialReferences = [];
            g.queryable = "1" === b.getAttribute("queryable");
            g.subLayers = [];
            var n = this._getTag("LatLonBoundingBox", b);
            n && (g.allExtents[0] = this._getExtent(n, 4326));
            var h = this._getTag("EX_GeographicBoundingBox", b),
              D;
            h &&
              ((D = new B(0, 0, 0, 0, new H({ wkid: 4326 }))),
              (D.xmin = parseFloat(
                this._getTagValue("westBoundLongitude", h, 0)
              )),
              (D.ymin = parseFloat(
                this._getTagValue("southBoundLatitude", h, 0)
              )),
              (D.xmax = parseFloat(
                this._getTagValue("eastBoundLongitude", h, 0)
              )),
              (D.ymax = parseFloat(
                this._getTagValue("northBoundLatitude", h, 0)
              )),
              (g.allExtents[0] = D));
            n ||
              h ||
              ((D = new B(-180, -90, 180, 90, new H({ wkid: 4326 }))),
              (g.allExtents[0] = D));
            g.extent = g.allExtents[0];
            var x =
              -1 < d.indexOf(["1.0.0", "1.1.0", "1.1.1"], this.version)
                ? "SRS"
                : "CRS";
            d.forEach(
              b.childNodes,
              function(b) {
                if ("Name" == b.nodeName)
                  g.name = (b.text ? b.text : b.textContent) || "";
                else if ("Title" == b.nodeName)
                  g.title = (b.text ? b.text : b.textContent) || "";
                else if ("Abstract" == b.nodeName)
                  g.description = (b.text ? b.text : b.textContent) || "";
                else if ("BoundingBox" == b.nodeName) {
                  var e = b.getAttribute(x);
                  e && 0 === e.indexOf("EPSG:")
                    ? ((e = parseInt(e.substring(5), 10)),
                      0 === e ||
                        isNaN(e) ||
                        ((b =
                          "1.3.0" == this.version
                            ? this._getExtent(b, e, this._useLatLong(e))
                            : this._getExtent(b, e)),
                        (g.allExtents[e] = b),
                        g.extent || (g.extent = b)))
                    : e && 0 === e.indexOf("CRS:")
                    ? ((e = parseInt(e.substring(4), 10)),
                      0 === e ||
                        isNaN(e) ||
                        (this._CRS_TO_EPSG[e] && (e = this._CRS_TO_EPSG[e]),
                        (g.allExtents[e] = this._getExtent(b, e))))
                    : ((e = parseInt(e, 10)),
                      0 === e ||
                        isNaN(e) ||
                        (g.allExtents[e] = this._getExtent(b, e)));
                } else if (b.nodeName == x)
                  (b = (b.text ? b.text : b.textContent).split(" ")),
                    d.forEach(
                      b,
                      function(a) {
                        a =
                          -1 < a.indexOf(":")
                            ? parseInt(a.split(":")[1], 10)
                            : parseInt(a, 10);
                        0 === a ||
                          isNaN(a) ||
                          (this._CRS_TO_EPSG[a] && (a = this._CRS_TO_EPSG[a]),
                          -1 == d.indexOf(g.spatialReferences, a) &&
                            g.spatialReferences.push(a));
                      },
                      this
                    );
                else if ("Style" != b.nodeName || g.legendURL)
                  "Layer" === b.nodeName &&
                    g.subLayers.push(this._getLayerInfo(b));
                else if ((b = this._getTag("LegendURL", b)))
                  if ((b = this._getTag("OnlineResource", b)))
                    g.legendURL = b.getAttribute("xlink:href");
              },
              this
            );
            g.title = g.title || g.name;
            return g;
          },
          _getImageFormat: function(b) {
            switch (b ? b.toLowerCase() : "") {
              case "jpg":
                return "image/jpeg";
              case "bmp":
                return "image/bmp";
              case "gif":
                return "image/gif";
              case "svg":
                return "image/svg+xml";
              default:
                return "image/png";
            }
          },
          getImageFormat: function() {
            switch (this.imageFormat ? this.imageFormat.toLowerCase() : "") {
              case "image/jpeg":
                return "jpg";
              case "image/bmp":
                return "bmp";
              case "image/gif":
                return "gif";
              case "image/svg+xml":
                return "svg";
              default:
                return "png";
            }
          },
          _getExtent: function(b, g, n) {
            var d;
            if (b) {
              d = new B();
              var h = parseFloat(b.getAttribute("minx")),
                x = parseFloat(b.getAttribute("miny")),
                r = parseFloat(b.getAttribute("maxx"));
              b = parseFloat(b.getAttribute("maxy"));
              n
                ? ((d.xmin = isNaN(x) ? -1 * Number.MAX_VALUE : x),
                  (d.ymin = isNaN(h) ? -1 * Number.MAX_VALUE : h),
                  (d.xmax = isNaN(b) ? Number.MAX_VALUE : b),
                  (d.ymax = isNaN(r) ? Number.MAX_VALUE : r))
                : ((d.xmin = isNaN(h) ? -1 * Number.MAX_VALUE : h),
                  (d.ymin = isNaN(x) ? -1 * Number.MAX_VALUE : x),
                  (d.xmax = isNaN(r) ? Number.MAX_VALUE : r),
                  (d.ymax = isNaN(b) ? Number.MAX_VALUE : b));
              d.spatialReference = new H({ wkid: g });
            }
            return d;
          },
          _useLatLong: function(b) {
            var g, n;
            for (n = 0; n < this._REVERSED_LAT_LONG_RANGES.length; n++) {
              var d = this._REVERSED_LAT_LONG_RANGES[n];
              if (b >= d[0] && b <= d[1]) {
                g = !0;
                break;
              }
            }
            return g;
          },
          _getTag: function(b, g) {
            return (b = h.query(b, g)) && 0 < b.length ? b[0] : null;
          },
          _getTagValue: function(b, g, n) {
            return (b = h.query(b, g)) && 0 < b.length
              ? b[0].text
                ? b[0].text
                : b[0].textContent
              : n;
          },
          _getAttributeValue: function(b, g, n, d) {
            return (b = h.query(b, n)) && 0 < b.length
              ? b[0].getAttribute(g)
              : d;
          },
          _checkVisibleLayersList: function(b) {
            if (
              b &&
              0 < b.length &&
              this.layerInfos &&
              0 < this.layerInfos.length &&
              "number" == typeof b[0]
            ) {
              var g = [];
              d.forEach(
                b,
                function(b) {
                  b < this.layerInfos.length && g.push(this.layerInfos[b].name);
                },
                this
              );
              b = g;
            }
            return b;
          },
          _stripParameters: function(b, g) {
            b = E.urlToObject(b);
            var n,
              h = [];
            for (n in b.query)
              b.query.hasOwnProperty(n) &&
                -1 === d.indexOf(g, n.toLowerCase()) &&
                h.push(n + "\x3d" + b.query[n]);
            return b.path + (h.length ? "?" + h.join("\x26") : "");
          },
          _getPopupGraphic: function(b, g) {
            var n = this.visibleLayers;
            if (!n || 0 === n.length) return null;
            var h = this._popupGraphic;
            h ||
              ((h = new y({
                title: this.title || "",
                description:
                  '\x3cdiv style\x3d"position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;"\x3e\x3ciframe src\x3d"{QUERY_URL}" width\x3d"250" height\x3d"147" frameborder\x3d"0" marginwidth\x3d"0" marginheight\x3d"0" style\x3d"position:absolute;top:0;left:0;width:100%;height:100%;border:0;background:url(\'' +
                  p.toUrl("../dijit/images/loading-throb.gif") +
                  "') transparent center no-repeat;\" onload\x3d\"(event.target || event.srcElement).style.background \x3d 'none';\"\x3e\x3c/iframe\x3e\x3c/div\x3e"
              })),
              (h = this._popupGraphic = new r(null, null, {}, h)),
              (h._layer = this));
            var D = function(a) {
                var b = [];
                if (
                  a &&
                  (a.queryable && a.showPopup && a.name && b.push(a.name),
                  a.subLayers)
                )
                  for (var e = 0; e < a.subLayers.length; e++) {
                    var c = D(a.subLayers[e]);
                    c.length && (b = b.concat(c));
                  }
                return b;
              },
              x = D({ subLayers: this.layerInfos }),
              x = d.filter(x, function(a) {
                return -1 < d.indexOf(n, a);
              });
            if (x.length) {
              var l = this.getFeatureInfoURL;
              b = this._getImageParams(b.extent, b.width, b.height);
              b = this._mixinCustomLayerParameters(b);
              b.REQUEST = "GetFeatureInfo";
              b.INFO_FORMAT = this.featureInfoFormat;
              b.QUERY_LAYERS = x.join();
              b.FEATURE_COUNT = 25;
              "1.3.0" === this.version
                ? ((b.I = Math.round(g.x)), (b.J = Math.round(g.y)))
                : ((b.X = Math.round(g.x)), (b.Y = Math.round(g.y)));
              var l = l + (-1 === l.indexOf("?") ? "?" : ""),
                e;
              for (e in b)
                b.hasOwnProperty(e) &&
                  ((l +=
                    "?" === l.substring(l.length - 1, l.length) ? "" : "\x26"),
                  (l += e + "\x3d" + b[e]));
              h.attributes.QUERY_URL = l;
              return h;
            }
            return null;
          },
          _mixinCustomParameters: function(b) {
            if (this.customParameters)
              for (var g in this.customParameters)
                b[g] = encodeURIComponent(this.customParameters[g]);
            return b;
          },
          _mixinCustomLayerParameters: function(b) {
            if (this.customLayerParameters || this.customParameters) {
              var g = l.clone(this.customParameters || {});
              l.mixin(g, this.customLayerParameters || {});
              for (var n in g)
                "styles" === n.toLowerCase() && delete b.STYLES,
                  (b[n] = encodeURIComponent(g[n]));
            }
            return b;
          }
        });
        u("extend-esri") && l.setObject("layers.WMSLayer", q, t);
        return q;
      });
    },
    "esri/layers/WMSLayerInfo": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/has",
        "../kernel"
      ], function(p, h, q, l, d) {
        p = p(null, {
          declaredClass: "esri.layers.WMSLayerInfo",
          name: null,
          title: null,
          description: null,
          extent: null,
          legendURL: null,
          subLayers: [],
          allExtents: [],
          spatialReferences: [],
          queryable: !1,
          showPopup: !1,
          constructor: function(d) {
            d &&
              ((this.name = d.name),
              (this.title = d.title),
              (this.description = d.description),
              (this.extent = d.extent),
              (this.legendURL = d.legendURL),
              (this.subLayers = d.subLayers ? d.subLayers : []),
              (this.allExtents = d.allExtents ? d.allExtents : []),
              (this.spatialReferences = d.spatialReferences
                ? d.spatialReferences
                : []),
              (this.queryable = !!d.queryable),
              (this.showPopup = !!d.showPopup));
          },
          clone: function() {
            var d = {
                name: this.name,
                title: this.title,
                description: this.description,
                legendURL: this.legendURL
              },
              b;
            this.extent && (d.extent = this.extent.getExtent());
            d.subLayers = [];
            q.forEach(this.subLayers, function(b) {
              d.subLayers.push(b.clone());
            });
            d.allExtents = [];
            for (b in this.allExtents)
              (b = parseInt(b, 10)),
                isNaN(b) || (d.allExtents[b] = this.allExtents[b].getExtent());
            d.spatialReferences = [];
            q.forEach(this.spatialReferences, function(b) {
              d.spatialReferences.push(b);
            });
            d.queryable = this.queryable;
            d.showPopup = this.showPopup;
            return d;
          }
        });
        l("extend-esri") && h.setObject("layers.WMSLayerInfo", p, d);
        return p;
      });
    },
    "widgets/AddData/search/Paging": function() {
      define("dojo/_base/declare dojo/dom-class ./SearchComponent dojo/text!./templates/Paging.html dojo/i18n!../nls/strings ./util".split(
        " "
      ), function(p, h, q, l, d, u) {
        return p([q], {
          i18n: d,
          templateString: l,
          hasLess: !1,
          hasMore: !1,
          nextStart: -1,
          numPerPage: null,
          previousStart: -1,
          start: 1,
          postCreate: function() {
            this.inherited(arguments);
            null === this.numPerPage && (this.numPerPage = 30);
            this.enableOrDisable();
          },
          startup: function() {
            if (!this._started) {
              this.inherited(arguments);
              try {
                var b = this.getConfig().numPerPage,
                  d = Number(b);
                "number" !== typeof d ||
                  isNaN(d) ||
                  ((d = Math.floor(d)),
                  1 <= d && 100 >= d && (this.numPerPage = d));
              } catch (t) {
                console.warn("Error setting numPerPage:"), console.warn(t);
              }
              null === this.numPerPage && (this.numPerPage = 30);
            }
          },
          enableOrDisable: function() {
            this.hasLess
              ? (h.remove(this.firstButton.parentNode, "disabled"),
                h.remove(this.previousButton.parentNode, "disabled"))
              : (h.add(this.firstButton.parentNode, "disabled"),
                h.add(this.previousButton.parentNode, "disabled"));
            this.hasMore
              ? h.remove(this.nextButton.parentNode, "disabled")
              : h.add(this.nextButton.parentNode, "disabled");
          },
          firstButtonClicked: function() {
            this.hasLess && ((this.start = 1), this.search());
          },
          previousButtonClicked: function() {
            this.hasLess && ((this.start = this.previousStart), this.search());
          },
          nextButtonClicked: function() {
            this.hasMore && ((this.start = this.nextStart), this.search());
          },
          appendQueryParams: function(b) {
            b.start = this.start;
            b.num = this.numPerPage;
          },
          processResults: function(b) {
            this.start = 1;
            var d = this.numPerPage,
              h = b.total,
              l = b.queryParams.start;
            1 > l && (l = 1);
            this.hasLess = !1;
            this.previousStart = -1;
            1 < l &&
              ((this.hasLess = !0),
              (this.previousStart = l - b.queryParams.num),
              1 > this.previousStart && (this.previousStart = 1));
            this.hasMore = !1;
            this.nextStart = -1;
            b.nextQueryParams &&
              1 < b.nextQueryParams.start &&
              ((this.hasMore = !0), (this.nextStart = b.nextQueryParams.start));
            b = "";
            h > d
              ? ((h = 1),
                1 < l && (h = Math.floor(l / d) + 1),
                (b = this.i18n.search.paging.pagePattern),
                (b = b.replace("{page}", "" + h)))
              : ((b = this.i18n.search.paging.pagePattern),
                (b = b.replace("{page}", "1")));
            u.setNodeText(this.pageNode, b);
            this.enableOrDisable();
          }
        });
      });
    },
    "widgets/AddData/search/ResultCount": function() {
      define("dojo/_base/declare dojo/number ./SearchComponent dojo/text!./templates/ResultCount.html dojo/i18n!../nls/strings ./util".split(
        " "
      ), function(p, h, q, l, d, u) {
        return p([q], {
          i18n: d,
          templateString: l,
          typePlural: d.search.resultCount.itemPlural,
          typeSingular: d.search.resultCount.itemSingular,
          postCreate: function() {
            this.inherited(arguments);
          },
          processResults: function(b) {
            b = b.total;
            var d = this.typePlural;
            1 === b && (d = this.typeSingular);
            var l = this.i18n.search.resultCount.countPattern,
              l = l.replace("{count}", h.format(b)),
              l = l.replace("{type}", d);
            u.setNodeText(this.messageNode, l);
          }
        });
      });
    },
    "widgets/AddData/search/AddFromUrlPane": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/on dojo/keys dojo/Deferred dojo/promise/all dojo/dom-class dojo/window dijit/Viewport dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/AddFromUrlPane.html dojo/i18n!../nls/strings ./LayerLoader ./util esri/layers/ArcGISDynamicMapServiceLayer esri/layers/ArcGISImageServiceLayer esri/layers/ArcGISTiledMapServiceLayer esri/layers/CSVLayer esri/layers/FeatureLayer esri/layers/GeoRSSLayer esri/layers/ImageParameters esri/layers/KMLLayer esri/layers/StreamLayer esri/layers/VectorTileLayer esri/layers/WMSLayer esri/layers/WMTSLayer esri/InfoTemplate jimu/dijit/Message dijit/form/Select".split(
        " "
      ), function(
        p,
        h,
        q,
        l,
        d,
        u,
        b,
        r,
        t,
        z,
        E,
        y,
        H,
        B,
        F,
        C,
        G,
        v,
        g,
        n,
        A,
        D,
        x,
        I,
        e,
        a,
        f,
        m,
        c,
        k,
        J
      ) {
        return p([E, y, H], {
          i18n: F,
          templateString: B,
          wabWidget: null,
          _dfd: null,
          postCreate: function() {
            this.inherited(arguments);
            this._updateExamples("ArcGIS");
            var a = this;
            this.own(
              l(this.urlTextBox, "keyup", function(c) {
                c.keyCode === d.ENTER
                  ? a.addClicked()
                  : r.contains(a.addButton, "disabled") || a._setStatus("");
              })
            );
            this.own(
              l(this.urlTextBox, "focus", function() {
                try {
                  a.urlTextBox.select();
                } catch (w) {}
              })
            );
            this.own(
              l(this.typeSelect, "change", function(c) {
                a._updateExamples(c);
              })
            );
            this.own(
              l(this.typeSelect.dropDown, "open", function() {
                var a = this.domNode.parentElement;
                a && r.add(a, "add-data-widget-popup");
              })
            );
            this.own(z.on("resize", a.resize()));
          },
          destroy: function() {
            this.inherited(arguments);
          },
          addClicked: function() {
            var a = this,
              c = !1,
              b = this.addButton;
            if (!r.contains(b, "disabled")) {
              var e = this.typeSelect.get("value"),
                f = h.trim(this.urlTextBox.value);
              0 < f.length &&
                (0 === f.indexOf("http://") || 0 === f.indexOf("https://")) &&
                (c = !0);
              c &&
                (r.add(b, "disabled"),
                a._setStatus(F.search.item.messages.adding),
                (c = new u()),
                this._handleAdd(c, this.wabWidget.map, e, f),
                c
                  .then(function(c) {
                    c
                      ? a._setStatus("")
                      : a._setStatus(F.search.item.messages.addFailed);
                    r.remove(b, "disabled");
                  })
                  .otherwise(function(c) {
                    "string" === typeof c && "Unsupported" === c
                      ? (a._setStatus(F.search.item.messages.unsupported),
                        r.remove(b, "disabled"))
                      : (console.warn("Add layer failed."),
                        console.warn(c),
                        a._setStatus(F.search.item.messages.addFailed),
                        r.remove(b, "disabled"),
                        c &&
                          "string" === typeof c.message &&
                          0 < c.message.length &&
                          (a._setStatus(c.message), console.log("")));
                  }));
            }
          },
          examplesExpanderClicked: function() {
            r.toggle(this.examplesNode, "show");
          },
          preHide: function() {},
          resize: function() {
            var a = t.getBox(this.ownerDocument);
            a &&
              "undefined" !== typeof a.w &&
              (600 < a.w
                ? r.add(this.urlTextBox, "url-textbox-wide")
                : r.remove(this.urlTextBox, "url-textbox-wide"));
          },
          _handleAdd: function(d, h, l, r) {
            r = G.checkMixedContent(r);
            var p = r.toLowerCase(),
              t = new C(),
              w = t._generateLayerId(),
              z = this,
              y = null;
            "ArcGIS" === l
              ? 0 < p.indexOf("/featureserver") || 0 < p.indexOf("/mapserver")
                ? t
                    ._readRestInfo(r)
                    .then(function(a) {
                      if (
                        a &&
                        "string" === typeof a.type &&
                        ("Feature Layer" === a.type || "Table" === a.type)
                      )
                        (y = new D(r, {
                          id: w,
                          outFields: ["*"],
                          infoTemplate: new k()
                        })),
                          z._waitThenAdd(d, h, l, t, y);
                      else if (0 < p.indexOf("/featureserver")) {
                        var c = [];
                        q.forEach(a.layers, function(a) {
                          a = new D(r + "/" + a.id, {
                            id: t._generateLayerId(),
                            outFields: ["*"],
                            infoTemplate: new k()
                          });
                          c.push(t._waitForLayer(a));
                        });
                        q.forEach(a.tables, function(a) {
                          a = new D(r + "/" + a.id, {
                            id: t._generateLayerId(),
                            outFields: ["*"]
                          });
                          c.push(t._waitForLayer(a));
                        });
                        b(c)
                          .then(function(a) {
                            var c = [];
                            q.forEach(a, function(a) {
                              c.push(a);
                            });
                            c.reverse();
                            q.forEach(c, function(a) {
                              t._setFeatureLayerInfoTemplate(a);
                              a.xtnAddData = !0;
                              h.addLayer(a);
                            });
                            d.resolve(c);
                          })
                          .otherwise(function(a) {
                            d.reject(a);
                          });
                      } else if (0 < p.indexOf("/mapserver")) {
                        if (a.tileInfo) y = new n(r, { id: w });
                        else {
                          var e = { id: w };
                          a &&
                            a.supportedImageFormatTypes &&
                            -1 !==
                              a.supportedImageFormatTypes.indexOf("PNG32") &&
                            ((e.imageParameters = new I()),
                            (e.imageParameters.format = "png32"));
                          y = new v(r, e);
                        }
                        z._waitThenAdd(d, h, l, t, y);
                      }
                    })
                    .otherwise(function(a) {
                      d.reject(a);
                    })
                : 0 < p.indexOf("/imageserver")
                ? ((y = new g(r, { id: w })), this._waitThenAdd(d, h, l, t, y))
                : 0 < p.indexOf("/vectortileserver") ||
                  0 < p.indexOf("/resources/styles/root.json")
                ? f && f.supported()
                  ? t
                      ._checkVectorTileUrl(r, {})
                      .then(function(a) {
                        y = new f(a, { id: w });
                        z._waitThenAdd(d, h, l, t, y);
                      })
                      .otherwise(function(a) {
                        d.reject(a);
                      })
                  : d.reject("Unsupported")
                : 0 < p.indexOf("/streamserver")
                ? ((y = new a(r, {
                    id: w,
                    purgeOptions: { displayCount: 1e4 },
                    infoTemplate: new k()
                  })),
                  this._waitThenAdd(d, h, l, t, y))
                : d.reject("Unsupported")
              : "WMS" === l
              ? ((y = new m(r, { id: w })), this._waitThenAdd(d, h, l, t, y))
              : "WMTS" === l
              ? (y = new c(r, { id: w }))
              : "WFS" === l
              ? G.loadWFSByUrl(d, h, t, r, w, !0)
              : "KML" === l
              ? ((y = new e(r, { id: w })), this._waitThenAdd(d, h, l, t, y))
              : "GeoRSS" === l
              ? ((y = new x(r, { id: w })), this._waitThenAdd(d, h, l, t, y))
              : "CSV" === l &&
                ((y = new A(r, { id: w })),
                y.setInfoTemplate(t._newInfoTemplate()),
                this._waitThenAdd(d, h, l, t, y));
          },
          _persist: function() {
            try {
              var a = this.typeSelect.get("value"),
                c = h.trim(this.urlTextBox.value);
              this.wabWidget.xtnAddFromUrlPane = { type: a, url: c };
            } catch (P) {}
          },
          _restore: function() {
            try {
              var a = this.wabWidget.xtnAddFromUrlPane;
              a &&
                "string" === typeof a.type &&
                0 < a.type.length &&
                this.typeSelect.set("value", a.type);
              a &&
                "string" === typeof a.url &&
                0 < a.url.length &&
                (this.urlTextBox.value = a.url);
            } catch (w) {}
          },
          _setStatus: function(a) {
            this.wabWidget && this.wabWidget._setStatus(a);
          },
          _showLayers: function() {
            this.wabWidget && this.wabWidget.showLayers();
          },
          _updateExamples: function(a) {
            q.forEach(this.examplesNode.children, function(c) {
              var b = c.getAttribute("data-examples-type");
              "string" === typeof b &&
                0 < b.length &&
                (c.style.display = b === a ? "" : "none");
            });
          },
          _waitThenAdd: function(a, c, b, e, f) {
            e._waitForLayer(f)
              .then(function(f) {
                "WMS" === b
                  ? e._setWMSVisibleLayers(f)
                  : f &&
                    "esri.layers.ArcGISDynamicMapServiceLayer" ===
                      f.declaredClass
                  ? e._setDynamicLayerInfoTemplates(f)
                  : f && "esri.layers.FeatureLayer" === f.declaredClass
                  ? e._setFeatureLayerInfoTemplate(f)
                  : f &&
                    "esri.layers.CSVLayer" === f.declaredClass &&
                    e._setFeatureLayerInfoTemplate(f);
                f.xtnAddData = !0;
                if ("KML" === b) {
                  var g = c.spatialReference,
                    k = f._outSR;
                  g &&
                  k &&
                  (g.equals(k) ||
                    (g.isWebMercator() && 4326 === k.wkid) ||
                    (k.isWebMercator() && 4326 === g.wkid))
                    ? c.addLayer(f)
                    : new J({
                        titleLabel: F._widgetLabel,
                        message: F.addFromFile.kmlProjectionMismatch
                      });
                } else c.addLayer(f);
                a.resolve(f);
              })
              .otherwise(function(c) {
                a.reject(c);
              });
          }
        });
      });
    },
    "esri/layers/CSVLayer": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../arcgis/csv ./FeatureLayer ../geometry/Extent ../tasks/FeatureSet".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t) {
        h = h(b, {
          declaredClass: "esri.layers.CSVLayer",
          _preventInit: !0,
          _fieldTypeMap: {
            Date: "esriFieldTypeDate",
            Number: "esriFieldTypeDouble",
            String: "esriFieldTypeString"
          },
          constructor: function(b, d) {
            this.url = b;
            d = q.mixin({}, d);
            this.columnDelimiter = d.columnDelimiter;
            this.latitudeFieldName = d.latitudeFieldName;
            this.longitudeFieldName = d.longitudeFieldName;
            b = d.layerDefinition;
            b ||
              ((b = {
                fields: d.fields || [],
                geometryType: "esriGeometryPoint",
                copyrightText: d.copyright
              }),
              d.fields &&
                p.forEach(
                  d.fields,
                  function(b) {
                    b.type = this._fieldTypeMap[b.type || "String"];
                    b.alias || (b.alias = b.name);
                  },
                  this
                ));
            this._buildCsvFcParam = {
              url: this.url,
              columnDelimiter: this.columnDelimiter,
              layerDefinition: b,
              outFields: d.outFields
            };
            this.latitudeFieldName &&
              this.longitudeFieldName &&
              (this._buildCsvFcParam.locationInfo = {
                locationType: "coordinates",
                latitudeFieldName: this.latitudeFieldName,
                longitudeFieldName: this.longitudeFieldName
              });
            this._projectFeatures = q.hitch(this, this._projectFeatures);
            this._addFeatures = q.hitch(this, this._addFeatures);
            this._initCSVLayer(d);
          },
          refresh: function() {
            this._fireUpdateStart();
            this.applyEdits(null, null, this.graphics);
            this._loadFeatures();
          },
          _isWebGLCompatible: function() {
            return !1;
          },
          _setMap: function(b) {
            var d = this.inherited(arguments);
            this._fireUpdateStart();
            this._projectFeatures(this._csvFC)
              .then(this._addFeatures)
              .otherwise(this._errorHandler);
            this._csvFC = null;
            return d;
          },
          _initCSVLayer: function(b) {
            var d = this;
            u.buildCSVFeatureCollection(this._buildCsvFcParam)
              .then(function(h) {
                !d._buildCsvFcParam.locationInfo ||
                  (d.latitudeFieldName && d.longitudeFieldName) ||
                  ((d.latitudeFieldName =
                    d._buildCsvFcParam.locationInfo.latitudeFieldName),
                  (d.longitudeFieldName =
                    d._buildCsvFcParam.locationInfo.longitudeFieldName));
                d._csvFC = h;
                var l = h.layerDefinition;
                l.extent = d._getFCExtent(h);
                b.outFields || (b.outFields = ["*"]);
                b.timeInfo && (l.timeInfo = b.timeInfo);
                d._initFeatureLayer({ layerDefinition: l }, b);
              })
              .otherwise(this._errorHandler);
          },
          _loadFeatures: function() {
            u.buildCSVFeatureCollection(this._buildCsvFcParam)
              .then(this._projectFeatures)
              .then(this._addFeatures)
              .otherwise(this._errorHandler);
          },
          _projectFeatures: function(b) {
            return u.projectFeatureCollection(b, this._map.spatialReference);
          },
          _addFeatures: function(b) {
            b = new t(b.featureSet);
            this.applyEdits(b.features, null, null);
            this._fireUpdateEnd();
          },
          _getFCExtent: function(b) {
            var d;
            if (b && b.featureSet && b.featureSet.features) {
              b = b.featureSet.features;
              var h = b.length;
              if (1 < h) {
                var l = b[0].geometry;
                d = new r(l.x, l.y, l.x, l.y);
                for (--h; 0 < h; h--)
                  (l = b[h].geometry),
                    (d.xmin = Math.min(d.xmin, l.x)),
                    (d.ymin = Math.min(d.ymin, l.y)),
                    (d.xmax = Math.max(d.xmax, l.x)),
                    (d.ymax = Math.max(d.ymax, l.y));
                0 >= d.getWidth() && 0 >= d.getHeight() && (d = null);
              }
            }
            return d;
          }
        });
        l("extend-esri") && q.setObject("layers.CSVLayer", h, d);
        return h;
      });
    },
    "esri/arcgis/csv": function() {
      define("dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/sniff dojo/number dojox/data/CsvStore ../kernel ../config ../request ../SpatialReference ../geometry/jsonUtils ../geometry/webMercatorUtils".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z, E, y) {
        function H(b) {
          var g = 0,
            d = "";
          h.forEach([",", " ", ";", "|", "\t"], function(e) {
            var a = b.split(e).length;
            a > g && ((g = a), (d = e));
          });
          return d;
        }
        function B(b, g) {
          if (
            !b ||
            "[object Date]" !== Object.prototype.toString.call(b) ||
            isNaN(b.getTime())
          )
            return !1;
          b = !0;
          if (l("chrome") && /\d+\W*$/.test(g)) {
            if (g.match(/[^0-9a-zA-Z\s]/)) return !1;
            if ((g = g.match(/[a-zA-Z]{2,}/))) {
              b = !1;
              for (
                var d = 0,
                  e = g.length,
                  a = /^((jan(uary)?)|(feb(ruary)?)|(mar(ch)?)|(apr(il)?)|(may)|(jun(e)?)|(jul(y)?)|(aug(ust)?)|(sep(tember)?)|(oct(ober)?)|(nov(ember)?)|(dec(ember)?)|(am)|(pm)|(gmt)|(utc))$/i;
                !b && d <= e && !(b = !a.test(g[d]));

              )
                d++;
              b = !b;
            }
          }
          return b;
        }
        function F(b, x, l) {
          var e = b.indexOf("\n"),
            e = p.trim(b.substr(0, e)),
            a = x.columnDelimiter;
          a || (a = H(e));
          var f = new u({ data: b, separator: a });
          f.fetch({
            onComplete: function(a, c) {
              c = 0;
              var b = {
                  layerDefinition: x.layerDefinition,
                  featureSet: {
                    features: [],
                    geometryType: "esriGeometryPoint"
                  }
                },
                e = b.layerDefinition.objectIdField,
                m = b.layerDefinition.fields;
              e ||
                h.some(m, function(a) {
                  return "esriFieldTypeOID" === a.type
                    ? ((e = a.name), !0)
                    : !1;
                }) ||
                (m.push({
                  name: "__OBJECTID",
                  alias: "__OBJECTID",
                  type: "esriFieldTypeOID",
                  editable: !1
                }),
                (e = "__OBJECTID"));
              var D,
                r,
                A = f._attributes,
                t = [],
                I = [];
              h.forEach(m, function(a) {
                "esriFieldTypeDate" === a.type
                  ? t.push(a.name)
                  : ("esriFieldTypeDouble" !== a.type &&
                      "esriFieldTypeInteger" !== a.type) ||
                    I.push(a.name);
              });
              x.locationInfo && "coordinates" === x.locationInfo.locationType
                ? ((D = x.locationInfo.latitudeFieldName),
                  (r = x.locationInfo.longitudeFieldName))
                : (h.forEach(A, function(a) {
                    var c;
                    c = h.indexOf(g, a.toLowerCase());
                    -1 !== c && (D = a);
                    c = h.indexOf(n, a.toLowerCase());
                    -1 !== c && (r = a);
                  }),
                  D &&
                    r &&
                    (x.locationInfo = {
                      locationType: "coordinates",
                      latitudeFieldName: D,
                      longitudeFieldName: r
                    }));
              if (D && r) {
                -1 === h.indexOf(I, D) && I.push(D);
                -1 === h.indexOf(I, r) && I.push(r);
                var q;
                p.isArray(x.outFields) &&
                  -1 === h.indexOf(x.outFields, "*") &&
                  (q = x.outFields);
                h.forEach(A, function(a) {
                  h.some(m, function(c) {
                    return a === c.name;
                  }) ||
                    m.push({
                      name: a,
                      alias: a,
                      type:
                        a === D || a === r
                          ? "esriFieldTypeDouble"
                          : "esriFieldTypeString"
                    });
                });
                var A = 0,
                  v = a.length;
                for (A; A < v; A++) {
                  var y = a[A],
                    C = f.getAttributes(y),
                    z = {};
                  h.forEach(C, function(a) {
                    if (
                      a &&
                      (a === D || a === r || !q || -1 < h.indexOf(q, a))
                    ) {
                      var c = a;
                      0 === a.length &&
                        h.forEach(m, function(c, b) {
                          c.name === "attribute_" + (b - 1) &&
                            (a = "attribute_" + (b - 1));
                        });
                      if (-1 < h.indexOf(t, a)) {
                        var c = f.getValue(y, c),
                          b = new Date(c);
                        z[a] = B(b, c) ? b.getTime() : null;
                      } else
                        -1 < h.indexOf(I, a)
                          ? ((b = d.parse(f.getValue(y, c))),
                            (a !== D && a !== r) ||
                              !(isNaN(b) || 181 < Math.abs(b)) ||
                              (b = parseFloat(f.getValue(y, c))),
                            isNaN(b) ? (z[a] = null) : (z[a] = b))
                          : (z[a] = f.getValue(y, c));
                    }
                  });
                  z[e] = c;
                  c++;
                  var C = z[D],
                    G = z[r];
                  null == G ||
                    null == C ||
                    isNaN(C) ||
                    isNaN(G) ||
                    (q && -1 === h.indexOf(q, D) && delete z[D],
                    q && -1 === h.indexOf(q, r) && delete z[r],
                    b.featureSet.features.push({
                      geometry: {
                        x: G,
                        y: C,
                        spatialReference: { wkid: 4326 }
                      },
                      attributes: z
                    }));
                }
                b.layerDefinition.name = "csv";
                l && l(b);
              } else
                setTimeout(function() {
                  console.error(
                    "File does not seem to contain fields with point coordinates."
                  );
                }, 1),
                  l &&
                    l(
                      null,
                      Error(
                        "File does not seem to contain fields with point coordinates."
                      )
                    );
            },
            onError: function(a) {
              console.error("Error fetching items from CSV store: ", a);
              l && l(null, a);
            }
          });
          return !0;
        }
        function C(b, g, d, e, a, f) {
          0 === b.length && a(null);
          var n = E.getGeometryType(g),
            c = [];
          h.forEach(
            b,
            function(a) {
              a = new n(a);
              a.spatialReference = d;
              c.push(a);
            },
            this
          );
          g = [102113, 102100, 3857];
          d.wkid && 4326 === d.wkid && e.wkid && -1 < h.indexOf(g, e.wkid)
            ? (h.forEach(
                c,
                function(a) {
                  a.xmin
                    ? ((a.xmin = Math.max(a.xmin, -180)),
                      (a.xmax = Math.min(a.xmax, 180)),
                      (a.ymin = Math.max(a.ymin, -89.99)),
                      (a.ymax = Math.min(a.ymax, 89.99)))
                    : a.rings
                    ? h.forEach(
                        a.rings,
                        function(a) {
                          h.forEach(
                            a,
                            function(a) {
                              a[0] = Math.min(Math.max(a[0], -180), 180);
                              a[1] = Math.min(Math.max(a[1], -89.99), 89.99);
                            },
                            this
                          );
                        },
                        this
                      )
                    : a.paths
                    ? h.forEach(
                        a.paths,
                        function(a) {
                          h.forEach(
                            a,
                            function(a) {
                              a[0] = Math.min(Math.max(a[0], -180), 180);
                              a[1] = Math.min(Math.max(a[1], -89.99), 89.99);
                            },
                            this
                          );
                        },
                        this
                      )
                    : a.x &&
                      ((a.x = Math.min(Math.max(a.x, -180), 180)),
                      (a.y = Math.min(Math.max(a.y, -89.99), 89.99)));
                },
                this
              ),
              (b = []),
              h.forEach(
                c,
                function(a) {
                  a = y.geographicToWebMercator(a);
                  102100 !== e.wkid && (a.spatialReference = e);
                  b.push(a.toJson());
                },
                this
              ),
              a(b))
            : null !== d.wkid &&
              -1 < h.indexOf(g, d.wkid) &&
              null !== e.wkid &&
              4326 === e.wkid
            ? ((b = []),
              h.forEach(
                c,
                function(a) {
                  b.push(y.webMercatorToGeographic(a).toJson());
                },
                this
              ),
              a(b))
            : ((g = function(c, e) {
                c && c.length === b.length
                  ? ((b = []),
                    h.forEach(
                      c,
                      function(a) {
                        a &&
                        ((a.rings &&
                          0 < a.rings.length &&
                          0 < a.rings[0].length &&
                          0 < a.rings[0][0].length &&
                          !isNaN(a.rings[0][0][0]) &&
                          !isNaN(a.rings[0][0][1])) ||
                          (a.paths &&
                            0 < a.paths.length &&
                            0 < a.paths[0].length &&
                            0 < a.paths[0][0].length &&
                            !isNaN(a.paths[0][0][0]) &&
                            !isNaN(a.paths[0][0][1])) ||
                          (a.xmin &&
                            !isNaN(a.xmin) &&
                            a.ymin &&
                            !isNaN(a.ymin)) ||
                          (a.x && !isNaN(a.x) && a.y && !isNaN(a.y)))
                          ? b.push(a.toJson())
                          : b.push(null);
                      },
                      this
                    ),
                    a(b))
                  : f(c, e);
              }),
              r.defaults.geometryService
                ? r.defaults.geometryService.project(c, e, p.hitch(this, g), f)
                : a(null));
        }
        function G(b, g) {
          var d = [102113, 102100, 3857];
          return (b && g && b.wkid === g.wkid && b.wkt === g.wkt) ||
            (b &&
              g &&
              b.wkid &&
              g.wkid &&
              -1 < h.indexOf(d, b.wkid) &&
              -1 < h.indexOf(d, g.wkid))
            ? !0
            : !1;
        }
        function v(b, g, d, e) {
          if (b.featureSet && 0 !== b.featureSet.features.length)
            if (G(d, g)) e(b);
            else {
              var a,
                f = function(a) {
                  var c = [];
                  h.forEach(
                    b.featureSet.features,
                    function(b, e) {
                      a[e] && ((b.geometry = a[e]), c.push(b));
                    },
                    this
                  );
                  e(b);
                },
                n = function(a, c) {
                  console.error(
                    "error projecting featureSet (" +
                      b.layerDefinition.name +
                      "). Final try."
                  );
                  e(b);
                },
                c = function(c, e) {
                  console.error(
                    "error projecting featureSet (" +
                      b.layerDefinition.name +
                      "). Try one more time."
                  );
                  C(
                    a,
                    b.featureSet.geometryType,
                    g,
                    d,
                    p.hitch(this, f),
                    p.hitch(this, n)
                  );
                };
              b.featureSet.features && 0 < b.featureSet.features.length
                ? ((a = []),
                  h.forEach(b.featureSet.features, function(c) {
                    if (c.geometry.toJson) a.push(c.geometry);
                    else {
                      var e = E.getGeometryType(b.featureSet.geometryType);
                      a.push(new e(c.geometry));
                    }
                  }),
                  g.toJson || (g = new z(g)),
                  d.toJson || (d = new z(d)),
                  C(
                    a,
                    b.featureSet.geometryType,
                    g,
                    d,
                    p.hitch(this, f),
                    p.hitch(this, c)
                  ))
                : e(b);
            }
        }
        var g = "lat latitude y ycenter latitude83 latdecdeg point-y lat_dd".split(
            " "
          ),
          n = "lon lng long longitude x xcenter longitude83 longdecdeg point-x long_dd".split(
            " "
          ),
          A = {
            latFieldStrings: g,
            longFieldStrings: n,
            buildCSVFeatureCollection: function(b) {
              var g = new q(),
                d = function(a, b) {
                  b ? g.errback(b) : g.callback(a);
                },
                e = {
                  url: b.url,
                  handleAs: "text",
                  load: function(a) {
                    F(a, b, p.hitch(this, d));
                  },
                  error: function(a) {
                    g.errback(a);
                    console.error("error: " + a);
                  }
                };
              -1 < b.url.indexOf("arcgis.com") &&
                -1 < b.url.indexOf("/content/items") &&
                -1 < b.url.indexOf("/data") &&
                (e.headers = { "Content-Type": "" });
              t(e, { usePost: !1 });
              return g;
            },
            projectFeatureCollection: function(b, g, d) {
              var e = new q();
              d || (d = new z({ wkid: 4326 }));
              v(
                b,
                d,
                g,
                p.hitch(this, function(a) {
                  e.callback(a);
                })
              );
              return e;
            },
            generateDefaultPopupInfo: function(b) {
              var g = { esriFieldTypeDouble: 1, esriFieldTypeSingle: 1 },
                d = { esriFieldTypeInteger: 1, esriFieldTypeSmallInteger: 1 },
                e = { esriFieldTypeDate: 1 },
                a = null;
              b = h.map(
                b.layerDefinition.fields,
                p.hitch(this, function(b) {
                  "NAME" === b.name.toUpperCase() && (a = b.name);
                  var f =
                      "esriFieldTypeOID" !== b.type &&
                      "esriFieldTypeGlobalID" !== b.type &&
                      "esriFieldTypeGeometry" !== b.type,
                    c = null;
                  if (f) {
                    var k = b.name.toLowerCase();
                    if (
                      -1 <
                        ",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,".indexOf(
                          "," + k + ","
                        ) ||
                      -1 < k.indexOf("area") ||
                      -1 < k.indexOf("length") ||
                      -1 < k.indexOf("shape") ||
                      -1 < k.indexOf("perimeter") ||
                      -1 < k.indexOf("objectid") ||
                      k.indexOf("_") === k.length - 1 ||
                      (k.indexOf("_i") === k.length - 2 && 1 < k.length)
                    )
                      f = !1;
                    b.type in d
                      ? (c = { places: 0, digitSeparator: !0 })
                      : b.type in g
                      ? (c = { places: 2, digitSeparator: !0 })
                      : b.type in e &&
                        (c = { dateFormat: "shortDateShortTime" });
                  }
                  return p.mixin(
                    {},
                    {
                      fieldName: b.name,
                      label: b.alias,
                      isEditable: !0,
                      tooltip: "",
                      visible: f,
                      format: c,
                      stringFieldOption: "textbox"
                    }
                  );
                })
              );
              return {
                title: a ? "{" + a + "}" : "",
                fieldInfos: b,
                description: null,
                showAttachments: !1,
                mediaInfos: []
              };
            },
            _getSeparator: H,
            _isValidDate: B,
            _processCsvData: F,
            _projectGeometries: C,
            _sameSpatialReference: G,
            _projectFeatureSet: v
          };
        l("extend-esri") && p.setObject("arcgis.csv", A, b);
        return A;
      });
    },
    "dojox/data/CsvStore": function() {
      define("dojo/_base/lang dojo/_base/declare dojo/_base/xhr dojo/_base/kernel dojo/data/util/filter dojo/data/util/simpleFetch".split(
        " "
      ), function(p, h, q, l, d, u) {
        h = h("dojox.data.CsvStore", null, {
          constructor: function(b) {
            this._attributes = [];
            this._attributeIndexes = {};
            this._dataArray = [];
            this._arrayOfAllItems = [];
            this._loadFinished = !1;
            b.url && (this.url = b.url);
            this._csvData = b.data;
            b.label
              ? (this.label = b.label)
              : "" === this.label && (this.label = void 0);
            this._storeProp = "_csvStore";
            this._idProp = "_csvId";
            this._features = {
              "dojo.data.api.Read": !0,
              "dojo.data.api.Identity": !0
            };
            this._loadInProgress = !1;
            this._queuedFetches = [];
            this.identifier = b.identifier;
            "" === this.identifier
              ? delete this.identifier
              : (this._idMap = {});
            "separator" in b && (this.separator = b.separator);
            "urlPreventCache" in b &&
              (this.urlPreventCache = b.urlPreventCache ? !0 : !1);
          },
          url: "",
          label: "",
          identifier: "",
          separator: ",",
          urlPreventCache: !1,
          _assertIsItem: function(b) {
            if (!this.isItem(b))
              throw Error(
                this.declaredClass +
                  ": a function was passed an item argument that was not an item"
              );
          },
          _getIndex: function(b) {
            b = this.getIdentity(b);
            this.identifier && (b = this._idMap[b]);
            return b;
          },
          getValue: function(b, d, h) {
            this._assertIsItem(b);
            var l = h;
            if ("string" === typeof d)
              (d = this._attributeIndexes[d]),
                null != d && (l = this._dataArray[this._getIndex(b)][d] || h);
            else
              throw Error(
                this.declaredClass +
                  ": a function was passed an attribute argument that was not a string"
              );
            return l;
          },
          getValues: function(b, d) {
            return (b = this.getValue(b, d)) ? [b] : [];
          },
          getAttributes: function(b) {
            this._assertIsItem(b);
            var d = [];
            b = this._dataArray[this._getIndex(b)];
            for (var h = 0; h < b.length; h++)
              "" !== b[h] && d.push(this._attributes[h]);
            return d;
          },
          hasAttribute: function(b, d) {
            this._assertIsItem(b);
            if ("string" === typeof d)
              return (
                (d = this._attributeIndexes[d]),
                (b = this._dataArray[this._getIndex(b)]),
                "undefined" !== typeof d && d < b.length && "" !== b[d]
              );
            throw Error(
              this.declaredClass +
                ": a function was passed an attribute argument that was not a string"
            );
          },
          containsValue: function(b, h, l) {
            var r = void 0;
            "string" === typeof l && (r = d.patternToRegExp(l, !1));
            return this._containsValue(b, h, l, r);
          },
          _containsValue: function(b, d, h, l) {
            b = this.getValues(b, d);
            for (d = 0; d < b.length; ++d) {
              var r = b[d];
              if ("string" === typeof r && l) return null !== r.match(l);
              if (h === r) return !0;
            }
            return !1;
          },
          isItem: function(b) {
            if (b && b[this._storeProp] === this)
              if (((b = b[this._idProp]), this.identifier)) {
                if (this._dataArray[this._idMap[b]]) return !0;
              } else if (0 <= b && b < this._dataArray.length) return !0;
            return !1;
          },
          isItemLoaded: function(b) {
            return this.isItem(b);
          },
          loadItem: function(b) {},
          getFeatures: function() {
            return this._features;
          },
          getLabel: function(b) {
            if (this.label && this.isItem(b))
              return this.getValue(b, this.label);
          },
          getLabelAttributes: function(b) {
            return this.label ? [this.label] : null;
          },
          _fetchItems: function(b, h, l) {
            var r = this,
              p = function(b, l) {
                var p = null;
                if (b.query) {
                  var q,
                    g,
                    p = [],
                    n = b.queryOptions ? b.queryOptions.ignoreCase : !1,
                    A = {};
                  for (q in b.query)
                    (g = b.query[q]),
                      "string" === typeof g && (A[q] = d.patternToRegExp(g, n));
                  for (n = 0; n < l.length; ++n) {
                    var D = !0,
                      x = l[n];
                    for (q in b.query)
                      (g = b.query[q]),
                        r._containsValue(x, q, g, A[q]) || (D = !1);
                    D && p.push(x);
                  }
                } else p = l.slice(0, l.length);
                h(p, b);
              };
            if (this._loadFinished) p(b, this._arrayOfAllItems);
            else if ("" !== this.url)
              if (this._loadInProgress)
                this._queuedFetches.push({ args: b, filter: p });
              else {
                this._loadInProgress = !0;
                var t = q.get({
                  url: r.url,
                  handleAs: "text",
                  preventCache: r.urlPreventCache
                });
                t.addCallback(function(d) {
                  try {
                    r._processData(d),
                      p(b, r._arrayOfAllItems),
                      r._handleQueuedFetches();
                  } catch (C) {
                    l(C, b);
                  }
                });
                t.addErrback(function(d) {
                  r._loadInProgress = !1;
                  if (l) l(d, b);
                  else throw d;
                });
                var u = null;
                b.abort && (u = b.abort);
                b.abort = function() {
                  var d = t;
                  d && -1 === d.fired && (d.cancel(), (d = null));
                  u && u.call(b);
                };
              }
            else if (this._csvData)
              try {
                this._processData(this._csvData),
                  (this._csvData = null),
                  p(b, this._arrayOfAllItems);
              } catch (F) {
                l(F, b);
              }
            else {
              var B = Error(
                this.declaredClass +
                  ": No CSV source data was provided as either URL or String data input."
              );
              if (l) l(B, b);
              else throw B;
            }
          },
          close: function(b) {},
          _getArrayOfArraysFromCsvFileContents: function(b) {
            if (p.isString(b)) {
              var d = /^\s+/g,
                h = /\s+$/g,
                l = /""/g,
                q = [],
                y = this._splitLines(b);
              for (b = 0; b < y.length; ++b) {
                var u = y[b];
                if (0 < u.length) {
                  for (var u = u.split(this.separator), B = 0; B < u.length; ) {
                    var F = u[B].replace(d, ""),
                      C = F.replace(h, ""),
                      G = C.charAt(0),
                      v = C.charAt(C.length - 1),
                      g = C.charAt(C.length - 2),
                      n = C.charAt(C.length - 3);
                    if (2 === C.length && '""' == C) u[B] = "";
                    else if (
                      '"' == G &&
                      ('"' != v || ('"' == v && '"' == g && '"' != n))
                    ) {
                      if (B + 1 === u.length) return;
                      u[B] = F + this.separator + u[B + 1];
                      u.splice(B + 1, 1);
                    } else
                      '"' == G &&
                        '"' == v &&
                        ((C = C.slice(1, C.length - 1)),
                        (C = C.replace(l, '"'))),
                        (u[B] = C),
                        (B += 1);
                  }
                  q.push(u);
                }
              }
              this._attributes = q.shift();
              for (b = 0; b < this._attributes.length; b++)
                this._attributeIndexes[this._attributes[b]] = b;
              this._dataArray = q;
            }
          },
          _splitLines: function(b) {
            var d = [],
              h,
              l = "",
              p = !1;
            for (h = 0; h < b.length; h++) {
              var q = b.charAt(h);
              switch (q) {
                case '"':
                  p = !p;
                  l += q;
                  break;
                case "\r":
                  p
                    ? (l += q)
                    : (d.push(l),
                      (l = ""),
                      h < b.length - 1 && "\n" == b.charAt(h + 1) && h++);
                  break;
                case "\n":
                  p ? (l += q) : (d.push(l), (l = ""));
                  break;
                default:
                  l += q;
              }
            }
            "" !== l && d.push(l);
            return d;
          },
          _processData: function(b) {
            this._getArrayOfArraysFromCsvFileContents(b);
            this._arrayOfAllItems = [];
            if (
              this.identifier &&
              void 0 === this._attributeIndexes[this.identifier]
            )
              throw Error(
                this.declaredClass +
                  ": Identity specified is not a column header in the data set."
              );
            for (b = 0; b < this._dataArray.length; b++) {
              var d = b;
              this.identifier &&
                ((d = this._dataArray[b][
                  this._attributeIndexes[this.identifier]
                ]),
                (this._idMap[d] = b));
              this._arrayOfAllItems.push(this._createItemFromIdentity(d));
            }
            this._loadFinished = !0;
            this._loadInProgress = !1;
          },
          _createItemFromIdentity: function(b) {
            var d = {};
            d[this._storeProp] = this;
            d[this._idProp] = b;
            return d;
          },
          getIdentity: function(b) {
            return this.isItem(b) ? b[this._idProp] : null;
          },
          fetchItemByIdentity: function(b) {
            var d,
              h = b.scope ? b.scope : l.global;
            if (this._loadFinished)
              (d = this._createItemFromIdentity(b.identity)),
                this.isItem(d) || (d = null),
                b.onItem && b.onItem.call(h, d);
            else {
              var p = this;
              if ("" !== this.url)
                this._loadInProgress
                  ? this._queuedFetches.push({ args: b })
                  : ((this._loadInProgress = !0),
                    (d = q.get({ url: p.url, handleAs: "text" })),
                    d.addCallback(function(d) {
                      try {
                        p._processData(d);
                        var l = p._createItemFromIdentity(b.identity);
                        p.isItem(l) || (l = null);
                        b.onItem && b.onItem.call(h, l);
                        p._handleQueuedFetches();
                      } catch (H) {
                        b.onError && b.onError.call(h, H);
                      }
                    }),
                    d.addErrback(function(d) {
                      this._loadInProgress = !1;
                      b.onError && b.onError.call(h, d);
                    }));
              else if (this._csvData)
                try {
                  p._processData(p._csvData),
                    (p._csvData = null),
                    (d = p._createItemFromIdentity(b.identity)),
                    p.isItem(d) || (d = null),
                    b.onItem && b.onItem.call(h, d);
                } catch (E) {
                  b.onError && b.onError.call(h, E);
                }
            }
          },
          getIdentityAttributes: function(b) {
            return this.identifier ? [this.identifier] : null;
          },
          _handleQueuedFetches: function() {
            if (0 < this._queuedFetches.length) {
              for (var b = 0; b < this._queuedFetches.length; b++) {
                var d = this._queuedFetches[b],
                  h = d.filter,
                  l = d.args;
                h
                  ? h(l, this._arrayOfAllItems)
                  : this.fetchItemByIdentity(d.args);
              }
              this._queuedFetches = [];
            }
          }
        });
        p.extend(h, u);
        return h;
      });
    },
    "esri/layers/GeoRSSLayer": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has ../kernel ../config ../request ../urlUtils ./ServiceGeneratedFeatureCollection".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t) {
        p = p([t], {
          declaredClass: "esri.layers.GeoRSSLayer",
          serviceUrl:
            r.getProtocolForWebResource() + "//utility.arcgis.com/sharing/rss",
          constructor: function(b, d) {
            u.defaults.geoRSSService &&
              (this.serviceUrl = u.defaults.geoRSSService);
            this._createLayer();
          },
          parse: function() {
            return (this._io = b({
              url: this.serviceUrl,
              content: {
                url: this.url,
                refresh: this.loaded ? !0 : void 0,
                outSR: this._outSR ? q.toJson(this._outSR.toJson()) : void 0
              },
              callbackParamName: "callback"
            }));
          },
          _initLayer: function(b) {
            this.inherited(arguments);
            this.loaded || ((this.loaded = !0), this.onLoad(this));
          }
        });
        l("extend-esri") && h.setObject("layers.GeoRSSLayer", p, d);
        return p;
      });
    },
    "esri/layers/ServiceGeneratedFeatureCollection": function() {
      define("dojo/_base/declare dojo/_base/connect dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/dom-style dojo/has ../kernel ../SpatialReference ../geometry/Extent ../geometry/webMercatorUtils ../renderers/SimpleRenderer ./layer ./FeatureLayer ../dijit/PopupTemplate".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z, E, y, H, B, F) {
        p = p([H], {
          declaredClass: "esri.layers._ServiceGeneratedFeatureCollection",
          constructor: function(b, d) {
            this.pointSymbol = d && d.pointSymbol;
            this.polylineSymbol = d && d.polylineSymbol;
            this.polygonSymbol = d && d.polygonSymbol;
            this._outSR =
              (d && (d.outSpatialReference || d.outSR)) ||
              new t({ wkid: 4326 });
            this._options = q.mixin({}, d);
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
          _createLayer: function(b) {
            var d = this;
            this._fireUpdateStart();
            b = this.parse(b);
            b.addCallback(function(b) {
              d._io = null;
              d._initLayer(b);
            });
            b.addErrback(function(b) {
              d._io = null;
              b = q.mixin(Error(), b);
              b.message =
                "Unable to load resource: " + d.url + " " + (b.message || "");
              d._fireUpdateEnd(b);
              d.onError(b);
            });
          },
          _initLayer: function(b) {
            this.loaded && this._removeInternalLayers();
            this.name = b.name;
            this.description = b.description;
            this.snippet = b.snippet;
            this.featureInfos = b.featureInfos;
            this.fullExtent = this.initialExtent = new z(b.lookAtExtent);
            this.copyright = b.author || b.copyright;
            var d;
            (b = q.getObject("featureCollection.layers", !1, b)) &&
              0 < b.length &&
              ((this._fLayers = []),
              l.forEach(
                b,
                function(b, g) {
                  var n = q.getObject("featureSet.features", !1, b);
                  n &&
                    0 < n.length &&
                    ((d = q.mixin(
                      {
                        outFields: ["*"],
                        infoTemplate: b.popupInfo ? new F(b.popupInfo) : null,
                        editable: !1
                      },
                      this._options
                    )),
                    d.id && (d.id = d.id + "_" + g),
                    (d.webgl = !1),
                    (b.layerDefinition.capabilities = "Query,Data"),
                    (b = new B(b, d)),
                    b.geometryType && (this["_" + b.geometryType] = b),
                    this._fLayers.push(b));
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
                ((b = new y(this.pointSymbol)),
                this._esriGeometryPoint.setRenderer(b)));
            this._esriGeometryPolyline &&
              ((this.items = this.items.concat(
                this._esriGeometryPolyline.graphics
              )),
              this.polylineSymbol &&
                ((b = new y(this.polylineSymbol)),
                this._esriGeometryPolyline.setRenderer(b)));
            this._esriGeometryPolygon &&
              ((this.items = this.items.concat(
                this._esriGeometryPolygon.graphics
              )),
              this.polygonSymbol &&
                ((b = new y(this.polygonSymbol)),
                this._esriGeometryPolygon.setRenderer(b)));
            this._fireUpdateEnd();
            this.loaded && (this._addInternalLayers(), this.onRefresh());
          },
          _addInternalLayers: function() {
            var b = this._map;
            this._fireUpdateStart();
            var d = b.spatialReference,
              h = this._outSR,
              g;
            if (d.wkid)
              g =
                (d._isWebMercator() && h._isWebMercator()) || d.wkid === h.wkid;
            else if (d.wkt) g = d.wkt === h.wkt;
            else {
              console.log("_setMap - map has invalid spatial reference");
              return;
            }
            if (!g)
              if (d._isWebMercator() && 4326 === h.wkid)
                this._converter = E.geographicToWebMercator;
              else if (h._isWebMercator() && 4326 === d.wkid)
                this._converter = E.webMercatorToGeographic;
              else {
                console.log(
                  "_setMap - unsupported workflow. Spatial reference of the map and layer do not match, and the conversion cannot be done on the client."
                );
                return;
              }
            (d = this._fLayers) &&
              0 < d.length &&
              l.forEach(
                d,
                function(g) {
                  if (this._converter) {
                    var d = g.graphics,
                      n,
                      h,
                      l = d ? d.length : 0;
                    for (n = 0; n < l; n++)
                      (h = d[n].geometry) &&
                        d[n].setGeometry(this._converter(h));
                  }
                  b.addLayer(g);
                },
                this
              );
            this.setVisibility(this.visible);
            this._fireUpdateEnd();
          },
          _removeInternalLayers: function() {
            var b = this._map;
            b && l.forEach(this.getFeatureLayers(), b.removeLayer, b);
          },
          setScaleRange: function(b, d) {
            this.inherited(arguments);
            l.forEach(this.getFeatureLayers(), function(h) {
              h.setScaleRange(b, d);
            });
            this._options.minScale = this.minScale;
            this._options.maxScale = this.maxScale;
          },
          setOpacity: function(b) {
            this.opacity != b &&
              (l.forEach(this.getFeatureLayers(), function(d) {
                d.setOpacity(b);
              }),
              (this.opacity = this._options.opacity = b),
              this.onOpacityChange(b));
          },
          onVisibilityChange: function(b) {
            this._fireUpdateStart();
            l.forEach(this.getFeatureLayers(), function(d) {
              d.setVisibility(b);
            });
            this._fireUpdateEnd();
          },
          _setMap: function(b, h) {
            this.inherited(arguments);
            this._map = b;
            var l = (this._div = d.create("div", null, h));
            u.set(l, "position", "absolute");
            this._addInternalLayers();
            this.evaluateSuspension();
            return l;
          },
          _unsetMap: function(b, l) {
            this._io && this._io.cancel();
            h.disconnect(this._extChgHandle);
            delete this._extChgHandle;
            this._removeInternalLayers();
            var p = this._div;
            p && (l.removeChild(p), d.destroy(p));
            this._div = null;
            this.inherited(arguments);
          }
        });
        b("extend-esri") &&
          q.setObject("layers._ServiceGeneratedFeatureCollection", p, r);
        return p;
      });
    },
    "esri/layers/WMTSLayer": function() {
      define("dojo/_base/kernel dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/sniff dojox/xml/parser ../kernel ../lang ../request ../urlUtils ../WKIDUnitConversion ../SpatialReference ../geometry/Point ../geometry/Extent ../geometry/webMercatorUtils ./TiledMapServiceLayer ./TileInfo ./WMTSLayerInfo dojo/query".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z, E, y, H, B, F, C, G, v) {
        h = h([C], {
          declaredClass: "esri.layers.WMTSLayer",
          copyright: null,
          extent: null,
          tileUrl: null,
          spatialReference: null,
          tileInfo: null,
          constructor: function(b, d) {
            this.version = "1.0.0";
            this.tileUr = this._url = b;
            this.serviceMode = "RESTful";
            this._parseCapabilities = q.hitch(this, this._parseCapabilities);
            this._getCapabilitiesError = q.hitch(
              this,
              this._getCapabilitiesError
            );
            this._formatDictionary = {
              "image/png": ".png",
              "image/png8": ".png",
              "image/png24": ".png",
              "image/png32": ".png",
              "image/jpg": ".jpg",
              "image/jpeg": ".jpeg",
              "image/gif": ".gif",
              "image/bmp": ".bmp",
              "image/tiff": ".tif",
              "image/jpgpng": "",
              "image/jpegpng": "",
              "image/unknown": ""
            };
            d || (d = {});
            if (d.serviceMode)
              if ("KVP" === d.serviceMode || "RESTful" === d.serviceMode)
                this.serviceMode = d.serviceMode;
              else {
                console.error("WMTS mode could only be 'KVP' or 'RESTful'");
                return;
              }
            this.customParameters = d.customParameters;
            this.customLayerParameters = d.customLayerParameters;
            this.layerInfo = new v();
            d.layerInfo &&
              ((this.layerInfo = d.layerInfo),
              (this._identifier = d.layerInfo.identifier),
              (this._tileMatrixSetId = d.layerInfo.tileMatrixSet),
              d.layerInfo.format &&
                (this.format = "image/" + d.layerInfo.format),
              (this._style = d.layerInfo.style),
              (this.title = d.layerInfo.title),
              (this._dimension = d.layerInfo.dimension),
              (this._dimension2 = d.layerInfo.dimension2));
            d.resourceInfo
              ? ((this.version = d.resourceInfo.version),
                d.resourceInfo.getTileUrl &&
                  (this._url = this.tileUrl = d.resourceInfo.getTileUrl),
                (this.copyright = d.resourceInfo.copyright),
                (this.layerInfos = d.resourceInfo.layerInfos),
                (this.customParameters =
                  d.resourceInfo.customParameters || this.customParameters),
                (this.customLayerParameters =
                  d.resourceInfo.customLayerParameters ||
                  this.customLayerParameters),
                this._parseResourceInfo(),
                (this.loaded = !0),
                this.onLoad(this))
              : this._getCapabilities();
          },
          setActiveLayer: function(b) {
            this.setVisibleLayer(b);
          },
          setVisibleLayer: function(b) {
            this._setActiveLayer(b);
            this.refresh(!0);
          },
          setCustomParameters: function(b, d) {
            this.customParameters = b;
            this.customLayerParameters = d;
            this.refresh(!0);
          },
          getTileUrl: function(b, d, h) {
            b = this._levelToLevelValue[b];
            b =
              this.resourceUrls && 0 < this.resourceUrls.length
                ? this.resourceUrls[d % this.resourceUrls.length].template
                    .replace(/\{Style\}/gi, this._style)
                    .replace(/\{TileMatrixSet\}/gi, this._tileMatrixSetId)
                    .replace(/\{TileMatrix\}/gi, b)
                    .replace(/\{TileRow\}/gi, d)
                    .replace(/\{TileCol\}/gi, h)
                    .replace(/\{dimensionValue\}/gi, this._dimension)
                    .replace(/\{dimensionValue2\}/gi, this._dimension2)
                : this.UrlTemplate.replace(/\{level\}/gi, b)
                    .replace(/\{row\}/gi, d)
                    .replace(/\{col\}/gi, h);
            b = this._appendCustomLayerParameters(b);
            b = this.addTimestampToURL(b);
            return z.addProxy(b);
          },
          getTileUrlTemplate: function(b) {
            var d = b.identifier,
              g = b.tileMatrixSet,
              h = b.format,
              x = b.style,
              p = b.dimension,
              e = b.dimension2;
            d
              ? (b = l.filter(this.layers, function(a) {
                  return a.identifier === d;
                })[0])
              : ((b = this.layers[0]), (d = this.layers[0].identifier));
            if (b) {
              if (!h) h = b.formats[0];
              else if (
                !(-1 === h.indexOf("image/") && -1 < l.indexOf(b.formats, h)) &&
                (-1 === h.indexOf("image/") && (h = "image/" + h),
                -1 === l.indexOf(b.formats, h))
              ) {
                console.error("The layer doesn't support the format of " + h);
                this.onError(
                  Error("The layer doesn't support the format of " + h)
                );
                return;
              }
              if (!x) x = b.styles[0];
              else if (-1 === l.indexOf(b.styles, x)) {
                console.error("The layer doesn't support the style of " + x);
                this.onError(
                  Error("The layer doesn't support the style of " + x)
                );
                return;
              }
              if (!p && b.dimensions) p = b.dimensions[0];
              else if (-1 === l.indexOf(b.dimensions, p)) {
                console.error(
                  "The layer doesn't support the dimension of " + p
                );
                this.onError(
                  Error("The layer doesn't support the dimension of " + p)
                );
                return;
              }
              if (!e && b.dimensions2) e = b.dimensions2[0];
              else if (-1 === l.indexOf(b.dimensions2, e)) {
                console.error(
                  "The layer doesn't support the dimension of " + e
                );
                this.onError(
                  Error("The layer doesn't support the dimension of " + e)
                );
                return;
              }
              var a;
              if (g) {
                if (
                  ((a = l.filter(b.tileMatrixSetInfos, function(a) {
                    return a.tileMatrixSet === g;
                  })[0]),
                  !a)
                ) {
                  console.error(
                    "The tileMatrixSetId " +
                      g +
                      " is not supported by the layer of " +
                      d
                  );
                  this.onError(
                    Error(
                      "The tileMatrixSetId " +
                        g +
                        " is not supported by the layer of " +
                        d
                    )
                  );
                  return;
                }
              } else
                (a = l.filter(b.tileMatrixSetInfos, function(a) {
                  return "GoogleMapsCompatible" === a.tileMatrixSet;
                })[0]) || (a = b.tileMatrixSetInfos[0]),
                  (g = a.tileMatrixSet);
              return this._getTileUrlTemplate(d, g, h, x, p, e);
            }
            console.error("couldn't find the layer " + d);
            this.onError(Error("couldn't find the layer " + d));
          },
          _getTileUrlTemplate: function(b, d, h, l, x, p) {
            var e;
            b || (b = this._identifier);
            d || (d = this._tileMatrixSetId);
            h || (h = this.format);
            l || "" === l || (l = this._style);
            if (this.resourceUrls && 0 < this.resourceUrls.length)
              return (
                (e = this.resourceUrls[0].template),
                e.indexOf(".xxx") === e.length - 4 &&
                  (e = e.slice(0, e.length - 4)),
                (e = e.replace(/\{Style\}/gi, l)),
                (e = e.replace(/\{TileMatrixSet\}/gi, d)),
                (e = e.replace(/\{TileMatrix\}/gi, "{level}")),
                (e = e.replace(/\{TileRow\}/gi, "{row}")),
                (e = e.replace(/\{TileCol\}/gi, "{col}")),
                (e = e.replace(/\{dimensionValue\}/gi, x)),
                (e = e.replace(/\{dimensionValue2\}/gi, p))
              );
            "KVP" === this.serviceMode
              ? (e =
                  this._url +
                  "SERVICE\x3dWMTS\x26VERSION\x3d" +
                  this.version +
                  "\x26REQUEST\x3dGetTile\x26LAYER\x3d" +
                  b +
                  "\x26STYLE\x3d" +
                  l +
                  "\x26FORMAT\x3d" +
                  h +
                  "\x26TILEMATRIXSET\x3d" +
                  d +
                  "\x26TILEMATRIX\x3d{level}\x26TILEROW\x3d{row}\x26TILECOL\x3d{col}")
              : "RESTful" === this.serviceMode &&
                ((x = ""),
                this._formatDictionary[h.toLowerCase()] &&
                  (x = this._formatDictionary[h.toLowerCase()]),
                (e =
                  this._url +
                  b +
                  "/" +
                  l +
                  "/" +
                  d +
                  "/{level}/{row}/{col}" +
                  x));
            return e;
          },
          _parseResourceInfo: function() {
            var b = this.layerInfos,
              d,
              h;
            "KVP" === this.serviceMode &&
              (this._url += -1 < this._url.indexOf("?") ? "" : "?");
            for (h = 0; h < b.length; h++)
              if (
                !(
                  (this._identifier && b[h].identifier !== this._identifier) ||
                  (this.title && b[h].title !== this.title) ||
                  (this._tileMatrixSetId &&
                    b[h].tileMatrixSet !== this._tileMatrixSetId) ||
                  (this.format && "image/" + b[h].format !== this.format) ||
                  (this._style && b[h].style !== this._style)
                )
              ) {
                q.mixin(this, {
                  description: b[h].description,
                  tileInfo: b[h].tileInfo,
                  spatialReference: b[h].tileInfo.spatialReference,
                  fullExtent: b[h].fullExtent,
                  initialExtent: b[h].initialExtent,
                  _identifier: b[h].identifier,
                  _tileMatrixSetId: b[h].tileMatrixSet,
                  format: "image/" + b[h].format,
                  _style: b[h].style
                });
                break;
              }
            for (h = 0; h < b.length; h++)
              (d = b[h].tileInfo),
                96 !== d.dpi &&
                  (l.forEach(d.lods, function(b) {
                    b.scale = (96 * b.scale) / d.dpi;
                  }),
                  (d.dpi = 96)),
                l.forEach(
                  d.lods,
                  function(g) {
                    g.resolution = this._getResolution(
                      d.spatialReference.wkid,
                      (90.71428571428571 * g.scale) / 96,
                      b[h].tileMatrixSet
                    );
                  },
                  this
                );
            this._setActiveLayer();
            this.UrlTemplate = this._getTileUrlTemplate();
            this._levelToLevelValue = [];
            l.forEach(
              this.tileInfo.lods,
              function(b) {
                this._levelToLevelValue[b.level] = b.levelValue
                  ? b.levelValue
                  : b.level;
              },
              this
            );
          },
          _getCapabilities: function() {
            var b;
            "KVP" === this.serviceMode
              ? (b =
                  -1 < this._url.indexOf("?")
                    ? this._url +
                      "\x26request\x3dGetCapabilities\x26service\x3dWMTS\x26version\x3d" +
                      this.version
                    : this._url +
                      "?request\x3dGetCapabilities\x26service\x3dWMTS\x26version\x3d" +
                      this.version)
              : "RESTful" === this.serviceMode &&
                (b = this._url + "/" + this.version + "/WMTSCapabilities.xml");
            b = this._appendCustomParameters(b);
            t({
              url: b,
              handleAs: "text",
              load: this._parseCapabilities,
              error: this._getCapabilitiesError
            });
          },
          _parseCapabilities: function(b) {
            b = b.replace(/ows:/gi, "");
            b = u.parse(b);
            var d = p.query("Contents", b)[0];
            if (d) {
              var g = p.query("OperationsMetadata", b)[0],
                h = p.query("[name\x3d'GetTile']", g)[0],
                g = this._url,
                h = p.query("Get", h),
                x,
                q = !1,
                e,
                a;
              for (x = 0; x < h.length; x++) {
                var f = p.query("Constraint", h[x])[0];
                if (
                  !f ||
                  this._getTagWithChildTagValue(
                    "AllowedValues",
                    "Value",
                    this.serviceMode,
                    f
                  )
                ) {
                  g = h[x].attributes[0].nodeValue;
                  q = !0;
                  break;
                } else if (
                  !f ||
                  this._getTagWithChildTagValue(
                    "AllowedValues",
                    "Value",
                    "RESTful",
                    f
                  )
                )
                  e = h[x].attributes[0].nodeValue;
                else if (
                  !f ||
                  this._getTagWithChildTagValue(
                    "AllowedValues",
                    "Value",
                    "KVP",
                    f
                  )
                )
                  a = h[x].attributes[0].nodeValue;
              }
              q ||
                ("KVP" === this.serviceMode && e
                  ? ((g = e), (this.serviceMode = "RESTful"))
                  : "RESTful" === this.serviceMode &&
                    a &&
                    ((g = a), (this.serviceMode = "KVP")));
              -1 === g.indexOf("/1.0.0/") &&
                "RESTful" === this.serviceMode &&
                (g += "/");
              "KVP" === this.serviceMode &&
                (g += -1 < g.indexOf("?") ? "" : "?");
              this._url = g;
              this.copyright = this._getTagValues(
                "Capabilities\x3eServiceIdentification\x3eAccessConstraints",
                b
              )[0];
              e = p.query("Layer", d);
              var m,
                c = [];
              this.layers = [];
              l.forEach(
                e,
                function(a) {
                  m = this._getTagValues("Identifier", a)[0];
                  c.push(m);
                  this.layers.push(this._getWMTSLayerInfo(m, a, d));
                },
                this
              );
              this._setActiveLayer();
              this.loaded = !0;
              this.onLoad(this);
            } else
              console.error("The WMTS capabilities XML is not valid"),
                this.onError(Error("The WMTS capabilities XML is not valid"));
          },
          _setActiveLayer: function(b) {
            b || (b = {});
            b.identifier && (this._identifier = b.identifier);
            b.tileMatrixSet && (this._tileMatrixSetId = b.tileMatrixSet);
            b.format && (this.format = b.format);
            b.style && (this._style = b.style);
            b.dimension && (this._dimension = b.dimension);
            b.dimension2 && (this._dimension2 = b.dimension2);
            if (this.layers)
              if (
                (this._identifier
                  ? (b = l.filter(
                      this.layers,
                      function(b) {
                        return b.identifier === this._identifier;
                      },
                      this
                    )[0])
                  : ((b = this.layers[0]),
                    (this._identifier = this.layers[0].identifier)),
                b)
              ) {
                if (this.format) {
                  if (
                    (-1 === this.format.indexOf("image/") &&
                      (this.format = "image/" + this.format),
                    -1 === l.indexOf(b.formats, this.format))
                  ) {
                    console.error(
                      "The layer doesn't support the format of " + this.format
                    );
                    this.onError(
                      Error(
                        "The layer doesn't support the format of " + this.format
                      )
                    );
                    return;
                  }
                } else
                  (this.format = b.formats[0]),
                    -1 === this.format.indexOf("image/") &&
                      (this.format = "image/" + this.format);
                if (!this._style) this._style = b.styles[0];
                else if (-1 === l.indexOf(b.styles, this._style)) {
                  console.error(
                    "The layer doesn't support the style of " + this._style
                  );
                  this.onError(
                    Error(
                      "The layer doesn't support the style of " + this._style
                    )
                  );
                  return;
                }
                if (!this._dimension && b.dimensions)
                  this._dimension = b.dimensions[0];
                else if (-1 === l.indexOf(b.dimensions, this._dimension)) {
                  console.error(
                    "The layer doesn't support the dimension of " +
                      this._dimension
                  );
                  this.onError(
                    Error(
                      "The layer doesn't support the dimension of " +
                        this._dimension
                    )
                  );
                  return;
                }
                if (!this._dimension2 && b.dimensions2)
                  this._dimension2 = b.dimensions2[0];
                else if (-1 === l.indexOf(b.dimensions2, this._dimension2)) {
                  console.error(
                    "The layer doesn't support the dimension of " +
                      this._dimension2
                  );
                  this.onError(
                    Error(
                      "The layer doesn't support the dimension of " +
                        this._dimension2
                    )
                  );
                  return;
                }
                var d;
                if (this._tileMatrixSetId) {
                  if (
                    ((d = l.filter(
                      b.tileMatrixSetInfos,
                      function(b) {
                        return b.tileMatrixSet === this._tileMatrixSetId;
                      },
                      this
                    )[0]),
                    !d)
                  ) {
                    console.error(
                      "The tileMatrixSetId " +
                        this._tileMatrixSetId +
                        " is not supported by the layer of " +
                        this._identifier
                    );
                    this.onError(
                      Error(
                        "The tileMatrixSetId " +
                          this._tileMatrixSetId +
                          " is not supported by the layer of " +
                          this._identifier
                      )
                    );
                    return;
                  }
                } else
                  (d = l.filter(b.tileMatrixSetInfos, function(b) {
                    return "GoogleMapsCompatible" === b.tileMatrixSet;
                  })[0]) || (d = b.tileMatrixSetInfos[0]),
                    (this._tileMatrixSetId = d.tileMatrixSet);
                this.description = b.description;
                this.title = b.title;
                this.spatialReference = d.tileInfo.spatialReference;
                this.tileInfo = d.tileInfo;
                this._levelToLevelValue = [];
                l.forEach(
                  this.tileInfo.lods,
                  function(b) {
                    this._levelToLevelValue[b.level] = b.levelValue
                      ? b.levelValue
                      : b.level;
                  },
                  this
                );
                102100 === this.spatialReference.wkid ||
                102113 === this.spatialReference.wkid
                  ? (this.fullExtent = this.initialExtent = F.geographicToWebMercator(
                      b.gcsExtent
                    ))
                  : 4326 === this.spatialReference.wkid
                  ? (this.fullExtent = this.initialExtent = b.gcsExtent)
                  : ((this.fullExtent = d.fullExtent),
                    (this.initialExtent = d.initialExtent));
                this.resourceUrls = b.resourceUrls;
                this.UrlTemplate = this._getTileUrlTemplate();
                this.layerInfo = {
                  identifier: this._identifier,
                  tileMatrixSet: this._tileMatrixSetId,
                  format: this.format,
                  style: this._style,
                  fullExtent: this.fullExtent,
                  initialExtent: this.initialExtent,
                  tileInfo: this.tileInfo,
                  title: this.title,
                  description: this.description
                };
              } else
                console.error("couldn't find the layer " + this._identifier),
                  this.onError(
                    Error("couldn't find the layer " + this._identifier)
                  );
          },
          _getWMTSLayerInfo: function(b, d, h) {
            var g = this._getTagValues("Abstract", d)[0],
              n = this._getTagValues("Title", d)[0],
              q = p.query("WGS84BoundingBox", d)[0],
              e = q
                ? this._getTagValues("LowerCorner", q)[0].split(" ")
                : ["-180", "-90"],
              a = q
                ? this._getTagValues("UpperCorner", q)[0].split(" ")
                : ["180", "90"],
              q = parseFloat(e[0]),
              e = parseFloat(e[1]),
              f = parseFloat(a[0]),
              a = parseFloat(a[1]),
              q = new B(q, e, f, a, new y({ wkid: 4326 })),
              a = this._getTagValues("Identifier", p.query("Style", d)[0]),
              m = this._getTagValues("Identifier", p.query("Dimension", d)[0]),
              c =
                this._getTagValues("Default", p.query("Dimension", d)[0]) ||
                this._getTagValues("Value", p.query("Dimension", d)[0]),
              k =
                1 < p.query("Dimension", d).length
                  ? this._getTagValues("Identifier", p.query("Dimension", d)[1])
                  : [],
              r =
                1 < p.query("Dimension", d).length
                  ? this._getTagValues("Default", p.query("Dimension", d)[1]) ||
                    this._getTagValues("Value", p.query("Dimension", d)[1])
                  : [],
              e = this._getTagValues("Format", d);
            h = this._getLayerMatrixInfos(d, h);
            b = {
              identifier: b,
              tileMatrixSetInfos: h,
              formats: e,
              styles: a,
              title: n,
              description: g,
              gcsExtent: q,
              dimensions: c,
              dimensions2: r
            };
            d = p.query("ResourceURL", d);
            var t = [],
              A;
            l.forEach(d, function(a) {
              A = a.getAttribute("template");
              if (m && c && m[0] && c[0])
                if (-1 < A.indexOf("{" + m + "}"))
                  A = A.replace("{" + m + "}", "{dimensionValue}");
                else {
                  var b = A.toLowerCase().indexOf(
                    "{" + m[0].toLowerCase() + "}"
                  );
                  -1 < b &&
                    (A =
                      A.substring(0, b) +
                      "{dimensionValue}" +
                      A.substring(b + m[0].length + 2));
                }
              k &&
                r &&
                k[0] &&
                r[0] &&
                (-1 < A.indexOf("{" + k + "}")
                  ? (A = A.replace("{" + k + "}", "{dimensionValue2}"))
                  : ((b = A.toLowerCase().indexOf(
                      "{" + k[0].toLowerCase() + "}"
                    )),
                    -1 < b &&
                      (A =
                        A.substring(0, b) +
                        "{dimensionValue2}" +
                        A.substring(b + k[0].length + 2))));
              t.push({
                template: A,
                format: a.getAttribute("format"),
                resourceType: a.getAttribute("resourceType")
              });
            });
            t && 0 < t.length && (b.resourceUrls = t);
            return b;
          },
          _getLayerMatrixInfos: function(b, d) {
            var g,
              h = [];
            this._allMatrixInfos || (this._allMatrixInfos = []);
            var n = this._getTagValues("TileMatrixSet", b);
            if (n && 0 !== n.length)
              return (
                l.forEach(
                  n,
                  function(n) {
                    var e;
                    if (0 < this._allMatrixInfos.length)
                      for (g = 0; g < this._allMatrixInfos.length; g++)
                        if (this._allMatrixInfos[g].tileMatrixSet == n) {
                          e = this._allMatrixInfos[g];
                          break;
                        }
                    e ||
                      ((e = this._getLayerMatrixInfo(n, b, d)),
                      this._allMatrixInfos.push(e));
                    h.push(e);
                  },
                  this
                ),
                h
              );
          },
          _getLayerMatrixInfo: function(b, d, h) {
            var g,
              n,
              l,
              e,
              a = [];
            d = this._getTagWithChildTagValue(
              "TileMatrixSetLink",
              "TileMatrixSet",
              b,
              d
            );
            var f = this._getTagValues("TileMatrix", d),
              m = this._getTagWithChildTagValue(
                "TileMatrixSet",
                "Identifier",
                b,
                h
              ),
              c = this._getTagValues("SupportedCRS", m)[0];
            g = parseInt(c.split(":").pop(), 10);
            if (900913 == g || 3857 == g) g = 102100;
            if (
              -1 < c.toLowerCase().indexOf("crs84") ||
              -1 < c.toLowerCase().indexOf("crs:84")
            )
              (g = 4326), (e = !0);
            else if (
              -1 < c.toLowerCase().indexOf("crs83") ||
              -1 < c.toLowerCase().indexOf("crs:83")
            )
              (g = 4269), (e = !0);
            else if (
              -1 < c.toLowerCase().indexOf("crs27") ||
              -1 < c.toLowerCase().indexOf("crs:27")
            )
              (g = 4267), (e = !0);
            var k = new y({ wkid: g }),
              q = p.query("TileMatrix", m)[0];
            h = parseInt(this._getTagValues("TileWidth", q)[0], 10);
            d = parseInt(this._getTagValues("TileHeight", q)[0], 10);
            n = this._getTagValues("TopLeftCorner", q)[0].split(" ");
            var r = n[0],
              t = n[1];
            1 < r.split("E").length &&
              ((n = r.split("E")), (r = n[0] * Math.pow(10, n[1])));
            1 < t.split("E").length &&
              ((n = t.split("E")), (t = n[0] * Math.pow(10, n[1])));
            var r = parseFloat(r),
              t = parseFloat(t),
              A = e && 4326 === g && 90 === r && -180 === t;
            for (n = 0; n < this._flippingAxisForWkids.length; n++)
              if (
                (c.split(":").pop() >= this._flippingAxisForWkids[n][0] &&
                  c.split(":").pop() <= this._flippingAxisForWkids[n][1]) ||
                (4326 === g && (!e || A))
              ) {
                4326 === g && 90 < r && (r = "90");
                l = new H(t, r, k);
                break;
              }
            n === this._flippingAxisForWkids.length && (l = new H(r, t, k));
            if (0 === f.length)
              for (f = p.query("TileMatrix", m), n = 0; n < f.length; n++)
                (e = this._getLodFromTileMatrix(f[n], g, n, b)), a.push(e);
            else
              for (n = 0; n < f.length; n++)
                (e = this._getTagWithChildTagValue(
                  "TileMatrix",
                  "Identifier",
                  f[n],
                  m
                )),
                  (e = this._getLodFromTileMatrix(e, g, n, b)),
                  a.push(e);
            g = p.query("BoundingBox", m)[0];
            var u, v;
            g &&
              ((u = this._getTagValues("LowerCorner", g)[0].split(" ")),
              (v = this._getTagValues("UpperCorner", g)[0].split(" ")));
            u && 1 < u.length && v && 1 < v.length
              ? ((q = parseFloat(u[0])),
                (g = parseFloat(u[1])),
                (u = parseFloat(v[0])),
                (v = parseFloat(v[1])))
              : ((u = this._getTagValues("MatrixWidth", q)[0]),
                (g = this._getTagValues("MatrixHeight", q)[0]),
                (q = l.x),
                (v = l.y),
                (u = q + u * d * a[0].resolution),
                (g = v - g * h * a[0].resolution));
            v = u = new B(q, g, u, v, k);
            l = new G({
              dpi: 96,
              spatialReference: k,
              format: this.format,
              rows: h,
              cols: d,
              origin: l,
              lods: a
            });
            return {
              tileMatrixSet: b,
              fullExtent: v,
              initialExtent: u,
              tileInfo: l
            };
          },
          _getCapabilitiesError: function(b) {
            console.error("Failed to get capabilities xml");
            this.onError(b);
          },
          _getLodFromTileMatrix: function(b, d, h, l) {
            var g = this._getTagValues("Identifier", b)[0];
            b = this._getTagValues("ScaleDenominator", b)[0];
            1 < b.split("E").length
              ? ((b = b.split("E")), (b = b[0] * Math.pow(10, b[1])))
              : (b = parseFloat(b));
            d = this._getResolution(d, b, l);
            return {
              level: h,
              levelValue: g,
              scale: 1.058267716535433 * b,
              resolution: d
            };
          },
          _getResolution: function(b, d, h) {
            b = r.isDefined(E[b])
              ? E.values[E[b]]
              : "default028mm" === h
              ? (6370997 * Math.PI) / 180
              : (6378137 * Math.PI) / 180;
            return (7 * d) / 25e3 / b;
          },
          _getTag: function(b, d) {
            return (b = p.query(b, d)) && 0 < b.length ? b[0] : null;
          },
          _getTagValues: function(b, h) {
            var g = [];
            b = b.split("\x3e");
            var n;
            n = p.query(b[0], h)[0];
            if (1 < b.length) {
              for (h = 1; h < b.length - 1; h++) n = p.query(b[h], n)[0];
              h = p.query(b[b.length - 1], n);
            } else h = p.query(b[0], h);
            h &&
              0 < h.length &&
              l.forEach(h, function(b) {
                9 > d("ie")
                  ? g.push(b.childNodes.length ? b.childNodes[0].nodeValue : "")
                  : g.push(b.textContent);
              });
            return g;
          },
          _getAttributeValues: function(b, d, h) {
            b = p.query(b, h);
            var g = [];
            b &&
              0 < b.length &&
              l.forEach(b, function(b) {
                g.push(b.getAttribute(d));
              });
            return g;
          },
          _getTagWithChildTagValue: function(b, h, l, q) {
            q = q.childNodes;
            var g, n;
            for (n = 0; n < q.length; n++)
              if (
                -1 < q[n].nodeName.indexOf(b) &&
                (9 > d("ie")
                  ? r.isDefined(p.query(h, q[n])[0]) &&
                    (g = p.query(h, q[n])[0].childNodes[0].nodeValue)
                  : r.isDefined(p.query(h, q[n])[0]) &&
                    (g = p.query(h, q[n])[0].textContent),
                g === l || (l.split(":") && g === l.split(":")[1]))
              )
                return q[n];
          },
          _appendCustomParameters: function(b) {
            var d;
            if (this.customParameters)
              for (d in this.customParameters)
                b +=
                  (-1 === b.indexOf("?") ? "?" : "\x26") +
                  d +
                  "\x3d" +
                  encodeURIComponent(this.customParameters[d]);
            return b;
          },
          _appendCustomLayerParameters: function(b) {
            var d, g;
            if (this.customLayerParameters || this.customParameters)
              for (d in ((g = q.clone(this.customParameters || {})),
              q.mixin(g, this.customLayerParameters || {}),
              g))
                b +=
                  (-1 === b.indexOf("?") ? "?" : "\x26") +
                  d +
                  "\x3d" +
                  encodeURIComponent(g[d]);
            return b;
          },
          _flippingAxisForWkids: [
            [3819, 3819],
            [3821, 3824],
            [3889, 3889],
            [3906, 3906],
            [4001, 4025],
            [4027, 4036],
            [4039, 4047],
            [4052, 4055],
            [4074, 4075],
            [4080, 4081],
            [4120, 4176],
            [4178, 4185],
            [4188, 4216],
            [4218, 4289],
            [4291, 4304],
            [4306, 4319],
            [4322, 4326],
            [4463, 4463],
            [4470, 4470],
            [4475, 4475],
            [4483, 4483],
            [4490, 4490],
            [4555, 4558],
            [4600, 4646],
            [4657, 4765],
            [4801, 4811],
            [4813, 4821],
            [4823, 4824],
            [4901, 4904],
            [5013, 5013],
            [5132, 5132],
            [5228, 5229],
            [5233, 5233],
            [5246, 5246],
            [5252, 5252],
            [5264, 5264],
            [5324, 5340],
            [5354, 5354],
            [5360, 5360],
            [5365, 5365],
            [5370, 5373],
            [5381, 5381],
            [5393, 5393],
            [5451, 5451],
            [5464, 5464],
            [5467, 5467],
            [5489, 5489],
            [5524, 5524],
            [5527, 5527],
            [5546, 5546],
            [2044, 2045],
            [2081, 2083],
            [2085, 2086],
            [2093, 2093],
            [2096, 2098],
            [2105, 2132],
            [2169, 2170],
            [2176, 2180],
            [2193, 2193],
            [2200, 2200],
            [2206, 2212],
            [2319, 2319],
            [2320, 2462],
            [2523, 2549],
            [2551, 2735],
            [2738, 2758],
            [2935, 2941],
            [2953, 2953],
            [3006, 3030],
            [3034, 3035],
            [3038, 3051],
            [3058, 3059],
            [3068, 3068],
            [3114, 3118],
            [3126, 3138],
            [3150, 3151],
            [3300, 3301],
            [3328, 3335],
            [3346, 3346],
            [3350, 3352],
            [3366, 3366],
            [3389, 3390],
            [3416, 3417],
            [3833, 3841],
            [3844, 3850],
            [3854, 3854],
            [3873, 3885],
            [3907, 3910],
            [4026, 4026],
            [4037, 4038],
            [4417, 4417],
            [4434, 4434],
            [4491, 4554],
            [4839, 4839],
            [5048, 5048],
            [5105, 5130],
            [5253, 5259],
            [5269, 5275],
            [5343, 5349],
            [5479, 5482],
            [5518, 5519],
            [5520, 5520],
            [20004, 20032],
            [20064, 20092],
            [21413, 21423],
            [21473, 21483],
            [21896, 21899],
            [22171, 22177],
            [22181, 22187],
            [22191, 22197],
            [25884, 25884],
            [27205, 27232],
            [27391, 27398],
            [27492, 27492],
            [28402, 28432],
            [28462, 28492],
            [30161, 30179],
            [30800, 30800],
            [31251, 31259],
            [31275, 31279],
            [31281, 31290],
            [31466, 31700]
          ]
        });
        d("extend-esri") && q.setObject("layers.WMTSLayer", h, b);
        return h;
      });
    },
    "dojox/xml/parser": function() {
      define([
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/window",
        "dojo/_base/sniff"
      ], function(p) {
        p.getObject("xml.parser", !0, dojox);
        dojox.xml.parser.parse = function(h, q) {
          var l = p.doc,
            d;
          q = q || "text/xml";
          if (h && p.trim(h) && "DOMParser" in p.global) {
            d = new DOMParser().parseFromString(h, q);
            h = d.documentElement;
            if (
              "parsererror" == h.nodeName &&
              "http://www.mozilla.org/newlayout/xml/parsererror.xml" ==
                h.namespaceURI
            ) {
              if (
                (l = h.getElementsByTagNameNS(
                  "http://www.mozilla.org/newlayout/xml/parsererror.xml",
                  "sourcetext"
                )[0])
              )
                l = l.firstChild.data;
              throw Error(
                "Error parsing text " + h.firstChild.data + " \n" + l
              );
            }
            return d;
          }
          if ("ActiveXObject" in p.global) {
            l = function(b) {
              return "MSXML" + b + ".DOMDocument";
            };
            l = ["Microsoft.XMLDOM", l(6), l(4), l(3), l(2)];
            p.some(l, function(b) {
              try {
                d = new ActiveXObject(b);
              } catch (r) {
                return !1;
              }
              return !0;
            });
            if (
              h &&
              d &&
              ((d.async = !1),
              d.loadXML(h),
              (h = d.parseError),
              0 !== h.errorCode)
            )
              throw Error(
                "Line: " +
                  h.line +
                  "\nCol: " +
                  h.linepos +
                  "\nReason: " +
                  h.reason +
                  "\nError Code: " +
                  h.errorCode +
                  "\nSource: " +
                  h.srcText
              );
            if (d) return d;
          } else if (l.implementation && l.implementation.createDocument) {
            if (h && p.trim(h) && l.createElement) {
              q = l.createElement("xml");
              q.innerHTML = h;
              var u = l.implementation.createDocument("foo", "", null);
              p.forEach(q.childNodes, function(b) {
                u.importNode(b, !0);
              });
              return u;
            }
            return l.implementation.createDocument("", "", null);
          }
          return null;
        };
        dojox.xml.parser.textContent = function(h, q) {
          if (1 < arguments.length)
            return (
              dojox.xml.parser.replaceChildren(
                h,
                (h.ownerDocument || p.doc).createTextNode(q)
              ),
              q
            );
          if (void 0 !== h.textContent) return h.textContent;
          var l = "";
          h &&
            p.forEach(h.childNodes, function(d) {
              switch (d.nodeType) {
                case 1:
                case 5:
                  l += dojox.xml.parser.textContent(d);
                  break;
                case 3:
                case 2:
                case 4:
                  l += d.nodeValue;
              }
            });
          return l;
        };
        dojox.xml.parser.replaceChildren = function(h, q) {
          var l = [];
          p.isIE &&
            p.forEach(h.childNodes, function(d) {
              l.push(d);
            });
          dojox.xml.parser.removeChildren(h);
          p.forEach(l, p.destroy);
          p.isArray(q)
            ? p.forEach(q, function(d) {
                h.appendChild(d);
              })
            : h.appendChild(q);
        };
        dojox.xml.parser.removeChildren = function(h) {
          for (var p = h.childNodes.length; h.hasChildNodes(); )
            h.removeChild(h.firstChild);
          return p;
        };
        dojox.xml.parser.innerXML = function(h) {
          return h.innerXML
            ? h.innerXML
            : h.xml
            ? h.xml
            : "undefined" != typeof XMLSerializer
            ? new XMLSerializer().serializeToString(h)
            : null;
        };
        return dojox.xml.parser;
      });
    },
    "esri/layers/WMTSLayerInfo": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../kernel"
      ], function(p, h, q, l) {
        p = p(null, {
          declaredClass: "esri.layers.WMTSLayerInfo",
          identifier: null,
          tileMatrixSet: null,
          format: null,
          style: null,
          tileInfo: null,
          title: null,
          fullExtent: null,
          initialExtent: null,
          description: null,
          dimension: null,
          constructor: function(d) {
            d &&
              ((this.title = d.title),
              (this.tileMatrixSet = d.tileMatrixSet),
              (this.format = d.format),
              (this.style = d.style),
              (this.tileInfo = d.tileInfo),
              (this.fullExtent = d.fullExtent),
              (this.initialExtent = d.initialExtent),
              (this.identifier = d.identifier),
              (this.description = d.description),
              (this.dimension = d.dimension));
          }
        });
        q("extend-esri") && h.setObject("layers.WMTSLayerInfo", p, l);
        return p;
      });
    },
    "widgets/AddData/search/AddFromFilePane": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/on dojo/Deferred dojo/dom-class dijit/Viewport dojo/sniff dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/AddFromFilePane.html dojo/i18n!../nls/strings ./LayerLoader ./util dojo/_base/kernel esri/request esri/layers/FeatureLayer esri/layers/KMLLayer esri/geometry/scaleUtils jimu/dijit/Message jimu/dijit/CheckBox".split(
        " "
      ), function(
        p,
        h,
        q,
        l,
        d,
        u,
        b,
        r,
        t,
        z,
        E,
        y,
        H,
        B,
        F,
        C,
        G,
        v,
        g,
        n,
        A,
        D
      ) {
        return p([z, E, y], {
          i18n: B,
          templateString: H,
          wabWidget: null,
          maxRecordCount: 1e3,
          maxRecordThreshold: 1e5,
          SHAPETYPE_ICONS: [
            { type: "shapefile", url: "images/filetypes/zip.svg" },
            { type: "csv", url: "images/filetypes/csv.svg" },
            { type: "kml", url: "images/filetypes/kml.svg" },
            { type: "gpx", url: "images/filetypes/gpx.svg" },
            { type: "geojson", url: "images/filetypes/geojson.svg" }
          ],
          postCreate: function() {
            this.inherited(arguments);
            this.generalizeCheckBox.setLabel(B.addFromFile.generalizeOn);
            this.own(r.on("resize", this.resize()));
          },
          destroy: function() {
            this.inherited(arguments);
          },
          startup: function() {
            if (!this._started) {
              this.wabWidget.isPortal &&
                (this.SHAPETYPE_ICONS = [
                  { type: "shapefile", url: "images/filetypes/zip.svg" },
                  { type: "csv", url: "images/filetypes/csv.svg" },
                  { type: "kml", url: "images/filetypes/kml.svg" }
                ]);
              this.inherited(arguments);
              var g = this,
                n = this.dropArea,
                e,
                a = this.wabWidget.config;
              if (a.addFromFile)
                try {
                  (e = Number(a.addFromFile.maxRecordCount)),
                    "number" !== typeof e ||
                      isNaN(e) ||
                      ((e = Math.floor(e)),
                      1 <= e &&
                        e <= this.maxRecordThreshold &&
                        (this.maxRecordCount = e));
                } catch (m) {
                  console.warn("Error setting AddFromFile.maxRecordCount:"),
                    console.warn(m);
                }
              if (B.addFromFile.types)
                try {
                  for (var f in B.addFromFile.types)
                    this._createFileTypeImage(f);
                } catch (m) {
                  console.warn("Error reading support file types:"),
                    console.warn(m);
                }
              this.own(
                d(this.fileNode, "change", function() {
                  if (!g._getBusy()) {
                    g._setBusy(!0);
                    var a = g._getFileInfo();
                    a.ok && g._execute(a);
                  }
                })
              );
              this.own(
                d(this.uploadLabel, "click", function(a) {
                  g._getBusy() && (a.preventDefault(), a.stopPropagation());
                })
              );
              this.own(
                d(n, "dragenter", function(a) {
                  a.preventDefault();
                  g._getBusy() || (b.add(n, "hit"), g._setStatus(""));
                })
              );
              this.own(
                d(n, "dragleave", function(a) {
                  a.preventDefault();
                  b.remove(n, "hit");
                })
              );
              this.own(
                d(n, "dragover", function(a) {
                  a.preventDefault();
                })
              );
              this.own(
                d(n, "drop", function(a) {
                  a.preventDefault();
                  a.stopPropagation();
                  g._getBusy() ||
                    (g._setBusy(!0),
                    (a = g._getFileInfo(a)),
                    a.ok && g._execute(a));
                })
              );
              e = this.wabWidget.domNode;
              this.own(
                d(e, "dragenter", function(a) {
                  a.preventDefault();
                })
              );
              this.own(
                d(e, "dragleave", function(a) {
                  a.preventDefault();
                })
              );
              this.own(
                d(e, "dragover", function(a) {
                  a.preventDefault();
                })
              );
              this.own(
                d(e, "drop", function(a) {
                  a.preventDefault();
                })
              );
              this.own(
                d(
                  this.hintButton,
                  "click",
                  h.hitch(this, function(a) {
                    a.preventDefault();
                    a =
                      '\x3cdiv class\x3d"intro"\x3e\x3clabel\x3e' +
                      B.addFromFile.intro +
                      "\x3c/label\x3e\x3cul\x3e\x3cli\x3e" +
                      B.addFromFile.types.Shapefile +
                      "\x3c/li\x3e\x3cli\x3e" +
                      B.addFromFile.types.CSV +
                      "\x3c/li\x3e\x3cli\x3e" +
                      B.addFromFile.types.KML +
                      "\x3c/li\x3e\x3cli\x3e" +
                      B.addFromFile.types.GPX +
                      "\x3c/li\x3e\x3cli\x3e" +
                      B.addFromFile.types.GeoJSON +
                      '\x3c/li\x3e\x3cli\x3e\x3cspan class\x3d"note"\x3e' +
                      B.addFromFile.maxFeaturesAllowedPattern.replace(
                        "{count}",
                        this.maxRecordCount
                      ) +
                      "\x3c/span\x3e\x3c/li\x3e\x3c/ul\x3e\x3c/div\x3e";
                    this.wabWidget.isPortal &&
                      (a =
                        '\x3cdiv class\x3d"intro"\x3e\x3clabel\x3e' +
                        B.addFromFile.intro +
                        "\x3c/label\x3e\x3cul\x3e\x3cli\x3e" +
                        B.addFromFile.types.Shapefile +
                        "\x3c/li\x3e\x3cli\x3e" +
                        B.addFromFile.types.CSV +
                        "\x3c/li\x3e\x3cli\x3e" +
                        B.addFromFile.types.KML +
                        '\x3c/li\x3e\x3cli\x3e\x3cspan class\x3d"note"\x3e' +
                        B.addFromFile.maxFeaturesAllowedPattern.replace(
                          "{count}",
                          this.maxRecordCount
                        ) +
                        "\x3c/span\x3e\x3c/li\x3e\x3c/ul\x3e\x3c/div\x3e");
                    new D({ message: a });
                  })
                )
              );
            }
          },
          _addFeatures: function(b, d) {
            var e,
              a = [],
              f = b.map,
              h = 0,
              c = new F();
            d.layers && (h = d.layers.length);
            q.forEach(d.layers, function(d) {
              d = new g(d, { id: c._generateLayerId(), outFields: ["*"] });
              d.xtnAddData = !0;
              d.graphics && (b.numFeatures += d.graphics.length);
              0 === h
                ? (d.name = b.baseFileName)
                : "string" !== typeof d.name || 0 === d.name.length
                ? (d.name = b.baseFileName)
                : 0 !== d.name.indexOf(b.baseFileName) &&
                  (d.name = B.addFromFile.layerNamePattern
                    .replace("{filename}", b.baseFileName)
                    .replace("{name}", d.name));
              c._setFeatureLayerInfoTemplate(d, null, null);
              d.fullExtent && (e = e ? e.union(d.fullExtent) : d.fullExtent);
              a.push(d);
            });
            0 < a.length &&
              (f.addLayers(a), e && f.setExtent(e.expand(1.25), !0));
          },
          _analyze: function(b, d) {
            if ("csv" !== b.fileType.toLowerCase())
              return (d = new u()), d.resolve(null), d;
            var e = null;
            this.wabWidget.batchGeocoderServers &&
              0 < this.wabWidget.batchGeocoderServers.length &&
              (e = this.wabWidget.batchGeocoderServers[0]);
            var a = { enableGlobalGeocoding: !0, sourceLocale: G.locale };
            e &&
              ((a.geocodeServiceUrl = e.url),
              e.isWorldGeocodeServer &&
                ((a.sourceCountry = "world"), (a.sourceCountryHint = "")));
            e = b.sharingUrl + "/content/features/analyze";
            a = {
              f: "json",
              filetype: b.fileType.toLowerCase(),
              analyzeParameters: window.JSON.stringify(a)
            };
            d = v({ url: e, content: a, form: d, handleAs: "json" });
            d.then(function(a) {
              a &&
                a.publishParameters &&
                (b.publishParameters = a.publishParameters);
            });
            return d;
          },
          _createFileTypeImage: function(b) {
            var d = window.isRTL;
            q.some(
              this.SHAPETYPE_ICONS,
              h.hitch(this, function(e, a) {
                if (b.toLowerCase() === e.type.toLowerCase()) {
                  var f = document.createElement("IMG");
                  f.src = this.wabWidget.folderUrl + e.url;
                  f.alt = b;
                  0 === a
                    ? (f.className +=
                        " " + (d ? "last" : "first") + "-type-icon")
                    : 1 === a
                    ? (f.className +=
                        " second-" + (d ? "last" : "first") + "-type-icon")
                    : a === this.SHAPETYPE_ICONS.length - 2
                    ? (f.className +=
                        " second-" + (d ? "first" : "last") + "-type-icon")
                    : a === this.SHAPETYPE_ICONS.length - 1 &&
                      (f.className +=
                        " " + (d ? "first" : "last") + "-type-icon");
                  this.supportedFileTypes.appendChild(f);
                }
              })
            );
          },
          _execute: function(b) {
            var d = {
              map: this.wabWidget.map,
              sharingUrl: this.wabWidget.getSharingUrl(),
              baseFileName: b.baseFileName,
              fileName: b.fileName,
              fileType: b.fileType,
              generalize: !!this.generalizeCheckBox.getValue(),
              publishParameters: {},
              numFeatures: 0
            };
            this._setBusy(!0);
            this._setStatus(
              B.addFromFile.addingPattern.replace("{filename}", b.fileName)
            );
            if ("kml" === b.fileType.toLowerCase()) return this._executeKml(b);
            var e = b.fileName,
              a = this,
              f = new FormData();
            f.append("file", b.file);
            a._analyze(d, f)
              .then(function() {
                return a._generateFeatures(d, f);
              })
              .then(function(b) {
                a._addFeatures(d, b.featureCollection);
                a._setBusy(!1);
                a._setStatus(
                  B.addFromFile.featureCountPattern
                    .replace("{filename}", e)
                    .replace("{count}", d.numFeatures)
                );
              })
              .otherwise(function(b) {
                a._setBusy(!1);
                a._setStatus(
                  B.addFromFile.addFailedPattern.replace("{filename}", e)
                );
                console.warn("Error generating features.");
                console.warn(b);
                b &&
                  "string" === typeof b.message &&
                  0 < b.message.length &&
                  new D({
                    titleLabel: B._widgetLabel,
                    message:
                      B.addFromFile.generalIssue +
                      "\x3cbr\x3e\x3cbr\x3e" +
                      b.message
                  });
              });
          },
          _executeKml: function(b) {
            var d = this,
              e = new FileReader(),
              a = this.wabWidget.map,
              f = function(a, c) {
                d._setBusy(!1);
                d._setStatus(
                  B.addFromFile.addFailedPattern.replace(
                    "{filename}",
                    b.fileName
                  )
                );
                console.warn(a);
                console.error(c);
                c &&
                  "string" === typeof c.message &&
                  0 < c.message.length &&
                  new D({
                    titleLabel: B._widgetLabel,
                    message:
                      B.addFromFile.generalIssue +
                      "\x3cbr\x3e\x3cbr\x3e" +
                      c.message
                  });
              };
            e.onerror = function(a) {
              f("FileReader::onerror", a);
            };
            e.onload = function(g) {
              if (e.error) f("FileReader::error", e.error);
              else {
                var c = g.target.result,
                  k = new F();
                g = k._generateLayerId();
                var m = new n("", {
                  id: g,
                  name: b.fileName,
                  linkInfo: { visibility: !1 }
                });
                m.visible = !0;
                delete m.linkInfo;
                m._parseKml = function() {
                  var e = this;
                  this._fireUpdateStart();
                  this._io = v(
                    {
                      url: this.serviceUrl,
                      content: {
                        kmlString: encodeURIComponent(c),
                        model: "simple",
                        folders: "",
                        refresh: this.loaded ? !0 : void 0,
                        outSR: l.toJson(this._outSR.toJson())
                      },
                      callbackParamName: "callback",
                      load: function(c) {
                        e._io = null;
                        e._initLayer(c);
                        k._waitForLayer(m)
                          .then(function(c) {
                            var e = 0;
                            c.name = b.fileName;
                            c.xtnAddData = !0;
                            q.forEach(c.getLayers(), function(a) {
                              a &&
                                a.graphics &&
                                0 < a.graphics.length &&
                                (e += a.graphics.length);
                            });
                            var f = a.spatialReference,
                              g = c._outSR;
                            f &&
                            g &&
                            (f.equals(g) ||
                              (f.isWebMercator() && 4326 === g.wkid) ||
                              (g.isWebMercator() && 4326 === f.wkid))
                              ? a.addLayer(c)
                              : new D({
                                  titleLabel: B._widgetLabel,
                                  message: B.addFromFile.kmlProjectionMismatch
                                });
                            d._setBusy(!1);
                            d._setStatus(
                              B.addFromFile.featureCountPattern
                                .replace("{filename}", b.fileName)
                                .replace("{count}", e)
                            );
                          })
                          .otherwise(function(a) {
                            f("kml-_waitForLayer.error", a);
                          });
                      },
                      error: function(a) {
                        e._io = null;
                        a = h.mixin(Error(), a);
                        a.message = "Unable to load KML: " + (a.message || "");
                        e._fireUpdateEnd(a);
                        e._errorHandler(a);
                        f("Unable to load KML", a);
                      }
                    },
                    { usePost: !0 }
                  );
                };
                m._parseKml();
              }
            };
            try {
              e.readAsText(b.file);
            } catch (m) {
              f("FileReader::readAsText", m);
            }
          },
          _generateFeatures: function(b, d) {
            var e = b.sharingUrl + "/content/features/generate";
            b.publishParameters = b.publishParameters || {};
            var a = h.mixin(b.publishParameters, {
              name: b.baseFileName,
              targetSR: b.map.spatialReference,
              maxRecordCount: this.maxRecordCount,
              enforceInputFileSizeLimit: !0,
              enforceOutputJsonSizeLimit: !0
            });
            if (b.generalize) {
              var f = A.getExtentForScale(b.map, 4e4).getWidth() / b.map.width;
              a.generalize = !0;
              a.maxAllowableOffset = f;
              for (var f = f / 10, g = 0; 1 > f; ) (f *= 10), g++;
              a.reducePrecision = !0;
              a.numberOfDigitsAfterDecimal = g;
            }
            b = {
              f: "json",
              filetype: b.fileType.toLowerCase(),
              publishParameters: window.JSON.stringify(a)
            };
            return v({ url: e, content: b, form: d, handleAs: "json" });
          },
          _getBaseFileName: function(b) {
            t("ie") && ((b = b.split("\\")), (b = b[b.length - 1]));
            b = b.split(".");
            return (b = b[0].replace("c:\\fakepath\\", ""));
          },
          _getBusy: function() {
            return b.contains(this.uploadLabel, "disabled");
          },
          _getFileInfo: function(b) {
            var d = { ok: !1, file: null, fileName: null, fileType: null };
            if (
              (b = b ? b.dataTransfer.files : this.fileNode.files) &&
              1 === b.length
            )
              if (
                ((d.file = b = b[0]),
                (d.fileName = b.name),
                C.endsWith(b.name, ".zip"))
              )
                (d.ok = !0), (d.fileType = "Shapefile");
              else if (C.endsWith(b.name, ".csv"))
                (d.ok = !0), (d.fileType = "CSV");
              else if (C.endsWith(b.name, ".kml"))
                (d.ok = !0), (d.fileType = "KML");
              else if (C.endsWith(b.name, ".gpx"))
                (d.ok = !0), (d.fileType = "GPX");
              else if (
                C.endsWith(b.name, ".geojson") ||
                C.endsWith(b.name, ".geo.json")
              )
                (d.ok = !0), (d.fileType = "GeoJSON");
            d.ok &&
              (d.ok = q.some(this.SHAPETYPE_ICONS, function(a) {
                return a.type.toLowerCase() === d.fileType.toLowerCase();
              }));
            if (d.ok) d.baseFileName = this._getBaseFileName(d.fileName);
            else {
              b = B.addFromFile.invalidType;
              "string" === typeof d.fileName &&
                0 < d.fileName.length &&
                (b = B.addFromFile.invalidTypePattern.replace(
                  "{filename}",
                  d.fileName
                ));
              this._setBusy(!1);
              this._setStatus(b);
              var e = document.createElement("div");
              e.appendChild(document.createTextNode(b));
              new D({ titleLabel: B._widgetLabel, message: e });
            }
            return d;
          },
          resize: function() {},
          _setBusy: function(d) {
            d
              ? (b.add(this.uploadLabel, "disabled"),
                b.add(this.dropArea, ["hit", "disabled"]))
              : (b.remove(this.uploadLabel, "disabled"),
                b.remove(this.dropArea, ["hit", "disabled"]));
          },
          _setStatus: function(b) {
            this.wabWidget && this.wabWidget._setStatus(b);
          }
        });
      });
    },
    "widgets/AddData/search/LayerListPane": function() {
      define("dojo/_base/declare dojo/_base/array dojo/on dojo/dom-class dojo/dom-construct dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/LayerListPane.html dojo/i18n!../nls/strings ./util".split(
        " "
      ), function(p, h, q, l, d, u, b, r, t, z, E) {
        return p([u, b, r], {
          i18n: z,
          templateString: t,
          wabWidget: null,
          baseClass: "add-data-widget-layers",
          postCreate: function() {
            this.inherited(arguments);
          },
          startup: function() {
            this._started ||
              (this._buildList(),
              this._initListeners(),
              this.inherited(arguments));
          },
          _addLayer: function(b, h) {
            var l = this,
              p = this._getLayerTitle(h),
              q = d.create("div", { class: "add-data-layerlist--listitem" }, b);
            d.create(
              "A",
              {
                class: "remove-button",
                href: "#",
                innerHTML:
                  "\x3cspan class\x3d'esri-icon-trash'\x3e\x3c/span\x3e",
                title: z.layerList.removeLayer,
                onclick: function(b) {
                  b.preventDefault();
                  try {
                    l.wabWidget &&
                      l.wabWidget.map &&
                      (l.wabWidget.map.removeLayer(h), d.destroy(q));
                  } catch (v) {
                    console.warn("Error removing layer."), console.warn(v);
                  }
                }
              },
              q
            );
            b = d.create("label", { class: "layer-name" }, q);
            E.setNodeText(b, p);
          },
          _buildList: function() {
            var b = this,
              l = !1,
              p = [],
              q = this.wabWidget.map,
              r = d.create("div", { class: "add-data-layerlist--list" });
            h.forEach(q.layerIds, function(b) {
              p.push(b);
            });
            h.forEach(q.graphicsLayerIds, function(b) {
              p.push(b);
            });
            p.reverse();
            h.forEach(p, function(d) {
              (d = q.getLayer(d)) &&
                d.xtnAddData &&
                ((l = !0), b._addLayer(r, d));
            });
            return l
              ? r
              : d.create("div", {
                  class: "no-data-message",
                  innerHTML: z.layerList.noLayersAdded
                });
          },
          _getLayerTitle: function(b) {
            var d = "...";
            if ("string" === typeof b.label && 0 < b.label.length) d = b.label;
            else if ("string" === typeof b.title && 0 < b.title.length)
              d = b.title;
            else if ("string" === typeof b.name && 0 < b.name.length)
              d = b.name;
            else if (b.url) {
              var h = b.url.indexOf("/FeatureServer");
              -1 === h && (h = b.url.indexOf("/MapServer"));
              -1 === h && (h = b.url.indexOf("/ImageServer"));
              -1 === h && (h = b.url.indexOf("/service"));
              -1 < h &&
                ((b = b.url.substring(0, h)),
                (d = b = b.substring(b.lastIndexOf("/") + 1, b.length)));
            }
            return d;
          },
          _initListeners: function() {
            var b = this;
            this.own(
              q(this._backButton, "click", function(d) {
                d.preventDefault();
                b.hide();
              })
            );
          },
          show: function() {
            var b = this._buildList();
            this._title.innerHTML = z.layerList.caption;
            this._layerlist.innerHTML = "";
            b && b.tagName && this._layerlist.appendChild(b);
            this.wabWidget &&
              this.wabWidget.domNode &&
              l.add(this.wabWidget.domNode, "layerlist-show");
            l.add(this.domNode, "show");
          },
          hide: function() {
            this.wabWidget &&
              this.wabWidget.domNode &&
              l.remove(this.wabWidget.domNode, "layerlist-show");
            l.remove(this.domNode, "show");
          }
        });
      });
    },
    "widgets/AddData/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:widgets/AddData/search/templates/SearchPane.html":
      '\x3cdiv class\x3d"search-pane"\x3e\r\n  \x3cdiv class\x3d"search-pane-header" data-dojo-attach-point\x3d"headerNode"\x3e\r\n    \x3cdiv class\x3d"search-bar main-search-bar"\x3e\r\n      \x3cdiv data-dojo-type\x3d"widgets/AddData/search/ScopeOptions"\r\n        data-dojo-attach-point\x3d"scopeOptions"\x3e\r\n      \x3c/div\x3e\r\n      \x3c!--\x3cspan class\x3d"search-box-placeholder" data-dojo-attach-point\x3d"searchBoxPlaceholder"\x3e\x3c/span\x3e--\x3e\r\n      \x3cdiv data-dojo-type\x3d"widgets/AddData/search/SearchBox"\r\n        data-dojo-attach-point\x3d"searchBox"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"search-bar-separator"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"search-bar search-bar-secondary" data-dojo-attach-point\x3d"optionsNode"\x3e\r\n      \x3cdiv data-dojo-type\x3d"widgets/AddData/search/BBoxOption"\r\n        data-dojo-attach-point\x3d"bboxOption"\x3e\r\n      \x3c/div\x3e\r\n      \x3c!--\r\n      \x3cdiv class\x3d"filter-wrapper2"\x3e\r\n        \x3cdiv data-dojo-type\x3d"widgets/AddData/search/TypeOptions"\r\n          data-dojo-attach-point\x3d"typeOptions"\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-dojo-type\x3d"widgets/AddData/search/SortOptions"\r\n          data-dojo-attach-point\x3d"sortOptions"\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      --\x3e\r\n      \x3cspan class\x3d"filter-placeholder" data-dojo-attach-point\x3d"filterPlaceholder"\x3e\x3c/span\x3e\r\n      \x3cdiv class\x3d"filter-wrapper" data-dojo-attach-point\x3d"filterWrapper"\x3e\r\n        \x3cdiv data-dojo-type\x3d"widgets/AddData/search/TypeOptions"\r\n          data-dojo-attach-point\x3d"typeOptions"\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-dojo-type\x3d"widgets/AddData/search/SortOptions"\r\n          data-dojo-attach-point\x3d"sortOptions"\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"search-pane-content" data-dojo-attach-point\x3d"contentNode"\x3e\r\n    \x3cdiv data-dojo-type\x3d"widgets/AddData/search/ResultsPane"\r\n      data-dojo-attach-point\x3d"resultsPane"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"search-pane-footer jimu-float-leading" data-dojo-attach-point\x3d"footerNode"\x3e\r\n    \x3cdiv data-dojo-type\x3d"widgets/AddData/search/Paging"\r\n      data-dojo-attach-point\x3d"paging"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"widgets/AddData/search/ResultCount"\r\n      data-dojo-attach-point\x3d"resultCount"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv style\x3d"clear:both"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/SearchBox.html":
      '\x3cdiv class\x3d"search-box2"\x3e\r\n\t\x3cinput type\x3d"text" class\x3d"search-textbox"\r\n\t\tplaceholder\x3d"${i18n.search.searchBox.placeholder}"\r\n\t\tdata-dojo-attach-point\x3d"searchTextBox"\r\n\t\x3e\x3cbutton class\x3d"btn btn-confirm" type\x3d"button"\r\n\t\tdata-dojo-attach-point\x3d"searchButton"\r\n\t\tdata-dojo-attach-event\x3d"onClick: searchButtonClicked"\r\n\t\ttitle\x3d"${i18n.search.searchBox.search}"\r\n\t\t\x3e\x3cspan class\x3d"esri-icon-search"\x3e\x3c/span\x3e\r\n\t\x3c/button\x3e\r\n\x3c!--\r\n\x3cdiv class\x3d"search-box"\x3e\r\n\t\x3cdiv class\x3d"input-group"\x3e\r\n\t\t\x3cinput type\x3d"text" class\x3d"search-textbox"\r\n\t\t\tplaceholder\x3d"${i18n.search.searchBox.placeholder}"\r\n\t\t\tdata-dojo-attach-point\x3d"searchTextBox"\x3e\r\n    \x3cspan class\x3d"search-btn"\x3e\r\n\t\t\t\x3cbutton class\x3d"btn btn-clear hidden" type\x3d"button"\r\n\t\t\t\tdata-dojo-attach-point\x3d"clearButton"\r\n\t\t\t\tdata-dojo-attach-event\x3d"onClick: clearButtonClicked"\x3e\r\n\t\t\t\t\x3cspan class\x3d"esri-icon-close"\x3e\x3c/span\x3e\r\n\t\t\t\x3c/button\x3e\r\n\t\t\t\x3cbutton class\x3d"btn btn-confirm" type\x3d"button"\r\n\t\t\t\tdata-dojo-attach-point\x3d"searchButton"\r\n\t\t\t\tdata-dojo-attach-event\x3d"onClick: searchButtonClicked"\r\n\t\t\t\ttitle\x3d"${i18n.search.searchBox.search}"\r\n\t\t\t\t\x3e\x3cspan class\x3d"esri-icon-search"\x3e\x3c/span\x3e\r\n\t\t\t\x3c/button\x3e\r\n\t\t\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n--\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/BBoxOption.html":
      '\x3cdiv class\x3d"search-bbox-option"\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"bboxSection" class\x3d"switch-toggle-group"\x3e\r\n    \x3clabel class\x3d"checkbox-inline"\x3e\r\n      \x3cinput id\x3d"${id}_bboxId"\r\n\t      data-dojo-type\x3d"dijit/form/CheckBox"\r\n\t      data-dojo-attach-point\x3d"bboxToggle"\r\n\t      data-dojo-attach-event\x3d"onClick: bboxClicked"\r\n\t      data-dojo-props\x3d"class: \'switch-toggle\'"\r\n        title\x3d"${i18n.search.bboxOption.bbox}"/\x3e\r\n      \x3cspan class\x3d"label-text"\x3e${i18n.search.bboxOption.bbox}\x3c/span\x3e\r\n    \x3c/label\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/ScopeOptions.html":
      '\x3cdiv class\x3d"search-scope-options"\x3e\r\n  \x3ca href\x3d"#" class\x3d"scope-placeholder"\r\n    data-dojo-attach-point\x3d"scopePlaceholder"\r\n    data-dojo-attach-event\x3d"onClick: scopePlaceholderClicked"\x3e\r\n    \x3cspan data-dojo-attach-point\x3d"scopePlaceholderText"\x3e\x3c/span\x3e\r\n    \x3cspan class\x3d"dropdown-arrow"\x3e\x3c/span\x3e\r\n  \x3c/a\x3e\r\n  \x3cdiv class\x3d"btn-group" data-dojo-attach-point\x3d"btnGroup"\x3e\r\n    \x3cbutton type\x3d"button" class\x3d"btn btn-sm btn-default" name\x3d"${id}_scope"\r\n      data-dojo-attach-point\x3d"MyContentToggle"\r\n      data-dojo-attach-event\x3d"onClick: optionClicked"\r\n      data-option-name\x3d"MyContent"\x3e\r\n      ${i18n.search.scopeOptions.myContent}\r\n    \x3c/button\x3e\r\n    \x3cbutton type\x3d"button" class\x3d"btn btn-sm btn-default" name\x3d"${id}_scope"\r\n      data-dojo-attach-point\x3d"MyOrganizationToggle"\r\n      data-dojo-attach-event\x3d"onClick: optionClicked"\r\n      data-option-name\x3d"MyOrganization"\x3e\r\n      ${i18n.search.scopeOptions.myOrganization}\r\n    \x3c/button\x3e\r\n    \x3cbutton type\x3d"button" class\x3d"btn btn-sm btn-default" name\x3d"${id}_scope"\r\n      data-dojo-attach-point\x3d"CuratedToggle"\r\n      data-dojo-attach-event\x3d"onClick: optionClicked"\r\n      data-option-name\x3d"Curated"\x3e\r\n      ${i18n.search.scopeOptions.curated}\r\n    \x3c/button\x3e\r\n    \x3cbutton type\x3d"button" class\x3d"btn btn-sm btn-default" name\x3d"${id}_scope"\r\n      data-dojo-attach-point\x3d"ArcGISOnlineToggle"\r\n      data-dojo-attach-event\x3d"onClick: optionClicked"\r\n      data-option-name\x3d"ArcGISOnline"\x3e\r\n      ${i18n.search.scopeOptions.ArcGISOnline}\r\n    \x3c/button\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/TypeOptions.html":
      '\x3cdiv class\x3d"search-data-type-options"\x3e\r\n  \x3cdiv data-dojo-type\x3d"dijit/form/DropDownButton"\x3e\r\n    \x3cspan\x3e${i18n.search.typeOptions.prompt}\x3c/span\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/TooltipDialog"\r\n         data-dojo-attach-point\x3d"tooltipDialog"\r\n         data-dojo-props\x3d"\'class\':\'add-data-widget-popup\'"\x3e\r\n      \x3clabel for\x3d"${id}_mapServiceId" class\x3d"search-type-option"\x3e\r\n        \x3cdiv id\x3d"${id}_mapServiceId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"mapServiceToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;Map Service\x26quot;\'\x3e\x3c/div\x3e\r\n        ${i18n.search.typeOptions.mapService}\r\n      \x3c/label\x3e\r\n      \x3clabel for\x3d"${id}_featureServiceId" class\x3d"search-type-option"\x3e\r\n        \x3cdiv id\x3d"${id}_featureServiceId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"featureServiceToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;Feature Service\x26quot;\'\x3e\x3c/div\x3e\r\n        ${i18n.search.typeOptions.featureService}\r\n      \x3c/label\x3e\r\n      \x3clabel for\x3d"${id}_imageServiceId" class\x3d"search-type-option"\x3e\r\n        \x3cdiv id\x3d"${id}_imageServiceId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"imageServiceToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;Image Service\x26quot;\'\x3e\x3c/div\x3e\r\n        ${i18n.search.typeOptions.imageService}\r\n      \x3c/label\x3e\r\n      \x3clabel for\x3d"${id}_vectorTileServiceId" class\x3d"search-type-option"\r\n        data-dojo-attach-point\x3d"vectorTileNode"\x3e\r\n        \x3cdiv id\x3d"${id}_vectorTileServiceId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"vectorTileServiceToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;Vector Tile Service\x26quot;\'\x3e\x3c/div\x3e\r\n        ${i18n.search.typeOptions.vectorTileService}\r\n      \x3c/label\x3e\r\n      \x3clabel for\x3d"${id}_kmlId" class\x3d"search-type-option"\x3e\r\n        \x3cdiv id\x3d"${id}_kmlId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"kmlToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;KML\x26quot;\'\x3e\x3c/div\x3e\r\n        ${i18n.search.typeOptions.kml}\r\n      \x3c/label\x3e\r\n      \x3clabel for\x3d"${id}_wmsId" class\x3d"search-type-option"\x3e\r\n        \x3cdiv id\x3d"${id}_wmsId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"wmsToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;WMS\x26quot;\'\x3e\x3c/div\x3e\r\n        ${i18n.search.typeOptions.wms}\r\n      \x3c/label\x3e\r\n      \x3clabel for\x3d"${id}_wfsId" class\x3d"search-type-option"\x3e\r\n        \x3cdiv id\x3d"${id}_wfsId"\r\n          data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n          data-dojo-attach-point\x3d"wfsToggle"\r\n          data-dojo-attach-event\x3d"onClick: optionClicked"\r\n          data-option-q\x3d\'type:\x26quot;WFS\x26quot;\'\x3e\x3c/div\x3e\r\n        WFS\r\n      \x3c/label\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/SortOptions.html":
      '\x3cdiv class\x3d"search-sort-options"\x3e\r\n  \x3clabel for\x3d"${id}_select" class\x3d"sort-prompt"\x3e${i18n.search.sortOptions.prompt}\x3c/label\x3e \r\n  \x3cselect id\x3d"${id}_select"\r\n    data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"sortSelect"\x3e\r\n    \x3coption value\x3d"" selected\x3d"selected"\x3e${i18n.search.sortOptions.relevance}\x3c/option\x3e\r\n    \x3coption value\x3d"title"\x3e${i18n.search.sortOptions.title}\x3c/option\x3e\r\n    \x3coption value\x3d"owner"\x3e${i18n.search.sortOptions.owner}\x3c/option\x3e\r\n    \x3coption value\x3d"avgrating"\x3e${i18n.search.sortOptions.rating}\x3c/option\x3e\r\n    \x3coption value\x3d"numviews"\x3e${i18n.search.sortOptions.views}\x3c/option\x3e\r\n    \x3coption value\x3d"modified"\x3e${i18n.search.sortOptions.date}\x3c/option\x3e\r\n  \x3c/select\x3e\r\n  \x3ca href\x3d"#" class\x3d"sort-order-icon"\r\n    title\x3d"${i18n.search.sortOptions.switchOrder}"\r\n    data-dojo-attach-point\x3d"sortOrderBtn"\r\n    data-dojo-attach-event\x3d"onclick: sortOrderClicked"\x3e\r\n  \x3c/a\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/ResultsPane.html":
      '\x3cdiv class\x3d"search-results-pane" data-dojo-attach-point\x3d"containerNode"\x3e\r\n  \x3cdiv class\x3d"search-results-pane-no-match empty-data-label" data-dojo-attach-point\x3d"noMatchNode" style\x3d"display:none;"\x3e\x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"itemsNode" class\x3d"search-results"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/AddData/search/templates/ItemCard.html":
      '\x3cdiv class\x3d"item-card"\x3e\r\n  \x3cdiv class\x3d"item-card-inner"\x3e\r\n    \x3cdiv class\x3d"thumbnail" data-dojo-attach-point\x3d"thumbnailNode"\x3e\x3c/div\x3e\r\n    \x3ch3 class\x3d"title" data-dojo-attach-point\x3d"titleNode"\x3e\x3c/h3\x3e\r\n    \x3cdiv class\x3d"info" data-dojo-attach-point\x3d"typeByOwnerNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"info" data-dojo-attach-point\x3d"dateNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"action-bar"\x3e\r\n      \x3cspan class\x3d"message" data-dojo-attach-point\x3d"messageNode"\x3e\x3c/span\x3e\r\n      \x3ca href\x3d"javascript:void(0)"\r\n        data-dojo-attach-point\x3d"addButton"\r\n        data-dojo-attach-event\x3d"onClick: addClicked"\r\n        \x3e${i18n.search.item.actions.add}\r\n      \x3c/a\x3e\r\n      \x3ca href\x3d"javascript:void(0)"\r\n        data-dojo-attach-point\x3d"detailsButton"\r\n        data-dojo-attach-event\x3d"onClick: detailsClicked"\r\n        \x3e${i18n.search.item.actions.details}\r\n      \x3c/a\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/Paging.html":
      '\x3cdiv class\x3d"search-paging"\x3e\r\n\t\x3cul class\x3d"pagination pagination-sm"\x3e\r\n\t\t\x3cli\x3e\r\n\t\t\t\x3ca href\x3d"#" aria-label\x3d"First"\r\n\t\t\t\tdata-dojo-attach-point\x3d"firstButton"\r\n\t\t\t\tdata-dojo-attach-event\x3d"onClick: firstButtonClicked"\r\n\t\t\t\ttitle\x3d"${i18n.search.paging.firstTip}"\x3e\r\n\t\t\t\t\x3cspan aria-hidden\x3d"true" class\x3d"esri-icon-expand"\x3e\x3c/span\x3e\r\n\t\t\t\x3c/a\x3e\r\n\t\t\x3c/li\x3e\r\n\t\t\x3cli\x3e\r\n\t\t\t\x3ca href\x3d"#" aria-label\x3d"Previous"\r\n\t\t\t\tdata-dojo-attach-point\x3d"previousButton"\r\n\t\t\t\tdata-dojo-attach-event\x3d"onClick: previousButtonClicked"\r\n\t\t\t\ttitle\x3d"${i18n.search.paging.previousTip}"\x3e\r\n\t\t\t\t\x3cspan aria-hidden\x3d"true" class\x3d"esri-icon-left"\x3e\x3c/span\x3e\r\n\t\t\t\x3c/a\x3e\r\n\t\t\x3c/li\x3e\r\n\t\t\x3cli class\x3d"current-page"\x3e\r\n\t\t  \x3cspan data-dojo-attach-point\x3d"pageNode"\x3e\x3c/span\x3e\r\n\t\t\x3c/li\x3e\r\n\t\t\x3cli\x3e\r\n\t\t\t\x3ca href\x3d"#" aria-label\x3d"Next"\r\n\t\t\t\tdata-dojo-attach-point\x3d"nextButton"\r\n\t\t\t\tdata-dojo-attach-event\x3d"onClick: nextButtonClicked"\r\n\t\t\t\ttitle\x3d"${i18n.search.paging.nextTip}"\x3e\r\n\t\t\t\t\x3cspan aria-hidden\x3d"true" class\x3d"esri-icon-right"\x3e\x3c/span\x3e\r\n\t\t\t\x3c/a\x3e\r\n\t\t\x3c/li\x3e\r\n\t\x3c/ul\x3e\r\n\x3c/div\x3e',
    "url:widgets/AddData/search/templates/ResultCount.html":
      '\x3cdiv class\x3d"search-result-count"\x3e\r\n  \x3cspan class\x3d"search-count" data-dojo-attach-point\x3d"messageNode"\x3e\x3c/span\x3e\r\n\x3c/div\x3e',
    "url:widgets/AddData/search/templates/AddFromUrlPane.html":
      '\x3cdiv class\x3d"secondary-pane add-url-pane"\x3e\r\n  \x3cdiv class\x3d"add-url-pane-container"\x3e\r\n    \x3cdiv class\x3d"add-url-pane-container--inner"\x3e\r\n      \x3clabel for\x3d"${id}_select"\x3e${i18n.addFromUrl.type}\x3c/label\x3e\r\n      \x3cselect id\x3d"${id}_select"\r\n        data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"typeSelect"\x3e\r\n        \x3coption value\x3d"ArcGIS" selected\x3d"selected"\x3e${i18n.addFromUrl.types.ArcGIS}\x3c/option\x3e\r\n        \x3coption value\x3d"WMS"\x3e${i18n.addFromUrl.types.WMS}\x3c/option\x3e\r\n        \x3c!--not yet supported \x3coption value\x3d"WMTS"\x3e${i18n.addFromUrl.types.WMTS}\x3c/option\x3e --\x3e\r\n        \x3coption value\x3d"WFS"\x3e${i18n.addFromUrl.types.WFS}\x3c/option\x3e\r\n        \x3coption value\x3d"KML"\x3e${i18n.addFromUrl.types.KML}\x3c/option\x3e\r\n        \x3coption value\x3d"GeoRSS"\x3e${i18n.addFromUrl.types.GeoRSS}\x3c/option\x3e\r\n        \x3coption value\x3d"CSV"\x3e${i18n.addFromUrl.types.CSV}\x3c/option\x3e\r\n      \x3c/select\x3e\r\n      \x3clabel for\x3d"${id}_url"\x3e${i18n.addFromUrl.url}\x3c/label\x3e\r\n      \x3cinput id\x3d"${id}_url" type\x3d"text" class\x3d"url-textbox jimu-input"\r\n          data-dojo-attach-point\x3d"urlTextBox"\x3e\r\n      \x3cdiv class\x3d"action-bar"\x3e\r\n        \x3ca class\x3d"jimu-float-leading" href\x3d"javascript:void(0)"\r\n          data-dojo-attach-point\x3d"examplesExpander"\r\n          data-dojo-attach-event\x3d"onClick: examplesExpanderClicked"\r\n          \x3e${i18n.addFromUrl.samplesHint}\x3c/a\x3e\r\n        \x3ca class\x3d"jimu-btn"\r\n          href\x3d"javascript:void(0)"\r\n          data-dojo-attach-point\x3d"addButton"\r\n          data-dojo-attach-event\x3d"onClick: addClicked"\r\n          \x3e${i18n.search.item.actions.add}\r\n        \x3c/a\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"examples" data-dojo-attach-point\x3d"examplesNode"\x3e\r\n        \x3cdiv data-examples-type\x3d"ArcGIS"\x3e\r\n          \x3cdiv\x3ehttp://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Cities/FeatureServer/0\x3c/div\x3e\r\n          \x3cdiv\x3ehttp://services.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Tapestry/MapServer\x3c/div\x3e\r\n          \x3cdiv\x3ehttp://imagery.arcgisonline.com/ArcGIS/rest/services/LandsatGLS/VegetationAnalysis/ImageServer\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-examples-type\x3d"WMS"\x3e\r\n          \x3cdiv\x3ehttp://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?service\x3dWMS\x26amp;request\x3dGetCapabilities\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-examples-type\x3d"WFS"\x3e\r\n          \x3cdiv\x3ehttps://dservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/services/JapanPrefectures2018/WFSServer\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-examples-type\x3d"KML"\x3e\r\n          \x3cdiv\x3ehttp://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month_age_animated.kml\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-examples-type\x3d"GeoRSS"\x3e\r\n          \x3cdiv\x3ehttp://www.gdacs.org/xml/rss.xml\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-examples-type\x3d"CSV"\x3e\r\n          \x3cdiv\x3ehttp://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv\x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/AddFromFilePane.html":
      '\x3cdiv class\x3d"secondary-pane add-file-pane"\x3e\r\n\r\n  \x3cdiv class\x3d"generalize-options"\x3e\r\n    \x3cdiv data-dojo-type\x3d"jimu/dijit/CheckBox"\r\n      data-dojo-attach-point\x3d"generalizeCheckBox"\r\n      data-dojo-props\x3d"checked:true"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n  \x3cdiv class\x3d"browse-or-drop"\x3e\r\n    \x3cdiv class\x3d"drop-container" data-dojo-attach-point\x3d"dropContainer"\x3e\r\n      \x3cdiv class\x3d"drop-area" data-dojo-attach-point\x3d"dropArea"\x3e\r\n        \x3cdiv class\x3d"supported-file-types" data-dojo-attach-point\x3d"supportedFileTypes"\x3e\x3c/div\x3e\r\n        \x3cdiv class\x3d"or"\x3e${i18n.addFromFile.dropOrBrowse}\x3c/div\x3e\r\n        \x3cform class\x3d"file-form" enctype\x3d"multipart/form-data" method\x3d"post"\r\n          data-dojo-attach-point\x3d"fileForm"\x3e\r\n          \x3clabel for\x3d"${id}_file" class\x3d"jimu-btn"\r\n            data-dojo-attach-point\x3d"uploadLabel"\x3e${i18n.addFromFile.browse}\x3c/label\x3e\r\n          \x3cinput id\x3d"${id}_file" name\x3d"file" type\x3d"file" style\x3d"display:none"\r\n            data-dojo-attach-point\x3d"fileNode" /\x3e\r\n        \x3c/form\x3e\r\n        \x3ca href\x3d"#" class\x3d"drop-area-hint" data-dojo-attach-point\x3d"hintButton"\x3e\r\n          \x3ci class\x3d"esri-icon-question"\x3e\x3c/i\x3e\r\n        \x3c/a\x3e\r\n        \x3cspan class\x3d"upload-arrow"\x3e\x3c/span\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/search/templates/LayerListPane.html":
      '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"add-data-layerlist--mask"\x3e\x3c/div\x3e\r\n  \x3cdiv class\x3d"add-data-layerlist--container" data-dojo-attach-point\x3d"_container"\x3e\r\n    \x3ch2 data-dojo-attach-point\x3d"_title"\x3e\x3c/h2\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"_layerlist"\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"add-data-layerlist--footer jimu-widget-add-data-footer" data-dojo-attach-point\x3d"_footer"\x3e\r\n    \x3ca href\x3d"#" class\x3d"back-button" data-dojo-attach-point\x3d"_backButton"\x3e\r\n      ${i18n.layerList.back}\x3ci class\x3d"esri-icon-collapse"\x3e\x3c/i\x3e\r\n    \x3c/a\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/Widget.html":
      '\x3cdiv\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"tabsNode"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"searchNode"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"urlNode"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"fileNode"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/AddData/css/style.css":
      '.jimu-widget-add-data .jimu-tab3 {height: 100%;}.jimu-widget-add-data .search-pane,.jimu-widget-add-data .secondary-pane {height: 100%; width: 100%; background-color: #f8f8f8; position: relative;}.jimu-widget-add-data .search-pane \x3e *,.jimu-widget-add-data .secondary-pane \x3e * {width: 100%;}.jimu-widget-add-data .search-pane-content {position: absolute; top: 140px; bottom: 0; overflow: auto; background-color: #efefef;}.jimu-widget-add-data .search-pane .search-bar {padding: 10px 15px; line-height: 20px;}.jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn {min-width: 40px; padding-top: 10px; padding-bottom: 13px; background-color: transparent; border: 0; border-bottom: 2px solid transparent; margin-left: 5px; margin-right: 5px; color: #898989; font-size: 12px; font-weight: bold; font-family: inherit;}.jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn.active,.jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn.active:active,.jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn.active:hover {background-color: transparent !important; color: #000 !important; border-bottom-color: #24b5cc; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none;}.jimu-widget-add-data .search-pane .search-bar.main-search-bar {background-color: #fff; padding-bottom: 0; position: relative; display: flex;}.jimu-widget-add-data .search-pane .search-scope-options {flex: 1; overflow: hidden;}.jimu-widget-add-data .search-pane .search-bar.search-scope-bar .search-sort-options {margin-top: 5px;}.jimu-widget-add-data .search-pane .search-bar-secondary {background-color: #f8f8f8; padding-top: 5px; padding-bottom: 5px; font-size: 11px;}.jimu-widget-add-data .search-pane .search-pane-header {border-bottom: 1px solid #cccccc;}.jimu-widget-add-data .search-pane .search-pane-header:before,.jimu-widget-add-data .search-pane .search-pane-header:after {content: " "; display: table;}.jimu-widget-add-data .search-pane .search-pane-header:after {clear: both;}.jimu-widget-add-data .search-pane .search-bar:before,.jimu-widget-add-data .search-pane .search-bar:after {content: " "; display: table;}.jimu-widget-add-data .search-pane .search-bar:after {clear: both;}.jimu-widget-add-data .search-pane .search-data-type-options {margin-right: 15px;}.jimu-widget-add-data .search-pane .search-curated-option {display: inline-block; margin-left: 30px;}.jimu-widget-add-data .search-pane .search-bar-separator {border-bottom: 1px solid #e7e7e7;}.jimu-widget-add-data .search-pane .search-pane-default .search-bar {text-align: right; margin-bottom: 24px;}.jimu-widget-add-data .search-pane .search-results-pane {padding: 10px 5px;}.jimu-widget-add-data .search-pane .search-results-pane:after {content: ""; display: table; clear: both;}.jimu-widget-add-data .search-pane .item-card {float: left; width: 100%; padding-left: 5px; padding-right: 5px; -webkit-transition: width 0.1s ease; -moz-transition: width 0.1s ease; -o-transition: width 0.1s ease; transition: width 0.1s ease;}.jimu-widget-add-data .search-pane .item-card .item-card-inner {height: 70px; background: #ffffff; border: 1px solid #e0e0e0; border-bottom-color: #cccccc; padding: 5px; margin-bottom: 10px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}.jimu-widget-add-data .search-pane .item-card .thumbnail {float: left; margin-right: 10px;}.jimu-widget-add-data .search-pane .item-card .thumbnail img {height: 60px; width: 90px;}.jimu-widget-add-data .search-pane .item-card h3.title {margin: 0 5px; padding: 0; font-size: 12px; font-weight: bold; color: #4c4c4c; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}.jimu-widget-add-data .search-pane .item-card div.info {color: #898989; font-size: 10px; overflow: hidden; white-space: nowrap; padding-top: 3px;}.jimu-widget-add-data .search-pane .item-card .action-bar,.jimu-widget-add-data .secondary-pane .action-bar {text-align: right;}.jimu-rtl .jimu-widget-add-data .search-pane .item-card .action-bar,.jimu-rtl .jimu-widget-add-data .secondary-pane .action-bar {text-align: left;}.jimu-widget-add-data .secondary-pane {padding: 20px 15px; overflow: auto;}.jimu-widget-add-data .secondary-pane label {color: #898989; display: block; margin-bottom: 10px;}.jimu-widget-add-data .secondary-pane .dijit {margin-bottom: 10px;}.jimu-widget-add-data .secondary-pane div.action-bar {margin-top: 20px;}.jimu-widget-add-data .secondary-pane .jimu-btn {color: #fff; line-height: 20px; text-decoration: none;}.jimu-widget-add-data .secondary-pane .jimu-btn:active {}.jimu-widget-add-data .search-pane .item-card .action-bar a,.jimu-widget-add-data .add-url-pane .action-bar a,.jimu-widget-add-data .add-file-pane .file-form label {display: inline-block; font-size: 11px; text-transform: uppercase; padding: 5px; margin-right: 5px;}.jimu-widget-add-data .search-pane .item-card .action-bar a.disabled,.jimu-widget-add-data .add-url-pane .action-bar a.disabled,.jimu-widget-add-data .add-file-pane .file-form label.disabled,.jimu-widget-add-data .add-file-pane .drop-area.disabled {opacity: 0.3;}.jimu-widget-add-data .search-pane .item-card .action-bar .message {font-size: 10px; font-style: italic; margin-left: 4px; margin-right: 4px;}.jimu-widget-add-data .add-url-pane .action-bar .jimu-btn,.jimu-widget-add-data .add-file-pane .file-form label {margin-right: 0; min-width: 180px; white-space: normal;}.jimu-widget-add-data .add-url-pane {padding: 0;}.jimu-widget-add-data .add-url-pane-container {background-color: #fff; border-bottom: 1px solid #ccc; padding: 15px 15px 35px;}.jimu-widget-add-data .add-url-pane-container--inner {max-width: 960px; margin: 0 auto;}.jimu-widget-add-data .add-file-pane .intro ul {font-size: 10px; margin: 0; padding: 2px 0 2px 20px;}.jimu-widget-add-data .add-file-pane .intro ul .note {font-style: italic;}.jimu-rtl .jimu-widget-add-data .add-file-pane .intro ul {padding: 2px 20px 2px 0;}.jimu-widget-add-data .add-file-pane .generalize-options .jimu-checkbox .checkbox {margin-top: 0; vertical-align: middle;}.jimu-widget-add-data .add-file-pane .generalize-options .jimu-checkbox .label {font-size: 12px; vertical-align: middle; cursor: pointer;}.jimu-widget-add-data .add-file-pane .browse-or-drop {}.jimu-widget-add-data .add-file-pane .or {display: block; margin: 20px auto; font-size: 11px; color: #898989; width: 90%; max-width: 400px; line-height: 20px; position: relative;}.jimu-widget-add-data .add-file-pane .or:before,.jimu-widget-add-data .add-file-pane .or:after {content: ""; display: block; height: 1px; width: 35%; background: #eee; position: absolute; top: 9px; left: 0;}.jimu-widget-add-data .add-file-pane .or:after {right: 0; left: auto;}.jimu-widget-add-data .add-file-pane .or b {display: inline-block; padding-right: 5px;}.jimu-widget-add-data .add-file-pane .drop-area {width: 100%; background: #fff; margin: 10px auto 0; padding: 25px 50px 35px; border: 1px dashed #ccc; color: #898989; font-size: 12px; text-align: center; line-height: 1.75; text-transform: uppercase; position: relative; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; -webkit-transition: opacity ease-in-out 0.15s; -moz-transition: opacity ease-in-out 0.15s; -o-transition: opacity ease-in-out 0.15s; transition: opacity ease-in-out 0.15s;}.jimu-widget-add-data .add-file-pane .drop-area i {color: #485566; font-style: normal;}.jimu-widget-add-data .add-file-pane .drop-area a.drop-area-hint {position: absolute; top: 0; right: 0; margin: 5px; padding: 10px; font-size: 14px; line-height: 1;}.jimu-widget-add-data .add-file-pane .drop-area.hit {background: #f9f9f9; border-color: #24b5cc;}.jimu-widget-add-data .add-file-pane .drop-area.hit \x3e * {pointer-events: none; display: none;}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types {display: block;}.jimu-widget-add-data .add-file-pane .drop-area.hit .upload-arrow {display: block; width: 48px; height: 48px; background: url(images/arrow_up.png) no-repeat; margin: 0 auto; -moz-animation: updload-arrow-animation 1s infinite; -webkit-animation: updload-arrow-animation 1s infinite; animation: updload-arrow-animation 1s infinite;}.jimu-widget-add-data .add-file-pane .drop-area .supported-file-types {margin: 15px 0 35px; opacity: .5; pointer-events: none; -webkit-transition: opacity ease-in-out 0.15s; -moz-transition: opacity ease-in-out 0.15s; -o-transition: opacity ease-in-out 0.15s; transition: opacity ease-in-out 0.15s;}.jimu-widget-add-data .add-file-pane .drop-area .supported-file-types img {width: 45px; margin-left: -5px; position: relative; -webkit-transition: all ease-in-out 0.2s; -moz-transition: all ease-in-out 0.2s; -o-transition: all ease-in-out 0.2s; transition: all ease-in-out 0.2s;}.jimu-widget-add-data .add-file-pane .drop-area .supported-file-types img.first-type-icon {-moz-transform: rotate(-8deg); -moz-transform-origin: right bottom; -webkit-transform: rotate(-8deg); -webkit-transform-origin: right bottom; -o-transform: rotate(-8deg); -o-transform-origin: right bottom; transform: rotate(-8deg); transform-origin: right bottom; bottom: -1px;}.jimu-widget-add-data .add-file-pane .drop-area .supported-file-types img.second-first-type-icon {-moz-transform: rotate(-3deg); -moz-transform-origin: right bottom; -webkit-transform: rotate(-3deg); -webkit-transform-origin: right bottom; -o-transform: rotate(-3deg); -o-transform-origin: right bottom; transform: rotate(-3deg); transform-origin: right bottom;}.jimu-widget-add-data .add-file-pane .drop-area .supported-file-types img.second-last-type-icon {-moz-transform: rotate(3deg); -moz-transform-origin: left bottom; -webkit-transform: rotate(3deg); -webkit-transform-origin: left bottom; -o-transform: rotate(3deg); -o-transform-origin: left bottom; transform: rotate(3deg); transform-origin: left bottom;}.jimu-widget-add-data .add-file-pane .drop-area .supported-file-types img.last-type-icon {-moz-transform: rotate(8deg); -moz-transform-origin: left bottom; -webkit-transform: rotate(8deg); -webkit-transform-origin: left bottom; -o-transform: rotate(8deg); -o-transform-origin: left bottom; transform: rotate(8deg); transform-origin: left bottom; bottom: -1px;}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types {opacity: 1;}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types img {margin-left: 0px;}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types img.first-type-icon {-moz-transform: rotate(-12deg); -webkit-transform: rotate(-12deg); -o-transform: rotate(-12deg); transform: rotate(-12deg); bottom: -3px;}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types img.second-first-type-icon {-moz-transform: rotate(-5deg); -webkit-transform: rotate(-5deg); -o-transform: rotate(-5deg); transform: rotate(-5deg);}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types img.second-last-type-icon {-moz-transform: rotate(5deg); -webkit-transform: rotate(5deg); -o-transform: rotate(5deg); transform: rotate(5deg);}.jimu-widget-add-data .add-file-pane .drop-area.hit .supported-file-types img.last-type-icon {-moz-transform: rotate(12deg); -webkit-transform: rotate(12deg); -o-transform: rotate(12deg); transform: rotate(12deg); bottom: -3px;}.jimu-widget-add-data .add-file-pane .file-form {display: inline-block;}.jimu-widget-add-data .search-box2 {display: inline-block;}.jimu-widget-add-data .search-box2 {float: right;}.jimu-widget-add-data .search-box2 .search-textbox {vertical-align: middle; height: 30px; width: 200px; padding: 5px 10px; font-size: 12px; line-height: 1.5; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -moz-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;}.jimu-widget-add-data .search-box2 .btn {display: inline-block; height: 30px; margin-left: -1px; margin-bottom: 0; font-weight: normal; text-align: center; vertical-align: middle; touch-action: manipulation; cursor: pointer; color: #196fa6; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; padding: 5px 10px; white-space: nowrap; font-size: 12px; line-height: 1.5; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}.jimu-widget-add-data.width-small .search-box2 .search-textbox {width: 150px;}.jimu-widget-add-data.width-small .add-file-pane .or:before,.jimu-widget-add-data.width-small .add-file-pane .or:after {width: 25%;}.jimu-widget-add-data.width-medium .search-box2 .search-textbox {width: 140px;}.jimu-widget-add-data.width-medium .filter-wrapper .sort-prompt,.jimu-widget-add-data.width-small .filter-wrapper .sort-prompt {display: none;}.jimu-widget-add-data.width-medium .search-pane .search-results-pane {padding: 5px 0;}.jimu-widget-add-data.width-medium .search-pane .item-card .item-card-inner {margin-bottom: 5px;}.jimu-widget-add-data.height-small .add-file-pane {padding-top: 15px; padding-bottom: 15px;}.jimu-widget-add-data.height-small .add-file-pane .drop-area {padding-top: 15px; padding-bottom: 25px;}.jimu-widget-add-data.height-small .add-file-pane .drop-area .supported-file-types {margin-bottom: 20px;}.jimu-widget-add-data .search-bbox-option .checkbox-inline,.jimu-widget-add-data .search-bbox-option .checkbox-inline input,.jimu-widget-add-data .search-pane .filter-placeholder {cursor: pointer;}.jimu-widget-add-data.width-small .search-bbox-option {max-width: 120px; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}.jimu-widget-add-data.width-small .search-bbox-option .switch-toggle-group {overflow: hidden; text-overflow: ellipsis;}.jimu-widget-add-data .search-pane .search-bbox-option .checkbox-inline {padding-left: 38px; margin-right: 25px;}.jimu-widget-add-data .search-pane .search-box .input-group {position: relative; display: table; border-collapse: separate;}.jimu-widget-add-data .search-pane .search-box .input-group \x3e * {display: table-cell; vertical-align: middle;}.jimu-widget-add-data .search-pane .search-box .search-textbox {height: 30px; width: 200px; padding: 5px 10px; font-size: 12px; line-height: 1.5; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -moz-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;}.jimu-widget-add-data .search-pane .search-box .btn {display: inline-block; margin-left: -1px; margin-bottom: 0; font-weight: normal; text-align: center; vertical-align: middle; touch-action: manipulation; cursor: pointer; color: #196fa6; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; padding: 5px 10px; white-space: nowrap; font-size: 12px; line-height: 1.5; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}.jimu-widget-add-data .search-pane .search-box .btn-clear {border-color: transparent; background: transparent; position: absolute; left: -32px;}.jimu-widget-add-data .search-pane .search-box-placeholder,.jimu-widget-add-data .search-pane .filter-placeholder,.jimu-widget-add-data .search-pane .scope-placeholder {display: none;}.jimu-widget-add-data .search-pane .search-sort-options \x3e * {vertical-align: middle;}.jimu-widget-add-data .search-pane .search-sort-options label {font-weight: normal; font-size: 11px; color: #898989;}.jimu-widget-add-data .search-pane .search-sort-options .sort-order-icon {float: right; width: 24px; height: 24px; margin: 3px 0;}.jimu-widget-add-data .search-pane .search-sort-options .dropdown-toggle .sort-order-icon {float: none; padding: 0 5px;}.jimu-widget-add-data .search-pane .sort-order-icon {background-image: url("images/down-arrow.png"); background-position: center center; background-repeat: no-repeat; width: 16px; height: 16px; background-image: url("images/sort-down-arrow.png");}.jimu-widget-add-data .search-pane .sort-order-icon.descending {background-image: url("images/sort-up-arrow.png");}.jimu-widget-add-data .search-pane .scope-options \x3e * {display: inline-block;}.jimu-widget-add-data .search-pane .checkbox-inline,.jimu-widget-add-data .search-pane .radio-inline {position: relative; padding-left: 21px; margin-right: 10px;}.jimu-widget-add-data .search-pane .checkbox-inline .dijitCheckBox,.jimu-widget-add-data .search-pane .radio-inline .dijitCheckBox {}.jimu-widget-add-data .search-pane .search-item-ratings-comments-views {display: block; padding: 5px;}.jimu-widget-add-data .search-pane .search-item-ratings-comments-views [class*\x3d"gd-icon-"] {margin-right: 10px; vertical-align: middle;}.jimu-widget-add-data .search-pane .search-paging .pagination {margin: 0;}.jimu-widget-add-data .search-pane .search-paging,.jimu-widget-add-data .search-pane .search-result-count {display: inline-block; vertical-align: middle; line-height: 1;}.jimu-widget-add-data .search-pane .pagination \x3e li \x3e span,.jimu-widget-add-data .search-pane .pagination \x3e li \x3e span:focus,.jimu-widget-add-data .search-pane .pagination \x3e li \x3e span:hover {color: inherit; border-color: transparent; background-color: transparent;}.jimu-widget-add-data .search-pane .pagination \x3e li.current-page \x3e span {padding-left: 15px; padding-right: 15px;}.jimu-widget-add-data .search-pane .pagination [class*\x3d" esri-icon-"],.jimu-widget-add-data .search-pane .pagination [class^\x3d"esri-icon-"] {position: relative; top: 1px;}.jimu-widget-add-data .search-pane .search-result-count {margin: 0 10px;}.jimu-widget-add-data.width-768 .item-card {width: 50%;}.jimu-widget-add-data.width-1200 .item-card {width: 33.3333333333%;}.jimu-widget-add-data.width-medium .search-pane .search-bar,.jimu-widget-add-data.width-small .search-pane .search-bar {padding-left: 5px; padding-right: 5px;}.jimu-widget-add-data.width-medium .search-pane .search-bar .btn-group \x3e .btn,.jimu-widget-add-data.width-small .search-pane .search-bar .btn-group \x3e .btn {margin-left: 0;}.jimu-rtl .jimu-widget-add-data.width-medium .search-pane .search-bar .btn-group \x3e .btn,.jimu-rtl .jimu-widget-add-data.width-small .search-pane .search-bar .btn-group \x3e .btn {margin-left: auto; margin-right: 0;}.jimu-widget-add-data.width-medium .search-box-placeholder,.jimu-widget-add-data.width-small .search-box-placeholder,.jimu-widget-add-data.filter-placeholder-on .filter-placeholder {display: block; height: 30px; width: 30px; background-image: url("images/search.png"); background-position: center center; background-repeat: no-repeat; background-size: 12px;}.jimu-widget-add-data.width-medium .search-box,.jimu-widget-add-data.width-small .search-box {display: none; padding: 10px; position: absolute; top: 0; left: 0; right: 40px; background: #ffffff;}.jimu-widget-add-data.width-small .search-box {padding-top: 8px; padding-bottom: 8px;}.jimu-widget-add-data.width-medium .search-box .input-group,.jimu-widget-add-data.width-small .search-box .input-group {width: 100%;}.jimu-widget-add-data.width-medium .search-box .search-textbox,.jimu-widget-add-data.width-small .search-box .search-textbox {width: 100%;}.jimu-widget-add-data.width-medium .search-box .search-btn,.jimu-widget-add-data.width-small .search-box .search-btn {width: 1%; position: relative;}.jimu-widget-add-data.width-medium .search-box.show,.jimu-widget-add-data.width-small .search-box.show {display: block;}.jimu-widget-add-data.width-medium .search-box-placeholder,.jimu-widget-add-data.width-small .search-box-placeholder {margin: 0 0 8px;}.jimu-widget-add-data.width-medium .search-box-placeholder.opened,.jimu-widget-add-data.width-small .search-box-placeholder.opened {background-image: url("images/close.png");}.jimu-widget-add-data.width-medium .filter-placeholder,.jimu-widget-add-data.width-small .filter-placeholder {background-image: url("images/menu.png");}.jimu-widget-add-data.width-medium .scope-placeholder,.jimu-widget-add-data.width-small .scope-placeholder {display: block; padding: 5px 10px 15px; color: #196fa6; font-weight: bold;}.jimu-widget-add-data.width-small .scope-placeholder {display: flex;}.jimu-widget-add-data.width-small .scope-placeholder \x3e span:first-child {white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: calc(100% - 16px); flex: 1;}.jimu-widget-add-data.width-medium .scope-placeholder:focus,.jimu-widget-add-data.width-small .scope-placeholder:focus {text-decoration: none;}.jimu-widget-add-data.width-medium .scope-placeholder \x3e *,.jimu-widget-add-data.width-small .scope-placeholder \x3e * {vertical-align: middle;}.jimu-widget-add-data.width-medium .scope-placeholder .dropdown-arrow,.jimu-widget-add-data.width-small .scope-placeholder .dropdown-arrow {display: inline-block; background-image: url("images/down-arrow.png"); background-position: center center; background-repeat: no-repeat; width: 16px; height: 16px;}.jimu-widget-add-data.width-medium .btn-group,.jimu-widget-add-data.filter-placeholder-on .filter-wrapper,.jimu-widget-add-data.width-small .btn-group {display: none;}.jimu-widget-add-data.width-medium .filter-wrapper.show,.jimu-widget-add-data.width-medium .btn-group.show,.jimu-widget-add-data.width-small .filter-wrapper.show,.jimu-widget-add-data.width-small .btn-group.show {display: block; position: absolute; right: 0; top: 91px; z-index: 10; padding: 5px 10px; background: #ffffff; border: 1px solid #cccccc; -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2); -moz-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2); box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);}.jimu-rtl .jimu-widget-add-data.width-medium .filter-wrapper.show,.jimu-rtl .jimu-widget-add-data.width-medium .btn-group.show,.jimu-rtl .jimu-widget-add-data.width-small .filter-wrapper.show,.jimu-rtl .jimu-widget-add-data.width-small .btn-group.show {left: 0; right: auto;}.jimu-widget-add-data.width-medium .btn-group.show,.jimu-widget-add-data.width-small .btn-group.show {top: 48px; left: 0; padding: 0; right: auto; min-width: 50%;}.jimu-rtl .jimu-widget-add-data.width-medium .btn-group.show,.jimu-rtl .jimu-widget-add-data.width-small .btn-group.show {left: auto; right: 0;}.jimu-widget-add-data.width-medium .btn-group.show .btn,.jimu-widget-add-data.width-small .btn-group.show .btn {display: block; width: 100%; padding: 10px 15px; border: 0; font-weight: normal;}.jimu-widget-add-data.width-medium .btn-group.show .btn:hover,.jimu-widget-add-data.width-small .btn-group.show .btn:hover {background-color: #f4f4f4;}.jimu-widget-add-data.width-medium .btn-group.show .btn.active,.jimu-widget-add-data.width-medium .btn-group.show .btn.active:hover,.jimu-widget-add-data.width-small .btn-group.show .btn.active,.jimu-widget-add-data.width-small .btn-group.show .btn.active:hover {background-color: #196fa6 !important; color: #fff !important;}.jimu-widget-add-data.width-small .jimu-tab3 .tab-item-td {padding-left: 20px; padding-right: 20px;}.jimu-widget-add-data.width-small .search-pane .search-bar {padding-top: 5px; padding-left: 5px; padding-right: 5px;}.jimu-widget-add-data.width-small .search-pane .search-bar .btn-group \x3e .btn {margin: 0; padding-left: 5px; padding-right: 5px; font-size: 11px;}.jimu-widget-add-data.width-small .search-pane .search-results-pane {padding: 0; overflow: hidden;}.jimu-widget-add-data.width-small .search-pane .item-card {padding-left: 0; padding-right: 0;}.jimu-widget-add-data.width-small .search-pane .item-card .item-card-inner {margin-bottom: 0; border-top: 0; border-left: 0; border-right: 0; border-bottom-color: #e0e0e0;}.add-data-widget-popup .search-type-option {display: block; margin-bottom: 10px;}.add-data-widget-popup .search-type-option,.add-data-widget-popup .search-type-option input {cursor: pointer;}.jimu-widget-add-data {position: absolute; top: 0; bottom: 0; left: 0; right: 0; padding-top: 5px;}.jimu-widget-add-data .btn.hidden {visibility: hidden;}.jimu-widget-add-data .search-bbox-option,.jimu-widget-add-data .search-box {display: inline-block;}.jimu-widget-add-data .search-box,.jimu-widget-add-data .search-box-placeholder {float: right;}.jimu-widget-add-data .search-scope-options,.jimu-widget-add-data .search-sort-options {display: inline-block;}.jimu-widget-add-data .search-data-type-options {float: left;}.jimu-widget-add-data .filter-wrapper,.jimu-widget-add-data .filter-placeholder {float: right;}.jimu-widget-add-data .search-scope-options button.active {background-color: #cce6ff;}.jimu-widget-add-data .search-results-pane {overflow-y: auto;}.jimu-widget-add-data .search-paging,.jimu-widget-add-data .search-result-count {display: inline-block;}.jimu-widget-add-data .search-paging ul {margin: 0; padding: 0;}.jimu-widget-add-data .search-paging li {display: inline-block;}.jimu-widget-add-data .search-paging li.disabled a,.jimu-widget-add-data .search-paging li.disabled a:hover,.jimu-widget-add-data .search-paging li.disabled a:active,.jimu-widget-add-data .search-paging li.disabled a:focus {cursor: default; opacity: 0.35;}.jimu-widget-add-data .search-item-card .action-bar {margin-left: 20px;}.jimu-widget-add-data .search-item-card .action-bar a {margin-right: 8px;}.jimu-widget-add-data .dijitDropDownButton {margin: 0;}.jimu-widget-add-data .dijitSelect,.jimu-widget-add-data .dijitDropDownButton .dijitButtonNode {background: transparent; border: 0; padding: 7px 5px; color: #196fa6; font-weight: bold; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;}.jimu-widget-add-data .dijitSelect .dijitButtonContents,.jimu-widget-add-data .dijitDropDownButton .dijitButtonNode .dijitButtonContents {border-color: transparent;}.jimu-widget-add-data .dijitSelect .dijitInputField,.jimu-widget-add-data .dijitDropDownButton .dijitButtonNode .dijitInputField {padding: 0 5px;}.jimu-widget-add-data .dijitSelect .dijitArrowButton,.jimu-widget-add-data .dijitDropDownButton .dijitButtonNode .dijitArrowButton {background: transparent; border: 0;}.jimu-widget-add-data .dijitSelect.dijitSelectFocused .dijitArrowButton,.jimu-widget-add-data .dijitDropDownButton .dijitButtonNode.dijitSelectFocused .dijitArrowButton {padding: 0;}.jimu-widget-add-data .dijitSelect .dijitArrowButton .dijitArrowButtonInner,.jimu-widget-add-data .dijitSelectHover .dijitArrowButton .dijitArrowButtonInner,.jimu-widget-add-data .dijitSelectFocused .dijitArrowButton .dijitArrowButtonInner {background-image: url("images/down-arrow.png"); background-position: center center; background-repeat: no-repeat; width: 16px; height: 16px;}.jimu-widget-add-data .dijitDropDownButton .dijitArrowButtonInner {background-image: url("images/down-arrow.png"); background-position: center center; background-repeat: no-repeat; width: 16px; height: 16px;}.jimu-widget-add-data-dialog {background-color: #FFFFFF !important; border-color: #555555 !important; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.35) !important; -moz-box-shadow: 0 0 5px rgba(0, 0, 0, 0.35) !important; box-shadow: 0 0 5px rgba(0, 0, 0, 0.35) !important;}.jimu-widget-add-data-dialog .dijitDialogPaneContent {border-top: 1px solid #cccccc;}.jimu-widget-add-data-dialog .dijitDialogTitleBar {background: none repeat scroll 0 0 rgba(0, 0, 0, 0); background-color: #FFFFFF; -moz-border-radius: 3px 3px 0 0; -webkit-border-radius: 3px 3px 0 0; border-radius: 3px 3px 0 0;}.jimu-widget-add-data-dialog .dijitDialogTitle {background-color: #FFFFFF; color: #000000; font-size: 16px; font-weight: bold;}.jimu-widget-add-data-dialog div.gap {margin-top: 20px;}.jimu-widget-add-data-dialog div.small-gap {margin-top: 4px;}.jimu-widget-add-data-dialog div.action-bar {margin-top: 10px;}.jimu-widget-add-data-dialog .url-textbox {height: 30px; width: 200px; padding: 5px 10px; font-size: 12px; line-height: 1.5; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -moz-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;}.jimu-widget-add-data-dialog .url-textbox-wide {width: 500px;}.jimu-widget-add-data-dialog .examples {font-size: 9px; font-style: italic; margin-top: 4px; margin-left: 4px; opacity: 0.5;}.jimu-widget-add-data .btn-link {color: #196fa6 !important;}.jimu-widget-add-data .switch-toggle-group {padding: 5px;}.jimu-widget-add-data .switch-toggle-group .checkbox-inline {padding-left: 36px; vertical-align: top;}.jimu-widget-add-data .switch-toggle-group .switch-toggle.dijitCheckBox {margin-left: -36px;}.jimu-widget-add-data .switch-toggle.dijitCheckBox {height: 16px; width: 28px; border: 0 none; background: #e04f1d; position: relative; display: inline-block; cursor: pointer; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius: 10px;}.jimu-widget-add-data .switch-toggle.dijitCheckBox:before {content: ""; background: #f8f8f8; position: absolute; padding: 0; height: 12px; width: 12px; left: auto; right: 2px; top: 2px; z-index: 1; -webkit-transition: right 0.3s; -moz-transition: right 0.3s; -o-transition: right 0.3s; transition: right 0.3s; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;}.jimu-widget-add-data .switch-toggle.dijitCheckBox input {width: 100%; height: 100%; position: absolute; left: 0; z-index: 2;}.jimu-widget-add-data .switch-toggle.dijitCheckBox.dijitCheckBoxChecked {background: #50ad4e;}.jimu-widget-add-data .switch-toggle.dijitCheckBox.dijitCheckBoxChecked:before {right: 14px;}.jimu-widget-add-data .panel-default \x3e .panel-heading {background-color: transparent; border-color: #e0e0e0;}.jimu-widget-add-data .panel-title {font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}.jimu-widget-add-data .panel-footer .btn + .btn {margin-left: 10px;}.jimu-widget-add-data .gp-panel {width: 300px;}.jimu-widget-add-data .gp-panel \x3e .panel-heading {background-color: transparent; border-left: 1px solid rgba(0, 0, 0, 0.35); color: #efefef; height: 40px;}.jimu-widget-add-data .gp-panel \x3e .panel-heading .panel-title {font-weight: normal; line-height: 1.5;}.jimu-widget-add-data .gp-panel \x3e .panel-heading [class^\x3d"esri-icon-"],.jimu-widget-add-data .gp-panel \x3e .panel-heading [class*\x3d" esri-icon-"] {display: inline-block; margin-right: 10px; position: relative; top: 1px;}.jimu-widget-add-data .gp-panel \x3e .panel-heading .btn-icon {width: 20px; padding: 0; color: #efefef; float: right; margin-right: 0; font-size: 16px; line-height: 1.25; line-height: 20px; text-align: center;}.jimu-widget-add-data .gp-panel \x3e .panel-body {background-color: #f8f8f8; border-left: 1px solid #cccccc; position: absolute; top: 40px; bottom: 0; width: 100%; overflow: auto; padding: 0;}.jimu-widget-add-data .gp-panel .panel-section {background-color: #ffffff;}.jimu-widget-add-data .panel-section {border-bottom: 1px solid #cccccc;}.jimu-widget-add-data .panel-section .section-header {display: block; font-size: 16px; line-height: 1.25; line-height: 20px; padding: 10px 15px;}.jimu-widget-add-data .panel-section .section-header:after {content: ""; display: block; clear: both;}.jimu-widget-add-data .panel-section .section-header [class^\x3d"esri-icon-"],.jimu-widget-add-data .panel-section .section-header [class*\x3d" esri-icon-"],.jimu-widget-add-data .panel-section .section-header .btn {margin: 0 5px; float: right;}.jimu-widget-add-data .panel-section .section-header .btn {margin: 0; min-width: 80px;}.jimu-widget-add-data .panel-section .btn.section-header {border: 0; text-align: left; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-transition: all 0.25s ease; -moz-transition: all 0.25s ease; -o-transition: all 0.25s ease; transition: all 0.25s ease;}.jimu-widget-add-data .panel-section .btn.section-header:hover {background-color: #e2f1fb; text-decoration: none;}.jimu-widget-add-data .panel-section .btn.section-header:active,.jimu-widget-add-data .panel-section .btn.section-header:focus {background-color: #aadbfa; text-decoration: none;}.jimu-widget-add-data .panel-section .section-body {padding: 10px 15px;}.jimu-widget-add-data a, .add-url-pane a {display: block; color: #196fa6; text-decoration: none; line-height: 20px; padding: 10px 5px;}.jimu-widget-add-data .btn.hidden {visibility: hidden;}.jimu-widget-add-data .search-bbox-option, .search-box {display: inline-block;}.jimu-widget-add-data .search-box,.jimu-widget-add-data .search-box-placeholder {float: right;}.jimu-widget-add-data .search-scope-options,.jimu-widget-add-data .search-sort-options {display: inline-block;}.jimu-widget-add-data .search-data-type-options {float: left;}.jimu-widget-add-data .filter-wrapper,.jimu-widget-add-data .filter-placeholder {float: right;}.jimu-widget-add-data .search-scope-options button.active {background-color: #cce6ff;}.jimu-widget-add-data .search-results-pane {overflow-y: auto;}.jimu-widget-add-data .search-paging,.jimu-widget-add-data .search-result-count {display: inline-block;}.jimu-widget-add-data .search-paging ul {margin: 0; padding: 0;}.jimu-widget-add-data .search-paging li {display: inline-block;}.jimu-rtl .jimu-widget-add-data .search-paging li {-moz-transform: rotate(180deg); -webkit-transform: rotate(180deg); -o-transform: rotate(180deg); transform: rotate(180deg);}.jimu-rtl .jimu-widget-add-data .search-paging li.current-page {-moz-transform: rotate(0); -webkit-transform: rotate(0); -o-transform: rotate(0); transform: rotate(0);}.jimu-widget-add-data .search-item-card .action-bar {margin-left: 20px;}.jimu-widget-add-data .search-item-card .action-bar a {margin-right: 8px;}.jimu-widget-add-data .add-url-pane .url-textbox {width: 100%; font-size: 12px; color: #000000;}.jimu-widget-add-data .add-url-pane .examples {display: none; margin: 15px -15px 0; padding: 15px; font-size: 12px; color: #898989; word-wrap: break-word;}.jimu-widget-add-data .add-url-pane .examples \x3e div \x3e div {margin-bottom: 15px;}.jimu-widget-add-data .add-url-pane .examples.show {display: block;}.jimu-widget-add-data .jimu-tab3 \x3e .jimu-viewstack {position: absolute; top: 39px; left: 0px; right: 0; bottom: 0; padding-bottom: 40px;}.jimu-widget-add-data-footer {height: 40px; overflow: hidden; background-color: #f8f8f8; border-top: 1px solid #ccc; padding: 0 15px; color: #898989; font-size: 11px;}.jimu-widget-add-data-footer [class^\x3d"esri-icon-"],.jimu-widget-add-data-footer [class*\x3d" esri-icon-"] {line-height: 20px;}.jimu-widget-add-data-footer .layerlist-button {text-transform: uppercase;}.jimu-widget-add-data-footer .layerlist-button .esri-icon-layers {margin: 0 5px; vertical-align: middle; display: inline-block;}.jimu-widget-add-data-footer .message {display: block; color: #898989; line-height: 20px; padding: 10px 10px 10px 0; text-overflow: ellipsis; overflow: hidden; word-break: break-all; white-space: nowrap;}.jimu-widget-add-data.layerlist-show {overflow: hidden;}.jimu-widget-add-data.layerlist-show .jimu-tab3 {-webkit-filter: blur(5px); filter: blur(5px);}.jimu-widget-add-data.layerlist-show .add-data-layerlist--container {-moz-animation: slide-from-right .4s; -webkit-animation: slide-from-right .4s; animation: slide-from-right .4s;}.add-data-widget-layers {width: 100%; height: 100%; background: rgba(0, 0, 0, 0.3); position: absolute; top: 0; right: 0; z-index: 1;}.add-data-widget-layers {display: none;}.add-data-widget-layers.show {display: block;}.add-data-widget-layers .add-data-layerlist--container {background: #fff; position: absolute; top: 0; right: 0; width: 320px; height: 100%; -webkit-transition: width 0.4s ease; -moz-transition: width 0.4s ease; -o-transition: width 0.4s ease; transition: width 0.4s ease;}.width-small .add-data-widget-layers .add-data-layerlist--container {width: 100%;}.add-data-widget-layers .add-data-layerlist--container h2 {margin: 0; padding: 7px 15px; border-bottom: 1px solid #ccc; color: #898989; font-size: 14px; font-weight: normal; line-height: 2;}.add-data-layerlist--list {width: 100%; padding: 10px 15px; line-height: 20px; position: absolute; top: 45px; bottom: 40px; overflow: auto;}.add-data-layerlist--listitem {margin-bottom: 5px;}.add-data-layerlist--listitem:after {content: ""; display: table; clear: both;}.add-data-layerlist--listitem .remove-button {float: right; padding: 5px 10px;}.add-data-layerlist--listitem .layer-name {display: block; padding-top: 5px;}.add-data-widget-layers .add-data-layerlist--footer {width: 100%; position: absolute; bottom: 0;}.add-data-widget-layers .back-button {float: right; text-transform: uppercase;}.add-data-widget-layers .back-button i {display: inline-block; margin-left: 5px;}.add-data-widget-layers .no-data-message {color: #898989; padding: 25px; text-align: center;}.add-data-widget-popup {padding: 0;}.add-data-widget-popup .dijitTooltipConnector {display: none;}.add-data-widget-popup .dijitTooltipContainer {padding: 10px; border-color: #ccc; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);}.add-data-widget-popup.dijitMenuPopup {-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);}.add-data-widget-popup .dijitMenu {border-color: #ccc;}.add-data-widget-popup .dijitMenu .dijitMenuItem td {padding: 10px 15px; border: 0;}.add-data-widget-popup .dijitMenu .dijitMenuItemHover td,.add-data-widget-popup .dijitMenu .dijitMenuItemActive td,.add-data-widget-popup .dijitMenu .dijitMenuItemSelected td {background-color: #f4f4f4; background-image: none;}.add-data-widget-popup .dijitMenu .dijitSelectSelectedOption td,.add-data-widget-popup .dijitMenu .dijitSelectSelectedOption.dijitMenuItemHover td,.add-data-widget-popup .dijitMenu .dijitSelectSelectedOption.dijitMenuItemSelected td {background-color: #196fa6; background-image: none; color: #fff; font-weight: normal;}.LaunchpadTheme .jimu-widget-add-data.jimu-widget {position: absolute;}.LaunchpadTheme .jimu-widget-add-data .search-pane .item-card h3.title {height: auto; width: auto; position: static;}.LaunchpadTheme .jimu-widget-add-data .dijitSelect.dijitSelectFocused .dijitArrowButton,.LaunchpadTheme .jimu-widget-add-data .dijitDropDownButton .dijitButtonNode.dijitSelectFocused .dijitArrowButton {padding: 5px;}.LaunchpadTheme .jimu-widget-add-data .dijitButton .dijitButtonNode,.LaunchpadTheme .jimu-widget-add-data .dijitDropDownButton .dijitButtonNode,.LaunchpadTheme .jimu-widget-add-data .dijitComboButton .dijitButtonNode,.LaunchpadTheme .jimu-widget-add-data .dijitToggleButton .dijitButtonNode {color: #196fa6; font-size: inherit; letter-spacing: 0;}.LaunchpadTheme .jimu-widget-add-data .dijitSelect,.LaunchpadTheme .jimu-widget-add-data .dijitButton .dijitButtonNode,.LaunchpadTheme .jimu-widget-add-data .dijitDropDownButton .dijitButtonNode,.LaunchpadTheme .jimu-widget-add-data .dijitComboButton .dijitButtonNode,.LaunchpadTheme .jimu-widget-add-data .dijitToggleButton .dijitButtonNode {background-color: transparent; border: 0;}.LaunchpadTheme .jimu-widget-add-data .secondary-pane .jimu-btn {background-color: #3b8fc4; border: 0;}.LaunchpadTheme .jimu-widget-add-data .secondary-pane .jimu-btn:hover {background-color: #2c6b93;}.DartTheme .jimu-widget-add-data .search-pane {background-color: transparent;}.DartTheme .jimu-widget-add-data .search-pane .search-bar {background-color: transparent;}.DartTheme .jimu-widget-add-data .search-pane .search-bar-secondary {background: #3a3a3a;}.DartTheme .jimu-widget-add-data .secondary-pane {background-color: transparent;}.DartTheme .jimu-widget-add-data .search-pane-content {background-color: #222;}.DartTheme .jimu-tab3 .tab-item-td.jimu-state-active {background: #4C4C4C;}.DartTheme .jimu-widget-add-data .search-pane .search-bar-separator,.DartTheme .jimu-widget-add-data .search-pane .search-pane-header {border-bottom: 1px solid #262626;}.DartTheme .jimu-widget-add-data .search-box2 .search-textbox {background: #393939; border: 0; -moz-border-radius: 2px; -webkit-border-radius: 2px; border-radius: 2px;}.DartTheme .jimu-widget-add-data.width-small .search-box2 .search-textbox {width: 100px;}.DartTheme .jimu-widget-add-data .search-box2 .btn {background: #393939; border: 0;}.DartTheme .jimu-widget-add-data .search-pane .item-card .item-card-inner {background: #4c4c4c; border-color: #787878;}.DartTheme .jimu-widget-add-data .search-pane .item-card h3.title {height: auto; width: auto; position: static;}.DartTheme .jimu-widget-add-data.width-medium .filter-wrapper.show,.DartTheme .jimu-widget-add-data.width-medium .btn-group.show,.DartTheme .jimu-widget-add-data.width-small .filter-wrapper.show,.DartTheme .jimu-widget-add-data.width-small .btn-group.show {background: #393939; border: 1px solid #7f8183; -webkit-box-shadow: 0 2px 3px rgba(0,0,0,0.15); -moz-box-shadow: 0 2px 3px rgba(0,0,0,0.15); box-shadow: 0 2px 3px rgba(0,0,0,0.15);}.DartTheme .jimu-widget-add-data.width-medium .btn-group.show .btn:hover,.DartTheme .jimu-widget-add-data.width-small .btn-group.show .btn:hover {background-color: #222;}.DartTheme .jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn.active,.DartTheme .jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn.active:active,.DartTheme .jimu-widget-add-data .search-pane .search-bar .btn-group \x3e .btn.active:hover {color: #f8f8f8 !important;}.DartTheme .jimu-widget-add-data .search-pane .search-sort-options label {color: #a7a7a7 !important;}.DartTheme .jimu-widget-add-data .secondary-pane {border-bottom: 0;}.DartTheme .jimu-widget-add-data .search-pane .item-card div.info {color: #ddd !important;}.DartTheme .jimu-widget-add-data .search-pane .item-card .action-bar a,.DartTheme .jimu-widget-add-data .add-url-pane .action-bar a,.DartTheme .jimu-widget-add-data .add-file-pane .file-form label {color: #15a4fa !important;}.DartTheme .jimu-widget-add-data .dijitDropDownButton .dijitButtonNode {padding: 7px;}.DartTheme .jimu-widget-add-data .dijitSelect {background-color: transparent; border: 0;}.DartTheme .jimu-widget-add-data .dijitSelect .dijitArrowButton {background-color: transparent; border: 0;}.DartTheme .jimu-widget-add-data.width-medium .scope-placeholder .dropdown-arrow,.DartTheme .jimu-widget-add-data.width-small .scope-placeholder .dropdown-arrow,.DartTheme .jimu-widget-add-data .dijitDropDownButton .dijitArrowButtonInner,.DartTheme .jimu-widget-add-data .dijitSelect .dijitArrowButton .dijitArrowButtonInner,.DartTheme .jimu-widget-add-data .dijitSelectHover .dijitArrowButton .dijitArrowButtonInner,.DartTheme .jimu-widget-add-data .dijitSelectFocused .dijitArrowButton .dijitArrowButtonInner {background-image: url("images/down-arrow_white.png");}.DartTheme .jimu-widget-add-data.width-medium .search-box-placeholder,.DartTheme .jimu-widget-add-data.width-medium .filter-placeholder,.DartTheme .jimu-widget-add-data.width-small .search-box-placeholder,.DartTheme .jimu-widget-add-data.width-small .filter-placeholder {background-image: url("images/search_white.png");}.DartTheme .jimu-widget-add-data.width-medium .filter-placeholder,.DartTheme .jimu-widget-add-data.width-small .filter-placeholder {background-image: url("images/menu_white.png");}.DartTheme .jimu-widget-add-data.width-medium .search-box-placeholder.opened,.DartTheme .jimu-widget-add-data.width-small .search-box-placeholder.opened {background-image: url("images/close_white.png");}.DartTheme.add-data-widget-popup .dijitTooltipContainer {color: #f8f8f8; background: #4c4c4c; border: 1px solid #7f8183; -webkit-box-shadow: 0 2px 3px rgba(0,0,0,0.15); -moz-box-shadow: 0 2px 3px rgba(0,0,0,0.15); box-shadow: 0 2px 3px rgba(0,0,0,0.15);}.DartTheme .add-data-widget-layers .add-data-layerlist--container {background-color: #4c4c4c;}.DartTheme .add-data-widget-layers .add-data-layerlist--container h2 {border-color: #262626;}.DartTheme .jimu-widget-add-data-footer,.DartTheme .add-data-widget-layers .add-data-layerlist--footer {background-color: transparent; border-top-color: #262626;}.DartTheme .jimu-widget-add-data .add-url-pane-container {background-color: transparent; border-color: transparent;}.DartTheme .jimu-widget-add-data .add-url-pane .action-bar a {padding-top: 0; padding-bottom: 0;}.DartTheme .jimu-widget-add-data .add-url-pane .action-bar .jimu-btn {min-width: 140px;}.DartTheme .jimu-widget-add-data .add-file-pane .drop-area {background: transparent; border-color: #ccc;}.DartTheme .jimu-widget-add-data.height-small .add-file-pane .drop-area {padding-left: 15px; padding-right: 15px;}.jimu-rtl .jimu-widget-add-data .search-pane .item-card {float: right;}.jimu-rtl .jimu-widget-add-data .search-pane .item-card .thumbnail {float: right; margin-left: 10px; margin-right: 0;}.jimu-rtl .jimu-widget-add-data .search-pane .search-bbox-option .checkbox-inline {padding-left: auto; padding-right: 38px; margin-right: auto; margin-left: 25px;}.jimu-rtl .jimu-widget-add-data .search-box2 {float: left;}.jimu-rtl .jimu-widget-add-data .search-box2 .btn {margin-left: auto; margin-right: -1px;}.jimu-rtl .jimu-widget-add-data .search-pane .search-sort-options .sort-order-icon {float: left;}.jimu-rtl .jimu-widget-add-data .search-box, .search-box-placeholder {float: left;}.jimu-rtl .jimu-widget-add-data .search-data-type-options {float: right;}.jimu-rtl .jimu-widget-add-data .filter-wrapper,.jimu-rtl .jimu-widget-add-data .filter-placeholder {float: left;}.jimu-rtl .jimu-widget-add-data .switch-toggle-group .checkbox-inline {padding-left: auto; padding-right: 36px;}.jimu-rtl .jimu-widget-add-data .switch-toggle-group .switch-toggle.dijitCheckBox {margin-left: auto; margin-right: -36px;}.jimu-rtl .jimu-widget-add-data .gp-panel \x3e .panel-heading .btn-icon {float: left;}.jimu-rtl .jimu-widget-add-data .panel-section .section-header [class^\x3d"esri-icon-"],.jimu-rtl .jimu-widget-add-data .panel-section .section-header [class*\x3d" esri-icon-"],.jimu-rtl .jimu-widget-add-data .panel-section .section-header .btn {float: left;}.jimu-rtl .jimu-widget-add-data .search-box,.jimu-rtl .jimu-widget-add-data .search-box-placeholder {float: left;}.jimu-rtl .jimu-widget-add-data .search-data-type-options {float: right;}.jimu-rtl .jimu-widget-add-data .filter-wrapper,.jimu-rtl .jimu-widget-add-data .filter-placeholder {float: left;}.jimu-widget-add-data .add-file-pane .or b {padding-left: 5px; padding-right: 0;}.jimu-rtl .jimu-widget-add-data .add-file-pane .drop-area a.drop-area-hint {left: 0; right: auto;}.jimu-rtl .add-data-widget-layers .add-data-layerlist--container {left: 0; right: auto;}.jimu-rtl .jimu-widget-add-data.layerlist-show .add-data-layerlist--container {-moz-animation: slide-from-left .4s; -webkit-animation: slide-from-left .4s; animation: slide-from-left .4s;}.jimu-rtl .add-data-layerlist--listitem .remove-button {float: left;}.jimu-rtl .add-data-widget-layers .back-button {float: left;}.jimu-rtl .add-data-widget-layers .back-button i {margin-left: 0; margin-right: 5px;}.jimu-rtl .add-data-widget-layers .back-button i.esri-icon-collapse:before {content: "\\e631";}.ar .esri-icon-question {-webkit-transform: rotateY(180deg); transform: rotateY(180deg); display: inline-block;}@-moz-keyframes updload-arrow-animation {0% {-moz-transform: translateY(0px);} 50% {-moz-transform: translateY(-10px);} 100% {-moz-transform: translateY(0px);}}@-webkit-keyframes updload-arrow-animation {0% {-webkit-transform: translateY(0px);} 50% {-webkit-transform: translateY(-10px);} 100% {-webkit-transform: translateY(0px);}}@keyframes updload-arrow-animation {0% {transform: translateY(0px);} 50% {transform: translateY(-10px);} 100% {transform: translateY(0px);}}@-moz-keyframes slide-from-right {0% {-moz-transform: translateX(50%); opacity: 0.5;} 100% {-moz-transform: translateX(0%); opacity: 1;}}@-webkit-keyframes slide-from-right {0% {-webkit-transform: translateX(50%); opacity: 0.5;} 100% {-webkit-transform: translateX(0%); opacity: 1;}}@keyframes slide-from-right {0% {transform: translateX(50%); opacity: 0.5;} 100% {transform: translateX(0%); opacity: 1;}}@-moz-keyframes slide-from-left {0% {-moz-transform: translateX(-50%); opacity: 0.5;} 100% {-moz-transform: translateX(0%); opacity: 1;}}@-webkit-keyframes slide-from-left {0% {-webkit-transform: translateX(-50%); opacity: 0.5;} 100% {-webkit-transform: translateX(0%); opacity: 1;}}@keyframes slide-from-left {0% {transform: translateX(-50%); opacity: 0.5;} 100% {transform: translateX(0%); opacity: 1;}}',
    "*now": function(p) {
      p([
        'dojo/i18n!*preload*widgets/AddData/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare dojo/_base/lang dojo/on dojo/aspect dojo/Deferred dojo/dom-class jimu/portalUrlUtils jimu/portalUtils jimu/tokenUtils jimu/BaseWidget jimu/dijit/TabContainer3 dijit/_WidgetsInTemplateMixin ./search/SearchContext ./search/util ./search/SearchPane ./search/AddFromUrlPane ./search/AddFromFilePane ./search/LayerListPane dojo/_base/array".split(
  " "
), function(p, h, q, l, d, u, b, r, t, z, E, y, H, B, F, C, G, v, g) {
  return p([z, y], {
    name: "AddData",
    baseClass: "jimu-widget-add-data",
    batchGeocoderServers: null,
    isPortal: !1,
    _isOpen: !1,
    _searchOnOpen: !1,
    tabContainer: null,
    searchPane: null,
    addFromUrlPane: null,
    addFromFilePane: null,
    postCreate: function() {
      this.inherited(arguments);
    },
    startup: function() {
      if (!this._started) {
        var b = this,
          d = arguments;
        this._getUser()
          .then(function(d) {
            b._checkConfig();
            b._initTabs();
            return b._initContext(d);
          })
          .then(function() {
            b.inherited(d);
            b.tabContainer
              ? b.tabContainer.startup()
              : b.searchPane
              ? b.searchPane.startup()
              : b.addFromUrlPane
              ? b.addFromUrlPane.startup()
              : b.addFromFilePane && b.addFromFilePane.startup();
            b._initFooter(b.tabContainer, {
              searchWidget: b.searchPane,
              addFromUrlWidget: b.addFromUrlPane,
              addFromFileWidget: b.addFromFilePane
            });
            b._initListeners();
            b.resize();
          })
          .otherwise(function(g) {
            console.warn("AddData.startup error:", g);
            b.inherited(d);
            b.resize();
          });
      }
    },
    _checkConfig: function() {
      this.config || (this.config = {});
      var b = function(b, d) {
          var e = b[d];
          e || (e = b[d] = { allow: !0, label: null });
          "boolean" !== typeof e.allow && (e.allow = !0);
          "Curated" !== d ||
            ("string" === typeof e.filter && 0 !== h.trim(e.filter).length) ||
            (e.allow = !1);
        },
        d = this.config;
      d.scopeOptions || (d.scopeOptions = {});
      var g = d.scopeOptions;
      b(g, "MyContent");
      b(g, "MyOrganization");
      b(g, "Curated");
      b(g, "ArcGISOnline");
      b(d, "addFromUrl");
      b(d, "addFromFile");
    },
    getSharingUrl: function() {
      var d = r.getPortal(this.appConfig.portalUrl);
      return b.getSharingUrl(d.portalUrl);
    },
    _getUser: function() {
      var b = new d(),
        g = this.appConfig.portalUrl;
      t.userHaveSignInPortal(g)
        ? r
            .getPortal(g)
            .getUser()
            .then(function(d) {
              b.resolve(d);
            })
            .otherwise(function(d) {
              console.warn("AddData._getUser error:", d);
              b.resolve(null);
            })
        : b.resolve(null);
      return b;
    },
    _initBatchGeocoder: function(b, d) {
      var h = !1,
        l = /(arcgis.com\/arcgis\/rest\/services\/world\/geocodeserver).*/gi,
        n = /(\/servers\/[\da-z\.-]+\/rest\/services\/world\/geocodeserver).*/gi,
        e = (b && b.helperServices && b.helperServices.geocode) || [],
        a,
        f,
        m = [];
      d &&
        d.privileges &&
        (h = -1 < g.indexOf(d.privileges, "premium:user:geocode"));
      g.forEach(e, function(c) {
        a = !!c.url.match(l);
        f = !!c.url.match(n);
        ((a && !b.isPortal && h) || f || c.batch) &&
          m.push({
            isWorldGeocodeServer: a || f,
            isWorldGeocodeServerProxy: f,
            label: c.name,
            value: c.url,
            url: c.url,
            name: c.name
          });
      });
      this.batchGeocoderServers = m;
    },
    _initContext: function(g) {
      var h = new d(),
        l = !0,
        n = B.checkMixedContent("http://www.arcgis.com"),
        p = this.config.scopeOptions,
        e = g && "string" === typeof g.username && 0 < g.username.length,
        a = new H(),
        f = r.getPortal(this.appConfig.portalUrl);
      this.isPortal = f.isPortal;
      a.portal = f;
      f.isPortal && (a.orgId = f.id);
      g &&
        "string" === typeof g.orgId &&
        0 < g.orgId.length &&
        (a.orgId = g.orgId);
      e ? (a.username = g.username) : (p.MyContent.allow = !1);
      this.searchPane &&
        ((this.searchPane.searchContext = a), (this.searchPane.portal = f));
      this._initBatchGeocoder(f, g);
      if (f.isPortal)
        try {
          var m = b.getSharingUrl(f.portalUrl) + "/kml",
            m = m.replace("/sharing/rest/kml", "/sharing/kml");
          window.esri.config.defaults.kmlService = m;
          window.esri.config.defaults.geoRSSService = m.replace("/kml", "/rss");
        } catch (K) {
          console.error(K);
        }
      var c = this.nls.search.loadError + n,
        k = p.ArcGISOnline;
      a.allowArcGISOnline = k.allow;
      if (f.isPortal && a.allowArcGISOnline) {
        var q = r.getPortal(n);
        q
          ? q.helperServices ||
            ((l = !1),
            q
              .loadSelfInfo()
              .then(function() {
                q.helperServices
                  ? (a.arcgisOnlinePortal = q)
                  : (console.warn(c),
                    (a.allowArcGISOnline = !1),
                    (k.allow = !1));
                h.resolve();
              })
              .otherwise(function(b) {
                a.allowArcGISOnline = !1;
                k.allow = !1;
                console.warn(c);
                console.warn(b);
                h.resolve();
              }))
          : (console.warn(c), (a.allowArcGISOnline = !1), (k.allow = !1));
      } else
        !e &&
          !f.isPortal &&
          p.MyOrganization.allow &&
          p.ArcGISOnline.allow &&
          (p.MyOrganization.allow = !1);
      l && h.resolve();
      return h;
    },
    _initFooter: function(b, d) {
      if (b) {
        var g = d.searchWidget,
          l = !1;
        g && g.footerNode && g.footerNode.nodeName && (l = !0);
        d = this.footerContainer = document.createElement("DIV");
        d.className = this.baseClass + "-footer";
        l && d.appendChild(g.footerNode);
        var n = document.createElement("A");
        n.className = "layerlist-button jimu-float-trailing";
        n.href = "#";
        n.innerHTML =
          "\x3cspan class\x3d'esri-icon-layers'\x3e\x3c/span\x3e" +
          this.nls.layerList.caption;
        this.own(
          q(
            n,
            "click",
            h.hitch(this, function(a) {
              a.preventDefault();
              this.showLayers();
            })
          )
        );
        d.appendChild(n);
        var e = (this.messageNode = document.createElement("SPAN"));
        e.className = "message";
        d.appendChild(e);
        b = b.containerNode || b.domNode || b;
        b.nodeName && b.appendChild(d);
        this.own(
          q(
            this.tabContainer,
            "tabChanged",
            h.hitch(this, function(a) {
              this._setStatus("");
              l &&
                (g.footerNode.style.display =
                  a === this.nls.tabs.search ? "" : "none");
              this.nls.tabs.search === a
                ? (l && (g.footerNode.style.display = ""),
                  (e.style.display = "none"))
                : (l && (g.footerNode.style.display = "none"),
                  (e.style.display = ""));
            })
          )
        );
      }
    },
    _initListeners: function() {
      var b = this;
      this.map &&
        this.own(
          this.map.on("extent-change", function() {
            try {
              b.searchPane &&
                b.searchPane.bboxOption.bboxToggle.get("checked") &&
                (b._isOpen ? b.searchPane.search() : (b._searchOnOpen = !0));
            } catch (A) {
              console.warn(A);
            }
          })
        );
    },
    _initTabs: function() {
      var b = this.config,
        d = [],
        g = !!(window.File && window.FileReader && window.FormData),
        h = !1,
        p = b.scopeOptions,
        e = function(a) {
          h || (p && p[a] && p[a].allow && (h = !0));
        };
      e("MyContent");
      e("MyOrganization");
      e("Curated");
      e("ArcGISOnline");
      h &&
        ((this.searchPane = new F({ wabWidget: this }, this.searchNode)),
        d.push({
          title: this.nls.tabs.search,
          content: this.searchPane.domNode
        }));
      b.addFromUrl &&
        b.addFromUrl.allow &&
        ((this.addFromUrlPane = new C({ wabWidget: this }, this.urlNode)),
        d.push({
          title: this.nls.tabs.url,
          content: this.addFromUrlPane.domNode
        }));
      g &&
        b.addFromFile &&
        b.addFromFile.allow &&
        ((this.addFromFilePane = new G({ wabWidget: this }, this.fileNode)),
        d.push({
          title: this.nls.tabs.file,
          content: this.addFromFilePane.domNode
        }));
      var a = this;
      if (0 < d.length) {
        this.tabContainer = new E({ average: !0, tabs: d }, this.tabsNode);
        try {
          1 === d.length &&
            this.tabContainer.controlNode &&
            this.tabContainer.containerNode &&
            ((this.tabContainer.controlNode.style.display = "none"),
            (this.tabContainer.containerNode.style.top = "0px"));
        } catch (f) {}
        this.own(
          l.after(
            this.tabContainer,
            "selectTab",
            function(b) {
              a.searchPane && b === a.nls.tabs.search && a.searchPane.resize();
            },
            !0
          )
        );
      } else
        0 === d.length &&
          this.tabsNode.appendChild(
            document.createTextNode(this.nls.noOptionsConfigured)
          );
    },
    _setStatus: function(b) {
      this.messageNode &&
        (B.setNodeText(this.messageNode, b), (this.messageNode.title = b));
    },
    onClose: function() {
      this._isOpen = !1;
    },
    onOpen: function() {
      var b = this.searchPane && this._searchOnOpen;
      this._isOpen = !0;
      this._searchOnOpen = !1;
      this.resize();
      b && this.searchPane.search();
    },
    resize: function() {
      var b = this.domNode.clientWidth,
        d = this.domNode.clientHeight;
      1e3 < b
        ? (u.remove(this.domNode, "width-768"),
          u.add(this.domNode, "width-1200"))
        : 768 < b
        ? (u.remove(this.domNode, "width-1200"),
          u.add(this.domNode, "width-768"))
        : u.remove(this.domNode, ["width-768", "width-1200"]);
      420 > b
        ? (u.remove(this.domNode, "width-medium"),
          u.add(this.domNode, "width-small"))
        : 750 > b
        ? (u.remove(this.domNode, "width-small"),
          u.add(this.domNode, "width-medium"))
        : u.remove(this.domNode, ["width-small", "width-medium"]);
      340 > b
        ? u.add(this.domNode, "filter-placeholder-on")
        : u.remove(this.domNode, "filter-placeholder-on");
      400 > d
        ? u.add(this.domNode, "height-small")
        : u.remove(this.domNode, "height-small");
      this.searchPane && this.searchPane.resize();
    },
    showLayers: function() {
      this.layerListPane ||
        ((this.layerListPane = new v({ wabWidget: this })),
        this.layerListPane.placeAt(this.domNode));
      this.layerListPane.show();
    }
  });
});
