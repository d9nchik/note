const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');
const NAME_FIELD = document.getElementById('urlName');
const NOTES_FIELD = document.getElementById('notesNames');
const NAMES_ARRAY = 'hesoyamBaguvix';//Easter egg
const NAME_OF_DATE_ARRAY = 'timeSingularity';
const NAME_OF_STORAGE_WITH_UNIQUE_URL = 'uniqueURL';
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

const keys = getArrayFromStorage(NAME_OF_STORAGE_WITH_UNIQUE_URL);
const dateOfCreation = getArrayFromStorage(NAME_OF_DATE_ARRAY);
const names = getArrayFromStorage(NAMES_ARRAY);

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
        if (!newURL.includes('?')) {
            newURL += '?';
        } else {
            newURL += '&';
        }
        newURL += 'id=' + idOfNote;
        window.history.pushState(idOfNote, idOfNote, newURL);
    }
}

function setTextToTextArea(string) {
    TEXT_AREA.value = string;
}

function pushTopKey() {
    if (keys.includes(idOfNote)) {
        let indexOf = keys.indexOf(idOfNote);
        keys.splice(indexOf, 1);
        dateOfCreation.splice(indexOf, 1);
        let name = names[indexOf];
        names.splice(indexOf, 1);
        keys.unshift(idOfNote);
        dateOfCreation.unshift(new Date());
        names.unshift(name);
        LOCAL_STORAGE.setItem(NAME_OF_STORAGE_WITH_UNIQUE_URL, JSON.stringify(keys));
        LOCAL_STORAGE.setItem(NAME_OF_DATE_ARRAY, JSON.stringify(dateOfCreation));
        LOCAL_STORAGE.setItem(NAMES_ARRAY, JSON.stringify(names));
        return true;
    }
    return false;
}

function save() {
    if (pushTopKey()) {
        putInLocaleStorage(getTextFromTextArea(), idOfNote);
    }
}

function setNewURL(newName) {
    let newURL = window.location.href.replace('id=' + encodeURI(idOfNote), 'id=' + newName);
    idOfNote = newName;
    window.history.pushState(idOfNote, idOfNote, newURL);

}

function renameNote() {
    if (keys.includes(idOfNote)) {
        let indexOf = keys.indexOf(idOfNote);
        dateOfCreation[indexOf] = new Date();
        names[indexOf] = NAME_FIELD.value;
        displayNames();
        pushTopKey();
    }
}

function openNote(key) {
    setNewURL(key);
    let indexOf = keys.indexOf(idOfNote);
    NAME_FIELD.value = names[indexOf];
    setTextToTextArea(LOCAL_STORAGE.getItem(key));
    displayNames();
}

function displayNames() {
    NOTES_FIELD.textContent = '';
    NOTES_FIELD.appendChild(document.createTextNode('Select note:'))
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let date = new Date(dateOfCreation[i]);
        let name = names[i];
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
        h5.appendChild(document.createTextNode(name));

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
            names.splice(indexOf, 1);
            LOCAL_STORAGE.setItem(NAMES_ARRAY, JSON.stringify(names));
            LOCAL_STORAGE.setItem(NAME_OF_DATE_ARRAY, JSON.stringify(dateOfCreation));
            LOCAL_STORAGE.setItem(NAME_OF_STORAGE_WITH_UNIQUE_URL, JSON.stringify(keys));
        }
        LOCAL_STORAGE.removeItem(idOfNote);
        openNote(keys[0]);
        displayNames();
    }
}

function createNewNote() {
    let noteName = prompt('Enter name of note');
    if (noteName) {
        // if user press 'cancel' or put empty string we wouldn't create new note
        id = makeID(5);
        keys.unshift(id);
        names.unshift(noteName);
        dateOfCreation.unshift(new Date());
        LOCAL_STORAGE.setItem(id, '');
        openNote(id);
        save();
        displayNames();
    }
}

function generateSymbol() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

function makeID(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += generateSymbol();
    }
    return result;
}

window.onload = function () {
    normalizeName();
    openNote(idOfNote);
    displayNames();
}