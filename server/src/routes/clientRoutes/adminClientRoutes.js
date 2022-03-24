import { Router } from "express";
const adminClientRoutes = Router();
import { adminOnly } from "../../middlewares/adminOnly.js";
import { getStats } from "../../helpers/adminHelper.js";
import { Config } from "../../schemas/configSchema.js";
import { Country } from "../../schemas/countrySchema.js";
import adminClientRouteProtection from '../../middlewares/adminClientProtection.js'

adminClientRoutes.get("/", async (req, res) => {
  if (req.user && req.user.role == 'admin') {
    res.redirect("/admin/dashboard")
  } else {
    res.render("../../client/login");
  }
  
});

adminClientRoutes.get("/dashboard", adminClientRouteProtection, async (req, res) => {
  const { totalCountries, totalKeys, totalStock } = await getStats();
  const { maxReplacements, authCookie, twoCaptchaTokenApiKey, discordServer, replacementCooldown, spotifyLogin, contactLink } = await Config.findOne({});

  // if (!req.user || req.user.role != "admin") return res.redirect("/admin")

  res.render("../../client/dashboard", {
    totalCountries,
    totalKeys,
    totalStock,
    maxReplacements,
    authCookie,
    twoCaptchaTokenApiKey,
    discordServer,
    replacementCooldown,
    spotifyLogin,
    contactLink
  });
});


adminClientRoutes.get("/stocks", adminClientRouteProtection, async (req, res) => {
  const { totalCountries, totalKeys, totalStock } = await getStats();
  const stock = await Country.find({})
  res.render("../../client/stocks", {
      totalCountries,
      totalKeys,
      totalStock,
      stock
  });
});



adminClientRoutes.get("/keys", adminClientRouteProtection, async (req, res) => {
  const { totalCountries, totalKeys, totalStock } = await getStats();
  res.render("../../client/keys", {
    totalCountries,
    totalKeys,
    totalStock
  })
})



export default adminClientRoutes;
