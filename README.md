# Video Metadata & Thumbnail Generator

This project provides a simple API to extract metadata and generate thumbnails for videos. It uses **FFmpeg** to extract frames and **sharpness** to select the best frame to generate a thumbnail. The API endpoints allow you to generate thumbnails for video files and retrieve metadata such as codec information.

## Features
- Generate thumbnails from video URLs.
- Extract video metadata such as codec and stream information.
- Evaluate frames for sharpness to select the best thumbnail.

## Prerequisites
Before running the project, make sure you have the following installed on your machine:

- **Node.js** (>= 18.x)
- **FFmpeg** (Make sure FFmpeg is installed and accessible in the system path)

If you don't have FFmpeg installed, you can download it from [here](https://ffmpeg.org/download.html).

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/frayhan94/video-thumbnail-generator.git
    cd video-thumbnail-metadata-generator
    ```

2. **Install dependencies**:

   Run the following command to install the required npm packages:

    ```bash
    npm install
    ```

3. **Ensure FFmpeg is installed**:

   Make sure that FFmpeg is installed and accessible from the command line. You can check by running:

    ```bash
    ffmpeg -version
    ```

   If FFmpeg is not installed, please follow the [installation guide](https://ffmpeg.org/download.html).

## Usage

1. **Start the server**:

   Run the following command to start the server:

    ```bash
    npm start
    ```

   This will start the server on `http://localhost:3000`.

2. **API Endpoints**:

    - **Generate Thumbnail**:

      **POST** `http://localhost:3000/generate-thumbnail`

      This endpoint generates a thumbnail for a video based on its sharpness.

      **Request Body**:
      ```json
      {
        "videoUrl": "https://path/to/your/video.mp4"
      }
      ```

      **Response**:
      ```json
      {
        "message": "Thumbnail generated successfully",
        "thumbnailUrl": "/thumbnails/thumbnail.png"
      }
      ```

      The thumbnail is saved as `thumbnail.png` in the `thumbnails` directory, and you can access it from the URL `/thumbnails/thumbnail.png`.

    - **Extract Video Metadata**:

      **POST** `http://localhost:3000/extract-metadata`

      This endpoint extracts the metadata of a video (such as codec, resolution, etc.).

      **Request Body**:
      ```json
      {
        "videoUrl": "https://path/to/your/video.mp4"
      }
      ```

      **Response**:
      ```json
      {
        "metadata": {
          "streams": [
            {
              "index": 0,
              "codec_name": "aac",
              "codec_long_name": "AAC (Advanced Audio Coding)",
              "profile": "LC",
              "codec_type": "audio"
            }
          ]
        }
      }
      ```

3. **Accessing the Thumbnail**:

   Once the thumbnail is generated, it can be accessed via the `/thumbnails/thumbnail.png` URL. Ensure the `thumbnails` folder is accessible from your server's public directory or set up static serving for it.

   **Example**: If the server is running locally, open `http://localhost:3000/thumbnails/thumbnail.png` in your browser to view the generated thumbnail.

