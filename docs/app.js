// Note Title
// ------------------------------------------------

const noteTitle = document.getElementById('noteTitle');
const helpTitle = document.getElementById('helpTitle');
const footerHandle = document.getElementById('handle');
const footerNotes = document.getElementById('notes-container');

let titleLength = 0;


noteTitle.addEventListener('input', (e) => {
    let inputTitle = e.target.value;
    titleLength = inputTitle.length;

    // let titleWidth = noteTitle.clientWidth;
    // let inputTitleSize = parseInt(window.getComputedStyle(e.target).fontSize.slice(0, -2));
    
    if (titleLength >= 1) {
        helpTitle.classList.replace('hide', 'unhide');
        footerHandle.classList.replace('unhide', 'hide');
        footerNotes.classList.replace('unhide', 'hide');
    } else {
        helpTitle.classList.replace('unhide', 'hide');
        footerHandle.classList.replace('hide', 'unhide');
        footerNotes.classList.replace('hide', 'unhide');
    }
})

noteTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        console.log(noteTitle.value);
    }
})


// Existing Notes
// ------------------------------------------------

const titleForm = document.getElementById('titleForm');
const footer = document.querySelector('footer');

let isScrolling = false;
let startY = 80; // Starting position percentage
let currentY = startY;
const minY = 10; // Minimum position percentage (how high it can go)
const scrollFactor = 10;


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
    if (currentY > startY - 10) {
        // Unhide the form while scrolling down
        titleForm.classList.replace('hide', 'unhide');
        if (titleLength >= 1) {
            footerHandle.classList.replace('unhide', 'hide');
            footerNotes.classList.replace('unhide', 'hide');
        }
    } else {
        // Hide the form while scrolling up
        titleForm.classList.replace('unhide', 'hide');
        if (titleLength >= 1) {
            footerHandle.classList.replace('hide', 'unhide');
            footerNotes.classList.replace('hide', 'unhide');
        }
    }
}

// Handle mouse wheel scrolling over the footer
footer.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent default scroll behavior
    
    // Get dynamic minimum Y position
    const dynamicMinY = getDynamicMinY();
    
    if (e.deltaY < 0) {
        // Scrolling up - move footer up
        currentY = Math.max(currentY - scrollFactor, dynamicMinY);
    } else {
        // Scrolling down - move footer down
        currentY = Math.min(currentY + scrollFactor, startY);
    }
    
    formVisibility();
    footer.style.top = `${currentY}%`;
});

// Handle touch events for mobile
let touchStartY = 0;

footer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

footer.addEventListener('touchmove', (e) => {
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
        currentY = Math.min(currentY + scrollFactor, startY);
    }
    
    formVisibility();
    footer.style.top = `${currentY}%`;
    touchStartY = touchY;
});

// Update dynamic minimum Y position when window is resized
window.addEventListener('resize', () => {
    // If footer is already scrolled up, adjust its position based on new calculations
    if (currentY < startY) {
        currentY = getDynamicMinY();
        // Reset visibility and position
        formVisibility();
        footer.style.top = `${currentY}%`;
    }
});

// Reset footer position when clicking outside
document.addEventListener('click', (e) => {
    if (!footer.contains(e.target) && currentY !== startY) {
        currentY = startY;
        // Reset visibility and position
        formVisibility();
        footer.style.top = `${currentY}%`;
    }
});



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

