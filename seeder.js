const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');

// load env variables
dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to Database
const connectDB = require('./config/db')
connectDB();

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// Import bootcamps into Database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data imported successfully!'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// Delete bootcamps from Database
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data Destroyed successfully!'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}