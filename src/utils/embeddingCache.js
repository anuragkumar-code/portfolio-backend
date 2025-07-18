const embeddingCache = new Map();

exports.getEmbeddingFromCache = (query) => {
  return embeddingCache.get(query);
};

exports.saveEmbeddingToCache = (query, embedding) => {
  embeddingCache.set(query, embedding);
};
