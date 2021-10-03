function initMultiSelect(elementId, placeHolder) {
    return new MultipleSelect(`#${elementId}`, {
        placeholder: `${placeHolder}`
    });
}

function enableMultiSelect(multiSelect) {
    if (multiSelect) {
        multiSelect.$el.querySelector('button').disabled = false;
    }
}

function disableMultiSelect(multiSelect) {
    if (multiSelect) {
        multiSelect.$el.querySelector('button').disabled = true;
    }
}

function destroyMultiSelect(multiSelect) {
    if (multiSelect) {
        multiSelect.$el.parentNode.removeChild(multiSelect.$el);
    }
}

function getMultiSelectValues(element) {
    return Array.from(element.selectedOptions)
        .map(boatType => boatType.value)
        .join(',');
}

function setMultiSelectValue(multiSelect, value) {
    multiSelect.$container.$dropdownSelect.$ulElement
        .querySelectorAll('li')
        .forEach((liEl) => {
            if (liEl.getAttribute('value') === value &&
                !liEl.classList.contains('list-group-item-primary')) {
                liEl.click();
            }
        });
}

function clearMultiSelectValues(multiSelect) {
    if (!multiSelect) return;

    multiSelect.$container.$dropdownSelect.$ulElement
        .querySelectorAll('li')
        .forEach((liEl) => {
            if (liEl.classList.contains('list-group-item-primary')) {
                liEl.click();
            }
        });
}