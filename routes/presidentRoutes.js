const express = require('express');
const router = express.Router();
const { 
    getOffenses, 
    addOffense, 
    toggleResolved, 
    saveReport 
} = require('../controllers/presidentController');
const { protect, authorizeSubRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeSubRoles('President'));
 
router.get('/offenses/:studentId', getOffenses);
router.post('/offenses/:studentId', addOffense);
router.put('/offenses/resolve/:id', toggleResolved);
 
router.post('/reports', saveReport);

module.exports = router;