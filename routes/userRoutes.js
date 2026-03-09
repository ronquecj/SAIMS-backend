const express = require('express');
const router = express.Router();
const { createUserByAdmin } = require('../controllers/authController');
const { 
  getStudentAssistants, 
  getFacultyAndAdmin, 
  assignFaculty, 
  updateRenderHours, 
  getUserById,
  updateProfile,   
readNotifications,
  deleteUser
} = require('../controllers/userController'); 
const Offense = require('../models/Offense');
const { protect, authorizeRoles, authorizeSubRoles } = require('../middleware/authMiddleware');
const User = require('../models/User');
 
router.post('/create', protect, authorizeRoles('Admin'), createUserByAdmin);
router.get('/students', protect, authorizeRoles('Admin', 'Faculty', 'Student Assistant'), getStudentAssistants);
router.get('/faculty-and-admin', protect, authorizeRoles('Admin'), getFacultyAndAdmin);
router.put('/assign-faculty', protect, authorizeRoles('Admin'), assignFaculty);
router.put('/update-hours/:studentId', protect, authorizeSubRoles('Timekeeper'), updateRenderHours);
 
router.put('/profile', protect, updateProfile);
router.put('/notifications/read', protect, readNotifications);

router.get('/profile', protect, (req, res) => { 
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.get('/my-offenses', protect, async (req, res) => {
    try {
        const offenses = await Offense.find({ studentAssistant: req.user._id });
        res.json(offenses);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, getUserById);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteUser);

router.put('/status/:id', protect, authorizeRoles('Admin'), async (req, res) => {
    const user = await User.findById(req.params.id);
    user.isActive = req.body.isActive;
    await user.save();
    res.json({ message: 'Status updated' });
});

module.exports = router;