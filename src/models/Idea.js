const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    idea: { type: String, required: true },
    votingUp: { type: Number, default: 0 },
    votingDown: { type: Number, default: 0 },
    userCreate: { type: String, required: true },
    voters: { type: [String], default: [] }
});

module.exports = mongoose.model('Idea', ideaSchema);
