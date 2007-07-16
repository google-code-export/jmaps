/* jQuery Maps (jMaps) - A jQuery plugin for Google Maps API
 * Author: Tane Piper (digitalspaghetti@gmail.com) 
 * With special thanks Dave Cardwell (who helped on getting this plugin to work).
 * Website: http://code.google.com/p/gmapp/
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * This plugin is not affiliated with Google.  For Google Maps API and T&C see http://www.google.com/apis/maps/
 * 
 * === Changelog ===
 * Version 1.2 (In Development)
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
		var version = "1.2";
		/* Default Settings*/	
		settings = jQuery.extend({
			maptype: G_HYBRID_TYPE,
			center: [55.958858,-3.162302],
			zoom: 12,
			control: "small",
			showtype: true,
			showoverview: true,
			dragging: true,
			scrollzoom: true,
			smoothzoom: true,
			searchfield: "#Address",
			searchbutton: "#findaddress"
		},settings);
		if (GBrowserIsCompatible())
		{
			return this.each(function(){
				var jmap = this.GMap2 = new GMap2(this);
				this.GMap2.setCenter(new GLatLng(settings.center[0],settings.center[1]),settings.zoom,settings.maptype);
				switch(settings.control)
				{
					case "small":
						this.GMap2.addControl(new GSmallMapControl());
						break;
					case "large":
						this.GMap2.addControl(new GLargeMapControl());
						break;
					case "none":
						break;
					default:
						this.GMap2.addControl(new GSmallMapControl());
				}
				if (settings.showtype == true){
					this.GMap2.addControl(new GMapTypeControl());
				}
				if (settings.showoverview == true){
					this.GMap2.addControl(new GOverviewMapControl());
				}
				if (settings.scrollzoom == true) {
					/* Off by default */
					this.GMap2.enableScrollWheelZoom();
				}
				if (settings.smoothzoom == true) {
					/* Off by default*/
					this.GMap2.enableContinuousZoom();
				}
				if (settings.dragging == false) {
					/* On by default */
					this.GMap2.disableDragging();
				}
				/* Seach for the lat & lng of our address*/
				jQuery(settings.searchbutton).bind('click', function(){
					searchAddress(jmap, jQuery(settings.searchfield).attr('value'), settings);
				});
				/* On document unload, clean unload Google API*/
				jQuery(document).unload(function(){ GUnload(); });
			});
		}
	},
	/* myMap: function()
	 * Returns a GMap2 object, so Google's map API is exposed to the user
	 * Example: $().myMap().setCenter(...);
	 */
	myMap: function() {
		return this[0].GMap2;	
	},
	/* addPoint: function()
	 * Returns a marker to be overlayed on the Google map
	 * Example: $().addPoint(...);
	 */
	addPoint: function(pointlat, pointlng, pointhtml, isdraggable, removable) {
		var jmap = this[0].GMap2;
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
	},
	/* addPoly: function(poly)
	 * Takes an array of GLatLng points, converts it to a vector Polyline to display on the map
	 * Example: $().addPoly(...);
	 */
	addPoly: function (poly) {
		var jmap = this[0].GMap2;
		return jmap.addOverlay(poly);
	},
	/* addKml: function()
	 * Takes a KML file and renders it to the map.
	 * Example: $().addPoint(...);
	 */
	addKml: function (kmlfile) {
		var jmap = this[0].GMap2;
		var geoXml = new GGeoXml(kmlfile);
		return jmap.addOverlay(geoXml);
	},
	/* directions: function(query, panel)
	 * Takes a Direction query and returns directions for map.  Optional panel for text information
	 * Example: $().directions(...);
	 */
	directions: function(query,panel) {
		var jmap = this[0].GMap2;
		var dirpanel = document.getElementById(panel);
		directions = new GDirections(jmap, dirpanel);
		directions.load(query);
	}
});
})(jQuery);