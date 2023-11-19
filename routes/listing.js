const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js");

const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const {index,rendernewform, showlisting, createListing, editform, updateListing, deleteListing}=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }

};



router.get("/",index);
// ...

// Create Listing
router.post("/", isLoggedIn, upload.single('listing[image]'), wrapAsync(createListing));

// ...

  
  //new route
  router.get("/new",isLoggedIn,rendernewform);
  
  //show route
  router.get("/:id",showlisting);

 // router.post("/", isLoggedIn,validateListing,createListing);

//edit route
router.get("/:id/edit", isLoggedIn,editform)

//update r oute
router.put("/:id", isLoggedIn, upload.single('listing[image]'),updateListing)

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(deleteListing));

//reviews 
//post route

module.exports=router;