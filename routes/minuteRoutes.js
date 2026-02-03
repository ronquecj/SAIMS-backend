const express = require('express');
const router = express.Router();
const { getMinutes, createMinute } = require('../controllers/minuteController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');
 
router.use(protect, authorizeSubRoles('Secretary'));

router.get('/', getMinutes);
router.post('/', createMinute);

module.exports = router;