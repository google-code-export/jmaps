/* appjet:version 0.1 */
/* appjet:server */
import("lib-json");
import("lib-xmlobj");
import("lib-text-trim");
import("lib-jquery");

function get_main(){
    page.setTitle('jMaps - Live Demo');
    
    page.head.write(SCRIPT({src: "http://code.google.com/apis/gears/gears_init.js"}));
    page.head.write(SCRIPT({src: "http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAApCYnM8S-TSRBhQk16Ynr4BQjT8KyRqHRBfdS7G5Clk2o85RovxRiOSkpyGzrsFZFMFqBLjOyR6T7_w"}));
    page.head.write(SCRIPT({src: "http://1.latest.jmapsdemos.appspot.com/js/lib/jquery.jmap.js"}));
    page.head.write(SCRIPT({src: "http://jmaps.googlecode.com/svn/branches/jmapsdemos/media/js/lib/jquery.jgrowl_minimized.js"}));

    page.head.write("""
    <script type="text/javascript">
    var clientIp = '""" + request.clientAddr + """';
    </script>
    """);
    print(image('http://1.latest.jmapsdemos.appspot.com/images/jmaps-title.png'));
    print(html("""
        <div id="instructions">
            <h2>Introduction</h2>
            <p>
                Welcome to the jMaps Live Demo!
            </p>
            <p>
                This demo is developed using <a href="http://jquery.com">jQuery</a>, <a href="http://code.google.com/p/jmaps">jMaps</a>
                and <a href="http://appjet.com">AppJet</a> (with <a href="http://www.stanlemon.net/projects/jgrowl.html">jGrowl</a> for notifications).  The <a href="http://source.jmaps.appjet.net/">Source code</a> is freely available
                to view and copy.
            </p>
            <p>
                When this page loads, it will attempt to localise the content of
                the page by looking for a <a href="http://dev.w3.org/geo/api/spec-source.html">W3C compliant browser geocoder</a>
                such as <a href="https://wiki.mozilla.org/Labs/Geode">Mozilla Geode</a> or <a href="http://gears.google.com/">Google Gears</a>
                which will provide your location.  If it's not available, then it will attempt IP-based geocoding.  If all else
                fails, then you'll land on the Googleplex.
            </p>
            <p>
                From here, you can control the map using the right hand sidebar.
            </p>
            <h2>Location API</h2>
            <p>
                As part of writing this app, I have written a small API that you are free to use to get a IP-based location.  This service
                uses <a href="http://infosniper.com">InfoSniper</a> and <a href="http://hostip.info">Hostip</a>, parsing their XML and returning
                a small JSON object.  Please note the InfoSniper API is limited to 50 hits per day per IP address.
            </p>
            <p>
                To use the API pass your IP to the following addresses:
                <ul>
                    <li><pre>http://jmaps.appjet.net/lookupHostip?ip=12.215.42.19</pre></li>
                    <li><pre>http://jmaps.appjet.net/lookupInfosniper?ip=12.215.42.19</pre></li>
                </ul>
            </p>
            <p>
                In return you will recieve a JSON object like this:
                <br />
                <pre>
                    {"latitude":"41.7768","success":true,"country":"United States","city":"Sugar Grove","longitude":"-88.4605"}
                </pre>
            </p>
            <h2>lib-trim-text</h2>
            <p>
                As part of this application I also wrote a text trim library.  You can find out more details about it at <a href="http://lib-text-trim.appjet.net/">http://lib-text-trim.appjet.net</a>.
            </p>
        </div>
    """));
    print(html("""
        <br style="clear:both;" />
        <div id="map-container">
            <div id="map">Map loading...Attempting to find your location</div>
            <div id="directions"></div>
        </div>
    """));
    print(html("""
        <div id="control-panel">
            <table>
                <tbody>
                        <tr>
                                <th scope="row"><label for="change-map-type">Map Type</label></th>
                                <td scope="row" align="right">
                                        <select id="change-map-type" class="change-map-type">
                                                <option value="G_NORMAL_MAP">Earth: Normal Map</option>
                                                <option value="G_SATELLITE_MAP">Earth: Satellite Map</option>
                                                <option value="G_HYBRID_MAP">Earth: Hybrid Map</option>
                                                <option value="G_PHYSICAL_MAP">Earth: Physical Map</option>
                                                <option value="G_MOON_ELEVATION_MAP">Moon: Elevation Map</option>
                                                <option value="G_MOON_VISIBLE_MAP">Moon: Visible Map</option>
                                                <option value="G_MARS_ELEVATION_MAP">Mars: Elevation Map</option>
                                                <option value="G_MARS_VISIBLE_MAP">Mars: Visible Map</option>
                                                <option value="G_MARS_INFRARED_MAP">Mars: Infrared Map</option>
                                                <option value="G_SKY_VISIBLE_MAP">Sky: Visible Map</option>
                                        </select>
                                </td>
                        </tr>
                        <tr>
                                <th scope="row">Map Controls</th>
                                <td scope="row" align="right">
                                        <table>
                                                <tbody>
                                                        <tr>
                                                                <th scope="row">Main Control Size</th>
                                                                <td scope="row" align="right">
                                                                        <select id="map-control-type" name="map-control-type">
                                                                                <option value="null">None</option>
                                                                                <option value="GSmallMapControl" selected="selected">Small</option>
                                                                                <option value="GLargeMapControl">Large</option>
                                                                        </select>
                                                                </td>
                                                                <tr>
                                                                        <th scope="row">Map Type Control</th>
                                                                        <td scope="row" align="right">
                                                                                <input type="checkbox" name="map-type-toggle" id="map-type-toggle" />
                                                                        </td>
                                                                </tr>
                                                                <tr>
                                                                        <th scope="row">Map Overview Control</th>
                                                                        <td scope="row" align="right">
                                                                                <input type="checkbox" name="map-overview-toggle" id="map-overview-toggle" />
                                                                        </td>
                                                                </tr>
                                                                <tr>
                                                                        <th scope="row">Map Scale Control</th>
                                                                        <td scope="row" align="right">
                                                                                <input type="checkbox" name="map-scale-toggle" id="map-scale-toggle" />
                                                                        </td>
                                                                </tr>
                                                                <tr>
                                                                        <th scope="row">Map Dragging</th>
                                                                        <td scope="row" align="right">
                                                                                <input type="checkbox" checked="checked" name="map-dragging-toggle" id="map-dragging-toggle" />
                                                                        </td>
                                                                </tr>
                                                                <tr>
                                                                        <th scope="row">Google Search Bar</th>
                                                                        <td scope="row" align="right">
                                                                                <input type="checkbox" name="map-search-toggle" id="map-search-toggle" />
                                                                        </td>
                                                                </tr>
                                                        </tr>
                                                </tbody>
                                        </table>
                                </td>
                        </tr>
                        <tr>
                            <th scope="row">Search Directions</th>
                            <td scope="row" align="right">
                                <label for="from-location">From:</label>
                                <input type="test" name="from-location" id="from-location" />
                                <br />
                                <label for="to-location">To:</label>
                                <input type="test" name="to-location" id="to-location" />
                                <br />
                                <input type="submit" class="get-directions" value="Get Directions" />
                            </td>
                        </tr>
                </tbody>
        </table>
    </div>"""));
    
    print(html("""
    <script type="text/javascript">
        var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
        document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script>
    <script type="text/javascript">
    try {
        var pageTracker = _gat._getTracker("UA-716306-15");
        pageTracker._trackPageview();
    } catch(err) {}
    </script>"""));
}

function get_lookupHostip() {
    page.setMode('plain');
    if (request.params){
        var data = wget('http://api.hostip.info/get_html.php', {'ip': request.params.ip, 'position':true});
        var results = data.split(/\n/);
        var country = trim(results[0].split(':')[1]);
        var city = trim(results[1].split(':')[1]);
        var lat = trim(results[2].split(':')[1]);
        var lng = trim(results[3].split(':')[1]);
        
        if (lng !== '' && lat !== '') {
            var returnData = {
                'success':true,
                'city': city,
                'country':country,
                'latitude': lat,
                'longitude': lng
            };
        } else {
            var returnData = {
                'success':false
            }   
        }
    } else {
         var returnData = {'success':false};   
    }
    print(JSON.stringify(returnData));
}

function get_lookupInfosniper() {
    page.setMode('plain');
    if (request.params){
        var data = wget('http://www.infosniper.net/xml.php', {'ip_address': request.params.ip});
        var xml = new XMLObj(data);
        
        var country = xml.result.country.getText();
        var city = xml.result.city.getText();
        var lat = xml.result.latitude.getText();
        var lng = xml.result.longitude.getText();
        if (lng !== 'Quota exceeded' && lat !== 'Quota exceeded') {
            if (lng !== '' && lat !== '') {
                var returnData = {
                    'success':true,
                    'city': city,
                    'country':country,
                    'latitude': lat,
                    'longitude': lng
                };
            } else {
                var returnData = {
                    'success':false
                }   
            }
        } else {
            var returnData = {
                'success':false
            }   
        }
    } else {
         var returnData = {'success':false};   
    }
    print(JSON.stringify(returnData));
}

dispatch();
/* appjet:client */
jQuery(document).ready(function(){
    jQuery.jGrowl('Welcome to jMaps.  I will now try determine your location.', {'header': 'jMaps Mapping Demo', 'life': 5000});
    var geoCoder = determineGeoLocation();
    if (geoCoder) {
        jQuery.jGrowl('Using W3C Compliant Encoder.', {'header': 'jMaps Mapping Demo', 'life': 5000});
        geoCoder.getCurrentPosition(positionSuccess, positionError, {'enableHighAccuracy':true, 'timeout':30, 'maximumAge':600});
    } else {
        jQuery.jGrowl('No Geocoding in browser, Falling back to IP based location.', {'header': 'jMaps Mapping Demo', 'life': 5000});
        getIpBasedLocation()
    }
});

function determineGeoLocation() {
    var encoder = false;
    var test = typeof navigator.geolocation;
    if ( test !== 'undefined' ) {
        encoder = navigator.geolocation;
    } else {
        try {
            encoder = google.gears.factory.create('beta.geolocation');
        } catch (error) {
            //Fall back to IP Based
            encoder = false;
        }
    }
    return encoder;
};

function getIpBasedLocation() {
    var success = false;
    var services = ['lookupInfosniper', 'lookupHostip'];
    var request_vars = {'ip':clientIp};
    
    jQuery.each(services, function(i, service) {
        var url = '/' + service;
        jQuery.ajax({
            'type':'GET',
            'url': url,
            'data':request_vars,
            'dataType':'json',
            'success': function(data) {
                if (data.success) {
                    jQuery.jGrowl('Found your location, creating map.', {'header': 'jMaps Mapping Demo', 'life': 5000});
                    positionSuccess(data);
                } else {
                    if (i === (services.length - 1)) {
                        jQuery.jGrowl('Cannot determine your location, falling back to the Googleplex.', {'header': 'jMaps Mapping Demo', 'life': 5000});
                        positionSuccess({'latitude': 37.4419, 'longitude': -122.1419});
                    }
                }
            },
            'error': function (error) {
                jQuery.jGrowl(error.message, {'header': 'jMaps Mapping Demo', 'life': 5000});
            }
        });
    });
};

function positionSuccess(position) {
    var sizeControl = new GSmallMapControl(); var typeControl = new GMapTypeControl();
    var overviewControl = new GOverviewMapControl(); var scaleControl = new GScaleControl();
        jQuery('#map').jmap('init', {
            'mapCenter': [position.latitude, position.longitude],
            'mapControl': 'none'
        }, function(map, element,options){
            jQuery('#change-map-type').change(function(){
                var mapType = jQuery('option:selected', this).val();
                jQuery(element).jmap('SetMapType', mapType);
            });        
            jQuery('#map-control-type').change(function(){
                map.removeControl(sizeControl);
                var control = jQuery('option:selected', this).val();
                if (control !== 'null') {
                    sizeControl = new window[control]();
                    map.addControl(sizeControl);
                }
            });
            //This is just for the first run, as we need to pass it to control it
            map.addControl(sizeControl);
            jQuery('#map-type-toggle').change(function(){
                var control = jQuery(this).is(':checked');
                if (control) {
                    map.addControl(typeControl);
                } else {
                    map.removeControl(typeControl);
                }
            });
            jQuery('#map-overview-toggle').change(function(){
                var control = jQuery(this).is(':checked');
                if (control) {
                    map.addControl(overviewControl);
                } else {
                    map.removeControl(overviewControl);
                }
            });
            jQuery('#map-scale-toggle').change(function(){
                var control = jQuery(this).is(':checked');
                if (control) {
                    map.addControl(scaleControl);
                } else {
                    map.removeControl(scaleControl);
                }
            });
            jQuery('#map-dragging-toggle').change(function(){
                var control = jQuery(this).is(':checked');
                if (control) {
                    map.enableDragging();
                } else {
                    map.disableDragging();
                }
            });
            jQuery('#map-search-toggle').change(function(){
                var control = jQuery(this).is(':checked');
                if (control) {
                    map.enableGoogleBar();
                } else {
                    map.disableGoogleBar();
                }
            });
            jQuery('.get-directions').click(function(){
                var from = jQuery('#from-location').val();
                var to= jQuery('#to-location').val();
            
                jQuery('#map').jmap('SearchDirections', {
                    'query': 'from: ' +  from + ' to: ' + to,
                    'panel':'#directions'
                }); 
            });
        });
    };

    function positionError(error) {
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
     jQuery.jGrowl(errorReturn , {'header': 'jMaps Mapping Demo', 'life': 5000});
     getIpBasedLocation();
    };


/* appjet:css */
#map-container {
    float:left;
}

#map {
    width: 400px;
    height: 400px;
}

#directions {
    width: 400px;
    height:400px;
    overflow-x:none;   
    overflow-y:scroll;
}

#control-panel {
    float:left;   
}

#message {
    width: 100%;
    height: 100px;
    display: none;
}

div.jGrowl {
        padding:                         10px;
        z-index:                         9999;
}

/** Special IE6 Style Positioning **/
div.ie6 {
        position:                         absolute;
}

div.ie6.top-right {
        right:                                 auto;
        bottom:                         auto;
        left:                                 expression( ( 0 - jGrowl.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
          top:                                 expression( ( 0 + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );
}

div.ie6.top-left {
        left:                                 expression( ( 0 + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
        top:                                 expression( ( 0 + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );
}

div.ie6.bottom-right {
        left:                                 expression( ( 0 - jGrowl.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
        top:                                 expression( ( 0 - jGrowl.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );
}

div.ie6.bottom-left {
        left:                                 expression( ( 0 + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
        top:                                 expression( ( 0 - jGrowl.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );
}

div.ie6.center {
        left:                                 expression( ( 0 + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
        top:                                 expression( ( 0 + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );
        width:                                 100%;
}

/** Normal Style Positions **/
body > div.jGrowl {
        position:                        fixed;
}

body > div.jGrowl.top-left {
        left:                                 0px;
        top:                                 0px;
}

body > div.jGrowl.top-right {
        right:                                 0px;
        top:                                 0px;
}

body > div.jGrowl.bottom-left {
        left:                                 0px;
        bottom:                                0px;
}

body > div.jGrowl.bottom-right {
        right:                                 0px;
        bottom:                         0px;
}

body > div.jGrowl.center {
        top:                                 0px;
        width:                                 50%;
        left:                                 25%;
}

/** Cross Browser Styling **/
div.center div.jGrowl-notification, div.center div.jGrowl-closer {
        margin-left:                 auto;
        margin-right:                 auto;
}

div.jGrowl div.jGrowl-notification, div.jGrowl div.jGrowl-closer {
        background-color:                 #000;
        color:                                         #fff;
        opacity:                                 .85;
        filter:                                 alpha(opacity = 85);
        zoom:                                         1;
        width:                                         235px;
        padding:                                 10px;
        margin-top:                         5px;
        margin-bottom:                         5px;
        font-family:                         Tahoma, Arial, Helvetica, sans-serif;
        font-size:                                 12px;
        text-align:                         left;
        display:                                 none;
        -moz-border-radius:         5px;
        -webkit-border-radius:        5px;
}

div.jGrowl div.jGrowl-notification {
        min-height:                         40px;
}

div.jGrowl div.jGrowl-notification div.header {
        font-weight:                         bold;
        font-size:                                10px;
}

div.jGrowl div.jGrowl-notification div.close {
        float:                                         right;
        font-weight:                         bold;
        font-size:                                 12px;
        cursor:                                        pointer;
}

div.jGrowl div.jGrowl-closer {
        height:                                 15px;
        padding-top:                         4px;
        padding-bottom:                 4px;
        cursor:                                 pointer;
        font-size:                                11px;
        font-weight:                         bold;
        text-align:                         center;
}
