document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Blur on Scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Toggle body scroll
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        });
        
        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            });
        });
    }

    // --- Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- GSAP-like Scroll Reveal (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Number Counter triggered on reveal
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / 50; // speed
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Hero Text Reveal Stagger ---
    // Simple custom animation via CSS is already handling this, just adding visible class
    setTimeout(() => {
        const lines = document.querySelectorAll('.hero-content .line .word');
        lines.forEach((word, idx) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(100%)';
            word.animate([
                { opacity: 0, transform: 'translateY(100%)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                delay: 200 + (idx * 150),
                fill: 'forwards'
            });
        });
    }, 100);

    // --- Parallax Effects ---
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        let scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            let speed = el.getAttribute('data-speed');
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // --- FAQ Accordion ---
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Close others
            accordions.forEach(otherAcc => {
                if(otherAcc !== acc && otherAcc.classList.contains('active')){
                    otherAcc.classList.remove('active');
                }
            });
            // Toggle current
            acc.classList.toggle('active');
        });
    });

    // --- Form Submission Handling ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('.btn-submit');
            const originalText = btn.querySelector('span').innerText;
            
            btn.querySelector('span').innerText = 'Processing...';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.8';
            
            // Simulate API call
            setTimeout(() => {
                btn.querySelector('span').innerText = 'Request Dispatched!';
                btn.style.background = '#10b981'; // Success green
                bookingForm.reset();
                
                setTimeout(() => {
                    btn.querySelector('span').innerText = originalText;
                    btn.style.background = '';
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- Interactive Locations Map / List ---
    const cityItems = document.querySelectorAll('.city-item');
    const pulsePoint = document.querySelector('.pulse-point');
    // Predefined absolute map coordinates for visual flair
    const cityCoords = [
        { top: '30%', left: '80%' }, // NY
        { top: '60%', left: '20%' }, // LA
        { top: '40%', left: '60%' }, // CHI
        { top: '80%', left: '75%' }  // MIA
    ];
    
    cityItems.forEach((item, idx) => {
        item.addEventListener('mouseenter', () => {
            // Remove active from all
            cityItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Move pulse point
            if(pulsePoint && cityCoords[idx]) {
                pulsePoint.style.top = cityCoords[idx].top;
                pulsePoint.style.left = cityCoords[idx].left;
            }
        });
    });
});
