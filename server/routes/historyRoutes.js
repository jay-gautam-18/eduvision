const express = require('express');
const router = express.Router();

const { getUserHistory, getGallery, deleteHistoryItem } = require('../controllers/historyController');



const { protect } = require('../middleware/auth');
router.delete('/history/:id', protect, deleteHistoryItem);


router.get('/history', protect, getUserHistory);
router.get('/gallery', getGallery);

module.exports = router;
