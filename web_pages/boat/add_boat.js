const ADD_BOAT_URL = buildUrlWithContextPath("addBoat");

async function addBoat() {
    const formEl = document.querySelector('#addBoatForm');
    const formData = getFormParams(formEl);

    const response = await fetch(ADD_BOAT_URL, {
        method: 'POST',
        body: formData
    });

    let responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const formEl = document.querySelector('#addBoatForm');
    const msgEl = document.querySelector('#error');
    const nameEl = document.querySelector('#boatName');
    const successText = `Successfully added boat ${nameEl.value}`;

    if (responseText === 'OK') {
        formEl.reset();
    }
    displayResponse(msgEl, responseText, successText);
}

function handleFormSubmit(event) {
    event.preventDefault();
    addBoat();
}

function setupEventHandlers() {
    const addMemberFormEl = document.querySelector('#addBoatForm');
    addMemberFormEl.addEventListener('submit', handleFormSubmit);
}

window.addEventListener('load', () => {
    new MultipleSelect('#boatType', {
        placeholder: 'Select Boat Type'
    });

    setupEventHandlers();
});