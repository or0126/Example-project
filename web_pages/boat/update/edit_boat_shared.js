//UPDATE TYPE
const UPDATE_BOAT_NAME = 'NAME';
const UPDATE_BOAT_TYPE = 'BOAT_TYPE';
const UPDATE_BOAT_WIDE = 'WIDE';
const UPDATE_BOAT_COASTAL = 'COASTAL';
const UPDATE_BOAT_DISABLED = 'DISABLED';

//PATTERN
const BOAT_PATTERN = '$BOAT';

//URL
const UPDATE_BOAT_URL = buildUrlWithContextPath('updateBoat');

function onBoatLoad(updateType, validationFunc, initFunc) {
    const boatId = getUrlParameter('boatId');
    const boatName = getUrlParameter('displayName')

    setHeaderByPattern(BOAT_PATTERN, boatId, boatName);

    if (initFunc) initFunc();

    const formEl = document.getElementById('updateDataForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();

        let errorMessage = null;
        if (validationFunc) errorMessage = validationFunc();

        if (!errorMessage) {
            submitData(UPDATE_BOAT_URL, updateType, boatId);
        } else {
            displayError(errorMessage);
        }
    });
}