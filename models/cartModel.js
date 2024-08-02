const mongoose = require('mongoose');

const cardSchema=new mongoose.Schema({
    user_id:{type:String,required:true},
    products:[
        {
        product_id:String,
        quantity:String
        },
    ]
})

const cart=mongoose.model('carddetails',cardSchema);
module.exports=cart;