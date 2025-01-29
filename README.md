# NitroFileUploader Vencord Plugin

FakeNitroUploader is a Vencord plugin designed to upload files larger than 10MB to a private server and return a link to the uploaded file. This allows users to bypass file size limitations in certain applications by sharing a link instead of the file itself.

## Features

- Upload files to a private server.
- Receive a link to the uploaded file.
- Share the link easily with others.

To install and configure the plugin, you can follow the steps outlined in this helpful video tutorial: [How to Install Vencord Plugins](https://www.youtube.com/watch?v=3anTy0EdvsE). Although the video is not created by me, it provides a clear and concise guide to setting up plugins.

## Server Setup

The server is implemented using Node.js and Express, with the help of the `multer` library for handling file uploads. The server is configured to store uploaded files in a local directory and serve them via a static endpoint.

In the `server` folder, you can find a sample server implementation. Install the dependencies with `yarn install` or `npm install` and run the server with `node server.js`. In new terminal, run `ngrok http 8080` to start the ngrok server. Copy link provided by ngrok and paste it in the `serverUrl` variable in the plugin settings.

If the file is very large, uploading it may take a few seconds. Please be patient.

Running the server with ngrok should look like this:

[video](https://github.com/k0aziu/NitroFileUploader/raw/refs/heads/main/tutor.mp4)

Have a nice day!
