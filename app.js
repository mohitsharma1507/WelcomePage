const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User =require("./models/user.js");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const MongoStore =require("connect-mongo");
const listRouter =require("./routes/list.js")
const user= require("./routes/user.js");
const flash =require("connect-flash");
const ExpressError = require("./utilies/ExpressError.js");
const jwt =require('jsonwebtoken');
const { log } = require("console");
const bcrypt =require('bcryptjs');
const nodemailer= require('nodemailer');
const crypto = require('crypto');









app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);



main().then((res) => {
    console.log("successfull");
   
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WelcomePage");
}

const store= MongoStore.create({
    mongoUrl:"mongodb://127.0.0.1:27017/WelcomePage",
    crypto:{
        secret:"OurFirstProject",
    },
    touchAfter:24 * 3600,
});


store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions ={
    secret:"OurFirstProject",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    },
};





 app.use(session(sessionOptions));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/front",listRouter);
app.use("/",user);

app.get('/forgot-password',(req,res,next)=>{
    res.render('users/forgot-password.ejs');
});
app.listen(8080,()=>{
    console.log("listening is 8080");
})