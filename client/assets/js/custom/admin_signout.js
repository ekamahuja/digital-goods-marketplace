document.querySelector("#logout").addEventListener("click", async() => {
    try {
        const request = await fetch("/api/auth/session", {method: "DELETE"})
        const response = await request.json()

        toastr.message(response.message, 'success', 5000)

        if (response.success) {
            window.setTimeout(() =>{
                window.location.href = '/admin'
            }, 1000)
        }

    } catch(err) {
        toastr.message(err.message, "error", 5000)
    }
})