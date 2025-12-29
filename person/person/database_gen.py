import pandas as pd
import random

def generate():
    # 维度定义（全部统一为中文）
    regions = ['北京', '上海', '广东', '成都', '武汉', '杭州', '西安']
    genders = ['男', '女', '隐私保密']
    roles = ['大学生', '职场新人', '资深极客', '全职家长', '自由职业者', '中学生']
    interests = ['二次元', '硬核技术', '国风文化', '赛博朋克', '萌系治愈', '历史考据', '竞技对抗']
    
    # 1. 按照你提供的映射表定义 42 个中文游戏类型
    type_mapping = {
        "automation": "自动化", "building": "建造", "card game": "卡牌游戏", "combat": "战斗",
        "crafting": "合成工艺", "crpg": "电脑角色扮演", "cute": "可爱", "driving": "驾驶",
        "early access": "抢先体验", "fantasy": "奇幻", "pixel graphics": "像素图形",
        "platformer": "平台动作", "sexual content": "成人内容", "shooter": "射击",
        "simulation": "模拟", "souls-like": "类魂", "sports": "体育", "stealth": "潜行",
        "story rich": "剧情丰富", "war": "战争", "action": "动作", "adventure": "冒险",
        "rpg": "角色扮演", "strategy": "策略", "horror": "恐怖", "survival": "生存",
        "open world": "开放世界", "visual novel": "视觉小说", "roguelike": "肉鸽(Roguelike)",
        "management": "经营管理", "2d": "2D游戏", "2.5d": "2.5D游戏", "tactical": "战术",
        "turn-based": "回合制", "sandbox": "沙盒", "fighting": "格斗", "mmorpg": "多人在线联机",
        "jrpg": "日系RPG", "fps": "第一人称射击", "puzzle": "益智", "realistic": "写实", "anime": "动漫"
    }
    
    all_chinese_types = list(type_mapping.values())

    # 2. 定义画像倾向（使用中文特征）
    archetypes = {
        "硬核倾向": {"gender": "男", "role": "资深极客", "interest": "硬核技术"},
        "ACG二次元": {"gender": "女", "region": "上海", "interest": "二次元"},
        "竞技倾向": {"gender": "男", "region": "广东", "interest": "竞技对抗"},
        "女性向/可爱": {"gender": "女", "role": "职场新人", "interest": "萌系治愈"},
        "传统文化": {"region": "西安", "role": "中学生", "interest": "国风文化"},
        "自由派": {"region": "北京", "role": "自由职业者", "interest": "赛博朋克"},
        "家庭用户": {"role": "全职家长", "region": "杭州", "interest": "历史考据"}
    }

    # 给 42 个中文类型分配倾向模板
    type_profiles = {}
    archetype_keys = list(archetypes.keys())
    for i, g_type in enumerate(all_chinese_types):
        type_profiles[g_type] = archetypes[archetype_keys[i % len(archetype_keys)]]

    data = []
    for _ in range(3000): # 增加样本量使雷达图更显著
        g_type = random.choice(all_chinese_types)
        profile = type_profiles[g_type]
        
        row = {
            "user_id": f"U{random.randint(1000, 9999)}",
            "gender": random.choice(genders),
            "region": random.choice(regions),
            "role": random.choice(roles),
            "interest": random.choice(interests),
            "played_type": g_type # 此时存入的是中文
        }
        
        # 80% 概率注入偏见数据
        if random.random() < 0.8:
            for k, v in profile.items():
                row[k] = v
        data.append(row)

    pd.DataFrame(data).to_csv("user_data.csv", index=False, encoding='utf-8-sig')
    print(f"✅ 全中文数据库已生成，包含 {len(all_chinese_types)} 个游戏类型特征数据。")

if __name__ == "__main__":
    generate()