const express = require('express');
const multer = require('multer');
const { Event } = require('../models/Event');
const path = require('path');
const fs = require('fs');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Use the isAdmin middleware directly

const router = express.Router();

// Storage config for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create new event (Protected Route)
router.post('/', verifyToken, isAdmin, upload.any(), async (req, res) => {
  try {
    // Destructure data from the request body
    const { name, date, time, venue } = req.body;

    // Handle image upload
    const imageUrl =
      req.files && req.files.length > 0
        ? `/uploads/${req.files[0].filename}`
        : '';

    // Validate required fields
    if (!name || !date || !time || !venue) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the event and save it to the database
    const event = await Event.create({
      name,
      date,
      time,
      venue,
      image: imageUrl,
    });

    // Send success response
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res
      .status(500)
      .json({ message: 'Event creation failed', error: err.message });
  }
});

// Get all events (Public Route)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch events', error: err.message });
  }
});

// Duplicate route kept for compatibility
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch events', error: err.message });
  }
});

// Update Event (Protected Route)
router.put('/:id', verifyToken, isAdmin, upload.any(), async (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, date, time, venue } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Update fields
    if (name) event.name = name;
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = venue;

    // If new image uploaded, replace it
    if (req.files && req.files.length > 0) {
      const newImage = `/uploads/${req.files[0].filename}`;

      // Remove old image if exists
      if (event.image && fs.existsSync('.' + event.image)) {
        fs.unlinkSync('.' + event.image);
      }

      event.image = newImage;
    }

    await event.save();
    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    console.error('Error updating event:', err);
    res
      .status(500)
      .json({ message: 'Failed to update event', error: err.message });
  }
});

// Delete Event (Protected Route)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Delete image if exists
    if (event.image && fs.existsSync('.' + event.image)) {
      fs.unlinkSync('.' + event.image);
    }

    await Event.findByIdAndDelete(eventId);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res
      .status(500)
      .json({ message: 'Failed to delete event', error: err.message });
  }
});

module.exports = router;
