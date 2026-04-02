const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { authRoles } = require("../middleware/role.middleware");
const adminCtrl = require("../controllers/admin.controller");

router.use(auth);
router.use(authRoles("admin"));

router.get("/users", adminCtrl.getAllUsers);
router.put("/users/:id/role", adminCtrl.updateUserRole);
router.delete("/users/:id", adminCtrl.deleteUserById);
router.get("/items", adminCtrl.getItems);

module.exports = router;
