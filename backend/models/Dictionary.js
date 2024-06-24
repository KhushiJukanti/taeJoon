const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
    word: { type: String, required: true },
    meanings: {
        English: { type: String, required: true },
        Telugu: { type: String, required: true },
        Hindi: { type: String, required: true }
    }
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);

module.exports = Dictionary;