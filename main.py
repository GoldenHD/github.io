from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import pandas as pd
from typing import List, Optional, Dict, Any
from datetime import datetime
from io import BytesIO, StringIO
from fastapi.responses import JSONResponse, FileResponse
from contextlib import asynccontextmanager 
import numpy as np

# -------------------------- 【配置中心】 --------------------------
DATA_CONFIG = {
    "data_dir": "./game_data",      # 游戏类型CSV存放目录
    "supported_ext": [".csv"],      # 支持的文件格式
    "exclude_files": ["README.md", ".DS_Store"], 
    "default_unit": "款",           # 默认单位
    "abnormal_threshold": 0.2,      # 异常值波动阈值（±20%）
    # 模糊匹配词库：只要CSV列名包含以下词条（不区分大小写），就能自动识别
    "keywords_year": ["年份", "年度", "年", "year", "date", "time"],
    "keywords_value": ["数量", "游戏数量", "款数", "数值", "count", "number", "value", "val"]
}

load_dotenv()
API_CONFIG = {
    "doubao_api_url": os.getenv("DOUBAO_API_URL"),
    "doubao_model": os.getenv("DOUBAO_MODEL"),
    "doubao_token": os.getenv("DOUBAO_TOKEN"),
    "service_host": "0.0.0.0",
    "service_port": 8000
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行逻辑
    global GAME_DATA_DF
    GAME_DATA_DF = load_game_data()
    if GAME_DATA_DF.empty:
        print("🚨 警告：未发现有效数据文件，请检查 game_data 目录！")
    yield
    # 这里可以放程序关闭时的逻辑（目前不需要）


app = FastAPI(
    title="游戏类型数据AI解读平台", 
    description="自动读取CSV并进行AI分析",
    lifespan=lifespan  # 添加这一行
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------- 全局变量 --------------------------
GAME_DATA_DF: pd.DataFrame = None 
CONVERSATION_HISTORY: Dict[str, List[Dict]] = {} 

FAST_QUESTIONS = {
    "trend_overview": "总结所有游戏类型的年度数量趋势",
    "abnormal_values": "识别所有游戏类型中数量波动超±20%的年份并分析原因",
    "max_year": "找出各游戏类型数量最多的年份",
    "predict_analysis": "基于历史数据，分析各游戏类型数量变化的合理性"
}

# -------------------------- 核心工具函数 --------------------------
def load_game_data() -> pd.DataFrame:
    """
    鲁棒性加载：自动识别CSV列名，清洗并标记异常值
    """
    if not os.path.exists(DATA_CONFIG["data_dir"]):
        os.makedirs(DATA_CONFIG["data_dir"])
        print(f"提示：目录 {DATA_CONFIG['data_dir']} 已创建，请放入CSV文件")
        return pd.DataFrame()
    
    all_dfs = []
    
    for filename in os.listdir(DATA_CONFIG["data_dir"]):
        if filename in DATA_CONFIG["exclude_files"] or not filename.endswith(".csv"):
            continue
        
        file_path = os.path.join(DATA_CONFIG["data_dir"], filename)
        game_type = os.path.splitext(filename)[0]
        
        try:
            # 1. 读取CSV并清理列名空格
            df = pd.read_csv(file_path, encoding="utf-8")
            df.columns = [c.strip() for c in df.columns]
            
            # 2. 自动识别年份列和数值列
            found_year_col = None
            found_value_col = None
            
            for col in df.columns:
                col_lower = col.lower()
                if col_lower in DATA_CONFIG["keywords_year"]:
                    found_year_col = col
                if col_lower in DATA_CONFIG["keywords_value"]:
                    found_value_col = col
            
            if not found_year_col or not found_value_col:
                print(f"⚠️ 跳过文件 {filename}: 找不到识别的列名。当前列名: {list(df.columns)}")
                continue

            # 3. 标准化列名
            df = df.rename(columns={found_year_col: "year", found_value_col: "value"})
            
            # 4. 类型转换与清洗
            df["year"] = pd.to_numeric(df["year"], errors="coerce")
            df["value"] = pd.to_numeric(df["value"], errors="coerce")
            df = df.dropna(subset=["year", "value"])
            df["year"] = df["year"].astype(int)
            df = df.sort_values("year")

            # 5. 补充元数据
            df["category"] = game_type
            df["unit"] = DATA_CONFIG["default_unit"]
            df["is_abnormal"] = False
            df["abnormal_note"] = ""

            # 6. 计算波动异常值
           # 我们对数值加1处理，防止遇到0时无法计算 log
            df['log_growth'] = np.log((df['value'] + 1) / (df['value'].shift(1) + 1))
            window_size = 5
            df['rolling_mean'] = df['log_growth'].rolling(window=window_size, min_periods=2).mean()
            df['rolling_std'] = df['log_growth'].rolling(window=window_size, min_periods=2).std()
            
            df['z_score'] = (df['log_growth'] - df['rolling_mean']) / df['rolling_std'].replace(0, 0.01)


            for i in range(1, len(df)):
                row = df.iloc[i]
                z = row['z_score']
                log_r = row['log_growth']
                
                # --- 判定标准 ---
                # 判定条件：Z-Score 绝对值大于 2.0（统计学上的显著差异）
                # 或者是极端情况：增长率绝对值超过了预设的基础阈值（双重保险）
                actual_change = np.exp(log_r) - 1 # 还原回普通增长率百分比
                
                is_stat_abnormal = abs(z) > 2.0 if not np.isnan(z) else False
                is_fixed_abnormal = abs(actual_change) > DATA_CONFIG["abnormal_threshold"]
                
                if is_stat_abnormal or is_fixed_abnormal:
                    idx = df.index[i]
                    df.at[idx, "is_abnormal"] = True
                    severity = "显著" if abs(z) > 3 else "中度"
                    df.at[idx, "abnormal_note"] = (
                        f"{severity}偏离历史趋势(Z={z:.2f}), "
                        f"实际波动{actual_change*100:.1f}%"
                    )
            
            # 清理中间计算列（可选，建议保留供AI参考）
            # df = df.drop(columns=['log_growth', 'rolling_mean', 'rolling_std', 'z_score'])
            
            all_dfs.append(df)
            print(f"✅ 成功加载并完成统计建模: {filename} ({len(df)}条数据)")
            
            all_dfs.append(df)
            print(f"✅ 成功加载: {filename} ({len(df)}条数据)")
            
        except Exception as e:
            print(f"❌ 处理文件 {filename} 失败: {str(e)}")

    if not all_dfs:
        return pd.DataFrame()
    
    return pd.concat(all_dfs, ignore_index=True)

def format_game_data_for_ai(df: pd.DataFrame, filter_params: Dict = None) -> tuple[str, pd.DataFrame]:
    """格式化数据并注入行业深度分析指令"""
    if df.empty:
        return "当前无可用数据。", df
        
    filtered_df = df.copy()
    if filter_params:
        if filter_params.get("category"):
            filtered_df = filtered_df[filtered_df["category"].isin(filter_params["category"])]
        if filter_params.get("year_range"):
            yr = filter_params["year_range"]
            filtered_df = filtered_df[(filtered_df["year"] >= yr[0]) & (filtered_df["year"] <= yr[1])]
    
    # 构造更详细的上下文
    data_text = "### 游戏行业原始数据概览\n"
    data_text += "（注：2024年及以前为历史统计数据，2025年及以后为基于AI算法的市场预测值）\n"
    
    for game_type in filtered_df["category"].unique():
        type_df = filtered_df[filtered_df["category"] == game_type].sort_values("year")
        data_text += f"\n#### 类型名称：{game_type}\n"
        for _, row in type_df.iterrows():
            tag = "【预测】" if row["year"] >= 2025 else "【实测】"
            note = f" (波动说明: {row['abnormal_note']})" if row["is_abnormal"] else ""
            data_text += f"- {row['year']}年: {row['value']} {row['unit']} {tag}{note}\n"
    
    # --- 注入灵魂：重新定义分析规则 ---
    data_text += """
### 深度分析任务要求（必须按此结构回复）：

1. **类型画像与市场定义**：
   - 首先简要解释所选游戏类型（如RPG, Roguelike等）的核心特征及其在当前全球市场中的地位。
   
2. **数据趋势深度解读**：
   - 结合历史数据分析该类型的成长期、高峰期。
   - 特别关注2025年后的【预测数据】，分析其增长或衰退背后的技术（如AI辅助生成内容）、硬件（如VR/掌机）或受众口味的变化。

3. **市场影响分析**：
   - 这些数据的波动对中小开发者和头部厂商分别意味着什么？
   - 市场是趋于饱和还是存在蓝海？

4. **战略级研发建议**：
   - 如果我要在2025-2026年立项，该类型的切入点在哪里？
   - 在玩法创新、叙事、美术风格或商业模式（如订阅制、内购）上有什么具体建议？

5. **特别提醒**：
   - 所有的建议必须紧扣提供的数值趋势。如果预测数值在下降，必须给出风险预警；如果数值上升，需给出扩张建议。
   - 语气要求专业、前瞻且富有逻辑，禁止单纯复述数字。
"""
    return data_text, filtered_df

def get_chart_data(df: pd.DataFrame) -> Dict[str, Any]:
    """提取给前端绘图的数据结构"""
    trend = {}
    for gt in df["category"].unique():
        type_df = df[df["category"] == gt].sort_values("year")
        trend[gt] = type_df[["year", "value", "is_abnormal"]].to_dict("records")
    
    abnormal = df[df["is_abnormal"]][["category", "year", "value", "abnormal_note"]].to_dict("records")
    return {"trend": trend, "abnormal": abnormal}

# -------------------------- 请求/响应模型 --------------------------
class QueryRequest(BaseModel):
    user_question: str
    temperature: float = 0.1
    user_id: str = "default_user"
    category: Optional[List[str]] = None
    year_range: Optional[List[int]] = None

class QueryResponse(BaseModel):
    answer: str
    chart_data: Dict[str, Any]
    abnormal_values: List[Dict]
    conversation_history: List[Dict]
    game_types: List[str]

# -------------------------- API 路由 --------------------------
@app.post("/api/game/data/query", response_model=QueryResponse)
async def game_data_query(request: QueryRequest):
    if GAME_DATA_DF is None or GAME_DATA_DF.empty:
        raise HTTPException(status_code=400, detail="本地数据文件为空，请先放入CSV文件。")

    # 1. 生成AI上下文
    filter_params = {"category": request.category, "year_range": request.year_range}
    ai_context, filtered_df = format_game_data_for_ai(GAME_DATA_DF, filter_params)
    
    # 2. 对话历史处理
    if request.user_id not in CONVERSATION_HISTORY:
        CONVERSATION_HISTORY[request.user_id] = []
    history = CONVERSATION_HISTORY[request.user_id]
    history_text = "\n".join([f"问:{h['user']}\n答:{h['ai']}" for h in history[-5:]])

    # 3. 构建Prompt
    final_prompt = f"{ai_context}\n\n[历史对话]\n{history_text}\n\n[当前提问]\n{request.user_question}"

    # 4. 调用大模型
    try:
        headers = {"Authorization": f"Bearer {API_CONFIG['doubao_token']}", "Content-Type": "application/json"}
        payload = {
            "model": API_CONFIG["doubao_model"],
            "messages": [
                {"role": "system", "content": "你是一个严谨的游戏行业数据分析师。"},
                {"role": "user", "content": final_prompt}
            ],
            "temperature": request.temperature
        }
        res = requests.post(API_CONFIG["doubao_api_url"], headers=headers, json=payload, timeout=60)
        res.raise_for_status()
        answer = res.json()["choices"][0]["message"]["content"]
        
        # 5. 更新历史
        new_history = {"user": request.user_question, "ai": answer, "time": datetime.now().strftime("%H:%M:%S")}
        CONVERSATION_HISTORY[request.user_id].append(new_history)
        
        # 6. 准备返回数据
        chart_info = get_chart_data(filtered_df)
        return QueryResponse(
            answer=answer,
            chart_data=chart_info["trend"],
            abnormal_values=chart_info["abnormal"],
            conversation_history=CONVERSATION_HISTORY[request.user_id],
            game_types=GAME_DATA_DF["category"].unique().tolist()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI调用或数据处理失败: {str(e)}")

@app.get("/api/game/data/fast_questions")
async def get_fast_questions():
    return [{"key": k, "question": v} for k, v in FAST_QUESTIONS.items()]

@app.get("/api/game/data/overview")
async def get_data_overview():
    """获取初始数据：用于前端加载游戏类型列表和初始图表"""
    if GAME_DATA_DF is None or GAME_DATA_DF.empty:
        return {"game_types": [], "chart_data": {}, "answer": "暂无数据"}
    
    # 默认展示前5个类型的趋势作为初始图表
    initial_types = GAME_DATA_DF["category"].unique().tolist()[:5]
    filtered_df = GAME_DATA_DF[GAME_DATA_DF["category"].isin(initial_types)]
    
    chart_info = get_chart_data(filtered_df)
    return {
        "game_types": GAME_DATA_DF["category"].unique().tolist(),
        "chart_data": chart_info["trend"],
        "answer": "请在左侧选择游戏类型并输入问题进行分析。"
    }

@app.get("/api/game/data/export")
async def export_data(user_id: str = "default_user", format_type: str = "csv"):
    if format_type == "csv":
        csv_buffer = StringIO()
        GAME_DATA_DF.to_csv(csv_buffer, index=False, encoding="utf-8-sig")
        return FileResponse(
            BytesIO(csv_buffer.getvalue().encode("utf-8-sig")),
            media_type="text/csv",
            filename=f"game_data_export_{datetime.now().strftime('%Y%m%d')}.csv"
        )
    return {"msg": "目前仅支持导出CSV格式"}

@app.get("/api/game/data/clear_history")
async def clear_history(user_id: str = "default_user"):
    CONVERSATION_HISTORY[user_id] = []
    return {"msg": "已清空对话记录"}

@app.post("/api/game/data/chart_only")
async def get_chart_only(request: dict):
    """专门用于更新图表的接口，不触发AI"""
    categories = request.get("categories")
    
    if not categories:
        # 如果没选，默认展示前5个
        initial_types = GAME_DATA_DF["category"].unique().tolist()[:5]
        filtered_df = GAME_DATA_DF[GAME_DATA_DF["category"].isin(initial_types)]
    else:
        filtered_df = GAME_DATA_DF[GAME_DATA_DF["category"].isin(categories)]
    
    chart_info = get_chart_data(filtered_df)
    return {"chart_data": chart_info["trend"]}

# -------------------------- 启动入口 --------------------------
if __name__ == "__main__":
    import uvicorn
    # 自动识别端口（如有环境变量）
    port = int(API_CONFIG["service_port"])
    uvicorn.run(app, host=API_CONFIG["service_host"], port=port)