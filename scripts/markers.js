(function(Pub) {

  var markersLayer;
  var overpassQuery = $('#overpass-query').text();
  var overpassUrl = 'https://api.openstreetmap.fr/oapi/interpreter?data=' + encodeURIComponent(overpassQuery);

  updateMarkers();

  setInterval(updateMarkers, 60 * 10 * 1000);
  Pub.Map.on('zoomend', updateZoomLevel);

  function updateMarkers() {
    $.getJSON(overpassUrl, function(data) {
      var elements = data.elements;
      resetStats();
      if(markersLayer) {
        Pub.Map.removeLayer(markersLayer);
      }
      markersLayer = new L.LayerGroup([]);
      elements.forEach(function(e) {
        if(e.lat && e.lon) {
          var m = L.circleMarker([e.lat, e.lon], {
            color: '#fff',
            weight: 0.1,
            radius: 3,
            fillColor: '#7E0E4A',
            fillOpacity: 1,
            className: 'board'
          });
          m.bindPopup(e.tags ? formatTags(e.tags) : 'Aucune donnée.');
          e.tags && updateStats(e.tags);
          markersLayer.addLayer(m);
        }
      });
      Pub.Map.addLayer(markersLayer);
      updateZoomLevel();
      renderStats();
    });
  }

  function updateZoomLevel() {
    var zoom = Pub.Map.getZoom();
    var radius = 3;
    if(zoom <= 10) radius = 1;
    if(zoom >= 11 && zoom <= 14) radius = 3;
    if(zoom >= 15) radius = 5;
    markersLayer.eachLayer(function(marker) {
      marker.setRadius(radius);
    });
    console.log(zoom);
  }

  function formatTags(tags) {
    var items = Object.keys(tags).map(function(key) {
      if(key === translate(key)) return;
      var value = tags[key];
      return '<strong>' + translate(key) + '</strong> ' + translate(value);
    });
    return items.reduce(function(carry, item) {
      if(item) carry.push(item);
      return carry;
    }, []).join('<br />');
  }

  var translations = {
    'advertising': 'Type de panneau',
    'luminous': 'Lumineux',
    'yes': 'oui',
    'no': 'non',
    'poster_box': 'Affiche',
    'billboard': 'Panneau 4x3',
    'operator': 'Opérateur',
    'two_sided': 'Recto verso',
    'doublesided': 'Recto verso',
    'column': 'Colonne Morris',
    'screen': 'Écran',
    'event': 'Affichage évènementiel',
    'wall_painting': 'Peinture murale',
    'animated': 'Dynamique',
    'small_billboard': '"Petit" panneau'
  };

  function translate(str) {
    return str in translations ? translations[str] : str;
  }

  function resetStats() {
    stats = {
      operators : {
        'Non renseigné': 0
      },
      advertising: {
        'Non renseigné': 0
      },
      total: 0
    };
  }

  function updateStats(tags) {
    if('operator' in tags) {
      stats.operators[tags.operator] = tags.operator in stats.operators ?
        (stats.operators[tags.operator] + 1) :
        1
      ;
    } else {
      stats.operators['Non renseigné']++;
    }

    if('advertising' in tags) {
      stats.advertising[tags.advertising] = tags.advertising in stats.advertising ?
        (stats.advertising[tags.advertising] + 1) :
        1
      ;
    } else {
      stats.operators['Non renseigné']++;
    }

    stats.total++;
  }

  function renderStats() {

    var colorScale = d3.scale.category20();
    var colorPattern = _.range(20).map(function(i) { return colorScale(i); });

    c3.generate({
      bindto: '#operators-chart',
      data: {
        columns: _.map(stats.operators, function(v, k) { return [translate(k), v]; }),
        type: 'pie'
      },
      color: {
        pattern: colorPattern
      }
    });

    c3.generate({
      bindto: '#types-chart',
      data: {
        columns: _.map(stats.advertising, function(v, k) { return [translate(k), v]; }),
        type: 'pie',
      },
      color: {
        pattern: colorPattern
      }
    });

    $('#totalCount').text(stats.total);
    Object.keys(stats.operators).forEach(function(key) {
      var val = stats.operators[key];
      $('#operators > tbody').append('<tr><td>' + key + '</td><td>' + val + '</td></tr>');
    });

    Object.keys(stats.advertising).forEach(function(key) {
      var val = stats.advertising[key];
      $('#advertising > tbody').append('<tr><td>' + translate(key) + '</td><td>' + val + '</td></tr>');
    });

  }

}(window.Pub = window.Pub || {}))
