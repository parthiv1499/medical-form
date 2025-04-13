const Conversation = require('../models/Conversation');
const axios = require('axios');

// @desc    Save a new conversation
// @route   POST /api/conversations
// @access  Private
exports.createConversation = async (req, res) => {
  try {
    const { formData, response } = req.body;

    // Create conversation
    const conversation = await Conversation.create({
      user: req.user.id,
      formData,
      response
    });

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Generate AI response
// @route   POST /api/conversations/generate
// @access  Private
exports.generateResponse = async (req, res) => {
  try {
    const { formData } = req.body;

    const prompt = `Please analyze the following patient information and provide a preliminary assessment:
    
    Patient Details:
    - Age: ${formData.age}
    - Gender: ${formData.gender}
    - Race/Ethnicity: ${formData.race || 'Not specified'}
    
    Symptoms:
    - Primary Symptom: ${formData.primarySymptom}
    - Secondary Symptom: ${formData.secondarySymptom || 'None reported'}
    - Additional Symptoms: ${formData.otherSymptoms || 'None reported'}
    
    Please provide:
    1. Possible conditions to consider
    2. Recommended next steps
    3. General health advice based on the symptoms
    4. Whether immediate medical attention might be needed`;

    const apiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful medical assistant. While you cannot provide official medical diagnosis, you can offer general information and suggestions based on symptoms."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = apiResponse.data.choices[0].message.content;

    // Save conversation automatically
    const conversation = await Conversation.create({
      user: req.user.id,
      formData,
      response: responseText
    });

    res.status(200).json({
      success: true,
      data: {
        response: responseText,
        conversation: conversation
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating response',
      error: error.message 
    });
  }
}; 