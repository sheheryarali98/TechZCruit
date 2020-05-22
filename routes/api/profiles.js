const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/community/Post');

// @route   GET /api/profiles/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET /api/profiles/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   POST /api/profiles
// @desc    Create/Update a profile
// @access  Private
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required')
      .not()
      .isEmpty(),
    check('skills', 'Skills is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      company,
      website,
      location,
      githubUsername,
      bio,
      skills,
      facebook,
      twitter,
      linkedin,
      instagram,
      youtube
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (githubUsername) profileFields.githubUsername = githubUsername;
    if (bio) profileFields.bio = bio;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.socialLinks = {};
    if (facebook) profileFields.socialLinks.facebook = facebook;
    if (twitter) profileFields.socialLinks.twitter = twitter;
    if (linkedin) profileFields.socialLinks.linkedin = linkedin;
    if (instagram) profileFields.socialLinks.instagram = instagram;
    if (youtube) profileFields.socialLinks.youtube = youtube;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // If profile exists then update that profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create new profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/profiles/experience
// @desc    Add experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    check('company', 'Company is required')
      .not()
      .isEmpty(),
    check('from', 'From date is required')
      .not()
      .isEmpty(),
    check('current', 'Current is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      position,
      location,
      description,
      from,
      to,
      current
    } = req.body;

    // Build the experience object
    const newExp = {};
    newExp.company = company;
    if (position) newExp.position = position;
    if (location) newExp.location = location;
    if (description) newExp.description = description;
    newExp.from = from;
    if (to) newExp.to = to;
    newExp.current = current;

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experiences.unshift(newExp); //{LIFO} FOR STACK: Default=JS is Queue{FIFO}

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/profiles/education
// @desc    Add education
// @access  Private
router.put(
  '/education',
  [
    auth,
    check('school', 'School is required')
      .not()
      .isEmpty(),
    check('from', 'From date is required')
      .not()
      .isEmpty(),
    check('current', 'Current is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldOfStudy, from, to, current } = req.body;

    // Build the education object
    const newEdu = {};
    newEdu.school = school;
    if (degree) newEdu.degree = degree;
    if (fieldOfStudy) newEdu.fieldOfStudy = fieldOfStudy;
    newEdu.from = from;
    if (to) newEdu.to = to;
    newEdu.current = current;

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/profiles
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Delete posts
    await Post.deleteMany({ user: req.user.id });

    // Delete Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Delete User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/profiles/experience/:exp_id
// @desc    Delete experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experiences
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex !== -1) {
      profile.experiences.splice(removeIndex, 1);
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   DELETE /api/profiles/education/:edu_id
// @desc    Delete education
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    if (removeIndex !== -1) {
      profile.education.splice(removeIndex, 1);
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
