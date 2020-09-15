const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');
const NAME_FIELD = document.getElementById('urlName');
const NOTES_FIELD = document.getElementById('notesNames');
const NAME_OF_KEYS_ARRAY = 'hesoyamBaguvix';//Easter egg
const NAME_OF_DATE_ARRAY = 'timeSingularity';
const NAME_OF_STORAGE_WITH_UNIQUE_URL = 'uniqueURL';
//TODO: add ability to create notes with same name
//TODO: add ability to start from /

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let idOfNote = urlParams.get('id');

function getArrayFromStorage(nameInStorage) {
    let keys = LOCAL_STORAGE.getItem(nameInStorage);
    if (!keys) {
        return [];
    }
    return JSON.parse(keys);
}

const keys = getArrayFromStorage(NAME_OF_KEYS_ARRAY);
const dateOfCreation = getArrayFromStorage(NAME_OF_DATE_ARRAY);
const uniqueURL = getArrayFromStorage(NAME_OF_STORAGE_WITH_UNIQUE_URL);

function getTextFromTextArea() {
    return TEXT_AREA.value;
}

function putInLocaleStorage(string, name) {
    LOCAL_STORAGE.setItem(name, string);
}

function normalizeName() {
    if (!idOfNote) {
        idOfNote = 'blank';
        let newURL = window.location.href;
        if (newURL.includes('?')) {
            newURL += 'index.html?';
        } else {
            newURL += '&';
        }
        newURL += 'id=' + idOfNote;
        window.history.pushState(idOfNote, idOfNote, newURL);
    }
}

function deleteFromLocaleStorage() {
    LOCAL_STORAGE.removeItem(idOfNote);
}

function setTextToTextArea(string) {
    TEXT_AREA.value = string;
}

function pushTopKey() {
    if (keys.includes(idOfNote)) {
        let indexOf = keys.indexOf(idOfNote);
        keys.splice(indexOf, 1);
        dateOfCreation.splice(indexOf, 1);
    }
    keys.unshift(idOfNote);
    dateOfCreation.unshift(new Date())
    LOCAL_STORAGE.setItem(NAME_OF_KEYS_ARRAY, JSON.stringify(keys));
    LOCAL_STORAGE.setItem(NAME_OF_DATE_ARRAY, JSON.stringify(dateOfCreation));
}

function save() {
    putInLocaleStorage(getTextFromTextArea(), idOfNote);
    pushTopKey();
}

function setNewURL(newName) {
    let newURL = window.location.href.replace('id=' + encodeURI(idOfNote), 'id=' + newName);
    idOfNote = newName;
    window.history.pushState(idOfNote, idOfNote, newURL);

}

function renameURL() {
    deleteFromLocaleStorage();
    if (keys.includes(idOfNote)) {

        let indexOf = keys.indexOf(idOfNote);
        keys.splice(indexOf, 1);
        dateOfCreation.splice(indexOf, 1);
    }

    setNewURL(NAME_FIELD.value);
    save();
    displayNames();
}

function openNote(noteName) {
    NAME_FIELD.value = noteName;
    setNewURL(noteName);
    setTextToTextArea(LOCAL_STORAGE.getItem(noteName));
    displayNames();

}

function displayNames() {
    NOTES_FIELD.textContent = '';
    NOTES_FIELD.appendChild(document.createTextNode('Select note:'))
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let date = new Date(dateOfCreation[i]);
        let card = document.createElement('div');
        NOTES_FIELD.appendChild(card);
        card.setAttribute('class', 'card btn btn-secondary bg-dark');

        let cardBody = document.createElement("div");
        card.appendChild(cardBody);
        cardBody.setAttribute('class', 'card-body');
        cardBody.setAttribute('onclick', "openNote('" + key + "');");
        if (key === idOfNote) {
            cardBody.setAttribute('id', 'selectedCard');
        }


        let h5 = document.createElement('h5');
        cardBody.appendChild(h5);
        h5.setAttribute('class', 'card-title');
        h5.appendChild(document.createTextNode(key));

        let h6 = document.createElement('h6');
        cardBody.appendChild(h6);
        h6.appendChild(document.createTextNode(date.toUTCString()));

        let p = document.createElement('p');
        cardBody.appendChild(p);
        p.setAttribute('class', 'card-text');
        p.appendChild(document.createTextNode(LOCAL_STORAGE.getItem(key).slice(0, 50)));
    }
}

function deleteNote() {
    if (confirm('Are you sure you want to delete note?')) {
        //deleting
        if (keys.includes(idOfNote)) {

            let indexOf = keys.indexOf(idOfNote);
            keys.splice(indexOf, 1);
            dateOfCreation.splice(indexOf, 1);
            LOCAL_STORAGE.setItem(NAME_OF_KEYS_ARRAY, JSON.stringify(keys));
            LOCAL_STORAGE.setItem(NAME_OF_DATE_ARRAY, JSON.stringify(dateOfCreation));
        }
        LOCAL_STORAGE.removeItem(idOfNote);
        openNote('blank');
        displayNames();
    }
}

function createNewNote() {
    //TODO: defend from injection;
    //For example this <script>alert('Hi');</script>
    //Or '); alert('Hi
    let noteName = prompt('Enter name of note');
    if (noteName) {
        // if user press 'cancel' or put empty string we wouldn't create new note
        openNote();
        save();
        displayNames();
    }
}

window.onload = function () {
    normalizeName();
    openNote(idOfNote);
    displayNames();
}