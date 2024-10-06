import * as echarts from 'echarts';

console.log("Starting HeatMap.js...");

// Australia GeoJSON
const australiaGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": "VIC"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [140.961682, -39.063828],
                        [141.002718, -38.96553],
                        [143.058999, -38.8211],
                        [145.041815, -38.474134],
                        [145.29509, -38.623148],
                        [144.697546, -39.105891],
                        [145.891239, -38.894203],
                        [146.512893, -38.757416],
                        [146.569313, -39.182236],
                        [146.282598, -39.388216],
                        [144.579383, -39.186545],
                        [143.561811, -39.298832],
                        [142.902291, -38.781426],
                        [141.992403, -38.601905],
                        [141.532197, -39.188411],
                        [140.961682, -39.063828]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "NSW"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [141.002718, -38.96553],
                        [149.979167, -37.509727],
                        [150.136934, -34.423399],
                        [150.700252, -33.04167],
                        [149.856768, -31.221496],
                        [148.259597, -29.351809],
                        [141.002718, -28.157013],
                        [141.002718, -38.96553]
                    ]
                ]
            }
        }
    ]
};

echarts.registerMap('Australia', australiaGeoJSON);

function updateHeatMap(data) {
    const chart = echarts.init(document.getElementById('heat-map-chart'));

    // Prepare the data
    const stateRevenue = data.reduce((acc, item) => {
        if (item.State) {
            acc[item.State] = (acc[item.State] || 0) + item.Revenue;
        }
        return acc;
    }, {});

    const formattedData = Object.entries(stateRevenue).map(([state, revenue]) => ({
        name: state,
        value: parseFloat(revenue.toFixed(2)) // Ensuring the value is rounded to 2 decimal places
    }));

    const option = {
        title: {
            text: 'Revenue by State',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} (AUD)'
        },
        visualMap: {
            min: 0,
            max: Math.max(...Object.values(stateRevenue)),
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
            }
        },
        geo: {
            map: 'Australia',
            roam: true,
            itemStyle: {
                areaColor: '#e7e8ea',
                borderColor: '#111'
            }
        },
        series: [
            {
                name: 'Revenue',
                type: 'map',
                map: 'Australia',
                label: {
                    show: true
                },
                data: formattedData,
                // Custom name map (if needed)
                nameMap: {
                    'Victoria': 'VIC',
                    'New South Wales': 'NSW'
                }
            }
        ]
    };

    chart.setOption(option);
}

// Fetch the data from the server
fetch('/data')
    .then(response => response.json())
    .then(data => {
        updateHeatMap(data);
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
    });

console.log("HeatMap.js executed...");
