var map;
var legendShowing = true;
var boxShowing = true;
var trueLegendShowing = true;
var viaStatic;
var riverwalk;
	
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
	
	//loads VIA routes
		//makes VIA routes popup
  //function popUp(feature, layer) {
   // layer.bindPopup(feature.properties.route_short_name);
 // }
		//loads geojson for via routes. This is static for now.
	var viaStatic = new L.GeoJSON.AJAX("data/viastatic1014.geojson");
	viaStatic.addTo(map);
	
	//loads geojson for the riverwalk. This data has formatting issues.
	var riverwalk = new L.GeoJSON.AJAX("data/SARIP_Trail.geojson");
	riverwalk.addTo(map);

	}
	
	//B-Cycle
	//Gets data from B-Cycle - but doesn't
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
	
	//Riverwalk
	//Processes data - Broken data as of 10/8/14
//$.getJSON("data/qgisRiverwalk.geojson", function(data) {
//	var geojsonLayer = new L.GeoJSON(data);
//	map.addLayer(geojsonLayer);
//});
	
	//Transit Dynamic attempt
	//Gets data from Availabs API - they pull gtfs file and parse it into a geojson
//$.ajax({
 // url:'http://api.availabs.org/gtfs/agency/78/routes?format=geo',
 // dataType:'jsonp'
 // success: function (response) {
  //      geojsonLayer = L.geoJson(response, {
  //      }).addTo(map);
  //  }
//});
	
	//Groups layers into three functions
	var walkLayers = L.layerGroup([riverwalk]);
	//var bikeLayers = L.layerGroup([one, two]);
	var busLayers = L.layerGroup([viaStatic]);
	
	//Controls layers
	//function walkFind(){
	//walkLayers.addTo(map);
	//}
	
	//function bikeFind();
	//function busFind(){
	// busLayers.addTo(map);
	//}
	
	
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
	