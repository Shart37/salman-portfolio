// IMAGE CATEGORIES
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
        const aspectRatio = img.width / img.height;
        imageCache.set(filename, { width: img.width, height: img.height, aspectRatio });
        callback({ width: img.width, height: img.height, aspectRatio });
    };
    img.onerror = function() {
        callback({ width: 800, height: 600, aspectRatio: 1.33 });
    };
    img.src = `images/${encodeURIComponent(filename)}`;
}

function createGalleryItem(filename, aspectRatio) {
    const encoded = encodeURIComponent(filename);
    const src = `images/${encoded}`;
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Add orientation class for CSS styling
    if (aspectRatio < 0.8) {
        item.classList.add('portrait');
    } else if (aspectRatio > 1.2) {
        item.classList.add('landscape');
    } else {
        item.classList.add('square');
    }
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = filename.replace(/\.(webp|jpg|jpeg|png)$/i, '').replace(/[-_]/g, ' ');
    img.loading = 'lazy';
    img.onclick = () => openLightbox(src);
    item.appendChild(img);
    return item;
}

// DYNAMIC MASONRY GALLERY - Auto adjusts columns based on screen width
function createMasonryGallery(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    // Get container width
    const container = track.parentElement;
    const containerWidth = container.clientWidth - 32; // Subtract padding
    
    // Calculate number of columns based on 280px min width
    const minColumnWidth = 260;
    let columnCount = Math.floor(containerWidth / minColumnWidth);
    
    // Limit columns based on screen size
    if (window.innerWidth <= 550) columnCount = 2;
    if (window.innerWidth <= 400) columnCount = 1;
    if (columnCount < 1) columnCount = 1;
    if (columnCount > 5) columnCount = 5; // Max 5 columns
    
    // Calculate actual column width
    const columnWidth = (containerWidth - (columnCount - 1) * 16) / columnCount;
    
    // Create columns
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.style.display = 'flex';
        column.style.flexDirection = 'column';
        column.style.gap = '16px';
        column.style.width = `${columnWidth}px`;
        column.style.flexShrink = '0';
        columns.push(column);
        track.appendChild(column);
    }
    
    // Load images and add to shortest column
    let loadedCount = 0;
    const imageElements = [];
    
    if (imageList.length === 0) return;
    
    imageList.forEach((filename, idx) => {
        const img = new Image();
        img.onload = function() {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.width = '100%';
            
            const imgElement = document.createElement('img');
            imgElement.src = `images/${encodeURIComponent(filename)}`;
            imgElement.alt = filename.replace(/\.(webp|jpg|jpeg|png)$/i, '').replace(/[-_]/g, ' ');
            imgElement.loading = 'lazy';
            imgElement.onclick = () => openLightbox(imgElement.src);
            
            // Calculate scaled height based on actual column width
            const scale = columnWidth / img.width;
            const scaledHeight = img.height * scale;
            
            item.appendChild(imgElement);
            imageElements.push({ item, height: scaledHeight });
            
            loadedCount++;
            if (loadedCount === imageList.length) {
                // Distribute to shortest column
                const columnHeights = new Array(columnCount).fill(0);
                imageElements.forEach(({ item, height }) => {
                    let shortestIndex = 0;
                    for (let i = 1; i < columnCount; i++) {
                        if (columnHeights[i] < columnHeights[shortestIndex]) {
                            shortestIndex = i;
                        }
                    }
                    columns[shortestIndex].appendChild(item);
                    columnHeights[shortestIndex] += height + 16; // Add gap
                });
                
                // Add scroll buttons
                const container = track.parentElement;
                const wrapper = container.closest('.gallery-wrapper');
                if (wrapper) addScrollButtons(wrapper, container);
            }
        };
        img.src = `images/${encodeURIComponent(filename)}`;
    });
}

function addScrollButtons(wrapper, container) {
    const existingLeft = wrapper.querySelector('.scroll-btn-left');
    const existingRight = wrapper.querySelector('.scroll-btn-right');
    if (existingLeft) existingLeft.remove();
    if (existingRight) existingRight.remove();
    
    const btnLeft = document.createElement('div');
    btnLeft.className = 'scroll-btn-left';
    btnLeft.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnLeft.onclick = () => container.scrollBy({ left: -400, behavior: 'smooth' });
    
    const btnRight = document.createElement('div');
    btnRight.className = 'scroll-btn-right';
    btnRight.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnRight.onclick = () => container.scrollBy({ left: 400, behavior: 'smooth' });
    
    wrapper.appendChild(btnLeft);
    wrapper.appendChild(btnRight);
}

// Rebuild gallery on window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        createMasonryGallery('realEstateTrack', imagesByCategory.realEstate);
        createMasonryGallery('weddingTrack', imagesByCategory.wedding);
        createMasonryGallery('urbanTrack', imagesByCategory.urban);
        setupHorizontalWheelScroll();
    }, 250);
});

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

// Randomize hero background
function randomizeHeroPosition() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    const randomVertical = Math.floor(Math.random() * (85 - 15 + 1) + 15);
    heroBg.style.objectPosition = `center ${randomVertical}%`;
}
window.addEventListener('load', randomizeHeroPosition);
document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hash && link.hash.startsWith('#')) {
        setTimeout(randomizeHeroPosition, 500);
    }
});
window.addEventListener('hashchange', function() {
    setTimeout(randomizeHeroPosition, 500);
});

// CREATE GALLERIES
createMasonryGallery('realEstateTrack', imagesByCategory.realEstate);
createMasonryGallery('weddingTrack', imagesByCategory.wedding);
createMasonryGallery('urbanTrack', imagesByCategory.urban);
setupHorizontalWheelScroll();
