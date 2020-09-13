const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');
const NAME_FIELD = document.getElementById('urlName');
const NOTES_FIELD = document.getElementById('notesNames');
const NAME_OF_KEYS_ARRAY = 'hesoyamBaguvix';//Easter egg
const NAME_OF_DATE_ARRAY = 'timeSingularity';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let name = urlParams.get('name');

const keys = (() => {
    let keys = LOCAL_STORAGE.getItem(NAME_OF_KEYS_ARRAY);
    if (!keys) {
        return [];
    }
    return JSON.parse(keys);
})();

const dateOfCreation = (() => {
    let keys = LOCAL_STORAGE.getItem(NAME_OF_DATE_ARRAY);
    if (!keys) {
        return [];
    }
    return JSON.parse(keys);
})();

function getTextFromTextArea() {
    return TEXT_AREA.value;
}

function putInLocaleStorage(string, name) {
    LOCAL_STORAGE.setItem(name, string);
}

function normalizeName() {
    if (!name) {
        name = 'blank'
        let newURL = window.location.href;
        if (!urlParams.keys().next()) {
            newURL += 'index.html?';
        } else {
            newURL += '?';
        }
        newURL += 'name=' + name;
        window.history.pushState(name, name, newURL);
    }
}

function deleteFromLocaleStorage() {
    LOCAL_STORAGE.removeItem(name);
}

function setTextToTextArea(string) {
    TEXT_AREA.value = string;
}

function pushTopKey() {
    if (keys.includes(name)) {
        let indexOf = keys.indexOf(name);
        keys.splice(indexOf, 1);
        dateOfCreation.splice(indexOf, 1);
    }
    keys.unshift(name);
    dateOfCreation.unshift(new Date())
    LOCAL_STORAGE.setItem(NAME_OF_KEYS_ARRAY, JSON.stringify(keys));
    LOCAL_STORAGE.setItem(NAME_OF_DATE_ARRAY, JSON.stringify(dateOfCreation));
}

function save() {
    putInLocaleStorage(getTextFromTextArea(), name);
    pushTopKey();
}

function setNewURL(newName) {
    let newURL = window.location.href.replace('name=' + encodeURI(name), 'name=' + newName);
    name = newName;
    window.history.pushState(name, name, newURL);

}

function renameURL() {
    deleteFromLocaleStorage();
    let indexOf = keys.indexOf(name);
    keys.splice(indexOf, 1);
    dateOfCreation.splice(indexOf, 1);
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
        card.setAttribute('class', 'card bg-dark');

        let cardBody = document.createElement("div");
        card.appendChild(cardBody);
        cardBody.setAttribute('class', 'card-body');
        cardBody.setAttribute('onclick', "openNote('" + key + "');");
        if (key === name) {
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

window.onload = function () {
    normalizeName();
    openNote(name);
    NAME_FIELD.value = name;
    displayNames();
}