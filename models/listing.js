const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  
  
  
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});




const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
