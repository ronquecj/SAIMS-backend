const express = require('express');
const router = express.Router();
const {
  createLeaveRequest,
  getMyLeaveHistory,
  getAllLeaveRequests,
  updateLeaveStatus,
} = require('../controllers/leaveController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');

// SA Routes
router.post('/request', protect, createLeaveRequest); 
router.get('/my-history', protect, getMyLeaveHistory);

// Timekeeper Routes
router.get('/', protect, authorizeSubRoles('Timekeeper'), getAllLeaveRequests);
router.put('/:id', protect, authorizeSubRoles('Timekeeper'), updateLeaveStatus);

module.exports = router;