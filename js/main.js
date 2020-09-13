const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');
const NAME_FIELD = document.getElementById('urlName');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let name = urlParams.get('name')

function getTextFromTextArea() {
    return TEXT_AREA.value;
}

function putInLocaleStorage(string, name) {
    LOCAL_STORAGE.setItem(name, string);
}

function getFromLocaleStorage() {
    if (!name) {
        let newURL = window.location.href
        if (urlParams.keys.length === 0) {
            newURL += 'index.html?'
        } else {
            newURL += '?'
        }
        newURL += 'name=' + name
        window.history.pushState(name, name, newURL);
        name = 'blank'
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
    //TODO: finish
    for (let key of Object.keys(LOCAL_STORAGE)) {
        console.log(key);
    }
}

window.onload = function () {
    setTextToTextArea(getFromLocaleStorage());
    NAME_FIELD.value = name;
}