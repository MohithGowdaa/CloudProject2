const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION 
});

const translate = new AWS.Translate();
const Polly = new AWS.Polly();
const Comprehend = new AWS.Comprehend();

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

async function analyzeSentiment(text) {
    const sentimentParams = {
        LanguageCode: 'en', 
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
