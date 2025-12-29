// 星空背景生成
const stars = document.querySelector('.stars');
for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.animationDuration = Math.random() * 3 + 1 + 's';
    star.style.animationDelay = Math.random() * 2 + 's';
    stars.appendChild(star);
}

// 当前选中的年份和图表类型
let currentYear = '2005';
let currentChartType = 'line';
let chartInstance = null;

// 年份和API地址映射
const yearUrls = {
    '2005': 'http://47.109.22.23:8082/listgamebymonth?year=2005',
    '2006': 'http://47.109.22.23:8082/listgamebymonth?year=2006',
    '2007': 'http://47.109.22.23:8082/listgamebymonth?year=2007',
    '2008': 'http://47.109.22.23:8082/listgamebymonth?year=2008',
    '2009': 'http://47.109.22.23:8082/listgamebymonth?year=2009',
    '2010': 'http://47.109.22.23:8082/listgamebymonth?year=2010',
    '2011': 'http://47.109.22.23:8082/listgamebymonth?year=2011',
    '2012': 'http://47.109.22.23:8082/listgamebymonth?year=2012',
    '2013': 'http://47.109.22.23:8082/listgamebymonth?year=2013',
    '2014': 'http://47.109.22.23:8082/listgamebymonth?year=2014',
    '2015': 'http://47.109.22.23:8082/listgamebymonth?year=2015',
    '2016': 'http://47.109.22.23:8082/listgamebymonth?year=2016',
    '2017': 'http://47.109.22.23:8082/listgamebymonth?year=2017',
    '2018': 'http://47.109.22.23:8082/listgamebymonth?year=2018',
    '2019': 'http://47.109.22.23:8082/listgamebymonth?year=2019',
    '2020': 'http://47.109.22.23:8082/listgamebymonth?year=2020',
    '2021': 'http://47.109.22.23:8082/listgamebymonth?year=2021',
    '2022': 'http://47.109.22.23:8082/listgamebymonth?year=2022',
    '2023': 'http://47.109.22.23:8082/listgamebymonth?year=2023',
    '2024': 'http://47.109.22.23:8082/listgamebymonth?year=2024'
};

// 年份选择函数
function selectYear(year) {
    currentYear = year;

    // 更新按钮样式
    const buttons = document.querySelectorAll('.time .btn');
    buttons.forEach(btn => {
        if (btn.value === year) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 重新绘制图表
    drawChart();
}

// 为每个年份函数创建对应的调用
function change1() { selectYear('2005'); }
function change2() { selectYear('2006'); }
function change3() { selectYear('2007'); }
function change4() { selectYear('2008'); }
function change5() { selectYear('2009'); }
function change6() { selectYear('2010'); }
function change7() { selectYear('2011'); }
function change8() { selectYear('2012'); }
function change9() { selectYear('2013'); }
function change10() { selectYear('2014'); }
function change11() { selectYear('2015'); }
function change12() { selectYear('2016'); }
function change13() { selectYear('2017'); }
function change14() { selectYear('2018'); }
function change15() { selectYear('2019'); }
function change16() { selectYear('2020'); }
function change17() { selectYear('2021'); }
function change18() { selectYear('2022'); }
function change19() { selectYear('2023'); }
function change20() { selectYear('2024'); }

// 图表类型切换
function switch1() {
    currentChartType = 'line';
    updateChartButtons();
    drawChart();
}

function switch2() {
    currentChartType = 'bar';
    updateChartButtons();
    drawChart();
}

// 更新图表按钮样式
function updateChartButtons() {
    const lineBtn = document.querySelector('#zhexiantu .btn1');
    const barBtn = document.querySelector('#zhuzhuangtu .btn1');

    if (currentChartType === 'line') {
        lineBtn.classList.add('active');
        barBtn.classList.remove('active');
    } else {
        barBtn.classList.add('active');
        lineBtn.classList.remove('active');
    }
}

// 初始化ECharts图表
function initChart() {
    const container = document.getElementById('chart-container');

    // 销毁之前的图表实例
    if (chartInstance) {
        chartInstance.dispose();
    }

    // 初始化图表
    chartInstance = echarts.init(container);

    // 设置默认主题颜色
    const themeColor = '#64ffda';
    const gridColor = 'rgba(100, 255, 218, 0.1)';
    const textColor = '#ccd6f6';
    const backgroundColor = 'rgba(10, 25, 47, 0.3)';

    // 设置图表基础配置
    const baseOption = {
        backgroundColor: backgroundColor,
        color: [themeColor],
        textStyle: {
            color: textColor,
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '15%',
            containLabel: true,
            borderColor: gridColor
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(10, 25, 47, 0.9)',
            borderColor: themeColor,
            borderWidth: 1,
            textStyle: {
                color: textColor
            },
            axisPointer: {
                type: currentChartType === 'line' ? 'line' : 'shadow',
                shadowStyle: {
                    color: 'rgba(100, 255, 218, 0.1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: themeColor
                }
            },
            axisTick: {
                lineStyle: {
                    color: themeColor
                }
            },
            axisLabel: {
                color: textColor,
                rotate: 45
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: gridColor,
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '游戏数量',
            nameTextStyle: {
                color: textColor
            },
            axisLine: {
                lineStyle: {
                    color: themeColor
                }
            },
            axisTick: {
                lineStyle: {
                    color: themeColor
                }
            },
            axisLabel: {
                color: textColor
            },
            splitLine: {
                lineStyle: {
                    color: gridColor,
                    type: 'dashed'
                }
            }
        },
        series: []
    };

    return chartInstance;
}

// 绘制折线图
function drawLineChart(data) {
    const chart = initChart();

    const option = {
        title: {
            text: `${currentYear}年游戏发布数据统计`,
            left: 'center',
            textStyle: {
                color: '#64ffda',
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        xAxis: {
            data: data.map(item => item[0])
        },
        yAxis: {
            name: '发布数量'
        },
        series: [{
            name: '发布数量',
            type: 'line',
            data: data.map(item => item[1]),
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
                width: 3,
                shadowColor: 'rgba(100, 255, 218, 0.5)',
                shadowBlur: 10
            },
            itemStyle: {
                color: '#64ffda',
                borderColor: '#fff',
                borderWidth: 2
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(100, 255, 218, 0.3)' },
                    { offset: 1, color: 'rgba(100, 255, 218, 0.05)' }
                ])
            },
            label: {
                show: true,
                position: 'top',
                color: '#ccd6f6',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: function (params) {
                    return params.value;
                }
            },
            emphasis: {
                focus: 'series',
                itemStyle: {
                    color: '#fff',
                    borderColor: '#64ffda',
                    borderWidth: 3,
                    shadowColor: 'rgba(100, 255, 218, 0.8)',
                    shadowBlur: 15
                }
            }
        }],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    };

    chart.setOption(option);

    // 添加图表resize监听
    window.addEventListener('resize', function () {
        chart.resize();
    });
}

// 绘制柱状图
function drawBarChart(data) {
    const chart = initChart();

    const option = {
        title: {
            text: `${currentYear}年游戏发布数据统计`,
            left: 'center',
            textStyle: {
                color: '#64ffda',
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        xAxis: {
            data: data.map(item => item[0])
        },
        yAxis: {
            name: '发布数量'
        },
        series: [{
            name: '发布数量',
            type: 'bar',
            data: data.map(item => item[1]),
            barWidth: '60%',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(100, 255, 218, 0.8)' },
                    { offset: 1, color: 'rgba(100, 255, 218, 0.2)' }
                ]),
                borderRadius: [5, 5, 0, 0],
                shadowColor: 'rgba(100, 255, 218, 0.5)',
                shadowBlur: 10
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(100, 255, 218, 1)' },
                        { offset: 1, color: 'rgba(100, 255, 218, 0.4)' }
                    ]),
                    shadowColor: 'rgba(100, 255, 218, 0.8)',
                    shadowBlur: 20
                }
            },
            label: {
                show: true,
                position: 'top',
                color: '#ccd6f6',
                fontSize: 12,
                fontWeight: 'bold'
            }
        }],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'elasticOut'
    };

    chart.setOption(option);

    // 添加图表resize监听
    window.addEventListener('resize', function () {
        chart.resize();
    });
}

// 统一绘制图表函数
function drawChart() {
    const apiUrl = yearUrls[currentYear];

    // 显示加载动画
    const chart = initChart();
    chart.showLoading({
        text: `加载${currentYear}年数据中...`,
        color: '#64ffda',
        textColor: '#ccd6f6',
        maskColor: 'rgba(10, 25, 47, 0.7)'
    });

    // 获取数据
    axios.get(apiUrl)
        .then(response => {
            const data = response.data.data;

            // 隐藏加载动画
            chart.hideLoading();

            if (!data || data.length === 0) {
                chart.setOption({
                    title: {
                        text: `${currentYear}年暂无数据`,
                        left: 'center',
                        top: 'center',
                        textStyle: {
                            color: '#ff6b6b',
                            fontSize: 20
                        }
                    }
                });
                return;
            }

            // 根据当前图表类型绘制
            if (currentChartType === 'line') {
                drawLineChart(data);
            } else {
                drawBarChart(data);
            }
        })
        .catch(error => {
            console.error('数据加载失败:', error);
            chart.hideLoading();
            chart.setOption({
                title: {
                    text: `加载${currentYear}年数据失败，请重试`,
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: '#ff6b6b',
                        fontSize: 16
                    }
                }
            });
        });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 设置默认选中的年份
    selectYear('2005');

    // 设置默认图表类型
    updateChartButtons();

    // 初始化图表
    drawChart();
});
