var geometryMap = 
    /* color: #d63000 */
    /* locked: true */
    ee.Geometry.Polygon(
        [[[19.959438035430626, 45.10273512330502],
          [19.960403630675987, 45.10191725314942],
          [19.96087569946261, 45.101697637871474],
          [19.963944146575646, 45.10253065686454],
          [19.96531207317324, 45.1003723553328],
          [19.96883649581881, 45.101353067370795],
          [19.96624804044189, 45.10418312816421],
          [19.966092472319026, 45.10437622978771],
          [19.965915446524043, 45.10472078204245],
          [19.96246612573089, 45.10407332498894],
          [19.959172373060603, 45.10346372420945]]]);

var vectorsSerbia = ee.FeatureCollection("users/miguelchapela92/Orchards_Serbia");
// Add vector layer
// Start and end date of the analysis

var startDate = '2018-03-05';
var endDate = '2018-09-20';
var collection = 'ECMWF/ERA5/DAILY';

var vector_selected = ee.Feature(geometryMap)


// Get collection of images
var collection = ee.ImageCollection(collection)
                  .filter(ee.Filter.date(startDate, endDate))
                  .filterBounds(vector_selected.geometry())
                 
print(collection)


var chartTemperature = ui.Chart.image.series({
    imageCollection: collection.select(['mean_2m_air_temperature','minimum_2m_air_temperature','maximum_2m_air_temperature']),
    region: vector_selected.geometry(),
    reducer: ee.Reducer.mean(),
    scale: 10
    }).setOptions({
      interpolateNulls: false,
      lineWidth: 1,
      pointSize: 3,
      title: 'Daily temperature at 2m height',
      vAxis: {title: 'Temperature (K)'},
      hAxis: {title: 'Date', format: 'YYYY-MMM', gridlines: {count: 12}}
    });
    

print(chartTemperature)


var chartPrecipitation = ui.Chart.image.series({
    imageCollection: collection.select(['total_precipitation']),
    region: vector_selected.geometry(),
    reducer: ee.Reducer.mean(),
    scale: 10
    }).setOptions({
      interpolateNulls: false,
      lineWidth: 1,
      pointSize: 3,
      title: 'Daily precipitation',
      vAxis: {title: 'Precipitation (m)'},
      hAxis: {title: 'Date', format: 'YYYY-MMM', gridlines: {count: 12}}
    });
    

print(chartPrecipitation)


