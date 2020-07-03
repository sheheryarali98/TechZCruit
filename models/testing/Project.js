const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  offers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      amount: {
        type: Number,
        required: true,
      },
      clientSecret: {
        type: String,
        required: true,
      },
      paymentMethodId: {
        type: String,
        required: true,
      },
    },
  ],
  testers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
  testCases: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      expectedResult: {
        type: String,
        required: true,
      },
      actualResults: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
          },
          status: {
            type: Boolean,
          },
        },
      ],
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = Project = mongoose.model('project', ProjectSchema);
