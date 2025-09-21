class ImageGallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.closeBtn = document.getElementById('close');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.imageCounter = document.getElementById('imageCounter');
        this.gallery = document.getElementById('gallery');
        
        this.init();
    }

    init() {
        this.loadImages();
        this.bindEvents();
    }

    loadImages() {
        // Sample images - in a real project, these would be loaded from a server
        this.images = [
            { src: 'https://picsum.photos/800/600?random=1', alt: 'Beautiful landscape 1' },
            { src: 'https://picsum.photos/800/600?random=2', alt: 'Beautiful landscape 2' },
            { src: 'https://picsum.photos/800/600?random=3', alt: 'Beautiful landscape 3' },
            { src: 'https://picsum.photos/800/600?random=4', alt: 'Beautiful landscape 4' },
            { src: 'https://picsum.photos/800/600?random=5', alt: 'Beautiful landscape 5' },
            { src: 'https://picsum.photos/800/600?random=6', alt: 'Beautiful landscape 6' },
            { src: 'https://picsum.photos/800/600?random=7', alt: 'Beautiful landscape 7' },
            { src: 'https://picsum.photos/800/600?random=8', alt: 'Beautiful landscape 8' },
            { src: 'https://picsum.photos/800/600?random=9', alt: 'Beautiful landscape 9' },
            { src: 'https://picsum.photos/800/600?random=10', alt: 'Beautiful landscape 10' },
            { src: 'https://picsum.photos/800/600?random=11', alt: 'Beautiful landscape 11' },
            { src: 'https://picsum.photos/800/600?random=12', alt: 'Beautiful landscape 12' }
        ];

        this.renderGallery();
    }

    renderGallery() {
        this.gallery.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
            `;
            
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            this.gallery.appendChild(galleryItem);
        });
    }

    bindEvents() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        
        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('show')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.lightbox.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });

        this.handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousImage();
                } else {
                    this.nextImage();
                }
            }
        };
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeLightbox() {
        this.lightbox.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    updateLightboxImage() {
        const currentImage = this.images[this.currentIndex];
        this.lightboxImage.src = currentImage.src;
        this.lightboxImage.alt = currentImage.alt;
        this.updateImageCounter();
    }

    updateImageCounter() {
        this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
}

// Initialize the gallery when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageGallery();
});

// Add some utility functions for potential future enhancements
const GalleryUtils = {
    // Function to add new images dynamically
    addImage: (src, alt) => {
        // This could be used to add images dynamically
        console.log('Add image functionality can be implemented here');
    },
    
    // Function to preload images for better performance
    preloadImages: (imageUrls) => {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
};
