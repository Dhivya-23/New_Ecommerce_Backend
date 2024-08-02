/*const orderModel=require('../models/orderModel')
const cartModel=require('../models/cartModel')
const ProductModel=require('../models/ProductModel')
const userModel=require('../models/userModel')

const postOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await userModel.findById(user_id);
    const email = user.email;
    const { cust_name, cust_phone, cust_address } = req.body;
    const currentDate = new Date();
    const orderdate = currentDate;
    const estdeldate = new Date(currentDate);
    estdeldate.setDate(currentDate.getDate() + 10);
    const orderstatus = "Inprogress";

    const userCart = await cartModel.findOne({ user_id });
    if (!userCart || !userCart.products.length) {
      return res.status(404).json({ message: "No items in cart" });
    }

    const products = userCart.products;
    let cartProductArray = [];
    let totalamount = 0;

    for (const cartProduct of products) {
      const product_id = cartProduct.product_id;
      const { quantity } = cartProduct;
      const product = await ProductModel.findOne({ Id: product_id });
      if (product) {
        const cartProductDetails = {
          product_id: product.Id,
          Title: product.Title,
          Description: product.Description,
          Image: product.Image,
          Price: product.Price,
          quantity: quantity,
          totalPrize: product.Price * quantity
        };
        cartProductArray.push(cartProductDetails);
        totalamount += cartProductDetails.totalPrize;
      } else {
        console.warn(`Product not found: ${product_id}`);
      }
    }

    const newOrder = new orderModel({
      cust_name,
      cust_phone,
      cust_address,
      orderdate,
      estdeldate,
      products: cartProductArray,
      totalamount,
      orderstatus,
      user_id,
      email
    });

    await newOrder.save();

    console.log('Order created successfully:', newOrder);

    res.status(200).json({ message: "Order added successfully", newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await orderModel.find({ user_id });

    if (orders.length > 0) {
      res.status(200).json({ message: "Orders retrieved successfully", orders });
    } else {
      res.status(404).json({ message: "No orders found for this user" });
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { postOrder, getOrder };
*/

const { v4: uuidv4 } = require('uuid');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const ProductModel = require('../models/ProductModel');
const userModel = require('../models/userModel');

const postOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await userModel.findById(user_id);
    const email = user.email;
    const { cust_name, cust_phone, cust_address } = req.body;
    const currentDate = new Date();
    const orderdate = currentDate;
    const estdeldate = new Date(currentDate);
    estdeldate.setDate(currentDate.getDate() + 10);
    const orderstatus = "Inprogress";
    const orderid = uuidv4();

    const userCart = await cartModel.findOne({ user_id });
    if (!userCart || !userCart.products.length) {
      return res.status(404).json({ message: "No items in cart" });
    }

    const products = userCart.products;
    let cartProductArray = [];
    let totalamount = 0;

    for (const cartProduct of products) {
      const product_id = cartProduct.product_id;
      const { quantity } = cartProduct;
      const product = await ProductModel.findOne({ Id: product_id });
      if (product) {
        const cartProductDetails = {
          product_id: product.Id,
         // Title: product.Title,
         // Description: product.Description,
         // Image: product.Image,
          //Price: product.Price,
          quantity: quantity,
          totalPrize: product.Price * quantity
        };
        cartProductArray.push(cartProductDetails);
        totalamount += cartProductDetails.totalPrize;
      } else {
        console.warn(`Product not found: ${product_id}`);
      }
    }

    const newOrder = new orderModel({
      orderid,
      cust_name,
      cust_phone,
      cust_address,
      orderdate,
      estdeldate,
      products: cartProductArray,
      totalamount,
      orderstatus,
      user_id,
      email
    });

    await newOrder.save();
      await cartModel.deleteOne({user_id});

    console.log('Order created successfully:', newOrder);

    res.status(200).json({ message: "Order added successfully", newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await orderModel.find({ user_id });

    if (orders.length > 0) {
      
      const orderDetailsPromises = orders.map(async (order) => {
        const productsDetails = await Promise.all(order.products.map(async (product) => {
          const productDetails = await ProductModel.findOne({ Id: product.product_id });
          if (productDetails) {
            return {
              title: productDetails.Title,
              description: productDetails.Description,
              image: productDetails.Image,
              price: productDetails.Price,
              quantity: product.quantity
            };
          } else {
            console.warn(`Product not found: ${product.product_id}`);
            return {
              title: 'Unknown',
              description: 'No description available',
              image: 'No image available',
              price: 0,
              quantity: product.quantity
            };
          }
        }));

        return {
          products: productsDetails,
          subtotal: order.totalamount,
          orderdate: order.orderdate,
          estdeldate: order.estdeldate,
          orderstatus: order.orderstatus,
          order_id: order.orderid
        };
      });

      const orderDetails = await Promise.all(orderDetailsPromises);

      res.status(200).json({ message: "Orders retrieved successfully", orders: orderDetails });
    } else {
      res.status(404).json({ message: "No orders found for this user" });
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { postOrder, getOrder };

