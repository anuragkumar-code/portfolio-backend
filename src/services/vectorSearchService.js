const index = require('../config/pinecone');

exports.searchRelevantChunks = async (queryEmbedding) => {
  console.log('Searching Pinecone...');

  const queryResponse = await index.query({
    topK: 30,  // Increased topK for better multi-doc scoring
    vector: queryEmbedding,
    includeMetadata: true,
  });

  const matches = queryResponse.matches || [];
  console.log('Pinecone query result count:', matches.length);

  // Group matches by documentId
  const groupedByDocument = {};

  for (const match of matches) {
    const docId = match.metadata?.documentId || 'unknown';
    if (!groupedByDocument[docId]) groupedByDocument[docId] = [];
    groupedByDocument[docId].push(match);
  }

  // Calculate document-level scores (average of top 5 chunks per document)
  const docScores = Object.entries(groupedByDocument).map(([docId, docsMatches]) => {
    const topChunks = docsMatches.sort((a, b) => b.score - a.score).slice(0, 5);
    const avgScore = topChunks.reduce((sum, m) => sum + m.score, 0) / topChunks.length;
    return { docId, avgScore, matches: docsMatches };
  });

  // Pick the best document
  const bestDoc = docScores.sort((a, b) => b.avgScore - a.avgScore)[0];
  console.log(`✅ Best document selected: ${bestDoc.docId} (Avg score: ${bestDoc.avgScore.toFixed(3)})`);

  // Now apply threshold and filtering on chunks of selected document
  const HIGH_THRESHOLD = 0.6;
  const LOW_THRESHOLD = 0.3;

  let filteredChunks = bestDoc.matches.filter(m => m.score >= HIGH_THRESHOLD);

  if (filteredChunks.length >= 3) {
    console.log(`✅ Found ${filteredChunks.length} high-confidence chunks in selected document.`);
  } else if (filteredChunks.length >= 1) {
    console.log(`⚠️ Few high-scoring chunks, relaxing to ${LOW_THRESHOLD}`);
    filteredChunks = bestDoc.matches.filter(m => m.score >= LOW_THRESHOLD);
  }

  if (filteredChunks.length < 3) {
    console.log('❌ Very few chunks even after relaxation, taking top 5 chunks from best document');
    filteredChunks = bestDoc.matches.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  const relevantTexts = filteredChunks
    .map(match => match.metadata?.text)
    .filter(Boolean);

  console.log('Final relevant chunks selected:', relevantTexts.length);

  return relevantTexts;
};
