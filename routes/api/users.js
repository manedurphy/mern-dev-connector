const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../../models/user');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc     Register user
// @access  Public -->No token required to access
router.post(
  '/',
  [
    //name must be present --->read through docs later to find this pattern
    body('name').not().isEmpty().withMessage('Your name is required'),
    //email must be an email
    body('email').isEmail().withMessage('Please enter a valid email'),
    //password must be at least 8 characters
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    //if the errors array has conent (not empty)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      const newUser = new User({
        name,
        email,
        avatar,
        password,
      });

      //This is the synchronous technique using the await method
      const salt = await bcrypt.genSalt(10);
      //replacing the plain-text password string in the newUser object with the new hash password
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      //Getting the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '1hr' },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
