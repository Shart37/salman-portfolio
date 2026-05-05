// Create 2-ROW horizontal gallery with scroll buttons
function createHorizontalGallery(trackId, imageList) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = '';
    
    // Split images into 2 rows (column by column)
    const row1 = [];
    const row2 = [];
    
    imageList.forEach((filename, index) => {
        if (index % 2 === 0) {
            row1.push(filename);
        } else {
            row2.push(filename);
        }
    });
    
    // Make rows equal length by adding empty placeholders if needed
    const maxLength = Math.max(row1.length, row2.length);
    while (row1.length < maxLength) row1.push(null);
    while (row2.length < maxLength) row2.push(null);
    
    // Create 2-row layout (column by column)
    for (let i = 0; i < maxLength; i++) {
        // Row 1 image
        if (row1[i]) {
            const item1 = createGalleryItem(row1[i]);
            track.appendChild(item1);
        } else {
            track.appendChild(createEmptyPlaceholder());
        }
        
        // Row 2 image
        if (row2[i]) {
            const item2 = createGalleryItem(row2[i]);
            track.appendChild(item2);
        } else {
            track.appendChild(createEmptyPlaceholder());
        }
    }
    
    const container = track.parentElement;
    addScrollButtons(container);
}

// Helper: Create a gallery item
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

// Helper: Create empty placeholder to maintain grid spacing
function createEmptyPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'gallery-item';
    placeholder.style.visibility = 'hidden';
    placeholder.style.opacity = '0';
    placeholder.style.pointerEvents = 'none';
    placeholder.style.background = 'transparent';
    return placeholder;
}

function addScrollButtons(container) {
    // Remove existing buttons to avoid duplicates
    const existingLeft = container.querySelector('.scroll-btn-left');
    const existingRight = container.querySelector('.scroll-btn-right');
    if (existingLeft) existingLeft.remove();
    if (existingRight) existingRight.remove();
    
    const btnLeft = document.createElement('div');
    btnLeft.className = 'scroll-btn-left';
    btnLeft.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    btnLeft.onclick = () => {
        container.scrollBy({ left: -350, behavior: 'smooth' });
        // Slight haptic feedback on click
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