
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

// 游戏详情展示函数
const gameDetails = {
    1: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/62a4689c-6d08-4225-af35-08894f153801.jpg",
        text: "《上古卷轴5：天际》（The Elder Scrolls V：Skyrim）是奇幻类开放世界型动作角色扮演游戏，是《上古卷轴》系列的第五作，由Bethesda游戏工作室开发。《上古卷轴5：天际》发行于2011年11月11日，游戏平台为PC、Xbox 360、PS3。《上古卷轴5：天际》将会和《上古卷轴4》拥有同等大小的地图。在这广阔的地图之上，Bethesda工作室给玩家提供了超过120个不重复的地下迷宫，以及9个规模宏大的城市供玩家探索，而玩家将在这个奇异自由的世界踏上史诗性的征程，使用自己心仪的武器装备自己擅长的技能，去和巨兽，飞龙战斗。"
    },
    2: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/16f3599d-9c8e-4a3d-a468-d80764f649bc.webp",
        text: "《极乐迪斯科》（Disco Elysium）是由独立游戏开发商ZA/UM制作并发行的一款侦探式冒险RPG。游戏于2019年10月15日发售，中文版于2020年3月19日发售，游戏平台为PC。《极乐迪斯科》游戏中，玩家将扮演一位落魄潦倒的中尉侦探，身处堕落的港口城市雷瓦科城，这里腐败横行，谋杀案一波未平一波又起，青少年们也整天只想着蹦迪。玩家在其中或是搜寻线索，审讯疑犯，或是探索这座广袤迷人的手绘城市，揭露它深埋的秘密。与此同时，局势逐渐恶化，城中冲突加剧，危机一触即发"
    },
    3: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/5753b061-a66e-46bc-ae3f-9e6fb01e386f.webp",
        text: "《半条命2》（Half Life 2），是一款第一人称射击游戏，Valve制作，2004年11月16日由Valve Software在PC发行。《半条命2》故事仍旧由《半条命》主角GORDON继续延续下去，当地球受到异形的占据，人类渐渐在灭亡的同时，GORDON必须挺身而出回到BALCK MESA实验室来找出解决异形的方法，所有人包括他所关心的人都只能依赖GORDON将他们从这场灾变中解救出来。"
    },
    4: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/100474e5-1997-4025-af1e-9848476772d3.webp",
        text: "《侠盗猎车手5》（Grand Theft Auto V，GTA5）是由Rockstar Games制作的一款开放世界动作冒险游戏，并于2013年9月17日发行。《侠盗猎车手5》的游戏背景设定在虚构的美国圣安地列斯州（San Andreas，以南加州为范本），玩家以第三人称、第一人称游玩，可自由的与游戏世界互动，随意地在荒漠间和虚构的城市洛圣都（Los Santos，以洛杉矶为范本）中漫游。该游戏内容存在暴力血腥、教唆犯罪等违法内容，不适合未成年接触。"
    },
    5: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/72c18e87-e396-437b-8d61-f2000cfdbb37.jpg",
        text: "《暗喻幻想：ReFantazio》（Metaphor: ReFantazio）是一款由Atlus开发、Xbox Game Studios发行的奇幻角色扮演游戏，于2024年发售，登录PS5、PS4、XSX|S和PC平台。2024年12月13日，该游戏获The Game Awards 2024年度游戏大奖最佳角色扮演游戏。"
    },
    6: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/6195b13e-52b4-4e5b-bb1b-02b96ea618de.jpg",
        text: "《寂静岭2》（Silent Hill 2），是一款恐怖冒险类游戏，2002年12月2日由开发商Konami在PC发布的，为《寂静岭》的第二部。《寂静岭2》，把玩家放在了一个交错的二元世界中，一个世界是在现实的小镇中，这里终日被谜雾笼罩，另外一个世界则是在虚幻中，这里漆黑如夜，生活着非常多的外形极端恐怖，足以让人精神崩溃的生物。这两个世界在整个游戏中时有交替，让人无法真正分清楚哪是现实，哪是虚幻，而正是这有深度的剧情和厚重的文化底蕴也让本作变得更有吸引力。"
    },
    7: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/672e9073-a8ec-4607-9d53-72b9b5774069.jpg",
        text: "《传说之下》（Undertale）是由Toby Fox开发并发行的角色扮演游戏，于2015年9月15日发布，游戏平台为PC。《传说之下》的游戏中，玩家扮演一名落入地下怪物世界的少年，需要找到回家的路，否则便会永远困在此处。虽然玩家可以和怪兽搏斗，但是完全可以避免所有战斗。这取决于玩家是否采取和平主义的游戏态度。"
    },
    8: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/0d3f71a1-678b-474b-8a4a-29722e5e82e9.jpg",
        text: "《巫师3：狂猎》（The Witcher 3: Wild Hunt）是由CD Projekt RED制作，WB Games（北美地区）、Spike Chunsoft（日本地区）发行的动作角色扮演类游戏，于2015年5月19日在Windows、Playstation 4、Xbox One平台发行，2019年10月13日登录Nintendo Switch平台。其次世代版本于2022年12月14日推出，登陆PC、PS5和XSX|S平台，附带《石之心》和《血与酒》两部DLC。游戏以第三人称视角进行，玩家扮演狩魔猎人杰洛特，用剑和魔法来抵御在奇幻世界中遇到的危险，同时完成故事的主线与支线任务以推动剧情发展。游戏以即时类战斗为基础，游戏角色需要根据不同的敌人制定相应的应对策略。"
    },
    9: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/eba13de3-a2d7-4351-8250-d4ad0a292421.jpg",
        text: "《饥荒》是加拿大公司Klei Entertainment开发的一款动作冒险类求生单机游戏。在2013年4月23日发行。《饥荒》的故事讲述的是关于一名科学家被恶魔传送到了异世界荒野，他必需用本人的聪慧在残酷的野外环境中求生。游戏操作简单，并且拥有黑暗和超自然的卡通美术风格，玩家在游戏中不会有任何明显的操作提示，方便大家体验探索的乐趣。"
    },
    10: {
        img: "https://zongshe.oss-cn-beijing.aliyuncs.com/3f2917d2-9cc1-4cf7-b799-b9f2d65e7dc8.jpg",
        text: "《模拟人生4》（The Sims 4）是由The Sim Studio、EA制作发行的一款模拟经营类游戏，是《模拟人生》系列的第四代作品。游戏于2014年9月2日发行在PC端，2017年11月14日发行在PS4和XboxOne。《模拟人生4》游戏中玩家可以获得离线经验，打造个性化的世界，同时游戏将提供分享功能，把自己的模拟人生快速分享给朋友。玩家可以随喜好捏出各种模拟市民，每个人都有独特的外貌、性格和抱负。还可以利用\"建造模式\"为模拟市民设计家园布局，选择家居陈设，改变周围风景等等"
    }
};

// 游戏详情展示函数
function showGameDetail(gameId) {
    const detail = gameDetails[gameId];
    if (detail) {
        const imgElement = document.getElementById("img");
        const textElement = document.getElementById("text");

        // 添加淡出效果
        imgElement.style.opacity = 0;
        textElement.style.opacity = 0;

        setTimeout(() => {
            imgElement.src = detail.img;
            textElement.innerHTML = detail.text;

            // 添加淡入效果
            imgElement.style.opacity = 1;
            textElement.style.opacity = 1;
        }, 300);
    }
}

// 为每个展示函数创建对应的调用
function show1() { showGameDetail(1); }
function show2() { showGameDetail(2); }
function show3() { showGameDetail(3); }
function show4() { showGameDetail(4); }
function show5() { showGameDetail(5); }
function show6() { showGameDetail(6); }
function show7() { showGameDetail(7); }
function show8() { showGameDetail(8); }
function show9() { showGameDetail(9); }
function show10() { showGameDetail(10); }

// 游戏类型和API地址映射
const gameTypes = {
    '休闲益智': 'http://47.109.22.23:8082/listgamebytype?type=休闲益智',
    '体育运动': 'http://47.109.22.23:8082/listgamebytype?type=体育运动',
    '养成游戏': 'http://47.109.22.23:8082/listgamebytype?type=养成游戏',
    '冒险游戏': 'http://47.109.22.23:8082/listgamebytype?type=冒险游戏',
    '动作游戏': 'http://47.109.22.23:8082/listgamebytype?type=动作游戏',
    '即时战略': 'http://47.109.22.23:8082/listgamebytype?type=即时战略',
    '射击游戏': 'http://47.109.22.23:8082/listgamebytype?type=射击游戏',
    '恋爱养成': 'http://47.109.22.23:8082/listgamebytype?type=恋爱养成',
    '格斗游戏': 'http://47.109.22.23:8082/listgamebytype?type=格斗游戏',
    '桌面棋牌': 'http://47.109.22.23:8082/listgamebytype?type=桌面棋牌',
    '模拟经营': 'http://47.109.22.23:8082/listgamebytype?type=模拟经营',
    '策略游戏': 'http://47.109.22.23:8082/listgamebytype?type=策略游戏',
    '网络游戏': 'http://47.109.22.23:8082/listgamebytype?type=网络游戏',
    '角色扮演': 'http://47.109.22.23:8082/listgamebytype?type=角色扮演',
    '赛车游戏': 'http://47.109.22.23:8082/listgamebytype?type=赛车游戏',
    '音乐游戏': 'http://47.109.22.23:8082/listgamebytype?type=音乐游戏',
    '飞行射击': 'http://47.109.22.23:8082/listgamebytype?type=飞行射击',
    '其他游戏': 'http://47.109.22.23:8082/listgamebytype?type=其他游戏'
};

// 当前选中的游戏类型
let currentGameType = '休闲益智';
// 图表类型
let currentChartType = 'line';
// ECharts实例
let chartInstance = null;

// 游戏类型选择函数
function selectGameType(type) {
    currentGameType = type;
    // 更新按钮样式
    const buttons = document.querySelectorAll('#gametype .btn');
    buttons.forEach(btn => {
        if (btn.value === type) {
            btn.style.background = 'rgba(100, 255, 218, 0.2)';
            btn.style.color = '#64ffda';
        } else {
            btn.style.background = 'transparent';
            btn.style.color = '#ccd6f6';
        }
    });

    // 重新绘制图表
    drawChart();
}

// 为每个类型函数创建对应的调用
function type1() { selectGameType('休闲益智'); }
function type2() { selectGameType('体育运动'); }
function type3() { selectGameType('养成游戏'); }
function type4() { selectGameType('冒险游戏'); }
function type5() { selectGameType('动作游戏'); }
function type6() { selectGameType('即时战略'); }
function type7() { selectGameType('射击游戏'); }
function type8() { selectGameType('恋爱养成'); }
function type9() { selectGameType('格斗游戏'); }
function type10() { selectGameType('桌面棋牌'); }
function type11() { selectGameType('模拟经营'); }
function type12() { selectGameType('策略游戏'); }
function type13() { selectGameType('网络游戏'); }
function type14() { selectGameType('角色扮演'); }
function type15() { selectGameType('赛车游戏'); }
function type16() { selectGameType('音乐游戏'); }
function type17() { selectGameType('飞行射击'); }
function type18() { selectGameType('其他游戏'); }

// 图表类型切换函数
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
        lineBtn.style.background = 'rgba(100, 255, 218, 0.3)';
        lineBtn.style.boxShadow = '0 5px 15px rgba(100, 255, 218, 0.3)';
        barBtn.style.background = 'rgba(100, 255, 218, 0.1)';
        barBtn.style.boxShadow = 'none';
    } else {
        barBtn.style.background = 'rgba(100, 255, 218, 0.3)';
        barBtn.style.boxShadow = '0 5px 15px rgba(100, 255, 218, 0.3)';
        lineBtn.style.background = 'rgba(100, 255, 218, 0.1)';
        lineBtn.style.boxShadow = 'none';
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
                type: 'shadow',
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
            name: '数量',
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
            text: `${currentGameType}游戏数据统计`,
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
            name: '游戏数量'
        },
        series: [{
            name: '游戏数量',
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
            text: `${currentGameType}游戏数据统计`,
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
            name: '游戏数量'
        },
        series: [{
            name: '游戏数量',
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
    const apiUrl = gameTypes[currentGameType];

    // 显示加载动画
    const chart = initChart();
    chart.showLoading({
        text: '加载数据中...',
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
                        text: '暂无数据',
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
                    text: '数据加载失败，请重试',
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
    // 为图片和文本添加过渡效果
    const imgElement = document.getElementById("img");
    const textElement = document.getElementById("text");

    imgElement.style.transition = "opacity 0.3s ease";
    textElement.style.transition = "opacity 0.3s ease";

    // 设置默认选中的游戏类型
    selectGameType('休闲益智');

    // 设置默认图表类型
    updateChartButtons();

    // 初始化图表
    drawChart();
});
