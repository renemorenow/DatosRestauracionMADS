// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "jimu/dijit/LayerChooserFromMapWithDropbox": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/on dojo/keys dojo/Evented dojo/Deferred dijit/popup dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./templates/LayerChooserFromMapWithDropbox.html jimu/LayerInfos/LayerInfos".split(
        " "
      ), function(h, l, d, g, f, b, e, k, p, t, n, a) {
        return h([p, t, b], {
          templateString: n,
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
              g(
                this.layerChooser,
                "tree-click",
                l.hitch(this, this._onTreeClick)
              )
            );
            this.own(
              g(
                this.layerChooser,
                "update",
                l.hitch(this, this._onLayerChooserUpdate)
              )
            );
            this.own(
              g(document.body, "click", l.hitch(this, this._onBodyClicked))
            );
            this.own(
              g(
                document.body,
                "keydown",
                l.hitch(this, function(a) {
                  a.keyCode === f.ENTER && this._onBodyClicked(a);
                })
              )
            );
            this.own(
              g(
                this.layerChooser.domNode,
                "keydown",
                l.hitch(this, function(a) {
                  a.keyCode === f.ESCAPE && this.hideLayerChooser();
                })
              )
            );
            this.portal = portalUtils.getPortal(this.appConfig.portalUrl);
            this.username = this.portal.user.username;
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
            var b = new e();
            if (a) {
              var d = this.layerInfosObj.getLayerInfoById(a.id);
              d
                ? this.layerChooser.filter(d).then(
                    l.hitch(this, function(e) {
                      e
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
              d.isDescendant(a, this.domNode) ||
              a === this.layerChooser.domNode ||
              d.isDescendant(a, this.layerChooser.domNode) ||
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
            k.open({
              parent: this,
              popup: this.layerChooser,
              around: this.domNode
            });
            var a = this.layerChooser.domNode.parentNode;
            a &&
              (d.addClass(a, "jimu-layer-chooser-from-map-withdropbox-popup"),
              this.customClass && d.addClass(a, this.customClass),
              this.layerChooser.tree.domNode.focus());
            this._isLayerChooserShow = !0;
          },
          hideLayerChooser: function() {
            k.close(this.layerChooser);
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
              e = l.getObject("layerInfo.id", !1, a) || -1,
              b = b !== e;
            this._selectedItem = a;
            this.hideLayerChooser();
            a = l.getObject("layerInfo.title", !1, this._selectedItem) || "";
            this.layerNameNode.innerHTML = a;
            d.setAttr(this.layerNameNode, "title", a);
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
    "widgets/Filter/CustomFeaturelayerChooserFromMap": function() {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/Deferred",
        "jimu/dijit/LayerChooserFromMap",
        "jimu/dijit/QueryableLayerChooserFromMap"
      ], function(h, l, d, g, f) {
        return h([f], {
          postMixInProperties: function() {
            this.inherited(arguments);
            this.filter = l.hitch(
              this,
              g.andCombineFilters([
                this.filter,
                l.hitch(this, this._customFilter)
              ])
            );
            this.displayTooltipForTreeNode = !0;
          },
          _customFilter: function(b) {
            var e = new d();
            b.isTable
              ? e.resolve(!1)
              : b.getLayerObject().then(
                  l.hitch(this, function(b) {
                    "esri.layers.ArcGISDynamicMapServiceLayer" ===
                    b.declaredClass
                      ? e.resolve(10 <= b.version)
                      : "esri.layers.ArcGISTiledMapServiceLayer" ===
                        b.declaredClass
                      ? e.resolve(!1)
                      : e.resolve(!0);
                  }),
                  l.hitch(this, function(b) {
                    console.error(b);
                    e.resolve(!1);
                  })
                );
            return e;
          }
        });
      });
    },
    "jimu/dijit/LayerChooserFromMap": function() {
      define("dojo/on dojo/Evented dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/store/Memory dojo/Deferred dojo/store/Observable dijit/tree/ObjectStoreModel dojo/promise/all dojo/_base/lang dojo/_base/html dojo/_base/array jimu/utils jimu/dijit/_Tree jimu/LayerInfos/LayerInfos jimu/dijit/LoadingIndicator".split(
        " "
      ), function(h, l, d, g, f, b, e, k, p, t, n, a, v, q, A, m, w, F) {
        var r = d([g, f, b, l], {
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
            v.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
            this.multiple = !!this.multiple;
            this.shelter = new F({ hidden: !0 });
            this.shelter.placeAt(this.domNode);
            this.shelter.startup();
            this._createTree();
            this.basicFilter = a.hitch(this, this.basicFilter);
            this.filter = r.andCombineFilters([this.basicFilter, this.filter]);
            this.createMapResponse &&
              this.setCreateMapResponse(this.createMapResponse);
          },
          basicFilter: function(a) {
            var b = new k();
            this.onlyShowVisible ? b.resolve(a.isShowInMap()) : b.resolve(!0);
            return b;
          },
          filter: function(a) {
            a = new k();
            a.resolve(!0);
            return a;
          },
          getSelectedItems: function() {
            var b = this.tree.getSelectedItems();
            return q.map(
              b,
              a.hitch(this, function(a) {
                return this.getHandledItem(a);
              })
            );
          },
          getAllItems: function() {
            var b = this.tree.getAllItems(),
              e = [];
            q.forEach(
              b,
              a.hitch(this, function(a) {
                "root" !== a.id && ((a = this.getHandledItem(a)), e.push(a));
              })
            );
            return e;
          },
          getHandledItem: function(a) {
            return { name: a.name, layerInfo: a.layerInfo };
          },
          _isLeafItem: function(a) {
            return a.isLeaf;
          },
          setCreateMapResponse: function(b) {
            this.createMapResponse = b;
            w.getInstance(
              this.createMapResponse.map,
              this.createMapResponse.itemInfo
            ).then(
              a.hitch(this, function(b) {
                this.layerInfosObj = b;
                this.own(
                  h(
                    this.layerInfosObj,
                    "layerInfosChanged",
                    a.hitch(this, this._onLayerInfosChanged)
                  )
                );
                this.updateWhenLayerInfosIsShowInMapChanged &&
                  this.own(
                    h(
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
            v.setStyle(this.errorTipSection, "display", "block");
            var e = [];
            this.onlyShowWebMapLayers
              ? ((e = b.getLayerInfoArrayOfWebmap()),
                (e = e.concat(b.getTableInfoArrayOfWebmap())))
              : ((e = b.getLayerInfoArray()),
                (e = e.concat(b.getTableInfoArray())));
            0 !== e.length &&
              (v.setStyle(this.errorTipSection, "display", "none"),
              q.forEach(
                e,
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
            q.forEach(
              b,
              a.hitch(this, function(a) {
                a && "root" !== a.id && this._store.remove(a.id);
              })
            );
          },
          _addItem: function(b, e) {
            var d = null,
              f = e.getLayerType(),
              g = this.filter(e);
            n({ layerType: f, valid: g }).then(
              a.hitch(this, function(f) {
                if (f.valid) {
                  var c = a.hitch(this, function(c, a) {
                      this._id++;
                      d = {
                        name: e.title || "",
                        parent: b,
                        layerInfo: e,
                        type: f.layerType,
                        layerClass: e.layerObject.declaredClass,
                        id: this._id.toString(),
                        isLeaf: c,
                        hasChildren: a
                      };
                      this._store.add(d);
                    }),
                    y = e.getSubLayers(),
                    C = 0 === y.length;
                  C
                    ? c(C, !1)
                    : ((y = q.map(
                        y,
                        a.hitch(this, function(c) {
                          return this.filter(c);
                        })
                      )),
                      n(y).then(
                        a.hitch(this, function(a) {
                          (a = q.some(a, function(c) {
                            return c;
                          })) && c(C, a);
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
              b = new e({
                data: [b],
                getChildren: function(a) {
                  return this.query({ parent: a.id });
                }
              });
            this._store = new p(b);
            b = new t({
              store: this._store,
              query: { id: "root" },
              mayHaveChildren: a.hitch(this, this._mayHaveChildren)
            });
            this.tree = new m({
              multiple: this.multiple,
              model: b,
              showRoot: !1,
              isLeafItem: a.hitch(this, this._isLeafItem),
              style: { width: "100%" },
              onOpen: a.hitch(this, function(a, b) {
                "root" !== a.id && this._onTreeOpen(a, b);
              }),
              onClick: a.hitch(this, function(a, b, e) {
                this._onTreeClick(a, b, e);
                this.emit("tree-click", a, b, e);
              }),
              getIconStyle: a.hitch(this, function(a, b) {
                var e = null;
                if (!a || "root" === a.id) return null;
                var d = {
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundImage: ""
                  },
                  f =
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    require.toUrl("jimu");
                if ((a = this._getIconInfo(a, b).imageName))
                  (d.backgroundImage = "url(" + f + "/css/images/" + a + ")"),
                    (e = d);
                return e;
              }),
              getIconClass: a.hitch(this, function(a, b) {
                return this._getIconInfo(a, b).className;
              }),
              getTooltip: a.hitch(this, function(a) {
                return this.displayTooltipForTreeNode ? a.layerInfo.title : "";
              })
            });
            v.addClass(this.tree.domNode, this._treeClass);
            this.tree.placeAt(this.shelter.domNode, "before");
          },
          _mayHaveChildren: function(a) {
            return a.hasChildren;
          },
          _getIconInfo: function(a, b) {
            var e = "",
              d = "";
            "ArcGISDynamicMapServiceLayer" === a.type ||
            "ArcGISTiledMapServiceLayer" === a.type
              ? b
                ? ((e = "mapserver_open.png"),
                  (d = "mapservice-layer-icon open"))
                : ((e = "mapserver_close.png"),
                  (d = "mapservice-layer-icon close"))
              : "GroupLayer" === a.type
              ? b
                ? ((e = "group_layer2.png"), (d = "group-layer-icon open"))
                : ((e = "group_layer1.png"), (d = "group-layer-icon close"))
              : "FeatureLayer" === a.type
              ? ((a = A.getTypeByGeometryType(
                  a.layerInfo.layerObject.geometryType
                )),
                "point" === a
                  ? ((e = "point_layer1.png"), (d = "point-layer-icon"))
                  : "polyline" === a
                  ? ((e = "line_layer1.png"), (d = "line-layer-icon"))
                  : "polygon" === a &&
                    ((e = "polygon_layer1.png"), (d = "polygon-layer-icon")))
              : "Table" === a.type
              ? ((e = "table.png"), (d = "table-icon"))
              : "ArcGISImageServiceLayer" === a.type ||
                "ArcGISImageServiceVectorLayer" === a.type
              ? ((e = "image_layer.png"), (d = "iamge-layer-icon"))
              : b
              ? ((e = "mapserver_open.png"), (d = "mapservice-layer-icon open"))
              : ((e = "mapserver_close.png"),
                (d = "mapservice-layer-icon close"));
            return { imageName: e, className: d };
          },
          _onTreeOpen: function(b, e) {
            if ("root" !== b.id) {
              var d = [];
              e = [];
              d = b.layerInfo.getSubLayers();
              b.checked ||
                (this.shelter.show(),
                (e = q.map(
                  d,
                  a.hitch(this, function(a) {
                    return a.getLayerObject();
                  })
                )),
                n(e).then(
                  a.hitch(this, function() {
                    this.domNode &&
                      (q.forEach(
                        d,
                        a.hitch(this, function(a) {
                          this._addItem(b.id, a);
                        })
                      ),
                      (b.checked = !0),
                      this.shelter.hide());
                  }),
                  a.hitch(this, function(a) {
                    console.error(a);
                    this.shelter.hide();
                  })
                ));
            }
          },
          _onTreeClick: function(a, b, e) {},
          destroy: function() {
            this.shelter && (this.shelter.destroy(), (this.shelter = null));
            this.tree && this.tree.destroy();
            this.inherited(arguments);
          }
        });
        r.createFilterByLayerType = function(b) {
          a.isArrayLike(b) || (b = []);
          return function(a) {
            var e = new k();
            if (0 === b.length) e.resolve(!0);
            else {
              var d = [];
              a.traversal(function(a) {
                d.push(a.getLayerType());
              });
              n(d).then(
                function(a) {
                  for (var d = 0; d < a.length; d++)
                    for (var c = 0; c < b.length; c++)
                      if (a[d] === b[c]) {
                        e.resolve(!0);
                        return;
                      }
                  e.resolve(!1);
                },
                function(a) {
                  console.error(a);
                  e.reject(a);
                }
              );
            }
            return e;
          };
        };
        r.createFeaturelayerFilter = function(a, b, e, d) {
          var f = ["point", "polyline", "polygon"];
          a && 0 < a.length
            ? ((a = q.filter(a, function(a) {
                return 0 <= f.indexOf(a);
              })),
              0 === a.length && (a = f))
            : (a = f);
          return function(f) {
            var c = f.getLayerType();
            f = f.getLayerObject();
            return n({ layerType: c, layerObject: f }).then(function(c) {
              var f = c.layerType;
              c = c.layerObject;
              if (
                "ArcGISDynamicMapServiceLayer" === f ||
                "ArcGISTiledMapServiceLayer" === f ||
                "GroupLayer" === f ||
                "FeatureCollection" === f
              )
                return !0;
              if ("FeatureLayer" === f) {
                var f = A.getTypeByGeometryType(c.geometryType),
                  f = 0 <= q.indexOf(a, f),
                  y = r._shouldPassStatisticsCheck(d, c);
                return c.url
                  ? ((c = A.isFeaturelayerUrlSupportQuery(
                      c.url,
                      c.capabilities
                    )),
                    f && c && y)
                  : b && f;
              }
              return "Table" === f
                ? ((f = A.isFeaturelayerUrlSupportQuery(c.url, c.capabilities)),
                  (c = r._shouldPassStatisticsCheck(d, c)),
                  e && f && c)
                : !1;
            });
          };
        };
        r.createImageServiceLayerFilter = function(a, b) {
          return function(e) {
            var d = e.getLayerType();
            e = e.getLayerObject();
            return n({ layerType: d, layerObject: e }).then(function(e) {
              var d = e.layerType,
                c = e.layerObject;
              return "ArcGISImageServiceLayer" === d ||
                "ArcGISImageServiceVectorLayer" === d
                ? a
                  ? A.isImageServiceSupportQuery(e.layerObject.capabilities)
                    ? b
                      ? r._shouldPassStatisticsCheck(b, c)
                      : !0
                    : !1
                  : !0
                : !1;
            });
          };
        };
        r._shouldPassStatisticsCheck = function(a, b) {
          return a
            ? ((a = !1),
              (a = b.advancedQueryCapabilities
                ? !!b.advancedQueryCapabilities.supportsStatistics
                : !!b.supportsStatistics))
            : !0;
        };
        r.createQueryableLayerFilter = function(a) {
          var b = r.createFeaturelayerFilter(
            ["point", "polyline", "polygon"],
            !1,
            !0,
            a
          );
          a = r.createImageServiceLayerFilter(!0, a);
          return r.orCombineFilters([b, a]);
        };
        r.andCombineFilters = function(a) {
          return r._combineFilters(a, !0);
        };
        r.orCombineFilters = function(a) {
          return r._combineFilters(a, !1);
        };
        r._combineFilters = function(a, b) {
          return function(e) {
            var d = new k(),
              f = q.map(a, function(a) {
                return a(e);
              });
            n(f).then(
              function(a) {
                var c = !1,
                  c = b
                    ? q.every(a, function(a) {
                        return a;
                      })
                    : q.some(a, function(a) {
                        return a;
                      });
                d.resolve(c);
              },
              function(a) {
                console.error(a);
                d.reject(a);
              }
            );
            return d;
          };
        };
        return r;
      });
    },
    "dijit/tree/ObjectStoreModel": function() {
      define("dojo/_base/array dojo/aspect dojo/_base/declare dojo/Deferred dojo/_base/lang dojo/when ../Destroyable".split(
        " "
      ), function(h, l, d, g, f, b, e) {
        return d("dijit.tree.ObjectStoreModel", e, {
          store: null,
          labelAttr: "name",
          labelType: "text",
          root: null,
          query: null,
          constructor: function(b) {
            f.mixin(this, b);
            this.childrenCache = {};
          },
          getRoot: function(e, d) {
            if (this.root) e(this.root);
            else {
              var g = this.store.query(this.query);
              g.then && this.own(g);
              b(
                g,
                f.hitch(this, function(b) {
                  if (1 != b.length)
                    throw Error(
                      "dijit.tree.ObjectStoreModel: root query returned " +
                        b.length +
                        " items, but must return exactly one"
                    );
                  this.root = b[0];
                  e(this.root);
                  g.observe &&
                    g.observe(
                      f.hitch(this, function(a) {
                        this.onChange(a);
                      }),
                      !0
                    );
                }),
                d
              );
            }
          },
          mayHaveChildren: function() {
            return !0;
          },
          getChildren: function(e, d, g) {
            var k = this.store.getIdentity(e);
            if (this.childrenCache[k]) b(this.childrenCache[k], d, g);
            else {
              var a = (this.childrenCache[k] = this.store.getChildren(e));
              a.then && this.own(a);
              a.observe &&
                this.own(
                  a.observe(
                    f.hitch(this, function(d, g, k) {
                      this.onChange(d);
                      g != k && b(a, f.hitch(this, "onChildrenChange", e));
                    }),
                    !0
                  )
                );
              b(a, d, g);
            }
          },
          isItem: function() {
            return !0;
          },
          getIdentity: function(b) {
            return this.store.getIdentity(b);
          },
          getLabel: function(b) {
            return b[this.labelAttr];
          },
          newItem: function(b, e, d, f) {
            return this.store.put(b, { parent: e, before: f });
          },
          pasteItem: function(b, e, d, n, a, v) {
            var q = new g();
            if (e === d && !n && !v) return q.resolve(!0), q;
            e && !n
              ? this.getChildren(
                  e,
                  f.hitch(this, function(a) {
                    a = [].concat(a);
                    var f = h.indexOf(a, b);
                    a.splice(f, 1);
                    this.onChildrenChange(e, a);
                    q.resolve(
                      this.store.put(b, {
                        overwrite: !0,
                        parent: d,
                        oldParent: e,
                        before: v,
                        isCopy: !1
                      })
                    );
                  })
                )
              : q.resolve(
                  this.store.put(b, {
                    overwrite: !0,
                    parent: d,
                    oldParent: e,
                    before: v,
                    isCopy: !0
                  })
                );
            return q;
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
      ), function(h, l, d, g, f, b, e, k, p, t, n, a, v, q, A, m) {
        var w = h([A._TreeNode, v], {
          templateString: g,
          declaredClass: "jimu._TreeNode",
          isLeaf: !1,
          groupId: "",
          postCreate: function() {
            this.inherited(arguments);
            b.addClass(this.domNode, "jimu-tree-node");
            this.isLeaf = !!this.isLeaf;
            this.groupId
              ? ((this.checkNode = b.toDom('\x3cinput type\x3d"radio" /\x3e')),
                (this.checkNode.name = this.groupId))
              : (this.checkNode = b.toDom(
                  '\x3cinput type\x3d"checkbox" /\x3e'
                ));
            b.addClass(this.checkNode, "jimu-tree-check-node");
            b.place(this.checkNode, this.contentNode, "first");
            this.own(n(this.checkNode, "click", f.hitch(this, this._onClick)));
            this.own(
              n(
                this.rowNode,
                "keydown",
                f.hitch(
                  this,
                  function(b, e) {
                    e.target = b;
                    (e.keyCode !== a.ENTER && e.keyCode !== a.SPACE) ||
                      this._onClick(e);
                  },
                  this.checkNode
                )
              )
            );
            this.isLeaf
              ? this.groupId
                ? b.setStyle(this.checkNode, "display", "none")
                : b.setStyle(this.checkNode, "display", "inline")
              : b.setStyle(this.checkNode, "display", "none");
            this.isLeaf
              ? b.addClass(this.domNode, "jimu-tree-leaf-node")
              : b.addClass(this.domNode, "jimu-tree-not-leaf-node");
          },
          select: function() {
            this.isLeaf &&
              ((this.checkNode.checked = !0),
              b.addClass(this.domNode, "jimu-tree-selected-leaf-node"));
          },
          unselect: function() {
            this.isLeaf &&
              ((this.checkNode.checked = !1),
              b.removeClass(this.domNode, "jimu-tree-selected-leaf-node"));
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
        return h([A, v], {
          declaredClass: "jimu._Tree",
          openOnClick: !0,
          multiple: !0,
          uniqueId: "",
          showRoot: !1,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.uniqueId = "tree_" + m.getRandomString();
          },
          postCreate: function() {
            this.inherited(arguments);
            b.addClass(this.domNode, "jimu-tree");
            this.own(
              t.before(this, "onClick", f.hitch(this, this._jimuBeforeClick))
            );
            this.rootLoadingIndicator &&
              b.setStyle(this.rootLoadingIndicator, "display", "none");
            this.dndController.singular = !0;
            b.setAttr(this.domNode, "tabindex", 0);
          },
          removeItem: function(a) {
            this.model.store.remove(a);
          },
          getAllItems: function() {
            var a = this.getAllTreeNodeWidgets();
            return e.map(
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
              a = e.filter(
                a,
                f.hitch(this, function(a) {
                  return a.checkNode.checked;
                })
              );
            return e.map(
              a,
              f.hitch(this, function(a) {
                return a.item;
              })
            );
          },
          getFilteredItems: function(a) {
            var b = this.getAllTreeNodeWidgets(),
              b = e.map(
                b,
                f.hitch(this, function(a) {
                  var b = a.item;
                  b.selected = a.checkNode.checked;
                  return b;
                })
              );
            return e.filter(
              b,
              f.hitch(this, function(b) {
                return a(b);
              })
            );
          },
          getTreeNodeByItemId: function(a) {
            for (var b = this._getAllTreeNodeDoms(), e = 0; e < b.length; e++) {
              var d = q.byNode(b[e]);
              if (d.item.id.toString() === a.toString()) return d;
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
            return e.filter(
              a,
              f.hitch(this, function(a) {
                return a.isLeaf;
              })
            );
          },
          getAllTreeNodeWidgets: function() {
            var a = this._getAllTreeNodeDoms();
            return e.map(
              a,
              f.hitch(this, function(a) {
                return q.byNode(a);
              })
            );
          },
          isLeafItem: function(a) {
            return a && a.isLeaf;
          },
          _getAllTreeNodeDoms: function() {
            return p(".dijitTreeNode", this.domNode);
          },
          _createTreeNode: function(a) {
            a.isLeaf = this.isLeafItem(a.item);
            this.multiple || (a.groupId = this.uniqueId);
            return new w(a);
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
          _jimuBeforeClick: function(a, e, d) {
            e.isLeaf &&
              (b.hasClass(d.target || d.srcElement, "jimu-tree-check-node") ||
                (this.multiple ? e.toggleSelect() : this.selectNodeWidget(e)));
            return arguments;
          },
          _onCheckNodeClick: function(a, b, e) {
            !this.multiple && b && this.unselectAllLeafNodeWidgets();
            k.stop(e);
            this.focusNode(a);
            setTimeout(
              f.hitch(this, function() {
                b ? this.selectNodeWidget(a) : a.unselect();
                this.onClick(a.item, a, e);
              }),
              0
            );
          },
          unselectAllLeafNodeWidgets: function() {
            var a = this.getAllLeafTreeNodeWidgets();
            e.forEach(
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
        h,
        l,
        d,
        g,
        f,
        b,
        e,
        k,
        p,
        t,
        n,
        a,
        v,
        q,
        A,
        m,
        w,
        F,
        r,
        J,
        G,
        K,
        D,
        H,
        I,
        c,
        y,
        C,
        x,
        M,
        N,
        O,
        R,
        P,
        Q
      ) {
        function B(a) {
          return m.delegate(a.promise || a, {
            addCallback: function(a) {
              this.then(a);
            },
            addErrback: function(a) {
              this.otherwise(a);
            }
          });
        }
        var L = g("dijit._TreeNode", [I, c, y, C, x], {
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
            v("dojo-bidi") && this.applyTextDir(this.labelNode);
          },
          labelType: "text",
          isExpandable: null,
          isExpanded: !1,
          state: "NotLoaded",
          templateString: N,
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
            var u = Math.max(a, 0) * this.tree._nodePixelIndent + "px";
            t.set(this.domNode, "backgroundPosition", u + " 0px");
            t.set(
              this.rowNode,
              this.isLeftToRight() ? "paddingLeft" : "paddingRight",
              u
            );
            h.forEach(this.getChildren(), function(u) {
              u.set("indent", a + 1);
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
            var u = this.tree,
              b = u.model;
            u._v10Compat && a === b.root && (a = null);
            this._applyClassAndStyle(a, "icon", "Icon");
            this._applyClassAndStyle(a, "label", "Label");
            this._applyClassAndStyle(a, "row", "Row");
            this.tree._startPaint(!0);
          },
          _applyClassAndStyle: function(a, b, c) {
            var u = "_" + b + "Class";
            b += "Node";
            var e = this[u];
            this[u] = this.tree["get" + c + "Class"](a, this.isExpanded);
            k.replace(this[b], this[u] || "", e || "");
            t.set(
              this[b],
              this.tree["get" + c + "Style"](a, this.isExpanded) || {}
            );
          },
          _updateLayout: function() {
            var a = this.getParent(),
              a = !a || !a.rowNode || "none" == a.rowNode.style.display;
            k.toggle(this.domNode, "dijitTreeIsRoot", a);
            k.toggle(
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
            k.replace(this.expandoNode, b[a], b);
            this.expandoNodeText.innerHTML = ["*", "-", "+", "*"][a];
          },
          expand: function() {
            if (this._expandDeferred) return B(this._expandDeferred);
            this._collapseDeferred &&
              (this._collapseDeferred.cancel(), delete this._collapseDeferred);
            this.isExpanded = !0;
            this.labelNode.setAttribute("aria-expanded", "true");
            (this.tree.showRoot || this !== this.tree.rootNode) &&
              this.containerNode.setAttribute("role", "group");
            k.add(this.contentNode, "dijitTreeContentExpanded");
            this._setExpando();
            this._updateItemClasses(this.item);
            this == this.tree.rootNode &&
              this.tree.showRoot &&
              this.tree.domNode.setAttribute("aria-expanded", "true");
            var b = a.wipeIn({
                node: this.containerNode,
                duration: H.defaultDuration
              }),
              c = (this._expandDeferred = new f(function() {
                b.stop();
              }));
            l.after(
              b,
              "onEnd",
              function() {
                c.resolve(!0);
              },
              !0
            );
            b.play();
            return B(c);
          },
          collapse: function() {
            if (this._collapseDeferred) return B(this._collapseDeferred);
            this._expandDeferred &&
              (this._expandDeferred.cancel(), delete this._expandDeferred);
            this.isExpanded = !1;
            this.labelNode.setAttribute("aria-expanded", "false");
            this == this.tree.rootNode &&
              this.tree.showRoot &&
              this.tree.domNode.setAttribute("aria-expanded", "false");
            k.remove(this.contentNode, "dijitTreeContentExpanded");
            this._setExpando();
            this._updateItemClasses(this.item);
            var b = a.wipeOut({
                node: this.containerNode,
                duration: H.defaultDuration
              }),
              c = (this._collapseDeferred = new f(function() {
                b.stop();
              }));
            l.after(
              b,
              "onEnd",
              function() {
                c.resolve(!0);
              },
              !0
            );
            b.play();
            return B(c);
          },
          indent: 0,
          setChildItems: function(a) {
            var c = this.tree,
              u = c.model,
              d = [],
              f = c.focusedChild,
              g = this.getChildren();
            h.forEach(
              g,
              function(a) {
                y.prototype.removeChild.call(this, a);
              },
              this
            );
            this.defer(function() {
              h.forEach(g, function(a) {
                if (!a._destroyed && !a.getParent()) {
                  var b = function(a) {
                    var e = u.getIdentity(a.item),
                      d = c._itemNodesMap[e];
                    1 == d.length
                      ? delete c._itemNodesMap[e]
                      : ((e = h.indexOf(d, a)), -1 != e && d.splice(e, 1));
                    h.forEach(a.getChildren(), b);
                  };
                  c.dndController.removeTreeNode(a);
                  b(a);
                  if (c.persist) {
                    var d = h
                        .map(a.getTreePath(), function(a) {
                          return c.model.getIdentity(a);
                        })
                        .join("/"),
                      z;
                    for (z in c._openedNodes)
                      z.substr(0, d.length) == d && delete c._openedNodes[z];
                    c._saveExpandedNodes();
                  }
                  c.lastFocusedChild &&
                    !e.isDescendant(c.lastFocusedChild.domNode, c.domNode) &&
                    delete c.lastFocusedChild;
                  f && !e.isDescendant(f.domNode, c.domNode) && c.focus();
                  a.destroyRecursive();
                }
              });
            });
            this.state = "Loaded";
            a && 0 < a.length
              ? ((this.isExpandable = !0),
                h.forEach(
                  a,
                  function(a) {
                    var b = u.getIdentity(a),
                      e = c._itemNodesMap[b],
                      z;
                    if (e)
                      for (var f = 0; f < e.length; f++)
                        if (e[f] && !e[f].getParent()) {
                          z = e[f];
                          z.set("indent", this.indent + 1);
                          break;
                        }
                    z ||
                      ((z = this.tree._createTreeNode({
                        item: a,
                        tree: c,
                        isExpandable: u.mayHaveChildren(a),
                        label: c.getLabel(a),
                        labelType: (c.model && c.model.labelType) || "text",
                        tooltip: c.getTooltip(a),
                        ownerDocument: c.ownerDocument,
                        dir: c.dir,
                        lang: c.lang,
                        textDir: c.textDir,
                        indent: this.indent + 1
                      })),
                      e ? e.push(z) : (c._itemNodesMap[b] = [z]));
                    this.addChild(z);
                    (this.tree.autoExpand || this.tree._state(z)) &&
                      d.push(c._expandNode(z));
                  },
                  this
                ),
                h.forEach(this.getChildren(), function(a) {
                  a._updateLayout();
                }))
              : (this.isExpandable = !1);
            this._setExpando && this._setExpando(!1);
            this._updateItemClasses(this.item);
            a = b(d);
            this.tree._startPaint(a);
            return B(a);
          },
          getTreePath: function() {
            for (var a = this, c = []; a && a !== this.tree.rootNode; )
              c.unshift(a.item), (a = a.getParent());
            c.unshift(this.tree.rootNode.item);
            return c;
          },
          getIdentity: function() {
            return this.tree.model.getIdentity(this.item);
          },
          removeChild: function(a) {
            this.inherited(arguments);
            var c = this.getChildren();
            0 == c.length && ((this.isExpandable = !1), this.collapse());
            h.forEach(c, function(a) {
              a._updateLayout();
            });
          },
          makeExpandable: function() {
            this.isExpandable = !0;
            this._setExpando(!1);
          },
          setSelected: function(a) {
            this.labelNode.setAttribute("aria-selected", a ? "true" : "false");
            k.toggle(this.rowNode, "dijitTreeRowSelected", a);
          },
          focus: function() {
            K.focus(this.focusNode);
          }
        });
        v("dojo-bidi") &&
          L.extend({
            _setTextDirAttr: function(a) {
              !a ||
                (this.textDir == a && this._created) ||
                (this._set("textDir", a),
                this.applyTextDir(this.labelNode),
                h.forEach(
                  this.getChildren(),
                  function(c) {
                    c.set("textDir", a);
                  },
                  this
                ));
            }
          });
        var E = g("dijit.Tree", [I, M, c, x], {
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
          templateString: O,
          persist: !1,
          autoExpand: !1,
          dndController: Q,
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
          _publish: function(a, c) {
            F.publish(this.id, m.mixin({ tree: this, event: a }, c || {}));
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
              w(
                this.containerNode,
                w.selector(".dijitTreeNode", r.enter),
                function(c) {
                  a._onNodeMouseEnter(D.byNode(this), c);
                }
              ),
              w(
                this.containerNode,
                w.selector(".dijitTreeNode", r.leave),
                function(c) {
                  a._onNodeMouseLeave(D.byNode(this), c);
                }
              ),
              w(
                this.containerNode,
                w.selector(".dijitTreeRow", G.press),
                function(c) {
                  a._onNodePress(D.getEnclosingWidget(this), c);
                }
              ),
              w(this.containerNode, w.selector(".dijitTreeRow", G), function(
                c
              ) {
                a._onClick(D.getEnclosingWidget(this), c);
              }),
              w(
                this.containerNode,
                w.selector(".dijitTreeRow", "dblclick"),
                function(c) {
                  a._onDblClick(D.getEnclosingWidget(this), c);
                }
              )
            );
            this.model || this._store2model();
            this.own(
              l.after(
                this.model,
                "onChange",
                m.hitch(this, "_onItemChange"),
                !0
              ),
              l.after(
                this.model,
                "onChildrenChange",
                m.hitch(this, "_onItemChildrenChange"),
                !0
              ),
              l.after(
                this.model,
                "onDelete",
                m.hitch(this, "_onItemDelete"),
                !0
              )
            );
            this.inherited(arguments);
            if (this.dndController) {
              m.isString(this.dndController) &&
                (this.dndController = m.getObject(this.dndController));
              for (var c = {}, b = 0; b < this.dndParams.length; b++)
                this[this.dndParams[b]] &&
                  (c[this.dndParams[b]] = this[this.dndParams[b]]);
              this.dndController = new this.dndController(this, c);
            }
            this._load();
            this.onLoadDeferred = B(this.pendingCommandsPromise);
            this.onLoadDeferred.then(m.hitch(this, "onLoad"));
          },
          _store2model: function() {
            this._v10Compat = !0;
            q.deprecated(
              "Tree: from version 2.0, should specify a model object rather than a store/query"
            );
            var a = {
              id: this.id + "_ForestStoreModel",
              store: this.store,
              query: this.query,
              childrenAttrs: this.childrenAttr
            };
            this.params.mayHaveChildren &&
              (a.mayHaveChildren = m.hitch(this, "mayHaveChildren"));
            this.params.getItemChildren &&
              (a.getChildren = m.hitch(this, function(a, c, b) {
                this.getItemChildren(
                  this._v10Compat && a === this.model.root ? null : a,
                  c,
                  b
                );
              }));
            this.model = new P(a);
            this.showRoot = !!this.label;
          },
          onLoad: function() {},
          _load: function() {
            this.model.getRoot(
              m.hitch(this, function(a) {
                var c = (this.rootNode = this.tree._createTreeNode({
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
                  : ((c.rowNode.style.display = "none"),
                    this.domNode.setAttribute("role", "presentation"),
                    this.domNode.removeAttribute("aria-expanded"),
                    this.domNode.removeAttribute("aria-multiselectable"),
                    this["aria-label"]
                      ? (c.containerNode.setAttribute(
                          "aria-label",
                          this["aria-label"]
                        ),
                        this.domNode.removeAttribute("aria-label"))
                      : this["aria-labelledby"] &&
                        (c.containerNode.setAttribute(
                          "aria-labelledby",
                          this["aria-labelledby"]
                        ),
                        this.domNode.removeAttribute("aria-labelledby")),
                    c.labelNode.setAttribute("role", "presentation"),
                    c.labelNode.removeAttribute("aria-selected"),
                    c.containerNode.setAttribute("role", "tree"),
                    c.containerNode.setAttribute("aria-expanded", "true"),
                    c.containerNode.setAttribute(
                      "aria-multiselectable",
                      !this.dndController.singular
                    ));
                this.containerNode.appendChild(c.domNode);
                a = this.model.getIdentity(a);
                this._itemNodesMap[a]
                  ? this._itemNodesMap[a].push(c)
                  : (this._itemNodesMap[a] = [c]);
                c._updateLayout();
                this._expandNode(c).then(
                  m.hitch(this, function() {
                    this._destroyed ||
                      ((this.rootLoadingIndicator.style.display = "none"),
                      this.expandChildrenDeferred.resolve(!0));
                  })
                );
              }),
              m.hitch(this, function(a) {
                console.error(this, ": error loading root: ", a);
              })
            );
          },
          getNodesByItem: function(a) {
            if (!a) return [];
            a = m.isString(a) ? a : this.model.getIdentity(a);
            return [].concat(this._itemNodesMap[a]);
          },
          _setSelectedItemAttr: function(a) {
            this.set("selectedItems", [a]);
          },
          _setSelectedItemsAttr: function(a) {
            var c = this;
            return (this.pendingCommandsPromise = this.pendingCommandsPromise.always(
              m.hitch(this, function() {
                var b = h.map(a, function(a) {
                    return !a || m.isString(a) ? a : c.model.getIdentity(a);
                  }),
                  e = [];
                h.forEach(b, function(a) {
                  e = e.concat(c._itemNodesMap[a] || []);
                });
                this.set("selectedNodes", e);
              })
            ));
          },
          _setPathAttr: function(a) {
            return a.length
              ? B(
                  this.set("paths", [a]).then(function(a) {
                    return a[0];
                  })
                )
              : B(
                  this.set("paths", []).then(function(a) {
                    return a[0];
                  })
                );
          },
          _setPathsAttr: function(a) {
            function c(a, b) {
              var d = a.shift(),
                u = h.filter(b, function(a) {
                  return a.getIdentity() == d;
                })[0];
              if (u)
                return a.length
                  ? e._expandNode(u).then(function() {
                      return c(a, u.getChildren());
                    })
                  : u;
              throw new E.PathError("Could not expand path at " + d);
            }
            var e = this;
            return B(
              (this.pendingCommandsPromise = this.pendingCommandsPromise
                .always(function() {
                  return b(
                    h.map(a, function(a) {
                      a = h.map(a, function(a) {
                        return a && m.isObject(a) ? e.model.getIdentity(a) : a;
                      });
                      if (a.length) return c(a, [e.rootNode]);
                      throw new E.PathError("Empty path");
                    })
                  );
                })
                .then(function(a) {
                  e.set("selectedNodes", a);
                  return e.paths;
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
            function a(e) {
              return c._expandNode(e).then(function() {
                var c = h.filter(e.getChildren() || [], function(a) {
                  return a.isExpandable;
                });
                return b(h.map(c, a));
              });
            }
            var c = this;
            return B(a(this.rootNode));
          },
          collapseAll: function() {
            function a(e) {
              var d = h.filter(e.getChildren() || [], function(a) {
                  return a.isExpandable;
                }),
                d = b(h.map(d, a));
              return !e.isExpanded || (e == c.rootNode && !c.showRoot)
                ? d
                : d.then(function() {
                    return c._collapseNode(e);
                  });
            }
            var c = this;
            return B(a(this.rootNode));
          },
          mayHaveChildren: function() {},
          getItemChildren: function() {},
          getLabel: function(a) {
            return this.model.getLabel(a);
          },
          getIconClass: function(a, c) {
            return !a || this.model.mayHaveChildren(a)
              ? c
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
          _onDownArrow: function(a, c) {
            (a = this._getNext(c)) && a.isTreeNode && this.focusNode(a);
          },
          _onUpArrow: function(a, c) {
            if ((a = c.getPreviousSibling()))
              for (c = a; c.isExpandable && c.isExpanded && c.hasChildren(); )
                (c = c.getChildren()), (c = c[c.length - 1]);
            else if (
              ((a = c.getParent()), this.showRoot || a !== this.rootNode)
            )
              c = a;
            c && c.isTreeNode && this.focusNode(c);
          },
          _onRightArrow: function(a, c) {
            c.isExpandable && !c.isExpanded
              ? this._expandNode(c)
              : c.hasChildren() &&
                (c = c.getChildren()[0]) &&
                c.isTreeNode &&
                this.focusNode(c);
          },
          _onLeftArrow: function(a, c) {
            c.isExpandable && c.isExpanded
              ? this._collapseNode(c)
              : (a = c.getParent()) &&
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
              var c = a.getChildren();
              if (!c.length) break;
              a = c[c.length - 1];
            }
            return a;
          },
          _getNext: function(a) {
            if (a.isExpandable && a.isExpanded && a.hasChildren())
              return a.getChildren()[0];
            for (; a && a.isTreeNode; ) {
              var c = a.getNextSibling();
              if (c) return c;
              a = a.getParent();
            }
            return null;
          },
          childSelector: ".dijitTreeRow",
          isExpandoNode: function(a, c) {
            return (
              e.isDescendant(a, c.expandoNode) ||
              e.isDescendant(a, c.expandoNodeText)
            );
          },
          _onNodePress: function(a, c) {
            this.focusNode(a);
          },
          __click: function(a, c, b, e) {
            var d = this.isExpandoNode(c.target, a);
            a.isExpandable && (b || d)
              ? this._onExpandoClick({ node: a })
              : (this._publish("execute", { item: a.item, node: a, evt: c }),
                this[e](a.item, a, c),
                this.focusNode(a));
            c.stopPropagation();
            c.preventDefault();
          },
          _onClick: function(a, c) {
            this.__click(a, c, this.openOnClick, "onClick");
          },
          _onDblClick: function(a, c) {
            this.__click(a, c, this.openOnDblClick, "onDblClick");
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
            q.deprecated(
              this.declaredClass +
                "::_getNextNode(node) is deprecated. Use _getNext(node) instead.",
              "",
              "2.0"
            );
            return this._getNext(a);
          },
          _getRootOrFirstNode: function() {
            q.deprecated(
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
              var c = a.collapse();
              this.onClose(a.item, a);
              this._state(a, !1);
              this._startPaint(c);
              return c;
            }
          },
          _expandNode: function(a) {
            if (a._expandNodeDeferred) return a._expandNodeDeferred;
            var c = this.model,
              b = a.item,
              e = this;
            a._loadDeferred ||
              (a.markProcessing(),
              (a._loadDeferred = new f()),
              c.getChildren(
                b,
                function(c) {
                  a.unmarkProcessing();
                  a.setChildItems(c).then(function() {
                    a._loadDeferred.resolve(c);
                  });
                },
                function(c) {
                  console.error(
                    e,
                    ": error loading " + a.label + " children: ",
                    c
                  );
                  a._loadDeferred.reject(c);
                }
              ));
            c = a._loadDeferred.then(
              m.hitch(this, function() {
                var c = a.expand();
                this.onOpen(a.item, a);
                this._state(a, !0);
                return c;
              })
            );
            this._startPaint(c);
            return c;
          },
          focusNode: function(a) {
            for (
              var c = [], b = this.domNode;
              b && b.tagName && "IFRAME" !== b.tagName.toUpperCase();
              b = b.parentNode
            )
              c.push({
                domNode: b.contentWindow || b,
                scrollLeft: b.scrollLeft || 0,
                scrollTop: b.scrollTop || 0
              });
            this.focusChild(a);
            this.defer(function() {
              for (var a = 0, b = c.length; a < b; a++)
                (c[a].domNode.scrollLeft = c[a].scrollLeft),
                  (c[a].domNode.scrollTop = c[a].scrollTop);
            }, 0);
          },
          _onNodeMouseEnter: function() {},
          _onNodeMouseLeave: function() {},
          _onItemChange: function(a) {
            var c = this.model.getIdentity(a);
            if ((c = this._itemNodesMap[c])) {
              var b = this.getLabel(a),
                e = this.getTooltip(a);
              h.forEach(c, function(c) {
                c.set({ item: a, label: b, tooltip: e });
                c._updateItemClasses(a);
              });
            }
          },
          _onItemChildrenChange: function(a, c) {
            a = this.model.getIdentity(a);
            (a = this._itemNodesMap[a]) &&
              h.forEach(a, function(a) {
                a.setChildItems(c);
              });
          },
          _onItemDelete: function(a) {
            a = this.model.getIdentity(a);
            var c = this._itemNodesMap[a];
            c &&
              (h.forEach(
                c,
                function(a) {
                  this.dndController.removeTreeNode(a);
                  var c = a.getParent();
                  c && c.removeChild(a);
                  this.lastFocusedChild &&
                    !e.isDescendant(
                      this.lastFocusedChild.domNode,
                      this.domNode
                    ) &&
                    delete this.lastFocusedChild;
                  this.focusedChild &&
                    !e.isDescendant(this.focusedChild.domNode, this.domNode) &&
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
              var a = d(this.cookieName);
              a &&
                h.forEach(
                  a.split(","),
                  function(a) {
                    this._openedNodes[a] = !0;
                  },
                  this
                );
            }
          },
          _state: function(a, c) {
            if (!this.persist) return !1;
            var b = h
              .map(
                a.getTreePath(),
                function(a) {
                  return this.model.getIdentity(a);
                },
                this
              )
              .join("/");
            if (1 === arguments.length) return this._openedNodes[b];
            c ? (this._openedNodes[b] = !0) : delete this._openedNodes[b];
            this._saveExpandedNodes();
          },
          _saveExpandedNodes: function() {
            if (this.persist && this.cookieName) {
              var a = [],
                c;
              for (c in this._openedNodes) a.push(c);
              d(this.cookieName, a.join(","), { expires: 365 });
            }
          },
          destroy: function() {
            this._curSearch &&
              (this._curSearch.timer.remove(), delete this._curSearch);
            this.rootNode && this.rootNode.destroyRecursive();
            this.dndController &&
              !m.isString(this.dndController) &&
              this.dndController.destroy();
            this.rootNode = null;
            this.inherited(arguments);
          },
          destroyRecursive: function() {
            this.destroy();
          },
          resize: function(a) {
            a && p.setMarginBox(this.domNode, a);
            this._nodePixelIndent =
              p.position(this.tree.indentDetector).w || this._nodePixelIndent;
            this.expandChildrenDeferred.then(
              m.hitch(this, function() {
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
            var c = m.hitch(this, function() {
              this._outstandingPaintOperations--;
              0 >= this._outstandingPaintOperations &&
                !this._adjustWidthsTimer &&
                this._started &&
                (this._adjustWidthsTimer = this.defer("_adjustWidths"));
            });
            J(a, c, c);
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
            return new L(a);
          },
          focus: function() {
            this.lastFocusedChild
              ? this.focusNode(this.lastFocusedChild)
              : this.focusFirstChild();
          }
        });
        v("dojo-bidi") &&
          E.extend({
            _setTextDirAttr: function(a) {
              a &&
                this.textDir != a &&
                (this._set("textDir", a), this.rootNode.set("textDir", a));
            }
          });
        E.PathError = n("TreePathError");
        E._TreeNode = L;
        return E;
      });
    },
    "dijit/tree/TreeStoreModel": function() {
      define([
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/_base/declare",
        "dojo/_base/lang"
      ], function(h, l, d, g) {
        return d("dijit.tree.TreeStoreModel", null, {
          store: null,
          childrenAttrs: ["children"],
          newItemIdAttr: "id",
          labelAttr: "",
          root: null,
          query: null,
          deferItemLoadingUntilExpand: !1,
          constructor: function(d) {
            g.mixin(this, d);
            this.connects = [];
            d = this.store;
            if (!d.getFeatures()["dojo.data.api.Identity"])
              throw Error(
                "dijit.tree.TreeStoreModel: store must support dojo.data.Identity"
              );
            d.getFeatures()["dojo.data.api.Notification"] &&
              (this.connects = this.connects.concat([
                l.after(d, "onNew", g.hitch(this, "onNewItem"), !0),
                l.after(d, "onDelete", g.hitch(this, "onDeleteItem"), !0),
                l.after(d, "onSet", g.hitch(this, "onSetItem"), !0)
              ]));
          },
          destroy: function() {
            for (var d; (d = this.connects.pop()); ) d.remove();
          },
          getRoot: function(d, b) {
            this.root
              ? d(this.root)
              : this.store.fetch({
                  query: this.query,
                  onComplete: g.hitch(this, function(b) {
                    if (1 != b.length)
                      throw Error(
                        "dijit.tree.TreeStoreModel: root query returned " +
                          b.length +
                          " items, but must return exactly one"
                      );
                    this.root = b[0];
                    d(this.root);
                  }),
                  onError: b
                });
          },
          mayHaveChildren: function(d) {
            return h.some(
              this.childrenAttrs,
              function(b) {
                return this.store.hasAttribute(d, b);
              },
              this
            );
          },
          getChildren: function(d, b, e) {
            var f = this.store;
            if (f.isItemLoaded(d)) {
              for (var p = [], l = 0; l < this.childrenAttrs.length; l++)
                var n = f.getValues(d, this.childrenAttrs[l]), p = p.concat(n);
              var a = 0;
              this.deferItemLoadingUntilExpand ||
                h.forEach(p, function(b) {
                  f.isItemLoaded(b) || a++;
                });
              0 == a
                ? b(p)
                : h.forEach(p, function(d, g) {
                    f.isItemLoaded(d) ||
                      f.loadItem({
                        item: d,
                        onItem: function(e) {
                          p[g] = e;
                          0 == --a && b(p);
                        },
                        onError: e
                      });
                  });
            } else {
              var v = g.hitch(this, arguments.callee);
              f.loadItem({
                item: d,
                onItem: function(a) {
                  v(a, b, e);
                },
                onError: e
              });
            }
          },
          isItem: function(d) {
            return this.store.isItem(d);
          },
          fetchItemByIdentity: function(d) {
            this.store.fetchItemByIdentity(d);
          },
          getIdentity: function(d) {
            return this.store.getIdentity(d);
          },
          getLabel: function(d) {
            return this.labelAttr
              ? this.store.getValue(d, this.labelAttr)
              : this.store.getLabel(d);
          },
          newItem: function(d, b, e) {
            var f = { parent: b, attribute: this.childrenAttrs[0] },
              g;
            this.newItemIdAttr && d[this.newItemIdAttr]
              ? this.fetchItemByIdentity({
                  identity: d[this.newItemIdAttr],
                  scope: this,
                  onItem: function(h) {
                    h
                      ? this.pasteItem(h, null, b, !0, e)
                      : (g = this.store.newItem(d, f)) &&
                        void 0 != e &&
                        this.pasteItem(g, b, b, !1, e);
                  }
                })
              : (g = this.store.newItem(d, f)) &&
                void 0 != e &&
                this.pasteItem(g, b, b, !1, e);
          },
          pasteItem: function(d, b, e, g, p) {
            var f = this.store,
              k = this.childrenAttrs[0];
            b &&
              h.forEach(this.childrenAttrs, function(a) {
                if (f.containsValue(b, a, d)) {
                  if (!g) {
                    var e = h.filter(f.getValues(b, a), function(a) {
                      return a != d;
                    });
                    f.setValues(b, a, e);
                  }
                  k = a;
                }
              });
            if (e)
              if ("number" == typeof p) {
                var a = f.getValues(e, k).slice();
                a.splice(p, 0, d);
                f.setValues(e, k, a);
              } else f.setValues(e, k, f.getValues(e, k).concat(d));
          },
          onChange: function() {},
          onChildrenChange: function() {},
          onDelete: function() {},
          onNewItem: function(d, b) {
            b &&
              this.getChildren(
                b.item,
                g.hitch(this, function(e) {
                  this.onChildrenChange(b.item, e);
                })
              );
          },
          onDeleteItem: function(d) {
            this.onDelete(d);
          },
          onSetItem: function(d, b) {
            if (-1 != h.indexOf(this.childrenAttrs, b))
              this.getChildren(
                d,
                g.hitch(this, function(b) {
                  this.onChildrenChange(d, b);
                })
              );
            else this.onChange(d);
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
      ], function(h, l, d, g, f) {
        return l("dijit.tree.ForestStoreModel", f, {
          rootId: "$root$",
          rootLabel: "ROOT",
          query: null,
          constructor: function(b) {
            this.root = {
              store: this,
              root: !0,
              id: b.rootId,
              label: b.rootLabel,
              children: b.rootChildren
            };
          },
          mayHaveChildren: function(b) {
            return b === this.root || this.inherited(arguments);
          },
          getChildren: function(b, e, d) {
            b === this.root
              ? this.root.children
                ? e(this.root.children)
                : this.store.fetch({
                    query: this.query,
                    onComplete: g.hitch(this, function(b) {
                      this.root.children = b;
                      e(b);
                    }),
                    onError: d
                  })
              : this.inherited(arguments);
          },
          isItem: function(b) {
            return b === this.root ? !0 : this.inherited(arguments);
          },
          fetchItemByIdentity: function(b) {
            if (b.identity == this.root.id) {
              var e = b.scope || d.global;
              b.onItem && b.onItem.call(e, this.root);
            } else this.inherited(arguments);
          },
          getIdentity: function(b) {
            return b === this.root ? this.root.id : this.inherited(arguments);
          },
          getLabel: function(b) {
            return b === this.root
              ? this.root.label
              : this.inherited(arguments);
          },
          newItem: function(b, e, d) {
            return e === this.root
              ? (this.onNewRootItem(b), this.store.newItem(b))
              : this.inherited(arguments);
          },
          onNewRootItem: function() {},
          pasteItem: function(b, e, d, f, g) {
            if (e === this.root && !f) this.onLeaveRoot(b);
            this.inherited(arguments, [
              b,
              e === this.root ? null : e,
              d === this.root ? null : d,
              f,
              g
            ]);
            if (d === this.root) this.onAddToRoot(b);
          },
          onAddToRoot: function(b) {
            console.log(this, ": item ", b, " added to root");
          },
          onLeaveRoot: function(b) {
            console.log(this, ": item ", b, " removed from root");
          },
          _requeryTop: function() {
            var b = this.root.children || [];
            this.store.fetch({
              query: this.query,
              onComplete: g.hitch(this, function(d) {
                this.root.children = d;
                if (
                  b.length != d.length ||
                  h.some(b, function(b, e) {
                    return d[e] != b;
                  })
                )
                  this.onChildrenChange(this.root, d);
              })
            });
          },
          onNewItem: function(b, d) {
            this._requeryTop();
            this.inherited(arguments);
          },
          onDeleteItem: function(b) {
            -1 != h.indexOf(this.root.children, b) && this._requeryTop();
            this.inherited(arguments);
          },
          onSetItem: function(b, d, f, g) {
            this._requeryTop();
            this.inherited(arguments);
          }
        });
      });
    },
    "dijit/tree/_dndSelector": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/dnd/common dojo/dom dojo/mouse dojo/on dojo/touch ../a11yclick ./_dndContainer".split(
        " "
      ), function(h, l, d, g, f, b, e, k, p, t, n) {
        return l("dijit.tree._dndSelector", n, {
          constructor: function() {
            this.selection = {};
            this.anchor = null;
            this.events.push(
              k(this.tree.domNode, p.press, g.hitch(this, "onMouseDown")),
              k(this.tree.domNode, p.release, g.hitch(this, "onMouseUp")),
              k(this.tree.domNode, p.move, g.hitch(this, "onMouseMove")),
              k(this.tree.domNode, t.press, g.hitch(this, "onClickPress")),
              k(this.tree.domNode, t.release, g.hitch(this, "onClickRelease"))
            );
          },
          singular: !1,
          getSelectedTreeNodes: function() {
            var a = [],
              b = this.selection,
              d;
            for (d in b) a.push(b[d]);
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
            var d = h.filter(this.getSelectedTreeNodes(), function(d) {
              return !b.isDescendant(d.domNode, a.domNode);
            });
            this.setSelection(d);
            return a;
          },
          isTreeNodeSelected: function(a) {
            return a.id && !!this.selection[a.id];
          },
          setSelection: function(a) {
            var b = this.getSelectedTreeNodes();
            h.forEach(
              this._setDifference(b, a),
              g.hitch(this, function(a) {
                a.setSelected(!1);
                this.anchor == a && delete this.anchor;
                delete this.selection[a.id];
              })
            );
            h.forEach(
              this._setDifference(a, b),
              g.hitch(this, function(a) {
                a.setSelected(!0);
                this.selection[a.id] = a;
              })
            );
            this._updateSelectionProperties();
          },
          _setDifference: function(a, b) {
            h.forEach(b, function(a) {
              a.__exclude__ = !0;
            });
            a = h.filter(a, function(a) {
              return !a.__exclude__;
            });
            h.forEach(b, function(a) {
              delete a.__exclude__;
            });
            return a;
          },
          _updateSelectionProperties: function() {
            var a = this.getSelectedTreeNodes(),
              b = [],
              d = [];
            h.forEach(
              a,
              function(a) {
                var e = a.getTreePath();
                d.push(a);
                b.push(e);
              },
              this
            );
            a = h.map(d, function(a) {
              return a.item;
            });
            this.tree._set("paths", b);
            this.tree._set("path", b[0] || []);
            this.tree._set("selectedNodes", d);
            this.tree._set("selectedNode", d[0] || null);
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
              "mousedown" == a.type && e.isLeft(a) && a.preventDefault();
              var b =
                "keydown" == a.type ? this.tree.focusedChild : this.current;
              if (b) {
                var d = f.getCopyKeyState(a),
                  g = b.id;
                this.singular || a.shiftKey || !this.selection[g]
                  ? ((this._doDeselect = !1), this.userSelect(b, d, a.shiftKey))
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
          userSelect: function(a, b, d) {
            if (this.singular)
              this.anchor == a && b
                ? this.selectNone()
                : (this.setSelection([a]), (this.anchor = a));
            else if (d && this.anchor) {
              b = this._compareNodes(this.anchor.rowNode, a.rowNode);
              d = this.anchor;
              0 > b ? (b = d) : ((b = a), (a = d));
              for (d = []; b != a; ) d.push(b), (b = this.tree._getNext(b));
              d.push(a);
              this.setSelection(d);
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
            b = b || d.global;
            for (var e in this.selection) a.call(b, this.getItem(e), e, this);
          }
        });
      });
    },
    "dijit/tree/_dndContainer": function() {
      define("dojo/aspect dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/on dojo/touch".split(
        " "
      ), function(h, l, d, g, f, b) {
        return l("dijit.tree._dndContainer", null, {
          constructor: function(e, k) {
            this.tree = e;
            this.node = e.domNode;
            g.mixin(this, k);
            this.containerState = "";
            d.add(this.node, "dojoDndContainer");
            this.events = [
              f(this.node, b.enter, g.hitch(this, "onOverEvent")),
              f(this.node, b.leave, g.hitch(this, "onOutEvent")),
              h.after(
                this.tree,
                "_onNodeMouseEnter",
                g.hitch(this, "onMouseOver"),
                !0
              ),
              h.after(
                this.tree,
                "_onNodeMouseLeave",
                g.hitch(this, "onMouseOut"),
                !0
              ),
              f(this.node, "dragstart, selectstart", function(b) {
                b.preventDefault();
              })
            ];
          },
          destroy: function() {
            for (var b; (b = this.events.pop()); ) b.remove();
            this.node = this.parent = null;
          },
          onMouseOver: function(b) {
            this.current = b;
          },
          onMouseOut: function() {
            this.current = null;
          },
          _changeState: function(b, f) {
            var e = "dojoDnd" + b;
            b = b.toLowerCase() + "State";
            d.replace(this.node, e + f, e + this[b]);
            this[b] = f;
          },
          _addItemClass: function(b, f) {
            d.add(b, "dojoDndItem" + f);
          },
          _removeItemClass: function(b, f) {
            d.remove(b, "dojoDndItem" + f);
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
    "jimu/dijit/QueryableLayerChooserFromMap": function() {
      define([
        "dojo/_base/lang",
        "dojo/_base/html",
        "dojo/_base/declare",
        "./LayerChooserFromMap"
      ], function(h, l, d, g) {
        return d([g], {
          baseClass: "jimu-queryable-layer-chooser-from-map",
          declaredClass: "jimu.dijit.QueryableLayerChooserFromMap",
          showImageLayer: !0,
          mustSupportStatistics: !1,
          ignoreVirtualLayer: !1,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.filter = this.showImageLayer
              ? g.createQueryableLayerFilter(this.mustSupportStatistics)
              : g.createFeaturelayerFilter(
                  ["point", "polyline", "polygon"],
                  !1,
                  !0,
                  this.mustSupportStatistics
                );
            this.ignoreVirtualLayer &&
              (this.filter = g.andCombineFilters([
                this.filter,
                h.hitch(this, this._ignoreVirtualLayerFilter)
              ]));
          },
          _ignoreVirtualLayerFilter: function(d) {
            return d.getLayerType().then(function(b) {
              return !(
                "ArcGISDynamicMapServiceLayer" === b ||
                "ArcGISTiledMapServiceLayer" === b ||
                "GroupLayer" === b
              );
            });
          },
          postCreate: function() {
            this.inherited(arguments);
            l.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
          },
          getHandledItem: function(d) {
            var b = this.inherited(arguments),
              e = d && d.layerInfo,
              e = e && e.layerObject;
            b.url = (e && e.url) || "";
            return b;
          }
        });
      });
    },
    "jimu/dijit/ToggleButton": function() {
      define("dojo/_base/declare dijit/_WidgetBase dojo/_base/lang dojo/_base/html dojo/on dojo/keys dojo/Evented".split(
        " "
      ), function(h, l, d, g, f, b, e) {
        return h([l, e], {
          baseClass: "jimu-toggle-button",
          declaredClass: "jimu.dijit.ToggleButton",
          checked: !1,
          postCreate: function() {
            var e = this.toggleTips
              ? this.toggleTips
              : window.jimuNls.toggleButton;
            this.toggleTips = { true: e.toggleOn, false: e.toggleOff };
            g.setAttr(this.domNode, "role", "button");
            g.setAttr(this.domNode, "tabindex", "0");
            this._setDomNodeAttrs();
            this.innerNode = g.create("div", { class: "inner" }, this.domNode);
            this.checked && g.addClass(this.domNode, "checked");
            this.own(
              f(
                this.domNode,
                "click",
                d.hitch(this, function() {
                  this.toggle();
                })
              )
            );
            this.own(
              f(
                this.domNode,
                "keydown",
                d.hitch(this, function(d) {
                  (d.keyCode !== b.ENTER && d.keyCode !== b.SPACE) ||
                    this.toggle();
                })
              )
            );
          },
          _setDomNodeAttrs: function() {
            g.setAttr(
              this.domNode,
              "aria-label",
              this.toggleTips[!this.checked + ""]
            );
            g.setAttr(this.domNode, "aria-pressed", this.checked + "");
          },
          resetToggleTips: function(b) {
            this.toggleTips = { true: b.toggleOn, false: b.toggleOff };
            this._setDomNodeAttrs();
          },
          check: function() {
            this.checked = !0;
            g.addClass(this.domNode, "checked");
            this._setDomNodeAttrs();
            this.emit("change", this.checked);
          },
          uncheck: function() {
            this.checked = !1;
            g.removeClass(this.domNode, "checked");
            this._setDomNodeAttrs();
            this.emit("change", this.checked);
          },
          toggle: function() {
            this.checked ? this.uncheck() : this.check();
          },
          setValue: function(b) {
            this.checked !== b && this.toggle();
          }
        });
      });
    },
    "dojo/NodeList": function() {
      define(["./query"], function(h) {
        return h.NodeList;
      });
    },
    "widgets/Filter/_build-generate_module": function() {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:jimu/dijit/templates/LayerChooserFromMapWithDropbox.html":
      '\x3cdiv\x3e\r\n\x3ctable role\x3d"listbox" aria-haspopup\x3d"true" data-dojo-attach-point\x3d"dropDownBtn" data-dojo-attach-event\x3d"onclick: _onDropDownClick,onkeydown: _onDropDownKeydown"\r\n  tabindex\x3d"0" title\x3d"${nls.customSelectLayer}" aria-label\x3d"${nls.customSelectLayer}"\x3e\r\n    \x3ccaption class\x3d"screen-readers-only-no-position"\x3e${nls.customSelectLayer}\x3c/caption\x3e\r\n    \x3ccolgroup\x3e\r\n      \x3ccol width\x3d"10px"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"30px"\x3e\x3c/col\x3e\r\n    \x3c/colgroup\x3e\r\n    \x3ctbody\x3e\r\n      \x3ctr\x3e\r\n        \x3ctd\x3e\x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"layer-name jimu-ellipsis" data-dojo-attach-point\x3d"layerNameNode"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"drop-select jimu-float-trailing" data-dojo-attach-point\x3d"dropArrowNode"\x3e\r\n            \x3cdiv class\x3d"jimu-icon jimu-icon-down-arrow-8"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n    \x3c/tbody\x3e\r\n  \x3c/table\x3e\r\n\x3c/div\x3e\r\n',
    "url:jimu/dijit/templates/_TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"contentNode" class\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem" tabindex\x3d"-1" aria-selected\x3d"false"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation" style\x3d"display: none;"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:dijit/templates/TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"contentNode"\r\n\t\t\tclass\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem"\r\n\t\t\t\t   tabindex\x3d"-1" aria-selected\x3d"false" id\x3d"${id}_label"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\r\n\t\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation"\r\n\t\t style\x3d"display: none;" aria-labelledby\x3d"${id}_label"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:dijit/templates/Tree.html":
      '\x3cdiv role\x3d"tree"\x3e\r\n\t\x3cdiv class\x3d"dijitInline dijitTreeIndent" style\x3d"position: absolute; top: -9999px" data-dojo-attach-point\x3d"indentDetector"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"dijitTreeExpando dijitTreeExpandoLoading" data-dojo-attach-point\x3d"rootLoadingIndicator"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeContainer" role\x3d"presentation"\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/Filter/Widget.html":
      '\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"filterListContainerNode" style\x3d"height: 100%"\x3e\r\n    \x3cul class\x3d"filter-list" data-dojo-attach-point\x3d"filterList"\x3e\x3c/ul\x3e\r\n\r\n    \x3cdiv role\x3d"button" aria-haspopup\x3d"true" class\x3d"action-icon group-icon absolute-icon" data-dojo-attach-point\x3d"showFilterActionsButtonNode" data-dojo-attach-event\x3d"onclick:_onShowFilterActionsClick, onkeydown:_onShowFilterActionsKeydown" title\x3d"${nls.filterActions}" tabindex\x3d"0"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"filter-actions-container" data-dojo-attach-point\x3d"filterActionsPopup"\x3e\r\n      \x3cdiv class\x3d"filter-actions-flex-container"\x3e\r\n        \x3cdiv role\x3d"button" class\x3d"action-icon turn-off-icon" data-dojo-attach-point\x3d"showTurnOffAllButtonNode" data-dojo-attach-event\x3d"onclick:_onShowTurnOffAllClick, onkeydown:_onShowTurnOffAllKeydown" title\x3d"${nls.turnOffAll}" tabindex\x3d"0"\x3e\x3c/div\x3e\r\n        \x3cdiv role\x3d"button" class\x3d"action-icon reset-all-icon" data-dojo-attach-point\x3d"showResetAllButtonNode" data-dojo-attach-event\x3d"onclick:_onShowResetAllClick, onkeydown:_onShowResetAllKeydown" title\x3d"${nls.resetAll}" tabindex\x3d"0"\x3e\x3c/div\x3e\r\n        \x3cdiv role\x3d"button" class\x3d"action-icon custom-icon" data-dojo-attach-point\x3d"showCustomButtonNode" data-dojo-attach-event\x3d"onclick:_onShowCustomClick, onkeydown:_onShowCustomKeydown" title\x3d"${nls.createCustomFilter}" tabindex\x3d"0"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n  \x3cdiv class\x3d"custom-filter" data-dojo-attach-point\x3d"customFilterContainerNode"\x3e\r\n    \x3cdiv class\x3d"title-part"\x3e\r\n      \x3cspan role\x3d"button" tabindex\x3d"0" class\x3d"back-list" data-dojo-attach-point\x3d"customBackNode" data-dojo-attach-event\x3d"click:_onBackToListClick,keydown:_onBackToListKeydown"\x3e\x3c/span\x3e\r\n      \x3cspan\x3e${nls.customFilter}\x3c/span\x3e\r\n      \x3cdiv class\x3d"toggle-filter" data-dojo-type\x3d"jimu/dijit/ToggleButton" data-dojo-props\x3d"checked:true,toggleTips:{toggleOn:\'${nls.toggleOn}\',toggleOff:\'${nls.toggleOff}\'}" title\x3d"${nls.toggleCustomFilter}" data-dojo-attach-event\x3d"change:_onCustomFilterToggle" data-dojo-attach-point\x3d"customFilterToggleButton"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv class\x3d"layer-part"\x3e\r\n      \x3cdiv class\x3d"layer-title"\x3e${jimuNls.common.layer}\x3c/div\x3e\r\n      \x3cdiv class\x3d"layer-select" data-dojo-attach-point\x3d"layerSelectNode"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv class\x3d"custom-filter-node" data-dojo-attach-point\x3d"customFilterNode"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n\x3c/div\x3e',
    "url:widgets/Filter/css/style.css":
      ".jimu-widget-filter {position: relative; width: auto; height: 100%; margin: -14px;}.jimu-widget-filter .filter-list{height: 100%; overflow-y: auto;}.jimu-widget-filter .filter-list,.jimu-widget-filter .filter-list li {margin: 0; padding: 0;}.jimu-widget-filter .filter-list li {list-style: none;}.jimu-widget-filter .filter-list .filter-item{border-bottom: 1px solid #eee; font-size: 12px; overflow: hidden;}.jimu-widget-filter .filter-list .filter-item.config-parameters{background-color: #f3f3f3;}.jimu-widget-filter .filter-list .filter-item.config-parameters + .filter-item.config-parameters{padding-top: 4px; background-clip: content-box;}.jimu-widget-filter .filter-list .filter-item .header{vertical-align: middle; padding: 12px 5px; min-height: 40px; cursor: pointer; position: relative;}.jimu-widget-filter .filter-list .filter-item .header:hover{background-color: #eee;}.jimu-widget-filter .filter-list .filter-item.config-parameters .header .item-title{font-family: 'Avenir Medium', Verdana, Geneva, sans-serif;}.jimu-widget-filter .filter-list .filter-item .body{display: none;}.jimu-widget-filter .filter-list .filter-item.config-parameters .body{display: block;}.jimu-widget-filter .filter-list .filter-item .header\x3e*{display: inline-block; vertical-align: middle; word-break: break-word;}.jimu-widget-filter .filter-list .filter-item .header\x3e.icon{vertical-align: top;}.jimu-widget-filter .filter-list .filter-item .header:after{content: \"\"; height: 100%; min-height: 16px; vertical-align: top; display: inline-block;}.jimu-widget-filter .filter-list .filter-item .header .icon{width: 16px; height: 16px; margin-right: 10px;}.jimu-widget-filter .filter-list .filter-item .header .symbolIcon{margin-top: 3px;}.jimu-rtl .jimu-widget-filter .filter-list .filter-item .header .icon{margin-right: 0; margin-left: 10px;}.jimu-widget-filter .filter-list .filter-item .header .icon img{width: 100%; height: 100%;}.jimu-widget-filter .filter-list .filter-item .header .toggle-filter{position: absolute; top: 14px; right: 0;}.jimu-rtl .jimu-widget-filter .filter-list .filter-item .header .toggle-filter{left: 0; right: auto;}.jimu-widget-filter .filter-list .filter-item .header .arrow{content: ''; border-radius: 50%; width: 16px; height: 16px; top: 12px; text-indent: -9999em; background: url('./images/arrow_normal.svg') no-repeat center; z-index: 10;}.jimu-widget-filter .filter-list .filter-item .header .arrow:hover{background: url('./images/arrow_hover.svg') no-repeat center;}.jimu-widget-filter .filter-list .filter-item.config-parameters .header .arrow{transform: rotate(90deg);}.jimu-widget-filter .filter-list .filter-item.not-has-ask-for-value .header .arrow{background: transparent !important;}.jimu-widget-filter .filter-list .filter-item .header .error{content: ''; width: 16px; height: 16px; top: 12px; text-indent: -9999em; background: url('./images/error_default.png') no-repeat center; z-index: 10;}.jimu-widget-filter .filter-list .filter-item .body .parameters{margin: 0 30px;}.jimu-widget-filter .filter-list .filter-item .body .jimu-btn{background: #fff; border-radius: 0; width: 82px; border: 1px solid #c7c7c7; color: #000; font-size: 12px; margin-bottom: 15px;}.jimu-widget-filter .filter-list .filter-item .body .jimu-btn:hover{border: 1px solid #000;}.jimu-widget-filter .jimu-loading-shelter .loading-container{width: auto;}.jimu-widget-filter.not-exist-ask-for-value .filter-list .filter-item .arrow{display: none;}.jimu-widget-filter .action-icon{width: 40px; height: 40px; border-radius: 20px; background-color: #333; border: 2px solid rgba(255, 255, 255, 0.5); background-position: center; background-repeat: no-repeat; cursor: pointer;}.jimu-widget-filter .action-icon:hover{background-color: #666;}.jimu-widget-filter .action-icon.group-icon{position: absolute; bottom: 0px; right: 20px; background-image: url(images/filter_actions.svg); display: none;}.jimu-widget-filter .action-icon.group-icon.active{background-image: url(images/filter_actions_close.svg);}.jimu-rtl .jimu-widget-filter .action-icon.group-icon{left: 20px; right: auto;}.jimu-widget-filter .filter-actions-container{display: none; position: absolute; bottom: 0px; right: 65px;}.jimu-rtl .jimu-widget-filter .filter-actions-container{right: 0; right: auto; left: 65px;}.jimu-widget-filter .filter-actions-container .filter-actions-flex-container{display: flex;}.jimu-widget-filter .filter-actions-container .action-icon{display: none; margin-left: 5px;}.jimu-rtl .jimu-widget-filter .filter-actions-container .action-icon{margin-left: 0; margin-right: 5px;}.jimu-widget-filter .filter-actions-container .action-icon.custom-icon{background-image: url(images/custom_filter.svg);}.jimu-widget-filter .filter-actions-container .action-icon.reset-all-icon{background-image: url(images/reset_all.svg);}.jimu-widget-filter .filter-actions-container .action-icon.turn-off-icon{background-image: url(images/turn_off_all.svg);}.jimu-rtl .jimu-widget-filter .filter-actions-container .action-icon.turn-off-icon{transform: rotateY(180deg);}.jimu-widget-filter .filter-actions-container .action-icon.absolute-icon{display: block; position: absolute; right: -45px; bottom: 0px;}.jimu-rtl .jimu-widget-filter .filter-actions-container .action-icon.absolute-icon{left: -45px; right: auto;}.jimu-widget-filter .custom-filter{display: none; height: 100%; position: relative;}.jimu-widget-filter .custom-filter .title-part{text-align: center; font-size: 16px; height: 50px; position: relative; border-bottom: 1px solid #ccc;}.jimu-widget-filter .custom-filter .title-part span{height: 50px; line-height: 50px;}.jimu-widget-filter .custom-filter .title-part .back-list{display: inline-block; height: 20px; width: 13px; position: absolute; left: 20px; cursor: pointer; margin-top: 15px; background: url(images/arrow_left_normal.svg);}.jimu-widget-filter .custom-filter .title-part .back-list:hover{background: url(images/arrow_left_hover.svg);}.jimu-rtl .jimu-widget-filter .custom-filter .title-part .back-list{right: 20px; left: auto; transform: rotate(180deg);}.jimu-widget-filter .custom-filter .custom-filter-node{height: calc(100% - 100px);}.jimu-widget-filter .custom-filter .layer-part{font-size: 14px; position: relative; margin: 10px 20px; display: flex;}.jimu-widget-filter .custom-filter .layer-part .layer-title{height: 30px; line-height: 30px; flex: 0 0 80px; white-space: nowrap;}.jimu-widget-filter .custom-filter .layer-part .layer-select{margin-left: 10px;}.jimu-widget-filter .custom-filter .toggle-filter{position: absolute; right: 20px; top: 15px;}.jimu-rtl .jimu-widget-filter .custom-filter .toggle-filter{left: 20px; right: auto;}.jimu-widget-filter .filter-list .filter-layer-name {color: #999; background: #fff; line-height: 44px; font-size: 14px; padding-left: 10px; border-bottom: 1px solid #eee; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}@-webkit-keyframes load8 {0% {-webkit-transform: rotate(0deg); transform: rotate(0deg);} 100% {-webkit-transform: rotate(360deg); transform: rotate(360deg);}}@-moz-keyframes load8 {0% {-moz-transform: rotate(0deg); transform: rotate(0deg);} 100% {-moz-transform: rotate(360deg); transform: rotate(360deg);}}@-ms-keyframes load8 {0% {-ms-transform: rotate(0deg); transform: rotate(0deg);} 100% {-ms-transform: rotate(360deg); transform: rotate(360deg);}}@keyframes load8 {0% {-webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); -moz-transform: rotate(0deg); transform: rotate(0deg);} 100% {-webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); -moz-transform: rotate(360deg); transform: rotate(360deg);}}",
    "*now": function(h) {
      h([
        'dojo/i18n!*preload*widgets/Filter/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare dojo/_base/array dojo/_base/html dojo/_base/lang dojo/topic esri/geometry/Extent esri/SpatialReference dojo dojo/query dojo/on dojo/keys dijit/focus dijit/_WidgetsInTemplateMixin jimu/utils jimu/BaseWidget jimu/filterUtils jimu/dijit/FilterParameters jimu/LayerInfos/LayerInfos jimu/FilterManager esri/symbols/jsonUtils jimu/symbolUtils jimu/dijit/LayerChooserFromMapWithDropbox jimu/dijit/Filter ./CustomFeaturelayerChooserFromMap jimu/dijit/ToggleButton dojo/NodeList dojo/NodeList-dom".split(
  " "
), function(
  h,
  l,
  d,
  g,
  f,
  b,
  e,
  k,
  p,
  t,
  n,
  a,
  v,
  q,
  A,
  m,
  w,
  F,
  r,
  J,
  G,
  K,
  D,
  H,
  I
) {
  return h([A, v], {
    name: "Filter",
    baseClass: "jimu-widget-filter",
    _itemTemplate:
      '\x3cli class\x3d"filter-item" data-index\x3d"${index}"\x3e\x3cdiv class\x3d"header" \x3e\x3cspan class\x3d"arrow jimu-float-leading jimu-trailing-margin05" title\x3d"${toggleTip}" \x3e\x3c/span\x3e\x3cspan class\x3d"icon"\x3e\x3cimg src\x3d"${icon}" /\x3e\x3c/span\x3e\x3cspan class\x3d"icon symbolIcon" style\x3d"display:none;"\x3e\x3c/span\x3e\x3cspan class\x3d"item-title"\x3e${title}\x3c/span\x3e\x3cspan class\x3d"toggle-filter jimu-trailing-margin1"\x3e\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"body"\x3e\x3cdiv class\x3d"parameters"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/li\x3e',
    _store: null,
    homeExtent: null,
    postMixInProperties: function() {
      this.jimuNls = window.jimuNls;
    },
    postCreate: function() {
      this.inherited(arguments);
      this._store = {};
      this.layerInfosObj = F.getInstanceSync();
      this.filterUtils = new m();
      this.filterManager = r.getInstance();
      this.initFilterActions();
      this.initAllFilters() ||
        d.addClass(this.domNode, "not-exist-ask-for-value");
      this.own(
        f.subscribe("appConfigChanged", g.hitch(this, this.onAppConfigChanged))
      );
    },
    onAppConfigChanged: function(a, d, e) {
      "mapOptionsChange" === d &&
        e &&
        a &&
        e.extent &&
        (this.homeExtent = new b(e.extent));
    },
    startup: function() {
      this.inherited(arguments);
      this.resize();
      var a =
        this.appConfig &&
        this.appConfig.map &&
        this.appConfig.map.mapOptions &&
        this.appConfig.map.mapOptions.extent;
      this.homeExtent = a
        ? new b(a.xmin, a.ymin, a.xmax, a.ymax, new e(a.spatialReference))
        : this.map._initialExtent || this.map.extent;
    },
    initFilterActions: function() {
      this.filterActions = [];
      this.config.allowTurnOffAll &&
        (d.setStyle(this.showTurnOffAllButtonNode, "display", "block"),
        this.filterActions.push(this.showTurnOffAllButtonNode));
      this.config.allowResetAll &&
        (d.setStyle(this.showResetAllButtonNode, "display", "block"),
        this.filterActions.push(this.showResetAllButtonNode));
      this.config.allowCustom &&
        (this.filterActions.push(this.showCustomButtonNode),
        d.setStyle(this.showCustomButtonNode, "display", "block"),
        this.own(
          t(
            this.customFilterContainerNode,
            "keydown",
            g.hitch(this, function(c) {
              c.keyCode === n.ESCAPE &&
                (c.stopPropagation(), a.focus(this.customBackNode));
            })
          )
        ));
      if (0 !== this.filterActions.length) {
        var c;
        1 === this.filterActions.length
          ? (d.addClass(this.filterActions[0], "absolute-icon"),
            d.setStyle(this.filterActionsPopup, "display", "block"),
            (c = this.filterActions[0]))
          : 1 < this.filterActions.length &&
            (d.setStyle(this.showFilterActionsButtonNode, "display", "block"),
            (c = this.showFilterActionsButtonNode),
            this.own(
              t(
                this.filterActionsPopup,
                "keydown",
                g.hitch(this, function(a) {
                  if (a.keyCode === n.TAB) {
                    var c = this.filterActions[this.filterActions.length - 1];
                    a.shiftKey && a.target === this.filterActions[0]
                      ? (a.preventDefault(), c.focus())
                      : a.shiftKey ||
                        a.target !== c ||
                        (a.preventDefault(), this.filterActions[0].focus());
                  } else a.keyCode === n.ESCAPE && (a.preventDefault(), a.stopPropagation(), this._onShowFilterActionsClick());
                })
              )
            ),
            this.own(
              t(
                document.body,
                "click",
                g.hitch(this, function(a) {
                  if (
                    "block" === d.getStyle(this.filterActionsPopup, "display")
                  ) {
                    var c = d.isDescendant(a.target, this.filterActionsPopup);
                    a.target === this.showFilterActionsButtonNode ||
                      c ||
                      this._onShowFilterActionsClick();
                  }
                })
              )
            ));
        q.initLastFocusNode(this.domNode, c);
      }
    },
    _onShowFilterActionsClick: function(c) {
      c && c.preventDefault();
      d.hasClass(this.showFilterActionsButtonNode, "active")
        ? (d.setAttr(
            this.showFilterActionsButtonNode,
            "title",
            this.nls.filterActions
          ),
          d.removeClass(this.showFilterActionsButtonNode, "active"),
          d.setStyle(this.filterActionsPopup, "display", "none"),
          a.focus(this.showFilterActionsButtonNode))
        : (d.setAttr(
            this.showFilterActionsButtonNode,
            "title",
            this.jimuNls.common.close
          ),
          d.addClass(this.showFilterActionsButtonNode, "active"),
          d.setStyle(this.filterActionsPopup, "display", "block"),
          a.focus(this.filterActions[0]));
    },
    _onShowFilterActionsKeydown: function(a) {
      (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
        this._onShowFilterActionsClick(a);
    },
    initAllFilters: function() {
      var a = !1,
        b = this.config.filters;
      if (this.config.groupByLayer) {
        var e = {};
        l.forEach(
          b,
          function(a) {
            e[a.layerId] || (e[a.layerId] = []);
            e[a.layerId].push(a);
          },
          this
        );
        var b = "",
          f;
        for (f in e) b = f;
        for (var g in e) {
          f = this.layerInfosObj.getLayerInfoById(g);
          var h = document.createElement("div");
          d.addClass(h, "filter-layer-name");
          h.innerText = f.title;
          d.place(h, this.filterList);
          a = this._initFilters(e[g], a, g === b ? !0 : !1);
        }
      } else a = this._initFilters(b, a, !0);
      return a;
    },
    _initFilters: function(c, b, e) {
      e = 0 < this.filterActions.length ? !1 : e;
      var f = 0,
        h = c.length;
      l.forEach(
        c,
        function(c, y) {
          var C = this.filterUtils.isAskForValues(c.filter);
          C && (b = !0);
          var l = {
            icon: c.icon
              ? q.processUrlInWidgetConfig(c.icon, this.folderUrl)
              : this.folderUrl + "/css/images/default_task_icon.png",
            index: y,
            title: c.name,
            toggleTip: this.nls.toggleTip,
            hasValue: C
              ? window.appInfo.isRunInMobile
                ? "block !important"
                : ""
              : "none",
            isAskForValue: C,
            apply: g.getObject("jimuNls.common.apply", !1, window) || "Apply"
          };
          this._store[c.layerId] ||
            (this._store[c.layerId] = { mapFilterControls: {} });
          var x = g.replace(this._itemTemplate, l, /\$\{([^\}]+)\}/gi),
            k = d.toDom(x);
          d.place(k, this.filterList);
          k.currentLayerId = c.layerId;
          if (c.symbol) {
            x = p(".icon", k);
            d.setStyle(x[0], "display", "none");
            d.setStyle(x[1], "display", "inline-block");
            var m = J.fromJson(c.symbol),
              r = c.symbol.url || c.symbol.imageData;
            r ? (m.setWidth(16), m.setHeight(16)) : m.setSize(16);
            m = r
              ? G.createSymbolNode(m)
              : G.createSymbolNode(m, { width: 17, height: 17 });
            d.place(m, x[1]);
          }
          x = p(".toggle-filter", k)[0];
          m = new I(
            {
              toggleTips: {
                toggleOn: c.name + " " + this.nls.toggleOn,
                toggleOff: c.name + " " + this.nls.toggleOff
              }
            },
            x
          );
          m.startup();
          k.toggleButton = m;
          m = p(".header", k);
          this.own(m.on("click", g.hitch(this, "toggleFilter", k, c, l)));
          this.own(
            m.on(
              "keydown",
              g.hitch(this, function(a) {
                var b = a.target || a.srcElement;
                d.hasClass(b, "arrow") ||
                  d.hasClass(b, "error") ||
                  (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
                  (a.preventDefault(), this.toggleFilter(k, c, l));
              })
            )
          );
          m = null;
          r = p(".arrow", k);
          C
            ? (d.addClass(k, "has-ask-for-value"),
              d.setAttr(r[0], "tabindex", 0),
              0 === y && (q.initFirstFocusNode(this.domNode, r[0]), (m = r[0])))
            : (d.addClass(k, "not-has-ask-for-value"),
              0 === y && (q.initFirstFocusNode(this.domNode, x), (m = x)));
          m &&
            this.own(
              t(
                m,
                "keydown",
                g.hitch(this, function(c) {
                  this.isLastFilterHidden &&
                    c.shiftKey &&
                    c.keyCode === n.TAB &&
                    a.focus(this.lastToggleBtn);
                })
              )
            );
          e && f === h - 1 && d.setAttr(k, "data-isLastNode", "yes");
          "none" !== l.hasValue
            ? (this.own(r.on("click", g.hitch(this, "configFilter", k, c))),
              this.own(
                r.on(
                  "keydown",
                  g.hitch(this, function(a) {
                    a.keyCode === n.ENTER && this.configFilter(k, c);
                  })
                )
              ),
              d.addClass(k, "requesting"),
              this.configFilter(
                k,
                c,
                null,
                g.hitch(this, function(a, b) {
                  b
                    ? this._setFilterNodeError(k, c.layerId)
                    : (c.collapse && d.removeClass(k, "config-parameters"),
                      c.autoApplyWhenWidgetOpen && this.toggleFilter(k, c, l),
                      "yes" === d.getAttr(k, "data-isLastNode") &&
                        (a.then(
                          g.hitch(this, function(a) {
                            q.initLastFocusNode(
                              this.domNode,
                              a[a.length - 1].domNode
                            );
                          })
                        ),
                        (this.isLastFilterHidden = !1),
                        (a = p(".arrow", k)[0]) &&
                          this.own(
                            t(
                              a,
                              "keydown",
                              g.hitch(this, function(a) {
                                a.keyCode === n.ENTER &&
                                  (this.isLastFilterHidden = !this
                                    .isLastFilterHidden);
                              })
                            )
                          ),
                        (this.lastToggleBtn = p(".toggle-filter", k)[0]),
                        this.own(
                          t(
                            this.lastToggleBtn,
                            "keydown",
                            g.hitch(this, function(a) {
                              this.isLastFilterHidden &&
                                !a.shiftKey &&
                                a.keyCode === n.TAB &&
                                (a.preventDefault(),
                                q.focusFirstFocusNode(this.domNode));
                            })
                          )
                        )));
                })
              ))
            : (c.autoApplyWhenWidgetOpen && this.toggleFilter(k, c, l),
              "yes" === d.getAttr(k, "data-isLastNode") &&
                q.initLastFocusNode(this.domNode, x));
          f++;
        },
        this
      );
      return b;
    },
    _setFilterNodeError: function(a, b) {
      b = this.jimuNls.map.layerLoadedError.replace("${layers}", b);
      d.setAttr(a, "aria-disabled", "true");
      d.removeClass(a, "config-parameters");
      d.removeClass(a, "has-ask-for-value");
      d.addClass(a, "not-has-ask-for-value");
      a = p(".arrow", a)[0];
      d.removeClass(a, "arrow");
      d.addClass(a, "error");
      d.setAttr(a, "title", b);
      d.setStyle(a, "display", "block");
    },
    _getPriorityOfMapFilter: function(a) {
      a = g.getObject(a + ".mapFilterControls", !1, this._store);
      var c = 0,
        b;
      for (b in a) {
        var d = a[b];
        d.priority > c && (c = d.priority);
      }
      return c;
    },
    _getMapFilterControl: function(a) {
      a = g.getObject(a + ".mapFilterControls", !1, this._store);
      var c = !0,
        b;
      for (b in a) {
        var d = a[b];
        0 < d.priority && (c = !!d.enable);
      }
      return c;
    },
    _setItemFilter: function(a, b, d, e) {
      if (!this._store[a]) return !0;
      this._store[a]["filter_item_" + b] = d;
      d = this._getPriorityOfMapFilter(a);
      g.setObject(
        a + ".mapFilterControls.filter_item_" + b,
        { enable: e, priority: d + 1 },
        this._store
      );
    },
    _removeItemFilter: function(a, b) {
      if (!this._store[a]) return !0;
      delete this._store[a]["filter_item_" + b];
      delete this._store[a].mapFilterControls["filter_item_" + b];
    },
    _getExpr: function(a) {
      if (!this._store[a]) return null;
      var c = [];
      a = this._store[a];
      for (var b in a) {
        var d = a[b];
        d && "mapFilterControls" !== b && c.push("(" + d + ")");
      }
      return c.join(" " + this.config.taskOper + " ");
    },
    toggleFilter: function(a, b, e) {
      if ("true" === d.getAttr(a, "aria-disabled"))
        d.removeClass(a, "applied"), a.toggleButton.uncheck();
      else if (
        !d.hasClass(a, "config-parameters") ||
        (a.filterParams && a.filterParams.getFilterExpr())
      )
        if (
          !e.isAskForValue ||
          (a.filterParams && a.filterParams.getFilterExpr())
        ) {
          var c = !1;
          e = b.layerId;
          var c = d.getAttr(a, "data-index"),
            f = d.hasClass(a, "applied");
          f
            ? (d.removeClass(a, "applied"), a.toggleButton.uncheck())
            : (d.addClass(a, "applied"), a.toggleButton.check());
          f
            ? (c = this._removeItemFilter(e, c))
            : ((f = this._getFilterExpr(a, b)),
              (c = this._setItemFilter(e, c, f, b.enableMapFilter)));
          c
            ? (this._setFilterNodeError(a, e),
              d.removeClass(a, "applied"),
              a.toggleButton.uncheck())
            : ((c = this._getExpr(e)),
              (f = this._getMapFilterControl(e)),
              this.filterManager.applyWidgetFilter(
                e,
                this.id,
                c,
                f,
                null,
                this.config.zoomto
              ),
              this._afterFilterApplied(b.layerId, !a.toggleButton.checked));
        } else this.configFilter(a, b);
    },
    configFilter: function(a, b, e, f) {
      if (d.hasClass(a, "has-ask-for-value")) {
        if (a.filterParams)
          d.hasClass(a, "config-parameters")
            ? (d.removeClass(a, "config-parameters"),
              this._changeItemTitleWidth(
                a,
                window.appInfo.isRunInMobile ? 60 : 45
              ))
            : (d.addClass(a, "config-parameters"),
              this._changeItemTitleWidth(a, 60)),
            f && f();
        else {
          var c = this.layerInfosObj.getLayerInfoById(b.layerId);
          c
            ? c.getLayerObject().then(
                g.hitch(this, function(c) {
                  d.addClass(a, "config-parameters");
                  d.removeClass(a, "requesting");
                  var e = p(".parameters", a)[0];
                  a.handles = [];
                  a.filterParams = new w();
                  var h = g.clone(b.filter),
                    k = null;
                  b.enableMapFilter && (k = b.layerId);
                  h.wId =
                    (this.isOnScreen
                      ? "widgets_Filter_Widget" + this.id
                      : this.id) +
                    "_" +
                    c.id +
                    "_" +
                    d.getAttr(a, "data-index");
                  c = a.filterParams.build(b.url, c, h, k);
                  this.own(
                    t(
                      a.filterParams,
                      "change",
                      g.hitch(this, function(c) {
                        c ? (a.expr = c) : delete a.expr;
                        a.toggleButton.checked && this.applyFilterValues(a, b);
                      })
                    )
                  );
                  a.expr = a.filterParams.getFilterExpr();
                  a.filterParams.placeAt(e);
                  this._changeItemTitleWidth(a, 60);
                  f && f(c);
                })
              )
            : f && f(null, !0);
        }
        e && e.target && e.stopPropagation();
      }
    },
    applyFilterValues: function(a, b, e) {
      var c = this._getFilterExpr(a, b);
      if (c) {
        a.expr = c;
        var c = b.layerId,
          f = d.getAttr(a, "data-index");
        d.addClass(a, "applied");
        this._setItemFilter(c, f, a.expr, b.enableMapFilter);
        a = this._getExpr(c);
        f = this._getMapFilterControl(c);
        this.filterManager.applyWidgetFilter(
          c,
          this.id,
          a,
          f,
          null,
          this.config.zoomto
        );
        this._afterFilterApplied(b.layerId);
      }
      e && e.stopPropagation();
    },
    _getFilterExpr: function(a, b) {
      return a.filterParams
        ? a.filterParams.getFilterExpr()
        : this.filterUtils.hasVirtualDate(b.filter)
        ? ((this.filterUtils.isHosted = q.isHostedService(b.url)),
          this.filterUtils.getExprByFilterObj(b.filter))
        : b.filter.expr;
    },
    _afterFilterApplied: function(a, b) {
      if (this.config.zoomto || this.config.zoombackto) {
        var c = this.layerInfosObj.getLayerInfoById(a);
        b && this.config.zoombackto && this._checkIfAllOffByLayer(a)
          ? this.map.setExtent(this.homeExtent)
          : this.config.zoomto && c && c.zoomTo();
      }
    },
    _checkIfAllOffByLayer: function(a) {
      var b = !0;
      if (
        this.config.allowCustom &&
        this.customFilterToggleButton.checked &&
        this.customFilter &&
        this.customFilter.featureLayerId === a
      ) {
        var c = this.customFilter.toJson();
        if (c && 0 < c.parts.length) return !b;
      }
      for (var c = p("li", this.filterList), d = 0; d < c.length; d++) {
        var e = c[d];
        if (e.toggleButton.checked && e.currentLayerId === a) {
          b = !1;
          break;
        }
      }
      return b;
    },
    _isValidExtent: function(a) {
      return !(
        isNaN(a.xmax) ||
        isNaN(a.xmax) ||
        isNaN(a.xmax) ||
        isNaN(a.xmax)
      );
    },
    resize: function() {
      this.inherited(arguments);
      this._changeItemTitleWidth(
        this.domNode,
        window.appInfo.isRunInMobile ? 60 : 70
      );
      this.customFilter && this.customFilter.resize();
    },
    _changeItemTitleWidth: function(a, b) {
      b += 30;
      var c = p(".header", a)[0];
      c &&
        ((b = d.getContentBox(c).w - b),
        0 < b && p(".header .item-title", a).style({ maxWidth: b + "px" }));
    },
    _onShowCustomClick: function(b) {
      d.setStyle(this.customFilterContainerNode, "display", "block");
      d.setStyle(this.filterListContainerNode, "display", "none");
      if (!this.layerChooserSelect) {
        var c = new H({
          showLayerFromFeatureSet: !1,
          showTable: !1,
          onlyShowVisible: !1,
          createMapResponse: this.map.webMapResponse
        });
        this.layerChooserSelect = new K({ layerChooser: c });
        this.layerChooserSelect.placeAt(this.layerSelectNode);
        this.own(
          t(
            this.layerChooserSelect,
            "selection-change",
            g.hitch(this, this._onLayerChanged)
          )
        );
        this.own(
          t(
            this.layerChooserSelect.dropDownBtn,
            "keydown",
            g.hitch(this, function(b) {
              b.shiftKey ||
                b.keyCode !== n.TAB ||
                null !== this.layerChooserSelect._selectedItem ||
                (b.preventDefault(), a.focus(this.customBackNode));
            })
          )
        );
        this.layerChooserSelect.showLayerChooser();
      }
      b.preventDefault();
      a.focus(this.customFilterToggleButton.domNode);
    },
    _onShowResetAllClick: function() {
      this._destroyFilterParams();
      this._unapplyFilterByStore();
      this._store = {};
      k.empty(this.filterList);
      this.map.setExtent(this.homeExtent);
      this.initAllFilters();
    },
    _onShowTurnOffAllClick: function() {
      var a = !1,
        b = p("li", this.filterList);
      b.some(function(b) {
        if (b.toggleButton.checked) return (a = !0);
      });
      a &&
        (this._unapplyFilterByStore(),
        b.forEach(function(a) {
          if (a.toggleButton.checked) {
            d.removeClass(a, "applied");
            a.toggleButton.uncheck();
            var b = d.getAttr(a, "data-index");
            this._removeItemFilter(a.currentLayerId, b);
          }
        }, this),
        this.map.setExtent(this.homeExtent));
    },
    _onShowCustomKeydown: function(a) {
      (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
        this._onShowCustomClick(a);
    },
    _onShowResetAllKeydown: function(a) {
      (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
        this._onShowResetAllClick(a);
    },
    _onShowTurnOffAllKeydown: function(a) {
      (a.keyCode !== n.ENTER && a.keyCode !== n.SPACE) ||
        this._onShowTurnOffAllClick(a);
    },
    _onLayerChanged: function() {
      var a = this.layerChooserSelect.getSelectedItem();
      a &&
        ((a = a.layerInfo.layerObject),
        this.customFilter ||
          ((this.customFilter = new D({
            enableAskForValues: !1,
            featureLayerId: a.id,
            runtime: !0
          })),
          this.customFilter.placeAt(this.customFilterNode),
          this.own(
            t(
              this.customFilter,
              "change",
              g.hitch(this, this._onCustomFilterChange)
            )
          ),
          this.own(
            t(
              this.customFilter.btnAddSetMobile,
              "keydown",
              g.hitch(this, this._btnAddSetToToggleBtn)
            )
          )),
        this.customFilter.build({
          url: a.url,
          featureLayerId: a.id,
          layerDefinition: a
        }),
        (this.selectedLayer = a));
    },
    _btnAddSetToToggleBtn: function(b) {
      b.shiftKey ||
        b.keyCode !== n.TAB ||
        (b.preventDefault(), a.focus(this.customBackNode));
    },
    _getLayerDefinitionForFilterDijit: function(a) {
      var b = null;
      "esri.layers.FeatureLayer" === a.declaredClass &&
        (b = q.getFeatureLayerDefinition(a));
      b ||
        (b = { currentVersion: a.currentVersion, fields: g.clone(a.fields) });
      return b;
    },
    _onBackToListClick: function() {
      d.setStyle(this.customFilterContainerNode, "display", "none");
      d.setStyle(this.filterListContainerNode, "display", "block");
      a.focus(this.showCustomButtonNode);
    },
    _onBackToListKeydown: function(b) {
      b.keyCode === n.ENTER || b.keyCode === n.SPACE
        ? this._onBackToListClick()
        : b.shiftKey &&
          b.keyCode === n.TAB &&
          (b.preventDefault(),
          null === this.layerChooserSelect._selectedItem
            ? a.focus(this.layerChooserSelect.dropDownBtn)
            : d.hasClass(this.customFilter.mobileAddSection, "hidden") ||
              a.focus(this.customFilter.btnAddSetMobile));
    },
    _onCustomFilterToggle: function(a) {
      this.customFilter &&
        (a
          ? this._applyCustomFilter()
          : (this.filterManager.applyWidgetFilter(
              this.selectedLayer.id,
              this.id + "-custom-filter",
              "1\x3d1",
              !0,
              null,
              this.config.zoomto
            ),
            this._afterFilterApplied(this.selectedLayer.id, !0)));
    },
    _onCustomFilterChange: function() {
      this._applyCustomFilter();
    },
    _applyCustomFilter: function() {
      var a = this.customFilter.toJson();
      a &&
        this.customFilterToggleButton.checked &&
        0 !== a.parts.length &&
        (this.filterManager.applyWidgetFilter(
          this.selectedLayer.id,
          this.id + "-custom-filter",
          a.expr,
          !0,
          null,
          this.config.zoomto
        ),
        this._afterFilterApplied(this.selectedLayer.id));
    },
    _destroyFilterParams: function() {
      p(".filter-item", this.filterList).forEach(function(a) {
        a.filterParams && a.filterParams.destroy();
        delete a.expr;
      });
    },
    _unapplyFilterByStore: function() {
      if (this._store)
        for (var a in this._store)
          a &&
            this.filterManager.applyWidgetFilter(
              a,
              this.id,
              "",
              null,
              null,
              this.config.zoomto
            );
    },
    destroy: function() {
      this._destroyFilterParams();
      this._unapplyFilterByStore();
      this.inherited(arguments);
    }
  });
});
