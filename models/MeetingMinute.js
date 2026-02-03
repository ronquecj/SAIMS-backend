const mongoose = require('mongoose');

const minuteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    attendees: [{ type: String }],
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MeetingMinute', minuteSchema);