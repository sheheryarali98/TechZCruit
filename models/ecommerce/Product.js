const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      description: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = Product = mongoose.model('product', ProductSchema);
