let stock;
const countryFetchOptions = document.querySelector("#countries-select");

window.addEventListener("load", async () => {
  try {
    const request = await fetch("/api/data/stock?adminPanel=true");
    response = await request.json();

    if (response.success) {
      stock = response.data;
      return;
    }

    return toastr.message(stock.message, "error", 5000);
  } catch (err) {
    toastr.message(err, "error", 5000);
  }
});

countryFetchOptions.addEventListener("change", () => {
  let data = stock.filter((item) => {
    if (item.countryCode == countryFetchOptions.value) return item;
  });

  stockData = data[0].stock;

  document.querySelector("#countryStock-modal").style.display = "block";

  document.querySelector(
    "#countryStock-modal-content"
  ).innerHTML = `<h5 class="modal-heading">${
    data[0].name
  } (${stockData.length} Upgrades Avaliable)</h5>`;

  stockData.forEach((item) => {
    let stockLi = document.createElement("div");
    stockLi.className = "countryStock-modal-item";
    stockLi.innerHTML = `<p>Invite Address: ${item.inviteAddress}</p><p>InviteLink: ${item.inviteLink}</p>`;
    document.querySelector("#countryStock-modal-content").appendChild(stockLi);
  });
});

document
  .querySelector("#addCountry-confirm")
  .addEventListener("click", async () => {
    const addCountryBtn = document.querySelector("#addCountry-confirm");
    const countryCode = document.querySelector("#countryCode").value;

    addCountryBtn.disabled = true;
    document.querySelector(
      "#addCountry-confirm"
    ).innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Loading...`;

    const params = { countryCode: countryCode };
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(params),
    };
    const request = await fetch(
      "/api/data/country",
      options
    );
    const response = await request.json();

    if (!response.success) {
      let errorMessage = null;
      if (response.message.match("duplicate"))
        errorMessage =
          "There is an already existing country name or country code";
      addCountryBtn.disabled = false;
      addCountryBtn.innerHTML = `Confirm`;
      return toastr.message(
        errorMessage ? errorMessage : response.message,
        "error",
        5000
      );
    }

    if (response.success) {
      addCountryBtn.innerHTML = `Confirm`;
      toastr.message(response.message, "success", 5000);

      setTimeout(function () {
        window.location.reload();
      }, 1000);

      return;
    } else {
      return toastr.message("Something went wrong!", "error", 5000);
    }
  });

document
  .querySelector("#deleteCountry-confirm")
  .addEventListener("click", async () => {
    try {
      const deleteButton = document.querySelector("#deleteCountry-confirm");
      const countryToDelete = document.querySelector(
        "#select-country-delete"
      ).value;

      deleteButton.disabled = true;
      deleteButton.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Deleting...`;

      const params = { countryCode: countryToDelete };
      const options = {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        body: JSON.stringify(params),
      };

      const request = await fetch(
        "/api/data/country",
        options
      );
      const response = await request.json();

      toastr.message(
        response.message,
        response.success ? "success" : "error",
        5000
      );

      if (response.success) {
        deleteButton.innerHTML = `Delete`;
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        deleteButton.disabled = false;
        deleteButton.innerHTML = `Delete`;
      }
    } catch (err) {
      toastr.message(err.message, "error", 5000);
    }
  });

document
  .querySelector("#addCountry-popup")
  .addEventListener("click", async () => {
    document.querySelector("#addCountry-modal").style.display = "block";
  });

document
  .querySelector("#deleteCountry-popup")
  .addEventListener("click", async () => {
    document.querySelector("#deleteCountry-modal").style.display = "block";
  });

window.onclick = function (event) {
  if (event.target == document.querySelector("#countryStock-modal")) {
    document.querySelector("#countryStock-modal").style.display = "none";
  }

  if (event.target == document.querySelector("#deleteCountry-modal")) {
    document.querySelector("#deleteCountry-modal").style.display = "none";
  }

  if (event.target == document.querySelector("#addCountry-modal")) {
    document.querySelector("#addCountry-modal").style.display = "none";

    document.querySelector("#countryName").value = "";
    document.querySelector("#countryCode").value = "";
  }
};

document.querySelector("#add-stock-btn").addEventListener("click", async () => {
  try {
    let stock = [];
    let uploadStockBtn = document.querySelector("#add-stock-btn");
    const countryCode = document.querySelector("#select-country-stock").value;
    let stockInput = document.querySelector("#stock-data-textarea");

    uploadStockBtn.disabled = true;
    uploadStockBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Uploading...`;

    const stockSeperatedByLine = stockInput.value.split("\n");
    stockSeperatedByLine.forEach((line) => {
      let lineSplit = line.split("	");
      let link = lineSplit[1].match("https")
        ? lineSplit[1]
        : `https://www.spotify.com/us/family/join/invite/${lineSplit[1]}`;
      let data = { inviteLink: link, inviteAddress: lineSplit[0] };
      stock.push(data);
    });

    const params = { countryCode, stock };
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(params),
    };

    const request = await fetch(
      "/api/data/stock",
      options
    );
    const response = await request.json();

    toastr.message(
      response.message,
      response.success ? "success" : "error",
      5000
    );
    uploadStockBtn.disabled = false;

    uploadStockBtn.innerHTML = "Upload Stock";

    if (response.success) {
      stockInput.value = "";
    }

  } catch (err) {
    toastr.message(err.message, "error", 5000);
  }
});
