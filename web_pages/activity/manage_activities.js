const GET_ACTIVITIES_URL = buildUrlWithContextPath('getAllActivities');
const DELETE_ACTIVITY_URL = buildUrlWithContextPath('deleteActivity');

async function fetchActivities() {
    const response = await fetch(GET_ACTIVITIES_URL, {method: 'GET'});
    const activities = await response.json();
    const tableDiv = document.getElementById('tableDiv');
    clearTable(tableDiv);
    const tableEl = document.createElement('table');
    tableEl.setAttribute('id', 'dataTable');
    tableEl.setAttribute('class', 'table table-bordered table-hover');

    tableEl.appendChild(createTableHeader());
    tableEl.appendChild(createTableBody(activities));

    tableDiv.appendChild(tableEl);
}

function createTableHeader() {
    const theadEl = document.createElement('thead');

    theadEl.innerHTML = "<tr>" +
        "<th>Edit</th>" +
        "<th>ID</th>" +
        "<th>Activity Name</th>" +
        "<th>Time</th>" +
        "<th>Boat Type</th>" +
        "<th>Delete</th>" +
        "</tr>";

    return theadEl;
}

function createTableBody(activities) {
    const tbodyEl = document.createElement('tbody');

    if (activities) {
        activities.forEach((activity) => {
            tbodyEl.appendChild(createRowForActivity(activity));
        });
    }

    return tbodyEl;
}

function createRowForActivity(activity) {
    const NUM_COLS = 6;
    const trEl = document.createElement('tr');
    const cols = new Array(NUM_COLS);

    for (let i = 0; i < cols.length; i++) {
        cols[i] = document.createElement('td');
        trEl.appendChild(cols[i]);
    }

    cols[0].appendChild(createEditButton(`update/edit_activity.html?id=${activity.id}`));
    cols[1].innerHTML = activity.id;
    cols[2].innerHTML = activity.activityName;
    cols[3].innerHTML = `${timeToString(activity.startTime)}-${timeToString(activity.endTime)}`;
    cols[4].innerHTML = getReadableEnum(activity.boatType);
    cols[5].appendChild(createDelButtonForActivity(activity));

    return trEl;
}

function createDelButtonForActivity(activity) {
    return createDelButton(DELETE_ACTIVITY_URL,
        activity.id,
        activity.activityName,
        fetchActivities);
}

window.addEventListener('load', () => {
    fetchActivities();
});