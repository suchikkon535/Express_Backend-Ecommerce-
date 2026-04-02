const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const upload = require('../middleware/upload.middleware');
const itemCtrl = require('../controllers/item.controller');


router.post('/create', auth, upload.single('image'), validate({ body: ['title', 'description', 'price'] }), itemCtrl.createItem);
router.get('/allItems', itemCtrl.getAllItems);
router.get('/userItems', auth, itemCtrl.getUserItems);
router.post('/itemInfo', validate({ body: ['itemId'] }), itemCtrl.itemInfo);

module.exports = router;