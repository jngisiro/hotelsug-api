import express from "express";

import {
  getAllFavourites,
  createFavourite,
} from "../controllers/favourite.controller";
import { protect, restrictTo } from "../controllers/auth.controller";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllFavourites)
  .post(protect, restrictTo("user", "admin"), createFavourite);

export default router;
