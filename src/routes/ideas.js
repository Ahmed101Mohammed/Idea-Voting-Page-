const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// Get all ideas
router.get('/', async (req, res) => {
    const ideas = await Idea.find().sort({ votingUp: -1, votingDown: 1 });
    res.json(ideas);
});

// Create a new idea
router.post('/', async (req, res) => {
    const { idea } = req.body;
    const addresses = req.uniqueIdentifier;
    const fullAddress = `${addresses[0]} | ${addresses[1]}` 
    const newIdea = new Idea({ idea, userCreate: fullAddress });
    await newIdea.save();
    res.status(201).json(newIdea);
});

// Vote on an idea
router.post('/:id/vote', async (req, res) => {
    const { id } = req.params;
    const addresses = req.uniqueIdentifier;
    const fullAddress = `${addresses[0]} | ${addresses[1]}`
    const { direction } = req.body;
    const idea = await Idea.findById(id);

    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.userCreate === fullAddress) {
        return res.status(400).json({ message: 'Cannot vote on your own idea' });
    }

    if (idea.voters.includes(fullAddress)) {
        return res.status(400).json({ message: 'Already voted on this idea' });
    }

    if (direction === 'up') {
        idea.votingUp += 1;
    } else if (direction === 'down') {
        idea.votingDown += 1;
    }

    idea.voters.push(fullAddress);
    await idea.save();
    res.json(idea);
});

module.exports = router;
