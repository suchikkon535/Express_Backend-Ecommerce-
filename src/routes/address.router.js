const express = require('express');
const router = express.Router();
const addressCtrl = require('../controllers/address.controller');
const validate = require('../middleware/validate.middleware');
const auth = require('../middleware/auth.middleware');
const { authRoles } = require('../middleware/role.middleware');

router.use(auth);
router.use(authRoles("user"));

router.post("/addressCreate", validate({body: ['fullName', 'phone', 'addressLine', 'city', 'state', 'postalCode']}), addressCtrl.createAdderss)
router.get("/allAddress", addressCtrl.userAllAddress)
module.exports = router;
