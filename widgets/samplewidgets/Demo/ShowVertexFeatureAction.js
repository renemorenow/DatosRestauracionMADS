// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define([
  "dojo/_base/declare",
  "jimu/BaseFeatureAction",
  "jimu/WidgetManager"
], function(b, d, e) {
  return b(d, {
    iconFormat: "png",
    isFeatureSupported: function(a) {
      return 0 < a.features.length && "point" !== a.features[0].geometry.type;
    },
    onExecute: function(a) {
      e.getInstance()
        .triggerWidgetOpen(this.widgetId)
        .then(function(b) {
          var c = 0;
          a.features.forEach(function(a) {
            a.geometry.rings.forEach(function(a) {
              c += a.length;
            });
          });
          b.showVertexCount(c);
        });
    }
  });
});
