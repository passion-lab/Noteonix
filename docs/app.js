// Note Title
// ------------------------------------------------

const noteTitle = document.getElementById('noteTitle');
const helpTitle = document.getElementById('helpTitle');
const footerHandle = document.getElementById('handle');
const footerNotes = document.getElementById('notes-container');


noteTitle.addEventListener('input', (e) => {
    let inputTitle = e.target.value;

    // let titleWidth = noteTitle.clientWidth;
    // let inputTitleSize = parseInt(window.getComputedStyle(e.target).fontSize.slice(0, -2));
    
    if (inputTitle.length >= 1) {
        helpTitle.classList.remove('hide');
        helpTitle.classList.add('unhide');

        footerHandle.classList.remove('unhide');
        footerHandle.classList.add('hide');
        footerNotes.classList.remove('unhide');
        footerNotes.classList.add('hide');
    } else {
        helpTitle.classList.remove('unhide');
        helpTitle.classList.add('hide');

        footerHandle.classList.remove('hide');
        footerHandle.classList.add('unhide');
        footerNotes.classList.remove('hide');
        footerNotes.classList.add('unhide');
    }
})

noteTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        console.log(noteTitle.value);
    }
})


// Existing Notes
// ------------------------------------------------

const footer = document.querySelector('footer');
const notesContainer = document.getElementById('notes-container');

let isScrolling = false;
let startY = 80; // Starting position percentage
let currentY = startY;
const minY = 10; // Minimum position percentage (how high it can go)
const scrollFactor = 10;

// Handle mouse wheel scrolling over the footer
footer.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent default scroll behavior
    
    if (e.deltaY < 0) {
        // Scrolling up - move footer up
        currentY = Math.max(currentY - scrollFactor, minY);
    } else {
        // Scrolling down - move footer down
        currentY = Math.min(currentY + scrollFactor, startY);
    }
    
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
    
    if (diff > 0) {
        // Swiping up - move footer up
        currentY = Math.max(currentY - 1, minY);
    } else {
        // Swiping down - move footer down
        currentY = Math.min(currentY + 1, startY);
    }
    
    footer.style.top = `${currentY}%`;
    touchStartY = touchY;
});


// Reset footer position when clicking outside
document.addEventListener('click', (e) => {
    if (!footer.contains(e.target) && currentY !== startY) {
        currentY = startY;
        // footer.style.transition = 'top 0.5s ease-out';
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

