const index = require('../config/pinecone');
const openai = require('../config/openai');

async function upsertDocumentChunk(chunkId, text, documentId, documentTitle) {
  try {
    console.log(`📌 Creating embedding for chunk: ${chunkId}`);

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 1024,
    });

    const vector = embeddingResponse.data[0].embedding;

    await index.upsert([
      {
        id: chunkId,
        values: vector,
        metadata: {
          text: text,
          documentId: documentId,
          documentTitle: documentTitle
        },
      },
    ]);

    console.log(`✅ Upserted chunk ID: ${chunkId} (Document: ${documentTitle})`);
  } catch (error) {
    console.error('Vector upsert error:', error);
    throw error;
  }
}

module.exports = { upsertDocumentChunk };



