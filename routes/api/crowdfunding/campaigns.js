const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')('sk_test_XlhQvFYUTZ4qdeqnN3X3RVTX00CoTYt5Sz');
const auth = require('../../../middleware/auth');
const Campaign = require('../../../models/crowdfunding/Campaign');

// @route   GET /api/crowdfunding/campaigns
// @desc    Get all campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/crowdfunding/campaigns/user
// @desc    Get all campaigns for user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id });
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/crowdfunding/campaigns/search/:description
// @desc    Search for a particular campaign
// @access  Private
router.get('/search/:description', auth, async (req, res) => {
  const description = req.params.description;

  try {
    const campaigns = await Campaign.find({
      title: new RegExp(description, 'i')
    });

    res.send(campaigns);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/crowdfunding/campaigns/:id
// @desc    Get campaign by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id
    })
      .populate('user', ['name', 'avatar'])
      .populate('comments.user', ['name', 'avatar'])
      .populate('supporters.user', ['name', 'avatar']);

    res.json(campaign);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   POST api/crowdfunding/campaigns
// @desc    Create a campaign
// @access  Private
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
    check('category', 'Category is required')
      .not()
      .isEmpty(),
    check('fundsRequired', 'Required funds not mentioned')
      .not()
      .isEmpty(),
    check('completionDate', 'Completion date not mentioned')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      fundsRequired,
      completionDate
    } = req.body;

    try {
      const campaign = new Campaign({
        user: req.user.id,
        title,
        description,
        category,
        fundsRequired,
        completionDate
      });

      await campaign.save();
      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/crowdfunding/campaigns/support/:id
// @desc    Support a campaign
// @access  Private
router.put(
  '/support/:id',
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
      const campaign = await Campaign.findById(req.params.id);

      campaign.supporters.unshift({
        user: req.user.id,
        amount
      });

      await campaign.save();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd'
      });

      res.json({
        campaign: campaign,
        clientSecret: paymentIntent.client_secret
      });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/crowdfunding/campaigns/comment/:id
// @desc    Comment on a campaign
// @access  Private
router.put(
  '/comment/:id',
  [
    auth,
    check('description', 'Description is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description } = req.body;

    try {
      const campaign = await Campaign.findOne({ _id: req.params.id });

      campaign.comments.unshift({
        user: req.user.id,
        description
      });

      campaign.populate('comments.user', ['name', 'avatar'], (err, res) => {
        if (err) throw err;
        return res;
      });

      await campaign.save();
      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/crowdfunding/campaigns/:id
// @desc    Update a campaign
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
    check('category', 'Category is required')
      .not()
      .isEmpty(),
    check('fundsRequired', 'Required funds not mentioned')
      .not()
      .isEmpty(),
    check('completionDate', 'Completion date not mentioned')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let campaign = await Campaign.findById(req.params.id);

      if (!campaign) {
        return res.status(400).json({ msg: 'Campaign does not exist' });
      }

      if (campaign.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const {
        title,
        description,
        category,
        fundsRequired,
        completionDate
      } = req.body;

      campaign = await Campaign.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title,
            description,
            category,
            fundsRequired,
            completionDate
          }
        },
        { new: true }
      );

      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/crowdfunding/campaigns/comment/:id/:comment_id
// @desc    Delete a comment on a campaign
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const campaign = await Campaign.findOne({ _id: req.params.id });

    const removeIndex = campaign.comments
      .map(item => item.id)
      .indexOf(req.params.comment_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const comment = campaign.comments.find(
      comment => comment.id === req.params.comment_id
    );

    campaign.comments.splice(removeIndex, 1);

    campaign.populate('comments.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await campaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/crowdfunding/campaigns/:id
// @desc    Delete a campaign
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id });

    // Check is campaign exists
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    // Check campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await campaign.remove();
    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
