const router = require('express').Router();
const controller = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.get('/', auth, admin, controller.getUsers);
router.get('/:id', auth, controller.getUser);
router.put('/:id', auth, controller.updateUser);
router.delete('/:id', auth, admin, controller.deleteUser);
module.exports = router;
