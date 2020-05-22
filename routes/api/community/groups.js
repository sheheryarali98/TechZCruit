const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Group = require('../../../models/community/Group');
const User = require('../../../models/User');
const Post = require('../../../models/community/Post');

// @route   GET /api/community/groups
// @desc    Get all groups
// @access  Public
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/community/groups/user
// @desc    Get all groups for a user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const groups = await Group.find({ admin: req.user.id });
    res.json(groups);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/community/groups/search/:description
// @desc    Search for a particular group
// @access  Private
router.get('/search/:description', auth, async (req, res) => {
  const description = req.params.description;

  try {
    const groups = await Group.find({
      name: new RegExp(description, 'i')
    });

    res.send(groups);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/community/groups/:id
// @desc    Get group by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id
    })
      .populate('admin', ['name', 'avatar'])
      .populate('members.user', ['name', 'avatar'])
      .populate('requests.user', ['name', 'avatar']);
    res.json(group);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   POST /api/community/groups
// @desc    Create a group
// @access  Private
router.post(
  '/',
  [
    auth,
    check('name', 'Name is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const newGroup = new Group({
      admin: req.user.id,
      name,
      description
    });

    try {
      await newGroup.save();
      res.json(newGroup);
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/community/groups/request/:id
// @desc    Add a request to join a group
// @access  Private
router.put('/request/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(400).json({ msg: 'Group does not exist' });
    }

    const index = group.requests.map(item => item.user).indexOf(req.user.id);

    if (index !== -1) {
      return res.status(400).json({ msg: 'Request already sent' });
    }

    group.requests.push({ user: req.user.id });

    await group.save();
    res.json(group);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   PUT /api/community/groups/:id/:user_id
// @desc    Add member to a group
// @access  Private
router.put('/:id/:user_id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(400).json({ msg: 'Group does not exist' });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(req.params.user_id);

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const index = group.members
      .map(item => item.user)
      .indexOf(req.params.user_id);

    if (index !== -1) {
      return res.status(400).json({ msg: 'User already a member' });
    }

    group.members.push({ user: req.params.user_id });

    group.populate('members.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await group.save();
    res.json(group);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   PUT /api/community/groups/:id
// @desc    Update a group
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('name', 'Name is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let group = await Group.findById(req.params.id);

      if (!group) {
        return res.status(400).json({ msg: 'Group does not exist' });
      }

      if (group.admin.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { name, description } = req.body;

      group = await Group.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name,
            description
          }
        },
        { new: true }
      );

      res.json(group);
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/community/groups/request/:id/:req_id
// @desc    Delete request to join a group
// @access  Private
router.delete('/request/:id/:req_id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(400).json({ msg: 'Group does not exist' });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const index = group.requests
      .map(item => item._id)
      .indexOf(req.params.req_id);

    if (index === -1) {
      return res.status(400).json({ msg: 'Request not found' });
    }

    group.requests.splice(index, 1);

    group.populate('requests.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await group.save();
    res.json(group);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/community/groups/:id/:user_id
// @desc    Delete member from a group
// @access  Private
router.delete('/:id/:user_id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(400).json({ msg: 'Group does not exist' });
    }

    const user = await User.findById(req.params.user_id);

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const index = group.members
      .map(item => item.user)
      .indexOf(req.params.user_id);

    if (index === -1) {
      return res.status(400).json({ msg: 'User not a member' });
    }

    group.members.splice(index, 1);

    group.populate('members.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await group.save();
    res.json(group);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/community/groups/:id
// @desc    Delete a group
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(400).json({ msg: 'Group does not exist' });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Post.deleteMany({ group: req.params.id });

    await group.remove();
    res.json({ msg: 'Group removed' });
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

module.exports = router;
