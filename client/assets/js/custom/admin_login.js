document.querySelector("#admin-login-btn").addEventListener("click", async function() {
    const account = document.querySelector("#admin-username").value
    const password =  document.querySelector("#admin-password").value

    const param = {
        account,
        password
    }

    const options = {
        headers: {
            "Content-Type": "application/json"
        },  
        method: "POST",
        body: JSON.stringify(param)
    }

    const request = await fetch("/api/auth/login", options)
    const response = await request.json()
    toastr.message(response.message, (response.success) ? 'success' : 'error', 5000)
    
    if (response.success) {
        window.location.href = response.redirect
    } else {
        document.querySelector('#admin-password').value = ""
    }
})