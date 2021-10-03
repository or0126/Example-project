const UPLOAD_URL = buildUrlWithContextPath("upload");

function displayErrors(errorsList) {
    const errorsListContainerEl = document.querySelector('#errorMessages');
    errorsListContainerEl.innerHTML = '';

    errorsList.forEach((error) => {
        const errorEl = createErrorElement(error);
        errorsListContainerEl.append(errorEl);
    });
}

function createErrorElement(error) {
    const el = document.createElement("li");

    const spanEl = document.createElement('span');
    spanEl.innerText = error;
    el.append(spanEl);

    return el;
}

async function sendData(url, form) {
    const formData = new FormData(form);

    const response = await fetch(url, {
        method: 'POST',
        enctype: 'multipart/form-data',
        body: formData
    });

    displayErrors(await response.json());
}

function uploadFile() {
    const errorsListContainerEl = document.querySelector('#errorMessages');
    errorsListContainerEl.innerHTML = '';

    const uploadFormEl = document.querySelector('#uploadForm');
    sendData(UPLOAD_URL, uploadFormEl);
}

function isReplaceMembers() {
    const xmlType = document.getElementById('xmlType').value;
    const xmlLoadType = document.getElementById('xmlLoadType').value;

    return (xmlType === 'MEMBERS' && xmlLoadType === 'REPLACE');
}

function displayReplaceMembersConfirmation() {
    const modal = getModalInstance(document.getElementById('confirmationMdl'));
    hideError();
    const saveButton = replaceElementWithClone(document.getElementById('okBtn'));
    saveButton.addEventListener('click', function (event) {
        uploadFile();
        if (isReplaceMembers()) {
            handleLogout();
        } else {
            closeModal(document.getElementById('confirmationMdl'));
        }
    });
    modal.show();
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (isReplaceMembers()) {
        displayReplaceMembersConfirmation();
    } else {
        uploadFile();
    }
}

window.addEventListener('load', () => {
    const uploadFormEl = document.querySelector('#uploadForm');
    uploadFormEl.addEventListener('submit', handleFormSubmit);
});