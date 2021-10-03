const GET_BOATS_URL = buildUrlWithContextPath('findBoats');

async function fetchData() {
    const xmlRetrievalUrl = `${GET_BOATS_URL}?includePrivate=true&includeDisabled=true&boatId=${getUrlParameter("boatId")}`;
    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});
    const boatDTOArr = await response.json();

    if (boatDTOArr.length > 0) {
        const boatDTO = boatDTOArr[0];

        document.querySelector('#boatId').value = boatDTO.id;
        document.querySelector('#boatName').value = boatDTO.name;
        document.querySelector('#boatType').value = boatDTO.boatType;
        document.querySelector('#isPrivate').value = 'The boat is ' +
            ((boatDTO.isPrivate === true) ? '' : 'not ') + 'private';
        document.querySelector('#isWide').value = 'The boat is ' +
            ((boatDTO.isWide === true) ? '' : 'not ') + 'wide';
        document.querySelector('#isCoastal').value = 'The boat is ' +
            ((boatDTO.isCoastal === true) ? '' : 'not ') + 'coastal';
        document.querySelector('#isDisabled').value = 'The boat is ' +
            ((boatDTO.isDisabled === true) ? '' : 'not ') + 'disabled';
    }
}

function buildWindowUrl(button) {
    return button.dataset.href +
        `?displayName=${document.getElementById('boatName').value}` +
        `&boatId=${getUrlParameter("boatId")}`;
}

window.addEventListener('load', () => {
    fetchData();

    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const redirectUrl = buildWindowUrl(button, 'editBoatFieldWindow');
            openWindow(button, redirectUrl);
        });
    });
});