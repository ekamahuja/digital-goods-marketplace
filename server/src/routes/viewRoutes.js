import { Router } from "express";
import { adminViewOnly, adminAndModeratorViewOnly, requireUser } from "../middlewares/viewRouteProtection.js"
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
  affilateSetup,
  affilateDashboard,
  affilateLandingPage,
  adminPayoutsPage,
  mangeAccount,
  affilateTipsPage,
  feedbackLinkRedirect,
  adminCreateBlog,
  blogLists,
  viewSingleBlog,
  adminBlogList,
  adminEditBlog,
  freeVpn
} from "../controllers/viewController.js";



const viewRoutes = Router();

viewRoutes.get("/order/:orderId", orderSuccessPage);

viewRoutes.get("/", landingPage);
viewRoutes.get("/upgrade", upgradePage);
viewRoutes.get("/keyinfo", keyInfoPage);
viewRoutes.get("/free-vpn", freeVpn)
viewRoutes.get("/replacement", replacementPage);

viewRoutes.get("/blog", blogLists);
viewRoutes.get('/blog/:url', viewSingleBlog);

viewRoutes.get("/delete-replacement-token", deleteReplacementToken)

viewRoutes.get("/transfer", playlistTransferPage)
viewRoutes.get("/playlist-transfer", playlistTransferPage)

viewRoutes.get("/api/spotify/oauth", replacementCallBack);

viewRoutes.get("/contact", contactRedirect)
viewRoutes.get("/discord", discordRedirect);
viewRoutes.get("/feedback", feedbackLinkRedirect)

viewRoutes.get("/admin/", loginPage);
viewRoutes.get("/admin/dashboard", adminViewOnly, adminDashboardPage);
viewRoutes.get("/admin/stocks", adminViewOnly, adminStockPage);
viewRoutes.get("/admin/keys", adminAndModeratorViewOnly, adminKeysPage);
viewRoutes.get("/admin/payouts", adminViewOnly, adminPayoutsPage);
viewRoutes.get("/admin/payments", adminViewOnly, adminPaymentsPage);
viewRoutes.get("/admin/payments/:orderId", adminAndModeratorViewOnly, adminPaymentsDetatilsPage);

viewRoutes.get('/:userRole/blog', adminViewOnly, adminBlogList);
viewRoutes.get("/admin/blog/create", adminViewOnly, requireUser, adminCreateBlog);
viewRoutes.get("/admin/blog/:blogId/edit", adminViewOnly, adminEditBlog);

viewRoutes.get("/admin/support-responses", adminSupportResponsesPage);
viewRoutes.get("/moderator/support-responses", adminSupportResponsesPage);

viewRoutes.get('/moderator', loginPage)
viewRoutes.get('/moderator/dashboard', adminAndModeratorViewOnly, adminDashboardPage)
viewRoutes.get('/moderator/keys', adminAndModeratorViewOnly, adminKeysPage)
viewRoutes.get('/moderator/payments', adminAndModeratorViewOnly, adminPaymentsPage)

viewRoutes.get('/login', loginPage)
viewRoutes.get('/register', registerPage)

viewRoutes.get('/affilate', loginPage)
viewRoutes.get('/affilate/setup', requireUser, affilateSetup)
viewRoutes.get('/affilate/dashboard', requireUser, affilateDashboard)
viewRoutes.get('/affilate/tips', requireUser, affilateTipsPage)

viewRoutes.get('/:requestRole/account', requireUser, mangeAccount)

viewRoutes.get('/ref/:affilateCode', affilateLandingPage)
viewRoutes.get('/r/:affilateCode', affilateLandingPage)




export default viewRoutes;
