const express = require('express');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan') // this is a 3rd party middleware used to log user api calls
const connectDB = require('./config/db')
const colors = require('colors');
const errorHandler = require('./middleware/errorHandler');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env variables
dotenv.config({ path: './config/config.env' })

// Start the db
connectDB();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser())

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Files upload middleware
app.use(fileupload());

// Setting static folder middleware
app.use(express.static(path.join(__dirname, 'public'))); //Serves resources from public folder

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server sunning in ${process.env.NODE_ENV} mode on port ${PORT}`.green.underline.bold));

// Handle unhadled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
})

