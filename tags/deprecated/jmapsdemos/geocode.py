#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch
from xml.dom import minidom
from django.utils import simplejson

debug = False

service_urls = {
  'infosniper':'http://www.infosniper.net/xml.php?ip_address=%s',
  'hostip':'http://api.hostip.info/?ip=%s' 
}

class FetchXML(webapp.RequestHandler):
  def parse_infosniper(self, content):
    dom = minidom.parseString(content)
    try:
      if not ('Quota exceeded' in dom.firstChild.getElementsByTagName( 'hostname' )[0].firstChild.data or debug):
        results = {
          'success': True,
          'ipaddress': dom.firstChild.getElementsByTagName( 'ipaddress' )[0].firstChild.data,
          'hostname': dom.firstChild.getElementsByTagName( 'hostname' )[0].firstChild.data,
          'provider': dom.firstChild.getElementsByTagName( 'provider' )[0].firstChild.data,
          'country': dom.firstChild.getElementsByTagName( 'country' )[0].firstChild.data,
          'countrycode': dom.firstChild.getElementsByTagName( 'countrycode' )[0].firstChild.data,
          'countryflag': dom.firstChild.getElementsByTagName( 'countryflag' )[0].firstChild.data,
          'state': dom.firstChild.getElementsByTagName( 'state' )[0].firstChild.data,
          'city': dom.firstChild.getElementsByTagName( 'city' )[0].firstChild.data,
          'areacode': dom.firstChild.getElementsByTagName( 'areacode' )[0].firstChild.data,
          'postalcode': dom.firstChild.getElementsByTagName( 'postalcode' )[0].firstChild.data,
          'dmacode': dom.firstChild.getElementsByTagName( 'dmacode' )[0].firstChild.data,
          'latitude': dom.firstChild.getElementsByTagName( 'latitude' )[0].firstChild.data,
          'longitude': dom.firstChild.getElementsByTagName( 'longitude' )[0].firstChild.data,
          'queries': dom.firstChild.getElementsByTagName( 'queries' )[0].firstChild.data,
        }
      else:
        results = False
    except:
        results = False
    return results
    
  def parse_hostip(self, content):
    dom = minidom.parseString(content)
    try:
      data = minidom.parseString(dom.firstChild.toxml())
      data = minidom.parseString(data.firstChild.toxml())
      coords = data.firstChild.getElementsByTagName( 'gml:coordinates' )[0].firstChild.data
      coords = coords.split(',')
      results = {
        'success': True,
        'city': data.firstChild.getElementsByTagName( 'gml:name' )[0].firstChild.data,
        'country': data.firstChild.getElementsByTagName( 'countryName' )[0].firstChild.data,
        'countrycode': data.firstChild.getElementsByTagName( 'countryAbbrev' )[0].firstChild.data,
        'latitude': coords[0],
        'longitude': coords[1],
      }
    except:
      results = False
    return results
    
  def get(self):
    service = self.request.GET['service'];
    user_ip = self.request.remote_addr
    url = service_urls[service] % (user_ip)
    result = urlfetch.fetch(url)
    
    if result.status_code == 200 and debug == False:
      if (service == 'infosniper'):
        results = self.parse_infosniper(result.content)
      else:
        results = self.parse_hostip(result.content)
    else:
      results = False
    path = os.path.join(os.path.dirname(__file__), 'templates/json/index.js')
    output = simplejson.dumps(results)
    template_values = {
        'results': output
    }
    self.response.out.write(template.render(path, template_values))
    
def main():
  application = webapp.WSGIApplication([('/geocode', FetchXML)],debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
