async function init(){
    const mainMemberEl = document.getElementById('inputField');
    await populateMembersInList(mainMemberEl);
    initMultiSelect('inputField', 'Select Main Member');
}

window.addEventListener('load', function (event) {
    onRequestLoad(UPDATE_REQUEST_MAIN_MEMBER, null, init);
});