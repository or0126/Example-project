function init() {
    new MultipleSelect('#inputField', {
        placeholder: 'Select Boat Type'
    });
}

window.addEventListener('load', function (event) {
    onActivityLoad(UPDATE_ACTIVITY_BOAT_TYPE, null, init);
});