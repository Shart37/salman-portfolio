// IMAGE CATEGORIES - UPDATED WITH WEBP FILENAMES
const imagesByCategory = {
    realEstate: [
        "manchester-alexander-house-dining-area.webp",
        "manchester-regent-plaza-master-bedroom.webp",
        "liverpool-apartment-living-room-with-view-into-kitchen.webp",
        "salford-southwood-house-living-room-zoomed.webp",
        "manchester-x1-the-landmark-living-room.webp",
        "manchester-x1-the-landmark-kitchen-with-view.webp",
        "liverpool-apartment-living-room.webp"
    ],
    wedding: [
        "liverpool-arab-wedding-tea-pour.webp"
    ],
    urban: [
        "manchester-view-from-a-rooftop.webp",
        "londong-roof-aj.webp",
        "sunrise-manchester-crane.webp",
        "manchester-from-uom-sackvile-building.webp",
        "crane-sunrise.webp",
        "climbing-the-light-tower.webp",
        "joe-on-slanted-roof.webp",
        "you-know-where-this-is-manchester.webp",
        "missed-my-bus-manchester.webp",
        "bikes-at-sunset-enhanced.webp",
        "snow-tram.webp",
        "snow-tram-2.webp",
        "roof-near-piccadily.webp",
        "stewart-crane-sunrise.webp",
        "car-driveshaft-skoda-fabia-mk-2-1-4-tdi.webp",
        "sunrise-manchester-shot-from-crane.webp",
        "elizabeth-tower-manchester-in-construction-long-exposure-light-trails.webp"
    ]
};

// Store image dimensions
const imageCache = new Map();

function getImageDimensions(filename, callback) {
    if (imageCache.has(filename)) {
        callback(imageCache.get(filename));
        return;
    }
    const img = new Image();
    img.onload = function() {
        const dims = {
            width: img.width,
            height: img.height,
            aspectRatio: img.height / img.width
        };
        imageCache.set(filename, dims);
        callback(dims);
    };
    img.onerror = function() {
        // Fallback for missing images
        callback({ width: 800, height: 600, aspectRatio: 0.75 });
    };
    img.src = `images/${encodeURIComponent(filename)}`;
}

function createGalleryItem(filename) {
    const encoded = encodeURIComponent(filename);
    const src = `images/${encoded}`;
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = src;
    img.alt = filename.replace(/\.(webp|jpg|jpeg|png)$/i, '').replace(/[-_]/g, ' ');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onclick = () => openLightbox(src);
    
    // Force image to be visible immediately
    img.style.opacity = '1';
    
    // Remove the loaded class mechanism entirely
    item.appendChild(img);
    return item;
}

// SIMPLE 2-ROW GALLERY - Images alternate between top and bottom row
function create2RowGallery(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    // Create top and bottom rows
    const topRow = document.createElement('div');
    topRow.className = 'gallery-row';
    const bottomRow = document.createElement('div');
    bottomRow.className = 'gallery-row';
    
    // Alternate images between top and bottom rows
    imageList.forEach((filename, index) => {
        const item = createGalleryItem(filename);
        if (index % 2 === 0) {
            topRow.appendChild(item);
        } else {
            bottomRow.appendChild(item);
        }
    });
    
    track.appendChild(topRow);
    track.appendChild(bottomRow);
    
    // Add scroll buttons
    const container = track.parentElement;
    const wrapper = container.closest('.gallery-wrapper');
    if (wrapper) addScrollButtons(wrapper, container);
}

function addScrollButtons(wrapper, container) {
    const existingLeft = wrapper.querySelector('.scroll-btn-left');
    const existingRight = wrapper.querySelector('.scroll-btn-right');
    if (existingLeft) existingLeft.remove();
    if (existingRight) existingRight.remove();
    
    const btnLeft = document.createElement('div');
    btnLeft.className = 'scroll-btn-left';
    btnLeft.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnLeft.onclick = () => {
        container.scrollBy({ left: -800, behavior: 'smooth' });
    };
    
    const btnRight = document.createElement('div');
    btnRight.className = 'scroll-btn-right';
    btnRight.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnRight.onclick = () => {
        container.scrollBy({ left: 800, behavior: 'smooth' });
    };
    
    wrapper.appendChild(btnLeft);
    wrapper.appendChild(btnRight);
}

function setupHorizontalWheelScroll() {
    const containers = document.querySelectorAll('.gallery-container');
    
    containers.forEach(container => {
        container.addEventListener('wheel', function(e) {
            const tolerance = 5;
            const atStart = container.scrollLeft <= tolerance;
            const atEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - tolerance;
            
            if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) {
                return;
            }
            
            e.preventDefault();
            container.scrollLeft += e.deltaY * 4.5;
        }, { passive: false });
    });
}

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

// Contact Form
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
                alert("Message could not be sent.");
            }
        } catch (error) {
            alert("Network error.");
        }
    });
}

// Lightbox events
const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
});

// Smooth scroll navigation
document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach(anchor => {
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

// Logo camera icon on scroll
const logo = document.getElementById('logo');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) logo.classList.add('camera-mode');
    else logo.classList.remove('camera-mode');
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('active'));
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
});

// Randomize hero background position (no console log)
function randomizeHeroPosition() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    
    const randomVertical = Math.floor(Math.random() * (85 - 15 + 1) + 15);
    heroBg.style.objectPosition = `center ${randomVertical}%`;
}

// Run on page load
window.addEventListener('load', randomizeHeroPosition);

// Run after any anchor link click
document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hash && link.hash.startsWith('#')) {
        setTimeout(randomizeHeroPosition, 500);
    }
});

// Run when URL hash changes
window.addEventListener('hashchange', function() {
    setTimeout(randomizeHeroPosition, 500);
});

// gallery creation
create2RowGallery('realEstateTrack', imagesByCategory.realEstate);
create2RowGallery('weddingTrack', imagesByCategory.wedding);
create2RowGallery('urbanTrack', imagesByCategory.urban);
setupHorizontalWheelScroll();
