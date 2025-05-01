// Updated registrationRoutes.js

const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { Event } = require('../models/Event');
const { verifyToken } = require('../middleware/authMiddleware'); // 🔥 Imported verifyToken middleware

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, eventId } = req.body;

    // Fetch the event from the database
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if this email is already registered for the event
    const alreadyRegistered = event.registrations.find(
      (reg) => reg.email === email
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // Generate a new UUID for this registration
    const uuid = uuidv4();
    const qrCodeDataURL = await QRCode.toDataURL(uuid);
    if (!qrCodeDataURL) {
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }

    // Create the registration object with the UUID and QR code
    const registration = {
      name,
      email,
      phone,
      uuid,
      qrCode: qrCodeDataURL,
      checkedIn: false,
      registeredAt: new Date(),
      checkedInAt: null,
    };

    // Push the registration to the event's registrations array
    event.registrations.push(registration);
    console.log("Registering:", { uuid, email, phone, eventId });

    // Save the updated event back to the database
    await event.save();

    // Send a successful response with the registration data
    res.status(201).json({
      message: 'Registration successful',
      data: registration,
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Registration failed', error: err });
  }
});


// Validate QR Code (Public Route)
router.post('/validate', async (req, res) => {
  const { uuid } = req.body;
  try {
    const event = await Event.findOne({ 'registrations.uuid': uuid });

    // If the QR code is invalid (not found in any event)
    if (!event) {
      return res.status(404).json({ message: 'Invalid QR Code' });
    }

    const registration = event.registrations.find((r) => r.uuid === uuid);

    // If the QR code has already been checked-in
    if (registration.checkedIn) {
      return res.status(400).json({ message: 'This QR Code has already been scanned.' });
    }

    // Mark the registration as checked-in
    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    await event.save();

    // Send a valid user response
    res.json({
      message: 'Valid user',
      data: {
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        eventName: event.name,
        eventDate: `${event.date} ${event.time}`,
        eventVenue: event.venue,
        checkedIn: registration.checkedIn,
      },
    });
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ message: 'Validation failed', error: err });
  }
});


// Get all registrations (Protected Route)
// 🔥 Added verifyToken middleware
router.get('/all', verifyToken, async (req, res) => {
  try {
    const events = await Event.find();

    const registrations = events.flatMap((event) =>
      event.registrations.map((reg) => ({
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        eventName: event.name,
        eventVenue: event.venue,
        eventDate: `${event.date} ${event.time}`,
        checkedIn: reg.checkedIn,
        registeredAt: reg.registeredAt,
        checkedInAt: reg.checkedInAt,
      })),
    );

    res.json({ data: registrations });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

// Decode QR Code (Public Route)
router.post('/decode', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: 'Image is required' });

  const QRReader = require('qrcode-reader');
  const Jimp = require('jimp');

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const jimpImage = await Jimp.read(buffer);
    const qr = new QRReader();

    const result = await new Promise((resolve, reject) => {
      qr.callback = (err, value) => {
        if (err || !value || !value.result) {
          return reject('Failed to decode QR');
        }
        resolve(value.result);
      };
      qr.decode(jimpImage.bitmap);
    });

    res.json({ uuid: result });
  } catch (err) {
    console.error('Decode Error:', err);
    res.status(500).json({ message: 'Failed to decode QR', error: err });
  }
});

// Get all registrations for a specific event (Protected Route)
// 🔥 Added verifyToken middleware
router.get('/event/:eventId', verifyToken, async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registrations = event.registrations.map((reg) => ({
      name: reg.name,
      email: reg.email,
      phone: reg.phone,
      uuid: reg.uuid,
      qrCode: reg.qrCode,
      checkedIn: reg.checkedIn,
      registeredAt: reg.registeredAt,
      checkedInAt: reg.checkedInAt,
    }));

    res.json({
      eventName: event.name,
      eventDate: `${event.date} ${event.time}`,
      eventVenue: event.venue,
      registrations,
    });
  } catch (err) {
    console.error('Error fetching event registrations:', err);
    res.status(500).json({
      message: 'Failed to fetch registrations for this event',
      error: err,
    });
  }
});

// Get all events (Public Route)
router.get('/events/all', async (req, res) => {
  try {
    const events = await Event.find().select('name _id');
    res.json({ events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

module.exports = router;
