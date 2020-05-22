const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/store', async (req, res) => {
  try {
    const users = await User.find({ storeOwner: true });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server errorrr');
  }
});

// @route   POST /api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email account').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the user already exists or not
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put(
  '/password',
  [
    auth,
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    try {
      const user = await User.findById(req.user.id);

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.json({ msg: 'Password updated' });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/users/name
// @desc    Change name
// @access  Private
router.put(
  '/name',
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

    const { name } = req.body;

    try {
      const user = await User.findById(req.user.id);

      user.name = name;

      await user.save();
      res.json({ msg: 'Name updated' });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/users/profile-picture/upload
// @desc    Upload profile picture
// @access  Private
router.put('/profile-picture/upload', auth, async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const fileExtension = file.mimetype.split('/')[1];

  if (fileExtension === 'jpeg') {
    file.mv(
      `./client/public/uploads/profile-picture/${req.user.id}.${fileExtension}`,
      err => {
        if (err) {
          return res.status(500).send('Server error');
        }

        res.json({
          avatar: `/uploads/profile-picture/${req.user.id}.${fileExtension}`
        });
      }
    );

    try {
      const user = await User.findById(req.user.id);
      user.avatar = `/uploads/profile-picture/${req.user.id}.${fileExtension}`;
      await user.save();
    } catch (err) {
      return res.status(500).send('Server error');
    }
  } else {
    return res.status(400).json({ msg: 'Only jpeg images can be uploaded' });
  }
});

// @route   PUT /api/users/profile-picture/remove
// @desc    Remove profile picture
// @access  Private
router.put('/profile-picture/remove', auth, async (req, res) => {
  fs.unlink(
    `./client/public/uploads/profile-picture/${req.user.id}.jpeg`,
    err => {
      if (err) {
        return res.status(500).send('Server error');
      }
    }
  );

  try {
    const user = await User.findById(req.user.id);
    user.avatar = gravatar.url(user.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    await user.save();
    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
