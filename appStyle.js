var fullOrchard = /* color: #d63000 */ee.Geometry.Polygon(
    [[[19.959516623766266, 45.102739516930676],
      [19.960793355257355, 45.10167173975052],
      [19.96312151268228, 45.10236087482578],
      [19.96294985130533, 45.10285310907245],
      [19.963593581468903, 45.10295155541248],
      [19.965320924074494, 45.100376749140274],
      [19.968764880449616, 45.10133095559558],
      [19.96789584472879, 45.10244417630431],
      [19.96764908149942, 45.10249718627285],
      [19.96686587646707, 45.1035800934278],
      [19.96669421509012, 45.10363310234158],
      [19.96589944585829, 45.1047162357325],
      [19.962482508545996, 45.10408338976531],
      [19.95916729820359, 45.10346621637319]]]),
golden = /* color: #ffc82d */ee.Geometry.Polygon(
    [[[19.965432830202218, 45.1033179808391],
      [19.963566012727853, 45.10297720651061],
      [19.963748402940865, 45.10251526472887],
      [19.963952250825997, 45.10256827463137],
      [19.96438140426838, 45.10178835986703],
      [19.965314813005563, 45.1003949213231],
      [19.966999240266915, 45.10084173412552]]]),
granny = /* color: #00ffff */ee.Geometry.Polygon(
    [[[19.967015333521005, 45.10085300067286],
      [19.968780227052804, 45.101330101914215],
      [19.96865148102009, 45.10163302126802],
      [19.96785754715168, 45.10245089549536],
      [19.967681737849684, 45.102495122135096],
      [19.966898532817336, 45.10357802932921],
      [19.965450139949294, 45.10331298401238]]]),
fuji = /* color: #98ff00 */ee.Geometry.Polygon(
    [[[19.959157302349006, 45.10346103704228],
      [19.959425523250495, 45.10273783757956],
      [19.959865110314404, 45.1024727742868],
      [19.96074487487129, 45.10167761925093],
      [19.963126676476513, 45.102351608520344],
      [19.96251080834606, 45.10407436168689]]]),
gala = /* color: #0b4a8b */ee.Geometry.Polygon(
    [[[19.96263330079948, 45.104109145324365],
      [19.963024903315656, 45.102946733970455],
      [19.96668343641197, 45.10360556285531],
      [19.96644885890667, 45.10404293920863],
      [19.965890959431572, 45.10470175544293]]]);


      

// Fonts & Colors //
// (pulled from Scripts/User Interface/Mosaic Editor) //
var colors = {'transparent': '#11ffee00', 'gray': '#F8F9FA'};
exports.colors = {'transparent': '#11ffee00', 'gray': '#F8F9FA'};

exports.TITLE_STYLE = {
  fontWeight: '100',
  fontSize: '32px',
  padding: '8px',
  color: '#616161',
  backgroundColor: colors.transparent,
};

exports.SUBTITLE_STYLE = {
  fontWeight: '350',
  fontSize: '22px',
  padding: '8px',
  color: '#616161',
  textAlign: 'center',
  //maxWidth: '450px',
  backgroundColor: colors.transparent,
};

exports.PARAGRAPH_STYLE = {
  fontSize: '14px',
  fontWeight: '50',
  color: '#616161',
  padding: '8px',
  whiteSpace: 'pre',
  backgroundColor: colors.transparent,
};

exports.BUTTON_STYLE = {
  fontSize: '14px',
  fontWeight: '100',
  color: '#616161',
  padding: '8px',
  backgroundColor: colors.transparent,
};

exports.SELECT_STYLE = {
  fontSize: '14px',
  fontWeight: '50',
  color: '#616161',
  padding: '2px',
  backgroundColor: colors.transparent,
  width: '80px'
};

exports.LABEL_STYLE = {
  fontWeight: '50',
  textAlign: 'center',
  fontSize: '14px',
  padding: '2px',
  backgroundColor: colors.transparent,
};

// Dictionaries for the select widgets

exports.year_list = [
    {label: '2013', value: 2013},
    {label: '2014', value: 2014},
    {label: '2015', value: 2015},
    {label: '2016', value: 2016},
    {label: '2017', value: 2017},
    {label: '2018', value: 2018},
    {label: '2019', value: 2019},
    {label: '2020', value: 2020}
  ];

exports.month_list = [
    {label: 'January (1)', value: 1},
    {label: 'February (2)', value: 2},
    {label: 'March (3)',value: 3},
    {label: 'April (4)',value:  4},
    {label: 'May (5)',value:  5},
    {label: 'June (6)',value:  6},
    {label: 'July (7)',value:  7},
    {label: 'August (8)',value:  8},
    {label: 'September (9)',value: 9},
    {label: 'October (10)',value: 10},
    {label: 'November (11)',value: 11},
    {label: 'December (12)',value: 12}
  ];

exports.day_list = [
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3',value:  3},
    {label: '4',value:  4},
    {label: '5',value:  5},
    {label: '6',value:  6},
    {label: '7',value:  7},
    {label: '8',value:  8},
    {label: '9',value:  9},
    {label: '10',value: 10},
    {label: '11',value: 11},
    {label: '12',value: 12},
    {label: '13',value: 13},
    {label: '14',value: 14},
    {label: '15',value: 15},
    {label: '16',value: 16},
    {label: '17',value: 17},
    {label: '18',value: 18},
    {label: '19',value: 19},
    {label: '20',value: 20},
    {label: '21',value: 21},
    {label: '22',value: 22},
    {label: '23',value: 23},
    {label: '24',value: 24},
    {label: '25',value: 25},
    {label: '26',value: 26},
    {label: '27',value: 27},
    {label: '28',value: 28},
    {label: '29',value: 29},
    {label: '30',value: 30},
    {label: '31',value: 31},
  ];



exports.collection_list = [
    {label: 'Sentinel Level-2A (Surface Reflectance) ', value: 'COPERNICUS/S2_SR'},
    {label: 'Sentinel Level-1C (Top-of-Atmosphere Reflectance) ', value: 'COPERNICUS/S2'}
  ];
  
  
exports.reducer_graph_list = [
    {label: 'Mean',   value: 0, object: ee.Reducer.mean()},
    {label: 'MinMax', value: 1, object: ee.Reducer.minMax()},
    {label: 'StdDev', value: 2, object: ee.Reducer.stdDev()}
  ];
  
  
exports.polygon_list = [
    {label: 'Full Orchard', value: 0, object: fullOrchard},
    {label: 'Fuji',         value: 1, object: fuji},
    {label: 'Gala',         value: 2, object: gala},
    {label: 'Golden',       value: 3, object: golden},
    {label: 'Granny',       value: 4, object: granny}
  ];  
exports.index_list = [
    {label: 'NDVI', value:'NDVI'},
    {label: 'EVI', value: 'EVI'}
  ];
  
