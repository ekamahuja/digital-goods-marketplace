import fetch from "node-fetch";

export async function sendDiscordWebhook(title, desc) {
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

    const request = await fetch(`${process.env.DISCORD_WEBHOOK_URL}`, options);
    return;
  } catch (err) {
    return null;
  }
}
