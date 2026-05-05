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

// 2-COLUMN MASONRY - images stack vertically in 2 columns, no gaps
function createMasonryGallery(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    // Create 2 columns
    const col1 = document.createElement('div');
    col1.className = 'gallery-col';
    const col2 = document.createElement('div');
    col2.className = 'gallery-col';
    
    // Keep track of total height in each column
    let col1Height = 0;
    let col2Height = 0;
    
    // We need actual image heights to balance. Load each image first
    let loadedCount = 0;
    const tempItems = [];
    
    imageList.forEach((filename, index) => {
        const tempImg = new Image();
        tempImg.onload = function() {
            const aspectRatio = tempImg.height / tempImg.width;
            const scaledHeight = 280 * aspectRatio; // 280px width
            
            tempItems.push({ filename, height: scaledHeight, index });
            loadedCount++;
            
            if (loadedCount === imageList.length) {
                // Sort by original order, then place in shortest column
                tempItems.sort((a, b) => a.index - b.index);
                
                tempItems.forEach(item => {
                    const galleryItem = createGalleryItem(item.filename);
                    
                    if (col1Height <= col2Height) {
                        col1.appendChild(galleryItem);
                        col1Height += item.height + 20;
                    } else {
                        col2.appendChild(galleryItem);
                        col2Height += item.height + 20;
                    }
                });
                
                track.appendChild(col1);
                track.appendChild(col2);
                
                // Add scroll buttons
                const container = track.parentElement;
                const wrapper = container.closest('.gallery-wrapper');
                if (wrapper) addScrollButtons(wrapper, container);
            }
        };
        tempImg.src = `images/${encodeURIComponent(filename)}`;
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
    btnLeft.onclick = () => container.scrollBy({ left: -800, behavior: 'smooth' });
    
    const btnRight = document.createElement('div');
    btnRight.className = 'scroll-btn-right';
    btnRight.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnRight.onclick = () => container.scrollBy({ left: 800, behavior: 'smooth' });
    
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
createMasonryGallery('realEstateTrack', imagesByCategory.realEstate);
createMasonryGallery('weddingTrack', imagesByCategory.wedding);
createMasonryGallery('urbanTrack', imagesByCategory.urban);
setupHorizontalWheelScroll();