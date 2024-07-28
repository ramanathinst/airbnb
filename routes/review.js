const expreess = require("express")
const router = expreess.Router({mergeParams : true})
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn,isReviewAuthor} = require("../middleware.js") 
const {validateReview} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")

//  Review Route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// Delete Review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))


module.exports = router;