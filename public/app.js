document.getElementById('generateBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value;
    if (!videoUrl) {
        alert('Please enter a valid video URL');
        return;
    }

    try {
        // Call the backend API to generate the thumbnail
        const thumbnailResponse = await fetch('/generate-thumbnail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl })
        });

        const thumbnailData = await thumbnailResponse.json();
        if (thumbnailResponse.ok) {
            // Show the thumbnail
            document.getElementById('thumbnail').src = thumbnailData.thumbnailUrl;
            document.getElementById('thumbnailContainer').classList.remove('hidden');
        } else {
            alert('Error generating thumbnail: ' + thumbnailData.message);
            return;
        }

        // Call the backend API to extract metadata
        const metadataResponse = await fetch('/extract-metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl })
        });

        const metadataData = await metadataResponse.json();
        if (metadataResponse.ok) {
            // Display the metadata
            document.getElementById('metadata').textContent = JSON.stringify(metadataData.metadata, null, 2);
            document.getElementById('metadataContainer').classList.remove('hidden');
        } else {
            alert('Error extracting metadata: ' + metadataData.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
