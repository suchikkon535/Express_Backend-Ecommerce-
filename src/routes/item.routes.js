const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const upload = require('../middleware/upload.middleware');
const itemCtrl = require('../controllers/item.controller');
const { authRoles } = require('../middleware/role.middleware');

router.use(auth);

router.post('/create', authRoles("admin"), upload.single('image'), validate({ body: ['title', 'description', 'price'] }), itemCtrl.createItem);
router.get('/allItems', authRoles("user", "admin", "worker"), itemCtrl.getAllItems);
router.get('/userItems', authRoles("admin", "worker"), itemCtrl.getUserItems);
router.post('/itemInfo', authRoles("user", "admin", "worker"), validate({ body: ['itemId'] }), itemCtrl.itemInfo);

module.exports = router;