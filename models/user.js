const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const bcrypt =require("bcryptjs");
const passportLocalMongoose =require("passport-local-mongoose");


const userSchema= new Schema({
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:''
    }
});
   

userSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model('User',userSchema);