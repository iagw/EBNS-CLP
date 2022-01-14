var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
mapboxgl.accessToken = 'pk.eyJ1IjoiaWFndyIsImEiOiJja3g0dWd6MDkwdjNoMm9ueHhvank3cHFnIn0.BGjIRENbnIB5gU4Nrx-huA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/mapbox/streets-v11',
    center: [-1.8040, 52.4766],
    zoom: 11,
});
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // Limit seach results to the UK.
    countries: 'gb',
    // Use a bounding box to further limit results
    // to the geographic bounds representing East Birmingham
    bbox: [-1.901035, 52.377688, -1.667387, 52.524273],
    mapboxgl: mapboxgl
}));
map.on('load', function () {
    map.addSource('points', {
        'type': 'geojson',
        'data': './EBNS_epcs_compact_4326.geojson'
    });
    map.addSource('wards', {
        'type': 'geojson',
        'data': './CLP-wards_4326.geojson'
    });
    map.addSource('lsoas', {
        'type': 'geojson',
        'data': './LSOAs_4326.geojson'
    });
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
        '#D9D3C9'
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
        1
    ]);
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
    map.addLayer({
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
    });
    map.addLayer({
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
                "B",
                "hsl(195,59%,79%)",
                "C",
                // "hsl(44,98%,78%)",
                "hsl(30,98%,69%)",
                "D",
                // "hsl(30,98%,69%)",
                "hsl(14,89%,61%)",
                "E",
                "hsl(3,69%,50%)",
                // "hsl(14,89%,61%)",
                "F",
                "hsl(3,69%,50%)",
                "G",
                "hsl(346,100%,32%)",
                "hsla(0, 0%, 0%, 0)",
            ],
            'circle-stroke-color': '#7d807d',
            // 'circle-stroke-width': 1,
            'circle-stroke-width': {
                'type': 'exponential',
                'stops': [
                    [11, 0],
                    [18, 2],
                ]
            },
            'circle-opacity': 0.7,
        }
    });
    map.addLayer({
        'id': 'Ward boundaries',
        'type': 'line',
        'source': 'wards',
        'layout': {
            // Make the layer non-visible by default.
            'visibility': 'none',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'minzoom': 10,
        'maxzoom': 15,
        'paint': {
            'line-color': '#385dce',
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
        'source': 'lsoas',
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
});
// var toggleableLayerIds = [ 'Ward boundaries', 'LSOA boundaries' ];
//
// for (var i = 0; i < toggleableLayerIds.length; i++) {
//     var id = toggleableLayerIds[i];
//
//     var link = document.createElement('a');
//     link.href = '#';
//     link.className = 'active';
//     link.textContent = id;
//
//     link.onclick = function (e) {
//         var clickedLayer = this.textContent;
//         e.preventDefault();
//         e.stopPropagation();
//
//         var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
//
//         if (visibility === 'visible') {
//             map.setLayoutProperty(clickedLayer, 'visibility', 'none');
//             this.className = '';
//         } else {
//             this.className = 'active';
//             map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
//         }
//     };
//
//     var layers = document.getElementById('menu');
//     layers.appendChild(link);
// }
// map.on("click", "id2", function(e) {
//     map.setFilter("id2", ['in', 'current_energy_rating', getRandomCurrentEnergyRating()]);
// });
var currentEnergyRatingArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'N'];
// function getRandomCurrentEnergyRating() {
//     const randomElement = currentEnergyRatingArray[Math.floor(Math.random() * currentEnergyRatingArray.length)];
//     return randomElement;
// }
switchlayer = function (lname) {
    if (document.getElementById(lname + "CB").checked) {
        map.setLayoutProperty(lname, 'visibility', 'visible');
    }
    else {
        map.setLayoutProperty(lname, 'visibility', 'none');
    }
};
switchvis = function (lname) {
    if (document.getElementById(lname + "CB").checked) {
        currentEnergyRatingArray.push(lname);
        map.setFilter('id2', __spreadArray(['in', 'current_energy_rating'], currentEnergyRatingArray, true));
        map.setFilter('data-driven-circles-labels', __spreadArray(['in', 'current_energy_rating'], currentEnergyRatingArray, true));
        // alert(currentEnergyRatingArray.filter(e => e !== lname));
    }
    else {
        currentEnergyRatingArray = currentEnergyRatingArray.filter(function (e) { return e !== lname; });
        map.setFilter('id2', __spreadArray(['in', 'current_energy_rating'], currentEnergyRatingArray, true));
        map.setFilter('data-driven-circles-labels', __spreadArray(['in', 'current_energy_rating'], currentEnergyRatingArray, true));
        // alert(currentEnergyRatingArray.filter(e => e !== lname));
    }
};
// function arrayRemove(arr, value) {
//     return arr.filter(function(ele){
//         return ele !== value;
//     });
//                             alert(result)
// }
// var result = arrayRemove(array, 6);
// Bind function to onclick event for checkbox
// document.getElementById('DCB').onclick = function() {
//     // access properties using this keyword
//     if ( this.checked ) {
//             map.setFilter('id2', ['in', 'current_energy_rating', ...['A', 'B', 'C', 'D', 'E', 'F', 'G']]);
//         alert( currentEnergyRatingArray.value );
//     } else {
//             map.setFilter('id2', ['in', 'current_energy_rating', ...['A', 'B', 'C', 'E', 'F', 'G']]);
//     }
// };
