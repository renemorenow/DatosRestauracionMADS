// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "widgets/SmartEditor/setting/EditFields": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/_base/array dojo/dom-style dojo/dom-construct dojo/on dojo/query dojo/text!./EditFields.html ./FieldValidation ./CopyAttributes dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/SimpleTable jimu/dijit/Popup esri/lang".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g) {
        return l([r, n, k], {
          baseClass: "jimu-widget-smartEditor-setting-fields",
          templateString: e,
          _configInfo: null,
          _fieldValid: null,
          _fieldValidations: null,
          _fieldValues: null,
          _attachmentValidations: null,
          __layerName: null,
          _removeFromSmartActionsGroup: [],
          _removeFromAttributeActionsGroup: [],
          postCreate: function() {
            this.inherited(arguments);
            this._removeFromSmartActionsGroup = [];
            this._removeFromAttributeActionsGroup = [];
            this.fieldsPopUp = null;
            this._initFieldsTable();
            this._setFiedsTable(this._configInfo.fieldInfos);
            this._fieldValidations =
              void 0 === this._configInfo.fieldValidations
                ? {}
                : h.clone(this._configInfo.fieldValidations);
            this._fieldValues =
              void 0 === this._configInfo.fieldValues
                ? {}
                : h.clone(this._configInfo.fieldValues);
            this._attachmentValidations =
              void 0 === this._configInfo.attachmentValidations
                ? {}
                : h.clone(this._configInfo.attachmentValidations);
            this.own(
              c(
                this.attachmentsValidation,
                "click",
                h.hitch(this, function() {
                  this._onAttachmentsValidationClicked();
                })
              )
            );
            this._configInfo.layerInfo.layerObject.hasAttachments
              ? f.set(this.attachmentsValidation, "display", "block")
              : f.set(this.attachmentsValidation, "display", "none");
          },
          popupEditPage: function() {
            this.fieldsPopUp = new u({
              titleLabel: g.substitute(
                { layername: this._layerName },
                this.nls.fieldsPage.title
              ),
              width: 972,
              maxHeight: 700,
              autoHeight: !0,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    this._validateTable() &&
                      (this._resetFieldInfos(),
                      (this._configInfo.fieldValidations = this._fieldValidations),
                      (this._configInfo.fieldValues = this._fieldValues),
                      (this._configInfo.attachmentValidations = this._attachmentValidations),
                      this.emit("RemoveFromGroup", {
                        smartActionGroupInfo: this._removeFromSmartActionsGroup,
                        attributeActionGroupInfo: this
                          ._removeFromAttributeActionsGroup
                      }),
                      this.fieldsPopUp.close());
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    this.fieldsPopUp.close();
                  })
                }
              ],
              onClose: h.hitch(this, function() {})
            });
          },
          _initFieldsTable: function() {
            this._fieldsTable = new t({
              fields: [
                {
                  name: "required",
                  title: "",
                  type: "text",
                  class: "required"
                },
                {
                  name: "visible",
                  title: this.nls.fieldsPage.fieldsSettingsTable.display,
                  type: "checkbox",
                  class: "visible",
                  width: "15%"
                },
                {
                  name: "isEditable",
                  title: this.nls.fieldsPage.fieldsSettingsTable.edit,
                  type: "checkbox",
                  class: "editable",
                  width: "15%"
                },
                {
                  name: "fieldName",
                  title: this.nls.fieldsPage.fieldsSettingsTable.fieldName,
                  type: "text",
                  class: "fieldName",
                  width: "30%"
                },
                {
                  name: "label",
                  title: this.nls.fieldsPage.fieldsSettingsTable.fieldAlias,
                  type: "text",
                  editable: !1,
                  class: "fieldLabel",
                  width: "30%"
                },
                {
                  name: "actions",
                  title: this.nls.fieldsPage.fieldsSettingsTable.actions,
                  type: "actions",
                  actions: ["up", "down", "edit", "copy"],
                  class: "actions",
                  width: "10%"
                }
              ],
              selectable: !1,
              style: { height: "300px", maxHeight: "300px" }
            });
            this._fieldsTable.placeAt(this.fieldsTable);
            this._fieldsTable.startup();
            b("th.simple-table-field", this._fieldsTable.domNode).forEach(
              function(a) {
                switch (
                  void 0 === a.innerText || "" === a.innerText
                    ? ""
                    : a.innerText.replace(/(\r\n|\n|\r)/gm, "")
                ) {
                  case this.nls.fieldsPage.fieldsSettingsTable.display:
                    a.title = this.nls.fieldsPage.fieldsSettingsTable.displayTip;
                    break;
                  case this.nls.fieldsPage.fieldsSettingsTable.edit:
                    a.title = this.nls.fieldsPage.fieldsSettingsTable.editTip;
                    break;
                  case this.nls.fieldsPage.fieldsSettingsTable.fieldName:
                    a.title = this.nls.fieldsPage.fieldsSettingsTable.fieldNameTip;
                    break;
                  case this.nls.fieldsPage.fieldsSettingsTable.fieldAlias:
                    a.title = this.nls.fieldsPage.fieldsSettingsTable.fieldAliasTip;
                    break;
                  case this.nls.fieldsPage.fieldsSettingsTable.actions:
                    a.title = this.nls.fieldsPage.fieldsSettingsTable.actionsTip;
                }
              },
              this
            );
            this.own(
              c(
                this._fieldsTable,
                "actions-edit",
                h.hitch(this, this._onEditFieldInfoClick)
              )
            );
          },
          _validateTable: function() {
            var a = this._fieldsTable.getRows();
            return 0 === a.length
              ? !1
              : m.some(
                  a,
                  function(a) {
                    return this._fieldsTable.getRowData(a).isEditable;
                  },
                  this
                );
          },
          _onEditFieldInfoClick: function(a) {
            a = this._fieldsTable.getRowData(a);
            var b = g.substitute(
                { fieldname: a.fieldName },
                this.nls.actionPage.smartActionTitle
              ),
              c = {
                fields: h.clone(this._configInfo.layerInfo.layerObject.fields)
              };
            this._fieldValid = new d({
              nls: this.nls,
              _layerDefinition: c,
              _layerId: this._configInfo.layerInfo.layerObject.id,
              _url: this._configInfo.layerInfo.layerObject.url,
              _fieldValidations: this._fieldValidations,
              _fieldName: a.fieldName,
              _fieldAlias: a.label,
              popupTitle: b,
              _smartActionsTable: this._smartActionsTable
            });
            this._fieldValid.removeFromGroup = h.hitch(this, function(a) {
              this._removeFromSmartActionsGroup.push(a);
            });
            this._fieldValid.onGroupEditingStart = h.hitch(this, function() {
              this.fieldsPopUp && this.fieldsPopUp.close();
              this._tab &&
                this._tab.selectTab(this.nls.layersPage.smartActionsTabTitle);
            });
            this._fieldValid.popupActionsPage();
          },
          _onCopyAttrButtonClick: function(a) {
            var b = this._fieldsTable.getRowData(a),
              g = {
                fields: h.clone(this._configInfo.layerInfo.layerObject.fields)
              };
            this._copyAttr = new q({
              nls: this.nls,
              _layerDefinition: g,
              _fieldInfos: this._configInfo.fieldInfos,
              _layerId: this._configInfo.layerInfo.layerObject.id,
              _url: this._configInfo.layerInfo.layerObject.url,
              _fieldName: b.fieldName,
              _fieldAlias: b.label,
              _fieldValues: this._fieldValues,
              _geocoderSettings: this._geocoderSettings,
              _configuredPresetInfos: this._configuredPresetInfos,
              layerInfos: this.layerInfos,
              isRelatedLayer: this.isRelatedLayer,
              map: this.map,
              _fieldType: a.fieldType,
              _attributeActionsTable: this._attributeActionsTable
            });
            this.own(
              c(
                this._copyAttr,
                "onGroupEditingStart",
                h.hitch(this, function(a) {
                  this.fieldsPopUp && this.fieldsPopUp.close();
                  this._tab && this._tab.selectTab(a);
                })
              )
            );
            this.own(
              c(
                this._copyAttr,
                "removeFromGroup",
                h.hitch(this, function(a) {
                  this._removeFromAttributeActionsGroup.push(a);
                })
              )
            );
            this._copyAttr.popupActionsPage();
            this.own(
              c(
                this._copyAttr,
                "SetGeocoder",
                h.hitch(this, function() {
                  this.emit("SetGeocoder");
                })
              )
            );
          },
          _onAttachmentsValidationClicked: function() {
            var a = g.substitute(
                { layername: this._layerName },
                this.nls.fieldsPage.smartAttachmentPopupTitle
              ),
              b = {
                fields: h.clone(this._configInfo.layerInfo.layerObject.fields)
              };
            this._attachmentFieldValidation = new d({
              nls: this.nls,
              _layerDefinition: b,
              _layerId: this._configInfo.layerInfo.layerObject.id,
              _url: this._configInfo.layerInfo.layerObject.url,
              _fieldValidations: this._attachmentValidations,
              _fieldName: "Actions",
              _fieldAlias: "",
              popupTitle: a
            });
            this._attachmentFieldValidation.popupActionsPage();
          },
          _setFiedsTable: function(a) {
            var c, g, d;
            m.forEach(
              a,
              function(a) {
                var v = a.visible;
                "esriFieldTypeGeometry" !== a.type &&
                  "esriFieldTypeOID" !== a.type &&
                  "esriFieldTypeBlob" !== a.type &&
                  "esriFieldTypeGlobalID" !== a.type &&
                  "esriFieldTypeRaster" !== a.type &&
                  "esriFieldTypeXML" !== a.type &&
                  (!1 === a.visible && !0 === a.isEditable && (v = !0),
                  (v = {
                    fieldName: a.fieldName,
                    isEditable: a.isEditable,
                    label: a.label,
                    visible: v
                  }),
                  a.hasOwnProperty("nullable") && !1 === a.nullable
                    ? (v.required = "*")
                    : (v.required = ""),
                  (c = this._fieldsTable.addRow(v).tr),
                  (d = b(".jimu-icon-edit", c)[0]),
                  (d.title = this.nls.fieldsPage.editActionTip),
                  (g = c.children[c.children.length - 1]),
                  (c.fieldType = a.type),
                  this._addNewAction(g.children[0], c));
              },
              this
            );
            setTimeout(
              h.hitch(this, function() {
                m.forEach(
                  this._fieldsTable.fields,
                  function(a) {
                    "visible" === a.name
                      ? (a.onChange = h.hitch(
                          this,
                          this._onDisplayFieldChanged
                        ))
                      : "isEditable" === a.name &&
                        (a.onChange = h.hitch(
                          this,
                          this._onIsEditableFieldChanged
                        ));
                  },
                  this
                );
              }),
              300
            );
          },
          _addNewAction: function(b, g) {
            var d;
            d = a.create("div", {
              class: "esriCTCopyAction",
              title: this.nls.fieldsPage.copyActionTip
            });
            c(d, "click", h.hitch(this, this._onCopyAttrButtonClick, g));
            a.place(d, b, "last");
          },
          _onDisplayFieldChanged: function(a) {
            var b = this._fieldsTable.getRowData(a);
            !b.visible &&
              b.isEditable &&
              ((b.isEditable = !1), this._fieldsTable.editRow(a, b));
          },
          _onIsEditableFieldChanged: function(a) {
            var b = this._fieldsTable.getRowData(a);
            b.isEditable &&
              !b.visible &&
              ((b.visible = !0), this._fieldsTable.editRow(a, b));
          },
          _resetFieldInfos: function() {
            var a = [],
              b = this._fieldsTable.getData();
            m.forEach(
              b,
              h.hitch(this, function(b) {
                var c = {
                  isEditable: null === b.isEditable ? !0 : b.isEditable,
                  visible: null === b.visible ? !0 : b.visible
                };
                b = this._getFieldInfoByFieldName(
                  this._configInfo.fieldInfos,
                  b.fieldName
                );
                h.mixin(b, c);
                a.push(b);
              })
            );
            this._configInfo.fieldInfos = a;
          },
          _getFieldInfoByFieldName: function(a, b) {
            var c;
            m.some(a, function(a) {
              if (a.name === b) return (c = a), !0;
            });
            return c;
          },
          geocoderConfigured: function() {
            this._copyAttr.geocoderConfigured();
          }
        });
      });
    },
    "widgets/SmartEditor/setting/FieldValidation": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/on dojo/dom-construct dojo/query dojo/json dojox/html/entities dojo/text!./FieldValidation.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/SimpleTable jimu/dijit/Popup ./FilterPage".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t) {
        return l([q, d], {
          baseClass: "jimu-widget-smartEditor-rule-table",
          templateString: e,
          _resourceInfo: null,
          _url: null,
          _fieldName: null,
          _fieldValidations: null,
          _layerId: null,
          _fieldsPopUp: null,
          postCreate: function() {
            this.inherited(arguments);
            this._fieldsPopUp = null;
            this._initActionsTable();
            this._setActionsTable();
          },
          getSettings: function() {
            return this._fieldValidations;
          },
          _getConfigActionOrder: function() {
            var a = [];
            return void 0 !== this._fieldValidations &&
              null !== this._fieldValidations &&
              this._fieldValidations.hasOwnProperty(this._fieldName) &&
              (h.forEach(this._fieldValidations[this._fieldName], function(b) {
                a.push(b.actionName);
              }),
              null !== a && 0 !== a.length)
              ? a
              : ["Hide", "Required", "Disabled"];
          },
          _getConfigAction: function(a) {
            var b = null;
            void 0 !== this._fieldValidations &&
              null !== this._fieldValidations &&
              this._fieldValidations.hasOwnProperty(this._fieldName) &&
              h.some(this._fieldValidations[this._fieldName], function(c) {
                return c.actionName === a ? ((b = c), !0) : !1;
              });
            return b;
          },
          _nlsActionToConfig: function(a) {
            switch (a) {
              case this.nls.actionPage.actions.hide:
                return "Hide";
              case this.nls.actionPage.actions.disabled:
                return "Disabled";
              case this.nls.actionPage.actions.required:
                return "Required";
              default:
                return a;
            }
          },
          popupActionsPage: function() {
            this._fieldsPopUp &&
              (this._fieldsPopUp.close(), (this._fieldsPopUp = null));
            this._fieldsPopUp = new r({
              titleLabel: this.popupTitle,
              width: 920,
              maxHeight: 600,
              autoHeight: !0,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: n.hitch(this, function() {
                    var a = this._validationTable.getRows();
                    if (
                      void 0 === this._fieldValidations ||
                      null === this._fieldValidations
                    )
                      this._fieldValidations = {};
                    this._fieldValidations[this._fieldName] = [];
                    h.forEach(
                      a,
                      function(a) {
                        var g = this._validationTable.getRowData(a);
                        a = {};
                        a.actionName = this._nlsActionToConfig(g.label);
                        a.submitWhenHidden = g.submitWhenHidden;
                        void 0 !== g.expression &&
                          null !== g.expression &&
                          "" !== g.expression &&
                          "" !== g.filter &&
                          ((g = c.parse(b.decode(g.filter))),
                          (a.expression = g.expr),
                          (a.filter = g));
                        this._fieldValidations[this._fieldName].push(a);
                      },
                      this
                    );
                    this._fieldsPopUp.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn jimu-btn-vacation"],
                  onClick: n.hitch(this, function() {
                    this._fieldsPopUp.close();
                  })
                }
              ],
              onClose: n.hitch(this, function() {})
            });
          },
          _initActionsTable: function() {
            this._validationTable = new k({
              fields: [
                {
                  name: "label",
                  title: this.nls.actionPage.actionsSettingsTable.rule,
                  type: "text",
                  width: "15%",
                  class: "rule"
                },
                {
                  name: "expression",
                  title: this.nls.actionPage.actionsSettingsTable.expression,
                  type: "text",
                  width: "55%",
                  class: "expression"
                },
                {
                  name: "groupName",
                  title: this.nls.actionPage.actionsSettingsTable.groupName,
                  type: "text",
                  width: "20%",
                  class: "expression"
                },
                {
                  name: "submitWhenHidden",
                  title: "submitWhenHidden",
                  type: "checkbox",
                  hidden: !0
                },
                { name: "filter", title: "filter", type: "text", hidden: !0 },
                {
                  name: "actions",
                  title: this.nls.actionPage.actionsSettingsTable.actions,
                  type: "actions",
                  actions: ["up", "down", "edit"],
                  width: "10%",
                  class: "actions"
                }
              ],
              selectable: !1,
              style: { height: "300px", maxHeight: "300px" }
            });
            this._validationTable.onBeforeRowEdit = n.hitch(this, function(a) {
              var b;
              b = this._validationTable.getRowData(a);
              if (b.groupName) {
                var c, d;
                c = f.create("div");
                f.create(
                  "div",
                  {
                    innerHTML: this.nls.actionPage.editOptionsPopup.expression,
                    className: "settingsDesc"
                  },
                  c
                );
                f.create(
                  "div",
                  {
                    innerHTML: this.nls.actionPage.editOptionsPopup
                      .editGroupHint,
                    className: "editGroupHint"
                  },
                  c
                );
                d = new r({
                  titleLabel: this.nls.actionPage.editOptionsPopup.popupTitle,
                  width: 500,
                  maxHeight: 445,
                  autoHeight: !0,
                  content: c,
                  class: this.baseClass,
                  buttons: [
                    {
                      label: this.nls.actionPage.editOptionsPopup
                        .editGroupButton,
                      onClick: n.hitch(this, function() {
                        this._editGroup(b.groupName);
                        d.close();
                      })
                    },
                    {
                      label: this.nls.actionPage.editOptionsPopup
                        .editIndependentlyButton,
                      onClick: n.hitch(this, function() {
                        this._validationTable._onActionsEdit(a);
                        d.close();
                      })
                    }
                  ]
                });
              } else this._validationTable._onActionsEdit(a);
            });
            this.own(
              m(
                this._validationTable,
                "row-edit",
                n.hitch(this, function(a) {
                  var b;
                  b = this._validationTable.getRowData(a);
                  b.groupName &&
                    ((b = {
                      groupName: b.groupName,
                      layerId: this._layerId,
                      fieldName: this._fieldName,
                      action: this._nlsActionToConfig(b.label)
                    }),
                    this.removeFromGroup(b),
                    this._validationTable.editRow(a, { groupName: null }));
                })
              )
            );
            this._validationTable.placeAt(this.validationTable);
            this._validationTable.startup();
            a("th.simple-table-field", this._validationTable.domNode).forEach(
              function(a) {
                switch (
                  void 0 === a.innerText || "" === a.innerText
                    ? ""
                    : a.innerText.replace(/(\r\n|\n|\r)/gm, "")
                ) {
                  case this.nls.actionPage.actionsSettingsTable.rule:
                    a.title = this.nls.actionPage.actionsSettingsTable.ruleTip;
                    break;
                  case this.nls.actionPage.actionsSettingsTable.expression:
                    a.title = this.nls.actionPage.actionsSettingsTable.expressionTip;
                    break;
                  case this.nls.actionPage.actionsSettingsTable.actions:
                    a.title = this.nls.actionPage.actionsSettingsTable.actionsTip;
                    break;
                  case this.nls.actionPage.actionsSettingsTable.groupName:
                    a.title = this.nls.actionPage.actionsSettingsTable.groupNameTip;
                }
              },
              this
            );
            this.own(
              m(
                this._validationTable,
                "actions-edit",
                n.hitch(this, this._onEditFieldInfoClick)
              )
            );
            this.own(
              m(
                this._validationTable,
                "actions-delete",
                n.hitch(this, this._onDeleteFieldInfoClick)
              )
            );
          },
          _onDeleteFieldInfoClick: function(a) {
            this._removeFilter(a);
          },
          _onEditFieldInfoClick: function(a) {
            this._showFilter(a);
          },
          _setActionsTable: function() {
            var a = this._getConfigActionOrder();
            h.forEach(
              a,
              function(a) {
                var b = this._getConfigAction(a),
                  d = a;
                switch (a) {
                  case "Hide":
                    this.nls.actionPage.hasOwnProperty("actions") &&
                      this.nls.actionPage.actions.hasOwnProperty("hide") &&
                      (d = this.nls.actionPage.actions.hide);
                    break;
                  case "Required":
                    this.nls.actionPage.hasOwnProperty("actions") &&
                      this.nls.actionPage.actions.hasOwnProperty("required") &&
                      (d = this.nls.actionPage.actions.required);
                    break;
                  case "Disabled":
                    this.nls.actionPage.hasOwnProperty("actions") &&
                      this.nls.actionPage.actions.hasOwnProperty("disabled") &&
                      (d = this.nls.actionPage.actions.disabled);
                    break;
                  default:
                    d = a;
                }
                a = { label: d, expression: null };
                void 0 !== b &&
                  null !== b &&
                  (b.hasOwnProperty("filter") &&
                    void 0 !== b.filter &&
                    null !== b.filter &&
                    (b.filter.smartActionGroupName &&
                      (a.groupName = b.filter.smartActionGroupName),
                    (a.filter = c.stringify(b.filter)),
                    (a.expression = b.filter.expr)),
                  b.hasOwnProperty("expression") &&
                    (a.expression = b.expression),
                  b.hasOwnProperty("submitWhenHidden") &&
                    (a.submitWhenHidden = b.submitWhenHidden));
                this._validationTable.addRow(a);
              },
              this
            );
          },
          _removeFilter: function(a) {
            this._validationTable.editRow(a, {
              expression: "",
              filter: null,
              submitWhenHidden: !1
            });
          },
          _showFilter: function(a) {
            this._filterPage && this._filterPage.destroy();
            this._filterPage = new t({
              nls: this.nls,
              _resourceInfo: this._resourceInfo,
              _url: this._url,
              _layerId: this._layerId,
              _validationTable: this._validationTable
            });
            this._filterPage.popup(a);
          },
          _editGroup: function(a) {
            if (this._smartActionsTable) {
              var b = this._smartActionsTable.getRows();
              h.some(
                b,
                function(b) {
                  if (this._smartActionsTable.getRowData(b).name === a)
                    return (
                      this._fieldsPopUp.close(),
                      this.onGroupEditingStart(),
                      this._smartActionsTable._onActionsEdit(b),
                      !0
                    );
                },
                this
              );
            }
          },
          onGroupEditingStart: function() {},
          removeFromGroup: function(a) {}
        });
      });
    },
    "widgets/SmartEditor/setting/FilterPage": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/json dojo/text!./FilterPage.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/Popup jimu/dijit/Filter esri/lang dijit/form/CheckBox dojo/dom-construct".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k) {
        return l([c, n, a], {
          baseClass: "jimu-widget-smartEditor-filter-page",
          templateString: f,
          _filter: null,
          _url: null,
          _layerId: null,
          _layerDefinition: null,
          _validationTable: null,
          postCreate: function() {
            this.inherited(arguments);
            this._init();
          },
          _init: function() {
            this._origNLS = window.jimuNls.filterBuilder.matchMsg;
            window.jimuNls.filterBuilder.matchMsg = this.nls.filterPage.filterBuilder;
          },
          destroy: function() {
            window.jimuNls.filterBuilder.matchMsg = this._origNLS;
            this._filter &&
              (this._filter.destroyRecursive(),
              (this._filter = null),
              delete this._filter);
            this._submitHidden &&
              (this._submitHidden.destroyRecursive(),
              (this._submitHidden = null),
              delete this._submitHidden);
          },
          popup: function(a) {
            var c;
            a &&
              this._validationTable &&
              (c = this._validationTable.getRowData(a));
            if (c && c.label === this.nls.actionPage.actions.hide) {
              this.submitWhenHidden.style.display = "block";
              this._submitHidden = new q(
                {
                  id: "submitHidden",
                  checked:
                    void 0 === c.submitWhenHidden ? !1 : c.submitWhenHidden,
                  value: this.nls.filterPage.submitHidden
                },
                null
              );
              this.submitWhenHidden.appendChild(this._submitHidden.domNode);
              var f = h.replace(
                "\x3clabel class\x3d'submithide' for\x3d'submitWhenHidden'\x3e{replace}\x3c/label\x3e\x3c/br\x3e\x3c/br\x3e",
                { replace: this.nls.filterPage.submitHidden }
              );
              k.place(f, this._submitHidden.domNode, "after");
            } else this.submitWhenHidden.style.display = "none";
            this._filter = new e({
              style: "width:100%;margin-top:22px;",
              noFilterTip: this.nls.filterPage.noFilterTip
            });
            this._filter.placeAt(this.filterControl);
            var g = new b({
                titleLabel: d.substitute(
                  { action: c ? c.label : this._groupName },
                  this.nls.filterPage.title
                ),
                width: 850,
                height: 485,
                content: this,
                rowData: c,
                buttons: [
                  {
                    label: this.nls.ok,
                    onClick: h.hitch(this, function() {
                      var b = this._filter.toJson(),
                        c = !1;
                      this._submitHidden &&
                        this._submitHidden.checked &&
                        (c = this._submitHidden.checked);
                      b &&
                        b.expr &&
                        ("1\x3d1" === b.expr
                          ? this._validationTable
                            ? this._validationTable.editRow(a, {
                                expression: "",
                                filter: null,
                                submitWhenHidden: c
                              })
                            : ((this._filterInfo = {
                                expression: "",
                                filter: null,
                                submitWhenHidden: c
                              }),
                              this.emit("filterInfo", this._filterInfo))
                          : this._validationTable
                          ? this._validationTable.editRow(a, {
                              expression: b.displaySQL,
                              filter: m.stringify(b),
                              submitWhenHidden: c
                            })
                          : ((this._filterInfo = {
                              expression: b.displaySQL,
                              filter: m.stringify(b),
                              submitWhenHidden: c
                            }),
                            this.emit("filterInfo", this._filterInfo)),
                        g.close());
                    })
                  },
                  {
                    label: this.nls.cancel,
                    classNames: ["jimu-btn jimu-btn-vacation"],
                    onClick: function() {
                      g.close();
                    }
                  }
                ]
              }),
              p;
            c ? (p = c) : this._filterInfo && (p = this._filterInfo);
            p &&
              (void 0 === p.filter || null === p.filter || "" === p.filter
                ? this._filter.build({
                    url: this._url,
                    partsObj: null,
                    layerDefinition: this._layerDefinition,
                    featureLayerId: this._layerId
                  })
                : p.filter.parts
                ? this._filter.build({
                    url: this._url,
                    partsObj: p.filter,
                    layerDefinition: this._layerDefinition,
                    featureLayerId: this._layerId
                  })
                : this._filter.build({
                    url: this._url,
                    partsObj: m.parse(p.filter),
                    layerDefinition: this._layerDefinition,
                    featureLayerId: this._layerId
                  }));
          }
        });
      });
    },
    "widgets/SmartEditor/setting/CopyAttributes": function() {
      define("dojo/_base/declare dojo/Evented dojo/query dojo/dom-style dijit/registry dojo/_base/lang dojo/_base/array dojo/on dojo/dom-construct dojo/text!./CopyAttributes.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/SimpleTable jimu/dijit/Popup esri/lang ./Intersection ./Coordinates ./Address".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g, p, x) {
        return l([k, n, q], {
          baseClass: "jimu-widget-smartEditor-rule-table",
          templateString: d,
          _resourceInfo: null,
          _url: null,
          _fieldName: null,
          _fieldValues: null,
          _configuredFieldValues: null,
          _layerId: null,
          _validGeocoderFields: [],
          _fieldsPopUp: null,
          _removeGroupInfo: null,
          _cbxForActionsWithGroupName: [],
          ValidFieldsForCoordinates: [
            "esriFieldTypeSmallInteger",
            "esriFieldTypeInteger",
            "esriFieldTypeSingle",
            "esriFieldTypeDouble",
            "esriFieldTypeString"
          ],
          ValidFieldsByType: {
            esriFieldTypeOID: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeSmallInteger: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeInteger: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeDouble: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeSingle: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeGUID: ["esriFieldTypeGUID", "esriFieldTypeGlobalID"],
            esriFieldTypeDate: ["esriFieldTypeDate"],
            esriFieldTypeString: "esriFieldTypeSmallInteger esriFieldTypeInteger esriFieldTypeSingle esriFieldTypeDouble esriFieldTypeString esriFieldTypeGUID esriFieldTypeDate esriFieldTypeOID esriFieldTypeGlobalID".split(
              " "
            )
          },
          postCreate: function() {
            this.inherited(arguments);
            this._fieldsPopUp = null;
            this._configuredFieldValues = [];
            this._removeGroupInfo = null;
            this._initActionsTable();
            this._setActionsTable();
          },
          getSettings: function() {
            return this._fieldValues;
          },
          _getConfigActionOrder: function() {
            var a = [],
              b = [];
            this.isRelatedLayer
              ? (b = ["Preset"])
              : ((b = ["Intersection"]),
                (this._validGeocoderFields = this._getValidGeocoderFields()),
                this._validGeocoderFields.length && b.push("Address"),
                -1 < this.ValidFieldsForCoordinates.indexOf(this._fieldType) &&
                  b.push("Coordinates"),
                b.push("Preset"));
            return void 0 !== this._fieldValues &&
              null !== this._fieldValues &&
              this._fieldValues.hasOwnProperty(this._fieldName) &&
              (c.forEach(this._fieldValues[this._fieldName], function(c) {
                -1 < b.indexOf(c.actionName) && a.push(c.actionName);
              }),
              null !== a && 0 !== a.length)
              ? a
              : b;
          },
          _getValidGeocoderFields: function() {
            var a = [],
              b = [],
              a = this.ValidFieldsByType[this._fieldType];
            this._geocoderSettings &&
              this._geocoderSettings.hasOwnProperty("url") &&
              (b = c.filter(this._geocoderSettings.fields, function(b) {
                return -1 < a.indexOf(b.type) ? !0 : !1;
              }));
            return b;
          },
          _getConfigAction: function(a) {
            var b = null;
            void 0 !== this._fieldValues &&
              null !== this._fieldValues &&
              this._fieldValues.hasOwnProperty(this._fieldName) &&
              c.some(this._fieldValues[this._fieldName], function(c) {
                return c.actionName === a ? ((b = c), !0) : !1;
              });
            return b;
          },
          _nlsActionToConfig: function(a) {
            switch (a) {
              case this.nls.actionPage.copyAction.intersection:
                return "Intersection";
              case this.nls.actionPage.copyAction.address:
                return "Address";
              case this.nls.actionPage.copyAction.coordinates:
                return "Coordinates";
              case this.nls.actionPage.copyAction.preset:
                return "Preset";
              default:
                return a;
            }
          },
          popupActionsPage: function() {
            this._fieldsPopUp &&
              (this._fieldsPopUp.close(), (this._fieldsPopUp = null));
            this._fieldsPopUp = new t({
              titleLabel: u.substitute(
                { fieldname: this._fieldName },
                this.nls.actionPage.title
              ),
              width: 920,
              maxHeight: 600,
              autoHeight: !0,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: a.hitch(this, function() {
                    var b = this._copyAttrTable.getRows();
                    if (
                      void 0 === this._fieldValues ||
                      null === this._fieldValues
                    )
                      this._fieldValues = {};
                    this._fieldValues[this._fieldName] = [];
                    c.forEach(
                      b,
                      function(b) {
                        var c;
                        c = this._copyAttrTable.getRowData(b);
                        b = {};
                        b.actionName = this._nlsActionToConfig(c.actionName);
                        this._configuredFieldValues[b.actionName]
                          ? a.mixin(
                              b,
                              this._configuredFieldValues[b.actionName]
                            )
                          : a.mixin(b, { enabled: !1 });
                        a.mixin(b, { enabled: c.enabled });
                        "Preset" === b.actionName &&
                          this._configuredPresetInfos &&
                          !this._configuredPresetInfos.hasOwnProperty(
                            this._fieldName
                          ) &&
                          (this._configuredPresetInfos[this._fieldName] = [""]);
                        !b.enabled &&
                          c.attributeActionGroupName &&
                          ((c = {
                            groupName: c.attributeActionGroupName,
                            layerId: this._layerId,
                            fieldName: this._fieldName,
                            action: b.actionName
                          }),
                          this.removeFromGroup(c),
                          delete b.attributeActionGroupName);
                        this._fieldValues[this._fieldName].push(b);
                      },
                      this
                    );
                    this._fieldsPopUp.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn jimu-btn-vacation"],
                  onClick: a.hitch(this, function() {
                    this._fieldsPopUp.close();
                  })
                }
              ],
              onClose: a.hitch(this, function() {})
            });
          },
          _initActionsTable: function() {
            this._copyAttrTable = new r({
              fields: [
                {
                  name: "enabled",
                  title: this.nls.actionPage.copyAction.enableText,
                  type: "checkbox",
                  width: "15%"
                },
                {
                  name: "actionName",
                  title: this.nls.actionPage.copyAction.actionText,
                  type: "text"
                },
                {
                  name: "attributeActionGroupName",
                  title: this.nls.actionPage.actionsSettingsTable.groupName,
                  type: "text"
                },
                {
                  name: "actions",
                  title: this.nls.actionPage.copyAction.criteriaText,
                  type: "actions",
                  actions: ["up", "down", "edit"],
                  class: "actions"
                }
              ],
              selectable: !1,
              style: { height: "300px", maxHeight: "300px" }
            });
            this._copyAttrTable.placeAt(this.copyAttributeTable);
            this._copyAttrTable.startup();
            this.own(
              b(
                this._copyAttrTable,
                "actions-edit",
                a.hitch(this, this._onActionEdit)
              )
            );
          },
          _onActionEdit: function(b) {
            var c;
            this._removeGroupInfo = null;
            c = this._copyAttrTable.getRowData(b);
            if (c.attributeActionGroupName) {
              var d, g;
              d = e.create("div");
              e.create(
                "div",
                {
                  innerHTML: this.nls.actionPage.editOptionsPopup
                    .editAttributeGroup,
                  className: "settingsDesc"
                },
                d
              );
              e.create(
                "div",
                {
                  innerHTML: this.nls.actionPage.editOptionsPopup
                    .editAttributeGroupHint,
                  className: "editGroupHint"
                },
                d
              );
              g = new t({
                titleLabel: this.nls.actionPage.editOptionsPopup.popupTitle,
                width: 500,
                maxHeight: 445,
                autoHeight: !0,
                content: d,
                class: this.baseClass,
                buttons: [
                  {
                    label: this.nls.actionPage.editOptionsPopup.editGroupButton,
                    onClick: a.hitch(this, function() {
                      this._editGroup(c);
                      g.close();
                    })
                  },
                  {
                    label: this.nls.actionPage.editOptionsPopup
                      .editIndependentlyButton,
                    disable: "Preset" === c.actionName ? !0 : !1,
                    onClick: a.hitch(this, function() {
                      c.attributeActionGroupName &&
                        (this._removeGroupInfo = {
                          groupName: c.attributeActionGroupName,
                          layerId: this._layerId,
                          fieldName: this._fieldName,
                          action: this._nlsActionToConfig(c.actionName)
                        });
                      this._onEditFieldInfoClick(b);
                      g.close();
                    })
                  }
                ]
              });
            } else this._onEditFieldInfoClick(b);
          },
          _onEditFieldInfoClick: function(a) {
            switch (this._copyAttrTable.getRowData(a).actionName) {
              case this.nls.actionPage.copyAction.intersection:
                this._createIntersectionPanel(a);
                break;
              case this.nls.actionPage.copyAction.address:
                this._geocoderSettings &&
                this._geocoderSettings.hasOwnProperty("url")
                  ? this._createAddressPanel(a)
                  : this.emit("SetGeocoder");
                break;
              case this.nls.actionPage.copyAction.coordinates:
                this._createCoordinatesPanel(a);
            }
          },
          _removeFromGroup: function(a) {
            this._removeGroupInfo &&
              (this.removeFromGroup(this._removeGroupInfo),
              this._copyAttrTable.editRow(a, {
                attributeActionGroupName: null
              }));
          },
          _createIntersectionPanel: function(c) {
            this._intersectionDijit = g({
              nls: this.nls,
              _fieldValues: this._configuredFieldValues,
              layerInfos: this.layerInfos,
              map: this.map,
              _fieldType: this._fieldType,
              isGroup: !1,
              ValidFieldsByType: this.ValidFieldsByType
            });
            this.own(
              b(
                this._intersectionDijit,
                "attributeActionUpdated",
                a.hitch(this, function() {
                  this._removeFromGroup(c);
                })
              )
            );
          },
          _createCoordinatesPanel: function(c) {
            this._coordinatesDijit = p({
              nls: this.nls,
              isGroup: !1,
              _fieldType: this._fieldType,
              _fieldValues: this._configuredFieldValues
            });
            this.own(
              b(
                this._coordinatesDijit,
                "attributeActionUpdated",
                a.hitch(this, function() {
                  this._removeFromGroup(c);
                })
              )
            );
          },
          _createAddressPanel: function(c) {
            this._addressDijit = x({
              nls: this.nls,
              _fieldValues: this._configuredFieldValues,
              _geocoderSettings: this._geocoderSettings,
              _validGeocoderFields: this._validGeocoderFields,
              isGroup: !1
            });
            this.own(
              b(
                this._addressDijit,
                "attributeActionUpdated",
                a.hitch(this, function() {
                  this._removeFromGroup(c);
                })
              )
            );
          },
          _setActionsTable: function() {
            var d = this._getConfigActionOrder();
            this._cbxForActionsWithGroupName = [];
            c.forEach(
              d,
              function(d) {
                var g = this._getConfigAction(d),
                  e = d;
                switch (d) {
                  case "Intersection":
                    this.nls.actionPage.hasOwnProperty("copyAction") &&
                      this.nls.actionPage.copyAction.hasOwnProperty(
                        "intersection"
                      ) &&
                      (e = this.nls.actionPage.copyAction.intersection);
                    break;
                  case "Address":
                    this.nls.actionPage.hasOwnProperty("copyAction") &&
                      this.nls.actionPage.copyAction.hasOwnProperty(
                        "address"
                      ) &&
                      (e = this.nls.actionPage.copyAction.address);
                    break;
                  case "Coordinates":
                    this.nls.actionPage.hasOwnProperty("copyAction") &&
                      this.nls.actionPage.copyAction.hasOwnProperty(
                        "coordinates"
                      ) &&
                      (e = this.nls.actionPage.copyAction.coordinates);
                    break;
                  case "Preset":
                    this.nls.actionPage.hasOwnProperty("copyAction") &&
                      this.nls.actionPage.copyAction.hasOwnProperty("preset") &&
                      (e = this.nls.actionPage.copyAction.preset);
                    break;
                  default:
                    e = d;
                }
                e = { actionName: e };
                void 0 !== g && null !== g
                  ? (this._configuredFieldValues[d] = g)
                  : ((this._configuredFieldValues[d] = { enabled: !1 }),
                    "Intersection" === d &&
                      (this._configuredFieldValues[d].fields = []),
                    "Coordinates" === d &&
                      ((this._configuredFieldValues[d].coordinatesSystem =
                        "MapSpatialReference"),
                      (this._configuredFieldValues[d].field = "x")));
                e.enabled = this._configuredFieldValues[d].enabled;
                this._configuredFieldValues[d].hasOwnProperty(
                  "attributeActionGroupName"
                ) &&
                  (e.attributeActionGroupName = this._configuredFieldValues[
                    d
                  ].attributeActionGroupName);
                e.enabled &&
                  "Preset" === d &&
                  !this._configuredFieldValues[d].hasOwnProperty(
                    "attributeActionGroupName"
                  ) &&
                  (e.enabled = !1);
                g = this._copyAttrTable.addRow(e);
                e = h(".jimu-checkbox", g.tr)[0];
                e = f.byNode(e);
                "Preset" !== d ||
                  this._configuredFieldValues[d].hasOwnProperty(
                    "attributeActionGroupName"
                  ) ||
                  (e.set("disabled", !0),
                  (g = h(".jimu-icon-edit", g.tr)) &&
                    0 < g.length &&
                    m.set(g[0], "display", "none"));
                this._configuredFieldValues[d].hasOwnProperty(
                  "attributeActionGroupName"
                ) &&
                  (this._cbxForActionsWithGroupName.push(e),
                  this.own(
                    b(
                      e,
                      "change",
                      a.hitch(this, function() {
                        var a = !0;
                        c.some(
                          this._cbxForActionsWithGroupName,
                          function(b) {
                            b.getValue() ||
                              ((a = !1),
                              m.set(this.warningNote, "display", "block"));
                          },
                          this
                        );
                        a && m.set(this.warningNote, "display", "none");
                      })
                    )
                  ));
              },
              this
            );
          },
          geocoderConfigured: function() {
            this._geocoderSettings &&
              this._geocoderSettings.hasOwnProperty("url") &&
              this._createAddressPanel();
          },
          _editGroup: function(a) {
            var b, d;
            b = a.attributeActionGroupName;
            d = this._nlsActionToConfig(a.actionName);
            this._copyAttrTable &&
              ((a = this._attributeActionsTable[d].getRows()),
              c.some(
                a,
                function(a) {
                  if (this._attributeActionsTable[d].getRowData(a).name === b)
                    return (
                      this._fieldsPopUp.close(),
                      this.onGroupEditingStart(
                        this.nls.layersPage.attributeActionsTabTitle
                      ),
                      this._attributeActionsTable[d]._onActionsEdit(a),
                      !0
                    );
                },
                this
              ));
          },
          onGroupEditingStart: function(a) {
            this.emit("onGroupEditingStart", a);
          },
          removeFromGroup: function(a) {
            this.emit("removeFromGroup", a);
          }
        });
      });
    },
    "widgets/SmartEditor/setting/Intersection": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dijit/form/Select dojo/_base/array dojo/dom-attr dojo/dom-construct dojo/on dojo/query dojo/promise/all dojo/Deferred dojo/text!./Intersection.html dijit/_TemplatedMixin jimu/dijit/LayerChooserFromMap jimu/dijit/LayerChooserFromMapWithDropbox jimu/BaseWidgetSetting jimu/dijit/SimpleTable jimu/dijit/Message jimu/dijit/Popup jimu/dijit/CheckBox dijit/popup dijit/TooltipDialog dijit/form/ValidationTextBox dijit/form/NumberTextBox dijit/form/DropDownButton dojo/dom-class ./layersAndFieldsApplyOn".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D,
        y,
        z
      ) {
        return l([g, n, r], {
          baseClass: "jimu-widget-smartEditor-setting-intersection",
          templateString: k,
          popup: null,
          totalLayers: [],
          _layersForApplyOn: [],
          isGroup: !1,
          ValidFieldsByType: {
            esriFieldTypeOID: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeSmallInteger: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeInteger: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeDouble: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeSingle: [
              "esriFieldTypeOID",
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeGUID: ["esriFieldTypeGUID", "esriFieldTypeGlobalID"],
            esriFieldTypeDate: ["esriFieldTypeDate"],
            esriFieldTypeString: "esriFieldTypeSmallInteger esriFieldTypeInteger esriFieldTypeSingle esriFieldTypeDouble esriFieldTypeString esriFieldTypeGUID esriFieldTypeDate esriFieldTypeOID esriFieldTypeGlobalID".split(
              " "
            )
          },
          ValidFieldsByTypeToApplyOn: {
            esriFieldTypeInteger: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeGUID: ["esriFieldTypeGUID"],
            esriFieldTypeDate: ["esriFieldTypeDate"],
            esriFieldTypeString: ["esriFieldTypeString"]
          },
          postCreate: function() {
            this.inherited(arguments);
            this.totalLayers = [];
            this._layersForApplyOn = [];
            this._createToleranceSettingsDialogContent();
            this._createDialogContent();
            this.isDelete || this.showDialog();
            this._initLayerSelector();
            this._createLayersAndFields();
            this.own(
              b(
                this.addLayer,
                "click",
                h.hitch(this, function() {
                  if (0 < this.totalLayers.length) {
                    var a = this._layerTable.addRow({}).tr;
                    this._addLayersDropDown(a);
                    this._addFieldsDropDown(a);
                    this._addToleranceSettings(a);
                  } else new x({ message: this.nls.intersectionPage.noLayersMessage });
                })
              )
            );
          },
          _createDialogContent: function() {
            this.isEnabled = !1;
            this._fieldValues &&
              this._fieldValues.Intersection &&
              this._fieldValues.Intersection.hasOwnProperty("enabled") &&
              (this.isEnabled = this._fieldValues.Intersection.enabled);
            this._initControls();
            this._initTable();
          },
          _initControls: function() {
            this.groupNameTextBox = new C(
              { style: { width: "100%" }, required: !0, trim: !0 },
              c.create("div", {}, this.groupNameTextBoxNode)
            );
            this.groupNameTextBox.validator = h.hitch(this, function(a) {
              return a
                ? a !== this.prevName &&
                  this.editUtils.isDuplicateGroupName(
                    a,
                    this.existingGroupNames
                  )
                  ? (this.groupNameTextBox.set(
                      "invalidMessage",
                      this.nls.smartActionsPage.uniqueGroupNameMsg
                    ),
                    !1)
                  : !0
                : (this.groupNameTextBox.set(
                    "invalidMessage",
                    this.nls.smartActionsPage.requiredGroupNameMsg
                  ),
                  !1);
            });
            this.name && this.groupNameTextBox.set("value", this.name);
            this.dataTypeDropdown = new m({
              options: this._addDataTypeOptions(),
              style: { width: "100%" }
            });
            this.dataTypeDropdown.placeAt(this.dataTypeDropDownNode);
            this.dataTypeDropdown.startup();
            this.own(
              b(
                this.dataTypeDropdown,
                "change",
                h.hitch(this, function(a) {
                  this.isGroup &&
                    ((this._fieldType = a),
                    (this.totalLayers = []),
                    (this._layersForApplyOn = []),
                    (a = this._layerTable.getRows()),
                    f.forEach(
                      a,
                      h.hitch(this, function(a) {
                        this._layerTable.deleteRow(a);
                      })
                    ),
                    this._initLayerSelector(),
                    this._createLayersAndFields());
                })
              )
            );
            this._fieldType &&
              this.dataTypeDropdown.set("value", this._fieldType, !1);
            this.ignoreLayerRanking = new v(
              {
                label: this.nls.intersectionPage.ignoreLayerRankingCheckboxLabel
              },
              c.create("div", {}, this.ignoreLayerRankingNode)
            );
          },
          _addDataTypeOptions: function() {
            return [
              {
                label: this.nls.dataType.esriFieldTypeString,
                value: "esriFieldTypeString"
              },
              {
                label: this.nls.dataType.esriFieldTypeInteger,
                value: "esriFieldTypeInteger"
              },
              {
                label: this.nls.dataType.esriFieldTypeDate,
                value: "esriFieldTypeDate"
              },
              {
                label: this.nls.dataType.esriFieldTypeGUID,
                value: "esriFieldTypeGUID"
              }
            ];
          },
          _initTable: function() {
            this._layerTable = new p({
              fields: [
                {
                  name: "layerName",
                  title: this.nls.intersectionPage.layerText,
                  type: "empty",
                  width: "30%"
                },
                {
                  name: "fieldName",
                  title: this.nls.intersectionPage.fieldText,
                  type: "empty",
                  width: "30%"
                },
                {
                  name: "toleranceSettings",
                  title: this.nls.intersectionPage.toleranceSettingText,
                  type: "empty",
                  width: "25%"
                },
                {
                  name: "actions",
                  title: this.nls.intersectionPage.actionsText,
                  type: "actions",
                  width: "15%",
                  actions: ["up", "down", "delete"],
                  class: "actions"
                }
              ],
              selectable: !1
            });
            this._layerTable.placeAt(this.layerTableNode);
            this._layerTable.startup();
            this.own(
              b(
                this._layerTable,
                "actions-edit",
                h.hitch(this, this._onEditFieldInfoClick)
              )
            );
            this.own(
              b(
                this._layerTable,
                "actions-delete",
                h.hitch(this, this._onDeleteFieldInfoClick)
              )
            );
            this._populateTableData();
          },
          _populateTableData: function() {
            this._fieldValues.Intersection.ignoreLayerRanking &&
              this.ignoreLayerRanking.setValue(!0);
            f.forEach(
              this._fieldValues.Intersection.fields,
              h.hitch(this, function(a) {
                var b;
                a.layerId &&
                  this.layerInfos.getLayerInfoById(a.layerId) &&
                  ((b = this._layerTable.addRow({}).tr),
                  this._addLayersDropDown(b, a),
                  this._addFieldsDropDown(b, a),
                  this._addToleranceSettings(b, a));
              })
            );
          },
          _createToleranceSettingsDialogContent: function() {
            var d, g, e;
            d = c.create("div", { class: "esriCTpopupFieldContent" });
            this._useDefaultToleranceCheckbox = new v(
              { label: this.nls.intersectionPage.useDefaultToleranceText },
              c.create("div", { class: "esriCTPopupLabels" }, d)
            );
            c.create(
              "div",
              {
                class: "esriCTPopupLabels esriCTMargin",
                innerHTML: this.nls.intersectionPage.toleranceValueText
              },
              d
            );
            this._toleranceValueTextbox = new F(
              {
                style: { width: "100%" },
                constraints: { min: 0 },
                required: !0
              },
              c.create("div", { class: "esriCTPopupLabels" }, d)
            );
            c.create(
              "div",
              {
                class: "esriCTPopupLabels esriCTMargin",
                innerHTML: this.nls.intersectionPage.toleranceUnitText
              },
              d
            );
            g = [
              { label: this.nls.units.miles, value: "miles" },
              { label: this.nls.units.kilometers, value: "kilometers" },
              { label: this.nls.units.meters, value: "meters" },
              { label: this.nls.units.feet, value: "feet" }
            ];
            e = c.create("div", {}, d);
            this._toleranceUnitDropdown = new m({
              style: { width: "200px" },
              options: g
            });
            this._toleranceUnitDropdown.placeAt(e);
            this._toleranceUnitDropdown.startup();
            this.toleranceSettingIconDialog = new E({
              class: this.baseClass,
              content: d
            });
            this.own(
              b(
                this.toleranceSettingIconDialog,
                "close",
                h.hitch(this, function() {
                  var b, c, d, g;
                  b = this._useDefaultToleranceCheckbox.getValue();
                  c = this._toleranceValueTextbox.get("value");
                  d = this._toleranceUnitDropdown.getValue();
                  b
                    ? (g = this._useDefaultToleranceCheckbox.label)
                    : this._toleranceValueTextbox.isValid() &&
                      (g =
                        "px" === d
                          ? c + " " + this.nls.intersectionPage.pixelsUnitText
                          : c + " " + this.nls.units[d]);
                  if (b || this._toleranceValueTextbox.isValid())
                    this._toleranceValueTextbox.isValid()
                      ? (this._selectedRowForToleranceSettings.toleranceSettings.value = c)
                      : (this._selectedRowForToleranceSettings.toleranceSettings.value = 0),
                      (this._selectedRowForToleranceSettings.toleranceSettings.unit = d),
                      (this._selectedRowForToleranceSettings.toleranceSettings.useDefault = b),
                      a.set(
                        this._selectedRowForToleranceSettings
                          .toleranceTextContainer,
                        "innerHTML",
                        g
                      ),
                      a.set(
                        this._selectedRowForToleranceSettings
                          .toleranceTextContainer,
                        "title",
                        g
                      );
                })
              )
            );
          },
          _addToleranceSettings: function(a, d) {
            var g;
            a.toleranceSettings =
              d && d.toleranceSettings
                ? d.toleranceSettings
                : { useDefault: !1, value: 0, unit: "meters" };
            d = a.toleranceSettings.useDefault
              ? this._useDefaultToleranceCheckbox.label
              : "px" === a.toleranceSettings.unit
              ? a.toleranceSettings.value +
                " " +
                this.nls.intersectionPage.pixelsUnitText
              : a.toleranceSettings.value +
                " " +
                this.nls.units[a.toleranceSettings.unit];
            g = e(".simple-table-cell", a)[2];
            g = c.create("div", { class: "esriCTToleranceParentDiv" }, g);
            a.toleranceTextContainer = c.create(
              "div",
              {
                class: "esriCTToleranceValueText esriCTEllipsis",
                innerHTML: d,
                title: d
              },
              g
            );
            d = new D(
              {
                iconClass: "esriCTToleranceSettingsIcon",
                dropDown: this.toleranceSettingIconDialog,
                title: this.nls.intersectionPage.toleranceSettingText
              },
              c.create("div", {}, g)
            );
            this.own(
              b(
                d,
                "click",
                h.hitch(this, function() {
                  this._selectedRowForToleranceSettings = a;
                  this._updateUnitsOption();
                  this._toleranceValueTextbox.set(
                    "value",
                    a.toleranceSettings.value
                  );
                  this._useDefaultToleranceCheckbox.setValue(
                    a.toleranceSettings.useDefault
                  );
                  this._toleranceUnitDropdown.set(
                    "value",
                    a.toleranceSettings.unit
                  );
                })
              )
            );
          },
          _updateUnitsOption: function() {
            var a = !1;
            "esriGeometryPoint" ===
            this._selectedRowForToleranceSettings.layerSelector.getSelectedItem()
              .layerInfo.layerObject.geometryType
              ? (f.some(
                  this._toleranceUnitDropdown.options,
                  h.hitch(this, function(b) {
                    if ("px" === b.value) return (a = !0);
                  })
                ),
                a ||
                  this._toleranceUnitDropdown.addOption({
                    label: this.nls.intersectionPage.pixelsUnitText,
                    value: "px"
                  }))
              : this._toleranceUnitDropdown.removeOption("px");
          },
          _addLayersDropDown: function(c, d) {
            var g, v;
            c.layerSelector && c.layerSelector.destroy();
            g = this._createLayerChooserMapArgs();
            v = new t(g);
            v.startup();
            g = e(".simple-table-cell", c)[0];
            v = new u({ layerChooser: v });
            v.placeAt(g);
            v.startup();
            c.layerSelector = v;
            v.setSelectedLayer(this.totalLayers[0]);
            d &&
              v.setSelectedLayer(
                this.layerInfos.getLayerInfoById(d.layerId).layerObject
              );
            this.own(
              b(
                v,
                "selection-change",
                h.hitch(this, function() {
                  var b, d;
                  c.layerFields.set("options", this._addLayerFieldOptions(c));
                  c.layerFields.set("value", c.layerFields.options[0], !1);
                  b = e(".esriCTToleranceValueText", c)[0];
                  d = this.nls.units.meters;
                  c.toleranceSettings = { value: 0, unit: "meters" };
                  a.set(b, "innerHTML", "0 " + d);
                })
              )
            );
          },
          _createLayerChooserMapArgs: function() {
            return {
              multiple: !1,
              createMapResponse: this.map.webMapResponse,
              filter: this._createFiltersForLayerSelector()
            };
          },
          _createIntersectionLayerfilter: function(a) {
            return function(b) {
              var c = !1;
              b.getLayerObject().then(function(b) {
                b &&
                  b.fields &&
                  f.some(b.fields, function(b) {
                    if (-1 < a.indexOf(b.type)) return (c = !0);
                  });
              });
              return c;
            };
          },
          _createFiltersForLayerSelector: function() {
            var a, b;
            a = t.createFeaturelayerFilter(
              ["point", "polyline", "polygon"],
              !1,
              !1
            );
            b = t.createImageServiceLayerFilter(!0);
            a = t.orCombineFilters([a, b]);
            b = this._createIntersectionLayerfilter(
              this.ValidFieldsByType[this._fieldType]
            );
            return t.andCombineFilters([a, b]);
          },
          _initLayerSelector: function() {
            var a, b;
            a = [];
            b = this._createLayerChooserMapArgs();
            this._layerChooserFromMap = new t(b);
            this._layerChooserFromMap.startup();
            b = this._layerChooserFromMap.layerInfosObj.getLayerInfoArray();
            this._getAllFilteredLayers(b, a);
            return a;
          },
          _getAllFilteredLayers: function(a, b) {
            f.forEach(
              a,
              h.hitch(this, function(a) {
                var c;
                a.isLeaf()
                  ? ((c = new q()),
                    this._layerChooserFromMap.filter(a).then(
                      h.hitch(this, function(b) {
                        b &&
                          (this.totalLayers.push(a),
                          this._isLayerEditable(a) &&
                            this._layersForApplyOn.push(a));
                        c.resolve();
                      })
                    ),
                    b.push(c))
                  : this._getAllFilteredLayers(a.newSubLayers, b);
              })
            );
          },
          _isLayerEditable: function(a) {
            var b = !1;
            a &&
              a.layerObject &&
              a.layerObject.getEditCapabilities &&
              ((a = a.layerObject.getEditCapabilities()),
              a.canCreate ||
                a.canUpdate ||
                a.canDelete ||
                a.canUpdateGeometry) &&
              (b = !0);
            return b;
          },
          _addFieldsDropDown: function(a, b) {
            var d;
            if ((d = e(".simple-table-cell", a)[1]))
              (d = c.create("div", { class: "esriCTDropDownContainer" }, d)),
                (a.layerFields = new m({
                  options: this._addLayerFieldOptions(a),
                  class: "esriCTSettingsFieldDropdown"
                })),
                a.layerFields.placeAt(d),
                a.layerFields.startup(),
                b && a.layerFields.set("value", b.field, !1);
          },
          _addLayerNameOptions: function() {
            var a,
              b = [];
            a = this.layerInfos.getLayerInfoArray();
            f.forEach(
              a,
              h.hitch(this, function(a) {
                -1 < a.layerObject.capabilities.indexOf("Query") &&
                  b.push({
                    label: a.layerObject.name,
                    value: a.layerObject.id
                  });
              })
            );
            return b;
          },
          _addLayerFieldOptions: function(a) {
            var b = [],
              c = [];
            if (!a.layerSelector.getSelectedItem()) return b;
            "esriFieldTypeString" === this._fieldType &&
              b.push({
                label: this.nls.intersectionPage.useLayerName,
                value: "esriCTUseLayerName"
              });
            c = this.ValidFieldsByType[this._fieldType];
            a = a.layerSelector.getSelectedItem().layerInfo.layerObject;
            f.forEach(
              a.fields,
              h.hitch(this, function(a) {
                "esriFieldTypeGeometry" !== a.type &&
                  "esriFieldTypeBlob" !== a.type &&
                  "esriFieldTypeRaster" !== a.type &&
                  "esriFieldTypeXML" !== a.type &&
                  -1 < c.indexOf(a.type) &&
                  b.push({ label: a.alias || a.name, value: a.name });
              })
            );
            return b;
          },
          showDialog: function() {
            var a = 600,
              b = !1;
            this.isGroup ||
              (y.add(this.groupInfoNode1, "esriCTHidden"),
              y.add(this.groupInfoNode2, "esriCTHidden"),
              y.add(this.layerTableNode, "esriCTIntersectionTableMaxHeight"),
              (b = !0),
              (a = 400));
            var c = new w({
              titleLabel: this.nls.actionPage.copyAction.intersection,
              width: 950,
              maxHeight: a,
              autoHeight: b,
              content: this,
              class: this.baseClass,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var a = {},
                      b = {};
                    a.enabled = this.isEnabled;
                    a.ignoreLayerRanking = this.ignoreLayerRanking.checked;
                    a.fields = this._getTableData();
                    if (this.isGroup) {
                      if (!this.groupNameTextBox.isValid()) {
                        this.groupNameTextBox.focus();
                        return;
                      }
                    } else delete this._fieldValues.Intersection.attributeActionGroupName;
                    this._fieldValues.Intersection ||
                      (this._fieldValues.Intersection = {
                        actionName: "Intersection"
                      });
                    h.mixin(this._fieldValues.Intersection, a);
                    this.isGroup
                      ? ((b.name = this.groupNameTextBox.get("value")),
                        (b.dataType = this.dataTypeDropdown.get("value")),
                        (b.attributeInfo = a),
                        (b.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(
                          b
                        )),
                        this.emit("groupInfoUpdated", b))
                      : this.emit("attributeActionUpdated");
                    c.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    c.close();
                  })
                }
              ],
              onClose: h.hitch(this, function() {})
            });
          },
          _getTableData: function() {
            var a = [],
              b;
            f.forEach(
              this._layerTable.getRows(),
              h.hitch(this, function(c) {
                c.layerSelector &&
                  ((b = {}),
                  (b.layerId = c.layerSelector.getSelectedItem().layerInfo.id),
                  (b.field = c.layerFields.getValue()),
                  (b.toleranceSettings = h.clone(c.toleranceSettings)),
                  a.push(b));
              })
            );
            return a;
          },
          _createLayerFieldsFilter: function(a) {
            var b = [],
              c = {};
            f.forEach(
              this._layersForApplyOn,
              h.hitch(this, function(d) {
                d.isTable ||
                  f.forEach(
                    d.layerObject.fields,
                    h.hitch(this, function(g) {
                      this.ValidFieldsByTypeToApplyOn[a] &&
                        ((b = this.ValidFieldsByTypeToApplyOn[a]),
                        -1 < b.indexOf(g.type) &&
                          g.editable &&
                          (c[d.id] || (c[d.id] = {}), (c[d.id][g.name] = g)));
                    })
                  );
              })
            );
            return c;
          },
          _createLayersAndFields: function() {
            this._layerAndFieldsApplyOnObj = new z({
              map: this.map,
              layerInfos: this.layerInfos,
              _configInfos: this._configInfos,
              actionName: "Intersection",
              nls: this.nls,
              prevName: this.prevName,
              existingGroups: this.existingGroups,
              layerDetails: this._createLayerFieldsFilter(
                this.dataTypeDropdown.get("value")
              ),
              appliedOn: this.appliedOn
            });
            c.empty(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.startup();
          },
          deleteGroup: function() {
            this._layerAndFieldsApplyOnObj.deleteGroup();
          }
        });
      });
    },
    "jimu/dijit/LayerChooserFromMap": function() {
      define("dojo/on dojo/Evented dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/store/Memory dojo/Deferred dojo/store/Observable dijit/tree/ObjectStoreModel dojo/promise/all dojo/_base/lang dojo/_base/html dojo/_base/array jimu/utils jimu/dijit/_Tree jimu/LayerInfos/LayerInfos jimu/dijit/LoadingIndicator".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g, p, x) {
        var w = h([m, f, a, n], {
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
            r.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
            this.multiple = !!this.multiple;
            this.shelter = new x({ hidden: !0 });
            this.shelter.placeAt(this.domNode);
            this.shelter.startup();
            this._createTree();
            this.basicFilter = k.hitch(this, this.basicFilter);
            this.filter = w.andCombineFilters([this.basicFilter, this.filter]);
            this.createMapResponse &&
              this.setCreateMapResponse(this.createMapResponse);
          },
          basicFilter: function(a) {
            var c = new b();
            this.onlyShowVisible ? c.resolve(a.isShowInMap()) : c.resolve(!0);
            return c;
          },
          filter: function(a) {
            a = new b();
            a.resolve(!0);
            return a;
          },
          getSelectedItems: function() {
            var a = this.tree.getSelectedItems();
            return t.map(
              a,
              k.hitch(this, function(a) {
                return this.getHandledItem(a);
              })
            );
          },
          getAllItems: function() {
            var a = this.tree.getAllItems(),
              b = [];
            t.forEach(
              a,
              k.hitch(this, function(a) {
                "root" !== a.id && ((a = this.getHandledItem(a)), b.push(a));
              })
            );
            return b;
          },
          getHandledItem: function(a) {
            return { name: a.name, layerInfo: a.layerInfo };
          },
          _isLeafItem: function(a) {
            return a.isLeaf;
          },
          setCreateMapResponse: function(a) {
            this.createMapResponse = a;
            p.getInstance(
              this.createMapResponse.map,
              this.createMapResponse.itemInfo
            ).then(
              k.hitch(this, function(a) {
                this.layerInfosObj = a;
                this.own(
                  l(
                    this.layerInfosObj,
                    "layerInfosChanged",
                    k.hitch(this, this._onLayerInfosChanged)
                  )
                );
                this.updateWhenLayerInfosIsShowInMapChanged &&
                  this.own(
                    l(
                      this.layerInfosObj,
                      "layerInfosIsShowInMapChanged",
                      k.hitch(this, this._onLayerInfosIsShowInMapChanged)
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
          _buildTree: function(a) {
            this._clear();
            r.setStyle(this.errorTipSection, "display", "block");
            var b = [];
            this.onlyShowWebMapLayers
              ? ((b = a.getLayerInfoArrayOfWebmap()),
                (b = b.concat(a.getTableInfoArrayOfWebmap())))
              : ((b = a.getLayerInfoArray()),
                (b = b.concat(a.getTableInfoArray())));
            0 !== b.length &&
              (r.setStyle(this.errorTipSection, "display", "none"),
              t.forEach(
                b,
                k.hitch(this, function(a) {
                  this._addDirectLayerInfo(a);
                })
              ));
          },
          _addDirectLayerInfo: function(a) {
            a &&
              a.getLayerObject().then(
                k.hitch(this, function() {
                  this._addItem("root", a);
                }),
                k.hitch(this, function(a) {
                  console.error(a);
                })
              );
          },
          _clear: function() {
            var a = this._store.query({ parent: "root" });
            t.forEach(
              a,
              k.hitch(this, function(a) {
                a && "root" !== a.id && this._store.remove(a.id);
              })
            );
          },
          _addItem: function(a, b) {
            var c = null,
              d = b.getLayerType(),
              g = this.filter(b);
            q({ layerType: d, valid: g }).then(
              k.hitch(this, function(d) {
                if (d.valid) {
                  var g = k.hitch(this, function(g, e) {
                      this._id++;
                      c = {
                        name: b.title || "",
                        parent: a,
                        layerInfo: b,
                        type: d.layerType,
                        layerClass: b.layerObject.declaredClass,
                        id: this._id.toString(),
                        isLeaf: g,
                        hasChildren: e
                      };
                      this._store.add(c);
                    }),
                    e = b.getSubLayers(),
                    v = 0 === e.length;
                  v
                    ? g(v, !1)
                    : ((e = t.map(
                        e,
                        k.hitch(this, function(a) {
                          return this.filter(a);
                        })
                      )),
                      q(e).then(
                        k.hitch(this, function(a) {
                          (a = t.some(a, function(a) {
                            return a;
                          })) && g(v, a);
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
            var a = this._getRootItem(),
              a = new c({
                data: [a],
                getChildren: function(a) {
                  return this.query({ parent: a.id });
                }
              });
            this._store = new e(a);
            a = new d({
              store: this._store,
              query: { id: "root" },
              mayHaveChildren: k.hitch(this, this._mayHaveChildren)
            });
            this.tree = new g({
              multiple: this.multiple,
              model: a,
              showRoot: !1,
              isLeafItem: k.hitch(this, this._isLeafItem),
              style: { width: "100%" },
              onOpen: k.hitch(this, function(a, b) {
                "root" !== a.id && this._onTreeOpen(a, b);
              }),
              onClick: k.hitch(this, function(a, b, c) {
                this._onTreeClick(a, b, c);
                this.emit("tree-click", a, b, c);
              }),
              getIconStyle: k.hitch(this, function(a, b) {
                var c = null;
                if (!a || "root" === a.id) return null;
                var d = {
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundImage: ""
                  },
                  g =
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    require.toUrl("jimu");
                if ((a = this._getIconInfo(a, b).imageName))
                  (d.backgroundImage = "url(" + g + "/css/images/" + a + ")"),
                    (c = d);
                return c;
              }),
              getIconClass: k.hitch(this, function(a, b) {
                return this._getIconInfo(a, b).className;
              }),
              getTooltip: k.hitch(this, function(a) {
                return this.displayTooltipForTreeNode ? a.layerInfo.title : "";
              })
            });
            r.addClass(this.tree.domNode, this._treeClass);
            this.tree.placeAt(this.shelter.domNode, "before");
          },
          _mayHaveChildren: function(a) {
            return a.hasChildren;
          },
          _getIconInfo: function(a, b) {
            var c = "",
              d = "";
            "ArcGISDynamicMapServiceLayer" === a.type ||
            "ArcGISTiledMapServiceLayer" === a.type
              ? b
                ? ((c = "mapserver_open.png"),
                  (d = "mapservice-layer-icon open"))
                : ((c = "mapserver_close.png"),
                  (d = "mapservice-layer-icon close"))
              : "GroupLayer" === a.type
              ? b
                ? ((c = "group_layer2.png"), (d = "group-layer-icon open"))
                : ((c = "group_layer1.png"), (d = "group-layer-icon close"))
              : "FeatureLayer" === a.type
              ? ((a = u.getTypeByGeometryType(
                  a.layerInfo.layerObject.geometryType
                )),
                "point" === a
                  ? ((c = "point_layer1.png"), (d = "point-layer-icon"))
                  : "polyline" === a
                  ? ((c = "line_layer1.png"), (d = "line-layer-icon"))
                  : "polygon" === a &&
                    ((c = "polygon_layer1.png"), (d = "polygon-layer-icon")))
              : "Table" === a.type
              ? ((c = "table.png"), (d = "table-icon"))
              : "ArcGISImageServiceLayer" === a.type ||
                "ArcGISImageServiceVectorLayer" === a.type
              ? ((c = "image_layer.png"), (d = "iamge-layer-icon"))
              : b
              ? ((c = "mapserver_open.png"), (d = "mapservice-layer-icon open"))
              : ((c = "mapserver_close.png"),
                (d = "mapservice-layer-icon close"));
            return { imageName: c, className: d };
          },
          _onTreeOpen: function(a, b) {
            if ("root" !== a.id) {
              var c = [];
              b = [];
              c = a.layerInfo.getSubLayers();
              a.checked ||
                (this.shelter.show(),
                (b = t.map(
                  c,
                  k.hitch(this, function(a) {
                    return a.getLayerObject();
                  })
                )),
                q(b).then(
                  k.hitch(this, function() {
                    this.domNode &&
                      (t.forEach(
                        c,
                        k.hitch(this, function(b) {
                          this._addItem(a.id, b);
                        })
                      ),
                      (a.checked = !0),
                      this.shelter.hide());
                  }),
                  k.hitch(this, function(a) {
                    console.error(a);
                    this.shelter.hide();
                  })
                ));
            }
          },
          _onTreeClick: function(a, b, c) {},
          destroy: function() {
            this.shelter && (this.shelter.destroy(), (this.shelter = null));
            this.tree && this.tree.destroy();
            this.inherited(arguments);
          }
        });
        w.createFilterByLayerType = function(a) {
          k.isArrayLike(a) || (a = []);
          return function(c) {
            var d = new b();
            if (0 === a.length) d.resolve(!0);
            else {
              var g = [];
              c.traversal(function(a) {
                g.push(a.getLayerType());
              });
              q(g).then(
                function(b) {
                  for (var c = 0; c < b.length; c++)
                    for (var g = 0; g < a.length; g++)
                      if (b[c] === a[g]) {
                        d.resolve(!0);
                        return;
                      }
                  d.resolve(!1);
                },
                function(a) {
                  console.error(a);
                  d.reject(a);
                }
              );
            }
            return d;
          };
        };
        w.createFeaturelayerFilter = function(a, b, c, d) {
          var g = ["point", "polyline", "polygon"];
          a && 0 < a.length
            ? ((a = t.filter(a, function(a) {
                return 0 <= g.indexOf(a);
              })),
              0 === a.length && (a = g))
            : (a = g);
          return function(g) {
            var e = g.getLayerType();
            g = g.getLayerObject();
            return q({ layerType: e, layerObject: g }).then(function(g) {
              var e = g.layerType;
              g = g.layerObject;
              if (
                "ArcGISDynamicMapServiceLayer" === e ||
                "ArcGISTiledMapServiceLayer" === e ||
                "GroupLayer" === e ||
                "FeatureCollection" === e
              )
                return !0;
              if ("FeatureLayer" === e) {
                var e = u.getTypeByGeometryType(g.geometryType),
                  e = 0 <= t.indexOf(a, e),
                  k = w._shouldPassStatisticsCheck(d, g);
                return g.url
                  ? ((g = u.isFeaturelayerUrlSupportQuery(
                      g.url,
                      g.capabilities
                    )),
                    e && g && k)
                  : b && e;
              }
              return "Table" === e
                ? ((e = u.isFeaturelayerUrlSupportQuery(g.url, g.capabilities)),
                  (g = w._shouldPassStatisticsCheck(d, g)),
                  c && e && g)
                : !1;
            });
          };
        };
        w.createImageServiceLayerFilter = function(a, b) {
          return function(c) {
            var d = c.getLayerType();
            c = c.getLayerObject();
            return q({ layerType: d, layerObject: c }).then(function(c) {
              var d = c.layerType,
                g = c.layerObject;
              return "ArcGISImageServiceLayer" === d ||
                "ArcGISImageServiceVectorLayer" === d
                ? a
                  ? u.isImageServiceSupportQuery(c.layerObject.capabilities)
                    ? b
                      ? w._shouldPassStatisticsCheck(b, g)
                      : !0
                    : !1
                  : !0
                : !1;
            });
          };
        };
        w._shouldPassStatisticsCheck = function(a, b) {
          return a
            ? ((a = !1),
              (a = b.advancedQueryCapabilities
                ? !!b.advancedQueryCapabilities.supportsStatistics
                : !!b.supportsStatistics))
            : !0;
        };
        w.createQueryableLayerFilter = function(a) {
          var b = w.createFeaturelayerFilter(
            ["point", "polyline", "polygon"],
            !1,
            !0,
            a
          );
          a = w.createImageServiceLayerFilter(!0, a);
          return w.orCombineFilters([b, a]);
        };
        w.andCombineFilters = function(a) {
          return w._combineFilters(a, !0);
        };
        w.orCombineFilters = function(a) {
          return w._combineFilters(a, !1);
        };
        w._combineFilters = function(a, c) {
          return function(d) {
            var g = new b(),
              e = t.map(a, function(a) {
                return a(d);
              });
            q(e).then(
              function(a) {
                var b = !1,
                  b = c
                    ? t.every(a, function(a) {
                        return a;
                      })
                    : t.some(a, function(a) {
                        return a;
                      });
                g.resolve(b);
              },
              function(a) {
                console.error(a);
                g.reject(a);
              }
            );
            return g;
          };
        };
        return w;
      });
    },
    "dijit/tree/ObjectStoreModel": function() {
      define("dojo/_base/array dojo/aspect dojo/_base/declare dojo/Deferred dojo/_base/lang dojo/when ../Destroyable".split(
        " "
      ), function(l, n, h, m, f, a, c) {
        return h("dijit.tree.ObjectStoreModel", c, {
          store: null,
          labelAttr: "name",
          labelType: "text",
          root: null,
          query: null,
          constructor: function(a) {
            f.mixin(this, a);
            this.childrenCache = {};
          },
          getRoot: function(b, c) {
            if (this.root) b(this.root);
            else {
              var d = this.store.query(this.query);
              d.then && this.own(d);
              a(
                d,
                f.hitch(this, function(a) {
                  if (1 != a.length)
                    throw Error(
                      "dijit.tree.ObjectStoreModel: root query returned " +
                        a.length +
                        " items, but must return exactly one"
                    );
                  this.root = a[0];
                  b(this.root);
                  d.observe &&
                    d.observe(
                      f.hitch(this, function(a) {
                        this.onChange(a);
                      }),
                      !0
                    );
                }),
                c
              );
            }
          },
          mayHaveChildren: function() {
            return !0;
          },
          getChildren: function(b, c, d) {
            var e = this.store.getIdentity(b);
            if (this.childrenCache[e]) a(this.childrenCache[e], c, d);
            else {
              var k = (this.childrenCache[e] = this.store.getChildren(b));
              k.then && this.own(k);
              k.observe &&
                this.own(
                  k.observe(
                    f.hitch(this, function(c, d, e) {
                      this.onChange(c);
                      d != e && a(k, f.hitch(this, "onChildrenChange", b));
                    }),
                    !0
                  )
                );
              a(k, c, d);
            }
          },
          isItem: function() {
            return !0;
          },
          getIdentity: function(a) {
            return this.store.getIdentity(a);
          },
          getLabel: function(a) {
            return a[this.labelAttr];
          },
          newItem: function(a, c, d, f) {
            return this.store.put(a, { parent: c, before: f });
          },
          pasteItem: function(a, c, d, q, k, r) {
            var b = new m();
            if (c === d && !q && !r) return b.resolve(!0), b;
            c && !q
              ? this.getChildren(
                  c,
                  f.hitch(this, function(e) {
                    e = [].concat(e);
                    var g = l.indexOf(e, a);
                    e.splice(g, 1);
                    this.onChildrenChange(c, e);
                    b.resolve(
                      this.store.put(a, {
                        overwrite: !0,
                        parent: d,
                        oldParent: c,
                        before: r,
                        isCopy: !1
                      })
                    );
                  })
                )
              : b.resolve(
                  this.store.put(a, {
                    overwrite: !0,
                    parent: d,
                    oldParent: c,
                    before: r,
                    isCopy: !0
                  })
                );
            return b;
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
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g) {
        var p = l([u._TreeNode, r], {
          templateString: m,
          declaredClass: "jimu._TreeNode",
          isLeaf: !1,
          groupId: "",
          postCreate: function() {
            this.inherited(arguments);
            a.addClass(this.domNode, "jimu-tree-node");
            this.isLeaf = !!this.isLeaf;
            this.groupId
              ? ((this.checkNode = a.toDom('\x3cinput type\x3d"radio" /\x3e')),
                (this.checkNode.name = this.groupId))
              : (this.checkNode = a.toDom(
                  '\x3cinput type\x3d"checkbox" /\x3e'
                ));
            a.addClass(this.checkNode, "jimu-tree-check-node");
            a.place(this.checkNode, this.contentNode, "first");
            this.own(q(this.checkNode, "click", f.hitch(this, this._onClick)));
            this.own(
              q(
                this.rowNode,
                "keydown",
                f.hitch(
                  this,
                  function(a, b) {
                    b.target = a;
                    (b.keyCode !== k.ENTER && b.keyCode !== k.SPACE) ||
                      this._onClick(b);
                  },
                  this.checkNode
                )
              )
            );
            this.isLeaf
              ? this.groupId
                ? a.setStyle(this.checkNode, "display", "none")
                : a.setStyle(this.checkNode, "display", "inline")
              : a.setStyle(this.checkNode, "display", "none");
            this.isLeaf
              ? a.addClass(this.domNode, "jimu-tree-leaf-node")
              : a.addClass(this.domNode, "jimu-tree-not-leaf-node");
          },
          select: function() {
            this.isLeaf &&
              ((this.checkNode.checked = !0),
              a.addClass(this.domNode, "jimu-tree-selected-leaf-node"));
          },
          unselect: function() {
            this.isLeaf &&
              ((this.checkNode.checked = !1),
              a.removeClass(this.domNode, "jimu-tree-selected-leaf-node"));
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
        return l([u, r], {
          declaredClass: "jimu._Tree",
          openOnClick: !0,
          multiple: !0,
          uniqueId: "",
          showRoot: !1,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.uniqueId = "tree_" + g.getRandomString();
          },
          postCreate: function() {
            this.inherited(arguments);
            a.addClass(this.domNode, "jimu-tree");
            this.own(
              d.before(this, "onClick", f.hitch(this, this._jimuBeforeClick))
            );
            this.rootLoadingIndicator &&
              a.setStyle(this.rootLoadingIndicator, "display", "none");
            this.dndController.singular = !0;
            a.setAttr(this.domNode, "tabindex", 0);
          },
          removeItem: function(a) {
            this.model.store.remove(a);
          },
          getAllItems: function() {
            var a = this.getAllTreeNodeWidgets();
            return c.map(
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
              a = c.filter(
                a,
                f.hitch(this, function(a) {
                  return a.checkNode.checked;
                })
              );
            return c.map(
              a,
              f.hitch(this, function(a) {
                return a.item;
              })
            );
          },
          getFilteredItems: function(a) {
            var b = this.getAllTreeNodeWidgets(),
              b = c.map(
                b,
                f.hitch(this, function(a) {
                  var b = a.item;
                  b.selected = a.checkNode.checked;
                  return b;
                })
              );
            return c.filter(
              b,
              f.hitch(this, function(b) {
                return a(b);
              })
            );
          },
          getTreeNodeByItemId: function(a) {
            for (var b = this._getAllTreeNodeDoms(), c = 0; c < b.length; c++) {
              var d = t.byNode(b[c]);
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
            return c.filter(
              a,
              f.hitch(this, function(a) {
                return a.isLeaf;
              })
            );
          },
          getAllTreeNodeWidgets: function() {
            var a = this._getAllTreeNodeDoms();
            return c.map(
              a,
              f.hitch(this, function(a) {
                return t.byNode(a);
              })
            );
          },
          isLeafItem: function(a) {
            return a && a.isLeaf;
          },
          _getAllTreeNodeDoms: function() {
            return e(".dijitTreeNode", this.domNode);
          },
          _createTreeNode: function(a) {
            a.isLeaf = this.isLeafItem(a.item);
            this.multiple || (a.groupId = this.uniqueId);
            return new p(a);
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
          _jimuBeforeClick: function(b, c, d) {
            c.isLeaf &&
              (a.hasClass(d.target || d.srcElement, "jimu-tree-check-node") ||
                (this.multiple ? c.toggleSelect() : this.selectNodeWidget(c)));
            return arguments;
          },
          _onCheckNodeClick: function(a, c, d) {
            !this.multiple && c && this.unselectAllLeafNodeWidgets();
            b.stop(d);
            this.focusNode(a);
            setTimeout(
              f.hitch(this, function() {
                c ? this.selectNodeWidget(a) : a.unselect();
                this.onClick(a.item, a, d);
              }),
              0
            );
          },
          unselectAllLeafNodeWidgets: function() {
            var a = this.getAllLeafTreeNodeWidgets();
            c.forEach(
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
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D,
        y,
        z,
        H,
        J,
        B,
        G,
        N,
        M,
        O,
        Q
      ) {
        function I(a) {
          return g.delegate(a.promise || a, {
            addCallback: function(a) {
              this.then(a);
            },
            addErrback: function(a) {
              this.otherwise(a);
            }
          });
        }
        var P = m("dijit._TreeNode", [D, y, z, H, J], {
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
            r("dojo-bidi") && this.applyTextDir(this.labelNode);
          },
          labelType: "text",
          isExpandable: null,
          isExpanded: !1,
          state: "NotLoaded",
          templateString: G,
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
            d.set(this.domNode, "backgroundPosition", b + " 0px");
            d.set(
              this.rowNode,
              this.isLeftToRight() ? "paddingLeft" : "paddingRight",
              b
            );
            l.forEach(this.getChildren(), function(b) {
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
              c = b.model;
            b._v10Compat && a === c.root && (a = null);
            this._applyClassAndStyle(a, "icon", "Icon");
            this._applyClassAndStyle(a, "label", "Label");
            this._applyClassAndStyle(a, "row", "Row");
            this.tree._startPaint(!0);
          },
          _applyClassAndStyle: function(a, c, g) {
            var e = "_" + c + "Class";
            c += "Node";
            var k = this[e];
            this[e] = this.tree["get" + g + "Class"](a, this.isExpanded);
            b.replace(this[c], this[e] || "", k || "");
            d.set(
              this[c],
              this.tree["get" + g + "Style"](a, this.isExpanded) || {}
            );
          },
          _updateLayout: function() {
            var a = this.getParent(),
              a = !a || !a.rowNode || "none" == a.rowNode.style.display;
            b.toggle(this.domNode, "dijitTreeIsRoot", a);
            b.toggle(
              this.domNode,
              "dijitTreeIsLast",
              !a && !this.getNextSibling()
            );
          },
          _setExpando: function(a) {
            var c = [
              "dijitTreeExpandoLoading",
              "dijitTreeExpandoOpened",
              "dijitTreeExpandoClosed",
              "dijitTreeExpandoLeaf"
            ];
            a = a ? 0 : this.isExpandable ? (this.isExpanded ? 1 : 2) : 3;
            b.replace(this.expandoNode, c[a], c);
            this.expandoNodeText.innerHTML = ["*", "-", "+", "*"][a];
          },
          expand: function() {
            if (this._expandDeferred) return I(this._expandDeferred);
            this._collapseDeferred &&
              (this._collapseDeferred.cancel(), delete this._collapseDeferred);
            this.isExpanded = !0;
            this.labelNode.setAttribute("aria-expanded", "true");
            (this.tree.showRoot || this !== this.tree.rootNode) &&
              this.containerNode.setAttribute("role", "group");
            b.add(this.contentNode, "dijitTreeContentExpanded");
            this._setExpando();
            this._updateItemClasses(this.item);
            this == this.tree.rootNode &&
              this.tree.showRoot &&
              this.tree.domNode.setAttribute("aria-expanded", "true");
            var a = k.wipeIn({
                node: this.containerNode,
                duration: F.defaultDuration
              }),
              c = (this._expandDeferred = new f(function() {
                a.stop();
              }));
            n.after(
              a,
              "onEnd",
              function() {
                c.resolve(!0);
              },
              !0
            );
            a.play();
            return I(c);
          },
          collapse: function() {
            if (this._collapseDeferred) return I(this._collapseDeferred);
            this._expandDeferred &&
              (this._expandDeferred.cancel(), delete this._expandDeferred);
            this.isExpanded = !1;
            this.labelNode.setAttribute("aria-expanded", "false");
            this == this.tree.rootNode &&
              this.tree.showRoot &&
              this.tree.domNode.setAttribute("aria-expanded", "false");
            b.remove(this.contentNode, "dijitTreeContentExpanded");
            this._setExpando();
            this._updateItemClasses(this.item);
            var a = k.wipeOut({
                node: this.containerNode,
                duration: F.defaultDuration
              }),
              c = (this._collapseDeferred = new f(function() {
                a.stop();
              }));
            n.after(
              a,
              "onEnd",
              function() {
                c.resolve(!0);
              },
              !0
            );
            a.play();
            return I(c);
          },
          indent: 0,
          setChildItems: function(b) {
            var d = this.tree,
              g = d.model,
              e = [],
              k = d.focusedChild,
              p = this.getChildren();
            l.forEach(
              p,
              function(a) {
                z.prototype.removeChild.call(this, a);
              },
              this
            );
            this.defer(function() {
              l.forEach(p, function(a) {
                if (!a._destroyed && !a.getParent()) {
                  var b = function(a) {
                    var c = g.getIdentity(a.item),
                      e = d._itemNodesMap[c];
                    1 == e.length
                      ? delete d._itemNodesMap[c]
                      : ((c = l.indexOf(e, a)), -1 != c && e.splice(c, 1));
                    l.forEach(a.getChildren(), b);
                  };
                  d.dndController.removeTreeNode(a);
                  b(a);
                  if (d.persist) {
                    var e = l
                        .map(a.getTreePath(), function(a) {
                          return d.model.getIdentity(a);
                        })
                        .join("/"),
                      p;
                    for (p in d._openedNodes)
                      p.substr(0, e.length) == e && delete d._openedNodes[p];
                    d._saveExpandedNodes();
                  }
                  d.lastFocusedChild &&
                    !c.isDescendant(d.lastFocusedChild.domNode, d.domNode) &&
                    delete d.lastFocusedChild;
                  k && !c.isDescendant(k.domNode, d.domNode) && d.focus();
                  a.destroyRecursive();
                }
              });
            });
            this.state = "Loaded";
            b && 0 < b.length
              ? ((this.isExpandable = !0),
                l.forEach(
                  b,
                  function(a) {
                    var b = g.getIdentity(a),
                      c = d._itemNodesMap[b],
                      k;
                    if (c)
                      for (var p = 0; p < c.length; p++)
                        if (c[p] && !c[p].getParent()) {
                          k = c[p];
                          k.set("indent", this.indent + 1);
                          break;
                        }
                    k ||
                      ((k = this.tree._createTreeNode({
                        item: a,
                        tree: d,
                        isExpandable: g.mayHaveChildren(a),
                        label: d.getLabel(a),
                        labelType: (d.model && d.model.labelType) || "text",
                        tooltip: d.getTooltip(a),
                        ownerDocument: d.ownerDocument,
                        dir: d.dir,
                        lang: d.lang,
                        textDir: d.textDir,
                        indent: this.indent + 1
                      })),
                      c ? c.push(k) : (d._itemNodesMap[b] = [k]));
                    this.addChild(k);
                    (this.tree.autoExpand || this.tree._state(k)) &&
                      e.push(d._expandNode(k));
                  },
                  this
                ),
                l.forEach(this.getChildren(), function(a) {
                  a._updateLayout();
                }))
              : (this.isExpandable = !1);
            this._setExpando && this._setExpando(!1);
            this._updateItemClasses(this.item);
            b = a(e);
            this.tree._startPaint(b);
            return I(b);
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
            l.forEach(b, function(a) {
              a._updateLayout();
            });
          },
          makeExpandable: function() {
            this.isExpandable = !0;
            this._setExpando(!1);
          },
          setSelected: function(a) {
            this.labelNode.setAttribute("aria-selected", a ? "true" : "false");
            b.toggle(this.rowNode, "dijitTreeRowSelected", a);
          },
          focus: function() {
            E.focus(this.focusNode);
          }
        });
        r("dojo-bidi") &&
          P.extend({
            _setTextDirAttr: function(a) {
              !a ||
                (this.textDir == a && this._created) ||
                (this._set("textDir", a),
                this.applyTextDir(this.labelNode),
                l.forEach(
                  this.getChildren(),
                  function(b) {
                    b.set("textDir", a);
                  },
                  this
                ));
            }
          });
        var K = m("dijit.Tree", [D, B, y, J], {
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
          templateString: N,
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
          _publish: function(a, b) {
            x.publish(this.id, g.mixin({ tree: this, event: a }, b || {}));
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
              p(
                this.containerNode,
                p.selector(".dijitTreeNode", w.enter),
                function(b) {
                  a._onNodeMouseEnter(C.byNode(this), b);
                }
              ),
              p(
                this.containerNode,
                p.selector(".dijitTreeNode", w.leave),
                function(b) {
                  a._onNodeMouseLeave(C.byNode(this), b);
                }
              ),
              p(
                this.containerNode,
                p.selector(".dijitTreeRow", A.press),
                function(b) {
                  a._onNodePress(C.getEnclosingWidget(this), b);
                }
              ),
              p(this.containerNode, p.selector(".dijitTreeRow", A), function(
                b
              ) {
                a._onClick(C.getEnclosingWidget(this), b);
              }),
              p(
                this.containerNode,
                p.selector(".dijitTreeRow", "dblclick"),
                function(b) {
                  a._onDblClick(C.getEnclosingWidget(this), b);
                }
              )
            );
            this.model || this._store2model();
            this.own(
              n.after(
                this.model,
                "onChange",
                g.hitch(this, "_onItemChange"),
                !0
              ),
              n.after(
                this.model,
                "onChildrenChange",
                g.hitch(this, "_onItemChildrenChange"),
                !0
              ),
              n.after(
                this.model,
                "onDelete",
                g.hitch(this, "_onItemDelete"),
                !0
              )
            );
            this.inherited(arguments);
            if (this.dndController) {
              g.isString(this.dndController) &&
                (this.dndController = g.getObject(this.dndController));
              for (var b = {}, c = 0; c < this.dndParams.length; c++)
                this[this.dndParams[c]] &&
                  (b[this.dndParams[c]] = this[this.dndParams[c]]);
              this.dndController = new this.dndController(this, b);
            }
            this._load();
            this.onLoadDeferred = I(this.pendingCommandsPromise);
            this.onLoadDeferred.then(g.hitch(this, "onLoad"));
          },
          _store2model: function() {
            this._v10Compat = !0;
            t.deprecated(
              "Tree: from version 2.0, should specify a model object rather than a store/query"
            );
            var a = {
              id: this.id + "_ForestStoreModel",
              store: this.store,
              query: this.query,
              childrenAttrs: this.childrenAttr
            };
            this.params.mayHaveChildren &&
              (a.mayHaveChildren = g.hitch(this, "mayHaveChildren"));
            this.params.getItemChildren &&
              (a.getChildren = g.hitch(this, function(a, b, c) {
                this.getItemChildren(
                  this._v10Compat && a === this.model.root ? null : a,
                  b,
                  c
                );
              }));
            this.model = new O(a);
            this.showRoot = !!this.label;
          },
          onLoad: function() {},
          _load: function() {
            this.model.getRoot(
              g.hitch(this, function(a) {
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
                  g.hitch(this, function() {
                    this._destroyed ||
                      ((this.rootLoadingIndicator.style.display = "none"),
                      this.expandChildrenDeferred.resolve(!0));
                  })
                );
              }),
              g.hitch(this, function(a) {
                console.error(this, ": error loading root: ", a);
              })
            );
          },
          getNodesByItem: function(a) {
            if (!a) return [];
            a = g.isString(a) ? a : this.model.getIdentity(a);
            return [].concat(this._itemNodesMap[a]);
          },
          _setSelectedItemAttr: function(a) {
            this.set("selectedItems", [a]);
          },
          _setSelectedItemsAttr: function(a) {
            var b = this;
            return (this.pendingCommandsPromise = this.pendingCommandsPromise.always(
              g.hitch(this, function() {
                var c = l.map(a, function(a) {
                    return !a || g.isString(a) ? a : b.model.getIdentity(a);
                  }),
                  d = [];
                l.forEach(c, function(a) {
                  d = d.concat(b._itemNodesMap[a] || []);
                });
                this.set("selectedNodes", d);
              })
            ));
          },
          _setPathAttr: function(a) {
            return a.length
              ? I(
                  this.set("paths", [a]).then(function(a) {
                    return a[0];
                  })
                )
              : I(
                  this.set("paths", []).then(function(a) {
                    return a[0];
                  })
                );
          },
          _setPathsAttr: function(b) {
            function c(a, b) {
              var g = a.shift(),
                e = l.filter(b, function(a) {
                  return a.getIdentity() == g;
                })[0];
              if (e)
                return a.length
                  ? d._expandNode(e).then(function() {
                      return c(a, e.getChildren());
                    })
                  : e;
              throw new K.PathError("Could not expand path at " + g);
            }
            var d = this;
            return I(
              (this.pendingCommandsPromise = this.pendingCommandsPromise
                .always(function() {
                  return a(
                    l.map(b, function(a) {
                      a = l.map(a, function(a) {
                        return a && g.isObject(a) ? d.model.getIdentity(a) : a;
                      });
                      if (a.length) return c(a, [d.rootNode]);
                      throw new K.PathError("Empty path");
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
            function b(d) {
              return c._expandNode(d).then(function() {
                var c = l.filter(d.getChildren() || [], function(a) {
                  return a.isExpandable;
                });
                return a(l.map(c, b));
              });
            }
            var c = this;
            return I(b(this.rootNode));
          },
          collapseAll: function() {
            function b(d) {
              var g = l.filter(d.getChildren() || [], function(a) {
                  return a.isExpandable;
                }),
                g = a(l.map(g, b));
              return !d.isExpanded || (d == c.rootNode && !c.showRoot)
                ? g
                : g.then(function() {
                    return c._collapseNode(d);
                  });
            }
            var c = this;
            return I(b(this.rootNode));
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
              c.isDescendant(a, b.expandoNode) ||
              c.isDescendant(a, b.expandoNodeText)
            );
          },
          _onNodePress: function(a, b) {
            this.focusNode(a);
          },
          __click: function(a, b, c, d) {
            var g = this.isExpandoNode(b.target, a);
            a.isExpandable && (c || g)
              ? this._onExpandoClick({ node: a })
              : (this._publish("execute", { item: a.item, node: a, evt: b }),
                this[d](a.item, a, b),
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
            t.deprecated(
              this.declaredClass +
                "::_getNextNode(node) is deprecated. Use _getNext(node) instead.",
              "",
              "2.0"
            );
            return this._getNext(a);
          },
          _getRootOrFirstNode: function() {
            t.deprecated(
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
              c = a.item,
              d = this;
            a._loadDeferred ||
              (a.markProcessing(),
              (a._loadDeferred = new f()),
              b.getChildren(
                c,
                function(b) {
                  a.unmarkProcessing();
                  a.setChildItems(b).then(function() {
                    a._loadDeferred.resolve(b);
                  });
                },
                function(b) {
                  console.error(
                    d,
                    ": error loading " + a.label + " children: ",
                    b
                  );
                  a._loadDeferred.reject(b);
                }
              ));
            b = a._loadDeferred.then(
              g.hitch(this, function() {
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
              var b = [], c = this.domNode;
              c && c.tagName && "IFRAME" !== c.tagName.toUpperCase();
              c = c.parentNode
            )
              b.push({
                domNode: c.contentWindow || c,
                scrollLeft: c.scrollLeft || 0,
                scrollTop: c.scrollTop || 0
              });
            this.focusChild(a);
            this.defer(function() {
              for (var a = 0, c = b.length; a < c; a++)
                (b[a].domNode.scrollLeft = b[a].scrollLeft),
                  (b[a].domNode.scrollTop = b[a].scrollTop);
            }, 0);
          },
          _onNodeMouseEnter: function() {},
          _onNodeMouseLeave: function() {},
          _onItemChange: function(a) {
            var b = this.model.getIdentity(a);
            if ((b = this._itemNodesMap[b])) {
              var c = this.getLabel(a),
                d = this.getTooltip(a);
              l.forEach(b, function(b) {
                b.set({ item: a, label: c, tooltip: d });
                b._updateItemClasses(a);
              });
            }
          },
          _onItemChildrenChange: function(a, b) {
            a = this.model.getIdentity(a);
            (a = this._itemNodesMap[a]) &&
              l.forEach(a, function(a) {
                a.setChildItems(b);
              });
          },
          _onItemDelete: function(a) {
            a = this.model.getIdentity(a);
            var b = this._itemNodesMap[a];
            b &&
              (l.forEach(
                b,
                function(a) {
                  this.dndController.removeTreeNode(a);
                  var b = a.getParent();
                  b && b.removeChild(a);
                  this.lastFocusedChild &&
                    !c.isDescendant(
                      this.lastFocusedChild.domNode,
                      this.domNode
                    ) &&
                    delete this.lastFocusedChild;
                  this.focusedChild &&
                    !c.isDescendant(this.focusedChild.domNode, this.domNode) &&
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
              var a = h(this.cookieName);
              a &&
                l.forEach(
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
            var c = l
              .map(
                a.getTreePath(),
                function(a) {
                  return this.model.getIdentity(a);
                },
                this
              )
              .join("/");
            if (1 === arguments.length) return this._openedNodes[c];
            b ? (this._openedNodes[c] = !0) : delete this._openedNodes[c];
            this._saveExpandedNodes();
          },
          _saveExpandedNodes: function() {
            if (this.persist && this.cookieName) {
              var a = [],
                b;
              for (b in this._openedNodes) a.push(b);
              h(this.cookieName, a.join(","), { expires: 365 });
            }
          },
          destroy: function() {
            this._curSearch &&
              (this._curSearch.timer.remove(), delete this._curSearch);
            this.rootNode && this.rootNode.destroyRecursive();
            this.dndController &&
              !g.isString(this.dndController) &&
              this.dndController.destroy();
            this.rootNode = null;
            this.inherited(arguments);
          },
          destroyRecursive: function() {
            this.destroy();
          },
          resize: function(a) {
            a && e.setMarginBox(this.domNode, a);
            this._nodePixelIndent =
              e.position(this.tree.indentDetector).w || this._nodePixelIndent;
            this.expandChildrenDeferred.then(
              g.hitch(this, function() {
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
            var b = g.hitch(this, function() {
              this._outstandingPaintOperations--;
              0 >= this._outstandingPaintOperations &&
                !this._adjustWidthsTimer &&
                this._started &&
                (this._adjustWidthsTimer = this.defer("_adjustWidths"));
            });
            v(a, b, b);
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
            return new P(a);
          },
          focus: function() {
            this.lastFocusedChild
              ? this.focusNode(this.lastFocusedChild)
              : this.focusFirstChild();
          }
        });
        r("dojo-bidi") &&
          K.extend({
            _setTextDirAttr: function(a) {
              a &&
                this.textDir != a &&
                (this._set("textDir", a), this.rootNode.set("textDir", a));
            }
          });
        K.PathError = q("TreePathError");
        K._TreeNode = P;
        return K;
      });
    },
    "dijit/tree/TreeStoreModel": function() {
      define([
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/_base/declare",
        "dojo/_base/lang"
      ], function(l, n, h, m) {
        return h("dijit.tree.TreeStoreModel", null, {
          store: null,
          childrenAttrs: ["children"],
          newItemIdAttr: "id",
          labelAttr: "",
          root: null,
          query: null,
          deferItemLoadingUntilExpand: !1,
          constructor: function(f) {
            m.mixin(this, f);
            this.connects = [];
            f = this.store;
            if (!f.getFeatures()["dojo.data.api.Identity"])
              throw Error(
                "dijit.tree.TreeStoreModel: store must support dojo.data.Identity"
              );
            f.getFeatures()["dojo.data.api.Notification"] &&
              (this.connects = this.connects.concat([
                n.after(f, "onNew", m.hitch(this, "onNewItem"), !0),
                n.after(f, "onDelete", m.hitch(this, "onDeleteItem"), !0),
                n.after(f, "onSet", m.hitch(this, "onSetItem"), !0)
              ]));
          },
          destroy: function() {
            for (var f; (f = this.connects.pop()); ) f.remove();
          },
          getRoot: function(f, a) {
            this.root
              ? f(this.root)
              : this.store.fetch({
                  query: this.query,
                  onComplete: m.hitch(this, function(a) {
                    if (1 != a.length)
                      throw Error(
                        "dijit.tree.TreeStoreModel: root query returned " +
                          a.length +
                          " items, but must return exactly one"
                      );
                    this.root = a[0];
                    f(this.root);
                  }),
                  onError: a
                });
          },
          mayHaveChildren: function(f) {
            return l.some(
              this.childrenAttrs,
              function(a) {
                return this.store.hasAttribute(f, a);
              },
              this
            );
          },
          getChildren: function(f, a, c) {
            var b = this.store;
            if (b.isItemLoaded(f)) {
              for (var e = [], d = 0; d < this.childrenAttrs.length; d++)
                var q = b.getValues(f, this.childrenAttrs[d]), e = e.concat(q);
              var k = 0;
              this.deferItemLoadingUntilExpand ||
                l.forEach(e, function(a) {
                  b.isItemLoaded(a) || k++;
                });
              0 == k
                ? a(e)
                : l.forEach(e, function(d, f) {
                    b.isItemLoaded(d) ||
                      b.loadItem({
                        item: d,
                        onItem: function(b) {
                          e[f] = b;
                          0 == --k && a(e);
                        },
                        onError: c
                      });
                  });
            } else {
              var r = m.hitch(this, arguments.callee);
              b.loadItem({
                item: f,
                onItem: function(b) {
                  r(b, a, c);
                },
                onError: c
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
          newItem: function(f, a, c) {
            var b = { parent: a, attribute: this.childrenAttrs[0] },
              e;
            this.newItemIdAttr && f[this.newItemIdAttr]
              ? this.fetchItemByIdentity({
                  identity: f[this.newItemIdAttr],
                  scope: this,
                  onItem: function(d) {
                    d
                      ? this.pasteItem(d, null, a, !0, c)
                      : (e = this.store.newItem(f, b)) &&
                        void 0 != c &&
                        this.pasteItem(e, a, a, !1, c);
                  }
                })
              : (e = this.store.newItem(f, b)) &&
                void 0 != c &&
                this.pasteItem(e, a, a, !1, c);
          },
          pasteItem: function(f, a, c, b, e) {
            var d = this.store,
              q = this.childrenAttrs[0];
            a &&
              l.forEach(this.childrenAttrs, function(c) {
                if (d.containsValue(a, c, f)) {
                  if (!b) {
                    var e = l.filter(d.getValues(a, c), function(a) {
                      return a != f;
                    });
                    d.setValues(a, c, e);
                  }
                  q = c;
                }
              });
            if (c)
              if ("number" == typeof e) {
                var k = d.getValues(c, q).slice();
                k.splice(e, 0, f);
                d.setValues(c, q, k);
              } else d.setValues(c, q, d.getValues(c, q).concat(f));
          },
          onChange: function() {},
          onChildrenChange: function() {},
          onDelete: function() {},
          onNewItem: function(f, a) {
            a &&
              this.getChildren(
                a.item,
                m.hitch(this, function(c) {
                  this.onChildrenChange(a.item, c);
                })
              );
          },
          onDeleteItem: function(f) {
            this.onDelete(f);
          },
          onSetItem: function(f, a) {
            if (-1 != l.indexOf(this.childrenAttrs, a))
              this.getChildren(
                f,
                m.hitch(this, function(a) {
                  this.onChildrenChange(f, a);
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
      ], function(l, n, h, m, f) {
        return n("dijit.tree.ForestStoreModel", f, {
          rootId: "$root$",
          rootLabel: "ROOT",
          query: null,
          constructor: function(a) {
            this.root = {
              store: this,
              root: !0,
              id: a.rootId,
              label: a.rootLabel,
              children: a.rootChildren
            };
          },
          mayHaveChildren: function(a) {
            return a === this.root || this.inherited(arguments);
          },
          getChildren: function(a, c, b) {
            a === this.root
              ? this.root.children
                ? c(this.root.children)
                : this.store.fetch({
                    query: this.query,
                    onComplete: m.hitch(this, function(a) {
                      this.root.children = a;
                      c(a);
                    }),
                    onError: b
                  })
              : this.inherited(arguments);
          },
          isItem: function(a) {
            return a === this.root ? !0 : this.inherited(arguments);
          },
          fetchItemByIdentity: function(a) {
            if (a.identity == this.root.id) {
              var c = a.scope || h.global;
              a.onItem && a.onItem.call(c, this.root);
            } else this.inherited(arguments);
          },
          getIdentity: function(a) {
            return a === this.root ? this.root.id : this.inherited(arguments);
          },
          getLabel: function(a) {
            return a === this.root
              ? this.root.label
              : this.inherited(arguments);
          },
          newItem: function(a, c, b) {
            return c === this.root
              ? (this.onNewRootItem(a), this.store.newItem(a))
              : this.inherited(arguments);
          },
          onNewRootItem: function() {},
          pasteItem: function(a, c, b, e, d) {
            if (c === this.root && !e) this.onLeaveRoot(a);
            this.inherited(arguments, [
              a,
              c === this.root ? null : c,
              b === this.root ? null : b,
              e,
              d
            ]);
            if (b === this.root) this.onAddToRoot(a);
          },
          onAddToRoot: function(a) {
            console.log(this, ": item ", a, " added to root");
          },
          onLeaveRoot: function(a) {
            console.log(this, ": item ", a, " removed from root");
          },
          _requeryTop: function() {
            var a = this.root.children || [];
            this.store.fetch({
              query: this.query,
              onComplete: m.hitch(this, function(c) {
                this.root.children = c;
                if (
                  a.length != c.length ||
                  l.some(a, function(a, e) {
                    return c[e] != a;
                  })
                )
                  this.onChildrenChange(this.root, c);
              })
            });
          },
          onNewItem: function(a, c) {
            this._requeryTop();
            this.inherited(arguments);
          },
          onDeleteItem: function(a) {
            -1 != l.indexOf(this.root.children, a) && this._requeryTop();
            this.inherited(arguments);
          },
          onSetItem: function(a, c, b, e) {
            this._requeryTop();
            this.inherited(arguments);
          }
        });
      });
    },
    "dijit/tree/_dndSelector": function() {
      define("dojo/_base/array dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/dnd/common dojo/dom dojo/mouse dojo/on dojo/touch ../a11yclick ./_dndContainer".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q) {
        return n("dijit.tree._dndSelector", q, {
          constructor: function() {
            this.selection = {};
            this.anchor = null;
            this.events.push(
              b(this.tree.domNode, e.press, m.hitch(this, "onMouseDown")),
              b(this.tree.domNode, e.release, m.hitch(this, "onMouseUp")),
              b(this.tree.domNode, e.move, m.hitch(this, "onMouseMove")),
              b(this.tree.domNode, d.press, m.hitch(this, "onClickPress")),
              b(this.tree.domNode, d.release, m.hitch(this, "onClickRelease"))
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
          removeTreeNode: function(b) {
            var c = l.filter(this.getSelectedTreeNodes(), function(c) {
              return !a.isDescendant(c.domNode, b.domNode);
            });
            this.setSelection(c);
            return b;
          },
          isTreeNodeSelected: function(a) {
            return a.id && !!this.selection[a.id];
          },
          setSelection: function(a) {
            var b = this.getSelectedTreeNodes();
            l.forEach(
              this._setDifference(b, a),
              m.hitch(this, function(a) {
                a.setSelected(!1);
                this.anchor == a && delete this.anchor;
                delete this.selection[a.id];
              })
            );
            l.forEach(
              this._setDifference(a, b),
              m.hitch(this, function(a) {
                a.setSelected(!0);
                this.selection[a.id] = a;
              })
            );
            this._updateSelectionProperties();
          },
          _setDifference: function(a, b) {
            l.forEach(b, function(a) {
              a.__exclude__ = !0;
            });
            a = l.filter(a, function(a) {
              return !a.__exclude__;
            });
            l.forEach(b, function(a) {
              delete a.__exclude__;
            });
            return a;
          },
          _updateSelectionProperties: function() {
            var a = this.getSelectedTreeNodes(),
              b = [],
              c = [];
            l.forEach(
              a,
              function(a) {
                var d = a.getTreePath();
                c.push(a);
                b.push(d);
              },
              this
            );
            a = l.map(c, function(a) {
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
              "mousedown" == a.type && c.isLeft(a) && a.preventDefault();
              var b =
                "keydown" == a.type ? this.tree.focusedChild : this.current;
              if (b) {
                var d = f.getCopyKeyState(a),
                  e = b.id;
                this.singular || a.shiftKey || !this.selection[e]
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
              var c = doc.createRange();
              c.setStartBefore(a);
              a = doc.createRange();
              a.setStartBefore(b);
              return c.compareBoundaryPoints(c.END_TO_END, a);
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
            b = b || h.global;
            for (var c in this.selection) a.call(b, this.getItem(c), c, this);
          }
        });
      });
    },
    "dijit/tree/_dndContainer": function() {
      define("dojo/aspect dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/on dojo/touch".split(
        " "
      ), function(l, n, h, m, f, a) {
        return n("dijit.tree._dndContainer", null, {
          constructor: function(c, b) {
            this.tree = c;
            this.node = c.domNode;
            m.mixin(this, b);
            this.containerState = "";
            h.add(this.node, "dojoDndContainer");
            this.events = [
              f(this.node, a.enter, m.hitch(this, "onOverEvent")),
              f(this.node, a.leave, m.hitch(this, "onOutEvent")),
              l.after(
                this.tree,
                "_onNodeMouseEnter",
                m.hitch(this, "onMouseOver"),
                !0
              ),
              l.after(
                this.tree,
                "_onNodeMouseLeave",
                m.hitch(this, "onMouseOut"),
                !0
              ),
              f(this.node, "dragstart, selectstart", function(a) {
                a.preventDefault();
              })
            ];
          },
          destroy: function() {
            for (var a; (a = this.events.pop()); ) a.remove();
            this.node = this.parent = null;
          },
          onMouseOver: function(a) {
            this.current = a;
          },
          onMouseOut: function() {
            this.current = null;
          },
          _changeState: function(a, b) {
            var c = "dojoDnd" + a;
            a = a.toLowerCase() + "State";
            h.replace(this.node, c + b, c + this[a]);
            this[a] = b;
          },
          _addItemClass: function(a, b) {
            h.add(a, "dojoDndItem" + b);
          },
          _removeItemClass: function(a, b) {
            h.remove(a, "dojoDndItem" + b);
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
      ), function(l, n, h, m, f, a, c, b, e, d, q, k) {
        return l([e, d, a], {
          templateString: q,
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
            this.layerInfosObj = k.getInstanceSync();
            this.layerChooser.domNode.style.zIndex = 1;
            this.layerChooser.tree.domNode.style.borderTop = "0";
            this.layerChooser.tree.domNode.style.maxHeight = "290px";
            this.own(
              m(
                this.layerChooser,
                "tree-click",
                n.hitch(this, this._onTreeClick)
              )
            );
            this.own(
              m(
                this.layerChooser,
                "update",
                n.hitch(this, this._onLayerChooserUpdate)
              )
            );
            this.own(
              m(document.body, "click", n.hitch(this, this._onBodyClicked))
            );
            this.own(
              m(
                document.body,
                "keydown",
                n.hitch(this, function(a) {
                  a.keyCode === f.ENTER && this._onBodyClicked(a);
                })
              )
            );
            this.own(
              m(
                this.layerChooser.domNode,
                "keydown",
                n.hitch(this, function(a) {
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
            var b = new c();
            if (a) {
              var d = this.layerInfosObj.getLayerInfoById(a.id);
              d
                ? this.layerChooser.filter(d).then(
                    n.hitch(this, function(c) {
                      c
                        ? (this._onSelectNewItem({
                            layerInfo: d,
                            name: d.title,
                            url: a.url
                          }),
                          b.resolve(!0))
                        : b.resolve(!1);
                    }),
                    n.hitch(this, function() {
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
              h.isDescendant(a, this.domNode) ||
              a === this.layerChooser.domNode ||
              h.isDescendant(a, this.layerChooser.domNode) ||
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
            b.open({
              parent: this,
              popup: this.layerChooser,
              around: this.domNode
            });
            var a = this.layerChooser.domNode.parentNode;
            a &&
              (h.addClass(a, "jimu-layer-chooser-from-map-withdropbox-popup"),
              this.customClass && h.addClass(a, this.customClass),
              this.layerChooser.tree.domNode.focus());
            this._isLayerChooserShow = !0;
          },
          hideLayerChooser: function() {
            b.close(this.layerChooser);
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
            var b = n.getObject("layerInfo.id", !1, this._selectedItem) || -1,
              c = n.getObject("layerInfo.id", !1, a) || -1,
              b = b !== c;
            this._selectedItem = a;
            this.hideLayerChooser();
            a = n.getObject("layerInfo.title", !1, this._selectedItem) || "";
            this.layerNameNode.innerHTML = a;
            h.setAttr(this.layerNameNode, "title", a);
            a = n.getObject("layerInfo.layerObject", !1, this._selectedItem);
            b && this.emit("selection-change", [a]);
          },
          _onTreeClick: function() {
            var a = this._getSelectedItems();
            this._onSelectNewItem(0 < a.length ? a[0] : null);
          }
        });
      });
    },
    "widgets/SmartEditor/setting/layersAndFieldsApplyOn": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/on jimu/BaseWidgetSetting dijit/_TemplatedMixin jimu/dijit/CheckBox jimu/utils dojo/dom-attr dojo/dom-class dojo/query dojo/string dojo/dom-style dijit/form/ValidationTextBox dojo/text!./layerAndFieldsApplyOn.html dijit/form/CheckBox".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g, p, x) {
        return l([c, n, b], {
          baseClass: "jimu-widget-smartEditor-setting-layersAndFieldsApplyOn",
          templateString: p,
          checkBoxNodes: null,
          layerCheckBoxNodes: null,
          showDomainFieldIndicator: !1,
          defalutFieldInfos: [
            { actionName: "Intersection", enabled: !1, fields: [] },
            { actionName: "Address", enabled: !1 },
            {
              actionName: "Coordinates",
              enabled: !1,
              coordinatesSystem: "MapSpatialReference",
              field: "x"
            },
            { actionName: "Preset", enabled: !1 }
          ],
          nlsActionName: {
            Intersection: "Intersection1",
            Address: "Address1",
            Coordinates: "Coordinates1",
            Preset: "Preset1"
          },
          postCreate: function() {
            this.inherited(arguments);
            this.nlsActionName = {
              Intersection: this.nls.actionPage.copyAction.intersection,
              Address: this.nls.actionPage.copyAction.address,
              Coordinates: this.nls.actionPage.copyAction.coordinates,
              Preset: this.nls.actionPage.copyAction.preset
            };
            this.layerCheckBoxNodes = {};
            this.checkBoxNodes = {};
            this._prevAppliedOnLayers = [];
            this.appliedOn &&
              (this._prevAppliedOnLayers = h.clone(
                Object.keys(this.appliedOn)
              ));
            this._addSearchControl();
            this._addLayerAndFields(!0);
          },
          _addSearchControl: function() {
            var b = new g(
              {
                trim: !0,
                placeHolder: this.nls.actionPage.searchPlaceHolder,
                intermediateChanges: !0
              },
              f.create("div", {}, this.searchNode)
            );
            u.set(b.domNode, "width", "350px");
            this.own(a(b, "change", h.hitch(this, this._searchTextUpdated)));
            b = f.create(
              "div",
              { class: "esriCTExpandAllNode" },
              this.searchNode
            );
            this._expandAllCheckBox = new x(
              { class: "switch-toggle", checked: !1 },
              f.create("div", {}, b)
            );
            f.create(
              "label",
              { innerHTML: this.nls.actionPage.expandAllLabel },
              b
            );
            this.own(
              a(
                this._expandAllCheckBox,
                "change",
                h.hitch(this, function(a) {
                  a
                    ? (a = r(
                        ".esriCTToggleLayerIcon.esriCTToggleLayerCollapsed.esriCTToggleLayerExpanded",
                        this.layerAndFieldsMainDiv
                      )) &&
                      0 < a.length &&
                      m.forEach(a, function(a) {
                        a.click();
                      })
                    : (a = r(
                        ".esriCTToggleLayerIcon.esriCTToggleLayerCollapsed",
                        this.layerAndFieldsMainDiv
                      )) &&
                      0 < a.length &&
                      m.forEach(a, function(a) {
                        k.contains(a, "esriCTToggleLayerExpanded") || a.click();
                      });
                })
              )
            );
          },
          _searchTextUpdated: function(a) {
            var b;
            b = a.toLowerCase();
            if ("" !== b) {
              a = r("[searchstring]", this.layerAndFieldsMainDiv);
              b = r(
                "div[searchstring^\x3d'" + b + "']",
                this.layerAndFieldsMainDiv
              );
              a.style("display", "none");
              a.removeClass("esriCTNotFilteredBySearch");
              a.addClass("esriCTFilteredBySearch");
              b.style("display", "");
              b.replaceClass(
                "esriCTNotFilteredBySearch",
                "esriCTFilteredBySearch"
              );
              a = this.layerDetails;
              for (var c in a) {
                var d, g, e;
                if (0 < Object.keys(a[c]).length) {
                  b = r(
                    "[layermaindivid \x3d '" + c + "']",
                    this.layerAndFieldsMainDiv
                  );
                  d = r("[layerid\x3d'" + c + "']", this.layerAndFieldsMainDiv);
                  g = !0;
                  for (e = 0; e < d.length; e++)
                    if (k.contains(d[e], "esriCTNotFilteredBySearch")) {
                      g = !1;
                      break;
                    }
                  g ? b.style("display", "none") : b.style("display", "");
                }
              }
            } else
              r("[layermaindivid]", this.layerAndFieldsMainDiv).style(
                "display",
                ""
              ),
                r("[searchstring]", this.layerAndFieldsMainDiv).style(
                  "display",
                  ""
                ),
                r("[searchstring]", this.layerAndFieldsMainDiv).removeClass(
                  "esriCTFilteredBySearch"
                ),
                r("[searchstring]", this.layerAndFieldsMainDiv).addClass(
                  "esriCTNotFilteredBySearch"
                );
          },
          _addLayerAndFields: function() {
            var a,
              b = [],
              c;
            a = this.layerDetails;
            for (var d in a)
              if (0 < Object.keys(a[d]).length) {
                c = f.create(
                  "div",
                  { class: "esriCTLayerMainDiv" },
                  this.layerAndFieldsMainDiv
                );
                q.set(c, "layermaindivid", d);
                this._createLayerName(c, d);
                c = this._getLayersFieldValues(d);
                this.appliedOn &&
                  this.appliedOn.hasOwnProperty(d) &&
                  0 < this.appliedOn[d].length &&
                  b.push(d);
                for (var g in a[d])
                  if (a[d][g].editable) {
                    var e = !1,
                      p = f.create(
                        "div",
                        { class: "esriCTFieldsDiv  esriCTHidden" },
                        this.layerAndFieldsMainDiv
                      );
                    q.set(p, "layerid", d);
                    if (c && c.hasOwnProperty(g)) {
                      var u;
                      m.some(
                        c[g],
                        function(a) {
                          if (
                            a.actionName === this.actionName &&
                            a.enabled &&
                            (!a.hasOwnProperty("attributeActionGroupName") ||
                              (a.hasOwnProperty("attributeActionGroupName") &&
                                a.attributeActionGroupName !== this.prevName))
                          )
                            return (u = a), (e = !0);
                        },
                        this
                      );
                      "Preset" !== this.actionName ||
                        !e ||
                        !u ||
                        (u.hasOwnProperty("attributeActionGroupName") &&
                          "" !== u.attributeActionGroupName) ||
                        (e = !1);
                    }
                    this._createFieldName(a[d][g], d, p, e);
                  }
              }
            0 < b.length &&
              setTimeout(
                h.hitch(this, function() {
                  this._applyPrevSettings();
                  m.forEach(
                    b,
                    h.hitch(this, function(a) {
                      var b = r('[rootnodelayerid\x3d"' + a + '"]');
                      b &&
                        0 < b.length &&
                        k.contains(b[0], "esriCTToggleLayerExpanded") &&
                        (r('[rootnodelayerid\x3d"' + a + '"]').toggleClass(
                          "esriCTToggleLayerExpanded"
                        ),
                        r('[layerid\x3d"' + a + '"]').toggleClass(
                          "esriCTHidden"
                        ));
                    })
                  );
                  this.emit("layerFieldsUpdated", !0);
                }),
                100
              );
          },
          _createLayerName: function(b, c) {
            var d, g, p;
            this.layerCheckBoxNodes[c] = [];
            this.checkBoxNodes[c] = [];
            this.layerInfos.getLayerOrTableInfoById(c) &&
              ((d = this.layerInfos.getLayerOrTableInfoById(c).layerObject
                .name),
              (g = f.create(
                "div",
                {
                  class:
                    "esriCTToggleLayerIcon esriCTToggleLayerCollapsed esriCTToggleLayerExpanded"
                },
                b
              )),
              q.set(g, "rootnodelayerid", c),
              this.own(
                a(
                  g,
                  "click",
                  h.hitch(this, function(a) {
                    k.toggle(a.currentTarget, "esriCTToggleLayerExpanded");
                    k.contains(a.currentTarget, "esriCTToggleLayerExpanded") &&
                      this._expandAllCheckBox.set("checked", !1, !1);
                    p = q.get(a.currentTarget, "rootnodelayerid");
                    r('[layerid\x3d"' + p + '"]').toggleClass("esriCTHidden");
                  })
                )
              ),
              (b = f.create("div", { class: "esriCTLayercheckBox" }, b)),
              f.create("div", { innerHTML: d }, b),
              (d = new e({ label: d, checked: !1 })),
              this.layerCheckBoxNodes[c].push(d),
              q.set(d.domNode, "LayerCheckBoxId", c),
              a(
                d.domNode,
                "click",
                h.hitch(this, this._parentNodeStateChanged)
              ));
          },
          _getLayersFieldValues: function(a) {
            var b;
            m.some(
              this._configInfos,
              function(c) {
                if (c.featureLayer && c.featureLayer.id === a)
                  return (
                    c.fieldValues ? (b = c.fieldValues) : (c.fieldValues = {}),
                    !0
                  );
              },
              this
            );
            return b;
          },
          _getAllLayersFieldValues: function(a, b, c) {
            m.forEach(
              b,
              function(b) {
                b.featureLayer &&
                  b.featureLayer.id === c &&
                  (b.fieldValues ? a || (a = []) : (b.fieldValues = {}),
                  a.push(b.fieldValues));
                b.relationshipInfos &&
                  (a = this._getAllLayersFieldValues(
                    a,
                    b.relationshipInfos,
                    c
                  ));
              },
              this
            );
            return a;
          },
          _createFieldName: function(b, c, g, p) {
            var v;
            v = d.getDefaultPortalFieldInfo(b);
            var u = t.substitute(
                this.nls.attributeActionsPage.alreadyAppliedActionMsg,
                { action: this.nlsActionName[this.actionName] }
              ),
              u = f.create(
                "div",
                {
                  class: "esriCTExistingExpressionDiv esriCTVisibilityHidden",
                  title: u
                },
                g
              );
            p && k.remove(u, "esriCTVisibilityHidden");
            this.showDomainFieldIndicator &&
              ((p = f.create(
                "div",
                {
                  class: "esriCTDomainlistDiv esriCTVisibilityHidden",
                  innerHTML: "*",
                  title: this.nls.actionPage.domainListTitle
                },
                g
              )),
              b.domain &&
                b.domain.codedValues &&
                (k.remove(p, "esriCTVisibilityHidden"),
                k.remove(this.domainFieldHintMsg, "esriCTHidden")));
            b = f.create("div", { class: "esriCTFieldsCheckBox" }, g);
            b = new e({ label: v.label, value: v.fieldName, checked: !1 }, b);
            this.checkBoxNodes[c].push(b);
            q.set(g, "searchstring", v.label.toLowerCase());
            q.set(b.domNode, "fieldsCheckBoxId", c);
            a(b.domNode, "click", h.hitch(this, this._childNodeStateChanged));
          },
          _parentNodeStateChanged: function(a) {
            var b, c;
            b = q.get(a.currentTarget, "LayerCheckBoxId");
            a = this.layerCheckBoxNodes[b];
            b = this.checkBoxNodes[b];
            c = a[0].getValue();
            m.forEach(
              b,
              h.hitch(this, function(a) {
                c ? a.setValue(!0) : a.setValue(!1);
              })
            );
          },
          _childNodeStateChanged: function(a) {
            var b, c;
            b = q.get(a.currentTarget, "fieldsCheckBoxId");
            a = this.layerCheckBoxNodes[b];
            b = this.checkBoxNodes[b];
            c = !0;
            m.some(
              b,
              h.hitch(this, function(a) {
                if (!a.getValue()) return (c = !1), !0;
              })
            );
            a[0].setValue(c);
            this.emit("layerFieldsUpdated", !1);
          },
          getOnlyCheckedFields: function() {
            var a = {},
              b;
            for (b in this.checkBoxNodes) {
              a[b] = [];
              for (var c in this.checkBoxNodes[b])
                this.checkBoxNodes[b][c].checked &&
                  a[b].push(this.checkBoxNodes[b][c].get("value"));
            }
            return a;
          },
          getCheckedFields: function(a) {
            var b = {},
              c;
            for (c in this.checkBoxNodes) {
              b[c] = [];
              for (var d in this.checkBoxNodes[c])
                this.checkBoxNodes[c][d].checked &&
                  b[c].push(this.checkBoxNodes[c][d].get("value"));
            }
            this._applySettingsInLayer(a, b);
            return b;
          },
          _removeSettingsFromOtherGroups: function(a, b, c) {
            var d;
            if (this.existingGroups)
              for (var g in this.existingGroups)
                if (
                  g !== a &&
                  g !== this.prevName &&
                  (d = this.existingGroups[g].appliedOn) &&
                  d.hasOwnProperty(b) &&
                  -1 < d[b].indexOf(c)
                ) {
                  var e = d[b].indexOf(c);
                  d[b].splice(e, 1);
                }
          },
          _removePrevSettingsFromLayerFields: function(a) {
            var b = [];
            if (
              (b = this._getAllLayersFieldValues(b, this._configInfos, a)) &&
              0 < b.length
            )
              for (var c = 0; c < b.length; c++)
                if ((a = b[c]))
                  for (var d in a)
                    for (var g = a[d], e = 0; e < g.length; e++)
                      g[e].actionName === this.actionName &&
                        g[e].hasOwnProperty("attributeActionGroupName") &&
                        g[e].attributeActionGroupName === this.prevName &&
                        ((g[e].enabled = !1),
                        delete g[e].attributeActionGroupName,
                        "Intersection" === this.actionName
                          ? ((g[e].fields = []), (g[e].ignoreLayerRanking = !1))
                          : "Address" === this.actionName
                          ? delete g[e].field
                          : "Coordinates" === this.actionName &&
                            ((g[e].coordinatesSystem = "MapSpatialReference"),
                            (g[e].field = "x")));
          },
          _applysettingsToField: function(a, b, c) {
            var d,
              g = [];
            if (
              (g = this._getAllLayersFieldValues(g, this._configInfos, a)) &&
              0 < g.length
            ) {
              for (var e = 0; e < g.length; e++)
                if (
                  ((d = g[e]),
                  this.appliedOn && this.appliedOn.hasOwnProperty(a))
                ) {
                  var p = this.appliedOn[a];
                  p &&
                    0 < p.length &&
                    m.forEach(
                      p,
                      function(a) {
                        if (-1 === b.indexOf(a) && d.hasOwnProperty(a)) {
                          a = d[a];
                          for (var c = 0; c < a.length; c++)
                            a[c].actionName === this.actionName &&
                              ((a[c].enabled = !1),
                              delete a[c].attributeActionGroupName,
                              "Intersection" === this.actionName
                                ? ((a[c].fields = []),
                                  (a[c].ignoreLayerRanking = !1))
                                : "Address" === this.actionName
                                ? delete a[c].field
                                : "Coordinates" === this.actionName &&
                                  ((a[c].coordinatesSystem =
                                    "MapSpatialReference"),
                                  (a[c].field = "x")));
                        }
                      },
                      this
                    );
                }
              m.forEach(
                b,
                function(b) {
                  for (var e = 0; e < g.length; e++) {
                    var p;
                    d = g[e];
                    d.hasOwnProperty(b) ||
                      (d[b] = h.clone(this.defalutFieldInfos));
                    p = d[b];
                    for (var k = 0; k < p.length; k++)
                      p[k].actionName === this.actionName &&
                        (c.attributeInfo &&
                          (p[k] = h.mixin(p[k], c.attributeInfo)),
                        (p[k].enabled = !0),
                        (p[k].attributeActionGroupName = c.name),
                        this._removeSettingsFromOtherGroups(c.name, a, b));
                  }
                },
                this
              );
            }
          },
          _applySettingsInLayer: function(a, b) {
            for (var c in b) {
              var d;
              this._prevAppliedOnLayers &&
                -1 < this._prevAppliedOnLayers.indexOf(c) &&
                ((d = this._prevAppliedOnLayers.indexOf(c)),
                this._prevAppliedOnLayers.splice(d, 1));
              this._applysettingsToField(c, b[c], a);
            }
            this.deleteGroup();
          },
          deleteGroup: function() {
            this._prevAppliedOnLayers &&
              m.forEach(
                this._prevAppliedOnLayers,
                function(a) {
                  this._removePrevSettingsFromLayerFields(a);
                },
                this
              );
          },
          _applyPrevSettings: function() {
            if (this.appliedOn)
              for (var a in this.appliedOn)
                if (this.appliedOn.hasOwnProperty(a)) {
                  var b = this.appliedOn[a];
                  if (b && 0 < b.length) {
                    var c = this.layerCheckBoxNodes[a],
                      d = !0;
                    m.forEach(
                      this.checkBoxNodes[a],
                      h.hitch(this, function(a) {
                        -1 < b.indexOf(a.value)
                          ? a.setValue(!0)
                          : a.getValue() || (d = !1);
                      })
                    );
                    d && c && c[0] && c[0].setValue(d);
                  }
                }
          }
        });
      });
    },
    "widgets/SmartEditor/setting/Coordinates": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/on dojo/text!./Coordinates.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/Popup dijit/form/Select dijit/form/ValidationTextBox ./layersAndFieldsApplyOn dojo/dom-class".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t) {
        return l([e, n, b], {
          baseClass: "jimu-widget-smartEditor-setting-coordinates",
          templateString: c,
          groupNameTextBox: null,
          postCreate: function() {
            this.inherited(arguments);
            this.fieldSelector = this.groupNameTextBox = null;
            this._initControls();
            this._createLayersAndFields();
            this.isDelete || this.showDialog();
          },
          showDialog: function() {
            var b, c, e, k, r, v, A;
            c = !1;
            b = 675;
            A = !1;
            this._fieldValues &&
              this._fieldValues.Coordinates &&
              this._fieldValues.Coordinates.hasOwnProperty("enabled") &&
              ((c = this._fieldValues.Coordinates.enabled),
              (e = this._fieldValues.Coordinates.coordinatesSystem),
              (k = this._fieldValues.Coordinates.field));
            r = new q(
              {
                style: { width: "99%" },
                options: this._createCoordinatesOptions()
              },
              f.create("div", {}, this.selectCoordinateNode)
            );
            this.own(
              a(
                r,
                "change",
                h.hitch(this, function(a) {
                  this.fieldSelector.set(
                    "options",
                    this._getFieldsOptionsObj(a)
                  );
                  0 < this.fieldSelector.options.length &&
                    this.fieldSelector.set(
                      "value",
                      this.fieldSelector.options[0].value
                    );
                })
              )
            );
            e && r.set("value", e, !1);
            this.fieldSelector = new q(
              {
                style: { width: "99%" },
                options: this._getFieldsOptionsObj(r.getValue())
              },
              f.create("div", {}, this.selectAttributeNode)
            );
            k && this.fieldSelector.set("value", k);
            this.own(
              a(
                this.fieldSelector,
                "change",
                h.hitch(this, function() {
                  this._createLayersAndFields();
                })
              )
            );
            this.isGroup ||
              (t.add(this.groupInfoNode1, "esriCTHidden"),
              t.add(this.groupInfoNode2, "esriCTHidden"),
              t.remove(
                this.coordianteDijitMainWrapper,
                "esriCTCoordinateWidth"
              ),
              t.add(this.coordianteDijitMainWrapper, "esriCTFullWidth"),
              (A = !0),
              (b = 420));
            v = new d({
              titleLabel: this.nls.coordinatesPage.popupTitle,
              width: b,
              maxHeight: 500,
              autoHeight: A,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var a = {},
                      b = {};
                    a.enabled = c;
                    a.coordinatesSystem = r.get("value");
                    a.field = this.fieldSelector.get("value");
                    if (this.isGroup) {
                      if (!this.groupNameTextBox.isValid()) {
                        this.groupNameTextBox.focus();
                        return;
                      }
                    } else delete this._fieldValues.Coordinates.attributeActionGroupName;
                    this._fieldValues.Coordinates ||
                      (this._fieldValues.Coordinates = {
                        actionName: "Coordinates"
                      });
                    h.mixin(this._fieldValues.Coordinates, a);
                    this.isGroup
                      ? ((b.name = this.groupNameTextBox.get("value")),
                        (b.dataType = this.fieldSelector._getSelectedOptionsAttr().label),
                        (b.attributeInfo = a),
                        (b.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(
                          b
                        )),
                        this.emit("groupInfoUpdated", b))
                      : this.emit("attributeActionUpdated");
                    v.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    v.close();
                  })
                }
              ],
              onClose: h.hitch(this, function() {})
            });
          },
          _initControls: function() {
            this.groupNameTextBox = new k(
              { style: { width: "99%" }, required: !0, trim: !0 },
              f.create("div", {}, this.groupNameTextBoxNode)
            );
            this.groupNameTextBox.validator = h.hitch(this, function(a) {
              return a
                ? a !== this.prevName &&
                  this.editUtils.isDuplicateGroupName(
                    a,
                    this.existingGroupNames
                  )
                  ? (this.groupNameTextBox.set(
                      "invalidMessage",
                      this.nls.smartActionsPage.uniqueGroupNameMsg
                    ),
                    !1)
                  : !0
                : (this.groupNameTextBox.set(
                    "invalidMessage",
                    this.nls.smartActionsPage.requiredGroupNameMsg
                  ),
                  !1);
            });
            this.name && this.groupNameTextBox.set("value", this.name);
          },
          _createCoordinatesOptions: function() {
            var a = [];
            this.isGroup
              ? (0 <
                  this.coordinatesSavedDataTypes.MapSpatialReference.length &&
                  a.push({
                    label: this.nls.coordinatesPage.mapSpatialReference,
                    value: "MapSpatialReference"
                  }),
                0 < this.coordinatesSavedDataTypes.LatLong.length &&
                  a.push({
                    label: this.nls.coordinatesPage.latlong,
                    value: "LatLong"
                  }))
              : a.push(
                  {
                    label: this.nls.coordinatesPage.mapSpatialReference,
                    value: "MapSpatialReference"
                  },
                  { label: this.nls.coordinatesPage.latlong, value: "LatLong" }
                );
            return a;
          },
          _getFieldsOptionsObj: function(a) {
            var b = [],
              c = [],
              c =
                "LatLong" === a
                  ? [
                      { name: "y", alias: "Latitude" },
                      { name: "x", alias: "Longitude" },
                      { name: "xy", alias: "Latitude Longitude" }
                    ]
                  : [
                      { name: "x", alias: "X" },
                      { name: "y", alias: "Y" },
                      { name: "xy", alias: "X Y" }
                    ];
            m.forEach(
              c,
              h.hitch(this, function(a) {
                this.isGroup
                  ? (-1 ===
                      this.coordinatesSavedDataTypes.MapSpatialReference.indexOf(
                        a.alias
                      ) &&
                      -1 ===
                        this.coordinatesSavedDataTypes.LatLong.indexOf(
                          a.alias
                        )) ||
                    b.push({ label: a.alias || a.name, value: a.name })
                  : ("xy" !== a.name ||
                      ("xy" === a.name &&
                        "esriFieldTypeString" === this._fieldType)) &&
                    b.push({ label: a.alias || a.name, value: a.name });
              })
            );
            return b;
          },
          _createLayerFieldsFilter: function() {
            var a = {};
            this.fieldSelector && "xy" === this.fieldSelector.value
              ? m.forEach(
                  this._totalLayers,
                  h.hitch(this, function(b) {
                    b.isTable ||
                      ((a[b.id] = {}),
                      m.forEach(
                        b.layerObject.fields,
                        h.hitch(this, function(c) {
                          "esriFieldTypeString" === c.type &&
                            (a[b.id] || (a[b.id] = {}), (a[b.id][c.name] = c));
                        })
                      ));
                  })
                )
              : m.forEach(
                  this._totalLayers,
                  h.hitch(this, function(b) {
                    b.isTable ||
                      m.forEach(
                        b.layerObject.fields,
                        h.hitch(this, function(c) {
                          if (
                            "esriFieldTypeString" === c.type ||
                            "esriFieldTypeSmallInteger" === c.type ||
                            "esriFieldTypeInteger" === c.type ||
                            "esriFieldTypeSingle" === c.type ||
                            ("esriFieldTypeDouble" === c.type && c.editable)
                          )
                            a[b.id] || (a[b.id] = {}), (a[b.id][c.name] = c);
                        })
                      );
                  })
                );
            return a;
          },
          _createLayersAndFields: function() {
            this._layerAndFieldsApplyOnObj = new r({
              map: this.map,
              layerInfos: this.layerInfos,
              _configInfos: this._configInfos,
              actionName: "Coordinates",
              nls: this.nls,
              prevName: this.prevName,
              existingGroups: this.existingGroups,
              layerDetails: this._createLayerFieldsFilter(),
              appliedOn: this.appliedOn
            });
            f.empty(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.startup();
          },
          deleteGroup: function() {
            this._layerAndFieldsApplyOnObj.deleteGroup();
          }
        });
      });
    },
    "widgets/SmartEditor/setting/Address": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/dom-class dojo/text!./Address.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/Popup jimu/dijit/Message dijit/form/ValidationTextBox dijit/form/Select ./layersAndFieldsApplyOn dojo/on".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u) {
        return l([e, n, b], {
          baseClass: "jimu-widget-smartEditor-setting-address",
          templateString: c,
          _validGeocoderFields: [],
          ValidFieldsByTypeToApplyOn: {
            esriFieldTypeOID: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble",
              "esriFieldTypeString"
            ],
            esriFieldTypeSmallInteger: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeString",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeInteger: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeString",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeDouble: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeString",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeSingle: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeString",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeGUID: ["esriFieldTypeGUID", "esriFieldTypeString"],
            esriFieldTypeDate: ["esriFieldTypeDate"],
            esriFieldTypeString: ["esriFieldTypeString"]
          },
          postCreate: function() {
            this.inherited(arguments);
            this._validGeocoderFields = this._getValidGeocoderFields();
            this._initControls();
            this.isDelete || this.showDialog();
            this._createLayersAndFields();
          },
          _initControls: function() {
            var a, b, c;
            this.groupNameTextBox = new k(
              { style: { width: "99%" }, required: !0, trim: !0 },
              f.create("div", {}, this.groupNameTextBoxNode)
            );
            this.groupNameTextBox.validator = h.hitch(this, function(a) {
              return a
                ? a !== this.prevName &&
                  this.editUtils.isDuplicateGroupName(
                    a,
                    this.existingGroupNames
                  )
                  ? (this.groupNameTextBox.set(
                      "invalidMessage",
                      this.nls.smartActionsPage.uniqueGroupNameMsg
                    ),
                    !1)
                  : !0
                : (this.groupNameTextBox.set(
                    "invalidMessage",
                    this.nls.smartActionsPage.requiredGroupNameMsg
                  ),
                  !1);
            });
            this.name && this.groupNameTextBox.set("value", this.name);
            a = this._getFieldsOptionsObj(this._validGeocoderFields);
            this.fieldSelector = new r(
              { style: { width: "99%" }, options: a },
              f.create("div", {}, this.selectNode)
            );
            this._fieldValues &&
              this._fieldValues.Address &&
              this._fieldValues.Address.hasOwnProperty("field") &&
              (b = this._fieldValues.Address.field);
            b &&
              ((c = !1),
              m.some(
                a,
                h.hitch(this, function(a) {
                  if (a.value === b) return (c = !0);
                })
              ),
              c
                ? this.fieldSelector.set("value", b, !1)
                : new q({
                    message: this.nls.addressPage.prevConfigruedFieldChangedMsg
                  }));
            this.own(
              u(
                this.fieldSelector,
                "change",
                h.hitch(this, function() {
                  this._createLayersAndFields();
                })
              )
            );
          },
          showDialog: function() {
            var b = !1,
              c = !1,
              e = 500,
              k = 675;
            this.isGroup ||
              (a.add(this.groupInfoNode1, "esriCTHidden"),
              a.add(this.groupInfoNode2, "esriCTHidden"),
              a.remove(this.addressDijitMainWrapper, "esriCTAddressWidth"),
              a.add(this.addressDijitMainWrapper, "esriCTFullWidth"),
              (k = 600),
              (e = 300),
              (c = !0));
            b = !1;
            this._fieldValues &&
              this._fieldValues.Address &&
              this._fieldValues.Address.hasOwnProperty("enabled") &&
              (b = this._fieldValues.Address.enabled);
            var f = new d({
              titleLabel: this.nls.addressPage.popupTitle,
              width: k,
              maxHeight: e,
              autoHeight: c,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var a = {},
                      c = {};
                    a.enabled = b;
                    a.field = this.fieldSelector.get("value");
                    if (this.isGroup) {
                      if (!this.groupNameTextBox.isValid()) {
                        this.groupNameTextBox.focus();
                        return;
                      }
                    } else delete this._fieldValues.Address.attributeActionGroupName;
                    this._fieldValues.Address ||
                      (this._fieldValues.Address = { actionName: "Address" });
                    h.mixin(this._fieldValues.Address, a);
                    this.isGroup
                      ? ((c.name = this.groupNameTextBox.get("value")),
                        (c.dataType = a.field),
                        (c.attributeInfo = a),
                        (c.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(
                          c
                        )),
                        this.emit("groupInfoUpdated", c))
                      : this.emit("attributeActionUpdated");
                    f.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    f.close();
                  })
                }
              ],
              onClose: h.hitch(this, function() {})
            });
          },
          _getFieldsOptionsObj: function(a) {
            var b = [];
            m.forEach(
              a,
              h.hitch(this, function(a) {
                "esriFieldTypeGeometry" !== a.type &&
                  "esriFieldTypeBlob" !== a.type &&
                  "esriFieldTypeRaster" !== a.type &&
                  "esriFieldTypeXML" !== a.type &&
                  b.push({
                    label: a.alias || a.name,
                    value: a.name,
                    fieldType: a.type
                  });
              })
            );
            return b;
          },
          _createLayerFieldsFilter: function() {
            var a,
              b = {},
              c = this.fieldSelector.getOptions(this.fieldSelector.value)
                .fieldType;
            c &&
              this.ValidFieldsByTypeToApplyOn[c] &&
              ((a = this.ValidFieldsByTypeToApplyOn[c]),
              m.forEach(
                this._totalLayers,
                h.hitch(this, function(c) {
                  c.isTable ||
                    m.forEach(
                      c.layerObject.fields,
                      h.hitch(this, function(d) {
                        -1 < a.indexOf(d.type) &&
                          d.editable &&
                          (b[c.id] || (b[c.id] = {}), (b[c.id][d.name] = d));
                      })
                    );
                })
              ));
            return b;
          },
          _createLayersAndFields: function() {
            this._layerAndFieldsApplyOnObj = new t({
              map: this.map,
              layerInfos: this.layerInfos,
              _configInfos: this._configInfos,
              actionName: "Address",
              nls: this.nls,
              prevName: this.prevName,
              existingGroups: this.existingGroups,
              layerDetails: this._createLayerFieldsFilter(),
              appliedOn: this.appliedOn
            });
            f.empty(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.startup();
          },
          deleteGroup: function() {
            this._layerAndFieldsApplyOnObj.deleteGroup();
          },
          _getValidGeocoderFields: function() {
            var a = [];
            this._geocoderSettings &&
              this._geocoderSettings.hasOwnProperty("url") &&
              m.forEach(
                this._geocoderSettings.fields,
                h.hitch(this, function(b) {
                  a.push(b);
                })
              );
            return a;
          }
        });
      });
    },
    "widgets/SmartEditor/setting/EditDescription": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/on dojo/query dojo/text!./EditDescription.html dijit/_TemplatedMixin jimu/BaseWidgetSetting dijit/Editor jimu/dijit/Popup esri/lang dojo/sniff jimu/utils dojo/_base/html dijit/_editor/plugins/LinkDialog dijit/_editor/plugins/ViewSource dijit/_editor/plugins/FontChoice dojox/editor/plugins/Preview dijit/_editor/plugins/TextColor dojox/editor/plugins/ToolbarLineBreak dojox/editor/plugins/FindReplace dojox/editor/plugins/PasteFromWord dojox/editor/plugins/InsertAnchor dojox/editor/plugins/Blockquote dojox/editor/plugins/UploadImage jimu/dijit/EditorChooseImage jimu/dijit/EditorTextColor jimu/dijit/EditorBackgroundColor".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r) {
        return l([c, a], {
          baseClass: "jimu-widget-smartEditor-edit-description",
          templateString: f,
          _configInfo: null,
          _fieldValid: null,
          _fieldValidations: null,
          __layerName: null,
          postCreate: function() {
            this.inherited(arguments);
            this._initEditor();
            this.resize();
            setTimeout(
              n.hitch(this, function() {
                this.resize();
              }),
              200
            );
          },
          popupEditDescription: function() {
            this._editorObj.focus();
            this._configInfo.editDescription &&
              null !== this._configInfo.editDescription &&
              this._editorObj.set("value", this._configInfo.editDescription);
            var a = new e({
              titleLabel: d.substitute(
                { layername: this._layerName },
                this.nls.editDescriptionPage.title
              ),
              width: 720,
              maxHeight: 700,
              autoHeight: !0,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: n.hitch(this, function() {
                    this._configInfo.editDescription = this._getText();
                    this._editorObj.destroy();
                    a.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: n.hitch(this, function() {
                    this._editorObj.destroy();
                    a.close();
                  })
                }
              ],
              onClose: n.hitch(this, function() {})
            });
          },
          _getText: function() {
            return this._editorObj.focusNode.innerHTML;
          },
          _initEditor: function() {
            if (!this._editorObj)
              if (
                (this._initEditorPluginsCSS(),
                (this._editorObj = new b(
                  {
                    plugins: [
                      "bold",
                      "italic",
                      "underline",
                      k.getEditorTextColor("smartEditor"),
                      k.getEditorBackgroundColor("smartEditor"),
                      "|",
                      "justifyLeft",
                      "justifyCenter",
                      "justifyRight",
                      "justifyFull",
                      "|",
                      "insertOrderedList",
                      "insertUnorderedList",
                      "indent",
                      "outdent"
                    ],
                    extraPlugins: [
                      "|",
                      "createLink",
                      "unlink",
                      "pastefromword",
                      "|",
                      "undo",
                      "redo",
                      "|",
                      "viewSource",
                      "toolbarlinebreak",
                      {
                        name: "dijit._editor.plugins.FontChoice",
                        command: "fontName",
                        custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(
                          ";"
                        )
                      },
                      "fontSize",
                      "formatBlock"
                    ],
                    style: "font-family:Verdana;"
                  },
                  this.editText
                )),
                this.own(
                  h(
                    this._editorObj,
                    "focus",
                    n.hitch(this, function() {})
                  )
                ),
                this.own(
                  h(
                    this._editorObj,
                    "blur",
                    n.hitch(this, function() {})
                  )
                ),
                this._editorObj.onLoadDeferred.then(
                  n.hitch(this, function() {})
                ),
                this._editorObj.startup(),
                8 !== q("ie"))
              )
                this._editorObj.resize({ w: "100%", h: "100%" });
              else {
                var a = r.getMarginBox(this.editText);
                this._editorObj.resize({ w: a.w, h: a.h });
              }
          },
          _initEditorPluginsCSS: function() {
            var a, b;
            a = document.getElementsByTagName("head")[0];
            b =
              window.apiUrl +
              "dojox/editor/plugins/resources/css/TextColor.css";
            m('link[href\x3d"' + b + '"]', a)[0] ||
              k.loadStyleLink("editor_plugins_resources_TextColor", b);
            b =
              window.apiUrl +
              "dojox/editor/plugins/resources/editorPlugins.css";
            m('link[href\x3d"' + b + '"]', a)[0] ||
              k.loadStyleLink("editor_plugins_resources_editorPlugins", b);
            b =
              window.apiUrl +
              "dojox/editor/plugins/resources/css/PasteFromWord.css";
            m('link[href\x3d"' + b + '"]', a)[0] ||
              k.loadStyleLink("editor_plugins_resources_PasteFromWord", b);
          }
        });
      });
    },
    "dijit/Editor": function() {
      define("require dojo/_base/array dojo/_base/declare dojo/Deferred dojo/i18n dojo/dom-attr dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/keys dojo/_base/lang dojo/sniff dojo/string dojo/topic ./_Container ./Toolbar ./ToolbarSeparator ./layout/_LayoutWidget ./form/ToggleButton ./_editor/_Plugin ./_editor/plugins/EnterKeyHandling ./_editor/html ./_editor/range ./_editor/RichText ./main dojo/i18n!./_editor/nls/commands".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D
      ) {
        function y(a) {
          return new v({ command: a.name });
        }
        function z(a) {
          return new v({ buttonClass: w, command: a.name });
        }
        h = h("dijit.Editor", F, {
          plugins: null,
          extraPlugins: null,
          constructor: function() {
            q.isArray(this.plugins) ||
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
                A
              ]);
            this._plugins = [];
            this._editInterval = 1e3 * this.editActionInterval;
            if (k("ie") || k("trident") || k("edge"))
              this.events.push("onBeforeDeactivate"),
                this.events.push("onBeforeActivate");
          },
          postMixInProperties: function() {
            this.setValueDeferred = new m();
            this.inherited(arguments);
          },
          postCreate: function() {
            this.inherited(arguments);
            this._steps = this._steps.slice(0);
            this._undoedSteps = this._undoedSteps.slice(0);
            q.isArray(this.extraPlugins) &&
              (this.plugins = this.plugins.concat(this.extraPlugins));
            this.commands = f.getLocalization(
              "dijit._editor",
              "commands",
              this.lang
            );
            k("webkit") && e.set(this.domNode, "KhtmlUserSelect", "none");
          },
          startup: function() {
            this.inherited(arguments);
            this.toolbar ||
              ((this.toolbar = new g({
                ownerDocument: this.ownerDocument,
                dir: this.dir,
                lang: this.lang,
                "aria-label": this.id
              })),
              this.header.appendChild(this.toolbar.domNode));
            n.forEach(this.plugins, this.addPlugin, this);
            this.setValueDeferred.resolve(!0);
            c.add(this.iframe.parentNode, "dijitEditorIFrameContainer");
            c.add(this.iframe, "dijitEditorIFrame");
            a.set(this.iframe, "allowTransparency", !0);
            this.toolbar.startup();
            this.onNormalizedDisplayChanged();
          },
          destroy: function() {
            n.forEach(this._plugins, function(a) {
              a && a.destroy && a.destroy();
            });
            this._plugins = [];
            this.toolbar.destroyRecursive();
            delete this.toolbar;
            this.inherited(arguments);
          },
          addPlugin: function(a, b) {
            var c = q.isString(a)
              ? { name: a }
              : q.isFunction(a)
              ? { ctor: a }
              : a;
            if (!c.setEditor) {
              var d = { args: c, plugin: null, editor: this };
              c.name &&
                (v.registry[c.name]
                  ? (d.plugin = v.registry[c.name](c))
                  : t.publish(D._scopeName + ".Editor.getPlugin", d));
              if (!d.plugin)
                try {
                  var g = c.ctor || q.getObject(c.name) || l(c.name);
                  g && (d.plugin = new g(c));
                } catch (M) {
                  throw Error(
                    this.id + ": cannot find plugin [" + c.name + "]"
                  );
                }
              if (!d.plugin)
                throw Error(this.id + ": cannot find plugin [" + c.name + "]");
              a = d.plugin;
            }
            1 < arguments.length
              ? (this._plugins[b] = a)
              : this._plugins.push(a);
            a.setEditor(this);
            q.isFunction(a.setToolbar) && a.setToolbar(this.toolbar);
          },
          resize: function(a) {
            a && x.prototype.resize.apply(this, arguments);
          },
          layout: function() {
            var a =
              this._contentBox.h -
              (this.getHeaderHeight() +
                this.getFooterHeight() +
                b.getPadBorderExtents(this.iframe.parentNode).h +
                b.getMarginExtents(this.iframe.parentNode).h);
            this.editingArea.style.height = a + "px";
            this.iframe && (this.iframe.style.height = "100%");
            this._layoutMode = !0;
          },
          _onIEMouseDown: function(a) {
            var b,
              c = this.document.body,
              d = c.clientWidth,
              g = c.clientHeight,
              e = c.clientLeft,
              p = c.offsetWidth,
              k = c.offsetHeight,
              f = c.offsetLeft;
            /^rtl$/i.test(c.dir || "")
              ? d < p && a.x > d && a.x < p && (b = !0)
              : a.x < e && a.x > f && (b = !0);
            b || (g < k && a.y > g && a.y < k && (b = !0));
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
          _clipboardCommand: function(a) {
            var b;
            try {
              if (
                ((b = this.document.execCommand(a, !1, null)),
                k("webkit") && !b)
              )
                throw {};
            } catch (B) {
              (b = r.substitute),
                alert(
                  b(this.commands.systemShortcut, [
                    this.commands[a],
                    b(this.commands[k("mac") ? "appleKey" : "ctrlKey"], [
                      { cut: "X", copy: "C", paste: "V" }[a]
                    ])
                  ])
                ),
                (b = !1);
            }
            return b;
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
              c = a.mark;
            a = a.isCollapsed;
            var d, g, e;
            c &&
              (9 > k("ie") || (9 === k("ie") && k("quirks"))
                ? q.isArray(c)
                  ? ((b = []),
                    n.forEach(
                      c,
                      function(a) {
                        b.push(C.getNode(a, this.editNode));
                      },
                      this
                    ),
                    this.selection.moveToBookmark({ mark: b, isCollapsed: a }))
                  : c.startContainer &&
                    c.endContainer &&
                    (e = C.getSelection(this.window)) &&
                    e.removeAllRanges &&
                    (e.removeAllRanges(),
                    (a = C.create(this.window)),
                    (d = C.getNode(c.startContainer, this.editNode)),
                    (g = C.getNode(c.endContainer, this.editNode)),
                    d &&
                      g &&
                      (a.setStart(d, c.startOffset),
                      a.setEnd(g, c.endOffset),
                      e.addRange(a)))
                : (e = C.getSelection(this.window)) &&
                  e.removeAllRanges &&
                  (e.removeAllRanges(),
                  (a = C.create(this.window)),
                  (d = C.getNode(c.startContainer, this.editNode)),
                  (g = C.getNode(c.endContainer, this.editNode)),
                  d &&
                    g &&
                    (a.setStart(d, c.startOffset),
                    a.setEnd(g, c.endOffset),
                    e.addRange(a))));
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
              b = [];
            if (a && a.mark) {
              var c = a.mark;
              if (9 > k("ie") || (9 === k("ie") && k("quirks"))) {
                var d = C.getSelection(this.window);
                if (q.isArray(c))
                  n.forEach(
                    a.mark,
                    function(a) {
                      b.push(C.getIndex(a, this.editNode).o);
                    },
                    this
                  ),
                    (a.mark = b);
                else if (d) {
                  var g;
                  d.rangeCount && (g = d.getRangeAt(0));
                  a.mark = g ? g.cloneRange() : this.selection.getBookmark();
                }
              }
              try {
                a.mark &&
                  a.mark.startContainer &&
                  ((b = C.getIndex(a.mark.startContainer, this.editNode).o),
                  (a.mark = {
                    startContainer: b,
                    startOffset: a.mark.startOffset,
                    endContainer:
                      a.mark.endContainer === a.mark.startContainer
                        ? b
                        : C.getIndex(a.mark.endContainer, this.editNode).o,
                    endOffset: a.mark.endOffset
                  }));
              } catch (M) {
                a.mark = null;
              }
            }
            return a;
          },
          _beginEditing: function() {
            0 === this._steps.length &&
              this._steps.push({
                text: E.getChildrenHtml(this.editNode),
                bookmark: this._getBookmark()
              });
          },
          _endEditing: function() {
            var a = E.getChildrenHtml(this.editNode);
            this._undoedSteps = [];
            this._steps.push({ text: a, bookmark: this._getBookmark() });
          },
          onKeyDown: function(a) {
            k("ie") ||
              this.iframe ||
              a.keyCode != d.TAB ||
              this.tabIndent ||
              this._saveSelection();
            if (this.customUndo) {
              var b = a.keyCode;
              if (a.ctrlKey && !a.shiftKey && !a.altKey) {
                if (90 == b || 122 == b) {
                  a.stopPropagation();
                  a.preventDefault();
                  this.undo();
                  return;
                }
                if (89 == b || 121 == b) {
                  a.stopPropagation();
                  a.preventDefault();
                  this.redo();
                  return;
                }
              }
              this.inherited(arguments);
              switch (b) {
                case d.ENTER:
                case d.BACKSPACE:
                case d.DELETE:
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
                    (a.keyCode < d.F1 || a.keyCode > d.F15)
                  ) {
                    this.beginEditing();
                    break;
                  }
                case d.ALT:
                  this.endEditing();
                  break;
                case d.UP_ARROW:
                case d.DOWN_ARROW:
                case d.LEFT_ARROW:
                case d.RIGHT_ARROW:
                case d.HOME:
                case d.END:
                case d.PAGE_UP:
                case d.PAGE_DOWN:
                  this.endEditing(!0);
                case d.CTRL:
                case d.SHIFT:
                case d.TAB:
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
            } catch (H) {}
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
              q.hitch(this, function() {
                (!this.disabled && a) || (!this._buttonEnabledPlugins && a)
                  ? n.forEach(this._plugins, function(a) {
                      a.set("disabled", !0);
                    })
                  : this.disabled &&
                    !a &&
                    n.forEach(this._plugins, function(a) {
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
                  (e.set(
                    this.document.body,
                    "color",
                    e.get(this.iframe, "color")
                  ),
                  e.set(
                    this.document.body,
                    "background-color",
                    e.get(this.iframe, "background-color")
                  ));
            } catch (H) {}
          }
        });
        q.mixin(v.registry, {
          undo: y,
          redo: y,
          cut: y,
          copy: y,
          paste: y,
          insertOrderedList: y,
          insertUnorderedList: y,
          indent: y,
          outdent: y,
          justifyCenter: y,
          justifyFull: y,
          justifyLeft: y,
          justifyRight: y,
          delete: y,
          selectAll: y,
          removeFormat: y,
          unlink: y,
          insertHorizontalRule: y,
          bold: z,
          italic: z,
          underline: z,
          strikethrough: z,
          subscript: z,
          superscript: z,
          "|": function() {
            return new v({
              setEditor: function(a) {
                this.editor = a;
                this.button = new p({ ownerDocument: a.ownerDocument });
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
      ), function(l, n, h, m, f, a, c, b) {
        h("dijit-legacy-requires") &&
          f(0, function() {
            l(["dijit/ToolbarSeparator"]);
          });
        return n("dijit.Toolbar", [a, b, c], {
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
      ], function(l, n, h, m) {
        return l("dijit.ToolbarSeparator", [h, m], {
          templateString:
            '\x3cdiv class\x3d"dijitToolbarSeparator dijitInline" role\x3d"presentation"\x3e\x3c/div\x3e',
          buildRendering: function() {
            this.inherited(arguments);
            n.setSelectable(this.domNode, !1);
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
      ], function(l, n, h, m, f) {
        n = n("dijit._editor._Plugin", m, {
          constructor: function(a) {
            this.params = a || {};
            h.mixin(this, this.params);
            this._attrPairNames = {};
          },
          editor: null,
          iconClassPrefix: "dijitEditorIcon",
          button: null,
          command: "",
          useDefaultCommand: !0,
          buttonClass: f,
          disabled: !1,
          getLabel: function(a) {
            return this.editor.commands[a];
          },
          _initButton: function() {
            if (this.command.length) {
              var a = this.getLabel(this.command),
                c = this.editor,
                b =
                  this.iconClassPrefix +
                  " " +
                  this.iconClassPrefix +
                  this.command.charAt(0).toUpperCase() +
                  this.command.substr(1);
              this.button ||
                ((a = h.mixin(
                  {
                    label: a,
                    ownerDocument: c.ownerDocument,
                    dir: c.dir,
                    lang: c.lang,
                    showLabel: !1,
                    iconClass: b,
                    dropDown: this.dropDown,
                    tabIndex: "-1"
                  },
                  this.params || {}
                )),
                delete a.name,
                (this.button = new this.buttonClass(a)));
            }
            this.get("disabled") &&
              this.button &&
              this.button.set("disabled", this.get("disabled"));
          },
          destroy: function() {
            this.dropDown && this.dropDown.destroyRecursive();
            this.inherited(arguments);
          },
          connect: function(a, c, b) {
            this.own(l.connect(a, c, this, b));
          },
          updateState: function() {
            var a = this.editor,
              c = this.command,
              b,
              e;
            if (a && a.isLoaded && c.length) {
              var d = this.get("disabled");
              if (this.button)
                try {
                  var f = a._implCommand(c);
                  e = !d && (this[f] ? this[f](c) : a.queryCommandEnabled(c));
                  this.enabled !== e &&
                    ((this.enabled = e), this.button.set("disabled", !e));
                  e &&
                    "boolean" == typeof this.button.checked &&
                    ((b = a.queryCommandState(c)),
                    this.checked !== b &&
                      ((this.checked = b),
                      this.button.set("checked", a.queryCommandState(c))));
                } catch (k) {
                  console.log(k);
                }
            }
          },
          setEditor: function(a) {
            this.editor = a;
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
          setToolbar: function(a) {
            this.button && a.addChild(this.button);
          },
          set: function(a, c) {
            if ("object" === typeof a) {
              for (var b in a) this.set(b, a[b]);
              return this;
            }
            b = this._getAttrNames(a);
            if (this[b.s])
              var e = this[b.s].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
              );
            else this._set(a, c);
            return e || this;
          },
          get: function(a) {
            var c = this._getAttrNames(a);
            return this[c.g] ? this[c.g]() : this[a];
          },
          _setDisabledAttr: function(a) {
            this._set("disabled", a);
            this.updateState();
          },
          _getAttrNames: function(a) {
            var c = this._attrPairNames;
            if (c[a]) return c[a];
            var b = a.charAt(0).toUpperCase() + a.substr(1);
            return (c[a] = { s: "_set" + b + "Attr", g: "_get" + b + "Attr" });
          },
          _set: function(a, c) {
            this[a] = c;
          }
        });
        n.registry = {};
        return n;
      });
    },
    "dijit/_editor/plugins/EnterKeyHandling": function() {
      define("dojo/_base/declare dojo/dom-construct dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/_base/window dojo/window ../_Plugin ../RichText ../range".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q) {
        return l("dijit._editor.plugins.EnterKeyHandling", e, {
          blockNodeForEnter: "BR",
          constructor: function(a) {
            a &&
              ("blockNodeForEnter" in a &&
                (a.blockNodeForEnter = a.blockNodeForEnter.toUpperCase()),
              m.mixin(this, a));
          },
          setEditor: function(b) {
            if (this.editor !== b)
              if (((this.editor = b), "BR" == this.blockNodeForEnter))
                (this.editor.customUndo = !0),
                  b.onLoadDeferred.then(
                    m.hitch(this, function(c) {
                      this.own(
                        f(
                          b.document,
                          "keydown",
                          m.hitch(this, function(a) {
                            if (a.keyCode == h.ENTER) {
                              var b = m.mixin({}, a);
                              b.shiftKey = !0;
                              this.handleEnterKey(b) ||
                                (a.stopPropagation(), a.preventDefault());
                            }
                          })
                        )
                      );
                      9 <= a("ie") &&
                        10 >= a("ie") &&
                        this.own(
                          f(
                            b.document,
                            "paste",
                            m.hitch(this, function(a) {
                              setTimeout(
                                m.hitch(this, function() {
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
                var c = m.hitch(this, "handleEnterKey");
                b.addKeyHandler(13, 0, 0, c);
                b.addKeyHandler(13, 0, 1, c);
                this.own(
                  this.editor.on("KeyPressed", m.hitch(this, "onKeyPressed"))
                );
              }
          },
          onKeyPressed: function() {
            if (this._checkListLater) {
              if (this.editor.selection.isCollapsed()) {
                var b = this.editor.selection.getAncestorElement("LI");
                if (b) {
                  a("mozilla") &&
                    "LI" == b.parentNode.parentNode.nodeName &&
                    (b = b.parentNode.parentNode);
                  var c = b.firstChild;
                  !c ||
                    1 != c.nodeType ||
                    ("UL" != c.nodeName && "OL" != c.nodeName) ||
                    (b.insertBefore(
                      c.ownerDocument.createTextNode("\u00a0"),
                      c
                    ),
                    (c = q.create(this.editor.window)),
                    c.setStart(b.firstChild, 0),
                    (b = q.getSelection(this.editor.window, !0)),
                    b.removeAllRanges(),
                    b.addRange(c));
                } else
                  d.prototype.execCommand.call(
                    this.editor,
                    "formatblock",
                    this.blockNodeForEnter
                  ),
                    (b = this.editor.selection.getAncestorElement(
                      this.blockNodeForEnter
                    ))
                      ? ((b.innerHTML = this.bogusHtmlContent),
                        9 >= a("ie") &&
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
          handleEnterKey: function(c) {
            var e,
              f,
              k,
              g,
              p = this.editor.document,
              h,
              l,
              v;
            if (c.shiftKey) {
              c = this.editor.selection.getParentElement();
              if ((g = q.getAncestor(c, this.blockNodes))) {
                if ("LI" == g.tagName) return !0;
                c = q.getSelection(this.editor.window);
                e = c.getRangeAt(0);
                e.collapsed ||
                  (e.deleteContents(),
                  (c = q.getSelection(this.editor.window)),
                  (e = c.getRangeAt(0)));
                if (
                  q.atBeginningOfContainer(g, e.startContainer, e.startOffset)
                )
                  (h = p.createElement("br")),
                    (e = q.create(this.editor.window)),
                    g.insertBefore(h, g.firstChild),
                    e.setStartAfter(h),
                    c.removeAllRanges(),
                    c.addRange(e);
                else if (q.atEndOfContainer(g, e.startContainer, e.startOffset))
                  (e = q.create(this.editor.window)),
                    (h = p.createElement("br")),
                    g.appendChild(h),
                    g.appendChild(p.createTextNode("\u00a0")),
                    e.setStart(g.lastChild, 0),
                    c.removeAllRanges(),
                    c.addRange(e);
                else
                  return (l = e.startContainer) && 3 == l.nodeType
                    ? ((v = l.nodeValue),
                      (f = p.createTextNode(v.substring(0, e.startOffset))),
                      (k = p.createTextNode(v.substring(e.startOffset))),
                      (g = p.createElement("br")),
                      "" == k.nodeValue &&
                        a("webkit") &&
                        (k = p.createTextNode("\u00a0")),
                      n.place(f, l, "after"),
                      n.place(g, f, "after"),
                      n.place(k, g, "after"),
                      n.destroy(l),
                      (e = q.create(this.editor.window)),
                      e.setStart(k, 0),
                      c.removeAllRanges(),
                      c.addRange(e),
                      !1)
                    : !0;
              } else
                (c = q.getSelection(this.editor.window)),
                  c.rangeCount
                    ? (e = c.getRangeAt(0)) &&
                      e.startContainer &&
                      (e.collapsed ||
                        (e.deleteContents(),
                        (c = q.getSelection(this.editor.window)),
                        (e = c.getRangeAt(0))),
                      (l = e.startContainer) && 3 == l.nodeType
                        ? ((g = e.startOffset),
                          l.length < g &&
                            ((k = this._adjustNodeAndOffset(l, g)),
                            (l = k.node),
                            (g = k.offset)),
                          (v = l.nodeValue),
                          (f = p.createTextNode(v.substring(0, g))),
                          (k = p.createTextNode(v.substring(g))),
                          (g = p.createElement("br")),
                          k.length || (k = p.createTextNode("\u00a0")),
                          f.length ? n.place(f, l, "after") : (f = l),
                          n.place(g, f, "after"),
                          n.place(k, g, "after"),
                          n.destroy(l))
                        : (0 <= e.startOffset &&
                            (h = l.childNodes[e.startOffset]),
                          (g = p.createElement("br")),
                          (k = p.createTextNode("\u00a0")),
                          h
                            ? (n.place(g, h, "before"), n.place(k, g, "after"))
                            : (l.appendChild(g), l.appendChild(k))),
                      (e = q.create(this.editor.window)),
                      e.setStart(k, 0),
                      e.setEnd(k, k.length),
                      c.removeAllRanges(),
                      c.addRange(e),
                      this.editor.selection.collapse(!0))
                    : d.prototype.execCommand.call(
                        this.editor,
                        "inserthtml",
                        "\x3cbr\x3e"
                      );
              return !1;
            }
            var A = !0;
            c = q.getSelection(this.editor.window);
            e = c.getRangeAt(0);
            e.collapsed ||
              (e.deleteContents(),
              (c = q.getSelection(this.editor.window)),
              (e = c.getRangeAt(0)));
            h = q.getBlockAncestor(e.endContainer, null, this.editor.editNode);
            var m = h.blockNode;
            if (
              (this._checkListLater =
                m && ("LI" == m.nodeName || "LI" == m.parentNode.nodeName))
            )
              return (
                a("mozilla") && (this._pressedEnterInBlock = m),
                /^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(
                  m.innerHTML
                ) &&
                  ((m.innerHTML = ""),
                  a("webkit") &&
                    ((e = q.create(this.editor.window)),
                    e.setStart(m, 0),
                    c.removeAllRanges(),
                    c.addRange(e)),
                  (this._checkListLater = !1)),
                !0
              );
            if (!h.blockNode || h.blockNode === this.editor.editNode) {
              try {
                d.prototype.execCommand.call(
                  this.editor,
                  "formatblock",
                  this.blockNodeForEnter
                );
              } catch (C) {}
              h = {
                blockNode: this.editor.selection.getAncestorElement(
                  this.blockNodeForEnter
                ),
                blockContainer: this.editor.editNode
              };
              if (h.blockNode) {
                if (
                  h.blockNode != this.editor.editNode &&
                  !(h.blockNode.textContent || h.blockNode.innerHTML).replace(
                    /^\s+|\s+$/g,
                    ""
                  ).length
                )
                  return this.removeTrailingBr(h.blockNode), !1;
              } else h.blockNode = this.editor.editNode;
              c = q.getSelection(this.editor.window);
              e = c.getRangeAt(0);
            }
            m = p.createElement(this.blockNodeForEnter);
            m.innerHTML = this.bogusHtmlContent;
            this.removeTrailingBr(h.blockNode);
            k = e.endOffset;
            A = e.endContainer;
            A.length < k &&
              ((k = this._adjustNodeAndOffset(A, k)),
              (A = k.node),
              (k = k.offset));
            if (q.atEndOfContainer(h.blockNode, A, k))
              h.blockNode === h.blockContainer
                ? h.blockNode.appendChild(m)
                : n.place(m, h.blockNode, "after"),
                (A = !1),
                (e = q.create(this.editor.window)),
                e.setStart(m, 0),
                c.removeAllRanges(),
                c.addRange(e),
                this.editor.height && b.scrollIntoView(m);
            else if (
              q.atBeginningOfContainer(
                h.blockNode,
                e.startContainer,
                e.startOffset
              )
            )
              n.place(
                m,
                h.blockNode,
                h.blockNode === h.blockContainer ? "first" : "before"
              ),
                m.nextSibling &&
                  this.editor.height &&
                  ((e = q.create(this.editor.window)),
                  e.setStart(m.nextSibling, 0),
                  c.removeAllRanges(),
                  c.addRange(e),
                  b.scrollIntoView(m.nextSibling)),
                (A = !1);
            else {
              h.blockNode === h.blockContainer
                ? h.blockNode.appendChild(m)
                : n.place(m, h.blockNode, "after");
              A = !1;
              h.blockNode.style &&
                m.style &&
                h.blockNode.style.cssText &&
                (m.style.cssText = h.blockNode.style.cssText);
              if ((l = e.startContainer) && 3 == l.nodeType) {
                k = e.endOffset;
                l.length < k &&
                  ((k = this._adjustNodeAndOffset(l, k)),
                  (l = k.node),
                  (k = k.offset));
                v = l.nodeValue;
                f = p.createTextNode(v.substring(0, k));
                k = p.createTextNode(v.substring(k, v.length));
                n.place(f, l, "before");
                n.place(k, l, "after");
                n.destroy(l);
                for (e = f.parentNode; e !== h.blockNode; ) {
                  v = p.createElement(e.tagName);
                  e.style &&
                    v.style &&
                    e.style.cssText &&
                    (v.style.cssText = e.style.cssText);
                  "FONT" === e.tagName &&
                    (e.color && (v.color = e.color),
                    e.face && (v.face = e.face),
                    e.size && (v.size = e.size));
                  for (; k; ) (l = k.nextSibling), v.appendChild(k), (k = l);
                  n.place(v, e, "after");
                  f = e;
                  k = v;
                  e = e.parentNode;
                }
                if (1 == k.nodeType || (3 == k.nodeType && k.nodeValue))
                  m.innerHTML = "";
                for (f = k; k; ) (l = k.nextSibling), m.appendChild(k), (k = l);
              }
              e = q.create(this.editor.window);
              p = f;
              if ("BR" !== this.blockNodeForEnter) {
                for (; p; ) (g = p), (p = l = p.firstChild);
                g && g.parentNode
                  ? ((m = g.parentNode),
                    e.setStart(m, 0),
                    c.removeAllRanges(),
                    c.addRange(e),
                    this.editor.height && b.scrollIntoView(m),
                    a("mozilla") && (this._pressedEnterInBlock = h.blockNode))
                  : (A = !0);
              } else
                e.setStart(m, 0),
                  c.removeAllRanges(),
                  c.addRange(e),
                  this.editor.height && b.scrollIntoView(m),
                  a("mozilla") && (this._pressedEnterInBlock = h.blockNode);
            }
            return A;
          },
          _adjustNodeAndOffset: function(a, b) {
            for (
              ;
              a.length < b && a.nextSibling && 3 == a.nextSibling.nodeType;

            )
              (b -= a.length), (a = a.nextSibling);
            return { node: a, offset: b };
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
                n.destroy(a.lastChild),
                a.childNodes.length || (a.innerHTML = this.bogusHtmlContent);
          }
        });
      });
    },
    "dijit/_editor/RichText": function() {
      define("dojo/_base/array dojo/_base/config dojo/_base/declare dojo/_base/Deferred dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/query dojo/domReady dojo/sniff dojo/string dojo/topic dojo/_base/unload dojo/_base/url dojo/window ../_Widget ../_CssStateMixin ../selection ./range ./html ../focus ../main".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D,
        y,
        z,
        H,
        J
      ) {
        var B = h("dijit._editor.RichText", [C, F], {
          constructor: function(a) {
            this.contentPreFilters = [];
            this.contentPostFilters = [];
            this.contentDomPreFilters = [];
            this.contentDomPostFilters = [];
            this.editingAreaStyleSheets = [];
            this.events = [].concat(this.events);
            this._keyHandlers = {};
            a && r.isString(a.value) && (this.value = a.value);
            this.onLoadDeferred = new m();
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
              r.trim,
              r.hitch(this, "_preFixUrlAttributes")
            ].concat(this.contentPreFilters);
            p("mozilla") &&
              ((this.contentPreFilters = [this._normalizeFontStyle].concat(
                this.contentPreFilters
              )),
              (this.contentPostFilters = [this._removeMozBogus].concat(
                this.contentPostFilters
              )));
            p("webkit") &&
              ((this.contentPreFilters = [this._removeWebkitBogus].concat(
                this.contentPreFilters
              )),
              (this.contentPostFilters = [this._removeWebkitBogus].concat(
                this.contentPostFilters
              )));
            if (p("ie") || p("trident"))
              (this.contentPostFilters = [this._normalizeFontStyle].concat(
                this.contentPostFilters
              )),
                (this.contentDomPostFilters = [
                  r.hitch(this, "_stripBreakerNodes")
                ].concat(this.contentDomPostFilters));
            this.contentDomPostFilters = [
              r.hitch(this, "_stripTrailingEmptyNodes")
            ].concat(this.contentDomPostFilters);
            this.inherited(arguments);
            w.publish(J._scopeName + "._editor.RichText::init", this);
          },
          startup: function() {
            this.inherited(arguments);
            this.open();
            this.setupDefaultShortcuts();
          },
          setupDefaultShortcuts: function() {
            var a = r.hitch(this, function(a, b) {
                return function() {
                  return !this.execCommand(a, b);
                };
              }),
              b = {
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
            p("ie") || (b.Z = a("redo"));
            for (var c in b) this.addKeyHandler(c, !0, !1, b[c]);
          },
          events: ["onKeyDown", "onKeyUp"],
          captureEvents: [],
          _editorCommandsLocalized: !1,
          _localizeEditorCommands: function() {
            if (B._editorCommandsLocalized)
              (this._local2NativeFormatNames = B._local2NativeFormatNames),
                (this._native2LocalFormatNames = B._native2LocalFormatNames);
            else {
              B._editorCommandsLocalized = !0;
              B._local2NativeFormatNames = {};
              B._native2LocalFormatNames = {};
              this._local2NativeFormatNames = B._local2NativeFormatNames;
              this._native2LocalFormatNames = B._native2LocalFormatNames;
              for (
                var a = "div p pre h1 h2 h3 h4 h5 h6 ol ul address".split(" "),
                  c = "",
                  d,
                  e = 0;
                (d = a[e++]);

              )
                c =
                  "l" !== d.charAt(1)
                    ? c +
                      ("\x3c" +
                        d +
                        "\x3e\x3cspan\x3econtent\x3c/span\x3e\x3c/" +
                        d +
                        "\x3e\x3cbr/\x3e")
                    : c +
                      ("\x3c" +
                        d +
                        "\x3e\x3cli\x3econtent\x3c/li\x3e\x3c/" +
                        d +
                        "\x3e\x3cbr/\x3e");
              var g = b.create("div", {
                style: {
                  position: "absolute",
                  top: "0px",
                  zIndex: 10,
                  opacity: 0.01
                },
                innerHTML: c
              });
              this.ownerDocumentBody.appendChild(g);
              a = r.hitch(this, function() {
                for (var a = g.firstChild; a; )
                  try {
                    this.selection.selectElement(a.firstChild);
                    var c = a.tagName.toLowerCase();
                    this._local2NativeFormatNames[
                      c
                    ] = document.queryCommandValue("formatblock");
                    this._native2LocalFormatNames[
                      this._local2NativeFormatNames[c]
                    ] = c;
                    a = a.nextSibling.nextSibling;
                  } catch (K) {}
                b.destroy(g);
              });
              this.defer(a);
            }
          },
          open: function(e) {
            if (!this.onLoadDeferred || 0 <= this.onLoadDeferred.fired)
              this.onLoadDeferred = new m();
            this.isClosed || this.close();
            w.publish(J._scopeName + "._editor.RichText::open", this);
            1 === arguments.length && e.nodeName && (this.domNode = e);
            var g = this.domNode,
              k;
            if (r.isString(this.value)) (k = this.value), (g.innerHTML = "");
            else if (g.nodeName && "textarea" == g.nodeName.toLowerCase()) {
              var q = (this.textarea = g);
              this.name = q.name;
              k = q.value;
              g = this.domNode = this.ownerDocument.createElement("div");
              g.setAttribute("widgetId", this.id);
              q.removeAttribute("widgetId");
              g.cssText = q.cssText;
              g.className += " " + q.className;
              b.place(g, q, "before");
              var G = r.hitch(this, function() {
                d.set(q, {
                  display: "block",
                  position: "absolute",
                  top: "-1000px"
                });
                if (p("ie")) {
                  var a = q.style;
                  this.__overflow = a.overflow;
                  a.overflow = "hidden";
                }
              });
              p("ie") ? this.defer(G, 10) : G();
              if (q.form) {
                var h = q.value;
                this.reset = function() {
                  this.getValue() !== h && this.replaceValue(h);
                };
                t(
                  q.form,
                  "submit",
                  r.hitch(this, function() {
                    a.set(q, "disabled", this.disabled);
                    q.value = this.getValue();
                  })
                );
              }
            } else (k = z.getChildrenHtml(g)), (g.innerHTML = "");
            this.value = k;
            g.nodeName && "LI" === g.nodeName && (g.innerHTML = " \x3cbr\x3e");
            this.header = g.ownerDocument.createElement("div");
            g.appendChild(this.header);
            this.editingArea = g.ownerDocument.createElement("div");
            g.appendChild(this.editingArea);
            this.footer = g.ownerDocument.createElement("div");
            g.appendChild(this.footer);
            this.name || (this.name = this.id + "_AUTOGEN");
            if ("" !== this.name && (!n.useXDomain || n.allowXdRichTextSave)) {
              if (
                (k = f.byId(J._scopeName + "._editor.RichText.value")) &&
                "" !== k.value
              )
                for (
                  var G = k.value.split(this._SEPARATOR), l = 0, u;
                  (u = G[l++]);

                )
                  if (
                    ((u = u.split(this._NAME_CONTENT_SEP)), u[0] === this.name)
                  ) {
                    this.value = u[1];
                    G = G.splice(l, 1);
                    k.value = G.join(this._SEPARATOR);
                    break;
                  }
              B._globalSaveHandler ||
                ((B._globalSaveHandler = {}),
                v.addOnUnload(function() {
                  for (var a in B._globalSaveHandler) {
                    var b = B._globalSaveHandler[a];
                    r.isFunction(b) && b();
                  }
                }));
              B._globalSaveHandler[this.id] = r.hitch(this, "_saveContent");
            }
            this.isClosed = !1;
            k = this.editorObject = this.iframe = this.ownerDocument.createElement(
              "iframe"
            );
            k.id = this.id + "_iframe";
            k.style.border = "none";
            k.style.width = "100%";
            this._layoutMode
              ? (k.style.height = "100%")
              : 7 <= p("ie")
              ? (this.height && (k.style.height = this.height),
                this.minHeight && (k.style.minHeight = this.minHeight))
              : (k.style.height = this.height ? this.height : this.minHeight);
            k.frameBorder = 0;
            k._loadFunc = r.hitch(this, function(a) {
              this.window = a;
              this.document = a.document;
              this.selection = new D.SelectionManager(a);
              p("ie") && this._localizeEditorCommands();
              this.onLoad(this.get("value"));
            });
            G = this._getIframeDocTxt()
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'");
            G =
              11 > p("ie")
                ? 'javascript:document.open();try{parent.window;}catch(e){document.domain\x3d"' +
                  document.domain +
                  "\";}document.write('" +
                  G +
                  "');document.close()"
                : "javascript: '" + G + "'";
            this.editingArea.appendChild(k);
            k.src = G;
            "LI" === g.nodeName && (g.lastChild.style.marginTop = "-1.2em");
            c.add(this.domNode, this.baseClass);
          },
          _local2NativeFormatNames: {},
          _native2LocalFormatNames: {},
          _getIframeDocTxt: function() {
            var a = d.getComputedStyle(this.domNode),
              b;
            if (this["aria-label"]) b = this["aria-label"];
            else {
              var c =
                u('label[for\x3d"' + this.id + '"]', this.ownerDocument)[0] ||
                f.byId(this["aria-labelledby"], this.ownerDocument);
              c && (b = c.textContent || c.innerHTML || "");
            }
            var c =
                "\x3cdiv id\x3d'dijitEditorBody' role\x3d'textbox' aria-multiline\x3d'true' " +
                (b ? " aria-label\x3d'" + x.escape(b) + "'" : "") +
                "\x3e\x3c/div\x3e",
              e = [a.fontWeight, a.fontSize, a.fontFamily].join(" "),
              g = a.lineHeight,
              g =
                0 <= g.indexOf("px")
                  ? parseFloat(g) / parseFloat(a.fontSize)
                  : 0 <= g.indexOf("em")
                  ? parseFloat(g)
                  : "normal",
              k = "",
              h = this;
            this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/gi, function(a) {
              a = a.replace(/^;/gi, "") + ";";
              var b = a.split(":")[0];
              if (b) {
                var b = r.trim(b),
                  b = b.toLowerCase(),
                  c,
                  e = "";
                for (c = 0; c < b.length; c++) {
                  var g = b.charAt(c);
                  switch (g) {
                    case "-":
                      c++, (g = b.charAt(c).toUpperCase());
                    default:
                      e += g;
                  }
                }
                d.set(h.domNode, e, "");
              }
              k += a + ";";
            });
            this.iframe.setAttribute("title", b);
            return [
              "\x3c!DOCTYPE html\x3e",
              "\x3chtml lang\x3d'" +
                (this.lang || q.locale.replace(/-.*/, "")) +
                "'" +
                (this.isLeftToRight() ? "" : " dir\x3d'rtl'") +
                "\x3e\n",
              "\x3chead\x3e\n\x3cmeta http-equiv\x3d'Content-Type' content\x3d'text/html'\x3e\n",
              b ? "\x3ctitle\x3e" + x.escape(b) + "\x3c/title\x3e" : "",
              "\x3cstyle\x3e\n\tbody,html {\n\t\tbackground:transparent;\n\t\tpadding: 1px 0 0 0;\n\t\tmargin: -1px 0 0 0;\n\t}\n\tbody,html,#dijitEditorBody { outline: none; }html { height: 100%; width: 100%; overflow: hidden; }\n",
              this.height
                ? "\tbody,#dijitEditorBody { height: 100%; width: 100%; overflow: auto; }\n"
                : "\tbody,#dijitEditorBody { min-height: " +
                  this.minHeight +
                  "; width: 100%; overflow-x: auto; overflow-y: hidden; }\n",
              "\tbody{\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tright:0px;\n\t\tfont:",
              e,
              ";\n",
              this.height || p("opera") ? "" : "\t\tposition: fixed;\n",
              "\t\tline-height:",
              g,
              ";\n\t}\n\tp{ margin: 1em 0; }\n\tli \x3e ul:-moz-first-node, li \x3e ol:-moz-first-node{ padding-top: 1.2em; }\n",
              p("ie") || p("trident") || p("edge")
                ? ""
                : "\tli{ min-height:1.2em; }\n",
              "\x3c/style\x3e\n",
              this._applyEditingAreaStyleSheets(),
              "\n\x3c/head\x3e\n\x3cbody role\x3d'application'",
              b ? " aria-label\x3d'" + x.escape(b) + "'" : "",
              "onload\x3d'try{frameElement \x26\x26 frameElement._loadFunc(window,document)}catch(e){document.domain\x3d\"" +
                document.domain +
                "\";frameElement._loadFunc(window,document)}' ",
              "style\x3d'" + k + "'\x3e",
              c,
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
              var b = "", c = 0, d, g = E.get(this.ownerDocument);
              (d = a[c++]);

            )
              (d = new A(g.location, d).toString()),
                this.editingAreaStyleSheets.push(d),
                (b +=
                  '\x3clink rel\x3d"stylesheet" type\x3d"text/css" href\x3d"' +
                  d +
                  '"/\x3e');
            return b;
          },
          addStyleSheet: function(a) {
            var b = a.toString(),
              c = E.get(this.ownerDocument);
            if ("." === b.charAt(0) || ("/" !== b.charAt(0) && !a.host))
              b = new A(c.location, b).toString();
            -1 < l.indexOf(this.editingAreaStyleSheets, b) ||
              (this.editingAreaStyleSheets.push(b),
              this.onLoadDeferred.then(
                r.hitch(this, function() {
                  if (this.document.createStyleSheet)
                    this.document.createStyleSheet(b);
                  else {
                    var a = this.document.getElementsByTagName("head")[0],
                      c = this.document.createElement("link");
                    c.rel = "stylesheet";
                    c.type = "text/css";
                    c.href = b;
                    a.appendChild(c);
                  }
                })
              ));
          },
          removeStyleSheet: function(a) {
            var b = a.toString(),
              c = E.get(this.ownerDocument);
            if ("." === b.charAt(0) || ("/" !== b.charAt(0) && !a.host))
              b = new A(c.location, b).toString();
            a = l.indexOf(this.editingAreaStyleSheets, b);
            -1 !== a &&
              (delete this.editingAreaStyleSheets[a],
              u('link[href\x3d"' + b + '"]', this.window.document).orphan());
          },
          disabled: !1,
          _mozSettingProps: { styleWithCSS: !1 },
          _setDisabledAttr: function(a) {
            a = !!a;
            this._set("disabled", a);
            if (this.isLoaded) {
              var b = p("ie") && (this.isLoaded || !this.focusOnLoad);
              b && (this.editNode.unselectable = "on");
              this.editNode.contentEditable = !a;
              this.editNode.tabIndex = a ? "-1" : this.tabIndex;
              b &&
                this.defer(function() {
                  this.editNode && (this.editNode.unselectable = "off");
                });
              if (p("mozilla") && !a && this._mozSettingProps) {
                a = this._mozSettingProps;
                for (var c in a)
                  if (a.hasOwnProperty(c))
                    try {
                      this.document.execCommand(c, !1, a[c]);
                    } catch (O) {}
              }
              this._disabledOK = !0;
            }
          },
          onLoad: function(a) {
            this.window.__registeredWindow ||
              ((this.window.__registeredWindow = !0),
              (this._iframeRegHandle = H.registerIframe(this.iframe)));
            this.editNode = this.document.body.firstChild;
            var c = this;
            this.beforeIframeNode = b.place(
              "\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e",
              this.iframe,
              "before"
            );
            this.afterIframeNode = b.place(
              "\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e",
              this.iframe,
              "after"
            );
            this.iframe.onfocus = this.document.onfocus = function() {
              c.editNode.focus();
            };
            this.focusNode = this.editNode;
            var d = this.events.concat(this.captureEvents),
              e = this.iframe ? this.document : this.editNode;
            this.own.apply(
              this,
              l.map(
                d,
                function(a) {
                  var b = a.toLowerCase().replace(/^on/, "");
                  return t(e, b, r.hitch(this, a));
                },
                this
              )
            );
            this.own(t(e, "mouseup", r.hitch(this, "onClick")));
            p("ie") &&
              (this.own(
                t(this.document, "mousedown", r.hitch(this, "_onIEMouseDown"))
              ),
              (this.editNode.style.zoom = 1));
            p("webkit") &&
              ((this._webkitListener = this.own(
                t(this.document, "mouseup", r.hitch(this, "onDisplayChanged"))
              )[0]),
              this.own(
                t(
                  this.document,
                  "mousedown",
                  r.hitch(this, function(a) {
                    a = a.target;
                    !a ||
                      (a !== this.document.body && a !== this.document) ||
                      this.defer("placeCursorAtEnd");
                  })
                )
              ));
            if (p("ie"))
              try {
                this.document.execCommand(
                  "RespectVisibilityInDesign",
                  !0,
                  null
                );
              } catch (Q) {}
            this.isLoaded = !0;
            this.set("disabled", this.disabled);
            d = r.hitch(this, function() {
              this.setValue(a);
              this.onLoadDeferred &&
                !this.onLoadDeferred.isFulfilled() &&
                this.onLoadDeferred.resolve(!0);
              this.onDisplayChanged();
              this.focusOnLoad &&
                g(r.hitch(this, "defer", "focus", this.updateInterval));
              this.value = this.getValue(!0);
            });
            this.setValueDeferred ? this.setValueDeferred.then(d) : d();
          },
          onKeyDown: function(a) {
            if (
              a.keyCode === k.SHIFT ||
              a.keyCode === k.ALT ||
              a.keyCode === k.META ||
              a.keyCode === k.CTRL
            )
              return !0;
            a.keyCode === k.TAB &&
              this.isTabIndent &&
              (a.stopPropagation(),
              a.preventDefault(),
              this.queryCommandEnabled(a.shiftKey ? "outdent" : "indent") &&
                this.execCommand(a.shiftKey ? "outdent" : "indent"));
            if (
              a.keyCode == k.TAB &&
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
            9 > p("ie") &&
              a.keyCode === k.BACKSPACE &&
              "Control" === this.document.selection.type &&
              (a.stopPropagation(),
              a.preventDefault(),
              this.execCommand("delete"));
            p("ff") &&
              (a.keyCode === k.PAGE_UP || a.keyCode === k.PAGE_DOWN) &&
              this.editNode.clientHeight >= this.editNode.scrollHeight &&
              a.preventDefault();
            var b = this._keyHandlers[a.keyCode],
              c = arguments;
            b &&
              !a.altKey &&
              l.some(
                b,
                function(b) {
                  if (
                    !(b.shift ^ a.shiftKey || b.ctrl ^ (a.ctrlKey || a.metaKey))
                  )
                    return b.handler.apply(this, c) || a.preventDefault(), !0;
                },
                this
              );
            this.defer("onKeyPressed", 1);
            return !0;
          },
          onKeyUp: function() {},
          setDisabled: function(a) {
            q.deprecated(
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
              ? a.set(this.document.body, "spellcheck", !b)
              : this.onLoadDeferred.then(
                  r.hitch(this, function() {
                    a.set(this.document.body, "spellcheck", !b);
                  })
                );
            this._set("disableSpellCheck", b);
          },
          addKeyHandler: function(a, b, c, d) {
            "string" == typeof a && (a = a.toUpperCase().charCodeAt(0));
            r.isArray(this._keyHandlers[a]) || (this._keyHandlers[a] = []);
            this._keyHandlers[a].push({
              shift: c || !1,
              ctrl: b || !1,
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
            (p("ie") || p("trident")) &&
              this.defer(function() {
                H.curNode || this.ownerDocumentBody.focus();
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
            !p("ie") &&
            this.window.document.documentElement &&
            this.window.document.documentElement.focus
              ? this.window.document.documentElement.focus()
              : this.ownerDocumentBody.focus && this.ownerDocumentBody.focus();
          },
          focus: function() {
            this.isLoaded
              ? 9 > p("ie")
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
              ? p("safari") && void 0 === b && (a = "heading")
              : "hilitecolor" !== a || p("mozilla") || (a = "backcolor");
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
                return p("ie") || p("trident") || p("edge");
              case "inserttable":
              case "insertcell":
              case "insertcol":
              case "insertrow":
              case "deletecells":
              case "deletecols":
              case "deleterows":
              case "mergecells":
              case "splitcell":
                return !p("webkit");
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
                (p("ie") || p("trident")) &&
                (b = "\x3c" + b + "\x3e");
            }
            var d = "_" + a + "Impl";
            if (this[d]) c = this[d](b);
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
            } catch (N) {
              return !1;
            }
          },
          queryCommandValue: function(a) {
            if (this.disabled || !this._disabledOK) return !1;
            a = this._normalizeCommand(a);
            if (p("ie") && "formatblock" === a)
              a = this._native2LocalFormatNames[
                this.document.queryCommandValue(a)
              ];
            else if (p("mozilla") && "hilitecolor" === a) {
              var b;
              try {
                b = this.document.queryCommandValue("styleWithCSS");
              } catch (M) {
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
            if (p("mozilla"))
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
            if (p("mozilla"))
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
          setValue: function(a) {
            if (this.isLoaded) {
              if (!this.textarea || (!this.isClosed && this.isLoaded)) {
                a = this._preFilterContent(a);
                var b = this.isClosed ? this.domNode : this.editNode;
                b.innerHTML = a;
                this._preDomFilterContent(b);
              } else this.textarea.value = a;
              this.onDisplayChanged();
              this._set("value", this.getValue(!0));
            } else
              this.onLoadDeferred.then(
                r.hitch(this, function() {
                  this.setValue(a);
                })
              );
          },
          replaceValue: function(a) {
            this.isClosed
              ? this.setValue(a)
              : this.window && this.window.getSelection && !p("mozilla")
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
            l.forEach(this.contentPreFilters, function(a) {
              a && (b = a(b));
            });
            return b;
          },
          _preDomFilterContent: function(a) {
            a = a || this.editNode;
            l.forEach(
              this.contentDomPreFilters,
              function(b) {
                b && r.isFunction(b) && b(a);
              },
              this
            );
          },
          _postFilterContent: function(a, b) {
            var c;
            r.isString(a)
              ? (c = a)
              : ((a = a || this.editNode),
                this.contentDomPostFilters.length &&
                  (b && (a = r.clone(a)),
                  l.forEach(this.contentDomPostFilters, function(b) {
                    a = b(a);
                  })),
                (c = z.getChildrenHtml(a)));
            r.trim(c.replace(/^\xA0\xA0*/, "").replace(/\xA0\xA0*$/, ""))
              .length || (c = "");
            l.forEach(this.contentPostFilters, function(a) {
              c = a(c);
            });
            return c;
          },
          _saveContent: function() {
            var a = f.byId(J._scopeName + "._editor.RichText.value");
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
            q.deprecated(
              "dijit.Editor::getNodeHtml is deprecated",
              "use dijit/_editor/html::getNodeHtml instead",
              2
            );
            return z.getNodeHtml(a);
          },
          getNodeChildrenHtml: function(a) {
            q.deprecated(
              "dijit.Editor::getNodeChildrenHtml is deprecated",
              "use dijit/_editor/html::getChildrenHtml instead",
              2
            );
            return z.getChildrenHtml(a);
          },
          close: function(a) {
            if (!this.isClosed) {
              arguments.length || (a = !0);
              a && this._set("value", this.getValue(!0));
              this.interval && clearInterval(this.interval);
              this._webkitListener &&
                (this._webkitListener.remove(), delete this._webkitListener);
              p("ie") && (this.iframe.onfocus = null);
              this.iframe._loadFunc = null;
              this._iframeRegHandle &&
                (this._iframeRegHandle.remove(), delete this._iframeRegHandle);
              if (this.textarea) {
                var d = this.textarea.style;
                d.position = "";
                d.left = d.top = "";
                p("ie") &&
                  ((d.overflow = this.__overflow), (this.__overflow = null));
                this.textarea.value = this.value;
                b.destroy(this.domNode);
                this.domNode = this.textarea;
              } else this.domNode.innerHTML = this.value;
              delete this.iframe;
              c.remove(this.domNode, this.baseClass);
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
            B._globalSaveHandler && delete B._globalSaveHandler[this.id];
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
            if (p("ie") || p("trident") || p("edge"))
              return this.focused && !this.disabled;
            var b =
              9 > p("ie")
                ? this.document.selection.createRange()
                : this.document;
            try {
              return b.queryCommandEnabled(a);
            } catch (M) {
              return !1;
            }
          },
          _createlinkEnabledImpl: function() {
            var a = !0;
            return (a = p("opera")
              ? this.window.getSelection().isCollapsed
                ? !0
                : this.document.queryCommandEnabled("createlink")
              : this._browserQueryCommandEnabled("createlink"));
          },
          _unlinkEnabledImpl: function() {
            var a = !0;
            return (a =
              p("mozilla") ||
              p("webkit") ||
              p("ie") ||
              p("trident") ||
              p("edge")
                ? this.selection.hasAncestorElement("a")
                : this._browserQueryCommandEnabled("unlink"));
          },
          _inserttableEnabledImpl: function() {
            var a = !0;
            return (a =
              p("mozilla") || p("webkit")
                ? !0
                : this._browserQueryCommandEnabled("inserttable"));
          },
          _cutEnabledImpl: function() {
            var a = !0;
            p("webkit")
              ? ((a = this.window.getSelection()) && (a = a.toString()),
                (a = !!a))
              : (a = this._browserQueryCommandEnabled("cut"));
            return a;
          },
          _copyEnabledImpl: function() {
            var a = !0;
            p("webkit")
              ? ((a = this.window.getSelection()) && (a = a.toString()),
                (a = !!a))
              : (a = this._browserQueryCommandEnabled("copy"));
            return a;
          },
          _pasteEnabledImpl: function() {
            var a = !0;
            return p("webkit")
              ? !0
              : (a = this._browserQueryCommandEnabled("paste"));
          },
          _inserthorizontalruleImpl: function(a) {
            return p("ie")
              ? this._inserthtmlImpl("\x3chr\x3e")
              : this.document.execCommand("inserthorizontalrule", !1, a);
          },
          _unlinkImpl: function(a) {
            return this.queryCommandEnabled("unlink") &&
              (p("mozilla") || p("webkit"))
              ? ((a = this.selection.getAncestorElement("a")),
                this.selection.selectElement(a),
                this.document.execCommand("unlink", !1, null))
              : this.document.execCommand("unlink", !1, a);
          },
          _hilitecolorImpl: function(a) {
            var b;
            this._handleTextColorOrProperties("hilitecolor", a) ||
              (p("mozilla")
                ? (this.document.execCommand("styleWithCSS", !1, !0),
                  console.log("Executing color command."),
                  (b = this.document.execCommand("hilitecolor", !1, a)),
                  this.document.execCommand("styleWithCSS", !1, !1))
                : (b = this.document.execCommand("hilitecolor", !1, a)));
            return b;
          },
          _backcolorImpl: function(a) {
            p("ie") && (a = a ? a : null);
            var b = this._handleTextColorOrProperties("backcolor", a);
            b || (b = this.document.execCommand("backcolor", !1, a));
            return b;
          },
          _forecolorImpl: function(a) {
            p("ie") && (a = a ? a : null);
            var b = !1;
            (b = this._handleTextColorOrProperties("forecolor", a)) ||
              (b = this.document.execCommand("forecolor", !1, a));
            return b;
          },
          _inserthtmlImpl: function(a) {
            a = this._preFilterContent(a);
            var c = !0;
            if (9 > p("ie")) {
              var d = this.document.selection.createRange();
              if ("CONTROL" === this.document.selection.type.toUpperCase()) {
                for (var e = d.item(0); d.length; ) d.remove(d.item(0));
                e.outerHTML = a;
              } else d.pasteHTML(a);
              d.select();
            } else if (8 > p("trident")) {
              var g = y.getSelection(this.window);
              if (g && g.rangeCount && g.getRangeAt) {
                d = g.getRangeAt(0);
                d.deleteContents();
                var f = b.create("div");
                f.innerHTML = a;
                for (
                  var k, e = this.document.createDocumentFragment();
                  (a = f.firstChild);

                )
                  k = e.appendChild(a);
                d.insertNode(e);
                k &&
                  ((d = d.cloneRange()),
                  d.setStartAfter(k),
                  d.collapse(!1),
                  g.removeAllRanges(),
                  g.addRange(d));
              }
            } else
              p("mozilla") && !a.length
                ? this.selection.remove()
                : (c = this.document.execCommand("inserthtml", !1, a));
            return c;
          },
          _boldImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("bold"));
            b || (b = this.document.execCommand("bold", !1, a));
            return b;
          },
          _italicImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("italic"));
            b || (b = this.document.execCommand("italic", !1, a));
            return b;
          },
          _underlineImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("underline"));
            b || (b = this.document.execCommand("underline", !1, a));
            return b;
          },
          _strikethroughImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("strikethrough"));
            b || (b = this.document.execCommand("strikethrough", !1, a));
            return b;
          },
          _superscriptImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("superscript"));
            b || (b = this.document.execCommand("superscript", !1, a));
            return b;
          },
          _subscriptImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident"))
              this._adaptIESelection(),
                (b = this._adaptIEFormatAreaAndExec("subscript"));
            b || (b = this.document.execCommand("subscript", !1, a));
            return b;
          },
          _fontnameImpl: function(a) {
            var b;
            if (p("ie") || p("trident"))
              b = this._handleTextColorOrProperties("fontname", a);
            b || (b = this.document.execCommand("fontname", !1, a));
            return b;
          },
          _fontsizeImpl: function(a) {
            var b;
            if (p("ie") || p("trident"))
              b = this._handleTextColorOrProperties("fontsize", a);
            b || (b = this.document.execCommand("fontsize", !1, a));
            return b;
          },
          _insertorderedlistImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident") || p("edge"))
              b = this._adaptIEList("insertorderedlist", a);
            b || (b = this.document.execCommand("insertorderedlist", !1, a));
            return b;
          },
          _insertunorderedlistImpl: function(a) {
            var b = !1;
            if (p("ie") || p("trident") || p("edge"))
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
                var d = e.position(a.childNodes[c]), b = b + d.h;
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
            var a = y.getSelection(this.window);
            if (a && a.rangeCount && !a.isCollapsed) {
              for (
                var b = a.getRangeAt(0),
                  c = b.startContainer,
                  d = b.startOffset;
                3 === c.nodeType && d >= c.length && c.nextSibling;

              )
                (d -= c.length), (c = c.nextSibling);
              for (var g = null; this._isNodeEmpty(c, d) && c !== g; )
                (g = c),
                  (b = this._removeStartingRangeFromRange(c, b)),
                  (c = b.startContainer),
                  (d = 0);
              a.removeAllRanges();
              a.addRange(b);
            }
          },
          _adaptIEFormatAreaAndExec: function(a) {
            var c = y.getSelection(this.window),
              d = this.document,
              g,
              e,
              p,
              f,
              k,
              q,
              h;
            if (a && c && c.isCollapsed) {
              if (this.queryCommandValue(a)) {
                a = this._tagNamesForCommand(a);
                p = c.getRangeAt(0);
                f = p.startContainer;
                3 === f.nodeType &&
                  ((e = p.endOffset),
                  f.length < e &&
                    ((e = this._adjustNodeAndOffset(g, e)),
                    (f = e.node),
                    (e = e.offset)));
                for (; f && f !== this.editNode; ) {
                  g = f.tagName ? f.tagName.toLowerCase() : "";
                  if (-1 < l.indexOf(a, g)) {
                    h = f;
                    break;
                  }
                  f = f.parentNode;
                }
                if (
                  h &&
                  ((g = p.startContainer),
                  (a = d.createElement(h.tagName)),
                  b.place(a, h, "after"),
                  g && 3 === g.nodeType)
                ) {
                  e = p.endOffset;
                  g.length < e &&
                    ((e = this._adjustNodeAndOffset(g, e)),
                    (g = e.node),
                    (e = e.offset));
                  f = g.nodeValue;
                  p = d.createTextNode(f.substring(0, e));
                  var z = f.substring(e, f.length);
                  z && (k = d.createTextNode(z));
                  b.place(p, g, "before");
                  k &&
                    ((q = d.createElement("span")),
                    (q.className = "ieFormatBreakerSpan"),
                    b.place(q, g, "after"),
                    b.place(k, q, "after"),
                    (k = q));
                  b.destroy(g);
                  e = p.parentNode;
                  for (g = []; e !== h; ) {
                    f = e.tagName;
                    p = { tagName: f };
                    g.push(p);
                    f = d.createElement(f);
                    e.style &&
                      f.style &&
                      e.style.cssText &&
                      ((f.style.cssText = e.style.cssText),
                      (p.cssText = e.style.cssText));
                    "FONT" === e.tagName &&
                      (e.color && ((f.color = e.color), (p.color = e.color)),
                      e.face && ((f.face = e.face), (p.face = e.face)),
                      e.size && ((f.size = e.size), (p.size = e.size)));
                    e.className &&
                      ((f.className = e.className),
                      (p.className = e.className));
                    if (k)
                      for (; k; )
                        (p = k.nextSibling), f.appendChild(k), (k = p);
                    f.tagName == e.tagName
                      ? ((q = d.createElement("span")),
                        (q.className = "ieFormatBreakerSpan"),
                        b.place(q, e, "after"),
                        b.place(f, q, "after"))
                      : b.place(f, e, "after");
                    p = e;
                    k = f;
                    e = e.parentNode;
                  }
                  if (k) {
                    if (1 === k.nodeType || (3 === k.nodeType && k.nodeValue))
                      a.innerHTML = "";
                    for (; k; ) (p = k.nextSibling), a.appendChild(k), (k = p);
                  }
                  if (g.length) {
                    p = g.pop();
                    k = d.createElement(p.tagName);
                    p.cssText && k.style && (k.style.cssText = p.cssText);
                    p.className && (k.className = p.className);
                    "FONT" === p.tagName &&
                      (p.color && (k.color = p.color),
                      p.face && (k.face = p.face),
                      p.size && (k.size = p.size));
                    for (b.place(k, a, "before"); g.length; )
                      (p = g.pop()),
                        (h = d.createElement(p.tagName)),
                        p.cssText && h.style && (h.style.cssText = p.cssText),
                        p.className && (h.className = p.className),
                        "FONT" === p.tagName &&
                          (p.color && (h.color = p.color),
                          p.face && (h.face = p.face),
                          p.size && (h.size = p.size)),
                        k.appendChild(h),
                        (k = h);
                    h = d.createTextNode(".");
                    q.appendChild(h);
                    k.appendChild(h);
                  } else
                    (q = d.createElement("span")),
                      (q.className = "ieFormatBreakerSpan"),
                      (h = d.createTextNode(".")),
                      q.appendChild(h),
                      b.place(q, a, "before");
                  k = y.create(this.window);
                  k.setStart(h, 0);
                  k.setEnd(h, h.length);
                  c.removeAllRanges();
                  c.addRange(k);
                  this.selection.collapse(!1);
                  h.parentNode.innerHTML = "";
                  a.firstChild || b.destroy(a);
                  return !0;
                }
                return !1;
              }
              p = c.getRangeAt(0);
              if ((g = p.startContainer) && 3 === g.nodeType)
                return (
                  (e = p.startOffset),
                  g.length < e &&
                    ((e = this._adjustNodeAndOffset(g, e)),
                    (g = e.node),
                    (e = e.offset)),
                  (f = g.nodeValue),
                  (p = d.createTextNode(f.substring(0, e))),
                  (z = f.substring(e)),
                  "" !== z && (k = d.createTextNode(f.substring(e))),
                  (q = d.createElement("span")),
                  (h = d.createTextNode(".")),
                  q.appendChild(h),
                  p.length ? b.place(p, g, "after") : (p = g),
                  b.place(q, p, "after"),
                  k && b.place(k, q, "after"),
                  b.destroy(g),
                  (k = y.create(this.window)),
                  k.setStart(h, 0),
                  k.setEnd(h, h.length),
                  c.removeAllRanges(),
                  c.addRange(k),
                  d.execCommand(a),
                  b.place(q.firstChild, q, "before"),
                  b.destroy(q),
                  k.setStart(h, 0),
                  k.setEnd(h, h.length),
                  c.removeAllRanges(),
                  c.addRange(k),
                  this.selection.collapse(!1),
                  (h.parentNode.innerHTML = ""),
                  !0
                );
            } else return !1;
          },
          _adaptIEList: function(a) {
            var c = y.getSelection(this.window);
            if (c.isCollapsed && c.rangeCount && !this.queryCommandValue(a)) {
              var d = c.getRangeAt(0),
                e = d.startContainer;
              if (e && 3 == e.nodeType && !d.startOffset)
                return (
                  (d = "ul"),
                  "insertorderedlist" === a && (d = "ol"),
                  (a = this.document.createElement(d)),
                  (d = b.create("li", null, a)),
                  b.place(a, e, "before"),
                  d.appendChild(e),
                  b.create("br", null, a, "after"),
                  (a = y.create(this.window)),
                  a.setStart(e, 0),
                  a.setEnd(e, e.length),
                  c.removeAllRanges(),
                  c.addRange(a),
                  this.selection.collapse(!0),
                  !0
                );
            }
            return !1;
          },
          _handleTextColorOrProperties: function(a, c) {
            var e = y.getSelection(this.window),
              g = this.document,
              f,
              k,
              q,
              h,
              z;
            c = c || null;
            if (
              a &&
              e &&
              e.isCollapsed &&
              e.rangeCount &&
              ((k = e.getRangeAt(0)),
              (f = k.startContainer) && 3 === f.nodeType)
            ) {
              z = k.startOffset;
              f.length < z &&
                ((k = this._adjustNodeAndOffset(f, z)),
                (f = k.node),
                (z = k.offset));
              q = f.nodeValue;
              k = g.createTextNode(q.substring(0, z));
              "" !== q.substring(z) && (h = g.createTextNode(q.substring(z)));
              q = g.createElement("span");
              z = g.createTextNode(".");
              q.appendChild(z);
              g = g.createElement("span");
              q.appendChild(g);
              k.length ? b.place(k, f, "after") : (k = f);
              b.place(q, k, "after");
              h && b.place(h, q, "after");
              b.destroy(f);
              f = y.create(this.window);
              f.setStart(z, 0);
              f.setEnd(z, z.length);
              e.removeAllRanges();
              e.addRange(f);
              if (p("webkit")) {
                e = "color";
                if ("hilitecolor" === a || "backcolor" === a)
                  e = "backgroundColor";
                d.set(q, e, c);
                this.selection.remove();
                b.destroy(g);
                q.innerHTML = "\x26#160;";
                this.selection.selectElement(q);
                this.focus();
              } else
                this.execCommand(a, c),
                  b.place(q.firstChild, q, "before"),
                  b.destroy(q),
                  f.setStart(z, 0),
                  f.setEnd(z, z.length),
                  e.removeAllRanges(),
                  e.addRange(f),
                  this.selection.collapse(!1),
                  z.parentNode.removeChild(z);
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
                u(".ieFormatBreakerSpan", a).forEach(function(a) {
                  for (; a.firstChild; ) b.place(a.firstChild, a, "before");
                  b.destroy(a);
                }),
                a
              );
          },
          _stripTrailingEmptyNodes: function(a) {
            function c(a) {
              return (
                (/^(p|div|br)$/i.test(a.nodeName) &&
                  0 == a.children.length &&
                  /^[\s\xA0]*$/.test(a.textContent || a.innerText || "")) ||
                (3 === a.nodeType && /^[\s\xA0]*$/.test(a.nodeValue))
              );
            }
            for (; a.lastChild && c(a.lastChild); ) b.destroy(a.lastChild);
            return a;
          },
          _setTextDirAttr: function(a) {
            this._set("textDir", a);
            this.onLoadDeferred.then(
              r.hitch(this, function() {
                this.editNode.dir = a;
              })
            );
          }
        });
        return B;
      });
    },
    "dijit/_editor/range": function() {
      define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang"
      ], function(l, n, h) {
        var m = {
          getIndex: function(a, b) {
            for (var c = [], d = [], f = a, k, h; a != b; ) {
              var l = 0;
              for (k = a.parentNode; (h = k.childNodes[l++]); )
                if (h === a) {
                  --l;
                  break;
                }
              c.unshift(l);
              d.unshift(l - k.childNodes.length);
              a = k;
            }
            if (0 < c.length && 3 == f.nodeType) {
              for (h = f.previousSibling; h && 3 == h.nodeType; )
                c[c.length - 1]--, (h = h.previousSibling);
              for (h = f.nextSibling; h && 3 == h.nodeType; )
                d[d.length - 1]++, (h = h.nextSibling);
            }
            return { o: c, r: d };
          },
          getNode: function(a, b) {
            if (!h.isArray(a) || 0 == a.length) return b;
            var c = b;
            l.every(a, function(a) {
              if (0 <= a && a < c.childNodes.length) c = c.childNodes[a];
              else return (c = null), !1;
              return !0;
            });
            return c;
          },
          getCommonAncestor: function(a, b, e) {
            e = e || a.ownerDocument.body;
            var c = function(a) {
              for (var b = []; a; )
                if ((b.unshift(a), a !== e)) a = a.parentNode;
                else break;
              return b;
            };
            a = c(a);
            b = c(b);
            for (
              var c = Math.min(a.length, b.length), f = a[0], k = 1;
              k < c;
              k++
            )
              if (a[k] === b[k]) f = a[k];
              else break;
            return f;
          },
          getAncestor: function(a, b, e) {
            for (e = e || a.ownerDocument.body; a && a !== e; ) {
              var c = a.nodeName.toUpperCase();
              if (b.test(c)) return a;
              a = a.parentNode;
            }
            return null;
          },
          BlockTagNames: /^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/,
          getBlockAncestor: function(a, b, e) {
            e = e || a.ownerDocument.body;
            b = b || m.BlockTagNames;
            for (var c = null, f; a && a !== e; ) {
              var k = a.nodeName.toUpperCase();
              !c && b.test(k) && (c = a);
              !f && /^(?:BODY|TD|TH|CAPTION)$/.test(k) && (f = a);
              a = a.parentNode;
            }
            return { blockNode: c, blockContainer: f || a.ownerDocument.body };
          },
          atBeginningOfContainer: function(a, b, e) {
            var c = !1,
              f = 0 == e;
            f ||
              3 != b.nodeType ||
              (/^[\s\xA0]+$/.test(b.nodeValue.substr(0, e)) && (f = !0));
            if (f)
              for (c = !0; b && b !== a; ) {
                if (b.previousSibling) {
                  c = !1;
                  break;
                }
                b = b.parentNode;
              }
            return c;
          },
          atEndOfContainer: function(a, b, e) {
            var c = !1,
              f = e == (b.length || b.childNodes.length);
            f ||
              3 != b.nodeType ||
              (/^[\s\xA0]+$/.test(b.nodeValue.substr(e)) && (f = !0));
            if (f)
              for (c = !0; b && b !== a; ) {
                if (b.nextSibling) {
                  c = !1;
                  break;
                }
                b = b.parentNode;
              }
            return c;
          },
          adjacentNoneTextNode: function(a, b) {
            var c = a;
            a = 0 - a.length || 0;
            for (
              b = b ? "nextSibling" : "previousSibling";
              c && 3 == c.nodeType;

            )
              (a += c.length), (c = c[b]);
            return [c, a];
          },
          create: function(c) {
            c = c || window;
            return c.getSelection ? c.document.createRange() : new a();
          },
          getSelection: function(a, b) {
            if (a.getSelection) return a.getSelection();
            a = new f.selection(a);
            b || a._getCurrentSelection();
            return a;
          }
        };
        if (!window.getSelection)
          var f = (m.ie = {
              cachedSelection: {},
              selection: function(c) {
                this._ranges = [];
                this.addRange = function(a, c) {
                  this._ranges.push(a);
                  c || a._select();
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
                  var b;
                  b = c.document.selection.createRange();
                  b =
                    "CONTROL" == c.document.selection.type.toUpperCase()
                      ? new a(f.decomposeControlRange(b))
                      : new a(f.decomposeTextRange(b));
                  this.addRange(b, !0), (this.isCollapsed = b.collapsed);
                };
              },
              decomposeControlRange: function(a) {
                var b = a.item(0),
                  c = a.item(a.length - 1);
                a = b.parentNode;
                var d = c.parentNode,
                  b = m.getIndex(b, a).o[0],
                  c = m.getIndex(c, d).o[0] + 1;
                return [a, b, d, c];
              },
              getEndPoint: function(a, b) {
                var c = a.duplicate();
                c.collapse(!b);
                var d = "EndTo" + (b ? "End" : "Start"),
                  f = c.parentElement(),
                  k,
                  h,
                  n;
                0 < f.childNodes.length
                  ? l.every(f.childNodes, function(b, g) {
                      var e;
                      if (3 != b.nodeType)
                        if (
                          (c.moveToElementText(b), 0 < c.compareEndPoints(d, a))
                        )
                          if (n && 3 == n.nodeType) (k = n), (e = !0);
                          else return (k = f), (h = g), !1;
                        else {
                          if (g == f.childNodes.length - 1)
                            return (k = f), (h = f.childNodes.length), !1;
                        }
                      else g == f.childNodes.length - 1 && ((k = b), (e = !0));
                      if (e && k)
                        return (
                          (k = (b = m.adjacentNoneTextNode(k)[0])
                            ? b.nextSibling
                            : f.firstChild),
                          (g = m.adjacentNoneTextNode(k)),
                          (b = g[0]),
                          (g = g[1]),
                          b
                            ? (c.moveToElementText(b), c.collapse(!1))
                            : c.moveToElementText(f),
                          c.setEndPoint(d, a),
                          (h = c.text.length - g),
                          !1
                        );
                      n = b;
                      return !0;
                    })
                  : ((k = f), (h = 0));
                b ||
                  1 != k.nodeType ||
                  h != k.childNodes.length ||
                  ((b = k.nextSibling) &&
                    3 == b.nodeType &&
                    ((k = b), (h = 0)));
                return [k, h];
              },
              setEndPoint: function(a, b, e) {
                a = a.duplicate();
                var c;
                if (3 != b.nodeType)
                  if (0 < e) {
                    if ((c = b.childNodes[e - 1]))
                      if (3 == c.nodeType) (b = c), (e = c.length);
                      else if (c.nextSibling && 3 == c.nextSibling.nodeType)
                        (b = c.nextSibling), (e = 0);
                      else {
                        a.moveToElementText(c.nextSibling ? c : b);
                        var f = c.parentNode;
                        c = f.insertBefore(
                          c.ownerDocument.createTextNode(" "),
                          c.nextSibling
                        );
                        a.collapse(!1);
                        f.removeChild(c);
                      }
                  } else a.moveToElementText(b), a.collapse(!0);
                3 == b.nodeType &&
                  ((c = m.adjacentNoneTextNode(b)),
                  (f = c[0]),
                  (c = c[1]),
                  f
                    ? (a.moveToElementText(f),
                      a.collapse(!1),
                      "inherit" != f.contentEditable && c++)
                    : (a.moveToElementText(b.parentNode),
                      a.collapse(!0),
                      a.move("character", 1),
                      a.move("character", -1)),
                  (e += c),
                  0 < e &&
                    a.move("character", e) != e &&
                    console.error("Error when moving!"));
                return a;
              },
              decomposeTextRange: function(a) {
                var b = f.getEndPoint(a),
                  c = b[0],
                  d = b[1],
                  h = b[0],
                  b = b[1];
                a.htmlText.length &&
                  (a.htmlText == a.text
                    ? (b = d + a.text.length)
                    : ((b = f.getEndPoint(a, !0)), (h = b[0]), (b = b[1])));
                return [c, d, h, b];
              },
              setRange: function(a, b, e, d, h, k) {
                b = f.setEndPoint(a, b, e);
                a.setEndPoint("StartToStart", b);
                if (!k) var c = f.setEndPoint(a, d, h);
                a.setEndPoint("EndToEnd", c || b);
                return a;
              }
            }),
            a = (m.W3CRange = n(null, {
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
                    ? m.getCommonAncestor(
                        this.startContainer,
                        this.endContainer
                      )
                    : this.startContainer;
                this.collapsed =
                  this.startContainer === this.endContainer &&
                  this.startOffset == this.endOffset;
              },
              setStart: function(a, b) {
                b = parseInt(b);
                if (this.startContainer !== a || this.startOffset != b)
                  delete this._cachedBookmark,
                    (this.startContainer = a),
                    (this.startOffset = b),
                    this.endContainer
                      ? this._updateInternal()
                      : this.setEnd(a, b);
              },
              setEnd: function(a, b) {
                b = parseInt(b);
                if (this.endContainer !== a || this.endOffset != b)
                  delete this._cachedBookmark,
                    (this.endContainer = a),
                    (this.endOffset = b),
                    this.startContainer
                      ? this._updateInternal()
                      : this.setStart(a, b);
              },
              setStartAfter: function(a, b) {
                this._setPoint("setStart", a, b, 1);
              },
              setStartBefore: function(a, b) {
                this._setPoint("setStart", a, b, 0);
              },
              setEndAfter: function(a, b) {
                this._setPoint("setEnd", a, b, 1);
              },
              setEndBefore: function(a, b) {
                this._setPoint("setEnd", a, b, 0);
              },
              _setPoint: function(a, b, e, d) {
                e = m.getIndex(b, b.parentNode).o;
                this[a](b.parentNode, e.pop() + d);
              },
              _getIERange: function() {
                var a = (
                  this._body || this.endContainer.ownerDocument.body
                ).createTextRange();
                f.setRange(
                  a,
                  this.startContainer,
                  this.startOffset,
                  this.endContainer,
                  this.endOffset,
                  this.collapsed
                );
                return a;
              },
              getBookmark: function() {
                this._getIERange();
                return this._cachedBookmark;
              },
              _select: function() {
                this._getIERange().select();
              },
              deleteContents: function() {
                var a = this.startContainer,
                  b = this._getIERange();
                3 !== a.nodeType || this.startOffset || this.setStartBefore(a);
                b.pasteHTML("");
                this.endContainer = this.startContainer;
                this.endOffset = this.startOffset;
                this.collapsed = !0;
              },
              cloneRange: function() {
                var c = new a([
                  this.startContainer,
                  this.startOffset,
                  this.endContainer,
                  this.endOffset
                ]);
                c._body = this._body;
                return c;
              },
              detach: function() {
                this.startContainer = this.commonAncestorContainer = this._body = null;
                this.startOffset = 0;
                this.endContainer = null;
                this.endOffset = 0;
                this.collapsed = !0;
              }
            }));
        h.setObject("dijit.range", m);
        return m;
      });
    },
    "dijit/_editor/html": function() {
      define(["dojo/_base/array", "dojo/_base/lang", "dojo/sniff"], function(
        l,
        n,
        h
      ) {
        var m = {};
        n.setObject("dijit._editor.html", m);
        var f = (m.escapeXml = function(a, c) {
          a = a
            .replace(/&/gm, "\x26amp;")
            .replace(/</gm, "\x26lt;")
            .replace(/>/gm, "\x26gt;")
            .replace(/"/gm, "\x26quot;");
          c || (a = a.replace(/'/gm, "\x26#39;"));
          return a;
        });
        m.getNodeHtml = function(a) {
          var c = [];
          m.getNodeHtmlHelper(a, c);
          return c.join("");
        };
        m.getNodeHtmlHelper = function(a, c) {
          switch (a.nodeType) {
            case 1:
              var b = a.nodeName.toLowerCase();
              if (!b || "/" == b.charAt(0)) return "";
              c.push("\x3c", b);
              var e = [],
                d = {},
                q;
              if (
                h("dom-attributes-explicit") ||
                h("dom-attributes-specified-flag")
              )
                for (var k = 0; (q = a.attributes[k++]); ) {
                  var n = q.name;
                  "_dj" === n.substr(0, 3) ||
                    (h("dom-attributes-specified-flag") && !q.specified) ||
                    n in d ||
                    ((q = q.value),
                    ("src" == n || "href" == n) &&
                      a.getAttribute("_djrealurl") &&
                      (q = a.getAttribute("_djrealurl")),
                    8 === h("ie") &&
                      "style" === n &&
                      (q = q
                        .replace("HEIGHT:", "height:")
                        .replace("WIDTH:", "width:")),
                    e.push([n, q]),
                    (d[n] = q));
                }
              else {
                var t = (/^input$|^img$/i.test(a.nodeName)
                    ? a
                    : a.cloneNode(!1)
                  ).outerHTML,
                  d = t.match(/[\w-]+=("[^"]*"|'[^']*'|\S*)/gi),
                  t = t.substr(0, t.indexOf("\x3e"));
                l.forEach(
                  d,
                  function(c) {
                    if (c) {
                      var d = c.indexOf("\x3d");
                      if (
                        0 < d &&
                        ((c = c.substring(0, d)), "_dj" != c.substr(0, 3))
                      )
                        if (
                          ("src" != c && "href" != c) ||
                          !a.getAttribute("_djrealurl")
                        ) {
                          var f;
                          switch (c) {
                            case "style":
                              f = a.style.cssText.toLowerCase();
                              break;
                            case "class":
                              f = a.className;
                              break;
                            case "width":
                              if ("img" === b) {
                                (d = /width=(\S+)/i.exec(t)) && (f = d[1]);
                                break;
                              }
                            case "height":
                              if ("img" === b) {
                                (d = /height=(\S+)/i.exec(t)) && (f = d[1]);
                                break;
                              }
                            default:
                              f = a.getAttribute(c);
                          }
                          null != f && e.push([c, f.toString()]);
                        } else e.push([c, a.getAttribute("_djrealurl")]);
                    }
                  },
                  this
                );
              }
              e.sort(function(a, b) {
                return a[0] < b[0] ? -1 : a[0] == b[0] ? 0 : 1;
              });
              for (d = 0; (q = e[d++]); )
                c.push(
                  " ",
                  q[0],
                  '\x3d"',
                  "string" === typeof q[1] ? f(q[1], !0) : q[1],
                  '"'
                );
              switch (b) {
                case "br":
                case "hr":
                case "img":
                case "input":
                case "base":
                case "meta":
                case "area":
                case "basefont":
                  c.push(" /\x3e");
                  break;
                case "script":
                  c.push("\x3e", a.innerHTML, "\x3c/", b, "\x3e");
                  break;
                default:
                  c.push("\x3e"),
                    a.hasChildNodes() && m.getChildrenHtmlHelper(a, c),
                    c.push("\x3c/", b, "\x3e");
              }
              break;
            case 4:
            case 3:
              c.push(f(a.nodeValue, !0));
              break;
            case 8:
              c.push("\x3c!--", f(a.nodeValue, !0), "--\x3e");
              break;
            default:
              c.push(
                "\x3c!-- Element not recognized - Type: ",
                a.nodeType,
                " Name: ",
                a.nodeName,
                "--\x3e"
              );
          }
        };
        m.getChildrenHtml = function(a) {
          var c = [];
          m.getChildrenHtmlHelper(a, c);
          return c.join("");
        };
        m.getChildrenHtmlHelper = function(a, c) {
          if (a)
            for (
              var b = a.childNodes || a, e = !h("ie") || b !== a, d, f = 0;
              (d = b[f++]);

            )
              (e && d.parentNode != a) || m.getNodeHtmlHelper(d, c);
        };
        return m;
      });
    },
    "dijit/_editor/plugins/LinkDialog": function() {
      define("require dojo/_base/declare dojo/dom-attr dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/query dojo/string ../_Plugin ../../form/DropDownButton ../range".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k) {
        var r = n("dijit._editor.plugins.LinkDialog", d, {
            buttonClass: q,
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
              this.button.loadDropDown = f.hitch(this, "_loadDropDown");
              this._connectTagEvents();
            },
            _loadDropDown: function(b) {
              l(
                "dojo/i18n ../../TooltipDialog ../../registry ../../form/Button ../../form/Select ../../form/ValidationTextBox dojo/i18n!../../nls/common dojo/i18n!../nls/LinkDialog".split(
                  " "
                ),
                f.hitch(this, function(c, d, k) {
                  var g = this;
                  this.tag = "insertImage" == this.command ? "img" : "a";
                  c = f.delegate(
                    c.getLocalization("dijit", "common", this.lang),
                    c.getLocalization("dijit._editor", "LinkDialog", this.lang)
                  );
                  var p = (this.dropDown = this.button.dropDown = new d({
                    title: c[this.command + "Title"],
                    ownerDocument: this.editor.ownerDocument,
                    dir: this.editor.dir,
                    execute: f.hitch(this, "setValue"),
                    onOpen: function() {
                      g._onOpenDialog();
                      d.prototype.onOpen.apply(this, arguments);
                    },
                    onCancel: function() {
                      setTimeout(f.hitch(g, "_onCloseDialog"), 0);
                    }
                  }));
                  c.urlRegExp = this.urlRegExp;
                  c.id = k.getUniqueId(this.editor.id);
                  this._uniqueId = c.id;
                  this._setContent(
                    p.title +
                      "\x3cdiv style\x3d'border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'\x3e\x3c/div\x3e" +
                      e.substitute(this.linkDialogTemplate, c)
                  );
                  p.startup();
                  this._urlInput = k.byId(this._uniqueId + "_urlInput");
                  this._textInput = k.byId(this._uniqueId + "_textInput");
                  this._setButton = k.byId(this._uniqueId + "_setButton");
                  this.own(
                    k
                      .byId(this._uniqueId + "_cancelButton")
                      .on("click", f.hitch(this.dropDown, "onCancel"))
                  );
                  this._urlInput &&
                    this.own(
                      this._urlInput.on(
                        "change",
                        f.hitch(this, "_checkAndFixInput")
                      )
                    );
                  this._textInput &&
                    this.own(
                      this._textInput.on(
                        "change",
                        f.hitch(this, "_checkAndFixInput")
                      )
                    );
                  this._urlRegExp = new RegExp("^" + this.urlRegExp + "$", "i");
                  this._emailRegExp = new RegExp(
                    "^" + this.emailRegExp + "$",
                    "i"
                  );
                  this._urlInput.isValid = f.hitch(this, function() {
                    var a = this._urlInput.get("value");
                    return this._urlRegExp.test(a) || this._emailRegExp.test(a);
                  });
                  this.own(
                    a(
                      p.domNode,
                      "keydown",
                      f.hitch(
                        this,
                        f.hitch(this, function(a) {
                          !a ||
                            a.keyCode != m.ENTER ||
                            a.shiftKey ||
                            a.metaKey ||
                            a.ctrlKey ||
                            a.altKey ||
                            this._setButton.get("disabled") ||
                            (p.onExecute(), p.execute(p.get("value")));
                        })
                      )
                    )
                  );
                  b();
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
                  d = !1,
                  e = !1;
                c &&
                  1 < c.length &&
                  ((c = f.trim(c)),
                  0 !== c.indexOf("mailto:") &&
                    (0 < c.indexOf("/")
                      ? -1 === c.indexOf("://") &&
                        "/" !== c.charAt(0) &&
                        c.indexOf("./") &&
                        0 !== c.indexOf("../") &&
                        a._hostRxp.test(c) &&
                        (d = !0)
                      : a._userAtRxp.test(c) && (e = !0)));
                d && a._urlInput.set("value", "http://" + c);
                e && a._urlInput.set("value", "mailto:" + c);
                a._setButton.set("disabled", !a._isValid());
              }, 250);
            },
            _connectTagEvents: function() {
              this.editor.onLoadDeferred.then(
                f.hitch(this, function() {
                  this.own(
                    a(
                      this.editor.editNode,
                      "mouseup",
                      f.hitch(this, "_onMouseUp")
                    )
                  );
                  this.own(
                    a(
                      this.editor.editNode,
                      "dblclick",
                      f.hitch(this, "_onDblClick")
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
              if (9 > c("ie")) {
                var d = k.getSelection(this.editor.window).getRangeAt(0)
                  .endContainer;
                3 === d.nodeType && (d = d.parentNode);
                d &&
                  d.nodeName &&
                  d.nodeName.toLowerCase() !== this.tag &&
                  (d = this.editor.selection.getSelectedElement(this.tag));
                d &&
                  d.nodeName &&
                  d.nodeName.toLowerCase() === this.tag &&
                  this.editor.queryCommandEnabled("unlink") &&
                  (this.editor.selection.selectElementChildren(d),
                  this.editor.execCommand("unlink"));
              }
              a = this._checkValues(a);
              this.editor.execCommand(
                "inserthtml",
                e.substitute(this.htmlTemplate, a)
              );
              b("a", this.editor.document).forEach(function(a) {
                a.innerHTML || h.has(a, "name") || a.parentNode.removeChild(a);
              }, this);
            },
            _onCloseDialog: function() {
              this.editor.focused && this.editor.focus();
            },
            _getCurrentValues: function(a) {
              var b, c, d;
              a && a.tagName.toLowerCase() === this.tag
                ? ((b = a.getAttribute("_djrealurl") || a.getAttribute("href")),
                  (d = a.getAttribute("target") || "_self"),
                  (c = a.textContent || a.innerText),
                  this.editor.selection.selectElement(a, !0))
                : (c = this.editor.selection.getSelectedText());
              return {
                urlInput: b || "",
                textInput: c || "",
                targetSelect: d || ""
              };
            },
            _onOpenDialog: function() {
              var a, b;
              if (c("ie")) {
                if (((b = k.getSelection(this.editor.window)), b.rangeCount)) {
                  var d = b.getRangeAt(0);
                  a = d.endContainer;
                  3 === a.nodeType && (a = a.parentNode);
                  a &&
                    a.nodeName &&
                    a.nodeName.toLowerCase() !== this.tag &&
                    (a = this.editor.selection.getSelectedElement(this.tag));
                  if (
                    !a ||
                    (a.nodeName && a.nodeName.toLowerCase() !== this.tag)
                  )
                    (b = this.editor.selection.getAncestorElement(this.tag)) &&
                    b.nodeName &&
                    b.nodeName.toLowerCase() == this.tag
                      ? ((a = b), this.editor.selection.selectElement(a))
                      : d.startContainer === d.endContainer &&
                        (b = d.startContainer.firstChild) &&
                        b.nodeName &&
                        b.nodeName.toLowerCase() == this.tag &&
                        ((a = b), this.editor.selection.selectElement(a));
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
              if (c("ff")) {
                var a = this.editor.selection.getAncestorElement(this.tag);
                if (a) {
                  var b = k.getSelection(this.editor.window).getRangeAt(0);
                  if (b.collapsed && a.childNodes.length) {
                    var d = b.cloneRange();
                    d.selectNodeContents(a.childNodes[a.childNodes.length - 1]);
                    d.setStart(a.childNodes[0], 0);
                    1 !== b.compareBoundaryPoints(d.START_TO_START, d)
                      ? b.setStartBefore(a)
                      : -1 !== b.compareBoundaryPoints(d.END_TO_START, d) &&
                        b.setStartAfter(a);
                  }
                }
              }
            }
          }),
          t = n("dijit._editor.plugins.ImgLinkDialog", [r], {
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
                f.hitch(this, function() {
                  this.own(
                    a(
                      this.editor.editNode,
                      "mousedown",
                      f.hitch(this, "_selectTag")
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
        d.registry.createLink = function() {
          return new r({ command: "createLink" });
        };
        d.registry.insertImage = function() {
          return new t({ command: "insertImage" });
        };
        r.ImgLinkDialog = t;
        return r;
      });
    },
    "dijit/_editor/plugins/ViewSource": function() {
      define("dojo/_base/array dojo/aspect dojo/_base/declare dojo/dom-attr dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/i18n dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/window ../../focus ../_Plugin ../../form/ToggleButton ../.. ../../registry dojo/i18n!../nls/commands".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g, p, x) {
        var w = h("dijit._editor.plugins.ViewSource", u, {
          stripScripts: !0,
          stripComments: !0,
          stripIFrames: !0,
          stripEventHandlers: !0,
          readOnly: !1,
          _fsPlugin: null,
          toggle: function() {
            k("webkit") && (this._vsFocused = !0);
            this.button.set("checked", !this.button.get("checked"));
          },
          _initButton: function() {
            var a = b.getLocalization("dijit._editor", "commands"),
              c = this.editor;
            this.button = new g({
              label: a.viewSource,
              ownerDocument: c.ownerDocument,
              dir: c.dir,
              lang: c.lang,
              showLabel: !1,
              iconClass:
                this.iconClassPrefix +
                " " +
                this.iconClassPrefix +
                "ViewSource",
              tabIndex: "-1",
              onChange: d.hitch(this, "_showSource")
            });
            this.button.set("readOnly", !1);
          },
          setEditor: function(a) {
            this.editor = a;
            this._initButton();
            this.editor.addKeyHandler(
              e.F12,
              !0,
              !0,
              d.hitch(this, function(a) {
                this.button.focus();
                this.toggle();
                a.stopPropagation();
                a.preventDefault();
                setTimeout(
                  d.hitch(this, function() {
                    this.editor.focused && this.editor.focus();
                  }),
                  100
                );
              })
            );
          },
          _showSource: function(a) {
            var b = this.editor,
              e = b._plugins,
              g;
            this._sourceShown = a;
            var f = this;
            try {
              this.sourceArea || this._createSourceView();
              if (a)
                (b._sourceQueryCommandEnabled = b.queryCommandEnabled),
                  (b.queryCommandEnabled = function(a) {
                    return "viewsource" === a.toLowerCase();
                  }),
                  this.editor.onDisplayChanged(),
                  (g = b.get("value")),
                  (g = this._filter(g)),
                  b.set("value", g),
                  l.forEach(e, function(a) {
                    !a ||
                      a instanceof w ||
                      !a.isInstanceOf(u) ||
                      a.set("disabled", !0);
                  }),
                  this._fsPlugin &&
                    (this._fsPlugin._getAltViewNode = function() {
                      return f.sourceArea;
                    }),
                  (this.sourceArea.value = g),
                  (this.sourceArea.style.height = b.iframe.style.height),
                  (this.sourceArea.style.width = b.iframe.style.width),
                  (b.iframe.parentNode.style.position = "relative"),
                  c.set(b.iframe, {
                    position: "absolute",
                    top: 0,
                    visibility: "hidden"
                  }),
                  c.set(this.sourceArea, { display: "block" }),
                  (this._resizeHandle = q(
                    window,
                    "resize",
                    d.hitch(this, function() {
                      var a = r.getBox(b.ownerDocument);
                      ("_prevW" in this &&
                        "_prevH" in this &&
                        a.w === this._prevW &&
                        a.h === this._prevH) ||
                        ((this._prevW = a.w),
                        (this._prevH = a.h),
                        this._resizer &&
                          (clearTimeout(this._resizer), delete this._resizer),
                        (this._resizer = setTimeout(
                          d.hitch(this, function() {
                            delete this._resizer;
                            this._resize();
                          }),
                          10
                        )));
                    })
                  )),
                  setTimeout(d.hitch(this, this._resize), 100),
                  this.editor.onNormalizedDisplayChanged(),
                  (this.editor.__oldGetValue = this.editor.getValue),
                  (this.editor.getValue = d.hitch(this, function() {
                    var a = this.sourceArea.value;
                    return (a = this._filter(a));
                  })),
                  (this._setListener = n.after(
                    this.editor,
                    "setValue",
                    d.hitch(this, function(a) {
                      a = this._filter(a || "");
                      this.sourceArea.value = a;
                    }),
                    !0
                  ));
              else {
                if (!b._sourceQueryCommandEnabled) return;
                this._setListener.remove();
                delete this._setListener;
                this._resizeHandle.remove();
                delete this._resizeHandle;
                this.editor.__oldGetValue &&
                  ((this.editor.getValue = this.editor.__oldGetValue),
                  delete this.editor.__oldGetValue);
                b.queryCommandEnabled = b._sourceQueryCommandEnabled;
                this._readOnly ||
                  ((g = this.sourceArea.value),
                  (g = this._filter(g)),
                  b.beginEditing(),
                  b.set("value", g),
                  b.endEditing());
                l.forEach(e, function(a) {
                  a && a.isInstanceOf(u) && a.set("disabled", !1);
                });
                c.set(this.sourceArea, "display", "none");
                c.set(b.iframe, {
                  position: "relative",
                  visibility: "visible"
                });
                delete b._sourceQueryCommandEnabled;
                this.editor.onDisplayChanged();
              }
              setTimeout(
                d.hitch(this, function() {
                  var a = b.domNode.parentNode;
                  a && (a = x.getEnclosingWidget(a)) && a.resize && a.resize();
                  b.resize();
                }),
                300
              );
            } catch (D) {
              console.log(D);
            }
          },
          updateState: function() {
            this.button.set("disabled", this.get("disabled"));
          },
          _resize: function() {
            var b = this.editor,
              c = b.getHeaderHeight(),
              d = b.getFooterHeight(),
              e = a.position(b.domNode),
              g = a.getPadBorderExtents(b.iframe.parentNode),
              f = a.getMarginExtents(b.iframe.parentNode),
              k = a.getPadBorderExtents(b.domNode),
              p = e.w - k.w,
              e = e.h - (c + k.h + d);
            this._fsPlugin &&
              this._fsPlugin.isFullscreen &&
              ((b = r.getBox(b.ownerDocument)),
              (p = b.w - k.w),
              (e = b.h - (c + k.h + d)));
            a.setMarginBox(this.sourceArea, {
              w: Math.round(p - (g.w + f.w)),
              h: Math.round(e - (g.h + f.h))
            });
          },
          _createSourceView: function() {
            var a = this.editor,
              b = a._plugins;
            this.sourceArea = f.create("textarea");
            this.readOnly &&
              (m.set(this.sourceArea, "readOnly", !0), (this._readOnly = !0));
            c.set(this.sourceArea, {
              padding: "0px",
              margin: "0px",
              borderWidth: "0px",
              borderStyle: "none"
            });
            m.set(this.sourceArea, "aria-label", this.editor.id);
            f.place(this.sourceArea, a.iframe, "before");
            k("ie") &&
              a.iframe.parentNode.lastChild !== a.iframe &&
              c.set(a.iframe.parentNode.lastChild, {
                width: "0px",
                height: "0px",
                padding: "0px",
                margin: "0px",
                borderWidth: "0px",
                borderStyle: "none"
              });
            a._viewsource_oldFocus = a.focus;
            var g = this;
            a.focus = function() {
              if (g._sourceShown) g.setSourceAreaCaret();
              else
                try {
                  this._vsFocused
                    ? (delete this._vsFocused, t.focus(a.editNode))
                    : a._viewsource_oldFocus();
                } catch (D) {
                  console.log("ViewSource focus code error: " + D);
                }
            };
            var h, l;
            for (h = 0; h < b.length; h++)
              if (
                (l = b[h]) &&
                ("dijit._editor.plugins.FullScreen" === l.declaredClass ||
                  l.declaredClass ===
                    p._scopeName + "._editor.plugins.FullScreen")
              ) {
                this._fsPlugin = l;
                break;
              }
            this._fsPlugin &&
              ((this._fsPlugin._viewsource_getAltViewNode = this._fsPlugin._getAltViewNode),
              (this._fsPlugin._getAltViewNode = function() {
                return g._sourceShown
                  ? g.sourceArea
                  : this._viewsource_getAltViewNode();
              }));
            this.own(
              q(
                this.sourceArea,
                "keydown",
                d.hitch(this, function(b) {
                  this._sourceShown &&
                    b.keyCode == e.F12 &&
                    b.ctrlKey &&
                    b.shiftKey &&
                    (this.button.focus(),
                    this.button.set("checked", !1),
                    setTimeout(
                      d.hitch(this, function() {
                        a.focus();
                      }),
                      100
                    ),
                    b.stopPropagation(),
                    b.preventDefault());
                })
              )
            );
          },
          _stripScripts: function(a) {
            a &&
              ((a = a.replace(
                /<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>/gi,
                ""
              )),
              (a = a.replace(/<\s*script\b([^<>]|\s)*>?/gi, "")),
              (a = a.replace(
                /<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>/gi,
                ""
              )));
            return a;
          },
          _stripComments: function(a) {
            a && (a = a.replace(/\x3c!--(.|\s){1,}?--\x3e/g, ""));
            return a;
          },
          _stripIFrames: function(a) {
            a &&
              (a = a.replace(
                /<\s*iframe[^>]*>((.|\s)*?)<\\?\/\s*iframe\s*>/gi,
                ""
              ));
            return a;
          },
          _stripEventHandlers: function(a) {
            if (a) {
              var b = a.match(/<[a-z]+?\b(.*?on.*?(['"]).*?\2.*?)+>/gim);
              if (b)
                for (var c = 0, d = b.length; c < d; c++) {
                  var e = b[c],
                    g = e.replace(/\s+on[a-z]*\s*=\s*(['"])(.*?)\1/gim, "");
                  a = a.replace(e, g);
                }
            }
            return a;
          },
          _filter: function(a) {
            a &&
              (this.stripScripts && (a = this._stripScripts(a)),
              this.stripComments && (a = this._stripComments(a)),
              this.stripIFrames && (a = this._stripIFrames(a)),
              this.stripEventHandlers && (a = this._stripEventHandlers(a)));
            return a;
          },
          setSourceAreaCaret: function() {
            var a = this.sourceArea;
            t.focus(a);
            this._sourceShown &&
              !this.readOnly &&
              (a.setSelectionRange
                ? a.setSelectionRange(0, 0)
                : this.sourceArea.createTextRange &&
                  ((a = a.createTextRange()),
                  a.collapse(!0),
                  a.moveStart("character", -99999),
                  a.moveStart("character", 0),
                  a.moveEnd("character", 0),
                  a.select()));
          },
          destroy: function() {
            this._resizer &&
              (clearTimeout(this._resizer), delete this._resizer);
            this._resizeHandle &&
              (this._resizeHandle.remove(), delete this._resizeHandle);
            this._setListener &&
              (this._setListener.remove(), delete this._setListener);
            this.inherited(arguments);
          }
        });
        u.registry.viewSource = u.registry.viewsource = function(a) {
          return new w({
            readOnly: "readOnly" in a ? a.readOnly : !1,
            stripComments: "stripComments" in a ? a.stripComments : !0,
            stripScripts: "stripScripts" in a ? a.stripScripts : !0,
            stripIFrames: "stripIFrames" in a ? a.stripIFrames : !0,
            stripEventHandlers:
              "stripEventHandlers" in a ? a.stripEventHandlers : !0
          });
        };
        return w;
      });
    },
    "dijit/_editor/plugins/FontChoice": function() {
      define("require dojo/_base/array dojo/_base/declare dojo/dom-construct dojo/i18n dojo/_base/lang dojo/string dojo/store/Memory ../../registry ../../_Widget ../../_TemplatedMixin ../../_WidgetsInTemplateMixin ../../form/FilteringSelect ../_Plugin ../range dojo/i18n!../nls/FontChoice".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u) {
        l = h("dijit._editor.plugins._FontDropDown", [d, q, k], {
          label: "",
          plainText: !1,
          templateString:
            "\x3cspan style\x3d'white-space: nowrap' class\x3d'dijit dijitReset dijitInline'\x3e\x3clabel class\x3d'dijitLeft dijitInline' for\x3d'${selectId}'\x3e${label}\x3c/label\x3e\x3cinput data-dojo-type\x3d'../../form/FilteringSelect' required\x3d'false' data-dojo-props\x3d'labelType:\"html\", labelAttr:\"label\", searchAttr:\"name\"' class\x3d'${comboClass}' tabIndex\x3d'-1' id\x3d'${selectId}' data-dojo-attach-point\x3d'select' value\x3d''/\x3e\x3c/span\x3e",
          contextRequire: l,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.strings = f.getLocalization("dijit._editor", "FontChoice");
            this.label = this.strings[this.command];
            this.id = e.getUniqueId(this.declaredClass.replace(/\./g, "_"));
            this.selectId = this.id + "_select";
            this.inherited(arguments);
          },
          postCreate: function() {
            this.select.set(
              "store",
              new b({
                idProperty: "value",
                data: n.map(
                  this.values,
                  function(a) {
                    var b = this.strings[a] || a;
                    return { label: this.getLabel(a, b), name: b, value: a };
                  },
                  this
                )
              })
            );
            this.select.set("value", "", !1);
            this.disabled = this.select.get("disabled");
          },
          _setValueAttr: function(a, b) {
            b = !1 !== b;
            this.select.set("value", 0 > n.indexOf(this.values, a) ? "" : a, b);
            b || (this.select._lastValueReported = null);
          },
          _getValueAttr: function() {
            return this.select.get("value");
          },
          focus: function() {
            this.select.focus();
          },
          _setDisabledAttr: function(a) {
            this._set("disabled", a);
            this.select.set("disabled", a);
          }
        });
        var g = h("dijit._editor.plugins._FontNameDropDown", l, {
            generic: !1,
            command: "fontName",
            comboClass: "dijitFontNameCombo",
            postMixInProperties: function() {
              this.values ||
                (this.values = this.generic
                  ? ["serif", "sans-serif", "monospace", "cursive", "fantasy"]
                  : [
                      "Arial",
                      "Times New Roman",
                      "Comic Sans MS",
                      "Courier New"
                    ]);
              this.inherited(arguments);
            },
            getLabel: function(a, b) {
              return this.plainText
                ? b
                : "\x3cdiv style\x3d'font-family: " +
                    a +
                    "'\x3e" +
                    b +
                    "\x3c/div\x3e";
            },
            _normalizeFontName: function(a) {
              var b = this.values;
              if (!a || !b) return a;
              var d = a.split(",");
              if (1 < d.length)
                for (var e = 0, g = d.length; e < g; e++) {
                  var f = c.trim(d[e]);
                  if (-1 < n.indexOf(b, f)) return f;
                }
              return a;
            },
            _setValueAttr: function(a, b) {
              b = !1 !== b;
              a = this._normalizeFontName(a);
              this.generic &&
                (a =
                  {
                    Arial: "sans-serif",
                    Helvetica: "sans-serif",
                    Myriad: "sans-serif",
                    Times: "serif",
                    "Times New Roman": "serif",
                    "Comic Sans MS": "cursive",
                    "Apple Chancery": "cursive",
                    Courier: "monospace",
                    "Courier New": "monospace",
                    Papyrus: "fantasy",
                    "Estrangelo Edessa": "cursive",
                    Gabriola: "fantasy"
                  }[a] || a);
              this.inherited(arguments, [a, b]);
            }
          }),
          p = h("dijit._editor.plugins._FontSizeDropDown", l, {
            command: "fontSize",
            comboClass: "dijitFontSizeCombo",
            values: [1, 2, 3, 4, 5, 6, 7],
            getLabel: function(a, b) {
              return this.plainText
                ? b
                : "\x3cfont size\x3d" + a + "'\x3e" + b + "\x3c/font\x3e";
            },
            _setValueAttr: function(a, b) {
              b = !1 !== b;
              a.indexOf &&
                -1 != a.indexOf("px") &&
                (a =
                  { 10: 1, 13: 2, 16: 3, 18: 4, 24: 5, 32: 6, 48: 7 }[
                    parseInt(a, 10)
                  ] || a);
              this.inherited(arguments, [a, b]);
            }
          }),
          x = h("dijit._editor.plugins._FormatBlockDropDown", l, {
            command: "formatBlock",
            comboClass: "dijitFormatBlockCombo",
            values: "noFormat p h1 h2 h3 pre".split(" "),
            postCreate: function() {
              this.inherited(arguments);
              this.set("value", "noFormat", !1);
            },
            getLabel: function(a, b) {
              return this.plainText || "noFormat" == a
                ? b
                : "\x3c" + a + "\x3e" + b + "\x3c/" + a + "\x3e";
            },
            _execCommand: function(b, c, d) {
              if ("noFormat" === d) {
                var e;
                if ((c = u.getSelection(b.window)) && 0 < c.rangeCount) {
                  d = c.getRangeAt(0);
                  var g;
                  if (d) {
                    c = d.startContainer;
                    for (
                      e = d.endContainer;
                      c &&
                      c !== b.editNode &&
                      c !== b.document.body &&
                      1 !== c.nodeType;

                    )
                      c = c.parentNode;
                    for (
                      ;
                      e &&
                      e !== b.editNode &&
                      e !== b.document.body &&
                      1 !== e.nodeType;

                    )
                      e = e.parentNode;
                    var f = a.hitch(this, function(a, c) {
                      if (a.childNodes && a.childNodes.length) {
                        var d;
                        for (d = 0; d < a.childNodes.length; d++) {
                          var e = a.childNodes[d];
                          if (1 == e.nodeType && b.selection.inSelection(e)) {
                            var g = e.tagName ? e.tagName.toLowerCase() : "";
                            -1 !== n.indexOf(this.values, g) && c.push(e);
                            f(e, c);
                          }
                        }
                      }
                    });
                    d = a.hitch(this, function(a) {
                      if (a && a.length) {
                        for (b.beginEditing(); a.length; )
                          this._removeFormat(b, a.pop());
                        b.endEditing();
                      }
                    });
                    var k = [];
                    if (c == e) {
                      var p;
                      for (
                        e = c;
                        e && e !== b.editNode && e !== b.document.body;

                      ) {
                        if (
                          1 == e.nodeType &&
                          ((g = e.tagName ? e.tagName.toLowerCase() : ""),
                          -1 !== n.indexOf(this.values, g))
                        ) {
                          p = e;
                          break;
                        }
                        e = e.parentNode;
                      }
                      f(c, k);
                      p && (k = [p].concat(k));
                    } else
                      for (e = c; b.selection.inSelection(e); )
                        1 == e.nodeType &&
                          ((g = e.tagName ? e.tagName.toLowerCase() : ""),
                          -1 !== n.indexOf(this.values, g) && k.push(e),
                          f(e, k)),
                          (e = e.nextSibling);
                    d(k);
                    b.onDisplayChanged();
                  }
                }
              } else b.execCommand(c, d);
            },
            _removeFormat: function(a, b) {
              if (a.customUndo) {
                for (; b.firstChild; ) m.place(b.firstChild, b, "before");
                b.parentNode.removeChild(b);
              } else {
                a.selection.selectElementChildren(b);
                var c = a.selection.getSelectedHtml();
                a.selection.selectElement(b);
                a.execCommand("inserthtml", c || "");
              }
            }
          }),
          w = h("dijit._editor.plugins.FontChoice", t, {
            useDefaultCommand: !1,
            _initButton: function() {
              var b = { fontName: g, fontSize: p, formatBlock: x }[
                  this.command
                ],
                c = this.params;
              this.params.custom && (c.values = this.params.custom);
              var d = this.editor;
              this.button = new b(a.delegate({ dir: d.dir, lang: d.lang }, c));
              this.own(
                this.button.select.on(
                  "change",
                  a.hitch(this, function(a) {
                    this.editor.focused && this.editor.focus();
                    "fontName" == this.command &&
                      -1 != a.indexOf(" ") &&
                      (a = "'" + a + "'");
                    this.button._execCommand
                      ? this.button._execCommand(this.editor, this.command, a)
                      : this.editor.execCommand(this.command, a);
                  })
                )
              );
            },
            updateState: function() {
              var b = this.editor,
                c = this.command;
              if (b && b.isLoaded && c.length && this.button) {
                var d = this.get("disabled");
                this.button.set("disabled", d);
                if (!d) {
                  var e;
                  try {
                    e = b.queryCommandValue(c) || "";
                  } catch (D) {
                    e = "";
                  }
                  (d =
                    a.isString(e) &&
                    (e.match(/'([^']*)'/) || e.match(/"([^"]*)"/))) &&
                    (e = d[1]);
                  "fontSize" !== c || e || (e = 3);
                  if ("formatBlock" === c)
                    if (e && "p" != e)
                      0 > n.indexOf(this.button.values, e) && (e = "noFormat");
                    else {
                      e = null;
                      var g;
                      (c = u.getSelection(this.editor.window)) &&
                        0 < c.rangeCount &&
                        (c = c.getRangeAt(0)) &&
                        (g = c.endContainer);
                      for (; g && g !== b.editNode && g !== b.document; ) {
                        if (
                          (c = g.tagName ? g.tagName.toLowerCase() : "") &&
                          -1 < n.indexOf(this.button.values, c)
                        ) {
                          e = c;
                          break;
                        }
                        g = g.parentNode;
                      }
                      e || (e = "noFormat");
                    }
                  e !== this.button.get("value") &&
                    this.button.set("value", e, !1);
                }
              }
            }
          });
        n.forEach(["fontName", "fontSize", "formatBlock"], function(a) {
          t.registry[a] = function(b) {
            return new w({ command: a, plainText: b.plainText });
          };
        });
        w._FontDropDown = l;
        w._FontNameDropDown = g;
        w._FontSizeDropDown = p;
        w._FormatBlockDropDown = x;
        return w;
      });
    },
    "dojox/editor/plugins/Preview": function() {
      define("dojo dijit dojox dijit/_editor/_Plugin dijit/form/Button dojo/_base/connect dojo/_base/declare dojo/i18n dojo/i18n!dojox/editor/plugins/nls/Preview".split(
        " "
      ), function(l, n, h, m) {
        var f = l.declare("dojox.editor.plugins.Preview", m, {
          useDefaultCommand: !1,
          styles: "",
          stylesheets: null,
          iconClassPrefix: "dijitAdditionalEditorIcon",
          _initButton: function() {
            this._nlsResources = l.i18n.getLocalization(
              "dojox.editor.plugins",
              "Preview"
            );
            this.button = new n.form.Button({
              label: this._nlsResources.preview,
              showLabel: !1,
              iconClass:
                this.iconClassPrefix + " " + this.iconClassPrefix + "Preview",
              tabIndex: "-1",
              onClick: l.hitch(this, "_preview")
            });
          },
          setEditor: function(a) {
            this.editor = a;
            this._initButton();
          },
          updateState: function() {
            this.button.set("disabled", this.get("disabled"));
          },
          _preview: function() {
            try {
              var a = this.editor.get("value"),
                c =
                  "\t\t\x3cmeta http-equiv\x3d'Content-Type' content\x3d'text/html; charset\x3dUTF-8'\x3e\n",
                b;
              if (this.stylesheets)
                for (b = 0; b < this.stylesheets.length; b++)
                  c +=
                    "\t\t\x3clink rel\x3d'stylesheet' type\x3d'text/css' href\x3d'" +
                    this.stylesheets[b] +
                    "'\x3e\n";
              this.styles &&
                (c += "\t\t\x3cstyle\x3e" + this.styles + "\x3c/style\x3e\n");
              var a =
                  "\x3chtml\x3e\n\t\x3chead\x3e\n" +
                  c +
                  "\t\x3c/head\x3e\n\t\x3cbody\x3e\n" +
                  a +
                  "\n\t\x3c/body\x3e\n\x3c/html\x3e",
                e = window.open(
                  "javascript: ''",
                  this._nlsResources.preview,
                  "status\x3d1,menubar\x3d0,location\x3d0,toolbar\x3d0"
                );
              e.document.open();
              e.document.write(a);
              e.document.close();
            } catch (d) {
              console.warn(d);
            }
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          a.plugin ||
            "preview" !== a.args.name.toLowerCase() ||
            (a.plugin = new f({
              styles: "styles" in a.args ? a.args.styles : "",
              stylesheets: "stylesheets" in a.args ? a.args.stylesheets : null
            }));
        });
        return f;
      });
    },
    "dijit/_editor/plugins/TextColor": function() {
      define("require dojo/colors dojo/_base/declare dojo/_base/lang ../_Plugin ../../form/DropDownButton".split(
        " "
      ), function(l, n, h, m, f, a) {
        var c = h("dijit._editor.plugins.TextColor", f, {
          buttonClass: a,
          colorPicker: "dijit/ColorPalette",
          useDefaultCommand: !1,
          _initButton: function() {
            this.command = this.name;
            this.inherited(arguments);
            var a = this;
            this.button.loadDropDown = function(b) {
              function c(c) {
                a.button.dropDown = new c({
                  dir: a.editor.dir,
                  ownerDocument: a.editor.ownerDocument,
                  value: a.value,
                  onChange: function(b) {
                    a.editor.execCommand(a.command, b);
                  },
                  onExecute: function() {
                    a.editor.execCommand(a.command, this.get("value"));
                  }
                });
                b();
              }
              "string" == typeof a.colorPicker
                ? l([a.colorPicker], c)
                : c(a.colorPicker);
            };
          },
          updateState: function() {
            var a = this.editor,
              c = this.command;
            if (a && a.isLoaded && c.length) {
              if (this.button) {
                var d = this.get("disabled");
                this.button.set("disabled", d);
                if (d) return;
                var f;
                try {
                  f = a.queryCommandValue(c) || "";
                } catch (k) {
                  f = "";
                }
              }
              "" == f && (f = "#000000");
              "transparent" == f && (f = "#ffffff");
              "string" == typeof f
                ? -1 < f.indexOf("rgb") && (f = n.fromRgb(f).toHex())
                : ((f = (
                    ((f & 255) << 16) |
                    (f & 65280) |
                    ((f & 16711680) >>> 16)
                  ).toString(16)),
                  (f = "#000000".slice(0, 7 - f.length) + f));
              this.value = f;
              (a = this.button.dropDown) &&
                a.get &&
                f !== a.get("value") &&
                a.set("value", f, !1);
            }
          }
        });
        f.registry.foreColor = function(a) {
          return new c(a);
        };
        f.registry.hiliteColor = function(a) {
          return new c(a);
        };
        return c;
      });
    },
    "dojox/editor/plugins/ToolbarLineBreak": function() {
      define("dojo dijit dojox dijit/_Widget dijit/_TemplatedMixin dijit/_editor/_Plugin dojo/_base/declare".split(
        " "
      ), function(l, n, h, m, f, a, c) {
        var b = c("dojox.editor.plugins.ToolbarLineBreak", [m, f], {
          templateString:
            "\x3cspan class\x3d'dijit dijitReset'\x3e\x3cbr\x3e\x3c/span\x3e",
          postCreate: function() {
            l.setSelectable(this.domNode, !1);
          },
          isFocusable: function() {
            return !1;
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(c) {
          if (!c.plugin) {
            var d = c.args.name.toLowerCase();
            if ("||" === d || "toolbarlinebreak" === d)
              c.plugin = new a({
                button: new b(),
                setEditor: function(a) {
                  this.editor = a;
                }
              });
          }
        });
        return b;
      });
    },
    "dojox/editor/plugins/FindReplace": function() {
      define("dojo dijit dojox dijit/_base/manager dijit/_base/popup dijit/_Widget dijit/_TemplatedMixin dijit/_KeyNavContainer dijit/_WidgetsInTemplateMixin dijit/TooltipDialog dijit/Toolbar dijit/form/CheckBox dijit/form/_TextBoxMixin dijit/form/TextBox dijit/_editor/_Plugin dijit/form/Button dijit/form/DropDownButton dijit/form/ToggleButton ./ToolbarLineBreak dojo/_base/connect dojo/_base/declare dojo/i18n dojo/string dojo/i18n!dojox/editor/plugins/nls/FindReplace".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u) {
        l.experimental("dojox.editor.plugins.FindReplace");
        var g = l.declare(
            "dojox.editor.plugins._FindReplaceCloseBox",
            [a, c, e],
            {
              btnId: "",
              widget: null,
              widgetsInTemplate: !0,
              templateString:
                "\x3cspan style\x3d'float: right' class\x3d'dijitInline' tabindex\x3d'-1'\x3e\x3cbutton class\x3d'dijit dijitReset dijitInline' id\x3d'${btnId}' dojoAttachPoint\x3d'button' dojoType\x3d'dijit.form.Button' tabindex\x3d'-1' iconClass\x3d'dijitEditorIconsFindReplaceClose' showLabel\x3d'false'\x3eX\x3c/button\x3e\x3c/span\x3e",
              postMixInProperties: function() {
                this.id = n.getUniqueId(this.declaredClass.replace(/\./g, "_"));
                this.btnId = this.id + "_close";
                this.inherited(arguments);
              },
              startup: function() {
                this.connect(this.button, "onClick", "onClick");
              },
              onClick: function() {}
            }
          ),
          p = l.declare("dojox.editor.plugins._FindReplaceTextBox", [a, c, e], {
            textId: "",
            label: "",
            toolTip: "",
            widget: null,
            widgetsInTemplate: !0,
            templateString:
              "\x3cspan style\x3d'white-space: nowrap' class\x3d'dijit dijitReset dijitInline dijitEditorFindReplaceTextBox' title\x3d'${tooltip}' tabindex\x3d'-1'\x3e\x3clabel class\x3d'dijitLeft dijitInline' for\x3d'${textId}' tabindex\x3d'-1'\x3e${label}\x3c/label\x3e\x3cinput dojoType\x3d'dijit.form.TextBox' intermediateChanges\x3d'true' class\x3d'focusTextBox' tabIndex\x3d'0' id\x3d'${textId}' dojoAttachPoint\x3d'textBox, focusNode' value\x3d'' dojoAttachEvent\x3d'onKeyPress: _onKeyPress'/\x3e\x3c/span\x3e",
            postMixInProperties: function() {
              this.id = n.getUniqueId(this.declaredClass.replace(/\./g, "_"));
              this.textId = this.id + "_text";
              this.inherited(arguments);
            },
            postCreate: function() {
              this.textBox.set("value", "");
              this.disabled = this.textBox.get("disabled");
              this.connect(this.textBox, "onChange", "onChange");
              l.attr(this.textBox.textbox, "formnovalidate", "true");
            },
            _setValueAttr: function(a) {
              this.value = a;
              this.textBox.set("value", a);
            },
            focus: function() {
              this.textBox.focus();
            },
            _setDisabledAttr: function(a) {
              this.disabled = a;
              this.textBox.set("disabled", a);
            },
            onChange: function(a) {
              this.value = a;
            },
            _onKeyPress: function(a) {
              var b = 0,
                c = 0;
              !a.target ||
                a.ctrlKey ||
                a.altKey ||
                a.shiftKey ||
                (a.keyCode == l.keys.LEFT_ARROW
                  ? ((b = a.target.selectionStart),
                    (c = a.target.selectionEnd),
                    b < c &&
                      (n.selectInputText(a.target, b, b), l.stopEvent(a)))
                  : a.keyCode == l.keys.RIGHT_ARROW &&
                    ((b = a.target.selectionStart),
                    (c = a.target.selectionEnd),
                    b < c &&
                      (n.selectInputText(a.target, c, c), l.stopEvent(a))));
            }
          }),
          x = l.declare(
            "dojox.editor.plugins._FindReplaceCheckBox",
            [a, c, e],
            {
              checkId: "",
              label: "",
              tooltip: "",
              widget: null,
              widgetsInTemplate: !0,
              templateString:
                "\x3cspan style\x3d'white-space: nowrap' tabindex\x3d'-1' class\x3d'dijit dijitReset dijitInline dijitEditorFindReplaceCheckBox' title\x3d'${tooltip}' \x3e\x3cinput dojoType\x3d'dijit.form.CheckBox' tabIndex\x3d'0' id\x3d'${checkId}' dojoAttachPoint\x3d'checkBox, focusNode' value\x3d''/\x3e\x3clabel tabindex\x3d'-1' class\x3d'dijitLeft dijitInline' for\x3d'${checkId}'\x3e${label}\x3c/label\x3e\x3c/span\x3e",
              postMixInProperties: function() {
                this.id = n.getUniqueId(this.declaredClass.replace(/\./g, "_"));
                this.checkId = this.id + "_check";
                this.inherited(arguments);
              },
              postCreate: function() {
                this.checkBox.set("checked", !1);
                this.disabled = this.checkBox.get("disabled");
                this.checkBox.isFocusable = function() {
                  return !1;
                };
              },
              _setValueAttr: function(a) {
                this.checkBox.set("value", a);
              },
              _getValueAttr: function() {
                return this.checkBox.get("value");
              },
              focus: function() {
                this.checkBox.focus();
              },
              _setDisabledAttr: function(a) {
                this.disabled = a;
                this.checkBox.set("disabled", a);
              }
            }
          ),
          w = l.declare("dojox.editor.plugins._FindReplaceToolbar", q, {
            postCreate: function() {
              this.connectKeyNavHandlers([], []);
              this.connect(this.containerNode, "onclick", "_onToolbarEvent");
              this.connect(this.containerNode, "onkeydown", "_onToolbarEvent");
              l.addClass(this.domNode, "dijitToolbar");
            },
            addChild: function(a, b) {
              n._KeyNavContainer.superclass.addChild.apply(this, arguments);
            },
            _onToolbarEvent: function(a) {
              a.stopPropagation();
            }
          }),
          v = l.declare("dojox.editor.plugins.FindReplace", [u], {
            buttonClass: n.form.ToggleButton,
            iconClassPrefix: "dijitEditorIconsFindReplace",
            editor: null,
            button: null,
            _frToolbar: null,
            _closeBox: null,
            _findField: null,
            _replaceField: null,
            _findButton: null,
            _replaceButton: null,
            _replaceAllButton: null,
            _caseSensitive: null,
            _backwards: null,
            _promDialog: null,
            _promDialogTimeout: null,
            _strings: null,
            _bookmark: null,
            _initButton: function() {
              this._strings = l.i18n.getLocalization(
                "dojox.editor.plugins",
                "FindReplace"
              );
              this.button = new n.form.ToggleButton({
                label: this._strings.findReplace,
                showLabel: !1,
                iconClass: this.iconClassPrefix + " dijitEditorIconFindString",
                tabIndex: "-1",
                onChange: l.hitch(this, "_toggleFindReplace")
              });
              l.isOpera && this.button.set("disabled", !0);
              this.connect(
                this.button,
                "set",
                l.hitch(this, function(a, b) {
                  "disabled" === a &&
                    this._toggleFindReplace(!b && this._displayed, !0, !0);
                })
              );
            },
            setEditor: function(a) {
              this.editor = a;
              this._initButton();
            },
            toggle: function() {
              this.button.set("checked", !this.button.get("checked"));
            },
            _toggleFindReplace: function(a, b, c) {
              var d = l.marginBox(this.editor.domNode);
              a && !l.isOpera
                ? (l.style(this._frToolbar.domNode, "display", "block"),
                  this._populateFindField(),
                  b || (this._displayed = !0))
                : (l.style(this._frToolbar.domNode, "display", "none"),
                  b || (this._displayed = !1),
                  c || this.editor.focus());
              this.editor.resize({ h: d.h });
            },
            _populateFindField: function() {
              var a = this.editor._sCall("getSelectedText", [null]);
              this._findField &&
                this._findField.textBox &&
                (a && this._findField.textBox.set("value", a),
                this._findField.textBox.focus(),
                n.selectInputText(this._findField.textBox.focusNode));
            },
            setToolbar: function(a) {
              this.inherited(arguments);
              if (!l.isOpera) {
                var b = (this._frToolbar = new w());
                l.style(b.domNode, "display", "none");
                l.place(b.domNode, a.domNode, "after");
                b.startup();
                this._closeBox = new g();
                b.addChild(this._closeBox);
                this._findField = new p({
                  label: this._strings.findLabel,
                  tooltip: this._strings.findTooltip
                });
                b.addChild(this._findField);
                this._replaceField = new p({
                  label: this._strings.replaceLabel,
                  tooltip: this._strings.replaceTooltip
                });
                b.addChild(this._replaceField);
                b.addChild(new h.editor.plugins.ToolbarLineBreak());
                this._findButton = new n.form.Button({
                  label: this._strings.findButton,
                  showLabel: !0,
                  iconClass: this.iconClassPrefix + " dijitEditorIconFind"
                });
                this._findButton.titleNode.title = this._strings.findButtonTooltip;
                b.addChild(this._findButton);
                this._replaceButton = new n.form.Button({
                  label: this._strings.replaceButton,
                  showLabel: !0,
                  iconClass: this.iconClassPrefix + " dijitEditorIconReplace"
                });
                this._replaceButton.titleNode.title = this._strings.replaceButtonTooltip;
                b.addChild(this._replaceButton);
                this._replaceAllButton = new n.form.Button({
                  label: this._strings.replaceAllButton,
                  showLabel: !0,
                  iconClass: this.iconClassPrefix + " dijitEditorIconReplaceAll"
                });
                this._replaceAllButton.titleNode.title = this._strings.replaceAllButtonTooltip;
                b.addChild(this._replaceAllButton);
                this._caseSensitive = new x({
                  label: this._strings.matchCase,
                  tooltip: this._strings.matchCaseTooltip
                });
                b.addChild(this._caseSensitive);
                this._backwards = new x({
                  label: this._strings.backwards,
                  tooltip: this._strings.backwardsTooltip
                });
                b.addChild(this._backwards);
                this._findButton.set("disabled", !0);
                this._replaceButton.set("disabled", !0);
                this._replaceAllButton.set("disabled", !0);
                this.connect(this._findField, "onChange", "_checkButtons");
                this.connect(this._findField, "onKeyDown", "_onFindKeyDown");
                this.connect(
                  this._replaceField,
                  "onKeyDown",
                  "_onReplaceKeyDown"
                );
                this.connect(this._findButton, "onClick", "_find");
                this.connect(this._replaceButton, "onClick", "_replace");
                this.connect(this._replaceAllButton, "onClick", "_replaceAll");
                this.connect(this._closeBox, "onClick", "toggle");
                this._promDialog = new n.TooltipDialog();
                this._promDialog.startup();
                this._promDialog.set("content", "");
              }
            },
            _checkButtons: function() {
              this._findField.get("value")
                ? (this._findButton.set("disabled", !1),
                  this._replaceButton.set("disabled", !1),
                  this._replaceAllButton.set("disabled", !1))
                : (this._findButton.set("disabled", !0),
                  this._replaceButton.set("disabled", !0),
                  this._replaceAllButton.set("disabled", !0));
            },
            _onFindKeyDown: function(a) {
              a.keyCode == l.keys.ENTER && (this._find(), l.stopEvent(a));
            },
            _onReplaceKeyDown: function(a) {
              a.keyCode == l.keys.ENTER &&
                (this._replace() || this._replace(), l.stopEvent(a));
            },
            _find: function(a) {
              var b = this._findField.get("value") || "";
              if (b) {
                var c = this._caseSensitive.get("value"),
                  d = this._backwards.get("value"),
                  b = this._findText(b, c, d);
                !b &&
                  a &&
                  (this._promDialog.set(
                    "content",
                    l.string.substitute(this._strings.eofDialogText, {
                      0: this._strings.eofDialogTextFind
                    })
                  ),
                  n.popup.open({
                    popup: this._promDialog,
                    around: this._findButton.domNode
                  }),
                  (this._promDialogTimeout = setTimeout(
                    l.hitch(this, function() {
                      clearTimeout(this._promDialogTimeout);
                      this._promDialogTimeout = null;
                      n.popup.close(this._promDialog);
                    }),
                    3e3
                  )),
                  setTimeout(
                    l.hitch(this, function() {
                      this.editor.focus();
                    }),
                    0
                  ));
                return b;
              }
              return !1;
            },
            _replace: function(a) {
              var b = !1,
                c = this.editor;
              c.focus();
              var d = this._findField.get("value") || "",
                e = this._replaceField.get("value") || "";
              if (d) {
                var g = this._caseSensitive.get("value"),
                  f = this._backwards.get("value"),
                  k = c._sCall("getSelectedText", [null]);
                l.isMoz && ((d = l.trim(d)), (k = l.trim(k)));
                d = this._filterRegexp(d, !g);
                k &&
                  d.test(k) &&
                  (c.execCommand("inserthtml", e),
                  (b = !0),
                  f && (this._findText(e, g, f), c._sCall("collapse", [!0])));
                !this._find(!1) &&
                  a &&
                  (this._promDialog.set(
                    "content",
                    l.string.substitute(this._strings.eofDialogText, {
                      0: this._strings.eofDialogTextReplace
                    })
                  ),
                  n.popup.open({
                    popup: this._promDialog,
                    around: this._replaceButton.domNode
                  }),
                  (this._promDialogTimeout = setTimeout(
                    l.hitch(this, function() {
                      clearTimeout(this._promDialogTimeout);
                      this._promDialogTimeout = null;
                      n.popup.close(this._promDialog);
                    }),
                    3e3
                  )),
                  setTimeout(
                    l.hitch(this, function() {
                      this.editor.focus();
                    }),
                    0
                  ));
                return b;
              }
              return null;
            },
            _replaceAll: function(a) {
              var b = 0;
              this._backwards.get("value")
                ? this.editor.placeCursorAtEnd()
                : this.editor.placeCursorAtStart();
              this._replace(!1) && b++;
              var c = l.hitch(this, function() {
                this._replace(!1)
                  ? (b++, setTimeout(c, 10))
                  : a &&
                    (this._promDialog.set(
                      "content",
                      l.string.substitute(this._strings.replaceDialogText, {
                        0: "" + b
                      })
                    ),
                    n.popup.open({
                      popup: this._promDialog,
                      around: this._replaceAllButton.domNode
                    }),
                    (this._promDialogTimeout = setTimeout(
                      l.hitch(this, function() {
                        clearTimeout(this._promDialogTimeout);
                        this._promDialogTimeout = null;
                        n.popup.close(this._promDialog);
                      }),
                      3e3
                    )),
                    setTimeout(
                      l.hitch(this, function() {
                        this._findField.focus();
                        this._findField.textBox.focusNode.select();
                      }),
                      0
                    ));
              });
              c();
            },
            _findText: function(a, b, c) {
              var d = this.editor,
                e = d.window,
                g = !1;
              if (a)
                if (e.find) g = e.find(a, b, c, !1, !1, !1, !1);
                else {
                  var f = d.document;
                  if (f.selection || e.getSelection)
                    if (
                      (this.editor.focus(),
                      (d = f.body.createTextRange()),
                      (g = d.duplicate()),
                      e.getSelection().getRangeAt(0),
                      (f = f.selection ? f.selection.createRange() : null)
                        ? c
                          ? d.setEndPoint("EndToStart", f)
                          : d.setEndPoint("StartToEnd", f)
                        : this._bookmark &&
                          ((e = e.getSelection().toString()),
                          d.moveToBookmark(this._bookmark),
                          d.text != e
                            ? ((d = g.duplicate()), (this._bookmark = null))
                            : (c
                                ? g.setEndPoint("EndToStart", d)
                                : g.setEndPoint("StartToEnd", d),
                              (d = g.duplicate()))),
                      (b = b ? 4 : 0),
                      c && (b |= 1),
                      (g = d.findText(a, d.text.length, b)))
                    )
                      d.select(), (this._bookmark = d.getBookmark());
                }
              return g;
            },
            _filterRegexp: function(a, b) {
              for (var c = "", d = null, e = 0; e < a.length; e++)
                switch (((d = a.charAt(e)), d)) {
                  case "\\":
                    c += d;
                    e++;
                    c += a.charAt(e);
                    break;
                  case "$":
                  case "^":
                  case "/":
                  case "+":
                  case ".":
                  case "|":
                  case "(":
                  case ")":
                  case "{":
                  case "}":
                  case "[":
                  case "]":
                    c += "\\";
                  default:
                    c += d;
                }
              c = "^" + c + "$";
              return b ? new RegExp(c, "mi") : new RegExp(c, "m");
            },
            updateState: function() {
              this.button.set("disabled", this.get("disabled"));
            },
            destroy: function() {
              this.inherited(arguments);
              this._promDialogTimeout &&
                (clearTimeout(this._promDialogTimeout),
                (this._promDialogTimeout = null),
                n.popup.close(this._promDialog));
              this._frToolbar &&
                (this._frToolbar.destroyRecursive(), (this._frToolbar = null));
              this._promDialog &&
                (this._promDialog.destroyRecursive(),
                (this._promDialog = null));
            }
          });
        v._FindReplaceCloseBox = g;
        v._FindReplaceTextBox = p;
        v._FindReplaceCheckBox = x;
        v._FindReplaceToolbar = w;
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          a.plugin ||
            "findreplace" !== a.args.name.toLowerCase() ||
            (a.plugin = new v({}));
        });
        return v;
      });
    },
    "dojox/editor/plugins/PasteFromWord": function() {
      define("dojo dijit dojox dijit/_editor/_Plugin dijit/_base/manager dijit/_editor/RichText dijit/form/Button dijit/Dialog dojox/html/format dojo/_base/connect dojo/_base/declare dojo/i18n dojo/string dojo/i18n!dojox/editor/plugins/nls/PasteFromWord dojo/i18n!dijit/nls/common dojo/i18n!dijit/_editor/nls/commands".split(
        " "
      ), function(l, n, h, m) {
        var f = l.declare("dojox.editor.plugins.PasteFromWord", m, {
          iconClassPrefix: "dijitAdditionalEditorIcon",
          width: "400px",
          height: "300px",
          _template:
            "\x3cdiv class\x3d'dijitPasteFromWordEmbeddedRTE'\x3e\x3cdiv style\x3d'width: ${width}; padding-top: 5px; padding-bottom: 5px;'\x3e${instructions}\x3c/div\x3e\x3cdiv id\x3d'${uId}_rte' style\x3d'width: ${width}; height: ${height}'\x3e\x3c/div\x3e\x3ctable style\x3d'width: ${width}' tabindex\x3d'-1'\x3e\x3ctbody\x3e\x3ctr\x3e\x3ctd align\x3d'center'\x3e\x3cbutton type\x3d'button' dojoType\x3d'dijit.form.Button' id\x3d'${uId}_paste'\x3e${paste}\x3c/button\x3e\x26nbsp;\x3cbutton type\x3d'button' dojoType\x3d'dijit.form.Button' id\x3d'${uId}_cancel'\x3e${buttonCancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e\x3c/div\x3e",
          _filters: [
            {
              regexp: /(<meta\s*[^>]*\s*>)|(<\s*link\s* href="file:[^>]*\s*>)|(<\/?\s*\w+:[^>]*\s*>)/gi,
              handler: ""
            },
            {
              regexp: /(?:<style([^>]*)>([\s\S]*?)<\/style>|<link\s+(?=[^>]*rel=['"]?stylesheet)([^>]*?href=(['"])([^>]*?)\4[^>\/]*)\/?>)/gi,
              handler: ""
            },
            {
              regexp: /(class="Mso[^"]*")|(\x3c!--(.|\s){1,}?--\x3e)/gi,
              handler: ""
            },
            {
              regexp: /(<p[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/p[^>]*>)|(<p[^>]*>\s*<font[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/\s*font\s*>\s<\/p[^>]*>)/gi,
              handler: ""
            },
            {
              regexp: /(style="[^"]*mso-[^;][^"]*")|(style="margin:\s*[^;"]*;")/gi,
              handler: ""
            },
            {
              regexp: /(<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>)|(<\s*script\b([^<>]|\s)*>?)|(<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>)/gi,
              handler: ""
            },
            { regexp: /<(\/?)o\:p[^>]*>/gi, handler: "" }
          ],
          _initButton: function() {
            this._filters = this._filters.slice(0);
            var a = l.i18n.getLocalization(
              "dojox.editor.plugins",
              "PasteFromWord"
            );
            l.mixin(a, l.i18n.getLocalization("dijit", "common"));
            l.mixin(a, l.i18n.getLocalization("dijit._editor", "commands"));
            this.button = new n.form.Button({
              label: a.pasteFromWord,
              showLabel: !1,
              iconClass:
                this.iconClassPrefix +
                " " +
                this.iconClassPrefix +
                "PasteFromWord",
              tabIndex: "-1",
              onClick: l.hitch(this, "_openDialog")
            });
            this._uId = n.getUniqueId(this.editor.id);
            a.uId = this._uId;
            a.width = this.width || "400px";
            a.height = this.height || "300px";
            this._dialog = new n.Dialog({ title: a.pasteFromWord }).placeAt(
              l.body()
            );
            this._dialog.set("content", l.string.substitute(this._template, a));
            l.style(l.byId(this._uId + "_rte"), "opacity", 0.001);
            this.connect(n.byId(this._uId + "_paste"), "onClick", "_paste");
            this.connect(n.byId(this._uId + "_cancel"), "onClick", "_cancel");
            this.connect(this._dialog, "onHide", "_clearDialog");
          },
          updateState: function() {
            this.button.set("disabled", this.get("disabled"));
          },
          setEditor: function(a) {
            this.editor = a;
            this._initButton();
          },
          _openDialog: function() {
            this._dialog.show();
            this._rte ||
              setTimeout(
                l.hitch(this, function() {
                  this._rte = new n._editor.RichText(
                    { height: this.height || "300px" },
                    this._uId + "_rte"
                  );
                  this._rte.startup();
                  this._rte.onLoadDeferred.addCallback(
                    l.hitch(this, function() {
                      l.animateProperty({
                        node: this._rte.domNode,
                        properties: { opacity: { start: 0.001, end: 1 } }
                      }).play();
                    })
                  );
                }),
                100
              );
          },
          _paste: function() {
            var a = h.html.format.prettyPrint(this._rte.get("value"));
            this._dialog.hide();
            var c;
            for (c = 0; c < this._filters.length; c++)
              var b = this._filters[c], a = a.replace(b.regexp, b.handler);
            a = h.html.format.prettyPrint(a);
            this.editor.focus();
            this.editor.execCommand("inserthtml", a);
          },
          _cancel: function() {
            this._dialog.hide();
          },
          _clearDialog: function() {
            this._rte.set("value", "");
          },
          destroy: function() {
            this._rte && this._rte.destroy();
            this._dialog && this._dialog.destroyRecursive();
            delete this._dialog;
            delete this._rte;
            this.inherited(arguments);
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          a.plugin ||
            "pastefromword" !== a.args.name.toLowerCase() ||
            (a.plugin = new f({
              width: "width" in a.args ? a.args.width : "400px",
              height: "height" in a.args ? a.args.width : "300px"
            }));
        });
        return f;
      });
    },
    "dojox/html/format": function() {
      define([
        "dojo/_base/kernel",
        "./entities",
        "dojo/_base/array",
        "dojo/_base/window",
        "dojo/_base/sniff"
      ], function(l, n, h, m, f) {
        var a = l.getObject("dojox.html.format", !0);
        a.prettyPrint = function(a, b, e, d, q) {
          var c = [],
            r = 0,
            t = [],
            u = "\t",
            g = "",
            p = [],
            x,
            w = /[=]([^"']+?)(\s|>)/g,
            v = /style=("[^"]*"|'[^']*'|\S*)/gi,
            A = /[\w-]+=("[^"]*"|'[^']*'|\S*)/gi;
          if (b && 0 < b && 10 > b) for (u = "", x = 0; x < b; x++) u += " ";
          b = m.doc.createElement("div");
          b.innerHTML = a;
          var E = n.encode,
            C = n.decode,
            F = b.ownerDocument.createElement("div"),
            D = function(a) {
              a = a.cloneNode(!1);
              F.appendChild(a);
              a = F.innerHTML;
              F.innerHTML = "";
              return a;
            },
            y = function() {
              var a;
              for (a = 0; a < r; a++) c.push(u);
            },
            z = function() {
              c.push("\n");
            },
            H = function(a) {
              var b, c;
              a = a.split("\n");
              for (b = 0; b < a.length; b++) a[b] = l.trim(a[b]);
              a = a.join(" ");
              a = l.trim(a);
              if ("" !== a) {
                var d = [];
                if (e && 0 < e) {
                  var g = "";
                  for (b = 0; b < r; b++) g += u;
                  b = g.length;
                  g = e;
                  for (e > b && (g -= b); a; )
                    if (a.length > e) {
                      for (b = g; 0 < b && " " !== a.charAt(b); b--);
                      if (!b)
                        for (b = g; b < a.length && " " !== a.charAt(b); b++);
                      var f = a.substring(0, b),
                        f = l.trim(f);
                      a = l.trim(
                        a.substring(b == a.length ? a.length : b + 1, a.length)
                      );
                      if (f) {
                        c = "";
                        for (b = 0; b < r; b++) c += u;
                        f = c + f + "\n";
                      }
                      d.push(f);
                    } else {
                      c = "";
                      for (b = 0; b < r; b++) c += u;
                      a = c + a + "\n";
                      d.push(a);
                      a = null;
                    }
                  return d.join("");
                }
                c = "";
                for (b = 0; b < r; b++) c += u;
                return c + a + "\n";
              }
              return "";
            },
            J = function(a) {
              if (a) {
                var b = a;
                b &&
                  ((b = b.replace(/&quot;/gi, '"')),
                  (b = b.replace(/&gt;/gi, "\x3e")),
                  (b = b.replace(/&lt;/gi, "\x3c")),
                  (b = b.replace(/&amp;/gi, "\x26")));
                var c, d;
                a = 0;
                for (var e = b.split("\n"), g = [], b = 0; b < e.length; b++) {
                  var f = e[b],
                    k = -1 < f.indexOf("\n");
                  if ((f = l.trim(f))) {
                    k = a;
                    for (c = 0; c < f.length; c++)
                      (d = f.charAt(c)),
                        "{" === d ? a++ : "}" === d && (a--, (k = a));
                    d = "";
                    for (c = 0; c < r + k; c++) d += u;
                    g.push(d + f + "\n");
                  } else k && 0 === b && g.push("\n");
                }
                a = g.join("");
              }
              return a;
            },
            B = function(a) {
              var b = a.nodeName.toLowerCase(),
                d = l.trim(D(a));
              a = d.substring(0, d.indexOf("\x3e") + 1);
              a = a.replace(w, '\x3d"$1"$2');
              a = a.replace(v, function(a) {
                var b = a.substring(0, 6);
                a = a.substring(6, a.length);
                var c = a.charAt(0);
                a = l.trim(a.substring(1, a.length - 1));
                a = a.split(";");
                var d = [];
                h.forEach(a, function(a) {
                  if ((a = l.trim(a)))
                    (a =
                      a.substring(0, a.indexOf(":")).toLowerCase() +
                      a.substring(a.indexOf(":"), a.length)),
                      d.push(a);
                });
                d = d.sort();
                a = d.join("; ");
                var e = l.trim(a);
                return e && ";" !== e ? b + c + (a + ";") + c : "";
              });
              var e = [];
              a = a.replace(A, function(a) {
                e.push(l.trim(a));
                return "";
              });
              e = e.sort();
              a = "\x3c" + b;
              e.length && (a += " " + e.join(" "));
              -1 != d.indexOf("\x3c/")
                ? (t.push(b), (a += "\x3e"))
                : ((a = q ? a + " /\x3e" : a + "\x3e"), t.push(!1));
              a: switch (b) {
                case "a":
                case "b":
                case "strong":
                case "s":
                case "strike":
                case "i":
                case "u":
                case "em":
                case "sup":
                case "sub":
                case "span":
                case "font":
                case "big":
                case "cite":
                case "q":
                case "small":
                  b = !0;
                  break a;
                default:
                  b = !1;
              }
              p.push(b);
              g && !b && (c.push(H(g)), (g = ""));
              b ? (g += a) : (y(), c.push(a), z(), r++);
            },
            G = function(a) {
              var b = a.childNodes;
              if (b) {
                var e;
                for (e = 0; e < b.length; e++) {
                  var k = b[e];
                  if (1 === k.nodeType) {
                    var h = l.trim(k.tagName.toLowerCase());
                    (f("ie") && k.parentNode != a) ||
                      (h && "/" === h.charAt(0)) ||
                      (B(k),
                      "script" === h
                        ? c.push(J(k.innerHTML))
                        : "pre" === h
                        ? ((k = k.innerHTML),
                          f("mozilla") &&
                            ((k = k.replace("\x3cbr\x3e", "\n")),
                            (k = k.replace("\x3cpre\x3e", "")),
                            (k = k.replace("\x3c/pre\x3e", ""))),
                          "\n" !== k.charAt(k.length - 1) && (k += "\n"),
                          c.push(k))
                        : G(k),
                      (k = p.pop()),
                      g && !k && (c.push(H(g)), (g = "")),
                      (h = t.pop())
                        ? ((h = "\x3c/" + h + "\x3e"),
                          k ? (g += h) : (r--, y(), c.push(h), z()))
                        : r--);
                  } else
                    3 === k.nodeType || 4 === k.nodeType
                      ? (g += E(k.nodeValue, d))
                      : 8 === k.nodeType &&
                        ((k = C(k.nodeValue, d)),
                        y(),
                        c.push("\x3c!--"),
                        z(),
                        r++,
                        c.push(H(k)),
                        r--,
                        y(),
                        c.push("--\x3e"),
                        z());
                }
              }
            };
          G(b);
          g && (c.push(H(g)), (g = ""));
          return c.join("");
        };
        return a;
      });
    },
    "dojox/editor/plugins/InsertAnchor": function() {
      define("dojo dijit dojox dijit/_editor/_Plugin dijit/_base/manager dijit/_editor/range dijit/_Templated dijit/TooltipDialog dijit/form/ValidationTextBox dijit/form/Select dijit/form/Button dijit/form/DropDownButton dojo/_base/declare dojo/i18n dojo/string dojo/NodeList-dom dojox/editor/plugins/ToolbarLineBreak dojo/i18n!dojox/editor/plugins/nls/InsertAnchor dojo/i18n!dijit/nls/common".split(
        " "
      ), function(l, n, h, m) {
        var f = l.declare("dojox.editor.plugins.InsertAnchor", m, {
          htmlTemplate:
            '\x3ca name\x3d"${anchorInput}" class\x3d"dijitEditorPluginInsertAnchorStyle"\x3e${textInput}\x3c/a\x3e',
          iconClassPrefix: "dijitAdditionalEditorIcon",
          _template:
            "\x3ctable role\x3d'presentation'\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_anchorInput'\x3e${anchor}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput dojoType\x3d'dijit.form.ValidationTextBox' required\x3d'true' id\x3d'${id}_anchorInput' name\x3d'anchorInput' intermediateChanges\x3d'true'\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_textInput'\x3e${text}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput dojoType\x3d'dijit.form.ValidationTextBox' required\x3d'true' id\x3d'${id}_textInput' name\x3d'textInput' intermediateChanges\x3d'true'\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cbutton dojoType\x3d'dijit.form.Button' type\x3d'submit' id\x3d'${id}_setButton'\x3e${set}\x3c/button\x3e\x3cbutton dojoType\x3d'dijit.form.Button' type\x3d'button' id\x3d'${id}_cancelButton'\x3e${cancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
          _initButton: function() {
            var a = this,
              c = l.i18n.getLocalization(
                "dojox.editor.plugins",
                "InsertAnchor",
                this.lang
              ),
              b = (this.dropDown = new n.TooltipDialog({
                title: c.title,
                execute: l.hitch(this, "setValue"),
                onOpen: function() {
                  a._onOpenDialog();
                  n.TooltipDialog.prototype.onOpen.apply(this, arguments);
                },
                onCancel: function() {
                  setTimeout(l.hitch(a, "_onCloseDialog"), 0);
                }
              }));
            this.button = new n.form.DropDownButton({
              label: c.insertAnchor,
              showLabel: !1,
              iconClass:
                this.iconClassPrefix +
                " " +
                this.iconClassPrefix +
                "InsertAnchor",
              tabIndex: "-1",
              dropDown: this.dropDown
            });
            c.id = n.getUniqueId(this.editor.id);
            this._uniqueId = c.id;
            this.dropDown.set(
              "content",
              b.title +
                "\x3cdiv style\x3d'border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'\x3e\x3c/div\x3e" +
                l.string.substitute(this._template, c)
            );
            b.startup();
            this._anchorInput = n.byId(this._uniqueId + "_anchorInput");
            this._textInput = n.byId(this._uniqueId + "_textInput");
            this._setButton = n.byId(this._uniqueId + "_setButton");
            this.connect(
              n.byId(this._uniqueId + "_cancelButton"),
              "onClick",
              function() {
                this.dropDown.onCancel();
              }
            );
            this._anchorInput &&
              this.connect(this._anchorInput, "onChange", "_checkInput");
            this._textInput &&
              this.connect(this._anchorInput, "onChange", "_checkInput");
            this.editor.contentDomPreFilters.push(
              l.hitch(this, this._preDomFilter)
            );
            this.editor.contentDomPostFilters.push(
              l.hitch(this, this._postDomFilter)
            );
            this._setup();
          },
          updateState: function() {
            this.button.set("disabled", this.get("disabled"));
          },
          setEditor: function(a) {
            this.editor = a;
            this._initButton();
          },
          _checkInput: function() {
            var a = !0;
            this._anchorInput.isValid() && (a = !1);
            this._setButton.set("disabled", a);
          },
          _setup: function() {
            this.editor.onLoadDeferred.addCallback(
              l.hitch(this, function() {
                this.connect(
                  this.editor.editNode,
                  "ondblclick",
                  this._onDblClick
                );
                setTimeout(
                  l.hitch(this, function() {
                    this._applyStyles();
                  }),
                  100
                );
              })
            );
          },
          getAnchorStyle: function() {
            var a = l
              .moduleUrl(h._scopeName, "editor/plugins/resources")
              .toString();
            if (!a.match(/^https?:\/\//i) && !a.match(/^file:\/\//i)) {
              var c;
              c =
                "/" === a.charAt(0)
                  ? l.doc.location.protocol + "//" + l.doc.location.host
                  : this._calcBaseUrl(l.global.location.href);
              "/" !== c[c.length - 1] && "/" !== a.charAt(0) && (c += "/");
              a = c + a;
            }
            return "@media screen {\n\t.dijitEditorPluginInsertAnchorStyle {\n\t\tbackground-image: url({MODURL}/images/anchor.gif);\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-position: top left;\n\t\tborder-width: 1px;\n\t\tborder-style: dashed;\n\t\tborder-color: #D0D0D0;\n\t\tpadding-left: 20px;\n\t}\n}\n".replace(
              /\{MODURL\}/gi,
              a
            );
          },
          _applyStyles: function() {
            if (!this._styled)
              try {
                this._styled = !0;
                var a = this.editor.document,
                  c = this.getAnchorStyle();
                if (l.isIE) a.createStyleSheet("").cssText = c;
                else {
                  var b = a.createElement("style");
                  b.appendChild(a.createTextNode(c));
                  a.getElementsByTagName("head")[0].appendChild(b);
                }
              } catch (e) {}
          },
          _calcBaseUrl: function(a) {
            var c = null;
            null !== a &&
              ((c = a.indexOf("?")),
              -1 != c && (a = a.substring(0, c)),
              (c = a.lastIndexOf("/")),
              (c = 0 < c && c < a.length ? a.substring(0, c) : a));
            return c;
          },
          _checkValues: function(a) {
            a &&
              (a.anchorInput &&
                (a.anchorInput = a.anchorInput.replace(/"/g, "\x26quot;")),
              a.textInput || (a.textInput = "\x26nbsp;"));
            return a;
          },
          setValue: function(a) {
            this._onCloseDialog();
            if (!this.editor.window.getSelection) {
              var c = n.range.getSelection(this.editor.window).getRangeAt(0)
                .endContainer;
              3 === c.nodeType && (c = c.parentNode);
              c &&
                c.nodeName &&
                "a" !== c.nodeName.toLowerCase() &&
                (c = this.editor._sCall("getSelectedElement", ["a"]));
              c &&
                c.nodeName &&
                "a" === c.nodeName.toLowerCase() &&
                this.editor.queryCommandEnabled("unlink") &&
                (this.editor._sCall("selectElementChildren", [c]),
                this.editor.execCommand("unlink"));
            }
            a = this._checkValues(a);
            this.editor.execCommand(
              "inserthtml",
              l.string.substitute(this.htmlTemplate, a)
            );
          },
          _onCloseDialog: function() {
            this.editor.focus();
          },
          _getCurrentValues: function(a) {
            var c, b;
            a && "a" === a.tagName.toLowerCase() && l.attr(a, "name")
              ? ((c = l.attr(a, "name")),
                (b = a.textContent || a.innerText),
                this.editor._sCall("selectElement", [a, !0]))
              : (b = this.editor._sCall("getSelectedText"));
            return { anchorInput: c || "", textInput: b || "" };
          },
          _onOpenDialog: function() {
            var a;
            this.editor.window.getSelection
              ? (a = this.editor._sCall("getAncestorElement", ["a"]))
              : ((a = n.range.getSelection(this.editor.window).getRangeAt(0)
                  .endContainer),
                3 === a.nodeType && (a = a.parentNode),
                a &&
                  a.nodeName &&
                  "a" !== a.nodeName.toLowerCase() &&
                  (a = this.editor._sCall("getSelectedElement", ["a"])));
            this.dropDown.reset();
            this._setButton.set("disabled", !0);
            this.dropDown.set("value", this._getCurrentValues(a));
          },
          _onDblClick: function(a) {
            a &&
              a.target &&
              ((a = a.target),
              "a" === (a.tagName ? a.tagName.toLowerCase() : "") &&
                l.attr(a, "name") &&
                (this.editor.onDisplayChanged(),
                this.editor._sCall("selectElement", [a]),
                setTimeout(
                  l.hitch(this, function() {
                    this.button.set("disabled", !1);
                    this.button.openDropDown();
                    this.button.dropDown.focus && this.button.dropDown.focus();
                  }),
                  10
                )));
          },
          _preDomFilter: function(a) {
            l.query("a[name]:not([href])", this.editor.editNode).addClass(
              "dijitEditorPluginInsertAnchorStyle"
            );
          },
          _postDomFilter: function(a) {
            a &&
              l
                .query("a[name]:not([href])", a)
                .removeClass("dijitEditorPluginInsertAnchorStyle");
            return a;
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          if (!a.plugin) {
            var c = a.args.name;
            c && (c = c.toLowerCase());
            "insertanchor" === c && (a.plugin = new f());
          }
        });
        return f;
      });
    },
    "dojox/editor/plugins/Blockquote": function() {
      define("dojo dijit dojox dijit/_editor/_Plugin dijit/form/ToggleButton dojo/_base/connect dojo/_base/declare dojo/i18n dojo/i18n!dojox/editor/plugins/nls/Blockquote".split(
        " "
      ), function(l, n, h, m) {
        var f = l.declare("dojox.editor.plugins.Blockquote", m, {
          iconClassPrefix: "dijitAdditionalEditorIcon",
          _initButton: function() {
            this._nlsResources = l.i18n.getLocalization(
              "dojox.editor.plugins",
              "Blockquote"
            );
            this.button = new n.form.ToggleButton({
              label: this._nlsResources.blockquote,
              showLabel: !1,
              iconClass:
                this.iconClassPrefix +
                " " +
                this.iconClassPrefix +
                "Blockquote",
              tabIndex: "-1",
              onClick: l.hitch(this, "_toggleQuote")
            });
          },
          setEditor: function(a) {
            this.editor = a;
            this._initButton();
            this.connect(
              this.editor,
              "onNormalizedDisplayChanged",
              "updateState"
            );
            a.customUndo = !0;
          },
          _toggleQuote: function(a) {
            try {
              var c = this.editor;
              c.focus();
              var b = this.button.get("checked"),
                e = n.range.getSelection(c.window),
                d,
                f,
                k,
                h;
              e && 0 < e.rangeCount && (d = e.getRangeAt(0));
              if (d) {
                c.beginEditing();
                if (b) {
                  var m, u;
                  if (d.startContainer === d.endContainer) {
                    if (this._isRootInline(d.startContainer)) {
                      for (
                        k = d.startContainer;
                        k && k.parentNode !== c.editNode;

                      )
                        k = k.parentNode;
                      for (
                        ;
                        k &&
                        k.previousSibling &&
                        (this._isTextElement(k) ||
                          (1 === k.nodeType &&
                            this._isInlineFormat(this._getTagName(k))));

                      )
                        k = k.previousSibling;
                      k &&
                        1 === k.nodeType &&
                        !this._isInlineFormat(this._getTagName(k)) &&
                        (k = k.nextSibling);
                      if (k)
                        for (
                          m = c.document.createElement("blockquote"),
                            l.place(m, k, "after"),
                            m.appendChild(k),
                            h = m.nextSibling;
                          h &&
                          (this._isTextElement(h) ||
                            (1 === h.nodeType &&
                              this._isInlineFormat(this._getTagName(h))));

                        )
                          m.appendChild(h), (h = m.nextSibling);
                    } else {
                      for (
                        var g = d.startContainer;
                        (this._isTextElement(g) ||
                          this._isInlineFormat(this._getTagName(g)) ||
                          "li" === this._getTagName(g)) &&
                        g !== c.editNode &&
                        g !== c.document.body;

                      )
                        g = g.parentNode;
                      g !== c.editNode &&
                        g !== g.ownerDocument.documentElement &&
                        ((m = c.document.createElement("blockquote")),
                        l.place(m, g, "after"),
                        m.appendChild(g));
                    }
                    m &&
                      (c._sCall("selectElementChildren", [m]),
                      c._sCall("collapse", [!0]));
                  } else {
                    var p;
                    k = d.startContainer;
                    for (
                      h = d.endContainer;
                      k &&
                      this._isTextElement(k) &&
                      k.parentNode !== c.editNode;

                    )
                      k = k.parentNode;
                    for (p = k; p.nextSibling && c._sCall("inSelection", [p]); )
                      p = p.nextSibling;
                    h = p;
                    if (h === c.editNode || h === c.document.body) {
                      m = c.document.createElement("blockquote");
                      l.place(m, k, "after");
                      u = this._getTagName(k);
                      if (this._isTextElement(k) || this._isInlineFormat(u))
                        for (
                          c = k;
                          c &&
                          (this._isTextElement(c) ||
                            (1 === c.nodeType &&
                              this._isInlineFormat(this._getTagName(c))));

                        )
                          m.appendChild(c), (c = m.nextSibling);
                      else m.appendChild(k);
                      return;
                    }
                    h = h.nextSibling;
                    for (p = k; p && p !== h; ) {
                      if (1 === p.nodeType) {
                        if (((u = this._getTagName(p)), "br" !== u)) {
                          if (
                            !window.getSelection &&
                            "p" === u &&
                            this._isEmpty(p)
                          ) {
                            p = p.nextSibling;
                            continue;
                          }
                          this._isInlineFormat(u)
                            ? m ||
                              ((m = c.document.createElement("blockquote")),
                              l.place(m, p, "after"))
                            : (m &&
                                this._isEmpty(m) &&
                                m.parentNode.removeChild(m),
                              (m = c.document.createElement("blockquote")),
                              l.place(m, p, "after"));
                          m.appendChild(p);
                          p = m;
                        }
                      } else
                        this._isTextElement(p) &&
                          (m ||
                            ((m = c.document.createElement("blockquote")),
                            l.place(m, p, "after")),
                          m.appendChild(p),
                          (p = m));
                      p = p.nextSibling;
                    }
                    m &&
                      (this._isEmpty(m)
                        ? m.parentNode.removeChild(m)
                        : (c._sCall("selectElementChildren", [m]),
                          c._sCall("collapse", [!0])),
                      (m = null));
                  }
                } else if (((m = !1), d.startContainer === d.endContainer)) {
                  for (
                    f = d.endContainer;
                    f && f !== c.editNode && f !== c.document.body;

                  ) {
                    if (
                      "blockquote" ===
                      (f.tagName ? f.tagName.toLowerCase() : "")
                    ) {
                      m = !0;
                      break;
                    }
                    f = f.parentNode;
                  }
                  if (m) {
                    for (var x; f.firstChild; )
                      (x = f.firstChild), l.place(x, f, "before");
                    f.parentNode.removeChild(f);
                    x &&
                      (c._sCall("selectElementChildren", [x]),
                      c._sCall("collapse", [!0]));
                  }
                } else {
                  k = d.startContainer;
                  for (
                    h = d.endContainer;
                    k && this._isTextElement(k) && k.parentNode !== c.editNode;

                  )
                    k = k.parentNode;
                  for (
                    d = [];
                    k && k.nextSibling && c._sCall("inSelection", [k]);

                  )
                    k.parentNode &&
                      "blockquote" === this._getTagName(k.parentNode) &&
                      (k = k.parentNode),
                      d.push(k),
                      (k = k.nextSibling);
                  for (var w = this._findBlockQuotes(d); w.length; ) {
                    var v = w.pop();
                    if (v.parentNode) {
                      for (; v.firstChild; ) l.place(v.firstChild, v, "before");
                      v.parentNode.removeChild(v);
                    }
                  }
                }
                c.endEditing();
              }
              c.onNormalizedDisplayChanged();
            } catch (A) {}
          },
          updateState: function() {
            var a = this.editor,
              c = this.get("disabled");
            if (
              a &&
              a.isLoaded &&
              this.button &&
              (this.button.set("disabled", c), !c)
            ) {
              var b,
                c = !1,
                e = n.range.getSelection(a.window);
              e &&
                0 < e.rangeCount &&
                (e = e.getRangeAt(0)) &&
                (b = e.endContainer);
              for (; b && b !== a.editNode && b !== a.document; ) {
                if (
                  "blockquote" === (b.tagName ? b.tagName.toLowerCase() : "")
                ) {
                  c = !0;
                  break;
                }
                b = b.parentNode;
              }
              this.button.set("checked", c);
            }
          },
          _findBlockQuotes: function(a) {
            var c = [];
            if (a) {
              var b;
              for (b = 0; b < a.length; b++) {
                var e = a[b];
                1 === e.nodeType &&
                  ("blockquote" === this._getTagName(e) && c.push(e),
                  e.childNodes &&
                    0 < e.childNodes.length &&
                    (c = c.concat(this._findBlockQuotes(e.childNodes))));
              }
            }
            return c;
          },
          _getTagName: function(a) {
            var c = "";
            a &&
              1 === a.nodeType &&
              (c = a.tagName ? a.tagName.toLowerCase() : "");
            return c;
          },
          _isRootInline: function(a) {
            var c = this.editor;
            if (
              (this._isTextElement(a) && a.parentNode === c.editNode) ||
              (1 === a.nodeType &&
                this._isInlineFormat(a) &&
                a.parentNode === c.editNode)
            )
              return !0;
            if (
              this._isTextElement(a) &&
              this._isInlineFormat(this._getTagName(a.parentNode))
            ) {
              for (
                a = a.parentNode;
                a &&
                a !== c.editNode &&
                this._isInlineFormat(this._getTagName(a));

              )
                a = a.parentNode;
              if (a === c.editNode) return !0;
            }
            return !1;
          },
          _isTextElement: function(a) {
            return (a && 3 === a.nodeType) || 4 === a.nodeType ? !0 : !1;
          },
          _isEmpty: function(a) {
            if (a.childNodes) {
              var c = !0,
                b;
              for (b = 0; b < a.childNodes.length; b++) {
                var e = a.childNodes[b];
                if (1 === e.nodeType) {
                  if ("p" !== this._getTagName(e) || l.trim(e.innerHTML)) {
                    c = !1;
                    break;
                  }
                } else if (this._isTextElement(e)) {
                  if (
                    (e = l.trim(e.nodeValue)) &&
                    "\x26nbsp;" !== e &&
                    "\u00a0" !== e
                  ) {
                    c = !1;
                    break;
                  }
                } else {
                  c = !1;
                  break;
                }
              }
              return c;
            }
            return !0;
          },
          _isInlineFormat: function(a) {
            switch (a) {
              case "a":
              case "b":
              case "strong":
              case "s":
              case "strike":
              case "i":
              case "u":
              case "em":
              case "sup":
              case "sub":
              case "span":
              case "font":
              case "big":
              case "cite":
              case "q":
              case "img":
              case "small":
                return !0;
              default:
                return !1;
            }
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          a.plugin ||
            "blockquote" !== a.args.name.toLowerCase() ||
            (a.plugin = new f({}));
        });
        return f;
      });
    },
    "dojox/editor/plugins/UploadImage": function() {
      define("dojo dijit dojox dijit/_editor/_Plugin dojo/_base/connect dojo/_base/declare dojox/form/FileUploader dijit/_editor/_Plugin".split(
        " "
      ), function(l, n, h, m) {
        l.experimental("dojox.editor.plugins.UploadImage");
        var f = l.declare("dojox.editor.plugins.UploadImage", m, {
          tempImageUrl: "",
          iconClassPrefix: "editorIcon",
          useDefaultCommand: !1,
          uploadUrl: "",
          button: null,
          label: "Upload",
          setToolbar: function(a) {
            this.button.destroy();
            this.createFileInput();
            a.addChild(this.button);
          },
          _initButton: function() {
            this.command = "uploadImage";
            this.editor.commands[this.command] = "Upload Image";
            this.inherited("_initButton", arguments);
            delete this.command;
          },
          updateState: function() {
            this.button.set("disabled", this.get("disabled"));
          },
          createFileInput: function() {
            var a = l.create("span", { innerHTML: "." }, document.body);
            l.style(a, {
              width: "40px",
              height: "20px",
              paddingLeft: "8px",
              paddingRight: "8px"
            });
            this.button = new h.form.FileUploader(
              {
                isDebug: !0,
                uploadUrl: this.uploadUrl,
                uploadOnChange: !0,
                selectMultipleFiles: !1,
                baseClass: "dojoxEditorUploadNorm",
                hoverClass: "dojoxEditorUploadHover",
                activeClass: "dojoxEditorUploadActive",
                disabledClass: "dojoxEditorUploadDisabled"
              },
              a
            );
            this.connect(this.button, "onChange", "insertTempImage");
            this.connect(this.button, "onComplete", "onComplete");
          },
          onComplete: function(a, c, b) {
            a = a[0];
            c = l.byId(this.currentImageId, this.editor.document);
            b = this.downloadPath ? this.downloadPath + a.name : a.file;
            c.src = b;
            l.attr(c, "_djrealurl", b);
            a.width && ((c.width = a.width), (c.height = a.height));
          },
          insertTempImage: function() {
            this.currentImageId = "img_" + new Date().getTime();
            this.editor.execCommand(
              "inserthtml",
              '\x3cimg id\x3d"' +
                this.currentImageId +
                '" src\x3d"' +
                this.tempImageUrl +
                '" width\x3d"32" height\x3d"32"/\x3e'
            );
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          if (!a.plugin)
            switch (a.args.name) {
              case "uploadImage":
                a.plugin = new f({ url: a.args.url });
            }
        });
        return f;
      });
    },
    "dojox/form/FileUploader": function() {
      define("dojo/_base/kernel dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/window dojo/_base/sniff dojo/query dojo/dom dojo/dom-style dojo/dom-geometry dojo/dom-attr dojo/dom-class dojo/dom-construct dojo/dom-form dojo/_base/config dijit/_base/manager dojo/io/iframe dojo/_base/Color dojo/_base/unload dijit/_Widget dijit/_TemplatedMixin dijit/_Contained dojox/embed/Flash dojox/embed/flashVars dojox/html/styles".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D,
        y
      ) {
        l.deprecated(
          "dojox.form.FileUploader",
          "Use dojox.form.Uploader",
          "2.0"
        );
        return n("dojox.form.FileUploader", [A, E, C], {
          swfPath:
            g.uploaderPath ||
            require.toUrl("dojox/form/resources/fileuploader.swf"),
          templateString:
            '\x3cdiv\x3e\x3cdiv dojoAttachPoint\x3d"progNode"\x3e\x3cdiv dojoAttachPoint\x3d"progTextNode"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv dojoAttachPoint\x3d"insideNode" class\x3d"uploaderInsideNode"\x3e\x3c/div\x3e\x3c/div\x3e',
          uploadUrl: "",
          isDebug: !1,
          devMode: !1,
          baseClass: "dojoxUploaderNorm",
          hoverClass: "dojoxUploaderHover",
          activeClass: "dojoxUploaderActive",
          disabledClass: "dojoxUploaderDisabled",
          force: "",
          uploaderType: "",
          flashObject: null,
          flashMovie: null,
          insideNode: null,
          deferredUploading: 1,
          fileListId: "",
          uploadOnChange: !1,
          selectMultipleFiles: !0,
          htmlFieldName: "uploadedfile",
          flashFieldName: "flashUploadFiles",
          fileMask: null,
          minFlashVersion: 9,
          tabIndex: -1,
          showProgress: !1,
          progressMessage: "Loading",
          progressBackgroundUrl: require.toUrl(
            "dijit/themes/tundra/images/buttonActive.png"
          ),
          progressBackgroundColor: "#ededed",
          progressWidgetId: "",
          skipServerCheck: !1,
          serverTimeout: 5e3,
          log: function() {
            this.isDebug &&
              console.log(Array.prototype.slice.call(arguments).join(" "));
          },
          constructor: function() {
            this._subs = [];
          },
          postMixInProperties: function() {
            this.fileList = [];
            this._cons = [];
            this.fileMask = this.fileMask || [];
            this.fileInputs = [];
            this.fileCount = 0;
            this._disabled = this.flashReady = !1;
            this.force = this.force.toLowerCase();
            this.uploaderType =
              (F.available >= this.minFlashVersion || "flash" == this.force) &&
              "html" != this.force
                ? "flash"
                : "html";
            this.deferredUploading =
              !0 === this.deferredUploading ? 1 : this.deferredUploading;
            this._refNode = this.srcNodeRef;
            this.getButtonStyle();
          },
          startup: function() {},
          postCreate: function() {
            this.inherited(arguments);
            this.setButtonStyle();
            var a;
            "flash" == this.uploaderType
              ? (a = "createFlashUploader")
              : ((this.uploaderType = "html"), (a = "createHtmlUploader"));
            this[a]();
            this.fileListId &&
              this.connect(e.byId(this.fileListId), "click", function(a) {
                a = a.target.parentNode.parentNode.parentNode;
                a.id &&
                  -1 < a.id.indexOf("file_") &&
                  this.removeFile(a.id.split("file_")[1]);
              });
            v.addOnUnload(this, this.destroy);
          },
          getHiddenNode: function(a) {
            if (!a) return null;
            var b = null;
            for (a = a.parentNode; a && "body" != a.tagName.toLowerCase(); ) {
              if ("none" == d.get(a, "display")) {
                b = a;
                break;
              }
              a = a.parentNode;
            }
            return b;
          },
          getButtonStyle: function() {
            var a = this.srcNodeRef;
            (this._hiddenNode = this.getHiddenNode(a)) &&
              d.set(this._hiddenNode, "display", "block");
            if (!a && this.button && this.button.domNode) {
              var c = !0,
                a = this.button.domNode.className + " dijitButtonNode",
                e = this.getText(b(".dijitButtonText", this.button.domNode)[0]);
              this.srcNodeRef = a = t.place(
                '\x3cbutton id\x3d"' +
                  this.button.id +
                  '" class\x3d"' +
                  a +
                  '"\x3e' +
                  e +
                  "\x3c/button\x3e",
                this.button.domNode,
                "after"
              );
              this.button.destroy();
              this.baseClass = "dijitButton";
              this.hoverClass = "dijitButtonHover";
              this.pressClass = "dijitButtonActive";
              this.disabledClass = "dijitButtonDisabled";
            } else !this.srcNodeRef && this.button && (a = this.button);
            k.get(a, "class") && (this.baseClass += " " + k.get(a, "class"));
            k.set(a, "class", this.baseClass);
            this.norm = this.getStyle(a);
            this.width = this.norm.w;
            this.height = this.norm.h;
            "flash" == this.uploaderType
              ? ((this.over = this.getTempNodeStyle(
                  a,
                  this.baseClass + " " + this.hoverClass,
                  c
                )),
                (this.down = this.getTempNodeStyle(
                  a,
                  this.baseClass + " " + this.activeClass,
                  c
                )),
                (this.dsbl = this.getTempNodeStyle(
                  a,
                  this.baseClass + " " + this.disabledClass,
                  c
                )),
                (this.fhtml = {
                  cn: this.getText(a),
                  nr: this.norm,
                  ov: this.over,
                  dn: this.down,
                  ds: this.dsbl
                }))
              : ((this.fhtml = { cn: this.getText(a), nr: this.norm }),
                "middle" == this.norm.va && (this.norm.lh = this.norm.h));
            this.devMode &&
              (this.log(
                "classes - base:",
                this.baseClass,
                " hover:",
                this.hoverClass,
                "active:",
                this.activeClass
              ),
              this.log("fhtml:", this.fhtml),
              this.log("norm:", this.norm),
              this.log("over:", this.over),
              this.log("down:", this.down));
          },
          setButtonStyle: function() {
            d.set(this.domNode, {
              width: this.fhtml.nr.w + "px",
              height: this.fhtml.nr.h + "px",
              padding: "0px",
              lineHeight: "normal",
              position: "relative"
            });
            "html" == this.uploaderType &&
              "middle" == this.norm.va &&
              d.set(this.domNode, "lineHeight", this.norm.lh + "px");
            this.showProgress
              ? ((this.progTextNode.innerHTML = this.progressMessage),
                d.set(this.progTextNode, {
                  width: this.fhtml.nr.w + "px",
                  height: this.fhtml.nr.h + 0 + "px",
                  padding: "0px",
                  margin: "0px",
                  left: "0px",
                  lineHeight: this.fhtml.nr.h + 0 + "px",
                  position: "absolute"
                }),
                d.set(this.progNode, {
                  width: this.fhtml.nr.w + "px",
                  height: this.fhtml.nr.h + 0 + "px",
                  padding: "0px",
                  margin: "0px",
                  left: "0px",
                  position: "absolute",
                  display: "none",
                  backgroundImage: "url(" + this.progressBackgroundUrl + ")",
                  backgroundPosition: "bottom",
                  backgroundRepeat: "repeat-x",
                  backgroundColor: this.progressBackgroundColor
                }))
              : t.destroy(this.progNode);
            d.set(this.insideNode, {
              position: "absolute",
              top: "0px",
              left: "0px",
              display: ""
            });
            r.add(this.domNode, this.srcNodeRef.className);
            -1 < this.fhtml.nr.d.indexOf("inline") &&
              r.add(this.domNode, "dijitInline");
            try {
              this.insideNode.innerHTML = this.fhtml.cn;
            } catch (H) {
              if ("flash" == this.uploaderType) {
                this.insideNode = this.insideNode.parentNode.removeChild(
                  this.insideNode
                );
                a.body().appendChild(this.insideNode);
                this.insideNode.innerHTML = this.fhtml.cn;
                var b = f.connect(this, "onReady", this, function() {
                  f.disconnect(b);
                  this.insideNode = this.insideNode.parentNode.removeChild(
                    this.insideNode
                  );
                  this.domNode.appendChild(this.insideNode);
                });
              } else
                this.insideNode.appendChild(
                  document.createTextNode(this.fhtml.cn)
                );
            }
            this._hiddenNode && d.set(this._hiddenNode, "display", "none");
          },
          onChange: function(a) {},
          onProgress: function(a) {},
          onComplete: function(a) {},
          onCancel: function() {},
          onError: function(a) {},
          onReady: function(a) {},
          onLoad: function(a) {},
          submit: function(a) {
            a = a ? u.toObject(a) : null;
            this.upload(a);
            return !1;
          },
          upload: function(a) {
            if (!this.fileList.length) return !1;
            if (!this.uploadUrl)
              return console.warn("uploadUrl not provided. Aborting."), !1;
            this.showProgress || this.set("disabled", !0);
            if (this.progressWidgetId) {
              var b = p.byId(this.progressWidgetId).domNode;
              "none" == d.get(b, "display") &&
                ((this.restoreProgDisplay = "none"),
                d.set(b, "display", "block"));
              "hidden" == d.get(b, "visibility") &&
                ((this.restoreProgDisplay = "hidden"),
                d.set(b, "visibility", "visible"));
            }
            a && !a.target && (this.postData = a);
            this.log(
              "upload type:",
              this.uploaderType,
              " - postData:",
              this.postData
            );
            for (a = 0; a < this.fileList.length; a++)
              (b = this.fileList[a]),
                (b.bytesLoaded = 0),
                (b.bytesTotal = b.size || 1e5),
                (b.percent = 0);
            "flash" == this.uploaderType
              ? this.uploadFlash()
              : this.uploadHTML();
            return !1;
          },
          removeFile: function(a, b) {
            var c;
            for (c = 0; c < this.fileList.length; c++)
              if (this.fileList[c].name == a) {
                b || this.fileList.splice(c, 1);
                break;
              }
            "flash" == this.uploaderType
              ? this.flashMovie.removeFile(a)
              : b ||
                (t.destroy(this.fileInputs[c]),
                this.fileInputs.splice(c, 1),
                this._renumberInputs());
            this.fileListId && t.destroy("file_" + a);
          },
          destroy: function() {
            "flash" != this.uploaderType || this.flashMovie
              ? (m.forEach(this._subs, f.unsubscribe, dojo),
                m.forEach(this._cons, f.disconnect, dojo),
                this.scrollConnect && f.disconnect(this.scrollConnect),
                "flash" == this.uploaderType
                  ? (this.flashObject.destroy(), delete this.flashObject)
                  : (t.destroy(this._fileInput), t.destroy(this._formNode)),
                this.inherited(arguments))
              : this._cons.push(f.connect(this, "onLoad", this, "destroy"));
          },
          _displayProgress: function(a) {
            !0 === a
              ? ("flash" == this.uploaderType
                  ? d.set(this.insideNode, "top", "-2500px")
                  : d.set(this.insideNode, "display", "none"),
                d.set(this.progNode, "display", ""))
              : !1 === a
              ? (d.set(this.insideNode, { display: "", top: "0" }),
                d.set(this.progNode, "display", "none"))
              : d.set(this.progNode, "width", a * this.fhtml.nr.w + "px");
          },
          _animateProgress: function() {
            this._displayProgress(!0);
            var a = !1,
              b = f.connect(this, "_complete", function() {
                f.disconnect(b);
                a = !0;
              }),
              c = 0,
              d = setInterval(
                h.hitch(this, function() {
                  c += 5;
                  c > this.fhtml.nr.w && ((c = 0), (a = !0));
                  this._displayProgress(c / this.fhtml.nr.w);
                  a &&
                    (clearInterval(d),
                    setTimeout(
                      h.hitch(this, function() {
                        this._displayProgress(!1);
                      }),
                      500
                    ));
                }),
                50
              );
          },
          _error: function(a) {
            "string" == typeof a && (a = Error(a));
            this.onError(a);
          },
          _addToFileList: function() {
            if (this.fileListId) {
              var a = "";
              m.forEach(
                this.fileList,
                function(b) {
                  a +=
                    '\x3ctable id\x3d"file_' +
                    b.name +
                    '" class\x3d"fileToUpload"\x3e\x3ctr\x3e\x3ctd class\x3d"fileToUploadClose"\x3e\x3c/td\x3e\x3ctd class\x3d"fileToUploadName"\x3e' +
                    b.name +
                    '\x3c/td\x3e\x3ctd class\x3d"fileToUploadSize"\x3e' +
                    (b.size ? Math.ceil(0.001 * b.size) + "kb" : "") +
                    "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e";
                },
                this
              );
              e.byId(this.fileListId).innerHTML = a;
            }
          },
          _change: function(a) {
            c("ie") &&
              m.forEach(a, function(a) {
                a.name = a.name.split("\\")[a.name.split("\\").length - 1];
              });
            this.selectMultipleFiles
              ? (this.fileList = this.fileList.concat(a))
              : (this.fileList[0] && this.removeFile(this.fileList[0].name, !0),
                (this.fileList = a));
            this._addToFileList();
            this.onChange(a);
            this.uploadOnChange
              ? ("html" == this.uploaderType && this._buildFileInput(),
                this.upload())
              : "html" == this.uploaderType &&
                this.selectMultipleFiles &&
                (this._buildFileInput(), this._connectInput());
          },
          _complete: function(a) {
            a = h.isArray(a) ? a : [a];
            m.forEach(
              a,
              function(a) {
                a.ERROR && this._error(a.ERROR);
              },
              this
            );
            m.forEach(
              this.fileList,
              function(a) {
                a.bytesLoaded = 1;
                a.bytesTotal = 1;
                a.percent = 100;
                this._progress(a);
              },
              this
            );
            m.forEach(
              this.fileList,
              function(a) {
                this.removeFile(a.name, !0);
              },
              this
            );
            this.onComplete(a);
            this.fileList = [];
            this._resetHTML();
            this.set("disabled", !1);
            this.restoreProgDisplay &&
              setTimeout(
                h.hitch(this, function() {
                  d.set(
                    p.byId(this.progressWidgetId).domNode,
                    "none" == this.restoreProgDisplay
                      ? "display"
                      : "visibility",
                    this.restoreProgDisplay
                  );
                }),
                500
              );
          },
          _progress: function(a) {
            for (var b = 0, c = 0, d = 0; d < this.fileList.length; d++) {
              var e = this.fileList[d];
              e.name == a.name &&
                ((e.bytesLoaded = a.bytesLoaded),
                (e.bytesTotal = a.bytesTotal),
                (e.percent = Math.ceil((e.bytesLoaded / e.bytesTotal) * 100)),
                this.log(e.name, "percent:", e.percent));
              c += Math.ceil(0.001 * e.bytesLoaded);
              b += Math.ceil(0.001 * e.bytesTotal);
            }
            a = Math.ceil((c / b) * 100);
            this.progressWidgetId &&
              p.byId(this.progressWidgetId).update({ progress: a + "%" });
            this.showProgress && this._displayProgress(0.01 * a);
            this.onProgress(this.fileList);
          },
          _getDisabledAttr: function() {
            return this._disabled;
          },
          _setDisabledAttr: function(a) {
            if (this._disabled != a) {
              if ("flash" == this.uploaderType) {
                if (!this.flashReady) {
                  var b = f.connect(this, "onLoad", this, function() {
                    f.disconnect(b);
                    this._setDisabledAttr(a);
                  });
                  return;
                }
                this._disabled = a;
                this.flashMovie.doDisable(a);
              } else
                (this._disabled = a),
                  d.set(
                    this._fileInput,
                    "display",
                    this._disabled ? "none" : ""
                  );
              r.toggle(this.domNode, this.disabledClass, a);
            }
          },
          _onFlashBlur: function() {
            this.flashMovie.blur();
            if (!this.nextFocusObject && this.tabIndex)
              for (var a = b("[tabIndex]"), c = 0; c < a.length; c++)
                if (a[c].tabIndex >= Number(this.tabIndex) + 1) {
                  this.nextFocusObject = a[c];
                  break;
                }
            this.nextFocusObject.focus();
          },
          _disconnect: function() {
            m.forEach(this._cons, f.disconnect, dojo);
          },
          uploadHTML: function() {
            this.selectMultipleFiles && t.destroy(this._fileInput);
            this._setHtmlPostData();
            this.showProgress && this._animateProgress();
            x.send({
              url: this.uploadUrl.toString(),
              form: this._formNode,
              handleAs: "json",
              error: h.hitch(this, function(a) {
                this._error("HTML Upload Error:" + a.message);
              }),
              load: h.hitch(this, function(a, b, c) {
                this._complete(a);
              })
            });
          },
          createHtmlUploader: function() {
            this._buildForm();
            this._setFormStyle();
            this._buildFileInput();
            this._connectInput();
            this._styleContent();
            d.set(this.insideNode, "visibility", "visible");
            this.onReady();
          },
          _connectInput: function() {
            this._disconnect();
            this._cons.push(
              f.connect(this._fileInput, "mouseover", this, function(a) {
                r.add(this.domNode, this.hoverClass);
                this.onMouseOver(a);
              })
            );
            this._cons.push(
              f.connect(this._fileInput, "mouseout", this, function(a) {
                setTimeout(
                  h.hitch(this, function() {
                    r.remove(this.domNode, this.activeClass);
                    r.remove(this.domNode, this.hoverClass);
                    this.onMouseOut(a);
                    this._checkHtmlCancel("off");
                  }),
                  0
                );
              })
            );
            this._cons.push(
              f.connect(this._fileInput, "mousedown", this, function(a) {
                r.add(this.domNode, this.activeClass);
                r.remove(this.domNode, this.hoverClass);
                this.onMouseDown(a);
              })
            );
            this._cons.push(
              f.connect(this._fileInput, "mouseup", this, function(a) {
                r.remove(this.domNode, this.activeClass);
                this.onMouseUp(a);
                this.onClick(a);
                this._checkHtmlCancel("up");
              })
            );
            this._cons.push(
              f.connect(this._fileInput, "change", this, function() {
                this._checkHtmlCancel("change");
                var a = this._fileInput.value;
                a
                  ? this._change([{ name: a, type: "", size: 0 }])
                  : this._change([]);
              })
            );
            0 <= this.tabIndex &&
              k.set(this.domNode, "tabIndex", this.tabIndex);
          },
          _checkHtmlCancel: function(a) {
            "change" == a && (this.dialogIsOpen = !1);
            "up" == a && (this.dialogIsOpen = !0);
            if ("off" == a) {
              if (this.dialogIsOpen) this.onCancel();
              this.dialogIsOpen = !1;
            }
          },
          _styleContent: function() {
            var a = this.fhtml.nr;
            d.set(this.insideNode, {
              width: a.w + "px",
              height: "middle" == a.va ? a.h + "px" : "auto",
              textAlign: a.ta,
              paddingTop: a.p[0] + "px",
              paddingRight: a.p[1] + "px",
              paddingBottom: a.p[2] + "px",
              paddingLeft: a.p[3] + "px"
            });
            try {
              d.set(this.insideNode, "lineHeight", "inherit");
            } catch (H) {}
          },
          _resetHTML: function() {
            "html" == this.uploaderType &&
              this._formNode &&
              ((this.fileInputs = []),
              b("*", this._formNode).forEach(function(a) {
                t.destroy(a);
              }),
              (this.fileCount = 0),
              this._buildFileInput(),
              this._connectInput());
          },
          _buildForm: function() {
            this._formNode ||
              (9 > c("ie") || (c("ie") && c("quirks"))
                ? ((this._formNode = document.createElement(
                    '\x3cform enctype\x3d"multipart/form-data" method\x3d"post"\x3e'
                  )),
                  (this._formNode.encoding = "multipart/form-data"),
                  (this._formNode.id = p.getUniqueId("FileUploaderForm")),
                  this.domNode.appendChild(this._formNode))
                : (this._formNode = t.create(
                    "form",
                    {
                      enctype: "multipart/form-data",
                      method: "post",
                      id: p.getUniqueId("FileUploaderForm")
                    },
                    this.domNode
                  )));
          },
          _buildFileInput: function() {
            this._fileInput &&
              (this._disconnect(),
              (this._fileInput.id += this.fileCount),
              d.set(this._fileInput, "display", "none"));
            this._fileInput = document.createElement("input");
            this.fileInputs.push(this._fileInput);
            var a = this.htmlFieldName;
            this.selectMultipleFiles &&
              ((a += this.fileCount), this.fileCount++);
            k.set(this._fileInput, { id: this.id, name: a, type: "file" });
            r.add(this._fileInput, "dijitFileInputReal");
            this._formNode.appendChild(this._fileInput);
            a = q.getMarginBox(this._fileInput);
            d.set(this._fileInput, {
              position: "relative",
              left: this.fhtml.nr.w - a.w + "px",
              opacity: 0
            });
          },
          _renumberInputs: function() {
            if (this.selectMultipleFiles) {
              var a;
              this.fileCount = 0;
              m.forEach(
                this.fileInputs,
                function(b) {
                  a = this.htmlFieldName + this.fileCount;
                  this.fileCount++;
                  k.set(b, "name", a);
                },
                this
              );
            }
          },
          _setFormStyle: function() {
            y.insertCssRule(
              "#" + this._formNode.id + " input",
              "font-size:" +
                Math.max(
                  2,
                  Math.max(
                    Math.ceil(this.fhtml.nr.w / 60),
                    Math.ceil(this.fhtml.nr.h / 15)
                  )
                ) +
                "em"
            );
            d.set(this.domNode, { overflow: "hidden", position: "relative" });
            d.set(this.insideNode, "position", "absolute");
          },
          _setHtmlPostData: function() {
            if (this.postData)
              for (var a in this.postData)
                t.create(
                  "input",
                  { type: "hidden", name: a, value: this.postData[a] },
                  this._formNode
                );
          },
          uploadFlash: function() {
            try {
              if (this.showProgress) {
                this._displayProgress(!0);
                var a = f.connect(this, "_complete", this, function() {
                  f.disconnect(a);
                  this._displayProgress(!1);
                });
              }
              var b = {},
                c;
              for (c in this.postData) b[c] = this.postData[c];
              this.flashMovie.doUpload(b);
            } catch (B) {
              this._error(
                "FileUploader - Sorry, the SWF failed to initialize." + B
              );
            }
          },
          createFlashUploader: function() {
            if ((this.uploadUrl = this.uploadUrl.toString()))
              if (
                0 > this.uploadUrl.toLowerCase().indexOf("http") &&
                0 != this.uploadUrl.indexOf("/")
              ) {
                var a = window.location.href.split("/");
                a.pop();
                a = a.join("/") + "/";
                this.uploadUrl = a + this.uploadUrl;
                this.log(
                  "SWF Fixed - Relative loc:",
                  a,
                  " abs loc:",
                  this.uploadUrl
                );
              } else this.log("SWF URL unmodified:", this.uploadUrl);
            else console.warn("Warning: no uploadUrl provided.");
            a = {
              expressInstall: !0,
              path: this.swfPath.uri || this.swfPath,
              width: this.fhtml.nr.w,
              height: this.fhtml.nr.h,
              allowScriptAccess: "always",
              allowNetworking: "all",
              vars: {
                uploadDataFieldName: this.flashFieldName,
                uploadUrl: this.uploadUrl,
                uploadOnSelect: this.uploadOnChange,
                deferredUploading: this.deferredUploading || 0,
                selectMultipleFiles: this.selectMultipleFiles,
                id: this.id,
                isDebug: this.isDebug,
                devMode: this.devMode,
                flashButton: D.serialize("fh", this.fhtml),
                fileMask: D.serialize("fm", this.fileMask),
                noReturnCheck: this.skipServerCheck,
                serverTimeout: this.serverTimeout
              },
              params: {
                scale: "noscale",
                wmode: "opaque",
                allowScriptAccess: "always",
                allowNetworking: "all"
              }
            };
            this.flashObject = new F(a, this.insideNode);
            this.flashObject.onError = h.hitch(function(a) {
              this._error("Flash Error: " + a);
            });
            this.flashObject.onReady = h.hitch(this, function() {
              d.set(this.insideNode, "visibility", "visible");
              this.log("FileUploader flash object ready");
              this.onReady(this);
            });
            this.flashObject.onLoad = h.hitch(this, function(a) {
              this.flashMovie = a;
              this.flashReady = !0;
              this.onLoad(this);
            });
            this._connectFlash();
          },
          _connectFlash: function() {
            this._doSub("/filesSelected", "_change");
            this._doSub("/filesUploaded", "_complete");
            this._doSub("/filesProgress", "_progress");
            this._doSub("/filesError", "_error");
            this._doSub("/filesCanceled", "onCancel");
            this._doSub("/stageBlur", "_onFlashBlur");
            this._doSub("/up", "onMouseUp");
            this._doSub("/down", "onMouseDown");
            this._doSub("/over", "onMouseOver");
            this._doSub("/out", "onMouseOut");
            this.connect(this.domNode, "focus", function() {
              this.flashMovie.focus();
              this.flashMovie.doFocus();
            });
            0 <= this.tabIndex &&
              k.set(this.domNode, "tabIndex", this.tabIndex);
          },
          _doSub: function(a, b) {
            this._subs.push(f.subscribe(this.id + a, this, b));
          },
          urlencode: function(a) {
            return a && "none" != a
              ? a
                  .replace(/:/g, "||")
                  .replace(/\./g, "^^")
                  .replace("url(", "")
                  .replace(")", "")
                  .replace(/'/g, "")
                  .replace(/"/g, "")
              : !1;
          },
          isButton: function(a) {
            a = a.tagName.toLowerCase();
            return "button" == a || "input" == a;
          },
          getTextStyle: function(a) {
            var b = {};
            b.ff = d.get(a, "fontFamily");
            if (b.ff) {
              b.ff = b.ff.replace(", ", ",");
              b.ff = b.ff.replace(/\"|\'/g, "");
              b.ff = "sans-serif" == b.ff ? "Arial" : b.ff;
              b.fw = d.get(a, "fontWeight");
              b.fi = d.get(a, "fontStyle");
              b.fs = parseInt(d.get(a, "fontSize"), 10);
              if (-1 < d.get(a, "fontSize").indexOf("%"))
                for (var c = a; c.tagName; ) {
                  if (-1 == d.get(c, "fontSize").indexOf("%")) {
                    b.fs = parseInt(d.get(c, "fontSize"), 10);
                    break;
                  }
                  "body" == c.tagName.toLowerCase() &&
                    (b.fs = 0.16 * parseInt(d.get(c, "fontSize"), 10));
                  c = c.parentNode;
                }
              b.fc = new w(d.get(a, "color")).toHex();
              b.fc = parseInt(b.fc.substring(1, Infinity), 16);
            }
            b.lh = d.get(a, "lineHeight");
            b.ta = d.get(a, "textAlign");
            b.ta = "start" != b.ta && b.ta ? b.ta : "left";
            b.va = this.isButton(a)
              ? "middle"
              : b.lh == b.h
              ? "middle"
              : d.get(a, "verticalAlign");
            return b;
          },
          getText: function(a) {
            a = h.trim(a.innerHTML);
            -1 < a.indexOf("\x3c") && (a = escape(a));
            return a;
          },
          getStyle: function(a) {
            var b = {},
              c = q.getContentBox(a),
              e = q.getPadExtents(a);
            b.p = [e.t, e.w - e.l, e.h - e.t, e.l];
            b.w = c.w + e.w;
            b.h = c.h + e.h;
            b.d = d.get(a, "display");
            c = new w(d.get(a, "backgroundColor"));
            b.bc = 0 == c.a ? "#ffffff" : c.toHex();
            b.bc = parseInt(b.bc.substring(1, Infinity), 16);
            if ((c = this.urlencode(d.get(a, "backgroundImage"))))
              (b.bi = {
                url: c,
                rp: d.get(a, "backgroundRepeat"),
                pos: escape(d.get(a, "backgroundPosition"))
              }),
                b.bi.pos ||
                  ((c = d.get(a, "backgroundPositionX")),
                  (e = d.get(a, "backgroundPositionY")),
                  (b.bi.pos = escape(
                    ("left" == c ? "0%" : "right" == c ? "100%" : c) +
                      " " +
                      ("top" == e ? "0%" : "bottom" == e ? "100%" : e)
                  )));
            return h.mixin(b, this.getTextStyle(a));
          },
          getTempNodeStyle: function(a, b, c) {
            if (c) {
              c = t.place(
                "\x3c" +
                  a.tagName +
                  "\x3e\x3cspan\x3e" +
                  a.innerHTML +
                  "\x3c/span\x3e\x3c/" +
                  a.tagName +
                  "\x3e",
                a.parentNode
              );
              var d = c.firstChild;
              r.add(d, a.className);
              r.add(c, b);
              a = this.getStyle(d);
            } else
              (c = t.place(
                "\x3c" +
                  a.tagName +
                  "\x3e" +
                  a.innerHTML +
                  "\x3c/" +
                  a.tagName +
                  "\x3e",
                a.parentNode
              )),
                r.add(c, a.className),
                r.add(c, b),
                (c.id = a.id),
                (a = this.getStyle(c));
            t.destroy(c);
            return a;
          }
        });
      });
    },
    "dojo/io/iframe": function() {
      define("../_base/config ../_base/json ../_base/kernel ../_base/lang ../_base/xhr ../sniff ../_base/window ../dom ../dom-construct ../query require ../aspect ../request/iframe".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r) {
        h.deprecated("dojo/io/iframe", "Use dojo/request/iframe.", "2.0");
        a = r._iframeName;
        a = a.substring(0, a.lastIndexOf("_"));
        var t = m.delegate(r, {
          create: function() {
            return (t._frame = r.create.apply(r, arguments));
          },
          get: null,
          post: null,
          send: function(a) {
            var c,
              d = f._ioSetArgs(
                a,
                function(a) {
                  c && c.cancel();
                },
                function(a) {
                  var b = null;
                  a = a.ioArgs;
                  try {
                    var d = a.handleAs;
                    "xml" === d || "html" === d
                      ? (b = c.response.data)
                      : ((b = c.response.text),
                        "json" === d
                          ? (b = n.fromJson(b))
                          : "javascript" === d && (b = h.eval(b)));
                  } catch (D) {
                    b = D;
                  }
                  return b;
                },
                function(a, b) {
                  b.ioArgs._hasError = !0;
                  return a;
                }
              ),
              e = d.ioArgs,
              q = "GET",
              m = b.byId(a.form);
            a.method && "POST" === a.method.toUpperCase() && m && (q = "POST");
            a = {
              method: q,
              handleAs:
                "json" === a.handleAs || "javascript" === a.handleAs
                  ? "text"
                  : a.handleAs,
              form: a.form,
              query: m ? null : a.content,
              data: m ? a.content : null,
              timeout: a.timeout,
              ioArgs: e
            };
            a.method && (a.method = a.method.toUpperCase());
            if (l.ioPublish && h.publish && !1 !== e.args.ioPublish)
              var t = k.after(
                r,
                "_notifyStart",
                function(a) {
                  a.options.ioArgs === e && (t.remove(), f._ioNotifyStart(d));
                },
                !0
              );
            c = r(e.url, a, !0);
            e._callNext = c._callNext;
            c.then(function() {
              d.resolve(d);
            }).otherwise(function(a) {
              d.ioArgs.error = a;
              d.reject(a);
            });
            return d;
          },
          _iframeOnload: c.global[a + "_onload"]
        });
        m.setObject("dojo.io.iframe", t);
        return t;
      });
    },
    "dojox/embed/Flash": function() {
      define("dojo/_base/lang dojo/_base/unload dojo/_base/array dojo/query dojo/has dojo/dom dojo/on dojo/window dojo/string".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e) {
        function d(a) {
          a = l.delegate(t, a);
          if (!("path" in a))
            return (
              console.error(
                "dojox.embed.Flash(ctor):: no path reference to a Flash movie was provided."
              ),
              null
            );
          "id" in a || (a.id = "dojox-embed-flash-" + r++);
          return a;
        }
        var q,
          k,
          r = 0,
          t = {
            expressInstall: !1,
            width: 320,
            height: 240,
            swLiveConnect: "true",
            allowScriptAccess: "sameDomain",
            allowNetworking: "all",
            style: null,
            redirect: null
          };
        f("ie")
          ? ((q = function(a) {
              a = d(a);
              if (!a) return null;
              var b,
                c = a.path;
              if (a.vars) {
                var g = [];
                for (b in a.vars)
                  g.push(
                    encodeURIComponent(b) +
                      "\x3d" +
                      encodeURIComponent(a.vars[b])
                  );
                a.params.FlashVars = g.join("\x26");
                delete a.vars;
              }
              c =
                '\x3cobject id\x3d"' +
                e.escape(String(a.id)) +
                '" classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width\x3d"' +
                e.escape(String(a.width)) +
                '" height\x3d"' +
                e.escape(String(a.height)) +
                '"' +
                (a.style
                  ? ' style\x3d"' + e.escape(String(a.style)) + '"'
                  : "") +
                '\x3e\x3cparam name\x3d"movie" value\x3d"' +
                e.escape(String(c)) +
                '" /\x3e';
              if (a.params)
                for (b in a.params)
                  c +=
                    '\x3cparam name\x3d"' +
                    e.escape(b) +
                    '" value\x3d"' +
                    e.escape(String(a.params[b])) +
                    '" /\x3e';
              return { id: a.id, markup: c + "\x3c/object\x3e" };
            }),
            (k = (function() {
              for (var a = 10, b = null; !b && 7 < a; )
                try {
                  b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a--);
                } catch (x) {}
              return b
                ? ((a = b
                    .GetVariable("$version")
                    .split(" ")[1]
                    .split(",")),
                  {
                    major: null != a[0] ? parseInt(a[0]) : 0,
                    minor: null != a[1] ? parseInt(a[1]) : 0,
                    rev: null != a[2] ? parseInt(a[2]) : 0
                  })
                : { major: 0, minor: 0, rev: 0 };
            })()),
            n.addOnWindowUnload(function() {
              console.warn("***************UNLOAD");
              var a = function() {};
              m("object")
                .reverse()
                .style("display", "none")
                .forEach(function(b) {
                  for (var c in b)
                    if ("FlashVars" != c && "function" == typeof b[c])
                      try {
                        b[c] = a;
                      } catch (w) {}
                });
            }))
          : ((q = function(a) {
              a = d(a);
              if (!a) return null;
              var b,
                c = a.path;
              if (a.vars) {
                var g = [];
                for (b in a.vars)
                  g.push(
                    encodeURIComponent(b) +
                      "\x3d" +
                      encodeURIComponent(a.vars[b])
                  );
                a.params.flashVars = g.join("\x26");
                delete a.vars;
              }
              c =
                '\x3cembed type\x3d"application/x-shockwave-flash" src\x3d"' +
                e.escape(String(c)) +
                '" id\x3d"' +
                e.escape(String(a.id)) +
                '" width\x3d"' +
                e.escape(String(a.width)) +
                '" height\x3d"' +
                e.escape(String(a.height)) +
                '"' +
                (a.style
                  ? ' style\x3d"' + e.escape(String(a.style)) + '" '
                  : "") +
                'pluginspage\x3d"' +
                window.location.protocol +
                '//www.adobe.com/go/getflashplayer" ';
              if (a.params)
                for (b in a.params)
                  c +=
                    " " +
                    e.escape(b) +
                    '\x3d"' +
                    e.escape(String(a.params[b])) +
                    '"';
              return { id: a.id, markup: c + " /\x3e" };
            }),
            (k = (function() {
              var a = navigator.plugins["Shockwave Flash"];
              return a && a.description
                ? ((a = a.description
                    .replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s+r|\s+b[0-9]+)/, ".")
                    .split(".")),
                  {
                    major: null != a[0] ? parseInt(a[0]) : 0,
                    minor: null != a[1] ? parseInt(a[1]) : 0,
                    rev: null != a[2] ? parseInt(a[2]) : 0
                  })
                : { major: 0, minor: 0, rev: 0 };
            })()));
        var u = function(b, c) {
          if (-1 < location.href.toLowerCase().indexOf("file://"))
            throw Error(
              "dojox.embed.Flash can't be run directly from a file. To instatiate the required SWF correctly it must be run from a server, like localHost."
            );
          this.available = k.major;
          this.minimumVersion = b.minimumVersion || 9;
          this.domNode = this.movie = this.id = null;
          c && (c = a.byId(c));
          setTimeout(
            l.hitch(this, function() {
              if (
                b.expressInstall ||
                (this.available && this.available >= this.minimumVersion)
              )
                if (b && c) this.init(b, c);
                else
                  this.onError(
                    "embed.Flash was not provided with the proper arguments."
                  );
              else if (this.available)
                this.onError(
                  "Flash version detected: " +
                    this.available +
                    " is out of date. Minimum required: " +
                    this.minimumVersion
                );
              else this.onError("Flash is not installed.");
            }),
            100
          );
        };
        l.extend(u, {
          onReady: function(a) {},
          onLoad: function(a) {},
          onError: function(a) {},
          _onload: function() {
            clearInterval(this._poller);
            delete this._poller;
            delete this._pollCount;
            delete this._pollMax;
            this.onLoad(this.movie);
          },
          init: function(b, c) {
            this.destroy();
            c = a.byId(c || this.domNode);
            if (!c)
              throw Error(
                "dojox.embed.Flash: no domNode reference has been passed."
              );
            var d = 0;
            this._poller = null;
            this._pollCount = 0;
            this._pollMax = 15;
            this.pollTime = 100;
            u.initialized &&
              ((this.id = u.place(b, c)),
              (this.domNode = c),
              setTimeout(
                l.hitch(this, function() {
                  this.movie = this.byId(this.id, b.doc);
                  this.onReady(this.movie);
                  this._poller = setInterval(
                    l.hitch(this, function() {
                      try {
                        d = this.movie.PercentLoaded();
                      } catch (w) {
                        console.warn(
                          "this.movie.PercentLoaded() failed",
                          w,
                          this.movie
                        );
                      }
                      if (100 == d) this._onload();
                      else if (0 == d && this._pollCount++ > this._pollMax)
                        throw (clearInterval(this._poller),
                        Error("Building SWF failed."));
                    }),
                    this.pollTime
                  );
                }),
                1
              ));
          },
          _destroy: function() {
            try {
              this.domNode.removeChild(this.movie);
            } catch (g) {}
            this.id = this.movie = this.domNode = null;
          },
          destroy: function() {
            if (this.movie) {
              var a = l.delegate({
                  id: !0,
                  movie: !0,
                  domNode: !0,
                  onReady: !0,
                  onLoad: !0
                }),
                b;
              for (b in this) a[b] || delete this[b];
              this._poller
                ? c(this, "Load", this, "_destroy")
                : this._destroy();
            }
          },
          byId: function(a, b) {
            b = b || document;
            return b.embeds[a]
              ? b.embeds[a]
              : b[a]
              ? b[a]
              : window[a]
              ? window[a]
              : document[a]
              ? document[a]
              : null;
          }
        });
        l.mixin(u, {
          minSupported: 8,
          available: k.major,
          supported: k.major >= k.required,
          minimumRequired: k.required,
          version: k,
          initialized: !1,
          onInitialize: function() {
            u.initialized = !0;
          },
          __ie_markup__: function(a) {
            return q(a);
          },
          proxy: function(a, b) {
            h.forEach(
              b instanceof Array ? b : [b],
              function(a) {
                this[a] = l.hitch(this, function() {
                  return function() {
                    return eval(
                      this.movie.CallFunction(
                        '\x3cinvoke name\x3d"' +
                          a +
                          '" returntype\x3d"javascript"\x3e\x3carguments\x3e' +
                          h
                            .map(arguments, function(a) {
                              return __flash__toXML(a);
                            })
                            .join("") +
                          "\x3c/arguments\x3e\x3c/invoke\x3e"
                      )
                    );
                  }.apply(this, arguments || []);
                });
              },
              a
            );
          }
        });
        u.place = function(c, d) {
          c = q(c);
          d = a.byId(d);
          d ||
            ((d = b.doc.createElement("div")),
            (d.id = c.id + "-container"),
            b.body().appendChild(d));
          return c ? ((d.innerHTML = c.markup), c.id) : null;
        };
        u.onInitialize();
        l.setObject("dojox.embed.Flash", u);
        return u;
      });
    },
    "dojox/embed/flashVars": function() {
      define(["dojo"], function(l) {
        l.deprecated("dojox.embed.flashVars", "Will be removed in 2.0", "2.0");
        var n = {
          serialize: function(h, m) {
            var f = function(a) {
                "string" == typeof a &&
                  ((a = a.replace(/;/g, "_sc_")),
                  (a = a.replace(/\./g, "_pr_")),
                  (a = a.replace(/\:/g, "_cl_")));
                return a;
              },
              a = dojox.embed.flashVars.serialize,
              c = "";
            if (l.isArray(m)) {
              for (var b = 0; b < m.length; b++)
                c += a(h + "." + b, f(m[b])) + ";";
              return c.replace(/;{2,}/g, ";");
            }
            if (l.isObject(m)) {
              for (b in m) c += a(h + "." + b, f(m[b])) + ";";
              return c.replace(/;{2,}/g, ";");
            }
            return h + ":" + m;
          }
        };
        l.setObject("dojox.embed.flashVars", n);
        return n;
      });
    },
    "dojox/html/styles": function() {
      define([
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/window",
        "dojo/_base/sniff"
      ], function(l, n, h, m) {
        var f = l.getObject("dojox.html", !0),
          a = {},
          c = {},
          b = [];
        f.insertCssRule = function(a, b, c) {
          c = f.getDynamicStyleSheet(c);
          var d = a + " {" + b + "}";
          console.log("insertRule:", d);
          m("ie")
            ? ((c.cssText += d), console.log("ss.cssText:", c.cssText))
            : c.sheet
            ? c.sheet.insertRule(d, c._indicies.length)
            : c.appendChild(h.doc.createTextNode(d));
          c._indicies.push(a + " " + b);
          return a;
        };
        f.removeCssRule = function(b, c, f) {
          var d,
            e = -1,
            h,
            q;
          for (h in a)
            if (!f || f === h) {
              d = a[h];
              for (q = 0; q < d._indicies.length; q++)
                if (b + " " + c === d._indicies[q]) {
                  e = q;
                  break;
                }
              if (-1 < e) break;
            }
          if (!d)
            return (
              console.warn(
                "No dynamic style sheet has been created from which to remove a rule."
              ),
              !1
            );
          if (-1 === e)
            return (
              console.warn(
                "The css rule was not found and could not be removed."
              ),
              !1
            );
          d._indicies.splice(e, 1);
          m("ie") ? d.removeRule(e) : d.sheet && d.sheet.deleteRule(e);
          return !0;
        };
        f.modifyCssRule = function(a, b, c) {};
        f.getStyleSheet = function(b) {
          if (a[b || "default"]) return a[b || "default"];
          if (!b) return !1;
          var c = f.getStyleSheets();
          if (c[b]) return f.getStyleSheets()[b];
          for (var e in c)
            if (c[e].href && -1 < c[e].href.indexOf(b)) return c[e];
          return !1;
        };
        f.getDynamicStyleSheet = function(b) {
          b || (b = "default");
          a[b] ||
            (h.doc.createStyleSheet
              ? ((a[b] = h.doc.createStyleSheet()),
                9 > m("ie") && (a[b].title = b))
              : ((a[b] = h.doc.createElement("style")),
                a[b].setAttribute("type", "text/css"),
                h.doc.getElementsByTagName("head")[0].appendChild(a[b]),
                console.log(b, " ss created: ", a[b].sheet)),
            (a[b]._indicies = []));
          return a[b];
        };
        f.enableStyleSheet = function(a) {
          if ((a = f.getStyleSheet(a)))
            a.sheet ? (a.sheet.disabled = !1) : (a.disabled = !1);
        };
        f.disableStyleSheet = function(a) {
          if ((a = f.getStyleSheet(a)))
            a.sheet ? (a.sheet.disabled = !0) : (a.disabled = !0);
        };
        f.activeStyleSheet = function(a) {
          var b = f.getToggledStyleSheets(),
            c;
          if (1 === arguments.length)
            n.forEach(b, function(b) {
              b.disabled = b.title === a ? !1 : !0;
            });
          else
            for (c = 0; c < b.length; c++)
              if (!1 === b[c].disabled) return b[c];
          return !0;
        };
        f.getPreferredStyleSheet = function() {};
        f.getToggledStyleSheets = function() {
          var a;
          if (!b.length) {
            var c = f.getStyleSheets();
            for (a in c) c[a].title && b.push(c[a]);
          }
          return b;
        };
        f.getStyleSheets = function() {
          if (c.collected) return c;
          n.forEach(h.doc.styleSheets, function(a) {
            var b = a.sheet ? a.sheet : a;
            a = b.title || b.href;
            if (m("ie"))
              -1 === b.cssText.indexOf("#default#VML") &&
                (b.href
                  ? (c[a] = b)
                  : b.imports.length
                  ? n.forEach(b.imports, function(a) {
                      c[a.title || a.href] = a;
                    })
                  : (c[a] = b));
            else {
              c[a] = b;
              c[a].id = b.ownerNode.id;
              a = [];
              try {
                a = b[b.cssRules ? "cssRules" : "rules"];
              } catch (q) {
                console.warn(
                  "Reading css rules from stylesheet " +
                    b.href +
                    " is forbidden due to same-origin policy. See http://www.w3.org/TR/CSP/#cascading-style-sheet-css-parsing",
                  b
                );
              }
              n.forEach(a, function(a) {
                a.href &&
                  ((c[a.href] = a.styleSheet), (c[a.href].id = b.ownerNode.id));
              });
            }
          });
          c.collected = !0;
          return c;
        };
        return f;
      });
    },
    "jimu/dijit/EditorChooseImage": function() {
      define("dojo dijit dijit/_editor/_Plugin jimu/dijit/ImageChooser dojo/_base/html dojo/_base/lang dojo/sniff dojo/i18n dojo/_base/connect dojo/_base/declare".split(
        " "
      ), function(l, n, h, m, f, a, c, b) {
        l.experimental("dojox.editor.plugins.ChooseImage");
        var e = l.declare("dojox.editor.plugins.ChooseImage", h, {
          iconClassPrefix: "editorIcon",
          useDefaultCommand: !1,
          _initButton: function() {
            this.createFileInput();
            this.command = "chooseImage";
            var c = b.getLocalization("dijit._editor", "commands");
            this.button = new n.form.Button({
              label: c.insertImage,
              showLabel: !1,
              iconClass:
                this.iconClassPrefix +
                " " +
                this.iconClassPrefix +
                "UploadImage",
              tabIndex: "-1",
              onClick: a.hitch(this, this._chooseImage)
            });
            this.button.set("readOnly", !1);
            this.editor.commands[this.command] = "Upload Image";
            this.inherited("_initButton", arguments);
            delete this.command;
          },
          updateState: function() {
            var a = this.get("disabled");
            this.button.set("disabled", this.get("disabled"));
            !0 === a
              ? (f.addClass(this.button, "dijitButtonDisabled"),
                this.imageChooser.disableChooseImage())
              : (f.removeClass(this.button, "dijitButtonDisabled"),
                this.imageChooser.enableChooseImage());
          },
          createFileInput: function() {
            var a = l.create("span", { innerHTML: "." }, document.body);
            this.imageChooser = new m(
              {
                showSelfImg: !1,
                cropImage: !1,
                format: [m.GIF, m.JPEG, m.PNG]
              },
              a
            );
            this.connect(this.imageChooser, "onImageChange", "insertTempImage");
          },
          _chooseImage: function() {
            var a = this.imageChooser.mask;
            if (c("safari")) {
              var b = document.createEvent("MouseEvents");
              b.initEvent("click", !0, !0);
              a.dispatchEvent(b);
            } else a.click();
          },
          onComplete: function(a) {
            a = a[0];
            var b = l.byId(this.currentImageId, this.editor.document),
              c;
            c = this.downloadPath ? this.downloadPath + a.name : a.file;
            b.src = c;
            l.attr(b, "_djrealurl", c);
            a.width && ((b.width = a.width), (b.height = a.height));
          },
          insertTempImage: function(a, b) {
            b = b && b.fileName ? 'alt\x3d"' + b.fileName + '"' : "";
            this.currentImageId = "img_" + new Date().getTime();
            this.editor.execCommand(
              "inserthtml",
              '\x3cimg id\x3d"' +
                this.currentImageId +
                '" src\x3d"' +
                a +
                '" ' +
                b +
                "/\x3e"
            );
          },
          destroy: function() {
            this.imageChooser && this.imageChooser.destroy();
            this.inherited(arguments);
          }
        });
        l.subscribe(n._scopeName + ".Editor.getPlugin", null, function(a) {
          if (!a.plugin)
            switch (a.args.name) {
              case "chooseImage":
                a.plugin = new e({ url: a.args.url });
            }
        });
        h.registry.chooseImage = function(a) {
          return new e(a);
        };
        return e;
      });
    },
    "jimu/dijit/EditorTextColor": function() {
      define("require dojo dijit dojo/_base/declare dijit/_editor/_Plugin dijit/form/DropDownButton".split(
        " "
      ), function(l, n, h, m, f, a) {
        n.experimental("dijit.editor.plugins.EditorTextColor");
        var c = m("dijit.editor.plugins.EditorTextColor", f, {
          buttonClass: a,
          colorPicker: "jimu/dijit/ColorPalette",
          useDefaultCommand: !1,
          _initButton: function() {
            this.command = "editorTextColor";
            this.hackCommand = "foreColor";
            this.inherited(arguments);
            var a = "",
              c = !1;
            this.params.custom &&
              (this.params.custom.recordUID &&
                (a = this.params.custom.recordUID),
              this.params.custom.forceAttr &&
                (c = this.params.custom.forceAttr));
            var d = this;
            this.button.set(
              "iconClass",
              this.iconClassPrefix + " " + this.iconClassPrefix + "ForeColor"
            );
            this.button.set("title", this.getLabel(this.hackCommand));
            this.button.loadDropDown = function(b) {
              function e(e) {
                d.button.dropDown = new e({
                  dir: d.editor.dir,
                  ownerDocument: d.editor.ownerDocument,
                  value: d.value,
                  appearance: {
                    showTransparent: !1,
                    showColorPalette: !0,
                    showCoustom: !0,
                    showColorPickerApply: !1,
                    showCoustomRecord: !0
                  },
                  recordUID: a,
                  onChange: function(a) {
                    d.editor.execCommand("useCSS", c);
                    d.editor.execCommand("styleWithCSS", !c);
                    d.editor.execCommand(d.hackCommand, a);
                  },
                  onClose: function() {
                    d.button.closeDropDown();
                  }
                });
                b();
              }
              "string" === typeof d.colorPicker
                ? l([d.colorPicker], e)
                : e(d.colorPicker);
            };
          },
          updateState: function() {
            var a = this.editor,
              c = this.hackCommand;
            if (a && a.isLoaded && c.length) {
              var d;
              if (this.button) {
                var f = this.get("disabled");
                this.button.set("disabled", f);
                if (f) return;
                try {
                  d = a.queryCommandValue(c) || "";
                } catch (k) {
                  d = "";
                }
              }
              "" === d
                ? (d = "#000000")
                : "transparent" === d && (d = "rgba(0, 0, 0, 0)");
              this.value = d;
              (a = this.button.dropDown) &&
                a.getColor &&
                d !== a.getColor() &&
                (a.refreshRecords(), a.setColor(d));
            }
          }
        });
        n.subscribe(h._scopeName + ".Editor.getPlugin", null, function(a) {
          if (!a.plugin)
            switch (a.args.name) {
              case "editorTextColor":
                a.plugin = new c();
            }
        });
        return c;
      });
    },
    "jimu/dijit/EditorBackgroundColor": function() {
      define("require dojo dijit dojo/_base/declare dijit/_editor/_Plugin dijit/form/DropDownButton".split(
        " "
      ), function(l, n, h, m, f, a) {
        n.experimental("dijit.editor.plugins.EditorBackgroundColor");
        var c = m("dijit.editor.plugins.EditorBackgroundColor", f, {
          buttonClass: a,
          colorPicker: "jimu/dijit/ColorPalette",
          useDefaultCommand: !1,
          _initButton: function() {
            this.command = "editorBackgroundColor";
            this.hackCommand = "hiliteColor";
            this.inherited(arguments);
            var a = "";
            this.params.custom &&
              this.params.custom.recordUID &&
              (a = this.params.custom.recordUID);
            var c = this;
            this.button.set(
              "iconClass",
              this.iconClassPrefix + " " + this.iconClassPrefix + "HiliteColor"
            );
            this.button.set("title", this.getLabel(this.hackCommand));
            this.button.loadDropDown = function(b) {
              function d(d) {
                c.button.dropDown = new d({
                  dir: c.editor.dir,
                  ownerDocument: c.editor.ownerDocument,
                  value: c.value,
                  appearance: {
                    showTransparent: !0,
                    showColorPalette: !0,
                    showCoustom: !0,
                    showColorPickerOK: !0,
                    showColorPickerApply: !1,
                    showCoustomRecord: !0
                  },
                  recordUID: a,
                  onChange: function(a) {
                    c.editor.execCommand("useCSS", !1);
                    c.editor.execCommand("styleWithCSS", !0);
                    c.editor.execCommand(c.hackCommand, a);
                  },
                  onExecute: function() {
                    c.editor.execCommand(c.hackCommand, this.get("value"));
                  },
                  onClose: function() {
                    c.button.closeDropDown();
                  }
                });
                b();
              }
              "string" === typeof c.colorPicker
                ? l([c.colorPicker], d)
                : d(c.colorPicker);
            };
          },
          updateState: function() {
            var a = this.editor,
              c = this.hackCommand;
            if (a && a.isLoaded && c.length) {
              var d;
              if (this.button) {
                var f = this.get("disabled");
                this.button.set("disabled", f);
                if (f) return;
                try {
                  d = a.queryCommandValue(c) || "";
                } catch (k) {
                  d = "";
                }
              }
              "" === d
                ? (d = "#000000")
                : "transparent" === d && (d = "rgba(0, 0, 0, 0)");
              this.value = d;
              (a = this.button.dropDown) &&
                a.getColor &&
                d !== a.getColor() &&
                (a.refreshRecords(), a.setColor(d));
            }
          }
        });
        n.subscribe(h._scopeName + ".Editor.getPlugin", null, function(a) {
          if (!a.plugin)
            switch (a.args.name) {
              case "editorBackgroundColor":
                a.plugin = new c();
            }
        });
        return c;
      });
    },
    "widgets/SmartEditor/setting/SmartActionGroup": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/dom-class dojo/dom-style dojo/dom-attr dojox/html/entities dojo/on dojo/query dojo/Deferred dojo/text!./SmartActionGroup.html dijit/_TemplatedMixin jimu/dijit/LayerChooserFromMap jimu/dijit/LayerChooserFromMapWithDropbox jimu/BaseWidgetSetting jimu/dijit/SimpleTable jimu/dijit/Popup dijit/form/ValidationTextBox jimu/dijit/CheckBox dijit/form/CheckBox jimu/dijit/Message ./FilterPage jimu/utils".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D
      ) {
        return l([p, n, t], {
          baseClass: "jimu-widget-smartEditor-setting-smartActionGroup",
          templateString: r,
          _totalLayers: [],
          _prevAppliedOn: [],
          filterInfo: { filter: "" },
          postCreate: function() {
            this.inherited(arguments);
            this._totalLayers = [];
            this._prevAppliedOnLayers = [];
            this.appliedOn &&
              (this._prevAppliedOnLayers = h.clone(
                Object.keys(this.appliedOn)
              ));
            this._initComponents();
          },
          _initComponents: function() {
            this.groupNameTextBox = new v(
              { required: !0, trim: !0, class: "esriCTGroupNameTextBox" },
              f.create("div", {}, this.groupNameTextBoxNode)
            );
            this.groupNameTextBox.validator = h.hitch(this, function(a) {
              return a
                ? a !== this.prevName &&
                  this.editUtils.isDuplicateGroupName(
                    a,
                    this.existingGroupNames
                  )
                  ? (this.groupNameTextBox.set(
                      "invalidMessage",
                      this.nls.smartActionsPage.uniqueGroupNameMsg
                    ),
                    !1)
                  : !0
                : (this.groupNameTextBox.set(
                    "invalidMessage",
                    this.nls.smartActionsPage.requiredGroupNameMsg
                  ),
                  !1);
            });
            this.name && this.groupNameTextBox.set("value", this.name);
            this._initLayerSelector();
            this.expressionTextBox = new v(
              {
                disabled: !0,
                required: !0,
                class: "esriCTTextBoxNode",
                promptMessage: this.nls.smartActionsPage.invalidExpression
              },
              f.create("div", {}, this.expressionTextBoxNode)
            );
            this.filterInfo &&
              this.filterInfo.expression &&
              this.expressionTextBox.set("value", this.filterInfo.expression);
            this.own(
              d(
                this.editExpressionIconNode,
                "click",
                h.hitch(this, this._showFilter)
              )
            );
            this._submitHidden = new A(
              { label: this.nls.smartActionsPage.submitAttributeText },
              f.create("div", {}, this.submitWhenHiddenNode)
            );
            this.submitWhenHidden &&
              this._submitHidden.setValue(this.submitWhenHidden);
            this._createTable(this.appliedOn);
          },
          _addLayersDropDown: function() {
            var a, b;
            a = this._createLayerChooserMapArgs();
            a = new u(a);
            a.startup();
            a = new g({ layerChooser: a });
            a.placeAt(this.layerSelectorDiv);
            a.startup();
            this._layerSelector = a;
            b = this._totalLayers[0];
            this.layerForExpression &&
              (a = this._jimuLayerInfos.getLayerOrTableInfoById(
                this.layerForExpression
              )) &&
              (b = a.layerObject);
            this._layerSelector.setSelectedLayer(b);
            this.own(
              d(
                this._layerSelector,
                "selection-change",
                h.hitch(this, function() {
                  this.expressionTextBox.get("value") &&
                    (new C({
                      message: this.nls.smartActionsPage.warningMsgOnLayerChange
                    }),
                    this.onFilterInfoChanged({
                      expression: "",
                      filter: null,
                      submitWhenHidden: !1
                    }));
                })
              )
            );
          },
          _createLayerChooserMapArgs: function() {
            return {
              multiple: !1,
              createMapResponse: this.map.webMapResponse,
              filter: this._createFiltersForLayerSelector()
            };
          },
          _createFiltersForLayerSelector: function() {
            return u.createFeaturelayerFilter(
              ["point", "polyline", "polygon"],
              !1,
              !0
            );
          },
          _initLayerSelector: function() {
            var a;
            a = this._createLayerChooserMapArgs();
            this._layerChooserFromMap = new u(a);
            this._layerChooserFromMap.startup();
            a = this._layerChooserFromMap.layerInfosObj.getLayerInfoArray();
            var b = this._layerChooserFromMap.layerInfosObj.getTableInfoArray();
            b && 0 < b.length && (a = a.concat(b));
            this._getAllFilteredLayers(a, []);
          },
          _isLayerEditable: function(a) {
            var b = !1;
            a &&
              a.layerObject &&
              ((a = a.layerObject.getEditCapabilities()),
              a.canCreate ||
                a.canUpdate ||
                a.canDelete ||
                a.canUpdateGeometry) &&
              (b = !0);
            return b;
          },
          _getAllFilteredLayers: function(a, b) {
            m.forEach(
              a,
              h.hitch(this, function(a) {
                var c;
                a.isLeaf()
                  ? ((c = new k()),
                    this._layerChooserFromMap.filter(a).then(
                      h.hitch(this, function(b) {
                        b &&
                          this._isLayerEditable(a) &&
                          this._totalLayers.push(a);
                        c.resolve();
                      })
                    ),
                    b.push(c))
                  : this._getAllFilteredLayers(a.newSubLayers, b);
              })
            );
          },
          _validateGroup: function() {
            var a;
            if (!this.groupNameTextBox.isValid())
              return this.groupNameTextBox.focus(), !1;
            if (this._layerSelector) {
              if (
                ((a = this._layerSelector.getSelectedItem()),
                !a || !a.layerInfo || !a.layerInfo.layerObject)
              )
                return !1;
            } else return !1;
            return this.expressionTextBox.isValid()
              ? !0
              : (this.expressionTextBox.set("disabled", !1),
                this.expressionTextBox.focus(),
                this.expressionTextBox.set("disabled", !0),
                !1);
          },
          showDialog: function() {
            this._addLayersDropDown();
            var a = new w({
              titleLabel: this.nls.smartActionsPage.smartActionLabel,
              width: 900,
              maxHeight: 500,
              autoHeight: !1,
              content: this,
              class: this.baseClass,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var b = {},
                      c = this._layerSelector.getSelectedItem().layerInfo
                        .layerObject;
                    if (this._validateGroup()) {
                      b.name = this.groupNameTextBox.get("value");
                      b.submitWhenHidden = this._submitHidden.checked;
                      b.layerForExpression = c.id;
                      b.filterInfo = this.filterInfo;
                      b.appliedOn = this.appliedOn;
                      this._applySettingsInLayer(b);
                      for (var d in b.appliedOn) {
                        var c = b.appliedOn[d],
                          e;
                        for (e in c)
                          c[e].hasOwnProperty("Priority") &&
                            delete c[e].Priority,
                            c[e].hasOwnProperty("ExistingExpressions") &&
                              delete c[e].ExistingExpressions;
                      }
                      this.emit("groupInfoUpdated", b);
                      a.close();
                    }
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    a.close();
                  })
                }
              ],
              onClose: h.hitch(this, function() {})
            });
            this.groupNameTextBox.focus();
            this._setMaxWidth();
          },
          _getTableData: function() {
            var a = [],
              b;
            m.forEach(
              this._layerTable.getRows(),
              h.hitch(this, function(c) {
                c.layerSelector &&
                  ((b = {}),
                  (b.layerId = c.layerSelector.getSelectedItem().layerInfo.id),
                  (b.field = c.layerFields.getValue()),
                  a.push(b));
              })
            );
            return a;
          },
          _showFilter: function(a) {
            if (!this.groupNameTextBox.isValid())
              return this.groupNameTextBox.focus(), !1;
            this._filterPage && this._filterPage.destroy();
            var b = this._layerSelector.getSelectedItem().layerInfo.layerObject;
            this._filterPage = new F({
              nls: this.nls,
              _resourceInfo: this._resourceInfo,
              _url: b.url,
              _layerId: b.id,
              _filterInfo: this.filterInfo,
              _groupName: this.groupNameTextBox.get("value")
            });
            this.own(
              d(
                this._filterPage,
                "filterInfo",
                h.hitch(this, function(a) {
                  this.onFilterInfoChanged(a);
                })
              )
            );
            this._filterPage.popup(a);
          },
          onFilterInfoChanged: function(a) {
            this.filterInfo = h.clone(a);
            this.filterInfo.filter = JSON.parse(
              e.decode(this.filterInfo.filter)
            );
            this.expressionTextBox.set("value", a.expression);
            this._destroyTable();
            this._createTable(this.appliedOn);
          },
          _destroyTable: function() {
            f.empty(this.tableParentContainer);
          },
          _createHeaderObj: function(b, d, e) {
            var g,
              k = f.create("th"),
              h = f.create("div", { innerHTML: b.title, title: b.title });
            b.hasOwnProperty("headerIcon") &&
              (g = f.create("div", { title: b.title }));
            0 < e &&
              (a.add(k, "esriCTTableTH"),
              a.add(h, "esriCTTableHeaderTitle "),
              b.hasOwnProperty("headerIcon") &&
                a.add(g, "esriCTTableHeaderIcon " + b.headerIcon));
            var p = f.create("div", {
                class: "esriCTPriorityColumnParentContainer"
              }),
              q = f.create("div", { class: "esriCTPriorityColumnParentDiv" });
            q.appendChild(h);
            b.hasOwnProperty("headerIcon") && q.appendChild(g);
            g = f.create("div", { class: "esriCTPriorityNumberDiv" });
            4 === e &&
              (f.create(
                "div",
                {
                  class: "esriCTPriorityOneDiv",
                  innerHTML: this.nls.smartActionsPage.priorityOneText
                },
                g
              ),
              f.create(
                "div",
                {
                  class: "esriCTPriorityTwoDiv",
                  innerHTML: this.nls.smartActionsPage.priorityTwoText
                },
                g
              ),
              f.create(
                "div",
                {
                  class: "esriCTPriorityThreeDiv",
                  innerHTML: this.nls.smartActionsPage.priorityThreeText
                },
                g
              ));
            0 === e
              ? this._addSearchControl(p)
              : (p.appendChild(q), p.appendChild(g));
            k.appendChild(p);
            c.set(k, "width", b.width);
            d.appendChild(k);
          },
          _addSearchControl: function(b) {
            var e = new v(
              {
                trim: !0,
                placeHolder: this.nls.actionPage.searchPlaceHolder,
                intermediateChanges: !0
              },
              f.create("div", {}, b)
            );
            c.set(e.domNode, "width", "350px");
            this.own(d(e, "change", h.hitch(this, this._searchTextUpdated)));
            b = f.create("div", { class: "esriCTExpandAllNode" }, b);
            this._expandAllCheckBox = new E(
              { class: "switch-toggle", checked: !1 },
              f.create("div", {}, b)
            );
            f.create(
              "label",
              { innerHTML: this.nls.actionPage.expandAllLabel },
              b
            );
            this.own(
              d(
                this._expandAllCheckBox,
                "change",
                h.hitch(this, function(b) {
                  b
                    ? (b = q(
                        ".esriCTToggleLayerIcon.esriCTToggleLayerCollapsed.esriCTToggleLayerExpanded",
                        this.layerAndFieldsMainDiv
                      )) &&
                      0 < b.length &&
                      m.forEach(b, function(a) {
                        a.click();
                      })
                    : (b = q(
                        ".esriCTToggleLayerIcon.esriCTToggleLayerCollapsed",
                        this.layerAndFieldsMainDiv
                      )) &&
                      0 < b.length &&
                      m.forEach(b, function(b) {
                        a.contains(b, "esriCTToggleLayerExpanded") || b.click();
                      });
                })
              )
            );
          },
          _searchTextUpdated: function(b) {
            var c;
            c = b.toLowerCase();
            if ("" !== c) {
              b = q("[searchstring]", this.tableParentContainer);
              c = q(
                "tr[searchstring^\x3d'" + c + "']",
                this.tableParentContainer
              );
              b.style("display", "none");
              b.removeClass("esriCTNotFilteredBySearch");
              b.addClass("esriCTFilteredBySearch");
              c.style("display", "");
              c.replaceClass(
                "esriCTNotFilteredBySearch",
                "esriCTFilteredBySearch"
              );
              b = this.appliedOn;
              for (var d in b) {
                var e, g, f;
                if (0 < Object.keys(b[d]).length) {
                  c = q(
                    "[layermaindivid \x3d '" + d + "']",
                    this.tableParentContainer
                  );
                  e = q("[layerid\x3d'" + d + "']", this.tableParentContainer);
                  g = !0;
                  for (f = 0; f < e.length; f++)
                    if (a.contains(e[f], "esriCTNotFilteredBySearch")) {
                      g = !1;
                      break;
                    }
                  g ? c.style("display", "none") : c.style("display", "");
                }
              }
            } else
              q("[layermaindivid]", this.tableParentContainer).style(
                "display",
                ""
              ),
                q("[searchstring]", this.tableParentContainer).style(
                  "display",
                  ""
                ),
                q("[searchstring]", this.tableParentContainer).removeClass(
                  "esriCTFilteredBySearch"
                ),
                q("[searchstring]", this.tableParentContainer).addClass(
                  "esriCTNotFilteredBySearch"
                );
          },
          _createHeaders: function(b) {
            var c, d;
            d = [
              { title: "", icon: "", width: "41%" },
              {
                title: this.nls.actionPage.actions.hide,
                width: "13%",
                headerIcon: "esriCTHide"
              },
              {
                title: this.nls.actionPage.actions.required,
                width: "13%",
                headerIcon: "esriCTRequired"
              },
              {
                title: this.nls.actionPage.actions.disabled,
                width: "13%",
                headerIcon: "esriCTDisabled"
              },
              {
                title: this.nls.smartActionsPage.priorityColumnText,
                icon: "",
                width: "20%"
              }
            ];
            c = f.create("tr");
            a.add(c, "esriCTTableRow");
            m.forEach(
              d,
              h.hitch(this, function(a, b) {
                this._createHeaderObj(a, c, b);
              })
            );
            b.appendChild(c);
          },
          _setMaxWidth: function() {
            var a = q(".esriCTTableHeaderTitle");
            m.forEach(
              a,
              h.hitch(this, function(a) {
                var b = c.getComputedStyle(a).width;
                c.set(a, "max-width", b);
              })
            );
          },
          _createPriorityIcons: function(a, b) {
            var c = b.Priority;
            a = f.create("td", {}, a);
            var e = f.create("div", { class: "esriCTPriorityIconMainDiv" }, a);
            m.forEach(
              c,
              h.hitch(this, function(a) {
                f.create(
                  "div",
                  {
                    class: "esriCTPriorityIcons esriCT" + a,
                    title: this.nls.actionPage.actions[a.toLowerCase()]
                  },
                  e
                );
              })
            );
            c = f.create(
              "div",
              {
                class: "jimu-icon jimu-icon-edit esriCTPriorityEditIcon",
                title: this.nls.smartActionsPage.priorityPopupTitle
              },
              e
            );
            this.own(
              d(
                c,
                "click",
                h.hitch(this, function(a) {
                  this._createPriorityTable(a.currentTarget.parentNode);
                  this._createPriorityPopup(a.currentTarget.parentNode, b);
                })
              )
            );
          },
          _createPriorityTable: function(a) {
            this._priorityTable = new x({
              fields: [
                {
                  name: "priorityName",
                  title: this.nls.smartActionsPage.priorityPopupColumnTitle,
                  type: "empty",
                  width: "80%"
                },
                {
                  name: "actions",
                  title: this.nls.intersectionPage.actionsText,
                  type: "actions",
                  width: "20%",
                  actions: ["up", "down"],
                  class: "actions"
                }
              ],
              selectable: !1
            });
            this._priorityTable.startup();
            this._populatePriorityTable(a);
          },
          _getExistingPriority: function(b) {
            var c = {
                esriCTHide: "Hide",
                esriCTRequired: "Required",
                esriCTDisabled: "Disabled"
              },
              d = [];
            m.forEach(
              b.childNodes,
              h.hitch(this, function(b, e) {
                if (3 > e) for (var g in c) a.contains(b, g) && d.push(c[g]);
              })
            );
            return d;
          },
          _populatePriorityTable: function(c) {
            c = this._getExistingPriority(c);
            m.forEach(
              c,
              h.hitch(this, function(c) {
                var d = f.create("div", {
                  innerHTML: this.nls.actionPage.actions[c.toLowerCase()],
                  title: this.nls.actionPage.actions[c.toLowerCase()]
                });
                a.add(d, "esriCTTablePriorityTitle");
                b.set(d, "priority", c);
                var e = f.create("div", {
                  title: this.nls.actionPage.actions[c.toLowerCase()]
                });
                a.add(e, "esriCTPriorityPopupIcon esriCT" + c);
                c = this._priorityTable.addRow({}).tr;
                c = q(".simple-table-cell", c)[0];
                c.appendChild(e);
                c.appendChild(d);
              })
            );
          },
          _fetchPriority: function() {
            var a = this._priorityTable.getRows(),
              c = [];
            m.forEach(
              a,
              h.hitch(this, function(a) {
                c.push(b.get(a.childNodes[0].childNodes[1], "priority"));
              })
            );
            return c;
          },
          _changePriority: function(c, d) {
            m.forEach(
              c,
              h.hitch(this, function(c, e) {
                m.forEach(
                  d.childNodes,
                  h.hitch(this, function(d, g) {
                    e === g &&
                      (m.forEach(
                        ["Hide", "Required", "Disabled"],
                        h.hitch(this, function(b) {
                          a.remove(d, "esriCT" + b);
                        })
                      ),
                      a.add(d, "esriCT" + c),
                      b.set(
                        d,
                        "title",
                        this.nls.actionPage.actions[c.toLowerCase()]
                      ));
                  })
                );
              })
            );
          },
          _createPriorityPopup: function(a, b) {
            var c = new w({
              titleLabel: this.nls.smartActionsPage.priorityPopupTitle,
              width: 450,
              maxHeight: 445,
              autoHeight: !0,
              content: this._priorityTable,
              class: this.baseClass,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var d = this._fetchPriority();
                    this._changePriority(d, a);
                    b.Priority = d;
                    c.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    c.close();
                  })
                }
              ],
              onClose: h.hitch(this, function() {})
            });
          },
          _createLayerName: function(c, e) {
            var g = e,
              k = f.create("td"),
              p = f.create("div", {}, k);
            this._jimuLayerInfos.getLayerInfoById(e)
              ? (g = this._jimuLayerInfos.getLayerInfoById(e).layerObject.name)
              : this._jimuLayerInfos.getTableInfoById(e) &&
                (g = this._jimuLayerInfos.getTableInfoById(e).layerObject.name);
            var l = f.create(
              "div",
              {
                class:
                  "esriCTToggleLayerIcon esriCTToggleLayerCollapsed esriCTToggleLayerExpanded",
                style: { "margin-top": "5px" }
              },
              p
            );
            f.create("div", { class: "esriCTLayerTitle", innerHTML: g }, p);
            b.set(l, "rootnodelayerid", e);
            this.own(
              d(
                l,
                "click",
                h.hitch(this, function(c) {
                  a.toggle(c.currentTarget, "esriCTToggleLayerExpanded");
                  a.contains(c.currentTarget, "esriCTToggleLayerExpanded") &&
                    this._expandAllCheckBox.set("checked", !1, !1);
                  c = b.get(c.currentTarget, "rootnodelayerid");
                  q('[layerid\x3d"' + c + '"]').toggleClass("esriCTHidden");
                })
              )
            );
            c.appendChild(k);
          },
          _createFieldNameTd: function(a, c) {
            var d = f.create("td", {
              innerHTML: c,
              class: "esriCTLayerFields"
            });
            a.appendChild(d);
            b.set(a, "searchstring", c.toLowerCase());
          },
          _addRows: function(a, c) {
            var d = c.layerDetails;
            c = c.fieldLabels;
            var e = [],
              g;
            for (g in d) {
              var k = d[g],
                p = f.create("tr", { class: "esriCTLayerNameRow" });
              this._createLayerName(p, g);
              b.set(p, "layermaindivid", g);
              a.appendChild(p);
              for (var l in k) {
                p = f.create("tr", {
                  class: "esriCTLayerFieldRow esriCTHidden"
                });
                b.set(p, "layerid", g);
                b.set(p, "field", l);
                this._createFieldNameTd(p, c[g][l]);
                var n = { layerid: g, field: l, action: "Hide" },
                  x = "";
                k[l].ExistingExpressions.hasOwnProperty("Hide") &&
                  (x = k[l].ExistingExpressions.Hide);
                this._createCheckBox(p, n, k[l].Hide, x);
                n.action = "Required";
                x = "";
                k[l].ExistingExpressions.hasOwnProperty("Required") &&
                  (x = k[l].ExistingExpressions.Required);
                this._createCheckBox(p, n, k[l].Required, x);
                n.action = "Disabled";
                x = "";
                k[l].ExistingExpressions.hasOwnProperty("Disabled") &&
                  (x = k[l].ExistingExpressions.Disabled);
                this._createCheckBox(p, n, k[l].Disabled, x);
                -1 === e.indexOf(g) &&
                  (k[l].Hide || k[l].Required || k[l].Disabled) &&
                  e.push(g);
                this._createPriorityIcons(p, k[l]);
                a.appendChild(p);
              }
            }
            0 < e.length &&
              setTimeout(
                h.hitch(this, function() {
                  m.forEach(e, function(a) {
                    q('[rootnodelayerid\x3d"' + a + '"]').toggleClass(
                      "esriCTToggleLayerExpanded"
                    );
                    q('[layerid\x3d"' + a + '"]').toggleClass("esriCTHidden");
                  });
                }),
                100
              );
          },
          _createCheckBox: function(c, e, g, k) {
            var h = f.create("td");
            a.add(h, "esriCTCheckBoxTD");
            var p = f.create("div");
            g && k && (g = !1);
            var l = f.create("div");
            a.add(l, "esriCTCheckBoxMainDiv");
            var q = f.create("div");
            g = new A({ checked: g }, q);
            b.set(q, "action", e.action);
            var m = this.appliedOn[e.layerid][e.field];
            this.own(
              d(g, "change", function(a) {
                var c = b.get(this.domNode, "action");
                m[c] = a;
              })
            );
            l.appendChild(q);
            p.appendChild(l);
            k &&
              ((e = f.create("div", { title: k })),
              a.add(e, "esriCTExistingExpressionDiv"),
              p.appendChild(e));
            h.appendChild(p);
            c.appendChild(h);
          },
          _createTable: function(b) {
            var c = f.create("table");
            a.add(c, "esriCTTableMainNode");
            this._createHeaders(c);
            this.tableParentContainer.appendChild(c);
            (b = this._createLayerDetails(h.clone(b))) &&
              b.layerDetails &&
              b.fieldLabels &&
              ((this.appliedOn = b.layerDetails), this._addRows(c, b));
          },
          _validateIfLayerHaveUsedFields: function(a, b) {
            var c;
            b &&
              ((c = b.length),
              m.forEach(
                a,
                function(a) {
                  m.forEach(b, function(b) {
                    a.name === b.fieldObj.name &&
                      a.type === b.fieldObj.type &&
                      c--;
                  });
                },
                this
              ));
            return 0 === c ? !0 : !1;
          },
          _mergeActions: function(a, b) {
            for (var c = 0; c < a.length; c++)
              for (var d = 0; d < b.length; d++)
                if (b[d].filter && b[d].actionName === a[c].actionName) {
                  a[c] = h.clone(b[d]);
                  break;
                }
            return a;
          },
          _mergeFieldValidations: function(a) {
            var b = {};
            m.forEach(
              a,
              function(a) {
                for (var c in a)
                  b.hasOwnProperty(c)
                    ? (b[c] = this._mergeActions(b[c], a[c]))
                    : (b[c] = h.clone(a[c]));
              },
              this
            );
            return b;
          },
          _getLayersFieldValidations: function(a, b, c) {
            m.forEach(
              b,
              function(b) {
                b.featureLayer &&
                  b.featureLayer.id === c &&
                  b.fieldValidations &&
                  (a || (a = []), a.push(b.fieldValidations));
                b.relationshipInfos &&
                  (a = this._getLayersFieldValidations(
                    a,
                    b.relationshipInfos,
                    c
                  ));
              },
              this
            );
            return a;
          },
          _getPartsInExpression: function(a, b) {
            b &&
              m.forEach(
                b,
                h.hitch(this, function(b) {
                  b.parts ? this._getPartsInExpression(a, b.parts) : a.push(b);
                })
              );
            return a;
          },
          _createLayerDetails: function(a) {
            var b, c, d;
            c = null;
            this.filterInfo &&
              this.filterInfo.filter &&
              (b = this._getPartsInExpression(
                [],
                this.filterInfo.filter.parts
              ));
            c = {};
            d = {};
            m.forEach(
              this._totalLayers,
              function(e) {
                if (
                  !e.isTable ||
                  (e.isTable && 0 < e.layerObject.relationships.length)
                ) {
                  var g,
                    f,
                    k = [];
                  g = !1;
                  f = {};
                  g = this._jimuLayerInfos.getLayerOrTableInfoById(e.id);
                  f.allFields = g.layerObject.fields;
                  g &&
                    ((g = this.editUtils.getConfigInfo(g, {})),
                    (f.fieldInfos = g.fieldInfos));
                  g = this._validateIfLayerHaveUsedFields(f.allFields, b);
                  f &&
                    f.fieldInfos &&
                    (g || !b) &&
                    ((k = this._getLayersFieldValidations(
                      k,
                      this._configInfos,
                      e.id
                    )),
                    (f.fieldValidations = this._mergeFieldValidations(k)),
                    (c[e.id] = {}),
                    (d[e.id] = {}),
                    m.forEach(
                      f.fieldInfos,
                      function(b) {
                        var g;
                        g = D.getDefaultPortalFieldInfo(b);
                        "esriFieldTypeGeometry" !== b.type &&
                          "esriFieldTypeOID" !== b.type &&
                          "esriFieldTypeBlob" !== b.type &&
                          "esriFieldTypeGlobalID" !== b.type &&
                          "esriFieldTypeRaster" !== b.type &&
                          "esriFieldTypeXML" !== b.type &&
                          ((d[e.id][b.name] = g.label),
                          (c[e.id][b.name] =
                            a && a[e.id] && a[e.id][b.name]
                              ? a[e.id][b.name]
                              : { Hide: !1, Required: !1, Disabled: !1 }),
                          f.fieldValidations && f.fieldValidations[b.name]
                            ? ((g = this._getPriorites(
                                f.fieldValidations[b.name]
                              )),
                              (c[e.id][b.name].Priority = g.Priority),
                              (c[e.id][b.name].ExistingExpressions =
                                g.ExistingExpressions))
                            : ((c[e.id][b.name].Priority = [
                                "Hide",
                                "Required",
                                "Disabled"
                              ]),
                              (c[e.id][b.name].ExistingExpressions = [])));
                      },
                      this
                    ));
                }
              },
              this
            );
            return { layerDetails: c, fieldLabels: d };
          },
          _getPriorites: function(a) {
            var b = [],
              c = {};
            m.forEach(
              a,
              function(a) {
                b.push(a.actionName);
                a.filter &&
                  a.filter.displaySQL &&
                  (!a.filter.hasOwnProperty("smartActionGroupName") ||
                    !this.prevName ||
                    (a.filter.hasOwnProperty("smartActionGroupName") &&
                      this.prevName &&
                      this.prevName !== a.filter.smartActionGroupName)) &&
                  (c[a.actionName] = a.filter.displaySQL);
              },
              this
            );
            return { Priority: b, ExistingExpressions: c };
          },
          _getVaidationForAction: function(a, b) {
            var c = null;
            m.some(a, function(a) {
              if (a.actionName === b && a.filter && a.filter.displaySQL)
                return (c = a), !0;
            });
            return c;
          },
          _applysettingsToField: function(a, b) {
            var c, d;
            d = [];
            d = this._getLayersFieldValidations(d, this._configInfos, a);
            c = b.appliedOn[a];
            for (var e = 0; e < d.length; e++) {
              var g = d[e];
              if (g)
                for (var f in c) {
                  for (
                    var k = c[f], p = [], l = !1, q = 0;
                    q < k.Priority.length;
                    q++
                  ) {
                    var m = k.Priority[q],
                      n = {};
                    n.actionName = m;
                    n.submitWhenHidden = !1;
                    if (k[m])
                      (l = !0),
                        "Hide" === m &&
                          (n.submitWhenHidden = b.submitWhenHidden),
                        (n.expression = b.filterInfo.expression),
                        (n.filter = h.clone(b.filterInfo).filter),
                        (n.filter.smartActionGroupName = b.name),
                        this._removeSettingsFromOtherGroups(b.name, a, f, m);
                    else if (g && g[f]) {
                      var x = this._getVaidationForAction(g[f], m);
                      x &&
                      x.filter &&
                      !k[m] &&
                      x.filter.hasOwnProperty("smartActionGroupName") &&
                      x.filter.smartActionGroupName === this.prevName
                        ? (l = !0)
                        : x &&
                          ((n.expression = x.filter.expr),
                          (n.filter = x.filter));
                    }
                    p.push(n);
                  }
                  l && (g || (g = {}), (g[f] = p));
                }
            }
          },
          _removePrevSettingsFromLayerFields: function(a) {
            var b = [];
            if ((b = this._getLayersFieldValidations(b, this._configInfos, a)))
              for (var c = 0; c < b.length; c++)
                if ((a = b[c]))
                  for (var d in a)
                    a &&
                      a[d] &&
                      m.forEach(
                        a[d],
                        function(a) {
                          a &&
                            a.filter &&
                            a.filter.hasOwnProperty("smartActionGroupName") &&
                            a.filter.smartActionGroupName === this.prevName &&
                            ((a.submitWhenHidden = !1),
                            a.hasOwnProperty("expression") &&
                              delete a.expression,
                            delete a.filter);
                        },
                        this
                      );
          },
          _removeSettingsFromOtherGroups: function(a, b, c, d) {
            var e;
            if (this.existingGroups)
              for (var g in this.existingGroups)
                g !== a &&
                  g !== this.prevName &&
                  (e = this.existingGroups[g].appliedOn) &&
                  e.hasOwnProperty(b) &&
                  e[b].hasOwnProperty(c) &&
                  e[b][c].hasOwnProperty(d) &&
                  (e[b][c][d] = !1);
          },
          _applySettingsInLayer: function(a) {
            for (var b in a.appliedOn) {
              var c;
              this._prevAppliedOnLayers &&
                -1 < this._prevAppliedOnLayers.indexOf(b) &&
                ((c = this._prevAppliedOnLayers.indexOf(b)),
                this._prevAppliedOnLayers.splice(c, 1));
              this._applysettingsToField(b, a);
            }
            this.deleteGroup();
          },
          deleteGroup: function() {
            this._prevAppliedOnLayers &&
              m.forEach(
                this._prevAppliedOnLayers,
                function(a) {
                  this._removePrevSettingsFromLayerFields(a);
                },
                this
              );
          }
        });
      });
    },
    "widgets/SmartEditor/utils": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array esri/geometry/Extent jimu/utils esri/dijit/AttributeInspector".split(
        " "
      ), function(l, n, h, m, f, a) {
        var c = {};
        c.ATI = l([a], {
          constructor: function() {
            this._aiConnects = [];
            this._selection = [];
            this._toolTips = [];
          }
        });
        c.checkIfFieldAliasAlreadyExists = function(a, c) {
          return 0 <= a.split(",").indexOf(c);
        };
        c.pointToExtent = function(a, c, d) {
          var b = a.extent.getWidth() / a.width;
          d *= b;
          return new m(c.x - d, c.y - d, c.x + d, c.y + d, a.spatialReference);
        };
        c.filterOnlyUpdatedAttributes = function(a, c, d) {
          if (null === c || void 0 === c) return a;
          var b = {},
            e;
          for (e in a)
            a.hasOwnProperty(e) &&
              (e === d.objectIdField || e === d.globalIdField
                ? (b[e] = a[e])
                : (null === a[e] && "" === c[e]) ||
                  a[e] === c[e] ||
                  (b[e] = a[e]));
          return b;
        };
        c.mergeFieldInfosWithConfiguration = function(a, c) {
          var b = [],
            e = this.getDefaultEditableFieldInfos(a, !1);
          c && c.fieldInfos
            ? (h.forEach(
                c.fieldInfos,
                function(a) {
                  h.some(
                    e,
                    function(c) {
                      if (a.fieldName === c.fieldName)
                        return b.push(this.mergeLastToFirst(c, a)), !0;
                    },
                    this
                  );
                },
                this
              ),
              h.forEach(
                e,
                function(a) {
                  0 ===
                    h.filter(
                      b,
                      function(b) {
                        return b.fieldName === a.fieldName;
                      },
                      this
                    ).length && b.push(a);
                },
                this
              ))
            : (b = e);
          var f = [];
          a.layerObject.hasOwnProperty("globalIdField") &&
            void 0 !== a.layerObject.globalIdField &&
            null !== a.layerObject.globalIdField &&
            f.push(a.layerObject.globalIdField);
          a.layerObject.hasOwnProperty("objectIdField") &&
            void 0 !== a.layerObject.objectIdField &&
            null !== a.layerObject.objectIdField &&
            f.push(a.layerObject.objectIdField);
          if (
            a.layerObject.hasOwnProperty("editFieldsInfo") &&
            void 0 !== a.layerObject.editFieldsInfo &&
            null !== a.layerObject.editFieldsInfo
          )
            for (var l in a.layerObject.editFieldsInfo)
              a.layerObject.editFieldsInfo.hasOwnProperty(l) &&
                f.push(a.layerObject.editFieldsInfo[l]);
          return (b = b.filter(function(a) {
            return -1 !== h.indexOf(f, a.fieldName) ? !1 : a.isEditableOnLayer;
          }));
        };
        c.getDefaultEditableFieldInfos = function(a, c) {
          var b = [],
            e = this.getFieldInfosFromWebmap(a);
          a = this.getFieldInfosLayer(a);
          if (void 0 === e || null === e) e = a;
          else {
            var f = [];
            h.forEach(a, function(a) {
              0 ===
                h.filter(e, function(b) {
                  return b.name === a.fieldName;
                }).length && ((a.isEditableOnLayer = a.editable), f.push(a));
            });
            0 < f.length && (e = e.concat(f));
          }
          h.forEach(e, function(a) {
            !1 === a.hasOwnProperty("isEditableOnLayer") &&
              (a.isEditableOnLayer = a.editable);
            !1 === a.editable && (a.isEditable = a.editable);
            !1 === a.isEditable && (a.editable = a.isEditable);
            a.fieldName = a.name;
            !0 === a.editable && !0 === c
              ? b.push(n.clone(a))
              : !1 === c && b.push(n.clone(a));
          });
          return b;
        };
        c.getFieldInfosFromWebmap = function(a) {
          var b = null,
            c = a.getPopupInfo();
          c &&
            c.fieldInfos &&
            ((b = []),
            h.forEach(
              c.fieldInfos,
              function(c) {
                h.some(
                  a.layerObject.fields,
                  function(a) {
                    if (a.name === c.fieldName)
                      return (
                        (a = this.mergeFirstToLast(c, a)),
                        a.format &&
                          a.format.dateFormat &&
                          a.format.dateFormat.toLowerCase() &&
                          0 <=
                            a.format.dateFormat.toLowerCase().indexOf("time") &&
                          (a.format.time = !0),
                        b.push(a),
                        !0
                      );
                  },
                  this
                );
              },
              this
            ));
          return b;
        };
        c.getFieldInfosLayer = function(a) {
          var b = [];
          a &&
            a.layerObject &&
            h.forEach(
              a.layerObject.fields,
              function(a) {
                var c = f.getDefaultPortalFieldInfo(a),
                  c = this.mergeFirstToLast(c, a);
                c.format &&
                  c.format.dateFormat &&
                  c.format.dateFormat.toLowerCase() &&
                  0 <= c.format.dateFormat.toLowerCase().indexOf("time") &&
                  (c.format.time = !0);
                c.visible = !0;
                b.push(c);
              },
              this
            );
          return b;
        };
        c.getConfigInfos = function(a, c, d, f, k) {
          var b = [],
            e = a.getLayerInfoArrayOfWebmap(),
            l = [];
          k && ((l = a.getTableInfoArrayOfWebmap()), (e = e.concat(l)));
          h.forEach(
            e,
            function(a) {
              var e = !1;
              ("Table" !== a.layerObject.type &&
                "Feature Layer" !== a.layerObject.type) ||
                !a.layerObject.url ||
                (a.layerObject.isEditable && a.layerObject.isEditable() && d
                  ? (e = !0)
                  : void 0 !== d && !1 === d && (e = !0));
              if (!0 === e) {
                var g = this.getConfigInfo(a, c);
                g.layerInfo = a;
                !0 === g.featureLayer.layerAllowsDelete &&
                !1 === g.featureLayer.layerAllowsCreate &&
                !1 === g.featureLayer.layerAllowsUpdate
                  ? console.warn(
                      g.layerInfo.title + " delete only not supported"
                    )
                  : f && !0 === f
                  ? !0 ===
                      h.some(c, function(a) {
                        return a.featureLayer.id === g.featureLayer.id;
                      }) && b.push(g)
                  : b.push(g);
              }
            },
            this
          );
          return b;
        };
        c.getConfigInfo = function(a, c) {
          var b = null,
            e = this.createDefaultConfigInfo(a);
          !1 ===
            h.some(
              c,
              function(c) {
                return c.featureLayer && c.featureLayer.id === a.layerObject.id
                  ? ((b = n.clone(c)),
                    (b.fieldInfos = this.mergeFieldInfosWithConfiguration(
                      a,
                      b
                    )),
                    (b = this.mergeDefaultWithConfig(b, e)),
                    !0)
                  : !1;
              },
              this
            ) && (b = e);
          return b;
        };
        c.mergeDefaultWithConfig = function(a, c) {
          a.featureLayer = c.featureLayer;
          !0 === a.allowDelete &&
            !1 === a.featureLayer.layerAllowsDelete &&
            (a.allowDelete = !1);
          !1 === a.disableGeometryUpdate &&
            !1 === a.featureLayer.layerAllowGeometryUpdates &&
            (a.disableGeometryUpdate = !0);
          !1 === a.featureLayer.layerAllowsCreate &&
            !0 === a.featureLayer.layerAllowsUpdate &&
            (a.allowUpdateOnly = !0);
          return a;
        };
        c.createDefaultConfigInfo = function(a) {
          var b = !1,
            c = !1,
            f = !1,
            k = !1;
          try {
            var h = a.layerObject.getEditCapabilities();
            h.canCreate && (b = !0);
            h.canUpdate && (k = c = !0);
            h.canDelete && (f = !0);
          } catch (t) {
            a.layerObject.hasOwnProperty("capabilities") &&
              (-1 === String(a.layerObject.capabilities).indexOf("Update") &&
              -1 === String(a.layerObject.capabilities).indexOf("Delete") &&
              -1 === String(a.layerObject.capabilities).indexOf("Create") &&
              -1 !== String(a.layerObject.capabilities).indexOf("Editing")
                ? (b = f = c = !0)
                : (-1 !==
                    String(a.layerObject.capabilities).indexOf("Update") &&
                    (k = c = !0),
                  -1 !== String(a.layerObject.capabilities).indexOf("Delete") &&
                    (f = !0),
                  -1 !== String(a.layerObject.capabilities).indexOf("Create") &&
                    (b = !0)));
          }
          a.layerObject.hasOwnProperty("allowGeometryUpdates") &&
            (k = a.layerObject.allowGeometryUpdates);
          "Table" === a.layerObject.type &&
            a.layerObject.url &&
            a.getCapabilitiesOfWebMap() &&
            ((c = a.getCapabilitiesOfWebMap()),
            a.layerObject.isEditable &&
            a.layerObject.isEditable() &&
            c &&
            -1 < c.toLowerCase().indexOf("editing")
              ? (c = !0)
              : (f = c = b = !1),
            (k = !1));
          return {
            featureLayer: {
              id: a.layerObject.id,
              layerAllowsCreate: b,
              layerAllowsUpdate: c,
              layerAllowsDelete: f,
              layerAllowGeometryUpdates: k
            },
            disableGeometryUpdate: !k,
            allowUpdateOnly: !b,
            allowDelete: !1,
            fieldInfos: this.mergeFieldInfosWithConfiguration(a, null),
            _editFlag: b || c ? !0 : !1
          };
        };
        c.mergeLastToFirst = function() {
          for (var a = {}, c = 0, d = arguments.length, f; c < d; c++)
            for (f in arguments[c])
              arguments[c].hasOwnProperty(f) && (a[f] = arguments[c][f]);
          return a;
        };
        c.mergeFirstToLast = function() {
          for (var a = {}, c = arguments.length - 1, d; 0 <= c; c--)
            for (d in arguments[c])
              arguments[c].hasOwnProperty(d) && (a[d] = arguments[c][d]);
          return a;
        };
        c.isObjectEmpty = function(a) {
          if (a) for (var b in a) if (a.hasOwnProperty(b)) return !1;
          return !0;
        };
        c.addDateTimeFormat = function(a) {
          a &&
            a.format &&
            null !== a.format &&
            a.format.dateFormat &&
            null !== a.format.dateFormat &&
            0 <=
              a.format.dateFormat
                .toString()
                .toUpperCase()
                .indexOf("TIME") &&
            (a.format.time = !0);
        };
        c.isDuplicateGroupName = function(a, c) {
          var b = !1;
          h.some(
            c,
            n.hitch(this, function(c) {
              if (a.toLowerCase() === c.toLowerCase()) return (b = !0);
            })
          );
          return b;
        };
        return c;
      });
    },
    "esri/dijit/AttributeInspector": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/sniff dojo/_base/kernel dojo/has dojo/dom-style dojo/dom-construct ../kernel ../lang ../domUtils ../layers/InheritedDomain ../layers/FeatureLayer dojo/i18n!../nls/jsapi dojo/fx dojox/gfx dijit/_Widget dijit/_Templated dijit/Editor dijit/_editor/plugins/LinkDialog dijit/_editor/plugins/TextColor ./_EventedWidget ./editing/AttachmentEditor ./editing/Util ../tasks/query dijit/form/DateTextBox dijit/form/TextBox dijit/form/NumberTextBox dijit/form/FilteringSelect dijit/form/NumberSpinner dijit/form/Button dijit/form/SimpleTextarea dijit/form/ValidationTextBox dijit/form/TimeTextBox dijit/Tooltip dojo/data/ItemFileReadStore dojox/date/islamic dojox/date/islamic/Date dojox/date/islamic/locale dojo/text!./templates/AttributeInspector.html".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E,
        C,
        F,
        D,
        y,
        z,
        H,
        J,
        B,
        G,
        N,
        M,
        O,
        Q,
        I,
        P,
        K,
        R,
        T,
        S
      ) {
        var L = l([C, x, w], {
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
          constructor: function(a, b) {
            n.mixin(this, u.widgets.attributeInspector);
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
                function(b) {
                  b = b.featureLayer;
                  if (b.loaded) a--;
                  else
                    var c = m.connect(b, "onLoad", this, function(b) {
                      m.disconnect(c);
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
            h.forEach(this._aiConnects, m.disconnect);
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
            this._featureIdx = c === t.SELECTION_NEW ? 0 : this._featureIdx;
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
          onLayerUpdateEnd: function(a, b, c, d) {},
          onLayerError: function(a, b, c, d) {},
          onLayerEditsError: function(a, b, c, d) {},
          onLayerEditsComplete: function(a, b, c, d) {
            d = d || [];
            if (d.length) {
              var e = this._selection,
                g = a.featureLayer.objectIdField;
              h.forEach(
                d,
                n.hitch(this, function(a) {
                  h.some(
                    e,
                    n.hitch(this, function(b, c) {
                      if (b.attributes[g] !== a.objectId) return !1;
                      this._selection.splice(c, 1);
                      return !0;
                    })
                  );
                })
              );
            }
            b = b || [];
            b.length &&
              ((this._selection = D.findFeatures(b, a.featureLayer)),
              (this._featureIdx = 0));
            d = this._numFeatures = (this._selection = D.sortFeaturesById(
              this._layerInfos,
              this._selection
            ))
              ? this._selection.length
              : 0;
            if (b.length) {
              if ((b = d ? this._selection[this._featureIdx] : null))
                (d = b.getLayer().getEditCapabilities()),
                  (d.canCreate && !d.canUpdate) || this._showFeature(b);
              this._updateUI();
            }
            c = c || [];
            if (c.length) {
              var f = this._rollbackInfo;
              h.forEach(
                c,
                function(b) {
                  var d = D.findFeatures(c, a.featureLayer)[0];
                  if (
                    !b.success &&
                    d.attributes[a.featureLayer.objectIdField] === b.objectId &&
                    f
                  ) {
                    var e = f.field;
                    b = f.graphic.attributes[e.name];
                    var g = h.filter(
                      this._currentLInfo.fieldInfos,
                      function(a) {
                        return a.fieldName === e.name;
                      },
                      this
                    )[0].dijit;
                    d.attributes[e.name] = b;
                    "esriFieldTypeDate" === e.type && (b = new Date(b));
                    this._setValue(g, b);
                  }
                },
                this
              );
            }
            this._rollbackInfo = null;
          },
          onFieldValueChange: function(a, b) {
            var c = a.field,
              d = a.dijit,
              e = this._currentFeature,
              g = this._currentLInfo,
              f = c.name;
            a = this._isFieldRequired(c, a);
            if (
              "" === d.displayedValue ||
              "dijit.form.ValidationTextBox" !== d.declaredClass ||
              d.isValid()
            )
              if (
                "" !== d.displayedValue &&
                d.displayedValue !== b &&
                d.isValid &&
                !d.isValid()
              )
                this._setValue(d, e.attributes[c.name]);
              else {
                var k = !(
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
                    (k && isNaN(b)))
                ) {
                  f = e.attributes[c.name];
                  if (
                    "esriFieldTypeDate" === c.type &&
                    ((f = new Date(f)), d instanceof Array)
                  ) {
                    this._setValue(d[0], f);
                    this._setValue(d[1], f);
                    return;
                  }
                  this._setValue(d, f);
                } else {
                  if (k) {
                    if (isNaN(b) || "" === b) b = null;
                    k && null !== b && (b = Number(b));
                  }
                  "esriFieldTypeDate" === c.type &&
                    (d instanceof Array
                      ? ((b = d[0].getValue()),
                        (d = d[1].getValue()),
                        (b =
                          b && d
                            ? new Date(
                                b.getFullYear(),
                                b.getMonth(),
                                b.getDate(),
                                d.getHours(),
                                d.getMinutes(),
                                d.getSeconds(),
                                d.getMilliseconds()
                              )
                            : b || d || null))
                      : ((b = d.getValue()), c.domain && (b = Number(b))),
                    (b =
                      b && b.getTime
                        ? b.getTime()
                        : b && b.toGregorian
                        ? b.toGregorian().getTime()
                        : b));
                  if (this._currentFeature.attributes[c.name] !== b) {
                    if (f === g.typeIdField) {
                      var p = this._findFirst(g.types, "id", b);
                      h.forEach(
                        g.fieldInfos,
                        function(a) {
                          (c = a.field) &&
                            c.name !== g.typeIdField &&
                            ((a = a.dijit),
                            this._setFieldDomain(a, p, c) &&
                              a &&
                              (this._setValue(a, e.attributes[c.name] + ""),
                              !1 === a.isValid() && this._setValue(a, null)));
                        },
                        this
                      );
                    }
                    this.onAttributeChange(e, f, b);
                  }
                }
              }
            else this._setValue(d, e.attributes[c.name]);
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
              c,
              d;
            this._userIds = {};
            d = b.id;
            b.credential && (this._userIds[d] = b.credential.userId);
            a.userId && (this._userIds[d] = a.userId);
            this._connect(
              b,
              "onSelectionComplete",
              n.hitch(this, "onLayerSelectionChange", a)
            );
            this._connect(
              b,
              "onSelectionClear",
              n.hitch(this, "onLayerSelectionClear", a)
            );
            this._connect(
              b,
              "onEditsComplete",
              n.hitch(this, "onLayerEditsComplete", a)
            );
            this._connect(b, "error", n.hitch(this, "onLayerError", a));
            this._connect(
              b,
              "onUpdateEnd",
              n.hitch(this, "onLayerUpdateEnd", a)
            );
            a.showAttachments = b.hasAttachments
              ? q.isDefined(a.showAttachments)
                ? a.showAttachments
                : !0
              : !1;
            a.hideFields = a.hideFields || [];
            a.htmlFields = a.htmlFields || [];
            a.isEditable = b.isEditable()
              ? q.isDefined(a.isEditable)
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
            (d = this._findFirst(a.fieldInfos, "fieldName", b.objectIdField)) ||
              a.showObjectID ||
              a.hideFields.push(b.objectIdField);
            var e = this._getFields(a.featureLayer);
            if (e) {
              var g = a.fieldInfos || [],
                g = h.map(g, function(a) {
                  return n.mixin({}, a);
                });
              g.length
                ? (a.fieldInfos = h.filter(
                    h.map(
                      g,
                      n.hitch(this, function(b) {
                        var c =
                          b.stringFieldOption ||
                          (this._isInFields(b.fieldName, a.htmlFields)
                            ? L.STRING_FIELD_OPTION_RICHTEXT
                            : L.STRING_FIELD_OPTION_TEXTBOX);
                        return n.mixin(b, {
                          field: this._findFirst(e, "name", b.fieldName),
                          stringFieldOption: c
                        });
                      })
                    ),
                    "return item.field;"
                  ))
                : ((e = h.filter(
                    e,
                    n.hitch(this, function(b) {
                      return !this._isInFields(b.name, a.hideFields);
                    })
                  )),
                  (a.fieldInfos = h.map(
                    e,
                    n.hitch(this, function(b) {
                      var c = this._isInFields(b.name, a.htmlFields)
                        ? L.STRING_FIELD_OPTION_RICHTEXT
                        : L.STRING_FIELD_OPTION_TEXTBOX;
                      return {
                        fieldName: b.name,
                        field: b,
                        stringFieldOption: c
                      };
                    })
                  )));
              a.showGlobalID &&
                !c &&
                g.push(this._findFirst(e, "name", b.globalIdField));
              a.showObjectID &&
                !d &&
                g.push(this._findFirst(e, "name", b.objectIdField));
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
            var a = h.filter(this._layerInfos, function(a) {
              return a.showAttachments;
            });
            a &&
              a.length &&
              ((this._attachmentEditor = new F(
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
            h.forEach(this._layerInfos, this._getSelection, this);
            this._selection = D.sortFeaturesById(
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
              c = this._currentLInfo;
            this.layerName.innerHTML =
              c && 0 !== a
                ? c.featureLayer
                  ? c.featureLayer.name
                  : ""
                : this.NLS_noFeaturesSelected;
            b.set(this.attributeTable, "display", a ? "" : "none");
            b.set(this.editButtons, "display", a ? "" : "none");
            b.set(
              this.navButtons,
              "display",
              !this._hideNavButtons && 1 < a ? "" : "none"
            );
            this.navMessage.innerHTML = q.substitute(
              {
                idx: this._featureIdx + 1,
                of: this.NLS_of,
                numFeatures: this._numFeatures
              },
              this._navMessage
            );
            this._attachmentEditor &&
              b.set(
                this._attachmentEditor.domNode,
                "display",
                c && c.showAttachments && a ? "" : "none"
              );
            b.set(
              this.deleteBtn.domNode,
              "display",
              (c && !1 === c.showDeleteButton) || !this._canDelete ? "none" : ""
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
              var c = b.getEditCapabilities({
                feature: a,
                userId: this._userIds[b.id]
              });
              this._canUpdate = c.canUpdate;
              this._canDelete = c.canDelete;
              if ((c = this._getLInfoFromFeatureLayer(b))) {
                this._setCurrentLInfo(c);
                var d = a.attributes,
                  e = this._findFirst(c.types, "id", d[c.typeIdField]),
                  g = null;
                h.forEach(
                  c.fieldInfos,
                  function(a) {
                    g = a.field;
                    var b = [];
                    a.dijit && 1 < a.dijit.length
                      ? h.forEach(a.dijit, function(a) {
                          b.push(a);
                        })
                      : b.push(a.dijit);
                    h.forEach(
                      b,
                      n.hitch(this, function(a) {
                        if (a) {
                          var b = this._setFieldDomain(a, e, g),
                            c = d[g.name],
                            c =
                              c && b && b.codedValues && b.codedValues.length
                                ? b.codedValues[c]
                                  ? b.codedValues[c].name
                                  : c
                                : c;
                          q.isDefined(c) || (c = "");
                          "dijit.form.DateTextBox" === a.declaredClass ||
                          "dijit.form.TimeTextBox" === a.declaredClass
                            ? (c = "" === c ? null : new Date(c))
                            : "dijit.form.FilteringSelect" ===
                                a.declaredClass &&
                              ((a._lastValueReported = null),
                              (c = d[g.name] + ""));
                          try {
                            this._setValue(a, c),
                              "dijit.form.FilteringSelect" ===
                                a.declaredClass &&
                                !1 === a.isValid() &&
                                this._setValue(a, null);
                          } catch (U) {
                            a.set("displayedValue", this.NLS_errorInvalid, !1);
                          }
                        }
                      })
                    );
                  },
                  this
                );
                this._attachmentEditor &&
                  c.showAttachments &&
                  this._attachmentEditor.showAttachments(
                    this._currentFeature,
                    b
                  );
                (a = b.getEditSummary(a))
                  ? ((this.editorTrackingInfoDiv.innerHTML = a),
                    k.show(this.editorTrackingInfoDiv))
                  : k.hide(this.editorTrackingInfoDiv);
              }
            }
          },
          _setFieldDomain: function(a, b, c) {
            if (!a) return null;
            var d = c.domain;
            b &&
              b.domains &&
              b.domains[c.name] &&
              !1 === b.domains[c.name] instanceof r &&
              (d = b.domains[c.name]);
            if (!d) return null;
            d.codedValues && 0 < d.codedValues.length
              ? (a.set(
                  "store",
                  this._toStore(
                    h.map(d.codedValues, function(a) {
                      return { id: (a.code += ""), name: a.name };
                    })
                  )
                ),
                this._setValue(a, d.codedValues[0].code))
              : ((a.constraints = {
                  min: q.isDefined(d.minValue) ? d.minValue : Number.MIN_VALUE,
                  max: q.isDefined(d.maxValue) ? d.maxValue : Number.MAX_VALUE
                }),
                this._setValue(a, a.constraints.min));
            return d;
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
              : h.filter(
                  h.map(b, n.hitch(this, "_findFirst", a, "name")),
                  q.isDefined
                );
          },
          _isInFields: function(a, b) {
            return a && (b || b.length)
              ? h.some(b, function(b) {
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
            return (a = h.filter(a, function(a) {
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
            this._attributes = e.create(
              "table",
              { cellspacing: "0", cellpadding: "0" },
              this.attributeTable
            );
            var a = e.create("tbody", null, this._attributes),
              b = this._currentLInfo,
              c = this._findFirst(
                b.types,
                "id",
                this._currentFeature.attributes[b.typeIdField]
              );
            h.forEach(b.fieldInfos, n.hitch(this, "_createField", c, a), this);
            this._createOnlyFirstTime = !1;
          },
          _createField: function(a, b, c) {
            var d = this._currentLInfo,
              g = c.field;
            if (
              !this._isInFields(g.name, d.hideFields) &&
              !this._isInFields(
                g.name,
                this._editorTrackingInfos[d.featureLayer.id]
              )
            ) {
              var f = !1,
                k,
                h,
                p;
              b = e.create("tr", null, b);
              k = e.create(
                "td",
                {
                  innerHTML: c.label || g.alias || g.name,
                  class: this.css.label,
                  "data-fieldname": g.name
                },
                b
              );
              this._isFieldRequired(g, c) &&
                e.create("span", { class: this.css.red, innerHTML: " *" }, k);
              b = e.create("td", null, b);
              if (c.customField)
                e.place(
                  c.customField.domNode || c.customField,
                  e.create("div", null, b),
                  "first"
                ),
                  (h = c.customField);
              else if (
                !1 === d.isEditable ||
                !1 === g.editable ||
                !1 === c.isEditable ||
                "esriFieldTypeOID" === g.type ||
                "esriFieldTypeGlobalID" === g.type ||
                (!this._canUpdate && !this._createOnlyFirstTime)
              )
                f = !0;
              d =
                d.typeIdField &&
                g.name.toLowerCase() == d.typeIdField.toLowerCase();
              k = !!this._getDomainForField(g, a);
              !h && d
                ? (h = this._createTypeField(g, c, b))
                : !h && k && (h = this._createDomainField(g, c, a, b));
              if (!h)
                switch (g.type) {
                  case "esriFieldTypeString":
                    h = this._createStringField(g, c, b);
                    break;
                  case "esriFieldTypeDate":
                    h = this._createDateField(g, c, b);
                    c.format &&
                      c.format.time &&
                      (p = this._createTimeField(g, c, b));
                    break;
                  case "esriFieldTypeInteger":
                  case "esriFieldTypeSmallInteger":
                    h = this._createIntField(g, c, b);
                    break;
                  case "esriFieldTypeSingle":
                  case "esriFieldTypeDouble":
                    h = this._createFltField(g, c, b);
                    break;
                  default:
                    h = this._createStringField(g, c, b);
                }
              c.tooltip &&
                c.tooltip.length &&
                this._toolTips.push(
                  new I({ connectId: [h.id], label: c.tooltip })
                );
              h.onChange = n.hitch(this, "onFieldValueChange", c);
              h.set("disabled", f);
              p
                ? ((c.dijit = [h, p]),
                  (p.onChange = n.hitch(this, "onFieldValueChange", c)),
                  p.set("disabled", f))
                : (c.dijit = h);
            }
          },
          _createTypeField: function(a, b, c) {
            c = e.create("div", null, c);
            var d = a.domain;
            return d && "range" === d.type && d.minValue === d.maxValue
              ? new O(
                  {
                    class: this.css.field,
                    trim: !0,
                    maxLength: a.length,
                    name: a.alias || a.name,
                    required: this._isFieldRequired(a, b)
                  },
                  c
                )
              : new B(
                  {
                    class: this.css.field,
                    name: a.alias || a.name,
                    required: this._isFieldRequired(a, b),
                    store: this._toStore(
                      h.map(this._currentLInfo.types, function(a) {
                        return { id: a.id, name: a.name };
                      })
                    ),
                    searchAttr: "name"
                  },
                  c
                );
          },
          _getDomainForField: function(a, b) {
            var c = a.domain;
            (a = a.name) &&
              b &&
              b.domains &&
              b.domains[a] &&
              !1 === b.domains[a] instanceof r &&
              (c = b.domains[a]);
            return c || null;
          },
          _createDomainField: function(a, b, c, d) {
            c = this._getDomainForField(a, c);
            d = e.create("div", null, d);
            return c.codedValues
              ? new B(
                  {
                    class: this.css.field,
                    name: a.alias || a.name,
                    searchAttr: "name",
                    required: this._isFieldRequired(a, b)
                  },
                  d
                )
              : new G({ class: this.css.field }, d);
          },
          _createStringField: function(a, b, c) {
            c = e.create("div", null, c);
            var d = {
              trim: !0,
              maxLength: a.length,
              required: this._isFieldRequired(a, b)
            };
            if (b.stringFieldOption === L.STRING_FIELD_OPTION_TEXTAREA)
              return (
                (d["class"] = this.css.field + " " + this.css.textArea),
                new M(d, c)
              );
            if (b.stringFieldOption === L.STRING_FIELD_OPTION_RICHTEXT)
              return (
                (d["class"] = this.css.field + " " + this.css.richText),
                (d.height = "100%"),
                (d.width = "100%"),
                (d.plugins = b.richTextPlugins || this._defaultRichTextPlugins),
                (c = new v(d, c)),
                c.startup(),
                c
              );
            var g = this;
            d.validator = function(c, d) {
              this._maskValidSubsetError = !1;
              this._hasBeenBlurred = !0;
              return g._isFieldNullable(a, b) || !("" === c || null === c);
            };
            return new O(d, c);
          },
          _createTimeField: function(a, b, c) {
            c = e.create("div", null, c);
            a = {
              class: this.css.field,
              trim: !0,
              required: this._isFieldRequired(a, b),
              constraints: { formatLength: "medium" }
            };
            this._datePackage && (a.datePackage = this._datePackage);
            return new Q(a, c);
          },
          _createDateField: function(a, b, c) {
            c = e.create("div", null, c);
            a = {
              class: this.css.field,
              trim: !0,
              required: this._isFieldRequired(a, b)
            };
            this._datePackage && (a.datePackage = this._datePackage);
            return new z(a, c);
          },
          _createIntField: function(a, b, c) {
            c = e.create("div", null, c);
            return new J(
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
            c = e.create("div", null, c);
            return new J(
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
            this._aiConnects.push(m.connect(a, b, c));
          },
          _getDatePackage: function(b) {
            return null === b.datePackage
              ? null
              : b.datePackage
              ? b.datePackage
              : "ar" === a.locale
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
                    var b = a.dijit;
                    if (b) {
                      b._onChangeHandle = null;
                      if (a.customField) return;
                      b instanceof Array
                        ? h.forEach(
                            b,
                            n.hitch(this, function(a) {
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
            h.forEach(this._toolTips, function(a) {
              a.destroy();
            });
            this._toolTips = [];
            this._attributes && e.destroy(this._attributes);
          }
        });
        n.mixin(L, {
          STRING_FIELD_OPTION_RICHTEXT: "richtext",
          STRING_FIELD_OPTION_TEXTAREA: "textarea",
          STRING_FIELD_OPTION_TEXTBOX: "textbox"
        });
        c("extend-esri") && n.setObject("dijit.AttributeInspector", L, d);
        return L;
      });
    },
    "esri/dijit/editing/AttachmentEditor": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/kernel dojo/has dojo/query dojo/io-query dojo/dom-attr dijit/_Widget dijit/_Templated dijit/ProgressBar ../../kernel ../../lang ../../domUtils dojo/text!./templates/AttachmentEditor.html dojo/i18n!../../nls/jsapi dojo/NodeList-dom".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g, p) {
        l = l([d, q], {
          declaredClass: "esri.dijit.editing.AttachmentEditor",
          widgetsInTemplate: !0,
          templateString: g,
          _listHtml:
            "\x3cspan id\x3d'node_${oid}_${attid}' style\x3d'display: flex;'\x3e\x3ca href\x3d'${href}' target\x3d'_blank'\x3e${name}\x3c/a\x3e",
          _deleteBtnHtml:
            "\x3cspan style\x3d'cursor:pointer;color:red;font-weight:bold;padding:0 2px;' class\x3d'deleteAttachment' id\x3d'${attid}');'\x3eX\x3c/span\x3e",
          _endHtml: "\x3cbr/\x3e\x3c/span\x3e",
          _aeConnects: [],
          _layerEditingCapChecked: {},
          _layerEditingCap: {},
          constructor: function(a, b) {
            n.mixin(this, p.widgets.attachmentEditor);
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
              n.hitch(this, function(a) {
                u.hide(this._attachmentError);
              })
            );
          },
          destroy: function() {
            m.forEach(this._aeConnects, h.disconnect);
            h.disconnect(this._uploadField_connect);
            h.disconnect(this._uploadFieldFocus_connect);
            this.inherited(arguments);
          },
          showAttachments: function(a, b) {
            this._attachmentList.innerHTML = this.NLS_none;
            this._uploadField.value = "";
            m.forEach(this.domNode.children, function(a, b) {
              u.show(a);
            });
            u.hide(this._attachmentError);
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
                  (u.hide(this._uploadForm),
                  m.forEach(this.domNode.children, function(a, b) {
                    u.hide(a);
                  })));
          },
          _getAttachments: function(a) {
            this._featureLayer &&
              this._featureLayer.queryAttachmentInfos &&
              this._featureLayer.queryAttachmentInfos(
                this._oid,
                n.hitch(this, "_onQueryAttachmentInfosComplete")
              );
          },
          _addAttachment: function() {
            u.hide(this._attachmentError);
            this._featureLayer && this._featureLayer.addAttachment
              ? (u.show(this._attachmentProgress),
                this._featureLayer.addAttachment(
                  this._oid,
                  this._uploadForm,
                  n.hitch(this, "_onAddAttachmentComplete"),
                  n.hitch(this, "_onAddAttachmentError")
                ))
              : (this._tempUpload = this._uploadForm);
          },
          _chainAttachment: function(a, b) {
            this._tempUpload &&
              (u.show(this._attachmentProgress),
              b.addAttachment(
                a,
                this._tempUpload,
                n.hitch(this, "_onAddAttachmentComplete"),
                n.hitch(this, "_onAddAttachmentError")
              ));
            this._tempUpload = null;
          },
          _deleteAttachment: function(a, b) {
            u.show(this._attachmentProgress);
            this._featureLayer.deleteAttachments(
              a,
              [b],
              n.hitch(this, "_onDeleteAttachmentComplete")
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
            a = m.map(
              a,
              n.hitch(this, function(a) {
                return t.substitute(
                  { href: a.url, name: a.name, oid: a.objectId, attid: a.id },
                  b
                );
              })
            );
            c.innerHTML = a.join("") || this.NLS_none;
            this._updateConnects();
          },
          _onAddAttachmentComplete: function(a) {
            u.hide(this._attachmentProgress.domNode);
            var c = this._attachmentList,
              d = this._uploadField,
              e = d.value,
              g = e.lastIndexOf("\\");
            -1 < g && (e = e.substring(g + 1, e.length));
            var e = e.replace(/\ /g, "_"),
              g = b.objectToQuery({
                gdbVersion: this._featureLayer.gdbVersion,
                token: this._featureLayer._getToken()
              }),
              f = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._layerEditingCap[this._currentLayerId].canCreate &&
              !this._layerEditingCap[this._currentLayerId].canUpdate &&
              (f = this._listHtml + this._endHtml);
            a = t.substitute(
              {
                href:
                  this._featureLayer._url.path +
                  "/" +
                  a.objectId +
                  "/attachments/" +
                  a.attachmentId +
                  (g ? "?" + g : ""),
                name: e,
                oid: a.objectId,
                attid: a.attachmentId
              },
              f
            );
            c.innerHTML = c.innerHTML == this.NLS_none ? a : c.innerHTML + a;
            this._updateConnects();
            d.value = "";
          },
          _onAddAttachmentError: function(a) {
            u.hide(this._attachmentProgress.domNode);
            if (a && t.isDefined(a.code)) {
              var b = this._attachmentError;
              e.set(
                b,
                "innerHTML",
                (400 === a.code
                  ? this.NLS_fileNotSupported
                  : a.message ||
                    (a.details && a.details.length && a.details[0])) ||
                  this.NLS_error
              );
              u.show(b);
            }
          },
          _onDeleteAttachmentComplete: function(a) {
            u.hide(this._attachmentProgress.domNode);
            var b = this._attachmentList;
            m.every(a, function(a) {
              return a.success;
            }) &&
              (f
                .query("#node_" + a[0].objectId + "_" + a[0].attachmentId)
                .orphan(),
              (b.children && b.children.length) ||
                (b.innerHTML = this.NLS_none));
          },
          _updateConnects: function() {
            m.forEach(this._aeConnects, h.disconnect);
            f.query(".deleteAttachment").forEach(function(a) {
              this._aeConnects.push(
                h.connect(
                  a,
                  "onclick",
                  n.hitch(this, "_deleteAttachment", this._oid, a.id)
                )
              );
            }, this);
          }
        });
        a("extend-esri") && n.setObject("dijit.editing.AttachmentEditor", l, r);
        return l;
      });
    },
    "dijit/ProgressBar": function() {
      define("require dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/number ./_Widget ./_TemplatedMixin dojo/text!./templates/ProgressBar.html".split(
        " "
      ), function(l, n, h, m, f, a, c, b) {
        return n("dijit.ProgressBar", [a, c], {
          progress: "0",
          value: "",
          maximum: 100,
          places: 0,
          indeterminate: !1,
          label: "",
          name: "",
          templateString: b,
          _indeterminateHighContrastImagePath: l.toUrl(
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
            m.mixin(this, a || {});
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
              : f.format(a, {
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
      ], function(l, n, h, m) {
        var f = {},
          f = {
            findFeatures: function(a, c, b) {
              var e = c.objectIdField;
              c = n.filter(c.graphics, function(b) {
                return n.some(a, function(a) {
                  return b.attributes[e] === a.objectId;
                });
              });
              if (b) b(c);
              else return c;
            },
            getSelection: function(a) {
              var c = [];
              n.forEach(a, function(a) {
                a = a.getSelectedFeatures();
                n.forEach(a, function(a) {
                  c.push(a);
                });
              });
              return c;
            },
            sortFeaturesById: function(a, c) {
              var b = n.map(a, function(a) {
                return a.featureLayer;
              });
              c.sort(function(a, c) {
                var d = a.getLayer(),
                  e = c.getLayer();
                if (!d) return -1;
                if (!e) return 1;
                var f = n.indexOf(b, d),
                  e = n.indexOf(b, e),
                  f = f - e;
                f ||
                  ((d = d.objectIdField),
                  (f = a.attributes[d] - c.attributes[d]));
                return f;
              });
              return c;
            }
          };
        h("extend-esri") && l.setObject("dijit.editing.Util.LayerHelper", f, m);
        return f;
      });
    },
    "dojox/date/islamic": function() {
      define([
        "dojox/main",
        "dojo/_base/lang",
        "dojo/date",
        "./islamic/Date"
      ], function(l, n, h, m) {
        var f = n.getObject("date.islamic", !0, l);
        f.getDaysInMonth = function(a) {
          return a.getDaysInIslamicMonth(a.getMonth(), a.getFullYear());
        };
        f.compare = function(a, c, b) {
          a instanceof m && (a = a.toGregorian());
          c instanceof m && (c = c.toGregorian());
          return h.compare.apply(null, arguments);
        };
        f.add = function(a, c, b) {
          var e = new m(a);
          switch (c) {
            case "day":
              e.setDate(a.getDate() + b);
              break;
            case "weekday":
              var d = a.getDay();
              if (5 > d + b && 0 < d + b) e.setDate(a.getDate() + b);
              else {
                var f = (c = 0);
                5 == d
                  ? ((d = 4), (f = 0 < b ? -1 : 1))
                  : 6 == d && ((d = 4), (f = 0 < b ? -2 : 2));
                var d = 0 < b ? 5 - d - 1 : -d,
                  k = b - d,
                  h = parseInt(k / 5);
                0 != k % 5 && (c = 0 < b ? 2 : -2);
                c = c + 7 * h + (k % 5) + d;
                e.setDate(a.getDate() + c + f);
              }
              break;
            case "year":
              e.setFullYear(a.getFullYear() + b);
              break;
            case "week":
              b *= 7;
              e.setDate(a.getDate() + b);
              break;
            case "month":
              a = a.getMonth();
              e.setMonth(a + b);
              break;
            case "hour":
              e.setHours(a.getHours() + b);
              break;
            case "minute":
              e._addMinutes(b);
              break;
            case "second":
              e._addSeconds(b);
              break;
            case "millisecond":
              e._addMilliseconds(b);
          }
          return e;
        };
        f.difference = function(a, c, b) {
          c = c || new m();
          b = b || "day";
          var e = c.getFullYear() - a.getFullYear(),
            d = 1;
          switch (b) {
            case "weekday":
              e = Math.round(f.difference(a, c, "day"));
              d = parseInt(f.difference(a, c, "week"));
              if (0 == e % 7) e = 5 * d;
              else {
                b = 0;
                var h = a.getDay(),
                  k = c.getDay(),
                  d = parseInt(e / 7);
                c = e % 7;
                a = new m(a);
                a.setDate(a.getDate() + 7 * d);
                a = a.getDay();
                if (0 < e)
                  switch (!0) {
                    case 5 == h:
                      b = -1;
                      break;
                    case 6 == h:
                      b = 0;
                      break;
                    case 5 == k:
                      b = -1;
                      break;
                    case 6 == k:
                      b = -2;
                      break;
                    case 5 < a + c:
                      b = -2;
                  }
                else if (0 > e)
                  switch (!0) {
                    case 5 == h:
                      b = 0;
                      break;
                    case 6 == h:
                      b = 1;
                      break;
                    case 5 == k:
                      b = 2;
                      break;
                    case 6 == k:
                      b = 1;
                      break;
                    case 0 > a + c:
                      b = 2;
                  }
                e = e + b - 2 * d;
              }
              d = e;
              break;
            case "year":
              d = e;
              break;
            case "month":
              b = c.toGregorian() > a.toGregorian() ? c : a;
              h = c.toGregorian() > a.toGregorian() ? a : c;
              d = b.getMonth();
              k = h.getMonth();
              if (0 == e) d = b.getMonth() - h.getMonth();
              else
                for (
                  d = 12 - k + d,
                    e = h.getFullYear() + 1,
                    b = b.getFullYear(),
                    e;
                  e < b;
                  e++
                )
                  d += 12;
              c.toGregorian() < a.toGregorian() && (d = -d);
              break;
            case "week":
              d = parseInt(f.difference(a, c, "day") / 7);
              break;
            case "day":
              d /= 24;
            case "hour":
              d /= 60;
            case "minute":
              d /= 60;
            case "second":
              d /= 1e3;
            case "millisecond":
              d *= c.toGregorian().getTime() - a.toGregorian().getTime();
          }
          return Math.round(d);
        };
        return f;
      });
    },
    "dojox/date/islamic/Date": function() {
      define(["dojo/_base/lang", "dojo/_base/declare", "dojo/date"], function(
        l,
        n,
        h
      ) {
        var m = n("dojox.date.islamic.Date", null, {
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
            var f = arguments.length;
            f
              ? 1 == f
                ? ((f = arguments[0]),
                  "number" == typeof f && (f = new Date(f)),
                  f instanceof Date
                    ? this.fromGregorian(f)
                    : "" == f
                    ? (this._date = new Date(""))
                    : ((this._year = f._year),
                      (this._month = f._month),
                      (this._date = f._date),
                      (this._hours = f._hours),
                      (this._minutes = f._minutes),
                      (this._seconds = f._seconds),
                      (this._milliseconds = f._milliseconds)))
                : 3 <= f &&
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
          setDate: function(f) {
            f = parseInt(f);
            if (
              !(
                0 < f &&
                f <= this.getDaysInIslamicMonth(this._month, this._year)
              )
            ) {
              var a;
              if (0 < f)
                for (
                  a = this.getDaysInIslamicMonth(this._month, this._year);
                  f > a;
                  f -= a,
                    a = this.getDaysInIslamicMonth(this._month, this._year)
                )
                  this._month++,
                    12 <= this._month && (this._year++, (this._month -= 12));
              else
                for (
                  a = this.getDaysInIslamicMonth(
                    0 <= this._month - 1 ? this._month - 1 : 11,
                    0 <= this._month - 1 ? this._year : this._year - 1
                  );
                  0 >= f;
                  a = this.getDaysInIslamicMonth(
                    0 <= this._month - 1 ? this._month - 1 : 11,
                    0 <= this._month - 1 ? this._year : this._year - 1
                  )
                )
                  this._month--,
                    0 > this._month && (this._year--, (this._month += 12)),
                    (f += a);
            }
            this._date = f;
            return this;
          },
          setFullYear: function(f) {
            this._year = +f;
          },
          setMonth: function(f) {
            this._year += Math.floor(f / 12);
            this._month =
              0 < f ? Math.floor(f % 12) : Math.floor(((f % 12) + 12) % 12);
          },
          setHours: function() {
            var f = arguments.length,
              a = 0;
            1 <= f && (a = parseInt(arguments[0]));
            2 <= f && (this._minutes = parseInt(arguments[1]));
            3 <= f && (this._seconds = parseInt(arguments[2]));
            4 == f && (this._milliseconds = parseInt(arguments[3]));
            for (; 24 <= a; )
              this._date++,
                (f = this.getDaysInIslamicMonth(this._month, this._year)),
                this._date > f &&
                  (this._month++,
                  12 <= this._month && (this._year++, (this._month -= 12)),
                  (this._date -= f)),
                (a -= 24);
            this._hours = a;
          },
          _addMinutes: function(f) {
            f += this._minutes;
            this.setMinutes(f);
            this.setHours(this._hours + parseInt(f / 60));
            return this;
          },
          _addSeconds: function(f) {
            f += this._seconds;
            this.setSeconds(f);
            this._addMinutes(parseInt(f / 60));
            return this;
          },
          _addMilliseconds: function(f) {
            f += this._milliseconds;
            this.setMilliseconds(f);
            this._addSeconds(parseInt(f / 1e3));
            return this;
          },
          setMinutes: function(f) {
            this._minutes = f % 60;
            return this;
          },
          setSeconds: function(f) {
            this._seconds = f % 60;
            return this;
          },
          setMilliseconds: function(f) {
            this._milliseconds = f % 1e3;
            return this;
          },
          toString: function() {
            if (isNaN(this._date)) return "Invalidate Date";
            var f = new Date();
            f.setHours(this._hours);
            f.setMinutes(this._minutes);
            f.setSeconds(this._seconds);
            f.setMilliseconds(this._milliseconds);
            return (
              this._month +
              " " +
              this._date +
              " " +
              this._year +
              " " +
              f.toTimeString()
            );
          },
          toGregorian: function() {
            var f = this._year,
              f =
                Math.floor(
                  this._date +
                    Math.ceil(29.5 * this._month) +
                    354 * (f - 1) +
                    Math.floor((3 + 11 * f) / 30) +
                    this._ISLAMIC_EPOCH -
                    1 -
                    0.5
                ) + 0.5,
              a = f - this._GREGORIAN_EPOCH,
              c = Math.floor(a / 146097),
              b = this._mod(a, 146097),
              a = Math.floor(b / 36524),
              e = this._mod(b, 36524),
              b = Math.floor(e / 1461),
              e = this._mod(e, 1461),
              e = Math.floor(e / 365),
              c = 400 * c + 100 * a + 4 * b + e;
            4 != a && 4 != e && c++;
            a =
              f -
              (this._GREGORIAN_EPOCH +
                365 * (c - 1) +
                Math.floor((c - 1) / 4) -
                Math.floor((c - 1) / 100) +
                Math.floor((c - 1) / 400));
            b =
              this._GREGORIAN_EPOCH -
              1 +
              365 * (c - 1) +
              Math.floor((c - 1) / 4) -
              Math.floor((c - 1) / 100) +
              Math.floor((c - 1) / 400) +
              Math.floor(
                739 / 12 + (h.isLeapYear(new Date(c, 3, 1)) ? -1 : -2) + 1
              );
            b = f < b ? 0 : h.isLeapYear(new Date(c, 3, 1)) ? 1 : 2;
            a = Math.floor((12 * (a + b) + 373) / 367);
            b =
              this._GREGORIAN_EPOCH -
              1 +
              365 * (c - 1) +
              Math.floor((c - 1) / 4) -
              Math.floor((c - 1) / 100) +
              Math.floor((c - 1) / 400) +
              Math.floor(
                (367 * a - 362) / 12 +
                  (2 >= a ? 0 : h.isLeapYear(new Date(c, a - 1, 1)) ? -1 : -2) +
                  1
              );
            return new Date(
              c,
              a - 1,
              f - b + 1,
              this._hours,
              this._minutes,
              this._seconds,
              this._milliseconds
            );
          },
          fromGregorian: function(f) {
            f = new Date(f);
            var a = f.getFullYear(),
              c = f.getMonth(),
              b = f.getDate(),
              a =
                this._GREGORIAN_EPOCH -
                1 +
                365 * (a - 1) +
                Math.floor((a - 1) / 4) +
                -Math.floor((a - 1) / 100) +
                Math.floor((a - 1) / 400) +
                Math.floor(
                  (367 * (c + 1) - 362) / 12 +
                    (2 >= c + 1 ? 0 : h.isLeapYear(f) ? -1 : -2) +
                    b
                ),
              a = Math.floor(a) + 0.5,
              a = a - this._ISLAMIC_EPOCH,
              c = Math.floor((30 * a + 10646) / 10631),
              b = Math.ceil((a - 29 - this._yearStart(c)) / 29.5),
              b = Math.min(b, 11);
            this._date = Math.ceil(a - this._monthStart(c, b)) + 1;
            this._month = b;
            this._year = c;
            this._hours = f.getHours();
            this._minutes = f.getMinutes();
            this._seconds = f.getSeconds();
            this._milliseconds = f.getMilliseconds();
            this._day = f.getDay();
            return this;
          },
          valueOf: function() {
            return this.toGregorian().valueOf();
          },
          _yearStart: function(f) {
            return 354 * (f - 1) + Math.floor((3 + 11 * f) / 30);
          },
          _monthStart: function(f, a) {
            return (
              Math.ceil(29.5 * a) +
              354 * (f - 1) +
              Math.floor((3 + 11 * f) / 30)
            );
          },
          _civilLeapYear: function(f) {
            return 11 > (14 + 11 * f) % 30;
          },
          getDaysInIslamicMonth: function(f, a) {
            var c = 0,
              c = 29 + ((f + 1) % 2);
            11 == f && this._civilLeapYear(a) && c++;
            return c;
          },
          _mod: function(f, a) {
            return f - a * Math.floor(f / a);
          }
        });
        m.getDaysInIslamicMonth = function(f) {
          return new m().getDaysInIslamicMonth(f.getMonth(), f.getFullYear());
        };
        return m;
      });
    },
    "dojox/date/islamic/locale": function() {
      define("dojox/main dojo/_base/lang dojo/_base/array dojo/date dojo/i18n dojo/regexp dojo/string ./Date dojo/i18n!dojo/cldr/nls/islamic".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e) {
        function d(a, b, d, e, f) {
          return f.replace(/([a-z])\1*/gi, function(d) {
            var e,
              g,
              h = d.charAt(0);
            d = d.length;
            var k = ["abbr", "wide", "narrow"];
            switch (h) {
              case "G":
                e = b.eraAbbr[0];
                break;
              case "y":
                e = String(a.getFullYear());
                break;
              case "M":
                e = a.getMonth();
                3 > d
                  ? ((e += 1), (g = !0))
                  : ((h = ["months-format", k[d - 3]].join("-")),
                    (e = b[h][e]));
                break;
              case "d":
                e = a.getDate(!0);
                g = !0;
                break;
              case "E":
                e = a.getDay();
                3 > d
                  ? ((e += 1), (g = !0))
                  : ((h = ["days-format", k[d - 3]].join("-")), (e = b[h][e]));
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
                switch (h) {
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
                e = Math.round(a.getMilliseconds() * Math.pow(10, d - 3));
                g = !0;
                break;
              case "z":
                if ((e = m.getTimezoneName(a.toGregorian()))) break;
                d = 4;
              case "Z":
                e = a.toGregorian().getTimezoneOffset();
                e = [
                  0 >= e ? "+" : "-",
                  c.pad(Math.floor(Math.abs(e) / 60), 2),
                  c.pad(Math.abs(e) % 60, 2)
                ];
                4 == d && (e.splice(0, 0, "GMT"), e.splice(3, 0, ":"));
                e = e.join("");
                break;
              default:
                throw Error(
                  "dojox.date.islamic.locale.formatPattern: invalid pattern char: " +
                    f
                );
            }
            g && (e = c.pad(e, d));
            return e;
          });
        }
        function q(a, b, c, d) {
          var e = function(a) {
            return a;
          };
          b = b || e;
          c = c || e;
          d = d || e;
          var g = a.match(/(''|[^'])+/g),
            f = "'" == a.charAt(0);
          h.forEach(g, function(a, d) {
            a ? ((g[d] = (f ? c : b)(a)), (f = !f)) : (g[d] = "");
          });
          return d(g.join(""));
        }
        function k(b, c, d, e) {
          e = a.escapeString(e);
          f.normalizeLocale(d.locale);
          return e
            .replace(/([a-z])\1*/gi, function(a) {
              var e;
              e = a.charAt(0);
              var g = a.length,
                f = "";
              d.strict ? 1 < g && (f = "0{" + (g - 1) + "}") : (f = "0?");
              switch (e) {
                case "y":
                  e = "\\d+";
                  break;
                case "M":
                  e = 2 < g ? "\\S+ ?\\S+" : f + "[1-9]|1[0-2]";
                  break;
                case "d":
                  e = "[12]\\d|" + f + "[1-9]|3[01]";
                  break;
                case "E":
                  e = "\\S+";
                  break;
                case "h":
                  e = f + "[1-9]|1[0-2]";
                  break;
                case "k":
                  e = f + "\\d|1[01]";
                  break;
                case "H":
                  e = f + "\\d|1\\d|2[0-3]";
                  break;
                case "K":
                  e = f + "[1-9]|1\\d|2[0-4]";
                  break;
                case "m":
                case "s":
                  e = f + "\\d|[0-5]\\d";
                  break;
                case "S":
                  e = "\\d{" + g + "}";
                  break;
                case "a":
                  g = d.am || c["dayPeriods-format-wide-am"];
                  f = d.pm || c["dayPeriods-format-wide-pm"];
                  d.strict
                    ? (e = g + "|" + f)
                    : ((e = g + "|" + f),
                      g != g.toLowerCase() && (e += "|" + g.toLowerCase()),
                      f != f.toLowerCase() && (e += "|" + f.toLowerCase()));
                  break;
                default:
                  e = ".*";
              }
              b && b.push(a);
              return "(" + e + ")";
            })
            .replace(/[\xa0 ]/g, "[\\s\\xa0]");
        }
        var r = n.getObject("date.islamic.locale", !0, l);
        r.format = function(a, b) {
          b = b || {};
          var c = f.normalizeLocale(b.locale),
            e = b.formatLength || "short",
            g = r._getIslamicBundle(c),
            h = [],
            c = n.hitch(this, d, a, g, c, b.fullYear);
          if ("year" == b.selector) return a.getFullYear();
          "time" != b.selector &&
            (a = b.datePattern || g["dateFormat-" + e]) &&
            h.push(q(a, c));
          "date" != b.selector &&
            (b = b.timePattern || g["timeFormat-" + e]) &&
            h.push(q(b, c));
          return h.join(" ");
        };
        r.regexp = function(a) {
          return r._parseInfo(a).regexp;
        };
        r._parseInfo = function(a) {
          a = a || {};
          var b = f.normalizeLocale(a.locale),
            b = r._getIslamicBundle(b),
            c = a.formatLength || "short",
            d = a.datePattern || b["dateFormat-" + c],
            c = a.timePattern || b["timeFormat-" + c],
            e = [];
          return {
            regexp: q(
              "date" == a.selector
                ? d
                : "time" == a.selector
                ? c
                : "undefined" == typeof c
                ? d
                : d + " " + c,
              n.hitch(this, k, e, b, a)
            ),
            tokens: e,
            bundle: b
          };
        };
        r.parse = function(a, c) {
          a = a.replace(/[\u200E\u200F\u202A\u202E]/g, "");
          c || (c = {});
          var d = r._parseInfo(c),
            e = d.tokens,
            g = d.bundle,
            d = d.regexp.replace(/[\u200E\u200F\u202A\u202E]/g, "");
          a = new RegExp("^" + d + "$").exec(a);
          f.normalizeLocale(c.locale);
          if (!a) return null;
          var k = [1389, 0, 1, 0, 0, 0, 0],
            l = "",
            m = ["abbr", "wide", "narrow"];
          h.every(a, function(a, b) {
            if (!b) return !0;
            b = e[b - 1];
            var d = b.length;
            switch (b.charAt(0)) {
              case "y":
                k[0] = Number(a);
                break;
              case "M":
                if (2 < d) {
                  if (
                    ((b = g["months-format-" + m[d - 3]].concat()),
                    c.strict ||
                      ((a = a.replace(".", "").toLowerCase()),
                      (b = h.map(b, function(a) {
                        return a ? a.replace(".", "").toLowerCase() : a;
                      }))),
                    (a = h.indexOf(b, a)),
                    -1 == a)
                  )
                    return !1;
                } else a--;
                k[1] = Number(a);
                break;
              case "D":
                k[1] = 0;
              case "d":
                k[2] = Number(a);
                break;
              case "a":
                b = c.am || g["dayPeriods-format-wide-am"];
                d = c.pm || g["dayPeriods-format-wide-pm"];
                if (!c.strict) {
                  var f = /\./g;
                  a = a.replace(f, "").toLowerCase();
                  b = b.replace(f, "").toLowerCase();
                  d = d.replace(f, "").toLowerCase();
                }
                if (c.strict && a != b && a != d) return !1;
                l = a == d ? "p" : a == b ? "a" : "";
                break;
              case "K":
                24 == a && (a = 0);
              case "h":
              case "H":
              case "k":
                k[3] = Number(a);
                break;
              case "m":
                k[4] = Number(a);
                break;
              case "s":
                k[5] = Number(a);
                break;
              case "S":
                k[6] = Number(a);
            }
            return !0;
          });
          a = +k[3];
          "p" === l && 12 > a
            ? (k[3] = a + 12)
            : "a" === l && 12 == a && (k[3] = 0);
          return new b(k[0], k[1], k[2], k[3], k[4], k[5], k[6]);
        };
        var t = [];
        r.addCustomFormats = function(a, b) {
          t.push({ pkg: a, name: b });
        };
        r._getIslamicBundle = function(a) {
          var b = {};
          h.forEach(
            t,
            function(c) {
              c = f.getLocalization(c.pkg, c.name, a);
              b = n.mixin(b, c);
            },
            this
          );
          return b;
        };
        r.addCustomFormats("dojo.cldr", "islamic");
        r.getNames = function(a, b, c, d, e) {
          var g;
          d = r._getIslamicBundle(d);
          a = [a, c, b];
          "standAlone" == c &&
            ((c = a.join("-")), (g = d[c]), 1 == g[0] && (g = void 0));
          a[1] = "format";
          return (g || d[a.join("-")]).concat();
        };
        r.weekDays = r.getNames("days", "wide", "format");
        r.months = r.getNames("months", "wide", "format");
        return r;
      });
    },
    "jimu/dijit/_GeocodeServiceChooserContent": function() {
      define([
        "dojo/_base/declare",
        "./_BasicServiceChooserContent",
        "./GeocodeServiceBrowser"
      ], function(l, n, h) {
        return l([n], {
          baseClass: "jimu-geocode-service-chooser-content",
          _examples: [
            "http://myserver/arcgis/rest/services",
            "http://myserver/arcgis/rest/services/folder",
            "http://myserver/arcgis/rest/services/myservice/GeocodeServer"
          ],
          _createServiceBrowser: function(l) {
            return new h(l);
          }
        });
      });
    },
    "jimu/dijit/_BasicServiceChooserContent": function() {
      define("dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/_BasicServiceChooserContent.html dojo/Evented dojo/Deferred dojo/_base/html dojo/_base/array dojo/_base/lang dojo/on dojo/aspect dojo/promise/all jimu/dijit/URLInput jimu/dijit/LoadingIndicator".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u) {
        return l([n, h, m, a], {
          templateString: f,
          _examples: [
            "http://myserver/arcgis/rest/services",
            "http://myserver/arcgis/rest/services/folder",
            "http://myserver/arcgis/rest/services/myservice/servicetype"
          ],
          multiple: !1,
          url: "",
          getSelectedItems: function() {
            return this.serviceBrowser.getSelectedItems();
          },
          postMixInProperties: function() {
            this.nls = d.mixin({}, window.jimuNls.common);
            this.nls = d.mixin(this.nls, window.jimuNls.basicServiceChooser);
          },
          postCreate: function() {
            this.inherited(arguments);
            b.addClass(this.domNode, "jimu-basic-service-chooser-content");
            this.multiple = !!this.multiple;
            this._initSelf();
            this.exampleTd.innerHTML = this.exampleTd.innerHTML;
          },
          setUrl: function(a) {
            var b = new c();
            (this.url = a) && "string" === typeof this.url
              ? (this.urlInput.set("value", this.url),
                (b = this._onBtnValidateClick()))
              : b.reject();
            return b;
          },
          focusInput: function() {
            this.urlInput.focus();
          },
          _initSelf: function() {
            this._examples && 0 < this._examples.length
              ? e.forEach(
                  this._examples,
                  d.hitch(this, function(a) {
                    b.create(
                      "div",
                      { innerHTML: a, class: "example-url" },
                      this.exampleTd
                    );
                  })
                )
              : b.setStyle(this.exampleTr, "display", "none");
            var a = {
              multiple: this.multiple,
              _onTreeClick: d.hitch(this, this._onTreeClick)
            };
            this.serviceBrowser = this._createServiceBrowser(a);
            this.serviceBrowser.placeAt(this.serviceBrowserContainer);
            this.serviceBrowser.startup();
            this.own(
              k.after(
                this.urlInput,
                "validator",
                d.hitch(this, this._afterUrlValidate)
              )
            );
            this.url &&
              "string" === typeof this.url &&
              this.urlInput.set("value", this.url);
            this.own(
              q(
                this.serviceBrowser,
                "error",
                d.hitch(this, this._onServiceBrowserError)
              )
            );
          },
          _createServiceBrowser: function(a) {},
          _validateUrl: function(a) {
            a = a.replace(/\/*$/g, "");
            if ((a = a.match(/\/rest\/services\/*(.*)/gi)) && 0 < a.length)
              if ((a = a[0].replace(/\/rest\/services\/*/, ""))) {
                var b = a.split("/");
                if (1 === b.length) return !0;
                if (2 === b.length)
                  return this.serviceBrowser.isServiceTypeSupported(b[1]);
                if (3 <= b.length)
                  return (
                    (a = this.serviceBrowser.isServiceTypeSupported(b[1])),
                    (b = this.serviceBrowser.isServiceTypeSupported(b[2])),
                    a || b
                  );
              } else return !0;
            else return !1;
          },
          _afterUrlValidate: function(a) {
            a && ((a = this.urlInput.get("value")), (a = this._validateUrl(a)));
            a
              ? b.removeClass(this.btnValidate, "jimu-state-disabled")
              : b.addClass(this.btnValidate, "jimu-state-disabled");
            return a;
          },
          _onServiceBrowserError: function(a) {
            this._showErrorMessage(a);
          },
          _showErrorMessage: function(a) {
            a && "string" === typeof a
              ? ((this.errorNode.innerHTML = a),
                b.addClass(this.errorSection, "visible"))
              : b.removeClass(this.errorSection, "visible");
          },
          _clearErrorMessage: function() {
            this.errorNode.innerHTML = "";
            b.removeClass(this.errorSection, "visible");
          },
          _onBtnValidateClick: function() {
            this._clearErrorMessage();
            var a = new c();
            if (this.urlInput.validate()) {
              var b = this.urlInput.get("value");
              this.serviceBrowser.setUrl(b).then(
                d.hitch(this, function() {
                  this.domNode && this._checkSelectedItemsNumber();
                  a.resolve();
                }),
                d.hitch(this, function() {
                  this.domNode && this._checkSelectedItemsNumber();
                  a.reject();
                })
              );
              this.emit("validate-click");
            } else a.reject();
            return a;
          },
          _checkSelectedItemsNumber: function() {
            0 < this.getSelectedItems().length
              ? b.removeClass(this.btnOk, "jimu-state-disabled")
              : b.addClass(this.btnOk, "jimu-state-disabled");
          },
          _onTreeClick: function() {
            this._checkSelectedItemsNumber();
          },
          _onBtnOkClick: function() {
            var a = this.getSelectedItems();
            0 < a.length && this.emit("ok", a);
          },
          _onBtnCancelClick: function() {
            this.emit("cancel");
          }
        });
      });
    },
    "jimu/dijit/GeocodeServiceBrowser": function() {
      define([
        "dojo/_base/declare",
        "./_BasicServiceBrowser",
        "dojo/_base/lang",
        "dojo/_base/array",
        "jimu/serviceBrowserRuleUtils"
      ], function(l, n, h, m, f) {
        return l([n], {
          baseClass: "jimu-geocode-service-browser",
          declaredClass: "jimu.dijit.GeocodeServiceBrowser",
          url: "",
          multiple: !1,
          postMixInProperties: function() {
            this.inherited(arguments);
            this.rule = f.getGeocodeServiceBrowserRule();
          },
          getSelectedItems: function() {
            var a = this.inherited(arguments);
            return (a = m.map(
              a,
              h.hitch(this, function(a) {
                return { name: a.name, url: a.url };
              })
            ));
          }
        });
      });
    },
    "jimu/dijit/_BasicServiceBrowser": function() {
      define("dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/Evented dojo/_base/lang dojo/_base/html dojo/_base/array dojo/Deferred dojo/promise/all dojo/store/Memory dojo/store/Observable dijit/tree/ObjectStoreModel jimu/utils jimu/dijit/_Tree jimu/dijit/LoadingIndicator".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u) {
        return l([n, h, m, f], {
          templateString:
            '\x3cdiv style\x3d"width:100%;"\x3e\x3cdiv data-dojo-attach-point\x3d"shelter"  data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d"hidden:true"\x3e\x3c/div\x3e\x3c/div\x3e',
          _store: null,
          _id: 0,
          _currentUrl: "",
          _treeClass: "service-browser-tree",
          _def: null,
          url: "",
          multiple: !1,
          rule: null,
          postMixInProperties: function() {
            this.nls = window.jimuNls.basicServiceBrowser;
          },
          postCreate: function() {
            this.inherited(arguments);
            c.addClass(this.domNode, "jimu-basic-service-browser");
            this.multiple = !!this.multiple;
            this._createTree();
            this.url && "string" === typeof this.url && this.setUrl(this.url);
          },
          reset: function() {
            this.url = "";
            this._clear();
          },
          getSelectedItems: function() {
            return this.tree.getSelectedItems();
          },
          setUrl: function(b) {
            this._def &&
              (this._def.isFulfilled() || this._def.cancel(),
              (this._def = null));
            this._def = new e();
            (b && "string" === typeof b && b.replace(/\/*$/g, "")) ||
              this._def.reject();
            b = b.replace(/\/*$/g, "");
            b = a.trim(b);
            var c = b.match(/^http(s?):\/\//gi);
            (c && 0 < c.length) || (b = "http://" + b);
            if (
              !(0 >= b.search(/\/rest\/services/i)) &&
              (this._clear(), (this._currentUrl = b))
            )
              return (
                (b = this._getRootItem()),
                (b = t.isStringEndWith(this._currentUrl, "rest/services")
                  ? this._searchBaseServiceUrl(this._currentUrl, b)
                  : this._isUrlContainsServiceType(this._currentUrl)
                  ? this._searchServiceUrl(this._currentUrl, b)
                  : this._searchFolderServiceUrl(this._currentUrl, b)),
                this.shelter.show(),
                b.then(
                  a.hitch(this, function(a) {
                    this.domNode && this.shelter.hide();
                    var b = this.tree.getAllLeafTreeNodeWidgets();
                    1 === b.length && b[0].select();
                    this._def.resolve(a);
                  }),
                  a.hitch(this, function(a) {
                    this.domNode && this.shelter.hide();
                    this._showRequestError();
                    this._def.reject(a);
                  })
                ),
                this._def
              );
            this._def.reject();
          },
          _getItem: function(a) {
            return this.rule.getItem(a);
          },
          _getSubItemUrls: function(a) {
            return this.rule.getSubItemUrls(a);
          },
          _getSubItems: function(c) {
            var f = new e();
            this._getSubItemUrls(c).then(
              a.hitch(this, function(c) {
                c = b.map(
                  c,
                  a.hitch(this, function(a) {
                    return this._getItem(a);
                  })
                );
                d(c).then(
                  a.hitch(this, function(c) {
                    c = b.filter(
                      c,
                      a.hitch(this, function(a) {
                        return a && "object" === typeof a;
                      })
                    );
                    f.resolve(c);
                  }),
                  a.hitch(this, function(a) {
                    f.reject(a);
                  })
                );
              }),
              a.hitch(this, function(a) {
                f.reject(a);
              })
            );
            return f;
          },
          _selectFirstLeafTreeNodeWidget: function() {
            var a = this.tree.getAllLeafTreeNodeWidgets();
            1 === a.length && a[0].select();
          },
          isLeafItem: function(a) {
            return 0 <= this.rule.leafTypes.indexOf(a.type);
          },
          isServiceTypeSupported: function(a) {
            return this.rule.isServiceTypeSupported(a);
          },
          _getStringEndWith: function(a, b) {
            var c = "",
              d = a.indexOf(b);
            0 <= d && (c = a.slice(0, d + b.length));
            return c;
          },
          _isUrlContainsServiceType: function(a) {
            return this.rule.isUrlContainsServiceType(a);
          },
          _getBaseServiceUrl: function() {
            return this._getStringEndWith(this._currentUrl, "rest/services");
          },
          _getServiceName: function(a) {
            var b = "";
            a = a.split("/");
            return (b = a[a.length - 1]);
          },
          _searchBaseServiceUrl: function(c, f) {
            var g = new e();
            this._getRestInfo(c).then(
              a.hitch(this, function(k) {
                if (this.domNode) {
                  var h = [];
                  b.map(
                    k.folders,
                    a.hitch(this, function(d) {
                      var g = {
                        name: d,
                        type: "folder",
                        url: c + "/" + d,
                        parent: f.id
                      };
                      this._addItem(g);
                      var k = new e();
                      this._doSearchFolderServiceUrl(g.url, g.id).then(
                        a.hitch(this, function(c) {
                          0 < c.length
                            ? b.forEach(
                                c,
                                a.hitch(this, function(a) {
                                  a.parent = g.id;
                                  this._addItem(a);
                                })
                              )
                            : this._removeItem(g.id);
                          k.resolve();
                        }),
                        a.hitch(this, function(a) {
                          k.reject(a);
                        })
                      );
                      h.push(k);
                      return k;
                    })
                  );
                  b.forEach(
                    k.services,
                    a.hitch(this, function(b) {
                      if (this.isServiceTypeSupported(b.type)) {
                        b = c + "/" + b.name + "/" + b.type;
                        var d = new e();
                        this.rule.getItem(b).then(
                          a.hitch(this, function(a) {
                            a && ((a.parent = f.id), this._addItem(a));
                            d.resolve();
                          }),
                          a.hitch(this, function(a) {
                            console.error(a);
                            d.reject(a);
                          })
                        );
                        h.push(d);
                      }
                    })
                  );
                  d(h).then(
                    a.hitch(this, function() {
                      this.domNode && g.resolve();
                    }),
                    a.hitch(this, function(a) {
                      console.error(a);
                      this.domNode && g.reject(a);
                    })
                  );
                }
              }),
              a.hitch(this, function(a) {
                console.error(a);
                this.domNode &&
                  g.reject({ errorCode: "NETWORK_ERROR", error: a });
              })
            );
            return g;
          },
          _searchFolderServiceUrl: function(c, d) {
            var f = new e();
            this._doSearchFolderServiceUrl(c, d).then(
              a.hitch(this, function(c) {
                this.domNode &&
                  (b.forEach(
                    c,
                    a.hitch(this, function(a) {
                      a.parent = d.id;
                      this._addItem(a);
                    })
                  ),
                  f.resolve());
              }),
              a.hitch(this, function(a) {
                console.error(a);
                this.domNode &&
                  f.reject({ errorCode: "NETWORK_ERROR", error: a });
              })
            );
            return f;
          },
          _doSearchFolderServiceUrl: function(c) {
            var f = new e(),
              g = this._getBaseServiceUrl();
            this._getRestInfo(c).then(
              a.hitch(this, function(c) {
                c = c.services;
                var e = [];
                c &&
                  0 < c.length &&
                  b.forEach(
                    c,
                    a.hitch(this, function(a) {
                      this.isServiceTypeSupported(a.type) &&
                        ((a = this.rule.getItem(
                          g + "/" + a.name + "/" + a.type
                        )),
                        e.push(a));
                    })
                  );
                d(e).then(
                  a.hitch(this, function(c) {
                    c = b.filter(
                      c,
                      a.hitch(this, function(a) {
                        return a;
                      })
                    );
                    f.resolve(c);
                  }),
                  a.hitch(this, function(a) {
                    console.error(a);
                    f.reject(a);
                  })
                );
              }),
              a.hitch(this, function(a) {
                console.error(a);
                f.reject(a);
              })
            );
            return f;
          },
          _searchServiceUrl: function(c, d) {
            var f = new e();
            this._getSubItems(c).then(
              a.hitch(this, function(e) {
                e && 0 < e.length
                  ? (b.forEach(
                      e,
                      a.hitch(this, function(a) {
                        a.parent = d.id;
                        this._addItem(a);
                      })
                    ),
                    f.resolve())
                  : this._getItem(c).then(
                      a.hitch(this, function(a) {
                        a && ((a.parent = d.id), this._addItem(a));
                        f.resolve();
                      }),
                      a.hitch(this, function(a) {
                        f.reject(a);
                      })
                    );
              }),
              a.hitch(this, function(a) {
                f.reject(a);
              })
            );
            return f;
          },
          _getRestInfo: function(b) {
            var c = new e();
            this.rule.getRestInfo(b).then(
              a.hitch(this, function(a) {
                this.domNode && c.resolve(a);
              }),
              a.hitch(this, function(a) {
                this.domNode && c.reject(a);
              })
            );
            return c;
          },
          _clear: function() {
            var c = this._store.query({ parent: "root" });
            b.forEach(
              c,
              a.hitch(this, function(a) {
                a && "root" !== a.id && this._store.remove(a.id);
              })
            );
          },
          _showRequestError: function() {
            this.emit("error", this.nls.invalidUrlTip);
          },
          _addItem: function(a) {
            this._id++;
            a.id = this._id.toString();
            this._store.add(a);
            return a;
          },
          _removeItem: function(a) {
            this._store.remove(a);
          },
          _getRootItem: function() {
            return { id: "root", name: "Services Root", type: "root" };
          },
          _createTree: function() {
            var b = this._getRootItem(),
              b = new q({
                data: [b],
                getChildren: function(a) {
                  return this.query({ parent: a.id });
                }
              });
            this._store = new k(b);
            b = new r({
              store: this._store,
              query: { id: "root" },
              mayHaveChildren: a.hitch(this, this._mayHaveChildren)
            });
            this.tree = new u({
              multiple: this.multiple,
              model: b,
              showRoot: !1,
              style: { width: "100%" },
              isLeafItem: a.hitch(this, this.isLeafItem),
              onOpen: a.hitch(this, function(a, b) {
                this._onTreeOpen(a, b);
                this.emit("tree-open", a, b);
              }),
              onClick: a.hitch(this, function(a, b, c) {
                this._onTreeClick(a, b, c);
                this.emit("tree-click", a, b, c);
              }),
              getIconStyle: a.hitch(this, function(a, b) {
                var c = null;
                if (!a) return null;
                var d = {
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
                    require.toUrl("jimu"),
                  f = this._getIconImageName(a, b);
                f ||
                  ("folder" === a.type
                    ? (f = b
                        ? "folder_open_default.png"
                        : "folder_close_default.png")
                    : this.isServiceTypeSupported(a.type) &&
                      (f = b
                        ? "folder_open_default.png"
                        : "folder_close_default.png"));
                f &&
                  ((d.backgroundImage = "url(" + e + "/css/images/" + f + ")"),
                  (c = d));
                return c;
              })
            });
            c.addClass(this.tree.domNode, this._treeClass);
            this.tree.placeAt(this.domNode);
          },
          _getIconImageName: function(a, b) {
            var c = "";
            "function" === typeof this.rule.getIconImageName &&
              (c = this.rule.getIconImageName(a, b));
            return c;
          },
          _mayHaveChildren: function(a) {
            return "root" === a.type ? !0 : !this.isLeafItem(a);
          },
          _onTreeOpen: function(c, d) {
            "root" === c.id ||
              0 < this._store.query({ parent: c.id }).length ||
              c.checking ||
              c.checked ||
              ((c.checking = !0),
              this._getSubItems(c.url).then(
                a.hitch(this, function(d) {
                  b.forEach(
                    d,
                    a.hitch(this, function(a) {
                      a.parent = c.id;
                      this._addItem(a);
                    })
                  );
                  c.checking = !1;
                  c.checked = !0;
                }),
                a.hitch(this, function(a) {
                  console.error(a);
                  c.checking = !1;
                  c.checked = !0;
                })
              ));
          },
          _onTreeClick: function(a, b, c) {},
          destroy: function() {
            this.shelter && (this.shelter.destroy(), (this.shelter = null));
            this.inherited(arguments);
          }
        });
      });
    },
    "jimu/serviceBrowserRuleUtils": function() {
      define([
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/Deferred",
        "jimu/utils",
        "jimu/ServiceBrowserRule"
      ], function(l, n, h, m, f) {
        var a = {
          combineRules: function(a) {
            var b = new f();
            n.forEach(a, function(a) {
              n.forEach(a.leafTypes, function(a) {
                0 > b.leafTypes.indexOf(a) && b.leafTypes.push(a);
              });
              n.forEach(a.serviceTypes, function(a) {
                0 > b.serviceTypes.indexOf(a) && b.serviceTypes.push(a);
              });
            });
            b.getMatchedRule = function(b) {
              var c = null;
              n.some(a, function(a) {
                return a.isUrlContainsServiceType(b) ? ((c = a), !0) : !1;
              });
              return c;
            };
            b.getItem = function(a) {
              var c = null;
              return (c = (c = b.getMatchedRule(a))
                ? c.getItem(a)
                : b.defaultGetItem(a));
            };
            b.getSubItemUrls = function(a) {
              var c = null;
              return (c = (c = b.getMatchedRule(a))
                ? c.getSubItemUrls(a)
                : b.defaultGetSubItemUrls(a));
            };
            b.getIconImageName = function(a, c) {
              var d = "";
              if (a.url) {
                var e = b.getMatchedRule(a.url);
                e &&
                  "function" === typeof e.getIconImageName &&
                  (d = e.getIconImageName(a, c));
              }
              return d;
            };
            return b;
          },
          getFeaturelayerServiceBrowserRule: function(c, b, e) {
            c = l.clone(c);
            var d = ["point", "polyline", "polygon"];
            l.isArrayLike(c) && 0 < c.length
              ? ((c = n.filter(c, function(a) {
                  return 0 <= d.indexOf(a);
                })),
                0 === c.length && (c = d))
              : (c = d);
            return a._getFeaturelayerServiceBrowserRule(c, b, e);
          },
          _getFeaturelayerServiceBrowserRule: function(a, b, e) {
            return new f({
              types: a,
              leafTypes: ["Feature Layer", "Table"],
              serviceTypes: ["MapServer", "FeatureServer"],
              _groupLayerType: "Group Layer",
              _featureLayerType: "Feature Layer",
              _tableType: "Table",
              getItem: function(a) {
                var b = new h();
                this.isUrlEndWithServiceType(a, this.serviceTypes)
                  ? (b = this.defaultGetItem(a))
                  : this.getRestInfo(a).then(
                      l.hitch(this, function(c) {
                        c = this._getItemByLayerDefinition(a, c);
                        b.resolve(c);
                      }),
                      l.hitch(this, function(a) {
                        b.reject(a);
                      })
                    );
                return b;
              },
              getSubItemUrls: function(a) {
                var b = new h();
                return (b = this.isUrlEndWithServiceType(a)
                  ? this._getSubUrlsByServiceUrl(a)
                  : this._getSubUrlsByGroupUrl(a));
              },
              getIconImageName: function(a, b) {
                var c = "";
                "MapServer" === a.type || "FeatureServer" === a.type
                  ? (c = b ? "mapserver_open.png" : "mapserver_close.png")
                  : a.type === this._groupLayerType
                  ? (c = b ? "group_layer2.png" : "group_layer1.png")
                  : a.type === this._featureLayerType
                  ? ((a = m.getTypeByGeometryType(
                      a.definition && a.definition.geometryType
                    )),
                    "point" === a
                      ? (c = "point_layer1.png")
                      : "polyline" === a
                      ? (c = "line_layer1.png")
                      : "polygon" === a && (c = "polygon_layer1.png"))
                  : a.type === this._tableType
                  ? (c = "table.png")
                  : "root" === a.type &&
                    this._currentUrl &&
                    n.some(
                      this.serviceTypes,
                      l.hitch(this, function(a) {
                        return m.isStringEndWith(this._currentUrl, "/" + a);
                      })
                    ) &&
                    (c = b ? "mapserver_open.png" : "mapserver_close.png");
                return c;
              },
              _getSubUrlsByServiceUrl: function(a) {
                var b = new h();
                this.getRestInfo(a).then(
                  l.hitch(this, function(c) {
                    var d = [];
                    n.forEach(
                      c.layers,
                      l.hitch(this, function(b) {
                        0 <= b.parentLayerId || d.push(a + "/" + b.id);
                      })
                    );
                    e &&
                      n.forEach(
                        c.tables,
                        l.hitch(this, function(b) {
                          0 <= b.parentLayerId || d.push(a + "/" + b.id);
                        })
                      );
                    b.resolve(d);
                  }),
                  l.hitch(this, function(a) {
                    b.reject(a);
                  })
                );
                return b;
              },
              _getSubUrlsByGroupUrl: function(a) {
                var b = new h();
                this.getRestInfo(a).then(
                  l.hitch(this, function(c) {
                    var d = [];
                    if (c.type === this._groupLayerType)
                      var e = this._getServiceUrlByLayerUrl(a),
                        d = n.map(
                          c.subLayers || [],
                          l.hitch(this, function(a) {
                            return e + "/" + a.id;
                          })
                        );
                    b.resolve(d);
                  }),
                  l.hitch(this, function(a) {
                    b.reject(a);
                  })
                );
                return b;
              },
              _getItemByLayerDefinition: function(a, c) {
                var d = null,
                  e = c.type;
                if (e === this._groupLayerType)
                  d = { name: c.name, type: e, url: a, definition: c };
                else if (
                  e === this._featureLayerType ||
                  e === this._tableType
                ) {
                  var f = !1;
                  e === this._featureLayerType
                    ? (f = this._validateEsriGeometryType(c.geometryType))
                    : e === this._tableType && (f = !0);
                  f &&
                    ((f = !1),
                    (f = b
                      ? m.isFeaturelayerUrlSupportQuery(a, c.capabilities)
                      : !0) &&
                      (d = { name: c.name, type: e, url: a, definition: c }));
                }
                return d;
              },
              _validateEsriGeometryType: function(a) {
                a = m.getTypeByGeometryType(a);
                return 0 <= this.types.indexOf(a);
              },
              _getServiceUrlByLayerUrl: function(a) {
                for (var b = "", c = 0; c < this.serviceTypes.length; c++) {
                  var d = this.serviceTypes[c].toLowerCase(),
                    e = a.toLowerCase().lastIndexOf("/" + d + "/");
                  if (0 <= e) {
                    b = a.slice(0, e + d.length + 1);
                    break;
                  }
                }
                return b;
              }
            });
          },
          getGeocodeServiceBrowserRule: function() {
            return new f({
              leafTypes: ["GeocodeServer"],
              serviceTypes: ["GeocodeServer"]
            });
          },
          getGpServiceBrowserRule: function() {
            return new f({
              leafTypes: ["GPTask"],
              serviceTypes: ["GPServer"],
              getItem: function(a) {
                var b = new h();
                this.isUrlEndWithServiceType(a)
                  ? (b = this.defaultGetItem(a))
                  : this.getRestInfo(a).then(
                      l.hitch(this, function(c) {
                        b.resolve({
                          name: c.displayName || c.name,
                          type: "GPTask",
                          url: a,
                          definition: c
                        });
                      }),
                      l.hitch(this, function(a) {
                        b.reject(a);
                      })
                    );
                return b;
              },
              getSubItemUrls: function(a) {
                var b = new h();
                this.isUrlEndWithServiceType(a)
                  ? this.getRestInfo(a).then(
                      l.hitch(this, function(c) {
                        c = n.map(
                          c.tasks || [],
                          l.hitch(this, function(b) {
                            return a + "/" + b;
                          })
                        );
                        b.resolve(c);
                      }),
                      l.hitch(this, function(a) {
                        b.reject(a);
                      })
                    )
                  : b.resolve([]);
                return b;
              },
              getIconImageName: function(a, b) {
                b = "";
                "GPServer" === a.type
                  ? (b = "toolbox.png")
                  : "GPTask" === a.type && (b = "tool.png");
                return b;
              }
            });
          },
          getImageServiceBrowserRule: function(a) {
            return new f({
              leafTypes: ["ImageServer"],
              serviceTypes: ["ImageServer"],
              getItem: function(b) {
                var c = new h();
                this.isUrlEndWithServiceType(b)
                  ? this.defaultGetItem(b).then(
                      l.hitch(this, function(b) {
                        a
                          ? m.isImageServiceSupportQuery(
                              b.definition.capabilities
                            )
                            ? c.resolve(b)
                            : c.resolve(null)
                          : c.resolve(b);
                      }),
                      l.hitch(this, function(a) {
                        c.reject(a);
                      })
                    )
                  : c.resolve(null);
                return c;
              },
              getIconImageName: function(a, c) {
                c = "";
                "ImageServer" === a.type && (c = "image_layer.png");
                return c;
              }
            });
          },
          getQueryableServiceBrowserRule: function() {
            var c = a.getFeaturelayerServiceBrowserRule(
                ["point", "polyline", "polygon"],
                !0,
                !0
              ),
              b = a.getImageServiceBrowserRule(!0);
            return a.combineRules([c, b]);
          }
        };
        return a;
      });
    },
    "jimu/ServiceBrowserRule": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred jimu/utils esri/request esri/IdentityManager".split(
        " "
      ), function(l, n, h, m, f, a, c) {
        return l([], {
          leafTypes: null,
          serviceTypes: null,
          _restInfoCache: {},
          constructor: function(a) {
            n.mixin(this, a);
            n.isArrayLike(this.leafTypes) || (this.leafTypes = []);
            n.isArrayLike(this.serviceTypes) || (this.serviceTypes = []);
          },
          getItem: function(a) {
            return this.defaultGetItem(a);
          },
          getSubItemUrls: function(a) {
            return this.defaultGetSubItemUrls(a);
          },
          getIconImageName: function(a, c) {
            return "";
          },
          defaultGetItem: function(a) {
            var b = new m();
            a = a.replace(/\/*$/g, "");
            if (this.isUrlEndWithServiceType(a)) {
              var c = a.split("/"),
                f = c[c.length - 1],
                h = c[c.length - 2];
              this.getRestInfo(a).then(
                n.hitch(this, function(c) {
                  b.resolve({ name: h, type: f, url: a, definition: c });
                }),
                n.hitch(this, function(a) {
                  console.error(a);
                  b.reject({ errorCode: "NETWORK_ERROR", error: a });
                })
              );
            } else b.resolve(null);
            return b;
          },
          defaultGetSubItemUrls: function(a) {
            a = new m();
            a.resolve([]);
            return a;
          },
          getRestInfo: function(b) {
            var e = new m();
            b = b.replace(/\/*$/g, "");
            var d = this._restInfoCache[b];
            if (d) e.resolve(d);
            else {
              var d = {
                  url: b,
                  content: { f: "json" },
                  handleAs: "json",
                  callbackParamName: "callback",
                  timeout: 2e4
                },
                f = c.findCredential(b);
              f && f.token && (d.content.token = f.token);
              a(d).then(
                n.hitch(this, function(a) {
                  this._restInfoCache[b] = a;
                  e.resolve(a);
                }),
                function(a) {
                  e.reject(a);
                }
              );
            }
            return e;
          },
          isServiceTypeSupported: function(a) {
            a = a.toLowerCase();
            return h.some(
              this.serviceTypes,
              n.hitch(this, function(b) {
                return b.toLowerCase() === a;
              })
            );
          },
          isUrlEndWithServiceType: function(a) {
            return h.some(
              this.serviceTypes,
              n.hitch(this, function(b) {
                return f.isStringEndWith(a, "/" + b);
              })
            );
          },
          isUrlContainsServiceType: function(a) {
            a = a.toLowerCase();
            return h.some(
              this.serviceTypes,
              n.hitch(this, function(b) {
                b = b.toLowerCase();
                return 0 <= a.indexOf("/" + b);
              })
            );
          }
        });
      });
    },
    "widgets/SmartEditor/setting/Preset": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/on dojo/mouse dojo/text!./Preset.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/Popup jimu/dijit/CheckBox dijit/form/Select dijit/form/ValidationTextBox ./ChooseFromLayer ./RelativeDates ./RelativeDomains dojo/dom-class dijit/form/NumberTextBox ./layersAndFieldsApplyOn ../presetUtils jimu/utils".split(
        " "
      ), function(
        l,
        n,
        h,
        m,
        f,
        a,
        c,
        b,
        e,
        d,
        q,
        k,
        r,
        t,
        u,
        g,
        p,
        x,
        w,
        v,
        A,
        E
      ) {
        return l([d, n, e], {
          baseClass: "jimu-widget-smartEditor-setting-presetPopup",
          templateString: b,
          groupNameTextBox: null,
          dataTypeDropdown: null,
          hasDomainField: null,
          presetValueDijitNode: null,
          presetValueTimeNode: null,
          _selectedRelativeDate: null,
          _selectedRelativeDomains: null,
          _selectedDomainFields: [],
          ValidFieldsByTypeToApplyOn: {
            esriFieldTypeInteger: [
              "esriFieldTypeSmallInteger",
              "esriFieldTypeInteger",
              "esriFieldTypeSingle",
              "esriFieldTypeDouble"
            ],
            esriFieldTypeGUID: ["esriFieldTypeGUID"],
            esriFieldTypeDate: ["esriFieldTypeDate"],
            esriFieldTypeString: ["esriFieldTypeString"]
          },
          postCreate: function() {
            this.inherited(arguments);
            this._isDomainField();
            this._initControls();
            this.isDelete || this.showDialog();
          },
          _initControls: function() {
            this.groupNameTextBox = new t({
              required: !0,
              trim: !0,
              style: { width: "100%" }
            });
            this.groupNameTextBox.placeAt(this.groupNameDiv);
            this.groupNameTextBox.validator = h.hitch(this, function(a) {
              return a
                ? a !== this.prevName &&
                  this.editUtils.isDuplicateGroupName(
                    a,
                    this.existingGroupNames
                  )
                  ? (this.groupNameTextBox.set(
                      "invalidMessage",
                      this.nls.smartActionsPage.uniqueGroupNameMsg
                    ),
                    !1)
                  : !0
                : (this.groupNameTextBox.set(
                    "invalidMessage",
                    this.nls.smartActionsPage.requiredGroupNameMsg
                  ),
                  !1);
            });
            this.groupNameTextBox.startup();
            this.name && this.groupNameTextBox.set("value", this.name);
            this.dataTypeDropdown = new r({
              options: this._addDataTypeOptions(),
              style: { width: "100%" }
            });
            this.own(
              a(
                this.dataTypeDropdown,
                "change",
                h.hitch(this, function(a) {
                  var b;
                  this.showOnlyDomainFieldsCB.getValue() ||
                    "esriFieldTypeDate" !== a ||
                    (this._selectedRelativeDate = b = { dateType: "fixed" });
                  this._createValueDijit(a, b, !0);
                  this._domainTableData = [];
                  this._enableDisablePresetValueDijit();
                })
              )
            );
            this.dataTypeDropdown.placeAt(this.dataTypeDropdownDiv);
            this.dataTypeDropdown.startup();
            this.showOnlyDomainFieldsCB = new k(
              { label: this.nls.presetPage.showOnlyDomainFields },
              f.create("div", {}, this.showOnlyDomainFieldsNode)
            );
            this.showOnlyDomainFields &&
              this.showOnlyDomainFieldsCB.setValue(!0);
            this.own(
              a(
                this.showOnlyDomainFieldsCB,
                "change",
                h.hitch(this, function(a) {
                  var b,
                    c = this.dataTypeDropdown.get("value");
                  a ||
                    "esriFieldTypeDate" !== c ||
                    (this._selectedRelativeDate = b = { dateType: "fixed" });
                  this._createValueDijit(c, b, !0);
                  this._createLayersAndFields(c, a);
                })
              )
            );
            this.dataType &&
              (this.dataTypeDropdown.set("value", this.dataType, !1),
              this.showOnlyDomainFields
                ? (this._selectedRelativeDomains = this._domainTableData = this.presetValue)
                : "esriFieldTypeDate" === this.dataType &&
                  (this._selectedRelativeDate = this.presetValue),
              this._createValueDijit(this.dataType, this.presetValue, !0));
            this.hideInPresetDisplayCB = new k(
              { label: this.nls.presetPage.hideInPresetDisplay },
              f.create("div", {}, this.hideInPresetDisplayNode)
            );
            this.hideInPresetDisplay && this.hideInPresetDisplayCB.setValue(!0);
          },
          _createValueDijit: function(b, d, e) {
            var f;
            if ((f = this.createDijitOnDataTypeChange(b)))
              (this.presetValueDijitNode = f),
                this.own(
                  a(
                    this.presetValueDijitNode.domNode,
                    c.enter,
                    h.hitch(this, function() {
                      if (
                        this._selectedRelativeDate &&
                        "esriFieldTypeDate" ===
                          this.dataTypeDropdown.get("value")
                      ) {
                        var a = A.getDateFromRelativeInfo(
                          this._selectedRelativeDate,
                          !0
                        );
                        "" === a &&
                          (a = this.nls.relativeDates.noDateDefinedTooltip);
                        this.presetValueDijitNode.set("title", a);
                      } else this.presetValueDijitNode.set("title", this.presetValueDijitNode.get("value"));
                    })
                  )
                ),
                this.presetValueDijitNode.placeAt(this.presetValueDiv),
                this.presetValueDijitNode.startup(),
                d &&
                  (this.showOnlyDomainFields
                    ? this.presetValueDijitNode.set(
                        "value",
                        this._getDefaultDomain(d)
                      )
                    : "esriFieldTypeDate" === b && d.dateType
                    ? "fixed" === d.dateType
                      ? d.dateTime
                        ? this.presetValueDijitNode.set(
                            "value",
                            A.getDateFromRelativeInfo(d, !0)
                          )
                        : this.presetValueDijitNode.set("value", "")
                      : this.presetValueDijitNode.set(
                          "value",
                          this.nls.relativeDates[d.dateType]
                        )
                    : this.presetValueDijitNode.set("value", d)),
                e && this._createLayersAndFields(b, !1);
          },
          _addDataTypeOptions: function() {
            return [
              {
                label: this.nls.dataType.esriFieldTypeString,
                value: "esriFieldTypeString"
              },
              {
                label: this.nls.dataType.esriFieldTypeInteger,
                value: "esriFieldTypeInteger"
              },
              {
                label: this.nls.dataType.esriFieldTypeDate,
                value: "esriFieldTypeDate"
              },
              {
                label: this.nls.dataType.esriFieldTypeGUID,
                value: "esriFieldTypeGUID"
              }
            ];
          },
          _isDomainField: function() {
            m.forEach(
              this._totalLayers,
              h.hitch(this, function(a) {
                m.some(
                  a.layerObject.fields,
                  h.hitch(this, function(a) {
                    if (a.domain && "codedValue" === a.domain.type)
                      return (this.hasDomainField = !0);
                  })
                );
              })
            );
          },
          _createLayerFieldsFilter: function(a, b) {
            var c = [],
              d = {};
            m.forEach(
              this._totalLayers,
              h.hitch(this, function(e) {
                (!e.isTable ||
                  (e.isTable && 0 < e.layerObject.relationships.length)) &&
                  m.forEach(
                    e.layerObject.fields,
                    h.hitch(this, function(f) {
                      this.ValidFieldsByTypeToApplyOn[a] &&
                        ((c = this.ValidFieldsByTypeToApplyOn[a]),
                        -1 < c.indexOf(f.type) &&
                          f.editable &&
                          (!b ||
                            (f.domain &&
                              (!f.domain || "range" !== f.domain.type))) &&
                          (d[e.id] || (d[e.id] = {}), (d[e.id][f.name] = f)));
                    })
                  );
              })
            );
            return d;
          },
          _createLayersAndFields: function(b, c) {
            this._layerAndFieldsApplyOnObj = new v({
              map: this.map,
              showDomainFieldIndicator: !0,
              layerInfos: this.layerInfos,
              _configInfos: this._configInfos,
              actionName: "Preset",
              nls: this.nls,
              prevName: this.prevName,
              existingGroups: this.existingGroups,
              _configuredPresetInfos: this._configuredPresetInfos,
              layerDetails: this._createLayerFieldsFilter(b, c),
              appliedOn: this.appliedOn
            });
            f.empty(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
            this._layerAndFieldsApplyOnObj.startup();
            x.add(
              this._layerAndFieldsApplyOnObj.layerAndFieldsMainDiv,
              "esriCTOverrideForPreset"
            );
            a(
              this._layerAndFieldsApplyOnObj,
              "layerFieldsUpdated",
              h.hitch(this, function(a) {
                this._fieldsToAppliedUpdated = !0;
                this.tableDomains = this._consolidateLayerDomains();
                this._domainTableData = this._createDomainData();
                this._checkIfDomainFieldSelected() ||
                  a ||
                  this._createValueDijit(
                    this.dataTypeDropdown.get("value"),
                    this.presetValueDijitNode.get("value"),
                    !1
                  );
                this._enableDisablePresetValueDijit(a);
              })
            );
          },
          _enableDisablePresetValueDijit: function(a) {
            var b = this._checkIfDomainFieldSelected();
            this.presetValueDijitNode &&
              (b || "esriFieldTypeDate" === this.dataTypeDropdown.get("value")
                ? (this.presetValueDijitNode.set("disabled", !0),
                  (a = a ? this.presetValue : this._domainTableData),
                  (a = this._getDefaultDomain(a)),
                  this.presetValueDijitNode.set("value", a))
                : (this.presetValueDijitNode.set("disabled", !1),
                  this.presetValueDijitNode.isValid() ||
                    this.presetValueDijitNode.set("value", "")));
          },
          _isDomainValueSelected: function() {
            var a = !1,
              b;
            m.some(
              this._domainTableData,
              h.hitch(this, function(c) {
                if (c.isDefault) return (a = !0), (b = c), !0;
              })
            );
            return { isDomainSelected: a, selectedDomain: b };
          },
          deleteGroup: function() {
            this._layerAndFieldsApplyOnObj.deleteGroup();
          },
          showDialog: function() {
            this.presetPopup = new q({
              titleLabel: this.nls.fieldsPage.fieldsSettingsTable
                .canPresetValue,
              width: 950,
              maxHeight: 600,
              autoHeight: !1,
              class: this.baseClass,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var a = !0,
                      b;
                    b = {};
                    if (this.groupNameTextBox.isValid()) {
                      b.name = E.stripHTML(this.groupNameTextBox.get("value"));
                      b.dataType = this.dataTypeDropdown.get("value");
                      "esriFieldTypeGUID" === b.dataType &&
                        "" === this.presetValueDijitNode.get("value") &&
                        (a = !1);
                      var c = this._checkIfDomainFieldSelected();
                      !a || this.presetValueDijitNode.isValid() || c
                        ? ((b.showOnlyDomainFields = c),
                          (b.hideInPresetDisplay = this.hideInPresetDisplayCB.getValue()),
                          c && this._domainTableData
                            ? (b.presetValue = h.clone(this._domainTableData))
                            : "esriFieldTypeDate" === b.dataType
                            ? (b.presetValue = h.clone(
                                this._selectedRelativeDate
                              ))
                            : this.presetValueDijitNode &&
                              (b.presetValue = this.presetValueDijitNode.get(
                                "value"
                              )),
                          (b.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(
                            b
                          )),
                          this.emit("groupInfoUpdated", b),
                          this.presetPopup.close())
                        : this.presetValueDijitNode.focus();
                    } else this.groupNameTextBox.focus();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    this.presetPopup.close();
                  })
                }
              ]
            });
          },
          createDijitOnDataTypeChange: function(a) {
            f.empty(this.presetValueDiv);
            this.presetValueDijitNode = this.presetValueTimeNode = null;
            if (this._checkIfDomainFieldSelected() || "esriFieldTypeDate" === a)
              a = new t({
                required: !1,
                disabled: !0,
                trim: !0,
                style: { width: "100%" }
              });
            else
              switch (a) {
                case "esriFieldTypeSmallInteger":
                case "esriFieldTypeInteger":
                case "esriFieldTypeSingle":
                case "esriFieldTypeDouble":
                  a = new w({ style: "width:100%" });
                  break;
                case "esriFieldTypeGUID":
                  a = new t({ style: "width:100%" });
                  a.validator = h.hitch(this, function(a) {
                    return "" === a ? !0 : A.isGuid(a);
                  });
                  break;
                default:
                  a = new t({
                    required: !1,
                    trim: !0,
                    style: { width: "100%" }
                  });
              }
            return a;
          },
          _onSelectPresetValueButtonClick: function() {
            var b = this.dataTypeDropdown.get("value");
            this._checkIfDomainFieldSelected()
              ? ((this._relativeDomainsObj = new p({
                  nls: this.nls,
                  layerInfos: this.layerInfos,
                  domainTableData: this._domainTableData,
                  dataType: this.dataTypeDropdown.get("value"),
                  _selectedRelativeDomains: this._selectedRelativeDomains,
                  selectedDomainFields: this._selectedDomainFields
                })),
                this.own(
                  a(
                    this._relativeDomainsObj,
                    "updatePresetValue",
                    h.hitch(this, function(a) {
                      this._selectedRelativeDomains = this._domainTableData =
                        a.domainData;
                      this.presetValueDijitNode.set("value", a.defaultValue);
                    })
                  )
                ))
              : "esriFieldTypeDate" === b
              ? ((this._relativeDatesObj = new g({
                  nls: this.nls,
                  relativeDates: this._selectedRelativeDate
                })),
                this.own(
                  a(
                    this._relativeDatesObj,
                    "updatePresetValue",
                    h.hitch(this, function(a) {
                      this._selectedRelativeDate = a;
                      "fixed" === this._selectedRelativeDate.dateType
                        ? this._selectedRelativeDate.dateTime
                          ? this.presetValueDijitNode.set(
                              "value",
                              A.getDateFromRelativeInfo(
                                this._selectedRelativeDate,
                                !0
                              )
                            )
                          : this.presetValueDijitNode.set("value", "")
                        : this.presetValueDijitNode.set(
                            "value",
                            this.nls.relativeDates[a.dateType]
                          );
                    })
                  )
                ))
              : ((this.ChooseFromLayerObj = new u({
                  map: this.map,
                  nls: this.nls,
                  allLayers: this._totalLayers,
                  dataType: this.dataTypeDropdown.get("value")
                })),
                a(
                  this.ChooseFromLayerObj,
                  "updatePresetValue",
                  h.hitch(this, function(a) {
                    this.presetValueDijitNode.set("value", a);
                  })
                ));
          },
          _getDefaultDomain: function(a) {
            var b = "";
            m.some(
              a,
              h.hitch(this, function(a) {
                if (a.isDefault) return (b = a.label), !0;
              })
            );
            return b;
          },
          _consolidateLayerDomains: function() {
            var a = [],
              b,
              c,
              d,
              e = {};
            c = this._layerAndFieldsApplyOnObj.getOnlyCheckedFields();
            this._selectedDomainFields = [];
            for (var f in c)
              (d = this.layerInfos.getLayerOrTableInfoById(f)),
                m.forEach(
                  c[f],
                  h.hitch(this, function(a) {
                    (b = d.layerObject.getField(a)) &&
                      b.domain &&
                      b.domain.codedValues &&
                      ((a = E.getDefaultPortalFieldInfo(b)),
                      this._selectedDomainFields.push(a.label),
                      m.forEach(
                        b.domain.codedValues,
                        h.hitch(this, function(a) {
                          e.hasOwnProperty(a.code)
                            ? 0 > e[a.code].indexOf(a.name) &&
                              e[a.code].push(a.name)
                            : ((e[a.code] = []), e[a.code].push(a.name));
                        })
                      ));
                  })
                );
            for (var g in e)
              a.push({ value: g, displayedLabel: e[g].join(" | ") });
            return a;
          },
          _createDomainData: function() {
            var a = [];
            m.forEach(
              this._selectedRelativeDomains,
              h.hitch(this, function(b) {
                for (var c, d = this.tableDomains.length - 1; 0 <= d; d--)
                  if (
                    ((c = this.tableDomains[d].value),
                    "esriFieldTypeString" !==
                      this.dataTypeDropdown.get("value") && (c = Number(c)),
                    b.value.toString() === c.toString())
                  ) {
                    a.push({
                      showInList: b.showInList,
                      value: this.tableDomains[d].value,
                      label: this.tableDomains[d].displayedLabel,
                      isDefault: b.isDefault
                    });
                    this.tableDomains.splice(d, 1);
                    break;
                  }
              })
            );
            m.forEach(
              this.tableDomains,
              h.hitch(this, function(b, c) {
                a.push({
                  showInList: !0,
                  value: "" + b.value + "",
                  label: b.displayedLabel,
                  isDefault: !1
                });
              })
            );
            return a;
          },
          _checkIfDomainFieldSelected: function() {
            var a = !1;
            this._domainTableData &&
              (a = 0 < this._domainTableData.length ? !0 : !1);
            return a;
          }
        });
      });
    },
    "widgets/SmartEditor/setting/ChooseFromLayer": function() {
      define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/on dojo/text!./ChooseFromLayer.html dijit/_TemplatedMixin jimu/BaseWidgetSetting jimu/dijit/Popup dijit/form/Select jimu/dijit/LayerChooserFromMap jimu/dijit/LayerChooserFromMapWithDropbox jimu/dijit/_filter/ValueProviderFactory dojo/Evented".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r) {
        return l([c, r, a], {
          baseClass: "jimu-widget-smartEditor-setting-chooseFromLayer",
          templateString: f,
          layerSelector: null,
          fieldsDropdown: null,
          chooseFromLayerPopup: null,
          valueProviderFactory: null,
          valueProvider: null,
          postCreate: function() {
            this.inherited(arguments);
            this._createPopUp();
          },
          _addLayerSelectors: function() {
            var a;
            a = this._createLayerChooserMapArgs();
            a = new d(a);
            a.startup();
            this.layerSelector = new q({ layerChooser: a });
            this.layerSelector.placeAt(this.layerSelectorDiv);
            this.layerSelector.startup();
            0 < this.layerSelector.layerChooser.getAllItems().length &&
              this.layerSelector.setSelectedLayer(
                this.layerSelector.setSelectedLayer(
                  this.layerSelector.layerChooser.getAllItems()[0].layerInfo
                    .layerObject
                )
              );
            this._addLayerFieldsOptions();
          },
          _createLayerChooserMapArgs: function() {
            return {
              multiple: !1,
              createMapResponse: this.map.webMapResponse,
              filter: this._createFiltersForLayerSelector()
            };
          },
          _createFiltersForLayerSelector: function() {
            var a, b;
            a = d.createFeaturelayerFilter(
              ["point", "polyline", "polygon"],
              !1,
              !1
            );
            b = d.createImageServiceLayerFilter(!0);
            return d.orCombineFilters([a, b]);
          },
          _addLayerFieldsOptions: function() {
            this.fieldsDropdown && this.fieldsDropdown.destroy();
            this.valueProviderFactory && (this.valueProviderFactory = null);
            this.valueProvider && this.valueProvider.destroy();
            this.fieldsDropdown = new e({ style: { width: "100%" } });
            this.fieldsDropdown.placeAt(this.fieldsDropdownDiv);
            this.fieldsDropdown.startup();
            this.fieldsDropdown.set("options", this._createFieldsDropDownOpt());
            this.fieldsDropdown.options &&
              0 < this.fieldsDropdown.options.length &&
              this.fieldsDropdown.set("value", this.fieldsDropdown.options[0]);
            this.own(
              m(
                this.fieldsDropdown,
                "change",
                n.hitch(this, function() {
                  this._createValueProvider();
                })
              )
            );
          },
          _createFieldsDropDownOpt: function() {
            var a, b;
            b = [];
            this.layerSelector.getSelectedItem() &&
              ((a = this.layerSelector.getSelectedItem().layerInfo.layerObject),
              h.forEach(
                a.fields,
                n.hitch(this, function(a) {
                  ("esriFieldTypeString" !== this.dataType &&
                    ("esriFieldTypeGUID" !== this.dataType ||
                      (a.type !== this.dataType &&
                        "esriFieldTypeGlobalID" !== a.type)) &&
                    ("esriFieldTypeInteger" !== this.dataType ||
                      ("esriFieldTypeSmallInteger" !== a.type &&
                        "esriFieldTypeInteger" !== a.type &&
                        "esriFieldTypeDouble" !== a.type &&
                        "esriFieldTypeSingle" !== a.type &&
                        "esriFieldTypeOID" !== a.type))) ||
                    b.push({ label: a.alias || a.name, value: a.name });
                })
              ));
            return b;
          },
          _createValueProvider: function() {
            var a;
            this.layerSelector && (a = this.layerSelector.getSelectedItem());
            if (a && a.layerInfo && a.layerInfo.layerObject) {
              a = a.layerInfo;
              var b = a.layerObject;
              this.valueProviderFactory && (this.valueProviderFactory = null);
              this.valueProvider && this.valueProvider.destroy();
              this.valueProviderFactory = new k({
                url: b.url,
                layerDefinition: b,
                featureLayerId: a.id
              });
              var c, d;
              d = this.fieldsDropdown.getValue();
              h.some(
                b.fields,
                n.hitch(this, function(a) {
                  if (a.name === d) return (c = a), !0;
                })
              );
              if (d && c) {
                switch (c.type) {
                  case "esriFieldTypeString":
                    a = "string";
                    b = "stringOperatorIs";
                    break;
                  case "esriFieldTypeDate":
                    a = "date";
                    b = "dateOperatorIs";
                    break;
                  default:
                    (a = "number"), (b = "numberOperatorIs");
                }
                a = {
                  fieldObj: {
                    name: d,
                    label: d,
                    dateFormat: "",
                    shortType: a,
                    type: c.type
                  },
                  operator: b,
                  interactiveObj: "",
                  caseSensitive: !1,
                  valueObj: { type: "unique" }
                };
                if (
                  (this.valueProvider = this.valueProviderFactory.getValueProvider(
                    a,
                    !1
                  ))
                )
                  this.valueProvider.placeAt(this.valueProviderContainer),
                    this.valueProvider.setValueObject(a.valueObj);
              }
            }
          },
          _createPopUp: function() {
            this._addLayerSelectors();
            this.chooseFromLayerPopup = new b({
              titleLabel: this.nls.chooseFromLayer.selectValueLabel,
              width: 500,
              maxHeight: 300,
              autoHeight: !0,
              class: this.baseClass,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: n.hitch(this, function() {
                    this._getSelectedFieldValue();
                    this.chooseFromLayerPopup.close();
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: n.hitch(this, function() {
                    this.chooseFromLayerPopup.close();
                  })
                }
              ]
            });
            this.own(
              m(
                this.layerSelector,
                "selection-change",
                n.hitch(this, function() {
                  this._addLayerFieldsOptions();
                })
              )
            );
          },
          _getSelectedFieldValue: function() {
            var a;
            this.valueProvider &&
              this.valueProvider.checkedNameDiv &&
              ((a = this.valueProvider.checkedNameDiv.innerHTML) &&
                "- empty -" === a &&
                (a = ""),
              this.emit("updatePresetValue", a));
          }
        });
      });
    },
    "widgets/SmartEditor/setting/RelativeDates": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/on dojo/text!./RelativeDates.html dijit/_WidgetsInTemplateMixin jimu/BaseWidgetSetting jimu/dijit/Popup dojo/dom-class jimu/utils dojo/query dijit/focus ../presetUtils dijit/form/DateTextBox dijit/form/TimeTextBox dijit/form/NumberTextBox jimu/dijit/RadioBtn".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r) {
        return l([c, n, a], {
          baseClass: "jimu-widget-smartEditor-setting-relativeDates",
          templateString: f,
          selectValuePopup: null,
          postCreate: function() {
            this._eventListener();
            this._createSelectValuePopUp();
            this._support508ForSelectValuePopUp();
            m(
              window,
              "resize",
              h.hitch(this, function() {
                setTimeout(
                  h.hitch(this, function() {
                    this._setFieldPopupDimensions();
                  }),
                  1e3
                );
              })
            );
          },
          _eventListener: function() {
            this.fixedRadioButton.onStateChange = h.hitch(this, function() {
              this.dateTypeChanged();
            });
            this.currentRadioButton.onStateChange = h.hitch(this, function() {
              this.dateTypeChanged();
            });
            this.PastRadioButton.onStateChange = h.hitch(this, function() {
              this.dateTypeChanged();
            });
            this.futureRadioButton.onStateChange = h.hitch(this, function() {
              this.dateTypeChanged();
            });
            this.own(
              m(
                this.yearsTextBox,
                "change",
                h.hitch(this, function() {
                  this._showOrHideWarningContainer();
                })
              )
            );
            this.own(
              m(
                this.monthsTextBox,
                "change",
                h.hitch(this, function() {
                  this._showOrHideWarningContainer();
                })
              )
            );
            this.own(
              m(
                this.daysTextBox,
                "change",
                h.hitch(this, function() {
                  this._showOrHideWarningContainer();
                })
              )
            );
            this.own(
              m(
                this.minutesTextBox,
                "change",
                h.hitch(this, function() {
                  this._showOrHideWarningContainer();
                })
              )
            );
            this.own(
              m(
                this.hoursTextBox,
                "change",
                h.hitch(this, function() {
                  this._showOrHideWarningContainer();
                })
              )
            );
            this.own(
              m(
                this.secondsTextBox,
                "change",
                h.hitch(this, function() {
                  this._showOrHideWarningContainer();
                })
              )
            );
          },
          dateTypeChanged: function() {
            e.add(this.fixedDateContent, "esriCTHidden");
            e.add(this.currentDateContent, "esriCTHidden");
            e.add(this.pastOrFutureDateContent, "esriCTHidden");
            e.remove(this.valueLabel, "esriCTHidden");
            e.add(this.relativeDateWarningContainer, "esriCTHidden");
            this.fixedRadioButton.checked
              ? (e.remove(this.fixedDateContent, "esriCTHidden"),
                (this.hintForDateType.innerHTML = this.nls.relativeDates.hintForFixedDateType))
              : this.currentRadioButton.checked
              ? (e.add(this.valueLabel, "esriCTHidden"),
                e.remove(this.currentDateContent, "esriCTHidden"),
                (this.hintForDateType.innerHTML = this.nls.relativeDates.hintForCurrentDateType))
              : this.PastRadioButton.checked
              ? (e.remove(this.pastOrFutureDateContent, "esriCTHidden"),
                (this.hintForDateType.innerHTML = this.nls.relativeDates.hintForPastDateType))
              : this.futureRadioButton.checked &&
                (e.remove(this.pastOrFutureDateContent, "esriCTHidden"),
                (this.hintForDateType.innerHTML = this.nls.relativeDates.hintForFutureDateType));
          },
          _createSelectValuePopUp: function() {
            this.selectValuePopup = new b({
              titleLabel: this.nls.relativeDates.popupTitle,
              width: 500,
              maxHeight: 450,
              autoHeight: !0,
              class: this.baseClass,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var a = this._getValues();
                    a &&
                      (!e.contains(
                        this.pastOrFutureDateContent,
                        "esriCTHidden"
                      ) && this._checkTextboxesWithZeroValue()
                        ? e.remove(
                            this.relativeDateWarningContainer,
                            "esriCTHidden"
                          )
                        : (e.add(
                            this.relativeDateWarningContainer,
                            "esriCTHidden"
                          ),
                          this.emit("updatePresetValue", a),
                          this.selectValuePopup.close()));
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    this.selectValuePopup.close();
                  })
                }
              ]
            });
            this.relativeDates && this._setValue();
            this._setFieldPopupDimensions();
          },
          _setFieldPopupDimensions: function() {
            this.selectValuePopup &&
              (window.appInfo.isRunInMobile && 600 > window.innerWidth
                ? this.selectValuePopup.set("width", window.innerWidth - 100)
                : this.selectValuePopup.set("width", 500));
          },
          _validateFixedDate: function() {
            return this.dateTextBox.isValid()
              ? this.timeTextBox.isValid()
                ? !0
                : (this.timeTextBox.focus(), !1)
              : (this.dateTextBox.focus(), !1);
          },
          _validatePastOrFutureDate: function() {
            return this.yearsTextBox.isValid()
              ? this.monthsTextBox.isValid()
                ? this.daysTextBox.isValid()
                  ? this.hoursTextBox.isValid()
                    ? this.minutesTextBox.isValid()
                      ? this.secondsTextBox.isValid()
                        ? !0
                        : (this.secondsTextBox.focus(), !1)
                      : (this.minutesTextBox.focus(), !1)
                    : (this.hoursTextBox.focus(), !1)
                  : (this.daysTextBox.focus(), !1)
                : (this.monthsTextBox.focus(), !1)
              : (this.yearsTextBox.focus(), !1);
          },
          _getValues: function() {
            var a = !0,
              b = { value: {} };
            if (this.fixedRadioButton.checked) {
              if ((a = this._validateFixedDate()))
                (b.dateType = "fixed"),
                  (b.dateTime = r.getDateFieldValue(
                    { type: "esriFieldTypeDate" },
                    [this.dateTextBox, this.timeTextBox]
                  ));
            } else if (this.currentRadioButton.checked) b.dateType = "current";
            else if (this.PastRadioButton.checked) {
              if ((a = this._validatePastOrFutureDate()))
                (b = this._getValuesOfPastOrFutureDijits()),
                  (b.dateType = "past");
            } else
              this.futureRadioButton.checked &&
                (a = this._validatePastOrFutureDate()) &&
                ((b = this._getValuesOfPastOrFutureDijits()),
                (b.dateType = "future"));
            return a ? b : a;
          },
          _support508ForSelectValuePopUp: function() {
            var a = q(".jimu-btn-vacation", this.selectValuePopup.domNode)[0];
            d.initFirstFocusNode(
              this.selectValuePopup.domNode,
              this.selectValuePopup.closeBtnNode
            );
            k.focus(this.selectValuePopup.closeBtnNode);
            d.initLastFocusNode(this.selectValuePopup.domNode, a);
          },
          _setValue: function() {
            var a;
            "fixed" === this.relativeDates.dateType &&
              (this.fixedRadioButton.domNode.click(),
              (a = new Date(parseInt(this.relativeDates.dateTime, 10))),
              this.dateTextBox.set("value", a),
              this.timeTextBox.set("value", a));
            "current" === this.relativeDates.dateType &&
              this.currentRadioButton.domNode.click();
            "past" === this.relativeDates.dateType &&
              (this.PastRadioButton.domNode.click(),
              this._setValuesOfPastOrFutureDijits());
            "future" === this.relativeDates.dateType &&
              (this.futureRadioButton.domNode.click(),
              this._setValuesOfPastOrFutureDijits());
          },
          _setValuesOfPastOrFutureDijits: function() {
            this.yearsTextBox.set("value", this.relativeDates.year);
            this.monthsTextBox.set("value", this.relativeDates.month);
            this.daysTextBox.set("value", this.relativeDates.day);
            this.hoursTextBox.set("value", this.relativeDates.hour);
            this.minutesTextBox.set("value", this.relativeDates.minute);
            this.secondsTextBox.set("value", this.relativeDates.second);
          },
          _getValuesOfPastOrFutureDijits: function() {
            var a = {};
            a.year = this.yearsTextBox.value;
            a.month = this.monthsTextBox.value;
            a.day = this.daysTextBox.value;
            a.hour = this.hoursTextBox.value;
            a.minute = this.minutesTextBox.value;
            a.second = this.secondsTextBox.value;
            return a;
          },
          _checkTextboxesWithZeroValue: function() {
            return 0 !== this.yearsTextBox.value ||
              0 !== this.monthsTextBox.value ||
              0 !== this.daysTextBox.value ||
              0 !== this.hoursTextBox.value ||
              0 !== this.minutesTextBox.value ||
              0 !== this.secondsTextBox.value
              ? !1
              : !0;
          },
          _showOrHideWarningContainer: function() {
            this._checkTextboxesWithZeroValue()
              ? e.remove(this.relativeDateWarningContainer, "esriCTHidden")
              : e.add(this.relativeDateWarningContainer, "esriCTHidden");
          }
        });
      });
    },
    "widgets/SmartEditor/presetUtils": function() {
      define("dojo/_base/lang jimu/utils dojo/date dojo/_base/array dojo/dom-construct dijit/form/DateTextBox dijit/form/NumberSpinner dijit/form/NumberTextBox dijit/form/FilteringSelect dijit/form/TextBox dijit/form/ValidationTextBox dijit/form/TimeTextBox dijit/Editor dijit/form/SimpleTextarea dojo/store/Memory".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u) {
        return {
          integerFields: [
            "esriFieldTypeSmallInteger",
            "esriFieldTypeInteger",
            "esriFieldTypeSingle",
            "esriFieldTypeDouble"
          ],
          getFieldInfoByFieldName: function(a, b) {
            var c = {};
            m.some(a, function(a) {
              if (a.name === b) return l.mixin(c, a), !0;
            });
            return c;
          },
          getDateFromRelativeInfo: function(a, b) {
            var c = new Date();
            "fixed" === a.dateType
              ? (c = a.dateTime ? new Date(a.dateTime) : "")
              : "future" === a.dateType
              ? ((c = h.add(c, "year", a.year)),
                (c = h.add(c, "month", a.month)),
                (c = h.add(c, "day", a.day)),
                (c = h.add(c, "hour", a.hour)),
                (c = h.add(c, "minute", a.minute)),
                (c = h.add(c, "second", a.second)))
              : "past" === a.dateType &&
                (a.year && (c = h.add(c, "year", -1 * a.year)),
                a.month && (c = h.add(c, "month", -1 * a.month)),
                a.day && (c = h.add(c, "day", -1 * a.day)),
                a.hour && (c = h.add(c, "hour", -1 * a.hour)),
                a.minute && (c = h.add(c, "minute", -1 * a.minute)),
                a.second && (c = h.add(c, "second", -1 * a.second)));
            return b && "" !== c ? n.localizeDate(c) : c;
          },
          getDateFieldValue: function(a, b) {
            var c;
            if ("esriFieldTypeDate" === a.type) {
              if (b instanceof Array) {
                var d, e;
                0 < b.length && b[0] && (d = b[0].getValue());
                1 < b.length && b[1] && (e = b[1].getValue());
                c =
                  d && e
                    ? new Date(
                        d.getFullYear(),
                        d.getMonth(),
                        d.getDate(),
                        e.getHours(),
                        e.getMinutes(),
                        e.getSeconds(),
                        e.getMilliseconds()
                      )
                    : d || e || null;
              } else (c = b.getValue()), a.domain && (c = Number(c));
              c =
                c && c.getTime
                  ? c.getTime()
                  : c && c.toGregorian
                  ? c.toGregorian().getTime()
                  : c;
            }
            return c;
          },
          isGuid: function(a) {
            "{" === a[0] && (a = a.substring(1, a.length - 1));
            return /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi.test(
              a
            );
          },
          validateGUID: function(a, b) {
            return this.isGuid(a);
          },
          isValidPresetValue: function(a) {
            var b = !0;
            m.some(a, function(a) {
              if (a.isValid && !a.isValid()) return (b = !1), !0;
            });
            return b;
          },
          createPresetFieldContentNode: function(g) {
            var h = [],
              n;
            if (g.domain) {
              if ("codedValue" === g.domain.type) {
                var w = [];
                m.forEach(g.domain.codedValues, function(a) {
                  w.push({ name: a.name, id: a.code });
                });
                n = new e(
                  {
                    class: "ee-inputField",
                    name: g.fieldName,
                    store: new u({ data: w }),
                    searchAttr: "name",
                    required: !1
                  },
                  f.create("div")
                );
              } else {
                n = null;
                switch (g.type) {
                  case "esriFieldTypeSmallInteger":
                  case "esriFieldTypeInteger":
                    n = {
                      min: g.domain.minValue,
                      max: g.domain.maxValue,
                      places: 0
                    };
                    break;
                  case "esriFieldTypeSingle":
                  case "esriFieldTypeDouble":
                    n = { min: g.domain.minValue, max: g.domain.maxValue };
                }
                n = new c(
                  {
                    class: "ee-inputField",
                    name: g.fieldName,
                    smallDelta: 1,
                    constraints: n
                  },
                  f.create("div")
                );
              }
              h.push(n);
            } else
              switch (g.type) {
                case "esriFieldTypeGUID":
                  n = new q(
                    { class: "ee-inputField", name: g.fieldName },
                    f.create("div")
                  );
                  n.validator = l.hitch(this, this.validateGUID);
                  h.push(n);
                  break;
                case "esriFieldTypeDate":
                  n = new a(
                    { class: "ee-inputField", name: g.fieldName },
                    f.create("div")
                  );
                  h.push(n);
                  g.format &&
                    g.format.time &&
                    !0 === g.format.time &&
                    ((g = new k(
                      { class: "ee-inputField", style: "margin-top:2px;" },
                      f.create("div")
                    )),
                    h.push(g));
                  break;
                case "esriFieldTypeString":
                  n = null;
                  g.length &&
                    Number(g.length) &&
                    0 < Number(g.length) &&
                    (n = g.length);
                  g.hasOwnProperty("stringFieldOption")
                    ? "richtext" === g.stringFieldOption
                      ? ((n = {
                          class: "ee-inputField ee-inputFieldRichText",
                          trim: !0,
                          maxLength: n
                        }),
                        (n["class"] += " atiRichTextField"),
                        (n.height = "100%"),
                        (n.width = "100%"),
                        (n.name = g.fieldName),
                        (n.plugins = "bold italic underline foreColor hiliteColor | justifyLeft justifyCenter justifyRight justifyFull | insertOrderedList insertUnorderedList indent outdent | createLink".split(
                          " "
                        )),
                        (n = new r(n, f.create("div"))),
                        n.startup())
                      : (n =
                          "textarea" === g.stringFieldOption
                            ? new t(
                                {
                                  class: "ee-inputField ee-inputFieldTextArea",
                                  name: g.fieldName,
                                  maxlength: n
                                },
                                f.create("div")
                              )
                            : new d(
                                {
                                  class: "ee-inputField",
                                  name: g.fieldName,
                                  maxlength: n
                                },
                                f.create("div")
                              ))
                    : (n = new d(
                        {
                          class: "ee-inputField",
                          name: g.fieldName,
                          maxlength: n
                        },
                        f.create("div")
                      ));
                  h.push(n);
                  break;
                case "esriFieldTypeSmallInteger":
                case "esriFieldTypeInteger":
                  n = new b(
                    {
                      class: "ee-inputField",
                      name: g.fieldName,
                      constraints: { places: 0 }
                    },
                    f.create("div")
                  );
                  h.push(n);
                  break;
                case "esriFieldTypeSingle":
                case "esriFieldTypeDouble":
                  n = new b(
                    { class: "ee-inputField", name: g.fieldName },
                    f.create("div")
                  );
                  h.push(n);
                  break;
                default:
                  (n = new d(
                    {
                      class: "ee-unsupportField",
                      name: g.fieldName,
                      value: "N/A",
                      readOnly: !0
                    },
                    f.create("div")
                  )),
                    h.push(n);
              }
            return h;
          },
          changeFieldToMostRestrictive: function(a, b) {
            if (!a.hasOwnProperty("type") && b.hasOwnProperty("type")) return b;
            b.length &&
              Number(b.length) &&
              0 < Number(b.length) &&
              (a.length && Number(a.length)
                ? b.length < a.length && (a.length = b.length)
                : (a.length = b.length));
            if (a.type === b.type)
              switch (b.type) {
                case "esriFieldTypeString":
                  a.hasOwnProperty("stringFieldOption") &&
                    b.hasOwnProperty("stringFieldOption") &&
                    ("richtext" === a.stringFieldOption &&
                    "richtext" !== b.stringFieldOption
                      ? (a.stringFieldOption = b.stringFieldOption)
                      : "textarea" === a.stringFieldOption &&
                        "textbox" === b.stringFieldOption &&
                        (a.stringFieldOption = b.stringFieldOption));
              }
            return a;
          }
        };
      });
    },
    "widgets/SmartEditor/setting/RelativeDomains": function() {
      define("dojo/_base/declare dojo/Evented dojo/_base/lang dojo/on dojo/text!./RelativeDomains.html dijit/_WidgetsInTemplateMixin dojo/_base/array jimu/BaseWidgetSetting jimu/dijit/Popup jimu/dijit/SimpleTable jimu/dijit/Message jimu/utils dojo/query dijit/focus dojo/string dojo/dom-attr dijit/form/DateTextBox dijit/form/TimeTextBox dijit/form/NumberTextBox".split(
        " "
      ), function(l, n, h, m, f, a, c, b, e, d, q, k, r, t, u, g) {
        return l([b, n, a], {
          baseClass: "jimu-widget-smartEditor-setting-relativeDomains",
          templateString: f,
          domainObj: [],
          selectDomainValuePopup: null,
          validNumericData: [
            "esriFieldTypeSmallInteger",
            "esriFieldTypeInteger",
            "esriFieldTypeSingle",
            "esriFieldTypeDouble"
          ],
          postCreate: function() {
            this.domainObj = [];
            this.selectDomainValuePopup = null;
            this._createDomainTable();
            this._createSelectValuePopUp();
            if (
              this.selectedDomainFields &&
              0 < this.selectedDomainFields.length
            ) {
              var a = u.substitute(
                this.nls.relativeDomains.selectedDomainFieldsHint,
                { domainFields: this.selectedDomainFields.join(", ") }
              );
              g.set(this.domainFieldsHint, "innerHTML", a);
            }
          },
          postMixInProperties: function() {
            this.nls = h.mixin(this.nls, window.jimuNls.common);
          },
          _createDomainTable: function() {
            this._domainTable = new d({
              fields: [
                {
                  name: "selectDomain",
                  title: "",
                  type: "checkbox",
                  width: "10%"
                },
                {
                  name: "domainValue",
                  title: this.nls.relativeDomains.valueText,
                  type: "text",
                  width: "15%"
                },
                {
                  name: "label",
                  title: this.nls.label,
                  type: "text",
                  width: "55%"
                },
                {
                  name: "defaultDomain",
                  title: this.nls.relativeDomains.defaultText,
                  type: "radio",
                  width: "10%"
                },
                {
                  name: "actions",
                  title: this.nls.action,
                  type: "actions",
                  width: "10%%",
                  actions: ["up", "down"],
                  class: "actions"
                }
              ],
              selectable: !1
            });
            this._domainTable.startup();
            this._domainTable.placeAt(this.tableParentContainer);
            this._setValues();
          },
          _createSelectValuePopUp: function() {
            this.selectDomainValuePopup = new e({
              titleLabel: this.nls.chooseFromLayer.selectValueLabel,
              width: 800,
              height: 500,
              autoHeight: !0,
              class: this.baseClass,
              content: this,
              buttons: [
                {
                  label: this.nls.ok,
                  onClick: h.hitch(this, function() {
                    var a = this._getValue();
                    a &&
                      (this.emit("updatePresetValue", a),
                      this.selectDomainValuePopup.close());
                  })
                },
                {
                  label: this.nls.cancel,
                  classNames: ["jimu-btn-vacation"],
                  onClick: h.hitch(this, function() {
                    this.selectDomainValuePopup.close();
                  })
                }
              ]
            });
          },
          _getValue: function() {
            var a = "",
              b = [],
              d = this._domainTable.getData();
            if (this._isValidConfiguration(d))
              return (
                c.forEach(
                  d,
                  h.hitch(this, function(c) {
                    var d = {};
                    d.showInList = c.selectDomain;
                    d.value =
                      "esriFieldTypeString" !== this.dataType
                        ? Number(c.domainValue)
                        : c.domainValue;
                    d.label = c.label;
                    d.isDefault = c.defaultDomain;
                    d.isDefault && (a = c.label);
                    b.push(d);
                  })
                ),
                { domainData: b, defaultValue: a }
              );
            new q({ message: this.nls.relativeDomains.selectDefaultDomainMsg });
          },
          _setValues: function() {
            c.forEach(
              this.domainTableData,
              h.hitch(this, function(a) {
                var b, c;
                b = this._domainTable.addRow({
                  selectDomain: a.showInList,
                  domainValue: "" + a.value + "",
                  label: a.label,
                  defaultDomain: a.isDefault
                }).tr.cells[3].childNodes[0];
                c = b.checked;
                this.own(
                  m(
                    b,
                    "click",
                    h.hitch(this, function() {
                      c = c ? (b.checked = !1) : (b.checked = !0);
                    })
                  )
                );
              })
            );
          },
          _isValidConfiguration: function(a) {
            var b = !1,
              d = !1,
              e = !1;
            c.some(
              a,
              h.hitch(this, function(a) {
                a.defaultDomain && ((e = !0), a.selectDomain && (d = !0));
                a.selectDomain && (b = !0);
              })
            );
            return e ? e && d : b ? b : !1;
          },
          _support508ForSelectValuePopUp: function() {
            var a = r(
              ".jimu-btn-vacation",
              this.selectDomainValuePopup.domNode
            )[0];
            k.initFirstFocusNode(
              this.selectDomainValuePopup.domNode,
              this.selectDomainValuePopup.closeBtnNode
            );
            t.focus(this.selectDomainValuePopup.closeBtnNode);
            k.initLastFocusNode(this.selectDomainValuePopup.domNode, a);
          }
        });
      });
    },
    "widgets/SmartEditor/presetBuilderBackwardCompatibility": function() {
      define([
        "dojo/_base/lang",
        "dojo/_base/array",
        "jimu/utils",
        "./presetUtils"
      ], function(l, n, h, m) {
        var f = {
          createPresetGroups: function(a, c) {
            f.config = a;
            f._jimuLayerInfos = c;
            if (
              a.editor.presetInfos &&
              0 < Object.keys(a.editor.presetInfos).length &&
              (a.attributeActionGroups
                ? a.attributeActionGroups &&
                  !a.attributeActionGroups.hasOwnProperty("Preset") &&
                  (a.attributeActionGroups.Preset = {})
                : (a.attributeActionGroups = {
                    Intersection: {},
                    Address: {},
                    Coordinates: {},
                    Preset: {}
                  }),
              !(
                a.attributeActionGroups &&
                a.attributeActionGroups.Preset &&
                0 < Object.keys(a.attributeActionGroups.Preset).length
              ))
            )
              for (var b in a.editor.presetInfos)
                f._addPresetGroupForField(
                  a.editor.configInfos || a.editor.layerInfos,
                  b
                );
          },
          _getDomainListForPresetGroup: function(a, c, b) {
            var e = [];
            n.forEach(
              c.domain.codedValues,
              l.hitch(this, function(c) {
                var d = {
                  showInList: !0,
                  value: c.code,
                  label: c.name,
                  isDefault: !1
                };
                a.showOnlyDomainFields = !0;
                var h = f.config.editor.presetInfos[b][0];
                "esriFieldTypeInteger" === a.dataType && (h = Number(h));
                0 < f.config.editor.presetInfos[b].length
                  ? c.code === h && (d.isDefault = !0)
                  : 0 === e.length && (d.isDefault = !0);
                e.push(d);
              })
            );
            return e;
          },
          _addPresetGroupForField: function(a, c) {
            var b;
            n.some(
              a,
              l.hitch(this, function(a) {
                if (b) return !0;
                if (a.fieldValues && a.fieldValues[c])
                  for (var d = a.fieldValues[c], e = 0; e < d.length; e++)
                    if ("Preset" === d[e].actionName && d[e].enabled) {
                      d[e].attributeActionGroupName = c;
                      var k = f._jimuLayerInfos.getLayerOrTableInfoById(
                        a.featureLayer.id
                      );
                      if (k && k.layerObject && k.layerObject.fields) {
                        e = m.getFieldInfoByFieldName(k.layerObject.fields, c);
                        k =
                          h.getDefaultPortalFieldInfo(e).label + " (" + c + ")";
                        d = {};
                        d.name = k;
                        0 <
                        [
                          "esriFieldTypeInteger",
                          "esriFieldTypeSmallInteger",
                          "esriFieldTypeInteger",
                          "esriFieldTypeSingle",
                          "esriFieldTypeDouble"
                        ].indexOf(e.type)
                          ? (d.dataType = "esriFieldTypeInteger")
                          : (d.dataType = e.type);
                        d.showOnlyDomainFields = !1;
                        d.hideInPresetDisplay = !1;
                        d.appliedOn = f._getPresetFieldsForAppliedOn(e, d);
                        if (e.domain && "range" !== e.domain.type)
                          d.presetValue = f._getDomainListForPresetGroup(
                            d,
                            e,
                            c
                          );
                        else if ("esriFieldTypeDate" === e.type) {
                          var l, n;
                          0 < f.config.editor.presetInfos[c].length
                            ? (isNaN(f.config.editor.presetInfos[c][0]) ||
                                "" === f.config.editor.presetInfos[c][0] ||
                                (n = new Date(
                                  f.config.editor.presetInfos[c][0]
                                )),
                              f.config.editor.presetInfos[c][1] &&
                                !isNaN(f.config.editor.presetInfos[c][1]) &&
                                (l = new Date(
                                  f.config.editor.presetInfos[c][1]
                                )),
                              (l =
                                n && l
                                  ? new Date(
                                      n.getFullYear(),
                                      n.getMonth(),
                                      n.getDate(),
                                      l.getHours(),
                                      l.getMinutes(),
                                      l.getSeconds(),
                                      l.getMilliseconds()
                                    )
                                  : n),
                              (d.presetValue = l
                                ? { dateType: "fixed", dateTime: l.getTime() }
                                : { dateType: "fixed", dateTime: "" }))
                            : (d.presetValue = {
                                dateType: "fixed",
                                dateTime: ""
                              });
                        } else
                          d.presetValue =
                            0 < f.config.editor.presetInfos[c].length
                              ? f.config.editor.presetInfos[c][0]
                              : null;
                        f.config.attributeActionGroups.Preset[d.name] = d;
                        b = !0;
                        break;
                      }
                    }
                !b &&
                  a.relationshipInfos &&
                  0 < a.relationshipInfos.length &&
                  (b = f._addPresetGroupForField(a.relationshipInfos, c));
              })
            );
            return b;
          },
          _isPresetEnabledForLayer: function(a, c, b, e) {
            if (a.fieldValues[c.name])
              for (var d = a.fieldValues[c.name], h = 0; h < d.length; h++)
                if ("Preset" === d[h].actionName && d[h].enabled) {
                  var k = f._jimuLayerInfos.getLayerOrTableInfoById(
                    a.featureLayer.id
                  ).layerObject.fields;
                  m.getFieldInfoByFieldName(k, c.name).type === c.type &&
                    ((d[h].attributeActionGroupName = e.name),
                    b.hasOwnProperty(a.featureLayer.id)
                      ? b[a.featureLayer.id].push(c.name)
                      : (b[a.featureLayer.id] = [c.name]));
                }
            return b;
          },
          _getPresetFieldsForAppliedOn: function(a, c) {
            var b = {};
            n.forEach(
              f.config.editor.configInfos || f.config.editor.layerInfos,
              l.hitch(this, function(e) {
                e.fieldValues &&
                  e.fieldValues[a.name] &&
                  (b = f._isPresetEnabledForLayer(e, a, b, c));
                e.relationshipInfos &&
                  0 < e.relationshipInfos.length &&
                  n.forEach(
                    e.relationshipInfos,
                    l.hitch(this, function(d) {
                      d.fieldValues &&
                        d.fieldValues[a.name] &&
                        (b = f._isPresetEnabledForLayer(d, a, b, c));
                    })
                  );
              })
            );
            return b;
          }
        };
        return f;
      });
    },
    "widgets/SmartEditor/setting/_build-generate_module": function() {
      define([
        "dojo/text!./Setting.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings"
      ], function() {});
    },
    "url:widgets/SmartEditor/setting/EditFields.html":
      '\x3cdiv\x3e\r\n    \x3cdiv class\x3d"settingsDesc" data-dojo-attach-point\x3d"fieldsDesc"\x3e${nls.fieldsPage.description}\x3c/div\x3e\r\n    \r\n    \x3cdiv data-dojo-attach-point\x3d"fieldsTable"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"settingsNotes" data-dojo-attach-point\x3d"fieldsNotes"\x3e${nls.fieldsPage.fieldsNotes}\x3c/div\x3e\r\n    \x3cdiv class\x3d"attachmentsDesc" data-dojo-attach-point\x3d"attachmentsValidation"\x3e${nls.fieldsPage.smartAttachmentText}\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/FieldValidation.html":
      '\x3cdiv\x3e\r\n    \x3cdiv class\x3d"settingsDesc" data-dojo-attach-point\x3d"validationDesc"\x3e${nls.actionPage.description}\x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"validationTable"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/FilterPage.html":
      '\x3cdiv\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"submitWhenHidden"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"filterControl"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/CopyAttributes.html":
      '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"settingsDesc" data-dojo-attach-point\x3d"validationDesc"\x3e${nls.actionPage.description}\x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"copyAttributeTable"\x3e\x3c/div\x3e\r\n  \x3cdiv style\x3d"color:red; display: none;" class\x3d"settingsNotes" data-dojo-attach-point\x3d"warningNote"\x3e${nls.actionPage.copyAttributesNote}\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/Intersection.html":
      '\x3cdiv class\x3d"esriCTIntersectionMainContainer"\x3e\r\n    \x3cdiv syle\x3d"width:100%"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"groupInfoNode1"\x3e\r\n          \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n            \x3cdiv class\x3d"esriCTIntersectionGroupName"\x3e\r\n              \x3cdiv class\x3d"esriCTlabel"\x3e\r\n                ${nls.intersectionPage.groupNameLabel}\r\n              \x3c/div\x3e\r\n              \x3cdiv class\x3d"esriCTGroupInfoContainer"\x3e\r\n                \x3cdiv style\x3d"width: 75%;" data-dojo-attach-point\x3d"groupNameTextBoxNode"\x3e\r\n                \x3c/div\x3e\r\n              \x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTIntersectionDatatype"\x3e\r\n              \x3cdiv class\x3d"esriCTlabel"\x3e\r\n                ${nls.intersectionPage.dataTypeLabel}\r\n              \x3c/div\x3e\r\n              \x3cdiv class\x3d"esriCTGroupInfoContainer"\x3e\r\n                \x3cdiv style\x3d"width: 75%;" data-dojo-attach-point\x3d"dataTypeDropDownNode"\x3e\r\n                \x3c/div\x3e\r\n              \x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"ignoreLayerRankingNode" class\x3d"esriCTlabel esriCTIgnoreLayerRankingLabel"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n      \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.intersectionPage.intersectingLayersLabel}\x3c/legend\x3e\r\n      \x3cdiv class\x3d"addLayerLink"\x3e\r\n        \x3cdiv class\x3d"add-with-icon" data-dojo-attach-point\x3d"addLayer"\x3e\r\n          \x3cspan class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/span\x3e\x3cspan class\x3d"add-label"\x3e\r\n            ${nls.intersectionPage.addLayerLinkText}\x3c/span\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"layerTableNode"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/fieldset\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"  data-dojo-attach-point\x3d"groupInfoNode2"\x3e\r\n    \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n      \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.intersectionPage.layerAndFieldsApplyLabel}\x3c/legend\x3e\r\n      \x3cdiv class\x3d"esriCTTableParentContainer" data-dojo-attach-point\x3d"tableParentContainer"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/fieldset\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:jimu/dijit/templates/_TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"contentNode" class\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem" tabindex\x3d"-1" aria-selected\x3d"false"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation" style\x3d"display: none;"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:dijit/templates/TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"contentNode"\r\n\t\t\tclass\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem"\r\n\t\t\t\t   tabindex\x3d"-1" aria-selected\x3d"false" id\x3d"${id}_label"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\r\n\t\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation"\r\n\t\t style\x3d"display: none;" aria-labelledby\x3d"${id}_label"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:dijit/templates/Tree.html":
      '\x3cdiv role\x3d"tree"\x3e\r\n\t\x3cdiv class\x3d"dijitInline dijitTreeIndent" style\x3d"position: absolute; top: -9999px" data-dojo-attach-point\x3d"indentDetector"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"dijitTreeExpando dijitTreeExpandoLoading" data-dojo-attach-point\x3d"rootLoadingIndicator"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeContainer" role\x3d"presentation"\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:jimu/dijit/templates/LayerChooserFromMapWithDropbox.html":
      '\x3cdiv\x3e\r\n\x3ctable role\x3d"listbox" aria-haspopup\x3d"true" data-dojo-attach-point\x3d"dropDownBtn" data-dojo-attach-event\x3d"onclick: _onDropDownClick,onkeydown: _onDropDownKeydown"\r\n  tabindex\x3d"0" title\x3d"${nls.customSelectLayer}" aria-label\x3d"${nls.customSelectLayer}"\x3e\r\n    \x3ccaption class\x3d"screen-readers-only-no-position"\x3e${nls.customSelectLayer}\x3c/caption\x3e\r\n    \x3ccolgroup\x3e\r\n      \x3ccol width\x3d"10px"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"30px"\x3e\x3c/col\x3e\r\n    \x3c/colgroup\x3e\r\n    \x3ctbody\x3e\r\n      \x3ctr\x3e\r\n        \x3ctd\x3e\x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"layer-name jimu-ellipsis" data-dojo-attach-point\x3d"layerNameNode"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"drop-select jimu-float-trailing" data-dojo-attach-point\x3d"dropArrowNode"\x3e\r\n            \x3cdiv class\x3d"jimu-icon jimu-icon-down-arrow-8"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n    \x3c/tbody\x3e\r\n  \x3c/table\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/SmartEditor/setting/layerAndFieldsApplyOn.html":
      '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"esriCTSearchFieldNode" data-dojo-attach-point \x3d "searchNode"\x3e\x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point \x3d "layerAndFieldsMainDiv"\x3e\x3c/div\x3e\r\n  \x3cdiv style\x3d"margin-top: 5px;" class\x3d"esriCTHidden" data-dojo-attach-point \x3d "domainFieldHintMsg"\x3e\r\n    \x3cdiv class\x3d"esriCTDomainlistDiv"\x3e*\x3c/div\x3e\r\n    \x3cdiv\x3e${nls.actionPage.domainListTitle}\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/Coordinates.html":
      '\x3cdiv style\x3d"max-height: 445px;padding: 0 5px;"\x3e\r\n  \x3cdiv class\x3d"esriCTCoordinateWidth" data-dojo-attach-point\x3d"coordianteDijitMainWrapper"\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper" data-dojo-attach-point\x3d"groupInfoNode1"\x3e\r\n      \x3cdiv class\x3d"esriCTCoordinatePopUpLabel"\x3e${nls.intersectionPage.groupNameLabel}\x3c/div\x3e\r\n      \x3cdiv class\x3d"esriCTCoordinatePopupdijitWrapper"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"groupNameTextBoxNode"\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n      \x3cdiv class\x3d"esriCTCoordinatePopUpLabel" title\x3d"${nls.coordinatesPage.coordinatesSelectTitle}"\x3e${nls.coordinatesPage.coordinatesSelectTitle}\x3c/div\x3e\r\n      \x3cdiv class\x3d"esriCTCoordinatePopupdijitWrapper"\x3e\r\n        \x3cdiv class\x3d"esriCTCoordinatePopupdijit" style\x3d"width: 100%" data-dojo-attach-point\x3d"selectCoordinateNode"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n      \x3cdiv class\x3d"esriCTCoordinatePopUpLabel" title\x3d"${nls.coordinatesPage.coordinatesAttributeTitle}"\x3e${nls.coordinatesPage.coordinatesAttributeTitle}\x3c/div\x3e\r\n      \x3cdiv class\x3d"esriCTCoordinatePopupdijitWrapper"\x3e\r\n        \x3cdiv class\x3d"esriCTCoordinatePopupdijit" style\x3d"width: 100%" data-dojo-attach-point\x3d"selectAttributeNode"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTWrapper" data-dojo-attach-point\x3d"groupInfoNode2"\x3e\r\n    \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n      \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.intersectionPage.layerAndFieldsApplyLabel}\x3c/legend\x3e\r\n      \x3cdiv class\x3d"esriCTTableParentContainer" data-dojo-attach-point\x3d"tableParentContainer"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/fieldset\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/Address.html":
      '\x3cdiv style\x3d"max-height: 445px;padding: 0 5px;"\x3e\r\n  \x3cdiv class\x3d"esriCTAddressWidth" data-dojo-attach-point\x3d"addressDijitMainWrapper"\x3e \r\n      \x3cdiv class\x3d"esriCTWrapper" data-dojo-attach-point\x3d"groupInfoNode1"\x3e\r\n        \x3cdiv  class\x3d"esriCTlabel"\x3e\r\n          ${nls.intersectionPage.groupNameLabel}\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTGroupInfoContainer"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"groupNameTextBoxNode" style\x3d"width: 100%"\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n    \x3cdiv class\x3d"esriCTlabel" title\x3d"${nls.addressPage.selectFieldTitle}"\x3e${nls.addressPage.selectFieldTitle}\x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTGroupInfoContainer"\x3e\r\n      \x3cdiv class\x3d"esriCTSelectAttributeNode" data-dojo-attach-point\x3d"selectNode" style\x3d"width: 100%"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTHint"\x3e${nls.addressPage.geocoderHint}\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTWrapper" data-dojo-attach-point\x3d"groupInfoNode2"\x3e\r\n    \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n      \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.intersectionPage.layerAndFieldsApplyLabel}\x3c/legend\x3e\r\n      \x3cdiv class\x3d"esriCTTableParentContainer" data-dojo-attach-point\x3d"tableParentContainer"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/fieldset\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/EditDescription.html":
      '\x3cdiv\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"editText"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/SmartActionGroup.html":
      '\x3cdiv class\x3d"esriCTSmartActionsGroupContainer"\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cdiv class\x3d"esriCTlabel"\x3e\r\n      ${nls.smartActionsPage.groupNameLabel}\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTLayerField"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"groupNameTextBoxNode"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cdiv class\x3d"esriCTlabelParentContainer"\x3e\r\n      \x3cdiv class\x3d"esriCTlabel"\x3e\r\n        ${nls.smartActionsPage.layerForExpressionLabel}\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"esriCTLayerFieldDropBox"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"layerSelectorDiv"\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTHintCheck"\x3e\r\n      ${nls.smartActionsPage.layerForExpressionNote}\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cdiv class\x3d"esriCTlabel"\x3e${nls.smartActionsPage.expressionText}\x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTExpression"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"expressionTextBoxNode" class\x3d"esriCTExpressionTextBoxNode"\x3e\x3c/div\x3e\r\n      \x3cdiv class\x3d"editExpressionIconNode" title\x3d"${nls.smartActionsPage.editExpressionLabel}"\x3e\r\n        \x3cdiv class\x3d"jimu-icon jimu-icon-edit" data-dojo-attach-point\x3d"editExpressionIconNode"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"submitWhenHiddenNode" class\x3d"esriCTlabel esriCTSubmitAttributeDataText"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n    \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n      \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.smartActionsPage.layerAndFieldsApplyLabel}\x3c/legend\x3e\r\n      \x3cdiv class\x3d"esriCTTableParentContainer" data-dojo-attach-point\x3d"tableParentContainer"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/fieldset\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:dijit/templates/ProgressBar.html":
      '\x3cdiv class\x3d"dijitProgressBar dijitProgressBarEmpty" role\x3d"progressbar"\r\n\t\x3e\x3cdiv  data-dojo-attach-point\x3d"internalProgress" class\x3d"dijitProgressBarFull"\r\n\t\t\x3e\x3cdiv class\x3d"dijitProgressBarTile" role\x3d"presentation"\x3e\x3c/div\r\n\t\t\x3e\x3cspan style\x3d"visibility:hidden"\x3e\x26#160;\x3c/span\r\n\t\x3e\x3c/div\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"labelNode" class\x3d"dijitProgressBarLabel" id\x3d"${id}_label"\x3e\x3c/div\r\n\t\x3e\x3cspan data-dojo-attach-point\x3d"indeterminateHighContrastImage"\r\n\t\t   class\x3d"dijitInline dijitProgressBarIndeterminateHighContrastImage"\x3e\x3c/span\r\n\x3e\x3c/div\x3e\r\n',
    "url:esri/dijit/editing/templates/AttachmentEditor.html":
      "\x3cdiv class\x3d\"attachmentEditor\"\x3e\r\n    \x3cbr /\x3e\r\n    \x3cdiv\x3e\r\n        \x3cb\x3e${NLS_attachments}\x3c/b\x3e\r\n        \x3chr /\x3e\r\n        \x3cdiv dojoAttachPoint\x3d\"_attachmentError\" style\x3d'color:red;display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e\r\n        \x3cspan dojoAttachPoint\x3d'_attachmentList' style\x3d'word-wrap: break-word;'\x3e\x3c/span\x3e\r\n        \x3cbr\x3e\x3cbr\x3e\r\n        \x3cdiv data-dojo-type\x3d\"dijit/ProgressBar\" dojoAttachPoint\x3d\"_attachmentProgress\" indeterminate\x3d\"true\" style\x3d'display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e        \r\n        \x3cform dojoAttachPoint\x3d'_uploadForm'\x3e ${NLS_add}:\x26nbsp;\x26nbsp;\x3cinput type\x3d'file' name\x3d'attachment' dojoAttachPoint\x3d'_uploadField' /\x3e \x3c/form\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e",
    "url:esri/dijit/templates/AttributeInspector.html":
      '\x3cdiv class\x3d"esriAttributeInspector"\x3e\r\n    \x3cdiv class\x3d"atiLayerName" dojoAttachPoint\x3d"layerName"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiAttributes" dojoAttachPoint\x3d"attributeTable"\x3e\x3c/div\x3e\r\n    \x3cdiv dojoAttachPoint\x3d"attachmentEditor"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiEditorTrackingInfo" dojoAttachPoint\x3d"editorTrackingInfoDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiButtons" dojoAttachPoint\x3d"editButtons"\x3e\r\n        \x3cbutton  dojoType\x3d"dijit.form.Button" class\x3d"atiButton atiDeleteButton"  dojoAttachPoint\x3d"deleteBtn" dojoAttachEvent\x3d"onClick: onDeleteBtn" showLabel\x3d"true" type\x3d"button"\x3e${NLS_deleteFeature}\x3c/button\x3e\r\n        \x3cdiv class\x3d"atiNavButtons" dojoAttachPoint\x3d"navButtons"\x3e\r\n            \x3cdiv class\x3d"atiNavMessage" dojoAttachPoint\x3d"navMessage"\x3e\x3c/div\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiFirstIcon" dojoAttachPoint\x3d"firstFeatureButton" dojoAttachEvent\x3d"onClick: onFirstFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_first}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiPrevIcon" dojoAttachPoint\x3d"prevFeatureButton" dojoAttachEvent\x3d"onClick: onPreviousFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_previous}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiNextIcon" dojoAttachPoint\x3d"nextFeatureButton" dojoAttachEvent\x3d"onClick: onNextFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_next}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiLastIcon" dojoAttachPoint\x3d"lastFeatureButton" dojoAttachEvent\x3d"onClick: onLastFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_last}\x3c/button\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:jimu/dijit/templates/_BasicServiceChooserContent.html":
      '\x3cdiv\x3e\r\n\t\x3cdiv class\x3d"content-section"\x3e\r\n\t\t\x3ctable class\x3d"layout"\x3e\r\n\t\t\t\x3ccolgroup\x3e\r\n\t\t\t\t\x3ccol width\x3d"80px" align\x3d"right"\x3e\x3c/col\x3e\r\n\t\t\t\t\x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n\t\t\t\t\x3ccol width\x3d"170px"\x3e\x3c/col\x3e\r\n\t\t\t\x3c/colgroup\x3e\r\n\t\t\t\x3ctbody\x3e\r\n\t\t\t\t\x3ctr\x3e\r\n\t\t\t\t\t\x3ctd class\x3d"first-td"\x3e\r\n\t\t\t\t\t\t\x3cspan\x3eURL:\x3c/span\x3e\r\n\t\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\t\x3cdiv data-dojo-attach-point\x3d"urlInput" data-dojo-type\x3d"jimu/dijit/URLInput" style\x3d"width:100%;"\x3e\x3c/div\x3e\r\n\t\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\t\x3cdiv class\x3d"jimu-btn jimu-state-disabled validate-btn jimu-float-trailing" data-dojo-attach-point\x3d"btnValidate" data-dojo-attach-event\x3d"onclick:_onBtnValidateClick"\x3e${nls.validate}\x3c/div\x3e\r\n\t\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\x3c/tr\x3e\r\n\t\t\t\t\x3ctr data-dojo-attach-point\x3d"exampleTr" class\x3d"example-tr"\x3e\r\n\t\t\t\t\t\x3ctd class\x3d"first-td" style\x3d"padding-top:5px;"\x3e\r\n\t\t\t\t\t\t\x3cspan title\x3d"${nls.example}:"\x3e${nls.example}:\x3c/span\x3e\r\n\t\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\t\x3ctd data-dojo-attach-point\x3d"exampleTd" colspan\x3d"2" style\x3d"padding-top:5px;font-style:italic;color:#ccc;"\x3e\r\n\t\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\x3c/tr\x3e\r\n\t\t\t\x3c/tbody\x3e\r\n\t\t\x3c/table\x3e\r\n\t\t\x3cdiv class\x3d"service-browser-container" data-dojo-attach-point\x3d"serviceBrowserContainer"\x3e\r\n\t\t\t\x3cdiv class\x3d"error-section" data-dojo-attach-point\x3d"errorSection"\x3e\r\n\t\t\t\t\x3cspan class\x3d"jimu-icon jimu-icon-error"\x3e\x3c/span\x3e\r\n\t\t\t\t\x3cspan class\x3d"error-message" data-dojo-attach-point\x3d"errorNode"\x3e\x3c/span\x3e\r\n\t\t\t\x3c/div\x3e\r\n\t\t\x3c/div\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv class\x3d"operations"\x3e\r\n\t\t\x3cdiv class\x3d"jimu-btn jimu-float-trailing cancel jimu-btn-vacation" data-dojo-attach-event\x3d"onclick:_onBtnCancelClick"\x3e${nls.cancel}\x3c/div\x3e\r\n\t\t\x3cdiv class\x3d"jimu-btn jimu-float-trailing jimu-state-disabled ok" data-dojo-attach-point\x3d"btnOk" data-dojo-attach-event\x3d"onclick:_onBtnOkClick"\x3e${nls.ok}\x3c/div\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"loading" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/Preset.html":
      '\x3cdiv class\x3d"esriCTPresetPopUpDiv"\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n        \x3cdiv style\x3d"width:50%; float:left;"\x3e\r\n            \x3cdiv class\x3d"esriCTPresetPopUpLabel"\x3e${nls.intersectionPage.groupNameLabel}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTPresetPopupdijitWrapper"\x3e\r\n                \x3cdiv class\x3d"esriCTPresetPopupdijit" style\x3d"width: 100%" data-dojo-attach-point\x3d"groupNameDiv"\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv style\x3d"width:50%; float:left;"\x3e\r\n            \x3cdiv class\x3d"esriCTPresetPopUpLabel"\x3e${nls.intersectionPage.dataTypeLabel}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTPresetPopupdijitWrapper"\x3e\r\n                \x3cdiv class\x3d"esriCTPresetPopupdijit" style\x3d"width: 100%" data-dojo-attach-point\x3d"dataTypeDropdownDiv"\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTRowContainer row esriCTHidden"\x3e\r\n        \x3cdiv style\x3d"width: 100%;" data-dojo-attach-point\x3d"showOnlyDomainFieldsNode" class\x3d"esriCTPresetPopUpLabel"\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n        \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n            \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.smartActionsPage.layerAndFieldsApplyLabel}\x3c/legend\x3e\r\n            \x3cdiv class\x3d"esriCTTableParentContainer" data-dojo-attach-point\x3d"tableParentContainer"\x3e\r\n            \x3c/div\x3e\r\n        \x3c/fieldset\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n        \x3cdiv class\x3d"esriCTPresetPopUpLabel"\x3e${nls.presetPopup.presetValueLAbel}\x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTPresetPopupdijitWrapper" data-dojo-attach-point\x3d"presetValuedijitWrapper"\x3e\r\n            \x3cdiv class\x3d"esriCTPresetPopupdijit" style\x3d"width: 100%" data-dojo-attach-point\x3d"presetValueDiv"\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"jimu-btn esriCTSelectValueBtn" data-dojo-attach-point\x3d"selectPresetValueBtn"\r\n            data-dojo-attach-event\x3d"onClick:_onSelectPresetValueButtonClick"\x3e${nls.chooseFromLayer.selectValueLabel}\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTRowContainer row"\x3e\r\n        \x3cdiv style\x3d"width: 100%;" data-dojo-attach-point\x3d"hideInPresetDisplayNode" class\x3d"esriCTPresetPopUpLabel"\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/ChooseFromLayer.html":
      '\x3cdiv data-dojo-attach-point\x3d"layerSelectorPopUpDiv" class\x3d"esriCTlayerSelectorPopUpDiv"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"layerSelectorWrapper" class\x3d"esriCTWrapper"\x3e\r\n        \x3cdiv class\x3d"esriCTPopUpLabel"\x3e${nls.layersPage.layerSettingsTable.label}\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTPopupSelect"\x3e\r\n            \x3cdiv class\x3d"esriCTLayerSelect" style\x3d"width: 100%" data-dojo-attach-point\x3d"layerSelectorDiv"\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n        \x3cdiv class\x3d"esriCTPopUpLabel"\x3e${nls.chooseFromLayer.fieldLabel}\x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTPopupSelect"\x3e\r\n            \x3cdiv class\x3d"esriCTlayerField" style\x3d"width: 100%" data-dojo-attach-point\x3d"fieldsDropdownDiv"\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTWrapper"\x3e\r\n        \x3cdiv class\x3d"esriCTPopUpLabel"\x3e${nls.chooseFromLayer.valueLabel}\x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTPopupSelect"\x3e\r\n            \x3cdiv class\x3d"esriCTlayerFieldvalue" style\x3d"width: 100%" data-dojo-attach-point\x3d"valueProviderContainer"\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/RelativeDates.html":
      '\x3cdiv\x3e\r\n    \x3cdiv\x3e\r\n        \x3cdiv class\x3d"esriCTLabel"\x3e${nls.relativeDates.dateTypeLabel}\x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTRadioButtonContainer"\x3e\r\n            \x3cdiv class\x3d"esriCTRadioBtn"\x3e\r\n                \x3cinput data-dojo-type\x3d"jimu/dijit/RadioBtn" data-dojo-props\x3d"group: \'g1\'" type\x3d"radio" name\x3d"jimuradiobtn" id\x3d"fixedRadioButton" checked\r\n                    data-dojo-attach-point\x3d"fixedRadioButton" tabindex\x3d"0" role\x3d"button" aria-label\x3d"${nls.relativeDates.dateTypeLabel}${nls.relativeDates.fixed}"\x3e\r\n                \x3clabel class\x3d"esriCTRadioLabel" for\x3d"fixedRadioButton"\x3e\r\n                    ${nls.relativeDates.fixed}\r\n                \x3c/label\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTRadioBtn"\x3e\r\n                \x3cinput data-dojo-type\x3d"jimu/dijit/RadioBtn" data-dojo-props\x3d"group: \'g1\'" type\x3d"radio" name\x3d"jimuradiobtn" id\x3d"currentRadioButton"  data-dojo-attach-point\x3d"currentRadioButton" tabindex\x3d"0" role\x3d"button" aria-label\x3d"${nls.relativeDates.dateTypeLabel}${nls.relativeDates.current}"\x3e\r\n                \x3clabel class\x3d"esriCTRadioLabel" for\x3d"currentRadioButton"\x3e\r\n                    ${nls.relativeDates.current}\r\n                \x3c/label\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTRadioBtn"\x3e\r\n                \x3cinput data-dojo-type\x3d"jimu/dijit/RadioBtn" data-dojo-props\x3d"group: \'g1\'" type\x3d"radio" name\x3d"jimuradiobtn" id\x3d"PastRadioButton"  data-dojo-attach-point\x3d"PastRadioButton" tabindex\x3d"0" role\x3d"button" aria-label\x3d"${nls.relativeDates.dateTypeLabel}${nls.relativeDates.past}"\x3e\r\n                \x3clabel class\x3d"esriCTRadioLabel" for\x3d"PastRadioButton"\x3e\r\n                    ${nls.relativeDates.past}\r\n                \x3c/label\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTRadioBtn"\x3e\r\n                \x3cinput data-dojo-type\x3d"jimu/dijit/RadioBtn" data-dojo-props\x3d"group: \'g1\'" type\x3d"radio" name\x3d"jimuradiobtn" id\x3d"futureRadioButton"  data-dojo-attach-point\x3d"futureRadioButton" tabindex\x3d"0" role\x3d"button" aria-label\x3d"${nls.relativeDates.dateTypeLabel}${nls.relativeDates.future}"\x3e\r\n                \x3clabel class\x3d"esriCTRadioLabel" for\x3d"futureRadioButton"\x3e\r\n                    ${nls.relativeDates.future}\r\n                \x3c/label\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTRelativeDatesHint" data-dojo-attach-point\x3d"hintForDateType"\x3e${nls.relativeDates.hintForFixedDateType}\x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTLabel" style\x3d"margin-top:10px;" data-dojo-attach-point\x3d"valueLabel"\x3e${nls.relativeDates.valueLabel}\x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTFixedDateContent" data-dojo-attach-point\x3d"fixedDateContent"\x3e\r\n        \x3cdiv class\x3d"esriCTFixedContentWrappper"\x3e\r\n            \x3cdiv class\x3d"esriCTFixedContentLabel"\x3e${nls.date}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTFixedContentDijit"\x3e\r\n                \x3cdiv style\x3d"width:85%" data-dojo-type\x3d"dijit/form/DateTextBox" required\x3d"false" data-dojo-attach-point\x3d"dateTextBox" tabindex\x3d"0" aria-label\x3d"${nls.date}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTFixedContentWrappper"\x3e\r\n            \x3cdiv class\x3d"esriCTFixedContentLabel"\x3e${nls.time}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTFixedContentDijit"\x3e\r\n                \x3cdiv style\x3d"width:85%" data-dojo-type\x3d"dijit/form/TimeTextBox" required\x3d"false" data-dojo-attach-point\x3d"timeTextBox" tabindex\x3d"0" aria-label\x3d"${nls.time}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTHidden" style\x3d"width:100%" data-dojo-attach-point\x3d"currentDateContent"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTHidden esriCTPastOrFutureDateContent" data-dojo-attach-point\x3d"pastOrFutureDateContent"\x3e\r\n        \x3cdiv class\x3d"esriCTMarginForLabel"\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTMarginForLabel"\x3e\r\n            \x3cdiv class\x3d"esriCTFloatLeft"\x3e\r\n                \x3cdiv class\x3d"esriCTValueLabel"\x3e${nls.years}\x3c/div\x3e\r\n                \x3cdiv style\x3d"width:112px" data-dojo-type\x3d"dijit/form/NumberSpinner" required\x3d"true" value\x3d"0"\r\n                    data-dojo-props\x3d"constraints:{min:0,places:0},intermediateChanges:true" data-dojo-attach-point\x3d"yearsTextBox" tabindex\x3d"0"\r\n                    aria-label\x3d"${nls.years}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTFloatLeft"\x3e\r\n                \x3cdiv class\x3d"esriCTValueLabel"\x3e${nls.months}\x3c/div\x3e\r\n                \x3cdiv style\x3d"width:112px" data-dojo-type\x3d"dijit/form/NumberSpinner" required\x3d"true" value\x3d"0"\r\n                    data-dojo-props\x3d"constraints:{min:0,places:0},intermediateChanges:true" data-dojo-attach-point\x3d"monthsTextBox" tabindex\x3d"0"\r\n                    aria-label\x3d"${nls.months}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTFloatLeft"\x3e\r\n                \x3cdiv class\x3d"esriCTValueLabel"\x3e${nls.days}\x3c/div\x3e\r\n                \x3cdiv style\x3d"width:112px" data-dojo-type\x3d"dijit/form/NumberSpinner" required\x3d"true" value\x3d"0"\r\n                    data-dojo-props\x3d"constraints:{min:0,places:0},intermediateChanges:true" data-dojo-attach-point\x3d"daysTextBox" tabindex\x3d"0"\r\n                    aria-label\x3d"${nls.days}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTMarginForLabel" style\x3d"margin-top: 5px;"\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"esriCTMarginForLabel"\x3e\r\n            \x3cdiv class\x3d"esriCTFloatLeft"\x3e\r\n                \x3cdiv class\x3d"esriCTValueLabel"\x3e${nls.hours}\x3c/div\x3e\r\n                \x3cdiv style\x3d"width:112px" data-dojo-type\x3d"dijit/form/NumberSpinner" required\x3d"true" value\x3d"0"\r\n                    data-dojo-props\x3d"constraints:{min:0,places:0},intermediateChanges:true" data-dojo-attach-point\x3d"hoursTextBox" tabindex\x3d"0"\r\n                    aria-label\x3d"${nls.hours}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTFloatLeft"\x3e\r\n                \x3cdiv class\x3d"esriCTValueLabel"\x3e${nls.minutes}\x3c/div\x3e\r\n                \x3cdiv style\x3d"width:112px" data-dojo-type\x3d"dijit/form/NumberSpinner" required\x3d"true" value\x3d"0"\r\n                    data-dojo-props\x3d"constraints:{min:0,places:0},intermediateChanges:true" data-dojo-attach-point\x3d"minutesTextBox" tabindex\x3d"0"\r\n                    aria-label\x3d"${nls.minutes}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriCTFloatLeft"\x3e\r\n                \x3cdiv class\x3d"esriCTValueLabel"\x3e${nls.seconds}\x3c/div\x3e\r\n                \x3cdiv style\x3d"width:112px" data-dojo-type\x3d"dijit/form/NumberSpinner" required\x3d"true" value\x3d"0"\r\n                    data-dojo-props\x3d"constraints:{min:0,places:0},intermediateChanges:true" data-dojo-attach-point\x3d"secondsTextBox" tabindex\x3d"0"\r\n                    aria-label\x3d"${nls.seconds}"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTHidden esriCTDatesWarningContainer" data-dojo-attach-point\x3d"relativeDateWarningContainer"\x3e${nls.relativeDates.relativeDateWarning}\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/RelativeDomains.html":
      '\x3cdiv\x3e\r\n  \x3cfieldset class\x3d"esriCTFieldset"\x3e\r\n    \x3cdiv class\x3d"esriCTDomainFieldsHint"data-dojo-attach-point\x3d"domainFieldsHint"\x3e\x3c/div\x3e\r\n    \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.relativeDomains.fieldSetTitle}\x3c/legend\x3e\r\n    \x3cdiv class\x3d"esriCTTableParentContainer" data-dojo-attach-point\x3d"tableParentContainer"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/fieldset\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/Setting.html":
      '\x3cdiv style\x3d"width:100%; height:100%;"\x3e\r\n    \x3cdiv style\x3d"height:100%;" data-dojo-attach-point\x3d"tabDiv"\x3e\r\n\r\n            \x3cdiv data-dojo-attach-point\x3d"layerSettingTabNode" class\x3d"esriCTTabNode"\x3e\r\n                \x3cdiv data-dojo-attach-point\x3d"breadCrumbContainer" class\x3d"breadCrumbContainer"\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"layerTable" data-dojo-attach-point\x3d"tableLayerInfos"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n\r\n        \x3cdiv data-dojo-attach-point\x3d"smartActionsTabNode" class\x3d"esriCTTabNode"\x3e\r\n            \x3cdiv\x3e\r\n                \x3cfieldset style\x3d"padding:10px;" class\x3d"esriCTFieldSet"\x3e\r\n                    \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.smartActionsPage.definedActions}\x3c/legend\x3e\r\n                    \x3cdiv class\x3d""\x3e\r\n                        \x3cdiv class\x3d"add-with-icon" data-dojo-attach-point\x3d"addNewSmartAction" title\x3d"${nls.smartActionsPage.addNewSmartActionLinkText}"\x3e\r\n                            \x3cspan class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/span\x3e\r\n                            \x3cspan class\x3d"add-label"\x3e\r\n                                ${nls.smartActionsPage.addNewSmartActionLinkText}\x3c/span\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"esriCTSmartActionsTableParent"\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"smartActionsTableNode"\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/fieldset\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n\r\n        \x3c!-- Attribute Actions Tab Settings Starts --\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"attributeActionsTabNode" class\x3d"esriCTTabNode"\x3e\r\n            \x3c!-- intersection actions Table starts --\x3e\r\n            \x3cdiv class\x3d"esriCTAttributeActions"\x3e\r\n                \x3cfieldset style\x3d"padding:10px;" class\x3d"esriCTFieldSet"\x3e\r\n                    \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.actionPage.copyAction.intersection}\x3c/legend\x3e\r\n                    \x3cdiv class\x3d""\x3e\r\n                        \x3cdiv class\x3d"add-with-icon" data-dojo-attach-point\x3d"addIntersectionAction" title\x3d"${nls.smartActionsPage.addNewSmartActionLinkText}"\r\n                            data-dojo-attach-event\x3d"onClick:_onIntersectionBtnClick"\x3e\r\n                            \x3cspan class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/span\x3e\r\n                            \x3cspan class\x3d"add-label"\x3e\r\n                                ${nls.smartActionsPage.addNewSmartActionLinkText}\x3c/span\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"esriCTAttributeActionsTableParent"\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"intersectionActionsTableNode"\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/fieldset\x3e\r\n            \x3c/div\x3e\r\n            \x3c!-- intersection actions Table ends --\x3e\r\n            \x3c!-- Address actions Table starts --\x3e\r\n            \x3cdiv class\x3d"esriCTAttributeActions"\x3e\r\n                \x3cfieldset style\x3d"padding:10px;" class\x3d"esriCTFieldSet"\x3e\r\n                    \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.actionPage.copyAction.address}\x3c/legend\x3e\r\n                    \x3cdiv class\x3d""\x3e\r\n                        \x3cdiv class\x3d"add-with-icon" data-dojo-attach-point\x3d"addAddressAction" title\x3d"${nls.smartActionsPage.addNewSmartActionLinkText}"\r\n                        data-dojo-attach-event\x3d"onClick:_onAddressBtnClick"\x3e\r\n                            \x3cspan class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/span\x3e\r\n                            \x3cspan class\x3d"add-label"\x3e\r\n                                ${nls.smartActionsPage.addNewSmartActionLinkText}\x3c/span\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"esriCTAttributeActionsTableParent"\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"addressActionsTableNode"\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/fieldset\x3e\r\n            \x3c/div\x3e\r\n            \x3c!-- Address actions Table ends --\x3e\r\n            \x3c!-- Coordinates actions Table starts --\x3e\r\n            \x3cdiv class\x3d"esriCTAttributeActions"\x3e\r\n                \x3cfieldset style\x3d"padding:10px;" class\x3d"esriCTFieldSet"\x3e\r\n                    \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.actionPage.copyAction.coordinates}\x3c/legend\x3e\r\n                    \x3cdiv class\x3d""\x3e\r\n                        \x3cdiv class\x3d"add-with-icon" data-dojo-attach-point\x3d"addCoordinateAction" title\x3d"${nls.smartActionsPage.addNewSmartActionLinkText}"\r\n                        data-dojo-attach-event\x3d"onClick:_onCoordinateBtnClick"\x3e\r\n                            \x3cspan class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/span\x3e\r\n                            \x3cspan class\x3d"add-label"\x3e\r\n                                ${nls.smartActionsPage.addNewSmartActionLinkText}\x3c/span\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"esriCTAttributeActionsTableParent"\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"coordinatesActionsTableNode"\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/fieldset\x3e\r\n            \x3c/div\x3e\r\n            \x3c!-- Coordinates actions Table ends --\x3e\r\n            \x3c!-- Preset actions Table starts --\x3e\r\n            \x3cdiv class\x3d"esriCTAttributeActions"\x3e\r\n                \x3cfieldset style\x3d"padding:10px;" class\x3d"esriCTFieldSet"\x3e\r\n                    \x3clegend class\x3d"esriCTLegendTitle"\x3e${nls.actionPage.copyAction.preset}\x3c/legend\x3e\r\n                    \x3cdiv class\x3d""\x3e\r\n                        \x3cdiv class\x3d"add-with-icon" data-dojo-attach-point\x3d"addPresetAction" title\x3d"${nls.smartActionsPage.addNewSmartActionLinkText}"\r\n                            data-dojo-attach-event\x3d"onClick:_onPresetBtnClick"\x3e\r\n                            \x3cspan class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/span\x3e\r\n                            \x3cspan class\x3d"add-label"\x3e\r\n                                ${nls.smartActionsPage.addNewSmartActionLinkText}\x3c/span\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                    \x3cdiv class\x3d"esriCTAttributeActionsTableParent"\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"presetActionsTableNode"\x3e\r\n                        \x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/fieldset\x3e\r\n            \x3c/div\x3e\r\n            \x3c!-- Preset actions Table starts --\x3e\r\n        \x3c/div\x3e\r\n            \x3c!-- Attribute Actions Tab Settings Ends --\x3e\r\n\r\n            \x3cdiv data-dojo-attach-point\x3d"generalSettingTabNode" class\x3d"esriCTTabNode"\x3e\r\n                \x3cdiv class\x3d"buttonSection"\x3e\r\n                    \x3cdiv class\x3d"jimu-btn jimu-trailing-margin1" data-dojo-attach-point\x3d"geocoderSettings"\x3e${nls.layersPage.geocoderSettingsText}\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv style\x3d"overflow: hidden"\x3e\r\n                    \x3cfieldset class\x3d"esriCTFieldSet"\x3e\r\n                        \x3clegend class\x3d"esriCTFieldSetLegend"\x3e${nls.layersPage.featureTemplateLegendLabel}\x3c/legend\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"displayShapeSelector" id\x3d"displayShapeSelector"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.displayShapeSelectorTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"displayShapeSelector" title\x3d"${nls.layersPage.displayShapeSelectorTip}"\x3e${nls.layersPage.displayShapeSelector}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"createNewFeaturesFromExisting" id\x3d"createNewFeaturesFromExisting"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.createNewFeaturesFromExistingTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"createNewFeaturesFromExisting" title\x3d"${nls.layersPage.createNewFeaturesFromExistingTip}"\x3e${nls.layersPage.createNewFeaturesFromExisting}\x3c/label\x3e\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption" style\x3d"text-indent: 25px;"\x3e\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"overrideDefaultsByCopiedFeature" id\x3d"overrideDefaultsByCopiedFeature"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.copiedFeaturesOverrideDefaultsTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"overrideDefaultsByCopiedFeature" title\x3d"${nls.layersPage.copiedFeaturesOverrideDefaultsTip}"\x3e${nls.layersPage.copiedFeaturesOverrideDefaults}\x3c/label\x3e\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"displayPresetTop" id\x3d"displayPresetTop"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.displayPresetTopTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"displayPresetTop" title\x3d"${nls.layersPage.displayPresetTopTip}"\x3e${nls.layersPage.displayPresetTop}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"useFilterEditor" id\x3d"useFilterEditor"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.useFilterEditorTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"useFilterEditor" title\x3d"${nls.layersPage.useFilterEditorTip}"\x3e${nls.layersPage.useFilterEditor}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"keepTemplateSelected" id\x3d"keepTemplateSelected"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.keepTemplateActiveTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"keepTemplateSelected" title\x3d"${nls.layersPage.keepTemplateActiveTip}"\x3e${nls.layersPage.keepTemplateActive}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"listenToGF" id\x3d"listenToGF" data-dojo-type\x3d"dijit/form/CheckBox"\r\n                                title\x3d"${nls.layersPage.listenToGroupFilterTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"listenToGF" title\x3d"${nls.layersPage.listenToGroupFilterTip}"\x3e${nls.layersPage.listenToGroupFilter}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n\r\n                    \x3c/fieldset\x3e\r\n                    \x3cfieldset class\x3d"esriCTFieldSet"\x3e\r\n                        \x3clegend class\x3d"esriCTFieldSetLegend"\x3e${nls.layersPage.saveSettingsLegendLabel}\x3c/legend\x3e\r\n\r\n                        \x3cdiv class\x3d"esriCTButtonPositionsLabel"\x3e${nls.layersPage.buttonPositionsLabel}\x3c/div\x3e\r\n                        \x3cdiv class\x3d"esriCTRadioBtnContainer"\x3e\r\n                            \x3cdiv class\x3d"esriCTRadioBtn"\x3e\r\n                                \x3cinput data-dojo-type\x3d"jimu/dijit/RadioBtn" id\x3d"positionOfSaveButtonBelow"\r\n                                    data-dojo-props\x3d"group: \'g1\'" type\x3d"radio" name\x3d"jimuradiobtn" checked\x3d"true"\r\n                                    data-dojo-attach-point\x3d"positionOfSaveButtonBelow"\x3e\r\n                                \x3clabel class\x3d"esriCTRadioLabel" for\x3d"positionOfSaveButtonBelow"\x3e\r\n                                    ${nls.layersPage.belowEditLabel}\r\n                                \x3c/label\x3e\r\n                            \x3c/div\x3e\r\n                            \x3cdiv class\x3d"esriCTRadioBtn"\x3e\r\n                                \x3cinput data-dojo-type\x3d"jimu/dijit/RadioBtn" id\x3d"positionOfSaveButtonAbove"\r\n                                    data-dojo-props\x3d"group: \'g1\'" type\x3d"radio" name\x3d"jimuradiobtn"\r\n                                    data-dojo-attach-point\x3d"positionOfSaveButtonAbove"\x3e\r\n                                \x3clabel class\x3d"esriCTRadioLabel" for\x3d"positionOfSaveButtonAbove"\x3e\r\n                                    ${nls.layersPage.aboveEditLabel}\r\n                                \x3c/label\x3e\r\n                            \x3c/div\x3e\r\n\r\n\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"displayPromptOnSave" id\x3d"displayPromptOnSave"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.promptOnSaveTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"displayPromptOnSave" title\x3d"${nls.layersPage.promptOnSaveTip}"\x3e${nls.layersPage.promptOnSave}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"displayPromptOnDelete" id\x3d"displayPromptOnDelete"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.promptOnDeleteTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"displayPromptOnDelete" title\x3d"${nls.layersPage.promptOnDeleteTip}"\x3e${nls.layersPage.promptOnDelete}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"autoSaveEdits" id\x3d"autoSaveEdits"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.autoSaveEdits}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"autoSaveEdits" title\x3d"${nls.layersPage.autoSaveEdits}"\x3e${nls.layersPage.autoSaveEdits}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"removeOnSave" id\x3d"removeOnSave" data-dojo-type\x3d"dijit/form/CheckBox"\r\n                                title\x3d"${nls.layersPage.removeOnSaveTip}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"removeOnSave" title\x3d"${nls.layersPage.removeOnSaveTip}"\x3e${nls.layersPage.removeOnSave}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n                        \x3cdiv class\x3d"checkOption" style\x3d"display: inline-block;"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"switchToMultilineInput" id\x3d"multilineCheckBox" data-dojo-type\x3d"dijit/form/CheckBox"\r\n                                title\x3d"${nls.layersPage.switchToMultilineInput}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"multilineCheckBox" title\x3d"${nls.layersPage.switchToMultilineInput}"\x3e${nls.layersPage.switchToMultilineInput}\x3c/label\x3e\r\n                            \x3cdiv class\x3d"esriCTMaxCharacterLimitTextBox"\x3e\r\n                                \x3cdiv data-dojo-attach-point\x3d"maxCharacter" data-dojo-type\x3d"dijit/form/NumberTextBox" trim\x3d"true"\r\n                                    value\x3d"35" data-dojo-props\x3d"constraints: {min:0}" required\x3d"true" style\x3d"width:100%"\x3e\x3c/div\x3e\r\n                            \x3c/div\x3e\r\n                        \x3c/div\x3e\r\n\r\n                    \x3c/fieldset\x3e\r\n                    \x3cfieldset class\x3d"esriCTFieldSet"\x3e\r\n                        \x3clegend class\x3d"esriCTFieldSetLegend"\x3e${nls.layersPage.geometrySettingsLegendLabel}\x3c/legend\x3e\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"editGeometryDefault" id\x3d"editGeometryDefault"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.geometryEditDefault}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"editGeometryDefault" title\x3d"${nls.layersPage.geometryEditDefault}"\x3e${nls.layersPage.geometryEditDefault}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"enableAttributeUpdates" id\x3d"enableAttributeUpdates"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.enableAttributeUpdates}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"enableAttributeUpdates" title\x3d"${nls.layersPage.enableAttributeUpdates}"\x3e${nls.layersPage.enableAttributeUpdates}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption" style\x3d"text-indent: 25px;"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"enableAutomaticAttributeUpdates" id\x3d"enableAutomaticAttributeUpdates"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.enableAutomaticAttributeUpdates}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"enableAutomaticAttributeUpdates" title\x3d"${nls.layersPage.enableAutomaticAttributeUpdates}"\x3e${nls.layersPage.enableAutomaticAttributeUpdates}\x3c/label\x3e\r\n                        \x3c/div\x3e\r\n\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"enableLockingMapNavigation" id\x3d"enableLockingMapNavigation"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.enableLockingMapNavigation}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"enableLockingMapNavigation" title\x3d"${nls.layersPage.enableLockingMapNavigation}"\x3e${nls.layersPage.enableLockingMapNavigation}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"enableMovingSelectedFeatureToGPS" id\x3d"enableMovingSelectedFeatureToGPS"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.enableMovingSelectedFeatureToGPS}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"enableMovingSelectedFeatureToGPS" title\x3d"${nls.layersPage.enableMovingSelectedFeatureToGPS}"\x3e${nls.layersPage.enableMovingSelectedFeatureToGPS}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n\r\n                            \x3cinput class\x3d"check" data-dojo-attach-point\x3d"enableMovingSelectedFeatureToXY" id\x3d"enableMovingSelectedFeatureToXY"\r\n                                data-dojo-type\x3d"dijit/form/CheckBox" title\x3d"${nls.layersPage.enableMovingSelectedFeatureToXY}" /\x3e\r\n                            \x3clabel class\x3d"checkLabel" for\x3d"enableMovingSelectedFeatureToXY" title\x3d"${nls.layersPage.enableMovingSelectedFeatureToXY}"\x3e${nls.layersPage.enableMovingSelectedFeatureToXY}\x3c/label\x3e\r\n\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n                          \x3cdiv class\x3d"esriCTGlobalTleranceParentDiv"\x3e\r\n                            \x3cdiv class\x3d"esriCTGlobalToleranceTextbox"\x3e\r\n                                \x3cdiv data-dojo-attach-point\x3d"globalTolerance" data-dojo-type\x3d"dijit/form/NumberTextBox" trim\x3d"true"\r\n                                    value\x3d"0" data-dojo-props\x3d"constraints: {min:0}" required\x3d"true" style\x3d"width:100%"\x3e\x3c/div\x3e\r\n                            \x3c/div\x3e\r\n\r\n                            \x3cdiv class\x3d"esriCTGlobalToleranceDropbox"\x3e\r\n                                \x3cselect style\x3d"width: 100%;" data-dojo-attach-point\x3d"globalToleranceUnit" data-dojo-type\x3d"dijit/form/Select"\x3e\r\n                                    \x3coption value\x3d"miles"\x3e${nls.units.miles}\x3c/option\x3e\r\n                                    \x3coption value\x3d"kilometers"\x3e${nls.units.kilometers}\x3c/option\x3e\r\n                                    \x3coption value\x3d"meters"\x3e${nls.units.meters}\x3c/option\x3e\r\n                                    \x3coption value\x3d"feet"\x3e${nls.units.feet}\x3c/option\x3e\r\n                                \x3c/select\x3e\r\n                            \x3c/div\x3e\r\n\r\n                            \x3cdiv class\x3d"esriCTLabel esriCTIntersectionToleranceLabel"\x3e${nls.intersectionTolerance.intersectionTitle}\x3c/div\x3e\r\n                          \x3c/div\x3e\r\n                        \x3c/div\x3e\r\n\r\n                        \x3cdiv class\x3d"checkOption"\x3e\r\n                            \x3cdiv class\x3d"esriCTGlobalTleranceParentDiv"\x3e\r\n                                \x3cdiv class\x3d"esriCTGlobalToleranceTextbox"\x3e\r\n                                    \x3cdiv data-dojo-attach-point\x3d"globalPixelsTolerance" data-dojo-type\x3d"dijit/form/NumberTextBox" trim\x3d"true"\r\n                                        value\x3d"20" data-dojo-props\x3d"constraints: {min:0}" required\x3d"true" style\x3d"width:100%"\x3e\x3c/div\x3e\r\n                                \x3c/div\x3e\r\n                                \x3cdiv style\x3d"width: 75%; margin-left: 10px; margin-right: 10px;" class\x3d"esriCTLabel"\x3e\r\n                                    ${nls.intersectionTolerance.pixelsToleranceTitle}\x3c/div\x3e\r\n                            \x3c/div\x3e\r\n                        \x3c/div\x3e\r\n\r\n                    \x3c/fieldset\x3e\r\n                \x3c/div\x3e\r\n\r\n                \x3cdiv class\x3d"edit-description-title" title\x3d"${nls.layersPage.editDescriptionTip}"\x3e${nls.layersPage.editDescription}\x3c/div\x3e\r\n\r\n                \x3cdiv class\x3d"edit-description-box"\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"editorDescription"\x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n\r\n            \x3c/div\x3e\r\n\r\n        \x3c/div\x3e\r\n    \x3cdiv class\x3d"tableInfos-loading" data-dojo-attach-point\x3d"tableInfosLoading"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:widgets/SmartEditor/setting/css/style.css":
      ".jimu-widget-smartEditor-setting-relativeDates .esriCTRadioBtn {width: 25%; float: left; text-indent: 20px; padding: 5px 0px 5px 0px;}.jimu-widget-smartEditor-setting-relativeDates .esriCTLabel,.jimu-widget-smartEditor-setting-relativeDates .esriCTFixedContentWrappper {padding: 5px 0px 5px 0px; width: 100%; overflow: hidden;}.jimu-widget-smartEditor-setting-relativeDates .esriCTValueLabel {margin-bottom: 5px;}.jimu-widget-smartEditor-setting-relativeDates .esriCTPastOrFutureDateContent {width: 100%; margin-left: 20px;}.jimu-rtl .jimu-widget-smartEditor-setting-relativeDates .esriCTPastOrFutureDateContent {margin-left: none; margin-right: 20px;}.jimu-widget-smartEditor-setting-relativeDates .esriCTFixedContentLabel {width: 25%; float: left;}.jimu-widget-smartEditor-setting-relativeDates .esriCTFixedContentDijit {width: 75%; float: right;}.jimu-widget-smartEditor-setting-relativeDates .esriCTFloatLeft {width: 33%; float: left;}.jimu-widget-smartEditor-setting-relativeDates .esriCTFloatRight {width: 33%; float: right;}.jimu-widget-smartEditor-setting-relativeDates .esriCTHidden {display: none;}.jimu-widget-smartEditor-setting-relativeDates .esriCTRadioButtonContainer {width: 100%; height: 30px;}.jimu-widget-smartEditor-setting-relativeDates .esriCTMarginForLabel {width: 100%; padding: 2px 0px 1px 0px; overflow: hidden;}.jimu-widget-smartEditor-setting-relativeDates .esriCTFixedDateContent {text-indent: 20px; width:100%;}.jimu-rtl .jimu-widget-smartEditor-setting-relativeDates .esriCTFloatRight,.jimu-rtl .jimu-widget-smartEditor-setting-relativeDates .esriCTFixedContentDijit {float:left;}.jimu-rtl .jimu-widget-smartEditor-setting-relativeDates .esriCTRadioBtn,.jimu-rtl .jimu-widget-smartEditor-setting-relativeDates .esriCTFixedContentLabel,.jimu-rtl .jimu-widget-smartEditor-setting-relativeDates .esriCTFloatLeft {float: right;}.jimu-widget-smartEditor-setting-relativeDates .esriCTRelativeDatesHint {font-size: 12px; color: #a0acbf; font-style: oblique; width: 100%; margin-top: 5px;}.jimu-widget-smartEditor-setting-relativeDates .esriCTDatesWarningContainer {font-size: 12px; color: red; width: 100%; margin-top: 5px; padding: 5px 0px 5px 0px; overflow: hidden; font-style: italic;}@media (max-width: 600px) {.jimu-widget-smartEditor-setting-relativeDates .esriCTRadioBtn {width: 50%;} .jimu-widget-smartEditor-setting-relativeDates .esriCTFloatLeft {width: 50%;}}@media (max-width: 320px) {.jimu-widget-smartEditor-setting-relativeDates .esriCTRadioBtn {width: 100%;} .jimu-widget-smartEditor-setting-relativeDates .esriCTFloatLeft {width:100%;}}.jimu-widget-smartEditor-setting {margin: 0; padding: 0; font-size: 15px; overflow: hidden;}.esriCTEllipsis {overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}.jimu-widget-smartEditor-setting-address .esriCTHint {margin-top: 10px; float: left; font-size: 12px; color: #a0acbf; font-style: oblique;}.jimu-widget-smartEditor-setting .esriCTHint {float: left; font-size: 12px; color: #a0acbf; font-style: oblique; width: 100%; margin-left: 40px; padding-bottom: 5px;}.jimu-widget-smartEditor-setting .edit-description-box {width: calc(100% - 4px); height: 215px; position: relative; padding-top: 5px;}.jimu-widget-smartEditor-setting .edit-description-title {padding-top: 10px; width: calc(100% - 4px);}.jimu-widget-smartEditor-setting .dijitEditorIFrameContainer {background-color: #ffffff; border: none !important; width: 100% !important; height: 145px !important;}.jimu-widget-smartEditor-setting .warningIcon {background-image: url(../images/warning.png); width: 18px; height: 18px; margin-right: 30px; float: right; background-size: 18px; margin-top: 7px; cursor: pointer;}.jimu-rtl .jimu-widget-smartEditor-setting .warningIcon {margin-right: 0px; margin-left: 30px; float: left;}.jimu-widget-smartEditor-setting .table-field-icon {background-image: url(../images/table.png); width: 16px; height: 16px; margin-left: 5px;}.jimu-widget-smartEditor-setting .table-field-icon:hover {background-image: url(../images/tableHover.png);}.jimu-rtl .jimu-widget-smartEditor-setting .table-field-icon {margin-left: 0; margin-right: 5px;}.jimu-widget-smartEditor-setting .editable {width: 100px;}.jimu-widget-smartEditor-setting .layer {width: auto;}.jimu-widget-smartEditor-setting .update {width: 125px;}.jimu-widget-smartEditor-setting .disable {width: 220px;}.jimu-widget-smartEditor-setting .actions {width: 70px; padding-right: 1px !important;}.jimu-widget-smartEditor-setting .description {width: 90px;}.jimu-widget-smartEditor-setting-fields .required {width: 7px; color: red; padding-left: 0 !important; padding-right: 0 !important;}.jimu-widget-smartEditor-setting-fields .editable {width: 120px;}.jimu-widget-smartEditor-setting-fields .visible {width: 90px;}.jimu-widget-smartEditor-setting-fields .preset {width: 120px;}.jimu-widget-smartEditor-setting-fields .fieldName {width: 190px;}.jimu-widget-smartEditor-setting-fields .fieldLabel {}.jimu-widget-smartEditor-setting-fields .settingsDesc {padding-bottom: 10px; font-size: 14px;}.jimu-widget-smartEditor-setting-fields .settingsNotes {padding-top: 10px; font-size: 14px;}.jimu-widget-smartEditor-setting-fields .actions {width: 80px; padding-right: 2px !important;}.jimu-widget-smartEditor-setting-fields .attachmentsDesc {color: #24B5CC; font-size: small; max-width: 100%; cursor: pointer; padding-top: 10px; float: left;}.jimu-rtl .jimu-widget-smartEditor-setting-fields .attachmentsDesc {float: right;}.jimu-widget-smartEditor-rule-table .rule {width: 185px;}.jimu-widget-smartEditor-rule-table .expression {overflow: hidden;}.jimu-widget-smartEditor-rule-table .actions {width: 100px;}.jimu-widget-smartEditor-rule-table .settingsDesc {font-size: 14px; padding-bottom: 10px;}.jimu-widget-smartEditor-rule-table .settingsNotes {padding-top: 10px; font-size: 14px;}.jimu-widget-smartEditor-rule-table .editGroupHint {margin-top: 5px; padding-top: 5px; float: left; font-size: 12px; color: #a0acbf; font-style: oblique; width: 100%; padding-bottom: 5px;}.jimu-widget-smartEditor-setting .setting-table {width: 100%;}.jimu-widget-smartEditor-setting .setting-table \x3e thead \x3e tr \x3e th, .jimu-widget-smartEditor-setting .setting-table \x3e tbody \x3e tr \x3e td {height: 40px; line-height: 40px; vertical-align: middle;}.jimu-widget-smartEditor-setting .input-table \x3e tbody \x3e tr \x3e .first {width: auto; min-width: 160px; text-align: left;}.jimu-rtl .jimu-widget-smartEditor-setting .input-table \x3e tbody \x3e tr \x3e .first {text-align: right;}.jimu-widget-smartEditor-setting .input-table \x3e tbody \x3e tr \x3e .second {width: auto;}.jimu-widget-smartEditor-setting .input-table \x3e tbody \x3e tr \x3e .second \x3e span {display: inline-block; height: 40px; line-height: 40px;}.jimu-widget-smartEditor-setting .dijitArrowButtonContainer {width: 17px;}.jimu-widget-smartEditor-setting .dijitSelect {height: 30px; width: 100%;}.jimu-widget-smartEditor-setting .checkOption {padding-top: 5px; padding-bottom: 5px; padding-left: 5px;}.jimu-widget-smartEditor-setting .check {margin-left: 15px; margin-right: 5px;}.jimu-widget-smartEditor-setting .esriCTFieldSet {height: auto; width: calc(100% - 4px); border: 1px solid #a0acbf; border-radius: 5px; font-size: 14px; color: #596679; margin: 10px 0px 10px 0px;}.jimu-widget-smartEditor-setting .esriCTFieldSetLegend {margin-left: 15px; font-weight: bold;}.jimu-widget-smartEditor-setting .esriCTButtonPositionsLabel {padding-left: 5px; padding-bottom: 5px; padding-top: 5px; margin-left: 15px; width: 100%;}.jimu-widget-smartEditor-setting .esriCTRadioBtnContainer {margin-left: 20px; display: inline-flex}.jimu-widget-smartEditor-setting .esriCTRadioLabel {vertical-align: top; padding-right: 40px;}.jimu-widget-smartEditor-setting .jimu-image-chooser {right: inherit !important;}.jimu-widget-smartEditor-setting .editor-container .uploaderInsideNode embed {display: none;}jimu-widget-smartEditor-edit-description .jimu-image-chooser {right: inherit !important;}jimu-widget-smartEditor-edit-description .editor-container .uploaderInsideNode embed {display: none;}.jimu-widget-smartEditor-setting a.attDescrip {width: 20px; height: 20px; display: block; background: transparent url(../images/desc.png) center center no-repeat; text-align: center; vertical-align: middle; z-index: 9999;}jimu-widget-smartEditor-setting a.attDescrip:hover {background-image: url(../images/descHover.png);}.jimu-widget-smartEditor-filter-page .submithide {padding-left: 4px; font-size: 12px;}.jimu-widget-smartEditor-filter-page {height: 100%;}.jimu-widget-smartEditor-filter-page \x3e div:nth-child(2) {height: calc(100% - 65px);}.jimu-widget-smartEditor-setting .nextArrowIcon {height: 20px; width: 20px; background-position: center; background-repeat: no-repeat; background-size: 20px; background-image: url(../images/nextArrow.png); float: left;}.jimu-widget-smartEditor-setting .breadCrumbTitle {float: left;}.jimu-rtl .jimu-widget-smartEditor-setting .nextArrowIcon {float: right; -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); -ms-transform: rotate(180deg); -o-transform: rotate(180deg); transform: rotate(180deg);}.jimu-rtl .jimu-widget-smartEditor-setting .breadCrumbTitle {float: right;}.jimu-widget-smartEditor-setting .breadCrumbTitleActive {color: #24B5CC; cursor: pointer;}.jimu-widget-smartEditor-setting .breadCrumbContainer {padding: 0 0 5px 0; width: 100%; float: left; color: #898989; font-family: \"Avenir Medium\";}.jimu-widget-smartEditor-setting .tableInfos-loading {top: 65px; position: relative;}.esriCTCopyAction {height: 15px; width: 15px; background-position: center; background-repeat: no-repeat; background-size: 15px; background-image: url(../images/copy.png); float: left; cursor: pointer; margin-left: 1px;}.esriCTCopyAction:hover {background-image: url(../images/copyHover.png);}.jimu-rtl .esriCTCopyAction {float: right; margin-right: 5px;}.jimu-widget-smartEditor-setting .buttonSection {margin-bottom: 10px;}.jimu-widget-smartEditor-setting-coordinates .esriCTSelectTitle {padding-top: 5px; padding-bottom: 5px;}.jimu-widget-smartEditor-setting-intersection .esriCTIntersectionMainContainer,.jimu-widget-smartEditor-setting-address .esriCTAddressMainContainer{max-height: 500px; padding: 0 5px;}.claro .jimu-widget-smartEditor-setting-intersection .esriCTDropDownContainer .dijitSelect {height: 27px; margin-top: 1px; width: 100%; float: left;}.jimu-widget-smartEditor-setting-intersection .esriCTDropDownContainer {float: left;}.jimu-widget-smartEditor-setting-intersection .esriCTIntersectionTableMaxHeight .jimu-simple-table{max-height: 200px;}.jimu-widget-smartEditor-setting-intersection .jimu-popup \x3e .content {overflow-y: hidden;}.jimu-widget-smartEditor-setting-intersection .esriCTDropDownContainer .dijitSelectLabel {overflow: hidden; width: 200px; float: left;}.jimu-widget-smartEditor-setting-intersection .esriCTDropDownContainer .dijitSelect .dijitInputField {overflow: hidden;}.jimu-widget-smartEditor-setting-intersection .esriCTDropDownContainer .dijitSelectLabel {text-align: left;}.jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTDropDownContainer .dijitSelectLabel {text-align: right;}.jimu-widget-smartEditor-setting-address .esriCTRowContainer, .jimu-widget-smartEditor-setting-intersection .esriCTRowContainer {width: 100%; overflow: hidden; margin-bottom: 10px;}.jimu-widget-smartEditor-setting-address .esriCTlabel, .jimu-widget-smartEditor-setting-intersection .esriCTlabel {width: 30%; padding: 0px 10px 0px 0px; word-break: break-word; float: left; font-size: 14px; color: #596679; line-height: 30px;}.jimu-widget-smartEditor-setting-address .esriCTGroupInfoContainer, .jimu-widget-smartEditor-setting-intersection .esriCTGroupInfoContainer {padding-left: 25px; width: 70%; float: right;}.jimu-rtl .jimu-widget-smartEditor-setting-address .esriCTGroupInfoContainer {float: left}.jimu-widget-smartEditor-setting-intersection .esriCTDataTypeDropdown .dijitSelectLabel {width: 198px;}.claro .jimu-widget-smartEditor-setting-intersection .esriCTDataTypeDropdown .dijitSelect {height: 30px;}.jimu-widget-smartEditor-setting-intersection .esriCTIgnoreLayerRankingLabel {width: 100%; padding: 0px; float: none; line-height: normal;}.jimu-widget-smartEditor-setting-address .esriCTFieldset, .jimu-widget-smartEditor-setting-intersection .esriCTFieldset,.jimu-widget-smartEditor-setting-presetPopup .esriCTFieldset, .jimu-widget-smartEditor-setting-coordinates .esriCTFieldset, .jimu-widget-smartEditor-setting-address .esriCTFieldset, .jimu-widget-smartEditor-setting-relativeDomains .esriCTFieldset{height: auto; width: 100%; border: 1px solid #a0acbf! important; border-radius: 5px; font-size: 14px; color: #596679; min-width: 0px; padding: 10px;}.jimu-widget-smartEditor-setting-address .esriCTLegendTitle, .jimu-widget-smartEditor-setting-intersection .esriCTLegendTitle,.jimu-widget-smartEditor-setting-presetPopup .esriCTLegendTitle, .jimu-widget-smartEditor-setting .esriCTLegendTitle,.jimu-widget-smartEditor-setting-coordinates .esriCTLegendTitle, .jimu-widget-smartEditor-setting-address .esriCTLegendTitle {margin-left: 5px; font-weight: bold;}.jimu-rtl .jimu-widget-smartEditor-setting-address .esriCTLegendTitle, .jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTLegendTitle,.jimu-rtl .jimu-widget-smartEditor-setting-presetPopup .esriCTLegendTitle, .jimu-rtl .jimu-widget-smartEditor-setting .esriCTLegendTitle,.jimu-rtl .jimu-widget-smartEditor-setting-coordinates .esriCTLegendTitle, .jimu-rtl .jimu-widget-smartEditor-setting-address .esriCTLegendTitle {margin-left: 0px; margin-right: 5px;}.jimu-widget-smartEditor-setting-intersection .esriCTToleranceSettingsIcon {background-image: url(../images/settings.png); cursor: pointer; width: 16px; height: 16px; float: right;}.jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTToleranceSettingsIcon {float: left;}.jimu-widget-smartEditor-setting-intersection .esriCTToleranceValueText {height: 25px; width: 85%; float: left; cursor: pointer;}.jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTToleranceValueText {float: right;}.jimu-widget-smartEditor-setting-intersection .esriCTpopupFieldContent {height: 160px; width: 200px;}.jimu-widget-smartEditor-setting-intersection .esriCTPopupLabels {font-size: 14px; color: #596679;}.jimu-widget-smartEditor-setting-intersection .esriCTMargin {margin-top: 10px;}.jimu-widget-smartEditor-setting-intersection .esriCTToleranceUnitDropdown {width: 100%;}.claro .jimu-widget-smartEditor-setting-intersection .esriCTToleranceParentDiv .dijitDropDownButton {margin: 0px;}.claro .jimu-widget-smartEditor-setting-intersection .esriCTToleranceParentDiv .dijitDropDownButton .dijitButtonNode {background: none; border: none; width: 25px; box-shadow: none; padding: 0;}.claro .jimu-widget-smartEditor-setting-intersection .esriCTToleranceParentDiv .dijitArrowButtonInner {display: none;}.jimu-widget-smartEditor-setting-preset .esriCTFieldTitle {padding-top: 5px; padding-bottom: 5px; float: left; width: calc(100% - 20px);}.jimu-rtl .jimu-widget-smartEditor-setting-preset .esriCTFieldTitle {float: right;}.jimu-widget-smartEditor-setting-preset .esriCTDeletePreset {float: right; margin-top: 7px;}.jimu-widget-smartEditor-setting-preset .ee-presetValue-label-header-field, .jimu-widget-smartEditor-setting-preset .field-alias-label {width: 40%;}.jimu-widget-smartEditor-setting-preset .ee-presetValue-value-header-field, .jimu-widget-smartEditor-setting-preset .preset-value-editable {width: 100%; margin-bottom: 6px;}.jimu-widget-smartEditor-setting-preset .ee-inputField {width: 100%;}.jimu-widget-smartEditor-setting-preset .ee-inputFieldTextArea {width: 100%!important; resize: vertical; overflow: auto; font-family: inherit; line-height: 20px !important; font-size: 14px; min-height: 70px;}.jimu-widget-smartEditor-setting-preset .ee-inputFieldRichText {width: 100%!important; margin: 5px auto;}.jimu-widget-smartEditor-setting-preset .esriCTPresetContent {overflow-y: auto; padding-right: 5px; max-height: 500px;}.jimu-rtl .jimu-widget-smartEditor-setting-preset .esriCTPresetContent {padding-right: 0px; padding-left: 5px;}.jimu-widget-smartEditor-setting-preset .esriCTPresetHint {padding-bottom: 10px; font-size: 14px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTFieldSet {width: 100%;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTFieldSetLegend {margin-right: 20px;}.jimu-rtl .jimu-widget-smartEditor-setting .checkOption {padding-right: 5px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTRadioBtnContainer {margin-right: 20px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTRadioLabel {padding-right: 0px; padding-left: 40px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTButtonPositionsLabel {margin-right: 20px; padding-right: 5px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTHint {text-indent: 70px; margin-left: 0px;}.jimu-rtl .jimu-widget-smartEditor-setting .check {margin-right: 15px; margin-left: 5px;}.jimu-widget-smartEditor-setting .esriCTLabel {width: 25%; float: left; margin-top: 6px; font-size: 14px; color: #596679;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTLabel,.jimu-rtl .jimu-widget-smartEditor-setting-address .esriCTlabel,.jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTlabel {float: right;}.jimu-widget-smartEditor-setting .esriCTGlobalTleranceParentDiv {width: calc(100% - 4px); overflow: hidden; clear: both; margin-top: 3px; padding-bottom: 3px;}.jimu-widget-smartEditor-setting .esriCTGlobalToleranceTextbox {width: 10%; float: left; margin-left: 15px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTGlobalToleranceTextbox {float: right; margin-right: 15px;}.jimu-widget-smartEditor-setting .esriCTMaxCharacterLimitTextBox {float: right; margin-left: 10px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTMaxCharacterLimitTextBox {float: left; margin-left: 0px; margin-right: 10px;}.jimu-widget-smartEditor-setting .esriCTGlobalToleranceDropbox {width: 25%; float: left; font-size: 14px; color: #596679; padding-right: 10px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTGlobalToleranceDropbox {float: right; padding-right: 10px;}.jimu-widget-smartEditor-setting-intersection .esriCTToleranceParentDiv {width: 100%;}.jimu-widget-smartEditor-setting .esriCTAddNewSmartActionLink {margin: 0px 10px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTAddNewSmartActionLink {float: right;}.jimu-widget-smartEditor-setting .esriCTSmartActionsTableParent {width: 100%;}.jimu-widget-smartEditor-setting-smartActionGroup .row {clear: both;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTlabel {width: 40%; padding: 0px 10px 0px 0px; word-break: break-word; float: left; min-width: 250px; font-size: 14px; color: #596679; line-height: 30px;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTlabel {padding: 0px 0px 0px 10px; float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTSmartActionsGroupContainer {max-height: 445px; padding: 0 5px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerFieldDropBox {width: 59%; float: left;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerFieldDropBox {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTFieldset {height: auto; width: 100%; border: 1px solid #a0acbf! important; border-radius: 5px; font-size: 14px; color: #596679; min-width: 0px; padding: 10px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTHintCheck {float: left; font-size: 12px; color: #a0acbf; font-style: oblique; line-height: 30px;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTHintCheck {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTExpression {width: 59%; float: left;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTExpression {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLegendTitle,.jimu-widget-smartEditor-setting-presetPopup .esriCTLegendTitle {margin-left: 5px; font-weight: bold;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTLegendTitle,.jimu-widget-smartEditor-setting-presetPopup .esriCTLegendTitle {margin-left: 0px; margin-right: 5px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTHeaderIcon {height: 30px; width: 20px; background-repeat: no-repeat; background-position: center center; display: inline-block; vertical-align: top; margin: 0 5px; cursor: pointer;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTHideCol {background-image: url(../images/hide.png);}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTRequiredCol {background-image: url(../images/required.png);}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTDisableIcon {background-image: url(../images/disable.png);}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableParentContainer,.jimu-widget-smartEditor-setting-presetPopup .esriCTTableParentContainer,.jimu-widget-smartEditor-setting-address .esriCTTableParentContainer,.jimu-widget-smartEditor-setting-relativeDomains .esriCTTableParentContainer {width: 100%;}.jimu-widget-smartEditor-setting-relativeDomains .esriCTDomainFieldsHint{padding-bottom: 10px; font-size: 14px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableMainNode {width: 100%; border-collapse: collapse;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableRow {width: 100%;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerNameRow {line-height: 28px; background-color: #eee;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerFieldRow:hover {background-color: #eee; color: #7989a0;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableTH {background-color: #888888; padding: 0 5px; border-left: 2px solid #fff;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableHeaderTitle {float: left; font-weight: bold; color: white; text-align: left; width: calc(100% - 20px); line-height: 30px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTablePriorityTitle {float: left; text-align: left; width: calc(100% - 20px); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTTablePriorityTitle {text-align: right;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableHeaderTitle {float: right; text-align: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTableHeaderIcon {float: right; height: 30px; width: 20px; background-repeat: no-repeat; background-position: center center; vertical-align: top; cursor: pointer;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityPopupIcon {float: left; height: 30px; width: 20px; background-repeat: no-repeat; background-position: center center; vertical-align: top; cursor: pointer;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityPopupIcon {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerFields {padding-left: 25px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTCheckBoxTD {padding: 0 5px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTCheckBoxMainDiv {float: left;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTCheckBoxMainDiv {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityIconMainDiv, .jimu-widget-smartEditor-setting .esriCTPriorityIconMainDiv {width: 100%;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityIcons, .jimu-widget-smartEditor-setting .esriCTPriorityIcons {float: left; width: 12px; height: 12px; background-size: 12px; background-repeat: no-repeat; margin: 0 10px;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityIcons, .jimu-rtl .jimu-widget-smartEditor-setting .esriCTPriorityIcons {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityEditIcon {float: right; margin-right: 5px; cursor: pointer;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityEditIcon {float: left;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTSearchFieldNode,.jimu-widget-smartEditor-setting-smartActionGroup .esriCTSearchFieldNode {margin-bottom: 10px;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTExistingExpressionDiv,.jimu-widget-smartEditor-setting-smartActionGroup .esriCTExistingExpressionDiv {background-image: url(../images/warning.png); width: 18px; height: 18px; float: left; background-size: 18px; cursor: pointer;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTDomainlistDiv {color: #0000ff; width: 10px; height: 15px; float: left; cursor: pointer; font-size: 20px; font-weight: bold;}.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTDomainlistDiv,.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTExistingExpressionDiv,.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTExistingExpressionDiv {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTHide, .jimu-widget-smartEditor-setting .esriCTHide {background-image: url(../images/hide.png);}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTRequired, .jimu-widget-smartEditor-setting .esriCTRequired {background-image: url(../images/required.png);}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTDisabled, .jimu-widget-smartEditor-setting .esriCTDisabled {background-image: url(../images/disable.png);}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTExpandAllNode,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTExpandAllNode {margin: 5px 0;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTToggleLayerIcon,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTToggleLayerIcon{height: 15px; width: 15px; float: left; background-position: center center; background-repeat: no-repeat; background-size: 15px 15px; cursor: pointer;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTToggleLayerIcon,.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTToggleLayerIcon{float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTToggleLayerCollapsed,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTToggleLayerCollapsed {background-image: url('../images/collapse.png');}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTToggleLayerExpanded,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTToggleLayerExpanded{background-image: url('../images/expand.png');}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerTitle {float: left; margin-left: 5px; font-weight: bold;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerTitle {float: right; margin-left: 0px; margin-right: 5px;}.jimu-widget-smartEditor-setting-address .esriCTHidden, .jimu-widget-smartEditor-setting-intersection .esriCTHidden, .jimu-widget-smartEditor-setting-smartActionGroup .esriCTHidden, .jimu-widget-smartEditor-setting .esriCTHidden,.jimu-widget-smartEditor-setting-presetPopup .esriCTHidden, .jimu-widget-smartEditor-setting-coordinates .esriCTHidden {display: none;}.jimu-widget-smartEditor-setting .esriCTVisibility {visibility: hidden;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTExpressionTextBoxNode {float: left; width: calc(100% - 26px);}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTExpressionTextBoxNode {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTTextBoxNode {width: 100%;}.jimu-widget-smartEditor-setting-smartActionGroup .editExpressionIconNode {float: left; height: 30px; line-height: 30px; padding-left: 10px; padding-top: 3px; cursor: pointer;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .editExpressionIconNode {float: right; padding-left: 0px; padding-right: 10px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerField {float: left; width: 59%;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTLayerField {float: right;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTGroupNameTextBox {width: 100%;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTRowContainer {width: 100%; overflow: hidden; margin-bottom: 10px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTlabelParentContainer {width: 100%; clear: both;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityColumnParentContainer {width: 100%; overflow: hidden;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityColumnParentDiv {clear: both; width: 100%; overflow: hidden;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityNumberDiv {width: 100%; overflow: hidden; height: 17px; color: white;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityOneDiv, .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityTwoDiv, .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityThreeDiv {width: 32px; float: left; padding-left: 8px;}.jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityOneDiv, .jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityTwoDiv, .jimu-rtl .jimu-widget-smartEditor-setting-smartActionGroup .esriCTPriorityThreeDiv {float: right; padding-left: 0px; padding-right: 8px;}.jimu-widget-smartEditor-setting-smartActionGroup .esriCTSubmitAttributeDataText {width: 100%; padding: 0px; float: none; line-height: normal;}.jimu-widget-smartEditor-setting .esriCTDefinedFor {margin-left: 0px;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTDefinedFor {margin-right: 0px; margin-left: 10px;}.jimu-widget-smartEditor-setting .esriCTAttributeActionsTableParent {width: 100%;}.jimu-widget-smartEditor-setting .esriCTAttributeActions {margin-top: 10px;}.jimu-widget-smartEditor-setting .esriCTAttributeActionContainer{margin-bottom: 10px; height: 30px;}.jimu-widget-smartEditor-setting .jimu-tab3 {height: 100%; overflow: hidden;}.jimu-widget-smartEditor-setting .jimu-viewstack {max-height: calc(100% - 45px); overflow: auto;}@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {.jimu-widget-smartEditor-setting .jimu-viewstack {height: calc(100% - 45px);}}.jimu-widget-smartEditor-setting .esriCTTabNode {padding: 10px;}.jimu-widget-smartEditor-setting-presetPopup .esriCTPresetPopUpDiv {max-height: 445px; padding: 0 5px;}.jimu-widget-smartEditor-setting-presetPopup .esriCTWrapper,.jimu-widget-smartEditor-setting-coordinates .esriCTWrapper,.jimu-widget-smartEditor-setting-address .esriCTWrapper{width: 100%; overflow: hidden; margin-bottom: 10px;}.jimu-widget-smartEditor-setting-presetPopup .esriCTPresetPopUpLabel{width: 30%; padding: 0px 10px 0px 0px; word-break: break-word; float: left; font-size: 14px; color: #596679; line-height: 30px;}.jimu-rtl .jimu-widget-smartEditor-setting-presetPopup .esriCTPresetPopUpLabel,.jimu-rtl .jimu-widget-smartEditor-setting-coordinates .esriCTCoordinatePopUpLabel,.jimu-rtl.jimu-widget-smartEditor-setting-address .esriCTAddressPopuplabel {float: right;}.jimu-widget-smartEditor-setting-presetPopup .esriCTPresetPopupdijitWrapper {width: 50%; float: left; padding-bottom: 5px;}.jimu-widget-smartEditor-setting-presetPopup .esriCTPresetValueTime{margin-top: 2px;}.jimu-rtl .jimu-widget-smartEditor-setting-presetPopup .esriCTPresetPopupdijitWrapper,.jimu-rtl .jimu-widget-smartEditor-setting-coordinates .esriCTCoordinatePopupdijitWrapper {float: right;}.jimu-widget-smartEditor-setting-presetPopup .esriCTSelectValueBtn {float: left; margin-left: 10px; line-height: 28px;}.jimu-rtl .jimu-widget-smartEditor-setting-presetPopup .esriCTSelectValueBtn {float: right; margin-right: 10px;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTOverrideForPreset {max-height: 205px; overflow-y: auto;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTLayerMainDiv{padding-top: 5px; background-color: #eee;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTLayercheckBox{padding-left: 25px; font-weight: bold;}.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTLayercheckBox{padding-right: 25px}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTFieldsDiv{padding-left: 5px;}.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTFieldsDiv{padding-right: 5px}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTDomainlistDiv,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTExistingExpressionDiv {margin-right: 4px;}.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTDomainlistDiv,.jimu-rtl .jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTExistingExpressionDiv {margin-left: 4px;}.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .esriCTVisibilityHidden {visibility: hidden;}.jimu-widget-smartEditor-setting-chooseFromLayer .esriCTPopUpLabel {width: 30%; padding: 0px 10px 0px 0px; word-break: break-word; float: left; font-size: 14px; color: #596679; line-height: 30px;}.jimu-rtl .jimu-widget-smartEditor-setting-chooseFromLayer .esriCTPopUpLabel{float: right}.jimu-widget-smartEditor-setting-chooseFromLayer .esriCTWrapper {width: 100%; overflow: hidden; margin-bottom: 5px; padding-bottom: 5px;}.jimu-widget-smartEditor-setting-chooseFromLayer .esriCTPopupSelect {width: 70%; float:right;}.jimu-rtl .jimu-widget-smartEditor-setting-chooseFromLayer .esriCTPopupSelect{float: left;}.jimu-widget-smartEditor-setting-coordinates .esriCTCoordianteDijitMainWrapper{width: 100%;}.jimu-widget-smartEditor-setting-coordinates .esriCTCoordinatePopUpLabel {width: 40%; padding: 0px 10px 0px 0px; word-break: break-word; float: left; font-size: 14px; color: #596679; line-height: 30px;}.jimu-widget-smartEditor-setting-coordinates .esriCTCoordinatePopupdijitWrapper{width: 60%; float: left; padding-bottom: 5px;}.jimu-widget-smartEditor-setting-intersection .esriCTIntersectionGroupName {width: 50%; float: left;}.jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTIntersectionGroupName {float: right;}.jimu-widget-smartEditor-setting-intersection .esriCTIntersectionDatatype {width: 50%; float: right;}.jimu-rtl .jimu-widget-smartEditor-setting-intersection .esriCTIntersectionDatatype {float: left;}.jimu-widget-smartEditor-setting-coordinates .esriCTCoordinateWidth,.jimu-widget-smartEditor-setting-address .esriCTAddressWidth {width: 70%;}.jimu-widget-smartEditor-setting-coordinates .esriCTFullWidth,.jimu-widget-smartEditor-setting-address .esriCTFullWidth,.jimu-widget-smartEditor-setting-intersection esriCTFullWidth{width: 100%;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle-group,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle-group {padding: 5px;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle-group .checkbox-inline,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle-group .checkbox-inline {padding-left: 36px; vertical-align: top;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle-group .switch-toggle.dijitCheckBox,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle-group .switch-toggle.dijitCheckBox {margin-left: -36px;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle.dijitCheckBox,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle.dijitCheckBox {height: 16px; width: 28px; border: 0 none; background: #adadad; position: relative; display: inline-block; cursor: pointer; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius: 10px; margin-left: 2px;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle.dijitCheckBox:before,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle.dijitCheckBox:before {content: \"\"; background: #f8f8f8; position: absolute; padding: 0; height: 12px; width: 12px; left: auto; right: 14px; top: 2px; z-index: 1; -webkit-transition: right 0.3s; -moz-transition: right 0.3s; -o-transition: right 0.3s; transition: right 0.3s; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle.dijitCheckBox input,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle.dijitCheckBox input {width: 100%; height: 100%; position: absolute; left: 0; z-index: 2;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle.dijitCheckBox.dijitCheckBoxChecked,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle.dijitCheckBox.dijitCheckBoxChecked {background: #50ad4e;}.jimu-widget-smartEditor-setting-smartActionGroup .switch-toggle.dijitCheckBox.dijitCheckBoxChecked:before,.jimu-widget-smartEditor-setting-layersAndFieldsApplyOn .switch-toggle.dijitCheckBox.dijitCheckBoxChecked:before {right: 2px;}.jimu-widget-smartEditor-setting .esriCTIntersectionToleranceLabel {width: 60%;}.jimu-rtl .jimu-widget-smartEditor-setting .esriCTIntersectionToleranceLabel {margin-right: 10px;}",
    "*now": function(l) {
      l([
        'dojo/i18n!*preload*widgets/SmartEditor/setting/nls/Setting*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'
      ]);
    },
    "*noref": 1
  }
});
define("dojo/_base/declare dijit/_WidgetsInTemplateMixin jimu/BaseWidgetSetting jimu/dijit/SimpleTable jimu/LayerInfos/LayerInfos dojo/_base/lang dojo/on dojo/query dijit/registry dojo/_base/array ./EditFields ./EditDescription ./SmartActionGroup ../utils dijit/Editor dojo/dom-style dojo/dom-attr dojo/dom-class dojo/sniff jimu/utils dojo/_base/html jimu/dijit/_GeocodeServiceChooserContent jimu/dijit/Popup esri/request esri/lang jimu/dijit/Message jimu/dijit/LoadingShelter jimu/dijit/LoadingIndicator jimu/dijit/TabContainer3 dojo/dom-construct dojo/promise/all dojo/Deferred jimu/portalUtils ./Intersection ./Coordinates ./Address ./Preset ../presetBuilderBackwardCompatibility jimu/dijit/LayerChooserFromMap dijit/_editor/plugins/LinkDialog dijit/_editor/plugins/ViewSource dijit/_editor/plugins/FontChoice dojox/editor/plugins/Preview dijit/_editor/plugins/TextColor dojox/editor/plugins/ToolbarLineBreak dojox/editor/plugins/FindReplace dojox/editor/plugins/PasteFromWord dojox/editor/plugins/InsertAnchor dojox/editor/plugins/Blockquote dojox/editor/plugins/UploadImage jimu/dijit/EditorChooseImage jimu/dijit/EditorTextColor jimu/dijit/EditorBackgroundColor dijit/form/CheckBox jimu/dijit/RadioBtn".split(
  " "
), function(
  l,
  n,
  h,
  m,
  f,
  a,
  c,
  b,
  e,
  d,
  q,
  k,
  r,
  t,
  u,
  g,
  p,
  x,
  w,
  v,
  A,
  E,
  C,
  F,
  D,
  y,
  z,
  H,
  J,
  B,
  G,
  N,
  M,
  O,
  Q,
  I,
  P,
  K,
  R
) {
  return l([h, n], {
    baseClass: "jimu-widget-smartEditor-setting",
    _jimuLayerInfos: null,
    _layersTable: null,
    _configInfos: null,
    _editFields: null,
    _currentTableIds: [],
    _currentConfigInfoInTable: null,
    _configuredGeocoderSettings: {},
    _configuredPresetInfos: {},
    _totalLayers: [],
    postMixInProperties: function() {
      this.nls.units = {};
      a.mixin(this.nls.units, window.jimuNls.units);
    },
    postCreate: function() {
      this.nls = a.mixin(this.nls, window.jimuNls.common);
      this.nls = a.mixin(this.nls, window.jimuNls.timeUnit);
      this._configuredGeocoderSettings = {};
      this._configuredPresetInfos = {};
      this._currentTableIds = [];
      this._totalLayers = [];
      this._initTabs();
      this._createLayerChooserFromMap();
    },
    _processConfig: function() {
      var b;
      !this.config.editor.hasOwnProperty("presetInfos") &&
        this.config.editor.layerInfos &&
        ((b = this.config.editor.layerInfos),
        d.forEach(
          b,
          a.hitch(this, function(b) {
            b.fieldValues = {};
            d.forEach(
              b.fieldInfos,
              a.hitch(this, function(c) {
                var d;
                c.hasOwnProperty("canPresetValue") &&
                  c.canPresetValue &&
                  ((d = [
                    { actionName: "Intersection", enabled: !1 },
                    { actionName: "Address", enabled: !1 },
                    { actionName: "Coordinates", enabled: !1 },
                    { actionName: "Preset", enabled: !0 }
                  ]),
                  (b.fieldValues[c.fieldName] = a.clone(d)),
                  (this._configuredPresetInfos[c.fieldName] = []));
              })
            );
          })
        ),
        (this.config.editor.presetInfos = this._configuredPresetInfos));
      K.createPresetGroups(this.config, this._jimuLayerInfos);
    },
    startup: function() {
      this.inherited(arguments);
      f.getInstance(this.map, this.map.itemInfo).then(
        a.hitch(this, function(a) {
          this._jimuLayerInfos = a;
          this._processConfig();
          this._init();
          this.setConfig();
          this._initEditor();
        })
      );
    },
    destroy: function() {
      this._jimuLayerInfos = null;
      delete this._jimuLayerInfos;
      this._layersTable = null;
      delete this._layersTable;
      this._configInfos = null;
      delete this._configInfos;
      this._editFields = null;
      delete this._editFields;
      this._editDescriptions = null;
      delete this._editDescriptions;
      this.inherited(arguments);
    },
    _init: function() {
      this._initSettings();
      this._initLayersTable();
      this.own(
        c(
          this.addNewSmartAction,
          "click",
          a.hitch(this, function() {
            this._configureGroupSmartAction();
          })
        )
      );
      this._initsmartActionsTable();
      this._initAllAttributeActions();
    },
    _initTabs: function() {
      this.tab = new J({
        tabs: [
          {
            title: this.nls.layersPage.layerSettings,
            content: this.layerSettingTabNode
          },
          {
            title: this.nls.layersPage.smartActionsTabTitle,
            content: this.smartActionsTabNode
          },
          {
            title: this.nls.layersPage.attributeActionsTabTitle,
            content: this.attributeActionsTabNode
          },
          {
            title: this.nls.layersPage.generalSettings,
            content: this.generalSettingTabNode
          }
        ]
      });
      this.own(
        c(
          this.tab,
          "tabChanged",
          a.hitch(this, function() {
            this.tab.containerNode.scrollTop = 0;
          })
        )
      );
      this.tab.placeAt(this.tabDiv);
      this.own(
        c(
          this.geocoderSettings,
          "click",
          a.hitch(this, function() {
            this._openServiceChooser(!0);
          })
        )
      );
    },
    _initLayersTable: function() {
      var d = {
        fields: [
          {
            name: "edit",
            title: this.nls.layersPage.layerSettingsTable.edit,
            type: "checkbox",
            class: "editable"
          },
          {
            name: "label",
            title: this.nls.layersPage.layerSettingsTable.label,
            type: "text",
            class: "layer"
          },
          {
            name: "allowUpdateOnly",
            title: this.nls.layersPage.layerSettingsTable.allowUpdateOnly,
            type: "checkbox",
            class: "update"
          },
          {
            name: "allowDelete",
            title: this.nls.layersPage.layerSettingsTable.allowDelete,
            type: "checkbox",
            class: "update"
          },
          {
            name: "disableGeometryUpdate",
            title: this.nls.layersPage.layerSettingsTable.update,
            type: "checkbox",
            class: "disable"
          },
          {
            name: "specialType",
            type: "extension",
            title: this.nls.layersPage.layerSettingsTable.description,
            create: a.hitch(this, this._createSpecialType),
            setValue: a.hitch(this, this._setValue4SpecialType),
            getValue: a.hitch(this, this._getValueOfSpecialType),
            class: "description"
          },
          {
            name: "actions",
            title: this.nls.actions,
            type: "actions",
            class: "actions",
            actions: ["edit"]
          },
          { name: "allowUpdateOnlyHidden", type: "checkbox", hidden: !0 },
          { name: "allowDeleteHidden", type: "checkbox", hidden: !0 },
          { name: "disableGeometryUpdateHidden", type: "checkbox", hidden: !0 }
        ],
        selectable: !1
      };
      this._layersTable = new m(d);
      this._layersTable.placeAt(this.tableLayerInfos);
      this._layersTable.startup();
      this._addBreadCrumb(this.nls.layersPage.allLayers, !0);
      b("th.simple-table-field", this._layersTable.domNode).forEach(function(
        a
      ) {
        switch (
          void 0 === a.innerText || "" === a.innerText
            ? ""
            : a.innerText.replace(/(\r\n|\n|\r)/gm, "")
        ) {
          case this.nls.layersPage.layerSettingsTable.edit:
            a.title = this.nls.layersPage.layerSettingsTable.editTip;
            a.alt = this.nls.layersPage.layerSettingsTable.editTip;
            break;
          case this.nls.layersPage.layerSettingsTable.label:
            a.title = this.nls.layersPage.layerSettingsTable.labelTip;
            a.alt = this.nls.layersPage.layerSettingsTable.labelTip;
            break;
          case this.nls.layersPage.layerSettingsTable.allowUpdateOnly:
            a.title = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
            a.alt = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
            break;
          case this.nls.layersPage.layerSettingsTable.allowDelete:
            a.title = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
            a.alt = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
            break;
          case this.nls.layersPage.layerSettingsTable.update:
            a.title = this.nls.layersPage.layerSettingsTable.updateTip;
            a.alt = this.nls.layersPage.layerSettingsTable.updateTip;
            break;
          case this.nls.layersPage.layerSettingsTable.description:
            a.title = this.nls.layersPage.layerSettingsTable.descriptionTip;
            a.alt = this.nls.layersPage.layerSettingsTable.descriptionTip;
            break;
          case this.nls.actions:
            (a.title = this.nls.layersPage.layerSettingsTable.actionsTip),
              (a.alt = this.nls.layersPage.layerSettingsTable.actionsTip);
        }
      },
      this);
      this.own(
        c(
          this._layersTable,
          "actions-edit",
          a.hitch(this, this._onEditFieldInfoClick)
        )
      );
    },
    _createSpecialType: function(b) {
      var d = A.create("a", { class: "attDescrip" }, b);
      this.own(
        c(
          d,
          "click",
          a.hitch(this, function() {
            this._onDescriptionClick(b.parentNode);
          })
        )
      );
    },
    _setValue4SpecialType: function() {},
    _getValueOfSpecialType: function() {},
    _initSettings: function() {
      this.useFilterEditor.set("checked", this.config.editor.useFilterEditor);
      this.config.editor.hasOwnProperty("displayShapeSelector")
        ? this.displayShapeSelector.set(
            "checked",
            this.config.editor.displayShapeSelector
          )
        : this.displayShapeSelector.set("checked", !1);
      this.config.editor.hasOwnProperty("createNewFeaturesFromExisting")
        ? this.createNewFeaturesFromExisting.set(
            "checked",
            this.config.editor.createNewFeaturesFromExisting
          )
        : this.createNewFeaturesFromExisting.set("checked", !1);
      this.config.editor.hasOwnProperty("overrideDefaultsByCopiedFeature")
        ? this.overrideDefaultsByCopiedFeature.set(
            "checked",
            this.config.editor.overrideDefaultsByCopiedFeature
          )
        : this.overrideDefaultsByCopiedFeature.set("checked", !1);
      this.own(
        c(
          this.createNewFeaturesFromExisting,
          "click",
          a.hitch(this, function() {
            this.createNewFeaturesFromExisting.get("checked") ||
              this.overrideDefaultsByCopiedFeature.set("checked", !1);
          })
        )
      );
      this.own(
        c(
          this.overrideDefaultsByCopiedFeature,
          "click",
          a.hitch(this, function() {
            this.overrideDefaultsByCopiedFeature.get("checked") &&
              this.createNewFeaturesFromExisting.set("checked", !0);
          })
        )
      );
      this.config.editor.hasOwnProperty("displayPresetTop")
        ? this.displayPresetTop.set(
            "checked",
            this.config.editor.displayPresetTop
          )
        : this.displayPresetTop.set("checked", !1);
      this.displayPromptOnSave.set(
        "checked",
        this.config.editor.displayPromptOnSave
      );
      this.displayPromptOnDelete.set(
        "checked",
        this.config.editor.displayPromptOnDelete
      );
      this.removeOnSave.set("checked", this.config.editor.removeOnSave);
      this.config.editor.hasOwnProperty("listenToGF")
        ? this.listenToGF.set("checked", this.config.editor.listenToGF)
        : this.listenToGF.set("checked", !1);
      this.config.editor.hasOwnProperty("keepTemplateSelected")
        ? this.keepTemplateSelected.set(
            "checked",
            this.config.editor.keepTemplateSelected
          )
        : this.keepTemplateSelected.set("checked", !1);
      this.config.editor.hasOwnProperty("editGeometryDefault")
        ? this.editGeometryDefault.set(
            "checked",
            this.config.editor.editGeometryDefault
          )
        : this.editGeometryDefault.set("checked", !1);
      this.config.editor.hasOwnProperty("autoSaveEdits")
        ? this.autoSaveEdits.set("checked", this.config.editor.autoSaveEdits)
        : this.autoSaveEdits.set("checked", !1);
      this.config.editor.hasOwnProperty("enableAttributeUpdates")
        ? this.enableAttributeUpdates.set(
            "checked",
            this.config.editor.enableAttributeUpdates
          )
        : this.enableAttributeUpdates.set("checked", !1);
      this.own(
        c(
          this.autoSaveEdits,
          "click",
          a.hitch(this, function() {
            this.autoSaveEdits.get("checked")
              ? this.removeOnSave.set("checked", !0)
              : this.removeOnSave.set("checked", !1);
          })
        )
      );
      this.config.editor.hasOwnProperty("enableAutomaticAttributeUpdates")
        ? this.enableAutomaticAttributeUpdates.set(
            "checked",
            this.config.editor.enableAutomaticAttributeUpdates
          )
        : this.enableAutomaticAttributeUpdates.set("checked", !1);
      this.own(
        c(
          this.enableAttributeUpdates,
          "click",
          a.hitch(this, function() {
            this.enableAttributeUpdates.get("checked") ||
              this.enableAutomaticAttributeUpdates.set("checked", !1);
          })
        )
      );
      this.own(
        c(
          this.enableAutomaticAttributeUpdates,
          "click",
          a.hitch(this, function() {
            this.enableAutomaticAttributeUpdates.get("checked") &&
              this.enableAttributeUpdates.set("checked", !0);
          })
        )
      );
      this.config.editor.hasOwnProperty("enableLockingMapNavigation")
        ? this.enableLockingMapNavigation.set(
            "checked",
            this.config.editor.enableLockingMapNavigation
          )
        : this.enableLockingMapNavigation.set("checked", !1);
      this.config.editor.hasOwnProperty("enableMovingSelectedFeatureToGPS")
        ? this.enableMovingSelectedFeatureToGPS.set(
            "checked",
            this.config.editor.enableMovingSelectedFeatureToGPS
          )
        : this.enableMovingSelectedFeatureToGPS.set("checked", !1);
      this.config.editor.hasOwnProperty("enableMovingSelectedFeatureToXY")
        ? this.enableMovingSelectedFeatureToXY.set(
            "checked",
            this.config.editor.enableMovingSelectedFeatureToXY
          )
        : this.enableMovingSelectedFeatureToXY.set("checked", !1);
      this.config.editor.hasOwnProperty("showActionButtonsAbove")
        ? this.positionOfSaveButtonBelow.set(
            "checked",
            !this.config.editor.showActionButtonsAbove
          )
        : this.positionOfSaveButtonBelow.set("checked", !0);
      this.config.editor.hasOwnProperty("showActionButtonsAbove")
        ? this.positionOfSaveButtonAbove.set(
            "checked",
            this.config.editor.showActionButtonsAbove
          )
        : this.positionOfSaveButtonAbove.set("checked", !1);
      this.config.editor.hasOwnProperty("canSwitchToMultilineInput")
        ? this.switchToMultilineInput.set(
            "checked",
            this.config.editor.canSwitchToMultilineInput
          )
        : this.switchToMultilineInput.set("checked", !1);
    },
    setConfig: function() {
      var b = new H({ hidden: !1 }).placeAt(this.tableInfosLoading);
      this._fetchDefaultGeocoder().then(
        a.hitch(this, function(c) {
          this._getTableInfos().then(
            a.hitch(this, function() {
              this._configInfos = t.getConfigInfos(
                this._jimuLayerInfos,
                this.config.editor.layerInfos,
                !1,
                !1
              );
              var e = {};
              this.config.editor.layerInfos &&
                0 < this.config.editor.layerInfos.length &&
                (d.forEach(this.config.editor.layerInfos, function(a) {
                  a.hasOwnProperty("_editFlag") || (a._editFlag = !0);
                  e[a.featureLayer.id] = a._editFlag;
                }),
                d.forEach(this._configInfos, function(a) {
                  e.hasOwnProperty(a.featureLayer.id)
                    ? (a._editFlag = e[a.featureLayer.id])
                    : (a._editFlag = !1);
                }));
              d.forEach(this._configInfos, function(a) {
                a.fieldValidations || (a.fieldValidations = {});
              });
              this._configuredGeocoderSettings = this.config.geocoderSettings
                ? a.clone(this.config.geocoderSettings)
                : c;
              this._configuredPresetInfos = this.config.editor.presetInfos
                ? a.clone(this.config.editor.presetInfos)
                : {};
              this._currentConfigInfoInTable = this._configInfos;
              this._setLayersTable(this._configInfos, !1);
              this.config.editor.defaultToleranceSettings
                ? (this.globalTolerance.set(
                    "value",
                    this.config.editor.defaultToleranceSettings.value
                  ),
                  this.globalToleranceUnit.set(
                    "value",
                    this.config.editor.defaultToleranceSettings.unit
                  ))
                : (this.globalTolerance.set("value", 0),
                  this.globalToleranceUnit.set("value", "meters"));
              this.config.editor.hasOwnProperty("defaultPixelsTolerance") &&
                this.globalPixelsTolerance.set(
                  "value",
                  this.config.editor.defaultPixelsTolerance
                );
              this.config.editor.maxLimitToMultilineTextBox ||
              0 === this.config.editor.maxLimitToMultilineTextBox
                ? this.maxCharacter.set(
                    "value",
                    this.config.editor.maxLimitToMultilineTextBox
                  )
                : this.maxCharacter.set("value", 35);
              setTimeout(
                a.hitch(this, function() {
                  this.resize();
                  b.destroy();
                }),
                200
              );
            })
          );
        })
      );
    },
    _fetchOrgsHelperServiecs: function() {
      var b = new N();
      this.appConfig.portalUrl && "" !== a.trim(this.appConfig.portalUrl)
        ? M.getPortalSelfInfo(this.appConfig.portalUrl).then(
            a.hitch(this, function(a) {
              a = a && a.helperServices;
              var c = "";
              a &&
                a.geocode &&
                0 < a.geocode.length &&
                a.geocode[0].url &&
                (c = a.geocode[0].url);
              b.resolve(c);
            }),
            a.hitch(this, function() {
              b.resolve("");
            })
          )
        : b.resolve("");
      return b.promise;
    },
    _fetchDefaultGeocoder: function() {
      var b = new N();
      this._fetchOrgsHelperServiecs().then(
        a.hitch(this, function(c) {
          var d = {};
          F({
            url: c,
            content: { f: "json" },
            handleAs: "json",
            callbackParamName: "callback"
          }).then(
            a.hitch(this, function(e) {
              e &&
                e.candidateFields &&
                ((d.url = c), (d.fields = a.clone(e.candidateFields)));
              b.resolve(d);
            }),
            a.hitch(this, function() {
              b.resolve(d);
            })
          );
        })
      );
      return b.promise;
    },
    _getTableInfos: function() {
      var a = [],
        b = this._jimuLayerInfos.getTableInfoArray();
      d.forEach(
        b,
        function(b) {
          a.push(b.getLayerObject());
        },
        this
      );
      return G(a);
    },
    _setLayersTable: function(f, h) {
      var k = null,
        l = !1;
      if (h && this._currentTableIds && 0 < this._currentTableIds.length) {
        var m;
        m = this._configInfos;
        d.forEach(
          this._currentTableIds,
          function(a, b) {
            d.some(m, function(b) {
              if (b.featureLayer.id === a) return (m = b), !0;
            });
            1 < this._currentTableIds.length &&
              b + 1 < this._currentTableIds.length &&
              (m = m.relationshipInfos);
          },
          this
        );
        m.relationshipInfos = f;
      }
      this._currentConfigInfoInTable = f;
      d.forEach(
        f,
        function(f) {
          var m = this._layersTable.addRow({
            label: f.layerInfo.title,
            edit: f._editFlag ? !0 : !1,
            allowUpdateOnly: f.allowUpdateOnly,
            allowUpdateOnlyHidden:
              null === f.allowUpdateOnly ? !1 : f.allowUpdateOnly,
            allowDelete: f.allowDelete,
            allowDeleteHidden: null === f.allowDelete ? !1 : f.allowDelete,
            disableGeometryUpdate: h ? !0 : f.disableGeometryUpdate,
            disableGeometryUpdateHidden:
              null === f.disableGeometryUpdate ? !1 : f.disableGeometryUpdate
          });
          f.layerInfo.isTable && (l = !0);
          m.tr._configInfo = f;
          m.tr._layerId = f.layerInfo.layerObject.id;
          !1 === f.featureLayer.layerAllowsDelete &&
            ((k = b(".allowDelete", m.tr)),
            k.forEach(function(a) {
              e.getEnclosingWidget(a.childNodes[0]).setStatus(!1);
            }));
          !1 === f.featureLayer.layerAllowsCreate &&
            ((k = b(".allowUpdateOnly", m.tr)),
            k.forEach(function(a) {
              e.getEnclosingWidget(a.childNodes[0]).setStatus(!1);
            }));
          k = b(".allowUpdateOnly", m.tr);
          k.forEach(function(a) {
            a = e.getEnclosingWidget(a.childNodes[0]);
            !1 === f.featureLayer.layerAllowsUpdate && a.setStatus(!1);
            h && !f.layerInfo.isTable && (a.setValue(!0), a.setStatus(!1));
          });
          k = b(".disableGeometryUpdate", m.tr);
          k.forEach(function(a) {
            a = e.getEnclosingWidget(a.childNodes[0]);
            !1 === f.featureLayer.layerAllowGeometryUpdates && a.setStatus(!1);
            h && (a.setValue(!0), a.setStatus(!1));
          });
          !1 === f.featureLayer.layerAllowsUpdate &&
            !1 === f.featureLayer.layerAllowsCreate &&
            ((k = b(".edit, .disableGeometryUpdate", m.tr)),
            k.forEach(function(a) {
              a = e.getEnclosingWidget(a.childNodes[0]);
              a.setValue(!1);
              a.setStatus(!1);
            }));
          var n = this._layersTable._getThCheckBox("disableGeometryUpdate");
          n && (h ? (n.setValue(!1), n.setStatus(!1)) : n.setStatus(!0));
          if (h && !f.layerInfo.isTable) {
            var n = b(".edit, .editable", m.tr)[0],
              p = B.create("div", {
                class: "warningIcon",
                style: "display:none",
                title: this.nls.layersPage.layerSettingsTable.allowUpdateOnly
              });
            B.place(p, n, "first");
            n = e.getEnclosingWidget(n.childNodes[1]);
            this.own(
              c(
                n,
                "change",
                a.hitch(this, function(a) {
                  a
                    ? g.set(p, "display", "block")
                    : g.set(p, "display", "none");
                })
              )
            );
            !0 === f._editFlag && g.set(p, "display", "block");
          }
          f.relationshipInfos && 0 !== f.relationshipInfos.length
            ? (n = f.relationshipInfos)
            : ((n = this._getRelatedTableInfo(f.layerInfo.layerObject)),
              (f.relationshipInfos = n),
              d.forEach(f.relationshipInfos, function(a) {
                a._editFlag = !1;
              }));
          0 < n.length &&
            (n[0].layerInfo ||
              ((n = t.getConfigInfos(this._jimuLayerInfos, n, !1, !0, !0)),
              d.forEach(f.relationshipInfos, function(a) {
                a.hasOwnProperty("_editFlag") || (a._editFlag = !1);
              })),
            this._addTableFieldActionIcon(m.tr, n));
          b(
            ".jimu-icon-edit",
            m.tr
          )[0].title = this.nls.layersPage.layerSettingsTable.fieldsTip;
          if ((m = this._layersTable._getThCheckBox("allowUpdateOnly")))
            h && !l ? (m.setValue(!1), m.setStatus(!1)) : m.setStatus(!0);
        },
        this
      );
    },
    _onDescriptionClick: function(a) {
      var b = this._layersTable.getRowData(a);
      b &&
        b.edit &&
        ((this._editDescriptions = new k({
          nls: this.nls,
          _configInfo: a._configInfo,
          _layerName: b.label
        })),
        this._editDescriptions.popupEditDescription());
    },
    _onEditFieldInfoClick: function(b) {
      var e = this._layersTable.getRowData(b);
      e && e.edit
        ? ((this._editFields = new q({
            nls: this.nls,
            _configInfo: b._configInfo,
            _layerName: e.label,
            _geocoderSettings: this._configuredGeocoderSettings,
            _configuredPresetInfos: this._configuredPresetInfos,
            layerInfos: this._jimuLayerInfos,
            isRelatedLayer: 1 <= this._currentTableIds.length ? !0 : !1,
            map: this.map,
            _smartActionsTable: this._smartActionsTable,
            _attributeActionsTable: {
              Intersection: this._intersectionActionGroupTable,
              Address: this._addressActionGroupTable,
              Coordinates: this._coordinatesActionGroupTable,
              Preset: this._presetActionGroupTable
            },
            _tab: this.tab
          })),
          this._editFields.popupEditPage(),
          this.own(
            c(
              this._editFields,
              "SetGeocoder",
              a.hitch(this, this._openServiceChooser)
            )
          ),
          this.own(
            c(
              this._editFields,
              "RemoveFromGroup",
              a.hitch(this, function(a) {
                a &&
                  (d.forEach(
                    a.smartActionGroupInfo,
                    function(a) {
                      this._removeFromGroup(a);
                    },
                    this
                  ),
                  d.forEach(
                    a.attributeActionGroupInfo,
                    function(a) {
                      this._removeFromAttributeActionGroup(a);
                    },
                    this
                  ));
              })
            )
          ))
        : new y({ message: this.nls.layersPage.editFieldError });
    },
    _getText: function() {
      return this._editorObj.focusNode.innerHTML;
    },
    _initEditor: function() {
      if (!this._editorObj)
        if (
          (this._initEditorPluginsCSS(),
          (this._editorObj = new u(
            {
              plugins: [
                "bold",
                "italic",
                "underline",
                v.getEditorTextColor("smartEditor"),
                v.getEditorBackgroundColor("smartEditor"),
                "|",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "|",
                "insertOrderedList",
                "insertUnorderedList",
                "indent",
                "outdent"
              ],
              extraPlugins: [
                "|",
                "createLink",
                "unlink",
                "pastefromword",
                "|",
                "undo",
                "redo",
                "|",
                "viewSource",
                "toolbarlinebreak",
                {
                  name: "dijit._editor.plugins.FontChoice",
                  command: "fontName",
                  custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(
                    ";"
                  )
                },
                "fontSize",
                "formatBlock"
              ],
              style: "font-family:Verdana;"
            },
            this.editorDescription
          )),
          g.set(this._editorObj.domNode, { width: "100%", height: "100%" }),
          void 0 === this.config.editor.editDescription ||
          null === this.config.editor.editDescription
            ? this._editorObj.set("value", this.nls.layersPage.title)
            : this._editorObj.set("value", this.config.editor.editDescription),
          this._editorObj.startup(),
          8 !== w("ie"))
        )
          this._editorObj.resize({ w: "100%", h: "100%" });
        else {
          var a = A.getMarginBox(this.editorDescription);
          this._editorObj.resize({ w: a.w, h: a.h });
        }
    },
    _initEditorPluginsCSS: function() {
      var a, c;
      a = document.getElementsByTagName("head")[0];
      c = window.apiUrl + "dojox/editor/plugins/resources/css/TextColor.css";
      b('link[href\x3d"' + c + '"]', a)[0] ||
        v.loadStyleLink("editor_plugins_resources_TextColor", c);
      c = window.apiUrl + "dojox/editor/plugins/resources/editorPlugins.css";
      b('link[href\x3d"' + c + '"]', a)[0] ||
        v.loadStyleLink("editor_plugins_resources_editorPlugins", c);
      c =
        window.apiUrl + "dojox/editor/plugins/resources/css/PasteFromWord.css";
      b('link[href\x3d"' + c + '"]', a)[0] ||
        v.loadStyleLink("editor_plugins_resources_PasteFromWord", c);
    },
    _resetSettingsConfig: function() {
      this.config.editor.displayPromptOnSave =
        void 0 === this.displayPromptOnSave.checked
          ? !1
          : this.displayPromptOnSave.checked;
      this.config.editor.displayPromptOnDelete =
        void 0 === this.displayPromptOnDelete.checked
          ? !1
          : this.displayPromptOnDelete.checked;
      this.config.editor.removeOnSave =
        void 0 === this.removeOnSave.checked ? !1 : this.removeOnSave.checked;
      this.config.editor.canSwitchToMultilineInput =
        void 0 === this.switchToMultilineInput.checked
          ? !1
          : this.switchToMultilineInput.checked;
      this.config.editor.useFilterEditor =
        void 0 === this.useFilterEditor.checked
          ? !1
          : this.useFilterEditor.checked;
      this.config.editor.displayShapeSelector =
        void 0 === this.displayShapeSelector.checked
          ? !1
          : this.displayShapeSelector.checked;
      this.config.editor.createNewFeaturesFromExisting =
        void 0 === this.createNewFeaturesFromExisting.checked
          ? !1
          : this.createNewFeaturesFromExisting.checked;
      this.config.editor.overrideDefaultsByCopiedFeature =
        void 0 === this.overrideDefaultsByCopiedFeature.checked
          ? !1
          : this.overrideDefaultsByCopiedFeature.checked;
      this.config.editor.displayPresetTop =
        void 0 === this.displayPresetTop.checked
          ? !1
          : this.displayPresetTop.checked;
      this.config.editor.listenToGF =
        void 0 === this.listenToGF.checked ? !1 : this.listenToGF.checked;
      this.config.editor.keepTemplateSelected =
        void 0 === this.keepTemplateSelected.checked
          ? !1
          : this.keepTemplateSelected.checked;
      this.config.editor.editGeometryDefault =
        void 0 === this.editGeometryDefault.checked
          ? !1
          : this.editGeometryDefault.checked;
      this.config.editor.autoSaveEdits =
        void 0 === this.autoSaveEdits.checked ? !1 : this.autoSaveEdits.checked;
      this.config.editor.enableAttributeUpdates =
        void 0 === this.enableAttributeUpdates.checked
          ? !1
          : this.enableAttributeUpdates.checked;
      this.config.editor.enableAutomaticAttributeUpdates =
        void 0 === this.enableAutomaticAttributeUpdates.checked
          ? !1
          : this.enableAutomaticAttributeUpdates.checked;
      this.config.editor.enableLockingMapNavigation =
        void 0 === this.enableLockingMapNavigation.checked
          ? !1
          : this.enableLockingMapNavigation.checked;
      this.config.editor.enableMovingSelectedFeatureToGPS =
        void 0 === this.enableMovingSelectedFeatureToGPS.checked
          ? !1
          : this.enableMovingSelectedFeatureToGPS.checked;
      this.config.editor.enableMovingSelectedFeatureToXY =
        void 0 === this.enableMovingSelectedFeatureToXY.checked
          ? !1
          : this.enableMovingSelectedFeatureToXY.checked;
      this.config.editor.showActionButtonsAbove = this.positionOfSaveButtonAbove
        .checked
        ? !0
        : !1;
    },
    _getConfigForCurrentDisplayedLayers: function() {
      if (this._currentConfigInfoInTable) {
        var a = this._layersTable.getData();
        d.forEach(
          this._currentConfigInfoInTable,
          function(b, c) {
            b._editFlag = a[c].edit;
            b.allowUpdateOnly =
              null === a[c].allowUpdateOnly
                ? a[c].allowUpdateOnlyHidden
                : a[c].allowUpdateOnly;
            b.allowDelete =
              null === a[c].allowDelete
                ? a[c].allowDeleteHidden
                : a[c].allowDelete;
            b.disableGeometryUpdate =
              null === a[c].disableGeometryUpdate
                ? a[c].disableGeometryUpdateHidden
                : a[c].disableGeometryUpdate;
          },
          this
        );
      }
    },
    _getCurrentConfigInfo: function(a) {
      var b = [];
      d.forEach(
        a,
        function(a) {
          a.hasOwnProperty("featureLayer") &&
            (a.featureLayer.hasOwnProperty("layerAllowsCreate") &&
              delete a.featureLayer.layerAllowsCreate,
            a.featureLayer.hasOwnProperty("layerAllowsUpdate") &&
              delete a.featureLayer.layerAllowsUpdate,
            a.featureLayer.hasOwnProperty("layerAllowsDelete") &&
              delete a.featureLayer.layerAllowsDelete,
            a.featureLayer.hasOwnProperty("layerAllowGeometryUpdates") &&
              delete a.featureLayer.layerAllowGeometryUpdates);
          a.fieldInfos = this._resetFieldInfos(a.fieldInfos);
          if (a.hasOwnProperty("fieldValidations"))
            for (var c in a.fieldValidations)
              a.fieldValidations.hasOwnProperty(c) &&
                d.forEach(a.fieldValidations[c], function(a) {
                  a.hasOwnProperty("expression") && delete a.expression;
                });
          a.layerInfo && delete a.layerInfo;
          b.push(a);
          a.relationshipInfos &&
            0 < a.relationshipInfos.length &&
            (a.relationshipInfos = this._getCurrentConfigInfo(
              a.relationshipInfos
            ));
        },
        this
      );
      return b;
    },
    getConfig: function() {
      if (!this.globalTolerance.isValid())
        return new y({ message: this.nls.layersPage.toleranceErrorMsg }), !1;
      if (!this.globalPixelsTolerance.isValid())
        return (
          new y({ message: this.nls.layersPage.pixelsToleranecErrorMsg }), !1
        );
      if (!this.maxCharacter.isValid() || isNaN(this.maxCharacter.get("value")))
        return (
          new y({ message: this.nls.layersPage.invalidMaxCharacterErrorMsg }),
          !1
        );
      this._resetSettingsConfig();
      this.config.editor.editDescription = this._getText();
      this.config.editor.defaultToleranceSettings = {
        value: this.globalTolerance.getValue(),
        unit: this.globalToleranceUnit.getValue()
      };
      this.config.editor.defaultPixelsTolerance = this.globalPixelsTolerance.get(
        "value"
      );
      this.config.editor.maxLimitToMultilineTextBox = this.maxCharacter.getValue();
      this._getConfigForCurrentDisplayedLayers();
      var b = this._getCurrentConfigInfo(this._configInfos);
      if (0 === b.length)
        return (
          new y({ message: this.nls.layersPage.noConfigedLayersError }), !1
        );
      this.config.editor.layerInfos = b;
      this._configuredGeocoderSettings &&
      this._configuredGeocoderSettings.hasOwnProperty("url")
        ? (this.config.geocoderSettings = a.clone(
            this._configuredGeocoderSettings
          ))
        : (this.config.geocoderSettings = null);
      this.config.editor.presetInfos = {};
      this.config.smartActionGroups = this._getSmartActionGroupConfig();
      return this.config;
    },
    _resetFieldInfos: function(a) {
      return d.map(a, function(a) {
        var b = {};
        b.fieldName = void 0 === a.fieldName ? "" : a.fieldName;
        b.isEditable = void 0 === a.isEditable ? !0 : a.isEditable;
        b.visible = void 0 === a.visible ? !0 : a.visible;
        return b;
      });
    },
    _getRelatedTableInfo: function(b) {
      var c = [],
        e;
      b &&
        ((e = b.url.substr(0, b.url.lastIndexOf("/") + 1)),
        (b = a.clone(b.relationships)),
        (b = d.filter(b, function(a) {
          return "esriRelRoleDestination" !== a.role;
        })),
        d.forEach(
          b,
          a.hitch(this, function(b) {
            var f = !1;
            d.forEach(
              this.map.webMapResponse.itemInfo.itemData.tables,
              a.hitch(this, function(a) {
                var d;
                a &&
                  a.url &&
                  a.url.replace(/.*?:\/\//g, "") ===
                    (e + b.relatedTableId).replace(/.*?:\/\//g, "") &&
                  (a = this._jimuLayerInfos.getLayerOrTableInfoById(a.id)) &&
                  ((a = t.getConfigInfo(a, {})),
                  (a.relationshipId = b.id),
                  (d = this._getSmartActionsForRelation(a.featureLayer.id)) ||
                    (d = {}),
                  (a.fieldValidations = d),
                  (d = this._getAttributeActionsForRelation(
                    a.featureLayer.id
                  )) || (d = {}),
                  (a.fieldValues = d),
                  c.push(a),
                  (f = !0));
              })
            );
            f ||
              d.forEach(
                this.map.webMapResponse.itemInfo.itemData.operationalLayers,
                a.hitch(this, function(a) {
                  var d;
                  a &&
                    a.url &&
                    a.url.replace(/.*?:\/\//g, "") ===
                      (e + b.relatedTableId).replace(/.*?:\/\//g, "") &&
                    (a = this._jimuLayerInfos.getLayerOrTableInfoById(a.id)) &&
                    ((a = t.getConfigInfo(a, {})),
                    (a.relationshipId = b.id),
                    (d = this._getSmartActionsForRelation(a.featureLayer.id)) ||
                      (d = {}),
                    (a.fieldValidations = d),
                    (d = this._getAttributeActionsForRelation(
                      a.featureLayer.id
                    )) || (d = {}),
                    (a.fieldValues = d),
                    c.push(a));
                })
              );
          })
        ));
      return c;
    },
    _addTableFieldActionIcon: function(d, e) {
      var f, h;
      f = b(".action-item-parent", d)[0];
      h = b(".jimu-icon-edit", d)[0];
      b(".action-item-parent", d)[0] &&
        g.set(b(".action-item-parent", d)[0], "width", "60px");
      b(".actions-td.simple-table-cell", d);
      d.tableFieldDiv = B.create(
        "div",
        {
          class:
            "action-item jimu-float-leading row-edit-div jimu-icon table-field-icon",
          title: this.nls.layersPage.layerSettingsTable.relationTip
        },
        f
      );
      B.place(d.tableFieldDiv, h, "after");
      this.own(
        c(
          d.tableFieldDiv,
          "click",
          a.hitch(this, function() {
            var a = this._layersTable.getRowData(d);
            this._getConfigForCurrentDisplayedLayers();
            this._addBreadCrumb(a.label);
            this._currentTableIds.push(d._layerId);
            this._layersTable.clear();
            this._updateValidationsAccordingToGroups(e);
            this._setLayersTable(e, !0);
          })
        )
      );
    },
    _updateValidationsAccordingToGroups: function(a) {
      var b, c;
      this._currentTableIds &&
        0 < this._currentTableIds.length &&
        ((b = this._configInfos),
        d.some(
          this._currentTableIds,
          function(a, c) {
            d.some(b, function(c) {
              if (c.featureLayer.id === a) return (b = c), !0;
            });
            1 < this._currentTableIds.length &&
              c + 1 < this._currentTableIds.length &&
              (b = b.relationshipInfos);
          },
          this
        ));
      b &&
        b.relationshipInfos &&
        ((c = b.relationshipInfos),
        c.length === a.length &&
          d.forEach(
            a,
            function(a) {
              d.some(c, function(b) {
                if (b.featureLayer.id === a.featureLayer.id)
                  return (
                    (a.fieldValidations = b.fieldValidations),
                    (a.fieldValues = b.fieldValues),
                    !0
                  );
              });
            },
            this
          ));
    },
    _addBreadCrumb: function(d, e) {
      var f, g;
      f = B.create("div", {}, this.breadCrumbContainer);
      c(
        f,
        "click",
        a.hitch(this, function(a) {
          this._onBreadCrumbSectionClick(f, a);
        })
      );
      (g = b(".breadCrumbTitle", this.domNode)) &&
        0 < g.length &&
        x.add(g[g.length - 1], "breadCrumbTitleActive");
      e
        ? p.set(f, "breadIndex", -1)
        : (B.create("div", { class: "nextArrowIcon" }, f),
          p.set(f, "breadIndex", this._currentTableIds.length));
      B.create("div", { class: "breadCrumbTitle", innerHTML: d }, f);
    },
    _onBreadCrumbSectionClick: function(a, c) {
      var e;
      a = b(".breadCrumbTitle", a)[0];
      if (x.contains(a, "breadCrumbTitleActive")) {
        e = parseInt(p.get(c.currentTarget, "breadIndex"), 10);
        c = b("div[breadIndex]").length;
        x.remove(a, "breadCrumbTitleActive");
        for (a = e + 1; a <= c; a++)
          B.destroy(b("div[breadIndex\x3d" + a + "]")[0]);
        if (this._currentTableIds && 0 < this._currentTableIds.length) {
          var f;
          f = this._configInfos;
          d.some(
            this._currentTableIds,
            function(a, b) {
              if (e + 1 === b) return !0;
              d.some(f, function(b) {
                if (b.featureLayer.id === a) return (f = b), !0;
              });
              1 < this._currentTableIds.length &&
                b + 1 < this._currentTableIds.length &&
                (f = f.relationshipInfos);
            },
            this
          );
          this._getConfigForCurrentDisplayedLayers();
          this._currentTableIds.splice(e + 1, this._currentTableIds.length);
          this._layersTable.clear();
          this._setLayersTable(f, -1 === e ? !1 : !0);
        }
      }
    },
    _openServiceChooser: function(b) {
      var d;
      d = "";
      this._configuredGeocoderSettings &&
        this._configuredGeocoderSettings.url &&
        (d = this._configuredGeocoderSettings.url);
      this.serviceChooserContent = new E({ url: d });
      this.geocoderPopupShelter = new z({ hidden: !0 });
      d = B.create("div");
      B.create(
        "div",
        {
          innerHTML: this.nls.geocoderPage.hintMsg,
          style: { "font-size": "14px", "padding-bottom": "5px" }
        },
        d
      );
      d.appendChild(this.serviceChooserContent.domNode);
      this.geocoderPopup = new C({
        titleLabel: this.nls.geocoderPage.setGeocoderURL,
        autoHeight: !0,
        content: d,
        container: window.jimuConfig.layoutId,
        width: 640
      });
      this.geocoderPopupShelter.placeAt(this.geocoderPopup.domNode);
      A.setStyle(this.serviceChooserContent.domNode, "width", "580px");
      A.addClass(
        this.serviceChooserContent.domNode,
        "override-geocode-service-chooser-content"
      );
      this.serviceChooserContent.own(
        c(
          this.serviceChooserContent,
          "validate-click",
          a.hitch(this, function() {
            A.removeClass(
              this.serviceChooserContent.domNode,
              "override-geocode-service-chooser-content"
            );
          })
        )
      );
      this.serviceChooserContent.own(
        c(
          this.serviceChooserContent,
          "ok",
          a.hitch(this, function(a) {
            this._onSelectLocatorUrlOk(a, b);
          })
        )
      );
      this.serviceChooserContent.own(
        c(
          this.serviceChooserContent,
          "cancel",
          a.hitch(this, "_onSelectLocatorUrlCancel")
        )
      );
    },
    _onSelectLocatorUrlOk: function(b, c) {
      b &&
        b[0] &&
        b[0].url &&
        this.domNode &&
        (this.geocoderPopupShelter.show(),
        F({
          url: b[0].url,
          content: { f: "json" },
          handleAs: "json",
          callbackParamName: "callback"
        }).then(
          a.hitch(this, function(e) {
            this.geocoderPopupShelter.hide();
            e && e.candidateFields
              ? ((this._configuredGeocoderSettings.url = b[0].url),
                (this._configuredGeocoderSettings.fields = a.clone(
                  e.candidateFields
                )),
                d.forEach(this._configuredGeocoderSettings.fields, function(a) {
                  delete a.localizedNames;
                }),
                this.geocoderPopup &&
                  (this.geocoderPopup.close(), (this.geocoderPopup = null)),
                c || this._editFields.geocoderConfigured())
              : new y({ message: this.nls.locatorWarning });
          }),
          a.hitch(this, function() {
            this.geocoderPopupShelter.hide();
            new y({
              message: D.substitute(
                { URL: this._getRequestUrl(b[0].url) },
                a.clone(this.nls.invalidUrlTip)
              )
            });
          })
        ));
    },
    _onSelectLocatorUrlCancel: function() {
      this.geocoderPopup &&
        (this.geocoderPopup.close(), (this.geocoderPopup = null));
    },
    _initsmartActionsTable: function() {
      this._smartActionsTable = new m({
        fields: [
          {
            name: "name",
            title: this.nls.smartActionsPage.smartActionsTable.name,
            type: "text",
            width: "25%"
          },
          {
            name: "expression",
            title: this.nls.smartActionsPage.smartActionsTable.expression,
            type: "text",
            width: "50%"
          },
          {
            name: "definedOn",
            title: this.nls.smartActionsPage.smartActionsTable.definedFor,
            type: "empty",
            width: "15%"
          },
          {
            name: "actions",
            title: this.nls.actions,
            type: "actions",
            class: "actions",
            width: "10%",
            actions: ["edit", "delete"]
          }
        ],
        selectable: !1
      });
      this.own(
        c(
          this._smartActionsTable,
          "actions-edit",
          a.hitch(this, this._configureGroupSmartAction)
        )
      );
      this._smartActionsTable.onBeforeRowDelete = a.hitch(
        this,
        this._onDeleteSmartActionsClick
      );
      this._smartActionsTable.placeAt(this.smartActionsTableNode);
      this._smartActionsTable.startup();
      this.config.smartActionGroups && this._populateSmartActionGroups();
    },
    _getSmartActionGroupConfig: function() {
      var a,
        b = {};
      this._smartActionsTable &&
        (a = this._smartActionsTable.getRows()) &&
        0 < a.length &&
        d.forEach(a, function(a) {
          a._configInfo && (b[a._configInfo.name] = a._configInfo);
        });
      return b;
    },
    _populateSmartActionGroups: function() {
      for (var a in this.config.smartActionGroups)
        this._addSmartActionGroupRow(this.config.smartActionGroups[a]);
    },
    _onDeleteSmartActionsClick: function(b) {
      var c = new C({
        titleLabel: this.nls.smartActionsPage.deleteGroupPopupTitle,
        width: 450,
        maxHeight: 445,
        autoHeight: !0,
        content: this.nls.smartActionsPage.deleteGroupPopupMsg,
        class: this.baseClass,
        buttons: [
          {
            label: this.nls.ok,
            onClick: a.hitch(this, function() {
              this._configureGroupSmartAction(b, !0);
              c.close();
              this._smartActionsTable.deleteRow(b);
            })
          },
          {
            label: this.nls.cancel,
            classNames: ["jimu-btn-vacation"],
            onClick: a.hitch(this, function() {
              c.close();
            })
          }
        ]
      });
    },
    _removeFromGroup: function(a) {
      if (
        this.config.smartActionGroups &&
        this.config.smartActionGroups[a.groupName]
      ) {
        var b = this.config.smartActionGroups[a.groupName];
        b.appliedOn[a.layerId] &&
          ((b.appliedOn[a.layerId][a.fieldName][a.action] = !1),
          this._updateSmartActionTablesDefiendForCol(a.groupName));
      }
      this._removeGroupNameFromLayerFields(a);
    },
    _updateSmartActionTablesDefiendForCol: function(a) {
      if (this._smartActionsTable) {
        var b = this._smartActionsTable.getRows(),
          c = this.config.smartActionGroups[a];
        d.some(
          b,
          function(b) {
            if (this._smartActionsTable.getRowData(b).name === a) {
              var d = this._checkPriorityStatus(c);
              this._addDefinedFor(d, b);
              return !0;
            }
          },
          this
        );
      }
    },
    _removeGroupNameFromLayerFields: function(a) {
      var b,
        c = [];
      if (
        (c = this._getLayersFieldValidations(c, this._configInfos, a.layerId))
      )
        for (var e = 0; e < c.length; e++)
          if ((b = c[e]))
            for (var f in b)
              b &&
                b[f] &&
                f === a.fieldName &&
                d.some(
                  b[f],
                  function(b) {
                    if (
                      b &&
                      a.action === b.actionName &&
                      b.filter &&
                      b.filter.hasOwnProperty("smartActionGroupName") &&
                      b.filter.smartActionGroupName === a.groupName
                    )
                      return delete b.filter.smartActionGroupName, !0;
                  },
                  this
                );
    },
    _getLayersFieldValidations: function(a, b, c) {
      d.forEach(
        b,
        function(b) {
          b.featureLayer &&
            b.featureLayer.id === c &&
            b.fieldValidations &&
            (a || (a = []), a.push(b.fieldValidations));
          b.relationshipInfos &&
            (a = this._getLayersFieldValidations(a, b.relationshipInfos, c));
        },
        this
      );
      return a;
    },
    _configureGroupSmartAction: function(b, d) {
      var e = {
        nls: this.nls,
        map: this.map,
        filterInfo: { filter: "" },
        layerForExpression: "",
        name: "",
        prevName: null,
        submitWhenHidden: !1,
        appliedOn: null,
        existingGroupNames: [],
        _configInfos: this._configInfos,
        _jimuLayerInfos: this._jimuLayerInfos,
        editUtils: t
      };
      this.config.smartActionGroups &&
        (e.existingGroupNames = Object.keys(this.config.smartActionGroups));
      e.existingGroups = this._getSmartActionGroupConfig();
      b &&
        ((e.appliedOn = b._configInfo.appliedOn),
        (e.submitWhenHidden = b._configInfo.submitWhenHidden),
        (e.name = b._configInfo.name),
        (e.prevName = a.clone(b._configInfo.name)),
        (e.filterInfo = b._configInfo.filterInfo),
        (e.layerForExpression = b._configInfo.layerForExpression));
      e = new r(e);
      this.own(
        c(
          e,
          "groupInfoUpdated",
          a.hitch(this, function(a) {
            b
              ? ((b._configInfo = a),
                this._smartActionsTable.editRow(b, {
                  name: a.name,
                  expression: a.filterInfo.expression
                }))
              : this._addSmartActionGroupRow(a);
            this.config.smartActionGroups = this._getSmartActionGroupConfig();
            this._updateSmartActionTablesDefiendForColForAllRows();
          })
        )
      );
      d
        ? (this.config.smartActionGroups.hasOwnProperty(e.name) &&
            delete this.config.smartActionGroups[e.name],
          e.deleteGroup())
        : e.showDialog();
    },
    _addSmartActionGroupRow: function(a) {
      var b = this._smartActionsTable.addRow({
        name: a.name,
        expression: a.filterInfo.expression
      });
      b.success &&
        ((b.tr._configInfo = a),
        (a = this._checkPriorityStatus(a)),
        this._addDefinedFor(a, b.tr));
    },
    _updateSmartActionTablesDefiendForColForAllRows: function() {
      if (this._smartActionsTable) {
        var a = this._smartActionsTable.getRows();
        d.forEach(
          a,
          function(a) {
            var b = this._checkPriorityStatus(a._configInfo);
            this._addDefinedFor(b, a);
            return !0;
          },
          this
        );
      }
    },
    _addDefinedFor: function(a, c) {
      var d, e, f;
      (c = b(".simple-table-cell", c)[2]) && B.empty(c);
      c = B.create("div", { class: "esriCTPriorityIconMainDiv" }, c);
      d = !0;
      for (e in a)
        d
          ? ((d = !1),
            (f = "esriCTPriorityIcons esriCT" + e + " esriCTDefinedFor"))
          : (f = "esriCTPriorityIcons esriCT" + e),
          a[e] || (f += " esriCTVisibility"),
          B.create(
            "div",
            { class: f, title: this.nls.actionPage.actions[e.toLowerCase()] },
            c
          );
    },
    _checkPriorityStatus: function(a) {
      var b, c, d, e;
      for (e in a.appliedOn) {
        for (var f in a.appliedOn[e])
          if (
            (b || (b = a.appliedOn[e][f].Hide),
            c || (c = a.appliedOn[e][f].Required),
            d || (d = a.appliedOn[e][f].Disabled),
            b && c && d)
          )
            break;
        if (b && c && d) break;
      }
      return { Hide: b, Required: c, Disabled: d };
    },
    _getFieldValidationsFromGroup: function(b, c, d) {
      var e = {},
        f;
      for (f in b.appliedOn[c]) {
        var g, h;
        h = d && d[f] ? d[f] : null;
        if (
          b.appliedOn[c][f].Hide ||
          b.appliedOn[c][f].Required ||
          b.appliedOn[c][f].Disabled
        )
          h ||
            (h = [
              { actionName: "Hide" },
              { actionName: "Required" },
              { actionName: "Disabled" }
            ]),
            (e[f] = h);
        g = {
          submitWhenHidden: !1,
          filter: a.clone(b.filterInfo.filter),
          expression: b.filterInfo.filter.expr
        };
        g.filter.smartActionGroupName = b.name;
        b.appliedOn[c][f].Hide &&
          ((h[0] = a.mixin(h[0], g)),
          (h[0].submitWhenHidden = b.submitWhenHidden));
        b.appliedOn[c][f].Required && (h[1] = a.mixin(h[1], g));
        b.appliedOn[c][f].Disabled && (h[2] = a.mixin(h[2], g));
      }
      return e;
    },
    _getSmartActionsForRelation: function(a) {
      var b;
      if (this.config.smartActionGroups)
        for (var c in this.config.smartActionGroups)
          this.config.smartActionGroups[c].appliedOn.hasOwnProperty(a) &&
            (b = this._getFieldValidationsFromGroup(
              this.config.smartActionGroups[c],
              a,
              b
            ));
      return b;
    },
    _getFieldValuesFromGroup: function(a, b, c) {
      var d = {},
        e;
      for (e in a.appliedOn[b]) {
        var f;
        f = c && c[e] ? c[e] : null;
        -1 < a.appliedOn[b].indexOf(e) &&
          (f ||
            (f = [
              { actionName: "Intersection", enabled: !1, fields: [] },
              { actionName: "Address", enabled: !1 },
              {
                actionName: "Coordinates",
                enabled: !1,
                coordinatesSystem: "MapSpatialReference",
                field: "x"
              },
              {
                actionName: "Preset",
                enabled: !0,
                attributeActionGroupName: a.name
              }
            ]),
          (d[e] = f));
      }
      return d;
    },
    _getAttributeActionsForRelation: function(a) {
      var b;
      if (
        this.config.attributeActionGroups &&
        this.config.attributeActionGroups.Preset
      )
        for (var c in this.config.attributeActionGroups.Preset)
          this.config.attributeActionGroups.Preset[c].appliedOn.hasOwnProperty(
            a
          ) &&
            (b = this._getFieldValuesFromGroup(
              this.config.attributeActionGroups.Preset[c],
              a,
              b
            ));
      return b;
    },
    _createLayerChooserFromMap: function() {
      var a;
      a = this._createLayerChooserMapArgs();
      this._layerChooserFromMap = new R(a);
      this._layerChooserFromMap.startup();
      a = this._layerChooserFromMap.layerInfosObj.getLayerInfoArray();
      var b = this._layerChooserFromMap.layerInfosObj.getTableInfoArray();
      b && 0 < b.length && (a = a.concat(b));
      this._getAllFilteredLayers(a, []);
    },
    _createLayerChooserMapArgs: function() {
      return {
        multiple: !1,
        createMapResponse: this.map.webMapResponse,
        filter: this._createFiltersForLayerSelector()
      };
    },
    _createFiltersForLayerSelector: function() {
      return R.createFeaturelayerFilter(
        ["point", "polyline", "polygon"],
        !1,
        !0
      );
    },
    _isLayerEditable: function(a) {
      var b = !1;
      a &&
        a.layerObject &&
        ((a = a.layerObject.getEditCapabilities()),
        a.canCreate || a.canUpdate || a.canDelete || a.canUpdateGeometry) &&
        (b = !0);
      return b;
    },
    _getAllFilteredLayers: function(b, c) {
      d.forEach(
        b,
        a.hitch(this, function(b) {
          var d;
          b.isLeaf()
            ? ((d = new N()),
              this._layerChooserFromMap.filter(b).then(
                a.hitch(this, function(a) {
                  a && this._isLayerEditable(b) && this._totalLayers.push(b);
                  d.resolve();
                })
              ),
              c.push(d))
            : this._getAllFilteredLayers(b.newSubLayers, c);
        })
      );
    },
    _onDeleteAttributeActionsClick: function(b, c) {
      var d = new C({
        titleLabel: this.nls.attributeActionsPage.deleteGroupPopupTitle,
        width: 450,
        maxHeight: 445,
        autoHeight: !0,
        content: this.nls.attributeActionsPage.deleteGroupPopupMsg,
        class: this.baseClass,
        buttons: [
          {
            label: this.nls.ok,
            onClick: a.hitch(this, function() {
              "Intersection" === c
                ? (this._configureIntersectionActionGroup(b, !0),
                  this._intersectionActionGroupTable.deleteRow(b))
                : "Address" === c
                ? (this._configureAddressActionGroup(b, !0),
                  this._addressActionGroupTable.deleteRow(b))
                : "Coordinates" === c
                ? (this._configureCoordinatesActionGroup(b, !0),
                  this._coordinatesActionGroupTable.deleteRow(b))
                : "Preset" === c &&
                  (this._configurePresetActionGroup(b, !0),
                  this._presetActionGroupTable.deleteRow(b));
              d.close();
            })
          },
          {
            label: this.nls.cancel,
            classNames: ["jimu-btn-vacation"],
            onClick: a.hitch(this, function() {
              d.close();
            })
          }
        ]
      });
    },
    _initAttributeActionsTable: function(a) {
      var b;
      b = new m({
        fields: [
          {
            name: "name",
            title: this.nls.attributeActionsPage.name,
            type: "text"
          },
          {
            name: "dataType",
            title: this.nls.attributeActionsPage.type,
            type: "text"
          },
          {
            name: "actions",
            title: this.nls.actions,
            type: "actions",
            class: "actions",
            actions: ["edit", "delete"]
          }
        ],
        selectable: !1
      });
      b.placeAt(a);
      b.startup();
      return b;
    },
    _getAllLayersFieldValues: function(a, b, c) {
      d.forEach(
        b,
        function(b) {
          b.featureLayer &&
            b.featureLayer.id === c &&
            (b.fieldValues ? a || (a = []) : (b.fieldValues = {}),
            a.push(b.fieldValues));
          b.relationshipInfos &&
            (a = this._getAllLayersFieldValues(a, b.relationshipInfos, c));
        },
        this
      );
      return a;
    },
    _removeAttributeGroupNameFromLayerFields: function(a) {
      var b,
        c = [];
      if (
        (c = this._getAllLayersFieldValues(c, this._configInfos, a.layerId)) &&
        0 < c.length
      )
        for (var d = 0; d < c.length; d++)
          if ((b = c[d]))
            for (var e in b)
              if (b && b[e] && e === a.fieldName)
                for (var f = b[e], g = 0; g < f.length; g++)
                  f[g].actionName === a.action &&
                    f[g].hasOwnProperty("attributeActionGroupName") &&
                    f[g].attributeActionGroupName === a.groupName &&
                    delete f[g].attributeActionGroupName;
    },
    _removeFromAttributeActionGroup: function(a) {
      if (
        this.config.attributeActionGroups &&
        this.config.attributeActionGroups[a.action]
      ) {
        var b = this.config.attributeActionGroups[a.action][a.groupName];
        if (
          b.appliedOn[a.layerId] &&
          -1 < b.appliedOn[a.layerId].indexOf(a.fieldName)
        ) {
          var c = b.appliedOn[a.layerId].indexOf(a.fieldName);
          b.appliedOn[a.layerId].splice(c, 1);
        }
      }
      this._removeAttributeGroupNameFromLayerFields(a);
    },
    _initAllAttributeActions: function() {
      this._intersectionActionGroupTable = this._initAttributeActionsTable(
        this.intersectionActionsTableNode
      );
      this.own(
        c(
          this._intersectionActionGroupTable,
          "actions-edit",
          a.hitch(this, this._configureIntersectionActionGroup)
        )
      );
      this._intersectionActionGroupTable.onBeforeRowDelete = a.hitch(
        this,
        function(a) {
          this._onDeleteAttributeActionsClick(a, "Intersection");
        }
      );
      this._addressActionGroupTable = this._initAttributeActionsTable(
        this.addressActionsTableNode
      );
      this.own(
        c(
          this._addressActionGroupTable,
          "actions-edit",
          a.hitch(this, this._configureAddressActionGroup)
        )
      );
      this._addressActionGroupTable.onBeforeRowDelete = a.hitch(this, function(
        a
      ) {
        this._onDeleteAttributeActionsClick(a, "Address");
      });
      this._coordinatesActionGroupTable = this._initAttributeActionsTable(
        this.coordinatesActionsTableNode
      );
      this.own(
        c(
          this._coordinatesActionGroupTable,
          "actions-edit",
          a.hitch(this, this._configureCoordinatesActionGroup)
        )
      );
      this._coordinatesActionGroupTable.onBeforeRowDelete = a.hitch(
        this,
        function(a) {
          this._onDeleteAttributeActionsClick(a, "Coordinates");
        }
      );
      this._presetActionGroupTable = this._initAttributeActionsTable(
        this.presetActionsTableNode
      );
      this.own(
        c(
          this._presetActionGroupTable,
          "actions-edit",
          a.hitch(this, this._configurePresetActionGroup)
        )
      );
      this._presetActionGroupTable.onBeforeRowDelete = a.hitch(this, function(
        a
      ) {
        this._onDeleteAttributeActionsClick(a, "Preset");
      });
      this.config.attributeActionGroups &&
        this._populateAttributeActionGroups();
    },
    _addAttributeActionGroupRow: function(a, b) {
      var c, d, e;
      d = a.name;
      e = a.dataType;
      "Intersection" === b
        ? ((c = this._intersectionActionGroupTable),
          (e = this.nls.dataType[a.dataType]))
        : "Address" === b
        ? (c = this._addressActionGroupTable)
        : "Coordinates" === b
        ? (c = this._coordinatesActionGroupTable)
        : "Preset" === b &&
          ((c = this._presetActionGroupTable),
          (e = this.nls.dataType[a.dataType]));
      c &&
        ((b = c.addRow({ name: d, dataType: e })),
        b.success && (b.tr._configInfo = a));
    },
    _populateAttributeActionGroups: function() {
      for (var a in this.config.attributeActionGroups) {
        var b = this.config.attributeActionGroups[a],
          c;
        for (c in b) this._addAttributeActionGroupRow(b[c], a);
      }
    },
    _getAttributeActionGroupConfig: function() {
      return {
        Intersection: this._getAttributeGroupsForAction(
          this._intersectionActionGroupTable
        ),
        Address: this._getAttributeGroupsForAction(
          this._addressActionGroupTable
        ),
        Coordinates: this._getAttributeGroupsForAction(
          this._coordinatesActionGroupTable
        ),
        Preset: this._getAttributeGroupsForAction(this._presetActionGroupTable)
      };
    },
    _getAttributeGroupsForAction: function(a) {
      var b = {};
      a &&
        (a = a.getRows()) &&
        0 < a.length &&
        d.forEach(a, function(a) {
          a._configInfo && (b[a._configInfo.name] = a._configInfo);
        });
      return b;
    },
    _configureIntersectionActionGroup: function(b, d) {
      var e;
      e = {
        nls: this.nls,
        map: this.map,
        isGroup: !0,
        isDelete: d,
        layerInfos: this._jimuLayerInfos,
        existingGroupNames: [],
        appliedOn: null,
        _configInfos: this._configInfos,
        _fieldType: "esriFieldTypeString",
        _fieldValues: { Intersection: { fields: [] } },
        editUtils: t
      };
      this.config.attributeActionGroups &&
        this.config.attributeActionGroups.Intersection &&
        (e.existingGroupNames = Object.keys(
          this.config.attributeActionGroups.Intersection
        ));
      e.existingGroups = this._getAttributeActionGroupConfig().Intersection;
      b &&
        ((e.appliedOn = b._configInfo.appliedOn),
        (e.name = b._configInfo.name),
        (e._fieldType = b._configInfo.dataType),
        (e.prevName = a.clone(b._configInfo.name)),
        (e._fieldValues.Intersection = b._configInfo.attributeInfo));
      e = new O(e);
      this.own(
        c(
          e,
          "groupInfoUpdated",
          a.hitch(this, function(a) {
            b
              ? ((b._configInfo = a),
                this._intersectionActionGroupTable.editRow(b, {
                  name: a.name,
                  dataType: this.nls.dataType[a.dataType]
                }))
              : this._addAttributeActionGroupRow(a, "Intersection");
            this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
          })
        )
      );
      d &&
        (this.config.attributeActionGroups.Intersection.hasOwnProperty(
          b._configInfo.name
        ) &&
          delete this.config.attributeActionGroups.Intersection[
            b._configInfo.name
          ],
        e.deleteGroup());
    },
    _onIntersectionBtnClick: function() {
      this._configureIntersectionActionGroup();
    },
    _configureAddressActionGroup: function(b, d) {
      var e;
      e = {
        nls: this.nls,
        map: this.map,
        isGroup: !0,
        isDelete: d,
        _totalLayers: this._totalLayers,
        layerInfos: this._jimuLayerInfos,
        existingGroupNames: [],
        _configInfos: this._configInfos,
        appliedOn: null,
        _geocoderSettings: this._configuredGeocoderSettings,
        _fieldValues: { Address: { field: "", enabled: !0 } },
        editUtils: t
      };
      this.config.attributeActionGroups &&
        this.config.attributeActionGroups.Address &&
        (e.existingGroupNames = Object.keys(
          this.config.attributeActionGroups.Address
        ));
      e.existingGroups = this._getAttributeActionGroupConfig().Address;
      b &&
        ((e.appliedOn = b._configInfo.appliedOn),
        (e.name = b._configInfo.name),
        (e.prevName = a.clone(b._configInfo.name)),
        (e._fieldValues.Address = b._configInfo.attributeInfo));
      e = new I(e);
      this.own(
        c(
          e,
          "groupInfoUpdated",
          a.hitch(this, function(a) {
            b
              ? ((b._configInfo = a),
                this._addressActionGroupTable.editRow(b, {
                  name: a.name,
                  dataType: a.dataType
                }))
              : this._addAttributeActionGroupRow(a, "Address");
            this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
          })
        )
      );
      d &&
        (this.config.attributeActionGroups.Address.hasOwnProperty(
          b._configInfo.name
        ) &&
          delete this.config.attributeActionGroups.Address[b._configInfo.name],
        e.deleteGroup());
    },
    _onAddressBtnClick: function() {
      this._configuredGeocoderSettings
        ? this._configureAddressActionGroup()
        : this._openServiceChooser();
    },
    _configureCoordinatesActionGroup: function(b, d) {
      var e;
      e = {
        nls: this.nls,
        map: this.map,
        isGroup: !0,
        isDelete: d,
        _totalLayers: this._totalLayers,
        layerInfos: this._jimuLayerInfos,
        existingGroupNames: [],
        _configInfos: this._configInfos,
        appliedOn: null,
        coordinatesSavedDataTypes: this._filterAttributeDropDownOptions(b),
        _geocoderSettings: this._configuredGeocoderSettings,
        _fieldValues: {
          Coordinates: {
            coordinatesSystem: "MapSpatialReference",
            field: "x",
            enabled: !0
          }
        },
        editUtils: t
      };
      this.config.attributeActionGroups &&
        this.config.attributeActionGroups.Coordinates &&
        (e.existingGroupNames = Object.keys(
          this.config.attributeActionGroups.Coordinates
        ));
      e.existingGroups = this._getAttributeActionGroupConfig().Coordinates;
      b &&
        ((e.appliedOn = b._configInfo.appliedOn),
        (e.name = b._configInfo.name),
        (e.prevName = a.clone(b._configInfo.name)),
        (e._fieldValues.Coordinates = b._configInfo.attributeInfo));
      e = new Q(e);
      this.own(
        c(
          e,
          "groupInfoUpdated",
          a.hitch(this, function(a) {
            b
              ? ((b._configInfo = a),
                this._coordinatesActionGroupTable.editRow(b, {
                  name: a.name,
                  dataType: a.dataType
                }))
              : this._addAttributeActionGroupRow(a, "Coordinates");
            this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
          })
        )
      );
      d &&
        (this.config.attributeActionGroups.Coordinates.hasOwnProperty(
          b._configInfo.name
        ) &&
          delete this.config.attributeActionGroups.Coordinates[
            b._configInfo.name
          ],
        e.deleteGroup());
    },
    _onCoordinateBtnClick: function() {
      var a = this._coordinatesActionGroupTable.getRows();
      a && 6 > a.length
        ? this._configureCoordinatesActionGroup()
        : new y({ message: this.nls.coordinatesPage.allGroupsCreatedMsg });
    },
    _configurePresetActionGroup: function(b, d) {
      var e;
      e = {
        nls: this.nls,
        map: this.map,
        isDelete: d,
        _totalLayers: this._totalLayers,
        layerInfos: this._jimuLayerInfos,
        _configuredPresetInfos: this._configuredPresetInfos,
        existingGroupNames: [],
        _configInfos: this._configInfos,
        appliedOn: null,
        dataType: "esriFieldTypeString",
        editUtils: t
      };
      this.config.attributeActionGroups &&
        this.config.attributeActionGroups.Preset &&
        (e.existingGroupNames = Object.keys(
          this.config.attributeActionGroups.Preset
        ));
      e.existingGroups = this._getAttributeActionGroupConfig().Preset;
      b &&
        ((e.appliedOn = b._configInfo.appliedOn),
        (e.name = b._configInfo.name),
        (e.dataType = b._configInfo.dataType),
        (e.showOnlyDomainFields = b._configInfo.showOnlyDomainFields),
        (e.hideInPresetDisplay = b._configInfo.hideInPresetDisplay),
        (e.prevName = a.clone(b._configInfo.name)),
        (e.presetValue = b._configInfo.presetValue));
      e = new P(e);
      this.own(
        c(
          e,
          "groupInfoUpdated",
          a.hitch(this, function(a) {
            b
              ? ((b._configInfo = a),
                this._presetActionGroupTable.editRow(b, {
                  name: a.name,
                  dataType: this.nls.dataType[a.dataType]
                }))
              : this._addAttributeActionGroupRow(a, "Preset");
            this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
          })
        )
      );
      d &&
        (this.config.attributeActionGroups.Preset.hasOwnProperty(
          b._configInfo.name
        ) &&
          delete this.config.attributeActionGroups.Preset[b._configInfo.name],
        e.deleteGroup());
    },
    _onPresetBtnClick: function() {
      this._configurePresetActionGroup();
    },
    _filterAttributeDropDownOptions: function(b) {
      var c,
        e,
        f = {
          MapSpatialReference: ["X", "Y", "X Y"],
          LatLong: ["Latitude", "Longitude", "Latitude Longitude"]
        };
      (c = this._coordinatesActionGroupTable.getRows()) &&
        0 < c.length &&
        d.forEach(
          c,
          a.hitch(this, function(a) {
            (b && b._configInfo.dataType === a._configInfo.dataType) ||
              ((e = a._configInfo.dataType),
              -1 < f.MapSpatialReference.indexOf(e)
                ? ((a = f.MapSpatialReference.indexOf(e)),
                  f.MapSpatialReference.splice(a, 1))
                : -1 < f.LatLong.indexOf(e) &&
                  ((a = f.LatLong.indexOf(e)), f.LatLong.splice(a, 1)));
          })
        );
      return f;
    }
  });
});