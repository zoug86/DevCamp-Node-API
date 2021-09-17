const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    // send token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

    }
    // send token in cookie
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id)

    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    next();
})

// Grant access tp specific roles
exports.authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(`The role of '${req.user.role}' is not authorized to access this route`, 403));
    } else {
        next();
    }
}