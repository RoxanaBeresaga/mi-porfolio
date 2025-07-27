// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Animación de "Fade-in" al hacer scroll para las secciones ---
    // Esta función observa cuándo una sección entra en el viewport para añadir la clase 'is-visible'
    const sections = document.querySelectorAll('.section');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si la sección es visible, añadir la clase para la animación
                entry.target.classList.add('is-visible');
                // Dejar de observar esta sección una vez que se ha animado
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Opciones del Intersection Observer
        root: null, // Observar con respecto al viewport
        rootMargin: '0px', // Sin margen adicional
        threshold: 0.1 // Activar cuando el 10% de la sección sea visible
    });

    // Observar cada sección
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 2. Desplazamiento suave (Smooth Scroll) para los enlaces de navegación ---
    // Esto mejora la experiencia de usuario al hacer clic en los enlaces del sidebar
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevenir el comportamiento por defecto del ancla

            const targetId = this.getAttribute('href'); // Obtener el ID del objetivo (ej. #about)
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Desplazarse suavemente al objetivo
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });

                // Opcional: Actualizar la URL sin recargar la página
                history.pushState(null, null, targetId);

                // Opcional: Añadir/remover clase 'active' para resaltar la sección actual
                document.querySelectorAll('.main-nav a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Opcional: Resaltar la sección activa al hacer scroll
    const updateActiveNavLink = () => {
        const currentScroll = window.scrollY;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Ajuste para que se active antes de llegar al top
            const sectionBottom = sectionTop + section.offsetHeight;
            const navLink = document.querySelector(`.main-nav a[href="#${section.id}"]`);

            if (navLink) {
                if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveNavLink);
    // Ejecutar al cargar para que la primera sección esté activa si es necesario
    updateActiveNavLink();


    // --- 3. Validación Básica del Formulario de Contacto (Frontend) ---
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Evitar el envío real del formulario por ahora

            // Limpiar mensajes anteriores
            formMessages.textContent = '';
            formMessages.className = 'form-messages'; // Resetear clases

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            let isValid = true;
            let errorMessage = '';

            if (name === '') {
                isValid = false;
                errorMessage += 'El campo Nombre es obligatorio.<br>';
            }

            if (email === '') {
                isValid = false;
                errorMessage += 'El campo Email es obligatorio.<br>';
            } else if (!validateEmail(email)) { // Usar una función auxiliar para validar formato de email
                isValid = false;
                errorMessage += 'Por favor, introduce un email válido.<br>';
            }

            if (message === '') {
                isValid = false;
                errorMessage += 'El campo Mensaje es obligatorio.<br>';
            }

            if (isValid) {
                // Si todo es válido, simular envío y mostrar mensaje de éxito
                formMessages.classList.add('success');
                formMessages.innerHTML = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                formMessages.style.display = 'block'; // Mostrar el mensaje

                // Limpiar el formulario
                contactForm.reset();

                // En un proyecto real, aquí harías una petición AJAX (fetch API) al servidor
                // fetch('/tu-endpoint-de-envio', {
                //     method: 'POST',
                //     body: new FormData(contactForm)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     if (data.success) {
                //         formMessages.classList.add('success');
                //         formMessages.textContent = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                //     } else {
                //         formMessages.classList.add('error');
                //         formMessages.textContent = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
                //     }
                //     formMessages.style.display = 'block';
                // })
                // .catch(error => {
                //     formMessages.classList.add('error');
                //     formMessages.textContent = 'Error de red. Por favor, inténtalo más tarde.';
                //     formMessages.style.display = 'block';
                // });

            } else {
                // Mostrar mensaje de error
                formMessages.classList.add('error');
                formMessages.innerHTML = errorMessage;
                formMessages.style.display = 'block'; // Mostrar el mensaje
            }
        });
    }

    // Función auxiliar para validar formato de email simple
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // --- 4. (Opcional) Funcionalidad de Menú Hamburguesa para Móviles ---
    // Actualmente, en el CSS para móviles, la navegación está oculta.
    // Si quisieras un botón para mostrar/ocultar el menú, necesitarías añadir
    // un botón de menú hamburguesa en el HTML y la siguiente lógica JS:

    // // HTML (añadir un botón en el sidebar, ej. al lado del profile-info)
    // // <button class="menu-toggle" aria-label="Toggle navigation">
    // //    <i class="fas fa-bars"></i>
    // // </button>

    // // CSS (ej. para mostrar/ocultar y animar el sidebar o la nav)
    // // .sidebar.active { transform: translateX(0); }
    // // .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; } /* Si el sidebar sale de la pantalla */

    // const menuToggle = document.querySelector('.menu-toggle');
    // const mainNav = document.querySelector('.main-nav');
    // const sidebar = document.querySelector('.sidebar'); // O el elemento que quieras animar

    // if (menuToggle) {
    //     menuToggle.addEventListener('click', () => {
    //         mainNav.classList.toggle('active'); // O sidebar.classList.toggle('active');
    //         // También puedes cambiar el icono
    //         const icon = menuToggle.querySelector('i');
    //         icon.classList.toggle('fa-bars');
    //         icon.classList.toggle('fa-times'); // O un icono de "X"
    //     });
    // }
});


