const Bootcamp = require('../models/Bootcamp');

// @desc    Fetch all bootcamps
// @route   GET  /api/v1/bootcamps
// @access  Public

exports.getBootcamps = async (req, res) => {
    try {
        const allBootcamps = await Bootcamp.find({});
        res.status(200).json({ success: true, count: allBootcamps.length, data: allBootcamps })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message })
    }

}

// @desc    Fetch single bootcamp
// @route   GET  /api/v1/bootcamp/:id
// @access  Public

exports.getBootcamp = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false, msg: 'Bootcamp not found!' })
        }
        res.status(200).json({ success: true, data: bootcamp })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message })
    }
}

// @desc    Create new bootcamp
// @route   POST  /api/v1/bootcamp
// @access  Private

exports.createBootcamp = async (req, res) => {
    try {
        const createdBootcamp = await Bootcamp.create(req.body)
        res.status(201).json({ success: true, data: createdBootcamp })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message })
    }
}

// @desc    Update bootcamp
// @route   PUT  /api/v1/bootcamp/:id
// @access  Private

exports.updateBootcamp = async (req, res) => {
    // console.log(req.body)
    try {
        const UpdatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!UpdatedBootcamp) {
            return res.status(400).json({ success: false, msg: 'Bootcamp not found!' })
        }
        res.status(200).json({ success: true, data: UpdatedBootcamp })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message })
    }
}

// @desc    Delete bootcamp
// @route   DELETE  /api/v1/bootcamp':id
// @access  Private

exports.deleteBootcamp = async (req, res) => {
    try {
        const deletedBootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
        if (!deletedBootcamp) {
            return res.status(400).json({ success: false, msg: 'Bootcamp not found!' })
        }
        res.status(200).json({ success: true, data: deletedBootcamp })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message })
    }
}