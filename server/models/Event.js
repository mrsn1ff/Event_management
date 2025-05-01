const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  qrCode: { type: String, required: true },
  uuid: { type: String, required: true, index: false },
  checkedIn: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date, default: null },
}, { _id: false });

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String },
  registrations: [registrationSchema],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
