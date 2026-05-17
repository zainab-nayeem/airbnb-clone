const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'staypink' },
        (err, r) => err ? reject(err) : resolve(r)
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;