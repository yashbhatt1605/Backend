const express = require('express');
const router = express.Router();

const {
    dashboard,
    getAnalytics,
    settings
} = require('../controllers/adminController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard', auth, admin, dashboard);
router.get('/analytics', auth, admin, getAnalytics);
router.put('/settings', auth, admin, settings);

module.exports = router;
