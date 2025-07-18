const openai = require('../config/openai');

exports.getChatCompletion = async (messages) => {
  console.log('Calling OpenAI Chat Completion...');
  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  });

  const finalAnswer = chatResponse.choices[0].message.content;
  console.log('OpenAI Answer:', finalAnswer);
  return finalAnswer;
};
