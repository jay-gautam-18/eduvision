const ImageHistory = require('../models/ImageHistory');
const redisClient = require('../config/redis');

// @desc    Get User's Generation History
// @route   GET /api/history
// @access  Private
exports.getUserHistory = async (req, res) => {
    try {
        const history = await ImageHistory.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 for sidebar
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Public Gallery
// @route   GET /api/gallery
// @access  Public
exports.getGallery = async (req, res) => {
    try {
        // Check Redis Cache
        const cachedGallery = await redisClient.get('gallery_images');
        if (cachedGallery) {
            return res.json(JSON.parse(cachedGallery));
        }

        const gallery = await ImageHistory.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('user', 'username avatar');

        // Set Redis Cache (expire in 1 hour)
        await redisClient.setEx('gallery_images', 3600, JSON.stringify(gallery));

        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a history item
// @route   DELETE /api/history/:id
// @access  Private
exports.deleteHistoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ImageHistory.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'History item not found' });
        }
        // Ensure the item belongs to the authenticated user
        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }
        await item.remove();
        res.json({ message: 'History item deleted' });
    } catch (error) {
        console.error('Delete history error', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
