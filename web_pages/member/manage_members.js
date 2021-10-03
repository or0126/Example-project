const FIND_MEMBERS_URL = buildUrlWithContextPath("findMembers");
const DELETE_MEMBER_URL = buildUrlWithContextPath("deleteMember");

function fetchAllMembers() {
    const memberIdEl = document.getElementById('memberId');
    const hasBoatEl = document.getElementById('hasBoat');
    const isExpiredEl = document.getElementById('isExpired');

    let params = '';
    params = appendToParams(params, 'memberId', memberIdEl.value);
    params = appendToParams(params, 'hasBoat', hasBoatEl.value);
    params = appendToParams(params, 'isExpired', isExpiredEl.value);

    fetchDataToTable(FIND_MEMBERS_URL + params, createTableHeader, createTableBody);
}

function createTableHeader() {
    const theadEl = document.createElement('thead');

    theadEl.innerHTML = "<tr>" +
        "<th>Edit</th>" +
        "<th>ID</th>" +
        "<th>Name</th>" +
        "<th>Age</th>" +
        "<th>Email</th>" +
        "<th>Private Boat</th>" +
        "<th>Expired</th>" +
        "<th>Delete</th>" +
        "</tr>";

    return theadEl;
}

function createTableBody(members) {
    const tbodyEl = document.createElement('tbody');

    if (members) {
        members.forEach((member) => {
            tbodyEl.appendChild(createRowForMember(member));
        });
    }

    return tbodyEl;
}

function createRowForMember(member) {
    const NUM_COLS = 8;
    const trEl = document.createElement('tr');
    const cols = new Array(NUM_COLS);

    for (let i = 0; i < cols.length; i++) {
        cols[i] = document.createElement('td');
        trEl.appendChild(cols[i]);
    }

    cols[0].appendChild(createEditButton(`update/edit_member.html?chosenMember=${member.id}`));
    cols[1].innerHTML = member.id;
    cols[2].innerHTML = member.name;
    cols[3].innerHTML = member.age;
    cols[4].innerHTML = member.email;
    cols[5].innerHTML = (member.hasBoat === true) ? "Yes" : "No";
    cols[6].innerHTML = (member.expirationDate && getDateFromJSON(member.expirationDate) < new Date()) ? "Yes" : "No";
    cols[7].appendChild(createDelButtonForMember(member));

    return trEl;
}

function getDateFromJSON(jsonDateTime) {
    return new Date(jsonDateTime.date.year, jsonDateTime.date.month - 1, jsonDateTime.date.day,
        jsonDateTime.time.hour, jsonDateTime.time.minute, jsonDateTime.time.second);
}

function createDelButtonForMember(member) {
    return createDelButton(DELETE_MEMBER_URL,
        member.id,
        member.name,
        fetchAllMembers,
        checkBeforeDeleteMember,
        `${ASSIGNMENT_REDIRECT_URL}?chosenMember=${member.id}`,
        `${REQUEST_REDIRECT_URL}`);
}

async function checkBeforeDeleteMember(memberId) {
    let isOkayToContinue = true;

    const currentUser = await getUser();
    if (currentUser && currentUser.id === memberId) {
        displayError('You cannot delete yourself!!!');
        isOkayToContinue = false;
    }

    return isOkayToContinue;
}

async function populateMembers(){
    const memberParamEl = document.getElementById('memberId');
    await populateMembersInList(memberParamEl);
    multiSelectMember = initMultiSelect('memberId', 'Select Member');
}

window.addEventListener('load', () => {
    populateMembers();
    fetchAllMembers();

    const searchButtonEl = document.getElementById('searchBtn');
    searchButtonEl.addEventListener('click', function (event) {
        fetchAllMembers();
    });
});