const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc     Test route
// @access  Public -->No token required to access
router.get('/', (req, res) => {
  res.send('PostRoute');
});

module.exports = router;
