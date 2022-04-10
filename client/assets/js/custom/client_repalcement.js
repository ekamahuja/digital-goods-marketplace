let copiedAddress = false;
let inviteLink
let inviteAddress

document.querySelector("#replacement-btn").addEventListener("click", () => {
    getReplacement()
  })

async function getReplacement() {
    document.querySelector("#replacement-btn").disabled = true
    document.querySelector("#replacement-btn").innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...'

    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
        cache: 'no-cache',
        body: null
    }

    const request = await fetch("/api/replacement", options)
    const response = await request.json();


    const messageType = (response.success) ? "success" : "error";
    toastr.message(response.message, messageType, 5000)

    if (response.success) {
        document.querySelector("#replacement-form > div").style.display = "none";
        document.querySelector("#success-upgrade").style.display = "block"
        // document.querySelector("#inviteLink").href = response.upgradeData.inviteLink
        inviteLink = response.upgradeData.inviteLink
        inviteAddress = response.upgradeData.inviteAddress
        document.querySelector("#inviteAddress").innerHTML = `Click me to copy the address`
        document.querySelector("#inviteCountry").innerHTML = response.upgradeData.inviteCountry
    }

    document.querySelector("#replacement-btn").innerHTML = `<i class="fa-brands fa-spotify"></i> Claim Replacement`
    document.querySelector("#replacement-btn").disabled = false
}




document.querySelector("#inviteAddress").addEventListener("click", function() {
    const copyText = inviteAddress;
    navigator.clipboard.writeText(copyText);
    copiedAddress = true
    toastr.message("Address successfully copied", "success", 3000)
})




document.querySelector("#inviteLink").addEventListener("click", function() {
    if (copiedAddress) {
        window.open(inviteLink, '_blank').focus();
    } else {
        toastr.message("Make sure to copy the address before proceeding", 'error', 3000)
    }
})



document.querySelector("#delete-replacement-token").addEventListener("click", async function() {
    try {
        const request = await fetch ("/delete-replacement-token")
        const response = await request.json()

        toastr.message(response.message, (response.success) ? "success" : "error", 5000)

        if (response.success) {
            window.location.href = "/"
        }
    } catch(err) {
        toastr.message(err.message, 'error', 5000);
    }
})