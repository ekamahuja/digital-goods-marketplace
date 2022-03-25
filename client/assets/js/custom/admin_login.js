document.querySelector("#admin-login-btn").addEventListener("click", async function() {
    const username = document.querySelector("#admin-username").value
    const password =  document.querySelector("#admin-password").value

    const param = {
        username,
        password
    }

    const options = {
        headers: {
            "Content-Type": "application/json"
        },  
        method: "POST",
        body: JSON.stringify(param)
    }

    const request = await fetch("http://localhost:12345/api/auth/session", options)
    const response = await request.json()
    toastr.message(response.message, (response.success) ? 'success' : 'error', 5000)
    
    if (response.success) {
        window.location.href = '/admin/dashboard'
    } else {
        document.querySelector('#admin-password').value = ""
    }
})