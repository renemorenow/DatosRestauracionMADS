// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/on dojo/Deferred dojo/query ./utils dijit/form/Button dijit/_TemplatedMixin dijit/_WidgetBase esri/undoManager esri/OperationBase esri/graphic esri/tasks/query esri/tasks/QueryTask esri/tasks/RelationshipQuery esri/layers/FeatureLayer esri/dijit/AttributeInspector esri/dijit/Popup esri/dijit/PopupTemplate jimu/portalUrlUtils jimu/SelectionManager jimu/ConfigManager jimu/dijit/DropdownMenu jimu/dijit/LoadingIndicator jimu/LayerInfos/LayerInfos".split(
  " "
), function(
  t,
  e,
  l,
  g,
  q,
  p,
  r,
  m,
  A,
  B,
  C,
  D,
  E,
  v,
  u,
  w,
  N,
  F,
  G,
  H,
  I,
  x,
  y,
  J,
  K,
  L,
  M
) {
  var k = t([C, B], {
    baseClass: "related-records-editor",
    templateString:
      "\x3cdiv\x3e\x3cdiv class\x3d'operation-box' data-dojo-attach-point\x3d'operationBox'\x3e\x3cdiv class\x3d'previos-btn feature-action' data-dojo-attach-point\x3d'previouBtn'data-dojo-attach-event\x3d'click:_onPreviouBtnClick'\x3e\x3c/div\x3e\x3cdiv class\x3d'operation-title' data-dojo-attach-point\x3d'operationTitle'\x3e\x3c/div\x3e\x3cdiv class\x3d'add-new-btn' data-dojo-attach-point\x3d'addNewBtn'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'content-box' data-dojo-attach-point\x3d'contentBox'\x3e\x3c/div\x3e\x3c/div\x3e",
    editorATI: null,
    originalFeature: null,
    originalLayer: null,
    originalJimuLayerInfo: null,
    layerInfosObj: null,
    undoManager: null,
    refDomNode: null,
    _temporaryData: null,
    tableInfosParam: null,
    postCreate: function() {
      this._init();
      g.place(this.domNode, this.refDomNode, "after");
      window.isRTL
        ? g.addClass(this.previouBtn, "icon-arrow-forward")
        : g.addClass(this.previouBtn, "icon-arrow-back");
      this.loading = new L({ hidden: !0 }).placeAt(this.domNode);
      this._clearPage();
      this.showFirstPage({
        feature: this.originalFeature,
        oriJimuLayerInfo: this.originalJimuLayerInfo
      });
    },
    _init: function() {
      this.refDomNode = this.editorATI.domNode;
      this.originalLayer = this.originalFeature.getLayer();
      this.layerInfosObj = M.getInstanceSync();
      this.originalJimuLayerInfo = this.layerInfosObj.getLayerOrTableInfoById(
        this.originalLayer.id
      );
      this.undoManager = new D();
      this._temporaryData = { eventHandles: [], dijits: [] };
      this._tempPopup = new H({}, g.create("div"));
      this._tempPopup.show();
    },
    destroy: function() {
      this._clearPage();
      this._tempPopup.destroy();
      this.inherited(arguments);
    },
    _getRelatedTableInfoArray: function(a) {
      var b = new p(),
        c = [];
      a.getRelatedTableInfoArray("esriRelRoleOrigin").then(
        e.hitch(this, function(a) {
          l.forEach(
            a,
            function(a) {
              this._findTableInfoFromTableInfosParam(a) && c.push(a);
            },
            this
          );
          b.resolve(c);
        })
      );
      return b;
    },
    _getRelatedRecordsByQuery: function(a) {
      var b = new p(),
        c = new u(),
        d = new w(a.destJimuLayerInfo.getUrl()),
        f = a.destJimuLayerInfo.layerObject.relationships.keyField,
        h = a.oriJimuLayerInfo.layerObject.objectIdField;
      c.where = f
        ? f + " \x3d " + a.feature.attributes[f]
        : h + " \x3d " + a.feature.attributes[h];
      c.outFields = ["*"];
      d.execute(
        c,
        e.hitch(this, function(a) {
          b.resolve(a);
        })
      );
      return b;
    },
    _getRelatedRecordsByRelatedQuery: function(a) {
      return a.oriJimuLayerInfo.getRelatedRecords(
        a.feature,
        a.destJimuLayerInfo,
        a.relationshipIndex
      );
    },
    _getOriRelationshipByDestLayer: function(a) {
      var b = null,
        b = l.filter(
          a.oriJimuLayerInfo.layerObject.relationships,
          function(b) {
            if (b.relatedTableId === a.destJimuLayerInfo.layerObject.layerId)
              return !0;
          },
          this
        );
      return (b = b[a.relationshipIndex] ? b[a.relationshipIndex] : b[0]);
    },
    _getDestRelationshipByDestLayer: function(a) {
      var b = null,
        b = l.filter(
          a.destJimuLayerInfo.layerObject.relationships,
          function(b) {
            if (b.relatedTableId === a.oriJimuLayerInfo.layerObject.layerId)
              return !0;
          },
          this
        );
      return (b = b[a.relationshipIndex] ? b[a.relationshipIndex] : b[0]);
    },
    _createATI: function(a) {
      var b;
      b = a.destJimuLayerInfo;
      var c = null,
        d,
        f = this._findTableInfoFromTableInfosParam(b);
      f &&
        ((c = new k.ATI(
          { layerInfos: [f], hideNavButtons: !0 },
          g.create("div")
        )),
        c.startup(),
        this._temporaryData.dijits.push(c),
        (d = this._findTableInfoFromTableInfosParam(b)),
        (d = m.getEditCapabilities(b.layerObject, d).canDelete) ||
          r(".atiButton.atiDeleteButton", c.domNode).addClass("hidden"));
      this._editWidget._configEditor.usingSaveButton &&
        ((b = c.addButton(
          this.nls.save,
          "save-button related-record disable",
          "after"
        )),
        (b = q(b, "click", e.hitch(this, this._onSaveBtnClick, a, c))),
        this._temporaryData.eventHandles.push(b));
      b = c.addButton(this.nls.close, "close-button related-record", "before");
      b = q(b, "click", e.hitch(this, this._onCloseBtnClick));
      this._temporaryData.eventHandles.push(b);
      d &&
        ((b = q(c, "delete", e.hitch(this, this._onDeleteBtnClick, a))),
        this._temporaryData.eventHandles.push(b));
      b = q(c, "attribute-change", e.hitch(this, this._onAttributeChange, a));
      this._temporaryData.eventHandles.push(b);
      return c;
    },
    _findTableInfoFromTableInfosParam: function(a) {
      var b = null;
      l.some(
        this.tableInfosParam,
        function(c) {
          if (c.featureLayer.id === a.id) return (b = c), !0;
        },
        this
      );
      return b;
    },
    _keepReferentialIntegrity: function(a) {
      var b = this._getOriRelationshipByDestLayer(a),
        c = this._getDestRelationshipByDestLayer(a),
        d,
        e,
        h = {
          key: "",
          value: "",
          hasRelationshipTable: !1,
          originKeyFieldInRelationshipTable: "",
          originValueInRelationshipTable: "",
          destKeyFieldInRelationshipTable: "",
          destValueInRelationshipTable: ""
        };
      b.keyField && c && c.keyField
        ? ((d = m.ignoreCaseToGetFieldKey(
            a.oriJimuLayerInfo.layerObject,
            b.keyField
          )),
          (e = m.ignoreCaseToGetFieldKey(
            a.destJimuLayerInfo.layerObject,
            c.keyField
          )),
          d && e && ((h.key = e), (h.value = a.feature.attributes[d])))
        : b.keyField &&
          (d = m.ignoreCaseToGetFieldKey(
            a.oriJimuLayerInfo.layerObject,
            b.keyField
          )) &&
          ((h.key = d), (h.value = a.feature.attributes[d]));
      b &&
        null != b.relationshipTableId &&
        c &&
        null != c.relationshipTableId &&
        ((h.hasRelationshipTable = !0),
        (h.originKeyFieldInRelationshipTable = b.keyFieldInRelationshipTable),
        (h.destKeyFieldInRelationshipTable = c.keyFieldInRelationshipTable),
        (h.originValueInRelationshipTable = a.feature.attributes[d]),
        a.relatedFeature &&
          (h.destValueInRelationshipTable =
            a.relatedFeature.attributes[e || d]));
      return h;
    },
    _prepareNewRelatedRecord: function(a) {
      var b = this._getTemplateFromLayerObject(a.destJimuLayerInfo.layerObject),
        b = e.mixin({}, b ? b.prototype.attributes : {});
      a = this._keepReferentialIntegrity(a);
      a.hasRelationshipTable || (b[a.key] = a.value);
      return new v(null, null, b, null);
    },
    _prepareNewRelationshipRecord: function(a, b) {
      var c = null,
        d = {};
      a = this._keepReferentialIntegrity(
        this._createOperationData(
          a.feature,
          a.oriJimuLayerInfo,
          a.destJimuLayerInfo,
          b,
          a.relationshipIndex
        )
      );
      a.hasRelationshipTable &&
        ((d[a.originKeyFieldInRelationshipTable] =
          a.originValueInRelationshipTable),
        (d[a.destKeyFieldInRelationshipTable] = a.destValueInRelationshipTable),
        (c = new v(null, null, d, null)));
      return c;
    },
    _prepareRelationshipTableInfo: function(a) {
      var b = this._getOriRelationshipByDestLayer(a).relationshipTableId,
        c = null;
      if (null == b) return null;
      a = a.oriJimuLayerInfo.layerObject;
      var d = a.url.lastIndexOf("/"),
        f = a.url.slice(0, d) + "/" + b.toString();
      l.some(
        this.tableInfosParam,
        function(a) {
          if (
            e.getObject("featureLayer.url", !1, a) &&
            x
              .removeProtocol(f.toString().toLowerCase())
              .replace(/\/+/g, "/") ===
              x
                .removeProtocol(a.featureLayer.url.toString().toLowerCase())
                .replace(/\/+/g, "/")
          )
            return (
              (c = this.layerInfosObj.getLayerOrTableInfoById(
                a.featureLayer.id
              )),
              !0
            );
        },
        this
      );
      return c;
    },
    _addNewRelationshipReocrd: function(a, b) {
      var c = new p(),
        d = null;
      (a = this._prepareNewRelationshipRecord(b, a)) &&
        (d = this._prepareRelationshipTableInfo(b));
      d && d.layerObject
        ? d.layerObject.applyEdits(
            [a],
            null,
            null,
            e.hitch(this, function() {
              c.resolve();
            }),
            e.hitch(this, function() {
              console.warn("Failed to add relationship record.");
              c.resolve();
            })
          )
        : c.resolve();
      return c;
    },
    _addNewRelatedRecord: function(a, b) {
      var c = new p(),
        d = b.destJimuLayerInfo.layerObject;
      d.applyEdits(
        [a],
        null,
        null,
        e.hitch(this, function(f) {
          var h = f[0];
          if (h.success && h.objectId) {
            f = new u();
            var n = new w(d.url);
            f.where = d.objectIdField + " \x3d " + h.objectId;
            f.outFields = ["*"];
            n.execute(
              f,
              e.hitch(this, function(f) {
                var n = f.features[0];
                n || ((a.attributes[d.objectIdField] = h.objectId), (n = a));
                this._addNewRelationshipReocrd(n, b).then(
                  e.hitch(this, function() {
                    c.resolve(n);
                  })
                );
              }),
              e.hitch(this, function() {
                c.reject();
              })
            );
          } else c.reject();
        }),
        e.hitch(this, function() {
          c.reject();
        })
      );
      return c;
    },
    _deleteRelatedRecord: function(a) {
      var b = new p();
      a.destJimuLayerInfo.layerObject.applyEdits(
        null,
        null,
        [a.relatedFeature],
        e.hitch(this, function() {
          b.resolve();
        }),
        e.hitch(this, function() {
          b.reject();
        })
      );
      return b;
    },
    _updateRelatedRecordOnSave: function(a) {
      this.loading.show();
      this._updateRelatedRecord(a).then(
        e.hitch(this, function() {
          this.loading.hide();
        }),
        e.hitch(this, function() {
          this.loading.hide();
        })
      );
    },
    _updateRelatedRecordOnClient: function(a, b) {
      this._editWidget._startEditingSession();
      a.relatedFeature.attributes[b.fieldName] = b.fieldValue;
      var c = b.target;
      c &&
        c.updateCurrentSelectdFeature &&
        c.updateCurrentSelectdFeature(
          [a.relatedFeature],
          a.destJimuLayerInfo.layerObject,
          b.fieldName,
          b.fieldValue
        );
    },
    _updateRelatedRecordDirectly: function(a, b) {
      this.loading.show();
      a.relatedFeature.attributes[b.fieldName] = b.fieldValue;
      this._updateRelatedRecord(a).then(
        e.hitch(this, function() {
          this.loading.hide();
          var c = b.target;
          c &&
            c.updateCurrentSelectdFeature &&
            c.updateCurrentSelectdFeature(
              [a.relatedFeature],
              a.destJimuLayerInfo.layerObject,
              b.fieldName,
              b.fieldValue
            );
        }),
        e.hitch(this, function() {
          this.loading.hide();
        })
      );
    },
    _updateRelatedRecord: function(a) {
      var b = new p();
      a.destJimuLayerInfo.layerObject.applyEdits(
        null,
        [a.relatedFeature],
        null,
        e.hitch(this, function() {
          b.resolve();
        }),
        e.hitch(this, function() {
          b.reject();
        })
      );
      return b;
    },
    _getDisplayTitleOfRelatedRecord: function(a, b, c) {
      var d = a.getInfoTemplate();
      return (a =
        "popupTitle" === c && d
          ? "function" === typeof d.title
            ? d.title(b)
            : d.title
          : this._getDisplayTitleFromPopup(a, b, c))
        ? a
        : "";
    },
    _getDisplayTitleFromPopup: function(a, b, c) {
      (a = this._getPopupTemplateWithOnlyDisplayField(a, c))
        ? (b.setInfoTemplate(a),
          this._tempPopup.setFeatures([b]),
          (c =
            (c = r("td.attrValue", this._tempPopup.domNode)[0]) && c.innerHTML),
          b.setInfoTemplate(null))
        : (c = m.getAttrByFieldKey(b, c));
      return c;
    },
    _getPopupTemplateWithOnlyDisplayField: function(a, b) {
      a = a._getCustomPopupInfo(a.layerObject, [b]);
      return new I(a);
    },
    _getTemplateFromLayerObject: function(a) {
      var b = null;
      a.templates && a.templates[0]
        ? (b = a.templates[0])
        : a.types &&
          a.types[0] &&
          a.types[0].templates[0] &&
          (b = a.types[0].templates[0]);
      return b;
    },
    showRelatedRecords: function(a) {
      this._changeRefDomNode();
      var b =
        e.getObject(
          "_wabProperties.originalLayerName",
          !1,
          a.destJimuLayerInfo.layerObject
        ) || a.destJimuLayerInfo.title;
      this._setOperationTitle(b);
      this._clearPage();
      this.loading.show();
      this._getRelatedRecordsByRelatedQuery(a).then(
        e.hitch(this, function(b) {
          var c = a.oriJimuLayerInfo.getOriRelationshipByDestLayer(
            a.oriJimuLayerInfo.layerObject,
            a.destJimuLayerInfo.layerObject
          );
          c &&
          c.cardinality &&
          c.cardinality.toLowerCase &&
          0 <= c.cardinality.toLowerCase().indexOf("onetoone") &&
          1 <= b.length
            ? this._hideAddNewBtn()
            : this._showAddNewBtn(a);
          0 < b.length
            ? this._setTitle(window.jimuNls.popup.relatedRecords)
            : this._setTitle(
                window.jimuNls.popup.noRelatedRecotds,
                "font-normal"
              );
          var f = this._showFieldSelector(a.destJimuLayerInfo);
          l.forEach(
            b,
            function(b, c) {
              b._layer = a.destJimuLayerInfo.layerObject;
              var d = this._getDisplayTitleOfRelatedRecord(
                a.destJimuLayerInfo,
                b,
                f
              );
              c = g.create(
                "div",
                {
                  class:
                    "item record-item enable " +
                    (0 === c % 2 ? "oddLine" : "evenLine"),
                  innerHTML: d
                },
                this.contentBox
              );
              c.relatedRecord = b;
              c = q(
                c,
                "click",
                e.hitch(this, function() {
                  this._addOperation(k.OPERATION_SHOW_RELATED_RECORDS, a);
                  this.showInspector(
                    this._createOperationData(
                      a.feature,
                      a.oriJimuLayerInfo,
                      a.destJimuLayerInfo,
                      b,
                      a.relationshipIndex
                    )
                  );
                })
              );
              this._temporaryData.eventHandles.push(c);
            },
            this
          );
          this.loading.hide();
        })
      );
    },
    showInspector: function(a) {
      var b = !1;
      this._changeRefDomNode();
      var c = a.destJimuLayerInfo.layerObject,
        d =
          e.getObject("_wabProperties.originalLayerName", !1, c) ||
          a.destJimuLayerInfo.title,
        c = e.getObject(
          "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
          !1,
          c
        ),
        f = this._getDisplayTitleOfRelatedRecord(
          a.destJimuLayerInfo,
          a.relatedFeature,
          c
        );
      "popupTitle" !== c && (f = d + ": " + f);
      this._setOperationTitle(f);
      this._clearPage();
      (f = this._createATI(a)) && g.place(f.domNode, this.contentBox);
      d = a.destJimuLayerInfo.layerObject.objectIdField;
      c = a.relatedFeature.attributes[d];
      null === c || void 0 === c
        ? (a.destJimuLayerInfo.layerObject.clearSelection(),
          f.showFeature(a.relatedFeature, a.destJimuLayerInfo.layerObject),
          (b = !0),
          r(".atiButton.atiDeleteButton", f.domNode).addClass("disable"),
          this._editWidget._startEditingSession())
        : (this.loading.show(),
          (f = new u()),
          (f.where = d + " \x3d " + c),
          a.destJimuLayerInfo.layerObject.selectFeatures(
            f,
            F.SELECTION_NEW,
            e.hitch(this, function() {
              this.loading.hide();
              var b = a.destJimuLayerInfo.layerObject.getSelectedFeatures();
              b &&
                b[0] &&
                b[0].geometry &&
                this._activeGraphicEdit(b[0], a.oriJimuLayerInfo);
            })
          ));
      this.showRelatedTables(
        this._createOperationData(
          a.relatedFeature,
          a.destJimuLayerInfo,
          null,
          null,
          null
        ),
        a,
        b
      );
    },
    showRelatedTables: function(a, b, c) {
      this._getRelatedTableInfoArray(a.oriJimuLayerInfo).then(
        e.hitch(this, function(d) {
          0 < d.length && this._setTitle(window.jimuNls.popup.relatedTables);
          var f = {};
          l.forEach(
            d,
            function(a) {
              void 0 === f[a.id] ? (f[a.id] = 0) : f[a.id]++;
            },
            this
          );
          var h = {};
          l.forEach(
            d,
            function(d, l) {
              void 0 === h[d.id] ? (h[d.id] = 0) : h[d.id]++;
              var n =
                '\x3cdiv title\x3d"' +
                d.title +
                '"\x3e' +
                d.title +
                "\x3c/div\x3e";
              l = g.create(
                "div",
                {
                  class:
                    "item table-item " +
                    (0 === l % 2 ? "oddLine " : "evenLine ") +
                    (c ? "disable " : "enable "),
                  innerHTML: n
                },
                this.contentBox
              );
              var z = h[d.id];
              if (0 < f[d.id]) {
                var m = a.oriJimuLayerInfo.getOriRelationshipByDestLayer(
                    a.oriJimuLayerInfo.layerObject,
                    d.layerObject,
                    z
                  ),
                  m = m.name || m.id;
                l.innerHTML =
                  n +
                  ('\x3cdiv class\x3d"relationshipName" title\x3d"' +
                    m +
                    '"\x3e(' +
                    m +
                    ")\x3c/div\x3e");
              }
              c ||
                ((n = q(
                  l,
                  "click",
                  e.hitch(this, function() {
                    var c;
                    this._editWidget._configEditor.usingSaveButton
                      ? (c = this._editWidget._popupConfirmDialog())
                      : ((c = new p()), c.resolve(!0));
                    c.then(
                      e.hitch(this, function(c) {
                        c &&
                          d.getLayerObject().then(
                            e.hitch(this, function() {
                              b
                                ? this._addOperation(
                                    k.OPERATION_SHOW_INSPECTOR,
                                    b
                                  )
                                : this._addOperation(k.OPERATION_FIRST, a);
                              this.showRelatedRecords(
                                this._createOperationData(
                                  a.feature,
                                  a.oriJimuLayerInfo,
                                  d,
                                  null,
                                  z
                                )
                              );
                            })
                          );
                      })
                    );
                  })
                )),
                this._temporaryData.eventHandles.push(n));
            },
            this
          );
        })
      );
    },
    showFirstPage: function(a, b) {
      this._clearPage();
      this._revertRefDomNode();
      this.showRelatedTables(a);
      b &&
        (l.forEach(
          this._editWidget._jimuLayerInfos.getLayerInfoArray(),
          function(a) {
            a.layerObject &&
              a.layerObject.clearSelection &&
              a.id !== this.originalJimuLayerInfo.id &&
              y.getInstance().clearSelection(a.layerObject);
          },
          this
        ),
        this.originalFeature.setSymbol(this.originalLayer.getSelectionSymbol()),
        this._activeGraphicEdit(this.originalFeature));
    },
    _activeGraphicEdit: function(a, b) {
      b &&
        (b.id === this.originalJimuLayerInfo.id
          ? this.originalFeature.setSymbol(null, !0)
          : y.getInstance().clearSelection(b.layerObject));
      var c;
      this._editWidget.editor._editVertices = !0;
      this._editWidget.editor._activateEditToolbar(a);
      a.geometry &&
        (c =
          "point" === a.geometry.type
            ? a.geometry
            : a.geometry.getExtent().getCenter());
      this._editWidget.map.infoWindow.show(c);
    },
    _createOperationData: function(a, b, c, d, e) {
      return {
        feature: a,
        oriJimuLayerInfo: b,
        destJimuLayerInfo: c,
        relatedFeature: d,
        relationshipIndex: e || 0
      };
    },
    _addOperation: function(a, b) {
      this.undoManager.add(new k.Operation(a, b, this));
    },
    _onPreviouBtnClick: function() {
      var a;
      this._editWidget._configEditor.usingSaveButton
        ? (a = this._editWidget._popupConfirmDialog())
        : ((a = new p()), a.resolve(!0));
      a.then(
        e.hitch(this, function(a) {
          a && this.undoManager.undo();
        })
      );
    },
    _onAddNewBtnClick: function(a) {
      var b = a.destJimuLayerInfo.layerObject,
        c = this._prepareNewRelatedRecord(a),
        d = this._keepReferentialIntegrity(a);
      "Table" !== b.type
        ? this._editWidget._startEditingRelatedGraphic(a, d)
        : this._editWidget._configEditor.usingSaveButton
        ? (this._addOperation(k.OPERATION_SHOW_RELATED_RECORDS, a),
          this.showInspector(
            this._createOperationData(
              a.feature,
              a.oriJimuLayerInfo,
              a.destJimuLayerInfo,
              c,
              a.relationshipIndex
            )
          ))
        : (this.loading.show(),
          this._addNewRelatedRecord(c, a).then(
            e.hitch(this, function(b) {
              this.loading.hide();
              this._addOperation(k.OPERATION_SHOW_RELATED_RECORDS, a);
              this.showInspector(
                this._createOperationData(
                  a.feature,
                  a.oriJimuLayerInfo,
                  a.destJimuLayerInfo,
                  b,
                  a.relationshipIndex
                )
              );
            }),
            e.hitch(this, function() {
              this.loading.hide();
            })
          ));
    },
    _onCloseBtnClick: function() {
      this._editWidget.editPopup.hide();
    },
    _onDeleteBtnClick: function(a) {
      var b =
        a.relatedFeature.attributes[
          a.destJimuLayerInfo.layerObject.objectIdField
        ];
      null !== b &&
        void 0 !== b &&
        (this._editWidget._configEditor.usingSaveButton &&
          this._editWidget._stopEditingSession(),
        this.loading.show(),
        this._deleteRelatedRecord(a).then(
          e.hitch(this, function() {
            this.loading.hide();
            this._onPreviouBtnClick();
          }),
          e.hitch(this, function() {
            this.loading.hide();
          })
        ));
    },
    _onSaveBtnClick: function(a) {
      if (this._editWidget._isEditingSession) {
        var b =
          a.relatedFeature.attributes[
            a.destJimuLayerInfo.layerObject.objectIdField
          ];
        null === b || void 0 === b
          ? ((b = a.relatedFeature),
            this.loading.show(),
            this._addNewRelatedRecord(b, a).then(
              e.hitch(this, function(b) {
                this.loading.hide();
                this.showInspector(
                  this._createOperationData(
                    a.feature,
                    a.oriJimuLayerInfo,
                    a.destJimuLayerInfo,
                    b,
                    a.relationshipIndex
                  )
                );
              }),
              e.hitch(this, function() {
                this.loading.hide();
              })
            ))
          : this._updateRelatedRecordOnSave(a);
        this._editWidget._stopEditingSession();
      }
    },
    _onAttributeChange: function(a, b) {
      this._editWidget._configEditor.usingSaveButton
        ? this._updateRelatedRecordOnClient(a, b)
        : this._updateRelatedRecordDirectly(a, b);
    },
    _clearPage: function() {
      g.empty(this.contentBox);
      g.setStyle(this.addNewBtn, "display", "none");
      l.forEach(
        this._temporaryData.eventHandles,
        function(a) {
          a && a.remove && a.remove();
        },
        this
      );
      this._temporaryData.eventHandles = [];
      l.forEach(
        this._temporaryData.dijits,
        function(a) {
          a && a.destroy && a.destroy();
        },
        this
      );
      this._temporaryData.dijits = [];
    },
    _changeRefDomNode: function() {
      g.setStyle(this.refDomNode, "display", "none");
      g.setStyle(this.operationBox, "display", "block");
      g.addClass(this.domNode, "fix-height-mode");
      this.previouBtn.title = window.jimuNls.common.back;
      this.addNewBtn.title = window.jimuNls.common.newText;
      this.undoManager.peekUndo()
        ? g.setStyle(this.previouBtn, "display", "block")
        : g.setStyle(this.previouBtn, "display", "none");
    },
    _revertRefDomNode: function() {
      g.setStyle(this.refDomNode, "display", "block");
      g.setStyle(this.operationBox, "display", "none");
      g.removeClass(this.domNode, "fix-height-mode");
    },
    _showAddNewBtn: function(a) {
      var b = a.destJimuLayerInfo.layerObject,
        c = this._findTableInfoFromTableInfosParam(a.destJimuLayerInfo);
      m.getEditCapabilities &&
        m.getEditCapabilities(b, c).canCreate &&
        (g.setStyle(this.addNewBtn, "display", "block"),
        (a = q(
          this.addNewBtn,
          "click",
          e.hitch(this, this._onAddNewBtnClick, a)
        )),
        this._temporaryData.eventHandles.push(a));
    },
    _hideAddNewBtn: function() {
      g.setStyle(this.addNewBtn, "display", "none");
    },
    _setTitle: function(a, b) {
      a &&
        g.create(
          "div",
          { class: "title-box " + (b ? b : ""), innerHTML: a },
          this.contentBox
        );
    },
    _setOperationTitle: function(a) {
      g.setAttr(this.operationTitle, "innerHTML", a);
      g.setAttr(this.operationTitle, "title", a);
    },
    _showFieldSelector: function(a) {
      var b = "objecid",
        c = r(".title-box", this.contentBox)[0],
        d = a.layerObject,
        f = [];
      if (!c || !a) return b;
      var h = a.getPopupInfo();
      h &&
        h.title &&
        f.push({
          label: window.jimuNls.popup.saveAsPopupTitle,
          value: "popupTitle"
        });
      var g = this._findTableInfoFromTableInfosParam(a);
      g &&
        g.fieldInfos &&
        l.forEach(g.fieldInfos, function(a) {
          "globalid" !== a.fieldName.toLowerCase() &&
            "shape" !== a.fieldName.toLowerCase() &&
            f.push({ label: a.label || a.fieldName, value: a.fieldName });
        });
      c = new K({ items: f }).placeAt(c);
      c.domNode.title = window.jimuNls.popup.chooseFieldTip;
      var g = e.getObject(
          "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
          !1,
          d
        ),
        k = m.ignoreCaseToGetFieldObject(
          a.layerObject,
          a.layerObject.displayField || a.layerObject.objectIdField
        ),
        p = J.getInstance().getAppConfig();
      g
        ? (b = g)
        : "2.3" === p.configWabVersion && k && k.name
        ? (b = k.name)
        : h && h.title
        ? (b = "popupTitle")
        : k && k.name
        ? (b = k.name)
        : 0 < f.length && (b = f[0].value);
      b &&
        (c.setHighlightValue(b),
        e.setObject(
          "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
          b,
          d
        ));
      this._temporaryData.dijits.push(c);
      a = q(
        c,
        "click-item",
        e.hitch(
          this,
          function(a, b) {
            r(".item.record-item", this.contentBox).forEach(
              e.hitch(this, function(c) {
                e.setObject(
                  "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
                  b,
                  d
                );
                var f = this._getDisplayTitleOfRelatedRecord(
                  a,
                  c.relatedRecord,
                  b
                );
                c.innerHTML = f;
              })
            );
          },
          a
        )
      );
      this._temporaryData.eventHandles.push(a);
      return b;
    }
  });
  k.Operation = t([E], {
    constructor: function(a, b, c) {
      this.operationName = a;
      this.operationData = b;
      this.relatedRecordsEditor = c;
    },
    performUndo: function() {
      switch (this.operationName) {
        case k.OPERATION_SHOW_RELATED_TABLES:
          return this.relatedRecordsEditor.showRelatedTables(
            this.operationData
          );
        case k.OPERATION_SHOW_RELATED_RECORDS:
          return this.relatedRecordsEditor.showRelatedRecords(
            this.operationData
          );
        case k.OPERATION_SHOW_INSPECTOR:
          return this.relatedRecordsEditor.showInspector(this.operationData);
        default:
          return this.relatedRecordsEditor.showFirstPage(
            this.operationData,
            !0
          );
      }
    }
  });
  k.ATI = t([G], {
    constructor: function() {
      this._aiConnects = [];
      this._selection = [];
      this._toolTips = [];
    },
    addButton: function(a, b, c) {
      c = c ? c : "before";
      a = new A({ label: a, class: " atiButton " + b }, g.create("div"));
      g.place(a.domNode, this.deleteBtn.domNode, c);
      return a;
    },
    updateCurrentSelectdFeature: function(a, b, c, d) {
      this._selection &&
        this._selection[0] &&
        c &&
        ((this._selection[0].attributes[c] = d),
        (b.ownershipBasedAccessControlForFeatures = !0),
        this.refresh(),
        (b.ownershipBasedAccessControlForFeatures = !1));
    },
    _getFields: function(a) {
      return a.fields;
    }
  });
  e.mixin(k, {
    OPERATION_SHOW_RELATED_TABLES: "showRelatedTables",
    OPERATION_SHOW_RELATED_RECORDS: "showRelatedRecords",
    OPERATION_SHOW_INSPECTOR: "showInspector",
    OPERATION_FIRST: "first"
  });
  return k;
});
