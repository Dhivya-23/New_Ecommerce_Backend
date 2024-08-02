const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema=new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String
    }
})

//Hash password before saving user to database
userSchema.pre("save",async function(next){ //pre is a middleware
    if(!this.isModified("password")){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

const User=mongoose.model('login',userSchema);
module.exports=User;