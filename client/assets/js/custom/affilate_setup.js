const rateInput = document.querySelector("#rate-input");
const paypalEmail = document.querySelector("#paypalAddress-input");
const confirmBtn = document.querySelector("#affilate-setup-confirm");

confirmBtn.addEventListener("click", async () => {
  try {
    const request = await fetch(
      `/api/affilate/setup?commission=${rateInput.value}&paymentMethodType="paypal"&payment=${paypalEmail.value}`
    );
    const { success, message, affilate } = await request.json();

    toastr.message(message, success ? "success" : "error", 5000);

    if (success) {
      location.reload();
    } else {
      // rateInput.value = ""
      // paypalEmail.value = ""
    }
  } catch (err) {
    toastr.message(err.message, "error", 5000);
  }
});
