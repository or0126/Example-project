const FIND_REQUESTS_URL = buildUrlWithContextPath("findRequests");
const DELETE_REQUEST_URL = buildUrlWithContextPath("deleteRequest");
let userType = null;

function getParamsFromUrl() {
    const includeApproved = getUrlParameter('includeApproved');
    document.getElementById('includeApproved').value = includeApproved === 'true' ? 'true' : 'false';

    const fromTodayPlusX = parseInt(getUrlParameter('fromTodayPlusX'));
    if (fromTodayPlusX || fromTodayPlusX === 0) {
        const fromDateParamEl = document.getElementById('fromDate');
        let fromTodayDate = new Date();
        fromTodayDate.setDate(fromTodayDate.getDate() + fromTodayPlusX);
        fromDateParamEl.value = formatDate(fromTodayDate);
    }

    const toTodayPlusX = parseInt(getUrlParameter('toTodayPlusX'));
    if (toTodayPlusX || toTodayPlusX === 0) {
        const toDateParamEl = document.getElementById('toDate');
        let toTodayDate = new Date();
        toTodayDate.setDate(toTodayDate.getDate() + toTodayPlusX);
        toDateParamEl.value = formatDate(toTodayDate);
    }
}

async function fetchRequests() {
    await getUserType();

    const includeApprovedParamEl = document.getElementById('includeApproved');
    const fromDateParamEl = document.getElementById('fromDate');
    const toDateParamEl = document.getElementById('toDate');
    const mainMemberEl = document.getElementById('mainMemberId');
    const memberParamEl = document.getElementById('memberId');
    const requestFromUrl = getUrlParameter('requestId');

    const url = `${FIND_REQUESTS_URL}?includeApproved=${includeApprovedParamEl.value}` +
        ((fromDateParamEl.value) ? `&fromDate=${fromDateParamEl.value}` : '') +
        ((toDateParamEl.value) ? `&toDate=${toDateParamEl.value}` : '') +
        ((mainMemberEl.value) ? `&mainMemberId=${mainMemberEl.value}` : '') +
        ((memberParamEl.value) ? `&memberId=${memberParamEl.value}` : '') +
        ((requestFromUrl) ? `&requestId=${requestFromUrl}` : '');

    fetchDataToTable(url, createTableHeader, createTableBody);
}

async function getUserType() {
    if (!userType) {
        const user = await getUser();
        userType = user.memberType;
    }
    return userType;
}

function createTableHeader() {
    const theadEl = document.createElement('thead');

    theadEl.innerHTML = "<tr>" +
        "<th>Edit</th>" +
        "<th>ID</th>" +
        "<th>Main Member</th>" +
        "<th>Date</th>" +
        "<th>Time</th>" +
        "<th>Approved</th>" +
        "<th>Delete</th>" +
        "</tr>";

    return theadEl;
}

function createTableBody(requests) {
    const tbodyEl = document.createElement('tbody');

    if (requests) {
        requests.forEach((request) => {
            tbodyEl.appendChild(createRowForRequest(request));
        });
    }

    return tbodyEl;
}

function createRowForRequest(request) {
    const NUM_COLS = 7;
    const trEl = document.createElement('tr');
    const cols = new Array(NUM_COLS);

    for (let i = 0; i < cols.length; i++) {
        cols[i] = document.createElement('td');
        trEl.appendChild(cols[i]);
    }

    cols[0].appendChild(createEditButton(`update/edit_request.html?id=${request.id}`));
    cols[1].innerHTML = request.id;
    cols[2].innerHTML = `${request.mainMember.name} (${request.mainMember.id})`;
    cols[3].innerHTML = dateToString(request.requestedDate);
    cols[4].innerHTML = `${timeToString(request.startTime)}-${timeToString(request.endTime)}`;
    cols[5].innerHTML = (request.isApproved === true) ? "Yes" : "No";
    cols[6].appendChild(createDelButtonForRequest(request));

    return trEl;
}

function createDelButtonForRequest(request) {
    const buttonEl = createDelButton(DELETE_REQUEST_URL,
        request.id,
        `${request.mainMember.name}'s Request`,
        fetchRequests,
        null,
        `${ASSIGNMENT_REDIRECT_URL}?requestId=${request.id}`);

    if (request.isApproved && userType === 'USER') {
        buttonEl.disabled = true;
    }
    return buttonEl;
}

async function populateMembersList() {
    const memberParamEl = document.getElementById('memberId');
    const mainMemberParamEl = document.getElementById('mainMemberId');
    await populateMembersInMultipleLists([memberParamEl, mainMemberParamEl]);
    initMultiSelect('memberId', 'Select Member');
    initMultiSelect('mainMemberId', 'Select Main Member');
}

window.addEventListener('load', () => {
    populateMembersList();
    getParamsFromUrl();
    fetchRequests();

    const searchButtonEl = document.getElementById('searchBtn');
    searchButtonEl.addEventListener('click', function (event) {
        fetchRequests();
    });
});