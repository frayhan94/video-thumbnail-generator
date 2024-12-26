const fs = require("fs");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const urlValidator = require('valid-url');  // Install valid-url to validate URL format


const isValidUrl = (videoUrl) => {
    if (!urlValidator.isUri(videoUrl)) {
        return false;
    }
    return true;
};
const extractMetadata = (videoUrl) => {
    return new Promise((resolve, reject) => {
        if(!isValidUrl(videoUrl)) {
            return reject({ message: 'Invalid URL format'})
        }
        axios
            .head(videoUrl)
            .then(response => {
                if(response.status !==200) {
                    return reject({ message: 'Unable to access video URL.'})
                }
                ffmpeg.ffprobe(videoUrl, (err, metadata) => {
                    if (err) {
                        return reject({
                            message: "Error extracting metadata. The video might be in an unsupported format.",
                            error: err.message,
                        });
                    }
                    resolve(metadata);
                });
            })
            .catch(err => {
            return reject({
                message: "Error accessing the video URL. Please check the URL.",
                error: err.message,
            });
        });
    });
};

const generateThumbnail = (videoUrl, thumbnailPath) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(thumbnailPath)) {
            resolve('Thumbnail already exists');
            return;
        }

        ffmpeg(videoUrl)
            .on('end', () => resolve('Thumbnail created'))
            .on('error', (err) => reject(err))
            .screenshots({
                timestamps: ['50%'],
                filename: 'thumbnail.png',
                folder: path.dirname(thumbnailPath),
                size: '320x240',
            });
    });
};

module.exports = {
    extractMetadata,
    generateThumbnail
};
