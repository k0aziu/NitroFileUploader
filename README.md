# FakeNitroUploader Vencord Plugin

FakeNitroUploader is a Vencord plugin designed to upload files larger than 10MB to a private server and return a link to the uploaded file. This allows users to bypass file size limitations in certain applications by sharing a link instead of the file itself.

## Features

- Upload files to a private server.
- Receive a link to the uploaded file.
- Share the link easily with others.

To install and configure the plugin, you can follow the steps outlined in this helpful video tutorial: [How to Install Vencord Plugins](https://www.youtube.com/watch?v=3anTy0EdvsE). Although the video is not created by me, it provides a clear and concise guide to setting up plugins.

## Server Setup

The server is implemented using Node.js and Express, with the help of the `multer` library for handling file uploads. The server is configured to store uploaded files in a local directory and serve them via a static endpoint.

## Server Code
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 80;

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${sanitizedFilename}`);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file to upload.' });
    }

    const fileLink = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log(fileLink);
    res.status(200).json({ fileLink: fileLink, fileName: req.file.originalname, fileSize: req.file.size });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```

Running the server with ngrok should look like this:

![](https://github.com/k0aziu/NitroFileUploader/raw/refs/heads/main/tutor.gif)

I used ngrok for testing, and it works great.