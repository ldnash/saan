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
 url: 'data/cmpndsites.geojson'
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

// Do we still need this?
var riverwalk = L.npmap.layer.geojson({
styles: {
            line: {
              'stroke': '#00f',
			  'stroke-opacity': 0.8
            }
          },
  url: 'data/riverwalkQRP.geojson'
});

minorLayers.bcShare = L.npmap.layer.geojson({
  url: 'data/bikesharestatic.json'
});

minorLayers.graham = L.npmap.layer.geojson({
  url: 'data/graham.geojson'
});

minorLayers.aceLines = L.npmap.layer.geojson({
  url: 'data/acequiasline.geojson'
});

minorLayers.aceSites = L.npmap.layer.geojson({
  url: 'data/acequias.geojson'
});

minorLayers.missionTrails = L.npmap.layer.geojson({
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

//This is the main trail data we should be using
majorLayers.trailsNew = L.npmap.layer.geojson({
styles: {
            line: {
              'stroke': '#00f',
			  'stroke-opacity': 0.8
            }
          },
  url: 'data/trails.geojson'
}).addTo(map);

//Set listener that turns layers on and off when zooming.
map.on('zoomend', onZoomend);

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
				
				for (i in bcycleData){
					
				
				}
			  
			  },
          error: function() { console.log('Bcycle error'); },
         //beforeSend: setHeader
        });

      });


	  
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
	
	
function busFind(){
	console.log("busfind was pressed");
L.npmap.layer.geojson({
	url: 'http://api.availabs.org/gtfs/agency/78/routes?format=geo'
}).addTo(map);
L.npmap.layer.geojson({
	url: 'http://api.availabs.org/gtfs/agency/78/stops?format=geo'
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
	