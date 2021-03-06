// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/array jimu/BaseFeatureAction jimu/WidgetManager jimu/LayerInfos/LayerInfos".split(
  " "
), function(d, f, g, h, k, e) {
  return d(h, {
    map: null,
    iconClass: "icon-show-related-record",
    isFeatureSupported: function(b, a) {
      var c = e.getInstanceSync();
      return 0 !== b.features.length &&
        a &&
        c &&
        a &&
        a.relationships &&
        0 < a.relationships.length
        ? (b = c.getLayerInfoById(a.id))
          ? b.getRelatedTableInfoArray().then(function(a) {
              return 0 < a.length ? !0 : !1;
            })
          : !1
        : !1;
    },
    onExecute: function(b, a) {
      var c = e.getInstanceSync().getLayerInfoById(a.id),
        d = g.map(
          b.features,
          f.hitch(this, function(b) {
            return b.attributes[a.objectIdField];
          })
            );
        debugger;
      k.getInstance()
        .triggerWidgetOpen(this.widgetId)
        .then(function(a) {
          a.showRelatedRecordsFromPopup(c, d);
        });
    }
  });
});
