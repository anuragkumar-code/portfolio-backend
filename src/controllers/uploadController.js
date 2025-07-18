const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { upsertDocumentChunk } = require('../services/vectorStoreService');
const { v4: uuidv4 } = require('uuid');

// --- Helper: Semantic Chunking ---
function getSemanticChunks(fullText, maxChunkSize = 1000) {
  const paragraphs = fullText.split(/\n\s*\n/); // Split by paragraph (empty lines)
  const chunks = [];
  let currentChunk = '';

  for (let para of paragraphs) {
    if ((currentChunk + '\n\n' + para).length <= maxChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      if (para.length <= maxChunkSize) {
        currentChunk = para;
      } else {
        // Handle single large paragraph edge case
        for (let i = 0; i < para.length; i += maxChunkSize) {
          chunks.push(para.slice(i, i + maxChunkSize).trim());
        }
        currentChunk = '';
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

// --- Controller: Upload Document ---
exports.uploadDocument = async (req, res) => {
  try {
    const filePath = './info.pdf';  
    const documentTitle = path.basename(filePath);
    const documentId = uuidv4(); 

    console.log(`Processing document: ${documentTitle} (ID: ${documentId})`);

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const chunks = getSemanticChunks(pdfData.text, 1000);
    console.log(`Total semantic chunks for ${documentTitle}: ${chunks.length}`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkId = `${documentId}_chunk_${i}`;
      await upsertDocumentChunk(chunkId, chunks[i], documentId, documentTitle);
      console.log(`✅ Upserted chunk ${i}`);
    }

    res.json({
      message: 'Document uploaded and indexed successfully!',
      documentId,
      documentTitle,
      totalChunks: chunks.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload and index document.' });
  }
};
