function getFormParams(form) {
    const data = new URLSearchParams();

    for (const pair of new FormData(form)) {
        data.append(pair[0], pair[1]);
    }

    return data;
}

function createOption(optionText, optionValue) {
    const optionEl = document.createElement('option');
    optionEl.text = optionText;
    optionEl.value = optionValue;
    return optionEl;
}

function createInput(inputFieldId, inputFieldName, inputType, required, pattern) {
    const inputEl = document.createElement("input");
    inputEl.setAttribute('type', inputType);
    inputEl.setAttribute('id', inputFieldId);
    inputEl.setAttribute('class', 'form-control');
    inputEl.setAttribute('name', inputFieldName);

    if (required === 'true') {
        inputEl.required = true;
    }

    if (pattern) {
        inputEl.setAttribute('pattern', pattern);
    }

    return inputEl;
}

function dateTimeToString(jsonDate) {
    let dateStr = null;

    if (jsonDate) {
        const truncDateStr = dateToString(jsonDate.date);
        const truncTimeStr = timeToString(jsonDate.time);

        dateStr = `${truncDateStr} ${truncTimeStr}`;
    }

    return dateStr;
}

function dateToString(jsonDate) {
    let dateStr = null;

    if (jsonDate) {
        const day = jsonDate.day.toString().padStart(2, '0');
        const month = jsonDate.month.toString().padStart(2, '0');
        const year = jsonDate.year;

        dateStr = `${day}/${month}/${year}`;
    }

    return dateStr;
}

function timeToString(jsonTime) {
    let timeStr = null;

    if (jsonTime) {
        const hour = jsonTime.hour.toString().padStart(2, '0');
        const minute = jsonTime.minute.toString().padStart(2, '0');
        const second = jsonTime.second.toString().padStart(2, '0');

        timeStr = `${hour}:${minute}`;
    }

    return timeStr;
}

function displayResponse(msgContainerEl, responseText, successText) {
    if (responseText === 'OK') {
        msgContainerEl.classList.remove('alert-danger');
        msgContainerEl.classList.remove('alert-light');
        msgContainerEl.classList.remove('alert-info');
        msgContainerEl.classList.add('alert-success');
        responseText = successText;
    } else {
        msgContainerEl.classList.remove('alert-success');
        msgContainerEl.classList.remove('alert-light');
        msgContainerEl.classList.remove('alert-info');
        msgContainerEl.classList.add('alert-danger');
    }

    msgContainerEl.innerHTML = responseText;
}

function isNaturalNumber(n) {
    let isOkay = true;
    if (n) {
        n = n.toString(); // force the value in case it is not
        const n1 = Math.abs(n),
            n2 = parseInt(n, 10);
        isOkay = !isNaN(n1) && n2 === n1 && n1.toString() === n;
    }
    return isOkay; //Default if n is empty
}

function getUrlParameter(paramName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(paramName);
}

function replaceElementWithClone(element) {
    const cloneEl = element.cloneNode(true);
    element.parentNode.replaceChild(cloneEl, element);
    return cloneEl;
}

function getReadableEnum(enumValue) {
    if (!enumValue) {
        return null;
    }

    return enumValue
        .toLowerCase()
        .split('_')
        .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
}

function changeAlertClass(msgEl, newClass) {
    msgEl.classList.remove('alert-danger');
    msgEl.classList.remove('alert-success');
    msgEl.classList.remove('alert-info');
    msgEl.classList.remove('alert-light');
    msgEl.classList.add(newClass);
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function clearSelectItems(selectEl) {
    selectEl.querySelectorAll('option').forEach(option => {
        selectEl.removeChild(option);
    });
}

function epochToReadableDate(epoch) {
    return new Date(epoch * 1000).toLocaleString();
}

function appendToParams(params, tag, value) {
    if (value) {
        params += ((params) ? `&` : `?`);
        params += `${tag}=${value}`;
    }
    return params;
}