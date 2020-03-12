define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'jimu/BaseWidget',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom',
    "dojo/on",
    'dojo/dom-construct',
    "dojo/_base/array",
    'dojo/store/Memory',
    "dojo/parser",
    "dojo/Deferred",
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    'dijit/form/DateTextBox',
    'dijit/form/TimeTextBox',
    'dijit/form/TextBox',
    'dijit/form/ComboBox',
    'dijit/form/FilteringSelect',
    'dijit/form/RadioButton',
    "dijit/ConfirmDialog",
    "dgrid/Grid",
    "dgrid/Selection",
    "dgrid/selector",
    'dgrid/extensions/Pagination',
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
    'esri/InfoTemplate',
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/graphicsUtils",  
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/tasks/StatisticDefinition",
    "esri/SpatialReference",
    "dojo/domReady!"],
    function (
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
        SpatialReference) {

        var widgetFlightPlan;
        var gridFlightPlans;
        var operation;  //I: Inserción,  A: Actualización,  B: Borrado
        var operationLeg;  //I: Inserción,  A: Actualización,  B: Borrado
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
            name: 'FlightPlan',
            baseClass: 'esri-widget-pb',
            aircraftsSelect: null,
            originSelect: null,
            destinationSelect: null,
            postMixInProperties: function () {
            },

            postCreate: function () {
                this.inherited(arguments);
                console.log('postCreate');
                //SET EL TAMAÑO DEL PANEL
                var panel = this.getPanel();
                var pos = panel.position;
                pos.width = 800;
                pos.height = 600;
                pos.top = 40;
                pos.left = 10;
                //console.log(pos);
                panel.setPosition(pos);
                panel.panelManager.normalizePanel(panel);
            },

            startup: function () {
                this.inherited(arguments);
                console.log('startup Widget');
                widgetFlightPlan = this;
                portal = this;
                widgetFlightPlan.objectIds = []
                this.loadGridFlightPlans();
                this.loadFlightPlans();
                this.loadAircrafts();
                this.loadAirports();
                this.graphicsLayerTrajectory = new GraphicsLayer({ id: "FlightTrajectory" });
                var infoTemplate = new esri.InfoTemplate("${name}", "${description}");
                this.graphicsLayerTrajectory.setInfoTemplate(infoTemplate);
                this.map.addLayer(this.graphicsLayerTrajectory);
                
            },

            onOpen: function () {
                console.log('onOpen');
                this.toggleDivGridCreate(true);
                var panel = this.getPanel();
                var pos = panel.position;
                pos.width = 780;
                pos.height = 500;
                panel.setPosition(pos);
                panel.panelManager.normalizePanel(panel);
                // this.getMapLayer(widgetFlightPlan.config.urlAirportsGisService);
                this.getMapLayer(widgetFlightPlan.config.urlFlightPlansService);
                //this.setSelectionSymbol(this.featureLayerAirports);
            },

            onClose: function () {
                console.log('onClose');
            },

            onMinimize: function () {
                console.log('onMinimize');
            },

            onMaximize: function () {
                console.log('onMaximize');
            },

            onSignIn: function (credential) {
                /* jshint unused:false*/
                console.log('onSignIn');
            },

            onSignOut: function () {
                console.log('onSignOut');
            },

            loadGridFlightPlans: function () {
                var divGrid = dojo.byId("gridFlightPlans");
                divGrid.innerHTML = "";

                this.gridFlightPlans = new (declare([Grid, Selection, Pagination, ColumnResizer, ColumnHider]))({
                    selectionMode: 'single',
                    store: Memory({
                        idProperty: "IdFlightOrder"
                    }),
                    columns: {
                        "btnEdit": {
                            id: "btnEdit",
                            label: "",  //wasn't able to inject an HTML <div> with image here
                            field: "IdFlightOrder",
                            formatter: this.createEditButton,
                            width: "35",
                            resizable: "false"
                        },
                        "IdFlightOrder": {
                            label: widgetFlightPlan.nls.IdFlightOrder,
                            hidden: "true"
                        },
                        "ProjectType": {
                            label: widgetFlightPlan.nls.ProjectType,
                            width: "70",
                            resizable: "true",
                        },
                        "ProjectValue": {
                            label: widgetFlightPlan.nls.ProjectValue,
                            width: "90",
                            resizable: "true",
                            formatter: this.formatDate
                        },
                        "ExecuteEntity": {
                            label: widgetFlightPlan.nls.ExecuteEntity,
                            width: "70",
                            resizable: "true",
                        },
                        "FinancialEntity": {
                            label: widgetFlightPlan.nls.FinancialEntity,
                            resizable: "true"
                        }
                    },
                    /*sort: sortAttr*/
                }, "gridFlightPlans");


                this.gridFlightPlans.on(".field-IdFlightOrder:click", this.selectFlighPlan);
                //this.grid.store.setData([]);
                //this.grid.refresh();
            },

            loadFlightPlans: function (Memory) {
                try {
                    queryTask = new QueryTask(widgetFlightPlan.config.urlFlightPlansService);
                    var query = new Query();
                    query = new esri.tasks.Query();
                    query.returnGeometry = false;
                    // query.outFields = ["ID_ORDEN_VUELO", "ORDEN_VUELO", "TIPO_AERONAVE", "AERONAVE", "ID_DE", "DE", "ID_A", "A"];
                    query.outFields = ["*"];
                    query.where = "1=1";
                    queryTask.execute(query).then(function (featureSet) {
                        if (featureSet.features.length > 0) {
                            var dataFlightPlans = array.map(featureSet.features, function (flightPlan) {
                                var projectType;
                                if (flightPlan.attributes.type != "") {
                                    projectType = featureSet.fields.find(element => element.name == 'type').hasOwnProperty('domain') ?
                                    featureSet.fields.find(element => element.name == 'type').domain.codedValues.find(element => element.code == flightPlan.attributes.type).name :
                                    flightPlan.attributes.type;
                                }
                                
                                return {
                                    // property names used here match those used when creating the dgrid
                                    "btnEdit": flightPlan.attributes.ID_PROJECT,
                                    "IdFlightOrder": flightPlan.attributes.ID_PROJECT,
                                    "ProjectType": projectType,
                                    "ProjectValue": flightPlan.attributes.proj_value,
                                    "ExecuteEntity": flightPlan.attributes.execute_ent,
                                    "FinancialEntity": flightPlan.attributes.financial_ent
                                }
                            });
                            widgetFlightPlan.gridFlightPlans.store.setData(dataFlightPlans);
                            widgetFlightPlan.gridFlightPlans.refresh();
                        }
                        else {
                            console.log("No se encontraron registros de planes de vuelos!");
                        }
                    });

                }
                catch (e) {
                    alert(e.toString());
                    //this.showProcessing(false, "")
                }
            },

            createEditButton: function (id) {
                var zBtn = "<div style='vertical-align:middle; text-align:center; padding:0px' data-dojo-type='dijit/form/Button'><img src='" + window.path + "/widgets/FlightPlan/images/iconEdit.png' alt='" + id + "'";
                zBtn = zBtn + " width='16' height='16'></div>";
                return zBtn;
            },

            createDeleteButton: function (id) {
                var zBtn = "<div style='vertical-align:middle; text-align:center; padding:0px' data-dojo-type='dijit/form/Button'><img src='" + window.path + "/widgets/FlightPlan/images/iconDelete.png' alt='" + id + "'";
                zBtn = zBtn + " width='16' height='16'></div>";
                return zBtn;
            },

            loadAircrafts: function () {
                //debugger;
                var arrayCboAircrafts = new Array();
                // debugger;
                queryTask = new QueryTask(widgetFlightPlan.config.urlFlightPlansService);
                var query = new Query();
                query = new esri.tasks.Query();
                query.returnGeometry = false;
                query.outFields = ["*"];
                query.where = "1=1";
                // query.orderByFields = ["MATRICULA"];
                //arrayCboAircrafts.push({ value: "-1", name: "-Seleccione el vuelo-" });
                queryTask.execute(query).then(function (featureSet) {
                    if (featureSet.fields.find(element => element.name == 'type').domain.codedValues.length > 0) {
                        dojo.forEach(featureSet.fields.find(element => element.name == 'type').domain.codedValues, dojo.hitch(this, function (feature) {
                            arrayCboAircrafts.push({ value: feature.code, name: feature.name });
                        }))
                    }
                    widgetFlightPlan.storeAircrafts = new Memory({ data: arrayCboAircrafts });

                    // widgetFlightPlan.aircraftsSelect = new FilteringSelect({
                    //     id: "aircraftsSelect",
                    //     name: "aircrafts",
                    //     value: "",
                    //     required: false,
                    //     store: widgetFlightPlan.storeAircrafts,
                    //     searchAttr: "name",
                    //     style: "width:150px !important;",
                    // }, "aircraftsSelect").startup();
                    // aircraftsSelect.autocomplete = "on";
                    // aircraftsSelect.defaultValue = "Seleccione una opción";

                    widgetFlightPlan.originSelect = new FilteringSelect({
                        id: "aircraftsSelect",
                        name: "aircrafts",
                        value: "code",
                        store: widgetFlightPlan.storeAircrafts,
                        searchAttr: "name"
                    }, "aircraftsSelect").startup();
                    aircraftsSelect.defaultValue = "Seleccione una opción";

                });
            },

            loadAirports: function () {
                
                this.arrayCboAirports = new Array();
                var nameAirport = "";

                queryTask = new QueryTask(widgetFlightPlan.config.urlAirportsGisService);
                var query = new Query();
                query = new esri.tasks.Query();
                query.returnGeometry = false;
                query.outFields = ["ID_AERODROMO", "OACI", "ObjectId"];
                query.where = "OACI <> ''";
                query.orderByFields = ["OACI"];
                //arrayCboAircrafts.push({ value: "-1", name: "-Seleccione el vuelo-" });
                queryTask.execute(query).then(function (featureSet) {
                    if (featureSet.features.length > 0) {
                        dojo.forEach(featureSet.features, dojo.hitch(this, function (feature) {
                            nameAirport = feature.attributes.OACI != null ? feature.attributes.OACI : "Sin Definir";
                            idAirport = feature.attributes.ObjectId + "-" + feature.attributes.ID_AERODROMO;
                            widgetFlightPlan.arrayCboAirports.push({ value: idAirport, name: nameAirport });
                        }))
                    }
                    widgetFlightPlan.storeAirports = new Memory({ data: widgetFlightPlan.arrayCboAirports });

                    //Carga Combo Aeropuertos Origen
                    widgetFlightPlan.originSelect = new FilteringSelect({
                        id: "originSelect",
                        name: "origins",
                        value: "",
                        store: widgetFlightPlan.storeAirports,
                        searchAttr: "name",
                        style: "width:260px !important;"
                    }, "originSelect");

                    widgetFlightPlan.originSelect.watch('item', function (property, oldValue, newValue) {
                        widgetFlightPlan.selectAirport(newValue, "O"); 
                    });

                    widgetFlightPlan.originSelect.startup();

                    //Carga Combo Aeropuertos Origen
                    widgetFlightPlan.destinationSelect = new FilteringSelect({
                        id: "destinationSelect",
                        name: "destinations",
                        value: "",
                        store: widgetFlightPlan.storeAirports,
                        searchAttr: "name",
                        style: "width:260px !important;"
                    }, "destinationSelect");

                    widgetFlightPlan.destinationSelect.watch('item', function (property, oldValue, newValue) {
                        widgetFlightPlan.selectAirport(newValue, "D");
                    });

                    widgetFlightPlan.destinationSelect.startup();
                });
            },

            selectFlighPlan: function (e) {
                //debugger;

                var row = widgetFlightPlan.gridFlightPlans.row(e);
                widgetFlightPlan.gridFlightPlans.select(row);

                widgetFlightPlan.txtFlightPlanName.setValue(row.data.ProjectType);
                aircraftsSelect.value = row.data.ExecuteEntity;
                //originSelect.value = row.data.From;
                //destinationSelect.value = row.data.To;
                
                widgetFlightPlan.operation = "A";
                widgetFlightPlan.toggleDivGridCreate(false);
            },

            selectAirport: function (selectedAirport, typeAirport) {
                //debugger;
                if (typeAirport=="O") {
                    var originAirport = selectedAirport.value;
                    var oidOriginAirport = originAirport.split('-')
                    if (widgetFlightPlan.objectIds.length == 0) {
                        widgetFlightPlan.objectIds.push(oidOriginAirport[0])
                    }
                    else {
                        widgetFlightPlan.objectIds[0] = oidOriginAirport[0];
                    }
                }

                if (typeAirport == "D") {
                    var destinationAirport = selectedAirport.value;
                    var oidDestinationAirport = destinationAirport.split('-')
                    if (widgetFlightPlan.objectIds.length == 1) {
                        widgetFlightPlan.objectIds.push(oidDestinationAirport[0])
                    }
                    else {
                        widgetFlightPlan.objectIds[1] = oidDestinationAirport[0];
                    }
                }

                if (typeAirport == "OD") {
                    
                    var idsAirports = selectedAirport.split(',')
                    var originAirport = idsAirports[0];
                    var oidOriginAirport = originAirport.split('-')
                    var destinationAirport = idsAirports[1];
                    var oidDestinationAirport = destinationAirport.split('-')
                    widgetFlightPlan.objectIds = [];
                    widgetFlightPlan.objectIds.push(oidOriginAirport[0]);
                    widgetFlightPlan.objectIds.push(oidDestinationAirport[0]);
                }

                highlightMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 22, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.5]));
                
                if (widgetFlightPlan.objectIds.length > 0) {
                    var query = new Query();
                    query.objectIds = widgetFlightPlan.objectIds;
                    query.where = "ObjectId in (" + widgetFlightPlan.objectIds + ")";
                    // Use an objectIds selection query (should not need to go to the server)
                    if (widgetFlightPlan.featureLayerAirports != null) {
                        widgetFlightPlan.featureLayerAirports.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (results) {
                            //alert(results);
                            if (results.length > 0) {
                                
                                widgetFlightPlan.map.graphics.clear();
                                for (i = 0; i < results.length; i++) {
                                    
                                    graphic = new Graphic(results[i].geometry, highlightMarkerSymbol, results[i].attributes, results[i].getInfoTemplate());

                                    widgetFlightPlan.map.graphics.add(graphic);
                                    widgetFlightPlan.map.infoWindow.setContent(results[i].getContent());
                                    widgetFlightPlan.map.infoWindow.setTitle(results[i].getTitle());
                                    //widgetFlightPlan.map.infoWindow.show(results[i].geometry);
                                }

                                widgetFlightPlan.map.setExtent(graphicsUtils.graphicsExtent(widgetFlightPlan.featureLayerAirports.getSelectedFeatures()), true);
                            }
                        });
                    }
                }
                
            },

            addLeg: function () {

                var pointA, pointB;
                var pointsSelected = widgetFlightPlan.featureLayerAirports.getSelectedFeatures()
                if (pointsSelected.length == 2) {
                    pointA = [pointsSelected[0].geometry.x, pointsSelected[0].geometry.y];
                    pointB = [pointsSelected[1].geometry.x, pointsSelected[1].geometry.y];
                }

                var gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                var inSR = new SpatialReference(3857);
                var outSR = new SpatialReference(4326);
                var params = new ProjectParameters();
                lineToProject = [];
                var linePro = new esri.geometry.Polyline(new SpatialReference({ wkid: 3857 }));
                linePro.addPath([[pointA[0], pointA[1]], [pointB[0], pointB[1]]]);
                lineToProject.push(linePro)
                params.geometries = lineToProject;
                params.outSR = outSR;

                gsvc.project(params, function (projectedLine) {
                    //ptA = projectedPoints[0];
                    linePro = projectedLine[0]

                    if (linePro) {

                        var clientDensifiedGeometry = new geodesicUtils.geodesicDensify(linePro, 10000);
                        var lengthDensifiedLine = geodesicUtils.geodesicLengths([clientDensifiedGeometry], Units.KILOMETERS);

                        var myLine = {
                            geometry: clientDensifiedGeometry,
                            symbol: { "color": new Color("blue"), "width": 4, "type": "esriSLS", "style": "esriSLSSolid" }
                        };

                        var idLeg = widgetFlightPlan.arrayLegs.length + 1;

                        var gra = new Graphic(myLine);

                        gra.setAttributes({ "IdLeg": idLeg });
                        //widgetFlightPlan.map.graphics.add(gra);
                        serviceLayer = widgetFlightPlan.map.getLayer('FlightTrajectory');
                        serviceLayer.add(gra);
                        widgetFlightPlan.map.setExtent(graphicsUtils.graphicsExtent(serviceLayer.graphics));

                        //widgetFlightPlan.originSelect.reset();
                        widgetFlightPlan.destinationSelect.reset();
                    }

                });
            },

            toggleDivGridCreate: function (showGrid) {
                var divCreateFlightPlan = dojo.byId("divCreateFlightPlan");
                var divGridFlightPlans = dojo.byId("divGridFlightPlans");
                var divButtonsCreateFlightPlan = dojo.byId("divButtonsCreateFlightPlan");
                if (showGrid) {
                    divCreateFlightPlan.style.display = "none";
                    divButtonsCreateFlightPlan.style.display = "none";
                    divGridFlightPlans.style.display = "inline";
                }
                else {
                    divCreateFlightPlan.style.display = "inline";
                    divButtonsCreateFlightPlan.style.display = "block";
                    divGridFlightPlans.style.display = "none";
                }
            },

            createFlightPlan: function () {
                widgetFlightPlan.operation = "I";
                widgetFlightPlan.toggleDivGridCreate(false);
            },            

            cancelCreateFlightPlan: function () {
                //widgetActivityReport.cleanForm();
                widgetFlightPlan.toggleDivGridCreate(true);
            },

            getMapLayer: function (urlLayer) {
                //debugger;
                mapLayers = [];
                dojo.some(widgetFlightPlan.map.graphicsLayerIds, function (layerId) {
                    var serviceLayer = widgetFlightPlan.map.getLayer(layerId);
                    if (serviceLayer.url == urlLayer)
                    {
                        widgetFlightPlan.featureLayerAirports = serviceLayer;
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

            setSelectionSymbol: function (featureLayer) {
                debugger;

                var symbolSelAirport = new PictureMarkerSymbol({
                    "url": "https://project-esri-co.maps.arcgis.com/sharing/rest/content/items/e2cadff6638a4292a1a600aa3f3b1035/data",
                    "height": 25,
                    "width": 25,
                    "type": "esriPMS"
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

            getNextObjectID: function getNextObjectID(layerObject, field) {
                debugger;
                var def = new Deferred();
                var query = new Query();
                query.where = "1=1";
                if (layerObject.url === '') {
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
                queryTask.execute(query, lang.hitch(this, function (respond) {
                  if (respond && respond.features.length > 0) {
                    if (typeof respond.features[0].attributes[statDef.outStatisticFieldName] === 'number') {
                      def.resolve(respond.features[0].attributes[statDef.outStatisticFieldName] + 1);
                    }
                  } else {
                    def.resolve(1);
                  }
                  def.resolve(null);
                }), lang.hitch(this, function (err) {
                  def.resolve(null);
                }));
                return def;
            },
        
            applyEditProject: function() {
                debugger;
                //var f = dojo.byId("frmMissionPlanning");

                var aircraftsSelect = dijit.byId("aircraftsSelect").item.value;

                var txtEstablishmentDate = new Date(this.txtEstablishmentDate.value);
                
                var attributesFeature = {};
                attributesFeature.name = this.txtFlightPlanName.value;
                attributesFeature.type = this.aircraftsSelect.value;
                attributesFeature.financial_ent = this.txtFinancialEntity.value;
                attributesFeature.execute_ent = this.txtExecuteEntity.value;
                attributesFeature.establishment = new Date(this.txtEstablishmentDate.value);
                attributesFeature.lead_time = parseInt(this.txtLeadTime.value);
                attributesFeature.proj_value = parseFloat(this.txtProjectValue.value);
                attributesFeature.comment = this.txtComment.value;
                attributesFeature.budget_code = this.txtBudgetCode.value;
                
                var featureLayer = new FeatureLayer("https://services6.arcgis.com/hxAwRYAu9QHliJ8T/arcgis/rest/services/GBD_RESTAURACION/FeatureServer/2");
                // getNextObjectID(flProjects, "ID_PROJECT").then(function (_getNextObjectID) {
                //     flProjects.applyEdits([projectRecord], null, null,
                //         function (addResults) {
                //             dom.byId("divResult").innerHTML = "Registro creado satisfactoriamente";
                //         }, function (err) {
                //             dom.byId("divResult").innerHTML = err;
                //             alert(err);
                //         }
                //     );
                // });
                this.getNextObjectID(featureLayer, "ID_PROJECT").then(lang.hitch(this, function (nextID) {
                    debugger;
                    console.log('nextID:' + nextID);
                    attributesFeature.ID_PROJECT = nextID;
                    var params = {
                        attributes: attributesFeature
                    };
                    // flProjects.applyEdits([params], null, null,
                    //     function (addResults) {
                    //         if (addResults.q) {
                                
                    //         } else {
                                
                    //         }
                    //         dom.byId("divResult").innerHTML = "Registro creado satisfactoriamente";
                    //     }, function (err) {
                    //         dom.byId("divResult").innerHTML = err;
                    //         alert(err);
                    //     }
                    // );
                    featureLayer.applyEdits([params])
                        .then(function (editsResult) {
                            debugger;
                                // Get the objectId of the newly added feature.
                                // Call selectFeature function to highlight the new feature.
                                if (editsResult.addResults[0].success) {
                                    const objectId = editsResult.addResults[0].objectId;
                                    dom.byId("divResult").innerHTML = "Registro creado satisfactoriamente";
                                    // selectFeature(objectId);
                                }
                                })
                                .catch(function(error) {
                                console.log("===============================================");
                                console.error("[ applyEdits ] FAILURE: ", error.code, error.name, error.message);
                                console.log("error = ", error);
                                });
                  }));
            },

        });
    });