console.log("Starting SalesLine.js...");

function updateLineChart(data, selectedOutlets) {
    const lineChart = echarts.init(document.getElementById('line-chart'));

    // Group data by month and filter out months with no data
    const groupedDataByMonth = Array.from({ length: 12 }, (_, index) => {
        return {
            month: index + 1,
            data: data.filter(item => new Date(item.Date).getMonth() + 1 === index + 1)
        };
    }).filter(group => group.data.length > 0);

    console.log("Grouped Data by Month:", groupedDataByMonth);

    // Create an array of month names for the x-axis with only the months that have data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const filteredMonths = groupedDataByMonth.map(group => monthNames[group.month - 1]);

    console.log("Filtered Months for X-Axis:", filteredMonths);

    // Create the series data for the chart
    const series = selectedOutlets.map(outlet => {
        const data = groupedDataByMonth.map(group => {
            return group.data.filter(item => item.Outlet === outlet)
                             .reduce((sum, item) => sum + item.Revenue, 0);
        });

        return {
            name: outlet,
            type: 'line',
            data: data
        };
    });

    console.log("Series Data for Chart (Before Sorting):", series);

    // Sort the series by their total values in descending order
    series.sort((a, b) => {
        const totalA = a.data.reduce((sum, value) => sum + value, 0);
        const totalB = b.data.reduce((sum, value) => sum + value, 0);
        return totalB - totalA;
    });

    console.log("Series Data for Chart (After Sorting):", series);

    // ECharts line chart configuration
    const lineOption = {
        legend: {
            data: series.map(serie => serie.name)
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params.sort((a, b) => b.value - a.value); // Sort params by value in descending order
                let result = params[0].name + '<br/>';
                params.forEach(function (item) {
                    const formattedValue = new Intl.NumberFormat('en-US',{
                        style: 'currency',
                        currency: 'AUD'
                    }).format(item.value);    
                    result += item.marker + ' ' + item.seriesName + ': ' + formattedValue + '<br/>';
                });
                return result;
            }
        },
        xAxis: {
            type: 'category',
            data: filteredMonths,
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };

    // Set the options for the line chart
    lineChart.setOption(lineOption);
}

console.log("SalesLine.js executed...");
