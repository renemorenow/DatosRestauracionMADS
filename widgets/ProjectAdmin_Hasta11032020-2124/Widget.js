define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "jimu/BaseWidget",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/dom",
  "dojo/on",
  "dojo/dom-construct",
  "dojo/_base/array",
  "dojo/store/Memory",
  "dojo/parser",
  "dojo/Deferred",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dijit/form/DateTextBox",
  "dijit/form/TimeTextBox",
  "dijit/form/TextBox",
  "dijit/form/ComboBox",
  "dijit/form/FilteringSelect",
  "dijit/form/RadioButton",
  "dijit/ConfirmDialog",
  "dgrid/Grid",
  "dgrid/Selection",
  "dgrid/selector",
  "dgrid/extensions/Pagination",
  "dgrid/extensions/ColumnResizer",
  "dgrid/extensions/ColumnHider",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Extent",
  "esri/geometry/Polyline",
  "esri/geometry/geodesicUtils",
  "esri/units",
  "esri/graphic",
  "esri/Color",
  "esri/InfoTemplate",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/graphicsUtils",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/tasks/GeometryService",
  "esri/tasks/ProjectParameters",
  "esri/tasks/StatisticDefinition",
  "esri/SpatialReference",
  "dojo/domReady!"
], function(
  declare,
  lang,
  BaseWidget,
  _WidgetsInTemplateMixin,
  dom,
  on,
  domConstruct,
  array,
  Memory,
  parser,
  Deferred,
  TabContainer,
  ContentPane,
  DateTextBox,
  TimeTextBox,
  TextBox,
  ComboBox,
  FilteringSelect,
  RadioButton,
  ConfirmDialog,
  Grid,
  Selection,
  selector,
  Pagination,
  ColumnResizer,
  ColumnHider,
  FeatureLayer,
  GraphicsLayer,
  Extent,
  Polyline,
  geodesicUtils,
  Units,
  Graphic,
  Color,
  InfoTemplate,
  PictureMarkerSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  SimpleRenderer,
  graphicsUtils,
  Query,
  QueryTask,
  GeometryService,
  ProjectParameters,
  StatisticDefinition,
  SpatialReference
) {
  var widgetAdminProjects;
  var gridProjects;
  var gridStrategies;
  var operation; //I: Inserción,  A: Actualización,  B: Borrado
  var operationStrategy; //I: Inserción,  A: Actualización,  B: Borrado
  var arrayCboAirports;
  var mapLayers;
  var featureLayerAirports;
  var objectIds;
  var graphicsLayerTrajectory;
  var arrayLegs;
  var storeAircrafts;
  var storeAirports;
  var portal;

  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    name: "ProjectAdmin",
    baseClass: "esri-widget-pb",
    projectTypeSelect: null,
    originSelect: null,
    destinationSelect: null,
    postMixInProperties: function() {},

    postCreate: function() {
      this.inherited(arguments);
      console.log("postCreate");
      //SET EL TAMAÑO DEL PANEL
      //var panel = this.getPanel();
      //var pos = panel.position;
      //pos.top = 40;
      //pos.left = 10;
      //console.log(pos);
      //panel.setPosition(pos);
      //panel.panelManager.normalizePanel(panel);
    },

    startup: function() {
      this.inherited(arguments);
      console.log("startup Widget");
      widgetAdminProjects = this;
      portal = this;
      widgetAdminProjects.objectIds = [];
      this.loadGridProjects();
      this.loadProjects();
      this.loadProjectTypes();
      this.loadGridStrategies();
      //this.loadAirports();
      this.graphicsLayerTrajectory = new GraphicsLayer({
        id: "FlightTrajectory"
      });
      var infoTemplate = new esri.InfoTemplate("${name}", "${description}");
      this.graphicsLayerTrajectory.setInfoTemplate(infoTemplate);
      this.map.addLayer(this.graphicsLayerTrajectory);
    },

    onOpen: function() {
      console.log("onOpen");
      this.toggleGridProjects(true);
      this.toggleGridStrategies(true);
      // this.getMapLayer(widgetAdminProjects.config.urlAirportsGisService);
      this.getMapLayer(widgetAdminProjects.config.urlProjectsService);
      //this.setSelectionSymbol(this.featureLayerAirports);
    },

    onClose: function() {
      console.log("onClose");
    },

    onMinimize: function() {
      console.log("onMinimize");
    },

    onMaximize: function() {
      console.log("onMaximize");
    },

    onSignIn: function(credential) {
      /* jshint unused:false*/
      console.log("onSignIn");
    },

    onSignOut: function() {
      console.log("onSignOut");
    },

    loadGridProjects: function() {
      var divGrid = dojo.byId("gridProjects");
      divGrid.innerHTML = "";

      this.gridProjects = new (declare([
        Grid,
        Selection,
        Pagination,
        ColumnResizer,
        ColumnHider
      ]))(
        {
          selectionMode: "single",
          store: Memory({
            idProperty: "IdFlightOrder"
          }),
          columns: {
            btnEdit: {
              id: "btnEdit",
              label: "", //wasn't able to inject an HTML <div> with image here
              field: "IdFlightOrder",
              formatter: this.createEditButton,
              width: "35",
              resizable: "false"
            },
            IdFlightOrder: {
              label: widgetAdminProjects.nls.IdFlightOrder,
              hidden: "true"
            },
            ProjectType: {
              label: widgetAdminProjects.nls.ProjectType,
              width: "70",
              resizable: "true"
            },
            ProjectValue: {
              label: widgetAdminProjects.nls.ProjectValue,
              width: "90",
              resizable: "true",
              formatter: this.formatDate
            },
            ExecuteEntity: {
              label: widgetAdminProjects.nls.ExecuteEntity,
              width: "70",
              resizable: "true"
            },
            FinancialEntity: {
              label: widgetAdminProjects.nls.FinancialEntity,
              resizable: "true"
            }
          }
          /*sort: sortAttr*/
        },
        "gridProjects"
      );

      this.gridProjects.on(".field-IdFlightOrder:click", this.selectFlighPlan);
      //this.grid.store.setData([]);
      //this.grid.refresh();
    },

    loadProjects: function(Memory) {
      try {
        queryTask = new QueryTask(
          widgetAdminProjects.config.urlProjectsService
        );
        var query = new Query();
        query = new esri.tasks.Query();
        query.returnGeometry = false;
        query.outFields = ["*"];
        query.where = "1=1";
        queryTask.execute(query).then(function(featureSet) {
          if (featureSet.features.length > 0) {
            var dataFlightPlans = array.map(featureSet.features, function(
              flightPlan
            ) {
              // var projectType = featureSet.fields
              //   .find(element => element.name == "type")
              //   .hasOwnProperty("domain")
              //   ? featureSet.fields
              //       .find(element => element.name == "type")
              //       .domain.codedValues.find(
              //         element =>
              //           element.code == flightPlan.attributes.type
              //       ).name
              //     : flightPlan.attributes.type;
              var projectType;
              if (flightPlan.attributes.type != "") {
                projectType = featureSet.fields
                  .find(element => element.name == "type")
                  .hasOwnProperty("domain")
                  ? featureSet.fields
                      .find(element => element.name == "type")
                      .domain.codedValues.find(
                        element => element.code == flightPlan.attributes.type
                      ).name
                  : flightPlan.attributes.type;
              }
              return {
                // property names used here match those used when creating the dgrid
                btnEdit: flightPlan.attributes.ID_PROJECT,
                IdFlightOrder: flightPlan.attributes.ID_PROJECT,
                ProjectType: projectType,
                ProjectValue: flightPlan.attributes.proj_value,
                ExecuteEntity: flightPlan.attributes.execute_ent,
                FinancialEntity: flightPlan.attributes.financial_ent
              };
            });
            widgetAdminProjects.gridProjects.store.setData(dataFlightPlans);
            widgetAdminProjects.gridProjects.refresh();
          } else {
            console.log("No se encontraron registros de planes de vuelos!");
          }
        });
      } catch (e) {
        alert(e.toString());
        //this.showProcessing(false, "")
      }
    },

    loadGridStrategies: function() {
      var divGrid = dojo.byId("gridStrategies");
      divGrid.innerHTML = "";

      this.gridStrategies = new (declare([
        Grid,
        Selection,
        Pagination,
        ColumnResizer,
        ColumnHider
      ]))(
        {
          selectionMode: "single",
          store: Memory({
            idProperty: "IdStrategy"
          }),
          columns: {
            btnEdit: {
              id: "btnEdit",
              label: "", //wasn't able to inject an HTML <div> with image here
              field: "IdStrategy",
              formatter: this.createEditButton,
              width: "35",
              resizable: "false"
            },
            Approach: {
              label: widgetAdminProjects.nls.Approach,
              width: "70",
              resizable: "true"
            },
            Strategy: {
              label: widgetAdminProjects.nls.Strategy,
              width: "90",
              resizable: "true",
              formatter: this.formatDate
            },
            Area: {
              label: widgetAdminProjects.nls.Area,
              width: "70",
              resizable: "true"
            }
          }
          /*sort: sortAttr*/
        },
        "gridStrategies"
      );

      //this.gridStrategies.on(".field-IdStrategy:click", this.selectFlighPlan);
      this.gridStrategies.store.setData([]);
      dojo.style(dojo.byId("gridStrategies"), "height", "250px");
      this.gridStrategies.refresh();
    },

    createEditButton: function(id) {
      var zBtn =
        "<div style='vertical-align:middle; text-align:center; padding:0px' data-dojo-type='dijit/form/Button'><img src='" +
        window.path +
        "/widgets/FlightPlan/images/iconEdit.png' alt='" +
        id +
        "'";
      zBtn = zBtn + " width='16' height='16'></div>";
      return zBtn;
    },

    createDeleteButton: function(id) {
      var zBtn =
        "<div style='vertical-align:middle; text-align:center; padding:0px' data-dojo-type='dijit/form/Button'><img src='" +
        window.path +
        "/widgets/FlightPlan/images/iconDelete.png' alt='" +
        id +
        "'";
      zBtn = zBtn + " width='16' height='16'></div>";
      return zBtn;
    },

    loadProjectTypes: function() {
      //debugger;
      var arrayCboAircrafts = new Array();
      // debugger;
      queryTask = new QueryTask(widgetAdminProjects.config.urlProjectsService);
      var query = new Query();
      query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.outFields = ["*"];
      query.where = "1=1";
      // query.orderByFields = ["MATRICULA"];
      //arrayCboAircrafts.push({ value: "-1", name: "-Seleccione el vuelo-" });
      queryTask.execute(query).then(function(featureSet) {
        if (
          featureSet.fields.find(element => element.name == "type").domain
            .codedValues.length > 0
        ) {
          dojo.forEach(
            featureSet.fields.find(element => element.name == "type").domain
              .codedValues,
            dojo.hitch(this, function(feature) {
              arrayCboAircrafts.push({
                value: feature.code,
                name: feature.name
              });
            })
          );
        }
        widgetAdminProjects.storeAircrafts = new Memory({
          data: arrayCboAircrafts
        });

        widgetAdminProjects.projectTypeSelect = new FilteringSelect(
          {
            id: "projectTypeSelect",
            name: "aircrafts",
            value: "code",
            store: widgetAdminProjects.storeAircrafts,
            searchAttr: "name"
          },
          "projectTypeSelect"
        ).startup();
        projectTypeSelect.defaultValue = "Seleccione una opción";
      });
    },

    loadEnfoque: function() {
      //debugger;
      var arrayCboAircrafts = new Array();
      // debugger;
      queryTask = new QueryTask(widgetAdminProjects.config.urlProjectsService);
      var query = new Query();
      query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.outFields = ["Enfoque"];
      query.returnDistinctValues = true;
      query.where = "1=1";
      queryTask.execute(query).then(function(featureSet) {
        if (
          featureSet.fields.find(element => element.name == "type").domain
            .codedValues.length > 0
        ) {
          dojo.forEach(
            featureSet.fields.find(element => element.name == "type").domain
              .codedValues,
            dojo.hitch(this, function(feature) {
              arrayCboAircrafts.push({
                value: feature.code,
                name: feature.name
              });
            })
          );
        }
        widgetAdminProjects.storeAircrafts = new Memory({
          data: arrayCboAircrafts
        });

        widgetAdminProjects.projectTypeSelect = new FilteringSelect(
          {
            id: "projectTypeSelect",
            name: "aircrafts",
            value: "code",
            store: widgetAdminProjects.storeAircrafts,
            searchAttr: "name"
          },
          "projectTypeSelect"
        ).startup();
        aircraftsSelect.defaultValue = "Seleccione una opción";
      });
    },

    selectFlighPlan: function(e) {
      //debugger;

      var row = widgetAdminProjects.gridFlightPlans.row(e);
      widgetAdminProjects.gridFlightPlans.select(row);

      widgetAdminProjects.ProjectName.setValue(row.data.ProjectType);
      projectTypeSelect.value = row.data.ExecuteEntity;
      //originSelect.value = row.data.From;
      //destinationSelect.value = row.data.To;

      widgetAdminProjects.operation = "A";
      widgetAdminProjects.toggleDivGridCreate(false);
    },

    toggleGridProjects: function(showGrid) {
      var tabContainerProjectData = dojo.byId("tabContainerProjectData");
      var divGridProjects = dojo.byId("divGridProjects");
      //var divButtonsCreateFlightPlan = dojo.byId("divButtonsCreateFlightPlan");
      if (showGrid) {
        tabContainerProjectData.style.display = "none";
        //divButtonsCreateFlightPlan.style.display = "none";
        divGridProjects.style.display = "inline";
      } else {
        tabContainerProjectData.style.display = "inline";
        //divButtonsCreateFlightPlan.style.display = "block";
        divGridProjects.style.display = "none";
      }
    },

    toggleGridStrategies: function(showGrid) {
      var divStrategyData = dojo.byId("divCreateStrategy");
      var divGridStrategies = dojo.byId("divGridStrategies");
      //var divButtonsCreateFlightPlan = dojo.byId("divButtonsCreateFlightPlan");
      if (showGrid) {
        divStrategyData.style.display = "none";
        //divButtonsCreateFlightPlan.style.display = "none";
        divGridStrategies.style.display = "inline";
      } else {
        divStrategyData.style.display = "inline";
        //divButtonsCreateFlightPlan.style.display = "block";
        divGridStrategies.style.display = "none";
      }
    },

    createProject: function() {
      widgetAdminProjects.operation = "I";
      widgetAdminProjects.toggleGridProjects(false);
    },

    cancelCreateProject: function() {
      //widgetActivityReport.cleanForm();
      widgetAdminProjects.toggleGridProjects(true);
    },

    createStrategy: function() {
      widgetAdminProjects.operationStrategy = "I";
      widgetAdminProjects.toggleGridStrategies(false);
    },

    cancelCreateStrategy: function() {
      //widgetActivityReport.cleanForm();
      widgetAdminProjects.toggleGridStrategies(true);
    },

    backRestaurationAreas: function() {
      var tabContainer = dijit.byId("tabContainerProjectData");
      tabContainer.selectChild(dijit.byId("tabDetailsProject"));
    },

    addRestaurationAreas: function() {
      var tabContainer = dijit.byId("tabContainerProjectData");
      tabContainer.selectChild(dijit.byId("tabRestaurationAreas"));
    },

    getMapLayer: function(urlLayer) {
      //debugger;
      mapLayers = [];
      dojo.some(widgetAdminProjects.map.graphicsLayerIds, function(layerId) {
        var serviceLayer = widgetAdminProjects.map.getLayer(layerId);
        if (serviceLayer.url == urlLayer) {
          widgetAdminProjects.featureLayerAirports = serviceLayer;
        }
        //if ("layerInfos" in serviceLayer) {
        //    dojo.forEach(serviceLayer.layerInfos, function (layerInfo) {
        //        mapLayers.push({
        //            name: layerInfo.name,
        //            mapService: serviceLayer.id,
        //            layerId: layerInfo.id
        //        });
        //    });
        //}
      });
    },

    setSelectionSymbol: function(featureLayer) {
      debugger;

      var symbolSelAirport = new PictureMarkerSymbol({
        url:
          "https://project-esri-co.maps.arcgis.com/sharing/rest/content/items/e2cadff6638a4292a1a600aa3f3b1035/data",
        height: 25,
        width: 25,
        type: "esriPMS"
      });
      //var symbol = new SimpleMarkerSymbol(
      //    SimpleMarkerSymbol.STYLE_CIRCLE,
      //    12,
      //    new SimpleLineSymbol(
      //        SimpleLineSymbol.STYLE_NULL,
      //        new Color([247, 34, 101, 0.9]),
      //        1
      //    ),
      //    new Color([207, 34, 171, 0.5])
      //);
      featureLayer.setSelectionSymbol(symbolSelAirport);
    },

    _applyEdits: function(c, f) {
      c = c || [];
      if (!(0 >= c.length)) {
        this._edits = this._oEdits = c;
        var b = [];
        h.forEach(c, function(a) {
          a.layer && b.push(a.layer.applyEdits(a.adds, a.updates, a.deletes));
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

    applyEditProject: function() {
      debugger;

      var aircraftsSelect = dijit.byId("aircraftsSelect").item.value;

      var txtEstablishmentDate = new Date(this.txtEstablishmentDate.value);

      var attributesFeature = {};
      attributesFeature.name = this.txtFlightPlanName.value;
      attributesFeature.type = this.aircraftsSelect.value;
      attributesFeature.financial_ent = this.txtFinancialEntity.value;
      attributesFeature.execute_ent = this.txtExecuteEntity.value;
      attributesFeature.establishment = new Date(
        this.txtEstablishmentDate.value
      );
      attributesFeature.lead_time = parseInt(this.txtLeadTime.value);
      attributesFeature.proj_value = parseFloat(this.txtProjectValue.value);
      attributesFeature.comment = this.txtComment.value;
      attributesFeature.budget_code = this.txtBudgetCode.value;

      // var featureLayer = new FeatureLayer(
      //   "https://services6.arcgis.com/hxAwRYAu9QHliJ8T/arcgis/rest/services/GBD_RESTAURACION/FeatureServer/2"
      // );
      var featureLayer = new FeatureLayer(
        widgetAdminProjects.config.urlProjectsService
      );
      this.getNextObjectID(featureLayer, "ID_PROJECT").then(
        lang.hitch(this, function(nextID) {
          debugger;
          console.log("nextID:" + nextID);
          attributesFeature.ID_PROJECT = nextID;
          var params = {
            attributes: attributesFeature
          };
          featureLayer
            .applyEdits([params])
            .then(function(editsResult) {
              debugger;
              if (editsResult.addResults[0].success) {
                const objectId = editsResult.addResults[0].objectId;
                dom.byId("divResult").innerHTML =
                  "Registro creado satisfactoriamente";
                // selectFeature(objectId);
                this.applyEditStrategies(nextID);
                this.applyEditSpecies(nextID);
              }
            })
            .catch(function(error) {
              console.log("===============================================");
              console.error(
                "[ applyEdits ] FAILURE: ",
                error.code,
                error.name,
                error.message
              );
              console.log("error = ", error);
            });
        })
      );
    },

    applyEditStrategies: function(ID_PROJECT) {
      debugger;

      var aircraftsSelect = dijit.byId("aircraftsSelect").item.value;

      var txtEstablishmentDate = new Date(this.txtEstablishmentDate.value);

      var attributesFeature = {};
      attributesFeature.name = this.txtFlightPlanName.value;
      attributesFeature.type = this.aircraftsSelect.value;
      attributesFeature.financial_ent = this.txtFinancialEntity.value;
      attributesFeature.execute_ent = this.txtExecuteEntity.value;
      attributesFeature.establishment = new Date(
        this.txtEstablishmentDate.value
      );
      attributesFeature.lead_time = parseInt(this.txtLeadTime.value);
      attributesFeature.proj_value = parseFloat(this.txtProjectValue.value);
      attributesFeature.comment = this.txtComment.value;
      attributesFeature.budget_code = this.txtBudgetCode.value;

      var featureLayer = new FeatureLayer(
        widgetAdminProjects.config.urlProjetStrategiesService
      );
      debugger;
      console.log("ID_PROJECT:" + ID_PROJECT);
      attributesFeature.ID_PROJECT = ID_PROJECT;
      var params = {
        attributes: attributesFeature
      };
      featureLayer
        .applyEdits([params])
        .then(function(editsResult) {
          debugger;
          if (editsResult.addResults[0].success) {
            const objectId = editsResult.addResults[0].objectId;
            dom.byId("divResult").innerHTML =
              "Registro creado satisfactoriamente";
            // selectFeature(objectId);
          }
        })
        .catch(function(error) {
          console.log("===============================================");
          console.error(
            "[ applyEdits ] FAILURE: ",
            error.code,
            error.name,
            error.message
          );
          console.log("error = ", error);
        });
    },
    applyEditSpecies: function(ID_PROJECT) {
      debugger;

      var aircraftsSelect = dijit.byId("aircraftsSelect").item.value;

      var txtEstablishmentDate = new Date(this.txtEstablishmentDate.value);

      var attributesFeature = {};
      attributesFeature.name = this.txtFlightPlanName.value;
      attributesFeature.type = this.aircraftsSelect.value;
      attributesFeature.financial_ent = this.txtFinancialEntity.value;
      attributesFeature.execute_ent = this.txtExecuteEntity.value;
      attributesFeature.establishment = new Date(
        this.txtEstablishmentDate.value
      );
      attributesFeature.lead_time = parseInt(this.txtLeadTime.value);
      attributesFeature.proj_value = parseFloat(this.txtProjectValue.value);
      attributesFeature.comment = this.txtComment.value;
      attributesFeature.budget_code = this.txtBudgetCode.value;

      var featureLayer = new FeatureLayer(
        widgetAdminProjects.config.urlProyectoSpeciesService
      );
      debugger;
      console.log("ID_PROJECT:" + ID_PROJECT);
      attributesFeature.ID_PROJECT = ID_PROJECT;
      var params = {
        attributes: attributesFeature
      };
      featureLayer
        .applyEdits([params])
        .then(function(editsResult) {
          debugger;
          if (editsResult.addResults[0].success) {
            const objectId = editsResult.addResults[0].objectId;
            dom.byId("divResult").innerHTML =
              "Registro creado satisfactoriamente";
            // selectFeature(objectId);
          }
        })
        .catch(function(error) {
          console.log("===============================================");
          console.error(
            "[ applyEdits ] FAILURE: ",
            error.code,
            error.name,
            error.message
          );
          console.log("error = ", error);
        });
    }
  });
});
