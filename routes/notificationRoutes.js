const express = require('express');
const router = express.Router();

const {
    getNotifications,
    sendNotification,
    deleteNotification
} = require('../controllers/notificationController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, getNotifications);

router.post('/', auth, admin, sendNotification);

router.delete('/:id', auth, deleteNotification);

module.exports = router;