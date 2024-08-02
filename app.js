const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors');
const Productroutes = require('./routes/productRoutes'); 
const Userroutes=require('./routes/userRoutes');
const Cartroutes=require('./routes/cartRoutes');
const Orderroutes=require('./routes/orderRoutes');
const app = express();

app.use(cors());


mongoose.connect('mongodb+srv://Dhivya_23:Dhivya23@cluster0.c6inkef.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use('/', Productroutes);
app.use('/User',Userroutes);
app.use('/Cart',Cartroutes);
app.use('/order',Orderroutes);

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
