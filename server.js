const express = require('express');
const dotenv = require('dotenv');
const app = express();


// Load env variables
dotenv.config({ path: './config/config.env' })

app.get('/', (req, res) => {
    res.send('Hello')
})




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server sunning in ${process.env.NODE_ENV} mode on port ${PORT}`));