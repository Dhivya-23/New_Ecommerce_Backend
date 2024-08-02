const mongoose=require('mongoose');

const EcommerceDetails=new mongoose.Schema({
    Id:{
        type:String
    },
    Title:{
        type:String,required:[true,"title is required"],
    },
    Description:{type:String,required:true,},
    Category:{type:String,required:true,},
    Price:{type:Number},
    Image:{type:String},
       Rating:{ Rate: {
            type: Number,
            required: [true, "Rate is required"]
        },
        Count: {
            type: Number,
            required: [true, "Count is required"]
        }
       }

})

const Ecommerce=mongoose.model('ecommercedetail',EcommerceDetails)
module.exports=Ecommerce;