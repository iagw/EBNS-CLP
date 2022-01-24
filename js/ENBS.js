mapboxgl.accessToken = 'pk.eyJ1IjoiaWFndyIsImEiOiJja3g0dWd6MDkwdjNoMm9ueHhvank3cHFnIn0.BGjIRENbnIB5gU4Nrx-huA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/mapbox/streets-v11',
    center: [-1.8040, 52.4766],
    zoom: 11,
});

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // boxSelect: true,
    controls: {
        polygon: true,
        trash: true
    }
});

map.addControl(draw, 'top-left');

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
}),'bottom-right');

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,

// Limit seach results to the UK.
        countries: 'gb',
// Use a bounding box to further limit results
// to the geographic bounds representing East Birmingham
        bbox: [-1.901035, 52.377688, -1.667387, 52.524273],
        mapboxgl: mapboxgl
    })
);

// const geotestjson = turf.points('./data/EBNS_epcs_compact_4326_part.geojson');
// window.alert(geotestjson);

map.on('load', () => {
    map.addSource('points', {
        type: 'geojson',
        // data: './data/EBNS_epcs_compact_4326_part.geojson'
        'data': 'data/EBNS_epcs_compact_4326_full.geojson'

    });

    map.addSource('wards', {
        type: 'geojson',
        data: './data/CLP-wards_4326.geojson'
    });

    map.addSource('lsoas', {
        type: 'geojson',
        data: './data/EBNS_LSOA_epc_4326.geojson',
        // promoteId: 'LSOA11CD' // promote field to be used as a foreign key
    });

    // map.addSource('currentEnergyRating', {
    //     'type': 'csv',
    //     'data': 'data/lsoa_epc_current_energy_rating.csv'
    // });
    // from https://docs.mapbox.com/mapbox-gl-js/example/change-building-color-based-on-zoom-level/

    map.setPaintProperty('building', 'fill-color', [
        'interpolate',
        // Set the exponential rate of change to 0.5
        ['exponential', 0.5],
        ['zoom'],
        // When zoom is 15, buildings will be darker.
        15,
        // '#7d807d',
        '#D9D3C9',
        // When zoom is 18 or higher, buildings will be lighter.
        18,
        '#f8f3eb'
    ]);

    map.setPaintProperty('building', 'fill-opacity', [
        'interpolate',
        // Set the exponential rate of change to 0.5
        ['exponential', 0.5],
        ['zoom'],
        // When zoom is 10, buildings will be 100% transparent.
        10,
        0.5,
        // When zoom is 18 or higher, buildings will be 100% opaque.
        18,
        0.7
    ]);

    map.addLayer({
        "id": "lsoaChoropleth",
        "type": "fill",
        "source": "lsoas",
        "paint": {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'LSOA_epc_g_to_d_and_no_epc_percent'],
                60,'#0e7e58',
                67,'#2aa45b',
                74,'#8cbc42',
                81,'#f6cc15',
                88,'#f2a867',
                95,'#f17e23',
                100,'#e31d3e'
            ],
            'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
            'fill-opacity': 0.7
        }
    });

//         map.addLayer(
//             {
//                 'id': 'id1',
//                 'type': 'heatmap',
//                 'source': 'points',
//                 'maxzoom': 20,
//                 'paint': {
// // // increase weight as diameter breast height increases
// //                     'heatmap-weight': {
// //                         'property': 'dbh',
// //                         'type': 'exponential',
// //                         'stops': [
// //                             [1, 0],
// //                             [62, 1]
// //                         ]
// //                     },
// // increase intensity as zoom level increases
//                     'heatmap-intensity': {
//                         'stops': [
//                             [11, 1],
//                             [15, 3]
//                         ]
//                     },
// // use sequential color palette to use exponentially as the weight increases
//                     'heatmap-color': [
//                         'interpolate',
//                         ['linear'],
//                         ['heatmap-density'],
//                         0,
//                         'rgba(236,222,239,0)',
//                         0.2,
//                         'rgb(208,209,230)',
//                         0.4,
//                         'rgb(166,189,219)',
//                         0.6,
//                         'rgb(103,169,207)',
//                         0.8,
//                         'rgb(28,144,153)'
//                     ],
// // increase radius as zoom increases
//                     'heatmap-radius': {
//                         'stops': [
//                             [11, 25],
//                             [15, 40]
//                         ]
//                     },
// // decrease opacity to transition into the circle layer
//                     'heatmap-opacity': {
//                         'default': 1,
//                         'stops': [
//                             [14, 1],
//                             [15, 0]
//                         ]
//                     }
//                 }
//             },
//         );

    map.addLayer(
        {
            "id": "data-driven-circles-labels",
            "type": "symbol",
            "source": "points",
            "minzoom": 16,
            "filter": ["has", "current_energy_rating"],
            "layout": {
                "text-field": ["get", "current_energy_rating"],
                "text-size": 12,
                "text-padding": 10,
                "text-variable-anchor": [
                    "top-right",
                    "bottom-right",
                    "right",
                    "top-left",
                    "bottom-left"
                ],
                "text-justify": "auto",
                "text-radial-offset": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    1,
                    0.09,
                    5,
                    0.15,
                    10,
                    0.24,
                    22,
                    0.3
                ]
            },
            "paint": {
                "text-color": "hsl(0, 0%, 0%)",
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 0.5
            }
        }
    );


    map.addLayer(
        {
            'id': 'id2',
            'type': 'circle',
            'source': 'points',
            'minzoom': 11,
            'paint': {
                // 'circle-radius': 8,
                'circle-radius': {
                    'type': 'exponential',
                    'stops': [
                        [11, 3],
                        [16, 8],
                        [22, 15],
                    ]
                },
                'circle-color': [
                    "match",
                    [
                        "get",
                        "current_energy_rating"
                    ],

                    "A",
                    "hsl(214,45%,49%)",
                    // "hsl(214,45%,49%)", // previous

                    "B",
                    "hsl(150,86%,28%)",
                    // "hsl(195,59%,79%)", // previous

                    "C",
                    "hsl(87,53%,56%)",
                    // "hsl(30,98%,69%)", // previous

                    "D",
                    "hsl(58,87%,58%)",
                    // "hsl(14,89%,61%)", // previous

                    "E",
                    "hsl(38,91%,59%)",
                    // "hsl(3,69%,50%)", // previous
                    // "hsl(14,89%,61%)",

                    "F",
                    "hsl(20,87%,56%)",
                    // "hsl(3,69%,50%)", // previous

                    "G",
                    "hsl(357,82%,53%)",
                    // "hsl(346,100%,32%)", // previous
                    "hsla(0, 0%, 0%, 0)",
                ],


                'circle-stroke-color': '#7d807d', //'white'
                // 'circle-stroke-width': 1,
                'circle-stroke-width': {
                    'type': 'exponential',
                    'stops': [
                        [11, 0],
                        [18, 2],
                    ]
                },
                'circle-opacity': 0.8,
            }
        },
    );

    map.addLayer({
        'id': 'Ward boundaries',
        'type': 'line',
        'source': 'wards', // reference the data source
        'layout': {
            // Make the layer non-visible by default.
            'visibility': 'none',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'minzoom': 10,
        'maxzoom': 15,
        'paint': {
            'line-color': '#385dce', // blue color fill
            // 'fill-opacity': 1,
            // 'line-width': 3
            'line-width': {
                'type': 'exponential',
                'stops': [
                    [11, 2],
                    [15, 3],
                ]
            },
        }
    });

    map.addLayer({
        'id': 'LSOA boundaries',
        'type': 'line',
        'source': 'lsoas', // reference the data source
        'layout': {
            // Make the layer non-visible by default.
            'visibility': 'none',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'minzoom': 10,
        'maxzoom': 18,
        'paint': {
            'line-color': '#341309',
            // 'fill-opacity': 1,
            // 'line-width': 2
            'line-width': {
                'type': 'exponential',
                'stops': [
                    [11, 1],
                    [15, 3],
                ]
            },
        }
    });

//     map.addSource('pointsInUserPolygon', {
//   type: 'geojson',
//   data: {
//     type: 'FeatureCollection',
//     features: []
//   }
// });


// map.on('draw.create', featuresInArea);
// map.on('draw.delete', featuresInArea);
// map.on('draw.update', featuresInArea);
//
// function featuresInArea(e) {
// const userPolygon = draw.getAll();
// if (userPolygon.features.length > 0) {
// const area = turf.area(userPolygon);
// const tpoints = turf.points(['id2'])
// // ptsWithin = map.queryRenderedFeatures(userPolygon, { layers: ['id2'] });
// // var ptsWithin = turf.pointsWithinPolygon({ layers: ['id2'] }.toGeoJSON, userPolygon);
// // console.log(turf.points('id2'), turf.polygon(userPolygon))
//
// // Restrict the area to 2 decimal points.
// const rounded_area = Math.round(area * 100) / 100;
//     console.log(rounded_area)
//     // console.log(getMode(userPolygon))
//
//
// } else {
// // answer.innerHTML = '';
// if (e.type !== 'draw.delete')
// alert('Click the map to draw a polygon.');
// }
// }

    // var feature = turf.points({'source': 'points'});
    // console.log(feature);



//     var uniqueFeatures = getUniqueFeatures(features, "icon");
//
// uniqueFeatures.forEach(function(feature) {
//         var prop = feature.properties;
//         console.log(prop.icon);
// })

    map.on('idle',function(){
        // var mapLayer = map.queryRenderedFeatures({ layers: ['id2'] });
        var mapLayer = map.getSource('points')
        // console.log(mapLayer)
        // console.log(mapLayer['features']['properties']['uprn'][0])


        map.on('draw.create', function(e) {
            // const userPolygon = draw.getAll();
            var userPolygon = e.features[0];
            var pointtocheck = turf.points([
                [-1.9097609006719085, 52.462021380049995],
            ]);
            var ptsWithin = turf.pointsWithinPolygon(pointtocheck, userPolygon);
            // var ptsWithin = turf.inside(mapLayer, userPolygon);
            // console.log(ptsWithin);
        });
        // https://docs.mapbox.com/mapbox-gl-js/example/using-box-queryrenderedfeatures/
        // const oocc = mapLayer.map((feature) => feature.properties.uprn);
        // map.setFilter('id2', ['in', 'uprn', ...uprn]);
    });




// let mapLayer;
//     map.on("sourcedata", function(e) {
//         if (map.getSource('points') && map.isSourceLoaded('points')) {
//             console.log('source loaded!');
//             var mapLayer = map.querySourceFeatures('points');
//             console.log(mapLayer.length);
//         }
//     });


    // var marker = new mapboxgl.Marker()
    //     .setLngLat([-1.9097609006719085, 52.462021380049995])
    //     .addTo(map);

});


switchlayer = function (lname) {
    if (document.getElementById(lname + "CB").checked) {
        map.setLayoutProperty(lname, 'visibility', 'visible');
    } else {
        map.setLayoutProperty(lname, 'visibility', 'none');
    }
}


map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['lsoaChoropleth'] // replace this with the name of the layer
    });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(e.lngLat)
        .setHTML('' +
            '<h3>'+ feature.properties['LSOA11NM'] + '</h3>' +
            '<p>' + feature.properties['LSOA_uprn_count'] + ' number of dwellings' + '</p>' +
            '<p>' + '(' + feature.properties['LSOA_epc_g_to_d_count'] + ') ' +
            feature.properties['LSOA_epc_g_to_d_percent'] + '% of dwellings with epcs G to D' + '</p>' +
            '<p>' + '(' + feature.properties['LSOA_no epc_count'] + ') ' +
            feature.properties['LSOA_no epc_percent'] + '% of dwellings without epc' + '</p>' +
            '<p>' + '(' + feature.properties['LSOA_epc_g_to_d_and_no_epc_count'] + ') ' +
            feature.properties['LSOA_epc_g_to_d_and_no_epc_percent'] + '% of dwellings with epc G to D or no epc' + '</p>'
        )
        .addTo(map);
});

var tenureShowList = ['owner-occupied',
    'rental (social)',
    'rental (private)',
    'unknown',
    'not defined new build',
    'no data',
    'no epc'];

var epcShowList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'no epc'];
var bromfordShowList = ['0', 'bromford'];
var lsoaShowList = ['Birmingham 029A',
    'Birmingham 029B',
    'Birmingham 029C',
    'Birmingham 029F',
    'Birmingham 038A',
    'Birmingham 038B',
    'Birmingham 038C',
    'Birmingham 044A',
    'Birmingham 038D',
    'Birmingham 042A',
    'Birmingham 042B',
    'Birmingham 042C',
    'Birmingham 045A',
    'Birmingham 042D',
    'Birmingham 042E',
    'Birmingham 045B',
    'Birmingham 029D',
    'Birmingham 029E']

document.getElementById('lsoaListCB').addEventListener('change', function() {
    if (this.checked) {
                map.setFilter('lsoaChoropleth', ['in', 'LSOA11NM', ...lsoaShowList]);
    } else { map.setFilter('lsoaChoropleth', null)
    }})




// document.getElementById('bromfordCB').addEventListener('change', function() {
//     if (this.checked) {
//         bromfordShowList = ['bromford']
//     } else { bromfordShowList = ['0', 'bromford']
//     }})

// console.log(tenureShowList, epcShowList, bromfordShowList);


// let tenureShowList;
document.querySelectorAll('[name="epcRatingCBs"], [name="tenureCBs"], [name="bromfordCB"]').forEach(function (chk) {
    chk.addEventListener('change', function () {
        tenureShowList = Array.from(document.querySelectorAll("input[name='tenureCBs']:checked")).map((elem) => elem.value)
        epcShowList = Array.from(document.querySelectorAll("input[name='epcRatingCBs']:checked")).map((elem) => elem.value)

        // console.log(tenureShowList, epcShowList, bromfordShowList)

        var epcRatingFilter = ['in', 'current_energy_rating', ...epcShowList];
        var tenureFilter = ['in', 'tenure', ...tenureShowList];
        var bromfordFilter = ['in', 'bromford', ...bromfordShowList];

        var combinedFilter = ["all", epcRatingFilter, tenureFilter, bromfordFilter];
        map.setFilter('id2', combinedFilter);
        map.setFilter('data-driven-circles-labels', combinedFilter);

    });
});
