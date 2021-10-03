const FIND_ASSIGNMENTS_URL = buildUrlWithContextPath("findAssignments");
const DELETE_ASSIGNMENT_URL = buildUrlWithContextPath("deleteAssignment");

let multiSelectRequest = null;
let multiSelectMember = null;
let multiSelectBoat = null;
let userType = null;

async function init() {
    await populateLists();
    getParamsFromUrl();
}

async function populateLists() {
    await populateRequests();
    await populateMembers();
    await populateBoats();
}

async function populateRequests() {
    const requestParamEl = document.getElementById('requestId');
    const requestFromUrl = getUrlParameter('requestId');
    await populateRequestsInList(requestParamEl, true);
    multiSelectRequest = initMultiSelect('requestId', 'Select Request');
    setMultiSelectValue(multiSelectRequest, requestFromUrl);
    document.getElementById('requestId').value = requestFromUrl;
}

async function populateMembers() {
    const memberParamEl = document.getElementById('memberId');
    const memberFromUrl = getUrlParameter('chosenMember');
    await populateMembersInList(memberParamEl);
    multiSelectMember = initMultiSelect('memberId', 'Select Member');
    setMultiSelectValue(multiSelectMember, memberFromUrl);
    document.getElementById('memberId').value = memberFromUrl;
}

async function populateBoats() {
    const boatParamEl = document.getElementById('boatId');
    const boatFromUrl = getUrlParameter('chosenBoat');
    await populateBoatsInList(boatParamEl, true, true);
    multiSelectBoat = initMultiSelect('boatId', 'Select Boat');
    setMultiSelectValue(multiSelectBoat, boatFromUrl);
    document.getElementById('boatId').value = boatFromUrl;
}

function getParamsFromUrl() {
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

async function fetchAssignments() {
    await getUserType();

    const requestId = document.getElementById('requestId').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const memberId = document.getElementById('memberId').value;
    const boatId = document.getElementById('boatId').value;

    let params = '';
    params = appendToParams(params, 'requestId', requestId);
    params = appendToParams(params, 'fromDate', fromDate);
    params = appendToParams(params, 'toDate', toDate);
    params = appendToParams(params, 'memberId', memberId);
    params = appendToParams(params, 'boatId', boatId);

    const url = FIND_ASSIGNMENTS_URL + params;
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
        "<th>Request</th>" +
        "<th>Boat</th>" +
        "<th>Delete</th>" +
        "</tr>";

    return theadEl;
}

function createTableBody(assignments) {
    const tbodyEl = document.createElement('tbody');
    console.log(assignments);
    if (assignments) {
        assignments.forEach((assignment) => {
            tbodyEl.appendChild(createRowForAssignment(assignment));
        });
    }

    return tbodyEl;
}

function createRowForAssignment(assignment) {
    const NUM_COLS = 3;
    const trEl = document.createElement('tr');
    const cols = new Array(NUM_COLS);

    for (let i = 0; i < cols.length; i++) {
        cols[i] = document.createElement('td');
        trEl.appendChild(cols[i]);
    }
    const assignmentRequest = assignment.registrationRequest;
    const assigmentBoat = assignment.boat;
    cols[0].innerHTML = `Request ID: ${assignmentRequest.id}, Name: ${assignmentRequest.id}` +
        `, Date: ${dateToString(assignmentRequest.requestedDate)}`;
    cols[1].innerHTML = `Boat ID: ${assigmentBoat.id}, Name: ${assigmentBoat.id}, Type: ${getReadableEnum(assigmentBoat.boatType)}`;
    cols[2].appendChild(createDelButtonForAssignment(assignmentRequest));
    return trEl;
}

function createDelButtonForAssignment(assignmentRequest) {
    const buttonEl = createDelButton(DELETE_ASSIGNMENT_URL,
        assignmentRequest.id,
        `${assignmentRequest.id}`,
        fetchAssignments);

    if (userType === 'USER') {
        buttonEl.disabled = true;
    }
    return buttonEl;
}

window.addEventListener('load', () => {
    init().then(() => {
        fetchAssignments();
    });

    const searchButtonEl = document.getElementById('searchBtn');
    searchButtonEl.addEventListener('click', function (event) {
        fetchAssignments();
    });
});