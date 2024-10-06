console.log("Starting Platform.js...");

function updatePlatformChart(data) {
    const chart = echarts.init(document.getElementById('platform-chart'));

    // Group data by platform and outlet, summing the revenue
    const platformData = {
        Online: {},
        Offline: {}
    };

    const outlets = new Set();
    
    data.forEach(item => {
        const platform = item['Platform'];
        const outlet = item['Outlet'];
        const revenue = item['Revenue'];

        if (!platformData[platform][outlet]) {
            platformData[platform][outlet] = 0;
        }

        platformData[platform][outlet] += revenue;
        outlets.add(outlet);
    });

    const outletList = Array.from(outlets);
    const onlineData = outletList.map(outlet => platformData.Online[outlet] || 0);
    const offlineData = outletList.map(outlet => platformData.Offline[outlet] || 0);

    const totalRevenue = outletList.map(outlet => (platformData.Online[outlet] || 0) + (platformData.Offline[outlet] || 0));

    const onlinePercentage = onlineData.map((revenue, index) => ((revenue / totalRevenue[index]) * 100).toFixed(2));
    const offlinePercentage = offlineData.map((revenue, index) => ((revenue / totalRevenue[index]) * 100).toFixed(2));

    // Calculate total revenue for all outlets
    const totalOnlineRevenue = onlineData.reduce((sum, value) => sum + value, 0);
    const totalOfflineRevenue = offlineData.reduce((sum, value) => sum + value, 0);
    const totalOverallRevenue = totalOnlineRevenue + totalOfflineRevenue;

    const allOutletsOnlinePercentage = ((totalOnlineRevenue / totalOverallRevenue) * 100).toFixed(2);
    const allOutletsOfflinePercentage = ((totalOfflineRevenue / totalOverallRevenue) * 100).toFixed(2);

    outletList.push("All Outlets");
    onlineData.push(totalOnlineRevenue);
    offlineData.push(totalOfflineRevenue);
    onlinePercentage.push(allOutletsOnlinePercentage);
    offlinePercentage.push(allOutletsOfflinePercentage);

    const option = {
        title: {
            text: 'Revenue Percentage by Platform and Outlet',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const index = params[0].dataIndex;
                const total = totalRevenue[index] || totalOverallRevenue;
                const formattedTotal = new Intl.NumberFormat('en-US',{
                    style:'currency',
                    currency:'AUD'
                }).format(total)
                const formattedOnline = new Intl.NumberFormat('en-US',{
                    style:'currency',
                    currency:'AUD'
                }).format(onlineData[index])
                const formattedOffline = new Intl.NumberFormat('en-US',{
                    style:'currency',
                    currency:'AUD'
                }).format(offlineData[index])
                return `${params[0].name}<br/>Online: ${onlinePercentage[index]}% (${formattedOnline})<br/>Offline: ${offlinePercentage[index]}% (${formattedOffline})`;
            }
        },
        legend: {
            data: ['Online', 'Offline'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: outletList
        },
        series: [
            {
                name: 'Online',
                type: 'bar',
                data: onlinePercentage
            },
            {
                name: 'Offline',
                type: 'bar',
                data: offlinePercentage
            }
        ]
    };

    chart.setOption(option);
}

console.log("Platform.js executed...");
