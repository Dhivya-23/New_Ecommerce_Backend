const express = require("express");
const Router = express.Router();
const CartController = require("../controller/cartController");
const auth = require("../middlewares/auth");

Router.post("/addtocart",auth,CartController.addCart);
Router.get("/getCart",auth,CartController.getCartProducts);
Router.delete("/deleteCart",auth,CartController.deleteCart);

module.exports = Router;