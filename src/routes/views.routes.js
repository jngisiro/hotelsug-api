import express from "express";

import { getAllViews } from "../controllers/view.controller";
import { protect, restrictTo } from "../controllers/auth.controller";

const router = express.Router({ mergeParams: true });

router.route("/views").post(protect, restrictTo("user", "admin"), getAllViews);

export default router;
