/* ==========================================================================
   INTERACTIVE LOGIC: HOY PLUS / BAZEN ETHIOPIAN FRANKINCENSE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Dropdown Toggle on Tap
    const dropdownParents = document.querySelectorAll('.nav-links li.has-dropdown');
    dropdownParents.forEach(parent => {
        const link = parent.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If they clicked on a nested link within the dropdown, let that handle itself
                if (e.target.parentElement.classList.contains('has-dropdown-submenu') || e.target.closest('.dropdown-submenu')) {
                    return;
                }
                e.preventDefault(); // Prevent standard page load to show dropdown list
                parent.classList.toggle('active-dropdown');
                
                // If it is toggled, toggle dropdown display block
                const dropdown = parent.querySelector('.dropdown');
                if (dropdown) {
                    const isDisplayed = dropdown.style.display === 'block';
                    dropdown.style.display = isDisplayed ? 'none' : 'block';
                }
            }
        });
    });

    // Mobile Navigation Sub-dropdown Toggle on Tap
    const subDropdownParents = document.querySelectorAll('.dropdown li.has-dropdown-submenu');
    subDropdownParents.forEach(parent => {
        const link = parent.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                parent.classList.toggle('active-submenu');
                
                const subDropdown = parent.querySelector('.dropdown-submenu');
                if (subDropdown) {
                    const isDisplayed = subDropdown.style.display === 'block';
                    subDropdown.style.display = isDisplayed ? 'none' : 'block';
                }
            }
        });
    });

    // 1. Mobile Menu Drawer Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav Drawer
            nav.classList.toggle('nav-active');
            
            // Animate Burger Lines
            burger.classList.toggle('toggle');
            
            // Fade In Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // 2. FAQ Accordion Expanding/Collapsing
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            // Check if item is already active
            const isActive = item.classList.contains('active');
            
            // Close other items
            const activeItems = document.querySelectorAll('.accordion-item.active');
            activeItems.forEach(activeItem => {
                activeItem.classList.remove('active');
                activeItem.querySelector('.accordion-content').style.maxHeight = '0px';
            });
            
            // If the clicked item was not active, open it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 3. Tab Switches for Forms (Enquiry, Sample, Quote)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            // Remove active from all buttons & panels
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // 4. Form Submission & Toast Messages
    const forms = document.querySelectorAll('form');
    
    // Create Toast Alert Element dynamically if not exists
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    function showToast(message) {
        toast.innerHTML = `
            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>
            <span>${message}</span>
        `;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple Validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#cf2e2e';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Extract Form Identification
            const formId = form.id;
            let successMessage = 'Thank you! Your submission has been received.';
            
            if (formId === 'quote-form') {
                const grade = form.querySelector('#quote-grade')?.value || 'Frankincense';
                const quantity = form.querySelector('#quote-quantity')?.value || 'requested';
                successMessage = `Quote request submitted for ${quantity} MT of ${grade}. We'll respond within 24 hours!`;
            } else if (formId === 'sample-form') {
                const company = form.querySelector('#sample-company')?.value || 'Your company';
                successMessage = `Sample request registered for ${company}. Sourcing documentation will follow by email.`;
            } else if (formId === 'contact-form' || formId === 'enquiry-form') {
                const name = form.querySelector('input[type="text"]')?.value || 'visitor';
                successMessage = `Thank you, ${name}! Our representative will contact you shortly.`;
            }
            
            // Submit via AJAX if form has netlify attribute
            if (form.getAttribute('data-netlify') === 'true') {
                const formData = new FormData(form);
                fetch('/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                })
                .then(response => {
                    if (response.ok) {
                        showToast(successMessage);
                        form.reset();
                    } else {
                        throw new Error('Server returned status code ' + response.status);
                    }
                })
                .catch(error => {
                    alert('Submission failed: ' + error.message);
                });
            } else {
                showToast(successMessage);
                form.reset();
            }
        });
    });

    // 5. Hero Background Slider
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        
        function showSlide(index) {
            // Remove active classes
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            // Set current active
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }
        
        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }
        
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000); // Change image every 5 seconds
        }
        
        function resetSlideShow() {
            clearInterval(slideInterval);
            startSlideShow();
        }
        
        // Dot Navigation Clicking
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetSlideShow();
            });
        });
        
        // Initial Start
        startSlideShow();
    }

    // 6. Close Mobile Menu Drawer when an anchor link is clicked
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && nav.classList.contains('nav-active')) {
                // Check if this is a dropdown parent link or sub-dropdown parent link
                if (link.parentElement.classList.contains('has-dropdown') || link.parentElement.classList.contains('has-dropdown-submenu')) {
                    // Only prevent closing if they clicked a parent trigger itself and it has child items
                    return;
                }
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(l => {
                    l.style.animation = '';
                });
            }
        });
    });

    // 7. About Page Sub-navigation Active Link Highlighting on Scroll
    const subNavLinks = document.querySelectorAll('.sub-nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (subNavLinks.length > 0 && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.sub-nav-link[href="#${id}"]`);
                    
                    if (activeLink) {
                        subNavLinks.forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            if (document.querySelector(`.sub-nav-link[href="#${section.id}"]`)) {
                observer.observe(section);
            }
        });

        subNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                subNavLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // Two-color headings for section titles (all h2 tags except page header titles)
    const headings = document.querySelectorAll('h2');
    headings.forEach(heading => {
        const text = heading.textContent.trim();
        if (!text) return;
        
        const words = text.split(/\s+/);
        const numWords = words.length;
        
        if (numWords > 1) {
            // Split index: first word if <= 3 words, otherwise split in half
            const splitIndex = numWords <= 3 ? 1 : Math.floor(numWords / 2);
            const part1 = words.slice(0, splitIndex).join(' ');
            const part2 = words.slice(splitIndex).join(' ');
            
            heading.innerHTML = `<span class="heading-part-1">${part1}</span> <span class="heading-part-2">${part2}</span>`;
        }
    });

    // 8. Product Showcase Slider
    const track = document.querySelector('.slider-track');
    const cards = document.querySelectorAll('.slider-track .grade-card');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');

    if (track && cards.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }
        
        function updateSlider() {
            const cardsPerView = getCardsPerView();
            const maxIndex = cards.length - cardsPerView;
            
            // Constrain index
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            
            // Get dimensions
            const cardWidth = cards[0].getBoundingClientRect().width;
            const trackStyle = window.getComputedStyle(track);
            const gap = parseFloat(trackStyle.gap) || 0;
            
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
            
            // Disable buttons if at boundaries
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
        }
        
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateSlider();
        });
        
        window.addEventListener('resize', () => {
            // Recalculate slider positioning on resize
            updateSlider();
        });
        
        // Initial setup
        updateSlider();
    }
});

// Keyframe Animations injected into script
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
`;
document.head.appendChild(styleSheet);
