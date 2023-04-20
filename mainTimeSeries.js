var vectorsSerbia = ee.FeatureCollection("users/miguelchapela92/Orchards_Serbia");

// ------------------------------------------------------------------------
//     THIS APP PLOTS TIME SERIES OF SENTINEL 2A OF OVER A POLYGON
// ------------------------------------------------------------------------

// The two files appStyle and Include files appStyle and functions
// appStyle - contains variables for styling and for selects widgets
// functions - contains the functions used to clean the data and calculate the time series

var appStyle = require('users/miguelchapela92/FaunaTimeSeries:appStyle');
var functions = require('users/miguelchapela92/FaunaTimeSeries:functions');

// These are our two  master panels - panel with all the info and map panel
// The infoPanel is divided in several subpanels

var infoPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'), 
    style: {
      stretch: 'horizontal',
      height: '100%',
      width: '66%',
      backgroundColor: appStyle.colors.gray
    }
}); 

var mappingPanel = ui.Map({
    center: {'lat':45.102, 'lon': 19.95, 'zoom': 14}
  });

ui.root.clear(); // This is important to do to remove the "normal" GEE map
ui.root.add(ui.SplitPanel(mappingPanel, infoPanel)); // order matters!
//ui.root.add() //is where you are adding panels to the EE window 

//----------------------------------------------------------------------------------------
//--------------------------- ADD WIDGETS TO THE INFOPANEL--------------------------------
//----------------------------------------------------------------------------------------

var variablesPanel = ui.Panel({layout: ui.Panel.Layout.flow('vertical'), 
                           style: {
      stretch: 'horizontal',
      height: '100%',
      width: '45%',
      padding: '10px',
      backgroundColor: appStyle.colors.gray}
});

infoPanel.add(variablesPanel);

// Add title of the app and the app description
variablesPanel.add(ui.Label('Time Series in apple orchard', appStyle.TITLE_STYLE));

variablesPanel.add(ui.Label('Author: Miguel Chapela Rivas', appStyle.SUBTITLE_STYLE));

var app_description = 'This App plots time series for the trial apple orchard in Serbia.\n' +
                      'The first plot shows a vegetation index over time using the stattistical \n parameter chosen by the user. Data source: Sentinel 2-Level 2A.\n' +
                      'The second plot shows min, max and mean temperature in the orchard.\n Data source: ERA-5.\n' +
                      'The third plot total precipitation in the orchard. Data source: ERA-5.\n\n' +
                      'The following parameters can be selected: \n\n' +
                      '  - START DATE & END DATE: Time frame for the analysis.\n' +
                      '  - INDEX: The vegetation index to plot in the analysis.\n' +
                      '  - REDUCER: Statistical parameter to aggregate the index data.\n' +
                      '  - POLYGON: Area to aggregate the data. Full orchard or one apple variety. \n';
variablesPanel.add(ui.Label(app_description, appStyle.PARAGRAPH_STYLE));

// TEMPORAL WIDGETS
// Creates select widgets for the start and end date

var start_year = ui.Select({items: appStyle.year_list, placeholder: 'Start year', value: 2018, style: appStyle.SELECT_STYLE});
var start_month = ui.Select({items: appStyle.month_list, placeholder: 'Start month', value:  3, style: appStyle.SELECT_STYLE});
var start_day = ui.Select({items: appStyle.day_list, placeholder: 'Start  day', value:1, style: appStyle.SELECT_STYLE});

var end_year = ui.Select({items: appStyle.year_list, placeholder: 'Start year', value: 2018, style: appStyle.SELECT_STYLE});
var end_month = ui.Select({items: appStyle.month_list, placeholder: 'Start month', value:  9, style: appStyle.SELECT_STYLE});
var end_day = ui.Select({items: appStyle.day_list, placeholder: 'Start  day', value:1, style: appStyle.SELECT_STYLE});

var startDatePanel = ui.Panel({layout: ui.Panel.Layout.flow('horizontal'),style: {padding: '8px', backgroundColor: appStyle.colors.transparent}});
var endDatePanel = ui.Panel({layout: ui.Panel.Layout.flow('horizontal'),style: {padding: '8px', backgroundColor: appStyle.colors.transparent}});

startDatePanel.add(start_year).add(start_month).add(start_day);

endDatePanel.add(end_year).add(end_month).add(end_day);

variablesPanel.add(ui.Label('START DATE', appStyle.LABEL_STYLE)).add(startDatePanel)
              .add(ui.Label('END DATE', appStyle.LABEL_STYLE)).add(endDatePanel);

// OTHER PARAMETERS WIDGETS
// Creates widgets with the index, reducer and polygon selector
var otherParamPanel = ui.Panel({layout: ui.Panel.Layout.flow('horizontal'), 
                            style: {backgroundColor: appStyle.colors.transparent}});
                            
variablesPanel.add(otherParamPanel);
var indexPanel = ui.Panel({style: {padding: '8px', backgroundColor: appStyle.colors.transparent}});
var reducerGraphPanel = ui.Panel({style: {padding: '8px', backgroundColor: appStyle.colors.transparent}});
var polygonPanel = ui.Panel({style: {padding: '8px', backgroundColor: appStyle.colors.transparent}});

var index_select = ui.Select({items: appStyle.index_list, placeholder: 'Index', value:'NDVI', style: appStyle.SELECT_STYLE});
var reducerGraph_select = ui.Select({items: appStyle.reducer_graph_list, placeholder: 'Reducer', value:0, style: appStyle.SELECT_STYLE});
var polygonPanel_select = ui.Select({items: appStyle.polygon_list, placeholder: 'Polygon', value:0, style: appStyle.SELECT_STYLE});

indexPanel.add(ui.Label('INDEX', appStyle.LABEL_STYLE)).add(index_select);
reducerGraphPanel.add(ui.Label('STATISTIC  REDUCER ', appStyle.LABEL_STYLE)).add(reducerGraph_select);
polygonPanel.add(ui.Label('POLYGON', appStyle.LABEL_STYLE)).add(polygonPanel_select);

otherParamPanel.add(indexPanel).add(reducerGraphPanel).add(polygonPanel);

// ADD THE RUN BUTTON TO THE PANEL
var runButton = ui.Button({label: 'Run', style: {width: '125px', maxWidth: '250px', color: '#616161'}});
variablesPanel.add(runButton);


// PANEL FOR THE CHARTS

var chartPanel = ui.Panel({layout: ui.Panel.Layout.flow('vertical'), 
                           style: {
      stretch: 'horizontal',
      height: '100%',
      width: '50%',
      backgroundColor: appStyle.colors.gray}
});
infoPanel.add(chartPanel);

// Title of the chart panel
chartPanel.add(ui.Label('Charts', appStyle.SUBTITLE_STYLE));

// This is the subpanel where the charts are placed. It is update everytime the run button is clicked
var chartOnly = ui.Panel();
chartPanel.add(chartOnly);



//-------------------------------------------------------------------------------------------------------
//----------------------------------- ON CLICK RUN FUNCTION ---------------------------------------------
//-------------------------------------------------------------------------------------------------------


var buildComposite = runButton.onClick(function() {

// Clear graph and mapping panel
chartOnly.clear();
mappingPanel.clear(); 


// Get the temporal variables from widgets
var startDate = start_year.getValue() + '-' + start_month.getValue() + '-' + start_day.getValue();
var endDate = end_year.getValue() + '-' + end_month.getValue() + '-' + end_day.getValue();

// This variables contain the names of the two collections use Sentinel 2-level 2A and ERA-5 daily aggregates
var collectionNameS2 = 'COPERNICUS/S2_SR';
var collectionNameERA5 = 'ECMWF/ERA5/DAILY';

// Get the polygon selected from the widet 
var feature = ee.Feature((appStyle.polygon_list[polygonPanel_select.getValue()])['object']);
              

// CREATE AND FILTER COLLECTIONS

// From the Sentinel 2 collection only the band starting with, B and QA, as well as the SCL band are selected
// The SCL(Scene Classification Map) band is used to mask the image in the collection. Only pixels corresponding to vegetation are selected
var collectionS2 = ee.ImageCollection(collectionNameS2)
                  .filter(ee.Filter.date(startDate, endDate))
                  .select(['^B[0-9A]+', '^QA[0-9]+','SCL'])
                  .filterBounds(feature.geometry())
                  .map(functions.maskSCL);


// From the ERA 5 daily aggreagtes all the band are selected. The collection is only filtered according date and the polygon
var collectionERA5 = ee.ImageCollection(collectionNameERA5)
                  .filter(ee.Filter.date(startDate, endDate))
                  .filterBounds(feature.geometry());
                  
// Calculates and and adds both EVI and NDVI
// In the future change this for function that calcualtes only one of them depending on the select value
collectionS2 = collectionS2.map(functions.addNDVI);
collectionS2 = collectionS2.map(functions.addEVI);

// Get the index name from the select               
var indexName = index_select.getValue();

// Use the function reduceTileOverlap. 
// This functions remove the images that have less than 75% of valid pixels for the band selected
// The band seelcted is indexName, which  is EVI or NDVI
var collectionReduced = functions.reduceTileOverlap(collectionS2,feature,indexName);

// Creates the charts

// For the first chart the data is agreggated according to the statistical reduced chosen
// Get the item from the reducer list using the value passed in the select object
var statReducer = appStyle.reducer_graph_list[reducerGraph_select.getValue()];

// Creates the chart for the vegetation index
var chartVegIndex = functions.plotValues(feature,collectionReduced,indexName,statReducer['object'],'Vegetation Index','Index value');

// Creates the chart for the temperature
var chartTemperature = functions.plotValues(feature,collectionERA5,['mean_2m_air_temperature','minimum_2m_air_temperature','maximum_2m_air_temperature'],
                                            ee.Reducer.mean(),'Daily temperature at 2m','Temperature (K)');

// Before creating the chart for precipitation the values are converted from meters to milimeters                  
var precipitation2mm = function(image) {
return image.addBands(image.select('total_precipitation').multiply(1000).rename('total_precipitation_mm'))
};
collectionERA5 = collectionERA5.map(precipitation2mm);

var chartPrecipitation = functions.plotValues(feature,collectionERA5,['total_precipitation_mm'],
                                            ee.Reducer.mean(),'Daily precipitation','Precipitation (mm)');

// The three charts are added to the panel

chartOnly.add(chartVegIndex).add(chartTemperature).add(chartPrecipitation);


// Clip the image collection ot the polygon selected and show it in the map

// Clip  image collection
var collectionReducedClipped = collectionReduced.map(function(image){return image.clip(feature)}) ;
var visParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
  
mappingPanel.addLayer(collectionReducedClipped.mean().select(indexName), visParams, indexName);


});

