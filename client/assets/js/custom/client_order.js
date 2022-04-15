async function upgradeKey() {
    const orderItems = document.querySelector("#order-items").querySelector("p").innerHTML
    window.location.href = `/upgrade?key=${orderItems}`
}