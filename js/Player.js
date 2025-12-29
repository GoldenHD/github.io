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

// 全局变量
let currentChartType = 'line';
let currentCommentType = 'all';

// 初始化函数
function initPage() {
    initGenderCharts();
    initRegionChart();
    initMap();
    initComments();
    initEmotionAnalysis();
    initEventListeners();
}

// 初始化性别分布图表
function initGenderCharts() {
    // 获取性别数据并绘制图表
    axios.get("http://47.109.22.23:8084/proportionbygender")
        .then(response => {
            const data = response.data.data;
            drawGenderBarChart(data);
            drawGenderPieChart(data);
        })
        .catch(error => {
            console.error("获取性别数据失败:", error);
        });
}

// 绘制性别柱状图
function drawGenderBarChart(data) {
    const chartDom = document.getElementById('gender-bar-chart');
    const chart = echarts.init(chartDom);

    const option = {
        backgroundColor: 'transparent',
        title: {
            text: '性别分布柱状图',
            textStyle: {
                color: '#64ffda'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: 'rgba(10, 25, 47, 0.9)',
            borderColor: '#2a5785',
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item[0]),
            axisLabel: {
                color: '#ccd6f6'
            },
            axisLine: {
                lineStyle: {
                    color: '#64ffda'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#ccd6f6',
                formatter: '{value}%'
            },
            axisLine: {
                lineStyle: {
                    color: '#64ffda'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(100, 255, 218, 0.1)'
                }
            }
        },
        series: [{
            data: data.map(item => (item[1] * 100).toFixed(2)),
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#64ffda' },
                    { offset: 1, color: '#0a192f' }
                ])
            },
            label: {
                show: true,
                position: 'top',
                color: '#64ffda',
                formatter: '{c}%'
            }
        }]
    };

    chart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function () {
        chart.resize();
    });
}

// 绘制性别饼图
function drawGenderPieChart(data) {
    const chartDom = document.getElementById('gender-pie-chart');
    const chart = echarts.init(chartDom);

    const option = {
        backgroundColor: 'transparent',
        title: {
            text: '性别分布饼图',
            textStyle: {
                color: '#64ffda'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)',
            backgroundColor: 'rgba(10, 25, 47, 0.9)',
            borderColor: '#2a5785',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: '#ccd6f6'
            }
        },
        series: [
            {
                name: '性别分布',
                type: 'pie',
                radius: '50%',
                data: data.map(item => ({
                    value: (item[1] * 100).toFixed(2),
                    name: item[0],
                    itemStyle: {
                        color: item[0] === '男' ? '#64ffda' : '#ff6b6b'
                    }
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    color: '#ccd6f6',
                    formatter: '{b}: {c}%'
                }
            }
        ]
    };

    chart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function () {
        chart.resize();
    });
}

// 初始化地域分布图表
function initRegionChart() {
    drawRegionChart();
}

// 绘制地域分布图表
function drawRegionChart() {
    const chartDom = document.getElementById('region-chart');
    const chart = echarts.init(chartDom);

    // 获取地域数据
    axios.get("http://47.109.22.23:8084/listplayerbyarea")
        .then(response => {
            const data = response.data.data;

            const option = {
                backgroundColor: 'transparent',
                title: {
                    text: '玩家地域分布',
                    textStyle: {
                        color: '#64ffda'
                    },
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(10, 25, 47, 0.9)',
                    borderColor: '#2a5785',
                    textStyle: {
                        color: '#fff'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item[0]),
                    axisLabel: {
                        color: '#ccd6f6',
                        rotate: 45
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#64ffda'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#ccd6f6'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#64ffda'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(100, 255, 218, 0.1)'
                        }
                    }
                },
                series: [{
                    data: data.map(item => item[1]),
                    type: currentChartType === 'line' ? 'line' : 'bar',
                    smooth: true,
                    itemStyle: {
                        color: '#64ffda'
                    },
                    areaStyle: currentChartType === 'line' ? {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(100, 255, 218, 0.3)' },
                            { offset: 1, color: 'rgba(100, 255, 218, 0.1)' }
                        ])
                    } : undefined,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#64ffda'
                    }
                }]
            };

            chart.setOption(option);

            // 响应式调整
            window.addEventListener('resize', function () {
                chart.resize();
            });
        })
        .catch(error => {
            console.error("获取地域数据失败:", error);
        });
}

// 初始化3D地图
function initMap() {
    const chartDom = document.getElementById('map-container');
    const chart = echarts.init(chartDom);

    // 省份简称到全称的映射
    const provinceMap = {
        上海: "上海市", 云南: "云南省", 内蒙古: "内蒙古自治区", 北京: "北京市",
        吉林: "吉林省", 四川: "四川省", 天津: "天津市", 宁夏: "宁夏回族自治区",
        安徽: "安徽省", 山东: "山东省", 山西: "山西省", 广东: "广东省",
        广西: "广西壮族自治区", 新疆: "新疆维吾尔自治区", 江苏: "江苏省",
        江西: "江西省", 河北: "河北省", 河南: "河南省", 浙江: "浙江省",
        海南: "海南省", 湖北: "湖北省", 湖南: "湖南省", 甘肃: "甘肃省",
        福建: "福建省", 西藏: "西藏自治区", 贵州: "贵州省", 辽宁: "辽宁省",
        重庆: "重庆市", 陕西: "陕西省", 青海: "青海省", 黑龙江: "黑龙江省"
    };

    // 获取玩家数据
    axios.get("http://47.109.22.23:8084/listplayerbyarea")
        .then(response => {
            if (response.data.code === 1) {
                const playerData = response.data.data;

                // 创建省份名称到玩家数量的映射
                const playerMap = {};
                playerData.forEach(item => {
                    const fullName = provinceMap[item[0]] || item[0];
                    playerMap[fullName] = item[1];
                });

                // 准备地图数据
                const mapData = [];

                // 加载GeoJSON数据
                $.get(
                    "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
                    function (geoJson) {
                        // 注册地图
                        echarts.registerMap("china", geoJson, {
                            coordsToLatLng: function (coords) {
                                // 确保所有坐标点都有Z坐标
                                return [coords[0], coords[1], 0];
                            },
                        });

                        // 准备地图数据
                        geoJson.features.forEach((feature) => {
                            const name = feature.properties.name;
                            const value = playerMap[name] || 0;
                            mapData.push({
                                name: name,
                                value: value,
                            });
                        });

                        // 计算最大玩家数量
                        const values = playerData.map((item) => item[1]);
                        const maxValue = Math.max(...values, 1000);

                        // 3. 设置图表选项
                        const option = {
                            backgroundColor: "#0a192f",
                            title: {
                                text: "中国玩家分布热力图",
                                left: "center",
                                textStyle: {
                                    color: "#64ffda",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                },
                            },
                            tooltip: {
                                trigger: "item",
                                backgroundColor: "rgba(10, 25, 47, 0.9)",
                                borderColor: "#2a5785",
                                borderWidth: 1,
                                padding: 10,
                                textStyle: {
                                    color: "#fff",
                                    fontSize: 14,
                                },
                                formatter: (params) => {
                                    const value = params.value || 0;
                                    return `<div style="font-size:16px;font-weight:bold;color:#64ffda">${params.name}</div>
                                            <div style="margin-top:5px">玩家人数: <span style="color:#ffd666;font-size:18px">${value}</span></div>`;
                                },
                            },
                            visualMap: {
                                min: 0,
                                max: maxValue,
                                calculable: true,
                                inRange: {
                                    color: [
                                        "#313695",
                                        "#4575b4",
                                        "#74add1",
                                        "#abd9e9",
                                        "#e0f3f8",
                                        "#ffffbf",
                                        "#fee090",
                                        "#fdae61",
                                        "#f46d43",
                                        "#d73027",
                                        "#a50026",
                                    ],
                                },
                                textStyle: {
                                    color: "#fff",
                                },
                                bottom: 30,
                                left: 30,
                                orient: "horizontal",
                            },
                            series: [
                                {
                                    name: "玩家人数",
                                    type: "map3D",
                                    map: "china",
                                    coordinateSystem: "geo3D", // 关键修复：指定坐标系
                                    data: mapData,

                                    // 3D地图配置
                                    boxDepth: 40, // 地图厚度
                                    regionHeight: 2, // 基础高度

                                    // 修复高度问题
                                    itemStyle: {
                                        areaColor: "#1e3c72",
                                        borderWidth: 1,
                                        borderColor: "#2a5785",
                                        opacity: 0.9,
                                    },

                                    // 悬停效果配置
                                    emphasis: {
                                        label: {
                                            show: true,
                                            textStyle: {
                                                color: "#fff",
                                                fontSize: 14,
                                                backgroundColor: "rgba(0,0,0,0.7)",
                                                padding: [5, 10],
                                                borderRadius: 4,
                                            },
                                        },
                                        itemStyle: {
                                            color: "#ff7c45",
                                            borderColor: "#ffd666",
                                            borderWidth: 2,
                                            opacity: 1,
                                        },
                                    },

                                    // 高度映射
                                    shading: "realistic",
                                    realisticMaterial: {
                                        roughness: 0.8,
                                        metalness: 0,
                                    },
                                    height: function (param) {
                                        // 确保 value 是数字且有默认值
                                        const v = Number(param.value) || 0;
                                        // 放大高度系数
                                        return v * 2 + 2;
                                    },

                                    // 光照配置
                                    light: {
                                        main: {
                                            intensity: 1.5,
                                            shadow: true,
                                            shadowQuality: "high",
                                            alpha: 55,
                                            beta: 10,
                                        },
                                        ambient: {
                                            intensity: 0.8,
                                        },
                                    },

                                    // 视图控制
                                    viewControl: {
                                        projection: "orthographic",
                                        distance: 150,
                                        minDistance: 80,
                                        maxDistance: 300,
                                        alpha: 25,
                                        beta: 40,
                                        rotateSensitivity: 1,
                                        zoomSensitivity: 1,
                                        panSensitivity: 1,
                                    },

                                    // 修复悬停问题
                                    postEffect: {
                                        enable: true,
                                        bloom: {
                                            enable: true,
                                            bloomIntensity: 0.1,
                                        },
                                        SSAO: {
                                            enable: true,
                                            radius: 2,
                                            intensity: 1,
                                        },
                                        depthOfField: {
                                            enable: false,
                                            focalRange: 10,
                                            fstop: 1,
                                            blurRadius: 10,
                                        },
                                    },

                                    // 性能优化
                                    silent: false,
                                    instancing: false,
                                },
                            ],
                        };

                        chart.setOption(option);

                        // 添加窗口调整大小事件
                        window.addEventListener("resize", function () {
                            chart.resize();
                        });
                    }
                ).fail(function () {
                    console.error("加载GeoJSON失败！");
                    chart.setOption({
                        title: {
                            text: "地图数据加载失败",
                            textStyle: { color: "#ff6b6b" },
                        },
                    });
                });
            } else {
                console.error("API错误:", response.data.msg);
            }
        })
        .catch(error => {
            console.error("获取玩家数据失败:", error);
            // 显示错误信息
            chart.setOption({
                title: {
                    text: "数据加载失败",
                    subtext: error.message,
                    textStyle: { color: "#ff6b6b" },
                },
            });
        });
}

// 初始化评论功能
function initComments() {
    fetchComments('all');

    // 为评论类型按钮添加事件监听
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // 更新按钮激活状态
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 获取评论类型
            currentCommentType = this.getAttribute('data-type');
            fetchComments(currentCommentType);
        });
    });
}

// 获取评论
function fetchComments(commentType) {
    let url;
    const commentTypes = [
        "桌面游戏", "二次元游戏", "galgame", "黑神话",
        "单机小游戏", "合家欢游戏", "3A游戏"
    ];

    if (commentType === "all") {
        // 随机选择一个类型
        const randomType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
        url = `http://47.109.22.23:8083/listcomment?commentType=${randomType}`;
    } else {
        url = `http://47.109.22.23:8083/listcomment?commentType=${commentType}`;
    }

    axios.get(url)
        .then(response => {
            const comments = response.data.data || [];
            displayComments(comments);
        })
        .catch(error => {
            console.error("获取评论失败:", error);
        });
}

// 显示评论
function displayComments(comments) {
    const commentContainers = [
        document.getElementById("comment1"),
        document.getElementById("comment2"),
        document.getElementById("comment3")
    ];

    // 清空评论容器
    commentContainers.forEach(container => {
        container.innerHTML = "";
    });

    if (!Array.isArray(comments) || comments.length === 0) {
        commentContainers[0].innerHTML = "<div class='comment-card'><div class='comment-content'>没有评论可显示。</div></div>";
        return;
    }

    // 随机选择三条评论
    const selectedComments = comments.length > 3 ?
        getRandomComments(comments, 3) : comments;

    selectedComments.forEach((comment, index) => {
        if (comment) {
            const commentCard = document.createElement('div');
            commentCard.className = 'comment-card';
            commentCard.innerHTML = `
                <div class="user-info">
                    <div class="avatar">U</div>
                    <span class="username">匿名用户</span>
                </div>
                <div class="comment-content">${comment.commentText || comment}</div>
            `;
            commentContainers[index].appendChild(commentCard);
        }
    });
}

// 获取随机评论
function getRandomComments(comments, count) {
    const shuffled = [...comments].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 初始化情感分析功能
function initEmotionAnalysis() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const inputText = document.getElementById('inputText');
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    const errorMsg = document.getElementById('errorMsg');
    const resultInput = document.getElementById('resultInput');
    const resultTranslated = document.getElementById('resultTranslated');
    const resultSentiment = document.getElementById('resultSentiment');
    const resultTime = document.getElementById('resultTime');
    const sampleBtns = document.querySelectorAll('.sample-btn');

    // 示例文本
    const sampleTexts = [
        "这个产品非常好用，我非常满意它的性能表现！",
        "服务太差了，等了两个小时都没人理我。",
        "The movie was absolutely fantastic, I would definitely recommend it to everyone.",
        "I'm extremely disappointed with the quality of this product, it broke after two days."
    ];

    // 随机选择一个示例文本
    inputText.value = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

    // 设置API地址
    const API_URL = "http://127.0.0.1:6006/api/analyze";

    // 示例按钮点击事件
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            inputText.value = this.getAttribute('data-text');
        });
    });

    // 分析按钮点击事件
    analyzeBtn.addEventListener('click', function () {
        const text = inputText.value.trim();

        // 验证输入
        if (!text) {
            showError('请输入要分析的文本');
            return;
        }

        // 重置状态
        resetUI();
        loading.style.display = 'block';

        // 使用Axios调用API
        axios.post(API_URL, {
            text: text
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const data = response.data;

                // 显示结果
                displayResults(data);
            })
            .catch(error => {
                // 错误处理
                let errorMessage = '情感分析服务暂时不可用';

                if (error.response) {
                    errorMessage = `服务错误: ${error.response.status}`;
                } else if (error.request) {
                    errorMessage = '无法连接到分析服务';
                } else {
                    errorMessage = `请求错误: ${error.message}`;
                }

                showError(errorMessage);
                console.error('API调用错误:', error);
            })
            .finally(() => {
                loading.style.display = 'none';
            });
    });

    // 重置按钮点击事件
    resetBtn.addEventListener('click', function () {
        inputText.value = '';
        resetUI();
        // 重新设置一个随机示例文本
        inputText.value = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    });

    // 显示分析结果
    function displayResults(data) {
        resultInput.textContent = data.input_text;
        resultTranslated.textContent = data.translated_text || "未提供翻译文本";
        resultTime.textContent = data.processing_time;

        // 设置情感结果样式
        resultSentiment.textContent = data.sentiment;
        if (data.sentiment.includes('好评') || data.sentiment.includes('Positive')) {
            resultSentiment.className = 'sentiment-positive';
        } else if (data.sentiment.includes('差评') || data.sentiment.includes('Negative')) {
            resultSentiment.className = 'sentiment-negative';
        } else {
            resultSentiment.className = '';
        }

        resultBox.style.display = 'block';
    }

    // 重置UI状态
    function resetUI() {
        loading.style.display = 'none';
        resultBox.style.display = 'none';
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
    }

    // 显示错误信息
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        resultBox.style.display = 'none';
        loading.style.display = 'none';

        // 5秒后自动隐藏错误信息
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 图表切换按钮
    document.getElementById('switch-line').addEventListener('click', function () {
        currentChartType = 'line';
        updateChartButtons();
        drawRegionChart();
    });

    document.getElementById('switch-bar').addEventListener('click', function () {
        currentChartType = 'bar';
        updateChartButtons();
        drawRegionChart();
    });

    // 情感分析切换按钮
    document.getElementById('emotion-toggle').addEventListener('click', function () {
        const emotionPanel = document.getElementById('emotion-analysis');
        emotionPanel.classList.toggle('expanded');
    });

    // 更新图表按钮状态
    function updateChartButtons() {
        const lineBtn = document.getElementById('switch-line');
        const barBtn = document.getElementById('switch-bar');

        if (currentChartType === 'line') {
            lineBtn.classList.add('active');
            barBtn.classList.remove('active');
        } else {
            barBtn.classList.add('active');
            lineBtn.classList.remove('active');
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        // 为评论列添加动画
        const commentColumns = document.querySelectorAll('.comment-column');
        commentColumns.forEach((column, index) => {
            setTimeout(() => {
                column.classList.add('animated');
            }, 300 + index * 100);
        });

        // 如果情感分析面板是展开的，也添加动画
        const emotionPanel = document.getElementById('emotion-analysis');
        if (emotionPanel.classList.contains('expanded')) {
            emotionPanel.classList.add('animated');
        }
    }, 100);
    initPage();
});
