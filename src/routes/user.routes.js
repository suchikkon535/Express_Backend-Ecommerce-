const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const userCtrl = require("../controllers/user.controller");
const { authRoles } = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

// Protected routes
router.get("/", auth, userCtrl.getUsers);
router.put("/update", auth, userCtrl.updateUser);
router.delete("/delete", auth, userCtrl.deleteUser);
router.get("/userInfo/:role", auth, authRoles("admin"), userCtrl.getUsersByRole);

// Public routes
router.post("/create", upload.single("avatar"), validate({ body: ["name", "email", "password"] }), userCtrl.createUser);
router.post("/login", validate({ body: ["email", "password"] }), userCtrl.loginUser);

module.exports = router;