import fetch from "node-fetch";

export async function sendDiscordWebhook(title, desc, type) {
  let webhookUrl;

  switch(type) {
    case "notification":
      webhookUrl = process.env.DISCORD_WEBHOOK_URL
      break;
    case "payment":
      webhookUrl = process.env.DISCORD_WEBHOOK_PAYMENT
      break;
    case "error":
      webhookUrl = process.env.DISCORD_WEBHOOK_ERROR
      break;
    default:
      webhookUrl = process.env.DISCORD_WEBHOOK_URL
      break;
  }

  try {
    const params = {
      content: null,
      embeds: [
        {
          title: `${title}`,
          description: `${desc}`,
          color: 16749824,
          footer: {
            text: "https://Upgrader.PW",
          },
        },
      ],
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(params),
    };

    const request = await fetch(webhookUrl, options);
    return;
  } catch (err) {
    return null;
  }
}
