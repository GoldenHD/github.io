from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from itertools import combinations
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "user_data.csv"

# 固定的维度定义
DIMENSIONS = ['gender', 'region', 'role', 'interest']

@app.get("/api/persona/categories")
async def get_categories():
    """让前端知道有哪些游戏类型可选"""
    if not os.path.exists(DB_PATH): return {"categories": []}
    df = pd.read_csv(DB_PATH)
    return {"categories": sorted(df['played_type'].unique().tolist())}

@app.get("/api/persona/analyze/{game_type}")
async def analyze(game_type: str):
    if not os.path.exists(DB_PATH): raise HTTPException(status_code=500, detail="数据库缺失")
    
    df = pd.read_csv(DB_PATH)
    type_df = df[df['played_type'] == game_type]
    if type_df.empty: raise HTTPException(status_code=404, detail="类型不存在")

    # 1. 建模：寻找理想受众
    ideal_profile = {}
    radar_data = []
    for dim in DIMENSIONS:
        top_val = type_df[dim].mode()[0]
        ideal_profile[dim] = top_val
        rate = len(type_df[type_df[dim] == top_val]) / len(type_df)
        radar_data.append({"name": dim, "value": round(rate * 100, 2), "label": top_val})

    # 2. 关系网络拓扑构建 (神经结构图数据)
    nodes = []
    edges = []
    node_set = set()
    link_map = {}

    # 统计特征共现频率
    for _, row in type_df.iterrows():
        # 获取该用户的所有特征组合
        user_features = [row[d] for d in DIMENSIONS]
        for u, v in combinations(user_features, 2):
            pair = tuple(sorted([u, v]))
            link_map[pair] = link_map.get(pair, 0) + 1
            node_set.add(u)
            node_set.add(v)

    # 转换成 ECharts 格式
    for node_name in node_set:
        # 计算节点大小（出现频率越高，节点越大）
        count = sum([1 for d in DIMENSIONS if (type_df[d] == node_name).any()]) # 简化处理
        nodes.append({
            "id": node_name, 
            "name": node_name, 
            "symbolSize": 10 + (len(type_df[type_df.values == node_name]) / len(type_df) * 50),
            "category": next((i for i, d in enumerate(DIMENSIONS) if (type_df[d] == node_name).any()), 0)
        })

    for (u, v), weight in link_map.items():
        if weight > 1: # 过滤掉偶然连接，只显示有意义的联系
            edges.append({"source": u, "target": v, "value": weight})

    # 3. 真实用户匹配
    def calculate_score(row):
        return sum([1 for dim in DIMENSIONS if row[dim] == ideal_profile[dim]])

    type_df = type_df.copy()
    type_df['match_score'] = type_df.apply(calculate_score, axis=1)
    real_users = type_df.sort_values('match_score', ascending=False).head(5)

    return {
        "radar": radar_data,
        "ideal": ideal_profile,
        "network": {"nodes": nodes, "links": edges},
        "real_users": real_users.to_dict('records'),
        "complexity": len(edges)
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)