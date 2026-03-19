const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
 
router.get('/', protect, getAnnouncements);
 
router.post(
  '/',
  protect,
  authorizeRoles('Admin', 'Faculty', 'EOSA'),
  (req, res, next) => { 
    if (req.user.role === 'EOSA' && !['President', 'Secretary'].includes(req.user.subRole)) {
      return res.status(403).json({ message: 'Only President or Secretary SA can create announcements' });
    }
    next();
  },
  createAnnouncement
);
 
router.put(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Faculty', 'EOSA'),
  (req, res, next) => {  
    if (req.user.role === 'EOSA' && !['President', 'Secretary'].includes(req.user.subRole)) {
      return res.status(403).json({ message: 'Only President or Secretary SA can update announcements' });
    }
    next();
  },
  updateAnnouncement
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Faculty', 'EOSA'),
  (req, res, next) => {  
    if (req.user.role === 'EOSA' && !['President', 'Secretary'].includes(req.user.subRole)) {
      return res.status(403).json({ message: 'Only President or Secretary SA can delete announcements' });
    }
    next();
  },
  deleteAnnouncement
);

module.exports = router;