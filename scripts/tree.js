var map;
var tree_component;

// Create an tree component object
function TreeComponent(data_path){
  this.tree = Phylocanvas.createTree('tree'),
  this.sel_nodes = [];

  this.test = function(str){
    console.log("Test: "+str+"| sel_nodes = "+this.sel_nodes);
  };

  this.initialize = function(){
    this.tree.load(data_path); //load tree data from file
    //Fehler: XML Parsing Error: syntax error. Klappt aber trotzdem

    this.tree.setTreeType('rectangular'); //define type of tree

    //tree.disableZoom = true;

    this.tree.setNodeSize(5); //

    //tree.highlightColour = 'rgba(249,51,45,1)';
    //tree.selectedColour = 'rgba(249,51,45,1)';

    //tree.hoverLabel = false; //TODO Klappt nicht, soll vermeiden, dass labes gezeigt werden, wenn über nodes geschwebt wird
  }



  this.tree.on('updated', ({ //when flags ("selected") for nodes change, save all selected node IDs to sel_nodes and run filter function to render point son map
  	property,
  	nodeIds
  }) => {
  	if (property === 'selected') {
  		this.sel_nodes = nodeIds;
      this.test("NODES");
      handleSelection(nodeIds);
  		//console.log(sel_nodes);
  		//tree_filter();
  	}
  });

  this.initialize();

}

handleSelection = function(ids){
  //TODO: meta_data is coming from a global js file
  map.build_markers(meta_data,ids);
};

$(document).ready(function () {
  map = map_component;
  tree_component = new TreeComponent('data/test_tree.nwk');
  tree_component.test("hui");
});
