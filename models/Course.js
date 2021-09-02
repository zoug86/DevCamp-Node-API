const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add a number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bootcamp'
    }
}, { timestamps: true });

// ---- Model middleware ----- //

//Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {

    const aggregateCostObj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }

    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(aggregateCostObj[0].averageCost / 10) * 10
        })
    } catch (err) {
        console.error(err);
    }
}

// Call getAverageCost after save
CourseSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
})

// Call getAverageCost before remove
CourseSchema.pre('remove', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
})


const Course = mongoose.model('Course', CourseSchema, 'courses');
module.exports = Course;