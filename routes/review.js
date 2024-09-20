const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const reviewController = require("../controllers/reviews.js");
const {
  validateReviews,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// post route for review
router.post(
  "/",
  isLoggedIn,
  validateReviews,
  wrapAsync(reviewController.createReview)
);

// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
