const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

const auth = require("../auth");
const {verify, verifyAdmin} = auth;

//S52 Endpoint requirements:
//retrieve user carts
router.get('/get-cart', verify, cartController.getUserCart);
//add to cart
router.post('/add-to-cart', verify, cartController.addToCart);
//update cart quantity
router.patch('/update-cart-quantity', verify, cartController.changeQuantity);


//S53 Endpoint requirements 
//remove item from cart
router.delete('/:productId/remove-from-cart', verify, cartController.removeProductFromCart);
//clear cart
router.delete('/clear-cart', verify, cartController.clearCartItems);


module.exports = router;

