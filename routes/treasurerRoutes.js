const express = require('express');
const router = express.Router();
const {
  getStudentsForVerification,
  updateAllowanceEligibility,
  getAllowanceHistory,
  recordPayment,
} = require('../controllers/treasurerController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');
 
router.use(protect, authorizeSubRoles('Treasurer'));

router.get('/verification', getStudentsForVerification);
router.put('/verification/:studentId', updateAllowanceEligibility);
router.get('/history', getAllowanceHistory);
router.post('/record-payment/:studentId', recordPayment);

module.exports = router;