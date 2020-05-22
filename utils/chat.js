const Conversation = require('../models/chat/Conversation');

// Add message to a conversation
const addMessage = async (room, user, message) => {
  try {
    const conversation = await Conversation.findById(room);

    conversation.messages.push({
      user,
      description: message
    });

    conversation.populate('messages.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await conversation.save();

    return conversation;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addMessage };
