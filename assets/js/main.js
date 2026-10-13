document.addEventListener('DOMContentLoaded', () => {
    // ========================================================================
    // 1. Scroll Reveal Animations
    // ========================================================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // ========================================================================
    // 2. Navbar Scroll Effect (supports Dark & Light Mode via CSS classes)
    // ========================================================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ========================================================================
    // 3. Dark / Light Mode Toggle with Persistence (localStorage)
    // ========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const updateThemeIcon = (isDark) => {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            themeToggle.setAttribute('title', isDark ? 'تفعيل الوضع المضيء' : 'تفعيل الوضع الليلي');
        }
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    // ========================================================================
    // 4. Video Player Modal
    // ========================================================================
    const modalPlayer = document.getElementById('videoModal');
    const videoElement = document.getElementById('modalVideo');
    const closePlayer = document.querySelector('.close-player');

    window.openVideoModal = (videoUrl) => {
        if (!modalPlayer || !videoElement) {
            if (videoUrl) window.open(videoUrl, '_blank');
            return;
        }
        // If it's a direct mp4 or video file
        if (videoUrl.endsWith('.mp4') || videoUrl.includes('firebasestorage') || videoUrl.includes('uploads')) {
            videoElement.src = videoUrl;
            modalPlayer.style.display = 'block';
            videoElement.play();
        } else {
            // External link (YouTube/Drive/Vimeo)
            window.open(videoUrl, '_blank');
        }
    };

    const closeVideoPlayer = () => {
        if (!modalPlayer) return;
        modalPlayer.style.display = 'none';
        if (videoElement) {
            videoElement.pause();
            videoElement.src = '';
        }
    };

    if (closePlayer) closePlayer.addEventListener('click', closeVideoPlayer);
    if (modalPlayer) {
        modalPlayer.addEventListener('click', (e) => {
            if (e.target === modalPlayer) closeVideoPlayer();
        });
    }

    // ========================================================================
    // 5. Interactive Project Details Modal
    // ========================================================================
    const projectModal = document.getElementById('projectModal');

    window.openProjectModal = (project) => {
        if (!projectModal) return;

        const mediaContainer = document.getElementById('pm-media');
        const badge = document.getElementById('pm-badge');
        const title = document.getElementById('pm-title');
        const desc = document.getElementById('pm-desc');
        const tags = document.getElementById('pm-tags');
        const tagsContainer = document.getElementById('pm-tags-container');
        const liveBtn = document.getElementById('pm-live-btn');
        const githubBtn = document.getElementById('pm-github-btn');

        // Media
        if (mediaContainer) {
            const isVideo = project.mediaType === 'video' || (project.videoUrl && !project.imageUrl);
            const mediaUrl = project.mediaUrl || project.imageUrl || project.thumbnailUrl || '';

            if (isVideo && mediaUrl.endsWith('.mp4')) {
                mediaContainer.innerHTML = `<video controls autoplay style="width:100%; max-height:420px;"><source src="${mediaUrl}" type="video/mp4"></video>`;
            } else if (mediaUrl) {
                mediaContainer.innerHTML = `<img src="${mediaUrl}" alt="${project.title || 'Project'}" onerror="this.src='https://placehold.co/800x450?text=No+Image'">`;
            } else {
                mediaContainer.innerHTML = '';
            }
        }

        // Title & Category
        if (badge) badge.textContent = project.category || 'Portfolio';
        if (title) title.textContent = project.title || 'بدون عنوان';
        if (desc) desc.textContent = project.description || 'لا يتوفر وصف إضافي لهذا المشروع.';

        // Technologies tags
        if (tags && tagsContainer) {
            const techList = Array.isArray(project.technologies) 
                ? project.technologies 
                : (typeof project.technologies === 'string' && project.technologies.trim() 
                    ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
                    : []);

            if (techList.length > 0) {
                tags.innerHTML = techList.map(t => `<span class="project-modal-tag">${t}</span>`).join('');
                tagsContainer.style.display = 'block';
            } else {
                tagsContainer.style.display = 'none';
            }
        }

        // Live Demo button
        if (liveBtn) {
            if (project.liveUrl && project.liveUrl.trim()) {
                liveBtn.href = project.liveUrl.trim();
                liveBtn.style.display = 'inline-flex';
            } else {
                liveBtn.style.display = 'none';
            }
        }

        // GitHub button
        if (githubBtn) {
            if (project.githubUrl && project.githubUrl.trim()) {
                githubBtn.href = project.githubUrl.trim();
                githubBtn.style.display = 'inline-flex';
            } else {
                githubBtn.style.display = 'none';
            }
        }

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeProjectModal = () => {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
        const mediaContainer = document.getElementById('pm-media');
        if (mediaContainer) {
            const video = mediaContainer.querySelector('video');
            if (video) video.pause();
        }
    };

    // Close on backdrop click
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                window.closeProjectModal();
            }
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoPlayer();
            window.closeProjectModal();
        }
    });
});
