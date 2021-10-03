const ADD_NOTIFICATION_URL = buildUrlWithContextPath('addNotification');

async function addNotification() {
    const formEl = document.querySelector('#addNotificationForm');
    const formData = getFormParams(formEl);

    const response = await fetch(ADD_NOTIFICATION_URL, {
        method: 'POST',
        body: formData
    });

    let responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const formEl = document.querySelector('#addNotificationForm');
    const msgEl = document.querySelector('#error');
    const successText = `Successfully added the notification`;

    if (responseText === 'OK') {
        formEl.reset();
    }
    displayResponse(msgEl, responseText, successText);
}

function handleFormSubmit(event) {
    event.preventDefault();
    addNotification();
}

window.addEventListener('load', () => {
    const formEl = document.getElementById('addNotificationForm');
    formEl.addEventListener('submit', handleFormSubmit);
});