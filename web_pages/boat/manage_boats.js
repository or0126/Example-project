const GET_BOATS_URL = buildUrlWithContextPath('findBoats');
const DELETE_BOAT_URL = buildUrlWithContextPath('deleteBoat');

async function fetchBoats() {
    const xmlRetrievalUrl = getBoatUrl();
    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});
    const boats = await response.json();
    const tableDiv = document.getElementById('tableDiv');
    clearTable(tableDiv);
    const tableEl = document.createElement('table');
    tableEl.setAttribute('id', 'dataTable');
    tableEl.setAttribute('class', 'table table-bordered table-hover');

    tableEl.appendChild(createTableHeader());
    tableEl.appendChild(createTableBody(boats));

    tableDiv.appendChild(tableEl);
}

function getBoatUrl() {
    const boatIdEl = document.getElementById('boatId');
    const boatTypeEl = document.getElementById('boatType');
    const includePrivateEl = document.getElementById('includePrivate');

    let params = '';
    params = appendToParams(params, 'boatId', boatIdEl.value);
    params = appendToParams(params, 'boatType', boatTypeEl.value);
    params = appendToParams(params, 'includePrivate', includePrivateEl.value);
    params = appendToParams(params, 'includeDisabled', 'true');

    return GET_BOATS_URL + params;
}

function createTableHeader() {
    const theadEl = document.createElement('thead');

    theadEl.innerHTML = "<tr>" +
        "<th>Edit</th>" +
        "<th>ID</th>" +
        "<th>Name</th>" +
        "<th>Type</th>" +
        "<th>Private</th>" +
        "<th>Disabled</th>" +
        "<th>Delete</th>" +
        "</tr>";

    return theadEl;
}

function createTableBody(boats) {
    const tbodyEl = document.createElement('tbody');

    if (boats) {
        boats.forEach((boat) => {
            tbodyEl.appendChild(createRowForBoat(boat));
        });
    }

    return tbodyEl;
}

function createRowForBoat(boat) {
    const NUM_COLS = 7;
    const trEl = document.createElement('tr');
    const cols = new Array(NUM_COLS);

    for (let i = 0; i < cols.length; i++) {
        cols[i] = document.createElement('td');
        trEl.appendChild(cols[i]);
    }

    cols[0].appendChild(createEditButton(`update/edit_boat.html?boatId=${boat.id}`));
    cols[1].innerHTML = boat.id;
    cols[2].innerHTML = boat.name;
    cols[3].innerHTML = getReadableEnum(boat.boatType);
    cols[4].innerHTML = boat.isPrivate ? "Yes" : "No";
    cols[5].innerHTML = boat.isDisabled ? "Yes" : "No";
    cols[6].appendChild(createDelButtonForBoat(boat));

    return trEl;
}

function createDelButtonForBoat(boat) {
    return createDelButton(DELETE_BOAT_URL,
        boat.id,
        boat.name,
        fetchBoats,
        null,
        `${ASSIGNMENT_REDIRECT_URL}?chosenBoat=${boat.id}`);
}

async function populateLists() {
    await populateBoatsInList(document.getElementById('boatId'), true);
    initMultiSelect('boatId', 'Select Boat');
    initMultiSelect('boatType', 'Select Boat Type');
}

window.addEventListener('load', () => {
    populateLists();
    fetchBoats();

    const searchButtonEl = document.getElementById('searchBtn');
    searchButtonEl.addEventListener('click', function (event) {
        fetchBoats();
    });
});