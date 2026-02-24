const express = require('express');
const router = express.Router();
const {
  getVerificationList,
  saveVerification,
  getHistoryList,
  updateHistoryStatus
} = require('../controllers/treasurerController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');
 
router.use(protect, authorizeSubRoles('Treasurer'));
 
router.get('/verification', getVerificationList);
 
router.post('/verification', saveVerification);
 
router.get('/history', getHistoryList);
 
router.put('/history/status', updateHistoryStatus);

module.exports = router;