import Sellix from "@sellix/node-sdk";
import { Key } from "../schemas/keySchema.js";
import { sendDiscordWebhook } from "../utils/discordWebhook.js";
const sellix = Sellix(`${process.env.SELLIX_API_KEY}`);



export async function sellixWebhook(req, res, next) {
  try {
    const { event, data } = req.body;
    if (!event || !data) throw new Error("Event or data not provided in the body")

    if (event.split(":")[1] == "disputed") {
      const keysToBlacklist = data.serials;
      let blacklistedKeys = [];

      for (let i = 0; i < keysToBlacklist.length; i++) {
        let key = await Key.findOne({ value: keysToBlacklist[i] });
        if (!key) continue;
        key.blacklisted = true;
        await key.save();
        blacklistedKeys.push(key.value);
      }

      const discordTitle = `❌ Blacklisted ${blacklistedKeys.length} key(s)!`;
      const discordDesc = `Event: ${
        event.split(":")[1].charAt(0).toUpperCase() +
        event.split(":")[1].slice(1).toLowerCase()
      }\n Product: ${data.product_title}\n Amount of Keys Blacklisted: ${
        blacklistedKeys.length
      }\n Key(s): ${blacklistedKeys.join(", ")}\n Order ID: ${
        data.uniqid
      }\n Email: ${data.customer_email}\n IP: ${data.ip}\n Paid: $${
        data.total
      } USD`;
      sendDiscordWebhook(discordTitle, discordDesc);

      return res.status(201).json({
        success: true,
        message: `Successfully blacklisted ${blacklistedKeys.length} keys`,
        amountOfKeysBlacklisted: blacklistedKeys.length,
        blacklistedKeys,
      });
    }

    return res.status(204).json({ success: false, message: "No action taken" });
  } catch (err) {
    next(err);
  }
}
