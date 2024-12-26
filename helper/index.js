const fs = require("fs");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const urlValidator = require('valid-url');
const sharp = require("sharp");

const isValidUrl = (videoUrl) => {
    if (!urlValidator.isUri(videoUrl)) {
        return false;
    }
    return true;
};

const extractFrames = (videoUrl, outputFolder) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
            .on('end', () => resolve('Frames extracted successfully'))
            .on('error', (err) => {
                console.error('FFmpeg Error:', err);
                reject(err);
            })
            .on('stderr', (stderr) => {
                console.log('FFmpeg stderr:', stderr);
            })
            .screenshots({
                timestamps: ['1%', '10%', '20%', '30%'],
                filename: '%b-%04d.png',
                folder: outputFolder,
            });
    });
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

const evaluateFrameSharpness = (framePath) => {
    return sharp(framePath)
        .metadata()
        .then((metadata) => {
            return metadata.width * metadata.height;
        });
};

const generateThumbnail = (videoUrl, thumbnailPath, outputFolder) => {
    return new Promise(async (resolve, reject) => {
        if (!isValidUrl(videoUrl)) {
            return reject({ message: "Invalid video URL format." });
        }

        if (fs.existsSync(thumbnailPath)) {
            resolve("Thumbnail already exists");
            return;
        }

        try {
            // Step 1: Extract frames at regular intervals
            await extractFrames(videoUrl, outputFolder);

            // Step 2: Evaluate frames for sharpness (visual appeal)
            const frameFiles = fs.readdirSync(outputFolder).filter(file => file.endsWith('.png'));
            let bestFrames = [];

            for (let frameFile of frameFiles) {
                const framePath = path.join(outputFolder, frameFile);
                const sharpness = await evaluateFrameSharpness(framePath);

                // Add frame to bestFrames array if it has sufficient sharpness
                if (sharpness > 500000) {  // Threshold for sharpness (adjust as needed)
                    bestFrames.push({ framePath, sharpness });
                }
            }

            // Step 3: Sort frames by sharpness (highest first)
            bestFrames.sort((a, b) => b.sharpness - a.sharpness);

            // Step 4: Select the best frame (top sharpest frame)
            if (bestFrames.length > 0) {
                const bestFrame = bestFrames[0].framePath;
                fs.copyFileSync(bestFrame, thumbnailPath);  // Copy the best frame as the thumbnail

                resolve("Thumbnail created from the sharpest frame");
            } else {
                reject({ message: "No sharp frames found" });
            }
        } catch (err) {
            console.log('err',err)
            reject({ message: "Error generating thumbnail", error: err.message });
        }
    });
};

module.exports = {
    extractMetadata,
    generateThumbnail
};
