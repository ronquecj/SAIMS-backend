const mongoose = require('mongoose');
const minuteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    documentUrl: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Disapproved'], default: 'Pending' },
    adminComment: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });
module.exports = mongoose.model('MeetingMinute', minuteSchema);