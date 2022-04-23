let currentPage = 0
let totalPages = 0

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


window.addEventListener('load', async () => {
    setPaymentData()
})



const setPaymentData = async (customData = false) => {
    let data = customData || await paymentData(currentPage) 

    
    totalPages = data.totalPages - 1 || totalPages
    document.querySelector("#number-of-total-items").innerHTML = `Page ${currentPage + 1} Out Of ${totalPages + 1}`

    const tableBody = document.querySelector("#payments-table-body")
    if (data.payments.length == 0) return tableBody.innerHTML = 'No records found'

    tableBody.innerHTML = ''
    for (payment of data.payments) {
        const paymentTr = document.createElement("tr")
        // paymentTr.id = payment.orderId
        paymentTr.setAttribute('onclick', `loadOrderDetatils('${payment.orderId}')`)
        const paymentTdOne = document.createElement("td")
        const paymentTdTwo = document.createElement("td")
        const paymentTdThree = document.createElement("td")
        const paymentTdFour = document.createElement("td")

        // paymentTdOne stuff
        const divTableCellOne = document.createElement("div")
        divTableCellOne.setAttribute("class", "payments-table-cell");

        const flagIcon = document.createElement("img")
        flagIcon.setAttribute("class", "flag-icon")
        flagIcon.src = `https://cdn.sellix.io/static/flags/${(payment.customerCountryCode).toLowerCase()}.svg`

        const basicDivOne = document.createElement("div")
        basicDivOne.innerHTML = `<span class="d-flex txt-captialize">${payment.paymentMethod} - ${payment.customerEmail}</span><span class="d-flex">${payment.orderId} - x${payment.quantity} ${payment.productName}</span>`
        
        divTableCellOne.appendChild(flagIcon)
        divTableCellOne.appendChild(basicDivOne)
        paymentTdOne.appendChild(divTableCellOne)
        paymentTr.appendChild(paymentTdOne)
        tableBody.appendChild(paymentTr)

        // paymentTdTWo stuff
        const divTableCellTwo = document.createElement("div")
        divTableCellTwo.setAttribute("class", "payments-table-cell flex-column");
        
        divTableCellTwo.innerHTML = `<span class="d-flex">$${(payment.amountPaid).toFixed(2)}</span><span class="d-flex txt-captialize">${payment.paymentMethod}</span>`
        
        paymentTdTwo.appendChild(divTableCellTwo)
        paymentTr.appendChild(paymentTdTwo)
        tableBody.appendChild(paymentTr)

        // paymentTdThree stuff
        const divStatus = document.createElement("div")
        divStatus.setAttribute("class", "d-flex")
        
        divStatus.innerHTML = `<div class="payment-badge badge-${payment.status.toLowerCase()} txt-captialize">${payment.status}</div>`
        paymentTdThree.appendChild(divStatus)
        paymentTr.appendChild(paymentTdThree)
        tableBody.appendChild(paymentTr)

        let createdAt = new Date(payment.createdAt)
        const currentHour = createdAt.getHours()
        const currentMinute = (createdAt.getMinutes()<10?'0':'') + createdAt.getMinutes()
        const currentDayOfMonth = createdAt.getDate();
        const currentMonth = months[createdAt.getMonth()];
        const currentYear = createdAt.getFullYear();

        //paymentTdFour stuff
        paymentTdFour.innerHTML = `${currentHour}:${currentMinute} ${currentDayOfMonth} ${currentMonth} ${currentYear}`
        paymentTr.appendChild(paymentTdFour)
        tableBody.appendChild(paymentTr)
    }

}



const paymentData = async (pageNumber) => {
    try {
        const request = await fetch(`/api/payments/?page=${pageNumber}`)
        const response = await request.json()

        currentPage = pageNumber
        return response
    } catch(err) {
        toastr.message(err.message,  'error', 5000)
    }
}



const loadOrderDetatils = async (orderId) => {
    window.location.href = `/admin/payments/${orderId}`
}


const paginationBtns = document.querySelector("#pagination-pages-ul").querySelectorAll("li")
for (let i = 0; i < paginationBtns.length; i++) {
    paginationBtns[i].addEventListener('click', async () => {

        if (paginationBtns[i].dataset.job == "page-input") return;

        if (paginationBtns[i].dataset.job == "down") {
            currentPage--
            if (currentPage < 0) return currentPage = 0
        } else if (paginationBtns[i].dataset.job == "up") {
            currentPage++
            if (currentPage > totalPages) {
                return currentPage = totalPages
            }
        }

        document.querySelector("#pagination-page-number").innerHTML = currentPage + 1
    
        setPaymentData()
    })
}



document.querySelector("#payments-search-bar").addEventListener("input", async () => {
    if(document.querySelector("#payments-search-bar").value == 0) {
        return setPaymentData()
    }

    const request = await fetch(`/api/payments/search?query=${document.querySelector("#payments-search-bar").value}`)
    const response = await request.json()

    const {success, message} = response

    if (!success) return toastr.message(message, 'error', 5000)

    setPaymentData(response)
})