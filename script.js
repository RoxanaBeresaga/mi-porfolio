// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZAR SUPABASE
    const SUPABASE_URL = 'https://zwxitucszkorpttdandp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eGl0dWNzemtvcnB0dGRhbmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDQ1NTcsImV4cCI6MjA2OTcyMDU1N30.0OzHalfsKaSRv9R-61WBZUdXLjY1HC1YfBS_LNfqHWY';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const sections = document.querySelectorAll('.section');
    // --- 1. Animación de "Fade-in" al hacer scroll para las secciones ---
    // Esta función observa cuándo una sección entra en el viewport para añadir la clase 'is-visible' 
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
            e.preventDefault(); 

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
            } else if (!validateEmail(email)) { 
                isValid = false;
                errorMessage += 'Por favor, introduce un email válido.<br>';
            }

            if (message === '') {
                isValid = false;
                errorMessage += 'El campo Mensaje es obligatorio.<br>';
            }

               if (isValid) {
                (async () => {
                    const { data, error } = await supabase
                        .from('messages')
                        .insert([{ name, email, message }]);

                    if (error) {
                        formMessages.classList.add('error');
                        formMessages.innerHTML = 'Hubo un error al enviar tu mensaje. Intentá nuevamente.';
                        formMessages.style.display = 'block';
                        console.error(error);
                    } else {
                        formMessages.classList.add('success');
                        formMessages.innerHTML = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                        formMessages.style.display = 'block';
                        contactForm.reset();
                    }
                })();
            } 

        }); 

    } 

    // Función auxiliar para validar formato de email simple
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

}); 