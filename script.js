class ImageGallery {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentIndex = 0;
        this.currentCategory = 'all';
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.closeBtn = document.getElementById('close');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.imageCounter = document.getElementById('imageCounter');
        this.gallery = document.getElementById('gallery');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.init();
    }

    init() {
        this.loadImages();
        this.filteredImages = [...this.images];
        this.bindEvents();
        this.setupFilters();
    }

    loadImages() {
        // Curated images with matching categories
        this.images = [
            // Nature Images
            { 
                src: 'https://source.unsplash.com/1600x900/?waterfall', 
                alt: 'Majestic waterfall in a lush forest',
                category: 'nature' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?mountain',
                alt: 'Snow-capped mountain peaks at sunrise',
                category: 'nature' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?forest',
                alt: 'Dense forest with sunlight streaming through trees',
                category: 'nature' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?beach',
                alt: 'Tropical beach with crystal clear waters',
                category: 'nature' 
            },

            // Architecture Images
            { 
                src: 'https://source.unsplash.com/1600x900/?skyscraper',
                alt: 'Modern glass skyscraper reaching into the clouds',
                category: 'architecture' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?ancient-temple',
                alt: 'Ancient temple with intricate stone carvings',
                category: 'architecture' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?modern-building',
                alt: 'Contemporary architectural masterpiece',
                category: 'architecture' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?bridge',
                alt: 'Engineering marvel of a suspension bridge',
                category: 'architecture' 
            },

            // Animals Images
            { 
                src: 'https://source.unsplash.com/1600x900/?lion',
                alt: 'Majestic lion in the African savanna',
                category: 'animals' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?elephant',
                alt: 'Elephant family walking through the grasslands',
                category: 'animals' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?dolphin',
                alt: 'Playful dolphins jumping in the ocean',
                category: 'animals' 
            },
            { 
                src: 'https://source.unsplash.com/1600x900/?eagle',
                alt: 'Majestic eagle soaring through the sky',
                category: 'animals' 
            }
        ];

        this.renderGallery();
    }

    renderGallery() {
        this.gallery.innerHTML = '';
        
        this.filteredImages.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item loading';
            
            const img = new Image();
            img.src = image.src;
            img.alt = image.alt;
            img.loading = 'lazy';
            
            img.onload = () => {
                galleryItem.classList.remove('loading');
                galleryItem.appendChild(img);
            };

            img.onerror = () => {
                galleryItem.classList.remove('loading');
                galleryItem.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to load image</p>
                    </div>
                `;
            };
            
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            this.gallery.appendChild(galleryItem);
        });
    }

    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterImages(category);
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterImages(category) {
        this.currentCategory = category;
        if (category === 'all') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(image => image.category === category);
        }
        this.renderGallery();
    }

    shareImage(platform) {
        const currentImage = this.filteredImages[this.currentIndex];
        const text = `Check out this ${currentImage.alt}`;
        const url = window.location.href;

        switch(platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
                break;
            case 'pinterest':
                window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${currentImage.src}&description=${text}`);
                break;
        }
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
        const currentImage = this.filteredImages[this.currentIndex];
        this.lightboxImage.src = currentImage.src;
        this.lightboxImage.alt = currentImage.alt;
        this.updateImageCounter();

        // Setup share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            const platform = btn.querySelector('i').className.includes('facebook') ? 'facebook' :
                           btn.querySelector('i').className.includes('twitter') ? 'twitter' :
                           btn.querySelector('i').className.includes('pinterest') ? 'pinterest' : null;
            
            if (platform) {
                btn.onclick = () => this.shareImage(platform);
            }
        });
    }

    updateImageCounter() {
        this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.filteredImages.length}`;
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
