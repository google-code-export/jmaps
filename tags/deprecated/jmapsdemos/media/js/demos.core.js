var demos = {};

if (!generalTimeout)
	var generalTimeout = 4000;

demos.getGeoLocationMethod = function(debug) {
	jQuery.jGrowl('Determining Geocoding method!', {'header': 'jMaps Mapping Demo', 'life': generalTimeout});
	//Find the W3C available geocoder
	var returnValue;
	if (!debug) {
	  try {
	    returnValue = navigator.geolocation;
	   } catch(error) {
	      try {
	        returnValue = google.gears.factory.create('beta.geolocation');
	      } catch (error) {
	        returnValue = null;
	      }
	   }
	 }
	 return returnValue;
};

demos.createMap = function (divid, mapCenter, callback) {
	jQuery.jGrowl("Creating Map", {'header': 'jMaps Mapping Demo', 'life': generalTimeout});
	jQuery(divid).jmap('init',{
		'mapCenter': mapCenter,
		'mapControl': 'none',
		'mapZoom': 14
	}, callback);
};

demos.errorHandler = function(error) {
	var errorReturn = 'Geode: Unknown Error. Falling back to IP-based location.';
	switch (error.code) {
		case error.UNKNOWN_ERROR:
			errorReturn = 'Geode: Unknown Error. Falling back to IP-based location.';
		break;
		case error.PERMISSION_DENIED:
			errorReturn = 'Geode: Permission Denied. Falling back to IP-based location.';
		break;
		case error.POSITION_UNAVAILABLE:
			errorReturn = 'Geode: Position Unavailable. Falling back to IP-based location.';
		break;
		case error.TIMEOUT:
			errorReturn = 'Geode: Timeout. Falling back to IP-based location.';
		break;
	}
	jQuery.jGrowl(errorReturn, {'header': 'jMaps Mapping Demo', 'life': generalTimeout + 2000});
}

demos.fetchLocationByIp = function(options, callback) {
  function defaults(){
    return {
      'service':'infosniper'
    }
  };
  options = jQuery.extend(defaults(), options);
  var return_location;
  jQuery.get('/geocode', {'service':options.service}, function(data,success) {
  
  if (options.service == 'infosniper' && data == false) {
    jQuery.jGrowl('Infosniper failed, quota exceded!  Falling back to hostip', {'header': 'jMaps Mapping Demo', 'life': generalTimeout});
    demos.fetchLocationByIp({'service':'hostip'}, callback);
  } else {
    try {
      switch(options.service) {
        case 'infosniper':
	        return_location = [data.latitude, data.longitude];
        break;
        case 'hostip':
          return_location = [data.longitude, data.latitude];
        break;
      }
    } catch (error) {
      return_location = false;
    }
    return callback(return_location);
  }
  }, 'json');
}

/*
demos.createLocations = function(latlng) {
	jQuery.jGrowl('Creating Locations', {'header': 'jMaps Mapping Demo', 'life': generalTimeout});
	var locations = [];
	for(var i=0;i<5;i++) {
		var lat = latlng[0] + (Math.random() - 0.5);
		var lng = latlng[1] + (Math.random() - 0.5);
		locations.push([lat,lng]);
	}
	return locations;
}

demos.determineHit = function(latlng, locations) {
	var hit = false;
	var point = [new String(latlng.lat()), new String(latlng.lng())];
	jQuery.each(point, function(i, item){
		var tmp = point[i].split('.');
		point[i] = parseFloat(tmp[0] + '.' + tmp[1].slice(0,1));
	});
	jQuery.each(locations, function(i, location) {
		location[0] = new String(location[0]); location[1] = new String(location[1]);
		var tmp1 = location[0].split('.');
		var tmp2 = location[1].split('.');
		location[0] = parseFloat(tmp1[0] + '.' + tmp1[1].slice(0,1));
		location[1] = parseFloat(tmp2[0] + '.' + tmp2[1].slice(0,1));
		if (location[0] == point[0] && location[1] == point[1])
			hit = true;
	});
	return hit;
}*/
