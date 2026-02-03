const express = require('express');
const router = express.Router();
const { createUserByAdmin } = require('../controllers/authController');
const { getStudentAssistants, getFacultyAndAdmin, assignFaculty, updateRenderHours, getUserById } = require('../controllers/userController'); 
const { protect, authorizeRoles, authorizeSubRoles } = require('../middleware/authMiddleware');
 
router.post('/create', protect, authorizeRoles('Admin'), createUserByAdmin);
 
router.get('/students', protect, authorizeRoles('Admin', 'Faculty', 'Student Assistant'), getStudentAssistants);
 
router.get('/faculty-and-admin', protect, authorizeRoles('Admin'), getFacultyAndAdmin);
 
router.put('/assign-faculty', protect, authorizeRoles('Admin'), assignFaculty);

router.put('/update-hours/:studentId', protect, authorizeSubRoles('Timekeeper'), updateRenderHours);

router.get('/profile', protect, (req, res) => { 
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.get('/:id', protect, getUserById);

module.exports = router;