
// FUNCTIONS FOR THE TIME SERIES APP


//******************************************************************************* 
//------------------------------MASKSCL---------------------------------------
//------------------ Function to maks according SCL band ---------------------------
//------------------------------------------------------------------------------
//******************************************************************************

exports.maskSCL = function(image) {
    var SCL = image.select('SCL');
  
    // Everything except vegetation it removed from the image.
    var vegetation_mask = SCL.eq(4); 
    
    // Both flags should be set to zero, indicating clear conditions.
   // var mask = SCL.bitwiseAnd(vegetation).eq(0);
    return image.updateMask(vegetation_mask);
  };
  
  
  //******************************************************************************* 
  //-------------------------------ADDNDVI----------------------------------------
  //------------------ Function to calculate and add an NDVI band ----------------
  //------------------------------------------------------------------------------
  //******************************************************************************
  exports.addNDVI = function(image) {
          return image.addBands(image.normalizedDifference(['B8', 'B4'])
                      .rename('NDVI'));
  };
  
  //******************************************************************************* 
  //-------------------------------ADDEVI----------------------------------------
  //------------------ Function to calculate and add an EVI band ----------------
  //------------------------------------------------------------------------------
  //******************************************************************************
  
  //EVI (Sentinel 2) = 2.5 * ((B8 – B4) / (B8 + 6 * B4 – 7.5 * B2 + 1)) 
  
  exports.addEVI = function(image) {
          return image.addBands(image.expression(
                      //'2.5 * ((NIR-RED) / (NIR + 6 * RED - 7.5* BLUE +1))', {
                      '2.5 * ( (NIR-RED) / (NIR + 6*RED - 7.5*BLUE +1) )', {
                       NIR:image.select('B8').divide(10000),
                       RED:image.select('B4').divide(10000),
                       BLUE:image.select('B2').divide(10000) }) .rename('EVI'))
                       ;
  };
  
  
  //****************************************************************************************** 
  //------------------------------REDUCETILEOVERLAP ------------------------------------------
  //------ Function to reduce a collection to a single image per day ---------------------------
  //--------------------------------------------------------------------------------------------
  //*********************************************************************************************
  
  // This function first counts the valid pixel, i.e., not null. Then calculates the percentage of valid pixels per area
  // It filters all the images with less than 75% of valid pixels. 
  // If there are two images in one day, the one with more valid pixels is selected
  
  exports.reduceTileOverlap = function(collection,vector,band) {
  
  // Count the number of valid pixels over the feature 
  var countPixels = function(image) {
                var count = image.select(band).reduceRegion({
                reducer: ee.Reducer.countDistinctNonNull(),
                geometry: vector.geometry() })
                return image.set('VALID_PIXELS_COUNT', count.get(band) );
  };
    
  collection = collection.map(countPixels);
  
  // Get the area of the selected vector
  var totalArea = vector.area();
  
  // Calculate ratio of valid pixels per area
  function validArea (image){
    var validPixels = ee.Number(image.get('VALID_PIXELS_COUNT'));
    var pixelsArea = validPixels.multiply(100); // Valid for sentinel pixels of 10 by 10, so area of pixels is 100 sqm
    return image.set('VALID_PIXELS_RATIO', pixelsArea.divide(totalArea));
  }
  
  collection = collection.map(validArea);
  
  // Remove images with no valid pixels
  collection = collection.filterMetadata('VALID_PIXELS_COUNT', 'greater_than', 0);
  
  // Remove images with a ratio of valid pixels less than 0.75
  collection = collection.filterMetadata('VALID_PIXELS_RATIO', 'greater_than', 0.75);
  
    
  // Get a list of the dates available in the collection  
  // This is done to iterate over the list and check duplicates
  var datesList = ee.List(collection.reduceColumns(
                  ee.Reducer.toList(), ["system:time_start"])
                  .get('list')).distinct();     //Get the list from the object and remove duplicates with distinct
  
  // Convert list of timestamp to ee.Date range
  datesList = datesList.map(function(item){
    return ee.Date(item).getRange('day'); 
  }).distinct();
  
  //Iterate over the date ranges list to filter the collection
  
  var listOfImages = datesList.map(function(date){
        var collectionDateFiltered =  collection.filterDate(date);
        //Get maximum value of valid pixels for the collection filtered by date
        var maxPixel =collectionDateFiltered.reduceColumns(ee.Reducer.max(), ["VALID_PIXELS_COUNT"]);
        // Filter collection by the maximum valid pixels count 
        var collectionFilterPixel = collectionDateFiltered.filterMetadata('VALID_PIXELS_COUNT','equals', maxPixel.get('max'));
        return collectionFilterPixel.first() });
        
  // The function above return a list of Images which is converted to a ee.ImageCollection
  var collectionReduced = ee.ImageCollection(listOfImages);
  return collectionReduced;
    
  };
  
  
  //**********************************************************************************************
  //-------------------------------------PLOTVALUES------------------------------------------------
  //------------------ Function to plot values given a region, a band and a reducer----------------
  //-----------------------------------------------------------------------------------------------
  //**********************************************************************************************
  
  
  exports.plotValues = function(vector,collection,band,reducer,title,vAxis){
  
  var chart = ui.Chart.image.series({
      imageCollection: collection.select(band),
      region: vector,
      scale: 10,
      reducer: reducer,
      xProperty: 'system:time_start'
      })
      .setOptions({
        interpolateNulls: false,
        lineWidth: 1,
        pointSize: 2,
        title: title,
        vAxis: {title: vAxis},
        hAxis: {title: 'Date', format: 'YYYY-MMM', gridlines: {count: 12}}
      });
      
   
  return chart;
  
  };