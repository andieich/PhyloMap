function Application(){
  this.map = new MapComponent();
  this.tree = new TreeComponent('data/test_tree.nwk');
  this.meta = gl_meta_data; // just hold it as actual Application content

  this.handleSelection = function(ids){
    //TODO: meta_data is coming from a global js file
    this.map.build_markers(gl_meta_data,ids);
  };
}

// GLOBAL STUFF
var application;
var gl_meta_data = meta_data; //from global js file

$(document).ready(function () {
  application = new Application();
});

function log(message){
  alert(message);
  console.log(message);
}
