const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register user
// @route   POST  /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // create user
    const user = await User.create({ name, email, password, role });

    sendTokenResponse(user, 200, res);

})

// @desc    Login user
// @route   POST  /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse(`Please provide an email address and password`, 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials provided`, 401));
    }

    // Check for password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse(`Invalid credentials provided`, 401));
    }

    sendTokenResponse(user, 200, res);
})

// helper method: Get token from model, then create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token })
}