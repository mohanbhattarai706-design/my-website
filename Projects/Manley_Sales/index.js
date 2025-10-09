
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // Check for saved theme preference, default to light
        const savedTheme = typeof(Storage) !== "undefined" ? (localStorage.getItem('theme') || 'light') : 'light';
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('theme', currentTheme);
            }
        });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Header scroll effect
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // Active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinksItems = document.querySelectorAll('.nav-link');

        function activateNavLink() {
            let current = 'home';
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 150;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    current = sectionId;
                }
            });

            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', activateNavLink);

        // Slider functionality
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.querySelector('.slider-arrow.prev');
        const nextBtn = document.querySelector('.slider-arrow.next');
        let currentSlide = 0;
        let slideInterval;
        let isTransitioning = false;

        function showSlide(index) {
            if (isTransitioning) return;
            isTransitioning = true;

            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetSlideShow() {
            clearInterval(slideInterval);
            startSlideShow();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideShow();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideShow();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideShow();
            });
        });

        // Pause slider on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        sliderContainer.addEventListener('mouseleave', () => {
            startSlideShow();
        });

        startSlideShow();

        // Scroll animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });

        // Product tabs and show more functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        const productCards = document.querySelectorAll('.product-card');
        const showMoreBtn = document.getElementById('showMoreBtn');
        let currentCategory = 'all';
        let showAll = false;
        const INITIAL_SHOW_COUNT = 9;

        function filterAndDisplayProducts() {
            let visibleCount = 0;
            let filteredCards = [];

            productCards.forEach((card) => {
                const cardCategories = card.getAttribute('data-category').split(' ');
                
                if (currentCategory === 'all' || cardCategories.includes(currentCategory)) {
                    filteredCards.push(card);
                }
            });

            // Hide all cards first
            productCards.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('visible');
            });

            // Show cards based on showAll state
            const cardsToShow = showAll ? filteredCards.length : Math.min(INITIAL_SHOW_COUNT, filteredCards.length);
            
            filteredCards.forEach((card, index) => {
                if (index < cardsToShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.animation = `slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s both`;
                        card.classList.add('visible');
                    }, 10);
                    visibleCount++;
                }
            });

            // Show/hide "Show More" button
            if (filteredCards.length > INITIAL_SHOW_COUNT) {
                showMoreBtn.style.display = 'block';
                showMoreBtn.textContent = showAll ? 'Show Less' : 'Show More';
            } else {
                showMoreBtn.style.display = 'none';
            }
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.getAttribute('data-category');
                showAll = false;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                filterAndDisplayProducts();
                
                // Smooth scroll to products section
                const productsSection = document.getElementById('products');
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = productsSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });

        showMoreBtn.addEventListener('click', () => {
            showAll = !showAll;
            filterAndDisplayProducts();
        });

        // Initialize product display
        filterAndDisplayProducts();

        // Contact Form Handler
        const contactForm = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message
            formSuccess.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Animated counter for stats
        const counters = document.querySelectorAll('.stat-number');
        let counterAnimated = false;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    if (target === 100) {
                        counter.textContent = '100%';
                    } else if (target >= 25 && target <= 1000) {
                        counter.textContent = target + '+';
                    }
                }
            };
            
            updateCounter();
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    counterAnimated = true;
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // Initialize active nav on page load
        activateNavLink();

        // Preload images
        function preloadImages() {
            slides.forEach(slide => {
                const bg = slide.querySelector('.slide-bg');
                const bgImage = bg.style.backgroundImage || bg.style.background;
                if (bgImage) {
                    const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (urlMatch && urlMatch[1]) {
                        const img = new Image();
                        img.src = urlMatch[1];
                    }
                }
            });
        }

        preloadImages();

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
