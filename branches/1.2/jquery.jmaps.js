/* jQuery Maps (jMaps) - A jQuery plugin for Google Maps API
 * Author: Tane Piper (digitalspaghetti@gmail.com) 
 * With special thanks Dave Cardwell (who helped on getting this plugin to work).
 * Website: http://code.google.com/p/gmapp/
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * This plugin is not affiliated with Google.  For Google Maps API and T&C see http://www.google.com/apis/maps/
 * 
 * === Changelog ===
 * Version 1.3
 * 
 * 
 * Version 1.2 (25/07/2007)
 * Moved GClientGeocoder into searchAddress method
 * Fixed bug in searchAddress method regarding getPoint().
 * 
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
 * 
 * Version 1.0 (13/07/2007)
 * Initial version.
 * Creates Google Map.
 * Add points to map.
 * Takes address or postcode, Geocodes and centers map.  Also creates a draggable marker.
 */
(function($) {
	/* function searchAddress(jmap, address, settings)
	 * This function is an internal plugin method that returns a GLatLng that can be passed
	 * to a Google map.
	 */
	function searchAddress(jmap, address, settings) {
		GGeocoder = new GClientGeocoder();
		GGeocoder.getLatLng(address, function(point){
			if (!point) {
				alert(address + " not found");
			} else {
				jmap.setCenter(point,settings.zoom);
				var marker = new GMarker(point, {draggable: true});
				jmap.addOverlay(marker);
				pointlocation = marker.getPoint();
				marker.openInfoWindowHtml("Latitude: " + pointlocation.lat() + "<br />Longitude: " + pointlocation.lng());
				GEvent.addListener(marker, "dragend", function(){
					mylocation = marker.getPoint();
					marker.openInfoWindowHtml("Latitude: " + pointlocation.lat() + "<br />Longitude: " + pointlocation.lng());			
				});
			}
	});
};
$.fn.extend({
	/* jmap: function(settings)
	 * The constructor method
	 * Example: $().jmap();
	 */
	jmap: function(settings) {
		var version = "1.3";
		/* Default Settings*/	
		var settings = jQuery.extend({
			provider: "google",
			maptype: "hybrid",
			center: [55.958858,-3.162302],
			zoom: 12,
			control: "small",
			showtype: true,
			showzoom: true,
			showpan: true,
			showoverview: true,
			dragging: true,
			scrollzoom: true,
			smoothzoom: true,
			searchfield: "#Address",
			searchbutton: "#findaddress"
		},settings);
		
		return this.each(function(){
			switch(settings.provider)
			{
				case "yahoo":
					var jmap = this.jMap = new YMap(this);
					switch(settings.maptype) {
						case "map":
							var loadmap = YAHOO_MAP_REG;
							break;
						case "sat":
							var loadmap = YAHOO_MAP_SAT;
							break;
						default:
							var loadmap = YAHOO_MAP_HYB;
							break;
					}
					
					jmap.setMapType(loadmap);
					jmap.drawZoomAndCenter(new YGeoPoint(settings.center[0],settings.center[1]), settings.zoom);
					console.log(jmap);
					if (settings.showtype == true){
						jmap.addTypeControl();
					}
					if (settings.showzoom == true){
						jmap.addZoomLong();
					}
					if (settings.showpan == true) {
						jmap.addPanControl();
					}
					break;
					
				case "mslive":
					alert('Microsoft Live Maps are currently not supported but planned for version 1.4')
					break;
					
				default:	
					var jmap = this.jMap = new GMap2(this);
					switch(settings.maptype) {
						case "map":
							var loadmap = G_NORMAL_MAP;
							break;
						case "sat":
							var loadmap = G_SATELLITE_MAP;
							break;
						default:
							var loadmap = G_HYBRID_MAP;
							break;
					}
					
					jmap.setCenter(new GLatLng(settings.center[0],settings.center[1]),settings.zoom,loadmap);
					
					switch(settings.control)
					{
						case "small":
							jmap.addControl(new GSmallMapControl());
							break;
						case "large":
							jmap.addControl(new GLargeMapControl());
							break;
						case "none":
							break;
						default:
							jmap.addControl(new GSmallMapControl());
					}
					if (settings.showtype == true){
						jmap.addControl(new GMapTypeControl());
					}
					if (settings.showoverview == true){
						jmap.addControl(new GOverviewMapControl());
					}
					if (settings.scrollzoom == true) {
						/* Off by default */
						jmap.enableScrollWheelZoom();
					}
					if (settings.smoothzoom == true) {
						/* Off by default*/
						jmap.enableContinuousZoom();
					}
					if (settings.dragging == false) {
						/* On by default */
						jmap.disableDragging();
				}
			}
			console.log(settings);	
			/* Seach for the lat & lng of our address*/
			jQuery(settings.searchbutton).bind('click', function(){
				searchAddress(jmap, jQuery(settings.searchfield).attr('value'), settings);
			});
			/* On document unload, clean unload Google API*/
			jQuery(document).unload(function(){ GUnload(); });
		});
		},
	/* myMap: function()
	 * Returns a GMap2 object, so Google's map API is exposed to the user
	 * Example: $().myMap().setCenter(...);
	 */
	myMap: function() {
		return this[0].jMap;	
	},
	/* addPoint: function()
	 * Returns a marker to be overlayed on the Google map
	 * Example: $().addPoint(...);
	 */
	addPoint: function(pointlat, pointlng, pointhtml, isdraggable, removable, settings) {
		console.log(this[0].jMap);
		if (this[0].jMap._mapType == "YAHOO_HYB" || this[0].jMap._mapType == "YAHOO_SAT"  || this[0].jMap._mapType == "YAHOO_MAP") {
			var jmap = this[0].jMap;
			var marker = new YGeoPoint(pointlat, pointlng);
			jmap.addMarker(marker);
		}			
		if (this[0].jMap.i.Au == "Hybrid" || this[0].jMap.i.Au == "Satellite" || this[0].jMap.i.Au == "Map") {
			var jmap = this[0].jMap;
			var marker = new GMarker(new GLatLng(pointlat,pointlng), { draggable: isdraggable } );
			GEvent.addListener(marker, "click", function(){
				marker.openInfoWindowHtml(pointhtml);
			});
			if (removable == true) {
				GEvent.addListener(marker, "dblclick", function(){
					return jmap.removeOverlay(marker);
				});
			}
			return jmap.addOverlay(marker);
		}
	},
	/* addPoly: function(poly)
	 * Takes an array of GLatLng points, converts it to a vector Polyline to display on the map
	 * Example: $().addPoly(...);
	 */
	addPoly: function (poly) {
		var jmap = this[0].jMap;
		return jmap.addOverlay(poly);
	},
	/* addKml: function()
	 * Takes a KML file and renders it to the map.
	 * Example: $().addPoint(...);
	 */
	addKml: function (kmlfile) {
		var jmap = this[0].jMap;
		var geoXml = new GGeoXml(kmlfile);
		return jmap.addOverlay(geoXml);
	},
	/* directions: function(query, panel)
	 * Takes a Direction query and returns directions for map.  Optional panel for text information
	 * Example: $().directions(...);
	 */
	directions: function(query,panel) {
		var jmap = this[0].jMap;
		var dirpanel = document.getElementById(panel);
		directions = new GDirections(jmap, dirpanel);
		directions.load(query);
	}
});
})(jQuery);