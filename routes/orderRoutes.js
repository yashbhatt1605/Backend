const express = require('express');
const router = express.Router();

const {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, createOrder);

router.get('/', auth, admin, getOrders);
router.get('/:id', auth, getOrder);

router.put('/:id', auth, admin, updateOrder);
router.delete('/:id', auth, admin, deleteOrder);

module.exports = router;