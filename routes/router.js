const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controllers/controller');
const router = express.Router();

router.use(bodyParser.json());

router.post('/translate', async (req, res) => {
    const { text, language } = req.body;

    try {
        const translatedText = await controller.translateText(text, language);
        console.log('Translated Text:', translatedText);

        const sentiment = await controller.analyzeSentiment(translatedText);
        console.log('Sentiment:', sentiment);

        const audioStream = await controller.synthesizeSpeech(translatedText);
        console.log('Polly Response:', audioStream);

        if (!audioStream) {
            console.log('No audio stream received from Polly.');
            return res.status(500).json({ error: 'Audio stream not received' });
        }

        res.json({ translatedText, audioStream, sentiment });
    } catch (error) {
        console.error('Error during translation or speech synthesis:', error);
        res.status(500).json({ error: 'Translation or speech synthesis error' });
    }
});

module.exports = router;