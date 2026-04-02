const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const userCtrl = require("../controllers/user.controller");
const { authRoles } = require("../middleware/role.middleware");


router.get("/", auth, userCtrl.getUsers);
router.post("/create", validate({ body: ["name", "email", "password"] }), userCtrl.createUser);
router.put("/update", auth, userCtrl.updateUser);
router.delete("/delete", auth, userCtrl.deleteUser);
router.post("/login", validate({ body: ["email", "password"] }), userCtrl.loginUser);
router.get("/userInfo/:role", auth, authRoles("admin"), userCtrl.getUsersByRole);
// router.get(
//     "/users/role/:role",
//     auth,
//     authRoles("admin"),
//     userCtrl.getUsersByRole
// );

module.exports = router;