//UPDATE TYPE
const UPDATE_ACTIVITY_NAME = 'NAME';
const UPDATE_ACTIVITY_TIMES = 'TIMES';
const UPDATE_ACTIVITY_BOAT_TYPE = 'BOAT_TYPE';

//PATTERN
const ACTIVITY_PATTERN = '$ACTIVITY';

//URL
const UPDATE_ACTIVITY_URL = buildUrlWithContextPath('updateActivity');

async function onActivityLoad(updateType, validationFunc, initFunc) {
    const id = getUrlParameter('id');
    const name = await getActivityDesc(id);

    setHeaderByPattern(ACTIVITY_PATTERN, id, name);

    if (initFunc) initFunc();

    const formEl = document.getElementById('updateDataForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();

        let errorMessage = null;
        if (validationFunc) errorMessage = validationFunc();

        if (!errorMessage) {
            submitData(UPDATE_ACTIVITY_URL, updateType, id);
        } else {
            displayError(errorMessage);
        }
    });
}

async function getActivityDesc(id){
   const activityDTO = await getActivity(id);
   return activityDTO.activityName;
}