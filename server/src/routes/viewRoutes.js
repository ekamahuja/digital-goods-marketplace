import { Router } from "express";
import adminClientRouteProtection from "../middlewares/adminClientProtection.js";
import {
  landingPage,
  upgradePage,
  keyInfoPage,
  replacementCallBack,
  replacementPage,
  playlistTransferPage,
  discordRedirect,
  contactRedirect,
  adminLoginPage,
  adminDashboardPage,
  adminStockPage,
  adminKeysPage,
} from "../controllers/viewController.js";



const viewRoutes = Router();

viewRoutes.get("/", landingPage);

viewRoutes.get("/upgrade", upgradePage);

viewRoutes.get("/keyinfo", keyInfoPage);

viewRoutes.get("/replacement", replacementPage);

viewRoutes.get("/transfer", playlistTransferPage)
viewRoutes.get("/playlist-transfer", playlistTransferPage)

viewRoutes.get("/api/spotify/oauth", replacementCallBack);

viewRoutes.get("/contact", contactRedirect)

viewRoutes.get("/discord", discordRedirect);

viewRoutes.get("/admin/", adminLoginPage);

viewRoutes.get("/admin/dashboard", adminClientRouteProtection, adminDashboardPage);

viewRoutes.get("/admin/stocks", adminClientRouteProtection, adminStockPage);

viewRoutes.get("/admin/keys", adminClientRouteProtection, adminKeysPage);



export default viewRoutes;
