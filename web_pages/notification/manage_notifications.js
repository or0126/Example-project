const FIND_MANUAL_NOTIFICATIONS_URL = buildUrlWithContextPath("findManualNotifications");
const DELETE_NOTIFICATION_URL = buildUrlWithContextPath("deleteNotification");

let multiSelectMember = null;

async function populateMembers() {
    const memberParamEl = document.getElementById('notificationUserId');
    await populateMembersInList(memberParamEl);
    multiSelectMember = initMultiSelect('notificationUserId', 'Select User');
}

function fetchNotifications() {
    const userId = document.getElementById('notificationUserId').value;
    const date = document.getElementById('notificationDate').value;

    let params = '';
    params = appendToParams(params, 'notificationUserId', userId);
    params = appendToParams(params, 'notificationDate', date);

    const url = FIND_MANUAL_NOTIFICATIONS_URL + params;
    fetchDataToTable(url, createTableHeader, createTableBody);
}

function createTableHeader() {
    const theadEl = document.createElement('thead');

    theadEl.innerHTML = "<tr>" +
        "<th>View</th>" +
        "<th>ID</th>" +
        "<th>Title</th>" +
        "<th>Date</th>" +
        "<th>User</th>" +
        "<th>Delete</th>" +
        "</tr>";

    return theadEl;
}

async function createTableBody(notifications) {
    const tbodyEl = document.createElement('tbody');
    if (notifications) {
        for (let i = 0; i < notifications.length; i++) {
            const trEl = await createRowForNotification(notifications[i]);
            tbodyEl.appendChild(trEl);
        }
    }

    return tbodyEl;
}

async function createRowForNotification(notification) {
    const NUM_COLS = 6;
    const trEl = document.createElement('tr');
    const cols = new Array(NUM_COLS);

    for (let i = 0; i < cols.length; i++) {
        cols[i] = document.createElement('td');
        trEl.appendChild(cols[i]);
    }

    const notificationUser = await getAnyMember(notification.userId);

    cols[0].appendChild(createViewButton(`show_notification.html?id=${notification.id}`));
    cols[1].innerHTML = notification.id;
    cols[2].innerHTML = notification.title;
    cols[3].innerHTML = dateTimeToString(notification.dateTime);
    cols[4].innerHTML = `${notificationUser.name} (id ${notificationUser.id})`;
    cols[5].appendChild(createDelButtonForNotification(notification));

    return trEl;
}

function createDelButtonForNotification(notification) {
    return createDelButton(DELETE_NOTIFICATION_URL,
        notification.id,
        `${notification.title}`,
        fetchNotifications);
}

window.addEventListener('load', () => {
    populateMembers().then(() => {
        fetchNotifications();
    });

    const searchButtonEl = document.getElementById('searchBtn');
    searchButtonEl.addEventListener('click', function (event) {
        fetchNotifications();
    });
});