var tree = Phylocanvas.createTree('tree');


tree.load('data/test_tree.nwk'); //load tree data from file
//Fehler: XML Parsing Error: syntax error. Klappt aber trotzdem

tree.setTreeType('rectangular'); //define type of tree



//tree.disableZoom = true;

tree.setNodeSize(5); //

//tree.highlightColour = 'rgba(249,51,45,1)';
//tree.selectedColour = 'rgba(249,51,45,1)';

//tree.hoverLabel = false; //TODO Klappt nicht, soll vermeiden, dass labes gezeigt werden, wenn über nodes geschwebt wird


tree.on('updated', ({ //when flags ("selected") for nodes change, save all selected node IDs to sel_nodes and run filter function to render point son map
	property,
	nodeIds
}) => {
	if (property === 'selected') {
		var sel_nodes = nodeIds;
		console.log(sel_nodes);
		tree_filter();
	}
});
