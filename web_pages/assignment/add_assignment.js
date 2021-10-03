const ADD_ASSIGNMENT_URL = buildUrlWithContextPath("addAssignment");
const PERFECT_BOAT_URL = buildUrlWithContextPath("perfectBoat");
let multiSelectRequest = null;
let multiSelectBoats = null;

async function addAssignment() {
    const formEl = document.querySelector('#addAssignmentForm');
    const formData = getFormParams(formEl);

    const response = await fetch(ADD_ASSIGNMENT_URL, {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();

    handleResponse(responseText);
}


function handleFormSubmit(event) {
    event.preventDefault();
    addAssignment();
}

function handleResponse(responseText) {
    const msgEl = document.querySelector('#error');
    const requestEl = document.querySelector('#requestId');
    const boatEl = document.querySelector('#boatId');
    const successText = `Successfully assigned request ${requestEl.value} with boat ${boatEl.value}`;

    if (responseText === 'OK') {
        resetPage();
    }
    displayResponse(msgEl, responseText, successText);
}

function showRequestAdditionalData() {
    const requestEl = document.querySelector('#requestId');

    const url = `${GET_REQUEST_URL}?id=${requestEl.value}`;
    fetchDataToTable(url, createTableHeader, createTableBody);
}

function createTableHeader() {
    const theadEl = document.createElement('thead');

    theadEl.innerHTML = '<tr>' +
        '<th style="width: 34%">Description</th>' +
        '<th style="width: 66%">Value</th>' +
        '</tr>';

    return theadEl;
}

function createTableBody(request) {
    const tbodyEl = document.createElement('tbody');

    if (request) {
        tbodyEl.appendChild(createBoatTypesRow(request));
        tbodyEl.appendChild(createOtherMembersRow(request));
        tbodyEl.appendChild(createCoxswainRow(request));
    }

    return tbodyEl;
}

function createBoatTypesRow(request){
    const trEl = document.createElement('tr');
    const DescTdEl = document.createElement('td');
    DescTdEl.innerHTML = 'Boat Types';
    const valueTdEl = document.createElement('td');

    if (request.boatTypeList){
        request.boatTypeList.forEach((boatType)=>{
            if (valueTdEl.innerText !== ''){
                valueTdEl.innerHTML += ', ';
            }

            valueTdEl.innerHTML += `${getReadableEnum(boatType)}`;
        });
    }

    trEl.appendChild(DescTdEl);
    trEl.appendChild(valueTdEl);

    return trEl;
}

function createCoxswainRow(request){
    const trEl = document.createElement('tr');
    const DescTdEl = document.createElement('td');
    DescTdEl.innerHTML = 'Coxswain';
    const valueTdEl = document.createElement('td');

    if (request.coxswain){
        valueTdEl.innerHTML = `${request.coxswain.name} (id ${request.coxswain.id})`;
    }

    trEl.appendChild(DescTdEl);
    trEl.appendChild(valueTdEl);

    return trEl;
}

function createOtherMembersRow(request){
    const trEl = document.createElement('tr');
    const descTdEl = document.createElement('td');
    descTdEl.innerHTML = 'Additional Members';
    descTdEl.style.width = '34%';
    const valueTdEl = document.createElement('td');
    valueTdEl.style.width = '66%';

    if (request.additionalMembers){
        request.additionalMembers.forEach((member)=>{
            if (valueTdEl.innerText !== ''){
                valueTdEl.innerHTML += ', ';
            }

            valueTdEl.innerHTML += `${member.name} (id ${member.id})`;
        });
    }

    trEl.appendChild(descTdEl);
    trEl.appendChild(valueTdEl);

    return trEl;
}

function setupEventHandlers() {
    const addAssignmentFormEl = document.querySelector('#addAssignmentForm');
    addAssignmentFormEl.addEventListener('submit', handleFormSubmit);

    const transferBtnEl = document.getElementById('transferMembersBtn');
    transferBtnEl.addEventListener('click', function (event) {
        const requestIdEl = document.getElementById('requestId');
        window.open(`../request/transfer_members.html?destRequest=${requestIdEl.value}`, 'transferWindow');
    });

    const perfectBoatBtnEl = document.getElementById('perfectBoatBtn');
    perfectBoatBtnEl.addEventListener('click', function (event) {
        perfectBoatSuggest();
    });

    const requestListEl = document.getElementById('requestId');
    requestListEl.addEventListener('change', function (event) {
        showRequestAdditionalData();
    });
}

async function perfectBoatSuggest() {
    const formEl = document.querySelector('#addAssignmentForm');
    const formData = getFormParams(formEl);

    const response = await fetch(PERFECT_BOAT_URL, {
        method: 'POST',
        body: formData
    });

    const responseBoat = await response.json();
    handlePerfectBoatResponse(responseBoat);
}

function handlePerfectBoatResponse(responseBoat) {
    const msgEl = document.querySelector('#error');
    if (responseBoat == null) {
        const statusText = 'No perfect boat found.'
        const successText = ``;
        displayResponse(msgEl, statusText, successText);
    } else {
        const statusText = 'OK'
        const successText = `Boat ${responseBoat.name} id: ${responseBoat.id} is the perfect boat`;
        displayResponse(msgEl, statusText, successText);
    }
}

function resetPage() {
    clearMultiSelectValues(multiSelectBoats);
    refreshRequestList();
}

async function returnFromTransfer(){
    const requestId = document.getElementById('requestId').value;
    await refreshRequestList();
    setMultiSelectValue(multiSelectRequest, requestId);
}

async function refreshRequestList(){
    const requestEl = document.getElementById('requestId');
    destroyMultiSelect(multiSelectRequest);
    clearSelectItems(requestEl);
    await populateRequestsInList(requestEl, false);
    multiSelectRequest = initMultiSelect('requestId', 'Select Request');
    showRequestAdditionalData();
}

async function populateRequests() {
    const requestEl = document.getElementById('requestId');
    await populateRequestsInList(requestEl, false);
    multiSelectRequest = initMultiSelect('requestId', 'Select Request');
}

async function populateBoats() {
    const boatEl = document.getElementById('boatId');
    await populateBoatsInList(boatEl, false, false);
    multiSelectBoats = initMultiSelect('boatId', 'Select Boat');
}

window.addEventListener('load', () => {
    populateBoats();
    populateRequests().then(()=>{
        showRequestAdditionalData();
    });
    setupEventHandlers();
});