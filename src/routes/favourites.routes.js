import express from "express";

import { getAllFavourites } from "../controllers/favourite.controller";
import { protect, restrictTo } from "../controllers/auth.controller";

const router = express.Router({ mergeParams: true });

router
  .route("/favourites")
  .post(protect, restrictTo("user", "admin"), getAllFavourites);

export default router;
