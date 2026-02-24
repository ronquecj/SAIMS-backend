const express = require('express');
const router = express.Router();
const { getMinutes, createMinute, reviewMinute } = require('../controllers/minuteController');
const { protect, authorizeRoles, authorizeSubRoles } = require('../middleware/authMiddleware');
 
router.get('/', protect, getMinutes);
 
router.post('/', protect, authorizeSubRoles('Secretary'), createMinute);
 
router.put('/:id/review', protect, authorizeRoles('Admin'), reviewMinute);

module.exports = router;