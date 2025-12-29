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
let currentGameType = "休闲益智";
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const currentTypeElement = document.getElementById('current-type').querySelector('span');

// 设置画布尺寸
canvas1.width = 400;
canvas1.height = 300;
canvas2.width = 400;
canvas2.height = 300;

// 年份选择器初始化
const yearSelect1 = document.getElementById('year1');
const yearSelect2 = document.getElementById('year2');

// 生成年份选项
for (let year = 2005; year <= 2024; year++) {
    const option1 = document.createElement('option');
    option1.value = year;
    option1.textContent = year;
    yearSelect1.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = year;
    option2.textContent = year;
    yearSelect2.appendChild(option2);
}

// 设置默认年份
yearSelect1.value = 2005;
yearSelect2.value = 2005;

// 颜色生成函数
function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// 绘制饼图函数
function drawPieChart(ctx, width, height, data, type) {
    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制加载提示
    ctx.fillStyle = '#64ffda';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('正在加载数据...', width / 2, height / 2);

    // 获取数据并绘制饼图
    const apiUrl = `http://47.109.22.23:8082/proportion?year=${data.year}`;

    axios.get(apiUrl)
        .then(response => {
            const apiData = response.data;

            // 查找当前游戏类型的数据
            let targetData = null;
            for (let i = 0; i < apiData.data.length; i++) {
                if (apiData.data[i][0] === type) {
                    targetData = apiData.data[i];
                    break;
                }
            }

            // 如果没有找到数据，显示提示
            if (!targetData) {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#ff6b6b';
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('未找到相关数据', width / 2, height / 2);
                return;
            }

            // 清除画布并绘制饼图
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.4;

            // 绘制当前类型部分
            const targetPercentage = targetData[1];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * targetPercentage);
            ctx.closePath();
            ctx.fillStyle = '#64ffda';
            ctx.fill();

            // 绘制其他类型部分
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, -Math.PI / 2 + 2 * Math.PI * targetPercentage, -Math.PI / 2 + 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = 'rgba(100, 255, 218, 0.3)';
            ctx.fill();

            // 绘制图例
            const legendX = centerX - radius - 20;
            const legendY = centerY - radius - 20;

            // 当前类型图例
            ctx.fillStyle = '#64ffda';
            ctx.fillRect(legendX, legendY, 20, 20);
            ctx.fillStyle = '#ccd6f6';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${type}: ${(targetPercentage * 100).toFixed(1)}%`, legendX + 30, legendY + 15);

            // 其他类型图例
            ctx.fillStyle = 'rgba(100, 255, 218, 0.3)';
            ctx.fillRect(legendX, legendY + 30, 20, 20);
            ctx.fillStyle = '#ccd6f6';
            ctx.fillText(`其他类型: ${((1 - targetPercentage) * 100).toFixed(1)}%`, legendX + 30, legendY + 45);

            // 添加标题
            ctx.fillStyle = '#64ffda';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${data.year}年 ${type}发布情况`, centerX, centerY + radius + 30);
        })
        .catch(error => {
            console.error(error);
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#ff6b6b';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('数据加载失败，请重试', width / 2, height / 2);
        });
}

// 更新饼图函数
function updatePieCharts() {
    const year1 = parseInt(yearSelect1.value);
    const year2 = parseInt(yearSelect2.value);

    drawPieChart(ctx1, canvas1.width, canvas1.height, { year: year1 }, currentGameType);
    drawPieChart(ctx2, canvas2.width, canvas2.height, { year: year2 }, currentGameType);
}

// 游戏类型选择
function selectGameType(type) {
    currentGameType = type;
    currentTypeElement.textContent = type;

    // 更新按钮样式
    const buttons = document.querySelectorAll('.type-btn');
    buttons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 更新图表
    updatePieCharts();
}

// 为类型按钮添加事件监听
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectGameType(btn.dataset.type);
    });
});

// 为年份选择器添加事件监听
yearSelect1.addEventListener('change', updatePieCharts);
yearSelect2.addEventListener('change', updatePieCharts);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化星空背景
    // 已在文件开头执行

    // 设置默认游戏类型
    selectGameType('休闲益智');

    setTimeout(() => {
        // 为游戏类型按钮添加动画
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('animated');
            }, 200 + index * 30);
        });
    }, 100);

    // 初始化饼图
    updatePieCharts();
});