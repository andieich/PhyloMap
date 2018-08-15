// global vars for the map
var mymap;
var markers;

// Define JSON data for the tree
var tree_data;

$(function(){

//XXX: Firefox returns error, but json can be parsed.. seems like a bug
  var jqxhr = $.ajax({
    url: "data/sample.json",
    contentType:'application/json'
  })
  .done(function(result) {

  })
  .fail(function(xhr,status,error) {
    //alert( "error" + xhr.responseText);
  })
  .complete(function(result) {
    tree_data = JSON.parse(result.responseText).data;
    alert( "success" );
    $('#tree').jstree({
      'core' : {
        'data' : tree_data
        },
      "plugins" : [ "wholerow", "checkbox" ]

    });
    alert( "complete" );
  });

  mymap = L.map('mapid').setView([51.505, -0.09], 1);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);
  markers = new L.FeatureGroup();
  mymap.addLayer(markers);



  $('#tree')
  // listen for event
  .on('changed.jstree', function (e, data) {
    markers.clearLayers();
    var i, j, r = [];
    for(i = 0, j = data.selected.length; i < j; i++) {
      var node = data.instance.get_node(data.selected[i]);
      var lat = data.instance.get_json(node).data.lat;
      var lng = data.instance.get_json(node).data.lng;
      // TODO: extract to method out of tree event
      if(lat && lng){
        var marker = L.marker([lat,lng]);
        markers.addLayer(marker);
      }
      r.push(node.text+'('+lat+','+lng+')');

    }
    $('#result').html('Selected: ' + r.join(', '));
  })




})
