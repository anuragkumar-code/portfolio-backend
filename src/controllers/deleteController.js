const index = require('../config/pinecone');

exports.deleteAllVectors = async (req, res) => {
  try {
    console.log('🧹 Deleting all vectors from Pinecone index...');

    await index.deleteAll();

    console.log('✅ All vectors deleted successfully.');
    res.json({ message: 'All vectors deleted successfully from Pinecone index.' });
  } catch (error) {
    console.error('❌ Error while deleting vectors:', error);
    res.status(500).json({ error: 'Failed to delete vectors from Pinecone.' });
  }
};
