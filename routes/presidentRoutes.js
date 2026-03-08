const express = require('express');
const router = express.Router();
const { getOffenses, getAllOffenses, addOffense, updateOffense, saveReport } = require('../controllers/presidentController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeSubRoles('President'));

router.get('/offenses/all', getAllOffenses);  
router.get('/offenses/:studentId', getOffenses);
router.post('/offenses/:studentId', addOffense);
router.put('/offenses/:id', updateOffense); 
router.post('/reports', saveReport);

module.exports = router;