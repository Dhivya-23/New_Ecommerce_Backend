const mongoose= require('mongoose');

const orderSchema=new mongoose.Schema({
    orderid:{type:String},
    cust_name:{type:String},
    cust_phone:{type:String},
    cust_address:{type:String},
    orderdate:{type:Date},
    estdeldate:{type:Date},
    products:[{
        // Title:{type:String},
        // Description:{type:String},
        // Image:{type:String},
        // Price:{type:Number},
        product_id:{type: String,ref:'ProductModel'},
        quantity:{type:String}
    }],
    totalamount:{type:Number},
    orderstatus:{type:String},
    user_id:{type:String ,ref:'userModel'},
    email:{type:String}
})

const order=mongoose.model('orderdetails',orderSchema);
module.exports=order;