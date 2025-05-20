
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

