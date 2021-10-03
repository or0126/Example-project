function init() {
    new MultipleSelect('#inputField', {
        placeholder: 'Select Boat Type'
    });
}

window.addEventListener('load', function (event) {
    onBoatLoad(UPDATE_BOAT_TYPE, null, init);
});