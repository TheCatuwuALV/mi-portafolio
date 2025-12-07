const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }    
}

if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme, false);
}

const scrollContainer = document.querySelector(".masonry-layout");

if (scrollContainer) {
    scrollContainer.addEventListener("wheel", (evt) => {
        if (window.innerWidth > 768) {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        }
    });
}

const hamburgerBtn = document.getElementById('open-menu');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('btnCerrar');

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

const modal = document.getElementById('article-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const allCards = document.querySelectorAll('.card');

const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalAuthorName = document.getElementById('modal-author-name');
const modalDate = document.getElementById('modal-date');
const modalBody = document.querySelector('.article-body');

function restaurarVistaModal() {
    if(modalImage) modalImage.style.display = 'block';
    if(modalAuthorName) modalAuthorName.style.display = 'inline';
    if(modalDate) modalDate.style.display = 'inline';
    const authorContainer = document.querySelector('.author-modal');
    if(authorContainer) authorContainer.style.display = 'flex';
}

if (modal && allCards.length > 0) {
    allCards.forEach(card => {
        card.addEventListener('click', () => {
            restaurarVistaModal();

            const title = card.querySelector('h2').innerText;
            const imgElement = card.querySelector('img');
            
            let imgSrc = 'Resources/univalle.jpg';
            if (imgElement) {
                imgSrc = imgElement.src;
            }

            const authorName = card.querySelector('.author-info span')?.innerText || 'Andy Josh';
            const date = card.querySelector('.author-info small')?.innerText || 'Fecha desconocida';

            modalTitle.innerText = title;
            modalImage.src = imgSrc;
            modalAuthorName.innerText = authorName;
            modalDate.innerText = date;
            
            const loremText = `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Feugiat pretium, mi sed id dui sed orci, tempor.</p>
                <p>Leo, feugiat amet neque, quis. Amet, eget vulputate cursus in eu sit pulvinar et.</p>
                <p>In elementum pharetra in lacinia nibh. Non est eget egestas eu et purus amet.</p>
            `;
            modalBody.innerHTML = loremText;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            
            if (window.innerWidth > 768) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }
}

const btnInicio = document.getElementById('btn-inicio');

if (btnInicio) {
    btnInicio.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        if (window.innerWidth > 768) {
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            }
        } else {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
            mobileMenu.classList.remove('active');
        }
    });
}

const btnPerfilFooter = document.getElementById('btn-perfil-footer');
if (btnPerfilFooter) {
    btnPerfilFooter.addEventListener('click', () => {
        if (typeof restaurarVistaModal === "function") restaurarVistaModal();
        
        modalTitle.innerText = "Mi Perfil";
        modalImage.src = "Resources/images.png"; 
        modalAuthorName.innerText = "Andy Josh";
        modalDate.innerText = "Miembro desde 2021";
        
        const perfilHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p><strong>Estadísticas:</strong></p>
                <p>150 Karma &nbsp; | &nbsp; 12 Publicaciones</p>
            </div>
            <hr style="opacity: 0.2; margin: 20px 0;">
            <h3>Mis Publicaciones Recientes</h3>
            <ul style="list-style: none; padding: 0; margin-top: 15px;">
                <li style="margin-bottom: 10px; padding: 10px; border: 1px solid var(--line-color); border-radius: 8px;">
                    <strong>Proyecto Final Progra Web</strong><br><small>Hace 2 horas</small>
                </li>
                <li style="margin-bottom: 10px; padding: 10px; border: 1px solid var(--line-color); border-radius: 8px;">
                    <strong>¿Cómo centrar un div?</strong><br><small>Hace 1 día</small>
                </li>
            </ul>
        `;
        
        document.querySelector('.article-body').innerHTML = perfilHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

const btnAcerca = document.getElementById('btn-acerca');
if (btnAcerca) {
    btnAcerca.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof restaurarVistaModal === "function") restaurarVistaModal();
        
        modalTitle.innerText = "Sobre el Desarrollador";
        modalImage.src = "Resources/images.png"; 
        modalAuthorName.innerText = "Andres Callisaya";
        modalDate.innerText = "Ingeniería de Sistemas";
        
        const bioTexto = `
            <p><strong>Hola! soy Andres Callisaya.</strong></p>
            <p>Soy estudiante de segundo semestre en la Universidad Privada del Valle (UNIVALLE). Este es mi proyecto de la materia de Programacion Web 1 llamado "5-chan", está fuertemente inspirado en plataformas de comunicación como Reddit y X (Antes Twitter), fue diseñado con HTML, CSS y JavaScript Vanilla.</p>
            <p>Me apasiona el diseño minimalista y la tecnología.</p>
            <p>Fue un gusto realizar este proyecto, espero que lo disfrutes!</p>
        `;
        
        document.querySelector('.article-body').innerHTML = bioTexto;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.innerWidth <= 768) mobileMenu.classList.remove('active');
    });
}

const btnConfig = document.getElementById('btn-config');
if (btnConfig) {
    btnConfig.addEventListener('click', (e) => {
        e.preventDefault();
        
        modalTitle.innerText = "Personalizar Perfil";
        
        modalImage.style.display = 'none'; 
        const authorContainer = document.querySelector('.author-modal');
        if(authorContainer) authorContainer.style.display = 'none';

        const settingsHTML = `
            <div class="profile-banner">
                <button style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                    <i class="fa-solid fa-camera"></i> Editar Portada
                </button>
                <div style="position: absolute; bottom: -35px; left: 30px;">
                    <img src="Resources/images.png" class="profile-avatar-edit" alt="Avatar">
                    <div class="edit-icon-overlay"><i class="fa-solid fa-plus"></i></div>
                </div>
            </div>

            <div class="profile-edit-content">
                <h2 style="margin: 0; font-size: 1.8rem;">Andy Josh</h2>
                <span style="color: gray;">u/Andres • 3 años en 5-chan</span>
                
                <p style="margin-top: 15px; font-size: 0.95rem;">
                    Estudiante de Univalle.
                    <a href="#" style="color: var(--accent-color); font-weight: bold; text-decoration: none;">Editar Bio</a>
                </p>
                <hr style="border: 0; border-top: 1px solid var(--line-color); margin: 25px 0;">
                <h3 style="margin-bottom: 15px;">Ajustes de Cuenta</h3>
                
                <div class="settings-grid">
                    <div class="setting-item">
                        <div><strong>ChanTag</strong><br><small style="opacity: 0.7;">Como eres ante el mundo</small></div>
                        <button class="btn-pill">Cambiar</button>
                    </div>
                    <div class="setting-item">
                        <div><strong>Me ves o no me ves</strong><br><small style="opacity: 0.7;">Activar/desactivar en linea</small></div>
                        <label class="theme-switch" style="pointer-events: none;"><input type="checkbox" checked /><div class="slider round"></div></label>
                    </div>
                </div>
                
                <div style="text-align: right; margin-top: 30px;">
                    <button class="btn-pill" style="background: var(--text-color); color: var(--bg-color); border: none;">chan push</button>
                </div>
            </div>
        `;
        
        document.querySelector('.article-body').innerHTML = settingsHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.innerWidth <= 768) mobileMenu.classList.remove('active');
    });
}

const btnTendencias = document.getElementById('btn-tendencias');
if (btnTendencias) {
    btnTendencias.addEventListener('click', (e) => {
        e.preventDefault();
        alert("espera un poquin.");
        if (window.innerWidth <= 768) mobileMenu.classList.remove('active');
    });
}
