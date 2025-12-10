const sesion = JSON.parse(localStorage.getItem('sesion_activa'));
if (!sesion) {
    alert("Acceso denegado: Debes iniciar sesión.");
    window.location.href = 'login.html';
}

const perfilKey = `perfil_${sesion.user}`;
const perfilData = JSON.parse(localStorage.getItem(perfilKey)) || {
    nombre: sesion.user,
    avatar: "Resources/images.png"
};

const hamburgerBtn = document.getElementById('open-menu');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('btnCerrar');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));

if (toggleSwitch) {
    if (document.documentElement.getAttribute('data-theme') === 'dark') toggleSwitch.checked = true;
    toggleSwitch.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
    });
}

const fileInput = document.getElementById('post-file');
const uploadTrigger = document.getElementById('upload-trigger');
const previewContainer = document.getElementById('preview-container');
const previewImg = document.getElementById('preview-img');
const removeImgBtn = document.getElementById('remove-img-btn');

let imagenBase64 = null;

uploadTrigger.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            imagenBase64 = reader.result;
            previewImg.src = imagenBase64;
            previewContainer.style.display = 'block';
            uploadTrigger.style.display = 'none';
        };
    }
});

removeImgBtn.addEventListener('click', () => {
    fileInput.value = '';
    imagenBase64 = null;
    previewContainer.style.display = 'none';
    uploadTrigger.style.display = 'block';
});

const form = document.getElementById('create-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('post-title').value;
    const cuerpo = document.getElementById('post-body').value;

    let posts = JSON.parse(localStorage.getItem('mis_posts_v1')) || [];

    const nuevoPost = {
        id: Date.now(),
        titulo: titulo,
        texto: cuerpo,
        imagen: imagenBase64,
        autor: perfilData.nombre,
        autorAvatar: perfilData.avatar,
        ownerId: sesion.user,
        fecha: new Date().toLocaleDateString(),
        votos: 0,
        comentarios: []
    };

    posts.unshift(nuevoPost);
    localStorage.setItem('mis_posts_v1', JSON.stringify(posts));

    window.location.href = 'index.html';
});

const modal = document.getElementById('article-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.querySelector('.article-body');
const modalAuthorContainer = document.getElementById('modal-author-container');
const modalImageContainer = document.querySelector('.article-image-container');

if(closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

const btnConfig = document.getElementById('btn-config');
if(btnConfig) {
    btnConfig.addEventListener('click', (e) => {
        e.preventDefault();
        modalTitle.innerText = "Configuración";
        if(modalAuthorContainer) modalAuthorContainer.style.display = 'none';
        if(modalImageContainer) modalImageContainer.style.display = 'none';
        modalBody.innerHTML = `<p style="text-align:center;">Vuelve al inicio para configurar tu cuenta.</p>`;
        modal.classList.add('active');
    });
}

const btnAcerca = document.getElementById('btn-acerca');
if(btnAcerca) {
    btnAcerca.addEventListener('click', (e) => {
        e.preventDefault();
        modalTitle.innerText = "Acerca de";
        if(modalAuthorContainer) modalAuthorContainer.style.display = 'none';
        if(modalImageContainer) modalImageContainer.style.display = 'none';
        modalBody.innerHTML = `<p><strong>Creador:</strong> Andres Callisaya<br>Estudiante de Ing. de Sistemas - Univalle.</p>`;
        modal.classList.add('active');
    });
}