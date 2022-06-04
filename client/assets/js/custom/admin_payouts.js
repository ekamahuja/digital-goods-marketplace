let payoutsData = []

window.addEventListener("load", () => {
  fetchPayouts();
});

const fetchPayouts = async () => {
  try {
    const { payouts } = await sendApiRequest("/api/affilate/payouts");

    payoutsData = payouts;

    displayPayouts(payouts);
  } catch (err) {
    notifyUser(err.message, false);
  }
};

const fetchUserData = async (affilateCode) => {
    try {
        const data = await sendApiRequest(`/api/affilate/data?affilateCode=${affilateCode}`)
        
        return data;
    } catch(err) {
        notifyUser(err.message, false);
    }
}

const displayPayouts = async (payouts) => {
  const payoutsList = document.querySelector("#payouts-list");
  const reviewedPayoutList = document.querySelector("#payouts-list-reviwed")
  if (!payouts) return (payoutsList.innerHTML = "No payouts yet!");

  for (const { id, affilateCode, amount, status, adminComment } of payouts) {
    const tr = document.createElement("tr");

    const idTr = document.createElement("th");
    idTr.innerHTML = id;
    tr.appendChild(idTr);

    const userTr = document.createElement("th");
    userTr.innerHTML = affilateCode;
    tr.appendChild(userTr);

    const amountTr = document.createElement("th");
    amountTr.innerHTML = `$${amount.toFixed(2)}`;
    tr.appendChild(amountTr);

    const statusTr = document.createElement("th");
    const statusDiv = document.createElement("div");
    statusDiv.classList.add("badge", `badge-${status}`);
    statusDiv.innerHTML = status;
    statusTr.appendChild(statusDiv);
    tr.appendChild(statusTr);

    const noteTr = document.createElement("th");
    noteTr.innerHTML = adminComment || "N/A";
    tr.appendChild(noteTr);


    const actionTr = document.createElement("th");
    const updateBtn = document.createElement("button");
    if (status === "pending") {
        updateBtn.setAttribute("onclick", `payoutModal(${id})`);
        updateBtn.classList.add("payout-update");
        updateBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Need Review`;
    } else {
        updateBtn.classList.add("payout-update", "green-background");
        updateBtn.innerHTML = `<i class="fa-solid fa-check"></i> Already Reviewed`;
    }
    
    actionTr.appendChild(updateBtn);
    tr.appendChild(actionTr);

    status === "pending" ? payoutsList.prepend(tr) : reviewedPayoutList.prepend(tr)
  }
};

const payoutModal = async (payoutId) => {
  try {
    const modal = document.querySelector("#payoutModal");

    const payout = payoutsData.find((payout) => payoutId === payout.id)
    if (!payout) throw new Error("Something went wrong! Could not find payout data!")

    const { success, message, affilateData, userData, currentBalance } = await fetchUserData(payout.affilateCode)
    if (!success) throw new Error(message)
    console.log(userData)
    // console.log(userData)

    const payoutUser = document.querySelector("#payout-user")
    payoutUser.value = `${userData.firstName} ${userData.lastName} (${affilateData.affilateCode})`
    
    const payoutAmount = document.querySelector("#payout-amount")
    payoutAmount.value = `$${payout.amount}`

    const paymentMethod = document.querySelector("#payout-method")
    paymentMethod.value = `${affilateData.paypal} (PayPal)`

    const payoutComment = document.querySelector("#payout-comment")
    payoutComment.innerHTML = affilateData.adminComment || null

    const payoutConfirmBtn = document.querySelector("#confirm-payout")
    payoutConfirmBtn.dataset.payoutId = payout.id

    if (currentBalance < 0 && payout.status === "pending") {
        createModalNotification(`Please deny this payout, the user has a negative balance of -$${currentBalance * -1}`, false)
    }

    modal.style.display = "block";
} catch (err) {
    notifyUser(err.message, false);
  }
};


const closeModalBtn = document.querySelector("#close-modal")
closeModalBtn.addEventListener("click", () => {
    const modal = document.querySelector("#payoutModal");
    const notificationContent = notification.querySelector("#notification-content");
    notificationContent.innerHTML = "";
    modal.style.display = "none";
})



const notifyUser = (message, success) => {
  toastr.message(message, success ? "success" : "error", 5000);
};

const createModalNotification = (message, success) => {
  const notification = document.querySelector("#notification");
  const notificationContent = notification.querySelector(
    "#notification-content"
  );
  const h5 = document.createElement("h5");

  notificationContent.innerHTML = "";

  if (success) {
    h5.innerHTML = `${message}`;
    h5.style.color = "green";
  } else {
    h5.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    h5.style.color = "red";
  }

  notificationContent.appendChild(h5);
  notification.style.display = "block";
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


const confirmPayoutBtn = document.querySelector("#confirm-payout")
confirmPayoutBtn.addEventListener("click", async () => {
    try {
        confirmPayoutBtn.disabled = true;
        confirmPayoutBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Loading...`

        const productId = confirmPayoutBtn.dataset.payoutId
        const status = document.querySelector("#update-status").value
        const comment = document.querySelector("#payout-comment").value

        if (!status) throw new Error("Must select a status!")
        if  (!comment.length) throw new Error("Must enter a comment!")

        const {success, message} = await updatePayoutStatus(productId, status, comment)

        notifyUser(message, success) 
        if (success) {
            location.reload()
        }

        confirmPayoutBtn.disabled = false;
        confirmPayoutBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Confirm`
    } catch(err) {
        notifyUser(err.message, false)
        confirmPayoutBtn.disabled = false;
        confirmPayoutBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Confirm`
    }

})


const updatePayoutStatus = async (payoutId, status, adminComments = null) => {
    console.log(payoutId, status, adminComments)
    const data = await sendApiRequest(`/api/affilate/payout/update?id=${payoutId}&status=${status}&comment=${adminComments || null}`, null, "POST")
    return data;
}