async function fetchData() {
    const requestId = getUrlParameter("id");
    const requestDTO = await getRequest(requestId, true);

    if (requestDTO && requestDTO.id) {
        document.querySelector('#requestId').value = requestDTO.id;
        document.querySelector('#isApproved').value = (requestDTO.isApproved === true) ? "Yes" : "No";
        document.querySelector('#mainMember').value = `${requestDTO.mainMember.name} (id ${requestDTO.mainMember.id})`;
        document.querySelector('#requestDate').value = dateToString(requestDTO.requestedDate);
        document.querySelector('#boatTypesPlaceHolder').innerHTML = `${requestDTO.boatTypeList.length} Selected`;
        document.querySelector('#times').value = `${timeToString(requestDTO.startTime)}-${timeToString(requestDTO.endTime)}`;
        document.querySelector('#membersPlaceHolder').innerHTML = `${requestDTO.additionalMembers.length} Selected`;
        document.querySelector('#coxswain').value = (requestDTO.coxswain) ?
            `${requestDTO.coxswain.name} (id ${requestDTO.coxswain.id})` : null;
    }
    enableDisableByPrivilege(requestDTO);
}

function buildWindowUrl(button) {
    return button.dataset.href +
        `?id=${getUrlParameter("id")}`;
}

function disabledAllButtons() {
    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.disabled = true;
    });
}

function showInfoMessage(infoText) {
    const msgEl = document.getElementById('error');
    changeAlertClass(msgEl, 'alert-info');
    msgEl.innerHTML = infoText;
}

function clearMessage(){
    const msgEl = document.getElementById('error');
    changeAlertClass(msgEl, 'alert-light');
    msgEl.innerHTML = '';
}

async function enableDisableByPrivilege(requestDTO) {
    if (requestDTO && requestDTO.id) {
        if (requestDTO.isApproved) {
            showInfoMessage('You cannot edit an approved request');
            disabledAllButtons();
        } else {
            const currentUser = await getUser();
            if (currentUser.memberType === 'MANAGER' &&
                !isMemberInRequest(currentUser.id, requestDTO)) {
                showInfoMessage('A manager cannot set the date and activity for a request he does not participate at');
                document.getElementById('editDateBtn').disabled = true;
                document.getElementById('editTimesBtn').disabled = true;
            } else {
                document.getElementById('editDateBtn').disabled = false;
                document.getElementById('editTimesBtn').disabled = false;
                clearMessage();
            }
        }
    }
    else{
        showInfoMessage('The request does not exist or you have no privilege to see it');
        disabledAllButtons();
    }
}

function isMemberInRequest(memberId, requestDTO) {
    let isExists = false;

    if ((requestDTO.mainMember.id === memberId) ||
        (requestDTO.coxswain && requestDTO.coxswain.id === memberId)) {
        isExists = true;
    } else if (requestDTO.additionalMembers) {
        for (let i = 0; i < requestDTO.additionalMembers.length && !isExists; i++) {
            if (requestDTO.additionalMembers[i].id === memberId) {
                isExists = true;
            }
        }
    }

    return isExists;
}

window.addEventListener('load', () => {
    fetchData();

    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const redirectUrl = buildWindowUrl(button);
            openWindow(button, redirectUrl, 'editRequestFieldWindow');
        });
    });
});