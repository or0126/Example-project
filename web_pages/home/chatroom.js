let currentUser = null;
let chatVersion = 0;
const refreshRate = 2000; //milliseconds
const USER_LIST_URL = buildUrlWithContextPath('users');
const CHAT_LIST_URL = buildUrlWithContextPath('chat');
const SEND_MESSAGE_URL = buildUrlWithContextPath('sendMessage');

let colors = ["#ff0000", "#4b0082", "#000000","#ff00ff",
    "#a9a9a9", "#006400", "#8b008b", "#556b2f",
    "#ff8c00", "#8b0000","#000000", "#008b8b",
    "#00008b", "#a52a2a", "#e9967a", "#800080",
    "#008000", "#ff00ff", "#800000", "#0000ff",
    "#808000", "#ffa500", "#800080", "#000080"];

let availableColors = [];
let userToColor = new Map();

function getUserColor(userId) {
    let color = null;

    if (userToColor.has(userId)) {
        color = userToColor.get(userId);
    } else {
        if (availableColors.length === 0) {
            availableColors = [...colors];
        }
        color = availableColors[availableColors.length - 1];
        availableColors.splice(availableColors.length - 1, 1);
        userToColor.set(userId, color);
    }
    return color;
}

/* ******************************************
    DOM manipulation methods
   ****************************************** */
function createUserElement(user) {
    const listItemEl = document.createElement('li');
    listItemEl.innerText = `${user.name} (${user.id})`;
    return listItemEl;
}

// if users === undefined then it will have the default value of an empty array
function refreshUsersList(users = []) {
    const usersListEl = document.querySelector('#usersList');

    //clear all current users elements
    usersListEl.innerHTML = '';

    // rebuild the list of users: scan all users and add them to the list of users
    users.forEach((user, index) => {
        console.log("Adding user #" + index + ": " + user.name);
        usersListEl.append(createUserElement(user));
    });
}

//entries = the added chat strings represented as a single string
function appendToMessageHistory(entries = []) {
    entries.forEach(appendMessageEntry);
}

function appendMessageEntry(messageEntry, index) {
    const messageHistoryEl = document.querySelector('#msgBuffer');

    messageHistoryEl.append(createMessageEntryElement(messageEntry));
}

function createMessageEntryElement(messageEntry) {
    let element = null;

    if (currentUser === messageEntry.user.id) {
        element = createMessageSentElement(messageEntry);
    } else {
        element = createMessageReceivedElement(messageEntry);
    }

    return element;
}

function createMessageSentElement(messageEntry) {
    const outgoingMessageEl = document.createElement('div');
    outgoingMessageEl.classList.add('outgoing_msg');

    const sentMessageEl = document.createElement('div');
    sentMessageEl.classList.add('sent_msg');

    outgoingMessageEl.appendChild(sentMessageEl);
    attachMessageEntrySent(messageEntry, sentMessageEl);

    return outgoingMessageEl;
}

function createMessageReceivedElement(messageEntry) {
    const incomingMessageEl = document.createElement('div');
    incomingMessageEl.classList.add('incoming_msg');

    const receivedMessageEl = document.createElement('div');
    receivedMessageEl.classList.add('received_msg');

    const receivedWithMessageEl = document.createElement('div');
    receivedWithMessageEl.classList.add('received_withd_msg');

    incomingMessageEl.appendChild(receivedMessageEl);
    receivedMessageEl.appendChild(receivedWithMessageEl);
    attachMessageEntryReceived(messageEntry, receivedWithMessageEl);

    return incomingMessageEl;
}

function attachMessageEntrySent(messageEntry, messageDiv) {
    messageEntry.message = messageEntry.message.replace(":)", "<img class='smiley-image' src='../../common/assets/img/icons/smiley.png'/>");

    const textEl = document.createElement('p');
    textEl.innerHTML = `${messageEntry.user.name} (${messageEntry.user.id}): ${messageEntry.message}`;

    const timeEl = document.createElement('span');
    timeEl.classList.add('time_date_sent');
    timeEl.innerHTML = epochToReadableDate(messageEntry.timestamp / 1000);

    messageDiv.appendChild(textEl);
    messageDiv.appendChild(timeEl);
}

function attachMessageEntryReceived(messageEntry, messageDiv) {
    messageEntry.message = messageEntry.message.replace(":)", "<img class='smiley-image' src='../../common/assets/img/icons/smiley.png'/>");

    const textEl = document.createElement('p');
    textEl.innerHTML = `${messageEntry.user.name} (${messageEntry.user.id}): ${messageEntry.message}`;

    textEl.setAttribute('style', `color: ${getUserColor(messageEntry.user.id)}`);

    const timeEl = document.createElement('span');
    timeEl.classList.add('time_date_received');
    timeEl.innerHTML = epochToReadableDate(messageEntry.timestamp / 1000);

    messageDiv.appendChild(textEl);
    messageDiv.appendChild(timeEl);
}

/* ******************************************
    Fetch / Ajax / JSON methods
   ****************************************** */
async function fetchUsersListAsync() {
    const response = await fetch(USER_LIST_URL);
    const users = await response.json();
    refreshUsersList(users);
}

//call the server and get the chat version
//we also send it the current chat version so in case there was a change
async function getUserLazy() {
    if (currentUser === null) {
        const user = await getUser();
        currentUser = (user != null) ? user.id : null;
    }
}

//in the chat content, we will get the new string as well
async function fetchChatContentAsync() {
    await getUserLazy();

    try {
        const data = new URLSearchParams();
        data.append('chatVersion', chatVersion);

        const response = await fetch(CHAT_LIST_URL, {
            method: 'post',
            body: data
        });

        const chatData = await response.json();
        if (!chatData) return;

        console.log("Server chat version: " + chatData.version + ", Client chat version: " + chatVersion);
        if (chatData.version !== chatVersion) {
            chatVersion = chatData.version;
            appendToMessageHistory(chatData.entries);
        }
    } finally {
        triggerTimeoutRefreshChat();
    }
}

async function sendMessage() {
    const chatFormEl = document.getElementById('chatForm');

    const data = getFormParams(chatFormEl);

    await fetch(SEND_MESSAGE_URL, {
        method: 'post',
        body: data
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    sendMessage().then(() => {
        document.getElementById('userString').value = '';
    });
}

function setupEventHandlers() {
    const chatFormEl = document.forms.namedItem('chatForm');
    chatFormEl.addEventListener('submit', handleFormSubmit);
}

function triggerTimeoutRefreshChat() {
    setTimeout(fetchChatContentAsync, refreshRate);
}

//activate the timer calls after the page is loaded
window.addEventListener('load', () => {
    setupEventHandlers();

    //The users list is refreshed automatically every 2 seconds
    setInterval(fetchUsersListAsync, refreshRate);

    //The chat content is refreshed only once (using a timeout) but
    //on each call it triggers another execution of itself later (1 second later)
    fetchChatContentAsync();
});