/* globals $, L, legend */

var $legend = $('#trueLegendContent')
var $legendButton = $('#trueLegendButton')
var majorLayers = {}
var minorLayers = {}
var topLayers = {}
var bcycleData
var map
var transitRoutes
var transitStops

function initialize () {
  map = L.npmap.map({
    center: {
      lat: 29.369245,
      lng: -98.475088
    },
    div: 'map-canvas',
    events: [{
      fn: function () {
        var zoom = map.getZoom()

        if (zoom >= 15) {
          for (var i in minorLayers) {
            minorLayers[i].addTo(map)
          }

          for (var k in topLayers) {
            map.removeLayer(topLayers[k])
          }
        } else {
          for (var j in minorLayers) {
            map.removeLayer(minorLayers[j])
          }

          for (var l in topLayers) {
            topLayers[l].addTo(map)
          }
        }
      },
      type: 'zoomend'
    }],
    locateControl: true,
    zoom: 13
  })
  $('#map-canvas').css('padding-top', $('.navbar').height())

  try {
    legend()
  } catch(e) {}

  majorLayers.aceLines = L.npmap.layer.geojson({
    popup: {
      description: 'These trails provide visitors up-close views of the acequias that originally irrigated the fields around the missions.',
      title: 'Acequia Trails'
    },
    styles: {
      line: {
        'stroke': '#00315e',
        'stroke-opacity': 0.8
      }
    },
    tooltip: 'Acequia Trails',
    url: 'data/acequias_trails.geojson'
  }).addTo(map)
  majorLayers.aceSites = L.npmap.layer.geojson({
    popup: {
      description: '{{Info}}',
      title: '{{Name}}'
    },
    styles: {
      point: {
        'marker-color': '#00315e',
        'marker-symbol': 'dam'
      }
    },
    tooltip: '{{Name}}',
    url: 'data/acequias.geojson'
  }).addTo(map)
  majorLayers.missions = L.npmap.layer.geojson({
    popup: function (feature) {
      return '<b>' + feature.Full_Name + '</b><p>' + feature.Desc + '</p><p><a href=' + feature.Link + '>More information on nps.gov</a></p>' + '<p><a href=' + feature.Directions + '>Directions</a></p>'
    },
    styles: function (feature) {
      return {
        point: {
          iconSize: [50, 50],
          iconUrl: feature.iconUrl
        }
      }
    },
    tooltip: 'Mission {{Name}}',
    url: 'data/cmpndsites.geojson'
  }).addTo(map)
  majorLayers.missionTrails = L.npmap.layer.geojson({
    color: '#78591f',
    dashArray: '5, 10',
    opacity: 0.8,
    tooltip: 'Mission Trail',
    url: 'data/missiontrails_dry.geojson'
  })
  majorLayers.trailsNew = L.npmap.layer.geojson({
    popup: {
      description: 'The River Walk and connecting trails.',
      title: 'River Walk'
    },
    styles: {
      line: {
        'stroke': '#ff0044',
        'stroke-opacity': 0.8
      }
    },
    tooltip: 'River Walk',
    url: 'data/mainTrails.geojson'
  }).addTo(map)
  minorLayers.minor = L.npmap.layer.geojson({
    popup: {
      title: '{{Facility}}',
      description: '{{Name}}'
    },
    tooltip: '{{Facility}}',
    url: 'data/CombinedFacilities.geojson'
  })
  minorLayers.onStreetBikeOnly = L.npmap.layer.geojson({
    color: '#ff9900',
    dashArray: '5, 10',
    opacity: 0.8,
    popup: {
      title: 'Bike-only Road Routes'
    },
    tooltip: 'Bike-only Road Routes',
    url: 'data/BikeOnly_onRoad.geojson'
  })
  minorLayers.onStreetBikePed = L.npmap.layer.geojson({
    popup: {
      description: 'For cyclists and pedestrians.',
      title: 'Road Routes'
    },
    styles: {
      line: {
        'stroke': '#ff9900',
        'stroke-opacity': 0.8
      }
    },
    tooltip: 'Road Routes',
    url: 'data/BikePed_onRoad.geojson'
  })
  minorLayers.parking = L.npmap.layer.geojson({
    popup: {
      title: '{{Parking}}'
    },
    styles: {
      point: {
        'marker-symbol': 'parking'
      }
    },
    tooltip: 'Parking Area',
    url: 'data/parking.geojson'
  })
  minorLayers.ped = L.npmap.layer.geojson({
    popup: {
      description: 'Only pedestrians are allowed on downtown sections of the River Walk and certain other trails.',
      title: 'Pedestrians-only trail'
    },
    styles: {
      line: {
        'stroke': '#ff0044',
        'stroke-opacity': 0.8,
        'stroke-width': 1.3
      }
    },
    tooltip: 'Pedestrians-only trail',
    url: 'data/pedTrails.geojson'
  })
  minorLayers.secondary = L.npmap.layer.geojson({
    color: '#ff0044',
    opacity: 0.8,
    popup: {
      description: 'The River Walk and connecting trails.',
      title: 'River Walk Connections'
    },
    tooltip: 'River Walk',
    url: 'data/secondaryTrails.geojson'
  })
  minorLayers.visitorCenters = L.npmap.layer.geojson({
    popup: {
      title: '{{Facility}}'
    },
    styles: {
      point: {
        'marker-color': '#d39700'
      }
    },
    tooltip: '{{Facility}}',
    url: 'data/visitorCenters.geojson'
  })
  topLayers.minor = L.npmap.layer.geojson({
    cluster: true,
    popup: {
      description: '{{Name}}',
      title: '{{Facility}}'
    },
    tooltip: '{{Facility}}',
    url: 'data/CombinedFacilities.geojson'
  }).addTo(map)
  transitRoutes = L.npmap.layer.geojson({
    popup: function (feature) {
      return '<b>VIA Bus Route 42</b><p><a href=http://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>Check VIA Transit for service times and schedules</a></p>'
    },
    styles: {
      line: {
        'stroke': '#45000d',
        'stroke-opacity': 0.8
      }
    },
    url: 'data/viamissions.geojson'
  })
  transitStops = L.npmap.layer.geojson({
    popup: {
      description: 'Schedules vary significantly. <br> <a href=http://www.viainfo.net/BusService/RiderTool.aspx?ToolChoice=Schedules>Check VIA Transit for service times and schedules</a>',
      title: '{{stop_name}}'
    },
    styles: {
      point: {
        'marker-symbol': 'bus'
      }
    },
    tooltip: 'Bus Stop',
    url: 'data/cutviastops.geojson'
  })
}

$(document).ready(function () {
  initialize()
  $.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('ApiKey', '49AB876F-017E-47BE-84BD-876AE6A6151D')
    },
    headers: {
      'ApiKey': '49AB876F-017E-47BE-84BD-876AE6A6151D',
      'Cache-Control': 'no-cache'
    },
    success: function (data) {
      var bcycleLayer = L.layerGroup()

      bcycleData = data.data

      for (var i in bcycleData) {
        var station = bcycleData[i]
        var newStation = L.marker([station.Location.Latitude, station.Location.Longitude])

        newStation.bcycleID = station.Id
        newStation.title = station.Name
        newStation.openBikes = station.BikesAvailable
        newStation.openDocks = station.DocksAvailable
        newStation.status = station.Status
        newStation.bindPopup('' +
          '<b>B-cycle: ' + newStation.title + '</b>' +
          '<p>Bikes available: ' + newStation.openBikes + '<br>Docks available: ' + newStation.openDocks + '</p>' +
          '<p>For more information on B-cycle, visit <a href="https://sanantonio.bcycle.com/">sanantonio.bcycle.com</a></p>.' +
        '')
        newStation.setIcon(L.icon({
          iconSize: [20, 20],
          iconUrl: 'icons/bcycle.gif'
        }))
        bcycleLayer.addLayer(newStation)
      }

      minorLayers.bcycle = bcycleLayer
    },
    type: 'GET',
    url: 'http://enigmatic-castle-8864.herokuapp.com/?type=json&url=' + encodeURIComponent('https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/48')
  })
  $('#buttonCloseLegend').click(function () {
    $legend.hide()
    $legendButton.show()
  })
  $legendButton.click(function () {
    $legendButton.hide()
    $legend.show()
  })
  $('#buttonTransit').click(function () {
    var $this = $(this)

    if ($this.text().indexOf('Hide') > -1) {
      map
        .removeLayer(transitStops)
        .removeLayer(transitRoutes)
      $this
        .removeClass('active')
        .text('Show Transit')
    } else {
      map
        .addLayer(transitStops)
        .addLayer(transitRoutes)
      $this
        .addClass('active')
        .text('Hide Transit')
    }
  })
})
