// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "esri/dijit/editing/Editor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/kernel dojo/has dojo/query dojo/DeferredList dojo/dom-class dojo/dom-construct dojo/string dijit/_Widget dijit/_Templated ../../domUtils ../../graphicsUtils ../../geometry/Polyline ../../geometry/Polygon ../../graphic ../../undoManager ../../tasks/query ../../layers/FeatureLayer ../../layers/FeatureTemplate ../../toolbars/draw ../../toolbars/edit ../AttributeInspector ./Util ./Add ./Update ./Delete ./Cut ./Union ./toolbars/Drawing ./SelectionHelper ./TemplatePicker ../../kernel ../../config dojo/i18n!../../nls/jsapi dojo/text!./templates/Editor.html dijit/ProgressBar dojo/NodeList-dom".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H,
        D,
        G,
        E,
        J,
        F,
        A,
        K,
        L,
        P,
        Q,
        M,
        O,
        R
      ) {
        var I = n([p, q], {
          declaredClass: "esri.dijit.editing.Editor",
          widgetsInTemplate: !0,
          templateString: R,
          onLoad: function() {},
          constructor: function(a, c) {
            a = a || {};
            a.settings ||
              console.error(
                "Editor: please provide 'settings' parameter in the constructor"
              );
            a.settings.layerInfos ||
              console.error(
                "Editor: please provide 'layerInfos' parameter in the constructor"
              );
            this._settings = a.settings;
            this._eConnects = [];
          },
          startup: function() {
            this.inherited(arguments);
            this._setDefaultOptions();
            this._settings.map.setInfoWindowOnClick(!1);
            var a = this._settings.layerInfos;
            this.featureReductionEnabledLayers = [];
            h.forEach(
              a,
              function(a) {
                a = a.featureLayer;
                a.isFeatureReductionEnabled() &&
                  (a.disableFeatureReduction(),
                  this.featureReductionEnabledLayers.push(a));
              },
              this
            );
            if (
              h.every(a, function(a) {
                return a.featureLayer.loaded;
              })
            )
              this._initLayers(),
                this._connectEvents(),
                this._createWidgets(),
                this.onLoad(),
                (this.loaded = !0);
            else {
              var c = a.length;
              h.forEach(
                a,
                function(a) {
                  a = a.featureLayer;
                  if (a.loaded) c--;
                  else
                    var f = l.connect(a, "onLoad", this, function(a) {
                      l.disconnect(f);
                      f = null;
                      c--;
                      c ||
                        (this._initLayers(),
                        this._connectEvents(),
                        this._createWidgets(),
                        this.onLoad(),
                        (this.loaded = !0));
                    });
                },
                this
              );
            }
            this._reset();
            this._enableMapClickHandler();
          },
          stopEditing: function(a) {
            this._updateCurrentFeature(
              g.hitch(this, function() {
                this._clearSelection(!1);
                a && a();
              })
            );
          },
          destroy: function() {
            this._settings.map.setInfoWindowOnClick(!0);
            this.drawingToolbar && this.drawingToolbar.destroy();
            this.attributeInspector && this.attributeInspector.destroy();
            this.templatePicker && this.templatePicker.destroy();
            this._selectionHelper && this._selectionHelper.destroy();
            this._drawToolbar && this._drawToolbar.deactivate();
            this._reset();
            this._disableMapClickHandler();
            h.forEach(this._eConnects, l.disconnect);
            l.disconnect(this._dtConnect);
            l.disconnect(this._templatePickerOnSelectionChangeEvent);
            this._layer = this._currentGraphic = this._activeType = this._activeTemplate = this._drawingTool = this._drawToolbar = this.editToolbar = this.drawingToolbar = this.attributeInspector = this.templatePicker = this.undoManager = null;
            this._settings.map.infoWindow &&
              this._settings.map.infoWindow.clearFeatures &&
              this._settings.map.infoWindow.clearFeatures();
            h.forEach(this.featureReductionEnabledLayers, function(a) {
              a.enableFeatureReduction();
            });
            this.inherited(arguments);
          },
          _setDefaultOptions: function() {
            this._drawToolbar =
              this._settings.drawToolbar || new w(this._settings.map);
            this._settings.drawToolbar = this._drawToolbar;
            this.editToolbar =
              this._settings.editToolbar ||
              new z(this._settings.map, {
                textSymbolEditorHolder: this.domNode
              });
            this._settings.editToolbar = this.editToolbar;
            this._settings.toolbarVisible = this._settings.toolbarVisible || !1;
            this._settings.toolbarOptions = g.mixin(
              { reshapeVisible: !1, cutVisible: !1, mergeVisible: !1 },
              this._settings.toolbarOptions
            );
            this._settings.createOptions = g.mixin(
              {
                polylineDrawTools: [I.CREATE_TOOL_POLYLINE],
                polygonDrawTools: [I.CREATE_TOOL_POLYGON],
                editAttributesImmediately: !0
              },
              this._settings.createOptions
            );
            this._settings.singleSelectionTolerance =
              this._settings.singleSelectionTolerance || 3;
            this._settings.maxUndoRedoOperations =
              this._settings.maxUndoRedoOperations || 10;
            this._settings.editor = this;
            this._usePopup = this._settings.usePopup = this._settings.map
              .infoWindow._setPagerCallbacks
              ? !0
              : !1;
            this._datePackage = this._settings.datePackage;
            var a = M.defaults;
            this._settings.geometryService =
              this._settings.geometryService || a.geometryService;
            a.geometryService =
              a.geometryService || this._settings.geometryService;
          },
          _initLayers: function() {
            this._settings.layers = [];
            this._settings.userIds = {};
            this._settings.createOnlyLayer = {};
            h.forEach(
              this._settings.layerInfos,
              function(a) {
                if (a.featureLayer && a.featureLayer.loaded) {
                  this._settings.layers.push(a.featureLayer);
                  var c = a.featureLayer.id;
                  a.featureLayer.credential &&
                    (this._settings.userIds[c] =
                      a.featureLayer.credential.userId);
                  a.userId && (this._settings.userIds[c] = a.userId);
                  var f = a.featureLayer.getEditCapabilities();
                  this._settings.createOnlyLayer[c] =
                    f.canCreate && !f.canUpdate ? !0 : !1;
                  this._isTextSymbolPointLayer(a.featureLayer) &&
                    (a.disableAttributeUpdate = !0);
                }
              },
              this
            );
          },
          _reset: function() {
            this._hideAttributeInspector();
            this.editToolbar.deactivate();
            this._editVertices = !0;
            this._drawingTool = this._activeTemplate = this._activeType = this._currentGraphic = this._layer = null;
            this._attributeChanged = !1;
          },
          _saveFeatureOnClient: function(a) {
            var c = this.templatePicker.getSelected(),
              f;
            f = c.template
              ? c.featureLayer.renderer.getSymbol(c.template.prototype)
              : c.symbolInfo.symbol;
            this._tempGraphic = new r(a, f, null, null);
            this._tempGraphic.setAttributes(
              g.mixin({}, c.template.prototype.attributes)
            );
            f = this._settings.map;
            f.graphics.add(this._tempGraphic);
            a = this._findCenterPoint(a);
            this._createAttributeInspector();
            f.infoWindow.setTitle(
              c.featureLayer
                ? c.featureLayer.name
                : O.widgets.attributeInspector.NLS_title
            );
            this.attributeInspector.showFeature(
              this._tempGraphic,
              c.featureLayer
            );
            this._showInfoWindow(a, f.getInfoWindowAnchor(a));
            if (
              this._settings.createOnlyLayer[c.featureLayer.id] ||
              this._settings.invalidTemplate
            )
              this._infoWindowHideEvent = l.connect(
                f.infoWindow,
                "onHide",
                this,
                "_infoWindowHide"
              );
            l.disconnect(this._templatePickerOnSelectionChangeEvent);
            this.templatePicker.clearSelection();
            this._drawToolbar.deactivate();
            this._enableMapClickHandler();
            this.drawingToolbar && this.drawingToolbar.deactivate();
            this._templatePickerOnSelectionChangeEvent = l.connect(
              this.templatePicker,
              "onSelectionChange",
              g.hitch(this, "_onCreateFeature")
            );
          },
          _saveAttributesOnClient: function(a, c, f) {
            this._tempGraphic.attributes[c] =
              "number" === typeof f && isNaN(f) ? null : f;
          },
          _infoWindowHide: function() {
            this._createFeature(
              this._tempGraphic.geometry,
              this._tempGraphic.attributes
            );
            l.disconnect(this._infoWindowHideEvent);
          },
          _createFeature: function(a, c) {
            this._editClickPoint = this._findCenterPoint(a);
            a.rings
              ? this._simplify(
                  a,
                  g.hitch(this, function(a) {
                    this._drawingTool !== v.TOOL_AUTO_COMPLETE_POLYGON
                      ? this._applyEdits(
                          [
                            {
                              layer: this._layer,
                              adds: [this._createGraphic(a, c)]
                            }
                          ],
                          g.hitch(this, function() {
                            this._chainAttachment(
                              this._oEdits[0].adds[0].attributes[
                                this._oEdits[0].layer.objectIdField
                              ],
                              this._oEdits[0].layer
                            );
                          })
                        )
                      : this._autoComplete(
                          a,
                          g.hitch(this, function(a) {
                            a &&
                              a.length &&
                              this._applyEdits(
                                [
                                  {
                                    layer: this._layer,
                                    adds: h.map(
                                      a,
                                      g.hitch(this, function(a) {
                                        return this._createGraphic(a, c);
                                      })
                                    )
                                  }
                                ],
                                function() {
                                  this._chainAttachment(
                                    this._oEdits[0].adds[0].attributes[
                                      this._oEdits[0].layer.objectIdField
                                    ],
                                    this._oEdits[0].layer
                                  );
                                }
                              );
                          })
                        );
                  })
                )
              : this._applyEdits(
                  [{ layer: this._layer, adds: [this._createGraphic(a, c)] }],
                  g.hitch(this, function() {
                    this._chainAttachment(
                      this._oEdits[0].adds[0].attributes[
                        this._oEdits[0].layer.objectIdField
                      ],
                      this._oEdits[0].layer
                    );
                    this._layer &&
                      this._layer.renderer &&
                      "heatmap" === this._layer.renderer.type &&
                      this._layer.refresh();
                  })
                );
          },
          _chainAttachment: function(a, c) {
            this.attributeInspector &&
              this.attributeInspector._attachmentEditor &&
              this.attributeInspector._attachmentEditor._tempUpload &&
              this.attributeInspector._attachmentEditor._chainAttachment(a, c);
          },
          _updateCurrentFeature: function(a) {
            var c = this._isModified();
            c ? this._updateFeature(c, a) : a && a(!1);
          },
          _updateFeature: function(a, c, f) {
            var b = a.geometry,
              d = a.getLayer();
            (d.hasZ && !d.enableZDefaults) ||
            (d.hasM && !d.allowUpdateWithoutMValues) ||
            (f && !this._isModified())
              ? ((f = new r()),
                f.setAttributes(a.attributes),
                this._applyEdits([{ layer: a.getLayer(), updates: [f] }], c))
              : b.rings
              ? this._simplify(
                  b,
                  g.hitch(this, function(f) {
                    this._applyEdits(
                      [
                        {
                          layer: a.getLayer(),
                          updates: [g.mixin(a, { geometry: f })]
                        }
                      ],
                      c
                    );
                  })
                )
              : this._applyEdits([{ layer: a.getLayer(), updates: [a] }], c);
          },
          _deleteFeature: function(a, c) {
            if (this._settings.invalidTemplate && a === this._tempGraphic)
              this._settings.map.graphics.remove(this._tempGraphic),
                this._hideAttributeInspector();
            else {
              var f = [];
              a
                ? f.push({ layer: a.getLayer(), deletes: [a] })
                : ((f = h.map(
                    h.filter(this._settings.layers, function(a) {
                      return 0 < a.getSelectedFeatures().length;
                    }),
                    function(a) {
                      return { layer: a, deletes: a.getSelectedFeatures() };
                    }
                  )) &&
                    f.length) ||
                  !this._currentGraphic ||
                  f.push({
                    layer: this._layer,
                    deletes: [this._currentGraphic]
                  });
              this._applyEdits(f, c);
            }
          },
          _stopEditing: function(a, c, f, b) {
            t.hide(this.progressBar.domNode);
            this._settings.createOnlyLayer[a.id] || this._undoRedoAdd();
            var r;
            !0 === a._isSelOnly || 1 === a.mode || 6 === a.mode
              ? c &&
                c.length &&
                (this.templatePicker.clearSelection(),
                (r = new x()),
                (r.objectIds = [c[0].objectId]),
                this._settings.createOnlyLayer[a.id] ||
                this._settings.invalidTemplate
                  ? this._settings.map.graphics.remove(this._tempGraphic)
                  : this._selectFeatures(
                      [a],
                      r,
                      g.hitch(this, "_onEditFeature")
                    ))
              : ((r = this._selectionHelper.findMapService(
                  this._settings.map,
                  a
                )) && r.refresh(),
                c &&
                  c.length &&
                  (this.templatePicker.clearSelection(),
                  this._settings.createOnlyLayer[a.id] ||
                  this._settings.invalidTemplate
                    ? this._settings.map.graphics.remove(this._tempGraphic)
                    : D.findFeatures(c, a, g.hitch(this, "_onEditFeature"))));
            b &&
              b.length &&
              (this._clearSelection(!0),
              this._undoRedo &&
                (r = this._selectionHelper.findMapService(
                  a,
                  this._settings.map
                )) &&
                r.refresh());
            this._undoRedo &&
              f &&
              f.length &&
              ((r = this._selectionHelper.findMapService(
                a,
                this._settings.map
              )) && r.refresh(),
              this.attributeInspector.refresh(),
              (this._undoRedo = !1));
            this.drawingToolbar && this.drawingToolbar._updateUI();
            this._undoRedo = !1;
            this._settings.invalidTemplate = !1;
          },
          _undoRedoAdd: function() {
            this._settings._isApplyEditsCall = !1;
            if (this._settings.undoManager) {
              var a = this._edits && this._edits.length ? this._edits[0] : null;
              if (a) {
                var c = a.adds || [],
                  f = a.updates || [],
                  b = a.deletes || [],
                  r = a.preUpdates || [],
                  a = { featureLayer: a.layer };
                "CUT" === this._activeTool
                  ? c.length &&
                    f.length &&
                    r.length &&
                    this.undoManager.add(
                      new F(
                        g.mixin(a, {
                          preUpdatedGraphics: r,
                          addedGraphics: c,
                          postUpdatedGraphics: f
                        })
                      )
                    )
                  : "UNION" === this._activeTool
                  ? b.length &&
                    f.length &&
                    r.length &&
                    this.undoManager.add(
                      new A(
                        g.mixin(a, {
                          preUpdatedGraphics: r,
                          deletedGraphics: b,
                          postUpdatedGraphics: f
                        })
                      )
                    )
                  : c.length
                  ? this.undoManager.add(
                      new G(g.mixin(a, { addedGraphics: c }))
                    )
                  : b.length
                  ? this.undoManager.add(
                      new J(g.mixin(a, { deletedGraphics: b }))
                    )
                  : f.length &&
                    (this._rollbackGraphic || r.length) &&
                    this.undoManager.add(
                      new E(
                        g.mixin(a, {
                          preUpdatedGraphics: r.length
                            ? r
                            : [this._rollbackGraphic],
                          postUpdatedGraphics: f
                        })
                      )
                    );
                this._rollbackGraphic = this._edits = null;
              }
            }
          },
          _activateDrawToolbar: function(a) {
            this._layer = a.featureLayer;
            this._activeType = a.type;
            this._drawingTool = (this._activeTemplate = a.template)
              ? this._activeTemplate.drawingTool
              : null;
            this._drawTool = this._toDrawTool(
              this._drawingTool,
              a.featureLayer
            );
            l.disconnect(this._dtConnect);
            var c = this._layer.fields;
            this._settings.invalidTemplate = !1;
            if (this._activeTemplate && this._activeTemplate.prototype) {
              var f = g.mixin({}, this._activeTemplate.prototype.attributes),
                c = c.filter(function(a) {
                  return !1 === a.nullable && !0 === a.editable;
                });
              this._settings.invalidTemplate = c.some(function(a) {
                a = f[a.name];
                return null === a || void 0 === a;
              });
            }
            this._dtConnect =
              this._settings.createOnlyLayer[a.featureLayer.id] ||
              this._settings.invalidTemplate
                ? l.connect(
                    this._drawToolbar,
                    "onDrawEnd",
                    this,
                    "_saveFeatureOnClient"
                  )
                : l.connect(
                    this._drawToolbar,
                    "onDrawEnd",
                    this,
                    "_createFeature"
                  );
            this.editToolbar.deactivate();
            this._disableMapClickHandler();
            this.drawingToolbar
              ? this.drawingToolbar.activateEditing(this._drawTool, this._layer)
              : this._drawToolbar.activate(this._drawTool);
          },
          _activateEditToolbar: function(a, c) {
            var f = a.getLayer(),
              b = f ? f.geometryType : null,
              d = this._isTextSymbolPoint(a),
              t = z.MOVE;
            "esriGeometryPoint" !== b && !0 === this._isNotesFeature(a)
              ? ((t = t | z.ROTATE | z.SCALE), (this._editVertices = !1))
              : "esriGeometryPoint" !== b && !0 === this._editVertices
              ? ((t = t | z.ROTATE | z.SCALE), (this._editVertices = !1))
              : d
              ? ((t = t | z.ROTATE | z.SCALE | z.EDIT_TEXT),
                (this._editVertices = !1))
              : ((t |= z.EDIT_VERTICES), (this._editVertices = !0));
            this._attributeChanged = this._isModified();
            this._rollbackGraphic = new r(a.toJson());
            var b = f.getEditCapabilities({
                feature: a,
                userId: this._settings.userIds[f.id]
              }),
              A = h.filter(this._settings.layerInfos, function(a) {
                return a.featureLayer.layerId === f.layerId;
              })[0];
            b.canUpdate &&
              !A.disableGeometryUpdate &&
              b.canUpdateGeometry &&
              (this.editToolbar.activate(t, a),
              d &&
                (this.editToolbar._textEditor._addTextBox(a),
                this.editToolbar._textSymbolEditor &&
                  this.editToolbar._textSymbolEditor.hide()));
            this._settings.map.infoWindow.isShowing ||
              this._updateAttributeDisabled(a) ||
              ((a = (c && c.screenPoint) || this._findCenterPoint(a)),
              this._showInfoWindow(
                a,
                this._settings.map.getInfoWindowAnchor(a)
              ));
          },
          _createGraphic: function(a, c) {
            var f = new r(
              a,
              (this._activeType && this._activeType.symbol) ||
                this._layer.defaultSymbol,
              c
            );
            this._activeTemplate || c
              ? (f.attributes =
                  c || g.mixin({}, this._activeTemplate.prototype.attributes))
              : ((f.attributes = f.attributes || []),
                h.forEach(
                  this._layer.fields,
                  function(a) {
                    f.attributes[a.name] = null;
                  },
                  this
                ));
            return f;
          },
          _connectEvents: function() {
            var a = this._settings.layers;
            h.forEach(
              a,
              function(a) {
                this._connect(
                  a,
                  "onEditsComplete",
                  g.hitch(this, "_stopEditing", a)
                );
              },
              this
            );
            h.forEach(
              a,
              function(a) {
                this._connect(
                  a,
                  "onBeforeApplyEdits",
                  g.hitch(this, function() {
                    t.show(this.progressBar.domNode);
                    this._settings._isApplyEditsCall = !0;
                  })
                );
              },
              this
            );
            this._connect(
              this.editToolbar,
              "onGraphicClick",
              g.hitch(this, "_activateEditToolbar")
            );
            this._connect(
              this.editToolbar,
              "onGraphicFirstMove",
              g.hitch(this, "_hideAttributeInspector")
            );
            this._connect(
              this.editToolbar,
              "onVertexFirstMove",
              g.hitch(this, "_hideAttributeInspector")
            );
            this._connect(
              this.editToolbar,
              "onScaleStart",
              g.hitch(this, "_hideAttributeInspector")
            );
            this._connect(
              this.editToolbar,
              "onRotateStart",
              g.hitch(this, "_hideAttributeInspector")
            );
          },
          _connect: function(a, c, f) {
            this._eConnects.push(l.connect(a, c, f));
          },
          _createWidgets: function() {
            this._selectionHelper = new L(this._settings);
            this._createTemplatePicker();
            this._createAttributeInspector();
            this._createDrawingToolbar();
            this._createUndoRedoManager();
          },
          _createTemplatePicker: function() {
            if (this._settings.templatePicker)
              (this.templatePicker = this._settings.templatePicker),
                t.hide(this.templatePickerDiv);
            else {
              var a = h.filter(this._settings.layers, function(a) {
                return a.getEditCapabilities().canCreate;
              });
              this.templatePicker = new P(
                {
                  class: "esriTemplatePicker",
                  featureLayers: a,
                  showTooltip: !0,
                  maxLabelLength: this._settings.typesCharacterLimit,
                  columns: "auto",
                  rows: "auto"
                },
                this.templatePickerDiv
              );
              this.templatePicker.startup();
              this._settings.templatePicker = this.templatePicker;
            }
            this._templatePickerOnSelectionChangeEvent = l.connect(
              this.templatePicker,
              "onSelectionChange",
              g.hitch(this, "_onCreateFeature")
            );
          },
          _createAttributeInspector: function() {
            var a = this._settings.map;
            this._settings.attributeInspector
              ? ((this._customAttributeInspector = !0),
                (this.attributeInspector = this._settings.attributeInspector))
              : ((this._customAttributeInspector = !1),
                (this.attributeInspector = new H(
                  {
                    layerInfos: this._settings.layerInfos,
                    hideNavButtons: this._usePopup,
                    datePackage: this._datePackage
                  },
                  k.create("div")
                )),
                this.attributeInspector.startup(),
                a.infoWindow.setContent(this.attributeInspector.domNode),
                a.infoWindow.setTitle(O.widgets.attributeInspector.NLS_title),
                a.infoWindow.resize(350, 375),
                e
                  .query(".esriAttributeInspector .atiLayerName")
                  .style({ display: "none" }));
            this._connect(
              this.attributeInspector,
              "onDelete",
              g.hitch(this, "_deleteFeature")
            );
            this._connect(
              this.attributeInspector,
              "onNext",
              g.hitch(this, function(a) {
                this._updateCurrentFeature(
                  g.hitch(this, function() {
                    this._attributeChanged = !1;
                    this._onEditFeature(a);
                  })
                );
              })
            );
            this._usePopup &&
              a.infoWindow._setPagerCallbacks(
                this.attributeInspector,
                g.hitch(this.attributeInspector, "previous"),
                g.hitch(this.attributeInspector, "next")
              );
            this._connect(
              this.attributeInspector,
              "onAttributeChange",
              g.hitch(this, function(a, c, f) {
                if (
                  this._settings.createOnlyLayer[this._layer.id] ||
                  this._settings.invalidTemplate
                )
                  this._saveAttributesOnClient(a, c, f);
                else {
                  var b = a.getLayer();
                  (b = h.filter(b.fields, function(a) {
                    return a.name === c;
                  })[0]) &&
                    "" === f &&
                    (f = null);
                  this._rollbackGraphic = new r(g.clone(a.toJson()));
                  this.attributeInspector._rollbackInfo = {
                    field: b,
                    graphic: this._rollbackGraphic
                  };
                  this._currentGraphic.attributes[c] =
                    "number" === typeof f && isNaN(f) ? null : f;
                  this._currentGraphic.setAttributes(
                    this._currentGraphic.attributes
                  );
                  this._updateFeature(this._currentGraphic, null, !0);
                  this._attributeChanged = !1;
                }
              })
            );
          },
          _createDrawingToolbar: function() {
            !0 === this._settings.toolbarVisible &&
              (this.drawingToolbar = new K(
                {
                  class: "esriDrawingToolbar",
                  drawToolbar: this._drawToolbar,
                  editToolbar: this.editToolbar,
                  settings: this._settings,
                  onDelete: g.hitch(this, "_deleteFeature"),
                  onApplyEdits: g.hitch(this, "_applyEdits"),
                  onShowAttributeInspector: g.hitch(this, "_onEditFeature")
                },
                this.drawingToolbarDiv
              ));
          },
          _createUndoRedoManager: function() {
            if (this._settings.enableUndoRedo || this._settings.undoManager)
              (this._settings.enableUndoRedo = !0),
                (this.undoManager = this._settings.undoManager),
                this.undoManager ||
                  (this.undoManager = this._settings.undoManager = new C({
                    maxOperations: this._settings.maxUndoRedoOperations
                  })),
                this._connect(
                  this.undoManager,
                  "onUndoComplete",
                  g.hitch(this, this._updateUndoRedoOperations)
                ),
                this._connect(
                  this.undoManager,
                  "onRedoComplete",
                  g.hitch(this, this._updateUndoRedoOperations)
                ),
                this._connect(
                  document,
                  "onkeypress",
                  g.hitch(this, function(a) {
                    if (a.metaKey || a.ctrlKey)
                      "z" === a.charOrCode && this._undo(),
                        "y" === a.charOrCode && this._redo();
                  })
                );
          },
          _updateUndoRedoOperations: function(a) {
            if (a && a.addedIds) {
              var c;
              for (c = 0; c < this.undoManager.length; c++) {
                var f = this.undoManager.get(c);
                f &&
                  a.layer === f._featureLayer &&
                  f.updateObjectIds(a.oldIds, a.addedIds);
              }
            }
            a &&
              "Update Features" === a.operation.label &&
              this.attributeInspector.refresh();
          },
          _enableMapClickHandler: function() {
            this._mapClickHandler = l.connect(
              this._settings.map,
              "onClick",
              g.hitch(this, function(a) {
                this._drawToolbar._geometryType ||
                  ("SELECT" === this._activeTool
                    ? (this._activeTool = "")
                    : this._updateCurrentFeature(
                        g.hitch(this, function() {
                          this._reset();
                          this._updateSelection(a);
                        })
                      ));
              })
            );
          },
          _disableMapClickHandler: function() {
            l.disconnect(this._mapClickHandler);
          },
          _onCreateFeature: function() {
            var a = this.templatePicker.getSelected();
            a
              ? this._updateCurrentFeature(
                  g.hitch(this, function() {
                    this._currentGraphic && this._clearSelection(!1);
                    this._reset();
                    this._activateDrawToolbar(a);
                  })
                )
              : (this._reset(),
                l.disconnect(this._dtConnect),
                this._drawToolbar.deactivate(),
                this._enableMapClickHandler(),
                this.drawingToolbar && this.drawingToolbar.deactivate());
          },
          _isTextSymbolPoint: function(a) {
            if (
              "point" === a.geometry.type ||
              "multipoint" === a.geometry.type
            ) {
              var c = a.getLayer(),
                f = c.renderer;
              a = a.symbol || c._getSymbol(a);
              !a &&
                (f.hasVisualVariables("sizeInfo", !1) ||
                  f.hasVisualVariables("colorInfo", !1) ||
                  f.hasVisualVariables("opacityInfo", !1)) &&
                f.addBreak &&
                f.infos &&
                1 === f.infos.length &&
                (a = f.infos[0].symbol || f.defaultSymbol);
              if (a && "textsymbol" === a.type) return !0;
            }
            return !1;
          },
          _isTextSymbolPointLayer: function(a) {
            return "esriGeometryPoint" === a.geometryType &&
              a.renderer &&
              a.renderer._symbols &&
              a.renderer._symbols[0] &&
              a.renderer._symbols[0].symbol &&
              "textsymbol" === a.renderer._symbols[0].symbol.type
              ? !0
              : !1;
          },
          _updateAttributeDisabled: function(a) {
            a = a.getLayer();
            if (!a) return !1;
            var c,
              f,
              b = !1;
            for (c = 0; c < this._settings.layerInfos.length; c++)
              if (((f = this._settings.layerInfos[c]), f.featureLayer == a)) {
                b = f.disableAttributeUpdate;
                break;
              }
            return b;
          },
          _onEditFeature: function(a, f) {
            if ((a = (g.isArray(a) ? a[0] : a) || null)) {
              var b;
              this._layer = a.getLayer();
              if (
                !this._customAttributeInspector &&
                !this._updateAttributeDisabled(a)
              ) {
                f = f || this._editClickPoint || this._findCenterPoint(a);
                1 < this._currentFeatureCount
                  ? ((b = this._popupFeatures.indexOf(a)),
                    (b = c.substitute(O.widgets.popup.NLS_pagingInfo, {
                      index: b + 1,
                      total: this._currentFeatureCount
                    })))
                  : (b = this._layer
                      ? this._layer.name
                      : O.widgets.attributeInspector.NLS_title);
                this._settings.map.infoWindow.setTitle(b);
                if (
                  this.drawingToolbar ||
                  !this._settings.map.infoWindow.isShowing
                )
                  this.attributeInspector.refresh(),
                    this._showInfoWindow(
                      f,
                      this._settings.map.getInfoWindowAnchor(f)
                    );
                this._editClickPoint = null;
              }
              a !== this._currentGraphic &&
                ((this._editVertices = !0),
                (this._currentGraphic = a),
                a.getDojoShape() && a.getDojoShape().moveToFront(),
                (f = this._layer.hasM),
                (this._layer.hasZ && !this._layer.enableZDefaults) ||
                  (f && !this._layer.allowUpdateWithoutMValues) ||
                  this._activateEditToolbar(a));
            }
          },
          _applyEdits: function(c, f) {
            c = c || [];
            if (!(0 >= c.length)) {
              this._edits = this._oEdits = c;
              var b = [];
              h.forEach(c, function(a) {
                a.layer &&
                  b.push(a.layer.applyEdits(a.adds, a.updates, a.deletes));
              });
              0 < b.length &&
                (this._deferredsList = new a(b).addCallback(
                  g.hitch(this, function() {
                    t.hide(this.progressBar.domNode);
                    f && f();
                    var a = this._settings.map;
                    a &&
                      a.infoWindow.reposition &&
                      a.infoWindow.isShowing &&
                      a.infoWindow.reposition();
                  })
                ));
            }
          },
          _undo: function() {
            this._settings.undoManager &&
              !this._settings._isApplyEditsCall &&
              (this.editToolbar.deactivate(),
              (this._undoRedo = !0),
              this._settings.undoManager.undo());
          },
          _redo: function() {
            this._settings.undoManager &&
              !this._settings._isApplyEditsCall &&
              (this.editToolbar.deactivate(),
              (this._undoRedo = !0),
              this._settings.undoManager.redo());
          },
          _simplify: function(a, c) {
            u.prototype.isSelfIntersecting(a)
              ? this._settings.geometryService.simplify([a], function(a) {
                  var f = a && a.length ? a[0] : f;
                  c && c(f);
                })
              : c && c(a);
          },
          _autoComplete: function(a, c) {
            var b = this._getLayers("esriGeometryPolygon"),
              r = new x();
            r.geometry = a;
            r.returnGeometry = !0;
            this._selectFeatures(
              b,
              r,
              g.hitch(this, function(b) {
                !b || 0 >= b.length
                  ? c && c([a])
                  : this._settings.geometryService.autoComplete(
                      f.getGeometries(b),
                      this._toPolylines([r.geometry]),
                      function(a) {
                        c && c(a);
                      }
                    );
              })
            );
          },
          _getLayers: function(a) {
            return h.filter(this._settings.layers, function(c) {
              return c.geometryType === a;
            });
          },
          _selectFeatures: function(a, c, f, b) {
            this._selectionHelper.selectFeatures(a, c, b || B.SELECTION_NEW, f);
          },
          _updateSelection: function(a) {
            var c = a.mapPoint,
              f = a.graphic,
              b = this._settings.layerInfos,
              r;
            this._selectionHelper.selectFeaturesByGeometry(
              this._settings.layers,
              c,
              B.SELECTION_NEW,
              g.hitch(this, function(a) {
                var d = h.some(
                  a,
                  g.hitch(this, function(a) {
                    return a == f;
                  })
                );
                if (f && !d)
                  if (((d = f.getLayer()), this._isValidLayer(d))) {
                    var t = new x();
                    t.objectIds = [f.attributes[d.objectIdField]];
                    this._selectionHelper.selectFeatures(
                      [d],
                      t,
                      B.SELECTION_ADD,
                      g.hitch(this, function(f) {
                        f &&
                          f.length &&
                          ((f = f.concat(a)),
                          (r = D.sortFeaturesById(b, f)),
                          this._updatePopupButtons(r),
                          this._onEditFeature(r, c));
                      })
                    );
                  } else
                    a && a.length
                      ? ((r = D.sortFeaturesById(b, a)),
                        this._updatePopupButtons(r),
                        this._onEditFeature(r, c))
                      : this._clearSelection();
                else
                  a && a.length
                    ? ((r = D.sortFeaturesById(b, a)),
                      this._updatePopupButtons(r),
                      this._onEditFeature(r, c))
                    : this._clearSelection();
              })
            );
            f &&
              this._isTextSymbolPoint(f) &&
              this._isValidLayer(f.getLayer()) &&
              this.editToolbar.activate(
                0 | z.MOVE | z.ROTATE | z.SCALE | z.EDIT_TEXT,
                f
              );
          },
          _updatePopupButtons: function(a) {
            if (this._usePopup && a) {
              var c = a.length;
              h.forEach(
                [
                  this._settings.map.infoWindow._prevFeatureButton,
                  this._settings.map.infoWindow._nextFeatureButton
                ],
                g.hitch(this, function(a) {
                  1 < c ? m.remove(a, "hidden") : m.add(a, "hidden");
                })
              );
              var f = 1 < c ? "block" : "none";
              e.query(".esriAttributeInspector .atiLayerName").style({
                display: f
              });
              this._currentFeatureCount = c;
              this._popupFeatures = a;
            } else this._currentFeatureCount = this._popupFeatures = null;
          },
          _clearSelection: function(a) {
            this._currentFeatureCount = 0;
            this._popupFeatures = null;
            this._selectionHelper.clearSelection(a || !1);
            this._reset();
          },
          _findCenterPoint: function(a) {
            a = a.geometry || a;
            var c;
            switch (a.type) {
              case "point":
                c = a;
                break;
              case "polyline":
                c = a.getPoint(0, Math.ceil(a.paths[0].length / 2));
                break;
              case "polygon":
                (c = a.rings.length - 1),
                  (c = a.getPoint(c, a.rings[c].length - 1));
            }
            return this._settings.map.toScreen(c);
          },
          _hideAttributeInspector: function() {
            !this._customAttributeInspector &&
              this._settings.map.infoWindow &&
              this._settings.map.infoWindow.hide();
          },
          _toPolylines: function(a) {
            return h.map(a, function(a) {
              var c = new y(a.spatialReference);
              h.forEach(a.rings, function(a) {
                c.addPath(a);
              });
              return c;
            });
          },
          _isNotesFeature: function(a) {
            var c = a.getLayer(),
              f = c ? c.types || null : null;
            if (!f) return !1;
            var b = a.attributes[c.typeIdField],
              r;
            h.some(f, function(a) {
              return a.id === b ? ((r = a.templates), !0) : !1;
            });
            return r
              ? (a = r[0] || null)
                ? this._isShapeTool(a.drawingTool)
                  ? !0
                  : !1
                : !1
              : !1;
          },
          _isValidLayer: function(a) {
            var c,
              f = this._settings.layerInfos;
            for (c = 0; c < f.length; c++) {
              var b = f[c];
              if (a.id == (b.featureLayer ? b.featureLayer.id : b.layerId))
                return !0;
            }
            return !1;
          },
          _isShapeTool: function(a) {
            switch (a) {
              case v.TOOL_ARROW:
                return w.ARROW;
              case v.TOOL_LEFT_ARROW:
                return w.LEFT_ARROW;
              case v.TOOL_RIGHT_ARROW:
                return w.RIGHT_ARROW;
              case v.TOOL_UP_ARROW:
                return w.UP_ARROW;
              case v.TOOL_DOWN_ARROW:
                return w.DOWN_ARROW;
              case v.TOOL_CIRCLE:
                return w.CIRCLE;
              case v.TOOL_ELLIPSE:
                return w.ELLIPSE;
              case v.TOOL_TRIANGLE:
                return w.TRIANGLE;
              case v.TOOL_RECTANGLE:
                return w.RECTANGLE;
              default:
                return null;
            }
          },
          _toDrawTool: function(a, c) {
            c = c.geometryType;
            switch (a) {
              case v.TOOL_POINT:
                return w.POINT;
              case v.TOOL_ARROW:
                return w.ARROW;
              case v.TOOL_LEFT_ARROW:
                return w.LEFT_ARROW;
              case v.TOOL_RIGHT_ARROW:
                return w.RIGHT_ARROW;
              case v.TOOL_UP_ARROW:
                return w.UP_ARROW;
              case v.TOOL_DOWN_ARROW:
                return w.DOWN_ARROW;
              case v.TOOL_CIRCLE:
                return w.CIRCLE;
              case v.TOOL_ELLIPSE:
                return w.ELLIPSE;
              case v.TOOL_TRIANGLE:
                return w.TRIANGLE;
              case v.TOOL_RECTANGLE:
                return w.RECTANGLE;
              case v.TOOL_LINE:
                return w.POLYLINE;
              case v.TOOL_POLYGON:
                return w.POLYGON;
              case v.TOOL_FREEHAND:
                return "esriGeometryPolyline" === c
                  ? w.FREEHAND_POLYLINE
                  : w.FREEHAND_POLYGON;
              default:
                return (
                  (a = w.POINT),
                  "esriGeometryPolyline" === c
                    ? ((a = w.POLYLINE),
                      this._settings.createOptions.polylineDrawTools[0] ===
                        I.CREATE_TOOL_FREEHAND_POLYLINE &&
                        (a = w.FREEHAND_POLYLINE))
                    : "esriGeometryPolygon" === c &&
                      ((a = w.POLYGON),
                      this._settings.createOptions.polygonDrawTools[0] ===
                        I.CREATE_TOOL_FREEHAND_POLYGON &&
                        (a = w.FREEHAND_POLYGON)),
                  a
                );
            }
          },
          _isModified: function() {
            var a = this.editToolbar.getCurrentState();
            return (a.isModified || this._attributeChanged) && a.graphic
              ? a.graphic
              : null;
          },
          _showInfoWindow: function(a, c) {
            this._customAttributeInspector ||
              this._settings.map.infoWindow.show(a, c);
          }
        });
        g.mixin(I, {
          CREATE_TOOL_POLYLINE: "polyline",
          CREATE_TOOL_FREEHAND_POLYLINE: "freehandpolyline",
          CREATE_TOOL_POLYGON: "polygon",
          CREATE_TOOL_FREEHAND_POLYGON: "freehandpolygon",
          CREATE_TOOL_AUTOCOMPLETE: "autocomplete",
          CREATE_TOOL_RECTANGLE: "rectangle",
          CREATE_TOOL_TRIANGLE: "triangle",
          CREATE_TOOL_CIRCLE: "circle",
          CREATE_TOOL_ELLIPSE: "ellipse",
          CREATE_TOOL_ARROW: "arrow",
          CREATE_TOOL_UP_ARROW: "uparrow",
          CREATE_TOOL_DOWN_ARROW: "downarrow",
          CREATE_TOOL_RIGHT_ARROW: "rightarrow",
          CREATE_TOOL_LEFT_ARROW: "leftarrow"
        });
        b("extend-esri") && g.setObject("dijit.editing.Editor", I, Q);
        return I;
      });
    },
    "esri/toolbars/edit": function() {
      define("require dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/Color dojo/has dojo/dom-construct dojo/dom-style ../kernel ../lang ../sniff ./_toolbar ./_Box ./_GraphicMover ./_VertexEditor ./TextEditor ../symbols/SimpleMarkerSymbol ../symbols/SimpleLineSymbol ../symbols/TextSymbol ../graphic".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B
      ) {
        var v = g(q, {
          declaredClass: "esri.toolbars.Edit",
          constructor: function(a, c) {
            this._map = a;
            this._tool = 0;
            if (this._map.loaded) this._scratchGL = a.graphics;
            else
              var f = l.connect(this._map, "onLoad", this, function() {
                l.disconnect(f);
                f = null;
                this._scratchGL = this._map.graphics;
              });
            a = d("esri-mobile");
            this._defaultOptions = h.mixin(
              {
                vertexSymbol: new r(
                  r.STYLE_CIRCLE,
                  a ? 20 : 12,
                  new C(C.STYLE_SOLID, new b([0, 0, 0, 0.5]), 1),
                  new b([128, 128, 128])
                ),
                ghostVertexSymbol: new r(
                  r.STYLE_CIRCLE,
                  a ? 18 : 10,
                  new C(C.STYLE_SOLID, new b([0, 0, 0, 0.5]), 1),
                  new b([255, 255, 255, 0.75])
                ),
                ghostLineSymbol: new C(C.STYLE_DOT, new b([128, 128, 128]), 2),
                allowDeleteVertices: !0,
                allowAddVertices: !0,
                rotateHandleOffset: a ? 24 : 16,
                boxLineSymbol: new C(C.STYLE_DASH, new b([64, 64, 64]), 1),
                boxHandleSymbol: new r(
                  r.STYLE_SQUARE,
                  a ? 16 : 9,
                  new C(C.STYLE_SOLID, new b([0, 0, 0, 0.5]), 1),
                  new b([255, 255, 255, 0.75])
                ),
                textAnchorSymbol: new r(
                  r.STYLE_CIRCLE,
                  10,
                  null,
                  new b([255, 0, 0])
                )
              },
              c || {}
            );
          },
          activate: function(a, c, f) {
            this.deactivate();
            this._graphic = c;
            this._options = h.mixin(h.mixin({}, this._defaultOptions), f || {});
            var b = v.MOVE;
            f = v.EDIT_VERTICES;
            var r = v.SCALE,
              d = v.ROTATE,
              t = v.EDIT_TEXT,
              e = !1,
              A = !1,
              m = !1,
              k = this._map,
              u = k.spatialReference,
              y = c.geometry.spatialReference;
            this._geo = !(
              !u ||
              !y ||
              u.equals(y) ||
              !u.isWebMercator() ||
              4326 !== y.wkid
            );
            this._isTextPoint = this._prepareTextSymbolEditing(c, a);
            (a & b) === b && (e = this._enableMove(c));
            b = (a & r) === r;
            d = (a & d) === d;
            if (b || d) m = this._enableBoxEditing(c, b, d);
            (a & f) === f && (A = this._enableVertexEditing(c));
            (a & t) === t && this._enableTextEditing(c);
            if (!(e || A || m))
              throw Error(
                "[esri.toolbars.Edit::activate] Unable to activate the tool. Check if the tool is valid for the given geometry type."
              );
            if ((this._tool = a))
              (this._mapPanEndHandle = l.connect(
                k,
                "onPanEnd",
                this,
                this._mapPanEndHandler
              )),
                (this._mapExtChgHandle = l.connect(
                  k,
                  "onExtentChange",
                  this,
                  this._mapExtentChangeHandler
                )),
                this.onActivate(this._tool, c);
            k.snappingManager &&
              (e || A) &&
              k.snappingManager._startSelectionLayerQuery();
          },
          deactivate: function() {
            this._isTextPoint = null;
            var a = this._tool,
              c = this._graphic;
            if (a) {
              var f = !!this._modified;
              this._clear();
              l.disconnect(this._mapPanEndHandle);
              l.disconnect(this._mapExtChgHandle);
              this._graphic = this._geo = this._mapPanEndHandle = this._mapExtChgHandle = null;
              this.onDeactivate(a, c, { isModified: f });
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
          onActivate: function(a, c) {},
          onDeactivate: function(a, c, f) {},
          onGraphicMoveStart: function(a) {},
          onGraphicFirstMove: function(a) {
            this._modified = !0;
          },
          onGraphicMove: function(a, c) {},
          onGraphicMoveStop: function(a, c) {},
          onGraphicClick: function(a, c) {},
          onVertexMoveStart: function(a, c) {},
          onVertexFirstMove: function(a, c) {
            this._modified = !0;
          },
          onVertexMove: function(a, c, f) {},
          onVertexMoveStop: function(a, c, f) {},
          onVertexAdd: function(a, c) {
            this._modified = !0;
          },
          onVertexClick: function(a, c) {},
          onVertexMouseOver: function(a, c) {},
          onVertexMouseOut: function(a, c) {},
          onVertexDelete: function(a, c) {
            this._modified = !0;
          },
          onTextEditStart: function(a, c) {},
          onTextEditEnd: function(a) {},
          onScaleStart: function(a) {},
          onScaleFirstMove: function(a) {
            this._modified = !0;
          },
          onScale: function(a, c) {},
          onScaleStop: function(a, c) {},
          onRotateStart: function(a) {},
          onRotateFirstMove: function(a) {
            this._modified = !0;
          },
          onRotate: function(a, c) {},
          onRotateStop: function(a, c) {},
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
          _prepareTextSymbolEditing: function(c, f) {
            if (
              "point" === c.geometry.type ||
              "multipoint" === c.geometry.type
            ) {
              var b = c.getLayer(),
                r = b.renderer,
                b = c.symbol || b._getSymbol(c);
              !b &&
                (r.hasVisualVariables("sizeInfo", !1) ||
                  r.hasVisualVariables("colorInfo", !1) ||
                  r.hasVisualVariables("opacityInfo", !1)) &&
                r.addBreak &&
                r.infos &&
                1 === r.infos.length &&
                (b = r.infos[0].symbol || r.defaultSymbol);
              if (b && "textsymbol" === b.type) {
                if (
                  (f & v.SCALE) === v.SCALE ||
                  (f & v.ROTATE) === v.ROTATE ||
                  (f & v.EDIT_TEXT) === v.EDIT_TEXT
                ) {
                  c.setSymbol(new x(b.toJson()));
                  var d = this;
                  this._textSymbolEditor
                    ? (this._textSymbolEditor.createForm(c),
                      this._textSymbolEditor.show())
                    : this._options && this._options.textSymbolEditor
                    ? ((this._textSymbolEditor = this._options.textSymbolEditor),
                      this._textSymbolEditor.on("symbol-change", function() {
                        d._boxEditor && d._boxEditor.refresh();
                      }))
                    : n(["../dijit/SymbolEditor"], function(f) {
                        if (!d._textSymbolEditor) {
                          var b;
                          b = d._options.textSymbolEditorHolder
                            ? a.create(
                                "div",
                                null,
                                d._options.textSymbolEditorHolder
                              )
                            : a.create("div", null, d._map.root);
                          d._textSymbolEditor = new f({ graphic: c }, b);
                          f = d._textSymbolEditor.domNode.parentNode.id;
                          m.set(d._textSymbolEditor.domNode, {
                            position:
                              "map_root" === f ? "absolute" : "relative",
                            left:
                              "map_root" === f
                                ? d._map.width / 2 - 100 + "px"
                                : "5px",
                            top: "20px",
                            "z-index": 50
                          });
                          d._textSymbolEditor.startup();
                          d._textSymbolEditor.createForm(c);
                          d._textSymbolEditor.show();
                          d._textSymbolEditor.on("symbol-change", function() {
                            d._boxEditor && d._boxEditor.refresh();
                          });
                        }
                      });
                }
                if (
                  (f & v.MOVE) === v.MOVE ||
                  (f & v.ROTATE) === v.ROTATE ||
                  (f & v.SCALE) === v.SCALE
                )
                  (this._textAnchor = new B(
                    c.geometry,
                    this._options.textAnchorSymbol
                  )),
                    this._scratchGL.add(this._textAnchor);
                return !0;
              }
            }
            return !1;
          },
          _enableMove: function(a) {
            var c = this._map;
            switch (a.geometry.type) {
              case "point":
              case "polyline":
              case "polygon":
                return (
                  (this._graphicMover = new f(a, c, this, this._textAnchor)), !0
                );
            }
            return !1;
          },
          _enableVertexEditing: function(a) {
            var c = this._map;
            switch (a.geometry.type) {
              case "multipoint":
              case "polyline":
              case "polygon":
                return (this._vertexEditor = y.create(a, c, this)), !0;
            }
            return !1;
          },
          _enableBoxEditing: function(a, c, f) {
            var b = this._map,
              r = a.geometry.type;
            return "polyline" === r || "polygon" === r || this._isTextPoint
              ? ((this._boxEditor = new t(
                  a,
                  b,
                  this,
                  c,
                  f,
                  this._options.uniformScaling,
                  this._isTextPoint
                )),
                !0)
              : !1;
          },
          _enableTextEditing: function(a) {
            return this._isTextPoint
              ? ((this._textEditor = new u(a, this._map, this)),
                l.connect(
                  this._textEditor,
                  "onEditStart",
                  h.hitch(this, function() {
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
          _mapExtentChangeHandler: function(a, c, f) {
            f && this._refreshMoveables();
          },
          _refreshMoveables: function(a) {
            var f = e.filter(
              [this._graphicMover, this._vertexEditor, this._boxEditor],
              c.isDefined
            );
            e.forEach(f, function(c) {
              c.refresh(a);
            });
          },
          _beginOperation: function(a) {
            e.forEach(this._getAffectedTools(a), function(a) {
              a.suspend();
            });
          },
          _endOperation: function(a) {
            e.forEach(this._getAffectedTools(a), function(a) {
              a.resume();
            });
          },
          _getAffectedTools: function(a) {
            var f = [];
            switch (a) {
              case "MOVE":
                f = [this._vertexEditor, this._boxEditor];
                break;
              case "VERTICES":
                f = [this._boxEditor];
                break;
              case "BOX":
                f = [this._vertexEditor];
            }
            return (f = e.filter(f, c.isDefined));
          }
        });
        h.mixin(v, {
          MOVE: 1,
          EDIT_VERTICES: 2,
          SCALE: 4,
          ROTATE: 8,
          EDIT_TEXT: 16
        });
        d("extend-esri") && h.setObject("toolbars.Edit", v, k);
        return v;
      });
    },
    "esri/toolbars/_Box": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/Color dojo/has dojo/dom-style dojox/gfx/Moveable dojox/gfx/matrix ../kernel ../lang ../geometry/Point ../geometry/Polyline ../symbols/SimpleMarkerSymbol ../geometry/webMercatorUtils ../geometry/jsonUtils ../graphic".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q, t, f, y, u) {
        n = n(null, {
          declaredClass: "esri.toolbars._Box",
          constructor: function(a, c, f, b, d, t, e) {
            this._graphic = a;
            this._map = c;
            this._toolbar = f;
            this._scale = b;
            this._rotate = d;
            this._defaultEventArgs = {};
            this._scaleEvent = "Scale";
            this._rotateEvent = "Rotate";
            this._uniformScaling = t;
            a = f._options;
            this._markerSymbol = a.boxHandleSymbol;
            this._lineSymbol = a.boxLineSymbol;
            this._moveStartHandler = g.hitch(this, this._moveStartHandler);
            this._firstMoveHandler = g.hitch(this, this._firstMoveHandler);
            this._moveStopHandler = g.hitch(this, this._moveStopHandler);
            this._moveHandler = g.hitch(this, this._moveHandler);
            this._isTextPoint = e;
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
            h.forEach(this._getAllGraphics(), function(a) {
              a.hide();
            });
          },
          resume: function() {
            h.forEach(this._getAllGraphics(), function(a) {
              a.show();
            });
            this._draw();
          },
          _init: function() {
            this._draw();
          },
          _cleanUp: function() {
            this._connects && h.forEach(this._connects, l.disconnect);
            var a = this._toolbar._scratchGL;
            this._anchors &&
              h.forEach(this._anchors, function(c) {
                a.remove(c.graphic);
                (c = c.moveable) && c.destroy();
              });
            this._box && a.remove(this._box);
            this._box = this._anchors = this._connects = null;
          },
          _draw: function() {
            if (this._graphic.getDojoShape()) {
              var a = this._map,
                c = this._toolbar._scratchGL,
                f = this._getBoxCoords(),
                b = new q(a.spatialReference),
                d = g.clone(
                  h.filter(f, function(a, c) {
                    return 8 !== c && 0 === c % 2;
                  })
                );
              d[0] && d.push([d[0][0], d[0][1]]);
              b.addPath(d);
              this._rotate && b.addPath([f[1], f[8]]);
              this._box
                ? this._box.setGeometry(b)
                : ((this._box = new u(b, this._lineSymbol)), c.add(this._box));
              this._anchors
                ? h.forEach(
                    this._anchors,
                    function(c, b) {
                      this._scale || (b = 8);
                      var r = new p(f[b], a.spatialReference);
                      c.graphic.setGeometry(r);
                      var r = c.moveable,
                        d = c.graphic.getDojoShape();
                      d &&
                        (r
                          ? d !== r.shape &&
                            (r.destroy(),
                            (c.moveable = this._getMoveable(c.graphic, b)))
                          : (c.moveable = this._getMoveable(c.graphic, b)));
                    },
                    this
                  )
                : ((this._anchors = []),
                  (this._connects = []),
                  h.forEach(
                    f,
                    function(f, b) {
                      (!this._scale && 8 > b) ||
                        ((f = new p(f, a.spatialReference)),
                        (f = new u(f, this._markerSymbol)),
                        this._isTextPoint && 1 === b % 2 && f.hide(),
                        c.add(f),
                        this._anchors.push({
                          graphic: f,
                          moveable: this._getMoveable(f, b)
                        }));
                    },
                    this
                  ));
            } else this._cleanUp();
          },
          _getBoxCoords: function(a) {
            var c = this._map,
              f,
              b = [],
              r,
              d,
              t;
            if (this._isTextPoint) {
              f = this._graphic.getNode().getBoundingClientRect();
              var e = c.__container.getBoundingClientRect();
              f = [
                { x: f.left - e.left, y: f.top - e.top },
                { x: f.right - e.left, y: f.top - e.top },
                { x: f.right - e.left, y: f.bottom - e.top },
                { x: f.left - e.left, y: f.bottom - e.top }
              ];
            } else f = this._getTransformedBoundingBox(this._graphic);
            h.forEach(f, function(f, e, k) {
              r = f;
              (d = k[e + 1]) || (d = k[0]);
              t = { x: (r.x + d.x) / 2, y: (r.y + d.y) / 2 };
              a || ((r = c.toMap(r)), (t = c.toMap(t)));
              b.push([r.x, r.y]);
              b.push([t.x, t.y]);
            });
            this._rotate &&
              ((f = g.clone(b[1])),
              (f = a
                ? { x: f[0], y: f[1] }
                : c.toScreen({
                    x: f[0],
                    y: f[1],
                    spatialReference: c.spatialReference
                  })),
              (f.y -= this._toolbar._options.rotateHandleOffset),
              a || (f = c.toMap(f)),
              b.push([f.x, f.y]));
            return b;
          },
          _getTransformedBoundingBox: function(a) {
            var c = this._map,
              f = a.geometry.getExtent(),
              b = a.geometry.spatialReference;
            a = new p(f.xmin, f.ymax, b);
            f = new p(f.xmax, f.ymin, b);
            a = c.toScreen(a);
            f = c.toScreen(f);
            return [
              { x: a.x, y: a.y },
              { x: f.x, y: a.y },
              { x: f.x, y: f.y },
              { x: a.x, y: f.y }
            ];
          },
          _getAllGraphics: function() {
            var a = [this._box];
            this._anchors &&
              h.forEach(this._anchors, function(c) {
                a.push(c.graphic);
              });
            return (a = h.filter(a, c.isDefined));
          },
          _getMoveable: function(c, f) {
            var b = c.getDojoShape();
            if (b)
              return (
                (c = new a(b)),
                (c._index = f),
                this._connects.push(
                  l.connect(c, "onMoveStart", this._moveStartHandler)
                ),
                this._connects.push(
                  l.connect(c, "onFirstMove", this._firstMoveHandler)
                ),
                this._connects.push(
                  l.connect(c, "onMoveStop", this._moveStopHandler)
                ),
                (c.onMove = this._moveHandler),
                (b = b.getEventSource()) &&
                  d.set(b, "cursor", this._toolbar._cursors["box" + f]),
                c
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
            var c = a.host._index,
              f = (this._wrapOffset = a.host.shape._wrapOffsets[0] || 0),
              b = this._graphic.getLayer().getNavigationTransform(),
              d;
            a = h.map(this._getBoxCoords(!0), function(a) {
              return { x: a[0] + f, y: a[1] };
            });
            d = this._isTextPoint
              ? this._map.toScreen(this._graphic.geometry)
              : { x: a[1].x, y: a[3].y };
            this._centerCoord = m.multiplyPoint(m.invert(b), d);
            if (8 === c)
              (d = m.multiplyPoint(m.invert(b), a[1])),
                this._isTextPoint &&
                  (this._centerCoord = this._deNormalizePoint(
                    this._centerCoord,
                    d
                  )),
                (this._startLine = [this._centerCoord, d]),
                (this._moveLine = g.clone(this._startLine));
            else if (
              ((d = m.multiplyPoint(m.invert(b), a[c])),
              (b = m.multiplyPoint(m.invert(b), a[(c + 4) % 8])),
              this._isTextPoint &&
                (this._centerCoord = this._deNormalizePoint(
                  this._centerCoord,
                  d
                )),
              (this._firstMoverToAnchor = Math.sqrt(
                (d.x - this._centerCoord.x) * (d.x - this._centerCoord.x) +
                  (d.y - this._centerCoord.y) * (d.y - this._centerCoord.y)
              )),
              (this._startBox = b),
              (this._startBox.width = a[4].x - a[0].x),
              (this._startBox.height = a[4].y - a[0].y),
              (this._moveBox = g.clone(this._startBox)),
              (this._xfactor = d.x > b.x ? 1 : -1),
              (this._yfactor = d.y > b.y ? 1 : -1),
              1 === c || 5 === c)
            )
              this._xfactor = 0;
            else if (3 === c || 7 === c) this._yfactor = 0;
            this._toolbar._beginOperation("BOX");
            this._toolbar[
              "on" +
                (8 === c ? this._rotateEvent : this._scaleEvent) +
                "FirstMove"
            ](this._graphic);
          },
          _moveHandler: function(a, c) {
            a = a.host._index;
            var f = this._defaultEventArgs,
              b,
              d,
              t;
            f.angle = 0;
            f.scaleX = 1;
            f.scaleY = 1;
            if (8 === a)
              (b = this._startLine),
                (d = this._moveLine),
                (t = d[1]),
                (t.x += c.dx),
                (t.y += c.dy),
                (c = this._getAngle(b, d)),
                this._isTextPoint && (c += this._graphic.symbol.angle),
                (d = m.rotategAt(c, b[0])),
                this._graphic.getDojoShape().setTransform(d),
                (f.transform = d),
                (f.angle = c),
                (f.around = b[0]);
            else {
              b = this._startBox;
              d = this._moveBox;
              d.width += c.dx * this._xfactor;
              d.height += c.dy * this._yfactor;
              this._uniformScaling || this._isTextPoint
                ? ((b = d.x + this._xfactor * d.width),
                  (d = d.y + this._yfactor * d.height),
                  (b = Math.sqrt(
                    (b - this._centerCoord.x) * (b - this._centerCoord.x) +
                      (d - this._centerCoord.y) * (d - this._centerCoord.y)
                  )),
                  (this._scaleRatio = c = t = b / this._firstMoverToAnchor),
                  (b = this._centerCoord))
                : ((c = d.width / b.width),
                  (t = d.height / b.height),
                  (b = { x: b.x, y: b.y }));
              if (isNaN(c) || Infinity === c || -Infinity === c) c = 1;
              if (isNaN(t) || Infinity === t || -Infinity === t) t = 1;
              d = m.scaleAt(c, t, b);
              if (this._isTextPoint) {
                var r = m.rotategAt(this._graphic.symbol.angle, b);
                this._graphic.getDojoShape().setTransform([r, d]);
              } else this._graphic.getDojoShape().setTransform(d);
              f.transform = d;
              f.scaleX = c;
              f.scaleY = t;
              f.around = b;
            }
            this._toolbar[
              "on" + (8 === a ? this._rotateEvent : this._scaleEvent)
            ](this._graphic, f);
          },
          _moveStopHandler: function(a) {
            this._toolbar._activateScrollWheel();
            var c = this._graphic,
              b = this._toolbar,
              d = b._geo ? f.geographicToWebMercator(c.geometry) : c.geometry,
              t = d.spatialReference,
              r = c.getDojoShape(),
              e = r.getTransform(),
              k = c.getLayer().getNavigationTransform();
            this._isTextPoint
              ? ((c = this._graphic.symbol),
                8 === a.host._index
                  ? (c.angle += this._getAngle(this._startLine, this._moveLine))
                  : c.font.setSize(
                      Math.round(c.font.size * this._scaleRatio * 100) / 100
                    ),
                this._graphic.setSymbol(c))
              : ((d = d.toJson()),
                this._updateSegments(d.paths || d.rings, e, k, t),
                r.setTransform(null),
                (d = y.fromJson(d)),
                c.setGeometry(b._geo ? f.webMercatorToGeographic(d, !0) : d));
            this._draw();
            this._startLine = this._moveLine = this._startBox = this._moveBox = this._xfactor = this._yfactor = null;
            b._endOperation("BOX");
            this._defaultEventArgs.transform = e;
            b[
              "on" +
                (8 === a.host._index ? this._rotateEvent : this._scaleEvent) +
                "Stop"
            ](this._graphic, this._defaultEventArgs);
          },
          _updateSegments: function(a, c, f, b) {
            var d = this._map,
              t = this._wrapOffset || 0;
            h.forEach(
              a,
              function(a) {
                h.forEach(
                  a,
                  function(a) {
                    this._updatePoint(a, b, t, m, d, f, c);
                  },
                  this
                );
              },
              this
            );
          },
          _updatePoint: function(a, c, f, b, d, t, e) {
            c = d.toScreen({ x: a[0], y: a[1], spatialReference: c }, !0);
            c.x += f;
            c = b.multiplyPoint([t, e, b.invert(t)], c);
            c.x -= f;
            f = d.toMap(c);
            a[0] = f.x;
            a[1] = f.y;
          },
          _getAngle: function(a, c) {
            return (
              (180 * Math.atan2(c[0].y - c[1].y, c[0].x - c[1].x)) / Math.PI -
              (180 * Math.atan2(a[0].y - a[1].y, a[0].x - a[1].x)) / Math.PI
            );
          },
          _deNormalizePoint: function(a, c) {
            var f = this._map._getFrameWidth();
            if (-1 === f) return a;
            for (a = { x: a.x, y: a.y }; Math.abs(a.x - c.x) >= f; )
              a.x = a.x < c.x ? a.x + f : a.x - f;
            var b = Math.abs(a.x - c.x);
            Math.abs(a.x - c.x + f) < b
              ? (a.x += f)
              : Math.abs(a.x - c.x - f) < b && (a.x -= f);
            return a;
          }
        });
        b("extend-esri") && g.setObject("toolbars._Box", n, k);
        return n;
      });
    },
    "dojox/gfx/Moveable": function() {
      define("dojo/_base/lang dojo/_base/declare dojo/_base/array dojo/_base/event dojo/topic dojo/touch dojo/dom-class dojo/_base/window ./Mover dojo/mouse".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k) {
        return g("dojox.gfx.Moveable", null, {
          constructor: function(a, d) {
            this.shape = a;
            this.delay = d && 0 < d.delay ? d.delay : 0;
            this.mover = d && d.mover ? d.mover : m;
            this.leftButtonOnly = d && d.leftButtonOnly;
            this.events = [
              this.shape.on(b.press, n.hitch(this, "onMouseDown"))
            ];
          },
          destroy: function() {
            h.forEach(this.events, function(a) {
              a.remove();
            });
            this.events = this.shape = null;
          },
          onMouseDown: function(a) {
            this.delay
              ? (this.events.push(
                  this.shape.on(b.move, n.hitch(this, "onMouseMove")),
                  this.shape.on(b.release, n.hitch(this, "onMouseUp"))
                ),
                (this._lastX = a.clientX),
                (this._lastY = a.clientY))
              : (this.leftButtonOnly && !k.isLeft(a)) ||
                new this.mover(this.shape, a, this);
            l.stop(a);
          },
          onMouseMove: function(a) {
            var c = a.clientY;
            if (
              Math.abs(a.clientX - this._lastX) > this.delay ||
              Math.abs(c - this._lastY) > this.delay
            )
              this.onMouseUp(a), new this.mover(this.shape, a, this);
            l.stop(a);
          },
          onMouseUp: function(a) {
            this.events.pop().remove();
          },
          onMoveStart: function(c) {
            e.publish("/gfx/move/start", c);
            d.add(a.body(), "dojoMove");
          },
          onMoveStop: function(c) {
            e.publish("/gfx/move/stop", c);
            d.remove(a.body(), "dojoMove");
          },
          onFirstMove: function(a) {},
          onMove: function(a, b, d) {
            this.onMoving(a, b, d);
            this.shape.applyLeftTransform(b);
            this.onMoved(a, b);
          },
          onMoving: function(a, b) {},
          onMoved: function(a, b) {}
        });
      });
    },
    "dojox/gfx/Mover": function() {
      define("dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/on dojo/touch dojo/_base/event".split(
        " "
      ), function(n, g, h, l, e, b) {
        return h("dojox.gfx.Mover", null, {
          constructor: function(d, a, m) {
            this.shape = d;
            this.lastX = a.clientX;
            this.lastY = a.clientY;
            d = this.host = m;
            a = document;
            m = l(a, e.move, n.hitch(this, "onFirstMove"));
            this.events = [
              l(a, e.move, n.hitch(this, "onMouseMove")),
              l(a, e.release, n.hitch(this, "destroy")),
              l(a, "dragstart", n.hitch(b, "stop")),
              l(a, "selectstart", n.hitch(b, "stop")),
              m
            ];
            if (d && d.onMoveStart) d.onMoveStart(this);
          },
          onMouseMove: function(d) {
            var a = d.clientX,
              e = d.clientY;
            this.host.onMove(
              this,
              { dx: a - this.lastX, dy: e - this.lastY },
              d
            );
            this.lastX = a;
            this.lastY = e;
            b.stop(d);
          },
          onFirstMove: function() {
            this.host.onFirstMove(this);
            this.events.pop().remove();
          },
          destroy: function() {
            g.forEach(this.events, function(a) {
              a.remove();
            });
            var b = this.host;
            if (b && b.onMoveStop) b.onMoveStop(this);
            this.events = this.shape = null;
          }
        });
      });
    },
    "esri/toolbars/_GraphicMover": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/json dojo/dom-style dojox/gfx/Moveable dojox/gfx/Mover dojox/gfx/matrix ../kernel ../PointerEvents ../sniff ../geometry/webMercatorUtils ../geometry/ScreenPoint ../geometry/Point".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q, t) {
        var f = n(null, {
          declaredClass: "esri.toolbars._GraphicMover",
          constructor: function(a, c, f, b) {
            this.graphic = a;
            this.map = c;
            this.toolbar = f;
            this.tempPt = b;
            this._enableGraphicMover();
            this._moved = !1;
          },
          refresh: function(a) {
            var c = this.graphic.getDojoShape();
            !c ||
              (!a && c._hostGraphic) ||
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
              c = a.getDojoShape();
            c &&
              ((c._hostGraphic = a),
              (this._moveable = new b(c, { mover: f.Mover })),
              (this._moveStartHandle = h.connect(
                this._moveable,
                "onMoveStart",
                this,
                this._moveStartHandler
              )),
              (this._firstMoveHandle = h.connect(
                this._moveable,
                "onFirstMove",
                this,
                this._firstMoveHandler
              )),
              (this._movingHandle = h.connect(
                this._moveable,
                "onMoving",
                this,
                this._movingHandler
              )),
              (this._moveStopHandle = h.connect(
                this._moveable,
                "onMoveStop",
                this,
                this._moveStopHandler
              )),
              (a = c.getEventSource()) &&
                e.set(a, "cursor", this.toolbar._cursors.move));
          },
          _disableGraphicMover: function() {
            var a = this._moveable;
            if (a) {
              h.disconnect(this._moveStartHandle);
              h.disconnect(this._firstMoveHandle);
              h.disconnect(this._movingHandle);
              h.disconnect(this._moveStopHandle);
              var c = a.shape;
              c &&
                ((c._hostGraphic = null),
                (c = c.getEventSource()) && e.set(c, "cursor", "inherit"));
              a.destroy();
            }
            this._moveable = null;
          },
          _moveStartHandler: function() {
            var a = this.graphic,
              c = this.map;
            this._startTx = a.getDojoShape().getTransform();
            "point" === this.graphic.geometry.type &&
              c.snappingManager &&
              c.snappingManager._setUpSnapping();
            this.toolbar.onGraphicMoveStart(a);
          },
          _firstMoveHandler: function() {
            this.toolbar._beginOperation("MOVE");
            this.toolbar.onGraphicFirstMove(this.graphic);
          },
          _movingHandler: function(a, f, b) {
            a = a.shape.getTransform();
            f = this.map;
            var d;
            c("esri-pointer")
              ? (d = f.navigationManager.pointerEvents._processTouchEvent(b, b))
              : b &&
                "pointermove" === b.type &&
                (d = k.prototype._processTouchEvent.call({ map: f }, b, b));
            d &&
              f.snappingManager &&
              f.snappingManager._onSnappingMouseMoveHandler(d);
            this.tempPt && this.tempPt.getDojoShape().setTransform(a);
            this.toolbar.onGraphicMove(this.graphic, a);
          },
          _moveStopHandler: function(c) {
            var f = this.graphic,
              b = this.toolbar,
              d = this.map,
              e = b._geo ? p.geographicToWebMercator(f.geometry) : f.geometry,
              k = e.type,
              m = f.getDojoShape(),
              y = m.getTransform();
            if (l.toJson(y) !== l.toJson(this._startTx)) {
              this._moved = !0;
              switch (k) {
                case "point":
                  var k = [y, a.invert(this._startTx)],
                    g;
                  d.snappingManager && (g = d.snappingManager._snappingPoint);
                  e = g || d.toMap(a.multiplyPoint(k, d.toScreen(e, !0)));
                  d.snappingManager && d.snappingManager._killOffSnapping();
                  break;
                case "polyline":
                  e = this._updatePolyGeometry(e, e.paths, y);
                  break;
                case "polygon":
                  e = this._updatePolyGeometry(e, e.rings, y);
              }
              m.setTransform(null);
              f.setGeometry(b._geo ? p.webMercatorToGeographic(e, !0) : e);
              this.tempPt &&
                this.tempPt.setGeometry(new t(f.geometry.toJson()));
            } else this._moved = !1;
            b._endOperation("MOVE");
            b.onGraphicMoveStop(f, y);
            this._moved ||
              ((c = c.__e),
              (d = this.map.position),
              (c = new q(c.pageX - d.x, c.pageY - d.y)),
              b.onGraphicClick(f, {
                screenPoint: c,
                mapPoint: this.map.toMap(c)
              }));
          },
          _updatePolyGeometry: function(a, c, f) {
            var b = this.map,
              d = a.getPoint(0, 0),
              b = b.toMap(b.toScreen(d).offset(f.dx, f.dy));
            f = b.x - d.x;
            for (var d = b.y - d.y, t, e, r, b = 0; b < c.length; b++)
              for (e = c[b], t = 0; t < e.length; t++)
                (r = a.getPoint(b, t)), a.setPoint(b, t, r.offset(f, d));
            return a;
          }
        });
        f.Mover = n(d, {
          declaredClass: "esri.toolbars._Mover",
          constructor: function(a, c, f) {
            this.__e = c;
          }
        });
        c("extend-esri") &&
          (g.setObject("toolbars._GraphicMover", f, m),
          g.setObject("toolbars._Mover", f.Mover, m));
        return f;
      });
    },
    "esri/toolbars/_VertexEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/has dijit/Menu dijit/MenuItem ../kernel ./_VertexMover ../geometry/Point ../geometry/jsonUtils dojo/i18n!../nls/jsapi".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p) {
        var q = n(null, {
          declaredClass: "esri.toolbars._GraphicVertexEditor",
          constructor: function(a, c, b) {
            this.graphic = a;
            this.map = c;
            this.toolbar = b;
            a = b._options;
            this._symbol1 = a.vertexSymbol;
            this._symbol2 = a.ghostVertexSymbol;
            c = a.ghostLineSymbol;
            this._lineStroke = {
              style: c.style,
              width: c.width,
              color: c.color
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
            this._firstMoveHandle = h.connect(
              m,
              "onFirstMove",
              this,
              this._firstMoveHandler
            );
            this._moveStopHandle = h.connect(
              m,
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
            this._mouseOverHandle = h.connect(
              a,
              "onMouseOver",
              this,
              this._mouseOverHandler
            );
            this._mouseOutHandle = h.connect(
              a,
              "onMouseOut",
              this,
              this._mouseOutHandler
            );
            this._canDel &&
              ((this._ctxMenu = new b({
                style: "font-size: 12px; margin-left: 5px; margin-top: 5px;"
              })),
              (a = this._ctxDelete = new d({
                label: p.toolbars.edit.deleteLabel,
                iconClass: "vertexDeleteIcon",
                style: "outline: none;"
              })),
              (this._deleteHandle = h.connect(
                a,
                "onClick",
                this,
                this._deleteHandler
              )),
              this._ctxMenu.addChild(a),
              this._ctxMenu.startup());
          },
          _removeControllers: function() {
            h.disconnect(this._firstMoveHandle);
            h.disconnect(this._moveStopHandle);
            h.disconnect(this._mouseOverHandle);
            h.disconnect(this._mouseOutHandle);
            h.disconnect(this._deleteHandle);
            this._ctxMenu &&
              ((this._ctxDelete = null),
              this._unbindCtxNode(),
              this._ctxMenu.destroyRecursive());
            this._remove(this._vertexMovers);
            this._remove(this._mpVertexMovers);
            this._vertexMovers = this._mpVertexMovers = null;
          },
          _add: function(a, c, b) {
            var f,
              d,
              t = this.graphic,
              e = [];
            for (f = 0; f < a.length; f++) {
              var k = a[f],
                p = [];
              for (d = 0; d < k.length; d++)
                p.push(new m(k[d], c, t, f, d, k.length, this, b));
              e.push(p);
            }
            return e;
          },
          _remove: function(a) {
            a &&
              l.forEach(a, function(a) {
                l.forEach(a, function(a) {
                  a.destroy();
                });
              });
          },
          _refresh: function(a) {
            a &&
              l.forEach(a, function(a) {
                l.forEach(a, function(a) {
                  a.refresh();
                });
              });
          },
          _isNew: function(a) {
            return -1 === l.indexOf(this._vertexMovers[a.segIndex], a)
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
            var c = this._findMover(a);
            c &&
              (this.toolbar.onVertexMouseOver(this.graphic, c._getInfo()),
              c._placeholder ||
                ((this._selectedMover = c),
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
            var c,
              b = [];
            c = this._mpVertexMovers;
            l.forEach(this._vertexMovers, function(a) {
              b = b.concat(a);
            });
            c &&
              l.forEach(c, function(a) {
                b = b.concat(a);
              });
            for (c = 0; c < b.length; c++) {
              var d = b[c];
              if (d.graphic === a) return d;
            }
          },
          _firstMoveHandler: function(a) {
            !this._isNew(a) && this._canAdd && this._hideRelatedMidpoints(a);
            this.toolbar._beginOperation("VERTICES");
          },
          _moveStopHandler: function(a, c) {
            var f = this._isNew(a);
            c && (c.dx || c.dy)
              ? (this._updateRelatedGraphic(
                  a,
                  a.relatedGraphic,
                  a.graphic.geometry,
                  a.segIndex,
                  a.ptIndex,
                  a.segLength,
                  f
                ),
                this._canAdd &&
                  (f
                    ? this._addMidpoints(a)
                    : (this._repositionRelatedMidpoints(a),
                      this._showRelatedMidpoints(a))),
                this.toolbar._endOperation("VERTICES"))
              : !f && this._canAdd && this._showRelatedMidpoints(a);
          },
          _showRelatedMidpoints: function(a) {
            var c = this._getAdjacentMidpoints(a.ptIndex, a.segLength),
              b = this._mpVertexMovers[a.segIndex];
            for (a = 0; a < c.length; a++) {
              var d = b[c[a]];
              d.graphic.show();
              d.refresh();
            }
          },
          _hideRelatedMidpoints: function(a) {
            var c = this._getAdjacentMidpoints(a.ptIndex, a.segLength),
              b = this._mpVertexMovers[a.segIndex];
            for (a = 0; a < c.length; a++) b[c[a]].graphic.hide();
          },
          _repositionRelatedMidpoints: function(a) {
            var c,
              b = this._getAdjacentMidpoints(a.ptIndex, a.segLength),
              d = this._mpVertexMovers[a.segIndex];
            for (c = 0; c < b.length; c++) {
              var e = this._getAdjacentVertices(b[c], a.segLength),
                t = a.relatedGraphic.geometry.getPoint(a.segIndex, e[0]),
                e = a.relatedGraphic.geometry.getPoint(a.segIndex, e[1]),
                t = new k({
                  x: (t.x + e.x) / 2,
                  y: (t.y + e.y) / 2,
                  spatialReference: t.spatialReference.toJson()
                });
              d[b[c]].graphic.setGeometry(t);
            }
          },
          _addMidpoints: function(a) {
            var c = a.segIndex,
              b = a.ptIndex,
              d = a.segLength,
              e = b + 1,
              t,
              p = d + 1;
            this._mpVertexMovers[c].splice(b, 1);
            var q = this._vertexMovers[c];
            for (t = 0; t < e; t++) q[t].segLength += 1;
            for (t = e; t < q.length; t++)
              (q[t].ptIndex += 1), (q[t].segLength += 1);
            a.ptIndex = e;
            a.segLength = q.length + 1;
            q.splice(e, 0, a);
            a.graphic.setSymbol(this._symbol1);
            q = this._mpVertexMovers[c];
            for (t = 0; t < b; t++) q[t].segLength += 1;
            for (t = b; t < d - 1; t++)
              (q[t].ptIndex += 1), (q[t].segLength += 1);
            e = this._getAdjacentVertices(b, p);
            c = this._getAdjacentVertices(b + 1, p);
            d = a.relatedGraphic.geometry.getPoint(a.segIndex, e[0]);
            t = a.relatedGraphic.geometry.getPoint(a.segIndex, e[1]);
            e = new k({
              x: (d.x + t.x) / 2,
              y: (d.y + t.y) / 2,
              spatialReference: d.spatialReference.toJson()
            });
            d = a.relatedGraphic.geometry.getPoint(a.segIndex, c[0]);
            t = a.relatedGraphic.geometry.getPoint(a.segIndex, c[1]);
            c = new k({
              x: (d.x + t.x) / 2,
              y: (d.y + t.y) / 2,
              spatialReference: d.spatialReference.toJson()
            });
            d = new m(
              e,
              this._symbol2,
              this.graphic,
              a.segIndex,
              b,
              p,
              this,
              !0
            );
            a = new m(
              c,
              this._symbol2,
              this.graphic,
              a.segIndex,
              b + 1,
              p,
              this,
              !0
            );
            q.splice(b, 0, d, a);
          },
          _deleteVertex: function(a) {
            var c,
              b = a.ptIndex,
              d = this._vertexMovers[a.segIndex];
            for (c = 0; c < b; c++) --d[c].segLength;
            for (c = b + 1; c < d.length; c++) {
              var e = d[c];
              --e.ptIndex;
              --e.segLength;
            }
            d.splice(b, 1);
            c = a._getInfo();
            a.destroy();
            this.toolbar.onVertexDelete(this.graphic, c);
          }
        });
        g.mixin(q, {
          create: function(a, c, b) {
            switch (a.geometry.type) {
              case "multipoint":
                return new q.MultipointVertexEditor(a, c, b);
              case "polyline":
                return new q.PolylineVertexEditor(a, c, b);
              case "polygon":
                return new q.PolygonVertexEditor(a, c, b);
            }
          }
        });
        q.MultipointVertexEditor = n(q, {
          declaredClass: "esri.toolbars._MultipointVertexEditor",
          minLength: 1,
          constructor: function() {
            this._moveStartHandle = h.connect(
              m,
              "onMoveStart",
              this,
              this._moveStartHandler
            );
            h.disconnect(this._firstMoveHandle);
          },
          destroy: function() {
            this.inherited(arguments);
            h.disconnect(this._moveStartHandle);
          },
          _getSegments: function(a) {
            var c = a.points,
              b = [],
              d = a.spatialReference;
            for (a = 0; a < c.length; a++) {
              var e = c[a];
              b.push(new k({ x: e[0], y: e[1], spatialReference: d.toJson() }));
            }
            return [b];
          },
          _getMidpointSegments: function(a) {
            return [];
          },
          _getControlPoints: function(a, c, b, d, e) {
            return [];
          },
          _getGraphicsLayer: function() {
            return this.graphic._graphicsLayer;
          },
          _mouseOverHandler: function(a) {
            var c = a.graphic;
            if ((a = this._findMover(a)))
              this.toolbar.onVertexMouseOver(c, a._getInfo()),
                (this._selectedMover = a),
                this._canDel &&
                  this._bindCtxNode(a.graphic.getDojoShape().getNode());
          },
          _mouseOutHandler: function(a) {
            var c = a.graphic;
            if ((a = this._findMover(a)))
              this.toolbar.onVertexMouseOut(c, a._getInfo());
          },
          _findMover: function(a) {
            var c = [].concat(this._vertexMovers[0]),
              b = a.target;
            for (a = 0; a < c.length; a++) {
              var d = c[a];
              if (d.graphic.getDojoShape().getNode() === b) return d;
            }
          },
          _moveStartHandler: function(a) {
            var c = a.ptIndex,
              b = a.segLength - 1,
              d = a.relatedGraphic.geometry.points;
            a = d.splice(c, 1);
            d.push(a[0]);
            d = this._vertexMovers[0];
            for (a = b; a > c; a--) --d[a].ptIndex;
            a = d.splice(c, 1);
            d.push(a[0]);
            a[0].ptIndex = b;
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
          _updateRelatedGraphic: function(a, c, b, d, e, k, m, q) {
            a = c.geometry;
            q ? a.removePoint(e) : a.setPoint(e, b);
            c.setGeometry(a);
          },
          _deleteMidpoints: function(a) {}
        });
        q.PolylineVertexEditor = n(q, {
          declaredClass: "esri.toolbars._PolylineVertexEditor",
          minLength: 2,
          _getSegments: function(a) {
            var c,
              b,
              d = a.paths,
              e = [];
            for (c = 0; c < d.length; c++) {
              var k = d[c],
                m = [];
              for (b = 0; b < k.length; b++) m.push(a.getPoint(c, b));
              e.push(m);
            }
            return e;
          },
          _getMidpointSegments: function(a) {
            var c,
              b,
              d = a.paths,
              e = [],
              m = a.spatialReference;
            for (c = 0; c < d.length; c++) {
              var q = d[c],
                t = [];
              for (b = 0; b < q.length - 1; b++) {
                var p = a.getPoint(c, b),
                  g = a.getPoint(c, b + 1),
                  p = new k({
                    x: (p.x + g.x) / 2,
                    y: (p.y + g.y) / 2,
                    spatialReference: m.toJson()
                  });
                t.push(p);
              }
              e.push(t);
            }
            return e;
          },
          _getControlPoints: function(a, c, b, d, e) {
            var f = this.map,
              k,
              m;
            this._isNew(a)
              ? ((a = d),
                (d += 1),
                0 <= a && (k = f.toScreen(c.getPoint(b, a))),
                d <= e && (m = f.toScreen(c.getPoint(b, d))))
              : ((a = d - 1),
                (d += 1),
                0 <= a && (k = f.toScreen(c.getPoint(b, a))),
                d < e && (m = f.toScreen(c.getPoint(b, d))));
            return [k, m];
          },
          _getAdjacentMidpoints: function(a, c) {
            var b = [],
              f = a - 1;
            0 <= f && b.push(f);
            a < c - 1 && b.push(a);
            return b;
          },
          _getAdjacentVertices: function(a, c) {
            return [a, a + 1];
          },
          _deleteMidpoints: function(a) {
            var c = this._mpVertexMovers[a.segIndex],
              b = c.length - 1,
              d = this._getAdjacentMidpoints(a.ptIndex, a.segLength).sort(),
              e,
              q = d[0];
            for (e = 0; e < q; e++) --c[e].segLength;
            for (e = q + 1; e < c.length; e++) {
              var p = c[e];
              --p.ptIndex;
              --p.segLength;
            }
            if (1 === d.length) c.splice(q, 1)[0].destroy();
            else
              for (
                p = this._getAdjacentVertices(q, b),
                  e = a.relatedGraphic.geometry.getPoint(a.segIndex, p[0]),
                  p = a.relatedGraphic.geometry.getPoint(a.segIndex, p[1]),
                  e = new k({
                    x: (e.x + p.x) / 2,
                    y: (e.y + p.y) / 2,
                    spatialReference: e.spatialReference.toJson()
                  }),
                  a = new m(
                    e,
                    this._symbol2,
                    this.graphic,
                    a.segIndex,
                    q,
                    b,
                    this,
                    !0
                  ),
                  c = c.splice(q, d.length, a),
                  e = 0;
                e < c.length;
                e++
              )
                c[e].destroy();
          },
          _updateRelatedGraphic: function(a, b, d, e, k, m, q, p) {
            a = b.geometry;
            q
              ? a.insertPoint(e, k + 1, c.fromJson(d.toJson()))
              : p
              ? a.removePoint(e, k)
              : a.setPoint(e, k, c.fromJson(d.toJson()));
            b.setGeometry(a);
          }
        });
        q.PolygonVertexEditor = n(q, {
          declaredClass: "esri.toolbars._PolygonVertexEditor",
          minLength: 3,
          _getSegments: function(a) {
            var c,
              b,
              d = a.rings,
              e = [];
            for (c = 0; c < d.length; c++) {
              var k = d[c],
                m = [];
              for (b = 0; b < k.length - 1; b++) m.push(a.getPoint(c, b));
              e.push(m);
            }
            return e;
          },
          _getMidpointSegments: function(a) {
            var c,
              b,
              d = a.rings,
              e = [],
              m = a.spatialReference;
            for (c = 0; c < d.length; c++) {
              var q = d[c],
                p = [];
              for (b = 0; b < q.length - 1; b++) {
                var g = a.getPoint(c, b),
                  t = a.getPoint(c, b + 1),
                  g = new k({
                    x: (g.x + t.x) / 2,
                    y: (g.y + t.y) / 2,
                    spatialReference: m.toJson()
                  });
                p.push(g);
              }
              e.push(p);
            }
            return e;
          },
          _getControlPoints: function(a, c, b, d, e) {
            var f = this.map;
            this._isNew(a)
              ? (a = d)
              : ((a = d - 1), (a = 0 > a ? (e + a) % e : a));
            d = (d + 1) % e;
            e = f.toScreen(c.getPoint(b, a));
            c = f.toScreen(c.getPoint(b, d));
            return [e, c];
          },
          _getAdjacentMidpoints: function(a, c) {
            var b = a - 1;
            return [0 > b ? (c + b) % c : b, a];
          },
          _getAdjacentVertices: function(a, c) {
            return [a, (a + 1) % c];
          },
          _deleteMidpoints: function(a) {
            var c = a.ptIndex,
              b = this._mpVertexMovers[a.segIndex],
              d = b.length - 1,
              e = this._getAdjacentMidpoints(c, a.segLength).sort(),
              q,
              p;
            p = e[0];
            var g = e[e.length - 1];
            if (0 === c)
              for (
                q = this._getAdjacentVertices(d - 1, d),
                  c = a.relatedGraphic.geometry.getPoint(a.segIndex, q[0]),
                  q = a.relatedGraphic.geometry.getPoint(a.segIndex, q[1]),
                  c = new k({
                    x: (c.x + q.x) / 2,
                    y: (c.y + q.y) / 2,
                    spatialReference: c.spatialReference.toJson()
                  }),
                  a = new m(
                    c,
                    this._symbol2,
                    this.graphic,
                    a.segIndex,
                    d - 1,
                    d,
                    this,
                    !0
                  ),
                  b.splice(g, 1, a)[0].destroy(),
                  b.splice(p, 1)[0].destroy(),
                  e = 0;
                e < b.length - 1;
                e++
              )
                (p = b[e]), --p.ptIndex, --p.segLength;
            else {
              q = this._getAdjacentVertices(p, d);
              c = a.relatedGraphic.geometry.getPoint(a.segIndex, q[0]);
              q = a.relatedGraphic.geometry.getPoint(a.segIndex, q[1]);
              c = new k({
                x: (c.x + q.x) / 2,
                y: (c.y + q.y) / 2,
                spatialReference: c.spatialReference.toJson()
              });
              a = new m(
                c,
                this._symbol2,
                this.graphic,
                a.segIndex,
                p,
                d,
                this,
                !0
              );
              g = b.splice(p, e.length, a);
              for (e = 0; e < g.length; e++) g[e].destroy();
              for (e = 0; e < p; e++) --b[e].segLength;
              for (e = p + 1; e < b.length; e++)
                (p = b[e]), --p.ptIndex, --p.segLength;
            }
          },
          _updateRelatedGraphic: function(a, b, d, e, k, m, q, p) {
            a = b.geometry;
            q
              ? a.insertPoint(e, k + 1, c.fromJson(d.toJson()))
              : p
              ? (a.removePoint(e, k),
                0 === k &&
                  a.setPoint(e, m - 1, c.fromJson(a.getPoint(e, 0).toJson())))
              : (a.setPoint(e, k, c.fromJson(d.toJson())),
                0 === k && a.setPoint(e, m, c.fromJson(d.toJson())));
            b.setGeometry(a);
          }
        });
        e("extend-esri") &&
          (g.setObject("toolbars._GraphicVertexEditor", q, a),
          g.setObject(
            "toolbars._MultipointVertexEditor",
            q.MultipointVertexEditor,
            a
          ),
          g.setObject(
            "toolbars._PolylineVertexEditor",
            q.PolylineVertexEditor,
            a
          ),
          g.setObject(
            "toolbars._PolygonVertexEditor",
            q.PolygonVertexEditor,
            a
          ));
        return q;
      });
    },
    "esri/toolbars/_VertexMover": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/sniff dojo/dom-style dojox/gfx/Moveable dojox/gfx/matrix ../kernel ../PointerEvents ../sniff ../geometry/Point ../graphic ../geometry/webMercatorUtils".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q) {
        n = n(null, {
          declaredClass: "esri.toolbars.VertexMover",
          constructor: function(a, c, b, d, e, k, m, q) {
            this.point = a;
            this.symbol = c;
            this.relatedGraphic = b;
            this.segIndex = d;
            this.ptIndex = e;
            this.segLength = k;
            this.editor = m;
            this.map = m.map;
            this._scratchGL = m.toolbar._scratchGL;
            this._placeholder = q || !1;
            this._type = b.geometry.type;
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
            var a = new c(this.point.toJson()),
              a = new p(a, this.symbol);
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
                e.set(
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
              h.disconnect(this._startHandle);
              h.disconnect(this._firstHandle);
              h.disconnect(this._movingHandle);
              h.disconnect(this._stopHandle);
              var c = a.shape;
              c && (c = c.getEventSource()) && e.set(c, "cursor", "inherit");
              a.destroy();
              this._moveable = null;
            }
          },
          _needRefresh: function() {
            var a = this.graphic.getDojoShape(),
              c = !1;
            if (a)
              switch (this._type) {
                case "multipoint":
                  var b = this.relatedGraphic.getDojoShape();
                  b &&
                    ((b = b.children[this.ptIndex]),
                    a !== b && ((this.graphic._shape = b), (c = !0)));
                  break;
                case "polyline":
                case "polygon":
                  c = !a._hasMover;
              }
            return c;
          },
          _getMoveable: function(a) {
            a = new b(
              a,
              l("mac") && l("ff") && !k("esri-touch") && { leftButtonOnly: !0 }
            );
            this._startHandle = h.connect(
              a,
              "onMoveStart",
              this,
              this._moveStartHandler
            );
            this._firstHandle = h.connect(
              a,
              "onFirstMove",
              this,
              this._firstMoveHandler
            );
            this._movingHandle = h.connect(
              a,
              "onMoving",
              this,
              this._movingHandler
            );
            this._stopHandle = h.connect(
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
            var c = this.map;
            c.snappingManager && c.snappingManager._setUpSnapping();
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
            var c = a.shape,
              b = this._getControlEdges(),
              d = this._scratchGL._div,
              e,
              k = [],
              m = a.host.shape._wrapOffsets[0] || 0;
            for (e = 0; e < b.length; e++) {
              var q = b[e];
              q.x1 += m;
              q.x2 += m;
              k.push([
                d
                  .createLine({ x1: q.x1, y1: q.y1, x2: q.x2, y2: q.y2 })
                  .setStroke(this.editor._lineStroke),
                q.x1,
                q.y1,
                q.x2,
                q.y2
              ]);
            }
            c._lines = k;
            a.shape.moveToFront();
            this.constructor.onFirstMove(this);
            this.editor.toolbar.onVertexFirstMove(
              this.relatedGraphic,
              this._getInfo()
            );
          },
          _movingHandler: function(a, c, b) {
            c = this.map;
            var d;
            k("esri-pointer")
              ? (d = c.navigationManager.pointerEvents._processTouchEvent(b, b))
              : b &&
                "pointermove" === b.type &&
                (d = m.prototype._processTouchEvent.call({ map: c }, b, b));
            d &&
              c.snappingManager &&
              c.snappingManager._onSnappingMouseMoveHandler(d);
            b = a.shape;
            a = b.getTransform();
            b = b._lines;
            for (d = 0; d < b.length; d++)
              (c = b[d]),
                c[0].setShape({
                  x1: c[1] + a.dx,
                  y1: c[2] + a.dy,
                  x2: c[3],
                  y2: c[4]
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
              b = a.getTransform(),
              e = this.map,
              k = this.graphic,
              m = c._geo ? q.geographicToWebMercator(k.geometry) : k.geometry;
            c._activateScrollWheel();
            var p,
              g = a._lines;
            if (g) {
              for (p = 0; p < g.length; p++) g[p][0].removeShape();
              a._lines = null;
            }
            p = !1;
            var g = !0,
              v = this._getInfo();
            b && (b.dx || b.dy)
              ? this._placeholder && ((this._placeholder = !1), (p = !0))
              : (g = !1);
            var l;
            e.snappingManager && (l = e.snappingManager._snappingPoint);
            var h = [b, d.invert(this._startTx)];
            l = l || e.toMap(d.multiplyPoint(h, e.toScreen(m, !0)));
            e.snappingManager && e.snappingManager._killOffSnapping();
            a.setTransform(null);
            k.setGeometry(c._geo ? q.webMercatorToGeographic(l, !0) : l);
            this.constructor.onMoveStop(this, b);
            c.onVertexMoveStop(this.relatedGraphic, v, b);
            if (!g) c.onVertexClick(this.relatedGraphic, v);
            if (p) c.onVertexAdd(this.relatedGraphic, this._getInfo());
          },
          _getControlEdges: function() {
            var a = this.map,
              c = this.relatedGraphic.geometry,
              b = this.segIndex,
              d = this.ptIndex,
              e = this.segLength,
              k = this._scratchGL.getNavigationTransform(),
              m = k.dx,
              k = k.dy,
              q = a.toScreen(this.graphic.geometry),
              a = q.x - m,
              q = q.y - k,
              p = [],
              c = this.editor._getControlPoints(this, c, b, d, e);
            c[0] && p.push({ x1: a, y1: q, x2: c[0].x - m, y2: c[0].y - k });
            c[1] && p.push({ x1: a, y1: q, x2: c[1].x - m, y2: c[1].y - k });
            return p;
          }
        });
        k("extend-esri") && g.setObject("toolbars.VertexMover", n, a);
        g.mixin(n, {
          onMoveStart: function() {},
          onFirstMove: function() {},
          onMoveStop: function() {}
        });
        return n;
      });
    },
    "esri/toolbars/TextEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/event dojo/has dojo/dom-construct dojo/dom-class dojo/dom-style dojo/keys ../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k) {
        n = n(null, {
          declaredClass: "esri.toolbars.TextEditor",
          constructor: function(a, b, d) {
            this._graphic = a;
            this._map = b;
            this._toolbar = d;
            this._enable(this._graphic);
          },
          destroy: function() {
            this._disable();
          },
          onEditStart: function() {},
          onEditEnd: function() {},
          _enable: function(a) {
            this._editBox
              ? (h.disconnect(this._addEditBoxHandler),
                (this._addEditBoxHandler = null))
              : (this._map.navigationManager.setImmediateClick(!0),
                (this._addEditBoxHandler = h.connect(
                  a.getLayer(),
                  "onDblClick",
                  this,
                  function(c) {
                    this._map.navigationManager.setImmediateClick(!1);
                    c.graphic == a &&
                      (l.stop(c),
                      h.disconnect(this._addEditBoxHandler),
                      (this._addEditBoxHandler = null),
                      this._addTextBox(a));
                  }
                )));
          },
          _disable: function() {
            this._applyEdit();
            this._addEditBoxHandler &&
              (h.disconnect(this._addEditBoxHandler),
              (this._addEditBoxHandler = null));
            this._removeTextBox();
            this.onEditEnd(this._graphic);
            this._toolbar.onTextEditEnd(this._graphic);
          },
          _addTextBox: function(c, e) {
            if (!this._editBox) {
              var k;
              c.symbol.text ||
                ((c.symbol.text = "Tempt text"),
                c.setSymbol(c.symbol),
                (k = ""));
              var p = this._createInputTextStyle(c, this._map);
              "" !== k && (k = e || c.symbol.text);
              this._editBox = b.create("input", { type: "text", value: k });
              a.set(this._editBox, p);
              d.add(this._editBox, "esriTextEditorInput");
              this._map.container.appendChild(this._editBox);
              this._editBox.focus();
              this._editBoxKeyHandler = h.connect(
                this._editBox,
                "onkeyup",
                g.hitch(this, function(a) {
                  (a.keyCode != m.ENTER && a.keyCode !== m.TAB) ||
                    this._disable();
                })
              );
              this._editBoxBlurHandler = h.connect(
                this._editBox,
                "onblur",
                g.hitch(this, function(a) {
                  this._disable();
                })
              );
              c.symbol.text = "";
              c.setSymbol(c.symbol);
              c.hide();
              var f = this._editBox;
              this._disableBoxHandler ||
                (this._disableBoxHandler = this._map.on(
                  "zoom-start",
                  g.hitch(this, function() {
                    this._disable();
                  })
                ));
              this._moveBoxHandler = this._map.on("pan", function(c) {
                a.set(f, {
                  left: this._editBoxLeft + c.delta.x + "px",
                  top: this._editBoxTop + c.delta.y + "px"
                });
              });
              this._moveBoxStartHandler = this._map.on("pan-start", function() {
                this._editBoxLeft = parseFloat(a.get(f, "left"));
                this._editBoxTop = parseFloat(a.get(f, "top"));
              });
              this.onEditStart(c, this._editBox);
              this._toolbar.onTextEditStart(c, this._editBox);
            }
          },
          _removeTextBox: function() {
            this._editBoxBlurHandler &&
              (h.disconnect(this._editBoxBlurHandler),
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
              (h.disconnect(this._editBoxKeyHandler),
              (this._editBoxKeyHandler = null));
          },
          _createInputTextStyle: function(a, b) {
            b = a.getDojoShape().getTransformedBoundingBox();
            var c = a.getLayer(),
              c = c.hasLocalNavigationTransform()
                ? { dx: 0, dy: 0 }
                : c.getNavigationTransform(),
              d = a.symbol.font;
            return {
              "font-family": d.family,
              "font-size": d.size + "px",
              "font-style": d.style,
              "font-variant": d.variant,
              "font-weight": d.weight,
              left: b[0].x + c.dx + "px",
              top: b[0].y + c.dy + "px",
              width:
                Math.abs(b[0].x - b[1].x) /
                  Math.cos((a.symbol.angle / 180) * Math.PI) +
                "px"
            };
          },
          _applyEdit: function() {
            if (this._editBox)
              if (this._editBox.value) {
                this._graphic.show();
                var a = this._graphic.symbol;
                a.text = this._editBox.value;
                this._graphic.setSymbol(a);
              } else this._graphic.getLayer().remove(this._graphic);
          }
        });
        e("extend-esri") && g.setObject("toolbars.TextEditor", n, k);
        return n;
      });
    },
    "esri/dijit/AttributeInspector": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/sniff dojo/_base/kernel dojo/has dojo/dom-style dojo/dom-construct ../kernel ../lang ../domUtils ../layers/InheritedDomain ../layers/FeatureLayer dojo/i18n!../nls/jsapi dojo/fx dojox/gfx dijit/_Widget dijit/_Templated dijit/Editor dijit/_editor/plugins/LinkDialog dijit/_editor/plugins/TextColor ./_EventedWidget ./editing/AttachmentEditor ./editing/Util ../tasks/query dijit/form/DateTextBox dijit/form/TextBox dijit/form/NumberTextBox dijit/form/FilteringSelect dijit/form/NumberSpinner dijit/form/Button dijit/form/SimpleTextarea dijit/form/ValidationTextBox dijit/form/TimeTextBox dijit/Tooltip dojo/data/ItemFileReadStore dojox/date/islamic dojox/date/islamic/Date dojox/date/islamic/locale dojo/text!./templates/AttributeInspector.html".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H,
        D,
        G,
        E,
        J,
        F,
        A,
        K,
        L,
        P,
        Q,
        M,
        O,
        R,
        I,
        U,
        S
      ) {
        var N = n([w, r, C], {
          declaredClass: "esri.dijit.AttributeInspector",
          widgetsInTemplate: !0,
          templateString: S,
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
          constructor: function(a, c) {
            g.mixin(this, f.widgets.attributeInspector);
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
            this._layerInfos = h.filter(this._layerInfos, function(a) {
              return !a.disableAttributeUpdate;
            });
            this._hideNavButtons = a.hideNavButtons || !1;
          },
          postCreate: function() {
            if (
              h.every(this._layerInfos, function(a) {
                return a.featureLayer.loaded;
              })
            )
              this._initLayerInfos(),
                this._createAttachmentEditor(),
                this.onFirstFeature();
            else {
              var a = this._layerInfos.length;
              h.forEach(
                this._layerInfos,
                function(c) {
                  c = c.featureLayer;
                  if (c.loaded) a--;
                  else
                    var b = l.connect(c, "onLoad", this, function(c) {
                      l.disconnect(b);
                      b = null;
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
            h.forEach(this._aiConnects, l.disconnect);
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
          showFeature: function(a, c) {
            c && (this._createOnlyFirstTime = !0);
            this._updateSelection([a], c);
            this._updateUI();
          },
          onLayerSelectionChange: function(a, c, b) {
            this._createOnlyFirstTime = !1;
            this._featureIdx = b === t.SELECTION_NEW ? 0 : this._featureIdx;
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
          onLayerUpdateEnd: function(a, c, b, d) {},
          onLayerError: function(a, c, b, d) {},
          onLayerEditsError: function(a, c, b, d) {},
          onLayerEditsComplete: function(a, c, b, d) {
            d = d || [];
            if (d.length) {
              var f = this._selection,
                e = a.featureLayer.objectIdField;
              h.forEach(
                d,
                g.hitch(this, function(a) {
                  h.some(
                    f,
                    g.hitch(this, function(c, b) {
                      if (c.attributes[e] !== a.objectId) return !1;
                      this._selection.splice(b, 1);
                      return !0;
                    })
                  );
                })
              );
            }
            c = c || [];
            c.length &&
              ((this._selection = H.findFeatures(c, a.featureLayer)),
              (this._featureIdx = 0));
            d = this._numFeatures = (this._selection = H.sortFeaturesById(
              this._layerInfos,
              this._selection
            ))
              ? this._selection.length
              : 0;
            if (c.length) {
              if ((c = d ? this._selection[this._featureIdx] : null))
                (d = c.getLayer().getEditCapabilities()),
                  (d.canCreate && !d.canUpdate) || this._showFeature(c);
              this._updateUI();
            }
            b = b || [];
            if (b.length) {
              var k = this._rollbackInfo;
              h.forEach(
                b,
                function(c) {
                  var d = H.findFeatures(b, a.featureLayer)[0];
                  if (
                    !c.success &&
                    d.attributes[a.featureLayer.objectIdField] === c.objectId &&
                    k
                  ) {
                    var f = k.field;
                    c = k.graphic.attributes[f.name];
                    var e = h.filter(
                      this._currentLInfo.fieldInfos,
                      function(a) {
                        return a.fieldName === f.name;
                      },
                      this
                    )[0].dijit;
                    d.attributes[f.name] = c;
                    "esriFieldTypeDate" === f.type && (c = new Date(c));
                    this._setValue(e, c);
                  }
                },
                this
              );
            }
            this._rollbackInfo = null;
          },
          onFieldValueChange: function(a, c) {
            var b = a.field,
              d = a.dijit,
              f = this._currentFeature,
              e = this._currentLInfo,
              k = b.name;
            a = this._isFieldRequired(b, a);
            if (
              "" === d.displayedValue ||
              "dijit.form.ValidationTextBox" !== d.declaredClass ||
              d.isValid()
            )
              if (
                "" !== d.displayedValue &&
                d.displayedValue !== c &&
                d.isValid &&
                !d.isValid()
              )
                this._setValue(d, f.attributes[b.name]);
              else {
                var m = !(
                  "esriFieldTypeInteger" !== b.type &&
                  "esriFieldTypeSmallInteger" !== b.type &&
                  "esriFieldTypeSingle" !== b.type &&
                  "esriFieldTypeDouble" !== b.type
                );
                if (
                  a &&
                  (null === c ||
                    "" === c ||
                    "undefined" === typeof c ||
                    (m && isNaN(c)))
                ) {
                  k = f.attributes[b.name];
                  if (
                    "esriFieldTypeDate" === b.type &&
                    ((k = new Date(k)), d instanceof Array)
                  ) {
                    this._setValue(d[0], k);
                    this._setValue(d[1], k);
                    return;
                  }
                  this._setValue(d, k);
                } else {
                  if (m) {
                    if (isNaN(c) || "" === c) c = null;
                    m && null !== c && (c = Number(c));
                  }
                  "esriFieldTypeDate" === b.type &&
                    (d instanceof Array
                      ? ((c = d[0].getValue()),
                        (d = d[1].getValue()),
                        (c =
                          c && d
                            ? new Date(
                                c.getFullYear(),
                                c.getMonth(),
                                c.getDate(),
                                d.getHours(),
                                d.getMinutes(),
                                d.getSeconds(),
                                d.getMilliseconds()
                              )
                            : c || d || null))
                      : ((c = d.getValue()), b.domain && (c = Number(c))),
                    (c =
                      c && c.getTime
                        ? c.getTime()
                        : c && c.toGregorian
                        ? c.toGregorian().getTime()
                        : c));
                  if (this._currentFeature.attributes[b.name] !== c) {
                    if (k === e.typeIdField) {
                      var A = this._findFirst(e.types, "id", c);
                      h.forEach(
                        e.fieldInfos,
                        function(a) {
                          (b = a.field) &&
                            b.name !== e.typeIdField &&
                            ((a = a.dijit),
                            this._setFieldDomain(a, A, b) &&
                              a &&
                              (this._setValue(a, f.attributes[b.name] + ""),
                              !1 === a.isValid() && this._setValue(a, null)));
                        },
                        this
                      );
                    }
                    this.onAttributeChange(f, k, c);
                  }
                }
              }
            else this._setValue(d, f.attributes[b.name]);
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
            h.forEach(a, this._initLayerInfo, this);
          },
          _initLayerInfo: function(a) {
            var b = a.featureLayer,
              d,
              f;
            this._userIds = {};
            f = b.id;
            b.credential && (this._userIds[f] = b.credential.userId);
            a.userId && (this._userIds[f] = a.userId);
            this._connect(
              b,
              "onSelectionComplete",
              g.hitch(this, "onLayerSelectionChange", a)
            );
            this._connect(
              b,
              "onSelectionClear",
              g.hitch(this, "onLayerSelectionClear", a)
            );
            this._connect(
              b,
              "onEditsComplete",
              g.hitch(this, "onLayerEditsComplete", a)
            );
            this._connect(b, "error", g.hitch(this, "onLayerError", a));
            this._connect(
              b,
              "onUpdateEnd",
              g.hitch(this, "onLayerUpdateEnd", a)
            );
            a.showAttachments = b.hasAttachments
              ? c.isDefined(a.showAttachments)
                ? a.showAttachments
                : !0
              : !1;
            a.hideFields = a.hideFields || [];
            a.htmlFields = a.htmlFields || [];
            a.isEditable = b.isEditable()
              ? c.isDefined(a.isEditable)
                ? a.isEditable
                : !0
              : !1;
            a.typeIdField = b.typeIdField;
            a.layerId = b.id;
            a.types = b.types;
            b.globalIdField &&
              ((d = this._findFirst(
                a.fieldInfos,
                "fieldName",
                b.globalIdField
              )) ||
                a.showGlobalID ||
                a.hideFields.push(b.globalIdField));
            (f = this._findFirst(a.fieldInfos, "fieldName", b.objectIdField)) ||
              a.showObjectID ||
              a.hideFields.push(b.objectIdField);
            var e = this._getFields(a.featureLayer);
            if (e) {
              var k = a.fieldInfos || [],
                k = h.map(k, function(a) {
                  return g.mixin({}, a);
                });
              k.length
                ? (a.fieldInfos = h.filter(
                    h.map(
                      k,
                      g.hitch(this, function(c) {
                        var b =
                          c.stringFieldOption ||
                          (this._isInFields(c.fieldName, a.htmlFields)
                            ? N.STRING_FIELD_OPTION_RICHTEXT
                            : N.STRING_FIELD_OPTION_TEXTBOX);
                        return g.mixin(c, {
                          field: this._findFirst(e, "name", c.fieldName),
                          stringFieldOption: b
                        });
                      })
                    ),
                    "return item.field;"
                  ))
                : ((e = h.filter(
                    e,
                    g.hitch(this, function(c) {
                      return !this._isInFields(c.name, a.hideFields);
                    })
                  )),
                  (a.fieldInfos = h.map(
                    e,
                    g.hitch(this, function(c) {
                      var b = this._isInFields(c.name, a.htmlFields)
                        ? N.STRING_FIELD_OPTION_RICHTEXT
                        : N.STRING_FIELD_OPTION_TEXTBOX;
                      return {
                        fieldName: c.name,
                        field: c,
                        stringFieldOption: b
                      };
                    })
                  )));
              a.showGlobalID &&
                !d &&
                k.push(this._findFirst(e, "name", b.globalIdField));
              a.showObjectID &&
                !f &&
                k.push(this._findFirst(e, "name", b.objectIdField));
              d = [];
              b.editFieldsInfo &&
                (b.editFieldsInfo.creatorField &&
                  d.push(b.editFieldsInfo.creatorField),
                b.editFieldsInfo.creationDateField &&
                  d.push(b.editFieldsInfo.creationDateField),
                b.editFieldsInfo.editorField &&
                  d.push(b.editFieldsInfo.editorField),
                b.editFieldsInfo.editDateField &&
                  d.push(b.editFieldsInfo.editDateField));
              this._editorTrackingInfos[b.id] = d;
            }
          },
          _createAttachmentEditor: function() {
            this._attachmentEditor = null;
            var a = h.filter(this._layerInfos, function(a) {
              return a.showAttachments;
            });
            a &&
              a.length &&
              ((this._attachmentEditor = new z(
                { class: this.css.attachmentEditor },
                this.attachmentEditor
              )),
              this._attachmentEditor.startup());
          },
          _setCurrentLInfo: function(a) {
            var c = this._currentLInfo ? this._currentLInfo.featureLayer : null,
              b = a.featureLayer;
            if (
              c &&
              c.id === b.id &&
              !c.ownershipBasedAccessControlForFeatures &&
              ((c = b.getEditCapabilities()), !c.canCreate || c.canUpdate)
            )
              return;
            this._currentLInfo = a;
            this._createTable();
          },
          _updateSelection: function(a, c) {
            this._selection = a || [];
            h.forEach(this._layerInfos, this._getSelection, this);
            this._selection = H.sortFeaturesById(
              this._layerInfos,
              this._selection
            );
            this._numFeatures = this._selection.length;
            this._showFeature(
              this._numFeatures ? this._selection[this._featureIdx] : null,
              c
            );
          },
          _getSelection: function(a) {
            a = a.featureLayer.getSelectedFeatures();
            this._selection = this._selection.concat(a);
          },
          _updateUI: function() {
            var b = this._numFeatures,
              d = this._currentLInfo;
            this.layerName.innerHTML =
              d && 0 !== b
                ? d.featureLayer
                  ? d.featureLayer.name
                  : ""
                : this.NLS_noFeaturesSelected;
            a.set(this.attributeTable, "display", b ? "" : "none");
            a.set(this.editButtons, "display", b ? "" : "none");
            a.set(
              this.navButtons,
              "display",
              !this._hideNavButtons && 1 < b ? "" : "none"
            );
            this.navMessage.innerHTML = c.substitute(
              {
                idx: this._featureIdx + 1,
                of: this.NLS_of,
                numFeatures: this._numFeatures
              },
              this._navMessage
            );
            this._attachmentEditor &&
              a.set(
                this._attachmentEditor.domNode,
                "display",
                d && d.showAttachments && b ? "" : "none"
              );
            a.set(
              this.deleteBtn.domNode,
              "display",
              (d && !1 === d.showDeleteButton) || !this._canDelete ? "none" : ""
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
          _showFeature: function(a, b) {
            if (a) {
              this._currentFeature = a;
              b = b ? b : a.getLayer();
              var d = b.getEditCapabilities({
                feature: a,
                userId: this._userIds[b.id]
              });
              this._canUpdate = d.canUpdate;
              this._canDelete = d.canDelete;
              if ((d = this._getLInfoFromFeatureLayer(b))) {
                this._setCurrentLInfo(d);
                var f = a.attributes,
                  e = this._findFirst(d.types, "id", f[d.typeIdField]),
                  k = null;
                h.forEach(
                  d.fieldInfos,
                  function(a) {
                    k = a.field;
                    var b = [];
                    a.dijit && 1 < a.dijit.length
                      ? h.forEach(a.dijit, function(a) {
                          b.push(a);
                        })
                      : b.push(a.dijit);
                    h.forEach(
                      b,
                      g.hitch(this, function(a) {
                        if (a) {
                          var b = this._setFieldDomain(a, e, k),
                            d = f[k.name],
                            d =
                              d && b && b.codedValues && b.codedValues.length
                                ? b.codedValues[d]
                                  ? b.codedValues[d].name
                                  : d
                                : d;
                          c.isDefined(d) || (d = "");
                          "dijit.form.DateTextBox" === a.declaredClass ||
                          "dijit.form.TimeTextBox" === a.declaredClass
                            ? (d = "" === d ? null : new Date(d))
                            : "dijit.form.FilteringSelect" ===
                                a.declaredClass &&
                              ((a._lastValueReported = null),
                              (d = f[k.name] + ""));
                          try {
                            this._setValue(a, d),
                              "dijit.form.FilteringSelect" ===
                                a.declaredClass &&
                                !1 === a.isValid() &&
                                this._setValue(a, null);
                          } catch (V) {
                            a.set("displayedValue", this.NLS_errorInvalid, !1);
                          }
                        }
                      })
                    );
                  },
                  this
                );
                this._attachmentEditor &&
                  d.showAttachments &&
                  this._attachmentEditor.showAttachments(
                    this._currentFeature,
                    b
                  );
                (a = b.getEditSummary(a))
                  ? ((this.editorTrackingInfoDiv.innerHTML = a),
                    p.show(this.editorTrackingInfoDiv))
                  : p.hide(this.editorTrackingInfoDiv);
              }
            }
          },
          _setFieldDomain: function(a, b, d) {
            if (!a) return null;
            var f = d.domain;
            b &&
              b.domains &&
              b.domains[d.name] &&
              !1 === b.domains[d.name] instanceof q &&
              (f = b.domains[d.name]);
            if (!f) return null;
            f.codedValues && 0 < f.codedValues.length
              ? (a.set(
                  "store",
                  this._toStore(
                    h.map(f.codedValues, function(a) {
                      return { id: (a.code += ""), name: a.name };
                    })
                  )
                ),
                this._setValue(a, f.codedValues[0].code))
              : ((a.constraints = {
                  min: c.isDefined(f.minValue) ? f.minValue : Number.MIN_VALUE,
                  max: c.isDefined(f.maxValue) ? f.maxValue : Number.MAX_VALUE
                }),
                this._setValue(a, a.constraints.min));
            return f;
          },
          _setValue: function(a, c) {
            a.set &&
              ((a._onChangeActive = !1),
              a.set("value", c, !0),
              (a._onChangeActive = !0));
          },
          _getFields: function(a) {
            var b = a._getOutFields();
            if (!b) return null;
            a = a.fields;
            return "*" == b
              ? a
              : h.filter(
                  h.map(b, g.hitch(this, "_findFirst", a, "name")),
                  c.isDefined
                );
          },
          _isInFields: function(a, c) {
            return a && (c || c.length)
              ? h.some(c, function(c) {
                  return c.toLowerCase() === a.toLowerCase();
                })
              : !1;
          },
          _isFieldNullable: function(a, c) {
            return !(!1 === a.nullable || (c.field && !1 === c.field.nullable));
          },
          _isFieldRequired: function(a, c) {
            return (
              !1 !== a.editable &&
              !1 !== c.isEditable &&
              !this._isFieldNullable(a, c)
            );
          },
          _findFirst: function(a, c, b) {
            return (a = h.filter(a, function(a) {
              return a.hasOwnProperty(c) && a[c] === b;
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
            this._attributes = m.create(
              "table",
              { cellspacing: "0", cellpadding: "0" },
              this.attributeTable
            );
            var a = m.create("tbody", null, this._attributes),
              c = this._currentLInfo,
              b = this._findFirst(
                c.types,
                "id",
                this._currentFeature.attributes[c.typeIdField]
              );
            h.forEach(c.fieldInfos, g.hitch(this, "_createField", b, a), this);
            this._createOnlyFirstTime = !1;
          },
          _createField: function(a, c, b) {
            var d = this._currentLInfo,
              f = b.field;
            if (
              !this._isInFields(f.name, d.hideFields) &&
              !this._isInFields(
                f.name,
                this._editorTrackingInfos[d.featureLayer.id]
              )
            ) {
              var e = !1,
                k,
                A,
                q;
              c = m.create("tr", null, c);
              k = m.create(
                "td",
                {
                  innerHTML: b.label || f.alias || f.name,
                  class: this.css.label,
                  "data-fieldname": f.name
                },
                c
              );
              this._isFieldRequired(f, b) &&
                m.create("span", { class: this.css.red, innerHTML: " *" }, k);
              c = m.create("td", null, c);
              if (b.customField)
                m.place(
                  b.customField.domNode || b.customField,
                  m.create("div", null, c),
                  "first"
                ),
                  (A = b.customField);
              else if (
                !1 === d.isEditable ||
                !1 === f.editable ||
                !1 === b.isEditable ||
                "esriFieldTypeOID" === f.type ||
                "esriFieldTypeGlobalID" === f.type ||
                (!this._canUpdate && !this._createOnlyFirstTime)
              )
                e = !0;
              d =
                d.typeIdField &&
                f.name.toLowerCase() == d.typeIdField.toLowerCase();
              k = !!this._getDomainForField(f, a);
              !A && d
                ? (A = this._createTypeField(f, b, c))
                : !A && k && (A = this._createDomainField(f, b, a, c));
              if (!A)
                switch (f.type) {
                  case "esriFieldTypeString":
                    A = this._createStringField(f, b, c);
                    break;
                  case "esriFieldTypeDate":
                    A = this._createDateField(f, b, c);
                    b.format &&
                      b.format.time &&
                      (q = this._createTimeField(f, b, c));
                    break;
                  case "esriFieldTypeInteger":
                  case "esriFieldTypeSmallInteger":
                    A = this._createIntField(f, b, c);
                    break;
                  case "esriFieldTypeSingle":
                  case "esriFieldTypeDouble":
                    A = this._createFltField(f, b, c);
                    break;
                  default:
                    A = this._createStringField(f, b, c);
                }
              b.tooltip &&
                b.tooltip.length &&
                this._toolTips.push(
                  new M({ connectId: [A.id], label: b.tooltip })
                );
              A.onChange = g.hitch(this, "onFieldValueChange", b);
              A.set("disabled", e);
              q
                ? ((b.dijit = [A, q]),
                  (q.onChange = g.hitch(this, "onFieldValueChange", b)),
                  q.set("disabled", e))
                : (b.dijit = A);
            }
          },
          _createTypeField: function(a, c, b) {
            b = m.create("div", null, b);
            var d = a.domain;
            return d && "range" === d.type && d.minValue === d.maxValue
              ? new P(
                  {
                    class: this.css.field,
                    trim: !0,
                    maxLength: a.length,
                    name: a.alias || a.name,
                    required: this._isFieldRequired(a, c)
                  },
                  b
                )
              : new F(
                  {
                    class: this.css.field,
                    name: a.alias || a.name,
                    required: this._isFieldRequired(a, c),
                    store: this._toStore(
                      h.map(this._currentLInfo.types, function(a) {
                        return { id: a.id, name: a.name };
                      })
                    ),
                    searchAttr: "name"
                  },
                  b
                );
          },
          _getDomainForField: function(a, c) {
            var b = a.domain;
            (a = a.name) &&
              c &&
              c.domains &&
              c.domains[a] &&
              !1 === c.domains[a] instanceof q &&
              (b = c.domains[a]);
            return b || null;
          },
          _createDomainField: function(a, c, b, d) {
            b = this._getDomainForField(a, b);
            d = m.create("div", null, d);
            return b.codedValues
              ? new F(
                  {
                    class: this.css.field,
                    name: a.alias || a.name,
                    searchAttr: "name",
                    required: this._isFieldRequired(a, c)
                  },
                  d
                )
              : new A({ class: this.css.field }, d);
          },
          _createStringField: function(a, c, b) {
            b = m.create("div", null, b);
            var d = {
              trim: !0,
              maxLength: a.length,
              required: this._isFieldRequired(a, c)
            };
            if (c.stringFieldOption === N.STRING_FIELD_OPTION_TEXTAREA)
              return (
                (d["class"] = this.css.field + " " + this.css.textArea),
                new L(d, b)
              );
            if (c.stringFieldOption === N.STRING_FIELD_OPTION_RICHTEXT)
              return (
                (d["class"] = this.css.field + " " + this.css.richText),
                (d.height = "100%"),
                (d.width = "100%"),
                (d.plugins = c.richTextPlugins || this._defaultRichTextPlugins),
                (b = new x(d, b)),
                b.startup(),
                b
              );
            var f = this;
            d.validator = function(b, d) {
              this._maskValidSubsetError = !1;
              this._hasBeenBlurred = !0;
              return f._isFieldNullable(a, c) || !("" === b || null === b);
            };
            return new P(d, b);
          },
          _createTimeField: function(a, c, b) {
            b = m.create("div", null, b);
            a = {
              class: this.css.field,
              trim: !0,
              required: this._isFieldRequired(a, c),
              constraints: { formatLength: "medium" }
            };
            this._datePackage && (a.datePackage = this._datePackage);
            return new Q(a, b);
          },
          _createDateField: function(a, c, b) {
            b = m.create("div", null, b);
            a = {
              class: this.css.field,
              trim: !0,
              required: this._isFieldRequired(a, c)
            };
            this._datePackage && (a.datePackage = this._datePackage);
            return new G(a, b);
          },
          _createIntField: function(a, c, b) {
            b = m.create("div", null, b);
            return new J(
              {
                class: this.css.field,
                constraints:
                  "esriFieldTypeSmallInteger" === a.type
                    ? { min: -32768, max: 32767, places: 0 }
                    : { places: 0 },
                trim: !0,
                invalidMessage: this.NLS_validationInt,
                required: this._isFieldRequired(a, c)
              },
              b
            );
          },
          _createFltField: function(a, c, b) {
            b = m.create("div", null, b);
            return new J(
              {
                class: this.css.field,
                constraints: { max: Infinity, min: -Infinity, places: "0,20" },
                trim: !0,
                invalidMessage: this.NLS_validationFlt,
                required: this._isFieldRequired(a, c)
              },
              b
            );
          },
          _toStore: function(a) {
            return new O({
              data: { identifier: "id", label: "name", items: a }
            });
          },
          _connect: function(a, c, b) {
            this._aiConnects.push(l.connect(a, c, b));
          },
          _getDatePackage: function(a) {
            return null === a.datePackage
              ? null
              : a.datePackage
              ? a.datePackage
              : "ar" === b.locale
              ? "dojox.date.islamic"
              : null;
          },
          _destroyAttributeTable: function() {
            h.forEach(
              this._layerInfos,
              function(a) {
                h.forEach(
                  a.fieldInfos,
                  function(a) {
                    var c = a.dijit;
                    if (c) {
                      c._onChangeHandle = null;
                      if (a.customField) return;
                      c instanceof Array
                        ? h.forEach(
                            c,
                            g.hitch(this, function(a) {
                              a.destroyRecursive
                                ? a.destroyRecursive()
                                : a.destroy && a.destroy();
                              a._onChangeHandle = null;
                            })
                          )
                        : c.destroyRecursive
                        ? c.destroyRecursive()
                        : c.destroy && c.destroy();
                    }
                    a.dijit = null;
                  },
                  this
                );
              },
              this
            );
            h.forEach(this._toolTips, function(a) {
              a.destroy();
            });
            this._toolTips = [];
            this._attributes && m.destroy(this._attributes);
          }
        });
        g.mixin(N, {
          STRING_FIELD_OPTION_RICHTEXT: "richtext",
          STRING_FIELD_OPTION_TEXTAREA: "textarea",
          STRING_FIELD_OPTION_TEXTBOX: "textbox"
        });
        d("extend-esri") && g.setObject("dijit.AttributeInspector", N, k);
        return N;
      });
    },
    "dijit/Editor": function() {
      define("require dojo/_base/array dojo/_base/declare dojo/Deferred dojo/i18n dojo/dom-attr dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/keys dojo/_base/lang dojo/sniff dojo/string dojo/topic ./_Container ./Toolbar ./ToolbarSeparator ./layout/_LayoutWidget ./form/ToggleButton ./_editor/_Plugin ./_editor/plugins/EnterKeyHandling ./_editor/html ./_editor/range ./_editor/RichText ./main dojo/i18n!./_editor/nls/commands".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H
      ) {
        function D(a) {
          return new x({ command: a.name });
        }
        function G(a) {
          return new x({ buttonClass: C, command: a.name });
        }
        h = h("dijit.Editor", z, {
          plugins: null,
          extraPlugins: null,
          constructor: function() {
            c.isArray(this.plugins) ||
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
                B
              ]);
            this._plugins = [];
            this._editInterval = 1e3 * this.editActionInterval;
            if (p("ie") || p("trident") || p("edge"))
              this.events.push("onBeforeDeactivate"),
                this.events.push("onBeforeActivate");
          },
          postMixInProperties: function() {
            this.setValueDeferred = new l();
            this.inherited(arguments);
          },
          postCreate: function() {
            this.inherited(arguments);
            this._steps = this._steps.slice(0);
            this._undoedSteps = this._undoedSteps.slice(0);
            c.isArray(this.extraPlugins) &&
              (this.plugins = this.plugins.concat(this.extraPlugins));
            this.commands = e.getLocalization(
              "dijit._editor",
              "commands",
              this.lang
            );
            p("webkit") && m.set(this.domNode, "KhtmlUserSelect", "none");
          },
          startup: function() {
            this.inherited(arguments);
            this.toolbar ||
              ((this.toolbar = new y({
                ownerDocument: this.ownerDocument,
                dir: this.dir,
                lang: this.lang,
                "aria-label": this.id
              })),
              this.header.appendChild(this.toolbar.domNode));
            g.forEach(this.plugins, this.addPlugin, this);
            this.setValueDeferred.resolve(!0);
            d.add(this.iframe.parentNode, "dijitEditorIFrameContainer");
            d.add(this.iframe, "dijitEditorIFrame");
            b.set(this.iframe, "allowTransparency", !0);
            this.toolbar.startup();
            this.onNormalizedDisplayChanged();
          },
          destroy: function() {
            g.forEach(this._plugins, function(a) {
              a && a.destroy && a.destroy();
            });
            this._plugins = [];
            this.toolbar.destroyRecursive();
            delete this.toolbar;
            this.inherited(arguments);
          },
          addPlugin: function(a, b) {
            var d = c.isString(a)
              ? { name: a }
              : c.isFunction(a)
              ? { ctor: a }
              : a;
            if (!d.setEditor) {
              var f = { args: d, plugin: null, editor: this };
              d.name &&
                (x.registry[d.name]
                  ? (f.plugin = x.registry[d.name](d))
                  : t.publish(H._scopeName + ".Editor.getPlugin", f));
              if (!f.plugin)
                try {
                  var e = d.ctor || c.getObject(d.name) || n(d.name);
                  e && (f.plugin = new e(d));
                } catch (L) {
                  throw Error(
                    this.id + ": cannot find plugin [" + d.name + "]"
                  );
                }
              if (!f.plugin)
                throw Error(this.id + ": cannot find plugin [" + d.name + "]");
              a = f.plugin;
            }
            1 < arguments.length
              ? (this._plugins[b] = a)
              : this._plugins.push(a);
            a.setEditor(this);
            c.isFunction(a.setToolbar) && a.setToolbar(this.toolbar);
          },
          resize: function(a) {
            a && r.prototype.resize.apply(this, arguments);
          },
          layout: function() {
            var c =
              this._contentBox.h -
              (this.getHeaderHeight() +
                this.getFooterHeight() +
                a.getPadBorderExtents(this.iframe.parentNode).h +
                a.getMarginExtents(this.iframe.parentNode).h);
            this.editingArea.style.height = c + "px";
            this.iframe && (this.iframe.style.height = "100%");
            this._layoutMode = !0;
          },
          _onIEMouseDown: function(a) {
            var c,
              b = this.document.body,
              d = b.clientWidth,
              f = b.clientHeight,
              e = b.clientLeft,
              k = b.offsetWidth,
              m = b.offsetHeight,
              q = b.offsetLeft;
            /^rtl$/i.test(b.dir || "")
              ? d < k && a.x > d && a.x < k && (c = !0)
              : a.x < e && a.x > q && (c = !0);
            c || (f < m && a.y > f && a.y < m && (c = !0));
            c ||
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
              var c = this.inherited(arguments);
              this.customUndo && this._endEditing();
              return c;
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
          _clipboardCommand: function(a) {
            var c;
            try {
              if (
                ((c = this.document.execCommand(a, !1, null)),
                p("webkit") && !c)
              )
                throw {};
            } catch (F) {
              (c = q.substitute),
                alert(
                  c(this.commands.systemShortcut, [
                    this.commands[a],
                    c(this.commands[p("mac") ? "appleKey" : "ctrlKey"], [
                      { cut: "X", copy: "C", paste: "V" }[a]
                    ])
                  ])
                ),
                (c = !1);
            }
            return c;
          },
          queryCommandEnabled: function(a) {
            return !this.customUndo || ("undo" != a && "redo" != a)
              ? this.inherited(arguments)
              : "undo" == a
              ? 1 < this._steps.length
              : 0 < this._undoedSteps.length;
          },
          _moveToBookmark: function(a) {
            var b = a.mark,
              d = a.mark;
            a = a.isCollapsed;
            var f, e, k;
            d &&
              (9 > p("ie") || (9 === p("ie") && p("quirks"))
                ? c.isArray(d)
                  ? ((b = []),
                    g.forEach(
                      d,
                      function(a) {
                        b.push(w.getNode(a, this.editNode));
                      },
                      this
                    ),
                    this.selection.moveToBookmark({ mark: b, isCollapsed: a }))
                  : d.startContainer &&
                    d.endContainer &&
                    (k = w.getSelection(this.window)) &&
                    k.removeAllRanges &&
                    (k.removeAllRanges(),
                    (a = w.create(this.window)),
                    (f = w.getNode(d.startContainer, this.editNode)),
                    (e = w.getNode(d.endContainer, this.editNode)),
                    f &&
                      e &&
                      (a.setStart(f, d.startOffset),
                      a.setEnd(e, d.endOffset),
                      k.addRange(a)))
                : (k = w.getSelection(this.window)) &&
                  k.removeAllRanges &&
                  (k.removeAllRanges(),
                  (a = w.create(this.window)),
                  (f = w.getNode(d.startContainer, this.editNode)),
                  (e = w.getNode(d.endContainer, this.editNode)),
                  f &&
                    e &&
                    (a.setStart(f, d.startOffset),
                    a.setEnd(e, d.endOffset),
                    k.addRange(a))));
          },
          _changeToStep: function(a, c) {
            this.setValue(c.text);
            (a = c.bookmark) && this._moveToBookmark(a);
          },
          undo: function() {
            var a = !1;
            if (!this._undoRedoActive) {
              this._undoRedoActive = !0;
              this.endEditing(!0);
              var c = this._steps.pop();
              c &&
                0 < this._steps.length &&
                (this.focus(),
                this._changeToStep(c, this._steps[this._steps.length - 1]),
                this._undoedSteps.push(c),
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
              var c = this._undoedSteps.pop();
              c &&
                0 < this._steps.length &&
                (this.focus(),
                this._changeToStep(this._steps[this._steps.length - 1], c),
                this._steps.push(c),
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
              b = [];
            if (a && a.mark) {
              var d = a.mark;
              if (9 > p("ie") || (9 === p("ie") && p("quirks"))) {
                var f = w.getSelection(this.window);
                if (c.isArray(d))
                  g.forEach(
                    a.mark,
                    function(a) {
                      b.push(w.getIndex(a, this.editNode).o);
                    },
                    this
                  ),
                    (a.mark = b);
                else if (f) {
                  var e;
                  f.rangeCount && (e = f.getRangeAt(0));
                  a.mark = e ? e.cloneRange() : this.selection.getBookmark();
                }
              }
              try {
                a.mark &&
                  a.mark.startContainer &&
                  ((b = w.getIndex(a.mark.startContainer, this.editNode).o),
                  (a.mark = {
                    startContainer: b,
                    startOffset: a.mark.startOffset,
                    endContainer:
                      a.mark.endContainer === a.mark.startContainer
                        ? b
                        : w.getIndex(a.mark.endContainer, this.editNode).o,
                    endOffset: a.mark.endOffset
                  }));
              } catch (L) {
                a.mark = null;
              }
            }
            return a;
          },
          _beginEditing: function() {
            0 === this._steps.length &&
              this._steps.push({
                text: v.getChildrenHtml(this.editNode),
                bookmark: this._getBookmark()
              });
          },
          _endEditing: function() {
            var a = v.getChildrenHtml(this.editNode);
            this._undoedSteps = [];
            this._steps.push({ text: a, bookmark: this._getBookmark() });
          },
          onKeyDown: function(a) {
            p("ie") ||
              this.iframe ||
              a.keyCode != k.TAB ||
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
                case k.ENTER:
                case k.BACKSPACE:
                case k.DELETE:
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
                    (a.keyCode < k.F1 || a.keyCode > k.F15)
                  ) {
                    this.beginEditing();
                    break;
                  }
                case k.ALT:
                  this.endEditing();
                  break;
                case k.UP_ARROW:
                case k.DOWN_ARROW:
                case k.LEFT_ARROW:
                case k.RIGHT_ARROW:
                case k.HOME:
                case k.END:
                case k.PAGE_UP:
                case k.PAGE_DOWN:
                  this.endEditing(!0);
                case k.CTRL:
                case k.SHIFT:
                case k.TAB:
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
            } catch (E) {}
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
              c.hitch(this, function() {
                (!this.disabled && a) || (!this._buttonEnabledPlugins && a)
                  ? g.forEach(this._plugins, function(a) {
                      a.set("disabled", !0);
                    })
                  : this.disabled &&
                    !a &&
                    g.forEach(this._plugins, function(a) {
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
                  (m.set(
                    this.document.body,
                    "color",
                    m.get(this.iframe, "color")
                  ),
                  m.set(
                    this.document.body,
                    "background-color",
                    m.get(this.iframe, "background-color")
                  ));
            } catch (E) {}
          }
        });
        c.mixin(x.registry, {
          undo: D,
          redo: D,
          cut: D,
          copy: D,
          paste: D,
          insertOrderedList: D,
          insertUnorderedList: D,
          indent: D,
          outdent: D,
          justifyCenter: D,
          justifyFull: D,
          justifyLeft: D,
          justifyRight: D,
          delete: D,
          selectAll: D,
          removeFormat: D,
          unlink: D,
          insertHorizontalRule: D,
          bold: G,
          italic: G,
          underline: G,
          strikethrough: G,
          subscript: G,
          superscript: G,
          "|": function() {
            return new x({
              setEditor: function(a) {
                this.editor = a;
                this.button = new u({ ownerDocument: a.ownerDocument });
              }
            });
          }
        });
        return h;
      });
    },
    "dijit/Toolbar": function() {
      define("require dojo/_base/declare dojo/has dojo/keys dojo/ready ./_Widget ./_KeyNavContainer ./_TemplatedMixin".split(
        " "
      ), function(n, g, h, l, e, b, d, a) {
        h("dijit-legacy-requires") &&
          e(0, function() {
            n(["dijit/ToolbarSeparator"]);
          });
        return g("dijit.Toolbar", [b, a, d], {
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
      ], function(n, g, h, l) {
        return n("dijit.ToolbarSeparator", [h, l], {
          templateString:
            '\x3cdiv class\x3d"dijitToolbarSeparator dijitInline" role\x3d"presentation"\x3e\x3c/div\x3e',
          buildRendering: function() {
            this.inherited(arguments);
            g.setSelectable(this.domNode, !1);
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
      ], function(n, g, h, l, e) {
        g = g("dijit._editor._Plugin", l, {
          constructor: function(b) {
            this.params = b || {};
            h.mixin(this, this.params);
            this._attrPairNames = {};
          },
          editor: null,
          iconClassPrefix: "dijitEditorIcon",
          button: null,
          command: "",
          useDefaultCommand: !0,
          buttonClass: e,
          disabled: !1,
          getLabel: function(b) {
            return this.editor.commands[b];
          },
          _initButton: function() {
            if (this.command.length) {
              var b = this.getLabel(this.command),
                d = this.editor,
                a =
                  this.iconClassPrefix +
                  " " +
                  this.iconClassPrefix +
                  this.command.charAt(0).toUpperCase() +
                  this.command.substr(1);
              this.button ||
                ((b = h.mixin(
                  {
                    label: b,
                    ownerDocument: d.ownerDocument,
                    dir: d.dir,
                    lang: d.lang,
                    showLabel: !1,
                    iconClass: a,
                    dropDown: this.dropDown,
                    tabIndex: "-1"
                  },
                  this.params || {}
                )),
                delete b.name,
                (this.button = new this.buttonClass(b)));
            }
            this.get("disabled") &&
              this.button &&
              this.button.set("disabled", this.get("disabled"));
          },
          destroy: function() {
            this.dropDown && this.dropDown.destroyRecursive();
            this.inherited(arguments);
          },
          connect: function(b, d, a) {
            this.own(n.connect(b, d, this, a));
          },
          updateState: function() {
            var b = this.editor,
              d = this.command,
              a,
              e;
            if (b && b.isLoaded && d.length) {
              var k = this.get("disabled");
              if (this.button)
                try {
                  var c = b._implCommand(d);
                  e = !k && (this[c] ? this[c](d) : b.queryCommandEnabled(d));
                  this.enabled !== e &&
                    ((this.enabled = e), this.button.set("disabled", !e));
                  e &&
                    "boolean" == typeof this.button.checked &&
                    ((a = b.queryCommandState(d)),
                    this.checked !== a &&
                      ((this.checked = a),
                      this.button.set("checked", b.queryCommandState(d))));
                } catch (p) {
                  console.log(p);
                }
            }
          },
          setEditor: function(b) {
            this.editor = b;
            this._initButton();
            this.button &&
              this.useDefaultCommand &&
              (this.editor.queryCommandAvailable(this.command)
                ? this.own(
                    this.button.on(
                      "click",
                      h.hitch(
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
                h.hitch(this, "updateState")
              )
            );
          },
          setToolbar: function(b) {
            this.button && b.addChild(this.button);
          },
          set: function(b, d) {
            if ("object" === typeof b) {
              for (var a in b) this.set(a, b[a]);
              return this;
            }
            a = this._getAttrNames(b);
            if (this[a.s])
              var e = this[a.s].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
              );
            else this._set(b, d);
            return e || this;
          },
          get: function(b) {
            var d = this._getAttrNames(b);
            return this[d.g] ? this[d.g]() : this[b];
          },
          _setDisabledAttr: function(b) {
            this._set("disabled", b);
            this.updateState();
          },
          _getAttrNames: function(b) {
            var d = this._attrPairNames;
            if (d[b]) return d[b];
            var a = b.charAt(0).toUpperCase() + b.substr(1);
            return (d[b] = { s: "_set" + a + "Attr", g: "_get" + a + "Attr" });
          },
          _set: function(b, d) {
            this[b] = d;
          }
        });
        g.registry = {};
        return g;
      });
    },
    "dijit/_editor/plugins/EnterKeyHandling": function() {
      define("dojo/_base/declare dojo/dom-construct dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/_base/window dojo/window ../_Plugin ../RichText ../range".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c) {
        return n("dijit._editor.plugins.EnterKeyHandling", m, {
          blockNodeForEnter: "BR",
          constructor: function(a) {
            a &&
              ("blockNodeForEnter" in a &&
                (a.blockNodeForEnter = a.blockNodeForEnter.toUpperCase()),
              l.mixin(this, a));
          },
          setEditor: function(a) {
            if (this.editor !== a)
              if (((this.editor = a), "BR" == this.blockNodeForEnter))
                (this.editor.customUndo = !0),
                  a.onLoadDeferred.then(
                    l.hitch(this, function(c) {
                      this.own(
                        e(
                          a.document,
                          "keydown",
                          l.hitch(this, function(a) {
                            if (a.keyCode == h.ENTER) {
                              var c = l.mixin({}, a);
                              c.shiftKey = !0;
                              this.handleEnterKey(c) ||
                                (a.stopPropagation(), a.preventDefault());
                            }
                          })
                        )
                      );
                      9 <= b("ie") &&
                        10 >= b("ie") &&
                        this.own(
                          e(
                            a.document,
                            "paste",
                            l.hitch(this, function(a) {
                              setTimeout(
                                l.hitch(this, function() {
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
                      return c;
                    })
                  );
              else if (this.blockNodeForEnter) {
                var c = l.hitch(this, "handleEnterKey");
                a.addKeyHandler(13, 0, 0, c);
                a.addKeyHandler(13, 0, 1, c);
                this.own(
                  this.editor.on("KeyPressed", l.hitch(this, "onKeyPressed"))
                );
              }
          },
          onKeyPressed: function() {
            if (this._checkListLater) {
              if (this.editor.selection.isCollapsed()) {
                var a = this.editor.selection.getAncestorElement("LI");
                if (a) {
                  b("mozilla") &&
                    "LI" == a.parentNode.parentNode.nodeName &&
                    (a = a.parentNode.parentNode);
                  var d = a.firstChild;
                  !d ||
                    1 != d.nodeType ||
                    ("UL" != d.nodeName && "OL" != d.nodeName) ||
                    (a.insertBefore(
                      d.ownerDocument.createTextNode("\u00a0"),
                      d
                    ),
                    (d = c.create(this.editor.window)),
                    d.setStart(a.firstChild, 0),
                    (a = c.getSelection(this.editor.window, !0)),
                    a.removeAllRanges(),
                    a.addRange(d));
                } else
                  k.prototype.execCommand.call(
                    this.editor,
                    "formatblock",
                    this.blockNodeForEnter
                  ),
                    (a = this.editor.selection.getAncestorElement(
                      this.blockNodeForEnter
                    ))
                      ? ((a.innerHTML = this.bogusHtmlContent),
                        9 >= b("ie") &&
                          ((a = this.editor.document.selection.createRange()),
                          a.move("character", -1),
                          a.select()))
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
          handleEnterKey: function(d) {
            var e,
              m,
              f,
              p,
              l = this.editor.document,
              r,
              h,
              n;
            if (d.shiftKey) {
              d = this.editor.selection.getParentElement();
              if ((p = c.getAncestor(d, this.blockNodes))) {
                if ("LI" == p.tagName) return !0;
                d = c.getSelection(this.editor.window);
                e = d.getRangeAt(0);
                e.collapsed ||
                  (e.deleteContents(),
                  (d = c.getSelection(this.editor.window)),
                  (e = d.getRangeAt(0)));
                if (
                  c.atBeginningOfContainer(p, e.startContainer, e.startOffset)
                )
                  (r = l.createElement("br")),
                    (e = c.create(this.editor.window)),
                    p.insertBefore(r, p.firstChild),
                    e.setStartAfter(r),
                    d.removeAllRanges(),
                    d.addRange(e);
                else if (c.atEndOfContainer(p, e.startContainer, e.startOffset))
                  (e = c.create(this.editor.window)),
                    (r = l.createElement("br")),
                    p.appendChild(r),
                    p.appendChild(l.createTextNode("\u00a0")),
                    e.setStart(p.lastChild, 0),
                    d.removeAllRanges(),
                    d.addRange(e);
                else
                  return (h = e.startContainer) && 3 == h.nodeType
                    ? ((n = h.nodeValue),
                      (m = l.createTextNode(n.substring(0, e.startOffset))),
                      (f = l.createTextNode(n.substring(e.startOffset))),
                      (p = l.createElement("br")),
                      "" == f.nodeValue &&
                        b("webkit") &&
                        (f = l.createTextNode("\u00a0")),
                      g.place(m, h, "after"),
                      g.place(p, m, "after"),
                      g.place(f, p, "after"),
                      g.destroy(h),
                      (e = c.create(this.editor.window)),
                      e.setStart(f, 0),
                      d.removeAllRanges(),
                      d.addRange(e),
                      !1)
                    : !0;
              } else
                (d = c.getSelection(this.editor.window)),
                  d.rangeCount
                    ? (e = d.getRangeAt(0)) &&
                      e.startContainer &&
                      (e.collapsed ||
                        (e.deleteContents(),
                        (d = c.getSelection(this.editor.window)),
                        (e = d.getRangeAt(0))),
                      (h = e.startContainer) && 3 == h.nodeType
                        ? ((p = e.startOffset),
                          h.length < p &&
                            ((f = this._adjustNodeAndOffset(h, p)),
                            (h = f.node),
                            (p = f.offset)),
                          (n = h.nodeValue),
                          (m = l.createTextNode(n.substring(0, p))),
                          (f = l.createTextNode(n.substring(p))),
                          (p = l.createElement("br")),
                          f.length || (f = l.createTextNode("\u00a0")),
                          m.length ? g.place(m, h, "after") : (m = h),
                          g.place(p, m, "after"),
                          g.place(f, p, "after"),
                          g.destroy(h))
                        : (0 <= e.startOffset &&
                            (r = h.childNodes[e.startOffset]),
                          (p = l.createElement("br")),
                          (f = l.createTextNode("\u00a0")),
                          r
                            ? (g.place(p, r, "before"), g.place(f, p, "after"))
                            : (h.appendChild(p), h.appendChild(f))),
                      (e = c.create(this.editor.window)),
                      e.setStart(f, 0),
                      e.setEnd(f, f.length),
                      d.removeAllRanges(),
                      d.addRange(e),
                      this.editor.selection.collapse(!0))
                    : k.prototype.execCommand.call(
                        this.editor,
                        "inserthtml",
                        "\x3cbr\x3e"
                      );
              return !1;
            }
            var B = !0;
            d = c.getSelection(this.editor.window);
            e = d.getRangeAt(0);
            e.collapsed ||
              (e.deleteContents(),
              (d = c.getSelection(this.editor.window)),
              (e = d.getRangeAt(0)));
            r = c.getBlockAncestor(e.endContainer, null, this.editor.editNode);
            var v = r.blockNode;
            if (
              (this._checkListLater =
                v && ("LI" == v.nodeName || "LI" == v.parentNode.nodeName))
            )
              return (
                b("mozilla") && (this._pressedEnterInBlock = v),
                /^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(
                  v.innerHTML
                ) &&
                  ((v.innerHTML = ""),
                  b("webkit") &&
                    ((e = c.create(this.editor.window)),
                    e.setStart(v, 0),
                    d.removeAllRanges(),
                    d.addRange(e)),
                  (this._checkListLater = !1)),
                !0
              );
            if (!r.blockNode || r.blockNode === this.editor.editNode) {
              try {
                k.prototype.execCommand.call(
                  this.editor,
                  "formatblock",
                  this.blockNodeForEnter
                );
              } catch (w) {}
              r = {
                blockNode: this.editor.selection.getAncestorElement(
                  this.blockNodeForEnter
                ),
                blockContainer: this.editor.editNode
              };
              if (r.blockNode) {
                if (
                  r.blockNode != this.editor.editNode &&
                  !(r.blockNode.textContent || r.blockNode.innerHTML).replace(
                    /^\s+|\s+$/g,
                    ""
                  ).length
                )
                  return this.removeTrailingBr(r.blockNode), !1;
              } else r.blockNode = this.editor.editNode;
              d = c.getSelection(this.editor.window);
              e = d.getRangeAt(0);
            }
            v = l.createElement(this.blockNodeForEnter);
            v.innerHTML = this.bogusHtmlContent;
            this.removeTrailingBr(r.blockNode);
            f = e.endOffset;
            B = e.endContainer;
            B.length < f &&
              ((f = this._adjustNodeAndOffset(B, f)),
              (B = f.node),
              (f = f.offset));
            if (c.atEndOfContainer(r.blockNode, B, f))
              r.blockNode === r.blockContainer
                ? r.blockNode.appendChild(v)
                : g.place(v, r.blockNode, "after"),
                (B = !1),
                (e = c.create(this.editor.window)),
                e.setStart(v, 0),
                d.removeAllRanges(),
                d.addRange(e),
                this.editor.height && a.scrollIntoView(v);
            else if (
              c.atBeginningOfContainer(
                r.blockNode,
                e.startContainer,
                e.startOffset
              )
            )
              g.place(
                v,
                r.blockNode,
                r.blockNode === r.blockContainer ? "first" : "before"
              ),
                v.nextSibling &&
                  this.editor.height &&
                  ((e = c.create(this.editor.window)),
                  e.setStart(v.nextSibling, 0),
                  d.removeAllRanges(),
                  d.addRange(e),
                  a.scrollIntoView(v.nextSibling)),
                (B = !1);
            else {
              r.blockNode === r.blockContainer
                ? r.blockNode.appendChild(v)
                : g.place(v, r.blockNode, "after");
              B = !1;
              r.blockNode.style &&
                v.style &&
                r.blockNode.style.cssText &&
                (v.style.cssText = r.blockNode.style.cssText);
              if ((h = e.startContainer) && 3 == h.nodeType) {
                f = e.endOffset;
                h.length < f &&
                  ((f = this._adjustNodeAndOffset(h, f)),
                  (h = f.node),
                  (f = f.offset));
                n = h.nodeValue;
                m = l.createTextNode(n.substring(0, f));
                f = l.createTextNode(n.substring(f, n.length));
                g.place(m, h, "before");
                g.place(f, h, "after");
                g.destroy(h);
                for (e = m.parentNode; e !== r.blockNode; ) {
                  n = l.createElement(e.tagName);
                  e.style &&
                    n.style &&
                    e.style.cssText &&
                    (n.style.cssText = e.style.cssText);
                  "FONT" === e.tagName &&
                    (e.color && (n.color = e.color),
                    e.face && (n.face = e.face),
                    e.size && (n.size = e.size));
                  for (; f; ) (h = f.nextSibling), n.appendChild(f), (f = h);
                  g.place(n, e, "after");
                  m = e;
                  f = n;
                  e = e.parentNode;
                }
                if (1 == f.nodeType || (3 == f.nodeType && f.nodeValue))
                  v.innerHTML = "";
                for (m = f; f; ) (h = f.nextSibling), v.appendChild(f), (f = h);
              }
              e = c.create(this.editor.window);
              l = m;
              if ("BR" !== this.blockNodeForEnter) {
                for (; l; ) (p = l), (l = h = l.firstChild);
                p && p.parentNode
                  ? ((v = p.parentNode),
                    e.setStart(v, 0),
                    d.removeAllRanges(),
                    d.addRange(e),
                    this.editor.height && a.scrollIntoView(v),
                    b("mozilla") && (this._pressedEnterInBlock = r.blockNode))
                  : (B = !0);
              } else
                e.setStart(v, 0),
                  d.removeAllRanges(),
                  d.addRange(e),
                  this.editor.height && a.scrollIntoView(v),
                  b("mozilla") && (this._pressedEnterInBlock = r.blockNode);
            }
            return B;
          },
          _adjustNodeAndOffset: function(a, c) {
            for (
              ;
              a.length < c && a.nextSibling && 3 == a.nextSibling.nodeType;

            )
              (c -= a.length), (a = a.nextSibling);
            return { node: a, offset: c };
          },
          removeTrailingBr: function(a) {
            if (
              (a = /P|DIV|LI/i.test(a.tagName)
                ? a
                : this.editor.selection.getParentOfType(a, ["P", "DIV", "LI"]))
            )
              a.lastChild &&
                ((1 < a.childNodes.length &&
                  3 == a.lastChild.nodeType &&
                  /^[\s\xAD]*$/.test(a.lastChild.nodeValue)) ||
                  "BR" == a.lastChild.tagName) &&
                g.destroy(a.lastChild),
                a.childNodes.length || (a.innerHTML = this.bogusHtmlContent);
          }
        });
      });
    },
    "dijit/_editor/RichText": function() {
      define("dojo/_base/array dojo/_base/config dojo/_base/declare dojo/_base/Deferred dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/query dojo/domReady dojo/sniff dojo/string dojo/topic dojo/_base/unload dojo/_base/url dojo/window ../_Widget ../_CssStateMixin ../selection ./range ./html ../focus ../main".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H,
        D,
        G,
        E,
        J
      ) {
        var F = h("dijit._editor.RichText", [w, z], {
          constructor: function(a) {
            this.contentPreFilters = [];
            this.contentPostFilters = [];
            this.contentDomPreFilters = [];
            this.contentDomPostFilters = [];
            this.editingAreaStyleSheets = [];
            this.events = [].concat(this.events);
            this._keyHandlers = {};
            a && q.isString(a.value) && (this.value = a.value);
            this.onLoadDeferred = new l();
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
              q.trim,
              q.hitch(this, "_preFixUrlAttributes")
            ].concat(this.contentPreFilters);
            u("mozilla") &&
              ((this.contentPreFilters = [this._normalizeFontStyle].concat(
                this.contentPreFilters
              )),
              (this.contentPostFilters = [this._removeMozBogus].concat(
                this.contentPostFilters
              )));
            u("webkit") &&
              ((this.contentPreFilters = [this._removeWebkitBogus].concat(
                this.contentPreFilters
              )),
              (this.contentPostFilters = [this._removeWebkitBogus].concat(
                this.contentPostFilters
              )));
            if (u("ie") || u("trident"))
              (this.contentPostFilters = [this._normalizeFontStyle].concat(
                this.contentPostFilters
              )),
                (this.contentDomPostFilters = [
                  q.hitch(this, "_stripBreakerNodes")
                ].concat(this.contentDomPostFilters));
            this.contentDomPostFilters = [
              q.hitch(this, "_stripTrailingEmptyNodes")
            ].concat(this.contentDomPostFilters);
            this.inherited(arguments);
            C.publish(J._scopeName + "._editor.RichText::init", this);
          },
          startup: function() {
            this.inherited(arguments);
            this.open();
            this.setupDefaultShortcuts();
          },
          setupDefaultShortcuts: function() {
            var a = q.hitch(this, function(a, c) {
                return function() {
                  return !this.execCommand(a, c);
                };
              }),
              c = {
                b: a("bold"),
                i: a("italic"),
                u: a("underline"),
                a: a("selectall"),
                s: function() {
                  this.save(!0);
                },
                m: function() {
                  this.isTabIndent = !this.isTabIndent;
                },
                1: a("formatblock", "h1"),
                2: a("formatblock", "h2"),
                3: a("formatblock", "h3"),
                4: a("formatblock", "h4"),
                "\\": a("insertunorderedlist")
              };
            u("ie") || (c.Z = a("redo"));
            for (var b in c) this.addKeyHandler(b, !0, !1, c[b]);
          },
          events: ["onKeyDown", "onKeyUp"],
          captureEvents: [],
          _editorCommandsLocalized: !1,
          _localizeEditorCommands: function() {
            if (F._editorCommandsLocalized)
              (this._local2NativeFormatNames = F._local2NativeFormatNames),
                (this._native2LocalFormatNames = F._native2LocalFormatNames);
            else {
              F._editorCommandsLocalized = !0;
              F._local2NativeFormatNames = {};
              F._native2LocalFormatNames = {};
              this._local2NativeFormatNames = F._local2NativeFormatNames;
              this._native2LocalFormatNames = F._native2LocalFormatNames;
              for (
                var c = "div p pre h1 h2 h3 h4 h5 h6 ol ul address".split(" "),
                  b = "",
                  d,
                  e = 0;
                (d = c[e++]);

              )
                b =
                  "l" !== d.charAt(1)
                    ? b +
                      ("\x3c" +
                        d +
                        "\x3e\x3cspan\x3econtent\x3c/span\x3e\x3c/" +
                        d +
                        "\x3e\x3cbr/\x3e")
                    : b +
                      ("\x3c" +
                        d +
                        "\x3e\x3cli\x3econtent\x3c/li\x3e\x3c/" +
                        d +
                        "\x3e\x3cbr/\x3e");
              var f = a.create("div", {
                style: {
                  position: "absolute",
                  top: "0px",
                  zIndex: 10,
                  opacity: 0.01
                },
                innerHTML: b
              });
              this.ownerDocumentBody.appendChild(f);
              c = q.hitch(this, function() {
                for (var c = f.firstChild; c; )
                  try {
                    this.selection.selectElement(c.firstChild);
                    var b = c.tagName.toLowerCase();
                    this._local2NativeFormatNames[
                      b
                    ] = document.queryCommandValue("formatblock");
                    this._native2LocalFormatNames[
                      this._local2NativeFormatNames[b]
                    ] = b;
                    c = c.nextSibling.nextSibling;
                  } catch (R) {}
                a.destroy(f);
              });
              this.defer(c);
            }
          },
          open: function(c) {
            if (!this.onLoadDeferred || 0 <= this.onLoadDeferred.fired)
              this.onLoadDeferred = new l();
            this.isClosed || this.close();
            C.publish(J._scopeName + "._editor.RichText::open", this);
            1 === arguments.length && c.nodeName && (this.domNode = c);
            var f = this.domNode,
              m;
            if (q.isString(this.value)) (m = this.value), (f.innerHTML = "");
            else if (f.nodeName && "textarea" == f.nodeName.toLowerCase()) {
              var A = (this.textarea = f);
              this.name = A.name;
              m = A.value;
              f = this.domNode = this.ownerDocument.createElement("div");
              f.setAttribute("widgetId", this.id);
              A.removeAttribute("widgetId");
              f.cssText = A.cssText;
              f.className += " " + A.className;
              a.place(f, A, "before");
              var p = q.hitch(this, function() {
                k.set(A, {
                  display: "block",
                  position: "absolute",
                  top: "-1000px"
                });
                if (u("ie")) {
                  var a = A.style;
                  this.__overflow = a.overflow;
                  a.overflow = "hidden";
                }
              });
              u("ie") ? this.defer(p, 10) : p();
              if (A.form) {
                var r = A.value;
                this.reset = function() {
                  this.getValue() !== r && this.replaceValue(r);
                };
                t(
                  A.form,
                  "submit",
                  q.hitch(this, function() {
                    b.set(A, "disabled", this.disabled);
                    A.value = this.getValue();
                  })
                );
              }
            } else (m = G.getChildrenHtml(f)), (f.innerHTML = "");
            this.value = m;
            f.nodeName && "LI" === f.nodeName && (f.innerHTML = " \x3cbr\x3e");
            this.header = f.ownerDocument.createElement("div");
            f.appendChild(this.header);
            this.editingArea = f.ownerDocument.createElement("div");
            f.appendChild(this.editingArea);
            this.footer = f.ownerDocument.createElement("div");
            f.appendChild(this.footer);
            this.name || (this.name = this.id + "_AUTOGEN");
            if ("" !== this.name && (!g.useXDomain || g.allowXdRichTextSave)) {
              if (
                (m = e.byId(J._scopeName + "._editor.RichText.value")) &&
                "" !== m.value
              )
                for (
                  var p = m.value.split(this._SEPARATOR), h = 0, v;
                  (v = p[h++]);

                )
                  if (
                    ((v = v.split(this._NAME_CONTENT_SEP)), v[0] === this.name)
                  ) {
                    this.value = v[1];
                    p = p.splice(h, 1);
                    m.value = p.join(this._SEPARATOR);
                    break;
                  }
              F._globalSaveHandler ||
                ((F._globalSaveHandler = {}),
                x.addOnUnload(function() {
                  for (var a in F._globalSaveHandler) {
                    var c = F._globalSaveHandler[a];
                    q.isFunction(c) && c();
                  }
                }));
              F._globalSaveHandler[this.id] = q.hitch(this, "_saveContent");
            }
            this.isClosed = !1;
            m = this.editorObject = this.iframe = this.ownerDocument.createElement(
              "iframe"
            );
            m.id = this.id + "_iframe";
            m.style.border = "none";
            m.style.width = "100%";
            this._layoutMode
              ? (m.style.height = "100%")
              : 7 <= u("ie")
              ? (this.height && (m.style.height = this.height),
                this.minHeight && (m.style.minHeight = this.minHeight))
              : (m.style.height = this.height ? this.height : this.minHeight);
            m.frameBorder = 0;
            m._loadFunc = q.hitch(this, function(a) {
              this.window = a;
              this.document = a.document;
              this.selection = new H.SelectionManager(a);
              u("ie") && this._localizeEditorCommands();
              this.onLoad(this.get("value"));
            });
            p = this._getIframeDocTxt()
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'");
            p =
              11 > u("ie")
                ? 'javascript:document.open();try{parent.window;}catch(e){document.domain\x3d"' +
                  document.domain +
                  "\";}document.write('" +
                  p +
                  "');document.close()"
                : "javascript: '" + p + "'";
            this.editingArea.appendChild(m);
            m.src = p;
            "LI" === f.nodeName && (f.lastChild.style.marginTop = "-1.2em");
            d.add(this.domNode, this.baseClass);
          },
          _local2NativeFormatNames: {},
          _native2LocalFormatNames: {},
          _getIframeDocTxt: function() {
            var a = k.getComputedStyle(this.domNode),
              b;
            if (this["aria-label"]) b = this["aria-label"];
            else {
              var d =
                f('label[for\x3d"' + this.id + '"]', this.ownerDocument)[0] ||
                e.byId(this["aria-labelledby"], this.ownerDocument);
              d && (b = d.textContent || d.innerHTML || "");
            }
            var d =
                "\x3cdiv id\x3d'dijitEditorBody' role\x3d'textbox' aria-multiline\x3d'true' " +
                (b ? " aria-label\x3d'" + r.escape(b) + "'" : "") +
                "\x3e\x3c/div\x3e",
              m = [a.fontWeight, a.fontSize, a.fontFamily].join(" "),
              g = a.lineHeight,
              g =
                0 <= g.indexOf("px")
                  ? parseFloat(g) / parseFloat(a.fontSize)
                  : 0 <= g.indexOf("em")
                  ? parseFloat(g)
                  : "normal",
              p = "",
              l = this;
            this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/gi, function(a) {
              a = a.replace(/^;/gi, "") + ";";
              var c = a.split(":")[0];
              if (c) {
                var c = q.trim(c),
                  c = c.toLowerCase(),
                  b,
                  d = "";
                for (b = 0; b < c.length; b++) {
                  var e = c.charAt(b);
                  switch (e) {
                    case "-":
                      b++, (e = c.charAt(b).toUpperCase());
                    default:
                      d += e;
                  }
                }
                k.set(l.domNode, d, "");
              }
              p += a + ";";
            });
            this.iframe.setAttribute("title", b);
            return [
              "\x3c!DOCTYPE html\x3e",
              "\x3chtml lang\x3d'" +
                (this.lang || c.locale.replace(/-.*/, "")) +
                "'" +
                (this.isLeftToRight() ? "" : " dir\x3d'rtl'") +
                "\x3e\n",
              "\x3chead\x3e\n\x3cmeta http-equiv\x3d'Content-Type' content\x3d'text/html'\x3e\n",
              b ? "\x3ctitle\x3e" + r.escape(b) + "\x3c/title\x3e" : "",
              "\x3cstyle\x3e\n\tbody,html {\n\t\tbackground:transparent;\n\t\tpadding: 1px 0 0 0;\n\t\tmargin: -1px 0 0 0;\n\t}\n\tbody,html,#dijitEditorBody { outline: none; }html { height: 100%; width: 100%; overflow: hidden; }\n",
              this.height
                ? "\tbody,#dijitEditorBody { height: 100%; width: 100%; overflow: auto; }\n"
                : "\tbody,#dijitEditorBody { min-height: " +
                  this.minHeight +
                  "; width: 100%; overflow-x: auto; overflow-y: hidden; }\n",
              "\tbody{\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tright:0px;\n\t\tfont:",
              m,
              ";\n",
              this.height || u("opera") ? "" : "\t\tposition: fixed;\n",
              "\t\tline-height:",
              g,
              ";\n\t}\n\tp{ margin: 1em 0; }\n\tli \x3e ul:-moz-first-node, li \x3e ol:-moz-first-node{ padding-top: 1.2em; }\n",
              u("ie") || u("trident") || u("edge")
                ? ""
                : "\tli{ min-height:1.2em; }\n",
              "\x3c/style\x3e\n",
              this._applyEditingAreaStyleSheets(),
              "\n\x3c/head\x3e\n\x3cbody role\x3d'application'",
              b ? " aria-label\x3d'" + r.escape(b) + "'" : "",
              "onload\x3d'try{frameElement \x26\x26 frameElement._loadFunc(window,document)}catch(e){document.domain\x3d\"" +
                document.domain +
                "\";frameElement._loadFunc(window,document)}' ",
              "style\x3d'" + p + "'\x3e",
              d,
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
              var c = "", b = 0, d, e = v.get(this.ownerDocument);
              (d = a[b++]);

            )
              (d = new B(e.location, d).toString()),
                this.editingAreaStyleSheets.push(d),
                (c +=
                  '\x3clink rel\x3d"stylesheet" type\x3d"text/css" href\x3d"' +
                  d +
                  '"/\x3e');
            return c;
          },
          addStyleSheet: function(a) {
            var c = a.toString(),
              b = v.get(this.ownerDocument);
            if ("." === c.charAt(0) || ("/" !== c.charAt(0) && !a.host))
              c = new B(b.location, c).toString();
            -1 < n.indexOf(this.editingAreaStyleSheets, c) ||
              (this.editingAreaStyleSheets.push(c),
              this.onLoadDeferred.then(
                q.hitch(this, function() {
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
            var c = a.toString(),
              b = v.get(this.ownerDocument);
            if ("." === c.charAt(0) || ("/" !== c.charAt(0) && !a.host))
              c = new B(b.location, c).toString();
            a = n.indexOf(this.editingAreaStyleSheets, c);
            -1 !== a &&
              (delete this.editingAreaStyleSheets[a],
              f('link[href\x3d"' + c + '"]', this.window.document).orphan());
          },
          disabled: !1,
          _mozSettingProps: { styleWithCSS: !1 },
          _setDisabledAttr: function(a) {
            a = !!a;
            this._set("disabled", a);
            if (this.isLoaded) {
              var c = u("ie") && (this.isLoaded || !this.focusOnLoad);
              c && (this.editNode.unselectable = "on");
              this.editNode.contentEditable = !a;
              this.editNode.tabIndex = a ? "-1" : this.tabIndex;
              c &&
                this.defer(function() {
                  this.editNode && (this.editNode.unselectable = "off");
                });
              if (u("mozilla") && !a && this._mozSettingProps) {
                a = this._mozSettingProps;
                for (var b in a)
                  if (a.hasOwnProperty(b))
                    try {
                      this.document.execCommand(b, !1, a[b]);
                    } catch (P) {}
              }
              this._disabledOK = !0;
            }
          },
          onLoad: function(c) {
            this.window.__registeredWindow ||
              ((this.window.__registeredWindow = !0),
              (this._iframeRegHandle = E.registerIframe(this.iframe)));
            this.editNode = this.document.body.firstChild;
            var b = this;
            this.beforeIframeNode = a.place(
              "\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e",
              this.iframe,
              "before"
            );
            this.afterIframeNode = a.place(
              "\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e",
              this.iframe,
              "after"
            );
            this.iframe.onfocus = this.document.onfocus = function() {
              b.editNode.focus();
            };
            this.focusNode = this.editNode;
            var d = this.events.concat(this.captureEvents),
              e = this.iframe ? this.document : this.editNode;
            this.own.apply(
              this,
              n.map(
                d,
                function(a) {
                  var c = a.toLowerCase().replace(/^on/, "");
                  return t(e, c, q.hitch(this, a));
                },
                this
              )
            );
            this.own(t(e, "mouseup", q.hitch(this, "onClick")));
            u("ie") &&
              (this.own(
                t(this.document, "mousedown", q.hitch(this, "_onIEMouseDown"))
              ),
              (this.editNode.style.zoom = 1));
            u("webkit") &&
              ((this._webkitListener = this.own(
                t(this.document, "mouseup", q.hitch(this, "onDisplayChanged"))
              )[0]),
              this.own(
                t(
                  this.document,
                  "mousedown",
                  q.hitch(this, function(a) {
                    a = a.target;
                    !a ||
                      (a !== this.document.body && a !== this.document) ||
                      this.defer("placeCursorAtEnd");
                  })
                )
              ));
            if (u("ie"))
              try {
                this.document.execCommand(
                  "RespectVisibilityInDesign",
                  !0,
                  null
                );
              } catch (Q) {}
            this.isLoaded = !0;
            this.set("disabled", this.disabled);
            d = q.hitch(this, function() {
              this.setValue(c);
              this.onLoadDeferred &&
                !this.onLoadDeferred.isFulfilled() &&
                this.onLoadDeferred.resolve(!0);
              this.onDisplayChanged();
              this.focusOnLoad &&
                y(q.hitch(this, "defer", "focus", this.updateInterval));
              this.value = this.getValue(!0);
            });
            this.setValueDeferred ? this.setValueDeferred.then(d) : d();
          },
          onKeyDown: function(a) {
            if (
              a.keyCode === p.SHIFT ||
              a.keyCode === p.ALT ||
              a.keyCode === p.META ||
              a.keyCode === p.CTRL
            )
              return !0;
            a.keyCode === p.TAB &&
              this.isTabIndent &&
              (a.stopPropagation(),
              a.preventDefault(),
              this.queryCommandEnabled(a.shiftKey ? "outdent" : "indent") &&
                this.execCommand(a.shiftKey ? "outdent" : "indent"));
            if (
              a.keyCode == p.TAB &&
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
            9 > u("ie") &&
              a.keyCode === p.BACKSPACE &&
              "Control" === this.document.selection.type &&
              (a.stopPropagation(),
              a.preventDefault(),
              this.execCommand("delete"));
            u("ff") &&
              (a.keyCode === p.PAGE_UP || a.keyCode === p.PAGE_DOWN) &&
              this.editNode.clientHeight >= this.editNode.scrollHeight &&
              a.preventDefault();
            var c = this._keyHandlers[a.keyCode],
              b = arguments;
            c &&
              !a.altKey &&
              n.some(
                c,
                function(c) {
                  if (
                    !(c.shift ^ a.shiftKey || c.ctrl ^ (a.ctrlKey || a.metaKey))
                  )
                    return c.handler.apply(this, b) || a.preventDefault(), !0;
                },
                this
              );
            this.defer("onKeyPressed", 1);
            return !0;
          },
          onKeyUp: function() {},
          setDisabled: function(a) {
            c.deprecated(
              "dijit.Editor::setDisabled is deprecated",
              'use dijit.Editor::attr("disabled",boolean) instead',
              2
            );
            this.set("disabled", a);
          },
          _setValueAttr: function(a) {
            this.setValue(a);
          },
          _setDisableSpellCheckAttr: function(a) {
            this.document
              ? b.set(this.document.body, "spellcheck", !a)
              : this.onLoadDeferred.then(
                  q.hitch(this, function() {
                    b.set(this.document.body, "spellcheck", !a);
                  })
                );
            this._set("disableSpellCheck", a);
          },
          addKeyHandler: function(a, c, b, d) {
            "string" == typeof a && (a = a.toUpperCase().charCodeAt(0));
            q.isArray(this._keyHandlers[a]) || (this._keyHandlers[a] = []);
            this._keyHandlers[a].push({
              shift: b || !1,
              ctrl: c || !1,
              handler: d
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
            (u("ie") || u("trident")) &&
              this.defer(function() {
                E.curNode || this.ownerDocumentBody.focus();
              });
            this.inherited(arguments);
            var c = this.getValue(!0);
            if (c !== this.value) this.onChange(c);
            this._set("value", c);
          },
          _onFocus: function(a) {
            this.disabled ||
              (this._disabledOK || this.set("disabled", !1),
              this.inherited(arguments));
          },
          blur: function() {
            !u("ie") &&
            this.window.document.documentElement &&
            this.window.document.documentElement.focus
              ? this.window.document.documentElement.focus()
              : this.ownerDocumentBody.focus && this.ownerDocumentBody.focus();
          },
          focus: function() {
            this.isLoaded
              ? 9 > u("ie")
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
          _normalizeCommand: function(a, c) {
            a = a.toLowerCase();
            "formatblock" === a
              ? u("safari") && void 0 === c && (a = "heading")
              : "hilitecolor" !== a || u("mozilla") || (a = "backcolor");
            return a;
          },
          _implCommand: function(a) {
            return "_" + this._normalizeCommand(a) + "EnabledImpl";
          },
          _qcaCache: {},
          queryCommandAvailable: function(a) {
            var c = this._qcaCache[a];
            return void 0 !== c
              ? c
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
                return u("ie") || u("trident") || u("edge");
              case "inserttable":
              case "insertcell":
              case "insertcol":
              case "insertrow":
              case "deletecells":
              case "deletecols":
              case "deleterows":
              case "mergecells":
              case "splitcell":
                return !u("webkit");
              default:
                return !1;
            }
          },
          execCommand: function(a, c) {
            var b;
            this.focused && this.focus();
            a = this._normalizeCommand(a, c);
            if (void 0 !== c) {
              if ("heading" === a) throw Error("unimplemented");
              "formatblock" === a &&
                (u("ie") || u("trident")) &&
                (c = "\x3c" + c + "\x3e");
            }
            var d = "_" + a + "Impl";
            if (this[d]) b = this[d](c);
            else if (
              (c = 1 < arguments.length ? c : null) ||
              "createlink" !== a
            )
              b = this.document.execCommand(a, !1, c);
            this.onDisplayChanged();
            return b;
          },
          queryCommandEnabled: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            var c = this._implCommand(a);
            return this[c] ? this[c](a) : this._browserQueryCommandEnabled(a);
          },
          queryCommandState: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            try {
              return this.document.queryCommandState(a);
            } catch (K) {
              return !1;
            }
          },
          queryCommandValue: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            if (u("ie") && "formatblock" === a)
              a = this._native2LocalFormatNames[
                this.document.queryCommandValue(a)
              ];
            else if (u("mozilla") && "hilitecolor" === a) {
              var c;
              try {
                c = this.document.queryCommandValue("styleWithCSS");
              } catch (L) {
                c = !1;
              }
              this.document.execCommand("styleWithCSS", !1, !0);
              a = this.document.queryCommandValue(a);
              this.document.execCommand("styleWithCSS", !1, c);
            } else a = this.document.queryCommandValue(a);
            return a;
          },
          _sCall: function(a, c) {
            return this.selection[a].apply(this.selection, c);
          },
          placeCursorAtStart: function() {
            this.focus();
            var a = !1;
            if (u("mozilla"))
              for (var c = this.editNode.firstChild; c; ) {
                if (3 === c.nodeType) {
                  if (0 < c.nodeValue.replace(/^\s+|\s+$/g, "").length) {
                    a = !0;
                    this.selection.selectElement(c);
                    break;
                  }
                } else if (1 === c.nodeType) {
                  var a = !0,
                    b = c.tagName ? c.tagName.toLowerCase() : "";
                  /br|input|img|base|meta|area|basefont|hr|link/.test(b)
                    ? this.selection.selectElement(c)
                    : this.selection.selectElementChildren(c);
                  break;
                }
                c = c.nextSibling;
              }
            else (a = !0), this.selection.selectElementChildren(this.editNode);
            a && this.selection.collapse(!0);
          },
          placeCursorAtEnd: function() {
            this.focus();
            var a = !1;
            if (u("mozilla"))
              for (var c = this.editNode.lastChild; c; ) {
                if (3 === c.nodeType) {
                  if (0 < c.nodeValue.replace(/^\s+|\s+$/g, "").length) {
                    a = !0;
                    this.selection.selectElement(c);
                    break;
                  }
                } else if (1 === c.nodeType) {
                  a = !0;
                  this.selection.selectElement(c.lastChild || c);
                  break;
                }
                c = c.previousSibling;
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
          setValue: function(a) {
            if (this.isLoaded) {
              if (!this.textarea || (!this.isClosed && this.isLoaded)) {
                a = this._preFilterContent(a);
                var c = this.isClosed ? this.domNode : this.editNode;
                c.innerHTML = a;
                this._preDomFilterContent(c);
              } else this.textarea.value = a;
              this.onDisplayChanged();
              this._set("value", this.getValue(!0));
            } else
              this.onLoadDeferred.then(
                q.hitch(this, function() {
                  this.setValue(a);
                })
              );
          },
          replaceValue: function(a) {
            this.isClosed
              ? this.setValue(a)
              : this.window && this.window.getSelection && !u("mozilla")
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
            var c = a;
            n.forEach(this.contentPreFilters, function(a) {
              a && (c = a(c));
            });
            return c;
          },
          _preDomFilterContent: function(a) {
            a = a || this.editNode;
            n.forEach(
              this.contentDomPreFilters,
              function(c) {
                c && q.isFunction(c) && c(a);
              },
              this
            );
          },
          _postFilterContent: function(a, c) {
            var b;
            q.isString(a)
              ? (b = a)
              : ((a = a || this.editNode),
                this.contentDomPostFilters.length &&
                  (c && (a = q.clone(a)),
                  n.forEach(this.contentDomPostFilters, function(c) {
                    a = c(a);
                  })),
                (b = G.getChildrenHtml(a)));
            q.trim(b.replace(/^\xA0\xA0*/, "").replace(/\xA0\xA0*$/, ""))
              .length || (b = "");
            n.forEach(this.contentPostFilters, function(a) {
              b = a(b);
            });
            return b;
          },
          _saveContent: function() {
            var a = e.byId(J._scopeName + "._editor.RichText.value");
            a &&
              (a.value && (a.value += this._SEPARATOR),
              (a.value +=
                this.name + this._NAME_CONTENT_SEP + this.getValue(!0)));
          },
          escapeXml: function(a, c) {
            a = a
              .replace(/&/gm, "\x26amp;")
              .replace(/</gm, "\x26lt;")
              .replace(/>/gm, "\x26gt;")
              .replace(/"/gm, "\x26quot;");
            c || (a = a.replace(/'/gm, "\x26#39;"));
            return a;
          },
          getNodeHtml: function(a) {
            c.deprecated(
              "dijit.Editor::getNodeHtml is deprecated",
              "use dijit/_editor/html::getNodeHtml instead",
              2
            );
            return G.getNodeHtml(a);
          },
          getNodeChildrenHtml: function(a) {
            c.deprecated(
              "dijit.Editor::getNodeChildrenHtml is deprecated",
              "use dijit/_editor/html::getChildrenHtml instead",
              2
            );
            return G.getChildrenHtml(a);
          },
          close: function(c) {
            if (!this.isClosed) {
              arguments.length || (c = !0);
              c && this._set("value", this.getValue(!0));
              this.interval && clearInterval(this.interval);
              this._webkitListener &&
                (this._webkitListener.remove(), delete this._webkitListener);
              u("ie") && (this.iframe.onfocus = null);
              this.iframe._loadFunc = null;
              this._iframeRegHandle &&
                (this._iframeRegHandle.remove(), delete this._iframeRegHandle);
              if (this.textarea) {
                var b = this.textarea.style;
                b.position = "";
                b.left = b.top = "";
                u("ie") &&
                  ((b.overflow = this.__overflow), (this.__overflow = null));
                this.textarea.value = this.value;
                a.destroy(this.domNode);
                this.domNode = this.textarea;
              } else this.domNode.innerHTML = this.value;
              delete this.iframe;
              d.remove(this.domNode, this.baseClass);
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
            F._globalSaveHandler && delete F._globalSaveHandler[this.id];
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
            if (u("ie") || u("trident") || u("edge"))
              return this.focused && !this.disabled;
            var c =
              9 > u("ie")
                ? this.document.selection.createRange()
                : this.document;
            try {
              return c.queryCommandEnabled(a);
            } catch (L) {
              return !1;
            }
          },
          _createlinkEnabledImpl: function() {
            var a = !0;
            return (a = u("opera")
              ? this.window.getSelection().isCollapsed
                ? !0
                : this.document.queryCommandEnabled("createlink")
              : this._browserQueryCommandEnabled("createlink"));
          },
          _unlinkEnabledImpl: function() {
            var a = !0;
            return (a =
              u("mozilla") ||
              u("webkit") ||
              u("ie") ||
              u("trident") ||
              u("edge")
                ? this.selection.hasAncestorElement("a")
                : this._browserQueryCommandEnabled("unlink"));
          },
          _inserttableEnabledImpl: function() {
            var a = !0;
            return (a =
              u("mozilla") || u("webkit")
                ? !0
                : this._browserQueryCommandEnabled("inserttable"));
          },
          _cutEnabledImpl: function() {
            var a = !0;
            u("webkit")
              ? ((a = this.window.getSelection()) && (a = a.toString()),
                (a = !!a))
              : (a = this._browserQueryCommandEnabled("cut"));
            return a;
          },
          _copyEnabledImpl: function() {
            var a = !0;
            u("webkit")
              ? ((a = this.window.getSelection()) && (a = a.toString()),
                (a = !!a))
              : (a = this._browserQueryCommandEnabled("copy"));
            return a;
          },
          _pasteEnabledImpl: function() {
            var a = !0;
            return u("webkit")
              ? !0
              : (a = this._browserQueryCommandEnabled("paste"));
          },
          _inserthorizontalruleImpl: function(a) {
            return u("ie")
              ? this._inserthtmlImpl("\x3chr\x3e")
              : this.document.execCommand("inserthorizontalrule", !1, a);
          },
          _unlinkImpl: function(a) {
            return this.queryCommandEnabled("unlink") &&
              (u("mozilla") || u("webkit"))
              ? ((a = this.selection.getAncestorElement("a")),
                this.selection.selectElement(a),
                this.document.execCommand("unlink", !1, null))
              : this.document.execCommand("unlink", !1, a);
          },
          _hilitecolorImpl: function(a) {
            var c;
            this._handleTextColorOrProperties("hilitecolor", a) ||
              (u("mozilla")
                ? (this.document.execCommand("styleWithCSS", !1, !0),
                  console.log("Executing color command."),
                  (c = this.document.execCommand("hilitecolor", !1, a)),
                  this.document.execCommand("styleWithCSS", !1, !1))
                : (c = this.document.execCommand("hilitecolor", !1, a)));
            return c;
          },
          _backcolorImpl: function(a) {
            u("ie") && (a = a ? a : null);
            var c = this._handleTextColorOrProperties("backcolor", a);
            c || (c = this.document.execCommand("backcolor", !1, a));
            return c;
          },
          _forecolorImpl: function(a) {
            u("ie") && (a = a ? a : null);
            var c = !1;
            (c = this._handleTextColorOrProperties("forecolor", a)) ||
              (c = this.document.execCommand("forecolor", !1, a));
            return c;
          },
          _inserthtmlImpl: function(c) {
            c = this._preFilterContent(c);
            var b = !0;
            if (9 > u("ie")) {
              var d = this.document.selection.createRange();
              if ("CONTROL" === this.document.selection.type.toUpperCase()) {
                for (var e = d.item(0); d.length; ) d.remove(d.item(0));
                e.outerHTML = c;
              } else d.pasteHTML(c);
              d.select();
            } else if (8 > u("trident")) {
              var f = D.getSelection(this.window);
              if (f && f.rangeCount && f.getRangeAt) {
                d = f.getRangeAt(0);
                d.deleteContents();
                var k = a.create("div");
                k.innerHTML = c;
                for (
                  var m, e = this.document.createDocumentFragment();
                  (c = k.firstChild);

                )
                  m = e.appendChild(c);
                d.insertNode(e);
                m &&
                  ((d = d.cloneRange()),
                  d.setStartAfter(m),
                  d.collapse(!1),
                  f.removeAllRanges(),
                  f.addRange(d));
              }
            } else
              u("mozilla") && !c.length
                ? this.selection.remove()
                : (b = this.document.execCommand("inserthtml", !1, c));
            return b;
          },
          _boldImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident"))
              this._adaptIESelection(),
                (c = this._adaptIEFormatAreaAndExec("bold"));
            c || (c = this.document.execCommand("bold", !1, a));
            return c;
          },
          _italicImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident"))
              this._adaptIESelection(),
                (c = this._adaptIEFormatAreaAndExec("italic"));
            c || (c = this.document.execCommand("italic", !1, a));
            return c;
          },
          _underlineImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident"))
              this._adaptIESelection(),
                (c = this._adaptIEFormatAreaAndExec("underline"));
            c || (c = this.document.execCommand("underline", !1, a));
            return c;
          },
          _strikethroughImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident"))
              this._adaptIESelection(),
                (c = this._adaptIEFormatAreaAndExec("strikethrough"));
            c || (c = this.document.execCommand("strikethrough", !1, a));
            return c;
          },
          _superscriptImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident"))
              this._adaptIESelection(),
                (c = this._adaptIEFormatAreaAndExec("superscript"));
            c || (c = this.document.execCommand("superscript", !1, a));
            return c;
          },
          _subscriptImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident"))
              this._adaptIESelection(),
                (c = this._adaptIEFormatAreaAndExec("subscript"));
            c || (c = this.document.execCommand("subscript", !1, a));
            return c;
          },
          _fontnameImpl: function(a) {
            var c;
            if (u("ie") || u("trident"))
              c = this._handleTextColorOrProperties("fontname", a);
            c || (c = this.document.execCommand("fontname", !1, a));
            return c;
          },
          _fontsizeImpl: function(a) {
            var c;
            if (u("ie") || u("trident"))
              c = this._handleTextColorOrProperties("fontsize", a);
            c || (c = this.document.execCommand("fontsize", !1, a));
            return c;
          },
          _insertorderedlistImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident") || u("edge"))
              c = this._adaptIEList("insertorderedlist", a);
            c || (c = this.document.execCommand("insertorderedlist", !1, a));
            return c;
          },
          _insertunorderedlistImpl: function(a) {
            var c = !1;
            if (u("ie") || u("trident") || u("edge"))
              c = this._adaptIEList("insertunorderedlist", a);
            c || (c = this.document.execCommand("insertunorderedlist", !1, a));
            return c;
          },
          getHeaderHeight: function() {
            return this._getNodeChildrenHeight(this.header);
          },
          getFooterHeight: function() {
            return this._getNodeChildrenHeight(this.footer);
          },
          _getNodeChildrenHeight: function(a) {
            var c = 0;
            if (a && a.childNodes) {
              var b;
              for (b = 0; b < a.childNodes.length; b++)
                var d = m.position(a.childNodes[b]), c = c + d.h;
            }
            return c;
          },
          _isNodeEmpty: function(a, c) {
            return 1 === a.nodeType
              ? 0 < a.childNodes.length
                ? this._isNodeEmpty(a.childNodes[0], c)
                : !0
              : 3 === a.nodeType
              ? "" === a.nodeValue.substring(c)
              : !1;
          },
          _removeStartingRangeFromRange: function(a, c) {
            if (a.nextSibling) c.setStart(a.nextSibling, 0);
            else {
              for (a = a.parentNode; a && null == a.nextSibling; )
                a = a.parentNode;
              a && c.setStart(a.nextSibling, 0);
            }
            return c;
          },
          _adaptIESelection: function() {
            var a = D.getSelection(this.window);
            if (a && a.rangeCount && !a.isCollapsed) {
              for (
                var c = a.getRangeAt(0),
                  b = c.startContainer,
                  d = c.startOffset;
                3 === b.nodeType && d >= b.length && b.nextSibling;

              )
                (d -= b.length), (b = b.nextSibling);
              for (var e = null; this._isNodeEmpty(b, d) && b !== e; )
                (e = b),
                  (c = this._removeStartingRangeFromRange(b, c)),
                  (b = c.startContainer),
                  (d = 0);
              a.removeAllRanges();
              a.addRange(c);
            }
          },
          _adaptIEFormatAreaAndExec: function(c) {
            var b = D.getSelection(this.window),
              d = this.document,
              e,
              f,
              k,
              m,
              g,
              p,
              r;
            if (c && b && b.isCollapsed) {
              if (this.queryCommandValue(c)) {
                c = this._tagNamesForCommand(c);
                k = b.getRangeAt(0);
                m = k.startContainer;
                3 === m.nodeType &&
                  ((f = k.endOffset),
                  m.length < f &&
                    ((f = this._adjustNodeAndOffset(e, f)),
                    (m = f.node),
                    (f = f.offset)));
                for (; m && m !== this.editNode; ) {
                  e = m.tagName ? m.tagName.toLowerCase() : "";
                  if (-1 < n.indexOf(c, e)) {
                    r = m;
                    break;
                  }
                  m = m.parentNode;
                }
                if (
                  r &&
                  ((e = k.startContainer),
                  (c = d.createElement(r.tagName)),
                  a.place(c, r, "after"),
                  e && 3 === e.nodeType)
                ) {
                  f = k.endOffset;
                  e.length < f &&
                    ((f = this._adjustNodeAndOffset(e, f)),
                    (e = f.node),
                    (f = f.offset));
                  m = e.nodeValue;
                  k = d.createTextNode(m.substring(0, f));
                  var q = m.substring(f, m.length);
                  q && (g = d.createTextNode(q));
                  a.place(k, e, "before");
                  g &&
                    ((p = d.createElement("span")),
                    (p.className = "ieFormatBreakerSpan"),
                    a.place(p, e, "after"),
                    a.place(g, p, "after"),
                    (g = p));
                  a.destroy(e);
                  f = k.parentNode;
                  for (e = []; f !== r; ) {
                    m = f.tagName;
                    k = { tagName: m };
                    e.push(k);
                    m = d.createElement(m);
                    f.style &&
                      m.style &&
                      f.style.cssText &&
                      ((m.style.cssText = f.style.cssText),
                      (k.cssText = f.style.cssText));
                    "FONT" === f.tagName &&
                      (f.color && ((m.color = f.color), (k.color = f.color)),
                      f.face && ((m.face = f.face), (k.face = f.face)),
                      f.size && ((m.size = f.size), (k.size = f.size)));
                    f.className &&
                      ((m.className = f.className),
                      (k.className = f.className));
                    if (g)
                      for (; g; )
                        (k = g.nextSibling), m.appendChild(g), (g = k);
                    m.tagName == f.tagName
                      ? ((p = d.createElement("span")),
                        (p.className = "ieFormatBreakerSpan"),
                        a.place(p, f, "after"),
                        a.place(m, p, "after"))
                      : a.place(m, f, "after");
                    k = f;
                    g = m;
                    f = f.parentNode;
                  }
                  if (g) {
                    if (1 === g.nodeType || (3 === g.nodeType && g.nodeValue))
                      c.innerHTML = "";
                    for (; g; ) (k = g.nextSibling), c.appendChild(g), (g = k);
                  }
                  if (e.length) {
                    k = e.pop();
                    g = d.createElement(k.tagName);
                    k.cssText && g.style && (g.style.cssText = k.cssText);
                    k.className && (g.className = k.className);
                    "FONT" === k.tagName &&
                      (k.color && (g.color = k.color),
                      k.face && (g.face = k.face),
                      k.size && (g.size = k.size));
                    for (a.place(g, c, "before"); e.length; )
                      (k = e.pop()),
                        (r = d.createElement(k.tagName)),
                        k.cssText && r.style && (r.style.cssText = k.cssText),
                        k.className && (r.className = k.className),
                        "FONT" === k.tagName &&
                          (k.color && (r.color = k.color),
                          k.face && (r.face = k.face),
                          k.size && (r.size = k.size)),
                        g.appendChild(r),
                        (g = r);
                    r = d.createTextNode(".");
                    p.appendChild(r);
                    g.appendChild(r);
                  } else
                    (p = d.createElement("span")),
                      (p.className = "ieFormatBreakerSpan"),
                      (r = d.createTextNode(".")),
                      p.appendChild(r),
                      a.place(p, c, "before");
                  g = D.create(this.window);
                  g.setStart(r, 0);
                  g.setEnd(r, r.length);
                  b.removeAllRanges();
                  b.addRange(g);
                  this.selection.collapse(!1);
                  r.parentNode.innerHTML = "";
                  c.firstChild || a.destroy(c);
                  return !0;
                }
                return !1;
              }
              k = b.getRangeAt(0);
              if ((e = k.startContainer) && 3 === e.nodeType)
                return (
                  (f = k.startOffset),
                  e.length < f &&
                    ((f = this._adjustNodeAndOffset(e, f)),
                    (e = f.node),
                    (f = f.offset)),
                  (m = e.nodeValue),
                  (k = d.createTextNode(m.substring(0, f))),
                  (q = m.substring(f)),
                  "" !== q && (g = d.createTextNode(m.substring(f))),
                  (p = d.createElement("span")),
                  (r = d.createTextNode(".")),
                  p.appendChild(r),
                  k.length ? a.place(k, e, "after") : (k = e),
                  a.place(p, k, "after"),
                  g && a.place(g, p, "after"),
                  a.destroy(e),
                  (g = D.create(this.window)),
                  g.setStart(r, 0),
                  g.setEnd(r, r.length),
                  b.removeAllRanges(),
                  b.addRange(g),
                  d.execCommand(c),
                  a.place(p.firstChild, p, "before"),
                  a.destroy(p),
                  g.setStart(r, 0),
                  g.setEnd(r, r.length),
                  b.removeAllRanges(),
                  b.addRange(g),
                  this.selection.collapse(!1),
                  (r.parentNode.innerHTML = ""),
                  !0
                );
            } else return !1;
          },
          _adaptIEList: function(c) {
            var b = D.getSelection(this.window);
            if (b.isCollapsed && b.rangeCount && !this.queryCommandValue(c)) {
              var d = b.getRangeAt(0),
                f = d.startContainer;
              if (f && 3 == f.nodeType && !d.startOffset)
                return (
                  (d = "ul"),
                  "insertorderedlist" === c && (d = "ol"),
                  (c = this.document.createElement(d)),
                  (d = a.create("li", null, c)),
                  a.place(c, f, "before"),
                  d.appendChild(f),
                  a.create("br", null, c, "after"),
                  (c = D.create(this.window)),
                  c.setStart(f, 0),
                  c.setEnd(f, f.length),
                  b.removeAllRanges(),
                  b.addRange(c),
                  this.selection.collapse(!0),
                  !0
                );
            }
            return !1;
          },
          _handleTextColorOrProperties: function(c, b) {
            var d = D.getSelection(this.window),
              f = this.document,
              e,
              m,
              g,
              p,
              r;
            b = b || null;
            if (
              c &&
              d &&
              d.isCollapsed &&
              d.rangeCount &&
              ((m = d.getRangeAt(0)),
              (e = m.startContainer) && 3 === e.nodeType)
            ) {
              r = m.startOffset;
              e.length < r &&
                ((m = this._adjustNodeAndOffset(e, r)),
                (e = m.node),
                (r = m.offset));
              g = e.nodeValue;
              m = f.createTextNode(g.substring(0, r));
              "" !== g.substring(r) && (p = f.createTextNode(g.substring(r)));
              g = f.createElement("span");
              r = f.createTextNode(".");
              g.appendChild(r);
              f = f.createElement("span");
              g.appendChild(f);
              m.length ? a.place(m, e, "after") : (m = e);
              a.place(g, m, "after");
              p && a.place(p, g, "after");
              a.destroy(e);
              e = D.create(this.window);
              e.setStart(r, 0);
              e.setEnd(r, r.length);
              d.removeAllRanges();
              d.addRange(e);
              if (u("webkit")) {
                d = "color";
                if ("hilitecolor" === c || "backcolor" === c)
                  d = "backgroundColor";
                k.set(g, d, b);
                this.selection.remove();
                a.destroy(f);
                g.innerHTML = "\x26#160;";
                this.selection.selectElement(g);
                this.focus();
              } else
                this.execCommand(c, b),
                  a.place(g.firstChild, g, "before"),
                  a.destroy(g),
                  e.setStart(r, 0),
                  e.setEnd(r, r.length),
                  d.removeAllRanges(),
                  d.addRange(e),
                  this.selection.collapse(!1),
                  r.parentNode.removeChild(r);
              return !0;
            }
            return !1;
          },
          _adjustNodeAndOffset: function(a, c) {
            for (
              ;
              a.length < c && a.nextSibling && 3 === a.nextSibling.nodeType;

            )
              (c -= a.length), (a = a.nextSibling);
            return { node: a, offset: c };
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
          _stripBreakerNodes: function(c) {
            if (this.isLoaded)
              return (
                f(".ieFormatBreakerSpan", c).forEach(function(c) {
                  for (; c.firstChild; ) a.place(c.firstChild, c, "before");
                  a.destroy(c);
                }),
                c
              );
          },
          _stripTrailingEmptyNodes: function(c) {
            function b(a) {
              return (
                (/^(p|div|br)$/i.test(a.nodeName) &&
                  0 == a.children.length &&
                  /^[\s\xA0]*$/.test(a.textContent || a.innerText || "")) ||
                (3 === a.nodeType && /^[\s\xA0]*$/.test(a.nodeValue))
              );
            }
            for (; c.lastChild && b(c.lastChild); ) a.destroy(c.lastChild);
            return c;
          },
          _setTextDirAttr: function(a) {
            this._set("textDir", a);
            this.onLoadDeferred.then(
              q.hitch(this, function() {
                this.editNode.dir = a;
              })
            );
          }
        });
        return F;
      });
    },
    "dijit/_editor/range": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang"
      ], function(n, g, h) {
        var l = {
          getIndex: function(b, a) {
            for (var d = [], e = [], c = b, g, q; b != a; ) {
              var l = 0;
              for (g = b.parentNode; (q = g.childNodes[l++]); )
                if (q === b) {
                  --l;
                  break;
                }
              d.unshift(l);
              e.unshift(l - g.childNodes.length);
              b = g;
            }
            if (0 < d.length && 3 == c.nodeType) {
              for (q = c.previousSibling; q && 3 == q.nodeType; )
                d[d.length - 1]--, (q = q.previousSibling);
              for (q = c.nextSibling; q && 3 == q.nodeType; )
                e[e.length - 1]++, (q = q.nextSibling);
            }
            return { o: d, r: e };
          },
          getNode: function(b, a) {
            if (!h.isArray(b) || 0 == b.length) return a;
            var d = a;
            n.every(b, function(a) {
              if (0 <= a && a < d.childNodes.length) d = d.childNodes[a];
              else return (d = null), !1;
              return !0;
            });
            return d;
          },
          getCommonAncestor: function(b, a, e) {
            e = e || b.ownerDocument.body;
            var d = function(a) {
              for (var c = []; a; )
                if ((c.unshift(a), a !== e)) a = a.parentNode;
                else break;
              return c;
            };
            b = d(b);
            a = d(a);
            for (
              var d = Math.min(b.length, a.length), c = b[0], m = 1;
              m < d;
              m++
            )
              if (b[m] === a[m]) c = b[m];
              else break;
            return c;
          },
          getAncestor: function(b, a, e) {
            for (e = e || b.ownerDocument.body; b && b !== e; ) {
              var d = b.nodeName.toUpperCase();
              if (a.test(d)) return b;
              b = b.parentNode;
            }
            return null;
          },
          BlockTagNames: /^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/,
          getBlockAncestor: function(b, a, e) {
            e = e || b.ownerDocument.body;
            a = a || l.BlockTagNames;
            for (var d = null, c; b && b !== e; ) {
              var m = b.nodeName.toUpperCase();
              !d && a.test(m) && (d = b);
              !c && /^(?:BODY|TD|TH|CAPTION)$/.test(m) && (c = b);
              b = b.parentNode;
            }
            return { blockNode: d, blockContainer: c || b.ownerDocument.body };
          },
          atBeginningOfContainer: function(b, a, e) {
            var d = !1,
              c = 0 == e;
            c ||
              3 != a.nodeType ||
              (/^[\s\xA0]+$/.test(a.nodeValue.substr(0, e)) && (c = !0));
            if (c)
              for (d = !0; a && a !== b; ) {
                if (a.previousSibling) {
                  d = !1;
                  break;
                }
                a = a.parentNode;
              }
            return d;
          },
          atEndOfContainer: function(b, a, e) {
            var d = !1,
              c = e == (a.length || a.childNodes.length);
            c ||
              3 != a.nodeType ||
              (/^[\s\xA0]+$/.test(a.nodeValue.substr(e)) && (c = !0));
            if (c)
              for (d = !0; a && a !== b; ) {
                if (a.nextSibling) {
                  d = !1;
                  break;
                }
                a = a.parentNode;
              }
            return d;
          },
          adjacentNoneTextNode: function(b, a) {
            var d = b;
            b = 0 - b.length || 0;
            for (
              a = a ? "nextSibling" : "previousSibling";
              d && 3 == d.nodeType;

            )
              (b += d.length), (d = d[a]);
            return [d, b];
          },
          create: function(d) {
            d = d || window;
            return d.getSelection ? d.document.createRange() : new b();
          },
          getSelection: function(b, a) {
            if (b.getSelection) return b.getSelection();
            b = new e.selection(b);
            a || b._getCurrentSelection();
            return b;
          }
        };
        if (!window.getSelection)
          var e = (l.ie = {
              cachedSelection: {},
              selection: function(d) {
                this._ranges = [];
                this.addRange = function(a, b) {
                  this._ranges.push(a);
                  b || a._select();
                  this.rangeCount = this._ranges.length;
                };
                this.removeAllRanges = function() {
                  this._ranges = [];
                  this.rangeCount = 0;
                };
                this.getRangeAt = function(a) {
                  return this._ranges[a];
                };
                this._getCurrentSelection = function() {
                  this.removeAllRanges();
                  var a;
                  a = d.document.selection.createRange();
                  a =
                    "CONTROL" == d.document.selection.type.toUpperCase()
                      ? new b(e.decomposeControlRange(a))
                      : new b(e.decomposeTextRange(a));
                  this.addRange(a, !0), (this.isCollapsed = a.collapsed);
                };
              },
              decomposeControlRange: function(b) {
                var a = b.item(0),
                  d = b.item(b.length - 1);
                b = a.parentNode;
                var e = d.parentNode,
                  a = l.getIndex(a, b).o[0],
                  d = l.getIndex(d, e).o[0] + 1;
                return [b, a, e, d];
              },
              getEndPoint: function(b, a) {
                var d = b.duplicate();
                d.collapse(!a);
                var e = "EndTo" + (a ? "End" : "Start"),
                  c = d.parentElement(),
                  g,
                  q,
                  h;
                0 < c.childNodes.length
                  ? n.every(c.childNodes, function(a, k) {
                      var f;
                      if (3 != a.nodeType)
                        if (
                          (d.moveToElementText(a), 0 < d.compareEndPoints(e, b))
                        )
                          if (h && 3 == h.nodeType) (g = h), (f = !0);
                          else return (g = c), (q = k), !1;
                        else {
                          if (k == c.childNodes.length - 1)
                            return (g = c), (q = c.childNodes.length), !1;
                        }
                      else k == c.childNodes.length - 1 && ((g = a), (f = !0));
                      if (f && g)
                        return (
                          (g = (a = l.adjacentNoneTextNode(g)[0])
                            ? a.nextSibling
                            : c.firstChild),
                          (k = l.adjacentNoneTextNode(g)),
                          (a = k[0]),
                          (k = k[1]),
                          a
                            ? (d.moveToElementText(a), d.collapse(!1))
                            : d.moveToElementText(c),
                          d.setEndPoint(e, b),
                          (q = d.text.length - k),
                          !1
                        );
                      h = a;
                      return !0;
                    })
                  : ((g = c), (q = 0));
                a ||
                  1 != g.nodeType ||
                  q != g.childNodes.length ||
                  ((a = g.nextSibling) &&
                    3 == a.nodeType &&
                    ((g = a), (q = 0)));
                return [g, q];
              },
              setEndPoint: function(b, a, e) {
                b = b.duplicate();
                var d;
                if (3 != a.nodeType)
                  if (0 < e) {
                    if ((d = a.childNodes[e - 1]))
                      if (3 == d.nodeType) (a = d), (e = d.length);
                      else if (d.nextSibling && 3 == d.nextSibling.nodeType)
                        (a = d.nextSibling), (e = 0);
                      else {
                        b.moveToElementText(d.nextSibling ? d : a);
                        var c = d.parentNode;
                        d = c.insertBefore(
                          d.ownerDocument.createTextNode(" "),
                          d.nextSibling
                        );
                        b.collapse(!1);
                        c.removeChild(d);
                      }
                  } else b.moveToElementText(a), b.collapse(!0);
                3 == a.nodeType &&
                  ((d = l.adjacentNoneTextNode(a)),
                  (c = d[0]),
                  (d = d[1]),
                  c
                    ? (b.moveToElementText(c),
                      b.collapse(!1),
                      "inherit" != c.contentEditable && d++)
                    : (b.moveToElementText(a.parentNode),
                      b.collapse(!0),
                      b.move("character", 1),
                      b.move("character", -1)),
                  (e += d),
                  0 < e &&
                    b.move("character", e) != e &&
                    console.error("Error when moving!"));
                return b;
              },
              decomposeTextRange: function(b) {
                var a = e.getEndPoint(b),
                  d = a[0],
                  k = a[1],
                  c = a[0],
                  a = a[1];
                b.htmlText.length &&
                  (b.htmlText == b.text
                    ? (a = k + b.text.length)
                    : ((a = e.getEndPoint(b, !0)), (c = a[0]), (a = a[1])));
                return [d, k, c, a];
              },
              setRange: function(b, a, m, k, c, g) {
                a = e.setEndPoint(b, a, m);
                b.setEndPoint("StartToStart", a);
                if (!g) var d = e.setEndPoint(b, k, c);
                b.setEndPoint("EndToEnd", d || a);
                return b;
              }
            }),
            b = (l.W3CRange = g(null, {
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
                    ? l.getCommonAncestor(
                        this.startContainer,
                        this.endContainer
                      )
                    : this.startContainer;
                this.collapsed =
                  this.startContainer === this.endContainer &&
                  this.startOffset == this.endOffset;
              },
              setStart: function(b, a) {
                a = parseInt(a);
                if (this.startContainer !== b || this.startOffset != a)
                  delete this._cachedBookmark,
                    (this.startContainer = b),
                    (this.startOffset = a),
                    this.endContainer
                      ? this._updateInternal()
                      : this.setEnd(b, a);
              },
              setEnd: function(b, a) {
                a = parseInt(a);
                if (this.endContainer !== b || this.endOffset != a)
                  delete this._cachedBookmark,
                    (this.endContainer = b),
                    (this.endOffset = a),
                    this.startContainer
                      ? this._updateInternal()
                      : this.setStart(b, a);
              },
              setStartAfter: function(b, a) {
                this._setPoint("setStart", b, a, 1);
              },
              setStartBefore: function(b, a) {
                this._setPoint("setStart", b, a, 0);
              },
              setEndAfter: function(b, a) {
                this._setPoint("setEnd", b, a, 1);
              },
              setEndBefore: function(b, a) {
                this._setPoint("setEnd", b, a, 0);
              },
              _setPoint: function(b, a, e, k) {
                e = l.getIndex(a, a.parentNode).o;
                this[b](a.parentNode, e.pop() + k);
              },
              _getIERange: function() {
                var b = (
                  this._body || this.endContainer.ownerDocument.body
                ).createTextRange();
                e.setRange(
                  b,
                  this.startContainer,
                  this.startOffset,
                  this.endContainer,
                  this.endOffset,
                  this.collapsed
                );
                return b;
              },
              getBookmark: function() {
                this._getIERange();
                return this._cachedBookmark;
              },
              _select: function() {
                this._getIERange().select();
              },
              deleteContents: function() {
                var b = this.startContainer,
                  a = this._getIERange();
                3 !== b.nodeType || this.startOffset || this.setStartBefore(b);
                a.pasteHTML("");
                this.endContainer = this.startContainer;
                this.endOffset = this.startOffset;
                this.collapsed = !0;
              },
              cloneRange: function() {
                var d = new b([
                  this.startContainer,
                  this.startOffset,
                  this.endContainer,
                  this.endOffset
                ]);
                d._body = this._body;
                return d;
              },
              detach: function() {
                this.startContainer = this.commonAncestorContainer = this._body = null;
                this.startOffset = 0;
                this.endContainer = null;
                this.endOffset = 0;
                this.collapsed = !0;
              }
            }));
        h.setObject("dijit.range", l);
        return l;
      });
    },
    "dijit/_editor/html": function() {
      define(["dojo/_base/array", "dojo/_base/lang", "dojo/sniff"], function(
        n,
        g,
        h
      ) {
        var l = {};
        g.setObject("dijit._editor.html", l);
        var e = (l.escapeXml = function(b, d) {
          b = b
            .replace(/&/gm, "\x26amp;")
            .replace(/</gm, "\x26lt;")
            .replace(/>/gm, "\x26gt;")
            .replace(/"/gm, "\x26quot;");
          d || (b = b.replace(/'/gm, "\x26#39;"));
          return b;
        });
        l.getNodeHtml = function(b) {
          var d = [];
          l.getNodeHtmlHelper(b, d);
          return d.join("");
        };
        l.getNodeHtmlHelper = function(b, d) {
          switch (b.nodeType) {
            case 1:
              var a = b.nodeName.toLowerCase();
              if (!a || "/" == a.charAt(0)) return "";
              d.push("\x3c", a);
              var m = [],
                k = {},
                c;
              if (
                h("dom-attributes-explicit") ||
                h("dom-attributes-specified-flag")
              )
                for (var g = 0; (c = b.attributes[g++]); ) {
                  var q = c.name;
                  "_dj" === q.substr(0, 3) ||
                    (h("dom-attributes-specified-flag") && !c.specified) ||
                    q in k ||
                    ((c = c.value),
                    ("src" == q || "href" == q) &&
                      b.getAttribute("_djrealurl") &&
                      (c = b.getAttribute("_djrealurl")),
                    8 === h("ie") &&
                      "style" === q &&
                      (c = c
                        .replace("HEIGHT:", "height:")
                        .replace("WIDTH:", "width:")),
                    m.push([q, c]),
                    (k[q] = c));
                }
              else {
                var t = (/^input$|^img$/i.test(b.nodeName)
                    ? b
                    : b.cloneNode(!1)
                  ).outerHTML,
                  k = t.match(/[\w-]+=("[^"]*"|'[^']*'|\S*)/gi),
                  t = t.substr(0, t.indexOf("\x3e"));
                n.forEach(
                  k,
                  function(c) {
                    if (c) {
                      var d = c.indexOf("\x3d");
                      if (
                        0 < d &&
                        ((c = c.substring(0, d)), "_dj" != c.substr(0, 3))
                      )
                        if (
                          ("src" != c && "href" != c) ||
                          !b.getAttribute("_djrealurl")
                        ) {
                          var e;
                          switch (c) {
                            case "style":
                              e = b.style.cssText.toLowerCase();
                              break;
                            case "class":
                              e = b.className;
                              break;
                            case "width":
                              if ("img" === a) {
                                (d = /width=(\S+)/i.exec(t)) && (e = d[1]);
                                break;
                              }
                            case "height":
                              if ("img" === a) {
                                (d = /height=(\S+)/i.exec(t)) && (e = d[1]);
                                break;
                              }
                            default:
                              e = b.getAttribute(c);
                          }
                          null != e && m.push([c, e.toString()]);
                        } else m.push([c, b.getAttribute("_djrealurl")]);
                    }
                  },
                  this
                );
              }
              m.sort(function(a, c) {
                return a[0] < c[0] ? -1 : a[0] == c[0] ? 0 : 1;
              });
              for (k = 0; (c = m[k++]); )
                d.push(
                  " ",
                  c[0],
                  '\x3d"',
                  "string" === typeof c[1] ? e(c[1], !0) : c[1],
                  '"'
                );
              switch (a) {
                case "br":
                case "hr":
                case "img":
                case "input":
                case "base":
                case "meta":
                case "area":
                case "basefont":
                  d.push(" /\x3e");
                  break;
                case "script":
                  d.push("\x3e", b.innerHTML, "\x3c/", a, "\x3e");
                  break;
                default:
                  d.push("\x3e"),
                    b.hasChildNodes() && l.getChildrenHtmlHelper(b, d),
                    d.push("\x3c/", a, "\x3e");
              }
              break;
            case 4:
            case 3:
              d.push(e(b.nodeValue, !0));
              break;
            case 8:
              d.push("\x3c!--", e(b.nodeValue, !0), "--\x3e");
              break;
            default:
              d.push(
                "\x3c!-- Element not recognized - Type: ",
                b.nodeType,
                " Name: ",
                b.nodeName,
                "--\x3e"
              );
          }
        };
        l.getChildrenHtml = function(b) {
          var d = [];
          l.getChildrenHtmlHelper(b, d);
          return d.join("");
        };
        l.getChildrenHtmlHelper = function(b, d) {
          if (b)
            for (
              var a = b.childNodes || b, e = !h("ie") || a !== b, k, c = 0;
              (k = a[c++]);

            )
              (e && k.parentNode != b) || l.getNodeHtmlHelper(k, d);
        };
        return l;
      });
    },
    "dijit/_editor/plugins/LinkDialog": function() {
      define("require dojo/_base/declare dojo/dom-attr dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/query dojo/string ../_Plugin ../../form/DropDownButton ../range".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p) {
        var q = g("dijit._editor.plugins.LinkDialog", k, {
            buttonClass: c,
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
              this.button.loadDropDown = e.hitch(this, "_loadDropDown");
              this._connectTagEvents();
            },
            _loadDropDown: function(a) {
              n(
                "dojo/i18n ../../TooltipDialog ../../registry ../../form/Button ../../form/Select ../../form/ValidationTextBox dojo/i18n!../../nls/common dojo/i18n!../nls/LinkDialog".split(
                  " "
                ),
                e.hitch(this, function(c, d, f) {
                  var k = this;
                  this.tag = "insertImage" == this.command ? "img" : "a";
                  c = e.delegate(
                    c.getLocalization("dijit", "common", this.lang),
                    c.getLocalization("dijit._editor", "LinkDialog", this.lang)
                  );
                  var g = (this.dropDown = this.button.dropDown = new d({
                    title: c[this.command + "Title"],
                    ownerDocument: this.editor.ownerDocument,
                    dir: this.editor.dir,
                    execute: e.hitch(this, "setValue"),
                    onOpen: function() {
                      k._onOpenDialog();
                      d.prototype.onOpen.apply(this, arguments);
                    },
                    onCancel: function() {
                      setTimeout(e.hitch(k, "_onCloseDialog"), 0);
                    }
                  }));
                  c.urlRegExp = this.urlRegExp;
                  c.id = f.getUniqueId(this.editor.id);
                  this._uniqueId = c.id;
                  this._setContent(
                    g.title +
                      "\x3cdiv style\x3d'border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'\x3e\x3c/div\x3e" +
                      m.substitute(this.linkDialogTemplate, c)
                  );
                  g.startup();
                  this._urlInput = f.byId(this._uniqueId + "_urlInput");
                  this._textInput = f.byId(this._uniqueId + "_textInput");
                  this._setButton = f.byId(this._uniqueId + "_setButton");
                  this.own(
                    f
                      .byId(this._uniqueId + "_cancelButton")
                      .on("click", e.hitch(this.dropDown, "onCancel"))
                  );
                  this._urlInput &&
                    this.own(
                      this._urlInput.on(
                        "change",
                        e.hitch(this, "_checkAndFixInput")
                      )
                    );
                  this._textInput &&
                    this.own(
                      this._textInput.on(
                        "change",
                        e.hitch(this, "_checkAndFixInput")
                      )
                    );
                  this._urlRegExp = new RegExp("^" + this.urlRegExp + "$", "i");
                  this._emailRegExp = new RegExp(
                    "^" + this.emailRegExp + "$",
                    "i"
                  );
                  this._urlInput.isValid = e.hitch(this, function() {
                    var a = this._urlInput.get("value");
                    return this._urlRegExp.test(a) || this._emailRegExp.test(a);
                  });
                  this.own(
                    b(
                      g.domNode,
                      "keydown",
                      e.hitch(
                        this,
                        e.hitch(this, function(a) {
                          !a ||
                            a.keyCode != l.ENTER ||
                            a.shiftKey ||
                            a.metaKey ||
                            a.ctrlKey ||
                            a.altKey ||
                            this._setButton.get("disabled") ||
                            (g.onExecute(), g.execute(g.get("value")));
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
                c = this._urlInput.get("value");
              this._delayedCheck &&
                (clearTimeout(this._delayedCheck), (this._delayedCheck = null));
              this._delayedCheck = setTimeout(function() {
                var b = c,
                  d = !1,
                  f = !1;
                b &&
                  1 < b.length &&
                  ((b = e.trim(b)),
                  0 !== b.indexOf("mailto:") &&
                    (0 < b.indexOf("/")
                      ? -1 === b.indexOf("://") &&
                        "/" !== b.charAt(0) &&
                        b.indexOf("./") &&
                        0 !== b.indexOf("../") &&
                        a._hostRxp.test(b) &&
                        (d = !0)
                      : a._userAtRxp.test(b) && (f = !0)));
                d && a._urlInput.set("value", "http://" + b);
                f && a._urlInput.set("value", "mailto:" + b);
                a._setButton.set("disabled", !a._isValid());
              }, 250);
            },
            _connectTagEvents: function() {
              this.editor.onLoadDeferred.then(
                e.hitch(this, function() {
                  this.own(
                    b(
                      this.editor.editNode,
                      "mouseup",
                      e.hitch(this, "_onMouseUp")
                    )
                  );
                  this.own(
                    b(
                      this.editor.editNode,
                      "dblclick",
                      e.hitch(this, "_onDblClick")
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
            setValue: function(c) {
              this._onCloseDialog();
              if (9 > d("ie")) {
                var b = p.getSelection(this.editor.window).getRangeAt(0)
                  .endContainer;
                3 === b.nodeType && (b = b.parentNode);
                b &&
                  b.nodeName &&
                  b.nodeName.toLowerCase() !== this.tag &&
                  (b = this.editor.selection.getSelectedElement(this.tag));
                b &&
                  b.nodeName &&
                  b.nodeName.toLowerCase() === this.tag &&
                  this.editor.queryCommandEnabled("unlink") &&
                  (this.editor.selection.selectElementChildren(b),
                  this.editor.execCommand("unlink"));
              }
              c = this._checkValues(c);
              this.editor.execCommand(
                "inserthtml",
                m.substitute(this.htmlTemplate, c)
              );
              a("a", this.editor.document).forEach(function(a) {
                a.innerHTML || h.has(a, "name") || a.parentNode.removeChild(a);
              }, this);
            },
            _onCloseDialog: function() {
              this.editor.focused && this.editor.focus();
            },
            _getCurrentValues: function(a) {
              var c, b, d;
              a && a.tagName.toLowerCase() === this.tag
                ? ((c = a.getAttribute("_djrealurl") || a.getAttribute("href")),
                  (d = a.getAttribute("target") || "_self"),
                  (b = a.textContent || a.innerText),
                  this.editor.selection.selectElement(a, !0))
                : (b = this.editor.selection.getSelectedText());
              return {
                urlInput: c || "",
                textInput: b || "",
                targetSelect: d || ""
              };
            },
            _onOpenDialog: function() {
              var a, c;
              if (d("ie")) {
                if (((c = p.getSelection(this.editor.window)), c.rangeCount)) {
                  var b = c.getRangeAt(0);
                  a = b.endContainer;
                  3 === a.nodeType && (a = a.parentNode);
                  a &&
                    a.nodeName &&
                    a.nodeName.toLowerCase() !== this.tag &&
                    (a = this.editor.selection.getSelectedElement(this.tag));
                  if (
                    !a ||
                    (a.nodeName && a.nodeName.toLowerCase() !== this.tag)
                  )
                    (c = this.editor.selection.getAncestorElement(this.tag)) &&
                    c.nodeName &&
                    c.nodeName.toLowerCase() == this.tag
                      ? ((a = c), this.editor.selection.selectElement(a))
                      : b.startContainer === b.endContainer &&
                        (c = b.startContainer.firstChild) &&
                        c.nodeName &&
                        c.nodeName.toLowerCase() == this.tag &&
                        ((a = c), this.editor.selection.selectElement(a));
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
                  h.get(a, "href"))
              ) {
                var c = this.editor;
                this.editor.selection.selectElement(a);
                c.onDisplayChanged();
                c._updateTimer &&
                  (c._updateTimer.remove(), delete c._updateTimer);
                c.onNormalizedDisplayChanged();
                var b = this.button;
                setTimeout(function() {
                  b.set("disabled", !1);
                  b.loadAndOpenDropDown().then(function() {
                    b.dropDown.focus && b.dropDown.focus();
                  });
                }, 10);
              }
            },
            _onMouseUp: function() {
              if (d("ff")) {
                var a = this.editor.selection.getAncestorElement(this.tag);
                if (a) {
                  var c = p.getSelection(this.editor.window).getRangeAt(0);
                  if (c.collapsed && a.childNodes.length) {
                    var b = c.cloneRange();
                    b.selectNodeContents(a.childNodes[a.childNodes.length - 1]);
                    b.setStart(a.childNodes[0], 0);
                    1 !== c.compareBoundaryPoints(b.START_TO_START, b)
                      ? c.setStartBefore(a)
                      : -1 !== c.compareBoundaryPoints(b.END_TO_START, b) &&
                        c.setStartAfter(a);
                  }
                }
              }
            }
          }),
          t = g("dijit._editor.plugins.ImgLinkDialog", [q], {
            linkDialogTemplate:
              "\x3ctable role\x3d'presentation'\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_urlInput'\x3e${url}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput dojoType\x3d'dijit.form.ValidationTextBox' regExp\x3d'${urlRegExp}' required\x3d'true' id\x3d'${id}_urlInput' name\x3d'urlInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_textInput'\x3e${text}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'false' id\x3d'${id}_textInput' name\x3d'textInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'submit' id\x3d'${id}_setButton'\x3e${set}\x3c/button\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'button' id\x3d'${id}_cancelButton'\x3e${buttonCancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
            htmlTemplate:
              '\x3cimg src\x3d"${urlInput}" _djrealurl\x3d"${urlInput}" alt\x3d"${textInput}" /\x3e',
            tag: "img",
            _getCurrentValues: function(a) {
              var c, b;
              a && a.tagName.toLowerCase() === this.tag
                ? ((c = a.getAttribute("_djrealurl") || a.getAttribute("src")),
                  (b = a.getAttribute("alt")),
                  this.editor.selection.selectElement(a, !0))
                : (b = this.editor.selection.getSelectedText());
              return { urlInput: c || "", textInput: b || "" };
            },
            _isValid: function() {
              return this._urlInput.isValid();
            },
            _connectTagEvents: function() {
              this.inherited(arguments);
              this.editor.onLoadDeferred.then(
                e.hitch(this, function() {
                  this.own(
                    b(
                      this.editor.editNode,
                      "mousedown",
                      e.hitch(this, "_selectTag")
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
                  h.get(a, "src"))
              ) {
                var c = this.editor;
                this.editor.selection.selectElement(a);
                c.onDisplayChanged();
                c._updateTimer &&
                  (c._updateTimer.remove(), delete c._updateTimer);
                c.onNormalizedDisplayChanged();
                var b = this.button;
                setTimeout(function() {
                  b.set("disabled", !1);
                  b.loadAndOpenDropDown().then(function() {
                    b.dropDown.focus && b.dropDown.focus();
                  });
                }, 10);
              }
            }
          });
        k.registry.createLink = function() {
          return new q({ command: "createLink" });
        };
        k.registry.insertImage = function() {
          return new t({ command: "insertImage" });
        };
        q.ImgLinkDialog = t;
        return q;
      });
    },
    "dijit/_editor/plugins/TextColor": function() {
      define("require dojo/colors dojo/_base/declare dojo/_base/lang ../_Plugin ../../form/DropDownButton".split(
        " "
      ), function(n, g, h, l, e, b) {
        var d = h("dijit._editor.plugins.TextColor", e, {
          buttonClass: b,
          colorPicker: "dijit/ColorPalette",
          useDefaultCommand: !1,
          _initButton: function() {
            this.command = this.name;
            this.inherited(arguments);
            var a = this;
            this.button.loadDropDown = function(b) {
              function d(c) {
                a.button.dropDown = new c({
                  dir: a.editor.dir,
                  ownerDocument: a.editor.ownerDocument,
                  value: a.value,
                  onChange: function(c) {
                    a.editor.execCommand(a.command, c);
                  },
                  onExecute: function() {
                    a.editor.execCommand(a.command, this.get("value"));
                  }
                });
                b();
              }
              "string" == typeof a.colorPicker
                ? n([a.colorPicker], d)
                : d(a.colorPicker);
            };
          },
          updateState: function() {
            var a = this.editor,
              b = this.command;
            if (a && a.isLoaded && b.length) {
              if (this.button) {
                var d = this.get("disabled");
                this.button.set("disabled", d);
                if (d) return;
                var c;
                try {
                  c = a.queryCommandValue(b) || "";
                } catch (p) {
                  c = "";
                }
              }
              "" == c && (c = "#000000");
              "transparent" == c && (c = "#ffffff");
              "string" == typeof c
                ? -1 < c.indexOf("rgb") && (c = g.fromRgb(c).toHex())
                : ((c = (
                    ((c & 255) << 16) |
                    (c & 65280) |
                    ((c & 16711680) >>> 16)
                  ).toString(16)),
                  (c = "#000000".slice(0, 7 - c.length) + c));
              this.value = c;
              (a = this.button.dropDown) &&
                a.get &&
                c !== a.get("value") &&
                a.set("value", c, !1);
            }
          }
        });
        e.registry.foreColor = function(a) {
          return new d(a);
        };
        e.registry.hiliteColor = function(a) {
          return new d(a);
        };
        return d;
      });
    },
    "esri/dijit/editing/AttachmentEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/kernel dojo/has dojo/query dojo/io-query dojo/dom-attr dijit/_Widget dijit/_Templated dijit/ProgressBar ../../kernel ../../lang ../../domUtils dojo/text!./templates/AttachmentEditor.html dojo/i18n!../../nls/jsapi dojo/NodeList-dom".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q, t, f, y, u) {
        n = n([k, c], {
          declaredClass: "esri.dijit.editing.AttachmentEditor",
          widgetsInTemplate: !0,
          templateString: y,
          _listHtml:
            "\x3cspan id\x3d'node_${oid}_${attid}' style\x3d'display: flex;'\x3e\x3ca href\x3d'${href}' target\x3d'_blank'\x3e${name}\x3c/a\x3e",
          _deleteBtnHtml:
            "\x3cspan style\x3d'cursor:pointer;color:red;font-weight:bold;padding:0 2px;' class\x3d'deleteAttachment' id\x3d'${attid}');'\x3eX\x3c/span\x3e",
          _endHtml: "\x3cbr/\x3e\x3c/span\x3e",
          _aeConnects: [],
          _layerEditingCapChecked: {},
          _layerEditingCap: {},
          constructor: function(a, c) {
            g.mixin(this, u.widgets.attachmentEditor);
          },
          startup: function() {
            this.inherited(arguments);
            this._uploadField_connect = h.connect(
              this._uploadField,
              "onchange",
              this,
              function() {
                0 < this._uploadField.value.length && this._addAttachment();
              }
            );
            this._uploadFieldFocus_connect = h.connect(
              this._uploadField,
              "onfocus",
              g.hitch(this, function(a) {
                f.hide(this._attachmentError);
              })
            );
          },
          destroy: function() {
            l.forEach(this._aeConnects, h.disconnect);
            h.disconnect(this._uploadField_connect);
            h.disconnect(this._uploadFieldFocus_connect);
            this.inherited(arguments);
          },
          showAttachments: function(a, c) {
            this._attachmentList.innerHTML = this.NLS_none;
            this._uploadField.value = "";
            l.forEach(this.domNode.children, function(a, c) {
              f.show(a);
            });
            f.hide(this._attachmentError);
            a &&
              (this._featureLayer = a.getLayer() || c) &&
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
                : (c && c.getEditCapabilities()) ||
                  (f.hide(this._uploadForm),
                  l.forEach(this.domNode.children, function(a, c) {
                    f.hide(a);
                  })));
          },
          _getAttachments: function(a) {
            this._featureLayer &&
              this._featureLayer.queryAttachmentInfos &&
              this._featureLayer.queryAttachmentInfos(
                this._oid,
                g.hitch(this, "_onQueryAttachmentInfosComplete")
              );
          },
          _addAttachment: function() {
            f.hide(this._attachmentError);
            this._featureLayer && this._featureLayer.addAttachment
              ? (f.show(this._attachmentProgress),
                this._featureLayer.addAttachment(
                  this._oid,
                  this._uploadForm,
                  g.hitch(this, "_onAddAttachmentComplete"),
                  g.hitch(this, "_onAddAttachmentError")
                ))
              : (this._tempUpload = this._uploadForm);
          },
          _chainAttachment: function(a, c) {
            this._tempUpload &&
              (f.show(this._attachmentProgress),
              c.addAttachment(
                a,
                this._tempUpload,
                g.hitch(this, "_onAddAttachmentComplete"),
                g.hitch(this, "_onAddAttachmentError")
              ));
            this._tempUpload = null;
          },
          _deleteAttachment: function(a, c) {
            f.show(this._attachmentProgress);
            this._featureLayer.deleteAttachments(
              a,
              [c],
              g.hitch(this, "_onDeleteAttachmentComplete")
            );
          },
          _onQueryAttachmentInfosComplete: function(a) {
            var c = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._uploadForm.style.display = "block";
            (!this._featureCanUpdate &&
              this._layerEditingCap[this._currentLayerId].canUpdate) ||
            (!this._layerEditingCap[this._currentLayerId].canCreate &&
              !this._layerEditingCap[this._currentLayerId].canUpdate)
              ? ((c = this._listHtml + this._endHtml),
                (this._uploadForm.style.display = "none"))
              : this._layerEditingCap[this._currentLayerId].canCreate &&
                !this._layerEditingCap[this._currentLayerId].canUpdate &&
                (c = this._listHtml + this._endHtml);
            var b = this._attachmentList;
            a = l.map(
              a,
              g.hitch(this, function(a) {
                return t.substitute(
                  { href: a.url, name: a.name, oid: a.objectId, attid: a.id },
                  c
                );
              })
            );
            b.innerHTML = a.join("") || this.NLS_none;
            this._updateConnects();
          },
          _onAddAttachmentComplete: function(c) {
            f.hide(this._attachmentProgress.domNode);
            var b = this._attachmentList,
              d = this._uploadField,
              e = d.value,
              k = e.lastIndexOf("\\");
            -1 < k && (e = e.substring(k + 1, e.length));
            var e = e.replace(/\ /g, "_"),
              k = a.objectToQuery({
                gdbVersion: this._featureLayer.gdbVersion,
                token: this._featureLayer._getToken()
              }),
              m = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._layerEditingCap[this._currentLayerId].canCreate &&
              !this._layerEditingCap[this._currentLayerId].canUpdate &&
              (m = this._listHtml + this._endHtml);
            c = t.substitute(
              {
                href:
                  this._featureLayer._url.path +
                  "/" +
                  c.objectId +
                  "/attachments/" +
                  c.attachmentId +
                  (k ? "?" + k : ""),
                name: e,
                oid: c.objectId,
                attid: c.attachmentId
              },
              m
            );
            b.innerHTML = b.innerHTML == this.NLS_none ? c : b.innerHTML + c;
            this._updateConnects();
            d.value = "";
          },
          _onAddAttachmentError: function(a) {
            f.hide(this._attachmentProgress.domNode);
            if (a && t.isDefined(a.code)) {
              var c = this._attachmentError;
              m.set(
                c,
                "innerHTML",
                (400 === a.code
                  ? this.NLS_fileNotSupported
                  : a.message ||
                    (a.details && a.details.length && a.details[0])) ||
                  this.NLS_error
              );
              f.show(c);
            }
          },
          _onDeleteAttachmentComplete: function(a) {
            f.hide(this._attachmentProgress.domNode);
            var c = this._attachmentList;
            l.every(a, function(a) {
              return a.success;
            }) &&
              (e
                .query("#node_" + a[0].objectId + "_" + a[0].attachmentId)
                .orphan(),
              (c.children && c.children.length) ||
                (c.innerHTML = this.NLS_none));
          },
          _updateConnects: function() {
            l.forEach(this._aeConnects, h.disconnect);
            e.query(".deleteAttachment").forEach(function(a) {
              this._aeConnects.push(
                h.connect(
                  a,
                  "onclick",
                  g.hitch(this, "_deleteAttachment", this._oid, a.id)
                )
              );
            }, this);
          }
        });
        b("extend-esri") && g.setObject("dijit.editing.AttachmentEditor", n, q);
        return n;
      });
    },
    "dijit/ProgressBar": function() {
      define("require dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/number ./_Widget ./_TemplatedMixin dojo/text!./templates/ProgressBar.html".split(
        " "
      ), function(n, g, h, l, e, b, d, a) {
        return g("dijit.ProgressBar", [b, d], {
          progress: "0",
          value: "",
          maximum: 100,
          places: 0,
          indeterminate: !1,
          label: "",
          name: "",
          templateString: a,
          _indeterminateHighContrastImagePath: n.toUrl(
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
          _setDirAttr: function(a) {
            var b = "rtl" == a.toLowerCase();
            h.toggle(this.domNode, "dijitProgressBarRtl", b);
            h.toggle(
              this.domNode,
              "dijitProgressBarIndeterminateRtl",
              this.indeterminate && b
            );
            this.inherited(arguments);
          },
          update: function(a) {
            l.mixin(this, a || {});
            a = this.internalProgress;
            var b = this.domNode,
              c = 1;
            this.indeterminate
              ? b.removeAttribute("aria-valuenow")
              : (-1 != String(this.progress).indexOf("%")
                  ? ((c = Math.min(parseFloat(this.progress) / 100, 1)),
                    (this.progress = c * this.maximum))
                  : ((this.progress = Math.min(this.progress, this.maximum)),
                    (c = this.maximum ? this.progress / this.maximum : 0)),
                b.setAttribute("aria-valuenow", this.progress));
            b.setAttribute("aria-labelledby", this.labelNode.id);
            b.setAttribute("aria-valuemin", 0);
            b.setAttribute("aria-valuemax", this.maximum);
            this.labelNode.innerHTML = this.report(c);
            h.toggle(
              this.domNode,
              "dijitProgressBarIndeterminate",
              this.indeterminate
            );
            h.toggle(
              this.domNode,
              "dijitProgressBarIndeterminateRtl",
              this.indeterminate && !this.isLeftToRight()
            );
            a.style.width = 100 * c + "%";
            this.onChange();
          },
          _setValueAttr: function(a) {
            this._set("value", a);
            Infinity == a
              ? this.update({ indeterminate: !0 })
              : this.update({ indeterminate: !1, progress: a });
          },
          _setLabelAttr: function(a) {
            this._set("label", a);
            this.update();
          },
          _setIndeterminateAttr: function(a) {
            this._set("indeterminate", a);
            this.update();
          },
          report: function(a) {
            return this.label
              ? this.label
              : this.indeterminate
              ? "\x26#160;"
              : e.format(a, {
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
      ], function(n, g, h, l) {
        var e = {},
          e = {
            findFeatures: function(b, d, a) {
              var e = d.objectIdField;
              d = g.filter(d.graphics, function(a) {
                return g.some(b, function(c) {
                  return a.attributes[e] === c.objectId;
                });
              });
              if (a) a(d);
              else return d;
            },
            getSelection: function(b) {
              var d = [];
              g.forEach(b, function(a) {
                a = a.getSelectedFeatures();
                g.forEach(a, function(a) {
                  d.push(a);
                });
              });
              return d;
            },
            sortFeaturesById: function(b, d) {
              var a = g.map(b, function(a) {
                return a.featureLayer;
              });
              d.sort(function(b, d) {
                var c = b.getLayer(),
                  e = d.getLayer();
                if (!c) return -1;
                if (!e) return 1;
                var k = g.indexOf(a, c),
                  e = g.indexOf(a, e),
                  k = k - e;
                k ||
                  ((c = c.objectIdField),
                  (k = b.attributes[c] - d.attributes[c]));
                return k;
              });
              return d;
            }
          };
        h("extend-esri") && n.setObject("dijit.editing.Util.LayerHelper", e, l);
        return e;
      });
    },
    "dojox/date/islamic": function() {
      define([
        "dojox/main",
        "dojo/_base/lang",
        "dojo/date",
        "./islamic/Date"
      ], function(n, g, h, l) {
        var e = g.getObject("date.islamic", !0, n);
        e.getDaysInMonth = function(b) {
          return b.getDaysInIslamicMonth(b.getMonth(), b.getFullYear());
        };
        e.compare = function(b, d, a) {
          b instanceof l && (b = b.toGregorian());
          d instanceof l && (d = d.toGregorian());
          return h.compare.apply(null, arguments);
        };
        e.add = function(b, d, a) {
          var e = new l(b);
          switch (d) {
            case "day":
              e.setDate(b.getDate() + a);
              break;
            case "weekday":
              var k = b.getDay();
              if (5 > k + a && 0 < k + a) e.setDate(b.getDate() + a);
              else {
                var c = (d = 0);
                5 == k
                  ? ((k = 4), (c = 0 < a ? -1 : 1))
                  : 6 == k && ((k = 4), (c = 0 < a ? -2 : 2));
                var k = 0 < a ? 5 - k - 1 : -k,
                  g = a - k,
                  q = parseInt(g / 5);
                0 != g % 5 && (d = 0 < a ? 2 : -2);
                d = d + 7 * q + (g % 5) + k;
                e.setDate(b.getDate() + d + c);
              }
              break;
            case "year":
              e.setFullYear(b.getFullYear() + a);
              break;
            case "week":
              a *= 7;
              e.setDate(b.getDate() + a);
              break;
            case "month":
              b = b.getMonth();
              e.setMonth(b + a);
              break;
            case "hour":
              e.setHours(b.getHours() + a);
              break;
            case "minute":
              e._addMinutes(a);
              break;
            case "second":
              e._addSeconds(a);
              break;
            case "millisecond":
              e._addMilliseconds(a);
          }
          return e;
        };
        e.difference = function(b, d, a) {
          d = d || new l();
          a = a || "day";
          var g = d.getFullYear() - b.getFullYear(),
            k = 1;
          switch (a) {
            case "weekday":
              g = Math.round(e.difference(b, d, "day"));
              k = parseInt(e.difference(b, d, "week"));
              if (0 == g % 7) g = 5 * k;
              else {
                a = 0;
                var c = b.getDay(),
                  p = d.getDay(),
                  k = parseInt(g / 7);
                d = g % 7;
                b = new l(b);
                b.setDate(b.getDate() + 7 * k);
                b = b.getDay();
                if (0 < g)
                  switch (!0) {
                    case 5 == c:
                      a = -1;
                      break;
                    case 6 == c:
                      a = 0;
                      break;
                    case 5 == p:
                      a = -1;
                      break;
                    case 6 == p:
                      a = -2;
                      break;
                    case 5 < b + d:
                      a = -2;
                  }
                else if (0 > g)
                  switch (!0) {
                    case 5 == c:
                      a = 0;
                      break;
                    case 6 == c:
                      a = 1;
                      break;
                    case 5 == p:
                      a = 2;
                      break;
                    case 6 == p:
                      a = 1;
                      break;
                    case 0 > b + d:
                      a = 2;
                  }
                g = g + a - 2 * k;
              }
              k = g;
              break;
            case "year":
              k = g;
              break;
            case "month":
              a = d.toGregorian() > b.toGregorian() ? d : b;
              c = d.toGregorian() > b.toGregorian() ? b : d;
              k = a.getMonth();
              p = c.getMonth();
              if (0 == g) k = a.getMonth() - c.getMonth();
              else
                for (
                  k = 12 - p + k,
                    g = c.getFullYear() + 1,
                    a = a.getFullYear(),
                    g;
                  g < a;
                  g++
                )
                  k += 12;
              d.toGregorian() < b.toGregorian() && (k = -k);
              break;
            case "week":
              k = parseInt(e.difference(b, d, "day") / 7);
              break;
            case "day":
              k /= 24;
            case "hour":
              k /= 60;
            case "minute":
              k /= 60;
            case "second":
              k /= 1e3;
            case "millisecond":
              k *= d.toGregorian().getTime() - b.toGregorian().getTime();
          }
          return Math.round(k);
        };
        return e;
      });
    },
    "dojox/date/islamic/Date": function() {
      define(["dojo/_base/lang", "dojo/_base/declare", "dojo/date"], function(
        n,
        g,
        h
      ) {
        var l = g("dojox.date.islamic.Date", null, {
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
            var e = arguments.length;
            e
              ? 1 == e
                ? ((e = arguments[0]),
                  "number" == typeof e && (e = new Date(e)),
                  e instanceof Date
                    ? this.fromGregorian(e)
                    : "" == e
                    ? (this._date = new Date(""))
                    : ((this._year = e._year),
                      (this._month = e._month),
                      (this._date = e._date),
                      (this._hours = e._hours),
                      (this._minutes = e._minutes),
                      (this._seconds = e._seconds),
                      (this._milliseconds = e._milliseconds)))
                : 3 <= e &&
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
          setDate: function(e) {
            e = parseInt(e);
            if (
              !(
                0 < e &&
                e <= this.getDaysInIslamicMonth(this._month, this._year)
              )
            ) {
              var b;
              if (0 < e)
                for (
                  b = this.getDaysInIslamicMonth(this._month, this._year);
                  e > b;
                  e -= b,
                    b = this.getDaysInIslamicMonth(this._month, this._year)
                )
                  this._month++,
                    12 <= this._month && (this._year++, (this._month -= 12));
              else
                for (
                  b = this.getDaysInIslamicMonth(
                    0 <= this._month - 1 ? this._month - 1 : 11,
                    0 <= this._month - 1 ? this._year : this._year - 1
                  );
                  0 >= e;
                  b = this.getDaysInIslamicMonth(
                    0 <= this._month - 1 ? this._month - 1 : 11,
                    0 <= this._month - 1 ? this._year : this._year - 1
                  )
                )
                  this._month--,
                    0 > this._month && (this._year--, (this._month += 12)),
                    (e += b);
            }
            this._date = e;
            return this;
          },
          setFullYear: function(e) {
            this._year = +e;
          },
          setMonth: function(e) {
            this._year += Math.floor(e / 12);
            this._month =
              0 < e ? Math.floor(e % 12) : Math.floor(((e % 12) + 12) % 12);
          },
          setHours: function() {
            var e = arguments.length,
              b = 0;
            1 <= e && (b = parseInt(arguments[0]));
            2 <= e && (this._minutes = parseInt(arguments[1]));
            3 <= e && (this._seconds = parseInt(arguments[2]));
            4 == e && (this._milliseconds = parseInt(arguments[3]));
            for (; 24 <= b; )
              this._date++,
                (e = this.getDaysInIslamicMonth(this._month, this._year)),
                this._date > e &&
                  (this._month++,
                  12 <= this._month && (this._year++, (this._month -= 12)),
                  (this._date -= e)),
                (b -= 24);
            this._hours = b;
          },
          _addMinutes: function(e) {
            e += this._minutes;
            this.setMinutes(e);
            this.setHours(this._hours + parseInt(e / 60));
            return this;
          },
          _addSeconds: function(e) {
            e += this._seconds;
            this.setSeconds(e);
            this._addMinutes(parseInt(e / 60));
            return this;
          },
          _addMilliseconds: function(e) {
            e += this._milliseconds;
            this.setMilliseconds(e);
            this._addSeconds(parseInt(e / 1e3));
            return this;
          },
          setMinutes: function(e) {
            this._minutes = e % 60;
            return this;
          },
          setSeconds: function(e) {
            this._seconds = e % 60;
            return this;
          },
          setMilliseconds: function(e) {
            this._milliseconds = e % 1e3;
            return this;
          },
          toString: function() {
            if (isNaN(this._date)) return "Invalidate Date";
            var e = new Date();
            e.setHours(this._hours);
            e.setMinutes(this._minutes);
            e.setSeconds(this._seconds);
            e.setMilliseconds(this._milliseconds);
            return (
              this._month +
              " " +
              this._date +
              " " +
              this._year +
              " " +
              e.toTimeString()
            );
          },
          toGregorian: function() {
            var e = this._year,
              e =
                Math.floor(
                  this._date +
                    Math.ceil(29.5 * this._month) +
                    354 * (e - 1) +
                    Math.floor((3 + 11 * e) / 30) +
                    this._ISLAMIC_EPOCH -
                    1 -
                    0.5
                ) + 0.5,
              b = e - this._GREGORIAN_EPOCH,
              d = Math.floor(b / 146097),
              a = this._mod(b, 146097),
              b = Math.floor(a / 36524),
              g = this._mod(a, 36524),
              a = Math.floor(g / 1461),
              g = this._mod(g, 1461),
              g = Math.floor(g / 365),
              d = 400 * d + 100 * b + 4 * a + g;
            4 != b && 4 != g && d++;
            b =
              e -
              (this._GREGORIAN_EPOCH +
                365 * (d - 1) +
                Math.floor((d - 1) / 4) -
                Math.floor((d - 1) / 100) +
                Math.floor((d - 1) / 400));
            a =
              this._GREGORIAN_EPOCH -
              1 +
              365 * (d - 1) +
              Math.floor((d - 1) / 4) -
              Math.floor((d - 1) / 100) +
              Math.floor((d - 1) / 400) +
              Math.floor(
                739 / 12 + (h.isLeapYear(new Date(d, 3, 1)) ? -1 : -2) + 1
              );
            a = e < a ? 0 : h.isLeapYear(new Date(d, 3, 1)) ? 1 : 2;
            b = Math.floor((12 * (b + a) + 373) / 367);
            a =
              this._GREGORIAN_EPOCH -
              1 +
              365 * (d - 1) +
              Math.floor((d - 1) / 4) -
              Math.floor((d - 1) / 100) +
              Math.floor((d - 1) / 400) +
              Math.floor(
                (367 * b - 362) / 12 +
                  (2 >= b ? 0 : h.isLeapYear(new Date(d, b - 1, 1)) ? -1 : -2) +
                  1
              );
            return new Date(
              d,
              b - 1,
              e - a + 1,
              this._hours,
              this._minutes,
              this._seconds,
              this._milliseconds
            );
          },
          fromGregorian: function(e) {
            e = new Date(e);
            var b = e.getFullYear(),
              d = e.getMonth(),
              a = e.getDate(),
              b =
                this._GREGORIAN_EPOCH -
                1 +
                365 * (b - 1) +
                Math.floor((b - 1) / 4) +
                -Math.floor((b - 1) / 100) +
                Math.floor((b - 1) / 400) +
                Math.floor(
                  (367 * (d + 1) - 362) / 12 +
                    (2 >= d + 1 ? 0 : h.isLeapYear(e) ? -1 : -2) +
                    a
                ),
              b = Math.floor(b) + 0.5,
              b = b - this._ISLAMIC_EPOCH,
              d = Math.floor((30 * b + 10646) / 10631),
              a = Math.ceil((b - 29 - this._yearStart(d)) / 29.5),
              a = Math.min(a, 11);
            this._date = Math.ceil(b - this._monthStart(d, a)) + 1;
            this._month = a;
            this._year = d;
            this._hours = e.getHours();
            this._minutes = e.getMinutes();
            this._seconds = e.getSeconds();
            this._milliseconds = e.getMilliseconds();
            this._day = e.getDay();
            return this;
          },
          valueOf: function() {
            return this.toGregorian().valueOf();
          },
          _yearStart: function(e) {
            return 354 * (e - 1) + Math.floor((3 + 11 * e) / 30);
          },
          _monthStart: function(e, b) {
            return (
              Math.ceil(29.5 * b) +
              354 * (e - 1) +
              Math.floor((3 + 11 * e) / 30)
            );
          },
          _civilLeapYear: function(e) {
            return 11 > (14 + 11 * e) % 30;
          },
          getDaysInIslamicMonth: function(e, b) {
            var d = 0,
              d = 29 + ((e + 1) % 2);
            11 == e && this._civilLeapYear(b) && d++;
            return d;
          },
          _mod: function(e, b) {
            return e - b * Math.floor(e / b);
          }
        });
        l.getDaysInIslamicMonth = function(e) {
          return new l().getDaysInIslamicMonth(e.getMonth(), e.getFullYear());
        };
        return l;
      });
    },
    "dojox/date/islamic/locale": function() {
      define("dojox/main dojo/_base/lang dojo/_base/array dojo/date dojo/i18n dojo/regexp dojo/string ./Date dojo/i18n!dojo/cldr/nls/islamic".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m) {
        function k(a, c, b, e, k) {
          return k.replace(/([a-z])\1*/gi, function(b) {
            var e,
              f,
              g = b.charAt(0);
            b = b.length;
            var m = ["abbr", "wide", "narrow"];
            switch (g) {
              case "G":
                e = c.eraAbbr[0];
                break;
              case "y":
                e = String(a.getFullYear());
                break;
              case "M":
                e = a.getMonth();
                3 > b
                  ? ((e += 1), (f = !0))
                  : ((g = ["months-format", m[b - 3]].join("-")),
                    (e = c[g][e]));
                break;
              case "d":
                e = a.getDate(!0);
                f = !0;
                break;
              case "E":
                e = a.getDay();
                3 > b
                  ? ((e += 1), (f = !0))
                  : ((g = ["days-format", m[b - 3]].join("-")), (e = c[g][e]));
                break;
              case "a":
                e = 12 > a.getHours() ? "am" : "pm";
                e = c["dayPeriods-format-wide-" + e];
                break;
              case "h":
              case "H":
              case "K":
              case "k":
                f = a.getHours();
                switch (g) {
                  case "h":
                    e = f % 12 || 12;
                    break;
                  case "H":
                    e = f;
                    break;
                  case "K":
                    e = f % 12;
                    break;
                  case "k":
                    e = f || 24;
                }
                f = !0;
                break;
              case "m":
                e = a.getMinutes();
                f = !0;
                break;
              case "s":
                e = a.getSeconds();
                f = !0;
                break;
              case "S":
                e = Math.round(a.getMilliseconds() * Math.pow(10, b - 3));
                f = !0;
                break;
              case "z":
                if ((e = l.getTimezoneName(a.toGregorian()))) break;
                b = 4;
              case "Z":
                e = a.toGregorian().getTimezoneOffset();
                e = [
                  0 >= e ? "+" : "-",
                  d.pad(Math.floor(Math.abs(e) / 60), 2),
                  d.pad(Math.abs(e) % 60, 2)
                ];
                4 == b && (e.splice(0, 0, "GMT"), e.splice(3, 0, ":"));
                e = e.join("");
                break;
              default:
                throw Error(
                  "dojox.date.islamic.locale.formatPattern: invalid pattern char: " +
                    k
                );
            }
            f && (e = d.pad(e, b));
            return e;
          });
        }
        function c(a, c, b, d) {
          var e = function(a) {
            return a;
          };
          c = c || e;
          b = b || e;
          d = d || e;
          var f = a.match(/(''|[^'])+/g),
            k = "'" == a.charAt(0);
          h.forEach(f, function(a, d) {
            a ? ((f[d] = (k ? b : c)(a)), (k = !k)) : (f[d] = "");
          });
          return d(f.join(""));
        }
        function p(a, c, d, k) {
          k = b.escapeString(k);
          e.normalizeLocale(d.locale);
          return k
            .replace(/([a-z])\1*/gi, function(b) {
              var e;
              e = b.charAt(0);
              var f = b.length,
                k = "";
              d.strict ? 1 < f && (k = "0{" + (f - 1) + "}") : (k = "0?");
              switch (e) {
                case "y":
                  e = "\\d+";
                  break;
                case "M":
                  e = 2 < f ? "\\S+ ?\\S+" : k + "[1-9]|1[0-2]";
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
                  e = "\\d{" + f + "}";
                  break;
                case "a":
                  f = d.am || c["dayPeriods-format-wide-am"];
                  k = d.pm || c["dayPeriods-format-wide-pm"];
                  d.strict
                    ? (e = f + "|" + k)
                    : ((e = f + "|" + k),
                      f != f.toLowerCase() && (e += "|" + f.toLowerCase()),
                      k != k.toLowerCase() && (e += "|" + k.toLowerCase()));
                  break;
                default:
                  e = ".*";
              }
              a && a.push(b);
              return "(" + e + ")";
            })
            .replace(/[\xa0 ]/g, "[\\s\\xa0]");
        }
        var q = g.getObject("date.islamic.locale", !0, n);
        q.format = function(a, b) {
          b = b || {};
          var d = e.normalizeLocale(b.locale),
            f = b.formatLength || "short",
            m = q._getIslamicBundle(d),
            p = [],
            d = g.hitch(this, k, a, m, d, b.fullYear);
          if ("year" == b.selector) return a.getFullYear();
          "time" != b.selector &&
            (a = b.datePattern || m["dateFormat-" + f]) &&
            p.push(c(a, d));
          "date" != b.selector &&
            (b = b.timePattern || m["timeFormat-" + f]) &&
            p.push(c(b, d));
          return p.join(" ");
        };
        q.regexp = function(a) {
          return q._parseInfo(a).regexp;
        };
        q._parseInfo = function(a) {
          a = a || {};
          var b = e.normalizeLocale(a.locale),
            b = q._getIslamicBundle(b),
            d = a.formatLength || "short",
            f = a.datePattern || b["dateFormat-" + d],
            d = a.timePattern || b["timeFormat-" + d],
            k = [];
          return {
            regexp: c(
              "date" == a.selector
                ? f
                : "time" == a.selector
                ? d
                : "undefined" == typeof d
                ? f
                : f + " " + d,
              g.hitch(this, p, k, b, a)
            ),
            tokens: k,
            bundle: b
          };
        };
        q.parse = function(c, b) {
          c = c.replace(/[\u200E\u200F\u202A\u202E]/g, "");
          b || (b = {});
          var d = q._parseInfo(b),
            f = d.tokens,
            k = d.bundle,
            d = d.regexp.replace(/[\u200E\u200F\u202A\u202E]/g, "");
          c = new RegExp("^" + d + "$").exec(c);
          e.normalizeLocale(b.locale);
          if (!c) return null;
          var g = [1389, 0, 1, 0, 0, 0, 0],
            m = "",
            p = ["abbr", "wide", "narrow"];
          h.every(c, function(a, c) {
            if (!c) return !0;
            c = f[c - 1];
            var d = c.length;
            switch (c.charAt(0)) {
              case "y":
                g[0] = Number(a);
                break;
              case "M":
                if (2 < d) {
                  if (
                    ((c = k["months-format-" + p[d - 3]].concat()),
                    b.strict ||
                      ((a = a.replace(".", "").toLowerCase()),
                      (c = h.map(c, function(a) {
                        return a ? a.replace(".", "").toLowerCase() : a;
                      }))),
                    (a = h.indexOf(c, a)),
                    -1 == a)
                  )
                    return !1;
                } else a--;
                g[1] = Number(a);
                break;
              case "D":
                g[1] = 0;
              case "d":
                g[2] = Number(a);
                break;
              case "a":
                c = b.am || k["dayPeriods-format-wide-am"];
                d = b.pm || k["dayPeriods-format-wide-pm"];
                if (!b.strict) {
                  var e = /\./g;
                  a = a.replace(e, "").toLowerCase();
                  c = c.replace(e, "").toLowerCase();
                  d = d.replace(e, "").toLowerCase();
                }
                if (b.strict && a != c && a != d) return !1;
                m = a == d ? "p" : a == c ? "a" : "";
                break;
              case "K":
                24 == a && (a = 0);
              case "h":
              case "H":
              case "k":
                g[3] = Number(a);
                break;
              case "m":
                g[4] = Number(a);
                break;
              case "s":
                g[5] = Number(a);
                break;
              case "S":
                g[6] = Number(a);
            }
            return !0;
          });
          c = +g[3];
          "p" === m && 12 > c
            ? (g[3] = c + 12)
            : "a" === m && 12 == c && (g[3] = 0);
          return new a(g[0], g[1], g[2], g[3], g[4], g[5], g[6]);
        };
        var t = [];
        q.addCustomFormats = function(a, c) {
          t.push({ pkg: a, name: c });
        };
        q._getIslamicBundle = function(a) {
          var c = {};
          h.forEach(
            t,
            function(b) {
              b = e.getLocalization(b.pkg, b.name, a);
              c = g.mixin(c, b);
            },
            this
          );
          return c;
        };
        q.addCustomFormats("dojo.cldr", "islamic");
        q.getNames = function(a, c, b, d, e) {
          var f;
          d = q._getIslamicBundle(d);
          a = [a, b, c];
          "standAlone" == b &&
            ((b = a.join("-")), (f = d[b]), 1 == f[0] && (f = void 0));
          a[1] = "format";
          return (f || d[a.join("-")]).concat();
        };
        q.weekDays = q.getNames("days", "wide", "format");
        q.months = q.getNames("months", "wide", "format");
        return q;
      });
    },
    "esri/dijit/editing/Add": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ./EditOperationBase".split(
        " "
      ), function(n, g, h, l, e, b) {
        g = g(b, {
          declaredClass: "esri.dijit.editing.Add",
          type: "edit",
          label: "Add Features",
          constructor: function(b) {
            b = b || {};
            b.featureLayer
              ? ((this._featureLayer = b.featureLayer),
                b.addedGraphics
                  ? (this._addedGraphics = b.addedGraphics)
                  : console.error(
                      "In constructor of 'esri.dijit.editing.Add', no graphics provided"
                    ))
              : console.error(
                  "In constructor of 'esri.dijit.editing.Add', featureLayer is not provided"
                );
          },
          updateObjectIds: function(b, a) {
            this.updateIds(this._featureLayer, this._addedGraphics, b, a);
          },
          performUndo: function() {
            return this._featureLayer
              .applyEdits(null, null, this._addedGraphics)
              .then(
                h.hitch(this, function() {
                  return { layer: this._featureLayer, operation: this };
                })
              );
          },
          performRedo: function() {
            var b = n.map(
              this._addedGraphics,
              function(a) {
                return a.attributes[this._featureLayer.objectIdField];
              },
              this
            );
            return this._featureLayer
              .applyEdits(this._addedGraphics, null, null)
              .then(
                h.hitch(this, function(a, d, e) {
                  a = n.map(a, function(a) {
                    return a.objectId;
                  });
                  return {
                    oldIds: b,
                    addedIds: a,
                    layer: this._featureLayer,
                    operation: this
                  };
                })
              );
          }
        });
        l("extend-esri") && h.setObject("dijit.editing.Add", g, e);
        return g;
      });
    },
    "esri/dijit/editing/EditOperationBase": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/has",
        "../../kernel",
        "../../OperationBase"
      ], function(n, g, h, l, e) {
        g = g(e, {
          declaredClass: "esri.EditOperationBase",
          updateIds: function(b, d, a, e) {
            n.forEach(d, function(d, c) {
              var k = d[b.objectIdField];
              n.forEach(a, function(a, c) {
                k === a && (d[b.objectIdField] = e[c]);
              });
            });
          }
        });
        h("extend-esri") && (l.EditOperationBase = g);
        return g;
      });
    },
    "esri/dijit/editing/Update": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ../../geometry/jsonUtils ./EditOperationBase".split(
        " "
      ), function(n, g, h, l, e, b, d) {
        n = g(d, {
          declaredClass: "esri.dijit.editing.Update",
          type: "edit",
          label: "Update Features",
          constructor: function(a) {
            var b;
            a = a || {};
            if (a.featureLayer)
              if (
                ((this._featureLayer = a.featureLayer), a.preUpdatedGraphics)
              ) {
                this._preUpdatedGraphicsGeometries = [];
                this._preUpdatedGraphicsAttributes = [];
                for (b = 0; b < a.preUpdatedGraphics.length; b++)
                  this._preUpdatedGraphicsGeometries.push(
                    a.preUpdatedGraphics[b].geometry.toJson()
                  ),
                    this._preUpdatedGraphicsAttributes.push(
                      a.preUpdatedGraphics[b].attributes
                    );
                if (a.postUpdatedGraphics)
                  for (
                    this._postUpdatedGraphics = a.postUpdatedGraphics,
                      this._postUpdatedGraphicsGeometries = [],
                      this._postUpdatedGraphicsAttributes = [],
                      b = 0;
                    b < a.postUpdatedGraphics.length;
                    b++
                  )
                    a.postUpdatedGraphics[b].geometry
                      ? this._postUpdatedGraphicsGeometries.push(
                          a.postUpdatedGraphics[b].geometry.toJson()
                        )
                      : this._postUpdatedGraphicsGeometries.push(
                          a.postUpdatedGraphics[b].geometry
                        ),
                      this._postUpdatedGraphicsAttributes.push(
                        h.clone(a.postUpdatedGraphics[b].attributes)
                      );
                else
                  console.error(
                    "In constructor of 'esri.dijit.editing.Update', postUpdatedGraphics not provided"
                  );
              } else
                console.error(
                  "In constructor of 'esri.dijit.editing.Update', preUpdatedGraphics not provided"
                );
            else
              console.error(
                "In constructor of 'esri.dijit.editing.Update', featureLayer not provided"
              );
          },
          updateObjectIds: function(a, b) {
            this.updateIds(
              this._featureLayer,
              this._preUpdatedGraphicsAttributes,
              a,
              b
            );
            this.updateIds(
              this._featureLayer,
              this._postUpdatedGraphicsAttributes,
              a,
              b
            );
          },
          performUndo: function() {
            var a;
            for (a = 0; a < this._postUpdatedGraphics.length; a++)
              this._preUpdatedGraphicsGeometries[a]
                ? this._postUpdatedGraphics[a].setGeometry(
                    b.fromJson(this._preUpdatedGraphicsGeometries[a])
                  )
                : this._postUpdatedGraphics[a].setGeometry(
                    this._preUpdatedGraphicsGeometries[a]
                  ),
                this._postUpdatedGraphics[a].setAttributes(
                  this._preUpdatedGraphicsAttributes[a]
                );
            return this._featureLayer
              .applyEdits(null, this._postUpdatedGraphics, null)
              .then(
                h.hitch(this, function() {
                  return { layer: this._featureLayer, operation: this };
                })
              );
          },
          performRedo: function() {
            var a;
            for (a = 0; a < this._postUpdatedGraphics.length; a++)
              this._postUpdatedGraphicsGeometries[a]
                ? this._postUpdatedGraphics[a].setGeometry(
                    b.fromJson(this._postUpdatedGraphicsGeometries[a])
                  )
                : this._postUpdatedGraphics[a].setGeometry(
                    this._postUpdatedGraphicsGeometries[a]
                  ),
                this._postUpdatedGraphics[a].setAttributes(
                  this._postUpdatedGraphicsAttributes[a]
                );
            return this._featureLayer
              .applyEdits(null, this._postUpdatedGraphics, null)
              .then(
                h.hitch(this, function() {
                  return { layer: this._featureLayer, operation: this };
                })
              );
          }
        });
        l("extend-esri") && h.setObject("dijit.editing.Update", n, e);
        return n;
      });
    },
    "esri/dijit/editing/Delete": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ./EditOperationBase".split(
        " "
      ), function(n, g, h, l, e, b) {
        g = g(b, {
          declaredClass: "esri.dijit.editing.Delete",
          type: "edit",
          label: "Delete Features",
          constructor: function(b) {
            b = b || {};
            b.featureLayer
              ? ((this._featureLayer = b.featureLayer),
                b.deletedGraphics
                  ? (this._deletedGraphics = b.deletedGraphics)
                  : console.error(
                      "In constructor of 'esri.dijit.editing.Delete', no graphics provided"
                    ))
              : console.error(
                  "In constructor of 'esri.dijit.editing.Delete', featureLayer is not provided"
                );
          },
          updateObjectIds: function(b, a) {
            this.updateIds(this._featureLayer, this._deletedGraphics, b, a);
          },
          performUndo: function() {
            var b = n.map(
              this._deletedGraphics,
              function(a) {
                return a.attributes[this._featureLayer.objectIdField];
              },
              this
            );
            return this._featureLayer
              .applyEdits(this._deletedGraphics, null, null)
              .then(
                h.hitch(this, function(a, d, e) {
                  a = n.map(a, function(a) {
                    return a.objectId;
                  });
                  return {
                    oldIds: b,
                    addedIds: a,
                    layer: this._featureLayer,
                    operation: this
                  };
                })
              );
          },
          performRedo: function() {
            return this._featureLayer
              .applyEdits(null, null, this._deletedGraphics)
              .then(
                h.hitch(this, function() {
                  return { layer: this._featureLayer, operation: this };
                })
              );
          }
        });
        l("extend-esri") && h.setObject("dijit.editing.Delete", g, e);
        return g;
      });
    },
    "esri/dijit/editing/Cut": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ../../geometry/jsonUtils ./EditOperationBase".split(
        " "
      ), function(n, g, h, l, e, b, d) {
        g = g(d, {
          declaredClass: "esri.dijit.editing.Cut",
          type: "edit",
          label: "Cut Features",
          constructor: function(a) {
            var b;
            a = a || {};
            if (a.featureLayer)
              if (((this._featureLayer = a.featureLayer), a.addedGraphics))
                if (
                  ((this._addedGraphics = a.addedGraphics),
                  a.preUpdatedGraphics)
                ) {
                  this._preUpdatedGraphicsGeometries = [];
                  this._preUpdatedGraphicsAttributes = [];
                  for (b = 0; b < a.preUpdatedGraphics.length; b++)
                    this._preUpdatedGraphicsGeometries.push(
                      a.preUpdatedGraphics[b].geometry.toJson()
                    ),
                      this._preUpdatedGraphicsAttributes.push(
                        a.preUpdatedGraphics[b].attributes
                      );
                  if (a.postUpdatedGraphics)
                    for (
                      this._postUpdatedGraphics = a.postUpdatedGraphics,
                        this._postUpdatedGraphicsGeometries = [],
                        this._postUpdatedGraphicsAttributes = [],
                        b = 0;
                      b < a.postUpdatedGraphics.length;
                      b++
                    )
                      this._postUpdatedGraphicsGeometries.push(
                        a.postUpdatedGraphics[b].geometry.toJson()
                      ),
                        this._postUpdatedGraphicsAttributes.push(
                          h.clone(a.postUpdatedGraphics[b].attributes)
                        );
                  else
                    console.error(
                      "In constructor of 'esri.dijit.editing.Cut', postUpdatedGraphics not provided"
                    );
                } else
                  console.error(
                    "In constructor of 'esri.dijit.editing.Cut', preUpdatedGraphics not provided"
                  );
              else
                console.error(
                  "In constructor of 'esri.dijit.editing.Cut', addedGraphics for cut not provided"
                );
            else
              console.error(
                "In constructor of 'esri.dijit.editing.Cut', featureLayer not provided"
              );
          },
          updateObjectIds: function(a, b) {
            this.updateIds(
              this._featureLayer,
              this._preUpdatedGraphicsAttributes,
              a,
              b
            );
            this.updateIds(
              this._featureLayer,
              this._postUpdatedGraphicsAttributes,
              a,
              b
            );
            this.updateIds(this._featureLayer, this._addedGraphics, a, b);
          },
          performUndo: function() {
            var a;
            for (a = 0; a < this._postUpdatedGraphics.length; a++)
              this._postUpdatedGraphics[a].setGeometry(
                b.fromJson(this._preUpdatedGraphicsGeometries[a])
              ),
                this._postUpdatedGraphics[a].setAttributes(
                  this._preUpdatedGraphicsAttributes[a]
                );
            return this._featureLayer
              .applyEdits(null, this._postUpdatedGraphics, this._addedGraphics)
              .then(
                h.hitch(this, function() {
                  return { layer: this._featureLayer, operation: this };
                })
              );
          },
          performRedo: function() {
            var a;
            for (a = 0; a < this._postUpdatedGraphics.length; a++)
              this._postUpdatedGraphics[a].setGeometry(
                b.fromJson(this._postUpdatedGraphicsGeometries[a])
              ),
                this._postUpdatedGraphics[a].setAttributes(
                  this._postUpdatedGraphicsAttributes[a]
                );
            var d = n.map(
              this._addedGraphics,
              function(a) {
                return a.attributes[this._featureLayer.objectIdField];
              },
              this
            );
            return this._featureLayer
              .applyEdits(this._addedGraphics, this._postUpdatedGraphics, null)
              .then(
                h.hitch(this, function(a, c, b) {
                  a = n.map(a, function(a) {
                    return a.objectId;
                  });
                  return {
                    oldIds: d,
                    addedIds: a,
                    layer: this._featureLayer,
                    operation: this
                  };
                })
              );
          }
        });
        l("extend-esri") && h.setObject("dijit.editing.Cut", g, e);
        return g;
      });
    },
    "esri/dijit/editing/Union": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ../../geometry/jsonUtils ./EditOperationBase".split(
        " "
      ), function(n, g, h, l, e, b, d) {
        g = g(d, {
          declaredClass: "esri.dijit.editing.Union",
          type: "edit",
          label: "Union Features",
          constructor: function(a) {
            a = a || {};
            this._featureLayer = a.featureLayer;
            this._deletedGraphics = a.deletedGraphics;
            this._preUpdatedGraphics = a.preUpdatedGraphics;
            this._postUpdatedGraphics = a.postUpdatedGraphics;
            this._preUpdatedGraphicsGeometries = [];
            this._preUpdatedGraphicsAttributes = [];
            this._postUpdatedGraphicsGeometries = [];
            this._postUpdatedGraphicsAttributes = [];
            var b;
            for (b = 0; b < a.preUpdatedGraphics.length; b++)
              this._preUpdatedGraphicsGeometries.push(
                a.preUpdatedGraphics[b].geometry.toJson()
              ),
                this._preUpdatedGraphicsAttributes.push(
                  a.preUpdatedGraphics[b].attributes
                );
            for (b = 0; b < a.postUpdatedGraphics.length; b++)
              this._postUpdatedGraphicsGeometries.push(
                a.postUpdatedGraphics[b].geometry.toJson()
              ),
                this._postUpdatedGraphicsAttributes.push(
                  h.clone(a.postUpdatedGraphics[b].attributes)
                );
          },
          updateObjectIds: function(a, b) {
            this.updateIds(
              this._featureLayer,
              this._preUpdatedGraphicsAttributes,
              a,
              b
            );
            this.updateIds(
              this._featureLayer,
              this._postUpdatedGraphicsAttributes,
              a,
              b
            );
            this.updateIds(this._featureLayer, this._deletedGraphics, a, b);
          },
          performUndo: function() {
            var a;
            for (a = 0; a < this._postUpdatedGraphics.length; a++)
              this._postUpdatedGraphics[a].setGeometry(
                b.fromJson(this._preUpdatedGraphicsGeometries[a])
              ),
                this._postUpdatedGraphics[a].setAttributes(
                  this._preUpdatedGraphicsAttributes[a]
                );
            var d = n.map(
              this._deletedGraphics,
              function(a) {
                return a.attributes[this._featureLayer.objectIdField];
              },
              this
            );
            return this._featureLayer
              .applyEdits(
                this._deletedGraphics,
                this._postUpdatedGraphics,
                null
              )
              .then(
                h.hitch(this, function(a, c, b) {
                  a = n.map(a, function(a) {
                    return a.objectId;
                  });
                  return {
                    oldIds: d,
                    addedIds: a,
                    layer: this._featureLayer,
                    operation: this
                  };
                })
              );
          },
          performRedo: function() {
            var a;
            for (a = 0; a < this._postUpdatedGraphics.length; a++)
              this._postUpdatedGraphics[a].setGeometry(
                b.fromJson(this._postUpdatedGraphicsGeometries[a])
              ),
                this._postUpdatedGraphics[a].setAttributes(
                  this._postUpdatedGraphicsAttributes[a]
                );
            return this._featureLayer
              .applyEdits(
                null,
                this._postUpdatedGraphics,
                this._deletedGraphics
              )
              .then(
                h.hitch(this, function() {
                  return { layer: this._featureLayer, operation: this };
                })
              );
          }
        });
        l("extend-esri") && h.setObject("dijit.editing.Union", g, e);
        return g;
      });
    },
    "esri/dijit/editing/toolbars/Drawing": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/has dijit/_CssStateMixin ../Util ./ToolbarBase ../tools/ButtonToolBase ../tools/Cut ../tools/Union ../tools/Reshape ../tools/Editing ../tools/EditingTools ../tools/Selection ../tools/SelectionTools ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q, t, f, y, u) {
        n = n([a, b], {
          declaredClass: "esri.dijit.editing.toolbars.Drawing",
          onShowAttributeInspector: function() {},
          _activateTool: function(a, c) {
            this._settings.editor._activeTool = a;
            "EDITING" !== a && this._settings.templatePicker.clearSelection();
            "ATTRIBUTES" !== a &&
              this._settings.editor._hideAttributeInspector();
            "CLEAR" !== a && this.inherited(arguments);
          },
          _initializeToolbar: function() {
            h.forEach(
              this._settings.layers,
              function(a) {
                this._tbConnects.push(
                  l.connect(a, "onSelectionComplete", this, "_updateUI")
                );
              },
              this
            );
          },
          activateEditing: function(a, c) {
            this._tools.EDITING._activateTool(a, c.geometryType);
            this._activeTool = this._tools.EDITING;
            this._activeTool.setChecked(!0);
          },
          _updateUI: function() {
            this._settings.undoManager &&
              (this._tools.UNDO.set(
                "disabled",
                !1 === this._settings.undoManager.canUndo
              ),
              this._tools.REDO.set(
                "disabled",
                !1 === this._settings.undoManager.canRedo
              ));
            this._selectedFeatures = d.getSelection(this._settings.layers);
            var a = this._selectedFeatures.length;
            this._tools.DELETE && this._tools.DELETE.set("disabled", 0 >= a);
            this._tools.CLEAR && this._tools.CLEAR.set("disabled", 0 >= a);
            this._tools.ATTRIBUTES &&
              this._tools.ATTRIBUTES.set("disabled", 0 >= a);
            this._tools.UNION && this._tools.UNION.set("disabled", 2 > a);
          },
          _toolFinished: function(a) {
            if (
              "ATTRIBUTES" === a &&
              this._selectedFeatures &&
              this._selectedFeatures.length
            )
              this.onShowAttributeInspector(this._selectedFeatures[0]);
            if (
              "SELECT" === a ||
              "CUT" === a ||
              "RESHAPING" === a ||
              "EDITING" === a
            )
              this._activeTool.deactivate(),
                this._activeTool.setChecked(!1),
                (this._activeTool = null);
            if ("DELETE" === a) this.onDelete();
            this._settings.editor._activeTool = null;
            this._updateUI();
          },
          _createTools: function() {
            this._tools.SELECT = new f({
              settings: this._settings,
              onClick: g.hitch(this, "_activateTool", "SELECT", !0),
              onFinished: g.hitch(this, "_toolFinished", "SELECT")
            });
            this.addChild(this._tools.SELECT);
            this._tools.CLEAR = new m(
              g.mixin(y.selectClear, {
                settings: this._settings,
                onClick: g.hitch(this._settings.editor, "_clearSelection", !1)
              })
            );
            this.addChild(this._tools.CLEAR);
            this._createSeparator();
            this._tools.ATTRIBUTES = new m(
              g.mixin(t.attributes, {
                settings: this._settings,
                onClick: g.hitch(this, "_toolFinished", "ATTRIBUTES")
              })
            );
            this.addChild(this._tools.ATTRIBUTES);
            this._createSeparator();
            this._tools.EDITING = new q({
              settings: this._settings,
              onClick: g.hitch(this, "_activateTool", "EDITING", !0),
              onApplyEdits: g.hitch(this, "onApplyEdits"),
              onFinished: g.hitch(this, "_toolFinished", "EDITING")
            });
            this.addChild(this._tools.EDITING);
            this._tools.DELETE = new m(
              g.mixin(t.del, {
                settings: this._settings,
                onClick: g.hitch(this, "_toolFinished", "DELETE")
              })
            );
            this.addChild(this._tools.DELETE);
            this._settings.toolbarOptions &&
              ((this._settings.toolbarOptions.cutVisible ||
                this._settings.toolbarOptions.mergeVisible ||
                this._settings.toolbarOptions.reshapeVisible) &&
                this._createSeparator(),
              this._settings.toolbarOptions.cutVisible &&
                ((this._tools.CUT = new k({
                  settings: this._settings,
                  onFinished: g.hitch(this, "_toolFinished", "CUT"),
                  onClick: g.hitch(this, "_activateTool", "CUT", !0),
                  onApplyEdits: g.hitch(this, "onApplyEdits")
                })),
                this.addChild(this._tools.CUT)),
              this._settings.toolbarOptions.mergeVisible &&
                ((this._tools.UNION = new c({
                  settings: this._settings,
                  onFinished: g.hitch(this, "_toolFinished", "UNION"),
                  onApplyEdits: g.hitch(this, "onApplyEdits")
                })),
                this.addChild(this._tools.UNION)),
              this._settings.toolbarOptions.reshapeVisible &&
                ((this._tools.RESHAPING = new p({
                  settings: this._settings,
                  onClick: g.hitch(this, "_activateTool", "RESHAPING", !0),
                  onFinished: g.hitch(this, "_toolFinished", "RESHAPING"),
                  onApplyEdits: g.hitch(this, "onApplyEdits")
                })),
                this.addChild(this._tools.RESHAPING)));
            this._settings.enableUndoRedo &&
              (this._createSeparator(),
              (this._tools.UNDO = new m(
                g.mixin(t.undo, {
                  settings: this._settings,
                  disabled: !0,
                  onClick: g.hitch(this, function() {
                    this._tools.UNDO.set("disabled", !0);
                    this._tools.REDO.set("disabled", !0);
                    this._settings.editor._undo();
                  })
                })
              )),
              this.addChild(this._tools.UNDO),
              (this._tools.REDO = new m(
                g.mixin(t.redo, {
                  settings: this._settings,
                  disabled: !0,
                  onClick: g.hitch(this, function() {
                    this._tools.UNDO.set("disabled", !0);
                    this._tools.REDO.set("disabled", !0);
                    this._settings.editor._redo();
                  })
                })
              )),
              this.addChild(this._tools.REDO));
          }
        });
        e("extend-esri") && g.setObject("dijit.editing.toolbars.Drawing", n, u);
        return n;
      });
    },
    "esri/dijit/editing/toolbars/ToolbarBase": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/has dijit/Toolbar dijit/ToolbarSeparator ../../../kernel ../../../lang".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m) {
        n = n([b], {
          declaredClass: "esri.dijit.editing.toolbars.ToolbarBase",
          _enabled: !0,
          graphicsAdded: function() {},
          drawEnd: function() {},
          onApplyEdits: function() {},
          onDelete: function() {},
          constructor: function(a, c) {
            a &&
              a.settings &&
              ((this._tools = []),
              (this._tbConnects = []),
              this._initialize(a.settings));
          },
          postCreate: function() {
            this._createTools();
            this.deactivate();
          },
          destroy: function() {
            var a,
              c = this._tools;
            for (a in c)
              c.hasOwnProperty(a) &&
                m.isDefined(this._tools[a]) &&
                this._tools[a].destroy();
            h.forEach(this._tbConnects, l.disconnect);
            this.inherited(arguments);
          },
          activate: function(a) {
            this._enabled = !0;
          },
          deactivate: function() {
            var a;
            this._enabled = !1;
            this._geometryType = this._layer = null;
            var c = this._tools;
            for (a in c)
              c.hasOwnProperty(a) &&
                (this._tools[a].deactivate(), this._tools[a].setChecked(!1));
          },
          isEnabled: function() {
            return this._enabled;
          },
          setActiveSymbol: function(a) {
            this._activeSymbol = a;
          },
          _getSymbol: function() {},
          _createTools: function() {},
          _initialize: function(a) {
            this._settings = a;
            this._toolbar = a.drawToolbar;
            this._editToolbar = a.editToolbar;
            this._initializeToolbar();
          },
          _activateTool: function(a, c) {
            this._activeTool && this._activeTool.deactivate();
            !0 === c && this._activeTool == this._tools[a]
              ? (this._activeTool.setChecked(!1), (this._activeTool = null))
              : ((this._activeTool = this._tools[a]),
                this._activeTool.setChecked(!0),
                this._activeTool.activate(null));
          },
          _createSeparator: function() {
            this.addChild(new d());
          }
        });
        e("extend-esri") &&
          g.setObject("dijit.editing.toolbars.ToolbarBase", n, a);
        return n;
      });
    },
    "esri/dijit/editing/tools/ButtonToolBase": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/has dijit/form/Button ./ToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b) {
        n = n([l, e], {
          declaredClass: "esri.dijit.editing.tools.ButtonToolBase",
          postCreate: function() {
            this.inherited(arguments);
            this._setShowLabelAttr && this._setShowLabelAttr(!1);
          },
          destroy: function() {
            l.prototype.destroy.apply(this, arguments);
            e.prototype.destroy.apply(this, arguments);
          }
        });
        h("extend-esri") &&
          g.setObject("dijit.editing.tools.ButtonToolBase", n, b);
        return n;
      });
    },
    "esri/dijit/editing/tools/ToolBase": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../../../kernel",
        "dojo/i18n!../../../nls/jsapi"
      ], function(n, g, h, l, e) {
        n = n(null, {
          declaredClass: "esri.dijit.editing.tools.ToolBase",
          _enabled: !0,
          showLabel: !1,
          constructor: function(b, d) {
            b = b || {};
            g.mixin(this, b);
            this.label = this._label ? e.widgets.editor.tools[this._label] : "";
            this._settings = b.settings;
            this._toolbar = b.settings.drawToolbar;
            this._editToolbar = b.settings.editToolbar;
            this._initializeTool();
          },
          onFinished: function() {},
          onDrawEnd: function() {},
          onApplyEdits: function() {},
          postCreate: function() {
            this.deactivate();
            this.inherited(arguments);
          },
          destroy: function() {},
          activate: function(b) {
            this._toolbar && this._toolbar.deactivate();
            this._editToolbar && this._editToolbar.deactivate();
            this._enabled &&
              ((this._checked = !0),
              (this._layer = b),
              this._toolbar &&
                this._drawType &&
                this._toolbar.activate(this._drawType));
          },
          deactivate: function() {
            this._toolbar && this._toolbar.deactivate();
            this._editToolbar && this._editToolbar.deactivate();
            this.setChecked(!1);
            this._updateUI();
          },
          setEnabled: function(b) {
            this._enabled = b;
            this._updateUI();
          },
          setChecked: function(b) {
            this._checked = b;
          },
          enable: function(b) {
            this._updateUI();
          },
          isEnabled: function() {
            return this._enabled;
          },
          getToolName: function() {
            return this._toolName;
          },
          _initializeTool: function() {},
          _updateUI: function() {
            this.disabled = !this._enabled;
            this.attr(
              "iconClass",
              this._enabled ? this._enabledIcon : this._disabledIcon
            );
          }
        });
        h("extend-esri") && g.setObject("dijit.editing.tools.ToolBase", n, l);
        return n;
      });
    },
    "esri/dijit/editing/tools/Cut": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/has dojo/DeferredList ../../../graphicsUtils ../../../graphic ../../../tasks/query ../../../layers/FeatureLayer ../../../toolbars/draw ../Cut ./ToggleToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q, t) {
        n = n([q], {
          declaredClass: "esri.dijit.editing.tools.Cut",
          id: "btnFeatureCut",
          _enabledIcon: "toolbarIcon cutIcon",
          _disabledIcon: "toolbarIcon cutIcon",
          _drawType: c.POLYLINE,
          _enabled: !0,
          _label: "NLS_cutLbl",
          _cutConnects: [],
          activate: function() {
            this._cutConnects.push(
              l.connect(this._toolbar, "onDrawEnd", this, "_onDrawEnd")
            );
            this.inherited(arguments);
          },
          deactivate: function() {
            this.inherited(arguments);
            h.forEach(this._cutConnects, l.disconnect);
            this._cutConnects = [];
            this._edits = [];
          },
          _onDrawEnd: function(a) {
            var c = (this._cutLayers = h.filter(this._settings.layers, function(
              a
            ) {
              return (
                "esriGeometryPolygon" === a.geometryType ||
                ("esriGeometryPolyline" === a.geometryType &&
                  a.visible &&
                  a._isMapAtVisibleScale())
              );
            }));
            this._cutConnects = this._cutConnects.concat(
              h.map(
                c,
                g.hitch(this, function(a) {
                  return l.connect(
                    a,
                    "onEditsComplete",
                    g.hitch(this, function(a, c, b) {
                      if (this._settings.undoRedoManager) {
                        var d = this._settings.undoRedoManager;
                        h.forEach(
                          this._edits,
                          g.hitch(this, function(a) {
                            d.add(
                              new p({
                                featureLayer: a.layer,
                                addedGraphics: a.adds,
                                preUpdatedGraphics: a.preUpdates,
                                postUpdatedGraphics: a.updates
                              })
                            );
                          }),
                          this
                        );
                      }
                      this.onFinished();
                    })
                  );
                })
              )
            );
            var b = new m();
            b.geometry = a;
            h.forEach(
              c,
              function(a, c) {
                this._settings.editor._selectionHelper.selectFeatures(
                  [a],
                  b,
                  k.SELECTION_NEW,
                  g.hitch(this, "_cutFeatures", a, b)
                );
              },
              this
            );
          },
          _cutFeatures: function(a, c, e) {
            if (e && e.length) {
              this._edits = [];
              var f = [];
              f.push(
                this._settings.geometryService.cut(
                  d.getGeometries(e),
                  c.geometry,
                  g.hitch(this, "_cutHandler", a, e)
                )
              );
              new b(f).addCallback(
                g.hitch(this, function() {
                  this.onApplyEdits(this._edits);
                })
              );
            }
          },
          _cutHandler: function(c, b, d) {
            var e = [],
              f = [],
              k = h.map(b, function(c) {
                return new a(g.clone(c.toJson()));
              }),
              m,
              p;
            h.forEach(
              d.cutIndexes,
              function(c, k) {
                m != c
                  ? ((m = c), f.push(b[c].setGeometry(d.geometries[k])))
                  : ((p = new a(
                      d.geometries[k],
                      null,
                      g.mixin({}, b[c].attributes),
                      null
                    )),
                    (p.attributes[b[0].getLayer().objectIdField] = null),
                    e.push(p));
              },
              this
            );
            this._edits.push({ layer: c, adds: e, updates: f, preUpdates: k });
          }
        });
        e("extend-esri") && g.setObject("dijit.editing.tools.Cut", n, t);
        return n;
      });
    },
    "esri/dijit/editing/tools/ToggleToolBase": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/has dijit/form/ToggleButton ./ToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b) {
        n = n([l, e], {
          declaredClass: "esri.dijit.editing.tools.ToggleToolBase",
          postCreate: function() {
            this.inherited(arguments);
            this._setShowLabelAttr && this._setShowLabelAttr(!1);
          },
          destroy: function() {
            l.prototype.destroy.apply(this, arguments);
            e.prototype.destroy.apply(this, arguments);
          },
          setChecked: function(b) {
            l.prototype.setChecked.apply(this, arguments);
          }
        });
        h("extend-esri") &&
          g.setObject("dijit.editing.tools.ToggleToolBase", n, b);
        return n;
      });
    },
    "esri/dijit/editing/tools/Union": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../../../graphicsUtils ../../../graphic ../../../toolbars/draw ../Union ./ButtonToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k) {
        n = n([m], {
          declaredClass: "esri.dijit.editing.tools.Union",
          id: "btnFeatureUnion",
          _enabledIcon: "toolbarIcon unionIcon",
          _disabledIcon: "toolbarIcon unionIcon",
          _drawType: d.POLYLINE,
          _enabled: !0,
          _label: "NLS_unionLbl",
          _onClick: function(c) {
            this._settings.editor._activeTool = "UNION";
            c = h.filter(this._settings.layers, function(a) {
              return (
                "esriGeometryPolygon" === a.geometryType &&
                a.visible &&
                a._isMapAtVisibleScale()
              );
            });
            var d = [],
              k = 0;
            h.forEach(
              c,
              function(c, f) {
                var m = c.getSelectedFeatures();
                2 <= m.length &&
                  (k++,
                  this._settings.geometryService.union(
                    e.getGeometries(m),
                    g.hitch(this, function(e) {
                      var f = m.shift(),
                        p = [],
                        l = [];
                      p.push(new b(f.toJson()));
                      l.push(f.setGeometry(e));
                      d.push({
                        layer: c,
                        updates: l,
                        deletes: m,
                        preUpdates: p
                      });
                      k--;
                      if (0 >= k)
                        this.onApplyEdits(
                          d,
                          g.hitch(this, function() {
                            if (this._settings.undoRedoManager) {
                              var c = this._settings.undoRedoManager;
                              h.forEach(
                                this._edits,
                                g.hitch(this, function(b) {
                                  c.add(
                                    new a({
                                      featureLayer: b.layer,
                                      deletedGraphics: b.deletes,
                                      preUpdatedGraphics: b.preUpdates,
                                      postUpdatedGraphics: b.updates
                                    })
                                  );
                                }),
                                this
                              );
                            }
                            this._settings.editor._selectionHelper.clearSelection(
                              !1
                            );
                            this.onFinished();
                          })
                        );
                    })
                  ));
              },
              this
            );
          }
        });
        l("extend-esri") && g.setObject("dijit.editing.tools.Union", n, k);
        return n;
      });
    },
    "esri/dijit/editing/tools/Reshape": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/has ../../../graphic ../../../layers/FeatureLayer ../../../tasks/query ../../../toolbars/draw ./ToggleToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c) {
        n = n([k], {
          declaredClass: "esri.dijit.editing.tools.Reshape",
          id: "btnFeatureReshape",
          _enabledIcon: "toolbarIcon reshapeIcon",
          _disabledIcon: "toolbarIcon reshapeIcon",
          _drawType: m.POLYLINE,
          _enabled: !0,
          _label: "NLS_reshapeLbl",
          activate: function() {
            l.disconnect(this._rConnect);
            this._rConnect = l.connect(
              this._toolbar,
              "onDrawEnd",
              this,
              "_onDrawEnd"
            );
            this.inherited(arguments);
          },
          deactivate: function() {
            this.inherited(arguments);
            l.disconnect(this._rConnect);
            delete this._rConnect;
          },
          _onDrawEnd: function(c) {
            var b = this._settings.layers,
              e = new a();
            e.geometry = c;
            c = this._reshapeLayers = h.filter(b, function(a) {
              return (
                "esriGeometryPolygon" === a.geometryType ||
                "esriGeometryPolyline"
              );
            });
            this._settings.editor._selectionHelper.selectFeatures(
              c,
              e,
              d.SELECTION_NEW,
              g.hitch(this, "_reshape", e)
            );
          },
          _reshape: function(a, c) {
            if (1 === c.length) {
              var d = [],
                e = [],
                k = [],
                m = c[0],
                p = m.getLayer();
              this._settings.geometryService.reshape(
                m.geometry,
                a.geometry,
                g.hitch(this, function(a) {
                  "polyline" === a.type && a.paths && 0 === a.paths.length
                    ? (this._settings.editor._selectionHelper.clearSelection(
                        !1
                      ),
                      this.onFinished())
                    : "polygon" === a.type && a.rings && 0 === a.rings.length
                    ? (this._settings.editor._selectionHelper.clearSelection(
                        !1
                      ),
                      this.onFinished())
                    : (k.push(new b(m.toJson())),
                      e.push(m.setGeometry(a)),
                      d.push({ layer: p, updates: e, preUpdates: k }),
                      this.onApplyEdits(
                        d,
                        g.hitch(this, function() {
                          this._settings.editor._selectionHelper.clearSelection(
                            !1
                          );
                          this.onFinished();
                        })
                      ));
                })
              );
            }
          }
        });
        e("extend-esri") && g.setObject("dijit.editing.tools.Reshape", n, c);
        return n;
      });
    },
    "esri/dijit/editing/tools/Editing": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../../../layers/FeatureTemplate ./Edit ./EditingTools ./DropDownToolBase ../../../kernel ../../../lang".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k) {
        n = n([a], {
          declaredClass: "esri.dijit.editing.tools.Editing",
          _enabled: !1,
          deactivate: function() {
            this._enabled &&
              ((this._enabled = !1),
              this.inherited(arguments),
              this._settings.templatePicker.clearSelection());
          },
          onItemClicked: function(a, b) {
            this.inherited(arguments);
            this._activeTool === this._tools.AUTOCOMPLETE &&
              (this._settings.editor._drawingTool =
                e.TOOL_AUTO_COMPLETE_POLYGON);
          },
          _activateTool: function(a, b) {
            var c;
            this.enable(b);
            for (c in this._tools)
              this._tools.hasOwnProperty(c) &&
                (this.dropDown.removeChild(this._tools[c]),
                !0 === this._tools[c]._enabled &&
                  this.dropDown.addChild(this._tools[c]));
            if (this._geometryType !== b || !1 === this._activeTool._enabled)
              this._activeTool = this._tools[a.toUpperCase()];
            this._geometryType = b;
            this._activeTool.activate();
            this._activeTool.setChecked(!0);
            this._updateUI();
          },
          _initializeTool: function(a) {
            this.inherited(arguments);
            this._initializeTools();
          },
          _initializeTools: function() {
            var a = this._settings.layers,
              b = this._settings.editor,
              d = !1,
              e = !1,
              f = !1,
              k = (this._toolTypes = []),
              m;
            h.forEach(
              a,
              function(a) {
                m = a.geometryType;
                d = d || "esriGeometryPoint" === m;
                e = e || "esriGeometryPolyline" === m;
                f = f || "esriGeometryPolygon" === m;
                k = k.concat(
                  h.map(
                    this._getTemplatesFromLayer(a),
                    g.hitch(this, function(c) {
                      return b._toDrawTool(c.drawingTool, a);
                    })
                  )
                );
              },
              this
            );
            a = this._settings.createOptions;
            d && this._toolTypes.push("point");
            e &&
              (this._toolTypes = this._toolTypes.concat(a.polylineDrawTools));
            f && (this._toolTypes = this._toolTypes.concat(a.polygonDrawTools));
            this._toolTypes = this._toUnique(this._toolTypes.concat(k));
          },
          _toUnique: function(a) {
            var c = {};
            return h.filter(a, function(a) {
              return c[a] ? !1 : (c[a] = !0);
            });
          },
          _getTemplatesFromLayer: function(a) {
            var c = a.templates || [];
            h.forEach(a.types, function(a) {
              c = c.concat(a.templates);
            });
            return h.filter(c, k.isDefined);
          },
          _createTools: function() {
            h.forEach(this._toolTypes, this._createTool, this);
            this.inherited(arguments);
          },
          _createTool: function(a) {
            var c = g.mixin(d[a], {
              settings: this._settings,
              onClick: g.hitch(this, "onItemClicked", d[a].id)
            });
            this._tools[a.toUpperCase()] = new b(c);
          }
        });
        l("extend-esri") && g.setObject("dijit.editing.tools.Editing", n, m);
        return n;
      });
    },
    "esri/dijit/editing/tools/Edit": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "./MenuItemBase",
        "../../../kernel"
      ], function(n, g, h, l, e) {
        n = n([l], {
          declaredClass: "esri.dijit.editing.tools.Edit",
          enable: function(b) {
            this._enabled = b === this._geomType;
            this.inherited(arguments);
          }
        });
        h("extend-esri") && g.setObject("dijit.editing.tools.Edit", n, e);
        return n;
      });
    },
    "esri/dijit/editing/tools/MenuItemBase": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/has dijit/MenuItem ./ToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b) {
        n = n([l, e], {
          declaredClass: "esri.dijit.editing.tools.MenuItemBase",
          destroy: function() {
            l.prototype.destroy.apply(this, arguments);
            e.prototype.destroy.apply(this, arguments);
          }
        });
        h("extend-esri") &&
          g.setObject("dijit.editing.tools.MenuItemBase", n, b);
        return n;
      });
    },
    "esri/dijit/editing/tools/EditingTools": function() {
      define([
        "dojo/_base/lang",
        "dojo/has",
        "../../../toolbars/draw",
        "../../../kernel"
      ], function(n, g, h, l) {
        h = {
          point: {
            id: "esriPointTool",
            _enabledIcon: "toolbarIcon pointIcon",
            _disabledIcon: "toolbarIcon pointIconDisabled",
            _drawType: h.POINT,
            _geomType: "esriGeometryPoint",
            _label: "NLS_pointLbl"
          },
          polyline: {
            id: "toolDrawFreehandPolyline",
            _enabledIcon: "toolbarIcon polylineIcon",
            _disabledIcon: "toolbarIcon polylineIconDisabled",
            _drawType: h.POLYLINE,
            _geomType: "esriGeometryPolyline",
            _label: "NLS_polylineLbl"
          },
          freehandpolyline: {
            id: "toolDrawPolyline",
            _enabledIcon: "toolbarIcon freehandPolylineIcon",
            _disabledIcon: "toolbarIcon freehandPolylineIcon",
            _drawType: h.FREEHAND_POLYLINE,
            _geomType: "esriGeometryPolyline",
            _label: "NLS_freehandPolylineLbl"
          },
          polygon: {
            id: "toolDrawPolygon",
            _enabledIcon: "toolbarIcon polygonIcon",
            _disabledIcon: "toolbarIcon polygonIconDisabled",
            _drawType: h.POLYGON,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_polygonLbl"
          },
          freehandpolygon: {
            id: "toolDrawFreehandPolygon",
            _enabledIcon: "toolbarIcon freehandPolygonIcon",
            _disabledIcon: "toolbarIcon freehandPolygonIconDisabled",
            _drawType: h.FREEHAND_POLYGON,
            _label: "NLS_freehandPolygonLbl",
            _geomType: "esriGeometryPolygon"
          },
          autocomplete: {
            id: "btnFeatureAutoComplete",
            _enabledIcon: "toolbarIcon autoCompleteIcon",
            _disabledIcon: "toolbarIcon autoCompleteIcon",
            _drawType: h.POLYGON,
            _label: "NLS_autoCompleteLbl",
            _geomType: "esriGeometryPolygon"
          },
          rectangle: {
            id: "toolDrawRect",
            _enabledIcon: "toolbarIcon rectangleIcon",
            _disabledIcon: "toolbarIcon rectangleIcon",
            _drawType: h.RECTANGLE,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_rectangleLbl"
          },
          arrow: {
            id: "toolDrawArrow",
            _enabledIcon: "toolbarIcon arrowIcon",
            _disabledIcon: "toolbarIcon arrowIcon",
            _drawType: h.ARROW,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_arrowLbl"
          },
          uparrow: {
            id: "toolDrawArrowUp",
            _enabledIcon: "toolbarIcon arrowUpIcon",
            _disabledIcon: "toolbarIcon arrowUpIcon",
            _drawType: h.UP_ARROW,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_arrowUpLbl"
          },
          downarrow: {
            id: "toolDrawDownArrow",
            _enabledIcon: "toolbarIcon arrowDownIcon",
            _disabledIcon: "toolbarIcon arrowDownIcon",
            _drawType: h.DOWN_ARROW,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_arrowDownLbl"
          },
          leftarrow: {
            id: "toolDrawLeftArrow",
            _enabledIcon: "toolbarIcon arrowLeftIcon",
            _disabledIcon: "toolbarIcon arrowLeftIcon",
            _drawType: h.LEFT_ARROW,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_arrowLeftLbl"
          },
          rightarrow: {
            id: "toolDrawRightArrow",
            _enabledIcon: "toolbarIcon arrowIcon",
            _disabledIcon: "toolbarIcon arrowIcon",
            _drawType: h.RIGHT_ARROW,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_arrowRightLbl"
          },
          circle: {
            id: "toolDrawCircle",
            _enabledIcon: "toolbarIcon circleIcon",
            _disabledIcon: "toolbarIcon circleIcon",
            _drawType: h.CIRCLE,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_circleLbl"
          },
          ellipse: {
            id: "toolDrawEllipse",
            _enabledIcon: "toolbarIcon ellipseIcon",
            _disabledIcon: "toolbarIcon ellipseIcon",
            _drawType: h.ELLIPSE,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_ellipseLbl"
          },
          triangle: {
            id: "toolDrawTriangle",
            _enabledIcon: "toolbarIcon triangleIcon",
            _disabledIcon: "toolbarIcon triangleIcon",
            _drawType: h.TRIANGLE,
            _geomType: "esriGeometryPolygon",
            _label: "NLS_triangleLbl"
          },
          attributes: {
            id: "btnAttributes",
            _enabledIcon: "toolbarIcon attributesIcon",
            _disabledIcon: "toolbarIcon attributesIcon",
            _enabled: !1,
            _label: "NLS_attributesLbl"
          },
          del: {
            id: "btnDelete2",
            _enabledIcon: "toolbarIcon deleteFeatureIcon",
            _disabledIcon: "toolbarIcon deleteFeatureIcon",
            _enabled: !1,
            _label: "NLS_deleteLbl"
          },
          undo: {
            id: "btnUndo",
            _enabledIcon: "dijitEditorIcon dijitEditorIconUndo",
            _disabledIcon: "dijitEditorIcon dijitEditorIconUndo",
            _enabled: !1,
            _label: "NLS_undoLbl"
          },
          redo: {
            id: "btnRedo",
            _enabledIcon: "dijitEditorIcon dijitEditorIconRedo",
            _disabledIcon: "dijitEditorIcon dijitEditorIconRedo",
            _enabled: !1,
            _label: "NLS_redoLbl"
          }
        };
        g("extend-esri") &&
          n.setObject("dijit.editing.tools.EditingTools", h, l);
        return h;
      });
    },
    "esri/dijit/editing/tools/DropDownToolBase": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/has dojo/dom-style dijit/registry dijit/Menu dijit/form/ComboButton ./ToolBase ../../../kernel ../../../lang".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k) {
        n = n([d, a], {
          declaredClass: "esri.dijit.editing.tools.DropDownToolBase",
          _enabled: !1,
          _checked: !1,
          postCreate: function() {
            this._tools = [];
            this._createTools();
            this.inherited(arguments);
            this._setShowLabelAttr && this._setShowLabelAttr(!1);
          },
          destroy: function() {
            var a,
              b = this._tools;
            for (a in b)
              b.hasOwnProperty(a) && k.isDefined(b[a]) && b[a].destroy();
            this.inherited(arguments);
          },
          _createTools: function() {
            var a,
              d = new b();
            this.dropDown = d;
            for (a in this._tools)
              this._tools.hasOwnProperty(a) && d.addChild(this._tools[a]);
            this._activeTool = d.getChildren()[0];
            this._updateUI();
          },
          activate: function(a) {
            this.inherited(arguments);
            this._activeTool
              ? this._activeTool.activate()
              : this._activateDefaultTool();
          },
          deactivate: function() {
            this.inherited(arguments);
            this._activeTool && this._activeTool.deactivate();
          },
          enable: function(a) {
            for (var c in this._tools)
              this._tools.hasOwnProperty(c) && this._tools[c].enable(a);
            this.setEnabled(!0);
            this.inherited(arguments);
          },
          setChecked: function(a) {
            this._checked = a;
            this._updateUI();
          },
          _onDrawEnd: function(a) {},
          onLayerChange: function(a, b, d) {
            this._activeTool = null;
            this._activeType = b;
            this._activeTemplate = d;
            this._activeLayer = a;
          },
          onItemClicked: function(a, b) {
            this._activeTool && this._activeTool.deactivate();
            this._activeTool = e.byId(a);
            !1 === this._checked
              ? this._onClick()
              : (this._updateUI(),
                this._activeTool &&
                  (this._activeTool.activate(),
                  this._activeTool.setChecked(!0)));
          },
          _onClick: function(a) {
            !1 !== this._enabled &&
              ((this._checked = !this._checked), this.inherited(arguments));
          },
          _updateUI: function() {
            this.attr("disabled", !this._enabled);
            l.set(this.focusNode, { outline: "none" });
            l.set(this.titleNode, { padding: "0px", border: "none" });
            this._checked
              ? l.set(this.titleNode, {
                  backgroundColor: "#D4DFF2",
                  border: "1px solid #316AC5"
                })
              : l.set(this.titleNode, { backgroundColor: "", border: "" });
            this._activeTool &&
              (this.attr(
                "iconClass",
                this._checked
                  ? this._activeTool._enabledIcon
                  : this._activeTool._disabledIcon
              ),
              this.attr("label", this._activeTool.label));
          }
        });
        h("extend-esri") &&
          g.setObject("dijit.editing.tools.DropDownToolBase", n, m);
        return n;
      });
    },
    "esri/dijit/editing/tools/Selection": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/Color dojo/has ../../../symbols/SimpleMarkerSymbol ../../../symbols/SimpleLineSymbol ../../../symbols/SimpleFillSymbol ./Edit ./SelectionTools ./DropDownToolBase ../../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q) {
        n = n([p], {
          declaredClass: "esri.dijit.editing.tools.Selection",
          _enabled: !0,
          activate: function() {
            this.inherited(arguments);
            this._sConnect = l.connect(
              this._toolbar,
              "onDrawEnd",
              this,
              "_onDrawEnd"
            );
          },
          deactivate: function() {
            this.inherited(arguments);
            l.disconnect(this._sConnect);
            delete this._sConnect;
          },
          _initializeTool: function() {
            this._createSymbols();
            this._initializeLayers();
            this._toolTypes = ["select", "selectadd", "selectremove"];
          },
          _onDrawEnd: function(a) {
            this.inherited(arguments);
            this._settings.editor._hideAttributeInspector();
            var c = this._settings.layers;
            this._selectMethod = this._activeTool._selectMethod;
            this._settings.editor._selectionHelper.selectFeaturesByGeometry(
              c,
              a,
              this._selectMethod,
              g.hitch(this, "onFinished")
            );
          },
          _createSymbols: function() {
            this._pointSelectionSymbol = new d(
              d.STYLE_CIRCLE,
              10,
              new a(a.STYLE_SOLID, new e([0, 0, 0]), 1),
              new e([255, 0, 0, 0.5])
            );
            this._polylineSelectionSymbol = new a(
              a.STYLE_SOLID,
              new e([0, 200, 255]),
              2
            );
            this._polygonSelectionSymbol = new m(
              m.STYLE_SOLID,
              new a(a.STYLE_SOLID, new e([0, 0, 0]), 1),
              new e([0, 200, 255, 0.5])
            );
          },
          _initializeLayers: function() {
            h.forEach(this._settings.layers, this._setSelectionSymbol, this);
          },
          _setSelectionSymbol: function(a) {
            var c = null;
            switch (a.geometryType) {
              case "esriGeometryPoint":
                c = this._pointSelectionSymbol;
                break;
              case "esriGeometryPolyline":
                c = this._polylineSelectionSymbol;
                break;
              case "esriGeometryPolygon":
                c = this._polygonSelectionSymbol;
            }
            a.setSelectionSymbol(a._selectionSymbol || c);
          },
          _createTools: function() {
            h.forEach(this._toolTypes, this._createTool, this);
            this.inherited(arguments);
          },
          _createTool: function(a) {
            var b = g.mixin(c[a], {
              settings: this._settings,
              onClick: g.hitch(this, "onItemClicked", c[a].id)
            });
            this._tools[a.toUpperCase()] = new k(b);
          }
        });
        b("extend-esri") && g.setObject("dijit.editing.tools.Selection", n, q);
        return n;
      });
    },
    "esri/dijit/editing/tools/SelectionTools": function() {
      define([
        "dojo/_base/lang",
        "dojo/has",
        "../../../layers/FeatureLayer",
        "../../../toolbars/draw",
        "../../../kernel"
      ], function(n, g, h, l, e) {
        h = {
          select: {
            id: "btnNewSelection",
            _enabledIcon: "toolbarIcon newSelectionIcon",
            _disabledIcon: "toolbarIcon newSelectionIcon",
            _drawType: l.EXTENT,
            _selectMethod: h.SELECTION_NEW,
            _label: "NLS_selectionNewLbl"
          },
          selectadd: {
            id: "btnAddToSelection",
            _enabledIcon: "toolbarIcon addToSelectionIcon",
            _disabledIcon: "toolbarIcon addToSelectionIcon",
            _drawType: l.EXTENT,
            _selectMethod: h.SELECTION_ADD,
            _label: "NLS_selectionAddLbl"
          },
          selectremove: {
            id: "btnSubtractFromSelection",
            _enabledIcon: "toolbarIcon removeFromSelectionIcon",
            _disabledIcon: "toolbarIcon removeFromSelectionIcon",
            _drawType: l.EXTENT,
            _selectMethod: h.SELECTION_SUBTRACT,
            _label: "NLS_selectionRemoveLbl"
          },
          selectClear: {
            id: "btnClearSelection",
            _enabledIcon: "toolbarIcon clearSelectionIcon",
            _disabledIcon: "toolbarIcon clearSelectionIcon",
            _enabled: !1,
            _label: "NLS_selectionClearLbl"
          }
        };
        g("extend-esri") &&
          n.setObject("dijit.editing.tools.SelectionTools", h, e);
        return h;
      });
    },
    "esri/dijit/editing/SelectionHelper": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/has dojo/DeferredList ../../geometry/Extent ../../geometry/Point ../../geometry/ScreenPoint ../../layers/FeatureLayer ../../tasks/query ../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p) {
        n = n(null, {
          declaredClass: "esri.dijit.editing.SelectionHelper",
          constructor: function(a) {
            this._settings = a || {};
            this._sConnects = [];
            this._mapServiceCount = 0;
            this._map = this._settings.map;
            this._tolerance = this._settings.singleSelectionTolerance;
            this._initMapServiceInfos(this._settings.layers);
          },
          destroy: function() {
            for (var a in this._sConnects)
              this._sConnects.hasOwnProperty(a) &&
                h.disconnect(this._sConnects[a]);
          },
          selectFeatures: function(a, c, d, e) {
            d === k.SELECTION_NEW &&
              (this._resetMapServiceInfos(), this.getSelection(a));
            var f = [];
            l.forEach(a, function(a) {
              if (!0 === a.visible && !0 === a._isMapAtVisibleScale()) {
                var b = d;
                a._isSelOnly && b === k.SELECTION_NEW && (b = k.SELECTION_ADD);
                f.push(a.selectFeatures(c, b));
              }
            });
            new b(f).addCallback(
              g.hitch(this, function(c) {
                var b = [];
                l.forEach(
                  c,
                  function(c, d) {
                    l.forEach(
                      c[1],
                      function(c) {
                        (c =
                          a[d]._mode._getFeature(
                            c.attributes[a[d].objectIdField]
                          ) || null) && b.push(c);
                      },
                      this
                    );
                  },
                  this
                );
                this._mapServiceCount
                  ? ((c = d === k.SELECTION_SUBTRACT)
                      ? (this._resetMapServiceInfos(),
                        this._createLayerDefs(
                          this._getLayerInfosFromSelection(a)
                        ))
                      : this._createLayerDefs(
                          this._getLayerInfosFromFeatures(b)
                        ),
                    this._updateLayerDefs(
                      this._mapServiceInfos,
                      !1,
                      !((b && b.length) || c),
                      g.hitch(this, e, b)
                    ))
                  : e(b);
              })
            );
          },
          selectFeaturesByGeometry: function(b, d, e, k) {
            var f = d;
            -1 !== d.declaredClass.indexOf("Extent") &&
              d.xmax === d.xmin &&
              d.ymax === d.ymin &&
              (f = new a(d.xmax, d.ymax, d.spatialReference));
            f =
              -1 !== f.declaredClass.indexOf("Point")
                ? this._extentFromPoint(f)
                : f;
            d = new c();
            d.geometry = f;
            this.selectFeatures(b, d, e, k);
          },
          clearSelection: function(a) {
            l.forEach(this._nonSelOnlyLayers, function(a) {
              a.clearSelection && a.clearSelection();
            });
            if (this._mapServiceCount) {
              this._resetMapServiceInfos();
              var c = this._getLayerInfosFromSelection(this._settings.layers);
              l.some(c, function(a) {
                return a.oids && a.oids.length;
              }) &&
                (this._createLayerDefs(c),
                this._updateLayerDefs(this._mapServiceInfos, !0, a || !1));
            }
          },
          findMapService: function(a) {
            var c = this._map,
              b = c.layerIds;
            a = a && a._url && a._url.path ? a._url.path.toLowerCase() : "";
            var d, e, k;
            for (e in b)
              if (
                b.hasOwnProperty(e) &&
                ((d = c.getLayer(b[e])),
                (k = d._url
                  ? d._url.path
                    ? d._url.path
                        .toLowerCase()
                        .replace("mapserver", "featureserver")
                    : d._url.toLowerCase().replace("mapserver", "featureserver")
                  : ""),
                a.substr(0, k.length) === k &&
                  "esri.layers.ArcGISDynamicMapServiceLayer" ===
                    d.declaredClass)
              )
                return d;
          },
          getSelection: function(a) {
            var c = [];
            l.forEach(
              a,
              function(a) {
                a._isSelOnly && c.push(this._createLayerInfo(a));
              },
              this
            );
            l.forEach(
              c,
              function(a) {
                var c = this._createMapServiceInfo(
                  this.findMapService(a.layer)
                );
                c && (c.layerInfos[a.layer.layerId] = a);
              },
              this
            );
          },
          _initMapServiceInfos: function(a) {
            this._nonSelOnlyLayers = [];
            this._mapServiceInfos = [];
            l.forEach(
              a,
              function(a) {
                var c = this.findMapService(a);
                c
                  ? (this._mapServiceCount++,
                    this._createMapServiceInfo(c),
                    c && c.setDisableClientCaching(!0))
                  : this._nonSelOnlyLayers.push(a);
              },
              this
            );
          },
          _createMapServiceInfo: function(a) {
            if (!a) return null;
            var c = this._mapServiceInfos,
              b = c[a.id];
            b ||
              (b = c[a.id] = {
                mapService: a,
                layerInfos: [],
                layerDefs: g.mixin([], a.layerDefinitions || []),
                origLayerDefs: g.mixin([], a.layerDefinitions || [])
              });
            return b;
          },
          _resetMapServiceInfo: function(a) {
            l.forEach(a.layerInfos, this._resetLayerInfo);
            a.layerDefs = g.mixin([], a.origLayerDefs || []);
          },
          _resetMapServiceInfos: function() {
            var a = this._mapServiceInfos,
              c;
            for (c in a) a.hasOwnProperty(c) && this._resetMapServiceInfo(a[c]);
          },
          _createLayerInfo: function(a, c) {
            var b = a.objectIdField;
            c = c ? [] : a.getSelectedFeatures();
            return {
              layer: a,
              selectedFeatures: c || [],
              oids: l.map(c, function(a) {
                return a.attributes[b];
              })
            };
          },
          _resetLayerInfo: function(a) {
            a && ((a.selectedFeatures = []), (a.oids = []));
          },
          _updateLayerDefs: function(a, c, b, d) {
            for (var e in a)
              if (a.hasOwnProperty(e)) {
                var f = a[e],
                  k = f.mapService,
                  m = (f.layerDefs = c
                    ? g.mixin([], f.origLayerDefs || [])
                    : f.layerDefs);
                m
                  ? (b
                      ? d && d()
                      : (this._sConnects[k.id] = h.connect(
                          k,
                          "onUpdateEnd",
                          g.hitch(this, "_onMapServiceUpdate", f, c, d)
                        )),
                    k.setLayerDefinitions(m, b || !1))
                  : d && d();
              }
          },
          _onMapServiceUpdate: function(a, b, d) {
            h.disconnect(this._sConnects[a.mapService.id]);
            l.forEach(
              a.layerInfos,
              function(a) {
                if (b) a && a.layer.clearSelection();
                else {
                  var d = new c();
                  d.objectIds = a ? a.oids : [];
                  d.objectIds.length &&
                    a.layer.selectFeatures(d, k.SELECTION_SUBTRACT);
                }
              },
              this
            );
            b && this._resetMapServiceInfo(a);
            d && d();
          },
          _createLayerDefs: function(a) {
            l.forEach(
              a,
              function(a) {
                var c = a.layer,
                  b = this._createMapServiceInfo(this.findMapService(a.layer));
                if (b) {
                  var b = b.layerDefs,
                    d = c.layerId,
                    e = '("' + c.objectIdField + '" NOT IN (',
                    k = a.oids;
                  k &&
                    k.length &&
                    (l.forEach(a.oids, function(a, c) {
                      k = !0;
                      c && (e += ",");
                      e += "'" + a + "'";
                    }),
                    (e += "))"),
                    (b[d] =
                      b.length && b[d] && b[d].length
                        ? b[d] + (" AND" + e)
                        : e));
                }
              },
              this
            );
          },
          _getLayerInfosFromFeatures: function(a) {
            var c = [];
            l.forEach(
              a,
              function(a) {
                var b = a.getLayer();
                b &&
                  b._isSelOnly &&
                  (c[b.id] || (c[b.id] = this._createLayerInfo(b, !0)),
                  c[b.id].selectedFeatures.push(a),
                  c[b.id].oids.push(a.attributes[b.objectIdField]));
              },
              this
            );
            a = [];
            for (var b in c) c.hasOwnProperty(b) && a.push(c[b]);
            return a;
          },
          _getLayerInfosFromSelection: function(a) {
            var c = [];
            l.forEach(
              a,
              function(a) {
                a._isSelOnly && c.push(this._createLayerInfo(a, !1));
              },
              this
            );
            return c;
          },
          _extentFromPoint: function(a) {
            var c = this._tolerance,
              b = this._map,
              e = b.toScreen(a);
            a = new m(e.x - c, e.y + c);
            c = new m(e.x + c, e.y - c);
            a = b.toMap(a);
            c = b.toMap(c);
            return new d(a.x, a.y, c.x, c.y, b.spatialReference);
          }
        });
        e("extend-esri") && g.setObject("dijit.editing.SelectionHelper", n, p);
        return n;
      });
    },
    "esri/dijit/editing/TemplatePicker": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/html dojo/_base/array dojo/_base/json dojo/_base/kernel dojo/has dojo/query dojo/sniff dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dijit/_Widget dijit/_Templated dojo/data/ItemFileReadStore dojox/grid/DataGrid dojox/gfx ../../layers/FeatureLayer ../../symbols/SimpleMarkerSymbol ../../symbols/PictureMarkerSymbol ../../symbols/SimpleFillSymbol ../../symbols/SimpleLineSymbol ./TemplatePickerItem ../../kernel ../../lang ../../request ../_EventedWidget dojo/i18n!../../nls/jsapi dojo/text!./templates/TemplatePicker.html".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H,
        D,
        G,
        E,
        J,
        F,
        A
      ) {
        var K = n([J, f, y], {
          declaredClass: "esri.dijit.editing.TemplatePicker",
          widgetsInTemplate: !0,
          templateString: A,
          featureLayers: null,
          items: null,
          grouping: !0,
          showTooltip: !1,
          maxLabelLength: 0,
          rows: 4,
          _rows: 0,
          columns: 3,
          surfaceWidth: 30,
          surfaceHeight: 30,
          emptyMessage: "",
          useLegend: !0,
          legendCache: {},
          _uniqueId: { id: 0 },
          _assumedCellWidth: 90,
          _initialAutoWidth: 300,
          _initialAutoHeight: 200,
          _ieTimer: 150,
          constructor: function(a, c) {
            a = a || {};
            a.items ||
              a.featureLayers ||
              console.error(
                "TemplatePicker: please provide 'featureLayers' or 'items' parameter in the constructor"
              );
            this._dojo14x = 4 <= d.version.minor;
            this._itemWidgets = {};
            a.featureLayers && a.featureLayers.length && (this._flChanged = 1);
            this._nls = F.widgets.templatePicker;
            this.emptyMessage =
              a.emptyMessage || (this._nls && this._nls.creationDisabled) || "";
          },
          postMixInProperties: function() {
            this.inherited(arguments);
            this._preprocess();
          },
          startup: function() {
            this.inherited(arguments);
            if ("auto" === this.rows && "auto" === this.columns) {
              var c = q.getContentBox(this.domNode);
              c.w || (this.domNode.style.width = this._initialAutoWidth + "px");
              if (!c.h || 1 >= c.h)
                this.domNode.style.height = this._initialAutoHeight + "px";
              c = q.getContentBox(this.domNode);
              this._columns = Math.floor(c.w / this._assumedCellWidth) || 1;
            }
            this._applyGridPatches();
            this._setGridLayout();
            h.connect(this.grid, "onRowClick", this, this._rowClicked);
            this._setGridData();
            this._toggleTooltip();
            9 > a("ie") &&
              ((this._repaintItems = g.hitch(this, this._repaintItems)),
              setTimeout(this._repaintItems, this._ieTimer));
          },
          destroy: function() {
            this.showTooltip = !1;
            this._toggleTooltip();
            this._clearLegendInfo();
            this.featureLayers = this.items = this.grid = this._flItems = this._itItems = this._groupRowIndices = this._selectedCell = this._selectedInfo = this._selectedItem = null;
            this.inherited(arguments);
          },
          getSelected: function() {
            return this._selectedCell ? this._selectedItem : null;
          },
          clearSelection: function() {
            var a = this._selectedCell,
              c = this._selectedInfo;
            a &&
              this._rowClicked({
                cellNode: a,
                rowIndex: c.selRow,
                cellIndex: c.selCol
              });
          },
          update: function(c) {
            c = "auto" === this.rows && "auto" === this.columns && c ? !0 : !1;
            var b = this.grid,
              e;
            if (c) {
              e = this.domNode;
              var f;
              f = d.query("#" + e.id + ".templatePicker div.item")[0];
              e = q.getContentBox(e);
              f = (f = f && f.parentNode)
                ? l.coords(f).w
                : this._assumedCellWidth;
              this._columns =
                (this._columns = Math.floor(
                  (e.w - b.views.views[0].getScrollbarWidth()) / f
                )) || 1;
            }
            f = this._rows;
            this._preprocess();
            var k = this._rows;
            this._setGridLayout();
            this._setGridData();
            k !== f && b.set("autoHeight", this._rows, !1);
            c
              ? (b._resize({ w: e.w, h: e.h }),
                (b.viewsHeaderNode.style.display = "none"))
              : b.update();
            this._toggleTooltip();
            var g = this,
              m = this.getSelected();
            m &&
              b.store.fetch({
                onComplete: function(a) {
                  var c =
                    (a = g._locate(m, g._selectedInfo, a)) &&
                    b.views.views[0].getCellNode(a[0], a[1]);
                  c &&
                    g._rowClicked(
                      { cellNode: c, rowIndex: a[0], cellIndex: a[1] },
                      !0
                    );
                }
              });
            9 > a("ie") && setTimeout(this._repaintItems, this._ieTimer);
            c = this.featureLayers;
            e = this.items;
            (c && c.length) ||
              (e && e.length) ||
              !b ||
              !this.emptyMessage ||
              b.showMessage(this.emptyMessage);
          },
          _eventMap: { "selection-change": !0 },
          onSelectionChange: function() {},
          _setUseLegendAttr: function(a) {
            var c = this.useLegend;
            (this._started && c === a) ||
              (a ? (this._flChanged = 1) : this._clearLegendInfo());
            this.useLegend = a;
          },
          _setFeatureLayersAttr: function(a) {
            var c = this.featureLayers;
            (this._started && c === a) || (this._flChanged = 1);
            this.featureLayers = a;
          },
          _adjustRowsCols: function(a) {
            if ("auto" === this.rows && "auto" === this.columns)
              this._started ||
                ((this._rows = !1),
                (this._columns = null),
                (this._autoWidth = !1));
            else {
              var c = 0;
              this._rows = this.rows;
              this._columns = this.columns;
              "auto" === this.rows
                ? (this.featureLayers
                    ? this.grouping
                      ? ((c = a.length),
                        e.forEach(
                          a,
                          function(a) {
                            c += Math.ceil(a.length / this.columns);
                          },
                          this
                        ))
                      : (e.forEach(
                          a,
                          function(a) {
                            c += a.length;
                          },
                          this
                        ),
                        (c = Math.ceil(c / this.columns)))
                    : (c = Math.ceil(a.length / this.columns)),
                  (this._rows = c))
                : "auto" === this.columns &&
                  (this.featureLayers
                    ? this.grouping
                      ? (c = 3)
                      : (e.forEach(
                          a,
                          function(a) {
                            c += a.length;
                          },
                          this
                        ),
                        (c = Math.ceil(c / this.rows)))
                    : (c = Math.ceil(a.length / this.rows)),
                  (this._columns = c));
            }
          },
          _preprocess: function() {
            this.items && (this.grouping = !1);
            this._autoWidth = !1;
            if ("auto" === this.rows || "auto" === this.columns)
              this._autoWidth = !0;
            var a;
            if (this.featureLayers)
              if (
                (this.useLegend &&
                  this._flChanged &&
                  ((this._legendIndices = []),
                  (this._loadingIndices = []),
                  (this._legendSymbols = {}),
                  this._ignoreLegends(),
                  (this._loadingLegends = []),
                  clearTimeout(this._legendTimer),
                  (this._legendTimer = null),
                  this._processSelectionLayers(),
                  (this._flChanged = 0)),
                e.every(this.featureLayers, function(a) {
                  return a.loaded;
                }))
              )
                (this.featureLayers = e.filter(this.featureLayers, function(a) {
                  return !(a.hasZ && !a.enableZDefaults);
                })),
                  (a = this._flItems = this._getItemsFromLayers(
                    this.featureLayers
                  )),
                  this._adjustRowsCols(a);
              else {
                var c = this.featureLayers.length;
                e.forEach(
                  this.featureLayers,
                  function(a) {
                    if (a.loaded) c--;
                    else
                      var b = h.connect(a, "onLoad", this, function() {
                        h.disconnect(b);
                        b = null;
                        c--;
                        c || this.update();
                      });
                  },
                  this
                );
              }
            else
              (a = this._itItems = this._getItemsFromItems(this.items)),
                this._adjustRowsCols(a);
          },
          _processSelectionLayers: function() {
            var a,
              c,
              b,
              d,
              f,
              k,
              m,
              l = {};
            e.forEach(this.featureLayers, function(e, f) {
              e.mode === x.MODE_SELECTION &&
                e._map &&
                e.url &&
                e._params.drawMode &&
                !e.source &&
                ((c = g
                  .trim(e._url.path)
                  .replace(/\/(MapServer|FeatureServer).*/gi, "/MapServer")
                  .replace(/^https?:\/\//gi, "")
                  .toLowerCase()),
                (b = l[c] = l[c] || {}),
                (d = b.featureLayers = b.featureLayers || {}),
                (k = b.indices = b.indices || []),
                (d[f] = e),
                k.push(f),
                (a = e._map));
            });
            a &&
              e.forEach(
                a.layerIds,
                function(d) {
                  (d = a.getLayer(d)) &&
                    d.url &&
                    (d.getImageUrl || d.getTileUrl) &&
                    d.loaded &&
                    10.1 <= d.version &&
                    ((c = g
                      .trim(d._url.path)
                      .replace(/(\/MapServer).*/gi, "$1")),
                    (f = c.replace(/^https?:\/\//gi, "").toLowerCase()),
                    l[f] &&
                      !l[f].mapServiceUrl &&
                      ((b = l[f]),
                      (b.mapServiceUrl = c),
                      (b.mapServiceLayer = d),
                      (this._legendIndices = this._legendIndices.concat(
                        b.indices
                      )),
                      (m = this._fetchLegend(
                        { pickerInstance: this, info: b },
                        f
                      )),
                      m.then
                        ? ((this._loadingIndices = this._loadingIndices.concat(
                            b.indices
                          )),
                          this._loadingLegends.push(m))
                        : this._processLegendResponse(m, b)));
                },
                this
              );
          },
          _fetchLegend: function(a, c) {
            var b = K.prototype,
              d = b.legendCache[c];
            d
              ? d.then && d._contexts.push(a)
              : ((d = b.legendCache[c] = E({
                  url: a.info.mapServiceUrl + "/legend",
                  content: { f: "json" },
                  callbackParamName: "callback"
                })),
                (d._contexts = [a]),
                d.addBoth(function(a) {
                  if (!d.canceled) {
                    b.legendCache[c] = a;
                    var f = d._contexts;
                    d._contexts = null;
                    e.forEach(f, function(c) {
                      var b = c.pickerInstance;
                      c = c.info;
                      var f;
                      b._destroyed ||
                        (e.forEach(c.indices, function(a) {
                          f = e.indexOf(b._loadingIndices, a);
                          -1 < f && b._loadingIndices.splice(f, 1);
                        }),
                        (f = e.indexOf(b._loadingLegends, d)),
                        -1 < f && b._loadingLegends.splice(f, 1),
                        b._processLegendResponse(a, c));
                    });
                  }
                }));
            return d;
          },
          _clearLegendInfo: function() {
            clearTimeout(this._legendTimer);
            this._ignoreLegends();
            this._legendIndices = this._loadingIndices = this._legendSymbols = this._loadingLegends = this._legendTimer = null;
          },
          _ignoreLegends: function() {
            this._loadingLegends &&
              e.forEach(
                this._loadingLegends,
                function(a) {
                  var c = -1;
                  e.some(
                    a._contexts,
                    function(a, b) {
                      a.pickerInstance === this && (c = b);
                      return -1 < c;
                    },
                    this
                  );
                  -1 < c && a._contexts.splice(c, 1);
                },
                this
              );
          },
          _processLegendResponse: function(a, c) {
            if (!a || a instanceof Error) {
              var b;
              e.forEach(
                c.indices,
                function(a) {
                  b = e.indexOf(this._legendIndices, a);
                  -1 < b && this._legendIndices.splice(b, 1);
                },
                this
              );
            } else
              e.forEach(
                c.indices,
                function(b) {
                  var d = c.featureLayers[b].layerId,
                    f,
                    k = c.mapServiceUrl + "/" + d + "/images/",
                    g = c.mapServiceLayer._getToken(),
                    m,
                    l,
                    h,
                    p;
                  this._legendSymbols[b] ||
                    ((m = null),
                    e.some(a.layers, function(a) {
                      a.layerId == d && (m = a);
                      return !!m;
                    }),
                    m &&
                      ((l = this._legendSymbols[b] = {}),
                      e.forEach(m.legend, function(a) {
                        if ((h = a.values) && h.length)
                          for (f = 0; f < h.length; f++) l[h[f]] = a;
                        else l.defaultSymbol = a;
                        (p = a.url) &&
                          !a._fixed &&
                          ((a._fixed = 1),
                          -1 === p.search(/https?\:/) && (a.url = k + p),
                          g &&
                            -1 !== a.url.search(/https?\:/) &&
                            (a.url +=
                              (-1 < a.url.indexOf("?") ? "\x26" : "?") +
                              "token\x3d" +
                              g));
                      })));
                },
                this
              );
            var d = this;
            d._started &&
              !d._legendTimer &&
              (d._legendTimer = setTimeout(function() {
                clearTimeout(d._legendTimer);
                d._legendTimer = null;
                d._destroyed || d.update();
              }, 0));
          },
          _applyGridPatches: function() {
            var a = this.grid,
              c = a.adaptWidth,
              b,
              d,
              e;
            a.adaptWidth = function() {
              b = this.views.views;
              for (d = 0; (e = b[d]); d++)
                t.set(e.headerNode, "display", "block");
              c.apply(this, arguments);
              for (d = 0; (e = b[d]); d++)
                t.set(e.headerNode, "display", "none");
            };
            if (this._dojo14x) {
              if ("auto" !== this.rows && "auto" !== this.columns)
                var f = h.connect(a, "_onFetchComplete", this, function() {
                  h.disconnect(f);
                  this.grid.set("autoHeight", this._rows);
                });
              h.connect(a, "_onDelete", this, this._destroyItems);
              h.connect(a, "_clearData", this, this._destroyItems);
              h.connect(a, "destroy", this, this._destroyItems);
              (a = a.focus) &&
                a.findAndFocusGridCell &&
                (a.findAndFocusGridCell = function() {
                  return !1;
                });
            }
          },
          _setGridLayout: function() {
            var a = function(a) {
                return function(c, b) {
                  return this._cellGet(a, c, b);
                };
              },
              c = g.hitch(this, this._cellFormatter),
              b = [],
              d = this._columns,
              e;
            for (e = 0; e < d; e++)
              b.push({
                field: "cell" + e,
                get: g.hitch(this, a(e)),
                formatter: c
              });
            a = { cells: [b] };
            this.grouping &&
              ((d = {
                field: "groupName",
                colSpan: d,
                get: g.hitch(this, this._cellGetGroup),
                formatter: g.hitch(this, this._cellGroupFormatter)
              }),
              a.cells.push([d]));
            d = this.grid;
            c = r.prototype.rowsPerPage;
            d.set("rowsPerPage", this._rows > c ? this._rows : c);
            d.set("structure", a);
          },
          _setGridData: function() {
            var a = [];
            if (this.grouping) {
              this._groupRowIndices = [];
              var c,
                b,
                d = this._columns;
              e.forEach(
                this._flItems,
                function(e, f) {
                  a.push({});
                  f = 0 === f ? 0 : c + b + 1;
                  this._groupRowIndices.push(f);
                  c = f;
                  b = Math.ceil(e.length / d);
                  a = a.concat(this._getStoreItems(e));
                },
                this
              );
            } else
              this.featureLayers
                ? (e.forEach(this._flItems, function(c) {
                    a = a.concat(c);
                  }),
                  (a = this._getStoreItems(a)))
                : (a = this._getStoreItems(this._itItems));
            var f = new u({ data: { items: a } });
            this.grid.setStore(f);
          },
          _toggleTooltip: function() {
            if (this.showTooltip) {
              if (!this.tooltip) {
                this.tooltip = p.create(
                  "div",
                  { class: "esriMapTooltip" },
                  this.domNode
                );
                this.tooltip.style.display = "none";
                this.tooltip.style.position = "fixed";
                var a = this.grid;
                this._mouseOverConnect = h.connect(
                  a,
                  "onCellMouseOver",
                  this,
                  this._cellMouseOver
                );
                this._mouseOutConnect = h.connect(
                  a,
                  "onCellMouseOut",
                  this,
                  this._cellMouseOut
                );
              }
            } else
              this.tooltip &&
                (h.disconnect(this._mouseOverConnect),
                h.disconnect(this._mouseOutConnect),
                p.destroy(this.tooltip),
                (this.tooltip = null));
          },
          _rowClicked: function(a, b) {
            var d = a.cellNode,
              e = a.rowIndex;
            a = a.cellIndex;
            var f = this._getCellInfo(d, e, a);
            if (f) {
              var k = this.grid.store;
              if (
                !k.getValue(f, "loadingCell") &&
                (this._selectedCell &&
                  c.remove(this._selectedCell, "selectedItem"),
                d !== this._selectedCell
                  ? (c.add(d, "selectedItem"),
                    (this._selectedCell = d),
                    (this._selectedItem = {
                      featureLayer: k.getValue(f, "layer"),
                      type: k.getValue(f, "type"),
                      template: k.getValue(f, "template"),
                      symbolInfo: k.getValue(f, "symbolInfo"),
                      item: this._getItem(f)
                    }),
                    (this._selectedInfo = {
                      selRow: e,
                      selCol: a,
                      index1: k.getValue(f, "index1"),
                      index2: k.getValue(f, "index2"),
                      index: k.getValue(f, "index")
                    }))
                  : (this._selectedCell = this._selectedInfo = this._selectedItem = null),
                !b)
              )
                this.onSelectionChange();
            }
          },
          _locate: function(a, c, b) {
            var d = this.grid.store,
              f = Array(this._columns),
              k,
              g = c.index1,
              m = c.index2,
              l = c.index,
              h = a.item;
            e.some(b, function(a, c) {
              return e.some(f, function(b, e) {
                return (b = d.getValue(a, "cell" + e)) &&
                  (h
                    ? l === d.getValue(b, "index")
                    : g === d.getValue(b, "index1") &&
                      m === d.getValue(b, "index2"))
                  ? ((k = [c, e]), !0)
                  : !1;
              });
            });
            return k;
          },
          _getCellInfo: function(a, c, b) {
            if (a)
              return (
                (a = this.grid),
                (c = a.getItem(c)),
                a.store.getValue(c, "cell" + b)
              );
          },
          _getItem: function(a) {
            var c = this.items;
            if (c) return c[this.grid.store.getValue(a, "index")];
          },
          _cellMouseOver: function(a) {
            var c = this.tooltip,
              b = a.cellNode,
              d = this._getCellInfo(b, a.rowIndex, a.cellIndex);
            if (c && d) {
              var e = this.grid.store;
              a = e.getValue(d, "template");
              var f = e.getValue(d, "type"),
                k = e.getValue(d, "symbolInfo"),
                e = e.getValue(d, "layer");
              a =
                ((d = this._getItem(d)) &&
                  d.label + (d.description ? ": " + d.description : "")) ||
                (a && a.name + (a.description ? ": " + a.description : "")) ||
                (f && f.name) ||
                (k && k.label + (k.description ? ": " + k.description : "")) ||
                (e && e.name + ": ") + "Default";
              c.style.display = "none";
              c.innerHTML = a;
              b = l.coords(b.firstChild);
              t.set(c, { left: b.x + "px", top: b.y + b.h + 5 + "px" });
              c.style.display = "";
            }
          },
          _cellMouseOut: function() {
            var a = this.tooltip;
            a && (a.style.display = "none");
          },
          _destroyItems: function() {
            var a = this._itemWidgets,
              c;
            for (c in a) a[c] && (a[c].destroy(), delete a[c]);
          },
          _repaintItems: function() {
            var a = this._itemWidgets,
              c;
            for (c in a) {
              var b = a[c];
              b && b._repaint(b._surface);
            }
          },
          _getStoreItems: function(a) {
            var c = this._uniqueId;
            a = e.map(a, function(a) {
              return g.mixin({ surfaceId: "tpick-surface-" + c.id++ }, a);
            });
            for (
              var b = a.length,
                d = 0,
                f = {},
                k = 0,
                m,
                l = [],
                h = !0,
                p = this._columns;
              d < b;

            )
              (h = !0),
                (m = "cell" + k),
                (f[m] = a[d]),
                d++,
                k++,
                0 === k % p && ((h = !1), l.push(f), (f = {}), (k = 0));
            h && b && l.push(f);
            return l;
          },
          _getItemsFromLayers: function(a) {
            var c = [];
            e.forEach(
              a,
              function(a, b) {
                c.push(this._getItemsFromLayer(a, b));
              },
              this
            );
            return c;
          },
          _getItemsFromLayer: function(a, c) {
            var d = [];
            if (this.useLegend && -1 < e.indexOf(this._loadingIndices, c))
              return [
                {
                  label: (this._nls && this._nls.loading) || "",
                  symbol: null,
                  layer: a,
                  type: null,
                  template: null,
                  index1: c,
                  index2: 0,
                  loadingCell: 1
                }
              ];
            var f = [],
              f = f.concat(a.templates);
            e.forEach(a.types, function(a) {
              var c = a.templates;
              e.forEach(c, function(c) {
                c._type_ = a;
              });
              f = f.concat(c);
            });
            var f = e.filter(f, G.isDefined),
              m = a.renderer;
            if (m) {
              var l = m.declaredClass.replace("esri.renderer.", "");
              if (0 < f.length)
                e.forEach(
                  f,
                  function(f) {
                    var g = f.prototype;
                    if (g) {
                      var h;
                      if (
                        (h = this._isUnclassedRenderer(m)
                          ? m.infos[0].symbol
                          : m.valueExpression
                          ? this._createSimpleSymbol(a)
                          : m.getSymbol(g) || this._createSimpleSymbol(a))
                      ) {
                        var p = null,
                          r;
                        if (
                          !(9 > k("ie")) &&
                          f.thumbnail &&
                          f.thumbnail.imageData
                        )
                          p = new v(f.thumbnail);
                        else if (
                          this.useLegend &&
                          -1 < e.indexOf(this._legendIndices, c)
                        ) {
                          if (
                            (r = this._legendSymbols && this._legendSymbols[c])
                          )
                            switch (l) {
                              case "SimpleRenderer":
                                p = r.defaultSymbol;
                                break;
                              case "UniqueValueRenderer":
                                e.some(m.infos, function(a) {
                                  a.symbol === h && (p = r[a.value]);
                                  return !!p;
                                });
                                break;
                              case "ClassBreaksRenderer":
                                e.some(m.infos, function(a) {
                                  a.symbol === h && (p = r[a.maxValue]);
                                  return !!p;
                                });
                            }
                          p &&
                            ((g = b.fromJson(b.toJson(v.defaultProps))),
                            (g.url = p.url),
                            (g.imageData = p.imageData),
                            (g.contentType = p.contentType),
                            (g.width = p.width),
                            (g.height = p.height),
                            (G.isDefined(g.width) && G.isDefined(g.height)) ||
                              ((g.width = 15), (g.height = 15)),
                            (p = new v(g)));
                        }
                        d.push({
                          label: this._trimLabel(f.name),
                          symbol: p || h,
                          legendOverride: !!p,
                          layer: a,
                          type: f._type_,
                          template: f,
                          index1: c,
                          index2: d.length
                        });
                      } else
                        switch (l) {
                          case "HeatmapRenderer":
                            d.push({
                              label: this._trimLabel(f.name),
                              symbol: new B(),
                              legendOverride: !!p,
                              layer: a,
                              type: f._type_,
                              template: f,
                              index1: c,
                              index2: d.length
                            });
                        }
                    }
                    delete f._type_;
                  },
                  this
                );
              else {
                var h = [];
                "TemporalRenderer" === l &&
                  (m = m.observationRenderer) &&
                  (l = m.declaredClass.replace("esri.renderer.", ""));
                switch (l) {
                  case "SimpleRenderer":
                    h = [
                      {
                        symbol: m.symbol,
                        label: m.label,
                        description: m.description
                      }
                    ];
                    break;
                  case "UniqueValueRenderer":
                  case "ClassBreaksRenderer":
                    h = m.infos;
                }
                d = e.map(
                  h,
                  function(b, d) {
                    return {
                      label: this._trimLabel(b.label),
                      description: b.description,
                      symbolInfo: g.mixin({ constructor: function() {} }, b),
                      symbol: b.symbol,
                      layer: a,
                      index1: c,
                      index2: d
                    };
                  },
                  this
                );
              }
            }
            return d;
          },
          _isUnclassedRenderer: function(a) {
            return !!(
              (a.hasVisualVariables("sizeInfo", !1) ||
                a.hasVisualVariables("colorInfo", !1) ||
                a.hasVisualVariables("opacityInfo", !1)) &&
              a.addBreak &&
              a.infos &&
              1 === a.infos.length
            );
          },
          _createSimpleSymbol: function(a) {
            var c;
            switch (a.geometryType) {
              case "esriGeometryPoint":
              case "esriGeometryMultipoint":
                c = new B();
                break;
              case "esriGeometryPolyline":
                c = new z();
                break;
              case "esriGeometryPolygon":
                c = new w();
                break;
              default:
                a.hasXYFootprint && a.hasXYFootprint() && (c = new w());
            }
            return c;
          },
          _getItemsFromItems: function(a) {
            return e.map(
              a,
              function(a, c) {
                a = g.mixin({ index: c }, a);
                a.label = this._trimLabel(a.label);
                return a;
              },
              this
            );
          },
          _trimLabel: function(a) {
            var c = this.maxLabelLength;
            c && a && a.length > c && (a = a.substr(0, c) + "...");
            return a || "";
          },
          _cellGet: function(a, c, b) {
            return b ? this.grid.store.getValue(b, "cell" + a) : "";
          },
          _cellFormatter: function(a) {
            if (a) {
              var c = this._itemWidgets,
                b = this.grid.store,
                d = b.getValue(a, "surfaceId"),
                e = c[d];
              e ||
                (e = c[d] = new H({
                  id: d,
                  label: b.getValue(a, "label"),
                  symbol: b.getValue(a, "symbol"),
                  legendOverride: b.getValue(a, "legendOverride"),
                  surfaceWidth: this.surfaceWidth,
                  surfaceHeight: this.surfaceHeight,
                  template: b.getValue(a, "template")
                }));
              return e || "";
            }
            return "";
          },
          _cellGetGroup: function(a, c) {
            if (!this._groupRowIndices) return "";
            a = e.indexOf(this._groupRowIndices, a);
            return c && -1 !== a
              ? ((c = this.featureLayers[a]) &&
                  (this.groupLabelFunction
                    ? this.groupLabelFunction(c)
                    : c.name)) ||
                  ""
              : "";
          },
          _cellGroupFormatter: function(a) {
            return a
              ? "\x3cdiv class\x3d'groupLabel'\x3e" + a + "\x3c/div\x3e"
              : "";
          }
        });
        a("extend-esri") && g.setObject("dijit.editing.TemplatePicker", K, D);
        return K;
      });
    },
    "dojox/grid/DataGrid": function() {
      define("../main dojo/_base/array dojo/_base/lang dojo/_base/json dojo/_base/sniff dojo/_base/declare ./_Grid ./DataSelection dojo/_base/html dojo/has dojo/has!dojo-bidi?./bidi/_BidiMixin".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m) {
        var k = b("dojox.grid.DataGrid", d, {
          store: null,
          query: null,
          queryOptions: null,
          fetchText: "...",
          sortFields: null,
          updateDelay: 1,
          items: null,
          _store_connects: null,
          _by_idty: null,
          _by_idx: null,
          _cache: null,
          _pages: null,
          _pending_requests: null,
          _bop: -1,
          _eop: -1,
          _requests: 0,
          rowCount: 0,
          _isLoaded: !1,
          _isLoading: !1,
          keepSelection: !1,
          postCreate: function() {
            this._pages = [];
            this._store_connects = [];
            this._by_idty = {};
            this._by_idx = [];
            this._cache = [];
            this._pending_requests = {};
            this._setStore(this.store);
            this.inherited(arguments);
          },
          destroy: function() {
            this.selection.destroy();
            this.inherited(arguments);
          },
          createSelection: function() {
            this.selection = new a(this);
          },
          get: function(a, b) {
            if (b && "_item" == this.field && !this.fields) return b;
            if (b && this.fields) {
              var c = [],
                d = this.grid.store;
              g.forEach(this.fields, function(a) {
                c = c.concat(d.getValues(b, a));
              });
              return c;
            }
            return b || "string" !== typeof a
              ? b
                ? this.field
                  ? "_item" == this.field
                    ? b
                    : this.grid.store.getValue(b, this.field)
                  : this.value
                : this.defaultValue
              : this.inherited(arguments);
          },
          _checkUpdateStatus: function() {
            if (0 < this.updateDelay) {
              var a = !1;
              this._endUpdateDelay &&
                (clearTimeout(this._endUpdateDelay),
                delete this._endUpdateDelay,
                (a = !0));
              this.updating || (this.beginUpdate(), (a = !0));
              if (a) {
                var b = this;
                this._endUpdateDelay = setTimeout(function() {
                  delete b._endUpdateDelay;
                  b.endUpdate();
                }, this.updateDelay);
              }
            }
          },
          _onSet: function(a, b, d, e) {
            this._checkUpdateStatus();
            a = this.getItemIndex(a);
            -1 < a && this.updateRow(a);
          },
          _createItem: function(a, b) {
            b = this._hasIdentity
              ? this.store.getIdentity(a)
              : l.toJson(this.query) +
                ":idx:" +
                b +
                ":sort:" +
                l.toJson(this.getSortProps());
            return (this._by_idty[b] = { idty: b, item: a });
          },
          _addItem: function(a, b, d) {
            this._by_idx[b] = this._createItem(a, b);
            d || this.updateRow(b);
          },
          _onNew: function(a, b) {
            this._checkUpdateStatus();
            b = this.get("rowCount");
            this._addingItem = !0;
            this.updateRowCount(b + 1);
            this._addingItem = !1;
            this._addItem(a, b);
            this.showMessage();
          },
          _onDelete: function(a) {
            this._checkUpdateStatus();
            a = this._getItemIndex(a, !0);
            if (0 <= a) {
              this._pages = [];
              this._eop = this._bop = -1;
              var c = this._by_idx[a];
              this._by_idx.splice(a, 1);
              delete this._by_idty[c.idty];
              this.updateRowCount(this.get("rowCount") - 1);
              0 === this.get("rowCount") &&
                this.showMessage(this.noDataMessage);
            }
            this.selection.isSelected(a) &&
              (this.selection.deselect(a),
              this.selection.selected.splice(a, 1));
          },
          _onRevert: function() {
            this._refresh();
          },
          setStore: function(a, b, d) {
            this._requestsPending(0) ||
              (this._setQuery(b, d), this._setStore(a), this._refresh(!0));
          },
          setQuery: function(a, b) {
            this._requestsPending(0) ||
              (this._setQuery(a, b), this._refresh(!0));
          },
          setItems: function(a) {
            this.items = a;
            this._setStore(this.store);
            this._refresh(!0);
          },
          _setQuery: function(a, b) {
            this.query = a;
            this.queryOptions = b || this.queryOptions;
          },
          _setStore: function(a) {
            this.store &&
              this._store_connects &&
              g.forEach(this._store_connects, this.disconnect, this);
            if ((this.store = a)) {
              a = this.store.getFeatures();
              var c = [];
              this._canEdit =
                !!a["dojo.data.api.Write"] && !!a["dojo.data.api.Identity"];
              this._hasIdentity = !!a["dojo.data.api.Identity"];
              a["dojo.data.api.Notification"] &&
                !this.items &&
                (c.push(this.connect(this.store, "onSet", "_onSet")),
                c.push(this.connect(this.store, "onNew", "_onNew")),
                c.push(this.connect(this.store, "onDelete", "_onDelete")));
              this._canEdit &&
                c.push(this.connect(this.store, "revert", "_onRevert"));
              this._store_connects = c;
            }
          },
          _onFetchBegin: function(a, b) {
            this.scroller &&
              (this.rowCount != a &&
                (b.isRender
                  ? (this.scroller.init(a, this.keepRows, this.rowsPerPage),
                    (this.rowCount = a),
                    this._setAutoHeightAttr(this.autoHeight, !0),
                    (this._skipRowRenormalize = !0),
                    this.prerender(),
                    (this._skipRowRenormalize = !1))
                  : this.updateRowCount(a)),
              a
                ? this.showMessage()
                : (this.views.render(),
                  this._resize(),
                  this.showMessage(this.noDataMessage),
                  this.focus.initFocusView()));
          },
          _onFetchComplete: function(a, b) {
            this.scroller &&
              (a &&
                0 < a.length &&
                (g.forEach(
                  a,
                  function(a, c) {
                    this._addItem(a, b.start + c, !0);
                  },
                  this
                ),
                this.updateRows(b.start, a.length),
                b.isRender
                  ? (this.setScrollTop(0), this.postrender())
                  : this._lastScrollTop &&
                    this.setScrollTop(this._lastScrollTop),
                e("ie") && m.setSelectable(this.domNode, this.selectable)),
              delete this._lastScrollTop,
              this._isLoaded || ((this._isLoading = !1), (this._isLoaded = !0)),
              (this._pending_requests[b.start] = !1));
          },
          _onFetchError: function(a, b) {
            console.log(a);
            delete this._lastScrollTop;
            this._isLoaded ||
              ((this._isLoading = !1),
              (this._isLoaded = !0),
              this.showMessage(this.errorMessage));
            this._pending_requests[b.start] = !1;
            this.onFetchError(a, b);
          },
          onFetchError: function(a, b) {},
          _fetch: function(a, b) {
            a = a || 0;
            if (this.store && !this._pending_requests[a]) {
              this._isLoaded ||
                this._isLoading ||
                ((this._isLoading = !0), this.showMessage(this.loadingMessage));
              this._pending_requests[a] = !0;
              try {
                if (this.items) {
                  var c = this.items,
                    d = this.store;
                  this.rowsPerPage = c.length;
                  var e = { start: a, count: this.rowsPerPage, isRender: b };
                  this._onFetchBegin(c.length, e);
                  var k = 0;
                  g.forEach(c, function(a) {
                    d.isItemLoaded(a) || k++;
                  });
                  if (0 === k) this._onFetchComplete(c, e);
                  else {
                    var m = function(a) {
                      k--;
                      0 === k && this._onFetchComplete(c, e);
                    };
                    g.forEach(
                      c,
                      function(a) {
                        d.isItemLoaded(a) ||
                          d.loadItem({ item: a, onItem: m, scope: this });
                      },
                      this
                    );
                  }
                } else
                  this.store.fetch({
                    start: a,
                    count: this.rowsPerPage,
                    query: this.query,
                    sort: this.getSortProps(),
                    queryOptions: this.queryOptions,
                    isRender: b,
                    onBegin: h.hitch(this, "_onFetchBegin"),
                    onComplete: h.hitch(this, "_onFetchComplete"),
                    onError: h.hitch(this, "_onFetchError")
                  });
              } catch (r) {
                this._onFetchError(r, { start: a, count: this.rowsPerPage });
              }
            }
          },
          _clearData: function() {
            this.updateRowCount(0);
            this._by_idty = {};
            this._by_idx = [];
            this._pages = [];
            this._bop = this._eop = -1;
            this._isLoading = this._isLoaded = !1;
          },
          getItem: function(a) {
            var c = this._by_idx[a];
            return !c || (c && !c.item) ? (this._preparePage(a), null) : c.item;
          },
          getItemIndex: function(a) {
            return this._getItemIndex(a, !1);
          },
          _getItemIndex: function(a, b) {
            if (!b && !this.store.isItem(a)) return -1;
            b = this._hasIdentity ? this.store.getIdentity(a) : null;
            for (var c = 0, d = this._by_idx.length; c < d; c++) {
              var e = this._by_idx[c];
              if (e && ((b && e.idty == b) || e.item === a)) return c;
            }
            return -1;
          },
          filter: function(a, b) {
            this.query = a;
            b && this._clearData();
            this._fetch();
          },
          _getItemAttr: function(a, b) {
            return (a = this.getItem(a))
              ? this.store.getValue(a, b)
              : this.fetchText;
          },
          _render: function() {
            this.domNode.parentNode &&
              (this.scroller.init(
                this.get("rowCount"),
                this.keepRows,
                this.rowsPerPage
              ),
              this.prerender(),
              this._fetch(0, !0));
          },
          _requestsPending: function(a) {
            return this._pending_requests[a];
          },
          _rowToPage: function(a) {
            return this.rowsPerPage ? Math.floor(a / this.rowsPerPage) : a;
          },
          _pageToRow: function(a) {
            return this.rowsPerPage ? this.rowsPerPage * a : a;
          },
          _preparePage: function(a) {
            (a < this._bop || a >= this._eop) &&
              !this._addingItem &&
              ((a = this._rowToPage(a)),
              this._needPage(a),
              (this._bop = a * this.rowsPerPage),
              (this._eop =
                this._bop + (this.rowsPerPage || this.get("rowCount"))));
          },
          _needPage: function(a) {
            this._pages[a] || ((this._pages[a] = !0), this._requestPage(a));
          },
          _requestPage: function(a) {
            a = this._pageToRow(a);
            0 < Math.min(this.rowsPerPage, this.get("rowCount") - a) &&
              (this._requests++,
              this._requestsPending(a) ||
                setTimeout(h.hitch(this, "_fetch", a, !1), 1));
          },
          getCellName: function(a) {
            return a.field;
          },
          _refresh: function(a) {
            this._clearData();
            this._fetch(0, a);
          },
          sort: function() {
            this.edit.apply();
            this._lastScrollTop = this.scrollTop;
            this._refresh();
          },
          canSort: function() {
            return !this._isLoading;
          },
          getSortProps: function() {
            var a = this.getCell(this.getSortIndex());
            if (a) {
              var b = a.sortDesc,
                d = !(0 < this.sortInfo);
              return [
                {
                  attribute: a.field,
                  descending: "undefined" == typeof b ? d : d ? !b : b
                }
              ];
            }
            return this.sortFields ? this.sortFields : null;
          },
          styleRowState: function(a) {
            if (this.store && this.store.getState) {
              for (
                var c = this.store.getState(a.index),
                  b = "",
                  d = 0,
                  e = ["inflight", "error", "inserting"],
                  k;
                (k = e[d]);
                d++
              )
                if (c[k]) {
                  b = " dojoxGridRow-" + k;
                  break;
                }
              a.customClasses += b;
            }
          },
          onStyleRow: function(a) {
            this.styleRowState(a);
            this.inherited(arguments);
          },
          canEdit: function(a, b) {
            return this._canEdit;
          },
          _copyAttr: function(a, b) {
            a = this.getItem(a);
            return this.store.getValue(a, b);
          },
          doStartEdit: function(a, b) {
            this._cache[b] || (this._cache[b] = this._copyAttr(b, a.field));
            this.onStartEdit(a, b);
          },
          doApplyCellEdit: function(a, b, d) {
            this.store.fetchItemByIdentity({
              identity: this._by_idx[b].idty,
              onItem: h.hitch(this, function(c) {
                var e = this.store.getValue(c, d);
                "number" == typeof e
                  ? (a = isNaN(a) ? a : parseFloat(a))
                  : "boolean" == typeof e
                  ? (a = "true" == a ? !0 : "false" == a ? !1 : a)
                  : e instanceof Date &&
                    ((e = new Date(a)), (a = isNaN(e.getTime()) ? a : e));
                this.store.setValue(c, d, a);
                this.onApplyCellEdit(a, b, d);
              })
            });
          },
          doCancelEdit: function(a) {
            this._cache[a] && (this.updateRow(a), delete this._cache[a]);
            this.onCancelEdit.apply(this, arguments);
          },
          doApplyEdit: function(a, b) {
            this.onApplyEdit(a);
          },
          removeSelectedRows: function() {
            if (this._canEdit) {
              this.edit.apply();
              var a = h.hitch(this, function(a) {
                a.length &&
                  (g.forEach(a, this.store.deleteItem, this.store),
                  this.selection.clear());
              });
              this.allItemsSelected
                ? this.store.fetch({
                    query: this.query,
                    queryOptions: this.queryOptions,
                    onComplete: a
                  })
                : a(this.selection.getSelected());
            }
          }
        });
        k.cell_markupFactory = function(a, b, d) {
          var c = h.trim(m.attr(b, "field") || "");
          c && (d.field = c);
          d.field = d.field || d.name;
          if ((c = h.trim(m.attr(b, "fields") || ""))) d.fields = c.split(",");
          a && a(b, d);
        };
        k.markupFactory = function(a, b, e, g) {
          return d.markupFactory(a, b, e, h.partial(k.cell_markupFactory, g));
        };
        return k;
      });
    },
    "dojox/grid/_Grid": function() {
      define("dojo/_base/kernel ../main dojo/_base/declare ./_Events ./_Scroller ./_Layout ./_View ./_ViewManager ./_RowManager ./_FocusManager ./_EditManager ./Selection ./_RowSelector ./util dijit/_Widget dijit/_TemplatedMixin dijit/CheckedMenuItem dojo/text!./resources/_Grid.html dojo/string dojo/_base/array dojo/_base/lang dojo/_base/sniff dojox/html/metrics dojo/_base/html dojo/query dojo/dnd/common dojo/i18n!dijit/nls/loading".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H
      ) {
        n.isCopyKey || (n.isCopyKey = n.dnd.getCopyKeyState);
        h = h("dojox.grid._Grid", [f, y, l], {
          templateString: r,
          classTag: "dojoxGrid",
          rowCount: 5,
          keepRows: 75,
          rowsPerPage: 25,
          autoWidth: !1,
          initialWidth: "",
          autoHeight: "",
          rowHeight: 0,
          autoRender: !0,
          defaultHeight: "15em",
          height: "",
          structure: null,
          elasticView: -1,
          singleClickEdit: !1,
          selectionMode: "extended",
          rowSelector: "",
          columnReordering: !1,
          headerMenu: null,
          placeholderLabel: "GridColumns",
          selectable: !1,
          _click: null,
          loadingMessage:
            "\x3cspan class\x3d'dojoxGridLoading'\x3e${loadingState}\x3c/span\x3e",
          errorMessage:
            "\x3cspan class\x3d'dojoxGridError'\x3e${errorState}\x3c/span\x3e",
          noDataMessage: "",
          escapeHTMLInData: !0,
          formatterScope: null,
          editable: !1,
          summary: "",
          _setSummaryAttr: "domNode",
          sortInfo: 0,
          _placeholders: null,
          _layoutClass: b,
          buildRendering: function() {
            this.inherited(arguments);
            this.domNode.getAttribute("tabIndex") ||
              (this.domNode.tabIndex = "0");
            this.createScroller();
            this.createLayout();
            this.createViews();
            this.createManagers();
            this.createSelection();
            this.connect(this.selection, "onSelected", "onSelected");
            this.connect(this.selection, "onDeselected", "onDeselected");
            this.connect(this.selection, "onChanged", "onSelectionChanged");
            w.initOnFontResize();
            this.connect(w, "onFontResize", "textSizeChanged");
            t.funnelEvents(this.domNode, this, "doKeyEvent", t.keyEvents);
            "none" != this.selectionMode &&
              this.domNode.setAttribute(
                "aria-multiselectable",
                "single" == this.selectionMode ? "false" : "true"
              );
            z.addClass(this.domNode, this.classTag);
            this.isLeftToRight() ||
              z.addClass(this.domNode, this.classTag + "Rtl");
            0 < this.rowHeight &&
              z.addClass(this.viewsNode, this.classTag + "FixedRowHeight");
          },
          postMixInProperties: function() {
            this.inherited(arguments);
            var a = n.i18n.getLocalization("dijit", "loading", this.lang);
            this.loadingMessage = C.substitute(this.loadingMessage, a);
            this.errorMessage = C.substitute(this.errorMessage, a);
            this.srcNodeRef &&
              this.srcNodeRef.style.height &&
              (this.height = this.srcNodeRef.style.height);
            this._setAutoHeightAttr(this.autoHeight, !0);
            this.lastScrollTop = this.scrollTop = 0;
          },
          postCreate: function() {
            this._placeholders = [];
            this._setHeaderMenuAttr(this.headerMenu);
            this._setStructureAttr(this.structure);
            this._click = [];
            this.inherited(arguments);
            this.domNode &&
              this.autoWidth &&
              this.initialWidth &&
              (this.domNode.style.width = this.initialWidth);
            this.domNode &&
              !this.editable &&
              z.attr(this.domNode, "aria-readonly", "true");
          },
          destroy: function() {
            this.domNode.onReveal = null;
            this.domNode.onSizeChange = null;
            delete this._click;
            this.scroller && (this.scroller.destroy(), delete this.scroller);
            this.edit.destroy();
            delete this.edit;
            this.views.destroyViews();
            this.focus && (this.focus.destroy(), delete this.focus);
            this.headerMenu &&
              this._placeholders.length &&
              (x.forEach(this._placeholders, function(a) {
                a.unReplace(!0);
              }),
              this.headerMenu.unBindDomNode(this.viewsHeaderNode));
            this.inherited(arguments);
          },
          _setAutoHeightAttr: function(a, c) {
            "string" == typeof a &&
              (a =
                a && "false" != a
                  ? "true" == a
                    ? !0
                    : window.parseInt(a, 10)
                  : !1);
            "number" == typeof a &&
              (isNaN(a) && (a = !1), 0 > a ? (a = !0) : 0 === a && (a = !1));
            this.autoHeight = a;
            this._autoHeight =
              "boolean" == typeof a
                ? a
                : "number" == typeof a
                ? a >= this.get("rowCount")
                : !1;
            this._started && !c && this.render();
          },
          _getRowCountAttr: function() {
            return this.updating &&
              this.invalidated &&
              void 0 != this.invalidated.rowCount
              ? this.invalidated.rowCount
              : this.rowCount;
          },
          textSizeChanged: function() {
            this.render();
          },
          sizeChange: function() {
            this.update();
          },
          createManagers: function() {
            this.rows = new m(this);
            this.focus = new k(this);
            this.edit = new c(this);
          },
          createSelection: function() {
            this.selection = new p(this);
          },
          createScroller: function() {
            this.scroller = new e();
            this.scroller.grid = this;
            this.scroller.renderRow = B.hitch(this, "renderRow");
            this.scroller.removeRow = B.hitch(this, "rowRemoved");
          },
          createLayout: function() {
            this.layout = new this._layoutClass(this);
            this.connect(this.layout, "moveColumn", "onMoveColumn");
          },
          onMoveColumn: function() {
            this.update();
          },
          onResizeColumn: function(a) {},
          createViews: function() {
            this.views = new a(this);
            this.views.createView = B.hitch(this, "createView");
          },
          createView: function(a, c) {
            a = new (B.getObject(a))({ grid: this, index: c });
            this.viewsNode.appendChild(a.domNode);
            this.viewsHeaderNode.appendChild(a.headerNode);
            this.views.addView(a);
            z.attr(
              this.domNode,
              "align",
              this.isLeftToRight() ? "left" : "right"
            );
            return a;
          },
          buildViews: function() {
            for (var a = 0, c; (c = this.layout.structure[a]); a++)
              this.createView(
                c.type || g._scopeName + ".grid._View",
                a
              ).setStructure(c);
            this.scroller.setContentNodes(this.views.getContentNodes());
          },
          _setStructureAttr: function(a) {
            a &&
              B.isString(a) &&
              (n.deprecated(
                "dojox.grid._Grid.set('structure', 'objVar')",
                "use dojox.grid._Grid.set('structure', objVar) instead",
                "2.0"
              ),
              (a = B.getObject(a)));
            this.structure = a;
            if (!a)
              if (this.layout.structure) a = this.layout.structure;
              else return;
            this.views.destroyViews();
            this.focus.focusView = null;
            a !== this.layout.structure && this.layout.setStructure(a);
            this._structureChanged();
          },
          setStructure: function(a) {
            n.deprecated(
              "dojox.grid._Grid.setStructure(obj)",
              "use dojox.grid._Grid.set('structure', obj) instead.",
              "2.0"
            );
            this._setStructureAttr(a);
          },
          getColumnTogglingItems: function() {
            var a,
              c = [];
            a = x.map(
              this.layout.cells,
              function(a) {
                a.menuItems || (a.menuItems = []);
                var b = this,
                  d = new u({
                    label: a.name,
                    checked: !a.hidden,
                    _gridCell: a,
                    onChange: function(a) {
                      if (
                        b.layout.setColumnVisibility(this._gridCell.index, a)
                      ) {
                        var c = this._gridCell.menuItems;
                        1 < c.length &&
                          x.forEach(
                            c,
                            function(c) {
                              c !== this && c.setAttribute("checked", a);
                            },
                            this
                          );
                        a = x.filter(b.layout.cells, function(a) {
                          1 < a.menuItems.length
                            ? x.forEach(
                                a.menuItems,
                                "item.set('disabled', false);"
                              )
                            : a.menuItems[0].set("disabled", !1);
                          return !a.hidden;
                        });
                        1 == a.length &&
                          x.forEach(
                            a[0].menuItems,
                            "item.set('disabled', true);"
                          );
                      }
                    },
                    destroy: function() {
                      var a = x.indexOf(this._gridCell.menuItems, this);
                      this._gridCell.menuItems.splice(a, 1);
                      delete this._gridCell;
                      u.prototype.destroy.apply(this, arguments);
                    }
                  });
                a.menuItems.push(d);
                a.hidden || c.push(d);
                return d;
              },
              this
            );
            1 == c.length && c[0].set("disabled", !0);
            return a;
          },
          _setHeaderMenuAttr: function(a) {
            this._placeholders &&
              this._placeholders.length &&
              (x.forEach(this._placeholders, function(a) {
                a.unReplace(!0);
              }),
              (this._placeholders = []));
            this.headerMenu &&
              this.headerMenu.unBindDomNode(this.viewsHeaderNode);
            if ((this.headerMenu = a))
              this.headerMenu.bindDomNode(this.viewsHeaderNode),
                this.headerMenu.getPlaceholders &&
                  (this._placeholders = this.headerMenu.getPlaceholders(
                    this.placeholderLabel
                  ));
          },
          setHeaderMenu: function(a) {
            n.deprecated(
              "dojox.grid._Grid.setHeaderMenu(obj)",
              "use dojox.grid._Grid.set('headerMenu', obj) instead.",
              "2.0"
            );
            this._setHeaderMenuAttr(a);
          },
          setupHeaderMenu: function() {
            this._placeholders &&
              this._placeholders.length &&
              x.forEach(
                this._placeholders,
                function(a) {
                  a._replaced && a.unReplace(!0);
                  a.replace(this.getColumnTogglingItems());
                },
                this
              );
          },
          _fetch: function(a) {
            this.setScrollTop(0);
          },
          getItem: function(a) {
            return null;
          },
          showMessage: function(a) {
            a
              ? ((this.messagesNode.innerHTML = a),
                (this.messagesNode.style.display = ""))
              : ((this.messagesNode.innerHTML = ""),
                (this.messagesNode.style.display = "none"));
          },
          _structureChanged: function() {
            this.buildViews();
            this.autoRender && this._started && this.render();
          },
          hasLayout: function() {
            return this.layout.cells.length;
          },
          resize: function(a, c) {
            this._pendingChangeSize = a;
            this._pendingResultSize = c;
            this.sizeChange();
          },
          _getPadBorder: function() {
            return (this._padBorder =
              this._padBorder || z._getPadBorderExtents(this.domNode));
          },
          _getHeaderHeight: function() {
            var a = this.viewsHeaderNode.style,
              c = "none" == a.display ? 0 : this.views.measureHeader();
            a.height = c + "px";
            this.views.normalizeHeaderNodeHeight();
            return c;
          },
          _resize: function(a, c) {
            a = a || this._pendingChangeSize;
            c = c || this._pendingResultSize;
            delete this._pendingChangeSize;
            delete this._pendingResultSize;
            if (this.domNode) {
              var b = this.domNode.parentNode;
              if (
                b &&
                1 == b.nodeType &&
                this.hasLayout() &&
                "hidden" != b.style.visibility &&
                "none" != b.style.display
              ) {
                var d = this._getPadBorder(),
                  e = void 0,
                  f;
                this._autoHeight
                  ? (this.domNode.style.height = "auto")
                  : "number" == typeof this.autoHeight
                  ? ((f = e = this._getHeaderHeight()),
                    (f += this.scroller.averageRowHeight * this.autoHeight),
                    (this.domNode.style.height = f + "px"))
                  : this.domNode.clientHeight <= d.h &&
                    (b == document.body
                      ? (this.domNode.style.height = this.defaultHeight)
                      : this.height
                      ? (this.domNode.style.height = this.height)
                      : (this.fitTo = "parent"));
                c && (a = c);
                !this._autoHeight && a
                  ? (z.marginBox(this.domNode, a),
                    (this.height = this.domNode.style.height),
                    delete this.fitTo)
                  : "parent" == this.fitTo &&
                    ((f = this._parentContentBoxHeight =
                      0 < this._parentContentBoxHeight
                        ? this._parentContentBoxHeight
                        : z._getContentBox(b).h),
                    (this.domNode.style.height = Math.max(0, f) + "px"));
                a = x.some(this.views.views, function(a) {
                  return a.flexCells;
                });
                this._autoHeight ||
                0 !== (f || z._getContentBox(this.domNode).h)
                  ? ((this.viewsHeaderNode.style.display = "block"),
                    a || void 0 !== e || (e = this._getHeaderHeight()))
                  : (this.viewsHeaderNode.style.display = "none");
                a && (e = void 0);
                this.adaptWidth();
                this.adaptHeight(e);
                this.postresize();
              }
            }
          },
          adaptWidth: function() {
            var a = !this.initialWidth && this.autoWidth,
              c = a
                ? 0
                : this.domNode.clientWidth ||
                  this.domNode.offsetWidth - this._getPadBorder().w,
              c = this.views.arrange(1, c);
            this.views.onEach("adaptWidth");
            a && (this.domNode.style.width = c + "px");
          },
          adaptHeight: function(a) {
            a = void 0 === a ? this._getHeaderHeight() : a;
            var c = this._autoHeight
              ? -1
              : Math.max(this.domNode.clientHeight - a, 0) || 0;
            this.views.onEach("setSize", [0, c]);
            this.views.onEach("adaptHeight");
            if (!this._autoHeight) {
              var b = 0,
                d = 0,
                e = x.filter(this.views.views, function(a) {
                  (a = a.hasHScrollbar()) ? b++ : d++;
                  return !a;
                });
              0 < b &&
                0 < d &&
                x.forEach(e, function(a) {
                  a.adaptHeight(!0);
                });
            }
            !0 === this.autoHeight ||
            -1 != c ||
            ("number" == typeof this.autoHeight &&
              this.autoHeight >= this.get("rowCount"))
              ? (this.scroller.windowHeight = c)
              : (this.scroller.windowHeight = Math.max(
                  this.domNode.clientHeight - a,
                  0
                ));
          },
          startup: function() {
            this._started ||
              (this.inherited(arguments), this.autoRender && this.render());
          },
          render: function() {
            this.domNode &&
              this._started &&
              (this.hasLayout()
                ? ((this.update = this.defaultUpdate), this._render())
                : this.scroller.init(0, this.keepRows, this.rowsPerPage));
          },
          _render: function() {
            this.scroller.init(
              this.get("rowCount"),
              this.keepRows,
              this.rowsPerPage
            );
            this.prerender();
            this.setScrollTop(0);
            this.postrender();
          },
          prerender: function() {
            this.keepRows = this._autoHeight ? 0 : this.keepRows;
            this.scroller.setKeepInfo(this.keepRows);
            this.views.render();
            this._resize();
          },
          postrender: function() {
            this.postresize();
            this.focus.initFocusView();
            z.setSelectable(this.domNode, this.selectable);
          },
          postresize: function() {
            if (this._autoHeight) {
              var a = Math.max(this.views.measureContent()) + "px";
              this.viewsNode.style.height = a;
            }
          },
          renderRow: function(a, c) {
            this.views.renderRow(a, c, this._skipRowRenormalize);
          },
          rowRemoved: function(a) {
            this.views.rowRemoved(a);
          },
          invalidated: null,
          updating: !1,
          beginUpdate: function() {
            this.invalidated = [];
            this.updating = !0;
          },
          endUpdate: function() {
            this.updating = !1;
            var a = this.invalidated,
              c;
            if (a.all) this.update();
            else if (void 0 != a.rowCount) this.updateRowCount(a.rowCount);
            else for (c in a) this.updateRow(Number(c));
            this.invalidated = [];
          },
          defaultUpdate: function() {
            this.domNode &&
              (this.updating
                ? (this.invalidated.all = !0)
                : ((this.lastScrollTop = this.scrollTop),
                  this.prerender(),
                  this.scroller.invalidateNodes(),
                  this.setScrollTop(this.lastScrollTop),
                  this.postrender()));
          },
          update: function() {
            this.render();
          },
          updateRow: function(a) {
            a = Number(a);
            this.updating
              ? (this.invalidated[a] = !0)
              : (this.views.updateRow(a), this.scroller.rowHeightChanged(a));
          },
          updateRows: function(a, c) {
            a = Number(a);
            c = Number(c);
            var b;
            if (this.updating)
              for (b = 0; b < c; b++) this.invalidated[b + a] = !0;
            else {
              for (b = 0; b < c; b++)
                this.views.updateRow(b + a, this._skipRowRenormalize);
              this.scroller.rowHeightChanged(a);
            }
          },
          updateRowCount: function(a) {
            this.updating
              ? (this.invalidated.rowCount = a)
              : ((this.rowCount = a),
                this._setAutoHeightAttr(this.autoHeight, !0),
                this.layout.cells.length && this.scroller.updateRowCount(a),
                this.layout.cells.length && this.setScrollTop(this.scrollTop),
                this._resize());
          },
          updateRowStyles: function(a) {
            this.views.updateRowStyles(a);
          },
          getRowNode: function(a) {
            if (!this.focus.focusView || this.focus.focusView instanceof q)
              for (var c = 0, b; (b = this.views.views[c]); c++) {
                if (!(b instanceof q)) return b.rowNodes[a];
              }
            else return this.focus.focusView.rowNodes[a];
            return null;
          },
          rowHeightChanged: function(a) {
            this.views.renormalizeRow(a);
            this.scroller.rowHeightChanged(a);
          },
          fastScroll: !0,
          delayScroll: !1,
          scrollRedrawThreshold: v("ie") ? 100 : 50,
          scrollTo: function(a) {
            if (this.fastScroll) {
              var c = Math.abs(this.lastScrollTop - a);
              this.lastScrollTop = a;
              if (c > this.scrollRedrawThreshold || this.delayScroll) {
                this.delayScroll = !0;
                this.scrollTop = a;
                this.views.setScrollTop(a);
                this._pendingScroll && window.clearTimeout(this._pendingScroll);
                var b = this;
                this._pendingScroll = window.setTimeout(function() {
                  delete b._pendingScroll;
                  b.finishScrollJob();
                }, 200);
              } else this.setScrollTop(a);
            } else this.setScrollTop(a);
          },
          finishScrollJob: function() {
            this.delayScroll = !1;
            this.setScrollTop(this.scrollTop);
          },
          setScrollTop: function(a) {
            this.scroller.scroll(this.views.setScrollTop(a));
          },
          scrollToRow: function(a) {
            this.setScrollTop(this.scroller.findScrollTop(a) + 1);
          },
          styleRowNode: function(a, c) {
            c && this.rows.styleRowNode(a, c);
          },
          _mouseOut: function(a) {
            this.rows.setOverRow(-2);
          },
          getCell: function(a) {
            return this.layout.cells[a];
          },
          setCellWidth: function(a, c) {
            this.getCell(a).unitWidth = c;
          },
          getCellName: function(a) {
            return "Cell " + a.index;
          },
          canSort: function(a) {},
          sort: function() {},
          getSortAsc: function(a) {
            a = void 0 == a ? this.sortInfo : a;
            return 0 < a;
          },
          getSortIndex: function(a) {
            a = void 0 == a ? this.sortInfo : a;
            return Math.abs(a) - 1;
          },
          setSortIndex: function(a, c) {
            var b = a + 1;
            void 0 != c
              ? (b *= c ? 1 : -1)
              : this.getSortIndex() == a && (b = -this.sortInfo);
            this.setSortInfo(b);
          },
          setSortInfo: function(a) {
            this.canSort(a) &&
              ((this.sortInfo = a), this.sort(), this.update());
          },
          doKeyEvent: function(a) {
            a.dispatch = "do" + a.type;
            this.onKeyEvent(a);
          },
          _dispatch: function(a, c) {
            return a in this ? this[a](c) : !1;
          },
          dispatchKeyEvent: function(a) {
            this._dispatch(a.dispatch, a);
          },
          dispatchContentEvent: function(a) {
            this.edit.dispatchEvent(a) ||
              a.sourceView.dispatchContentEvent(a) ||
              this._dispatch(a.dispatch, a);
          },
          dispatchHeaderEvent: function(a) {
            a.sourceView.dispatchHeaderEvent(a) ||
              this._dispatch("doheader" + a.type, a);
          },
          dokeydown: function(a) {
            this.onKeyDown(a);
          },
          doclick: function(a) {
            if (a.cellNode) this.onCellClick(a);
            else this.onRowClick(a);
          },
          dodblclick: function(a) {
            if (a.cellNode) this.onCellDblClick(a);
            else this.onRowDblClick(a);
          },
          docontextmenu: function(a) {
            if (a.cellNode) this.onCellContextMenu(a);
            else this.onRowContextMenu(a);
          },
          doheaderclick: function(a) {
            if (a.cellNode) this.onHeaderCellClick(a);
            else this.onHeaderClick(a);
          },
          doheaderdblclick: function(a) {
            if (a.cellNode) this.onHeaderCellDblClick(a);
            else this.onHeaderDblClick(a);
          },
          doheadercontextmenu: function(a) {
            if (a.cellNode) this.onHeaderCellContextMenu(a);
            else this.onHeaderContextMenu(a);
          },
          doStartEdit: function(a, c) {
            this.onStartEdit(a, c);
          },
          doApplyCellEdit: function(a, c, b) {
            this.onApplyCellEdit(a, c, b);
          },
          doCancelEdit: function(a) {
            this.onCancelEdit(a);
          },
          doApplyEdit: function(a) {
            this.onApplyEdit(a);
          },
          addRow: function() {
            this.updateRowCount(this.get("rowCount") + 1);
          },
          removeSelectedRows: function() {
            this.allItemsSelected
              ? this.updateRowCount(0)
              : this.updateRowCount(
                  Math.max(
                    0,
                    this.get("rowCount") - this.selection.getSelected().length
                  )
                );
            this.selection.clear();
          }
        });
        h.markupFactory = function(a, c, b, d) {
          var e = function(a) {
            a = z.attr(a, "width") || "auto";
            "auto" != a &&
              "em" != a.slice(-2) &&
              "%" != a.slice(-1) &&
              (a = parseInt(a, 10) + "px");
            return a;
          };
          a.structure ||
            "table" != c.nodeName.toLowerCase() ||
            ((a.structure = H("\x3e colgroup", c).map(function(a) {
              var c = z.attr(a, "span"),
                c = {
                  noscroll: "true" == z.attr(a, "noscroll") ? !0 : !1,
                  __span: c ? parseInt(c, 10) : 1,
                  cells: []
                };
              z.hasAttr(a, "width") && (c.width = e(a));
              return c;
            })),
            a.structure.length ||
              a.structure.push({ __span: Infinity, cells: [] }),
            H("thead \x3e tr", c).forEach(function(c, b) {
              var f = 0,
                k = 0,
                m,
                l = null;
              H("\x3e th", c).map(function(c) {
                l
                  ? f >= m + l.__span &&
                    (k++, (m += l.__span), (l = a.structure[k]))
                  : ((m = 0), (l = a.structure[0]));
                var h = {
                  name: B.trim(z.attr(c, "name") || c.innerHTML),
                  colSpan: parseInt(z.attr(c, "colspan") || 1, 10),
                  type: B.trim(z.attr(c, "cellType") || ""),
                  id: B.trim(z.attr(c, "id") || "")
                };
                f += h.colSpan;
                var v = z.attr(c, "rowspan");
                v && (h.rowSpan = v);
                z.hasAttr(c, "width") && (h.width = e(c));
                z.hasAttr(c, "relWidth") &&
                  (h.relWidth = window.parseInt(z.attr(c, "relWidth"), 10));
                z.hasAttr(c, "hidden") &&
                  (h.hidden =
                    "true" == z.attr(c, "hidden") ||
                    !0 === z.attr(c, "hidden"));
                d && d(c, h);
                h.type = h.type ? B.getObject(h.type) : g.grid.cells.Cell;
                h.type && h.type.markupFactory && h.type.markupFactory(c, h);
                l.cells[b] || (l.cells[b] = []);
                l.cells[b].push(h);
              });
            }));
          return new b(a, c);
        };
        return h;
      });
    },
    "dojox/grid/_Events": function() {
      define([
        "dojo/keys",
        "dojo/dom-class",
        "dojo/_base/declare",
        "dojo/_base/event",
        "dojo/_base/sniff"
      ], function(n, g, h, l, e) {
        return h("dojox.grid._Events", null, {
          cellOverClass: "dojoxGridCellOver",
          onKeyEvent: function(b) {
            this.dispatchKeyEvent(b);
          },
          onContentEvent: function(b) {
            this.dispatchContentEvent(b);
          },
          onHeaderEvent: function(b) {
            this.dispatchHeaderEvent(b);
          },
          onStyleRow: function(b) {
            b.customClasses +=
              (b.odd ? " dojoxGridRowOdd" : "") +
              (b.selected ? " dojoxGridRowSelected" : "") +
              (b.over ? " dojoxGridRowOver" : "");
            this.focus.styleRow(b);
            this.edit.styleRow(b);
          },
          onKeyDown: function(b) {
            if (!b.altKey && !b.metaKey) {
              var d;
              switch (b.keyCode) {
                case n.ESCAPE:
                  this.edit.cancel();
                  break;
                case n.ENTER:
                  if (!this.edit.isEditing()) {
                    d = this.focus.getHeaderIndex();
                    if (0 <= d) {
                      this.setSortIndex(d);
                      break;
                    } else
                      this.selection.clickSelect(
                        this.focus.rowIndex,
                        dojo.isCopyKey(b),
                        b.shiftKey
                      );
                    l.stop(b);
                  }
                  b.shiftKey ||
                    ((d = this.edit.isEditing()),
                    this.edit.apply(),
                    d ||
                      this.edit.setEditCell(
                        this.focus.cell,
                        this.focus.rowIndex
                      ));
                  this.edit.isEditing() ||
                    ((
                      this.focus.focusView || this.views.views[0]
                    ).content.decorateEvent(b),
                    this.onRowClick(b),
                    l.stop(b));
                  break;
                case n.SPACE:
                  this.edit.isEditing() ||
                    ((d = this.focus.getHeaderIndex()),
                    0 <= d
                      ? this.setSortIndex(d)
                      : (this.selection.clickSelect(
                          this.focus.rowIndex,
                          dojo.isCopyKey(b),
                          b.shiftKey
                        ),
                        this.focus._focusifyCellNode(!0),
                        this.focus.setFocusCell(
                          this.focus.cell,
                          this.focus.rowIndex
                        ),
                        l.stop(b)));
                  break;
                case n.TAB:
                  this.focus[b.shiftKey ? "previousKey" : "nextKey"](b);
                  break;
                case n.LEFT_ARROW:
                case n.RIGHT_ARROW:
                  if (!this.edit.isEditing()) {
                    var a = b.keyCode;
                    l.stop(b);
                    d = this.focus.getHeaderIndex();
                    0 <= d && b.shiftKey && b.ctrlKey
                      ? this.focus.colSizeAdjust(
                          b,
                          d,
                          5 * (a == n.LEFT_ARROW ? -1 : 1)
                        )
                      : ((b = a == n.LEFT_ARROW ? 1 : -1),
                        this.isLeftToRight() && (b *= -1),
                        this.focus.move(0, b));
                  }
                  break;
                case n.UP_ARROW:
                  this.edit.isEditing() ||
                    0 === this.focus.rowIndex ||
                    (l.stop(b), this.focus.move(-1, 0));
                  break;
                case n.DOWN_ARROW:
                  this.edit.isEditing() ||
                    this.focus.rowIndex + 1 == this.rowCount ||
                    (l.stop(b), this.focus.move(1, 0));
                  break;
                case n.PAGE_UP:
                  this.edit.isEditing() ||
                    0 === this.focus.rowIndex ||
                    (l.stop(b),
                    this.focus.rowIndex != this.scroller.firstVisibleRow + 1
                      ? this.focus.move(
                          this.scroller.firstVisibleRow - this.focus.rowIndex,
                          0
                        )
                      : (this.setScrollTop(
                          this.scroller.findScrollTop(this.focus.rowIndex - 1)
                        ),
                        this.focus.move(
                          this.scroller.firstVisibleRow -
                            this.scroller.lastVisibleRow +
                            1,
                          0
                        )));
                  break;
                case n.PAGE_DOWN:
                  this.edit.isEditing() ||
                    this.focus.rowIndex + 1 == this.rowCount ||
                    (l.stop(b),
                    this.focus.rowIndex != this.scroller.lastVisibleRow - 1
                      ? this.focus.move(
                          this.scroller.lastVisibleRow -
                            this.focus.rowIndex -
                            1,
                          0
                        )
                      : (this.setScrollTop(
                          this.scroller.findScrollTop(this.focus.rowIndex + 1)
                        ),
                        this.focus.move(
                          this.scroller.lastVisibleRow -
                            this.scroller.firstVisibleRow -
                            1,
                          0
                        )));
              }
            }
          },
          onMouseOver: function(b) {
            -1 == b.rowIndex
              ? this.onHeaderCellMouseOver(b)
              : this.onCellMouseOver(b);
          },
          onMouseOut: function(b) {
            -1 == b.rowIndex
              ? this.onHeaderCellMouseOut(b)
              : this.onCellMouseOut(b);
          },
          onMouseDown: function(b) {
            -1 == b.rowIndex
              ? this.onHeaderCellMouseDown(b)
              : this.onCellMouseDown(b);
          },
          onMouseOverRow: function(b) {
            this.rows.isOver(b.rowIndex) ||
              (this.rows.setOverRow(b.rowIndex),
              -1 == b.rowIndex
                ? this.onHeaderMouseOver(b)
                : this.onRowMouseOver(b));
          },
          onMouseOutRow: function(b) {
            if (this.rows.isOver(-1)) this.onHeaderMouseOut(b);
            else
              this.rows.isOver(-2) ||
                (this.rows.setOverRow(-2), this.onRowMouseOut(b));
          },
          onMouseDownRow: function(b) {
            if (-1 != b.rowIndex) this.onRowMouseDown(b);
          },
          onCellMouseOver: function(b) {
            b.cellNode && g.add(b.cellNode, this.cellOverClass);
          },
          onCellMouseOut: function(b) {
            b.cellNode && g.remove(b.cellNode, this.cellOverClass);
          },
          onCellMouseDown: function(b) {},
          onCellClick: function(b) {
            this._click[0] = this._click[1];
            this._click[1] = b;
            this.edit.isEditCell(b.rowIndex, b.cellIndex) ||
              this.focus.setFocusCell(b.cell, b.rowIndex);
            1 < this._click.length &&
              null == this._click[0] &&
              this._click.shift();
            this.onRowClick(b);
          },
          onCellDblClick: function(b) {
            var d;
            d =
              1 < this._click.length && e("ie")
                ? this._click[1]
                : 1 < this._click.length &&
                  this._click[0].rowIndex != this._click[1].rowIndex
                ? this._click[0]
                : b;
            this.focus.setFocusCell(d.cell, d.rowIndex);
            this.edit.setEditCell(d.cell, d.rowIndex);
            this.onRowDblClick(b);
          },
          onCellContextMenu: function(b) {
            this.onRowContextMenu(b);
          },
          onCellFocus: function(b, d) {
            this.edit.cellFocus(b, d);
          },
          onRowClick: function(b) {
            this.edit.rowClick(b);
            this.selection.clickSelectEvent(b);
          },
          onRowDblClick: function(b) {},
          onRowMouseOver: function(b) {},
          onRowMouseOut: function(b) {},
          onRowMouseDown: function(b) {},
          onRowContextMenu: function(b) {
            l.stop(b);
          },
          onHeaderMouseOver: function(b) {},
          onHeaderMouseOut: function(b) {},
          onHeaderCellMouseOver: function(b) {
            b.cellNode && g.add(b.cellNode, this.cellOverClass);
          },
          onHeaderCellMouseOut: function(b) {
            b.cellNode && g.remove(b.cellNode, this.cellOverClass);
          },
          onHeaderCellMouseDown: function(b) {},
          onHeaderClick: function(b) {},
          onHeaderCellClick: function(b) {
            this.setSortIndex(b.cell.index);
            this.onHeaderClick(b);
          },
          onHeaderDblClick: function(b) {},
          onHeaderCellDblClick: function(b) {
            this.onHeaderDblClick(b);
          },
          onHeaderCellContextMenu: function(b) {
            this.onHeaderContextMenu(b);
          },
          onHeaderContextMenu: function(b) {
            this.headerMenu || l.stop(b);
          },
          onStartEdit: function(b, d) {},
          onApplyCellEdit: function(b, d, a) {},
          onCancelEdit: function(b) {},
          onApplyEdit: function(b) {},
          onCanSelect: function(b) {
            return !0;
          },
          onCanDeselect: function(b) {
            return !0;
          },
          onSelected: function(b) {
            this.updateRowStyles(b);
          },
          onDeselected: function(b) {
            this.updateRowStyles(b);
          },
          onSelectionChanged: function() {}
        });
      });
    },
    "dojox/grid/_Scroller": function() {
      define([
        "dijit/registry",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "./util",
        "dojo/_base/html"
      ], function(n, g, h, l, e) {
        var b = function(a) {
            a &&
              dojo.forEach(n.toArray(), function(b) {
                b.domNode && e.isDescendant(b.domNode, a, !0) && b.destroy();
              });
          },
          d = function(a, b) {
            for (var d = [], c = 0, g; (g = a.childNodes[c]); ) {
              c++;
              var m = e.byId(g);
              (m && m.tagName ? m.tagName.toLowerCase() : "") == b && d.push(g);
            }
            return d;
          };
        return g("dojox.grid._Scroller", null, {
          constructor: function(a) {
            this.setContentNodes(a);
            this.pageHeights = [];
            this.pageNodes = [];
            this.stack = [];
          },
          rowCount: 0,
          defaultRowHeight: 32,
          keepRows: 100,
          contentNode: null,
          scrollboxNode: null,
          defaultPageHeight: 0,
          keepPages: 10,
          pageCount: 0,
          windowHeight: 0,
          firstVisibleRow: 0,
          lastVisibleRow: 0,
          averageRowHeight: 0,
          page: 0,
          pageTop: 0,
          init: function(a, b, d) {
            switch (arguments.length) {
              case 3:
                this.rowsPerPage = d;
              case 2:
                this.keepRows = b;
              case 1:
                this.rowCount = a;
            }
            this.defaultPageHeight =
              (0 < this.grid.rowHeight
                ? this.grid.rowHeight
                : this.defaultRowHeight) * this.rowsPerPage;
            this.pageCount = this._getPageCount(
              this.rowCount,
              this.rowsPerPage
            );
            this.setKeepInfo(this.keepRows);
            this.invalidate();
            this.scrollboxNode &&
              ((this.scrollboxNode.scrollTop = 0),
              this.scroll(0),
              (this.scrollboxNode.onscroll = h.hitch(this, "onscroll")));
          },
          _getPageCount: function(a, b) {
            return a ? Math.ceil(a / b) || 1 : 0;
          },
          destroy: function() {
            this.invalidateNodes();
            delete this.contentNodes;
            delete this.contentNode;
            delete this.scrollboxNode;
          },
          setKeepInfo: function(a) {
            this.keepPages = (this.keepRows = a)
              ? Math.max(Math.ceil(this.keepRows / this.rowsPerPage), 2)
              : this.keepPages;
          },
          setContentNodes: function(a) {
            this.colCount = (this.contentNodes = a)
              ? this.contentNodes.length
              : 0;
            this.pageNodes = [];
            for (a = 0; a < this.colCount; a++) this.pageNodes[a] = [];
          },
          getDefaultNodes: function() {
            return this.pageNodes[0] || [];
          },
          invalidate: function() {
            this._invalidating = !0;
            this.invalidateNodes();
            this.pageHeights = [];
            this.height = this.pageCount
              ? (this.pageCount - 1) * this.defaultPageHeight +
                this.calcLastPageHeight()
              : 0;
            this.resize();
            this._invalidating = !1;
          },
          updateRowCount: function(a) {
            this.invalidateNodes();
            this.rowCount = a;
            a = this.pageCount;
            0 === a && (this.height = 1);
            this.pageCount = this._getPageCount(
              this.rowCount,
              this.rowsPerPage
            );
            if (this.pageCount < a)
              for (--a; a >= this.pageCount; a--)
                (this.height -= this.getPageHeight(a)),
                  delete this.pageHeights[a];
            else
              this.pageCount > a &&
                (this.height +=
                  this.defaultPageHeight * (this.pageCount - a - 1) +
                  this.calcLastPageHeight());
            this.resize();
          },
          pageExists: function(a) {
            return !!this.getDefaultPageNode(a);
          },
          measurePage: function(a) {
            return this.grid.rowHeight
              ? ((a + 1) * this.rowsPerPage > this.rowCount
                  ? this.rowCount - a * this.rowsPerPage
                  : this.rowsPerPage) * this.grid.rowHeight
              : (a = this.getDefaultPageNode(a)) && a.innerHTML
              ? a.offsetHeight
              : void 0;
          },
          positionPage: function(a, b) {
            for (var d = 0; d < this.colCount; d++)
              this.pageNodes[d][a].style.top = b + "px";
          },
          repositionPages: function(a) {
            for (
              var b = this.getDefaultNodes(), d = 0, c = 0;
              c < this.stack.length;
              c++
            )
              d = Math.max(this.stack[c], d);
            var e = (c = b[a])
              ? this.getPageNodePosition(c) + this.getPageHeight(a)
              : 0;
            for (a += 1; a <= d; a++) {
              if ((c = b[a])) {
                if (this.getPageNodePosition(c) == e) break;
                this.positionPage(a, e);
              }
              e += this.getPageHeight(a);
            }
          },
          installPage: function(a) {
            for (var b = 0; b < this.colCount; b++)
              this.contentNodes[b].appendChild(this.pageNodes[b][a]);
          },
          preparePage: function(a, b) {
            b = b ? this.popPage() : null;
            for (var d = 0; d < this.colCount; d++) {
              var c = this.pageNodes[d],
                e =
                  null === b
                    ? this.createPageNode()
                    : this.invalidatePageNode(b, c);
              e.pageIndex = a;
              c[a] = e;
            }
          },
          renderPage: function(a) {
            var b = [],
              d;
            for (d = 0; d < this.colCount; d++) b[d] = this.pageNodes[d][a];
            d = 0;
            for (
              a *= this.rowsPerPage;
              d < this.rowsPerPage && a < this.rowCount;
              d++, a++
            )
              this.renderRow(a, b);
          },
          removePage: function(a) {
            var b = 0;
            for (a *= this.rowsPerPage; b < this.rowsPerPage; b++, a++)
              this.removeRow(a);
          },
          destroyPage: function(a) {
            for (var b = 0; b < this.colCount; b++) {
              var d = this.invalidatePageNode(a, this.pageNodes[b]);
              d && e.destroy(d);
            }
          },
          pacify: function(a) {},
          pacifying: !1,
          pacifyTicks: 200,
          setPacifying: function(a) {
            this.pacifying != a &&
              ((this.pacifying = a), this.pacify(this.pacifying));
          },
          startPacify: function() {
            this.startPacifyTicks = new Date().getTime();
          },
          doPacify: function() {
            var a =
              new Date().getTime() - this.startPacifyTicks > this.pacifyTicks;
            this.setPacifying(!0);
            this.startPacify();
            return a;
          },
          endPacify: function() {
            this.setPacifying(!1);
          },
          resize: function() {
            this.scrollboxNode &&
              (this.windowHeight = this.scrollboxNode.clientHeight);
            for (var a = 0; a < this.colCount; a++)
              l.setStyleHeightPx(
                this.contentNodes[a],
                Math.max(1, this.height)
              );
            a = !this._invalidating;
            if (!a) {
              var b = this.grid.get("autoHeight");
              "number" == typeof b &&
                b <= Math.min(this.rowsPerPage, this.rowCount) &&
                (a = !0);
            }
            a && this.needPage(this.page, this.pageTop);
            a =
              this.page < this.pageCount - 1
                ? this.rowsPerPage
                : this.rowCount % this.rowsPerPage || this.rowsPerPage;
            b = this.getPageHeight(this.page);
            this.averageRowHeight = 0 < b && 0 < a ? b / a : 0;
          },
          calcLastPageHeight: function() {
            if (!this.pageCount) return 0;
            var a =
              (this.rowCount % this.rowsPerPage || this.rowsPerPage) *
              this.defaultRowHeight;
            return (this.pageHeights[this.pageCount - 1] = a);
          },
          updateContentHeight: function(a) {
            this.height += a;
            this.resize();
          },
          updatePageHeight: function(a, b, d) {
            if (this.pageExists(a)) {
              var c = this.getPageHeight(a),
                e = this.measurePage(a);
              void 0 === e && (e = c);
              this.pageHeights[a] = e;
              if (c != e) {
                this.updateContentHeight(e - c);
                var k = this.grid.get("autoHeight");
                ("number" == typeof k && k > this.rowCount) || (!0 === k && !b)
                  ? d
                    ? ((b = this.grid.viewsNode.style),
                      (b.height = parseInt(b.height) + e - c + "px"),
                      this.repositionPages(a))
                    : this.grid.sizeChange()
                  : this.repositionPages(a);
              }
              return e;
            }
            return 0;
          },
          rowHeightChanged: function(a, b) {
            this.updatePageHeight(Math.floor(a / this.rowsPerPage), !1, b);
          },
          invalidateNodes: function() {
            for (; this.stack.length; ) this.destroyPage(this.popPage());
          },
          createPageNode: function() {
            var a = document.createElement("div");
            e.attr(a, "role", "presentation");
            a.style.position = "absolute";
            a.style[this.grid.isLeftToRight() ? "left" : "right"] = "0";
            return a;
          },
          getPageHeight: function(a) {
            a = this.pageHeights[a];
            return void 0 !== a ? a : this.defaultPageHeight;
          },
          pushPage: function(a) {
            return this.stack.push(a);
          },
          popPage: function() {
            return this.stack.shift();
          },
          findPage: function(a) {
            for (
              var b = 0, d = 0, c = 0;
              b < this.pageCount && !((c = this.getPageHeight(b)), d + c >= a);
              b++, d += c
            );
            this.page = b;
            this.pageTop = d;
          },
          buildPage: function(a, b, d) {
            this.preparePage(a, b);
            this.positionPage(a, d);
            this.installPage(a);
            this.renderPage(a);
            this.pushPage(a);
          },
          needPage: function(a, b) {
            var d = this.getPageHeight(a);
            this.pageExists(a)
              ? this.positionPage(a, b)
              : (this.buildPage(
                  a,
                  !this.grid._autoHeight &&
                    this.keepPages &&
                    this.stack.length >= this.keepPages,
                  b
                ),
                (d = this.updatePageHeight(a, !0)));
            return d;
          },
          onscroll: function() {
            this.scroll(this.scrollboxNode.scrollTop);
          },
          scroll: function(a) {
            this.grid.scrollTop = a;
            if (this.colCount) {
              this.startPacify();
              this.findPage(a);
              for (
                var b = this.height,
                  d = this.getScrollBottom(a),
                  c = this.page,
                  e = this.pageTop;
                c < this.pageCount && (0 > d || e < d);
                c++
              )
                e += this.needPage(c, e);
              this.firstVisibleRow = this.getFirstVisibleRow(
                this.page,
                this.pageTop,
                a
              );
              this.lastVisibleRow = this.getLastVisibleRow(c - 1, e, d);
              b != this.height && this.repositionPages(c - 1);
              this.endPacify();
            }
          },
          getScrollBottom: function(a) {
            return 0 <= this.windowHeight ? a + this.windowHeight : -1;
          },
          processNodeEvent: function(a, b) {
            for (
              var d = a.target;
              d && d != b && d.parentNode && d.parentNode.parentNode != b;

            )
              d = d.parentNode;
            if (!d || !d.parentNode || d.parentNode.parentNode != b) return !1;
            a.topRowIndex = d.parentNode.pageIndex * this.rowsPerPage;
            b = a.topRowIndex;
            var c;
            a: {
              c = 0;
              for (var e, g = d.parentNode; (e = g.childNodes[c++]); )
                if (e == d) {
                  --c;
                  break a;
                }
              c = -1;
            }
            a.rowIndex = b + c;
            a.rowTarget = d;
            return !0;
          },
          processEvent: function(a) {
            return this.processNodeEvent(a, this.contentNode);
          },
          renderRow: function(a, b) {},
          removeRow: function(a) {},
          getDefaultPageNode: function(a) {
            return this.getDefaultNodes()[a];
          },
          positionPageNode: function(a, b) {},
          getPageNodePosition: function(a) {
            return a.offsetTop;
          },
          invalidatePageNode: function(a, d) {
            var e = d[a];
            e && (delete d[a], this.removePage(a, e), b(e), (e.innerHTML = ""));
            return e;
          },
          getPageRow: function(a) {
            return a * this.rowsPerPage;
          },
          getLastPageRow: function(a) {
            return Math.min(this.rowCount, this.getPageRow(a + 1)) - 1;
          },
          getFirstVisibleRow: function(a, b, e) {
            if (!this.pageExists(a)) return 0;
            var c = this.getPageRow(a),
              g = this.getDefaultNodes();
            a = d(g[a], "div");
            for (var g = 0, k = a.length; g < k && b < e; g++, c++)
              b += a[g].offsetHeight;
            return c ? c - 1 : c;
          },
          getLastVisibleRow: function(a, b, e) {
            if (!this.pageExists(a)) return 0;
            var c = this.getDefaultNodes(),
              g = this.getLastPageRow(a);
            a = d(c[a], "div");
            for (c = a.length - 1; 0 <= c && b > e; c--, g--)
              b -= a[c].offsetHeight;
            return g + 1;
          },
          findTopRow: function(a) {
            for (
              var b = this.getDefaultNodes(),
                b = d(b[this.page], "div"),
                e = 0,
                c = b.length,
                g = this.pageTop,
                l;
              e < c;
              e++
            )
              if (((l = b[e].offsetHeight), (g += l), g >= a))
                return (
                  (this.offset = l - (g - a)), e + this.page * this.rowsPerPage
                );
            return -1;
          },
          findScrollTop: function(a) {
            var b = Math.floor(a / this.rowsPerPage),
              e = 0,
              c;
            for (c = 0; c < b; c++) e += this.getPageHeight(c);
            this.pageTop = e;
            this.page = b;
            this.needPage(b, this.pageTop);
            c = this.getDefaultNodes();
            var g = d(c[b], "div"),
              b = a - this.rowsPerPage * b;
            c = 0;
            for (a = g.length; c < a && c < b; c++) e += g[c].offsetHeight;
            return e;
          },
          dummy: 0
        });
      });
    },
    "dojox/grid/util": function() {
      define([
        "../main",
        "dojo/_base/lang",
        "dojo/dom",
        "dojo/_base/sniff"
      ], function(n, g, h, l) {
        var e = g.getObject("grid.util", !0, n);
        e.na = "...";
        e.rowIndexTag = "gridRowIndex";
        e.gridViewTag = "gridView";
        e.fire = function(b, d, a) {
          function e(a, c) {
            if (null == a) return null;
            var b = c ? "Width" : "Height";
            return a["scroll" + b] > a["client" + b] ? a : e(a.parentNode, c);
          }
          var g, c, h, q;
          if (l("webkit") && "focus" == d) {
            c = b.domNode ? b.domNode : b;
            if ((g = e(c, !1))) h = g.scrollTop;
            if ((c = e(c, !0))) q = c.scrollLeft;
          }
          var n = b && d && b[d];
          b = n && (a ? n.apply(b, a) : b[d]());
          l("webkit") &&
            "focus" == d &&
            (g && (g.scrollTop = h), c && (c.scrollLeft = q));
          return b;
        };
        e.setStyleHeightPx = function(b, d) {
          if (0 <= d) {
            var a = b.style;
            d += "px";
            b && a.height != d && (a.height = d);
          }
        };
        e.mouseEvents = "mouseover mouseout mousedown mouseup click dblclick contextmenu".split(
          " "
        );
        e.keyEvents = ["keyup", "keydown", "keypress"];
        e.funnelEvents = function(b, d, a, g) {
          g = g ? g : e.mouseEvents.concat(e.keyEvents);
          for (var k = 0, c = g.length; k < c; k++)
            d.connect(b, "on" + g[k], a);
        };
        e.removeNode = function(b) {
          (b = h.byId(b)) && b.parentNode && b.parentNode.removeChild(b);
          return b;
        };
        e.arrayCompare = function(b, d) {
          for (var a = 0, e = b.length; a < e; a++) if (b[a] != d[a]) return !1;
          return b.length == d.length;
        };
        e.arrayInsert = function(b, d, a) {
          b.length <= d ? (b[d] = a) : b.splice(d, 0, a);
        };
        e.arrayRemove = function(b, d) {
          b.splice(d, 1);
        };
        e.arraySwap = function(b, d, a) {
          var e = b[d];
          b[d] = b[a];
          b[a] = e;
        };
        return e;
      });
    },
    "dojox/grid/_Layout": function() {
      define("dojo/_base/kernel ../main dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/dom-geometry ./cells ./_RowSelector".split(
        " "
      ), function(n, g, h, l, e, b) {
        return h("dojox.grid._Layout", null, {
          constructor: function(b) {
            this.grid = b;
          },
          cells: [],
          structure: null,
          defaultWidth: "6em",
          moveColumn: function(b, a, e, g, c) {
            var d = this.structure[b].cells[0],
              k = this.structure[a].cells[0],
              h = null,
              f = (h = 0);
            b = 0;
            for (var m; (m = d[b]); b++)
              if (m.index == e) {
                h = b;
                break;
              }
            h = d.splice(h, 1)[0];
            h.view = this.grid.views.views[a];
            b = 0;
            for (m = null; (m = k[b]); b++)
              if (m.index == g) {
                f = b;
                break;
              }
            c || (f += 1);
            k.splice(f, 0, h);
            if ((e = this.grid.getCell(this.grid.getSortIndex())))
              e._currentlySorted = this.grid.getSortAsc();
            this.cells = [];
            for (b = e = 0; (a = this.structure[b]); b++)
              for (g = 0; (c = a.cells[g]); g++)
                for (d = 0; (m = c[d]); d++)
                  (m.index = e),
                    this.cells.push(m),
                    "_currentlySorted" in m &&
                      ((k = e + 1),
                      (k *= m._currentlySorted ? 1 : -1),
                      (this.grid.sortInfo = k),
                      delete m._currentlySorted),
                    e++;
            l.forEach(this.cells, function(a) {
              var b = a.markup[2].split(" ");
              parseInt(b[1].substring(5)) != a.index &&
                ((b[1] = 'idx\x3d"' + a.index + '"'),
                (a.markup[2] = b.join(" ")));
            });
            this.grid.setupHeaderMenu();
          },
          setColumnVisibility: function(d, a) {
            d = this.cells[d];
            if (d.hidden == a) {
              d.hidden = !a;
              a = d.view;
              var e = a.viewWidth;
              e &&
                "auto" != e &&
                (a._togglingColumn = b.getMarginBox(d.getHeaderNode()).w || 0);
              a.update();
              return !0;
            }
            return !1;
          },
          addCellDef: function(b, a, l) {
            var d = this,
              c = function(a) {
                var b = 0;
                1 < a.colSpan
                  ? (b = 0)
                  : ((b =
                      a.width || d._defaultCellProps.width || d.defaultWidth),
                    isNaN(b) || (b += "em"));
                return b;
              };
            b = {
              grid: this.grid,
              subrow: b,
              layoutIndex: a,
              index: this.cells.length
            };
            if (l && l instanceof g.grid.cells._Base)
              return (
                (a = e.clone(l)),
                (b.unitWidth = c(a._props)),
                (a = e.mixin(a, this._defaultCellProps, l._props, b))
              );
            a =
              l.type ||
              l.cellType ||
              this._defaultCellProps.type ||
              this._defaultCellProps.cellType ||
              g.grid.cells.Cell;
            e.isString(a) && (a = e.getObject(a));
            b.unitWidth = c(l);
            return new a(e.mixin({}, this._defaultCellProps, l, b));
          },
          addRowDef: function(b, a) {
            for (var d = [], e = 0, c = 0, g = !0, h = 0, n; (n = a[h]); h++)
              (n = this.addCellDef(b, h, n)),
                d.push(n),
                this.cells.push(n),
                g && n.relWidth
                  ? (e += n.relWidth)
                  : n.width &&
                    ((n = n.width),
                    "string" == typeof n && "%" == n.slice(-1)
                      ? (c += window.parseInt(n, 10))
                      : "auto" == n && (g = !1));
            e &&
              g &&
              l.forEach(d, function(a) {
                a.relWidth &&
                  (a.width = a.unitWidth = (a.relWidth / e) * (100 - c) + "%");
              });
            return d;
          },
          addRowsDef: function(b) {
            var a = [];
            if (e.isArray(b))
              if (e.isArrayLike(b[0]))
                for (var d = 0, g; b && (g = b[d]); d++)
                  a.push(this.addRowDef(d, g));
              else a.push(this.addRowDef(0, b));
            return a;
          },
          addViewDef: function(b) {
            this._defaultCellProps = b.defaultCell || {};
            b.width && "auto" == b.width && delete b.width;
            return e.mixin({}, b, {
              cells: this.addRowsDef(b.rows || b.cells)
            });
          },
          setStructure: function(b) {
            this.fieldIndex = 0;
            this.cells = [];
            var a = (this.structure = []);
            if (this.grid.rowSelector) {
              var d = { type: g._scopeName + ".grid._RowSelector" };
              if (e.isString(this.grid.rowSelector)) {
                var k = this.grid.rowSelector;
                "false" == k ? (d = null) : "true" != k && (d.width = k);
              } else this.grid.rowSelector || (d = null);
              d && a.push(this.addViewDef(d));
            }
            var c = function(a) {
                return "name" in a || "field" in a || "get" in a;
              },
              d = function(a) {
                return e.isArray(a) && (e.isArray(a[0]) || c(a[0])) ? !0 : !1;
              },
              k = function(a) {
                return (
                  null !== a &&
                  e.isObject(a) &&
                  ("cells" in a || "rows" in a || ("type" in a && !c(a)))
                );
              };
            if (e.isArrayLike(b)) {
              for (var l = !1, h = 0, n; (n = b[h]); h++)
                if (k(n)) {
                  l = !0;
                  break;
                }
              if (l)
                for (h = 0; (n = b[h]); h++)
                  d(n)
                    ? a.push(this.addViewDef({ cells: n }))
                    : k(n) && a.push(this.addViewDef(n));
              else a.push(this.addViewDef({ cells: b }));
            } else k(b) && a.push(this.addViewDef(b));
            this.cellCount = this.cells.length;
            this.grid.setupHeaderMenu();
          }
        });
      });
    },
    "dojox/grid/cells": function() {
      define(["../main", "./cells/_base"], function(n) {
        return n.grid.cells;
      });
    },
    "dojox/grid/cells/_base": function() {
      define("dojo/_base/kernel dojo/_base/declare dojo/_base/lang dojo/_base/event dojo/_base/connect dojo/_base/array dojo/_base/sniff dojo/dom dojo/dom-attr dojo/dom-construct dijit/_Widget ../util".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p) {
        var q = g("dojox.grid._DeferredTextWidget", c, {
            deferred: null,
            _destroyOnRemove: !0,
            postCreate: function() {
              this.deferred &&
                this.deferred.addBoth(
                  h.hitch(this, function(a) {
                    this.domNode && (this.domNode.innerHTML = a);
                  })
                );
            }
          }),
          t = function() {
            setTimeout(h.hitch.apply(n, arguments), 0);
          },
          f = g("dojox.grid.cells._Base", null, {
            styles: "",
            classes: "",
            editable: !1,
            alwaysEditing: !1,
            formatter: null,
            defaultValue: "...",
            value: null,
            hidden: !1,
            noresize: !1,
            draggable: !0,
            _valueProp: "value",
            _formatPending: !1,
            constructor: function(a) {
              this._props = a || {};
              h.mixin(this, a);
              void 0 === this.draggable && (this.draggable = !0);
            },
            _defaultFormat: function(a, b) {
              var c = this.grid.formatterScope || this,
                d = this.formatter;
              d && c && "string" == typeof d && (d = this.formatter = c[d]);
              a = a != this.defaultValue && d ? d.apply(c, b) : a;
              if ("undefined" == typeof a) return this.defaultValue;
              a &&
                a.addBoth &&
                (a = new q(
                  { deferred: a },
                  k.create("span", { innerHTML: this.defaultValue })
                ));
              return a && a.declaredClass && a.startup
                ? "\x3cdiv class\x3d'dojoxGridStubNode' linkWidget\x3d'" +
                    a.id +
                    "' cellIdx\x3d'" +
                    this.index +
                    "'\x3e" +
                    this.defaultValue +
                    "\x3c/div\x3e"
                : a;
            },
            format: function(a, b) {
              var c = this.grid.edit.info;
              (b = this.get
                ? this.get(a, b)
                : this.value || this.defaultValue) &&
                b.replace &&
                this.grid.escapeHTMLInData &&
                (b = b
                  .replace(/&(?![a-z0-9]{1,8}\;)/gi, "\x26amp;")
                  .replace(/</g, "\x26lt;"));
              return this.editable &&
                (this.alwaysEditing || (c.rowIndex == a && c.cell == this))
                ? this.formatEditing(c.value ? c.value : b, a)
                : this._defaultFormat(b, [b, a, this]);
            },
            formatEditing: function(a, b) {},
            getNode: function(a) {
              return this.view.getCellNode(a, this.index);
            },
            getHeaderNode: function() {
              return this.view.getHeaderCellNode(this.index);
            },
            getEditNode: function(a) {
              return (this.getNode(a) || 0).firstChild || 0;
            },
            canResize: function() {
              var a = this.unitWidth;
              return a && "auto" !== a;
            },
            isFlex: function() {
              var a = this.unitWidth;
              return a && h.isString(a) && ("auto" == a || "%" == a.slice(-1));
            },
            applyEdit: function(a, b) {
              this.getNode(b) && this.grid.edit.applyCellEdit(a, this, b);
            },
            cancelEdit: function(a) {
              this.grid.doCancelEdit(a);
            },
            _onEditBlur: function(a) {
              this.grid.edit.isEditCell(a, this.index) &&
                this.grid.edit.apply();
            },
            registerOnBlur: function(a, b) {
              this.commitOnBlur &&
                e.connect(a, "onblur", function(a) {
                  setTimeout(h.hitch(this, "_onEditBlur", b), 250);
                });
            },
            needFormatNode: function(a, b) {
              this._formatPending = !0;
              t(this, "_formatNode", a, b);
            },
            cancelFormatNode: function() {
              this._formatPending = !1;
            },
            _formatNode: function(b, c) {
              this._formatPending &&
                ((this._formatPending = !1),
                d("ie") || a.setSelectable(this.grid.domNode, !0),
                this.formatNode(this.getEditNode(c), b, c));
            },
            formatNode: function(a, b, c) {
              d("ie") ? t(this, "focus", c, a) : this.focus(c, a);
            },
            dispatchEvent: function(a, b) {
              if (a in this) return this[a](b);
            },
            getValue: function(a) {
              return this.getEditNode(a)[this._valueProp];
            },
            setValue: function(a, b) {
              (a = this.getEditNode(a)) && (a[this._valueProp] = b);
            },
            focus: function(a, b) {
              a = b || this.getEditNode(a);
              try {
                p.fire(a, "focus"), p.fire(a, "select");
              } catch (x) {}
            },
            save: function(a) {
              this.value = this.value || this.getValue(a);
            },
            restore: function(a) {
              this.setValue(a, this.value);
            },
            _finish: function(b) {
              a.setSelectable(this.grid.domNode, !1);
              this.cancelFormatNode();
            },
            apply: function(a) {
              this.applyEdit(this.getValue(a), a);
              this._finish(a);
            },
            cancel: function(a) {
              this.cancelEdit(a);
              this._finish(a);
            }
          });
        f.markupFactory = function(a, b) {
          var c = h.trim(m.get(a, "formatter") || "");
          c && (b.formatter = h.getObject(c) || c);
          if ((c = h.trim(m.get(a, "get") || ""))) b.get = h.getObject(c);
          c = function(b, c, d) {
            var e = h.trim(m.get(a, b) || "");
            e && (c[d || b] = "false" != e.toLowerCase());
          };
          c("sortDesc", b);
          c("editable", b);
          c("alwaysEditing", b);
          c("noresize", b);
          c("draggable", b);
          if (
            (c = h.trim(
              m.get(a, "loadingText") || m.get(a, "defaultValue") || ""
            ))
          )
            b.defaultValue = c;
          c = function(b, c, d) {
            var e = h.trim(m.get(a, b) || "") || void 0;
            e && (c[d || b] = e);
          };
          c("styles", b);
          c("headerStyles", b);
          c("cellStyles", b);
          c("classes", b);
          c("headerClasses", b);
          c("cellClasses", b);
        };
        var y = (f.Cell = g("dojox.grid.cells.Cell", f, {
          constructor: function() {
            this.keyFilter = this.keyFilter;
          },
          keyFilter: null,
          formatEditing: function(a, b) {
            this.needFormatNode(a, b);
            a && a.replace && (a = a.replace(/"/g, "\x26quot;"));
            return (
              '\x3cinput class\x3d"dojoxGridInput" type\x3d"text" value\x3d"' +
              a +
              '"\x3e'
            );
          },
          formatNode: function(a, b, c) {
            this.inherited(arguments);
            this.registerOnBlur(a, c);
          },
          doKey: function(a) {
            this.keyFilter &&
              -1 == String.fromCharCode(a.charCode).search(this.keyFilter) &&
              l.stop(a);
          },
          _finish: function(a) {
            this.inherited(arguments);
            var b = this.getEditNode(a);
            try {
              p.fire(b, "blur");
            } catch (x) {}
          }
        }));
        y.markupFactory = function(a, b) {
          f.markupFactory(a, b);
          if ((a = h.trim(m.get(a, "keyFilter") || "")))
            b.keyFilter = new RegExp(a);
        };
        (f.RowIndex = g("dojox.grid.cells.RowIndex", y, {
          name: "Row",
          postscript: function() {
            this.editable = !1;
          },
          get: function(a) {
            return a + 1;
          }
        })).markupFactory = function(a, b) {
          y.markupFactory(a, b);
        };
        (f.Select = g("dojox.grid.cells.Select", y, {
          options: null,
          values: null,
          returnIndex: -1,
          constructor: function(a) {
            this.values = this.values || this.options;
          },
          formatEditing: function(a, b) {
            this.needFormatNode(a, b);
            b = ['\x3cselect class\x3d"dojoxGridSelect"\x3e'];
            for (
              var c = 0, d, e;
              void 0 !== (d = this.options[c]) &&
              void 0 !== (e = this.values[c]);
              c++
            )
              (e = e.replace
                ? e.replace(/&/g, "\x26amp;").replace(/</g, "\x26lt;")
                : e),
                (d = d.replace
                  ? d.replace(/&/g, "\x26amp;").replace(/</g, "\x26lt;")
                  : d),
                b.push(
                  "\x3coption",
                  a == e ? " selected" : "",
                  ' value\x3d"' + e + '"',
                  "\x3e",
                  d,
                  "\x3c/option\x3e"
                );
            b.push("\x3c/select\x3e");
            return b.join("");
          },
          _defaultFormat: function(a, c) {
            var d = this.inherited(arguments);
            if (!this.formatter && this.values && this.options) {
              var e = b.indexOf(this.values, d);
              0 <= e && (d = this.options[e]);
            }
            return d;
          },
          getValue: function(a) {
            var b = this.getEditNode(a);
            if (b)
              return (
                (a = b.selectedIndex),
                (b = b.options[a]),
                -1 < this.returnIndex ? a : b.value || b.innerHTML
              );
          }
        })).markupFactory = function(a, b) {
          y.markupFactory(a, b);
          var c = h.trim(m.get(a, "options") || "");
          if (c) {
            var d = c.split(",");
            d[0] != c && (b.options = d);
          }
          if ((a = h.trim(m.get(a, "values") || "")))
            (c = a.split(",")), c[0] != a && (b.values = c);
        };
        var u = (f.AlwaysEdit = g("dojox.grid.cells.AlwaysEdit", y, {
          alwaysEditing: !0,
          _formatNode: function(a, b) {
            this.formatNode(this.getEditNode(b), a, b);
          },
          applyStaticValue: function(a) {
            var b = this.grid.edit;
            b.applyCellEdit(this.getValue(a), this, a);
            b.start(this, a, !0);
          }
        }));
        u.markupFactory = function(a, b) {
          y.markupFactory(a, b);
        };
        (f.Bool = g("dojox.grid.cells.Bool", u, {
          _valueProp: "checked",
          formatEditing: function(a, b) {
            return (
              '\x3cinput class\x3d"dojoxGridInput" type\x3d"checkbox"' +
              (a ? ' checked\x3d"checked"' : "") +
              ' style\x3d"width: auto" /\x3e'
            );
          },
          doclick: function(a) {
            "INPUT" == a.target.tagName && this.applyStaticValue(a.rowIndex);
          }
        })).markupFactory = function(a, b) {
          u.markupFactory(a, b);
        };
        return f;
      });
    },
    "dojox/grid/_RowSelector": function() {
      define(["dojo/_base/declare", "./_View"], function(n, g) {
        return n("dojox.grid._RowSelector", g, {
          defaultWidth: "2em",
          noscroll: !0,
          padBorderWidth: 2,
          buildRendering: function() {
            this.inherited("buildRendering", arguments);
            this.scrollboxNode.style.overflow = "hidden";
            this.headerNode.style.visibility = "hidden";
          },
          getWidth: function() {
            return this.viewWidth || this.defaultWidth;
          },
          buildRowContent: function(g, l) {
            l.innerHTML =
              '\x3ctable class\x3d"dojoxGridRowbarTable" style\x3d"width:' +
              (this.contentWidth || 0) +
              'px;height:1px;" border\x3d"0" cellspacing\x3d"0" cellpadding\x3d"0" role\x3d"presentation"\x3e\x3ctr\x3e\x3ctd class\x3d"dojoxGridRowbarInner"\x3e\x26nbsp;\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e';
          },
          renderHeader: function() {},
          updateRow: function() {},
          resize: function() {
            this.adaptHeight();
          },
          adaptWidth: function() {
            !("contentWidth" in this) &&
              this.contentNode &&
              0 < this.contentNode.offsetWidth &&
              (this.contentWidth =
                this.contentNode.offsetWidth - this.padBorderWidth);
          },
          doStyleRowNode: function(g, l) {
            var e = ["dojoxGridRowbar dojoxGridNonNormalizedCell"];
            this.grid.rows.isOver(g) && e.push("dojoxGridRowbarOver");
            this.grid.selection.isSelected(g) &&
              e.push("dojoxGridRowbarSelected");
            l.className = e.join(" ");
          },
          domouseover: function(g) {
            this.grid.onMouseOverRow(g);
          },
          domouseout: function(g) {
            if (!this.isIntraRowEvent(g)) this.grid.onMouseOutRow(g);
          }
        });
      });
    },
    "dojox/grid/_View": function() {
      define("dojo dijit/registry ../main dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/_base/connect dojo/_base/sniff dojo/query dojo/_base/window dojo/text!./resources/View.html dojo/dnd/Source dijit/_Widget dijit/_TemplatedMixin dojox/html/metrics ./util dojo/_base/html ./_Builder dojo/dnd/Avatar dojo/dnd/Manager".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p, q, t, f, y, u, r, C, x) {
        c = l("dojox.grid._View", [q, t], {
          defaultWidth: "18em",
          viewWidth: "",
          templateString: c,
          classTag: "dojoxGrid",
          marginBottom: 0,
          rowPad: 2,
          _togglingColumn: -1,
          _headerBuilderClass: r._HeaderBuilder,
          _contentBuilderClass: r._ContentBuilder,
          postMixInProperties: function() {
            this.rowNodes = {};
          },
          postCreate: function() {
            this.connect(this.scrollboxNode, "onscroll", "doscroll");
            y.funnelEvents(
              this.contentNode,
              this,
              "doContentEvent",
              "mouseover mouseout click dblclick contextmenu mousedown".split(
                " "
              )
            );
            y.funnelEvents(
              this.headerNode,
              this,
              "doHeaderEvent",
              "dblclick mouseover mouseout mousemove mousedown click contextmenu".split(
                " "
              )
            );
            this.content = new this._contentBuilderClass(this);
            this.header = new this._headerBuilderClass(this);
            this.grid.isLeftToRight() ||
              (this.headerNodeContainer.style.width = "");
          },
          destroy: function() {
            u.destroy(this.headerNode);
            delete this.headerNode;
            for (var a in this.rowNodes)
              this._cleanupRowWidgets(this.rowNodes[a]),
                u.destroy(this.rowNodes[a]);
            this.rowNodes = {};
            this.source && this.source.destroy();
            this.inherited(arguments);
          },
          focus: function() {
            a("ie") || a("webkit") || a("opera")
              ? this.hiddenFocusNode.focus()
              : this.scrollboxNode.focus();
          },
          setStructure: function(a) {
            a = this.structure = a;
            a.width && !isNaN(a.width)
              ? (this.viewWidth = a.width + "em")
              : (this.viewWidth =
                  a.width || (a.noscroll ? "auto" : this.viewWidth));
            this._onBeforeRow = a.onBeforeRow || function() {};
            this._onAfterRow = a.onAfterRow || function() {};
            if ((this.noscroll = a.noscroll))
              this.scrollboxNode.style.overflow = "hidden";
            this.simpleStructure = 1 == a.cells.length;
            this.testFlexCells();
            this.updateStructure();
          },
          _cleanupRowWidgets: function(a) {
            a &&
              e.forEach(m("[widgetId]", a).map(g.byNode), function(a) {
                a._destroyOnRemove
                  ? (a.destroy(), delete a)
                  : a.domNode &&
                    a.domNode.parentNode &&
                    a.domNode.parentNode.removeChild(a.domNode);
              });
          },
          onBeforeRow: function(a, b) {
            this._onBeforeRow(a, b);
            0 <= a && this._cleanupRowWidgets(this.getRowNode(a));
          },
          onAfterRow: function(a, b, c) {
            this._onAfterRow(a, b, c);
            var d = this.grid;
            e.forEach(
              m(".dojoxGridStubNode", c),
              function(a) {
                if (a && a.parentNode) {
                  var b = a.getAttribute("linkWidget"),
                    c = window.parseInt(u.attr(a, "cellIdx"), 10);
                  d.getCell(c);
                  (b = g.byId(b))
                    ? (a.parentNode.replaceChild(b.domNode, a),
                      b._started || b.startup(),
                      n.destroy(a))
                    : (a.innerHTML = "");
                }
              },
              this
            );
          },
          testFlexCells: function() {
            this.flexCells = !1;
            for (var a = 0, b; (b = this.structure.cells[a]); a++)
              for (var c = 0, d; (d = b[c]); c++)
                (d.view = this),
                  (this.flexCells = this.flexCells || d.isFlex());
            return this.flexCells;
          },
          updateStructure: function() {
            this.header.update();
            this.content.update();
          },
          getScrollbarWidth: function() {
            var a = this.hasVScrollbar(),
              b = u.style(this.scrollboxNode, "overflow");
            this.noscroll || !b || "hidden" == b
              ? (a = !1)
              : "scroll" == b && (a = !0);
            return a ? f.getScrollbar().w : 0;
          },
          getColumnsWidth: function() {
            var a = this.headerContentNode;
            return a && a.firstChild
              ? a.firstChild.offsetWidth || u.style(a.firstChild, "width")
              : 0;
          },
          setColumnsWidth: function(a) {
            this.headerContentNode.firstChild.style.width = a + "px";
            this.viewWidth && (this.viewWidth = a + "px");
          },
          getWidth: function() {
            return (
              this.viewWidth ||
              this.getColumnsWidth() + this.getScrollbarWidth() + "px"
            );
          },
          getContentWidth: function() {
            return (
              Math.max(
                0,
                u._getContentBox(this.domNode).w - this.getScrollbarWidth()
              ) + "px"
            );
          },
          render: function() {
            this.scrollboxNode.style.height = "";
            this.renderHeader();
            0 <= this._togglingColumn &&
              (this.setColumnsWidth(
                this.getColumnsWidth() - this._togglingColumn
              ),
              (this._togglingColumn = -1));
            var c = this.grid.layout.cells,
              e = b.hitch(this, function(a, b) {
                !this.grid.isLeftToRight() && (b = !b);
                b = b ? -1 : 1;
                a = this.header.getCellNodeIndex(a) + b;
                for (
                  var d = c[a];
                  d &&
                  d.getHeaderNode() &&
                  "none" == d.getHeaderNode().style.display;

                )
                  (a += b), (d = c[a]);
                return d ? d.getHeaderNode() : null;
              });
            if (this.grid.columnReordering && this.simpleStructure) {
              this.source && this.source.destroy();
              this.bottomMarker && u.destroy(this.bottomMarker);
              this.bottomMarker = u.byId("dojoxGrid_bottomMarker");
              this.topMarker && u.destroy(this.topMarker);
              this.topMarker = u.byId("dojoxGrid_topMarker");
              this.bottomMarker ||
                ((this.bottomMarker = u.create(
                  "div",
                  {
                    id: "dojoxGrid_bottomMarker",
                    class: "dojoxGridColPlaceBottom"
                  },
                  k.body()
                )),
                this._hide(this.bottomMarker),
                (this.topMarker = u.create(
                  "div",
                  { id: "dojoxGrid_topMarker", class: "dojoxGridColPlaceTop" },
                  k.body()
                )),
                this._hide(this.topMarker));
              this.arrowDim = u.contentBox(this.bottomMarker);
              var f = u.contentBox(this.headerContentNode.firstChild.rows[0]).h;
              this.source = new p(this.headerContentNode.firstChild.rows[0], {
                horizontal: !0,
                accept: ["gridColumn_" + this.grid.id],
                viewIndex: this.index,
                generateText: !1,
                onMouseDown: b.hitch(this, function(b) {
                  this.header.decorateEvent(b);
                  if (
                    (this.header.overRightResizeArea(b) ||
                      this.header.overLeftResizeArea(b)) &&
                    this.header.canResize(b) &&
                    !this.header.moveable
                  )
                    this.header.beginColumnResize(b);
                  else {
                    if (this.grid.headerMenu) this.grid.headerMenu.onCancel(!0);
                    b.button === (9 > a("ie") ? 1 : 0) &&
                      p.prototype.onMouseDown.call(this.source, b);
                  }
                }),
                onMouseOver: b.hitch(this, function(a) {
                  var b = this.source;
                  b._getChildByEvent(a) &&
                    p.prototype.onMouseOver.apply(b, arguments);
                }),
                _markTargetAnchor: b.hitch(this, function(a) {
                  var b = this.source;
                  if (b.current != b.targetAnchor || b.before != a) {
                    b.targetAnchor &&
                      e(b.targetAnchor, b.before) &&
                      b._removeItemClass(
                        e(b.targetAnchor, b.before),
                        b.before ? "After" : "Before"
                      );
                    p.prototype._markTargetAnchor.call(b, a);
                    var c = a ? b.targetAnchor : e(b.targetAnchor, b.before);
                    a = 0;
                    c ||
                      ((c = b.targetAnchor),
                      (a = u.contentBox(c).w + this.arrowDim.w / 2 + 2));
                    c = u.position(c, !0);
                    a = Math.floor(c.x - this.arrowDim.w / 2 + a);
                    u.style(this.bottomMarker, "visibility", "visible");
                    u.style(this.topMarker, "visibility", "visible");
                    u.style(this.bottomMarker, {
                      left: a + "px",
                      top: f + c.y + "px"
                    });
                    u.style(this.topMarker, {
                      left: a + "px",
                      top: c.y - this.arrowDim.h + "px"
                    });
                    b.targetAnchor &&
                      e(b.targetAnchor, b.before) &&
                      b._addItemClass(
                        e(b.targetAnchor, b.before),
                        b.before ? "After" : "Before"
                      );
                  }
                }),
                _unmarkTargetAnchor: b.hitch(this, function() {
                  var a = this.source;
                  a.targetAnchor &&
                    (a.targetAnchor &&
                      e(a.targetAnchor, a.before) &&
                      a._removeItemClass(
                        e(a.targetAnchor, a.before),
                        a.before ? "After" : "Before"
                      ),
                    this._hide(this.bottomMarker),
                    this._hide(this.topMarker),
                    p.prototype._unmarkTargetAnchor.call(a));
                }),
                destroy: b.hitch(this, function() {
                  d.disconnect(this._source_conn);
                  d.unsubscribe(this._source_sub);
                  p.prototype.destroy.call(this.source);
                  this.bottomMarker &&
                    (u.destroy(this.bottomMarker), delete this.bottomMarker);
                  this.topMarker &&
                    (u.destroy(this.topMarker), delete this.topMarker);
                }),
                onDndCancel: b.hitch(this, function() {
                  p.prototype.onDndCancel.call(this.source);
                  this._hide(this.bottomMarker);
                  this._hide(this.topMarker);
                })
              });
              this._source_conn = d.connect(
                this.source,
                "onDndDrop",
                this,
                "_onDndDrop"
              );
              this._source_sub = d.subscribe(
                "/dnd/drop/before",
                this,
                "_onDndDropBefore"
              );
              this.source.startup();
            }
          },
          _hide: function(a) {
            u.style(a, { top: "-10000px", visibility: "hidden" });
          },
          _onDndDropBefore: function(a, b, c) {
            x.manager().target === this.source &&
              ((this.source._targetNode = this.source.targetAnchor),
              (this.source._beforeTarget = this.source.before),
              (b = this.grid.views.views),
              (a = b[a.viewIndex]),
              (b = b[this.index]),
              b != a && (a.convertColPctToFixed(), b.convertColPctToFixed()));
          },
          _onDndDrop: function(a, b, c) {
            if (x.manager().target !== this.source)
              x.manager().source === this.source && (this._removingColumn = !0);
            else {
              this._hide(this.bottomMarker);
              this._hide(this.topMarker);
              c = function(a) {
                return a ? u.attr(a, "idx") : null;
              };
              var d = u.marginBox(b[0]).w;
              if (a.viewIndex !== this.index) {
                var e = this.grid.views.views,
                  f = e[a.viewIndex],
                  e = e[this.index];
                f.viewWidth &&
                  "auto" != f.viewWidth &&
                  f.setColumnsWidth(f.getColumnsWidth() - d);
                e.viewWidth &&
                  "auto" != e.viewWidth &&
                  e.setColumnsWidth(e.getColumnsWidth());
              }
              d = this.source._targetNode;
              f = this.source._beforeTarget;
              !this.grid.isLeftToRight() && (f = !f);
              var e = this.grid.layout,
                g = this.index;
              delete this.source._targetNode;
              delete this.source._beforeTarget;
              e.moveColumn(a.viewIndex, g, c(b[0]), c(d), f);
            }
          },
          renderHeader: function() {
            this.headerContentNode.innerHTML = this.header.generateHtml(
              this._getHeaderContent
            );
            this.flexCells &&
              ((this.contentWidth = this.getContentWidth()),
              (this.headerContentNode.firstChild.style.width = this.contentWidth));
            y.fire(this, "onAfterRow", [
              -1,
              this.structure.cells,
              this.headerContentNode
            ]);
          },
          _getHeaderContent: function(a) {
            var b = a.name || a.grid.getCellName(a);
            /^\s+$/.test(b) && (b = "\x26nbsp;");
            var c = ['\x3cdiv class\x3d"dojoxGridSortNode'];
            a.index != a.grid.getSortIndex()
              ? c.push('"\x3e')
              : (c = c.concat([
                  " ",
                  0 < a.grid.sortInfo ? "dojoxGridSortUp" : "dojoxGridSortDown",
                  '"\x3e\x3cdiv class\x3d"dojoxGridArrowButtonChar"\x3e',
                  0 < a.grid.sortInfo ? "\x26#9650;" : "\x26#9660;",
                  '\x3c/div\x3e\x3cdiv class\x3d"dojoxGridArrowButtonNode" role\x3d"presentation"\x3e\x3c/div\x3e',
                  '\x3cdiv class\x3d"dojoxGridColCaption"\x3e'
                ]));
            c = c.concat([b, "\x3c/div\x3e\x3c/div\x3e"]);
            return c.join("");
          },
          resize: function() {
            this.adaptHeight();
            this.adaptWidth();
          },
          hasHScrollbar: function(a) {
            var b = this._hasHScroll || !1;
            if (void 0 == this._hasHScroll || a)
              this.noscroll
                ? (this._hasHScroll = !1)
                : ((a = u.style(this.scrollboxNode, "overflow")),
                  (this._hasHScroll =
                    "hidden" == a
                      ? !1
                      : "scroll" == a
                      ? !0
                      : this.scrollboxNode.offsetWidth -
                          this.getScrollbarWidth() <
                        this.contentNode.offsetWidth));
            b !== this._hasHScroll && this.grid.update();
            return this._hasHScroll;
          },
          hasVScrollbar: function(a) {
            var b = this._hasVScroll || !1;
            if (void 0 == this._hasVScroll || a)
              this.noscroll
                ? (this._hasVScroll = !1)
                : ((a = u.style(this.scrollboxNode, "overflow")),
                  (this._hasVScroll =
                    "hidden" == a
                      ? !1
                      : "scroll" == a
                      ? !0
                      : this.scrollboxNode.scrollHeight >
                        this.scrollboxNode.clientHeight));
            b !== this._hasVScroll && this.grid.update();
            return this._hasVScroll;
          },
          convertColPctToFixed: function() {
            var a = !1;
            this.grid.initialWidth = "";
            var b = m("th", this.headerContentNode),
              c = e.map(b, function(b, c) {
                var d = b.style.width;
                u.attr(b, "vIdx", c);
                if (d && "%" == d.slice(-1)) a = !0;
                else if (d && "px" == d.slice(-2))
                  return window.parseInt(d, 10);
                return u.contentBox(b).w;
              });
            return a
              ? (e.forEach(
                  this.grid.layout.cells,
                  function(a, b) {
                    if (
                      a.view == this &&
                      (a = a.view.getHeaderCellNode(a.index)) &&
                      u.hasAttr(a, "vIdx")
                    ) {
                      var d = window.parseInt(u.attr(a, "vIdx"));
                      this.setColWidth(b, c[d]);
                      u.removeAttr(a, "vIdx");
                    }
                  },
                  this
                ),
                !0)
              : !1;
          },
          adaptHeight: function(a) {
            if (!this.grid._autoHeight) {
              var b =
                (this.domNode.style.height &&
                  parseInt(this.domNode.style.height.replace(/px/, ""), 10)) ||
                this.domNode.clientHeight;
              if (!a && (a = this.noscroll))
                a: {
                  for (var c = 0; c < this.grid.views.views.length; ++c)
                    if (
                      ((a = this.grid.views.views[c]),
                      a !== this && a.hasHScrollbar())
                    ) {
                      a = !0;
                      break a;
                    }
                  a = !1;
                }
              a && (b -= f.getScrollbar().h);
              y.setStyleHeightPx(this.scrollboxNode, b);
            }
            this.hasVScrollbar(!0);
          },
          adaptWidth: function() {
            this.flexCells &&
              ((this.contentWidth = this.getContentWidth()),
              (this.headerContentNode.firstChild.style.width = this.contentWidth));
            var a = this.scrollboxNode.offsetWidth - this.getScrollbarWidth();
            this._removingColumn
              ? ((a = Math.min(a, this.getColumnsWidth()) + "px"),
                (this._removingColumn = !1))
              : (a = Math.max(a, this.getColumnsWidth()) + "px");
            this.contentNode.style.width = a;
            this.hasHScrollbar(!0);
          },
          setSize: function(a, b) {
            var c = this.domNode.style,
              d = this.headerNode.style;
            a && ((c.width = a), (d.width = a));
            c.height = 0 <= b ? b + "px" : "";
          },
          renderRow: function(a) {
            var b = this.createRowNode(a);
            this.buildRow(a, b);
            return b;
          },
          createRowNode: function(a) {
            var b = document.createElement("div");
            b.className = this.classTag + "Row";
            this instanceof h.grid._RowSelector
              ? u.attr(b, "role", "presentation")
              : (u.attr(b, "role", "row"),
                "none" != this.grid.selectionMode &&
                  b.setAttribute("aria-selected", "false"));
            b[y.gridViewTag] = this.id;
            b[y.rowIndexTag] = a;
            return (this.rowNodes[a] = b);
          },
          buildRow: function(a, b) {
            this.buildRowContent(a, b);
            this.styleRow(a, b);
          },
          buildRowContent: function(a, b) {
            b.innerHTML = this.content.generateHtml(a, a);
            this.flexCells &&
              this.contentWidth &&
              (b.firstChild.style.width = this.contentWidth);
            y.fire(this, "onAfterRow", [a, this.structure.cells, b]);
          },
          rowRemoved: function(a) {
            0 <= a && this._cleanupRowWidgets(this.getRowNode(a));
            this.grid.edit.save(this, a);
            delete this.rowNodes[a];
          },
          getRowNode: function(a) {
            return this.rowNodes[a];
          },
          getCellNode: function(a, b) {
            if ((a = this.getRowNode(a))) return this.content.getCellNode(a, b);
          },
          getHeaderCellNode: function(a) {
            if (this.headerContentNode)
              return this.header.getCellNode(this.headerContentNode, a);
          },
          styleRow: function(a, b) {
            var c;
            c =
              void 0 == b.style.cssText
                ? b.getAttribute("style")
                : b.style.cssText;
            b._style = c;
            this.styleRowNode(a, b);
          },
          styleRowNode: function(a, b) {
            b && this.doStyleRowNode(a, b);
          },
          doStyleRowNode: function(a, b) {
            this.grid.styleRowNode(a, b);
          },
          updateRow: function(a) {
            var b = this.getRowNode(a);
            b && ((b.style.height = ""), this.buildRow(a, b));
            return b;
          },
          updateRowStyles: function(a) {
            this.styleRowNode(a, this.getRowNode(a));
          },
          lastTop: 0,
          firstScroll: 0,
          _nativeScroll: !1,
          doscroll: function(b) {
            if (13 <= a("ff") || a("chrome")) this._nativeScroll = !0;
            b = this.grid.isLeftToRight();
            if (2 > this.firstScroll) {
              if (
                (!b && 1 == this.firstScroll) ||
                (b && 0 === this.firstScroll)
              ) {
                var c = u.marginBox(this.headerNodeContainer);
                a("ie")
                  ? (this.headerNodeContainer.style.width =
                      c.w + this.getScrollbarWidth() + "px")
                  : a("mozilla") &&
                    ((this.headerNodeContainer.style.width =
                      c.w - this.getScrollbarWidth() + "px"),
                    (this.scrollboxNode.scrollLeft = b
                      ? this.scrollboxNode.clientWidth -
                        this.scrollboxNode.scrollWidth
                      : this.scrollboxNode.scrollWidth -
                        this.scrollboxNode.clientWidth));
              }
              this.firstScroll++;
            }
            this.headerNode.scrollLeft = this.scrollboxNode.scrollLeft;
            b = this.scrollboxNode.scrollTop;
            b !== this.lastTop && this.grid.scrollTo(b);
            this._nativeScroll = !1;
          },
          setScrollTop: function(a) {
            this.lastTop = a;
            this._nativeScroll || (this.scrollboxNode.scrollTop = a);
            return this.scrollboxNode.scrollTop;
          },
          doContentEvent: function(a) {
            if (this.content.decorateEvent(a)) this.grid.onContentEvent(a);
          },
          doHeaderEvent: function(a) {
            if (this.header.decorateEvent(a)) this.grid.onHeaderEvent(a);
          },
          dispatchContentEvent: function(a) {
            return this.content.dispatchEvent(a);
          },
          dispatchHeaderEvent: function(a) {
            return this.header.dispatchEvent(a);
          },
          setColWidth: function(a, b) {
            this.grid.setCellWidth(a, b + "px");
          },
          update: function() {
            if (this.domNode) {
              this.content.update();
              this.grid.update();
              var a = this.scrollboxNode.scrollLeft;
              this.scrollboxNode.scrollLeft = a;
              this.headerNode.scrollLeft = a;
            }
          }
        });
        var B = l("dojox.grid._GridAvatar", C, {
            construct: function() {
              var a = k.doc,
                b = a.createElement("table");
              b.cellPadding = b.cellSpacing = "0";
              b.className = "dojoxGridDndAvatar";
              b.style.position = "absolute";
              b.style.zIndex = 1999;
              b.style.margin = "0px";
              var c = a.createElement("tbody"),
                d = a.createElement("tr"),
                e = a.createElement("td"),
                f = a.createElement("td");
              d.className = "dojoxGridDndAvatarItem";
              f.className = "dojoxGridDndAvatarItemImage";
              f.style.width = "16px";
              var g = this.manager.source;
              if (g.creator)
                g = g._normalizedCreator(
                  g.getItem(this.manager.nodes[0].id).data,
                  "avatar"
                ).node;
              else {
                var g = this.manager.nodes[0].cloneNode(!0),
                  l,
                  h;
                "tr" == g.tagName.toLowerCase()
                  ? ((l = a.createElement("table")),
                    (h = a.createElement("tbody")),
                    h.appendChild(g),
                    l.appendChild(h),
                    (g = l))
                  : "th" == g.tagName.toLowerCase() &&
                    ((l = a.createElement("table")),
                    (h = a.createElement("tbody")),
                    (a = a.createElement("tr")),
                    (l.cellPadding = l.cellSpacing = "0"),
                    a.appendChild(g),
                    h.appendChild(a),
                    l.appendChild(h),
                    (g = l));
              }
              g.id = "";
              e.appendChild(g);
              d.appendChild(f);
              d.appendChild(e);
              u.style(d, "opacity", 0.9);
              c.appendChild(d);
              b.appendChild(c);
              this.node = b;
              b = x.manager();
              this.oldOffsetY = b.OFFSET_Y;
              b.OFFSET_Y = 1;
            },
            destroy: function() {
              x.manager().OFFSET_Y = this.oldOffsetY;
              this.inherited(arguments);
            }
          }),
          v = x.manager().makeAvatar;
        x.manager().makeAvatar = function() {
          return void 0 === this.source.viewIndex ||
            u.hasClass(k.body(), "dijit_a11y")
            ? v.call(x.manager())
            : new B(this);
        };
        return c;
      });
    },
    "dojox/html/metrics": function() {
      define("dojo/_base/kernel dojo/_base/lang dojo/_base/sniff dojo/ready dojo/_base/unload dojo/_base/window dojo/dom-geometry".split(
        " "
      ), function(n, g, h, l, e, b, d) {
        var a = g.getObject("dojox.html.metrics", !0),
          m = g.getObject("dojox");
        a.getFontMeasurements = function() {
          var a = {
              "1em": 0,
              "1ex": 0,
              "100%": 0,
              "12pt": 0,
              "16px": 0,
              "xx-small": 0,
              "x-small": 0,
              small: 0,
              medium: 0,
              large: 0,
              "x-large": 0,
              "xx-large": 0
            },
            c;
          h("ie") &&
            ((c = b.doc.documentElement.style.fontSize || ""),
            c || (b.doc.documentElement.style.fontSize = "100%"));
          var d = b.doc.createElement("div"),
            e = d.style;
          e.position = "absolute";
          e.left = "-100px";
          e.top = "0";
          e.width = "30px";
          e.height = "1000em";
          e.borderWidth = "0";
          e.margin = "0";
          e.padding = "0";
          e.outline = "0";
          e.lineHeight = "1";
          e.overflow = "hidden";
          b.body().appendChild(d);
          for (var g in a)
            (e.fontSize = g),
              (a[g] = (16 * Math.round((12 * d.offsetHeight) / 16)) / 12 / 1e3);
          h("ie") && (b.doc.documentElement.style.fontSize = c);
          b.body().removeChild(d);
          d = null;
          return a;
        };
        var k = null;
        a.getCachedFontMeasurements = function(b) {
          if (b || !k) k = a.getFontMeasurements();
          return k;
        };
        var c = null,
          p = {};
        a.getTextBox = function(a, e, g) {
          var f, k;
          if (c) f = c;
          else {
            f = c = b.doc.createElement("div");
            f.style.whiteSpace = "nowrap";
            var l = b.doc.createElement("div");
            l.appendChild(f);
            k = l.style;
            k.overflow = "scroll";
            k.position = "absolute";
            k.left = "0px";
            k.top = "-10000px";
            k.width = "1px";
            k.height = "1px";
            k.visibility = "hidden";
            k.borderWidth = "0";
            k.margin = "0";
            k.padding = "0";
            k.outline = "0";
            b.body().appendChild(l);
          }
          f.className = "";
          k = f.style;
          k.borderWidth = "0";
          k.margin = "0";
          k.padding = "0";
          k.outline = "0";
          if (1 < arguments.length && e)
            for (var h in e) h in p || (k[h] = e[h]);
          2 < arguments.length && g && (f.className = g);
          f.innerHTML = a;
          k = d.position(f);
          k.w = f.parentNode.scrollWidth;
          return k;
        };
        var q = 16,
          t = 16;
        a.getScrollbar = function() {
          return { w: q, h: t };
        };
        a._fontResizeNode = null;
        a.initOnFontResize = function(c) {
          var d = (a._fontResizeNode = b.doc.createElement("iframe"));
          c = d.style;
          c.position = "absolute";
          c.width = "5em";
          c.height = "10em";
          c.top = "-10000px";
          c.display = "none";
          h("ie")
            ? (d.onreadystatechange = function() {
                "complete" == d.contentWindow.document.readyState &&
                  (d.onresize =
                    d.contentWindow.parent[
                      m._scopeName
                    ].html.metrics._fontresize);
              })
            : (d.onload = function() {
                d.contentWindow.onresize =
                  d.contentWindow.parent[m._scopeName].html.metrics._fontresize;
              });
          d.setAttribute(
            "src",
            "javascript:'\x3chtml\x3e\x3chead\x3e\x3cscript\x3eif(\"loadFirebugConsole\" in window){window.loadFirebugConsole();}\x3c/script\x3e\x3c/head\x3e\x3cbody\x3e\x3c/body\x3e\x3c/html\x3e'"
          );
          b.body().appendChild(d);
          a.initOnFontResize = function() {};
        };
        a.onFontResize = function() {};
        a._fontresize = function() {
          a.onFontResize();
        };
        e.addOnUnload(function() {
          var b = a._fontResizeNode;
          b &&
            (h("ie") && b.onresize
              ? (b.onresize = null)
              : b.contentWindow &&
                b.contentWindow.onresize &&
                (b.contentWindow.onresize = null),
            (a._fontResizeNode = null));
        });
        l(function() {
          try {
            var c = b.doc.createElement("div");
            c.style.cssText =
              "top:0;left:0;width:100px;height:100px;overflow:scroll;position:absolute;visibility:hidden;";
            b.body().appendChild(c);
            q = c.offsetWidth - c.clientWidth;
            t = c.offsetHeight - c.clientHeight;
            b.body().removeChild(c);
            delete c;
          } catch (y) {}
          "fontSizeWatch" in n.config &&
            n.config.fontSizeWatch &&
            a.initOnFontResize();
        });
        return a;
      });
    },
    "dojox/grid/_Builder": function() {
      define("../main dojo/_base/array dojo/_base/lang dojo/_base/window dojo/_base/event dojo/_base/sniff dojo/_base/connect dojo/dnd/Moveable dojox/html/metrics ./util dojo/_base/html dojo/dom-geometry".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c, p) {
        var q = n.grid,
          t = function(a) {
            return 0 <= a.rowIndex
              ? a.rowIndex
              : g.indexOf(a.parentNode.childNodes, a);
          },
          f = function(a, b) {
            return a && ((a.rows || 0)[b] || a.childNodes[b]);
          },
          y = function(a) {
            for (; a && "TABLE" != a.tagName; a = a.parentNode);
            return a;
          },
          u = function(a) {
            var b = a.toUpperCase();
            return function(a) {
              return a.tagName != b;
            };
          },
          r = k.rowIndexTag,
          C = k.gridViewTag,
          x = (q._Builder = h.extend(
            function(a) {
              a && ((this.view = a), (this.grid = a.grid));
            },
            {
              view: null,
              _table:
                '\x3ctable class\x3d"dojoxGridRowTable" border\x3d"0" cellspacing\x3d"0" cellpadding\x3d"0" role\x3d"presentation"',
              getTableArray: function() {
                var a = [this._table];
                this.view.viewWidth &&
                  a.push(
                    [' style\x3d"width:', this.view.viewWidth, ';"'].join("")
                  );
                a.push("\x3e");
                return a;
              },
              generateCellMarkup: function(a, b, c, d) {
                var e = [],
                  f;
                d
                  ? ((f =
                      a.index != a.grid.getSortIndex()
                        ? ""
                        : 0 < a.grid.sortInfo
                        ? 'aria-sort\x3d"ascending"'
                        : 'aria-sort\x3d"descending"'),
                    a.id || (a.id = this.grid.id + "Hdr" + a.index),
                    (f = [
                      '\x3cth tabIndex\x3d"-1" aria-readonly\x3d"true" role\x3d"columnheader"',
                      f,
                      ' id\x3d"',
                      a.id,
                      '"'
                    ]))
                  : (f = [
                      '\x3ctd tabIndex\x3d"-1" role\x3d"gridcell"',
                      this.grid.editable && !a.editable
                        ? 'aria-readonly\x3d"true"'
                        : ""
                    ]);
                a.colSpan && f.push(' colspan\x3d"', a.colSpan, '"');
                a.rowSpan && f.push(' rowspan\x3d"', a.rowSpan, '"');
                f.push(' class\x3d"dojoxGridCell ');
                a.classes && f.push(a.classes, " ");
                c && f.push(c, " ");
                e.push(f.join(""));
                e.push("");
                f = ['" idx\x3d"', a.index, '" style\x3d"'];
                b && ";" != b[b.length - 1] && (b += ";");
                f.push(a.styles, b || "", a.hidden ? "display:none;" : "");
                a.unitWidth && f.push("width:", a.unitWidth, ";");
                e.push(f.join(""));
                e.push("");
                f = ['"'];
                a.attrs && f.push(" ", a.attrs);
                f.push("\x3e");
                e.push(f.join(""));
                e.push("");
                e.push(d ? "\x3c/th\x3e" : "\x3c/td\x3e");
                return e;
              },
              isCellNode: function(a) {
                return !(!a || a == l.doc || !c.attr(a, "idx"));
              },
              getCellNodeIndex: function(a) {
                return a ? Number(c.attr(a, "idx")) : -1;
              },
              getCellNode: function(a, b) {
                for (var c = 0, d; (d = f(a.firstChild, c)) && d.cells; c++)
                  for (var e = 0, g; (g = d.cells[e]); e++)
                    if (this.getCellNodeIndex(g) == b) return g;
                return null;
              },
              findCellTarget: function(a, b) {
                for (
                  ;
                  a &&
                  (!this.isCellNode(a) ||
                    (a.offsetParent &&
                      C in a.offsetParent.parentNode &&
                      a.offsetParent.parentNode[C] != this.view.id)) &&
                  a != b;

                )
                  a = a.parentNode;
                return a != b ? a : null;
              },
              baseDecorateEvent: function(a) {
                a.dispatch = "do" + a.type;
                a.grid = this.grid;
                a.sourceView = this.view;
                a.cellNode = this.findCellTarget(a.target, a.rowNode);
                a.cellIndex = this.getCellNodeIndex(a.cellNode);
                a.cell =
                  0 <= a.cellIndex ? this.grid.getCell(a.cellIndex) : null;
              },
              findTarget: function(a, b) {
                for (
                  ;
                  a &&
                  a != this.domNode &&
                  (!(b in a) || (C in a && a[C] != this.view.id));

                )
                  a = a.parentNode;
                return a != this.domNode ? a : null;
              },
              findRowTarget: function(a) {
                return this.findTarget(a, r);
              },
              isIntraNodeEvent: function(a) {
                try {
                  return (
                    a.cellNode &&
                    a.relatedTarget &&
                    c.isDescendant(a.relatedTarget, a.cellNode)
                  );
                } catch (w) {
                  return !1;
                }
              },
              isIntraRowEvent: function(a) {
                try {
                  var b =
                    a.relatedTarget && this.findRowTarget(a.relatedTarget);
                  return (
                    (!b && -1 == a.rowIndex) ||
                    (b && a.rowIndex == b.gridRowIndex)
                  );
                } catch (z) {
                  return !1;
                }
              },
              dispatchEvent: function(a) {
                return a.dispatch in this ? this[a.dispatch](a) : !1;
              },
              domouseover: function(a) {
                a.cellNode &&
                  a.cellNode != this.lastOverCellNode &&
                  ((this.lastOverCellNode = a.cellNode),
                  this.grid.onMouseOver(a));
                this.grid.onMouseOverRow(a);
              },
              domouseout: function(a) {
                if (
                  a.cellNode &&
                  a.cellNode == this.lastOverCellNode &&
                  !this.isIntraNodeEvent(a, this.lastOverCellNode) &&
                  ((this.lastOverCellNode = null),
                  this.grid.onMouseOut(a),
                  !this.isIntraRowEvent(a))
                )
                  this.grid.onMouseOutRow(a);
              },
              domousedown: function(a) {
                if (a.cellNode) this.grid.onMouseDown(a);
                this.grid.onMouseDownRow(a);
              },
              _getTextDirStyle: function(a, b, c) {
                return "";
              }
            }
          ));
        n = q._ContentBuilder = h.extend(
          function(a) {
            x.call(this, a);
          },
          x.prototype,
          {
            update: function() {
              this.prepareHtml();
            },
            prepareHtml: function() {
              for (
                var a = this.grid.get, b = this.view.structure.cells, c = 0, d;
                (d = b[c]);
                c++
              )
                for (var e = 0, f; (f = d[e]); e++)
                  (f.get = f.get || (void 0 == f.value && a)),
                    (f.markup = this.generateCellMarkup(
                      f,
                      f.cellStyles,
                      f.cellClasses,
                      !1
                    )),
                    !this.grid.editable &&
                      f.editable &&
                      (this.grid.editable = !0);
            },
            generateHtml: function(a, b) {
              a = this.getTableArray();
              var c = this.view.structure.cells,
                d = this.grid.getItem(b),
                e;
              k.fire(this.view, "onBeforeRow", [b, c]);
              for (var f = 0, g; (g = c[f]); f++)
                if (!g.hidden && !g.header) {
                  a.push(
                    g.invisible
                      ? '\x3ctr class\x3d"dojoxGridInvisible"\x3e'
                      : "\x3ctr\x3e"
                  );
                  for (var l = 0, h, m, p; (h = g[l]); l++)
                    (m = h.markup),
                      (e = h.customClasses = []),
                      (p = h.customStyles = []),
                      (m[5] = h.format(b, d)),
                      (m[1] = e.join(" ")),
                      (m[3] = p.join(";")),
                      (e = h.textDir || this.grid.textDir) &&
                        (m[3] += this._getTextDirStyle(e, h, b)),
                      a.push.apply(a, m);
                  a.push("\x3c/tr\x3e");
                }
              a.push("\x3c/table\x3e");
              return a.join("");
            },
            decorateEvent: function(a) {
              a.rowNode = this.findRowTarget(a.target);
              if (!a.rowNode) return !1;
              a.rowIndex = a.rowNode[r];
              this.baseDecorateEvent(a);
              a.cell = this.grid.getCell(a.cellIndex);
              return !0;
            }
          }
        );
        var B = (q._HeaderBuilder = h.extend(
          function(a) {
            this.moveable = null;
            x.call(this, a);
          },
          x.prototype,
          {
            _skipBogusClicks: !1,
            overResizeWidth: 4,
            minColWidth: 1,
            update: function() {
              this.tableMap
                ? this.tableMap.mapRows(this.view.structure.cells)
                : (this.tableMap = new q._TableMap(this.view.structure.cells));
            },
            generateHtml: function(a, b) {
              var c,
                d = this.getTableArray(),
                e = this.view.structure.cells;
              k.fire(this.view, "onBeforeRow", [-1, e]);
              for (var f = 0, g; (g = e[f]); f++)
                if (!g.hidden) {
                  d.push(
                    g.invisible
                      ? '\x3ctr class\x3d"dojoxGridInvisible"\x3e'
                      : "\x3ctr\x3e"
                  );
                  for (var l = 0, h, m; (h = g[l]); l++)
                    (h.customClasses = []),
                      (h.customStyles = []),
                      this.view.simpleStructure &&
                        (h.draggable &&
                          (h.headerClasses
                            ? -1 == h.headerClasses.indexOf("dojoDndItem") &&
                              (h.headerClasses += " dojoDndItem")
                            : (h.headerClasses = "dojoDndItem")),
                        h.attrs
                          ? -1 == h.attrs.indexOf("dndType\x3d'gridColumn_") &&
                            (h.attrs +=
                              " dndType\x3d'gridColumn_" + this.grid.id + "'")
                          : (h.attrs =
                              "dndType\x3d'gridColumn_" + this.grid.id + "'")),
                      (m = this.generateCellMarkup(
                        h,
                        h.headerStyles,
                        h.headerClasses,
                        !0
                      )),
                      (m[5] = void 0 != b ? b : a(h)),
                      (m[3] = h.customStyles.join(";")),
                      (c = h.textDir || this.grid.textDir) &&
                        (m[3] += this._getTextDirStyle(c, h, b)),
                      (m[1] = h.customClasses.join(" ")),
                      d.push(m.join(""));
                  d.push("\x3c/tr\x3e");
                }
              d.push("\x3c/table\x3e");
              return d.join("");
            },
            getCellX: function(a) {
              var b;
              b = u("th");
              for (var c = a.target; c && b(c); c = c.parentNode);
              (b = c)
                ? ((b = p.position(b)), (a = a.clientX - b.x))
                : (a = a.layerX);
              return a;
            },
            decorateEvent: function(a) {
              this.baseDecorateEvent(a);
              a.rowIndex = -1;
              a.cellX = this.getCellX(a);
              return !0;
            },
            prepareResize: function(a, b) {
              do {
                var c = a.cellIndex;
                a.cellNode = c ? a.cellNode.parentNode.cells[c + b] : null;
                a.cellIndex = a.cellNode
                  ? this.getCellNodeIndex(a.cellNode)
                  : -1;
              } while (a.cellNode && "none" == a.cellNode.style.display);
              return !!a.cellNode;
            },
            canResize: function(a) {
              if (!a.cellNode || 1 < a.cellNode.colSpan) return !1;
              a = this.grid.getCell(a.cellIndex);
              return !a.noresize && a.canResize();
            },
            overLeftResizeArea: function(a) {
              if (c.hasClass(l.body(), "dojoDndMove")) return !1;
              if (b("ie")) {
                var d = a.target;
                if (
                  c.hasClass(d, "dojoxGridArrowButtonNode") ||
                  c.hasClass(d, "dojoxGridArrowButtonChar") ||
                  c.hasClass(d, "dojoxGridColCaption")
                )
                  return !1;
              }
              return this.grid.isLeftToRight()
                ? 0 < a.cellIndex &&
                    0 < a.cellX &&
                    a.cellX < this.overResizeWidth &&
                    this.prepareResize(a, -1)
                : a.cellNode && 0 < a.cellX && a.cellX < this.overResizeWidth;
            },
            overRightResizeArea: function(a) {
              if (c.hasClass(l.body(), "dojoDndMove")) return !1;
              if (b("ie")) {
                var d = a.target;
                if (
                  c.hasClass(d, "dojoxGridArrowButtonNode") ||
                  c.hasClass(d, "dojoxGridArrowButtonChar") ||
                  c.hasClass(d, "dojoxGridColCaption")
                )
                  return !1;
              }
              return this.grid.isLeftToRight()
                ? a.cellNode &&
                    a.cellX >= a.cellNode.offsetWidth - this.overResizeWidth
                : 0 < a.cellIndex &&
                    a.cellX >= a.cellNode.offsetWidth - this.overResizeWidth &&
                    this.prepareResize(a, -1);
            },
            domousemove: function(a) {
              if (!this.moveable) {
                var b = this.overRightResizeArea(a)
                  ? "dojoxGridColResize"
                  : this.overLeftResizeArea(a)
                  ? "dojoxGridColResize"
                  : "";
                b && !this.canResize(a) && (b = "dojoxGridColNoResize");
                c.toggleClass(
                  a.sourceView.headerNode,
                  "dojoxGridColNoResize",
                  "dojoxGridColNoResize" == b
                );
                c.toggleClass(
                  a.sourceView.headerNode,
                  "dojoxGridColResize",
                  "dojoxGridColResize" == b
                );
                b && e.stop(a);
              }
            },
            domousedown: function(a) {
              this.moveable ||
                ((this.overRightResizeArea(a) || this.overLeftResizeArea(a)) &&
                this.canResize(a)
                  ? this.beginColumnResize(a)
                  : (this.grid.onMouseDown(a), this.grid.onMouseOverRow(a)));
            },
            doclick: function(a) {
              return this._skipBogusClicks ? (e.stop(a), !0) : !1;
            },
            colResizeSetup: function(a, d) {
              var e = c.contentBox(a.sourceView.headerNode);
              if (d) {
                this.lineDiv = document.createElement("div");
                d = c.position(a.sourceView.headerNode, !0);
                var f = c.contentBox(a.sourceView.domNode),
                  g = a.pageX;
                !this.grid.isLeftToRight() &&
                  8 > b("ie") &&
                  (g -= m.getScrollbar().w);
                c.style(this.lineDiv, {
                  top: d.y + "px",
                  left: g + "px",
                  height: f.h + e.h + "px"
                });
                c.addClass(this.lineDiv, "dojoxGridResizeColLine");
                this.lineDiv._origLeft = g;
                l.body().appendChild(this.lineDiv);
              }
              d = [];
              for (
                var f = this.tableMap.findOverlappingNodes(a.cellNode),
                  g = 0,
                  k;
                (k = f[g]);
                g++
              )
                d.push({
                  node: k,
                  index: this.getCellNodeIndex(k),
                  width: k.offsetWidth
                });
              f = a.sourceView;
              k = this.grid.isLeftToRight() ? 1 : -1;
              for (
                var h = a.grid.views.views, g = [], p = f.idx + k, n;
                (n = h[p]);
                p += k
              )
                g.push({
                  node: n.headerNode,
                  left: window.parseInt(n.headerNode.style.left)
                });
              k = f.headerContentNode.firstChild;
              return {
                scrollLeft: a.sourceView.headerNode.scrollLeft,
                view: f,
                node: a.cellNode,
                index: a.cellIndex,
                w: c.contentBox(a.cellNode).w,
                vw: e.w,
                table: k,
                tw: c.contentBox(k).w,
                spanners: d,
                followers: g
              };
            },
            beginColumnResize: function(b) {
              this.moverDiv = document.createElement("div");
              c.style(this.moverDiv, { position: "absolute", left: 0 });
              l.body().appendChild(this.moverDiv);
              c.addClass(this.grid.domNode, "dojoxGridColumnResizing");
              var e = (this.moveable = new a(this.moverDiv)),
                f = this.colResizeSetup(b, !0);
              e.onMove = h.hitch(this, "doResizeColumn", f);
              d.connect(
                e,
                "onMoveStop",
                h.hitch(this, function() {
                  this.endResizeColumn(f);
                  f.node.releaseCapture && f.node.releaseCapture();
                  this.moveable.destroy();
                  delete this.moveable;
                  this.moveable = null;
                  c.removeClass(this.grid.domNode, "dojoxGridColumnResizing");
                })
              );
              b.cellNode.setCapture && b.cellNode.setCapture();
              e.onMouseDown(b);
            },
            doResizeColumn: function(a, b, d) {
              var e = d.l,
                e = {
                  deltaX: e,
                  w: a.w + (this.grid.isLeftToRight() ? e : -e),
                  vw: a.vw + e,
                  tw: a.tw + e
                };
              this.dragRecord = { inDrag: a, mover: b, leftTop: d };
              e.w >= this.minColWidth &&
                (b
                  ? c.style(
                      this.lineDiv,
                      "left",
                      this.lineDiv._origLeft + e.deltaX + "px"
                    )
                  : this.doResizeNow(a, e));
            },
            endResizeColumn: function(a) {
              if (this.dragRecord) {
                var d = this.dragRecord.leftTop,
                  d = this.grid.isLeftToRight() ? d.l : -d.l,
                  d = d + (Math.max(a.w + d, this.minColWidth) - (a.w + d));
                b("webkit") &&
                  a.spanners.length &&
                  (d += c._getPadBorderExtents(a.spanners[0].node).w);
                this.doResizeNow(a, {
                  deltaX: d,
                  w: a.w + d,
                  vw: a.vw + d,
                  tw: a.tw + d
                });
                delete this.dragRecord;
              }
              c.destroy(this.lineDiv);
              c.destroy(this.moverDiv);
              c.destroy(this.moverDiv);
              delete this.moverDiv;
              this._skipBogusClicks = !0;
              a.view.update();
              this._skipBogusClicks = !1;
              this.grid.onResizeColumn(a.index);
            },
            doResizeNow: function(a, c) {
              a.view.convertColPctToFixed();
              if (a.view.flexCells && !a.view.testFlexCells()) {
                var d = y(a.node);
                d && (d.style.width = "");
              }
              for (var e, f, d = 0; (e = a.spanners[d]); d++)
                (f = e.width + c.deltaX),
                  0 < f &&
                    ((e.node.style.width = f + "px"),
                    a.view.setColWidth(e.index, f));
              if (this.grid.isLeftToRight() || !b("ie"))
                for (d = 0; (e = a.followers[d]); d++)
                  (f = e.left + c.deltaX), (e.node.style.left = f + "px");
              a.node.style.width = c.w + "px";
              a.view.setColWidth(a.index, c.w);
              a.view.headerNode.style.width = c.vw + "px";
              a.view.setColumnsWidth(c.tw);
              this.grid.isLeftToRight() ||
                (a.view.headerNode.scrollLeft = a.scrollLeft + c.deltaX);
            }
          }
        ));
        q._TableMap = h.extend(
          function(a) {
            this.mapRows(a);
          },
          {
            map: null,
            mapRows: function(a) {
              if (a.length) {
                this.map = [];
                for (var b, c = 0; (b = a[c]); c++) this.map[c] = [];
                for (c = 0; (b = a[c]); c++)
                  for (var d = 0, e = 0, f, g; (f = b[d]); d++) {
                    for (; this.map[c][e]; ) e++;
                    this.map[c][e] = { c: d, r: c };
                    g = f.rowSpan || 1;
                    f = f.colSpan || 1;
                    for (var k = 0; k < g; k++)
                      for (var h = 0; h < f; h++)
                        this.map[c + k][e + h] = this.map[c][e];
                    e += f;
                  }
              }
            },
            dumpMap: function() {
              for (var a = 0, b; (b = this.map[a]); a++)
                for (var c = 0; b[c]; c++);
            },
            getMapCoords: function(a, b) {
              for (var c = 0, d; (d = this.map[c]); c++)
                for (var e = 0, f; (f = d[e]); e++)
                  if (f.c == b && f.r == a) return { j: c, i: e };
              return { j: -1, i: -1 };
            },
            getNode: function(a, b, c) {
              return (a = a && a.rows[b]) && a.cells[c];
            },
            _findOverlappingNodes: function(a, b, c) {
              var d = [];
              b = this.getMapCoords(b, c);
              c = 0;
              for (var e; (e = this.map[c]); c++)
                c != b.j &&
                  (e = (e = e[b.i]) ? this.getNode(a, e.r, e.c) : null) &&
                  d.push(e);
              return d;
            },
            findOverlappingNodes: function(a) {
              return this._findOverlappingNodes(
                y(a),
                t(a.parentNode),
                0 <= a.cellIndex
                  ? a.cellIndex
                  : g.indexOf(a.parentNode.cells, a)
              );
            }
          }
        );
        return { _Builder: x, _HeaderBuilder: B, _ContentBuilder: n };
      });
    },
    "dojox/grid/_ViewManager": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/sniff",
        "dojo/dom-class"
      ], function(n, g, h) {
        return n("dojox.grid._ViewManager", null, {
          constructor: function(g) {
            this.grid = g;
          },
          defaultWidth: 200,
          views: [],
          resize: function() {
            this.onEach("resize");
          },
          render: function() {
            this.onEach("render");
          },
          addView: function(g) {
            g.idx = this.views.length;
            this.views.push(g);
          },
          destroyViews: function() {
            for (var g = 0, e; (e = this.views[g]); g++) e.destroy();
            this.views = [];
          },
          getContentNodes: function() {
            for (var g = [], e = 0, b; (b = this.views[e]); e++)
              g.push(b.contentNode);
            return g;
          },
          forEach: function(g) {
            for (var e = 0, b; (b = this.views[e]); e++) g(b, e);
          },
          onEach: function(g, e) {
            e = e || [];
            for (var b = 0, d; (d = this.views[b]); b++)
              g in d && d[g].apply(d, e);
          },
          normalizeHeaderNodeHeight: function() {
            for (var g = [], e = 0, b; (b = this.views[e]); e++)
              b.headerContentNode.firstChild && g.push(b.headerContentNode);
            this.normalizeRowNodeHeights(g);
          },
          normalizeRowNodeHeights: function(l) {
            var e = 0,
              b = [];
            if (this.grid.rowHeight) e = this.grid.rowHeight;
            else {
              if (1 >= l.length) return;
              for (var d = 0, a; (a = l[d]); d++)
                h.contains(a, "dojoxGridNonNormalizedCell") ||
                  ((b[d] = a.firstChild.offsetHeight), (e = Math.max(e, b[d])));
              e = 0 <= e ? e : 0;
              (g("mozilla") || 8 < g("ie")) && e && e++;
            }
            for (d = 0; (a = l[d]); d++)
              b[d] != e && (a.firstChild.style.height = e + "px");
          },
          resetHeaderNodeHeight: function() {
            for (var g = 0, e; (e = this.views[g]); g++)
              if ((e = e.headerContentNode.firstChild)) e.style.height = "";
          },
          renormalizeRow: function(g) {
            for (
              var e = [], b = 0, d, a;
              (d = this.views[b]) && (a = d.getRowNode(g));
              b++
            )
              (a.firstChild.style.height = ""), e.push(a);
            this.normalizeRowNodeHeights(e);
          },
          getViewWidth: function(g) {
            return this.views[g].getWidth() || this.defaultWidth;
          },
          measureHeader: function() {
            this.resetHeaderNodeHeight();
            this.forEach(function(e) {
              e.headerContentNode.style.height = "";
            });
            var g = 0;
            this.forEach(function(e) {
              g = Math.max(e.headerNode.offsetHeight, g);
            });
            return g;
          },
          measureContent: function() {
            var g = 0;
            this.forEach(function(e) {
              g = Math.max(e.domNode.offsetHeight, g);
            });
            return g;
          },
          findClient: function(g) {
            g = this.grid.elasticView || -1;
            if (0 > g)
              for (var e = 1, b; (b = this.views[e]); e++)
                if (b.viewWidth) {
                  for (e = 1; (b = this.views[e]); e++)
                    if (!b.viewWidth) {
                      g = e;
                      break;
                    }
                  break;
                }
            0 > g && (g = Math.floor(this.views.length / 2));
            return g;
          },
          arrange: function(h, e) {
            var b,
              d,
              a,
              l = this.views.length,
              k = this,
              c = 0 >= e ? l : this.findClient(),
              p = function(a, b) {
                var c = a.domNode.style,
                  d = a.headerNode.style;
                k.grid.isLeftToRight()
                  ? ((c.left = b + "px"), (d.left = b + "px"))
                  : ((c.right = b + "px"),
                    4 > g("ff")
                      ? (d.right = b + a.getScrollbarWidth() + "px")
                      : (d.right = b + "px"),
                    g("webkit") ||
                      "auto" == d.width ||
                      (d.width =
                        parseInt(d.width, 10) - a.getScrollbarWidth() + "px"));
                c.top = "0px";
                d.top = 0;
              };
            for (b = 0; (d = this.views[b]) && b < c; b++)
              (a = this.getViewWidth(b)),
                d.setSize(a, 0),
                p(d, h),
                (a =
                  d.headerContentNode && d.headerContentNode.firstChild
                    ? d.getColumnsWidth() + d.getScrollbarWidth()
                    : d.domNode.offsetWidth),
                (h += a);
            b++;
            for (var n = l - 1; (d = this.views[n]) && b <= n; n--)
              (a = this.getViewWidth(n)),
                d.setSize(a, 0),
                (a = d.domNode.offsetWidth),
                (e -= a),
                p(d, e);
            c < l &&
              ((d = this.views[c]),
              (a = Math.max(1, e - h)),
              d.setSize(a + "px", 0),
              p(d, h));
            return h;
          },
          renderRow: function(g, e, b) {
            for (
              var d = [], a = 0, h, k;
              (h = this.views[a]) && (k = e[a]);
              a++
            )
              (h = h.renderRow(g)), k.appendChild(h), d.push(h);
            b || this.normalizeRowNodeHeights(d);
          },
          rowRemoved: function(g) {
            this.onEach("rowRemoved", [g]);
          },
          updateRow: function(g, e) {
            for (var b = 0, d; (d = this.views[b]); b++) d.updateRow(g);
            e || this.renormalizeRow(g);
          },
          updateRowStyles: function(g) {
            this.onEach("updateRowStyles", [g]);
          },
          setScrollTop: function(h) {
            for (var e = h, b = 0, d; (d = this.views[b]); b++)
              (e = d.setScrollTop(h)),
                g("ie") &&
                  d.headerNode &&
                  d.scrollboxNode &&
                  (d.headerNode.scrollLeft = d.scrollboxNode.scrollLeft);
            return e;
          },
          getFirstScrollingView: function() {
            for (var g = 0, e; (e = this.views[g]); g++)
              if (e.hasHScrollbar() || e.hasVScrollbar()) return e;
            return null;
          }
        });
      });
    },
    "dojox/grid/_RowManager": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-class"
      ], function(n, g, h) {
        return n("dojox.grid._RowManager", null, {
          constructor: function(g) {
            this.grid = g;
          },
          linesToEms: 2,
          overRow: -2,
          prepareStylingRow: function(g, e) {
            return {
              index: g,
              node: e,
              odd: !!(g & 1),
              selected: !!this.grid.selection.isSelected(g),
              over: this.isOver(g),
              customStyles: "",
              customClasses: "dojoxGridRow"
            };
          },
          styleRowNode: function(g, e) {
            g = this.prepareStylingRow(g, e);
            this.grid.onStyleRow(g);
            this.applyStyles(g);
          },
          applyStyles: function(g) {
            g.node.className = g.customClasses;
            var e = g.node.style.height,
              b = g.node,
              d = g.customStyles + ";" + (g.node._style || "");
            void 0 == b.style.cssText
              ? b.setAttribute("style", d)
              : (b.style.cssText = d);
            g.node.style.height = e;
          },
          updateStyles: function(g) {
            this.grid.updateRowStyles(g);
          },
          setOverRow: function(h) {
            var e = this.overRow;
            this.overRow = h;
            e != this.overRow &&
              (g.isString(e) || 0 <= e) &&
              this.updateStyles(e);
            this.updateStyles(this.overRow);
          },
          isOver: function(g) {
            return (
              this.overRow == g &&
              !h.contains(this.grid.domNode, "dojoxGridColumnResizing")
            );
          }
        });
      });
    },
    "dojox/grid/_FocusManager": function() {
      define("dojo/_base/array dojo/_base/lang dojo/_base/declare dojo/_base/connect dojo/_base/event dojo/_base/sniff dojo/query ./util dojo/_base/html".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m) {
        return h("dojox.grid._FocusManager", null, {
          constructor: function(a) {
            this.grid = a;
            this.cell = null;
            this.rowIndex = -1;
            this._connects = [];
            this._headerConnects = [];
            this.headerMenu = this.grid.headerMenu;
            this._connects.push(
              l.connect(this.grid.domNode, "onfocus", this, "doFocus")
            );
            this._connects.push(
              l.connect(this.grid.domNode, "onblur", this, "doBlur")
            );
            this._connects.push(
              l.connect(this.grid.domNode, "mousedown", this, "_mouseDown")
            );
            this._connects.push(
              l.connect(this.grid.domNode, "mouseup", this, "_mouseUp")
            );
            this._connects.push(
              l.connect(
                this.grid.domNode,
                "oncontextmenu",
                this,
                "doContextMenu"
              )
            );
            this._connects.push(
              l.connect(
                this.grid.lastFocusNode,
                "onfocus",
                this,
                "doLastNodeFocus"
              )
            );
            this._connects.push(
              l.connect(
                this.grid.lastFocusNode,
                "onblur",
                this,
                "doLastNodeBlur"
              )
            );
            this._connects.push(
              l.connect(
                this.grid,
                "_onFetchComplete",
                this,
                "_delayedCellFocus"
              )
            );
            this._connects.push(
              l.connect(this.grid, "postrender", this, "_delayedHeaderFocus")
            );
          },
          destroy: function() {
            n.forEach(this._connects, l.disconnect);
            n.forEach(this._headerConnects, l.disconnect);
            delete this.grid;
            delete this.cell;
          },
          _colHeadNode: null,
          _colHeadFocusIdx: null,
          _contextMenuBindNode: null,
          tabbingOut: !1,
          focusClass: "dojoxGridCellFocus",
          focusView: null,
          initFocusView: function() {
            this.focusView =
              this.grid.views.getFirstScrollingView() ||
              this.focusView ||
              this.grid.views.views[0];
            this._initColumnHeaders();
          },
          isFocusCell: function(a, b) {
            return this.cell == a && this.rowIndex == b;
          },
          isLastFocusCell: function() {
            return this.cell
              ? this.rowIndex == this.grid.rowCount - 1 &&
                  this.cell.index == this.grid.layout.cellCount - 1
              : !1;
          },
          isFirstFocusCell: function() {
            return this.cell
              ? 0 === this.rowIndex && 0 === this.cell.index
              : !1;
          },
          isNoFocusCell: function() {
            return 0 > this.rowIndex || !this.cell;
          },
          isNavHeader: function() {
            return !!this._colHeadNode;
          },
          getHeaderIndex: function() {
            return this._colHeadNode
              ? n.indexOf(this._findHeaderCells(), this._colHeadNode)
              : -1;
          },
          _focusifyCellNode: function(d) {
            var c = this.cell && this.cell.getNode(this.rowIndex);
            if (c && (m.toggleClass(c, this.focusClass, d), d)) {
              d = this.scrollIntoView();
              try {
                if (b("webkit") || !this.grid.edit.isEditing())
                  a.fire(c, "focus"),
                    d && (this.cell.view.scrollboxNode.scrollLeft = d);
              } catch (p) {}
            }
          },
          _delayedCellFocus: function() {
            if (!this.isNavHeader() && this.grid.focused) {
              var b = this.cell && this.cell.getNode(this.rowIndex);
              if (b)
                try {
                  this.grid.edit.isEditing() ||
                    (m.toggleClass(b, this.focusClass, !0),
                    this._colHeadNode && this.blurHeader(),
                    a.fire(b, "focus"));
                } catch (c) {}
            }
          },
          _delayedHeaderFocus: function() {
            this.isNavHeader() && this.focusHeader();
          },
          _initColumnHeaders: function() {
            n.forEach(this._headerConnects, l.disconnect);
            this._headerConnects = [];
            for (var a = this._findHeaderCells(), b = 0; b < a.length; b++)
              this._headerConnects.push(
                l.connect(a[b], "onfocus", this, "doColHeaderFocus")
              ),
                this._headerConnects.push(
                  l.connect(a[b], "onblur", this, "doColHeaderBlur")
                );
          },
          _findHeaderCells: function() {
            for (
              var a = d("th", this.grid.viewsHeaderNode), b = [], e = 0;
              e < a.length;
              e++
            ) {
              var g = a[e],
                h = m.hasAttr(g, "tabIndex"),
                f = m.attr(g, "tabIndex");
              h && 0 > f && b.push(g);
            }
            return b;
          },
          _setActiveColHeader: function(a, b, d) {
            this.grid.domNode.setAttribute("aria-activedescendant", a.id);
            null != d &&
              0 <= d &&
              d != b &&
              m.toggleClass(this._findHeaderCells()[d], this.focusClass, !1);
            m.toggleClass(a, this.focusClass, !0);
            this._colHeadNode = a;
            this._colHeadFocusIdx = b;
            this._scrollHeader(this._colHeadFocusIdx);
          },
          scrollIntoView: function() {
            var a = this.cell ? this._scrollInfo(this.cell) : null;
            if (!a || !a.s) return null;
            var b = this.grid.scroller.findScrollTop(this.rowIndex);
            a.n &&
              a.sr &&
              (a.n.offsetLeft + a.n.offsetWidth > a.sr.l + a.sr.w
                ? (a.s.scrollLeft = a.n.offsetLeft + a.n.offsetWidth - a.sr.w)
                : a.n.offsetLeft < a.sr.l && (a.s.scrollLeft = a.n.offsetLeft));
            a.r &&
              a.sr &&
              (b + a.r.offsetHeight > a.sr.t + a.sr.h
                ? this.grid.setScrollTop(b + a.r.offsetHeight - a.sr.h)
                : b < a.sr.t && this.grid.setScrollTop(b));
            return a.s.scrollLeft;
          },
          _scrollInfo: function(a, b) {
            if (a) {
              var c = a.view.scrollboxNode,
                d = {
                  w: c.clientWidth,
                  l: c.scrollLeft,
                  t: c.scrollTop,
                  h: c.clientHeight
                },
                e = a.view.getRowNode(this.rowIndex);
              return {
                c: a,
                s: c,
                sr: d,
                n: b ? b : a.getNode(this.rowIndex),
                r: e
              };
            }
            return null;
          },
          _scrollHeader: function(a) {
            var c = null;
            if (this._colHeadNode) {
              var d = this.grid.getCell(a);
              if (!d) return;
              c = this._scrollInfo(d, d.getNode(0));
            }
            c &&
              c.s &&
              c.sr &&
              c.n &&
              (c.n.offsetLeft + c.n.offsetWidth > c.sr.l + c.sr.w
                ? (c.s.scrollLeft = c.n.offsetLeft + c.n.offsetWidth - c.sr.w)
                : c.n.offsetLeft < c.sr.l
                ? (c.s.scrollLeft = c.n.offsetLeft)
                : 7 >= b("ie") &&
                  d &&
                  d.view.headerNode &&
                  (d.view.headerNode.scrollLeft = c.s.scrollLeft));
          },
          _isHeaderHidden: function() {
            var a = this.focusView;
            if (!a)
              for (var b = 0, d; (d = this.grid.views.views[b]); b++)
                if (d.headerNode) {
                  a = d;
                  break;
                }
            return a && "none" == m.getComputedStyle(a.headerNode).display;
          },
          colSizeAdjust: function(a, b, d) {
            var c = this._findHeaderCells(),
              e = this.focusView;
            if (!e || !e.header.tableMap.map)
              for (var g = 0, k; (k = this.grid.views.views[g]); g++)
                if (k.header.tableMap.map) {
                  e = k;
                  break;
                }
            g = c[b];
            !e ||
              (b == c.length - 1 && 0 === b) ||
              (e.content.baseDecorateEvent(a),
              (a.cellNode = g),
              (a.cellIndex = e.content.getCellNodeIndex(a.cellNode)),
              (a.cell =
                0 <= a.cellIndex ? this.grid.getCell(a.cellIndex) : null),
              e.header.canResize(a) &&
                ((b = { l: d }),
                (a = e.header.colResizeSetup(a, !1)),
                e.header.doResizeColumn(a, null, b),
                e.update()));
          },
          styleRow: function(a) {},
          setFocusIndex: function(a, b) {
            this.setFocusCell(this.grid.getCell(b), a);
          },
          setFocusCell: function(a, c) {
            a &&
              !this.isFocusCell(a, c) &&
              ((this.tabbingOut = !1),
              this._colHeadNode && this.blurHeader(),
              (this._colHeadNode = this._colHeadFocusIdx = null),
              this.focusGridView(),
              this._focusifyCellNode(!1),
              (this.cell = a),
              (this.rowIndex = c),
              this._focusifyCellNode(!0));
            if (b("opera"))
              setTimeout(
                g.hitch(this.grid, "onCellFocus", this.cell, this.rowIndex),
                1
              );
            else this.grid.onCellFocus(this.cell, this.rowIndex);
          },
          next: function() {
            if (this.cell) {
              var a = this.rowIndex,
                b = this.cell.index + 1,
                d = this.grid.layout.cellCount - 1,
                e = this.grid.rowCount - 1;
              b > d && ((b = 0), a++);
              a > e && ((b = d), (a = e));
              if (
                this.grid.edit.isEditing() &&
                ((d = this.grid.getCell(b)),
                !this.isLastFocusCell() &&
                  (!d.editable ||
                    (this.grid.canEdit && !this.grid.canEdit(d, a))))
              ) {
                this.cell = d;
                this.rowIndex = a;
                this.next();
                return;
              }
              this.setFocusIndex(a, b);
            }
          },
          previous: function() {
            if (this.cell) {
              var a = this.rowIndex || 0,
                b = (this.cell.index || 0) - 1;
              0 > b && ((b = this.grid.layout.cellCount - 1), a--);
              0 > a && (b = a = 0);
              if (this.grid.edit.isEditing()) {
                var d = this.grid.getCell(b);
                if (!this.isFirstFocusCell() && !d.editable) {
                  this.cell = d;
                  this.rowIndex = a;
                  this.previous();
                  return;
                }
              }
              this.setFocusIndex(a, b);
            }
          },
          move: function(a, b) {
            var c = 0 > b ? -1 : 1;
            if (this.isNavHeader()) {
              a = this._findHeaderCells();
              var d = (currentIdx = n.indexOf(a, this._colHeadNode));
              for (
                currentIdx += b;
                0 <= currentIdx &&
                currentIdx < a.length &&
                "none" == a[currentIdx].style.display;

              )
                currentIdx += c;
              0 <= currentIdx &&
                currentIdx < a.length &&
                this._setActiveColHeader(a[currentIdx], currentIdx, d);
            } else if (this.cell) {
              var e = this.grid.scroller,
                d = this.rowIndex,
                g = this.grid.rowCount - 1,
                k = Math.min(g, Math.max(0, d + a));
              a &&
                (0 < a
                  ? k > e.getLastPageRow(e.page) &&
                    this.grid.setScrollTop(
                      this.grid.scrollTop +
                        e.findScrollTop(k) -
                        e.findScrollTop(d)
                    )
                  : 0 > a &&
                    k <= e.getPageRow(e.page) &&
                    this.grid.setScrollTop(
                      this.grid.scrollTop -
                        e.findScrollTop(d) -
                        e.findScrollTop(k)
                    ));
              for (
                var e = this.grid.layout.cellCount - 1,
                  h = this.cell.index,
                  l = Math.min(e, Math.max(0, h + b)),
                  C = this.grid.getCell(l);
                0 <= l && l < e && C && !0 === C.hidden;

              )
                (l += c), (C = this.grid.getCell(l));
              (C && !0 !== C.hidden) || (l = h);
              c = C.getNode(k);
              !c && a
                ? 0 <= k + a && k + a <= g && this.move(0 < a ? ++a : --a, b)
                : (c && "none" !== m.style(c, "display")) || !b
                ? (this.setFocusIndex(k, l), a && this.grid.updateRow(d))
                : 0 <= l + b && l + b <= e && this.move(a, 0 < b ? ++b : --b);
            }
          },
          previousKey: function(a) {
            this.grid.edit.isEditing()
              ? (e.stop(a), this.previous())
              : this.isNavHeader() || this._isHeaderHidden()
              ? (this.tabOut(this.grid.domNode),
                null != this._colHeadFocusIdx &&
                  (m.toggleClass(
                    this._findHeaderCells()[this._colHeadFocusIdx],
                    this.focusClass,
                    !1
                  ),
                  (this._colHeadFocusIdx = null)),
                this._focusifyCellNode(!1))
              : (this.grid.domNode.focus(), e.stop(a));
          },
          nextKey: function(a) {
            a.target === this.grid.domNode && null == this._colHeadFocusIdx
              ? (this.focusHeader(), e.stop(a))
              : this.isNavHeader()
              ? (this.blurHeader(),
                this.findAndFocusGridCell() ||
                  this.tabOut(this.grid.lastFocusNode),
                (this._colHeadNode = this._colHeadFocusIdx = null))
              : this.grid.edit.isEditing()
              ? (e.stop(a), this.next())
              : this.tabOut(this.grid.lastFocusNode);
          },
          tabOut: function(a) {
            this.tabbingOut = !0;
            a.focus();
          },
          focusGridView: function() {
            a.fire(this.focusView, "focus");
          },
          focusGrid: function(a) {
            this.focusGridView();
            this._focusifyCellNode(!0);
          },
          findAndFocusGridCell: function() {
            var a = !0,
              b = 0 === this.grid.rowCount;
            this.isNoFocusCell() && !b
              ? ((b = 0),
                this.grid.getCell(b).hidden &&
                  (b = this.isNavHeader() ? this._colHeadFocusIdx : 0),
                this.setFocusIndex(0, b))
              : this.cell && !b
              ? (this.focusView &&
                  !this.focusView.rowNodes[this.rowIndex] &&
                  this.grid.scrollToRow(this.rowIndex),
                this.focusGrid())
              : (a = !1);
            this._colHeadNode = this._colHeadFocusIdx = null;
            return a;
          },
          focusHeader: function() {
            var a = this._findHeaderCells(),
              b = this._colHeadFocusIdx;
            this._isHeaderHidden()
              ? this.findAndFocusGridCell()
              : this._colHeadFocusIdx ||
                (this.isNoFocusCell()
                  ? (this._colHeadFocusIdx = 0)
                  : (this._colHeadFocusIdx = this.cell.index));
            for (
              this._colHeadNode = a[this._colHeadFocusIdx];
              this._colHeadNode &&
              0 <= this._colHeadFocusIdx &&
              this._colHeadFocusIdx < a.length &&
              "none" == this._colHeadNode.style.display;

            )
              this._colHeadFocusIdx++,
                (this._colHeadNode = a[this._colHeadFocusIdx]);
            this._colHeadNode && "none" != this._colHeadNode.style.display
              ? (this.headerMenu &&
                  this._contextMenuBindNode != this.grid.domNode &&
                  (this.headerMenu.unBindDomNode(this.grid.viewsHeaderNode),
                  this.headerMenu.bindDomNode(this.grid.domNode),
                  (this._contextMenuBindNode = this.grid.domNode)),
                this._setActiveColHeader(
                  this._colHeadNode,
                  this._colHeadFocusIdx,
                  b
                ),
                this._scrollHeader(this._colHeadFocusIdx),
                this._focusifyCellNode(!1))
              : this.findAndFocusGridCell();
          },
          blurHeader: function() {
            m.removeClass(this._colHeadNode, this.focusClass);
            m.removeAttr(this.grid.domNode, "aria-activedescendant");
            if (
              this.headerMenu &&
              this._contextMenuBindNode == this.grid.domNode
            ) {
              var a = this.grid.viewsHeaderNode;
              this.headerMenu.unBindDomNode(this.grid.domNode);
              this.headerMenu.bindDomNode(a);
              this._contextMenuBindNode = a;
            }
          },
          doFocus: function(a) {
            a && a.target != a.currentTarget
              ? e.stop(a)
              : this._clickFocus ||
                (this.tabbingOut || this.focusHeader(),
                (this.tabbingOut = !1),
                e.stop(a));
          },
          doBlur: function(a) {
            e.stop(a);
          },
          doContextMenu: function(a) {
            this.headerMenu || e.stop(a);
          },
          doLastNodeFocus: function(a) {
            this.tabbingOut
              ? this._focusifyCellNode(!1)
              : 0 < this.grid.rowCount
              ? (this.isNoFocusCell() && this.setFocusIndex(0, 0),
                this._focusifyCellNode(!0))
              : this.focusHeader();
            this.tabbingOut = !1;
            e.stop(a);
          },
          doLastNodeBlur: function(a) {
            e.stop(a);
          },
          doColHeaderFocus: function(a) {
            this._setActiveColHeader(
              a.target,
              m.attr(a.target, "idx"),
              this._colHeadFocusIdx
            );
            this._scrollHeader(this.getHeaderIndex());
            e.stop(a);
          },
          doColHeaderBlur: function(a) {
            m.toggleClass(a.target, this.focusClass, !1);
          },
          _mouseDown: function(a) {
            this._clickFocus = dojo.some(this.grid.views.views, function(b) {
              return b.scrollboxNode === a.target;
            });
          },
          _mouseUp: function(a) {
            this._clickFocus = !1;
          }
        });
      });
    },
    "dojox/grid/_EditManager": function() {
      define("dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/_base/connect dojo/_base/sniff ./util".split(
        " "
      ), function(n, g, h, l, e, b) {
        return h("dojox.grid._EditManager", null, {
          constructor: function(b) {
            this.grid = b;
            this.connections = e("ie")
              ? [
                  l.connect(
                    document.body,
                    "onfocus",
                    n.hitch(this, "_boomerangFocus")
                  )
                ]
              : [];
            this.connections.push(
              l.connect(this.grid, "onBlur", this, "apply")
            );
            this.connections.push(
              l.connect(this.grid, "prerender", this, "_onPreRender")
            );
          },
          info: {},
          destroy: function() {
            g.forEach(this.connections, l.disconnect);
          },
          cellFocus: function(b, a) {
            this.grid.singleClickEdit || this.isEditRow(a)
              ? this.setEditCell(b, a)
              : this.apply();
            (this.isEditing() || (b && b.editable && b.alwaysEditing)) &&
              this._focusEditor(b, a);
          },
          rowClick: function(b) {
            this.isEditing() && !this.isEditRow(b.rowIndex) && this.apply();
          },
          styleRow: function(b) {
            b.index == this.info.rowIndex &&
              (b.customClasses += " dojoxGridRowEditing");
          },
          dispatchEvent: function(b) {
            var a = b.cell;
            return (
              (a = a && a.editable ? a : 0) && a.dispatchEvent(b.dispatch, b)
            );
          },
          isEditing: function() {
            return void 0 !== this.info.rowIndex;
          },
          isEditCell: function(b, a) {
            return this.info.rowIndex === b && this.info.cell.index == a;
          },
          isEditRow: function(b) {
            return this.info.rowIndex === b;
          },
          setEditCell: function(b, a) {
            !this.isEditCell(a, b.index) &&
              this.grid.canEdit &&
              this.grid.canEdit(b, a) &&
              this.start(b, a, this.isEditRow(a) || b.editable);
          },
          _focusEditor: function(d, a) {
            b.fire(d, "focus", [a]);
          },
          focusEditor: function() {
            this.isEditing() &&
              this._focusEditor(this.info.cell, this.info.rowIndex);
          },
          _boomerangWindow: 500,
          _shouldCatchBoomerang: function() {
            return this._catchBoomerang > new Date().getTime();
          },
          _boomerangFocus: function() {
            this._shouldCatchBoomerang() &&
              (this.grid.focus.focusGrid(),
              this.focusEditor(),
              (this._catchBoomerang = 0));
          },
          _doCatchBoomerang: function() {
            e("ie") &&
              (this._catchBoomerang =
                new Date().getTime() + this._boomerangWindow);
          },
          start: function(b, a, e) {
            this._isValidInput() &&
              (this.grid.beginUpdate(),
              this.editorApply(),
              this.isEditing() &&
                !this.isEditRow(a) &&
                (this.applyRowEdit(), this.grid.updateRow(a)),
              e
                ? ((this.info = { cell: b, rowIndex: a }),
                  this.grid.doStartEdit(b, a),
                  this.grid.updateRow(a))
                : (this.info = {}),
              this.grid.endUpdate(),
              this.grid.focus.focusGrid(),
              this._focusEditor(b, a),
              this._doCatchBoomerang());
          },
          _editorDo: function(b) {
            var a = this.info.cell;
            if (a && a.editable) a[b](this.info.rowIndex);
          },
          editorApply: function() {
            this._editorDo("apply");
          },
          editorCancel: function() {
            this._editorDo("cancel");
          },
          applyCellEdit: function(b, a, e) {
            this.grid.canEdit(a, e) && this.grid.doApplyCellEdit(b, e, a.field);
          },
          applyRowEdit: function() {
            this.grid.doApplyEdit(this.info.rowIndex, this.info.cell.field);
          },
          apply: function() {
            this.isEditing() &&
              this._isValidInput() &&
              (this.grid.beginUpdate(),
              this.editorApply(),
              this.applyRowEdit(),
              (this.info = {}),
              this.grid.endUpdate(),
              this.grid.focus.focusGrid(),
              this._doCatchBoomerang());
          },
          cancel: function() {
            this.isEditing() &&
              (this.grid.beginUpdate(),
              this.editorCancel(),
              (this.info = {}),
              this.grid.endUpdate(),
              this.grid.focus.focusGrid(),
              this._doCatchBoomerang());
          },
          save: function(b, a) {
            var d = this.info.cell;
            !this.isEditRow(b) ||
              (a && d.view != a) ||
              !d.editable ||
              d.save(d, this.info.rowIndex);
          },
          restore: function(b, a) {
            var d = this.info.cell;
            this.isEditRow(a) &&
              d.view == b &&
              d.editable &&
              d.restore(this.info.rowIndex);
          },
          _isValidInput: function() {
            var b = (this.info.cell || {}).widget;
            if (!b || !b.isValid) return !0;
            b.focused = !0;
            return b.isValid(!0);
          },
          _onPreRender: function() {
            this.isEditing() && (this.info.value = this.info.cell.getValue());
          }
        });
      });
    },
    "dojox/grid/Selection": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-attr"
      ], function(n, g, h, l) {
        return n("dojox.grid.Selection", null, {
          constructor: function(e) {
            this.grid = e;
            this.selected = [];
            this.setMode(e.selectionMode);
          },
          mode: "extended",
          selected: null,
          updating: 0,
          selectedIndex: -1,
          rangeStartIndex: -1,
          setMode: function(e) {
            this.selected.length && this.deselectAll();
            this.mode =
              "extended" != e && "multiple" != e && "single" != e && "none" != e
                ? "extended"
                : e;
          },
          onCanSelect: function(e) {
            return this.grid.onCanSelect(e);
          },
          onCanDeselect: function(e) {
            return this.grid.onCanDeselect(e);
          },
          onSelected: function(e) {},
          onDeselected: function(e) {},
          onChanging: function() {},
          onChanged: function() {},
          isSelected: function(e) {
            return "none" == this.mode ? !1 : this.selected[e];
          },
          getFirstSelected: function() {
            if (!this.selected.length || "none" == this.mode) return -1;
            for (var e = 0, b = this.selected.length; e < b; e++)
              if (this.selected[e]) return e;
            return -1;
          },
          getNextSelected: function(e) {
            if ("none" == this.mode) return -1;
            e += 1;
            for (var b = this.selected.length; e < b; e++)
              if (this.selected[e]) return e;
            return -1;
          },
          getSelected: function() {
            for (var e = [], b = 0, d = this.selected.length; b < d; b++)
              this.selected[b] && e.push(b);
            return e;
          },
          getSelectedCount: function() {
            for (var e = 0, b = 0; b < this.selected.length; b++)
              this.selected[b] && e++;
            return e;
          },
          _beginUpdate: function() {
            if (0 === this.updating) this.onChanging();
            this.updating++;
          },
          _endUpdate: function() {
            this.updating--;
            if (0 === this.updating) this.onChanged();
          },
          select: function(e) {
            "none" != this.mode &&
              ("multiple" != this.mode
                ? (this.deselectAll(e), this.addToSelection(e))
                : this.toggleSelect(e));
          },
          addToSelection: function(e) {
            if ("none" != this.mode)
              if (h.isArray(e)) g.forEach(e, this.addToSelection, this);
              else if (((e = Number(e)), this.selected[e]))
                this.selectedIndex = e;
              else if (!1 !== this.onCanSelect(e)) {
                this.selectedIndex = e;
                var b = this.grid.getRowNode(e);
                b && l.set(b, "aria-selected", "true");
                this._beginUpdate();
                this.selected[e] = !0;
                this.onSelected(e);
                this._endUpdate();
              }
          },
          deselect: function(e) {
            if ("none" != this.mode)
              if (h.isArray(e)) g.forEach(e, this.deselect, this);
              else if (
                ((e = Number(e)),
                this.selectedIndex == e && (this.selectedIndex = -1),
                this.selected[e] && !1 !== this.onCanDeselect(e))
              ) {
                var b = this.grid.getRowNode(e);
                b && l.set(b, "aria-selected", "false");
                this._beginUpdate();
                delete this.selected[e];
                this.onDeselected(e);
                this._endUpdate();
              }
          },
          setSelected: function(e, b) {
            this[b ? "addToSelection" : "deselect"](e);
          },
          toggleSelect: function(e) {
            h.isArray(e)
              ? g.forEach(e, this.toggleSelect, this)
              : this.setSelected(e, !this.selected[e]);
          },
          _range: function(e, b, d) {
            var a = 0 <= e ? e : b;
            e = b;
            a > e && ((e = a), (a = b));
            for (b = a; b <= e; b++) d(b);
          },
          selectRange: function(e, b) {
            this._range(e, b, h.hitch(this, "addToSelection"));
          },
          deselectRange: function(e, b) {
            this._range(e, b, h.hitch(this, "deselect"));
          },
          insert: function(e) {
            this.selected.splice(e, 0, !1);
            this.selectedIndex >= e && this.selectedIndex++;
          },
          remove: function(e) {
            this.selected.splice(e, 1);
            this.selectedIndex >= e && this.selectedIndex--;
          },
          deselectAll: function(e) {
            for (var b in this.selected)
              b != e && !0 === this.selected[b] && this.deselect(b);
          },
          clickSelect: function(e, b, d) {
            if ("none" != this.mode) {
              this._beginUpdate();
              if ("extended" != this.mode) this.select(e);
              else {
                if (!d || 0 > this.rangeStartIndex) this.rangeStartIndex = e;
                b || this.deselectAll(e);
                d
                  ? this.selectRange(this.rangeStartIndex, e)
                  : b
                  ? this.toggleSelect(e)
                  : this.addToSelection(e);
              }
              this._endUpdate();
            }
          },
          clickSelectEvent: function(e) {
            this.clickSelect(e.rowIndex, dojo.isCopyKey(e), e.shiftKey);
          },
          clear: function() {
            this._beginUpdate();
            this.deselectAll();
            this._endUpdate();
          }
        });
      });
    },
    "dojox/grid/DataSelection": function() {
      define([
        "dojo/_base/declare",
        "./_SelectionPreserver",
        "./Selection"
      ], function(n, g, h) {
        return n("dojox.grid.DataSelection", h, {
          constructor: function(h) {
            h.keepSelection && (this.preserver = new g(this));
          },
          destroy: function() {
            this.preserver && this.preserver.destroy();
          },
          getFirstSelected: function() {
            var g = h.prototype.getFirstSelected.call(this);
            return -1 == g ? null : this.grid.getItem(g);
          },
          getNextSelected: function(g) {
            g = this.grid.getItemIndex(g);
            g = h.prototype.getNextSelected.call(this, g);
            return -1 == g ? null : this.grid.getItem(g);
          },
          getSelected: function() {
            for (var g = [], e = 0, b = this.selected.length; e < b; e++)
              this.selected[e] && g.push(this.grid.getItem(e));
            return g;
          },
          addToSelection: function(g) {
            if ("none" != this.mode) {
              var e = null,
                e =
                  "number" == typeof g || "string" == typeof g
                    ? g
                    : this.grid.getItemIndex(g);
              h.prototype.addToSelection.call(this, e);
            }
          },
          deselect: function(g) {
            if ("none" != this.mode) {
              var e = null,
                e =
                  "number" == typeof g || "string" == typeof g
                    ? g
                    : this.grid.getItemIndex(g);
              h.prototype.deselect.call(this, e);
            }
          },
          deselectAll: function(g) {
            var e = null;
            g || "number" == typeof g
              ? ((e =
                  "number" == typeof g || "string" == typeof g
                    ? g
                    : this.grid.getItemIndex(g)),
                h.prototype.deselectAll.call(this, e))
              : this.inherited(arguments);
          }
        });
      });
    },
    "dojox/grid/_SelectionPreserver": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/connect",
        "dojo/_base/lang",
        "dojo/_base/array"
      ], function(n, g, h, l) {
        return n("dojox.grid._SelectionPreserver", null, {
          constructor: function(e) {
            this.selection = e;
            var b = (this.grid = e.grid);
            this.reset();
            this._connects = [
              g.connect(b, "_setStore", this, "reset"),
              g.connect(b, "_addItem", this, "_reSelectById"),
              g.connect(e, "onSelected", h.hitch(this, "_selectById", !0)),
              g.connect(e, "onDeselected", h.hitch(this, "_selectById", !1)),
              g.connect(e, "deselectAll", this, "reset")
            ];
          },
          destroy: function() {
            this.reset();
            l.forEach(this._connects, g.disconnect);
            delete this._connects;
          },
          reset: function() {
            this._selectedById = {};
          },
          _reSelectById: function(e, b) {
            e &&
              this.grid._hasIdentity &&
              (this.selection.selected[b] = this._selectedById[
                this.grid.store.getIdentity(e)
              ]);
          },
          _selectById: function(e, b) {
            if ("none" != this.selection.mode && this.grid._hasIdentity) {
              var d = b,
                a = this.grid;
              if ("number" == typeof b || "string" == typeof b)
                d = (b = a._by_idx[b]) && b.item;
              d && (this._selectedById[a.store.getIdentity(d)] = !!e);
              return d;
            }
          }
        });
      });
    },
    "esri/dijit/editing/TemplatePickerItem": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has dojo/sniff dojo/dom-style dijit/_Widget dijit/_Templated dojox/gfx ../../symbols/jsonUtils ../../kernel".split(
        " "
      ), function(n, g, h, l, e, b, d, a, m, k, c) {
        n = n([d, a], {
          declaredClass: "esri.dijit.editing.TemplatePickerItem",
          templateString:
            "\x3cdiv class\x3d'item' style\x3d'text-align: center;'\x3e\x3cdiv class\x3d'itemSymbol' dojoAttachPoint\x3d'_surfaceNode'\x3e\x3c/div\x3e\x3cdiv class\x3d'itemLabel'\x3e${label}\x3c/div\x3e\x3c/div\x3e",
          startup: function() {
            this._started ||
              (this.inherited(arguments),
              (this._surface = this._draw(
                this._surfaceNode,
                this.symbol,
                this.surfaceWidth,
                this.surfaceHeight,
                this.template
              )));
          },
          _draw: function(a, c, d, e, h) {
            if (c && "textsymbol" !== c.type) {
              a = m.createSurface(a, d, e);
              if (9 > l("ie")) {
                var f = a.getEventSource();
                b.set(f, "position", "relative");
                b.set(f.parentNode, "position", "relative");
              }
              c =
                (!this.legendOverride && this._getDrawingToolShape(c, h)) ||
                k.getShapeDescriptors(c);
              var n;
              try {
                n = a
                  .createShape(c.defaultShape)
                  .setFill(c.fill)
                  .setStroke(c.stroke);
              } catch (B) {
                a.clear();
                a.destroy();
                return;
              }
              var p = n.getBoundingBox();
              c = p.width;
              h = p.height;
              var f = -(p.x + c / 2),
                p = -(p.y + h / 2),
                q = a.getDimensions(),
                f = { dx: f + q.width / 2, dy: p + q.height / 2 };
              if (c > d || h > e)
                (p = c / d > h / e),
                  (d = ((p ? d : e) - 5) / (p ? c : h)),
                  g.mixin(f, { xx: d, yy: d });
              n.applyTransform(f);
              return a;
            }
          },
          _getDrawingToolShape: function(a, b) {
            switch (b ? b.drawingTool || null : null) {
              case "esriFeatureEditToolArrow":
                b = {
                  type: "path",
                  path:
                    "M 10,1 L 3,8 L 3,5 L -15,5 L -15,-2 L 3,-2 L 3,-5 L 10,1 E"
                };
                break;
              case "esriFeatureEditToolLeftArrow":
                b = {
                  type: "path",
                  path:
                    "M -15,1 L -8,8 L -8,5 L 10,5 L 10,-2 L -8,-2 L -8,-5 L -15,1 E"
                };
                break;
              case "esriFeatureEditToolRightArrow":
                b = {
                  type: "path",
                  path:
                    "M 10,1 L 3,8 L 3,5 L -15,5 L -15,-2 L 3,-2 L 3,-5 L 10,1 E"
                };
                break;
              case "esriFeatureEditToolUpArrow":
                b = {
                  type: "path",
                  path:
                    "M 1,-10 L 8,-3 L 5,-3 L 5,15 L -2,15 L -2,-3 L -5,-3 L 1,-10 E"
                };
                break;
              case "esriFeatureEditToolDownArrow":
                b = {
                  type: "path",
                  path:
                    "M 1,15 L 8,8 L 5,8 L 5,-10 L -2,-10 L -2,8 L -5,8 L 1,15 E"
                };
                break;
              case "esriFeatureEditToolTriangle":
                b = {
                  type: "path",
                  path: "M -10,14 L 2,-10 L 14,14 L -10,14 E"
                };
                break;
              case "esriFeatureEditToolRectangle":
                b = {
                  type: "path",
                  path: "M -10,-10 L 10,-10 L 10,10 L -10,10 L -10,-10 E"
                };
                break;
              case "esriFeatureEditToolCircle":
                b = { type: "circle", cx: 0, cy: 0, r: 10 };
                break;
              case "esriFeatureEditToolEllipse":
                b = { type: "ellipse", cx: 0, cy: 0, rx: 10, ry: 5 };
                break;
              case "esriFeatureEditToolFreehand":
                b =
                  "simplelinesymbol" === a.type ||
                  "cartographiclinesymbol" === a.type
                    ? {
                        type: "path",
                        path:
                          "m -11, -7c-1.5,-3.75 7.25,-9.25 12.5,-7c5.25,2.25 6.75,9.75 3.75,12.75c-3,3 -3.25,2.5 -9.75,5.25c-6.5,2.75 -7.25,14.25 2,15.25c9.25,1 11.75,-4 13.25,-6.75c1.5,-2.75 3.5,-11.75 12,-6.5"
                      }
                    : {
                        type: "path",
                        path:
                          "M 10,-13 c3.1,0.16667 4.42564,2.09743 2.76923,3.69231c-2.61025,2.87179 -5.61025,5.6718 -6.14358,6.20513c-0.66667,0.93333 -0.46667,1.2 -0.53333,1.93333c-0.00001,0.86666 0.6,1.66667 1.13334,2c1.03077,0.38462 2.8,0.93333 3.38974,1.70769c0.47693,0.42564 0.87693,0.75897 1.41026,1.75897c0.13333,1.06667 -0.46667,2.86667 -1.8,3.8c-0.73333,0.73333 -3.86667,2.66666 -4.86667,3.13333c-0.93333,0.8 -7.4,3.2 -7.6,3.06667c-1.06667,0.46667 -4.73333,1.13334 -5.2,1.26667c-1.6,0.33334 -4.6,0.4 -6.25128,0.05128c-1.41539,-0.18462 -2.34872,-2.31796 -1.41539,-4.45129c0.93333,-1.73333 1.86667,-3.13333 2.64615,-3.85641c1.28718,-1.47692 2.57437,-2.68204 3.88718,-3.54359c0.88718,-1.13845 1.8,-1.33333 2.26666,-2.45641c0.33334,-0.74359 0.37949,-1.7641 0.06667,-2.87692c-0.66666,-1.46666 -1.66666,-1.86666 -2.98975,-2.2c-1.27692,-0.26666 -2.12307,-0.64102 -3.27692,-1.46666c-0.66667,-1.00001 -1.01538,-3.01539 0.73333,-4.06667c1.73333,-1.2 3.6,-1.93333 4.93333,-2.2c1.33333,-0.46667 4.84104,-1.09743 5.84103,-1.23076c1.60001,-0.46667 6.02564,-0.50257 7.29231,-0.56924z"
                      };
                break;
              default:
                return null;
            }
            return {
              defaultShape: b,
              fill: a.getFill(),
              stroke: a.getStroke()
            };
          },
          _repaint: function(a) {
            a
              ? (a.getStroke && a.setStroke && a.setStroke(a.getStroke()),
                a.getFill && a.setFill && a.setFill(a.getFill()),
                a.children &&
                  g.isArray(a.children) &&
                  h.forEach(a.children, this._repaint, this))
              : (this._surface = this._draw(
                  this._surfaceNode,
                  this.symbol,
                  this.surfaceWidth,
                  this.surfaceHeight,
                  this.template
                ));
          },
          destroy: function() {
            this._surface && (this._surface.destroy(), delete this._surface);
            this.inherited(arguments);
          }
        });
        l("extend-esri") &&
          g.setObject("dijit.editing.TemplatePickerItem", n, c);
        return n;
      });
    },
    "widgets/Edit/utils": function() {
      define(["dojo/_base/lang", "dojo/_base/array", "jimu/utils"], function(
        n,
        g,
        h
      ) {
        function l(b, d) {
          var a = null;
          b &&
            b.fields &&
            g.some(b.fields, function(b) {
              if (b.name.toLowerCase() === d.toLowerCase()) return (a = b), !0;
            });
          return a;
        }
        function e(b, d, a) {
          var e = null;
          if (b && b.attributes)
            for (var g in b.attributes)
              if (
                b.attributes.hasOwnProperty(g) &&
                "function" !== typeof b.attributes[g] &&
                g.toLowerCase() === d.toLowerCase()
              ) {
                e = a ? (b.attributes[g] = a) : b.attributes[g];
                break;
              }
          return e;
        }
        return {
          getFieldInfosFromWebmap: function(b, d) {
            var a = null;
            (b = d.getLayerInfoByTopLayerId(b)) &&
              (b = b.getPopupInfo()) &&
              b.fieldInfos &&
              (a = n.clone(b.fieldInfos));
            a &&
              g.forEach(a, function(a) {
                a.format &&
                  a.format.dateFormat &&
                  (a.format.dateFormat.toLowerCase &&
                  0 > a.format.dateFormat.toLowerCase().indexOf("time")
                    ? (a.format.time = !1)
                    : (a.format.time = !0));
              });
            return a;
          },
          getEditCapabilities: function(b, d, a) {
            var e = {};
            a = b.getEditCapabilities(a);
            e.canCreate = a.canCreate;
            e.canDelete = a.canDelete;
            e.canUpdateGeometry = b.allowGeometryUpdates;
            d &&
              ((e.canCreate = d.allowCreate && e.canCreate),
              (e.canDelete = d.allowDelete && e.canDelete),
              (e.canUpdateGeometry =
                !d.disableGeometryUpdate && e.canUpdateGeometry));
            return e;
          },
          getLocaleDateTime: function(b) {
            return h.localizeDate(new Date(b), {
              fullYear: !0,
              formatLength: "medium"
            });
          },
          getAttrByFieldKey: function(b, d) {
            return e(b, d);
          },
          setAttrByFieldKey: function(b, d, a) {
            return e(b, d, a);
          },
          ignoreCaseToGetFieldKey: function(b, d) {
            var a = null;
            if ((b = l(b, d))) a = b.name;
            return a;
          },
          ignoreCaseToGetFieldObject: function(b, d) {
            return l(b, d);
          }
        };
      });
    },
    "widgets/Edit/FilterEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/dom-construct dijit/_TemplatedMixin dijit/_WidgetBase".split(
        " "
      ), function(n, g, h, l, e, b, d) {
        return n([d, b], {
          name: "FilterEditor",
          baseClass: "jimu-widget-FilterEditor",
          declaredClass: "jimu.dijit.FilterEditor",
          templateString:
            "\x3cdiv style\x3d'width:100%'\x3e\x3cdiv data-dojo-attach-point\x3d'filterEditorDiv'\x3e\x3c/div\x3e\x3c/div\x3e",
          _settings: null,
          _editWidget: null,
          _origGetItemsFromLayerFunc: null,
          postCreate: function() {
            this.nls = this._editWidget.nls;
            this._createFilterTool();
          },
          _createFilterTool: function() {
            var a = e.create("label", { innerHTML: this.nls.featureLayers });
            e.place(a, this.filterEditorDiv);
            this._createLayerFilter();
            this._createTemplateFilter();
          },
          _createLayerFilter: function() {
            this.selectDropDown = e.create("select", {
              class: "jimu-input flDropDown"
            });
            e.place(this.selectDropDown, this.filterEditorDiv);
            this.selectDropDown.onchange = g.hitch(this, function() {
              this._onLayerFilterChanged();
            });
            var a = e.create("option", {
              value: "all",
              innerHTML: window.jimuNls.common.all
            });
            e.place(a, this.selectDropDown);
            for (
              var b, a = 0;
              a < this._editWidget._layerObjectsParaForTempaltePicker.length;
              a++
            )
              (b = this._editWidget._layerObjectsParaForTempaltePicker[a]),
                (b = e.create("option", { value: b.id, innerHTML: b.name })),
                e.place(b, this.selectDropDown);
          },
          _createTemplateFilter: function() {
            this.filterTextBox = e.create(
              "input",
              {
                class: "jimu-input searchtextbox",
                type: "text",
                placeholder: this.nls.searchTemplates
              },
              this.filterEditorDiv
            );
            this.filterTextBox.onkeyup = g.hitch(this, function() {
              this._onTempalteFilterChanged();
            });
            var a = this._editWidget.editor.templatePicker;
            this._origGetItemsFromLayerFunc = a._getItemsFromLayer;
            a._getItemsFromLayer = g.hitch(this, function() {
              var b;
              b = this._origGetItemsFromLayerFunc.apply(a, arguments);
              var d = this.filterTextBox.value;
              d &&
                (b = h.filter(b, function(a) {
                  var b = !1,
                    c = new RegExp(d, "ig");
                  a.hasOwnProperty("label") &&
                    a.label.match(c) &&
                    0 < a.label.match(c).length &&
                    (b = !0);
                  a.hasOwnProperty("template") &&
                    a.template.hasOwnProperty("name") &&
                    a.template.name.match(c) &&
                    0 < a.template.name.match(c).length &&
                    (b = !0);
                  return b;
                }));
              0 === b.length &&
                (this._editWidget.editor.templatePicker.grid.noDataMessage = this.nls.noAvailableTempaltes);
              return b;
            });
          },
          show: function() {
            l.setStyle(this.domNode, "display", "block");
          },
          hide: function() {
            l.setStyle(this.domNode, "display", "none");
          },
          selectLayerFilterByValue: function(a) {
            h.forEach(
              this.selectDropDown.options,
              function(b, d) {
                b.value === a && (this.selectDropDown.selectedIndex = d);
              },
              this
            );
          },
          setTemplateFilter: function(a) {
            this.filterTextBox.value = a;
          },
          disableLayerFilter: function() {
            l.setAttr(this.selectDropDown, "disabled", !0);
          },
          enableLayerFilter: function() {
            l.setAttr(this.selectDropDown, "disabled", !1);
          },
          update: function() {
            var a, b;
            for (b = this.selectDropDown.options.length - 1; 0 <= b; b--)
              "all" !== this.selectDropDown.options[b].value &&
                this.selectDropDown.remove(b);
            for (
              b = 0;
              b < this._editWidget._layerObjectsParaForTempaltePicker.length;
              b++
            )
              (a = this._editWidget._layerObjectsParaForTempaltePicker[b]),
                (a = e.create("option", { value: a.id, innerHTML: a.name })),
                e.place(a, this.selectDropDown);
            this._editWidget.editor.templatePicker.attr("grouping", !0);
            this.setTemplateFilter("");
          },
          _onLayerFilterChanged: function(a) {
            var b = this._editWidget.editor.templatePicker;
            b.clearSelection();
            var d = this.selectDropDown.options[
              this.selectDropDown.selectedIndex
            ].text;
            "" !== d &&
              ("All" === d
                ? (b.attr(
                    "featureLayers",
                    this._editWidget._layerObjectsParaForTempaltePicker
                  ),
                  "" === this.filterTextBox.value
                    ? b.attr("grouping", !0)
                    : b.attr("grouping", !1))
                : ((d = this._editWidget.map.getLayer(
                    this.selectDropDown.value
                  )),
                  b.attr("featureLayers", [d]),
                  b.attr("grouping", !1)),
              a && b.attr("grouping", !0),
              b.update(!0));
          },
          _onTempalteFilterChanged: function(a) {
            var b = this.selectDropDown.options[
                this.selectDropDown.selectedIndex
              ].text,
              d = this.filterTextBox.value;
            this._editWidget.editor.templatePicker.clearSelection();
            "All" === b && "" === d
              ? this._editWidget.editor.templatePicker.attr("grouping", !0)
              : this._editWidget.editor.templatePicker.attr("grouping", !1);
            a && this._editWidget.editor.templatePicker.attr("grouping", !0);
            this._editWidget.editor.templatePicker.update(!0);
          }
        });
      });
    },
    "widgets/Edit/RelatedRecordsEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/on dojo/Deferred dojo/query ./utils dijit/form/Button dijit/_TemplatedMixin dijit/_WidgetBase esri/undoManager esri/OperationBase esri/graphic esri/tasks/query esri/tasks/QueryTask esri/tasks/RelationshipQuery esri/layers/FeatureLayer esri/dijit/AttributeInspector esri/dijit/Popup esri/dijit/PopupTemplate jimu/portalUrlUtils jimu/SelectionManager jimu/ConfigManager jimu/dijit/DropdownMenu jimu/dijit/LoadingIndicator jimu/LayerInfos/LayerInfos".split(
        " "
      ), function(
        n,
        g,
        h,
        l,
        e,
        b,
        d,
        a,
        m,
        k,
        c,
        p,
        q,
        t,
        f,
        y,
        u,
        r,
        C,
        x,
        B,
        v,
        w,
        z,
        H,
        D,
        G
      ) {
        var E = n([c, k], {
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
            l.place(this.domNode, this.refDomNode, "after");
            window.isRTL
              ? l.addClass(this.previouBtn, "icon-arrow-forward")
              : l.addClass(this.previouBtn, "icon-arrow-back");
            this.loading = new D({ hidden: !0 }).placeAt(this.domNode);
            this._clearPage();
            this.showFirstPage({
              feature: this.originalFeature,
              oriJimuLayerInfo: this.originalJimuLayerInfo
            });
          },
          _init: function() {
            this.refDomNode = this.editorATI.domNode;
            this.originalLayer = this.originalFeature.getLayer();
            this.layerInfosObj = G.getInstanceSync();
            this.originalJimuLayerInfo = this.layerInfosObj.getLayerOrTableInfoById(
              this.originalLayer.id
            );
            this.undoManager = new p();
            this._temporaryData = { eventHandles: [], dijits: [] };
            this._tempPopup = new x({}, l.create("div"));
            this._tempPopup.show();
          },
          destroy: function() {
            this._clearPage();
            this._tempPopup.destroy();
            this.inherited(arguments);
          },
          _getRelatedTableInfoArray: function(a) {
            var c = new b(),
              d = [];
            a.getRelatedTableInfoArray("esriRelRoleOrigin").then(
              g.hitch(this, function(a) {
                h.forEach(
                  a,
                  function(a) {
                    this._findTableInfoFromTableInfosParam(a) && d.push(a);
                  },
                  this
                );
                c.resolve(d);
              })
            );
            return c;
          },
          _getRelatedRecordsByQuery: function(a) {
            var c = new b(),
              d = new f(),
              e = new y(a.destJimuLayerInfo.getUrl()),
              h = a.destJimuLayerInfo.layerObject.relationships.keyField,
              k = a.oriJimuLayerInfo.layerObject.objectIdField;
            d.where = h
              ? h + " \x3d " + a.feature.attributes[h]
              : k + " \x3d " + a.feature.attributes[k];
            d.outFields = ["*"];
            e.execute(
              d,
              g.hitch(this, function(a) {
                c.resolve(a);
              })
            );
            return c;
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
              b = h.filter(
                a.oriJimuLayerInfo.layerObject.relationships,
                function(b) {
                  if (
                    b.relatedTableId === a.destJimuLayerInfo.layerObject.layerId
                  )
                    return !0;
                },
                this
              );
            return (b = b[a.relationshipIndex] ? b[a.relationshipIndex] : b[0]);
          },
          _getDestRelationshipByDestLayer: function(a) {
            var b = null,
              b = h.filter(
                a.destJimuLayerInfo.layerObject.relationships,
                function(b) {
                  if (
                    b.relatedTableId === a.oriJimuLayerInfo.layerObject.layerId
                  )
                    return !0;
                },
                this
              );
            return (b = b[a.relationshipIndex] ? b[a.relationshipIndex] : b[0]);
          },
          _createATI: function(b) {
            var c;
            c = b.destJimuLayerInfo;
            var f = null,
              h,
              k = this._findTableInfoFromTableInfosParam(c);
            k &&
              ((f = new E.ATI(
                { layerInfos: [k], hideNavButtons: !0 },
                l.create("div")
              )),
              f.startup(),
              this._temporaryData.dijits.push(f),
              (h = this._findTableInfoFromTableInfosParam(c)),
              (h = a.getEditCapabilities(c.layerObject, h).canDelete) ||
                d(".atiButton.atiDeleteButton", f.domNode).addClass("hidden"));
            this._editWidget._configEditor.usingSaveButton &&
              ((c = f.addButton(
                this.nls.save,
                "save-button related-record disable",
                "after"
              )),
              (c = e(c, "click", g.hitch(this, this._onSaveBtnClick, b, f))),
              this._temporaryData.eventHandles.push(c));
            c = f.addButton(
              this.nls.close,
              "close-button related-record",
              "before"
            );
            c = e(c, "click", g.hitch(this, this._onCloseBtnClick));
            this._temporaryData.eventHandles.push(c);
            h &&
              ((c = e(f, "delete", g.hitch(this, this._onDeleteBtnClick, b))),
              this._temporaryData.eventHandles.push(c));
            c = e(
              f,
              "attribute-change",
              g.hitch(this, this._onAttributeChange, b)
            );
            this._temporaryData.eventHandles.push(c);
            return f;
          },
          _findTableInfoFromTableInfosParam: function(a) {
            var b = null;
            h.some(
              this.tableInfosParam,
              function(c) {
                if (c.featureLayer.id === a.id) return (b = c), !0;
              },
              this
            );
            return b;
          },
          _keepReferentialIntegrity: function(b) {
            var c = this._getOriRelationshipByDestLayer(b),
              d = this._getDestRelationshipByDestLayer(b),
              e,
              g,
              f = {
                key: "",
                value: "",
                hasRelationshipTable: !1,
                originKeyFieldInRelationshipTable: "",
                originValueInRelationshipTable: "",
                destKeyFieldInRelationshipTable: "",
                destValueInRelationshipTable: ""
              };
            c.keyField && d && d.keyField
              ? ((e = a.ignoreCaseToGetFieldKey(
                  b.oriJimuLayerInfo.layerObject,
                  c.keyField
                )),
                (g = a.ignoreCaseToGetFieldKey(
                  b.destJimuLayerInfo.layerObject,
                  d.keyField
                )),
                e && g && ((f.key = g), (f.value = b.feature.attributes[e])))
              : c.keyField &&
                (e = a.ignoreCaseToGetFieldKey(
                  b.oriJimuLayerInfo.layerObject,
                  c.keyField
                )) &&
                ((f.key = e), (f.value = b.feature.attributes[e]));
            c &&
              null != c.relationshipTableId &&
              d &&
              null != d.relationshipTableId &&
              ((f.hasRelationshipTable = !0),
              (f.originKeyFieldInRelationshipTable =
                c.keyFieldInRelationshipTable),
              (f.destKeyFieldInRelationshipTable =
                d.keyFieldInRelationshipTable),
              (f.originValueInRelationshipTable = b.feature.attributes[e]),
              b.relatedFeature &&
                (f.destValueInRelationshipTable =
                  b.relatedFeature.attributes[g || e]));
            return f;
          },
          _prepareNewRelatedRecord: function(a) {
            var b = this._getTemplateFromLayerObject(
                a.destJimuLayerInfo.layerObject
              ),
              b = g.mixin({}, b ? b.prototype.attributes : {});
            a = this._keepReferentialIntegrity(a);
            a.hasRelationshipTable || (b[a.key] = a.value);
            return new t(null, null, b, null);
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
              (d[a.destKeyFieldInRelationshipTable] =
                a.destValueInRelationshipTable),
              (c = new t(null, null, d, null)));
            return c;
          },
          _prepareRelationshipTableInfo: function(a) {
            var b = this._getOriRelationshipByDestLayer(a).relationshipTableId,
              c = null;
            if (null == b) return null;
            a = a.oriJimuLayerInfo.layerObject;
            var d = a.url.lastIndexOf("/"),
              e = a.url.slice(0, d) + "/" + b.toString();
            h.some(
              this.tableInfosParam,
              function(a) {
                if (
                  g.getObject("featureLayer.url", !1, a) &&
                  v
                    .removeProtocol(e.toString().toLowerCase())
                    .replace(/\/+/g, "/") ===
                    v
                      .removeProtocol(
                        a.featureLayer.url.toString().toLowerCase()
                      )
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
          _addNewRelationshipReocrd: function(a, c) {
            var d = new b(),
              e = null;
            (a = this._prepareNewRelationshipRecord(c, a)) &&
              (e = this._prepareRelationshipTableInfo(c));
            e && e.layerObject
              ? e.layerObject.applyEdits(
                  [a],
                  null,
                  null,
                  g.hitch(this, function() {
                    d.resolve();
                  }),
                  g.hitch(this, function() {
                    console.warn("Failed to add relationship record.");
                    d.resolve();
                  })
                )
              : d.resolve();
            return d;
          },
          _addNewRelatedRecord: function(a, c) {
            var d = new b(),
              e = c.destJimuLayerInfo.layerObject;
            e.applyEdits(
              [a],
              null,
              null,
              g.hitch(this, function(b) {
                var h = b[0];
                if (h.success && h.objectId) {
                  b = new f();
                  var k = new y(e.url);
                  b.where = e.objectIdField + " \x3d " + h.objectId;
                  b.outFields = ["*"];
                  k.execute(
                    b,
                    g.hitch(this, function(b) {
                      var f = b.features[0];
                      f ||
                        ((a.attributes[e.objectIdField] = h.objectId), (f = a));
                      this._addNewRelationshipReocrd(f, c).then(
                        g.hitch(this, function() {
                          d.resolve(f);
                        })
                      );
                    }),
                    g.hitch(this, function() {
                      d.reject();
                    })
                  );
                } else d.reject();
              }),
              g.hitch(this, function() {
                d.reject();
              })
            );
            return d;
          },
          _deleteRelatedRecord: function(a) {
            var c = new b();
            a.destJimuLayerInfo.layerObject.applyEdits(
              null,
              null,
              [a.relatedFeature],
              g.hitch(this, function() {
                c.resolve();
              }),
              g.hitch(this, function() {
                c.reject();
              })
            );
            return c;
          },
          _updateRelatedRecordOnSave: function(a) {
            this.loading.show();
            this._updateRelatedRecord(a).then(
              g.hitch(this, function() {
                this.loading.hide();
              }),
              g.hitch(this, function() {
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
              g.hitch(this, function() {
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
              g.hitch(this, function() {
                this.loading.hide();
              })
            );
          },
          _updateRelatedRecord: function(a) {
            var c = new b();
            a.destJimuLayerInfo.layerObject.applyEdits(
              null,
              [a.relatedFeature],
              null,
              g.hitch(this, function() {
                c.resolve();
              }),
              g.hitch(this, function() {
                c.reject();
              })
            );
            return c;
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
          _getDisplayTitleFromPopup: function(b, c, e) {
            (b = this._getPopupTemplateWithOnlyDisplayField(b, e))
              ? (c.setInfoTemplate(b),
                this._tempPopup.setFeatures([c]),
                (e =
                  (e = d("td.attrValue", this._tempPopup.domNode)[0]) &&
                  e.innerHTML),
                c.setInfoTemplate(null))
              : (e = a.getAttrByFieldKey(c, e));
            return e;
          },
          _getPopupTemplateWithOnlyDisplayField: function(a, b) {
            a = a._getCustomPopupInfo(a.layerObject, [b]);
            return new B(a);
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
              g.getObject(
                "_wabProperties.originalLayerName",
                !1,
                a.destJimuLayerInfo.layerObject
              ) || a.destJimuLayerInfo.title;
            this._setOperationTitle(b);
            this._clearPage();
            this.loading.show();
            this._getRelatedRecordsByRelatedQuery(a).then(
              g.hitch(this, function(b) {
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
                var d = this._showFieldSelector(a.destJimuLayerInfo);
                h.forEach(
                  b,
                  function(b, c) {
                    b._layer = a.destJimuLayerInfo.layerObject;
                    var f = this._getDisplayTitleOfRelatedRecord(
                      a.destJimuLayerInfo,
                      b,
                      d
                    );
                    c = l.create(
                      "div",
                      {
                        class:
                          "item record-item enable " +
                          (0 === c % 2 ? "oddLine" : "evenLine"),
                        innerHTML: f
                      },
                      this.contentBox
                    );
                    c.relatedRecord = b;
                    c = e(
                      c,
                      "click",
                      g.hitch(this, function() {
                        this._addOperation(E.OPERATION_SHOW_RELATED_RECORDS, a);
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
              e =
                g.getObject("_wabProperties.originalLayerName", !1, c) ||
                a.destJimuLayerInfo.title,
              c = g.getObject(
                "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
                !1,
                c
              ),
              h = this._getDisplayTitleOfRelatedRecord(
                a.destJimuLayerInfo,
                a.relatedFeature,
                c
              );
            "popupTitle" !== c && (h = e + ": " + h);
            this._setOperationTitle(h);
            this._clearPage();
            (h = this._createATI(a)) && l.place(h.domNode, this.contentBox);
            e = a.destJimuLayerInfo.layerObject.objectIdField;
            c = a.relatedFeature.attributes[e];
            null === c || void 0 === c
              ? (a.destJimuLayerInfo.layerObject.clearSelection(),
                h.showFeature(
                  a.relatedFeature,
                  a.destJimuLayerInfo.layerObject
                ),
                (b = !0),
                d(".atiButton.atiDeleteButton", h.domNode).addClass("disable"),
                this._editWidget._startEditingSession())
              : (this.loading.show(),
                (h = new f()),
                (h.where = e + " \x3d " + c),
                a.destJimuLayerInfo.layerObject.selectFeatures(
                  h,
                  r.SELECTION_NEW,
                  g.hitch(this, function() {
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
          showRelatedTables: function(a, c, d) {
            this._getRelatedTableInfoArray(a.oriJimuLayerInfo).then(
              g.hitch(this, function(f) {
                0 < f.length &&
                  this._setTitle(window.jimuNls.popup.relatedTables);
                var k = {};
                h.forEach(
                  f,
                  function(a) {
                    void 0 === k[a.id] ? (k[a.id] = 0) : k[a.id]++;
                  },
                  this
                );
                var m = {};
                h.forEach(
                  f,
                  function(f, h) {
                    void 0 === m[f.id] ? (m[f.id] = 0) : m[f.id]++;
                    var n =
                      '\x3cdiv title\x3d"' +
                      f.title +
                      '"\x3e' +
                      f.title +
                      "\x3c/div\x3e";
                    h = l.create(
                      "div",
                      {
                        class:
                          "item table-item " +
                          (0 === h % 2 ? "oddLine " : "evenLine ") +
                          (d ? "disable " : "enable "),
                        innerHTML: n
                      },
                      this.contentBox
                    );
                    var p = m[f.id];
                    if (0 < k[f.id]) {
                      var q = a.oriJimuLayerInfo.getOriRelationshipByDestLayer(
                          a.oriJimuLayerInfo.layerObject,
                          f.layerObject,
                          p
                        ),
                        q = q.name || q.id;
                      h.innerHTML =
                        n +
                        ('\x3cdiv class\x3d"relationshipName" title\x3d"' +
                          q +
                          '"\x3e(' +
                          q +
                          ")\x3c/div\x3e");
                    }
                    d ||
                      ((n = e(
                        h,
                        "click",
                        g.hitch(this, function() {
                          var d;
                          this._editWidget._configEditor.usingSaveButton
                            ? (d = this._editWidget._popupConfirmDialog())
                            : ((d = new b()), d.resolve(!0));
                          d.then(
                            g.hitch(this, function(b) {
                              b &&
                                f.getLayerObject().then(
                                  g.hitch(this, function() {
                                    c
                                      ? this._addOperation(
                                          E.OPERATION_SHOW_INSPECTOR,
                                          c
                                        )
                                      : this._addOperation(
                                          E.OPERATION_FIRST,
                                          a
                                        );
                                    this.showRelatedRecords(
                                      this._createOperationData(
                                        a.feature,
                                        a.oriJimuLayerInfo,
                                        f,
                                        null,
                                        p
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
              (h.forEach(
                this._editWidget._jimuLayerInfos.getLayerInfoArray(),
                function(a) {
                  a.layerObject &&
                    a.layerObject.clearSelection &&
                    a.id !== this.originalJimuLayerInfo.id &&
                    w.getInstance().clearSelection(a.layerObject);
                },
                this
              ),
              this.originalFeature.setSymbol(
                this.originalLayer.getSelectionSymbol()
              ),
              this._activeGraphicEdit(this.originalFeature));
          },
          _activeGraphicEdit: function(a, b) {
            b &&
              (b.id === this.originalJimuLayerInfo.id
                ? this.originalFeature.setSymbol(null, !0)
                : w.getInstance().clearSelection(b.layerObject));
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
            this.undoManager.add(new E.Operation(a, b, this));
          },
          _onPreviouBtnClick: function() {
            var a;
            this._editWidget._configEditor.usingSaveButton
              ? (a = this._editWidget._popupConfirmDialog())
              : ((a = new b()), a.resolve(!0));
            a.then(
              g.hitch(this, function(a) {
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
              ? (this._addOperation(E.OPERATION_SHOW_RELATED_RECORDS, a),
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
                  g.hitch(this, function(b) {
                    this.loading.hide();
                    this._addOperation(E.OPERATION_SHOW_RELATED_RECORDS, a);
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
                  g.hitch(this, function() {
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
                g.hitch(this, function() {
                  this.loading.hide();
                  this._onPreviouBtnClick();
                }),
                g.hitch(this, function() {
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
                    g.hitch(this, function(b) {
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
                    g.hitch(this, function() {
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
            l.empty(this.contentBox);
            l.setStyle(this.addNewBtn, "display", "none");
            h.forEach(
              this._temporaryData.eventHandles,
              function(a) {
                a && a.remove && a.remove();
              },
              this
            );
            this._temporaryData.eventHandles = [];
            h.forEach(
              this._temporaryData.dijits,
              function(a) {
                a && a.destroy && a.destroy();
              },
              this
            );
            this._temporaryData.dijits = [];
          },
          _changeRefDomNode: function() {
            l.setStyle(this.refDomNode, "display", "none");
            l.setStyle(this.operationBox, "display", "block");
            l.addClass(this.domNode, "fix-height-mode");
            this.previouBtn.title = window.jimuNls.common.back;
            this.addNewBtn.title = window.jimuNls.common.newText;
            this.undoManager.peekUndo()
              ? l.setStyle(this.previouBtn, "display", "block")
              : l.setStyle(this.previouBtn, "display", "none");
          },
          _revertRefDomNode: function() {
            l.setStyle(this.refDomNode, "display", "block");
            l.setStyle(this.operationBox, "display", "none");
            l.removeClass(this.domNode, "fix-height-mode");
          },
          _showAddNewBtn: function(b) {
            var c = b.destJimuLayerInfo.layerObject,
              d = this._findTableInfoFromTableInfosParam(b.destJimuLayerInfo);
            a.getEditCapabilities &&
              a.getEditCapabilities(c, d).canCreate &&
              (l.setStyle(this.addNewBtn, "display", "block"),
              (b = e(
                this.addNewBtn,
                "click",
                g.hitch(this, this._onAddNewBtnClick, b)
              )),
              this._temporaryData.eventHandles.push(b));
          },
          _hideAddNewBtn: function() {
            l.setStyle(this.addNewBtn, "display", "none");
          },
          _setTitle: function(a, b) {
            a &&
              l.create(
                "div",
                { class: "title-box " + (b ? b : ""), innerHTML: a },
                this.contentBox
              );
          },
          _setOperationTitle: function(a) {
            l.setAttr(this.operationTitle, "innerHTML", a);
            l.setAttr(this.operationTitle, "title", a);
          },
          _showFieldSelector: function(b) {
            var c = "objecid",
              f = d(".title-box", this.contentBox)[0],
              k = b.layerObject,
              l = [];
            if (!f || !b) return c;
            var m = b.getPopupInfo();
            m &&
              m.title &&
              l.push({
                label: window.jimuNls.popup.saveAsPopupTitle,
                value: "popupTitle"
              });
            var n = this._findTableInfoFromTableInfosParam(b);
            n &&
              n.fieldInfos &&
              h.forEach(n.fieldInfos, function(a) {
                "globalid" !== a.fieldName.toLowerCase() &&
                  "shape" !== a.fieldName.toLowerCase() &&
                  l.push({ label: a.label || a.fieldName, value: a.fieldName });
              });
            f = new H({ items: l }).placeAt(f);
            f.domNode.title = window.jimuNls.popup.chooseFieldTip;
            var n = g.getObject(
                "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
                !1,
                k
              ),
              p = a.ignoreCaseToGetFieldObject(
                b.layerObject,
                b.layerObject.displayField || b.layerObject.objectIdField
              ),
              q = z.getInstance().getAppConfig();
            n
              ? (c = n)
              : "2.3" === q.configWabVersion && p && p.name
              ? (c = p.name)
              : m && m.title
              ? (c = "popupTitle")
              : p && p.name
              ? (c = p.name)
              : 0 < l.length && (c = l[0].value);
            c &&
              (f.setHighlightValue(c),
              g.setObject(
                "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
                c,
                k
              ));
            this._temporaryData.dijits.push(f);
            b = e(
              f,
              "click-item",
              g.hitch(
                this,
                function(a, b) {
                  d(".item.record-item", this.contentBox).forEach(
                    g.hitch(this, function(c) {
                      g.setObject(
                        "_wabProperties.popupInfo.displayFieldOfRelatedRecordList",
                        b,
                        k
                      );
                      var d = this._getDisplayTitleOfRelatedRecord(
                        a,
                        c.relatedRecord,
                        b
                      );
                      c.innerHTML = d;
                    })
                  );
                },
                b
              )
            );
            this._temporaryData.eventHandles.push(b);
            return c;
          }
        });
        E.Operation = n([q], {
          constructor: function(a, b, c) {
            this.operationName = a;
            this.operationData = b;
            this.relatedRecordsEditor = c;
          },
          performUndo: function() {
            switch (this.operationName) {
              case E.OPERATION_SHOW_RELATED_TABLES:
                return this.relatedRecordsEditor.showRelatedTables(
                  this.operationData
                );
              case E.OPERATION_SHOW_RELATED_RECORDS:
                return this.relatedRecordsEditor.showRelatedRecords(
                  this.operationData
                );
              case E.OPERATION_SHOW_INSPECTOR:
                return this.relatedRecordsEditor.showInspector(
                  this.operationData
                );
              default:
                return this.relatedRecordsEditor.showFirstPage(
                  this.operationData,
                  !0
                );
            }
          }
        });
        E.ATI = n([C], {
          constructor: function() {
            this._aiConnects = [];
            this._selection = [];
            this._toolTips = [];
          },
          addButton: function(a, b, c) {
            c = c ? c : "before";
            a = new m({ label: a, class: " atiButton " + b }, l.create("div"));
            l.place(a.domNode, this.deleteBtn.domNode, c);
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
        g.mixin(E, {
          OPERATION_SHOW_RELATED_TABLES: "showRelatedTables",
          OPERATION_SHOW_RELATED_RECORDS: "showRelatedRecords",
          OPERATION_SHOW_INSPECTOR: "showInspector",
          OPERATION_FIRST: "first"
        });
        return E;
      });
    },
    "widgets/Edit/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:dijit/templates/ProgressBar.html":
      '\x3cdiv class\x3d"dijitProgressBar dijitProgressBarEmpty" role\x3d"progressbar"\r\n\t\x3e\x3cdiv  data-dojo-attach-point\x3d"internalProgress" class\x3d"dijitProgressBarFull"\r\n\t\t\x3e\x3cdiv class\x3d"dijitProgressBarTile" role\x3d"presentation"\x3e\x3c/div\r\n\t\t\x3e\x3cspan style\x3d"visibility:hidden"\x3e\x26#160;\x3c/span\r\n\t\x3e\x3c/div\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"labelNode" class\x3d"dijitProgressBarLabel" id\x3d"${id}_label"\x3e\x3c/div\r\n\t\x3e\x3cspan data-dojo-attach-point\x3d"indeterminateHighContrastImage"\r\n\t\t   class\x3d"dijitInline dijitProgressBarIndeterminateHighContrastImage"\x3e\x3c/span\r\n\x3e\x3c/div\x3e\r\n',
    "url:esri/dijit/editing/templates/AttachmentEditor.html":
      "\x3cdiv class\x3d\"attachmentEditor\"\x3e\r\n    \x3cbr /\x3e\r\n    \x3cdiv\x3e\r\n        \x3cb\x3e${NLS_attachments}\x3c/b\x3e\r\n        \x3chr /\x3e\r\n        \x3cdiv dojoAttachPoint\x3d\"_attachmentError\" style\x3d'color:red;display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e\r\n        \x3cspan dojoAttachPoint\x3d'_attachmentList' style\x3d'word-wrap: break-word;'\x3e\x3c/span\x3e\r\n        \x3cbr\x3e\x3cbr\x3e\r\n        \x3cdiv data-dojo-type\x3d\"dijit/ProgressBar\" dojoAttachPoint\x3d\"_attachmentProgress\" indeterminate\x3d\"true\" style\x3d'display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e        \r\n        \x3cform dojoAttachPoint\x3d'_uploadForm'\x3e ${NLS_add}:\x26nbsp;\x26nbsp;\x3cinput type\x3d'file' name\x3d'attachment' dojoAttachPoint\x3d'_uploadField' /\x3e \x3c/form\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e",
    "url:esri/dijit/templates/AttributeInspector.html":
      '\x3cdiv class\x3d"esriAttributeInspector"\x3e\r\n    \x3cdiv class\x3d"atiLayerName" dojoAttachPoint\x3d"layerName"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiAttributes" dojoAttachPoint\x3d"attributeTable"\x3e\x3c/div\x3e\r\n    \x3cdiv dojoAttachPoint\x3d"attachmentEditor"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiEditorTrackingInfo" dojoAttachPoint\x3d"editorTrackingInfoDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiButtons" dojoAttachPoint\x3d"editButtons"\x3e\r\n        \x3cbutton  dojoType\x3d"dijit.form.Button" class\x3d"atiButton atiDeleteButton"  dojoAttachPoint\x3d"deleteBtn" dojoAttachEvent\x3d"onClick: onDeleteBtn" showLabel\x3d"true" type\x3d"button"\x3e${NLS_deleteFeature}\x3c/button\x3e\r\n        \x3cdiv class\x3d"atiNavButtons" dojoAttachPoint\x3d"navButtons"\x3e\r\n            \x3cdiv class\x3d"atiNavMessage" dojoAttachPoint\x3d"navMessage"\x3e\x3c/div\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiFirstIcon" dojoAttachPoint\x3d"firstFeatureButton" dojoAttachEvent\x3d"onClick: onFirstFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_first}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiPrevIcon" dojoAttachPoint\x3d"prevFeatureButton" dojoAttachEvent\x3d"onClick: onPreviousFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_previous}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiNextIcon" dojoAttachPoint\x3d"nextFeatureButton" dojoAttachEvent\x3d"onClick: onNextFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_next}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiLastIcon" dojoAttachPoint\x3d"lastFeatureButton" dojoAttachEvent\x3d"onClick: onLastFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_last}\x3c/button\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:dojox/grid/resources/View.html":
      '\x3cdiv class\x3d"dojoxGridView" role\x3d"presentation"\x3e\r\n\t\x3cdiv class\x3d"dojoxGridHeader" dojoAttachPoint\x3d"headerNode" role\x3d"presentation"\x3e\r\n\t\t\x3cdiv dojoAttachPoint\x3d"headerNodeContainer" style\x3d"width:9000em" role\x3d"presentation"\x3e\r\n\t\t\t\x3cdiv dojoAttachPoint\x3d"headerContentNode" role\x3d"row"\x3e\x3c/div\x3e\r\n\t\t\x3c/div\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cinput type\x3d"checkbox" class\x3d"dojoxGridHiddenFocus" dojoAttachPoint\x3d"hiddenFocusNode" aria-hidden\x3d"true" /\x3e\r\n\t\x3cinput type\x3d"checkbox" class\x3d"dojoxGridHiddenFocus" aria-hidden\x3d"true" /\x3e\r\n\t\x3cdiv class\x3d"dojoxGridScrollbox" dojoAttachPoint\x3d"scrollboxNode" role\x3d"presentation"\x3e\r\n\t\t\x3cdiv class\x3d"dojoxGridContent" dojoAttachPoint\x3d"contentNode" hidefocus\x3d"hidefocus" role\x3d"presentation"\x3e\x3c/div\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:dojox/grid/resources/_Grid.html":
      '\x3cdiv hidefocus\x3d"hidefocus" role\x3d"grid" dojoAttachEvent\x3d"onmouseout:_mouseOut"\x3e\r\n\t\x3cdiv class\x3d"dojoxGridMasterHeader" dojoAttachPoint\x3d"viewsHeaderNode" role\x3d"presentation"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"dojoxGridMasterView" dojoAttachPoint\x3d"viewsNode" role\x3d"presentation"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"dojoxGridMasterMessages" style\x3d"display: none;" dojoAttachPoint\x3d"messagesNode"\x3e\x3c/div\x3e\r\n\t\x3cspan dojoAttachPoint\x3d"lastFocusNode" tabindex\x3d"0"\x3e\x3c/span\x3e\r\n\x3c/div\x3e\r\n',
    "url:esri/dijit/editing/templates/TemplatePicker.html":
      '\x3cdiv class\x3d"templatePicker"\x3e\r\n\r\n  \x3ctable dojoType\x3d"dojox.grid.DataGrid" noDataMessage\x3d"${emptyMessage}" selectionMode\x3d"none" autoHeight\x3d"${_rows}" autoWidth\x3d"${_autoWidth}"\r\n         query\x3d"{ query: \'*\' }" dojoAttachPoint\x3d"grid" class\x3d"grid"\x3e\r\n  \x3c/table\x3e\r\n  \r\n\x3c/div\x3e',
    "url:esri/dijit/editing/templates/Editor.html":
      '\x3cdiv class\x3d"esriEditor"\x3e\r\n    \x3cdiv class\x3d"esriTemplatePicker" dojoAttachPoint\x3d"templatePickerDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"esriDrawingToolbar" dojoAttachPoint\x3d"drawingToolbarDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"progressBar" dojoAttachPoint\x3d"progressBar" indeterminate\x3d"true" dojoType\x3d"dijit.ProgressBar" /\x3e\r\n\x3c/div\x3e',
    "url:widgets/Edit/Widget.html":
      '\x3cdiv style\x3d"width:100%; height:100%; min-width:280px;min-width:240px;"\x3e\r\n  \x3cdiv class\x3d"edit-related-graphic-part disable" data-dojo-attach-point\x3d"editRelatedGraphicPart"\x3e\r\n    \x3cdiv class\x3d"title"\x3e${nls.editRelatedFeature}\x3c/div\x3e\r\n    \x3cdiv class\x3d"btn" data-dojo-attach-event\x3d"click:_stopEditingRelatedGraphic"\x3e${nls.done}\x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"editWidgetTitle"\x3e\r\n    ${nls.title}\x3cbr\x3e\x3cbr\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/Edit/css/style.css":
      '.jimu-widget-edit-infoWindow .related-records-editor {}.jimu-widget-edit-infoWindow .related-records-editor.fix-height-mode{height: 235px;}.jimu-widget-edit-infoWindow.esriPopupMaximized .related-records-editor.fix-height-mode{height: 100%;}.jimu-widget-edit-infoWindow .related-records-editor .operation-box {border-bottom: 1px solid #DDDDDD; height: 28px; line-height: 18px; text-align: center; position: absolute; left: 0; right: 0; font-family: "Avenir Heavy"; font-size: 16px;}.jimu-widget-edit-infoWindow .related-records-editor .previos-btn{float: left; cursor: pointer; height: 100%; line-height: 17px; margin-left: 20px;}.jimu-rtl .jimu-widget-edit-infoWindow .related-records-editor .previos-btn{float: right; margin-right: 20px; margin-left: auto;}.jimu-widget-edit-infoWindow .related-records-editor .operation-title{display: inline-block; max-width: 80%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}.jimu-widget-edit-infoWindow .related-records-editor .add-new-btn{display: none; float: right; cursor: pointer; margin-right: 20px; background-image: url("images/add_normal.svg"); background-repeat: no-repeat; width: 16px; height: 16px;}.jimu-rtl .jimu-widget-edit-infoWindow .related-records-editor .add-new-btn{float: left; margin-right: auto; margin-left: 20px;}.jimu-widget-edit-infoWindow .related-records-editor .add-new-btn:hover{background-image: url("images/add_hover.svg");}.jimu-widget-edit-infoWindow .related-records-editor.fix-height-mode .content-box{position: absolute; top: 45px; bottom: 0; left: 10px; right: 0px; overflow-y: auto; overflow-x: hidden;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .title-box{font-family: "Avenir Heavy"; height: 34px; line-height: 34px; padding-left: 10px; padding-right: 10px;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .title-box.font-normal{font-weight: normal; color: #666666;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item{position: relative; min-height: 30px; line-height: 30px; width: 100%; background-color: #ffffff; color: #000000; padding-left: 10px; padding-right: 30px; background-image: url("images/edit_default.svg"); background-repeat: no-repeat; background-position: right 10px center; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item div{white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item .relationshipName{opacity: 0.5;}.jimu-rtl .jimu-widget-edit-infoWindow .related-records-editor .content-box .item{background-position: left 10px center; padding-left: 30px; padding-right: 10px;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item.disable{opacity: 0.4;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item.oddLine{background-color: #f3f3f3;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item.enable:hover{cursor: pointer; border-color: rgba(0, 0, 0, 1.0); font-family: "Avenir Heavy"; background-image: url("images/edit_hover.svg");}.jimu-widget-edit-infoWindow .related-records-editor .content-box .item .edit-icon{position: absolute; right: 5px; top: 7px;}.jimu-rtl .jimu-widget-edit-infoWindow .related-records-editor .content-box .item .edit-icon{right: auto; left: 10px;}.jimu-widget-edit-infoWindow .related-records-editor .esriAttributeInspector{padding-right: 2px;}.jimu-widget-edit-infoWindow .related-records-editor .esriAttributeInspector .atiLayerName{display: none;}.jimu-widget-edit-infoWindow .related-records-editor .content-box .title-box .jimu-dijit-dropdownmenu{float: right; right: 2px; top: 6px;}.jimu-rtl .jimu-widget-edit-infoWindow .related-records-editor .content-box .title-box .jimu-dijit-dropdownmenu{float: left; left: 2px; right: auto;}.jimu-widget-edit-infoWindow .related-records-editor .esriAttributeInspector .atiButton.atiDeleteButton.hidden{display: none !important;}.jimu-widget-FilterEditor {}.jimu-widget-FilterEditor .flDropDown {width: 100%; -webkit-appearance: menulist-button; height: 30px; border-radius: 4px; border: 1px solid #b9b9b9; color: #838383; margin-top: 2px; margin-bottom: 10px;}.jimu-widget-FilterEditor .searchtextbox {border: 1px solid #b9b9b9; color: #838383; width: 100%; padding: 5px; margin-bottom: 1px; border-radius: 4px 4px 0px 0px;}.jimu-widget-FilterEditor .searchtextbox:focus {border: 1px solid #838383;}.jimu-widget-FilterEditor .searchtextbox:hover {border: 1px solid #838383;}.jimu-widget-FilterEditor .jimu-input {font-size: 12px; height: auto;}.jimu-widget-edit {position: relative;}.jimu-widget-edit .edit-related-graphic-part{overflow: hidden; font-size: 14px;}.jimu-widget-edit .edit-related-graphic-part.disable{display: none;}.jimu-widget-edit .edit-related-graphic-part .title{float: left; max-width: 220px; height: 40px; line-height: 14px; padding-top: 5px;}.jimu-rtl .jimu-widget-edit .edit-related-graphic-part .title{float: right;}.jimu-widget-edit .edit-related-graphic-part .btn{float: right; min-width: 90px; max-width: 110px; cursor: pointer; background-color: #009966; color: #ffffff; height: 30px; line-height: 30px; text-align: center;}.jimu-rtl .jimu-widget-edit .edit-related-graphic-part .btn{float: left;}.jimu-widget-edit .templatePicker {position: absolute; width: 100%; bottom: 53px;}.jimu-widget-edit .dojoxGridRow {border: 0;}.jimu-widget-edit .dojoxGridScrollbox {overflow-x: hidden;}.jimu-widget-edit .templatePicker .grid .dojoxGridCell {border: 0px solid #FFFFFF;}.jimu-widget-edit .esriEditor {position: absolute; bottom: 0; height: 30px; width: 100%;}.jimu-widget-edit .esriDrawingToolbar {position: absolute; right: 0; left: 0; bottom: 0; min-height: 50px;}.jimu-widget-edit-infoWindow .esriAttributeInspector {width: 100%;}.jimu-widget-edit-infoWindow .esriAttributeInspector .atiAttributes table {width: 100%;}.jimu-widget-edit-infoWindow .esriAttributeInspector .atiLabel {}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitTextBox {width: 100%; border-color: #dddddd; margin: 3px auto;}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitInputField {}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitTextBox .dijitInputInner {}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitTextBoxFocused {border-color: #afafaf !important; box-shadow: 0 0 0 #ffffff !important;}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitTextBoxHover{background-color: #ffffff; background-image: none; border-color: #afafaf !important;}.jimu-widget-edit-infoWindow .esriAttributeInspector .atiRichTextField{}.jimu-widget-edit-infoWindow .esriAttributeInspector div.dijitEditorIFrameContainer {height: 78px;}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitTextBox.dijitTextArea {height: 32px;}.jimu-widget-edit-infoWindow .esriAttributeInspector .atiButtons {padding-top: 10px; height: 35px;}.jimu-widget-edit-infoWindow .esriAttributeInspector .atiButton {margin: 0 0 0 10px; float: none; width: auto; float: right;}.jimu-rtl .jimu-widget-edit-infoWindow .esriAttributeInspector .atiButton {margin: 0 10px 0 0px; float: left;}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitButtonNode{border: 1px solid #979797; color: #000000; border-radius: 0px; background-color: #ffffff; background-image: none;}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitButtonText{height: 22px; min-width: 60px; line-height: 22px;}.jimu-widget-edit-infoWindow .esriAttributeInspector .dijitButtonNode:hover{border: 1px solid #555555; font-family: "Avenir Heavy";}.jimu-widget-edit-infoWindow .esriAttributeInspector .atiButton.disable .dijitButtonNode{border: 1px solid #ccc; color: #ccc; font-family: "inherit";}.jimu-widget-edit-infoWindow .jimu-popup{}.jimu-widget-edit-infoWindow .jimu-popup .title{display: none;}.jimu-widget-edit-infoWindow .jimu-popup .content{line-height: 16px;}.jimu-widget-edit-infoWindow .jimu-popup .jimu-btn{border: 1px solid #979797; color: #000000; border-radius: 0px; background-color: #ffffff; background-image: none; line-height: 27px;}.jimu-widget-edit-infoWindow .jimu-popup .jimu-btn:hover{border: 1px solid #555555; font-family: "Avenir Heavy";}',
    "*now": function(n) {
      n([
        'dojo/i18n!*preload*widgets/Edit/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/i18n!esri/nls/jsapi dojo/on dojo/query dojo/json dojo/Deferred dojo/aspect dojo/promise/all dijit/_WidgetsInTemplateMixin jimu/BaseWidget jimu/MapManager jimu/PanelManager jimu/LayerInfos/LayerInfos jimu/dijit/LoadingIndicator jimu/dijit/Popup jimu/portalUrlUtils jimu/SelectionManager jimu/Role esri/dijit/editing/Editor esri/dijit/editing/Util esri/dijit/Popup esri/dijit/editing/TemplatePicker esri/geometry/Extent esri/geometry/Point esri/symbols/SimpleMarkerSymbol esri/renderers/jsonUtils esri/renderers/SimpleRenderer esri/graphic esri/domUtils esri/tasks/query esri/tasks/QueryTask dijit/form/Button ./utils ./FilterEditor ./RelatedRecordsEditor".split(
  " "
), function(
  n,
  g,
  h,
  l,
  e,
  b,
  d,
  a,
  m,
  k,
  c,
  p,
  q,
  t,
  f,
  y,
  u,
  r,
  C,
  x,
  B,
  v,
  w,
  z,
  H,
  D,
  G,
  E,
  J,
  F,
  A,
  K,
  L,
  P,
  Q,
  M,
  O,
  R
) {
  var I = n([q, p], {
    name: "Edit",
    baseClass: "jimu-widget-edit",
    editor: null,
    _defaultStartStr: "",
    _defaultAddPointStr: "",
    _mapInfoStorage: null,
    _jimuLayerInfos: null,
    editPopup: null,
    _configEditor: null,
    _layerObjectsParaForTempaltePicker: null,
    _createOverDef: null,
    _releaseEventArrayAfterActive: null,
    _releaseEventArrayAfterClose: null,
    _releaseEventArrayAfterDestory: null,
    _canCreateLayersAreAllInvisibleFlag: null,
    _layerInfoParamArrayUseForRervertRenderre: null,
    layerInfosParam: null,
    tableInfosParam: null,
    layerInfosParamClone: null,
    tableInfosParamClone: null,
    _tableInfoParamDef: null,
    _hasEditPrivilege: null,
    _panelManager: null,
    _originalCloasePanel: null,
    _changedTemplatesOfTemplatePicker: null,
    _releaseEventArrayAfterEditingRelatedGraphic: null,
    _isInEditingRelatedGraphicSession: null,
    _needToRequeryFeatureArray: null,
    _isEditableLayerStore: null,
    _layerInfosInConfig: null,
    _settingsParam: null,
    _temporaryDataForEditingRelatedGraphicSession: null,
    _layerInfosChangedWhenEditingSessionFlag: null,
    postMixInProperties: function() {
      this.nls.done = window.jimuNls.common.done;
    },
    startup: function() {
      this.inherited(arguments);
      this.editPopup = new I.EditPopup(
        null,
        l.create(
          "div",
          { class: "jimu-widget-edit-infoWindow" },
          null,
          this.map.root
        )
      );
      this.loading = new u({ hidden: !0 });
      this.loading.placeAt(this.domNode);
      this._prepareCreating();
    },
    destroy: function() {
      this._worksAfterDestory();
      this.inherited(arguments);
    },
    onOpen: function() {
      "active" !== this.state && this.widgetManager.activateWidget(this);
      this.editor &&
        this._settingsParam &&
        (this._changeToServiceRenderer(this._settingsParam),
        this._onLayerInfosChanged());
      this._bindEventAfterOpen();
    },
    onClose: function() {
      this._revertToLayerRenderer();
      this._releaseEventAfterClose();
    },
    _prepareCreating: function() {
      this._init();
      this.loading.show();
      this._asyncPrepareDataAtStart().then(
        g.hitch(this, function() {
          var a;
          "BoxTheme" === this.appConfig.theme.name
            ? ((a = 1050), this.loading.show())
            : (a = 1);
          setTimeout(
            g.hitch(this, function() {
              this.loading.hidden || this.loading.hide();
              this.widgetManager.activateWidget(this);
              this._createEditor();
            }),
            a
          );
          this._getTableInfosParam().then(
            g.hitch(this, function(a) {
              this.tableInfosParam = a;
              this.tableInfosParamClone = this._cloneLayerOrTableInfosParam(
                this.tableInfosParam
              );
              this._tableInfoParamDef.resolve();
            })
          );
          this.loading.hide();
        }),
        g.hitch(this, function() {
          this.loading.hide();
        })
      );
    },
    _init: function() {
      this._mapInfoStorage = {
        resetInfoWindow: null,
        snappingTolerance: null,
        editorATIonLayerSelectionChange: null
      };
      this._editorMapClickHandlers = [];
      this._layerObjectsParaForTempaltePicker = [];
      this._configEditor = g.clone(this.config.editor);
      this._releaseEventArrayAfterActive = [];
      this._releaseEventArrayAfterClose = [];
      this._releaseEventArrayAfterDestory = [];
      this._canCreateLayersAreAllInvisibleFlag = !1;
      this._layerInfoParamArrayUseForRervertRenderre = [];
      this._createOverDef = new m();
      this._tableInfoParamDef = new m();
      this._hasEditPrivilege = !0;
      this._panelManager = f.getInstance();
      this._changedTemplatesOfTemplatePicker = [];
      this._releaseEventArrayAfterEditingRelatedGraphic = [];
      this._isInEditingRelatedGraphicSession = !1;
      this._needToRequeryFeatureArray = [];
      this._jimuLayerInfos = y.getInstanceSync(this.map, this.map.itemInfo);
      this._isEditableLayerStore = {};
      this._layerInfosInConfig = this._getLayerInfosInConfig();
      this._temporaryDataForEditingRelatedGraphicSession = {};
      this._layerInfosChangedWhenEditingSessionFlag = !1;
    },
    _initEditPrivilege: function(a) {
      this._hasEditPrivilege = !0;
      if (a) {
        var b = new B({ id: a.roleId ? a.roleId : a.role, role: a.role });
        a.privileges && b.setPrivileges(a.privileges);
        this._hasEditPrivilege = b.canEditFeatures();
      }
      return this._hasEditPrivilege;
    },
    beginEditingByFeatures: function(a, b) {
      if (b) {
        var c = null,
          d = a[0],
          e =
            (d && d.geometry) ||
            (b._wabProperties &&
              b._wabProperties.popupInfo.originalFeature.geometry);
        e && (c = "point" === e.type ? e : e.getExtent().getCenter());
        this._createOverDef.then(
          g.hitch(this, function() {
            "active" !== this.state && this.widgetManager.activateWidget(this);
            h.forEach(
              this._jimuLayerInfos.getLayerInfoArray(),
              function(a) {
                a.layerObject &&
                  a.layerObject.clearSelection &&
                  x.getInstance().clearSelection(a.layerObject);
              },
              this
            );
            if (d && d.geometry)
              x.getInstance()
                .setSelection(b, a)
                .then(
                  g.hitch(this, function() {
                    var a = b.getSelectedFeatures();
                    this.editor._updatePopupButtons(a);
                    this.editor._onEditFeature(a, c);
                  })
                );
            else {
              this.editPopup.show(c);
              var e = g.getObject(
                  "_wabProperties.popupInfo.originalFeature",
                  !1,
                  b
                ),
                f = g.getObject(
                  "_wabProperties.popupInfo.operationDataForListRelatedRecords",
                  !1,
                  b
                );
              this._createRelatedRecordsEditor(e).then(
                g.hitch(this, function() {
                  !f && d
                    ? this._relatedRecordsEditor.showInspector(
                        this._relatedRecordsEditor._createOperationData(
                          null,
                          null,
                          this._jimuLayerInfos.getTableInfoById(b.id),
                          d
                        )
                      )
                    : this._relatedRecordsEditor.showRelatedRecords(
                        this._relatedRecordsEditor._createOperationData(
                          f.feature,
                          f.oriJimuLayerInfo,
                          f.destJimuLayerInfo
                        )
                      );
                })
              );
            }
          })
        );
      }
    },
    onActive: function() {
      this._hasEditPrivilege &&
        (this.disableWebMapPopup(),
        this._bindEventAfterActive(),
        this._configEditor.usingSaveButton &&
          ((this._originalCloasePanel = this._panelManager.closePanel),
          (this._panelManager.closePanel = this._wrapExistFunctionWithConfirmDialog(
            this._panelManager,
            this._originalCloasePanel
          ))));
    },
    onDeActive: function() {
      this._hasEditPrivilege &&
        (this.enableWebMapPopup(),
        this._releaseEventAfterActive(),
        this.editor &&
          this.editor.templatePicker &&
          this.editor.templatePicker.clearSelection(),
        this._configEditor.usingSaveButton &&
          (this._panelManager.closePanel = this._originalCloasePanel),
        h.forEach(
          this._needToRequeryFeatureArray,
          function(a) {
            this._requeryFeature(a);
          },
          this
        ),
        (this._needToRequeryFeatureArray = []));
    },
    disableWebMapPopup: function() {
      var a = t.getInstance();
      a.disableWebMapPopup();
      this.map.infoWindow.hide();
      this.map.setInfoWindow(this.editPopup);
      this._enableMapClickHandler();
      null === this._mapInfoStorage.resetInfoWindow &&
        ((this._mapInfoStorage.resetInfoWindow = a.resetInfoWindow),
        this.own(
          b(
            this.map.infoWindow,
            "show",
            g.hitch(this, function() {
              window.appInfo.isRunInMobile &&
                (this.map.infoWindow.maximize(),
                setTimeout(
                  g.hitch(this, function() {
                    l.addClass(this.editPopup.domNode, "esriPopupMaximized");
                  }),
                  1
                ));
            })
          )
        ));
      a.resetInfoWindow = g.hitch(this, function() {});
      this.map.snappingManager &&
        void 0 !== this._configEditor.snappingTolerance &&
        ((this._mapInfoStorage.snappingTolerance = this.map.snappingManager.tolerance),
        (this.map.snappingManager.tolerance = this._configEditor.snappingTolerance));
    },
    enableWebMapPopup: function() {
      var a = t.getInstance(),
        b = a.getMapInfoWindow();
      this._mapInfoStorage.resetInfoWindow &&
        (this.map.setInfoWindow(b.bigScreen),
        (a.isMobileInfoWindow = !1),
        (a.resetInfoWindow = g.hitch(a, this._mapInfoStorage.resetInfoWindow)),
        (this._mapInfoStorage.resetInfoWindow = null),
        a.resetInfoWindow(),
        this._disableMapClickHandler(),
        this.editPopup.hide(),
        this._isEditingSession || this.editor._clearSelection(),
        a.enableWebMapPopup());
      this.map.snappingManager &&
        null !== this._mapInfoStorage.snappingTolerance &&
        (this.map.snappingManager.tolerance = this._mapInfoStorage.snappingTolerance);
    },
    _enableMapClickHandler: function() {
      this.editor &&
        (this._editorMapClickHandlers.push(this.editor._mapClickHandler),
        this.editor._enableMapClickHandler(),
        this._editorMapClickHandlers.push(this.editor._mapClickHandler));
    },
    _disableMapClickHandler: function() {
      this.editor &&
        (this.editor._disableMapClickHandler(),
        h.forEach(
          this._editorMapClickHandlers,
          function(a) {
            a && a.remove && a.remove();
          },
          this
        ),
        (this._editorMapClickHandlers = []));
    },
    _cloneLayerOrTableInfosParam: function(a) {
      var b = [];
      h.forEach(
        a,
        function(a) {
          var c = a.featureLayer;
          a.featureLayer = null;
          var d = g.clone(a);
          d.featureLayer = c;
          a.featureLayer = c;
          b.push(d);
        },
        this
      );
      return b;
    },
    _isTemporaryFeatureForAddOnlyMode: function(a) {
      a = a.getLayer();
      this._jimuLayerInfos.getLayerOrTableInfoById(a && a.id);
    },
    _getDefaultFieldInfos: function(a) {
      (a = M.getFieldInfosFromWebmap(a, this._jimuLayerInfos)) &&
        (a = h.filter(a, function(a) {
          return a.visible || a.isEditable;
        }));
      return a;
    },
    _getDefaultLayerInfoById: function(a) {
      var b = { featureLayer: {} };
      b.featureLayer.id = a;
      b.allowCreate = !0;
      b.allowDelete = !0;
      b.disableGeometryUpdate = !1;
      (a = this._getDefaultFieldInfos(a)) && 0 < a.length && (b.fieldInfos = a);
      return b;
    },
    _getDefaultTableInfos: function() {
      var a = [],
        b = this._jimuLayerInfos.getTableInfoArray();
      h.forEach(
        b,
        function(b) {
          b = this._getDefaultLayerInfoById(b.id);
          a.push(b);
        },
        this
      );
      return a;
    },
    _getDefaultLayerInfos: function() {
      for (var a = [], b = this.map.graphicsLayerIds.length - 1; 0 <= b; b--) {
        var c = this.map.getLayer(this.map.graphicsLayerIds[b]);
        "Feature Layer" === c.type &&
          c.url &&
          ((c = this._getDefaultLayerInfoById(c.id)), a.push(c));
      }
      return a;
    },
    _asyncPrepareDataAtStart: function() {
      var a = [];
      h.forEach(
        this._layerInfosInConfig,
        function(b) {
          var c = this._jimuLayerInfos.getLayerInfoByTopLayerId(
            b.featureLayer.id
          );
          c && ((c = c.isEditable()), (c._layerInfoInConfig = b), a.push(c));
        },
        this
      );
      return c(a).then(
        g.hitch(this, function(b) {
          h.forEach(
            b,
            function(b, c) {
              c = a[c]._layerInfoInConfig;
              this._isEditableLayerStore[
                c && c.featureLayer && c.featureLayer.id
              ] = b;
            },
            this
          );
        })
      );
    },
    _getLayerInfosInConfig: function() {
      return this._configEditor.honorSettingOfWebmap
        ? this._getDefaultLayerInfos()
        : this._configEditor.layerInfos
        ? 0 < this._configEditor.layerInfos.length
          ? this._converConfiguredLayerInfos(this._configEditor.layerInfos)
          : this._getDefaultLayerInfos()
        : [];
    },
    _converConfiguredLayerInfos: function(a) {
      function b(a, b) {
        for (var c = null, d = 0; d < a.graphicsLayerIds.length; d++) {
          var e = a.getLayer(a.graphicsLayerIds[d]);
          if (
            e &&
            e.url &&
            C.removeProtocol(e.url.toLowerCase()) ===
              C.removeProtocol(b.toLowerCase())
          ) {
            c = e;
            break;
          }
        }
        return c;
      }
      h.forEach(
        a,
        function(a) {
          if (!a.featureLayer.id && a.featureLayer.url) {
            var c = b(this.map, a.featureLayer.url);
            c && (a.featureLayer.id = c.id);
          }
          var d = [],
            e = M.getFieldInfosFromWebmap(
              a.featureLayer.id,
              this._jimuLayerInfos
            );
          h.forEach(
            a.fieldInfos,
            function(a) {
              var b;
              b = null;
              if (e)
                for (var c = 0; c < e.length; c++)
                  if (a.fieldName === e[c].fieldName) {
                    e[c].label = a.label;
                    e[c].isEditableSettingInWebmap = e[c].isEditable;
                    e[c].isEditable = a.isEditable;
                    b = e[c];
                    break;
                  }
              if (void 0 === a.visible)
                b
                  ? (b.isEditable ||
                      b.isEditableSettingInWebmap ||
                      b.visible) &&
                    d.push(b)
                  : d.push(a);
              else if (a.visible || a.isEditable) b ? d.push(b) : d.push(a);
            },
            this
          );
          0 !== d.length && (a.fieldInfos = d);
        },
        this
      );
      return a;
    },
    _getLayerInfoOrTableInfoParamById: function(a) {
      var b = null;
      h.some(this.layerInfosParam.concat(this.tableInfosParam), function(c) {
        if (c.featureLayer.id === a) return (b = c), !0;
      });
      return b;
    },
    _getLayerInfosParam: function() {
      var a = [];
      h.forEach(
        this._layerInfosInConfig,
        function(b) {
          var c = b.featureLayer.id,
            d = this.map.getLayer(c);
          d &&
            this._isEditableLayerStore[c] &&
            ((b.featureLayer = d), a.push(b));
        },
        this
      );
      this.layerInfosParam = a;
      this.layerInfosParamClone = this._cloneLayerOrTableInfosParam(
        this.layerInfosParam
      );
      return a;
    },
    _setTemplatePickerLayerObjectsParam: function(a) {
      a && (this._layerObjectsParaForTempaltePicker = a);
    },
    _obtainTemplatePickerLayerObjectsParam: function(a) {
      this._layerObjectsParaForTempaltePicker = [];
      var b = [];
      h.forEach(
        this._jimuLayerInfos.getLayerInfoArray(),
        function(c) {
          h.some(
            a,
            function(a) {
              return a.featureLayer && c.id === a.featureLayer.id
                ? (b.push(a), !0)
                : !1;
            },
            this
          );
        },
        this
      );
      h.forEach(
        b,
        function(a) {
          if (a.featureLayer) {
            var b = this._jimuLayerInfos.getLayerInfoByTopLayerId(
              a.featureLayer.id
            );
            b &&
              b.isShowInMap() &&
              b.isInScale() &&
              M.getEditCapabilities(b.layerObject, a).canCreate &&
              this._layerObjectsParaForTempaltePicker.push(a.featureLayer);
            !this._canCreateLayersAreAllInvisibleFlag &&
              this._isEditableLayerStore[a.featureLayer.id] &&
              M.getEditCapabilities(b.layerObject, a).canCreate &&
              !a.featureLayer.visible &&
              (this._canCreateLayersAreAllInvisibleFlag = !0);
          }
        },
        this
      );
      return this._layerObjectsParaForTempaltePicker;
    },
    _getTemplatePicker: function(a) {
      a = this._obtainTemplatePickerLayerObjectsParam(a);
      a = new H(
        {
          featureLayers: a,
          grouping: !0,
          rows: "auto",
          columns: "auto",
          style:
            (this._configEditor.toolbarVisible ? "" : "bottom: 0px") +
            ";" +
            (this._configEditor.useFilterEdit
              ? "top: " + I.TOP_WITH_TEMPLATE_FILTER
              : "top: " + I.TOP)
        },
        l.create("div", {}, this.domNode)
      );
      a.startup();
      return a;
    },
    _getSettingsParam: function() {
      var a = {
          map: this.map,
          createOptions: {
            polygonDrawTools: [
              v.CREATE_TOOL_ARROW,
              v.CREATE_TOOL_AUTOCOMPLETE,
              v.CREATE_TOOL_CIRCLE,
              v.CREATE_TOOL_ELLIPSE,
              v.CREATE_TOOL_RECTANGLE,
              v.CREATE_TOOL_TRIANGLE,
              v.CREATE_TOOL_POLYGON,
              v.CREATE_TOOL_FREEHAND_POLYGON
            ],
            polylineDrawTools: [
              v.CREATE_TOOL_POLYLINE,
              v.CREATE_TOOL_FREEHAND_POLYLINE
            ]
          }
        },
        b;
      for (b in this._configEditor) a[b] = this._configEditor[b];
      a.layerInfos = this._getLayerInfosParam();
      a.templatePicker = this._getTemplatePicker(a.layerInfos);
      void 0 !== this._configEditor.popupTolerance &&
        (a.singleSelectionTolerance = this._configEditor.popupTolerance);
      return a;
    },
    _createEditor: function() {
      var a = { settings: this._getSettingsParam() };
      this._settingsParam = a.settings;
      this._worksBeforeCreate(a.settings);
      this.editor = new v(a, l.create("div", {}, this.domNode));
      this.editor.startup();
      this._worksAfterCreate(a.settings);
    },
    _addButtonToInspector: function() {
      var a = new Q(
        { label: this.nls.close, class: " atiButton close-button" },
        l.create("div")
      );
      l.place(
        a.domNode,
        this.editor.attributeInspector.deleteBtn.domNode,
        "before"
      );
      this.own(
        b(
          a,
          "click",
          g.hitch(this, function() {
            this.editPopup.hide();
          })
        )
      );
      if (this._configEditor.usingSaveButton) {
        a = new Q(
          {
            label: window.jimuNls.common.save,
            class: " atiButton save-button disable"
          },
          l.create("div")
        );
        l.place(
          a.domNode,
          this.editor.attributeInspector.deleteBtn.domNode,
          "after"
        );
        var c = this.editor.attributeInspector;
        this.own(
          b(
            a,
            "click",
            g.hitch(this, function() {
              if (this._isEditingSession) {
                var a =
                    c._currentFeature &&
                    c._currentFeature._wabSetTemporaryAttributes,
                  b = c._currentFeature,
                  d = b && b.getLayer(),
                  e = new A(g.clone(b.toJson()));
                if (d) {
                  for (var f in a)
                    a.hasOwnProperty(f) &&
                      "function" !== typeof a[f] &&
                      (b.attributes[f] = a[f]);
                  a = new A();
                  a.setAttributes(b.attributes);
                  this.editor._applyEdits(
                    [{ layer: d, updates: [a], preUpdates: [e] }],
                    g.hitch(this, function() {
                      this._stopEditingSession();
                    }),
                    !0
                  );
                }
              }
            })
          )
        );
        var d = this;
        c.onAttributeChange = g.hitch(c, function(a, b, e) {
          d._startEditingSession();
          c._currentFeature._wabSetTemporaryAttributes[b] = e;
        });
        this.editPopup.hideWidthConfirmDialog = this._wrapExistFunctionWithConfirmDialog(
          this.editPopup,
          this.editPopup.hideWidthConfirmDialog
        );
        this.editor.attributeInspector.next = this._wrapExistFunctionWithConfirmDialog(
          this.editor.attributeInspector,
          this.editor.attributeInspector.next
        );
        this.editor.attributeInspector.previous = this._wrapExistFunctionWithConfirmDialog(
          this.editor.attributeInspector,
          this.editor.attributeInspector.previous
        );
        this.own(
          k.before(
            this.editor,
            "_deleteFeature",
            g.hitch(this, function() {
              this._configEditor.usingSaveButton && this._stopEditingSession();
            })
          )
        );
      }
    },
    _startEditingSession: function() {
      var a = this.editor.attributeInspector;
      a._currentFeature &&
        !a._currentFeature._wabSetTemporaryAttributes &&
        (a._currentFeature._wabSetTemporaryAttributes = {});
      this._isEditingSession ||
        ((this._isEditingSession = !0),
        this._disableMapClickHandler(),
        (this._temporatyMapClickHandle = b(
          this.map,
          "click",
          g.hitch(this, function() {
            this.editPopup.hide("clear-selection");
          })
        )),
        (window.onbeforeunload = g.hitch(this, function() {
          return "";
        })));
      d(".atiButton.save-button", this.editPopup.domNode).removeClass(
        "disable"
      );
    },
    _stopEditingSession: function() {
      if (this.editor) {
        var a = this.editor.attributeInspector;
        a._currentFeature &&
          a._currentFeature._wabSetTemporaryAttributes &&
          (a._currentFeature._wabSetTemporaryAttributes = null);
        this._isEditingSession &&
          ((this._isEditingSession = !1),
          "active" === this.state
            ? this._enableMapClickHandler()
            : (this.editor._clearSelection(), this.editPopup.hide()),
          this._temporatyMapClickHandle &&
            this._temporatyMapClickHandle.remove(),
          (window.onbeforeunload = null));
        d(".atiButton.save-button", this.editPopup.domNode).addClass("disable");
      }
    },
    _wrapExistFunctionWithConfirmDialog: function(a, b) {
      return g.hitch(this, function(c) {
        if (this._isEditingSession) {
          if (!this.editPopup.jimuPopup) {
            var d = arguments;
            this._popupConfirmDialog(
              g.hitch(this, function() {
                b.apply(a, d);
                "clear-selection" === c && this.editor._clearSelection();
              }),
              null
            );
          }
        } else b.apply(a, arguments);
      });
    },
    _popupConfirmDialog: function (a, b) {
      console.debug('_popupConfirmDialog');
      var c = new m(),
        e = d(".esriPopupWrapper", this.editPopup.domNode)[0];
      this._isEditingSession && !this.editPopup.jimuPopup && e
        ? (this.editPopup.jimuPopup = new r({
            content: window.jimuNls.popup.leaveConfirm,
            container: e,
            width: 400,
            height: 175,
            buttons: [
              {
                label: window.jimuNls.common.leave,
                onClick: g.hitch(this, function() {
                  this.editPopup.jimuPopup.close();
                  this.editPopup.jimuPopup = null;
                  this._stopEditingSession();
                  this._refreshAttributeInspector();
                  a && a();
                  c.resolve(!0);
                })
              },
              {
                label: window.jimuNls.common.stay,
                classNames: ["jimu-btn-cancle"],
                onClick: g.hitch(this, function() {
                  this.editPopup.jimuPopup.close();
                  this.editPopup.jimuPopup = null;
                  b && b();
                  c.resolve(!1);
                })
              }
            ]
          }))
        : c.resolve(!0);
      return c;
    },
    _addFilterEditor: function(a) {
      this._configEditor.useFilterEdit &&
        (this._filterEditor = new O(
          { _settings: a, _editWidget: this },
          l.create("div", {}, this.domNode)
        ));
    },
    _worksBeforeCreate: function(a) {
      var b =
        "\x3cbr/\x3e(" +
        this.nls.pressStr +
        "\x3cb\x3e" +
        this.nls.ctrlStr +
        "\x3c/b\x3e " +
        this.nls.snapStr +
        ")";
      this._defaultStartStr = e.toolbars.draw.start;
      this._defaultAddPointStr = e.toolbars.draw.addPoint;
      e.toolbars.draw.start += b;
      e.toolbars.draw.addPoint += b;
      this._changeToServiceRenderer(a);
    },
    _worksAfterCreate: function(a) {
      this._addButtonToInspector();
      this._configEditor.toolbarVisible && this._disableDeleteBtnInToolbar();
      this.editPopup.resize(500, 251);
      this.editor.templatePicker.update(!0);
      this._addFilterEditor(a);
      this._bindEventsAfterCreate(a);
      this._changeMessageForTemplatePicker();
      this.ATILoading = new u({ hidden: !0 }).placeAt(
        this.editor.attributeInspector.domNode
      );
      this.editor.own(
        k.before(
          this.editor._selectionHelper,
          "selectFeatures",
          g.hitch(this.editor._selectionHelper, function(a, b, c, d) {
            return [
              h.filter(a, function(a) {
                if (!0 === a.visible && !0 === a._isMapAtVisibleScale())
                  return !0;
              }),
              b,
              c,
              d
            ];
          })
        )
      );
      var b = (a = null),
        c = w.getSelection(this._settingsParam.layers);
      c && c.length && ((a = c[0]), (b = a.getLayer()));
      b && x.getInstance().addFeaturesToSelection(b, [a]);
      this._createOverDef.resolve();
    },
    _worksAfterDestory: function() {
      this._stopEditingRelatedGraphic();
      e.toolbars.draw.start = this._defaultStartStr;
      e.toolbars.draw.addPoint = this._defaultAddPointStr;
      this._filterEditor && this._filterEditor.destroy();
      this._releaseEventAfterDestory();
      this.editor && this.editor.destroy();
      this.editor = null;
    },
    _bindEventsAfterCreate: function(a) {
      this.own(
        b(
          this.editor.editToolbar,
          "graphic-move-stop",
          g.hitch(this, this._onGraphicMoveStop)
        )
      );
      this.own(
        b(
          this.editor.attributeInspector,
          "next",
          g.hitch(this, this._onNextOfEditorATI)
        )
      );
      var c = b(this.editPopup, "show", g.hitch(this, this._onEditorPopupShow));
      this._releaseEventArrayAfterDestory.push(c);
      c = b(this.editPopup, "hide", g.hitch(this, this._onEditorPopupHide));
      this._releaseEventArrayAfterDestory.push(c);
      h.forEach(
        a.layerInfos,
        function(a) {
          c = b(
            a.featureLayer,
            "selection-complete",
            g.hitch(this, this._onLayerSelectionChange)
          );
          this._releaseEventArrayAfterDestory.push(c);
        },
        this
      );
      c = k.before(
        this.editor.templatePicker.grid,
        "onRowClick",
        g.hitch(this, function() {
          "active" !== this.state && this.widgetManager.activateWidget(this);
        })
      );
      this._releaseEventArrayAfterDestory.push(c);
      a = b(
        this.editor.templatePicker,
        "selection-change",
        g.hitch(this, function() {
          this.editor.templatePicker &&
            !this.editor.templatePicker.getSelected() &&
            this._layerInfosChangedWhenEditingSessionFlag &&
            ((this._layerInfosChangedWhenEditingSessionFlag = !1),
            this._isInEditingRelatedGraphicSession ||
              this._onLayerInfosChanged());
        })
      );
      this._releaseEventArrayAfterDestory.push(a);
      c = k.before(
        this.editor,
        "_activateDrawToolbar",
        g.hitch(this, function() {
          this.editor &&
            this.editor.drawingToolbar &&
            this.editor.drawingToolbar._tools &&
            this.editor.drawingToolbar._tools.EDITING &&
            (this.editor.drawingToolbar._tools.EDITING._geometryType = null);
          return arguments;
        })
      );
      this._releaseEventArrayAfterDestory.push(c);
    },
    _releaseEventAfterDestory: function() {
      h.forEach(
        this._releaseEventArrayAfterDestory,
        function(a) {
          a.remove();
        },
        this
      );
      this._releaseEventArrayAfterDestory = [];
    },
    _bindEventAfterActive: function() {
      var a = k.before(
        this.map,
        "onClick",
        g.hitch(this, this._beforeMapClick)
      );
      this._releaseEventArrayAfterActive.push(a);
    },
    _releaseEventAfterActive: function() {
      h.forEach(
        this._releaseEventArrayAfterActive,
        function(a) {
          a.remove();
        },
        this
      );
      this._releaseEventArrayAfterActive = [];
    },
    _bindEventAfterOpen: function() {
      var a = b(
        this._jimuLayerInfos,
        "layerInfosChanged",
        g.hitch(this, this._onLayerInfosChanged)
      );
      this._releaseEventArrayAfterClose.push(a);
      a = b(
        this._jimuLayerInfos,
        "layerInfosIsShowInMapChanged",
        g.hitch(this, this._onLayerInfosChanged)
      );
      this._releaseEventArrayAfterClose.push(a);
      a = b(
        this._jimuLayerInfos,
        "layerInfosReorder",
        g.hitch(this, this._onLayerInfosChanged)
      );
      this._releaseEventArrayAfterClose.push(a);
      a = b(this.map, "zoom-end", g.hitch(this, this._onLayerInfosChanged));
      this._releaseEventArrayAfterClose.push(a);
    },
    _releaseEventAfterClose: function() {
      h.forEach(
        this._releaseEventArrayAfterClose,
        function(a) {
          a.remove();
        },
        this
      );
      this._releaseEventArrayAfterClose = [];
    },
    _onLayerInfosChanged: function() {
      if (
        this.editor.templatePicker &&
        this.editor.templatePicker.getSelected()
      )
        this._layerInfosChangedWhenEditingSessionFlag = !0;
      else {
        var a = [];
        this._isInEditingRelatedGraphicSession
          ? this._startEditingRelatedGraphic(
              this._temporaryDataForEditingRelatedGraphicSession
                .currentOperationData,
              this._temporaryDataForEditingRelatedGraphicSession
                .currentIntegrityField,
              !0,
              !0
            )
          : ((a = this._obtainTemplatePickerLayerObjectsParam(
              this._settingsParam.layerInfos
            )),
            this._update(a));
      }
    },
    _changeToServiceRenderer: function(b) {
      h.forEach(
        b.layerInfos,
        function(b) {
          var c = b.featureLayer.renderer,
            d = a.parse(b.featureLayer._json).drawingInfo.renderer,
            e = null,
            e = null;
          "esri.renderer.HeatmapRenderer" === c.declaredClass &&
            ((e = J.fromJson(d)),
            (e =
              "esri.renderer.HeatmapRenderer" === e.declaredClass
                ? new F(new E({ size: 5 }))
                : e),
            (b._layerRenderer = c),
            this._layerInfoParamArrayUseForRervertRenderre.push(b),
            b.featureLayer.setRenderer(e),
            b.featureLayer.redraw());
        },
        this
      );
    },
    _revertToLayerRenderer: function() {
      h.forEach(
        this._layerInfoParamArrayUseForRervertRenderre,
        function(a) {
          a._layerRenderer &&
            (a.featureLayer.setRenderer(a._layerRenderer),
            a.featureLayer.redraw());
        },
        this
      );
      this._layerInfoParamArrayUseForRervertRenderre = [];
    },
    _requeryFeature: function(a, b) {
      var c = a && a.getLayer && a.getLayer();
      if (c && !this._isTemporaryFeatureForAddOnlyMode(a)) {
        var d = new P(c.url),
          e = new L(),
          c = a.attributes[c.objectIdField];
        e.objectIds = [c];
        e.outSpatialReference = this.map.spatialReference;
        e.returnGeometry = !1;
        e.outFields = ["*"];
        b && this.ATILoading.show();
        c &&
          d.execute(e).then(
            g.hitch(this, function(c) {
              if (c && c.features && c.features[0]) {
                c = c.features[0];
                for (var d in a.attributes)
                  a.attributes.hasOwnProperty(d) &&
                    "function" !== typeof a.attributes[d] &&
                    a.attributes[d] !== c.attributes[d] &&
                    (a.attributes[d] = c.attributes[d]);
                this._refreshAttributeInspector();
              }
              b && this.ATILoading.hide();
            }),
            g.hitch(this, function() {
              b && this.ATILoading.hide();
            })
          );
      }
    },
    _pushToNeedRequeryFeatureArray: function(a) {
      var b = a && a.getLayer && a.getLayer();
      if (b) {
        var c = a.attributes[b.objectIdField];
        h.some(
          this._needToRequeryFeatureArray,
          function(a) {
            var d = a.getLayer();
            a = a.attributes[d.objectIdField];
            if (b.id === d.id && c === a) return !0;
          },
          this
        ) || this._needToRequeryFeatureArray.push(a);
      }
    },
    _updateSelectedFeature: function(a) {
      a && (a.getLayer().applyEdits(null, [a]), this.editor._clearSelection());
    },
    _autoApplyEditWhenGeometryIsModified: function() {
      var a = this.editor.editToolbar.getCurrentState(),
        b = a && a.graphic;
      this._configEditor.autoApplyEditWhenGeometryIsMoved &&
        (this._checkStickyMoveTolerance()
          ? this._updateSelectedFeature(b)
          : a.isModified &&
            "point" !== b.geometry.type &&
            this._updateSelectedFeature(b));
    },
    _checkStickyMoveTolerance: function() {
      var a = !0,
        b = this.editor.editToolbar.getCurrentState();
      if ((b = b && b.graphic))
        this._isOutStickyMoveToleranceCheckedByMoveTrack(b) ||
          (this._revertGraphicPosition(b), (a = !1)),
          delete b._moveTrack,
          delete b._originalGeometryAtMoveStart;
      return a;
    },
    _isOutStickyMoveToleranceCheckedByOriginalGeometry: function(a) {
      var b,
        c,
        d,
        e = !0;
      "point" === a.geometry.type
        ? ((b = a._originalGeometryAtMoveStart), (c = a.geometry))
        : a.geometry.getExtent &&
          a._originalGeometryAtMoveStart.getExtent &&
          ((b = a._originalGeometryAtMoveStart.getExtent().getCenter()),
          (c = a.geometry.getExtent().getCenter()));
      this._configEditor.stickyMoveTolerance &&
        b &&
        c &&
        ((d = this.map.extent.getWidth()),
        (d /= this.map.width),
        (d *= this._configEditor.stickyMoveTolerance),
        (a = new D(0, 0, d, d, a.spatialReference)),
        (a = a.centerAt(b)),
        a.contains(c) && (e = !1));
      return e;
    },
    _isOutStickyMoveToleranceCheckedByMoveTrack: function(a) {
      var b = !0,
        c;
      c = a._moveTrack;
      var d;
      c && (d = new G(c.x, c.y, a.spatialReference));
      this._configEditor.stickyMoveTolerance &&
        d &&
        ((c = this.map.extent.getWidth()),
        (c /= this.map.width),
        (c *= this._configEditor.stickyMoveTolerance),
        (a = new D(-c / 2, -c / 2, c, c, a.spatialReference)),
        a.contains(d) && (b = !1));
      return b;
    },
    _revertGraphicPosition: function(a) {
      var b = a._moveTrack;
      if (b) {
        switch (a.geometry.type) {
          case "point":
            a.geometry.x -= b.x;
            a.geometry.y += b.y;
            break;
          case "polygon":
            h.forEach(a.geometry.rings, function(a) {
              h.forEach(a, function(a) {
                a[0] -= b.x;
                a[1] += b.y;
              });
            });
            break;
          case "polyline":
            h.forEach(a.geometry.paths, function(a) {
              h.forEach(a, function(a) {
                a[0] -= b.x;
                a[1] += b.y;
              });
            });
            break;
          case "multiPoint":
            h.forEach(a.geometry.points, function(a) {
              a[0] -= b.x;
              a[1] += b.y;
            });
            break;
          default:
            return;
        }
        this._configEditor.autoApplyEditWhenGeometryIsMoved ||
          h.forEach(
            this.editor.editToolbar._getAffectedTools("MOVE"),
            function(a) {
              a.suspend();
            },
            this
          );
        "point" === a.geometry.type && this.editor._clearSelection();
        a.draw();
      }
    },
    _recordsSelectedFeatureInfoWhenMoveStart: function(a) {
      (a = a && a.graphic) &&
        a.geometry &&
        (a._originalGeometryAtMoveStart = g.clone(a.geometry));
    },
    _recordsSelectedFeatureInfoWhenMoveStop: function(a) {
      var b = a && a.graphic;
      a = a && a.transform;
      var c = this.map.extent.getWidth() / this.map.width;
      b &&
        a &&
        (b._moveTrack || (b._moveTrack = { x: 0, y: 0 }),
        (b._moveTrack.x += a.dx * c),
        (b._moveTrack.y += a.dy * c));
    },
    _getSelectionFeatuers: function() {
      var a = [];
      h.forEach(this.layerInfosParam, function(b) {
        b = b.featureLayer.getSelectedFeatures();
        a = a.concat(b);
      });
      return a;
    },
    _getEditCapabilitiesByFeature: function(a) {
      var b = {},
        c = a && a.getLayer && a.getLayer();
      if (c && c.isEditable && c.isEditable()) {
        var d = this._getLayerInfoOrTableInfoParamById(c.id);
        c && (b = M.getEditCapabilities(c, d, { feature: a }));
      }
      return b;
    },
    _createRelatedRecordsEditor: function(a) {
      if (a && !this._isTemporaryFeatureForAddOnlyMode(a)) {
        var b = l.create("div", { style: "position: relative" });
        l.place(b, this.editor.attributeInspector.domNode, "after");
        var c = new u({}).placeAt(b);
        return this._tableInfoParamDef.then(
          g.hitch(this, function() {
            try {
              this._relatedRecordsEditor &&
                (this._relatedRecordsEditor.destroy(),
                (this._relatedRecordsEditor = null)),
                (this._relatedRecordsEditor = new R({
                  originalFeature: a,
                  editorATI: this.editor.attributeInspector,
                  tableInfosParam: this.layerInfosParamClone.concat(
                    this.tableInfosParamClone
                  ),
                  nls: g.mixin(g.clone(this.nls), window.jimuNls.common),
                  _editWidget: this
                })),
                c.destroy();
            } catch (T) {
              console.warn(T.message),
                c.destroy(),
                this._enableToAnswerEventForEditorATI();
            }
          })
        );
      }
    },
    _disableToAnswerEventForEditorATI: function() {
      this._mapInfoStorage.editorATIonLayerSelectionChange ||
        ((this._mapInfoStorage.editorATIonLayerSelectionChange = this.editor.attributeInspector.onLayerSelectionChange),
        (this.editor.attributeInspector.onLayerSelectionChange = g.hitch(
          this,
          function() {}
        )));
      this._mapInfoStorage.editorATIonLayerSelectionClear ||
        ((this._mapInfoStorage.editorATIonLayerSelectionClear = this.editor.attributeInspector.onLayerSelectionClear),
        (this.editor.attributeInspector.onLayerSelectionClear = g.hitch(
          this,
          function() {}
        )));
    },
    _enableToAnswerEventForEditorATI: function() {
      this._mapInfoStorage.editorATIonLayerSelectionChange &&
        ((this.editor.attributeInspector.onLayerSelectionChange = g.hitch(
          this.editor.attributeInspector,
          this._mapInfoStorage.editorATIonLayerSelectionChange
        )),
        (this._mapInfoStorage.editorATIonLayerSelectionChange = null));
      this._mapInfoStorage.editorATIonLayerSelectionClear &&
        ((this.editor.attributeInspector.onLayerSelectionClear = g.hitch(
          this.editor.attributeInspector,
          this._mapInfoStorage.editorATIonLayerSelectionClear
        )),
        (this._mapInfoStorage.editorATIonLayerSelectionClear = null));
    },
    _getTableInfosParam: function() {
      var a,
        b = [],
        d = [];
      a = this._configEditor.honorSettingOfWebmap
        ? this._getDefaultTableInfos()
        : this._configEditor.tableInfos
        ? 0 < this._configEditor.tableInfos.length
          ? this._converConfiguredLayerInfos(this._configEditor.tableInfos)
          : this._getDefaultTableInfos()
        : [];
      h.forEach(
        a,
        function(a) {
          var c = this._jimuLayerInfos.getTableInfoById(a.featureLayer.id);
          c && ((a.jimuTableInfo = c), b.push(c.getLayerObject()));
        },
        this
      );
      return c(b).then(
        g.hitch(this, function() {
          h.forEach(
            a,
            function(a) {
              if (a.jimuTableInfo) {
                var b = a.jimuTableInfo.layerObject,
                  c = a.jimuTableInfo.getCapabilitiesOfWebMap(),
                  c = c && -1 === c.toLowerCase().indexOf("editing") ? !1 : !0;
                b &&
                  b.visible &&
                  b.isEditable &&
                  b.isEditable() &&
                  c &&
                  ((a.featureLayer = a.jimuTableInfo.layerObject),
                  delete a.jimuTableInfo,
                  d.push(a));
              }
            },
            this
          );
          return d;
        })
      );
    },
    _startEditingRelatedGraphic: function(a, c, e, f) {
      this._stopEditingRelatedGraphic();
      this._temporaryDataForEditingRelatedGraphicSession.currentOperationData = a;
      this._temporaryDataForEditingRelatedGraphicSession.currentIntegrityField = c;
      this._isInEditingRelatedGraphicSession = !0;
      var k = a.destJimuLayerInfo,
        m = a.destJimuLayerInfo.layerObject;
      e || (this.editPopup.hide(), this.editor._clearSelection());
      l.removeClass(this.editRelatedGraphicPart, "disable");
      l.setStyle(
        this.editor.templatePicker.domNode,
        "top",
        this._configEditor.useFilterEdit
          ? I.TOP_WITH_TEMPLATE_FILTER_AND_EDIT_RG
          : I.TOP_WITH_EDIT_RG
      );
      e = [];
      k.isShowInMap() && k.isInScale() && (e = [m]);
      this._setTemplatePickerLayerObjectsParam(e);
      this._update(e);
      this._filterEditor &&
        (this._filterEditor.selectLayerFilterByValue(m.id),
        this._filterEditor.disableLayerFilter());
      k = c.hasRelationshipTable
        ? b(
            m,
            "edits-complete",
            g.hitch(this, function(b) {
              if (b && b.adds && 1 === b.adds.length) {
                var c = b.adds[0],
                  d = null;
                h.some(m.graphics, function(a) {
                  if (a.attributes[m.objectIdField] === c.objectId)
                    return (d = a), !0;
                });
                d && this._relatedRecordsEditor._addNewRelationshipReocrd(d, a);
              }
            })
          )
        : b(
            this.editor.templatePicker,
            "selection-change",
            g.hitch(this, function() {
              var a = this.editor.templatePicker.getSelected();
              (a = a && a.template) &&
                !g.getObject("_wabProperties.originalInterityField", !1, a) &&
                a.prototype &&
                a.prototype.attributes &&
                (g.setObject(
                  "_wabProperties.originalInterityField.key",
                  c.key,
                  a
                ),
                g.setObject(
                  "_wabProperties.originalInterityField.value",
                  a.prototype.attributes[c.key],
                  a
                ),
                (a.prototype.attributes[c.key] = c.value),
                this._changedTemplatesOfTemplatePicker.push(a));
            })
          );
      this._releaseEventArrayAfterEditingRelatedGraphic.push(k);
      if (!f) {
        f = d(".itemSymbol", this.editor.templatePicker.domNode);
        var n;
        f &&
          0 < f.length &&
          (n = (n = f[0]) && n.parentNode && n.parentNode.parentNode);
        n &&
          this.editor.templatePicker._rowClicked({
            cellNode: n,
            rowIndex: 1,
            cellIndex: 0
          });
      }
    },
    _stopEditingRelatedGraphic: function() {
      this._isInEditingRelatedGraphicSession &&
        ((this._temporaryDataForEditingRelatedGraphicSession = {}),
        l.addClass(this.editRelatedGraphicPart, "disable"),
        l.setStyle(
          this.editor.templatePicker.domNode,
          "top",
          this._configEditor.useFilterEdit ? I.TOP_WITH_TEMPLATE_FILTER : I.TOP
        ),
        h.forEach(
          this._releaseEventArrayAfterEditingRelatedGraphic,
          function(a) {
            a && a.remove && a.remove();
          },
          this
        ),
        (this._releaseEventArrayAfterEditingRelatedGraphic = []),
        h.forEach(
          this._changedTemplatesOfTemplatePicker,
          function(a) {
            if (
              g.getObject("_wabProperties.originalInterityField", !1, a) &&
              a.prototype &&
              a.prototype.attributes
            ) {
              var b = g.getObject(
                  "_wabProperties.originalInterityField.key",
                  !1,
                  a
                ),
                c = g.getObject(
                  "_wabProperties.originalInterityField.value",
                  !1,
                  a
                );
              a.prototype.attributes[b] = c;
            }
          },
          this
        ),
        (this._changedTemplatesOfTemplatePicker = []),
        this._filterEditor && this._filterEditor.enableLayerFilter(),
        this.editor.templatePicker.clearSelection(),
        (this._isInEditingRelatedGraphicSession = !1),
        this._onLayerInfosChanged());
    },
    _changeMessageForTemplatePicker: function() {
      if (
        this.editor &&
        0 === this.editor.templatePicker.featureLayers.length
      ) {
        var a = d(
          "[class~\x3ddojoxGridMasterMessages]",
          this.editor.templatePicker.domNode
        );
        a &&
          a[0] &&
          (a[0].innerHTML = this._canCreateLayersAreAllInvisibleFlag
            ? this.nls.noCanCreateLayerAreCurrentlyVisible
            : window.jimuNls.noEditableLayers);
      }
    },
    _refreshAttributeInspector: function() {
      this.editor &&
        this.editor.attributeInspector &&
        this.editor.attributeInspector.refresh();
      this.editPopup.isShowing &&
        this._updateDeleteButtonInPopup(
          this.editor &&
            this.editor.attributeInspector &&
            this.editor.attributeInspector._currentFeature
        );
    },
    _updateOperationalButtons: function(a) {
      this._updateDeleteButtonInPopup(a);
      this._updateGeometryOperationButtons(a);
    },
    _updateDeleteButtonInPopup: function(a) {
      this._getEditCapabilitiesByFeature(a).canDelete
        ? this._enableDeleBtnInPopup()
        : this._disableDeleteBtnInPopup();
    },
    _disableDeleteBtnInToolbar: function() {
      this._configEditor.toolbarVisible &&
        d("[class~\x3ddeleteFeatureIcon]", this.editor.domNode).style(
          "display",
          "none"
        );
    },
    _enableDeleBtnInToolbar: function() {
      this._configEditor.toolbarVisible &&
        d("[class~\x3ddeleteFeatureIcon]", this.editor.domNode).style(
          "display",
          "inline-block"
        );
    },
    _disableDeleteBtnInPopup: function() {
      d(".atiButton.atiDeleteButton", this.editPopup.domNode).style(
        "display",
        "none"
      );
    },
    _enableDeleBtnInPopup: function() {
      d(".atiButton.atiDeleteButton", this.editPopup.domNode).style(
        "display",
        "block"
      );
    },
    _updateGeometryOperationButtons: function(a) {
      var b = a && a.getLayer && a.getLayer();
      a = this._getEditCapabilitiesByFeature(a);
      !b || a.canUpdateGeometry
        ? this._enableGeometryOperationButtons()
        : this._disableGeometryOperationButtons();
    },
    _disableGeometryOperationButtons: function() {
      this._configEditor.toolbarVisible &&
        (d("[widgetid\x3dbtnFeatureCut]", this.editor.domNode).style(
          "display",
          "none"
        ),
        d("[widgetid\x3dbtnFeatureUnion]", this.editor.domNode).style(
          "display",
          "none"
        ),
        d("[widgetid\x3dbtnFeatureReshape]", this.editor.domNode).style(
          "display",
          "none"
        ),
        (this._configEditor.toolbarOptions.mergeVisible ||
          this._configEditor.toolbarOptions.cutVisible ||
          this._configEditor.toolbarOptions.reshapeVisible) &&
          d("[widgetid^\x3ddijit_ToolbarSeparator]", this.editor.domNode)
            .last()
            .style("display", "none"));
    },
    _enableGeometryOperationButtons: function() {
      this._configEditor.toolbarVisible &&
        (d("[widgetid\x3dbtnFeatureCut]", this.editor.domNode).style(
          "display",
          "inline-block"
        ),
        d("[widgetid\x3dbtnFeatureUnion]", this.editor.domNode).style(
          "display",
          "inline-block"
        ),
        d("[widgetid\x3dbtnFeatureReshape]", this.editor.domNode).style(
          "display",
          "inline-block"
        ),
        (this._configEditor.toolbarOptions.mergeVisible ||
          this._configEditor.toolbarOptions.cutVisible ||
          this._configEditor.toolbarOptions.reshapeVisible) &&
          d("[widgetid^\x3ddijit_ToolbarSeparator]", this.editor.domNode)
            .last()
            .style("display", "inline-block"));
    },
    _updateDeleteButtonInToolbarBySelectionFeatures: function() {
      var a = !0,
        b = this._getSelectionFeatuers();
      0 === b.length
        ? (a = !1)
        : h.some(
            b,
            function(b) {
              if (!this._getEditCapabilitiesByFeature(b).canDelete)
                return (a = !1), !0;
            },
            this
          );
      a ? this._enableDeleBtnInToolbar() : this._disableDeleteBtnInToolbar();
    },
    _update: function(a) {
      this.editor &&
        (a &&
          (this._filterEditor && this._filterEditor.update(),
          (this.editor.templatePicker.featureLayers = a)),
        this.editor.templatePicker.clearSelection(),
        this.editor.templatePicker.update(!0),
        this._changeMessageForTemplatePicker());
    },
    resize: function() {
      this._update();
    },
    onNormalize: function() {
      setTimeout(g.hitch(this, this._update), 100);
    },
    onMinimize: function() {},
    onMaximize: function() {
      setTimeout(g.hitch(this, this._update), 100);
    },
    reClickMap: function(a) {
      this._createOverDef.then(
        g.hitch(this, function() {
          this.map.onClick(a);
        })
      );
    },
    _onGraphicMoveStart: function(a) {
      this._recordsSelectedFeatureInfoWhenMoveStart(a);
    },
    _onGraphicMoveStop: function(a) {
      this._recordsSelectedFeatureInfoWhenMoveStop(a);
      this._autoApplyEditWhenGeometryIsModified(a);
    },
    _onGraphicChangeStop: function(a) {
      this._autoApplyEditWhenGeometryIsModified(a);
    },
    _beforeMapClick: function() {
      this._configEditor.autoApplyEditWhenGeometryIsMoved ||
        this._checkStickyMoveTolerance();
    },
    _onEditorPopupShow: function() {
      var a = this.editor.attributeInspector._currentFeature;
      this._disableToAnswerEventForEditorATI();
      this._createRelatedRecordsEditor(a);
      this._pushToNeedRequeryFeatureArray(a);
      this._requeryFeature(a, !0);
      this._updateOperationalButtons(a);
    },
    _onEditorPopupHide: function() {
      this._enableToAnswerEventForEditorATI();
    },
    _onNextOfEditorATI: function(a) {
      this._createRelatedRecordsEditor(a.feature);
      this._pushToNeedRequeryFeatureArray(a.feature);
      this._requeryFeature(a.feature, !0);
      this._updateOperationalButtons(a.feature);
    },
    _onLayerSelectionChange: function() {
      this._updateDeleteButtonInToolbarBySelectionFeatures();
    }
  });
  I.EditPopup = n([z], {
    preamble: function() {
      this.originalHide = g.hitch(this, this.hide);
      this.hide = g.hitch(this, function(a) {
        this.hideWidthConfirmDialog(a);
      });
      K.setScrollable &&
        ((this.originalSetScrollableDomUtils = K.setScrollable),
        (K.setScrollable = function() {
          return [{ remove: function() {} }, { remove: function() {} }];
        }));
    },
    constructor: function() {
      K.setScrollable = this.originalSetScrollableDomUtils;
    },
    hideWidthConfirmDialog: function(a) {
      this.originalHide();
    }
  });
  g.mixin(I, {
    TOP: "18px",
    TOP_WITH_TEMPLATE_FILTER: "115px",
    TOP_WITH_EDIT_RG: "53px",
    TOP_WITH_TEMPLATE_FILTER_AND_EDIT_RG: "155px"
  });
  return I;
});
