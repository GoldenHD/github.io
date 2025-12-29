# semantic_extractor.py
import numpy as np
from sentence_transformers import SentenceTransformer
import umap
from sklearn.cluster import MiniBatchKMeans
from sklearn.feature_extraction.text import TfidfVectorizer

class SemanticTfidfExtractor:
    def __init__(self,
                 model_name='all-MiniLM-L6-v2',
                 n_clusters=5000,
                 n_components=256,
                 random_state=42):
        self.sbert = SentenceTransformer(model_name)
        self.reducer = umap.UMAP(n_components=n_components, metric='cosine', random_state=random_state)
        self.clusterer = MiniBatchKMeans(n_clusters=n_clusters, batch_size=1024, random_state=random_state)
        self.random_state = random_state

    def _build_cluster_repr(self, reviews, labels, top_k=5):
        repr_dict = {}
        unique_labels = np.unique(labels)
        for cid in unique_labels:
            cluster_reviews = [reviews[i] for i in np.where(labels == cid)[0]]
            if not cluster_reviews:
                repr_dict[cid] = [f'cluster_{cid}']
                continue
            try:
                tfidf_vec = TfidfVectorizer(
                    stop_words='english',
                    max_features=1000,
                    ngram_range=(1, 2),
                    lowercase=True
                )
                tfidf_mat = tfidf_vec.fit_transform(cluster_reviews)
                mean_scores = np.mean(tfidf_mat.toarray(), axis=0)
                top_indices = mean_scores.argsort()[-top_k:][::-1]
                feature_names = tfidf_vec.get_feature_names_out()
                top_keywords = [feature_names[idx] for idx in top_indices if mean_scores[idx] > 0]
                repr_dict[cid] = top_keywords if top_keywords else [f'cluster_{cid}']
            except Exception as e:
                print(f"Warning: Failed to extract keywords for cluster {cid}: {e}")
                repr_dict[cid] = [f'cluster_{cid}']
        return repr_dict

    def fit(self, reviews):
        print('① SBERT encoding...')
        embs = self.sbert.encode(reviews, show_progress_bar=True, convert_to_numpy=True)
        print('② UMAP reduction...')
        red = self.reducer.fit_transform(embs)
        print('③ KMeans clustering...')
        labels = self.clusterer.fit_predict(red)
        print('④ Building semantic keyword map per cluster...')
        self.cluster_repr = self._build_cluster_repr(reviews, labels)
        return self

    def extract_keywords(self, reviews, top_n=5):
        embs = self.sbert.encode(reviews, convert_to_numpy=True)
        red = self.reducer.transform(embs)
        labels = self.clusterer.predict(red)
        keywords = []
        for lbl in labels:
            phrases = self.cluster_repr.get(lbl, [f'cluster_{lbl}'])
            keywords.append(phrases[:top_n])
        return keywords