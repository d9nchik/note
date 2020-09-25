const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');
const NAME_FIELD = document.getElementById('urlName');
const NOTES_FIELD = document.getElementById('notesNames');
const NAMES_ARRAY = 'hesoyamBaguvix';//Easter egg
const NAME_OF_STORAGE_WITH_UNIQUE_URL = 'uniqueURL';

let idOfNote = new URLSearchParams(window.location.search).get('id');

function getArrayFromStorage(nameInStorage) {
    let keys = LOCAL_STORAGE.getItem(nameInStorage);
    if (!keys) {
        return [];
    }
    return JSON.parse(keys);
}

const keys = getArrayFromStorage(NAME_OF_STORAGE_WITH_UNIQUE_URL);
const keysObjects = (() => {
    let object = LOCAL_STORAGE.getItem(NAMES_ARRAY);
    if (!object) {
        return {};
    }
    return JSON.parse(object);
})();

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
        keysObjects[idOfNote] = {
            "name": keysObjects[idOfNote].name,
            "date": new Date()
        }
        keys.unshift(idOfNote);
        LOCAL_STORAGE.setItem(NAME_OF_STORAGE_WITH_UNIQUE_URL, JSON.stringify(keys));
        LOCAL_STORAGE.setItem(NAMES_ARRAY, JSON.stringify(keysObjects));
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
    normalizeName();
    let newURL = window.location.href.replace('id=' + encodeURI(idOfNote), 'id=' + newName);
    idOfNote = newName;
    window.history.pushState(idOfNote, idOfNote, newURL);

}

function renameNote() {
    if (keys.includes(idOfNote)) {
        keysObjects[idOfNote] = {
            "name": NAME_FIELD.value,
            "date": new Date()
        }
        displayNames();
        pushTopKey();
    }
}

function openNote(key) {
    if (keys.includes(key)) {
        setNewURL(key);
        NAME_FIELD.value = keysObjects[key].name;
        setTextToTextArea(LOCAL_STORAGE.getItem(key));
        displayNames();
    }
}

function displayNames() {
    NOTES_FIELD.textContent = '';
    NOTES_FIELD.appendChild(document.createTextNode('Select note:'))
    for (let key of keys) {
        let date = new Date(keysObjects[key].date);
        let name = keysObjects[key].name;
        let card = document.createElement('div');
        NOTES_FIELD.appendChild(card);
        card.setAttribute('class', 'card btn btn-secondary bg-dark');

        let cardBody = document.createElement("div");
        card.appendChild(cardBody);
        cardBody.setAttribute('class', 'card-body');
        cardBody.addEventListener('click', () => openNote(key));
        if (key === idOfNote) {
            cardBody.setAttribute('id', 'selectedCard');
        }


        let h5 = document.createElement('h5');
        cardBody.appendChild(h5);
        h5.setAttribute('class', 'card-title');
        h5.appendChild(document.createTextNode(name));

        let h6 = document.createElement('h6');
        cardBody.appendChild(h6);
        h6.appendChild(document.createTextNode(new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }).format(date)));

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
            delete keysObjects[idOfNote];
            keys.splice(indexOf, 1);
            LOCAL_STORAGE.setItem(NAME_OF_STORAGE_WITH_UNIQUE_URL, JSON.stringify(keys));
            LOCAL_STORAGE.setItem(NAMES_ARRAY, JSON.stringify(keysObjects));
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
        let id;
        while (keys.includes(id = makeID(5))) {
        }//Our id should be unique

        keys.unshift(id);
        keysObjects[id] = {
            "name": noteName,
            "date": new Date()
        }

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
    openNote(idOfNote);
    displayNames();
}