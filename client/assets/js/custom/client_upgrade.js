let isValidKey = false;
let isValidEmail = false;
let copiedAddress = false;
let inviteLink;
let inviteAddress

// Check valid upgrade key
document.querySelector("#upgradeKey-input").addEventListener('input', async function() {
    if (document.querySelector("#upgradeKey-input").value.length < 4) return 

    const request = await fetch(`/api/key?key=${document.querySelector("#upgradeKey-input").value}`)
    const response = await request.json()

    if (request.status == 404) {
        document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(255 0 118 / 80%)'
    }

    if (response.success == false && request.status != 404) {
        toastr.message(response.message, 'error', 3000);
    }

    if (response.keyData.used) {
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

    const messageType = (upgradeData.success) ? 'success' : 'error'
    toastr.message(upgradeData.message, messageType, 5000)

    if (!upgradeData.success) {
        if (upgradeData.message.match("email")) {
            emailInput.disabled = false 
            document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(255 0 118 / 80%)'
        }

        if (upgradeData.message.match("key")) {
            keyInput.disabled = false 
            keyInput.style.border = '1px solid rgb(255 0 118 / 80%)'
        }

        upgradeBtn.innerHTML = `<i class="fa-brands fa-spotify"></i> Upgrade`
        upgradeBtn.disabled = false
        return
    }

    if (upgradeData.upgradeData) {
        document.querySelector('#upgrade-form').style.display = 'none'
        document.querySelector('#success-upgrade').style.display = 'block'
        inviteLink = upgradeData.upgradeData.inviteLink
        inviteAddress = upgradeData.upgradeData.inviteAddress
        document.querySelector("#inviteAddress").innerHTML = `Click me to copy the address`
        document.querySelector("#inviteCountry").innerHTML = `${upgradeData.upgradeData.inviteCountry}`
        document.querySelector("#switch-btn").href = '/discord'
        document.querySelector("#switch-btn").innerHTML = `<i class="fa-brands fa-discord"></i> Join Discord`
    }
})



async function upgradeKey(key, email) {
    const params = {
        key,
        email,
    }

    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        cache: "no-cache",
        body: JSON.stringify(params)
    }
    const request = await fetch("/api/upgrade", options)
    const response = await request.json()
    return response
}


document.querySelector("#inviteLink").addEventListener('click', () => {
    if (copiedAddress) {
        window.open(inviteLink, '_blank').focus();
    } else {
        toastr.message("Make sure to copy the address before proceeding", 'error', 3000)
    }
})

document.querySelector("#inviteAddress").addEventListener("click", function() {
    const copyText = inviteAddress;
    navigator.clipboard.writeText(copyText);
    copiedAddress = true
    toastr.message("Address successfully copied", "success", 3000)
})


