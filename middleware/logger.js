
// @desc    Fetch all bootcamps
// @route   GET  /api/v1/bootcamps
// @access  Public

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.headers.host}${req.path}`);
    next();
}


module.exports = logger;