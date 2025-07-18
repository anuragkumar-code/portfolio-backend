const embeddingService = require('../services/embeddingService');
const vectorSearchService = require('../services/vectorSearchService');
const openaiChatService = require('../services/openaiChatService');

let conversationHistory = []; // Keeps full history for this session

exports.handleChat = async (req, res) => {
  const { query } = req.body;

  try {
    console.log('Received query:', query);

    const queryEmbedding = await embeddingService.getQueryEmbedding(query);
    const relevantChunks = await vectorSearchService.searchRelevantChunks(queryEmbedding);
    const contextText = relevantChunks.join('\n\n');

    const defaultAboutMe = `
Anurag is a passionate software engineer with deep skills in full-stack development, system architecture, and AI integrations. 
He works comfortably with Laravel, Node.js, PHP, React, and builds intelligent RAG-based systems using OpenAI and Pinecone. 
Anurag is known for delivering clean, scalable code, a great sense of product thinking, and a love for building things that actually help people.
    `;

    let systemPrompt = `
You are "Jarwis", Anurag's AI assistant and digital representative.

You respond on behalf of Anurag in a casual, confident, and honest tone—like a super helpful friend who also happens to know a lot about Anurag's work and projects.

Here's how you respond:
- Base your answers on the "Document Context" below.
- If something is not found in the context, don’t say "I don't know" outright.
  Instead, say something like: "Anurag hasn't worked with [tech/tool] yet, but knowing him, he'd probably pick it up before you finish your coffee ☕"
- If a user question is vague, ask them nicely to clarify.
- Always speak truthfully about Anurag’s experience, even if it means saying he hasn't done something.
- Use a friendly, slightly witty tone—but never overdo the jokes.
- Make sure you’re still informative and helpful.

Document Context:
${contextText || defaultAboutMe}
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.flatMap(item => ([
        { role: 'user', content: item.user },
        { role: 'assistant', content: item.ai },
      ])),
      { role: 'user', content: query }
    ];

    const finalAnswer = await openaiChatService.getChatCompletion(messages);

    conversationHistory.push({ user: query, ai: finalAnswer });

    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    res.json({ answer: finalAnswer });

  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).json({ error: 'Something went wrong while answering the query.' });
  }
};
