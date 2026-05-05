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

function createEmptyPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'gallery-item';
    placeholder.style.visibility = 'hidden';
    placeholder.style.opacity = '0';
    placeholder.style.pointerEvents = 'none';
    placeholder.style.background = 'transparent';
    return placeholder;
}

function createHorizontalGallery(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    const row1 = [];
    const row2 = [];
    
    imageList.forEach((filename, index) => {
        if (index % 2 === 0) row1.push(filename);
        else row2.push(filename);
    });
    
    const maxLength = Math.max(row1.length, row2.length);
    while (row1.length < maxLength) row1.push(null);
    while (row2.length < maxLength) row2.push(null);
    
    for (let i = 0; i < maxLength; i++) {
        if (row1[i]) track.appendChild(createGalleryItem(row1[i]));
        else track.appendChild(createEmptyPlaceholder());
        
        if (row2[i]) track.appendChild(createGalleryItem(row2[i]));
        else track.appendChild(createEmptyPlaceholder());
    }
    
    addScrollButtons(track.parentElement);
}

function addScrollButtons(container) {
    const existingLeft = container.querySelector('.scroll-btn-left');
    const existingRight = container.querySelector('.scroll-btn-right');
    if (existingLeft) existingLeft.remove();
    if (existingRight) existingRight.remove();
    
    const btnLeft = document.createElement('div');
    btnLeft.className = 'scroll-btn-left';
    btnLeft.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnLeft.onclick = () => container.scrollBy({ left: -350, behavior: 'smooth' });
    
    const btnRight = document.createElement('div');
    btnRight.className = 'scroll-btn-right';
    btnRight.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnRight.onclick = () => container.scrollBy({ left: 350, behavior: 'smooth' });
    
    container.appendChild(btnLeft);
    container.appendChild(btnRight);
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

const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
});

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

const logo = document.getElementById('logo');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) logo.classList.add('camera-mode');
    else logo.classList.remove('camera-mode');
});

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('active'));
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
});

createHorizontalGallery('realEstateTrack', imagesByCategory.realEstate);
createHorizontalGallery('weddingTrack', imagesByCategory.wedding);
createHorizontalGallery('urbanTrack', imagesByCategory.urban);