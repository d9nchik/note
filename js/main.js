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

function getFromLocaleStorage() {
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
    return LOCAL_STORAGE.getItem(name);
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

function changeURL() {
    let oldName = name;
    deleteFromLocaleStorage();
    name = NAME_FIELD.value;
    save();
    let newURL = window.location.href.replace('name=' + oldName, 'name=' + name);
    window.history.pushState(name, name, newURL);
}

function displayNames() {
    NOTES_FIELD.textContent = '';
    let list = document.createElement('ul');
    for (let key of Object.keys(LOCAL_STORAGE)) {
        let li = document.createElement('li');
        let text = document.createTextNode(LOCAL_STORAGE.getItem(key));
        li.appendChild(text);
        list.appendChild(li);
    }
    NOTES_FIELD.appendChild(list);
}

window.onload = function () {
    setTextToTextArea(getFromLocaleStorage());
    NAME_FIELD.value = name;
    displayNames();
}