// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "widgets/Query/TaskSetting": function() {
      define("dojo/_base/declare dijit/_WidgetBase jimu/dijit/BindLabelPropsMixin dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/Evented dojo/text!./TaskSetting.html dojo/on dojo/keys dojo/Deferred dojo/_base/lang dojo/_base/html dojo/_base/array dojo/promise/all jimu/filterUtils jimu/dijit/FilterParameters ./utils jimu/utils ./SingleQueryLoader ./SpatialFilterByDrawing jimu/dijit/SpatialFilterByFeatures esri/tasks/query jimu/dijit/formSelect".split(
        " "
      ), function(
        k,
        l,
        q,
        n,
        f,
        e,
        g,
        h,
        t,
        c,
        b,
        a,
        d,
        m,
        w,
        u,
        y,
        A,
        x,
        D,
        E,
        z
      ) {
        return k([l, q, n, f, e], {
          baseClass: "query-task-setting",
          templateString: g,
          askForValues: !1,
          _defaultRelationship: "SPATIAL_REL_INTERSECTS",
          nls: null,
          map: null,
          currentAttrs: null,
          layerInfosObj: null,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.isRenderIdForAttrs = !0;
            this.nls.back = window.jimuNls.common.back;
          },
          postCreate: function() {
            this.inherited(arguments);
            this._initSelf();
          },
          run: function() {
            var a = this._getCleanClonedCurrentAttrs(this.currentAttrs);
            a.query.relationship = this._getRestRelationship();
            var d = this.getWhere(),
              c = this.getGeometry();
            m([d, c]).then(
              b.hitch(this, function(b) {
                this.deactivate();
                a.query.where = b[0];
                a.query.geometry = b[1];
                if ("function" === typeof this.onApply) this.onApply(a);
              }),
              b.hitch(this, function(a) {
                console.error(a);
              })
            );
          },
          hideTempLayers: function() {
            this.spatialFilterByDrawing &&
              this.spatialFilterByDrawing.hideTempLayers();
            this.spatialFilterByFeatures &&
              this.spatialFilterByFeatures.hideTempLayers();
          },
          showTempLayers: function() {
            this.spatialFilterByDrawing &&
              this.spatialFilterByDrawing.showTempLayers();
            this.spatialFilterByFeatures &&
              this.spatialFilterByFeatures.showTempLayers();
          },
          _getCleanClonedCurrentAttrs: function(a) {
            var d = x.getCleanCurrentAttrsTemplate(),
              m = null,
              c;
            for (c in a)
              "queryTr" !== c &&
                "query" !== c &&
                "layerObject" !== c &&
                ((m = a[c]), (d[c] = b.clone(m)));
            d.queryTr = a.queryTr;
            d.query.maxRecordCount = a.query.maxRecordCount;
            return d;
          },
          onGetQueryResponse: function() {
            this.deactivate();
            this._tryResetSpatialFilterByDrawing();
            this._tryResetSpatialFilterByFeatures();
          },
          getWhere: function() {
            var a = new c(),
              b = this._getWhereInfo();
            if (1 === b.status) {
              var d = this.currentAttrs.config.webMapLayerId;
              if (d) {
                var m = null,
                  m = y.isTable(this.currentAttrs.layerInfo)
                    ? this.layerInfosObj.getTableInfoById(d)
                    : this.layerInfosObj.getLayerInfoById(d),
                  d = "";
                m && (d = m.getFilter());
                m = b.where;
                d && (m = "(" + d + ") AND (" + b.where + ")");
                a.resolve(m);
              } else a.resolve(b.where);
            } else a.reject("Can't get a valid sql");
            return a;
          },
          _getWhereInfo: function() {
            var a = { status: 0, where: "" };
            if (this.askForValues) {
              var b = this.filterParams.getFilterExpr();
              b && "string" === typeof b
                ? ((a.status = 1), (a.where = b))
                : ((a.status = -1), (a.where = null));
            } else
              (a.status = 1), (a.where = this.currentAttrs.config.filter.expr);
            1 !== a.status || a.where || (a.where = "1\x3d1");
            return a;
          },
          _updateExecuteButtonStatus: function() {
            var b =
              this._isValidWhereToExecute() &&
              this._isValidGeometryToExecute() &&
              this._isValidLayerNameToExecute();
            b
              ? a.removeClass(this.btnExecute, "disabled")
              : a.addClass(this.btnExecute, "disabled");
            return b;
          },
          _isValidWhereToExecute: function() {
            return 0 < this._getWhereInfo().status;
          },
          _isValidLayerNameToExecute: function() {
            return this.layerNameTextBox.get("value");
          },
          _isValidGeometryToExecute: function() {
            var a = this.spatialTypeSelect.get("value");
            if ("currentMapExtent" !== a) {
              if ("drawing" === a)
                return !!this.spatialFilterByDrawing.getGeometryInfo().geometry;
              if ("useFeatures" === a)
                return this.spatialFilterByFeatures.isValidSearchDistance();
            }
            return !0;
          },
          getGeometry: function() {
            var a = new c(),
              d = this.spatialTypeSelect.get("value");
            "currentMapExtent" === d
              ? a.resolve(this.map.extent)
              : "drawing" === d
              ? ((d = this.spatialFilterByDrawing.getGeometryInfo()),
                0 > d.status
                  ? a.reject("Invalid search distance")
                  : (0 === d.status &&
                      console.log("User doesn't draw anything"),
                    a.resolve(d.geometry)))
              : "useFeatures" === d
              ? this.spatialFilterByFeatures.getGeometryInfo().then(
                  b.hitch(this, function(b) {
                    -2 === b.status
                      ? a.reject("Invalid search distance")
                      : (-1 === b.status
                          ? console.log("User doesn't select a layer")
                          : 0 === b.status &&
                            console.log("User doesn't select any features"),
                        a.resolve(b.geometry));
                  }),
                  b.hitch(this, function(b) {
                    a.reject(b);
                  })
                )
              : a.resolve(null);
            return a;
          },
          deactivate: function() {
            this.spatialFilterByDrawing &&
              this.spatialFilterByDrawing.deactivate();
            this.spatialFilterByFeatures &&
              this.spatialFilterByFeatures.deactivate();
          },
          clearAllGraphics: function() {
            this.spatialFilterByDrawing &&
              this.spatialFilterByDrawing.clearAllGraphics();
            this.spatialFilterByFeatures &&
              this.spatialFilterByFeatures.clearAllGraphics();
          },
          canAutoRunning: function() {
            return (
              this._canAttributeFilterAutoRunning() &&
              this._canSpatialFilterAutoRunning()
            );
          },
          _canAttributeFilterAutoRunning: function() {
            return 0 < this._getWhereInfo().status && !this.askForValues;
          },
          _canSpatialFilterAutoRunning: function() {
            var a = this.spatialTypeSelect.getOptions() || [];
            return 0 === a.length
              ? !0
              : 1 === a.length
              ? ((a = this.spatialTypeSelect.get("value")),
                "drawing" !== a && "useFeatures" !== a)
              : !1;
          },
          _initSelf: function() {
            var m = this.currentAttrs.config,
              c = this.currentAttrs.layerInfo,
              e = this.currentAttrs.layerObject || c,
              f = m.name || "",
              f = A.sanitizeHTML(f);
            this.taskNameDiv.innerHTML = f;
            this.taskNameDiv.title = this.taskNameDiv.innerHTML;
            m.customResultName
              ? this._showLayerNameContainer()
              : this._hideLayerNameContainer();
            if (this.showFilterLabel) {
              var g = this.criteiraLabel || "",
                g = A.sanitizeHTML(g);
              this.criteiraLabelDiv.innerHTML = g;
              this.criteiraLabelDiv.title = this.criteiraLabelDiv.innerHTML;
              g = this.spatialFilterLabel || "";
              g = A.sanitizeHTML(g);
              this.spatialFilterLabelDiv.innerHTML = g;
              this.spatialFilterLabelDiv.title = this.spatialFilterLabelDiv.innerHTML;
              this._showCriteiraLabelDiv();
              this._showSpatialFilterLabelDiv();
            } else
              (this.criteiraLabelDiv.innerHTML = ""),
                (this.criteiraLabelDiv.title = ""),
                (this.spatialFilterLabelDiv.innerHTML = ""),
                (this.spatialFilterLabelDiv.title = ""),
                this._hideCriteiraLabelDiv(),
                this._hideSpatialFilterLabelDiv();
            this.filterParams = new u();
            this.filterParams.placeAt(this.sqlDiv, "before");
            var p = { ifDisplaySQL: !0 };
            this.own(
              h(
                this.filterParams,
                "change",
                b.hitch(this, this._updateExecuteButtonStatus)
              )
            );
            this.own(
              h(
                this.filterParams,
                "enter",
                b.hitch(this, this._onBtnApplyClicked)
              )
            );
            g = b.clone(m.filter);
            g.wId = "widgets_Query_Widget" + this.wId + "_" + this.id;
            this.filterParams.build(m.url, e, g, m.webMapLayerId);
            e = new w();
            g = this.currentAttrs.config.filter;
            this.askForValues = e.isAskForValues(g);
            var r = !0,
              e = !1;
            if (this.askForValues) {
              r = !0;
              g.displaySQL
                ? (this.sqlDiv.innerHTML = g.displaySQL)
                : g.expr && (this.sqlDiv.innerHTML = g.expr);
              if ((g = this.filterParams.getFilterExpr(p)))
                this.sqlDiv.innerHTML = g;
              this.own(
                h(
                  this.filterParams,
                  "change",
                  b.hitch(this, function() {
                    this.sqlDiv.innerHTML = "";
                    var a = this.filterParams.getFilterExpr(p);
                    a &&
                      this.currentAttrs.config.showSQL &&
                      (this.sqlDiv.innerHTML = a);
                  })
                )
              );
            } else
              this.currentAttrs.config.showSQL
                ? (r = "1\x3d1" !== g.expr)
                : ((r = !1), (e = "1\x3d1" === g.expr)),
                (this.sqlDiv.innerHTML = g.displaySQL ? g.displaySQL : g.expr);
            this.currentAttrs.config.showSQL
              ? a.removeClass(this.sqlDiv, "not-visible")
              : ((this.sqlDiv.innerHTML = ""),
                a.addClass(this.sqlDiv, "not-visible"));
            r
              ? (a.removeClass(this.attributesSectionDiv, "not-visible"),
                ((this.showFilterLabel &&
                  "" !== this.criteiraLabelDiv.innerHTML) ||
                  this.currentAttrs.config.showSQL) &&
                  a.setAttr(this.attributesSectionDiv, "tabindex", "0"))
              : a.addClass(this.attributesSectionDiv, "not-visible");
            g = this.currentAttrs.config.spatialFilter;
            r = null;
            g || (g = {});
            y.isTable(c) && (g = {});
            g.currentMapExtent &&
              ((r = {
                value: "currentMapExtent",
                label: this.nls.useCurrentExtentTip
              }),
              this.spatialTypeSelect.addOption(r),
              g.currentMapExtent["default"] &&
                this.spatialTypeSelect.set("value", r.value));
            g.drawing &&
              ((r = { value: "drawing", label: this.nls.useDrawGraphicTip }),
              this.spatialTypeSelect.addOption(r),
              g.drawing["default"] &&
                this.spatialTypeSelect.set("value", r.value),
              (r = g.drawing.buffer),
              (this.spatialFilterByDrawing = new D({
                drawBoxOption: {
                  map: this.map,
                  geoTypes: g.drawing.geometryTypes
                },
                nls: this.nls,
                enableBuffer: !!r,
                distance: b.getObject("defaultDistance", !1, r) || 0,
                unit: b.getObject("defaultUnit", !1, r) || ""
              })),
              this.own(
                h(
                  this.spatialFilterByDrawing,
                  "change",
                  b.hitch(this, this._updateExecuteButtonStatus)
                )
              ),
              this.spatialFilterByDrawing.placeAt(this.drawingSection));
            if (g.useFeatures) {
              r = { value: "useFeatures", label: this.nls.useFeaturesTip };
              this.spatialTypeSelect.addOption(r);
              g.useFeatures["default"] &&
                this.spatialTypeSelect.set("value", r.value);
              var r = g.useFeatures.buffer,
                F = [];
              m.webMapLayerId && F.push(m.webMapLayerId);
              this.spatialFilterByFeatures = new E({
                map: this.map,
                nls: this.nls,
                enableBuffer: !!r,
                distance: b.getObject("defaultDistance", !1, r) || 0,
                unit: b.getObject("defaultUnit", !1, r) || "",
                showLoading: !1,
                ignoredFeaturelayerIds: F
              });
              this.spatialFilterByFeatures.tipNode &&
                a.setStyle(
                  this.spatialFilterByFeatures.tipNode,
                  "display",
                  "block"
                );
              this.spatialFilterByFeatures.placeAt(this.featuresSection);
              this.own(
                h(
                  this.spatialFilterByFeatures,
                  "loading",
                  b.hitch(this, function() {
                    this.domNode && this.shelter.show();
                  })
                )
              );
              this.own(
                h(
                  this.spatialFilterByFeatures,
                  "unloading",
                  b.hitch(this, function() {
                    this.domNode && this.shelter.hide();
                  })
                )
              );
              this.own(
                h(
                  this.spatialFilterByFeatures,
                  "search-distance-change",
                  b.hitch(this, this._updateExecuteButtonStatus)
                )
              );
              (m = g.useFeatures.relationships) && 0 < m.length
                ? d.forEach(
                    m,
                    b.hitch(this, function(a) {
                      this.relationshipSelect.addOption({
                        value: a.relationship,
                        label: a.label
                      });
                    })
                  )
                : this.relationshipSelect.addOption({
                    value: this._defaultRelationship,
                    label: this._defaultRelationship
                  });
            }
            g.fullLayerExtent &&
              ((r = {
                value: "fullLayerExtent",
                label: this.nls.noSpatialLimitTip
              }),
              this.spatialTypeSelect.addOption(r),
              g.fullLayerExtent["default"] &&
                this.spatialTypeSelect.set("value", r.value));
            m = !0;
            g = this.spatialTypeSelect.getOptions() || [];
            0 === g.length
              ? ((m = !1),
                (this.spatialFilterTip.innerHTML = this.nls.noSpatialLimitTip))
              : 1 === g.length
              ? ((m = "fullLayerExtent" !== g[0].value),
                (this.spatialFilterTip.innerHTML = g[0].label),
                a.addClass(this.spatialTypeSelect.domNode, "not-visible"),
                a.setAttr(this.spatialSectionDiv, "tabindex", "0"))
              : (m = !0);
            y.isTable(c) && (m = !1);
            m
              ? a.removeClass(this.spatialSectionDiv, "not-visible")
              : a.addClass(this.spatialSectionDiv, "not-visible");
            this._onSpatialTypeSelectChanged();
            e && !m && a.removeClass(this.noFilterTip, "not-visible");
            c = this._getBestQueryName(f);
            this.layerNameTextBox.set("value", c);
          },
          getQueryResultName: function() {
            return this.layerNameTextBox.get("value");
          },
          _getConstantRelationship: function() {
            var a = this._defaultRelationship;
            "useFeatures" === this.spatialTypeSelect.get("value") &&
              (a = this.relationshipSelect.get("value"));
            return a;
          },
          _getRestRelationship: function() {
            var a = this._getConstantRelationship();
            return z[a];
          },
          _onSpatialTypeSelectChanged: function() {
            var b = this.spatialTypeSelect.get("value");
            "drawing" === b
              ? a.setStyle(this.drawingSection, "display", "block")
              : (a.setStyle(this.drawingSection, "display", "none"),
                this._tryResetSpatialFilterByDrawing());
            "useFeatures" === b
              ? a.setStyle(this.featuresSection, "display", "block")
              : (a.setStyle(this.featuresSection, "display", "none"),
                this._tryResetSpatialFilterByFeatures());
            this.spatialTypeSelect.domNode.title = "";
            b &&
              (b = this.spatialTypeSelect.getOptions(b)) &&
              (this.spatialTypeSelect.domNode.title = b.label);
            this._updateExecuteButtonStatus();
          },
          _tryResetSpatialFilterByDrawing: function() {
            this.spatialFilterByDrawing && this.spatialFilterByDrawing.reset();
          },
          _tryResetSpatialFilterByFeatures: function() {
            this.spatialFilterByFeatures &&
              this.spatialFilterByFeatures.reset();
          },
          _onBtnParamsBackClicked: function() {
            this._tryResetSpatialFilterByDrawing();
            this._tryResetSpatialFilterByFeatures();
            if ("function" === typeof this.onBack) this.onBack();
          },
          _onBtnParamsBackKeydown: function(a) {
            (a.keyCode !== t.ENTER && a.keyCode !== t.SPACE) ||
              this._onBtnParamsBackClicked();
          },
          _getBestQueryName: function(a) {
            for (
              var m = (a = a
                  ? a + (" _" + this.nls.queryResult)
                  : a + this.nls.queryResult),
                c = d.map(
                  this.map.graphicsLayerIds,
                  b.hitch(this, function(a) {
                    return this.map.getLayer(a).name;
                  })
                ),
                e = 2;
              0 <= d.indexOf(c, m);

            )
              (m = a + "_" + e), e++;
            return m;
          },
          _onLayerNameTextChanged: function() {
            this._updateExecuteButtonStatus();
          },
          _onBtnApplyClicked: function() {
            this._updateExecuteButtonStatus() && this.run();
          },
          _onBtnApplyKeydown: function(a) {
            (a.keyCode !== t.ENTER && a.keyCode !== t.SPACE) ||
              this._onBtnApplyClicked();
          },
          _showLayerNameContainer: function() {
            a.setStyle(this.layerNameContainer, "display", "block");
          },
          _hideLayerNameContainer: function() {
            a.setStyle(this.layerNameContainer, "display", "none");
          },
          _showCriteiraLabelDiv: function() {
            a.setStyle(this.criteiraLabelDiv, "display", "block");
          },
          _hideCriteiraLabelDiv: function() {
            a.setStyle(this.criteiraLabelDiv, "display", "none");
          },
          _showSpatialFilterLabelDiv: function() {
            a.setStyle(this.spatialFilterLabelDiv, "display", "block");
          },
          _hideSpatialFilterLabelDiv: function() {
            a.setStyle(this.spatialFilterLabelDiv, "display", "none");
          }
        });
      });
    },
    "widgets/Query/utils": function() {
      define("dojo/_base/lang dojo/_base/array dojo/_base/Deferred jimu/utils jimu/portalUrlUtils jimu/LayerInfos/LayerInfos esri/request esri/kernel esri/symbols/PictureMarkerSymbol esri/symbols/jsonUtils".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c) {
        return {
          getDefaultPopupInfo: function(b, a, d) {
            var m = {
              title: "",
              fieldInfos: [],
              description: null,
              showAttachments: !1,
              mediaInfos: []
            };
            d = !!d;
            if (b.displayField) {
              var c = this._getRealFieldName(b.displayField, b);
              m.title = "{" + c + "}";
            } else if ((c = n.getObjectIdField(b))) m.title = "{" + c + "}";
            m.showAttachments = !!b.hasAttachments;
            c = b = b.fields;
            a ||
              (c = l.filter(
                b,
                k.hitch(this, function(a) {
                  return "esriFieldTypeGeometry" !== a.type;
                })
              ));
            a = l.map(
              c,
              k.hitch(this, function(a) {
                a = n.getDefaultPortalFieldInfo(a);
                a.visible = d;
                return a;
              })
            );
            m.fieldInfos = a;
            return m;
          },
          _getRealFieldName: function(b, a) {
            b = b.toUpperCase();
            if (a.fields && 0 < a.fields.length)
              for (var d = 0; d < a.fields.length; d++)
                if (a.fields[d].name.toUpperCase() === b)
                  return a.fields[d].name;
            return "";
          },
          getPortalFieldInfosWithoutShape: function(b, a) {
            return l.filter(
              a,
              k.hitch(this, function(a) {
                return (a = n.getFieldInfoByFieldName(b.fields, a.fieldName))
                  ? "esriFieldTypeGeometry" !== a.type
                  : !0;
              })
            );
          },
          getPopupInfoByAttributes: function(b, a) {
            var d = this.getDefaultPopupInfo(b, !1),
              m = [],
              c = {},
              e;
            for (e in a) {
              m.push(e);
              var g = n.getFieldInfoByFieldName(b.fields, e).type;
              if ("esriFieldTypeSingle" === g || "esriFieldTypeDouble" === g)
                (g = a[e]),
                  null !== g &&
                    void 0 !== g &&
                    ((g = parseFloat(g)),
                    isNaN(g) ||
                      ((g = g.toString().split(".")),
                      2 === g.length && (c[e] = g[1].length)));
            }
            d.fieldInfos = l.filter(
              d.fieldInfos,
              k.hitch(this, function(a) {
                var b = a.fieldName;
                c.hasOwnProperty(b) && (a.format.places = c[b]);
                return m.indexOf(b);
              })
            );
            return d;
          },
          upgradePopupToPopupInfo: function(b, a) {
            var d = this.getDefaultPopupInfo(b, !1, !1);
            d.title = a.title || "";
            d.title = d.title.replace("${", "{");
            if (a.fields) {
              var m = {};
              l.forEach(
                a.fields,
                k.hitch(this, function(a) {
                  m[a.name] = a;
                })
              );
              l.forEach(
                d.fieldInfos,
                k.hitch(this, function(a) {
                  var b = a.fieldName,
                    c = m[b];
                  c &&
                    ((a.label = c.alias || a.label),
                    (a.visible = !0),
                    "image" === c.specialType &&
                      ((b = "{" + b + "}"),
                      d.mediaInfos.push({
                        title: "",
                        type: "image",
                        caption: a.label,
                        value: { sourceURL: b, linkURL: b }
                      })));
                })
              );
            }
            return d;
          },
          isImageServiceLayer: function(b) {
            return b.url && -1 < b.url.indexOf("/ImageServer");
          },
          isTable: function(b) {
            return "Table" === b.type;
          },
          getConfigWithValidDataSource: function(b) {
            b = k.clone(b);
            var a = e.getInstanceSync();
            b.queries = l.filter(
              b.queries,
              k.hitch(this, function(b) {
                return (b = b.webMapLayerId)
                  ? a.getLayerInfoById(b)
                    ? !0
                    : !!a.getTableInfoById(b)
                  : !0;
              })
            );
            return b;
          },
          removePopupInfoUnsupportFields: function(b, a) {
            var d = l.map(
              b.fields,
              k.hitch(this, function(a) {
                return a.name;
              })
            );
            a.fieldInfos &&
              0 < a.fieldInfos.length &&
              (a.fieldInfos = l.filter(
                a.fieldInfos,
                k.hitch(this, function(a) {
                  return 0 <= d.indexOf(a.fieldName);
                })
              ));
          },
          overridePopupTemplateMethodGetAttachments: function(b, a, d) {
            b.getAttachments = function(b) {
              var c = new q();
              try {
                var m = b.attributes[d],
                  e = a + "/" + m + "/attachments";
                b = {
                  url: e,
                  content: { f: "json" },
                  callbackParamName: "callback"
                };
                var f = "",
                  k = h.id.findCredential(a);
                k && k.token && (f = "?token\x3d" + k.token);
                g(b).then(
                  function(a) {
                    a = a.attachmentInfos;
                    l.forEach(a, function(a) {
                      a.url = e + "/" + a.id + f;
                      a.objectId = m;
                    });
                    c.resolve(a);
                  },
                  function(a) {
                    c.reject(a);
                  }
                );
              } catch (D) {
                console.error(D);
              }
              return c;
            };
          },
          isServiceSupportsOrderBy: function(b) {
            var a = !1;
            b.advancedQueryCapabilities &&
              b.advancedQueryCapabilities.supportsOrderBy &&
              (a = !0);
            return a;
          },
          isServiceSupportsPagination: function(b) {
            var a = !1;
            b.advancedQueryCapabilities &&
              b.advancedQueryCapabilities.supportsPagination &&
              (a = !0);
            return a;
          },
          isSupportObjectIds: function(b) {
            var a = 0,
              d = n.getObjectIdField(b);
            b.currentVersion && (a = parseFloat(b.currentVersion));
            return !!d && (10 <= a || b.hasOwnProperty("typeIdField"));
          },
          getQueryType: function(b) {
            var a = -1;
            return (a =
              this.isServiceSupportsOrderBy(b) &&
              this.isServiceSupportsPagination(b)
                ? 1
                : this.isSupportObjectIds(b)
                ? 2
                : 3);
          },
          getWebMapPopupInfoByUrl: function(b, a) {
            var d = null;
            a = a.replace(/\/*$/g, "");
            var c = f.removeProtocol(a);
            l.some(
              b.operationalLayers,
              k.hitch(this, function(a) {
                if (a && a.url) {
                  var b = f.removeProtocol(a.url.replace(/\/*$/g, ""));
                  if (a.popupInfo) {
                    if (b === c) return (d = a.popupInfo), !0;
                  } else if (a.layers && 0 < a.layers.length)
                    return l.some(
                      a.layers,
                      k.hitch(this, function(m) {
                        return b + "/" + m.id === c
                          ? ((d = a.popupInfo), !0)
                          : !1;
                      })
                    );
                }
                return !1;
              })
            );
            return d;
          },
          getPopupInfoForRelatedLayer: function(b, a, d) {
            (b = this.getWebMapPopupInfoByUrl(b, a)) ||
              (b = this.getDefaultPopupInfo(d, !1, !0));
            !b.title &&
              (d = n.getObjectIdField(d)) &&
              (b.title = "{" + d + "}");
            return b;
          },
          dynamicUpdateConfigIcon: function(b, a) {
            a = window.location.protocol + "//" + window.location.hostname + a;
            b.icon && "object" === typeof b.icon
              ? (b.icon = c.fromJson(b.icon))
              : "string" === typeof b.icon &&
                ((a = new t({
                  yoffset: 16,
                  type: "picturemarkersymbol",
                  url: b.icon ? b.icon : a,
                  width: 24,
                  height: 24,
                  size: 16,
                  xoffset: 0
                })),
                (b.icon = a));
          },
          tryGetLayerObject: function(b) {
            var a = new q();
            if (!b) return a.resolve(), a;
            b = this._tryGetLayerInfo(b);
            if (!b) return console.error("Invalid data source"), a.resolve(), a;
            b.getLayerObject().then(
              function(b) {
                a.resolve(b);
              }.bind(this),
              function(b) {
                a.reject(b);
              }
            );
            return a;
          },
          _tryGetLayerInfo: function(b) {
            var a = e.getInstanceSync(),
              d = a.getLayerInfoById(b);
            d || (d = a.getTableInfoById(b));
            return d;
          }
        };
      });
    },
    "widgets/Query/SingleQueryLoader": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred jimu/utils esri/tasks/query esri/tasks/QueryTask esri/layers/FeatureLayer".split(
        " "
      ), function(k, l, q, n, f, e, g, h) {
        function t() {
          return {
            queryTr: null,
            config: null,
            layerInfo: null,
            relationshipLayerInfos: null,
            relationshipPopupTemplates: null,
            queryType: -1,
            query: {
              maxRecordCount: 1e3,
              resultLayer: null,
              where: "",
              geometry: null,
              relationship: null,
              nextIndex: 0,
              foundedNum: 0,
              allCount: 0,
              objectIds: []
            }
          };
        }
        k = k(null, {
          tempResultLayer: null,
          map: null,
          currentAttrs: null,
          constructor: function(c, b) {
            this.map = c;
            this.currentAttrs = b;
            0 < this.currentAttrs.layerInfo.maxRecordCount &&
              (this.currentAttrs.query.maxRecordCount = this.currentAttrs.layerInfo.maxRecordCount);
          },
          resetCurrentAttrs: function() {
            this.currentAttrs = t();
          },
          getCurrentAttrs: function() {
            return this.currentAttrs;
          },
          executeQueryForFirstTime: function() {
            var c = null,
              c = this.currentAttrs.query.where,
              b = this.currentAttrs.query.geometry;
            return (c =
              1 === this.currentAttrs.queryType
                ? this.doQuery_SupportOrderByAndPagination(c, b)
                : 2 === this.currentAttrs.queryType
                ? this.doQuery_SupportObjectIds(c, b)
                : this.doQuery_NotSupportObjectIds(c, b));
          },
          executeQueryWhenScrollToBottom: function() {
            var c = null;
            1 === this.currentAttrs.queryType
              ? (c = this.onResultsScroll_SupportOrderByAndPagination())
              : 2 === this.currentAttrs.queryType &&
                (c = this.onResultsScroll_SupportObjectIds());
            return c;
          },
          _isServiceSupportsOrderBy: function(c) {
            var b = !1;
            c.advancedQueryCapabilities &&
              c.advancedQueryCapabilities.supportsOrderBy &&
              (b = !0);
            return b;
          },
          _isServiceSupportsPagination: function(c) {
            var b = !1;
            c.advancedQueryCapabilities &&
              c.advancedQueryCapabilities.supportsPagination &&
              (b = !0);
            return b;
          },
          _tryLocaleNumber: function(c) {
            var b = f.localizeNumber(c);
            if (null === b || void 0 === b) b = c;
            return b;
          },
          _tryLocaleDate: function(c) {
            var b = f.localizeDate(c);
            b || (b = c.toLocaleDateString());
            return b;
          },
          _getLayerIndexByLayerUrl: function(c) {
            var b = c.lastIndexOf("/");
            c = c.slice(b + 1, c.length);
            return parseInt(c, 10);
          },
          _getServiceUrlByLayerUrl: function(c) {
            var b = c.lastIndexOf("/");
            return c.slice(0, b);
          },
          _isSupportObjectIds: function(c) {
            var b = 0;
            c.currentVersion && (b = parseFloat(c.currentVersion));
            return 10 <= b || c.hasOwnProperty("typeIdField");
          },
          _isImageServiceLayer: function(c) {
            return -1 < c.indexOf("/ImageServer");
          },
          _isTable: function(c) {
            return "Table" === c.type;
          },
          _getBestQueryName: function(c) {
            for (
              var b = (c = c
                  ? c + (" _" + this.nls.queryResult)
                  : c + this.nls.queryResult),
                a = q.map(
                  this.map.graphicsLayerIds,
                  l.hitch(this, function(a) {
                    return this.map.getLayer(a).name;
                  })
                ),
                d = 2;
              0 <= q.indexOf(a, b);

            )
              (b = c + "_" + d), d++;
            return b;
          },
          getObjectIdsForAllRelatedRecordsAction: function() {
            var c = new n();
            if (
              this.currentAttrs.query.objectIds &&
              0 < this.currentAttrs.query.objectIds.length
            )
              c.resolve(this.currentAttrs.query.objectIds);
            else if (1 === this.currentAttrs.queryType)
              c = this._queryIds(
                this.currentAttrs.query.where,
                this.currentAttrs.query.geometry,
                this.currentAttrs.query.relationship
              );
            else if (3 === this.currentAttrs.queryType) {
              var b = this.currentAttrs.config.objectIdField,
                a = q.map(
                  this.currentAttrs.query.resultLayer.graphics,
                  l.hitch(this, function(a) {
                    return parseInt(a.attributes[b], 10);
                  })
                );
              c.resolve(a);
            }
            return c;
          },
          doQuery_SupportOrderByAndPagination: function(c, b) {
            var a = new n(),
              d = l.hitch(this, function(b) {
                console.error(b);
                a.reject(b);
              }),
              m = this.currentAttrs.query.relationship;
            this._queryCount(c, b, m).then(
              l.hitch(this, function(g) {
                this.currentAttrs.query.allCount = g;
                if (0 === g) a.resolve([]);
                else {
                  this.currentAttrs.query.nextIndex = 0;
                  this.currentAttrs.query.foundedNum = 0;
                  var e = this.currentAttrs.query.maxRecordCount;
                  this._queryWithPaginationAndOrder(c, b, 0, e, m).then(
                    l.hitch(this, function(b) {
                      b = b.features;
                      this.currentAttrs.query.nextIndex += e;
                      this.currentAttrs.query.foundedNum += b.length;
                      a.resolve(b);
                    }),
                    d
                  );
                }
              }),
              d
            );
            return a;
          },
          onResultsScroll_SupportOrderByAndPagination: function() {
            var c = new n(),
              b = this.currentAttrs.query.nextIndex;
            if (
              this.currentAttrs.query.foundedNum >=
              this.currentAttrs.query.allCount
            )
              return c.resolve([]), c;
            var a = l.hitch(this, function(a) {
                console.error(a);
                c.reject(a);
              }),
              d = this.currentAttrs.query.maxRecordCount;
            this._queryWithPaginationAndOrder(
              this.currentAttrs.query.where,
              this.currentAttrs.query.geometry,
              b,
              d,
              this.currentAttrs.query.relationship
            ).then(
              l.hitch(this, function(a) {
                a = a.features;
                this.currentAttrs.query.nextIndex += d;
                this.currentAttrs.query.foundedNum += a.length;
                c.resolve(a);
              }),
              a
            );
            return c;
          },
          doQuery_SupportObjectIds: function(c, b) {
            var a = new n(),
              d = l.hitch(this, function(b) {
                console.error(b);
                a.reject(b);
              }),
              m = this.currentAttrs.query.relationship;
            this._queryIds(c, b, m).then(
              l.hitch(this, function(b) {
                if (b && 0 < b.length) {
                  var c = (this.currentAttrs.query.allCount = b.length);
                  this.currentAttrs.query.objectIds = b;
                  this.currentAttrs.query.nextIndex = 0;
                  this.currentAttrs.query.foundedNum = 0;
                  var g = this.currentAttrs.query.maxRecordCount,
                    e = [],
                    e = c > g ? b.slice(0, g) : b;
                  this._queryByObjectIds(e, !0, m).then(
                    l.hitch(this, function(b) {
                      b = b.features;
                      this.currentAttrs.query.nextIndex += e.length;
                      this.currentAttrs.query.foundedNum += b.length;
                      a.resolve(b);
                    }),
                    l.hitch(this, function(a) {
                      d(a);
                    })
                  );
                } else (this.currentAttrs.query.allCount = 0), a.resolve([]);
              }),
              d
            );
            return a;
          },
          onResultsScroll_SupportObjectIds: function() {
            var c = new n(),
              b = this.currentAttrs.query.objectIds,
              a = this.currentAttrs.query.nextIndex;
            if (
              this.currentAttrs.query.foundedNum >=
              this.currentAttrs.query.allCount
            )
              c.resolve([]);
            else {
              var d = b.slice(
                a,
                a +
                  Math.min(b.length - a, this.currentAttrs.query.maxRecordCount)
              );
              if (0 === d.length) c.resolve([]);
              else
                return (
                  this._queryByObjectIds(
                    d,
                    !0,
                    this.currentAttrs.query.relationship
                  ).then(
                    l.hitch(this, function(a) {
                      a = a.features;
                      this.currentAttrs.query.nextIndex += d.length;
                      this.currentAttrs.query.foundedNum += a.length;
                      c.resolve(a);
                    }),
                    l.hitch(this, function(a) {
                      c.reject(a);
                    })
                  ),
                  c
                );
            }
          },
          doQuery_NotSupportObjectIds: function(c, b) {
            var a = new n();
            this._query(c, b, !0, this.currentAttrs.query.relationship).then(
              l.hitch(this, function(b) {
                b = b.features;
                this.currentAttrs.query.allCount = b.length;
                a.resolve(b);
              }),
              l.hitch(this, function(b) {
                console.error(b);
                a.reject(b);
              })
            );
            return a;
          },
          getOutputFields: function() {
            var c = [];
            q.forEach(
              this.currentAttrs.layerInfo.fields,
              l.hitch(this, function(b) {
                b &&
                  b.name &&
                  "esriFieldTypeGeometry" !== b.type &&
                  c.push(b.name);
              })
            );
            return c;
          },
          _getObjectIdField: function() {
            return this.currentAttrs.config.objectIdField;
          },
          _getRequiredFieldNames: function() {
            var c = l.clone(this.currentAttrs.layerInfo);
            return new h({
              layerDefinition: c,
              featureSet: null
            }).getOutFields();
          },
          _getPopupInfoFieldNames: function() {
            var c = [],
              b = [],
              a = q.filter(
                this.currentAttrs.layerInfo.fields,
                l.hitch(this, function(a) {
                  return "esriFieldTypeGeometry" !== a.type;
                })
              ),
              d = this.currentAttrs.config.popupInfo,
              b = b.concat(this._getPlaceholderFieldNames(a, d.title));
            d.description
              ? (b = b.concat(this._getPlaceholderFieldNames(a, d.description)))
              : d.fieldInfos &&
                0 < d.fieldInfos.length &&
                q.forEach(
                  d.fieldInfos,
                  l.hitch(this, function(a) {
                    a.visible && b.push(a.fieldName);
                  })
                );
            d.mediaInfos &&
              0 < d.mediaInfos.length &&
              q.forEach(
                d.mediaInfos,
                l.hitch(this, function(d) {
                  b = b.concat(this._getPlaceholderFieldNames(a, d.title));
                  b = b.concat(this._getPlaceholderFieldNames(a, d.caption));
                  if ((d = d.value)) {
                    var c = d.fields;
                    c &&
                      0 < c.length &&
                      q.forEach(
                        c,
                        l.hitch(this, function(a) {
                          b.push(a);
                        })
                      );
                    d.normalizeField && b.push(d.normalizeField);
                    d.tooltipField && b.push(d.tooltipField);
                    d.sourceURL &&
                      (b = b.concat(
                        this._getPlaceholderFieldNames(a, d.sourceURL)
                      ));
                    d.linkURL &&
                      (b = b.concat(
                        this._getPlaceholderFieldNames(a, d.linkURL)
                      ));
                  }
                })
              );
            q.forEach(
              b,
              l.hitch(this, function(a) {
                0 > c.indexOf(a) && c.push(a);
              })
            );
            return c;
          },
          _getPlaceholderFieldNames: function(c, b) {
            var a = [];
            if (b) {
              var d = [];
              q.forEach(
                c,
                l.hitch(this, function(a) {
                  a = a.name;
                  0 <= b.indexOf("{" + a + "}") && d.push(a);
                })
              );
              q.forEach(
                d,
                l.hitch(this, function(b) {
                  0 > a.indexOf(b) && a.push(b);
                })
              );
            }
            return a;
          },
          _query: function(c, b, a, d) {
            var f = new e();
            f.where = c;
            b && (f.geometry = b);
            f.outSpatialReference = this.map.spatialReference;
            f.returnGeometry = !!a;
            f.spatialRelationship = d;
            f.outFields = this.getOutputFields();
            return new g(this.currentAttrs.config.url).execute(f);
          },
          _queryIds: function(c, b, a) {
            var d = new e();
            d.where = c;
            b && (d.geometry = b);
            d.returnGeometry = !1;
            d.spatialRelationship = a;
            d.outSpatialReference = this.map.spatialReference;
            return new g(this.currentAttrs.config.url).executeForIds(d);
          },
          _queryByObjectIds: function(c, b, a) {
            var d = new n(),
              f = new e();
            f.returnGeometry = !!b;
            f.outSpatialReference = this.map.spatialReference;
            f.outFields = this.getOutputFields();
            f.objectIds = c;
            f.spatialRelationship = a;
            new g(this.currentAttrs.config.url).execute(f).then(
              l.hitch(this, function(a) {
                d.resolve(a);
              }),
              l.hitch(this, function(e) {
                if (400 === e.code) {
                  var g = this._getObjectIdField(),
                    f = "",
                    m = c.length;
                  q.forEach(
                    c,
                    l.hitch(this, function(a, b) {
                      f += g + " \x3d " + a;
                      b !== m - 1 && (f += " OR ");
                    })
                  );
                  this._query(f, null, b, a).then(
                    l.hitch(this, function(a) {
                      d.resolve(a);
                    }),
                    l.hitch(this, function(a) {
                      d.reject(a);
                    })
                  );
                } else d.reject(e);
              })
            );
            return d;
          },
          _queryCount: function(c, b, a) {
            var d = new e();
            d.where = c;
            b && (d.geometry = b);
            d.returnGeometry = !1;
            d.outSpatialReference = this.map.spatialReference;
            d.spatialRelationship = a;
            return new g(this.currentAttrs.config.url).executeForCount(d);
          },
          _queryWithPaginationAndOrder: function(c, b, a, d, f) {
            var m = new e();
            m.where = c;
            b && (m.geometry = b);
            m.outSpatialReference = this.map.spatialReference;
            m.returnGeometry = !0;
            m.spatialRelationship = f;
            m.outFields = this.getOutputFields();
            m.start = a;
            m.num = d;
            (c = this.currentAttrs.config.orderByFields) &&
              0 < c.length &&
              ((m.orderByFields = c),
              (c = q.map(
                c,
                l.hitch(this, function(a) {
                  return a.split(" ")[0];
                })
              )),
              q.forEach(
                c,
                l.hitch(this, function(a) {
                  0 > m.outFields.indexOf(a) && m.outFields.push(a);
                })
              ));
            return new g(this.currentAttrs.config.url).execute(m);
          }
        });
        k.getCleanCurrentAttrsTemplate = t;
        return k;
      });
    },
    "widgets/Query/SpatialFilterByDrawing": function() {
      define("dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/on dojo/Evented dojo/_base/html dojo/_base/lang jimu/symbolUtils jimu/dijit/DrawBox jimu/dijit/SearchDistance esri/graphic esri/symbols/jsonUtils esri/layers/GraphicsLayer esri/renderers/SimpleRenderer esri/geometry/geometryEngine".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b, a, d, m, w, u) {
        return k([l, q, n, e], {
          baseClass: "jimu-query-spatial-filter-drawing",
          templateString:
            '\x3cdiv\x3e\x3cdiv data-dojo-attach-point\x3d"drawBoxDiv"\x3e\x3c/div\x3e\x3cdiv style\x3d"margin-top: 15px;" data-dojo-attach-point\x3d"clearShapeCbx"data-dojo-props\x3d"checked:true" data-dojo-type\x3d"jimu/dijit/CheckBox"\x3e\x3c/div\x3e\x3cdiv class\x3d"search-distance-div" data-dojo-attach-point\x3d"searchDistanceDiv"\x3e\x3c/div\x3e\x3c/div\x3e',
          map: null,
          bufferLayer: null,
          drawBoxOption: null,
          nls: null,
          enableBuffer: !0,
          distance: 0,
          unit: "",
          postCreate: function() {
            this.inherited(arguments);
            this.clearShapeCbx.setLabel(this.nls.clearShapeTip);
            this.map = this.drawBoxOption.map;
            this.bufferLayer = new m();
            var a = d.fromJson({
                style: "esriSFSSolid",
                color: [79, 129, 189, 77],
                type: "esriSFS",
                outline: {
                  style: "esriSLSSolid",
                  color: [54, 93, 141, 255],
                  width: 1.5,
                  type: "esriSLS"
                }
              }),
              e = new w(a);
            this.bufferLayer.setRenderer(e);
            this.map.addLayer(this.bufferLayer);
            this.drawBoxOption.showClear = !0;
            this.drawBoxOption.keepOneGraphic = !0;
            this.drawBox = new c(this.drawBoxOption);
            this.drawBox.setPolygonSymbol(a);
            a = t.getGreyPinMarkerSymbol();
            this.drawBox.setPointSymbol(a);
            this.drawBox.setLineSymbol(
              d.fromJson({
                color: [79, 129, 189, 255],
                width: 1.5,
                type: "esriSLS",
                style: "esriSLSDash"
              })
            );
            this.drawBox.placeAt(this.drawBoxDiv);
            this.own(
              f(this.drawBox, "user-clear", h.hitch(this, this._onDrawBoxClear))
            );
            this.own(
              f(this.drawBox, "draw-end", h.hitch(this, this._onDrawEnd))
            );
            this.drawBox.btnClear
              ? g.removeClass(this.drawBox.btnClear, "jimu-float-trailing")
              : g.addClass(this.drawBox.btnClear, "jimu-float-leading");
            this.searchDistance = new b({
              distance: this.distance,
              unit: this.unit
            });
            this.searchDistance.placeAt(this.searchDistanceDiv);
            this.enableBuffer
              ? (this.searchDistance.enable(),
                this.own(
                  f(
                    this.searchDistance,
                    "change",
                    h.hitch(this, this._onSearchDistanceChange)
                  )
                ))
              : (this.searchDistance.disable(),
                g.setStyle(this.searchDistanceDiv, "display", "none"));
          },
          reset: function(a) {
            this.clearShapeCbx.getValue() &&
              (this.drawBox.reset(), this.clearAllGraphics());
            a &&
              (this.searchDistance.reset(),
              this.searchDistance.setDistance(this.distance),
              this.searchDistance.setUnit(this.unit));
          },
          clearAllGraphics: function() {
            this.drawBox.clear();
            this._clearBufferLayer();
          },
          hideTempLayers: function() {
            this.bufferLayer && this.bufferLayer.hide();
            this.drawBox && this.drawBox.hideLayer();
          },
          showTempLayers: function() {
            this.bufferLayer && this.bufferLayer.show();
            this.drawBox && this.drawBox.showLayer();
          },
          deactivate: function() {
            this.drawBox && this.drawBox.deactivate();
          },
          isValidSearchDistance: function() {
            return 0 <= this._getStatusOfSearchDistance();
          },
          getGeometryInfo: function() {
            var a = { status: 0, geometry: null },
              b = this._getStatusOfSearchDistance();
            0 > b
              ? ((a.status = -1),
                (a.geometry = null),
                this.searchDistance.tryShowValidationError())
              : 0 === b
              ? ((a.geometry = this._getGeometryFromDrawBox()),
                (a.status = a.geometry ? 1 : 0))
              : 0 < b &&
                (0 < this.bufferLayer.graphics.length &&
                  (a.geometry = this.bufferLayer.graphics[0].geometry),
                (a.status = a.geometry ? 1 : 0));
            return a;
          },
          _getGeometryFromDrawBox: function() {
            var a = null,
              b = this.drawBox.getFirstGraphic();
            b && (a = b.geometry);
            return a;
          },
          _getGeometryFromBufferLayer: function() {
            var a = null;
            0 < this.bufferLayer.graphics.length &&
              (a = this.bufferLayer.graphics[0].geometry);
            return a;
          },
          _getStatusOfSearchDistance: function() {
            return this.searchDistance.getStatus();
          },
          _onSearchDistanceChange: function() {
            this._updateBuffer();
          },
          _onDrawBoxClear: function() {
            this._clearBufferLayer();
          },
          _onDrawEnd: function() {
            this._updateBuffer();
          },
          _clearBufferLayer: function() {
            this.bufferLayer && this.bufferLayer.clear();
            this.emit("change");
          },
          _updateBuffer: function() {
            this._clearBufferLayer();
            if (0 < this._getStatusOfSearchDistance()) {
              var b = this._getGeometryFromDrawBox();
              if (b) {
                var d = this.searchDistance.getData(),
                  b = u.simplify(b),
                  c = b.spatialReference,
                  e = null,
                  e =
                    c.isWebMercator() || 4326 === c.wkid
                      ? u.geodesicBuffer(b, d.distance, d.bufferUnit, !0)
                      : u.buffer(b, d.distance, d.bufferUnit, !0),
                  b = new a(e);
                this.bufferLayer.add(b);
              }
            }
            this.emit("change");
          },
          destroy: function() {
            this.bufferLayer && this.map.removeLayer(this.bufferLayer);
            this.bufferLayer = null;
            this.inherited(arguments);
          }
        });
      });
    },
    "jimu/dijit/SearchDistance": function() {
      define("dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/SearchDistance.html dojo/Evented dojo/_base/lang jimu/utils jimu/dijit/CheckBox esri/tasks/GeometryService jimu/dijit/formSelect dijit/form/NumberTextBox".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c) {
        return k([l, q, n, e], {
          baseClass: "jimu-dijit-searchdistance",
          templateString: f,
          lastMeters: 0,
          tip: "",
          distance: 0,
          unit: "",
          postMixInProperties: function() {
            this.inherited(arguments);
            this.nls = g.clone(window.jimuNls.units);
            this.tip ||
              (this.tip = window.jimuNls.searchDistance.applySearchDistance);
          },
          postCreate: function() {
            this.inherited(arguments);
            this.cbx = new t({
              label: this.tip,
              onChange: g.hitch(this, this._onCbxChanged)
            });
            this.cbx.placeAt(this.cbxDiv);
            this.reset();
            this.setDistance(this.distance);
            this.setUnit(this.unit);
            this.lastMeters = this.getMeters();
          },
          enable: function() {
            this.cbx.check();
          },
          disable: function() {
            this.cbx.uncheck();
          },
          isEnabled: function() {
            return this.cbx.getValue();
          },
          reset: function() {
            this.numberTextBox.set("value", 0);
            this.unitSelect.set("value", "MILES");
          },
          getData: function() {
            return {
              status: this.getStatus(),
              isEnabled: this.isEnabled(),
              distance: this.getDistance(),
              unit: this.getUnit(),
              bufferUnit: this.getUnitToBuffer(),
              meters: this.getMeters()
            };
          },
          getStatus: function() {
            var b;
            this.isEnabled()
              ? ((b = this.getDistance()), (b = 0 < b ? 1 : 0 === b ? 0 : -1))
              : (b = 0);
            return b;
          },
          getMeters: function() {
            var b = 0,
              a = this.getStatus();
            if (0 < a) {
              var a = this.getDistance(),
                d = this.getUnit();
              "MILES" === d
                ? (b = 1609.344 * a)
                : "KILOMETERS" === d
                ? (b = 1e3 * a)
                : "FEET" === d
                ? (b = 0.3048 * a)
                : "METERS" === d
                ? (b = a)
                : "YARDS" === d
                ? (b = 0.9144 * a)
                : "NAUTICAL_MILES" === d && (b = 1852 * a);
              b = parseFloat(b.toFixed(3));
            } else 0 === a ? (b = 0) : 0 > a && (b = -1);
            return b;
          },
          setDistance: function(b) {
            "number" === typeof b &&
              0 <= b &&
              this.numberTextBox.set("value", b);
          },
          setUnit: function(b) {
            b && "string" === typeof b && this.unitSelect.set("value", b);
          },
          tryShowValidationError: function() {
            this.numberTextBox.validate() ||
              h.showValidationErrorTipForFormDijit(this.numberTextBox);
          },
          getDistance: function() {
            return this.numberTextBox.validate()
              ? this.numberTextBox.get("value")
              : (h.showValidationErrorTipForFormDijit(this.numberTextBox), -1);
          },
          getUnit: function() {
            return this.unitSelect.get("value");
          },
          getUnitToBuffer: function() {
            var b = "";
            switch (this.unitSelect.get("value")) {
              case "MILES":
                b = c.UNIT_STATUTE_MILE;
                break;
              case "KILOMETERS":
                b = c.UNIT_KILOMETER;
                break;
              case "FEET":
                b = c.UNIT_FOOT;
                break;
              case "METERS":
                b = c.UNIT_METER;
                break;
              case "YARDS":
                b = c.UNIT_INTERNATIONAL_YARD;
                break;
              case "NAUTICAL_MILES":
                b = c.UNIT_NAUTICAL_MILE;
            }
            return b;
          },
          _onCbxChanged: function() {
            this.cbx.getValue()
              ? (this.numberTextBox.set("disabled", !1),
                this.unitSelect.set("disabled", !1))
              : (this.numberTextBox.set("disabled", !0),
                this.unitSelect.set("disabled", !0));
            this._emitEvent();
          },
          _onNumberTextBoxChanged: function() {
            this._emitEvent();
          },
          _onUnitSelectChanged: function() {
            this._emitEvent();
          },
          _emitEvent: function() {
            var b = this.getData();
            b.meters !== this.lastMeters &&
              ((this.lastMeters = b.meters), this.emit("change", b));
          }
        });
      });
    },
    "jimu/dijit/SpatialFilterByFeatures": function() {
      define("dojo/_base/array dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/SpatialFilterByFeatures.html dojo/on dojo/Evented dojo/Deferred dojo/_base/html dojo/_base/lang jimu/utils jimu/Query jimu/dijit/CheckBox jimu/dijit/FeaturelayerChooserFromMap jimu/dijit/LayerChooserFromMapWithDropbox jimu/dijit/SearchDistance jimu/LayerInfos/LayerInfos esri/graphic esri/tasks/query esri/symbols/jsonUtils esri/layers/GraphicsLayer esri/renderers/SimpleRenderer esri/geometry/geometryEngine jimu/dijit/FeatureSetChooserForSingleLayer".split(
        " "
      ), function(
        k,
        l,
        q,
        n,
        f,
        e,
        g,
        h,
        t,
        c,
        b,
        a,
        d,
        m,
        w,
        u,
        y,
        A,
        x,
        D,
        E,
        z,
        H,
        C,
        J
      ) {
        l = l([q, n, f, h], {
          baseClass: "jimu-dijit-spatial-filter-features",
          templateString: e,
          _bufferLayer: null,
          _defaultRelationship: "SPATIAL_REL_INTERSECTS",
          drawBox: null,
          selectionRadio: null,
          _selectionHandle: null,
          layerInfosObj: null,
          _layerAllFeaturesCache: null,
          map: null,
          types: null,
          enableBuffer: !1,
          distance: 0,
          unit: "",
          showLoading: !1,
          ignoredFeaturelayerIds: null,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.nls = window.jimuNls.spatialFilterByFeatures;
            this.ignoredFeaturelayerIds || (this.ignoredFeaturelayerIds = []);
            this._layerAllFeaturesCache = {};
          },
          postCreate: function() {
            this.inherited(arguments);
            this.selectionRadio = new m({ label: this.nls.selectedFeatures });
            this.selectionRadio.placeAt(this.selectionOptionDiv);
            this.selectionRadio.setStatus(!1);
            this.own(
              g(
                this.selectionRadio,
                "change",
                b.hitch(this, this._onRadioChanged)
              )
            );
            c.setStyle(this.domNode, "position", "relative");
            var a = E.fromJson({
                style: "esriSFSSolid",
                color: [79, 129, 189, 77],
                type: "esriSFS",
                outline: {
                  style: "esriSLSSolid",
                  color: [54, 93, 141, 255],
                  width: 1.5,
                  type: "esriSLS"
                }
              }),
              a = new H(a);
            this._bufferLayer = new z();
            this._bufferLayer.setRenderer(a);
            this.map.addLayer(this._bufferLayer);
            a = new w({
              createMapResponse: this.map.webMapResponse,
              types: this.types,
              showLayerFromFeatureSet: !0,
              onlyShowVisible: !1,
              updateWhenLayerInfosIsShowInMapChanged: !0,
              ignoredFeaturelayerIds: this.ignoredFeaturelayerIds
            });
            this.layerChooserFromMapWithDropbox = new u({
              label: this.nls.relatedLayer,
              layerChooser: a
            });
            this.layerChooserFromMapWithDropbox.placeAt(this.layerSelectDiv);
            this.own(
              g(
                this.layerChooserFromMapWithDropbox,
                "selection-change",
                b.hitch(this, this._onLayerChanged)
              )
            );
            this.layerInfosObj = A.getInstanceSync();
            this.own(
              g(
                this.layerInfosObj,
                "layerInfosIsShowInMapChanged",
                b.hitch(this, this._onLayerInfosIsShowInMapChanged)
              )
            );
            this.searchDistance = new y({
              tip: window.jimuNls.searchDistance.applySearchDistanceToFeatures,
              distance: this.distance,
              unit: this.unit
            });
            this.searchDistance.placeAt(this.searchDistanceDiv);
            this.enableBuffer
              ? (this.searchDistance.enable(),
                this.own(
                  g(
                    this.searchDistance,
                    "change",
                    b.hitch(this, this._onSearchDistanceChange)
                  )
                ))
              : (this.searchDistance.disable(),
                c.setStyle(this.searchDistanceDiv, "display", "none"));
            this._onLayerChanged();
          },
          reset: function(a) {
            a &&
              (this.searchDistance.reset(),
              this.searchDistance.setDistance(this.distance),
              this.searchDistance.setUnit(this.unit));
            this.clearAllGraphics();
          },
          hideTempLayers: function() {
            this._bufferLayer && this._bufferLayer.hide();
            this.drawBox && this.drawBox.hideLayer();
            this.featureSetChooserForSingleLayer &&
              this.featureSetChooserForSingleLayer.hideMiddleFeatureLayer();
          },
          showTempLayers: function() {
            this._bufferLayer && this._bufferLayer.show();
            this.drawBox && this.drawBox.showLayer();
            this.featureSetChooserForSingleLayer &&
              this.featureSetChooserForSingleLayer.showMiddleFeatureLayer();
          },
          disable: function(a) {
            a && this._hideAllLayers();
          },
          enable: function() {
            this._showAllLayers();
          },
          deactivate: function() {
            this.featureSetChooserForSingleLayer &&
              this.featureSetChooserForSingleLayer.deactivate();
          },
          clearAllGraphics: function() {
            this._clearBufferLayer();
            this.featureSetChooserForSingleLayer &&
              this.featureSetChooserForSingleLayer.clearAllGraphics();
          },
          setSelectedLayer: function(a) {
            return this.layerChooserFromMapWithDropbox.setSelectedLayer(a);
          },
          getSelectedLayer: function() {
            return this._getSelectedLayerInfomation().layer;
          },
          checkSelectedFeaturesRadio: function() {
            this.selectionRadio.getValue() || this.selectionRadio.check();
          },
          uncheckSelectedFeaturesRadio: function() {
            this.selectionRadio.getValue() && this.selectionRadio.uncheck();
          },
          isValidSearchDistance: function() {
            return 0 <= this.searchDistance.getStatus();
          },
          getGeometryInfo: function(a) {
            var d = new t(),
              p = { status: null, geometry: null };
            this._updateBuffer();
            if (0 === this._getSelectedLayerInfomation().type)
              return (p.status = -1), d.resolve(p), d;
            if (0 > this.searchDistance.getData().status)
              return (p.status = -2), d.resolve(p), d;
            this._getFeatures(a).then(
              b.hitch(this, function() {
                p.geometry = this._updateBuffer();
                p.status = p.geometry ? 1 : 0;
                d.resolve(p);
              }),
              b.hitch(this, function(a) {
                d.reject(a);
              })
            );
            return d;
          },
          getFeatureSet: function(d) {
            var c = new t(),
              p = null,
              e = this._getSelectedLayerInfomation().layer;
            e
              ? this._getFeatures(d).then(
                  b.hitch(this, function(b) {
                    p = a.getFeatureSetByLayerAndFeatures(e, b);
                    c.resolve(p);
                  }),
                  b.hitch(this, function(a) {
                    c.reject(a);
                  })
                )
              : c.resolve(p);
            return c;
          },
          _getFeatures: function() {
            var a = new t(),
              b = [],
              d = this._getSelectedLayerInfomation(),
              c = d.type;
            0 === c
              ? a.resolve(b)
              : this.selectionRadio.getStatus() &&
                this.selectionRadio.getValue()
              ? ((b = d.layer.getSelectedFeatures()), a.resolve(b))
              : this.featureSetChooserForSingleLayer.isLoading()
              ? (a = this.featureSetChooserForSingleLayer.getFeatures())
              : ((b = this.featureSetChooserForSingleLayer.syncGetFeatures()),
                0 < b.length
                  ? a.resolve(b)
                  : 3 === c
                  ? ((b = d.layer.graphics), a.resolve(b))
                  : (a = this._getAllFeaturesFromFeaturelayer(d.layer)));
            return a;
          },
          _getAllFeaturesFromFeaturelayer: function(c) {
            var e = new t();
            if (this._layerAllFeaturesCache[c.id])
              e.resolve(this._layerAllFeaturesCache[c.id]);
            else {
              var p = a.getFeatureLayerDefinition(c);
              p ||
                (p = {
                  currentVersion: c.currentVersion,
                  fields: b.clone(c.fields)
                });
              this.emit("loading");
              p = new D();
              p.where = c.getDefinitionExpression() || "1\x3d1";
              p.geometry = null;
              p.outSpatialReference = this.map.spatialReference;
              p.returnGeometry = !0;
              new d({ url: c.url, query: p }).getAllFeatures().then(
                b.hitch(this, function(a) {
                  this.emit("unloading");
                  a
                    ? ((a = a.features || []),
                      (this._layerAllFeaturesCache[c.id] = a),
                      e.resolve(a))
                    : e.reject(
                        "Can't get all features from featureLayer " + c.id
                      );
                }),
                b.hitch(this, function(a) {
                  this.emit("unloading");
                  e.reject(a);
                })
              );
            }
            return e;
          },
          _syncGetFeatures: function() {
            var a = [],
              b = this._getSelectedLayerInfomation(),
              d = b.type;
            0 !== d &&
              (this.selectionRadio.getStatus() && this.selectionRadio.getValue()
                ? (a = b.layer.getSelectedFeatures())
                : ((a = this.featureSetChooserForSingleLayer.syncGetFeatures()),
                  0 === a.length &&
                    (3 === d
                      ? (a = b.layer.graphics)
                      : (b = this._layerAllFeaturesCache[b.layer.id]) &&
                        (a = b))));
            return a;
          },
          isLoading: function() {
            return (
              this.featureSetChooserForSingleLayer &&
              this.featureSetChooserForSingleLayer.isLoading()
            );
          },
          _onLoading: function() {
            this.showLoading && this.loading.show();
            this.emit("loading");
          },
          _onUnloading: function() {
            this.loading.hide();
            this.emit("unloading");
          },
          _showAllLayers: function() {
            this._bufferLayer && this._bufferLayer.show();
          },
          _hideAllLayers: function() {
            this._bufferLayer && this._bufferLayer.hide();
          },
          _onRadioChanged: function() {
            this.selectionRadio.getValue() &&
              this.featureSetChooserForSingleLayer &&
              (this.featureSetChooserForSingleLayer.deactivate(),
              this.featureSetChooserForSingleLayer.clearAllGraphics());
            this._updateBuffer();
          },
          _getSelectedLayerInfomation: function() {
            var a = 0,
              b = null,
              d = null,
              c = this.layerChooserFromMapWithDropbox.getSelectedItems();
            0 < c.length && (b = c[0]);
            b &&
              ((d = b.layerInfo.layerObject),
              (a = d.url
                ? 0 <= this.map.graphicsLayerIds.indexOf(d.id)
                  ? 1
                  : 2
                : 3));
            return { type: a, layerItem: b, layer: d };
          },
          _onLayerChanged: function() {
            this.clearAllGraphics();
            this._clearSelectionHandle();
            this._updateSelectedFeaturesCount();
            this.featureSetChooserForSingleLayer &&
              this.featureSetChooserForSingleLayer.destroy();
            this.featureSetChooserForSingleLayer = null;
            var a = this._getSelectedLayerInfomation();
            0 < a.type &&
              ((this.featureSetChooserForSingleLayer = new J({
                map: this.map,
                featureLayer: a.layer,
                updateSelection: !1
              })),
              (this._selectionHandle = g(
                a.layer,
                "selection-complete",
                b.hitch(this, function() {
                  var a =
                    this.selectionRadio.getStatus() &&
                    this.selectionRadio.getValue();
                  this._updateSelectedFeaturesCount();
                  a && this._updateBuffer();
                })
              )),
              this.own(
                g(
                  this.featureSetChooserForSingleLayer,
                  "user-clear",
                  b.hitch(this, this._onUserClear)
                )
              ),
              this.own(
                g(
                  this.featureSetChooserForSingleLayer,
                  "loading",
                  b.hitch(
                    this,
                    b.hitch(this, function() {
                      this._clearBufferLayer();
                      this._onLoading();
                    })
                  )
                )
              ),
              this.own(
                g(
                  this.featureSetChooserForSingleLayer,
                  "unloading",
                  b.hitch(
                    this,
                    b.hitch(this, function() {
                      this._onUnloading();
                      this._updateBuffer();
                    })
                  )
                )
              ),
              this.featureSetChooserForSingleLayer.placeAt(
                this.featureSetChooserDiv
              ),
              this.own(
                g(
                  this.featureSetChooserForSingleLayer,
                  "draw-activate",
                  b.hitch(this, function() {
                    this.uncheckSelectedFeaturesRadio();
                  })
                )
              ));
            this._updateFeatureSetChooserForSingleLayerStatus();
            this._updateBuffer();
          },
          _onLayerInfosIsShowInMapChanged: function() {
            this._updateFeatureSetChooserForSingleLayerStatus();
          },
          _onSearchDistanceChange: function() {
            this._updateBuffer();
            this.emit("search-distance-change");
          },
          _updateFeatureSetChooserForSingleLayerStatus: function() {
            if (this.featureSetChooserForSingleLayer) {
              var a = !1,
                b = this.featureSetChooserForSingleLayer.getFeatureLayer();
              (b = this.layerInfosObj.getLayerInfoById(b.id)) &&
                (a = b.isShowInMap());
              a
                ? (this.featureSetChooserForSingleLayer.enable(),
                  c.removeClass(
                    this.featureSetChooserForSingleLayer.domNode,
                    "not-visible"
                  ))
                : (this.featureSetChooserForSingleLayer.disable(),
                  this.featureSetChooserForSingleLayer.clearAllGraphics(),
                  c.addClass(
                    this.featureSetChooserForSingleLayer.domNode,
                    "not-visible"
                  ),
                  this._updateBuffer());
            }
          },
          _updateBuffer: function() {
            this._clearBufferLayer();
            var d = this.searchDistance.getData(),
              c = d.status,
              p = d.distance,
              d = d.bufferUnit;
            if (0 > c) return null;
            var e = this._syncGetFeatures(),
              f = null,
              g = [];
            k.forEach(
              e,
              b.hitch(this, function(a) {
                a && a.geometry && g.push(a.geometry);
              })
            );
            0 < g.length &&
              (f =
                "polygon" === g[0].type ? C.union(g) : a.combineGeometries(g));
            return 0 === c
              ? f
              : f
              ? ((f = C.simplify(f)),
                (e = f.spatialReference),
                (c = null),
                (c =
                  e.isWebMercator() || 4326 === e.wkid
                    ? C.geodesicBuffer(f, p, d, !0)
                    : C.buffer(f, p, d, !0)),
                (p = new x(c)),
                this._bufferLayer.add(p),
                c)
              : null;
          },
          _onUserClear: function() {
            this.clearAllGraphics();
          },
          _clearBufferLayer: function() {
            this._bufferLayer && this._bufferLayer.clear();
          },
          _updateSelectedFeaturesCount: function() {
            this.selectionRadio.setStatus(!0);
            var a = this._getSelectedLayerInfomation(),
              b = 0;
            a.layer && (a = a.layer.getSelectedFeatures()) && (b = a.length);
            0 === b
              ? (this.selectionRadio.getValue() &&
                  this.selectionRadio.uncheck(),
                this.selectionRadio.setStatus(!1),
                c.addClass(this.selectionOptionDiv, "not-visible"))
              : c.removeClass(this.selectionOptionDiv, "not-visible");
            this.selectionRadio.setLabel(
              this.nls.selectedFeatures +
                (window.isRTL ? "\x26rlm;" : " ") +
                "(" +
                b +
                ")"
            );
          },
          _clearSelectionHandle: function() {
            this._selectionHandle && this._selectionHandle.remove();
            this._selectionHandle = null;
          },
          destroy: function() {
            this._bufferLayer && this.map.removeLayer(this._bufferLayer);
            this._bufferLayer = null;
            this._clearSelectionHandle();
            this.inherited(arguments);
          }
        });
        l.NONE_SELECTED_FEATURES_NOT_DRAW_SHAPES =
          "NONE_SELECTED_FEATURES_NOT_DRAW_SHAPES";
        return l;
      });
    },
    "jimu/dijit/FeaturelayerChooserFromMap": function() {
      define([
        "dojo/_base/declare",
        "dojo/Deferred",
        "dojo/_base/html",
        "dojo/_base/lang",
        "./LayerChooserFromMap"
      ], function(k, l, q, n, f) {
        return k([f], {
          baseClass: "jimu-featurelayer-chooser-from-map",
          declaredClass: "jimu.dijit.FeaturelayerChooserFromMap",
          types: null,
          showLayerFromFeatureSet: !1,
          showTable: !1,
          onlyShowVisible: !1,
          ignoredFeaturelayerIds: null,
          mustSupportStatistics: !1,
          ignoreVirtualLayer: !1,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.ignoredFeaturelayerIds || (this.ignoredFeaturelayerIds = []);
            this.basicFilter = n.hitch(this, this.basicFilter);
            this.filter = f.createFeaturelayerFilter(
              this.types,
              this.showLayerFromFeatureSet,
              this.showTable,
              this.mustSupportStatistics
            );
            this.ignoreVirtualLayer &&
              (this.filter = f.andCombineFilters([
                this.filter,
                n.hitch(this, this._ignoreVirtualLayerFilter)
              ]));
          },
          postCreate: function() {
            this.inherited(arguments);
            q.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
          },
          _ignoreVirtualLayerFilter: function(e) {
            return e.getLayerType().then(function(e) {
              return !(
                "ArcGISDynamicMapServiceLayer" === e ||
                "ArcGISTiledMapServiceLayer" === e ||
                "GroupLayer" === e
              );
            });
          },
          basicFilter: function(e) {
            var f = new l();
            0 <= this.ignoredFeaturelayerIds.indexOf(e.id)
              ? f.resolve(!1)
              : this.onlyShowVisible && "Table" !== e.getLayerType()
              ? f.resolve(e.isShowInMap())
              : f.resolve(!0);
            return f;
          },
          getHandledItem: function(e) {
            var f = this.inherited(arguments),
              h = e && e.layerInfo,
              h = h && h.layerObject;
            f.url = (h && h.url) || "";
            return f;
          }
        });
      });
    },
    "jimu/dijit/LayerChooserFromMap": function() {
      define("dojo/on dojo/Evented dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/store/Memory dojo/Deferred dojo/store/Observable dijit/tree/ObjectStoreModel dojo/promise/all dojo/_base/lang dojo/_base/html dojo/_base/array jimu/utils jimu/dijit/_Tree jimu/LayerInfos/LayerInfos jimu/dijit/LoadingIndicator".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b, a, d, m, w, u, y, A) {
        var x = q([n, f, e, l], {
          templateString:
            '\x3cdiv style\x3d"width:100%;"\x3e\x3cdiv data-dojo-attach-point\x3d"errorTipSection" class\x3d"error-tip-section"\x3e\x3cspan class\x3d"jimu-icon jimu-icon-error"\x3e\x3c/span\x3e\x3cspan class\x3d"jimu-state-error-text" data-dojo-attach-point\x3d"errTip"\x3e${nls.noLayersTip}\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e',
          _store: null,
          _id: 0,
          _treeClass: "layer-chooser-tree",
          createMapResponse: null,
          multiple: !1,
          onlyShowVisible: !1,
          updateWhenLayerInfosIsShowInMapChanged: !1,
          onlyShowWebMapLayers: !1,
          displayTooltipForTreeNode: !1,
          postMixInProperties: function() {
            this.nls = window.jimuNls.basicLayerChooserFromMap;
          },
          postCreate: function() {
            this.inherited(arguments);
            d.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
            this.multiple = !!this.multiple;
            this.shelter = new A({ hidden: !0 });
            this.shelter.placeAt(this.domNode);
            this.shelter.startup();
            this._createTree();
            this.basicFilter = a.hitch(this, this.basicFilter);
            this.filter = x.andCombineFilters([this.basicFilter, this.filter]);
            this.createMapResponse &&
              this.setCreateMapResponse(this.createMapResponse);
          },
          basicFilter: function(a) {
            var b = new h();
            this.onlyShowVisible ? b.resolve(a.isShowInMap()) : b.resolve(!0);
            return b;
          },
          filter: function(a) {
            a = new h();
            a.resolve(!0);
            return a;
          },
          getSelectedItems: function() {
            var b = this.tree.getSelectedItems();
            return m.map(
              b,
              a.hitch(this, function(a) {
                return this.getHandledItem(a);
              })
            );
          },
          getAllItems: function() {
            var b = this.tree.getAllItems(),
              d = [];
            m.forEach(
              b,
              a.hitch(this, function(a) {
                "root" !== a.id && ((a = this.getHandledItem(a)), d.push(a));
              })
            );
            return d;
          },
          getHandledItem: function(a) {
            return { name: a.name, layerInfo: a.layerInfo };
          },
          _isLeafItem: function(a) {
            return a.isLeaf;
          },
          setCreateMapResponse: function(b) {
            this.createMapResponse = b;
            y.getInstance(
              this.createMapResponse.map,
              this.createMapResponse.itemInfo
            ).then(
              a.hitch(this, function(b) {
                this.layerInfosObj = b;
                this.own(
                  k(
                    this.layerInfosObj,
                    "layerInfosChanged",
                    a.hitch(this, this._onLayerInfosChanged)
                  )
                );
                this.updateWhenLayerInfosIsShowInMapChanged &&
                  this.own(
                    k(
                      this.layerInfosObj,
                      "layerInfosIsShowInMapChanged",
                      a.hitch(this, this._onLayerInfosIsShowInMapChanged)
                    )
                  );
                this._buildTree(this.layerInfosObj);
              })
            );
          },
          _onLayerInfosChanged: function(a, b) {
            this._buildTree(this.layerInfosObj);
            this.emit("update");
          },
          _onLayerInfosIsShowInMapChanged: function(a) {
            this._buildTree(this.layerInfosObj);
            this.emit("update");
          },
          _buildTree: function(b) {
            this._clear();
            d.setStyle(this.errorTipSection, "display", "block");
            var c = [];
            this.onlyShowWebMapLayers
              ? ((c = b.getLayerInfoArrayOfWebmap()),
                (c = c.concat(b.getTableInfoArrayOfWebmap())))
              : ((c = b.getLayerInfoArray()),
                (c = c.concat(b.getTableInfoArray())));
            0 !== c.length &&
              (d.setStyle(this.errorTipSection, "display", "none"),
              m.forEach(
                c,
                a.hitch(this, function(a) {
                  this._addDirectLayerInfo(a);
                })
              ));
          },
          _addDirectLayerInfo: function(b) {
            b &&
              b.getLayerObject().then(
                a.hitch(this, function() {
                  this._addItem("root", b);
                }),
                a.hitch(this, function(a) {
                  console.error(a);
                })
              );
          },
          _clear: function() {
            var b = this._store.query({ parent: "root" });
            m.forEach(
              b,
              a.hitch(this, function(a) {
                a && "root" !== a.id && this._store.remove(a.id);
              })
            );
          },
          _addItem: function(d, c) {
            var e = null,
              f = c.getLayerType(),
              g = this.filter(c);
            b({ layerType: f, valid: g }).then(
              a.hitch(this, function(f) {
                if (f.valid) {
                  var g = a.hitch(this, function(a, b) {
                      this._id++;
                      e = {
                        name: c.title || "",
                        parent: d,
                        layerInfo: c,
                        type: f.layerType,
                        layerClass: c.layerObject.declaredClass,
                        id: this._id.toString(),
                        isLeaf: a,
                        hasChildren: b
                      };
                      this._store.add(e);
                    }),
                    h = c.getSubLayers(),
                    p = 0 === h.length;
                  p
                    ? g(p, !1)
                    : ((h = m.map(
                        h,
                        a.hitch(this, function(a) {
                          return this.filter(a);
                        })
                      )),
                      b(h).then(
                        a.hitch(this, function(a) {
                          (a = m.some(a, function(a) {
                            return a;
                          })) && g(p, a);
                        })
                      ));
                }
              })
            );
          },
          _getRootItem: function() {
            return {
              id: "root",
              name: "Map Root",
              type: "root",
              isLeaf: !1,
              hasChildren: !0
            };
          },
          _createTree: function() {
            var b = this._getRootItem(),
              b = new g({
                data: [b],
                getChildren: function(a) {
                  return this.query({ parent: a.id });
                }
              });
            this._store = new t(b);
            b = new c({
              store: this._store,
              query: { id: "root" },
              mayHaveChildren: a.hitch(this, this._mayHaveChildren)
            });
            this.tree = new u({
              multiple: this.multiple,
              model: b,
              showRoot: !1,
              isLeafItem: a.hitch(this, this._isLeafItem),
              style: { width: "100%" },
              onOpen: a.hitch(this, function(a, b) {
                "root" !== a.id && this._onTreeOpen(a, b);
              }),
              onClick: a.hitch(this, function(a, b, d) {
                this._onTreeClick(a, b, d);
                this.emit("tree-click", a, b, d);
              }),
              getIconStyle: a.hitch(this, function(a, b) {
                var d = null;
                if (!a || "root" === a.id) return null;
                var c = {
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundImage: ""
                  },
                  e =
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    require.toUrl("jimu");
                if ((a = this._getIconInfo(a, b).imageName))
                  (c.backgroundImage = "url(" + e + "/css/images/" + a + ")"),
                    (d = c);
                return d;
              }),
              getIconClass: a.hitch(this, function(a, b) {
                return this._getIconInfo(a, b).className;
              }),
              getTooltip: a.hitch(this, function(a) {
                return this.displayTooltipForTreeNode ? a.layerInfo.title : "";
              })
            });
            d.addClass(this.tree.domNode, this._treeClass);
            this.tree.placeAt(this.shelter.domNode, "before");
          },
          _mayHaveChildren: function(a) {
            return a.hasChildren;
          },
          _getIconInfo: function(a, b) {
            var d = "",
              c = "";
            "ArcGISDynamicMapServiceLayer" === a.type ||
            "ArcGISTiledMapServiceLayer" === a.type
              ? b
                ? ((d = "mapserver_open.png"),
                  (c = "mapservice-layer-icon open"))
                : ((d = "mapserver_close.png"),
                  (c = "mapservice-layer-icon close"))
              : "GroupLayer" === a.type
              ? b
                ? ((d = "group_layer2.png"), (c = "group-layer-icon open"))
                : ((d = "group_layer1.png"), (c = "group-layer-icon close"))
              : "FeatureLayer" === a.type
              ? ((a = w.getTypeByGeometryType(
                  a.layerInfo.layerObject.geometryType
                )),
                "point" === a
                  ? ((d = "point_layer1.png"), (c = "point-layer-icon"))
                  : "polyline" === a
                  ? ((d = "line_layer1.png"), (c = "line-layer-icon"))
                  : "polygon" === a &&
                    ((d = "polygon_layer1.png"), (c = "polygon-layer-icon")))
              : "Table" === a.type
              ? ((d = "table.png"), (c = "table-icon"))
              : "ArcGISImageServiceLayer" === a.type ||
                "ArcGISImageServiceVectorLayer" === a.type
              ? ((d = "image_layer.png"), (c = "iamge-layer-icon"))
              : b
              ? ((d = "mapserver_open.png"), (c = "mapservice-layer-icon open"))
              : ((d = "mapserver_close.png"),
                (c = "mapservice-layer-icon close"));
            return { imageName: d, className: c };
          },
          _onTreeOpen: function(d, c) {
            if ("root" !== d.id) {
              var e = [];
              c = [];
              e = d.layerInfo.getSubLayers();
              d.checked ||
                (this.shelter.show(),
                (c = m.map(
                  e,
                  a.hitch(this, function(a) {
                    return a.getLayerObject();
                  })
                )),
                b(c).then(
                  a.hitch(this, function() {
                    this.domNode &&
                      (m.forEach(
                        e,
                        a.hitch(this, function(a) {
                          this._addItem(d.id, a);
                        })
                      ),
                      (d.checked = !0),
                      this.shelter.hide());
                  }),
                  a.hitch(this, function(a) {
                    console.error(a);
                    this.shelter.hide();
                  })
                ));
            }
          },
          _onTreeClick: function(a, b, d) {},
          destroy: function() {
            this.shelter && (this.shelter.destroy(), (this.shelter = null));
            this.tree && this.tree.destroy();
            this.inherited(arguments);
          }
        });
        x.createFilterByLayerType = function(d) {
          a.isArrayLike(d) || (d = []);
          return function(a) {
            var c = new h();
            if (0 === d.length) c.resolve(!0);
            else {
              var e = [];
              a.traversal(function(a) {
                e.push(a.getLayerType());
              });
              b(e).then(
                function(a) {
                  for (var b = 0; b < a.length; b++)
                    for (var e = 0; e < d.length; e++)
                      if (a[b] === d[e]) {
                        c.resolve(!0);
                        return;
                      }
                  c.resolve(!1);
                },
                function(a) {
                  console.error(a);
                  c.reject(a);
                }
              );
            }
            return c;
          };
        };
        x.createFeaturelayerFilter = function(a, d, c, e) {
          var f = ["point", "polyline", "polygon"];
          a && 0 < a.length
            ? ((a = m.filter(a, function(a) {
                return 0 <= f.indexOf(a);
              })),
              0 === a.length && (a = f))
            : (a = f);
          return function(f) {
            var g = f.getLayerType();
            f = f.getLayerObject();
            return b({ layerType: g, layerObject: f }).then(function(b) {
              var p = b.layerType;
              b = b.layerObject;
              if (
                "ArcGISDynamicMapServiceLayer" === p ||
                "ArcGISTiledMapServiceLayer" === p ||
                "GroupLayer" === p ||
                "FeatureCollection" === p
              )
                return !0;
              if ("FeatureLayer" === p) {
                var p = w.getTypeByGeometryType(b.geometryType),
                  p = 0 <= m.indexOf(a, p),
                  f = x._shouldPassStatisticsCheck(e, b);
                return b.url
                  ? ((b = w.isFeaturelayerUrlSupportQuery(
                      b.url,
                      b.capabilities
                    )),
                    p && b && f)
                  : d && p;
              }
              return "Table" === p
                ? ((p = w.isFeaturelayerUrlSupportQuery(b.url, b.capabilities)),
                  (b = x._shouldPassStatisticsCheck(e, b)),
                  c && p && b)
                : !1;
            });
          };
        };
        x.createImageServiceLayerFilter = function(a, d) {
          return function(c) {
            var e = c.getLayerType();
            c = c.getLayerObject();
            return b({ layerType: e, layerObject: c }).then(function(b) {
              var c = b.layerType,
                e = b.layerObject;
              return "ArcGISImageServiceLayer" === c ||
                "ArcGISImageServiceVectorLayer" === c
                ? a
                  ? w.isImageServiceSupportQuery(b.layerObject.capabilities)
                    ? d
                      ? x._shouldPassStatisticsCheck(d, e)
                      : !0
                    : !1
                  : !0
                : !1;
            });
          };
        };
        x._shouldPassStatisticsCheck = function(a, b) {
          return a
            ? ((a = !1),
              (a = b.advancedQueryCapabilities
                ? !!b.advancedQueryCapabilities.supportsStatistics
                : !!b.supportsStatistics))
            : !0;
        };
        x.createQueryableLayerFilter = function(a) {
          var b = x.createFeaturelayerFilter(
            ["point", "polyline", "polygon"],
            !1,
            !0,
            a
          );
          a = x.createImageServiceLayerFilter(!0, a);
          return x.orCombineFilters([b, a]);
        };
        x.andCombineFilters = function(a) {
          return x._combineFilters(a, !0);
        };
        x.orCombineFilters = function(a) {
          return x._combineFilters(a, !1);
        };
        x._combineFilters = function(a, d) {
          return function(c) {
            var e = new h(),
              f = m.map(a, function(a) {
                return a(c);
              });
            b(f).then(
              function(a) {
                var b = !1,
                  b = d
                    ? m.every(a, function(a) {
                        return a;
                      })
                    : m.some(a, function(a) {
                        return a;
                      });
                e.resolve(b);
              },
              function(a) {
                console.error(a);
                e.reject(a);
              }
            );
            return e;
          };
        };
        return x;
      });
    },
    "dijit/tree/ObjectStoreModel": function() {
      define("dojo/_base/array dojo/aspect dojo/_base/declare dojo/Deferred dojo/_base/lang dojo/when ../Destroyable".split(
        " "
      ), function(k, l, q, n, f, e, g) {
        return q("dijit.tree.ObjectStoreModel", g, {
          store: null,
          labelAttr: "name",
          labelType: "text",
          root: null,
          query: null,
          constructor: function(e) {
            f.mixin(this, e);
            this.childrenCache = {};
          },
          getRoot: function(g, k) {
            if (this.root) g(this.root);
            else {
              var c = this.store.query(this.query);
              c.then && this.own(c);
              e(
                c,
                f.hitch(this, function(b) {
                  if (1 != b.length)
                    throw Error(
                      "dijit.tree.ObjectStoreModel: root query returned " +
                        b.length +
                        " items, but must return exactly one"
                    );
                  this.root = b[0];
                  g(this.root);
                  c.observe &&
                    c.observe(
                      f.hitch(this, function(a) {
                        this.onChange(a);
                      }),
                      !0
                    );
                }),
                k
              );
            }
          },
          mayHaveChildren: function() {
            return !0;
          },
          getChildren: function(g, k, c) {
            var b = this.store.getIdentity(g);
            if (this.childrenCache[b]) e(this.childrenCache[b], k, c);
            else {
              var a = (this.childrenCache[b] = this.store.getChildren(g));
              a.then && this.own(a);
              a.observe &&
                this.own(
                  a.observe(
                    f.hitch(this, function(b, c, h) {
                      this.onChange(b);
                      c != h && e(a, f.hitch(this, "onChildrenChange", g));
                    }),
                    !0
                  )
                );
              e(a, k, c);
            }
          },
          isItem: function() {
            return !0;
          },
          getIdentity: function(e) {
            return this.store.getIdentity(e);
          },
          getLabel: function(e) {
            return e[this.labelAttr];
          },
          newItem: function(e, f, c, b) {
            return this.store.put(e, { parent: f, before: b });
          },
          pasteItem: function(e, g, c, b, a, d) {
            var m = new n();
            if (g === c && !b && !d) return m.resolve(!0), m;
            g && !b
              ? this.getChildren(
                  g,
                  f.hitch(this, function(a) {
                    a = [].concat(a);
                    var b = k.indexOf(a, e);
                    a.splice(b, 1);
                    this.onChildrenChange(g, a);
                    m.resolve(
                      this.store.put(e, {
                        overwrite: !0,
                        parent: c,
                        oldParent: g,
                        before: d,
                        isCopy: !1
                      })
                    );
                  })
                )
              : m.resolve(
                  this.store.put(e, {
                    overwrite: !0,
                    parent: c,
                    oldParent: g,
                    before: d,
                    isCopy: !0
                  })
                );
            return m;
          },
          onChange: function() {},
          onChildrenChange: function() {},
          onDelete: function() {}
        });
      });
    },
    "jimu/dijit/_Tree": function() {
      define("dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./templates/_TreeNode.html dojo/_base/lang dojo/_base/html dojo/_base/array dojo/_base/event dojo/query dojo/aspect dojo/on dojo/keys dojo/Evented dijit/registry dijit/Tree jimu/utils".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b, a, d, m, w, u) {
        var y = k([w._TreeNode, d], {
          templateString: n,
          declaredClass: "jimu._TreeNode",
          isLeaf: !1,
          groupId: "",
          postCreate: function() {
            this.inherited(arguments);
            e.addClass(this.domNode, "jimu-tree-node");
            this.isLeaf = !!this.isLeaf;
            this.groupId
              ? ((this.checkNode = e.toDom('\x3cinput type\x3d"radio" /\x3e')),
                (this.checkNode.name = this.groupId))
              : (this.checkNode = e.toDom(
                  '\x3cinput type\x3d"checkbox" /\x3e'
                ));
            e.addClass(this.checkNode, "jimu-tree-check-node");
            e.place(this.checkNode, this.contentNode, "first");
            this.own(b(this.checkNode, "click", f.hitch(this, this._onClick)));
            this.own(
              b(
                this.rowNode,
                "keydown",
                f.hitch(
                  this,
                  function(b, d) {
                    d.target = b;
                    (d.keyCode !== a.ENTER && d.keyCode !== a.SPACE) ||
                      this._onClick(d);
                  },
                  this.checkNode
                )
              )
            );
            this.isLeaf
              ? this.groupId
                ? e.setStyle(this.checkNode, "display", "none")
                : e.setStyle(this.checkNode, "display", "inline")
              : e.setStyle(this.checkNode, "display", "none");
            this.isLeaf
              ? e.addClass(this.domNode, "jimu-tree-leaf-node")
              : e.addClass(this.domNode, "jimu-tree-not-leaf-node");
          },
          select: function() {
            this.isLeaf &&
              ((this.checkNode.checked = !0),
              e.addClass(this.domNode, "jimu-tree-selected-leaf-node"));
          },
          unselect: function() {
            this.isLeaf &&
              ((this.checkNode.checked = !1),
              e.removeClass(this.domNode, "jimu-tree-selected-leaf-node"));
          },
          toggleSelect: function() {
            this.isLeaf &&
              (this.checkNode.checked ? this.unselect() : this.select());
          },
          _onClick: function(a) {
            (a.target || a.srcElement) === this.checkNode
              ? this.tree._onCheckNodeClick(this, this.checkNode.checked, a)
              : this.tree._onClick(this, a);
          },
          _onChange: function() {
            this.isLeaf &&
              setTimeout(
                f.hitch(this, function() {
                  this.checkNode.checked
                    ? this.emit("tn-select", this)
                    : this.emit("tn-unselect", this);
                }),
                100
              );
          },
          destroy: function() {
            delete this.tree;
            this.inherited(arguments);
          }
        });
        return k([w, d], {
          declaredClass: "jimu._Tree",
          openOnClick: !0,
          multiple: !0,
          uniqueId: "",
          showRoot: !1,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.uniqueId = "tree_" + u.getRandomString();
          },
          postCreate: function() {
            this.inherited(arguments);
            e.addClass(this.domNode, "jimu-tree");
            this.own(
              c.before(this, "onClick", f.hitch(this, this._jimuBeforeClick))
            );
            this.rootLoadingIndicator &&
              e.setStyle(this.rootLoadingIndicator, "display", "none");
            this.dndController.singular = !0;
            e.setAttr(this.domNode, "tabindex", 0);
          },
          removeItem: function(a) {
            this.model.store.remove(a);
          },
          getAllItems: function() {
            var a = this.getAllTreeNodeWidgets();
            return g.map(
              a,
              f.hitch(this, function(a) {
                var b = a.item;
                b.selected = a.checkNode.checked;
                return b;
              })
            );
          },
          getSelectedItems: function() {
            var a = this.getAllTreeNodeWidgets(),
              a = g.filter(
                a,
                f.hitch(this, function(a) {
                  return a.checkNode.checked;
                })
              );
            return g.map(
              a,
              f.hitch(this, function(a) {
                return a.item;
              })
            );
          },
          getFilteredItems: function(a) {
            var b = this.getAllTreeNodeWidgets(),
              b = g.map(
                b,
                f.hitch(this, function(a) {
                  var b = a.item;
                  b.selected = a.checkNode.checked;
                  return b;
                })
              );
            return g.filter(
              b,
              f.hitch(this, function(b) {
                return a(b);
              })
            );
          },
          getTreeNodeByItemId: function(a) {
            for (var b = this._getAllTreeNodeDoms(), d = 0; d < b.length; d++) {
              var c = m.byNode(b[d]);
              if (c.item.id.toString() === a.toString()) return c;
            }
            return null;
          },
          selectItem: function(a) {
            (a = this.getTreeNodeByItemId(a)) &&
              a.isLeaf &&
              this.selectNodeWidget(a);
          },
          unselectItem: function(a) {
            (a = this.getTreeNodeByItemId(a)) && a.isLeaf && a.unselect();
          },
          getAllLeafTreeNodeWidgets: function() {
            var a = this.getAllTreeNodeWidgets();
            return g.filter(
              a,
              f.hitch(this, function(a) {
                return a.isLeaf;
              })
            );
          },
          getAllTreeNodeWidgets: function() {
            var a = this._getAllTreeNodeDoms();
            return g.map(
              a,
              f.hitch(this, function(a) {
                return m.byNode(a);
              })
            );
          },
          isLeafItem: function(a) {
            return a && a.isLeaf;
          },
          _getAllTreeNodeDoms: function() {
            return t(".dijitTreeNode", this.domNode);
          },
          _createTreeNode: function(a) {
            a.isLeaf = this.isLeafItem(a.item);
            this.multiple || (a.groupId = this.uniqueId);
            return new y(a);
          },
          _onTreeNodeSelect: function(a) {
            this.emit("item-select", { item: a.item, treeNode: a });
          },
          _onTreeNodeUnselect: function(a) {
            this.emit("item-unselect", { item: a.item, treeNode: a });
          },
          selectNodeWidget: function(a) {
            this.multiple || this.unselectAllLeafNodeWidgets();
            a.select();
          },
          _jimuBeforeClick: function(a, b, d) {
            b.isLeaf &&
              (e.hasClass(d.target || d.srcElement, "jimu-tree-check-node") ||
                (this.multiple ? b.toggleSelect() : this.selectNodeWidget(b)));
            return arguments;
          },
          _onCheckNodeClick: function(a, b, d) {
            !this.multiple && b && this.unselectAllLeafNodeWidgets();
            h.stop(d);
            this.focusNode(a);
            setTimeout(
              f.hitch(this, function() {
                b ? this.selectNodeWidget(a) : a.unselect();
                this.onClick(a.item, a, d);
              }),
              0
            );
          },
          unselectAllLeafNodeWidgets: function() {
            var a = this.getAllLeafTreeNodeWidgets();
            g.forEach(
              a,
              f.hitch(this, function(a) {
                a.unselect();
              })
            );
          }
        });
      });
    },
    "dijit/Tree": function() {
      define("dojo/_base/array dojo/aspect dojo/cookie dojo/_base/declare dojo/Deferred dojo/promise/all dojo/dom dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/errors/create dojo/fx dojo/has dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/topic dojo/touch dojo/when ./a11yclick ./focus ./registry ./_base/manager ./_Widget ./_TemplatedMixin ./_Container ./_Contained ./_CssStateMixin ./_KeyNavMixin dojo/text!./templates/TreeNode.html dojo/text!./templates/Tree.html ./tree/TreeStoreModel ./tree/ForestStoreModel ./tree/_dndSelector dojo/query!css2".split(
        " "
      ), function(
        k,
        l,
        q,
        n,
        f,
        e,
        g,
        h,
        t,
        c,
        b,
        a,
        d,
        m,
        w,
        u,
        y,
        A,
        x,
        D,
        E,
        z,
        H,
        C,
        J,
        B,
        K,
        p,
        r,
        F,
        I,
        L,
        v,
        N,
        P
      ) {
        function G(a) {
          return u.delegate(a.promise || a, {
            addCallback: function(a) {
              this.then(a);
            },
            addErrback: function(a) {
              this.otherwise(a);
            }
          });
        }
        var O = n("dijit._TreeNode", [J, B, K, p, r], {
          item: null,
          isTreeNode: !0,
          label: "",
          _setLabelAttr: function(a) {
            this.labelNode[
              "html" == this.labelType
                ? "innerHTML"
                : "innerText" in this.labelNode
                ? "innerText"
                : "textContent"
            ] = a;
            this._set("label", a);
            d("dojo-bidi") && this.applyTextDir(this.labelNode);
          },
          labelType: "text",
          isExpandable: null,
          isExpanded: !1,
          state: "NotLoaded",
          templateString: I,
          baseClass: "dijitTreeNode",
          cssStateNodes: { rowNode: "dijitTreeRow" },
          _setTooltipAttr: {
            node: "rowNode",
            type: "attribute",
            attribute: "title"
          },
          buildRendering: function() {
            this.inherited(arguments);
            this._setExpando();
            this._updateItemClasses(this.item);
            this.isExpandable &&
              this.labelNode.setAttribute("aria-expanded", this.isExpanded);
            this.setSelected(!1);
          },
          _setIndentAttr: function(a) {
            var b = Math.max(a, 0) * this.tree._nodePixelIndent + "px";
            c.set(this.domNode, "backgroundPosition", b + " 0px");
            c.set(
              this.rowNode,
              this.isLeftToRight() ? "paddingLeft" : "paddingRight",
              b
            );
            k.forEach(this.getChildren(), function(b) {
              b.set("indent", a + 1);
            });
            this._set("indent", a);
          },
          markProcessing: function() {
            this.state = "Loading";
            this._setExpando(!0);
          },
          unmarkProcessing: function() {
            this._setExpando(!1);
          },
          _updateItemClasses: function(a) {
            var b = this.tree,
              d = b.model;
            b._v10Compat && a === d.root && (a = null);
            this._applyClassAndStyle(a, "icon", "Icon");
            this._applyClassAndStyle(a, "label", "Label");
            this._applyClassAndStyle(a, "row", "Row");
            this.tree._startPaint(!0);
          },
          _applyClassAndStyle: function(a, b, d) {
            var e = "_" + b + "Class";
            b += "Node";
            var v = this[e];
            this[e] = this.tree["get" + d + "Class"](a, this.isExpanded);
            h.replace(this[b], this[e] || "", v || "");
            c.set(
              this[b],
              this.tree["get" + d + "Style"](a, this.isExpanded) || {}
            );
          },
          _updateLayout: function() {
            var a = this.getParent(),
              a = !a || !a.rowNode || "none" == a.rowNode.style.display;
            h.toggle(this.domNode, "dijitTreeIsRoot", a);
            h.toggle(
              this.domNode,
              "dijitTreeIsLast",
              !a && !this.getNextSibling()
            );
          },
          _setExpando: function(a) {
            var b = [
              "dijitTreeExpandoLoading",
              "dijitTreeExpandoOpened",
              "dijitTreeExpandoClosed",
              "dijitTreeExpandoLeaf"
            ];
            a = a ? 0 : this.isExpandable ? (this.isExpanded ? 1 : 2) : 3;
            h.replace(this.expandoNode, b[a], b);
            this.expandoNodeText.innerHTML = ["*", "-", "+", "*"][a];
          },
          expand: function() {
            if (this._expandDeferred) return G(this._expandDeferred);
            this._collapseDeferred &&
              (this._collapseDeferred.cancel(), delete this._collapseDeferred);
            this.isExpanded = !0;
            this.labelNode.setAttribute("aria-expanded", "true");
            (this.tree.showRoot || this !== this.tree.rootNode) &&
              this.containerNode.setAttribute("role", "group");
            h.add(this.contentNode, "dijitTreeContentExpanded");
            this._setExpando();
            this._updateItemClasses(this.item);
            this == this.tree.rootNode &&
              this.tree.showRoot &&
              this.tree.domNode.setAttribute("aria-expanded", "true");
            var b = a.wipeIn({
                node: this.containerNode,
                duration: C.defaultDuration
              }),
              d = (this._expandDeferred = new f(function() {
                b.stop();
              }));
            l.after(
              b,
              "onEnd",
              function() {
                d.resolve(!0);
              },
              !0
            );
            b.play();
            return G(d);
          },
          collapse: function() {
            if (this._collapseDeferred) return G(this._collapseDeferred);
            this._expandDeferred &&
              (this._expandDeferred.cancel(), delete this._expandDeferred);
            this.isExpanded = !1;
            this.labelNode.setAttribute("aria-expanded", "false");
            this == this.tree.rootNode &&
              this.tree.showRoot &&
              this.tree.domNode.setAttribute("aria-expanded", "false");
            h.remove(this.contentNode, "dijitTreeContentExpanded");
            this._setExpando();
            this._updateItemClasses(this.item);
            var b = a.wipeOut({
                node: this.containerNode,
                duration: C.defaultDuration
              }),
              d = (this._collapseDeferred = new f(function() {
                b.stop();
              }));
            l.after(
              b,
              "onEnd",
              function() {
                d.resolve(!0);
              },
              !0
            );
            b.play();
            return G(d);
          },
          indent: 0,
          setChildItems: function(a) {
            var b = this.tree,
              d = b.model,
              c = [],
              v = b.focusedChild,
              p = this.getChildren();
            k.forEach(
              p,
              function(a) {
                K.prototype.removeChild.call(this, a);
              },
              this
            );
            this.defer(function() {
              k.forEach(p, function(a) {
                if (!a._destroyed && !a.getParent()) {
                  var c = function(a) {
                    var e = d.getIdentity(a.item),
                      v = b._itemNodesMap[e];
                    1 == v.length
                      ? delete b._itemNodesMap[e]
                      : ((e = k.indexOf(v, a)), -1 != e && v.splice(e, 1));
                    k.forEach(a.getChildren(), c);
                  };
                  b.dndController.removeTreeNode(a);
                  c(a);
                  if (b.persist) {
                    var e = k
                        .map(a.getTreePath(), function(a) {
                          return b.model.getIdentity(a);
                        })
                        .join("/"),
                      p;
                    for (p in b._openedNodes)
                      p.substr(0, e.length) == e && delete b._openedNodes[p];
                    b._saveExpandedNodes();
                  }
                  b.lastFocusedChild &&
                    !g.isDescendant(b.lastFocusedChild.domNode, b.domNode) &&
                    delete b.lastFocusedChild;
                  v && !g.isDescendant(v.domNode, b.domNode) && b.focus();
                  a.destroyRecursive();
                }
              });
            });
            this.state = "Loaded";
            a && 0 < a.length
              ? ((this.isExpandable = !0),
                k.forEach(
                  a,
                  function(a) {
                    var e = d.getIdentity(a),
                      v = b._itemNodesMap[e],
                      p;
                    if (v)
                      for (var f = 0; f < v.length; f++)
                        if (v[f] && !v[f].getParent()) {
                          p = v[f];
                          p.set("indent", this.indent + 1);
                          break;
                        }
                    p ||
                      ((p = this.tree._createTreeNode({
                        item: a,
                        tree: b,
                        isExpandable: d.mayHaveChildren(a),
                        label: b.getLabel(a),
                        labelType: (b.model && b.model.labelType) || "text",
                        tooltip: b.getTooltip(a),
                        ownerDocument: b.ownerDocument,
                        dir: b.dir,
                        lang: b.lang,
                        textDir: b.textDir,
                        indent: this.indent + 1
                      })),
                      v ? v.push(p) : (b._itemNodesMap[e] = [p]));
                    this.addChild(p);
                    (this.tree.autoExpand || this.tree._state(p)) &&
                      c.push(b._expandNode(p));
                  },
                  this
                ),
                k.forEach(this.getChildren(), function(a) {
                  a._updateLayout();
                }))
              : (this.isExpandable = !1);
            this._setExpando && this._setExpando(!1);
            this._updateItemClasses(this.item);
            a = e(c);
            this.tree._startPaint(a);
            return G(a);
          },
          getTreePath: function() {
            for (var a = this, b = []; a && a !== this.tree.rootNode; )
              b.unshift(a.item), (a = a.getParent());
            b.unshift(this.tree.rootNode.item);
            return b;
          },
          getIdentity: function() {
            return this.tree.model.getIdentity(this.item);
          },
          removeChild: function(a) {
            this.inherited(arguments);
            var b = this.getChildren();
            0 == b.length && ((this.isExpandable = !1), this.collapse());
            k.forEach(b, function(a) {
              a._updateLayout();
            });
          },
          makeExpandable: function() {
            this.isExpandable = !0;
            this._setExpando(!1);
          },
          setSelected: function(a) {
            this.labelNode.setAttribute("aria-selected", a ? "true" : "false");
            h.toggle(this.rowNode, "dijitTreeRowSelected", a);
          },
          focus: function() {
            z.focus(this.focusNode);
          }
        });
        d("dojo-bidi") &&
          O.extend({
            _setTextDirAttr: function(a) {
              !a ||
                (this.textDir == a && this._created) ||
                (this._set("textDir", a),
                this.applyTextDir(this.labelNode),
                k.forEach(
                  this.getChildren(),
                  function(b) {
                    b.set("textDir", a);
                  },
                  this
                ));
            }
          });
        var M = n("dijit.Tree", [J, F, B, r], {
          baseClass: "dijitTree",
          store: null,
          model: null,
          query: null,
          label: "",
          showRoot: !0,
          childrenAttr: ["children"],
          paths: [],
          path: [],
          selectedItems: null,
          selectedItem: null,
          openOnClick: !1,
          openOnDblClick: !1,
          templateString: L,
          persist: !1,
          autoExpand: !1,
          dndController: P,
          dndParams: "onDndDrop itemCreator onDndCancel checkAcceptance checkItemAcceptance dragThreshold betweenThreshold".split(
            " "
          ),
          onDndDrop: null,
          itemCreator: null,
          onDndCancel: null,
          checkAcceptance: null,
          checkItemAcceptance: null,
          dragThreshold: 5,
          betweenThreshold: 0,
          _nodePixelIndent: 19,
          _publish: function(a, b) {
            A.publish(this.id, u.mixin({ tree: this, event: a }, b || {}));
          },
          postMixInProperties: function() {
            this.tree = this;
            this.autoExpand && (this.persist = !1);
            this._itemNodesMap = {};
            !this.cookieName &&
              this.id &&
              (this.cookieName = this.id + "SaveStateCookie");
            this.expandChildrenDeferred = new f();
            this.pendingCommandsPromise = this.expandChildrenDeferred.promise;
            this.inherited(arguments);
          },
          postCreate: function() {
            this._initState();
            var a = this;
            this.own(
              y(
                this.containerNode,
                y.selector(".dijitTreeNode", x.enter),
                function(b) {
                  a._onNodeMouseEnter(H.byNode(this), b);
                }
              ),
              y(
                this.containerNode,
                y.selector(".dijitTreeNode", x.leave),
                function(b) {
                  a._onNodeMouseLeave(H.byNode(this), b);
                }
              ),
              y(
                this.containerNode,
                y.selector(".dijitTreeRow", E.press),
                function(b) {
                  a._onNodePress(H.getEnclosingWidget(this), b);
                }
              ),
              y(this.containerNode, y.selector(".dijitTreeRow", E), function(
                b
              ) {
                a._onClick(H.getEnclosingWidget(this), b);
              }),
              y(
                this.containerNode,
                y.selector(".dijitTreeRow", "dblclick"),
                function(b) {
                  a._onDblClick(H.getEnclosingWidget(this), b);
                }
              )
            );
            this.model || this._store2model();
            this.own(
              l.after(
                this.model,
                "onChange",
                u.hitch(this, "_onItemChange"),
                !0
              ),
              l.after(
                this.model,
                "onChildrenChange",
                u.hitch(this, "_onItemChildrenChange"),
                !0
              ),
              l.after(
                this.model,
                "onDelete",
                u.hitch(this, "_onItemDelete"),
                !0
              )
            );
            this.inherited(arguments);
            if (this.dndController) {
              u.isString(this.dndController) &&
                (this.dndController = u.getObject(this.dndController));
              for (var b = {}, d = 0; d < this.dndParams.length; d++)
                this[this.dndParams[d]] &&
                  (b[this.dndParams[d]] = this[this.dndParams[d]]);
              this.dndController = new this.dndController(this, b);
            }
            this._load();
            this.onLoadDeferred = G(this.pendingCommandsPromise);
            this.onLoadDeferred.then(u.hitch(this, "onLoad"));
          },
          _store2model: function() {
            this._v10Compat = !0;
            m.deprecated(
              "Tree: from version 2.0, should specify a model object rather than a store/query"
            );
            var a = {
              id: this.id + "_ForestStoreModel",
              store: this.store,
              query: this.query,
              childrenAttrs: this.childrenAttr
            };
            this.params.mayHaveChildren &&
              (a.mayHaveChildren = u.hitch(this, "mayHaveChildren"));
            this.params.getItemChildren &&
              (a.getChildren = u.hitch(this, function(a, b, d) {
                this.getItemChildren(
                  this._v10Compat && a === this.model.root ? null : a,
                  b,
                  d
                );
              }));
            this.model = new N(a);
            this.showRoot = !!this.label;
          },
          onLoad: function() {},
          _load: function() {
            this.model.getRoot(
              u.hitch(this, function(a) {
                var b = (this.rootNode = this.tree._createTreeNode({
                  item: a,
                  tree: this,
                  isExpandable: !0,
                  label: this.label || this.getLabel(a),
                  labelType: this.model.labelType || "text",
                  textDir: this.textDir,
                  indent: this.showRoot ? 0 : -1
                }));
                this.showRoot
                  ? (this.domNode.setAttribute(
                      "aria-multiselectable",
                      !this.dndController.singular
                    ),
                    (this.rootLoadingIndicator.style.display = "none"))
                  : ((b.rowNode.style.display = "none"),
                    this.domNode.setAttribute("role", "presentation"),
                    this.domNode.removeAttribute("aria-expanded"),
                    this.domNode.removeAttribute("aria-multiselectable"),
                    this["aria-label"]
                      ? (b.containerNode.setAttribute(
                          "aria-label",
                          this["aria-label"]
                        ),
                        this.domNode.removeAttribute("aria-label"))
                      : this["aria-labelledby"] &&
                        (b.containerNode.setAttribute(
                          "aria-labelledby",
                          this["aria-labelledby"]
                        ),
                        this.domNode.removeAttribute("aria-labelledby")),
                    b.labelNode.setAttribute("role", "presentation"),
                    b.labelNode.removeAttribute("aria-selected"),
                    b.containerNode.setAttribute("role", "tree"),
                    b.containerNode.setAttribute("aria-expanded", "true"),
                    b.containerNode.setAttribute(
                      "aria-multiselectable",
                      !this.dndController.singular
                    ));
                this.containerNode.appendChild(b.domNode);
                a = this.model.getIdentity(a);
                this._itemNodesMap[a]
                  ? this._itemNodesMap[a].push(b)
                  : (this._itemNodesMap[a] = [b]);
                b._updateLayout();
                this._expandNode(b).then(
                  u.hitch(this, function() {
                    this._destroyed ||
                      ((this.rootLoadingIndicator.style.display = "none"),
                      this.expandChildrenDeferred.resolve(!0));
                  })
                );
              }),
              u.hitch(this, function(a) {
                console.error(this, ": error loading root: ", a);
              })
            );
          },
          getNodesByItem: function(a) {
            if (!a) return [];
            a = u.isString(a) ? a : this.model.getIdentity(a);
            return [].concat(this._itemNodesMap[a]);
          },
          _setSelectedItemAttr: function(a) {
            this.set("selectedItems", [a]);
          },
          _setSelectedItemsAttr: function(a) {
            var b = this;
            return (this.pendingCommandsPromise = this.pendingCommandsPromise.always(
              u.hitch(this, function() {
                var d = k.map(a, function(a) {
                    return !a || u.isString(a) ? a : b.model.getIdentity(a);
                  }),
                  c = [];
                k.forEach(d, function(a) {
                  c = c.concat(b._itemNodesMap[a] || []);
                });
                this.set("selectedNodes", c);
              })
            ));
          },
          _setPathAttr: function(a) {
            return a.length
              ? G(
                  this.set("paths", [a]).then(function(a) {
                    return a[0];
                  })
                )
              : G(
                  this.set("paths", []).then(function(a) {
                    return a[0];
                  })
                );
          },
          _setPathsAttr: function(a) {
            function b(a, c) {
              var e = a.shift(),
                v = k.filter(c, function(a) {
                  return a.getIdentity() == e;
                })[0];
              if (v)
                return a.length
                  ? d._expandNode(v).then(function() {
                      return b(a, v.getChildren());
                    })
                  : v;
              throw new M.PathError("Could not expand path at " + e);
            }
            var d = this;
            return G(
              (this.pendingCommandsPromise = this.pendingCommandsPromise
                .always(function() {
                  return e(
                    k.map(a, function(a) {
                      a = k.map(a, function(a) {
                        return a && u.isObject(a) ? d.model.getIdentity(a) : a;
                      });
                      if (a.length) return b(a, [d.rootNode]);
                      throw new M.PathError("Empty path");
                    })
                  );
                })
                .then(function(a) {
                  d.set("selectedNodes", a);
                  return d.paths;
                }))
            );
          },
          _setSelectedNodeAttr: function(a) {
            this.set("selectedNodes", [a]);
          },
          _setSelectedNodesAttr: function(a) {
            this.dndController.setSelection(a);
          },
          expandAll: function() {
            function a(d) {
              return b._expandNode(d).then(function() {
                var b = k.filter(d.getChildren() || [], function(a) {
                  return a.isExpandable;
                });
                return e(k.map(b, a));
              });
            }
            var b = this;
            return G(a(this.rootNode));
          },
          collapseAll: function() {
            function a(d) {
              var c = k.filter(d.getChildren() || [], function(a) {
                  return a.isExpandable;
                }),
                c = e(k.map(c, a));
              return !d.isExpanded || (d == b.rootNode && !b.showRoot)
                ? c
                : c.then(function() {
                    return b._collapseNode(d);
                  });
            }
            var b = this;
            return G(a(this.rootNode));
          },
          mayHaveChildren: function() {},
          getItemChildren: function() {},
          getLabel: function(a) {
            return this.model.getLabel(a);
          },
          getIconClass: function(a, b) {
            return !a || this.model.mayHaveChildren(a)
              ? b
                ? "dijitFolderOpened"
                : "dijitFolderClosed"
              : "dijitLeaf";
          },
          getLabelClass: function() {},
          getRowClass: function() {},
          getIconStyle: function() {},
          getLabelStyle: function() {},
          getRowStyle: function() {},
          getTooltip: function() {
            return "";
          },
          _onDownArrow: function(a, b) {
            (a = this._getNext(b)) && a.isTreeNode && this.focusNode(a);
          },
          _onUpArrow: function(a, b) {
            if ((a = b.getPreviousSibling()))
              for (b = a; b.isExpandable && b.isExpanded && b.hasChildren(); )
                (b = b.getChildren()), (b = b[b.length - 1]);
            else if (
              ((a = b.getParent()), this.showRoot || a !== this.rootNode)
            )
              b = a;
            b && b.isTreeNode && this.focusNode(b);
          },
          _onRightArrow: function(a, b) {
            b.isExpandable && !b.isExpanded
              ? this._expandNode(b)
              : b.hasChildren() &&
                (b = b.getChildren()[0]) &&
                b.isTreeNode &&
                this.focusNode(b);
          },
          _onLeftArrow: function(a, b) {
            b.isExpandable && b.isExpanded
              ? this._collapseNode(b)
              : (a = b.getParent()) &&
                a.isTreeNode &&
                (this.showRoot || a !== this.rootNode) &&
                this.focusNode(a);
          },
          focusLastChild: function() {
            var a = this._getLast();
            a && a.isTreeNode && this.focusNode(a);
          },
          _getFirst: function() {
            return this.showRoot
              ? this.rootNode
              : this.rootNode.getChildren()[0];
          },
          _getLast: function() {
            for (var a = this.rootNode; a.isExpanded; ) {
              var b = a.getChildren();
              if (!b.length) break;
              a = b[b.length - 1];
            }
            return a;
          },
          _getNext: function(a) {
            if (a.isExpandable && a.isExpanded && a.hasChildren())
              return a.getChildren()[0];
            for (; a && a.isTreeNode; ) {
              var b = a.getNextSibling();
              if (b) return b;
              a = a.getParent();
            }
            return null;
          },
          childSelector: ".dijitTreeRow",
          isExpandoNode: function(a, b) {
            return (
              g.isDescendant(a, b.expandoNode) ||
              g.isDescendant(a, b.expandoNodeText)
            );
          },
          _onNodePress: function(a, b) {
            this.focusNode(a);
          },
          __click: function(a, b, d, c) {
            var e = this.isExpandoNode(b.target, a);
            a.isExpandable && (d || e)
              ? this._onExpandoClick({ node: a })
              : (this._publish("execute", { item: a.item, node: a, evt: b }),
                this[c](a.item, a, b),
                this.focusNode(a));
            b.stopPropagation();
            b.preventDefault();
          },
          _onClick: function(a, b) {
            this.__click(a, b, this.openOnClick, "onClick");
          },
          _onDblClick: function(a, b) {
            this.__click(a, b, this.openOnDblClick, "onDblClick");
          },
          _onExpandoClick: function(a) {
            a = a.node;
            this.focusNode(a);
            a.isExpanded ? this._collapseNode(a) : this._expandNode(a);
          },
          onClick: function() {},
          onDblClick: function() {},
          onOpen: function() {},
          onClose: function() {},
          _getNextNode: function(a) {
            m.deprecated(
              this.declaredClass +
                "::_getNextNode(node) is deprecated. Use _getNext(node) instead.",
              "",
              "2.0"
            );
            return this._getNext(a);
          },
          _getRootOrFirstNode: function() {
            m.deprecated(
              this.declaredClass +
                "::_getRootOrFirstNode() is deprecated. Use _getFirst() instead.",
              "",
              "2.0"
            );
            return this._getFirst();
          },
          _collapseNode: function(a) {
            a._expandNodeDeferred && delete a._expandNodeDeferred;
            if ("Loading" != a.state && a.isExpanded) {
              var b = a.collapse();
              this.onClose(a.item, a);
              this._state(a, !1);
              this._startPaint(b);
              return b;
            }
          },
          _expandNode: function(a) {
            if (a._expandNodeDeferred) return a._expandNodeDeferred;
            var b = this.model,
              d = a.item,
              c = this;
            a._loadDeferred ||
              (a.markProcessing(),
              (a._loadDeferred = new f()),
              b.getChildren(
                d,
                function(b) {
                  a.unmarkProcessing();
                  a.setChildItems(b).then(function() {
                    a._loadDeferred.resolve(b);
                  });
                },
                function(b) {
                  console.error(
                    c,
                    ": error loading " + a.label + " children: ",
                    b
                  );
                  a._loadDeferred.reject(b);
                }
              ));
            b = a._loadDeferred.then(
              u.hitch(this, function() {
                var b = a.expand();
                this.onOpen(a.item, a);
                this._state(a, !0);
                return b;
              })
            );
            this._startPaint(b);
            return b;
          },
          focusNode: function(a) {
            for (
              var b = [], d = this.domNode;
              d && d.tagName && "IFRAME" !== d.tagName.toUpperCase();
              d = d.parentNode
            )
              b.push({
                domNode: d.contentWindow || d,
                scrollLeft: d.scrollLeft || 0,
                scrollTop: d.scrollTop || 0
              });
            this.focusChild(a);
            this.defer(function() {
              for (var a = 0, d = b.length; a < d; a++)
                (b[a].domNode.scrollLeft = b[a].scrollLeft),
                  (b[a].domNode.scrollTop = b[a].scrollTop);
            }, 0);
          },
          _onNodeMouseEnter: function() {},
          _onNodeMouseLeave: function() {},
          _onItemChange: function(a) {
            var b = this.model.getIdentity(a);
            if ((b = this._itemNodesMap[b])) {
              var d = this.getLabel(a),
                c = this.getTooltip(a);
              k.forEach(b, function(b) {
                b.set({ item: a, label: d, tooltip: c });
                b._updateItemClasses(a);
              });
            }
          },
          _onItemChildrenChange: function(a, b) {
            a = this.model.getIdentity(a);
            (a = this._itemNodesMap[a]) &&
              k.forEach(a, function(a) {
                a.setChildItems(b);
              });
          },
          _onItemDelete: function(a) {
            a = this.model.getIdentity(a);
            var b = this._itemNodesMap[a];
            b &&
              (k.forEach(
                b,
                function(a) {
                  this.dndController.removeTreeNode(a);
                  var b = a.getParent();
                  b && b.removeChild(a);
                  this.lastFocusedChild &&
                    !g.isDescendant(
                      this.lastFocusedChild.domNode,
                      this.domNode
                    ) &&
                    delete this.lastFocusedChild;
                  this.focusedChild &&
                    !g.isDescendant(this.focusedChild.domNode, this.domNode) &&
                    this.focus();
                  a.destroyRecursive();
                },
                this
              ),
              delete this._itemNodesMap[a]);
          },
          _initState: function() {
            this._openedNodes = {};
            if (this.persist && this.cookieName) {
              var a = q(this.cookieName);
              a &&
                k.forEach(
                  a.split(","),
                  function(a) {
                    this._openedNodes[a] = !0;
                  },
                  this
                );
            }
          },
          _state: function(a, b) {
            if (!this.persist) return !1;
            var d = k
              .map(
                a.getTreePath(),
                function(a) {
                  return this.model.getIdentity(a);
                },
                this
              )
              .join("/");
            if (1 === arguments.length) return this._openedNodes[d];
            b ? (this._openedNodes[d] = !0) : delete this._openedNodes[d];
            this._saveExpandedNodes();
          },
          _saveExpandedNodes: function() {
            if (this.persist && this.cookieName) {
              var a = [],
                b;
              for (b in this._openedNodes) a.push(b);
              q(this.cookieName, a.join(","), { expires: 365 });
            }
          },
          destroy: function() {
            this._curSearch &&
              (this._curSearch.timer.remove(), delete this._curSearch);
            this.rootNode && this.rootNode.destroyRecursive();
            this.dndController &&
              !u.isString(this.dndController) &&
              this.dndController.destroy();
            this.rootNode = null;
            this.inherited(arguments);
          },
          destroyRecursive: function() {
            this.destroy();
          },
          resize: function(a) {
            a && t.setMarginBox(this.domNode, a);
            this._nodePixelIndent =
              t.position(this.tree.indentDetector).w || this._nodePixelIndent;
            this.expandChildrenDeferred.then(
              u.hitch(this, function() {
                this.rootNode.set("indent", this.showRoot ? 0 : -1);
                this._adjustWidths();
              })
            );
          },
          _outstandingPaintOperations: 0,
          _startPaint: function(a) {
            this._outstandingPaintOperations++;
            this._adjustWidthsTimer &&
              (this._adjustWidthsTimer.remove(),
              delete this._adjustWidthsTimer);
            var b = u.hitch(this, function() {
              this._outstandingPaintOperations--;
              0 >= this._outstandingPaintOperations &&
                !this._adjustWidthsTimer &&
                this._started &&
                (this._adjustWidthsTimer = this.defer("_adjustWidths"));
            });
            D(a, b, b);
          },
          _adjustWidths: function() {
            this._adjustWidthsTimer &&
              (this._adjustWidthsTimer.remove(),
              delete this._adjustWidthsTimer);
            this.containerNode.style.width = "auto";
            this.containerNode.style.width =
              this.domNode.scrollWidth > this.domNode.offsetWidth
                ? "auto"
                : "100%";
          },
          _createTreeNode: function(a) {
            return new O(a);
          },
          focus: function() {
            this.lastFocusedChild
              ? this.focusNode(this.lastFocusedChild)
              : this.focusFirstChild();
          }
        });
        d("dojo-bidi") &&
          M.extend({
            _setTextDirAttr: function(a) {
              a &&
                this.textDir != a &&
                (this._set("textDir", a), this.rootNode.set("textDir", a));
            }
          });
        M.PathError = b("TreePathError");
        M._TreeNode = O;
        return M;
      });
    },
    "dijit/tree/TreeStoreModel": function() {
      define([
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/_base/declare",
        "dojo/_base/lang"
      ], function(k, l, q, n) {
        return q("dijit.tree.TreeStoreModel", null, {
          store: null,
          childrenAttrs: ["children"],
          newItemIdAttr: "id",
          labelAttr: "",
          root: null,
          query: null,
          deferItemLoadingUntilExpand: !1,
          constructor: function(f) {
            n.mixin(this, f);
            this.connects = [];
            f = this.store;
            if (!f.getFeatures()["dojo.data.api.Identity"])
              throw Error(
                "dijit.tree.TreeStoreModel: store must support dojo.data.Identity"
              );
            f.getFeatures()["dojo.data.api.Notification"] &&
              (this.connects = this.connects.concat([
                l.after(f, "onNew", n.hitch(this, "onNewItem"), !0),
                l.after(f, "onDelete", n.hitch(this, "onDeleteItem"), !0),
                l.after(f, "onSet", n.hitch(this, "onSetItem"), !0)
              ]));
          },
          destroy: function() {
            for (var f; (f = this.connects.pop()); ) f.remove();
          },
          getRoot: function(f, e) {
            this.root
              ? f(this.root)
              : this.store.fetch({
                  query: this.query,
                  onComplete: n.hitch(this, function(e) {
                    if (1 != e.length)
                      throw Error(
                        "dijit.tree.TreeStoreModel: root query returned " +
                          e.length +
                          " items, but must return exactly one"
                      );
                    this.root = e[0];
                    f(this.root);
                  }),
                  onError: e
                });
          },
          mayHaveChildren: function(f) {
            return k.some(
              this.childrenAttrs,
              function(e) {
                return this.store.hasAttribute(f, e);
              },
              this
            );
          },
          getChildren: function(f, e, g) {
            var h = this.store;
            if (h.isItemLoaded(f)) {
              for (var l = [], c = 0; c < this.childrenAttrs.length; c++)
                var b = h.getValues(f, this.childrenAttrs[c]), l = l.concat(b);
              var a = 0;
              this.deferItemLoadingUntilExpand ||
                k.forEach(l, function(b) {
                  h.isItemLoaded(b) || a++;
                });
              0 == a
                ? e(l)
                : k.forEach(l, function(b, d) {
                    h.isItemLoaded(b) ||
                      h.loadItem({
                        item: b,
                        onItem: function(b) {
                          l[d] = b;
                          0 == --a && e(l);
                        },
                        onError: g
                      });
                  });
            } else {
              var d = n.hitch(this, arguments.callee);
              h.loadItem({
                item: f,
                onItem: function(a) {
                  d(a, e, g);
                },
                onError: g
              });
            }
          },
          isItem: function(f) {
            return this.store.isItem(f);
          },
          fetchItemByIdentity: function(f) {
            this.store.fetchItemByIdentity(f);
          },
          getIdentity: function(f) {
            return this.store.getIdentity(f);
          },
          getLabel: function(f) {
            return this.labelAttr
              ? this.store.getValue(f, this.labelAttr)
              : this.store.getLabel(f);
          },
          newItem: function(f, e, g) {
            var h = { parent: e, attribute: this.childrenAttrs[0] },
              k;
            this.newItemIdAttr && f[this.newItemIdAttr]
              ? this.fetchItemByIdentity({
                  identity: f[this.newItemIdAttr],
                  scope: this,
                  onItem: function(c) {
                    c
                      ? this.pasteItem(c, null, e, !0, g)
                      : (k = this.store.newItem(f, h)) &&
                        void 0 != g &&
                        this.pasteItem(k, e, e, !1, g);
                  }
                })
              : (k = this.store.newItem(f, h)) &&
                void 0 != g &&
                this.pasteItem(k, e, e, !1, g);
          },
          pasteItem: function(f, e, g, h, l) {
            var c = this.store,
              b = this.childrenAttrs[0];
            e &&
              k.forEach(this.childrenAttrs, function(a) {
                if (c.containsValue(e, a, f)) {
                  if (!h) {
                    var d = k.filter(c.getValues(e, a), function(a) {
                      return a != f;
                    });
                    c.setValues(e, a, d);
                  }
                  b = a;
                }
              });
            if (g)
              if ("number" == typeof l) {
                var a = c.getValues(g, b).slice();
                a.splice(l, 0, f);
                c.setValues(g, b, a);
              } else c.setValues(g, b, c.getValues(g, b).concat(f));
          },
          onChange: function() {},
          onChildrenChange: function() {},
          onDelete: function() {},
          onNewItem: function(f, e) {
            e &&
              this.getChildren(
                e.item,
                n.hitch(this, function(f) {
                  this.onChildrenChange(e.item, f);
                })
              );
          },
          onDeleteItem: function(f) {
            this.onDelete(f);
          },
          onSetItem: function(f, e) {
            if (-1 != k.indexOf(this.childrenAttrs, e))
              this.getChildren(
                f,
                n.hitch(this, function(e) {
                  this.onChildrenChange(f, e);
                })
              );
            else this.onChange(f);
          }
        });
      });
    },
    "dijit/tree/ForestStoreModel": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "./TreeStoreModel"
      ], function(k, l, q, n, f) {
        return l("dijit.tree.ForestStoreModel", f, {
          rootId: "$root$",
          rootLabel: "ROOT",
          query: null,
          constructor: function(e) {
            this.root = {
              store: this,
              root: !0,
              id: e.rootId,
              label: e.rootLabel,
              children: e.rootChildren
            };
          },
          mayHaveChildren: function(e) {
            return e === this.root || this.inherited(arguments);
          },
          getChildren: function(e, f, h) {
            e === this.root
              ? this.root.children
                ? f(this.root.children)
                : this.store.fetch({
                    query: this.query,
                    onComplete: n.hitch(this, function(e) {
                      this.root.children = e;
                      f(e);
                    }),
                    onError: h
                  })
              : this.inherited(arguments);
          },
          isItem: function(e) {
            return e === this.root ? !0 : this.inherited(arguments);
          },
          fetchItemByIdentity: function(e) {
            if (e.identity == this.root.id) {
              var f = e.scope || q.global;
              e.onItem && e.onItem.call(f, this.root);
            } else this.inherited(arguments);
          },
          getIdentity: function(e) {
            return e === this.root ? this.root.id : this.inherited(arguments);
          },
          getLabel: function(e) {
            return e === this.root
              ? this.root.label
              : this.inherited(arguments);
          },
          newItem: function(e, f, h) {
            return f === this.root
              ? (this.onNewRootItem(e), this.store.newItem(e))
              : this.inherited(arguments);
          },
          onNewRootItem: function() {},
          pasteItem: function(e, f, h, k, c) {
            if (f === this.root && !k) this.onLeaveRoot(e);
            this.inherited(arguments, [
              e,
              f === this.root ? null : f,
              h === this.root ? null : h,
              k,
              c
            ]);
            if (h === this.root) this.onAddToRoot(e);
          },
          onAddToRoot: function(e) {
            console.log(this, ": item ", e, " added to root");
          },
          onLeaveRoot: function(e) {
            console.log(this, ": item ", e, " removed from root");
          },
          _requeryTop: function() {
            var e = this.root.children || [];
            this.store.fetch({
              query: this.query,
              onComplete: n.hitch(this, function(f) {
                this.root.children = f;
                if (
                  e.length != f.length ||
                  k.some(e, function(e, g) {
                    return f[g] != e;
                  })
                )
                  this.onChildrenChange(this.root, f);
              })
            });
          },
          onNewItem: function(e, f) {
            this._requeryTop();
            this.inherited(arguments);
          },
          onDeleteItem: function(e) {
            -1 != k.indexOf(this.root.children, e) && this._requeryTop();
            this.inherited(arguments);
          },
          onSetItem: function(e, f, h, k) {
            this._requeryTop();
            this.inherited(arguments);
          }
        });
      });
    },
    "dijit/tree/_dndSelector": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/dnd/common dojo/dom dojo/mouse dojo/on dojo/touch ../a11yclick ./_dndContainer".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b) {
        return l("dijit.tree._dndSelector", b, {
          constructor: function() {
            this.selection = {};
            this.anchor = null;
            this.events.push(
              h(this.tree.domNode, t.press, n.hitch(this, "onMouseDown")),
              h(this.tree.domNode, t.release, n.hitch(this, "onMouseUp")),
              h(this.tree.domNode, t.move, n.hitch(this, "onMouseMove")),
              h(this.tree.domNode, c.press, n.hitch(this, "onClickPress")),
              h(this.tree.domNode, c.release, n.hitch(this, "onClickRelease"))
            );
          },
          singular: !1,
          getSelectedTreeNodes: function() {
            var a = [],
              b = this.selection,
              c;
            for (c in b) a.push(b[c]);
            return a;
          },
          selectNone: function() {
            this.setSelection([]);
            return this;
          },
          destroy: function() {
            this.inherited(arguments);
            this.selection = this.anchor = null;
          },
          addTreeNode: function(a, b) {
            this.setSelection(this.getSelectedTreeNodes().concat([a]));
            b && (this.anchor = a);
            return a;
          },
          removeTreeNode: function(a) {
            var b = k.filter(this.getSelectedTreeNodes(), function(b) {
              return !e.isDescendant(b.domNode, a.domNode);
            });
            this.setSelection(b);
            return a;
          },
          isTreeNodeSelected: function(a) {
            return a.id && !!this.selection[a.id];
          },
          setSelection: function(a) {
            var b = this.getSelectedTreeNodes();
            k.forEach(
              this._setDifference(b, a),
              n.hitch(this, function(a) {
                a.setSelected(!1);
                this.anchor == a && delete this.anchor;
                delete this.selection[a.id];
              })
            );
            k.forEach(
              this._setDifference(a, b),
              n.hitch(this, function(a) {
                a.setSelected(!0);
                this.selection[a.id] = a;
              })
            );
            this._updateSelectionProperties();
          },
          _setDifference: function(a, b) {
            k.forEach(b, function(a) {
              a.__exclude__ = !0;
            });
            a = k.filter(a, function(a) {
              return !a.__exclude__;
            });
            k.forEach(b, function(a) {
              delete a.__exclude__;
            });
            return a;
          },
          _updateSelectionProperties: function() {
            var a = this.getSelectedTreeNodes(),
              b = [],
              c = [];
            k.forEach(
              a,
              function(a) {
                var d = a.getTreePath();
                c.push(a);
                b.push(d);
              },
              this
            );
            a = k.map(c, function(a) {
              return a.item;
            });
            this.tree._set("paths", b);
            this.tree._set("path", b[0] || []);
            this.tree._set("selectedNodes", c);
            this.tree._set("selectedNode", c[0] || null);
            this.tree._set("selectedItems", a);
            this.tree._set("selectedItem", a[0] || null);
          },
          onClickPress: function(a) {
            if (
              !(
                this.current &&
                this.current.isExpandable &&
                this.tree.isExpandoNode(a.target, this.current)
              )
            ) {
              "mousedown" == a.type && g.isLeft(a) && a.preventDefault();
              var b =
                "keydown" == a.type ? this.tree.focusedChild : this.current;
              if (b) {
                var c = f.getCopyKeyState(a),
                  e = b.id;
                this.singular || a.shiftKey || !this.selection[e]
                  ? ((this._doDeselect = !1), this.userSelect(b, c, a.shiftKey))
                  : (this._doDeselect = !0);
              }
            }
          },
          onClickRelease: function(a) {
            this._doDeselect &&
              ((this._doDeselect = !1),
              this.userSelect(
                "keyup" == a.type ? this.tree.focusedChild : this.current,
                f.getCopyKeyState(a),
                a.shiftKey
              ));
          },
          onMouseMove: function() {
            this._doDeselect = !1;
          },
          onMouseDown: function() {},
          onMouseUp: function() {},
          _compareNodes: function(a, b) {
            if (a === b) return 0;
            if ("sourceIndex" in document.documentElement)
              return a.sourceIndex - b.sourceIndex;
            if ("compareDocumentPosition" in document.documentElement)
              return a.compareDocumentPosition(b) & 2 ? 1 : -1;
            if (document.createRange) {
              var d = doc.createRange();
              d.setStartBefore(a);
              a = doc.createRange();
              a.setStartBefore(b);
              return d.compareBoundaryPoints(d.END_TO_END, a);
            }
            throw Error(
              "dijit.tree._compareNodes don't know how to compare two different nodes in this browser"
            );
          },
          userSelect: function(a, b, c) {
            if (this.singular)
              this.anchor == a && b
                ? this.selectNone()
                : (this.setSelection([a]), (this.anchor = a));
            else if (c && this.anchor) {
              b = this._compareNodes(this.anchor.rowNode, a.rowNode);
              c = this.anchor;
              0 > b ? (b = c) : ((b = a), (a = c));
              for (c = []; b != a; ) c.push(b), (b = this.tree._getNext(b));
              c.push(a);
              this.setSelection(c);
            } else
              this.selection[a.id] && b
                ? this.removeTreeNode(a)
                : b
                ? this.addTreeNode(a, !0)
                : (this.setSelection([a]), (this.anchor = a));
          },
          getItem: function(a) {
            return { data: this.selection[a], type: ["treeNode"] };
          },
          forInSelectedItems: function(a, b) {
            b = b || q.global;
            for (var d in this.selection) a.call(b, this.getItem(d), d, this);
          }
        });
      });
    },
    "dijit/tree/_dndContainer": function() {
      define("dojo/aspect dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/on dojo/touch".split(
        " "
      ), function(k, l, q, n, f, e) {
        return l("dijit.tree._dndContainer", null, {
          constructor: function(g, h) {
            this.tree = g;
            this.node = g.domNode;
            n.mixin(this, h);
            this.containerState = "";
            q.add(this.node, "dojoDndContainer");
            this.events = [
              f(this.node, e.enter, n.hitch(this, "onOverEvent")),
              f(this.node, e.leave, n.hitch(this, "onOutEvent")),
              k.after(
                this.tree,
                "_onNodeMouseEnter",
                n.hitch(this, "onMouseOver"),
                !0
              ),
              k.after(
                this.tree,
                "_onNodeMouseLeave",
                n.hitch(this, "onMouseOut"),
                !0
              ),
              f(this.node, "dragstart, selectstart", function(e) {
                e.preventDefault();
              })
            ];
          },
          destroy: function() {
            for (var e; (e = this.events.pop()); ) e.remove();
            this.node = this.parent = null;
          },
          onMouseOver: function(e) {
            this.current = e;
          },
          onMouseOut: function() {
            this.current = null;
          },
          _changeState: function(e, f) {
            var g = "dojoDnd" + e;
            e = e.toLowerCase() + "State";
            q.replace(this.node, g + f, g + this[e]);
            this[e] = f;
          },
          _addItemClass: function(e, f) {
            q.add(e, "dojoDndItem" + f);
          },
          _removeItemClass: function(e, f) {
            q.remove(e, "dojoDndItem" + f);
          },
          onOverEvent: function() {
            this._changeState("Container", "Over");
          },
          onOutEvent: function() {
            this._changeState("Container", "");
          }
        });
      });
    },
    "jimu/dijit/LayerChooserFromMapWithDropbox": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/on dojo/keys dojo/Evented dojo/Deferred dijit/popup dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./templates/LayerChooserFromMapWithDropbox.html jimu/LayerInfos/LayerInfos".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b, a) {
        return k([t, c, e], {
          templateString: b,
          baseClass: "jimu-layer-chooser-from-map-withdropbox",
          declaredClass: "jimu.dijit.LayerChooserFromMapWithDropbox",
          _selectedItem: null,
          _isLayerChooserShow: !1,
          layerInfosObj: null,
          layerChooser: null,
          customClass: "",
          postMixInProperties: function() {
            this.inherited(arguments);
            this.nls = window.jimuNls.queryableLayerSource;
            this.nls.customSelectLayer = this.label
              ? this.label
              : this.nls.selectLayer;
          },
          postCreate: function() {
            this.inherited(arguments);
            this.layerInfosObj = a.getInstanceSync();
            this.layerChooser.domNode.style.zIndex = 1;
            this.layerChooser.tree.domNode.style.borderTop = "0";
            this.layerChooser.tree.domNode.style.maxHeight = "290px";
            this.own(
              n(
                this.layerChooser,
                "tree-click",
                l.hitch(this, this._onTreeClick)
              )
            );
            this.own(
              n(
                this.layerChooser,
                "update",
                l.hitch(this, this._onLayerChooserUpdate)
              )
            );
            this.own(
              n(document.body, "click", l.hitch(this, this._onBodyClicked))
            );
            this.own(
              n(
                document.body,
                "keydown",
                l.hitch(this, function(a) {
                  a.keyCode === f.ENTER && this._onBodyClicked(a);
                })
              )
            );
            this.own(
              n(
                this.layerChooser.domNode,
                "keydown",
                l.hitch(this, function(a) {
                  a.keyCode === f.ESCAPE && this.hideLayerChooser();
                })
              )
            );
          },
          destroy: function() {
            this.hideLayerChooser();
            this.layerChooser && this.layerChooser.destroy();
            this.layerChooser = null;
            this.inherited(arguments);
          },
          getLayerChooser: function() {
            return this.layerChooser;
          },
          setSelectedLayer: function(a) {
            var b = new g();
            if (a) {
              var d = this.layerInfosObj.getLayerInfoById(a.id);
              d
                ? this.layerChooser.filter(d).then(
                    l.hitch(this, function(c) {
                      c
                        ? (this._onSelectNewItem({
                            layerInfo: d,
                            name: d.title,
                            url: a.url
                          }),
                          b.resolve(!0))
                        : b.resolve(!1);
                    }),
                    l.hitch(this, function() {
                      b.resolve(!1);
                    })
                  )
                : b.resolve(!1);
            } else this._onSelectNewItem(null), b.resolve(!0);
            return b;
          },
          getSelectedItem: function() {
            return this._selectedItem;
          },
          getSelectedItems: function() {
            return [this._selectedItem];
          },
          _onBodyClicked: function(a) {
            a = a.target || a.srcElement;
            a === this.domNode ||
              q.isDescendant(a, this.domNode) ||
              a === this.layerChooser.domNode ||
              q.isDescendant(a, this.layerChooser.domNode) ||
              this.hideLayerChooser();
          },
          _onDropDownClick: function(a) {
            a.stopPropagation();
            a.preventDefault();
            this._isLayerChooserShow
              ? this.hideLayerChooser()
              : ((this.isActive = !0), this.showLayerChooser());
          },
          _onDropDownKeydown: function(a) {
            a.keyCode === f.ENTER && this._onDropDownClick(a);
          },
          _getSelectedItems: function() {
            return this.layerChooser.getSelectedItems();
          },
          showLayerChooser: function() {
            this.layerChooser.domNode.style.minWidth =
              this.domNode.clientWidth + 2 + "px";
            h.open({
              parent: this,
              popup: this.layerChooser,
              around: this.domNode
            });
            var a = this.layerChooser.domNode.parentNode;
            a &&
              (q.addClass(a, "jimu-layer-chooser-from-map-withdropbox-popup"),
              this.customClass && q.addClass(a, this.customClass),
              this.layerChooser.tree.domNode.focus());
            this._isLayerChooserShow = !0;
          },
          hideLayerChooser: function() {
            h.close(this.layerChooser);
            this._isLayerChooserShow = !1;
            this.isActive && (this.dropDownBtn.focus(), (this.isActive = !1));
          },
          _onLayerChooserUpdate: function() {
            this._selectedItem &&
              this.layerChooser.onlyShowVisible &&
              !this._selectedItem.layerInfo.isShowInMap() &&
              ((this._selectedItem = null), this.emit("selection-change", []));
          },
          _onSelectNewItem: function(a) {
            var b = l.getObject("layerInfo.id", !1, this._selectedItem) || -1,
              c = l.getObject("layerInfo.id", !1, a) || -1,
              b = b !== c;
            this._selectedItem = a;
            this.hideLayerChooser();
            a = l.getObject("layerInfo.title", !1, this._selectedItem) || "";
            this.layerNameNode.innerHTML = a;
            q.setAttr(this.layerNameNode, "title", a);
            a = l.getObject("layerInfo.layerObject", !1, this._selectedItem);
            b && this.emit("selection-change", [a]);
          },
          _onTreeClick: function() {
            var a = this._getSelectedItems();
            this._onSelectNewItem(0 < a.length ? a[0] : null);
          }
        });
      });
    },
    "jimu/dijit/FeatureSetChooserForSingleLayer": function() {
      define("dojo/on dojo/Evented dojo/_base/lang dojo/_base/array dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin jimu/dijit/DrawBox jimu/dijit/_FeatureSetChooserCore esri/symbols/jsonUtils".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b) {
        return f([e, g, h, l], {
          baseClass: "jimu-single-layer-featureset-chooser",
          templateString: "\x3cdiv\x3e\x3c/div\x3e",
          drawBox: null,
          map: null,
          featureLayer: null,
          updateSelection: !1,
          postCreate: function() {
            this.inherited(arguments);
            var a = b.fromJson({
              style: "esriSFSSolid",
              color: [79, 129, 189, 77],
              type: "esriSFS",
              outline: {
                style: "esriSLSSolid",
                color: [54, 93, 141, 255],
                width: 1.5,
                type: "esriSLS"
              }
            });
            this.drawBox = new t({
              map: this.map,
              showClear: !0,
              keepOneGraphic: !0,
              geoTypes: ["EXTENT"]
            });
            this.drawBox.setPolygonSymbol(a);
            a = this.drawBox.getDrawItemIcons();
            n.forEach(
              a,
              q.hitch(this, function(a) {
                a.title = "";
              })
            );
            this.drawBox.extentIcon.title =
              window.jimuNls.spatialFilterByFeatures.drawShapesTip;
            this.drawBox.placeAt(this.domNode);
            this.own(
              k(
                this.drawBox,
                "user-clear",
                q.hitch(this, this._onDrawBoxUserClear)
              )
            );
            this.own(
              k(
                this.drawBox,
                "draw-activate",
                q.hitch(this, function() {
                  this.emit("draw-activate");
                })
              )
            );
            this.own(
              k(
                this.drawBox,
                "draw-deactivate",
                q.hitch(this, function() {
                  this.emit("draw-deactivate");
                })
              )
            );
            this.own(
              k(this.drawBox, "draw-end", q.hitch(this, this._onDrawEnd))
            );
            this.featureSetChooserCore = new c({
              map: this.map,
              featureLayer: this.featureLayer,
              drawBox: this.drawBox,
              updateSelection: this.updateSelection
            });
            this.own(
              k(
                this.featureSetChooserCore,
                "loading",
                q.hitch(this, function() {
                  this.emit("loading");
                })
              )
            );
            this.own(
              k(
                this.featureSetChooserCore,
                "unloading",
                q.hitch(this, function() {
                  this.emit("unloading");
                })
              )
            );
            this.own(
              k(
                this.featureLayer,
                "visibility-change",
                q.hitch(this, function() {
                  this.featureLayer.visible
                    ? this.drawBox.enable()
                    : this.drawBox.disable();
                })
              )
            );
          },
          getFeatures: function() {
            return this.featureSetChooserCore.getFeatures();
          },
          syncGetFeatures: function() {
            return this.featureSetChooserCore.syncGetFeatures();
          },
          disable: function() {
            this.drawBox.disable();
          },
          enable: function() {
            this.drawBox.enable();
          },
          deactivate: function() {
            this.drawBox.deactivate();
          },
          clearAllGraphics: function() {
            this.featureSetChooserCore.clear(!1);
          },
          isLoading: function() {
            return this.featureSetChooserCore.isLoading();
          },
          getFeatureLayer: function() {
            return this.featureLayer;
          },
          destroy: function() {
            this.featureSetChooserCore && this.featureSetChooserCore.destroy();
            this.featureSetChooserCore = null;
            this.inherited(arguments);
          },
          _onDrawEnd: function() {
            this.drawBox.clear();
          },
          _onDrawBoxUserClear: function() {
            this.clearAllGraphics();
            this.emit("user-clear");
          },
          showMiddleFeatureLayer: function() {
            this.featureSetChooserCore &&
              this.featureSetChooserCore.showMiddleFeatureLayer();
          },
          hideMiddleFeatureLayer: function() {
            this.featureSetChooserCore &&
              this.featureSetChooserCore.hideMiddleFeatureLayer();
          }
        });
      });
    },
    "jimu/dijit/_FeatureSetChooserCore": function() {
      define("dojo/on dojo/sniff dojo/Evented dojo/Deferred dojo/_base/lang dojo/_base/array dojo/_base/declare jimu/utils jimu/symbolUtils jimu/SelectionManager jimu/LayerInfos/LayerInfos esri/graphic esri/tasks/query esri/tasks/QueryTask esri/layers/FeatureLayer esri/symbols/jsonUtils esri/geometry/geometryEngine".split(
        " "
      ), function(k, l, q, n, f, e, g, h, t, c, b, a, d, m, w, u, y) {
        return g([q], {
          baseClass: "jimu-featureset-chooser-core",
          _middleFeatureLayer: null,
          _isLoading: !1,
          _def: null,
          _isDestroyed: !1,
          _handles: null,
          selectionManager: null,
          layerInfosObj: null,
          map: null,
          featureLayer: null,
          drawBox: null,
          updateSelection: !1,
          fullyWithin: !1,
          constructor: function(a) {
            f.mixin(this, a);
            this.layerInfosObj = b.getInstanceSync();
            this.selectionManager = c.getInstance();
            this.featureLayer.getSelectionSymbol() ||
              this.selectionManager.setSelectionSymbol(this.featureLayer);
            a = h.getFeatureLayerDefinition(this.featureLayer);
            delete a.id;
            this._middleFeatureLayer = new w(
              { layerDefinition: a, featureSet: null },
              { id: "featureLayer_" + h.getRandomString() }
            );
            a = null;
            var d = this._middleFeatureLayer.geometryType;
            "esriGeometryPoint" === d
              ? (a = t.getDefaultMarkerSymbol())
              : "esriGeometryPolyline" === d
              ? (a = t.getDefaultLineSymbol())
              : "esriGeometryPolygon" === d &&
                (a = u.fromJson({
                  style: "esriSFSSolid",
                  color: [79, 129, 189, 77],
                  type: "esriSFS",
                  outline: {
                    style: "esriSLSSolid",
                    color: [54, 93, 141, 255],
                    width: 1.5,
                    type: "esriSLS"
                  }
                }));
            this._middleFeatureLayer.setSelectionSymbol(a);
            a = k(
              this.drawBox,
              "user-clear",
              f.hitch(this, this._onDrawBoxUserClear)
            );
            d = k(this.drawBox, "draw-end", f.hitch(this, this._onDrawEnd));
            this._handles = [a, d];
          },
          hideMiddleFeatureLayer: function() {
            if (this._middleFeatureLayer) {
              this._middleFeatureLayer.hide();
              var a = this.selectionManager.getDisplayLayer(
                this._middleFeatureLayer.id
              );
              a && a.hide();
            }
          },
          showMiddleFeatureLayer: function() {
            if (this._middleFeatureLayer) {
              this._middleFeatureLayer.show();
              var a = this.selectionManager.getDisplayLayer(
                this._middleFeatureLayer.id
              );
              a && a.show();
            }
          },
          clear: function(a) {
            this.drawBox.clear();
            this._clearMiddleFeatureLayer();
            a && this.selectionManager.clearSelection(this.featureLayer);
          },
          getFeatures: function() {
            var a = new n(),
              b = f.hitch(this, function() {
                var b = this.syncGetFeatures();
                a.resolve(b);
              }),
              c = f.hitch(this, function(b) {
                a.reject(b);
              });
            1 === this._getDeferredStatus(this._def)
              ? this._def.then(b, c)
              : b();
            return a;
          },
          syncGetFeatures: function() {
            return (this.updateSelection
              ? this.featureLayer
              : this._middleFeatureLayer
            ).getSelectedFeatures();
          },
          isLoading: function() {
            return 1 === this._getDeferredStatus(this._def);
          },
          _onLoading: function() {
            this.drawBox.deactivate();
            this.emit("loading");
          },
          _onUnloading: function() {
            this.emit("unloading");
          },
          _getDeferredStatus: function(a) {
            var b = 0;
            return (b = a ? (a.isResolved() ? 2 : a.isRejected() ? -1 : 1) : 0);
          },
          _onDrawEnd: function(a, b, c, d, e, g) {
            console.log(b, c);
            if (this.isLoading()) throw "should not draw when loading";
            if (this.featureLayer.visible) {
              var k = new n();
              this._def = k;
              var h = w.SELECTION_NEW;
              d && (h = w.SELECTION_ADD);
              l("mac")
                ? g && (h = w.SELECTION_SUBTRACT)
                : e && (h = w.SELECTION_SUBTRACT);
              this.emit("loading");
              this._getFeaturesByGeometry(a.geometry).then(
                f.hitch(this, function(a) {
                  this.selectionManager.updateSelectionByFeatures(
                    this.updateSelection
                      ? this.featureLayer
                      : this._middleFeatureLayer,
                    a,
                    h
                  );
                  this._onUnloading();
                  k.resolve(a);
                }),
                f.hitch(this, function(a) {
                  console.error(a);
                  this._onUnloading();
                  k.reject(a);
                })
              );
            }
          },
          _addTolerance: function(a) {
            var b = (2.54 * this.map.getScale()) / 9600;
            return y.buffer(a, 10 * b, "meters");
          },
          _getFeaturesByGeometry: function(b) {
            "point" === b.type &&
              "esriGeometryPoint" === this.featureLayer.geometryType &&
              (b = this._addTolerance(b));
            var c = new n(),
              g = [];
            if (
              this.featureLayer.getMap() &&
              this.featureLayer.mode !== w.MODE_SELECTION
            )
              (b = this.selectionManager.getClientFeaturesByGeometry(
                this.featureLayer,
                b,
                this.fullyWithin
              )),
                0 < b.length &&
                  (g = e.map(
                    b,
                    f.hitch(this, function(b) {
                      return new a(b.toJson());
                    })
                  )),
                c.resolve(g);
            else {
              g = new d();
              g.geometry = b;
              g.outSpatialReference = this.map.spatialReference;
              g.returnGeometry = !0;
              g.spatialRelationship = this.fullyWithin
                ? d.SPATIAL_REL_CONTAINS
                : d.SPATIAL_REL_INTERSECTS;
              (b = this.featureLayer.getDefinitionExpression()) ||
                (b = "1\x3d1");
              var h = this.layerInfosObj.getLayerInfoById(this.featureLayer.id);
              h && (h = h.getFilter()) && (b = "(" + b + ") AND (" + h + ")");
              b && (g.where = b);
              g.outFields = ["*"];
              new m(this.featureLayer.url).execute(g).then(
                f.hitch(this, function(a) {
                  c.resolve(a.features);
                }),
                f.hitch(this, function(a) {
                  c.reject(a);
                })
              );
            }
            return c;
          },
          _onDrawBoxUserClear: function() {
            this.clear();
          },
          _clearMiddleFeatureLayer: function() {
            this._middleFeatureLayer &&
              (this._middleFeatureLayer.clear(),
              this.selectionManager.clearSelection(this._middleFeatureLayer));
          },
          destroy: function() {
            this._isDestroyed ||
              (e.forEach(
                this._handles,
                f.hitch(this, function(a) {
                  a.remove();
                })
              ),
              (this._handles = null),
              this.clear());
            this._isDestroyed = !0;
          }
        });
      });
    },
    "widgets/Query/SingleQueryResult": function() {
      define("dojo/_base/declare dijit/_WidgetBase jimu/dijit/BindLabelPropsMixin dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/Evented dojo/text!./SingleQueryResult.html dojo/_base/lang dojo/on dojo/keys dojo/_base/query dojo/_base/html dojo/_base/array dojo/Deferred esri/lang esri/tasks/QueryTask esri/tasks/FeatureSet esri/dijit/PopupTemplate esri/dijit/PopupRenderer esri/tasks/RelationshipQuery esri/renderers/SimpleRenderer jimu/utils jimu/symbolUtils jimu/dijit/Popup jimu/dijit/Message jimu/dijit/FeatureActionPopupMenu jimu/BaseFeatureAction jimu/dijit/SymbolChooser jimu/LayerInfos/LayerInfos jimu/FeatureActionManager ./SingleQueryLoader ./RelatedRecordsResult jimu/dijit/LoadingIndicator jimu/dijit/formSelect".split(
        " "
      ), function(
        k,
        l,
        q,
        n,
        f,
        e,
        g,
        h,
        t,
        c,
        b,
        a,
        d,
        m,
        w,
        u,
        y,
        A,
        x,
        D,
        E,
        z,
        H,
        C,
        J,
        B,
        K,
        p,
        r,
        F,
        I,
        L
      ) {
        return k([l, q, n, f, e], {
          baseClass: "single-query-result",
          templateString: g,
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
            this.singleQueryLoader = new I(this.map, this.currentAttrs);
            this.popupMenu = B.getInstance();
            this.featureActionManager = F.getInstance();
            this.btnFeatureAction.title =
              window.jimuNls.featureActions.featureActions;
            this._initExpandListIcon();
            this.own(
              t(
                this.multipleRelatedRecordsDiv,
                "keydown",
                h.hitch(this, function(a) {
                  a.keyCode === c.ESCAPE &&
                    a.target !== this.multipleRelatedRecordsResultBackBtn &&
                    (a.stopPropagation(),
                    this.multipleRelatedRecordsResultBackBtn.focus());
                })
              )
            );
            this.own(
              t(
                this.singleRelatedRecordsResultDiv,
                "keydown",
                h.hitch(this, function(a) {
                  a.keyCode === c.ESCAPE &&
                    a.target !== this.singleRelatedRecordsResultBackBtn &&
                    (a.stopPropagation(),
                    this.singleRelatedRecordsResultBackBtn.focus());
                })
              )
            );
          },
          _initExpandListIcon: function() {
            var b = this.getCurrentAttrs();
            (b = b && b.config) && b.defaultExpand
              ? (a.addClass(this.expandedListIcon, "expanded"),
                (this.expandedListIcon.title = this.nls.collapseAll),
                a.addClass(this.resultsTbody, "expanded"))
              : (a.addClass(this.expandedListIcon, "folded"),
                (this.expandedListIcon.title = this.nls.expandAll),
                a.addClass(this.resultsTbody, "folded"));
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
              ((a = d.filter(
                b.graphics,
                h.hitch(this, function(a) {
                  return (a = a.geometry)
                    ? "point" === a.type
                      ? this._isValidNumber(a.x) && this._isValidNumber(a.y)
                      : "multipoint" === a.type
                      ? a.points && 0 < a.points.length
                        ? d.every(
                            a.points,
                            h.hitch(this, function(a) {
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
                ((a = z.toFeatureSet(a)), z.zoomToFeatureSet(this.map, a)));
          },
          _emitFeaturesUpdate: function() {
            this.emit("features-update", {
              taskIndex: this.currentAttrs.queryTr.taskIndex,
              features: this.currentAttrs.query.resultLayer.graphics
            });
          },
          executeQueryForFirstTime: function() {
            var a = new m();
            this._clearResultPage();
            this._hideResultsNumberDiv();
            var b = this.getCurrentAttrs(),
              c = b.query.resultLayer,
              d = h.hitch(this, function(d) {
                if (this.domNode) {
                  this.shelter.hide();
                  var e = b.query.allCount;
                  this._updateNumSpan(b.query.foundedNum, e);
                  0 < e &&
                    (this._addResultItems(d, c),
                    this._addResultLayerToMap(c),
                    this.zoomToLayer());
                  a.resolve(e);
                  this._emitFeaturesUpdate();
                }
              }),
              e = h.hitch(this, function(b) {
                console.error(b);
                this.domNode &&
                  (this.shelter.hide(),
                  c && this.map.removeLayer(c),
                  (c = null),
                  this._showQueryErrorMsg(),
                  a.reject(b));
              });
            this.shelter.show();
            3 !== b.queryType && this._showResultsNumberDiv();
            this.singleQueryLoader.executeQueryForFirstTime().then(d, e);
            return a;
          },
          getResultLayer: function() {
            var a = this.getCurrentAttrs();
            return h.getObject("query.resultLayer", !1, a);
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
            a.setStyle(this.resultsNumberDiv, "display", "flex");
          },
          _hideResultsNumberDiv: function() {
            a.setStyle(this.resultsNumberDiv, "display", "none");
          },
          _updateNumSpan: function(a, b) {
            a > b && (a = b);
            this._updateLoadMoreVisible(a < b);
            a = z.localizeNumber(a);
            b = z.localizeNumber(b);
            this.numSpan.innerHTML = a + "/" + b;
          },
          _isTable: function(a) {
            return "Table" === a.type;
          },
          _onResultsScroll: function() {
            z.isScrollToBottom(this.resultsContainer) && this._continueQuery();
          },
          _continueQuery: function() {
            var a = this.getCurrentAttrs(),
              b = a.query.allCount,
              c = a.query.foundedNum;
            if (!(c >= b)) {
              var d = a.query.resultLayer,
                e = h.hitch(this, function(e) {
                  this.domNode &&
                    (this._updateLoadMoreState(!1),
                    this.shelter.hide(),
                    (c = a.query.foundedNum),
                    this._updateNumSpan(c, b),
                    this._addResultItems(e, d),
                    this.zoomToLayer(),
                    this._emitFeaturesUpdate(),
                    this.emit("features-layout-update"));
                }),
                f = h.hitch(this, function(a) {
                  console.error(a);
                  this.domNode &&
                    (this._updateLoadMoreState(!1),
                    this._showQueryErrorMsg(),
                    this.shelter.hide());
                });
              this.shelter.show();
              this._updateLoadMoreState(!0);
              this.singleQueryLoader
                .executeQueryWhenScrollToBottom()
                .then(e, f);
            }
          },
          _clearResultPage: function() {
            this._hideInfoWindow();
            this._unSelectResultTr();
            a.empty(this.resultsTbody);
            this._updateNumSpan(0, 0);
          },
          _unSelectResultTr: function() {
            this.resultTr && a.removeClass(this.resultTr, "jimu-state-active");
            this.resultTr = null;
          },
          _selectResultTr: function(b) {
            this._unSelectResultTr();
            (this.resultTr = b) &&
              a.addClass(this.resultTr, "jimu-state-active");
          },
          _addResultItems: function(a, b) {
            var c = this.getCurrentAttrs(),
              e = c.config.url,
              f = c.config.objectIdField,
              p = this._getCurrentRelationships(),
              v = h.clone(c.config.popupInfo);
            v.mediaInfos = [];
            var g = new A(v),
              r = !0;
            b.renderer || (r = !1);
            var k = this._isWebMapShowRelatedRecordsEnabled();
            this._featuresNum = a.length;
            d.forEach(
              a,
              h.hitch(this, function(a, d) {
                var v = "",
                  v = 0 === d % 2 ? "even" : "odd";
                b.add(a);
                this._createQueryResultItem(
                  {
                    resultLayer: b,
                    feature: a,
                    trClass: v,
                    popupTemplate2: g,
                    relationships: p,
                    objectIdField: f,
                    url: e,
                    relationshipPopupTemplates: c.relationshipPopupTemplates,
                    shouldCreateSymbolNode: r,
                    isWebMapShowRelatedRecordsEnabled: k
                  },
                  d
                );
              })
            );
          },
          _updateLoadMoreVisible: function(b) {
            b
              ? a.removeClass(this.loadMoreIcon, "query-hidden")
              : a.addClass(this.loadMoreIcon, "query-hidden");
          },
          _updateLoadMoreState: function(b) {
            b
              ? a.addClass(this.loadMoreIcon, "loading")
              : a.removeClass(this.loadMoreIcon, "loading");
          },
          _onLoadMoreClicked: function() {
            this._continueQuery();
          },
          _onLoadMoreKeydown: function(a) {
            (a.keyCode !== c.ENTER && a.keyCode !== c.SPACE) ||
              this._onLoadMoreClicked();
          },
            _clearPopItemClass: function () {
                debugger;
            var a = b(
                ".query-result-item-table .popup-td.expanded",
                this.resultsTbody
              ),
              c = b(
                ".query-result-item-table .popup-td.folded",
                this.resultsTbody
              );
            a && a.length && a.removeClass("expanded");
            c && c.length && c.removeClass("folded");
          },
          _onExpandClicked: function() {
            var c = this.nls.expand;
            this._clearPopItemClass();
            a.hasClass(this.resultsTbody, "expanded")
              ? (a.addClass(this.expandedListIcon, "folded"),
                a.removeClass(this.resultsTbody, "expanded"),
                a.addClass(this.resultsTbody, "folded"),
                (this.expandedListIcon.title = this.nls.expandAll))
              : (a.removeClass(this.expandedListIcon, "folded"),
                a.addClass(this.resultsTbody, "expanded"),
                a.removeClass(this.resultsTbody, "folded"),
                (this.expandedListIcon.title = this.nls.collapseAll),
                (c = this.nls.collapse));
            for (
              var d = b(".popup-title-icon", this.resultsTbody), e = 0;
              e < d.length;
              e++
            )
              a.setAttr(d[e], "aria-label", c);
            this.emit("features-layout-update");
          },
          _onExpandKeydown: function(a) {
            (a.keyCode !== c.ENTER && a.keyCode !== c.SPACE) ||
              this._onExpandClicked();
          },
          _getPopupTitle: function(a, b) {
            if (a) return "function" === typeof a.title ? a.title(b) : a.title;
          },
          _createQueryResultItem: function(c, e) {
            var f = "",
              p = "",
              g = "";
            e === this._featuresNum - 1 &&
              ((f = " " + this._lastFeatureClass),
              (p = " " + this._lastRelatedClass),
              (g = 'data-lastArrow\x3d"true"'));
            var v = c.resultLayer,
              r = c.feature,
              k = c.trClass,
              l = c.popupTemplate2,
              F = c.relationships,
              m = c.objectIdField,
              n = c.url,
              N = c.relationshipPopupTemplates,
              q = c.shouldCreateSymbolNode;
            c = c.isWebMapShowRelatedRecordsEnabled;
            if (r && r.attributes) {
              var z = this._getPopupTitle(l, r),
                f = a.toDom(
                  '\x3ctr role\x3d"button" tabindex\x3d"0" class\x3d"jimu-table-row jimu-table-row-separator query-result-item' +
                    f +
                    '"  cellpadding\x3d"0" cellspacing\x3d"0"\x3e\x3ctd\x3e\x3ctable class\x3d"query-result-item-table"\x3e\x3ctbody\x3e\x3ctr\x3e\x3ctd class\x3d"symbol-td"\x3e\x3c/td\x3e\x3ctd class\x3d"popup-td expanded"\x3e\x3cdiv class\x3d"popup-title-container"\x3e\x3cdiv class\x3d"popup-title"\x3e' +
                    z +
                    '\x3c/div\x3e\x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"' +
                    this.nls.collapse +
                    '" ' +
                    g +
                    ' class\x3d"popup-title-icon"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"popup-content"\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e\x3c/td\x3e\x3c/tr\x3e'
                );
              a.addClass(f, k);
              a.place(f, this.resultsTbody);
              f.feature = r;
              k = b(".symbol-td", f)[0];
              if (q)
                try {
                  var I = v.renderer;
                  if (I) {
                    var t = I.getSymbol(r);
                    if (t) {
                      var u = H.createSymbolNode(t, { width: 32, height: 32 });
                      u && a.place(u, k);
                    }
                  }
                } catch (Q) {
                  console.error(Q);
                }
              else a.destroy(k);
              var C = b(".popup-td .popup-content", f)[0],
                v = l.title,
                q = l.info && l.info.title;
              l.title = null;
              q && (l.info.title = null);
              I = new x({ template: l, graphic: r, chartTheme: l.chartTheme });
              a.place(I.domNode, C);
              I.startup();
              l.title = v;
              q && (l.info.title = q);
              if (m && F && 0 < F.length && c) {
                var L = r.attributes[m];
                d.forEach(
                  F,
                  h.hitch(this, function(b, c) {
                    var d = this._getRelationshipLayerInfo(b.relatedTableId),
                      f = d.name,
                      g = N[b.relatedTableId],
                      v = "related-table-btn";
                    e === this._featuresNum - 1 &&
                      c === F.length - 1 &&
                      (v = v + " " + p);
                    c = a.create(
                      "div",
                      { class: v, role: "button", tabindex: "0", innerHTML: f },
                      C
                    );
                    c.queryStatus = "unload";
                    c.url = n;
                    c.layerName = f;
                    c.objectId = L;
                    c.relationship = b;
                    c.relationshipLayerInfo = d;
                    c.relationshipPopupTemplate = g;
                  })
                );
              }
            }
          },
          _onBtnMultipleRelatedBackClicked: function() {
            this._showFeaturesResultDiv();
          },
          _onBtnMultipleRelatedBackKeydown: function(a) {
            a.keyCode === c.ENTER ||
            a.keyCode === c.SPACE ||
            a.keyCode === c.ESCAPE
              ? (a.stopPropagation(),
                this._onBtnMultipleRelatedBackClicked(),
                this.btnFeatureAction.focus())
              : a.keyCode === c.TAB &&
                a.shiftKey &&
                (a.preventDefault(),
                this.multipleRelatedRecordsResult.lastFocusItem.focus());
          },
          _onBtnSingleRelatedBackClicked: function() {
            this._showFeaturesResultDiv();
          },
          _onBtnSingleRelatedBackKeydown: function(a) {
            a.keyCode === c.ENTER ||
            a.keyCode === c.SPACE ||
            a.keyCode === c.ESCAPE
              ? (a.stopPropagation(),
                this._onBtnSingleRelatedBackClicked(),
                this._currentRelatedRecord.focus())
              : a.keyCode === c.TAB && a.shiftKey && a.stopPropagation();
          },
          _onBtnSingleRelatedTitleKeydown: function(a) {
            a.keyCode === c.TAB &&
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
            a.addClass(this.multipleRelatedRecordsDiv, "not-visible");
            a.addClass(this.singleRelatedRecordsResultDiv, "not-visible");
            a.removeClass(this.featuresResultDiv, "not-visible");
            this.emit("hide-related-records");
          },
          _showMultipleRelatedRecords: function() {
            this.singleRelatedRecordsResult &&
              this.singleRelatedRecordsResult.destroy();
            this.singleRelatedRecordsResult = null;
            a.addClass(this.featuresResultDiv, "not-visible");
            a.addClass(this.singleRelatedRecordsResultDiv, "not-visible");
            a.removeClass(this.multipleRelatedRecordsDiv, "not-visible");
            this.emit("show-related-records");
            var b = this._getCurrentRelationships();
            this.relatedLayersSelect.removeOption(
              this.relatedLayersSelect.getOptions()
            );
            d.forEach(
              b,
              h.hitch(this, function(a) {
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
              this.multipleRelatedRecordsResult = new L({
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
                t(
                  this.multipleRelatedRecordsResult,
                  "focus-result-header",
                  h.hitch(this, function() {
                    this.multipleRelatedRecordsResultBackBtn.focus();
                  })
                )
              );
              var c = this.currentAttrs.config.url;
              this.shelter.show();
              var e = h.hitch(this, function(a) {
                console.error(a);
                this.domNode && this.shelter.hide();
              });
              this.singleQueryLoader
                .getObjectIdsForAllRelatedRecordsAction()
                .then(
                  h.hitch(this, function(a) {
                    this._queryRelatedRecords(c, a, b.relationship.id).then(
                      h.hitch(this, function(c) {
                        if (this.domNode) {
                          this.shelter.hide();
                          var e = [];
                          d.forEach(
                            a,
                            h.hitch(this, function(a) {
                              (a = c[a]) &&
                                a.features &&
                                0 < a.features.length &&
                                (e = e.concat(a.features));
                            })
                          );
                          var f = b.relationshipLayerInfo,
                            p = new y();
                          p.fields = h.clone(f.fields);
                          p.features = e;
                          p.geometryType = f.geometryType;
                          p.fieldAliases = {};
                          d.forEach(
                            p.fields,
                            h.hitch(this, function(a) {
                              var b = a.name;
                              p.fieldAliases[b] = a.alias || b;
                            })
                          );
                          this.multipleRelatedRecordsResult.setResult(
                            b.relationshipPopupTemplate,
                            p
                          );
                        }
                      }),
                      e
                    );
                  }),
                  e
                );
            }
          },
          _showSingleRelatedRecordsDiv: function() {
            this.multipleRelatedRecordsResult &&
              this.multipleRelatedRecordsResult.destroy();
            this.multipleRelatedRecordsResult = null;
            a.addClass(this.featuresResultDiv, "not-visible");
            a.addClass(this.multipleRelatedRecordsDiv, "not-visible");
            a.removeClass(this.singleRelatedRecordsResultDiv, "not-visible");
            this.emit("show-related-records");
          },
          _onSingleRelatedTableButtonClicked: function(a) {
            this.singleRelatedRecordsResult &&
              this.singleRelatedRecordsResult.destroy();
            this.singleRelatedRecordsResult = null;
            var b = a.url,
              c = a.layerName,
              e = a.objectId,
              f = a.relationship,
              p = a.relationshipLayerInfo,
              g = a.relationshipPopupTemplate;
            this.singleRelatedRecordsResult = new L({
              map: this.map,
              layerDefinition: p,
              nls: this.nls,
              config: this.currentAttrs.config
            });
            this.singleRelatedRecordsResult.placeAt(
              this.singleRelatedRecordsResultDiv
            );
            this.singleRelatedRecordsResultTitle.lastFocusItem = this.singleRelatedRecordsResultBackBtn;
            this.own(
              t(
                this.singleRelatedRecordsResult,
                "focus-result-header",
                h.hitch(this, function() {
                  this.singleRelatedRecordsResultTitle.focus();
                })
              )
            );
            this._showSingleRelatedRecordsDiv();
            var r = h.hitch(this, function() {
              var b = new y();
              b.fields = h.clone(p.fields);
              b.features = a.relatedFeatures;
              b.geometryType = p.geometryType;
              b.fieldAliases = {};
              d.forEach(
                b.fields,
                h.hitch(this, function(a) {
                  var c = a.name;
                  b.fieldAliases[c] = a.alias || c;
                })
              );
              this.singleRelatedRecordsResult.setResult(g, b);
              this.relatedTitleDiv.innerHTML = c;
              this.singleRelatedRecordsResultTitle.focus();
              this._currentRelatedRecord = a;
            });
            "unload" === a.queryStatus
              ? ((a.queryStatus = "loading"),
                this.shelter.show(),
                this._queryRelatedRecords(b, [e], f.id).then(
                  h.hitch(this, function(b) {
                    this.domNode &&
                      (this.shelter.hide(),
                      (b = (b = (b = b && b[e]) && b.features) || []),
                      (a.relatedFeatures = b),
                      (a.queryStatus = "loaded"),
                      r());
                  }),
                  h.hitch(this, function(b) {
                    this.domNode &&
                      (this.shelter.hide(),
                      console.error(b),
                      (a.queryStatus = "unload"),
                      r());
                  })
                ))
              : "loaded" === a.queryStatus && r();
          },
          _queryRelatedRecords: function(a, b, c) {
            a = new u(a);
            var d = new D();
            d.objectIds = b;
            d.relationshipId = c;
            d.outFields = ["*"];
            d.returnGeometry = !0;
            d.outSpatialReference = this.map.spatialReference;
            return a.executeRelationshipQuery(d);
          },
          _getCurrentRelationships: function() {
            return this.getCurrentAttrs().queryTr.layerInfo.relationships || [];
          },
          _getRelationshipInfo: function(a) {
            for (
              var b = this._getCurrentRelationships(), c = 0;
              c < b.length;
              c++
            )
              if (b[c].id === a) return b[c];
            return null;
          },
          _getRelationshipLayerInfo: function(a) {
            return this.getCurrentAttrs().relationshipLayerInfos[a];
          },
          _tryLocaleNumber: function(a) {
            var b = a;
            if (w.isDefined(a) && isFinite(a))
              try {
                var c = z.localizeNumber(a);
                "string" === typeof c && (b = c);
              } catch (G) {
                console.error(G);
              }
            return b + "";
          },
          _showQueryErrorMsg: function(a) {
            new J({ message: a || this.nls.queryError });
          },
          _onSinglePopupExpandIconClicked: function(b) {
            var c = this.nls.expand,
              d = b.parentNode.parentNode;
            if (d) {
              var e = a.hasClass(this.resultsTbody, "expanded");
              a.hasClass(d, "expanded") || a.hasClass(d, "folded")
                ? a.hasClass(d, "expanded")
                  ? (a.removeClass(d, "expanded"), a.addClass(d, "folded"))
                  : (a.addClass(d, "expanded"),
                    a.removeClass(d, "folded"),
                    (c = this.nls.collapse))
                : e
                ? (a.addClass(d, "folded"), a.removeClass(d, "expanded"))
                : (a.addClass(d, "expanded"),
                  a.removeClass(d, "folded"),
                  (c = this.nls.collapse));
              a.setAttr(b, "aria-label", c);
              "true" === a.getAttr(b, "data-lastArrow") &&
                this.emit("features-layout-update");
            }
          },
          _onResultsTableKeydown: function(a) {
            (a.keyCode !== c.ENTER && a.keyCode !== c.SPACE) ||
              this._onResultsTableClicked(a);
          },
          _onResultsTableClicked: function(b) {
            b = b.target || b.srcElement;
            if (a.isDescendant(b, this.resultsTable))
              if (a.hasClass(b, "popup-title-icon"))
                this._onSinglePopupExpandIconClicked(b);
              else if (a.hasClass(b, "related-table-btn"))
                this._onSingleRelatedTableButtonClicked(b);
              else if (
                (b = a.hasClass(b, "query-result-item")
                  ? b
                  : z.getAncestorDom(
                      b,
                      h.hitch(this, function(b) {
                        return a.hasClass(b, "query-result-item");
                      }),
                      this.resultsTbody
                    ))
              ) {
                this._selectResultTr(b);
                a.addClass(b, "jimu-state-active");
                b = b.feature;
                var c = b.geometry;
                if (c) {
                  var d = c.type,
                    e;
                  "point" === d
                    ? (e = c)
                    : "multipoint" === d
                    ? 1 === c.points.length
                      ? (e = c.getPoint(0))
                      : 1 < c.points.length && (e = c.getPoint(0))
                    : "polyline" === d
                    ? ((e = c.getExtent()),
                      (e = e.expand(1.4)),
                      (e = e.getCenter()))
                    : "polygon" === d
                    ? ((e = c.getExtent()),
                      (e = e.expand(1.4)),
                      (e = e.getCenter()))
                    : "extent" === d &&
                      ((e = c.expand(1.4)), (e = e.getCenter()));
                  c = z.toFeatureSet(b);
                  z.zoomToFeatureSet(this.map, c);
                  "function" === typeof this.map.infoWindow.setFeatures &&
                    this.map.infoWindow.setFeatures([b]);
                  "function" === typeof this.map.infoWindow.reposition &&
                    this.map.infoWindow.reposition();
                  this.map.infoWindow.show(e);
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
              c =
                this.currentAttrs.config && this.currentAttrs.config.popupInfo;
            c && (b = c.fieldInfos);
            var e = new y();
            e.fields = h.clone(a.fields);
            e.features = [].concat(a.graphics);
            e.geometryType = a.geometryType;
            e.fieldAliases = {};
            d.forEach(
              e.fields,
              h.hitch(this, function(a) {
                var c = a.name;
                a = this._getFieldAliasByPopupInfo(a, b);
                e.fieldAliases[c] = a;
              })
            );
            return e;
          },
          _getFieldAliasByPopupInfo: function(a, b) {
            var c = a.name;
            a = a.alias || c;
            b &&
              b.length &&
              (b = b.filter(function(a) {
                return a.fieldName === c;
              })[0]) &&
              (a = b.label);
            return a;
          },
          _onBtnMenuClicked: function(b) {
            var c = a.position(b.target || b.srcElement),
              e = this._getFeatureSet(),
              f = this.getCurrentAttrs();
            this.featureActionManager
              .getSupportedActions(e, f.query.resultLayer)
              .then(
                h.hitch(this, function(a) {
                  d.forEach(
                    a,
                    h.hitch(this, function(a) {
                      a.data = e;
                    })
                  );
                  if (!f.config.enableExport) {
                    var b = [
                      "ExportToCSV",
                      "ExportToFeatureCollection",
                      "ExportToGeoJSON",
                      "SaveToMyContent"
                    ];
                    a = d.filter(
                      a,
                      h.hitch(this, function(a) {
                        return 0 > b.indexOf(a.name);
                      })
                    );
                  }
                  a = d.filter(
                    a,
                    h.hitch(this, function(a) {
                      return "CreateLayer" !== a.name;
                    })
                  );
                  var p = new K({
                    name: "RemoveQueryResult",
                    iconClass: "icon-close",
                    label: this.nls.removeThisResult,
                    iconFormat: "svg",
                    map: this.map,
                    onExecute: h.hitch(this, this._removeResult)
                  });
                  p.name = "RemoveQueryResult";
                  p.data = e;
                  a.push(p);
                  (p = this._getRelatedTableAction(e)) && a.push(p);
                  (p = this._getSymbolAction(e)) && a.push(p);
                  this.popupMenu.setActions(a);
                  this.popupMenu._setFocusedNodeBeforeOpen();
                  this.popupMenu.show(c);
                })
              );
          },
          _onBtnMenuKeydown: function(a) {
            (a.keyCode !== c.ENTER && a.keyCode !== c.SPACE) ||
              this._onBtnMenuClicked(a);
          },
          _getObjectIdField: function() {
            return this.currentAttrs.config.objectIdField;
          },
          _getSymbolAction: function(a) {
            var b = null;
            this.currentAttrs.query.resultLayer.renderer &&
              this.currentAttrs.config.canModifySymbol &&
              (b = new K({
                name: "ChangeSymbol",
                label: this.nls.changeSymbol,
                data: a && a.features,
                iconClass: "icon-edit-symbol",
                iconFormat: "svg",
                map: this.map,
                onExecute: h.hitch(this, this._showSymbolChooser)
              }));
            return b;
          },
          _showSymbolChooser: function() {
            var a = this.currentAttrs.query.resultLayer,
              b = a.renderer,
              c = {};
            (b = b.defaultSymbol || b.symbol)
              ? (c.symbol = b)
              : ((a = z.getSymbolTypeByGeometryType(a.geometryType)),
                (c.type = a));
            var d = new p(c),
              e = new C({
                width: 380,
                autoHeight: !0,
                titleLabel: this.nls.changeSymbol,
                content: d,
                onClose: h.hitch(this, function() {
                  d.destroy();
                  e = d = null;
                }),
                buttons: [
                  {
                    label: window.jimuNls.common.ok,
                    onClick: h.hitch(this, function() {
                      var a = d.getSymbol();
                      this._updateSymbol(a);
                      e.close();
                    })
                  },
                  {
                    label: window.jimuNls.common.cancel,
                    onClick: h.hitch(this, function() {
                      e.close();
                    })
                  }
                ]
              });
          },
          _updateSymbol: function(c) {
            var e = new E(c),
              f = this.currentAttrs.query.resultLayer;
            f.setRenderer(e);
            f.redraw();
            e = b(".symbol", this.resultsTable);
            d.forEach(
              e,
              h.hitch(this, function(b) {
                var d = b.parentElement;
                a.destroy(b);
                (b = H.createSymbolNode(c, { width: 32, height: 32 })) &&
                  a.place(b, d);
              })
            );
          },
          _getRelatedTableAction: function(a) {
            var b = null,
              c = a && a.features,
              d = this._getCurrentRelationships();
            this._getObjectIdField() &&
              0 < c.length &&
              d &&
              0 < d.length &&
              this._isWebMapShowRelatedRecordsEnabled() &&
              (b = new K({
                iconClass: "icon-show-related-record",
                icon: "",
                data: a,
                label: this.nls.showAllRelatedRecords,
                onExecute: h.hitch(this, function() {
                  this._showMultipleRelatedRecords();
                  var a = new m();
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
            return (a = this.queryWidget.appConfig.getConfigElementsByName(
              a
            )[0]) && a.visible
              ? a
              : null;
          },
          _openAttributeTable: function() {
            var a = this._getAvailableWidget("AttributeTable");
            if (a) {
              var b = r
                .getInstanceSync()
                .getLayerInfoById(this.currentAttrs.query.resultLayer.id);
              this.queryWidget.widgetManager.triggerWidgetOpen(a.id).then(
                h.hitch(this, function() {
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
    },
    "widgets/Query/RelatedRecordsResult": function() {
      define("dojo/query dojo/keys dojo/Evented dojo/_base/html dojo/_base/lang dojo/_base/array dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./RelatedRecordsResult.html esri/dijit/PopupRenderer esri/layers/FeatureLayer esri/renderers/SimpleRenderer jimu/utils jimu/symbolUtils jimu/BaseFeatureAction jimu/dijit/Popup jimu/dijit/FeatureActionPopupMenu jimu/dijit/SymbolChooser jimu/FeatureActionManager".split(
        " "
      ), function(
        k,
        l,
        q,
        n,
        f,
        e,
        g,
        h,
        t,
        c,
        b,
        a,
        d,
        m,
        w,
        u,
        y,
        A,
        x,
        D,
        E
      ) {
        return g([h, t, c, q], {
          baseClass: "related-records-result",
          templateString: b,
          popupMenu: null,
          featureActionManager: null,
          featureSet: null,
          layer: null,
          map: null,
          layerDefinition: null,
          nls: null,
          config: null,
          postCreate: function() {
            this.inherited(arguments);
            this.popupMenu = x.getInstance();
            this.featureActionManager = E.getInstance();
            this.btnAction.title = window.jimuNls.featureActions.featureActions;
            if ("Table" !== this.layerDefinition.type) {
              this.layer = new d({
                layerDefinition: {
                  type: this.layerDefinition.type,
                  geometryType: this.layerDefinition.geometryType,
                  fields: this.layerDefinition.fields,
                  typeIdField: this.layerDefinition.typeIdField,
                  types: this.layerDefinition.types
                }
              });
              var a = w.getTypeByGeometryType(
                  this.layerDefinition.geometryType
                ),
                b = null;
              "point" === a
                ? (b = u.getDefaultMarkerSymbol())
                : "polyline" === a
                ? (b = u.getDefaultLineSymbol())
                : "polygon" === a && (b = u.getDefaultFillSymbol());
              b && ((a = new m(b)), this.layer.setRenderer(a));
              this.map.addLayer(this.layer);
            } else
              this.layer = new d({
                layerDefinition: {
                  type: this.layerDefinition.type,
                  fields: this.layerDefinition.fields,
                  typeIdField: this.layerDefinition.typeIdField,
                  types: this.layerDefinition.types
                }
              });
          },
          destroy: function() {
            this.layer && this.map.removeLayer(this.layer);
            this.layer = null;
            this.inherited(arguments);
          },
          setResult: function(a, b) {
            this.layer && this.layer.clear();
            this.featureSet = b;
            if (0 < b.features.length) {
              e.forEach(
                b.features,
                f.hitch(this, function(b, c) {
                  this.layer && this.layer.add(b);
                  this._createItem(a, b, c);
                })
              );
              var c = k(".item-title", this.content);
              this.lastFocusItem = c[c.length - 1];
              n.removeClass(this.btnAction, "not-visible");
              n.addClass(this.noResultTip, "not-visible");
              n.removeClass(this.content, "not-visible");
              b.geometryType && w.zoomToFeatureSet(this.map, b);
            } else
              n.addClass(this.btnAction, "not-visible"),
                n.removeClass(this.noResultTip, "not-visible"),
                n.addClass(this.content, "not-visible"),
                (this.lastFocusItem = this.noResultTip);
          },
          _onNoResultTipKeydown: function(a) {
            a.keyCode !== l.TAB ||
              a.shiftKey ||
              (a.preventDefault(), this.emit("focus-result-header"));
          },
          getLayer: function() {
            return this.layer;
          },
          showLayer: function() {
            this.layer && this.layer.show();
          },
          hideLayer: function() {
            this.layer && this.layer.hide();
          },
          _createItem: function(b, c, d) {
            var e = b.getTitle(c) || "",
              f = "";
            d === this.featureSet.features.length - 1 &&
              (f = 'data-isLastItem\x3d"true"');
            d = n.toDom(
              '\x3cdiv class\x3d"item"\x3e\x3cdiv class\x3d"item-title" ' +
                f +
                ' role\x3d"button" tabindex\x3d"0"\x3e' +
                e +
                '\x3c/div\x3e\x3cdiv class\x3d"item-content" ' +
                f +
                ' tabindex\x3d"0"\x3e\x3c/div\x3e\x3c/div\x3e'
            );
            e = k(".item-content", d)[0];
            b = new a({ template: b, graphic: c, chartTheme: b.chartTheme });
            n.place(b.domNode, e);
            b.startup();
            n.place(d, this.content);
          },
          _onContentClicked: function(a) {
            a = a.target || a.srcElement;
            var b = null;
            if (
              (b = n.hasClass(a, "item-title")
                ? a
                : w.getAncestorDom(
                    a,
                    function(a) {
                      return n.hasClass(a, "item-title");
                    },
                    this.content
                  ))
            ) {
              var c = b.parentNode;
              n.toggleClass(c, "selected");
              var d = n.hasClass(c, "selected");
              k(".item", this.content).removeClass("selected");
              d && n.addClass(c, "selected");
              "true" === n.getAttr(a, "data-isLastItem") &&
                (this.lastFocusItem = d ? b.nextElementSibling : b);
            }
          },
          _onContentKeydown: function(a) {
            if (a.keyCode === l.ENTER || a.keyCode === l.SPACE)
              this._onContentClicked(a);
            else if (
              a.keyCode === l.TAB &&
              !a.shiftKey &&
              "true" === n.getAttr(a.target, "data-isLastItem")
            ) {
              var b = n.hasClass(a.target.parentNode, "selected");
              if (!b || (b && n.hasClass(a.target, "item-content")))
                a.preventDefault(), this.emit("focus-result-header");
            }
          },
          _onBtnBackClicked: function() {
            this.emit("back");
          },
          _onBtnMenuClicked: function(a) {
            if (this.featureSet) {
              var b = n.position(a.target || a.srcElement);
              this.featureActionManager
                .getSupportedActions(this.featureSet)
                .then(
                  f.hitch(this, function(a) {
                    e.forEach(
                      a,
                      f.hitch(this, function(a) {
                        a.data = this.featureSet;
                      })
                    );
                    if (!this.config.enableExport) {
                      var c = [
                        "ExportToCSV",
                        "ExportToFeatureCollection",
                        "ExportToGeoJSON",
                        "SaveToMyContent"
                      ];
                      a = e.filter(
                        a,
                        f.hitch(this, function(a) {
                          return 0 > c.indexOf(a.name);
                        })
                      );
                    }
                    a = e.filter(
                      a,
                      f.hitch(this, function(a) {
                        return "CreateLayer" !== a.name;
                      })
                    );
                    var d = this._getSymbolAction();
                    d && a.push(d);
                    this.popupMenu.setActions(a);
                    this.popupMenu._setFocusedNodeBeforeOpen();
                    this.popupMenu.show(b);
                  })
                );
            }
          },
          _onBtnMenuKeydown: function(a) {
            (a.keyCode !== l.ENTER && a.keyCode !== l.SPACE) ||
              this._onBtnMenuClicked(a);
          },
          _getSymbolAction: function() {
            var a = null;
            "Table" !== this.layerDefinition.type &&
              this.layer &&
              this.layer.renderer &&
              this.config.canModifySymbol &&
              ((a = this.featureSet && this.featureSet.features) || (a = []),
              (a = new y({
                name: "ChangeSymbol",
                label: this.nls.changeSymbol,
                data: a,
                iconClass: "icon-edit-symbol",
                iconFormat: "svg",
                map: this.map,
                onExecute: f.hitch(this, this._showSymbolChooser)
              })));
            return a;
          },
          _showSymbolChooser: function() {
            if (this.layer) {
              var a = this.layer.renderer,
                b = {};
              (a = a.defaultSymbol || a.symbol)
                ? (b.symbol = a)
                : ((a = w.getSymbolTypeByGeometryType(this.layer.geometryType)),
                  (b.type = a));
              var c = new D(b),
                d = new A({
                  width: 380,
                  autoHeight: !0,
                  titleLabel: this.nls.changeSymbol,
                  content: c,
                  onClose: f.hitch(this, function() {
                    c.destroy();
                    d = c = null;
                  }),
                  buttons: [
                    {
                      label: window.jimuNls.common.ok,
                      onClick: f.hitch(this, function() {
                        var a = c.getSymbol(),
                          a = new m(a);
                        this.layer.setRenderer(a);
                        this.layer.redraw();
                        d.close();
                      })
                    },
                    {
                      label: window.jimuNls.common.cancel,
                      onClick: f.hitch(this, function() {
                        d.close();
                      })
                    }
                  ]
                });
            }
          }
        });
      });
    },
    "widgets/Query/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:widgets/Query/TaskSetting.html":
      '\x3cdiv tabindex\x3d"0" data-a11y-label-by\x3d"taskSettingName"\x3e\r\n  \x3ctable class\x3d"top"\x3e\r\n    \x3ctr\x3e\r\n      \x3ctd class\x3d"first-td"\x3e\r\n        \x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"${nls.back}" class\x3d"back-arrow feature-action icon-arrow-back" data-dojo-attach-point\x3d"backArrow" data-dojo-attach-event\x3d"onclick:_onBtnParamsBackClicked,onkeydown:_onBtnParamsBackKeydown"\x3e\x3c/div\x3e\r\n      \x3c/td\x3e\r\n      \x3ctd class\x3d"second-td"\x3e\r\n        \x3cdiv class\x3d"task-name jimu-ellipsis" data-dojo-attach-point\x3d"taskNameDiv" data-a11y-label-id\x3d"taskSettingName"\x3e\x3c/div\x3e\r\n      \x3c/td\x3e\r\n      \x3ctd class\x3d"third-td"\x3e\x3c/td\x3e\r\n    \x3c/tr\x3e\r\n  \x3c/table\x3e\r\n  \x3cdiv class\x3d"content-container"\x3e\r\n\r\n    \x3cdiv class\x3d"params-container" data-dojo-attach-point\x3d"paramsContainer"\x3e\r\n      \x3cdiv tabindex\x3d"0" class\x3d"not-visible" data-dojo-attach-point\x3d"noFilterTip"\x3e${nls.noAttributeSpatialFilterTip}\x3c/div\x3e\r\n      \x3cdiv class\x3d"attributes-section" data-dojo-attach-point\x3d"attributesSectionDiv" data-a11y-label-by\x3d"queryCriteira-label queryCriteira-sql"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"criteiraLabelDiv" class\x3d"first-stress attribute-filter-label" data-a11y-label-id\x3d"queryCriteira-label"\x3e${nls.queryCriteira}\x3c/div\x3e\r\n        \x3cdiv class\x3d"sql-div jimu-widget-note" data-dojo-attach-point\x3d"sqlDiv" data-a11y-label-id\x3d"queryCriteira-sql"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"spatial-section" data-dojo-attach-point\x3d"spatialSectionDiv" data-a11y-label-by\x3d"spatialFilter-label spatialFilter-tip"\x3e\r\n        \x3cdiv tabindex\x3d"0" class\x3d"spearator not-visible" data-dojo-attach-point\x3d"spatialSpearator"\x3e\x3c/div\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"spatialFilterLabelDiv" class\x3d"first-stress spatial-filter-label" data-a11y-label-id\x3d"spatialFilter-label"\x3e${nls.spatialFilter}\x3c/div\x3e\r\n        \x3cdiv class\x3d"spatial-filter-tip" data-dojo-attach-point\x3d"spatialFilterTip" data-a11y-label-id\x3d"spatialFilter-tip"\x3e\x3c/div\x3e\r\n        \x3cselect data-dojo-type\x3d"jimu/dijit/formSelect" data-a11y-label-by\x3d"spatialFilter-label spatialFilter-tip" data-dojo-attach-point\x3d"spatialTypeSelect" data-dojo-attach-event\x3d"change:_onSpatialTypeSelectChanged" class\x3d"restrict-select-width" style\x3d"width:100%;box-sizing:border-box;"\x3e\x3c/select\x3e\r\n\r\n        \x3cdiv class\x3d"spatial-filter-content" data-dojo-attach-point\x3d"spatialFilterContent"\x3e\r\n          \x3cdiv class\x3d"drawing-section" data-dojo-attach-point\x3d"drawingSection"\x3e\x3c/div\x3e\r\n          \x3cdiv class\x3d"features-section" data-dojo-attach-point\x3d"featuresSection"\x3e\r\n            \x3cdiv class\x3d"relationship-section"\x3e\r\n              \x3cdiv class\x3d"second-stress relationship-tip" data-a11y-label-id\x3d"spatialRelationship"\x3e${nls.spatialRelationship}\x3c/div\x3e\r\n              \x3cselect data-dojo-attach-point\x3d"relationshipSelect" data-a11y-label-by\x3d"spatialRelationship" data-dojo-type\x3d"jimu/dijit/formSelect" class\x3d"restrict-select-width relationship-select" style\x3d"width:100%;box-sizing:border-box;"\x3e\x3c/select\x3e\r\n            \x3c/div\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv data-dojo-attach-point\x3d"layerNameContainer" class\x3d"result-name-container"\x3e\r\n      \x3cdiv class\x3d"first-stress" data-a11y-label-id\x3d"layerName" \x3e${nls.layerName}\x3c/div\x3e\r\n      \x3cdiv class\x3d"result-name-text" data-a11y-label-by\x3d"layerName" data-dojo-attach-point\x3d"layerNameTextBox" data-dojo-type\x3d"dijit/form/TextBox" data-dojo-attach-event\x3d"change:_onLayerNameTextChanged"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n  \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"jimu-btn btn-execute" data-dojo-attach-point\x3d"btnExecute" data-dojo-attach-event\x3d"onclick:_onBtnApplyClicked,onkeydown:_onBtnApplyKeydown"\x3e${nls.apply}\x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"shelter" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:jimu/dijit/templates/SearchDistance.html":
      '\x3cdiv\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"cbxDiv"\x3e\x3c/div\x3e\r\n\t\x3ctable style\x3d"table-layout:fixed;width:100%;"\x3e\r\n\t\t\x3ccolgroup\x3e\r\n\t\t\t\x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n\t\t\t\x3ccol width\x3d"15px"\x3e\x3c/col\x3e\r\n\t\t\t\x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n\t\t\x3c/colgroup\x3e\r\n\t\t\x3ctbody\x3e\r\n\t\t\t\x3ctr\x3e\r\n\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\x3cinput data-dojo-attach-point\x3d"numberTextBox" data-dojo-type\x3d"dijit/form/NumberTextBox"\r\n\t\t\t\t\t data-dojo-props\x3d\'"required":true,intermediateChanges:false,constraints:{min:0,pattern:"#####0.##########"}\'\r\n\t\t\t\t\t style\x3d"width:100%;" data-dojo-attach-event\x3d"change:_onNumberTextBoxChanged" /\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\x3ctd\x3e\x3c/td\x3e\r\n\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\x3cselect data-dojo-type\x3d"jimu/dijit/formSelect" data-dojo-attach-point\x3d"unitSelect"\r\n\t\t\t\t\tdata-dojo-attach-event\x3d"change:_onUnitSelectChanged" style\x3d"width:100%;"\x3e\r\n\t\t\t\t\t\t\x3coption value\x3d"MILES" selected\x3e${nls.miles}\x3c/option\x3e\r\n\t\t\t\t\t\t\x3coption value\x3d"KILOMETERS"\x3e${nls.kilometers}\x3c/option\x3e\r\n\t\t\t\t\t\t\x3coption value\x3d"FEET"\x3e${nls.feet}\x3c/option\x3e\r\n\t\t\t\t\t\t\x3coption value\x3d"METERS"\x3e${nls.meters}\x3c/option\x3e\r\n\t\t\t\t\t\t\x3coption value\x3d"YARDS"\x3e${nls.yards}\x3c/option\x3e\r\n\t\t\t\t\t\t\x3coption value\x3d"NAUTICAL_MILES"\x3e${nls.nauticalMiles}\x3c/option\x3e\r\n\t\t\t\t\t\x3c/select\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\x3c/tbody\x3e\r\n\t\x3c/table\x3e\r\n\x3c/div\x3e',
    "url:jimu/dijit/templates/SpatialFilterByFeatures.html":
      '\x3cdiv\x3e\r\n\t\x3cdiv class\x3d"layer-tip second-stress" data-dojo-attach-point\x3d"tipNode"\x3e${nls.relatedLayer}\x3c/div\x3e\r\n\t\x3ctable\x3e\r\n\t\t\x3ccolgroup\x3e\r\n\t\t\t\x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n\t\t\t\x3ccol width\x3d"100"\x3e\x3c/col\x3e\r\n\t\t\x3c/colgroup\x3e\r\n\t\t\x3ctbody\x3e\r\n\t\t\t\x3ctr\x3e\r\n\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\x3cdiv class\x3d"layers-select-div" data-dojo-attach-point\x3d"layerSelectDiv"\x3e\x3c/div\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\x3cdiv class\x3d"jimu-float-trailing" data-dojo-attach-point\x3d"featureSetChooserDiv"\x3e\x3c/div\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\x3c/tbody\x3e\r\n\t\x3c/table\x3e\r\n\r\n\t\x3cdiv class\x3d"selection-option not-visible" data-dojo-attach-point\x3d"selectionOptionDiv"\x3e\x3c/div\x3e\r\n\r\n\t\x3cdiv class\x3d"search-distance-div" data-dojo-attach-point\x3d"searchDistanceDiv"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"loading" data-dojo-type\x3d"jimu/dijit/LoadingShelter" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:jimu/dijit/templates/_TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"contentNode" class\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem" tabindex\x3d"-1" aria-selected\x3d"false"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation" style\x3d"display: none;"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:dijit/templates/TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"contentNode"\r\n\t\t\tclass\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem"\r\n\t\t\t\t   tabindex\x3d"-1" aria-selected\x3d"false" id\x3d"${id}_label"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\r\n\t\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation"\r\n\t\t style\x3d"display: none;" aria-labelledby\x3d"${id}_label"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:dijit/templates/Tree.html":
      '\x3cdiv role\x3d"tree"\x3e\r\n\t\x3cdiv class\x3d"dijitInline dijitTreeIndent" style\x3d"position: absolute; top: -9999px" data-dojo-attach-point\x3d"indentDetector"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"dijitTreeExpando dijitTreeExpandoLoading" data-dojo-attach-point\x3d"rootLoadingIndicator"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeContainer" role\x3d"presentation"\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:jimu/dijit/templates/LayerChooserFromMapWithDropbox.html":
      '\x3cdiv\x3e\r\n\x3ctable role\x3d"listbox" aria-haspopup\x3d"true" data-dojo-attach-point\x3d"dropDownBtn" data-dojo-attach-event\x3d"onclick: _onDropDownClick,onkeydown: _onDropDownKeydown"\r\n  tabindex\x3d"0" title\x3d"${nls.customSelectLayer}" aria-label\x3d"${nls.customSelectLayer}"\x3e\r\n    \x3ccaption class\x3d"screen-readers-only-no-position"\x3e${nls.customSelectLayer}\x3c/caption\x3e\r\n    \x3ccolgroup\x3e\r\n      \x3ccol width\x3d"10px"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"30px"\x3e\x3c/col\x3e\r\n    \x3c/colgroup\x3e\r\n    \x3ctbody\x3e\r\n      \x3ctr\x3e\r\n        \x3ctd\x3e\x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"layer-name jimu-ellipsis" data-dojo-attach-point\x3d"layerNameNode"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"drop-select jimu-float-trailing" data-dojo-attach-point\x3d"dropArrowNode"\x3e\r\n            \x3cdiv class\x3d"jimu-icon jimu-icon-down-arrow-8"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n    \x3c/tbody\x3e\r\n  \x3c/table\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/Query/SingleQueryResult.html":
      '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"features-result" data-dojo-attach-point\x3d"featuresResultDiv"\x3e\r\n    \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"popup-menu-button query-result-action-button" data-dojo-attach-point\x3d"btnFeatureAction" data-dojo-attach-event\x3d"click:_onBtnMenuClicked,keydown:_onBtnMenuKeydown"\x3e\x3c/div\x3e\r\n    \x3cdiv tabindex\x3d"0" class\x3d"results-number" data-dojo-attach-point\x3d"resultsNumberDiv"\x3e\r\n      \x3cdiv class\x3d"number-container"\x3e\r\n        \x3cdiv\x3e${nls.displayedFeatures}:\x3c/div\x3e\r\n        \x3cspan data-dojo-attach-point\x3d"numSpan"\x3e\x3c/span\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"action-container"\x3e\r\n        \x3cdiv role\x3d"button" tabindex\x3d"0" data-dojo-attach-point\x3d"loadMoreIcon" class\x3d"icon load-more-button query-hidden" title\x3d"${nls.loadMore}" data-dojo-attach-event\x3d"onclick:_onLoadMoreClicked,onkeydown:_onLoadMoreKeydown"\x3e\x3c/div\x3e\r\n        \x3cdiv role\x3d"button" tabindex\x3d"0" data-dojo-attach-point\x3d"expandedListIcon" class\x3d"icon expand-list" data-dojo-attach-event\x3d"onclick:_onExpandClicked,onkeydown:_onExpandKeydown"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"results-container" data-dojo-attach-point\x3d"resultsContainer" data-dojo-attach-event\x3d"onscroll:_onResultsScroll" onselectstart\x3d"return false;"\x3e\r\n      \x3ctable data-dojo-attach-point\x3d"resultsTable" valign\x3d"top" class\x3d"results-table" data-dojo-attach-event\x3d"onclick:_onResultsTableClicked,onkeydown:_onResultsTableKeydown" cellpadding\x3d"0" cellspacing\x3d"0" \x3e\r\n        \x3ctbody data-dojo-attach-point\x3d"resultsTbody"\x3e\x3c/tbody\x3e\r\n      \x3c/table\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"multiple-related-records-section not-visible" data-dojo-attach-point\x3d"multipleRelatedRecordsDiv"\x3e\r\n    \x3ctable class\x3d"related-records-header multiple-related-records-header"\x3e\r\n      \x3ctbody\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd class\x3d"first-td"\x3e\r\n            \x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"${nls.back}" class\x3d"back-arrow feature-action icon-arrow-back"  data-dojo-attach-point\x3d"multipleRelatedRecordsResultBackBtn" data-dojo-attach-event\x3d"onclick:_onBtnMultipleRelatedBackClicked,onkeydown:_onBtnMultipleRelatedBackKeydown"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"middle-td"\x3e\r\n            \x3cselect data-dojo-type\x3d"jimu/dijit/formSelect" aria-label\x3d"${nls.relatedLayer}" data-dojo-attach-point\x3d"relatedLayersSelect" data-dojo-attach-event\x3d"change:_onRelatedLayersSelectChanged" style\x3d"width:100%;"\x3e\x3c/select\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"last-td"\x3e\x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"single-related-records-section not-visible" data-dojo-attach-point\x3d"singleRelatedRecordsResultDiv"\x3e\r\n    \x3ctable role\x3d"title" tabindex\x3d"0" class\x3d"related-records-header single-related-records-header" data-dojo-attach-point\x3d"singleRelatedRecordsResultTitle" data-a11y-label-by\x3d"single-related-records-title"  data-dojo-attach-event\x3d"onkeydown:_onBtnSingleRelatedTitleKeydown"\x3e\r\n      \x3ctbody\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd class\x3d"first-td"\x3e\r\n            \x3cdiv role\x3d"button" tabindex\x3d"0" aria-label\x3d"${nls.back}" class\x3d"back-arrow feature-action icon-arrow-back" data-dojo-attach-point\x3d"singleRelatedRecordsResultBackBtn" data-dojo-attach-event\x3d"onclick:_onBtnSingleRelatedBackClicked,onkeydown:_onBtnSingleRelatedBackKeydown"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"middle-td"\x3e\r\n            \x3cdiv class\x3d"related-records-title jimu-ellipsis" data-dojo-attach-point\x3d"relatedTitleDiv" data-a11y-label-id\x3d"single-related-records-title"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"last-td"\x3e\x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"shelter" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d"hidden:true"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/Query/RelatedRecordsResult.html":
      '\x3cdiv\x3e\r\n  \x3cdiv role\x3d"button" tabindex\x3d"0" class\x3d"popup-menu-button related-records-action-button not-visible" data-dojo-attach-point\x3d"btnAction" data-dojo-attach-event\x3d"click:_onBtnMenuClicked,keydown:_onBtnMenuKeydown"\x3e\x3c/div\x3e\r\n  \x3cdiv tabindex\x3d"0" class\x3d"noresult-tip not-visible" data-dojo-attach-point\x3d"noResultTip" data-dojo-attach-event\x3d"keydown:_onNoResultTipKeydown"\x3e${nls.noResult}\x3c/div\x3e\r\n  \x3cdiv class\x3d"content not-visible" data-dojo-attach-point\x3d"content" data-dojo-attach-event\x3d"click:_onContentClicked,keydown:_onContentKeydown"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/Query/Widget.html":
      '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"jimu-widget-normal query-widget-content"\x3e\r\n    \x3cdiv class\x3d"query-tab-header" data-dojo-attach-point\x3d"tabHeader" data-dojo-attach-event\x3d"onclick:_onTabHeaderClicked,onkeydown:_onTabHeaderKeydown"\x3e\r\n      \x3cdiv role\x3d"tab" tabindex\x3d"0" aria-selected\x3d"true" class\x3d"query-tab-item jimu-ellipsis jimu-float-leading selected firstFocusNode" data-dojo-attach-point\x3d"taskQueryItem" title\x3d"${labelTasks}"\x3e${labelTasks}\x3c/div\x3e\r\n      \x3cdiv role\x3d"tab" tabindex\x3d"-1" aria-selected\x3d"false" class\x3d"query-tab-item jimu-ellipsis jimu-float-trailing" data-dojo-attach-point\x3d"resultQueryItem" title\x3d"${labelResults}"\x3e${labelResults}\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"query-tabs-container"\x3e\r\n      \x3cdiv class\x3d"query-tab-view task-tab-view selected" data-dojo-attach-point\x3d"taskTabView"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"taskList" class\x3d"task-list"\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"tasksNode" class\x3d"tasks"\x3e\r\n              \x3cdiv class\x3d"execute-tip not-visible"\x3e${nls.executeQueryTip}\x3c/div\x3e\r\n              \x3cdiv class\x3d"tasks-table-container"\x3e\r\n                \x3ctable data-dojo-attach-event\x3d"onclick:_onTaskListClicked,onkeydown:_onTaskListKeydown"\r\n                cellpadding\x3d"0" cellspacing\x3d"0" class\x3d"list-table tasks-table" onselectstart\x3d"return false;"\x3e\r\n                  \x3ccolgroup\x3e\r\n                    \x3ccol width\x3d"40px"\x3e\x3c/col\x3e\r\n                    \x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n                  \x3c/colgroup\x3e\r\n                  \x3ctbody data-dojo-attach-point\x3d"tasksTbody"\x3e\x3c/tbody\x3e\r\n                \x3c/table\x3e\r\n              \x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv tabindex\x3d"0" data-dojo-attach-point\x3d"noQueryTipSection" class\x3d"no-query-tip"\x3e${nls.noTask}\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"taskSettingContainer" class\x3d"task-setting-container"\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n\r\n      \x3cdiv class\x3d"query-tab-view result-tab-view" data-dojo-attach-point\x3d"resultTabView"\x3e\r\n        \x3cdiv class\x3d"result-section" data-dojo-attach-point\x3d"resultSection"\x3e\r\n          \x3cdiv class\x3d"resultlayers-select-div" data-dojo-attach-point\x3d"resultLayersSelectDiv"\x3e\r\n            \x3cdiv data-dojo-type\x3d"jimu/dijit/formSelect" aria-label\x3d"${nls.layerName}" data-dojo-attach-point\x3d"resultLayersSelect" class\x3d"restrict-select-width" style\x3d"width:100%;" data-dojo-attach-event\x3d"change:_onResultLayerSelectChanged"\x3e\x3c/div\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv class\x3d"single-result-details" data-dojo-attach-point\x3d"singleResultDetails"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv tabindex\x3d"0" class\x3d"no-result-section" data-dojo-attach-point\x3d"noresultSection"\x3e${nls.noResult}\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3c!--virtual last focus node--\x3e\r\n  \x3cdiv tabindex\x3d"0" class\x3d"screen-readers-only lastFocusNode" data-dojo-attach-point\x3d"lastNode_framework"\x3e\x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"shelter" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/Query/css/style.css":
      '.jimu-widget-query{position: relative; width: 99%; height: 100%; min-width: 222px; min-height: 237px; overflow-x: hidden;}.jimu-widget-query .list-table tr.single-task:first-child,.jimu-widget-query .query-task-setting,.jimu-widget-query .back-arrow,.jimu-widget-query .single-query-result .query-result-action-button,.jimu-widget-query .single-query-result .query-result-item.jimu-table-row,.jimu-widget-query table.related-records-header,.jimu-widget-query .related-records-result .related-records-action-button,.jimu-widget-query .related-records-result .noresult-tip,.jimu-widget-query .related-records-result .content .item,.jimu-widget-query .related-records-result .content .item-title,.jimu-widget-query .related-records-result .content .item.selected .item-content{outline-offset: -2px !important;}.jimu-widget-query .popup-menu-button {width: 28px; height: 28px;}.jimu-widget-query .query-hidden {visibility: hidden;}.jimu-widget-query .text-ellipsis{white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}.jimu-widget-query .first-stress{font-family: "Avenir Light"; font-size: 14px; color: #000; margin-bottom: 5px; font-weight: bold;}.jimu-widget-query .second-stress{font-size: 12px; color: #353535; margin-bottom: 5px;}.jimu-widget-query .jimu-table-row{color: #000;}.jimu-widget-query .jimu-table-row.jimu-state-active{font-weight: normal; background-color: #eee;}.jimu-widget-query .query-result-item.jimu-table-row:first-child{border-top: 1px solid #cbcbcb;}.jimu-widget-query .not-visible{display: none !important;}.jimu-widget-query .jimu-checkbox .label{font-size: 12px; position: relative; top: 2px;}.jimu-widget-query .query-widget-content{position: absolute; width: 100%; left: 0; right: 0; height: auto; top: 0; bottom: 0;}.jimu-widget-query .query-tab-header{position: absolute; width: 100%; height: 30px; left: 0; right: 0; top: 0; font-size: 14px; border-bottom: 2px solid #ccc;}.jimu-widget-query .query-tab-item{width: calc(50% - 4px); height: 28px; line-height: 28px; cursor: pointer; text-align: center; padding: 0 5px; margin-top: 2px;}.jimu-widget-query .query-tab-item:first-child{margin-left: 2px;}.jimu-widget-query .query-tab-item:last-child{margin-right: 2px;}.jimu-rtl .jimu-widget-query .query-tab-item:first-child{margin-left: 0; margin-right: 2px;}.jimu-rtl .jimu-widget-query .query-tab-item:last-child{margin-right: 0; margin-left: 2px;}.jimu-widget-query .query-tab-item.selected{border-bottom: 2px solid #898989; font-weight: bold; color: #000;}.jimu-widget-query .query-tabs-container{position: absolute; width: 100%; left: 0; right: 0; top: 30px; bottom: 0;}.jimu-widget-query .query-tab-view{display: none; position: relative; width: 100%; height: 100%;}.jimu-widget-query .query-tab-view.selected{display: block;}.jimu-widget-query .list-table{width: 99%; border-collapse: collapse; table-layout: fixed; margin-left: auto; margin-right: auto;}.jimu-widget-query .list-table tr.single-task{border-top: 1px solid #D7D7D7; border-bottom: 1px solid #D7D7D7;}.jimu-widget-query .list-table tr.single-task:first-child{border-top: 0;}.jimu-widget-query .list-table tr.single-task:hover, .jimu-widget-query .list-table tr.single-task.selected{background-color: #eee;}.jimu-widget-query .list-table tr.single-task \x3e td{padding-top: 13px; padding-bottom: 13px; cursor: pointer; vertical-align: top;}.jimu-widget-query .list-table tr.single-task .list-item-name{width: 100%; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 16px;}.jimu-widget-query .list-table tr.single-task .first-td{text-align: center;}.jimu-widget-query .list-table tr.single-task .task-icon{width: 16px; height: 16px; vertical-align: middle;}.jimu-widget-query .task-list{position: absolute; top: 10px; bottom: 0; width: 100%;}.jimu-widget-query .task-list .tasks{position: absolute; width: 100%; height: 100%; left: 0; top: 0; overflow-y: auto;}.jimu-widget-query .task-list .tasks .execute-tip{margin-top: 10px; line-height: 20px;}.jimu-widget-query .task-list .tasks .tasks-table-container{width: 100%;}.jimu-widget-query .task-list .invalid-config{display: none; position: absolute; width: 100%; height: 100%; left: 0; top: 0;}.jimu-widget-query .task-list .no-query-tip{display: none; margin: 0 2px; line-height: 20px;}.jimu-widget-query .task-setting-container{height: 100%; display: none;}.jimu-widget-query .query-task-setting{position: relative; height: 100%;}.jimu-widget-query .query-task-setting table.top{width: 100%; table-layout: fixed; padding-top: 12px;}.jimu-widget-query .query-task-setting table.top .first-td{width: 30px;}.jimu-widget-query .query-task-setting table.top .second-td{width: auto;}.jimu-widget-query .query-task-setting table.top .third-td{width: 30px;}.jimu-widget-query.only-one-task .query-task-setting table.top .first-td,.jimu-widget-query.only-one-task .query-task-setting table.top .third-td{width: 0;}.jimu-widget-query.only-one-task .query-task-setting table.top .first-td,.jimu-widget-query.only-one-task .query-task-setting table.top .third-td{display: none; overflow: hidden;}.jimu-widget-query .back-arrow{display: inline-block; width: 16px; height: 16px;}.jimu-rtl .jimu-widget-query .back-arrow{-webkit-transform: rotate(180deg); -ms-transform: rotate(180deg); transform: rotate(180deg);}.jimu-widget-query .query-task-setting .task-name{text-align: center;}.jimu-widget-query .query-task-setting .content-container {position: absolute; width: 100%; top: 50px; overflow-x: hidden; overflow-y: auto; bottom: 50px; padding: 2px;}.jimu-widget-query .query-task-setting .content-container .result-name-container {margin-top: 12px;}.jimu-widget-query .query-task-setting .content-container .result-name-container .result-name-text {width: 100%;}.jimu-widget-query .query-task-setting .spatial-section .spearator{height: 1px; margin-bottom: 12px; border-top: 1px solid #D7D7D7; display: none;}.jimu-widget-query .query-task-setting .spatial-section .relationship-section{margin-top: 10px;}.jimu-widget-query .query-task-setting .spatial-section .jimu-dijit-spatial-filter-features{margin-top: 10px;}.jimu-widget-query .query-task-setting .attributes-section{margin-bottom: 12px;}.jimu-widget-query .query-task-setting .attributes-section .jimu-filter-parameters .jimu-single-filter-parameter .hint{color:#666666;}.jimu-widget-query .query-task-setting .attributes-section .jimu-filter-parameters .jimu-single-filter-parameter .prompt{color:#000000;}.jimu-widget-query .query-task-setting .attributes-section .attribute-filter-label{margin-bottom: 5px;}.jimu-widget-query .query-task-setting .btn-execute.jimu-btn{position: absolute; width: calc(100% - 4px); margin: 0 2px; bottom: 2px; text-align: center; background-color: #59A700; border-radius: 0;}.jimu-widget-query .query-task-setting .btn-execute.jimu-btn.disabled{background-color: #ccc !important; cursor: default;}.jimu-widget-query .query-task-setting .btn-execute:hover{background-color: #417505;}.jimu-widget-query .query-task-setting .btn-execute:active{background-color: #59A700;}.jimu-query-spatial-filter-drawing \x3e .jimu-checkbox {width: 100%;}.jimu-query-spatial-filter-drawing \x3e .jimu-checkbox \x3e div.label {white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 90%;}.jimu-query-spatial-filter-drawing .search-distance-div{margin-top: 15px;}.jimu-query-spatial-filter-drawing .jimu-draw-box .drawings-clear{margin-left: 18px;}.jimu-rtl .jimu-query-spatial-filter-drawing .jimu-draw-box .drawings-clear{margin-left: 0; margin-right: 18px;}.jimu-widget-query .result-list{padding-top: 10px;}.jimu-widget-query .result-tab-view .result-section{position: absolute; left: 0; right: 0; top: 0; bottom: 0;}.jimu-widget-query .result-tab-view .no-result-section{position: absolute; top: 10px; margin: 0 2px; line-height: 20px; width: calc(100% - 4px);}.jimu-widget-query .resultlayers-select-div{position: absolute; left: 2px; right: 37px; top: 15px; text-align: center; overflow: visible;}.jimu-rtl .jimu-widget-query .resultlayers-select-div{left: 37px; right: 2px;}.jimu-widget-query .single-result-details{position: absolute; width: 100%; left: 0; right: 0; top: 45px; bottom: 5px;}.jimu-widget-query .single-query-result,.jimu-widget-query .single-query-result .features-result{position: relative; width: 100%; height: 100%;}.jimu-widget-query .single-query-result .multiple-related-records-section,.jimu-widget-query .single-query-result .single-related-records-section{position: relative; width: 100%; height: calc(100% + 45px); top: -45px;}.jimu-widget-query .single-query-result .query-result-action-button{position: absolute; top: -28px; right: 0;}.jimu-rtl .jimu-widget-query .single-query-result .query-result-action-button{right: auto; left: 0;}.jimu-widget-query .single-query-result .results-number{position: relative; top: 13px; margin: 0 2px; display: flex; align-items: center; justify-content: space-between;}.jimu-widget-query .single-query-result .results-number .number-container {display: flex; align-items: center; justify-content: flex-start;}.jimu-widget-query .single-query-result .results-number .action-container {display: flex; align-items: center; justify-content: space-between; width: 52px;}.jimu-widget-query .single-query-result .results-number .action-container .icon {width: 16px; height: 16px; cursor: pointer; background-position: center; background-repeat: no-repeat; background-size: contain; background-clip: content-box;}.jimu-widget-query .single-query-result .results-number .action-container .icon.load-more-button {background-image: url(images/load-light-hover.svg); opacity: 0.5;}.jimu-widget-query .single-query-result .results-number .action-container .icon.load-more-button.loading,.jimu-widget-query .single-query-result .results-number .action-container .icon.load-more-button.loading:hover {background-image: url(images/loading-light.svg); -webkit-animation: load8 1.1s infinite linear; animation: load8 1.1s infinite linear;}.jimu-widget-query .single-query-result .results-number .action-container .icon.load-more-button:hover {background-image: url(images/load-light-hover.svg); opacity:1;}.jimu-widget-query .single-query-result .results-number .action-container .icon.expand-list {background-image: url(images/fold-list-light-hover.svg); opacity: 0.5;}.jimu-widget-query .single-query-result .results-number .action-container .icon.expand-list:hover {background-image: url(images/fold-list-light-hover.svg); opacity: 1;}.jimu-widget-query .single-query-result .results-number .action-container .icon.expand-list.folded {background-image: url(images/expand-list-light-hover.svg); opacity:0.5;}.jimu-widget-query .single-query-result .results-number .action-container .icon.expand-list.folded:hover {background-image: url(images/expand-list-light-hover.svg); opacity:1;}.jimu-widget-query .single-query-result .results-container{position: absolute; width: 100%; left: 0; right: 0; top: 40px; bottom: 0; overflow-x: hidden; overflow-y: auto;}.jimu-widget-query .single-query-result .results-container .query-result-item-table .popup-td .popup-title-container {display: flex; align-items: center; justify-content: space-between;}.jimu-widget-query .single-query-result .results-container .query-result-item-table .popup-td .popup-title-container .popup-title {font-weight: bold;}.jimu-widget-query .single-query-result .results-container .query-result-item-table .popup-td .popup-content {margin-top: 8px;}.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td .popup-content,.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td.folded .popup-content,.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td.folded .popup-content {display: none;}.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td .popup-content,.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td.expanded .popup-content,.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td.expanded .popup-content {display: block;}.jimu-widget-query .single-query-result .results-container .query-result-item-table .popup-td .popup-title-icon {width: 24px; height: 16px;}.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td .popup-title-icon,.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td.folded .popup-title-icon,.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td.folded .popup-title-icon {background: url(images/expand-item-light-hover.svg) center center no-repeat content-box; opacity: 0.5;}.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td .popup-title-icon:hover,.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td.folded .popup-title-icon:hover,.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td.folded .popup-title-icon:hover {background: url(images/expand-item-light-hover.svg) center center no-repeat content-box; opacity: 1;}.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td .popup-title-icon,.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td.expanded .popup-title-icon,.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td.expanded .popup-title-icon {background: url(images/fold-item-light-hover.svg) center center no-repeat content-box; opacity: 0.5; outline-offset: -1px !important;}.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td .popup-title-icon:hover,.jimu-widget-query .single-query-result .results-container tbody.expanded .query-result-item-table .popup-td.expanded .popup-title-icon:hover,.jimu-widget-query .single-query-result .results-container tbody.folded .query-result-item-table .popup-td.expanded .popup-title-icon:hover {background: url(images/fold-item-light-hover.svg) center center no-repeat content-box; opacity: 1;}.jimu-widget-query .single-query-result .results-table{table-layout: fixed; width: 100%; border-collapse: collapse;}.jimu-widget-query .single-query-result .query-result-item.jimu-table-row{border-left: 0 !important; border-right: 0 !important;}.jimu-widget-query .single-query-result .query-result-item \x3e td{padding-top: 8px; padding-bottom: 8px; cursor: pointer;}.jimu-rtl .jimu-widget-query .single-query-result .query-result-item \x3e td{padding-left: 0; padding-right: 15px;}.jimu-widget-query .single-query-result .query-result-item .esriViewPopup .header{margin-bottom: 8px;}.jimu-widget-query .single-query-result .query-result-item .esriViewPopup .hzLine{display: none;}.jimu-widget-query .single-query-result .query-result-item .esriViewPopup .mainSection .break{display: none;}.jimu-widget-query .single-query-result .query-result-item-table{width: 100%; table-layout: fixed; border-collapse: collapse;}.jimu-widget-query .single-query-result .query-result-item-table .symbol-td{width: 36px;}.jimu-widget-query .single-query-result .query-result-item-table .popup-td{width: auto;}.jimu-widget-query .single-query-result .query-result-item .related-table-btn{height: 30px; line-height: 30px; margin: 5px 2px; padding: 0 5px; background: url(images/arrow_right1.png) right center no-repeat content-box; overflow: hidden; text-overflow: hidden; white-space: nowrap; font-family: "Avenir Medium"; color: #000;}.jimu-widget-query .single-query-result .query-result-item .related-table-btn:hover{font-weight: bold; background: url(images/arrow_right2.png) right center no-repeat content-box;}.jimu-rtl .jimu-widget-query .single-query-result .query-result-item .related-table-btn{background: url(images/arrow_left1.png) left center no-repeat content-box;}.jimu-rtl .jimu-widget-query .single-query-result .query-result-item .related-table-btn:hover{background: url(images/arrow_left2.png) left center no-repeat content-box;}.jimu-widget-query table.related-records-header{margin-top: 5px; width: 100%; min-height: 36px; border-collapse: collapse; table-layout: fixed;}.jimu-widget-query table.related-records-header\x3etbody\x3etr\x3etd{height: 36px;}.jimu-widget-query table.related-records-header\x3etbody\x3etr\x3e.first-td{width: 30px;}.jimu-widget-query table.related-records-header\x3etbody\x3etr\x3e.middle-td{width: auto;}.jimu-widget-query table.related-records-header\x3etbody\x3etr\x3e.last-td{width: 40px;}.jimu-widget-query table.related-records-header .related-records-title{text-align: center;}.jimu-widget-query .related-records-result{position: absolute; left: 0; right: 0; top: 45px; bottom: 0; width: 100%; height: calc(100% - 45px);}.jimu-widget-query .related-records-result .related-records-action-button{position: absolute; right: 0; top: -40px; z-index: 1;}.jimu-rtl .jimu-widget-query .related-records-result .related-records-action-button{position: absolute; right: auto; left: 0; top: 0;}.jimu-widget-query .related-records-result .noresult-tip{line-height: 25px; padding: 0 2px;}.jimu-widget-query .related-records-result .content{position: absolute; left: 0; right: 0; top: 0; bottom: 0; overflow: auto;}.jimu-widget-query .related-records-result .content .item{border-top: 1px solid #E2E2E2;}.jimu-widget-query .related-records-result .content .item:last-child{border-bottom: 1px solid #E2E2E2;}.jimu-widget-query .related-records-result .content .item-title{position: relative; height: 36px; line-height: 36px; cursor: pointer; background: url(images/arrow_right1.png) right center no-repeat content-box;}.jimu-rtl .jimu-widget-query .related-records-result .content .item-title{background: url(images/arrow_left1.png) left center no-repeat content-box;}.jimu-widget-query .related-records-result .content .item.selected .item-title{background: url(images/arrow_down.png) right center no-repeat content-box;}.jimu-rtl .jimu-widget-query .related-records-result .content .item.selected .item-title{background: url(images/arrow_down.png) left center no-repeat content-box;}.jimu-widget-query .related-records-result .content .item-title .esriNumericValue{position: absolute; left: 4px; right: 18px; top: 0; bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}.jimu-rtl .jimu-widget-query .related-records-result .content .item-title .esriNumericValue{left: 18px; right: 4px;}.jimu-widget-query .related-records-result .content .item-content{border-top: 1px solid #E2E2E2; display: none;}.jimu-widget-query .related-records-result .content .item.selected .item-content{display: block;}.jimu-widget-query .related-records-result .esriViewPopup .header{display: none;}.jimu-widget-query .related-records-result .esriViewPopup .hzLine{display: none;}.query-resultlayer-tooltipdialog-content{cursor: default;}.query-resultlayer-tooltipdialog-content .result-item{height: 20px; line-height: 20px; cursor: pointer;}.query-operations-tooltipdialog-content{cursor: default;}.query-operations-tooltipdialog-content .operation-item{height: 20px; line-height: 20px; cursor: pointer;}',
    "*now": function(k) {
      k([
        'dojo/i18n!*preload*widgets/Query/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/on dojo/keys dojo/query dojo/Deferred dojo/_base/lang dojo/_base/html dojo/_base/array dojo/promise/all dojo/_base/declare dijit/_WidgetsInTemplateMixin jimu/utils jimu/BaseWidget jimu/MapManager jimu/filterUtils jimu/dijit/Message jimu/symbolUtils esri/lang esri/request esri/symbols/jsonUtils esri/layers/FeatureLayer esri/dijit/PopupTemplate esri/renderers/SimpleRenderer ./TaskSetting ./SingleQueryLoader ./SingleQueryResult ./utils jimu/LayerInfos/LayerInfos jimu/dijit/LoadingIndicator jimu/dijit/formSelect".split(
  " "
), function(
  k,
  l,
  q,
  n,
  f,
  e,
  g,
  h,
  t,
  c,
  b,
  a,
  d,
  m,
  w,
  u,
  y,
  A,
  x,
  D,
  E,
  z,
  H,
  C,
  J,
  B,
  K
) {
  return t([a, c], {
    name: "Query",
    baseClass: "jimu-widget-query",
    currentTaskSetting: null,
    hiddenClass: "not-visible",
    _resultLayerInfos: null,
    mapManager: null,
    layerInfosObj: null,
    labelTasks: "",
    labelResults: "",
    _focusNodes: {},
    miniCycleHandlers: {},
    postMixInProperties: function() {
      this.inherited(arguments);
      this.layerInfosObj = K.getInstanceSync();
      this.mapManager = d.getInstance();
      this._resultLayerInfos = [];
      var a = y.substitute(
        { clearResults: this.nls.clearResults },
        this.nls.operationalTip
      );
      this.nls.operationalTip = a;
      this.nls.layerName = window.apiNls.widgets.directions.layerName;
      this.labelTasks = this.nls.tasks;
      this.labelResults = this.nls.queryResults;
      this._setUrlForConfig();
      this._showFilterLabel = !0;
      this.config &&
        ((this.config = B.getConfigWithValidDataSource(this.config)),
        this._updateConfig(),
        this.config.labelTasks && (this.labelTasks = this.config.labelTasks),
        this.config.labelResults &&
          (this.labelResults = this.config.labelResults),
        (this._showFilterLabel = this.config.showFilterLabel));
    },
    _updateConfig: function() {
      this.config &&
        this.config.queries &&
        0 < this.config.queries.length &&
        g.forEach(
          this.config.queries,
          f.hitch(this, function(a) {
            this._rebuildFilter(a.url, a.filter);
          })
        );
      this.config &&
        ("undefined" === typeof this.config.showFilterLabel &&
          (this.config.showFilterLabel = !0),
        "undefined" === typeof this.config.criteiraLabel &&
          (this.config.criteiraLabel = this.nls.queryCriteira),
        "undefined" === typeof this.config.spatialFilterLabel &&
          (this.config.spatialFilterLabel = this.nls.spatialFilter));
    },
    _setUrlForConfig: function() {
      this.config &&
        this.config.queries &&
        0 < this.config.queries.length &&
        g.forEach(
          this.config.queries,
          f.hitch(this, function(a) {
            if (a.webMapLayerId) {
              var b = this.layerInfosObj.getLayerOrTableInfoById(
                a.webMapLayerId
              );
              b && (a.url = b.getUrl());
            }
          })
        );
    },
    _rebuildFilter: function(a, c) {
      try {
        if (c) {
          delete c.expr;
          var d = new m();
          d.isHosted = b.isHostedService(a);
          d.getExprByFilterObj(c);
        }
      } catch (I) {
        console.log(I);
      }
    },
    postCreate: function() {
      this.inherited(arguments);
      this._initSelf();
      this._updateResultDetailUI();
      var a = q(".single-task", this.tasksTbody);
      1 === a.length
        ? (e.addClass(this.domNode, "only-one-task"),
          this._showTaskSettingPane(!0),
          this._onClickTaskTr(a[0]))
        : (this._updateFocusNodes("taskList"),
          this.own(
            k(
              this.taskTabView,
              "keydown",
              f.hitch(this, function(a) {
                a.keyCode === l.ESCAPE &&
                  (a.stopPropagation(), this.taskQueryItem.focus());
              })
            )
          ));
      this.own(
        k(
          this.resultTabView,
          "keydown",
          f.hitch(this, function(a) {
            a.keyCode === l.ESCAPE &&
              (a.stopPropagation(), this.resultQueryItem.focus());
          })
        )
      );
      this.own(
        k(
          this.lastNode_framework,
          "focus",
          f.hitch(this, function() {
            ("true" === e.getAttr(this.taskQueryItem, "aria-selected")
              ? this.taskQueryItem
              : this.resultQueryItem
            ).focus();
          })
        )
      );
    },
    _focusCurrentFirstNode: function(a) {
      a ||
        (a =
          "true" === e.getAttr(this.taskQueryItem, "aria-selected")
            ? "none" !== e.getStyle(this.taskList, "display")
              ? this._focusNodes.taskList.first
              : this._focusNodes.taskSetting
              ? this._focusNodes.taskSetting.first
              : null
            : this._focusNodes.result
            ? this._focusNodes.result.first
            : null);
      a && a.focus();
    },
    _updateFocusNodes: function(a) {
      var b, c;
      if ("taskList" === a)
        (c = q(".single-task", this.tasksTbody)),
          0 === c.length
            ? (b = c = this.noQueryTipSection)
            : ((b = c[0]), (c = c[c.length - 1])),
          (this._focusNodes.taskList = { first: b, last: c });
      else if ("taskSetting" === a)
        (b = this.currentTaskSetting.domNode),
          (c = this.currentTaskSetting.btnExecute),
          (this._focusNodes.taskSetting = { first: b, last: c });
      else if ("result" === a) {
        if (0 === this._resultLayerInfos.length) c = b = this.noresultSection;
        else {
          b = q(
            "." + this.singleQueryResult._lastFeatureClass,
            this.singleQueryResult.resultsTbody
          );
          if (b[0]) {
            b = b[b.length - 1];
            c = q("." + this.singleQueryResult._lastRelatedClass, b)[0];
            var d = q(".popup-content", b)[0],
              d = "block" === e.getStyle(d, "display");
            c =
              c && d
                ? c
                : q("." + this.singleQueryResult._lastFeatureArrowClass, b)[0];
          } else c = this.singleQueryResult.expandedListIcon;
          b = this.resultLayersSelect.domNode;
        }
        this._focusNodes.result = { first: b, last: c };
      }
      this._initMiniCycle(a, b, c);
    },
    _initMiniCycle: function(a, b, c) {
      this.miniCycleHandlers[a]
        ? (this.miniCycleHandlers[a].first.remove(),
          this.miniCycleHandlers[a].last.remove())
        : (this.miniCycleHandlers[a] = {});
      this.miniCycleHandlers[a].first = k(
        b,
        "keydown",
        f.hitch(this, function(a) {
          a.keyCode === l.TAB &&
            a.shiftKey &&
            a.target === b &&
            (a.preventDefault(), c.focus());
        })
      );
      this.miniCycleHandlers[a].last = k(
        c,
        "keydown",
        f.hitch(this, function(a) {
          a.keyCode !== l.TAB || a.shiftKey || (a.preventDefault(), b.focus());
        })
      );
    },
    _onFeaturesLayoutUpdate: function() {
      this._updateFocusNodes("result");
    },
    onOpen: function() {
      var a = this._getCurrentResultLayerInfo();
      (a = a && a.singleQueryResult) && a.showLayer();
      this._showTempLayers();
      this.inherited(arguments);
    },
    onActive: function() {
      this._showTempLayers();
    },
    onDeActive: function() {
      this.currentTaskSetting && this.currentTaskSetting.deactivate();
      this.mapManager.enableWebMapPopup();
      this._hideTempLayers();
    },
    onClose: function() {
      this.config.hideLayersAfterWidgetClosed && this._hideAllLayers();
      this._hideInfoWindow();
      this._hideTempLayers();
      this.inherited(arguments);
    },
    destroy: function() {
      this._hideInfoWindow();
      this._removeResultLayerInfos(this._resultLayerInfos);
      this.inherited(arguments);
    },
    _hideTempLayers: function() {
      this.currentTaskSetting && this.currentTaskSetting.hideTempLayers();
    },
    _showTempLayers: function() {
      this.currentTaskSetting && this.currentTaskSetting.showTempLayers();
    },
    _initSelf: function() {
      var a = this.config.queries;
      0 === a.length
        ? (e.setStyle(this.tasksNode, "display", "none"),
          e.setStyle(this.noQueryTipSection, "display", "block"))
        : g.forEach(
            a,
            f.hitch(this, function(a, b) {
              B.dynamicUpdateConfigIcon(
                a,
                this.folderUrl + "css/images/default_task_icon.png"
              );
              var c = a.name,
                d = e.toDom(
                  '\x3ctr role\x3d"button" tabindex\x3d"0" class\x3d"single-task"\x3e\x3ctd class\x3d"first-td"\x3e\x3cspan class\x3d"task-icon"\x3e\x3c/span\x3e\x3c/td\x3e\x3ctd class\x3d"second-td"\x3e\x3cdiv class\x3d"list-item-name task-name-div"\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e'
                );
              q(".task-name-div", d)[0].innerHTML = c;
              e.place(d, this.tasksTbody);
              var c = q("span.task-icon", d)[0],
                f = a.icon;
              if (f) {
                var p = null;
                f.url || f.imageData
                  ? (f.setWidth(16), f.setHeight(16))
                  : ((p = { width: 17, height: 17 }), f.setSize(16));
                f = u.createSymbolNode(f, p);
                e.place(f, c);
              }
              d.taskIndex = b;
              d.singleConfig = a;
              0 === b % 2 ? e.addClass(d, "even") : e.addClass(d, "odd");
            })
          );
    },
    _onTabHeaderClicked: function(a) {
      a = a.target || a.srcElement;
      a === this.taskQueryItem
        ? ((a = this._getCurrentResultLayerInfo()) &&
            (a = a.singleQueryResult) &&
            (a.singleRelatedRecordsResult || a.multipleRelatedRecordsResult) &&
            a._showFeaturesResultDiv(),
          this._switchToTaskTab())
        : a === this.resultQueryItem && this._switchToResultTab();
    },
    _onTabHeaderKeydown: function(a) {
      var b = a.target || a.srcElement;
      a.keyCode === l.ENTER
        ? this._onTabHeaderClicked(a)
        : a.keyCode === l.LEFT_ARROW || a.keyCode === l.RIGHT_ARROW
        ? (b === this.taskQueryItem
            ? this.resultQueryItem
            : this.taskQueryItem
          ).focus()
        : a.keyCode === l.TAB &&
          (a.shiftKey
            ? a.preventDefault()
            : b === this.taskQueryItem &&
              "-1" === e.getAttr(this.taskQueryItem, "tabindex") &&
              (a.preventDefault(), this._focusCurrentFirstNode()));
    },
    _switchToTaskTab: function() {
      e.removeClass(this.resultQueryItem, "selected");
      e.removeClass(this.resultTabView, "selected");
      e.addClass(this.taskQueryItem, "selected");
      e.addClass(this.taskTabView, "selected");
      e.setAttr(this.resultQueryItem, "tabindex", "-1");
      e.setAttr(this.resultQueryItem, "aria-selected", "false");
      e.setAttr(this.taskQueryItem, "tabindex", "0");
      e.setAttr(this.taskQueryItem, "aria-selected", "true");
      b.initFirstFocusNode(this.domNode, this.taskQueryItem);
    },
    _switchToResultTab: function() {
      this._updateResultDetailUI();
      e.removeClass(this.taskQueryItem, "selected");
      e.removeClass(this.taskTabView, "selected");
      e.addClass(this.resultQueryItem, "selected");
      e.addClass(this.resultTabView, "selected");
      e.setAttr(this.taskQueryItem, "tabindex", "-1");
      e.setAttr(this.taskQueryItem, "aria-selected", "false");
      e.setAttr(this.resultQueryItem, "tabindex", "0");
      e.setAttr(this.resultQueryItem, "aria-selected", "true");
      this._updateFocusNodes("result");
      b.initFirstFocusNode(this.domNode, this.resultQueryItem);
    },
    _updateResultDetailUI: function() {
      0 < this._resultLayerInfos.length
        ? (e.removeClass(this.resultSection, this.hiddenClass),
          e.addClass(this.noresultSection, this.hiddenClass))
        : (e.addClass(this.resultSection, this.hiddenClass),
          e.removeClass(this.noresultSection, this.hiddenClass),
          this.noresultSection.focus());
    },
    _showTaskListPane: function() {
      e.setStyle(this.taskList, "display", "block");
      e.setStyle(this.taskSettingContainer, "display", "none");
      this._switchToTaskTab();
    },
    _showTaskSettingPane: function() {
      e.setStyle(this.taskList, "display", "none");
      e.setStyle(this.taskSettingContainer, "display", "block");
      this._switchToTaskTab();
    },
    _onTaskListClicked: function(a) {
      (a = b.getAncestorDom(
        a.target || a.srcElement,
        f.hitch(this, function(a) {
          return e.hasClass(a, "single-task");
        }),
        10
      )) && this._onClickTaskTr(a);
    },
    _onTaskListKeydown: function(a) {
      (a.keyCode !== l.ENTER && a.keyCode !== l.SPACE) ||
        this._onClickTaskTr(a.target || a.srcElement);
    },
    _onClickTaskTr: function(a) {
      this._getLayerInfoAndRelationshipLayerInfos(a).then(
        f.hitch(this, function(c) {
          var d = c.layerInfo,
            p = c.layerObject,
            g = c.relationshipLayerInfos;
          c = c.relationshipPopupTemplates;
          a.singleConfig.objectIdField = b.getObjectIdField(d);
          var h = this._getPopupInfo(d, a.singleConfig);
          h || console.error("can't get popupInfo");
          h.fieldInfos = B.getPortalFieldInfosWithoutShape(d, h.fieldInfos);
          delete h.readFromWebMap;
          var r = C.getCleanCurrentAttrsTemplate();
          r.queryTr = a;
          r.config = f.clone(a.singleConfig);
          r.config.popupInfo = h;
          r.layerInfo = d;
          r.layerObject = p;
          r.relationshipLayerInfos = g;
          r.relationshipPopupTemplates = c;
          r.query.maxRecordCount = d.maxRecordCount || 1e3;
          r.queryType = B.getQueryType(d);
          this.currentTaskSetting && this.currentTaskSetting.destroy();
          this.currentTaskSetting = null;
          this._showTaskSettingPane();
          this.currentTaskSetting = new H({
            wId: this.id,
            nls: this.nls,
            map: this.map,
            showFilterLabel: this._showFilterLabel,
            criteiraLabel: this.config.criteiraLabel,
            spatialFilterLabel: this.config.spatialFilterLabel,
            currentAttrs: r,
            layerInfosObj: this.layerInfosObj,
            onBack: f.hitch(this, function() {
              this._showTaskListPane();
              this._focusCurrentFirstNode();
            }),
            onApply: f.hitch(this, function(a) {
              this._onBtnApplyClicked(a);
            })
          });
          this.currentTaskSetting.canAutoRunning() &&
            (this._switchToResultTab(), this.currentTaskSetting.run());
          this.currentTaskSetting.placeAt(this.taskSettingContainer);
          this._updateFocusNodes("taskSetting");
          this._focusCurrentFirstNode();
          this.own(
            k(
              this.currentTaskSetting.domNode,
              "keydown",
              f.hitch(this, function(a) {
                a.keyCode === l.ESCAPE &&
                  (a.stopPropagation(),
                  e.hasClass(this.domNode, "only-one-task") ||
                  a.target === this.currentTaskSetting.backArrow
                    ? this.taskQueryItem.focus()
                    : this.currentTaskSetting.backArrow.focus());
              })
            )
          );
        }),
        f.hitch(this, function(a) {
          console.error("can't get layerInfo", a);
        })
      );
    },
    _getLayerInfoAndServiceInfo: function(a) {
      var b = new n(),
        c = this._getLayerInfo(a),
        d = this._getServiceInfo(a);
      this.shelter.show();
      h([c, d]).then(
        f.hitch(this, function(c) {
          this.domNode &&
            (this.shelter.hide(),
            (a.layerInfo = c[0]),
            (a.serviceInfo = c[1]),
            b.resolve({ layerInfo: a.layerInfo, serviceInfo: a.serviceInfo }));
        }),
        f.hitch(this, function(a) {
          console.error(a);
          if (this.domNode) {
            this.shelter.hide();
            var c = "";
            a && 403 === a.httpCode && (c = this.nls.noPermissionsMsg);
            this._showQueryErrorMsg(c);
            b.reject();
          }
        })
      );
      return b;
    },
    _getLayerInfoAndRelationshipLayerInfos: function(a) {
      var b = new n();
      this.shelter.show();
      var c = this._getLayerInfo(a),
        d = B.tryGetLayerObject(a.singleConfig.webMapLayerId);
      h([c, d]).then(
        f.hitch(this, function(c) {
          var d = c[0],
            e = c[1];
          a.layerInfo = d;
          a.layerObject = e;
          this._getRelationshipLayerInfos(a).then(
            f.hitch(this, function(c) {
              if (this.domNode) {
                a.relationshipLayerInfos = c;
                var f = {},
                  g = this.map.itemInfo.itemData,
                  p = a.singleConfig.url.replace(/\d*\/*$/g, ""),
                  h;
                for (h in c) {
                  var k = B.getPopupInfoForRelatedLayer(g, p + h, c[h]);
                  f[h] = new E(k);
                }
                this.shelter.hide();
                b.resolve({
                  layerInfo: d,
                  layerObject: e,
                  relationshipLayerInfos: c,
                  relationshipPopupTemplates: f
                });
              }
            }),
            f.hitch(this, function(a) {
              this.domNode && (this.shelter.hide(), b.reject(a));
            })
          );
        }),
        f.hitch(this, function(a) {
          this.domNode && (this.shelter.hide(), b.reject(a));
        })
      );
      return b;
    },
    _getLayerInfo: function(a) {
      var b = new n();
      a.layerInfo
        ? b.resolve(a.layerInfo)
        : A({
            url: a.singleConfig.url,
            content: { f: "json" },
            handleAs: "json",
            callbackParamName: "callback"
          }).then(
            f.hitch(this, function(c) {
              a.layerInfo = c;
              b.resolve(c);
            }),
            f.hitch(this, function(a) {
              b.reject(a);
            })
          );
      return b;
    },
    _getServiceInfo: function(a) {
      var b = new n();
      if (a.serviceInfo) b.resolve(a.serviceInfo);
      else {
        var c = this._getServiceUrlByLayerUrl(a.singleConfig.url);
        A({
          url: c,
          content: { f: "json" },
          handleAs: "json",
          callbackParamName: "callback"
        }).then(
          f.hitch(this, function(c) {
            a.serviceInfo = c;
            b.resolve(c);
          }),
          f.hitch(this, function(a) {
            b.reject(a);
          })
        );
      }
      return b;
    },
    _getRelationshipLayerInfos: function(a) {
      var b = new n();
      if (a.relationshipLayerInfos) b.resolve(a.relationshipLayerInfos);
      else {
        var c = a.layerInfo.relationships;
        if (c && 0 < c.length) {
          var d = this._getServiceUrlByLayerUrl(a.singleConfig.url),
            e = g.map(
              c,
              f.hitch(this, function(a) {
                return A({
                  url: d + "/" + a.relatedTableId,
                  content: { f: "json" },
                  handleAs: "json",
                  callbackParamName: "callback"
                });
              })
            );
          h(e).then(
            f.hitch(this, function(d) {
              a.relationshipLayerInfos = {};
              g.forEach(
                c,
                f.hitch(this, function(b, c) {
                  a.relationshipLayerInfos[b.relatedTableId] = d[c];
                })
              );
              b.resolve(a.relationshipLayerInfos);
            }),
            f.hitch(this, function(c) {
              a.relationshipLayerInfos = null;
              b.reject(c);
            })
          );
        } else
          (a.relationshipLayerInfos = {}), b.resolve(a.relationshipLayerInfos);
      }
      return b;
    },
    _getServiceUrlByLayerUrl: function(a) {
      var b = a.lastIndexOf("/");
      return a.slice(0, b);
    },
    _getPopupInfo: function(a, b) {
      var c = null,
        d = B.getDefaultPopupInfo(a, !1, !1),
        c = d,
        c = null;
      b.popupInfo
        ? b.popupInfo.readFromWebMap
          ? b.webMapLayerId
            ? ((c = null),
              (c = (c = B.isTable(a)
                ? this.layerInfosObj.getTableInfoById(b.webMapLayerId)
                : this.layerInfosObj.getLayerInfoById(b.webMapLayerId))
                ? (c = c.getPopupInfo())
                  ? f.clone(c)
                  : d
                : d))
            : (c = d)
          : ((c = f.clone(b.popupInfo)), delete c.readFromWebMap)
        : (c = b.popup ? B.upgradePopupToPopupInfo(a, b.popup) : d);
      c || (c = d);
      c.showAttachments = !!a.hasAttachments;
      B.removePopupInfoUnsupportFields(a, c);
      return c;
    },
    _onBtnApplyClicked: function(a) {
      this.mapManager.enableWebMapPopup();
      e.addClass(this.resultTabView, this.hiddenClass);
      if (a.config.singleResultLayer) {
        var c = this._getResultLayerInfosByTaskIndex(a.queryTr.taskIndex);
        0 < c.length && this._removeResultLayerInfos(c);
      }
      var d = this.currentTaskSetting.getQueryResultName(),
        d = b.sanitizeHTML(d);
      this._createNewResultLayer(a, d);
      this.shelter.show();
      var g = new J({
        map: this.map,
        nls: this.nls,
        label: d,
        currentAttrs: a,
        queryWidget: this,
        onBack: f.hitch(this, function() {
          this._switchToResultTab();
        })
      });
      this.own(
        k(g, "show-related-records", f.hitch(this, this._onShowRelatedRecords))
      );
      this.own(
        k(g, "hide-related-records", f.hitch(this, this._onHideRelatedRecords))
      );
      this.own(k(g, "features-update", f.hitch(this, this._onFeaturesUpdate)));
      this.own(
        k(
          g,
          "features-layout-update",
          f.hitch(this, this._onFeaturesLayoutUpdate)
        )
      );
      g.executeQueryForFirstTime().then(
        f.hitch(this, function() {
          this.domNode &&
            (this.shelter.hide(),
            e.removeClass(this.resultTabView, this.hiddenClass),
            this._onSingleQueryFinished(g, d),
            this._updateResultDetailUI(),
            (this.singleQueryResult = g),
            this._updateFocusNodes("result"),
            this._focusCurrentFirstNode());
        }),
        f.hitch(this, function(a) {
          console.error(a);
          this.domNode &&
            (this.shelter.hide(),
            e.removeClass(this.resultTabView, this.hiddenClass));
        })
      );
    },
    _createNewResultLayer: function(a, b) {
      var c = null,
        d = null,
        d = a.queryTr.taskIndex,
        c = f.clone(a.layerInfo);
      c.name = b;
      c.drawingInfo || (c.drawingInfo = {});
      c.drawingInfo.transparency = 0;
      c.minScale = 0;
      c.maxScale = 0;
      c.effectiveMinScale = 0;
      c.effectiveMaxScale = 0;
      c.defaultVisibility = !0;
      delete c.extent;
      var e = new C(this.map, a).getOutputFields();
      c.fields = g.filter(
        c.fields,
        f.hitch(this, function(a) {
          return 0 <= e.indexOf(a.name);
        })
      );
      c = new D({ layerDefinition: c, featureSet: null });
      c._queryWidgetTaskIndex = d;
      b = f.clone(a.config.popupInfo);
      d = new E(b);
      b.showAttachments &&
        B.overridePopupTemplateMethodGetAttachments(
          d,
          a.config.url,
          a.config.objectIdField
        );
      c.setInfoTemplate(d);
      a.query.resultLayer = c;
      B.isTable(a.layerInfo) ||
        a.config.useLayerSymbol ||
        !a.config.resultsSymbol ||
        ((a = x.fromJson(a.config.resultsSymbol)),
        (d = new z(a)),
        c.setRenderer(d));
      return c;
    },
    _onSingleQueryFinished: function(a, c) {
      this.currentTaskSetting.onGetQueryResponse();
      a.placeAt(this.singleResultDetails);
      this._hideAllSingleQueryResultDijits();
      this._switchToResultTab();
      e.setStyle(a.domNode, "display", "block");
      var d = a.getCurrentAttrs().queryTr.taskIndex;
      a = {
        value: b.getRandomString(),
        label: c,
        taskIndex: d,
        singleQueryResult: a
      };
      this._resultLayerInfos.push(a);
      this.resultLayersSelect.addOption({ value: a.value, label: a.label });
      this.resultLayersSelect.set("value", a.value);
      this._showResultLayerInfo(a);
      this._updateResultDetailUI();
    },
    _onResultLayerSelectChanged: function() {
      var a = this._getCurrentResultLayerInfo();
      a && this._showResultLayerInfo(a);
    },
    _getCurrentResultLayerInfo: function() {
      var a = null,
        b = this.resultLayersSelect.get("value");
      b && (a = this._getResultLayerInfoByValue(b));
      return a;
    },
    _hideAllLayers: function(a) {
      var b = this._getAllSingleQueryResultDijits();
      g.forEach(
        b,
        f.hitch(this, function(b) {
          b && b !== a && b.hideLayer();
        })
      );
    },
    _removeResultLayerInfosByTaskIndex: function(a) {
      a = this._getResultLayerInfosByTaskIndex(a);
      this._removeResultLayerInfos(a);
    },
    _getResultLayerInfoByValue: function(a) {
      var b = null;
      g.some(
        this._resultLayerInfos,
        f.hitch(this, function(c) {
          return c.value === a ? ((b = c), !0) : !1;
        })
      );
      return b;
    },
    _getResultLayerInfosByTaskIndex: function(a) {
      var b = this._resultLayerInfos;
      return (b = g.filter(
        b,
        f.hitch(this, function(b) {
          return b.taskIndex === a;
        })
      ));
    },
    _removeResultLayerInfoByValues: function(a) {
      var b = [];
      g.forEach(
        this._resultLayerInfos,
        f.hitch(this, function(c, d) {
          0 <= a.indexOf(c.value) &&
            (b.push(d),
            c.singleQueryResult &&
              c.singleQueryResult.domNode &&
              c.singleQueryResult.destroy(),
            (c.singleQueryResult = null));
        })
      );
      b.reverse();
      g.forEach(
        b,
        f.hitch(this, function(a) {
          this._resultLayerInfos.splice(a, 1);
        })
      );
      this.resultLayersSelect.removeOption(a);
      var c = this.resultLayersSelect.getOptions();
      c && 0 < c.length
        ? this.resultLayersSelect.set("value", c[0].value)
        : "function" === typeof this.resultLayersSelect._setDisplay &&
          this.resultLayersSelect._setDisplay("");
      this._updateResultDetailUI();
    },
    _removeResultLayerInfos: function(a) {
      a = g.map(
        a,
        f.hitch(this, function(a) {
          return a.value;
        })
      );
      return this._removeResultLayerInfoByValues(a);
    },
    _getAllSingleQueryResultDijits: function() {
      var a = [];
      this._resultLayerInfos &&
        0 < this._resultLayerInfos.length &&
        g.forEach(
          this._resultLayerInfos,
          f.hitch(this, function(b) {
            b && b.singleQueryResult && a.push(b.singleQueryResult);
          })
        );
      return a;
    },
    _hideAllSingleQueryResultDijits: function() {
      var a = this._getAllSingleQueryResultDijits();
      g.forEach(
        a,
        f.hitch(this, function(a) {
          e.setStyle(a.domNode, "display", "none");
        })
      );
    },
    _showResultLayerInfo: function(a) {
      this._hideAllSingleQueryResultDijits();
      a = a.singleQueryResult;
      this._hideAllLayers(a);
      a &&
        (e.setStyle(a.domNode, "display", "block"),
        a.showLayer(),
        a.zoomToLayer());
    },
    removeSingleQueryResult: function(a) {
      var b = null;
      g.some(
        this._resultLayerInfos,
        f.hitch(this, function(c) {
          return c.singleQueryResult === a ? ((b = c.value), !0) : !1;
        })
      );
      null !== b && this._removeResultLayerInfoByValues([b]);
    },
    _onShowRelatedRecords: function() {
      e.addClass(this.resultLayersSelectDiv, this.hiddenClass);
    },
    _onHideRelatedRecords: function() {
      e.removeClass(this.resultLayersSelectDiv, this.hiddenClass);
    },
    _onFeaturesUpdate: function(a) {
      var b = a.taskIndex;
      a = a.features;
      try {
        this.updateDataSourceData(b, { features: a });
      } catch (F) {
        console.error(F);
      }
    },
    _isImageServiceLayer: function(a) {
      return -1 < a.indexOf("/ImageServer");
    },
    _showQueryErrorMsg: function(a) {
      new w({ message: a || this.nls.queryError });
    },
    _hideInfoWindow: function() {
      this.map &&
        this.map.infoWindow &&
        (this.map.infoWindow.hide(),
        "function" === typeof this.map.infoWindow.setFeatures &&
          this.map.infoWindow.setFeatures([]));
    }
  });
});
