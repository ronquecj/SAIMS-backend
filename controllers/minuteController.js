const MeetingMinute = require('../models/MeetingMinute');
 
const getMinutes = async (req, res) => {
  try {
    const minutes = await MeetingMinute.find({}).sort({ date: -1 });
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const createMinute = async (req, res) => {
  const { title, date, content } = req.body;

  if (!title || !date || !content) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const minute = await MeetingMinute.create({
      title,
      date: new Date(date),
      content,
      createdBy: req.user._id,
    });

    res.status(201).json(minute);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getMinutes,
  createMinute,
};