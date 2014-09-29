	var map;
	
	function initialize() {

	// Defines map object
	map = L.npmap.map({
		div: 'map_canvas',
		center: L.latLng(29.369245, -98.475088),
		zoom: 13,
		locateControl: true,
		homeControl: true,
		//legendControl: {
			//html: 'test',
			//position: 'bottomright'
			//}
		});
	
	//Resize map to accommodate navbar
	var marginHeight = $('#saannav').height()
	console.log(marginHeight);
	$('#map_canvas').css('margin-top', marginHeight);
	
	}
	