async function resellerPayPalPurchase() {
    console.log("nice")
    const resellerPlanPaypalModal = document.querySelector("#resellerPlanPaypal-modal")
    resellerPlanPaypalModal.style.display = 'block'
}


window.onclick = function(event) {
    const resellerPlanPaypalModal = document.querySelector("#resellerPlanPaypal-modal")
    if (event.target == resellerPlanPaypalModal) {
        resellerPlanPaypalModal.style.display = "none";
    }
  }