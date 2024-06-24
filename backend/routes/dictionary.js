const express = require('express');
const router = express.Router();
const Dictionary = require('../models/Dictionary');

// Get the meaning of a word
router.get('/meaning/:word', async (req, res) => {
    // Remove all symbols and non-alphanumeric characters from the word
    const recognizedText = req.params.word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const language = req.query.language || 'English'; // Default to English if language is not specified

    try {
        const dictionaryEntry = await Dictionary.findOne({ word: { $regex: new RegExp(`^${ recognizedText }$`, 'i') } });
        if (dictionaryEntry) {
            const meanings = dictionaryEntry.meanings[language];
            res.json({ word: recognizedText, meanings: meanings ? [meanings] : [] });
        } else {
            res.json({ word: recognizedText, meanings: [] });
        }
    } catch (error) {
        console.error('Error fetching meanings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});;

module.exports = router;