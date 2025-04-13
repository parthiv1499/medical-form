const express = require('express');
const { createConversation, getConversations, generateResponse } = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All conversation routes are protected
router.use(protect);

router.route('/')
  .get(getConversations)
  .post(createConversation);

router.post('/generate', generateResponse);

module.exports = router; 