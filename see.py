import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.io as pio

# 设置默认模板
pio.templates.default = "plotly_white"

def main():
    # 加载数据
    df = pd.read_csv('keyword_analysis_ready.csv')
    print(f"Loaded {len(df)} keyword instances.")

    # 确保 year 是整数，过滤异常年份
    df = df[(df['year'] >= 2000) & (df['year'] <= 2025)]

    # 合并 cluster_representative 到简化标签（避免重复）
    df['topic'] = 'Topic ' + df['keyword_cluster_id'].astype(str) + ': ' + df['cluster_representative']

    # -----------------------------
    # 1. Top 20 主题热度
    # -----------------------------
    topic_counts = df['topic'].value_counts().head(20).reset_index()
    topic_counts.columns = ['topic', 'count']
    fig1 = px.bar(
        topic_counts,
        x='count',
        y='topic',
        orientation='h',
        title='Top 20 Most Frequent Keyword Topics',
        labels={'count': 'Frequency', 'topic': 'Topic'},
        color='count',
        color_continuous_scale='Blues'
    )
    fig1.update_layout(yaxis={'categoryorder': 'total ascending'})

    # -----------------------------
    # 2. 好评 vs 差评分布（前15主题）
    # -----------------------------
    top_topics = df['topic'].value_counts().head(15).index
    df_top = df[df['topic'].isin(top_topics)]
    sentiment_dist = df_top.groupby(['topic', 'sentiment']).size().reset_index(name='count')
    sentiment_dist['sentiment_label'] = sentiment_dist['sentiment'].map({1: 'Positive', 0: 'Negative'})

    fig2 = px.bar(
        sentiment_dist,
        x='count',
        y='topic',
        color='sentiment_label',
        orientation='h',
        title='Sentiment Distribution for Top 15 Topics',
        labels={'count': 'Frequency', 'topic': 'Topic'},
        color_discrete_map={'Positive': '#2E8B57', 'Negative': '#DC143C'}
    )
    fig2.update_layout(yaxis={'categoryorder': 'total ascending'})

    # -----------------------------
    # 3. 主题随时间变化（选前5热门主题）
    # -----------------------------
    top5_topics = df['topic'].value_counts().head(5).index
    df_time = df[df['topic'].isin(top5_topics)]
    time_trend = df_time.groupby(['year', 'topic']).size().reset_index(name='count')

    fig3 = px.line(
        time_trend,
        x='year',
        y='count',
        color='topic',
        title='Trend of Top 5 Topics Over Time',
        labels={'count': 'Frequency', 'year': 'Year'},
        markers=True
    )

    # -----------------------------
    # 4. 游戏 × 主题热力图（Top 10 游戏 & Top 10 主题）
    # -----------------------------
    top_games = df['title'].value_counts().head(10).index
    top_topics_10 = df['topic'].value_counts().head(10).index
    df_heat = df[df['title'].isin(top_games) & df['topic'].isin(top_topics_10)]

    heatmap_data = df_heat.groupby(['title', 'topic']).size().unstack(fill_value=0)
    fig4 = px.imshow(
        heatmap_data.T,  # 转置：主题为行，游戏为列
        labels=dict(x="Game Title", y="Topic", color="Frequency"),
        title="Keyword Topic Heatmap: Top 10 Games vs Top 10 Topics",
        aspect="auto",
        color_continuous_scale='YlOrRd'
    )
    fig4.update_xaxes(side="bottom")

    # -----------------------------
    # 合并所有图表到一个 HTML 文件
    # -----------------------------
    from plotly.subplots import make_subplots
    import plotly.graph_objects as go

    # 创建一个包含多个子图的页面（用 tabs 或独立图表）
    # 这里我们直接用单独图表拼接成一个 HTML
    with open("keyword_visualization.html", "w", encoding="utf-8") as f:
        f.write("<html><head><title>Keyword Analysis Dashboard</title></head><body>\n")
        f.write("<h1 style='text-align:center;'>🎮 Game Review Keyword Analysis</h1>\n")
        f.write(fig1.to_html(full_html=False, include_plotlyjs='cdn'))
        f.write(fig2.to_html(full_html=False, include_plotlyjs=False))
        f.write(fig3.to_html(full_html=False, include_plotlyjs=False))
        f.write(fig4.to_html(full_html=False, include_plotlyjs=False))
        f.write("</body></html>")

    print("✅ Visualization saved to keyword_visualization.html")
    print("👉 Open it in your browser to explore interactively!")

if __name__ == '__main__':
    main()