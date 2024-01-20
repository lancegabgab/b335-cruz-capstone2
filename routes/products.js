const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");

const auth = require("../auth");
const {verify, verifyAdmin} = auth;

//Add a Product
router.post("/", verify, verifyAdmin, productController.addProduct);

//Get all products - Admin Only
router.get("/all", verify,verifyAdmin,productController.getAllProduct);

//Get only all active products
router.get("/", productController.getAllActiveProduct);

//get specific product
router.get("/:productId",  productController.getProduct);

//update a product - Admin only
router.put("/:productId/update",verify, verifyAdmin, productController.updateProduct);

//archive a product - Admin only
router.patch("/:productId/archive",verify, verifyAdmin, productController.archiveProduct );

//activate a product -Admin only
router.patch("/:productId/activate", verify, verifyAdmin,productController.activateProduct);

//s53 endpoint requirements

//Search products by their names
router.post("/searchByName", productController.searchByName);
//Search products by their names
router.post("/searchByPrice", productController.searchByPrice);


module.exports = router; 