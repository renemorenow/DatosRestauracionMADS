// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred dojo/DeferredList jimu/utils esri/request esri/geometry/webMercatorUtils esri/geometry/Polygon esri/geometry/Polyline jimu/portalUtils jimu/tokenUtils jimu/dijit/Message".split(
  " "
), function(t, d, l, g, m, u, p, v, w, x, y, q, r) {
  return t("Snapshot", null, {
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
    constructor: function(b, a) {
      this.map = a;
      this.appConfig = b;
      this._originAppId = b.appId;
      this._originMapId = a.itemId;
      this._mapItemInfo = a.itemInfo;
      this._portalUrl = b.portalUrl;
      this._portal = y.getPortal(this._portalUrl);
      this._baseUrl = this._portalUrl + "sharing/rest/";
      this.nls = d.mixin({}, window.jimuNls.drawBox, window.jimuNls.snapshot);
    },
    createSnapShot: function(b) {
      this.ids = [];
      this.layerArray = [];
      this.time = this._getDateString(Date.now());
      this.name =
        (b.appendTimeStamp && b.name ? b.name + "_" + this.time : b.name) ||
        this._mapItemInfo.item.title + "_" + this.time;
      this.extent = b.mapExtent || this.map.extent;
      this.logo = b.logo || this.appConfig.logo;
      this.mapName = b.mapTitle || this.name;
      this.shareWith = b.shareWith || { everyone: !1, org: !1, groups: "" };
      var a = b.folderOptions;
      a.name = b.folderOptions.name || this.name;
      a.title = b.folderOptions.title || this.name;
      a.description = b.folderOptions.description || this.name;
      b = b.data.reverse();
      return this._createSnapshot(a, b);
    },
    _createSnapshot: function(b, a) {
      var c = new g();
      this._portal
        .getUser()
        .then(d.hitch(this, this._processUser), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._createFolder, b), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._createItems, a), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._addLayers), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._createMap, this._mapItemInfo), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._processMap), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._shareItems), function(a) {
          c.reject(a);
        })
        .then(d.hitch(this, this._showMessage), function(a) {
          c.reject(a);
        })
        .then(function() {
          c.resolve();
        });
      return c;
    },
    _processUser: function(b) {
      var a = new g();
      this.user = b;
      this.groups = b.groups;
      a.resolve();
      return a;
    },
    _createFolder: function(b) {
      var a = new g();
      b = {
        url:
          this._baseUrl +
          "content/users/" +
          this.user.username +
          "/createFolder",
        content: d.mixin({ f: "json" }, b),
        handleAs: "json",
        callbackParamName: "callback"
      };
      this._isValidCredential() && (b.content.token = this._credential.token);
      p(b, { usePost: !0 }).then(
        d.hitch(this, function(b) {
          b.success
            ? ((this.folder = b.folder) &&
                this.folder.id &&
                this.ids.push(this.folder.id),
              a.resolve(b.folder))
            : (console.log(b), a.reject(b));
        }),
        d.hitch(this, function(b) {
          a.reject(b);
        })
      );
      return a;
    },
    _createItems: function(b) {
      var a = new g(),
        c = [];
      l.forEach(
        b,
        d.hitch(this, function(a) {
          a.graphics &&
            0 < a.graphics.length &&
            c.push(this._createLayerItem(a));
        })
      );
      var h = [];
      new m(c).then(
        d.hitch(this, function(b) {
          for (var c = 0; c < b.length; c++) h.push(b[c][1]);
          a.resolve(h);
        }),
        d.hitch(this, function(b) {
          a.reject(b);
        })
      );
      return a;
    },
    _addLayers: function(b) {
      for (var a = new g(), c = [], h = 0; h < b.length; h++)
        c.push(this.user.addItem(b[h], this.folder.id));
      var e = [];
      new m(c).then(
        d.hitch(this, function(b) {
          for (var c = 0; c < b.length; c++) {
            var d = b[c][1];
            d.success && (e.push(d.id), this.ids.push(d.id));
          }
          a.resolve(e);
        }),
        d.hitch(this, function(b) {
          a.reject(b);
        })
      );
      return a;
    },
    _createMap: function(b, a) {
      for (
        var c = b.itemData, d = this.name, e = [], k = 0;
        k < c.baseMap.baseMapLayers.length;
        k++
      ) {
        var f = c.baseMap.baseMapLayers[k];
        e.push({
          id: f.id,
          layerType: f.layerType,
          url: f.url,
          visibility: f.visibility,
          opacity: f.opacity,
          title: f.title,
          styleUrl: f.styleUrl,
          itemId: f.itemId
        });
      }
      c = { baseMapLayers: e };
      e = [];
      for (k = 0; k < this.layerArray.length; k++)
        (f = this.layerArray[k]),
          e.push({
            id: f.layer.id,
            layerType: "ArcGISFeatureLayer",
            visibility: f.layer.visible,
            opacity: f.layer.opacity,
            title: f.label,
            type: "Feature Collection",
            itemId: a[k]
          });
      a = v.webMercatorToGeographic(this.extent);
      b = {
        title: d,
        type: "Web Map",
        item: d,
        extent: a.xmin + "," + a.ymin + "," + a.xmax + "," + a.ymax,
        text: JSON.stringify({
          operationalLayers: e,
          baseMap: c,
          spatialReference: this.map.spatialReference,
          version:
            b && b.itemData && b.itemData.version ? b.itemData.version : "2.4"
        }),
        tags: this.name + "," + this.nls.snapshot_append,
        wabType: "HTML"
      };
      return this.user.addItem(b, this.folder.id);
    },
    _processMap: function(b) {
      var a = new g();
      b.id && this.ids.push(b.id);
      b.success ? a.resolve(b.id) : a.reject("fail");
      return a;
    },
    _shareItems: function(b) {
      var a = new g(),
        c = {
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
      this._isValidCredential() && (c.content.token = this._credential.token);
      p(c, { usePost: !0 }).then(
        d.hitch(this, function(c) {
          c.results && 0 < c.results.length
            ? a.resolve(
                this._portalUrl + "home/webmap/viewer.html?webmap\x3d" + b
              )
            : a.reject("fail");
        }),
        d.hitch(this, function(b) {
          a.reject(b);
        })
      );
      return a;
    },
    _validateGroupItemControl: function(b) {
      var a = b.split(",");
      return (
        0 <
        this.groups.filter(function(b) {
          var c = b.capabilities || [];
          return -1 < a.indexOf(b.id) && -1 < c.indexOf("updateitemcontrol");
        }).length
      );
    },
    _showMessage: function(b) {
      var a = new g();
      "fail" === b
        ? (new r({ message: this.nls.snapshot_failed }), a.reject(b))
        : (new r({
            message:
              '\x3ca href\x3d"' +
              b +
              '" target\x3d"_blank"\x3e' +
              this.nls.snapshot_complete +
              "\x3c/a\x3e"
          }),
          a.resolve("success"));
      return a;
    },
    _getDateString: function(b) {
      b = new Date(b);
      var a = b.getTimezoneOffset();
      return (
        u.fieldFormatter.getFormattedDate(b, {
          dateFormat: "shortDateShortTime"
        }) +
        " " +
        this.nls.utc +
        (0 > a ? "+" + Math.abs(a) / 60 : "-" + a / 60)
      );
    },
    _checkCredential: function() {
      var b = q.isValidCredential(this._credential);
      b || this._clearCredential();
      return b;
    },
    _isValidCredential: function() {
      this._updateCredential();
      return this._checkCredential();
    },
    _updateCredential: function() {
      this._checkCredential() ||
        (this._credential = q.getPortalCredential(this._portalUrl));
    },
    _clearCredential: function() {
      this._credential = null;
    },
    _createLayerItem: function(b) {
      var a = new g();
      b = this._createLayer(
        b.graphics,
        d.mixin({}, { description: b.name, name: b.name, tags: [b.name] }, b)
      );
      a.resolve(b);
      return a;
    },
    _createLayer: function(b, a) {
      var c = this.nls,
        d = this.time,
        e = b[0],
        k = {
          point: "esriGeometryPoint",
          polyline: "esriGeometryPolyline",
          polygon: "esriGeometryPolygon"
        }["undefined" !== typeof e.geometry ? e.geometry.type : e.type],
        e = e.symbol ? e.symbol.toJson() : "",
        f = [],
        g = [
          { name: "ObjectID", alias: "ObjectID", type: "esriFieldTypeOID" },
          {
            name: c.snapshot_append,
            alias: c.snapshot_append,
            type: "esriFieldTypeString"
          }
        ];
      a.fields &&
        0 < a.fields.length &&
        l.forEach(a.fields, function(a) {
          g.push({
            name: a.name,
            alias: a.alias,
            type: a.type,
            domain: a.domain
          });
        });
      var m = 0;
      l.forEach(b, function(b) {
        var e;
        switch (k) {
          case "esriGeometryPolyline":
            e = b.geometry.paths;
            break;
          case "esriGeometryPolygon":
            e = b.geometry.rings;
            break;
          case "esriGeometryPoint":
            e = [b.geometry];
        }
        var g = 0,
          h;
        l.forEach(e, function(e) {
          switch (k) {
            case "esriGeometryPolyline":
              h = new x(e);
              h.spatialReference = b.geometry.spatialReference;
              break;
            case "esriGeometryPolygon":
              h = new w(e);
              h.spatialReference = b.geometry.spatialReference;
              break;
            case "esriGeometryPoint":
              h = e;
          }
          var n = { attributes: { ObjectID: m + g }, geometry: h };
          n.attributes[c.snapshot_append] = d;
          a.fields &&
            0 < a.fields.length &&
            l.forEach(a.fields, function(a) {
              n.attributes[a.name] = b.attributes[a.name];
            });
          f.push(n);
          g += 1;
        });
        m += 1;
      });
      b = {
        xmin: this.extent.xmin,
        ymin: this.extent.ymin,
        xmax: this.extent.xmax,
        ymax: this.extent.ymax,
        spatialReference: this.extent.spatialReference
      };
      e =
        a.renderer && a.renderer.toJson
          ? a.renderer.toJson()
          : a.renderer
          ? JSON.stringify(a.renderer)
          : { type: "simple", label: "", description: "", symbol: e };
      this.layerArray.push({
        layer: {
          id: a.name,
          label: a.name,
          opacity: 1,
          visible: a.visibleOnStartup
        },
        label: a.name
      });
      return {
        title: a.name,
        type: "Feature Collection",
        tags: a.tags,
        description: a.description,
        extent: b,
        name: a.name,
        text: JSON.stringify({
          layers: [
            {
              layerDefinition: {
                name: a.name,
                geometryType: k,
                objectIdField: "ObjectID",
                typeIdField: a.typeIdField,
                types: a.types,
                type: "Feature Layer",
                extent: b,
                drawingInfo: { renderer: e },
                fields: g,
                minScale: a.minScale,
                maxScale: a.maxScale
              },
              popupInfo:
                a.infoTemplate && a.infoTemplate.info
                  ? a.infoTemplate.info
                  : a.infoTemplate
                  ? a.infoTemplate
                  : void 0,
              featureSet: { features: f, geometryType: k }
            }
          ]
        }),
        f: "json"
      };
    }
  });
});
