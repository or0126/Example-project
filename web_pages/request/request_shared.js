const GET_REQUEST_URL = buildUrlWithContextPath("getRequest");

async function getRequest(requestId, isIncludeApproved) {
    if (!requestId) {
        return null;
    }
    const includeApproved = isIncludeApproved ? "true" : "false";
    const url = `${GET_REQUEST_URL}?includeApproved=${includeApproved}&id=${requestId}`;
    const response = await fetch(url);
    return await response.json();
}

async function findRequests(includeApproved, fromDate, toDate, mainMemberId, memberId) {
    const url = buildUrlWithContextPath('findRequests');
    const xmlRetrievalUrl = `${url}?includeApproved=${includeApproved}` +
        (fromDate ? `&fromDate=${fromDate}` : '') +
        (toDate ? `&toDate=${toDate}` : '') +
        (mainMemberId ? `&mainMemberId=${mainMemberId}` : '') +
        (memberId ? `&memberId=${memberId}` : '');
    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});
    return await response.json();
}

async function populateRequestsInList(listElement, includeApproved) {
    const requests = await findRequests(includeApproved);

    requests.forEach(request => {
        const option = document.createElement('option');
        option.text = `ID: ${request.id}, Main Member: ${request.mainMember.name}` +
            `, ${dateToString(request.requestedDate)}` +
            `, ${timeToString(request.startTime)}-${timeToString(request.endTime)}`
        option.value = request.id;
        listElement.appendChild(option);
    });
}

async function populateRequestMembersInLists(requestId, listArr, excludeArr, defaultOption) {
    const members = await getRequestMembers(requestId);

    if (excludeArr && members) {
        excludeArr.forEach((excludeMember) => {
            let i = 0;
            while (i < members.length) {
                if (excludeMember === members[i].id) {
                    members.splice(i, 1);
                } else {
                    i++;
                }
            }
        });
    }

    listArr.forEach((list) => {
        clearSelectItems(list);
        if (defaultOption) {
            list.appendChild(defaultOption);
        }
        doPopulateList(list, members);
    });
}

async function getRequestMembers(requestId) {
    if (!requestId) return null;

    const request = await getRequest(requestId, true);
    const members = [];
    let j = 0;
    members[j++] = request.mainMember;

    if (request.coxswain) {
        members[j++] = request.coxswain;
    }

    request.additionalMembers.forEach(member => {
        members[j++] = member;
    });
    return members;
}

async function populateMembersInMultipleLists(listArr, isActive) {
    if (!Array.isArray(listArr)) return;

    const membersDTO = await fetchMembers(isActive);
    doPopulateMembersInMultipleLists(membersDTO, listArr);
}

function doPopulateMembersInMultipleLists(membersDTO, listArr) {
    if (Array.isArray(membersDTO)) {
        listArr.forEach(list => {
            const listClone = list.cloneNode(true);
            doPopulateList(listClone, membersDTO);
            list.parentNode.replaceChild(listClone, list);
        });
    }
}

async function populateActivities(multiSelectBoatTypes) {
    const activityEl = document.getElementById('activity');

    await populateActivitiesInList(activityEl);

    enableDisableActivity(activityEl);
    const multiSelectActivities = initMultiSelect('activity', 'Select Activity');

    activityEl.addEventListener('change', function (event) {
        onActivityChange(activityEl, multiSelectBoatTypes);
    });

    return multiSelectActivities;
}

function enableDisableActivity(activityEl) {
    if (activityEl.length > 1) {
        activityEl.disabled = false;
        document.getElementById('startTime').disabled = true;
        document.getElementById('endTime').disabled = true;
    } else {
        activityEl.disabled = true;
        document.getElementById('startTime').disabled = false;
        document.getElementById('endTime').disabled = false;
    }
}

async function onActivityChange(activityEl, multiSelectBoatTypes) {
    if (activityEl.value !== '') {
        const activityDTO = await getActivity(activityEl.value);
        document.getElementById('startTime').value = timeToString(activityDTO.startTime);
        document.getElementById('endTime').value = timeToString(activityDTO.endTime);
        if (activityDTO.boatType) {
            if (multiSelectBoatTypes) {
                setMultiSelectValue(multiSelectBoatTypes, activityDTO.boatType);
            } else if (document.getElementById('boatType')) {
                document.getElementById('boatType').value = activityDTO.boatType;
            }
        }
    } else {
        document.getElementById('startTime').value = null;
        document.getElementById('endTime').value = null;
    }
}