// Creating a Mongoose Model:  Note: the name of the file 'by convetion' has to be uppercase and single (Bootcamp.js)
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

// Step 1: requiring mongoose
const mongoose = require('mongoose');

//Step 2: declaring a new Schema --- this the main part!
const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name ca not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Name ca not be more than 500 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            //required: true
        },
        coordinates: {
            type: [Number],
            // required: true
        },
        formattedAddress: String,
        street: String,
        city: String,
        stateCode: String,
        zipcode: String,
        countryCode: String,
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters!']
    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10'],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtual: true }
});

//Step 3: Model middleware
// a- Create bootcamp slug from the name

BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    //console.log(this.slug);
    next();
});

// b- Geocode & create location field

BootcampSchema.pre('save', async function (next) {
    const res = await geocoder.geocode(this.address);
    //console.log(res[0])
    this.location = {
        type: 'Point',
        coordinates: [res[0].longitude, res[0].latitude],
        ...res[0]
    }

    // Do not save address in DB
    this.address = undefined;
    next();
});

// Cascade delete courses when a related bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
    console.log(`Courses are being deleted from bootcamp ${this._id}`)
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
})


// Reverse populate with virtuals
// Add virtuals (virtual fields)
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})


//Step 4: export the Schema object

const Bootcamp = mongoose.model('Bootcamp', BootcampSchema, "bootcamps"); // the third argument specifies the collection name (or creates one if does not exist)

module.exports = Bootcamp;