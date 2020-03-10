// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/Deferred jimu/BaseFeatureAction jimu/Role jimu/LayerInfos/LayerInfos jimu/WidgetManager".split(
  " "
), function(k, l, g, h, m, n, p, q) {
  return k(m, {
    map: null,
    iconClass: "icon-edit",
    isFeatureSupported: function(a, b) {
      var c = new h(),
        e =
          b ||
          g.getObject(
            "_wabProperties.popupInfo.layerForActionWithEmptyFeatures",
            !1,
            this.map.infoWindow
          );
      if (!e) return c.resolve(!1), c;
      var d = p.getInstanceSync().getLayerInfoByTopLayerId(e && e.id);
      a = new h();
      d && (d.isTable || d.isShowInMap())
        ? (a = d.isEditable())
        : a.resolve(!1);
      a.then(
        g.hitch(this, function(a) {
          var b = !1,
            f = this.appConfig.getConfigElementById(this.widgetId).config;
          f.editor.layerInfos
            ? 0 === f.editor.layerInfos.length
              ? (b = !0)
              : l.forEach(
                  f.editor.layerInfos.concat(f.editor.tableInfos || []),
                  function(a) {
                    e.id === a.featureLayer.id && (b = !0);
                  }
                )
            : (b = !1);
          b && d && d.getUrl() && a ? c.resolve(!0) : c.resolve(!1);
        })
      );
      return c;
    },
    onExecute: function(a, b) {
      var c =
        b ||
        g.getObject(
          "_wabProperties.popupInfo.layerForActionWithEmptyFeatures",
          !1,
          this.map.infoWindow
        );
      b = new h();
      q.getInstance()
        .triggerWidgetOpen(this.widgetId)
        .then(function(b) {
          b.beginEditingByFeatures(a.features, c);
        });
      return b.promise;
    },
    _checkEditPrivilege: function(a) {
      var b = !0;
      a &&
        ((b = new n({ id: a.roleId ? a.roleId : a.role, role: a.role })),
        a.privileges && b.setPrivileges(a.privileges),
        (b = b.canEditFeatures()));
      return b;
    }
  });
});
