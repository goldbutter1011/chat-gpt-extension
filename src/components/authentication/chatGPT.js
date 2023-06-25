const chatGPT = async (prompt, maxTokens = 550, temperature = 0.8) => {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const API_KEY = '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';

  const messages = [
    { role: 'system', content: 'You are a helpful assistant that specializes in crafting effective sales emails.' },
    { role: 'user', content: prompt },
  ];

  const requestData = {
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: maxTokens,
    temperature: temperature,
  };

  console.log('Sending Request:', requestData);

  try {
    const response = await axios.post(
      API_URL,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response:', response.data);

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content; // Return the generated message content
    } else {
      // Handle the case where no message content is returned
      throw new Error('No message content generated.');
    }
  } catch (error) {
    // Handle errors
    console.error('Error with OpenAI API:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error Data:', error.response.data);
    }
  }
};

export default chatGPT;