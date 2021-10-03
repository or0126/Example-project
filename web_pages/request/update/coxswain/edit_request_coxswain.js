async function init(){
    const coxswainEl = document.getElementById('inputField');
    await populateMembersInList(coxswainEl);
    initMultiSelect('inputField', 'Select Coxswain');
}

window.addEventListener('load', function (event) {
    onRequestLoad(UPDATE_REQUEST_COXSWAIN, null, init);
});