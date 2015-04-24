var map;
var legendShowing = true;
var boxShowing = true;
var trueLegendShowing = true;
var bcycleData;
var marginHeight;

var majorLayers = {};
var minorLayers = {};
var topLayers = {};

	
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
	marginHeight = $('#saannav').height()
	console.log(marginHeight + " pixels high = marginHeight");
	$('#map_canvas').css('padding-top', marginHeight);
	
	//Styles Riverwalk
	var riverwalkStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

	// For embedded version, load legend
	try{
		legend();
	}
	catch(e) {}

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
	var popupContent = '<b>' + feature.Full_Name + '</b><p>' + feature.Desc + '</p><p><a href=' + feature.Link + '>More information on nps.gov</a></p>' + '<p><a href=' + feature.Directions + '>Directions</a></p>'
	return popupContent;
	},
tooltip: 'Mission {{Name}}',
});

majorLayers.missions.addTo(map);

//the Acequias trails (not water features)
majorLayers.aceLines = L.npmap.layer.geojson({
    styles: {
            line: {
              'stroke': '#00315e',
			  'stroke-opacity': 0.8,
            }
          },
  url: 'data/acequias_trails.geojson',
  tooltip: 'Acequia Trails',
 	popup:{
		title:'Acequia Trails',
		description: 'These trails provide visitors up-close views of the acequias that originally irrigated the fields around the missions.'		
	}
}).addTo(map);

//Ped only river walk and mission trails
minorLayers.ped = L.npmap.layer.geojson({
    styles: {
            line: {
              'stroke': '#ff0044',
			  'stroke-opacity': 0.8,
			  'stroke-width': 1.3
            }
          },
  url: 'data/pedTrails.geojson',
    tooltip: 'Pedestrians-only trail',
 	popup:{
		title:'Pedestrians-only trail',
		description: 'Only pedestrians are allowed on downtown sections of the River Walk and certain other trails.'		
	}
});

// On Street trails -- Bike and Ped
minorLayers.onStreetBikePed = L.npmap.layer.geojson({
    styles: {
            line: {
              'stroke': '#ff9900',
			  'stroke-opacity': 0.8,
            }
          },
  url: 'data/BikePed_onRoad.geojson',
  tooltip: 'Road Routes',
 	popup:{
		title:'Road Routes',
		description: 'For cyclists and pedestrians.'		
	}
  
});

// On Street trails -- Bike Only
minorLayers.onStreetBikeOnly = L.npmap.layer.geojson({
              color: '#ff9900',
			  opacity: 0.8,
			  dashArray : '5, 10',
  url: 'data/BikeOnly_onRoad.geojson',
  tooltip: 'Bike-only Road Routes',
 	popup:{
		title:'Bike-only Road Routes',	
	}
});

// Riverwalk and Mission parking
minorLayers.parking = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'parking'
            }
          },
	url: 'data/parking.geojson',
	  tooltip: 'Parking Area',
	popup:{
		title:'{{Parking}}',		
	}
});

//Secondary River Walk trails layer. Uses Leaflet line styling rather than NPMap Simplestyle.
minorLayers.secondary = L.npmap.layer.geojson({
              color: '#ff0044',
			  opacity: 0.8,
//			  dashArray : '5, 10',
	url: 'data/secondaryTrails.geojson',
  tooltip: 'River Walk',
  	popup:{
//		actions: '<a href=http://www.sanantonioriver.org/mission_reach/mission_reach.php>Learn more.</a>',
		title:'River Walk Connections',
		description: 'The River Walk and connecting trails.'		
	}
});

// Minor features such as water fountains, restrooms, etc. These cluster on high zoom levels using NPMap clustering feature. This one is the not-clustered version that turns on at more zoomed in levels.
minorLayers.minor = L.npmap.layer.geojson({
	//cluster: true,
	url: 'data/CombinedFacilities.geojson',
	tooltip: '{{Facility}}',
	popup:{
		title:'{{Facility}}',
		description: '{{Name}}'
		
	}
});

// Visitor Center and Visitor Contact Stations
minorLayers.visitorCenters = L.npmap.layer.geojson({
	stlyes:{
		point:{
			'marker-color': '#d39700'
		}
	},	
	url: 'data/visitorCenters.geojson',
	tooltip: '{{Facility}}',
	popup:{
		title:'{{Facility}}',		
	}
});

//Primary River Walk trails layer
majorLayers.trailsNew = L.npmap.layer.geojson({
styles: {
            line: {
              'stroke': '#ff0044',
			  'stroke-opacity': 0.8
            }
          },
  url: 'data/mainTrails.geojson',
  tooltip: 'River Walk',
	popup:{
//		actions: '<a href=http://www.sanantonioriver.org/mission_reach/mission_reach.php>Learn more.</a>',
		title:'River Walk',
		description: 'The River Walk and connecting trails.'		
	}
}).addTo(map);

//On-street Mission Trails driving and biking routes (dry routes only)
majorLayers.missionTrails = L.npmap.layer.geojson({
              color: '#78591f',
			  opacity: 0.8,
			  dashArray : '5, 10',
  url: 'data/missiontrails_dry.geojson',
  tooltip: 'Mission Trail'
});

//Acequias sites
majorLayers.aceSites = L.npmap.layer.geojson({
  url: 'data/acequias.geojson',
  styles:{
	  point:{
		'marker-symbol': 'dam',
		'marker-color': '#00315e'
	  }
  },
	tooltip: '{{Name}}',
	popup:{
		title:'{{Name}}',
		description: '{{Info}}'	
	}
}).addTo(map);


// Minor features such as water fountains, restrooms, etc. Clustered for zoomed out view.
topLayers.minor = L.npmap.layer.geojson({
	cluster: true,
	url: 'data/CombinedFacilities.geojson',
	tooltip: '{{Facility}}',
	popup:{
		title:'{{Facility}}',
		description: '{{Name}}'
		
	}
}).addTo(map);

//Set listener that turns layers on and off when zooming.
map.on('zoomend', onZoomend);

//B-Cycle call using an AJAX proxy
	$(document).ready(function() {
	$.ajax({
	  url: 'http://enigmatic-castle-8864.herokuapp.com/?type=json&url=' + encodeURIComponent('https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/48'),
	  type: 'GET',
	headers:{
		'Cache-Control': 'no-cache',
		'ApiKey': '49AB876F-017E-47BE-84BD-876AE6A6151D'
	},
	  success: function(data) { 
		  
			console.log(data);
		  
			// Handle Bcycle data, store in global variable
			bcycleData = data.data;
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
		  
		  },
	  error: function() { console.log('Bcycle error'); },
	 beforeSend: function (xhr) {
		xhr.setRequestHeader('ApiKey', '49AB876F-017E-47BE-84BD-876AE6A6151D');
		}
	});

  });

  // Close legend boxes on load by default
  //closeTrueLegendBox();
  //closeBox();
  
  // If on mobile, closes true legend box. 
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	  closeTrueLegendBox();
	}
	}
	
	function onZoomend(){
		if(map.getZoom()>=15){
			for (i in minorLayers){
				minorLayers[i].addTo(map);
			}
			for (k in topLayers){
				map.removeLayer(topLayers[k]);
			}			
			};
		 
		if(map.getZoom()<15){
			for (j in minorLayers){
				map.removeLayer(minorLayers[j]);
			}
			for (l in topLayers){
				topLayers[l].addTo(map);
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
				
// This block of code adds a way to show transit data before VIA's real time data is available

//creates a toggle variable
window.toggle = true;

//creates and styles bus routes
transitRoutes = L.npmap.layer.geojson({
	url: 'data/viamissions.geojson',
	styles:
	{
           line: {
              'stroke': '#45000d',
			  'stroke-opacity': 0.8
            }
	},
	popup:
		function(feature){
		var popupContent = '<b>' + 'VIA Bus Route 42 </b><p><a href=http://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>Check VIA Transit for service times and schedules</a></p>'
		return popupContent;
	},
})

//creates and styles bus stops
transitStops = L.npmap.layer.geojson({
styles: {
            point: {
              'marker-symbol': 'bus'
            }
          },
	url: 'data/cutviastops.geojson',
	tooltip: 'Bus Stop',
	popup:{
		title:'{{stop_name}}',	
		description: '<a href=http://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>Check VIA Transit for service times and schedules</a>'			
	}
})

//toggle function
function busFind() {
  if(!toggle) {
    map.removeLayer(transitStops);
	map.removeLayer(transitRoutes);
  } else {
    map.addLayer(transitStops);
	map.addLayer(transitRoutes);
  }
  toggle = !toggle;
}

//end transit block

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
	