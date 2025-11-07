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
        // Per-category fallback images (used when an embedded URL fails)
        this.categoryFallbacks = {
            nature: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
            architecture: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
            animals: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d',
            misc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
        };

        this.init();
    } 

    init() {
        this.loadImages();
        this.filteredImages = [...this.images];
        this.bindEvents();
        this.setupFilters();
    }

    loadImages() {
        // Curated images with matching categories using direct Unsplash URLs
        this.images = [
            // Nature Images
            
            { 
                src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
                alt: 'Snow-capped mountain peaks at sunrise',
                category: 'nature' 
            },
            { 
                src: 'https://images.unsplash.com/photo-1511497584788-876760111969',
                alt: 'Dense forest with sunlight streaming through trees',
                category: 'nature' 
            },
            { 
                src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
                alt: 'Tropical beach with crystal clear waters',
                category: 'nature' 
            },

            // Architecture Images
            { 
                src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
                alt: 'Modern city skyline with skyscrapers',
                category: 'architecture' 
            },
            { 
                src: 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=800&q=80',
                alt: 'Engineering marvel of a suspension bridge',
                category: 'architecture' 
            },

            // Animals Images
            { 
                src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
                alt: 'Majestic lion in the African savanna',
                category: 'animals' 
            },
            { 
                // previous entry contained an incorrect placeholder id; keep the embedded approach
                // but point to a reliable Unsplash image (fallback logic will handle any failures)
                src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0',
                alt: 'Elephant family walking through the grasslands',
                category: 'animals' 
            },
            { 
                src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
                alt: 'Majestic waterfall in a lush forest',
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

            // Ensure we append quality params to the base URL (strip any existing query string first)
            const baseSrc = image.src.split('?')[0];
            const imageUrl = `${baseSrc}?auto=format&fit=crop&w=800&q=80`;
            img.src = imageUrl;
            img.alt = image.alt;

            // If primary URL fails, replace with a category-specific fallback (prevent infinite loop)
            let triedFallback = false;
            img.onerror = () => {
                if (!triedFallback) {
                    triedFallback = true;
                    const fallbackBase = this.categoryFallbacks[image.category] || this.categoryFallbacks.misc;
                    const fallbackUrl = `${fallbackBase.split('?')[0]}?auto=format&fit=crop&w=800&q=80`;
                    console.warn(`Image failed, switching to fallback for category '${image.category}': ${imageUrl} -> ${fallbackUrl}`);
                    img.src = fallbackUrl;
                    return;
                }

                // Final failure: show an inline error element
                galleryItem.classList.remove('loading');
                galleryItem.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to load image</p>
                    </div>
                `;
                console.error(`Failed to load image after fallback: ${imageUrl}`);
            };

            img.onload = () => {
                galleryItem.classList.remove('loading');
                galleryItem.appendChild(img);
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
        this.currentIndex = (this.currentIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.filteredImages.length;
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
