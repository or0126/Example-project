//UPDATE TYPE
const UPDATE_TYPE_NAME = 'NAME';
const UPDATE_TYPE_PHONE = 'PHONE';
const UPDATE_TYPE_MEMBER_TYPE = 'MEMBER_TYPE';
const UPDATE_TYPE_EMAIL = 'EMAIL';
const UPDATE_TYPE_PASSWORD = 'PASSWORD';
const UPDATE_TYPE_AGE = 'AGE';
const UPDATE_TYPE_PRIVATE_BOAT = 'PRIVATE_BOAT';
const UPDATE_TYPE_EXPERIENCE = 'EXPERIENCE';
const UPDATE_TYPE_COMMENTS = 'COMMENTS';
const UPDATE_TYPE_EXPIRATION = 'EXPIRATION_DATE';

//PATTERN
const MEMBER_PATTERN = '$MEMBER';

//URL
const UPDATE_MEMBER_URL = buildUrlWithContextPath("updateMember");

async function onMemberLoad(updateType, validationFunc, initFunc) {
    const memberDTO = await getUser(getUrlParameter("chosenMember"));
    const memberId = memberDTO.id;
    const memberName = memberDTO.name;

    setHeaderByPattern(MEMBER_PATTERN, memberId, memberName);

    if (initFunc) initFunc();

    const formEl = document.getElementById('updateDataForm');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();

        let errorMessage = null;
        if (validationFunc) errorMessage = validationFunc();

        if (!errorMessage) {
            submitData(UPDATE_MEMBER_URL, updateType, memberId);
        } else {
            displayError(errorMessage);
        }
    });
}