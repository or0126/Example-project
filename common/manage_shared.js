const ASSIGNMENT_REDIRECT_URL = '../assignment/manage_assignments.html';
const REQUEST_REDIRECT_URL = '../request/manage_requests.html';

async function fetchDataToTable(url, createTableHeaderFunc, createTableBodyFunc) {
    const response = await fetch(url);
    const requests = await response.json();
    const tableDiv = document.getElementById('tableDiv');

    clearTable(tableDiv);
    const tableEl = document.createElement('table');
    tableEl.setAttribute('id', 'dataTable');
    tableEl.setAttribute('class', 'table table-bordered table-hover');

    tableEl.appendChild(createTableHeaderFunc());
    tableEl.appendChild(await createTableBodyFunc(requests));

    tableDiv.appendChild(tableEl);
}

async function doDelete(url, id, name, fetchFunc, validationFunc) {
    if (validationFunc && !(await validationFunc(id))) return;

    const data = new URLSearchParams();
    data.append('id', id);

    const response = await fetch(url, {
        method: "POST",
        body: data
    });

    const responseText = await response.text();

    if (responseText === 'OK') {
        fetchFunc();
        closeModal(document.getElementById('confirmationMdl'));
    } else {
        displayError(responseText);
    }
}

function createViewButton(url) {
    const viewButton = document.createElement('button');

    viewButton.setAttribute('type', 'button');
    viewButton.setAttribute('class', 'btn btn-primary');
    viewButton.innerHTML = 'View';
    viewButton.addEventListener('click', () => {
        window.open(url, '_self');
    });

    return viewButton;
}

function createEditButton(url) {
    const editButton = document.createElement('button');

    editButton.setAttribute('type', 'button');
    editButton.setAttribute('class', 'btn btn-primary');
    editButton.innerHTML = 'View/Edit';
    editButton.addEventListener('click', () => {
        window.open(url, '_self');
    });

    return editButton;
}

function createDelButton(url, id, name, fetchFunc, validationFunc, assignUrl, requestUrl) {
    const delButtonEl = document.createElement('button');

    delButtonEl.setAttribute('type', 'button');
    delButtonEl.setAttribute('class', 'btn btn-primary');
    delButtonEl.innerHTML = 'Delete';
    delButtonEl.setAttribute('data-toggle', 'modal');
    delButtonEl.setAttribute('data-target', '#confirmationMdl');

    delButtonEl.addEventListener('click', () => {
        openDeleteModal(url, id, name, fetchFunc, validationFunc, assignUrl, requestUrl);
    });

    return delButtonEl;
}

function openDeleteModal(url, id, name, fetchFunc, validationFunc, assignUrl, requestUrl) {
    const modal = getModalInstance(document.getElementById('confirmationMdl'));

    hideError();

    const urlEl = document.getElementById('assignUrl');
    if (urlEl) {
        urlEl.setAttribute('href', assignUrl);
    }

    const requestUrlEl = document.getElementById('requestUrl');
    if (requestUrlEl) {
        requestUrlEl.setAttribute('href', requestUrl);
    }

    const saveButton = replaceElementWithClone(document.getElementById('okBtn'));
    saveButton.addEventListener('click', function (event) {
        doDelete(url, id, name, fetchFunc, validationFunc);
    });
    modal.show();
}

function clearTable(tableDiv) {
    const tableEl = document.getElementById('dataTable');
    if (tableEl) {
        tableDiv.removeChild(tableEl);
    }
}