(function($) {
	$.fn.jmap = function (o){
		var o = $.extend ({
			center: [55.958858,-3.162302],
			zoom: 12
		}, o);
		return this.each(function(){
			var m = this.m = new GMap2(this);
			m.setCenter(new GLatLng(o.center[0], o.center[1]), o.zoom);
			});
	}
	$.fn.createControl = function(t,m,o) {
		var self = this;
		var jmap = this[0].jmap;
		var c = new GControl();
		var b = $.fn.createControl.createButton(t);

		return b;
	}
	/*
	 * jmap Prototype functions
	 * These functions are internal function of the main jmap prototype
	 * They provide custom buttons that can be added to the map to provide
	 * controls.
	 */
	$.extend($.fn.createControl, {
		createButton : function(t) {
			var buttonDiv = document.createElement("div");
  			this.setButtonStyle(buttonDiv);
			$(buttonDiv).css({cssFloat: 'left', styleFloat: 'left'});
  			var textDiv = document.createElement("div");
			$(textDiv).html(t);
			$(textDiv).css({width: "6em"});
			$(buttonDiv).append(textDiv);
  			return buttonDiv;
		},
		setButtonStyle : function(b,o) {	
			var o = $.extend({
				color: "#000",
				backgroundColor: "#fff",
				font: "small Arial",
				border: "1px solid black",
				padding: "0px",
				margin: "0px",
				textAlign: "center",
				fontSize: "12px",
				cursor: "pointer"
			},o);
			$(b).css({
						color: o.color, 
						backgroundColor: o.backgroundColor,
						font: o.font,
						border: o.border,
						padding: o.padding,
						margin: o.margin,
						textAlign: o.textAlign,
						fontSize: o.fontSize,
						cursor: o.cursor,
						position: 'relative'
			});
			return b;
		},
		assignButtonEvent : function(div, map, mapType, otherDivs) {
  			var self = this;
			GEvent.addDomListener(div, "click", function() {
				for (var i = 0; i < otherDivs.length; i++) {
					self.toggleButton(otherDivs[i].firstChild, false);
				}
    			self.toggleButton(div.firstChild, true);
    			map.setMapType(mapType);
  			});
		},
		toggleButton : function(div, boolCheck) {
   			div.style.fontWeight = boolCheck ? "bold" : "";
   			div.style.border = "1px solid white";
   			var shadows = boolCheck ? ["Top", "Left"] : ["Bottom", "Right"];
   			for (var j = 0; j < shadows.length; j++) {
     			div.style["border" + shadows[j]] = "1px solid #b0b0b0";
  			} 
  	 	}
	});
	
	/*
	 * $().searchAddress(address,options,cache,callback);
	 */
	$.fn.searchAddress = function(a,o,ca,c) {
		var jmap = this[0].jmap;
		var g = new GClientGeocoder();	
		var o = $.extend({
			searchfunc: 'getLatLng',	//Option of getLatLng or getLocations, have different callbacks
		}, o);
		if (typeof ca != 'undefined') {
			g.setCache(ca);
		}
		jmap[o.searchfunc](a, c);
		return g, c;
	}
	
	/*
	 * searchAddress Prototype Functions
	 * These prototype functions provide a way to generate a Geocode cache easily
	 */
	$.extend($.fn.searchAddress.prototype, {
		cache : function() {
			c = new GGeocodeCache();
			return c;
		},
		factCache : function() {
			c = new GFactualGeocodeCache();
			return c;
		}
	});
	/*
	 * $().searchDirections(from,to,panel,options)
	 * This function provides access to the Google Directions service
	 */
	$.fn.searchDirections = function(f,t,p,o) {
		var jmap = this[0].jmap;
		var s = new GDirection(jmap, $(p));
		
		var o = $.extend({
			local: 'en_UK',
			getPolyline: true,
			getSteps: true,
			preserveViewport: true
		},o);
		
		s.load('from: ' + f + ' to: ' + t, o);
		return s;
	}
})($);