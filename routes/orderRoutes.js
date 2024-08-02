const express = require('express');
const Router = express.Router();
const orderController = require('../controller/orderController');
const auth = require('../middlewares/auth'); 

Router.post('/postOrder', auth, orderController.postOrder);
Router.get('/getOrder',auth,orderController.getOrder);

module.exports = Router;
