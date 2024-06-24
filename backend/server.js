const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const Dictionary = require('./models/Dictionary');


// Import routes
const dictionaryRoutes = require('./routes/dictionary');
const recognizeRoutes = require('./routes/recognize');

const app = express();
const port = 7000; // Use the PORT from .env or default to 7000


// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.use("/dictionary", dictionaryRoutes);
app.use("/recognize", recognizeRoutes);



// const preprocessImage = async (imageBuffer) => {
//     return sharp(imageBuffer)
//         .grayscale()
//         .threshold()
//         .toBuffer();
// };



mongoose.connect("mongodb://localhost:27017/Dictionary")
    .then(() => {
        console.log("Connected to MongoDB");
        return Dictionary.countDocuments({});
    })
    .then(async (count) => {
        if (count === 0) {
            console.log('Dictionary collection is empty, populating data...');
            const filePath = path.join(__dirname, 'dict.json');
            const dictionaryData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            await Dictionary.insertMany(dictionaryData);
            console.log('Dictionary data inserted successfully');
        } else {
            console.log('Dictionary collection already has data, no need to populate.');
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Route to get the meaning of a word
// app.get('/api/dictionary/meaning/:word', async (req, res) => {
//     // Remove all symbols and non-alphanumeric characters from the word
//     const recognizedText = req.params.word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
//     const language = req.query.language || 'English'; // Default to English if language is not specified

//     try {
//         const dictionaryEntry = await Dictionary.findOne({ word: { $regex: new RegExp(^${recognizedText}$, 'i') } });
//         if (dictionaryEntry) {
//             const meanings = dictionaryEntry.meanings[language];
//             res.json({ word: recognizedText, meanings: meanings ? [meanings] : [] });
//         } else {
//             res.json({ word: recognizedText, meanings: [] });
//         }
//     } catch (error) {
//         console.error('Error fetching meanings:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/recognize-text', async (req, res) => {
//     const { image } = req.body;

//     try {
//         const { data: { text } } = await Tesseract.recognize(
//             image,
//             'eng',
//             {
//                 logger: m => (m)
//             }
//         );
//         res.json({ text });
//     } catch (error) {
//         console.error('Error recognizing text:', error);
//         res.status(500).json({ error: 'Failed to recognize text' });
//     }
// });


app.listen(port, () => {
    console.log(`Server running on ${port}`);
});