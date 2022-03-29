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
    const {success, message, totalCountries, totalStock, data} = await stockDataFetchAPI


    if (success) {
        document.querySelector("#countryStock-modal-content").innerHTML = `<h5 class="modal-heading">Stock Info</h5>`;
        
        const stockInfo = document.createElement("div")
        stockInfo.className = "countryStock-modal-item bg-diff";
        stockInfo.innerHTML = `<p>Total Countries: ${totalCountries}</p><p>Total Stock: ${totalStock}</p>`
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
    const request = await fetch("/api/data/stock")
    const {success, message, totalCountries, data} = await request.json()

    data.sort(function (a, b) {
        if (a.name < b.name) {return -1}
        if (a.name < b.name) {return 1}
        return 0
    })

    let totalStock = 0
    data.forEach(item => {
        totalStock = totalStock + item.stock
    })

    stockDataFetchAPI = {
        success,
        message,
        totalCountries,
        totalStock,
        data
    }

    stockModalFetchBtn.disabled = false
});



window.onclick = function (event) {
    if (event.target == document.querySelector("#countryStock-modal")) {
      document.querySelector("#countryStock-modal").style.display = "none";
    }
};