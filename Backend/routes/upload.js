const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload image - convert to base64 and return data URL
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('Upload request received');

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File received:', req.file.originalname, req.file.size, 'bytes');

        // Convert buffer to base64 data URL
        const base64Image = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        console.log('Image converted to base64, size:', dataUrl.length, 'characters');

        res.json({
            success: true,
            url: dataUrl
        });

    } catch (error) {
        console.error('Upload route error:', error);
        res.status(500).json({
            message: 'Failed to process image',
            error: error.message
        });
    }
});

module.exports = router;
