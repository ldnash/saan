var map;
var legendShowing = true;
var boxShowing = true;
var trueLegendShowing = true;

	
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
	
	}
	
	//B-Cycle
	//Gets data from B-Cycle
	//$.ajax({
   //      url: "https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/SanAntonio",
   //     data: { signature: authHeader },
	//	 dataType: 'json',
   //      type: "GET",
	//	 headers: {"ApiKey": 49AB876F-017E-47BE-84BD-876AE6A6151D},
   //      success: function() { alert('Success!' + authHeader); }
    //  });

	//Processes data
	//Preps data for mapping - map lat/long
	
	//Riverwalk
	//Processes data
//$.getJSON("data/saripjson.geojson", function(data) {
//	var geojsonLayer = new L.GeoJSON(data);
//	map.addLayer(geojsonLayer);
//});
	//Preps data for mapping
	
	//Other trails
	//Processes data
	//Preps data for mapping
	
	//Transit
	//Gets data from VIA
	//Processes data
		//unzip
		//gtfs to geojson
	//Preps data for mapping
	
	//Groups layers into three functions
	//var walkLayers = L.layerGroup([one, two]};
	//var bikeLayers = L.layerGroup([one, two]};
	//var busLayers = L.layerGroup([one, two]};
	
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
	