import express from "express";
const affilateRoutes = express.Router();
import { requireUser, adminApiOnly, } from "../middlewares/apiRouteProtection.js";
import {
  affilateSetup,
  affilatePricing,
  createPayout,
  fetchPayouts,
  updatePayoutStatus,
  fetchAllPayouts,
  fetchUserData,
} from "../controllers/affilateController.js";


affilateRoutes.get("/affilate/pricing", affilatePricing);
affilateRoutes.post("/affilate/update", requireUser, affilateSetup);

affilateRoutes.post("/affilate/payout/create", requireUser, createPayout);
affilateRoutes.get(`/affilate/payout`, requireUser, fetchPayouts);

affilateRoutes.post("/affilate/payout/update",adminApiOnly, updatePayoutStatus);
affilateRoutes.get("/affilate/payouts", adminApiOnly, fetchAllPayouts);
affilateRoutes.get("/affilate/data", adminApiOnly, fetchUserData);

export default affilateRoutes;
