# Image Gallery with Lightbox

A responsive image gallery web application with lightbox functionality built with vanilla HTML, CSS, and JavaScript.

## Features

- **Responsive Grid Layout**: Images displayed in a responsive grid (3-4 per row depending on screen size)
- **Lightbox Modal**: Click any image to open it in a full-screen lightbox
- **Navigation**: Navigate between images using:
  - On-screen Previous/Next buttons
  - Keyboard arrow keys (← →)
  - Touch/swipe gestures on mobile devices
- **Smooth Animations**: Fade-in/out transitions and smooth image switching
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Support**: ESC key to close, arrow keys for navigation

## Getting Started

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Click** on any image to open the lightbox
4. **Navigate** using the buttons, keyboard, or touch gestures

## File Structure

```
image-gallery/
├── index.html          # Main HTML file
├── style.css           # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── images/             # Folder for local images (optional)
└── README.md           # This file
```

## Customization

### Adding Your Own Images

To use your own images instead of the sample ones:

1. Place your images in the `images/` folder
2. Update the `loadImages()` method in `script.js`:

```javascript
loadImages() {
    this.images = [
        { src: 'images/your-image1.jpg', alt: 'Your image description' },
        { src: 'images/your-image2.jpg', alt: 'Your image description' },
        // Add more images...
    ];
    this.renderGallery();
}
```

### Styling Customization

- **Colors**: Modify CSS variables in `style.css`
- **Grid Layout**: Adjust `grid-template-columns` in `.gallery` class
- **Animations**: Customize transition durations and effects
- **Responsive Breakpoints**: Update media queries for different screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

- **No Dependencies**: Pure vanilla JavaScript, HTML5, and CSS3
- **Performance**: Lazy loading for images, optimized animations
- **Accessibility**: Keyboard navigation, proper ARIA labels
- **Mobile-First**: Responsive design with touch support

## Future Enhancements

The code is structured to easily add:
- Image captions
- Zoom functionality
- Fullscreen toggle
- Image filtering/search
- Slideshow mode
- Social sharing

## License

This project is open source and available under the MIT License.
