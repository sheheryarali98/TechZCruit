const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')('sk_test_XlhQvFYUTZ4qdeqnN3X3RVTX00CoTYt5Sz');
const auth = require('../../../middleware/auth');
const Service = require('../../../models/freelance/Service');

// @route   GET /api/freelance/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/freelance/services/user
// @desc    Get all services for user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const services = await Service.find({ user: req.user.id });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/freelance/services/search/:description
// @desc    Search for a particular service
// @access  Private
router.get('/search/:description', auth, async (req, res) => {
  const description = req.params.description;

  try {
    const services = await Service.find({
      title: new RegExp(description, 'i')
    });

    res.send(services);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/freelance/services/:id
// @desc    Get service by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id
    })
      .populate('user', ['name', 'avatar'])
      .populate('requests.user', ['name', 'avatar'])
      .populate('reviews.user', ['name', 'avatar'])
      .populate('services.user', ['name', 'avatar']);

    res.json(service);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   POST api/freelance/services
// @desc    Create a service
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
    check('amount', 'Amount is required').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, amount } = req.body;

    try {
      const service = new Service({
        user: req.user.id,
        title,
        description,
        amount
      });

      await service.save();
      res.json(service);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/freelance/services/finish/:id/:service_id
// @desc    Finish service for a service
// @access  Private
router.put('/finish/:id/:service_id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(400).json({ msg: 'Service does not exist' });
    }

    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    service.services.map(item => {
      if (item._id.toString() === req.params.service_id) {
        item.status = true;
      }
      return item;
    });

    service.populate('services.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await service.save();
    res.json(service);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   PUT /api/freelance/services/review/:id
// @desc    Review on a service
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
      const service = await Service.findOne({ _id: req.params.id });

      service.reviews.unshift({
        user: req.user.id,
        description,
        rating
      });

      service.populate('reviews.user', ['name', 'avatar'], (err, res) => {
        if (err) throw err;
        return res;
      });

      await service.save();
      res.json(service);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/freelance/services/request/:id
// @desc    Add an request for a service
// @access  Private
router.put(
  '/request/:id',
  [
    auth,
    check('description', 'Description is required')
      .not()
      .isEmpty(),
    check('amount', 'Amount is required and must be an integer').isInt(),
    check('paymentMethodId', 'Payment method ID is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { description, amount, paymentMethodId } = req.body;

      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(400).json({ msg: 'Service does not exist' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd'
      });

      service.requests.push({
        user: req.user.id,
        description,
        amount,
        clientSecret: paymentIntent.client_secret,
        paymentMethodId
      });

      service.populate('requests.user', ['name', 'avatar'], (err, res) => {
        if (err) throw err;
        return res;
      });

      await service.save();
      res.json(service);
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/freelance/services/:id/:request_id
// @desc    Add service to a service
// @access  Private
router.put('/:id/:request_id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(400).json({ msg: 'Service does not exist' });
    }

    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const index = service.requests
      .map(item => item._id)
      .indexOf(req.params.request_id);

    if (index === -1) {
      return res.status(400).json({ msg: 'Request not found' });
    }

    const request = service.requests[index];

    service.services.push({
      user: request.user,
      description: request.description
    });

    service.populate('services.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await service.save();
    res.json(service);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   PUT api/freelance/services/:id
// @desc    Update a service
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
    check('amount', 'Amount is required').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(400).json({ msg: 'Service does not exist' });
      }

      if (service.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { title, description, amount } = req.body;

      service = await Service.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title,
            description,
            amount
          }
        },
        { new: true }
      );

      res.json(service);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/freelance/services/review/:id/:review_id
// @desc    Delete a review on a service
// @access  Private
router.delete('/review/:id/:review_id', auth, async (req, res) => {
  try {
    const service = await Service.findById({ _id: req.params.id });

    const removeIndex = service.reviews
      .map(item => item.id)
      .indexOf(req.params.review_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    service.reviews.splice(removeIndex, 1);

    service.populate('reviews.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/freelance/services/request/:id/:request_id
// @desc    Delete request for a service
// @access  Private
router.delete('/request/:id/:request_id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(400).json({ msg: 'Service does not exist' });
    }

    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const index = service.requests
      .map(item => item._id)
      .indexOf(req.params.request_id);

    if (index === -1) {
      return res.status(400).json({ msg: 'Request not found' });
    }

    service.requests.splice(index, 1);

    service.populate('requests.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await service.save();
    res.json(service);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/freelance/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id });

    // Check is service exists
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Check service
    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await service.remove();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
