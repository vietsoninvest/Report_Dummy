console.log("Starting CategoryByRevenue.js...");

function updateCategoryByRevenueChart(data) {
    const chart = echarts.init(document.getElementById('category-by-revenue-chart'));

    // Group data by department and month, summing the revenue
    const departmentData = {};
    data.forEach(item => {
        const month = new Date(item.Date).getMonth();
        const department = item.Department;
        if (!departmentData[department]) {
            departmentData[department] = new Array(12).fill(0);
        }
        departmentData[department][month] += item.Revenue;
    });

    // Sort departments by total revenue and take top 8
    const sortedDepartments = Object.entries(departmentData)
        .map(([department, revenue]) => ({
            department,
            totalRevenue: revenue.reduce((a, b) => a + b, 0),
            revenue
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 8);

    const departments = sortedDepartments.map(d => d.department);
    
    // Calculate rankings by month
    const rankingsByMonth = [];
    for (let i = 0; i < 12; i++) {
        const ranking = sortedDepartments.map(d => ({
            department: d.department,
            revenue: d.revenue[i]
        })).sort((a, b) => b.revenue - a.revenue);

        ranking.forEach((item, index) => {
            if (!rankingsByMonth[i]) rankingsByMonth[i] = {};
            rankingsByMonth[i][item.department] = index + 1;
        });
    }

    const series = sortedDepartments.map(d => ({
        name: d.department,
        type: 'line',
        data: d.revenue.map((value, index) => {
            const rank = rankingsByMonth[index][d.department];
            return rank || null;
        }),
        smooth: true,
        emphasis: {
            focus: 'series'
        },
        endLabel: {
            show: true,
            formatter: '{a}',
            distance: 20
        },
        lineStyle: {
            width: 4
        }
    }));

    // Filter months with data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const filteredMonths = monthNames.filter((_, index) => sortedDepartments.some(d => d.revenue[index] > 0));

    const option = {
        title: {
            text: 'Top 8 Category by Revenue'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let result = params[0].name + '<br/>';
                params.forEach(function (item) {
                    result += item.marker + ' ' + item.seriesName + ': Rank ' + item.value + '<br/>';
                });
                return result;
            },
            position: function (pos, params, dom, rect, size) {
                var obj = { top: 10 };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
        },
        grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: true
            },
            axisLabel: {
                margin: 30,
                fontSize: 16
            },
            boundaryGap: false,
            data: filteredMonths
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 30,
                fontSize: 16,
                formatter: '#{value}'
            },
            inverse: true,
            interval: 1,
            min: 1,
            max: 8
        },
        series: series
    };

    chart.setOption(option);
}

console.log("CategoryByRevenue.js executed...");
