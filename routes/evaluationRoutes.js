const express = require('express');
const router = express.Router();
const { submitEvaluation, getFacultyHistory } = require('../controllers/evaluationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeRoles('Faculty'));

router.post('/', submitEvaluation);
router.get('/history', getFacultyHistory);

module.exports = router;