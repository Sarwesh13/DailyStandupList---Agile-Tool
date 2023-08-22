document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('nameInput');
    const generateButton = document.getElementById('generateButton');
    const nameListContainer = document.getElementById('nameListContainer');
    const notesContainer = document.getElementById('notesContainer');
    const saveNotesButton = document.getElementById('saveNotesButton');
    const randomizeButton = document.getElementById('randomizeButton');

    // let noteInputListeners = [];

    let state = {  // Entire state in this object
        names: [], 
        notes: []    
    };

    function saveStateToLocalStorage(state) {
        localStorage.setItem('savedState', JSON.stringify(state));
        // console.log(JSON.stringify(state.names));
        // console.log(JSON.stringify(state.notes));

    }

    // Load state from local storage if available
    if (localStorage.getItem('savedState')) {
        state = JSON.parse(localStorage.getItem('savedState'));
        displayState();
    }

    // let names = [];

    // Initially hide the Save Notes and Randomize List buttons
    saveNotesButton.style.display = 'none';
    randomizeButton.style.display = 'none';

    generateButton.addEventListener('click', function () {
        names = nameInput.value.split(',').map(name => name.trim());
    
        // Create note containers for each name
        const noteContainers = names.map(name => `
            <div class="note-box">
                <h3>${name}</h3>
                <textarea class="note" placeholder="Enter notes for ${name}..."></textarea>
            </div>
        `).join('');
    
        const nameList = names.map(name => `<li class="name-box">${name}</li>`).join('');
        nameListContainer.innerHTML = `<ul class="horizontal-list">${nameList}</ul>`;
    
        // Set the note containers HTML content
        notesContainer.innerHTML = noteContainers;
    
        nameListContainer.style.display = 'block';
        notesContainer.style.display = 'block';
    
        // Display the Save Notes and Randomize List buttons after list is generated
        saveNotesButton.style.display = 'block';
        randomizeButton.style.display = 'block';
    
        // Update the state object with the current names and notes
        state.names = names;
        state.notes = Array.from(document.querySelectorAll('.note')).map(noteBox => noteBox.value); // Store the notes in the state
    
        saveStateToLocalStorage(state); // Save the state to local storage
    
        // Set up event listeners for note inputs to automatically update the state
        const noteInputs = notesContainer.querySelectorAll('.note');
        noteInputs.forEach((noteInput, index) => {
            noteInput.addEventListener('input', function () {
                state.notes[index] = noteInput.value; // Update the state with the input value
                saveStateToLocalStorage(state); // Save the updated state
            });
        });
    });
    
    
    
    
    
    // saveNotesButton.addEventListener('click', function () {
    //     const notes = Array.from(document.querySelectorAll('.note')).map(noteBox => noteBox.value);
    
    //     // Update the state object with the actual user input notes
    //     state.notes = notes;
    
    //     // Save the state to local storage
    //     saveStateToLocalStorage(state);
    // });
             
    randomizeButton.addEventListener('click', function () {
        
        shuffleArrays(names);
        updateNameList();
    });

    function shuffleArrays(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateNameList() {
        const nameList = names.map(name => `<li class="name-box">${name}</li>`).join('');
        nameListContainer.innerHTML = `<ul class="horizontal-list">${nameList}</ul>`;
    }

    function displayState() {
        if (state.names) {
            nameInput.value = state.names.join(', ');
    
            const nameList = state.names.map(name => `<li class="name-box">${name}</li>`).join('');
            nameListContainer.innerHTML = `<ul class="horizontal-list">${nameList}</ul>`;
        }
    
        if (state.notes) {
            const noteContainers = state.names.map((name, index) => `
                <div class="note-box">
                    <h3>${name}</h3>
                    <textarea class="note" placeholder="Enter notes for ${name}...">${state.notes[index]}</textarea>
                </div>
            `).join('');
            notesContainer.innerHTML = noteContainers;
    
            // Add event listeners to note inputs to capture changes and update state
            const noteInputs = notesContainer.querySelectorAll('.note');
            noteInputs.forEach((noteInput, index) => {
                noteInput.addEventListener('input', function () {
                    state.notes[index] = noteInput.value; // Update the state with the input value
                    saveStateToLocalStorage(state); // Save the updated state
                });
            });
        }
        saveNotesButton.style.display = 'block';
        randomizeButton.style.display = 'block';
    }
    
    
    saveNotesButton.addEventListener('click', function () {
        const notes = Array.from(document.querySelectorAll('.note')).map(noteBox => noteBox.value);
        const content = names.map((name, index) => `${name}: ${notes[index]}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.txt';
        a.click();
    });
});