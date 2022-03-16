




document.querySelector('#keySearch-btn').addEventListener('click', async () => {
    const request = await fetch(`http://localhost:12345/api/key?key=${document.querySelector("#keySearch-input").value}`)
    const response = await request.json()

    const messageType = (response.success) ? 'success' : 'error'
    toastr.message(response.message, messageType, 3000)

    if (response.success) {
        document.querySelector("#replacement-form").style.display = 'none'
        document.querySelector("#success-keyinfo").style.display = 'block'

        if (response.keyData.redeemed) {
            document.querySelector("#upgrade-data").style.display = 'block'
        }
    }
    console.log(response)
})

