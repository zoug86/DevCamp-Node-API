const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bootcamp'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

// Prevent user form submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//Static method to get avg bootcamp rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {

    const aggregateRatingObj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }

    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: aggregateRatingObj[0].averageRating
        })
    } catch (err) {
        console.error(err);
    }
}

// Call getAverageRating after save
ReviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.bootcamp);
})

// Call getAverageRating before remove
ReviewSchema.pre('remove', async function () {
    await this.constructor.getAverageRating(this.bootcamp);
})

const Review = mongoose.model('Review', ReviewSchema, 'reviews');
module.exports = Review;