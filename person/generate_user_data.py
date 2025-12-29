import pandas as pd
import random

# 定义维度
regions = ['北京', '上海', '广东', '成都', '武汉', '杭州', '西安']
genders = ['男', '女', '保密']
roles = ['大学生', '职场新人', '资深极客', '全职家长', '自由职业者', '中学生']
interests = ['二次元', '硬核技术', '国风文化', '赛博朋克', '萌系治愈', '历史考据', '竞技对抗']
game_types = ['RPG', 'FPS', '2.5D游戏', '类魂', '肉鸽', '模拟建造', '动漫']

# 生成1000条模拟数据
data = []
for i in range(1000):
    # 模拟一些关联逻辑（让算法能挖出规律）
    # 比如：动漫类型和女性、二次元、上海强关联
    if random.random() > 0.7:
        row = {
            "user_id": f"U{i:04d}",
            "gender": random.choice(['女', '女', '男']),
            "region": random.choice(['上海', '上海', '广东', '北京']),
            "role": random.choice(['大学生', '大学生', '职场新人']),
            "interest": random.choice(['二次元', '萌系治愈']),
            "played_type": '动漫'
        }
    else:
        row = {
            "user_id": f"U{i:04d}",
            "gender": random.choice(genders),
            "region": random.choice(regions),
            "role": random.choice(roles),
            "interest": random.choice(interests),
            "played_type": random.choice(game_types)
        }
    data.append(row)

df = pd.DataFrame(data)
df.to_csv("user_data.csv", index=False, encoding='utf-8-sig')
print("✅ 模拟用户数据库 user_data.csv 已生成")