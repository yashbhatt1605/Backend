const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
    '/',
    auth,
    admin,
    upload.single('image'),
    createProduct
);

router.put(
    '/:id',
    auth,
    admin,
    upload.single('image'),
    updateProduct
);

router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
