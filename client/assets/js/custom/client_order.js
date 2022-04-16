async function upgradeKey() {
    const orderItems = document.querySelector("#order-items").querySelector("p").innerHTML
    window.location.href = `/upgrade?key=${orderItems}`
}


async function copyKeys() {
    try {
        const keyElements = document.querySelector("#order-items").querySelectorAll("p")
        let keys = []
        keyElements.forEach(key => {
            keys.push(key.innerHTML)
        })

        navigator.clipboard.writeText(keys.join('\n'))

        toastr.message('Successfully copied keys', 'success', 5000)
    } catch(err) {
        toastr.message(err.message, 'error', 5000)
    }
}