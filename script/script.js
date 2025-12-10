const usuarioActivo = JSON.parse(localStorage.getItem('sesion_activa'));
const perfilKey = usuarioActivo ? `perfil_${usuarioActivo.user}` : 'perfil_guest';

let perfilData = JSON.parse(localStorage.getItem(perfilKey)) || {
    nombre: usuarioActivo ? usuarioActivo.user : "Invitado",
    bio: "Estudiante de Programación Web.",
    avatar: "Resources/images.png", 
    banner: null 
};

let currentPostId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (usuarioActivo) {
        const btnAcerca = document.getElementById('btn-acerca');
        if (btnAcerca) {
            btnAcerca.innerHTML = `<i class="fa-solid fa-user-check"></i> Hola, ${perfilData.nombre}`;
        }
    }
    cargarYRenderizar();
});

const postsContainer = document.getElementById('posts-container');
const trendsContainer = document.getElementById('trends-container'); 
const activeContainer = postsContainer || trendsContainer; 
const btnPublicarFooter = document.getElementById('btn-footer-publicar');

const DATOS_EJEMPLO = [
    { id: 1, titulo: "Bienvenido a 5-chan", texto: "Esta es una publicación de ejemplo...", imagen: null, autor: "Admin", autorAvatar: "Resources/images.png", ownerId: "admin", fecha: "Hoy", votos: 150, comentarios: [] },
    { id: 2, titulo: "Universidad del Valle", texto: "Un gran lugar para aprender.", imagen: "Resources/univalle.jpg", autor: "Admin", autorAvatar: "Resources/images.png", ownerId: "admin", fecha: "Ayer", votos: 42, comentarios: [] },
    { id: 3, titulo: "Diseño Web", texto: "HTML, CSS y JS puro.", imagen: "Resources/5-1200x675.png", autor: "Admin", autorAvatar: "Resources/images.png", ownerId: "admin", fecha: "Ayer", votos: 8, comentarios: [] }
];

function cargarYRenderizar() {
    let posts = JSON.parse(localStorage.getItem('mis_posts_v1'));
    
    if (!posts || posts.length === 0) {
        posts = DATOS_EJEMPLO;
        localStorage.setItem('mis_posts_v1', JSON.stringify(posts));
    }

    if (trendsContainer) {
        posts.sort((a, b) => (b.votos || 0) - (a.votos || 0));
        posts = posts.slice(0, 7);
        trendsContainer.innerHTML = '';
    } else if (postsContainer) {
        postsContainer.innerHTML = '';
    } else {
        return; 
    }

    posts.forEach(post => {
        crearCartaHTML(post);
    });
}

function guardarCambiosEnMemoria(postsActualizados) {
    localStorage.setItem('mis_posts_v1', JSON.stringify(postsActualizados));
    cargarYRenderizar();
}

function crearCartaHTML(post) {
    if (!activeContainer) return;

    const article = document.createElement('article');
    article.classList.add('card');
    
    const imgHTML = post.imagen ? `<img src="${post.imagen}" class="card-img" alt="Post Image">` : '';
    const avatarSrc = post.autorAvatar || "Resources/images.png";

    let menuHTML = '';
    if (usuarioActivo && post.ownerId === usuarioActivo.user) {
        menuHTML = `
            <div class="options-menu-container" onclick="event.stopPropagation()">
                <button class="btn-options" onclick="toggleMenu(this)"><i class="fa-solid fa-ellipsis"></i></button>
                <div class="options-dropdown">
                    <button onclick="editarPost(${post.id})"><i class="fa-solid fa-pen"></i> Editar</button>
                    <button class="delete-btn" onclick="eliminarPost(${post.id})"><i class="fa-solid fa-trash"></i> Eliminar</button>
                </div>
            </div>
        `;
    }

    article.innerHTML = `
        ${menuHTML}
        ${imgHTML}
        <h2>${post.titulo}</h2>
        <p>${post.texto ? post.texto.substring(0, 100) + '...' : 'Sin descripción...'}</p>
        
        <div class="author">
            <img src="${avatarSrc}" alt="Avatar">
            <div class="author-info">
                <span>${post.autor}</span>
                <small>${post.fecha}</small>
            </div>
        </div>

        <div class="vote-section" onclick="event.stopPropagation()">
            <button class="vote-btn up"><i class="fa-solid fa-arrow-up"></i></button>
            <span class="vote-count">${post.votos || 0}</span>
            <button class="vote-btn down"><i class="fa-solid fa-arrow-down"></i></button>
        </div>
    `;

    article.addEventListener('click', (e) => {
        if(e.target.closest('.vote-btn') || e.target.closest('.options-menu-container') || e.target.closest('.btn-options') || e.target.closest('.options-dropdown')) return;
        abrirModalArticulo(post);
    });

    activarVotosParaCarta(article, post.id);
    activeContainer.appendChild(article);
}

function activarVotosParaCarta(cardElement, postId) {
    const btnUp = cardElement.querySelector('.up');
    const btnDown = cardElement.querySelector('.down');
    const countSpan = cardElement.querySelector('.vote-count');

    const actualizarVotosMemoria = (nuevoValor) => {
        let posts = JSON.parse(localStorage.getItem('mis_posts_v1')) || [];
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index].votos = nuevoValor;
            localStorage.setItem('mis_posts_v1', JSON.stringify(posts));
        }
    };

    btnUp.addEventListener('click', () => {
        let val = parseInt(countSpan.innerText);
        if (btnUp.classList.contains('active')) { btnUp.classList.remove('active'); val--; } 
        else { if (btnDown.classList.contains('active')) { btnDown.classList.remove('active'); val++; } btnUp.classList.add('active'); val++; }
        countSpan.innerText = val; actualizarVotosMemoria(val);
    });

    btnDown.addEventListener('click', () => {
        let val = parseInt(countSpan.innerText);
        if (btnDown.classList.contains('active')) { btnDown.classList.remove('active'); val++; } 
        else { if (btnUp.classList.contains('active')) { btnUp.classList.remove('active'); val--; } btnDown.classList.add('active'); val--; }
        countSpan.innerText = val; actualizarVotosMemoria(val);
    });
}

const modal = document.getElementById('article-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalAuthorName = document.getElementById('modal-author-name');
const modalDate = document.getElementById('modal-date');
const modalAuthorImg = document.getElementById('modal-author-img');
const modalBody = document.querySelector('.article-body');
const commentList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const btnSubmitComment = document.getElementById('btn-comment-submit');

function restaurarVistaModal() {
    if(modalImage) modalImage.style.display = 'block';
    if(modalAuthorName) modalAuthorName.style.display = 'inline';
    const authorContainer = document.querySelector('.author-modal');
    if(authorContainer) authorContainer.style.display = 'flex';
    const commentsSection = document.querySelector('.comments-section');
    if(commentsSection) commentsSection.style.display = 'block';
}

function abrirModalArticulo(post) {
    restaurarVistaModal();
    currentPostId = post.id; 

    modalTitle.innerText = post.titulo;
    if(post.imagen) { modalImage.src = post.imagen; modalImage.style.display = 'block'; }
    else { modalImage.style.display = 'none'; }
    
    modalAuthorName.innerText = post.autor;
    modalDate.innerText = post.fecha;
    if(modalAuthorImg) modalAuthorImg.src = post.autorAvatar || "Resources/images.png";

    modalBody.innerHTML = `<p>${post.texto ? post.texto.replace(/\n/g, '<br>') : ''}</p>`;
    
    if(commentList) {
        commentList.innerHTML = '';
        if (post.comentarios && Array.isArray(post.comentarios)) {
            post.comentarios.forEach((comentario, index) => {
                pintarComentarioEnHTML(comentario, index);
            });
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function pintarComentarioEnHTML(comentario, index) {
    const div = document.createElement('div');
    div.className = 'single-comment';
    
    let menuComentario = '';
    if (usuarioActivo && comentario.ownerId === usuarioActivo.user) {
        menuComentario = `
            <div class="options-menu-container">
                <button class="btn-options" onclick="toggleMenu(this)"><i class="fa-solid fa-ellipsis"></i></button>
                <div class="options-dropdown">
                    <button class="delete-btn" onclick="eliminarComentario(${index})"><i class="fa-solid fa-trash"></i> Borrar</button>
                </div>
            </div>
        `;
    }

    div.innerHTML = `
        <img src="${comentario.avatar}" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${comentario.autor}</span>
                <span class="comment-date">${comentario.fecha}</span>
            </div>
            <div class="comment-text">${comentario.texto}</div>
        </div>
        ${menuComentario}
    `;
    commentList.prepend(div);
}

window.eliminarComentario = function(index) {
    if(!confirm("¿Borrar comentario?")) return;
    let posts = JSON.parse(localStorage.getItem('mis_posts_v1')) || [];
    const pIndex = posts.findIndex(p => p.id === currentPostId);
    
    if(pIndex !== -1) {
        posts[pIndex].comentarios.splice(index, 1);
        localStorage.setItem('mis_posts_v1', JSON.stringify(posts));
        abrirModalArticulo(posts[pIndex]);
    }
};

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (window.innerWidth > 768) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    });
}

if (btnSubmitComment) {
    btnSubmitComment.addEventListener('click', () => {
        const txt = commentInput.value.trim();
        if (!txt) return;
        if (!usuarioActivo) { alert("Inicia sesión para comentar."); return; }

        const nuevoComentario = {
            autor: perfilData.nombre,
            avatar: perfilData.avatar,
            ownerId: usuarioActivo.user,
            texto: txt,
            fecha: "Justo ahora"
        };

        let posts = JSON.parse(localStorage.getItem('mis_posts_v1')) || [];
        const idx = posts.findIndex(p => p.id === currentPostId);
        
        if (idx !== -1) {
            if (!posts[idx].comentarios) posts[idx].comentarios = [];
            posts[idx].comentarios.push(nuevoComentario);
            localStorage.setItem('mis_posts_v1', JSON.stringify(posts));
            abrirModalArticulo(posts[idx]);
            commentInput.value = '';
        }
    });
}

const hamburgerBtn = document.getElementById('open-menu');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('btnCerrar');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));

if (toggleSwitch) {
    toggleSwitch.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
    });
}

const scrollContainer = document.querySelector(".masonry-layout");
if (scrollContainer) {
    scrollContainer.addEventListener("wheel", (evt) => {
        if (window.innerWidth > 768) {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY + evt.deltaX;
        }
    }, { passive: false });
}

const btnInicio = document.getElementById('btn-inicio');
if(btnInicio) btnInicio.addEventListener('click', (e) => {
    if(trendsContainer) return; 
    e.preventDefault();
    if (window.innerWidth > 768 && scrollContainer) scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
    else { window.scrollTo({ top: 0, behavior: 'smooth' }); mobileMenu.classList.remove('active'); }
});

const btnPerfilFooter = document.getElementById('btn-perfil-footer');
if(btnPerfilFooter) {
    btnPerfilFooter.addEventListener('click', () => {
        restaurarVistaModal();
        modalTitle.innerText = "Mi Perfil";
        modalImage.style.display = 'none';
        modalAuthorName.style.display = 'none';
        modalDate.style.display = 'none';
        document.querySelector('.comments-section').style.display = 'none';
        document.querySelector('.author-modal').style.display = 'none';

        const nombre = usuarioActivo ? perfilData.nombre : "Invitado";
        const email = usuarioActivo ? usuarioActivo.email : "Sin registro";
        const bannerStyle = perfilData.banner ? `background-image: url('${perfilData.banner}'); background-size: cover;` : `background: linear-gradient(90deg, #0079D3 0%, #0045AC 100%);`;

        modalBody.innerHTML = `
            <div class="profile-banner" style="${bannerStyle}">
                <div style="position: absolute; bottom: -35px; left: 30px;">
                    <img src="${perfilData.avatar}" class="profile-avatar-edit" style="border: 4px solid var(--card-bg);">
                </div>
            </div>
            <div class="profile-edit-content">
                <h2 style="margin: 0; margin-top: 40px; font-size: 1.8rem;">${nombre}</h2>
                <p style="color: gray; margin-bottom: 15px;">${email}</p>
                <p style="font-size: 1rem; line-height: 1.5;">${usuarioActivo ? perfilData.bio : '...'}</p>
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--line-color);">
                <div style="text-align: center; margin-top: 30px;">
                    <button id="btn-logout-accion" class="btn-pill" style="background:red; color:white; border:none; padding: 10px 20px;">
                        ${usuarioActivo ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                    </button>
                </div>
            </div>`;
        
        modal.classList.add('active');

        const btnLogout = document.getElementById('btn-logout-accion');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                if (usuarioActivo) localStorage.removeItem('sesion_activa');
                window.location.href = 'login.html';
            });
        }
    });
}

const btnAcerca = document.getElementById('btn-acerca');
if(btnAcerca) {
    btnAcerca.addEventListener('click', (e) => {
        e.preventDefault();
        restaurarVistaModal();
        modalTitle.innerText = "Acerca de";
        modalImage.style.display = 'none';
        document.querySelector('.author-modal').style.display = 'none';
        document.querySelector('.comments-section').style.display = 'none';
        modalBody.innerHTML = `<p><strong>Creador:</strong> Andres Callisaya<br>Univalle.</p>`;
        modal.classList.add('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
    });
}

const btnConfig = document.getElementById('btn-config');
if(btnConfig) {
    btnConfig.addEventListener('click', (e) => {
        e.preventDefault();
        restaurarVistaModal();
        modalTitle.innerText = "Personalizar Perfil";
        modalImage.style.display = 'none'; 
        document.querySelector('.author-modal').style.display = 'none';
        document.querySelector('.comments-section').style.display = 'none';

        if (!usuarioActivo) {
            modalBody.innerHTML = `<div style="text-align: center; padding: 40px;"><i class="fa-solid fa-lock" style="font-size: 3rem;"></i><h3>Solo Usuarios</h3><p>Inicia sesión para editar tu perfil.</p></div>`;
            modal.classList.add('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            return;
        }

        const bannerStyle = perfilData.banner ? `background-image: url('${perfilData.banner}'); background-size: cover;` : `background: linear-gradient(90deg, #0079D3 0%, #0045AC 100%);`;

        modalBody.innerHTML = `
            <div class="profile-banner" style="${bannerStyle}">
                <button id="btn-change-banner" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                    <i class="fa-solid fa-camera"></i> Cambiar Fondo
                </button>
                <div style="position: absolute; bottom: -35px; left: 30px;">
                    <img id="img-avatar-preview" src="${perfilData.avatar}" class="profile-avatar-edit">
                    <div id="btn-change-avatar" class="edit-icon-overlay"><i class="fa-solid fa-pen"></i></div>
                </div>
            </div>
            <div class="profile-edit-content">
                <br><br>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label>Nombre de Usuario</label>
                        <input type="text" id="input-nombre" value="${perfilData.nombre}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; margin-top: 5px;">
                    </div>
                    <div class="setting-item" style="display: block;">
                        <label>Presentación (Bio)</label>
                        <textarea id="input-bio" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; margin-top: 5px; resize: vertical;">${perfilData.bio}</textarea>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 30px;">
                    <button id="btn-save-profile" class="btn-pill" style="background: var(--text-color); color: var(--bg-color); border: none;">Guardar Cambios</button>
                </div>
            </div>
            <input type="file" id="file-banner" accept="image/*" style="display: none;">
            <input type="file" id="file-avatar" accept="image/*" style="display: none;">
        `;

        modal.classList.add('active');
        if (mobileMenu) mobileMenu.classList.remove('active');

        document.getElementById('btn-change-avatar').addEventListener('click', () => document.getElementById('file-avatar').click());
        document.getElementById('file-avatar').addEventListener('change', (evt) => {
            const file = evt.target.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = (r) => {
                    document.getElementById('img-avatar-preview').src = r.target.result;
                    perfilData.avatar = r.target.result; 
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('btn-change-banner').addEventListener('click', () => document.getElementById('file-banner').click());
        document.getElementById('file-banner').addEventListener('change', (evt) => {
            const file = evt.target.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = (r) => {
                    const bannerDiv = document.querySelector('.profile-banner');
                    bannerDiv.style.background = `url('${r.target.result}')`;
                    bannerDiv.style.backgroundSize = 'cover';
                    perfilData.banner = r.target.result; 
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('btn-save-profile').addEventListener('click', () => {
            const nuevoNombre = document.getElementById('input-nombre').value;
            const nuevaBio = document.getElementById('input-bio').value;
            if(nuevoNombre) perfilData.nombre = nuevoNombre;
            if(nuevaBio) perfilData.bio = nuevaBio;
            localStorage.setItem(perfilKey, JSON.stringify(perfilData));
            alert("Perfil actualizado correctamente.");
            location.reload(); 
        });
    });
}

if (btnPublicarFooter) {
    btnPublicarFooter.addEventListener('click', (e) => {
        e.preventDefault(); 
        if (usuarioActivo) {
            window.location.href = 'crear.html';
        } else {
            if(confirm("🔒 Debes iniciar sesión para publicar.\n¿Quieres ir al login ahora?")) {
                window.location.href = 'login.html';
            }
        }
    });
}

window.toggleMenu = function(btn) {
    document.querySelectorAll('.options-dropdown').forEach(d => d.classList.remove('show'));
    const dropdown = btn.nextElementSibling;
    dropdown.classList.toggle('show');
    
    const closeMenu = (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
};

window.eliminarPost = function(id) {
    if(!confirm("¿Estás seguro de que quieres eliminar esta publicación? No se puede deshacer.")) return;

    let posts = JSON.parse(localStorage.getItem('mis_posts_v1')) || [];
    const postsRestantes = posts.filter(post => post.id !== id);
    
    guardarCambiosEnMemoria(postsRestantes);
};

window.editarPost = function(id) {
    let posts = JSON.parse(localStorage.getItem('mis_posts_v1')) || [];
    const index = posts.findIndex(p => p.id === id);
    
    if (index === -1) return;

    const nuevoTitulo = prompt("Editar Título:", posts[index].titulo);
    if (nuevoTitulo === null) return; 
    
    const nuevoTexto = prompt("Editar Texto:", posts[index].texto);
    if (nuevoTexto === null) return;

    posts[index].titulo = nuevoTitulo;
    posts[index].texto = nuevoTexto;
    
    guardarCambiosEnMemoria(posts);
};