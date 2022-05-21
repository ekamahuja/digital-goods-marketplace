import fetch from "node-fetch";
import { generateAuthUrl } from "../helpers/replacementHelper.js";
import { Config } from "../schemas/configSchema.js";
import { getStats, getPaymentStats } from "../helpers/adminHelper.js";
import { upgradeStock } from "../schemas/upgradeStockSchema.js";
import Payment from '../schemas/paymentSchema.js'
import productData from '../config/productData.js'
import {getIpData} from '../helpers/paymentHelper.js'


export async function landingPage(req, res, next) {
  try {
    res.render("../../client/client_index");
  } catch (err) {
    res.render("../../client/500", { err });
  }
}


export const orderSuccessPage = async (req, res, next) => {
  try {
    const {orderId} = req.params
    if (!orderId) return res.render("../../client/client_index")

    const orderData = await Payment.findOne({orderId})
    if (!orderData) throw new Error("Invalid Order ID")

    const {name, description} = productData[orderData.productId]

    const data = {
      productName: name,
      customerEmail: orderData.customerEmail,
      amountPaid: orderData.amountPaid,
      quantity: orderData.quantity,
      paymentMethod: orderData.paymentMethod,
      orderId: orderData.orderId,
      deliveredGoods: orderData.deliveredGoods,
      status: orderData.status,
      description
    }

    res.render("../../client/client_order_success", {data})
  } catch(err) {
    res.render("../../client/500", { err });
  }
}



export async function upgradePage(req, res, next) {
  try {

    res.render("../../client/client_upgrade");
  } catch (err) {
    res.render("../../client/500", { err });
  }
}



export async function keyInfoPage(req, res, next) {
  try {
    res.render("../../client/client_keyinfo");
  } catch (err) {
    res.render("../../client/500", { err });
  }
}



export async function replacementPage(req, res, next) {
  const { spotifyToken } = req.cookies;

  try {
    if (!spotifyToken) {
      const url = await generateAuthUrl();
      if (!url.authUrl) throw new Error("Could not generate auth url");

      res.redirect(url.authUrl);
    } else {
      res.render("../../client/client_replacement");
    }
  } catch (err) {
    next(err);
  }
}



export async function replacementCallBack(req, res, next) {
  try {
    const { SERVER_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } =
      process.env;
    const { code, error } = req.query;
    if (error) return res.redirect("/replacement");
    if (!code) throw new Error("Oauth code not provided");

    const params = {
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: `${SERVER_URL}/api/spotify/oauth`,
    };

    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams(params),
    };

    const request = await fetch(
      "https://accounts.spotify.com/api/token",
      options
    );
    const response = await request.json();

    const { access_token, expires_in } = response;
    if (response.error) throw new Error(response.error);

    return res
      .cookie("spotifyToken", access_token, {
        maxAge: expires_in * 1000,
        httpOnly: true,
      })
      .redirect("/replacement");
  } catch (err) {
    next(err);
  }
}


export const deleteReplacementToken = async (req, res, next) => {
  try {
    res.cookie("spotifyToken", null, {
      maxAge: 0,
      httpOnly: true
    })


    res.send({success: true, message: "Signing out.."})
  } catch (err) {
    res.render("../../client/500", { err });
  }
}


export const discordRedirect = async (req, res, next) => {
  try {
    const { discordServer } = await Config.findOne({});
    res.redirect(discordServer);
  } catch (err) {
    res.render("../../client/500", { err });
  }
};



export const contactRedirect = async (req, res, next) => {
  try {
    const { contactLink } = await Config.findOne({});
    res.redirect(contactLink);
  } catch (err) {
    res.render("../../client/500", { err });
  }
};


export const playlistTransferPage = async (req, res, next) => {
    res.redirect("https://playlisttransfer.upgrader.pw/")
}


export const loginPage = async (req, res, next) => {
  try {
    if (req.user && req.user.role == "admin") {
      res.redirect("/admin/dashboard");
    } else if (req.user && req.user.role == "moderator") {
      res.redirect("/admin/keys");
    } else {
      res.render("../../client/login");
    }
  } catch (err) {
    res.render("../../client/500", { err });
  }
};


export const registerPage = async (req, res, next) => {
  try {

    res.render("../../client/register")

  } catch(err) {
    res.render("../../client/500", { err })
  }
}



export const adminDashboardPage = async (req, res, next) => {
  try {
    const { totalCountries, totalKeys, totalStock, totalPayments } = await getStats();
    const {
      maxReplacements,
      authCookie,
      twoCaptchaTokenApiKey,
      discordServer,
      replacementCooldown,
      spotifyLogin,
      contactLink,
    } = await Config.findOne({});

    res.render("../../client/admin_dashboard", {
      totalCountries,
      totalKeys,
      totalStock,
      totalPayments,
      maxReplacements,
      authCookie,
      twoCaptchaTokenApiKey,
      discordServer,
      replacementCooldown,
      spotifyLogin,
      contactLink,
    });
  } catch (err) {
    res.render("../../client/500", { err });
  }
};



export const adminStockPage = async (req, res, next) => {
  try {
    const { totalCountries, totalKeys, totalStock, totalPayments } = await getStats();
    const stock = await upgradeStock.find({});
    res.render("../../client/admin_stocks", {
      totalCountries,
      totalKeys,
      totalStock,
      stock,
      totalPayments
    });
  } catch (err) {
    res.render("../../client/500", { err });
  }
};



export const adminKeysPage = async (req, res, next) => {
  try {
    const { totalCountries, totalKeys, totalStock, totalPayments } = await getStats();
    res.render("../../client/admin_keys", {
      totalCountries,
      totalKeys,
      totalStock,
      totalPayments
    });
  } catch (err) {
    res.render("../../client/500", { err });
  }
};

export const adminPaymentsPage = async (req, res, next) => {
  try {
    const { totalPayments, totalPaymentsRevenue, last24HourTotalPaymentsLength, last24HourTotalPaymentsRevenue, stripeFees, coinbaseFees } = await getPaymentStats();
    res.render("../../client/admin_payments", {
      totalPayments,
      totalPaymentsRevenue,
      last24HourTotalPaymentsLength,
      last24HourTotalPaymentsRevenue,
      stripeFees,
      coinbaseFees
    });
  } catch (err) {
    res.render("../../client/500", { err });
  }
};

export const adminPaymentsDetatilsPage = async (req, res, next) => {
  try {
    const {orderId} = req.params
    if (!orderId) return res.render("../../client/client_index")

    const orderData = await Payment.findOne({orderId})
    if (!orderData) throw new Error("Invalid Order ID")

    const ipData = await getIpData(orderData.customerIp)

    res.render("../../client/admin_payments_detatils", {orderData, ipData})
  } catch(err) {
    res.render("../../client/500", { err });
  }
}


export const adminSupportResponsesPage = async (req, res, next) => {
  try {
    const { totalCountries, totalKeys, totalStock, totalPayments } = await getStats();
    res.render("../../client/admin_support_responses", {
      totalCountries,
      totalKeys,
      totalStock,
      totalPayments
    });
  } catch(err) {
    next(err)
  }
}


