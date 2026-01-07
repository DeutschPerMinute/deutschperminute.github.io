// Fetch and render data from data.json
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        const data = await response.json();
        
        // Populate all sections
        populateHero(data.hero);
        populateTutor(data.tutor);
        populateCourses(data.courses);
        populateTestimonials(data.testimonials);
        populateContact(data.contact, data.social);
        populateSocial(data.social);
        populateFooter(data.footer);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage();
    }
});
// Hero Section
function populateHero(hero) {
    document.getElementById('hero-headline').textContent = hero.headline;
    document.getElementById('hero-subheadline').textContent = hero.subheadline;
    
    const ctaButton = document.getElementById('hero-cta');
    ctaButton.textContent = hero.ctaText;
    ctaButton.href = hero.ctaLink;
}

// Tutor Section
function populateTutor(tutor) {
    document.getElementById('tutor-bio').textContent = tutor.bio;
    
    // Handle photo carousel
    const carouselTrack = document.getElementById('carousel-track');
    const carouselIndicators = document.getElementById('carousel-indicators');
    
    // Check if photo is an array or single value
    const photos = Array.isArray(tutor.photo) ? tutor.photo : [tutor.photo];
    
    // Populate carousel with photos
    carouselTrack.innerHTML = photos.map((photoUrl, index) => `
        <div class="w-full flex-shrink-0">
            <img src="${photoUrl}" 
                 alt="${tutor.name} - German Language Tutor - Photo ${index + 1}" 
                 class="w-full h-auto object-cover"
                 onerror="this.src='https://via.placeholder.com/400x500?text=Your+Photo'">
        </div>
    `).join('');
    
    // Populate indicators
    carouselIndicators.innerHTML = photos.map((_, index) => `
        <button class="carousel-indicator w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-white w-6' : 'bg-white/50'}" 
                data-index="${index}" 
                aria-label="Go to photo ${index + 1}"></button>
    `).join('');
    
    // Initialize carousel auto-scroll
    if (photos.length > 1) {
        initCarousel(photos.length);
    }
    
    const certificationsList = document.getElementById('tutor-certifications');
    certificationsList.innerHTML = tutor.certifications.map(cert => `
        <li class="flex items-start">
            <svg class="w-6 h-6 text-accent-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700">${cert}</span>
        </li>
    `).join('');
}

// Carousel functionality
let carouselInterval;
let currentSlide = 0;

function initCarousel(totalSlides) {
    const track = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Auto-scroll every 4 seconds
    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel(totalSlides);
    }, 2500);
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel(totalSlides);
            // Reset auto-scroll timer
            clearInterval(carouselInterval);
            carouselInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel(totalSlides);
            }, 4000);
        });
    });
    
    // Pause on hover
    const carousel = document.getElementById('tutor-photo-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel(totalSlides);
        }, 4000);
    });
}

function updateCarousel(totalSlides) {
    const track = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Move carousel
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.remove('bg-white/50', 'w-2');
            indicator.classList.add('bg-white', 'w-6');
        } else {
            indicator.classList.remove('bg-white', 'w-6');
            indicator.classList.add('bg-white/50', 'w-2');
        }
    });
}

// Courses Section (Main Highlight)
function populateCourses(courses) {
    const container = document.getElementById('courses-container');
    
    container.innerHTML = courses.map(course => `
        <article class="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-primary transform hover:-translate-y-2">
            ${course.badge ? `
                <div class="absolute top-4 right-4 z-10">
                    <span class="inline-block bg-accent-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        ${course.badge}
                    </span>
                </div>
            ` : ''}
            
            <div class="p-6 sm:p-8">
                <!-- Level Header -->
                <div class="mb-4">
                    <h3 class="text-2xl font-bold text-gray-900 mb-1">${course.level}</h3>
                    <p class="text-sm text-primary font-semibold">${course.tagline}</p>
                </div>
                
                <!-- Pricing -->
                <div class="mb-6">
                    <div class="flex items-baseline">
                        <span class="text-4xl font-bold text-gray-900">${course.price}</span>
                        <span class="ml-2 text-gray-600">/ ${course.duration}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">${course.sessionsPerWeek}x per week • ${course.sessionLength}</p>
                </div>
                
                <!-- Description -->
                <p class="text-gray-700 mb-6 leading-relaxed">
                    ${course.description}
                </p>
                
                <!-- Features List -->
                <div class="mb-6">
                    <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">What's Included:</h4>
                    <ul class="space-y-2">
                        ${course.features.map(feature => `
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                                <span class="text-sm text-gray-700">${feature}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- CTA Button -->
                <a href="#contact" class="block w-full text-center bg-primary hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">
                    Book Now
                </a>
            </div>
            
            <!-- Bottom accent border (German flag colors) -->
            <div class="h-2 bg-gradient-to-r from-accent-black via-accent-red to-accent-gold"></div>
        </article>
    `).join('');
}

// Testimonials Section
function populateTestimonials(testimonials) {
    const container = document.getElementById('testimonials-container');
    
    container.innerHTML = testimonials.map(testimonial => `
        <article class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
            <!-- Star Rating -->
            <div class="flex mb-4">
                ${Array(testimonial.rating).fill().map(() => `
                    <svg class="w-5 h-5 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                `).join('')}
            </div>
            
            <!-- Testimonial Text -->
            <p class="text-gray-700 mb-4 italic leading-relaxed">
                "${testimonial.text}"
            </p>
            
            <!-- Author Info -->
            <div class="border-t border-gray-200 pt-4">
                <p class="font-semibold text-gray-900">${testimonial.name}</p>
                <p class="text-sm text-gray-600">${testimonial.course}</p>
                <p class="text-xs text-gray-500 mt-1">${testimonial.location} • ${testimonial.date}</p>
            </div>
        </article>
    `).join('');
}

// Contact Section
function populateContact(contact, social) {
    document.getElementById('contact-note').textContent = contact.availabilityNote;
    
    // Email card
    const emailCard = document.getElementById('contact-email-card');
    emailCard.href = `mailto:${contact.email}`;
    emailCard.querySelector('p').textContent = contact.email;
    
    // WhatsApp card
    const whatsappCard = document.getElementById('contact-whatsapp-card');
    if (social && social.whatsapp) {
        whatsappCard.href = social.whatsapp;
    }
    
    // Instagram card
    const instagramCard = document.getElementById('contact-instagram-card');
    if (social && social.instagram) {
        instagramCard.href = social.instagram;
    }
    
    // YouTube card
    const youtubeCard = document.getElementById('contact-youtube-card');
    if (social && social.youtube) {
        youtubeCard.href = social.youtube;
    }
}

// Social Links
function populateSocial(social) {
    const container = document.getElementById('social-links');
    
    const socialIcons = {
        instagram: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
        linkedin: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        youtube: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        whatsapp: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`
    };
    
    container.innerHTML = Object.entries(social).map(([platform, url]) => `
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition" aria-label="${platform}">
            ${socialIcons[platform] || ''}
        </a>
    `).join('');
}

// Footer
function populateFooter(footer) {
    const currentYear = new Date().getFullYear();
    document.getElementById('footer-copyright').textContent = `© ${currentYear} ${footer.copyrightText}`;
    
    const linksContainer = document.getElementById('footer-links');
    linksContainer.innerHTML = footer.additionalLinks.map(link => `
        <a href="${link.url}" class="text-gray-400 hover:text-white transition text-sm">${link.text}</a>
    `).join('');
}

// Error handling
function showErrorMessage() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p class="text-lg text-gray-600">Unable to load course data. Please refresh the page or contact support.</p>
        </div>
    `;
}

// Navbar functionality
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-item');
    let lastScroll = 0;
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Scroll behavior - hide on scroll down, show on scroll up
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;
        
        // Change navbar color based on scroll position
        const navLogo = document.querySelector('.nav-logo');
        const navLinks = document.querySelectorAll('.nav-link');
        const menuBtn = document.querySelector('.nav-menu-btn');
        
        if (currentScroll > heroHeight - 100) {
            // Past hero section - change to black
            navLogo?.classList.remove('text-white');
            navLogo?.classList.add('text-gray-900');
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                link.classList.add('text-gray-900');
            });
            menuBtn?.classList.remove('text-white');
            menuBtn?.classList.add('text-gray-900');
        } else {
            // In hero section - keep white
            navLogo?.classList.remove('text-gray-900');
            navLogo?.classList.add('text-white');
            navLinks.forEach(link => {
                link.classList.remove('text-gray-900');
                link.classList.add('text-white');
            });
            menuBtn?.classList.remove('text-gray-900');
            menuBtn?.classList.add('text-white');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('nav-hidden');
            }
            lastScroll = currentScroll;
        }, 100);
        
        // Update active nav item based on scroll position
        updateActiveNavItem();
    });
    
    // Update active navigation item
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
