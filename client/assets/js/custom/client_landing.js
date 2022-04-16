isValidEmail = false

async function resellerPayPalPurchase() {
    const resellerPlanPaypalModal = document.querySelector("#resellerPlanPaypal-modal")
    resellerPlanPaypalModal.style.display = 'block'
}


window.onclick = function(event) {
    const resellerPlanPaypalModal = document.querySelector("#resellerPlanPaypal-modal")
    if (event.target == resellerPlanPaypalModal) {
        resellerPlanPaypalModal.style.display = "none";
    }

    const paymentsModal = document.querySelector("#payments-modal")
    if (event.target == paymentsModal) {
        paymentsModal.style.display = "none";
    }
  }



const paymentBtns = document.querySelector("#pricing").querySelectorAll("a")
for (let i = 0; i < paymentBtns.length; i++) {
    paymentBtns[i].addEventListener("click", async () => {
        if (paymentBtns[i].dataset.method && paymentBtns[i].dataset.pid) {
            preInnerHTML = paymentBtns[i].innerHTML
            paymentBtns[i].disabled = true
            paymentBtns[i].innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Loading...`

            const fetchProductData = await productInfo(paymentBtns[i].dataset.pid)
            if (!fetchProductData.success) throw new Error(fetchProductData.error)

            paymentModal(fetchProductData.name , fetchProductData.id,  paymentBtns[i].dataset.method, fetchProductData.amount)

            paymentBtns[i].disabled = false
            paymentBtns[i].innerHTML = `${preInnerHTML}`
        }
    })
}


async function paymentModal(planName, planId, planMethod, planPrice) {
    const paymentsModal = document.querySelector("#payments-modal")
    paymentsModal.querySelector("button").setAttribute('data-method', `${planMethod}`);
    paymentsModal.querySelector("button").setAttribute('data-pid', `${planId}`);
    // paymentsModal.querySelector("h5").innerHTML = `Purchase ${planName}`
    // paymentsModal.querySelector("#payment-method").value = `${planMethod}`
    paymentsModal.querySelector("#payment-amount").innerHTML = `$${Number(planPrice).toFixed(2)}`
    paymentsModal.querySelector("#payment-amount").dataset.amountPerOne = Number(planPrice).toFixed(2)
    paymentsModal.style.display = "block"
}




document.querySelector("#payment-confirm").addEventListener("click", async () => {
    try {
        if (!isValidEmail) throw new Error("Enter a valid email address")
        const paymentBtn = document.querySelector("#payment-confirm")
        const paymentEmail = document.querySelector("#payment-email")
        const paymentQuantity = document.querySelector("#payment-quantity").value

        paymentBtn.disabled = true
        paymentEmail.disabled = true
        paymentBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Loading...`

        createPaymentSession(paymentBtn.dataset.pid, paymentBtn.dataset.method, paymentEmail.value, paymentQuantity)
    } catch(err) {
        toastr.message(err.message, 'error', 500000000)
    }
    
})


async function createPaymentSession(productId, paymentMethod, email, quantity) {
    try {
        const request = await fetch(`/api/payments/${paymentMethod}/create?pid=${productId}&email=${email}&quantity=${quantity}`, {method: "POST"})
        const {success, message, session} = await request.json()

        if (success && session) return window.location.href = session

        toastr.message(message, (success) ? 'success' : 'error', 5000)
    } catch(err) {
        toastr.message(err.message, "error", 5000)
    }
}




const productInfo = async (pid) => {
    try {
        const request = await fetch(`/api/products/${pid}`)
        const response = await request.json()

        return response
    } catch (err) {
        return {success: false, error: err.message}
    }
}




document.querySelector("#payment-email").addEventListener('input', async function() {
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (regex.test(document.querySelector('#payment-email').value.toLowerCase())) {
        document.querySelector('#payment-email').style.border = '2px solid rgb(0 255 8 / 80%)'
        isValidEmail = true
        return
    } else {
        document.querySelector('#payment-email').style.border = '2px solid rgb(255 0 118 / 80%)'
        isValidEmail = false
        return
    }

})


document.querySelector("#payment-close").addEventListener("click", () => {
    document.querySelector("#payments-modal").style.display = 'none'
})


document.querySelector("#payment-terms").querySelector("a").addEventListener("click", () => {
    document.querySelector("#payment-img").style.display = 'none'

    document.querySelector("#payments-modal").querySelector("h5").style.display = 'block'
    document.querySelector("#termsandconditions").style.display = 'block'
})



const quantityBtns = document.querySelector("#payment-quantity-input").querySelectorAll("span")

for (let i = 0; i < quantityBtns.length; i++) {
    quantityBtns[i].addEventListener("click", async () => {
        const currentQuantityElement = document.querySelector("#payment-quantity")
        const priceElement = document.querySelector("#payment-amount")
        let currentQuantity = currentQuantityElement.value
        let pricePerOne = priceElement.dataset.amountPerOne

        if (quantityBtns[i].dataset.job == "add") {
            currentQuantity++
            currentQuantity = (currentQuantity > 9) ? 10 : currentQuantity
        } else {
            currentQuantity--
            currentQuantity = (currentQuantity < 1) ? 1 : currentQuantity
        }

        currentQuantityElement.value = currentQuantity
        priceElement.innerHTML = `$${(Number(pricePerOne * currentQuantity).toFixed(2))}`
    })
}

