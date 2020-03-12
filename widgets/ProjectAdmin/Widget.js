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
  var storeProjectTypes;
  var storeApproaches;

  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    name: "ProjectAdmin",
    baseClass: "esri-widget-pb",
    projectTypeSelectSearch: null,
    projectTypeSelect: null,
    approachesSelect: null,
    originSelect: null,
    destinationSelect: null,
    postMixInProperties: function() {},

    postCreate: function() {
      this.inherited(arguments);
      console.log("postCreate");
    },

    startup: function() {
      this.inherited(arguments);
      console.log("startup Widget");
      widgetAdminProjects = this;
      portal = this;
      widgetAdminProjects.objectIds = [];
      this.loadGridProjects();
      this.loadProjects();
      this.loadSelectProjectTypes();
      this.loadSelectApproaches();
      this.loadGridStrategies();
    },

    onOpen: function() {
      console.log("onOpen");
      this.toggleGridProjects(true);
      this.toggleGridStrategies(true);
      // this.getMapLayer(widgetAdminProjects.config.urlAirportsGisService);
      //this.getMapLayer(widgetAdminProjects.config.urlProjectsService);
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
              idProperty: "IdProject",
              OBJECTID: "OBJECTID"
          }),
          columns: {
            btnEdit: {
              id: "btnEdit",
              label: "Ver", //wasn't able to inject an HTML <div> with image here
              field: "IdProject",
              formatter: this.createEditButton,
              width: "60",
              resizable: "false"
              },
              btnDelete: {
                id: "btnDelete",
                label: "Ver", //wasn't able to inject an HTML <div> with image here
                field: "OBJECTID",
                formatter: this.createDeleteButton,
                width: "60",
                resizable: "false"
                },
            IdProject: {
              label: widgetAdminProjects.nls.IdProject,
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
      this.gridProjects.on(".field-IdProject:click", this.selectProject);
      this.gridProjects.on(".field-OBJECTID:click", this.deleteProject);
      // this.gridProjects.on(".field-OBJECTID:click", lang.hitch(this, function (approachesSelect) {
      //   var featureLayer = new FeatureLayer(
      //     widgetAdminProjects.config.urlProjectsService
      //   );
      //   var attributesFeature = {
      //       OBJECTID : e.srcElement.alt
      //   }
      //   var params = {
      //       deleteFeatures: [attributesFeature]
      //   };
      //   this.applyEditsProject(featureLayer, params);
      // })
      // );
      
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
            var dataProjects = array.map(featureSet.features, function(
              project
            ) {
              var projectType;
              if (project.attributes.type != "") {
                projectType = featureSet.fields
                  .find(element => element.name == "type")
                  .hasOwnProperty("domain")
                  ? featureSet.fields
                      .find(element => element.name == "type")
                      .domain.codedValues.find(
                        element => element.code == project.attributes.type
                      ).name
                  : project.attributes.type;
              }
              return {
                // property names used here match those used when creating the dgrid
                btnEdit: project.attributes.ID_PROJECT,
                btnDelete: project.attributes.OBJECTID,
                OBJECTID: project.attributes.OBJECTID,
                IdProject: project.attributes.ID_PROJECT,
                ProjectType: projectType,
                ProjectValue: project.attributes.proj_value,
                ExecuteEntity: project.attributes.execute_ent,
                FinancialEntity: project.attributes.financial_ent
              };
            });
            widgetAdminProjects.gridProjects.store.setData(dataProjects);
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
        "/widgets/ProjectAdmin/images/iconEdit.png' alt='" +
        id +
        "'";
      zBtn = zBtn + " width='16' height='16'></div>";
      return zBtn;
    },

    createDeleteButton: function(id) {
      var zBtn =
        "<div style='vertical-align:middle; text-align:center; padding:0px' data-dojo-type='dijit/form/Button'><img src='" +
        window.path +
        "/widgets/ProjectAdmin/images/iconDelete.png' alt='" +
        id +
        "'";
      zBtn = zBtn + " width='16' height='16'></div>";
      return zBtn;
    },

    loadSelectProjectTypes: function() {
      var arrayToMemory = new Array();
      queryTask = new QueryTask(widgetAdminProjects.config.urlProjectsService);
      var query = new Query();
      query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.outFields = ["*"];
      query.where = "1=1";
      // query.orderByFields = ["MATRICULA"];
      queryTask.execute(query).then(function(featureSet) {
        if (
          featureSet.fields.find(element => element.name == "type").domain
            .codedValues.length > 0
        ) {
          dojo.forEach(
            featureSet.fields.find(element => element.name == "type").domain
              .codedValues,
            dojo.hitch(this, function(feature) {
              arrayToMemory.push({
                value: feature.code,
                name: feature.name
              });
            })
          );
        }
        widgetAdminProjects.projectTypes = new Memory({
          data: arrayToMemory
        });

        //Lista para filtro de búsquedas de proyectos
        widgetAdminProjects.projectTypeSelectSearch = new FilteringSelect(
          {
            id: "projectTypeSelectSearch",
            name: "projectTypeSelectSearch",
            value: "",
            required: false,
            store: widgetAdminProjects.projectTypes,
            searchAttr: "name",
            style: "width:auto"
          },
          "projectTypeSelectSearch"
        ).startup();
        projectTypeSelectSearch.defaultValue = "Seleccione una opción";

        //Lista de creación edicion de proyectos
        widgetAdminProjects.projectTypeSelect = new FilteringSelect(
          {
            id: "projectTypeSelect",
            name: "projectTypeSelect",
            value: "",
            required: true,
            store: widgetAdminProjects.projectTypes,
            searchAttr: "name",
            style: "width:auto"
          },
          "projectTypeSelect"
        ).startup();
        projectTypeSelect.defaultValue = "Seleccione una opción";
      });
    },

    loadSelectApproaches: function() {
      //debugger;
      var arrayToMemory = new Array();
      // debugger;
      queryTask = new QueryTask(
        widgetAdminProjects.config.urlApproachStrategiesService
      );
      var query = new Query();
      query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.outFields = ["Enfoque"];
      query.returnDistinctValues = true;
      query.where = "1=1";
      queryTask.execute(query).then(function(featureSet) {
        if (featureSet.features.length > 0) {
          dojo.forEach(
            featureSet.features,
            dojo.hitch(this, function(feature) {
              arrayToMemory.push({
                value: feature.attributes.Enfoque,
                name: feature.attributes.Enfoque
              });
            })
          );
        }
        widgetAdminProjects.storeSelectApproach = new Memory({
          data: arrayToMemory
        });

        var filteringSelect = new FilteringSelect(
          {
            id: "approachesSelect",
            // onChange: function (value)
            // {
            //     console.log("project Id: ", this.get("value"))
            //     loadSelectStrategies(value,satpcontext);
            // },
            name: "approachesSelect",
            value: "Enfoque",
            store: widgetAdminProjects.storeSelectApproach,
            searchAttr: "name",
            required: true,
            intermediateChanges: true,
            onChange: lang.hitch(this, function(approachesSelect) {
              console.log("project Id: ", this.get("value"));
              this.loadSelectStrategies(approachesSelect);
              // dijit.byId('strategySelect').query.state = this.item.approachesSelect || /.*/;
              // dijit.byId('strategySelect').query.state = this.item.approachesSelect || /.*/;
            })
          },
          "approachesSelect"
        ); //.startup();
        filteringSelect.startup();
        filteringSelect.watch(
          "displayedValue",
          lang.hitch(
            this,
            this.approachesSelectHandler,
            this.approachesSelect.value
          )
        );
        //     .on(widgetAdminProjects.approachesSelect, 'change', function (value) {
        //     console.log(value);
        //   });
        // dojo.connect(widgetAdminProjects.approachesSelect, 'onChange', function(value){console.log(value)});
        approachesSelect.defaultValue = "Seleccione una opción";
      });
    },

    approachesSelectHandler: function(who, property, oldValue, newValue) {
      console.info(who, property, oldValue, newValue);
    },

    loadSelectStrategies: function(approach) {
      debugger;
      var arrayToMemory = new Array();
      // debugger;
      queryTask = new QueryTask(
        widgetAdminProjects.config.urlApproachStrategiesService
      );
      var query = new Query();
      query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.outFields = ["Enfoque"];
      query.returnDistinctValues = true;
      query.where = "Enfoque='" + approach + "'";
      queryTask.execute(query).then(function(featureSet) {
        if (featureSet.features.length > 0) {
          dojo.forEach(
            featureSet.features,
            dojo.hitch(this, function(feature) {
              arrayToMemory.push({
                value: feature.attributes.ID_ENF_ESTG,
                name: feature.attributes.Estrategias
              });
            })
          );
        }
        widgetAdminProjects.storeSelectApproach = new Memory({
          data: arrayToMemory
        });

        widgetAdminProjects.strategySelect = new FilteringSelect(
          {
            id: "strategySelect",
            name: "strategy",
            value: "ID_ENF_ESTG",
            store: widgetAdminProjects.storeAircrafts,
            searchAttr: "name"
          },
          "strategySelect"
        ).startup();
        strategySelect.defaultValue = "Seleccione una opción";
      });
    },

    selectProject: function(e) {
      //debugger;
      var row = widgetAdminProjects.gridProjects.row(e);
      widgetAdminProjects.gridProjects.select(row);

      widgetAdminProjects.txtProjectName.setValue(row.data.ProjectType);
      projectTypeSelect.value = row.data.ExecuteEntity;
      //originSelect.value = row.data.From;
      //destinationSelect.value = row.data.To;

      widgetAdminProjects.operation = "A";
      widgetAdminProjects.toggleGridProjects(false);
      },
    
    deleteProject: function(e) {
        debugger;
            
        var featureLayer = new FeatureLayer(
            widgetAdminProjects.config.urlProjectsService
        );
        var attributesFeature = {
            OBJECTID : e.srcElement.alt
        }
        var params = {
          deletes: e.srcElement.alt
        };
        widgetAdminProjects.applyEditsProject(featureLayer, params);
        

    },

    toggleGridProjects: function(showGrid) {
      var tabContainerProjectData = dojo.byId("tabContainerProjectData");
      var divGridProjects = dojo.byId("divGridProjects");
      var divNavegacion = dojo.byId("divNavegacion");
      //var divButtonsCreateFlightPlan = dojo.byId("divButtonsCreateFlightPlan");
      if (showGrid) {
        tabContainerProjectData.style.display = "none";
        divNavegacion.style.display = "none";
        divGridProjects.style.display = "inline";
      } else {
        tabContainerProjectData.style.display = "inline";
        divNavegacion.style.display = "block";
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

    goBack: function() {
      //debugger;
      var tabContainer = dijit.byId("tabContainerProjectData");
      if (tabContainer.selectedChildWidget == dijit.byId("tabDetailsProject")) {
        widgetAdminProjects.toggleGridProjects(true);
      } else if (
        tabContainer.selectedChildWidget == dijit.byId("tabStrategies")
      ) {
        tabContainer.selectChild(dijit.byId("tabDetailsProject"));
      } else if (
        tabContainer.selectedChildWidget == dijit.byId("tabRestaurationAreas")
      ) {
        tabContainer.selectChild(dijit.byId("tabStrategies"));
      }
    },

    goNext: function() {
      //debugger;
      var tabContainer = dijit.byId("tabContainerProjectData");
      if (tabContainer.selectedChildWidget == dijit.byId("tabDetailsProject")) {
        tabContainer.selectChild(dijit.byId("tabStrategies"));
      } else if (
        tabContainer.selectedChildWidget == dijit.byId("tabStrategies")
      ) {
        tabContainer.selectChild(dijit.byId("tabRestaurationAreas"));
      }
    },

    createStrategy: function() {
      widgetAdminProjects.operationStrategy = "I";
      widgetAdminProjects.toggleGridStrategies(false);
    },

    cancelCreateStrategy: function() {
      //widgetActivityReport.cleanForm();
      widgetAdminProjects.toggleGridStrategies(true);
    },

    searchProjects: function() {},

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

    getNextObjectID: function getNextObjectID(layerObject, field) {
      debugger;
      var def = new Deferred();
      var query = new Query();
      query.where = "1=1";
      if (layerObject.url === "") {
        def.resolve(null);
      }
      var statDef = new StatisticDefinition();
      statDef.statisticType = "max";
      statDef.onStatisticField = field;
      statDef.outStatisticFieldName = "MAX_" + field;

      query.returnGeometry = false;
      query.outStatistics = [statDef];
      // console.info(this.uri);
      var queryTask = new QueryTask(layerObject.url);
      queryTask.execute(
        query,
        lang.hitch(this, function(respond) {
          if (respond && respond.features.length > 0) {
            if (
              typeof respond.features[0].attributes[
                statDef.outStatisticFieldName
              ] === "number"
            ) {
              def.resolve(
                respond.features[0].attributes[statDef.outStatisticFieldName] +
                  1
              );
            }
          } else {
            def.resolve(1);
          }
          def.resolve(null);
        }),
        lang.hitch(this, function(err) {
          def.resolve(null);
        })
      );
      return def;
    },

    saveProject: function() {
      //debugger;
      var f = dojo.byId("frmMissionPlanning");
      var _projectTypeSelect = dijit.byId("projectTypeSelect").item.value;
      var attributesFeature = {};
      attributesFeature.name = this.txtProjectName.value;
      attributesFeature.type = dijit.byId("projectTypeSelect").item.value;
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
        widgetAdminProjects.config.urlProjectsService
      );
      var params = {};
      if (widgetAdminProjects.operation == "A") {
        this.getNextObjectID(featureLayer, "ID_PROJECT").then(
          lang.hitch(this, function(nextID) {
            debugger;
            console.log("nextID:" + nextID);
            attributesFeature.ID_PROJECT = nextID;
            params = {
              addFeatures: [attributesFeature]
            };
            this.applyEditsProject(featureLayer, params);
            params = {};
            return;
          })
        );
      } else if (widgetAdminProjects.operation == "U") {
        params = {
          updateFeatures: [attributesFeature]
        };
      } else if (widgetAdminProjects.operation == "D") {
        params = {
          deleteFeatures: [attributesFeature]
        };
      }
      this.applyEditsProject(featureLayer, params);
      },
    
      addStrategy: function (ID_PROJECT) {
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
            .then(function (editsResult) {
                debugger;
                if (editsResult.addResults[0].success) {
                    const objectId = editsResult.addResults[0].objectId;
                    dom.byId("divResult").innerHTML =
                        "Registro creado satisfactoriamente";
                    // selectFeature(objectId);
                }
            })
            .catch(function (error) {
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
    

    applyEditsProject: function(featureLayer, params) {
      debugger;
      featureLayer
        .applyEdits(params)
        .then(function(editsResult) {
          debugger;
          if (editsResult.addFeatureResults.length > 0) {
            dom.byId("divResult").innerHTML =
              widgetAdminProjects.nls.CreateRecord;
            this.saveEditStrategies(params.attributes.ID_PROJECT);
            this.saveEditSpecies(params.attributes.ID_PROJECT);
          } else if (editsResult.updateFeatureResults.length > 0) {
            dom.byId("divResult").innerHTML =
              widgetAdminProjects.nls.UpdateRecord;
          } else if (editsResult.deleteResults.length > 0) {
            this.saveEditStrategies(params.attributes.ID_PROJECT);
            // this.saveEditSpecies(params.attributes.ID_PROJECT);
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
