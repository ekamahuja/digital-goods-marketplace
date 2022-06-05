const updateAffilateBtn = document.querySelector("#updateAffilate");
updateAffilateBtn.addEventListener("click", async () => {
  try {
    const commissionRate = document.querySelector("#commissionRate");
    const paypalEmail = document.querySelector("#paypalEmail");

    commissionRate.disabled = true;
    paypalEmail.disabled = true;
    updateAffilateBtn.disabled = true;
    updateAffilateBtn.innerHTML =
      '<i class="fas fa-circle-notch fa-spin"></i> Updating...';

    if (
      !commissionRate.value ||
      typeof commissionRate.valueAsNumber !== "number"
    )
      throw new Error("Enter a valid commission rate");
    if (!paypalEmail.value)
      throw new Error("Please enter a valid PayPal email");

    const params = {
      commission: commissionRate.valueAsNumber,
      payment: paypalEmail.value,
    };
    const { success, message } = await sendApiRequest(
      `/api/affilate/update`,
      params,
      "POST"
    );

    commissionRate.disabled = false;
    paypalEmail.disabled = false;
    updateAffilateBtn.disabled = false;
    updateAffilateBtn.innerHTML =
      '<i class="fa-solid fa-gears"></i> Update Affilate';

    notifyUser(message, success);
  } catch (err) {
    commissionRate.disabled = false;
    paypalEmail.disabled = false;
    updateAffilateBtn.disabled = false;
    updateAffilateBtn.innerHTML =
      '<i class="fa-solid fa-gears"></i> Update Affilate';
    notifyUser(err.message, false);
  }
});

const passwordForm = document.querySelector("password-form");
const updatePasswordBtn = document.querySelector("#updatePassword");
updatePasswordBtn.addEventListener("click", async (e) => {
  try {
    const currentPassword = document.querySelector("#currentPassword");
    const newPassword = document.querySelector("#newPassword");
    const confirmPassword = document.querySelector("#confirmPassword");

    currentPassword.disabled = true;
    newPassword.disabled = true;
    confirmPassword.disabled = true;
    updatePasswordBtn.disabled = true;
    updatePasswordBtn.innerHTML =
      '<i class="fas fa-circle-notch fa-spin"></i> Changing password...';

    if (!(currentPassword.value, newPassword.value, confirmPassword.value))
      throw new Error("Please enter all fields!");
    if (newPassword.value !== confirmPassword.value)
      throw new Error("New passwords do not match!");

    const params = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    };
    const { success, message } = await sendApiRequest(
      "/api/auth/change-password",
      params,
      "POST"
    );

    currentPassword.disabled = false;
    newPassword.disabled = false;
    confirmPassword.disabled = false;
    updatePasswordBtn.disabled = false;
    updatePasswordBtn.innerHTML =
      '<i class="fa-solid fa-key"></i> Change password';

    notifyUser(message, success);

    if (success) {
      setTimeout(location.reload(), 500);
    }
  } catch (err) {
    currentPassword.disabled = false;
    newPassword.disabled = false;
    confirmPassword.disabled = false;
    updatePasswordBtn.disabled = false;
    newPassword.value = "";
    confirmPassword.value = "";
    updatePasswordBtn.innerHTML =
      '<i class="fa-solid fa-key"></i> Change password';
    notifyUser(err.message, false);
  }
});

const notifyUser = (message, success) => {
  toastr.message(message, success ? "success" : "error", 5000);
};

const sendApiRequest = async (url, params = null, requestType = "GET") => {
  const options = {
    headers: { "Content-Type": "application/json" },
    method: requestType,
    body: params ? JSON.stringify(params) : null,
  };

  const request = await fetch(url, options);
  const response = await request.json();
  return response;
};
