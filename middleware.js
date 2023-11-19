const Listing=require("./models/listing.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be loggedin to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    // Check if the user is logged in
    if (!res.locals.currUser) {
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("/login"); // Redirect to the login page or another appropriate page
    }

    const { id } = req.params;
    const listing = await Listing.findById(id);

    // Check if the user is the owner of the listing
    if (listing ) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

