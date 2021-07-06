import express from "express";

import {
  getAllLocations,
  getLocation,
  createLocation,
  deleteLocation,
  updateLocation,
} from "../controllers/location.controller";
import { protect, restrictTo } from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllLocations)
  .post(createLocation);

router
  .route("/:id")
  .get(getLocation)
  .patch(protect, restrictTo("admin"), updateLocation)
  .delete(protect, restrictTo("admin"), deleteLocation);

export default router;
