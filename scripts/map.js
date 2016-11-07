(function(Pub) {

  Pub.Map = L.map('map').setView([47.3208995, 5.0372081], 12);

  var tilesLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(Pub.Map);

}(window.Pub = window.Pub || {}))
