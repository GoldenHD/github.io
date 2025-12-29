import pandas as pd
import numpy as np
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class PersonaEngine:
    def __init__(self, data_path="user_data.csv"):
        self.df = pd.read_csv(data_path)

    def analyze_link_strength(self, target_type):
        """
        核心算法：挖掘游戏类型与用户信息之间的连接强度
        原理：计算某个特征在特定游戏用户群中的出现频率 / 该特征在全量用户中的背景频率
        """
        type_users = self.df[self.df['played_type'] == target_type]
        if type_users.empty:
            return None

        total_count = len(self.df)
        type_count = len(type_users)
        
        results = {}
        for col in ['gender', 'region', 'role', 'interest']:
            # 计算全量背景分布
            bg_dist = self.df[col].value_counts(normalize=True)
            # 计算目标类型分布
            target_dist = type_users[col].value_counts(normalize=True)
            
            # 计算提升度 (Lift)
            strengths = {}
            for val in target_dist.index:
                lift = target_dist[val] / bg_dist[val]
                strengths[val] = {
                    "count": int(type_users[col].value_counts()[val]),
                    "strength": round(lift, 2)
                }
            
            # 按连接强度排序，取Top 3
            results[col] = sorted(strengths.items(), key=lambda x: x[1]['strength'], reverse=True)[:3]
        
        return results

    def get_ai_persona(self, target_type):
        # 1. 从数据库挖掘关联事实
        stats = self.analyze_link_strength(target_type)
        if not stats:
            return "数据库中未查询到该类型相关的用户连接。"

        # 2. 构造事实 Prompt
        fact_description = f"根据私有数据库挖掘结果，{target_type}类型的核心受众特征如下：\n"
        for dimension, items in stats.items():
            fact_description += f"- {dimension}: " + ", ".join([f"{k}(强度:{v['strength']})" for k, v in items]) + "\n"

        # 3. 调用 AI 进行画像总结
        prompt = f"""
        你是一名资深游戏用户研究员。请基于以下通过算法挖掘出的【真实关联数据】，为“{target_type}”游戏生成一份感性的用户画像报告。
        
        {fact_description}
        
        要求：
        1. 解释这些高强度连接背后的用户心理。
        2. 描述一个典型的“虚拟代表人物”形象（包含姓名、年龄、生活场景）。
        3. 严禁编造数据中未体现的特征。
        """
        
        try:
            headers = {"Authorization": f"Bearer {os.getenv('DOUBAO_TOKEN')}", "Content-Type": "application/json"}
            payload = {
                "model": os.getenv("DOUBAO_MODEL"),
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
            res = requests.post(os.getenv("DOUBAO_API_URL"), headers=headers, json=payload)
            return res.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"AI 总结失败: {str(e)}"

# --- 测试运行 ---
if __name__ == "__main__":
    engine = PersonaEngine()
    print("🚀 正在挖掘『动漫』游戏的用户网络关联...")
    report = engine.get_ai_persona("动漫")
    print("\n--- 自动生成的受众画像报告 ---\n")
    print(report)