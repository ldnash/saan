function legend(){
	
	L.npmap.control.legend({
	  html: '' +
		'<h3>Legend</h3>' +
		'<ul id = "legendList" class = "list-group">' +
		  '<li><div class="legendRow"><div class="legendIcon"><img src="icons/riverRoute.gif" alt="River Walk"/></div>River Walk Trail (Hike + Bike)</a></div></li>' +
		  '<li>Item 2</li>' +
		'</ul>' +
	  ''
	}).addTo(map);


}