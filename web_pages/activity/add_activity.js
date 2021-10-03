const ADD_ACTIVITY_URL = buildUrlWithContextPath("addActivity");

async function addActivity(){
    const formEl = document.querySelector('#addActivityForm');
    const formData = getFormParams(formEl);

    const response = await fetch(ADD_ACTIVITY_URL, {
        method: 'POST',
        body: formData
    });

    let responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const formEl = document.querySelector('#addActivityForm');
    const msgEl = document.querySelector('#error');
    const nameEl = document.querySelector('#activityName');
    const successText = `Successfully added activity ${nameEl.value}`;

    if (responseText === 'OK') {
        formEl.reset();
    }
    displayResponse(msgEl, responseText, successText);
}

function handleFormSubmit(event) {
    event.preventDefault();
    addActivity();
}

window.addEventListener('load', () => {
    new MultipleSelect('#boatType', {
        placeholder: 'Select Boat Type'
    });

    document.querySelector('#addActivityForm')
        .addEventListener('submit', handleFormSubmit);
});