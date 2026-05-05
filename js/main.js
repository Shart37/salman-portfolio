// ===== IMAGE CATEGORIES =====
const imagesByCategory = {
    realEstate: ["img10.jpg", "img1.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img8.jpg", "img11.jpg"],
    wedding: ["img9.jpg"],
    urban: [
        "view of shoes on roof.jpg", "londong roof aj.jpg", "sunrise manchester crane.jpg",
        "UOM.jpg", "crane sunrise.jpg", "climbing the light tower.jpg", "joe on slanted roof.jpg",
        "you know where this is manchester.jpg", "missed my bus manchester.jpg",
        "bikes at sunset enhanced.jpg", "snow tram.jpg", "snow tram 2.jpg", "roof near piccadily.jpg",
        "stewart crane sunrise.jpg", "car driveshaft skoda fabia mk 2 1.4 tdi.jpg",
        "img2.jpg", "img6.jpg", "img7.jpg"
    ]
};

// Create a single gallery item
function createGalleryItem(filename) {
    const encoded = encodeURIComponent(filename);
    const src = `images/${encoded}`;
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = src;
    img.alt = filename.replace(/\.(jpg|jpeg|png)$/i, '').replace(/[-_]/g, ' ');
    img.loading = 'lazy';
    img.onclick = () => openLightbox(src);
    item.appendChild(img);
    return item;
}

// Create MASONRY horizontal gallery
function createMasonryGallery(trackId, imageList, columnCount = 3) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    // Adjust column count for mobile
    if (window.innerWidth <= 768) columnCount = 2;
    if (window.innerWidth <= 550) columnCount = 2;
    
    // Create columns
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'masonry-column';
        columns.push(column);
        track.appendChild(column);
    }
    
    // Distribute images to columns (shortest column gets next image)
    imageList.forEach(filename => {
        let shortestColumn = columns[0];
        let shortestHeight = columns[0].scrollHeight;
        
        for (let i = 1; i < columns.length; i++) {
            const height = columns[i].scrollHeight;
            if (height < shortestHeight) {
                shortestHeight = height;
                shortestColumn = columns[i];
            }
        }
        
        const item = createGalleryItem(filename);
        shortestColumn.appendChild(item);
    });
    
    // Add scroll buttons
    addScrollButtons(track.parentElement);
}

// Add scroll buttons to gallery container
function addScrollButtons(container) {
    const existingLeft = container.querySelector('.scroll-btn-left');
    const existingRight = container.querySelector('.scroll-btn-right');
    if (existingLeft) existingLeft.remove();
    if (existingRight) existingRight.remove();
    
    const btnLeft = document.createElement('div');
    btnLeft.className = 'scroll-btn-left';
    btnLeft.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnLeft.onclick = () => {
        container.scrollBy({ left: -350, behavior: 'smooth' });
        // Visual feedback
        btnLeft.style.transform = 'translateY(-50%) scale(0.95)';
        setTimeout(() => {
            btnLeft.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    };
    
    const btnRight = document.createElement('div');
    btnRight.className = 'scroll-btn-right';
    btnRight.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnRight.onclick = () => {
        container.scrollBy({ left: 350, behavior: 'smooth' });
        btnRight.style.transform = 'translateY(-50%) scale(0.95)';
        setTimeout(() => {
            btnRight.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    };
    
    container.appendChild(btnLeft);
    container.appendChild(btnRight);
}

// Lightbox System
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    lbImg.src = src;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.style.display = 'none';
    document.getElementById('lightboxImg').src = '';
    document.body.style.overflow = '';
}

// Enable horizontal scroll with mouse wheel (FIX #2)
function enableHorizontalWheelScroll() {
    const containers = document.querySelectorAll('.gallery-container');
    
    containers.forEach(container => {
        container.addEventListener('wheel', (e) => {
            // Scroll horizontally when wheel is used over the gallery
            if (container.contains(e.target)) {
                e.preventDefault();
                const scrollAmount = e.deltaY || e.deltaX;
                container.scrollLeft += scrollAmount;
            }
        }, { passive: false });
    });
}

// Contact Form Handler
const form = document.getElementById('contactForm');
const successDiv = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                form.style.display = 'none';
                successDiv.style.display = 'block';
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successDiv.style.display = 'none';
                }, 4000);
            } else {
                alert("Message could not be sent. Please email me directly.");
            }
        } catch (error) {
            alert("Network error. Please check your connection.");
        }
    });
}

// Lightbox Events
const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
    }
});

// Smooth scroll for desktop navigation
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Logo changes to camera icon when scrolling
const logo = document.getElementById('logo');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        logo.classList.add('camera-mode');
    } else {
        logo.classList.remove('camera-mode');
    }
});

// Mobile Menu Logic
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        mobileMenu.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
});

// Initialize galleries with masonry layout
function initGalleries() {
    const columnCount = window.innerWidth <= 768 ? 2 : 3;
    
    createMasonryGallery('realEstateTrack', imagesByCategory.realEstate, columnCount);
    createMasonryGallery('weddingTrack', imagesByCategory.wedding, columnCount);
    createMasonryGallery('urbanTrack', imagesByCategory.urban, columnCount);
}

// Run on load
initGalleries();

// Enable horizontal wheel scroll (FIX #2)
enableHorizontalWheelScroll();

// Re-initialize on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initGalleries();
        enableHorizontalWheelScroll(); // Re-attach wheel events
    }, 250);
});

// Prevent scroll sticking on touch devices (FIX #1)
const allGalleries = document.querySelectorAll('.gallery-container');
allGalleries.forEach(gallery => {
    gallery.addEventListener('touchend', () => {
        setTimeout(() => {
            gallery.style.scrollBehavior = 'auto';
            setTimeout(() => {
                gallery.style.scrollBehavior = 'smooth';
            }, 50);
        }, 10);
    });
});