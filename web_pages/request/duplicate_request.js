const DUPLICATE_REQUEST_URL = buildUrlWithContextPath('duplicateRequest');

let multiSelectRequest = null;
let multiSelectMainMember = null;
let multiSelectOtherMembers = null;
let multiSelectCoxswain = null;

async function populateRequests() {
    const requestEl = document.getElementById('requestId');
    await populateRequestsInList(requestEl, false);
    multiSelectRequest = initMultiSelect('requestId', 'Select Request');
}

async function populateMembers() {
    const membersListArr = [
        document.getElementById('mainMemberId'),
        document.getElementById('additionalMembers'),
        document.getElementById('coxswain')];

    await populateMembersInMultipleLists(membersListArr, true);
    multiSelectMainMember = initMultiSelect('mainMemberId', 'Select Main Member');
    multiSelectOtherMembers = initMultiSelect('additionalMembers', 'Select Additional Members');
    multiSelectCoxswain = initMultiSelect('coxswain', 'Select Coxswain');
}

async function duplicateRequest() {
    const formEl = document.getElementById('dupRequestForm');
    const formData = getFormParams(formEl);

    const additionalMembersEl = document.getElementById('additionalMembers');
    formData.set('additionalMembers', getMultiSelectValues(additionalMembersEl));

    const response = await fetch(DUPLICATE_REQUEST_URL, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const msgEl = document.querySelector('#error');
    const requestId = document.querySelector('#requestId').value;
    const mainMemberEl = document.querySelector('#mainMemberId');
    const mainMember = (mainMemberEl.selectedIndex >= 0) ? mainMemberEl.options[mainMemberEl.selectedIndex].text : '';
    const successText = `Successfully duplicated request ${requestId} for ${mainMember}`;

    if (responseText === 'OK') {
        resetPage();
    }
    displayResponse(msgEl, responseText, successText);
}

function resetPage() {
    clearMultiSelectValues(multiSelectRequest);
    clearMultiSelectValues(multiSelectMainMember);
    clearMultiSelectValues(multiSelectOtherMembers);
    clearMultiSelectValues(multiSelectCoxswain);
}

window.addEventListener('load', () => {
    populateRequests();
    populateMembers();

    const formEl = document.getElementById('dupRequestForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        duplicateRequest();
    });
});