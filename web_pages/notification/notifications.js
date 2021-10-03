const GET_NOTIFICATIONS_URL = buildUrlWithContextPath('getNotifications');
const MANAGE_ASSIGNMENTS_URL = buildUrlWithContextPath('web_pages/assignment/manage_assignments.html');
const MANAGE_REQUESTS_URL = buildUrlWithContextPath('web_pages/request/manage_requests.html');
const SHOW_NOTIFICATION_URL = buildUrlWithContextPath('web_pages/notification/show_notification.html');
const INDEX_PAGE_URL = buildUrlWithContextPath('index.html');
const ACTION_ADD_ASSIGNMENT = 'ADD_ASSIGNMENT';

async function pullNotifications() {
    const notifications = await getNotifications();
    const notificationsEl = document.getElementById('notifications');
    let countUnread = 0;

    removeChildren(notificationsEl);

    notifications.forEach((notification) => {
        const liEl = createSingleNotificationElement(notification);
        notificationsEl.appendChild(liEl);
        countUnread += (notification.isRead) ? 0 : 1;
    });

    document.getElementById('notificationCount').innerText = countUnread;
    displayBellIcon(notifications, countUnread);
}

async function getNotifications() {
    const response = await fetch(`${GET_NOTIFICATIONS_URL}`);
    return await response.json();
}

function removeChildren(domEl) {
    while (domEl.firstChild) {
        domEl.firstChild.remove();
    }
}

function createSingleNotificationElement(notification) {
    const liEl = document.createElement('li');

    if (!notification.isRead){
        liEl.classList.add('unreadNotification');
    }

    const aEl = document.createElement('a');
    aEl.classList.add('dropdown-item');
    aEl.innerHTML = notification.title + `<br\>` + dateTimeToString(notification.dateTime);
    aEl.setAttribute('href', getNotificationUrl(notification));

    liEl.appendChild(aEl);
    return liEl;
}

function getNotificationUrl(notification) {
    let url = '';

    if (notification.isAutomatic) {
        if (notification.action === ACTION_ADD_ASSIGNMENT) {
            url = `${MANAGE_ASSIGNMENTS_URL}?requestId=${notification.requestId}`;
        } else {
            url = `${MANAGE_REQUESTS_URL}?requestId=${notification.requestId}&includeApproved=true`;
        }
    } else {
        url = `${SHOW_NOTIFICATION_URL}?id=${notification.id}`;
    }

    return url;
}

function displayBellIcon(notifications, numOfUnreadNotification) {
    const bellEl = document.getElementById('notificationBell');

    if (numOfUnreadNotification > 0) {
        bellEl.classList.remove('bi-bell');
        bellEl.classList.add('bi-bell-fill');
    } else {
        bellEl.classList.remove('bi-bell-fill');
        bellEl.classList.add('bi-bell');
    }
}

async function checkUserLoggedIn(){
    const user = await getUser();

    if (!user){
        window.location.href = INDEX_PAGE_URL;
    }
}

window.addEventListener('load', () => {
    setInterval(pullNotifications, 10000);
    setInterval(checkUserLoggedIn, 5000);
});