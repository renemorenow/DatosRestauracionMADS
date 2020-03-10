// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define({"widgets/CostAnalysis/setting/nls/strings":{configText:"Iestatiet konfigur\u0101cijas tekstu:",generalSettings:{tabTitle:"Visp\u0101r\u012bgi iestat\u012bjumi",measurementUnitLabel:"Izmaksas vien\u012bba",currencyLabel:"Izmaksas simbols",roundCostLabel:"Noapa\u013cotas izmaksas",projectOutputSettings:"Projekta izvades iestat\u012bjumi",typeOfProjectAreaLabel:"Projekta teritorijas tips",bufferDistanceLabel:"Buferzonas att\u0101lums",csvReportExportLabel:"At\u013caut lietot\u0101jam eksport\u0113t projekta p\u0101rskatu",
editReportSettingsBtnTooltip:"Labot p\u0101rskata iestat\u012bjumus",roundCostValues:{twoDecimalPoint:"Divi komati",nearestWholeNumber:"Tuv\u0101kais veselais skaitlis",nearestTen:"Tuv\u0101kais desmitu skaitlis",nearestHundred:"Tuv\u0101kais simtu skaitlis",nearestThousand:"Tuv\u0101kais t\u016bksto\u0161u skaitlis",nearestTenThousands:"Tuv\u0101kais desmitu t\u016bksto\u0161u skaitlis"},reportSettings:{reportSettingsPopupTitle:"P\u0101rskata iestat\u012bjumi",reportNameLabel:"P\u0101rskata nosaukums (neoblig\u0101ts):",
checkboxLabel:"R\u0101d\u012bt",layerTitle:"Virsraksts",columnLabel:"Teksts",duplicateMsg:"Kartes teksta dublik\u0101ti"},projectAreaType:{outline:"Kont\u016bra",buffer:"Buferzona"},errorMessages:{currency:"Neder\u012bga val\u016btas m\u0113rvien\u012bba",bufferDistance:"Neder\u012bgs buferzonas att\u0101lums",outOfRangebufferDistance:"V\u0113rt\u012bbai j\u0101b\u016bt liel\u0101kai par\u00a00 un maz\u0101kai vai vien\u0101dai ar\u00a0100"}},projectSettings:{tabTitle:"Projekta iestat\u012bjumi",
costingGeometrySectionTitle:"Defin\u0113t\u00a0\u0123eogr\u0101fiju izmaks\u0101m\u00a0(p\u0113c izv\u0113les)",costingGeometrySectionNote:"Piez\u012bme: ja \u0161is sl\u0101nis b\u016bs konfigur\u0113ts, lietot\u0101js var\u0113s iestat\u012bt elementu sagatavju izmaksu vien\u0101dojumus atkar\u012bb\u0101 balstoties uz \u0123eogr\u0101fiju.",projectTableSectionTitle:"Iesp\u0113ja saglab\u0101t/iel\u0101d\u0113t projekta iestat\u012bjumus (p\u0113c izv\u0113les)",projectTableSectionNote:"Piez\u012bme: ja konfigur\u0113siet visas tabulas un sl\u0101\u0146us, lietot\u0101js var\u0113s saglab\u0101t/iel\u0101d\u0113t projektu v\u0113l\u0101kai lieto\u0161anai.",
costingGeometryLayerLabel:"Sl\u0101\u0146a \u0123eometrija izmaksas",fieldLabelGeography:"Lauks \u0123eogr\u0101fijas nosaukumam",projectAssetsTableLabel:"Projekta v\u0113rt\u012bbu tabula",projectMultiplierTableLabel:"Projekta reizin\u0101t\u0101ja papildu izmaksu tabula",projectLayerLabel:"Projekta sl\u0101nis",configureFieldsLabel:"Konfigur\u0113t laukus",fieldDescriptionHeaderTitle:"Lauka apraksts",layerFieldsHeaderTitle:"Sl\u0101\u0146u lauks",selectLabel:"Izv\u0113l\u0113ties",errorMessages:{duplicateLayerSelection:"Sl\u0101nis ${layerName} jau ir izv\u0113l\u0113ts",
invalidConfiguration:"Izv\u0113lieties ${fieldsString}"},costingGeometryHelp:"\x3cp\x3eTiks par\u0101d\u012bts(-i) laukuma sl\u0101nis(-\u0146i), kas atbilst t\u0101l\u0101k nor\u0101d\u012btajiem nosac\u012bjumiem. \x3cbr/\x3e \x3cli\x3e\tSl\u0101n\u012b j\u0101b\u016bt ietvertai vaic\u0101juma\u009d iesp\u0113jai\x3c/li\x3e\x3cli\x3e\tSl\u0101n\u012b j\u0101b\u016bt ietvertam laukam GlobalID\x3c/li\x3e\x3c/p\x3e",fieldToLabelGeographyHelp:"s\x3cp\x3eIzv\u0113l\u0113t\u0101 \u00e2\u20ac\u0153izmaksu \u0123eometrijas sl\u0101\u0146a\u00e2\u20ac\u009d teksts un ciparu lauki tiks par\u0101d\u012bti \u00e2\u20acnosaukums laukam\u00a0\u0123eogr\u0101fija\u00e2\u20ac\u009d nolai\u017eamaj\u0101 izv\u0113ln\u0113.\x3c/p\x3e",
projectAssetsTableHelp:"\x3cp\x3eTiks par\u0101d\u012bta(-s) tabula(-s), kas atbilst t\u0101l\u0101k nor\u0101d\u012btajiem nosac\u012bjumiem. \x3cbr/\x3e \x3cli\x3eTabul\u0101 j\u0101b\u016bt \u0161\u0101d\u0101m redi\u0123\u0113\u0161anas iesp\u0113j\u0101m: \u00e2\u20ac\u0153Izveidot\u00e2\u20ac\u009d, \u00e2\u20ac\u0153Dz\u0113st\u00e2\u20ac\u009d un \u00e2\u20ac\u0153Atjaunot\u00e2\u20ac\u009d\x3c/li\x3e    \x3cli\x3eTabul\u0101 j\u0101b\u016bt se\u0161iem laukiem ar prec\u012bzu nosaukumu un datu tipu:\x3c/li\x3e\x3cul\x3e\x3cli\x3e\tAssetGUID (GUID tipa lauks)\x3c/li\x3e\x3cli\x3e\tCostEquation (teksta tipa lauks)\x3c/li\x3e\x3cli\x3e\tScenario (teksta tipa lauks)\x3c/li\x3e\x3cli\x3e\tTemplateName (teksta tipa lauks)\x3c/li\x3e\x3cli\x3e    GeographyGUID (GUID tipa lauks)\x3c/li\x3e\x3cli\x3e\tProjectGUID (GUID tipa lauks)\x3c/li\x3e\x3c/ul\x3e \x3c/p\x3e",
projectMultiplierTableHelp:"\x3cp\x3eTiks par\u0101d\u012bta(-s) tabula(-s), kas atbilst t\u0101l\u0101k nor\u0101d\u012btajiem nosac\u012bjumiem. \x3cbr/\x3e \x3cli\x3eTabul\u0101 j\u0101b\u016bt \u0161\u0101d\u0101m redi\u0123\u0113\u0161anas iesp\u0113j\u0101m: \u00e2\u20ac\u0153Izveidot\u00e2\u20ac\u009d, \u00e2\u20ac\u0153Dz\u0113st\u00e2\u20ac\u009d un \u00e2\u20ac\u0153Atjaunot\u00e2\u20ac\u009d\x3c/li\x3e    \x3cli\x3eTabul\u0101 j\u0101b\u016bt se\u0161iem laukiem ar prec\u012bzu nosaukumu un datu tipu:\x3c/li\x3e\x3cul\x3e\x3cli\x3e\tDescription (teksta tipa lauks)\x3c/li\x3e\x3cli\x3e\tType (teksta tipa lauks)\x3c/li\x3e\x3cli\x3e\tValue (da\u013cskait\u013ca/dubult\u0101s precizit\u0101tes da\u013cskait\u013ca tipa lauks)\x3c/li\x3e\x3cli\x3e\tCostindex (vesela skait\u013ca tipa lauks)\x3c/li\x3e\x3cli\x3e   \tProjectGUID (GUID tipa lauks))\x3c/li\x3e\x3c/ul\x3e \x3c/p\x3e",
projectLayerHelp:"\x3cp\x3eTiks par\u0101d\u012bts(-i) laukumu sl\u0101nis(-\u0146i), kas atbilst t\u0101l\u0101k nor\u0101d\u012btajiem nosac\u012bjumiem \x3cbr/\x3e \x3cli\x3eSl\u0101nim j\u0101b\u016bt \u0161\u0101d\u0101m redi\u0123\u0113\u0161anas iesp\u0113j\u0101m: \u00e2\u20ac\u0153Izveidot\u00e2\u20ac\u009d, \u00e2\u20ac\u0153Dz\u0113st\u00e2\u20ac\u009d un \u00e2\u20ac\u0153Atjaunot\u00e2\u20ac\u009d\x3c/li\x3e    \x3cli\x3eSl\u0101n\u012b j\u0101b\u016bt pieciem laukiem ar prec\u012bzu nosaukumu un datu tipu:\x3c/li\x3e\x3cul\x3e\x3cli\x3eProjectName (teksta tipa lauks)\x3c/li\x3e\x3cli\x3eDescription (teksta tipa lauks)\x3c/li\x3e\x3cli\x3eTotalassetcost (da\u013cskait\u013ca/dubult\u0101s precizit\u0101tes da\u013cskait\u013ca tipa lauks)\x3c/li\x3e\x3cli\x3eGrossprojectcost (da\u013cskait\u013ca/dubult\u0101s precizit\u0101tes da\u013cskait\u013ca tipa lauks)\x3c/li\x3e\x3cli\x3eGlobalID (GlobalID tipa lauks)\x3c/li\x3e\x3c/ul\x3e \x3c/p\x3e",
pointLayerCentroidLabel:"Punktu sl\u0101\u0146a centro\u012bds",selectRelatedPointLayerDefaultOption:"Atlas\u012bt",pointLayerHintText:"\x3cp\x3eTiks par\u0101d\u012bts punktu sl\u0101nis ar \u0161\u0101diem nosac\u012bjumiem: \x3cbr/\x3e \x3cli\x3e\tSl\u0101n\u012b j\u0101b\u016bt laukam \u201cProjekta ID\u201d (GUID tips)\x3c/li\x3e\x3cli\x3e\tSl\u0101n\u012b j\u0101b\u016bt redi\u0123\u0113\u0161anas iesp\u0113j\u0101m, proti, \u201cIzveidot\u201d, \u201cDz\u0113st\u201d un \u201cAtjaunin\u0101t\u201d\x3c/li\x3e\x3c/p\x3e"},
layerSettings:{tabTitle:"Sl\u0101\u0146u iestat\u012bjumi",layerNameHeaderTitle:"Sl\u0101\u0146a nosaukums",layerNameHeaderTooltip:"Kartes sl\u0101\u0146u saraksts",EditableLayerHeaderTitle:"Redi\u0123\u0113jams",EditableLayerHeaderTooltip:"Izmaksu logr\u012bk\u0101 iek\u013caut sl\u0101ni un t\u0101 sagataves",SelectableLayerHeaderTitle:"Izv\u0113l\u0113ti",SelectableLayerHeaderTooltip:"Varat izmantot elementa \u0123eometriju, lai \u0123ener\u0113tu jaunu izmaksu vien\u012bbu",fieldPickerHeaderTitle:"Projekta\u00a0ID (p\u0113c izv\u0113les)",
fieldPickerHeaderTooltip:"P\u0113c izv\u0113les pievienojams lauks (teksta tips), kur\u0101 glab\u0101t projekta\u00a0ID",selectLabel:"Izv\u0113l\u0113ties",noAssetLayersAvailable:"Izv\u0113l\u0113taj\u0101 t\u012bmek\u013ca kart\u0113 nav atrasts v\u0113rt\u012bbu sl\u0101nis",disableEditableCheckboxTooltip:"\u0160im sl\u0101nim nav redi\u0123\u0113\u0161anas iesp\u0113ju",missingCapabilitiesMsg:"\u0160im sl\u0101nim tr\u016bkst \u0161\u0101du iesp\u0113ju:",missingGlobalIdMsg:"\u0160im sl\u0101nim nav lauka GlobalId",
create:"Izveidot",update:"Atjaunin\u0101jums",deleteColumnLabel:"Izdz\u0113st",attributeSettingHeaderTitle:"Atrib\u016btu iestat\u012bjumi",addFieldLabelTitle:"Pievienot atrib\u016btus",layerAttributesHeaderTitle:"Sl\u0101\u0146a atrib\u016bti",projectLayerAttributesHeaderTitle:"Projekta sl\u0101\u0146a atrib\u016bti",attributeSettingsPopupTitle:"Sl\u0101\u0146a atrib\u016btu iestat\u012bjumi"},costingInfo:{tabTitle:"Izmaksu inform\u0101cija",proposedMainsLabel:"Ieteicam\u0101 sist\u0113ma",addCostingTemplateLabel:"Pievienot izmaksu sagatavi",
manageScenariosTitle:"P\u0101rvald\u012bt scen\u0101rijus",featureTemplateTitle:"Elementu sagatave",costEquationTitle:"Izmaksu vien\u0101dojums",geographyTitle:"\u0122eogr\u0101fija",scenarioTitle:"Scen\u0101rijs",actionTitle:"Darb\u012bbas",scenarioNameLabel:"Scen\u0101rija nosaukums",addBtnLabel:"Pievienot",srNoLabel:"N\u0113.",deleteLabel:"Izdz\u0113st",duplicateScenarioName:"Dubl\u0113t scen\u0101rija nosaukumu",hintText:"\x3cdiv\x3eUzvedne: izmantojiet t\u0101l\u0101k nor\u0101d\u012btos atsl\u0113gas v\u0101rdus\x3c/div\x3e\x3cul\x3e\x3cli\x3e\x3cb\x3e{TOTALCOUNT}\x3c/b\x3e: izmanto vien\u0101da tipa v\u0113rt\u012bbas \u0123eogr\u0101fij\u0101\x3c/li\x3e\x3cli\x3e\x3cb\x3e{MEASURE}\x3c/b\x3e: izmanto garumu l\u012bnijas\u00a0v\u0113rt\u012bb\u0101m un plat\u012bbu laukuma v\u0113rt\u012bb\u0101m\x3c/li\x3e\x3cli\x3e\x3cb\x3e{TOTALMEASURE}\x3c/b\x3e: izmanto kop\u0113jo garumu l\u012bniju v\u0113rt\u012bb\u0101m un plat\u012bbu laukuma v\u0113rt\u012bb\u0101m \u0123eogr\u0101fij\u0101\u00a0\x3c/li\x3e\x3c/ul\x3e Varat izmantot da\u017e\u0101das funkcijas, piem\u0113ram:\x3cul\x3e\x3cli\x3eMath.abs(-100)\x3c/li\x3e\x3cli\x3eMath.floor({TOTALMEASURE})\x3c/li\x3e\x3c/ul\x3eLabojiet izmaksu vien\u0101dojumu atbilsto\u0161i projekta vajadz\u012bb\u0101m.",
noneValue:"Neviens",requiredCostEquation:"Neder\u012bgs izmaksu vien\u0101dojums sl\u0101nim ${layerName}: ${templateName}",duplicateTemplateMessage:"Sl\u0101nim ${layerName} eksist\u0113 sagataves dublik\u0101ts: ${templateName}",defaultEquationRequired:"Sl\u0101nim ${layerName} ir nepiecie\u0161ams noklus\u0113juma vien\u0101dojums: ${templateName}",validCostEquationMessage:"Ievadiet der\u012bgu izmaksu vien\u0101dojumu",costEquationHelpText:"Labojiet izmaksu vien\u0101dojumu atbilsto\u0161i sava projekta vajadz\u012bb\u0101m",
scenarioHelpText:"Izv\u0113lieties scen\u0101riju atbilsto\u0161i sava projekta vajadz\u012bb\u0101m",copyRowTitle:"Kop\u0113t rindu",noTemplateAvailable:"Pievienojiet vismaz vienu sagatavi sl\u0101nim ${layerName}",manageScenarioLabel:"P\u0101rvald\u012bt scen\u0101riju",noLayerMessage:"Ievadiet vismaz vienu sl\u0101ni ciln\u0113 ${tabName}",noEditableLayersAvailable:"Sl\u0101nis(-\u0146i) ir j\u0101atz\u012bm\u0113 k\u0101 redi\u0123\u0113jami sl\u0101\u0146u iestat\u012bjumu ciln\u0113",updateProjectCostCheckboxLabel:"Atjaunin\u0101t projekta vien\u0101dojumus",
updateProjectCostEquationHint:"Padoms. \u0160\u0101di lietot\u0101js var\u0113s atjaunin\u0101t to l\u012bdzek\u013cu izmaksu vien\u0101dojumus, kas jau pievienoti eso\u0161iem projektiem, ar jauniem vien\u0101dojumiem, kas nor\u0101d\u012bti zem\u0101k, pamatojoties uz elementu veidni, \u0123eogr\u0101fiju un scen\u0101riju. Ja kombin\u0101cija netiek atrasta, tiks iestat\u012bts noklus\u0113juma izmaksu vien\u0101dojums, proti, \u0123eogr\u0101fijas un scen\u0101rija iestat\u012bjums \u201cNav\u201d. Ja elementu veidne ir no\u0146emta, izmaksas tiks iestat\u012btas k\u0101 0."},
statisticsSettings:{tabTitle:"Papildu iestat\u012bjumi",addStatisticsLabel:"Pievienot statistiku",fieldNameTitle:"Lauks",statisticsTitle:"Virsraksts",addNewStatisticsText:"Pievienot jaunu statistiku",deleteStatisticsText:"Dz\u0113st statistiku",moveStatisticsUpText:"P\u0101rvietot statistiku aug\u0161up",moveStatisticsDownText:"P\u0101rvietot statistiku lejup",selectDeselectAllTitle:"Izv\u0113l\u0113ties visas"},projectCostSettings:{addProjectCostLabel:"Pievienot papildu projekta izmaksas",additionalCostValueColumnHeader:"V\u0113rt\u012bba",
invalidProjectCostMessage:"Neder\u012bgs projekta izmaksu ieraksts",additionalCostLabelColumnHeader:"Kartes teksts",additionalCostTypeColumnHeader:"Veids"},statisticsType:{countLabel:"Skaits",averageLabel:"Vid\u0113jais",maxLabel:"Maksimums",minLabel:"Minimums",summationLabel:"Summ\u0113\u0161ana",areaLabel:"Plat\u012bba",lengthLabel:"Garums"},_localized:{}}});