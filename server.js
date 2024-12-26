const express = require('express');
const path = require('path');
const app = express();

const {extractMetadata,generateThumbnail} = require('./helper/index');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/generate-thumbnail', async (req, res) => {
    const { videoUrl } = req.body;
    const thumbnailPath = path.join(__dirname, 'thumbnails', 'thumbnail.png');
    const outputFolder = path.join(__dirname, 'frames');

    try {
        await generateThumbnail(videoUrl, thumbnailPath,outputFolder);
        res.json({ message: 'Thumbnail generated successfully', thumbnailUrl: '/thumbnails/thumbnail.png' });
    } catch (error) {
        res.status(500).json({ message: 'Error generating thumbnail', error: error.message });
    }
});

app.post('/extract-metadata', async (req, res) => {
    const { videoUrl } = req.body;

    try {
        const metadata = await extractMetadata(videoUrl);
        res.json({ metadata });
    } catch (error) {
        res.status(500).json({ message: 'Error extracting metadata', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
