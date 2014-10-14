var map;
var legendShowing = true;
var boxShowing = true;
var trueLegendShowing = true;
var viaStatic;
var riverwalk;
var viastopsStatic;
var bcStatic;
	
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

	
	
	
	
	
L.npmap.layer.geojson({
  url: 'data/portalparks.geojson'
}).addTo(map);

L.npmap.layer.geojson({
//this style is defined directly where we add the layer
styles: {
            point: {
              'marker-symbol': 'star'
            }
          },
  url: 'data/cmpndsites.geojson'
}).addTo(map);

L.npmap.layer.geojson({
  url: 'data/riverwalkQRP.geojson'
}).addTo(map);

L.npmap.layer.geojson({
  url: 'data/bikesharestatic.json'
}).addTo(map);
	
	}
	
	

	
	//B-Cycle
	//Gets data from B-Cycle - but doesn't. Need to figure out how to send our ApiKey
	//    $(document).ready(function() {
    //    $.ajax({
    //      url: 'https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/48',
    //      type: 'GET',
			//jsonp rather than json 
    //      dataType: 'jsonp',
    //      success: function() { alert('success!'); },
    //      error: function() { alert('fail, check console.'); },
    //      beforeSend: setHeader
    //    });
	//      function setHeader(xhr) {
    //    xhr.setRequestHeader('ApiKey', '49AB876F-017E-47BE-84BD-876AE6A6151D');
	//	xhr.setRequestHeader('Cache-Control', 'no-cache');
    //  }	
		
    //  });
	
	//B-Cycle Processing. Need to figure out how to convert lat/lngs in their JSON to points in Leaflet. 
		
	//Groups layers into three layer groups. We can then work with these groups rather than listing all layers
	//var walkLayers = L.layerGroup([riverwalk]);
	//var bikeLayers = L.layerGroup([bcStatic]);
	//var busLayers = L.layerGroup([viaStatic, viastopsStatic]);
	
	//Controls modal layers depending on whether the user hits the foot, bike, or bus transit layer
	// Needs to be a checkbox
	
function walkFind(){
		L.npmap.layer.geojson({
  url: 'data/graham.geojson'
}).addTo(map);

L.npmap.layer.geojson({
  url: 'data/acequiasline.geojson'
}).addTo(map);

L.npmap.layer.geojson({
  url: 'data/acequias.geojson'
}).addTo(map);

L.npmap.layer.geojson({
  url: 'data/missiontrails.geojson'
}).addTo(map);
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
	url: 'api.availabs.org/gtfs/agency/78/stops?format=geo'
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
	