const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const statusMessages = {
  pending:
    "An admin is yet to review this claim. This process may take up to a week.",
  denied:
    "Your payout was denied. Please contact staff for further detatils or create another payout.",
  paid: "The payment has been made to your perfered payment method.",
};

window.addEventListener("load", async () => {
  getPayouts();
});

const getPayouts = async () => {
  const { payouts } = await sendApiRequest("/api/affilate/payout");

  const payoutsDiv = document.querySelector("#payouts");
  const payoutsTableBody = document.querySelector("#payouts-table-body");

  if (payouts) {
    payoutsDiv.style.display = "block";

    for (const payout of payouts) {
      const payoutElement = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.innerHTML = payout.id || "Could not fetch ID";
      payoutElement.appendChild(idTd);

      const amountTd = document.createElement("td");
      amountTd.innerHTML = `$${payout.amount.toFixed(2)}`;
      payoutElement.appendChild(amountTd);

      const badgeTd = document.createElement("td");
      const badgeDiv = document.createElement("div");
      badgeDiv.classList.add(
        "payment-badge",
        `badge-${payout.status}`,
        "txt-captialize"
      );
      badgeDiv.innerHTML = payout.status;
      badgeTd.appendChild(badgeDiv);
      payoutElement.appendChild(badgeTd);

      const informationTd = document.createElement("td");
      informationTd.innerHTML =
        payout.adminComment ||
        statusMessages[payout.status] ||
        "No further information avaliable";
      payoutElement.appendChild(informationTd);

      const time = new Date(payout.updatedAt);
      const hour = (time.getHours() < 10 ? "0" : "") + time.getHours();
      const minutes = (time.getMinutes() < 10 ? "0" : "") + time.getMinutes();
      const day = time.getDate();
      const month = months[time.getMonth()];
      const year = time.getFullYear();

      const timeTd = document.createElement("td");
      timeTd.innerHTML = `${hour}:${minutes} ${day} ${month} ${year}`;
      payoutElement.appendChild(timeTd);

      payoutsTableBody.prepend(payoutElement);
    }
  }
};

const clearPayouts = () => {
  const payoutsTableBody = document.querySelector("#payouts-table-body");
  payoutsTableBody.innerHTML = ``;
};

const affilateLink = document.querySelector("#affilate-link");
affilateLink.addEventListener("click", () => {
  navigator.clipboard.writeText(affilateLink.innerHTML);
  toastr.message("Copied Affilate Link", "success", 5000);
});

const payoutEarnings = document.querySelector("#payout-earnings");
const avaliableEarnings = document.querySelector("#avaliable-earnings");
const requestPayout = document.querySelector("#request-payout");
requestPayout.addEventListener("click", async () => {
  try {
    requestPayout.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Loading...`;
    requestPayout.disabled = true;
    const data = await sendApiRequest(
      "/api/affilate/payout/create",
      null,
      "POST"
    );

    const { success, message } = data;
    displayMessage(success, message, requestPayout);

    if (success) {
      const currentPayoutEarnings = Number(
        payoutEarnings.innerHTML.replace("$", "")
      );

      avaliableEarnings.innerHTML = "$0.00";
      payoutEarnings.innerHTML = `$${(
        data.payoutData.amount + currentPayoutEarnings
      ).toFixed(2)}`;

      clearPayouts();
      getPayouts();
    }
  } catch (err) {
    displayMessage(false, err.message, requestPayout);
  }
});

const displayMessage = (messageType, message, btn) => {
  toastr.message(message, messageType ? "success" : "error", 5000);
  btn.innerHTML = `Request Payout`;
  btn.disabled = false;
};

const sendApiRequest = async (url, params = null, requestType = "GET") => {
  const options = {
    headers: { "Content-Type": "application/json" },
    method: requestType,
    body: params ? params : null,
  };

  const request = await fetch(url, options);
  const response = await request.json();
  return response;
};
