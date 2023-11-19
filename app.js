
require('dotenv').config();




const express=require("express");
const app=express();
const mongoose=require("mongoose");
require("./routes/auth.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require("./routes/listing.js");

const userRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
  main().then(()=>{
      console.log("connected to db")
  }).catch((err)=>{
      console.log(err);
  });
  async function main(){
      await mongoose.connect(MONGO_URL);
  }
  app.set("view engine","ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride("_method"));
  app.engine("ejs",ejsMate);
  app.use(express.static(path.join(__dirname,"public")));

  function isLoggedIn(req,res,next){
    req.user ? next() :res.sendStatus(401);
  }

  const sessionOptions={
    secret:"Mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        secure:false
    }
  };
  
//   app.get("/",(req,res)=>{
//     res.send("hello");
// });

  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
  })

//   app.get("/demorouter",async (req,res)=>{
//     let fakeUser=new User({
//         email:"sanjeev@gmail.com",
//         username:"stud",
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser)
// ;  })


app.get('/auth/google',
passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' }))

  app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
  async function(req, res) {
    // Successful authentication, get user data
    const profile = req.user;
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

    // Check if the user already exists in your database
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      console.error('Error finding user in the database:', err);
      req.flash('error', 'Error finding user in the database');
      return res.redirect('/auth/google/failure');
    }

    if (existingUser) {
      // User already exists, redirect to /listings
      return res.redirect('/listings');
    }

    // User doesn't exist or has null email, handle accordingly
    if (!email) {
      console.error('Google profile does not have a valid email.');
      req.flash('error', 'Google profile does not have a valid email.');
      return res.redirect('/auth/google/failure');
    }

    // Create a new user and redirect to /listings
    try {
      const newUser = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        username: profile.id, // Use a unique identifier from Google as the username
        email,
        // Add any other necessary fields from the Google profile
      });

      req.login(newUser, (err) => {
        if (err) {
          console.error('Error logging in new user:', err);
          req.flash('error', 'Error logging in new user');
          return res.redirect('/auth/google/failure');
        }
        req.session.destroy();
        res.redirect('/listings');
      });
    } catch (err) {
      if (err.code === 11000) {
        // Handle duplicate key error (username or email already exists)
        console.error('Error creating new user - Duplicate username or email:', err);
        req.flash('error', 'Username or email already exists. Please choose a different one.');
      } else {
        console.error('Error creating new user:', err);
        req.flash('error', 'Error creating new user');
      }
      res.redirect('/auth/google/failure');
    }
  }
);






  app.get('/auth/protected',isLoggedIn,(req,res)=>{
    let name=req.user.displayName;

    res.send(`hello ${name}`);
  })

  app.get('/auth/google/failure',(req,res)=>{
    res.send('login failed');
  })
//reviews 
//post route
app.use("/listings",listingRouter);
app.use("/",userRouter);

// app.get("/testlisting", async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New VIlla",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("Sample wass saved");
//     res.send("successfull testing");
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});



app.listen(5000,()=>{
    console.log("server is listening to port 5000");
})