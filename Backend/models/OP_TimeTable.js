const mongoose = require('mongoose');

const fixedSlotSchema = new mongoose.Schema({
  division: { type: String, required: true },
  day: { type: Number, required: true },
  period: { type: Number, required: true },
  teacher: { type: String, required: true },
  room: { type: String, required: true },
  subject: { type: String, required: true },
});

module.exports = mongoose.model('Division', fixedSlotSchema);
