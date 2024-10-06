console.log("Starting SalesPie.js...");

function updatePieChart(data, selectedOutlets) {
    const pieChart = echarts.init(document.getElementById('pie-chart'));
    
    const outletSales = selectedOutlets.map(outlet => {
        return {
            name: outlet,
            value: data.filter(item => item.Outlet === outlet)
                        .reduce((sum, item) => sum + item.Revenue, 0)
        };
    });

    // Calculate the total revenue
    const totalRevenue = outletSales.reduce((sum, outlet) => sum + outlet.value, 0);

    // Format the total revenue as "$xxx,xxx.00"
    const formattedTotalRevenue = totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    const pieOption = {
        title: {
            text: 'Sales Contribution by Outlet',
            subtext: `Total Revenue: ${formattedTotalRevenue}`,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                const formattedValue = new Intl.NumberFormat('en-US',{
                    style: 'currency',
                    currency: 'AUD'
                }).format(params.value)
                return `${params.seriesName} <br/>${params.name}: ${formattedValue} (${params.percent}%)`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Sales',
                type: 'pie',
                radius: '50%',
                data: outletSales,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    pieChart.setOption(pieOption);
}

console.log("SalesPie.js executed...");
