const express = require('express');
const router = express.Router();
const { getRenderHours, saveRenderHours,getAttendance,saveAttendance } = require('../controllers/timekeeperController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeSubRoles('Timekeeper'));
router.get('/render-hours', getRenderHours);
router.post('/render-hours', saveRenderHours);
router.get('/attendance', getAttendance);
router.post('/attendance', saveAttendance);
module.exports = router;