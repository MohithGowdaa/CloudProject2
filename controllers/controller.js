const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controllers/controller');
const path = require('path');

const app = express();

// Initialize AWS SDK and set credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

// Initialize Amazon Translate, Polly, and Comprehend clients
const translate = new AWS.Translate();
const Polly = new AWS.Polly();
const Comprehend = new AWS.Comprehend();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/translate', async (req, res) => {
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




// Function to translate text
async function translateText(text, language) {
    const translateParams = {
        Text: text,
        SourceLanguageCode: 'auto',
        TargetLanguageCode: language,
    };

    try {
        const translatedData = await translate.translateText(translateParams).promise();
        return translatedData.TranslatedText;
    } catch (error) {
        throw error;
    }
}

// Function to synthesize speech
async function synthesizeSpeech(translatedText) {
    const speechParams = {
        OutputFormat: 'mp3',
        Text: translatedText,
        VoiceId: 'Joanna'
    };

    try {
        const pollyResponse = await Polly.synthesizeSpeech(speechParams).promise();
        return pollyResponse.AudioStream;
    } catch (error) {
        throw error;
    }
}

// Function to perform sentiment analysis
async function analyzeSentiment(text) {
    const sentimentParams = {
        LanguageCode: 'en', // Assuming the translated text is in English, adjust accordingly
        Text: text
    };

    try {
        const sentimentData = await Comprehend.detectSentiment(sentimentParams).promise();
        return sentimentData.Sentiment;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    translateText,
    synthesizeSpeech,
    analyzeSentiment
};
