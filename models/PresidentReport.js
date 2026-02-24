const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    year: String,
    month: String,
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('PresidentReport', reportSchema);