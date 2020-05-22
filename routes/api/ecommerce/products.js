const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')('sk_test_XlhQvFYUTZ4qdeqnN3X3RVTX00CoTYt5Sz');
const auth = require('../../../middleware/auth');
const Product = require('../../../models/ecommerce/Product');

// @route   GET /api/ecommerce/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/ecommerce/products/store/:id
// @desc    Get all products for store
// @access  Private
router.get('/store/:id', auth, async (req, res) => {
  try {
    const products = await Product.find({ store: req.params.id });
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/ecommerce/products/search/:description
// @desc    Search for a product
// @access  Private
router.get('/search/:description', auth, async (req, res) => {
  const description = req.params.description;

  try {
    const products = await Product.find({
      title: new RegExp(description, 'i')
    });

    res.send(products);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/ecommerce/products/:id
// @desc    Get product by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', ['name', 'avatar'])
      .populate('store', ['name'])
      .populate('reviews.user', ['name', 'avatar']);

    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   POST /api/ecommerce/products/:id
// @desc    Create a new product
// @access  Private
router.post(
  '/:id',
  [
    auth,
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
    check('category', 'Category is required').isInt(),
    check('price', 'Price is required').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, price } = req.body;

    const product = new Product({
      user: req.user.id,
      store: req.params.id,
      title,
      description,
      category,
      price
    });

    try {
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/eccomerce/products/like/:id
// @desc    Like a product
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id
    });

    //Check if the product already has a favourite by login user
    const index = product.likes.map(item => item.user).indexOf(req.user.id);

    if (index !== -1) {
      return res.status(400).json({ msg: 'Already liked' });
    }

    product.likes.push({ user: req.user.id });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   PUT /api/eccomerce/products/unlike/:id
// @desc    Unlike a product
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    const removeIndex = product.likes
      .map(item => item.user)
      .indexOf(req.user.id);

    if (removeIndex === -1) {
      return res.status(400).json({ msg: 'Product not liked' });
    }

    product.likes.splice(removeIndex, 1);

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   PUT /api/ecommerce/products/review/:id
// @desc    Review on a product
// @access  Private
router.put(
  '/review/:id',
  [
    auth,
    check('rating', 'Rating is required').isInt(),
    check('description', 'Description is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description, rating } = req.body;

    try {
      const product = await Product.findOne({ _id: req.params.id });

      product.reviews.unshift({
        user: req.user.id,
        description,
        rating
      });

      product.populate('reviews.user', ['name', 'avatar'], (err, res) => {
        if (err) throw err;
        return res;
      });

      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/ecommerce/products/purchase/:id
// @desc    Purchase a product
// @access  Private
router.put(
  '/purchase/:id',
  [
    auth,
    check('amount', 'Amount is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;

    try {
      const product = await Product.findById(req.params.id);

      product.sales += 1;

      await product.save();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd'
      });

      res.json({
        product: product,
        clientSecret: paymentIntent.client_secret
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/ecommerce/products/:id
// @desc    Update a Product
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
    check('category', 'Category is required').isInt(),
    check('price', 'Price is required').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(400).json({ msg: 'Product does not exist' });
      }

      if (product.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { title, description, category, price } = req.body;

      product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title,
            description,
            category,
            price
          }
        },
        { new: true }
      );

      res.json(product);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/eccomerce/products/review/:id/:review_id
// @desc    Delete a review on a product
// @access  Private
router.delete('/review/:id/:review_id', auth, async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });

    const removeIndex = product.reviews
      .map(item => item.id)
      .indexOf(req.params.review_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    product.reviews.splice(removeIndex, 1);

    product.populate('reviews.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/ecommerce/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await product.remove();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
