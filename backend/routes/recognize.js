const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js');
// require('dotenv').config();


// Route to handle image upload and OCR processing
router.post('/recognize-text', async (req, res) => {
    const { image } = req.body;

    try {
        const { data: { text } } = await Tesseract.recognize(
            image,
            'eng',
            {
                logger: m => (m)
            }
        );
        res.json({ text });
    } catch (error) {
        console.error('Error recognizing text:', error);
        res.status(500).json({ error: 'Failed to recognize text' });
    }
});

module.exports = router;