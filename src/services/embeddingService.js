const openai = require('../config/openai');
const { getEmbeddingFromCache, saveEmbeddingToCache } = require('../utils/embeddingCache');

exports.getQueryEmbedding = async (query) => {
  console.log('Checking embedding cache...');
  const cached = getEmbeddingFromCache(query);
  if (cached) {
    console.log('✅ Cache hit for query embedding.');
    return cached;
  }

  console.log('❌ Cache miss. Calling OpenAI for embedding...');
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    dimensions: 1024,
  });

  const embedding = embeddingResponse.data[0].embedding;
  saveEmbeddingToCache(query, embedding);
  return embedding;
};
