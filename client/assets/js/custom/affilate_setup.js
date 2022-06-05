const rateInput = document.querySelector("#rate-input");
const paypalEmail = document.querySelector("#paypalAddress-input");
const confirmBtn = document.querySelector("#affilate-setup-confirm");

confirmBtn.addEventListener("click", async () => {
  try {
    const params = {
      commission: rateInput.valueAsNumber,
      payment: paypalEmail.value,
      isSetup: true
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }

    console.log(params)

    const request = await fetch(`/api/affilate/update`, options);
    const { success, message } = await request.json();

    toastr.message(message, success ? "success" : "error", 5000);

    if (success) {
      window.location.href = "/affilate/dashboard"
    } else {
      // rateInput.value = ""
      // paypalEmail.value = ""
    }
  } catch (err) {
    toastr.message(err.message, "error", 5000);
  }
});
