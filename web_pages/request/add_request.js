const ADD_REQUEST_URL = buildUrlWithContextPath('addRequest');
let multiSelectActivities = null;
let multiSelectBoatTypes = null;
let multiSelectOtherMembers = null;
let multiSelectCoxswain = null;

async function populateMembers() {
    const membersListArr = [
        document.getElementById('mainMemberId'),
        document.getElementById('additionalMembers'),
        document.getElementById('coxswain')];

    await populateMembersInMultipleLists(membersListArr, true);
    document.getElementById('mainMemberId').value = (await getUser()).id;
    initMultiSelect('mainMemberId', 'Select Main Member');
    multiSelectOtherMembers = initMultiSelect('additionalMembers', 'Select Additional Members');
    multiSelectCoxswain = initMultiSelect('coxswain', 'Select Coxswain');
}

async function addRequest() {
    const formEl = document.getElementById('addRequestForm');
    const formData = getFormParams(formEl);

    const boatTypesEl = document.getElementById('boatTypes');
    formData.set('boatTypes', getMultiSelectValues(boatTypesEl));

    const additionalMembersEl = document.getElementById('additionalMembers');
    formData.set('additionalMembers', getMultiSelectValues(additionalMembersEl));

    const startTimeEl = document.getElementById('startTime');
    formData.set('startTime', startTimeEl.value);

    const endTimeEl = document.getElementById('endTime');
    formData.set('endTime', endTimeEl.value);

    const response = await fetch(ADD_REQUEST_URL, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const msgEl = document.querySelector('#error');
    const mainMemberEl = document.querySelector('#mainMemberId');
    const mainMember = mainMemberEl.options[mainMemberEl.selectedIndex].text;
    const dateEl = document.querySelector('#requestDate');
    const successText = `Successfully added request of ${mainMember}, for ${dateEl.value}`;

    if (responseText === 'OK') {
        resetPage();
    }
    displayResponse(msgEl, responseText, successText);
}

function resetPage() {
    document.getElementById('requestDate').value='';
    document.getElementById('startTime').value='';
    document.getElementById('endTime').value='';
    clearMultiSelectValues(multiSelectActivities);
    clearMultiSelectValues(multiSelectBoatTypes);
    clearMultiSelectValues(multiSelectOtherMembers);
    clearMultiSelectValues(multiSelectCoxswain);
}

async function createAndPopulateActivities(){
    multiSelectActivities = await populateActivities(multiSelectBoatTypes);
}

window.addEventListener('load', () => {
    multiSelectBoatTypes = initMultiSelect('boatTypes', 'Select Boat Type');
    createAndPopulateActivities();
    populateMembers();

    const formEl = document.getElementById('addRequestForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        addRequest();
    });
});