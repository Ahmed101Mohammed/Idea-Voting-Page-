const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ideaRoutes = require('./routes/ideas');
const uniqueIdentifier = require('./middleware/uniqueIdentifier');

dotenv.config();

const app = express();
app.use(express.json());
app.use(uniqueIdentifier);
app.use('/api/ideas', ideaRoutes);
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => console.error('Database connection error:', err));
