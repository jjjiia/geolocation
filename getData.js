var tables = []
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(usePosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function formatLocation(position){
    var lng = position.coords.longitude
    var lat = position.coords.latitude        
    var alt = position.coords.altitude 
    pub.coordinates = [lat,lng]
    d3.select("#coordinates").html("Lat: "+lat+"<br/>Lng: "+lng+"<br/>Alt: "+alt)//+"<br/>"+speed+"<br/>"+alt+"<br/>"+heading)
    return [lat,lng]
}

//var sampleLocation = [40.718914, -73.9547791]  
//var sampleUrl_fcc = "https://data.fcc.gov/api/block/2010/find?format=jsonp&latitude=40.718914&longitude=-73.9547791"
//var smapleUrl_census = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Suitland%2C+MD+20746&benchmark=9&format=json"

function usePosition(position) {
    var latLng = formatLocation(position)
    var lat = latLng[0]
    var lng = latLng[1]
    var fccUrl = "https://data.fcc.gov/api/block/2010/find?format=jsonp&latitude="+lat+"&longitude="+lng       
    getCensusId(fccUrl,"jsonp","formatCensusIds")
    
//var censusUrl =" https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Suitland%2C+MD+20746&benchmark=9&format=jsonp"
//getJson(censusUrl,"jsonp","censusGeography")
}
function getCensusId(url,type,callBack){
    $.ajax({
    url: url,
    dataType: type,
    jsonpCallback: callBack
    });
}

function formatCensusIds(json){
    var blockGroupid = "15000US"+json.Block.FIPS.slice(0,12)
    d3.select("#censusLabelFCC").html("Block: "+json.Block.FIPS+"<br/>Block Group: "+blockGroupid ) 
    pub.censusId = blockGroupid
    getCensusData(pub.censusId,"B01002")
//    var tableName = "B01002"
}

//https://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=16000US5367000

function getCensusData(geoid,tableCode){
    var censusReporter = "https://api.censusreporter.org/1.0/data/show/latest?table_ids="+tableCode+"&geo_ids="+geoid
    $.getJSON( censusReporter, function( data ) {
        var formattedData = formatCensusData(data,tableCode)
        displayCensusData(formattedData)
    });
}
function displayCensusData(data){
    var displayString = ""
    for(var r in data){
        var row = data[r]
        displayString += row.name
        displayString += ": "
        displayString += row.value
        displayString += "</br>"
    }
    d3.select("#data").html(displayString)
}
function formatCensusData(data,tableCode){
    var title = data.tables[tableCode].title
    var estimates = data.data[pub.censusId][tableCode].estimate
    var columnCodes = Object.keys(estimates)
    var columnNames = data.tables[tableCode].columns
    var formattedData = []
    for( var c in columnCodes){
        var cCode = columnCodes[c]
        var cName = columnNames[cCode].name
        var cValue = estimates[cCode]
        formattedData.push({"code":cCode,"name":cName,"value":cValue})
     //   console.log([cCode,cName,cValue])
    }
    return formattedData
}


getLocation() 
