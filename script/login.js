const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value.trim();
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();

    let usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];

    const existe = usuarios.find(u => u.user === user);
    if (existe) {
        alert("¡Ese usuario ya existe!");
        return;
    }

    usuarios.push({ email, user, pass });
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ahora inicia sesión.");
    
    registerForm.reset();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    let usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    
    const usuarioValido = usuarios.find(u => u.user === user && u.pass === pass);

    if (usuarioValido) {
        localStorage.setItem('sesion_activa', JSON.stringify(usuarioValido));
        window.location.href = 'index.html';
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});