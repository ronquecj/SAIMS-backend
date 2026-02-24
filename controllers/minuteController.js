const MeetingMinute = require('../models/MeetingMinute');
const User = require('../models/User');

const getMinutes = async (req, res) => {
  try {
    const minutes = await MeetingMinute.find({}).sort({ date: -1 }).populate('createdBy', 'fullName');
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createMinute = async (req, res) => {
  const { title, date, content, documentUrl } = req.body;
  try {
    const minute = await MeetingMinute.create({
      title, date: new Date(date), content, documentUrl, createdBy: req.user._id, status: 'Pending'
    });
    res.status(201).json(minute);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
const reviewMinute = async (req, res) => {
  const { status, adminComment } = req.body;
  try {
    const minute = await MeetingMinute.findById(req.params.id);
    minute.status = status;
    minute.adminComment = adminComment;
    await minute.save(); 
    await User.findByIdAndUpdate(minute.createdBy, {
      $push: { notifications: { message: `Your meeting minute "${minute.title}" was ${status}. Comment: ${adminComment || 'None'}` } }
    });

    res.json(minute);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getMinutes, createMinute, reviewMinute };