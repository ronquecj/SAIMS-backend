const Announcement = require('../models/Announcement');
const User = require('../models/User');  
 
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const createAnnouncement = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const announcement = new Announcement({
      title,
      content,
      author: req.user._id, 
      authorName: req.user.fullName,  
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const updateAnnouncement = async (req, res) => {
  const { title, content } = req.body;

  try {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) { 
      const isAuthorized = req.user.role === 'Admin' ||
                           req.user.role === 'Faculty' ||  
                           req.user.subRole === 'President' ||
                           req.user.subRole === 'Secretary' ||
                           announcement.author.toString() === req.user._id.toString();

      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized to update this announcement' });
      }

      announcement.title = title || announcement.title;
      announcement.content = content || announcement.content;
      announcement.authorName = req.user.fullName; 

      const updatedAnnouncement = await announcement.save();
      res.json(updatedAnnouncement);
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        const isAuthorized = req.user.role === 'Admin' ||
                             req.user.role === 'Faculty' ||
                             req.user.subRole === 'President' ||
                             req.user.subRole === 'Secretary' ||
                             announcement.author.toString() === req.user._id.toString();

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to delete this announcement' });
        }

      await Announcement.deleteOne({ _id: req.params.id });
      res.json({ message: 'Announcement removed' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};