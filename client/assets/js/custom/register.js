const register = document.querySelector("#register")
const registerBtn = document.querySelector("#register-btn")
const firstName = document.querySelector("#firstName")
const lastName = document.querySelector("#lastName")
const userName = document.querySelector("#userName")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const confirmPassword = document.querySelector("#confirmPassword")


const inputs = register.querySelectorAll("input")


for (let i = 0; i < inputs.length ; i++) {
    inputs[i].addEventListener("input", () => {
        if (inputs[i].id.includes("assword")) {
            if (password.value === confirmPassword.value) {
                password.style.border="2px solid lime"
                confirmPassword.style.border="2px solid lime"
            } else {
                password.style.border="2px solid rgb(255 0 118 / 80%)"
                confirmPassword.style.border="2px solid rgb(255 0 118 / 80%)"
            }
            return 
        }

        if (inputs[i].id.includes("email")) {
            validator.isEmail(email.value) ? email.style.border="2px solid lime" : email.style.border="2px solid rgb(255 0 118 / 80%)"
            return;
        }

        (inputs[i].value.length > 3) ? inputs[i].style.border="2px solid lime" : inputs[i].style.border="2px solid rgb(255 0 118 / 80%)"
    })
}







registerBtn.addEventListener("click", async () => {
    try {
        if (!(password.value === confirmPassword.value)) throw new Error("Password do not match"); 
        if (userName.value.length < 5) throw new Error("Username must be at least 5 characters");

        registerAccount(firstName.value, lastName.value, userName.value, email.value, password.value)
    } catch(err) {
        toastr.message(err.message, 'error', 5000)
    }

})


const registerAccount = async (firstName, lastName, userName, email, password) => {
    try {
        const params = { firstName, lastName, userName, email, password }
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            cache: "no-cache",
            body: JSON.stringify(params)
        }


        const request = await fetch("/api/auth/register", options)
        const { success, message, redirect } = await request.json();

        toastr.message(message, success ? 'success' : 'error', 5000)

        if (success) {
            window.location.href = redirect
        }

    } catch(err) {
        toastr.message(err.message, 'error', 5000)
    }
}