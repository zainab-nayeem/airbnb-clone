const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user.id });
    res.json(booking);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('listing');
    res.json(bookings);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
