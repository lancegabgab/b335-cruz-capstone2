const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

const auth = require("../auth");
//Deconstructed the auth to directly access verify function and verifyAdmin
const {verify, verifyAdmin} = auth;


// all the routes / requirements of controllers (services)
router.post("/", userController.registerUser);

//login for both users and admin
router.post("/login", userController.loginUser);

//retrieve all users
router.get("/all", verify, verifyAdmin, userController.getAllUsers);

//retrieve user details
router.get('/details', verify, userController.getProfile);

// update user as admin
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.updateAdmin);
// reset password for all users
router.patch('/update-password', verify, userController.resetPassword);


module.exports = router;

