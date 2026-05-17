const router = require('express').Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: 'dg0cltwdf',
  api_key: '274114837395692',
  api_secret: 'eaCBISAEceeo9_8n388W9Ck6p3o'
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { location, category } = req.query;
    let filter = {};
    if (location) filter.location = new RegExp(location, 'i');
    if (category) filter.category = category;
    const listings = await Listing.find(filter).populate('owner', 'name');
    res.json(listings);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id });
    res.json(listings);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, { folder: 'staypink' });
        imageUrls.push(result.secure_url);
      }
    }
    const amenities = req.body.amenities
      ? req.body.amenities.split(',').map(a => a.trim())
      : [];
    const listing = await Listing.create({
      ...req.body,
      amenities,
      images: imageUrls,
      owner: req.user.id
    });
    res.json(listing);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name');
    res.json(listing);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;