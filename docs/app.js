// Variables
// ------------------------------------------------

let userAgent = navigator.userAgent;

let isChrome = userAgent.includes("Chrome") && !userAgent.includes("OPR");
let isFirefox = userAgent.includes("Firefox");
let isSafari = userAgent.includes("Safari") && !userAgent.includes("Chrome");
let isEdge = userAgent.includes("Edg");
let isOpera = userAgent.includes("OPR") || userAgent.includes("Opera");

// HTML DOMs
const titleForm = document.getElementById('titleForm');
const noteTitle = document.getElementById('noteTitle');
const helpTitle = document.getElementById('helpTitle');
const editorTitle = document.getElementById('editorTitle');
const footer = document.querySelector('footer');
const footerNotesSection = document.querySelector('footer .notes-section');
const footerHandle = document.getElementById('handle');
const footerNotes = document.getElementById('notes-container');

// Constant variables
const minY = 10; // Minimum position percentage (how high it can go)
const scrollFactor = 10;
const defaultFooterPosition = 80; // Default position at 80%
const hiddenFooterPosition = 92; // Hidden position at 92%

// Changable variables
let titleLength = 0;
let isScrolling = false;
let isSubmitted = false;
let startY = 80; // Starting position percentage
let currentY = startY;
let touchStartY = 0; // Handle touch events for mobile

// Essential variables
let finalTitle;
let finalContent;


// Note Title
// ------------------------------------------------

noteTitle.addEventListener('input', (e) => {
    let inputTitle = e.target.value.trim();
    titleLength = inputTitle.length;

    // let titleWidth = noteTitle.clientWidth;
    // let inputTitleSize = parseInt(window.getComputedStyle(e.target).fontSize.slice(0, -2));
    
    if (titleLength >= 1) {
        helpTitle.classList.replace('hide', 'unhide');
        footer.style.top = `${hiddenFooterPosition}%`;
        footerNotes.classList.replace('unhide', 'hide');
    } else {
        helpTitle.classList.replace('unhide', 'hide');
        footer.style.top = `${defaultFooterPosition}%`;
        footerNotes.classList.replace('hide', 'unhide');
    }

    // Update currentY to match the footer's position
    currentY = titleLength >= 1 ? hiddenFooterPosition : defaultFooterPosition;
})

noteTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        titleSubmit();
    }
})


// Existing Notes
// ------------------------------------------------

// Function to calculate dynamic minimum Y position
// to ensures the bottom of the notes container is at the bottom of the viewport
function getDynamicMinY() {
    // Get the total height of the notes container containing all notes
    const notesHeight = footerNotes.scrollHeight;
    // Get the viewport height
    const viewportHeight = window.innerHeight;
    
    // Calculate the minimum Y position needed to show all notes
    return Math.max(minY, startY + 10 - (notesHeight / viewportHeight * 100));
}

// Function to update title form visibility based on footer position
function formVisibility() {
    // Always show the form when footer is at default or hidden position
    if (currentY >= defaultFooterPosition) {
        titleForm.classList.replace('hide', 'unhide');
    } else {
        // Hide the form when footer is scrolled up
        titleForm.classList.replace('unhide', 'hide');
    }
    
    // Show notes when footer is visible
    if (currentY <= defaultFooterPosition) {
        footerNotes.classList.replace('hide', 'unhide');
    } else if (titleLength >= 1) {
        // Hide notes when footer is at hidden position and title has text
        footerNotes.classList.replace('unhide', 'hide');
    }
}

// Handle mouse wheel scrolling over the footer
footerNotesSection.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent default scroll behavior
    
    // Get dynamic minimum Y position
    const dynamicMinY = getDynamicMinY();
    
    if (e.deltaY < 0) {
        // Scrolling up - move footer up
        currentY = Math.max(currentY - scrollFactor / 2, dynamicMinY);
    } else {
        // Scrolling down - move footer down
        const maxPosition = titleLength >= 1 ? hiddenFooterPosition : defaultFooterPosition;
        currentY = Math.min(currentY + scrollFactor / 2, maxPosition);
    }
    
    formVisibility();
    footer.style.top = `${currentY}%`;
});

footerNotesSection.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

footerNotesSection.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;

    // Get dynamic minimum Y position
    const dynamicMinY = getDynamicMinY();
    
    if (diff > 0) {
        // Swiping up - move footer up
        currentY = Math.max(currentY - scrollFactor, dynamicMinY);
    } else {
        // Swiping down - move footer down
        const maxPosition = titleLength >= 1 ? hiddenFooterPosition : defaultFooterPosition;
        currentY = Math.min(currentY + scrollFactor, maxPosition);
    }
    
    formVisibility();
    footer.style.top = `${currentY}%`;
    touchStartY = touchY;
});

// Update dynamic minimum Y position when window is resized
window.addEventListener('resize', () => {
    // If footer is already scrolled up, adjust its position based on new calculations
    if (currentY < defaultFooterPosition) {
        currentY = getDynamicMinY();
        // Reset visibility and position
        formVisibility();
        footer.style.top = `${currentY}%`;
    }
});

// Reset footer position when clicking outside
document.addEventListener('click', (e) => {
    if (!footerNotesSection.contains(e.target)) {
        currentY = titleLength >= 1 ? hiddenFooterPosition : defaultFooterPosition;
        footer.style.top = `${currentY}%`;
        if (!isSubmitted) {
            formVisibility();
        }
    }
});

// Handle hover behavior for footer while input title field not empty
footerNotesSection.addEventListener('mouseover', () => {
    if (titleLength > 0 && currentY >= defaultFooterPosition) {
        currentY = defaultFooterPosition;
        footer.style.top = `${currentY}%`;
        footerNotes.classList.replace('hide', 'unhide');
    }
});

footerNotesSection.addEventListener('mouseout', () => {
    if (titleLength > 0 && currentY >= defaultFooterPosition) {
        currentY = hiddenFooterPosition;
        footer.style.top = `${currentY}%`;
        footerNotes.classList.replace('unhide', 'hide');
    }
});

noteEditorSection = document.getElementById('noteEditor');
noteEditor = document.getElementById('editor');

// Handle title form submission to proceed with note editor
function titleSubmit() {
    isSubmitted = true;
    finalTitle = editorTitle.innerText = noteTitle.value.trim();

    document.querySelector('body > div.background-container').classList.replace('title-mode', 'editor-mode');
    titleForm.classList.add('delete'); // 1. Delete the title form from 'deleteit' CSS animation
    noteEditorSection.classList.add('insert'); // 2. Enable vertical expansion from 'insertit' CSS animation
    noteTitle.removeAttribute('autofocus');
    noteEditor.focus();

    fallbackNoteHeaderScrollAnimation();
}

// Fallback for browsers that don't support scroll-driven animations
function fallbackNoteHeaderScrollAnimation() {
    // Check if browser supports scroll-driven animations
    const supportsScrollTimeline = 'animationTimeline' in document.documentElement.style;

    const headerArea = document.querySelector('#noteEditor .header-area');
    
    if (!supportsScrollTimeline) {
        const backgroundOnEditorMode = document.querySelector('.background-container.editor-mode');
        
        backgroundOnEditorMode.addEventListener('scroll', () => {
            // Get scroll position
            const scrollTop = backgroundOnEditorMode.scrollY || backgroundOnEditorMode.scrollTop;
            
            // Apply class based on scroll position
            if (scrollTop > 50) {
                headerArea.classList.add('scrolled');
            } else {
                headerArea.classList.remove('scrolled');
            }
        });
    } else {
        headerArea.style.animationName = 'opacity-change';
    }
}



editorTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        finalTitle = editorTitle.innerText.trim();
    }
})


function format(command, value = null) {
    document.execCommand(command, true, value);
}

function saveContent() {
    const content = document.getElementById('editor').innerHTML;
    localStorage.setItem('editorContent', content);
    alert('Content saved!');
}

function loadContent() {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
        document.getElementById('editor').innerHTML = savedContent;
    } else {
        alert('No saved content found.');
    }
}

