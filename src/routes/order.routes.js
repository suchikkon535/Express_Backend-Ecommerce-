const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const { apiLimiter } = require('../middleware/rateLimiter.middleware');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { authRoles } = require('../middleware/role.middleware');

router.use(auth);
router.use(authRoles("user"));

router.post('/create', apiLimiter, orderCtrl.createOrder);

module.exports = router;
