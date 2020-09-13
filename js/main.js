const LOCAL_STORAGE = window.localStorage;
const TEXT_AREA = document.getElementById('noteTextArea');

function getTextFromTextArea() {
    return TEXT_AREA.value;
}

function putInLocaleStorage(string) {
    LOCAL_STORAGE.setItem('1', string);
}

function getFromLocaleStorage() {
    return LOCAL_STORAGE.getItem('1');
}

function setTextToTextArea(string) {
    TEXT_AREA.value = string;
}

function save() {
    putInLocaleStorage(getTextFromTextArea());
    console.log('Save!')
}

window.onload = function () {
    setTextToTextArea(getFromLocaleStorage())
}