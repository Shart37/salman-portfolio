// IMAGE CATEGORIES
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

// Store image dimensions after loading
const imageDimensions = new Map();

function loadImageDimensions(filename, callback) {
    if (imageDimensions.has(filename)) {
        callback(imageDimensions.get(filename));
        return;
    }
    const img = new Image();
    img.onload = function() {
        const aspectRatio = img.height / img.width;
        const scaledHeight = 260 * aspectRatio;
        const dims = { width: 260, height: scaledHeight, aspectRatio };
        imageDimensions.set(filename, dims);
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

function createPairedGallery(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    if (imageList.length === 0) return;
    
    // Load all dimensions first
    let loadedCount = 0;
    const dimensions = [];
    
    imageList.forEach((filename, idx) => {
        loadImageDimensions(filename, (dims) => {
            dimensions.push({ filename, height: dims.height, index: idx });
            loadedCount++;
            
            if (loadedCount === imageList.length) {
                // Sort by original order
                dimensions.sort((a, b) => a.index - b.index);
                
                // Create paired slots: try to pair a tall image with a short image
                const slots = [];
                let i = 0;
                
                while (i < dimensions.length) {
                    const current = dimensions[i];
                    const next = dimensions[i + 1];
                    
                    // If there's a next image and pairing makes sense (tall + short)
                    if (next && current.height + next.height < 600) {
                        // Create a stacked pair
                        const slot = document.createElement('div');
                        slot.className = 'gallery-slot';
                        
                        const topItem = createGalleryItem(current.filename);
                        const bottomItem = createGalleryItem(next.filename);
                        
                        slot.appendChild(topItem);
                        slot.appendChild(bottomItem);
                        track.appendChild(slot);
                        i += 2;
                    } else {
                        // Single image slot
                        const slot = document.createElement('div');
                        slot.className = 'gallery-slot single';
                        const item = createGalleryItem(current.filename);
                        slot.appendChild(item);
                        track.appendChild(slot);
                        i++;
                    }
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
            e.preventDefault();
            container.scrollLeft += e.deltaY * 2;
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
createPairedGallery('realEstateTrack', imagesByCategory.realEstate);
createPairedGallery('weddingTrack', imagesByCategory.wedding);
createPairedGallery('urbanTrack', imagesByCategory.urban);
setupHorizontalWheelScroll();