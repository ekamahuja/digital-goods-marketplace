let userCountry;
let stockDataFetchAPI;
const stockModalFetchBtn = document.querySelector("#check-stock")

stockModalFetchBtn.addEventListener("click", async () => {
    stockModalFetchBtn.disabled
    stockModalFetchBtn.innerHTML = "Fetching..."
    const done = await grabStock()

    if (done) {
        stockModalFetchBtn.disabled = false
        stockModalFetchBtn.innerHTML = "Check Stock"
    }
})


const grabStock = async () => {
    const {success, stockWithCountries, totalStock, data} = await stockDataFetchAPI


    if (success) {
        document.querySelector("#countryStock-modal-content").innerHTML = `<h5 class="modal-heading">Stock Info</h5>`;
        
        const stockInfo = document.createElement("div")
        stockInfo.className = "countryStock-modal-item bg-diff";
        stockInfo.innerHTML = `<p>Total Countries With Stock: ${stockWithCountries}</p><p>Total Stock Avaliable: ${totalStock}</p>`
        document.querySelector("#countryStock-modal-content").appendChild(stockInfo);

        document.querySelector("#countryStock-modal").style.display = "block";
        data.forEach(item => {
            if (item.stock > 0) {
                const countryDiv = document.createElement('div')
                countryDiv.className = "countryStock-modal-item";
                countryDiv.innerHTML = `<p>Country: ${item.name} (${item.countryCode})</p><p>Avaliable Stock: ${item.stock}</p>`
                document.querySelector("#countryStock-modal-content").appendChild(countryDiv);
            }
        })
    }

    return true
}

window.addEventListener('load', async () => {
    const request = await fetch("https://ipapi.co/json")
    const response = await request.json()

    const country = response.country_name
    userCountry = response.country
    

    document.querySelector("#upgradeCountry-input").value = country || "Could not fetch country"
})

window.addEventListener('load', async () => {
    const request = await fetch("/api/data/stock")
    const {success, message, totalCountries, data} = await request.json()

    data.sort(function (a, b) {
        if (a.name < b.name) {return -1}
        if (a.name < b.name) {return 1}
        return 0
    })

    let totalStock = 0
    let stockWithCountries = 0
    data.forEach(item => {
        totalStock = totalStock + item.stock
        if (item.stock > 0) {
            stockWithCountries++
        }
    })

    stockDataFetchAPI = {
        success,
        message,
        totalCountries,
        stockWithCountries,
        totalStock,
        data
    }

    stockModalFetchBtn.disabled = false
    
    noStockMessage()

});


function noStockMessage() {
    if (userCountry) {
        userCountryData = stockDataFetchAPI.data.find(item => item.countryCode == userCountry)
        if (!userCountryData || userCountryData.stock == 0) {
            createAlert("It looks like your country is not in stock! If you own a VPN, then you may follow our <button onclick='vpnmodal()' href='#'>VPN trick</button> to bypass the error. If you do not own a VPN, you may wait for a restock. <a href='/discord' target='_tab'>Join our Discord</a> to know about the next restock and more.", "info")
        } 
    } else {
        console.log('ok')
        setTimeout(() => {
            noStockMessage()
        }, 250)
    }
}



window.onclick = function (event) {
    if (event.target == document.querySelector("#countryStock-modal")) {
      document.querySelector("#countryStock-modal").style.display = "none";
    }

    if (event.target == document.querySelector("#vpn-modal")) {
        document.querySelector("#vpn-modal").style.display = "none";
      }
};


function vpnmodal() {
    document.querySelector("#vpn-modal").style.display = 'block'
}




async function createAlert(message, type) {
    const upgradeForm = document.querySelector("#upgrade-form")
    const replacementForm = document.querySelector("#replacement-form")

    const alertDiv = document.createElement("div")
    alertDiv.className = `upgrader-alert ${type}`
    alertDiv.innerHTML=`<p>${message}</p>`

    if (upgradeForm) {
        upgradeForm.prepend(alertDiv)
    } else if (replacementForm) {
        replacementForm.prepend(alertDiv)
    }
    
}