const mongoose = require('mongoose');
const offenseSchema = new mongoose.Schema({
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    description: String,
    documentUrl: String,
    isResolved: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Offense', offenseSchema);