const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/generationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, generateImage);

module.exports = router;
