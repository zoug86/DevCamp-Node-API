const express = require('express');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan') // this is a 3rd party middleware used to log user api calls
const connectDB = require('./config/db')
const colors = require('colors');
const errorHandler = require('./middleware/errorHandler')

// Load env variables
dotenv.config({ path: './config/config.env' })

// Start the db
connectDB();

// Body parser
app.use(express.json());

// Route files
const bootcamps = require('./routes/bootcamps');

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

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

