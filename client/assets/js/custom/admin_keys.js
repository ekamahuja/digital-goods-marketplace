let generatedKeys;

document
  .querySelector("#keys-generate-modal")
  .addEventListener("click", function () {
    document.querySelector("#generateKeys-modal").style.display = "block";
  });

document.querySelector("#keys-search-modal").addEventListener("click", () => {
  // toastr.message("Comming soon - remind qwerty", 'info', 3000)
  document.querySelector("#searchKeys-modal").style.display = "block";
});

document
  .querySelector("#keys-unlock-modal")
  .addEventListener("click", async () => {
    document.querySelector("#unlockKeys-modal").style.display = "block";
  });

document
  .querySelector("#keys-change-email-modal")
  .addEventListener("click", async () => {
    document.querySelector("#changeEmail-modal").style.display = "block";
  });

window.onclick = function (event) {
  if (event.target == document.querySelector("#generateKeys-modal")) {
    document.querySelector("#generateKeys-modal").style.display = "none";
  }

  if (event.target == document.querySelector("#searchKeys-modal")) {
    document.querySelector("#searchKeys-modal").style.display = "none";
  }

  if (event.target == document.querySelector("#unlockKeys-modal")) {
    document.querySelector("#unlockKeys-modal").style.display = "none";
  }

  if (event.target == document.querySelector("#changeEmail-modal")) {
    document.querySelector("#changeEmail-modal").style.display = "none";
  }
};

document
  .querySelector("#generateKeys-confirm")
  .addEventListener("click", async () => {
    try {
      const generateKeyBtn = document.querySelector("#generateKeys-confirm");
      const keyPrefix = document.querySelector("#keys-prefix").value;
      const keyType = document.querySelector("#keys-type").value;
      const numberOfKeys = document.querySelector("#keys-generate").value;

      generateKeyBtn.disabled;
      generateKeyBtn.innerHTML =
        '<i class="fas fa-circle-notch fa-spin"></i> Generating...';

      if (keyPrefix == "not-selected" || keyType == "not-selected") {
        generateKeyBtn.disabled = false;
        generateKeyBtn.innerHTML = "Generate";
        return toastr.message(
          "Please select the key prefix and key type",
          "error",
          3000
        );
      }

      if (!numberOfKeys.length) {
        generateKeyBtn.disabled = false;
        generateKeyBtn.innerHTML = "Generate";
        return toastr.message(
          "Please make sure the number of keys is entered correctly",
          "error",
          3000
        );
      }

      if (Number(numberOfKeys) > 1000) {
        generateKeyBtn.disabled = false;
        generateKeyBtn.innerHTML = "Generate";
        return toastr.message(
          "You cannot generate more than 1000 keys at a time",
          "error",
          3000
        );
      }

      const params = {
        prefix: keyPrefix,
        type: keyType,
        amount: Number(numberOfKeys),
      };

      const options = {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(params),
      };

      const request = await fetch("http://localhost:12345/api/keys", options);
      const response = await request.json();

      toastr.message(
        response.message,
        response.success ? "success" : "error",
        5000
      );

      generateKeyBtn.disabled = false;
      generateKeyBtn.innerHTML = "Generate";

      if (response.success) {
        const generateKeyBody = document.querySelector("#generate-keys-body");
        generateKeyBody.classList.remove("no-scroll");
        document.querySelector("#generate-key-heading").innerText =
          "Generated Keys";
        generateKeyBody.innerHTML = '<ul id="generated-keys-list"></ul';

        for (let i = 0; i < response.keys.length; i++) {
          const line = document.createElement("li");
          line.innerHTML = response.keys[i];
          document.querySelector("#generated-keys-list").appendChild(line);
        }

        const generatedKeyFooter = document.createElement("div");
        generatedKeyFooter.id = "generate-key-footer";
        document
          .querySelector("#generateKeys-modal-content")
          .appendChild(generatedKeyFooter);

        generatedKeys = response.keys;

        generatedKeyFooter.innerHTML = `<button onclick="copyGeneratedKeys()" class="green-btn">Copy</button>`;
      }
    } catch (err) {
      toastr.message(err.message, "error", 5000);
      generateKeyBtn.disabled = false;
      generateKeyBtn.innerHTML = "Generate";
    }
  });

async function copyGeneratedKeys() {
  generatedKeys = generatedKeys.join("\n");
  navigator.clipboard.writeText(generatedKeys);
  toastr.message("Keys successfully copied", "success", 900);
  setTimeout(function () {
    location.reload();
  }, 1000);
}

document
  .querySelector("#searchKeys-confirm")
  .addEventListener("click", async () => {
    try {
      const searchKeyBtn = document.querySelector("#searchKeys-confirm");
      const keySearchInput = document.querySelector("#keys-search").value;

      searchKeyBtn.disabled;
      searchKeyBtn.innerHTML =
        '<i class="fas fa-circle-notch fa-spin"></i> Fetching...';

      const request = await fetch(
        `http://localhost:12345/api/key?key=${keySearchInput}&adminData=true`
      );
      const response = await request.json();

      toastr.message(
        response.message,
        response.success ? "success" : "error",
        5000
      );

      if (!response.success) {
        searchKeyBtn.disabled = false;
        searchKeyBtn.innerHTML = "Search";
        return;
      }

      const {
        key,
        email,
        used,
        type,
        replacementsClaimed,
        totalReplacementsClaimed,
        upgradeData,
      } = response.keyData;

      document.querySelector("#search-keys-body").style.display = "none";
      document.querySelector("#search-key-heading").innerHTML = key;
      document.querySelector("#searchKeyHeading").style.display = "none";
      document.querySelector("#keyinfo-data").style.display = "block";
      document.querySelector("#dataKeyInfo-key").innerHTML = key;
      document.querySelector("#dataKeyInfo-email").innerHTML = email;
      document.querySelector("#dataKeyInfo-used").innerHTML = used
        ? "Yes"
        : "No";
      document.querySelector("#dataKeyInfo-type").innerHTML =
        type.charAt(0).toUpperCase() + type.slice(1);
      document.querySelector("#dataKeyInfo-currentReplacements").innerHTML =
        replacementsClaimed;
      document.querySelector("#dataKeyInfo-totalRepalcements").innerHTML =
        totalReplacementsClaimed;

      upgradeData.upgrades.forEach((upgrade) => {
        const upgradeDataDiv = document.createElement("div");
        upgradeDataDiv.classList.add("keyinfo-upgrades");
        upgradeDataDiv.innerHTML = `<p>Upgrade Link: <a href="${upgrade.inviteLink}">Invite Link</a></p><p>Upgrade Address: ${upgrade.inviteAddress}</p><p>Upgrade Country: ${upgrade.inviteCountry}</p><p>User Email: ${upgrade.userEmail}</p><p>User IP: ${upgrade.userIp}</p>`;
        document.querySelector("#keyinfo-data").appendChild(upgradeDataDiv);
      });
    } catch (err) {
      toastr.message(err.message, "error", 5000);
    }
  });

document
  .querySelector("#unlockKeys-confirm")
  .addEventListener("click", async () => {
    const confirmUnlockKeyBtn = document.querySelector("#unlockKeys-confirm");
    const confirmUnlockKeyInput = document.querySelector("#keys-unlock");

    confirmUnlockKeyInput.disabled = true;
    confirmUnlockKeyBtn.disabled = true;
    confirmUnlockKeyBtn.innerHTML =
      '<i class="fas fa-circle-notch fa-spin"></i> Unlocking...';

    const request = await fetch(
      `http://localhost:12345/api/unlockkey?key=${confirmUnlockKeyInput.value.toUpperCase()}`
    );
    const response = await request.json();

    toastr.message(
      response.message,
      response.success ? "success" : "error",
      5000
    );

    confirmUnlockKeyInput.disabled = false;
    confirmUnlockKeyBtn.disabled = false;
    confirmUnlockKeyBtn.innerHTML = "Unlock";

    if (response.success) {
      confirmUnlockKeyInput.value = "";
    }
  });

document
  .querySelector("#changeEmail-confirm")
  .addEventListener("click", async () => {
    try {
      const updateEmailKeyInput = document.querySelector("#change-email-key");
      const updateEmailEmailInput = document.querySelector(
        "#change-email-email"
      );
      const updateEmailBtn = document.querySelector("#changeEmail-confirm");

      updateEmailEmailInput.disabled;
      updateEmailKeyInput.disabled;
      updateEmailBtn.disabled;
      updateEmailBtn.innerHTML =
        '<i class="fas fa-circle-notch fa-spin"></i> Updating...';

      const request = await fetch(
        `http://localhost:12345/api/updateemail?key=${updateEmailKeyInput.value.toUpperCase()}&email=${
          updateEmailEmailInput.value
        }`
      );
      const response = await request.json();

      toastr.message(
        response.message,
        response.success ? "success" : "error",
        5000
      );

      updateEmailEmailInput.disabled = false;
      updateEmailKeyInput.disabled = false;
      updateEmailBtn.disabled = false;
      updateEmailBtn.innerHTML = "Update Email";

      if (response.success) {
        updateEmailEmailInput.value = "";
        updateEmailKeyInput.value = "";
      }
    } catch (err) {
      toastr.message(err.message, "error", 5000);
    }
  });