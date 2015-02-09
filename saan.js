var map;
var legendShowing = true;
var boxShowing = true;
var trueLegendShowing = true;
var bcycleData;

var majorLayers = {};
var minorLayers = {};

	
	function initialize() {

	// Defines map object
	map = L.npmap.map({
		div: 'map_canvas',
		center: L.latLng(29.369245, -98.475088),
		zoom: 13,
		locateControl: true,
		homeControl: true,
		});
	
	//Resize map to accommodate navbar
	var marginHeight = $('#saannav').height()
	console.log(marginHeight + " pixels high = marginHeight");
	$('#map_canvas').css('margin-top', marginHeight);
	
	//Styles Riverwalk
	var riverwalkStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//	Default layers

// Missions layer. Uses function to define style based on geojson properties rather than static object.	
majorLayers.missions = L.npmap.layer.geojson({
 styles:
	function(feature){
		return {
			point: {
				iconUrl: feature.iconUrl, 
				iconSize: [50,50]
				}
		}},
 url: 'data/cmpndsites.geojson',
 popup:
	function(feature){
	var popupContent = '<b>' + feature.Full_Name + '</b><p>' + feature.Desc + '</p><p><a href=' + feature.Link + '>More information on nps.gov</a></p>'
	return popupContent;
	},
});

majorLayers.missions.addTo(map);

minorLayers.cmpnd = L.npmap.layer.geojson({
//this style is defined directly where we add the layer
styles: {
            point: {
              'marker-symbol': 'star'
            }
          },
  url: 'data/portalparks.geojson'
});

//connects San Jose to Riverwalk
minorLayers.graham = L.npmap.layer.geojson({
  styles: {
            line: {
              'stroke': '#00f',
			  'stroke-opacity': 0.8
            }
          },
  url: 'data/graham.geojson'
});

//the Acequias themselves (water feature, not trails)
minorLayers.aceLines = L.npmap.layer.geojson({
    styles: {
            line: {
              'stroke': '#C9DFE7',
			  'stroke-opacity': 0.8,
			  'weight': 1
            }
          },
  url: 'data/acequiasline.geojson'
});

//points related to the acequias
minorLayers.aceSites = L.npmap.layer.geojson({
  url: 'data/acequias.geojson'
});

//driving and biking routes
minorLayers.missionTrails = L.npmap.layer.geojson({
      styles: {
            line: {
              'stroke': '#B4da55',
			  'stroke-opacity': 0.8
            }
          },
  url: 'data/missiontrails.geojson'
});

minorLayers.restrooms = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'toilets'
            }
          },
	url: 'data/restrooms.geojson'
});

minorLayers.fountains = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'water'
            }
          },
	url: 'data/fountains.geojson'
});

minorLayers.parking = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'parking'
            }
          },
	url: 'data/parking.geojson'
});

minorLayers.riveraccess = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'ferry'
            }
          },
	url: 'data/riveraccess.geojson'
});

minorLayers.pavilions = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'building'
            }
          },
	url: 'data/pavilions.geojson'
});

//Off-street River Walk trails layer
majorLayers.trailsNew = L.npmap.layer.geojson({
styles: {
            line: {
              'stroke': '#FF1493',
			  'stroke-opacity': 0.8
            }
          },
  url: 'data/SARA_offstreet.geojson'
}).addTo(map);

//Set listener that turns layers on and off when zooming.
map.on('zoomend', onZoomend);

//B-Cycle
	$(document).ready(function() {
	$.ajax({
	  url: 'http://rivertripplanner.org/proxy2.php?url=' + encodeURIComponent('https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/48') +'&full_headers=1&full_status=1',
	  type: 'GET',
	//jsonp rather than json 
	  dataType: 'jsonp',
	headers:{
		'ApiKey': '49AB876F-017E-47BE-84BD-876AE6A6151D',		
		'Cache-Control': 'no-cache'
	},
	  success: function(data) { 
		  
			// Handle Bcycle data, store in global variable
			bcycleData = data.contents; console.log(bcycleData);
			var bcycleLayer = L.layerGroup();
			
			//iterate through received stations, adding to minorLayers object
			for (i in bcycleData){
				var station = bcycleData[i];
				
				// Set location
				var newStation = L.marker([station.Location.Latitude,station.Location.Longitude]);
				
				// Set name and ID
				newStation.title = station.Name;
				newStation.bcycleID = station.Id;
				
				// Set status
				newStation.status = station.Status;
				newStation.openBikes = station.BikesAvailable;
				newStation.openDocks = station.DocksAvailable;
				
				// This popup implementation uses Leaflet's popups rather than npmaps.js. This prevents us from using the native formatting, which may be an issue. Need to investigate.
				newStation.bindPopup(
					'<b>B-cycle: ' + newStation.title + '</b><p>Bikes available: ' + newStation.openBikes + '<br>Docks available: ' + newStation.openDocks + '</p><p>For more information on B-cycle, visit <a href="https://sanantonio.bcycle.com/">sanantonio.bcycle.com</a>.'
					);
				newStation.setIcon(L.icon({
					iconUrl: 'icons/bcycle.gif',
					iconSize: [20,20]
					}));
				
				bcycleLayer.addLayer(newStation);
			}
		  
		  minorLayers.bcycle = bcycleLayer;
		  //minorLayers.bcycle.addTo(map);
		  console.log(minorLayers.bcycle);
		  
		  },
	  error: function() { console.log('Bcycle error'); },
	 //beforeSend: setHeader
	});

  });

	}
	
	function onZoomend(){
		if(map.getZoom()>=15){
			for (i in minorLayers){
				minorLayers[i].addTo(map);
			}
			};
		 
		if(map.getZoom()<15){
			for (j in minorLayers){
				map.removeLayer(minorLayers[j]);
			}
			};
	};
	
	// Temporary add and remove manual functions
	function add1(layer){
	layer.addTo(map);
	}
	
	function remove1(layer){
	map.removeLayer(layer);
	}

	function setHeader(xhr) {
      xhr.setRequestHeader('ApiKey', '49AB876F-017E-47BE-84BD-876AE6A6151D');
		xhr.setRequestHeader('Cache-Control', 'no-cache');
		console.log(xhr);
      }	


	  
	//B-Cycle Processing. Need to figure out how to convert lat/lngs in their JSON to points in Leaflet. 
		
	//Groups layers into three layer groups. We can then work with these groups rather than listing all layers
	//var walkLayers = L.layerGroup([riverwalk]);
	//var bikeLayers = L.layerGroup([bcStatic]);
	//var busLayers = L.layerGroup([viaStatic, viastopsStatic]);
	
	//Controls modal layers depending on whether the user hits the foot, bike, or bus transit layer
	// Needs to be a checkbox?
	
function walkFind(){
	console.log("you pressed the walking button");
	}
	
function bikeFind(){
	console.log("you pressed the bike button");
	}
	
//Placeholder transit function. We will replace this with live data when Via Transit launches their API in 2015.
function busFind(){
	console.log("busfind was pressed");
L.npmap.layer.geojson({
	url: 'data/viamission.geojson'
	//popup:
	//	function(feature){
	//	var popupContent = '<b>' + feature.route_short_name + '</b><p><a href=http://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>More information from Via Transit</a></p>'
	//	return popupContent;
	//},
}).addTo(map);
	}
	
	
	function setBox(newHTML){
		// Hide legend
		if (legendShowing == true){
			hideDiv("checkboxes-panel");
			showDiv("content-panel");
			legendShowing = false;
		}
	
		// Set box content
		var boxInner = document.getElementById("content-panel");
		boxInner.innerHTML = newHTML;
		
		// Show box, if hidden
		if (boxShowing == false){
			showDiv("boxContent");
			
			// Hide legend button
			hideDiv("legendButton");		
			
			boxShowing = true;
			
		}
		
		else {
		hideDiv("boxContent");
		showDiv("boxContent");
		}
		
	}
	
	function closeBox(){
		if (boxShowing == true){
			// Hide content
			hideDiv("boxContent");
			
			// Show legend button
			showDiv("legendButton");

			boxShowing = false;
			}
	}
	
	function closeTrueLegendBox(){
			if (trueLegendShowing == true){
			// Hide legend content
			hideDiv("trueLegendContent");
			
			// Show legend button
			showDiv("trueLegendButton");

			trueLegendShowing = false;
			}
	}
	
	function showLegend(){
	
		// Turn on legend
		if (legendShowing == false){
			showDiv("checkboxes-panel");
			
			hideDiv("content-panel");
			
			legendShowing = true;
			}
		
		// Turn on overall box, if not already on
		if (boxShowing == false){
			showDiv("boxContent");
			boxShowing = true;
			
			hideDiv("legendButton");
		}
		
	}
	
	function showTrueLegend(){
			// Turn on true legend
		if (trueLegendShowing == false){
			showDiv("trueLegendContent");
			
			hideDiv("trueLegendButton");
			
			trueLegendShowing = true;
			}
		

		
	}
	
function hideDiv(divName){
	var box = document.getElementById(divName);
	box.className += " hidden";
}

function showDiv(divName){
	var box = document.getElementById(divName);			
	var className = box.className;
	var lastIndex = className.lastIndexOf(" ");
	var newClass = className.substring(0, lastIndex);
	box.className = newClass;
}

function buttonOn(divName){
	
	// Change checkbox property
	//var arr = divName.split('-');
	//var checkboxName = arr[0];
	//$(checkboxName).prop('checked',true);
	
	// Turn on button
	$(divName).addClass('active');
}

function buttonToggle(divName){

	if ($(divName).hasClass( "active" )){
		buttonOff(divName);
	}
	
	else{
		buttonOn(divName);
	}

}

function buttonOff(divName){

	// Change checkbox property
	//var arr = divName.split('-');
	//var checkboxName = arr[0];
	
	//$(checkboxName).prop('checked',false);

	// Turn off button
	$(divName).removeClass('active');
}
	