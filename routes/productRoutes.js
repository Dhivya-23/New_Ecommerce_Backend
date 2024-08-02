const express=require('express');
const Router=express.Router();
const productController=require("../controller/productController");
const auth=require("../middlewares/auth");

Router.get("/products",auth,productController.getAllProducts);
Router.post("/postproduct",productController.postAllProducts);
Router.put('/updateproduct:Id', productController.updateProducts);
Router.delete('/deleteproduct', productController.deleteProducts);
module.exports=Router;