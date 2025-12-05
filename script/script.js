document.addEventListener('DOMContentLoaded', () => {
    const btnHamburguesa = document.getElementById('btnHamburguesa');
    const menuMovil = document.getElementById('menuMovil');
    const btnCerrar = document.getElementById('btnCerrar');

    const toggleMenu = () => {
        menuMovil.classList.toggle('activo');
    };

    if (btnHamburguesa) {
        btnHamburguesa.addEventListener('click', toggleMenu);
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            menuMovil.classList.remove('activo');
        });
    }

    const scrollContainer = document.querySelector('.contenedor-scroll');
    if (scrollContainer) {
        scrollContainer.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        });
    }
});