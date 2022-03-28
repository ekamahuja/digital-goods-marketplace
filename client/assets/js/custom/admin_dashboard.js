const allConfigButtons = document
  .querySelector("#config-section")
  .getElementsByTagName("button");

for (let i = 0; i < allConfigButtons.length; i++) {
  allConfigButtons[i].addEventListener("click", () => {
    const key = allConfigButtons[i].id.split("-")[0];
    const value = document.querySelector(`#${key}`).value;
    updateConfig(key, value);
  });
}

async function updateConfig(key, value) {
  try {
    const request = await fetch(
      `/admin/api/config?${key}=${value}`,
      { method: "POST" }
    );
    const response = await request.json();

    if (response.message.match("Number failed"))
      return toastr.message("Must provide a valid number", "error", 5000);

    return toastr.message(
      response.message,
      response.success ? "success" : "error",
      5000
    );
  } catch (err) {
    toastr.message(err.message, "error", 5000);
  }
}
