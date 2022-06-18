let deliverdGoodsAmount = 0
let orderId;

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


window.addEventListener('load', async () => {
    processPaymentData()
})




async function processPaymentData() {
    const data = await paymentData()
    const keysDiv = document.querySelector("#order-items")

    document.querySelector("#payment-status").innerHTML = data.orderData.status

    if (data.orderData.deliveredGoods !== 0) {
        for (let key of data.orderData.deliveredGoods) {
            const p = document.createElement("p")
            p.innerHTML = key
            keysDiv.appendChild(p)
        }

        if (data.orderData.deliveredGoods = 1) {
            document.querySelector("#upgrade-btn").style.display = "block"
        } else {
            document.querySelector("#copy-btn").style.display = "none"
        }   

        document.querySelector("#payment-loader").style.display = "none"
        document.querySelector("#deliverdgoods").style.display = "block"

        deliverdGoodsAmount = (data.orderData.deliveredGoods).length

        checkIfNewOrderAndSaveCookie()
    }

    if (data.orderData.deliveredGoods === 0) {
        setTimeout(function() {
            if (deliverdGoodsAmount === 0) {
                processPaymentData()
            }
          }, 3000);
    }
}



const paymentData = async () => {
    try {
        const url = window.location.href
        orderId = url.split("/")
        const request = await fetch(`/api/payments/${orderId[orderId.length - 1]}`)
        const response = await request.json()

        if (request.status == 404) {
            toastr.message("Order Not found, please contact staff", 'error', 5000)
        }
        return response
    } catch(err) {
        toastr.message(err.message, 'error', 5000)
    }
}


const checkIfNewOrderAndSaveCookie = async () => {
    const request = await fetch(`/api/payments/order-cookie/${orderId[orderId.length - 1]}`)
}