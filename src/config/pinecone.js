const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

index.deleteAll = async () => {
  console.log('🔎 Deleting all vectors from namespace: ""');

  await index.namespace('').deleteAll();   // ✅ THIS IS HOW YOU DELETE ALL
};

module.exports = index;
