const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const alllistings= await  Listing.find({});
    res.render("./listings/index.ejs",{alllistings});
  }

  module.exports.rendernewform=(req,res)=>{
    console.log(req.user);
   
      res.render("./listings/new.ejs");
  }

  module.exports.showlisting=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","listing you requested for does not exist ");
      res.redirect("/listings");
    };
    console.log(listing);
    res.render("./listings/show.ejs",{listing});

}

module.exports.createListing=async(req,res,next)=>{
  // let{title,description,image,price,country ,location}=req.body;
      
      try {
        // Log the cropped image data received from the client
        
        let url=req.file.path;
      let filename=req.file.filename;
      console.log(url,"  ",filename);
      const newlisting=new Listing(req.body.listing);
      newlisting.owner=req.user._id;
      newlisting.image={url,filename};
      await newlisting.save();
      req.flash("success","New Listing created");
      res.redirect("/listings");
        // The rest of your code...
    } catch (error) {
        console.error('Error:', error);
        req.flash("error", "Error creating the listing");
        res.redirect("/listings");
    }


}

module.exports.editform=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        res.flash("error","listing you requested for does not exist ");
        res.redirect("/listings");
      };
      let originalImageUrl=listing.image.url;
      originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{

    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
   
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");


}