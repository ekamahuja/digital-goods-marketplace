
// Check valid upgrade key
document.querySelector("#upgradeKey-input").addEventListener('input', async function() {
    if (document.querySelector("#upgradeKey-input").value.length < 2) return 

    const keyValidation = await isValidKey(document.querySelector("#upgradeKey-input").value)

    if (!keyValidation) {
        return document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(255 0 118 / 80%)'
    } else {
        document.querySelector("#upgradeKey-input").disabled = true
        document.querySelector('#upgradeKey-input').style.border = '1px solid rgb(0 255 8 / 80%)'
    }
    
})

// Check valid upgrade email 
document.querySelector("#upgradeEmail-input").addEventListener('input', async function() {
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (regex.test(document.querySelector('#upgradeEmail-input').value.toLowerCase())) {
        return document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(0 255 8 / 80%)'
    } else {
        return document.querySelector('#upgradeEmail-input').style.border = '1px solid rgb(255 0 118 / 80%)'
    }

})


document.querySelector("#upgrade-btn").addEventListener('click', async function() {
    document.querySelector("#upgrade-btn").disabled = true
    document.querySelector("#upgrade-btn").innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...'
    await upgradeKey()
})





async function isValidKey(upgradeKeyInput) {
    const request = await fetch(`http://localhost:12345/api/key?key=${upgradeKeyInput}`)
    const response = await request.json()
    if (request.status != 200 || response.keyInfo.used) return false
    return true
}


async function upgradeKey() {
    const params = {
        key: document.querySelector('#upgradeKey-input').value,
        email: document.querySelector('#upgradeEmail-input').value,
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
    alert(response.message)
}