// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/Evented dojo dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-class dojo/on dojo/query dijit/registry jimu/filterUtils jimu/dijit/Filter jimu/BaseWidgetSetting".split(
  " "
), function(p, q, r, n, g, d, t, m, u, v, x, w) {
  return r([w, p], {
    _attrInspector: null,
    _fieldValidation: null,
    _feature: null,
    _fieldInfo: null,
    _gdbRequiredFields: null,
    _notEditableFields: null,
    _fieldNameToAlias: null,
    _fieldsWithRules: null,
    _attTable: null,
    _filterUtils: null,
    _mapLayer: null,
    OPERATORS: null,
    constructor: function() {
      this.inherited(arguments);
      n.mixin(this, arguments[0]);
      String.prototype.endsWith ||
        (String.prototype.endsWith = function(a, c) {
          if (void 0 === c || c > this.length) c = this.length;
          return this.substring(c - a.length, c) === a;
        });
      this.useFieldName = !1;
      this._mapLayer = this._feature.getLayer();
      this._attTable = m("td.atiLabel", this._attrInspector.domNode);
      if (0 < this._attTable.length) {
        var a = this._attTable[0];
        a && a.hasAttribute("data-fieldname") && (this.useFieldName = !0);
      }
      this._processLayer();
      this._filterUtils = new v();
      this.OPERATORS = n.clone(this._filterUtils.OPERATORS);
      void 0 !== this._attTable &&
        null !== this._attTable &&
        this._bindEvents();
    },
    _processLayer: function() {
      this._gdbRequiredFields = [];
      this._notEditableFields = [];
      this._fieldsWithRules = [];
      g.forEach(
        this._fieldInfo,
        function(a) {
          var b;
          !0 === this.useFieldName || !1 === a.hasOwnProperty("label")
            ? (b = a.fieldName)
            : ((b = a.label),
              0 <=
                b.indexOf(
                  '\x3ca class\x3d"asteriskIndicator"\x3e *\x3c/a\x3e'
                ) &&
                (b = b.replace(
                  '\x3ca class\x3d"asteriskIndicator"\x3e *\x3c/a\x3e',
                  ""
                )));
          !1 === a.nullable &&
            !0 === a.isEditable &&
            this._gdbRequiredFields.push(b);
          (!1 !== a.isEditable && !1 !== a.isEditableSettingInWebmap) ||
            this._notEditableFields.push(b);
          this._fieldValidation &&
            this._fieldValidation.hasOwnProperty(a.fieldName) &&
            this._fieldsWithRules.push(b);
        },
        this
      );
    },
    toggleFields: function(a) {
      a = "undefined" !== typeof a && null !== a ? a : !0;
      if (
        void 0 !== this._attTable &&
        null !== this._attTable &&
        void 0 !== this._fieldValidation &&
        null !== this._fieldValidation &&
        void 0 !== this._feature &&
        null !== this._feature
      ) {
        var b = null,
          c = [],
          e;
        g.forEach(
          this._fieldInfo,
          n.hitch(this, function(d) {
            var l;
            !0 === this.useFieldName || !1 === d.hasOwnProperty("label")
              ? (l = d.fieldName)
              : ((l = d.label),
                0 <=
                  l.indexOf(
                    '\x3ca class\x3d"asteriskIndicator"\x3e *\x3c/a\x3e'
                  ) &&
                  (l = l.replace(
                    '\x3ca class\x3d"asteriskIndicator"\x3e *\x3c/a\x3e',
                    ""
                  )));
            b = null;
            e = this.validateField(d.fieldName);
            b = e[1];
            if (e[2] && "esriFieldTypeDate" === d.type) {
              var f = this._getDijitForField(d.fieldName);
              f && 1 < f.length && null === f[0].get("value") && (e[2] = !1);
            }
            !1 === e[2] && c.push({ fieldName: d.fieldName });
            !0 === e[0] && this.toggleFieldOnAttributeInspector(l, b, e[2], a);
          })
        );
        return c;
      }
    },
    _getDijitForField: function(a) {
      var b;
      g.some(
        this._attrInspector._currentLInfo.fieldInfos,
        n.hitch(this, function(c) {
          if (c.fieldName === a) return (b = c.dijit), !0;
        })
      );
      return b;
    },
    validateField: function(a) {
      var b = null;
      if (this._fieldValidation.hasOwnProperty(a)) {
        if (0 === this._fieldValidation[a].length) return [!1, null, !0];
        var c = [!1, null, null];
        g.some(
          this._fieldValidation[a],
          function(e) {
            if (
              void 0 !== e.filter &&
              null !== e.filter &&
              ((b = e.filter),
              (c = [!0, null, null]),
              this.processFilter(b, this._feature))
            )
              return "Required" === e.actionName
                ? !1 === this._feature.attributes.hasOwnProperty(a)
                  ? ((c = [!0, e.actionName, !1]), !0)
                  : null === this._feature.attributes[a] ||
                    "" === this._feature.attributes[a]
                  ? ((c = [!0, e.actionName, !1]), !0)
                  : this.myIsNaN(this._feature.attributes[a])
                  ? ((c = [!0, e.actionName, !1]), !0)
                  : ((c = [!0, e.actionName, !0]), !0)
                : ((c = [!0, e.actionName, null, e.submitWhenHidden]), !0);
          },
          this
        );
        return c;
      }
      return [!1, null, null];
    },
    _bindEvents: function() {
      void 0 !== this._attTable &&
        null !== this._attTable &&
        0 < this._attTable.length &&
        g.forEach(
          this._attTable,
          function(a) {
            a = this._getRowInfo(a);
            -1 !== this._fieldsWithRules.indexOf(a[3]) &&
              "dijit.form.FilteringSelect" === a[2].declaredClass &&
              t(a[2], "change", n.hitch(this, this._smartComboValidate()));
          },
          this
        );
    },
    process_relative_date: function(a, b, c) {
      var e = new Date(),
        d = this._isNumeric(b);
      if (void 0 === a || null === a || "" === a) return b;
      if (a == this.OPERATORS.dateOperatorMinutes && !0 === d)
        return e.setMinutes(e.getMinutes() - b);
      if (a == this.OPERATORS.dateOperatorHours && !0 === d)
        return e.setHours(e.getHours() - b);
      if (a == this.OPERATORS.dateOperatorDays && !0 === d)
        return e.setDate(e.getDate() - b);
      if (a == this.OPERATORS.dateOperatorWeeks && !0 === d)
        return e.setDate(e.getDate() - 7 * b);
      if (a == this.OPERATORS.dateOperatorMonths && !0 === d)
        return e.setMonth(e.getMonth() - b);
      if (a == this.OPERATORS.dateOperatorYears && !0 === d)
        return e.setFullYear(e.getFullYear() - b);
      if ("today" == a.toLowerCase())
        return new Date(e.setDate(e.getDate())).setHours(23, 59, 59, 999);
      if ("tomorrow" == a.toLowerCase())
        return new Date(e.setDate(e.getDate() + 1)).setHours(23, 59, 59, 999);
      if ("yesterday" == a.toLowerCase())
        return new Date(e.setDate(e.getDate() - 1)).setHours(23, 59, 59, 999);
      if ("thisweek" == a.toLowerCase()) {
        var k = new Date(e.setDate(e.getDate() - e.getDay())).setHours(
            0,
            0,
            0,
            0
          ),
          f = new Date(e.setDate(e.getDate() - e.getDay() + 6)).setHours(
            23,
            59,
            59,
            999
          );
        return !0 === c ? k : f;
      }
      if ("thismonth" == a.toLowerCase())
        return (
          (k = new Date(e.getFullYear(), e.getMonth(), 1).getTime()),
          (f = new Date(e.getFullYear(), e.getMonth() + 1, 0).setHours(
            23,
            59,
            59,
            999
          )),
          !0 === c ? k : f
        );
      if ("thisquarter" == a.toLowerCase()) {
        a = new Date(e.getTime());
        var h = a.getFullYear();
        a.setHours(0, 0, 0, 0);
        b = new Date(h, 2, 31).setHours(23, 59, 59, 999);
        var d = new Date(h, 5, 30).setHours(23, 59, 59, 999),
          g = new Date(h, 8, 30).setHours(23, 59, 59, 999),
          h = new Date(h, 11, 31).setHours(23, 59, 59, 999);
        a <= b && ((k = new Date(e.getFullYear(), 0, 1).getTime()), (f = d));
        a <= d && ((k = b), (f = d));
        a <= g && ((k = d), (f = g));
        a <= h && ((k = g), (f = h));
        return !0 === c ? k : f;
      }
      return "thisyear" == a.toLowerCase()
        ? ((f = new Date(e.getFullYear(), 11, 31).setHours(23, 59, 59, 999)),
          (k = new Date(e.getFullYear(), 0, 1).getTime()),
          !0 === c ? k : f)
        : b;
    },
    process_part: function(a) {
      var b = null,
        c = null,
        e = null,
        d = null,
        k = null,
        f = null;
      a.valueObj.hasOwnProperty("value") &&
        ((b =
          void 0 === a.valueObj.virtualDate || null === a.valueObj.virtualDate
            ? null
            : a.valueObj.virtualDate),
        (k =
          void 0 === a.valueObj.range || null === a.valueObj.range
            ? null
            : a.valueObj.range),
        (c = a.valueObj.value));
      a.valueObj.hasOwnProperty("value1") &&
        ((b =
          void 0 === a.valueObj.virtualDate1 || null === a.valueObj.virtualDate1
            ? null
            : a.valueObj.virtualDate1),
        null === b &&
          (b =
            void 0 === a.valueObj.virtualDate || null === a.valueObj.virtualDate
              ? null
              : a.valueObj.virtualDate),
        (k =
          void 0 === a.valueObj.range1 || null === a.valueObj.range1
            ? null
            : a.valueObj.range1),
        (c = a.valueObj.value1));
      a.valueObj.hasOwnProperty("value2") &&
        ((e =
          void 0 === a.valueObj.virtualDate2 || null === a.valueObj.virtualDate2
            ? null
            : a.valueObj.virtualDate2),
        null === e &&
          (e =
            void 0 === a.valueObj.virtualDate || null === a.valueObj.virtualDate
              ? null
              : a.valueObj.virtualDate),
        (f =
          void 0 === a.valueObj.range2 || null === a.valueObj.range2
            ? null
            : a.valueObj.range2),
        (d = a.valueObj.value2));
      "esriFieldTypeDate" == a.fieldObj.type &&
        (a.operator == this.OPERATORS.dateOperatorInTheLast
          ? (null !== k && (c = this.process_relative_date(k, c)),
            null !== f && (d = this.process_relative_date(f, d)))
          : a.operator == this.OPERATORS.dateOperatorNotInTheLast
          ? (null !== k && (c = this.process_relative_date(k, c)),
            null !== f && (d = this.process_relative_date(f, d)))
          : a.operator == this.OPERATORS.dateOperatorIsIn
          ? ((c = this.process_relative_date(b, c, !0)),
            (d = this.process_relative_date(e, d, !1)))
          : a.operator == this.OPERATORS.dateOperatorIsNotIn
          ? ((c = this.process_relative_date(b, c, !0)),
            (d = this.process_relative_date(e, d, !1)))
          : (null !== b && (c = this.process_relative_date(b, c, !1)),
            null !== e && (d = this.process_relative_date(e, d, !1))));
      return [c, d];
    },
    processFilter: function(a) {
      var b = [];
      g.forEach(
        a.parts,
        function(a) {
          if (a.hasOwnProperty("parts"))
            b.push(this.processFilter(a, this._feature));
          else {
            value_process = this.process_part(a);
            var c = value_process[0],
              d = value_process[1];
            switch (a.valueObj.type) {
              case "value":
                b.push(
                  this.validatePart(
                    a.operator,
                    this._feature.attributes[a.fieldObj.name],
                    c,
                    d,
                    a.caseSensitive
                  )
                );
                break;
              case "unique":
                b.push(
                  this.validatePart(
                    a.operator,
                    this._feature.attributes[a.fieldObj.name],
                    c,
                    d,
                    a.caseSensitive
                  )
                );
                break;
              case "field":
                this._feature.attributes.hasOwnProperty(c) &&
                  (c = this._feature.attributes[c]),
                  b.push(
                    this.validatePart(
                      a.operator,
                      this._feature.attributes[a.fieldObj.name],
                      c,
                      d,
                      a.caseSensitive
                    )
                  );
            }
          }
        },
        this
      );
      return this.ruleValid(b, a.logicalOperator);
    },
    ruleValid: function(a, b) {
      var c = !1;
      if (void 0 === b || null === b) b = "OR";
      g.some(a, function(a) {
        if ("OR" === b) {
          if (!0 === a) return (c = !0);
          c = !1;
        } else {
          if (!1 === a) return (c = !1), !0;
          c = !0;
        }
      });
      return c;
    },
    myIsNaN: function(a) {
      return a !== a;
    },
    _isNumeric: function(a) {
      return !isNaN(parseFloat(a)) && isFinite(a);
    },
    validatePart: function(a, b, c, d, l) {
      var e = null;
      if (void 0 === a || null === a) return !1;
      0 === a.lastIndexOf("string", 0)
        ? !1 === l &&
          (void 0 !== b && null !== b && (b = String(b).toUpperCase()),
          void 0 !== c && null !== c && (c = String(c).toUpperCase()),
          void 0 !== d && null !== d && (d = String(d).toUpperCase()))
        : 0 === a.lastIndexOf("date", 0) &&
          (void 0 !== c && null !== c && (c = new Date(c)),
          void 0 !== d && null !== d && (d = new Date(d)));
      switch (a) {
        case this.OPERATORS.stringOperatorIs:
          if (b === c) return !0;
          break;
        case this.OPERATORS.stringOperatorIsNot:
          if (b !== c) return !0;
          break;
        case this.OPERATORS.stringOperatorStartsWith:
          if (null === b && null === c) return !0;
          if (null === b && null !== c) break;
          if (null !== b && null === c) break;
          if (0 === b.lastIndexOf(c, 0)) return !0;
          break;
        case this.OPERATORS.stringOperatorEndsWith:
          if (null === b && null === c) return !0;
          if (null === b && null !== c) break;
          if (null !== b && null === c) break;
          return b.endsWith(c);
        case this.OPERATORS.stringOperatorContains:
          if (null === b && null === c) return !0;
          if (null === b && null !== c) break;
          if (null !== b && null === c) break;
          if (
            0 <=
            String(b)
              .toUpperCase()
              .indexOf(c.toUpperCase())
          )
            return !0;
          break;
        case this.OPERATORS.stringOperatorDoesNotContain:
          if (null === b && null === c) break;
          if (
            (null === b && null !== c) ||
            (null !== b && null === c) ||
            !(
              0 <=
              String(b)
                .toUpperCase()
                .indexOf(c.toUpperCase())
            )
          )
            return !0;
          break;
        case this.OPERATORS.stringOperatorIsBlank:
          return void 0 === b || null === b || "" === b;
        case this.OPERATORS.stringOperatorIsNotBlank:
          return void 0 !== b && null !== b && "" !== b;
        case this.OPERATORS.numberOperatorIs:
          if (this._isNumeric(b)) return String(b) === String(c);
          break;
        case this.OPERATORS.numberOperatorIsNot:
          if (this._isNumeric(b)) return String(b) !== String(c);
          break;
        case this.OPERATORS.numberOperatorIsAtLeast:
          if (this._isNumeric(b) && this._isNumeric(c))
            return Number(b) >= Number(c);
          break;
        case this.OPERATORS.numberOperatorIsLessThan:
          if (this._isNumeric(b) && this._isNumeric(c))
            return Number(b) < Number(c);
          break;
        case this.OPERATORS.numberOperatorIsAtMost:
          if (this._isNumeric(b) && this._isNumeric(c))
            return Number(b) <= Number(c);
          break;
        case this.OPERATORS.numberOperatorIsGreaterThan:
          if (this._isNumeric(b) && this._isNumeric(c))
            return Number(b) > Number(c);
          break;
        case this.OPERATORS.numberOperatorIsBetween:
          if (this._isNumeric(b) && this._isNumeric(c) && this._isNumeric(d))
            return Number(b) > Number(c) && Number(b) < Number(d);
          break;
        case this.OPERATORS.numberOperatorIsNotBetween:
          if (this._isNumeric(b) && this._isNumeric(c) && this._isNumeric(d))
            return Number(b) <= Number(c) || Number(b) >= Number(d);
          break;
        case this.OPERATORS.numberOperatorIsBlank:
          if (null === b || void 0 === b || !1 === this._isNumeric(b))
            return !0;
          break;
        case this.OPERATORS.numberOperatorIsNotBlank:
          if (null !== b && void 0 !== b && !0 === this._isNumeric(b))
            return !0;
          break;
        case this.OPERATORS.dateOperatorIsOn:
          if (void 0 === b || null === b) break;
          if (void 0 === c || null === c) break;
          e = new Date(b);
          return c.toDateString() === e.toDateString();
        case this.OPERATORS.dateOperatorIsNotOn:
          if (void 0 === b || null === b) break;
          if (void 0 === c || null === c) break;
          e = new Date(b);
          return c.toDateString() !== e.toDateString();
        case this.OPERATORS.dateOperatorIsBefore:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          return b < c.getTime();
        case this.OPERATORS.dateOperatorIsAfter:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          return b > c.getTime();
        case this.OPERATORS.dateOperatorIsOnOrBefore:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          return b <= c.getTime();
        case this.OPERATORS.dateOperatorIsOnOrAfter:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          return b >= c.getTime();
        case this.OPERATORS.dateOperatorInTheLast:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          return b > c.getTime() && b <= new Date().getTime();
        case this.OPERATORS.dateOperatorNotInTheLast:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          return b <= c.getTime() || b >= new Date().getTime();
        case this.OPERATORS.dateOperatorIsIn:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          if (void 0 === d || null === d) break;
          return b >= c.getTime() && b <= d.getTime();
        case this.OPERATORS.dateOperatorIsNotIn:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          if (void 0 === d || null === d) break;
          return b < c.getTime() || b > d.getTime();
        case this.OPERATORS.dateOperatorIsBetween:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          if (void 0 === d || null === d) break;
          return b >= c.getTime() && b <= d.getTime();
        case this.OPERATORS.dateOperatorIsNotBetween:
          if (null === b || void 0 === b) break;
          if (void 0 === c || null === c) break;
          if (void 0 === d || null === d) break;
          return b < c.getTime() || b > d.getTime();
        case this.OPERATORS.dateOperatorIsBlank:
          if (null === b || void 0 === b) return !0;
          break;
        case this.OPERATORS.dateOperatorIsNotBlank:
          if (null !== b && void 0 !== b) return !0;
      }
      return !1;
    },
    _processChildNodes: function(a, b) {
      a.disabled = b;
      !0 === b
        ? a.style && (a.style.pointerEvents = "none")
        : a.style && (a.style.pointerEvents = "auto");
      g.forEach(
        a.childNodes,
        function(a) {
          a.disabled = b;
          !0 === b
            ? a.style && (a.style.pointerEvents = "none")
            : a.style && (a.style.pointerEvents = "auto");
          0 < a.childNodes.length && this._processChildNodes(a, b);
        },
        this
      );
    },
    _smartComboValidate: function() {
      this.toggleFields();
    },
    _getRowInfo: function(a) {
      var b = a.parentNode.childNodes[1].childNodes[0],
        c = null;
      1 < a.parentNode.childNodes[1].childNodes.length &&
        (c = a.parentNode.childNodes[1].childNodes[1]);
      var d;
      d =
        !0 === this.useFieldName
          ? a.hasAttribute("data-fieldname")
            ? a.getAttribute("data-fieldname")
            : a.childNodes[0].data
          : a.childNodes[0].data;
      a = a.parentNode;
      var l = u.getEnclosingWidget(b);
      return [b, a, l, d, c];
    },
    _removeRequireFieldMarkings: function(a, b, c) {
      var e = null;
      void 0 === c || null === c
        ? (d.contains(a, "dijitComboBoxError") &&
            d.remove(a, "dijitComboBoxError"),
          d.contains(a, "dijitTextBoxError") &&
            d.remove(a, "dijitTextBoxError"),
          d.contains(a, "dijitValidationTextBox") &&
            d.remove(a, "dijitValidationTextBox"),
          d.contains(a, "dijitValidationTextBoxError") &&
            d.remove(a, "dijitValidationTextBoxError"),
          d.contains(a, "dijitError") && d.remove(a, "dijitError"),
          (e = m(".dijitValidationContainer", b)),
          g.forEach(e, function(a) {
            a.parentNode.removeChild(a);
          }))
        : ((e = n.isFunction(c.isValid) ? c.isValid() : !0),
          "dijit.form.TextBox" === c.declaredClass && !0 === e
            ? (d.contains(a, "dijitTextBoxError") &&
                d.remove(a, "dijitTextBoxError"),
              d.contains(a, "dijitValidationTextBox") &&
                d.remove(a, "dijitValidationTextBox"),
              d.contains(a, "dijitValidationTextBoxError") &&
                d.remove(a, "dijitValidationTextBoxError"),
              d.contains(a, "dijitError") && d.remove(a, "dijitError"),
              (e = m(".dijitValidationContainer", b)),
              g.forEach(e, function(a) {
                a.parentNode.removeChild(a);
              }))
            : "dijit.form.ValidationTextBox" === c.declaredClass && !0 === e
            ? (d.contains(a, "dijitTextBoxError") &&
                d.remove(a, "dijitTextBoxError"),
              d.contains(a, "dijitTextBoxDisabled") &&
                d.remove(a, "dijitTextBoxDisabled"),
              d.contains(a, "dijitValidationTextBoxError") &&
                d.remove(a, "dijitValidationTextBoxError"),
              d.contains(a, "dijitError") && d.remove(a, "dijitError"))
            : "dijit.form.DateTextBox" === c.declaredClass && !0 === e
            ? (d.contains(a, "dijitTextBoxError") &&
                d.remove(a, "dijitTextBoxError"),
              d.contains(a, "dijitValidationTextBox") &&
                d.remove(a, "dijitValidationTextBox"),
              d.contains(a, "dijitValidationTextBoxError") &&
                d.remove(a, "dijitValidationTextBoxError"),
              d.contains(a, "dijitError") && d.remove(a, "dijitError"),
              (e = m(".dijitValidationContainer", b)),
              g.forEach(e, function(a) {
                a.parentNode.removeChild(a);
              }))
            : "dijit.form.TimeTextBox" === c.declaredClass && !0 === e
            ? (d.contains(a, "dijitTextBoxError") &&
                d.remove(a, "dijitTextBoxError"),
              d.contains(a, "dijitValidationTextBox") &&
                d.remove(a, "dijitValidationTextBox"),
              d.contains(a, "dijitValidationTextBoxError") &&
                d.remove(a, "dijitValidationTextBoxError"),
              d.contains(a, "dijitError") && d.remove(a, "dijitError"),
              (e = m(".dijitValidationContainer", b)),
              g.forEach(e, function(a) {
                a.parentNode.removeChild(a);
              }))
            : "dijit.form.FilteringSelect" === c.declaredClass && !0 === e
            ? (d.contains(a, "dijitTextBoxError") &&
                d.remove(a, "dijitTextBoxError"),
              d.contains(a, "dijitComboBoxError") &&
                d.remove(a, "dijitComboBoxError"),
              d.contains(a, "dijitError") && d.remove(a, "dijitError"),
              d.contains(a, "dijitValidationTextBoxError") &&
                d.remove(a, "dijitValidationTextBoxError"))
            : !0 === e &&
              (d.contains(a, "dijitComboBoxError") &&
                d.remove(a, "dijitComboBoxError"),
              d.contains(a, "dijitTextBoxError") &&
                d.remove(a, "dijitTextBoxError"),
              d.contains(a, "dijitValidationTextBox") &&
                d.remove(a, "dijitValidationTextBox"),
              d.contains(a, "dijitValidationTextBoxError") &&
                d.remove(a, "dijitValidationTextBoxError"),
              d.contains(a, "dijitError") && d.remove(a, "dijitError"),
              (e = m(".dijitValidationContainer", b)),
              g.forEach(e, function(a) {
                a.parentNode.removeChild(a);
              })));
    },
    _removeRedAst: function(a, b) {
      -1 === this._gdbRequiredFields.indexOf(b) &&
        ((a = m("a.asteriskIndicator", a)),
        0 < a.length &&
          g.forEach(a, function(a) {
            a.parentNode.removeChild(a);
          }));
    },
    _removeHideRule: function(a) {
      d.contains(a, "hideField") && d.remove(a, "hideField");
    },
    _removeDisableRule: function(a, b) {
      -1 === this._notEditableFields.indexOf(a) &&
        (d.contains(b, "dijitTextBoxDisabled") &&
          d.remove(b, "dijitTextBoxDisabled"),
        d.contains(b, "dijitComboBoxDisabled") &&
          d.remove(b, "dijitComboBoxDisabled"),
        d.contains(b, "dijitValidationTextBoxDisabled") &&
          d.remove(b, "dijitValidationTextBoxDisabled"),
        d.contains(b, "dijitDisabled") && d.remove(b, "dijitDisabled"));
      this._processChildNodes(b, !1);
    },
    _remove: function(a, b, c, d, l) {
      this._removeRequireFieldMarkings(c, d, l);
      this._removeRedAst(a[0], b);
      this._removeDisableRule(b, c);
      this._removeHideRule(d);
    },
    toggleFieldOnAttributeInspector: function(a, b, c, e) {
      e = "undefined" !== typeof e && null !== e ? e : !0;
      if (
        void 0 === this._gdbRequiredFields ||
        null === this._gdbRequiredFields
      )
        this._gdbRequiredFields = [];
      if (
        void 0 === this._notEditableFields ||
        null === this._notEditableFields
      )
        this._notEditableFields = [];
      if (void 0 !== this._attTable && null !== this._attTable) {
        if (0 < this._attTable.length) {
          var l = q.filter(
              this._attTable,
              n.hitch(this, function(b) {
                return b.childNodes && 0 < b.childNodes.length
                  ? !0 === this.useFieldName
                    ? b.hasAttribute("data-fieldname")
                      ? b.getAttribute("data-fieldname") === a
                      : b.childNodes[0].data === a
                    : b.childNodes[0].data === a
                  : !1;
              })
            ),
            k = null;
          if (null !== l && 0 < l.length) {
            var f = this._getRowInfo(l[0]),
              h = f[0],
              k = f[4],
              g = f[1],
              f = f[2];
            if (void 0 !== f && null !== f)
              switch (b) {
                case "Hide":
                  this._removeRequireFieldMarkings(h, g, f);
                  this._removeRedAst(l[0], a);
                  this._removeDisableRule(a, h);
                  d.add(g, "hideField");
                  break;
                case "Disabled":
                  this._removeRedAst(l[0], a);
                  this._removeHideRule(g);
                  this._removeRequireFieldMarkings(h, g, f);
                  d.add(h, [
                    "dijitValidationTextBox",
                    "dijitTextBoxDisabled",
                    "dijitComboBoxDisabled",
                    "dijitValidationTextBoxDisabled",
                    "dijitDisabled"
                  ]);
                  this._processChildNodes(h, !0);
                  null !== k &&
                    (this._removeRequireFieldMarkings(k, g, f),
                    d.add(k, [
                      "dijitValidationTextBox",
                      "dijitTextBoxDisabled",
                      "dijitComboBoxDisabled",
                      "dijitValidationTextBoxDisabled",
                      "dijitDisabled"
                    ]),
                    this._processChildNodes(k, !0));
                  break;
                case "Required":
                  this._removeDisableRule(a, h);
                  this._removeHideRule(g);
                  !0 === c
                    ? this._removeRequireFieldMarkings(h, g, f)
                    : "dijit.form.TextBox" === f.declaredClass
                    ? ((k = m(".dijitValidationContainer", g)),
                      0 === k.length &&
                        ((b = document.createElement("div")),
                        b.setAttribute(
                          "class",
                          "dijitReset dijitValidationContainer"
                        ),
                        (c = document.createElement("input")),
                        c.setAttribute(
                          "class",
                          "dijitReset dijitInputField dijitValidationIcon dijitValidationInner"
                        ),
                        c.setAttribute("value", "x"),
                        c.setAttribute("type", "text"),
                        c.setAttribute("tabindex", "-1"),
                        c.setAttribute("readonly", "readonly"),
                        c.setAttribute("role", "presentation"),
                        b.appendChild(c),
                        h.insertBefore(b, h.childNodes[0])),
                      d.add(h, [
                        "dijitTextBoxError",
                        "dijitValidationTextBox",
                        "dijitValidationTextBoxError",
                        "dijitError"
                      ]))
                    : "dijit.form.ValidationTextBox" === f.declaredClass
                    ? ((k = m(".dijitValidationContainer", g)),
                      d.add(h, [
                        "dijitTextBoxError",
                        "dijitValidationTextBox",
                        "dijitValidationTextBoxError",
                        "dijitError"
                      ]))
                    : "dijit.form.FilteringSelect" === f.declaredClass
                    ? d.add(h, [
                        "dijitTextBoxError",
                        "dijitComboBoxError",
                        "dijitError",
                        "dijitValidationTextBoxError"
                      ])
                    : d.add(h, ["dijitTextBoxError", "dijitError"]);
                  h = m("a.asteriskIndicator", l[0]);
                  b = m("span.atiRequiredField", l[0]);
                  -1 === this._gdbRequiredFields.indexOf(a) &&
                    0 === h.length &&
                    0 === b.length &&
                    ((h = document.createElement("a")),
                    h.setAttribute("class", "asteriskIndicator"),
                    (h.innerHTML = " *"),
                    l[0].appendChild(h));
                  break;
                case "Value":
                  break;
                default:
                  e && this._remove(l, a, h, g, f);
              }
          }
        }
        this.emit("onFieldToggle");
      }
    }
  });
});
