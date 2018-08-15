$(document).ready(function () {


	//Initialize Map
	var map = L.map('map').setView([0, 0], 2);



	//add scale bar
	L.control.scale({
		imperial: false
	}).addTo(map);

	//Worm Icon 
	var icon = L.icon({
		iconUrl: 'http://www.clker.com/cliparts/S/R/r/V/4/k/earth-worm-outline-md.png',
		iconSize: [50, 35]
	});


	//Use worm icon
	function Mark(feature, latlng) {
		return L.marker(latlng, {
			icon: icon
		});
	};


	//load satellite tiles
	var SAT_tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		minZoom: 2,
		maxZoom: 20,
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
	}).addTo(map);



	//group points close to eachother
	var clusterGroup = new L.markerClusterGroup();



		//Filter points from test_meta.js, called meta_data, according to selected nodes, sel_nodes, from tree
		function tree_filter(feature, layer) {
			clusterGroup.clearLayers(); //first remove old points
			if (sel_nodes !== undefined) { //only run, if something is selected in tree
				for (var i = 0; i < sel_nodes.length; i++) {
					if (feature.properties.genus == sel_nodes[i]) return true; //return true if genus fits to selected node in tree
				}
			};
	
			geo_data = L.geoJSON(meta_data, { //Define how points will look like
				pointToLayer: Mark,
				//filter: tree_filter
			})
			clusterGroup.addLayer(geo_data).addTo(map); //Actually show points on map
		};





});
