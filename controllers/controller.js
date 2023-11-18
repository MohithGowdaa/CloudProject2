const AWS = require('aws-sdk');
const config = require('../config');

// Set AWS credentials using environment variables
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_DEFAULT_REGION
});

// Initialize Amazon Translate and Polly clients
const translate = new AWS.Translate();
const Polly = new AWS.Polly();

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
module.exports = {
    translateText,
    synthesizeSpeech
};
