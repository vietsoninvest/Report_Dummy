console.log("Starting TopBrand.js...");

function updateTopBrandChart(data) {
    const chart = echarts.init(document.getElementById('top-brand-chart'));

    // Group data by brand and month, summing the revenue
    const brandData = {};
    data.forEach(item => {
        const month = new Date(item.Date).getMonth();
        const brand = item.Brand;
        if (!brandData[brand]) {
            brandData[brand] = new Array(12).fill(0);
        }
        brandData[brand][month] += item.Revenue;
    });

    // Sort brands by total revenue and take top 8
    const sortedBrands = Object.entries(brandData)
        .map(([brand, revenue]) => ({
            brand,
            totalRevenue: revenue.reduce((a, b) => a + b, 0),
            revenue
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 8);

    const brands = sortedBrands.map(d => d.brand);
    const seriesData = sortedBrands.map(d => ({
        value: d.totalRevenue.toFixed(2),
        name: d.brand
    }));

    console.log("Sorted Brands:", sortedBrands);
    console.log("Series Data:", seriesData);

    const option = {
        title: {
            text: 'Top 8 Brands by Revenue',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const formattedValue = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(params.value);
                return `${params.seriesName} <br/>${params.name}: ${formattedValue} (${params.percent}%)`;
            }
        },
        legend: {
            left: 'center',
            top: 'bottom',
            data: brands
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [
            {
                name: 'Revenue',
                type: 'pie',
                radius: [20, 140],
                center: ['50%', '50%'],
                roseType: 'radius',
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: seriesData
            }
        ]
    };

    chart.setOption(option);
}

console.log("TopBrand.js executed...");
