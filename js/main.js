// IMAGE CATEGORIES - UPDATE THESE WITH YOUR ACTUAL WEBP FILENAMES
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
    img.onclick = () => openLightbox(src);
    item.appendChild(img);
    return item;
}

// YOUR WORKING GALLERY SETUP - 2-ROW BALANCED MASONRY
function createBalancedMasonry(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    if (imageList.length === 0) return;
    
    let loadedCount = 0;
    const imageData = [];
    
    imageList.forEach((filename, idx) => {
        getImageDimensions(filename, (dims) => {
            const scaledHeight = 260 * dims.aspectRatio;
            imageData.push({ filename, height: scaledHeight, index: idx });
            loadedCount++;
            
            if (loadedCount === imageList.length) {
                imageData.sort((a, b) => a.index - b.index);
                
                const columns = [];
                let i = 0;
                
                while (i < imageData.length) {
                    const current = imageData[i];
                    const next = imageData[i + 1];
                    
                    const column = document.createElement('div');
                    column.className = 'gallery-column';
                    
                    if (next && current.height + next.height < 700) {
                        column.appendChild(createGalleryItem(current.filename));
                        column.appendChild(createGalleryItem(next.filename));
                        i += 2;
                    } else {
                        column.appendChild(createGalleryItem(current.filename));
                        i++;
                    }
                    
                    columns.push(column);
                    track.appendChild(column);
                }
                
                const container = track.parentElement;
                const wrapper = container.closest('.gallery-wrapper');
                if (wrapper) addScrollButtons(wrapper, container);
            }
        });
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
    btnLeft.onclick = () => {
        // Scroll by 80% of container width
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };
    
    const btnRight = document.createElement('div');
    btnRight.className = 'scroll-btn-right';
    btnRight.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnRight.onclick = () => {
        // Scroll by 80% of container width
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };
    
    wrapper.appendChild(btnLeft);
    wrapper.appendChild(btnRight);
}

function setupHorizontalWheelScroll() {
    const containers = document.querySelectorAll('.gallery-container');
    
    containers.forEach(container => {
        let pendingScroll = 0;
        let animating = false;
        
        function processScroll() {
            if (pendingScroll !== 0) {
                container.scrollLeft += pendingScroll;
                pendingScroll = 0;
            }
            animating = false;
        }
        
        function scheduleScroll(amount) {
            pendingScroll += amount;
            
            // Clamp pending scroll
            const maxScroll = container.scrollWidth - container.clientWidth;
            const newScroll = container.scrollLeft + pendingScroll;
            
            if (newScroll < 0) {
                pendingScroll = -container.scrollLeft;
            } else if (newScroll > maxScroll) {
                pendingScroll = maxScroll - container.scrollLeft;
            }
            
            if (!animating) {
                animating = true;
                requestAnimationFrame(processScroll);
            }
        }
        
        container.addEventListener('wheel', function(e) {
            const atStart = container.scrollLeft <= 2;
            const atEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 2;
            
            if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) {
                return;
            }
            
            e.preventDefault();
            
            // Accumulate scroll amount (multiplier 4.5)
            scheduleScroll(e.deltaY * 4.5);
            
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

// Mobile Toggle - Replace Logo with Horizontal Nav Links in Navbar
const menuToggle = document.getElementById('menuToggle');
const navContainer = document.querySelector('.nav-container');

if (menuToggle && navContainer) {
    menuToggle.addEventListener('click', function() {
        navContainer.classList.toggle('show-nav');
        
        // Change hamburger to X when nav is shown
        const svg = menuToggle.querySelector('svg');
        if (navContainer.classList.contains('show-nav')) {
            svg.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18" stroke-width="1.5"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke-width="1.5"/>
            `;
        } else {
            svg.innerHTML = `
                <line x1="4" y1="6" x2="20" y2="6" stroke-width="1.5"/>
                <line x1="4" y1="18" x2="20" y2="18" stroke-width="1.5"/>
            `;
        }
    });
    
    // Close when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('show-nav');
            const svg = menuToggle.querySelector('svg');
            svg.innerHTML = `
                <line x1="4" y1="6" x2="20" y2="6" stroke-width="1.5"/>
                <line x1="4" y1="18" x2="20" y2="18" stroke-width="1.5"/>
            `;
        });
    });
}

// Randomize hero background position
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

// Create galleries
createBalancedMasonry('realEstateTrack', imagesByCategory.realEstate);
createBalancedMasonry('weddingTrack', imagesByCategory.wedding);
createBalancedMasonry('urbanTrack', imagesByCategory.urban);
setupHorizontalWheelScroll();