/* jQuery Maps (jmaps) - A jQuery plugin for Google Maps API
 * Author: Tane Piper (digitalspaghetti at gmail dot com) 
 * With special thanks Dave Cardwell (who helped on getting the first version of this plugin to work).
 * Website: http://code.google.com/p/jmaps/
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * This plugin is not affiliated with Google.
 * For Google Maps API and T&C see http://www.google.com/apis/maps/
 * 
 * For support, I can usually be found on the #jquery IRC channel on irc.freenode.net
 * ===============================================================================================================
 * ^^^ Changelog ^^^
 * Version 1.5 (In development)
 * Removed Yahoo! Maps support
 * ===============================================================================================================
 * Version 1.4 (08/08/2007)
 * Added option to double click on map to add marker.  Single click on marker gives Lat/Lng details, while double click removes
 * Moved searchAddress and searchDirections back into main function, can now be called via .searchAddress and .searchDirections, removed options for fields to pass in data
 * Added support for new Google Ad's Manager for Maps.  Can be enabled with .mapAds()
 * Added callback in searchAddress to return as a map, or as an array of Lat/Lng
 * Added callback in addRss
 * Added passing in custom icon
 * ===============================================================================================================
 * Version 1.3.1 (06/08/2007)
 * Fixed bug with change in Google Maps API
 * ===============================================================================================================
 * Version 1.3 (31/07/2007)
 * Added support for creating Yahoo! Maps, can create Map, Satallite or Hybrid.  Check out available options below
 * Added support for creating points on Yahoo! maps.
 * Added support for creating Polylines on Yahoo! maps.
 * Added support for GeoRSS files on both Yahoo! and Google maps, as well as existing KML support for Google, method name was changed from .addKml to .addRss
 * Moved directions search out of main namespace, now function that is called from within plugin by providing fields
 * Added Yahoo! Geocoding support
 * 
 * Known 1.3 Bugs
 * Event.MouseDoubleClick does not work on Yahoo maps within .addPoint method
 * ===============================================================================================================
 * Version 1.2 (25/07/2007)
 * Moved GClientGeocoder into searchAddress method
 * Fixed bug in searchAddress method regarding getPoint().
 * ===============================================================================================================
 * Version 1.1 (16/07/2007)
 * Changed name to remove Google from main name - namespace now .jmap.
 * Added additional options:
 * 	+ Add map dragging enable/disable.
 *	+ Add scroll wheel zooming.
 *	+ Add smooth continuous zooming (on certain browsers).
 *	+ Added clean unloading of Google objects.
 * Added .addPoly method.  Allows the creation of polylines on the map.
 * Added .addKml support for rendering KML Files.
 * Added .directions Driving Direction support.
 * ===============================================================================================================
 * Version 1.0 (13/07/2007)
 * Initial version.
 * Creates Google Map.
 * Add points to map.
 * Takes address or postcode, Geocodes and centers map.  Also creates a draggable marker.
 * ===============================================================================================================
 */
(function($) {
	$.fn.extend({
	/* jmap: function(settings)
	 * The constructor method
	 * Example: $().jmap();
	 */
	jmap: function(o) {
		var version = "1.4.1";
		/* Default Settings*/	
		var o = jQuery.extend({
			maptype: "hybrid",		// can be "map", "sat" or "hybrid"
			center: [55.958858,-3.162302],
			zoom: 12,
			controlsize: "small",
			showtype: true,
			showoverview: true,
			dragging: true,
			scrollzoom: false,
			smoothzoom: true,
			clickmarker: true
		},o);
		
		return this.each(function(){
			if (GBrowserIsCompatible()) {
				var jmap = this.jMap = new google.maps.Map2(this);
				switch(o.maptype) {	// Set Map Display Type
					case "map" :
						var loadmap = G_NORMAL_MAP;
						break;
					case "sat" :
						var loadmap = G_SATELLITE_MAP;
						break;
					case "hybrid" :
						var loadmap = G_HYBRID_MAP;
						break;
					}
				
				jmap.setCenter(new google.maps.LatLng(o.center[0],o.center[1]),o.zoom,loadmap);	//Default Center

				switch(o.controlsize) {	// Add Controls
					case "small":
						jmap.addControl(new google.maps.SmallMapControl());
						break;
					case "large":
						jmap.addControl(new google.maps.LargeMapControl());
						break;
					case "none":
						break;
				}
				
				if (o.showtype == true){
					jmap.addControl(new google.maps.MapTypeControl());// Type of map Control
				}
				if (o.showoverview == true){
					jmap.addControl(new google.maps.OverviewMapControl());//Overview Map
				}
				if (o.scrollzoom == true) {
					/* Off by default */
					jmap.enableScrollWheelZoom();
				}
				if (o.smoothzoom == true) {
					/* Off by default*/
					jmap.enableContinuousZoom();
				}
				if (o.dragging == false) {
					/* On by default */
					jmap.disableDragging();
				}
				if (o.clickmarker == true){
					google.maps.Event.addListener(jmap, "dblclick", function(marker, point){
						if (marker) {
							jmap.removeOverlay(marker);
						} else {
							var marker = new GMarker(point);
							jmap.addOverlay(marker);
							google.maps.Event.addListener(marker, 'click', function(){
								pointlocation = marker.getPoint();
								marker.openInfoWindowHtml("Latitude: " + pointlocation.lat() + "<br />Longitude: " + pointlocation.lng());
							})	
						}
					});
				}	
			}
		});
	},
	/* myMap: function()
	 * Returns a map object from the API, so it's available to the user
	 * Example: $().myMap().setCenter(...) for Google;
	 */
	myMap: function() {
		return this[0].jMap;
	},
	/* addPoint: function()
	 * Returns a marker to be overlayed on the Google map
	 * Example: $().addPoint(...);
	 */
	addPoint: function(pointlat, pointlng, icon, pointhtml, isdraggable, removable) {
		var jmap = this[0].jMap;
		if (typeof icon != 'undefined' || icon != null) {
			var marker = new google.maps.Marker(new google.maps.LatLng(pointlat,pointlng), icon, { draggable: isdraggable } );
		} else {
			var marker = new google.maps.Marker(new google.maps.LatLng(pointlat,pointlng), { draggable: isdraggable } );
		}
		google.maps.Event.addListener(marker, "click", function(){
			marker.openInfoWindowHtml(pointhtml);
		});
		if (removable == true) {
			google.maps.Event.addListener(marker, "dblclick", function(){
				return jmap.removeOverlay(marker);
			});
		}
		return jmap.addOverlay(marker);
	},
	/* addPoly: function(poly)
	 * Takes an array of GLatLng points, converts it to a vector Polyline to display on the map
	 * Example: $().addPoly(...);
	 */
	addPoly: function (poly, colour, width, alpha) {
		var jmap = this[0].jMap;
		return jmap.addOverlay(poly);
	},
	/* addRss: function()
	 * Takes a KML file and renders it to the map.
	 * Example: $().addPoint(...);
	 */
	addRss: function (rssfile, callback) {
		var jmap = this[0].jMap;
		var geoXml = new google.maps.GeoXml(rssfile, callback);
		return jmap.addOverlay(geoXml);
	},
	searchAddress: function (address, o, callback) {
		var o = jQuery.extend({
			returntype: "map"	//Return as Map or a Object
		},o);

		var jmap = this[0].jMap;
		GGeocoder = new GClientGeocoder();
		GGeocoder.getLatLng(address, function(point){
			if (!point) {
				alert(address + " not found");
			} else {
				switch (o.returntype) {
					case "object":
						var results = [];
						results[0] = point.y;
						results[1] = point.x;						
						return callback(results);
						break;
					default:
						jmap.setCenter(point);
						var marker = new google.maps.Marker(point, {draggable: true});
						jmap.addOverlay(marker);
						var pointlocation = marker.getPoint();
						marker.openInfoWindowHtml("Latitude: " + pointlocation.lat() + "<br />Longitude: " + pointlocation.lng());
						google.maps.Event.addListener(marker, "dragend", function(pointlocation){
							marker.openInfoWindowHtml("Latitude: " + pointlocation.lat() + "<br />Longitude: " + pointlocation.lng());			
						});
						break;
				}
			}
		});
	},
	searchDirections : function(from,to,panel) {
		var jmap = this[0].jMap;
		var dirpanel = document.getElementById(panel);
		search = new google.maps.Directions(jmap, dirpanel);
		search.load('from:' + from + ' to:' + to);
	},
	mapAds : function (p,o) {
		var jmap = this[0].jMap;		
		var o = jQuery.extend({
			maxAdsOnMap: 3,
			channel: "",
			minZoomLevel: 6
		},o);
		var adsManager = new google.maps.AdsManager(jmap, p, o);
		adsManager.enable();	
	},
	showTraffic : function() {
		var jmap = this[0].jMap;
		jmap.addOverlay(new google.maps.TrafficOverlay());
	},
	
});
})(jQuery);

/* On document unload, clean unload Google API*/
jQuery(document).unload(function(){ google.maps.Unload(); });