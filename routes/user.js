const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");




router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res,next)=>{
   try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    })
   
   }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");

   }
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login",
passport.authenticate("local",{
    failureRedirect:'/login',
    failureFlash:true}),
    async(req,res)=>{
        req.flash("sucess","Welcome to WanderLust ! You are logged in");
        res.redirect("/listings");
})

router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been successfully logged out.");
        res.redirect("/listings");
    });
});





module.exports=router;