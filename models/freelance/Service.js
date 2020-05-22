const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  requests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      description: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      clientSecret: {
        type: String,
        required: true
      },
      paymentMethodId: {
        type: String,
        required: true
      }
    }
  ],
  services: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      description: {
        type: String,
        required: true
      },
      status: {
        type: Boolean,
        default: false
      }
    }
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      description: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = Service = mongoose.model('service', ServiceSchema);
