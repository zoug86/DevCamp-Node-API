const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');

// @desc    Fetch all bootcamps
// @route   GET  /api/v1/bootcamps
// @access  Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const allBootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: allBootcamps.length, data: allBootcamps });
})

// @desc    Fetch single bootcamp
// @route   GET  /api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
})

// @desc    Create new bootcamp
// @route   POST  /api/v1/bootcamps
// @access  Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const createdBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: createdBootcamp });
})

// @desc    Update bootcamp
// @route   PUT  /api/v1/bootcamps/:id
// @access  Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const UpdatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!UpdatedBootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: UpdatedBootcamp })
})

// @desc    Delete bootcamp
// @route   DELETE  /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const deletedBootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if (!deletedBootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: deletedBootcamp });
})

// @desc    Get bootcamp within a radius
// @route   GET  /api/v1/bootcamp/radius/:zipcode/:distance
// @access  Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get latitude and longitude from geocoder

})