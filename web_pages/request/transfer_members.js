const TRANSFER_MEMBERS_URL = buildUrlWithContextPath('transferMembers');

let multiSelectSourceRequest = null;
let multiSelectTargetRequest = null;
let multiSelectOtherMembers = null;
let multiSelectCoxswain = null;

function setParameterRequestAsSelected() {
    const destRequest = getUrlParameter('destRequest');
    if (destRequest) {
        setMultiSelectValue(multiSelectTargetRequest, destRequest);
    }
}

async function populateRequests() {
    const sourceRequestEl = document.getElementById('sourceRequestId');
    const targetRequestEl = document.getElementById('targetRequestId');
    await populateRequestsInList(sourceRequestEl, false);
    await populateRequestsInList(targetRequestEl, false);
    multiSelectSourceRequest = initMultiSelect('sourceRequestId', 'Select Source Request');
    multiSelectTargetRequest = initMultiSelect('targetRequestId', 'Select Target Request');
    setParameterRequestAsSelected();
}

async function populateMembers() {
    clearMembersFromLists();

    const sourceRequestId = document.getElementById('sourceRequestId').value;
    const membersListArr = [
        document.getElementById('additionalMembers'),
        document.getElementById('coxswain')];

    if (sourceRequestId) {
        await populateRequestMembersInLists(sourceRequestId, membersListArr);
        document.getElementById('coxswain').prepend(createOption('None', ''));
        document.getElementById('coxswain').value = '';
    }

    multiSelectOtherMembers = initMultiSelect('additionalMembers', 'Select Additional Members');
    multiSelectCoxswain = initMultiSelect('coxswain', 'Select Coxswain');
}

function clearMembersFromLists() {
    destroyMultiSelect(multiSelectOtherMembers);
    multiSelectOtherMembers = null;
    destroyMultiSelect(multiSelectCoxswain);
    multiSelectCoxswain = null;
    clearSelectItems(document.getElementById('additionalMembers'));
    clearSelectItems(document.getElementById('coxswain'));
}

async function transferMembers() {
    const formEl = document.getElementById('transferForm');
    const formData = getFormParams(formEl);

    const additionalMembersEl = document.getElementById('additionalMembers');
    formData.set('additionalMembers', getMultiSelectValues(additionalMembersEl));

    const response = await fetch(TRANSFER_MEMBERS_URL, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();

    handleResponse(responseText);
}

function handleResponse(responseText) {
    const msgEl = document.querySelector('#error');
    const source = document.querySelector('#sourceRequestId').value;
    const target = document.querySelector('#targetRequestId').value;
    const successText = `Successfully Transferred members from request ${source} to ${target}`;

    if (responseText === 'OK') {
        if (window.opener) {
            if (window.opener.returnFromTransfer) {
                window.opener.returnFromTransfer();
            }
            window.close();
        } else {
            resetPage();
        }
    }
    displayResponse(msgEl, responseText, successText);
}

function resetPage() {
    clearMultiSelectValues(multiSelectSourceRequest);
    clearMultiSelectValues(multiSelectTargetRequest);
    clearMultiSelectValues(multiSelectOtherMembers);
    clearMultiSelectValues(multiSelectCoxswain);
}

window.addEventListener('load', () => {
    populateRequests().then(() => {
        if (document.getElementById('sourceRequestId').value) {
            populateMembers();
        }
    });

    const formEl = document.getElementById('transferForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        transferMembers();
    });

    const sourceRequestEl = document.getElementById('sourceRequestId');
    sourceRequestEl.addEventListener('change', function (event) {
        populateMembers();
    });
});