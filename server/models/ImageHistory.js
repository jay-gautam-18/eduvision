const mongoose = require('mongoose');

const ImageHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalPrompt: {
        type: String,
        required: true
    },
    enhancedPrompt: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    aspectRatio: {
        type: String,
        enum: ['1:1', '16:9', '9:16', '4:3'],
        default: '1:1'
    },
    educationalFact: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ImageHistory', ImageHistorySchema);
