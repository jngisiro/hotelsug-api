import express from "express";

import { getAllReviews, createReview } from "../controllers/reviews.controller";
import { restrictTo, protect } from "../controllers/auth.controller";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

export default router;
