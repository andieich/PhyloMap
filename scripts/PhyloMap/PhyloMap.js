//Global Variables
const tree = Phylocanvas.createTree('tree'); //For tree




var sel_nodes; //Stores selected nodes

var map = L.map('map').setView([0, 0], 2); ///Initialize Map

$(document).ready(function () {

	//Load Geo Data
	var meta_data = $.ajax({
		url: "data/meta_data.geojson",
		dataType: "json",
		success: console.log("Data successfully loaded."),
		error: function (xhr) {
			console.log("Error " + xhr.statusText)
		}
	});

	$.when(meta_data).done(function () {

		//Tree
		tree.load('data/test_tree.nwk'); //load tree data from file
		//Fehler: XML Parsing Error: syntax error. Klappt aber trotzdem

		tree.setTreeType('rectangular'); //define type of tree

		//tree.disableZoom = true;
		tree.setNodeSize(5);
		tree.lineWidth = 2;
		//tree.highlightColour = 'rgba(255,0,0,1)';
		//tree.selectedColour = 'rgba(255,0,0,1)';


		tree.on('updated', ({ //when flag ("selected") for nodes change, save all selected node IDs to sel_nodes and run filter function to render point son map
			property,
			nodeIds
		}) => {
			if (property === 'selected') {
				sel_nodes = nodeIds;
				//console.log(sel_nodes);
				update_map();
			}
		});

		tree.draw();


		//Map

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

		function PopUps(feature, layer) {
			layer.bindPopup('<h1 class="center">' + feature.properties.symbiont +
				'</h1><b>Symbiont clade: </b>' + feature.properties.symbiont_clade + '<br><b>Host: </b>' + feature.properties.host_species + '<br><b>Site: </b>' + feature.properties.sampling_site + '<br><b>Depth: </b>' + Math.abs(feature.properties.depth) + ' m' + '<br><b>Sampling Date: </b>' + feature.properties.sampling_date + '<br><b>Worm ID: </b>' + feature.properties.worm);
		};

		//Filter points from test_meta.js, called meta_data, according to selected nodes, sel_nodes, from tree
		function tree_filter(feature, layer) {
			clusterGroup.clearLayers(); //first remove old points
			if (sel_nodes !== undefined) { //only run, if something is selected in tree
				for (var i = 0; i < sel_nodes.length; i++) {
					if (feature.properties.symbiont == sel_nodes[i]) return true; //return true if genus fits to selected node in tree
				}
			}
		};

		function update_map() {
			if (sel_nodes !== undefined) { //only run, if something is selected in tree
				geo_data = L.geoJSON(meta_data.responseJSON, { //Define how points will look like
					pointToLayer: Mark,
					filter: tree_filter,
					onEachFeature: PopUps
				});
				clusterGroup.addLayer(geo_data).addTo(map); //Actually show points on map
			}
		};
	});
});
