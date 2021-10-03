const SMALL_WINDOW_DIM = {width: 500, height: 300};
const BIG_WINDOW_DIM = {width: 500, height: 430};

async function submitData(url, updateType, id, additionalParams) {
    const formData = buildFormDataWithParams(updateType, id, additionalParams);

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();
    if (responseText === 'OK') {
        closeWindow();
    } else {
        displayError(responseText);
    }

    return responseText;
}

function buildFormDataWithParams(updateType, id, additionalParams) {
    const formEl = document.querySelector('#updateDataForm');
    const formData = getFormParams(formEl);

    formData.append('id', id);
    formData.append('updateType', updateType);

    if (additionalParams) {
        additionalParams.forEach((param) => {
            formData.set(param.name, param.value);
        });
    }

    return formData;
}

function openWindow(button, redirectUrl, windowName) {
    if (!button.hasAttribute('data-big-window')) {
        window.open(redirectUrl, windowName,
            `width=${SMALL_WINDOW_DIM.width},height=${SMALL_WINDOW_DIM.height}`);
    } else {
        window.open(redirectUrl, `${windowName}Big`,
            `width=${BIG_WINDOW_DIM.width},height=${BIG_WINDOW_DIM.height}`);
    }
}

function closeWindow() {
    if (window.opener) {
        window.opener.fetchData();
    }
    window.close();
}

function displayError(responseText) {
    const msgEl = document.querySelector('#responseMsg');
    displayResponse(msgEl, responseText, '');
}

function hideError() {
    const msgEl = document.querySelector('#responseMsg');
    msgEl.innerHTML = '';
    changeAlertClass(msgEl, 'alert-light');
}

function setHeaderByPattern(pattern, id, description) {
    document.getElementById('editHeader').innerHTML =
        document.getElementById('editHeader').innerHTML
            .replace(pattern, `${description} (id ${id})`);
}