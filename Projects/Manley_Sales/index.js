
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

// Hero Slider Button Functionality
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        const productsSection = document.getElementById('products');
        const header = document.getElementById('header');
        const targetPosition = productsSection.offsetTop - header.offsetHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('click', function() {
        const aboutSection = document.getElementById('about');
        const header = document.getElementById('header');
        const targetPosition = aboutSection.offsetTop - header.offsetHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// PRODUCT MODAL - ADD THIS ENTIRE SECTION
const productData = {
    'Bok Choy': { category: 'Vegetables', badge: 'FRESH', description: 'Fresh, crisp bok choy with tender white stems and dark green leaves. Perfect for stir-fries, soups, and steaming.', features: [{ icon: '✓', text: 'Daily Fresh Delivery' }, { icon: '✓', text: 'Baby & Standard Sizes' }, { icon: '✓', text: 'Hydro-Cooled Freshness' }, { icon: '✓', text: 'Pesticide-Free Options' }] },
    'Eggplant': { category: 'Vegetables', badge: 'FRESH', description: 'Premium purple eggplant with glossy skin. Perfect for grilling, roasting, or stir-frying.', features: [{ icon: '✓', text: 'Farm-Fresh Quality' }, { icon: '✓', text: 'Multiple Varieties' }, { icon: '✓', text: 'Hand-Selected' }, { icon: '✓', text: 'Year-Round Availability' }] },
    'Flat Cabbage': { category: 'Vegetables', badge: 'FRESH', description: 'Tender flat cabbage with sweet, delicate flavor. Ideal for salads and light cooking.', features: [{ icon: '✓', text: 'Locally Sourced' }, { icon: '✓', text: 'Crisp & Sweet' }, { icon: '✓', text: 'Extended Shelf Life' }, { icon: '✓', text: 'Versatile Use' }] },
    'Gai Lan': { category: 'Vegetables', badge: 'FRESH', description: 'Authentic Chinese broccoli with thick stems. Staple in Cantonese cuisine.', features: [{ icon: '✓', text: 'Restaurant Quality' }, { icon: '✓', text: 'Rich in Iron & Calcium' }, { icon: '✓', text: 'Blanch-Ready' }, { icon: '✓', text: 'Authentic Variety' }] },
    'Green Onion': { category: 'Vegetables', badge: 'FRESH', description: 'Fresh green onions with crisp bulbs. Essential for garnishing.', features: [{ icon: '✓', text: 'Freshly Harvested' }, { icon: '✓', text: 'Multiple Sizes' }, { icon: '✓', text: 'Perfect for Garnishing' }, { icon: '✓', text: 'Hydroponic Options' }] },
    'Mini Baby Bok Choy': { category: 'Vegetables', badge: 'PREMIUM', description: 'Premium miniature bok choy. Perfect portion size for individual servings.', features: [{ icon: '✓', text: 'Single-Serve Portions' }, { icon: '✓', text: 'Tender Leaves' }, { icon: '✓', text: 'Gourmet Quality' }, { icon: '✓', text: 'Quick Cooking' }] },
    'Mini Shanghai Bok Choy': { category: 'Vegetables', badge: 'FRESH', description: 'Petite Shanghai bok choy with sweet taste. Ideal for steaming.', features: [{ icon: '✓', text: 'Sweet Flavor' }, { icon: '✓', text: 'Consistent Size' }, { icon: '✓', text: 'No Waste' }, { icon: '✓', text: 'Perfect for Steaming' }] },
    'Nappa Cabbage': { category: 'Vegetables', badge: 'FRESH', description: 'Premium Napa cabbage. Essential for kimchi and stir-fries.', features: [{ icon: '✓', text: 'Kimchi-Grade' }, { icon: '✓', text: 'Tight Formation' }, { icon: '✓', text: 'Sweet & Mild' }, { icon: '✓', text: 'Year-Round Supply' }] },
    'Shanghai Bok': { category: 'Vegetables', badge: 'FRESH', description: 'Full-size Shanghai bok choy. Excellent for braising.', features: [{ icon: '✓', text: 'Restaurant Grade' }, { icon: '✓', text: 'Thick Stems' }, { icon: '✓', text: 'Consistent Quality' }, { icon: '✓', text: 'Versatile' }] },
    'Snap Peas': { category: 'Vegetables', badge: 'SEASONAL', description: 'Crisp, sweet snap peas. Edible pod and all.', features: [{ icon: '✓', text: 'Eat Pod & All' }, { icon: '✓', text: 'Sweet & Crunchy' }, { icon: '✓', text: 'Great for Snacking' }, { icon: '✓', text: 'Peak Freshness' }] },
    'Snow Peas': { category: 'Vegetables', badge: 'FRESH', description: 'Tender flat snow peas. Classic stir-fry vegetable.', features: [{ icon: '✓', text: 'Ultra-Tender' }, { icon: '✓', text: 'Quick-Cooking' }, { icon: '✓', text: 'Stir-Fry Ready' }, { icon: '✓', text: 'Sweet Flavor' }] },
    'Brown Asian Pear': { category: 'Fruits', badge: 'PREMIUM', description: 'Premium brown Asian pears. Crisp and juicy.', features: [{ icon: '✓', text: 'Crisp Texture' }, { icon: '✓', text: 'Sweet & Juicy' }, { icon: '✓', text: 'High in Fiber' }, { icon: '✓', text: 'Long Shelf Life' }] },
    'Fuji Apple': { category: 'Fruits', badge: 'FRESH', description: 'Sweet, crisp Fuji apples. Customer favorite.', features: [{ icon: '✓', text: 'Extra Sweet' }, { icon: '✓', text: 'Super Crispy' }, { icon: '✓', text: 'Long Storage' }, { icon: '✓', text: 'Perfect Snacking' }] },
    'Honey Pomelo': { category: 'Fruits', badge: 'PREMIUM', description: 'Large, sweet honey pomelo. Mild citrus flavor.', features: [{ icon: '✓', text: 'Sweet Flavor' }, { icon: '✓', text: 'Large Segments' }, { icon: '✓', text: 'High Vitamin C' }, { icon: '✓', text: 'Gift Quality' }] },
    'Oranges': { category: 'Fruits', badge: 'SEASONAL', description: 'Fresh, juicy oranges. Packed with vitamin C.', features: [{ icon: '✓', text: 'Peak Seasonal' }, { icon: '✓', text: 'High Juice' }, { icon: '✓', text: 'Easy Peel' }, { icon: '✓', text: 'Rich in Vitamin C' }] },
    'Rambutan': { category: 'Fruits', badge: 'EXOTIC', description: 'Exotic rambutan with sweet flesh. Seasonal favorite.', features: [{ icon: '✓', text: 'Sweet Tropical' }, { icon: '✓', text: 'Seasonal' }, { icon: '✓', text: 'Rich in Vitamin C' }, { icon: '✓', text: 'Unique Look' }] },
    'Red Dragonfruit': { category: 'Fruits', badge: 'EXOTIC', description: 'Vibrant red dragon fruit. Stunning visual appeal.', features: [{ icon: '✓', text: 'Stunning Visuals' }, { icon: '✓', text: 'High Antioxidants' }, { icon: '✓', text: 'Mildly Sweet' }, { icon: '✓', text: 'Instagram-Worthy' }] },
    'Red Flesh Honey Pomelo': { category: 'Fruits', badge: 'PREMIUM', description: 'Premium honey pomelo with red flesh. Extra sweet.', features: [{ icon: '✓', text: 'Red-Pink Flesh' }, { icon: '✓', text: 'Extra Sweet' }, { icon: '✓', text: 'Gift Quality' }, { icon: '✓', text: 'Limited Availability' }] },
    'Ya Pears': { category: 'Fruits', badge: 'FRESH', description: 'Crisp Chinese Ya pears. Traditional variety.', features: [{ icon: '✓', text: 'Refreshing' }, { icon: '✓', text: 'Very Juicy' }, { icon: '✓', text: 'Traditional' }, { icon: '✓', text: 'Health Benefits' }] },
    'Yellow Asian Pear': { category: 'Fruits', badge: 'PREMIUM', description: 'Golden Asian pears. Exceptional sweetness.', features: [{ icon: '✓', text: 'Exceptionally Sweet' }, { icon: '✓', text: 'Golden Color' }, { icon: '✓', text: 'Premium Grade' }, { icon: '✓', text: 'Crisp & Juicy' }] },
    'Yellow Dragonfruit': { category: 'Fruits', badge: 'EXOTIC', description: 'Rare yellow dragon fruit. Sweetest variety.', features: [{ icon: '✓', text: 'Rare Yellow' }, { icon: '✓', text: 'Sweetest Type' }, { icon: '✓', text: 'Limited Supply' }, { icon: '✓', text: 'High Demand' }] },
    'Young Coconut': { category: 'Fruits', badge: 'FRESH', description: 'Fresh young coconuts. Sweet water and tender meat.', features: [{ icon: '✓', text: 'Sweet Water' }, { icon: '✓', text: 'Tender Meat' }, { icon: '✓', text: 'Natural Electrolytes' }, { icon: '✓', text: 'Pre-Trimmed' }] },
    'Carrot': { category: 'Roots', badge: 'FRESH', description: 'Fresh, crisp carrots. Rich in beta-carotene.', features: [{ icon: '✓', text: 'Sweet & Crunchy' }, { icon: '✓', text: 'High Beta-Carotene' }, { icon: '✓', text: 'Versatile' }, { icon: '✓', text: 'Year-Round' }] },
    'Eddoes': { category: 'Roots', badge: 'FRESH', description: 'Nutty-flavored root vegetables. Creamy when cooked.', features: [{ icon: '✓', text: 'Nutty Flavor' }, { icon: '✓', text: 'Creamy Cooked' }, { icon: '✓', text: 'Authentic' }, { icon: '✓', text: 'High Fiber' }] },
    'Ginger': { category: 'Roots', badge: 'FRESH', description: 'Fresh ginger root. Essential for Asian cooking.', features: [{ icon: '✓', text: 'Aromatic & Spicy' }, { icon: '✓', text: 'Medicinal Uses' }, { icon: '✓', text: 'Young Ginger' }, { icon: '✓', text: 'Premium Quality' }] },
    'Green Lo Bok': { category: 'Roots', badge: 'FRESH', description: 'Green daikon radish. Mild, sweet flavor.', features: [{ icon: '✓', text: 'Mild Sweet' }, { icon: '✓', text: 'Crisp Texture' }, { icon: '✓', text: 'Great Pickling' }, { icon: '✓', text: 'Unique Green' }] },
    'Kohlrabi': { category: 'Roots', badge: 'FRESH', description: 'Crisp kohlrabi. Versatile vegetable.', features: [{ icon: '✓', text: 'Mild Flavor' }, { icon: '✓', text: 'Crisp & Refreshing' }, { icon: '✓', text: 'Versatile' }, { icon: '✓', text: 'Rich Vitamin C' }] },
    'Lo Bok': { category: 'Roots', badge: 'PREMIUM', description: 'Large daikon radish. Essential for Asian cooking.', features: [{ icon: '✓', text: 'Large Premium' }, { icon: '✓', text: 'Essential Ingredient' }, { icon: '✓', text: 'Versatile' }, { icon: '✓', text: 'Long Shelf Life' }] },
    'Lotus Root': { category: 'Roots', badge: 'PREMIUM', description: 'Fresh lotus root. Unique lacy pattern.', features: [{ icon: '✓', text: 'Lacy Pattern' }, { icon: '✓', text: 'Crunchy' }, { icon: '✓', text: 'Versatile' }, { icon: '✓', text: 'Rich in Fiber' }] },
    'Malanga Coco (Taro)': { category: 'Roots', badge: 'FRESH', description: 'Starchy root vegetable. Nutty flavor.', features: [{ icon: '✓', text: 'Creamy Cooked' }, { icon: '✓', text: 'Nutty Flavor' }, { icon: '✓', text: 'Multiple Varieties' }, { icon: '✓', text: 'High Fiber' }] },
    'Purple Sweet Potatoes': { category: 'Roots', badge: 'PREMIUM', description: 'Vibrant purple sweet potatoes. Rich in antioxidants.', features: [{ icon: '✓', text: 'Rich Antioxidants' }, { icon: '✓', text: 'Naturally Sweet' }, { icon: '✓', text: 'Purple Color' }, { icon: '✓', text: 'Superfood' }] },
    'Turmeric': { category: 'Roots', badge: 'FRESH', description: 'Fresh turmeric root. Powerful health benefits.', features: [{ icon: '✓', text: 'Fresh Not Dried' }, { icon: '✓', text: 'Anti-Inflammatory' }, { icon: '✓', text: 'Medicinal' }, { icon: '✓', text: 'Bright Orange' }] },
    'Yuca (Cassava)': { category: 'Roots', badge: 'FRESH', description: 'Starchy yuca root. Gluten-free alternative.', features: [{ icon: '✓', text: 'Gluten-Free' }, { icon: '✓', text: 'Versatile Starch' }, { icon: '✓', text: 'Perfect Frying' }, { icon: '✓', text: 'Long Storage' }] },
    'Butternut Squash': { category: 'Squashes', badge: 'SEASONAL', description: 'Sweet butternut squash. Perfect for roasting.', features: [{ icon: '✓', text: 'Sweet Nutty' }, { icon: '✓', text: 'Perfect Roasting' }, { icon: '✓', text: 'Rich Vitamins' }, { icon: '✓', text: 'Seasonal Peak' }] },
    'Chayote': { category: 'Squashes', badge: 'FRESH', description: 'Mild-flavored chayote squash. Low in calories.', features: [{ icon: '✓', text: 'Mild Versatile' }, { icon: '✓', text: 'Crisp Texture' }, { icon: '✓', text: 'Low Calories' }, { icon: '✓', text: 'Year-Round' }] },
    'Kabocha': { category: 'Squashes', badge: 'PREMIUM', description: 'Japanese pumpkin. Naturally sweet.', features: [{ icon: '✓', text: 'Naturally Sweet' }, { icon: '✓', text: 'Dense Creamy' }, { icon: '✓', text: 'Japanese Variety' }, { icon: '✓', text: 'Versatile' }] }
};

const modalHTML = `<div class="product-modal" id="productModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;align-items:center;justify-content:center;padding:2rem;"><div class="modal-content" style="background:var(--bg-card);border:2px solid var(--border-color);border-radius:30px;max-width:900px;width:100%;max-height:90vh;position:relative;box-shadow:0 25px 100px rgba(0,0,0,0.5);overflow:hidden;"><button class="modal-close" id="modalClose" style="position:absolute;top:1.5rem;right:1.5rem;width:45px;height:45px;background:rgba(255,255,255,0.1);border:2px solid var(--border-color);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;font-size:1.5rem;color:var(--text-primary);">&times;</button><div class="modal-body" style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;padding:3rem;max-height:90vh;overflow-y:auto;"><div class="modal-image-section" style="position:relative;"><div class="modal-image" style="width:100%;height:450px;border-radius:20px;overflow:hidden;background:var(--bg-secondary);box-shadow:0 10px 40px var(--shadow-color);"><img src="" alt="" id="modalImage" style="width:100%;height:100%;object-fit:cover;"></div><div class="modal-badge" id="modalBadge" style="position:absolute;top:1.5rem;right:1.5rem;padding:0.7rem 1.5rem;background:var(--gradient-accent);border-radius:50px;font-size:0.85rem;font-weight:700;color:white;">FRESH</div></div><div class="modal-info-section" style="display:flex;flex-direction:column;justify-content:center;"><div class="modal-category" id="modalCategory" style="font-size:0.9rem;color:var(--primary-light);font-weight:700;text-transform:uppercase;margin-bottom:0.5rem;">Category</div><h2 class="modal-title" id="modalTitle" style="font-size:2.5rem;font-weight:900;margin-bottom:1.5rem;color:var(--text-primary);">Product Name</h2><p class="modal-description" id="modalDescription" style="font-size:1.1rem;line-height:1.8;color:var(--text-secondary);margin-bottom:2rem;">Description</p><div class="modal-features" id="modalFeatures" style="display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;"></div><div class="modal-actions" style="display:flex;gap:1rem;"><button class="modal-btn modal-btn-primary" id="modalContactBtn" style="flex:1;padding:1rem 2rem;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;background:var(--gradient);color:white;">Contact for Pricing</button><button class="modal-btn modal-btn-secondary" id="modalCloseBtn" style="flex:1;padding:1rem 2rem;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;background:var(--bg-secondary);color:var(--text-primary);border:2px solid var(--border-color);">Close</button></div></div></div></div></div>`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('productModal');
let currentProductName = '';

function openProductModal(productName, imageSrc) {
    const product = productData[productName];
    currentProductName = productName;
    if (product) {
        document.getElementById('modalImage').src = imageSrc;
        document.getElementById('modalBadge').textContent = product.badge;
        document.getElementById('modalCategory').textContent = product.category;
        document.getElementById('modalTitle').textContent = productName;
        document.getElementById('modalDescription').textContent = product.description;
        const featuresDiv = document.getElementById('modalFeatures');
        featuresDiv.innerHTML = '';
        product.features.forEach(f => {
            featuresDiv.innerHTML += `<div style="display:flex;align-items:center;gap:1rem;padding:0.8rem;background:var(--bg-secondary);border-radius:12px;border:1px solid var(--border-color);"><div style="font-size:1.5rem;">${f.icon}</div><div style="font-size:0.95rem;font-weight:600;color:var(--text-primary);">${f.text}</div></div>`;
        });
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.product-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.product-card');
        const name = card.querySelector('.product-title').textContent;
        const img = card.querySelector('.product-image img').src;
        openProductModal(name, img);
    });
});

document.getElementById('modalContactBtn').addEventListener('click', () => {
    closeModal();
    const contactSection = document.getElementById('contact');
    const header = document.getElementById('header');
    window.scrollTo({ top: contactSection.offsetTop - header.offsetHeight, behavior: 'smooth' });
    setTimeout(() => {
        const msg = document.getElementById('message');
        if (msg) {
            msg.value = `Can you please give me the price for ${currentProductName}, Thank you.`;
            msg.focus();
        }
    }, 800);
});