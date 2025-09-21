Product Requirement Document (PRD)
Project: Image Gallery with Lightbox
1. Overview

Build a responsive Image Gallery web application where users can view images in a grid and click to open them in a lightbox modal. The lightbox should allow zooming, navigation (next/previous), and closing.

2. Goals

Simple, responsive gallery layout.

Lightbox functionality with image enlargement.

Smooth transitions and animations.

Easy to extend with more images.

3. Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript (no frameworks required).

Optional: Bootstrap or Tailwind for quicker styling.

Deployment: Static site (Netlify, GitHub Pages, or any web server).

4. Features
4.1 Image Gallery

Display images in a grid layout (3–4 per row depending on screen size).

Responsive design (works on desktop, tablet, and mobile).

Hover effect (slight zoom or shadow on image hover).

4.2 Lightbox Modal

Clicking an image opens it in a modal overlay.

Modal should cover the screen with a semi-transparent dark background.

Features inside lightbox:

Enlarged image centered.

Next/Previous buttons for navigation.

Close button (X) on top right.

Clicking outside the image closes the lightbox.

4.3 Navigation

Users can navigate between images in the lightbox using:

On-screen buttons (Next, Previous).

Arrow keys (keyboard navigation).

4.4 Transitions/Animations

Smooth fade-in and fade-out when opening/closing the lightbox.

Smooth sliding when moving between images.

5. Non-Functional Requirements

Code should be clean and modular.

Images should be stored in a local images/ folder for simplicity.

No external libraries required, unless using Tailwind/Bootstrap for CSS.

6. Stretch Features 

Zoom in/out inside the lightbox.

Fullscreen toggle.

Image captions displayed under each image.

7. Folder Structure
image-gallery/
│── index.html
│── style.css
│── script.js
│── images/
│    ├── img1.jpg
│    ├── img2.jpg
│    ├── img3.jpg
│    └── ...