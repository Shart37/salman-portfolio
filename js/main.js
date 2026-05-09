// IMAGE CATEGORIES
const imagesByCategory = {
    realEstate: ["img10.jpg", "img1.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img8.jpg", "img11.jpg"],
    wedding: ["img9.jpg"],
    urban: [
        "londong roof aj.jpg", "sunrise manchester crane.jpg",
        "UOM.jpg", "crane sunrise.jpg", "climbing the light tower.jpg", "joe on slanted roof.jpg",
        "you know where this is manchester.jpg", "missed my bus manchester.jpg",
        "bikes at sunset enhanced.jpg", "snow tram.jpg", "view of shoes on roof.jpg", "snow tram 2.jpg", "roof near piccadily.jpg",
        "stewart crane sunrise.jpg", "car driveshaft skoda fabia mk 2 1.4 tdi.jpg",
        "img2.jpg", "img6.jpg", "img7.jpg"
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
    img.src = `images/${encodeURIComponent(filename)}`;
}

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

// 2-ROW BALANCED MASONRY - MANY COLUMNS, NO GAPS
function createBalancedMasonry(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    if (imageList.length === 0) return;
    
    let loadedCount = 0;
    const imageData = [];
    
    imageList.forEach((filename, idx) => {
        getImageDimensions(filename, (dims) => {
            // Calculate height at fixed width of 260px
            const scaledHeight = 300 * dims.aspectRatio;
            imageData.push({ filename, height: scaledHeight, index: idx });
            loadedCount++;
            
            if (loadedCount === imageList.length) {
                // Sort back to original order
                imageData.sort((a, b) => a.index - b.index);
                
                // Create columns (each column is a pair of images stacked vertically)
                const columns = [];
                let i = 0;
                
                while (i < imageData.length) {
                    const current = imageData[i];
                    const next = imageData[i + 1];
                    
                    // Create column wrapper
                    const column = document.createElement('div');
                    column.className = 'gallery-column';
                    
                    if (next && current.height + next.height < 700) {
                        // Pair two images in same column
                        column.appendChild(createGalleryItem(current.filename));
                        column.appendChild(createGalleryItem(next.filename));
                        i += 2;
                    } else {
                        // Single image in column
                        column.appendChild(createGalleryItem(current.filename));
                        i++;
                    }
                    
                    columns.push(column);
                    track.appendChild(column);
                }
                
                // Add scroll buttons
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
            
            // Let page scroll vertically when at boundaries
            if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) {
                return;
            }
            
            // Otherwise scroll horizontally
            e.preventDefault();
            container.scrollLeft += e.deltaY * 1.5;
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

// Create galleries
createBalancedMasonry('realEstateTrack', imagesByCategory.realEstate);
createBalancedMasonry('weddingTrack', imagesByCategory.wedding);
createBalancedMasonry('urbanTrack', imagesByCategory.urban);
setupHorizontalWheelScroll();
enableSmartScroll();

// Randomize hero background position on page load
function randomizeHeroPosition() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    
    const randomVertical = Math.floor(Math.random() * (80 - 20 + 1) + 20);
    const randomHorizontal = Math.floor(Math.random() * 100);
    heroBg.style.objectPosition = `${randomHorizontal}% ${randomVertical}%`;
}

window.addEventListener('load', randomizeHeroPosition);
