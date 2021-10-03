async function init() {
    let multiSelectBoatTypes = initMultiSelect('inputField', 'Select Boat Type');

    const requestDTO = await getRequest(getUrlParameter('id'));
    requestDTO.boatTypeList.forEach((boatType) => {
        setMultiSelectValue(multiSelectBoatTypes, boatType);
    });
}

function getSelectedBoatTypes() {
    const boatTypesEl = document.getElementById('inputField');
    const selectedBoatTypes = getMultiSelectValues(boatTypesEl);
    return [{name: 'boatTypes', value: selectedBoatTypes}];
}

window.addEventListener('load', function (event) {
    onRequestLoad(UPDATE_REQUEST_BOAT_TYPES, null, init, getSelectedBoatTypes);
});