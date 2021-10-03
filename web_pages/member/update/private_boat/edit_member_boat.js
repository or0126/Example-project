function init(){
    populateBoatsInList(document.getElementById('inputField')).then(() => {
        new MultipleSelect('#inputField', {
            placeholder: 'Select Boat'
        });
    });
}

window.addEventListener('load', function (event) {
    onMemberLoad(UPDATE_TYPE_PRIVATE_BOAT, null, init);
});