const mongoose = require('mongoose');
const renderHourSchema = new mongoose.Schema({
    month: String,
    cutoffPeriod: String,
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hours: Number,
}, { timestamps: true });
module.exports = mongoose.model('RenderHour', renderHourSchema);