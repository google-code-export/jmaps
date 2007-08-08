(function($) {

	$.fn.jmap = function (o){
		var o = $.extend ({
			provider: "google",
			center: [55.958858,-3.162302]
		}, o);
		
		return this.each(function(){
			switch (o.provider) {
				case "google":
					var m = this.m = new GMap2(this);
					var c = this.c = new GControl(this);
					m.setCenter(new GLatLng(o.center[0], o.center[1]));
					var mapDiv = $.fn.createButton_("Map");
				 	var satDiv = $.fn.createButton_("Satellite");
					var hybDiv = $.fn.createButton_("Hybrid");
					
					$.fn.assignButtonEvent_(mapDiv, m, G_NORMAL_MAP, [satDiv, hybDiv]);
  					$.fn.assignButtonEvent_(satDiv, m, G_SATELLITE_MAP, [mapDiv, hybDiv]);
					$.fn.assignButtonEvent_(hybDiv, m, G_HYBRID_MAP, [satDiv, mapDiv]);
  					GEvent.addListener(m, "maptypechanged", function() {
						if (m.getCurrentMapType() == G_NORMAL_MAP) {
							GEvent.trigger(mapDiv, "click"); 
						} else if (m.getCurrentMapType() == G_SATELLITE_MAP) {
						    GEvent.trigger(satDiv, "click");
					    } else if (m.getCurrentMapType() == G_HYBRID_MAP) {
						    GEvent.trigger(hybDiv, "click");
					    }
					});
					
					break;
			}
		});
	}
	
	$.fn.createButton_ = function(t) {
		var buttonDiv = document.createElement("div");
  		$.fn.setButtonStyle_(buttonDiv);
  		buttonDiv.style.cssFloat = "left";
  		buttonDiv.style.styleFloat = "left";
  		var textDiv = document.createElement("div");
  		textDiv.appendChild(document.createTextNode(t));
  		textDiv.style.width = "6em";
  		buttonDiv.appendChild(textDiv);
  		return buttonDiv;
	}
	
	$.fn.setButtonStyle_ = function(button) {
  		button.style.color = "#000000";
  		button.style.backgroundColor = "white";
  		button.style.font = "small Arial";
  		button.style.border = "1px solid black";
  		button.style.padding = "0px";
  		button.style.margin= "0px";
  		button.style.textAlign = "center";
  		button.style.fontSize = "12px"; 
  		button.style.cursor = "pointer";
	}
	$.fn.assignButtonEvent_ = function(div, map, mapType, otherDivs) {
  		var me = this;
		GEvent.addDomListener(div, "click", function() {
			for (var i = 0; i < otherDivs.length; i++) {
				me.toggleButton_(otherDivs[i].firstChild, false);
			}
    		me.toggleButton_(div.firstChild, true);
    		map.setMapType(mapType);
  		});
	}
})($);