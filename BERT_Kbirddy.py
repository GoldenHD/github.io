import pandas as pd
import numpy as np
import joblib
from semantic_extractor import SemanticTfidfExtractor
from sentence_transformers import SentenceTransformer
from sklearn.cluster import MiniBatchKMeans
from transformers import AutoTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer
import os

# -----------------------------
# 1. 加载原始数据和关键词提取器
# -----------------------------
def extract_classic_keywords(reviews, top_n=5):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=10000, ngram_range=(1, 2))
    vectorizer.fit(reviews)  # 只需 fit 一次
    tfidf_matrix = vectorizer.transform(reviews)
    feature_names = vectorizer.get_feature_names_out()
    keywords_list = []
    for i in range(len(reviews)):
        scores = tfidf_matrix[i].toarray()[0]
        top_indices = scores.argsort()[-top_n:][::-1]
        keywords = [feature_names[j] for j in top_indices if scores[j] > 0]
        keywords_list.append(keywords)
    return keywords_list

def main():
    # 配置
    train_csv = 'train.csv'
    semantic_model_path = 'semantic_tfidf.pkl'
    output_keyword_csv = 'keyword_analysis_ready.csv'
    keyword_cluster_num = 30  # 最终你想看到的主题数，比如30个核心关注点

    # 加载原始数据
    df = pd.read_csv(train_csv)
    df = df.dropna(subset=['user_review']).reset_index(drop=True)

    reviews = df['user_review'].astype(str).tolist()
    print(f"Loaded {len(reviews)} reviews.")

    # -----------------------------
    # 2. 提取关键词（经典 + 语义）
    # -----------------------------
    # 经典 TF-IDF
    classic_keywords = extract_classic_keywords(reviews, top_n=5)

    # 语义关键词（从已保存模型）
    if not os.path.exists(semantic_model_path):
        raise FileNotFoundError(f"Please run the previous script to generate {semantic_model_path}")
    semantic_extractor = joblib.load('semantic_tfidf.pkl') 
    semantic_keywords = semantic_extractor.extract_keywords(reviews, top_n=5)

    # -----------------------------
    # 3. 构建关键词长表（每关键词一行）
    # -----------------------------
    records = []

    for idx in range(len(reviews)):
        review_id = df.iloc[idx]['review_id']
        title = str(df.iloc[idx]['title'])
        year = int(df.iloc[idx]['year']) if pd.notna(df.iloc[idx]['year']) else -1
        sentiment = int(df.iloc[idx]['user_suggestion'])

        # 经典关键词
        for kw in classic_keywords[idx]:
            records.append({
                'review_id': review_id,
                'title': title,
                'year': year,
                'sentiment': sentiment,
                'keyword': kw.strip().lower(),
                'keyword_type': 'classic'
            })

        # 语义关键词
        for kw in semantic_keywords[idx]:
            # 注意：语义关键词现在已经是短语（如 ['gameplay', 'fun', 'bugs']）
            if isinstance(kw, list):
                for sub_kw in kw:
                    records.append({
                        'review_id': review_id,
                        'title': title,
                        'year': year,
                        'sentiment': sentiment,
                        'keyword': str(sub_kw).strip().lower(),
                        'keyword_type': 'semantic'
                    })
            else:
                records.append({
                    'review_id': review_id,
                    'title': title,
                    'year': year,
                    'sentiment': sentiment,
                    'keyword': str(kw).strip().lower(),
                    'keyword_type': 'semantic'
                })

    keyword_df = pd.DataFrame(records)
    print(f"Generated {len(keyword_df)} keyword instances.")

    # 去除无效关键词
    keyword_df = keyword_df[keyword_df['keyword'].str.len() > 1]
    keyword_df = keyword_df[~keyword_df['keyword'].str.isdigit()]

    # -----------------------------
    # 4. 对唯一关键词做全局语义聚类
    # -----------------------------
    unique_keywords = keyword_df['keyword'].drop_duplicates().tolist()
    print(f"Clustering {len(unique_keywords)} unique keywords...")

    # 使用 Sentence-BERT 编码关键词
    sbert = SentenceTransformer('all-MiniLM-L6-v2')  # 轻量高效
    keyword_embeddings = sbert.encode(unique_keywords, show_progress_bar=True, convert_to_numpy=True)

    # 聚类
    kmeans = MiniBatchKMeans(n_clusters=keyword_cluster_num, random_state=42, batch_size=1024)
    cluster_labels = kmeans.fit_predict(keyword_embeddings)

    # 构建映射：keyword → cluster_id
    keyword_to_cluster = dict(zip(unique_keywords, cluster_labels))

    # 为每一行分配 cluster_id
    keyword_df['keyword_cluster_id'] = keyword_df['keyword'].map(keyword_to_cluster)

    # -----------------------------
    # 5. 保存结果（可视化友好）
    # -----------------------------
    # 可选：为每个 cluster 找一个代表性关键词（用于可视化标签）
    cluster_repr = {}
    for kw, cid in keyword_to_cluster.items():
        if cid not in cluster_repr:
            cluster_repr[cid] = kw  # 第一个遇到的作为代表
    keyword_df['cluster_representative'] = keyword_df['keyword_cluster_id'].map(cluster_repr)

    # 保存
    keyword_df.to_csv(output_keyword_csv, index=False, encoding='utf-8')
    print(f"✅ Final keyword analysis table saved to {output_keyword_csv}")

    # 同时保存 cluster 代表词（方便做图例）
    cluster_summary = pd.DataFrame({
        'keyword_cluster_id': list(cluster_repr.keys()),
        'representative_keyword': list(cluster_repr.values())
    }).sort_values('keyword_cluster_id')
    cluster_summary.to_csv('keyword_cluster_summary.csv', index=False, encoding='utf-8')
    print("✅ Cluster summary saved to keyword_cluster_summary.csv")

if __name__ == '__main__':
    main()