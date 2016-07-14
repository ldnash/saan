// Parameters

//   The VIA transit routes that should be displayed on the map into this parameter. 
var transitRouteNumbers = [242,40]

//   The location of the ArcGIS feature server where the NPS and partner data are accessible.
var arcgisURL = "https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/SAAN1/FeatureServer/"

var arcgisQuery = "/query?f=geojson&outSR=4326&where=" + encodeURIComponent("\"ISEXTANT\"='Yes'")
//   The query that should be used when calling objects from the arcGIS server. By default, just pulls all objects that exist and requests geoJSON format.

/* globals $, L */

var majorLayers = {};
var minorLayers = {};
var topLayers = {};
var bcycleData;
var map;
var transitRoutes=[];
var transitStops=[];
var transitRouteOnestops=[];
var NPMap;
var script;

NPMap = {
  center: {
    lat: 29.369245,
    lng: -98.475088
  },
  div: 'map',
  events: [{
    fn: function () {
      var zoom = map.getZoom();

      if (zoom >= 15) {
        for (var i in minorLayers) {
          minorLayers[i].addTo(map);
        }

        for (var k in topLayers) {
          map.removeLayer(topLayers[k]);
        }
      } else {
        for (var j in minorLayers) {
          map.removeLayer(minorLayers[j]);
        }

        for (var l in topLayers) {
          topLayers[l].addTo(map);
        }
      }
    },
    type: 'zoomend'
  }],
  hooks: {
    init: function (callback) {
      $(document).ready(function () {
        var apiKey = '49AB876F-017E-47BE-84BD-876AE6A6151D';
        var $legend;
        var $legendButton;

        map = NPMap.config.L;
        // TODO: This is only needed if loaded in the template.
        $('#map').css('padding-top', $('.navbar').height());
        $('body').append('' +
          '<div class="container" id="legendCont">' +
            '<div class="row">' +
              '<div id="trueLegend" class="col-xs-12 col-sm-5 col-md-4 col-lg-4 boxDiv">' +
                '<button id="trueLegendButton" type="button" class="boxes btn btn-primary">Legend</button>' +
                '<div id="trueLegendContent" class="boxes">' +
                  '<button type="button" class="close" id="buttonCloseLegend" aria-hidden="true">&times;</button>' +
                  '<div class="panel panel-default boxes-panel" id="trueLegend-panel">' +
                    '<h4>Legend</h4>' +
                    '<ul id="legendList" class="list-group">' +
                      '<li class="list-group-item">' +
                        '<div class="legendRow">' +
                          '<div class="legendIcon">' +
                            '<img src="https://nationalparkservice.github.io/saan-trip-planner/icons/riverRoute.gif" alt="River Walk">' +
                          '</div>River Walk Trail (Walk + Bike)' +
                        '</div>' +
                      '</li>' +
                      '<li class="list-group-item">' +
                        '<div class="legendRow">' +
                          '<div class="legendIcon">' +
                            '<img src="https://nationalparkservice.github.io/saan-trip-planner/icons/riverRoute_ped.gif" alt="River Walk (Walk only)">' +
                          '</div>River Walk Trail (Walk Only)' +
                        '</div>' +
                      '</li>' +
                      '<li class="list-group-item">' +
                        '<div class="legendRow">' +
                          '<div class="legendIcon">' +
                            '<img src="https://nationalparkservice.github.io/saan-trip-planner/icons/onRoadRoutes_bikePed.gif" alt="Suggested Walk + Bike Streets">' +
                          '</div>Road Route (Walk + Bike + Drive)' +
                        '</div>' +
                      '</li>' +
                      '<li class="list-group-item">' +
                        '<div class="legendRow">' +
                          '<div class="legendIcon">' +
                            '<img src="https://nationalparkservice.github.io/saan-trip-planner/icons/onRoadRoutes_bikeonly.gif" alt="Bike Only Streets for Experienced Cyclists">' +
                          '</div>Road Route (Bike + Drive)' +
                        '</div>' +
                      '</li>' +
                      '<li class="list-group-item">' +
                        '<div class="legendRow">' +
                          '<div class="legendIcon">' +
                            '<img src="https://nationalparkservice.github.io/saan-trip-planner/icons/aceRoute.gif" alt="Acequia Trails (Unpaved)">' +
                          '</div>Acequia Trail (Unpaved)' +
                        '</div>' +
                      '</li>' +
                      '<li class="list-group-item">' +
                        '<div class="legendRow">' +
                          '<div class="legendIcon">' +
                            '<img src="https://nationalparkservice.github.io/saan-trip-planner/icons/bcycle.gif" alt="Bcycle logo">' +
                          '</div>' +
                          '<a href="https://sanantonio.bcycle.com/" target="_blank">B-cycle</a>' +
                        '</div>' +
                      '</li>' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="row" style="margin-top:5px;">' +
              '<div id="checkboxes" class="boxDiv col-lg-4 col-md-4 col-sm-5 col-xs-12">' +
                '<button class="boxes btn btn-primary" id="buttonTransit" type="button">Show Transit</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '');
        $legend = $('#trueLegendContent');
        $legendButton = $('#trueLegendButton');
        L.DomEvent.disableClickPropagation(document.getElementById('legendCont'));
        majorLayers.aceLines = L.npmap.layer.geojson({
          popup: {
            description: 'These trails provide visitors up-close views of the acequias that originally irrigated the fields around the missions.',
            title: '{{TRLNAME}}'
          },
          styles: {
            line: {
              'stroke': '#00315e',
              'stroke-opacity': 0.8
            }
          },
          tooltip: '{{TRLNAME}}',
          url: arcgisURL + 18 + arcgisQuery
        }).addTo(map);
        majorLayers.aceSites = L.npmap.layer.geojson({
          popup: {
            description: '{{NOTES}}',
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-color': '#00315e',
              'marker-symbol': 'dam'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 8 + arcgisQuery + '&outFields=POINAME,NOTES'
        }).addTo(map);
        majorLayers.missions = L.npmap.layer.geojson({
          popup: function (feature) {
            return '<b>' + feature.Full_Name + '</b><p>' + feature.Desc + '</p><p><a href=' + feature.Link + '>More information</a></p>' + '<p><a href=' + feature.Directions + '>Directions</a></p>';
          },
          styles: function (feature) {
            return {
              point: {
                iconSize: [50, 50],
                iconUrl: feature.iconUrl
              }
            };
          },
          tooltip: 'Mission {{Name}}',
          url: 'https://nationalparkservice.github.io/saan-trip-planner/data/cmpndsites.geojson'
        }).addTo(map);
         /*majorLayers.missionTrails = L.npmap.layer.geojson({
          popup: {
            description: 'The River Walk and connecting trails.',
            title: 'River Walk'
          },
          styles:  function() {
		  
			  return {
				line: {
				  'stroke': '#ff0044',
				  'stroke-opacity': 0.8
			  }}
          },
          tooltip: 'River Walk',
          url: 'https://nationalparkservice.github.io/saan-trip-planner/data/mainTrails.geojson'
        }).addTo(map);    */   
		majorLayers.onStreetBikeOnly = L.npmap.layer.geojson({
          color: '#ff9900',
          dashArray: '5, 10',
          opacity: 0.8,
          popup: {
            title: 'Bike and car-only Road Routes'
          },
          tooltip: 'Bike and car-only Road Routes',
          url: arcgisURL + 21 + arcgisQuery + encodeURIComponent("and\"Route_Type\"='Bike Only'")
        }).addTo(map);
        majorLayers.onStreetBikePed = L.npmap.layer.geojson({
          popup: {
            description: 'For cyclists and pedestrians.',
            title: 'Road Routes'
          },
          styles: {
            line: {
              'stroke': '#ff9900',
              'stroke-opacity': 0.8
            }
          },
          tooltip: 'Road Routes',
          url: arcgisURL + 21 + arcgisQuery + encodeURIComponent("and\"Route_Type\"='Bike and Ped'")+ encodeURIComponent("and\"TRLNAME\"='Mission Trail Route'")
        }).addTo(map);
        majorLayers.riverWalkMain = L.npmap.layer.geojson({
          popup: {
            description: 'The River Walk and connecting trails.',
            title: '{{TRLLABEL}}'
          },
          styles: {
            line: {
              'stroke': '#ff0044',
              'stroke-opacity': 0.8
            }
          },
          tooltip: '{{TRLLABEL}}',
          url: arcgisURL + 21 + arcgisQuery + encodeURIComponent("and\"Route_Type\"='Bike and Ped'")+ encodeURIComponent("and\"level_\"='Main = River Walk'") + '&outFields=TRLLABEL'
        }).addTo(map);
		majorLayers.cityParks = L.npmap.layer.geojson({
           popup: {
            description: '{{ParkType}}',
            title: '{{ParkName}}'
          },         
		  styles: {
            polygon: {
              'fill': '#9bb474',
              'fill-opacity': 0.1,
              'stroke-width': 0
            }
          },
          tooltip: '{{ParkName}}',
          url: 'https://nationalparkservice.github.io/saan-trip-planner/data/cityParks.geojson'
        }).addTo(map);
        minorLayers.pavilion = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-symbol': 'building'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 16 + arcgisQuery
        });	
		minorLayers.riverAccess = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-symbol': 'ferry'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 14 + arcgisQuery
        });	
		minorLayers.water = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-symbol': 'water'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 13 + arcgisQuery
        });	
		minorLayers.picnic = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-symbol': 'park'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 9 + arcgisQuery
        });	
		minorLayers.restroom = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-symbol': 'toilets'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 7 + arcgisQuery
        });	
        minorLayers.parking = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-symbol': 'parking'
            }
          },
          tooltip: 'Parking Area',
          url: arcgisURL + 10 + arcgisQuery
        });
        minorLayers.ped = L.npmap.layer.geojson({
          popup: {
            description: 'Only pedestrians are allowed on downtown sections of the River Walk and certain other trails.',
            title: 'Pedestrians-only trail'
          },
          styles: {
            line: {
              'stroke': '#ff0044',
              'stroke-opacity': 0.8,
              'stroke-width': 1.3
            }
          },
          tooltip: 'Pedestrians-only trail',
          url: arcgisURL + 21 + arcgisQuery + encodeURIComponent("and\"Route_Type\"='Ped Only'") + '&outFields=TRLLABEL'
        });
        minorLayers.secondary = L.npmap.layer.geojson({
          color: '#ff0044',
          opacity: 0.8,
          popup: {
            description: 'The River Walk and connecting trails.',
            title: 'River Walk Connections'
          },
          tooltip: '{{TRLLABEL}}',
          url: arcgisURL + 21 + arcgisQuery + encodeURIComponent("and\"Route_Type\"='Bike and Ped'")+ encodeURIComponent("and\"level_\"='Secondary - Riverwalk or Mission Tr. offshoots'") + '&outFields=TRLLABEL'
        });
        minorLayers.visitorCenters = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-color': '#d39700',
			  'marker-symbol': 'star'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 17 + arcgisQuery
        });
        minorLayers.information = L.npmap.layer.geojson({
          popup: {
            title: '{{POINAME}}'
          },
          styles: {
            point: {
              'marker-color': '#d39700',
			  'marker-symbol': 'circle'
            }
          },
          tooltip: '{{POINAME}}',
          url: arcgisURL + 3 + arcgisQuery
        });
        topLayers.minor = L.npmap.layer.geojson({
          cluster: true,
          popup: {
            description: '{{Name}}',
            title: '{{Facility}}'
          },
          styles: {
            point: {
			  'marker-symbol': 'circle'
            }
		  },
          tooltip: '{{Facility}}',
          url: 'https://nationalparkservice.github.io/saan-trip-planner/data/CombinedFacilities.geojson'
        }).addTo(map);
        
		// Query TransitLand API to get routes for each route listed in transitRouteNumbers parameter variable above.
		
		for (i in transitRouteNumbers) {
			$.ajax({
			  success: function (data) {
				var newRoute = L.npmap.layer.geojson({
				  popup: {
					description:'' +
						  '<a href=https://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>Check VIA Transit for service times and schedules</a>' +
						'</p>' +
						'',
					title: 'Bus Route ' + '{{name}}'
				  },
				  styles: {
					line: {
					  'stroke': '#45000d',
					  'stroke-opacity': 0.8
					}
				  },
				  data: data
				});
				
				// Push route geoJSON layer onto array that holds all transit geoJSON layers
				transitRoutes.push(newRoute);
				
				// Store the route's OneStop ID for stops call
				var onestop = data.features[0].properties.onestop_id;
				
				// Initiate call for stops geoJSON layer
				$.ajax({
				  success: function (data) {
					var newStops = L.npmap.layer.geojson({
					  popup: {
						description:'' +
							  'Schedules vary significantly.<p><a href=https://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>Check VIA Transit for service times and schedules</a>' +
							'</p>' +
							'',
						title: 'Bus Stop: ' + '{{name}}'
					  },
					  styles: {
						point: {
						  'marker-symbol': 'bus'
						}
					  },
					tooltip: 'Bus Stop',
					  data: data
					});
					
					// Push route geoJSON layer onto array that holds all transit geoJSON layers
					transitStops.push(newStops);
					
				  },
				  type: 'GET',
				  url: 'https://transit.land/api/v1/stops.geojson?served_by='+onestop
				});	
				
			  },
			  type: 'GET',
			  // Use the route's onestop ID to retrieve all stops associated with this route
			  url: 'https://transit.land/api/v1/routes.geojson?operated_by=o-9v1z-viametropolitantransit&identifier='+String(transitRouteNumbers[i])
			});
        }

        $.ajax({
          beforeSend: function (xhr) {
            xhr.setRequestHeader('ApiKey', apiKey);
          },
          headers: {
            'ApiKey': apiKey,
            'Cache-Control': 'no-cache'
          },
          success: function (data) {
            var bcycleLayer = L.layerGroup();

            bcycleData = data.data;

            for (var i in bcycleData) {
              var station = bcycleData[i];
              var newStation = L.marker([station.Location.Latitude, station.Location.Longitude]);

              newStation.bcycleID = station.Id;
              newStation.title = station.Name;
              newStation.openBikes = station.BikesAvailable;
              newStation.openDocks = station.DocksAvailable;
              newStation.status = station.Status;
              newStation.bindPopup('' +
                '<b>B-cycle: ' + newStation.title + '</b>' +
                '<p>Bikes available: ' + newStation.openBikes + '<br>Docks available: ' + newStation.openDocks + '</p>' +
                '<p>For more information on B-cycle, visit <a href="https://sanantonio.bcycle.com/">sanantonio.bcycle.com</a></p>' +
              '');
              newStation.setIcon(L.icon({
                iconSize: [20, 20],
                iconUrl: 'https://nationalparkservice.github.io/saan-trip-planner/icons/bcycle.gif'
              }));
              bcycleLayer.addLayer(newStation);
            }

            minorLayers.bcycle = bcycleLayer;
          },
          type: 'GET',
          url: 'https://enigmatic-castle-8864.herokuapp.com/?type=json&url=' + encodeURIComponent('https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/48')
        });
        $('#buttonCloseLegend').click(function () {
          $legend.hide();
          $legendButton.show();
        });
        $legendButton.click(function () {
          $legendButton.hide();
          $legend.show();
        });
        $('#buttonTransit').click(function () {
          var $this = $(this);

          if ($this.text().indexOf('Hide') > -1) {
			for (j in transitRouteNumbers) {
				map
					.removeLayer(transitStops[j])
					.removeLayer(transitRoutes[j]);
			}
            $this
              .removeClass('active')
              .text('Show Transit');
          } else {
			for (j in transitRouteNumbers) {
				map
					.addLayer(transitStops[j])
					.addLayer(transitRoutes[j]);
			}
            $this
              .addClass('active')
              .text('Hide Transit');
          }
        });

        if ($(window).width() < 768) {
          $('#buttonCloseLegend').trigger('click');
        }

        callback();
      });
    },
    preinit: function (callback) {
      var _ = L.npmap.util._;

      _.appendCssFile([
        'https://nationalparkservice.github.io/saan-trip-planner/assets/css/main.min.css'
      ], function () {
        _.appendJsFile('https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js', function () {
          _.appendJsFile('https://www.nps.gov/lib/bootstrap/3.3.2/js/nps-bootstrap.min.js', callback);
        });
      });
    }
  },
  locateControl: true,
  zoom: 13
};
script = document.createElement('script');
script.src = 'https://www.nps.gov/lib/npmap.js/3.0.18/npmap-bootstrap.min.js';
document.body.appendChild(script);
