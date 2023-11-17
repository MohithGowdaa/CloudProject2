const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');
const config = require('./config'); // Import the 'config' file containing AWS credentials

const app = express();
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// Set AWS credentials using environment variables
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_DEFAULT_REGION
});

// Initialize Amazon Translate and Polly clients
const translate = new AWS.Translate();
const Polly = new AWS.Polly();

app.post('/translate', async (req, res) => {
    const { text, language } = req.body;

    const translateParams = {
        Text: text,
        SourceLanguageCode: 'auto',
        TargetLanguageCode: language,
    };

    try {
        // Translate text
        const translatedData = await translate.translateText(translateParams).promise();
        const translatedText = translatedData.TranslatedText;

        console.log('Translated Text:', translatedText);

        // Synthesize speech from translated text using Amazon Polly
        const speechParams = {
            OutputFormat: 'mp3',
            Text: translatedText,
            VoiceId: 'Joanna'
        };

        const pollyResponse = await Polly.synthesizeSpeech(speechParams).promise();

        console.log('Polly Response:', pollyResponse);

        if (!pollyResponse || !pollyResponse.AudioStream) {
            console.log('No audio stream received from Polly.');
            return res.status(500).json({ error: 'Audio stream not received' });
        }

        // Send back translated text and audio stream URL to the client
        res.json({ translatedText, audioStream: pollyResponse.AudioStream });
    } catch (error) {
        console.error('Error during translation or speech synthesis:', error);
        res.status(500).json({ error: 'Translation or speech synthesis error' });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
