const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');
const NAME_FIELD = document.getElementById('urlName');
const NOTES_FIELD = document.getElementById('notesNames');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let name = urlParams.get('name');

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

function save() {
    putInLocaleStorage(getTextFromTextArea(), name);
}

function setNewURL(newName) {
    let newURL = window.location.href.replace('name=' + name, 'name=' + newName);
    name = newName;
    window.history.pushState(name, name, newURL);

}

function renameURL() {
    deleteFromLocaleStorage();
    setNewURL(NAME_FIELD.value);
    save();
}

function openNote(noteName) {
    NAME_FIELD.value = noteName;
    setNewURL(noteName);
    setTextToTextArea(LOCAL_STORAGE.getItem(noteName));
    displayNames();

}

function displayNames() {
    NOTES_FIELD.textContent = '';
    for (let key of Object.keys(LOCAL_STORAGE)) {
        let card = document.createElement('div');
        NOTES_FIELD.appendChild(card);
        card.setAttribute('class', 'card bg-dark');

        let cardBody = document.createElement("div");
        card.appendChild(cardBody);
        cardBody.setAttribute('class', 'card-body');
        cardBody.setAttribute('onclick', "save(); openNote('" + key + "');");
        if (key === name) {
            cardBody.setAttribute('id', 'selectedCard');
        }


        let h5 = document.createElement('h5');
        cardBody.appendChild(h5);
        h5.setAttribute('class', 'card-title');
        h5.appendChild(document.createTextNode(key));

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