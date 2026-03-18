const mongoose = require('mongoose');
const renderHourSchema = new mongoose.Schema({
    month: String,
    cutoffPeriod: String,
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('RenderHour', renderHourSchema);