const SPLIT_REQUEST_URL = buildUrlWithContextPath('splitRequest');

let multiSelectRequest = null;
let multiSelectMainMember = null;
let multiSelectOtherMembers = null;
let multiSelectCoxswain = null;
let sourceRequestMember = null;

async function populateRequests() {
    const requestEl = document.getElementById('requestId');
    await populateRequestsInList(requestEl, false);
    multiSelectRequest = initMultiSelect('requestId', 'Select Request');
}

async function splitRequest() {
    const formEl = document.getElementById('splitRequestForm');
    const formData = getFormParams(formEl);

    const additionalMembersEl = document.getElementById('additionalMembers');
    formData.set('additionalMembers', getMultiSelectValues(additionalMembersEl));

    const response = await fetch(SPLIT_REQUEST_URL, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const msgEl = document.querySelector('#error');
    const requestId = document.querySelector('#requestId').value;
    const successText = `Successfully split request ${requestId}`;

    if (responseText === 'OK') {
        resetPage();
    }
    displayResponse(msgEl, responseText, successText);
}

async function onRequestSelected() {
    const requestId = document.getElementById('requestId').value;
    const mainMemberIdEl = document.getElementById('mainMemberId');

    clearMainMember();
    clearCoxswain();
    clearAdditionalMembers();
    multiSelectCoxswain = initMultiSelect('coxswain', 'Select Coxswain');
    multiSelectOtherMembers = initMultiSelect('additionalMembers', 'Select Additional Members');
    disableMultiSelect(multiSelectCoxswain);
    disableMultiSelect(multiSelectOtherMembers);

    if (requestId) {
        const request = await getRequest(requestId, true);
        sourceRequestMember = (request) ? request.mainMember.id : null;
        await populateRequestMembersInLists(requestId, [mainMemberIdEl], [sourceRequestMember], getNoneOption());
    }
    multiSelectMainMember = initMultiSelect('mainMemberId', 'Select Main Member');
    if (!requestId) {
        disableMultiSelect(multiSelectMainMember);
    }
}

async function onMainMemberSelected() {
    const requestId = document.getElementById('requestId').value;
    const mainMemberId = document.getElementById('mainMemberId').value;
    const mainMemberIdEl = document.getElementById('mainMemberId');
    const coxswainEl = document.getElementById('coxswain');
    const additionalMembersEl = document.getElementById('additionalMembers');

    clearCoxswain();
    clearAdditionalMembers();
    multiSelectOtherMembers = initMultiSelect('additionalMembers', 'Select Additional Members');
    disableMultiSelect(multiSelectOtherMembers);

    if (mainMemberId) {
        await populateRequestMembersInLists(requestId, [coxswainEl], [sourceRequestMember, mainMemberIdEl.value], getOptionalNoneOption());
        if (coxswainEl.value) {
            onCoxswainSelected();
        }
    }
    multiSelectCoxswain = initMultiSelect('coxswain', 'Select Coxswain');
    if (!mainMemberId) {
        disableMultiSelect(multiSelectCoxswain);
    }
}

async function onCoxswainSelected() {
    const requestId = document.getElementById('requestId').value;
    const coxswainId = document.getElementById('coxswain').value;
    const mainMemberIdEl = document.getElementById('mainMemberId');
    const coxswainEl = document.getElementById('coxswain');
    const additionalMembersEl = document.getElementById('additionalMembers');

    clearAdditionalMembers();

    if (coxswainId) {
        await populateRequestMembersInLists(requestId, [additionalMembersEl], [sourceRequestMember, mainMemberIdEl.value, coxswainEl.value]);
    }
    multiSelectOtherMembers = initMultiSelect('additionalMembers', 'Select Additional Members');
    if (!coxswainEl.value) {
        disableMultiSelect(multiSelectOtherMembers);
    } else if (coxswainEl.value === '-1') {
        coxswainEl.value = '';
    }
}

function resetPage() {
    clearMultiSelectValues(multiSelectRequest);
    onRequestSelected();
}

function clearCoxswain() {
    doClearLists(multiSelectCoxswain, 'coxswain');
    multiSelectCoxswain = null;
}

function clearMainMember() {
    doClearLists(multiSelectMainMember, 'mainMemberId');
    multiSelectMainMember = null;
}

function clearAdditionalMembers() {
    doClearLists(multiSelectOtherMembers, 'additionalMembers');
    multiSelectOtherMembers = null;
}

function doClearLists(multiSelect, elementId) {
    destroyMultiSelect(multiSelect);
    clearSelectItems(document.getElementById(elementId));
}

function getNoneOption() {
    return createOption('None', '');
}

function getOptionalNoneOption() {
    return createOption('None', '-1');
}

window.addEventListener('load', () => {
    populateRequests().then(() => {
        onRequestSelected();
    });

    const sourceRequestEl = document.getElementById('requestId');
    sourceRequestEl.addEventListener('change', function (event) {
        onRequestSelected();
    });

    const mainMemberEl = document.getElementById('mainMemberId');
    mainMemberEl.addEventListener('change', (event) => {
        onMainMemberSelected();
    });

    const coxswainEl = document.getElementById('coxswain');
    coxswainEl.addEventListener('change', function (event) {
        onCoxswainSelected();
    });

    const formEl = document.getElementById('splitRequestForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        splitRequest();
    });
});