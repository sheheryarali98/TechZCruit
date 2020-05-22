const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  messages: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      description: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = Conversation = mongoose.model(
  'conversation',
  ConversationSchema
);
