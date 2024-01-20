const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const auth = require("../auth");
const {verify, verifyAdmin} = auth;


//s54 Endpoint requirements
//create order
router.post('/checkout', verify, orderController.createOrder);
//retrieve logged in user's 
router.get('/my-orders', verify, orderController.getAllOrders);
//retrieve all user's orders(admin)
router.get('/all-orders', verify, verifyAdmin, orderController.getAllUsersOrders);


module.exports = router;

