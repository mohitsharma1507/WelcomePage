const express =require("express");
const router=express.Router();
const User =require("../models/user.js");
const passport=require("passport");
const jwt=require("jsonwebtoken");
const nodemailer= require('nodemailer');
const randomstring=require("randomstring");
const ExpressError = require("../utilies/ExpressError.js");


const { saveRedirectUrl }=require("../Middleware.js");
const { errorMonitor } = require("connect-mongo");

const jwt_secret="ourfirstproject";


const sendResetPasswordMail =async(email,token)=>{
    try {
        nodemailer.createTransport({
            host:'smpt.gmail.com',
            port:465,
            secure:false,
            requireTLS:true,
            auth:{
                user:"mgsharma1507@gmail.com",
                pass:"xlqjkcbnvnbtxwyu"
            }
        });

        const mailOptions={
            from:"mgsharma1507@gmail.com",
            to:email,
            subject:'for reset password',
            html:'<p>Hii please copy link and <a href="http://localhost:8080/reset-password?token='+token+'> reset ur password</a> </p>'
        }

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("mail has been sent:-",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username ,email,password}= req.body;
    const newUser=new User({email,username});
  const registeredUser= await  User.register(newUser,password);
  req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","welcome in the site");
    res.redirect("/front");
  })
    
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
    
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect :"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome  You Are Logged In!");
    let redirectUrl =res.locals.redirectUrl || "/front";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logout");
        res.redirect("/front");
    })
});

router.post("/forgot-password",async(req,res)=>{
    try {
        const email = req.body.email;
        const user = await User.findOne({email:email});
        if (user) {
            const randomString =randomstring.generate();
            const data =await User.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(user.email,randomString);
            res.send("please check ur inbox mail reset ur password");
            
        }else{
            res.status(200).send({success:true,msg:"this email doesn't existed"});
        }



    } catch (error) {
        res.send(error.message);
    }
});

router.post("/reset-password",async(req,res)=>{
    try {
        const token=req.query.token;
       const tokenData= await User.findOne({token:token});
       if (tokenData) {
        const password =req.body.password;
        const newPassword =await securePassword(password);
        const userData=User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true});
        res.status(200).send({success:true,msg:"password is reset",data:userData});
        } else {
        res.status(200).send({success:true,msg:"this kink is experied"});
       }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
});




module.exports=router;