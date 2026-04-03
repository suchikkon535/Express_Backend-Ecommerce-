const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { authRoles } = require('../middleware/role.middleware');
const cartCtrl = require('../controllers/cart.controller')

router.use(auth);

router.post('/addToCart', validate({body: ['itemId', 'quantity']}), cartCtrl.addToCart);
router.get('/userCartItems', cartCtrl.userCartItems)

module.exports = router;