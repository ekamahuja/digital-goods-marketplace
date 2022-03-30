let inviteAddress

document.querySelector("#keySearch-input").addEventListener('input', async () => {
    if (document.querySelector("#keySearch-input").value.length > 3) {
        getKeyInfo()
    }
})

// document.querySelector('#keySearch-btn').addEventListener('click', async () => {
//     getKeyInfo()
// })


async function getKeyInfo(isClicked) {
    const request = await fetch(`/api/key?key=${document.querySelector("#keySearch-input").value.toUpperCase()}`)
    const response = await request.json()

    const messageType = (response.success) ? 'success' : 'error'
    
    if (!response.success) {
        document.querySelector('#keySearch-input').style.border = '1px solid rgb(255 0 118 / 80%)'
    }
    if (request.status != 404) {
        toastr.message(response.message, messageType, 3000)
    }


    if (response.success) {
        document.querySelector("#replacement-form").style.display = 'none'
        document.querySelector("#success-keyinfo").style.display = 'block'

        const {key, email, used, type, totalReplacementsClaimed, lastUpgrade} = response.keyData

        if (!used) {
            document.querySelector("#key-data").style.display = "block"
            document.querySelector("#keyValue").innerHTML = key.toUpperCase()
            document.querySelector("#keyType").innerHTML = type.charAt(0).toUpperCase() + type.slice(1)
            document.querySelector("#keyUsed").innerHTML = "No"
            document.querySelector("#keySentance").innerHTML = `This is an unused ${type} key`
        } else {
            document.querySelector("#upgrade-data").style.display = "block"
            document.querySelector("#keyEmail").innerHTML = email
            document.querySelector("#inviteLink").href = lastUpgrade.inviteLink
            inviteAddress = lastUpgrade.inviteAddress
            document.querySelector("#inviteAddress").innerHTML = `Click me to copy the address`
            document.querySelector("#inviteCountry").innerHTML = lastUpgrade.inviteCountry
            document.querySelector("#upgradeSentance").innerHTML = (type == "onetime") ? `This is a ${type} key` : `This is a ${type} key with ${totalReplacementsClaimed + 1} total upgrades claimed`
        }
    }
}



document.querySelector("#inviteAddress").addEventListener("click", function() {
    const copyText = inviteAddress;
    navigator.clipboard.writeText(copyText);
    copiedAddress = true
    toastr.message("Address successfully copied", "success", 3000)
})
