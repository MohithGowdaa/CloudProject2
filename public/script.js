const translateButton = document.getElementById('translateButton');
const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translatedOutput = document.getElementById('translatedOutput');
const sentimentOutput = document.getElementById('sentimentOutput'); // Added element reference

translateButton.addEventListener('click', async () => {
    const text = inputText.value;
    const language = targetLanguage.value;

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, language }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log('Received Data:', data);

        translatedOutput.innerText = `Translated Text: ${data.translatedText}`;

        // Displaying sentiment analysis result
        sentimentOutput.innerText = `Sentiment Analysis: ${data.sentiment}`;

        const audioPlayer = document.getElementById('audioPlayer');

        if (data.audioStream && data.audioStream.data && data.audioStream.data.length > 0) {
            const audioData = new Uint8Array(data.audioStream.data);
            const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
            const audioURL = URL.createObjectURL(audioBlob);

            audioPlayer.src = audioURL;
            audioPlayer.style.display = 'block';
            audioPlayer.play(); // Attempt to play the audio
        } else {
            console.log('No audio stream received.');
            audioPlayer.src = '';
            audioPlayer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
