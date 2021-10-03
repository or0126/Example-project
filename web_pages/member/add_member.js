const ADD_MEMBER_URL = buildUrlWithContextPath("addMember");
const LOGIN_PAGE = buildUrlWithContextPath('web_pages/user/sign_in.html');

async function addMember() {
    const formEl = document.querySelector('#addMemberForm');
    const formData = getFormParams(formEl);

    formData.set('memberType', document.getElementById('memberType').value);

    const response = await fetch(ADD_MEMBER_URL, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();

    handleResponse(responseText);
}

function validateForm() {
    let isValid = true;

    if (!isNaturalNumber(document.getElementById('age').value)) {
        handleResponse('Operation failed. Age must be a natural number');
        isValid = false;
    }

    return isValid;
}

function handleFormSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        addMember();
    }
}

function handleResponse(responseText) {
    const formEl = document.querySelector('#addMemberForm');
    const msgEl = document.querySelector('#error');
    const nameEl = document.querySelector('#memberName');
    const successText = `Successfully added member ${nameEl.value}`;

    if (responseText === 'OK') {
        formEl.reset();

        if (getUrlParameter('doRedirect') === 'true'){
            window.location.href = LOGIN_PAGE;
        }
    }

    displayResponse(msgEl, responseText, successText);
}

function setupEventHandlers() {
    const addMemberFormEl = document.querySelector('#addMemberForm');
    addMemberFormEl.addEventListener('submit', handleFormSubmit);
}

window.addEventListener('load', () => {
    populateBoatsInList(document.getElementById('boatId')).then(() => {
        new MultipleSelect('#boatId', {
            placeholder: 'Select Boat'
        });
    });

    setupEventHandlers();
});