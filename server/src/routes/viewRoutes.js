import { Router } from "express";
import { adminViewOnly, adminAndModeratorViewOnly } from "../middlewares/viewRouteProtection.js"
import {
  landingPage,
  orderSuccessPage,
  upgradePage,
  keyInfoPage,
  replacementCallBack,
  replacementPage,
  playlistTransferPage,
  discordRedirect,
  contactRedirect,
  loginPage,
  registerPage,
  adminDashboardPage,
  adminStockPage,
  adminKeysPage,
  adminPaymentsPage,
  adminPaymentsDetatilsPage,
  adminSupportResponsesPage,
  deleteReplacementToken,
} from "../controllers/viewController.js";



const viewRoutes = Router();

viewRoutes.get("/order/:orderId", orderSuccessPage);

viewRoutes.get("/", landingPage);

viewRoutes.get("/upgrade", upgradePage);

viewRoutes.get("/keyinfo", keyInfoPage);

viewRoutes.get("/replacement", replacementPage);

viewRoutes.get("/delete-replacement-token", deleteReplacementToken)

viewRoutes.get("/transfer", playlistTransferPage)
viewRoutes.get("/playlist-transfer", playlistTransferPage)

viewRoutes.get("/api/spotify/oauth", replacementCallBack);

viewRoutes.get("/contact", contactRedirect)

viewRoutes.get("/discord", discordRedirect);

viewRoutes.get("/admin/", loginPage);

viewRoutes.get("/admin/dashboard", adminViewOnly, adminDashboardPage);

viewRoutes.get("/admin/stocks", adminViewOnly, adminStockPage);

viewRoutes.get("/admin/keys", adminAndModeratorViewOnly, adminKeysPage);

viewRoutes.get("/admin/payments", adminViewOnly, adminPaymentsPage);

viewRoutes.get("/admin/payments/:orderId", adminViewOnly, adminPaymentsDetatilsPage);

viewRoutes.get("/admin/support-responses", adminSupportResponsesPage);

// viewRoutes.get('/affilate/', loginPage)

viewRoutes.get('/admin/register', registerPage)

viewRoutes.get('/moderator/dashboard', adminViewOnly, adminDashboardPage)



export default viewRoutes;
