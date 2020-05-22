const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Post = require('../../../models/community/Post');

// @route   GET /api/community/posts/group/:id
// @desc    Get all posts for a group
// @access  Public
router.get('/group/:id', async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.id }).populate('user', [
      'name',
      'avatar'
    ]);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/community/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .populate('user', ['name', 'avatar'])
      .populate('comments.user', ['name', 'avatar'])
      .populate('group', ['admin']);

    res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   POST /api/community/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
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
      const post = await Post.findOne({ _id: req.params.id });

      post.comments.unshift({
        user: req.user.id,
        description
      });

      post.populate('comments.user', ['name', 'avatar'], (err, res) => {
        if (err) throw err;
        return res;
      });

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   POST /api/community/posts/:id
// @desc    Create a post in a group
// @access  Private
router.post(
  '/:id',
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
      const post = new Post({
        user: req.user.id,
        description,
        group: req.params.id
      });

      post.populate('user', ['name', 'avatar'], (err, res) => {
        if (err) throw err;
        return res;
      });

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/community/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    const index = post.likes.map(item => item.user).indexOf(req.user.id);

    if (index !== -1) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.push({ user: req.user.id });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   PUT /api/community/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    const removeIndex = post.likes.map(item => item.user).indexOf(req.user.id);

    if (removeIndex === -1) {
      return res.status(400).json({ msg: 'Post not liked' });
    }

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/community/posts/comment/:id/:comment_id
// @desc    Delete a comment on a post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findOne({ _id: req.params.id });

    const removeIndex = post.comments
      .map(item => item.id)
      .indexOf(req.params.comment_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    post.comments.splice(removeIndex, 1);

    post.populate('comments.user', ['name', 'avatar'], (err, res) => {
      if (err) throw err;
      return res;
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/community/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    // Check is post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
