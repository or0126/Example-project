//UPDATE TYPE
const UPDATE_REQUEST_MAIN_MEMBER = 'MAIN_MEMBER';
const UPDATE_REQUEST_DATE = 'REQUESTED_DATE';
const UPDATE_REQUEST_BOAT_TYPES = 'BOAT_TYPES';
const UPDATE_REQUEST_TIME = 'REQUEST_TIMES';
const UPDATE_REQUEST_MEMBERS = 'ADDITIONAL_MEMBERS';
const UPDATE_REQUEST_COXSWAIN = 'COXSWAIN';

//PATTERN
const REQUEST_PATTERN = '$REQUEST';

//URL
const UPDATE_REQUEST_URL = buildUrlWithContextPath('updateRequest');

async function onRequestLoad(updateType, validationFunc, initFunc, additionalParamFunc) {
    const requestDTO = await getRequest(getUrlParameter("id"), false);
    const requestId = requestDTO.id;
    const requestDesc = `${requestDTO.mainMember.name}'s Request`;

    setHeaderByPattern(REQUEST_PATTERN, requestId, requestDesc);

    if (initFunc) initFunc();

    const formEl = document.getElementById('updateDataForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();

        let errorMessage = null;
        if (validationFunc) errorMessage = validationFunc();

        if (!errorMessage) {
            const additionalParams = additionalParamFunc ? additionalParamFunc() : null;
            submitData(UPDATE_REQUEST_URL, updateType, requestId, additionalParams);
        } else {
            displayError(errorMessage);
        }
    });
}