const express = require('express');
const router = express.Router();

const {
    makePayment,
    paymentHistory,
    refundPayment
} = require('../controllers/paymentController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, makePayment);
router.get('/history', auth, paymentHistory);

router.post('/:id/refund', auth, admin, refundPayment);

module.exports = router;