const LOGOUT_URL = buildUrlWithContextPath("logout");

async function handleLogout() {
    const response = await fetch(LOGOUT_URL, {method: 'post'});

    if (response.redirected) {
        window.location.href = response.url;
    } else {
        const responseText = await response.text();
        setErrorMessage(responseText);
    }
}

window.addEventListener('load', () => {
    const logoutEl = document.querySelector('#logout');
    logoutEl.addEventListener('click', handleLogout);
});

function setErrorMessage(errorText) {
    const errorEl = document.querySelector('#error');
    errorEl.innerHTML = errorText;
}