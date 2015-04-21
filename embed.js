function legend(){
	
	console.log('fire');
	
	L.npmap.control.legend({
		position: 'bottomleft',
	  html: '' +
		'<h3>Legend</h3>' +
		'<ul id = "legendList" class = "list-group">' +
		  '<li><div class="legendRow"><div class="legendIcon"><img src="icons/riverRoute.gif" alt="River Walk"/></div>River Walk Trail (Hike + Bike)</a></div></li>' +
		  '<li><div class="legendRow"><div class="legendIcon"><img src="icons/onRoadRoutes_bikePed.gif" alt="Suggested Walk + Bike Streets"/></div>Road Routes (Hike + Bike + Drive)</a></div></li>' +
		  '<li><div class="legendRow"><div class="legendIcon"><img src="icons/onRoadRoutes_bikeonly.gif" alt="Bike Only Streets for Experienced Cyclists"/></div>Road Routes (Bike + Drive)</a></div></li>' +
		  '<li><div class="legendRow"><div class="legendRow"><div class="legendIcon"><img src="icons/aceRoute.gif" alt="Acequia Trails (Unpaved)"/></div>Acequia Trails (Unpaved)</a></div></li>' +
		  '<li><div class="legendRow"><div class="legendIcon"><img src="icons/bcycle.gif" alt="Bcycle logo"/></div><a href="https://sanantonio.bcycle.com/" target="_blank">B-cycle</a></div></li>' +
		'</ul>' +
	  ''
	}).addTo(map);


}