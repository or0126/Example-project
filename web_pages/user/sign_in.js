const LOGIN_URL = buildUrlWithContextPath('sign_in');
const CHECK_MANAGER_EXISTS_URL = buildUrlWithContextPath('checkManagerExists');

function setErrorMessage(errorText) {
    const errorEl = document.getElementById('errorMsg');
    errorEl.innerHTML = errorText;
}

function doRedirect(location) {
    window.location.href = location;
}

async function handleResponse(response) {
    if (response.redirected) {
        doRedirect(response.url);
    } else {
        setErrorMessage(await response.text());
    }
}

async function sign_in() {
    const loginFormEl = document.querySelector('#loginForm');

    const data = new URLSearchParams();
    for (const pair of new FormData(loginFormEl)) {
        data.append(pair[0], pair[1]);
    }

    const response = await fetch(LOGIN_URL, {
        method: loginFormEl.method || 'get',
        body: data
    });

    await handleResponse(response);
}

function handleFormSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    sign_in();
}

function setupEventHandlers() {
    const loginFormEl = document.getElementById('loginForm');
    loginFormEl.addEventListener('submit', handleFormSubmit);
}

async function isExistsManager() {
    const response = await fetch(CHECK_MANAGER_EXISTS_URL);
    return await response.json();
}

async function handleMissingManagers() {
    const isManagerExists = await isExistsManager();

    if (!isManagerExists) {
        document.getElementById('firstSignupDiv').innerHTML =
            '<div  class="mt-3">' +
            '<a id="firstSignupLink" href="first_manager_signup.html?doRedirect=true">For first manager signup click here</a>' +
            '</div>';
    }
}


window.addEventListener('load', function (event) {
    setupEventHandlers();
    handleMissingManagers();
});