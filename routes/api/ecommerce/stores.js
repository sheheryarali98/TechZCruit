const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Store = require('../../../models/ecommerce/Store');

// @route   GET /api/ecommerce/stores
// @desc    Get all stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/ecommerce/stores/user
// @desc    Get all stores for current user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const stores = await Store.find({ user: req.user.id });
    res.json(stores);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/ecommerce/stores/search/:description
// @desc    Search for a store
// @access  Private
router.get('/search/:description', auth, async (req, res) => {
  const description = req.params.description;

  try {
    const stores = await Store.find({
      name: new RegExp(description, 'i')
    });

    res.send(stores);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/ecommerce/stores/:id
// @desc    Get store by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    res.json(store);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   POST /api/ecommerce/stores
// @desc    Create a new store
// @access  Private
router.post(
  '/',
  [
    auth,
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const store = new Store({
      user: req.user.id,
      name,
      description
    });

    try {
      await store.save();
      res.json(store);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/ecommerce/stores/:id
// @desc    Update a store
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let store = await Store.findById(req.params.id);

      if (!store) {
        return res.status(400).json({ msg: 'Store does not exist' });
      }

      if (store.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { name, description } = req.body;

      store = await Store.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name,
            description
          }
        },
        { new: true }
      );

      res.json(store);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/ecommerce/stores/:id
// @desc    Delete a store
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(400).json({ msg: 'Store does not exist' });
    }

    if (store.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await store.remove();
    res.json({ msg: 'Store removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
