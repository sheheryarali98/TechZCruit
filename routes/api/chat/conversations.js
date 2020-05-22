const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Conversation = require('../../../models/chat/Conversation');

// @route   GET /api/chat/conversations/user
// @desc    Get all conversations for user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    let conversations = await Conversation.find()
      .populate('users.user', ['name', 'avatar'])
      .populate('messages.user', ['name', 'avatar']);
    conversations = conversations.filter(conversation => {
      const index = conversation.users
        .map(item => item.user._id)
        .indexOf(req.user.id);
      if (index !== -1) {
        return conversation;
      }
    });

    res.json(conversations);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/chat/conversations/:id
// @desc    Get conversation by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let conversation = await Conversation.findById(req.params.id)
      .populate('users.user', ['name', 'avatar'])
      .populate('messages.user', ['name', 'avatar']);
    res.json(conversation);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   POST /api/chat/conversations
// @desc    Create a conversation
// @access  Private
router.post(
  '/',
  [
    auth,
    check('user1', 'User 1 is requried')
      .not()
      .isEmpty(),
    check('user2', 'User 2 is requried')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user1, user2 } = req.body;

    try {
      let conversations = await Conversation.find();
      conversations = conversations.filter(conversation => {
        const users = conversation.users.map(item => item.user);
        if (users.indexOf(user1) !== -1 && users.indexOf(user2) !== -1) {
          return conversation;
        }
      });

      let conversation;

      if (conversations.length > 0) {
        // If a conversation already exists then return that conversation
        conversation = await Conversation.findById(conversations[0]._id)
          .populate('users.user', ['name', 'avatar'])
          .populate('messages.user', ['name', 'avatar']);
      } else {
        // Else create a new conversation and return that
        conversation = new Conversation();

        conversation.users.push({ user: user1 }, { user: user2 });

        conversation.populate('users.user', ['name', 'avatar'], (err, res) => {
          if (err) throw err;
          return res;
        });

        await conversation.save();

        conversation = await Conversation.findById(
          conversation.id
        ).populate('users.user', ['name', 'avatar']);
      }

      res.json(conversation);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
