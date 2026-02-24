const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    authorName: { type: String, required: true },
    audience: { type: String, enum: ['All', 'Student Assistants', 'Faculty', 'EOSA'], default: 'All' },
    documentUrl: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Announcement', announcementSchema);