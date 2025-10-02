const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","Please login to create a listing!");
   return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
     let { id } = req.params;
  let listing = await Listing.findById(id);

  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next)=>{
let {error} = listingSchema.validate(req.body);
    if(error){
       let errMsg = error.details.map((el)=> el.message).join(",");
       throw new ExpressError(400,errMsg);  
    }
    else{
      next();
    }
  };

    // In validateListing
// module.exports.validateListing = (req,res,next)=>{
//     console.log("🟡 Running validateListing for", req.body);
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(", ");
//         console.log("❌ Validation failed:", msg);
//         return next(new ExpressError(msg, 400));
//     }
//     console.log("✅ Validation passed");
//     next();
// };


    module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
    }

    module.exports.isreviewAuthor = async(req,res,next) =>{
     let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You can not delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
