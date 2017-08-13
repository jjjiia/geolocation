//http://www.movable-type.co.uk/scripts/latlong.html

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
   return this * 180 / Math.PI;
}


function getDirection(){
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
                // console.log(event.alpha + ' : ' + event.beta + ' : ' + event.gamma);
                var direction = Math.round(event.alpha)
                d3.select("#orientation").html("from north: "+direction)
                return direction
        });
    }else{
        d3.select("#orientation").html("no orientation data from device")
    }
}

function getPointsInDirection(lng,lat, dist,brng){
    dist = dist / 6371;  
    brng = brng.toRad(); 
    
    var lat1 = lat.toRad()
    var lon1 = lng.toRad();

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1), 
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));
    console.log([lat2.toDeg(),lon2.toDeg()])
    return [lat2.toDeg(),lon2.toDeg()]
}
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(returnPosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function returnPosition(position){
    var lng = position.coords.longitude
    var lat = position.coords.latitude        
    var alt = position.coords.altitude 
    
    pub.lat = lat
    pub.lng = lng
    
    var dist = 5
    var brng = 45
    for(var d = 0; d<5; d+=.5){
        getPointsInDirection(lng,lat, d,brng)
    }
    
}

getLocation()

