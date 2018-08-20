function MapComponent(){

  this.map = L.map('map').setView([0, 0], 2);
  this.default_icon;
  // initialize map
  L.control.scale({
    imperial: false
  }).addTo(this.map);

  //load satellite tiles
  L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    minZoom: 2,
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }).addTo(this.map);

  //group points close to eachother
  this.clusterGroup = new L.markerClusterGroup().addTo(this.map);

  //Use worm icon
	this.default_marker = function(feature, latlng) {
    var icon = L.icon({
  		iconUrl: 'http://www.clker.com/cliparts/S/R/r/V/4/k/earth-worm-outline-md.png',
      //iconUrl: '../assets/images/earth-worm-outline-md.png',
  		iconSize: [50, 35]
  	});
    if(icon === undefined){
      log("Icon is undefined!");
    }
    if(latlng === undefined){
      log("No coordinates for "+feature)
    }
		return L.marker(latlng, {
			icon: icon
		});
	};

  this.clear_markers = function(){
    if(this.clusterGroup === undefined){
      log("No clusterGroup defined");
      this.clusterGroup = new L.markerClusterGroup().addTo(this.map);
    }
    this.clusterGroup.clearLayers();
  };

  this.format_properties = function(feature, layer) {
    var pup = '<strong>'+feature.properties.Symbiont+'</strong>'+'<pre>'+JSON.stringify(feature.properties,null,' ').replace(/[\{\}"]/g,'')+'</pre>';

    layer.bindPopup(pup);
  }
  this.build_markers = function(meta_data,selected_ids){
    this.clear_markers();
    var marker = this.default_marker;

    if(marker === undefined){
      log("Could not create marker instance");
    }
    var mc = this;
    var geo_data = L.geoJSON(meta_data, { //Define how points will look like
      pointToLayer: marker,
      filter: function(feature,layer){
        var sel_nodes = selected_ids;
        console.log("Filter for "+sel_nodes);
        if (sel_nodes !== undefined) { //only run, if something is selected in tree
          for (var i = 0; i < sel_nodes.length; i++) {
            if (feature.properties.Symbiont == sel_nodes[i]) return true; //return true if genus fits to selected node in tree
          }
        }
      },
      onEachFeature: mc.format_properties
    });
    this.clusterGroup.addLayer(geo_data);
    this.clusterGroup.addTo(this.map); //Actually show points on map
  }

  // return/export the built instance of the component
  return this;

}
