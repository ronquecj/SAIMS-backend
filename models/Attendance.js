const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    semester: String,
    month: String,
    cutoffPeriod: String,
    lateMinutes: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Attendance', attendanceSchema);