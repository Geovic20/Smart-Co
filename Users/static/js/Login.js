const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

function loginFunction(){
    loginForm.style.left = "50%";
    loginForm.style.opacity = 1;
    registerForm.style.left = "150%";
    registerForm.style.opacity = 0;
    wrapper.style.height = "500px";
    loginTitle.style.top = "50%";
    loginTitle.style.opacity = 1;
    registerTitle.style.top = "50px";
    registerTitle.style.opacity = 0;
}

function registerFunction(){
    loginForm.style.left = "-50%";
    loginForm.style.opacity = 0;
    registerForm.style.left = "50%";
    registerForm.style.opacity = 1;
    wrapper.style.height = "700px";
    loginTitle.style.top = "-60px";
    loginTitle.style.opacity = 0;
    registerTitle.style.top = "50%";
    registerTitle.style.opacity = 1;
}

// Ajout d'un écouteur d'événement pour le bouton "Sign Up"
// Vérification en temps réel
document.getElementById('id_password2').addEventListener('input', function() {
    const p1 = document.getElementById('id_password1').value;
    const p2 = this.value;
    const errorDiv = document.querySelector('.password-error');
    
    if (p1 && p2 && p1 !== p2) {
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'error-message password-error';
            div.textContent = 'Les mots de passe ne correspondent pas';
            this.parentNode.insertBefore(div, this.nextSibling);
        }
    } else if (errorDiv) {
        errorDiv.remove();
    }
});


