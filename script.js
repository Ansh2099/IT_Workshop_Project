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
        this.imageUpload = document.getElementById('imageUpload');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.uploadCategory = document.getElementById('uploadCategory');
        this.fileInputLabel = document.querySelector('.file-input-label');
        this.selectedFiles = [];
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
        this.setupUpload();
    }
    loadImages() {
        this.images = [
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
            {
                src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
                alt: 'Majestic lion in the African savanna',
                category: 'animals'
            },
            {
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
            
            // Handle local images differently from Unsplash images
            if (image.isLocal) {
                img.src = image.src;
                img.alt = image.alt;
                img.onload = () => {
                    galleryItem.classList.remove('loading');
                    galleryItem.appendChild(img);
                };
                img.onerror = () => {
                    galleryItem.classList.remove('loading');
                    galleryItem.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Failed to load local image</p>
                        </div>
                    `;
                };
            } else {
                // Handle Unsplash images with fallback
                const baseSrc = image.src.split('?')[0];
                const imageUrl = `${baseSrc}?auto=format&fit=crop&w=800&q=80`;
                img.src = imageUrl;
                img.alt = image.alt;
                let triedFallback = false;
                img.onerror = () => {
                    if (!triedFallback) {
                        triedFallback = true;
                        const fallbackBase = this.categoryFallbacks[image.category] || this.categoryFallbacks.misc;
                        const fallbackUrl = `${fallbackBase.split('?')[0]}?auto=format&fit=crop&w=800&q=80`;
                        img.src = fallbackUrl;
                        return;
                    }
                    galleryItem.classList.remove('loading');
                    galleryItem.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Failed to load image</p>
                        </div>
                    `;
                };
                img.onload = () => {
                    galleryItem.classList.remove('loading');
                    galleryItem.appendChild(img);
                };
            }
            
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            this.gallery.appendChild(galleryItem);
        });
    }
    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterImages(category);
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
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.previousImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
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
        this.addTouchSupport();
    }
    
    setupUpload() {
        // File input change event
        this.imageUpload.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
        
        // Upload button click event
        this.uploadBtn.addEventListener('click', () => {
            this.uploadSelectedImages();
        });
        
        // Drag and drop events
        this.fileInputLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.fileInputLabel.classList.add('drag-over');
        });
        
        this.fileInputLabel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.fileInputLabel.classList.remove('drag-over');
        });
        
        this.fileInputLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            this.fileInputLabel.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files);
        });
    }
    
    handleFileSelect(files) {
        this.selectedFiles = Array.from(files).filter(file => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not a valid image file.`);
                return false;
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name} is too large. Maximum size is 10MB.`);
                return false;
            }
            
            return true;
        });
        
        // Update UI
        if (this.selectedFiles.length > 0) {
            this.uploadBtn.disabled = false;
            const fileText = this.selectedFiles.length === 1 
                ? `${this.selectedFiles[0].name}` 
                : `${this.selectedFiles.length} files selected`;
            this.fileInputLabel.querySelector('span').textContent = fileText;
        } else {
            this.uploadBtn.disabled = true;
            this.fileInputLabel.querySelector('span').textContent = 'Choose Images or Drag & Drop';
        }
    }
    
    uploadSelectedImages() {
        if (this.selectedFiles.length === 0) return;
        
        const category = this.uploadCategory.value;
        
        this.selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    src: e.target.result,
                    alt: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                    category: category,
                    isLocal: true
                };
                
                this.images.push(newImage);
                
                // Update filtered images if current category matches
                if (this.currentCategory === 'all' || this.currentCategory === category) {
                    this.filteredImages.push(newImage);
                }
                
                // Re-render gallery
                this.renderGallery();
            };
            reader.readAsDataURL(file);
        });
        
        // Reset upload form
        this.resetUploadForm();
        
        // Show success message
        this.showUploadSuccess();
    }
    
    resetUploadForm() {
        this.imageUpload.value = '';
        this.selectedFiles = [];
        this.uploadBtn.disabled = true;
        this.fileInputLabel.querySelector('span').textContent = 'Choose Images or Drag & Drop';
    }
    
    showUploadSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'upload-success';
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Images uploaded successfully!';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
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
        document.body.style.overflow = 'hidden';
    }
    closeLightbox() {
        this.lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    updateLightboxImage() {
        const currentImage = this.filteredImages[this.currentIndex];
        this.lightboxImage.src = currentImage.src;
        this.lightboxImage.alt = currentImage.alt;
        this.updateImageCounter();
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
document.addEventListener('DOMContentLoaded', () => {
    new ImageGallery();
});
const GalleryUtils = {
    addImage: (src, alt) => {
        console.log('Add image functionality can be implemented here');
    },
    preloadImages: (imageUrls) => {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
};
