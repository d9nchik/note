const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');

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
    if (!name){
        name='blank'
    }
    return LOCAL_STORAGE.getItem(name);
}

function setTextToTextArea(string) {
    TEXT_AREA.value = string;
}

function save() {
    putInLocaleStorage(getTextFromTextArea(), name);
}

window.onload = function () {
    setTextToTextArea(getFromLocaleStorage())
}