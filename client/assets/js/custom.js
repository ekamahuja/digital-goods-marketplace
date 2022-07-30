let isValidKey = false;
let isValidEmail = false;


// Check valid upgrade key
document.querySelector("#upgradeKey-input").addEventListener('input', async function() {
    if (document.querySelector("#upgradeKey-input").value.length < 4) return 

    const request = await fetch(`http://localhost:12345/api/key?key=${document.querySelector("#upgradeKey-input").value}`)
    const response = await request.json()

    if (request.status == 404) {
        document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(255 0 118 / 80%)'
    }

    if (response.success == false && request.status != 404) {
        toastr.message(response.message, 'error', 3000);
    }

    if (response.keyInfo.used) {
        toastr.message('Key already redeemed', 'error', 3000);
        document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(255 0 118 / 80%)'
        return
    }
    if (request.status != 200) return document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(255 0 118 / 80%)'
  
    document.querySelector("#upgradeKey-input").disabled = true
    document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(0 255 8 / 80%)'
    isValidKey = true
})


// Check valid upgrade email 
document.querySelector("#upgradeEmail-input").addEventListener('input', async function() {
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (regex.test(document.querySelector('#upgradeEmail-input').value.toLowerCase())) {
        document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(0 255 8 / 80%)'
        isValidEmail = true
        return
    } else {
        document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(255 0 118 / 80%)'
        isValidEmail = false
        return
    }

})


document.querySelector("#upgrade-btn").addEventListener('click', async function() {
    const keyInput = document.querySelector('#upgradeKey-input')
    const emailInput = document.querySelector("#upgradeEmail-input")
    const upgradeBtn = document.querySelector("#upgrade-btn")

    if (!isValidKey) {
        toastr.message("Please enter a valid key", 'error', 3000) 
        keyInput.style.border = '1px solid rgb(255 0 118 / 80%)'
        return
    }

    if (!isValidEmail) {
        toastr.message("Please enter a valid email", 'error', 3000) 
        document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(255 0 118 / 80%)'
        return
    }

    upgradeBtn.disabled = true
    upgradeBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...'
    emailInput.disabled = true

    const upgradeData = await upgradeKey(document.querySelector('#upgradeKey-input').value, (document.querySelector('#upgradeEmail-input').value).toLowerCase())
    if (!upgradeData.success) {
        if (upgradeData.message.match("email")) {
            emailInput.disabled = false
            upgradeBtn.disabled = false
            document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(255 0 118 / 80%)'
            upgradeBtn.innerHTML = `<i class="fa-brands fa-spotify"></i> Upgrade`
            toastr.message(upgradeData.message, 'error', 3000)
            return
        }
        // keyInput.disabled = false
        
    }

    if (upgradeData.upgradeData) {
        toastr.message(upgradeData.message, "success", 3000)
        document.querySelector('#upgrade-form').style.display = 'none'
        document.querySelector('#success-upgrade').style.display = 'block'
        document.querySelector("#inviteLink").href = `${upgradeData.upgradeData.inviteLink}`
        document.querySelector("#inviteAddress").innerHTML = `${upgradeData.upgradeData.inviteAddress}`
        document.querySelector("#inviteCountry").innerHTML = `${upgradeData.upgradeData.inviteCountry}`
    }
})



async function upgradeKey(key, email) {
    const params = {
        key,
        email,
        countryC: "AU"
    }

    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        cache: "no-cache",
        body: JSON.stringify(params)
    }
    const request = await fetch("http://localhost:12345/api/upgrade", options)
    const response = await request.json()
    return response
}


async function getReplacement() {
    document.querySelector("#replacement-btn").disabled = true
    document.querySelector("#replacement-btn").innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...'

    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
        cache: 'no-cache',
        body: JSON.stringify({
            countryC: "AU"
        })
    }

    const request = await fetch("http://localhost:12345/api/replacement", options)
    const response = await request.json();

    const messageType = (response.success) ? "success" : "error";
    toastr.message(response.message, messageType, 5000)

    if (response.success) {
        document.querySelector("#replacement-form > div").style.display = "none";
        document.querySelector("#success-upgrade").style.display = "block"
        document.querySelector("#inviteLink").href = response.upgradeData.inviteLink
        document.querySelector("#inviteAddress").innerHTML = response.upgradeData.inviteAddress
        document.querySelector("#inviteCountry").innerHTML = response.upgradeData.inviteCountry
    }

    document.querySelector("#replacement-btn").innerHTML = `<i class="fa-brands fa-spotify"></i> Claim Replacement`
    document.querySelector("#replacement-btn").disabled = false
}

document.querySelector("#inviteAddress").addEventListener("click", function() {
    const copyText = document.querySelector("#inviteAddress").textContent;
    navigator.clipboard.writeText(copyText);
    toastr.message("Address successfully copied", "success", 3000)
})
