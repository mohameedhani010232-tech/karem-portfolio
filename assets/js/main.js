document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 2. Video Modal Player
    const playButtons = document.querySelectorAll('.play-btn');
    const modalPlayer = document.getElementById('videoModal');
    const videoElement = document.getElementById('modalVideo');
    const closePlayer = document.querySelector('.close-modal');

    if(playButtons.length > 0 && modalPlayer && videoElement) {
        playButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const videoUrl = btn.getAttribute('data-video');
                if(videoUrl) {
                    videoElement.src = videoUrl;
                    modalPlayer.style.display = 'block';
                    videoElement.play();
                }
            });
        });

        const closeModal = () => {
            modalPlayer.style.display = 'none';
            videoElement.pause();
            videoElement.src = '';
        };

        if(closePlayer) closePlayer.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modalPlayer) closeModal();
        });
    }

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // 4. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        
        if(localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
});
