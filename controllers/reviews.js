const Listing = require("../models/listings")
const Review = require("../models/review")

module.exports.createReview = async(req,res) => {
    // console.log(req.params.id)
    let listing = await Listing.findById(req.params.id)
    let newReviews = new Review(req.body.review)
        newReviews.author = req.user._id
        // console.log(newReviews)
    listing.reviews.push(newReviews)

    await listing.save()
    await newReviews.save()
    req.flash("success" , " New Review Created!")
    res.redirect(`/listings/${listing._id}`)

}

module.exports.destroyReview = async(req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success" , " Review Deleted!")
    res.redirect(`/listings/${id}`)
}