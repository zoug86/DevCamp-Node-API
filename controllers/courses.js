const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Fetch all courses
// @route   GET  /api/v1/courses
// @route   GET  /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = Course.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({ success: true, count: courses.length, data: courses });

    } else {
        res.status(200).json(res.advancedResults);
    }
})

// @desc    Fetch single course
// @route   GET  /api/v1/courses/:id
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate('bootcamp', 'name description');
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: course });
})

// @desc    Add new Course
// @route   POST  /api/v1/bootcamps/:bootcampId/courses
// @access  Private

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }
    const addedCourse = await Course.create(req.body);
    res.status(201).json({ success: true, data: addedCourse });
})

// @desc    Update course
// @route   PUT  /api/v1/courses/:id
// @access  Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let UpdatedCourse = await Course.findById(req.params.id);
    if (!UpdatedCourse) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    UpdatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    //UpdatedCourse.save();
    res.status(200).json({ success: true, data: UpdatedCourse })
})

// @desc    Delete course
// @route   DELETE  /api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const deletedCourse = await Course.findById(req.params.id);
    if (!deletedCourse) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    await deletedCourse.remove();

    res.status(200).json({ success: true, data: deletedCourse });
})

// @desc    Get bootcamp within a radius
// @route   GET  /api/v1/bootcamp/radius/:zipcode/:distance
// @access  Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const { latitude: lat, longitude: long } = loc[0];

    // Calc Radius = divide distance by radius of Earth (Earth radius = 3,963 miles or 6,378 km)
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    })
})