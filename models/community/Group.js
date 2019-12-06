const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

module.exports = Group = mongoose.model('group', GroupSchema);
